const fs = require('fs');
let content = fs.readFileSync('src/pages/LandingPage.tsx', 'utf-8');

// The top right header button
content = content.replace(/text-teal-600 bg-teal-50\/70 hover:bg-teal-100\/80 border-teal-200/g, 'text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30');
content = content.replace(/className="w-4 h-4 text-teal-600"/g, 'className="w-4 h-4 text-[#25D366]"');

// The hero button
content = content.replace(/text-teal-600 bg-teal-50\/70 hover:bg-teal-100\/80 border border-teal-200/g, 'text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30');

// Replace fill-white with text-white on WhatsAppIcon
content = content.replace(/<WhatsAppIcon className="([^"]+) fill-white"/g, '<WhatsAppIcon className="$1 text-white"');

fs.writeFileSync('src/pages/LandingPage.tsx', content);
