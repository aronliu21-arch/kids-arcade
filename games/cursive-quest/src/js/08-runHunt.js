// ---------- Game C: Treasure hunt ----------
function runHunt(cfg = {}) {
  const s = screen(); Snd.setMusicWanted(false);
  s.append(topbar('Cursive Treasure Hunt 💎', { backLabel: '✕' }));
  const wrap = h('div', { class: 'quiz' }); s.append(wrap);
  const info = h('div', { class: 'prompt', style: 'min-height:0' }); const grid = h('div', { class: 'hunt' }); wrap.append(info, grid);
  const rounds = 3; let round = 0, found = 0, misses = 0, totalT = 0; const missed = new Set(), targets = [];
  const play = () => {
    grid.innerHTML = '';
    const useUpper = capsReady() && S.level.read >= 2 && Math.random() < 0.35;
    const pool = useUpper ? poolFor('upper') : poolFor('lower');
    const t = pickTarget('hunt', pool); targets.push(t);
    const cols = innerWidth < 560 ? 4 : 5, cells = cols * 4, count = 3 + rnd(2);
    const conf = (CONFUSE[t] || '').split('');
    const fillers = []; for (let k = 0; k < cells - count; k++) fillers.push(S.level.read >= 2 && Math.random() < 0.5 && conf.length ? pick(conf) : pick(pool.filter(c => c !== t)));
    const items = shuffle([...Array(count).fill(t), ...fillers]);
    grid.style.setProperty('--cols', cols);
    info.innerHTML = `<div class="q">Find all <b>${count}</b> cursive <span class="printbig" style="font-size:40px">${t}</span>${isUpper(t) ? ' (capital)' : ''} treasures!</div>`;
    Voice.say(`Find all ${count} cursive ${isUpper(t) ? 'capital ' : ''}${t}s!`);
    let got = 0; totalT += count;
    items.forEach((c, k) => {
      const b = h('button', { class: 'hcell', html: cur(c), 'data-k': c, 'aria-label': 'Hidden letter' });
      b.onclick = () => {
        if (b.classList.contains('found')) return;
        if (c === t) { b.classList.add('found'); Snd.play('star'); got++; found++; L(t).right++; track('right'); if (got === count) { round++; Voice.say(pick(PRAISE)); setTimeout(() => round < rounds ? play() : end(), 900); } }
        else { b.classList.add('no'); Snd.play('no'); setTimeout(() => b.classList.remove('no'), 450); misses++; missed.add(t); L(t).wrong++; toast(`That one is “${c}”. Look for “${t}”!`); }
      };
      grid.append(b);
    });
    CUR = { kind: 'hunt', choose: () => { const b = $$('.hcell', grid).find(b => b.dataset.k === t && !b.classList.contains('found')); b && b.click(); } };
  };
  const end = () => { save(); track('game:hunt'); track('game'); const acc = found / (found + misses); finishMission({ title: 'Cursive Treasure Hunt', missionId: cfg.missionId, stars: acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1, correct: found, total: totalT, mastered: targets.filter(c => !missed.has(c) && isMastered(c)), practice: [...missed], extra: `${misses} wrong taps` }); };
  play();
}

