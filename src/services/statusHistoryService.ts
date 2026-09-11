import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StatusHistoryEntry, VehicleStatus } from '../types';

export const statusHistoryService = {
  /**
   * Fetch all status history entries for a vehicle
   */
  async getStatusHistory(vehicleId: string): Promise<StatusHistoryEntry[]> {
    try {
      const historyCol = collection(db, 'vehicles', vehicleId, 'statusHistory');
      const q = query(historyCol, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);

      const items: StatusHistoryEntry[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        items.push({
          id: d.id,
          vehicleId: data.vehicleId || vehicleId,
          businessId: data.businessId || '',
          status: data.status as VehicleStatus,
          note: data.note || '',
          timestamp: data.timestamp?.toDate
            ? data.timestamp.toDate().toISOString()
            : data.timestamp || data.createdAt,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || new Date().toISOString(),
          updatedBy: data.updatedBy || '',
        });
      });

      return items;
    } catch (error) {
      console.error('Firebase error fetching status history:', error);
      return [];
    }
  },

  /**
   * Create a new status history entry
   */
  async addStatusHistory(
    vehicleId: string,
    businessId: string,
    status: VehicleStatus,
    note?: string,
    updatedBy?: string
  ): Promise<StatusHistoryEntry> {
    const historyCol = collection(db, 'vehicles', vehicleId, 'statusHistory');
    const newDocRef = doc(historyCol);
    const nowIso = new Date().toISOString();

    const payload = {
      id: newDocRef.id,
      vehicleId,
      businessId,
      status,
      note: note ? note.trim() : '',
      createdAt: nowIso,
      updatedBy: updatedBy || 'Servis Yetkilisi',
      timestamp: serverTimestamp(),
    };

    await setDoc(newDocRef, payload);

    return {
      id: newDocRef.id,
      vehicleId,
      businessId,
      status,
      note: payload.note,
      createdAt: nowIso,
      timestamp: nowIso,
      updatedBy: payload.updatedBy,
    };
  },
};
