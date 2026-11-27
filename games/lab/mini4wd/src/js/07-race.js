/* ===== Race: top-down track on a canvas. The build decides everything; Lucas cheers. ===== */
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
  resize: function () {
    var cv = $("#raceCv"), r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.max(10, r.width * d); cv.height = Math.max(10, r.height * d);
    var b = TRACK.box, m = 7, W = b[2] - b[0] + m * 2, H = b[3] - b[1] + m * 2;
    this.sc = Math.min(cv.width / W, cv.height / H);
    this.ox = (cv.width - W * this.sc) / 2 - (b[0] - m) * this.sc; this.oy = (cv.height - H * this.sc) / 2 - (b[1] - m) * this.sc;
  },
  pos: function (c) {
    var r = c.r;
    if (r.out && r.outPos) return { x: r.outPos.x, y: r.outPos.y, h: r.outPos.rot, z: r.outPos.z };
    var p = trackAt(r.s), off = (r.lane - 1) * 2.4;
    return { x: p.x + Math.cos(p.h + Math.PI / 2) * off, y: p.y + Math.sin(p.h + Math.PI / 2) * off, h: p.h, z: 0 };
  },
  draw: function () {
    var cv = $("#raceCv"), x = cv.getContext("2d"), s = this.sc, self = this;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
    x.setTransform(s, 0, 0, s, this.ox, this.oy);
    var b = TRACK.box;
    x.fillStyle = "#2f9e44"; x.strokeStyle = "#111"; x.lineWidth = 0.4;
    rr(x, b[0] - 6, b[1] - 6, b[2] - b[0] + 12, b[3] - b[1] + 12, 4); x.fill(); x.stroke();
    function path(off) {
      x.beginPath();
      TRACK.pts.forEach(function (p, i) { var px = p.x + Math.cos(p.h + Math.PI / 2) * off, py = p.y + Math.sin(p.h + Math.PI / 2) * off; i ? x.lineTo(px, py) : x.moveTo(px, py); });
      x.closePath();
    }
    x.lineJoin = "round";
    path(0); x.strokeStyle = "#111"; x.lineWidth = 9; x.stroke();
    path(0); x.strokeStyle = "#e03131"; x.lineWidth = 8.4; x.stroke();
    path(0); x.strokeStyle = "#f1f3f5"; x.lineWidth = 7.6; x.stroke();
    [-1.2, 1.2].forEach(function (o) { path(o); x.strokeStyle = "#adb5bd"; x.lineWidth = 0.25; x.stroke(); });
    [-2.4, 0, 2.4].forEach(function (o, i) { path(o); x.strokeStyle = ["#d0ebff", "#ffe3e3", "#fff3bf"][i]; x.lineWidth = 1.6; x.stroke(); });
    // hill
    TRACK.hills.forEach(function (h) {
      for (var sx = h[0]; sx < h[1]; sx += 1.2) {
        var ph = (sx - h[0]) / (h[1] - h[0]), p = trackAt(sx), up = ph < 0.5;
        x.save(); x.translate(p.x, p.y); x.rotate(p.h);
        x.fillStyle = "rgba(240,140,0," + (0.15 + Math.sin(ph * Math.PI) * 0.45) + ")"; x.fillRect(-0.6, -3.8, 1.2, 7.6);
        if (Math.round((sx - h[0]) / 1.2) % 3 === 0) { x.strokeStyle = "#7c3a00"; x.lineWidth = 0.3; x.beginPath(); x.moveTo(up ? -0.4 : 0.4, -1.5); x.lineTo(up ? 0.4 : -0.4, 0); x.lineTo(up ? -0.4 : 0.4, 1.5); x.stroke(); }
        x.restore();
      }
      var m = trackAt((h[0] + h[1]) / 2);
      label(x, m.x, m.y + 7, "⛰ 上坡 HILL", "#7c3a00");
    });
    // start line
    var st = trackAt(0);
    for (var i = 0; i < 8; i++) for (var j = 0; j < 2; j++) { x.fillStyle = (i + j) % 2 ? "#111" : "#fff"; x.fillRect(st.x - 0.5 + j * 0.5, st.y - 3.8 + i * 0.95, 0.5, 0.95); }
    // cars (Lucas last so he's on top)
    this.cars.slice().reverse().forEach(function (c) {
      var p = self.pos(c), me = c.who === "lucas", hp = c.r.out ? -1 : hillPhase(c.r.s);
      var sz = (me ? 1.15 : 1) * (1 + (hp >= 0 ? Math.sin(hp * Math.PI) * 0.3 : 0) + (p.z || 0) * 0.08);
      var im = img(c.car), w = 2.1 * sz, hgt = w * (im.naturalHeight / (im.naturalWidth || 1) || 1.4);
      x.save(); x.translate(p.x, p.y); x.rotate(p.h + Math.PI / 2);
      if (me) { x.shadowColor = "#ffd43b"; x.shadowBlur = 14 * s / 10; }
      if (im.complete && im.naturalWidth) x.drawImage(im, -w / 2, -hgt / 2, w, hgt); else { x.fillStyle = me ? "#1c7ed6" : "#e03131"; x.fillRect(-w / 2, -hgt / 2, w, hgt); }
      x.restore();
      if (me) label(x, p.x, p.y - 3.2 - (p.z || 0) * 0.3, "Lucas 6", "#f76707", true);
    });
    // sparks
    this.fx = this.fx.filter(function (f) { f.life -= 1 / 60; f.x += f.vx / 60; f.y += f.vy / 60; x.fillStyle = "rgba(255,212,59," + Math.max(0, f.life * 2.5) + ")"; x.beginPath(); x.arc(f.x, f.y, 0.35, 0, 7); x.fill(); return f.life > 0; });
    if (this.cars[0].r.out) label(x, (b[0] + b[2]) / 2, (b[1] + b[3]) / 2, "COURSE OUT! 脫軌!", "#e03131", true, 2.4);
    function label(x, lx, ly, t, col, badge, size) {
      x.save(); x.font = "900 " + (size || 1.3) + "px system-ui,sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
      if (badge) { var w = x.measureText(t).width + 1; x.fillStyle = col; rr(x, lx - w / 2, ly - 0.9 * (size || 1.3) / 1.3, w, 1.8 * (size || 1.3) / 1.3, 0.8); x.fill(); x.strokeStyle = "#111"; x.lineWidth = 0.2; x.stroke(); x.fillStyle = "#fff"; }
      else x.fillStyle = col;
      x.fillText(t, lx, ly); x.restore();
    }
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
