// ---------- panels ----------
function worldUnlocked(id) { const i = WORLD_ORDER.indexOf(id); return i === 0 || !!S.bosses[WORLD_ORDER[i - 1]]; }
async function gatePanel() {
  Snd.play('tap');
  let h = '<h2>🌀 Teleport Gate</h2><div class="worlds">';
  if (G.world !== 'hub') h += `<button class="wcard" data-w="hub"><span class="wi">🏡</span><b>Hearthome Village</b><small>Shop, healer and Elder Lumen</small></button>`;
  for (const id of WORLD_ORDER) {
    const w = WORLDS[id], open = worldUnlocked(id), done = !!S.bosses[id];
    h += `<button class="wcard${done ? ' done' : ''}" data-w="${id}" ${open && id !== G.world ? '' : 'disabled'}><span class="wi">${open ? w.icon : '🔒'}</span><b>${w.name}${done ? ' ✅' : ''}</b><small>${open ? w.blurb : 'Win the crystal before this one first'}</small><i>Level ${w.lvl}+</i></button>`;
  }
  h += '</div>';
  const p = openPanel(h);
  $('panelBody').querySelectorAll('.wcard').forEach(b => b.addEventListener('click', () => closePanel(b.dataset.w)));
  const dest = await p;
  if (dest) await teleport(dest);
}
async function teleport(dest) {
  G.busy = true; Snd.play('warp');
  await tween(0.45, k => { G.fade = k; });
  loadWorld(dest); save();
  await tween(0.45, k => { G.fade = 1 - k; });
  G.fade = 0; G.busy = false;
  const q = S.quests[dest];
  if (dest !== 'hub' && !q.accepted && !S.bosses[dest]) toast('❗ Talk to the villager with the ! mark');
}
function shopRows(tab) {
  let h = '';
  if (tab === 'weapons') for (const [id, w0] of Object.entries(WEAPONS)) { const w = weaponLook(id, S.cls); if (w.found && !S.weapons.includes(id)) continue; const own = S.weapons.includes(id), eq = S.weapon === id; h += `<div class="row"><canvas class="ricon" data-weapon="${id}"></canvas><div><b>${w.name}</b><small>+${w.atk} attack${w.found ? ' · found treasure' : ''}</small>${perkList(w.perks)}</div>${eq ? '<em>Equipped</em>' : own ? `<button data-eq="weapon:${id}">Equip</button>` : `<button data-buy="weapon:${id}" ${S.gold >= w.price ? '' : 'disabled'}>🪙 ${w.price}</button>`}</div>`; }
  if (tab === 'armour') for (const [id, a] of Object.entries(ARMORS)) { const own = S.armors.includes(id), eq = S.armor === id; h += `<div class="row"><canvas class="ricon" data-armor="${id}"></canvas><div><b>${a.name}</b><small>+${a.hp} health · blocks ${a.def}</small>${perkList(a.perks)}</div>${eq ? '<em>Equipped</em>' : own ? `<button data-eq="armor:${id}">Equip</button>` : `<button data-buy="armor:${id}" ${S.gold >= a.price ? '' : 'disabled'}>🪙 ${a.price}</button>`}</div>`; }
  if (tab === 'items') h += `<div class="row"><span class="ri">🧪</span><div><b>Potion</b><small>Heals in battle · you have ${S.potion}</small></div><button data-buy="item:potion" ${S.gold >= 15 ? '' : 'disabled'}>🪙 15</button></div><div class="row"><span class="ri">🔮</span><div><b>Capture Orb</b><small>Catches a weak wild Lumi · you have ${S.orb}</small></div><button data-buy="item:orb" ${S.gold >= 20 ? '' : 'disabled'}>🪙 20</button></div>`;
  return h;
}
function gearPanel(title, shop) {
  let tab = shop ? 'weapons' : 'weapons';
  const render = () => {
    $('panelBody').innerHTML = `<h2>${title} <span class="coins">🪙 ${S.gold}</span></h2><div class="tabs">${['weapons', 'armour', 'items'].map(t => `<button class="tab${t === tab ? ' on' : ''}" data-tab="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div><div class="rows">${shop ? shopRows(tab) : bagRows(tab)}</div>`; drawMinis($('panelBody'));
    $('panelBody').querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; Snd.play('tap'); render(); });
    $('panelBody').querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { const [k, id] = b.dataset.buy.split(':'); const price = k === 'weapon' ? WEAPONS[id].price : k === 'armor' ? ARMORS[id].price : id === 'potion' ? 15 : 20; if (S.gold < price) return; S.gold -= price; if (k === 'weapon') { S.weapons.push(id); S.weapon = id; } else if (k === 'armor') { const full = S.hp >= maxHP(); S.armors.push(id); S.armor = id; if (full) S.hp = maxHP(); } else S[id]++; Snd.play('coin'); save(); updateHUD(); render(); });
    $('panelBody').querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { const [k, id] = b.dataset.eq.split(':'); S[k] = id; S.hp = Math.min(S.hp, maxHP()); Snd.play('tap'); save(); updateHUD(); render(); });
    $('panelBody').querySelectorAll('[data-use]').forEach(b => b.onclick = () => { if (S.potion < 1 || S.hp >= maxHP()) return; S.potion--; S.hp = Math.min(maxHP(), S.hp + Math.round(maxHP() * 0.5)); Snd.play('heal'); save(); updateHUD(); render(); });
  };
  const p = openPanel(''); render(); return p;
}
function bagRows(tab) {
  let h = '';
  if (tab === 'weapons') for (const id of S.weapons) { const w = weaponLook(id, S.cls); h += `<div class="row"><canvas class="ricon" data-weapon="${id}"></canvas><div><b>${w.name}</b><small>+${w.atk} attack</small>${perkList(w.perks)}</div>${S.weapon === id ? '<em>Equipped</em>' : `<button data-eq="weapon:${id}">Equip</button>`}</div>`; }
  if (tab === 'armour') for (const id of S.armors) { const a = ARMORS[id]; h += `<div class="row"><canvas class="ricon" data-armor="${id}"></canvas><div><b>${a.name}</b><small>+${a.hp} health · blocks ${a.def}</small>${perkList(a.perks)}</div>${S.armor === id ? '<em>Equipped</em>' : `<button data-eq="armor:${id}">Equip</button>`}</div>`; }
  if (tab === 'items') h += `<div class="row"><span class="ri">🧪</span><div><b>Potion × ${S.potion}</b><small>Heals half your health</small></div><button data-use="potion" ${S.potion && S.hp < maxHP() ? '' : 'disabled'}>Use</button></div><div class="row"><span class="ri">🔮</span><div><b>Capture Orb × ${S.orb}</b><small>Use in battle on a weak wild Lumi</small></div></div>`;
  return h;
}
const shopPanel = () => gearPanel('🛒 Brom\'s Shop', true);
const bagPanel = () => gearPanel('🎒 Bag', false);
function teamPanel(inBattle) {
  const render = () => {
    let h = `<h2>🐾 ${KIDS[S.kid].name}'s Lumis</h2><div class="rows">`;
    S.party.forEach((l, i) => { const sp = SPECIES[l.sp]; h += `<div class="row lumirow"><canvas data-lumi="${l.sp}" data-evo="${isEvo(l) ? 1 : 0}"></canvas><div><b>${lumiName(l)}${l.nick ? ` <i class="sp">the ${speciesName(l)}</i>` : ''} <span class="el el-${sp.el}">${sp.el}</span></b><small>Level ${l.lv}${isEvo(l) ? '' : ' · evolves at Level 6'}<br>${MOVES[l.sp].map((nm, t) => l.lv >= MOVE_LV[t] ? `${nm} ${movePower(l, t)}` : `🔒 Lv ${MOVE_LV[t]}`).join(' · ')}</small><div class="bar xp"><i style="width:${l.xp / lumiNeed(l.lv) * 100}%"></i></div></div><button class="ren" data-ren="${i}" aria-label="Give ${speciesName(l)} a name">✏️</button>${i === S.active ? '<em>Active</em>' : `<button data-act="${i}">Choose</button>`}</div>`; });
    h += '</div><p class="hint">Fire beats Leaf · Leaf beats Water · Water beats Fire</p>';
    $('panelBody').innerHTML = h; drawMinis($('panelBody'));
    $('panelBody').querySelectorAll('[data-act]').forEach(b => b.onclick = () => { S.active = +b.dataset.act; Snd.play('tap'); save(); if (inBattle) closePanel(); else render(); });
    $('panelBody').querySelectorAll('[data-ren]').forEach(b => b.onclick = async () => { Snd.play('tap'); closePanel(); await nameLumi(S.party[+b.dataset.ren]); teamPanel(inBattle); });
  };
  const p = openPanel(''); render(); return p;
}
// Ask for a Lumi's nickname: type one, or tap a suggestion.
function nameLumi(l) {
  const sp = SPECIES[l.sp]; let pick = l.nick || '';
  const render = () => {
    $('panelBody').innerHTML = `<h2>Name your ${speciesName(l)}</h2><div class="nameRow"><canvas data-lumi="${l.sp}" data-evo="${isEvo(l) ? 1 : 0}"></canvas><input id="nickIn" type="text" maxlength="12" autocomplete="off" placeholder="${speciesName(l)}" value="${pick}" aria-label="Lumi name"></div><div class="pills">${NICKS[sp.el].map(n => `<button class="pill${pick === n ? ' on' : ''}" data-nick="${n}">${n}</button>`).join('')}</div><div class="gaterow"><button id="nickSkip" class="ghost dark">No name</button><button id="nickOk" class="big">Keep this name</button></div>`;
    drawMinis($('panelBody'));
    $('nickIn').oninput = () => { pick = cleanNick($('nickIn').value); };
    $('panelBody').querySelectorAll('[data-nick]').forEach(b => b.onclick = () => { pick = b.dataset.nick; Snd.play('tap'); render(); });
    $('nickOk').onclick = () => { l.nick = cleanNick(pick); Snd.play('ok'); save(); closePanel(); };
    $('nickSkip').onclick = () => { l.nick = ''; Snd.play('tap'); save(); closePanel(); };
  };
  const p = openPanel('', { noClose: true }); render(); return p;
}
function questPanel() {
  const w = WORLDS[G.world], q = S.quests[G.world] || {};
  let h = `<h2>📜 Quest Log</h2><div class="crys">${WORLD_ORDER.slice(0, 5).map(id => `<span class="${S.bosses[id] ? 'got' : ''}" style="--c:${WORLDS[id].crystal}">◆<small>${WORLDS[id].name}</small></span>`).join('')}</div>`;
  if (G.world === 'hub') { const nx = WORLD_ORDER.find(id => !S.bosses[id]); h += nx ? `<p><b>Next:</b> step through the gate to ${WORLDS[nx].name} (${WORLDS[nx].blurb}).</p>` : '<p>The Great Lantern is whole again. You saved Hearthome!</p>'; }
  else if (S.bosses[G.world]) h += `<p>✅ ${w.name} is saved.</p>`;
  else h += `<p><b>${w.name}:</b> ${w.problem}</p><p>${q.kills >= 3 ? '✅' : '⬜'} Defeat 3 Fog creatures (${Math.min(3, q.kills || 0)}/3)<br>⬜ Defeat ${w.boss.name}</p>`;
  h += `<p class="hint">Answers right first try: ${S.stats.first} · Questions answered: ${S.stats.asked} · Battles won: ${S.stats.wins}</p>`;
  const mem = WORLD_ORDER.slice(0, 5).filter(id => S.bosses[id]).map(id => LORE[id].memory);
  h += '<h3 class="memh">Memories of the boy in the fog</h3>' + (mem.length ? '<ol class="mems">' + mem.map(m => `<li><b>${m[0]}</b> ${m[1]}</li>`).join('') + '</ol>' : '<p class="hint">Beat a Fog boss to find the first memory.</p>');
  h += `<label class="chk"><input type="checkbox" id="optRead" ${S.readBtns ? 'checked' : ''}> Read buttons out loud before choosing them</label>`;
  const p = openPanel(h); $('optRead').onchange = e => { S.readBtns = e.target.checked; save(); }; return p;
}

