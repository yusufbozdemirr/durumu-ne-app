const fs = require('fs');

let banner = fs.readFileSync('src/components/common/TrialWarningBanner.tsx', 'utf-8');
banner = banner.replace("import { Clock, AlertTriangle, MessageCircle, X } from 'lucide-react';", "import { Clock, AlertTriangle, X } from 'lucide-react';\nimport { WhatsAppIcon } from './WhatsAppIcon';");
banner = banner.replace('<MessageCircle className="w-4 h-4 fill-white/20" />', '<WhatsAppIcon className="w-4 h-4" />');
fs.writeFileSync('src/components/common/TrialWarningBanner.tsx', banner);

let header = fs.readFileSync('src/components/layout/LandingHeader.tsx', 'utf-8');
if(header) {
  header = header.replace("import { MessageCircle, Menu, X, Car } from 'lucide-react';", "import { Menu, X, Car } from 'lucide-react';\nimport { WhatsAppIcon } from '../common/WhatsAppIcon';");
  header = header.replace('<MessageCircle className="w-4 h-4 fill-white/20" />', '<WhatsAppIcon className="w-4 h-4" />');
  fs.writeFileSync('src/components/layout/LandingHeader.tsx', header);
}
