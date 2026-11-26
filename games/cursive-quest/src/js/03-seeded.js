function seeded(seed) { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// ---------- Storage ----------
const KEY = 'norasCursiveQuest.v1';
function freshState() {
  return {
    v: 1, created: Date.now(), name: 'Nora', companion: null, acc: null, bg: 'meadow',
    stars: 0, letters: {}, lessons: {}, gates: {}, words: {}, sentences: {},
    quizHist: [], seen: {}, badges: {}, chestBonus: [], daily: null, streak: { last: null, count: 0 },
    time: {}, settings: { sound: true, voice: true, music: true, unlockAll: false },
    rowMissions: 0, counts: { traces: 0, writes: 0, quizzes: 0, games: 0, perfect: 0, practice: 0, speedBest: 0 },
    level: { read: 1, words: 1 }, recentMiss: [], comeback: [],
  };
}
let S = freshState();
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const o = JSON.parse(raw); S = Object.assign(freshState(), o); S.settings = Object.assign(freshState().settings, o.settings || {}); S.counts = Object.assign(freshState().counts, o.counts || {}); S.level = Object.assign(freshState().level, o.level || {}); } } catch (e) { /* private mode: play without saving */ }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function L(ch) { return S.letters[ch] || (S.letters[ch] = { intro: false, practiced: 0, trace: 0, write: 0, right: 0, wrong: 0, last: 0 }); }

// ---------- Sound (Web Audio, all synthesized) ----------
const Snd = {
  ctx: null, master: null, music: null, musicGain: null, playing: false, timer: null, nextT: 0, step: 0,
  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    try {
      const AC = window.AudioContext || window.webkitAudioContext; this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.8; this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0; this.musicGain.connect(this.master);
      this.sfx = this.ctx.createGain(); this.sfx.gain.value = 0.9; this.sfx.connect(this.master);
    } catch (e) { this.ctx = null; }
  },
  tone(f, t, dur, type = 'sine', vol = 0.2, dest) {
    if (!this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.sfx); o.start(t); o.stop(t + dur + 0.05);
  },
  play(name) {
    if (!S.settings.sound || !this.ctx) return;
    const t = this.ctx.currentTime + 0.01;
    const seq = {
      tap: [[660, 0, .07, 'triangle', .12]],
      ok: [[784, 0, .16, 'triangle', .22], [1175, .09, .28, 'triangle', .2], [1568, .18, .3, 'sine', .12]],
      no: [[330, 0, .16, 'sine', .18], [262, .12, .26, 'sine', .16]],
      star: [[1047, 0, .12, 'sine', .15], [1319, .06, .12, 'sine', .15], [1568, .12, .12, 'sine', .15], [2093, .18, .3, 'sine', .14]],
      fanfare: [[523, 0, .18, 'square', .08], [659, .14, .18, 'square', .08], [784, .28, .18, 'square', .08], [1047, .42, .5, 'square', .09], [784, .42, .5, 'triangle', .14], [523, .42, .5, 'triangle', .14]],
      unlock: [[392, 0, .2, 'triangle', .15], [523, .1, .2, 'triangle', .15], [659, .2, .2, 'triangle', .15], [784, .3, .2, 'triangle', .15], [1047, .4, .6, 'sine', .18], [1319, .5, .6, 'sine', .12]],
      pop: [[880, 0, .06, 'sine', .15], [1320, .04, .08, 'sine', .1]],
      tick: [[1200, 0, .03, 'square', .05]],
    }[name] || [];
    for (const [f, dt, d, ty, v] of seq) this.tone(f, t + dt, d, ty, v);
  },
  // Cheerful synthesized anthem for menus (I–V–vi–IV in C)
  startMusic() {
    if (!this.ctx || this.playing) { this.fadeMusic(); return; }
    this.playing = true; this.nextT = this.ctx.currentTime + 0.1; this.step = 0;
    this.timer = setInterval(() => this.schedule(), 100);
    this.fadeMusic();
  },
  fadeMusic() {
    if (!this.ctx) return;
    const on = S.settings.sound && S.settings.music && this.wantMusic;
    const g = this.musicGain.gain, t = this.ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(on ? 0.33 : 0, t + 1.2);
  },
  schedule() {
    const beat = 60 / 112 / 2; // eighth notes
    const chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]];
    const mel = [76, 74, 72, 74, 76, 76, 76, -1, 74, 74, 74, -1, 76, 79, 79, -1, 76, 74, 72, 74, 76, 76, 76, 76, 74, 74, 76, 74, 72, -1, -1, -1];
    const f = m => 440 * Math.pow(2, (m - 69) / 12);
    while (this.nextT < this.ctx.currentTime + 0.4) {
      const s = this.step, bar = Math.floor(s / 8) % 4, ch = chords[bar], t = this.nextT;
      if (s % 8 === 0) { this.tone(f(ch[0] - 24), t, beat * 7, 'triangle', 0.25, this.musicGain); for (const n of ch) this.tone(f(n), t, beat * 7.5, 'sine', 0.05, this.musicGain); }
      if (s % 8 === 4) this.tone(f(ch[0] - 12), t, beat * 3, 'triangle', 0.14, this.musicGain);
      this.tone(f(ch[s % 3] + 12), t, beat * 0.9, 'sine', 0.045, this.musicGain);
      const m = mel[s % 32]; if (m > 0 && Math.floor(s / 32) % 2 === 0) this.tone(f(m), t, beat * 1.6, 'triangle', 0.1, this.musicGain);
      if (Math.floor(s / 32) % 2 === 1 && s % 2 === 0) { const mm = mel[(s + 8) % 32]; if (mm > 0) this.tone(f(mm + 12), t, beat * 1.2, 'sine', 0.05, this.musicGain); }
      this.nextT += beat; this.step++;
    }
  },
  setMusicWanted(on) { this.wantMusic = on; if (on) this.startMusic(); else this.fadeMusic(); },
};

