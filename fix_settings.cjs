const fs = require('fs');
let content = fs.readFileSync('src/pages/SettingsPage.tsx', 'utf-8');

// For disabled inputs, change text-base back to text-sm
content = content.replace(/className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"/g, 'className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-500 cursor-not-allowed"');

fs.writeFileSync('src/pages/SettingsPage.tsx', content);
