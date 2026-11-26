function cheers() { return [`Hi Nora! Ready for a cursive adventure?`, `You have ⭐ ${S.stars} stars. Let's earn more!`, `Every letter you write makes you stronger!`, `I love watching you write, Nora!`, `Let's go explore World ${Math.max(...WORLDS.filter(w => worldUnlocked(w.n)).map(w => w.n))}!`]; }

function openWorld(n) {
  const w = WORLDS[n - 1];
  const s = screen('', false); Snd.setMusicWanted(true);
  s.append(topbar(`${w.ico} World ${n}: ${w.name}`));
  const ls = worldLessons(n); const sugId = (ls.find(l => !lessonStars(l.id)) || {}).id;
  const groups = []; for (const l of ls) { let g = groups.find(g => g.g === l.group); if (!g) groups.push(g = { g: l.group, ls: [] }); g.ls.push(l); }
  const wrap = h('div', { class: 'lesson-groups' }); s.append(wrap);
  if (n === 2) wrap.append(h('div', { class: 'tipbox' }, '👑 Capital letters are tall — they reach the top line. Some look a lot like their lowercase partner (like C and c), and some look totally different (like Q, which looks like a 2!).'));
  if (n === 3) wrap.append(h('div', { class: 'tipbox' }, '🔗 In cursive, letters hold hands! Watch for the gold joining stroke.'));
  if (n === 5) wrap.append(h('div', { class: 'tipbox' }, '📜 A sentence starts with a capital letter, has finger spaces between words, and ends with a period or !'));
  for (const g of groups) {
    const sec = h('div', { class: 'lgroup card' }, h('h3', {}, g.g.ico + ' ' + g.g.name));
    const tiles = h('div', { class: 'tiles' });
    for (const l of g.ls) {
      const st = lessonStars(l.id);
      const t = h('button', { class: 'tile' + (st ? ' done' : '') + (l.id === sugId ? ' suggest' : '') + (!l.svg ? ' wide' : ''), 'data-lesson': l.id, onclick: () => { Snd.play('tap'); l.run(); } });
      if (l.svg) t.innerHTML = l.svg; else t.append(h('div', { class: 'emo' }, l.emo));
      t.append(h('div', { class: 'tl' }, l.svg ? '' : l.label), h('div', { class: 'ts' }, st ? '★'.repeat(st) : ''));
      tiles.append(t);
    }
    sec.append(tiles); wrap.append(sec);
  }
  if (n < 6) {
    const ready = gateReady(n), open = worldUnlocked(n + 1);
    const gc = h('div', { class: 'card gate-card' }, h('div', { style: 'font-size:52px' }, open ? '🔓' : '🔑'),
      h('div', { class: 'grow' }, h('h3', {}, `Write to Unlock World ${n + 1}`), h('div', {}, open ? `World ${n + 1} is open! You can still play the gate for practice.` : ready ? 'You\'re ready! Write a few on your own to open the gate.' : `Finish ${Math.ceil(worldProgress(n).total / 2) - worldProgress(n).done} more lessons here first.`)),
      h('button', { class: 'btn gold', disabled: !ready && !open, onclick: () => runGate(n) }, open ? 'Practice' : 'Try it!'));
    wrap.append(gc);
  }
  Voice.say(`World ${n}. ${w.name}!`);
}

