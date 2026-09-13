const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  // We want to find elements like <input, <textarea, <select
  // and modify their classNames. Since parsing JSX with regex is hard, 
  // we'll just do global string replacements that are safe and specific to form fields.
  
  // Actually, we can just replace specific strings globally if they apply to inputs.
  // We can look for `className="... bg-slate-50 border ..."`
  // Let's use a regex that matches `className="[^"]*bg-slate-50[^"]*border[^"]*"` or similar,
  // but it's safer to target the exact classes we know are used for inputs.
  
  // For inputs in WelcomeRegisterPage.tsx, RegisterPage.tsx, LoginPage.tsx, SettingsPage.tsx, VehicleForm.tsx, OnboardingCard.tsx
  const targetFiles = [
    'WelcomeRegisterPage.tsx',
    'RegisterPage.tsx',
    'LoginPage.tsx',
    'SettingsPage.tsx',
    'VehicleForm.tsx',
    'OnboardingCard.tsx'
  ];
  
  if (!targetFiles.some(f => filePath.endsWith(f))) return;
  
  console.log(`Processing ${filePath}`);
  
  // Make py-2.5 into py-3
  content = content.replace(/py-2\.5/g, 'py-3');
  
  // Make px-3.5 into px-4
  content = content.replace(/px-3\.5/g, 'px-4');
  
  // Make px-3 into px-4 (but be careful not to break flex-gaps or padding on small things)
  // Let's only do it inside className strings that contain input-specific classes like placeholder:text-slate-500
  
  const classStringRegex = /className=(["'{`])([^"'{`}]*placeholder:text-slate-500[^"'{`}]*)(["'}])/g;
  content = content.replace(classStringRegex, (match, p1, p2, p3) => {
    let classes = p2;
    classes = classes.replace(/\btext-xs\b/g, 'text-base');
    classes = classes.replace(/\btext-sm\b/g, 'text-base');
    classes = classes.replace(/\bpx-3\b/g, 'px-4');
    classes = classes.replace(/\bpl-9\b/g, 'pl-11');
    classes = classes.replace(/\bpr-3\b/g, 'pr-4');
    classes = classes.replace(/\bpr-10\b/g, 'pr-11');
    return `className=${p1}${classes}${p3}`;
  });
  
  // The textarea in VehicleForm doesn't have placeholder:text-slate-500? Actually it does.
  // Wait, the select in SettingsPage might not have placeholder:text-slate-500.
  // Let's also do focus:border-teal-500
  const classStringRegex2 = /className=(["'{`])([^"'{`}]*focus:border-teal-500[^"'{`}]*)(["'}])/g;
  content = content.replace(classStringRegex2, (match, p1, p2, p3) => {
    let classes = p2;
    classes = classes.replace(/\btext-xs\b/g, 'text-base');
    classes = classes.replace(/\btext-sm\b/g, 'text-base');
    classes = classes.replace(/\bpx-3\b/g, 'px-4');
    classes = classes.replace(/\bpl-9\b/g, 'pl-11');
    classes = classes.replace(/\bpr-3\b/g, 'pr-4');
    classes = classes.replace(/\bpr-10\b/g, 'pr-11');
    return `className=${p1}${classes}${p3}`;
  });
  
  // Let's also adjust the absolute icons left-3 -> left-4 to match pl-11
  content = content.replace(/left-3/g, 'left-4');
  // and the right-3 -> right-4 for password eye icon
  content = content.replace(/right-3/g, 'right-4');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  });
}

walk('./src');