// ---------- Game E: Letter builder ----------
function runBuilder(cfg = {}) {
  const s = screen(); Snd.setMusicWanted(false);
  s.append(topbar('Letter Builder 🧩', { backLabel: '✕' }));
  const wrap = h('div', { class: 'quiz' }); s.append(wrap);
  const info = h('div', { class: 'prompt', style: 'min-height:0' }); const slots = h('div', { class: 'builder-slots' }); const tiles = h('div', { class: 'builder-tiles' });
  wrap.append(info, slots, tiles);
  const rounds = 5; let round = 0, perfect = 0; const wrongW = [];
  const play = () => {
    const w = pickTarget('builder', wordCands(3 + wordTier()), () => 1);
    const hidePrint = S.level.read >= 3;
    info.innerHTML = `<div class="emoji">${wordEmoji(w)}</div><div class="q">${hidePrint ? 'Listen and build the word in cursive!' : `Build <b style="font-size:1.4em">${w}</b> in cursive!`}</div>`;
    Voice.say(`Build the word ${w}.`);
    let built = '', miss = 0, missHere = 0;
    const letters = w.split('').map((c, k) => ({ c, k }));
    if (S.level.read >= 2) { const d = letterDistractors(w[0], LOWER, 1)[0]; if (d) letters.push({ c: d, k: -1 }); }
    const render = () => { slots.innerHTML = built ? cur(built) : '<span class="muted">Tap the letters in order ➜</span>'; };
    render(); tiles.innerHTML = '';
    for (const it of shuffle(letters)) {
      const b = h('button', { class: 'btile', html: cur(it.c), 'data-c': it.c });
      b.onclick = () => {
        const need = w[built.length];
        if (it.c === need) { Snd.play('pop'); built += it.c; b.classList.add('used'); render(); missHere = 0; $$('.btile', tiles).forEach(x => x.style.outline = ''); if (built === w) { round++; if (!miss) perfect++; else wrongW.push(w); const st = S.words[w] || (S.words[w] = { right: 0, wrong: 0, traced: 0, written: 0 }); miss ? st.wrong++ : st.right++; Snd.play('ok'); Voice.say(pick(PRAISE) + ' ' + w + '!'); track('right'); setTimeout(() => round < rounds ? play() : end(), 1300); } }
        else { Snd.play('no'); b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 450); miss++; missHere++; if (missHere >= 2) { const g = $$('.btile', tiles).find(x => x.dataset.c === need && !x.classList.contains('used')); if (g) g.style.outline = '4px solid var(--gold)'; toast(`Next is “${need}”`); } }
      };
      tiles.append(b);
    }
    CUR = { kind: 'builder', choose: () => { const need = w[built.length]; const b = $$('.btile', tiles).find(x => x.dataset.c === need && !x.classList.contains('used')); b && b.click(); } };
  };
  const end = () => { save(); track('game:builder'); track('game'); finishMission({ title: 'Letter Builder', missionId: cfg.missionId, stars: perfect >= 5 ? 3 : perfect >= 3 ? 2 : 1, correct: perfect, total: rounds, mastered: [], practice: [], wrongWords: wrongW }); };
  play();
}

// ===== Worlds, lessons, map, rewards, parent dashboard =====
const WORLDS = [
  { n: 1, name: 'Meet the Cursive Letters', ico: '🔤', desc: 'Learn all 26 lowercase letters' },
  { n: 2, name: 'Capital Letter Kingdom', ico: '👑', desc: 'Learn all 26 capital letters' },
  { n: 3, name: 'Connect the Letters', ico: '🔗', desc: 'Make letters hold hands' },
  { n: 4, name: 'Word Wizard', ico: '🪄', desc: 'Read and write real words' },
  { n: 5, name: 'Sentence Adventure', ico: '📜', desc: 'Write whole sentences' },
  { n: 6, name: 'Cursive Master Challenge', ico: '🏆', desc: 'Mixed and timed challenges' },
];
const lessonStars = id => S.lessons[id] || 0;
const worldUnlocked = n => n === 1 || !!S.gates[n - 1] || S.settings.unlockAll;

