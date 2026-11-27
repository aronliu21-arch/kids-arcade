/* ---------- Zoo jobs: 4 quick mini-games (about a minute each) ----------
   Feeding time (counting / adding), Night zoo (search + count), Poop patrol (big / medium / small),
   Zookeeper says (listening to spoken Chinese). New lines are spoken with the device voices. */

// pictures that exist in art/ ; anything else falls back to an emoji until its art is added
const ART_OK = new Set(['banana', 'berry', 'apple', 'star', 'fish', 'leaf', 'carrot', 'poop', 'sponge', 'pillow']);
const EMOJI = {fish: '🐟', leaf: '🍃', carrot: '🥕', poop: '💩', sponge: '🧽', pillow: '🛏️', heart: '❤️'};
function thing(name, parent, cls) {
  if (ART_OK.has(name)) { const i = el('img', 'thing ' + (cls || ''), parent); i.src = IMG(name); i.alt = ''; i.draggable = false; return i; }
  return el('div', 'thing emo ' + (cls || ''), parent, '<span>' + (EMOJI[name] || '⭐') + '</span>');
}

/* --- zhuyin for new sentences: reuse every reading already in LINES, plus a few new ones --- */
const ZY_EXTRA = {"餵": "ㄨㄟˋ", "飽": "ㄅㄠˇ", "魚": "ㄩˊ", "葉": "ㄧㄝˋ", "胡": "ㄏㄨˊ", "蘿": "ㄌㄨㄛˊ", "蔔": "˙ㄅㄛ", "莓": "ㄇㄟˊ",
  "藍": "ㄌㄢˊ", "根": "ㄍㄣ", "顆": "ㄎㄜ", "條": "ㄊㄧㄠˊ", "片": "ㄆㄧㄢˋ", "隻": "ㄓ", "晚": "ㄨㄢˇ", "電": "ㄉㄧㄢˋ", "筒": "ㄊㄨㄥˇ",
  "便": "ㄅㄧㄢˋ", "糟": "ㄗㄠ", "糕": "ㄍㄠ", "拖": "ㄊㄨㄛ", "主": "ㄓㄨˇ", "等": "ㄉㄥˇ", "管": "ㄍㄨㄢˇ", "理": "ㄌㄧˇ", "員": "ㄩㄢˊ",
  "澡": "ㄗㄠˇ", "洗": "ㄒㄧˇ", "睡": "ㄕㄨㄟˋ", "覺": "ㄐㄧㄠˋ", "讓": "ㄖㄤˋ", "請": "ㄑㄧㄥˇ", "幫": "ㄅㄤ", "乾": "ㄍㄢ", "淨": "ㄐㄧㄥˋ",
  "愛": "ㄞˋ", "呼": "ㄏㄨ", "仔": "ㄗˇ", "細": "ㄒㄧˋ", "聽": "ㄊㄧㄥ", "肚": "ㄉㄨˋ", "餓": "ㄜˋ", "點": "ㄉㄧㄢˇ", "物": "ㄨˋ",
  "園": "ㄩㄢˊ", "工": "ㄍㄨㄥ", "作": "ㄗㄨㄛˋ", "巡": "ㄒㄩㄣˊ", "邏": "ㄌㄨㄛˊ", "夜": "ㄧㄝˋ", "間": "ㄐㄧㄢ", "移": "ㄧˊ", "動": "ㄉㄨㄥˋ",
  "手": "ㄕㄡˇ", "處": "ㄔㄨˋ", "都": "ㄉㄡ", "謝": "ㄒㄧㄝˋ", "時": "ㄕˊ", "說": "ㄕㄨㄛ", "東": "ㄉㄨㄥ", "西": "˙ㄒㄧ", "抱": "ㄅㄠˋ",
  "安": "ㄢ", "嗯": "ㄣ", "牠": "ㄊㄚ", "的": "˙ㄉㄜ", "了": "˙ㄌㄜ", "得": "˙ㄉㄜ", "身": "ㄕㄣ", "多": "ㄉㄨㄛ", "再": "ㄗㄞˋ",
  "還": "ㄏㄞˊ", "長": "ㄔㄤˊ", "子": "˙ㄗ", "次": "ㄘˋ", "太": "ㄊㄞˋ", "這": "ㄓㄜˋ", "個": "˙ㄍㄜ", "中": "ㄓㄨㄥ", "出": "ㄔㄨ", "勾": "ㄍㄡ", "圈": "ㄑㄩㄢ", "圓": "ㄩㄢˊ", "想": "ㄒㄧㄤˇ", "暗": "ㄢˋ", "滿": "ㄇㄢˇ", "試": "ㄕˋ", "食": "ㄕˊ"};
