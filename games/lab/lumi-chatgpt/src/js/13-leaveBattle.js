function leaveBattle() { G.B = null; $('battle').hidden = true; showHUD(true); G.mode = 'world'; G.grace = 5; G.parts = []; updateHUD(); save(); }
async function finishBattle(how) {
  const B = G.B, e = B.e, n = KIDS[S.kid].name, w = WORLDS[G.world];
  $('bMoves').innerHTML = '';
  if (how === 'lose') {
    setMood('sad', 5); Snd.play('lose'); setLog(`${n} is out of health…`); await wait(0.8);
    await tween(0.4, k => { G.fade = k; }); leaveBattle(); S.hp = maxHP(); loadWorld('hub', true); save();
    await tween(0.4, k => { G.fade = 1 - k; }); G.fade = 0;
    await say(['You ran out of health, so Elder Lumen carried you home.', 'Nothing was lost. Rest, buy a potion or better armour, and try again!'], 'Healer Rosa'); return;
  }
  S.stats.wins++; setMood('happy', 5);
  const gold = Math.round(e.gold * (S.cls === 'ranger' ? 1.25 : 1) * ((WEAPONS[S.weapon].perks || []).includes('coins') ? 1.5 : 1));
  if (how === 'capture') {
    S.party.push({ sp: e.sp, lv: e.lv, xp: 0 }); setLog(`Gotcha! ${e.name} joined ${n}'s team!`); await wait(0.5);
    addXP(e.xp); await say([`${e.name} was captured! It joins your team at Level ${e.lv}.`, 'Open 🐾 Team to choose which Lumi fights beside you.']);
    await nameLumi(S.party[S.party.length - 1]);
    return leaveBattle();
  }
  Snd.play('win'); await tween(0.5, k => { B.eScale = 1 - k; }); burst(720, 290, '#d0bfff', 26);
  setLog(`${e.name} ${e.wild ? 'ran away' : 'faded into mist'}!`);
  S.gold += gold; addXP(e.xp); addLumiXP(e.xp); updateHUD();
  await say(`Victory! +${e.xp} XP` + (gold ? ` and ${gold} coins.` : '.'));
  await playEvolutions();
  await announceSkills();
  if (B.ent) {
    B.ent.gone = true; const q = S.quests[G.world];
    if (B.ent.type === 'fog') { q.kills++; if (q.kills === 3) { G.ents.filter(x => x.type === 'wall').forEach(x => { x.gone = true; }); toast(`🌫️ The fog wall has lifted! Find ${w.boss.name}.`); } }
    if (B.ent.type === 'boss') return bossWon();
  }
  leaveBattle();
}
async function bossWon() {
  const w = WORLDS[G.world], n = KIDS[S.kid].name, id = G.world, final = id === 'w6';
  S.bosses[id] = 1; if (!final) S.crystals.push(id); else S.won = true; S.hp = maxHP();
  G.ents.filter(x => x.type === 'wall').forEach(x => { x.gone = true; });
  const bossEnt = G.ents.find(x => x.type === 'boss'); if (bossEnt && LORE[id].was) G.ents.push(restoredNpc(id, bossEnt.x, bossEnt.y));
  leaveBattle(); Snd.play('level'); burst(W / 2, H / 2, w.crystal, 50);
  if (final) await ending();
  else {
    const L = LORE[id];
    await say(`The Fog pours out of ${w.boss.name} like steam, and someone much smaller is left standing there.`);
    await say(L.after, L.was);
    await say([`The ${w.name} Knowledge Crystal is yours! ${S.crystals.length} of 5 found.`, `Memory found: "${L.memory[0]}". You can read it again in your Quest log.`]);
    setMood('worried', 4); await say(L.voice, 'A voice in the fog');
    await say(S.crystals.length === 5 ? 'The way to the Fog Citadel is open. But first, Elder Lumen wants to talk to you in Hearthome.' : `A new land has opened at the Teleport Gate: ${WORLDS[WORLD_ORDER[WORLD_ORDER.indexOf(id) + 1]].name}.`);
  }
  save(); G.breakOn = true;
  await openPanel(`<div class="break"><div class="bigc" style="color:${w.crystal}">◆</div><h2>Great practice! Time for a break</h2><p>${final ? 'You finished the whole adventure.' : 'Your adventure is saved. The next land will be waiting.'}</p><p class="tip">💡 ${w.tip}</p><button id="btnFinish" class="big">Finish for now</button></div>`, { noClose: true, cls: 'center' });
}
document.addEventListener('click', ev => { if (ev.target && ev.target.id === 'btnFinish') { Snd.play('tap'); closePanel(); goTitle(); } });

