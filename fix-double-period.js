// Fix double period before </p> in Description paragraphs
const fs = require('fs');
const path = require('path');
const gameDir = path.join(__dirname, 'game');
const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));
let n = 0;
files.forEach(f => {
  const p = path.join(gameDir, f);
  let h = fs.readFileSync(p, 'utf8');
  const before = h;
  h = h.replace(/\.\.\s*<\/p>/g, '.</p>');
  if (h !== before) { fs.writeFileSync(p, h); n++; }
});
console.log('Fixed', n, 'files.');
