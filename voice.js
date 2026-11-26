/* Shared read-aloud voice for every Liu Kids Arcade game (same voices as Dino World).
   - Picks the best installed voice: Premium > Enhanced > other; Chinese prefers Taiwan (Lilian Premium first), then Hong Kong, then mainland.
   - One Chinese-voice choice per device, shared by all games (localStorage key 'dinoworld.zhvoice').
   - Reading: English rate .88, Chinese rate .8, pitch 1.15 (a character can pass its own pitch).
   - A sentence with any Chinese is read by the Chinese voice in one go (it reads English words too); quotes/symbols are not read aloud.

   Use in a game (games/<name>/index.html, or games/lab/<name>/index.html → adjust the ../):
     <script src="../../voice.js"></script>
     KAVoice.say('Hello!')                       // auto-picks the language
     KAVoice.say('你好!', {pitch:1.5})           // higher voice for a small character
     KAVoice.sayParts([['Hello','en-US'],['你好','zh-TW']], {onEnd(){...}})   // read both languages in turn
     KAVoice.stop()
     KAVoice.picker()                            // opens the "Chinese voice" chooser (put a 🗣 button on the start screen)
*/
(function () {
  if (window.KAVoice) return;
  const KEY = 'dinoworld.zhvoice', cache = {};
  const hasTTS = () => 'speechSynthesis' in window;
  function score(v, l) {
    const lang = (v.lang || '').replace('_', '-'), id = ((v.name || '') + ' ' + (v.voiceURI || '')).toLowerCase(); let sc = 0;
    if (lang === l) sc += 100; else if (l === 'zh-TW' && /^zh-(hk|hant)/i.test(lang)) sc += 60; else if (lang.slice(0, 2) === l.slice(0, 2)) sc += 40; else return -1;
    if (/premium/.test(id)) sc += 30; else if (/enhanced|neural|natural|online/.test(id)) sc += 20; if (/compact|eloquence|novelty/.test(id)) sc -= 15;
    if (l === 'zh-TW' && /lilian/.test(id)) sc += 200; if (l === 'zh-TW' && /mei-?jia/.test(id)) sc += 5;
    if (l === 'en-US' && /samantha|ava|zoe|allison|google us/.test(id)) sc += 5; if (v.localService) sc += 1; return sc;
  }
  const picked = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  function zhVoices() { try { return speechSynthesis.getVoices().filter(v => /^(zh|yue)/i.test(v.lang || '')).sort((a, b) => score(b, 'zh-TW') - score(a, 'zh-TW')); } catch (e) { return []; } }
  function voiceFor(l) {
    if (cache[l] !== undefined) return cache[l];
    try {
      const vs = speechSynthesis.getVoices();
      if (l === 'zh-TW' && picked()) { const v = vs.find(v => v.voiceURI === picked()); if (v) return (cache[l] = v); }
      let best = null, bs = -1; for (const v of vs) { const s = score(v, l); if (s > bs) { bs = s; best = v; } }
      if (vs.length) cache[l] = best; return best;
    } catch (e) { return null; }
  }
  try { speechSynthesis.onvoiceschanged = () => { for (const k in cache) delete cache[k]; }; } catch (e) {}
  const clean = t => String(t || '').replace(/[”」』]/g, ', ').replace(/[“"「『*_~#—–]/g, ' ').replace(/…/g, ', ')
    .replace(/([,,。!?!?.:])(\s*,)+/g, '$1').replace(/(,\s*){2,}/g, ', ').replace(/\s+/g, ' ').trim();
  const langOf = t => /[一-鿿]/.test(t) ? 'zh-TW' : 'en-US';
  function utter(text, l, pitch) {
    const u = new SpeechSynthesisUtterance(text); u.lang = l; const v = voiceFor(l);
    if (v) { u.voice = v; if (v.lang) u.lang = v.lang; }
    u.rate = l === 'en-US' ? .88 : .8; u.pitch = pitch || 1.15; return u;
  }
  function sayParts(parts, opts) {
    opts = opts || {}; if (!hasTTS()) { opts.onEnd && setTimeout(opts.onEnd, 50); return; }
    try {
      speechSynthesis.cancel();
      const list = (parts || []).map(([t, l]) => [clean(t), l || langOf(t)]).filter(([t]) => /[\p{L}\p{N}]/u.test(t));
      if (!list.length) { opts.onEnd && setTimeout(opts.onEnd, 50); return; }
      list.forEach(([t, l], k) => { const u = utter(t, l, opts.pitch); if (k === list.length - 1 && opts.onEnd) u.onend = () => setTimeout(opts.onEnd, 50); speechSynthesis.speak(u); });
    } catch (e) {}
  }
  const say = (text, opts) => sayParts([[text, langOf(clean(text))]], opts);
  const stop = () => { try { speechSynthesis.cancel(); } catch (e) {} };
  function picker() {
    const m = document.createElement('div');
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99999;display:flex;align-items:center;justify-content:center;padding:14px;font-family:-apple-system,system-ui,"PingFang TC",sans-serif';
    const btn = 'display:block;width:100%;margin:6px 0;min-height:50px;border:0;border-radius:12px;font:inherit;font-size:16px;text-align:left;padding:0 14px;cursor:pointer';
    const draw = () => {
      const vs = zhVoices(), cur = voiceFor('zh-TW');
      m.innerHTML = `<div style="background:#fff;color:#222;border-radius:18px;padding:16px;max-width:460px;width:100%"><h2 style="margin:0 0 4px">🗣 中文聲音 Chinese voice</h2>
        <p style="margin:0 0 8px;color:#666;font-size:14px">Used by all the kids' games on this device. Tap to hear it. 所有遊戲共用。點一下試聽。</p>
        <div style="max-height:50vh;overflow:auto">${vs.length ? vs.map((v, i) => `<button data-i="${i}" style="${btn};background:${cur && v.voiceURI === cur.voiceURI ? '#d3f9d8' : '#f1f3f5'}">${cur && v.voiceURI === cur.voiceURI ? '✓ ' : ''}${v.name.replace(/</g, '&lt;')} <small>(${v.lang})</small></button>`).join('') : '<p>No Chinese voices on this device yet. Download one in Settings → Accessibility → Spoken Content → Voices → Chinese (Lilian Premium is best).</p>'}</div>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:10px"><button id="kavAuto" style="${btn};width:auto;background:#f1f3f5">Auto (best) 自動</button><button id="kavDone" style="${btn};width:auto;background:#e8590c;color:#fff">Done 完成</button></div></div>`;
      m.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const v = vs[+b.dataset.i]; try { localStorage.setItem(KEY, v.voiceURI); } catch (e) {} delete cache['zh-TW']; say('從前從前,有一隻小恐龍。'); draw(); });
      m.querySelector('#kavAuto').onclick = () => { try { localStorage.removeItem(KEY); } catch (e) {} delete cache['zh-TW']; draw(); };
      m.querySelector('#kavDone').onclick = () => m.remove();
    };
    draw(); document.body.appendChild(m);
  }
  window.KAVoice = { say, sayParts, stop, picker, voiceFor, zhVoices, langOf };
})();