// ---------- drawing ----------
// The magic mirror in Hearthome: an oval glass in a gold frame that shimmers.
function drawMirror(c, px, py, t) {
  const cx = px + TILE / 2, by = py + TILE - 6;
  Art.ell(c, cx, by + 2, 15, 4, 'rgba(0,0,0,.25)');
  Art.rr(c, cx - 3, by - 10, 6, 12, 2, '#8d6e4a', Art.INK, 1.5); Art.ell(c, cx, by - 1, 11, 4, '#b5712c', Art.INK, 1.5);
  Art.ell(c, cx, by - 30, 14, 20, '#ffd43b', Art.INK, 2.2);
  const g = c.createLinearGradient(cx - 10, by - 48, cx + 10, by - 12); g.addColorStop(0, '#e7f5ff'); g.addColorStop(0.5 + Math.sin(t * 1.5) * 0.3, '#a5d8ff'); g.addColorStop(1, '#d0bfff');
  Art.ell(c, cx, by - 30, 10, 16, g); c.save(); c.globalAlpha = 0.7; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 4, by - 40); c.lineTo(cx - 1, by - 34); c.stroke(); c.restore();
  Art.star(c, cx, by - 52, 4, '#fff9db', Art.INK, 1); Art.sparkle(c, cx + 9, by - 40, t, 0.3); Art.sparkle(c, cx - 8, by - 22, t, 0.75);
}
const storybookOak = new Image();
storybookOak.src = 'art/enchanted-oak-v1.png';
function drawWorldTree(c, px, py, pal, t, x, y) {
  if (pal.tree !== 'round' || !storybookOak.complete || !storybookOak.naturalWidth) {
    Art.tree(c, px, py, TILE, pal, t, x, y);
    return;
  }
  const scale = .66 + Art.hash(x, y) * .10;
  const height = TILE * 2 * scale, width = height * storybookOak.naturalWidth / storybookOak.naturalHeight;
  const footX = px + TILE / 2, footY = py + TILE - 5;
  Art.ell(c, footX, footY - 1, width * .25, 4, 'rgba(18, 40, 25, .24)');
  c.drawImage(storybookOak, footX - width / 2, footY - height, width, height);
}

