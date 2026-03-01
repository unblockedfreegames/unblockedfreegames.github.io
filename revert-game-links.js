#!/usr/bin/env node
/**
 * Revert game source links and wallpaper links to initial state.
 * Fixes incorrect changes from rebrand that altered URLs.
 *
 * 1. Wallpaper iframe: https://Unblocked Free Games.wallpaper.im/ → https://ubg66.wallpaper.im/
 * 2. Game iframe: https://unblockedfreegames66.gitlab.io/ → https://unblockedgames66.gitlab.io/
 */

const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, 'game');
const replacements = [
  ['https://Unblocked Free Games.wallpaper.im/', 'https://ubg66.wallpaper.im/'],
  ['https://unblockedfreegames66.gitlab.io/', 'https://unblockedgames66.gitlab.io/'],
];

const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));
let totalReplacements = 0;

for (const file of files) {
  const filePath = path.join(gameDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [from, to] of replacements) {
    const count = (content.match(new RegExp(escapeRegex(from), 'g')) || []).length;
    if (count > 0) {
      content = content.split(from).join(to);
      totalReplacements += count;
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log('Updated:', file);
  }
}

// Also fix adsense script
const adsensePath = path.join(__dirname, 'assets', 'js', 'adsense_ubg66_v1.js');
if (fs.existsSync(adsensePath)) {
  let adsense = fs.readFileSync(adsensePath, 'utf8');
  if (adsense.includes('unblockedfreegames66.gitlab.io')) {
    adsense = adsense.replace(/unblockedfreegames66\.gitlab\.io/g, 'unblockedgames66.gitlab.io');
    fs.writeFileSync(adsensePath, adsense);
    console.log('Updated: assets/js/adsense_ubg66_v1.js');
    totalReplacements++;
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log('\nDone. Total replacements:', totalReplacements);
