#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dirs = [__dirname, path.join(__dirname, 'game'), path.join(__dirname, 'category'), path.join(__dirname, 'contact'), path.join(__dirname, 'privacy'), path.join(__dirname, 'terms')];
let count = 0;
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('logo.png') && c.includes('height="60"')) {
      c = c.replace(/(<img[^>]*logo\.png[^>]*)height="60"/g, '$1height="30"');
      fs.writeFileSync(p, c);
      count++;
    }
  }
}
console.log('Reverted logo height to 30 in', count, 'files');
