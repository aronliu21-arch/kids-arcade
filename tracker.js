/* Kids Arcade progress tracker.
   Records active play time and right/wrong answers, queues them on this device,
   and sends them to the family's Google Sheet (Apps Script web app) for the weekly email.
   Games call:  KA.answer({q, given, expected, correct, tryNo, qid, topic})
   Optional:    KA.setKid("nora")  when a game has its own player picker.
   Free-play games: KA.progress({where: "Year 2 · Ch 3", pct: 42, detail: "12/30 missions"}) — sent only when it changes.
   Nothing here can break a game: every call is wrapped in try/catch. */
(function () {
  "use strict";
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbwrTV9-YyjNl4MhkiAaOho-kIm30yp65u2ea_cO44sm8pr1_bEqYYzsSf6FSqs3O5z6/exec";
  var TOKEN = "ka-liu-2026";
  var QKEY = "ka-queue-v1", KIDKEY = "ka-kid", MAXQ = 3000;
  var IDLE_MS = 120000, TICK_MS = 5000, SEND_EVERY_MS = 60000;
  var KIDS = { nora: 1, lucas: 1, milo: 1, tester: 1 };

  function safe(fn) { return function () { try { return fn.apply(this, arguments); } catch (e) { return undefined; } }; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function sstore(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  var scriptTag = document.currentScript;
  // offline play: make sure the arcade's service worker is installed even if a game is opened directly
  safe(function () { if (scriptTag && "serviceWorker" in navigator) { var root = new URL(".", scriptTag.src).href; navigator.serviceWorker.register(root + "sw.js", { scope: root }).catch(function () {}); } })();
  var game = (scriptTag && scriptTag.getAttribute("data-game")) ||
    (location.pathname.replace(/\/index\.html?$/, "").replace(/\/$/, "").split("/").pop() || "unknown");

  var kid = null;
  safe(function () {
    var p = new URLSearchParams(location.search).get("kid");
    if (p && KIDS[p.toLowerCase()]) { kid = p.toLowerCase(); sstore(KIDKEY, kid); }
    else { var s = sstore(KIDKEY); if (s && KIDS[s]) kid = s; }
  })();

  var ua = navigator.userAgent || "";
  var device = /iPhone/.test(ua) ? "iPhone" :
    (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) ? "iPad" :
    /Macintosh/.test(ua) ? "Mac" : /Android/.test(ua) ? "Android" : "Other";
  var session = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  var seq = 0;

  function localParts(d) {
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return { date: d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()), hour: d.getHours() };
  }
  function base(type) {
    var d = new Date(), lp = localParts(d);
    return { id: session + "-" + (++seq), type: type, ts: d.toISOString(), ldate: lp.date, lhour: lp.hour,
      tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || ""), kid: kid || "unknown", game: game,
      device: device, session: session };
  }
  function readQ() { try { var a = JSON.parse(store(QKEY) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function writeQ(a) { if (a.length > MAXQ) a = a.slice(a.length - MAXQ); store(QKEY, JSON.stringify(a)); }
  var push = safe(function (row) {
    if (kid === "tester") return; // the parent's test profile is never recorded
    var q = readQ(); q.push(row); writeQ(q);
  });

  var sending = false;
  var flush = safe(function (beacon) {
    if (!ENDPOINT || sending) return;
    var q = readQ(); if (!q.length) return;
    var batch = q.slice(0, 200), body = JSON.stringify({ token: TOKEN, rows: batch });
    var ids = {}; batch.forEach(function (r) { ids[r.id] = 1; });
    var drop = function () { writeQ(readQ().filter(function (r) { return !ids[r.id]; })); };
    if (beacon && navigator.sendBeacon) {
      if (navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain;charset=utf-8" }))) drop();
      return;
    }
    if (!navigator.onLine && navigator.onLine !== undefined) return;
    sending = true;
    fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: body, keepalive: body.length < 60000 })
      .then(function () { drop(); sending = false; if (q.length > batch.length) setTimeout(flush, 500); })
      .catch(function () { sending = false; });
  });

  /* ---- active play time ---- */
  var lastInput = Date.now(), lastTick = Date.now(), pendingSecs = 0, lastSent = Date.now();
  function visible() { return document.visibilityState !== "hidden"; }
  var tick = safe(function () {
    var now = Date.now(), dt = now - lastTick; lastTick = now;
    if (dt > TICK_MS * 3) dt = TICK_MS; // the device slept: don't count the gap
    if (visible() && now - lastInput < IDLE_MS) pendingSecs += dt / 1000;
    if (now - lastSent >= SEND_EVERY_MS) emitTime();
  });
  var emitTime = safe(function () {
    lastSent = Date.now();
    var s = Math.round(pendingSecs); if (s < 1) return;
    pendingSecs -= s;
    var r = base("time"); r.secs = s; push(r); flush();
  });
  var poke = function () { var now = Date.now(); if (now - lastInput >= IDLE_MS) lastTick = now; lastInput = now; };
  ["pointerdown", "keydown", "touchstart", "wheel"].forEach(function (ev) {
    try { window.addEventListener(ev, poke, { capture: true, passive: true }); } catch (e) {}
  });
  document.addEventListener("visibilitychange", safe(function () {
    if (visible()) { lastTick = Date.now(); lastInput = Date.now(); }
    else { tick(); emitTime(); flush(true); }
  }));
  window.addEventListener("pagehide", safe(function () { tick(); emitTime(); flush(true); }));
  window.addEventListener("online", function () { flush(); });
  setInterval(tick, TICK_MS);

  /* ---- weekly-goal tally kept on this device (the arcade menu reads it) ---- */
  var TKEY = "ka-tally-v1";
  var tally = safe(function (r) {
    if (kid === "tester" || !kid) return;
    var t = {}; try { t = JSON.parse(store(TKEY) || "{}") || {}; } catch (e) {}
    var d = t[r.ldate] || (t[r.ldate] = {}), k = d[kid] || (d[kid] = {});
    k[game] = (k[game] || 0) + 1;
    var keys = Object.keys(t).sort(); while (keys.length > 60) delete t[keys.shift()];
    store(TKEY, JSON.stringify(t));
  });

  /* ---- answers ---- */
  var lastAnswerAt = Date.now(), lastShownAt = 0, lastSig = "";
  function clip(v) { if (v === undefined || v === null) return ""; v = String(v); return v.length > 160 ? v.slice(0, 157) + "…" : v; }
  window.KA = {
    game: game,
    get kid() { return kid; },
    setKid: safe(function (k) { if (kid === "tester") return; /* opened from the Tester page: picking a kid inside the game must not record as that kid */ k = String(k || "").toLowerCase(); if (KIDS[k]) { kid = k; sstore(KIDKEY, k); } }),
    shown: safe(function () { lastShownAt = Date.now(); }),
    answer: safe(function (o) {
      o = o || {};
      var now = Date.now(), from = lastShownAt > lastAnswerAt ? lastShownAt : lastAnswerAt;
      var sig = [o.qid || o.q, o.given, !!o.correct].join("\u0001");
      if (sig === lastSig && now - lastAnswerAt < 1500) return; // same tap reported twice
      lastSig = sig;
      var r = base("answer");
      r.q = clip(o.q); r.qid = clip(o.qid || o.q); r.given = clip(o.given); r.expected = clip(o.expected);
      r.correct = !!o.correct; r.tryNo = o.tryNo || 1; r.topic = clip(o.topic);
      r.ms = Math.max(0, Math.min(600000, now - from));
      lastAnswerAt = now; poke();
      push(r);
      if (r.correct && r.tryNo === 1) tally(r);
      if (readQ().length >= 20) flush();
    }),
    progress: safe(function (o) {
      o = o || {}; if (kid === "tester" || !kid) return;
      var pct = Math.max(0, Math.min(100, Math.round(Number(o.pct) || 0))), where = clip(o.where), detail = clip(o.detail);
      var lk = "ka-prog-last", last = {}; try { last = JSON.parse(store(lk) || "{}") || {}; } catch (e) {}
      var sig = where + "|" + pct + "|" + detail, k = kid + "|" + game;
      if (last[k] === sig) return;
      last[k] = sig; store(lk, JSON.stringify(last));
      var r = base("progress"); r.where = where; r.pct = pct; r.detail = detail; push(r); flush();
    }),
    flush: function () { flush(); },
    _queue: readQ
  };
  setTimeout(function () { flush(); }, 3000);
})();
