const fs = require('fs');

const files = [
  'src/pages/PackagesPage.tsx',
  'src/pages/WelcomeRegisterPage.tsx',
  'src/pages/LandingPage.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('MessageCircle')) {
    content = content.replace("MessageCircle,", "");
    content = content.replace(/import \{.*?\} from 'lucide-react';/, (match) => {
      return match + "\nimport { WhatsAppIcon } from '../components/common/WhatsAppIcon';";
    });
    content = content.replace(/<MessageCircle.*?\/>/g, '<WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />');
    fs.writeFileSync(file, content);
  }
}
