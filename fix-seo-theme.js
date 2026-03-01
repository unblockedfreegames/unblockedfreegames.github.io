/**
 * Fix SEO issues across the entire theme.
 * Run: node fix-seo-theme.js
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://unblockedfreegames.github.io/unblockedgames.github.io';
const ROOT = __dirname;

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// 1. Fix search.html
function fixSearch() {
  const file = path.join(ROOT, 'search.html');
  let html = fs.readFileSync(file, 'utf8');
  const newHead = `<head>
    
    <script>(function(){var p=location.pathname,s=p.split('/').filter(Boolean),b='/';if(s.length>0){var f=s[0],c=['game','category','terms','privacy','contact','search.html','index.html'];if(c.indexOf(f)===-1)b='/'+f+'/';}document.write('<base href=\"'+b+'\">');})();</script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>Search Unblocked Games - Find 470+ Free Games | Unblocked Free Games</title>
    <meta name="description" content="Search 470+ unblocked games. Find Slope, Subway Surfers, Geometry Dash, Cookie Clicker &amp; more. Free games for school. No download.">
    <meta name="keywords" content="search unblocked games, find games for school, unblocked games search">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${BASE}/search.html">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Search Unblocked Games | Unblocked Free Games">
    <meta property="og:description" content="Search 470+ unblocked games. Free at school. No download.">
    <meta property="og:url" content="${BASE}/search.html">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Search Unblocked Games | Unblocked Free Games">
    <meta name="twitter:description" content="Search 470+ unblocked games. Free at school.">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/Inter.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>`;
  html = html.replace(/<head>[\s\S]*?<\/head>/, newHead);
  html = html.replace(/<img src="assets\/img\/logo\.png" height="30">/, '<img src="assets/img/logo.png" alt="Unblocked Free Games" height="30">');
  html = html.replace(/placeholder="Text to search\.\.\."(?!\s*aria-label)/, 'placeholder="Search unblocked games..." aria-label="Search games"');
  fs.writeFileSync(file, html);
  console.log('Fixed: search.html');
}

// 2. Fix 404.html
function fix404() {
  const file = path.join(ROOT, '404.html');
  let html = fs.readFileSync(file, 'utf8');
  const insertAfterViewport = `  <meta name="description" content="Page not found. Return to Unblocked Free Games to play 470+ free unblocked games at school.">
  <meta name="robots" content="noindex, nofollow">`;
  if (!html.includes('noindex')) {
    html = html.replace(/(<meta name="viewport"[^>]*>)/, '$1\n' + insertAfterViewport);
  }
  fs.writeFileSync(file, html);
  console.log('Fixed: 404.html');
}

// 3. Fix terms, privacy, contact
function fixLegalPages() {
  const pages = [
    {
      file: path.join(ROOT, 'terms', 'index.html'),
      title: 'Terms and Conditions - Unblocked Free Games',
      desc: 'Terms and Conditions for Unblocked Free Games. Read our terms of service for using our free unblocked games site.',
      keywords: 'terms of service, unblocked games terms, legal'
    },
    {
      file: path.join(ROOT, 'privacy', 'index.html'),
      title: 'Privacy Policy - Unblocked Free Games',
      desc: 'Privacy Policy for Unblocked Free Games. How we handle your data when you play free unblocked games.',
      keywords: 'privacy policy, unblocked games privacy, data protection'
    },
    {
      file: path.join(ROOT, 'contact', 'index.html'),
      title: 'Contact Us - Unblocked Free Games',
      desc: 'Contact Unblocked Free Games. Get in touch for support, feedback, or partnership. We offer 470+ free unblocked games.',
      keywords: 'contact unblocked games, support, feedback'
    }
  ];
  const urls = {
    terms: `${BASE}/terms/`,
    privacy: `${BASE}/privacy/`,
    contact: `${BASE}/contact/`
  };
  const slugs = { terms: 'terms', privacy: 'privacy', contact: 'contact' };
  pages.forEach((p, i) => {
    const slug = Object.keys(slugs)[i];
    const url = urls[slug];
    let html = fs.readFileSync(p.file, 'utf8');
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(p.desc)}">`);
    const extraMeta = `
    <meta name="keywords" content="${escapeHtml(p.keywords)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(p.title)}">
    <meta property="og:description" content="${escapeHtml(p.desc)}">
    <meta property="og:url" content="${url}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeHtml(p.title)}">`;
    if (!html.includes('rel="canonical"')) {
      html = html.replace(/(<meta name="description" content="[^"]*">)/, `$1${extraMeta}`);
    }
    html = html.replace(/<img src="assets\/img\/logo\.png" height="30">/, '<img src="assets/img/logo.png" alt="Unblocked Free Games" height="30">');
    html = html.replace(/placeholder="Text to search\.\.\."(?!\s*aria-label)/, 'placeholder="Search unblocked games..." aria-label="Search games"');
    fs.writeFileSync(p.file, html);
    console.log('Fixed:', slug + '/index.html');
  });
}

// 4. Add canonical, robots, OG, Twitter to game pages
function fixGamePages() {
  const gameDir = path.join(ROOT, 'game');
  const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));
  let count = 0;
  files.forEach(f => {
    const filePath = path.join(gameDir, f);
    const slug = f.replace('.html', '');
    let content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    const descMatch = content.match(/<meta name="description" content="([^"]*)">/);
    if (!titleMatch || !descMatch) return;
    const title = titleMatch[1];
    const desc = descMatch[1];
    const gameUrl = `${BASE}/game/${f}`;
    const seoBlock = `
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${gameUrl}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(desc)}">
    <meta property="og:url" content="${gameUrl}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(desc)}">`;
    if (!content.includes('rel="canonical"')) {
      content = content.replace(
        /(<meta name="description" content="[^"]*">)\s*\n/,
        `$1\n${seoBlock}\n`
      );
    }
    if (!content.includes('alt="Unblocked Free Games"')) {
      content = content.replace(/<img src="assets\/img\/logo\.png" height="30">/, '<img src="assets/img/logo.png" alt="Unblocked Free Games" height="30">');
    }
    content = content.replace(/placeholder="Text to search\.\.\."(?!\s*aria-label)/, 'placeholder="Search unblocked games..." aria-label="Search games"');
    fs.writeFileSync(filePath, content);
    count++;
  });
  console.log('Fixed:', count, 'game pages');
}

// 5. Fix category pages - logo alt and search input
function fixCategoryPages() {
  const catDir = path.join(ROOT, 'category');
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    const filePath = path.join(catDir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('alt="Unblocked Free Games"')) {
      content = content.replace(/<img src="assets\/img\/logo\.png" height="30">/, '<img src="assets/img/logo.png" alt="Unblocked Free Games" height="30">');
    }
    content = content.replace(/placeholder="Text to search\.\.\."(?!\s*aria-label)/, 'placeholder="Search unblocked games..." aria-label="Search games"');
    fs.writeFileSync(filePath, content);
  });
  console.log('Fixed:', files.length, 'category pages (logo alt, search aria)');
}

// 6. Fix index.html - ensure logo has alt (it might already)
function fixIndex() {
  const file = path.join(ROOT, 'index.html');
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('alt="Unblocked Free Games"') && content.includes('logo.png')) {
    content = content.replace(/<img src="assets\/img\/logo\.png"([^>]*)>/, '<img src="assets/img/logo.png" alt="Unblocked Free Games"$1>');
  }
  fs.writeFileSync(file, content);
  console.log('Checked: index.html');
}

// Run all
fixSearch();
fix404();
fixLegalPages();
fixGamePages();
fixCategoryPages();
fixIndex();
console.log('\nSEO theme fixes complete.');
