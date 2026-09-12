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
      const planVal = data.plan || (data.paketTuru === 'pro' ? 'pro' : 'trial');
      return {
        id: snapshot.id,
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

      // Sanitize undefined fields
      const cleanPayload: Record<string, any> = {};
      for (const [k, v] of Object.entries(payload)) {
        if (v !== undefined) {
          cleanPayload[k] = v;
        }
      }

      await updateDoc(ref, cleanPayload);
    } catch (error) {
      console.error('Firebase error updating business:', error);
      throw error;
    }
  },
};