// ---------- Rewards room ----------
function openRewards(tab = 'friends') {
  const s = screen('', false); Snd.setMusicWanted(true);
  s.append(topbar('🎒 Rewards Room'));
  const tabs = h('div', { class: 'tabs' }); s.append(tabs);
  const body = h('div', {}); s.append(body);
  const T = [['friends', '🦊 Friends'], ['acc', '🎀 Accessories'], ['bg', '🖼️ Worlds'], ['badges', '🏅 Badges']];
  for (const [id, lab] of T) tabs.append(h('button', { class: tab === id ? 'on' : '', onclick: () => openRewards(id) }, lab));
  const grid = h('div', { class: 'comp-grid' });
  if (tab === 'friends') for (const c of COMPANIONS) {
    const ok = owned(null, c);
    const b = h('button', { class: 'comp' + (S.companion === c.id ? ' sel' : '') + (ok ? '' : ' locked'), html: companionSVG(c.id, S.companion === c.id ? S.acc : null) });
    b.append(h('div', {}, c.name), ok ? '' : h('div', { class: 'lock' }, '🔒 ⭐' + c.need));
    b.onclick = () => { if (!ok) { toast(`Earn ⭐ ${c.need} stars to unlock ${c.name}!`); return; } S.companion = c.id; save(); Snd.play('pop'); Voice.say(`Hi Nora! I'm ${c.name}!`); openRewards('friends'); };
    grid.append(b);
  }
  if (tab === 'acc') {
    const none = h('button', { class: 'comp' + (!S.acc ? ' sel' : ''), html: companionSVG(S.companion, null) }); none.append(h('div', {}, 'No accessory')); none.onclick = () => { S.acc = null; save(); openRewards('acc'); }; grid.append(none);
    for (const a of ACCESSORIES) {
      const ok = owned(null, a);
      const b = h('button', { class: 'comp' + (S.acc === a.id ? ' sel' : '') + (ok ? '' : ' locked'), html: companionSVG(S.companion, a.id) });
      b.append(h('div', {}, a.name), ok ? '' : h('div', { class: 'lock' }, '🔒 ⭐' + a.need));
      b.onclick = () => { if (!ok) { toast(`Earn ⭐ ${a.need} stars to unlock the ${a.name}!`); return; } S.acc = a.id; save(); Snd.play('pop'); openRewards('acc'); };
      grid.append(b);
    }
  }
  if (tab === 'bg') for (const bg of BACKGROUNDS) {
    const ok = owned(null, bg);
    const b = h('button', { class: 'comp' + (S.bg === bg.id ? ' sel' : '') + (ok ? '' : ' locked') }, h('div', { class: 'bg-swatch', style: 'background:' + bg.css }), h('div', {}, bg.name), ok ? '' : h('div', { class: 'lock' }, '🔒 ⭐' + bg.need));
    b.onclick = () => { if (!ok) { toast(`Earn ⭐ ${bg.need} stars to unlock ${bg.name}!`); return; } S.bg = bg.id; save(); applyBg(); Snd.play('pop'); openRewards('bg'); };
    grid.append(b);
  }
  if (tab === 'badges') { const g = h('div', { class: 'badges' }); for (const b of BADGES) g.append(h('div', { class: 'bdg' + (S.badges[b.id] ? '' : ' locked') }, h('div', { class: 'be' }, b.e), h('div', { class: 'bt' }, b.t), h('div', { class: 'bd' }, b.d))); body.append(g); }
  else body.append(grid);
}
function applyBg() { document.body.className = document.body.className.replace(/\bbg-\w+/g, '').trim(); if (S.bg && S.bg !== 'meadow') document.body.classList.add('bg-' + S.bg); drawDecor(); }
function drawDecor() {
  const d = $('#decor'); const sets = { meadow: '🌸🌼☁️🦋', forest: '🍄🌿🧚‍♀️🌳', ocean: '🐚🫧🐠🌊', candy: '🍭🧁🍬☁️', space: '⭐🪐🌙✨', castle: '🏰💎👑✨' };
  const em = [...(sets[S.bg] || sets.meadow)].filter(c => c.trim() && c !== '‍' && c !== '️');
  const r = seeded(S.bg || 'm'); let html = '';
  for (let i = 0; i < 14; i++) html += `<div class="floaty" style="left:${Math.floor(r() * 96)}%;top:${Math.floor(r() * 94)}%;opacity:.28;font-size:${28 + Math.floor(r() * 30)}px;animation-delay:${(r() * 3).toFixed(1)}s">${em[i % em.length]}</div>`;
  d.innerHTML = html;
}

