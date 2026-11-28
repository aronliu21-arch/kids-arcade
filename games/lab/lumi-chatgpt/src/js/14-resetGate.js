// ---------- parent gate ----------
function resetGate() {
  Snd.play('tap');
  const ask = () => {
    const a = 100 + Math.floor(Math.random() * 900), b = 12 + Math.floor(Math.random() * 88);
    $('panelBody').innerHTML = `<h2>🔒 Grown-ups only</h2><p>To reset records, answer this:</p><p class="gateq">${a} × ${b} = ?</p><div class="gaterow"><input id="gateIn" type="text" inputmode="numeric" autocomplete="off" aria-label="Answer"><button id="gateGo" class="big">Check</button></div><p id="gateMsg" class="hint"></p>`;
    $('gateGo').onclick = () => { if (parseInt($('gateIn').value, 10) === a * b) pickReset(); else { Snd.play('bad'); ask(); $('gateMsg').textContent = 'Not right. Here is a new question.'; } };
    G.gateAnswer = a * b;
  };
  const pickReset = () => {
    $('panelBody').innerHTML = `<h2>Reset records</h2><p>Tick who to reset on this device. This clears levels, Lumis, treasure and seen questions.</p><label class="chk"><input type="checkbox" id="rsNora"> Girl</label><label class="chk"><input type="checkbox" id="rsLucas"> Boy</label><div class="gaterow"><button id="rsGo" class="big danger">Reset ticked</button></div>`;
    $('rsGo').onclick = () => { if ($('rsNora').checked) wipe('nora'); if ($('rsLucas').checked) wipe('lucas'); closePanel(); profileCards(); toast('Records reset.'); };
  };
  openPanel(''); ask();
}

