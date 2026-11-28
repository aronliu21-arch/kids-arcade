// Shared image cache for canvas art. Existing drawings remain available until the images load.
const Storybook = (() => {
  const images = new Map();
  function image(name) {
    if (!images.has(name)) {
      const img = new Image();
      img.src = `art/${name}.webp`;
      images.set(name, img);
    }
    const img = images.get(name);
    return img.complete && img.naturalWidth ? img : null;
  }

  function sprite(c, name, x, y, height, maxWidth = Infinity, flip = false) {
    const img = image(name);
    if (!img) return false;
    const scale = Math.min(height / img.naturalHeight, maxWidth / img.naturalWidth);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    c.save(); c.translate(x, y);
    if (flip) c.scale(-1, 1);
    c.drawImage(img, -w / 2, -h, w, h);
    c.restore();
    return true;
  }

  const patterns = new WeakMap();
  function terrain(c, name, fallback) {
    const img = image('terrain-' + name);
    if (!img) return fallback;
    if (!patterns.has(c)) patterns.set(c, new Map());
    const cache = patterns.get(c);
    if (!cache.has(name)) cache.set(name, c.createPattern(img, 'repeat'));
    return cache.get(name) || fallback;
  }

  function arena(c, world, w, h) {
    const img = image('battle-' + world);
    if (!img) return false;
    c.drawImage(img, -10, 0, w + 20, h);
    const shade = c.createLinearGradient(0, 0, 0, h);
    shade.addColorStop(0, 'rgba(12,25,25,.28)');
    shade.addColorStop(.58, 'rgba(12,25,25,0)');
    shade.addColorStop(1, 'rgba(12,25,25,.62)');
    c.fillStyle = shade; c.fillRect(-10, 0, w + 20, h);
    return true;
  }

  const people = {
    'Elder Lumen': 'elder-lumen', 'Baker Pim': 'baker-pim', 'Farmer Jo': 'farmer-jo',
    'Shopkeeper Brom': 'brom', 'Healer Rosa': 'rosa', Wick: 'wick', 'Captain Marlow': 'marlow',
    'Mapmaker Marta': 'marta', 'Old Tick': 'tick', 'Brushmaster Lan': 'lan',
    'Little Fen': 'little-fen', 'Lantern Kid Yu': 'lantern-kid-yu',
    'Woodcutter Ada': 'ada', 'Sailor Mako': 'mako', 'Diver Lin': 'diver-lin',
    'Guide Tenzin': 'tenzin', 'Climber Bo': 'climber-bo', 'Tinker Zadie': 'zadie',
    'Gear Boy Ozzy': 'ozzy', 'Teacher Mei': 'mei', 'Scout Wren': 'wren',
  };
  const lumis = {
    Emberpup: 'emberpup', Sproutle: 'sproutle', Bubblit: 'bubblit', Acornox: 'acornox',
    Tallybird: 'tallybird', Shellby: 'shellby', Steamlet: 'steamlet', Glaciub: 'glaciub',
    Peakit: 'peakit', Cogbit: 'cogbit', Sandflare: 'sandflare', Bambu: 'bambu', Lampfly: 'lampfly', Echo: 'echo',
    Blazehound: 'blazehound', Florabuck: 'florabuck', Tidalon: 'tidalon', Oakhorn: 'oakhorn',
    Abacowl: 'abacowl', Reefguard: 'reefguard', Geyserix: 'geyserix', Frostbear: 'frostbear',
    Summitar: 'summitar', Gearon: 'gearon', Dunedrake: 'dunedrake', Pandaroo: 'pandaroo', Lanternix: 'lanternix',
  };
  const trees = { round: null, palm: 'palm', pine: 'pine', cactus: 'cactus', bamboo: 'bamboo', dead: 'dead' };
  const enemies = { wisp: 'mixling', bat: 'fog-bat', golem: 'fog-golem', slime: 'fog-slime', knight: 'fog-knight' };
  const bosses = {
    'Count Muddle': 'count-muddle', 'Captain Fib': 'captain-fib', 'Baron Nowhere': 'baron-nowhere',
    'The Tangler': 'tangler', 'Empress Smudge': 'empress-smudge', 'King Mumble': 'king-mumble',
  };
  image('battle-hub'); image('battle-w1');
  Object.values(lumis).forEach(image);
  image('echo-evolved');
  return { image, sprite, terrain, arena, people, lumis, trees, enemies, bosses };
})();
