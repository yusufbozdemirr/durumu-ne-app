import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, firebaseConfig } from '../lib/firebase';
import { Business } from '../types';

export interface CreateBusinessInput {
  businessName: string;
  phone: string;
  address: string;
  ownerName: string;
  email: string;
  password: string;
  plan?: 'pro' | 'trial';
  paketTuru?: 'pro' | 'deneme';
  accountStatus?: 'active' | 'trial_expired' | 'suspended' | 'pending_approval';
  endDate?: string;
}

export const adminService = {
  /**
   * Fetch all businesses for the Admin Panel
   */
  async getAllBusinesses(): Promise<Business[]> {
    const colRef = collection(db, 'businesses');
    const snapshot = await getDocs(colRef);

    const list: Business[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      const planVal = data.plan || (data.paketTuru === 'pro' ? 'pro' : 'trial');
      list.push({
        id: d.id,
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        ownerUid: data.ownerUid || '',
        plan: planVal,
        paketTuru: data.paketTuru || (planVal === 'pro' ? 'pro' : 'deneme'),
        onayDurumu: data.onayDurumu || 'onaylandi',
        talepTarihi: data.talepTarihi || null,
        denemeBaslangicTarihi: data.denemeBaslangicTarihi || data.trialStartDate || null,
        denemeBitisTarihi: data.denemeBitisTarihi || data.trialEndDate || null,
        proBaslangicTarihi: data.proBaslangicTarihi || data.proStartDate || null,
        proBitisTarihi: data.proBitisTarihi || data.proEndDate || null,
        trialStartDate: data.trialStartDate || data.denemeBaslangicTarihi || null,
        trialEndDate: data.trialEndDate || data.denemeBitisTarihi || null,
        proStartDate: data.proStartDate || data.proBaslangicTarihi || null,
        proEndDate: data.proEndDate || data.proBitisTarihi || null,
        accountStatus: data.accountStatus || (data.active === false ? 'suspended' : 'active'),
        active: data.active !== false,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt || new Date().toISOString(),
        ownerName: data.ownerName || '',
        ownerEmail: data.ownerEmail || '',
      });
    });

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },

  /**
   * Create a customer business & user account WITHOUT disturbing current admin session.
   * Uses an isolated secondary Firebase App instance.
   * Includes automatic rollback if Firestore write fails, and auto-recovery if email is already in Auth.
   */
  async createBusinessAndOwner(input: CreateBusinessInput): Promise<Business> {
    const tempAppName = `temp-admin-create-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const tempApp = initializeApp(firebaseConfig, tempAppName);
    const tempAuth = getAuth(tempApp);

    let customerUid = '';
    let customerUser: any = null;
    let isReusedAuthUser = false;

    try {
      // 1. Create user in Firebase Auth or recover if stuck from previous failed attempt
      try {
        const cred = await createUserWithEmailAndPassword(
          tempAuth,
          input.email.trim(),
          input.password
        );
        customerUid = cred.user.uid;
        customerUser = cred.user;
      } catch (authErr: any) {
        if (authErr?.code === 'auth/email-already-in-use') {
          // If the email is already in Auth (e.g. from an earlier attempt where Firestore write failed),
          // attempt to sign in with the entered password so we can complete the Firestore records.
          try {
            const loginCred = await signInWithEmailAndPassword(
              tempAuth,
              input.email.trim(),
              input.password
            );
            customerUid = loginCred.user.uid;
            customerUser = loginCred.user;
            isReusedAuthUser = true;
          } catch (loginErr) {
            console.error('Email already in use and password failed to sign in:', loginErr);
            throw new Error(
              'Bu e-posta adresi Firebase Authentication sisteminde zaten kayıtlı. Önceki denemeniz yarım kaldıysa lütfen aynı şifreyi giriniz veya farklı bir e-posta adresi belirleyiniz.'
            );
          }
        } else {
          throw authErr;
        }
      }

      // 2. Generate unique businessId
      const businessId = `biz_${customerUid.substring(0, 8)}_${Date.now().toString(36)}`;
      const nowIso = new Date().toISOString();
      const isProPlan = input.plan === 'pro' || input.paketTuru === 'pro';

      const trialStartDate = !isProPlan ? nowIso : null;
      const trialEndDate = !isProPlan
        ? (input.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        : null;

      const proStartDate = isProPlan ? nowIso : null;
      const proEndDate = isProPlan
        ? (input.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString())
        : null;

      const businessData: Record<string, any> = {
        id: businessId,
        name: input.businessName.trim(),
        phone: input.phone.trim(),
        address: input.address.trim(),
        ownerUid: customerUid,
        plan: isProPlan ? 'pro' : 'trial',
        paketTuru: isProPlan ? 'pro' : 'deneme',
        onayDurumu: 'onaylandi',
        talepTarihi: nowIso,
        accountStatus: 'active',
        active: true,
        ownerName: input.ownerName.trim(),
        ownerEmail: input.email.trim(),
        trialStartDate,
        trialEndDate,
        denemeBaslangicTarihi: trialStartDate,
        denemeBitisTarihi: trialEndDate,
        proStartDate,
        proEndDate,
        proBaslangicTarihi: proStartDate,
        proBitisTarihi: proEndDate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Sanitize undefined fields
      const cleanBusinessData: Record<string, any> = {};
      for (const [k, v] of Object.entries(businessData)) {
        if (v !== undefined) {
          cleanBusinessData[k] = v;
        }
      }

      try {
        // 3. Create businesses/{businessId}
        const businessDocRef = doc(db, 'businesses', businessId);
        await setDoc(businessDocRef, cleanBusinessData);

        // 4. Create users/{customerUid}
        const userDocRef = doc(db, 'users', customerUid);
        await setDoc(userDocRef, {
          uid: customerUid,
          email: input.email.trim(),
          name: input.ownerName.trim(),
          phone: input.phone.trim(),
          businessId: businessId,
          role: 'owner',
          createdAt: serverTimestamp(),
        });

        return {
          id: businessId,
          name: input.businessName.trim(),
          phone: input.phone.trim(),
          address: input.address.trim(),
          ownerUid: customerUid,
          plan: isProPlan ? 'pro' : 'trial',
          paketTuru: isProPlan ? 'pro' : 'deneme',
          onayDurumu: 'onaylandi',
          accountStatus: 'active',
          trialStartDate,
          trialEndDate,
          denemeBaslangicTarihi: trialStartDate,
          denemeBitisTarihi: trialEndDate,
          proStartDate,
          proEndDate,
          proBaslangicTarihi: proStartDate,
          proBitisTarihi: proEndDate,
          active: true,
          ownerName: input.ownerName.trim(),
          ownerEmail: input.email.trim(),
          createdAt: nowIso,
          updatedAt: nowIso,
        };
      } catch (firestoreErr: any) {
        console.error('Firestore write error when creating business:', firestoreErr);
        // Automatic Rollback: If this was a freshly created user in this turn, delete it so it doesn't get orphaned!
        if (!isReusedAuthUser && customerUser) {
          try {
            await customerUser.delete();
            console.log('Orphaned Firebase Auth user rolled back successfully.');
          } catch (rollbackErr) {
            console.warn('Could not roll back Firebase Auth user:', rollbackErr);
          }
        }
        throw firestoreErr;
      }
    } finally {
      // 5. Clean up tempAuth and tempApp
      try {
        await signOut(tempAuth);
        await deleteApp(tempApp);
      } catch (cleanupErr) {
        console.warn('Error cleaning up temp app:', cleanupErr);
      }
    }
  },

  /**
   * Update existing business details
   */
  async updateBusiness(
    businessId: string,
    updates: Record<string, any>
  ): Promise<void> {
    const ref = doc(db, 'businesses', businessId);

    // CRITICAL: Strip any undefined fields so Firestore updateDoc never throws Unsupported field value: undefined
    const cleanUpdates: Record<string, any> = {};
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined) {
        cleanUpdates[key] = val;
      }
    }

    await updateDoc(ref, {
      ...cleanUpdates,
      updatedAt: serverTimestamp(),
    });

    // If ownerName or phone was updated and ownerUid is known, also sync users document
    if (cleanUpdates.ownerUid && (cleanUpdates.ownerName || cleanUpdates.phone)) {
      try {
        const userRef = doc(db, 'users', cleanUpdates.ownerUid);
        const userUpdates: Record<string, any> = {};
        if (cleanUpdates.ownerName) userUpdates.name = cleanUpdates.ownerName;
        if (cleanUpdates.phone) userUpdates.phone = cleanUpdates.phone;
        await updateDoc(userRef, userUpdates);
      } catch (userErr) {
        console.warn('Could not sync user profile doc:', userErr);
      }
    }
  },

  /**
   * Delete business document
   */
  async deleteBusiness(businessId: string): Promise<void> {
    const ref = doc(db, 'businesses', businessId);
    await deleteDoc(ref);
  },
};
