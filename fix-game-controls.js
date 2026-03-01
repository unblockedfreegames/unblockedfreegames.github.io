/**
 * Fix "Game Controls (aka) How To play" / "Quick Summary of the Game" phrasing
 * on all game pages. Replaces with cleaner "How to play:" and "Summary:" format.
 * Run: node fix-game-controls.js
 */

const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, 'game');
const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));

function fixContent(html) {
  // Fix About: "Game Controls (aka) How To play X. Quick Summary of the Game Y" -> "How to play: X\n\nY"
  html = html.replace(
    /Game Controls \(aka\) How [Tt]o [Pp]lay\s+([\s\S]+?)\s+Quick Summary of the Game\s+/g,
    'How to play: $1\n\n'
  );

  // Fix About: "Game Controls (aka) How To play X" only (no Quick Summary)
  html = html.replace(
    /Game Controls \(aka\) How [Tt]o [Pp]lay\s+/g,
    'How to play: '
  );

  // Fix About: "Quick Summary of the Game X" or "Quick Summary of the Game: X" (standalone)
  html = html.replace(
    /Quick Summary of the Game:\s*/g,
    ''
  );
  html = html.replace(
    /Quick Summary of the Game\s+/g,
    ''
  );

  // Fix Description: "Game Controls (aka) How To play: X. Quick Summary of the Game: Y" -> structured
  html = html.replace(
    /<p>Game Controls \(aka\) How [Tt]o [Pp]lay:\s*([\s\S]+?)\s*Quick Summary of the Game:\s*([\s\S]*?)<\/p>/g,
    (_, controls, summary) => {
      const c = controls.trim().replace(/\s+/g, ' ');
      const s = summary.trim();
      return '<p><strong>How to play:</strong> ' + c + '</p><p>' + s + '</p>';
    }
  );

  // Fix Description: "Quick Summary of the Game: X" only (in <p>)
  html = html.replace(
    /<p>Quick Summary of the Game:\s*([\s\S]*?)<\/p>/g,
    '<p>$1</p>'
  );

  return html;
}

let count = 0;
files.forEach(f => {
  const filePath = path.join(gameDir, f);
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;
  html = fixContent(html);
  if (html !== original) {
    fs.writeFileSync(filePath, html);
    count++;
  }
});
console.log('Fixed', count, 'game pages.');
