const panelOpen = () => !$('panel').hidden;

// Small canvases inside panels (portraits of heroes and Lumis).
function mini(el, draw, w, h) { const d = Math.min(2, window.devicePixelRatio || 1); el.width = w * d; el.height = h * d; el.style.width = w + 'px'; el.style.height = h + 'px'; const c = el.getContext('2d'); c.scale(d, d); draw(c); }
function drawMinis(root) {
  (root || document).querySelectorAll('canvas[data-lumi]').forEach(el => mini(el, c => Art.lumi(c, SPECIES[el.dataset.lumi], 32, 58, 1.15, 1, el.dataset.evo === '1'), 64, 64));
  (root || document).querySelectorAll('canvas[data-hero]').forEach(el => { const s = el.dataset.hero === 'me' ? S : loadSave(el.dataset.hero); mini(el, c => Art.hero(c, 60, 128, 1.15, { ...looksOf(s), kid: s.kid, color: s.color, cape: s.cape, cls: s.created ? s.cls : null, weapon: weaponLook(s.weapon, s.cls), armor: ARMORS[s.armor].tier, t: 0.3 }), 120, 136); });
  (root || document).querySelectorAll('canvas[data-head]').forEach(el => mini(el, c => Art.hero(c, 36, 99, 1.0, Object.assign({ kid: S.kid, color: S.color, cape: null, cls: null, weapon: null, armor: 0, t: 0.3, glow: false, mood: 'calm' }, looksOf(S), JSON.parse(el.dataset.head))), 72, 64));
  (root || document).querySelectorAll('canvas[data-weapon]').forEach(el => mini(el, c => { const w = weaponLook(el.dataset.weapon, S.cls), bow = w.kind === 'bow'; c.translate(bow ? 44 : 22, bow ? 47 : 54); c.rotate(bow ? 0.15 : 0.62); c.scale(bow ? 0.85 : 0.8, bow ? 0.85 : 0.8); Art.weapon(c, w); }, 60, 60));
  (root || document).querySelectorAll('canvas[data-armor]').forEach(el => mini(el, c => { c.beginPath(); c.rect(0, 0, 60, 60); c.clip(); Art.hero(c, 30, 78, 1.05, { ...looksOf(S), kid: S.kid, color: S.color, cape: null, cls: null, weapon: null, armor: ARMORS[el.dataset.armor].tier, t: 0.3, glow: false, mood: 'calm' }); }, 60, 60));
}

// ---------- HUD ----------
function updateHUD() {
  if (!S) return;
  $('hudName').textContent = `${heroName(S)} · Lv ${S.lv}`; $('hudName').style.background = KIDS[S.kid].col;
  $('hudHP').style.width = clamp(S.hp / maxHP() * 100, 0, 100) + '%'; $('hudHPt').textContent = `${Math.max(0, S.hp)} / ${maxHP()}`;
  $('hudXP').style.width = (S.xp / xpNeed(S.lv) * 100) + '%';
  $('hudGold').textContent = S.gold; $('hudCrys').textContent = `${S.crystals.length}/5`;
  $('btnSound').textContent = Snd.isMuted() ? '🔇' : '🔊';
}
function showHUD(on) { $('hud').hidden = !on; }