// ---------- title drawing ----------
function sunburst(c, cx, cy, a, b, rot) { c.fillStyle = a; c.fillRect(0, 0, W, H); c.save(); c.translate(cx, cy); c.rotate(rot); c.fillStyle = b; for (let i = 0; i < 12; i++) { c.rotate(Math.PI / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(-95, -900); c.lineTo(95, -900); c.fill(); } c.restore(); }
function lantern(c, x, y, s, lit, crack) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (lit) { const g = c.createRadialGradient(0, -40, 5, 0, -40, 150); g.addColorStop(0, 'rgba(255,236,153,.9)'); g.addColorStop(1, 'rgba(255,236,153,0)'); c.fillStyle = g; c.fillRect(-150, -190, 300, 300); }
  Art.rr(c, -8, 0, 16, 60, 4, '#5c3d2e', '#15131f', 3); Art.rr(c, -30, -8, 60, 12, 5, '#8d6e4a', '#15131f', 3);
  Art.rr(c, -26, -72, 52, 66, 12, lit ? '#ffe066' : '#495057', '#15131f', 3.5);
  c.beginPath(); c.moveTo(-34, -70); c.lineTo(0, -98); c.lineTo(34, -70); c.closePath(); c.fillStyle = '#e03131'; c.fill(); c.strokeStyle = '#15131f'; c.lineWidth = 3.5; c.stroke();
  if (lit) Art.star(c, 0, -40, 14, '#fff');
  if (crack) { c.strokeStyle = '#15131f'; c.lineWidth = 3; c.beginPath(); c.moveTo(-10, -70); c.lineTo(4, -48); c.lineTo(-6, -34); c.lineTo(8, -10); c.stroke(); }
  c.restore();
}
function caption(c, pairs) { zhDraw(c, pairs, W / 2, 506, 34, '#fff', [['#15131f', 7]]); }
// ---------- Chinese text with zhuyin beside each character ----------
const ZT = {
  title: [['光', 'ㄍㄨㄤ'], ['靈', 'ㄌㄧㄥˊ'], ['大', 'ㄉㄚˋ'], ['冒', 'ㄇㄠˋ'], ['險', 'ㄒㄧㄢˇ']],
  sub: [['找', 'ㄓㄠˇ'], ['回', 'ㄏㄨㄟˊ'], ['知', 'ㄓ'], ['識', 'ㄕˋ'], ['神', 'ㄕㄣˊ'], ['燈', 'ㄉㄥ']],
  start: [['開', 'ㄎㄞ'], ['始', 'ㄕˇ']],
  who: [['誰', 'ㄕㄟˊ'], ['要', 'ㄧㄠˋ'], ['玩', 'ㄨㄢˊ'], ['？', '']],
  fresh: [['新', 'ㄒㄧㄣ'], ['冒', 'ㄇㄠˋ'], ['險', 'ㄒㄧㄢˇ']],
  level: [['等', 'ㄉㄥˇ'], ['級', 'ㄐㄧˊ']],
  crystal: [['水', 'ㄕㄨㄟˇ'], ['晶', 'ㄐㄧㄥ']],
  reset: [['重', 'ㄔㄨㄥˊ'], ['設', 'ㄕㄜˋ'], ['紀', 'ㄐㄧˋ'], ['錄', 'ㄌㄨˋ']],
  cap1: [['很', 'ㄏㄣˇ'], ['久', 'ㄐㄧㄡˇ'], ['以', 'ㄧˇ'], ['前', 'ㄑㄧㄢˊ'], ['，', ''], ['神', 'ㄕㄣˊ'], ['燈', 'ㄉㄥ'], ['照', 'ㄓㄠˋ'], ['亮', 'ㄌㄧㄤˋ'], ['大', 'ㄉㄚˋ'], ['地', 'ㄉㄧˋ']],
  cap2: [['迷', 'ㄇㄧˊ'], ['霧', 'ㄨˋ'], ['大', 'ㄉㄚˋ'], ['王', 'ㄨㄤˊ'], ['出', 'ㄔㄨ'], ['現', 'ㄒㄧㄢˋ'], ['！', '']],
  cap3: [['神', 'ㄕㄣˊ'], ['燈', 'ㄉㄥ'], ['碎', 'ㄙㄨㄟˋ'], ['成', 'ㄔㄥˊ'], ['五', 'ㄨˇ'], ['顆', 'ㄎㄜ'], ['水', 'ㄕㄨㄟˇ'], ['晶', 'ㄐㄧㄥ'], ['！', '']],
  cap4: [['兩', 'ㄌㄧㄤˇ'], ['位', 'ㄨㄟˋ'], ['小', 'ㄒㄧㄠˇ'], ['英', 'ㄧㄥ'], ['雄', 'ㄒㄩㄥˊ'], ['出', 'ㄔㄨ'], ['發', 'ㄈㄚ'], ['！', '']],
};
const TONES = 'ˊˇˋ';
const splitZy = z => TONES.includes(z.slice(-1)) ? [z.slice(0, -1), z.slice(-1)] : [z, ''];
// HTML version: zhuyin stacked to the right of each character, tone mark beside the last symbol.
function zh(pairs) { return '<span class="zh">' + pairs.map(([ch, z]) => { const [sym, tone] = splitZy(z); return `<span class="zc">${ch}${z ? `<span class="zy">${[...sym].map(x => `<span>${x}</span>`).join('')}</span><span class="zt">${tone}</span>` : ''}</span>`; }).join('') + '</span>'; }
// Canvas version. strokes: [[colour, width], …] drawn before the fill.
function zhDraw(c, pairs, cx, y, size, fill, strokes) {
  const zw = size * 0.46, widths = pairs.map(p => size + (p[1] ? zw : 0)), total = widths.reduce((a, b) => a + b, 0);
  let x = cx - total / 2; c.save(); c.lineJoin = 'round'; c.textBaseline = 'alphabetic';
  const put = (txt, px, py, font, align) => { c.font = font; c.textAlign = align; for (const [col, lw] of strokes || []) { c.strokeStyle = col; c.lineWidth = lw * (font.includes(' ' + Math.round(size) + 'px') ? 1 : 0.32); c.strokeText(txt, px, py); } c.fillStyle = fill; c.fillText(txt, px, py); };
  pairs.forEach(([ch, z], i) => {
    put(ch, x + size / 2, y, `900 ${Math.round(size)}px ${FONT_ZH}`, 'center');
    if (z) { const [sym, tone] = splitZy(z), zs = size * 0.33, n = sym.length, top = y - size * 0.42 - (n * zs) / 2 + zs * 0.85; [...sym].forEach((s, k) => put(s, x + size + zs * 0.55, top + k * zs, `700 ${zs.toFixed(1)}px ${FONT_ZH}`, 'center')); if (tone) put(tone, x + size + zs * 1.12, top + (n - 1) * zs - zs * 0.1, `700 ${zs.toFixed(1)}px ${FONT_ZH}`, 'center'); }
    x += widths[i];
  });
  c.restore();
}
function logo(c, y, s) {
  c.save(); c.translate(W / 2, y); c.scale(s, s); c.rotate(-0.025);
  const g = c.createLinearGradient(0, -80, 0, 0); g.addColorStop(0, '#fff9db'); g.addColorStop(1, '#ffd43b');
  zhDraw(c, ZT.title, 0, 0, 92, g, [['#15131f', 20], ['#7048e8', 9]]);
  zhDraw(c, ZT.sub, 0, 54, 38, '#fff', [['#15131f', 8]]);
  c.restore();
}
function heroFor(k, t) { const s = loadSave(k); return { ...looksOf(s), kid: k, color: s.color, cape: s.cape || (k === 'nora' ? '#ffd43b' : '#e03131'), weapon: weaponLook(s.weapon, s.cls), armor: ARMORS[s.armor].tier, cls: s.created ? s.cls : null, t, glow: false }; }
const storybookCover = new Image();
storybookCover.src = 'art/forest-cover-v1.jpg';
function drawStorybookCover(c) {
  if (!storybookCover.complete || !storybookCover.naturalWidth) return false;
  const scale = Math.max(W / storybookCover.naturalWidth, H / storybookCover.naturalHeight);
  const width = storybookCover.naturalWidth * scale, height = storybookCover.naturalHeight * scale;
  c.drawImage(storybookCover, (W - width) / 2, (H - height) / 2, width, height);
  const shade = c.createLinearGradient(0, 0, 0, H);
  shade.addColorStop(0, 'rgba(7, 21, 27, .58)');
  shade.addColorStop(.5, 'rgba(7, 21, 27, .1)');
  shade.addColorStop(1, 'rgba(7, 21, 27, .46)');
  c.fillStyle = shade;
  c.fillRect(0, 0, W, H);
  return true;
}

