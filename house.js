/* Kids Arcade house rules, shared by games that did not have them built in:
   - "Reset records" behind a parent math gate (3-digit × 2-digit), then the parent ticks which kids to reset.
   - A break screen after 3 missions in a row (counted per kid), with only "Finish for now".
   Usage: <script src="../../house.js"></script>
          <script>KAH.init({kids:["nora","lucas"], keys:["^game-{kid}-"], resultText:/VICTORY!/, wrap:["end"]})</script>
   keys: regex strings for localStorage keys to clear; {kid} is replaced by the kid's id. Kid "all" means the whole device.
   Every call is wrapped in try/catch so it can never break a game. */
(function () {
  "use strict";
  var NAMES = { nora: ["Nora", "幼晴", "#7048e8"], lucas: ["Lucas", "陸晨", "#f76707"], milo: ["Milo", "洛明", "#2f9e44"], all: ["Everyone on this device", "這台裝置全部", "#495057"] };
  var GAP_MS = 45 * 60 * 1000, PER_ROW = 3;
  var cfg = {}, lastCount = 0;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function kidNow() { try { return sessionStorage.getItem("ka-kid") || (cfg.kids && cfg.kids.length === 1 ? cfg.kids[0] : "any"); } catch (e) { return "any"; } }
  function root() { var s = document.querySelector('script[src*="house.js"]'); return s ? new URL(".", s.src).href : "../../"; }
  function css() {
    var st = document.createElement("style");
    st.textContent =
      ".kah-ov{position:fixed;inset:0;z-index:2147483646;background:rgba(20,20,40,.72);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif}" +
      ".kah-box{background:#fff;color:#1b1f3b;border-radius:22px;border:4px solid #1b1f3b;max-width:420px;width:100%;padding:22px;text-align:center;box-shadow:0 8px 0 #1b1f3b;max-height:calc(100vh - 32px);overflow:auto}" +
      ".kah-box h2{margin:4px 0 8px;font-size:24px}.kah-box p{margin:6px 0;font-size:17px}.kah-box small{display:block;opacity:.7;font-size:14px}" +
      ".kah-btn{min-height:52px;min-width:140px;margin:8px 4px 0;padding:8px 18px;border-radius:14px;border:3px solid #1b1f3b;background:#ffd43b;color:#1b1f3b;font:800 18px system-ui,sans-serif;cursor:pointer}" +
      ".kah-btn.ghost{background:#fff}.kah-in{font:800 26px system-ui;width:150px;min-height:52px;text-align:center;border:3px solid #1b1f3b;border-radius:12px;margin:8px 0}" +
      ".kah-kid{display:flex;align-items:center;gap:10px;min-height:52px;margin:6px 0;padding:6px 12px;border:3px solid;border-radius:14px;font-weight:800;font-size:18px;text-align:left}.kah-kid input{width:26px;height:26px}" +
      "#kahReset{position:fixed;left:50%;transform:translateX(-50%);bottom:6px;z-index:2147483000;min-height:44px;padding:6px 12px;border-radius:999px;border:2px solid #868e96;background:#fffc;color:#495057;font:700 13px system-ui,sans-serif}" +
      ".kah-big{font-size:64px;line-height:1}";
    document.head.appendChild(st);
  }
  function ov(html) { var o = document.createElement("div"); o.className = "kah-ov"; o.innerHTML = '<div class="kah-box" role="dialog" aria-modal="true">' + html + "</div>"; document.body.appendChild(o); return o; }

  /* ---------- parent gate + reset ---------- */
  function gate() {
    var a = 100 + Math.floor(Math.random() * 900), b = 10 + Math.floor(Math.random() * 90);
    var o = ov('<h2>🔒 家長 · Grown-ups</h2><p>' + a + " × " + b + ' = ?</p><input class="kah-in" inputmode="numeric" aria-label="Answer"><p class="kah-err" style="color:#c92a2a;min-height:1.2em"></p>' +
      '<button class="kah-btn ghost" data-x>取消 · Cancel</button><button class="kah-btn" data-ok>OK</button>');
    var inp = o.querySelector("input"); setTimeout(function () { try { inp.focus(); } catch (e) {} }, 50);
    o.querySelector("[data-x]").onclick = function () { o.remove(); };
    function ok() {
      if (+inp.value.trim() === a * b) { o.remove(); pick(); }
      else { o.remove(); gate(); setTimeout(function () { var e = document.querySelector(".kah-err"); if (e) e.textContent = "再試一題 · Try this one"; }, 0); }
    }
    o.querySelector("[data-ok]").onclick = ok;
    inp.onkeydown = function (e) { if (e.key === "Enter") ok(); };
  }
  function pick() {
    var kids = cfg.kids || ["all"];
    var rows = kids.map(function (k) { var n = NAMES[k] || [k, k, "#495057"]; return '<label class="kah-kid" style="border-color:' + n[2] + '"><input type="checkbox" value="' + k + '">' + n[0] + " · " + n[1] + "</label>"; }).join("");
    var o = ov("<h2>Reset records · 清除紀錄</h2><small>Clears stars, seen questions and settings for the ticked kids, on this device only.</small>" + rows +
      '<button class="kah-btn ghost" data-x>取消 · Cancel</button><button class="kah-btn" data-ok style="background:#ff8787">Reset</button>');
    o.querySelector("[data-x]").onclick = function () { o.remove(); };
    o.querySelector("[data-ok]").onclick = function () {
      var picked = [].slice.call(o.querySelectorAll("input:checked")).map(function (i) { return i.value; });
      if (!picked.length) { o.remove(); return; }
      var keys = []; try { for (var i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i)); } catch (e) {}
      picked.forEach(function (kid) {
        (cfg.keys || []).forEach(function (p) {
          var rx = new RegExp(p.replace(/\{kid\}/g, kid));
          keys.forEach(function (k) { if (k && rx.test(k)) ls(k, null); });
        });
        ls("ka-missions:" + kid, null);
        if (cfg.onReset) try { cfg.onReset(kid); } catch (e) {}
      });
      o.remove(); location.reload();
    };
  }
  function resetButton() {
    if (!cfg.keys) return;
    var b = document.createElement("button"); b.id = "kahReset"; b.type = "button"; b.textContent = "🔒 Reset records";
    b.onclick = function (e) { e.stopPropagation(); gate(); };
    document.body.appendChild(b);
    // start screen only: it goes away once the game starts
    function hide(e) { if (e.target === b || (e.target.closest && e.target.closest(".kah-ov"))) return; b.remove(); document.removeEventListener("pointerdown", hide, true); }
    setTimeout(function () { document.addEventListener("pointerdown", hide, true); }, 300);
  }

  /* ---------- 3 missions, then a break ---------- */
  function missionDone() {
    try {
      var now = Date.now(); if (now - lastCount < 3000) return; lastCount = now;
      var kid = kidNow(), key = "ka-missions:" + kid, d = {};
      try { d = JSON.parse(ls(key) || "{}"); } catch (e) {}
      var n = (d.t && now - d.t < GAP_MS) ? (d.n || 0) + 1 : 1;
      ls(key, JSON.stringify({ n: n >= PER_ROW ? 0 : n, t: now }));
      if (n >= PER_ROW) setTimeout(breakScreen, cfg.breakDelay || 2500);
    } catch (e) {}
  }
  function breakScreen() {
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    var o = ov('<div class="kah-big">🌟</div><h2>Great practice! Time for a break</h2><p>練習得很棒！休息一下吧</p><small>Drink some water, stretch, or go play outside. · 喝口水、伸伸懶腰。</small>' +
      '<button class="kah-btn" data-f>Finish for now · 先到這裡</button>');
    o.querySelector("[data-f]").onclick = function () { location.href = root(); };
  }
  function watchText(rx) {
    var mo = new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) for (var j = 0; j < ms[i].addedNodes.length; j++) {
        var n = ms[i].addedNodes[j], t = n.nodeType === 3 ? n.nodeValue : (n.textContent || "");
        if (t && rx.test(t)) { missionDone(); return; }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  function wrap(name, test) {
    var f = window[name]; if (typeof f !== "function") return;
    window[name] = function () {
      var args = arguments, r = f.apply(this, args);
      var done = function (v) { try { if (!test || test(args, v)) missionDone(); } catch (e) {} return v; };
      return (r && typeof r.then === "function") ? r.then(done) : done(r);
    };
  }

  window.KAH = {
    missionDone: missionDone,
    init: function (o) {
      try {
        cfg = o || {};
        var go = function () {
          css(); resetButton();
          if (cfg.resultText) watchText(cfg.resultText);
          (cfg.wrap || []).forEach(function (w) { typeof w === "string" ? wrap(w) : wrap(w[0], w[1]); });
        };
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
      } catch (e) {}
    }
  };
})();
