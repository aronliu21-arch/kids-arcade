/* ===== CarArt: layered car (body, wheels, motor, rollers, wing, sticker) in rear or top view =====
   draw(ctx, build, view, x, y, w, {col, center}) -> height drawn.
   Rear: (x,y) is the ground point under the car. Top: car points up; center:true puts (x,y) at the middle.
   Layer art (assets/L_<view>_<layer>_<variant>.webp) is used when present; otherwise the code drawing below. */
var CarArt = {
  COL: {
    blue: { main: "#1c7ed6", dark: "#1864ab", light: "#74c0fc" },
    red: { main: "#e03131", dark: "#a61e1e", light: "#ff8787" },
    green: { main: "#2f9e44", dark: "#2b8a3e", light: "#8ce99a" },
    yellow: { main: "#fab005", dark: "#e67700", light: "#ffe066" },
    purple: { main: "#7048e8", dark: "#5f3dc4", light: "#b197fc" }
  },
  MOTORCAP: { normal: "#adb5bd", rev: "#ae3ec9", turbo: "#e03131", torque: "#fab005", light: "#20c997", hyper: "#1c7ed6", sprint: "#f76707", mach: "#212529" },
  GEARCOL: { speed: "#ffd43b", power: "#51cf66", mid: "#ff922b", super: "#f03e3e", climb: "#1971c2" },
  TIREART: { hard: "hard", soft: "soft", low: "low", sponge: "soft", slick: "low", spike: "hard", large: "hard" }, // which rear-view tire picture each tire uses
  TIRESTRIPE: { hard: "#495057", soft: "#f76707", low: "#ced4da", sponge: "#fff3bf", slick: "#74c0fc", spike: "#ffd43b", large: "#e03131" },
  FOUR: { four: 1, bearing: 1 }, // rollers front and back
  ROLLCOL: { yes: "#dee2e6", four: "#dee2e6", plastic: "#ffe066", alu: "#a5d8ff", bearing: "#ffd8a8" },
  // ChatGPT layer art: name -> box [x, y, w, h] in car-width units (rear: origin = ground center; top: origin = car center)
  LAYERS: {
    rear_body_boxy: [-0.416, -0.688, 0.832, 0.588], rear_body_sleek: [-0.431, -0.592, 0.863, 0.492], rear_body_aero: [-0.47, -0.504, 0.94, 0.404],
    top_body_boxy: [-0.402, -0.749, 0.804, 1.498], top_body_sleek: [-0.481, -0.75, 0.963, 1.5], top_body_aero: [-0.45, -0.75, 0.9, 1.5]
  },
  PARTS: ["rear_tire_hard", "rear_tire_soft", "rear_tire_low", "rear_wing_small", "rear_wing_big", "rear_roller"], // sized in code (by width)
  part: function (x, n, cx, bottom, wid, w, flip, col) { // draw a part image by width with its bottom at y; false if not loaded
    var im = img("L_" + n); if (!(im.complete && im.naturalWidth)) return false;
    var hh0 = wid * im.naturalHeight / im.naturalWidth; if (col && col !== "blue") im = this.tinted(n, im, col) || im;
    var hh = hh0;
    if (flip) { x.save(); x.translate(cx * w, 0); x.scale(-1, 1); x.drawImage(im, -wid / 2 * w, (bottom - hh) * w, wid * w, hh * w); x.restore(); }
    else x.drawImage(im, (cx - wid / 2) * w, (bottom - hh) * w, wid * w, hh * w);
    return hh;
  },
  // Chapter 2 art bodies (top view only from ChatGPT): assets/b/<id>_<color>.webp
  artBody: function (b) { var id = b.body, f = typeof C2BODIES !== "undefined" && C2BODIES.filter(function (x) { return x.v === id; })[0]; if (!f) return null;
    var im = img("b/" + id + "_" + (f.cols.indexOf(b.paint) >= 0 ? b.paint : "orig")); return im.complete && im.naturalWidth ? im : null; },
  isArt: function (b) { return typeof C2BODIES !== "undefined" && C2BODIES.some(function (x) { return x.v === b.body; }); },
  /* store pictures for every part (drawn in code, same style) */
  _ic: {},
  icon: function (slot, v) {
    var key = slot + ":" + v; if (this._ic[key]) return this._ic[key];
    var cv = document.createElement("canvas"); cv.width = cv.height = 120; var x = cv.getContext("2d"), k = this;
    x.translate(60, 60); x.lineJoin = x.lineCap = "round"; x.lineWidth = 5; x.strokeStyle = "#111";
    function circ(r, f) { x.beginPath(); x.arc(0, 0, r, 0, 7); x.fillStyle = f; x.fill(); x.stroke(); }
    if (slot === "motor") {
      var cap = this.MOTORCAP[v] || "#adb5bd";
      rr(x, -38, -24, 66, 48, 12); x.fillStyle = "#ced4da"; x.fill(); x.stroke();
      x.fillStyle = cap; rr(x, -38, -24, 22, 48, 10); x.fill(); x.stroke();
      x.fillStyle = "#fff"; x.fillRect(-8, -16, 30, 6); x.fillStyle = cap; x.fillRect(-8, 6, 30, 8);
      x.fillStyle = "#868e96"; x.fillRect(28, -5, 16, 10); x.strokeRect(28, -5, 16, 10);
      if (v === "mach" || v === "sprint" || v === "hyper") { x.fillStyle = "#ffd43b"; x.font = "900 26px system-ui"; x.textAlign = "center"; x.fillText("⚡", 6, -28); }
    } else if (slot === "gear") {
      var col = this.GEARCOL[v] || "#ffd43b", n = { speed: 10, power: 16, mid: 13, super: 8, climb: 20 }[v] || 12, R0 = { speed: 34, power: 40, mid: 37, super: 30, climb: 44 }[v] || 36;
      x.beginPath(); for (var i = 0; i < n * 2; i++) { var a = i * Math.PI / n, r = i % 2 ? R0 - 8 : R0; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fillStyle = col; x.fill(); x.stroke();
      circ(10, "#fff");
    } else if (slot === "tire") {
      var big = v === "large" ? 48 : v === "low" || v === "slick" ? 36 : 42;
      circ(big, v === "sponge" ? "#e9ecef" : v === "hard" ? "#495057" : "#212529");
      if (v === "spike") for (var j = 0; j < 14; j++) { var aa = j * Math.PI / 7; x.beginPath(); x.moveTo(Math.cos(aa) * big, Math.sin(aa) * big); x.lineTo(Math.cos(aa) * (big + 9), Math.sin(aa) * (big + 9)); x.stroke(); }
      x.lineWidth = 6; x.strokeStyle = this.TIRESTRIPE[v] || "#868e96"; x.beginPath(); x.arc(0, 0, big - 9, 0, 7); x.stroke();
      x.lineWidth = 5; x.strokeStyle = "#111"; circ(big * 0.42, "#f1f3f5");
      if (v === "slick") { x.strokeStyle = "rgba(255,255,255,.6)"; x.beginPath(); x.arc(0, 0, big - 3, -2.4, -1.4); x.stroke(); }
    } else if (slot === "roller") {
      var col2 = this.ROLLCOL[v] || "#dee2e6", n2 = v === "no" ? 0 : this.FOUR[v] ? 4 : 2;
      if (!n2) { x.font = "900 54px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("🚫", 0, 4); }
      for (var q = 0; q < n2; q++) { x.save(); x.translate(n2 === 4 ? (q % 2 ? 24 : -24) : (q ? 24 : -24), n2 === 4 ? (q < 2 ? -24 : 24) : 0); x.beginPath(); x.arc(0, 0, n2 === 4 ? 20 : 26, 0, 7); x.fillStyle = col2; x.fill(); x.stroke(); x.beginPath(); x.arc(0, 0, 6, 0, 7); x.fillStyle = "#495057"; x.fill(); if (v === "bearing") { x.fillStyle = "#fff"; for (var z = 0; z < 6; z++) { x.beginPath(); x.arc(Math.cos(z) * 12, Math.sin(z) * 12, 2.5, 0, 7); x.fill(); } } x.restore(); }
    } else if (slot === "wing") {
      var wc = "#1c7ed6";
      if (v === "none") { x.font = "900 54px system-ui"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("🚫", 0, 4); }
      if (v === "small" || v === "big" || v === "dual") { var ww2 = v === "small" ? 70 : 96; [-1, 1].forEach(function (d) { x.fillStyle = "#868e96"; x.fillRect(d * ww2 * 0.28 - 4, -6, 8, 34); x.strokeRect(d * ww2 * 0.28 - 4, -6, 8, 34); }); x.fillStyle = wc; rr(x, -ww2 / 2, -20, ww2, 16, 6); x.fill(); x.stroke(); if (v === "dual") { rr(x, -ww2 / 2 + 8, -42, ww2 - 16, 14, 6); x.fill(); x.stroke(); } if (v !== "small") { x.fillRect(-ww2 / 2 - 4, -30, 10, 30); x.strokeRect(-ww2 / 2 - 4, -30, 10, 30); x.fillRect(ww2 / 2 - 6, -30, 10, 30); x.strokeRect(ww2 / 2 - 6, -30, 10, 30); } }
      if (v === "fin") { x.fillStyle = wc; x.beginPath(); x.moveTo(-26, 30); x.quadraticCurveTo(-4, -10, 18, -40); x.lineTo(26, 30); x.closePath(); x.fill(); x.stroke(); }
      if (v === "air") { x.fillStyle = wc; x.beginPath(); x.moveTo(-50, 10); x.lineTo(-36, -14); x.lineTo(36, -14); x.lineTo(50, 10); x.closePath(); x.fill(); x.stroke(); }
    }
    return (this._ic[key] = cv.toDataURL());
  },
  _tc: {},
  topCanvas: function (b, col) { // the whole top-view car drawn once into a canvas (re-made when more images load)
    var key = JSON.stringify([b.body, b.paint, b.tire, b.roller, b.wing, b.motor, b.gear, b.sticker, col]), e = this._tc[key];
    if (e && e.n === IMGN) return e.cv;
    var W = 96, cv = (e && e.cv) || document.createElement("canvas"); cv.width = W * 1.3; cv.height = W * 1.8;
    var x = cv.getContext("2d"); x.clearRect(0, 0, cv.width, cv.height); this.draw(x, b, "top", cv.width / 2, cv.height / 2, W, { col: col, center: true });
    this._tc[key] = { cv: cv, n: IMGN, dk: null }; return cv;
  },
  _dk: {},
  dark: function (src, key) { // a darker copy of a car picture, used for the sides of the car
    var e = null; for (var k in this._tc) if (this._tc[k].cv === src) e = this._tc[k];
    if (e && e.dk && e.dkn === e.n) return e.dk;
    if (!e && key && this._dk[key]) return this._dk[key];
    var cv = document.createElement("canvas"); cv.width = src.width || src.naturalWidth; cv.height = src.height || src.naturalHeight;
    var x = cv.getContext("2d"); x.drawImage(src, 0, 0, cv.width, cv.height); x.globalCompositeOperation = "source-atop"; x.fillStyle = "rgba(10,20,40,.55)"; x.fillRect(0, 0, cv.width, cv.height);
    if (e) { e.dk = cv; e.dkn = e.n; } else if (key) this._dk[key] = cv;
    return cv;
  },
  img: function (n) { if (!this.LAYERS[n]) return null; var im = img("L_" + n); return im.complete && im.naturalWidth ? im : null; },
  _tint: {},
  tinted: function (n, im, col) { // recolor the blue art to a team color (blue parts only; white, black and red stay)
    var key = n + ":" + col; if (this._tint[key] !== undefined) return this._tint[key];
    var t = null;
    try {
      var cv = document.createElement("canvas"); cv.width = im.naturalWidth; cv.height = im.naturalHeight;
      var x = cv.getContext("2d"); x.drawImage(im, 0, 0); var d = x.getImageData(0, 0, cv.width, cv.height), p = d.data;
      var m = this.COL[col].main, tr = parseInt(m.substr(1, 2), 16), tg = parseInt(m.substr(3, 2), 16), tb = parseInt(m.substr(5, 2), 16);
      for (var i = 0; i < p.length; i += 4) {
        var r = p[i], g = p[i + 1], b = p[i + 2];
        if (b > r + 40 && b > g + 15) { var k = Math.min(1.4, b / 214); p[i] = Math.min(255, tr * k); p[i + 1] = Math.min(255, tg * k); p[i + 2] = Math.min(255, tb * k); }
      }
      x.putImageData(d, 0, 0); t = cv;
    } catch (e) { t = null; } // file:// pages can't read pixels: keep blue
    this._tint[key] = t; return t;
  },
  draw: function (x, b, view, X, Y, w, o) {
    o = o || {}; var c = this.COL[o.col || "blue"] || this.COL.blue; this.cn = this.COL[o.col] ? o.col : "blue";
    x.save(); x.translate(X, Y); x.lineJoin = "round"; x.lineCap = "round";
    var h = view === "rear" ? this.rear(x, b, w, c) : this.top(x, b, w, c, o.center);
    x.restore(); return h;
  },
  lay: function (x, n, w, col) { // draw a layer image if we have one
    var im = this.img(n); if (!im) return false; var bx = this.LAYERS[n];
    if (col && col !== "blue") im = this.tinted(n, im, col) || im;
    x.drawImage(im, bx[0] * w, bx[1] * w, bx[2] * w, bx[3] * w); return true;
  },
  /* ---- rear view (chase cam), low camera behind the car ---- */
  rear: function (x, b, w, c) {
    var lw = Math.max(1, w * 0.035), k = this, tire = b.tire || "hard", body = b.body || "boxy";
    function R(px, py, pw, ph, r, fill) { rr(x, px * w, py * w, pw * w, ph * w, r * w); x.fillStyle = fill; x.fill(); x.lineWidth = lw; x.strokeStyle = "#111"; x.stroke(); }
    function wheels(front) {
      var big = tire === "large" ? 1.15 : 1, thin = tire === "low" || tire === "slick";
      var s = (front ? 0.72 : 1) * big, ty = front ? -0.36 : 0, tw = (thin ? 0.2 : 0.23) * s, th = (thin ? 0.3 : 0.36) * s, sx = front ? 0.36 : 0.43;
      var pw = (thin ? 0.235 : 0.27) * s, ta = k.TIREART[tire] || "hard";
      if (k.part(x, "rear_tire_" + ta, -sx, ty, pw, w) && k.part(x, "rear_tire_" + ta, sx, ty, pw, w)) {
        if (ta !== tire) [-1, 1].forEach(function (d) { x.fillStyle = k.TIRESTRIPE[tire]; x.fillRect((d * sx - pw * 0.12) * w, (ty - pw * 0.9) * w, pw * 0.24 * w, pw * 0.5 * w); }); // stripe tells the tire apart
        return;
      }
      [-1, 1].forEach(function (d) {
        var cx = d * sx - tw / 2;
        R(cx, ty - th, tw, th, 0.05 * s, tire === "soft" ? "#212529" : "#343a40");
        x.fillStyle = k.TIRESTRIPE[tire] || "#495057";
        x.fillRect((cx + tw * 0.15) * w, (ty - th * 0.62) * w, tw * 0.7 * w, th * 0.1 * w); // tire stripe
      });
    }
    function rollers(front) {
      if (b.roller === "no" || (front && !k.FOUR[b.roller])) return;
      var s = front ? 0.7 : 1, ty = front ? -0.33 : -0.1, sx = front ? 0.5 : 0.6;
      if (k.part(x, "rear_roller", -(sx - 0.03), ty + 0.1 * s, 0.3 * s, w) && k.part(x, "rear_roller", sx - 0.03, ty + 0.1 * s, 0.3 * s, w, true)) return;
      [-1, 1].forEach(function (d) {
        x.lineWidth = lw; x.strokeStyle = "#111";
        x.beginPath(); x.moveTo(d * (sx - 0.12) * w, ty * w); x.lineTo(d * sx * w, ty * w); x.stroke(); // stay
        x.beginPath(); x.ellipse(d * sx * w, ty * w, 0.07 * s * w, 0.05 * s * w, 0, 0, 7); x.fillStyle = "#dee2e6"; x.fill(); x.stroke();
      });
    }
    // shadow
    x.fillStyle = "rgba(0,0,0,.28)"; x.beginPath(); x.ellipse(0, 0, 0.62 * w, 0.07 * w, 0, 0, 7); x.fill();
    wheels(true); rollers(true);
    // chassis plate
    R(-0.42, -0.2, 0.84, 0.1, 0.03, "#343a40");
    // body shell
    var top = -0.72;
    var ab = this.isArt(b) ? this.artBody(b) : null;
    if (ab) { // seen from behind and a little above: the top art squashed, standing on dark sides
      var bw = 0.9, bh = bw * ab.naturalHeight / ab.naturalWidth * 0.42, side = 0.16, by0 = -0.1;
      var dk = this.dark(ab, "art:" + ab.src);
      for (var i = 0; i < 6; i++) x.drawImage(dk, -bw / 2 * w, (by0 - side * i / 5 - bh) * w, bw * w, bh * w);
      x.drawImage(ab, -bw / 2 * w, (by0 - side - bh) * w, bw * w, bh * w);
      top = by0 - side - bh;
    }
    else if (this.lay(x, "rear_body_" + body, w, this.cn)) top = this.LAYERS["rear_body_" + body][1];
    else {
      x.lineWidth = lw; x.strokeStyle = "#111"; x.fillStyle = c.main; x.beginPath();
      if (body === "boxy") { x.moveTo(-0.38 * w, -0.2 * w); x.lineTo(-0.34 * w, -0.62 * w); x.lineTo(0.34 * w, -0.62 * w); x.lineTo(0.38 * w, -0.2 * w); top = -0.62; }
      else if (body === "sleek") { x.moveTo(-0.4 * w, -0.2 * w); x.quadraticCurveTo(-0.36 * w, -0.5 * w, -0.16 * w, -0.56 * w); x.lineTo(0.16 * w, -0.56 * w); x.quadraticCurveTo(0.36 * w, -0.5 * w, 0.4 * w, -0.2 * w); top = -0.56; }
      else { x.moveTo(-0.42 * w, -0.2 * w); x.lineTo(-0.3 * w, -0.42 * w); x.lineTo(-0.1 * w, -0.48 * w); x.lineTo(0.1 * w, -0.48 * w); x.lineTo(0.3 * w, -0.42 * w); x.lineTo(0.42 * w, -0.2 * w); top = -0.48;
        // aero fins
        [-1, 1].forEach(function (d) { x.moveTo(d * 0.3 * w, -0.42 * w); }); }
      x.closePath(); x.fill(); x.stroke();
      // window + stripe
      x.fillStyle = "#212529"; x.beginPath(); x.ellipse(0, (top + 0.1) * w, 0.14 * w, 0.06 * w, 0, 0, 7); x.fill();
      x.fillStyle = "#fff"; x.fillRect(-0.03 * w, (top + 0.18) * w, 0.06 * w, (-0.2 - top - 0.2) * w);
      x.fillStyle = c.light; x.fillRect(-0.3 * w, -0.3 * w, 0.6 * w, 0.04 * w);
      if (body === "aero") [-1, 1].forEach(function (d) { R(d * 0.36 - 0.03, -0.62, 0.06, 0.2, 0.02, c.dark); });
    }
    if (b.sticker) { x.fillStyle = "#ffd43b"; x.strokeStyle = "#111"; x.lineWidth = lw * 0.6; star(x, 0.22 * w, (top + 0.2) * w, 0.06 * w); }
    // motor can at the back (end-cap color shows which motor)
    if (!this.lay(x, "rear_motor_" + (b.motor || "normal"), w)) {
      R(-0.13, -0.3, 0.26, 0.14, 0.04, "#ced4da");
      x.beginPath(); x.ellipse(0, -0.23 * w, 0.07 * w, 0.055 * w, 0, 0, 7); x.fillStyle = this.MOTORCAP[b.motor || "normal"]; x.fill(); x.lineWidth = lw; x.stroke();
    }
    wheels(false); rollers(false);
    // rear wing
    var wn = b.wing === "dual" ? "big" : b.wing === "air" || b.wing === "fin" ? null : b.wing;
    var wh = wn && wn !== "none" ? this.part(x, "rear_wing_" + wn, 0, top + 0.1, wn === "big" ? 0.84 : 0.58, w, false, this.cn) : 0;
    if (wh && b.wing === "dual") { var w2 = this.part(x, "rear_wing_small", 0, top + 0.1 - wh + 0.06, 0.66, w, false, this.cn); wh += (w2 || 0) - 0.06; }
    if (b.wing === "fin") { x.fillStyle = c.dark; x.strokeStyle = "#111"; x.lineWidth = lw; x.beginPath(); x.moveTo(-0.04 * w, (top + 0.04) * w); x.lineTo(0, (top - 0.2) * w); x.lineTo(0.04 * w, (top + 0.04) * w); x.closePath(); x.fill(); x.stroke(); top -= 0.2; }
    if (b.wing === "air") { R(-0.4, -0.18, 0.8, 0.06, 0.02, c.dark); }
    if (wh) top = top + 0.1 - wh;
    else if (wn && wn !== "none") {
      var big = b.wing === "big", wy = top - (big ? 0.2 : 0.12), ww = big ? 0.9 : 0.62;
      [-1, 1].forEach(function (d) { R(d * ww * 0.3 - 0.025, wy, 0.05, top - wy + 0.05, 0.01, "#495057"); });
      R(-ww / 2, wy - 0.07, ww, 0.08, 0.03, c.dark); top = wy - 0.07;
    }
    // tail lights
    x.fillStyle = "#ffd43b"; x.fillRect(-0.3 * w, -0.26 * w, 0.1 * w, 0.04 * w); x.fillRect(0.2 * w, -0.26 * w, 0.1 * w, 0.04 * w);
    return -top * w;
  },
  /* ---- top view (garage, 2.5D race), front points up ---- */
  top: function (x, b, w, c, center) {
    var L = 1.6, lw = Math.max(0.6, w * 0.04), k = this, tire = b.tire || "hard", body = b.body || "boxy";
    if (!center) x.translate(0, L * w / 2);
    function R(px, py, pw, ph, r, fill) { rr(x, px * w, py * w, pw * w, ph * w, r * w); x.fillStyle = fill; x.fill(); x.lineWidth = lw; x.strokeStyle = "#111"; x.stroke(); }
    // tires (4)
    if (!this.lay(x, "top_tire_" + tire, w)) {
      var tw = tire === "low" || tire === "slick" ? 0.18 : 0.22, tl = tire === "large" ? 0.4 : tire === "low" || tire === "slick" ? 0.3 : 0.34;
      [[-1, -0.5], [1, -0.5], [-1, 0.48], [1, 0.48]].forEach(function (p) {
        R(p[0] * 0.44 - tw / 2, p[1] - tl / 2, tw, tl, 0.05, tire === "soft" ? "#212529" : "#343a40");
        x.fillStyle = k.TIRESTRIPE[tire] || "#495057"; x.fillRect((p[0] * 0.44 - tw * 0.1) * w, (p[1] - tl * 0.4) * w, tw * 0.2 * w, tl * 0.8 * w);
      });
    }
    // rollers
    if (b.roller !== "no" && !this.lay(x, "top_roller_" + b.roller, w)) {
      var rp = k.FOUR[b.roller] ? [[-1, -0.74], [1, -0.74], [-1, 0.74], [1, 0.74]] : [[-1, -0.74], [1, -0.74]];
      rp.forEach(function (p) { x.lineWidth = lw; x.strokeStyle = "#111"; x.beginPath(); x.moveTo(p[0] * 0.3 * w, p[1] * w); x.lineTo(p[0] * 0.5 * w, p[1] * w); x.stroke(); x.beginPath(); x.arc(p[0] * 0.53 * w, p[1] * w, 0.07 * w, 0, 7); x.fillStyle = k.ROLLCOL[b.roller] || "#dee2e6"; x.fill(); x.stroke(); });
    }
    // body
    var abt = this.isArt(b) ? this.artBody(b) : null;
    if (abt) { var bl = 1.5, bwid = bl * abt.naturalWidth / abt.naturalHeight; x.drawImage(abt, -bwid / 2 * w, -bl / 2 * w, bwid * w, bl * w); }
    else if (!this.lay(x, "top_body_" + body, w, this.cn)) {
      x.lineWidth = lw; x.strokeStyle = "#111"; x.fillStyle = c.main; x.beginPath();
      if (body === "boxy") { rr(x, -0.32 * w, -0.72 * w, 0.64 * w, 1.4 * w, 0.12 * w); }
      else if (body === "sleek") { x.moveTo(0, -0.8 * w); x.quadraticCurveTo(0.34 * w, -0.5 * w, 0.32 * w, 0.66 * w); x.lineTo(-0.32 * w, 0.66 * w); x.quadraticCurveTo(-0.34 * w, -0.5 * w, 0, -0.8 * w); }
      else { x.moveTo(0, -0.82 * w); x.lineTo(0.26 * w, -0.3 * w); x.lineTo(0.36 * w, 0.66 * w); x.lineTo(-0.36 * w, 0.66 * w); x.lineTo(-0.26 * w, -0.3 * w); x.closePath(); }
      x.fill(); x.stroke();
      x.fillStyle = "#fff"; x.fillRect(-0.04 * w, -0.6 * w, 0.08 * w, 1.1 * w);
      x.fillStyle = "#212529"; x.beginPath(); x.ellipse(0, -0.12 * w, 0.13 * w, 0.2 * w, 0, 0, 7); x.fill();
      x.fillStyle = c.light; x.fillRect(-0.24 * w, 0.2 * w, 0.48 * w, 0.05 * w);
    }
    if (b.sticker) { x.fillStyle = "#ffd43b"; x.strokeStyle = "#111"; x.lineWidth = lw * 0.6; star(x, 0.17 * w, 0.4 * w, 0.08 * w); }
    // motor (rear center, end-cap color) and gear dot
    R(-0.1, 0.42, 0.2, 0.18, 0.04, "#ced4da");
    x.beginPath(); x.arc(0, 0.62 * w, 0.06 * w, 0, 7); x.fillStyle = this.MOTORCAP[b.motor || "normal"]; x.fill(); x.lineWidth = lw; x.stroke();
    x.beginPath(); x.arc(0.18 * w, 0.48 * w, 0.05 * w, 0, 7); x.fillStyle = this.GEARCOL[b.gear || "speed"]; x.fill(); x.stroke();
    // wing
    if (b.wing && b.wing !== "none") {
      var ww = { big: 0.96, dual: 1.0, small: 0.7, fin: 0.12, air: 0.8 }[b.wing], wy = b.wing === "air" ? -0.86 : 0.66, wd = { big: 0.16, dual: 0.26, small: 0.11, fin: 0.3, air: 0.1 }[b.wing];
      R(-ww / 2, b.wing === "fin" ? 0.2 : wy, ww, wd, 0.03, c.dark);
    }
    return L * w;
  }
};
function star(x, cx, cy, r) { x.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; x[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } x.closePath(); x.fill(); x.stroke(); }
