// Story, worlds, creatures and items.
// Map legend: . ground  , path  " tall grass  T tree  W water  b bridge  R rock  f flowers  H house (2x2)
// C chest  c hidden treasure  G gate  N quest villager  n villager  E fog creature  B boss  F fog wall  P start
// Hub only: S shopkeeper  I healer  L elder
const SPECIES = {
  emberpup: { name: 'Emberpup', evo: 'Blazehound', animal: 'fox', el: 'fire', col: '#ff8c42', body: 'round', ear: 'point', tail: 'flame' },
  sproutle: { name: 'Sproutle', evo: 'Florabuck', animal: 'fawn', el: 'leaf', col: '#69db7c', body: 'round', ear: 'leaf', tail: 'leaf' },
  bubblit: { name: 'Bubblit', evo: 'Tidalon', animal: 'otter', el: 'water', col: '#4dabf7', body: 'round', ear: 'fin', tail: 'fin' },
  acornox: { name: 'Acornox', evo: 'Oakhorn', animal: 'bison', el: 'leaf', col: '#b08968', body: 'wide', ear: 'horn', tail: 'leaf' },
  tallybird: { name: 'Tallybird', evo: 'Abacowl', animal: 'owl', el: 'star', col: '#ffd43b', body: 'tall', ear: 'point', tail: 'puff', extra: 'wings' },
  shellby: { name: 'Shellby', evo: 'Reefguard', animal: 'turtle', el: 'water', col: '#38d9a9', body: 'wide', ear: 'none', tail: 'fin', extra: 'shell' },
  steamlet: { name: 'Steamlet', evo: 'Geyserix', animal: 'axolotl', el: 'fire', col: '#ff8787', body: 'tall', ear: 'antenna', tail: 'puff' },
  glaciub: { name: 'Glaciub', evo: 'Frostbear', animal: 'bear', el: 'water', col: '#a5d8ff', body: 'wide', ear: 'round', tail: 'puff' },
  peakit: { name: 'Peakit', evo: 'Summitar', animal: 'goat', el: 'star', col: '#ced4da', body: 'round', ear: 'long', tail: 'bolt', extra: 'spikes' },
  cogbit: { name: 'Cogbit', evo: 'Gearon', animal: 'hedgehog', el: 'star', col: '#e8a33d', body: 'round', ear: 'antenna', tail: 'none', extra: 'gear' },
  sandflare: { name: 'Sandflare', evo: 'Dunedrake', animal: 'dragon', el: 'fire', col: '#f59f00', body: 'tall', ear: 'horn', tail: 'flame', extra: 'spikes' },
  bambu: { name: 'Bambu', evo: 'Pandaroo', animal: 'panda', el: 'leaf', col: '#f1f3f5', body: 'wide', ear: 'round', tail: 'puff', belly: 'rgba(60,60,70,.25)' },
  lampfly: { name: 'Lampfly', evo: 'Lanternix', animal: 'moth', el: 'fire', col: '#e599f7', body: 'round', ear: 'antenna', tail: 'none', extra: 'wings' },
  echo: { name: 'Echo', evo: 'Echo', animal: 'bat', el: 'star', col: '#b197fc', body: 'round', ear: 'antenna', tail: 'bolt', extra: 'glow' },
};
Object.values(SPECIES).forEach((s, i) => { s.ph = i * 1.3; });
// Each Lumi learns four skills, at Levels 1, 4, 8 and 10.
// Stronger skills need a rest of a few turns after each use.
const MOVES = {
  emberpup: ['Ember Dash', 'Flame Wheel', 'Meteor Blaze', 'Phoenix Rise'], sproutle: ['Vine Whip', 'Thorn Storm', 'Great Bloom', 'World Tree'], bubblit: ['Bubble Burst', 'Tidal Wave', 'Whirlpool Crash', 'Ocean Dragon'],
  acornox: ['Acorn Barrage', 'Root Slam', 'Forest Stampede', 'Mighty Oak'], tallybird: ['Count Strike', 'Feather Flurry', 'Star Tally', 'Starfall Count'], shellby: ['Shell Spin', 'Coral Crush', 'Deep Sea Surge', 'Tsunami Shell'],
  steamlet: ['Steam Jet', 'Boiling Burst', 'Geyser Blast', 'Volcano Steam'], glaciub: ['Ice Tumble', 'Snowball Roll', 'Avalanche', 'Blizzard Roar'], peakit: ['Echo Leap', 'Rock Rumble', 'Summit Flash', 'Mountain Thunder'],
  cogbit: ['Gear Grind', 'Spring Punch', 'Clockwork Storm', 'Great Clockwork'], sandflare: ['Sand Blaze', 'Dune Fang', 'Desert Sun', 'Sun Dragon'], bambu: ['Bamboo Bash', 'Leaf Tornado', 'Panda Quake', 'Bamboo Forest'],
  lampfly: ['Lantern Flash', 'Glow Swarm', 'Festival Fireworks', 'Lantern Sky'], echo: ['Brave Voice', 'Loud Answer', 'Lantern Chorus', 'Hearthome Song'],
};
const MOVE_LV = [1, 4, 8, 10], MOVE_MULT = [1, 1.45, 2, 2.6], MOVE_REST = [0, 2, 3, 4];
const STARTERS = ['emberpup', 'sproutle', 'bubblit'];
// fire beats leaf, leaf beats water, water beats fire. Star is neutral.
const BEATS = { fire: 'leaf', leaf: 'water', water: 'fire' };