function drawBattle(c) {
  const B = G.B, e = B.e, pal = PAL[G.world], t = G.t;
  const sx = B.shake > 0 ? Math.sin(t * 90) * 7 * (B.shake / 0.3) : 0;
  c.save(); c.translate(sx, 0);
  const sky = c.createLinearGradient(0, 0, 0, 280); sky.addColorStop(0, pal.sky[0]); sky.addColorStop(1, pal.sky[1]); c.fillStyle = sky; c.fillRect(-20, 0, W + 40, 290);
  // sunburst + far hills
  c.save(); c.translate(W / 2, 250); c.globalAlpha = 0.13; c.fillStyle = '#fff'; for (let i = 0; i < 14; i++) { c.rotate(Math.PI / 7); c.beginPath(); c.moveTo(0, 0); c.lineTo(-40, -700); c.lineTo(40, -700); c.fill(); } c.restore();
  c.fillStyle = Art.shade(pal.hill, -0.12); c.beginPath(); c.moveTo(-20, 290); for (let x = -20; x <= W + 20; x += 40) c.lineTo(x, 235 - Math.sin(x * 0.012) * 26 - Math.sin(x * 0.031) * 10); c.lineTo(W + 20, 290); c.fill();
  c.fillStyle = pal.hill; c.beginPath(); c.moveTo(-20, 290); for (let x = -20; x <= W + 20; x += 40) c.lineTo(x, 262 - Math.sin(x * 0.009 + 2) * 18); c.lineTo(W + 20, 290); c.fill();
  const gr = c.createLinearGradient(0, 280, 0, H); gr.addColorStop(0, pal.g1); gr.addColorStop(1, Art.shade(pal.g1, -0.3)); c.fillStyle = gr; c.fillRect(-20, 280, W + 40, H);
  Art.ell(c, 250, 372, 170, 30, 'rgba(255,255,255,.16)'); Art.ell(c, 720, 356, 150, 26, 'rgba(255,255,255,.16)');
  // enemy
  if (B.eScale > 0.02) { c.save(); c.translate(720 + B.ex, 356); c.scale(B.eScale, B.eScale); if (e.wild) Art.lumi(c, SPECIES[e.sp], 0, 0, 2.6, t, false, true); else Art.fog(c, e, 0, 0, e.boss ? 2.3 : 2.4, t, B.eHit > 0); if (e.wild && B.eHit > 0) { c.globalAlpha = 0.5; Art.ell(c, 0, -50, 55, 55, '#fff'); } c.restore(); }
  // team
  const l = activeLumi();
  Art.lumi(c, SPECIES[l.sp], 345 + B.hx * 0.6 + B.lx, 384, 1.7, t, isEvo(l), false);
  c.save(); if (B.hHit > 0) c.globalAlpha = 0.55 + Math.sin(t * 60) * 0.3; Art.hero(c, 205 + B.hx, 376, 1.6, heroLook({ swing: B.swing, badge: true })); c.restore();
  if (B.fx) FX.draw[B.fx.name](c, B.fx.k, B.fx.s, B.fx.t, t);
  if (B.orb) { const k = B.orb.k, ox = 240 + (720 - 240) * k, oy = 300 - Math.sin(k * Math.PI) * 190 + (k * 0); c.save(); c.shadowColor = '#e599f7'; c.shadowBlur = 16; Art.ell(c, ox, oy, 13, 13, '#e599f7', '#15131f', 3); c.restore(); Art.ell(c, ox - 4, oy - 4, 4, 4, '#fff'); }
  drawParts(c);
  c.restore();
  // name plates
  plate(c, 548, 22, e.name + (e.wild ? `  Lv ${e.lv}` : ''), e.hp, e.max, e.el, e.boss ? '#e03131' : '#495057');
  plate(c, 28, 22, `${KIDS[S.kid].name} Lv ${S.lv}  +  ${lumiName(l)} Lv ${l.lv}`, S.hp, maxHP(), SPECIES[l.sp].el, KIDS[S.kid].col, true);
}
function plate(c, x, y, name, hp, max, el, col, mine) {
  Art.rr(c, x, y, 384, 58, 14, 'rgba(21,19,31,.82)', 'rgba(255,255,255,.35)', 2);
  Art.rr(c, x + 10, y + 9, 26, 26, 13, Art.EL[el]); c.font = '15px system-ui'; c.textAlign = 'center'; c.fillText({ fire: '🔥', water: '💧', leaf: '🍃', star: '⭐' }[el], x + 23, y + 28);
  c.fillStyle = '#fff'; c.font = `400 19px ${FONT_D}`; c.textAlign = 'left'; c.fillText(name, x + 44, y + 29);
  c.textAlign = 'right'; c.font = '700 13px system-ui'; c.fillStyle = '#ced4da'; c.fillText(`${Math.max(0, Math.ceil(hp))} / ${max}`, x + 372, y + 28);
  Art.rr(c, x + 12, y + 39, 360, 11, 5.5, '#343a40'); const f = clamp(hp / max, 0, 1); if (f > 0) Art.rr(c, x + 12, y + 39, Math.max(11, 360 * f), 11, 5.5, f > 0.5 ? '#51cf66' : f > 0.25 ? '#fcc419' : '#ff6b6b');
  if (mine) { c.textAlign = 'left'; c.font = '700 11px system-ui'; }
}

