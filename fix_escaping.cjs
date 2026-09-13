const fs = require('fs');

let content = fs.readFileSync('src/components/common/TrialWarningBanner.tsx', 'utf-8');
content = content.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/components/common/TrialWarningBanner.tsx', content);

let modalContent = fs.readFileSync('src/components/common/TrialReminderModal.tsx', 'utf-8');
modalContent = modalContent.replace(/\\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/components/common/TrialReminderModal.tsx', modalContent);

console.log('Fixed Escaping.');
