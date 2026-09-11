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
      list.push({
        id: d.id,
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        ownerUid: data.ownerUid || '',
        plan: data.plan || 'free',
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

      const businessData = {
        id: businessId,
        name: input.businessName.trim(),
        phone: input.phone.trim(),
        address: input.address.trim(),
        ownerUid: customerUid,
        plan: 'free' as const,
        active: true,
        ownerName: input.ownerName.trim(),
        ownerEmail: input.email.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      try {
        // 3. Create businesses/{businessId}
        const businessDocRef = doc(db, 'businesses', businessId);
        await setDoc(businessDocRef, businessData);

        // 4. Create users/{customerUid}
        const userDocRef = doc(db, 'users', customerUid);
        await setDoc(userDocRef, {
          uid: customerUid,
          email: input.email.trim(),
          name: input.ownerName.trim(),
          businessId: businessId,
          role: 'owner',
          createdAt: serverTimestamp(),
        });

        return {
          id: businessId,
          name: businessData.name,
          phone: businessData.phone,
          address: businessData.address,
          ownerUid: customerUid,
          plan: 'free',
          active: true,
          ownerName: businessData.ownerName,
          ownerEmail: businessData.ownerEmail,
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
    updates: Partial<{
      name: string;
      phone: string;
      address: string;
      plan: 'free' | 'pro';
      active: boolean;
      ownerName?: string;
    }>
  ): Promise<void> {
    const ref = doc(db, 'businesses', businessId);
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Delete business document
   */
  async deleteBusiness(businessId: string): Promise<void> {
    const ref = doc(db, 'businesses', businessId);
    await deleteDoc(ref);
  },
};