function worldLessons(n) {
  const out = [];
  if (n === 1) for (const g of LOWER_GROUPS) {
    for (const c of g.letters) out.push({ id: 'L:' + c, group: g, label: `${c}`, svg: cur(c), run: () => runLetterLesson(c, 'L:' + c) });
    out.push({ id: 'Q1:' + g.id, group: g, label: 'Letter Quiz', emo: '❓', run: () => runQuiz({ title: g.name + ' Quiz', types: ['recLower', 'printToCursive', 'sound', 'wrongOne', 'writeMemory'], n: 8, missionId: 'Q1:' + g.id, ctx: { lower: groupPool(g.letters, TEACH_LOWER), mixCase: false } }) });
  }
  if (n === 2) for (const g of UPPER_GROUPS) {
    for (const c of g.letters) out.push({ id: 'U:' + c, group: g, label: c, svg: cur(c), run: () => runLetterLesson(c, 'U:' + c) });
    out.push({ id: 'M2:' + g.id, group: g, label: 'Match Pairs', emo: '🧦', run: () => runMatch({ title: 'Capital Partners', mode: 'case', letters: g.letters.toLowerCase().split(''), pairs: 5, rounds: g.letters.length > 6 ? 2 : 1, missionId: 'M2:' + g.id }) });
    out.push({ id: 'Q2:' + g.id, group: g, label: 'Capitals Quiz', emo: '❓', run: () => runQuiz({ title: g.name + ' Quiz', types: ['recUpper', 'pairCase', 'printToCursive'], n: 8, missionId: 'Q2:' + g.id, ctx: { upper: groupPool(g.letters, TEACH_UPPER), lower: poolFor('lower'), mixCase: true } }) });
  }
  if (n === 3) {
    const g = { name: 'Joining Lessons', ico: '🔗' };
    for (const j of JOIN_LESSONS) out.push({ id: 'J:' + j.id, group: g, label: j.name, emo: j.ico, run: () => runJoinLesson(j) });
    const g2 = { name: 'Joining Games', ico: '🎲' };
    out.push({ id: 'Q3', group: g2, label: 'Joined Letters Quiz', emo: '❓', run: () => runQuiz({ title: 'Joined Letters Quiz', types: ['connected'], n: 8, missionId: 'Q3' }) });
    out.push({ id: 'B3', group: g2, label: 'Letter Builder', emo: '🧩', run: () => runBuilder({ missionId: 'B3' }) });
  }
  if (n === 4) {
    const g = { name: 'Word Categories', ico: '🪄' };
    for (const k in WORDS) out.push({ id: 'W:' + k, group: g, label: WORDS[k].name, emo: WORDS[k].ico, run: () => runWordLesson(k) });
    const g2 = { name: 'Word Games', ico: '🎲' };
    out.push({ id: 'Q4', group: g2, label: 'Find the Word', emo: '🔎', run: () => runQuiz({ title: 'Find the Cursive Word', types: ['wordToCursive', 'readWord'], n: 8, missionId: 'Q4' }) });
    out.push({ id: 'D4', group: g2, label: 'Word Decoder', emo: '🗝️', run: () => runQuiz({ title: 'Word Decoder', types: ['readWord'], n: 8, missionId: 'D4', gameId: 'decoder' }) });
  }
  if (n === 5) {
    const g = { name: 'Sentence Trails', ico: '📜' };
    SENTENCE_SETS.forEach((set, k) => out.push({ id: 'S:' + k, group: g, label: set[0], emo: ['🏃‍♀️', '🐱', '☀️', '⚽', '🍲', '⭐', '🐸', '🦓'][k], run: () => runSentenceLesson(k) }));
  }
  if (n === 6) {
    const g = { name: 'Master Challenges', ico: '🏆' };
    out.push({ id: 'X:mixed', group: g, label: 'Mixed Quiz', emo: '🎲', run: () => runQuiz({ title: 'Mixed Master Quiz', types: Object.keys(GEN).filter(t => t !== 'writeMemory'), n: 10, missionId: 'X:mixed' }) });
    out.push({ id: 'X:timed', group: g, label: 'Timed Challenge', emo: '⏱️', run: () => runQuiz({ title: 'Timed Challenge', types: ['recLower', 'recUpper', 'connected', 'readWord'], timed: 60, speed: true, missionId: 'X:timed', gameId: 'speed' }) });
    out.push({ id: 'X:review', group: g, label: 'Tricky Letters', emo: '🩹', run: () => runReview('X:review') });
    out.push({ id: 'X:memory', group: g, label: 'Write from Memory', emo: '🧠', run: () => runQuiz({ title: 'Write from Memory', types: ['writeMemory'], n: 5, missionId: 'X:memory' }) });
    out.push({ id: 'X:super', group: g, label: 'Superstar Challenge', emo: '🌟', run: () => runQuiz({ title: 'Superstar Challenge', types: ['recLower', 'recUpper', 'pairCase', 'wrongOne', 'readWord', 'wordToCursive', 'connected', 'sound', 'writeMemory'], n: 15, missionId: 'X:super', gameId: 'superstar' }) });
  }
  return out;
}
function groupPool(letters, order) { const p = letters.split(''); for (const c of order) { if (p.length >= 6) break; if (!p.includes(c) && S.letters[c] && S.letters[c].intro) p.push(c); } for (const c of order) { if (p.length >= 4) break; if (!p.includes(c)) p.push(c); } return p; }
function worldProgress(n) { const ls = worldLessons(n); const done = ls.filter(l => lessonStars(l.id) > 0).length; return { done, total: ls.length, pct: done / ls.length }; }
function gateReady(n) { return n < 6 && (worldProgress(n).pct >= 0.5 || S.settings.unlockAll); }

