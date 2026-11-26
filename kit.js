/* Kids Arcade shared kit — the parts every game used to copy in.
   Load from a game:  <script src="../../kit.js"></script>  (../../../kit.js from games/lab/<name>/)
   Everything is wrapped in try/catch so it can never break a game.

   KAKit.store(key, defaults)        -> object saved in localStorage; call .save() after changes
   KAKit.kidData(db, kid)            -> {stars, seen:[], settings:{}} for that kid inside db
   KAKit.pickUnseen(bank, seen, n)   -> n items from bank whose .id is not in seen (Nora's no-repeat rule)
   KAKit.score(tryNo)                -> 2 on first try, 1 on second, 0 after (two tries, then reveal)
   KAKit.resetGate({kids, onReset})  -> grown-ups-only reset: 3-digit × 2-digit question, then tick kids
   KAKit.sfx(name)                   -> "ding" | "buzz" | "pop" | "win" | "tap"  (Web Audio, no files)
   KAKit.muted(true/false)           -> mute or unmute all kit sounds (remembered per device)
   KAKit.ac()                        -> shared AudioContext (created on first tap)
   Version badge: put <div id="kaVer" data-v="1.0" data-d="YYYY-MM-DD">v1.0 · YYYY-MM-DD</div> in the page;
   the kit styles it and hides it after the first tap. */
