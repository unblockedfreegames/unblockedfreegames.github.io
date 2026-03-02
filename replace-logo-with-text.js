#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const re = /<a class="navbar-brand me-lg-4" href="([^"]*)"><img src="assets\/img\/logo\.png"[^>]*><\/a>/g;

const dirs = [__dirname, path.join(__dirname, 'game'), path.join(__dirname, 'category'), path.join(__dirname, 'contact'), path.join(__dirname, 'privacy'), path.join(__dirname, 'terms')];
let count = 0;
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const p = path.join(dir, f);
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('logo.png')) {
      const newC = c.replace(re, (_, href) => `<a class="navbar-brand me-lg-4 navbar-brand-text" href="${href}">Unblocked Free Games</a>`);
      if (newC !== c) {
        fs.writeFileSync(p, newC);
        count++;
      }
    }
  }
}
console.log('Replaced logo with text in', count, 'files');
