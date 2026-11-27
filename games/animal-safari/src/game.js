/* ---------- Animal Safari Detective: main game ---------- */
const FASTMODE = /[?&]fast=1/.test(location.search);
const wait = ms => new Promise(r => setTimeout(r, FASTMODE ? Math.min(ms, 30) : ms));
const $ = s => document.querySelector(s);
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const IMG = n => 'art/' + n + '.webp';
function el(tag, cls, parent, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
function onTap(e, fn) { e.addEventListener('pointerdown', ev => { if (ev.button > 0) return; ev.stopPropagation(); ev.preventDefault(); AU.unlock(); G.poke(); fn(ev); }); }
function anim(e, kf, o) { try { return e.animate(kf, Object.assign({duration: 500, easing: 'ease-out', fill: 'forwards'}, o)).finished.catch(() => {}); } catch (x) { return Promise.resolve(); } }

/* ---------- saved data (this device) ---------- */
const DB = (window.KAKit && KAKit.store('animalSafari.v1', {lang: 'en', muted: false, music: true, enVoice: 'rec', stickers: {}, cases: {trail: 0, river: 0, canopy: 0}, last: {}, walkHelp: 0})) ||
  {lang: 'en', muted: false, music: true, enVoice: 'rec', stickers: {}, cases: {trail: 0, river: 0, canopy: 0}, last: {}, walkHelp: 0, save() {}};

/* ---------- text ---------- */
function esc(s) { return String(s).replace(/[&<>]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'}[c])); }
function zhHTML(line) { return line.zy ? line.zy.map(([c, z]) => z ? '<ruby>' + esc(c) + '<rt>' + z + '</rt></ruby>' : esc(c)).join('') : esc(line.zh); }
function T(key, lang) { const l = LINES[key]; if (!l) return ''; return (lang || DB.lang) === 'zh' ? zhHTML(l) : esc(l.en); }

/* ---------- global game object ---------- */
const G = {
  screen: 'title', lastPrompt: null, lastPoke: Date.now(), busy: false, panelOpen: false,
  poke() { this.lastPoke = Date.now(); },
  onSpeak(on, who) {
    AU.duck(on);
    const pc = $('.pCoco'); if (pc) pc.classList.toggle('talk', !!on && (!who || who === 'coco'));
    if (S.coco && S.coco.el) S.coco.el.classList.toggle('talking', !!on);
  },
  showBubble(key) {
    const b = $('#bubble'); if (!b || this.screen !== 'scene') return;
    clearTimeout(this._bt); b.querySelector('.txt').innerHTML = T(key);
    const v = LINES[key] && LINES[key].v; b.querySelector('img').src = IMG(v && v !== 'coco' ? ANIMALS[v].img : 'coco_happy');
    b.classList.add('show');
  },
  hideBubbleSoon() { clearTimeout(this._bt); this._bt = setTimeout(() => $('#bubble').classList.remove('show'), 1400); },
};

/* ---------- layout ---------- */
const V = {w: 0, h: 0, portrait: false, stageTop: 0, stageH: 0};
function measure() {
  V.w = window.innerWidth; V.h = window.innerHeight; V.portrait = V.h > V.w * 1.05;
  document.body.classList.toggle('portrait', V.portrait);
  if (V.portrait) {
    const top = Math.max(96, V.h * .12), bottom = Math.max(140, V.h * .17);
    V.stageH = Math.round(Math.min(V.h - top - bottom, V.w * 1.12)); V.stageTop = Math.round(top + (V.h - top - bottom - V.stageH) / 2);
  } else { V.stageH = V.h; V.stageTop = 0; }
  const st = $('#stage'); st.style.top = V.stageTop + 'px'; st.style.height = V.stageH + 'px';
  const bub = $('#bubble'); bub.style.top = V.portrait ? (V.stageTop + 10) + 'px' : '';
  if (G.screen === 'scene' && S.ready) layoutScene();
}
window.addEventListener('resize', () => { clearTimeout(measure.t); measure.t = setTimeout(measure, 120); });
window.addEventListener('orientationchange', () => setTimeout(measure, 300));

/* ---------- screens ---------- */
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  G.screen = id; AU.stop();
  AU.music(id !== 'scene');
  if (id === 'title') renderTitle();
  if (id === 'map') renderMap();
  if (id === 'journal') renderJournal();
  if (id !== 'scene') { S.area = null; closePanel(); }
}
function setLang(l) {
  DB.lang = l; DB.save(); document.body.classList.toggle('zh', l === 'zh');
  document.documentElement.lang = l === 'zh' ? 'zh-Hant-TW' : 'en';
  renderTitle(); if (G.screen === 'map') renderMap(); if (G.screen === 'journal') renderJournal();
}
function renderTitle() {
  $('#titlePlaque').innerHTML = '<div class="en">Animal Safari Detective</div><div class="zh">' + zhHTML(LINES.title) + '</div>';
  document.querySelectorAll('#langPill button').forEach(b => b.classList.toggle('sel', b.dataset.l === DB.lang));
  $('#stickerCount').textContent = Object.values(DB.stickers).reduce((a, b) => a + b, 0);
}
function renderMap() {
  $('#mapTitle').innerHTML = T('ui_pick');
  const c = $('#cards'); c.innerHTML = '';
  AREA_IDS.forEach((id, i) => {
    const a = AREAS[id], card = el('button', 'card', c);
    const pic = el('div', 'pic', card); pic.style.backgroundImage = 'url(' + IMG(a.bg) + ')';
    if (id === 'trail') pic.style.backgroundPosition = '42% 70%';
    if (id === 'canopy') pic.style.backgroundPosition = '50% 62%';
    el('div', 'num', pic, String(i + 1));
    const n = DB.cases[id] || 0;
    if (n) el('div', 'solved', pic, '<img src="' + IMG('lens') + '" alt="">×' + n);
    el('div', 'nm', card, T('area_' + id) + (DB.lang === 'zh' ? '<small>' + esc(LINES['area_' + id].en) + '</small>' : ''));
    card.setAttribute('aria-label', LINES['area_' + id].en);
    onTap(card, () => { AU.sfx('tap'); startArea(id); });
  });
}

/* ---------- scene state ---------- */
const S = {area: null, A: null, objs: [], leo: null, coco: null, cam: 0, worldW: 0, s: 1, offY: 0, keys: 0, clues: [], kase: null};
function imgX(fx) { return fx * S.A.iw * S.s; }
function imgY(fy) { return fy * S.A.ih * S.s - S.offY; }
function pathY(px) { // feet y (stage px) at world x px
  const p = S.A.path, fx = px / (S.A.iw * S.s);
  if (fx <= p[0][0]) return imgY(p[0][1]);
  for (let i = 1; i < p.length; i++) if (fx <= p[i][0]) { const t = (fx - p[i - 1][0]) / (p[i][0] - p[i - 1][0]); return imgY(p[i - 1][1] + t * (p[i][1] - p[i - 1][1])); }
  return imgY(p[p.length - 1][1]);
}
function minX() { return imgX(S.A.path[0][0]); }
function maxX() { return imgX(S.A.path[S.A.path.length - 1][0]); }

function layoutScene() {
  const A = S.A, H = V.stageH, W = V.w;
  S.s = Math.max(H / A.ih, (W * 1.3) / A.iw);
  const ih = A.ih * S.s; S.worldW = A.iw * S.s;
  S.offY = ih > H * 1.02 ? Math.max(0, Math.min(ih - H, A.path[0][1] * ih - A.feet * H)) : 0;
  const bg = $('#bg'); bg.style.width = S.worldW + 'px'; bg.style.height = ih + 'px'; bg.style.top = -S.offY + 'px';
  const w = $('#world'); w.style.width = S.worldW + 'px'; w.style.height = H + 'px';
  const fg = $('#fg'); fg.style.height = Math.round(H * (S.area === 'canopy' ? .12 : .15)) + 'px'; fg.style.width = (S.worldW * 1.15 + W * .3) + 'px';
  S.objs.forEach(placeObj);
  S.decos.forEach(d => d.place());
  sizeChars();
  S.leo.x = Math.min(Math.max(S.leo.x, minX()), maxX()); S.coco.x = Math.min(Math.max(S.coco.x, minX()), maxX());
  S.cam = camTarget(); render();
}
function sizeChars() {
  const H = V.stageH, lh = S.A.leoH * H;
  S.leo.h = lh; S.leo.el.style.height = lh + 'px'; S.leo.el.style.width = lh * .62 + 'px';
  S.coco.h = lh * .52; S.coco.el.style.height = S.coco.h + 'px'; S.coco.el.style.width = S.coco.h * .95 + 'px';
  S.objs.forEach(o => { if (o.witnessEl) placeWitness(o); });
  if (S.culpritEl) placeCulprit();
}

/* ---------- case setup (varies every replay) ---------- */
function newCase(areaId) {
  const A = AREAS[areaId];
  const pool = A.pool.filter(a => a !== DB.last[areaId]);
  const fresh = pool.filter(a => !DB.stickers[a]);
  const culprit = pick(fresh.length && Math.random() < .75 ? fresh : pool); // usually a sticker Milo does not have yet
  const witness = pick(Object.keys(ANIMALS).filter(a => a !== culprit));
  const decoys = shuffle(SUSPECTS.filter(a => a !== culprit && a !== witness)).slice(0, 2);
  // place objects
  const objs = [];
  A.groups.forEach(g => {
    let kinds = g.kinds.map(k => Array.isArray(k) ? pick(k) : k);
    kinds = shuffle(kinds); if (g.keep) kinds = [g.keep].concat(kinds.filter(k => k !== g.keep));
    kinds = shuffle(kinds.slice(0, g.take || g.pick || kinds.length));
    const spots = shuffle(g.spots);
    kinds.forEach((k, i) => objs.push({kind: k, fx: spots[i][0], fy: spots[i][1], scale: g.scale || 1, bob: g.bob}));
  });
  (A.hot || []).forEach(([k, fx, fy, r]) => objs.push({kind: k, fx, fy, r, hot: 1}));
  // choose clue objects: one sound, one count, one add
  const sound = objs.find(o => (KINDS[o.kind].acts || []).includes('sound'));
  sound.act = 'sound';
  const cands = shuffle(objs.filter(o => o !== sound && KINDS[o.kind].acts));
  const addO = cands.find(o => KINDS[o.kind].acts.includes('add'));
  if (addO) addO.act = 'add';
  const countO = cands.find(o => !o.act && KINDS[o.kind].acts.includes('count'));
  if (countO) countO.act = 'count';
  objs.forEach(o => {
    if (o.act === 'count') { o.item = pick(KINDS[o.kind].items); o.n = rnd(3, 8); }
    if (o.act === 'add') { o.item = pick(KINDS[o.kind].items); o.a = rnd(1, 5); o.b = rnd(1, Math.min(5, 10 - o.a)); if (o.a + o.b < 3) o.b = 3 - o.a; }
  });
  return {area: areaId, culprit, witness, decoys, objs, found: 0};
}

/* ---------- build scene ---------- */
function startArea(areaId) {
  show('scene');
  closePanel(); S.ready = false; S.sid = (S.sid || 0) + 1; S.keys = 0;
  S.area = areaId; S.A = AREAS[areaId]; S.kase = newCase(areaId); S.clues = []; G.busy = false; S.culpritEl = null; G.lastPrompt = null;
  window.__lastCase = S.kase;
  const w = $('#world'); w.querySelectorAll('.obj,.chr,.fall,.decal,.flyer').forEach(e => e.remove());
  $('#fx').innerHTML = '';
  $('#bg').src = IMG(S.A.bg);
  S.objs = []; S.decos = [];
  measure();
  // characters
  S.leo = {x: 0, dir: 1, target: null, walking: false, t: 0, el: el('div', 'chr leo', w)};
  S.leo.el.innerHTML = '<div class="shadow"></div><img class="f0" src="' + IMG('leo') + '"><img class="f1" src="' + IMG('leo_walk1') + '"><img class="f2" src="' + IMG('leo_walk2') + '"><img class="f3" src="' + IMG('leo_walk3') + '">';
  S.coco = {x: 0, dir: 1, el: el('div', 'chr coco', w), hop: 0};
  S.coco.el.innerHTML = '<div class="shadow"></div><img class="f0" src="' + IMG('coco') + '"><img class="f1" src="' + IMG('coco_side') + '">';
  onTap(S.leo.el, () => { if (!G.busy) { hop(S.leo.el); AU.say('sur_leo'); } });
  onTap(S.coco.el, () => { if (!G.busy) { hop(S.coco.el); AU.sfx('boing'); AU.say('sur_coco'); } });
  S.leo.el.style.zIndex = 22; S.coco.el.style.zIndex = 21;
  // objects
  S.kase.objs.forEach(makeObj);
  makeDecos();
  S.ready = true;
  layoutScene();
  S.leo.x = minX() - S.leo.h * .4; S.coco.x = S.leo.x - S.leo.h * .5;
  S.cam = 0; layoutScene();
  renderTray(); makeMotes();
  // preload this case's clips
  const k = S.kase, pre = ['intro_' + areaId, 'walk_help', 'hint_sparkle', 'hint_walk', 'clue_look', 'clue_1', 'clue_2', 'clue_3', 'patch_' + k.culprit, 'part_' + k.culprit, 'shadow',
    'final_intro', 'final_ask', 'final_again', 'solved_' + areaId + '_' + k.culprit, 'solved_yay', 'sticker_' + k.culprit, 'fact_' + k.culprit, 'play_again', 'count_right', 'count_again',
    'hi_' + k.witness, 'sound_teach', 'sound_ask_' + k.witness, 'sound_right_' + k.witness, 'sound_again_' + k.witness, 'witness_clue', 'add_intro', 'add_push', 'add_countall', 'add_right'];
  for (let n = 1; n <= 10; n++) pre.push('num_' + n);
  k.objs.forEach(o => { pre.push('act_' + actKey(o), 'sur_' + KINDS[o.kind].sur); if (o.item) pre.push('count_intro_' + o.item, 'count_ask_' + o.item); });
  if (DB.lang === 'en') AU.preload(pre.filter(x => LINES[x]));
  // walk in, then the mystery
  (async () => {
    G.busy = true; await wait(300);
    walkTo(minX() + S.leo.h * .55);
    await wait(900);
    G.busy = false;
    await AU.say('intro_' + areaId, {prompt: true});
    if (!DB.walkHelp && G.screen === 'scene') { DB.walkHelp = 1; DB.save(); $('#arR').classList.add('nudge'); await AU.say('walk_help'); $('#arR').classList.remove('nudge'); }
    G.poke();
  })();
}
function makeDecos() {
  const d = S.A.deco || {}, fx = $('#fx');
  if (d.mist) { const m = el('div', 'mist', fx); S.decos.push({place() { m.style.left = imgX(d.mist[0]) + 'px'; m.style.top = imgY(d.mist[1]) + 'px'; m.style.width = imgX(d.mist[2]) + 'px'; m.style.height = d.mist[3] * S.A.ih * S.s + 'px'; }}); }
  if (d.ray) { const r = el('div', 'ray', fx); S.decos.push({place() { r.style.left = imgX(d.ray[0]) + 'px'; r.style.top = imgY(d.ray[1]) + 'px'; r.style.width = imgX(d.ray[2]) + 'px'; r.style.height = d.ray[3] * S.A.ih * S.s + 'px'; }}); }
  // a parrot or butterfly-like flyer now and then: use the parrot cut-out, small, far away
  if (S.kase.culprit !== 'parrot' && S.kase.witness !== 'parrot') {
    const f = el('img', 'flyer', fx); f.src = IMG('parrot'); f.style.opacity = 0;
    S.decos.push({place() { f.style.height = V.stageH * .06 + 'px'; }});
    S.flyer = f;
  } else S.flyer = null;
}
function makeMotes() {
  const m = $('#motes'); m.innerHTML = '';
  for (let i = 0; i < 14; i++) { const d = el('div', 'mote', m); d.style.left = Math.random() * 100 + '%'; d.style.top = 20 + Math.random() * 70 + '%'; d.style.animationDelay = (-Math.random() * 9) + 's'; d.style.animationDuration = 7 + Math.random() * 6 + 's'; }
}

/* ---------- objects ---------- */
function makeObj(o) {
  const K = KINDS[o.kind], w = $('#world');
  o.el = el('div', 'obj hot' + (K.hang ? ' hang' : '') + (o.hot ? ' hotspot' : '') + (/^(fern|palm|flowers|egg|log)$/.test(o.kind) ? ' grassy' : ''), w);
  if (!o.hot) {
    o.img = el('img', '', o.el); o.img.src = IMG(K.img);
    if (K.hang) el('div', 'vine', o.el); else el('div', 'shadow', o.el);
    o.el.insertBefore(o.el.lastChild, o.el.firstChild);
  }
  o.el.style.zIndex = K.hang ? 8 : 10;
  onTap(o.el, () => tapObj(o));
  S.objs.push(o);
  if (o.act === 'sound' && o.kind === 'fern') { // footprints leading to the fern
    o.prints = [];
    for (let i = 0; i < 5; i++) { const p = el('div', 'obj decal hot', w); p.innerHTML = '<img src="' + IMG('print') + '">'; p.style.zIndex = 9; onTap(p, () => tapObj(o)); o.prints.push(p); }
  }
  o.tw = el('div', 'twinkle', o.el); o.tw.style.animationDelay = (-Math.random() * 1.2) + 's'; o.tw.style.display = 'none';
}
function placeObj(o) {
  const K = KINDS[o.kind], H = V.stageH;
  if (o.hot) {
    const r = o.r * S.A.iw * S.s; o.w = o.h = r * 2;
    o.x = imgX(o.fx); o.y = imgY(o.fy) + r;
    Object.assign(o.el.style, {left: o.x - r + 'px', top: imgY(o.fy) - r + 'px', width: r * 2 + 'px', height: r * 2 + 'px'});
    return;
  }
  const nat = o.img.naturalWidth ? o.img.naturalWidth / o.img.naturalHeight : 1.2;
  o.h = K.h * H * (o.scale || 1) * (S.area === 'river' ? .85 : 1); o.w = o.h * nat;
  o.x = imgX(o.fx);
  if (K.hang) { o.y = imgY(o.fy); Object.assign(o.el.style, {left: o.x - o.w / 2 + 'px', top: o.y + 'px', width: o.w + 'px', height: o.h + 'px'}); }
  else { o.y = imgY(o.fy); Object.assign(o.el.style, {left: o.x - o.w / 2 + 'px', top: o.y - o.h + 'px', width: o.w + 'px', height: o.h + 'px'}); }
  if (!o.img.naturalWidth) o.img.onload = () => placeObj(o);
  if (o.bob && !o.bobA) { try { o.bobA = o.img.animate([{transform: 'translateY(0) rotate(-2deg)'}, {transform: 'translateY(-6%) rotate(2deg)'}, {transform: 'translateY(0) rotate(-2deg)'}], {duration: 2600, iterations: Infinity}); } catch (e) {} }
  if (o.prints) {
    const step = H * .085, dir = o.x - step * 6 > minX() ? -1 : 1;
    o.prints.forEach((p, i) => {
      const px = o.x + dir * (o.w * .45 + step * (i + .6)), py = pathY(px) + (i % 2 ? H * .012 : -H * .006), s = H * .045;
      Object.assign(p.style, {left: px - s / 2 + 'px', top: py - s + 'px', width: s + 'px', height: s + 'px', transform: 'rotate(' + (dir > 0 ? -90 : 90) + 'deg)'});
    });
  }
  if (o.witnessEl) placeWitness(o);
}
function hop(e) { anim(e, [{transform: 'translateY(0)'}, {transform: 'translateY(-14%)'}, {transform: 'translateY(0)'}], {duration: 420, fill: 'none'}); }
function wobble(e, n) { return anim(e, [{transform: 'rotate(0)'}, {transform: 'rotate(-7deg)'}, {transform: 'rotate(6deg)'}, {transform: 'rotate(-4deg)'}, {transform: 'rotate(0)'}], {duration: 600 * (n || 1), fill: 'none'}); }
function squash(e) { return anim(e, [{transform: 'scale(1,1)'}, {transform: 'scale(1.25,.7)'}, {transform: 'scale(.85,1.25)'}, {transform: 'scale(1,1)'}], {duration: 600, fill: 'none'}); }
function leaves(x, y, n) {
  const w = $('#world');
  for (let i = 0; i < (n || 8); i++) { const l = el('div', 'leafbit', w); l.style.left = x + 'px'; l.style.top = y + 'px'; l.style.zIndex = 30;
    anim(l, [{transform: 'translate(0,0) rotate(0)', opacity: 1}, {transform: 'translate(' + rnd(-90, 90) + 'px,' + rnd(-110, -30) + 'px) rotate(' + rnd(-200, 200) + 'deg)', opacity: 1, offset: .4}, {transform: 'translate(' + rnd(-120, 120) + 'px,' + rnd(10, 60) + 'px) rotate(' + rnd(-400, 400) + 'deg)', opacity: 0}], {duration: 1300, easing: 'ease-out'}).then(() => l.remove()); }
}
function ripples(x, y) { const w = $('#world'); for (let i = 0; i < 3; i++) setTimeout(() => { const r = el('div', 'ripple', w); const s = V.stageH * .16; Object.assign(r.style, {left: x - s / 2 + 'px', top: y - s / 4 + 'px', width: s + 'px', height: s / 2 + 'px', zIndex: 30}); setTimeout(() => r.remove(), 1100); }, i * 220); }
function popItem(o, imgName, stay) { // a treasure pops out of an object
  const w = $('#world'), f = el('img', 'fall', w), s = V.stageH * .1; f.src = IMG(imgName);
  const top = (KINDS[o.kind].hang ? o.y + o.h / 2 : o.y - o.h * .6);
  Object.assign(f.style, {left: o.x - s / 2 + 'px', top: top - s / 2 + 'px', height: s + 'px'});
  AU.sfx('sparkle');
  return anim(f, [{transform: 'translateY(0) scale(.2)', opacity: 0}, {transform: 'translateY(-' + s * 1.3 + 'px) scale(1.25)', opacity: 1, offset: .5}, {transform: 'translateY(-' + s * 1.1 + 'px) scale(1)', opacity: 1}], {duration: 700}).then(async () => {
    if (!stay) { await wait(1800); anim(f, [{opacity: 1}, {opacity: 0}], {duration: 400}).then(() => f.remove()); } return f;
  });
}
function dropItems(o, item, n) { // fruit falls from a branch to the ground
  const w = $('#world'), s = V.stageH * .07, arr = [];
  for (let i = 0; i < n; i++) {
    const f = el('img', 'fall', w); f.src = IMG(ITEM_IMG[item]); arr.push(f);
    const x0 = o.x + rnd(-o.w / 3, o.w / 3), y0 = o.y + o.h * .5, x1 = o.x + (i - n / 2) * s * .9 + rnd(-5, 5), y1 = pathY(x1) - s * .2;
    Object.assign(f.style, {left: x0 - s / 2 + 'px', top: y0 + 'px', height: s + 'px'});
    setTimeout(() => AU.sfx('pop'), 300 + i * 90);
    anim(f, [{transform: 'translate(0,0)'}, {transform: 'translate(' + (x1 - x0) + 'px,' + (y1 - y0 - s) + 'px)', offset: .75, easing: 'ease-in'}, {transform: 'translate(' + (x1 - x0) + 'px,' + (y1 - y0 - s * 1.3) + 'px)', offset: .87}, {transform: 'translate(' + (x1 - x0) + 'px,' + (y1 - y0 - s) + 'px)'}], {duration: 700, delay: i * 90});
  }
  S.ground = arr; return wait(700 + n * 90);
}
function clearGround() { (S.ground || []).forEach(f => anim(f, [{opacity: 1}, {opacity: 0}], {duration: 300}).then(() => f.remove())); S.ground = null; }

async function tapObj(o) {
  if (G.busy || G.panelOpen) return;
  G.poke(); AU.sfx('tap');
  if (o.hot) { await surprise(o); return; }
  if (o.done && o.act) { wobble(o.el); AU.say('looked_here'); return; }
  G.busy = true; o.tried = true; o.tw.style.display = 'none';
  try {
    // walk next to it (along the footprints if there are any)
    const side = o.x >= S.leo.x ? -1 : 1;
    const stand = Math.min(maxX(), Math.max(minX(), o.x + side * (o.w * .5 + S.leo.h * .22)));
    if (Math.abs(stand - S.leo.x) > 6) await walkToP(stand);
    S.leo.dir = o.x >= S.leo.x ? 1 : -1; S.leo.forceSide = 600;
    inspect();
    if (o.act) { await clueAction(o); }
    else await surprise(o);
  } finally { G.busy = false; G.poke(); }
}
function inspect() { // Leo pulls out his magnifying glass
  const w = $('#world'), l = el('img', 'fall', w), s = S.leo.h * .32; l.src = IMG('lens');
  Object.assign(l.style, {left: S.leo.x + S.leo.dir * S.leo.h * .2 - s / 2 + 'px', top: pathY(S.leo.x) - S.leo.h * .62 + 'px', height: s + 'px', zIndex: 25});
  anim(l, [{transform: 'scale(0) rotate(-40deg)', opacity: 0}, {transform: 'scale(1.15) rotate(10deg)', opacity: 1, offset: .4}, {transform: 'scale(1) rotate(0)', opacity: 1, offset: .7}, {transform: 'scale(1)', opacity: 0}], {duration: 1300}).then(() => l.remove());
}
async function surprise(o) {
  const K = KINDS[o.kind], line = 'sur_' + K.sur;
  switch (o.kind) {
    case 'log': AU.sfx('thud'); await anim(o.el, [{transform: 'translateX(0)'}, {transform: 'translateX(' + o.w * .7 + 'px)'}], {duration: 600}); await popItem(o, 'star'); anim(o.el, [{transform: 'translateX(' + o.w * .7 + 'px)'}, {transform: 'translateX(0)'}], {duration: 600, delay: 1600}); break;
    case 'fern': AU.sfx('rustle'); leaves(o.x, o.y - o.h * .6, 10); await wobble(o.el, 1.4); break;
    case 'crate': AU.sfx('shake'); await wobble(o.el); await popItem(o, 'map'); break;
    case 'chest': AU.sfx('shake'); await wobble(o.el); await popItem(o, 'gem'); break;
    case 'mushroom': AU.sfx('boing'); squash(o.el); hop(S.coco.el); break;
    case 'flowers': AU.sfx('sparkle'); wobble(o.el); twinkles(o); break;
    case 'egg': case 'nest': AU.sfx('soft'); wobble(o.el, 1.5); break;
    case 'palm': AU.sfx('rustle'); wobble(o.el, 1.5); leaves(o.x, o.y - o.h * .8, 6); break;
    case 'barrel': AU.sfx('splash'); ripples(o.x, o.y); hop(o.el); break;
    case 'bananas': case 'cherries': AU.sfx('shake'); leaves(o.x, o.y, 6); await wobble(o.el, 1.2); await popItem(o, 'star'); break;
    case 'lantern': AU.sfx('sparkle'); o.el.animate([{filter: 'brightness(1)'}, {filter: 'brightness(1.6) drop-shadow(0 0 20px #ffd43b)'}, {filter: 'brightness(1)'}], {duration: 1600}); wobble(o.el); break;
    case 'binoculars': await binoSurprise(o); break;
    case 'water': AU.sfx('splash'); ripples(o.x, o.y - o.h / 2); break;
    case 'waterfall': AU.sfx('whoosh'); twinkles(o); break;
    case 'orchid': AU.sfx('sparkle'); twinkles(o); break;
  }
  await AU.say(line);
}
function twinkles(o) { const w = $('#world'); for (let i = 0; i < 6; i++) { const t = el('div', 'twinkle', w); Object.assign(t.style, {left: o.x + rnd(-o.w / 2, o.w / 2) - 13 + 'px', top: (o.hot ? o.y - o.h : o.y - o.h) + rnd(0, o.h) + 'px', zIndex: 35, animationDelay: i * 120 + 'ms'}); setTimeout(() => t.remove(), 2400); } }

/* ---------- clue objects: do the thing, then the lesson ---------- */
const actKey = o => o.kind === 'cherries' ? 'bananas' : o.kind;
async function clueAction(o) {
  const k = S.kase, sid = S.sid;
  AU.say('act_' + actKey(o));
  switch (o.kind) {
    case 'log': AU.sfx('thud'); await anim(o.el, [{transform: 'translateX(0)'}, {transform: 'translateX(' + o.w * .8 + 'px)'}], {duration: 700}); break;
    case 'bananas': case 'cherries': AU.sfx('shake'); leaves(o.x, o.y, 8); wobble(o.el, 1.2); await dropItems(o, o.item, o.act === 'add' ? o.a + o.b : o.n); break;
    case 'crate': case 'chest': case 'nest': case 'barrel': AU.sfx(o.kind === 'barrel' ? 'splash' : 'shake'); if (o.kind === 'barrel') ripples(o.x, o.y); await wobble(o.el); AU.sfx('sparkle'); break;
    case 'fern': await followPrints(o); AU.sfx('rustle'); leaves(o.x, o.y - o.h * .6, 10); await wobble(o.el, 1.2); showWitness(o); AU.sfx('boing'); break;
    case 'binoculars': break;
  }
  await wait(900);
  o.done = true; o.el.classList.add('done');
  let ok = false;
  openPanel();
  if (o.act === 'count') ok = await actCount(o);
  else if (o.act === 'add') ok = await actAdd(o);
  else if (o.act === 'sound') ok = await actSound(o);
  if (sid !== S.sid) return;
  if (!ok) { closePanel(); return; }
  await revealClue();
  if (sid !== S.sid) return;
  clearGround();
  if (S.clues.length >= 3) { await wait(300); await finalCase(); }
}
async function followPrints(o) {
  if (!o.prints) return;
  for (const p of o.prints) { anim(p, [{transform: p.style.transform + ' scale(1)'}, {transform: p.style.transform + ' scale(1.5)'}, {transform: p.style.transform + ' scale(1)'}], {duration: 400, fill: 'none'}); AU.sfx('step'); await wait(160); }
}
function showWitness(o) {
  const w = $('#world'), e = el('div', 'chr witness', w); e.innerHTML = '<div class="shadow"></div><img src="' + IMG(ANIMALS[S.kase.witness].img) + '">';
  o.witnessEl = e; e.style.zIndex = 11; placeWitness(o);
  anim(e, [{transform: 'translateY(40%) scale(.6)', opacity: 0}, {transform: 'translateY(-10%) scale(1.05)', opacity: 1, offset: .6}, {transform: 'translateY(0) scale(1)', opacity: 1}], {duration: 600});
  onTap(e, () => { if (!G.busy) { hop(e); AU.say('hi_' + S.kase.witness); } });
}
function placeWitness(o) {
  const a = ANIMALS[S.kase.witness], h = S.leo.h * (S.kase.witness === 'giraffe' ? .85 : .6), wd = h * a.w / a.h, x = o.x + o.w * .15;
  Object.assign(o.witnessEl.style, {left: x - wd / 2 + 'px', top: pathY(x) - h - V.stageH * .01 + 'px', width: wd + 'px', height: h + 'px'});
}
async function binoSurprise(o) {
  openPanel(); const b = $('#pBody'); b.innerHTML = '';
  await binoView(b, null); await AU.say('sur_waterfall'); await wait(400); closePanel();
}
async function binoView(b, animal) { // look through the binoculars at the far trees
  const v = el('div', 'binoView', b), A = S.A, pw = b.clientWidth, ph = b.clientHeight, inner = el('div', '', v);
  inner.style.cssText = 'position:absolute;inset:0;overflow:hidden';
  const far = el('div', 'far', inner), s = ph * 2.2 / A.ih, im = el('img', '', far); im.src = IMG(A.bg); im.style.width = A.iw * s + 'px'; im.style.display = 'block';
  if (animal) { const ai = el('img', '', far), a = ANIMALS[animal], h = ph * .45; ai.src = IMG(a.img); Object.assign(ai.style, {position: 'absolute', height: h + 'px', left: A.iw * s * .56 + 'px', top: A.ih * s * .40 - h + 'px', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,.3))'}); v.ai = ai; }
  const r = Math.min(pw * .24, ph * .42);
  const mk = 'radial-gradient(circle ' + r + 'px at ' + (pw / 2 - r * .82) + 'px 50%, #000 96%, transparent 100%), radial-gradient(circle ' + r + 'px at ' + (pw / 2 + r * .82) + 'px 50%, #000 96%, transparent 100%)';
  inner.style.webkitMaskImage = mk; inner.style.maskImage = mk;
  far.style.transform = 'translate(' + (-A.iw * s * .25) + 'px,' + (-A.ih * s * .25) + 'px)';
  AU.sfx('whoosh');
  await anim(far, [{transform: far.style.transform}, {transform: 'translate(' + (-A.iw * s * .56 + pw / 2 - ph * .12) + 'px,' + (-A.ih * s * .40 + ph * .62) + 'px)'}], {duration: FASTMODE ? 50 : 2200, easing: 'ease-in-out'});
  if (v.ai) { AU.sfx('boing'); await anim(v.ai, [{transform: 'translateY(0)'}, {transform: 'translateY(-12%)'}, {transform: 'translateY(0)'}], {duration: 500, iterations: 2, fill: 'none'}); }
  return v;
}

/* ---------- walking ---------- */
let walkCb = null;
function walkTo(x, cb) { S.leo.target = Math.min(maxX(), Math.max(minX(), x)); walkCb = cb || null; }
function walkToP(x) { return new Promise(r => walkTo(x, r)); }
function camTarget() { const lead = S.leo.walking ? S.leo.dir * V.w * .08 : 0; return Math.max(0, Math.min(S.worldW - V.w, S.leo.x - V.w * .45 + lead)); }
let lastT = 0;
function tick(t) {
  requestAnimationFrame(tick);
  const dt = Math.min(.05, (t - lastT) / 1000 || 0); lastT = t;
  if (G.screen !== 'scene' || !S.leo || !S.A) return;
  const L = S.leo, speed = V.stageH * .62 * (FASTMODE ? 6 : 1);
  let moving = false;
  if (S.keys && !G.busy && !G.panelOpen) { L.target = null; walkCb = null; const nx = L.x + S.keys * speed * dt; L.x = Math.min(maxX(), Math.max(minX(), nx)); L.dir = S.keys; moving = nx > minX() && nx < maxX(); }
  else if (L.target != null) {
    const d = L.target - L.x;
    if (Math.abs(d) < speed * dt + 1) { L.x = L.target; L.target = null; const cb = walkCb; walkCb = null; if (cb) cb(); }
    else { L.x += Math.sign(d) * speed * dt; L.dir = Math.sign(d); moving = true; }
  }
  if (L.forceSide > 0) L.forceSide -= dt * 1000;
  L.walking = moving; if (moving) { L.t += dt; G.poke(); if ((L.t * 4.5 | 0) !== L.stepN) { L.stepN = L.t * 4.5 | 0; AU.sfx('step'); } }
  // Coco follows a little behind
  const C = S.coco, want = L.x - L.dir * L.h * .55, cd = want - C.x;
  let cm = false;
  if (Math.abs(cd) > L.h * .12) { C.x += Math.sign(cd) * Math.min(Math.abs(cd), speed * 1.05 * dt) * (Math.abs(cd) > L.h ? 1.4 : 1); C.dir = Math.sign(cd); cm = true; }
  C.walking = cm; if (cm) C.hop += dt * 9;
  S.cam += (camTarget() - S.cam) * Math.min(1, dt * 5);
  render();
  // flyer
  if (S.flyer) { S.flyT = (S.flyT || 0) + dt; const p = (S.flyT % 26) / 26; if (p < .35) { const q = p / .35; S.flyer.style.opacity = Math.sin(q * Math.PI) * .9; S.flyer.style.left = (S.cam - V.w * .1 + q * V.w * 1.25) * 1 + 'px'; S.flyer.style.top = V.stageH * (.12 + .05 * Math.sin(q * 12)) + 'px'; } else S.flyer.style.opacity = 0; }
  // hints when Milo is stuck
  hintTick();
}
function render() {
  const L = S.leo, C = S.coco;
  $('#world').style.transform = 'translate3d(' + (-S.cam) + 'px,0,0)';
  $('#fg').style.transform = 'translate3d(' + (-S.cam * 1.15) + 'px,0,0)';
  const ly = pathY(L.x), lw = L.h * .62;
  L.el.style.transform = 'translate3d(' + (L.x - lw / 2) + 'px,' + (ly - L.h + (L.walking ? -Math.abs(Math.sin(L.t * 9)) * L.h * .025 : 0)) + 'px,0)';
  const f = L.walking ? [1, 2, 3, 2][(L.t * 9 | 0) % 4] : 0;
  if (f !== L.f) { L.el.querySelectorAll('img').forEach((im, i) => im.style.opacity = i === f ? 1 : 0); L.f = f; }
  L.el.classList.toggle('flip', L.dir < 0 && (L.walking || L.forceSide > 0));
  const cy = pathY(C.x), cw = C.h * .95;
  C.el.style.transform = 'translate3d(' + (C.x - cw / 2) + 'px,' + (cy - C.h - (C.walking ? Math.abs(Math.sin(C.hop)) * C.h * .08 : 0)) + 'px,0)';
  const cf = C.walking ? 1 : 0; if (cf !== C.f) { C.el.querySelectorAll('img').forEach((im, i) => im.style.opacity = i === cf ? 1 : 0); C.f = cf; }
  C.el.classList.toggle('flip', C.walking && C.dir < 0);
  L.el.style.zIndex = 22; C.el.style.zIndex = C.x > L.x ? 21 : 23;
  // footprints light up as Leo walks over them
}

/* ---------- hints ---------- */
let hintN = 0;
function hintTick() {
  if (G.busy || G.panelOpen || AU.isSpeaking() || S.keys || S.leo.target != null) return;
  const idle = Date.now() - G.lastPoke;
  // little twinkles on things you have not tried yet (after a few seconds of looking)
  if (idle > 5000) S.objs.forEach(o => { if (!o.hot && !o.done && !o.tried && o.tw) o.tw.style.display = 'block'; });
  if (idle < 13000) return;
  G.poke(); hintN++;
  const left = S.objs.filter(o => o.act && !o.done);
  if (!left.length) return;
  left.sort((a, b) => Math.abs(a.x - S.leo.x) - Math.abs(b.x - S.leo.x));
  const o = left[0], onScreen = o.x > S.cam + 40 && o.x < S.cam + V.w - 40;
  if (onScreen) {
    const sp = el('div', 'sparkle', o.el); setTimeout(() => sp.remove(), 4500);
    AU.say(hintN % 3 === 0 ? 'hint_look' : 'hint_sparkle');
  } else {
    const ar = o.x > S.leo.x ? $('#arR') : $('#arL'); ar.classList.add('nudge'); setTimeout(() => ar.classList.remove('nudge'), 2600);
    AU.say('hint_walk');
  }
}

/* ---------- clue tray ---------- */
function clueHTML(type, size) {
  const a = ANIMALS[S.kase.culprit];
  if (type === 'shadow') {
    const h = size * .78, w = h * a.w / a.h;
    return '<div class="ci" style="left:' + (size - w) / 2 + 'px;top:' + (size - h) / 2 + 'px;width:' + w + 'px;height:' + h + 'px;background:url(' + IMG(a.img) + ') center/contain no-repeat"></div>';
  }
  const [fx, fy, z] = type === 'patch' ? a.patch : a.part;
  const W = size * z, H = W * a.h / a.w;
  return '<div class="ci" style="left:' + (size / 2 - fx * W) + 'px;top:' + (size / 2 - fy * H) + 'px;width:' + W + 'px;height:' + H + 'px;background:url(' + IMG(a.img) + ') 0 0/100% 100% no-repeat"></div>';
}
function renderTray() {
  const t = $('#tray'); t.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const s = el('div', 'slot' + (S.clues[i] ? ' full' : ''), t, '<img src="' + IMG('lens') + '" alt="">');
    if (S.clues[i]) { const m = el('div', 'clueMini clueCard ' + (S.clues[i] === 'shadow' ? 'shadow shadowBg' : ''), s, clueHTML(S.clues[i], 58)); m.style.cssText = 'position:absolute;inset:0;border:0;box-shadow:none'; onTap(s, () => AU.say(S.clues[i] === 'shadow' ? 'shadow' : S.clues[i] + '_' + S.kase.culprit)); }
  }
}

/* ---------- activity panel ---------- */
function openPanel() {
  G.panelOpen = true; const p = $('#panel'); p.classList.add('on');
  const b = $('#pBody'); b.innerHTML = '';
  return b;
}
function closePanel() { G.panelOpen = false; $('#panel').classList.remove('on'); const b = $('#pBody'); if (b) b.innerHTML = ''; S.act = null; }
function pDims() { const b = $('#pBody'); return {b, w: b.clientWidth, h: b.clientHeight}; }
function addCoco(b) { const c = el('img', 'pCoco', b); c.src = IMG('coco_happy'); onTap(c, () => { if (G.lastPrompt) AU.say(G.lastPrompt); }); return c; }
function placeAbs(e, x, y, w, h) { Object.assign(e.style, {position: 'absolute', left: x + 'px', top: y + 'px', width: w + 'px', height: (h == null ? w : h) + 'px'}); }
function gridPos(n, box, size, perRow) {
  perRow = perRow || (n <= 5 ? n : Math.ceil(n / 2)); const rows = Math.ceil(n / perRow), out = [];
  const gx = Math.min(size * 1.25, box.w / perRow), gy = Math.min(size * 1.25, box.h / rows);
  for (let i = 0; i < n; i++) { const r = i / perRow | 0, c = i % perRow, inRow = Math.min(perRow, n - r * perRow);
    out.push([box.x + box.w / 2 + (c - (inRow - 1) / 2) * gx - size / 2 + rnd(-3, 3), box.y + box.h / 2 + (r - (rows - 1) / 2) * gy - size / 2 + rnd(-3, 3)]); }
  return out;
}
function makeItems(b, item, n, pos, size) {
  return pos.slice(0, n).map(([x, y]) => { const it = el('div', 'item', b, '<img src="' + IMG(ITEM_IMG[item]) + '"><span class="n"></span>'); placeAbs(it, x, y, size); it.style.transition = 'left .6s cubic-bezier(.4,1.4,.6,1),top .6s cubic-bezier(.4,1.4,.6,1),transform .2s'; return it; });
}
function bounce(e) { e.classList.remove('bounce'); void e.offsetWidth; e.classList.add('bounce'); }
// Milo touches each item; numbers appear. Resolves when all are counted.
function countByTouch(items) {
  return new Promise(res => {
    let c = 0, idle = Date.now(); items.forEach(it => { it.num = 0; it.classList.remove('on'); });
    const iv = setInterval(() => { if (!G.panelOpen) { clearInterval(iv); res(false); return; } if (Date.now() - idle > 11000 && !AU.isSpeaking()) { idle = Date.now(); const u = items.find(i => !i.num); if (u) { bounce(u); AU.say('count_more'); } } }, 500);
    items.forEach(it => {
      it.onpointerdown = ev => {
        ev.stopPropagation(); ev.preventDefault(); AU.unlock(); G.poke(); idle = Date.now();
        bounce(it); AU.sfx('count');
        if (it.num) { AU.say('num_' + it.num); return; }
        c++; it.num = c; it.querySelector('.n').textContent = c; it.classList.add('on'); AU.say('num_' + c);
        if (c === items.length) { clearInterval(iv); items.forEach(i => i.onpointerdown = ev2 => { ev2.stopPropagation(); bounce(i); AU.say('num_' + i.num); }); setTimeout(() => res(true), FASTMODE ? 30 : 900); }
      };
    });
    S.act = {type: 'count', items, solveStep: () => { const u = items.find(i => !i.num); if (u) u.onpointerdown({stopPropagation() {}, preventDefault() {}}); }};
  });
}
async function recount(items) {
  items.forEach(it => { it.classList.remove('on'); });
  for (let i = 0; i < items.length; i++) {
    if (!G.panelOpen) return;
    const it = items[i]; it.num = i + 1; it.querySelector('.n').textContent = i + 1; it.classList.add('on', 'hl'); AU.sfx('count');
    await AU.say('num_' + (i + 1)); await wait(120); it.classList.remove('hl');
  }
}
function numOptions(n) { const s = new Set([n]); const near = shuffle([n - 1, n + 1, n - 2, n + 2, n + 3, n - 3]).filter(x => x >= 1 && x <= 10); for (const x of near) { if (s.size >= 3) break; s.add(x); } return shuffle([...s]); }
function makeOpts(b, vals, render, y) {
  const row = el('div', 'opts', b); row.style.top = y + 'px';
  return vals.map((v, i) => { const o = el('button', 'opt', row, render(v)); o.dataset.v = v; o.style.animationDelay = i * 90 + 'ms'; return o; });
}
const dots = n => '<div class="dots">' + '<i></i>'.repeat(n) + '</div>';
// ask "how many?" with 3 number choices; unlimited tries, recount after a miss, glow after two misses
async function askNumber(b, n, askKey, items, y, qid) {
  const opts = makeOpts(b, numOptions(n), v => '<span class="big">' + v + '</span>' + dots(+v), y);
  let misses = 0; S.act.correct = String(n);
  AU.say(askKey, {prompt: true});
  while (true) {
    const v = await new Promise(res => { opts.forEach(o => o.onpointerdown = ev => { ev.stopPropagation(); ev.preventDefault(); AU.unlock(); G.poke(); res(+o.dataset.v); }); S.act.answer = () => res(n); if (!G.panelOpen) res(null); S.act.cancel = () => res(null); });
    if (v == null) return false;
    const o = opts.find(x => +x.dataset.v === v);
    try { window.KA && KA.answer({q: qid, given: v, expected: n, correct: v === n, tryNo: misses + 1, qid, topic: 'counting'}); } catch (e) {}
    if (v === n) { o.classList.add('yes'); opts.forEach(x => x.style.pointerEvents = 'none'); AU.sfx('ding'); await AU.seq(['yes_' + n]); return true; }
    misses++; o.classList.add('shake', 'no'); AU.sfx('soft');
    opts.forEach(x => x.style.pointerEvents = 'none');
    await AU.say('count_again'); await recount(items);
    opts.forEach(x => x.style.pointerEvents = '');
    if (misses >= 2) { opts.find(x => +x.dataset.v === n).classList.add('glow'); await AU.say('count_glow', {prompt: true}); }
    else AU.say(askKey, {prompt: true});
  }
}
async function actCount(o) {
  const {b, w, h} = pDims(); addCoco(b); S.act = {type: 'count'};
  const size = Math.min(w * .8 / Math.min(5, Math.ceil(o.n <= 5 ? o.n : o.n / 2)) / 1.3, h * .22, 130);
  const items = makeItems(b, o.item, o.n, gridPos(o.n, {x: w * .14, y: h * .06, w: w * .8, h: h * .56}, size), size);
  items.forEach((it, i) => anim(it, [{transform: 'scale(0)'}, {transform: 'scale(1)'}], {duration: 400, delay: i * 70, easing: 'cubic-bezier(.3,1.6,.6,1)', fill: 'none'}));
  AU.say('count_intro_' + o.item, {prompt: true});
  if (!(await countByTouch(items))) return false;
  return await askNumber(b, o.n, 'count_ask_' + o.item, items, h * .66, 'count-' + o.item + '-' + o.n);
}
async function actAdd(o) {
  const {b, w, h} = pDims(); addCoco(b); S.act = {type: 'add'};
  const a = o.a, c = o.b, n = a + c, size = Math.min(h * .18, w * .1, 92);
  const padL = el('div', 'leafpad', b), padR = el('div', 'leafpad', b), bas = el('div', 'basket', b);
  placeAbs(padL, w * .12, h * .06, w * .32, h * .34); placeAbs(padR, w * .56, h * .06, w * .32, h * .34); placeAbs(bas, w * .2, h * .44, w * .66, h * .22);
  const posL = gridPos(a, {x: w * .12, y: h * .06, w: w * .32, h: h * .34}, size, a > 3 ? 3 : a), posR = gridPos(c, {x: w * .56, y: h * .06, w: w * .32, h: h * .34}, size, c > 3 ? 3 : c);
  const A = makeItems(b, o.item, a, posL, size), B = makeItems(b, o.item, c, posR, size), all = A.concat(B);
  all.forEach(it => it.style.zIndex = 2);
  await AU.say('add_intro');
  padL.classList.add('bounce'); A.forEach(bounce); await AU.say('group_' + a);
  padR.classList.add('bounce'); B.forEach(bounce); await AU.say('more_' + c);
  if (!G.panelOpen) return false;
  // put them in the basket
  const inBas = gridPos(n, {x: w * .2, y: h * .44, w: w * .66, h: h * .22}, size * .9, n > 5 ? Math.ceil(n / 2) : n);
  let moved = 0;
  await new Promise(res => {
    const move = (grp, pad, off) => { if (grp.moved) return; grp.moved = 1; moved++; AU.sfx('whoosh'); pad.style.transition = 'opacity .5s'; pad.style.opacity = .35;
      grp.forEach((it, i) => { const [x, y] = inBas[off + i]; it.style.left = x + 'px'; it.style.top = y + 'px'; it.style.width = it.style.height = size * .9 + 'px'; });
      if (moved === 2) setTimeout(res, FASTMODE ? 30 : 700); };
    const hit = (grp, pad, off) => ev => { ev && ev.stopPropagation && ev.stopPropagation(); AU.unlock(); G.poke(); move(grp, pad, off); };
    padL.onpointerdown = hit(A, padL, 0); A.forEach(it => it.onpointerdown = hit(A, padL, 0));
    padR.onpointerdown = hit(B, padR, a); B.forEach(it => it.onpointerdown = hit(B, padR, a));
    padL.style.animation = padR.style.animation = 'pulse 1.2s infinite';
    S.act.solveStep = () => { if (!A.moved) hit(A, padL, 0)(); else hit(B, padR, a)(); };
    AU.say('add_push', {prompt: true});
  });
  padL.style.animation = padR.style.animation = 'none';
  const eq = el('div', 'eq', b); eq.style.top = h * .14 + 'px'; eq.innerHTML = a + ' + ' + c + ' = <b>?</b>';
  padL.remove(); padR.remove();
  AU.say('add_countall', {prompt: true});
  if (!(await countByTouch(all))) return false;
  const ok = await askNumber(b, n, 'add_ask_' + a + '_' + c, all, h * .7, 'add-' + a + '+' + c);
  if (ok) { eq.innerHTML = a + ' + ' + c + ' = <b>' + n + '</b>'; bounce(eq); await AU.say('add_right'); }
  return ok;
}
async function actSound(o) {
  const {b, w, h} = pDims(); const k = S.kase, wit = k.witness, an = ANIMALS[wit], zh = DB.lang === 'zh';
  if (o.kind === 'binoculars') { const v = await binoView(b, wit); await wait(500); if (!G.panelOpen) return false; anim(v, [{opacity: 1}, {opacity: 0}], {duration: 400}).then(() => v.remove()); }
  addCoco(b); S.act = {type: 'sound'};
  const ah = h * .5, aw = ah * an.w / an.h;
  const big = el('img', 'bigAnimal', b); big.src = IMG(an.img); placeAbs(big, w * .26 - aw / 2, h * .05, aw, ah);
  anim(big, [{transform: 'scale(.3)', opacity: 0}, {transform: 'scale(1)', opacity: 1}], {duration: 450, easing: 'cubic-bezier(.3,1.6,.6,1)'});
  onTap(big, () => { hop(big); AU.say(S.act.asked ? 'sound_again_' + wit : 'hi_' + wit); });
  await AU.say('hi_' + wit);
  // teach with a sound we know
  const teach = el('div', 'teach', b, '<span class="ltr">' + (zh ? 'ㄎ' : 'L') + '</span><img src="' + IMG(zh ? 'coco' : 'leo') + '">');
  teach.style.left = w * .55 + 'px'; teach.style.top = h * .12 + 'px';
  anim(teach, [{transform: 'scale(0)'}, {transform: 'scale(1)'}], {duration: 400, easing: 'cubic-bezier(.3,1.6,.6,1)'});
  onTap(teach, () => AU.say('sound_teach'));
  if (!(await AU.say('sound_teach'))) { if (!G.panelOpen) return false; }
  if (!G.panelOpen) return false;
  anim(teach, [{transform: 'scale(1)'}, {transform: 'scale(.7) translate(22%,-30%)', opacity: .8}], {duration: 400});
  // ask
  const ans = zh ? ANIMAL_INFO[wit].zy : ANIMAL_INFO[wit].letter;
  const pool = zh ? Object.keys(LETTERS.zh).filter(x => x !== 'ㄎ' && x !== ans) : EN_LETTERS.filter(x => x !== 'L' && x !== ans);
  const vals = shuffle([ans].concat(shuffle(pool).slice(0, 2)));
  const opts = makeOpts(b, vals, v => '<span class="big">' + v + '</span>', h * .64);
  if (zh) opts.forEach(x => x.classList.add('zy'));
  S.act.asked = 1; S.act.correct = ans; let misses = 0;
  AU.say('sound_ask_' + wit, {prompt: true});
  while (true) {
    const v = await new Promise(res => { opts.forEach(x => x.onpointerdown = ev => { ev.stopPropagation(); ev.preventDefault(); AU.unlock(); G.poke(); res(x.dataset.v); }); S.act.answer = () => res(ans); S.act.cancel = () => res(null); });
    if (v == null || !G.panelOpen) return false;
    const x = opts.find(q => q.dataset.v === v);
    try { window.KA && KA.answer({q: 'first sound of ' + wit, given: v, expected: ans, correct: v === ans, tryNo: misses + 1, qid: 'sound-' + wit + '-' + DB.lang, topic: 'phonics'}); } catch (e) {}
    if (v === ans) {
      x.classList.add('yes'); opts.forEach(q => q.style.pointerEvents = 'none'); AU.sfx('ding'); hop(big);
      await AU.say('sound_right_' + wit); await AU.say('witness_clue'); return true;
    }
    misses++; x.classList.add('shake', 'no'); AU.sfx('soft');
    opts.forEach(q => q.style.pointerEvents = 'none');
    if (zh) await AU.raw(LETTERS.zh[v], 'zh'); else await AU.say('letter_' + v);
    await AU.say('sound_hmm');
    opts.forEach(q => q.style.pointerEvents = '');
    if (misses >= 2) { opts.find(q => q.dataset.v === ans).classList.add('glow'); await AU.say('sound_again_' + wit); AU.say('sound_glow', {prompt: true}); }
    else AU.say('sound_again_' + wit, {prompt: true});
  }
}

/* ---------- clue reveal ---------- */
async function revealClue() {
  const {b, w, h} = pDims(); b.innerHTML = ''; el('div', 'burst', b);
  const type = CLUE_ORDER[S.clues.length], size = Math.min(w * .5, h * .6);
  const card = el('div', 'clueCard ' + (type === 'shadow' ? 'shadow shadowBg' : ''), b, clueHTML(type, size));
  placeAbs(card, (w - size) / 2, (h - size) / 2 - h * .04, size);
  AU.sfx('sparkle');
  await anim(card, [{transform: 'scale(0) rotate(-20deg)'}, {transform: 'scale(1) rotate(0)'}], {duration: 600, easing: 'cubic-bezier(.3,1.5,.6,1)'});
  addCoco(b);
  await AU.say('clue_look');
  await AU.say(type === 'shadow' ? 'shadow' : type + '_' + S.kase.culprit);
  await wait(300);
  // fly to the tray
  const slot = $('#tray').children[S.clues.length], r1 = card.getBoundingClientRect(), r2 = slot.getBoundingClientRect();
  await anim(card, [{transform: 'none'}, {transform: 'translate(' + (r2.left + r2.width / 2 - (r1.left + r1.width / 2)) + 'px,' + (r2.top + r2.height / 2 - (r1.top + r1.height / 2)) + 'px) scale(' + r2.width / r1.width + ')'}], {duration: FASTMODE ? 30 : 700, easing: 'ease-in'});
  S.clues.push(type); renderTray(); AU.sfx('ding');
  closePanel();
  await AU.say('clue_' + S.clues.length);
}

/* ---------- solve the mystery ---------- */
async function finalCase() {
  const k = S.kase; openPanel(); const {b, w, h} = pDims(); S.act = {type: 'final'};
  const cs = Math.min(h * .27, w * .2), cards = [];
  CLUE_ORDER.forEach((type, i) => {
    const c = el('div', 'clueCard ' + (type === 'shadow' ? 'shadow shadowBg' : ''), b, clueHTML(type, cs));
    placeAbs(c, w / 2 + (i - 1) * cs * 1.35 - cs / 2, h * .05, cs); cards.push(c);
    onTap(c, () => { bounce(c); AU.say(type === 'shadow' ? 'shadow' : type + '_' + k.culprit); });
  });
  const lineup = el('div', 'lineup', b); lineup.style.top = h * .42 + 'px'; lineup.style.height = h * .52 + 'px';
  const sus = shuffle([k.culprit].concat(k.decoys));
  const sh = h * .5, sw = Math.min(w * .26, sh * .95);
  const els = sus.map(a => { const s = el('button', 'suspect', lineup, '<img src="' + IMG(ANIMALS[a].img) + '" alt="' + a + '">'); s.style.width = sw + 'px'; s.style.height = sh + 'px'; s.dataset.a = a; return s; });
  addCoco(b);
  await AU.say('final_intro');
  for (let i = 0; i < 3; i++) { if (!G.panelOpen) return; cards[i].classList.add('bounce'); await AU.say(CLUE_ORDER[i] === 'shadow' ? 'shadow' : CLUE_ORDER[i] + '_' + k.culprit); }
  AU.say('final_ask', {prompt: true});
  let misses = 0; S.act.correct = k.culprit;
  while (true) {
    const a = await new Promise(res => { els.forEach(s => s.onpointerdown = ev => { ev.stopPropagation(); ev.preventDefault(); AU.unlock(); G.poke(); res(s.dataset.a); }); S.act.answer = () => res(k.culprit); S.act.cancel = () => res(null); });
    if (a == null || !G.panelOpen) return;
    const s = els.find(x => x.dataset.a === a);
    try { window.KA && KA.answer({q: 'who did it (' + k.area + ')', given: a, expected: k.culprit, correct: a === k.culprit, tryNo: misses + 1, qid: 'final-' + k.area + '-' + k.culprit, topic: 'animals'}); } catch (e) {}
    if (a === k.culprit) { s.classList.add('yes'); AU.sfx('fanfare'); hop(s); break; }
    misses++; s.classList.add('shake'); AU.sfx('soft'); hop(s);
    els.forEach(x => x.style.pointerEvents = 'none');
    await AU.say('notme_' + a); s.classList.add('no');
    await AU.say('final_again'); cards.forEach(bounce);
    els.forEach(x => { if (!x.classList.contains('no')) x.style.pointerEvents = ''; });
    if (misses >= 2) { const c = els.find(x => x.dataset.a === k.culprit); c.style.animation = 'pulse 1s infinite'; }
    AU.say('final_ask', {prompt: true});
  }
  await wait(500);
  await celebrate();
}
async function celebrate() {
  const k = S.kase, a = k.culprit, an = ANIMALS[a];
  DB.stickers[a] = (DB.stickers[a] || 0) + 1; DB.cases[k.area] = (DB.cases[k.area] || 0) + 1; DB.last[k.area] = a; DB.save();
  const {b, w, h} = pDims(); b.innerHTML = ''; b.classList.add('celebrate'); el('div', 'burst', b);
  const sh = h * .52, sw = sh * an.w / an.h, st = el('img', 'sticker', b); st.src = IMG(an.img); placeAbs(st, (w - sw) / 2, h * .08, sw, sh);
  for (let i = 0; i < 40; i++) { const c = el('div', 'confetti', b); c.style.left = Math.random() * 100 + '%'; c.style.background = pick(['#ffd43b', '#ff6b6b', '#4dabf7', '#69db7c', '#f783ac', '#2fa39a']); c.style.animationDelay = Math.random() * 1.2 + 's'; }
  addCoco(b);
  AU.sfx('fanfare');
  await AU.say('solved_' + k.area + '_' + a);
  // the animal joins the scene
  showCulpritInScene();
  await AU.say('solved_yay');
  await AU.say('sticker_' + a);
  await AU.say('fact_' + a);
  b.classList.remove('celebrate');
  const row = el('div', 'endBtns', b); row.style.top = h * .66 + 'px';
  const again = el('button', 'endBtn again', row, '<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg>');
  const mapb = el('button', 'endBtn mapb', row, '<svg viewBox="0 0 24 24"><path d="M15 5l-6-2-6 2v16l6-2 6 2 6-2V3zM9 5.2l6 2v11.6l-6-2z"/></svg>');
  const bookb = el('button', 'endBtn bookb', row, '<img src="' + IMG('lens') + '" style="height:46px">');
  onTap(again, () => startArea(k.area)); onTap(mapb, () => show('map')); onTap(bookb, () => { G.fromScene = k.area; show('journal'); AU.say('journal_open'); });
  S.act = {type: 'end'};
  AU.say('play_again', {prompt: true});
}
function showCulpritInScene() {
  const w = $('#world'), e = el('div', 'chr culprit', w); e.innerHTML = '<div class="shadow"></div><img src="' + IMG(ANIMALS[S.kase.culprit].img) + '">';
  S.culpritEl = e; e.style.zIndex = 12; placeCulprit();
  onTap(e, () => { if (!G.busy) { hop(e); AU.say('fact_' + S.kase.culprit); } });
}
function placeCulprit() {
  const a = ANIMALS[S.kase.culprit], h = S.leo.h * (S.kase.culprit === 'giraffe' ? .95 : S.kase.culprit === 'elephant' ? .75 : .6), wd = h * a.w / a.h;
  const x = Math.min(maxX(), S.leo.x + S.leo.h * .75);
  Object.assign(S.culpritEl.style, {left: x - wd / 2 + 'px', top: pathY(x) - h + 'px', width: wd + 'px', height: h + 'px'});
}

/* ---------- sticker journal ---------- */
function renderJournal() {
  $('#jTitle').innerHTML = T('ui_book');
  const s = $('#jStickers'); s.innerHTML = '';
  SUSPECTS.forEach(a => {
    const n = DB.stickers[a] || 0, c = el('button', 'stk' + (n ? ' got' : ''), s, '<img src="' + IMG(ANIMALS[a].img) + '" alt="">');
    if (n) { el('span', 'lab', c, T('name_' + a).replace(/!|!/g, '')); if (n > 1) el('span', 'cnt', c, '×' + n); }
    else el('span', 'q', c, '?');
    onTap(c, async () => { bounce(c); if (n) { AU.sfx('pop'); if (await AU.say('name_' + a)) AU.say('fact_' + a); } else AU.say('journal_empty'); });
  });
  const cs = $('#jCases'); cs.innerHTML = '<h3>' + T('ui_cases') + '</h3>';
  AREA_IDS.forEach(id => {
    const n = DB.cases[id] || 0, r = el('button', 'caseRow', cs);
    const th = el('div', 'th', r); th.style.backgroundImage = 'url(' + IMG(AREAS[id].bg) + ')';
    el('div', 'ct', r, T('area_' + id).replace(/!|!/g, '') + ' <b>' + n + '</b><div class="stars">' + ('<img src="' + IMG('star') + '">').repeat(Math.min(n, 10)) + '</div>');
    onTap(r, () => AU.say(n ? 'journal_cases' : 'area_' + id));
  });
}

/* ---------- grown-up settings ---------- */
function openSettings() {
  const m = $('#settings'); m.classList.add('on');
  const vs = (() => { try { return speechSynthesis.getVoices(); } catch (e) { return []; } })();
  const en = vs.filter(v => /^en/i.test(v.lang)).sort((a, b) => vScore(b) - vScore(a)), zh = (window.KAVoice ? KAVoice.zhVoices() : vs.filter(v => /^zh/i.test(v.lang)));
  const curZh = zhVoice();
  const row = (v, sel, kind) => '<div class="vrow"><button class="nm' + (sel ? ' sel' : '') + '" data-k="' + kind + '" data-u="' + esc(v.voiceURI) + '">' + (sel ? '✓ ' : '') + esc(v.name) + ' <small>(' + esc(v.lang) + ')</small></button><button class="pv" data-pk="' + kind + '" data-u="' + esc(v.voiceURI) + '">▶</button></div>';
  m.innerHTML = '<div class="sheet"><h2>Grown-ups · 家長設定</h2><p>Milo plays by voice; reading is optional. Stickers and settings save on this device only.</p>' +
    '<h3>Language · 語言</h3><div class="row"><button class="chip' + (DB.lang === 'en' ? ' sel' : '') + '" data-l="en">English</button><button class="chip' + (DB.lang === 'zh' ? ' sel' : '') + '" data-l="zh">中文(台灣)</button></div>' +
    '<h3>Sound · 聲音</h3><div class="row"><button class="chip' + (!DB.muted ? ' sel' : '') + '" id="sSnd">' + (DB.muted ? '🔇 Sound off · 靜音' : '🔊 Sound on · 有聲音') + '</button><button class="chip' + (DB.music ? ' sel' : '') + '" id="sMus">' + (DB.music ? '♪ Menu music on' : '♪ Menu music off') + '</button></div>' +
    '<h3>English voice</h3><p>Recommended: the recorded narrator (same warm voice every time, made with the open-source Kokoro voice model). Or pick a voice installed on this device.</p>' +
    '<div class="vlist"><div class="vrow"><button class="nm' + (DB.enVoice === 'rec' ? ' sel' : '') + '" data-k="en" data-u="rec">' + (DB.enVoice === 'rec' ? '✓ ' : '') + 'Recorded narrator (Coco) ★</button><button class="pv" data-pk="en" data-u="rec">▶</button></div>' + en.map(v => row(v, DB.enVoice === v.voiceURI, 'en')).join('') + '</div>' +
    '<h3>中文聲音 Chinese voice</h3><p>Uses this device\'s voices. On iPad, Settings → Accessibility → Spoken Content → Voices → Chinese (Taiwan) → download Meijia (Enhanced) or Lilian (Premium) for the most natural sound.</p>' +
    '<div class="vlist">' + (zh.length ? zh.map(v => row(v, curZh && v.voiceURI === curZh.voiceURI, 'zh')).join('') : '<p style="padding:8px">No Chinese voice found on this device.</p>') + '</div>' +
    '<h3>Progress · 進度</h3><div class="row"><button class="chip" id="sReset">Reset stickers…</button></div>' +
    '<p style="margin-top:10px">Animal Safari Detective v1.0 · art supplied by the family; English narration pre-recorded offline with Kokoro-82M (Apache-2.0).</p>' +
    '<button class="done" id="sDone">Done · 完成</button></div>';
  m.querySelectorAll('[data-l]').forEach(x => x.onclick = () => { setLang(x.dataset.l); openSettings(); });
  m.querySelector('#sSnd').onclick = () => { setMuted(!DB.muted); openSettings(); };
  m.querySelector('#sMus').onclick = () => { DB.music = !DB.music; DB.save(); AU.music(G.screen !== 'scene'); openSettings(); };
  m.querySelectorAll('.nm').forEach(x => x.onclick = () => { if (x.dataset.k === 'en') { DB.enVoice = x.dataset.u; DB.save(); } else { try { localStorage.setItem('dinoworld.zhvoice', x.dataset.u); } catch (e) {} } openSettings(); previewVoice(x.dataset.k, x.dataset.u); });
  m.querySelectorAll('.pv').forEach(x => x.onclick = () => previewVoice(x.dataset.pk, x.dataset.u));
  m.querySelector('#sReset').onclick = () => {
    const done = () => { DB.stickers = {}; DB.cases = {trail: 0, river: 0, canopy: 0}; DB.last = {}; DB.save(); renderTitle(); openSettings(); };
    if (window.KAKit && KAKit.resetGate) KAKit.resetGate({kids: ['milo'], onReset: done}); else if (confirm('Reset all stickers?')) done();
  };
  m.querySelector('#sDone').onclick = () => { m.classList.remove('on'); AU.stop(); };
}
function vScore(v) { const id = (v.name + ' ' + v.voiceURI).toLowerCase(); return (/premium/.test(id) ? 30 : /enhanced|neural|natural/.test(id) ? 20 : 0) + (v.lang === 'en-US' ? 5 : 0) - (/compact|eloquence|novelty/.test(id) ? 40 : 0); }
function previewVoice(kind, uri) {
  AU.stop(); AU.unlock();
  if (kind === 'en' && uri === 'rec') { const pl = DB.lang, pv = DB.enVoice; DB.lang = 'en'; DB.enVoice = 'rec'; AU.say('hello'); DB.lang = pl; DB.enVoice = pv; return; }
  try {
    const v = speechSynthesis.getVoices().find(x => x.voiceURI === uri), u = new SpeechSynthesisUtterance(kind === 'en' ? LINES.hello.en : LINES.hello.zh);
    if (v) { u.voice = v; u.lang = v.lang; } u.rate = kind === 'en' ? .9 : .82; u.pitch = kind === 'en' ? 1.05 : 1.1; u.__ka = 1; speechSynthesis.speak(u);
  } catch (e) {}
}
function setMuted(m) { DB.muted = m; DB.save(); document.body.classList.toggle('muted', m); if (m) AU.stop(); AU.music(G.screen !== 'scene'); }

/* ---------- controls ---------- */
function bindControls() {
  $('#btnPlay').addEventListener('pointerdown', e => { e.preventDefault(); AU.unlock(); AU.sfx('tap'); show('map'); AU.say('map_pick'); });
  $('#btnBook').addEventListener('pointerdown', e => { e.preventDefault(); AU.unlock(); AU.sfx('tap'); G.fromScene = null; show('journal'); AU.say('journal_open'); });
  $('#title').addEventListener('pointerdown', e => { if (e.target.closest('button')) return; AU.unlock(); if (!AU.isSpeaking()) AU.say('hello'); });
  document.querySelectorAll('#langPill button').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); AU.unlock(); setLang(b.dataset.l); AU.say('title'); }));
  $('#btnGear').onclick = () => { AU.unlock(); openSettings(); };
  document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); AU.unlock(); show(b.dataset.go); }));
  $('#mapBook').addEventListener('pointerdown', e => { e.preventDefault(); G.fromScene = null; show('journal'); AU.say('journal_open'); });
  $('#jBack').addEventListener('pointerdown', e => { e.preventDefault(); if (G.fromScene) show('map'); else show('title'); });
  $('#btnHome').addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); AU.sfx('tap'); show('map'); AU.say('map_pick'); });
  $('#btnReplay').addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); AU.unlock(); if (G.lastPrompt) AU.say(G.lastPrompt); });
  $('#btnMute').addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); setMuted(!DB.muted); });
  // tap the ground to walk
  $('#stage').addEventListener('pointerdown', e => {
    AU.unlock(); G.poke(); if (G.busy || G.panelOpen) return;
    const r = $('#stage').getBoundingClientRect(), x = e.clientX - r.left + S.cam;
    walkTo(x); const m = el('div', 'ripple', $('#world')), s = V.stageH * .08; Object.assign(m.style, {left: x - s / 2 + 'px', top: pathY(x) - s / 4 + 'px', width: s + 'px', height: s / 2 + 'px', borderColor: 'rgba(255,240,170,.9)', zIndex: 15}); setTimeout(() => m.remove(), 1000);
  });
  // hold the arrows to walk
  const hold = (b, d) => {
    const on = e => { e.preventDefault(); e.stopPropagation(); AU.unlock(); if (G.busy || G.panelOpen) return; S.keys = d; b.classList.add('press'); try { b.setPointerCapture(e.pointerId); } catch (x) {} };
    const off = () => { if (S.keys === d) S.keys = 0; b.classList.remove('press'); };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointercancel', off); b.addEventListener('lostpointercapture', off);
  };
  hold($('#arL'), -1); hold($('#arR'), 1);
  window.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') S.keys = -1; if (e.key === 'ArrowRight') S.keys = 1; });
  window.addEventListener('keyup', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') S.keys = 0; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { AU.stop(); AU.music(false); } else AU.music(G.screen !== 'scene'); });
  document.addEventListener('gesturestart', e => e.preventDefault());
}

