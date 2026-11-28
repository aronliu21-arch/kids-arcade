function zhVoice() { // the shared Chinese voice choice (same key as every Kids Arcade game), else the best Taiwan voice
  try { const id = localStorage.getItem('dinoworld.zhvoice'); if (id) { const v = speechSynthesis.getVoices().find(x => x.voiceURI === id); if (v) return v; } } catch (e) {}
  return window.KAVoice ? KAVoice.voiceFor('zh-TW') : null;
}
/* ---------- audio: one narrator at a time, recorded English clips, device voice for Chinese ---------- */
const AU = (function () {
  let started = 0, ac = null, master, sfxG, musG, voxG, src = null, token = 0, musicOn = false, musTimer = 0, speaking = false;
  const bufs = {}, loading = {};
  const FAST = /[?&]fast=1/.test(location.search);
  function ctx() {
    if (ac) return ac;
    try {
      const C = window.AudioContext || window.webkitAudioContext; ac = new C();
      master = ac.createGain(); master.connect(ac.destination);
      sfxG = ac.createGain(); sfxG.gain.value = .55; sfxG.connect(master);
      musG = ac.createGain(); musG.gain.value = 0; musG.connect(master);
      voxG = ac.createGain(); voxG.gain.value = 1; voxG.connect(master);
    } catch (e) { ac = null; }
    return ac;
  }
  function unlock() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    const c = ctx(); if (!c) return;
    if (c.state !== 'running') c.resume();
    try { const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch (e) {}
    if (!unlock.tts) { unlock.tts = 1; try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {} }
  }
  function load(key) {
    if (key in bufs) return Promise.resolve(bufs[key]);
    if (loading[key]) return loading[key];
    if (!ctx()) return Promise.resolve(null);
    loading[key] = fetch('audio/en/' + key + '.mp3').then(r => r.ok ? r.arrayBuffer() : Promise.reject())
      .then(b => new Promise((res, rej) => ac.decodeAudioData(b, res, rej)))
      .then(buf => (bufs[key] = buf)).catch(() => (bufs[key] = null));
    return loading[key];
  }
  function preload(keys) { keys.forEach(k => load(k)); }
  function stop() {
    token++;
    if (src) { try { src.onended = null; src.stop(); } catch (e) {} src = null; }
    try { speechSynthesis.cancel(); } catch (e) {}
    speaking = false; G.onSpeak(false);
  }
  const timeout = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);
  function enVoice() {
    const id = DB.enVoice; if (!id || id === 'rec') return null;
    try { return speechSynthesis.getVoices().find(v => v.voiceURI === id) || null; } catch (e) { return null; }
  }
  function tts(text, lang, pitch, my) {
    return new Promise(res => {
      let done = false; const fin = () => { if (!done) { done = true; res(); } };
      try {
        const clean = text.replace(/[「」“”"~…]/g, ' ');
        const u = new SpeechSynthesisUtterance(clean);
        if (lang === 'zh') { const v = zhVoice(); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'zh-TW'; u.rate = .82; u.pitch = pitch || 1.1; }
        else { const v = enVoice() || (window.KAVoice && KAVoice.voiceFor('en-US')); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US'; u.rate = .9; u.pitch = Math.min(1.25, Math.max(.8, pitch || 1.05)); }
        u.__ka = 1; u.onend = fin; u.onerror = fin;
        speechSynthesis.speak(u);
        setTimeout(fin, 1500 + clean.length * (lang === 'zh' ? 330 : 90)); // Safari sometimes drops onend
      } catch (e) { setTimeout(fin, 600); }
      const iv = setInterval(() => { if (my !== token) { clearInterval(iv); fin(); } if (done) clearInterval(iv); }, 120);
    });
  }
  // say(key) -> Promise<boolean>: true when it finished, false if something else interrupted it
  async function say(key, opts) {
    opts = opts || {};
    const line = LINES[key]; if (!line) return true;
    stop(); const my = token;
    if (opts.prompt) G.lastPrompt = key;
    G.showBubble(key);
    speaking = true; G.onSpeak(true, line.v); started = Date.now();
    if (FAST) { await wait(40); }
    else if (DB.muted) { await wait(Math.min(3500, 700 + (DB.lang === 'zh' ? line.zh.length * 110 : line.en.length * 40))); }
    else if (DB.lang === 'zh') {
      const a = ANIMALS[line.v]; await tts(line.zs || line.zh, 'zh', a ? a.pitch : 1.12, my);
    } else {
      let buf = null;
      if (DB.enVoice === 'rec' || !DB.enVoice) buf = await timeout(load(key), 3000);
      if (my !== token) return false;
      if (buf && ac) {
        await new Promise(res => {
          if (ac.state !== 'running') ac.resume();
          const s = ac.createBufferSource(); s.buffer = buf; s.connect(voxG); src = s;
          s.onended = () => { if (src === s) src = null; res(); };
          s.start(0);
          setTimeout(res, buf.duration * 1000 + 600);
        });
      } else {
        const a = ANIMALS[line.v]; await tts(line.sp || line.en, 'en', a ? (.9 + a.pitch * .15) : 1.05, my);
      }
    }
    if (my !== token) return false;
    speaking = false; G.onSpeak(false); G.hideBubbleSoon();
    return true;
  }
  async function seq(keys, opts) { for (const k of keys) { if (!(await say(k, opts))) return false; } return true; }
  // speak raw text (zhuyin sound for a symbol in Chinese mode)
  async function raw(text, lang) { stop(); const my = token; if (DB.muted || FAST) { await wait(300); return true; } await tts(text, lang, 1.1, my); return my === token; }

  /* --- synthesized sound effects (no files) --- */
  function tone(f, t, d, type, g, f2) {
    if (!ac || DB.muted) return; const o = ac.createOscillator(), e = ac.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g || .3, t + .015); e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(e); e.connect(sfxG); o.start(t); o.stop(t + d + .05);
  }
  function noise(t, d, f, q, g, f2) {
    if (!ac || DB.muted) return; const n = ac.createBuffer(1, Math.max(1, ac.sampleRate * d | 0), ac.sampleRate), da = n.getChannelData(0);
    for (let i = 0; i < da.length; i++) da[i] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(); s.buffer = n; const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(f, t); if (f2) bp.frequency.exponentialRampToValueAtTime(f2, t + d); bp.Q.value = q || 1;
    const e = ac.createGain(); e.gain.setValueAtTime(g || .4, t); e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(bp); bp.connect(e); e.connect(sfxG); s.start(t);
  }
  function sfx(name) {
    if (!ctx() || DB.muted) return; const t = ac.currentTime + .01;
    switch (name) {
      case 'tap': tone(660, t, .09, 'sine', .25, 990); break;
      case 'pop': tone(420, t, .12, 'sine', .35, 900); break;
      case 'count': tone(520 + Math.random() * 60, t, .16, 'triangle', .3, 780); break;
      case 'rustle': noise(t, .45, 2600, .7, .35); noise(t + .12, .35, 3400, .7, .25); break;
      case 'thud': tone(140, t, .25, 'sine', .5, 60); noise(t, .2, 300, 1, .3); break;
      case 'splash': noise(t, .6, 1800, .6, .5, 500); tone(300, t, .2, 'sine', .2, 900); break;
      case 'boing': tone(180, t, .45, 'sine', .45, 520); break;
      case 'sparkle': [1320, 1568, 1976, 2637].forEach((f, i) => tone(f, t + i * .07, .25, 'sine', .14)); break;
      case 'ding': tone(880, t, .35, 'sine', .3); tone(1320, t + .09, .4, 'sine', .22); break;
      case 'soft': tone(330, t, .22, 'sine', .22, 260); break;
      case 'whoosh': noise(t, .5, 600, .8, .35, 3000); break;
      case 'step': noise(t, .06, 900, 1.5, .08); break;
      case 'fanfare': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, t + i * .13, i > 3 ? .5 : .22, 'triangle', .28)); break;
      case 'shake': for (let i = 0; i < 4; i++) noise(t + i * .08, .1, 3000, 1, .25); break;
    }
  }
  /* --- gentle marimba loop for the title / map / sticker book only --- */
  const MEL = [0, 4, 7, 9, 7, 4, 2, 4, 0, 2, 4, 7, 9, 12, 9, 7];
  function music(on) {
    musicOn = on && DB.music && !DB.muted;
    if (!ctx()) return;
    musG.gain.cancelScheduledValues(ac.currentTime);
    musG.gain.linearRampToValueAtTime(musicOn ? .16 : 0, ac.currentTime + (musicOn ? 1.2 : .6));
    clearInterval(musTimer);
    if (!musicOn) return;
    let i = 0; const beat = .32;
    const play = () => {
      if (!musicOn || !ac) return; const t = ac.currentTime + .05;
      for (let k = 0; k < 4; k++, i++) {
        const n = MEL[i % MEL.length], f = 392 * Math.pow(2, n / 12), tt = t + k * beat;
        const o = ac.createOscillator(), e = ac.createGain(); o.type = 'sine'; o.frequency.value = f;
        e.gain.setValueAtTime(.0001, tt); e.gain.exponentialRampToValueAtTime(.5, tt + .01); e.gain.exponentialRampToValueAtTime(.0001, tt + .5);
        o.connect(e); e.connect(musG); o.start(tt); o.stop(tt + .55);
        if (k === 0) { const b = ac.createOscillator(), be = ac.createGain(); b.type = 'triangle'; b.frequency.value = f / 4; be.gain.setValueAtTime(.0001, tt); be.gain.exponentialRampToValueAtTime(.35, tt + .02); be.gain.exponentialRampToValueAtTime(.0001, tt + 1.1); b.connect(be); be.connect(musG); b.start(tt); b.stop(tt + 1.2); }
      }
    };
    play(); musTimer = setInterval(play, beat * 4 * 1000);
  }
  function duck(on) { if (ac && musicOn) musG.gain.setTargetAtTime(on ? .05 : .16, ac.currentTime, .15); }
  return { skip: () => { if (speaking && Date.now() - started > 700) stop(); }, unlock, say, seq, raw, stop, sfx, music, preload, load, duck, isSpeaking: () => speaking, FAST };
})();
