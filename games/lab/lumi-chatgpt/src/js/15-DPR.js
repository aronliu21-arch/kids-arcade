let DPR = 1;
function fit() {
  DPR = Math.min(2, window.devicePixelRatio || 1); cv.width = W * DPR; cv.height = H * DPR;
  const wrap = $('wrap'), s = Math.min(wrap.clientWidth / W, wrap.clientHeight / H);
  $('stage').style.transform = `translate(-50%,-50%) scale(${s})`;
  $('rotate').hidden = !(window.innerHeight > window.innerWidth * 1.15 && window.innerWidth < 700);
}
window.addEventListener('resize', fit); fit();

// ---------- input ----------
let held = null;
cv.addEventListener('pointerdown', ev => {
  const r = cv.getBoundingClientRect(), lx = (ev.clientX - r.left) / r.width * W, ly = (ev.clientY - r.top) / r.height * H;
  Snd.init();
  if (G.mode === 'world') worldTap(lx, ly);
});
// Skip the intro on click (not pointerdown), so the same tap cannot also press a profile card.
cv.addEventListener('click', () => { if (G.mode === 'title' && G.intro.state === 'play') showMenu(); });
const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
window.addEventListener('keydown', ev => {
  if (ev.target && ev.target.tagName === 'INPUT') return;
  if (DIRS[ev.key]) { held = DIRS[ev.key]; ev.preventDefault(); }
  if ((ev.key === 'Enter' || ev.key === ' ') && dlg) { advanceDialog(); ev.preventDefault(); }
});
window.addEventListener('keyup', ev => { if (DIRS[ev.key] && held === DIRS[ev.key]) held = null; });
$('btnStart').innerHTML = '▶ ' + zh(ZT.start);
$('btnStart').addEventListener('click', startIntro);
$('btnReset').addEventListener('click', resetGate);
$('btnBag').addEventListener('click', () => { if (!G.busy && !dlg) { Snd.play('tap'); bagPanel(); } });
$('btnTeam').addEventListener('click', () => { if (!G.busy && !dlg) { Snd.play('tap'); teamPanel(); } });
$('btnQuest').addEventListener('click', () => { if (!G.busy && !dlg) { Snd.play('tap'); questPanel(); } });
$('btnExit').addEventListener('click', () => { if (!G.busy && !dlg) { Snd.play('tap'); goTitle(); } });
function renderSoundButtons() {
  const muted = Snd.isMuted();
  for (const id of ['btnSound', 'btnSound2']) {
    const button = $(id);
    button.querySelector('img').src = muted ? 'art/hud-muted.webp' : 'art/hud-sound.webp';
    button.setAttribute('aria-pressed', String(muted));
  }
}
for (const id of ['btnSound', 'btnSound2']) $(id).addEventListener('click', () => {
  Snd.init(); Snd.setMuted(!Snd.isMuted()); renderSoundButtons();
});
renderSoundButtons();

// Expose for automated playtests. Harmless for players.
window.__test = {
  G, save: () => S,
  state: () => ({ cloud: Cloud.ready, music: Snd.track(), screen: G.mode, intro: G.intro.state, world: G.world, kid, dialog: !!dlg, panel: panelOpen(), question: QS ? QS.q : null, battle: G.B ? { enemy: G.B.e.name, hp: G.B.e.hp, lock: G.B.lock } : null, lv: S && S.lv, hp: S && S.hp, done: !!(S && S.won) }),
  fast: on => { G.fast = on; },
  warp: id => loadWorld(id, true),
  wild: () => wildBattle(),
  solve() { this.step(); },
  step() {
    if (G.mode === 'title') { if (G.intro.state === 'wait') return startIntro(); if (G.intro.state === 'play') return showMenu(); return pickKid('nora'); }
    if (G.mode === 'create') { if (G.mirror) return closeMirror(); crStep = S.created ? 0 : 1; return $('btnBegin').click(); }
    if (QS) { if (QS.done) { if (!$('qNext').hidden) $('qNext').click(); return; } const q = QS.q; if (q.type === 'order') q.correct.forEach(i => pickAnswer(i)); else pickAnswer(q.answer); return; }
    if (dlg) return advanceDialog();
    if (panelOpen()) { const f = $('btnFinish'); if (f) return f.click(); return closePanel(); }
    if (G.busy) return;
    if (G.mode === 'battle') { if (G.B.lock) return; const l = activeLumi(); let best = 0; for (let t = 0; t < knownMoves(l); t++) if (!G.B.rest[t]) best = t; if (movePower(l, best) * elemMult(SPECIES[l.sp].el, G.B.e.el) > heroAtk()) doMove('skill', best); else doMove('strike'); return; }
    if (G.mode === 'world') {
      if (G.world === 'hub') { if (!S.metElder) return interact(G.ents.find(e => e.role === 'elder')); const nx = WORLD_ORDER.find(id => !S.bosses[id]); if (nx) return teleport(nx); return; }
      const q = S.quests[G.world], giver = G.ents.find(e => e.role === 'giver');
      if (S.bosses[G.world]) return teleport('hub');
      if (!q.accepted) return interact(giver);
      const chest = G.ents.find(e => (e.type === 'chest' && !e.open) || (e.type === 'hidden' && !e.gone)); if (chest) return openChest(chest, chest.type === 'hidden');
      if (S.hp < maxHP() * 0.4) { S.hp = maxHP(); }
      const fogE = G.ents.find(e => e.type === 'fog' && !e.gone); if (q.kills < 3 && fogE) return interact(fogE);
      const boss = G.ents.find(e => e.type === 'boss' && !e.gone); if (boss) return interact(boss);
    }
  },
};
watchWords();
function onCloudReady() { if (G.mode === 'title' && !$('menu').hidden) profileCards(); }
cloudInit();
requestAnimationFrame(frame);
