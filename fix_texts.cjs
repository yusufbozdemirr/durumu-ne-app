const fs = require('fs');

const files = [
  'src/pages/WelcomeRegisterPage.tsx',
  'src/pages/RegisterPage.tsx',
  'src/pages/LoginPage.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf-8');
  
  content = content.replace(/Lütfen sadece sayılardan oluşan şifrenizi giriniz\./g, 'Lütfen şifrenizi giriniz.');
  content = content.replace(/Şifreniz en az 6 haneli bir sayı olmalıdır \(Örn: 123456\)\./g, 'Şifreniz en az 6 karakter olmalıdır.');
  
  // Also fix handlePasswordChange if it was stripping non-numbers
  const oldHandle = `const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\\D/g, '');
    setPassword(val);
    setError('');
  };`;
  
  const newHandle = `const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };`;
  
  content = content.replace(oldHandle, newHandle);
  
  fs.writeFileSync(file, content);
});
console.log('Texts updated');
