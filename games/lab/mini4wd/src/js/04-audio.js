/* ===== Music (synth anthem on title/menu) and race sounds. Web Audio only. ===== */
var Music = (function () {
  var ac, master, timer = null, playing = false, step = 0, next = 0, T = null, cur = "anthem";
  // themes: melody in scale degrees (-1 = rest), chords per bar, tempo, sounds, drums, volume
  var THEMES = {
    anthem: { bpm: 150, lead: "square", pad: "sawtooth", drums: true, vol: 0.7,
      mel: [7, 9, 10, 12, 12, -1, 10, 12, 14, 12, 10, 9, 7, -1, 5, 7, 9, 9, 10, 9, 7, 5, 4, -1, 2, 4, 5, 7, 9, 10, 12, -1, 12, 12, 14, 12, 10, 12, 14, 16, 17, 16, 14, 12, 10, 9, 10, -1, 9, 10, 12, 10, 9, 7, 5, 4, 5, 7, 9, 7, 7, -1, -1, -1],
      ch: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14], [0, 4, 7]] },
    town: { bpm: 132, lead: "square", pad: "triangle", drums: true, vol: 0.4,
      mel: [7, 9, 11, 9, 7, -1, 4, -1, 5, 7, 9, 7, 5, -1, 2, -1, 4, 5, 7, 9, 11, 9, 7, 5, 4, -1, 7, -1, 7, -1, -1, -1],
      ch: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] },
    store: { bpm: 112, lead: "triangle", pad: "sawtooth", drums: true, vol: 0.4,
      mel: [4, -1, 4, 6, -1, 7, 6, 4, 2, -1, 2, 4, -1, 6, 4, 2, 0, -1, 0, 2, 4, -1, 7, -1, 6, 4, 2, 4, -1, -1, -1, -1],
      ch: [[0, 4, 7], [9, 12, 16], [2, 5, 9], [7, 11, 14]] },
    school: { bpm: 92, lead: "sine", pad: "triangle", drums: false, vol: 0.35,
      mel: [7, -1, 9, -1, 7, -1, 4, -1, 5, -1, 4, -1, 2, -1, -1, -1, 4, -1, 5, -1, 7, -1, 9, -1, 7, -1, 5, -1, 4, -1, -1, -1],
      ch: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] },
    work: { bpm: 152, lead: "square", pad: "square", drums: true, vol: 0.35,
      mel: [0, 4, 7, 4, 0, 4, 7, 9, 7, 4, 2, 4, 7, -1, 7, -1, 5, 9, 12, 9, 5, 9, 12, 14, 12, 9, 7, 9, 12, -1, 12, -1],
      ch: [[0, 4, 7], [0, 4, 7], [5, 9, 12], [7, 11, 14]] },
    home: { bpm: 76, lead: "sine", pad: "sine", drums: false, vol: 0.35,
      mel: [4, -1, -1, 2, 0, -1, 2, -1, 4, -1, 4, -1, 4, -1, -1, -1, 2, -1, 2, -1, 2, -1, -1, -1, 4, -1, 7, -1, 7, -1, -1, -1],
      ch: [[0, 4, 7], [7, 11, 14], [5, 9, 12], [0, 4, 7]] }
  };
  var SC = [0, 2, 4, 5, 7, 9, 11];
  function hz(semi) { return 261.63 * Math.pow(2, semi / 12); }
  function deg(d) { var o = Math.floor(d / 7); return SC[((d % 7) + 7) % 7] + 12 * o; }
  function note(f, t, d, type, v) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(master); o.start(t); o.stop(t + d + 0.05);
  }
  function drum(t, kick) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(kick ? 140 : 300, t); o.frequency.exponentialRampToValueAtTime(kick ? 45 : 120, t + 0.12);
    g.gain.setValueAtTime(kick ? 0.5 : 0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.2);
  }
  function tick() {
    var Q = 60 / T.bpm / 2;
    while (next < ac.currentTime + 0.2) {
      var i = step % T.mel.length, bar = Math.floor(i / 8) % T.ch.length;
      if (T.mel[i] >= 0) note(hz(deg(T.mel[i])), next, Q * 1.6, T.lead, T.lead === "sine" ? 0.09 : 0.05);
      if (i % 8 === 0) T.ch[bar].forEach(function (c) { note(hz(c - 12), next, Q * 7.5, T.pad, 0.025); });
      if (i % 2 === 0) note(hz(T.ch[bar][0] - 24), next, Q * 1.2, "triangle", 0.16);
      if (T.drums) { if (i % 4 === 0) drum(next, true); else if (i % 4 === 2) drum(next, false); }
      next += Q; step++;
    }
  }
  var api = {
    start: function () { api.play(cur); },
    play: function (name) { // switch to a theme (no-op if it's already playing)
      if (!THEMES[name]) name = "anthem";
      if (playing && cur === name) return;
      if (playing) api.stop(true);
      cur = name; if (KAKit.muted()) return; ac = KAKit.ac(); if (!ac) return; T = THEMES[name]; step = 0;
      master = ac.createGain(); master.gain.value = 0.0001; master.connect(ac.destination);
      master.gain.exponentialRampToValueAtTime(T.vol, ac.currentTime + 0.6);
      next = ac.currentTime + 0.05; playing = true; timer = setInterval(tick, 50);
    },
    stop: function (fast) {
      if (!playing) return; playing = false; clearInterval(timer);
      var m = master; try { m.gain.cancelScheduledValues(ac.currentTime); m.gain.setValueAtTime(m.gain.value, ac.currentTime); m.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (fast ? 0.25 : 0.8)); } catch (e) {}
      setTimeout(function () { try { m.disconnect(); } catch (e) {} }, 1000);
    },
    get playing() { return playing; }
  };
  return api;
})();

