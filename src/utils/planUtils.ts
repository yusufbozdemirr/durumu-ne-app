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

  // Check if waiting for admin approval
  if (
    business.onayDurumu === 'bekliyor' ||
    business.onayDurumu === 'onay_bekliyor' ||
    business.accountStatus === 'pending_approval'
  ) {
    return {
      plan: 'trial',
      accountStatus: 'pending_approval',
      isTrial: true,
      isPro: false,
      isExpired: false,
      isPendingApproval: true,
      canAccessDashboard: false,
      daysRemaining: 7,
      hoursRemaining: 168,
      warningState: 'pending_approval',
      warningMessage: 'Deneme sürümü talebiniz onay bekliyor.',
      trialStartDate: business.trialStartDate || business.denemeBaslangicTarihi,
      trialEndDate: business.trialEndDate || business.denemeBitisTarihi,
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
      warningMessage: 'Hesabınız askıya alınmıştır.',
      trialStartDate: business.trialStartDate || business.denemeBaslangicTarihi,
      trialEndDate: business.trialEndDate || business.denemeBitisTarihi,
    };
  }

  // If explicit Pro plan
  if (business.plan === 'pro' || business.paketTuru === 'pro') {
    const rawProEndDate = business.proEndDate || business.proBitisTarihi;
    const rawProStartDate = business.proStartDate || business.proBaslangicTarihi;
    let proEndMs = 0;
    
    if (rawProEndDate) {
      proEndMs = new Date(rawProEndDate).getTime();
    } else {
      proEndMs = new Date(business.createdAt || Date.now()).getTime() + 365 * 24 * 60 * 60 * 1000;
    }

    const now = Date.now();
    const diffMs = proEndMs - now;
    
    if (diffMs <= 0) {
      return {
        plan: 'pro',
        accountStatus: 'trial_expired', // Just reuse expired state handling
        isTrial: false,
        isPro: true,
        isExpired: true,
        canAccessDashboard: false,
        daysRemaining: 0,
        hoursRemaining: 0,
        warningState: 'expired',
        warningMessage: 'Pro paketinizin süresi doldu.',
        trialStartDate: rawProStartDate,
        trialEndDate: rawProEndDate,
      };
    }

    const hoursRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    
    let warningState: PlanStatus['warningState'] = 'none';
    let warningMessage;
    
    if (diffMs <= 3 * 24 * 60 * 60 * 1000) {
      warningState = 'urgent_hours'; // Reusing for color styling
      warningMessage = 'Pro paketinizin bitmesine 3 günden az kaldı.';
    } else if (diffMs <= 7 * 24 * 60 * 60 * 1000) {
      warningState = 'urgent_1_day';
      warningMessage = 'Pro paketinizin bitmesine çok az kaldı.';
    } else if (diffMs <= 14 * 24 * 60 * 60 * 1000) {
      warningState = 'urgent_2_days';
      warningMessage = 'Pro paketinizin süresi yakında dolacak.';
    }

    return {
      plan: 'pro',
      accountStatus: 'active',
      isTrial: false,
      isPro: true,
      isExpired: false,
      canAccessDashboard: true,
      daysRemaining,
      hoursRemaining,
      warningState,
      warningMessage,
      trialStartDate: rawProStartDate,
      trialEndDate: rawProEndDate,
    };
  }

  // Explicit 'pro_expired' flag
  if (business.accountStatus === 'pro_expired') {
    return {
      plan: 'pro',
      accountStatus: 'pro_expired',
      isTrial: false,
      isPro: true,
      isExpired: true,
      canAccessDashboard: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      warningState: 'expired',
      warningMessage: 'Pro paketinizin süresi doldu.',
      trialStartDate: business.proStartDate || business.proBaslangicTarihi,
      trialEndDate: business.proEndDate || business.proBitisTarihi,
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
      trialStartDate: business.trialStartDate || business.denemeBaslangicTarihi,
      trialEndDate: business.trialEndDate || business.denemeBitisTarihi,
    };
  }

  // Calculate based on trialEndDate or denemeBitisTarihi
  const now = Date.now();
  let trialEndMs = 0;

  const rawEndDate = business.trialEndDate || business.denemeBitisTarihi;
  const rawStartDate = business.trialStartDate || business.denemeBaslangicTarihi;

  if (rawEndDate) {
    trialEndMs = new Date(rawEndDate).getTime();
  } else if (rawStartDate) {
    // If only startDate is saved, default is 7 days
    trialEndMs = new Date(rawStartDate).getTime() + 7 * 24 * 60 * 60 * 1000;
  } else if (business.createdAt) {
    // Fallback based on creation time: 7 days
    trialEndMs = new Date(business.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
  }

  const diffMs = trialEndMs - now;

  // Trial or Free period has expired (no free bypass if 7 days has passed!)
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
      trialStartDate: rawStartDate,
      trialEndDate: rawEndDate,
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
    trialStartDate: rawStartDate,
    trialEndDate: rawEndDate,
  };
}
