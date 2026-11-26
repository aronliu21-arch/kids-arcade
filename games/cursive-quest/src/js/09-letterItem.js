function letterItem(c, steps) {
  const up = isUpper(c);
  return { text: c, print: c, kind: 'letter', partner: up ? c.toLowerCase() : null, steps,
    tip: `<b>${up ? 'Capital ' : ''}${c}:</b> ${TIPS[c]}<br><span class="muted">${finishTip(c)}</span>`,
    watchSay: `This is cursive ${up ? 'capital ' : ''}${c}. ${TIPS[c]}`, tipSay: TIPS[c] };
}
function finishTip(c) {
  const g = GLYPHS[c]; const lifts = layoutText(c).strokes.length > 1;
  const start = isUpper(c) ? 'Start at the green dot near the top.' : 'Start at the green dot on the baseline.';
  const lift = lifts ? ' Lift your pencil at the end of stroke 1, then do stroke 2.' : ' Keep your pencil down the whole time.';
  const end = g.exit === 'high' ? ' Finish with a little bridge at the middle line.' : g.exit === 'low' ? ' Finish with a tail that reaches toward the next letter.' : ' This one doesn\'t join the next letter.';
  return start + lift + end;
}
function runLetterLesson(c, id) {
  const isNew = !(S.letters[c] && S.letters[c].intro);
  runSteps({ title: `${isUpper(c) ? 'Capital' : 'Letter'} ${c}`, world: isUpper(c) ? 2 : 1, missionId: id, letters: [c], items: [letterItem(c, ['watch', 'trace', 'faded', 'write'])], onComplete: () => { if (isNew) track('learn'); } });
}
function runJoinLesson(j) {
  const items = shuffle(j.items).slice(0, 4).map((t, i) => ({ text: t, print: t, kind: 'join', joins: true, steps: i === 3 ? ['watch', 'trace', 'write'] : ['watch', 'trace'],
    tip: `<b>${j.name}:</b> ${j.tip}<br><span class="muted">The <b style="color:#e8a800">gold</b> part is the joining stroke.</span>`, watchSay: `Watch how ${t.split('').join(' and ')} hold hands. ${j.tip}` }));
  runSteps({ title: `${j.ico} ${j.name}`, world: 3, missionId: 'J:' + j.id, items });
}
function runWordLesson(cat) {
  const c = WORDS[cat]; const done = Object.keys(S.lessons).filter(k => k === 'W:' + cat).length + (S.lessons['W:' + cat] ? 1 : 0);
  const maxLen = 3 + S.level.words + (S.lessons['W:' + cat] ? 1 : 0) + (S.lessons['W:' + cat] >= 3 ? 2 : 0);
  let pool = c.list.filter(([w]) => w.length <= maxLen); if (pool.length < 3) pool = c.list;
  const seen = new Set(S.seen['lessonword'] || []); let fresh = pool.filter(([w]) => !seen.has(w)); if (fresh.length < 3) { S.seen['lessonword'] = (S.seen['lessonword'] || []).filter(w => !pool.some(([p]) => p === w)); fresh = pool; }
  const picks = shuffle(fresh).slice(0, 3).sort((a, b) => a[0].length - b[0].length);
  S.seen['lessonword'] = [...(S.seen['lessonword'] || []), ...picks.map(p => p[0])];
  const items = picks.map(([w, e], i) => ({ text: w, print: w, emoji: e, kind: 'word', joins: false, steps: i === 2 ? ['mcq', 'watch', 'trace', 'write'] : ['mcq', 'watch', 'trace'],
    tip: `<b>${c.ico} ${c.name}:</b> “${w}” has ${w.length} letters: <b>${w.split('').join(' · ')}</b>. Keep your pencil down until the word is done${/[ijtx]/.test(w) ? ', then dot and cross' : ''}!`, watchSay: `${w}. Watch how I write ${w} in cursive.` }));
  runSteps({ title: `${c.ico} ${c.name} Words`, world: 4, missionId: 'W:' + cat, items });
}
function runSentenceLesson(k) {
  const [a, b] = SENTENCE_SETS[k];
  const tip = s => `<b>Sentence tips:</b> start with a <b>capital ${s[0]}</b>, leave a finger space between words, and end with a <b>${s.slice(-1) === '!' ? '!' : 'period'}</b>.`;
  const items = [
    { text: a, print: a, kind: 'sentence', steps: ['watch', 'trace'], tip: tip(a), watchSay: `${a} Watch me write this sentence.` },
    { text: b, print: b, kind: 'sentence', steps: ['watch', 'trace'], tip: tip(b), watchSay: `${b} Watch me write this sentence.` },
    { text: a, print: a, kind: 'sentence', hideModel: true, steps: ['write'], tip: tip(a) + '<br>Now try it <b>all by yourself</b>, without tracing!' },
  ];
  runSteps({ title: '📜 Sentence Trail ' + (k + 1), world: 5, missionId: 'S:' + k, items });
}
function weakLetters(n = 3) {
  const practiced = [...TEACH_LOWER, ...TEACH_UPPER].filter(c => S.letters[c] && (S.letters[c].practiced || S.letters[c].right || S.letters[c].wrong));
  const scored = practiced.map(c => ({ c, m: mastery(c) - (S.recentMiss.includes(c) ? 0.3 : 0) })).sort((a, b) => a.m - b.m);
  const out = scored.filter(x => x.m < 0.72).slice(0, n).map(x => x.c);
  return out;
}
function runReview(missionId) {
  let ls = weakLetters(3); if (ls.length < 3) for (const c of poolFor('lower')) { if (ls.length >= 3) break; if (!ls.includes(c)) ls.push(c); }
  const items = ls.map(c => Object.assign(letterItem(c, ['watch', 'trace', 'write']), { review: true }));
  runSteps({ title: '🩹 Tricky Letter Practice', world: 6, missionId, letters: ls, items });
}
function runGate(n) {
  let items;
  const W = st => ({ steps: ['write'], kind: 'gate' });
  if (n === 1) items = shuffle(TEACH_LOWER.filter(c => S.letters[c] && S.letters[c].intro)).concat(shuffle(TEACH_LOWER)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 4).map(c => Object.assign(letterItem(c, ['write']), { kind: 'letter' }));
  if (n === 2) items = shuffle(TEACH_UPPER.filter(c => S.letters[c] && S.letters[c].intro)).concat(shuffle(TEACH_UPPER)).filter((c, i, a) => a.indexOf(c) === i).slice(0, 4).map(c => Object.assign(letterItem(c, ['write']), { kind: 'letter' }));
  if (n === 3) items = shuffle(ALL_JOINS.filter(j => j.length === 2)).slice(0, 3).concat([pick(JOIN_LESSONS[5].items)]).map(t => ({ text: t, print: t, kind: 'join', steps: ['write'], tip: '<b>Write to Unlock!</b> Join the letters smoothly.' }));
  if (n === 4) items = shuffle(ALL_WORDS.filter(x => x.w.length <= 5)).slice(0, 4).map(x => ({ text: x.w, print: x.w, emoji: x.e, kind: 'word', steps: ['write'], tip: '<b>Write to Unlock!</b> Write each word on the lines.' }));
  if (n === 5) items = [pick(SENTENCE_SETS.flat().filter(s => s.length <= 14)), ...shuffle(ALL_WORDS).slice(0, 2).map(x => x.w)].map(t => ({ text: t, print: t, kind: t.includes(' ') ? 'sentence' : 'word', steps: ['write'], tip: '<b>Write to Unlock!</b> Write it on your own.' }));
  items.forEach(it => it.tip = `<b>🔑 Write to Unlock World ${n + 1}!</b> Write these on your own (look at the model on this card). Get 1 star or more on most of them to open the gate.<br>` + (it.tip || ''));
  const need = n === 5 ? 2 : 3;
  runSteps({ title: `🔑 Write to Unlock World ${n + 1}`, world: n, missionId: 'G' + n, items, gate: { n, need } });
}