// ---------- Generic pad-lesson runner ----------
/* items: [{text, print, emoji, tip, steps:[...], kind, joins}] */
function runSteps(cfg) {
  const s = screen(); Snd.setMusicWanted(false);
  s.append(topbar(cfg.title, { backLabel: '✕', onBack: cfg.onBack || (() => cfg.world ? openWorld(cfg.world) : goMap()) }));
  const flat = []; cfg.items.forEach((it, ii) => it.steps.forEach(st => flat.push({ it, ii, st })));
  const lay = h('div', { class: 'lesson' }); s.append(lay);
  const info = h('div', { class: 'info' }); const right = h('div', { class: 'pad-col' });
  lay.append(info, right);
  let k = 0, pad = null, padText = null; const scores = [], perItem = {};
  const stepName = { watch: '👀 Watch', trace: '✏️ Trace', faded: '🪄 Trace', write: '✍️ Write', mcq: '🔎 Find' };
  const renderInfo = (it, ii) => {
    info.innerHTML = '';
    const big = it.text.length > 8 ? 'height:auto;width:100%' : '';
    const show = h('div', { class: 'letter-show' });
    show.innerHTML = `<div style="flex:1;text-align:center">${cursiveSVG(it.text, { unit: 40, lines: true, fullLines: true, style: big })}<div class="lab">cursive</div></div>` +
      (it.print ? `<div style="text-align:center"><div class="print" style="${it.print.length > 3 ? 'font-size:28px' : ''}">${escapeHTML(it.print)}</div><div class="lab">print</div></div>` : '') +
      (it.emoji ? `<div style="font-size:52px">${it.emoji}</div>` : '') + (it.partner ? `<div style="text-align:center">${cursiveSVG(it.partner, { unit: 34, lines: true, fullLines: true, style: 'height:96px' })}<div class="lab">partner</div></div>` : '');
    if (it.hideModel) show.innerHTML = `<div style="text-align:center;flex:1"><div class="print" style="font-size:${it.print.length > 12 ? 26 : 36}px">${escapeHTML(it.print)}</div><div class="lab">write this in cursive</div></div>` + (it.emoji ? `<div style="font-size:52px">${it.emoji}</div>` : '');
    info.append(show);
    const steps = h('div', { class: 'steps' });
    flat.forEach((f, j) => { if (f.ii === ii) steps.append(h('span', { class: j < k ? 'done' : j === k ? 'cur' : '' }, stepName[f.st])); });
    info.append(h('div', { class: 'muted', style: 'font-size:15px;font-weight:600' }, cfg.items.length > 1 ? `Part ${ii + 1} of ${cfg.items.length}` : ''), steps);
    if (it.tip) info.append(h('div', { class: 'tipbox', html: it.tip }));
    const cmp = h('div', { class: 'row', style: 'gap:8px;align-items:center' }, h('div', { style: 'width:70px;height:70px', html: companionSVG(S.companion, S.acc) }), h('div', { class: 'muted', style: 'flex:1;font-size:16px', id: 'cheer' }, `${companionName()} is cheering for you!`));
    info.append(cmp);
  };
  const cheer = t => { const c = $('#cheer'); if (c) c.textContent = t; };
  const go = async () => {
    if (k >= flat.length) return complete();
    const { it, ii, st } = flat[k];
    renderInfo(it, ii);
    if (st === 'mcq') { if (pad) { pad.destroy(); pad = null; padText = null; } right.innerHTML = ''; return runMcqStep(it); }
    if (!pad || padText !== it.text) { if (pad) pad.destroy(); right.innerHTML = ''; pad = new Pad(right, { text: it.text, mode: 'trace', joins: it.joins }); pad.wrap.style.flex = '1'; padText = it.text; }
    pad.clear(); pad.tools.innerHTML = '';
    const tb = (label, cls, fn) => { const b = h('button', { class: 'btn ' + cls }, label); b.onclick = () => { Snd.play('tap'); fn(); }; pad.tools.append(b); return b; };
    if (st === 'watch') {
      pad.setMode('trace', 'Watch me write it!');
      tb('▶ Watch again', 'ghost', () => pad.demo());
      tb('I\'m ready ➜', 'mint', () => { pad.stopDemo(); k++; go(); });
      const intro = it.watchSay || it.tipSay || '';
      Voice.say(intro); await sleep(350); pad.demo(it.text.length > 6 ? 3.6 : 2.4);
      CUR = { kind: 'watch', choose: () => { pad.stopDemo(); k++; go(); } };
      return;
    }
    const mode = st === 'write' ? 'write' : st;
    const label = st === 'trace' ? 'Trace it — follow the arrows!' : st === 'faded' ? 'Trace with only the start dot!' : 'Write it on your own!';
    pad.setMode(mode, label);
    Voice.say(st === 'trace' ? `Your turn, Nora! Start at the green dot and follow the arrows.` : st === 'faded' ? 'Now trace it with just a little help.' : (it.hideModel ? `Now write it all by yourself: ${it.print}` : 'Now write it by yourself on the lines!'));
    let attempts = 0;
    tb('🧽 Erase', 'ghost', () => pad.clear());
    if (st !== 'write') tb('▶ Show me', 'sky', () => pad.demo());
    tb('✓ Done', 'mint', () => {
      if (!pad.hasInk()) { toast('Write with your finger first ✏️'); return; }
      attempts++;
      const r = pad.score();
      if (st === 'write') { pad.showModelOverlay = true; pad.draw(); }
      const headline = r.empty ? 'Let\'s try again!' : ['Let\'s try again!', 'Nice try!', 'Great job!', 'Perfect! ✨'][r.stars];
      Snd.play(r.stars >= 2 ? 'ok' : r.stars === 1 ? 'pop' : 'no');
      if (r.stars === 3) Snd.play('star');
      const el = h('div', {});
      el.append(h('div', { class: 'stars' }, '★'.repeat(r.stars) + '☆'.repeat(3 - r.stars)), h('h2', {}, headline));
      if (!r.empty) {
        const ch = h('div', { class: 'checks' });
        const add = (ok, a) => { if (ok === null || ok === undefined) return; ch.append(h('div', {}, ok ? '✅' : '🔸', a)); };
        add(r.checks.shape, 'Letter shape'); add(r.checks.direction, 'Stroke direction');
        if (st === 'write') { add(r.checks.size, 'Size'); add(r.checks.position, 'On the lines'); add(r.checks.recog, 'Easy to read'); }
        el.append(ch);
      }
      const tips = r.tips.slice(0, 2); if (st === 'write' && !r.empty) tips.push('The green dashes show the model, so you can compare.');
      if (tips.length) el.append(h('div', { class: 'fb-tips' }, tips.join(' ')));
      const row = h('div', { class: 'row', style: 'justify-content:center;margin-top:10px' });
      const again = h('button', { class: 'btn ' + (r.stars >= 1 ? 'ghost' : '') }, '↺ Try again');
      again.onclick = () => { Snd.play('tap'); pad.clear(); };
      const nxt = h('button', { class: 'btn ' + (r.stars >= 1 ? 'mint' : 'ghost') }, 'Next ➜');
      nxt.onclick = () => { Snd.play('tap'); record(it, st, r); k++; pad.hideFeedback(); go(); };
      row.append(again); if (r.stars >= 1 || attempts >= 2) row.append(nxt);
      el.append(row); pad.showFeedback(el);
      Voice.say(headline.replace('✨', '') + ' ' + (r.stars >= 2 ? pick(['Look at how beautifully you wrote that!', 'Your letters are flowing so nicely!', 'Wow, Nora!']) : (tips[0] || '')));
      cheer(r.stars >= 2 ? pick(['Wow! 🌟', 'You\'re a natural! ✨', 'So smooth! 💜']) : 'You can do it! 💪');
      CUR.feedback = { ok: r.stars >= 1, next: () => nxt.click() };
    });
    CUR = { kind: 'pad', pad, choose: () => { pad.autoInk(0.01); $$('.btn.mint', pad.tools).pop().click(); setTimeout(() => CUR && CUR.feedback && CUR.feedback.next(), 50); } };
  };
  const record = (it, st, r) => {
    scores.push(r.stars); (perItem[it.text] = perItem[it.text] || []).push(r.stars);
    S.counts.practice++;
    if (it.kind === 'letter') { const l = L(it.text); l.intro = true; l.practiced++; if (st === 'write') l.write = Math.max(l.write, r.stars); else l.trace = Math.max(l.trace, r.stars); }
    if (it.kind === 'word' || it.kind === 'join') { const w = S.words[it.text] || (S.words[it.text] = { right: 0, wrong: 0, traced: 0, written: 0 }); st === 'write' ? w.written++ : w.traced++; if (st === 'write' && it.kind === 'word') track('word'); }
    if (it.kind === 'sentence') { const w = S.sentences[it.text] || (S.sentences[it.text] = { traced: 0, written: 0, best: 0 }); st === 'write' ? w.written++ : w.traced++; w.best = Math.max(w.best, r.stars); if (st === 'write') track('word'); }
    if (st === 'write') { S.counts.writes++; track('write'); if (r.stars === 3) S.counts.perfect++; } else { S.counts.traces++; track('trace'); }
    if (it.review) track('review');
    save();
  };
  const runMcqStep = (it) => {
    const qq = GEN.wordToCursive({ word: it.text });
    const box = h('div', { class: 'quiz' }); right.append(box);
    const prompt = h('div', { class: 'prompt', html: `<div class="q">${escapeHTML(qq.q)}</div>${qq.prompt}` });
    const opts = h('div', { class: 'opts', style: 'grid-template-columns:repeat(auto-fit,minmax(200px,1fr))' });
    const reveal = h('div', { class: 'reveal' }); const nb = h('button', { class: 'btn big', style: 'display:none' }, 'Next ➜');
    box.append(prompt, opts, reveal, nb);
    Voice.say(qq.say); let tries = 0, locked = false;
    const fin = ok => { locked = true; const w = S.words[it.text] || (S.words[it.text] = { right: 0, wrong: 0, traced: 0, written: 0 }); ok ? w.right++ : w.wrong++; scores.push(ok ? (tries === 0 ? 3 : 2) : 1); if (ok) track('right'); save(); };
    for (const o of qq.options) {
      const b = h('button', { class: 'opt', 'data-key': o.key, html: o.html });
      b.onclick = () => {
        if (locked) return;
        try{window.KA && KA.answer({ q: 'word: ' + (it.text || qq.answer), qid: 'word:' + (it.text || qq.answer), given: o.key, expected: qq.answer, correct: o.key === qq.answer, tryNo: tries + 1, topic: 'cursive words' });}catch(e){}
        if (o.key === qq.answer) { b.classList.add('ok'); Snd.play('ok'); Voice.say(pick(PRAISE)); fin(true); setTimeout(() => { k++; go(); }, 1000); }
        else { b.classList.add('no'); Snd.play('no'); tries++; if (tries < 2) { Voice.say(pick(RETRY)); setTimeout(() => b.classList.add('dim'), 400); } else { fin(false); $$('.opt', opts).forEach(x => x.dataset.key === qq.answer ? x.classList.add('ok') : x.classList.add('dim')); reveal.append(h('div', {}, h('b', {}, 'Here it is! '), qq.explain)); reveal.classList.add('on'); nb.style.display = ''; Voice.say('Here it is. ' + qq.explain); } }
      };
      opts.append(b);
    }
    nb.onclick = () => { k++; go(); };
    CUR = { kind: 'mcq', choose: () => $$('.opt', opts).find(b => b.dataset.key === qq.answer).click() };
  };
  const complete = () => {
    if (pad) pad.destroy();
    const sc = scores.filter(x => x != null);
    const avg = sc.length ? sc.reduce((a, b) => a + b, 0) / sc.length : 1;
    const stars = Math.max(1, Math.round(avg));
    if (cfg.onComplete) cfg.onComplete(scores);
    finishMission({ title: cfg.title, missionId: cfg.missionId, stars, correct: sc.filter(x => x >= 1).length, total: sc.length, mastered: cfg.letters ? cfg.letters.filter(isMastered) : [], practice: cfg.letters ? cfg.letters.filter(c => perItem[c] && perItem[c].reduce((x, y) => x + y, 0) / perItem[c].length < 2) : [], kind: 'lesson', gate: cfg.gate, scores });
  };
  CUR = null; go();
}

