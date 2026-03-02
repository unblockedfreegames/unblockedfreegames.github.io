#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const googleTag = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CBG0EE0K9V"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-CBG0EE0K9V');
</script>
`;

function walkDir(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
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

const baseDir = __dirname;
const htmlFiles = [
  path.join(baseDir, 'index.html'),
  path.join(baseDir, 'search.html'),
  ...walkDir(path.join(baseDir, 'game')),
  ...walkDir(path.join(baseDir, 'category')),
  ...walkDir(path.join(baseDir, 'contact')),
  ...walkDir(path.join(baseDir, 'privacy')),
  ...walkDir(path.join(baseDir, 'terms')),
].filter(p => fs.existsSync(p));

let count = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('G-CBG0EE0K9V')) continue; // Already has it
  if (!content.includes('<head>')) continue;
  content = content.replace('<head>', '<head>\n' + googleTag);
  fs.writeFileSync(file, content);
  count++;
  console.log('Added:', path.relative(baseDir, file));
}
console.log('\nDone. Added Google tag to', count, 'files');
