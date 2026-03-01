/**
 * Updates category pages with proper SEO: title, meta description, keywords, canonical, OG, Twitter.
 * Run: node update-category-seo.js
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://unblockedfreegames.github.io/unblockedgames.github.io';
const CAT_DIR = path.join(__dirname, 'category');

const SEO = {
  all: {
    title: 'All Games Unblocked - 470+ Free Games | Unblocked Free Games',
    description: 'Browse all 470+ unblocked games. Play free at school or work. No download. Racing, puzzle, shooting, IO, stickman & more.',
    keywords: 'unblocked games, all games, free games for school, unblocked free games, browser games no download'
  },
  car: {
    title: 'Car Games Unblocked - Free Racing & Driving Games | Unblocked Free Games',
    description: 'Play car games unblocked at school. Racing, parking, driving simulators. Slope, Moto X3M, Madalin Stunt Cars & more. No download.',
    keywords: 'car games unblocked, racing games unblocked, driving games for school, free car games'
  },
  clicker: {
    title: 'Clicker Games Unblocked - Cookie Clicker & Idle Games | Unblocked Free Games',
    description: 'Play clicker and idle games unblocked. Cookie Clicker, Doge Miner, Clicker Heroes & more. Free at school. No download.',
    keywords: 'clicker games unblocked, cookie clicker unblocked, idle games for school, free clicker games'
  },
  fighting: {
    title: 'Fighting Games Unblocked - Free Combat Games | Unblocked Free Games',
    description: 'Play fighting games unblocked at school. Stickman battles, boxing, combat games. No download. Works on school networks.',
    keywords: 'fighting games unblocked, combat games for school, stickman fighting, free fighting games'
  },
  io: {
    title: 'IO Games Unblocked - Agar.io, Krunker & More | Unblocked Free Games',
    description: 'Play .io games unblocked at school. Agar.io, Krunker.io, Shell Shockers, Surviv.io & more. Free multiplayer. No download.',
    keywords: 'io games unblocked, agar.io unblocked, krunker unblocked, .io games for school'
  },
  kids: {
    title: 'Kids Games Unblocked - Family-Friendly Games for School | Unblocked Free Games',
    description: 'Play kids games unblocked at school. Family-friendly, educational, fun. Safe games for young players. No download.',
    keywords: 'kids games unblocked, games for kids at school, family friendly unblocked games, free kids games'
  },
  multiplayer: {
    title: 'Multiplayer Games Unblocked - Play With Friends at School | Unblocked Free Games',
    description: 'Play multiplayer games unblocked at school. Two-player, co-op, online. Play with friends. No download.',
    keywords: 'multiplayer games unblocked, two player games for school, play with friends unblocked, free multiplayer'
  },
  new: {
    title: 'New Games Unblocked - Latest Additions | Unblocked Free Games',
    description: 'Discover the newest unblocked games. Recently added free games for school. No download. Updated regularly.',
    keywords: 'new unblocked games, latest games for school, new free games, recently added unblocked'
  },
  parkour: {
    title: 'Parkour Games Unblocked - Free Run & Climb Games | Unblocked Free Games',
    description: 'Play parkour games unblocked at school. Run, jump, climb. Geometry Dash, Only Up, Vex series & more. No download.',
    keywords: 'parkour games unblocked, run games for school, geometry dash unblocked, free parkour'
  },
  platform: {
    title: 'Platform Games Unblocked - Jump & Run Games | Unblocked Free Games',
    description: 'Play platform games unblocked at school. Jump, run, avoid obstacles. Super Mario, Run 3, Getting Over It & more.',
    keywords: 'platform games unblocked, jump games for school, run games unblocked, free platformer'
  },
  puzzle: {
    title: 'Puzzle Games Unblocked - Brain Teasers for School | Unblocked Free Games',
    description: 'Play puzzle games unblocked at school. Brain teasers, logic, match-3. 2048, Cut the Rope, Suika & more. No download.',
    keywords: 'puzzle games unblocked, brain games for school, 2048 unblocked, free puzzle games'
  },
  racing: {
    title: 'Racing Games Unblocked - Free Speed Games | Unblocked Free Games',
    description: 'Play racing games unblocked at school. Car racing, bike racing, endless runners. Moto X3M, Slope & more. No download.',
    keywords: 'racing games unblocked, speed games for school, moto x3m unblocked, free racing'
  },
  running: {
    title: 'Running Games Unblocked - Endless Runners for School | Unblocked Free Games',
    description: 'Play running games unblocked at school. Subway Surfers, Temple Run, endless runners. Dodge obstacles, get high scores.',
    keywords: 'running games unblocked, subway surfers unblocked, temple run for school, endless runner'
  },
  school: {
    title: 'School Games Unblocked - Play at School & Work | Unblocked Free Games',
    description: 'Games that work at school. Unblocked free games for school networks. No VPN. No download. Play during breaks.',
    keywords: 'school games unblocked, games for school, unblocked at school, free school games'
  },
  shooting: {
    title: 'Shooting Games Unblocked - Free FPS & Action Games | Unblocked Free Games',
    description: 'Play shooting games unblocked at school. FPS, sniper, action. Krunker, Shell Shockers, Bullet Force & more. No download.',
    keywords: 'shooting games unblocked, fps games for school, krunker unblocked, free shooting games'
  },
  skill: {
    title: 'Skill Games Unblocked - Reflex & Precision Games | Unblocked Free Games',
    description: 'Play skill games unblocked at school. Test reflexes, timing, precision. Hard games, challenge yourself. No download.',
    keywords: 'skill games unblocked, reflex games for school, hard games unblocked, free skill games'
  },
  soccer: {
    title: 'Soccer Games Unblocked - Football Games for School | Unblocked Free Games',
    description: 'Play soccer games unblocked at school. Penalty shooters, head soccer, football. Free at school. No download.',
    keywords: 'soccer games unblocked, football games for school, penalty shooters unblocked, free soccer'
  },
  stickman: {
    title: 'Stickman Games Unblocked - Stick Figure Action Games | Unblocked Free Games',
    description: 'Play stickman games unblocked at school. Stick figure battles, parkour, fighting. Happy Wheels, Stick Fight & more.',
    keywords: 'stickman games unblocked, stick figure games for school, happy wheels unblocked, free stickman'
  },
  trending: {
    title: 'Trending Games Unblocked - Most Popular Now | Unblocked Free Games',
    description: 'Play the most popular unblocked games right now. Trending games for school. No download. Updated daily.',
    keywords: 'trending unblocked games, popular games for school, most played unblocked, hot games'
  },
  'two-player': {
    title: 'Two Player Games Unblocked - Play With a Friend at School | Unblocked Free Games',
    description: 'Play two player games unblocked at school. Co-op, versus, same device. Getaway Shootout, Rooftop Snipers & more.',
    keywords: 'two player games unblocked, 2 player games for school, play with friend unblocked, co-op games'
  }
};

function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function updateFile(slug) {
  const filePath = path.join(CAT_DIR, slug + '.html');
  if (!fs.existsSync(filePath)) return false;

  const config = SEO[slug];
  if (!config) return false;

  let html = fs.readFileSync(filePath, 'utf8');

  const canonical = `${BASE}/category/${slug}.html`;

  const newHead = `<head>
    
    <script>(function(){var p=location.pathname,s=p.split('/').filter(Boolean),b='/';if(s.length>0){var f=s[0],c=['game','category','terms','privacy','contact','search.html','index.html'];if(c.indexOf(f)===-1)b='/'+f+'/';}document.write('<base href=\"'+b+'\">');})();</script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    <title>${escapeAttr(config.title)}</title>
    <meta name="description" content="${escapeAttr(config.description)}">
    <meta name="keywords" content="${escapeAttr(config.keywords)}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeAttr(config.title)}">
    <meta property="og:description" content="${escapeAttr(config.description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="Unblocked Free Games">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeAttr(config.title)}">
    <meta name="twitter:description" content="${escapeAttr(config.description)}">
    <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/Inter.css">
    <link rel="stylesheet" href="assets/css/styles.css">
</head>`;

  html = html.replace(
    /<head>[\s\S]*?<\/head>/,
    newHead
  );

  fs.writeFileSync(filePath, html);
  return true;
}

const slugs = Object.keys(SEO);
let count = 0;
for (const slug of slugs) {
  if (updateFile(slug)) {
    console.log('Updated:', slug + '.html');
    count++;
  }
}
console.log('\nDone. Updated', count, 'category pages.');
