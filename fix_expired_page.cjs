const fs = require('fs');
let content = fs.readFileSync('src/pages/TrialExpiredPage.tsx', 'utf-8');

// Import useApp and get planStatus
content = content.replace(
  "const { business, userProfile, logout } = useApp();",
  "const { business, userProfile, logout, planStatus } = useApp();"
);

// Update WhatsApp URL
const oldWhatsapp = "const whatsappUrl = getWhatsAppDirectUrl(\n    `Merhaba, ${businessName} adına 7 günlük deneme süremiz sona erdi. Pro pakete geçiş yapmak ve araç takibine kesintisiz devam etmek istiyoruz.`\n  );";
const newWhatsapp = "const whatsappUrl = getWhatsAppDirectUrl(\n    planStatus.isPro ? `Merhaba, ${businessName} adına Pro paket aboneliğimiz sona erdi. Aboneliğimizi yenilemek istiyoruz.` : `Merhaba, ${businessName} adına 7 günlük deneme süremiz sona erdi. Pro pakete geçiş yapmak ve araç takibine kesintisiz devam etmek istiyoruz.`\n  );";
content = content.replace(oldWhatsapp, newWhatsapp);

// Update Heading
const oldHeading = "Deneme Süreniz Doldu\n            </h1>";
const newHeading = "{planStatus.isPro ? 'Pro Lisansınızı Yenileyin' : 'Deneme Süreniz Doldu'}\n            </h1>";
content = content.replace(oldHeading, newHeading);

// Update Paragraph
const oldParagraph = "<strong className=\"text-slate-700\">{businessName}</strong> için\n              tanımlanan 7 günlük ücretsiz deneme süresi sona ermiştir.";
const newParagraph = "<strong className=\"text-slate-700\">{businessName}</strong> için\n              tanımlanan {planStatus.isPro ? 'Pro paket abonelik süresi' : '7 günlük ücretsiz deneme süresi'} sona ermiştir.";
content = content.replace(oldParagraph, newParagraph);

// Update Guarantee Box Paragraph
const oldGuarantee = "Kayıtlı tüm araçlarınız, servis notlarınız ve müşteri geçmişiniz\n              silinmemiştir. Pro pakete geçiş yaptığınız anda sisteminiz kaldığı\n              yerden anında aktif olacaktır.";
const newGuarantee = "Kayıtlı tüm araçlarınız, servis notlarınız ve müşteri geçmişiniz\n              silinmemiştir. {planStatus.isPro ? 'Aboneliğinizi yenilediğiniz anda' : 'Pro pakete geçiş yaptığınız anda'} sisteminiz kaldığı\n              yerden anında aktif olacaktır.";
content = content.replace(oldGuarantee, newGuarantee);

// Update Button
const oldButton = "<span>WhatsApp ile Şimdi Pro'ya Geç</span>";
const newButton = "<span>{planStatus.isPro ? 'WhatsApp ile Aboneliği Yenile' : 'WhatsApp ile Şimdi Pro\\'ya Geç'}</span>";
content = content.replace(oldButton, newButton);

fs.writeFileSync('src/pages/TrialExpiredPage.tsx', content);