const ZYMAP = (() => { const m = {}; Object.values(LINES).forEach(l => (l.zy || []).forEach(([c, z]) => { if (z && c.length === 1 && !m[c]) m[c] = z; })); return Object.assign(m, ZY_EXTRA); })();
const zyHTML = s => [...s].map(c => ZYMAP[c] ? '<ruby>' + c + '<rt>' + ZYMAP[c] + '</rt></ruby>' : esc(c)).join('');

/* --- animal words --- */
const AN = {
  monkey:   {en: 'monkey', pl: 'monkeys', zh: '猴子', food: 'banana', fen: 'bananas', fzh: '香蕉', mw: '根', size: 1},
  parrot:   {en: 'parrot', pl: 'parrots', zh: '鸚鵡', food: 'berry', fen: 'berries', fzh: '藍莓', mw: '顆', size: 0},
  elephant: {en: 'elephant', pl: 'elephants', zh: '大象', food: 'apple', fen: 'apples', fzh: '蘋果', mw: '顆', size: 2},
  tiger:    {en: 'tiger', pl: 'tigers', zh: '老虎', food: 'fish', fen: 'fish', fzh: '魚', mw: '條', size: 2},
  giraffe:  {en: 'giraffe', pl: 'giraffes', zh: '長頸鹿', food: 'leaf', fen: 'leaves', fzh: '葉子', mw: '片', size: 2},
  zebra:    {en: 'zebra', pl: 'zebras', zh: '斑馬', food: 'carrot', fen: 'carrots', fzh: '胡蘿蔔', mw: '根', size: 1},
};
const AN_IDS = Object.keys(AN);
const cap = s => s[0].toUpperCase() + s.slice(1);

/* --- the jobs --- */
const JOBS = {
  feed:   {en: 'Feeding Time', zh: '餵食時間', icon: 'monkey', bg: 'trail', total: 4},
  night:  {en: 'Night Zoo', zh: '夜間動物園', icon: 'parrot', bg: 'canopy', total: 3},
  poop:   {en: 'Poop Patrol', zh: '便便巡邏', icon: 'elephant', bg: 'trail', total: 6},
  keeper: {en: 'Zookeeper Says', zh: '管理員說', icon: 'giraffe', bg: 'river', total: 5},
};
const JOB_IDS = ['feed', 'night', 'poop', 'keeper'];
const M = {sid: 0, job: null, got: 0};
const alive = sid => sid === M.sid && G.screen === 'mini';

function renderJobs() {
  const j = $('#jobs'); if (!j) return; j.innerHTML = '';
  if (!DB.jobs) DB.jobs = {};
  JOB_IDS.forEach(id => {
    const J = JOBS[id], b = el('button', 'job', j);
    el('img', '', b).src = IMG(J.icon);
    el('div', 'jn', b, DB.lang === 'zh' ? zyHTML(J.zh) : esc(J.en));
    const n = DB.jobs[id] || 0; if (n) el('div', 'jc', b, '★' + n);
    b.setAttribute('aria-label', J.en);
    onTap(b, () => { AU.sfx('tap'); startJob(id); });
  });
}

