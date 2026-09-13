const fs = require('fs');
let content = fs.readFileSync('src/pages/LandingPage.tsx', 'utf-8');

// Remove all incorrect lines
content = content.replace(/import \{ WhatsAppIcon \} from '\.\.\/components\/common\/WhatsAppIcon';\n/g, '');
// Add it once at the top
content = "import { WhatsAppIcon } from '../components/common/WhatsAppIcon';\n" + content;

// Also replace MessageCircle with WhatsAppIcon where it makes sense
content = content.replace(/<MessageCircle/g, '<WhatsAppIcon');

fs.writeFileSync('src/pages/LandingPage.tsx', content);
