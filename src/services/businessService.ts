import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Business } from '../types';

export const businessService = {
  /**
   * Fetch a single business document
   */
  async getBusiness(businessId: string): Promise<Business | null> {
    try {
      const ref = doc(db, 'businesses', businessId);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        id: snapshot.id,
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
      };
    } catch (error) {
      console.error('Firebase error fetching business:', error);
      return null;
    }
  },

  /**
   * Update business details
   */
  async updateBusiness(businessId: string, data: Partial<Business>): Promise<void> {
    try {
      const ref = doc(db, 'businesses', businessId);
      const payload: Record<string, any> = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      // Don't overwrite id
      delete payload.id;

      await updateDoc(ref, payload);
    } catch (error) {
      console.error('Firebase error updating business:', error);
      throw error;
    }
  },
};
