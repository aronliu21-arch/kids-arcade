/* ===== Bilingual text helpers: Chinese with zhuyin ruby + English ===== */
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function zh(text) {
  return String(text).replace(/[一-鿿]+|[^一-鿿]+/g, function (run) {
    if (!/[一-鿿]/.test(run)) return esc(run);
    var zs = ZYR[run] ? ZYR[run].split(" ") : null, out = "";
    for (var i = 0; i < run.length; i++) {
      var z = zs ? zs[i] : ZYC[run[i]];
      out += z ? "<ruby>" + run[i] + "<rt>" + z + "</rt></ruby>" : run[i];
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
  pair: function (z, e, pitch, onEnd) {
    if (!this.on || !window.KAVoice) { if (onEnd) onEnd(); return; }
    try { KAVoice.stop(); KAVoice.sayParts([[e, "en-US"], [z, "zh-TW"]].filter(function (p) { return p[0]; }), { pitch: pitch || 1, onEnd: onEnd }); } catch (x) { if (onEnd) onEnd(); }
  },
  stop: function () { try { window.KAVoice && KAVoice.stop(); } catch (x) {} }
};