let titleLooks = null;
function drawTitle(c) {
  const I = G.intro, t = I.t, gt = G.t;
  if (!titleLooks || (G.t | 0) % 3 === 0) titleLooks = { nora: heroFor('nora', 0), lucas: heroFor('lucas', 0) };
  if (I.state === 'wait') { if (!drawStorybookCover(c)) {
    sunburst(c, W / 2, 330, '#2b1d5c', '#3b2a7a', gt * 0.05);
    lantern(c, W / 2, 400, 1.5, true);
  }
  logo(c, 150, 1); return; }
  if (I.state === 'menu') { if (!drawStorybookCover(c)) sunburst(c, W / 2, 620, '#f59f00', '#ffd43b', gt * 0.06); logo(c, 100, 0.8); [90, 215, 860].forEach((x, i) => Art.lumi(c, SPECIES[STARTERS[i]], x, 520, 1.3, gt, false, i === 2)); return; }
  // intro animation
  if (t < 3.3) {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a1433'); g.addColorStop(1, '#3b2a7a'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) { const x = Art.hash(i, 1) * W, y = Art.hash(i, 2) * 300; c.globalAlpha = 0.4 + Math.sin(gt * 3 + i) * 0.3; Art.ell(c, x, y, 1.6, 1.6, '#fff'); } c.globalAlpha = 1;
    c.fillStyle = '#231a47'; c.beginPath(); c.ellipse(W / 2, 560, 620, 180, 0, 0, 6.283); c.fill();
    const broke = t > 2.5;
    lantern(c, W / 2, 410, 1.7, !broke, t > 2.1);
    if (t > 1.5) { const k = clamp((t - 1.5) / 1.2, 0, 1); for (let i = 0; i < 14; i++) { const side = i % 2 ? 1 : -1; c.globalAlpha = 0.75; Art.ell(c, W / 2 + side * (620 - k * 430) + Math.sin(gt * 2 + i) * 20, 200 + (i * 53) % 330, 110, 70, i % 3 ? '#4c3a8f' : '#2b1d5c'); } c.globalAlpha = 1; Art.fog(c, { kind: 'wisp', col: '#2b1d5c', boss: true, eye: '#ff6b6b', sym: '…' }, W / 2 + 250 - k * 40, 300, 2.6 * k + 0.01, gt); }
    if (broke) { const k = (t - 2.5) / 0.8; c.fillStyle = `rgba(255,255,255,${clamp(1 - k * 1.6, 0, 1)})`; c.fillRect(0, 0, W, H); WORLD_ORDER.slice(0, 5).forEach((id, i) => { const a = -Math.PI * 0.9 + i * Math.PI * 0.2; Art.crystal(c, W / 2 + Math.cos(a) * k * 520, 330 + Math.sin(a) * k * 420, 22, WORLDS[id].crystal, gt); }); }
    caption(c, t < 1.5 ? ZT.cap1 : t < 2.5 ? ZT.cap2 : ZT.cap3);
  } else {
    const k = clamp((t - 3.3) / 0.5, 0, 1), e = 1 - Math.pow(1 - k, 3);
    sunburst(c, W / 2, 330, '#f76707', '#ffd43b', gt * 0.3);
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 4; for (let i = 0; i < 16; i++) { const y = 60 + i * 30, x = ((gt * 900 + i * 173) % (W + 300)) - 150; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 120, y); c.stroke(); }
    Art.hero(c, -200 + e * 500, 490, 2.4, Object.assign({}, titleLooks.nora, { t: gt }));
    Art.hero(c, W + 200 - e * 500, 490, 2.4, Object.assign({}, titleLooks.lucas, { t: gt + 1 }));
    if (t > 4.2) { const z = clamp((t - 4.2) / 0.3, 0, 1); const sh = t < 4.7 ? Math.sin(gt * 80) * 5 * (1 - (t - 4.2) / 0.5) : 0; c.save(); c.translate(sh, 0); logo(c, 130, 3 - 2 * z); c.restore(); }
    else caption(c, ZT.cap4);
  }
}
function drawEnding(c) {
  const E = G.end, t = G.t, l = activeLumi();
  // The cast stands high on the screen so the story box below never covers them.
  if (E.scene === 0) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a1433'); g.addColorStop(1, '#4a3a7a'); c.fillStyle = g; c.fillRect(0, 0, W, H); } else sunburst(c, W / 2, 210, '#f59f00', '#ffd43b', t * 0.05);
  c.save(); c.translate(0, -92);
  if (E.scene === 0) {
    for (let i = 0; i < 12; i++) { c.globalAlpha = 0.5 * (1 - E.k * 0.8); Art.ell(c, (i * 97 + Math.sin(t + i) * 30) % W, 120 + (i * 61) % 260, 120, 70, i % 2 ? '#4c3a8f' : '#2b1d5c'); } c.globalAlpha = 1;
    c.fillStyle = '#2c2542'; c.beginPath(); c.ellipse(W / 2, 560, 640, 170, 0, 0, 6.283); c.fill();
    Art.fog(c, { kind: 'wisp', col: E.k > 0.7 ? '#7048e8' : '#2b1d5c', boss: E.k < 0.45, eye: E.k > 0.7 ? '#ffe066' : '#ff6b6b', sym: '…' }, 690, 430, 2.6 - 1.75 * E.k, t);
  } else {
    c.fillStyle = '#69b55d'; c.beginPath(); c.ellipse(W / 2, 570, 680, 180, 0, 0, 6.283); c.fill();
    lantern(c, W / 2, 392, 1.6, E.scene >= 2, false);
    WORLD_ORDER.slice(0, 5).forEach((id, i) => { const a = t * 0.8 + i * 1.257, r = E.scene >= 2 ? 105 : 190; Art.crystal(c, W / 2 + Math.cos(a) * r, 250 + Math.sin(a) * r * 0.45, 17, WORLDS[id].crystal, t); });
    Art.villager(c, { col: '#7048e8', hair: '#adb5bd', hat: 'elder', ph: 3 }, 800, 452, 1.7, t);
    Art.villager(c, { col: '#5f3dc4', hair: '#343a40', ph: 1, sad: E.scene < 2 }, 680, 452, 1.35, t);
    if (E.scene >= 3) Art.lumi(c, SPECIES.echo, 590, 462, 1.6, t, true, true);
    if (E.scene >= 2 && Math.random() < 0.1) burst(W / 2, 160, '#fff9db', 3);
  }
  if (l) Art.lumi(c, SPECIES[l.sp], 345, 462, 1.6, t, isEvo(l), false);
  Art.hero(c, 225, 452, 1.9, heroLook({ avatar: selectedAvatar?.art, weapon: null, armor: 0 }));
  c.restore();
}
function drawCreator(c) {
  if (!drawStorybookCover(c)) sunburst(c, 250, 330, '#3b2a7a', '#4c3a8f', G.t * 0.05);
  Art.ell(c, 250, 452, 170, 34, 'rgba(255,255,255,.14)');
  Art.hero(c, 190, 448, 3, heroLook({ avatar: selectedAvatar?.art, weapon: null, armor: 0 }));
  const ml = G.mirror && activeLumi(); if (ml) Art.lumi(c, SPECIES[ml.sp], 372, 466, 1.8, G.t, isEvo(ml), true); else Art.lumi(c, SPECIES[pickSp], 372, 466, 1.8, G.t, false, true);
}

