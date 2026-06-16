const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Global literal replacements
      content = content.replace(/bg-linear-to-t from-\[#0b1712\] to-\[#122b1c\]/g, 'bg-gray-50');
      content = content.replace(/bg-linear-to-b from-\[#0a140f\] to-\[#0f2115\]/g, 'bg-white border border-gray-200');
      content = content.replace(/bg-linear-to-b from-\[#000006\] to-\[#050C35\]/g, 'bg-white border border-gray-200');
      content = content.replace(/bg-linear-to-t from-\[#000003\] to-\[#060F3F\]/g, 'bg-gray-50');

      let classMatch = content.match(/className=([\"\'])(.*?)\1/g);
      if (classMatch) {
        for (let cls of classMatch) {
          let originalCls = cls;
          let newCls = cls;
          
          newCls = newCls.replace(/bg-\[#0f1712\]/g, 'bg-white');
          newCls = newCls.replace(/bg-\[#0E0E10\]/g, 'bg-white');
          newCls = newCls.replace(/bg-\[#14261c\]/g, 'bg-[#F9FAFB]');
          newCls = newCls.replace(/bg-\[#131622\]/g, 'bg-[#F9FAFB]');
          newCls = newCls.replace(/bg-\[#18261d\]/g, 'bg-white shadow-sm border border-gray-200');
          newCls = newCls.replace(/bg-\[#18181A\]/g, 'bg-white shadow-sm border border-gray-200');
          newCls = newCls.replace(/bg-\[#122118\]/g, 'bg-white border border-gray-200');
          newCls = newCls.replace(/bg-\[#111424\]/g, 'bg-white border border-gray-200');
          newCls = newCls.replace(/bg-\[#14241a\]/g, 'bg-white');
          newCls = newCls.replace(/bg-\[#141624\]/g, 'bg-white border border-gray-200');
          newCls = newCls.replace(/bg-\[#262626\]/g, 'bg-gray-100');
          
          newCls = newCls.replace(/hover:bg-\[#18261d\]/g, 'hover:bg-gray-50');
          newCls = newCls.replace(/hover:bg-\[#18181A\]/g, 'hover:bg-gray-50');
          
          newCls = newCls.replace(/border-\[#262626\]/g, 'border-gray-200');
          newCls = newCls.replace(/border-gray-800\/50/g, 'border-gray-200');
          newCls = newCls.replace(/border-gray-800/g, 'border-gray-200');
          newCls = newCls.replace(/border-gray-700/g, 'border-gray-200');
          
          newCls = newCls.replace(/text-\[#D1D5DB\]/g, 'text-gray-500');
          newCls = newCls.replace(/text-gray-200/g, 'text-gray-900');
          newCls = newCls.replace(/text-gray-300/g, 'text-gray-500');
          newCls = newCls.replace(/text-gray-400/g, 'text-gray-500');
          newCls = newCls.replace(/placeholder-gray-600/g, 'placeholder-gray-400');
          newCls = newCls.replace(/text-\[#ffffff\]/g, 'text-gray-900');

          if (!newCls.includes('bg-[#3b6b4f]') && !newCls.includes('bg-[#4a8b66]') && !newCls.includes('from-[') && !newCls.includes('bg-linear-to') && !newCls.includes('bg-transparent')) {
             newCls = newCls.replace(/text-white/g, 'text-gray-900');
          }

          if (originalCls !== newCls) {
             content = content.replace(originalCls, newCls);
          }
        }
      }
      
      if (originalContent !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('./src');
