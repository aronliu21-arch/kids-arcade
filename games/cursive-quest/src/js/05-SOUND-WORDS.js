const SOUND_WORDS = {
  a: ['apple', '🍎'], b: ['ball', '⚽'], c: ['cat', '🐱'], d: ['dog', '🐶'], e: ['egg', '🥚'], f: ['fish', '🐟'], g: ['grapes', '🍇'],
  h: ['hat', '🎩'], i: ['igloo', '🧊'], j: ['juice', '🧃'], k: ['kite', '🪁'], l: ['lion', '🦁'], m: ['moon', '🌙'], n: ['nest', '🪺'],
  o: ['octopus', '🐙'], p: ['pig', '🐷'], q: ['queen', '👸'], r: ['rainbow', '🌈'], s: ['sun', '☀️'], t: ['tiger', '🐯'], u: ['umbrella', '☂️'],
  v: ['violin', '🎻'], w: ['whale', '🐳'], x: ['x-ray', '🩻'], y: ['yo-yo', '🪀'], z: ['zebra', '🦓'],
};
const CONFUSE = {
  a: 'odgqc', b: 'flhk', c: 'eoa', d: 'agql', e: 'lci', f: 'bjl', g: 'qajy', h: 'kbn', i: 'ejt', j: 'gyi', k: 'hbl', l: 'ebf', m: 'nw', n: 'mvuh',
  o: 'acv', p: 'jqg', q: 'gpa', r: 'szn', s: 'ri', t: 'ild', u: 'wvn', v: 'unw', w: 'umv', x: 'nv', y: 'gjz', z: 'yr',
  A: 'OCU', B: 'RPD', C: 'EOG', D: 'BOP', E: 'CL', F: 'TJ', G: 'SC', H: 'KN', I: 'JTL', J: 'IG', K: 'HX', L: 'SQ', M: 'NW', N: 'MH',
  O: 'ACD', P: 'RB', Q: 'ZL', R: 'PB', S: 'LG', T: 'FI', U: 'YV', V: 'WU', W: 'VM', X: 'KH', Y: 'UJ', Z: 'QY',
};
const JOIN_LESSONS = [
  { id: 'j1', name: 'Bottom Joins', ico: '🌊', items: ['an', 'in', 'um', 'el', 'it', 'us', 'ap', 'er'], tip: 'Most letters end low with a tail that swings up into the next letter.' },
  { id: 'j2', name: 'Climbing Joins', ico: '🧗‍♀️', items: ['ll', 'th', 'ck', 'ef', 'ul', 'ih', 'eb', 'ak'], tip: 'To join a tall letter, the tail keeps climbing all the way to the top line.' },
  { id: 'j3', name: 'Top Joins', ico: '🌉', items: ['on', 'ot', 'we', 've', 'bi', 'wa', 'or', 'br'], tip: 'b, o, v and w end at the middle line, so the bridge stays up high.' },
  { id: 'j4', name: 'Round Joins', ico: '🫧', items: ['ca', 'ad', 'ag', 'oo', 'ea', 'go', 'eq', 'id'], tip: 'Swing up over the top, then go back around to make the circle.' },
  { id: 'j5', name: 'Short Chains', ico: '⛓️', items: ['the', 'and', 'ing', 'ack', 'ill', 'oat', 'ell', 'ump'], tip: 'Keep your pencil down — the whole chain is one smooth stroke!' },
  { id: 'j6', name: 'First Words', ico: '✨', items: ['cat', 'sun', 'hop', 'big', 'wet', 'fly', 'zip', 'jam'], tip: 'Write the whole word first, then dot your i\'s and cross your t\'s.' },
];
const WORDS = {
  animals: { name: 'Animals', ico: '🐾', list: [['cat', '🐱'], ['dog', '🐶'], ['pig', '🐷'], ['cow', '🐮'], ['hen', '🐔'], ['fox', '🦊'], ['owl', '🦉'], ['bee', '🐝'], ['duck', '🦆'], ['fish', '🐟'], ['frog', '🐸'], ['bear', '🐻'], ['lion', '🦁'], ['goat', '🐐'], ['deer', '🦌'], ['horse', '🐴'], ['zebra', '🦓'], ['tiger', '🐯'], ['snake', '🐍'], ['rabbit', '🐰'], ['turtle', '🐢'], ['monkey', '🐵'], ['penguin', '🐧'], ['giraffe', '🦒']] },
  food: { name: 'Food', ico: '🍎', list: [['jam', '🍓'], ['egg', '🥚'], ['pie', '🥧'], ['bun', '🍔'], ['rice', '🍚'], ['milk', '🥛'], ['cake', '🍰'], ['soup', '🍲'], ['corn', '🌽'], ['pear', '🍐'], ['apple', '🍎'], ['bread', '🍞'], ['pizza', '🍕'], ['grape', '🍇'], ['lemon', '🍋'], ['peach', '🍑'], ['cookie', '🍪'], ['carrot', '🥕'], ['banana', '🍌'], ['cheese', '🧀'], ['noodles', '🍜']] },
  colors: { name: 'Colors', ico: '🎨', list: [['red', '🔴'], ['tan', '🟤'], ['blue', '🔵'], ['pink', '🌸'], ['gray', '🐘'], ['gold', '🥇'], ['green', '🟢'], ['black', '⚫'], ['white', '⚪'], ['brown', '🤎'], ['purple', '🟣'], ['orange', '🟠'], ['yellow', '🟡'], ['silver', '🥈']] },
  family: { name: 'Family', ico: '👪', list: [['mom', '👩'], ['dad', '👨'], ['baby', '👶'], ['aunt', '👩‍🦰'], ['sister', '👧'], ['uncle', '👨‍🦱'], ['brother', '👦'], ['cousin', '🧒'], ['grandma', '👵'], ['grandpa', '👴'], ['family', '👨‍👩‍👧‍👦'], ['friend', '🤝'], ['home', '🏠']] },
  nature: { name: 'Nature', ico: '🌿', list: [['sun', '☀️'], ['sky', '🌤️'], ['sea', '🌊'], ['tree', '🌳'], ['leaf', '🍃'], ['rain', '🌧️'], ['snow', '❄️'], ['moon', '🌙'], ['star', '⭐'], ['rock', '🪨'], ['lake', '🏞️'], ['cloud', '☁️'], ['river', '🏞️'], ['flower', '🌸'], ['forest', '🌲'], ['rainbow', '🌈'], ['mountain', '⛰️']] },
  soccer: { name: 'Soccer', ico: '⚽', list: [['ball', '⚽'], ['goal', '🥅'], ['kick', '🦶'], ['team', '👟'], ['pass', '🔁'], ['win', '🏆'], ['score', '🔢'], ['field', '🏟️'], ['coach', '📣'], ['shoot', '🎯'], ['player', '🏃‍♀️'], ['captain', '🧢']] },
  math: { name: 'Math', ico: '🔢', list: [['add', '➕'], ['sum', '🧮'], ['ten', '🔟'], ['plus', '➕'], ['zero', '0️⃣'], ['count', '🔢'], ['shape', '🔷'], ['seven', '7️⃣'], ['circle', '⚪'], ['square', '🟦'], ['number', '#️⃣'], ['triangle', '🔺']] },
};
const ALL_WORDS = Object.values(WORDS).flatMap(c => c.list.map(([w, e]) => ({ w, e })));
const SENTENCE_SETS = [
  ['I can run.', 'I see a cat.'],
  ['Nora is kind.', 'My dog is big.'],
  ['The sun is hot.', 'A bee can fly.'],
  ['Kick the ball!', 'We won the game!'],
  ['Mom made soup.', 'I love my family.'],
  ['Look at the stars!', 'Owls hoot at night.'],
  ['The frog can jump.', 'Fish swim fast.'],
  ['Grandma bakes cake.', 'Zebras have stripes.'],
];
const LIFE_TIPS = [
  'Try it today: write your name in cursive on a sticky note!',
  'Next time someone has a birthday, sign the card in cursive.',
  'Write the score of your next soccer game in cursive.',
  'Ask a grown-up to write you a secret cursive message — can you read it?',
  'Write tomorrow\'s snack list in cursive for your family.',
  'Label your notebook or pencil box with your name in cursive.',
  'Look for cursive writing on old letters, cards, or signs. Can you read some of it?',
  'Write a thank-you note in cursive — grown-ups love those!',
  'Write a math fact in cursive, like “ten plus ten”.',
];
const PRAISE = ['Amazing!', 'Wonderful!', 'You got it!', 'Super job!', 'Brilliant!', 'Fantastic!', 'Yes! Great eyes!', 'Woohoo!'];
const RETRY = ['Almost there! Try one more time.', 'So close! Have another look.', 'Good try! Look carefully and try again.'];

