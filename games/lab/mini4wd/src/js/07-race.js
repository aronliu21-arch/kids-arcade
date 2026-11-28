/* ===== Race: 3/4-view track on a canvas (hill rises, speed trails). The build decides everything; Lucas cheers. ===== */
var IMG = {};
var IMGN = 0; // how many images have loaded (cached car drawings rebuild when this changes)
function img(n) { if (!IMG[n]) { IMG[n] = new Image(); IMG[n].onload = function () { IMGN++; }; IMG[n].src = A(n); } return IMG[n]; }
["c_blue", "c_red", "c_green", "r_blue", "r_red", "r_green"].forEach(img);

var Race = {
  speed: 1,
  // opts (Chapter 2): { track, laps, build, rivals:[{who,col,build}], onDone(res) }
  start: function (mode, opts) {
    var self = this, k = G.kd; opts = opts || null; this.opts = opts;
    var tid = opts ? opts.track : "classic"; if (tid !== this.trackId) { this._q = null; this.trackId = tid; } // track changed: rebuild cached pieces
    setTrack(tid);
    this.mode = mode; this.laps = opts && opts.laps ? opts.laps : mode === "race" ? 3 : 1; this.over = false; this.t = 0; this.fx = []; this.said = {}; this.camD = 11;
    this.cars = [{ who: "lucas", car: "c_blue", col: "blue", build: opts ? opts.build : null, r: new Racer(opts ? opts.build : k.build, { laps: this.laps, lane: 0 }) }];
    var rv0 = opts ? (opts.rivals || []) : mode === "race" ? RIVALS : [];
    rv0.forEach(function (rv, i) { self.cars.push({ who: rv.who, car: rv.car || "c_red", col: rv.col, build: opts ? rv.build : null, r: new Racer(rv.build, { laps: self.laps, lane: i + 1 }) }); });
    show("sRace"); this.resize(); this.cam = null; this.camLabel();
    var q = $("#quitBtn"); q.style.display = opts && opts.onQuit ? "" : "none";
    q.onclick = function () { if (self.over) return; self.over = true; Engine.stop(); Read.stop(); var f = self.opts && self.opts.onQuit; self.opts = null; if (f) f(); };
    $("#cheer").style.display = "";
    this.tick(["準備好了嗎？", "Ready?"]);
    this.hud(); this.draw();
    this.countdown();
  },
  countdown: function () {
    var self = this, n = 3, el = $("#count");
    (function c() {
      if (CUR !== "sRace") return;
      if (n > 0) { el.textContent = n; beep(440, 0.15); n--; setTimeout(c, Race.speed > 1 ? 80 : 800); }
      else { el.textContent = "GO!"; beep(880, 0.4); Engine.start(); setTimeout(function () { el.textContent = ""; }, 600); self.last = performance.now(); self.loop(); }
    })();
  },
  loop: function () {
    var self = this;
    if (CUR !== "sRace" || this.over) return;
    var now = performance.now(), dt = Math.min(0.05, (now - this.last) / 1000) * this.speed; this.last = now;
    var steps = Math.ceil(dt / (1 / 60)), h = dt / steps;
    for (var i = 0; i < steps; i++) this.cars.forEach(function (c) { c.r.step(h); });
    this.t += dt;
    this.events();
    this.draw(); this.hud();
    var me = this.cars[0].r;
    Engine.set(me.out || me.done ? 0 : me.v / me.st.top * 10, { scrape: me.scraping, hill: hillPhase(me.s) >= 0 && hillPhase(me.s) < 0.5, near: this.cars.slice(1).some(function (c) { return !c.r.out && Math.abs(c.r.s + c.r.lap * TRACK.len - me.s - me.lap * TRACK.len) < 4; }) });
    var allDone = this.cars.every(function (c) { return c.r.done || c.r.out; });
    if ((me.done || me.out) && !this.endAt) this.endAt = this.t + (this.mode === "race" && !me.out ? 4 : 1.6);
    if (this.endAt && (this.t > this.endAt || (allDone && this.t > this.endAt - 3))) return this.finish();
    requestAnimationFrame(function () { self.loop(); });
  },
  order: function () {
    return this.cars.slice().sort(function (a, b) {
      var A1 = a.r, B1 = b.r;
      if (A1.out !== B1.out) return A1.out ? 1 : -1;
      if (A1.done && B1.done) return A1.t - B1.t;
      if (A1.done !== B1.done) return A1.done ? -1 : 1;
      return B1.s - A1.s;
    });
  },
  tick: function (t) { $("#ticker").innerHTML = bi(t[0], t[1]); },
  events: function () {
    var self = this, me = this.cars[0].r;
    this.cars.forEach(function (c) {
      var ev = c.r.ev; c.r.ev = [];
      ev.forEach(function (e) {
        if (c.who !== "lucas") return;
        if (e === "crash") { self.tick(["脫軌了！車子衝出跑道！", "Course out! The car flew off the track!"]); sfx("buzz"); Engine.stop(); }
        if (e === "scrape" && !self.said.scrape) { self.said.scrape = 1; self.tick(["導輪擦著牆轉彎！", "The rollers grind along the wall in the curve!"]); }
        if (e === "lap" && !c.r.done) self.tick(["第 " + (c.r.lap + 1) + " 圈！", "Lap " + (c.r.lap + 1) + "!"]);
        if (e === "finish") { self.tick(["衝過終點！", "Across the finish line!"]); sfx("win"); }
      });
      if (c.r.st && (c.r.scraping) && Math.random() < 0.5) { var p = self.pos(c); self.fx.push({ x: p.x, y: p.y, vx: (Math.random() - .5) * 8, vy: (Math.random() - .5) * 8, life: 0.4 }); }
    });
    if (!me.out && !me.done) {
      var hp = hillPhase(me.s);
      if (hp >= 0 && hp < 0.5 && !this.said["hill" + me.lap]) {
        this.said["hill" + me.lap] = 1;
        this.tick(me.b.gear === "power" ? ["上坡！力量齒輪推上去了！", "The hill! Power gears push right up!"] : ["上坡！速度齒輪好吃力……", "The hill! Speed gears are struggling..."]);
      }
      if (this.mode === "race") {
        var lead = this.order()[0];
        if (lead.who !== this.leader) { if (this.leader) this.tick(lead.who === "lucas" ? ["陸晨領先了！", "Lucas takes the lead!"] : [CAST[lead.who].zh + "領先！", CAST[lead.who].en + " is in front!"]); this.leader = lead.who; }
      }
    }
  },
  hud: function () {
    var me = this.cars[0].r;
    $("#hLap").innerHTML = bi("第 " + Math.min(this.laps, me.lap + 1) + " / " + this.laps + " 圈", "Lap " + Math.min(this.laps, me.lap + 1) + " / " + this.laps);
    this.board();
    if (this.mode !== "race") { $("#hPos").innerHTML = "<span class='chip me'>" + bi("測試跑道", "Test run") + "</span>"; return; }
    $("#hPos").innerHTML = "";
  },
  /* v2.7: racer cards with faces + names (bottom-left of the track) and Lucas's speed gauge (bottom-right), laid over the empty infield */
  board: function () {
    var self = this, wrap = $("#sRace .rwrap"), cv = $("#raceCv"), bd = $("#rBoard"), gg = $("#rGauge");
    if (!bd) { bd = document.createElement("div"); bd.id = "rBoard"; wrap.appendChild(bd); gg = document.createElement("div"); gg.id = "rGauge"; wrap.appendChild(gg); }
    var key = this.mode + ":" + this.cars.map(function (c) { return c.who; }).join();
    if (bd.__key !== key) { bd.__key = key;
      bd.innerHTML = this.mode !== "race" ? "" : this.cars.map(function (c) { var w = CAST[c.who] || { en: c.who, zh: c.who }, col = c.col ? CarArt.COL[c.col].main : "#1c7ed6";
        return "<div class='rc" + (c.who === "lucas" ? " me" : "") + "' data-w='" + c.who + "' style='--tc:" + col + "'><b class='pl'></b>" + (w.img ? "<img src='" + A(w.img) + "' alt=''>" : "<span class='fc'>" + (w.ic || "🙂") + "</span>") +
          "<span class='nm'>" + zh(w.zh) + "<small>" + esc(w.en) + "</small></span><span class='lp'></span><i class='bar'><i></i></i></div>"; }).join("");
      gg.innerHTML = "<svg viewBox='0 0 120 70'><path d='M10 64 A50 50 0 0 1 110 64' fill='none' stroke='#fff' stroke-width='12' stroke-linecap='round'/><path class='arc' d='M10 64 A50 50 0 0 1 110 64' fill='none' stroke='url(#gG)' stroke-width='12' stroke-linecap='round' pathLength='100' stroke-dasharray='0 100'/>" +
        "<defs><linearGradient id='gG'><stop offset='0' stop-color='#40c057'/><stop offset='.6' stop-color='#fab005'/><stop offset='1' stop-color='#e03131'/></linearGradient></defs><line class='nd' x1='60' y1='64' x2='60' y2='22' stroke='#222' stroke-width='4' stroke-linecap='round'/><circle cx='60' cy='64' r='6' fill='#222'/></svg><div class='sp'></div><div class='fl'></div>";
    }
    var r = cv.getBoundingClientRect(), w0 = wrap.getBoundingClientRect(), small = r.width < 760 || r.height < 420;
    bd.style.left = (r.left - w0.left + 6) + "px"; bd.style.bottom = (w0.bottom - r.bottom + 6) + "px"; bd.classList.toggle("sm", small);
    gg.style.left = (r.left - w0.left + (small ? 162 : 250)) + "px"; gg.style.bottom = (w0.bottom - r.bottom + 6) + "px"; gg.classList.toggle("sm", small);
    if (this.mode === "race") { var L = this.laps, tl = TRACK.len, medals = ["🥇", "🥈", "🥉", "4"];
      this.order().forEach(function (c, i) { var el = bd.querySelector("[data-w='" + c.who + "']"); if (!el) return; var r = c.r, f = r.done ? 1 : Math.min(1, (r.lap * tl + r.s) / (L * tl)), lap = r.done ? L : Math.min(L, r.lap + 1);
        el.style.order = i; el.querySelector(".pl").textContent = medals[i] || (i + 1); el.querySelector(".lp").textContent = r.out ? "💥" : r.done ? "🏁" : lap + "/" + L; el.querySelector(".bar i").style.width = Math.round(f * 100) + "%"; }); }
    var me = this.cars[0].r, k = me.out || !me.st ? 0 : Math.max(0, Math.min(1, me.v / 26));
    gg.querySelector(".arc").setAttribute("stroke-dasharray", Math.round(k * 100) + " 100");
    gg.querySelector(".nd").setAttribute("transform", "rotate(" + Math.round(-90 + k * 180) + " 60 64)");
    gg.querySelector(".sp").innerHTML = "<b>" + Math.round(me.v * 3.6) + "</b> km/h";
    gg.querySelector(".fl").textContent = me.st && me.v > me.st.top * 0.92 ? "🔥" : "";
    bd.style.display = gg.style.display = CUR === "sRace" ? "" : "none";
  },
  /* 3/4 view: the track is tilted away from you (K squashes depth) and the hill really rises (Z units). */
  K: 0.58, HZ: 7, TH: 0.9,
  zAt: function (s) { var hp = hillPhase(s); return hp < 0 ? 0 : this.HZ * (1 - Math.cos(hp * Math.PI * 2)) / 2; },
  P: function (X, Y, Z) { return [X, Y * this.K - Z]; },
  resize: function () {
    var cv = $("#raceCv"), r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.max(10, r.width * d); cv.height = Math.max(10, r.height * d);
    var b = TRACK.box, m = 7, x0 = b[0] - m, x1 = b[2] + m, y0 = (b[1] - m) * this.K - this.HZ - 3, y1 = (b[3] + m) * this.K + 2.5;
    this.sc = Math.min(cv.width / (x1 - x0), cv.height / (y1 - y0));
    this.ox = (cv.width - (x1 - x0) * this.sc) / 2 - x0 * this.sc; this.oy = (cv.height - (y1 - y0) * this.sc) / 2 - y0 * this.sc;
    // big tracks: zoom the 2.5D view in and follow Lucas, so the cars are big enough to see
    this.zf = Math.max(1, Math.min(2.4, (cv.width / this.sc) / 62));
    this.bgK = Math.min(this.zf, Math.sqrt(12e6 / (cv.width * cv.height))); this.zcam = null;
    if (!this.vmax) { var bb = JSON.parse(JSON.stringify(BEST)); this.vmax = carStats(Object.assign({}, DEFAULT_BUILD, bb)).top * 1.08; }
    this.buildTrack();
  },
  pos: function (c) {
    var r = c.r;
    if (r.out && r.outPos) return { x: r.outPos.x, y: r.outPos.y, h: r.outPos.rot, z: r.outPos.z, gz: 0 };
    var p = trackAt(r.s), off = (r.lane - 1) * 2.4, g = this.zAt(r.s) + this.TH;
    return { x: p.x + Math.cos(p.h + Math.PI / 2) * off, y: p.y + Math.sin(p.h + Math.PI / 2) * off, h: p.h, z: g, gz: g };
  },
  // track pieces: quads between sample points, with side walls, lanes and hill pillars
  quads: function () {
    if (this._q) return this._q;
    var pts = TRACK.pts, q = [], self = this, W = 3.8, n = pts.length, STEPI = 2;
    for (var i = 0; i < n; i += STEPI) {
      var a = pts[i], bq = pts[(i + STEPI) % n], za = self.zAt(a.s), zb = self.zAt(bq.s === 0 ? TRACK.len : bq.s);
      if (i + STEPI >= n) zb = 0;
      q.push({ a: a, b: bq, za: za, zb: zb, d: (a.y + bq.y) / 2, hill: za > 0.01 || zb > 0.01, i: i });
    }
    q.sort(function (u, v) { return u.d - v.d; });
    return (this._q = q);
  },
  drawQuad: function (x, q, lanes) {
    var self = this, W = 3.8, T = this.TH;
    function E(p, off, z) { return self.P(p.x + Math.cos(p.h + Math.PI / 2) * off, p.y + Math.sin(p.h + Math.PI / 2) * off, z); }
    function poly(ps, fill) { x.beginPath(); ps.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.closePath(); x.fillStyle = fill; x.fill(); }
    var a = q.a, b = q.b, ta = q.za + T, tb = q.zb + T;
    if (q.hill && q.i % 8 === 0 && q.za > 0.6) { // pillar under the ramp
      var c0 = self.P(a.x, a.y, 0), c1 = self.P(a.x, a.y, q.za);
      x.fillStyle = "#868e96"; x.fillRect(c0[0] - 0.55, c1[1], 1.1, c0[1] - c1[1]); x.fillStyle = "#495057"; x.fillRect(c0[0] + 0.15, c1[1], 0.4, c0[1] - c1[1]);
    }
    // side walls (red rails) down to the ground
    [-W, W].forEach(function (o) { poly([E(a, o, ta), E(b, o, tb), E(b, o, 0), E(a, o, 0)], o > 0 ? "#c92a2a" : "#a61e1e"); });
    // running surface, lighter on the way up, darker going down so the slope reads
    var slope = tb - ta, shade = q.hill ? (slope > 0 ? "#ffffff" : "#dee2e6") : "#f1f3f5";
    poly([E(a, -W, ta), E(b, -W, tb), E(b, W, tb), E(a, W, ta)], shade);
    x.strokeStyle = shade; x.lineWidth = 0.14; x.stroke(); // hide hairline seams between pieces
    if (!lanes) return;
    x.lineCap = "round"; x.lineWidth = 0.18; x.strokeStyle = "#111";
    [-W, W].forEach(function (o) { var p0 = E(a, o, ta), p1 = E(b, o, tb); x.beginPath(); x.moveTo(p0[0], p0[1]); x.lineTo(p1[0], p1[1]); x.stroke(); });
    [-2.4, 0, 2.4].forEach(function (o, k) { var p0 = E(a, o, ta), p1 = E(b, o, tb); x.strokeStyle = ["#a5d8ff", "#ffc9c9", "#ffec99"][k]; x.lineWidth = 1.5 * self.K; x.beginPath(); x.moveTo(p0[0], p0[1]); x.lineTo(p1[0], p1[1]); x.stroke(); });
    x.lineCap = "butt";
    if (lanes && q.hill && q.i % 10 === 0) { // chevrons: ▲ up, ▼ down
      var up = slope > 0, m0 = E(a, 0, ta);
      x.save(); x.translate(m0[0], m0[1]); x.rotate(Math.atan2(E(b, 0, tb)[1] - m0[1], E(b, 0, tb)[0] - m0[0]));
      x.strokeStyle = up ? "#e8590c" : "#2f9e44"; x.lineWidth = 0.35; x.beginPath(); x.moveTo(-0.5, -2.6); x.lineTo(0.5, -1.6); x.lineTo(-0.5, -0.6); x.moveTo(-0.5, 0.6); x.lineTo(0.5, 1.6); x.lineTo(-0.5, 2.6); x.stroke(); x.restore();
    }
  },
  buildTrack: function () {
    var cv = $("#raceCv"), bg = this.bg || (this.bg = document.createElement("canvas")), x = bg.getContext("2d"), self = this, b = TRACK.box;
    var K = this.bgK || 1; bg.width = cv.width * K; bg.height = cv.height * K;
    x.setTransform(this.sc * K, 0, 0, this.sc * K, this.ox * K, this.oy * K); x.lineJoin = "round";
    // the table: green top with a thick front edge
    var g0 = this.P(b[0] - 6, b[1] - 6, 0), g1 = this.P(b[2] + 6, b[3] + 6, 0);
    x.fillStyle = "#1b5e20"; rr(x, g0[0], g0[1] + 1.6, g1[0] - g0[0], g1[1] - g0[1], 3); x.fill();
    x.fillStyle = "#2f9e44"; x.strokeStyle = "#111"; x.lineWidth = 0.35; rr(x, g0[0], g0[1], g1[0] - g0[0], g1[1] - g0[1], 3); x.fill(); x.stroke();
    // hill shadow on the grass
    TRACK.hills.forEach(function (h) {
      x.fillStyle = "rgba(0,0,0,.22)"; x.beginPath();
      for (var s2 = h[0]; s2 <= h[1]; s2 += 1) { var p = trackAt(s2), z = self.zAt(s2), q2 = self.P(p.x + z * 0.5, p.y + 4.5 + z * 0.4, 0); s2 === h[0] ? x.moveTo(q2[0], q2[1]) : x.lineTo(q2[0], q2[1]); }
      for (var s3 = h[1]; s3 >= h[0]; s3 -= 1) { var p3 = trackAt(s3), q3 = self.P(p3.x, p3.y + 4.5, 0); x.lineTo(q3[0], q3[1]); }
      x.fill();
    });
    this.quads().forEach(function (q) { if (!q.hill) self.drawQuad(x, q, false); });
    // lane lines and edges on the flat track as smooth continuous lines
    var flat = TRACK.pts.filter(function (p) { return self.zAt(p.s) < 0.01; });
    x.lineCap = "round"; x.lineJoin = "round";
    [[-3.8, "#111", 0.18], [3.8, "#111", 0.18], [-2.4, "#a5d8ff", 1.5 * this.K], [0, "#ffc9c9", 1.5 * this.K], [2.4, "#ffec99", 1.5 * this.K]].forEach(function (L) {
      x.strokeStyle = L[1]; x.lineWidth = L[2]; x.beginPath(); var prev = null;
      flat.forEach(function (p) { var q = self.P(p.x + Math.cos(p.h + Math.PI / 2) * L[0], p.y + Math.sin(p.h + Math.PI / 2) * L[0], self.TH); if (prev && Math.abs(p.s - prev.s) < 1) x.lineTo(q[0], q[1]); else x.moveTo(q[0], q[1]); prev = p; });
      x.stroke();
    });
    x.lineCap = "butt";
    // start line
    var st = trackAt(0);
    for (var i = 0; i < 8; i++) for (var j = 0; j < 2; j++) { var c = this.P(st.x - 0.5 + j * 0.5, st.y - 3.8 + i * 0.95, this.TH); x.fillStyle = (i + j) % 2 ? "#111" : "#fff"; x.fillRect(c[0], c[1], 0.5, 0.95 * this.K); }
  },
  /* ---------- cameras: "auto" picks the best view, or the kid picks chase / 2.5D ---------- */
  camMode: "auto", CAMS: { auto: ["🎥", "自動鏡頭", "Auto cam"], chase: ["🏎", "追車鏡頭", "Chase cam"], iso: ["🗺", "俯視鏡頭", "Top view"] },
  camLabel: function () { var c = this.CAMS[this.camMode]; $("#camBtn").innerHTML = c[0] + " " + bi(c[1], c[2]); },
  pickCam: function () {
    var me = this.cars[0], r = me.r, now = this.t || 0;
    if (r.out) return "iso";
    if (this.camMode !== "auto") return this.camMode;
    var want = "iso", s = ((r.s % TRACK.len) + TRACK.len) % TRACK.len;
    TRACK.hills.forEach(function (h) { if (s > h[0] - 14 && s < h[1] + 4) want = "chase"; });
    if (now < 3) want = "chase";                       // dramatic start
    if (r.scraping) want = "iso";                       // see the rollers on the wall
    if (want !== this.cam && now - (this.camT || -9) < 2.2) return this.cam; // no flicker
    return want;
  },
  draw: function () {
    var cam = this.pickCam();
    if (cam !== this.cam) { this.cam = cam; this.camT = this.t || 0; this.flash = 1; }
    if (cam === "chase") this.drawChase(); else this.drawIso();
    if (this.flash > 0) { var cv = $("#raceCv"), x = cv.getContext("2d"); x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = "rgba(255,255,255," + this.flash * 0.8 + ")"; x.fillRect(0, 0, cv.width, cv.height); this.flash -= 0.12; }
  },
  drawChase: function () {
    var cv = $("#raceCv"), x = cv.getContext("2d"), W = cv.width, H = cv.height, self = this;
    var me = this.cars[0], r = me.r, off0 = (r.lane - 1) * 2.4;
    // follow closer in curves and aim at Lucas's car so it stays on the road in the middle of the screen
    var inC = isCurve(r.s) || isCurve(r.s - 6) || isCurve(r.s + 4);
    this.camD = (this.camD || 11) + ((inC ? 6.5 : 11) - (this.camD || 11)) * 0.06;
    var camS = r.s - this.camD, cp = trackAt(camS), ahead = trackAt(r.s + 1);
    var ch = Math.atan2(ahead.y - cp.y, ahead.x - cp.x);
    var cx = cp.x + Math.cos(cp.h + Math.PI / 2) * off0 * 0.6, cy = cp.y + Math.sin(cp.h + Math.PI / 2) * off0 * 0.6;
    var mz = 0; for (var zs = camS; zs <= r.s; zs += 0.5) mz = Math.max(mz, this.zAt(zs)); var cz = mz + this.TH + 2.8, slope = (this.zAt(camS + 8) - this.zAt(camS)) / 8, frac = Math.min(1, r.v / (this.vmax || 30));
    var F = W * (0.85 - frac * 0.18), hor = H * 0.4, co = Math.cos(ch), si = Math.sin(ch);
    // aim the camera so Lucas's car stays at the same spot: the whole world tilts on hills
    var lp = this.pos(me), lf = (lp.x - cx) * co + (lp.y - cy) * si;
    if (lf > 1) hor = Math.max(-H * 0.8, Math.min(H * 0.75, H * 0.74 + (lp.z - cz) / lf * F));
    this.hor = hor;
    function pr(wx, wy, wz) { var dx = wx - cx, dy = wy - cy, f = dx * co + dy * si, rr2 = -dx * si + dy * co; if (f < 0.4) return null; return [W / 2 + rr2 / f * F, hor - (wz - cz) / f * F, f]; }
    function edge(p, o, z) { return pr(p.x + Math.cos(p.h + Math.PI / 2) * o, p.y + Math.sin(p.h + Math.PI / 2) * o, z); }
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    var sky = x.createLinearGradient(0, 0, 0, hor); sky.addColorStop(0, "rgba(116,192,252,.35)"); sky.addColorStop(1, "rgba(208,235,255,.6)");
    x.fillStyle = sky; x.fillRect(0, 0, W, Math.max(0, hor));
    x.fillStyle = "#2f9e44"; x.fillRect(0, hor, W, H - hor);
    function quad(a, b, c, d, col) { if (!a || !b || !c || !d) return; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.lineTo(c[0], c[1]); x.lineTo(d[0], d[1]); x.closePath(); x.fillStyle = col; x.fill(); }
    // track from far to near (painter): crests hide what is behind them
    var DRAW = 70, STEP = 0.7, segs = [];
    for (var d = DRAW; d >= 0; d -= STEP) segs.push(camS + d);
    var carsAt = this.cars.map(function (c) { return { c: c, s: c.r.s }; });
    for (var i = 0; i < segs.length - 1; i++) {
      var sF = segs[i], sN = segs[i + 1], pF = trackAt(sF), pN = trackAt(sN), zF = this.zAt(sF) + this.TH, zN = this.zAt(sN) + this.TH;
      var band = Math.floor(sN / 1.4) % 2, up = zF > zN + 0.01, dn = zN > zF + 0.01;
      // pillars under the ramp
      if ((zF > 1.2) && Math.floor(sF / 3) !== Math.floor(sN / 3)) [-3.8, 3.8].forEach(function (o) { var t = edge(pF, o, zF - 0.3), g = edge(pF, o, 0); if (t && g) { x.fillStyle = "#868e96"; var w = Math.max(2, 0.5 / t[2] * F); x.fillRect(t[0] - w / 2, t[1], w, g[1] - t[1]); } });
      // side walls
      [[-3.8, -4.2], [3.8, 4.2]].forEach(function (o) {
        quad(edge(pF, o[0], zF), edge(pN, o[0], zN), edge(pN, o[0], zN - self.TH - (zN > 0.95 ? zN - self.TH : 0)), edge(pF, o[0], zF - self.TH - (zF > 0.95 ? zF - self.TH : 0)), "#a61e1e");
        quad(edge(pF, o[0], zF + 0.7), edge(pN, o[0], zN + 0.7), edge(pN, o[0], zN), edge(pF, o[0], zF), band ? "#e03131" : "#fff");
      });
      // road with rushing stripes (they fly past faster when the car is fast)
      quad(edge(pF, -3.8, zF), edge(pN, -3.8, zN), edge(pN, 3.8, zN), edge(pF, 3.8, zF), band ? (up ? "#fff4e6" : dn ? "#ebfbee" : "#f8f9fa") : (up ? "#ffe8cc" : dn ? "#d3f9d8" : "#e9ecef"));
      [[-2.4, "#a5d8ff"], [0, "#ffc9c9"], [2.4, "#ffec99"]].forEach(function (L) { quad(edge(pF, L[0] - 0.55, zF), edge(pN, L[0] - 0.55, zN), edge(pN, L[0] + 0.55, zN), edge(pF, L[0] + 0.55, zF), L[1]); });
      if (band && (up || dn) && Math.floor(sN / 1.4) % 4 === 1) { var a = edge(pN, 0, zN); if (a && a[2] > 5) { var sz = Math.min(H * 0.08, 1.2 / a[2] * F); x.fillStyle = up ? "#e8590c" : "#2f9e44"; x.font = "900 " + sz + "px system-ui"; x.textAlign = "center"; x.fillText(up ? "▲" : "▼", a[0], a[1]); } }
      // cars whose position is in this slice
      carsAt.forEach(function (o) { var cs = o.s; if (cs <= sF && cs > sN) self.chaseCar(x, o.c, pr, F); });
    }
    if (r.s <= segs[segs.length - 1]) this.chaseCar(x, me, pr, F);
    // speed lines at the edges
    if (frac > 0.3) { x.strokeStyle = "rgba(255,255,255," + (frac - 0.2) * 0.7 + ")"; x.lineWidth = Math.max(1, W / 400);
      for (var k = 0; k < 14 * frac; k++) { var ang = Math.random() * Math.PI * 2, r0 = W * (0.35 + Math.random() * 0.1), r1 = r0 + W * 0.15 * frac; x.beginPath(); x.moveTo(W / 2 + Math.cos(ang) * r0, hor + Math.sin(ang) * r0 * 0.6); x.lineTo(W / 2 + Math.cos(ang) * r1, hor + Math.sin(ang) * r1 * 0.6); x.stroke(); } }
    this.chaseHud(x, W, H, frac, r);
  },
  chaseCar: function (x, c, pr, F) {
    var H = $("#raceCv").height;
    var me = c.who === "lucas", p = this.pos(c), q = pr(p.x, p.y, p.z); if (!q || (!me && q[2] < 4)) return;
    var s = (me ? 1.15 : 1) / q[2] * F, col = { c_blue: "#1c7ed6", c_red: "#e03131", c_green: "#2f9e44" }[c.car] || "#1c7ed6";
    var X = q[0], Y = q[1], w = 2.2 * s, h = 1.0 * s;
    x.save(); x.lineWidth = Math.max(1, s * 0.08); x.strokeStyle = "#111"; if (!me && q[2] < 8) x.globalAlpha = 0.55;
    x.fillStyle = "rgba(0,0,0,.3)"; x.beginPath(); x.ellipse(X, Y, w * 0.6, h * 0.18, 0, 0, 7); x.fill();
    if (c.build) { // Chapter 2: layered car art, every part shows
      var a2 = this.pos(c), q3 = pr(a2.x + Math.cos(a2.h) * 1.5, a2.y + Math.sin(a2.h) * 1.5, a2.z), k2 = 0;
      if (q3 && q[1] - q3[1] > 0.5) k2 = Math.max(-0.7, Math.min(0.7, (q3[0] - X) / (q[1] - q3[1])));
      x.save(); x.translate(X, Y); x.transform(1, 0, -k2, 1, 0, 0); var hh = CarArt.draw(x, c.build, "rear", 0, 0, w * 1.05, { col: c.col }); x.restore();
      if (me) { x.globalAlpha = 1; x.shadowColor = "#ffd43b"; x.shadowBlur = 10; x.fillStyle = "#f76707"; x.font = "900 " + Math.min(H * 0.06, Math.max(12, s * 0.7)) + "px system-ui"; x.textAlign = "center"; x.fillText("Lucas 6", X + k2 * hh * 0.5, Y - hh * 1.1); }
      x.restore(); return;
    }
    var rim = img(c.car.replace("c_", "r_"));
    if (rim.complete && rim.naturalWidth) { // ChatGPT rear-view sprite, same style as the title art
      // flatten the steep top-down sprite so the car sits on the road instead of pointing up a hill,
      // and lean its top along the road direction so it follows curves
      var rw = w * 1.05, rh = rw * rim.naturalHeight / rim.naturalWidth * 0.6;
      var a = this.pos(c), hd = a.h, q2 = pr(a.x + Math.cos(hd) * 1.5, a.y + Math.sin(hd) * 1.5, a.z), k = 0;
      if (q2 && q[1] - q2[1] > 0.5) k = Math.max(-0.7, Math.min(0.7, (q2[0] - X) / (q[1] - q2[1])));
      x.save(); x.translate(X, Y); x.transform(1, 0, -k, 1, 0, 0);
      x.drawImage(rim, -rw / 2, -rh * 0.92, rw, rh); x.restore();
      X += k * rh * 0.5;
      if (me) { x.globalAlpha = 1; x.shadowColor = "#ffd43b"; x.shadowBlur = 10; x.fillStyle = "#f76707"; x.font = "900 " + Math.min(H * 0.06, Math.max(12, s * 0.7)) + "px system-ui"; x.textAlign = "center"; x.fillText("Lucas 6", X, Y - rh * 1.02); }
      x.restore(); return;
    }
    x.fillStyle = "#212529"; [-1, 1].forEach(function (k) { x.fillRect(X + k * w * 0.36 - w * 0.13, Y - h * 0.55, w * 0.26, h * 0.55); x.strokeRect(X + k * w * 0.36 - w * 0.13, Y - h * 0.55, w * 0.26, h * 0.55); });
    x.fillStyle = col; x.beginPath(); x.moveTo(X - w * 0.3, Y - h * 0.3); x.lineTo(X + w * 0.3, Y - h * 0.3); x.lineTo(X + w * 0.22, Y - h * 0.95); x.lineTo(X - w * 0.22, Y - h * 0.95); x.closePath(); x.fill(); x.stroke();
    x.fillRect(X - w * 0.42, Y - h * 1.2, w * 0.84, h * 0.18); x.strokeRect(X - w * 0.42, Y - h * 1.2, w * 0.84, h * 0.18); // rear wing
    x.fillStyle = "#ffd43b"; x.fillRect(X - w * 0.18, Y - h * 0.5, w * 0.12, h * 0.1); x.fillRect(X + w * 0.06, Y - h * 0.5, w * 0.12, h * 0.1);
    if (me) { x.shadowColor = "#ffd43b"; x.shadowBlur = 10; x.fillStyle = "#f76707"; x.font = "900 " + Math.min(H * 0.06, Math.max(12, s * 0.7)) + "px system-ui"; x.textAlign = "center"; x.fillText("Lucas 6", X, Y - h * 1.5); }
    x.restore();
  },
  chaseHud: function (x, W, H, frac, r) {
    var u = Math.min(W, H * 1.6) / 100, hp = r.out ? -1 : hillPhase(r.s);
    // big speed meter
    var bx = u * 3, by = H - u * 9, bw = u * 30, bh = u * 3.2;
    x.fillStyle = "#fff"; x.strokeStyle = "#111"; x.lineWidth = u * 0.4; rr(x, bx, by, bw, bh, bh / 2); x.fill(); x.stroke();
    x.fillStyle = frac > 0.7 ? "#2f9e44" : frac > 0.4 ? "#fab005" : "#e8590c"; rr(x, bx + u * 0.4, by + u * 0.4, Math.max(bh, (bw - u * 0.8) * frac), bh - u * 0.8, (bh - u * 0.8) / 2); x.fill();
    x.fillStyle = "#fff"; x.font = "900 " + u * 2.6 + "px system-ui"; x.textAlign = "left"; x.lineWidth = u * 0.6; x.strokeStyle = "#111";
    var t = hp >= 0 && hp < 0.5 ? "⬆ 上坡變慢 Uphill: slower" : hp >= 0.5 ? "⬇ 下坡變快 Downhill: faster!" : "⚡ 速度 Speed";
    x.strokeText(t, bx, by - u * 1.2); x.fillText(t, bx, by - u * 1.2);
    // mini map with every car
    var b = TRACK.box, mw = u * 24, mh = mw * (b[3] - b[1]) / (b[2] - b[0]), mx = W - mw - u * 3, my = u * 3, sc = mw / (b[2] - b[0]);
    x.fillStyle = "rgba(255,255,255,.85)"; x.strokeStyle = "#111"; x.lineWidth = u * 0.3; rr(x, mx - u, my - u, mw + 2 * u, mh + 2 * u, u); x.fill(); x.stroke();
    x.beginPath(); TRACK.pts.forEach(function (p, i) { var X = mx + (p.x - b[0]) * sc, Y = my + (p.y - b[1]) * sc; i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.closePath(); x.strokeStyle = "#868e96"; x.lineWidth = u * 0.9; x.stroke();
    TRACK.hills.forEach(function (h) { x.beginPath(); for (var s = h[0]; s <= h[1]; s += 1) { var p = trackAt(s); x[s === h[0] ? "moveTo" : "lineTo"](mx + (p.x - b[0]) * sc, my + (p.y - b[1]) * sc); } x.strokeStyle = "#e8590c"; x.stroke(); });
    var self = this;
    this.cars.slice().reverse().forEach(function (c) { var p = self.pos(c); x.fillStyle = c.col ? CarArt.COL[c.col].main : { c_blue: "#1c7ed6", c_red: "#e03131", c_green: "#2f9e44" }[c.car]; x.beginPath(); x.arc(mx + (p.x - b[0]) * sc, my + (p.y - b[1]) * sc, u * (c.who === "lucas" ? 1.3 : 1), 0, 7); x.fill(); x.strokeStyle = c.who === "lucas" ? "#ffd43b" : "#111"; x.lineWidth = u * 0.35; x.stroke(); });
  },
  drawIso: function () {
    var cv = $("#raceCv"), x = cv.getContext("2d"), s = this.sc, self = this, b = TRACK.box;
    this.label = label;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
    var zf = this.camMode === "iso" ? 1 : (this.zf || 1), tx = 0, ty = 0; // Top view: the whole track; Auto: zoom in and follow
    if (zf > 1) { // follow Lucas, keep the view inside the table
      var lp = this.pos(this.cars[0]), q0 = this.P(lp.x, lp.y, lp.z), bx = s * q0[0] + this.ox, by = s * q0[1] + this.oy;
      var wx = Math.min(0, Math.max(cv.width * (1 - zf), cv.width / 2 - zf * bx)), wy = Math.min(0, Math.max(cv.height * (1 - zf), cv.height * 0.55 - zf * by));
      if (!this.zcam) this.zcam = [wx, wy]; this.zcam[0] += (wx - this.zcam[0]) * 0.12; this.zcam[1] += (wy - this.zcam[1]) * 0.12; tx = this.zcam[0]; ty = this.zcam[1];
    }
    if (this.bg) { var K = this.bgK || 1; x.setTransform(zf / K, 0, 0, zf / K, tx, ty); x.drawImage(this.bg, 0, 0); }
    x.setTransform(s * zf, 0, 0, s * zf, this.ox * zf + tx, this.oy * zf + ty); x.lineJoin = "round";
    // hill pieces and cars, far to near, so the ramp hides what is behind it
    var items = this.quads().filter(function (q) { return q.hill; }).map(function (q) { return { d: q.d, q: q }; });
    this.cars.forEach(function (c) { var p = self.pos(c); items.push({ d: p.y + 0.01, c: c, p: p }); });
    items.sort(function (u, v) { return u.d - v.d; });
    items.forEach(function (it) { if (it.q) self.drawQuad(x, it.q, true); else self.drawCar(x, it.c, it.p); });
    // hill signs
    TRACK.hills.forEach(function (h) {
      var up = trackAt(h[0] + (h[1] - h[0]) * 0.1), dn = trackAt(h[0] + (h[1] - h[0]) * 0.9);
      var a = self.P(up.x, up.y + 6.2, 0), d = self.P(dn.x, dn.y + 6.2, 0);
      label(x, a[0], a[1], "⬆ 上坡變慢 Uphill: slower", "#e8590c", true, 1.0);
      label(x, d[0], d[1], "⬇ 下坡變快 Downhill: faster", "#2f9e44", true, 1.0);
    });
    // sparks
    this.fx = this.fx.filter(function (f) { f.life -= 1 / 60; f.x += f.vx / 60; f.y += f.vy / 60; var q = self.P(f.x, f.y, self.TH + 0.5); x.fillStyle = "rgba(255,212,59," + Math.max(0, f.life * 2.5) + ")"; x.beginPath(); x.arc(q[0], q[1], 0.35, 0, 7); x.fill(); return f.life > 0; });
    if (this.cars[0].r.out) { var cc = this.P((b[0] + b[2]) / 2, (b[1] + b[3]) / 2, 0); label(x, cc[0], cc[1], "COURSE OUT! 脫軌!", "#e03131", true, 2.4); }
    function label(x, lx, ly, t, col, badge, size) {
      x.save(); x.font = "900 " + (size || 1.3) + "px system-ui,sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
      if (badge) { var w = x.measureText(t).width + 1; x.fillStyle = col; rr(x, lx - w / 2, ly - 0.9 * (size || 1.3) / 1.3, w, 1.8 * (size || 1.3) / 1.3, 0.8); x.fill(); x.strokeStyle = "#111"; x.lineWidth = 0.2; x.stroke(); x.fillStyle = "#fff"; }
      else x.fillStyle = col;
      x.fillText(t, lx, ly); x.restore();
    }
  },
  drawCar: function (x, c, p) {
    var self = this, me = c.who === "lucas", r = c.r, im = img(c.car);
    var w = 2.1 * (me ? 1.15 : 1), hgt = w * (im.naturalHeight / (im.naturalWidth || 1) || 1.4);
    var frac = Math.max(0, Math.min(1, r.v / (this.vmax || 30)));
    // shadow on the ground under the car (shows how high it is)
    var sh = this.P(p.x, p.y, 0); x.fillStyle = "rgba(0,0,0," + (0.35 - Math.min(0.2, p.z * 0.02)) + ")";
    x.beginPath(); x.ellipse(sh[0] + p.z * 0.15, sh[1], 1.3 + p.z * 0.04, 0.8 * this.K + p.z * 0.02, 0, 0, 7); x.fill();
    // the car has height: dark side layers stacked under the bright top, so it stands on the track instead of looking painted on
    var tc = c.build ? CarArt.topCanvas(c.build, c.col) : (im.complete && im.naturalWidth ? im : null), dk = tc ? CarArt.dark(tc, c.build ? null : c.car) : null;
    var tw = w, th = tc ? w * tc.height / tc.width : hgt, BODYH = 0.7;
    function sprite(px, py, pz, alpha) {
      function one(z, src, glow) {
        var q = self.P(px, py, pz + z); x.save(); x.globalAlpha = alpha; x.translate(q[0], q[1]); x.scale(1, self.K); x.rotate(p.h + Math.PI / 2);
        if (glow) { x.shadowColor = "#ffd43b"; x.shadowBlur = 14 * self.sc / 10; }
        if (src) x.drawImage(src, -tw / 2, -th / 2, tw, th); else { x.fillStyle = me ? "#1c7ed6" : "#e03131"; x.fillRect(-tw / 2, -th / 2, tw, th); }
        x.restore();
      }
      if (dk && alpha === 1) for (var i = 0; i < 5; i++) one(i * BODYH / 5, dk, false); // ghosts: top only
      one(BODYH, tc, me && alpha === 1);
    }
    // speed trail: more ghosts and longer when fast
    if (!r.out && r.v > 1) {
      var n = Math.round(1 + frac * 4);
      for (var k = n; k >= 1; k--) { var gs = r.s - k * (0.5 + frac * 1.6), gp = trackAt(gs), off = (r.lane - 1) * 2.4;
        sprite(gp.x + Math.cos(gp.h + Math.PI / 2) * off, gp.y + Math.sin(gp.h + Math.PI / 2) * off, this.zAt(gs) + this.TH, 0.10 + 0.25 * (1 - k / (n + 1)) * frac); }
    }
    sprite(p.x, p.y, p.z, 1);
    // speed meter over every car: bar fills with speed, green fast, orange slow
    var top = this.P(p.x, p.y, p.z), bx = top[0] - 1.6, by = top[1] - (me ? 3.4 : 2.4);
    x.fillStyle = "#fff"; x.strokeStyle = "#111"; x.lineWidth = 0.15; rr(x, bx, by, 3.2, 0.6, 0.3); x.fill(); x.stroke();
    x.fillStyle = frac > 0.7 ? "#2f9e44" : frac > 0.4 ? "#fab005" : "#e8590c"; rr(x, bx + 0.08, by + 0.08, Math.max(0.2, 3.04 * frac), 0.44, 0.22); x.fill();
    if (me) this.label(x, top[0], by - 1.1, "Lucas 6", "#f76707", true);
  },
  finish: function () {
    var self = this, k = G.kd, me = this.cars[0].r;
    if (this.over) return; this.over = true; Engine.stop();
    $("#cheer").style.display = "none";
    var adv = advise(me);
    if (this.mode === "practice") {
      maxSays(adv, (adv === "good" ? "" : "<button class='btn blue' id='aTune'>🔧 " + bi("調整車子", "Tune the car") + "</button>") +
        "<button class='btn " + (adv === "good" ? "red" : "white") + "' id='aRace'>🏁 " + bi("去比賽", "Go to the race") + " ▶</button>" +
        (adv === "good" ? "" : "<button class='btn white' id='aAgain'>🔁 " + bi("再測一次", "Test again") + "</button>"));
      if ($("#aTune")) $("#aTune").onclick = function () { Read.stop(); closeOvl(); Tune.open(function () { Race.start("practice"); }, ["測試看看", "Test it"]); };
      if ($("#aAgain")) $("#aAgain").onclick = function () { Read.stop(); closeOvl(); Race.start("practice"); };
      $("#aRace").onclick = function () { Read.stop(); go("park"); };
      return;
    }
    var place = this.order().indexOf(this.cars[0]) + 1;
    if (this.opts && this.opts.onDone) { var od = this.opts.onDone; this.opts = null; return od({ place: me.out ? this.cars.length : place, out: me.out, adv: adv, r: me, time: me.t, order: this.order().map(function (c) { return c.who; }) }); }
    k.races = (k.races || 0) + 1; save();
    if (place === 1 && !me.out) {
      ovl("<div class='big title-font'>🏆 1ST PLACE!</div><div style='text-align:center'>" + bi("陸晨得到第一名！", "Lucas wins first place!") + "</div><div class='act'><button class='btn red' id='aWin'>" + bi("太棒了", "Awesome") + " ▶</button></div>");
      Read.pair("陸晨得到第一名！", "Lucas wins first place!");
      sfx("win");
      $("#aWin").onclick = function () { Read.stop(); go("win"); };
    } else {
      if (adv === "good") adv = "hill";
      var head = me.out ? ["脫軌了，沒有跑完。", "Course out, the car didn't finish."] : ["第 " + place + " 名！", "Place: " + place + "!"];
      maxSays(adv, "<button class='btn blue' id='aTune'>🔧 " + bi("調整再比一次", "Tune and race again") + "</button>");
      $("#ovlCard").insertAdjacentHTML("afterbegin", "<div class='big'>" + bi(head[0], head[1]) + "</div>");
      $("#aTune").onclick = function () { Read.stop(); closeOvl(); Tune.open(function () { go("race"); }, ["再比一次", "Race again"]); };
    }
  }
};
function rr(x, X, Y, W, H, R) { x.beginPath(); x.moveTo(X + R, Y); x.arcTo(X + W, Y, X + W, Y + H, R); x.arcTo(X + W, Y + H, X, Y + H, R); x.arcTo(X, Y + H, X, Y, R); x.arcTo(X, Y, X + W, Y, R); x.closePath(); }
