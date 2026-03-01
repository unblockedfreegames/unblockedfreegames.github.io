/**
 * Redesign fullscreen button - clean row with title + pill fullscreen btn
 * Run: node redesign-fullscreen-btn.js
 */

const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, 'game');

// Match ONLY the row inside desc-game (must include desc-game to avoid matching wrong row)
const oldBlockRegex = /<div class="desc-game">\s*<div class="row">\s*<div class="col-md col-lg">\s*<div class="mb-3">\s*<h1 class="h4"><strong>([^<]*)<\/strong><\/h1>\s*<\/div>\s*<\/div>\s*<div class="col-md-auto col-lg-auto[^"]*">[\s\S]*?title="Fullscreen">[\s\S]*?<\/button><\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<div class="description/g;

const fullscreenSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-32 0 512 512" width="18" height="18" fill="currentColor"><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"></path></svg>';

function buildNewBlock(title) {
  return `<div class="row align-items-center game-title-row mb-3">
                        <div class="col">
                            <h1 class="h4 mb-0"><strong>${title}</strong></h1>
                        </div>
                        <div class="col-auto">
                            <button class="btn-fullscreen" type="button" onclick="openFullscreen();" title="Fullscreen" aria-label="Fullscreen">
                                ${fullscreenSvg}
                                <span>Fullscreen</span>
                            </button>
                        </div>
                    </div>`;
}

function processFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  const orig = html;
  html = html.replace(oldBlockRegex, (_, title) => '<div class="desc-game">\n                    ' + buildNewBlock(title) + '\n                    <div class="description');
  if (html !== orig) {
    fs.writeFileSync(filePath, html);
    return true;
  }
  return false;
}

const gameFiles = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));
let count = 0;
gameFiles.forEach(f => {
  if (processFile(path.join(gameDir, f))) count++;
});
console.log('Updated', count, 'game pages');
