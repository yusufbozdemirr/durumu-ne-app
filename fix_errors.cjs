const fs = require('fs');

// Fix TrialReminderModal
let modalContent = fs.readFileSync('src/components/common/TrialReminderModal.tsx', 'utf-8');
modalContent = modalContent.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/components/common/TrialReminderModal.tsx', modalContent);
console.log('Fixed TrialReminderModal.tsx');

// Fix AdminPage Duplicate accountStatus
let adminContent = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');
adminContent = adminContent.replace(
`        paketTuru: isPro ? 'pro' : 'deneme',
        accountStatus: createForm.accountStatus,
        accountStatus: editForm.accountStatus,`,
`        paketTuru: isPro ? 'pro' : 'deneme',
        accountStatus: editForm.accountStatus,`
);
fs.writeFileSync('src/pages/AdminPage.tsx', adminContent);
console.log('Fixed AdminPage.tsx');
