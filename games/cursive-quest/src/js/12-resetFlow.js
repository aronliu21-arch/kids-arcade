function resetFlow() {
  const cb = h('input', { type: 'checkbox', style: 'width:28px;height:28px' });
  const el = h('div', {}, h('h2', {}, 'Reset whose records?'), h('p', { class: 'muted' }, 'This clears stars, progress, seen questions and settings on this device.'),
    h('label', { class: 'row', style: 'justify-content:center;font-size:22px;margin:12px' }, cb, 'Nora'),
    h('div', { class: 'row', style: 'justify-content:center' }, h('button', { class: 'btn ghost', onclick: () => close() }, 'Cancel'),
      h('button', { class: 'btn pink', onclick: () => { if (!cb.checked) { toast('Tick a name first'); return; } S = freshState(); save(); close(); applyBg(); toast('Records reset.'); showTitle(); } }, 'Reset')));
  const close = overlay(el);
}

// ---------- Title / intro / welcome ----------
function showTitle() {
  const it = $('#intro'); it.classList.add('on'); it.innerHTML = '';
  it.append(h('div', { class: 'rays' }));
  const stage = h('div', { class: 'stage' }); it.append(stage);
  const title = h('div', { class: 'ititle', html: cursiveSVG("Nora's Cursive Quest", { unit: 60, color: '#fff', sw: 13, style: 'overflow:visible' }) });
  stage.append(title, h('div', { class: 'nora-intro', html: noraSVG({ kit: 'explorer' }) }));
  const btn = h('button', { class: 'btn big gold tapstart', style: 'position:absolute;left:50%;bottom:3%;transform:translateX(-50%);font-size:30px;min-height:84px;padding:16px 40px' }, '▶ Tap to start');
  stage.append(btn);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.onclick = async () => {
    Snd.init(); Snd.setMusicWanted(true); Snd.play('unlock');
    btn.remove();
    let skipped = false; const skip = h('div', { class: 'skip' }, 'Tap anywhere to skip ⏭'); it.append(skip);
    const done = () => { if (skipped) return; skipped = true; it.classList.remove('on'); it.onclick = null; showWelcome(); };
    setTimeout(() => { it.onclick = done; }, 300);
    // animate title being written + Nora jumping in
    const paths = $$('path', title); let delay = 0;
    if (!reduce) {
      for (const p of paths) { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p.style.transition = `stroke-dashoffset ${len / 900}s linear ${delay}s`; delay += len / 900 + 0.05; }
      requestAnimationFrame(() => requestAnimationFrame(() => paths.forEach(p => p.style.strokeDashoffset = 0)));
      const n = $('.nora-intro', stage); n.animate([{ transform: 'translate(-50%,110%)' }, { transform: 'translate(-50%,-6%)' }, { transform: 'translate(-50%,0)' }], { duration: 1100, easing: 'cubic-bezier(.2,1.4,.4,1)' });
      $('.ponytail', n).animate([{ transform: 'rotate(0)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(0)' }], { duration: 1400, delay: 900 });
      for (let i = 0; i < 10; i++) { const f = h('div', { class: 'floaty', style: `left:${5 + rnd(88)}%;top:${10 + rnd(70)}%;animation-delay:${(i * 0.3).toFixed(1)}s;font-size:${30 + rnd(30)}px` }, pick(['✨', '⭐', '🌟', '💜', 'a', 'b', 'c'].map(x => x))); f.animate([{ opacity: 0, transform: 'scale(.2)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 600, delay: 300 + i * 150, fill: 'both' }); stage.append(f); }
      // speed lines
      const sl = h('div', { class: 'speed-lines', html: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%">${Array.from({ length: 14 }, (_, i) => `<line x1="${50 + 60 * Math.cos(i / 14 * 6.28)}" y1="${70 + 60 * Math.sin(i / 14 * 6.28)}" x2="${50 + 40 * Math.cos(i / 14 * 6.28)}" y2="${70 + 40 * Math.sin(i / 14 * 6.28)}" stroke="white" stroke-width=".6" opacity=".7"/>`).join('')}</svg>` });
      stage.prepend(sl); sl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1500, fill: 'forwards' });
    }
    Voice.say('Hi Nora! Ready for a cursive adventure?');
    await sleep(reduce ? 1200 : Math.max(4200, delay * 1000 + 1200));
    done();
  };
  CUR = { kind: 'title', choose: () => { if (btn.isConnected) btn.click(); else it.click(); } };
}
function showWelcome() {
  const s = screen('', false); Snd.setMusicWanted(true);
  const first = !S.companion;
  const hero = h('div', { class: 'hero card' });
  hero.append(h('div', { class: 'nora-wrap', html: noraSVG({ kit: 'explorer' }) }));
  const right = h('div', {});
  right.append(h('h1', {}, first ? 'Welcome, Nora! 🌟' : 'Welcome back, Nora! 🌟'), h('p', { style: 'font-size:clamp(20px,2.6vw,26px)' }, first ? 'Are you ready to become a Cursive Superstar?' : `You have ⭐ ${S.stars} stars. Let's keep going!`));
  if (first) right.append(h('h3', {}, 'Choose your adventure buddy:'));
  const grid = h('div', { class: 'comp-grid' }); let sel = S.companion || null;
  const avail = COMPANIONS.filter(c => owned(null, c));
  for (const c of (first ? avail : [])) {
    const b = h('button', { class: 'comp' + (sel === c.id ? ' sel' : ''), 'data-comp': c.id, html: companionSVG(c.id) }); b.append(h('div', {}, c.name));
    b.onclick = () => { sel = c.id; $$('.comp', grid).forEach(x => x.classList.toggle('sel', x === b)); Snd.play('pop'); Voice.say(`Hi Nora! I'm ${c.name}. Let's go on a cursive quest together!`); go.disabled = false; };
    grid.append(b);
  }
  if (first) right.append(grid);
  else right.append(h('div', { class: 'row' }, h('div', { style: 'width:120px;height:120px', html: companionSVG(S.companion, S.acc) }), h('p', {}, `${companionName()} missed you!`)));
  const go = h('button', { class: 'btn big', style: 'margin-top:14px', disabled: first && !sel, onclick: () => { if (!sel) return; S.companion = sel; save(); Snd.play('unlock'); goMap(); } }, first ? 'Let\'s go! ✨' : 'Continue my quest ✨');
  right.append(go); hero.append(right); s.append(hero);
  Voice.say(first ? 'Welcome, Nora! Are you ready to become a Cursive Superstar? Choose your adventure buddy!' : `Welcome back, Nora! ${companionName()} missed you!`);
  CUR = { kind: 'welcome', choose: () => { if (first && !sel) $('.comp', grid).click(); go.click(); } };
}

// ---------- Test hook (harmless for players) ----------
window.__test = {
  state: () => ({ screen: CUR ? CUR.kind : 'none', stars: S.stars, done: false }),
  solve: () => CUR && CUR.choose && CUR.choose(),
  next: () => CUR && CUR.next && CUR.next(),
  S: () => S, go: { map: () => goMap(), world: n => openWorld(n), arcade: () => openArcade(), parent: () => openParent(), rewards: t => openRewards(t), gate: n => runGate(n) },
  games: () => GAMES, worldLessons, GEN, layoutText, scoreInk, recognize,
};

// ---------- Boot ----------
function boot() {
  load(); Voice.init(); applyBg(); ensureDaily();
  const unlock = () => { Snd.init(); };
  document.addEventListener('pointerdown', unlock, { once: true });
  showTitle();
}
boot();

