/**
 * Add basic JSON-LD schema to all pages.
 * Run: node add-schema.js
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://unblockedfreegames.github.io';
const ROOT = __dirname;

function addSchema(filePath, schema) {
  const script = '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>';
  let html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('application/ld+json')) return false;
  html = html.replace(/(<link rel="stylesheet" href="assets\/bootstrap)/, script + '\n    $1');
  fs.writeFileSync(filePath, html);
  return true;
}

// 1. Homepage - enhance WebSite with SearchAction
function fixHomepage() {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const enhanced = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Unblocked Free Games',
    url: BASE + '/',
    description: 'Play 470+ free unblocked games at school or work. No download required. Subway Surfers, Slope, Geometry Dash and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: BASE + '/search.html?q={search_term_string}' },
      'query-input': 'required name=search_term_string'
    }
  };
  html = html.replace(/<script type="application\/ld\+json">\{[^<]*\}<\/script>/, '<script type="application/ld+json">' + JSON.stringify(enhanced) + '</script>');
  fs.writeFileSync(file, html);
  console.log('Updated: index.html (WebSite + SearchAction)');
}

// 2. Game pages
function fixGamePages() {
  const gameDir = path.join(ROOT, 'game');
  const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));
  let count = 0;
  files.forEach(f => {
    const filePath = path.join(gameDir, f);
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('application/ld+json')) return;
    const titleM = html.match(/<title>([^<]+)<\/title>/);
    const descM = html.match(/<meta name="description" content="([^"]*)">/);
    if (!titleM || !descM) return;
    const title = titleM[1].replace(/&amp;/g, '&');
    const desc = descM[1].replace(/&amp;/g, '&');
    const url = BASE + '/game/' + f;
    const gameName = title.replace(' - Unblocked Free Games', '');
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description: desc,
      url: url,
      mainEntity: {
        '@type': 'VideoGame',
        name: gameName,
        description: desc,
        url: url
      }
    };
    html = html.replace(/(<link rel="stylesheet" href="assets\/bootstrap)/, '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n    $1');
    fs.writeFileSync(filePath, html);
    count++;
  });
  console.log('Added schema to', count, 'game pages');
}

// 3. Category pages
const catSchema = {
  all: { name: 'All Games Unblocked', desc: 'Browse all 470+ unblocked games. Play free at school.' },
  car: { name: 'Car Games Unblocked', desc: 'Play car games unblocked at school. Racing, parking, driving.' },
  clicker: { name: 'Clicker Games Unblocked', desc: 'Play clicker and idle games unblocked at school.' },
  fighting: { name: 'Fighting Games Unblocked', desc: 'Play fighting games unblocked at school.' },
  io: { name: 'IO Games Unblocked', desc: 'Play .io games unblocked at school. Agar.io, Krunker and more.' },
  kids: { name: 'Kids Games Unblocked', desc: 'Play kids games unblocked at school.' },
  multiplayer: { name: 'Multiplayer Games Unblocked', desc: 'Play multiplayer games unblocked at school.' },
  new: { name: 'New Games Unblocked', desc: 'Discover the newest unblocked games.' },
  parkour: { name: 'Parkour Games Unblocked', desc: 'Play parkour games unblocked at school.' },
  platform: { name: 'Platform Games Unblocked', desc: 'Play platform games unblocked at school.' },
  puzzle: { name: 'Puzzle Games Unblocked', desc: 'Play puzzle games unblocked at school.' },
  racing: { name: 'Racing Games Unblocked', desc: 'Play racing games unblocked at school.' },
  running: { name: 'Running Games Unblocked', desc: 'Play running games unblocked at school.' },
  school: { name: 'School Games Unblocked', desc: 'Games that work at school.' },
  shooting: { name: 'Shooting Games Unblocked', desc: 'Play shooting games unblocked at school.' },
  skill: { name: 'Skill Games Unblocked', desc: 'Play skill games unblocked at school.' },
  soccer: { name: 'Soccer Games Unblocked', desc: 'Play soccer games unblocked at school.' },
  stickman: { name: 'Stickman Games Unblocked', desc: 'Play stickman games unblocked at school.' },
  trending: { name: 'Trending Games Unblocked', desc: 'Most popular unblocked games right now.' },
  'two-player': { name: 'Two Player Games Unblocked', desc: 'Play two player games unblocked at school.' }
};

function fixCategoryPages() {
  const catDir = path.join(ROOT, 'category');
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.html'));
  let count = 0;
  files.forEach(f => {
    const slug = f.replace('.html', '');
    const cfg = catSchema[slug];
    if (!cfg) return;
    const filePath = path.join(catDir, f);
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('application/ld+json')) return;
    const descM = html.match(/<meta name="description" content="([^"]*)">/);
    const desc = descM ? descM[1].replace(/&amp;/g, '&') : cfg.desc;
    const url = BASE + '/category/' + f;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: cfg.name,
      description: desc,
      url: url
    };
    html = html.replace(/(<link rel="stylesheet" href="assets\/bootstrap)/, '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n    $1');
    fs.writeFileSync(filePath, html);
    count++;
  });
  console.log('Added schema to', count, 'category pages');
}

// 4. Search page
function fixSearch() {
  const file = path.join(ROOT, 'search.html');
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('application/ld+json')) return;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Search Unblocked Games',
    description: 'Search 470+ unblocked games. Free at school. No download.',
    url: BASE + '/search.html'
  };
  html = html.replace(/(<link rel="stylesheet" href="assets\/bootstrap)/, '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n    $1');
  fs.writeFileSync(file, html);
  console.log('Added schema: search.html');
}

// 5. Terms, Privacy, Contact
function fixLegalPages() {
  const pages = [
    { slug: 'terms', name: 'Terms and Conditions', desc: 'Terms of service for Unblocked Free Games.' },
    { slug: 'privacy', name: 'Privacy Policy', desc: 'Privacy policy for Unblocked Free Games.' },
    { slug: 'contact', name: 'Contact Us', desc: 'Contact Unblocked Free Games.' }
  ];
  pages.forEach(p => {
    const filePath = path.join(ROOT, p.slug, 'index.html');
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('application/ld+json')) return;
    const descM = html.match(/<meta name="description" content="([^"]*)">/);
    const desc = descM ? descM[1].replace(/&amp;/g, '&') : p.desc;
    const url = BASE + '/' + p.slug + '/';
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: p.name + ' - Unblocked Free Games',
      description: desc,
      url: url
    };
    html = html.replace(/(<link rel="stylesheet" href="assets\/bootstrap)/, '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>\n    $1');
    fs.writeFileSync(filePath, html);
    console.log('Added schema:', p.slug + '/index.html');
  });
}

fixHomepage();
fixGamePages();
fixCategoryPages();
fixSearch();
fixLegalPages();
console.log('\nSchema added to all pages.');
