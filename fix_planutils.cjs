const fs = require('fs');
let content = fs.readFileSync('src/utils/planUtils.ts', 'utf-8');

// Also need to handle 'pro_expired' manually.
const oldStatusCheck = "  // Explicit 'trial_expired' flag\n  if (business.accountStatus === 'trial_expired') {";
const newStatusCheck = `  // Explicit 'pro_expired' flag
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
  if (business.accountStatus === 'trial_expired') {`;

content = content.replace(oldStatusCheck, newStatusCheck);

fs.writeFileSync('src/utils/planUtils.ts', content);
