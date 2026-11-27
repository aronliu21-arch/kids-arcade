/* ===== Bilingual text helpers: Chinese with zhuyin ruby + English ===== */
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
/* Taiwan textbook zhuyin: a vertical column to the RIGHT of the character, tone mark to the right of the column, light tone ˙ on top */
function zyHTML(ch, z) {
  var light = z.charAt(0) === "˙", tone = "";
  if (light) z = z.slice(1);
  if (/[ˊˇˋ]$/.test(z)) { tone = z.slice(-1); z = z.slice(0, -1); }
  var col = (light ? "<i class='zl'>˙</i>" : "") + z.split("").map(function (c) { return "<i>" + c + "</i>"; }).join("");
  return "<span class='zc'>" + ch + "<span class='zy' aria-hidden='true'><span class='zb'>" + col + "</span>" + (tone ? "<span class='zt'>" + tone + "</span>" : "") + "</span></span>";
}
function zh(text) {
  return String(text).replace(/[一-鿿]+|[^一-鿿]+/g, function (run) {
    if (!/[一-鿿]/.test(run)) return esc(run);
    var zs = ZYR[run] ? ZYR[run].split(" ") : null, out = "";
    for (var i = 0; i < run.length; i++) {
      var z = zs ? zs[i] : ZYC[run[i]];
      out += z ? zyHTML(run[i], z) : run[i];
    }
    return out;
  });
}
/* A two-line label: Chinese (with zhuyin) over English */
function bi(z, e, cls) { return "<span class='bi " + (cls || "") + "'><span class='z'>" + zh(z) + "</span><span class='e'>" + esc(e) + "</span></span>"; }
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function A(name) { return "assets/" + name + ".webp"; }

/* Read-aloud through the shared Dino World voice */
var Read = {
  on: true,
  lang: "both", // "both" | "zh" | "en": which language the voice reads
  LANGS: { both: ["中+EN", "中文和英文", "Chinese and English"], zh: ["中文", "只讀中文", "Chinese only"], en: ["EN", "只讀英文", "English only"] },
  setLang: function (l) {
    this.lang = l; DB.settings = DB.settings || {}; DB.settings.lang = l; DB.save();
    $("#bLang").textContent = this.LANGS[l][0];
    var t = this.LANGS[l]; this.pair(t[1], t[2]);
  },
  pair: function (z, e, pitch, onEnd) {
    if (!this.on || !window.KAVoice) { if (onEnd) onEnd(); return; }
    if (this.lang === "zh" && z) e = ""; else if (this.lang === "en" && e) z = "";
    try { KAVoice.stop(); KAVoice.sayParts([[e, "en-US"], [z, "zh-TW"]].filter(function (p) { return p[0]; }), { pitch: pitch || 1, onEnd: onEnd }); } catch (x) { if (onEnd) onEnd(); }
  },
  stop: function () { try { window.KAVoice && KAVoice.stop(); } catch (x) {} }
};
