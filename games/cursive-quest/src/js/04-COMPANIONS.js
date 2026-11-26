const COMPANIONS = [
  { id: 'fox', name: 'Fifi the Fox', need: 0 },
  { id: 'bunny', name: 'Bella the Bunny', need: 0 },
  { id: 'kitten', name: 'Kiki the Kitten', need: 0 },
  { id: 'owl', name: 'Olive the Owl', need: 25 },
  { id: 'penguin', name: 'Pip the Penguin', need: 45 },
  { id: 'unicorn', name: 'Luna the Unicorn', need: 70 },
  { id: 'panda', name: 'Poppy the Panda', need: 110 },
  { id: 'dragon', name: 'Daisy the Dragon', need: 160 },
];
const ACCESSORIES = [
  { id: 'bow', name: 'Pink Bow', need: 10 }, { id: 'flowers', name: 'Flower Crown', need: 30 },
  { id: 'glasses', name: 'Star Glasses', need: 55 }, { id: 'wizard', name: 'Wizard Hat', need: 85 },
  { id: 'scarf', name: 'Cozy Scarf', need: 125 }, { id: 'crown', name: 'Royal Crown', need: 180 },
];
const BACKGROUNDS = [
  { id: 'meadow', name: 'Rainbow Meadow', need: 0, css: 'linear-gradient(160deg,#ffe8f3,#e3f2ff,#e6fcf5)' },
  { id: 'forest', name: 'Fairy Forest', need: 20, css: 'linear-gradient(160deg,#ebfbee,#d3f9d8,#fff9db)' },
  { id: 'ocean', name: 'Sparkle Ocean', need: 40, css: 'linear-gradient(160deg,#c5f6fa,#a5d8ff,#d0ebff)' },
  { id: 'candy', name: 'Candy Clouds', need: 90, css: 'linear-gradient(160deg,#ffdeeb,#fff3bf,#e5dbff)' },
  { id: 'space', name: 'Starry Space', need: 150, css: 'linear-gradient(160deg,#1b1446,#2b1f6b,#0d3b66)' },
  { id: 'castle', name: 'Crystal Castle', need: 220, css: 'linear-gradient(160deg,#fff0f6,#f3d9fa,#d0bfff)' },
];
function face(c = '#2b2350') {
  return `<circle cx="40" cy="52" r="4.6" fill="${c}"/><circle cx="60" cy="52" r="4.6" fill="${c}"/><circle cx="41.6" cy="50.4" r="1.6" fill="#fff"/><circle cx="61.6" cy="50.4" r="1.6" fill="#fff"/>
  <ellipse cx="32" cy="61" rx="5" ry="3" fill="#ff8fab" opacity=".7"/><ellipse cx="68" cy="61" rx="5" ry="3" fill="#ff8fab" opacity=".7"/>
  <path d="M45 61 Q 50 66 55 61" stroke="${c}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
}
function companionSVG(id, acc) {
  const parts = {
    fox: `<path d="M70 90 C 96 86, 98 60, 86 52 C 90 70, 80 80, 66 82Z" fill="#ff922b"/><path d="M86 52 C 92 60, 92 68, 88 74" fill="#fff"/>
      <ellipse cx="50" cy="88" rx="22" ry="12" fill="#ff922b"/><path d="M24 40 L 26 14 L 44 28Z M76 40 L 74 14 L 56 28Z" fill="#ff922b"/><path d="M28 34 L 29 20 L 39 28Z M72 34 L 71 20 L 61 28Z" fill="#ffd8a8"/>
      <circle cx="50" cy="52" r="28" fill="#ff922b"/><path d="M22 56 C 30 74, 46 78, 50 70 C 54 78, 70 74, 78 56 C 66 62, 56 60, 50 64 C 44 60, 34 62, 22 56Z" fill="#fff"/><ellipse cx="50" cy="63" rx="3.4" ry="2.4" fill="#2b2350"/>`,
    bunny: `<ellipse cx="50" cy="88" rx="22" ry="12" fill="#f8f0fc"/><ellipse cx="38" cy="18" rx="8" ry="22" fill="#f8f0fc"/><ellipse cx="62" cy="18" rx="8" ry="22" fill="#f8f0fc"/><ellipse cx="38" cy="20" rx="4" ry="15" fill="#fcc2d7"/><ellipse cx="62" cy="20" rx="4" ry="15" fill="#fcc2d7"/>
      <circle cx="50" cy="52" r="28" fill="#f8f0fc"/><ellipse cx="50" cy="60" rx="3" ry="2.2" fill="#f06595"/>`,
    kitten: `<path d="M72 92 C 92 92, 94 74, 84 70" stroke="#adb5bd" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="88" rx="22" ry="12" fill="#adb5bd"/><path d="M24 42 L 24 18 L 44 30Z M76 42 L 76 18 L 56 30Z" fill="#adb5bd"/><path d="M28 36 L 28 24 L 38 31Z M72 36 L 72 24 L 62 31Z" fill="#ffc9c9"/>
      <circle cx="50" cy="52" r="28" fill="#adb5bd"/><path d="M44 26 l2 8 M50 25 v9 M56 26 l-2 8" stroke="#868e96" stroke-width="3" stroke-linecap="round"/><ellipse cx="50" cy="59" rx="3" ry="2.2" fill="#f06595"/><path d="M22 58 h10 M22 63 h10 M68 58 h10 M68 63 h10" stroke="#f1f3f5" stroke-width="1.6"/>`,
    owl: `<ellipse cx="50" cy="86" rx="24" ry="14" fill="#a9744f"/><path d="M24 34 L 28 20 L 38 30Z M76 34 L 72 20 L 62 30Z" fill="#8c5a35"/><circle cx="50" cy="54" r="29" fill="#a9744f"/><ellipse cx="50" cy="80" rx="13" ry="10" fill="#ffe8cc"/>
      <circle cx="39" cy="51" r="11" fill="#fff4e6"/><circle cx="61" cy="51" r="11" fill="#fff4e6"/><path d="M47 58 L 50 64 L 53 58Z" fill="#fab005"/>`,
    unicorn: `<ellipse cx="50" cy="88" rx="22" ry="12" fill="#fff"/><path d="M50 30 L 45 4 L 55 30Z" fill="#fcc419"/><path d="M47 22 l6 -2 M46 15 l7 -2" stroke="#e8a800" stroke-width="1.6"/>
      <path d="M26 40 L 26 22 L 40 32Z M74 40 L 74 22 L 60 32Z" fill="#fff"/><circle cx="50" cy="52" r="28" fill="#fff"/><path d="M60 26 C 84 26, 88 50, 80 70 C 78 54, 72 44, 62 40 C 68 50, 66 58, 64 62 C 60 50, 56 40, 50 34Z" fill="#f783ac"/><path d="M78 40 C 84 50, 84 60, 80 70" stroke="#b197fc" stroke-width="4" fill="none"/><ellipse cx="50" cy="66" rx="9" ry="6" fill="#ffe3ec"/>`,
    panda: `<ellipse cx="50" cy="88" rx="22" ry="12" fill="#343a40"/><circle cx="28" cy="30" r="9" fill="#343a40"/><circle cx="72" cy="30" r="9" fill="#343a40"/><circle cx="50" cy="52" r="28" fill="#fff"/>
      <ellipse cx="39" cy="52" rx="8" ry="10" transform="rotate(20 39 52)" fill="#343a40"/><ellipse cx="61" cy="52" rx="8" ry="10" transform="rotate(-20 61 52)" fill="#343a40"/><ellipse cx="50" cy="60" rx="3.4" ry="2.4" fill="#343a40"/>`,
    dragon: `<path d="M22 70 C 2 56, 6 40, 16 44 C 14 52, 20 60, 28 62Z M78 70 C 98 56, 94 40, 84 44 C 86 52, 80 60, 72 62Z" fill="#96f2d7"/><ellipse cx="50" cy="88" rx="22" ry="12" fill="#38d9a9"/>
      <path d="M34 30 L 32 14 L 44 26Z M66 30 L 68 14 L 56 26Z" fill="#fcc419"/><circle cx="50" cy="52" r="28" fill="#38d9a9"/><path d="M46 26 l4 -8 4 8Z" fill="#20c997"/><ellipse cx="50" cy="66" rx="10" ry="6" fill="#c3fae8"/><circle cx="46" cy="65" r="1.4" fill="#0ca678"/><circle cx="54" cy="65" r="1.4" fill="#0ca678"/>`,
    penguin: `<ellipse cx="50" cy="88" rx="22" ry="12" fill="#343a40"/><circle cx="50" cy="52" r="29" fill="#343a40"/><path d="M50 32 C 30 32, 26 52, 30 64 C 36 78, 64 78, 70 64 C 74 52, 70 32, 50 32Z" fill="#fff"/><path d="M45 60 L 50 66 L 55 60Z" fill="#fd7e14"/>`,
  };
  const accs = {
    bow: `<g transform="translate(66 26) rotate(15)"><path d="M0 0 L -14 -9 L -14 9Z M0 0 L 14 -9 L 14 9Z" fill="#f06595"/><circle r="4.5" fill="#d6336c"/></g>`,
    flowers: `<g>${[26, 38, 50, 62, 74].map((x, i) => `<g transform="translate(${x} ${30 - (i === 2 ? 4 : i % 2 ? 2 : 0)})">${[0, 72, 144, 216, 288].map(a => `<circle cx="${4 * Math.cos(a * Math.PI / 180)}" cy="${4 * Math.sin(a * Math.PI / 180)}" r="3.6" fill="${['#ff8fab', '#ffd43b', '#b197fc', '#ffd43b', '#ff8fab'][i]}"/>`).join('')}<circle r="2.4" fill="#fff"/></g>`).join('')}</g>`,
    glasses: `<g fill="none" stroke="#7048e8" stroke-width="3"><path d="M40 43 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="rgba(255,212,59,.55)"/><path d="M60 43 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1z" fill="rgba(255,212,59,.55)"/><path d="M46 52 h8"/></g>`,
    wizard: `<g><path d="M50 -4 L 30 30 L 72 30Z" fill="#7048e8"/><ellipse cx="51" cy="30" rx="26" ry="5" fill="#5233c4"/><text x="44" y="22" font-size="11" fill="#fcc419">★</text><text x="54" y="12" font-size="7" fill="#fcc419">★</text></g>`,
    scarf: `<g><path d="M28 76 Q 50 86 72 76 L 72 84 Q 50 94 28 84Z" fill="#e64980"/><path d="M60 82 l4 16 h8 l-4 -16Z" fill="#e64980"/><path d="M34 79 v8 M42 81 v8 M50 82 v8 M58 81 v8" stroke="#fff" stroke-width="2" opacity=".6"/></g>`,
    crown: `<g><path d="M32 30 L 34 12 L 42 22 L 50 8 L 58 22 L 66 12 L 68 30Z" fill="#fcc419"/><circle cx="50" cy="20" r="2.6" fill="#f06595"/><circle cx="38" cy="25" r="2" fill="#4dabf7"/><circle cx="62" cy="25" r="2" fill="#20c997"/></g>`,
  };
  const eyeC = id === 'panda' || id === 'penguin' ? '#fff' : '#2b2350';
  let body = parts[id] || parts.fox;
  return `<svg viewBox="0 -6 100 108" xmlns="http://www.w3.org/2000/svg" aria-label="${id}">${body}${id === 'owl' ? face('#2b2350').replace(/<path d="M45 61[^>]+>/, '') : face(eyeC)}${acc && accs[acc] ? accs[acc] : ''}</svg>`;
}
function accessorySVG(id) { return companionSVG('__none__', id).replace(/<path d="M70 90[\s\S]*?(?=<circle cx="40")/, ''); }
function companionName(id = S.companion) { const c = COMPANIONS.find(c => c.id === id); return c ? c.name.split(' ')[0] : 'Fifi'; }

// ===== Curriculum data =====
const LOWER_GROUPS = [
  { id: 'g1', name: 'Swing-Up Letters', ico: '🧗‍♀️', letters: 'ituw' },
  { id: 'g2', name: 'Loop Letters', ico: '🎀', letters: 'elbhfk' },
  { id: 'g3', name: 'Hop & Dive Letters', ico: '🐬', letters: 'rsjp' },
  { id: 'g4', name: 'Round Letters', ico: '🫧', letters: 'adgocq' },
  { id: 'g5', name: 'Hump Letters', ico: '🐫', letters: 'nmxyvz' },
];
const UPPER_GROUPS = [
  { id: 'c1', name: 'Round Capitals', ico: '🌕', letters: 'ACEO' },
  { id: 'c2', name: 'Hump Capitals', ico: '⛰️', letters: 'NMHKUYZVWX' },
  { id: 'c3', name: 'Loop Capitals', ico: '🌀', letters: 'IJQGSLD' },
  { id: 'c4', name: 'Top-Hat Capitals', ico: '🎩', letters: 'PRBTF' },
];
const TIPS = {
  i: 'Swing up to the middle line, slide back down and add a tail. Then lift your pencil and dot the i!',
  t: 'Swing up past the middle line, slide straight down, add a tail. Lift your pencil and cross the t.',
  u: 'Swing up, slide down, swing up again, slide down — and finish with a tail.',
  w: 'Just like u — but finish with a little bridge at the middle line.',
  e: 'Swing up and loop back down. The loop stays under the middle line.',
  l: 'Swing all the way up to the top line, loop back down to the baseline, add a tail.',
  b: 'Make a tall loop like l, curve up, and finish with a little bridge at the middle line.',
  h: 'Make a tall loop like l, then a hump back down to the baseline.',
  f: 'Tall loop up, straight down below the baseline, then loop back up to the baseline.',
  k: 'Tall loop, then a tiny loop at the middle line, and kick out.',
  r: 'Swing up just above the middle line, take a tiny step, and slide down.',
  s: 'Swing up to a point, curve down and around, and tuck in.',
  j: 'Swing up, slide straight down below the baseline, and loop back up. Lift and dot!',
  p: 'Swing up, dive straight down below the baseline, climb back up and round the bump.',
  a: 'Swing up, go back around like a c to make a circle, then slide down with a tail.',
  d: 'Make the a-circle, then climb up to the top line and slide all the way down.',
  g: 'Make the a-circle, dive below the baseline, and loop back up.',
  o: 'Swing up, go around the circle, and finish with a bridge at the middle line.',
  c: 'Swing up, make a tiny hook, then curve around and down.',
  q: 'Make the a-circle, dive below the baseline, then curl up to the right.',
  n: 'Hump over, slide down, hump over again, and add a tail.',
  m: 'Three humps! Over and down, over and down, over and down, then a tail.',
  x: 'Hump over and slide down with a tail. Lift your pencil and cross it.',
  y: 'Hump over, scoop up, then dive below the baseline and loop back up.',
  v: 'Hump over, slide down, swing up, and finish with a bridge at the middle line.',
  z: 'Hump over, zig down to the baseline, then loop below the line.',
  A: 'Capital A is like a giant lowercase a. It starts near the top line.',
  C: 'Capital C is one big curve from the top line to the baseline.',
  E: 'Capital E looks like a backwards 3 — two bumps!',
  O: 'Capital O is a tall oval with a little loop at the top. It doesn\'t join the next letter.',
  N: 'Capital N has two tall humps — much taller than lowercase n.',
  M: 'Capital M has three tall humps.',
  H: 'Capital H: two tall lines and a bridge across. Lowercase h has a loop instead!',
  K: 'Capital K: a tall line, then a big arm that kicks out.',
  U: 'Capital U is a tall cup that reaches the top line.',
  Y: 'Capital Y is a tall cup with a loop below the baseline.',
  Z: 'Capital Z zigs down and loops below the baseline.',
  V: 'Capital V is a tall v. It doesn\'t join the next letter.',
  W: 'Capital W has two tall valleys.',
  X: 'Capital X: a tall curve and a line that crosses it.',
  I: 'Cursive I starts with a swing from the left — it looks very different from print I!',
  J: 'Cursive J starts like I, then loops below the baseline.',
  Q: 'Surprise! Cursive Q looks like the number 2.',
  G: 'Capital G is a big curve with a short line up and down.',
  S: 'Capital S climbs up, curves down, and makes a loop at the bottom.',
  L: 'Capital L has a loop at the top and a little loop on the baseline.',
  D: 'Capital D has a tall line and a big round belly.',
  P: 'Capital P: a tall line, then a bump at the top.',
  R: 'Capital R: like P, plus a leg that kicks out.',
  B: 'Capital B: a tall line and two bumps.',
  T: 'Capital T: a wavy hat first, then the stem.',
  F: 'Capital F: like T, plus a little cross in the middle.',
};