/* --- speech + caption --- */
function cap2(en, zh) { const c = $('#mCap'); if (!c) return; c.innerHTML = DB.lang === 'zh' ? zyHTML(zh) : esc(en) + '<small>' + zyHTML(zh) + '</small>'; c.classList.add('show'); }
function msay(en, zh) { cap2(en, zh); const t = M.capT = (M.capT || 0) + 1; return AU.raw(DB.lang === 'zh' ? zh : en, DB.lang === 'zh' ? 'zh' : 'en').then(r => { setTimeout(() => { if (M.capT === t) $('#mCap').classList.remove('show'); }, 2500); return r; }); }
function mprompt(en, zh) { M.last = [en, zh]; return msay(en, zh); }

function stars() {
  const s = $('#mStars'); s.innerHTML = '';
  for (let i = 0; i < JOBS[M.job].total; i++) el('i', i < M.got ? 'on' : '', s);
}
function starUp() { M.got++; stars(); const s = $('#mStars').children[M.got - 1]; if (s) bounce(s); AU.sfx('ding'); }
function mDims() { const b = $('#mBody'); return {b, w: b.clientWidth, h: b.clientHeight}; }
function tapWait(els, sid) { // resolves with the element tapped (or null if the game was left)
  return new Promise(res => {
    els.forEach(e => e.onpointerdown = ev => { ev.stopPropagation(); ev.preventDefault(); AU.unlock(); G.poke(); res(e); });
    M.cancel = () => res(null);
  });
}
const place = (e, x, y, hgt) => { Object.assign(e.style, {left: x + '%', top: y + '%'}); if (hgt != null) e.style.height = hgt + '%'; return e; };
function animalImg(id, parent, cls) { const i = el('img', 'mAn ' + (cls || ''), parent); i.src = IMG(ANIMALS[id].img); i.alt = id; i.draggable = false; i.dataset.a = id; return i; }

function startJob(id) {
  M.sid++; M.job = id; M.got = 0; M.last = null; M.solve = null; if (M.cancel) M.cancel();
  show('mini');
  const J = JOBS[id];
  $('#mBg').style.backgroundImage = 'url(' + IMG(J.bg) + ')';
  $('#mini').className = 'screen on job-' + id;
  $('#mBody').innerHTML = ''; $('#mCap').classList.remove('show');
  stars();
  ({feed: runFeed, night: runNight, poop: runPoop, keeper: runKeeper})[id](M.sid);
}
async function jobDone(sid) {
  if (!alive(sid)) return;
  DB.jobs = DB.jobs || {}; DB.jobs[M.job] = (DB.jobs[M.job] || 0) + 1; DB.save();
  const {b} = mDims(); const o = el('div', 'mEnd', b); el('div', 'burst', o);
  for (let i = 0; i < 36; i++) { const c = el('div', 'confetti', o); c.style.left = Math.random() * 100 + '%'; c.style.background = pick(['#ffd43b', '#ff6b6b', '#4dabf7', '#69db7c', '#f783ac', '#2fa39a']); c.style.animationDelay = Math.random() * 1.2 + 's'; }
  const st = el('div', 'bigStar', o, '★'); anim(st, [{transform: 'scale(0) rotate(-90deg)'}, {transform: 'scale(1) rotate(0)'}], {duration: 600, easing: 'cubic-bezier(.3,1.6,.6,1)'});
  AU.sfx('fanfare');
  const row = el('div', 'endBtns', o); row.style.top = '62%';
  const again = el('button', 'endBtn again', row, '<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/></svg>');
  const mapb = el('button', 'endBtn mapb', row, '<svg viewBox="0 0 24 24"><path d="M15 5l-6-2-6 2v16l6-2 6 2 6-2V3zM9 5.2l6 2v11.6l-6-2z"/></svg>');
  onTap(again, () => startJob(M.job)); onTap(mapb, () => show('map'));
  M.done = true;
  await AU.say('praise_' + rnd(1, 4));
}

