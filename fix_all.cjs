const fs = require('fs');

// 1. Fix Token Generation in vehicleService.ts
let vehicleServiceStr = fs.readFileSync('src/services/vehicleService.ts', 'utf-8');
const oldTokenFunc = `function generateSecurePublicToken(): string {
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  const randomHex = Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return \`\${Date.now().toString(36)}\${randomHex}\`;
}`;

const newTokenFunc = `function generateSecurePublicToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const array = new Uint8Array(6);
  crypto.getRandomValues(array);
  for (let i = 0; i < 6; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}`;
if(vehicleServiceStr.includes(oldTokenFunc)){
  vehicleServiceStr = vehicleServiceStr.replace(oldTokenFunc, newTokenFunc);
  fs.writeFileSync('src/services/vehicleService.ts', vehicleServiceStr);
  console.log('Fixed generateSecurePublicToken');
}

// 2. Fix AdminPage.tsx
let adminPageStr = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');

// Update editForm state
adminPageStr = adminPageStr.replace(
  "    endDate: '',",
  "    endDate: '',\n    startDate: '',"
);

// Update setEditForm block
const oldSetEditForm = `    setEditForm({
      name: b.name,
      ownerName: b.ownerName || '',
      phone: b.phone,
      address: b.address || '',
      plan: b.plan === 'pro' || b.paketTuru === 'pro' ? 'pro' : 'trial',
      accountStatus:
        b.accountStatus === 'trial_expired'
          ? 'trial_expired'
          : b.active === false || b.accountStatus === 'suspended'
          ? 'suspended'
          : 'active',
      active: b.active !== false,
      endDate: rawEndDate ? rawEndDate.substring(0, 10) : '',
    });`;

const newSetEditForm = `    setEditForm({
      name: b.name,
      ownerName: b.ownerName || '',
      phone: b.phone,
      address: b.address || '',
      plan: b.plan === 'pro' || b.paketTuru === 'pro' ? 'pro' : 'trial',
      accountStatus:
        b.accountStatus === 'trial_expired'
          ? 'trial_expired'
          : b.accountStatus === 'pro_expired'
          ? 'pro_expired'
          : b.active === false || b.accountStatus === 'suspended'
          ? 'suspended'
          : 'active',
      active: b.active !== false,
      endDate: rawEndDate ? rawEndDate.substring(0, 10) : '',
      startDate: (b.proStartDate || b.proBaslangicTarihi || b.trialStartDate || b.denemeBaslangicTarihi || b.createdAt || '').substring(0, 10),
    });`;
adminPageStr = adminPageStr.replace(oldSetEditForm, newSetEditForm);

// Add pro_expired to accountStatus select
adminPageStr = adminPageStr.replace(
  `<option value="trial_expired">Deneme Süresi Doldu</option>`,
  `<option value="trial_expired">Deneme Süresi Doldu</option>\n                    <option value="pro_expired">Pro Sürümü Doldu</option>`
);

// Add startDate field to form
const endDateBlock = `                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Lisans / Deneme Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-teal-500"
                  />
                </div>`;

const newDateBlock = `                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono focus:outline-hidden opacity-70"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-hidden focus:border-teal-500"
                  />
                </div>`;
adminPageStr = adminPageStr.replace(endDateBlock, newDateBlock);

// Remove Quick Action Buttons
const quickActionsPattern = /<div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">[\s\S]*?<form onSubmit=\{handleEditSubmit\} className="space-y-3.5">/;
adminPageStr = adminPageStr.replace(quickActionsPattern, '<form onSubmit={handleEditSubmit} className="space-y-3.5">');

fs.writeFileSync('src/pages/AdminPage.tsx', adminPageStr);
console.log('Fixed AdminPage.tsx');

// 3. Fix TrialExpiredPage.tsx to handle Suspended Accounts
let expiredPageStr = fs.readFileSync('src/pages/TrialExpiredPage.tsx', 'utf-8');

const isSuspendedPattern = "const isSuspended = planStatus.accountStatus === 'suspended';";
if(!expiredPageStr.includes(isSuspendedPattern)) {
  expiredPageStr = expiredPageStr.replace(
    "const handleLogout = async () => {",
    "const isSuspended = planStatus.accountStatus === 'suspended';\n\n  const handleLogout = async () => {"
  );
  
  expiredPageStr = expiredPageStr.replace(
    "{planStatus.isPro ? 'Pro Lisansınızı Yenileyin' : 'Deneme Süreniz Doldu'}",
    "{isSuspended ? 'Hesabınız Askıya Alındı' : planStatus.isPro ? 'Pro Lisansınızı Yenileyin' : 'Deneme Süreniz Doldu'}"
  );
  
  expiredPageStr = expiredPageStr.replace(
    "tanımlanan {planStatus.isPro ? 'Pro paket abonelik süresi' : '7 günlük ücretsiz deneme süresi'} sona ermiştir.",
    "tanımlanan {planStatus.isPro ? 'Pro paket abonelik süresi' : '7 günlük ücretsiz deneme süresi'} {isSuspended ? 'geçici olarak durdurulmuştur (Askıya Alındı).' : 'sona ermiştir.'}"
  );
  
  expiredPageStr = expiredPageStr.replace(
    "Kayıtlı tüm araçlarınız, servis notlarınız ve müşteri geçmişiniz\n              silinmemiştir. {planStatus.isPro ? 'Aboneliğinizi yenilediğiniz anda' : 'Pro pakete geçiş yaptığınız anda'} sisteminiz kaldığı\n              yerden anında aktif olacaktır.",
    "Kayıtlı tüm araçlarınız, servis notlarınız ve müşteri geçmişiniz silinmemiştir. {isSuspended ? 'Hesabınızın durumu hakkında bilgi almak için lütfen destek ekibimizle iletişime geçin.' : (planStatus.isPro ? 'Aboneliğinizi yenilediğiniz anda' : 'Pro pakete geçiş yaptığınız anda') + ' sisteminiz kaldığı yerden anında aktif olacaktır.'}"
  );
  
  expiredPageStr = expiredPageStr.replace(
    "<span>{planStatus.isPro ? 'WhatsApp ile Aboneliği Yenile' : 'WhatsApp ile Şimdi Pro\\'ya Geç'}</span>",
    "<span>{isSuspended ? 'WhatsApp Destek Hattı' : planStatus.isPro ? 'WhatsApp ile Aboneliği Yenile' : 'WhatsApp ile Şimdi Pro\\'ya Geç'}</span>"
  );
  
  fs.writeFileSync('src/pages/TrialExpiredPage.tsx', expiredPageStr);
  console.log('Fixed TrialExpiredPage.tsx');
}