// Exploring: maps, walking, treasure, villagers, shop, gate.
const SOLID_TILES = 'TWRH';
function loadWorld(id, quiet) {
  const w = WORLDS[id]; G.world = id; G.ents = []; G.grid = []; G.path = []; G.after = null; G.walking = false; G.grace = 3;
  let ci = 0, fi = 0, vi = 0, start = null;
  const q = S.quests[id] || (S.quests[id] = { kills: 0, accepted: false });
  w.map.forEach((row, y) => {
    const out = [];
    [...row].forEach((ch, x) => {
      let t = ch;
      if (ch === 'C' || ch === 'c') { const key = id + ':' + ci, loot = w.chests[ci]; ci++; if (ch === 'C') G.ents.push({ type: 'chest', x, y, key, loot, open: !!S.chests[key], solid: true }); else if (!S.chests[key]) G.ents.push({ type: 'hidden', x, y, key, loot, ph: Math.random() }); t = '.'; }
      else if (ch === 'G') { G.ents.push({ type: 'gate', x, y }); if (id !== 'hub') start = [x + 1, y]; t = ','; }
      else if (ch === 'P') { start = [x, y]; t = ','; }
      else if (ch === 'N') { G.ents.push({ type: 'npc', role: 'giver', x, y, solid: true, v: Object.assign({ ph: 1 }, w.giver) }); t = '.'; }
      else if (ch === 'n') { const v = w.villagers[vi++ % w.villagers.length]; G.ents.push({ type: 'npc', role: 'chat', x, y, solid: true, v: Object.assign({ ph: vi * 2 }, v), li: 0 }); t = '.'; }
      else if (ch === 'S') { G.ents.push({ type: 'npc', role: 'shop', x, y, solid: true, v: { name: 'Shopkeeper Brom', col: '#e8590c', hair: '#5c3d2e', hat: 'shop', ph: 0, mark: '🛒' } }); t = '.'; }
      else if (ch === 'I') { G.ents.push({ type: 'npc', role: 'heal', x, y, solid: true, v: { name: 'Healer Rosa', col: '#f783ac', hair: '#862e9c', hat: 'heal', ph: 2, mark: '💗' } }); t = '.'; }
      else if (ch === 'M') { G.ents.push({ type: 'mirror', x, y, solid: true }); t = '.'; }
      else if (ch === 'L') { G.ents.push({ type: 'npc', role: 'elder', x, y, solid: true, v: { name: 'Elder Lumen', col: '#7048e8', hair: '#adb5bd', hat: 'elder', ph: 3 } }); t = '.'; }
      else if (ch === 'E') { const f = w.fogs[fi++ % w.fogs.length]; G.ents.push({ type: 'fog', x, y, solid: true, def: Object.assign({ ph: fi * 1.7 }, f) }); t = '.'; }
      else if (ch === 'B') { if (S.bosses[id] && LORE[id].was) G.ents.push(restoredNpc(id, x, y)); if (!S.bosses[id]) G.ents.push({ type: 'boss', x, y, solid: true, def: Object.assign({ boss: true, ph: 0 }, w.boss) }); t = '.'; }
      else if (ch === 'F') { if (!S.bosses[id] && q.kills < 3) G.ents.push({ type: 'wall', x, y, solid: true }); t = '.'; }
      out.push(t);
    });
    G.grid.push(out);
  });
  G.px = start[0]; G.py = start[1]; G.fx = G.px; G.fy = G.py;
  G.mode = 'world'; showHUD(true); updateHUD(); $('battle').hidden = true;
  if (!quiet) toast(`${w.icon || '🏡'} ${w.name}` + (w.subject !== 'mix' ? ` · ${Q.SUBJECTS[w.subject].name}` : ''));
  snapCam();
}
// After a boss is beaten, the person the Fog had changed stands in its place.
function restoredNpc(id, x, y) { const L = LORE[id]; return { type: 'npc', role: 'chat', x, y, solid: true, li: 0, v: { name: L.was, col: WORLDS[id].boss.col, hair: '#adb5bd', ph: 4, lines: [`I keep thinking about that boy. ${L.memory[1]}`, 'Thank you for clearing the Fog from my head.'] } }; }
const tileAt = (x, y) => (G.grid[y] || [])[x];
const entAt = (x, y) => G.ents.find(e => e.x === x && e.y === y && !e.gone);
function solidAt(x, y) { const t = tileAt(x, y); if (!t || SOLID_TILES.includes(t)) return true; const e = entAt(x, y); return !!(e && e.solid); }
function findPath(tx, ty, adjacent) {
  // BFS from the player. If adjacent, stop next to the target tile.
  const key = (x, y) => y * 64 + x, prev = new Map([[key(G.px, G.py), null]]), q = [[G.px, G.py]];
  const goal = (x, y) => adjacent ? Math.abs(x - tx) + Math.abs(y - ty) === 1 : x === tx && y === ty;
  while (q.length) {
    const [x, y] = q.shift();
    if (goal(x, y)) { const path = []; let k = key(x, y); while (prev.get(k) !== null) { path.unshift([k % 64, Math.floor(k / 64)]); k = prev.get(k); } return path; }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (solidAt(nx, ny) || prev.has(key(nx, ny))) continue; prev.set(key(nx, ny), key(x, y)); q.push([nx, ny]); }
  }
  return null;
}
function worldTap(lx, ly) {
  if (G.busy || dlg || panelOpen()) return;
  const tx = Math.floor((lx + G.cam.x) / TILE), ty = Math.floor((ly + G.cam.y) / TILE);
  const e = entAt(tx, ty);
  if (e && e.solid) { const p = findPath(tx, ty, true); if (p) { G.path = p; G.after = e; if (!p.length) arrive(); } return; }
  if (solidAt(tx, ty)) return;
  const p = findPath(tx, ty); if (p) { G.path = p; G.after = null; }
}
function worldKey(dx, dy) {
  if (G.busy || dlg || panelOpen() || G.path.length) return;
  const nx = G.px + dx, ny = G.py + dy, e = entAt(nx, ny);
  if (e && e.solid) { interact(e); return; }
  if (!solidAt(nx, ny)) { G.path = [[nx, ny]]; G.after = null; }
}
function arrive() { const e = G.after; G.after = null; if (e && !e.gone) interact(e); }
function stepWorld(dt) {
  G.walking = false;
  if (G.path.length && !G.busy && !dlg && !panelOpen()) {
    const [tx, ty] = G.path[0], sp = 6.5 * dt, dx = tx - G.fx, dy = ty - G.fy, d = Math.hypot(dx, dy);
    G.walking = true;
    if (d <= sp) { G.fx = tx; G.fy = ty; G.px = tx; G.py = ty; G.path.shift(); onStep(); if (!G.path.length) arrive(); }
    else { G.fx += dx / d * sp; G.fy += dy / d * sp; }
  }
  const tx = clamp(G.fx * TILE + TILE / 2 - W / 2, 0, 24 * TILE - W), ty = clamp(G.fy * TILE + TILE / 2 - H / 2, -76, 16 * TILE - H);
  G.cam.x += (tx - G.cam.x) * Math.min(1, dt * 8); G.cam.y += (ty - G.cam.y) * Math.min(1, dt * 8);
}
function snapCam() { G.cam.x = clamp(G.fx * TILE + TILE / 2 - W / 2, 0, 24 * TILE - W); G.cam.y = clamp(G.fy * TILE + TILE / 2 - H / 2, -76, 16 * TILE - H); }
function onStep() {
  const e = entAt(G.px, G.py);
  if (e && e.type === 'hidden') { G.path = []; openChest(e, true); return; }
  if (e && e.type === 'gate') { G.path = []; gatePanel(); return; }
  if (G.grace > 0) G.grace--;
  const w = WORLDS[G.world];
  if (tileAt(G.px, G.py) === '"' && w.wild.length && G.grace <= 0 && Math.random() < 0.2) { G.path = []; G.after = null; setMood('surprised', 1.5); wildBattle(); }
}