/* =========== 1. Feeding time: feed each animal the number it asks for =========== */
async function runFeed(sid) {
  const {b} = mDims(); M.done = false;
  const order = shuffle(AN_IDS).slice(0, 4);
  await mprompt('Feeding time! The animals are hungry. Tap the food to feed them!', '餵食時間到了!動物們肚子餓了,點食物餵牠們吃!');
  for (let r = 0; r < order.length; r++) {
    if (!alive(sid)) return;
    b.innerHTML = '';
    const id = order[r], A = AN[id], add = r >= 2;
    const n = add ? rnd(4, 9) : rnd(3, 7), a = add ? rnd(1, n - 1) : n, c = n - a;
    const an = animalImg(id, b, 'feedAn'); place(an, 8, 16, 52);
    anim(an, [{transform: 'translateX(-60%)', opacity: 0}, {transform: 'none', opacity: 1}], {duration: 500});
    const want = el('div', 'want', b); place(want, 40, 8);
    want.innerHTML = '<b>' + (add ? a + ' + ' + c : n) + '</b>'; thing(A.food, want);
    const tum = el('div', 'tummy', b); place(tum, 40, 34);
    const ok = el('button', 'okBtn', b, '✓'); place(ok, 80, 34);
    const bas = el('div', 'foodBasket', b); place(bas, 22, 70);
    for (let i = 0; i < 10; i++) thing(A.food, bas, 'src');
    let eaten = 0, miss = 0;
    const redrawTummy = () => {
      tum.innerHTML = '';
      for (let i = 0; i < Math.max(eaten, miss >= 2 ? n : 0); i++) { const s = el('div', 'slot' + (i < eaten ? ' full' : ' ghost'), tum); if (i < eaten) { thing(A.food, s); el('span', 'k', s, String(i + 1)); } }
    };
    redrawTummy();
    const feedOne = () => {
      if (eaten >= 10 || !alive(sid)) return;
      eaten++; AU.sfx('count'); redrawTummy(); hop(an); AU.say('num_' + eaten);
    };
    bas.querySelectorAll('.src').forEach(f => f.onpointerdown = ev => { ev.preventDefault(); ev.stopPropagation(); AU.unlock(); bounce(f); feedOne(); });
    const say1 = add
      ? [cap(A.en) + ' wants ' + a + ' ' + (a === 1 ? A.food : A.fen) + ', and ' + c + ' more!', A.zh + '想吃' + a + A.mw + A.fzh + ',再' + c + A.mw + '!']
      : [cap(A.en) + ' wants ' + n + ' ' + A.fen + '!', A.zh + '想吃' + n + A.mw + A.fzh + '!'];
    mprompt(say1[0] + ' Then tap the check.', say1[1] + '餵好了就點勾勾。');
    M.solve = () => { eaten = n; redrawTummy(); ok.onpointerdown && ok.onpointerdown({preventDefault() {}, stopPropagation() {}}); };
    while (true) {
      const t = await tapWait([ok, an], sid);
      if (!t || !alive(sid)) return;
      try { window.KA && KA.answer({q: (add ? a + '+' + c : 'feed ' + n), given: eaten, expected: n, correct: eaten === n, tryNo: miss + 1, qid: 'feed-' + (add ? a + '+' + c : n), topic: add ? 'adding' : 'counting'}); } catch (e) {}
      if (eaten === n) {
        AU.sfx('ding'); hop(an); tum.querySelectorAll('.slot').forEach(s => anim(s, [{transform: 'scale(1)'}, {transform: 'scale(0)'}], {duration: 400}));
        await msay('Yum yum! Thank you!', '好好吃!謝謝你!'); starUp(); await wait(250); break;
      }
      miss++; wobble(an);
      if (eaten < n) await msay('Still hungry! More please!', '還好餓喔!再多一點!');
      else { await msay('Too full! Too many! Let\'s try again.', '太飽了!太多了!再試一次。'); eaten = 0; }
      redrawTummy();
      if (miss >= 2) mprompt('Fill every circle!', '把圓圈都放滿!');
    }
  }
  jobDone(sid);
}