// ---------- loop ----------
function mini2(el, draw) { const d = DPR; if (el.width !== 72 * d) { el.width = 72 * d; el.height = 72 * d; } const c = el.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, 72, 72); draw(c); }
// Which track fits what is on screen right now.
const WORLD_MUSIC = { hub: 'village', w1: 'march', w2: 'starry', w3: 'starry', w4: 'march', w5: 'lantern', w6: 'mystery' };
function musicNow() {
  if (G.mode === 'title') return G.intro.state === 'wait' ? null : 'anthem';
  if (G.mode === 'evolve') return null;
  if (G.mode === 'create' || G.breakOn) return 'box';
  if (G.mode === 'ending') return G.end && G.end.scene >= 2 ? 'anthem' : 'mystery';
  if (G.mode === 'battle' && G.B) return G.B.e.boss ? 'mystery' : 'battle';
  return WORLD_MUSIC[G.world] || 'village';
}
let lastTs = 0;
function frame(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0); lastTs = ts; G.t += dt;
  for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; tw.t += dt; tw.fn(Math.min(1, tw.t / tw.dur)); if (tw.t >= tw.dur) { tweens.splice(i, 1); tw.res(); } }
  stepParts(dt);
  Snd.setMusic(musicNow()); Snd.duck(QS ? 0.4 : 1);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (G.mode === 'title') { if (G.intro.state === 'play') { G.intro.t += dt; if (G.intro.t > 6.2) showMenu(); } drawTitle(ctx); }
  else if (G.mode === 'create') drawCreator(ctx);
  else if (G.mode === 'evolve' && G.evo) { G.evo.k += dt * (G.fast ? 30 : 1); Evolve.draw(ctx, G.evo.st, Math.min(G.evo.k, Evolve.DURATION + 2), dt, n => { if (n === 'rise') Snd.play('warp'); if (n === 'reveal') { Snd.play('capture'); setTimeout(() => Snd.play('level'), 350); } }); if (G.evo.k > Evolve.DURATION + 1.2 && G.evo.done) { const d = G.evo.done; G.evo.done = null; d(); } }
  else if (G.mode === 'ending' && G.end) { drawEnding(ctx); drawParts(ctx); }
  else if (G.mode === 'world') { if (held && !G.path.length) worldKey(held[0], held[1]); stepWorld(dt); drawWorld(ctx); drawParts(ctx); }
  if (QS && S) mini2($('qFace'), c => Art.hero(c, 36, 106, 1.05, heroLook({ glow: false, weapon: null, cls: null, cape: null })));
  if (G.mode === 'battle' && G.B) { const B = G.B; B.eHit = Math.max(0, B.eHit - dt); B.hHit = Math.max(0, B.hHit - dt); B.shake = Math.max(0, B.shake - dt); drawBattle(ctx); }
  if (dlg && G.me) Portraits.drawMe($('dlgMeFace'), G.t);
  if (dlg && G.face) Portraits.draw($('dlgFace'), G.face, G.t, G.t - G.faceT0 < Math.min(2.4, 0.5 + dlg.lines[0].length * 0.03));
  if (G.fade > 0) { ctx.fillStyle = `rgba(21,19,31,${G.fade})`; ctx.fillRect(0, 0, W, H); }
  requestAnimationFrame(frame);
}
