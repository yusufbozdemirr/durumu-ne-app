import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Vehicle, Business, UserProfile, VehicleStatus, StatusHistoryEntry, PlanStatus } from '../types';
import { authService } from '../services/authService';
import { businessService } from '../services/businessService';
import { vehicleService } from '../services/vehicleService';
import { statusHistoryService } from '../services/statusHistoryService';
import { adminService, CreateBusinessInput } from '../services/adminService';
import { ADMIN_UID, ADMIN_EMAILS, isSystemAdmin } from '../utils/constants';
import { getTurkishErrorMessage } from '../utils/errorHandler';
import { getPlanStatus } from '../utils/planUtils';
import { auth } from '../lib/firebase';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  vehicles: Vehicle[];
  business: Business | null;
  userProfile: UserProfile | null;
  currentUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isPlanModalOpen: boolean;
  setIsPlanModalOpen: (open: boolean) => void;
  qrModalVehicle: Vehicle | null;
  toasts: ToastMessage[];
  planStatus: PlanStatus;

  // Owner Vehicle Actions
  addVehicle: (data: {
    plate: string;
    brand: string;
    model: string;
    year?: number | string;
    customerName?: string;
    customerPhone: string;
    estimatedDelivery?: string;
    serviceDescription?: string;
    initialNote?: string;
  }) => Promise<Vehicle>;
  updateVehicleStatus: (
    vehicleId: string,
    newStatus: VehicleStatus,
    note?: string
  ) => Promise<StatusHistoryEntry | null>;
  updateVehicle: (
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
  ) => Promise<void>;
  deleteVehicle: (vehicleId: string, publicToken?: string) => Promise<boolean>;
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehicleStatusHistory: (vehicleId: string) => Promise<StatusHistoryEntry[]>;
  updateBusiness: (updates: Partial<Business>) => Promise<void>;
  refreshVehicles: () => Promise<void>;

  // Admin Actions
  allBusinesses: Business[];
  loadAllBusinesses: () => Promise<boolean>;
  adminCreateBusiness: (input: CreateBusinessInput) => Promise<Business>;
  adminUpdateBusiness: (
    businessId: string,
    updates: Partial<{
      name: string;
      phone: string;
      address: string;
      plan: 'free' | 'pro' | 'trial';
      accountStatus: 'active' | 'trial_expired' | 'suspended';
      active: boolean;
      ownerName?: string;
      ownerEmail?: string;
      trialStartDate?: string;
      trialEndDate?: string;
      proStartDate?: string;
      proEndDate?: string;
    }>
  ) => Promise<void>;
  adminDeleteBusiness: (businessId: string) => Promise<void>;

  // Auth & UI
  registerTrial: (params: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    businessName: string;
    phone?: string;
  }) => Promise<UserProfile>;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<UserProfile>;
  logout: () => Promise<void>;
  openQRModal: (vehicle: Vehicle) => void;
  closeQRModal: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);
  const [qrModalVehicle, setQrModalVehicle] = useState<Vehicle | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const isAdmin = !!(isSystemAdmin(currentUser?.uid, currentUser?.email) || userProfile?.role === 'admin');

  // Reload vehicles for current owner business
  const refreshVehicles = useCallback(async () => {
    if (!userProfile?.businessId || userProfile.role === 'admin') return;
    try {
      const list = await vehicleService.getVehiclesByBusiness(userProfile.businessId);
      setVehicles(list);
    } catch (error) {
      console.error('Failed to reload vehicles:', error);
      showToast(getTurkishErrorMessage(error), 'error');
    }
  }, [userProfile?.businessId, userProfile?.role, showToast]);

  // Admin: load all businesses
  const loadAllBusinesses = useCallback(async (): Promise<boolean> => {
    try {
      const list = await adminService.getAllBusinesses();
      setAllBusinesses(list);
      return true;
    } catch (error) {
      console.error('Failed to load businesses for admin:', error);
      showToast(getTurkishErrorMessage(error), 'error');
      return false;
    }
  }, [showToast]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (fbUser) => {
      setCurrentUser(fbUser);

      if (fbUser) {
        try {
          const profile = await authService.getUserProfile(fbUser.uid);
          const isUserAdmin = isSystemAdmin(fbUser.uid, fbUser.email) || profile?.role === 'admin';

          if (isUserAdmin) {
            // Admin user
            const adminProf: UserProfile = profile || {
              uid: fbUser.uid,
              email: fbUser.email || '',
              name: 'Sistem Yöneticisi',
              businessId: 'admin',
              role: 'admin',
              createdAt: new Date().toISOString(),
            };
            setUserProfile(adminProf);
            setBusiness(null);
            setVehicles([]);
          } else if (profile && profile.businessId) {
            // Owner user
            setUserProfile(profile);

            // Fetch business
            const biz = await businessService.getBusiness(profile.businessId);
            setBusiness(biz);

            // Fetch vehicles
            const vList = await vehicleService.getVehiclesByBusiness(profile.businessId);
            setVehicles(vList);

            // Auto-migrate missing tracking records
            vehicleService.runPublicTrackingMigration(profile.businessId).catch(console.error);
          } else {
            // User exists in Auth but has no business/user profile in Firestore
            console.warn('User has no valid Firestore profile. Terminating orphaned session.');
            await authService.logout();
            setCurrentUser(null);
            setUserProfile(null);
            setBusiness(null);
            setVehicles([]);
          }
        } catch (error) {
          console.error('Firebase error loading user session:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setUserProfile(null);
        setBusiness(null);
        setVehicles([]);
        setAllBusinesses([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, pass: string, rememberMe: boolean = true): Promise<UserProfile> => {
      try {
        setIsLoading(true);
        const profile = await authService.login(email, pass, rememberMe);
        setUserProfile(profile);

        if (profile.role === 'admin' || isSystemAdmin(profile.uid, profile.email)) {
          showToast('Yönetici girişi başarılı.', 'success');
        } else {
          // Load owner's business and vehicles
          if (profile.businessId) {
            const [biz, vList] = await Promise.all([
              businessService.getBusiness(profile.businessId),
              vehicleService.getVehiclesByBusiness(profile.businessId),
            ]);
            setBusiness(biz);
            setVehicles(vList);
            vehicleService.runPublicTrackingMigration(profile.businessId).catch(console.error);
          }
          showToast('Giriş başarılı. Hoş geldiniz!', 'success');
        }

        return profile;
      } catch (error: any) {
        const trMsg = getTurkishErrorMessage(error);
        showToast(trMsg, 'error');
        throw new Error(trMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      setUserProfile(null);
      setBusiness(null);
      setVehicles([]);
      setAllBusinesses([]);
      showToast('Oturum kapatıldı.', 'info');
    } catch (error) {
      console.error('Logout error:', error);
      showToast('Çıkış yapılırken bir sorun oluştu.', 'error');
    }
  }, [showToast]);

  // OWNER VEHICLE ACTIONS
  const addVehicle = useCallback(
    async (data: {
      plate: string;
      brand: string;
      model: string;
      year?: number | string;
      customerName?: string;
      customerPhone: string;
      estimatedDelivery?: string;
      serviceDescription?: string;
      initialNote?: string;
    }) => {
      if (!userProfile?.businessId || userProfile.role === 'admin') {
        throw new Error('İşletme yetkiniz bulunmuyor.');
      }
      try {
        const newV = await vehicleService.addVehicle(userProfile.businessId, data);
        setVehicles((prev) => [newV, ...prev]);
        showToast(`${newV.plate} plakalı araç başarıyla kaydedildi.`, 'success');
        return newV;
      } catch (error) {
        console.error('Error adding vehicle:', error);
        const trMsg = getTurkishErrorMessage(error);
        showToast(trMsg, 'error');
        throw error;
      }
    },
    [userProfile?.businessId, userProfile?.role, showToast]
  );

  const updateVehicleStatus = useCallback(
    async (vehicleId: string, newStatus: VehicleStatus, note?: string) => {
      try {
        const historyEntry = await vehicleService.updateVehicleStatus(
          vehicleId,
          newStatus,
          note,
          userProfile?.name || 'Servis Yetkilisi'
        );

        setVehicles((prev) =>
          prev.map((v) =>
            v.id === vehicleId
              ? {
                  ...v,
                  currentStatus: newStatus,
                  updatedAt: new Date().toISOString(),
                }
              : v
          )
        );
        showToast('Araç aşama durumu güncellendi.', 'success');
        return historyEntry;
      } catch (error) {
        console.error('Error updating status:', error);
        showToast(getTurkishErrorMessage(error), 'error');
        return null;
      }
    },
    [userProfile?.name, showToast]
  );

  const updateVehicle = useCallback(
    async (
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
    ) => {
      try {
        await vehicleService.updateVehicle(vehicleId, data);
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === vehicleId
              ? {
                  ...v,
                  ...data,
                  year: data.year ? String(data.year) : '',
                  updatedAt: new Date().toISOString(),
                }
              : v
          )
        );
        showToast('Araç bilgileri güncellendi.', 'success');
      } catch (error) {
        console.error('Error updating vehicle:', error);
        const trMsg = getTurkishErrorMessage(error);
        showToast(trMsg, 'error');
        throw error;
      }
    },
    [showToast]
  );

  const deleteVehicle = useCallback(
    async (vehicleId: string, publicToken?: string) => {
      try {
        await vehicleService.deleteVehicle(vehicleId, publicToken);
        setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
        showToast('Araç kaydı ve takip sayfası silindi.', 'info');
        return true;
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        showToast(getTurkishErrorMessage(error), 'error');
        return false;
      }
    },
    [showToast]
  );

  const getVehicleById = useCallback(
    (id: string) => {
      return vehicles.find((v) => v.id === id);
    },
    [vehicles]
  );

  const getVehicleStatusHistory = useCallback(async (vehicleId: string) => {
    return statusHistoryService.getStatusHistory(vehicleId);
  }, []);

  const updateBusiness = useCallback(
    async (updates: Partial<Business>) => {
      if (!business) return;
      try {
        await businessService.updateBusiness(business.id, updates);
        setBusiness((prev) => (prev ? { ...prev, ...updates } : null));
        showToast('İşletme bilgileri güncellendi.', 'success');
      } catch (error) {
        console.error('Error updating business:', error);
        showToast(getTurkishErrorMessage(error), 'error');
      }
    },
    [business, showToast]
  );

  // ADMIN ACTIONS
  const adminCreateBusiness = useCallback(
    async (input: CreateBusinessInput) => {
      try {
        const newBiz = await adminService.createBusinessAndOwner(input);
        setAllBusinesses((prev) => [newBiz, ...prev]);
        showToast(`"${newBiz.name}" işletmesi ve kullanıcı hesabı oluşturuldu.`, 'success');
        return newBiz;
      } catch (error) {
        console.error('Admin create business error:', error);
        const trMsg = getTurkishErrorMessage(error);
        showToast(trMsg, 'error');
        throw error;
      }
    },
    [showToast]
  );

  const adminUpdateBusiness = useCallback(
    async (
      businessId: string,
      updates: Partial<{
        name: string;
        phone: string;
        address: string;
        plan: 'free' | 'pro' | 'trial';
        accountStatus: 'active' | 'trial_expired' | 'suspended';
        active: boolean;
        ownerName?: string;
        ownerEmail?: string;
        trialStartDate?: string;
        trialEndDate?: string;
        proStartDate?: string;
        proEndDate?: string;
      }>
    ) => {
      try {
        await adminService.updateBusiness(businessId, updates);
        setAllBusinesses((prev) =>
          prev.map((b) => (b.id === businessId ? { ...b, ...updates } : b))
        );
        if (business?.id === businessId) {
          setBusiness((prev) => (prev ? { ...prev, ...updates } : null));
        }
        showToast('İşletme başarıyla güncellendi.', 'success');
      } catch (error) {
        console.error('Admin update business error:', error);
        showToast(getTurkishErrorMessage(error), 'error');
        throw error;
      }
    },
    [showToast, business?.id]
  );

  const registerTrial = useCallback(
    async (params: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      businessName: string;
      phone?: string;
    }) => {
      try {
        setIsLoading(true);
        const profile = await authService.registerTrial(params);
        setUserProfile(profile);
        setCurrentUser(auth.currentUser);
        if (profile.businessId) {
          const biz = await businessService.getBusiness(profile.businessId);
          setBusiness(biz);
        }
        showToast('Ücretsiz deneme hesabınız başarıyla oluşturuldu! Hoş geldiniz.', 'success');
        return profile;
      } catch (error: any) {
        console.error('Registration trial error:', error);
        const trMsg = getTurkishErrorMessage(error);
        showToast(trMsg, 'error');
        throw new Error(trMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  const adminDeleteBusiness = useCallback(
    async (businessId: string) => {
      try {
        await adminService.deleteBusiness(businessId);
        setAllBusinesses((prev) => prev.filter((b) => b.id !== businessId));
        showToast('İşletme silindi.', 'info');
      } catch (error) {
        console.error('Admin delete business error:', error);
        showToast(getTurkishErrorMessage(error), 'error');
        throw error;
      }
    },
    [showToast]
  );

  const openQRModal = useCallback((vehicle: Vehicle) => {
    setQrModalVehicle(vehicle);
  }, []);

  const closeQRModal = useCallback(() => {
    setQrModalVehicle(null);
  }, []);

  const planStatus = getPlanStatus(business, isAdmin ? 'admin' : userProfile?.role);

  return (
    <AppContext.Provider
      value={{
        vehicles,
        business,
        userProfile,
        currentUser,
        isAuthenticated: !!(currentUser && (isAdmin || (userProfile && userProfile.businessId))),
        isAdmin,
        isLoading,
        isPlanModalOpen,
        setIsPlanModalOpen,
        qrModalVehicle,
        toasts,
        planStatus,
        addVehicle,
        updateVehicleStatus,
        updateVehicle,
        deleteVehicle,
        getVehicleById,
        getVehicleStatusHistory,
        updateBusiness,
        refreshVehicles,
        allBusinesses,
        loadAllBusinesses,
        adminCreateBusiness,
        adminUpdateBusiness,
        adminDeleteBusiness,
        registerTrial,
        login,
        logout,
        openQRModal,
        closeQRModal,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
