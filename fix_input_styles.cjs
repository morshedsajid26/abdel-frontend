const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /!text-gray-300/g, replacement: '!text-[#0e1217]' },
  { regex: /text-gray-300/g, replacement: 'text-[#0e1217]' },
  { regex: /!placeholder-gray-600/g, replacement: '!placeholder-[#9fa5ac]' },
  { regex: /!border-transparent focus:!border-\[#e6e4df\]\/50/g, replacement: '!border-[#e6e4df] focus:!border-[#205943]' },
  { regex: /border-transparent focus:border-\[#e6e4df\]\/50/g, replacement: 'border-[#e6e4df] focus:border-[#205943]' }
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
      
      for (const rule of replacements) {
        content = content.replace(rule.regex, rule.replacement);
      }
      
      if (originalContent !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('./src');
