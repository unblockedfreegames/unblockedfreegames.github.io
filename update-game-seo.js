const fs = require('fs');
const path = require('path');

// SEO descriptions for popular games - custom descriptions for better SEO
const gameDescriptions = {
  'subway-surfers': 'Play Subway Surfers unblocked - run through endless subway tracks, dodge trains, and collect coins. Free to play at school or work. No download required.',
  'slope': 'Play Slope unblocked - roll down the 3D slope avoiding obstacles. Addictive ball game free at school. No download needed.',
  'geometry-dash': 'Play Geometry Dash unblocked - rhythm-based platformer with challenging levels. Free at school or work. No download.',
  'cookie-clicker': 'Play Cookie Clicker unblocked - addictive idle clicker game. Bake cookies and build an empire. Free at school. No download.',
  'run-3': 'Play Run 3 unblocked - endless runner in space. Dodge gaps and run through tunnels. Free at school. No download.',
  'happy-wheels': 'Play Happy Wheels unblocked - physics-based obstacle course game. Free at school or work. No download.',
  '1v1-lol': 'Play 1v1 LOL unblocked - build and battle in this multiplayer shooter. Free at school. No download.',
  'among-us': 'Play Among Us unblocked - find the impostor in this social deduction game. Free at school. No download.',
  'minecraft-classic': 'Play Minecraft Classic unblocked - build and explore block worlds. Free at school. No download.',
  'tunnel-rush': 'Play Tunnel Rush unblocked - dodge obstacles at high speed in 3D tunnel. Free at school. No download.',
  'vex-7': 'Play Vex 7 unblocked - challenging platformer with deadly obstacles. Free at school. No download.',
  'getaway-shootout': 'Play Getaway Shootout unblocked - chaotic 2-player racing and shooting. Free at school. No download.',
  'retro-bowl': 'Play Retro Bowl unblocked - manage your team and win the championship. Free football game at school. No download.',
  'stickman-hook': 'Play Stickman Hook unblocked - swing through levels with your grappling hook. Free at school. No download.',
  'fall-guys-ultimate-knockout': 'Play Fall Guys unblocked - battle royale obstacle course. Free at school. No download.',
  'papas-freezeria': 'Play Papa\'s Freezeria unblocked - run your ice cream shop. Free cooking game at school. No download.',
  'papas-pizzaria': 'Play Papa\'s Pizzaria unblocked - make pizzas and run your restaurant. Free at school. No download.',
  'roblox': 'Play Roblox unblocked - explore millions of user-created games. Free at school. No download.',
  'krunker-io': 'Play Krunker.io unblocked - fast-paced multiplayer FPS. Free at school. No download.',
  'smash-karts': 'Play Smash Karts unblocked - battle racing with weapons. Free at school. No download.',
  'basket-random': 'Play Basket Random unblocked - physics basketball game. Free at school. No download.',
  'doodle-jump': 'Play Doodle Jump unblocked - endless vertical jumper. Free at school. No download.',
  'flappy-bird': 'Play Flappy Bird unblocked - tap to fly through pipes. Free at school. No download.',
  '2048': 'Play 2048 unblocked - slide and merge numbers to 2048. Free puzzle game at school. No download.',
  'tetris': 'Play Tetris unblocked - classic block puzzle game. Free at school. No download.',
  'subway-surfers-new-york': 'Play Subway Surfers New York unblocked - endless runner in NYC. Free at school. No download.',
  'subway-surfers-hawaii': 'Play Subway Surfers Hawaii unblocked - surf the subway in Hawaii. Free at school. No download.',
  'subway-surfers-san-francisco': 'Play Subway Surfers San Francisco unblocked - run through SF. Free at school. No download.',
  'subway-surfers-zurich': 'Play Subway Surfers Zurich unblocked - endless runner in Switzerland. Free at school. No download.',
  'subway-surfers-bali': 'Play Subway Surfers Bali unblocked - surf in tropical Bali. Free at school. No download.',
};

// Convert slug to display name (subway-surfers -> Subway Surfers)
function slugToName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\bIo\b/gi, 'io')
    .replace(/\b2d\b/gi, '2D')
    .replace(/\b3d\b/gi, '3D')
    .replace(/\bLol\b/g, 'LOL')
    .replace(/\bTd\b/g, 'TD')
    .replace(/\bFnaf\b/gi, 'FNAF')
    .replace(/\bFnf\b/gi, 'FNF');
}

// Generate SEO description for a game
function getDescription(slug, displayName) {
  if (gameDescriptions[slug]) {
    return gameDescriptions[slug];
  }
  return `Play ${displayName} unblocked - free online game at school or work. No download required. One of the best unblocked games on Unblocked Free Games.`;
}

// Update a single game file
function updateGameFile(filePath) {
  const slug = path.basename(filePath, '.html');
  const displayName = slugToName(slug);
  const displayNameUpper = displayName.toUpperCase();
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update title: GAME NAME - Unblocked Free Games -> Game Name Unblocked - Unblocked Free Games
  const titleRegex = /<title>(.+?) - Unblocked Free Games<\/title>/;
  const titleMatch = content.match(titleRegex);
  if (titleMatch) {
    const newTitle = `${displayName} Unblocked - Unblocked Free Games`;
    content = content.replace(titleRegex, `<title>${newTitle}</title>`);
  }
  
  // Update meta description
  const descRegex = /<meta name="description" content="[^"]*">/;
  const description = getDescription(slug, displayName);
  content = content.replace(descRegex, `<meta name="description" content="${description}">`);
  
  // Update h1: Add UNBLOCKED to the main game title (only one h1.h4 per game page)
  const h1Regex = /<h1 class="h4"><strong>([^<]+)<\/strong><\/h1>/;
  const h1Match = content.match(h1Regex);
  if (h1Match) {
    const currentName = h1Match[1];
    const newH1Name = currentName.includes('UNBLOCKED') ? currentName : `${currentName} UNBLOCKED`;
    content = content.replace(h1Regex, `<h1 class="h4"><strong>${newH1Name}</strong></h1>`);
  }
  
  fs.writeFileSync(filePath, content);
}

// Main
const gameDir = path.join(__dirname, 'game');
const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.html'));

console.log(`Updating ${files.length} game files...`);
files.forEach(file => {
  const filePath = path.join(gameDir, file);
  updateGameFile(filePath);
});
console.log('Done!');
