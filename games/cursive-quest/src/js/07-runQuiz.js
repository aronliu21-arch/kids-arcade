// ---------- Quiz runner ----------
/* cfg: {title, types, n, ctx, timed (sec), speed (bool), missionId, gameId, onEnd} */
function runQuiz(cfg) {
  const s = screen('quizscreen');
  Snd.setMusicWanted(false);
  const ctx = Object.assign({ lower: poolFor('lower'), upper: poolFor('upper'), mixCase: true }, cfg.ctx || {});
  s.append(topbar(cfg.title, { onBack: cfg.onBack || goMap, backLabel: '✕' }));
  const q = h('div', { class: 'quiz' }); s.append(q);
  const head = h('div', { class: 'qhead' }); const dots = h('div', { class: 'dots' }); const timer = h('div', { class: 'timer' }, h('i', { style: 'width:100%' }));
  head.append(cfg.timed ? timer : dots); q.append(head);
  const prompt = h('div', { class: 'prompt' }); const opts = h('div', { class: 'opts' }); const reveal = h('div', { class: 'reveal' });
  const nextBtn = h('button', { class: 'btn big', style: 'display:none' }, 'Next ➜');
  q.append(prompt, opts, reveal, nextBtn);
  const results = []; let i = 0, points = 0, maxPoints = 0, ended = false, tLeft = cfg.timed || 0, tid = null;
  const total = cfg.timed ? Infinity : cfg.n;
  if (!cfg.timed) for (let k = 0; k < cfg.n; k++) dots.append(h('i'));
  const recordLetter = (qq, ok) => {
    for (const c of qq.letters) { const l = L(c); if (ok) l.right++; else { l.wrong++; if (!S.recentMiss.includes(c)) S.recentMiss.push(c); if (S.recentMiss.length > 12) S.recentMiss.shift(); } l.last = Date.now(); if (ok && S.recentMiss.includes(c) && isMastered(c)) { S.recentMiss = S.recentMiss.filter(x => x !== c); S.counts.comeback = (S.counts.comeback || 0) + 1; } }
    if (qq.word) { const w = S.words[qq.word] || (S.words[qq.word] = { right: 0, wrong: 0, traced: 0, written: 0 }); ok ? w.right++ : w.wrong++; }
    if (ok) track('right');
  };
  const finish = () => {
    if (ended) return; ended = true; clearInterval(tid);
    const correct = results.filter(r => r.pts > 0).length;
    const n = results.length;
    const pct = cfg.speed ? Math.min(1, correct / 12) : (maxPoints ? points / maxPoints : 0);
    if (!cfg.speed && n >= 5) { if (pct >= 0.85 && S.level.read < 3) S.level.read++; else if (pct < 0.55 && S.level.read > 1) S.level.read--; }
    if (!cfg.speed && n >= 5) { if (pct >= 0.85 && S.level.words < 3) S.level.words++; else if (pct < 0.5 && S.level.words > 1) S.level.words--; }
    S.quizHist.push({ d: Date.now(), title: cfg.title, right: correct, n, pct: Math.round(pct * 100) }); if (S.quizHist.length > 60) S.quizHist.shift();
    S.counts.quizzes++;
    if (cfg.speed) S.counts.speedBest = Math.max(S.counts.speedBest || 0, correct);
    const letters = [...new Set(results.flatMap(r => r.q.letters))];
    const missed = [...new Set(results.filter(r => r.pts < 2).flatMap(r => r.q.letters.length ? r.q.letters : [r.q.target]))];
    const mastered = letters.filter(c => isMastered(c) && !missed.includes(c));
    const stars = Math.max(1, pct >= 0.9 ? 3 : pct >= 0.65 ? 2 : 1);
    if (cfg.gameId === 'detective' && correct === n && n >= 8) S.counts.detectivePerfect = 1;
    if (cfg.gameId === 'superstar' && pct >= 0.8) S.counts.superstar = 1;
    if (cfg.gameId) track('game:' + cfg.gameId); if (cfg.gameId) track('game');
    finishMission({ title: cfg.title, missionId: cfg.missionId, stars, correct, total: n, points, maxPoints, mastered, practice: missed, speed: cfg.speed, wrongWords: results.filter(r => r.pts < 2 && r.q.word).map(r => r.q.word) });
  };
  const next = () => {
    if (ended) return;
    if (i >= total) return finish();
    reveal.classList.remove('on'); reveal.innerHTML = ''; nextBtn.style.display = 'none';
    const type = pick(cfg.types);
    let qq; try { qq = GEN[type](ctx); } catch (e) { console.warn(e); qq = GEN.recLower(ctx); }
    qq.type = type; qq.tries = 0;
    $$('i', dots).forEach((d, k) => d.classList.toggle('cur', k === i));
    prompt.innerHTML = ''; opts.innerHTML = '';
    if (qq.write) return askWrite(qq);
    prompt.innerHTML = `<div class="q">${escapeHTML(qq.q)}</div>${qq.prompt}`;
    if (qq.wide) opts.style.gridTemplateColumns = 'repeat(auto-fit,minmax(220px,1fr))'; else opts.style.gridTemplateColumns = '';
    Voice.say(qq.say);
    let locked = false;
    const done = (pts) => {
      locked = true; results.push({ q: qq, pts }); points += pts; maxPoints += 2;
      const dot = $$('i', dots)[i]; if (dot) dot.classList.add(pts === 2 ? 'ok' : pts === 1 ? 'half' : 'no');
      recordLetter(qq, pts > 0); save(); i++;
    };
    const choose = (key, btn) => {
      if (locked) return;
      try{window.KA && KA.answer({ q: 'read cursive: ' + qq.answer, qid: 'read:' + qq.answer, given: key, expected: qq.answer, correct: key === qq.answer, tryNo: (qq.tries || 0) + 1, topic: 'reading cursive' });}catch(e){}
      if (key === qq.answer) {
        btn.classList.add('ok'); Snd.play('ok'); const pts = cfg.speed ? 2 : (qq.tries === 0 ? 2 : 1);
        done(pts); if (!cfg.speed) Voice.say(pick(PRAISE)); setTimeout(next, cfg.speed ? 350 : 1000);
      } else {
        btn.classList.add('no'); Snd.play('no'); qq.tries++;
        if (cfg.speed) { done(0); $$('.opt', opts).forEach(b => { if (b.dataset.key === qq.answer) b.classList.add('ok'); }); setTimeout(next, 700); return; }
        if (qq.tries < 2) { Voice.say(pick(RETRY)); setTimeout(() => btn.classList.add('dim'), 400); return; }
        // second miss: reveal the answer with a short reason and a demo
        done(0);
        $$('.opt', opts).forEach(b => { if (b.dataset.key === qq.answer) b.classList.add('ok'); else b.classList.add('dim'); });
        reveal.innerHTML = '';
        reveal.append(demoBox(qq.demo, qq.joins), h('div', { class: 'grow', style: 'min-width:200px' }, h('b', {}, 'Here\'s the answer! '), qq.explain));
        reveal.classList.add('on'); nextBtn.style.display = ''; Voice.say(`Here's the answer. ${qq.explain}`);
      }
    };
    for (const o of qq.options) { const b = h('button', { class: 'opt', 'data-key': o.key, html: o.html, 'aria-label': 'Answer option', onclick: () => choose(o.key, b) }); opts.append(b); }
    CUR = { kind: 'mcq', answer: qq.answer, choose: () => { const b = $$('.opt', opts).find(b => b.dataset.key === qq.answer); if (b) choose(qq.answer, b); }, next: () => nextBtn.style.display !== 'none' && nextBtn.click(), cleanup: () => clearInterval(tid) };
  };
  const askWrite = (qq) => {
    prompt.innerHTML = `<div class="q">✍️ ${escapeHTML(qq.q)}</div>`;
    const host = h('div', { style: 'width:100%;height:min(46vh,380px);display:flex' });
    prompt.append(host); prompt.style.padding = '10px';
    const pad = new Pad(host, { text: qq.answer, mode: 'write' }); pad.wrap.style.flex = '1';
    Voice.say(qq.say);
    let locked = false;
    const doneBtn = h('button', { class: 'btn mint' }, '✓ Done'); const eraseBtn = h('button', { class: 'btn ghost' }, '🧽 Erase');
    pad.tools.append(eraseBtn, doneBtn);
    eraseBtn.onclick = () => { Snd.play('tap'); pad.clear(); };
    const finishQ = pts => { locked = true; results.push({ q: qq, pts }); points += pts; maxPoints += 2; const dot = $$('i', dots)[i]; if (dot) dot.classList.add(pts === 2 ? 'ok' : pts === 1 ? 'half' : 'no'); recordLetter(qq, pts > 0); const l = L(qq.answer); l.write = Math.max(l.write, pts === 2 ? 2 : pts); S.counts.writes++; track('write'); save(); i++; };
    doneBtn.onclick = () => {
      if (locked) return;
      if (!pad.hasInk()) { toast('Write the letter first ✏️'); return; }
      const r = pad.score(); qq.tries++;
      const ok = r.stars >= 1 && r.checks.recog !== false;
      try{window.KA && KA.answer({ q: 'write in cursive: ' + qq.answer, qid: 'write:' + qq.answer, given: ok ? qq.answer : '(not readable yet)', expected: qq.answer, correct: ok, tryNo: qq.tries, topic: 'writing cursive' });}catch(e){}
      if (ok) { Snd.play('ok'); pad.showModelOverlay = true; pad.draw(); finishQ(qq.tries === 1 ? 2 : 1); Voice.say(pick(PRAISE) + ' I can read your ' + qq.answer + '!'); toast('✅ ' + pick(PRAISE) + ' Green dashes show the model.'); setTimeout(next, 1700); return; }
      Snd.play('no');
      if (qq.tries < 2) { const tip = r.tips[0] || 'Try once more!'; toast(tip, 3000); Voice.say('Almost! ' + tip); setTimeout(() => pad.clear(), 900); return; }
      finishQ(0); pad.setMode('trace', 'Watch how it goes'); pad.clear(); pad.demo(2.4);
      reveal.innerHTML = ''; reveal.append(h('div', {}, h('b', {}, 'Let\'s watch it together! '), qq.explain)); reveal.classList.add('on'); nextBtn.style.display = ''; Voice.say('Let\'s watch it together. ' + qq.explain);
    };
    CUR = { kind: 'write', answer: qq.answer, pad, choose: () => { pad.autoInk(0.02); doneBtn.click(); }, next: () => nextBtn.style.display !== 'none' && nextBtn.click(), cleanup: () => { clearInterval(tid); pad.destroy(); } };
  };
  nextBtn.onclick = () => { Snd.play('tap'); next(); };
  if (cfg.timed) {
    tid = setInterval(() => { tLeft -= 0.25; $('i', timer).style.width = Math.max(0, tLeft / cfg.timed * 100) + '%'; if (tLeft <= 0) finish(); }, 250);
    Voice.say('Ready? Go!');
  }
  next();
}

