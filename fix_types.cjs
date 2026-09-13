const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf-8');
content = content.replace(/'active' \| 'trial_expired' \| 'suspended' \| 'pending_approval'/g, "'active' | 'trial_expired' | 'pro_expired' | 'suspended' | 'pending_approval'");
fs.writeFileSync('src/types.ts', content);
