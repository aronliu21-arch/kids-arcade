/* ===== Race: 3/4-view track on a canvas (hill rises, speed trails). The build decides everything; Lucas cheers. ===== */
var IMG = {};
function img(n) { if (!IMG[n]) { IMG[n] = new Image(); IMG[n].src = A(n); } return IMG[n]; }
["c_blue", "c_red", "c_green"].forEach(img);

var Race = {
  speed: 1,
  start: function (mode) {
    var self = this, k = G.kd;
    this.mode = mode; this.laps = mode === "race" ? 3 : 1; this.over = false; this.t = 0; this.fx = []; this.said = {};
    this.cars = [{ who: "lucas", car: "c_blue", r: new Racer(k.build, { laps: this.laps, lane: 0 }) }];
    if (mode === "race") RIVALS.forEach(function (rv, i) { self.cars.push({ who: rv.who, car: rv.car, r: new Racer(rv.build, { laps: self.laps, lane: i + 1 }) }); });
    show("sRace"); this.resize();
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
    if (CUR !== "sRace") return;
    var now = performance.now(), dt = Math.min(0.05, (now - this.last) / 1000) * this.speed; this.last = now;
    var steps = Math.ceil(dt / (1 / 60)), h = dt / steps;
    for (var i = 0; i < steps; i++) this.cars.forEach(function (c) { c.r.step(h); });
    this.t += dt;
    this.events();
    this.draw(); this.hud();
    var me = this.cars[0].r;
    Engine.set(me.out || me.done ? 0 : me.v / me.st.top * 10);
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
    if (this.mode !== "race") { $("#hPos").innerHTML = "<span class='chip me'>" + bi("測試跑道", "Test run") + "</span>"; return; }
    $("#hPos").innerHTML = this.order().map(function (c, i) { return "<span class='chip" + (c.who === "lucas" ? " me" : "") + "'>" + (i + 1) + ". " + CAST[c.who].en + "</span>"; }).join(" ");
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
    bg.width = cv.width; bg.height = cv.height;
    x.setTransform(this.sc, 0, 0, this.sc, this.ox, this.oy); x.lineJoin = "round";
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
  draw: function () {
    var cv = $("#raceCv"), x = cv.getContext("2d"), s = this.sc, self = this, b = TRACK.box;
    this.label = label;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
    if (this.bg) x.drawImage(this.bg, 0, 0);
    x.setTransform(s, 0, 0, s, this.ox, this.oy); x.lineJoin = "round";
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
    function sprite(px, py, pz, alpha) {
      var q = self.P(px, py, pz); x.save(); x.globalAlpha = alpha; x.translate(q[0], q[1]); x.scale(1, self.K); x.rotate(p.h + Math.PI / 2);
      if (me && alpha === 1) { x.shadowColor = "#ffd43b"; x.shadowBlur = 14 * self.sc / 10; }
      if (im.complete && im.naturalWidth) x.drawImage(im, -w / 2, -hgt / 2, w, hgt); else { x.fillStyle = me ? "#1c7ed6" : "#e03131"; x.fillRect(-w / 2, -hgt / 2, w, hgt); }
      x.restore();
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
    k.races = (k.races || 0) + 1; save();
    var place = this.order().indexOf(this.cars[0]) + 1;
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
