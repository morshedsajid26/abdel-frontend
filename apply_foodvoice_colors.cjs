const fs = require('fs');
const path = require('path');

const replacements = [
  // Greens
  { regex: /bg-\[#3b6b4f\]/g, replacement: 'bg-[#205943]' },
  { regex: /text-\[#3b6b4f\]/g, replacement: 'text-[#205943]' },
  { regex: /border-\[#3b6b4f\]/g, replacement: 'border-[#205943]' },
  
  { regex: /bg-\[#4a8b66\]/g, replacement: 'bg-[#419977]' },
  { regex: /text-\[#4a8b66\]/g, replacement: 'text-[#419977]' },
  { regex: /border-\[#4a8b66\]/g, replacement: 'border-[#419977]' },
  { regex: /border-l-\[#4a8b66\]/g, replacement: 'border-l-[#419977]' },

  // Backgrounds
  { regex: /bg-gray-50/g, replacement: 'bg-[#f6f3eb]' },
  { regex: /bg-\[#F9FAFB\]/g, replacement: 'bg-[#fbfaf6]' },
  { regex: /bg-white/g, replacement: 'bg-[#ffffff]' }, // We'll keep cards white but change the global background to fbfaf6 in index.css
  { regex: /bg-gray-100/g, replacement: 'bg-[#edebe5]' },
  { regex: /bg-gray-200/g, replacement: 'bg-[#e6e4df]' },
  { regex: /bg-green-50/g, replacement: 'bg-[#e8ecea]' },
  { regex: /hover:bg-green-50/g, replacement: 'hover:bg-[#e8ecea]' },
  { regex: /hover:bg-gray-100/g, replacement: 'hover:bg-[#edebe5]' },
  { regex: /hover:bg-gray-50/g, replacement: 'hover:bg-[#f6f3eb]' },

  // Borders
  { regex: /border-gray-200/g, replacement: 'border-[#e6e4df]' },
  { regex: /border-gray-300/g, replacement: 'border-[#cccccc]' },

  // Text
  { regex: /text-gray-900/g, replacement: 'text-[#0e1217]' },
  { regex: /text-gray-800/g, replacement: 'text-[#151b21]' },
  { regex: /text-gray-600/g, replacement: 'text-[#50565c]' },
  { regex: /text-gray-500/g, replacement: 'text-[#9fa5ac]' },
  { regex: /!text-gray-900/g, replacement: '!text-[#0e1217]' },
  { regex: /!text-gray-500/g, replacement: '!text-[#9fa5ac]' },
  { regex: /placeholder:!text-gray-400/g, replacement: 'placeholder:!text-[#9fa5ac]' },
  { regex: /!placeholder-gray-500/g, replacement: '!placeholder-[#9fa5ac]' },
  { regex: /!placeholder-gray-400/g, replacement: '!placeholder-[#ccc]' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
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
