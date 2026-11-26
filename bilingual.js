/* Kids Arcade: adds zhuyin beside Chinese characters and small English lines to Chinese-only games.
   Usage: <script src="../../bilingual.js"></script><script>KAbi.init({zy:{...char:zhuyin}, en:{"中文":"English"}})</script>
   Safe: everything is wrapped in try/catch, and text the game rewrites is annotated again. */
(function () {
  "use strict";
  var CJK = /[一-鿿]/;
  var SKIP = { SCRIPT: 1, STYLE: 1, RUBY: 1, RT: 1, TEXTAREA: 1, INPUT: 1, SVG: 1, CANVAS: 1, TITLE: 1, OPTION: 1 };
  var ZY = {}, EN = {}, RX = [], busy = false;
  function skip(el) { for (; el && el.nodeType === 1; el = el.parentNode) { if (SKIP[el.tagName.toUpperCase()] || el.hasAttribute("data-no-zy") || el.classList.contains("ka-en")) return true; } return false; }
  function ruby(text) {
    var f = document.createDocumentFragment(), buf = "";
    function flush() { if (buf) { f.appendChild(document.createTextNode(buf)); buf = ""; } }
    for (var i = 0; i < text.length; i++) {
      var c = text[i], z = ZY[c];
      if (z) { flush(); var r = document.createElement("ruby"); r.className = "ka-zy"; r.appendChild(document.createTextNode(c)); var rt = document.createElement("rt"); rt.textContent = z; r.appendChild(rt); f.appendChild(r); }
      else buf += c;
    }
    flush(); return f;
  }
  function english(el) {
    if (!el || el.nodeType !== 1 || el.querySelector(":scope > .ka-en")) return;
    var t = (el.getAttribute("data-zh") || el.textContent || "").replace(/\s+/g, "").trim();
    var e = EN[t];
    if (!e) for (var k = 0; k < RX.length; k++) { var m = t.match(RX[k][0]); if (m) { e = RX[k][1].replace(/\$(\d)/g, function (_, n) { return m[n]; }); break; } }
    if (!e) return;
    var s = document.createElement("span"); s.className = "ka-en"; s.textContent = e; el.appendChild(s);
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (CJK.test(root.nodeValue) && !skip(root.parentNode)) { var p = root.parentNode; english(p); p.replaceChild(ruby(root.nodeValue), root); } return; }
    if (root.nodeType !== 1 || skip(root)) return;
    var list = [], tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    for (var n; (n = tw.nextNode());) if (CJK.test(n.nodeValue) && !skip(n.parentNode)) list.push(n);
    var parents = [];
    list.forEach(function (t) { if (parents.indexOf(t.parentNode) < 0) parents.push(t.parentNode); });
    parents.forEach(english);
    list.forEach(function (t) { if (t.parentNode) t.parentNode.replaceChild(ruby(t.nodeValue), t); });
  }
  var KAbi = {
    init: function (o) {
      try {
        ZY = o.zy || {}; EN = {};
        Object.keys(o.en || {}).forEach(function (k) { EN[k.replace(/\s+/g, "")] = o.en[k]; });
        RX = (o.rx || []).map(function (p) { return [new RegExp(p[0]), p[1]]; });
        var css = document.createElement("style");
        css.textContent = "ruby.ka-zy{ruby-position:over;ruby-align:center}ruby.ka-zy rt{font-size:.45em;font-weight:500;letter-spacing:0;line-height:1;opacity:.85;font-family:system-ui,sans-serif}" +
          ".ka-en{display:block;font-size:.62em;font-weight:600;opacity:.75;line-height:1.2;margin-top:2px;font-family:system-ui,sans-serif;letter-spacing:0}" + (o.css || "");
        document.head.appendChild(css);
        var go = function () {
          walk(document.body);
          new MutationObserver(function (ms) {
            if (busy) return; busy = true;
            try { ms.forEach(function (m) { if (m.type === "characterData") walk(m.target); else m.addedNodes.forEach(walk); }); } catch (e) {}
            busy = false;
          }).observe(document.body, { childList: true, subtree: true, characterData: true });
        };
        if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
      } catch (e) {}
    }
  };
  window.KAbi = KAbi;
})();