// ---------- Voice (device speech, warm female voice when available) ----------
const Voice = {
  v: null, ready: false,
  pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices(); if (!vs.length) return;
    const prefs = ['Samantha (Enhanced)', 'Ava (Premium)', 'Ava (Enhanced)', 'Zoe (Premium)', 'Zoe (Enhanced)', 'Allison (Enhanced)', 'Susan (Enhanced)', 'Samantha', 'Ava', 'Allison', 'Zoe', 'Susan', 'Karen', 'Moira', 'Tessa', 'Serena', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira', 'Victoria'];
    for (const p of prefs) { const m = vs.find(v => v.name.startsWith(p) && /^en/i.test(v.lang)); if (m) { this.v = m; return; } }
    this.v = vs.find(v => /en[-_]US/i.test(v.lang) && /female|woman/i.test(v.name)) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
  },
  init() {
    if (!('speechSynthesis' in window)) return;
    this.pickVoice(); speechSynthesis.onvoiceschanged = () => this.pickVoice();
  },
  say(text, opts = {}) {
    if (!S.settings.voice || !('speechSynthesis' in window) || !text) return Promise.resolve();
    return new Promise(res => {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text.replace(/✨|🌟|⭐|💎|🎉/g, ''));
        if (this.v) u.voice = this.v;
        u.lang = (this.v && this.v.lang) || 'en-US'; u.rate = opts.rate || 0.96; u.pitch = opts.pitch || 1.12; u.volume = 1;
        let done = false; const fin = () => { if (!done) { done = true; res(); } };
        u.onend = fin; u.onerror = fin; setTimeout(fin, 900 + text.length * 90);
        speechSynthesis.speak(u);
      } catch (e) { res(); }
    });
  },
  stop() { try { speechSynthesis.cancel(); } catch (e) {} },
};

// ---------- Toast / confetti / overlays ----------
function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), ms); }
const Confetti = {
  parts: [], run: false,
  burst(n = 120) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = $('#confetti'), W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio;
    const cols = ['#7048e8', '#f06595', '#fcc419', '#20c997', '#4dabf7', '#ff8787'];
    for (let i = 0; i < n; i++) this.parts.push({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .45, vx: (Math.random() - .5) * 22 * devicePixelRatio, vy: (-Math.random() * 22 - 6) * devicePixelRatio, r: (4 + Math.random() * 6) * devicePixelRatio, c: pick(cols), a: Math.random() * 6, star: Math.random() < .3, life: 0 });
    if (!this.run) { this.run = true; requestAnimationFrame(() => this.tick()); }
  },
  tick() {
    const c = $('#confetti'), g = c.getContext('2d'); g.clearRect(0, 0, c.width, c.height);
    this.parts = this.parts.filter(p => p.life < 160 && p.y < c.height + 40);
    for (const p of this.parts) {
      p.life++; p.vy += 0.6 * devicePixelRatio; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += 0.15;
      g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c;
      if (p.star) { g.font = `${p.r * 3}px sans-serif`; g.fillText('★', -p.r, p.r); } else g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      g.restore();
    }
    if (this.parts.length) requestAnimationFrame(() => this.tick()); else { this.run = false; g.clearRect(0, 0, c.width, c.height); }
  },
};
function overlay(contentEl, { cls = '' } = {}) {
  const o = $('#overlay'); o.innerHTML = ''; const card = h('div', { class: 'card ' + cls }); card.append(contentEl); o.append(card); o.classList.add('on');
  return () => o.classList.remove('on');
}