const WEAPONS = {
  wood: { name: 'Wooden Sword', atk: 0, kind: 'sword', col: '#c9a66b', trim: '#8d6e4a' },
  bronze: { name: 'Bronze Blade', atk: 3, kind: 'sword', col: '#e0a060', price: 60 },
  silver: { name: 'Silver Saber', atk: 6, kind: 'sword', col: '#dee2e6', price: 150 , perks: ['lucky'] },
  crystal: { name: 'Crystal Lance', atk: 10, kind: 'spear', col: '#7fe3ff', price: 320 , perks: ['drain'] },
  star: { name: 'Starforged Blade', atk: 15, kind: 'sword', col: '#ffe066', trim: '#7048e8', price: 600 , perks: ['lucky', 'twin'] },
  axe: { name: 'Abacus Axe', atk: 5, kind: 'axe', col: '#8ce99a', found: true , perks: ['coins'] },
  trident: { name: 'Tide Trident', atk: 8, kind: 'trident', col: '#66d9e8', found: true , perks: ['chill'] },
  spear: { name: 'Summit Spear', atk: 11, kind: 'spear', col: '#e9ecef', found: true , perks: ['boss'] },
  hammer: { name: 'Gear Hammer', atk: 13, kind: 'hammer', col: '#e8a33d', found: true , perks: ['twin'] },
  staff: { name: 'Lantern Staff', atk: 17, kind: 'staff', col: '#ff8787', found: true , perks: ['boss', 'drain'] },
};
// Each weapon slot looks different for each hero class: Knights use blades and heavy weapons,
// Mages use wands and staffs, Rangers use bows and throwing weapons. Stats and powers come from WEAPONS.
// [name, kind, colour, style]
const WEAPON_LOOKS = {
  wood: { knight: ['Wooden Sword', 'sword', '#c9a66b', 'plain'], mage: ['Twig Wand', 'wand', '#c9a66b', 'twig'], ranger: ['Twig Bow', 'bow', '#c9a66b', 'twig'] },
  bronze: { knight: ['Bronze Blade', 'sword', '#e0a060', 'broad'], mage: ['Bronze Wand', 'wand', '#e0a060', 'orb'], ranger: ['Bronze Bow', 'bow', '#e0a060', 'wrapped'] },
  silver: { knight: ['Silver Saber', 'sword', '#dee2e6', 'saber'], mage: ['Moon Staff', 'staff', '#e7f5ff', 'moon'], ranger: ['Silver Longbow', 'bow', '#dee2e6', 'recurve'] },
  axe: { knight: ['Abacus Axe', 'axe', '#8ce99a'], mage: ['Abacus Rod', 'wand', '#8ce99a', 'abacus'], ranger: ['Abacus Boomerang', 'boomerang', '#8ce99a'] },
  trident: { knight: ['Tide Trident', 'trident', '#66d9e8'], mage: ['Tide Staff', 'staff', '#66d9e8', 'tide'], ranger: ['Tide Bow', 'bow', '#66d9e8', 'tide'] },
  crystal: { knight: ['Crystal Lance', 'spear', '#7fe3ff', 'lance'], mage: ['Crystal Staff', 'staff', '#7fe3ff', 'crystal'], ranger: ['Crystal Bow', 'bow', '#7fe3ff', 'crystal'] },
  spear: { knight: ['Summit Spear', 'spear', '#e9ecef', 'summit'], mage: ['Summit Scepter', 'wand', '#e9ecef', 'scepter'], ranger: ['Summit Javelin', 'spear', '#e9ecef', 'javelin'] },
  hammer: { knight: ['Gear Hammer', 'hammer', '#e8a33d'], mage: ['Gear Scepter', 'staff', '#e8a33d', 'gear'], ranger: ['Gear Crossbow', 'crossbow', '#e8a33d'] },
  star: { knight: ['Starforged Blade', 'sword', '#ffe066', 'star'], mage: ['Star Wand', 'wand', '#ffe066', 'star'], ranger: ['Starshot Bow', 'bow', '#ffe066', 'star'] },
  staff: { knight: ['Lantern Blade', 'sword', '#ff8787', 'lantern'], mage: ['Lantern Staff', 'staff', '#ff8787', 'lantern'], ranger: ['Lantern Bow', 'bow', '#ff8787', 'lantern'] },
};
function weaponLook(id, cls) { const L = (WEAPON_LOOKS[id] || WEAPON_LOOKS.wood)[cls] || WEAPON_LOOKS[id].knight; return Object.assign({}, WEAPONS[id], { name: L[0], kind: L[1], col: L[2], style: L[3] || '' }); }
// Special powers on the better weapons and armour.
const PERKS = {
  lucky: { icon: '🍀', name: 'Lucky Strike', text: '1 in 4 hits does double damage' },
  coins: { icon: '🪙', name: 'Treasure Finder', text: '+50% coins from every win' },
  chill: { icon: '❄️', name: 'Frost Touch', text: "your hit makes the foe's next attack half as strong" },
  drain: { icon: '💚', name: 'Life Spark', text: 'heals you for a quarter of the damage you deal' },
  boss: { icon: '🌟', name: 'Fog Breaker', text: '+50% damage to Fog bosses' },
  twin: { icon: '⚡', name: 'Double Strike', text: 'full-power hits strike a second time' },
  thorns: { icon: '🌵', name: 'Spiky Mail', text: 'foes take 4 damage every time they hit you' },
  guard: { icon: '💎', name: 'Crystal Guard', text: 'blocks the first hit in every battle' },
  sunrise: { icon: '🌅', name: 'Sunrise', text: 'heals 10% of your health at the start of each turn' },
};
const perkList = ids => (ids || []).map(p => `<span class="perk">${PERKS[p].icon} <b>${PERKS[p].name}</b>: ${PERKS[p].text}</span>`).join('');
const ARMORS = {
  cloth: { name: 'Cloth Tunic', hp: 0, def: 0, tier: 0 },
  leather: { name: 'Leather Vest', hp: 10, def: 1, tier: 1, price: 50 },
  chain: { name: 'Chain Mail', hp: 22, def: 2, tier: 2, price: 140 , perks: ['thorns'] },
  crystal: { name: 'Crystal Plate', hp: 36, def: 4, tier: 3, price: 300 , perks: ['guard'] },
  dawn: { name: 'Dawn Armour', hp: 55, def: 6, tier: 4, price: 550 , perks: ['guard', 'sunrise'] },
};
const CLASSES = {
  knight: { name: 'Knight', icon: '🛡️', perk: '+15 health' },
  mage: { name: 'Mage', icon: '✨', perk: 'Lumi skills hit 20% harder' },
  ranger: { name: 'Ranger', icon: '🏹', perk: '+25% coins, easier captures' },
};
// Hero creator choices. The first of each list is the kid's usual look.
const HAIRS = {
  nora: [['ponytail', 'Ponytail'], ['twinbuns', 'Twin buns'], ['long', 'Long'], ['bob', 'Bob'], ['braids', 'Braids']],
  lucas: [['spiky', 'Spiky'], ['neat', 'Neat'], ['curly', 'Curly'], ['swoop', 'Swoop'], ['cap', 'Cap']],
};
const HAIR_COLS = ['#17141c', '#5c3d2e', '#a0522d', '#d9a441'];
const EYES = [['sparkle', 'Sparkly'], ['big', 'Big shiny'], ['starry', 'Starry'], ['round', 'Round'], ['almond', 'Cat'], ['sleepy', 'Sleepy']];
const EYE_COLS = ['', '#17141c', '#1c7ed6', '#2f9e44', '#c2711e', '#7048e8'];
const EXTRAS = [['', 'None'], ['freckles', 'Freckles'], ['glasses', 'Glasses'], ['stars', 'Star cheeks'], ['plaster', 'Plaster']];
const TITLES = ['the Brave', 'the Clever', 'the Kind', 'the Swift', 'the Curious', 'the Bold'];
const NICKS = { fire: ['Sparky', 'Blaze', 'Ember', 'Toasty', 'Flicker'], water: ['Splash', 'Bubbles', 'Drizzle', 'Puddle', 'Misty'], leaf: ['Sprout', 'Clover', 'Mossy', 'Pip', 'Fern'], star: ['Twinkle', 'Comet', 'Nova', 'Glimmer', 'Sunny'] };
const TUNICS = ['#1c7ed6', '#e03131', '#2f9e44', '#7048e8', '#f76707', '#0ca678'];
const CAPES = [null, '#e03131', '#7048e8', '#ffd43b', '#12b886', '#343a40'];

