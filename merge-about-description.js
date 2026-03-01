/**
 * Merge About and Description into one unit per game.
 * Format: h2 "Description" + p "Play [Game Name]..."
 * Run: node merge-about-description.js
 */

const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, 'game');
const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));

function slugToName(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .replace(/\bIo\b/gi, 'io')
    .replace(/\b2d\b/gi, '2D')
    .replace(/\b3d\b/gi, '3D')
    .replace(/\bLol\b/g, 'LOL')
    .replace(/\bTd\b/g, 'TD')
    .replace(/\bFnaf\b/gi, 'FNAF')
    .replace(/\bFnf\b/gi, 'FNF');
}

function extractDescriptionText(descHtml) {
  let raw = descHtml.replace(/<p>/g, '\n').replace(/<\/p>/g, '\n').replace(/<[^>]+>/g, '');
  // Extract part after "Brief Description About The Game:"
  const brief = raw.match(/Brief Description About The Game:\s*([\s\S]+)/i);
  if (brief) return brief[1].replace(/\s+/g, ' ').trim();
  // Strip "How to play:" and "Main Controls" blocks
  let text = descHtml
    .replace(/<p><strong>How to play:<\/strong>\s*[^<]*<\/p>/gi, '')
    .replace(/<p>Main Controls[^<]*<\/p>/gi, '')
    .replace(/Main Controls For Playing:[^#]*(?:#[^#]*)*/gi, '')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const idx = text.indexOf('Brief Description About The Game:');
  if (idx >= 0) text = text.substring(idx + 33).trim();
  return text;
}

function extractControls(aboutContent, descHtml) {
  const m = aboutContent.match(/How to play:\s*(.+?)(?:\n|$)/i) ||
    descHtml.match(/<strong>How to play:<\/strong>\s*([^<]+)/i);
  return m ? m[1].trim() : null;
}

function buildPlayParagraph(displayName, descText, controls) {
  let text = descText;
  // Ensure starts with "Play [Game Name]"
  const nameRegex = new RegExp(`^${displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i');
  if (nameRegex.test(text)) {
    text = 'Play "' + displayName + '" ' + text.replace(nameRegex, '').replace(/^is\s+/i, '- ');
  } else if (/^[A-Z]/.test(text)) {
    text = 'Play "' + displayName + '". ' + text;
  } else {
    text = 'Play "' + displayName + '" ' + text;
  }
  // Clean up: "- - " -> "- "
  text = text.replace(/\-\s+\-\s+/g, '- ');
  if (controls) {
    const c = controls.replace(/\.+$/, '').trim();
    text += (c ? ' Use ' + c.toLowerCase().replace(/\.+$/, '') + '.' : '');
  }
  return text.replace(/\.\.+/g, '.');
}

function processFile(filePath) {
  const slug = path.basename(filePath, '.html');
  const displayName = slugToName(slug);
  let html = fs.readFileSync(filePath, 'utf8');

  const blockRegex = /<div class="about pb-2">\s*<h3[^>]*>About<\/h3>\s*([\s\S]*?)<\/div>\s*<div class="description pb-2">\s*<h3[^>]*>Description<\/h3>\s*([\s\S]*?)<\/div>/;
  const m = html.match(blockRegex);
  if (!m) return false;

  const aboutContent = m[1].trim();
  const descHtml = m[2];

  const descText = extractDescriptionText(descHtml);
  if (!descText) return false;

  const controls = extractControls(aboutContent, descHtml);
  const paragraph = buildPlayParagraph(displayName, descText, controls);

  const replacement = `<div class="description pb-2">
                        <h2 class="fw-semibold mb-2">Description</h2>
                        <p>${paragraph}</p>
                    </div>`;

  html = html.replace(blockRegex, replacement);
  fs.writeFileSync(filePath, html);
  return true;
}

let count = 0;
files.forEach(f => {
  if (processFile(path.join(gameDir, f))) count++;
});
console.log('Merged About+Description on', count, 'game pages.');