// ---------- Tracking: events, daily missions, streak, time ----------
const DAILY_POOL = [
  { id: 'trace3', text: 'Trace 3 letters or words', ev: 'trace', goal: 3 },
  { id: 'trace5', text: 'Trace 5 times', ev: 'trace', goal: 5 },
  { id: 'write2', text: 'Write 2 things on your own', ev: 'write', goal: 2 },
  { id: 'right6', text: 'Get 6 answers right', ev: 'right', goal: 6 },
  { id: 'right10', text: 'Get 10 answers right', ev: 'right', goal: 10 },
  { id: 'game1', text: 'Play any mini-game', ev: 'game', goal: 1 },
  { id: 'detective', text: 'Play Cursive Detective', ev: 'game:detective', goal: 1 },
  { id: 'speed', text: 'Try the Speed Challenge', ev: 'game:speed', goal: 1 },
  { id: 'hunt', text: 'Go on a Treasure Hunt', ev: 'game:hunt', goal: 1 },
  { id: 'builder', text: 'Build words in Letter Builder', ev: 'game:builder', goal: 1 },
  { id: 'learn1', text: 'Learn a new letter', ev: 'learn', goal: 1 },
  { id: 'word2', text: 'Write 2 words or sentences', ev: 'word', goal: 2 },
  { id: 'review1', text: 'Practice a tricky letter', ev: 'review', goal: 1 },
];
function ensureDaily() {
  if (S.daily && S.daily.date === today()) return;
  const r = seeded('nora' + today());
  let pool = DAILY_POOL.slice();
  if (!weakLetters(1).length) pool = pool.filter(t => t.id !== 'review1');
  if (TEACH_LOWER.concat(TEACH_UPPER).every(c => S.letters[c] && S.letters[c].intro)) pool = pool.filter(t => t.id !== 'learn1');
  if (!S.gates[3] && !S.settings.unlockAll) pool = pool.filter(t => t.id !== 'word2');
  const tasks = []; const evs = new Set();
  while (tasks.length < 3 && pool.length) { const i = Math.floor(r() * pool.length); const t = pool.splice(i, 1)[0]; if (evs.has(t.ev)) continue; evs.add(t.ev); tasks.push({ id: t.id, prog: 0 }); }
  S.daily = { date: today(), tasks, chest: false }; save();
}
function track(ev) {
  ensureDaily();
  for (const t of S.daily.tasks) { const d = DAILY_POOL.find(x => x.id === t.id); if (d && d.ev === ev && t.prog < d.goal) { t.prog++; if (t.prog === d.goal) setTimeout(() => toast('🎯 Daily mission done: ' + d.text + '!'), 400); } }
}
function dailyAllDone() { return S.daily && S.daily.tasks.every(t => t.prog >= DAILY_POOL.find(x => x.id === t.id).goal); }
function touchStreak() { const t = today(); if (S.streak.last === t) return; S.streak.count = S.streak.last === dayOffset(-1) ? S.streak.count + 1 : 1; S.streak.last = t; }
let lastAct = Date.now();
document.addEventListener('pointerdown', () => { lastAct = Date.now(); }, true);
setInterval(() => { if (document.visibilityState === 'visible' && Date.now() - lastAct < 60000 && !$('#intro').classList.contains('on')) { const d = today(); S.time[d] = (S.time[d] || 0) + 15; save(); } }, 15000);