// ---------- interactions ----------
async function interact(e) {
  if (G.busy) return; G.path = [];
  if (e.type === 'chest') { if (!e.open) openChest(e); return; }
  if (e.type === 'mirror') { openMirror(); return; }
  if (e.type === 'wall') { const q = S.quests[G.world]; await say(`A wall of fog blocks the way. Defeat ${3 - q.kills} more Fog creature${3 - q.kills === 1 ? '' : 's'} to clear it.`); return; }
  if (e.type === 'fog' || e.type === 'boss') { startBattle(e); return; }
  if (e.type !== 'npc') return;
  const w = WORLDS[G.world], n = KIDS[S.kid].name;
  G.busy = true;
  if (e.role === 'chat') {
    const nw = (VILLAGER_NEWS[e.v.name] || []).find(([id]) => S.bosses[id] && !S.news[e.v.name + id]);
    if (nw) { S.news[e.v.name + nw[0]] = 1; save(); setMood('happy', 3); await say(nw[1], e.v.name); }
    else if (S.bosses[G.world] && VILLAGER_SAVED[e.v.name]) await say(VILLAGER_SAVED[e.v.name], e.v.name);
    else await say(e.v.lines[e.li++ % e.v.lines.length], e.v.name);
  }
  else if (e.role === 'elder') {
    if (!S.metElder) { await say(STORY.elderFirst(n), e.v.name); S.metElder = true; save(); }
    else if (S.won) await say([`The Great Lantern shines again, thanks to you, ${n}.`, 'Wick is my student again. He gets things wrong every day now, and laughs about it.'], e.v.name);
    else if (S.crystals.length === 5 && !S.elderTold) { setMood('sad', 6); await say(ELDER_CONFESS, e.v.name); S.elderTold = true; save(); }
    else { const nx = WORLD_ORDER.find(id => !S.bosses[id]); await say([`You hold ${S.crystals.length} of 5 Knowledge Crystals.`, `Your next adventure is in ${WORLDS[nx].name}. Use the gate behind me.`], e.v.name); }
  }
  else if (e.role === 'heal') { setMood('happy', 2.5); S.hp = maxHP(); Snd.play('heal'); burst(W / 2, H / 2, '#ff8fab', 20); updateHUD(); save(); await say('There you go, all better! Your health is full.', e.v.name); }
  else if (e.role === 'shop') { G.busy = false; await shopPanel(); return; }
  else if (e.role === 'giver') {
    const q = S.quests[G.world];
    if (S.bosses[G.world]) await say(`Thank you, ${n}! ${w.name} remembers everything again.`, e.v.name);
    else if (!q.accepted) { await say([w.problem, `Please help us, ${n}! Defeat 3 Fog creatures to clear the fog wall.`, `Then beat ${w.boss.name} to win back our Knowledge Crystal.`], e.v.name); q.accepted = true; save(); }
    else if (q.kills < 3) await say(`You have cleared ${q.kills} of 3 Fog creatures. Keep going!`, e.v.name);
    else await say(`The fog wall is gone! ${w.boss.name} is waiting. Be brave!`, e.v.name);
  }
  G.busy = false;
}
function lootText(l) { if (l.gold) return `${l.gold} coins`; if (l.weapon) return `the ${weaponLook(l.weapon, S.cls).name}`; return `${l.n} ${l.item === 'orb' ? 'Capture Orb' : 'Potion'}${l.n > 1 ? 's' : ''}`; }
async function openChest(e, hidden) {
  G.busy = true; S.chests[e.key] = 1; const l = e.loot;
  if (hidden) e.gone = true; else e.open = true;
  setMood('happy', 3); Snd.play('chest'); burst((e.x + 0.5) * TILE - G.cam.x, (e.y + 0.4) * TILE - G.cam.y, '#ffe066', 22);
  if (l.gold) S.gold += l.gold; else if (l.weapon) { if (!S.weapons.includes(l.weapon)) S.weapons.push(l.weapon); } else S[l.item] += l.n;
  updateHUD(); save();
  await say((hidden ? `${KIDS[S.kid].name} searched the ground and dug up ` : `${KIDS[S.kid].name} opened the chest and found `) + lootText(l) + '!');
  if (l.weapon && WEAPONS[l.weapon].atk > WEAPONS[S.weapon].atk) { S.weapon = l.weapon; save(); toast(`⚔️ Equipped ${weaponLook(l.weapon, S.cls).name} (+${WEAPONS[l.weapon].atk} attack)`); }
  G.busy = false;
}