/* Race sound: a real Mini 4WD buzz. Motor whine + gear whir that rise with speed, a wobble at top speed,
   a lower straining note up hills, a scrape hiss on the wall in curves, and a second car's buzz when a rival is close. */
var Engine = (function () {
  var ac, out, o, o2, o3, lfo, lfoG, f, g, nz, nzF, nzG, rv, rvG, on = false;
  function noise() { var b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; var s = ac.createBufferSource(); s.buffer = b; s.loop = true; return s; }
  return {
    start: function () {
      if (on || KAKit.muted() || Engine.off()) return; ac = KAKit.ac(); if (!ac) return; on = true;
      out = ac.createGain(); out.gain.value = 0.0001; out.connect(ac.destination);
      f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1600; f.Q.value = 4; g = ac.createGain(); g.gain.value = 1; f.connect(g).connect(out);
      o = ac.createOscillator(); o.type = "triangle"; o2 = ac.createOscillator(); o2.type = "sine"; o3 = ac.createOscillator(); o3.type = "sine"; // soft motor tone (v2.7: no sawtooth/square buzz)
      var g2 = ac.createGain(); g2.gain.value = 0.6; o.connect(f); o2.connect(g2).connect(f); o3.connect(f);
      lfo = ac.createOscillator(); lfo.frequency.value = 6; lfoG = ac.createGain(); lfoG.gain.value = 0; lfo.connect(lfoG); lfoG.connect(o.frequency); lfoG.connect(o3.frequency);
      nz = noise(); nzF = ac.createBiquadFilter(); nzF.type = "bandpass"; nzF.frequency.value = 3000; nzF.Q.value = 1.5; nzG = ac.createGain(); nzG.gain.value = 0.0001; nz.connect(nzF).connect(nzG).connect(out);
      rv = ac.createOscillator(); rv.type = "sawtooth"; rvG = ac.createGain(); rvG.gain.value = 0.0001; var rf = ac.createBiquadFilter(); rf.type = "lowpass"; rf.frequency.value = 1200; rv.connect(rf).connect(rvG).connect(out);
      [o, o2, o3, lfo, nz, rv].forEach(function (x) { x.start(); });
    },
    set: function (v, s) {
      if (!on) return; s = s || {}; var t = ac.currentTime, base = s.hill ? 80 + v * 10 : 95 + v * 14; // v: 0..10; low and quiet
      o.frequency.setTargetAtTime(base, t, 0.08); o2.frequency.setTargetAtTime(base / 2, t, 0.08); o3.frequency.setTargetAtTime(base * 1.5, t, 0.08);
      lfoG.gain.setTargetAtTime(0, t, 0.2);
      f.frequency.setTargetAtTime(380 + v * 35, t, 0.1);
      out.gain.setTargetAtTime(v > 0.2 ? 0.02 + v * 0.0025 : 0.0001, t, 0.1);
      nzG.gain.setTargetAtTime(s.scrape ? 0.22 : 0.015 + v * 0.004, t, 0.05); nzF.frequency.setTargetAtTime(s.scrape ? 4200 : 1200 + v * 120, t, 0.05); // soft whir, or hiss on the wall
      rvG.gain.setTargetAtTime(s.near ? 0.06 : 0.0001, t, 0.15); rv.frequency.setTargetAtTime(base * 1.12, t, 0.1); // rival close by
    },
    off: function () { try { return localStorage.getItem("m4wd.engineOff") === "1"; } catch (e) { return false; } },
    toggle: function () { var x = !this.off(); try { localStorage.setItem("m4wd.engineOff", x ? "1" : "0"); } catch (e) {} if (x) this.stop(); else this.start(); return x; },
    stop: function () { if (!on) return; on = false; var parts = [o, o2, o3, lfo, nz, rv], O = out; try { O.gain.setTargetAtTime(0.0001, ac.currentTime, 0.05); } catch (e) {} setTimeout(function () { parts.forEach(function (x) { try { x.stop(); } catch (e) {} }); try { O.disconnect(); } catch (e) {} }, 300); }
  };
})();
function sfx(n) { KAKit.sfx(n); }
function beep(f, d) {
  if (KAKit.muted()) return; var ac = KAKit.ac(); if (!ac) return;
  var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = "square"; o.frequency.value = f; g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + 0.02);
}
