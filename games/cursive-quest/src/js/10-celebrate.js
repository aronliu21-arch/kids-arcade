async function celebrate(list) {
  for (const n of list) {
    await new Promise(res => {
      const el = h('div', { class: 'celebrate' }, n.svg ? h('div', { style: 'width:160px;height:160px;margin:0 auto', html: n.svg }) : h('div', { class: 'be' }, n.e), h('h2', {}, n.t), h('p', {}, n.d || ''), h('button', { class: 'btn big gold', onclick: () => { close(); res(); } }, 'Yay! ✨'));
      const close = overlay(el); Confetti.burst(160); Snd.play('fanfare'); Voice.say(n.say || n.t);
    });
  }
}

// ---------- Mission end / results / break ----------
function nextSuggestions() {
  const out = [];
  for (let n = 1; n <= 5; n++) if (worldUnlocked(n) && !worldUnlocked(n + 1) && gateReady(n) && !S.gates[n]) out.push({ label: `🔑 Write to Unlock World ${n + 1}`, run: () => runGate(n) });
  const weak = weakLetters(3);
  if (weak.length >= 2 && S.counts.practice % 4 === 3) out.push({ label: `🩹 Practice tricky letters (${weak.join(', ')})`, run: () => runReview('X:review') });
  for (let n = 1; n <= 6; n++) {
    if (!worldUnlocked(n)) break;
    const next = worldLessons(n).find(l => !lessonStars(l.id));
    if (next) { out.push({ label: `${WORLDS[n - 1].ico} ${next.svg ? (isUpper(next.label) ? 'Capital ' : 'Letter ') + next.label : next.label}`, run: next.run }); break; }
  }
  if (weak.length && !out.some(o => o.label.includes('tricky'))) out.push({ label: `🩹 Practice tricky letters (${weak.join(', ')})`, run: () => runReview('X:review') });
  const g = pick(GAMES.filter(x => x.id !== 'unlock')); out.push({ label: `${g.e} ${g.t}`, run: g.run });
  return out;
}
async function finishMission(r) {
  const prev = S.stars;
  touchStreak();
  if (r.missionId) S.lessons[r.missionId] = Math.max(S.lessons[r.missionId] || 0, r.stars);
  let gateMsg = null;
  if (r.gate) {
    const passed = (r.scores || []).filter(x => x >= 1).length;
    if (passed >= r.gate.need) { S.gates[r.gate.n] = Date.now(); r.stars += 2; gateMsg = { e: WORLDS[r.gate.n].ico, t: `World ${r.gate.n + 1} unlocked!`, d: WORLDS[r.gate.n].name + ' is open!', say: `You just unlocked a new magical world! ${WORLDS[r.gate.n].name}!` }; }
    else gateMsg = 'retry';
  }
  S.stars += r.stars; S.rowMissions = (S.rowMissions || 0) + 1;
  if (r.gameId || /game|Detective|Decoder|Builder|Hunt|Match|Speed/.test(r.title)) S.counts.games++;
  ensureDaily(); let chest = false;
  if (dailyAllDone() && !S.daily.chest) { S.daily.chest = true; S.counts.dailyDone = (S.counts.dailyDone || 0) + 1; chest = true; S.stars += 5; }
  save();
  showResults(r, gateMsg, chest);
  await sleep(700);
  const news = checkRewards(prev);
  if (gateMsg && gateMsg !== 'retry') news.unshift(gateMsg);
  if (chest) { const sur = openChest(); news.unshift(sur); }
  if (news.length) celebrate(news);
}
function openChest() {
  const locked = [...ACCESSORIES, ...COMPANIONS.filter(c => c.need > 0), ...BACKGROUNDS.filter(b => b.need > 0)].filter(x => !owned(null, x)).sort((a, b) => a.need - b.need);
  if (locked.length && Math.random() < 0.6) { const it = locked[0]; S.chestBonus.push(it.id); save(); return { e: '🎁', t: 'Surprise chest: ' + it.name + '!', d: 'All daily missions done — you get an early surprise (and +5 stars)!', say: `Surprise! All your daily missions are done. You found ${it.name}!` }; }
  return { e: '🎁', t: 'Surprise chest: +5 bonus stars!', d: 'All daily missions done. Come back tomorrow for new ones!', say: 'Surprise! All your daily missions are done. Five bonus stars!' };
}
function showResults(r, gateMsg, chest) {
  const s = screen('', false); Snd.setMusicWanted(true);
  s.append(topbar('Mission complete!', {}));
  const box = h('div', { class: 'results card' }); s.append(box);
  const pct = r.total ? r.correct / r.total : 1;
  const msg = gateMsg === 'retry' ? 'The gate is still closed — but every try makes your hand stronger. Practice a little and try again!' :
    r.stars >= 3 ? pick(['You are becoming a Cursive Superstar!', 'Wow, Nora! That was amazing!', 'Your cursive is shining bright!']) :
      r.stars === 2 ? pick(['Great work! Your letters are getting smoother every time.', 'So good! Keep practicing and you\'ll shine even brighter!']) :
        pick(['Every practice makes your cursive stronger. Proud of you!', 'You kept going — that\'s what real learners do!']);
  box.append(h('div', { style: 'width:120px;height:120px;margin:0 auto', html: companionSVG(S.companion, S.acc) }),
    h('h1', {}, r.title), h('div', { class: 'bigstars' }, '⭐'.repeat(r.stars) || '⭐'), h('p', {}, msg));
  const grid = h('div', { class: 'res-grid' });
  const scoreTxt = r.speed ? `${r.correct} right in 60 seconds` : `${r.correct} of ${r.total} ${r.kind === 'lesson' ? 'steps with stars' : 'correct'}`;
  grid.append(h('div', { class: 'card' }, h('div', { class: 'muted' }, 'Score'), h('div', { class: 'stat' }, r.maxPoints ? `${r.points}/${r.maxPoints}` : (r.total ? Math.round(pct * 100) + '%' : '✓')), h('div', {}, scoreTxt), r.extra ? h('div', { class: 'muted' }, r.extra) : null));
  grid.append(h('div', { class: 'card' }, h('div', { class: 'muted' }, 'Stars earned'), h('div', { class: 'stat' }, '+' + r.stars + (chest ? ' +5🎁' : '')), h('div', {}, `Total: ⭐ ${S.stars}`)));
  const chips = list => { const c = h('div', { class: 'chips' }); for (const x of list.slice(0, 12)) c.append(h('span', { class: 'chip', html: cursiveSVG(x, { unit: 26 }) })); return c; };
  grid.append(h('div', { class: 'card' }, h('div', { class: 'muted' }, '🌟 Letters mastered'), r.mastered && r.mastered.length ? chips(r.mastered) : h('div', { class: 'muted' }, 'Keep going — mastery comes with practice!')));
  const prac = (r.practice || []).concat(r.wrongWords || []);
  grid.append(h('div', { class: 'card' }, h('div', { class: 'muted' }, '💪 Needs more practice'), prac.length ? chips(prac) : h('div', {}, 'Nothing — great job! 🎉')));
  box.append(grid);
  box.append(h('div', { class: 'tip-life' }, '💡 ' + pick(LIFE_TIPS)));
  const row = h('div', { class: 'row', style: 'justify-content:center' });
  if (S.rowMissions >= 3) {
    row.append(h('button', { class: 'btn big', onclick: () => { Snd.play('tap'); showBreak(); } }, 'Continue ▶'));
  } else {
    const nx = nextSuggestions()[0];
    row.append(h('button', { class: 'btn ghost', onclick: () => { Snd.play('tap'); goMap(); } }, '🗺️ Map'));
    if (gateMsg === 'retry' && r.gate) row.append(h('button', { class: 'btn big', onclick: () => runGate(r.gate.n) }, '↺ Try the gate again'));
    else if (nx) row.append(h('button', { class: 'btn big', onclick: () => { Snd.play('tap'); nx.run(); } }, 'Next: ' + nx.label + ' ▶'));
  }
  box.append(row);
  Voice.say(`${r.title}. You earned ${r.stars} ${r.stars === 1 ? 'star' : 'stars'}! ${msg}`);
  if (r.stars >= 2) { Confetti.burst(90); Snd.play('fanfare'); } else Snd.play('star');
  CUR = { kind: 'results', choose: () => $$('.btn', row).pop().click() };
}
function showBreak() {
  const s = screen('', false); Snd.setMusicWanted(true);
  S.rowMissions = 0; save();
  const box = h('div', { class: 'results card' }, h('div', { style: 'width:220px;margin:0 auto', html: noraSVG({ kit: 'explorer' }) }),
    h('h1', {}, 'Great practice! Time for a break 🌈'), h('p', {}, `You finished 3 missions in a row. Stretch your fingers, get a drink of water, and come back later — ${companionName()} will be waiting!`),
    h('button', { class: 'btn big gold', onclick: () => { Snd.play('tap'); showTitle(); } }, 'Finish for now'));
  s.append(box);
  Voice.say('Great practice, Nora! Time for a break. Stretch your fingers and come back later!');
  CUR = { kind: 'break', choose: () => $('.btn', box).click() };
}

