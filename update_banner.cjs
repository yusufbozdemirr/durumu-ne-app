const fs = require('fs');
let content = fs.readFileSync('src/components/common/TrialWarningBanner.tsx', 'utf-8');

content = content.replace(
  "if (!planStatus.isTrial || planStatus.isExpired || planStatus.warningState === 'none') {",
  "if (planStatus.isExpired || planStatus.warningState === 'none' || planStatus.warningState === 'pending_approval') {"
);

const switchStart = `const getNoticeDetails = () => {`;
const switchReplacement = `const getNoticeDetails = () => {
    const defaultTitle = planStatus.warningMessage || (planStatus.isPro ? 'Pro paketinizin bitmesine yaklaştınız.' : 'Deneme sürenizin bitmesine yaklaştınız.');
    
    switch (planStatus.warningState) {
      case 'urgent_hours':
        return {
          title: defaultTitle,
          badge: 'Son Saatler',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          containerBg: 'bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-rose-200/80',
          iconColor: 'text-rose-600',
        };
      case 'urgent_1_day':
        return {
          title: defaultTitle,
          badge: 'Yakında Bitiyor',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          containerBg: 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/80',
          iconColor: 'text-amber-600',
        };
      case 'urgent_2_days':
      default:
        return {
          title: defaultTitle,
          badge: planStatus.isPro ? 'Abonelik Yenileme' : 'Deneme Süresi',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          containerBg: 'bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border-blue-200/80',
          iconColor: 'text-blue-600',
        };
    }`;
content = content.replace(/const getNoticeDetails = \(\) => \{[\s\S]*?    \};/g, switchReplacement);

content = content.replace(
  "Durumu Ne? deneyiminize kesintisiz devam etmek için Pro paket hakkında bilgi alın.",
  "{planStatus.isPro ? 'Pro paket aboneliğinizi yenilemek için WhatsApp üzerinden bizimle iletişime geçin.' : 'Durumu Ne? deneyiminize kesintisiz devam etmek için Pro paket hakkında bilgi alın.'}"
);

content = content.replace(
  "<span>Pro Paket Hakkında Bilgi Al</span>",
  "<span>{planStatus.isPro ? 'Aboneliği Yenile' : 'Pro Paket Hakkında Bilgi Al'}</span>"
);

fs.writeFileSync('src/components/common/TrialWarningBanner.tsx', content);
