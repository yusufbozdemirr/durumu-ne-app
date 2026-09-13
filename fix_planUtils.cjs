const fs = require('fs');

let content = fs.readFileSync('src/utils/planUtils.ts', 'utf-8');

// Replace the explicit Pro block
const oldProBlockRegex = /\/\/ If explicit Pro plan[\s\S]*?if \(business\.plan === 'pro' \|\| business\.paketTuru === 'pro'\) \{[\s\S]*?trialEndDate: business\.trialEndDate \|\| business\.denemeBitisTarihi,\n    };\n  \}/;

const newProBlock = `// If explicit Pro plan
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
    
    let warningState = 'none';
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
  }`;

content = content.replace(oldProBlockRegex, newProBlock);
fs.writeFileSync('src/utils/planUtils.ts', content);
console.log('planUtils updated.');
