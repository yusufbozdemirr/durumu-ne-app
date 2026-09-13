const fs = require('fs');

let content = fs.readFileSync('src/components/layout/Topbar.tsx', 'utf-8');

// We need to import { useApp } and we already have it.
content = content.replace(
  "const { isAdmin } = useApp();",
  "const { isAdmin, planStatus, setIsPlanModalOpen } = useApp();"
);

content = content.replace(
  "import { Menu, Plus, Shield } from 'lucide-react';",
  "import { Menu, Plus, Shield, Crown, Clock } from 'lucide-react';"
);

// Add the Pro/Trial badge
const badgeBlock = `        {/* Pro / Trial Badge */}
        {!isAdmin && (
          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors shadow-xs cursor-pointer"
            style={
              planStatus.isPro
                ? { backgroundColor: '#F0FDFA', color: '#0D9488', borderColor: '#CCFBF1' }
                : { backgroundColor: '#FFFBEB', color: '#B45309', borderColor: '#FEF3C7' }
            }
          >
            {planStatus.isPro ? <Crown className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {planStatus.isPro ? 'Pro Paket' : 'Deneme Sürümü'}
            </span>
          </button>
        )}
        
        {/* For Owner: "Yeni Araç" button */}`;

content = content.replace("{/* For Owner: \"Yeni Araç\" button */}", badgeBlock);

fs.writeFileSync('src/components/layout/Topbar.tsx', content);
