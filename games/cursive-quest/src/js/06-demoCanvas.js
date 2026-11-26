// Small static canvas rendering of a model (used in reveal boxes)
function demoCanvas(text, w = 220, hgt = 150) {
  const host = h('div', { style: `width:${w}px;height:${hgt}px;flex:none` });
  return host;
}

// ===== Adaptive question generators, quiz runner and mini-games =====
let CUR = null; // current interactive challenge, used by the test hook

function mastery(ch) {
  const l = S.letters[ch]; if (!l) return 0;
  const read = (l.right + 0.5) / (l.right + l.wrong + 1) * Math.min(1, l.right / 3);
  const write = Math.max(l.write / 3, (l.trace / 3) * 0.7);
  return 0.5 * read + 0.5 * write;
}
const isMastered = ch => mastery(ch) >= 0.72;
function letterWeight(ch) { return 1 + 3 * (1 - mastery(ch)) + (S.recentMiss.includes(ch) ? 3 : 0); }
function weightedPick(arr, wf) {
  const ws = arr.map(wf); let tot = ws.reduce((a, b) => a + b, 0), r = Math.random() * tot;
  for (let i = 0; i < arr.length; i++) { r -= ws[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1];
}
const TEACH_LOWER = LOWER_GROUPS.map(g => g.letters).join('').split('');
const TEACH_UPPER = UPPER_GROUPS.map(g => g.letters).join('').split('');
function poolFor(kind) {
  const order = kind === 'upper' ? TEACH_UPPER : TEACH_LOWER;
  const intro = order.filter(c => S.letters[c] && (S.letters[c].intro || S.letters[c].right > 0));
  for (const c of order) { if (intro.length >= 8) break; if (!intro.includes(c)) intro.push(c); }
  return intro;
}
function capsReady() { return TEACH_UPPER.filter(c => S.letters[c] && S.letters[c].intro).length >= 4; }
function nOpts(kind = 'letter') { const lv = S.level.read; return kind === 'word' ? [3, 4, 4][lv - 1] : [3, 4, 6][lv - 1]; }
let lastTarget = null;
function pickTarget(type, cands, wf = letterWeight) {
  S.seen[type] = S.seen[type] || [];
  const seen = new Set(S.seen[type]);
  let fresh = cands.filter(c => !seen.has(type + ':' + c) && c !== lastTarget);
  if (!fresh.length) { // whole bank used: start a fresh round for these items
    const ids = new Set(cands.map(c => type + ':' + c));
    S.seen[type] = S.seen[type].filter(id => !ids.has(id));
    fresh = cands.filter(c => c !== lastTarget); if (!fresh.length) fresh = cands;
  }
  const t = weightedPick(fresh, wf);
  S.seen[type].push(type + ':' + t); if (S.seen[type].length > 400) S.seen[type].splice(0, 100);
  lastTarget = t; return t;
}
function letterDistractors(t, pool, n) {
  const lv = S.level.read, up = isUpper(t);
  const conf = (CONFUSE[t] || '').split('').filter(c => c !== t);
  const out = [];
  if (lv >= 2) for (const c of shuffle(conf)) { if (out.length >= (lv >= 3 ? 3 : 1)) break; out.push(c); }
  const same = up ? UPPER : LOWER;
  let rest = shuffle([...shuffle(pool.filter(c => isUpper(c) === up)), ...shuffle(same)]).filter(c => c !== t && !out.includes(c));
  if (lv === 1) rest = rest.filter(c => !conf.includes(c));
  for (const c of rest) { if (out.length >= n) break; if (!out.includes(c)) out.push(c); }
  return out.slice(0, n);
}
const cur = (t, o = {}) => cursiveSVG(t, Object.assign({ unit: 40 }, o));
const pr = t => `<span class="pr">${escapeHTML(t)}</span>`;
function wordTier() { return S.level.words; }
function wordCands(maxLen) { return ALL_WORDS.filter(x => x.w.length <= maxLen).map(x => x.w); }
function wordEmoji(w) { const x = ALL_WORDS.find(x => x.w === w); return x ? x.e : '✨'; }
function misspell(w) {
  for (let k = 0; k < 20; k++) {
    let a = w.split('');
    if (Math.random() < 0.5 && a.length > 3) { const i = 1 + rnd(a.length - 2); [a[i], a[i + 1]] = [a[i + 1], a[i]]; }
    else { const i = rnd(a.length), c = CONFUSE[a[i]]; if (c) a[i] = pick(c.split('')); }
    const s = a.join(''); if (s !== w && !ALL_WORDS.some(x => x.w === s)) return s;
  }
  return w + 'e';
}
function wordDistractors(t, n, allowMisspell) {
  const lv = S.level.read; const out = [];
  if (allowMisspell && lv >= 2) out.push(misspell(t));
  let cands = shuffle(ALL_WORDS.map(x => x.w).filter(w => w !== t && Math.abs(w.length - t.length) <= 1));
  if (lv >= 2) cands.sort((a, b) => ((b[0] === t[0]) + (b.slice(-1) === t.slice(-1))) - ((a[0] === t[0]) + (a.slice(-1) === t.slice(-1))));
  for (const w of cands) { if (out.length >= n) break; if (!out.includes(w)) out.push(w); }
  return out;
}
const ALL_JOINS = JOIN_LESSONS.flatMap(j => j.items);

const GEN = {
  recLower(ctx) {
    const t = pickTarget('recLower', ctx.lower); const opts = shuffle([t, ...letterDistractors(t, ctx.lower, nOpts() - 1)]);
    return { target: t, letters: [t], q: 'Which letter is this?', say: 'Which letter is this?', prompt: cur(t, { cls: 'big', lines: true, fullLines: true }), options: opts.map(o => ({ key: o, html: pr(o) })), answer: t, explain: `This is cursive “${t}”. ${TIPS[t]}`, demo: t };
  },
  recUpper(ctx) {
    const t = pickTarget('recUpper', ctx.upper); const opts = shuffle([t, ...letterDistractors(t, ctx.upper, nOpts() - 1)]);
    return { target: t, letters: [t], q: 'Which capital letter is this?', say: 'Which capital letter is this?', prompt: cur(t, { cls: 'big', lines: true, fullLines: true }), options: opts.map(o => ({ key: o, html: pr(o) })), answer: t, explain: `This is cursive capital “${t}”. ${TIPS[t]}`, demo: t };
  },
  printToCursive(ctx) {
    const pool = ctx.mixCase && capsReady() && Math.random() < 0.4 ? ctx.upper : ctx.lower;
    const t = pickTarget('printToCursive', pool); const opts = shuffle([t, ...letterDistractors(t, pool, nOpts() - 1)]);
    return { target: t, letters: [t], q: `Find the cursive “${t}”`, say: `Find the cursive ${isUpper(t) ? 'capital ' : ''}${t}.`, prompt: `<div class="printbig">${t}</div>`, options: opts.map(o => ({ key: o, html: cur(o) })), answer: t, explain: `That is how “${t}” looks in cursive. ${TIPS[t]}`, demo: t };
  },
  pairCase(ctx) {
    const T = pickTarget('pairCase', ctx.upper), t = T.toLowerCase();
    const opts = shuffle([t, ...letterDistractors(t, LOWER, nOpts() - 1)]);
    return { target: T, letters: [T, t], q: 'Which lowercase letter is its partner?', say: 'Which lowercase letter is the partner of this capital?', prompt: cur(T, { cls: 'big', lines: true, fullLines: true }), options: opts.map(o => ({ key: o, html: cur(o) })), answer: t, explain: `Capital “${T}” and lowercase “${t}” are partners.`, demo: T + t };
  },
  wrongOne(ctx) {
    const pool = ctx.mixCase && capsReady() && Math.random() < 0.4 ? ctx.upper : ctx.lower;
    const t = pickTarget('wrongOne', pool);
    let opts = [{ key: 'ok', html: cur(t) }, { key: 'mirror', html: cur(t, { mirror: true }) }];
    opts.push({ key: 'flip', html: cur(t, { flip: true }) });
    if (S.level.read >= 3) { const o = letterDistractors(t, pool, 1)[0]; if (o) opts.push({ key: 'other', html: cur(o) }); }
    return { target: t, letters: [t], q: `Which cursive “${t}” is written the RIGHT way?`, say: `Which cursive ${t} is written the right way?`, prompt: `<div class="printbig">${t}</div>`, options: shuffle(opts), answer: 'ok', explain: `The others are backwards or upside down. Cursive letters lean forward and start on the line.`, demo: t };
  },
  sound(ctx) {
    const t = pickTarget('sound', ctx.lower); const [word, e] = SOUND_WORDS[t];
    const opts = shuffle([t, ...letterDistractors(t, ctx.lower, nOpts() - 1)]);
    return { target: t, letters: [t], q: `What letter does “${word}” start with?`, say: `${word}. What letter does ${word} start with?`, prompt: `<div class="emoji">${e}</div><div class="q">_${escapeHTML(word.slice(1))}</div>`, options: opts.map(o => ({ key: o, html: cur(o) })), answer: t, explain: `“${word}” starts with the “${t}” sound.`, demo: t };
  },
  readWord(ctx) {
    const t = pickTarget('readWord', wordCands(3 + wordTier() * 2), w => 1 + (S.words[w] && S.words[w].wrong ? 3 : 0));
    const opts = shuffle([t, ...wordDistractors(t, nOpts('word') - 1, false)]);
    return { target: t, letters: [], word: t, q: 'What does this word say?', say: 'What does this cursive word say?', prompt: cur(t, { cls: 'big' }), options: opts.map(o => ({ key: o, html: pr(o) })), answer: t, explain: `It says “${t}”. ${wordEmoji(t)}`, demo: t, small: true };
  },
  wordToCursive(ctx) {
    const t = ctx.word || pickTarget('wordToCursive', wordCands(3 + wordTier() * 2), w => 1 + (S.words[w] && S.words[w].wrong ? 3 : 0));
    const opts = shuffle([t, ...wordDistractors(t, nOpts('word') - 1, true)]);
    return { target: t, letters: [], word: t, q: `Which one says “${t}” in cursive?`, say: `Which one says ${t} in cursive?`, prompt: `<div class="emoji">${wordEmoji(t)}</div><div class="printbig" style="font-size:clamp(40px,7vw,64px)">${t}</div>`, options: opts.map(o => ({ key: o, html: cur(o) })), answer: t, explain: `Read each letter carefully — “${t}” is ${t.split('').join('-')}.`, demo: t, wide: true };
  },
  connected(ctx) {
    const t = pickTarget('connected', ALL_JOINS, () => 1);
    const ds = [];
    if (S.level.read >= 2) { const i = rnd(t.length), c = CONFUSE[t[i]]; if (c) ds.push(t.slice(0, i) + pick(c.split('')) + t.slice(i + 1)); }
    for (const w of shuffle(ALL_JOINS)) { if (ds.length >= nOpts('word') - 1) break; if (w !== t && !ds.includes(w) && w.length === t.length) ds.push(w); }
    const opts = shuffle([t, ...ds]);
    return { target: t, letters: t.split(''), q: 'Which letters are holding hands here?', say: 'Which letters are joined together here?', prompt: cur(t, { cls: 'big', lines: true, fullLines: true }), options: opts.map(o => ({ key: o, html: pr(o) })), answer: t, explain: `These are “${t.split('').join('” + “')}”, joined together.`, demo: t, joins: true };
  },
  writeMemory(ctx) {
    const pool = ctx.mixCase && capsReady() && Math.random() < 0.3 ? ctx.upper : ctx.lower;
    const t = pickTarget('writeMemory', pool);
    return { target: t, letters: [t], write: true, q: `Write cursive “${t}” from memory`, say: `Can you write a cursive ${isUpper(t) ? 'capital ' : ''}${t} from memory?`, answer: t, explain: TIPS[t], demo: t };
  },
};
const TYPE_LABEL = { recLower: 'Read lowercase', recUpper: 'Read capitals', printToCursive: 'Match print & cursive', pairCase: 'Capital partners', wrongOne: 'Spot the right way', sound: 'Letter sounds', readWord: 'Read words', wordToCursive: 'Find the cursive word', connected: 'Joined letters', writeMemory: 'Write from memory' };

// ---------- shared UI pieces ----------
function topbar(title, { onBack, backLabel = '⬅' } = {}) {
  const bar = h('div', { class: 'topbar' },
    h('button', { class: 'icon-btn', 'aria-label': 'Back', onclick: () => { Snd.play('tap'); (onBack || goMap)(); } }, backLabel),
    h('div', { class: 'title' }, title),
    h('div', { class: 'star-pill', id: 'starPill' }, '⭐ ' + S.stars),
    soundBtn(), voiceBtn());
  return bar;
}
function soundBtn() { const b = h('button', { class: 'icon-btn' + (S.settings.sound ? '' : ' off'), 'aria-label': 'Sound and music', onclick: () => { S.settings.sound = !S.settings.sound; save(); b.textContent = S.settings.sound ? '🔊' : '🔇'; b.classList.toggle('off', !S.settings.sound); Snd.fadeMusic(); } }, S.settings.sound ? '🔊' : '🔇'); return b; }
function voiceBtn() { const b = h('button', { class: 'icon-btn' + (S.settings.voice ? '' : ' off'), 'aria-label': 'Narrator voice', onclick: () => { S.settings.voice = !S.settings.voice; save(); b.classList.toggle('off', !S.settings.voice); if (!S.settings.voice) Voice.stop(); else Voice.say('Hi Nora! I will read along with you.'); } }, '🗣️'); return b; }
function screen(cls = '', wide = true) {
  Voice.stop(); if (CUR && CUR.cleanup) CUR.cleanup(); CUR = null;
  const app = $('#app'); app.innerHTML = '';
  const s = h('div', { class: 'screen on ' + cls }); app.append(h('div', { id: 'rotate-hint' }, '↻ Turn your phone sideways for more room to write'), s);
  document.body.classList.toggle('needs-wide', !!wide);
  window.scrollTo(0, 0);
  return s;
}
function leaveConfirm(fn) { return () => fn(); }

// Small pad that plays a demo (used to explain a missed answer)
function demoBox(text, joins) {
  const host = h('div', { style: 'width:min(300px,80vw);height:170px;flex:none' });
  setTimeout(() => { const p = new Pad(host, { text, mode: 'trace', joins }); p.tools.remove(); p.wrap.style.height = '100%'; p.cv.style.minHeight = '0'; p.demo(2.8); host._pad = p; }, 50);
  return host;
}