/* =========== 2. Night zoo: move the flashlight, find N of one animal =========== */
async function runNight(sid) {
  const {b} = mDims(); M.done = false;
  $('#mini').classList.add('dark');
  const dark = el('div', 'darkness', b), eyesL = el('div', 'eyesLayer', b);
  const setLight = (x, y) => { dark.style.setProperty('--mx', x + 'px'); dark.style.setProperty('--my', y + 'px'); M.light = [x, y]; };
  const r0 = b.getBoundingClientRect(); setLight(r0.width / 2, r0.height / 2);
  const mv = ev => { const r = b.getBoundingClientRect(); setLight(ev.clientX - r.left, ev.clientY - r.top); };
  b.onpointermove = mv; b.onpointerdown = ev => { AU.unlock(); G.poke(); mv(ev); };
  await mprompt('Night zoo! It\'s dark. Move the flashlight to find the animals.', '晚上的動物園好暗喔!移動手電筒找動物。');
  const ns = [2, 3, 4];
  for (let r = 0; r < 3; r++) {
    if (!alive(sid)) return;
    b.querySelectorAll('.nAn,.eyes').forEach(e => e.remove());
    const target = pick(AN_IDS), n = ns[r], others = shuffle(AN_IDS.filter(x => x !== target)).slice(0, 3);
    const kinds = shuffle(Array(n).fill(target).concat(others));
    const cells = shuffle([[6, 18], [30, 14], [54, 18], [76, 14], [8, 52], [32, 56], [56, 50], [78, 54]]);
    const els = kinds.map((k, i) => {
      const [cx, cy] = cells[i], e = animalImg(k, b, 'nAn'); place(e, cx + rnd(-3, 3), cy + rnd(-3, 3), k === 'giraffe' ? 30 : 22);
      const ey = el('div', 'eyes', eyesL, '<i></i><i></i>'); ey.style.left = (cx + 6) + '%'; ey.style.top = (cy + 6) + '%'; ey.style.animationDelay = rnd(0, 2000) + 'ms'; e.eyes = ey;
      return e;
    });
    let found = 0;
    const lit = e => { const r = e.getBoundingClientRect(), br = b.getBoundingClientRect(), x = r.left - br.left + r.width / 2, y = r.top - br.top + r.height / 2, R = Math.min(br.width, br.height) * .26; return Math.hypot(x - M.light[0], y - M.light[1]) < R + r.width * .3; };
    const name = n + ' ' + AN[target].pl;
    mprompt('Find ' + name + '!', '找出' + n + '隻' + AN[target].zh + '!');
    M.solve = () => { const e = els.find(x => x.dataset.a === target && !x.found); if (e) { const r = e.getBoundingClientRect(), br = b.getBoundingClientRect(); setLight(r.left - br.left + r.width / 2, r.top - br.top + r.height / 2); e.onpointerdown({preventDefault() {}, stopPropagation() {}, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2}); } };
    await new Promise(res => {
      els.forEach(e => e.onpointerdown = ev => {
        ev.preventDefault(); ev.stopPropagation(); AU.unlock(); G.poke();
        if (ev.clientX != null) mv(ev);
        if (!lit(e) || e.found) return;
        if (e.dataset.a === target) {
          e.found = true; found++; e.classList.add('lit'); e.eyes.remove(); hop(e); AU.sfx('sparkle'); AU.say('num_' + found);
          if (found === n) setTimeout(res, FASTMODE ? 30 : 900);
        } else { wobble(e); AU.sfx('soft'); AU.say('name_' + e.dataset.a); }
      });
      M.cancel = () => res();
    });
    if (!alive(sid)) return;
    await msay('You found ' + name + '!', '你找到' + n + '隻' + AN[target].zh + '了!'); starUp();
  }
  dark.style.transition = 'opacity 1s'; dark.style.opacity = 0; eyesL.remove(); b.querySelectorAll('.nAn').forEach(e => e.classList.add('lit'));
  b.onpointermove = b.onpointerdown = null;
  jobDone(sid);
}

