const fs = require('fs');

function fixAuthPage(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Fix handlePasswordChange
  const oldHandle = /const handlePasswordChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{\s*setPassword\(e\.target\.value\);\s*setError\(''\);\s*\};/g;
  const newHandle = `const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\\D/g, '');
    setPassword(val);
    setError('');
  };`;
  content = content.replace(oldHandle, newHandle);

  // 2. Add inputMode and pattern to password input
  content = content.replace(/(id="input-(?:login|register)-password"\s+)(?:inputMode="numeric"\s+pattern="\[0-9\]\*"\s+)?required/g, '$1inputMode="numeric"\npattern="[0-9]*"\nrequired');

  fs.writeFileSync(filePath, content);
}

fixAuthPage('src/pages/LoginPage.tsx');
fixAuthPage('src/pages/WelcomeRegisterPage.tsx');
fixAuthPage('src/pages/RegisterPage.tsx');

// For AdminPage.tsx
let adminPath = 'src/pages/AdminPage.tsx';
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf-8');
  
  // Update onChange
  content = content.replace(
    /setCreateForm\(\{ \.\.\.createForm, password: e\.target\.value(?: as any)? \}\)/g,
    "setCreateForm({ ...createForm, password: e.target.value.replace(/\\D/g, '') })"
  );
  
  // Add inputMode to the password input in admin
  content = content.replace(
    /(value=\{createForm\.password\}[\s\S]*?onChange=\{[\s\S]*?\}[\s\S]*?className="[^"]*")/g,
    '$1\ninputMode="numeric"\npattern="[0-9]*"'
  );

  fs.writeFileSync(adminPath, content);
}

console.log("Restored numeric only passwords.");