// ---------- Mini-game arcade ----------
const GAMES = [
  { id: 'detective', e: '🔍', t: 'Cursive Detective', d: 'Which letter is hiding in cursive?', c: 'w1', run: () => runQuiz({ title: '🔍 Cursive Detective', types: capsReady() ? ['recLower', 'recLower', 'recUpper'] : ['recLower'], n: 10, gameId: 'detective', missionId: 'game:detective' }) },
  { id: 'match', e: '🧦', t: 'Match the Letters', d: 'Pair print letters with cursive twins', c: 'w2', run: () => runMatch({ title: '🧦 Match the Letters', missionId: 'game:match' }) },
  { id: 'hunt', e: '💎', t: 'Treasure Hunt', d: 'Find the hidden cursive letters', c: 'w3', run: () => runHunt() },
  { id: 'decoder', e: '🗝️', t: 'Word Decoder', d: 'Crack the cursive word code', c: 'w4', run: () => runQuiz({ title: '🗝️ Word Decoder', types: ['readWord'], n: 8, gameId: 'decoder', missionId: 'game:decoder' }) },
  { id: 'builder', e: '🧩', t: 'Letter Builder', d: 'Put cursive letters in order', c: 'w5', run: () => runBuilder() },
  { id: 'speed', e: '⚡', t: 'Speed Challenge', d: 'How many in 60 seconds?', c: 'w6', run: () => runQuiz({ title: '⚡ Speed Challenge', types: capsReady() ? ['recLower', 'recUpper'] : ['recLower'], timed: 60, speed: true, gameId: 'speed', missionId: 'game:speed' }) },
  { id: 'unlock', e: '🔑', t: 'Write to Unlock', d: 'Write letters to open the next world', c: 'w1', run: () => { const n = [1, 2, 3, 4, 5].find(n => worldUnlocked(n) && !worldUnlocked(n + 1)); if (!n) { toast('All worlds are already open! 🎉'); return; } if (!gateReady(n)) { toast(`Finish half of World ${n} first, then come back!`); return; } runGate(n); } },
];
function openArcade() {
  const s = screen('', false); Snd.setMusicWanted(true);
  s.append(topbar('🎮 Mini-Game Arcade'));
  const best = S.counts.speedBest ? ` · Speed best: ${S.counts.speedBest}` : '';
  s.append(h('p', { class: 'muted' }, 'Every game is different each time you play!' + best));
  const g = h('div', { class: 'arcade' });
  for (const x of GAMES) g.append(h('button', { class: 'game-card ' + x.c, onclick: () => { Snd.play('tap'); x.run(); } }, h('div', { class: 'ge' }, x.e), h('div', { class: 'gt' }, x.t), h('div', { class: 'gd' }, x.d)));
  s.append(g);
  Voice.say('Pick a game, Nora!');
}