/* =========== 3. Poop patrol: drag each poop to the animal of the same size =========== */
async function runPoop(sid) {
  const {b} = mDims(); M.done = false;
  const SZ = [{id: 'parrot', h: 7, en: 'Tiny poop for the parrot!', zh: '小小的便便給鸚鵡!'},
              {id: 'zebra', h: 11, en: 'Medium poop for the zebra!', zh: '中中的便便給斑馬!'},
              {id: 'elephant', h: 17, en: 'Big poop for the elephant!', zh: '大大的便便給大象!'}];
  const homes = [[64, 'parrot', 22], [36, 'zebra', 34], [6, 'elephant', 40]].map(([x, id, hh]) => {
    const wrap = el('div', 'pHome', b); place(wrap, x, 100 - hh - 14);
    const a = animalImg(id, wrap); a.style.height = (b.clientHeight * hh / 100) + 'px';
    const pail = el('div', 'pail', wrap); wrap.dataset.a = id; return wrap;
  });
  const sizes = shuffle([0, 0, 1, 1, 2, 2]);
  const spots = shuffle([[6, 14], [22, 6], [40, 14], [56, 6], [70, 15], [80, 30]]);
  const poops = sizes.map((s, i) => { const p = thing('poop', b, 'poop'); place(p, spots[i][0], spots[i][1]); p.style.fontSize = p.style.height = (b.clientHeight * SZ[s].h / 100) + 'px'; p.dataset.s = s; return p; });
  poops.forEach((p, i) => anim(p, [{transform: 'scale(0)'}, {transform: 'scale(1)'}], {duration: 400, delay: i * 90, easing: 'cubic-bezier(.3,1.6,.6,1)', fill: 'none'}));
  AU.sfx('boing');
  await mprompt('Uh oh! Poop everywhere! Big poop for big animals, tiny poop for tiny animals!', '糟糕!到處都是便便!大大的便便給大動物,小小的便便給小動物!');
  let left = poops.length, sel = null, miss = 0;
  const homeAt = (x, y) => homes.find(h => { const r = h.getBoundingClientRect(); return x > r.left - 20 && x < r.right + 20 && y > r.top - 30 && y < r.bottom + 20; });
  const drop = async (p, h) => {
    const s = +p.dataset.s, want = SZ.findIndex(z => z.id === h.dataset.a);
    try { window.KA && KA.answer({q: 'poop size ' + s, given: want, expected: s, correct: s === want, tryNo: miss + 1, qid: 'poop-' + s, topic: 'sizes'}); } catch (e) {}
    if (s === want) {
      miss = 0; homes.forEach(x => x.classList.remove('glow'));
      const pr = h.querySelector('.pail').getBoundingClientRect(), br = b.getBoundingClientRect();
      p.style.transition = 'left .35s, top .35s, transform .35s'; p.style.left = (pr.left - br.left + pr.width / 2 - p.offsetWidth / 2) + 'px'; p.style.top = (pr.top - br.top - p.offsetHeight * .3) + 'px';
      p.style.pointerEvents = 'none'; AU.sfx('splash'); setTimeout(() => { p.style.transform = 'scale(.4)'; p.style.opacity = '0'; }, 350);
      hop(h.querySelector('.mAn')); starUp(); left--;
      await msay(SZ[s].en, SZ[s].zh);
    } else {
      miss++; AU.sfx('soft'); wobble(h); p.style.transition = 'left .4s, top .4s'; p.style.left = p.home[0]; p.style.top = p.home[1];
      if (miss >= 2) homes.find(x => x.dataset.a === SZ[s].id).classList.add('glow');
      await msay('Hmm, is that poop big, medium, or tiny?', '嗯…這個便便是大大的、中中的,還是小小的?');
    }
  };
  M.solve = () => { const p = poops.find(x => x.style.pointerEvents !== 'none'); if (p) drop(p, homes.find(h => h.dataset.a === SZ[+p.dataset.s].id)); };
  poops.forEach(p => {
    p.home = [p.style.left, p.style.top];
    p.onpointerdown = ev => {
      ev.preventDefault(); ev.stopPropagation(); AU.unlock(); G.poke();
      const br = b.getBoundingClientRect(), ox = ev.clientX - p.getBoundingClientRect().left, oy = ev.clientY - p.getBoundingClientRect().top;
      let moved = false; p.style.transition = 'none'; p.classList.add('drag'); try { p.setPointerCapture(ev.pointerId); } catch (e) {}
      p.onpointermove = e2 => { moved = true; p.style.left = (e2.clientX - br.left - ox) + 'px'; p.style.top = (e2.clientY - br.top - oy) + 'px'; };
      p.onpointerup = e2 => {
        p.onpointermove = p.onpointerup = null; p.classList.remove('drag');
        if (!moved) { if (sel) sel.classList.remove('sel'); sel = p; p.classList.add('sel'); bounce(p); AU.sfx('tap'); return; }
        const h = homeAt(e2.clientX, e2.clientY);
        if (h) drop(p, h); else { p.style.transition = 'left .4s, top .4s'; p.style.left = p.home[0]; p.style.top = p.home[1]; }
      };
    };
  });
  homes.forEach(h => h.onpointerdown = ev => { ev.preventDefault(); ev.stopPropagation(); if (sel) { const p = sel; sel = null; p.classList.remove('sel'); drop(p, h); } else { hop(h.querySelector('.mAn')); AU.say('name_' + h.dataset.a); } });
  while (left > 0) { await wait(300); if (!alive(sid)) return; }
  await wait(600);
  if (!alive(sid)) return;
  await msay('All clean! Thank you, zookeeper!', '都乾淨了!謝謝你!');
  jobDone(sid);
}