const PAL = {
  hub: { g1: '#7bc86c', g2: '#74c365', path: '#e6c88f', tuft: '#5aa84f', water: '#4dabf7', tg1: '#2f9e44', tg2: '#37b24d', tree: 'round', leaf1: '#40c057', leaf2: '#2f9e44', rock: '#868e96', flowers: ['#ff8787', '#fff', '#da77f2'], fruit: '#e03131', sky: ['#74c0fc', '#d0ebff'], hill: '#69b55d' },
  w1: { g1: '#5fa85a', g2: '#59a054', path: '#c9a66b', tuft: '#3f8a3f', water: '#339af0', tg1: '#2b8a3e', tg2: '#2f9e44', tree: 'round', leaf1: '#2f9e44', leaf2: '#237032', rock: '#7d8590', flowers: ['#ffd43b', '#ff922b'], fruit: '#ffd43b', sky: ['#8ce99a', '#e6fcf5'], hill: '#3f8a3f' },
  w2: { g1: '#f3dfa2', g2: '#eed898', path: '#fff3bf', tuft: '#d9c27a', water: '#22b8cf', tg1: '#12b886', tg2: '#20c997', tree: 'palm', leaf1: '#2f9e44', leaf2: '#51cf66', rock: '#adb5bd', flowers: ['#ff6b6b', '#f783ac'], sky: ['#3bc9db', '#e3fafc'], hill: '#f3dfa2' },
  w3: { g1: '#e9f2f9', g2: '#dfeaf3', path: '#b9c6d2', tuft: '#c5d5e3', water: '#74c0fc', tg1: '#91a7ba', tg2: '#a5b9ca', tree: 'pine', leaf1: '#2b6e4f', leaf2: '#1f5a40', rock: '#8a94a0', flowers: ['#74c0fc', '#b197fc'], snow: true, sky: ['#a5d8ff', '#f8f9fa'], hill: '#cfd8e3' },
  w4: { g1: '#e0a96d', g2: '#d9a066', path: '#f1cf9d', tuft: '#c48b4f', water: '#f08c00', tg1: '#c2792e', tg2: '#d4883a', tree: 'cactus', leaf1: '#5c940d', leaf2: '#74b816', rock: '#a0522d', flowers: ['#ff8787', '#ffd43b'], sky: ['#ffa94d', '#fff4e6'], hill: '#c98b55' },
  w5: { g1: '#8fd3a6', g2: '#86cc9e', path: '#f3c5c5', tuft: '#63b583', water: '#3bc9db', tg1: '#0ca678', tg2: '#12b886', tree: 'bamboo', leaf1: '#51cf66', leaf2: '#37b24d', rock: '#868e96', flowers: ['#ff8fab', '#ffd6e0', '#e03131'], sky: ['#ffb3c1', '#fff0f3'], hill: '#7cc596', wall: '#fff5f5' },
  w6: { g1: '#3d3558', g2: '#383052', path: '#5c5080', tuft: '#2c2542', water: '#5f3dc4', tg1: '#4b3f72', tg2: '#55487f', tree: 'dead', leaf1: '#3b2f4a', leaf2: '#3b2f4a', rock: '#4a4466', flowers: ['#9775fa', '#5f3dc4'], sky: ['#1a1433', '#4a3a7a'], hill: '#2c2542' },
};
