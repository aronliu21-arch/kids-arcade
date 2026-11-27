/* ===== Car physics (simple, kid-explainable) and the track ===== */
var PHYS = {
  motor: { normal: { v: 1.0, t: 1.0 }, turbo: { v: 1.25, t: 1.15 } },
  gear: { speed: { top: 1.1, tq: 0.8 }, power: { top: 1.0, tq: 1.3 } },
  tire: { hard: { grip: 0.75, roll: 1.03 }, soft: { grip: 1.1, roll: 1.0 } },
  body: { sleek: 1.04, boxy: 0.96 },
  roller: { yes: 1.35, no: 1.0 },
  CRASH_NO_ROLLERS: 9,   // without rollers, faster than this in a curve = course out
  CURVE: 10.2,           // curve speed limit with rollers = CURVE * grip * 1.35
  BASE: 15
};
function carStats(b) {
  var m = PHYS.motor[b.motor], g = PHYS.gear[b.gear], t = PHYS.tire[b.tire];
  var top = PHYS.BASE * m.v * g.top * t.roll * PHYS.body[b.body];
  var torque = m.t * g.tq;
  return {
    top: top,
    accel: 9 * torque,
    hill: Math.min(1, 0.75 * torque),
    curve: b.roller === "yes" ? PHYS.CURVE * t.grip * PHYS.roller.yes : PHYS.CRASH_NO_ROLLERS,
    rollers: b.roller === "yes"
  };
}
/* 0..1 bars for the stats panel */
function carBars(b) {
  var s = carStats(b);
  return { speed: Math.min(1, (s.top - 12) / 12), hill: (s.hill - 0.6) / 0.4, grip: b.roller === "yes" ? Math.min(1, (s.curve - 7) / 9) : 0.05, safe: s.rollers ? 1 : 0 };
}

/* Track: a rounded rectangle with a hill on the bottom straight. Units are "track units". */
var TRACK = (function () {
  var segs = [["S", 36], ["C", 11], ["S", 14], ["C", 11], ["S", 6], ["H", 24], ["S", 6], ["C", 11], ["S", 14], ["C", 11]];
  var pts = [], x = 0, y = 0, h = 0, s = 0, STEP = 0.25, hills = [], curves = [];
  pts.push({ x: x, y: y, h: h, s: 0, type: "S" });
  segs.forEach(function (g) {
    var t = g[0], len = t === "C" ? Math.PI / 2 * g[1] : g[1], n = Math.round(len / STEP), s0 = s;
    for (var i = 0; i < n; i++) {
      if (t === "C") h += (Math.PI / 2) / n;
      x += Math.cos(h) * STEP; y += Math.sin(h) * STEP; s += STEP;
      pts.push({ x: x, y: y, h: h, s: s, type: t });
    }
    if (t === "H") hills.push([s0, s]);
    if (t === "C") curves.push([s0, s]);
  });
  var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  pts.forEach(function (p) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
  return { pts: pts, len: s, hills: hills, curves: curves, box: [minX, minY, maxX, maxY], step: STEP };
})();
function trackAt(s) {
  s = ((s % TRACK.len) + TRACK.len) % TRACK.len;
  var i = Math.min(TRACK.pts.length - 1, Math.round(s / TRACK.step));
  return TRACK.pts[i];
}
function segType(s) { return trackAt(s).type; }
function hillPhase(s) { // 0..1 along the hill, or -1
  s = ((s % TRACK.len) + TRACK.len) % TRACK.len;
  for (var i = 0; i < TRACK.hills.length; i++) { var h = TRACK.hills[i]; if (s >= h[0] && s <= h[1]) return (s - h[0]) / (h[1] - h[0]); }
  return -1;
}

/* One racer. step(dt) advances it; events are pushed to ev[] for commentary. */
function Racer(build, opts) {
  this.b = build; this.st = carStats(build); this.s = opts.start || 0; this.v = 0;
  this.lap = 0; this.done = false; this.out = false; this.t = 0; this.lane = opts.lane || 0;
  this.laps = opts.laps; this.log = { hillSlow: 0, curveSlow: 0, scrape: 0 }; this.ev = [];
  this.outPos = null;
}
Racer.prototype.step = function (dt) {
  if (this.done || this.out) { if (this.out && this.outPos) { var o = this.outPos; o.x += o.vx * dt; o.y += o.vy * dt; o.rot += o.spin * dt; o.z += o.vz * dt; o.vz -= 30 * dt; if (o.z < 0) { o.z = 0; o.vx *= 0.9; o.vy *= 0.9; o.spin *= 0.9; o.vz = 0; } } return; }
  this.t += dt;
  var st = this.st, type = segType(this.s), target = st.top, hp = hillPhase(this.s);
  if (hp >= 0 && hp < 0.5) { target = st.top * st.hill; }
  if (type === "C") {
    if (this.v > st.curve) {
      if (!st.rollers) { this.crash(); return; }
      this.log.curveSlow += (this.v - st.curve) * dt; this.log.scrape += dt;
      this.v = Math.max(st.curve, this.v - 45 * dt);
      if (!this.scraping) { this.scraping = true; this.ev.push("scrape"); }
    } else this.scraping = false;
    target = Math.min(target, st.curve);
  } else this.scraping = false;
  if (hp >= 0 && hp < 0.5 && this.v > target) { this.log.hillSlow += (this.v - target) * dt; this.v = Math.max(target, this.v - 14 * dt); }
  else if (this.v < target) this.v = Math.min(target, this.v + st.accel * dt * (1 - this.v / (st.top * 1.05)) * 2.2);
  else if (type !== "C") this.v = Math.max(target, this.v - 10 * dt);
  if (hp >= 0.5 && hp <= 1) this.v = Math.min(st.top * 1.08, this.v + 6 * dt); // downhill boost
  var before = this.s;
  this.s += this.v * dt;
  if (Math.floor(this.s / TRACK.len) > Math.floor(before / TRACK.len)) {
    this.lap++; this.ev.push("lap");
    if (this.lap >= this.laps) { this.done = true; this.ev.push("finish"); }
  }
};
Racer.prototype.crash = function () {
  this.out = true; this.ev.push("crash");
  var p = trackAt(this.s), sp = this.v;
  this.outPos = { x: p.x, y: p.y, rot: p.h, vx: Math.cos(p.h) * sp, vy: Math.sin(p.h) * sp, spin: 9, z: 0, vz: 12 };
};
/* Run a whole race instantly (for advice, tests and tuning) */
function simulate(build, laps) {
  var r = new Racer(build, { laps: laps || 1 }), n = 0;
  while (!r.done && !r.out && n < 20000) { r.step(1 / 60); n++; }
  return r;
}
function advise(r) {
  if (r.out) return "crash";
  var b = r.b;
  if (b.gear === "speed" && r.log.hillSlow > 6) return "hill";
  if (b.tire === "hard") return "grip";
  if (b.motor === "normal" || b.body === "boxy") return "slow";
  if (b.gear === "speed") return "hill";
  return "good";
}