// The ending: the king turns back into a boy, and the Lantern is relit.
async function ending() {
  const n = KIDS[S.kid].name;
  G.mode = 'ending'; G.end = { scene: 0, k: 0 }; G.parts = []; showHUD(false);
  await say('The Fog thins. The great king shrinks, smaller and smaller, until only a boy-sized wisp of fog is left.');
  await tween(1.8, k => { G.end.k = k; });
  setMood('surprised', 3); await say('"I got it wrong," he whispers. "In front of everyone."', 'Wick');
  setMood('happy', 4); await say(`"I got lots wrong on the way here. Then I tried again. That is how I got here."`, n);
  G.end.scene = 1; Snd.play('level'); burst(W / 2, 150, '#ffe066', 40);
  await say('"Wick, I am sorry. I should have told you that night: a wrong answer is not the end. It is the start."', 'Elder Lumen');
  await say('Wick takes a deep breath and says it out loud, for everyone to hear: "Can I try again?"');
  G.end.scene = 2; Snd.play('win'); burst(W / 2, 150, '#fff9db', 60); setMood('happy', 30);
  await say(['The five crystals fly together. The Great Lantern blazes!', 'All across the land the Fog lifts, and new Lumis leap from the Lantern like sparks.']);
  G.end.scene = 3; Snd.play('capture');
  if (!S.party.some(l => l.sp === 'echo')) S.party.push({ sp: 'echo', lv: 10, xp: 0 });
  await say('"This one is called Echo," says Wick. "It is not afraid to answer out loud. I think it wants to go with you."', 'Wick');
  await say([`Echo joined ${n}'s team!`, `${n}, Hero of Hearthome! The Lantern is safe, and nobody here is afraid of a wrong answer any more.`]);
  G.mode = 'world'; G.end = null; G.parts = [];
}

// Title, intro, hero creator, main loop, input and the test hook.
const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
G.intro = { state: 'wait', t: 0 };

// ---------- title ----------
function profileCards() {
  $('whoText').innerHTML = zh(ZT.who); $('btnReset').innerHTML = zh(ZT.reset);
  $('saveNote').textContent = Cloud.ready ? '☁️ Progress is saved to your Claude account, on every device' : '💾 Progress is saved on this device';
  $('profiles').innerHTML = ['nora', 'lucas'].map(k => { const s = loadSave(k); return `<button class="pcard ${k}" data-kid="${k}"><canvas data-hero="${k}"></canvas><b style="background:${KIDS[k].col}">${KIDS[k].name}</b><small>${s.created ? `${zh(ZT.level)} ${s.lv} · ${zh(ZT.crystal)} ${s.crystals.length}/5${s.won ? ' 🏆' : ''}` : zh(ZT.fresh)}</small></button>`; }).join('');
  drawMinis($('profiles'));
  $('profiles').querySelectorAll('.pcard').forEach(b => b.addEventListener('click', () => pickKid(b.dataset.kid)));
}
function startIntro() {
  Snd.init(); Snd.play('tap'); $('btnStart').hidden = true;
  if (REDUCED) return showMenu();
  G.intro.state = 'play'; G.intro.t = 0;
}
function showMenu() { G.intro.state = 'menu'; G.intro.t = 99; profileCards(); $('menu').hidden = false; }
function goTitle() {
  save(); S = null; kid = null; G.mode = 'title'; G.B = null; G.parts = []; showHUD(false); $('battle').hidden = true; $('creator').hidden = true; $('title').hidden = false;
  G.breakOn = false; showMenu();
}
function pickKid(k) {
  Snd.play('tap'); kid = k; S = loadSave(k); $('title').hidden = true; $('menu').hidden = true;
  if (!S.created) showCreator(); else enterGame(false);
}
async function enterGame(fresh) {
  $('creator').hidden = true;
  S.hp = Math.min(S.hp || maxHP(), maxHP()); if (S.hp <= 0) S.hp = maxHP();
  loadWorld('hub'); save();
  if (fresh) { G.busy = true; await say(STORY.intro); G.busy = false; toast('❗ Walk to Elder Lumen. Tap where you want to go.'); }
}

