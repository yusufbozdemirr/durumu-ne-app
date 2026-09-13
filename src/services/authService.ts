import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';
import { ADMIN_UID, ADMIN_EMAILS, isSystemAdmin } from '../utils/constants';

export const authService = {
  /**
   * Central ADMIN_UID reference
   */
  ADMIN_UID,
  ADMIN_EMAILS,

  /**
   * Check if given UID is the system Admin
   */
  isAdmin(user: { uid?: string; email?: string | null } | null): boolean {
    if (!user) return false;
    return isSystemAdmin(user.uid, user.email);
  },

  isAdminUid(uid: string): boolean {
    return isSystemAdmin(uid);
  },

  /**
   * Subscribe to Firebase Auth state
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Fetch custom UserProfile document from users/{uid}
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);

      const currentUser = auth.currentUser;
      const isAdminUser = isSystemAdmin(uid, currentUser?.email);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const role = isAdminUser ? 'admin' : (data.role as 'admin' | 'owner') || 'owner';
        return {
          uid: data.uid || uid,
          email: data.email || currentUser?.email || '',
          name: data.name || (isAdminUser ? 'Sistem Yöneticisi' : ''),
          businessId: isAdminUser ? 'admin' : (data.businessId || ''),
          role: role,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || new Date().toISOString(),
        };
      }

      // If user is Admin and document is not yet in users collection
      if (isAdminUser) {
        return {
          uid: uid,
          email: currentUser?.email || '',
          name: 'Sistem Yöneticisi',
          businessId: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Firebase error fetching user profile:', error);
      return null;
    }
  },

  /**
   * Sign in with email and password, setting persistence based on rememberMe
   */
  async login(email: string, pass: string, rememberMe: boolean = true): Promise<UserProfile> {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    } catch (persistErr) {
      console.warn('Firebase setPersistence error:', persistErr);
    }

    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const uid = cred.user.uid;
    const userEmail = cred.user.email || email.trim();

    // 1. Check if user is System Admin
    if (isSystemAdmin(uid, userEmail)) {
      const userRef = doc(db, 'users', uid);
      let adminProfile: UserProfile;

      try {
        const snapshot = await getDoc(userRef);
        if (!snapshot.exists()) {
          adminProfile = {
            uid: uid,
            email: userEmail,
            name: cred.user.displayName || 'Sistem Yöneticisi',
            businessId: 'admin',
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, {
            ...adminProfile,
            createdAt: serverTimestamp(),
          });
        } else {
          const data = snapshot.data();
          adminProfile = {
            uid: uid,
            email: data.email || userEmail,
            name: data.name || 'Sistem Yöneticisi',
            businessId: 'admin',
            role: 'admin',
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : data.createdAt || new Date().toISOString(),
          };
        }
      } catch (e) {
        console.warn('Could not read or write users doc for admin, continuing with adminProfile in-memory:', e);
        adminProfile = {
          uid: uid,
          email: userEmail,
          name: 'Sistem Yöneticisi',
          businessId: 'admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
      }
      return adminProfile;
    }

    // 2. Normal customer / business owner
    const profile = await this.getUserProfile(uid);

    if (!profile || !profile.businessId) {
      // NEVER create fake/random business or user doc automatically
      console.error('Firebase error: User exists in Auth but has no valid users/{uid} document.', {
        uid,
        email,
      });
      // Sign out immediately to prevent orphaned auth session
      await fbSignOut(auth);
      throw new Error(
        'Hesabınızın işletme kaydı bulunamadı. Lütfen sistem yöneticisiyle iletişime geçin.'
      );
    }

    // Check business approval status
    try {
      const bizRef = doc(db, 'businesses', profile.businessId);
      const bizSnap = await getDoc(bizRef);
      if (bizSnap.exists()) {
        const bizData = bizSnap.data();
        if (
          bizData.onayDurumu === 'bekliyor' ||
          bizData.onayDurumu === 'onay_bekliyor' ||
          bizData.accountStatus === 'pending_approval'
        ) {
          await fbSignOut(auth);
          throw new Error(
            'Deneme sürümü talebiniz incelenmektedir. Müşteri temsilcimiz talebinizi onayladıktan sonra 7 günlük deneme süreniz başlatılacak ve giriş yapabileceksiniz.'
          );
        }
      }
    } catch (bizErr: any) {
      if (bizErr.message?.includes('Deneme sürümü talebiniz')) {
        throw bizErr;
      }
      console.warn('Could not verify business approval status:', bizErr);
    }

    return profile;
  },

  /**
   * Register a new business owner account with a 7-day free trial request (pending admin approval)
   */
  async registerTrial(params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    businessName: string;
    phone?: string;
  }): Promise<UserProfile> {
    const { firstName, lastName, email, password, businessName, phone } = params;

    // 1. Create user in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const uid = cred.user.uid;

    try {
      const generateBusinessId = () => `D-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const businessId = generateBusinessId();
      const now = new Date();
      const talepTarihi = now.toISOString();
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      // 2. Create User Document FIRST
      const userRef = doc(db, 'users', uid);
      const userProfile: UserProfile = {
        uid,
        email: email.trim(),
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: (phone || '').trim(),
        businessId,
        role: 'owner',
        createdAt: talepTarihi,
      };

      await setDoc(userRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
      });

      // 3. Create Business Document in Turkish & English with pending approval status
      const businessRef = doc(db, 'businesses', businessId);
      await setDoc(businessRef, {
        id: businessId,
        name: businessName.trim(),
        phone: (phone || '').trim(),
        address: '',
        ownerUid: uid,
        ownerName: fullName,
        ownerEmail: email.trim(),
        plan: 'trial',
        paketTuru: 'deneme',
        onayDurumu: 'bekliyor',
        accountStatus: 'pending_approval',
        talepTarihi,
        denemeBaslangicTarihi: null,
        denemeBitisTarihi: null,
        trialStartDate: null,
        trialEndDate: null,
        active: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 4. Sign out immediately so user cannot access dashboard until admin approves
      await fbSignOut(auth);

      return userProfile;
    } catch (firestoreError) {
      console.error('Failed to create user or business document in Firestore:', firestoreError);
      // Clean up newly created auth user so an orphaned auth session without a profile is not left behind
      try {
        await cred.user.delete();
      } catch (delErr) {
        console.warn('Could not delete auth user after Firestore error, signing out instead:', delErr);
        await fbSignOut(auth);
      }
      throw firestoreError;
    }
  },

  /**
   * Sign out
   */
  async logout(): Promise<void> {
    await fbSignOut(auth);
  },
};

