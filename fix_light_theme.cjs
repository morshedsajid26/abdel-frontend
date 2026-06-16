const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#0a1024\]/g, replacement: 'bg-gray-50' },
  { regex: /bg-\[#141416\]/g, replacement: 'bg-[#F9FAFB]' },
  { regex: /bg-\[#111111\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#111114\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#131313\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#1A1A1A\]/g, replacement: 'bg-gray-50' },
  { regex: /border-\[#1A1A1A\]/g, replacement: 'border-gray-200' },
  { regex: /border-\[#272727\]/g, replacement: 'border-gray-200' },
  { regex: /border-\[#A0A0A0\]/g, replacement: 'border-gray-200' },
  { regex: /border-white\/5/g, replacement: 'border-gray-300' },
  { regex: /bg-\[#1A2255\]/g, replacement: 'bg-gray-100' },
  { regex: /bg-\[#232D70\]/g, replacement: 'bg-gray-200' },
  { regex: /hover:bg-\[#232D70\]/g, replacement: 'hover:bg-gray-200' },
  { regex: /bg-\[#1a1a1a\]\/50/g, replacement: 'bg-gray-50' },
  { regex: /text-gray-100/g, replacement: 'text-gray-900' },
  { regex: /text-gray-200/g, replacement: 'text-gray-800' },
  { regex: /text-white/g, replacement: 'text-gray-900' },
  { regex: /!text-white/g, replacement: '!text-gray-900' },
  { regex: /!placeholder-white/g, replacement: '!placeholder-gray-500' },
  { regex: /placeholder:!text-gray-600/g, replacement: 'placeholder:!text-gray-400' },
  { regex: /text-\[#D1D5DB\]/g, replacement: 'text-gray-500' },
  { regex: /bg-\[#18261d\]/g, replacement: 'bg-green-50' },
  { regex: /text-\[#ffffff\]/g, replacement: 'text-gray-900' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      let classMatch = content.match(/className=([\"\'])(.*?)\1/g);
      let classMatchTick = content.match(/className=\{`(.*?)`\}/g);
      let inputClassMatch = content.match(/inputClass=([\"\'])(.*?)\1/g);
      let inputClassMatchTick = content.match(/inputClass=\{`(.*?)`\}/g);
      let optionClassMatch = content.match(/optionClass=([\"\'])(.*?)\1/g);

      const allMatches = [
        ...(classMatch || []), 
        ...(classMatchTick || []),
        ...(inputClassMatch || []),
        ...(inputClassMatchTick || []),
        ...(optionClassMatch || [])
      ];

      if (allMatches.length > 0) {
        for (let cls of allMatches) {
          let originalCls = cls;
          let newCls = cls;
          
          for (const rule of replacements) {
            // Protect buttons and specific components from having text-gray-900 if they have a green background
            if (rule.replacement === 'text-gray-900' || rule.replacement === '!text-gray-900') {
               if (newCls.includes('bg-[#3b6b4f]') || newCls.includes('bg-[#4a8b66]') || newCls.includes('from-[') || newCls.includes('bg-linear-to') || newCls.includes('text-[#3b6b4f]') || newCls.includes('text-green-400')) {
                 continue; // skip text-white -> text-gray-900 replacement for these
               }
            }
            newCls = newCls.replace(rule.regex, rule.replacement);
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