// ---------- creator ----------
let pickSp = STARTERS[0], crStep = 0, crNick = '';
const cleanNick = t => String(t || '').replace(/[^\p{L}\p{N} '\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 12);
// The hero creator has three steps: how the hero looks, their class and gear, then their first Lumi.
// The magic mirror reuses the creator's Hair, Face and Hero steps, and keeps all progress.
function openMirror() { if (G.busy) return; G.mirror = true; G.path = []; G.mode = 'create'; showHUD(false); $('creator').hidden = false; crStep = 0; Snd.play('warp'); drawCreatorUI(); }
function closeMirror() { G.mirror = false; $('creator').hidden = true; S.hp = Math.min(S.hp, maxHP()); save(); G.mode = 'world'; showHUD(true); updateHUD(); setMood('happy', 3); Snd.play('ok'); burst(W / 2, H / 2 - 40, '#fff9db', 24); toast(`✨ Looking great, ${heroName(S)}!`); }
function showCreator() { G.mirror = false; G.mode = 'create'; $('creator').hidden = false; pickSp = STARTERS[0]; crStep = 0; crNick = ''; drawCreatorUI(); }
function drawCreatorUI() {
  const steps = G.mirror ? ['Hair', 'Face', 'Hero'] : ['Hair', 'Face', 'Hero', 'Lumi'], last = steps.length - 1, head = o => `data-head='${JSON.stringify(o)}'`;
  $('crName').textContent = [`${KIDS[kid].name}'s hair`, `${KIDS[kid].name}'s face`, `Choose ${KIDS[kid].name}'s gear`, `${KIDS[kid].name}'s first Lumi friend`][crStep];
  $('crSteps').innerHTML = steps.map((n, i) => `<span class="${i === crStep ? 'on' : i < crStep ? 'done' : ''}">${i + 1}. ${n}</span>`).join('');
  let h = '';
  if (crStep === 0) {
    h += `<div class="crsec"><h3>Hair style</h3><div class="opts heads">${HAIRS[kid].map(([id, n]) => `<button class="opt head${S.hair === id ? ' on' : ''}" data-hair="${id}" aria-label="${n} hair"><canvas ${head({ hair: id })}></canvas><b>${n}</b></button>`).join('')}</div></div>`;
    h += `<div class="crsec"><h3>Hair colour</h3><div class="sws">${HAIR_COLS.map(c => `<button class="sw${S.hairCol === c ? ' on' : ''}" data-hc="${c}" style="background:${c}" aria-label="Hair colour"></button>`).join('')}</div></div>`;
  } else if (crStep === 1) {
    h += `<div class="crsec"><h3>Eyes</h3><div class="opts heads six">${EYES.map(([id, n]) => `<button class="opt head${S.eyes === id ? ' on' : ''}" data-eyes="${id}" aria-label="${n} eyes"><canvas ${head({ eyes: id, extra: "" })}></canvas><b>${n}</b></button>`).join('')}</div></div>`;
    h += `<div class="crsec"><h3>Eye colour</h3><div class="sws">${EYE_COLS.map(c => `<button class="sw${S.eyeCol === c ? ' on' : ''}" data-ec="${c}" style="background:${c || (kid === 'nora' ? '#6b3a1e' : '#17141c')}" aria-label="Eye colour"></button>`).join('')}</div></div>`;
    h += `<div class="crsec"><h3>Extras</h3><div class="opts heads">${EXTRAS.map(([id, n]) => `<button class="opt head${S.extra === id ? ' on' : ''}" data-extra="${id}" aria-label="${n}"><canvas ${head({ extra: id })}></canvas><b>${n}</b></button>`).join('')}</div></div>`;
  } else if (crStep === 2) {
    h += `<div class="crsec"><h3>Hero class</h3><div class="opts">${Object.entries(CLASSES).map(([id, c]) => `<button class="opt${S.cls === id ? ' on' : ''}" data-cls="${id}"><span>${c.icon}</span><b>${c.name}</b><small>${c.perk}</small></button>`).join('')}</div></div>`;
    h += `<div class="crsec"><h3>Tunic</h3><div class="sws">${TUNICS.map(c => `<button class="sw${S.color === c ? ' on' : ''}" data-col="${c}" style="background:${c}" aria-label="Tunic colour"></button>`).join('')}</div></div>`;
    h += `<div class="crsec"><h3>Cape</h3><div class="sws">${CAPES.map(c => `<button class="sw${S.cape === c ? ' on' : ''}" data-cape="${c || ''}" style="background:${c || 'transparent'}" aria-label="${c ? 'Cape colour' : 'No cape'}">${c ? '' : '✕'}</button>`).join('')}</div></div>`;
    h += `<div class="crsec"><h3>Hero title</h3><div class="pills">${['', ...TITLES].map(tl => `<button class="pill${S.title === tl ? ' on' : ''}" data-title="${tl}">${tl ? KIDS[kid].name + ' ' + tl : 'Just ' + KIDS[kid].name}</button>`).join('')}</div></div>`;
  } else {
    h += `<div class="crsec"><div class="opts">${STARTERS.map(id => `<button class="opt lumi${pickSp === id ? ' on' : ''}" data-sp="${id}"><canvas data-lumi="${id}"></canvas><b>${SPECIES[id].name}</b><small class="el el-${SPECIES[id].el}">${SPECIES[id].el}</small></button>`).join('')}</div></div>`;
    h += `<div class="crsec"><h3>Give it a name</h3><input id="crNick" type="text" maxlength="12" autocomplete="off" placeholder="${SPECIES[pickSp].name}" value="${crNick}" aria-label="Lumi name"><div class="pills">${NICKS[SPECIES[pickSp].el].map(n => `<button class="pill${crNick === n ? ' on' : ''}" data-nick="${n}">${n}</button>`).join('')}</div></div>`;
  }
  $('crBody').innerHTML = h; drawMinis($('creator'));
  $('crBack').hidden = crStep === 0 && !G.mirror; $('crBack').textContent = G.mirror && crStep === 0 ? '✕ Close' : '◀ Back';
  $('btnBegin').textContent = crStep < last ? 'Next ▶' : G.mirror ? 'Done ✓' : 'Begin the adventure ▶';
  if (G.mirror) $('crName').textContent = ['Mirror: hair', 'Mirror: face', 'Mirror: gear and title'][crStep];
  const on = (sel, fn) => $('creator').querySelectorAll(sel).forEach(b => b.onclick = () => { fn(b); Snd.play('tap'); drawCreatorUI(); });
  on('[data-hair]', b => { S.hair = b.dataset.hair; }); on('[data-hc]', b => { S.hairCol = b.dataset.hc; }); on('[data-eyes]', b => { S.eyes = b.dataset.eyes; }); on('[data-ec]', b => { S.eyeCol = b.dataset.ec; }); on('[data-extra]', b => { S.extra = b.dataset.extra; });
  on('[data-cls]', b => { S.cls = b.dataset.cls; }); on('[data-col]', b => { S.color = b.dataset.col; }); on('[data-cape]', b => { S.cape = b.dataset.cape || null; }); on('[data-title]', b => { S.title = b.dataset.title; });
  on('[data-sp]', b => { if (pickSp !== b.dataset.sp) crNick = ''; pickSp = b.dataset.sp; }); on('[data-nick]', b => { crNick = b.dataset.nick; });
  const inp = $('crNick'); if (inp) inp.oninput = () => { crNick = cleanNick(inp.value); };
}
$('crBack').addEventListener('click', () => { if (G.mirror && crStep === 0) return closeMirror(); if (crStep > 0) { crStep--; Snd.play('tap'); drawCreatorUI(); } });
$('btnBegin').addEventListener('click', () => {
  if (G.mirror) { if (crStep < 2) { crStep++; Snd.play('tap'); drawCreatorUI(); } else closeMirror(); return; }
  if (crStep < 3) { crStep++; Snd.play('tap'); drawCreatorUI(); return; }
  Snd.play('ok'); S.created = true; S.party = [{ sp: pickSp, lv: 1, xp: 0, nick: cleanNick(crNick) }]; S.active = 0; S.hp = maxHP(); save(); enterGame(true);
});