// ---------- Game B: Match the letters ----------
function runMatch(cfg) {
  const s = screen(); Snd.setMusicWanted(false);
  s.append(topbar(cfg.title || 'Match the Letters', { backLabel: '✕', onBack: cfg.onBack }));
  const wrap = h('div', { class: 'quiz' }); s.append(wrap);
  const info = h('div', { class: 'prompt', style: 'min-height:0' }); wrap.append(info);
  const board = h('div', { class: 'match-board' }); wrap.append(board);
  let round = 0, firstTry = 0, pairsTotal = 0; const rounds = cfg.rounds || 2; const missed = new Set(), used = new Set();
  const play = () => {
    board.innerHTML = '';
    const mode = cfg.mode || (S.level.read >= 3 && capsReady() && Math.random() < 0.5 ? 'mixed' : 'print');
    let pool = cfg.letters ? cfg.letters.slice() : poolFor('lower');
    let picks = shuffle(pool.filter(c => !used.has(c))); if (picks.length < 4) picks = shuffle(pool);
    picks = picks.slice(0, Math.min(cfg.pairs || 5, picks.length)); picks.forEach(c => used.add(c));
    const leftLabel = cfg.mode === 'case' ? 'Capitals' : 'Print', rightLabel = cfg.mode === 'case' ? 'lowercase' : 'Cursive';
    info.innerHTML = `<div class="q">${cfg.mode === 'case' ? 'Match each cursive capital with its lowercase partner!' : 'Tap a print letter, then its cursive twin!'}</div>`;
    Voice.say(cfg.mode === 'case' ? 'Match each cursive capital with its lowercase partner.' : 'Tap a print letter, then find its cursive twin.');
    const left = h('div', { class: 'match-col' }, h('div', { class: 'center muted' }, leftLabel)), right = h('div', { class: 'match-col' }, h('div', { class: 'center muted' }, rightLabel));
    let sel = null, matched = 0; const tries = {};
    const L1 = shuffle(picks), R1 = shuffle(picks);
    for (const c of L1) { const b = h('button', { class: 'mcard', 'data-k': c, html: cfg.mode === 'case' ? cur(c.toUpperCase()) : pr(c) }); b.onclick = () => { if (b.classList.contains('ok')) return; Snd.play('tap'); $$('.mcard', left).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = c; }; left.append(b); }
    for (const c of R1) {
      const b = h('button', { class: 'mcard', 'data-k': c, html: cur(cfg.mode === 'case' ? c.toLowerCase() : c) });
      b.onclick = () => {
        if (b.classList.contains('ok')) return;
        if (!sel) { toast(`First tap a ${leftLabel.toLowerCase()} letter on the left`); return; }
        if (sel === c) {
          Snd.play('ok'); b.classList.add('ok'); const lb = $(`.mcard[data-k="${c}"]`, left); lb.classList.add('ok'); lb.classList.remove('sel');
          if (!tries[c]) firstTry++; pairsTotal++; matched++; const l = L(c); l.right++; sel = null; track('right');
          if (matched === picks.length) { round++; Voice.say(pick(PRAISE)); setTimeout(() => round < rounds ? play() : end(), 900); }
        } else {
          Snd.play('no'); b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 450);
          tries[sel] = (tries[sel] || 0) + 1; missed.add(sel); L(sel).wrong++;
          if (tries[sel] >= 2) { const good = $(`.mcard[data-k="${sel}"]`, right); good.classList.add('sel'); toast('Here is the twin — tap it!'); }
        }
      };
      right.append(b);
    }
    board.append(left, right);
    CUR = { kind: 'match', choose: () => { const lb = $$('.mcard', left).find(b => !b.classList.contains('ok') && b.dataset.k); if (!lb) return; lb.click(); $(`.mcard[data-k="${lb.dataset.k}"]`, right).click(); } };
  };
  const end = () => {
    const pct = firstTry / pairsTotal; save(); track('game:match'); track('game');
    finishMission({ title: cfg.title || 'Match the Letters', missionId: cfg.missionId, stars: pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1, correct: firstTry, total: pairsTotal, mastered: [...used].filter(c => !missed.has(c) && isMastered(c)), practice: [...missed] });
  };
  play();
}

