/* ===== Music (synth anthem on title/menu) and race sounds. Web Audio only. ===== */
var Music = (function () {
  var ac, master, timer = null, playing = false, step = 0, next = 0;
  // A bright, heroic loop in C: melody (scale degrees), chords per bar
  var BPM = 150, Q = 60 / BPM / 2; // eighth notes
  var MEL = [7, 9, 10, 12, 12, -1, 10, 12, 14, 12, 10, 9, 7, -1, 5, 7, 9, 9, 10, 9, 7, 5, 4, -1, 2, 4, 5, 7, 9, 10, 12, -1,
             12, 12, 14, 12, 10, 12, 14, 16, 17, 16, 14, 12, 10, 9, 10, -1, 9, 10, 12, 10, 9, 7, 5, 4, 5, 7, 9, 7, 7, -1, -1, -1];
  var CH = [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14], [0, 4, 7]];
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
    while (next < ac.currentTime + 0.2) {
      var i = step % MEL.length, bar = Math.floor(i / 8) % CH.length;
      if (MEL[i] >= 0) note(hz(deg(MEL[i])), next, Q * 1.6, "square", 0.05);
      if (i % 8 === 0) CH[bar].forEach(function (c) { note(hz(c - 12), next, Q * 7.5, "sawtooth", 0.025); });
      if (i % 2 === 0) note(hz(CH[bar][0] - 24), next, Q * 1.2, "triangle", 0.18);
      if (i % 4 === 0) drum(next, true); else if (i % 4 === 2) drum(next, false);
      next += Q; step++;
    }
  }
  return {
    start: function () {
      if (playing || KAKit.muted()) return; ac = KAKit.ac(); if (!ac) return;
      master = ac.createGain(); master.gain.value = 0.0001; master.connect(ac.destination);
      master.gain.exponentialRampToValueAtTime(0.7, ac.currentTime + 0.6);
      next = ac.currentTime + 0.05; playing = true; timer = setInterval(tick, 50);
    },
    stop: function () {
      if (!playing) return; playing = false; clearInterval(timer);
      var m = master; try { m.gain.cancelScheduledValues(ac.currentTime); m.gain.setValueAtTime(m.gain.value, ac.currentTime); m.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.8); } catch (e) {}
      setTimeout(function () { try { m.disconnect(); } catch (e) {} }, 1000);
    },
    get playing() { return playing; }
  };
})();

/* Little motor whine that follows Lucas's car speed */
var Engine = (function () {
  var ac, o, o2, g, f;
  return {
    start: function () {
      if (o || KAKit.muted()) return; ac = KAKit.ac(); if (!ac) return;
      o = ac.createOscillator(); o2 = ac.createOscillator(); g = ac.createGain(); f = ac.createBiquadFilter();
      o.type = "sawtooth"; o2.type = "square"; f.type = "lowpass"; f.frequency.value = 1400; g.gain.value = 0.0001;
      o.connect(f); o2.connect(f); f.connect(g).connect(ac.destination); o.start(); o2.start();
    },
    set: function (v) { if (!o) return; var t = ac.currentTime; o.frequency.setTargetAtTime(180 + v * 38, t, 0.05); o2.frequency.setTargetAtTime(90 + v * 19, t, 0.05); g.gain.setTargetAtTime(v > 0.2 ? 0.035 : 0.0001, t, 0.08); },
    stop: function () { if (!o) return; try { g.gain.setTargetAtTime(0.0001, ac.currentTime, 0.05); var a = o, b = o2; setTimeout(function () { a.stop(); b.stop(); }, 300); } catch (e) {} o = null; }
  };
})();
function sfx(n) { KAKit.sfx(n); }
function beep(f, d) {
  if (KAKit.muted()) return; var ac = KAKit.ac(); if (!ac) return;
  var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
  o.type = "square"; o.frequency.value = f; g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + 0.02);
}