// ---------- Parent gate & dashboard ----------
function parentGate(onPass, title = 'Grown-ups only') {
  const mk = () => { const a = 100 + rnd(900), b = 11 + rnd(89); return { a, b, ans: a * b }; };
  let q = mk(), val = '';
  const qEl = h('div', { style: 'font-size:28px;font-weight:700' }), ans = h('div', { class: 'gate-ans' });
  const render = () => { qEl.textContent = `${q.a} × ${q.b} = ?`; ans.textContent = val || '…'; };
  const kp = h('div', { class: 'keypad' });
  for (const k of ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓']) kp.append(h('button', { onclick: () => {
    if (k === '⌫') val = val.slice(0, -1); else if (k === '✓') { if (+val === q.ans) { close(); onPass(); return; } toast('Not quite — here is a new one.'); q = mk(); val = ''; } else if (val.length < 7) val += k; render();
  } }, k));
  const el = h('div', {}, h('h2', {}, '🔒 ' + title), h('p', { class: 'muted' }, 'Please solve this to continue.'), qEl, ans, kp, h('button', { class: 'btn ghost', style: 'margin-top:12px', onclick: () => close() }, 'Cancel'));
  render(); const close = overlay(el);
  window.__gateAnswer = () => q.ans;
}
function openParent() {
  const s = screen('', false); Snd.setMusicWanted(false);
  s.append(topbar('👪 Parent Dashboard'));
  const dash = h('div', { class: 'dash' }); s.append(dash);
  const lowI = LOWER.filter(c => S.letters[c] && S.letters[c].intro).length, upI = UPPER.filter(c => S.letters[c] && S.letters[c].intro).length;
  const prac = practicedCount(LOWER) + practicedCount(UPPER), mast = [...LOWER, ...UPPER].filter(isMastered).length;
  const wordsL = Object.keys(S.words).filter(w => !ALL_JOINS.includes(w) && (S.words[w].written || S.words[w].right)).length;
  const qs = S.quizHist.slice(-20); const qAcc = qs.length ? Math.round(qs.reduce((a, q) => a + q.pct, 0) / qs.length) : null;
  const wr = [...LOWER, ...UPPER].filter(c => S.letters[c] && (S.letters[c].trace || S.letters[c].write));
  const wAcc = wr.length ? Math.round(wr.reduce((a, c) => a + Math.max(S.letters[c].trace, S.letters[c].write), 0) / wr.length / 3 * 100) : null;
  const card = (t, ...k) => h('div', { class: 'card' }, h('h3', {}, t), ...k);
  dash.append(card('📈 Overall progress',
    h('div', { class: 'row' }, h('div', {}, h('div', { class: 'stat' }, `${lowI + upI}/52`), 'letters introduced'), h('div', {}, h('div', { class: 'stat' }, prac), 'practiced'), h('div', {}, h('div', { class: 'stat' }, mast), 'mastered')),
    h('p', {}, `Worlds open: ${WORLDS.filter(w => worldUnlocked(w.n)).length}/6 · Words learned: ${wordsL} · Sentences written: ${Object.values(S.sentences).reduce((a, x) => a + x.written, 0)} · Stars: ${S.stars}`),
    h('p', {}, `Reading accuracy (recent quizzes): ${qAcc == null ? '—' : qAcc + '%'} · Writing accuracy (best per letter): ${wAcc == null ? '—' : wAcc + '%'} · Reading level: ${S.level.read}/3`)));
  // time
  const bars = h('div', { class: 'bars' }); let tot = 0; const week = [];
  for (let i = 6; i >= 0; i--) { const d = dayOffset(-i); const m = Math.round((S.time[d] || 0) / 60); week.push(m); }
  const mx = Math.max(10, ...week);
  week.forEach((m, i) => bars.append(h('div', { style: `height:${m / mx * 100}%` }, h('b', {}, m ? m + 'm' : ''), h('span', {}, ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(Date.now() - (6 - i) * 864e5).getDay()]))));
  for (const k in S.time) tot += S.time[k];
  dash.append(card('⏱️ Learning time', h('p', {}, `Today: ${Math.round((S.time[today()] || 0) / 60)} min · This week: ${week.reduce((a, b) => a + b, 0)} min · All time: ${Math.round(tot / 60)} min`), bars, h('div', { style: 'height:24px' }), h('p', { class: 'muted', style: 'font-size:14px' }, `Streak: ${S.streak.count} day(s). Time counts only while Nora is actively using the game.`)));
  // letters heat grid
  const lg = h('div', { class: 'lgrid' });
  for (const c of [...LOWER, ...UPPER]) { const m = mastery(c), l = S.letters[c]; const col = !l || !(l.practiced || l.right || l.wrong) ? '#ced4da' : m >= 0.72 ? '#2f9e44' : m >= 0.4 ? '#fab005' : '#fa5252'; lg.append(h('div', { style: 'background:' + col, title: c }, c)); }
  dash.append(card('🔤 Letter map', lg, h('p', { class: 'muted', style: 'font-size:14px' }, '🟩 mastered · 🟨 learning · 🟥 needs help · ⬜ not started yet. Mastery needs both reading (quizzes) and writing (tracing/writing) practice.')));
  const strong = [...LOWER, ...UPPER].filter(isMastered).sort((a, b) => mastery(b) - mastery(a)).slice(0, 12);
  const weak = weakLetters(10);
  const chipRow = list => { const c = h('div', { class: 'chips' }); list.forEach(x => c.append(h('span', { class: 'chip', html: cursiveSVG(x, { unit: 24 }) + `<span style="margin-left:4px;font-size:14px">${x}${S.letters[x] ? ` ${S.letters[x].right}✓ ${S.letters[x].wrong}✗` : ''}</span>` }))); return c; };
  dash.append(card('💪 Strengths', strong.length ? chipRow(strong) : h('p', { class: 'muted' }, 'Not enough practice yet.')));
  dash.append(card('🩹 Weak letters', weak.length ? chipRow(weak) : h('p', { class: 'muted' }, 'None so far!'), S.recentMiss.length ? h('p', { class: 'muted', style: 'font-size:14px' }, 'Recently missed: ' + S.recentMiss.join(' ')) : ''));
  const tb = h('table', { class: 'mini' }, h('tr', {}, h('th', {}, 'When'), h('th', {}, 'Activity'), h('th', {}, 'Score')));
  for (const q of S.quizHist.slice(-8).reverse()) tb.append(h('tr', {}, h('td', {}, new Date(q.d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })), h('td', {}, q.title), h('td', {}, `${q.right}/${q.n} (${q.pct}%)`)));
  dash.append(card('📝 Recent quiz results', S.quizHist.length ? tb : h('p', { class: 'muted' }, 'No quizzes yet.')));
  const sug = nextSuggestions().slice(0, 3);
  const sl = h('div', {}); sug.forEach(x => sl.append(h('button', { class: 'btn ghost', style: 'width:100%;margin-bottom:8px;justify-content:flex-start', onclick: () => x.run() }, x.label)));
  dash.append(card('🧭 Suggested next activities', sl));
  const bdg = Object.keys(S.badges).map(id => BADGES.find(b => b.id === id)).filter(Boolean);
  dash.append(card('🏅 Badges', h('p', {}, bdg.length ? bdg.map(b => b.e + ' ' + b.t).join(' · ') : 'None yet.')));
  // settings
  const tog = (label, key) => { const cb = h('input', { type: 'checkbox', style: 'width:26px;height:26px' }); cb.checked = !!S.settings[key]; cb.onchange = () => { S.settings[key] = cb.checked; save(); Snd.fadeMusic(); }; return h('label', { class: 'row', style: 'font-size:18px;margin:6px 0' }, cb, label); };
  dash.append(card('⚙️ Settings', tog('Sound effects & music', 'sound'), tog('Background music', 'music'), tog('Narrator voice', 'voice'), tog('Unlock all worlds (skip the gates)', 'unlockAll'),
    h('p', { class: 'muted', style: 'font-size:14px' }, `Voice: ${Voice.v ? Voice.v.name : 'device default'}. For the most natural voice on iPad, install an “Enhanced” English voice (Settings › Accessibility › Spoken Content › Voices). Progress is saved on this device only.`),
    h('button', { class: 'btn pink', onclick: () => parentGate(resetFlow, 'Reset records') }, '🗑️ Reset records')));
}