function drawWorld(c) {
  const w = WORLDS[G.world], pal = PAL[G.world], t = G.t, cx = Math.round(G.cam.x), cy = Math.round(G.cam.y);
  c.fillStyle = Art.shade(pal.g1, -0.45); c.fillRect(0, 0, W, H);
  const x0 = Math.floor(cx / TILE), y0 = Math.max(0, Math.floor(cy / TILE)), x1 = Math.min(23, x0 + 21), y1 = Math.min(15, y0 + 13);
  c.save(); c.translate(-cx, -cy);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const ch = G.grid[y][x]; Art.ground(c, 'TRH"'.includes(ch) ? '.' : ch, x * TILE, y * TILE, TILE, pal, t, x, y); }
  const list = [];
  for (let y = Math.max(0, y0 - 2); y <= y1; y++) for (let x = Math.max(0, x0 - 2); x <= x1; x++) {
    const ch = G.grid[y][x], px = x * TILE, py = y * TILE;
    if (ch === 'T') list.push([py + TILE - 5, () => drawWorldTree(c, px, py, pal, t, x, y)]);
    else if (ch === 'R') list.push([py + TILE - 6, () => Art.rock(c, px, py, TILE, pal)]);
    else if (ch === '"') { Art.tallGrass(c, px, py, TILE, pal, t, x, y, false); list.push([py + TILE + 1, () => Art.tallGrass(c, px, py, TILE, pal, t, x, y, true)]); }
    else if (ch === 'H' && tileAt(x - 1, y) !== 'H' && tileAt(x, y - 1) !== 'H') list.push([py + TILE * 2 - 4, () => Art.house(c, px, py, TILE, pal, ['#e03131', '#1c7ed6', '#f08c00', '#7048e8'][(x + y) % 4])]);
  }
  for (const e of G.ents) {
    if (e.gone) continue; const px = e.x * TILE, py = e.y * TILE, fx = px + TILE / 2, fy = py + TILE - 8;
    if (e.type === 'chest') list.push([fy, () => Art.chest(c, px, py, TILE, e.open, t)]);
    else if (e.type === 'hidden') list.push([py, () => Art.sparkle(c, fx + Math.sin(e.ph * 9) * 8, py + 26, t, e.ph)]);
    else if (e.type === 'gate') list.push([py + 2, () => Art.gate(c, px, py, TILE, t, G.world === 'hub' ? '#9775fa' : w.crystal)]);
    else if (e.type === 'mirror') list.push([fy, () => drawMirror(c, px, py, t)]);
    else if (e.type === 'wall') list.push([fy, () => Art.fogWall(c, px, py, TILE, t)]);
    else if (e.type === 'npc') { const q = S.quests[G.world]; const v = e.role === 'giver' ? Object.assign({}, e.v, { mark: S.bosses[G.world] ? '' : q.accepted ? '…' : '!', sad: !S.bosses[G.world] }) : e.role === 'elder' && (!S.metElder || (S.crystals.length === 5 && !S.elderTold && !S.won)) ? Object.assign({}, e.v, { mark: '!' }) : e.v; list.push([fy, () => Art.villager(c, v, fx, fy, 0.9, t)]); }
    else if (e.type === 'fog') list.push([fy, () => Art.fog(c, e.def, fx, fy, 0.8, t)]);
    else if (e.type === 'boss') list.push([fy, () => Art.fog(c, e.def, fx, fy, 0.82, t)]);
  }
  const hx = G.fx * TILE + TILE / 2, hy = G.fy * TILE + TILE - 8;
  const l = activeLumi();
  if (l) { G.fol = G.fol || { x: hx - 30, y: hy }; const d = Math.hypot(hx - G.fol.x, hy - G.fol.y); if (d > 34) { G.fol.x += (hx - G.fol.x) * 0.09; G.fol.y += (hy - G.fol.y) * 0.09; } if (d > 300) { G.fol.x = hx - 30; G.fol.y = hy; } list.push([G.fol.y - 1, () => Art.lumi(c, SPECIES[l.sp], G.fol.x, G.fol.y, 0.62, t, isEvo(l), hx < G.fol.x)]); }
  list.push([hy, () => Art.hero(c, hx, hy, 0.62, heroLook({ walk: G.walking }))]);
  list.sort((a, b) => a[0] - b[0]); for (const d of list) d[1]();
  // name badge last so nothing covers it
  const nm = KIDS[S.kid].name.toUpperCase(); c.font = '900 11px system-ui'; c.textAlign = 'center'; const bw = c.measureText(nm).width + 12;
  Art.rr(c, hx - bw / 2, hy - 80, bw, 16, 8, KIDS[S.kid].col, '#fff', 1.5); c.fillStyle = '#fff'; c.fillText(nm, hx, hy - 68);
  if (G.path.length) { const [tx, ty] = G.path[G.path.length - 1]; c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 3; c.beginPath(); c.ellipse(tx * TILE + TILE / 2, ty * TILE + TILE / 2 + 6, 13 + Math.sin(t * 8) * 2, 6, 0, 0, 6.283); c.stroke(); }
  c.restore();
  // soft vignette
  const g = c.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, G.world === 'w6' ? 'rgba(10,5,30,.55)' : 'rgba(20,20,50,.28)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
}
