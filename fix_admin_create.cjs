const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');

// Change the validation for password
content = content.replace(
  `    if (!/^\\d{6,}$/.test(createForm.password)) {
      setFormError('Şifre en az 6 haneli sadece rakamlardan oluşmalıdır (Örn: 123456).');
      return;
    }`,
  `    if (createForm.password.length < 6) {
      setFormError('Şifre en az 6 karakter olmalıdır.');
      return;
    }`
);

// Add accountStatus to createForm initial state
content = content.replace(
  "plan: 'trial' as 'pro' | 'trial',",
  "plan: 'trial' as 'pro' | 'trial',\n    accountStatus: 'active' as 'active' | 'suspended',"
);

content = content.replace(
  "password: '',\n        plan: 'trial',",
  "password: '',\n        plan: 'trial',\n        accountStatus: 'active',"
);

// Include accountStatus in adminCreateBusiness payload
content = content.replace(
  "paketTuru: isPro ? 'pro' : 'deneme',",
  "paketTuru: isPro ? 'pro' : 'deneme',\n        accountStatus: createForm.accountStatus,"
);

// Add the accountStatus select in the Create Modal HTML
const createModalPlanSelect = `                    <option value="pro">Pro Paket</option>
                  </select>
                </div>
              </div>`;

const createModalStatusSelect = `                    <option value="pro">Pro Paket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Hesap Durumu
                  </label>
                  <select
                    value={createForm.accountStatus}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, accountStatus: e.target.value as any })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="suspended">Askıya Alındı (Kapalı)</option>
                  </select>
                </div>
              </div>`;

content = content.replace(createModalPlanSelect, createModalStatusSelect);

// Fix inputMode on password field in AdminPage (if any)
content = content.replace(/inputMode="numeric"\n\s+pattern="\[0-9\]\*"\n/g, '');

fs.writeFileSync('src/pages/AdminPage.tsx', content);