/* =========== 4. Zookeeper says: hear a Chinese command, give the right thing to the right animal =========== */
const TOOLS = {
  food:   {pic: 'banana', zh: a => '請餵' + a + '吃東西', en: a => 'Feed the ' + a + '!', ok: ['Yum yum!', '好好吃!']},
  sponge: {pic: 'sponge', zh: a => '請幫' + a + '洗澡', en: a => 'Give the ' + a + ' a bath!', ok: ['Splish splash! So clean!', '洗得好乾淨!']},
  heart:  {pic: 'heart', zh: a => '請抱抱' + a, en: a => 'Give the ' + a + ' a hug!', ok: ['I love you too!', '我也愛你!']},
  pillow: {pic: 'pillow', zh: a => '請讓' + a + '睡覺', en: a => 'Put the ' + a + ' to sleep!', ok: ['Zzz… good night!', '呼呼…晚安!']},
};
async function runKeeper(sid) {
  const {b} = mDims(); M.done = false;
  const ids = shuffle(AN_IDS).slice(0, 3);
  const ans = ids.map((id, i) => { const e = animalImg(id, b, 'kAn'); place(e, 6 + i * 31, 18, id === 'giraffe' ? 46 : 36); return e; });
  const bar = el('div', 'toolBar', b);
  const tools = Object.keys(TOOLS).map(k => { const t = el('button', 'tool', bar); t.dataset.t = k; thing(TOOLS[k].pic, t); return t; });
  let cur = null, selTool = null;
  const waitGive = () => new Promise(d => { cur = d; M.cancel = () => d(null); });
  const give = (tool, an) => { if (tool && an && cur) { const d = cur; cur = null; tools.forEach(x => x.classList.remove('sel')); selTool = null; d([tool.dataset.t, an.dataset.a, tool, an]); } };
  tools.forEach(t => t.onpointerdown = ev => {
    ev.preventDefault(); ev.stopPropagation(); AU.unlock(); G.poke();
    const br = b.getBoundingClientRect(), r0 = t.getBoundingClientRect();
    const ghost = el('div', 'ghost', b); ghost.innerHTML = t.innerHTML; Object.assign(ghost.style, {left: r0.left - br.left + 'px', top: r0.top - br.top + 'px', width: r0.width + 'px', height: r0.height + 'px'});
    let moved = false; try { t.setPointerCapture(ev.pointerId); } catch (e) {}
    t.onpointermove = e2 => { if (Math.abs(e2.clientX - ev.clientX) + Math.abs(e2.clientY - ev.clientY) > 8) moved = true; ghost.style.left = (e2.clientX - br.left - r0.width / 2) + 'px'; ghost.style.top = (e2.clientY - br.top - r0.height / 2) + 'px'; };
    const up = e2 => {
      t.onpointermove = t.onpointerup = t.onpointercancel = null; ghost.remove();
      if (!moved) { tools.forEach(x => x.classList.remove('sel')); selTool = t; t.classList.add('sel'); bounce(t); AU.sfx('tap'); return; }
      const an = ans.find(a => { const r = a.getBoundingClientRect(); return e2.clientX > r.left && e2.clientX < r.right && e2.clientY > r.top && e2.clientY < r.bottom; });
      give(t, an);
    };
    t.onpointerup = up; t.onpointercancel = () => { t.onpointermove = t.onpointerup = t.onpointercancel = null; ghost.remove(); };
  });
  ans.forEach(a => a.onpointerdown = ev => { ev.preventDefault(); ev.stopPropagation(); AU.unlock(); G.poke(); if (selTool) give(selTool, a); else { hop(a); AU.say('name_' + a.dataset.a); } });
  await msay('Zookeeper says! Listen carefully, then drag the right thing to the right animal.', '管理員說!仔細聽,再把東西拖到對的動物身上。');
  let last = '';
  for (let r = 0; r < 5; r++) {
    if (!alive(sid)) return;
    let id, tk; do { id = pick(ids); tk = pick(Object.keys(TOOLS)); } while (id + tk === last); last = id + tk;
    const T = TOOLS[tk], zh = T.zh(AN[id].zh), en = T.en(AN[id].en);
    const speak = async withEn => { cap2(en, zh); await AU.raw(zh, 'zh'); if (withEn && DB.lang !== 'zh' && alive(sid)) await AU.raw(en, 'en'); };
    M.last = null; M.replay = () => speak(false);
    M.solve = () => give(tools.find(x => x.dataset.t === tk), ans.find(x => x.dataset.a === id));
    speak(false);
    let miss = 0, v = await waitGive(), hit = null;
    while (v && alive(sid)) {
      const [t, a, , aEl] = v;
      try { window.KA && KA.answer({q: zh, given: t + ' > ' + a, expected: tk + ' > ' + id, correct: t === tk && a === id, tryNo: miss + 1, qid: 'keeper-' + tk + '-' + id, topic: 'chinese listening'}); } catch (e) {}
      if (t === tk && a === id) { hit = aEl; break; }
      miss++; AU.sfx('soft'); wobble(aEl);
      await msay('Hmm, listen again!', '嗯…再聽一次!'); if (!alive(sid)) return;
      if (miss >= 2) { tools.find(x => x.dataset.t === tk).classList.add('glow'); ans.find(x => x.dataset.a === id).classList.add('glow'); }
      speak(miss >= 2);
      v = await waitGive();
    }
    if (!hit || !alive(sid)) return;
    M.replay = null;
    b.querySelectorAll('.glow').forEach(x => x.classList.remove('glow'));
    await react(tk, hit, b);
    await msay(T.ok[0], T.ok[1]); starUp();
  }
  jobDone(sid);
}
async function react(tk, aEl, b) {
  const r = aEl.getBoundingClientRect(), br = b.getBoundingClientRect(), cx = r.left - br.left + r.width / 2, cy = r.top - br.top + r.height * .35;
  const fx = (cls, txt, n) => { for (let i = 0; i < n; i++) { const e = el('div', 'fxp ' + cls, b, txt); e.style.left = cx + rnd(-r.width * .4, r.width * .4) + 'px'; e.style.top = cy + rnd(-20, r.height * .4) + 'px'; e.style.animationDelay = i * 110 + 'ms'; setTimeout(() => e.remove(), 2200); } };
  if (tk === 'food') { AU.sfx('count'); hop(aEl); setTimeout(() => hop(aEl), 300); fx('crumb', '✨', 4); }
  if (tk === 'sponge') { AU.sfx('splash'); fx('bubble', '', 12); wobble(aEl); }
  if (tk === 'heart') { AU.sfx('sparkle'); fx('heartP', '❤', 7); hop(aEl); }
  if (tk === 'pillow') { AU.sfx('soft'); fx('zzz', 'Z', 3); anim(aEl, [{transform: 'rotate(0)'}, {transform: 'rotate(-8deg)'}, {transform: 'rotate(0)'}], {duration: 1600, fill: 'none'}); }
  await wait(900);
}