// ---------- Badges & unlocks ----------
const practicedCount = set => set.filter(c => S.letters[c] && S.letters[c].practiced > 0).length;
const BADGES = [
  { id: 'first5', e: '🖐️', t: 'First 5 Letters!', d: 'Practiced 5 letters', test: () => practicedCount(LOWER) + practicedCount(UPPER) >= 5 },
  { id: 'lowerExplorer', e: '🧭', t: 'Lowercase Explorer!', d: 'Practiced all 26 lowercase letters', test: () => practicedCount(LOWER) >= 26 },
  { id: 'capRoyal', e: '👑', t: 'Capital Royalty', d: 'Practiced all 26 capitals', test: () => practicedCount(UPPER) >= 26 },
  { id: 'perfect', e: '💯', t: 'Perfect Practice!', d: 'Got 3 stars writing on your own', test: () => S.counts.perfect >= 1 },
  { id: 'connector', e: '🔗', t: 'Super Connector', d: 'Finished 3 joining lessons', test: () => JOIN_LESSONS.filter(j => S.lessons['J:' + j.id]).length >= 3 },
  { id: 'wordWizard', e: '🪄', t: 'Cursive Word Wizard!', d: 'Wrote 12 words', test: () => Object.values(S.words).reduce((a, w) => a + (w.written || 0), 0) >= 12 },
  { id: 'sentenceStar', e: '📜', t: 'Sentence Star', d: 'Wrote 4 sentences on your own', test: () => Object.values(S.sentences).reduce((a, w) => a + (w.written || 0), 0) >= 4 },
  { id: 'practice25', e: '💪', t: 'Practice Champion', d: 'Practiced 25 times', test: () => S.counts.practice >= 25 },
  { id: 'practice100', e: '🦸‍♀️', t: 'Practice Hero', d: 'Practiced 100 times', test: () => S.counts.practice >= 100 },
  { id: 'detective', e: '🔍', t: 'Super Detective', d: 'Perfect score in Cursive Detective', test: () => S.counts.detectivePerfect },
  { id: 'speedy', e: '⚡', t: 'Speedy Reader', d: '15 right in one Speed Challenge', test: () => S.counts.speedBest >= 15 },
  { id: 'streak3', e: '🔥', t: '3-Day Streak', d: 'Practiced 3 days in a row', test: () => S.streak.count >= 3 },
  { id: 'comeback', e: '🌈', t: 'Comeback Kid', d: 'Mastered a letter you once missed', test: () => (S.counts.comeback || 0) >= 1 },
  { id: 'mission', e: '🎯', t: 'Mission Master', d: 'Finished all daily missions', test: () => (S.counts.dailyDone || 0) >= 1 },
  { id: 'superstar', e: '🌟', t: 'Cursive Superstar!', d: 'Passed the Superstar Challenge', test: () => S.counts.superstar },
];
const owned = (list, item) => S.stars >= item.need || S.chestBonus.includes(item.id);
function checkRewards(prevStars) {
  const news = [];
  for (const b of BADGES) if (!S.badges[b.id] && b.test()) { S.badges[b.id] = Date.now(); news.push({ e: b.e, t: 'New badge: ' + b.t, d: b.d, say: `You earned a badge! ${b.t}` }); }
  for (const c of COMPANIONS) if (c.need > prevStars && c.need <= S.stars) news.push({ svg: companionSVG(c.id), t: c.name + ' wants to join you!', d: 'New friend unlocked — pick her in the Rewards room.', say: `${c.name} wants to join your adventure!` });
  for (const a of ACCESSORIES) if (a.need > prevStars && a.need <= S.stars) news.push({ svg: companionSVG(S.companion, a.id), t: 'New accessory: ' + a.name, d: 'Dress up your friend in the Rewards room!', say: `You unlocked the ${a.name}!` });
  for (const b of BACKGROUNDS) if (b.need > prevStars && b.need <= S.stars && b.need > 0) news.push({ e: '🖼️', t: 'New world theme: ' + b.name, d: 'Change your background in the Rewards room!', say: `You unlocked ${b.name}!` });
  save(); return news;
}
