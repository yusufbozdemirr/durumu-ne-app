import { Business, PlanStatus } from '../types';

/**
 * Calculates the exact plan and trial status of a business.
 * Handles server-side/stored timestamps, remaining hours/days, expiration, and warnings.
 */
export function getPlanStatus(business: Business | null, userRole?: string): PlanStatus {
  // If user is Admin, they have unlimited, unrestricted dashboard access
  if (userRole === 'admin') {
    return {
      plan: 'pro',
      accountStatus: 'active',
      isTrial: false,
      isPro: true,
      isExpired: false,
      canAccessDashboard: true,
      daysRemaining: 999,
      hoursRemaining: 999,
      warningState: 'none',
    };
  }

  // If no business loaded yet
  if (!business) {
    return {
      plan: 'trial',
      accountStatus: 'active',
      isTrial: true,
      isPro: false,
      isExpired: false,
      canAccessDashboard: false,
      daysRemaining: 7,
      hoursRemaining: 168,
      warningState: 'none',
    };
  }

  // Check accountStatus suspension
  if (business.accountStatus === 'suspended' || business.active === false) {
    return {
      plan: business.plan || 'trial',
      accountStatus: 'suspended',
      isTrial: business.plan === 'trial',
      isPro: business.plan === 'pro',
      isExpired: true,
      canAccessDashboard: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      warningState: 'expired',
      warningMessage: 'Hesabınız yönetici tarafından askıya alınmıştır.',
      trialStartDate: business.trialStartDate,
      trialEndDate: business.trialEndDate,
    };
  }

  // If explicit Pro plan
  if (business.plan === 'pro') {
    return {
      plan: 'pro',
      accountStatus: 'active',
      isTrial: false,
      isPro: true,
      isExpired: false,
      canAccessDashboard: true,
      daysRemaining: 365,
      hoursRemaining: 365 * 24,
      warningState: 'none',
      trialStartDate: business.trialStartDate,
      trialEndDate: business.trialEndDate,
    };
  }

  // Explicit 'trial_expired' flag
  if (business.accountStatus === 'trial_expired') {
    return {
      plan: 'trial',
      accountStatus: 'trial_expired',
      isTrial: true,
      isPro: false,
      isExpired: true,
      canAccessDashboard: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      warningState: 'expired',
      warningMessage: 'Ücretsiz deneme süreniz sona erdi.',
      trialStartDate: business.trialStartDate,
      trialEndDate: business.trialEndDate,
    };
  }

  // Calculate based on trialEndDate
  const now = Date.now();
  let trialEndMs = 0;

  if (business.trialEndDate) {
    trialEndMs = new Date(business.trialEndDate).getTime();
  } else if (business.trialStartDate) {
    // If only startDate is saved, default is 7 days
    trialEndMs = new Date(business.trialStartDate).getTime() + 7 * 24 * 60 * 60 * 1000;
  } else if (business.createdAt) {
    // Legacy fallback for trial calculation
    trialEndMs = new Date(business.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
  }

  // If this is a legacy free business with no trial timestamps and plan is 'free', keep backward compatible access
  if (business.plan === 'free' && !business.trialEndDate && !business.trialStartDate) {
    return {
      plan: 'free',
      accountStatus: 'active',
      isTrial: false,
      isPro: false,
      isExpired: false,
      canAccessDashboard: true,
      daysRemaining: 30,
      hoursRemaining: 30 * 24,
      warningState: 'none',
    };
  }

  const diffMs = trialEndMs - now;

  // Trial has expired
  if (diffMs <= 0) {
    return {
      plan: 'trial',
      accountStatus: 'trial_expired',
      isTrial: true,
      isPro: false,
      isExpired: true,
      canAccessDashboard: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      warningState: 'expired',
      warningMessage: 'Ücretsiz deneme süreniz sona erdi.',
      trialStartDate: business.trialStartDate,
      trialEndDate: business.trialEndDate,
    };
  }

  // Active trial calculation
  const hoursRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
  const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Warning states:
  // <= 24 hours -> 'urgent_hours'
  // <= 48 hours -> 'urgent_1_day'
  // <= 72 hours (2 days) -> 'urgent_2_days'
  let warningState: PlanStatus['warningState'] = 'none';
  let warningMessage: string | undefined;

  if (diffMs <= 24 * 60 * 60 * 1000) {
    warningState = 'urgent_hours';
    warningMessage = 'Deneme sürenizin bitmesine 1 günden az kaldı.';
  } else if (diffMs <= 48 * 60 * 60 * 1000) {
    warningState = 'urgent_1_day';
    warningMessage = 'Deneme sürenizin bitmesine 1 gün kaldı.';
  } else if (diffMs <= 72 * 60 * 60 * 1000) {
    warningState = 'urgent_2_days';
    warningMessage = 'Deneme sürenizin bitmesine 2 gün kaldı.';
  }

  return {
    plan: 'trial',
    accountStatus: 'active',
    isTrial: true,
    isPro: false,
    isExpired: false,
    canAccessDashboard: true,
    daysRemaining,
    hoursRemaining,
    warningState,
    warningMessage,
    trialStartDate: business.trialStartDate,
    trialEndDate: business.trialEndDate,
  };
}
