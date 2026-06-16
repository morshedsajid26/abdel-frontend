const fs = require('fs');
const path = require('path');

const replacements = [
  // Aggressively replace all dark hex backgrounds starting with 0, 1, or 2 (which are very dark)
  // e.g. #0a1024, #141416, #191919, #252525, etc.
  { regex: /bg-\[#(0|1|2)[0-9a-fA-F]{5}\]/g, replacement: 'bg-white' },
  
  // Replace dark borders
  { regex: /border-\[#(0|1|2|3)[0-9a-fA-F]{5}\]/g, replacement: 'border-gray-200' },
  
  // Replace specific text and hover classes
  { regex: /text-gray-100/g, replacement: 'text-gray-900' },
  { regex: /text-gray-200/g, replacement: 'text-gray-900' },
  { regex: /text-gray-300/g, replacement: 'text-gray-500' },
  { regex: /text-gray-400/g, replacement: 'text-gray-500' },
  { regex: /text-\[#D1D5DB\]/g, replacement: 'text-gray-500' },
  { regex: /text-\[#ffffff\]/g, replacement: 'text-gray-900' },
  { regex: /!text-white/g, replacement: '!text-gray-900' },
  { regex: /placeholder:!text-gray-600/g, replacement: 'placeholder:!text-gray-400' },
  { regex: /!placeholder-white/g, replacement: '!placeholder-gray-400' },
  { regex: /hover:bg-gray-800\/50/g, replacement: 'hover:bg-gray-100' },
  { regex: /hover:bg-gray-800/g, replacement: 'hover:bg-gray-100' },
  { regex: /border-gray-600/g, replacement: 'border-gray-200' },
  { regex: /border-gray-700/g, replacement: 'border-gray-200' },
  { regex: /border-gray-800/g, replacement: 'border-gray-200' },
  { regex: /border-white\/10/g, replacement: 'border-gray-200' },
  { regex: /border-white\/5/g, replacement: 'border-gray-200' }
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
            newCls = newCls.replace(rule.regex, rule.replacement);
          }

          // Special logic for text-white
          if (!newCls.includes('bg-[#3b6b4f]') && !newCls.includes('bg-[#4a8b66]') && !newCls.includes('from-[') && !newCls.includes('bg-linear-to') && !newCls.includes('bg-blue-600') && !newCls.includes('bg-green-') && !newCls.includes('text-[#3b6b4f]')) {
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
