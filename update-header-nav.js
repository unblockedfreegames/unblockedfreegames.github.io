#!/usr/bin/env node
/**
 * Remove navbar-nav ms-xl-auto (gamepad + count), move social icons to the right.
 */

const fs = require('fs');
const path = require('path');

const htmlDir = __dirname;
const gameDir = path.join(__dirname, 'game');
const categoryDir = path.join(__dirname, 'category');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Must have the nav structure
  if (!content.includes('navbar-nav ms-xl-auto') || !content.includes('form-search')) {
    return false;
  }

  // 1. Remove the navbar-nav ul block (gamepad icon + 470/474)
  content = content.replace(
    /\s*<ul class="navbar-nav ms-xl-auto">[\s\S]*?<\/ul>/,
    ''
  );

  // 2. Capture social block (3 links - flexible whitespace)
  const socialRe = /<a class="social" href="https:\/\/discord\.com\/invite\/gUeBzA2jaF"[^>]*>[\s\S]*?<\/a>\s*<a class="social" href="https:\/\/www\.facebook\.com\/Games235\/"[^>]*>[\s\S]*?<\/a>\s*<a class="social" href="https:\/\/www\.youtube\.com\/@ubg235"[^>]*>[\s\S]*?<\/a>/;
  const socialMatch = content.match(socialRe);
  if (!socialMatch) return false;

  const socialHtml = socialMatch[0];

  // 3. Remove social from current position (between category-btn and form-search)
  content = content.replace(socialRe, '');

  // 4. Insert social icons after form-search, wrapped in ms-xl-auto div
  const insertRe = /(<div class="form-search ms-xl-4 mb-3 mb-lg-0">[\s\S]*?<\/div>)\s*(<\/div>\s*<\/div>\s*<\/nav>)/;
  const newBlock = `<div class="d-flex align-items-center ms-xl-auto">${socialHtml}</div>`;
  content = content.replace(insertRe, `$1\n                    ${newBlock}\n                $2`);

  fs.writeFileSync(filePath, content);
  return true;
}

function walkDir(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      walkDir(fullPath, files);
    } else if (item.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allHtml = [
  path.join(htmlDir, 'index.html'),
  path.join(htmlDir, 'search.html'),
  path.join(htmlDir, 'terms.html'),
  path.join(htmlDir, 'privacy.html'),
  path.join(htmlDir, 'contact.html'),
  ...walkDir(gameDir),
  ...walkDir(categoryDir),
].filter(p => fs.existsSync(p));

let count = 0;
for (const file of allHtml) {
  try {
    if (updateFile(file)) {
      count++;
      console.log('Updated:', path.relative(__dirname, file));
    }
  } catch (e) {
    console.error('Error', file, e.message);
  }
}
console.log('\nDone. Updated', count, 'files');
