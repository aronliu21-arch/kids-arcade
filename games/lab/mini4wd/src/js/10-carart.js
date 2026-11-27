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
  MOTORCAP: { normal: "#adb5bd", turbo: "#e03131", torque: "#fab005", hyper: "#1c7ed6" },
  GEARCOL: { speed: "#ffd43b", power: "#51cf66", mid: "#ff922b" },
  LAYERS: {}, // filled by the art list: name -> {box:[x,y,w,h] in car-width units}
  img: function (n) { var L = this.LAYERS[n]; if (!L) return null; var im = img("L_" + n); return im.complete && im.naturalWidth ? im : null; },
  draw: function (x, b, view, X, Y, w, o) {
    o = o || {}; var c = this.COL[o.col || "blue"] || this.COL.blue;
    x.save(); x.translate(X, Y); x.lineJoin = "round"; x.lineCap = "round";
    var h = view === "rear" ? this.rear(x, b, w, c) : this.top(x, b, w, c, o.center);
    x.restore(); return h;
  },
  lay: function (x, n, w) { // draw a layer image if we have one; box is in units of car width, origin = ground center (rear) or car center (top)
    var im = this.img(n); if (!im) return false; var bx = this.LAYERS[n].box;
    x.drawImage(im, bx[0] * w, bx[1] * w, bx[2] * w, bx[3] * w); return true;
  },
  /* ---- rear view (chase cam), low camera behind the car ---- */
  rear: function (x, b, w, c) {
    var lw = Math.max(1, w * 0.035), k = this, tire = b.tire || "hard", body = b.body || "boxy";
    function R(px, py, pw, ph, r, fill) { rr(x, px * w, py * w, pw * w, ph * w, r * w); x.fillStyle = fill; x.fill(); x.lineWidth = lw; x.strokeStyle = "#111"; x.stroke(); }
    function wheels(front) {
      var s = front ? 0.72 : 1, ty = front ? -0.36 : 0, tw = (tire === "low" ? 0.2 : 0.23) * s, th = (tire === "low" ? 0.3 : 0.36) * s, sx = front ? 0.36 : 0.43;
      if (k.lay(x, "rear_tire_" + tire + (front ? "_f" : ""), w)) return;
      [-1, 1].forEach(function (d) {
        var cx = d * sx - tw / 2;
        R(cx, ty - th, tw, th, 0.05 * s, tire === "soft" ? "#212529" : "#343a40");
        x.fillStyle = tire === "soft" ? "#f76707" : tire === "low" ? "#ced4da" : "#495057";
        x.fillRect((cx + tw * 0.15) * w, (ty - th * 0.62) * w, tw * 0.7 * w, th * 0.1 * w); // tire stripe
      });
    }
    function rollers(front) {
      if (b.roller === "no" || (front && b.roller !== "four")) return;
      if (k.lay(x, "rear_roller" + (front ? "_f" : ""), w)) return;
      var s = front ? 0.7 : 1, ty = front ? -0.33 : -0.1, sx = front ? 0.5 : 0.6;
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
    if (!this.lay(x, "rear_body_" + body + "_" + (Object.keys(this.COL).find(function (n) { return CarArt.COL[n] === c; }) || "blue"), w)) {
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
    if (b.wing && b.wing !== "none" && !this.lay(x, "rear_wing_" + b.wing, w)) {
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
      var tw = tire === "low" ? 0.18 : 0.22, tl = tire === "low" ? 0.3 : 0.34;
      [[-1, -0.5], [1, -0.5], [-1, 0.48], [1, 0.48]].forEach(function (p) {
        R(p[0] * 0.44 - tw / 2, p[1] - tl / 2, tw, tl, 0.05, tire === "soft" ? "#212529" : "#343a40");
        x.fillStyle = tire === "soft" ? "#f76707" : tire === "low" ? "#ced4da" : "#495057"; x.fillRect((p[0] * 0.44 - tw * 0.1) * w, (p[1] - tl * 0.4) * w, tw * 0.2 * w, tl * 0.8 * w);
      });
    }
    // rollers
    if (b.roller !== "no" && !this.lay(x, "top_roller_" + b.roller, w)) {
      var rp = b.roller === "four" ? [[-1, -0.74], [1, -0.74], [-1, 0.74], [1, 0.74]] : [[-1, -0.74], [1, -0.74]];
      rp.forEach(function (p) { x.lineWidth = lw; x.strokeStyle = "#111"; x.beginPath(); x.moveTo(p[0] * 0.3 * w, p[1] * w); x.lineTo(p[0] * 0.5 * w, p[1] * w); x.stroke(); x.beginPath(); x.arc(p[0] * 0.53 * w, p[1] * w, 0.07 * w, 0, 7); x.fillStyle = "#dee2e6"; x.fill(); x.stroke(); });
    }
    // body
    if (!this.lay(x, "top_body_" + body + "_" + (Object.keys(this.COL).find(function (n) { return CarArt.COL[n] === c; }) || "blue"), w)) {
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
    if (b.wing && b.wing !== "none" && !this.lay(x, "top_wing_" + b.wing, w)) { var ww = b.wing === "big" ? 0.96 : 0.7; R(-ww / 2, 0.66, ww, b.wing === "big" ? 0.16 : 0.11, 0.03, c.dark); }
    return L * w;
  }
};
function star(x, cx, cy, r) { x.beginPath(); for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r * 0.45 : r; x[i ? "lineTo" : "moveTo"](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } x.closePath(); x.fill(); x.stroke(); }
