const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#070d19\]/g, replace: 'bg-slate-50' },
  { regex: /bg-\[#0a1122\]/g, replace: 'bg-white' },
  { regex: /bg-\[#0c152a\]/g, replace: 'bg-white' },
  
  { regex: /border-slate-800/g, replace: 'border-slate-200' },
  { regex: /border-slate-700/g, replace: 'border-slate-200' },
  
  { regex: /text-slate-400/g, replace: 'text-slate-500' },
  { regex: /text-slate-300/g, replace: 'text-slate-600' },
  { regex: /text-slate-200/g, replace: 'text-slate-700' },
  { regex: /text-slate-100/g, replace: 'text-slate-900' },
  
  { regex: /bg-slate-800/g, replace: 'bg-slate-100' },
  { regex: /bg-slate-900/g, replace: 'bg-slate-50' },
  
  { regex: /bg-emerald-950/g, replace: 'bg-teal-50' },
  { regex: /bg-emerald-900/g, replace: 'bg-teal-100' },
  { regex: /bg-emerald-600/g, replace: 'bg-teal-600' },
  { regex: /bg-emerald-500/g, replace: 'bg-teal-500' },
  
  { regex: /text-emerald-400/g, replace: 'text-teal-600' },
  { regex: /text-emerald-300/g, replace: 'text-teal-600' },
  { regex: /text-emerald-500/g, replace: 'text-teal-600' },
  
  { regex: /border-emerald-800/g, replace: 'border-teal-200' },
  { regex: /border-emerald-700/g, replace: 'border-teal-200' },
  { regex: /border-emerald-500/g, replace: 'border-teal-500' },
  
  { regex: /hover:bg-slate-800/g, replace: 'hover:bg-slate-100' },
  { regex: /hover:bg-slate-700/g, replace: 'hover:bg-slate-200' },
  { regex: /hover:border-slate-700/g, replace: 'hover:border-slate-300' },
  
  { regex: /hover:bg-emerald-900/g, replace: 'hover:bg-teal-100' },
  { regex: /hover:bg-emerald-500/g, replace: 'hover:bg-teal-700' },
  { regex: /hover:text-emerald-400/g, replace: 'hover:text-teal-700' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });
  
  // Specific fix for text-white on buttons/badges where we changed bg to white but want dark text
  // Or where we changed text-white to text-slate-900.
  // Actually text-white wasn't universally replaced.
  
  // Custom manual-like adjustments
  // We need text-white on buttons that are bg-teal-600
  // Instead of guessing, we can just write it.
  
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
