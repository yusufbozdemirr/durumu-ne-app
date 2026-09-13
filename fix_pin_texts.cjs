const fs = require('fs');

let welcome = fs.readFileSync('src/pages/WelcomeRegisterPage.tsx', 'utf-8');
welcome = welcome.replace("Şifre (Sadece Sayı)", "Şifre");
welcome = welcome.replace("En az 6 haneli PIN", "En az 6 karakter");
welcome = welcome.replace(
  /<p className="text-\[10px\] text-slate-500 mt-1">\s*Girişinizi kolaylaştırmak için şifreniz yalnızca sayılardan\s*oluşmalıdır\.\s*<\/p>/g,
  ""
);
fs.writeFileSync('src/pages/WelcomeRegisterPage.tsx', welcome);

let login = fs.readFileSync('src/pages/LoginPage.tsx', 'utf-8');
login = login.replace("Şifre (Sayısal PIN)", "Şifre");
login = login.replace("Sadece Rakam", "En az 6 karakter");
fs.writeFileSync('src/pages/LoginPage.tsx', login);

let admin = fs.readFileSync('src/pages/AdminPage.tsx', 'utf-8');
admin = admin.replace("Şifre (Sayısal PIN) *", "Şifre *");
admin = admin.replace("En az 6 haneli sadece rakam", "En az 6 karakter");
fs.writeFileSync('src/pages/AdminPage.tsx', admin);

console.log("PIN texts fixed.");