// ---------- Art (original SVG) ----------
// Nora: bold retro sports-anime style, fixed look across the game.
function noraSVG(opts = {}) {
  const ol = '#14121f', hair = '#1d1b2e', skin = '#ffe1c8';
  const outfit = opts.kit === 'explorer' ? '#7048e8' : '#1c7ed6';
  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="nora-svg" aria-label="Nora">
  <g class="ponytail" style="transform-origin:128px 46px">
    <path d="M124 44 C 168 18, 198 60, 184 104 C 176 128, 164 136, 170 152 C 178 160, 188 152, 184 144 C 196 156, 178 172, 160 158 C 150 146, 156 124, 160 104 C 166 76, 152 58, 124 56 Z" fill="${hair}" stroke="${ol}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M168 70 C 176 84, 176 100, 170 112" stroke="#5b5980" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
  </g>
  <ellipse cx="126" cy="48" rx="13" ry="10" transform="rotate(-30 126 48)" fill="#f783ac" stroke="${ol}" stroke-width="4"/>
  <path d="M22 240 C 26 206, 52 190, 78 186 L 122 186 C 148 190, 174 206, 178 240 Z" fill="${outfit}" stroke="${ol}" stroke-width="5"/>
  <path d="M78 186 L 100 214 L 122 186" fill="#fff" stroke="${ol}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M30 228 C 40 210, 56 200, 74 196" stroke="#fcc419" stroke-width="5" fill="none"/><path d="M170 228 C 160 210, 144 200, 126 196" stroke="#fcc419" stroke-width="5" fill="none"/>
  ${opts.kit === 'explorer' ? `<path d="M140 214 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1z" fill="#fcc419" stroke="${ol}" stroke-width="2.5"/>` : `<text x="148" y="232" font-size="22" font-weight="800" fill="#fff" stroke="${ol}" stroke-width="1" font-family="Arial">9</text>`}
  <rect x="88" y="164" width="24" height="26" fill="${skin}" stroke="${ol}" stroke-width="4"/>
  <path d="M52 94 C 50 142, 76 174, 100 178 C 124 174, 150 142, 148 94 C 148 60, 128 40, 100 40 C 72 40, 52 60, 52 94 Z" fill="${skin}" stroke="${ol}" stroke-width="5"/>
  <path d="M44 104 C 34 52, 70 20, 104 22 C 142 22, 166 52, 156 108 C 150 88, 144 76, 132 66 C 116 82, 88 86, 60 78 C 54 86, 50 94, 44 104 Z" fill="${hair}" stroke="${ol}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M60 78 C 72 70, 92 62, 112 56 C 100 70, 84 78, 60 78 Z" fill="${hair}"/>
  <path d="M46 100 C 44 120, 48 138, 56 150 C 52 132, 52 118, 56 102 Z" fill="${hair}" stroke="${ol}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M154 104 C 156 122, 152 140, 144 150 C 148 132, 148 118, 144 104 Z" fill="${hair}" stroke="${ol}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M72 38 C 88 28, 116 28, 134 40" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>
  <path d="M80 46 C 92 40, 104 40, 112 42" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".4"/>
  <path d="M64 44 l4.5 9 10 1.2 -7.5 6.8 2.2 9.8 -9.2 -5 -9.2 5 2.2 -9.8 -7.5 -6.8 10 -1.2z" fill="#fcc419" stroke="${ol}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M66 94 Q 78 86 91 91" stroke="${hair}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M109 91 Q 122 86 134 94" stroke="${hair}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <g class="eyes">
    <ellipse cx="80" cy="114" rx="12" ry="15" fill="#fff" stroke="${ol}" stroke-width="2.5"/>
    <ellipse cx="81" cy="116" rx="9.5" ry="12.5" fill="#8a5426"/><ellipse cx="81" cy="118" rx="5" ry="7" fill="#2b1608"/>
    <circle cx="77" cy="110" r="4" fill="#fff"/><circle cx="85" cy="122" r="2" fill="#fff"/>
    <path d="M65 106 Q 79 94 95 104" stroke="${ol}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M65 106 l-5 -3" stroke="${ol}" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="120" cy="114" rx="12" ry="15" fill="#fff" stroke="${ol}" stroke-width="2.5"/>
    <ellipse cx="119" cy="116" rx="9.5" ry="12.5" fill="#8a5426"/><ellipse cx="119" cy="118" rx="5" ry="7" fill="#2b1608"/>
    <circle cx="115" cy="110" r="4" fill="#fff"/><circle cx="123" cy="122" r="2" fill="#fff"/>
    <path d="M105 104 Q 121 94 135 106" stroke="${ol}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M135 106 l5 -3" stroke="${ol}" stroke-width="3.5" stroke-linecap="round"/>
  </g>
  <path d="M62 136 l6 -5 M69 138 l6 -5 M76 139 l5 -4" stroke="#f06595" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M124 139 l5 -4 M131 138 l6 -5 M138 136 l6 -5" stroke="#f06595" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M100 126 l-2 6 3 1" stroke="#c98b6b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M84 144 Q 100 166 116 144 Z" fill="#c92a3a" stroke="${ol}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M86 145 L 114 145 L 112 149 L 88 149 Z" fill="#fff"/>
  <path d="M92 156 Q 100 152 108 156 Q 100 162 92 156" fill="#ff8fa3"/>
</svg>`;
}

