import {
  signInWithEmailAndPassword,
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

    return profile;
  },

  /**
   * Sign out
   */
  async logout(): Promise<void> {
    await fbSignOut(auth);
  },
};

