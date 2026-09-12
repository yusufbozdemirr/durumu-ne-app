export type VehicleStatus =
  | 'received'
  | 'diagnosis'
  | 'waiting_parts'
  | 'repair'
  | 'testing'
  | 'ready';

export interface StatusConfig {
  key: VehicleStatus;
  label: string;
  shortLabel: string;
  stepNumber: number;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
}

export interface StatusHistoryEntry {
  id?: string;
  vehicleId?: string;
  businessId?: string;
  status: VehicleStatus;
  note?: string;
  timestamp?: string;
  createdAt?: string;
  updatedBy?: string;
  timeFormatted?: string;
}

export interface Vehicle {
  id: string;
  businessId: string;
  plate: string;
  brand: string;
  model: string;
  year?: string;
  customerName?: string;
  customerPhone: string;
  currentStatus: VehicleStatus;
  estimatedDelivery?: string;
  publicToken: string;
  serviceDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicVehicle {
  publicToken?: string;
  businessId?: string;
  plate: string;
  brand: string;
  model: string;
  year?: string;
  currentStatus: VehicleStatus;
  estimatedDelivery?: string;
  statusHistory?: StatusHistoryEntry[];
  serviceDescription?: string;
  updatedAt?: string;
}

export interface Business {
  id: string;
  name: string;
  phone: string;
  address: string;
  ownerUid: string;
  plan: 'free' | 'pro' | 'trial';
  accountStatus?: 'active' | 'trial_expired' | 'suspended';
  trialStartDate?: string;
  trialEndDate?: string;
  proStartDate?: string;
  proEndDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  ownerName?: string;
  ownerEmail?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  businessId: string;
  role: 'admin' | 'owner';
  createdAt: string;
}

export interface PlanStatus {
  plan: 'free' | 'pro' | 'trial';
  accountStatus: 'active' | 'trial_expired' | 'suspended';
  isTrial: boolean;
  isPro: boolean;
  isExpired: boolean;
  canAccessDashboard: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  warningState: 'none' | 'urgent_2_days' | 'urgent_1_day' | 'urgent_hours' | 'expired';
  warningMessage?: string;
  trialStartDate?: string;
  trialEndDate?: string;
}

export interface FilterState {
  search: string;
  status: 'all' | VehicleStatus;
}