// ===== Handwriting pad: guidelines, model, arrows, demo animation, touch/mouse/pencil ink =====
class Pad {
  constructor(host, opts) {
    this.opts = Object.assign({ mode: 'trace', label: '' }, opts);
    this.text = opts.text; this.L = layoutText(this.text);
    this.strokes = []; this.cur = null; this.anim = null; this.demoProg = null; this.locked = false; this.showModelOverlay = false;
    this.wrap = h('div', { class: 'pad-wrap' });
    this.cv = h('canvas', { 'aria-label': 'Handwriting area' });
    this.labelEl = h('div', { class: 'pad-label' }, this.opts.label || '');
    if (!this.opts.label) this.labelEl.style.display = 'none';
    this.fb = h('div', { class: 'feedback' });
    this.tools = h('div', { class: 'pad-tools' });
    this.wrap.append(this.cv, this.labelEl, this.fb, this.tools);
    host.append(this.wrap);
    this.ctx = this.cv.getContext('2d');
    this.bind();
    this.ro = new ResizeObserver(() => requestAnimationFrame(() => this.resize())); this.ro.observe(this.cv);
    this.resize();
  }
  setMode(mode, label) { this.opts.mode = mode; if (label != null) { this.labelEl.textContent = label; this.labelEl.style.display = label ? '' : 'none'; } this.showModelOverlay = false; this.draw(); }
  resize() {
    const r = this.cv.getBoundingClientRect(); if (!r.width) return;
    const dpr = Math.min(3, devicePixelRatio || 1);
    this.W = r.width; this.H = r.height; this.cv.width = r.width * dpr; this.cv.height = r.height * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const b = this.L.bbox, w = Math.max(b.w, 1.4) + 1.0;
    const vTop = Math.max(2.35, b.maxY + 0.35), vBot = Math.min(-1.25, b.minY - 0.3);
    this.U = Math.min((this.H - 16) / (vTop - vBot), (this.W - 20) / w, 150);
    this.ox = (this.W - b.w * this.U) / 2 - b.minX * this.U;
    this.oy = 8 + vTop * this.U + ((this.H - 16) - (vTop - vBot) * this.U) / 2;
    this.draw();
  }
  toPx(p) { return [this.ox + p[0] * this.U, this.oy - p[1] * this.U]; }
  toU(x, y) { return [(x - this.ox) / this.U, (this.oy - y) / this.U]; }
  bind() {
    const cv = this.cv;
    const pos = e => { const r = cv.getBoundingClientRect(); return this.toU(e.clientX - r.left, e.clientY - r.top); };
    cv.addEventListener('pointerdown', e => {
      if (this.locked || this.anim) return;
      if (this.cur && e.pointerId !== this.curId) return; // ignore a second finger / palm
      e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (_) {} this.curId = e.pointerId;
      this.cur = [pos(e)]; this.strokes.push(this.cur); this.draw(); this.opts.onInk && this.opts.onInk();
    });
    cv.addEventListener('pointermove', e => {
      if (!this.cur || e.pointerId !== this.curId) return; e.preventDefault();
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of (evs.length ? evs : [e])) { const p = pos(ev), q = this.cur[this.cur.length - 1]; if (d2(p, q) > 0.012) this.cur.push(p); }
      this.draw();
    });
    const end = e => { if (this.cur && e.pointerId === this.curId) { this.cur = null; this.curId = null; this.draw(); } };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); cv.addEventListener('lostpointercapture', end);
    cv.addEventListener('touchstart', e => e.preventDefault(), { passive: false }); // stop iPad scroll/zoom while writing
  }
  clear() { this.strokes = []; this.cur = null; this.showModelOverlay = false; this.hideFeedback(); this.draw(); }
  hasInk() { return this.strokes.some(s => s.length > 1); }
  drawLines(g) {
    const W = this.W, y = k => this.oy - k * this.U;
    g.lineCap = 'round';
    g.strokeStyle = '#e9ecef'; g.lineWidth = 1.5; g.setLineDash([]);
    g.beginPath(); g.moveTo(0, y(-1)); g.lineTo(W, y(-1)); g.stroke();
    g.strokeStyle = '#74c0fc'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(0, y(2)); g.lineTo(W, y(2)); g.stroke();
    g.strokeStyle = '#a5d8ff'; g.lineWidth = 2; g.setLineDash([10, 9]); g.beginPath(); g.moveTo(0, y(1)); g.lineTo(W, y(1)); g.stroke(); g.setLineDash([]);
    g.strokeStyle = '#f06595'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, y(0)); g.lineTo(W, y(0)); g.stroke();
    if (this.U > 45 && this.W > 420) {
      g.fillStyle = '#adb5bd'; g.font = '600 12px system-ui, sans-serif';
      g.fillText('top line', 8, y(2) - 5); g.fillText('middle line', 8, y(1) - 5); g.fillText('baseline', 8, y(0) - 5);
    }
  }
  path(g, pts, upto) {
    g.beginPath(); const n = upto == null ? pts.length : upto;
    for (let i = 0; i < n; i++) { const [x, y] = this.toPx(pts[i]); i ? g.lineTo(x, y) : g.moveTo(x, y); }
  }
  drawModel(g, alpha, withGuides) {
    const U = this.U;
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const s of this.L.strokes) {
      if (s.dot) { const [x, y] = this.toPx(s.pts[0]); g.fillStyle = `rgba(173,181,189,${alpha})`; g.beginPath(); g.arc(x, y, U * 0.16, 0, 7); g.fill(); continue; }
      g.strokeStyle = `rgba(206,212,218,${alpha})`; g.lineWidth = Math.max(10, U * 0.3); this.path(g, s.pts); g.stroke();
      if (withGuides) {
        g.strokeStyle = `rgba(134,142,150,${alpha * 0.9})`; g.lineWidth = 2; g.setLineDash([6, 7]); this.path(g, s.pts); g.stroke(); g.setLineDash([]);
        if (s.conn && this.opts.joins) for (const [a, b] of s.conn) { g.strokeStyle = 'rgba(252,196,25,.9)'; g.lineWidth = Math.max(8, U * 0.22); g.beginPath(); for (let i = a; i <= b + 1 && i < s.pts.length; i++) { const [x, y] = this.toPx(s.pts[i]); i === a ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
      }
    }
    if (withGuides) this.drawArrows(g, alpha);
  }
  drawArrows(g, alpha) {
    const U = this.U; let num = 1;
    for (const s of this.L.strokes) {
      if (!s.dot) {
        // direction chevrons every ~0.9 units
        let acc = 0;
        for (let i = 1; i < s.pts.length - 1; i++) {
          acc += d2(s.pts[i - 1], s.pts[i]);
          if (acc > 0.85 && i > 4) {
            acc = 0;
            const [x, y] = this.toPx(s.pts[i]), [x2, y2] = this.toPx(s.pts[Math.min(s.pts.length - 1, i + 2)]);
            const a = Math.atan2(y2 - y, x2 - x), r = Math.max(7, U * 0.13);
            g.fillStyle = `rgba(112,72,232,${alpha * 0.8})`; g.beginPath();
            g.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); g.lineTo(x + Math.cos(a + 2.4) * r, y + Math.sin(a + 2.4) * r); g.lineTo(x + Math.cos(a - 2.4) * r, y + Math.sin(a - 2.4) * r); g.closePath(); g.fill();
          }
        }
        const [ex, ey] = this.toPx(s.pts[s.pts.length - 1]);
        g.fillStyle = `rgba(250,82,82,${alpha * 0.85})`; g.beginPath(); g.arc(ex, ey, Math.max(5, U * 0.08), 0, 7); g.fill();
      }
      const [sx, sy] = this.toPx(s.pts[0]), r = Math.max(13, U * 0.17);
      g.fillStyle = `rgba(47,158,68,${alpha})`; g.beginPath(); g.arc(sx, sy, r, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.font = `700 ${Math.round(r * 1.2)}px system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(num++), sx, sy + 1); g.textAlign = 'start'; g.textBaseline = 'alphabetic';
    }
  }
  drawInk(g) {
    g.strokeStyle = '#7048e8'; g.fillStyle = '#7048e8'; g.lineWidth = Math.max(5, this.U * 0.12); g.lineCap = 'round'; g.lineJoin = 'round';
    for (const s of this.strokes) {
      if (s.length === 1) { const [x, y] = this.toPx(s[0]); g.beginPath(); g.arc(x, y, g.lineWidth * 0.6, 0, 7); g.fill(); continue; }
      this.path(g, s); g.stroke();
    }
  }
  draw() {
    const g = this.ctx; if (!this.W) return;
    g.clearRect(0, 0, this.W, this.H);
    g.fillStyle = '#fffdf7'; g.fillRect(0, 0, this.W, this.H);
    this.drawLines(g);
    const m = this.opts.mode;
    if (m === 'trace') this.drawModel(g, 1, true);
    else if (m === 'faded') { this.drawModel(g, 0.35, false); this.drawStartDots(g); }
    if (this.demoProg) this.drawDemo(g);
    this.drawInk(g);
    if (this.showModelOverlay) { g.globalAlpha = 0.55; g.strokeStyle = '#20c997'; g.lineWidth = Math.max(3, this.U * 0.06); g.setLineDash([8, 6]); for (const s of this.L.strokes) { if (!s.dot) { this.path(g, s.pts); g.stroke(); } } g.setLineDash([]); g.globalAlpha = 1; }
  }
  drawStartDots(g) {
    let num = 1;
    for (const s of this.L.strokes) { const [sx, sy] = this.toPx(s.pts[0]), r = Math.max(12, this.U * 0.15); g.fillStyle = 'rgba(47,158,68,.9)'; g.beginPath(); g.arc(sx, sy, r, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `700 ${Math.round(r * 1.2)}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(num++), sx, sy + 1); g.textAlign = 'start'; g.textBaseline = 'alphabetic'; }
  }
  drawDemo(g) {
    const { si, k } = this.demoProg, U = this.U;
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let i = 0; i <= si && i < this.L.strokes.length; i++) {
      const s = this.L.strokes[i];
      if (s.dot) { const [x, y] = this.toPx(s.pts[0]); g.fillStyle = '#e64980'; g.beginPath(); g.arc(x, y, U * 0.11, 0, 7); g.fill(); continue; }
      const n = i < si ? s.pts.length : k;
      g.strokeStyle = '#e64980'; g.lineWidth = Math.max(6, U * 0.13); this.path(g, s.pts, n); g.stroke();
      if (this.opts.joins && s.conn) for (const [a, b] of s.conn) { if (n > a) { g.strokeStyle = '#fab005'; g.beginPath(); for (let j = a; j <= Math.min(b + 1, n - 1); j++) { const [x, y] = this.toPx(s.pts[j]); j === a ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } }
      if (i === si && n > 0 && n < s.pts.length) {
        const [x, y] = this.toPx(s.pts[n - 1]);
        g.fillStyle = '#fcc419'; g.strokeStyle = '#7048e8'; g.lineWidth = 3; g.beginPath(); g.arc(x, y, Math.max(9, U * 0.12), 0, 7); g.fill(); g.stroke();
        g.font = `${Math.max(22, U * 0.4)}px serif`; g.fillText('✏️', x + 4, y - 4);
      }
    }
  }
  // Animate the model being written. Resolves when finished.
  demo(speed = 2.6) {
    this.stopDemo(); this.hideFeedback();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    return new Promise(res => {
      const strokes = this.L.strokes; let si = 0, k = 0, last = performance.now(), pause = 0;
      this.demoRes = res;
      const stepLen = strokes[0] && !strokes[0].dot ? 1 : 0;
      const frame = now => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (pause > 0) { pause -= dt; }
        else {
          const s = strokes[si];
          if (s.dot) { k = 1; } else {
            const ptsPerSec = speed / STEP * (reduce ? 4 : 1);
            k = Math.min(s.pts.length, k + Math.max(1, Math.round(ptsPerSec * dt)));
          }
          if (k >= s.pts.length) { if (si < strokes.length - 1) { si++; k = 0; pause = 0.45; } else { this.demoProg = { si, k }; this.draw(); this.anim = null; setTimeout(() => { this.demoProg = null; this.draw(); res(); }, 700); return; } }
        }
        this.demoProg = { si, k }; this.draw();
        this.anim = requestAnimationFrame(frame);
      };
      this.anim = requestAnimationFrame(frame);
    });
  }
  stopDemo() { if (this.anim) { cancelAnimationFrame(this.anim); this.anim = null; } this.demoProg = null; if (this.demoRes) { const r = this.demoRes; this.demoRes = null; r(); } this.draw(); }
  score() { return scoreInk(this.text, this.strokes, this.opts.mode === 'write' ? 'write' : 'trace'); }
  showFeedback(el) { this.fb.innerHTML = ''; this.fb.append(el); this.fb.classList.add('on'); }
  hideFeedback() { this.fb.classList.remove('on'); }
  // For automated tests: write the model perfectly as ink
  autoInk(jitter = 0) { this.strokes = this.L.strokes.map(s => s.pts.filter((_, i) => i % 2 === 0 || s.dot).map(p => [p[0] + (Math.random() - .5) * jitter, p[1] + (Math.random() - .5) * jitter])); this.draw(); }
  destroy() { this.stopDemo(); this.ro.disconnect(); }
}