(function () {
  "use strict";
  function safe(fn) { return function () { try { return fn.apply(this, arguments); } catch (e) { return undefined; } }; }
  var K = {};

  K.store = safe(function (key, defaults) {
    var db = {};
    try { db = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) {}
    for (var k in defaults) if (!(k in db)) db[k] = JSON.parse(JSON.stringify(defaults[k]));
    Object.defineProperty(db, "save", { enumerable: false, value: function () { try { localStorage.setItem(key, JSON.stringify(db)); } catch (e) {} } });
    return db;
  });
  K.kidData = function (db, kid) {
    db.kids = db.kids || {};
    if (!db.kids[kid]) db.kids[kid] = { stars: 0, seen: [], settings: {} };
    return db.kids[kid];
  };
  K.pickUnseen = function (bank, seen, n) {
    var s = {}; (seen || []).forEach(function (id) { s[id] = 1; });
    function mix(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.random() * (i + 1) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    var fresh = mix(bank.filter(function (q) { return !s[q.id]; }));
    if (fresh.length < n) fresh = fresh.concat(mix(bank.filter(function (q) { return s[q.id]; }))); // bank ran out: unseen first
    return fresh.slice(0, n);
  };
  K.score = function (tryNo) { return tryNo === 1 ? 2 : tryNo === 2 ? 1 : 0; };

  /* ---------- sound ---------- */
  var ctx = null, MUTEKEY = "ka-kit-muted", isMuted = false;
  try { isMuted = localStorage.getItem(MUTEKEY) === "1"; } catch (e) {}
  K.ac = safe(function () {
    if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (C) ctx = new C(); }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  });
  K.muted = function (v) { if (v !== undefined) { isMuted = !!v; try { localStorage.setItem(MUTEKEY, isMuted ? "1" : "0"); } catch (e) {} } return isMuted; };
  function tone(f, t0, dur, type, vol) {
    var a = ctx, o = a.createOscillator(), g = a.createGain();
    o.type = type || "sine"; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  var SFX = {
    tap: [[660, 0, .06, "triangle", .12]],
    pop: [[520, 0, .08, "sine", .2], [780, .05, .08, "sine", .15]],
    ding: [[880, 0, .25, "sine", .22], [1320, .08, .3, "sine", .14]],
    buzz: [[180, 0, .22, "square", .08], [150, .1, .22, "square", .08]],
    win: [[523, 0, .18, "triangle", .2], [659, .12, .18, "triangle", .2], [784, .24, .18, "triangle", .2], [1047, .36, .4, "triangle", .22]]
  };
  K.sfx = safe(function (name) {
    if (isMuted || !K.ac() || !SFX[name]) return;
    var t = ctx.currentTime + 0.01;
    SFX[name].forEach(function (n) { tone(n[0], t + n[1], n[2], n[3], n[4]); });
  });
  addEventListener("pointerdown", function () { K.ac(); }, { once: true, capture: true });

  /* ---------- grown-ups-only reset ---------- */
  var CSS = ".kk-m{position:fixed;inset:0;background:#0008;display:flex;align-items:center;justify-content:center;z-index:2147482000;font:16px system-ui,sans-serif}" +
    ".kk-p{background:#fff;color:#222;border-radius:18px;padding:20px;width:min(92vw,360px);text-align:center;box-shadow:0 10px 40px #0005}" +
    ".kk-p h2{margin:0 0 8px}.kk-q{font-size:26px;font-weight:800;margin:8px}.kk-e{color:#e03131;font-weight:700}" +
    ".kk-p input[type=number]{font-size:22px;width:70%;padding:8px;border-radius:10px;border:2px solid #ccc;text-align:center}" +
    ".kk-r{display:flex;gap:10px;justify-content:center;margin-top:14px}.kk-r button{min-height:48px;min-width:96px;border:0;border-radius:12px;font-weight:800;font-size:16px}" +
    ".kk-c{background:#e9ecef}.kk-ok{background:#1c7ed6;color:#fff}.kk-x{background:#e03131;color:#fff}" +
    ".kk-k{display:flex;align-items:center;gap:10px;justify-content:center;font-size:20px;margin:6px;min-height:48px}.kk-k input{width:26px;height:26px}" +
    "#kaVer{position:fixed;left:8px;bottom:6px;z-index:2147483000;pointer-events:none;font:700 12px/1.2 system-ui,sans-serif;color:#000;opacity:.7;background:#fffc;padding:3px 8px;border-radius:999px}";
  var NAMES = { nora: "Nora", lucas: "Lucas", milo: "Milo" };
  function addCss() { if (document.getElementById("kk-css")) return; var s = document.createElement("style"); s.id = "kk-css"; s.textContent = CSS; document.head.appendChild(s); }
  K.resetGate = safe(function (opt) {
    opt = opt || {}; addCss();
    var kids = opt.kids || ["nora", "lucas", "milo"];
    var m = document.createElement("div"); m.className = "kk-m";
    var p = document.createElement("div"); p.className = "kk-p"; m.appendChild(p); document.body.appendChild(m);
    var close = function () { m.remove(); };
    function ask(msg) {
      var a = 100 + Math.random() * 900 | 0, b = 10 + Math.random() * 90 | 0;
      p.innerHTML = "<h2>Grown-ups only 大人專用</h2><div class='kk-q'>" + a + " × " + b + " = ?</div>" +
        (msg ? "<div class='kk-e'>" + msg + "</div>" : "") +
        "<input type='number' inputmode='numeric'><div class='kk-r'><button class='kk-c'>Cancel 取消</button><button class='kk-ok'>OK</button></div>";
      var inp = p.querySelector("input"); inp.focus();
      p.querySelector(".kk-c").onclick = close;
      p.querySelector(".kk-ok").onclick = function () { if (+inp.value === a * b) pick(); else ask("Not right — here's a new one. 再試一題"); };
      K._gateAnswer = a * b; // for automated playtests
    }
    function pick() {
      p.innerHTML = "<h2>Reset records 清除紀錄</h2><div>Clears stars, seen questions and settings on this device.</div>" +
        kids.map(function (k) { return "<label class='kk-k'><input type='checkbox' value='" + k + "'>" + (NAMES[k] || k) + "</label>"; }).join("") +
        "<div class='kk-r'><button class='kk-c'>Cancel 取消</button><button class='kk-x'>Reset 清除</button></div>";
      p.querySelector(".kk-c").onclick = close;
      p.querySelector(".kk-x").onclick = function () {
        var picked = [].map.call(p.querySelectorAll("input:checked"), function (i) { return i.value; });
        close(); if (picked.length && opt.onReset) opt.onReset(picked);
      };
    }
    ask();
  });

  /* ---------- version badge ---------- */
  safe(function () {
    addCss();
    function go() { var e = document.getElementById("kaVer"); setTimeout(function () { if (e) e.style.display = "none"; }, 400); removeEventListener("pointerdown", go, true); }
    addEventListener("pointerdown", go, true);
  })();

  window.KAKit = K;
})();
