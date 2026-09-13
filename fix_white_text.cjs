const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  // Replace text-white with text-slate-900 if there is no bg-* that implies a dark background.
  // Actually, let's just do a simple replacement for LandingPage.tsx first.
  content = content.replace(/text-white/g, 'text-slate-900');
  
  // Re-add text-white where bg is dark
  content = content.replace(/bg-teal-600([^>]+)text-slate-900/g, 'bg-teal-600$1text-white');
  content = content.replace(/bg-\[\#25D366\]([^>]+)text-slate-900/g, 'bg-[#25D366]$1text-white');
  content = content.replace(/bg-red-600([^>]+)text-slate-900/g, 'bg-red-600$1text-white');
  content = content.replace(/bg-slate-900([^>]+)text-slate-900/g, 'bg-slate-900$1text-white');
  content = content.replace(/bg-emerald-600([^>]+)text-slate-900/g, 'bg-emerald-600$1text-white');
  
  // Fix cases where text-white came before bg-*
  content = content.replace(/text-slate-900([^>]+)bg-teal-600/g, 'text-white$1bg-teal-600');
  content = content.replace(/text-slate-900([^>]+)bg-\[\#25D366\]/g, 'text-white$1bg-[#25D366]');
  content = content.replace(/text-slate-900([^>]+)bg-red-600/g, 'text-white$1bg-red-600');
  content = content.replace(/text-slate-900([^>]+)bg-slate-900/g, 'text-white$1bg-slate-900');
  content = content.replace(/text-slate-900([^>]+)bg-emerald-600/g, 'text-white$1bg-emerald-600');
  
  // Selection
  content = content.replace(/selection:text-slate-900/g, 'selection:text-white');
  
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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  });
}

walk('./src');