// ---------- Map ----------
function goMap() {
  const s = screen('', false); Snd.setMusicWanted(true); ensureDaily();
  const bar = h('div', { class: 'topbar' },
    h('div', { class: 'badge-nora' }, h('div', { class: 'av', html: noraSVG({ kit: 'explorer' }).replace('viewBox="0 0 200 240"', 'viewBox="30 10 140 140"') }), h('span', { class: 'nm' }, 'Nora')),
    h('div', { class: 'title' }, 'Nora\'s Cursive Quest ✨'),
    h('div', { class: 'star-pill' }, '⭐ ' + S.stars),
    h('button', { class: 'icon-btn', 'aria-label': 'Rewards', onclick: () => { Snd.play('tap'); openRewards(); } }, '🎒'),
    h('button', { class: 'icon-btn', 'aria-label': 'Games', onclick: () => { Snd.play('tap'); openArcade(); } }, '🎮'),
    h('button', { class: 'icon-btn', 'aria-label': 'Parents', onclick: () => { Snd.play('tap'); parentGate(openParent); } }, '👪'),
    soundBtn(), voiceBtn());
  s.append(bar);
  const grid = h('div', { class: 'map-grid' }); s.append(grid);
  const worlds = h('div', { class: 'worlds' });
  for (const w of WORLDS) {
    const un = worldUnlocked(w.n), p = worldProgress(w.n);
    const card = h('button', { class: `world-card w${w.n}` + (un ? '' : ' locked'), 'data-world': w.n },
      h('div', { class: 'wico' }, w.ico), h('div', {}, h('div', { class: 'wn' }, 'WORLD ' + w.n), h('div', { class: 'wt' }, w.name), h('div', { style: 'font-size:15px;opacity:.95' }, w.desc)),
      h('div', {}, h('div', { style: 'font-size:14px' }, un ? `${p.done} / ${p.total} done` + (S.gates[w.n] ? ' · 🔑 gate open' : '') : `Write to Unlock in World ${w.n - 1}`), h('div', { class: 'wbar' }, h('i', { style: `width:${Math.round(p.pct * 100)}%` }))));
    card.onclick = () => { Snd.play('tap'); if (!un) { toast(`🔒 Finish half of World ${w.n - 1}, then pass its “Write to Unlock” gate!`); Voice.say(`This world is locked. Pass the write to unlock gate in world ${w.n - 1} first!`); return; } openWorld(w.n); };
    worlds.append(card);
  }
  grid.append(worlds);
  const side = h('div', { class: 'side-stack' });
  // companion + next
  const sug = nextSuggestions();
  const comp = h('button', { class: 'card row', style: 'text-align:left;gap:10px;align-items:center', onclick: () => Voice.say(pick(cheers())) }, h('div', { style: 'width:96px;height:96px;flex:none', html: companionSVG(S.companion, S.acc) }), h('div', { class: 'grow' }, h('b', {}, companionName() + ' says:'), h('div', { id: 'compSay' }, pick(cheers()))));
  side.append(comp);
  const nc = h('div', { class: 'card next-card' }, h('h3', {}, '✨ Next up'), h('button', { class: 'btn big', id: 'nextUp', onclick: () => { Snd.play('tap'); sug[0].run(); } }, sug[0].label));
  if (sug[1]) nc.append(h('button', { class: 'btn ghost', style: 'width:100%;margin-top:10px', onclick: () => { Snd.play('tap'); sug[1].run(); } }, sug[1].label));
  side.append(nc);
  // daily missions
  const dm = h('div', { class: 'card daily' }, h('h3', {}, `🎯 Today's Missions ${S.streak.count > 1 ? '· 🔥' + S.streak.count + ' days' : ''}`));
  for (const t of S.daily.tasks) { const d = DAILY_POOL.find(x => x.id === t.id); const done = t.prog >= d.goal; dm.append(h('div', { class: 'task' + (done ? ' done' : '') }, h('div', { class: 'chk' }, done ? '✓' : ''), h('div', { class: 'grow' }, d.text, h('div', { class: 'prog' }, h('i', { style: `width:${Math.min(100, t.prog / d.goal * 100)}%` }))))); }
  dm.append(h('div', { class: 'muted', style: 'font-size:15px;margin-top:6px' }, S.daily.chest ? '🎁 Chest opened! New missions tomorrow.' : '🎁 Finish all 3 to open a surprise chest!'));
  side.append(dm);
  side.append(h('button', { class: 'btn sky big', onclick: () => { Snd.play('tap'); openArcade(); } }, '🎮 Mini-Game Arcade'));
  grid.append(side);
  CUR = { kind: 'map', choose: () => $('#nextUp').click() };
}
