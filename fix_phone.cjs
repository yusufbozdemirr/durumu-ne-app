const fs = require('fs');

const file = 'src/pages/LandingPage.tsx';
let content = fs.readFileSync(file, 'utf-8');

// The original block
const oldBlock = `          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-[38px] p-3 sm:p-4 border-4 border-slate-200 shadow-2xl relative">
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-50 mr-2" />
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
              </div>
              {/* Screen Inner Container (Dark navy customer tracking interface) */}
              <div className="bg-slate-50 rounded-[28px] border border-slate-200 p-4 sm:p-5 space-y-4 text-slate-900">`;

const newBlock = `          <div className="max-w-[340px] mx-auto relative">
            <div className="bg-slate-900 rounded-[50px] p-2.5 sm:p-3 shadow-2xl relative ring-1 ring-slate-200/50">
              {/* Physical side buttons */}
              <div className="absolute top-32 -left-1 w-1 h-14 bg-slate-800 rounded-l-md"></div>
              <div className="absolute top-52 -left-1 w-1 h-14 bg-slate-800 rounded-l-md"></div>
              <div className="absolute top-40 -right-1 w-1 h-20 bg-slate-800 rounded-r-md"></div>

              {/* Frame inner edge */}
              <div className="bg-slate-900 rounded-[42px] border border-slate-800 p-1 relative overflow-hidden">
                {/* Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-7 bg-black rounded-full z-50 flex items-center justify-between px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/5 mx-1" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a3a] border border-blue-900/30" />
                </div>
                
                {/* Screen Inner Container */}
                <div className="bg-[#F8FAFC] rounded-[38px] p-4 sm:p-5 pt-12 space-y-4 text-slate-900 h-full w-full relative overflow-y-auto max-h-[700px] scrollbar-hide">`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(file, content);
console.log('Phone frame updated.');
