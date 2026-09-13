import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Vehicle, VehicleStatus, StatusHistoryEntry } from '../types';
import { statusHistoryService } from './statusHistoryService';
import { publicTrackingService } from './publicTrackingService';

/**
 * Generate a cryptographically secure, random, non-sequential token for public tracking
 */
function generateSecurePublicToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (let i = 0; i < 6; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * Normalize Turkish license plate: uppercase, trim, standard spacing
 */
export function normalizePlate(plate: string): string {
  return plate
    .trim()
    .toLocaleUpperCase('tr-TR')
    .replace(/\s+/g, ' ');
}

export const vehicleService = {
  /**
   * Migrate old vehicles to use publicVehicles collection
   */
  async runPublicTrackingMigration(businessId: string): Promise<void> {
    try {
      const col = collection(db, 'vehicles');
      const q = query(col, where('businessId', '==', businessId));
      const snapshot = await getDocs(q);
      
      const promises = snapshot.docs.map(async (d) => {
        const data = d.data();
        let token = data.publicToken || data.token;
        let needsUpdate = false;
        
        if (!token) {
          token = generateSecurePublicToken();
          needsUpdate = true;
        } else if (!data.publicToken) {
          needsUpdate = true;
        }

        if (needsUpdate) {
          await updateDoc(doc(db, 'vehicles', d.id), { publicToken: token });
        }

        // Always sync to ensure publicVehicles document exists
        const history = await statusHistoryService.getStatusHistory(d.id);
        await publicTrackingService.syncPublicVehicle(token, businessId, {
          plate: data.plate,
          brand: data.brand,
          model: data.model,
          year: data.year ? String(data.year) : '',
          currentStatus: data.currentStatus || 'received',
          estimatedDelivery: data.estimatedDelivery || '',
          serviceDescription: data.serviceDescription || '',
          statusHistory: history,
        });
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Migration error:', error);
    }
  },

  /**
   * Load vehicles belonging ONLY to the user's business
   */
  async getVehiclesByBusiness(businessId: string): Promise<Vehicle[]> {
    try {
      const col = collection(db, 'vehicles');
      const q = query(col, where('businessId', '==', businessId));
      const snapshot = await getDocs(q);

      const list: Vehicle[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          businessId: data.businessId,
          plate: data.plate,
          brand: data.brand,
          model: data.model,
          year: data.year ? String(data.year) : '',
          customerName: data.customerName || '',
          customerPhone: data.customerPhone,
          currentStatus: (data.currentStatus as VehicleStatus) || 'received',
          estimatedDelivery: data.estimatedDelivery || '',
          publicToken: data.publicToken,
          serviceDescription: data.serviceDescription || '',
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt || new Date().toISOString(),
        });
      });

      // Sort in-memory by updatedAt descending
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      return list;
    } catch (error) {
      console.error('Firebase error fetching vehicles:', error);
      throw error;
    }
  },

  /**
   * Get single vehicle by ID
   */
  async getVehicleById(vehicleId: string): Promise<Vehicle | null> {
    try {
      const ref = doc(db, 'vehicles', vehicleId);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) return null;
      const data = snapshot.data();
      return {
        id: snapshot.id,
        businessId: data.businessId,
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: data.year ? String(data.year) : '',
        customerName: data.customerName || '',
        customerPhone: data.customerPhone,
        currentStatus: (data.currentStatus as VehicleStatus) || 'received',
        estimatedDelivery: data.estimatedDelivery || '',
        publicToken: data.publicToken,
        serviceDescription: data.serviceDescription || '',
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Firebase error getting vehicle by ID:', error);
      return null;
    }
  },

  /**
   * Add a new vehicle:
   * Only the OWNER belonging to businessId creates this vehicle.
   */
  async addVehicle(
    businessId: string,
    data: {
      plate: string;
      brand: string;
      model: string;
      year?: number | string;
      customerName?: string;
      customerPhone: string;
      estimatedDelivery?: string;
      serviceDescription?: string;
      initialNote?: string;
    }
  ): Promise<Vehicle> {
    const col = collection(db, 'vehicles');
    const vehicleDocRef = doc(col);
    const vehicleId = vehicleDocRef.id;
    const publicToken = generateSecurePublicToken();
    const cleanPlate = normalizePlate(data.plate);
    const nowIso = new Date().toISOString();

    const vehiclePayload = {
      businessId,
      plate: cleanPlate,
      brand: data.brand.trim(),
      model: data.model.trim(),
      year: data.year ? String(data.year) : '',
      customerName: data.customerName ? data.customerName.trim() : '',
      customerPhone: data.customerPhone.trim(),
      currentStatus: 'received',
      estimatedDelivery: data.estimatedDelivery ? data.estimatedDelivery.trim() : '',
      publicToken,
      serviceDescription: data.serviceDescription ? data.serviceDescription.trim() : '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // 1. Create vehicles/{vehicleId}
    await setDoc(vehicleDocRef, vehiclePayload);

    // 2. Create vehicles/{vehicleId}/statusHistory entry
    const initialHistoryEntry: StatusHistoryEntry = await statusHistoryService.addStatusHistory(
      vehicleId,
      businessId,
      'received',
      data.initialNote || 'Araç kabulü yapıldı ve sisteme kaydedildi.',
      'Servis Yetkilisi'
    );

    // 3. Create publicVehicles/{publicToken}
    await publicTrackingService.syncPublicVehicle(publicToken, businessId, {
      plate: cleanPlate,
      brand: vehiclePayload.brand,
      model: vehiclePayload.model,
      year: vehiclePayload.year,
      currentStatus: 'received',
      estimatedDelivery: vehiclePayload.estimatedDelivery,
      serviceDescription: vehiclePayload.serviceDescription,
      statusHistory: [initialHistoryEntry],
    });

    return {
      id: vehicleId,
      businessId,
      plate: cleanPlate,
      brand: vehiclePayload.brand,
      model: vehiclePayload.model,
      year: vehiclePayload.year,
      customerName: vehiclePayload.customerName,
      customerPhone: vehiclePayload.customerPhone,
      currentStatus: 'received',
      estimatedDelivery: vehiclePayload.estimatedDelivery,
      publicToken,
      serviceDescription: vehiclePayload.serviceDescription,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  },

  /**
   * Update existing vehicle details
   */
  async updateVehicle(
    vehicleId: string,
    data: {
      plate: string;
      brand: string;
      model: string;
      year?: number | string;
      customerName?: string;
      customerPhone: string;
      estimatedDelivery?: string;
      serviceDescription?: string;
    }
  ): Promise<void> {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    const existing = await this.getVehicleById(vehicleId);
    if (!existing) throw new Error('Araç bulunamadı.');

    const cleanPlate = normalizePlate(data.plate);

    const updateFields = {
      plate: cleanPlate,
      brand: data.brand.trim(),
      model: data.model.trim(),
      year: data.year ? String(data.year) : '',
      customerName: data.customerName ? data.customerName.trim() : '',
      customerPhone: data.customerPhone.trim(),
      estimatedDelivery: data.estimatedDelivery ? data.estimatedDelivery.trim() : '',
      serviceDescription: data.serviceDescription ? data.serviceDescription.trim() : '',
      updatedAt: serverTimestamp(),
    };

    await updateDoc(vehicleRef, updateFields);

    // Sync public document
    const history = await statusHistoryService.getStatusHistory(vehicleId);
    await publicTrackingService.syncPublicVehicle(existing.publicToken, existing.businessId, {
      plate: cleanPlate,
      brand: updateFields.brand,
      model: updateFields.model,
      year: updateFields.year,
      currentStatus: existing.currentStatus,
      estimatedDelivery: updateFields.estimatedDelivery,
      serviceDescription: updateFields.serviceDescription,
      statusHistory: history,
    });
  },

  /**
   * Update vehicle status
   */
  async updateVehicleStatus(
    vehicleId: string,
    newStatus: VehicleStatus,
    note?: string,
    updatedBy?: string
  ): Promise<StatusHistoryEntry> {
    const vehicle = await this.getVehicleById(vehicleId);
    if (!vehicle) throw new Error('Araç bulunamadı.');

    const vehicleRef = doc(db, 'vehicles', vehicleId);

    // 1. Update vehicle doc
    await updateDoc(vehicleRef, {
      currentStatus: newStatus,
      updatedAt: serverTimestamp(),
    });

    // 2. Add history doc
    const historyEntry = await statusHistoryService.addStatusHistory(
      vehicleId,
      vehicle.businessId,
      newStatus,
      note,
      updatedBy || 'Servis Yetkilisi'
    );

    // 3. Fetch full history and sync public document
    const fullHistory = await statusHistoryService.getStatusHistory(vehicleId);
    await publicTrackingService.syncPublicVehicle(vehicle.publicToken, vehicle.businessId, {
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      currentStatus: newStatus,
      estimatedDelivery: vehicle.estimatedDelivery,
      serviceDescription: vehicle.serviceDescription,
      statusHistory: fullHistory,
    });

    return historyEntry;
  },

  /**
   * Delete vehicle and clean up public tracking
   */
  async deleteVehicle(vehicleId: string, publicToken?: string): Promise<void> {
    let token = publicToken;
    if (!token) {
      const v = await this.getVehicleById(vehicleId);
      token = v?.publicToken;
    }

    // 1. Delete vehicle doc
    const ref = doc(db, 'vehicles', vehicleId);
    await deleteDoc(ref);

    // 2. Delete public tracking doc
    if (token) {
      await publicTrackingService.deletePublicVehicle(token);
    }
  },
};
