/**
 * Remove game page controls: share, gameplays, like/dislike, card-category, rating stars.
 * Update footer: Copyright © 2026 Unblocked Free Games
 * Run: node remove-game-controls-update-footer.js
 */

const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, 'game');

// 1. Remove card-category line
const cardCategoryRegex = /<div class="card-category"><a href="[^"]*">[^<]*<\/a><\/div>\s*/g;

// 2. Remove rating-star div (5 star SVGs)
const ratingStarRegex = /<div class="ms-auto rating-star mt-2">[\s\S]*?<\/svg><\/div>\s*/g;

// 3. Remove Share dropdown (the one with title="Share")
const shareRegex = /<div data-bs-toggle="tooltip" data-bss-tooltip="" class="dropdown mx-1 py-1" title="Share">[\s\S]*?<\/div>\s*/g;

// 4. Remove w-lg-200 block (gameplays, progress bar, like/dislike)
const gameplaysBlockRegex = /<div class="w-lg-200 ms-4">[\s\S]*?dislike-count">[\s\S]*?<\/span>\s*<\/div>\s*<\/div>\s*/g;

// 5. Footer: update to Copyright © 2026 Unblocked Free Games
const footerRegex = /<div class="fs-xs"><span>Copyright © 2026 Unblocked Free Games\. All rights reserved\.<\/span>\s*(?:<p>[^<]*<\/p>\s*)?<\/div>/g;
const footerReplacement = '<div class="fs-xs"><span>Copyright © 2026 Unblocked Free Games</span></div>';

function processGameFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const orig = html;

  html = html.replace(cardCategoryRegex, '');
  html = html.replace(ratingStarRegex, '');
  html = html.replace(shareRegex, '');
  html = html.replace(gameplaysBlockRegex, '');
  html = html.replace(footerRegex, footerReplacement);

  if (html !== orig) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

function processOtherHtml(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const orig = html;
  html = html.replace(footerRegex, footerReplacement);
  if (html !== orig) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

// Process game files
const gameFiles = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));
let gameCount = 0;
gameFiles.forEach(f => {
  if (processGameFile(path.join(gameDir, f))) gameCount++;
});
console.log('Updated', gameCount, 'game pages');

// Process other HTML (index, category, search, terms, privacy, contact)
const otherPaths = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'search.html'),
  path.join(__dirname, '404.html'),
  path.join(__dirname, 'terms', 'index.html'),
  path.join(__dirname, 'privacy', 'index.html'),
  path.join(__dirname, 'contact', 'index.html'),
];
const categoryDir = path.join(__dirname, 'category');
if (fs.existsSync(categoryDir)) {
  fs.readdirSync(categoryDir).filter(f => f.endsWith('.html')).forEach(f => {
    otherPaths.push(path.join(categoryDir, f));
  });
}
let otherCount = 0;
otherPaths.forEach(p => {
  if (fs.existsSync(p) && processOtherHtml(p)) otherCount++;
});
console.log('Updated footer on', otherCount, 'other pages');
