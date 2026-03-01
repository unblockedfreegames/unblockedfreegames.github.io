/**
 * Remove h3, h2 from titles - use p (theme text) instead.
 * Only h1 = game title on game page remains as heading.
 * Run: node remove-h3-make-text.js
 */

const fs = require('fs');
const path = require('path');

const root = __dirname;
const gameDir = path.join(root, 'game');
const categoryDir = path.join(root, 'category');

// 1. Replace h3 with p (preserve classes) - for game cards, section titles, category titles
function replaceH3(html) {
  return html
    .replace(/<h3(\s+class="([^"]*)")?>/g, (_, __, cls) => cls ? `<p class="title-text ${cls}">` : '<p class="title-text">')
    .replace(/<\/h3>/g, '</p>');
}

// 2. Replace h2 "Description" on game pages
function replaceH2Description(html) {
  return html.replace(/<h2 class="fw-semibold mb-2">Description<\/h2>/g, '<p class="fw-semibold mb-2">Description</p>');
}

// 3. Replace h1, h2 on non-game pages (index, category, search)
function replaceIndexH1(html) {
  return html.replace(/<h1 class="h2 mb-2">([^<]*)<\/h1>/g, '<p class="h2 mb-2 title-text">$1</p>');
}
function replaceIndexH2(html) {
  return html
    .replace(/<h2 class="h5 text-uppercase fw-bold mb-3 mt-4">([^<]*)<\/h2>/g, '<p class="h5 text-uppercase fw-bold mb-3 mt-4 title-text">$1</p>')
    .replace(/<h2\s+class="([^"]*)">([^<]*)<\/h2>/g, '<p class="title-text $1">$2</p>');
}
function replaceSearchH1(html) {
  return html.replace(/<h1 class="h2">SEARCH GAMES<\/h1>/g, '<p class="h2 title-text">SEARCH GAMES</p>');
}

// Process game files: h3→p, h2 Description→p
const gameFiles = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));
let gameCount = 0;
gameFiles.forEach(f => {
  const fp = path.join(gameDir, f);
  let html = fs.readFileSync(fp, 'utf8');
  const orig = html;
  html = replaceH3(html);
  html = replaceH2Description(html);
  if (html !== orig) {
    fs.writeFileSync(fp, html);
    gameCount++;
  }
});
console.log('Updated', gameCount, 'game pages');

// Process index
let idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
idx = replaceH3(idx);
idx = replaceIndexH1(idx);
idx = replaceIndexH2(idx);
fs.writeFileSync(path.join(root, 'index.html'), idx);
console.log('Updated index.html');

// Process search
let search = fs.readFileSync(path.join(root, 'search.html'), 'utf8');
search = replaceH3(search);
search = replaceSearchH1(search);
fs.writeFileSync(path.join(root, 'search.html'), search);
console.log('Updated search.html');

// Process category pages: h3→p
const catFiles = fs.readdirSync(categoryDir).filter(f => f.endsWith('.html'));
catFiles.forEach(f => {
  const fp = path.join(categoryDir, f);
  let html = fs.readFileSync(fp, 'utf8');
  html = replaceH3(html);
  fs.writeFileSync(fp, html);
});
console.log('Updated', catFiles.length, 'category pages');
