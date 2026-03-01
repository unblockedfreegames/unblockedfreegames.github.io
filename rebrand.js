const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const orig = content;

  // Replace branding - avoid changing URLs (ubg66.wallpaper.im) and script filenames
  // Replace "Unblocked Games 66" with "Unblocked Free Games"
  content = content.replace(/Unblocked Games 66/g, 'Unblocked Free Games');
  content = content.replace(/unblocked games 66/g, 'unblocked free games');
  content = content.replace(/Unblocked games 66/g, 'Unblocked Free Games');

  // Replace UBG66/ubg66 when used as brand (not in URLs or script paths)
  content = content.replace(/\bUBG66\b/g, 'Unblocked Free Games');
  content = content.replace(/\bubg66\b/g, 'Unblocked Free Games');

  if (content !== orig) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

const dirs = ['', 'game', 'category', 'terms', 'privacy', 'contact'];
let count = 0;

dirs.forEach(dir => {
  const base = path.join(__dirname, dir || '.');
  if (!fs.existsSync(base)) return;
  const files = dir ? fs.readdirSync(base).filter(f => f.endsWith('.html')) : ['index.html', 'search.html', '404.html'];
  files.forEach(file => {
    const filePath = path.join(base, file);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      if (processFile(filePath)) {
        count++;
        console.log('Updated:', filePath.replace(__dirname, ''));
      }
    }
  });
});

// Process feed.xml if exists
const feedPath = path.join(__dirname, 'feed.xml');
if (fs.existsSync(feedPath)) {
  if (processFile(feedPath)) count++;
}

// Update update-game-seo.js for future runs
const seoPath = path.join(__dirname, 'update-game-seo.js');
if (fs.existsSync(seoPath)) {
  let seo = fs.readFileSync(seoPath, 'utf8');
  seo = seo.replace(/Unblocked Games 66/g, 'Unblocked Free Games');
  fs.writeFileSync(seoPath, seo);
  console.log('Updated: update-game-seo.js');
}

console.log('\nDone. Updated', count, 'files.');