/* ---------- automated playtest hook (harmless for players) ---------- */
window.__test = {
  state: () => ({screen: G.screen, area: S.area, clues: S.clues.length, panel: G.panelOpen, act: S.act && S.act.type, busy: G.busy, culprit: S.kase && S.kase.culprit, witness: S.kase && S.kase.witness,
    objs: S.kase ? S.kase.objs.map(o => o.kind + (o.act ? ':' + o.act + (o.n ? o.n : '') + (o.a ? o.a + '+' + o.b : '') : '') + (o.done ? '✓' : '')) : [], stickers: DB.stickers, cases: DB.cases, lang: DB.lang, leoX: S.leo && Math.round(S.leo.x), cam: S.cam && Math.round(S.cam), done: S.act && S.act.type === 'end'}),
  start: id => startArea(id),
  nextClue: () => { const o = S.objs.find(x => x.act && !x.done); if (o) tapObj(o); return o && o.kind; },
  step: () => { if (S.act && S.act.solveStep && S.act.type !== 'final') S.act.solveStep(); },
  answer: () => { if (S.act && S.act.answer) S.act.answer(); },
  wrong: () => { const o = [...document.querySelectorAll('.opt:not(.no):not(.yes),.suspect:not(.no):not(.yes)')].find(x => (x.dataset.v != null ? x.dataset.v : x.dataset.a) !== (S.act && S.act.correct)); if (o) o.onpointerdown({stopPropagation() {}, preventDefault() {}}); return o && (o.dataset.v || o.dataset.a); },
  db: () => DB,
};

/* ---------- boot ---------- */
(function boot() {
  document.body.classList.toggle('zh', DB.lang === 'zh'); document.body.classList.toggle('muted', !!DB.muted);
  measure(); bindControls(); renderTitle(); requestAnimationFrame(tick);
  ['leo_walk1', 'leo_walk2', 'leo_walk3', 'coco_side', 'coco', 'leo', 'trail', 'river', 'canopy'].forEach(n => { const i = new Image(); i.src = IMG(n); });
  if (DB.lang === 'en') AU.preload(['hello', 'map_pick', 'title']);
})();
