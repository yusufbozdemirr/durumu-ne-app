import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PublicVehicle } from '../types';

export const publicTrackingService = {
  /**
   * Fetch public tracking data for /takip/:publicToken without authentication
   */
  async getPublicVehicle(publicToken: string): Promise<PublicVehicle | null> {
    try {
      const ref = doc(db, 'publicVehicles', publicToken);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        publicToken,
        plate: data.plate || '',
        brand: data.brand || '',
        model: data.model || '',
        year: data.year || '',
        currentStatus: data.currentStatus || 'received',
        estimatedDelivery: data.estimatedDelivery || '',
        statusHistory: data.statusHistory || [],
        serviceDescription: data.serviceDescription || '',
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Firebase error fetching public vehicle:', error);
      return null;
    }
  },

  /**
   * Synchronize or create public tracking doc
   * Note: NEVER stores customer name, phone, ownerUid, email, or passwords!
   */
  async syncPublicVehicle(
    publicToken: string,
    businessId: string,
    data: {
      plate: string;
      brand: string;
      model: string;
      year?: string;
      currentStatus: string;
      estimatedDelivery?: string;
      serviceDescription?: string;
      statusHistory?: any[];
    }
  ): Promise<void> {
    const ref = doc(db, 'publicVehicles', publicToken);
    const nowIso = new Date().toISOString();

    await setDoc(ref, {
      publicToken,
      businessId, // Stored to allow Firestore security rules to match businessId
      plate: data.plate,
      brand: data.brand,
      model: data.model,
      year: data.year || '',
      currentStatus: data.currentStatus,
      estimatedDelivery: data.estimatedDelivery || '',
      serviceDescription: data.serviceDescription || '',
      statusHistory: (data.statusHistory || []).map((h) => ({
        status: h.status,
        note: h.note || '',
        timestamp: h.timestamp || h.createdAt || nowIso,
        createdAt: h.createdAt || nowIso,
      })),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Delete public tracking doc when vehicle is deleted
   */
  async deletePublicVehicle(publicToken: string): Promise<void> {
    try {
      const ref = doc(db, 'publicVehicles', publicToken);
      await deleteDoc(ref);
    } catch (error) {
      console.error('Firebase error deleting public vehicle:', error);
    }
  },
};
