const fs = require('fs');

const filesToUpdate = [
  'src/pages/LoginPage.tsx',
  'src/pages/WelcomeRegisterPage.tsx'
];

filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/inputMode="numeric"\s+pattern="\[0-9\]\*"\s+/g, '');
  content = content.replace(/placeholder="••••••"/g, 'placeholder="Şifreniz"');
  content = content.replace(/placeholder="Örn: 123456"/g, 'placeholder="Şifre"');
  fs.writeFileSync(file, content);
});
console.log('Password inputs updated.');
