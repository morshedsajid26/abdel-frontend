const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#262626\]/g, replacement: 'bg-gray-100' },
  { regex: /bg-\[#1a1a1a\]\/50/g, replacement: 'bg-gray-50' },
  { regex: /bg-\[#0a0a2a\]/g, replacement: 'bg-gray-200' },
  { regex: /bg-\[#00135B\](\/50)?/g, replacement: 'bg-[#3b6b4f]' },
  { regex: /bg-\[#151515\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#070B14\]/g, replacement: 'bg-gray-100' },
  { regex: /bg-\[#0f1712\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#18261d\]/g, replacement: 'bg-green-50' },
  { regex: /text-\[#ffffff\]/g, replacement: 'text-gray-900' },
  { regex: /text-\[#D1D5DB\]/g, replacement: 'text-gray-600' },
  { regex: /hover:bg-\[#070B14\]/g, replacement: 'hover:bg-gray-100' },
  { regex: /hover:bg-\[#18261d\]/g, replacement: 'hover:bg-green-50' }
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
      
      // Specifically fix text-white in Sidebar active links or similar places without breaking green buttons
      content = content.replace(/bg-green-50 text-white/g, 'bg-green-50 text-gray-900');
      content = content.replace(/hover:bg-green-50 hover:text-white/g, 'hover:bg-green-50 hover:text-gray-900');

      if (originalContent !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('./src');
