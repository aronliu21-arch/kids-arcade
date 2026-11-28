/**
 * Kids Arcade — progress collector + weekly email report.
 *
 * One-time setup (about 5 minutes):
 *   1. Go to https://script.google.com → New project. Delete what's there and paste this whole file.
 *   2. At the top, choose the function "setup" and press Run. Allow the permissions Google asks for.
 *      This creates the "Kids Arcade Progress" Google Sheet and the Sunday 7 PM email.
 *   3. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone → Deploy.
 *   4. Copy the Web app URL (ends in /exec) and send it to Claude.
 * To get a report right away: choose "sendTestReport" and press Run.
 */

var CONFIG = {
  email: "aronliu21@gmail.com",
  token: "ka-liu-2026",
  timeZone: "America/Los_Angeles",
  kids: ["nora", "lucas", "milo"],
  lateHour: 20,          // play at or after 8 PM is flagged
  fastMs: 2000,          // an answer quicker than this counts as a fast guess
  dailyLimitMin: 0       // 0 = no daily limit flag
};

/* Weekly goals. Week 1 = Sat Nov 28 – Sun Dec 6 2026, then Monday–Sunday weeks.
   Keep in step with goals.js in the arcade (what the kids see on the menu).
   type "rounds":  a round counts when all its questions were answered and it scored at least `min` stars
                   (2 points for a first-try answer, 1 for a second try; 3★ at 85%+, 2★ at 60%+).
   type "correct": answers right on the first try in any of `games`.
   Rebuilt from the raw answers, so it doesn't trust what the iPad says. */
var GOALS = {
  nora: [
    { type: "rounds", game: "calendar-quest", topic: "What Time Is It?", label: "時間專家 · What Time Is It?", n: 4, min: 2 },
    { type: "correct", games: ["times-tables", "times-challenge"], label: "Times Tables", n: 40 },
    { type: "correct", games: ["spelling-bees"], label: "Spelling Bees", n: 20 },
    { type: "correct", games: ["kanga-hop"], label: "Kanga Hop", n: 10 }
  ],
  lucas: [
    { type: "rounds", game: "calendar-quest", topic: "What Time Is It?", label: "時間專家 · What Time Is It?", n: 3, min: 2 },
    { type: "correct", games: ["spelling-bees"], label: "Spelling Bees", n: 15 },
    { type: "correct", games: ["zhuyin"], label: "注音拼拼看 Zhuyin", n: 15 }
  ]
};

var KID_INFO = {
  nora: { name: "Nora", color: "#7048e8" },
  lucas: { name: "Lucas", color: "#f76707" },
  milo: { name: "Milo", color: "#2f9e44" }
};

var GAME_NAMES = {
  "spelling-bees": "Spelling Bees", "pitch-smarts": "Pitch Smarts", "question-beasts": "Question Beasts",
  "times-tables": "Times Table Pixel Quest", "sports-stars": "Lucas's Sports Stars", "magic-academy": "Nora's Magic Academy",
  "dragon-heart": "Dragon Heart Quest", "dino-journey": "Milo's Dino Journey", "calendar-quest": "時間專家 Time Expert",
  "game-room": "Game Room", "family-zoo": "Family Zoo", "zhuyin": "Zhuyin Spell-It", "lumi-quest": "Lumi Quest",
  "math-quest": "Math Quest", "drawing-game-": "Doodle Dash", "doodle-dash": "Doodle Dash", "critter-grove": "Critter Grove",
  "dragon-heart-en": "Dragon Heart Quest · English", "kanga-hop": "Kanga Hop", "times-challenge": "Times Table Challenge",
  "cursive-quest": "Nora's Cursive Quest", "wand-art": "Wand Academy (Nora)", "lucas-wand": "Wand Academy (Lucas)", "dino-world": "Milo's Dino World", "life-skills": "Life Skills Club", "runway-sketch": "Runway Sketchbook"
};

var ANSWER_COLS = ["id", "ts", "ldate", "lhour", "kid", "game", "device", "session", "q", "qid", "given", "expected", "correct", "tryNo", "topic", "ms"];
var TIME_COLS = ["id", "ts", "ldate", "lhour", "kid", "game", "device", "session", "secs"];
var PROG_COLS = ["id", "ts", "ldate", "lhour", "kid", "game", "device", "session", "where", "pct", "detail"];

/* ---------------- setup ---------------- */

function setup() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("SHEET_ID");
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create("Kids Arcade Progress");
  props.setProperty("SHEET_ID", ss.getId());
  ss.setSpreadsheetTimeZone(CONFIG.timeZone);
  ensureSheet_(ss, "Answers", ANSWER_COLS);
  ensureSheet_(ss, "Time", TIME_COLS);
  ensureSheet_(ss, "Progress", PROG_COLS);
  var first = ss.getSheetByName("Sheet1");
  if (first && ss.getSheets().length > 1) ss.deleteSheet(first);

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "sendWeeklyReport") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("sendWeeklyReport").timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(19).inTimezone(CONFIG.timeZone).create();
  Logger.log("Ready. Progress sheet: " + ss.getUrl());
}

function ensureSheet_(ss, name, cols) {
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) { sh.appendRow(cols); sh.setFrozenRows(1); }
  return sh;
}

function sheet_() {
  var id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!id) throw new Error("Run setup first.");
  return SpreadsheetApp.openById(id);
}

/* ---------------- collecting rows from the games ---------------- */

/* The Baba dashboard (arcade front page) asks for its data here: ?view=dash&pin=…&days=90
   The PIN is checked here, so it is not written in the public arcade code. */
var DASH_PIN = "1234";
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.view !== "dash") return ContentService.createTextOutput("Kids Arcade tracker is running.");
  var out;
  if (String(p.pin || "") !== DASH_PIN) out = { ok: false, error: "pin" };
  else {
    var days = Math.max(1, Math.min(180, Number(p.days) || 90)), now = new Date();
    var from = ymd_(new Date(now.getTime() - days * 864e5)), ss = sheet_();
    var pick = function (rows, cols) { return rows.filter(function (r) { return r.kid !== "tester" && String(r.ldate) >= from; })
      .map(function (r) { return cols.map(function (c) { return r[c]; }); }); };
    var ans = readTable_(ss.getSheetByName("Answers")), tm = readTable_(ss.getSheetByName("Time"));
    out = { ok: true, now: now.toISOString(), from: from, games: GAME_NAMES, goals: weeklyGoals_(ans, now),
      aCols: ["ldate", "lhour", "kid", "game", "session", "correct", "tryNo", "topic", "ms", "q", "expected", "given", "ts", "device"],
      tCols: ["ldate", "lhour", "kid", "game", "session", "secs", "device"] };
    out.a = pick(ans, out.aCols); out.t = pick(tm, out.tCols);
    var pr = ss.getSheetByName("Progress"); out.pCols = ["ldate", "lhour", "kid", "game", "where", "pct", "detail", "ts", "device"];
    out.p = pr ? readTable_(pr).filter(function (r) { return r.kid !== "tester"; }).map(function (r) { return out.pCols.map(function (c) { return r[c]; }); }) : [];
  }
  var txt = JSON.stringify(out);
  if (p.callback && /^[A-Za-z_$][\w$]*$/.test(p.callback))
    return ContentService.createTextOutput(p.callback + "(" + txt + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(txt).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return ContentService.createTextOutput("bad json"); }
  if (!body || body.token !== CONFIG.token || !Array.isArray(body.rows)) return ContentService.createTextOutput("no");
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var cache = CacheService.getScriptCache();
    var ids = body.rows.map(function (r) { return "r" + String(r.id || "").slice(0, 200); });
    var seen = cache.getAll(ids) || {};
    var ss = sheet_(), answers = [], times = [], progs = [], fresh = {};
    body.rows.slice(0, 500).forEach(function (r, i) {
      if (!r || !r.id || seen[ids[i]] || fresh[ids[i]]) return;
      if (r.kid === "tester") return;
      fresh[ids[i]] = "1";
      if (r.type === "answer") answers.push(ANSWER_COLS.map(function (c) { return clean_(r[c]); }));
      else if (r.type === "time") times.push(TIME_COLS.map(function (c) { return clean_(r[c]); }));
      else if (r.type === "progress") progs.push(PROG_COLS.map(function (c) { return clean_(r[c]); }));
    });
    if (answers.length) appendRows_(ss.getSheetByName("Answers"), answers);
    if (times.length) appendRows_(ss.getSheetByName("Time"), times);
    if (progs.length) appendRows_(ensureSheet_(ss, "Progress", PROG_COLS), progs);
    if (Object.keys(fresh).length) cache.putAll(fresh, 21600);
  } finally { lock.releaseLock(); }
  return ContentService.createTextOutput("ok");
}

function clean_(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") { v = v.slice(0, 300); if (/^[=+\-@]/.test(v)) v = "'" + v; }
  return v;
}
function appendRows_(sh, rows) {
  var r = sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length);
  r.setNumberFormat("@"); // keep everything as typed: "1/2" stays a fraction, dates stay text
  r.setValues(rows.map(function (row) { return row.map(function (v) { return typeof v === "boolean" ? (v ? "true" : "false") : String(v); }); }));
}

/* ---------------- weekly report ---------------- */

function sendWeeklyReport() { sendReport_(new Date(), false); }
function sendTestReport() { sendReport_(new Date(), true); }

function sendReport_(now, isTest) {
  var ss = sheet_();
  var data = {
    answers: readTable_(ss.getSheetByName("Answers")),
    time: readTable_(ss.getSheetByName("Time"))
  };
  var report = buildReport(data, now);
  report.goals = weeklyGoals_(data.answers, now);
  var pr = ss.getSheetByName("Progress");
  report.prog = freePlay_(pr ? readTable_(pr) : [], data.time, now);
  var subject = (isTest ? "[Test] " : "") + "Kids Arcade weekly report · " + report.rangeLabel;
  MailApp.sendEmail({ to: CONFIG.email, subject: subject, htmlBody: renderHtml(report, ss.getUrl()), name: "Kids Arcade" });
}

function readTable_(sh) {
  var v = sh.getDataRange().getValues(), head = v.shift();
  return v.map(function (row) { var o = {}; head.forEach(function (h, i) { o[h] = row[i]; }); return o; });
}

/* Pure logic below: no Google services, so it can be tested anywhere. */

function buildReport(data, now) {
  var end = now.getTime(), start = end - 7 * 864e5, prevStart = start - 7 * 864e5;
  function t(r) { return new Date(r.ts).getTime(); }
  function inWeek(r) { var x = t(r); return x >= start && x < end; }
  function inPrev(r) { var x = t(r); return x >= prevStart && x < start; }
  function isTrue(v) { return v === true || v === "TRUE" || v === "true"; }

  var days = [];
  for (var i = 6; i >= 0; i--) {
    var d = new Date(end - i * 864e5);
    days.push({ key: ymd_(d), label: "SMTWTFS".charAt(d.getDay()), full: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] });
  }

  var kids = CONFIG.kids.map(function (k) {
    var ans = data.answers.filter(function (r) { return r.kid === k && inWeek(r); });
    var tm = data.time.filter(function (r) { return r.kid === k && inWeek(r); });
    var prevSecs = sum_(data.time.filter(function (r) { return r.kid === k && inPrev(r); }), "secs");
    var secs = sum_(tm, "secs");

    var perDay = days.map(function (d) {
      return { label: d.label, full: d.full, min: Math.round(sum_(tm.filter(function (r) { return String(r.ldate) === d.key; }), "secs") / 60) };
    });

    var games = {};
    tm.forEach(function (r) { g_(games, r.game).secs += Number(r.secs) || 0; });
    ans.forEach(function (r) {
      var g = g_(games, r.game);
      if (Number(r.tryNo) === 1) { g.first++; if (isTrue(r.correct)) g.firstRight++; }
      g.answers++;
    });
    var gameList = Object.keys(games).map(function (k2) {
      var g = games[k2];
      return { name: GAME_NAMES[k2] || k2, min: Math.round(g.secs / 60), acc: g.first ? Math.round(100 * g.firstRight / g.first) : null, answers: g.answers };
    }).filter(function (g) { return g.min > 0 || g.answers > 0; })
      .sort(function (a, b) { return b.min - a.min || b.answers - a.answers; });

    var firsts = ans.filter(function (r) { return Number(r.tryNo) === 1; });
    var acc = firsts.length ? Math.round(100 * firsts.filter(function (r) { return isTrue(r.correct); }).length / firsts.length) : null;

    // most missed questions
    var miss = {};
    ans.forEach(function (r) {
      var key = r.game + "|" + r.qid, m = miss[key] || (miss[key] = { q: r.q, game: GAME_NAMES[r.game] || r.game, topic: r.topic, expected: "", wrong: 0, tries: 0, givens: [] });
      m.tries++;
      if (isTrue(r.correct)) { if (!m.expected) m.expected = String(r.given); }
      else { m.wrong++; if (r.expected) m.expected = String(r.expected); if (r.given !== "" && m.givens.indexOf(String(r.given)) < 0) m.givens.push(String(r.given)); }
    });
    var missed = Object.keys(miss).map(function (k2) { return miss[k2]; })
      .filter(function (m) { return m.wrong > 0; })
      .sort(function (a, b) { return b.wrong - a.wrong || b.tries - a.tries; }).slice(0, 3);

    // behaviors
    var flags = [];
    var fast = ans.filter(function (r) { return Number(r.ms) > 0 && Number(r.ms) < CONFIG.fastMs; });
    var fastWrong = fast.filter(function (r) { return !isTrue(r.correct); });
    if (fastWrong.length >= 5 && fastWrong.length >= fast.length * 0.4) {
      flags.push({ tag: "fast guessing", text: fast.length + " answers in under " + (CONFIG.fastMs / 1000) + " s, " + fastWrong.length + " of them wrong" + busiestDay_(fastWrong, days) });
    }
    var bySession = {};
    ans.forEach(function (r) { (bySession[r.session] = bySession[r.session] || []).push(r); });
    var quits = {};
    Object.keys(bySession).forEach(function (s) {
      var list = bySession[s].sort(function (a, b) { return t(a) - t(b); });
      var n = list.length;
      if (n >= 2 && !isTrue(list[n - 1].correct) && !isTrue(list[n - 2].correct)) {
        var name = GAME_NAMES[list[n - 1].game] || list[n - 1].game; quits[name] = (quits[name] || 0) + 1;
      }
    });
    Object.keys(quits).forEach(function (name) {
      if (quits[name] >= 2) flags.push({ tag: "quit mid-game", text: "Left " + name + " " + quits[name] + " times right after 2 misses in a row" });
    });
    var late = tm.concat(ans).filter(function (r) { return Number(r.lhour) >= CONFIG.lateHour; });
    if (late.length) {
      var lateDays = {}, latest = 0;
      late.forEach(function (r) { lateDays[dayName_(r.ldate)] = 1; latest = Math.max(latest, Number(r.lhour)); });
      flags.push({ tag: "late play", text: "Played after " + hour12_(CONFIG.lateHour) + " on " + Object.keys(lateDays).join(", ") + " (latest in the " + hour12_(latest) + " hour)" });
    }
    if (CONFIG.dailyLimitMin > 0) {
      var over = perDay.filter(function (d) { return d.min > CONFIG.dailyLimitMin; });
      if (over.length) flags.push({ tag: "over limit", text: "Over " + CONFIG.dailyLimitMin + " min on " + over.map(function (d) { return d.full; }).join(", ") });
    }

    var practice = missed.map(function (m) { return m.topic || shortQ_(m.q); }).filter(function (x, i, a) { return x && a.indexOf(x) === i; });

    return {
      kid: k, name: KID_INFO[k].name, color: KID_INFO[k].color,
      min: Math.round(secs / 60), deltaMin: Math.round((secs - prevSecs) / 60), hadPrev: prevSecs > 0,
      answers: ans.length, acc: acc, perDay: perDay, games: gameList, missed: missed, flags: flags, practice: practice
    };
  });

  var allAns = kids.reduce(function (n, k) { return n + k.answers; }, 0);
  var allFirst = data.answers.filter(function (r) { return inWeek(r) && Number(r.tryNo) === 1 && r.kid !== "tester"; });
  return {
    rangeLabel: md_(new Date(start)) + "–" + md_(new Date(end - 1)),
    totalMin: kids.reduce(function (n, k) { return n + k.min; }, 0),
    totalAnswers: allAns,
    totalAcc: allFirst.length ? Math.round(100 * allFirst.filter(function (r) { return isTrue(r.correct); }).length / allFirst.length) : null,
    kids: kids
  };
}

function g_(o, k) { return o[k] || (o[k] = { secs: 0, first: 0, firstRight: 0, answers: 0 }); }
function sum_(rows, f) { return rows.reduce(function (n, r) { return n + (Number(r[f]) || 0); }, 0); }
function pad_(n) { return (n < 10 ? "0" : "") + n; }
function ymd_(d) { return d.getFullYear() + "-" + pad_(d.getMonth() + 1) + "-" + pad_(d.getDate()); }
function md_(d) { return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()] + " " + d.getDate(); }
function dayName_(ldate) { var p = String(ldate).split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2]); return isNaN(d) ? String(ldate) : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]; }
function hour12_(h) { return (h % 12 || 12) + (h < 12 ? " AM" : " PM"); }
function hm_(min) { if (min < 60) return min + " min"; return Math.floor(min / 60) + " h " + pad_(min % 60) + " min"; }
function shortQ_(q) { q = String(q || ""); return q.length > 60 ? q.slice(0, 57) + "…" : q; }
function busiestDay_(rows, days) {
  var c = {}; rows.forEach(function (r) { c[r.ldate] = (c[r.ldate] || 0) + 1; });
  var best = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0];
  return best && c[best] >= rows.length * 0.5 ? ", mostly on " + dayName_(best) : "";
}
function esc_(s) { return String(s === undefined || s === null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }


/* ---------------- free-play progress (games that call KA.progress) ---------------- */
function freePlay_(prog, time, now) {
  var to = ymd_(now), from = ymd_(new Date(now.getTime() - 6 * 864e5)), by = {};
  prog.forEach(function (r) {
    if (r.kid === "tester") return;
    var d = String(r.ldate instanceof Date ? ymd_(r.ldate) : r.ldate).slice(0, 10), k = r.kid + "|" + r.game;
    var o = by[k] || (by[k] = { kid: r.kid, game: r.game, last: null, before: null });
    var t = String(r.ts);
    if (d <= to && (!o.last || t > o.last.t)) o.last = { t: t, d: d, where: r.where, pct: +r.pct || 0, detail: r.detail };
    if (d < from && (!o.before || t > o.before.t)) o.before = { t: t, pct: +r.pct || 0 };
  });
  return Object.keys(by).map(function (k) {
    var o = by[k], secs = time.filter(function (r) { var d = String(r.ldate instanceof Date ? ymd_(r.ldate) : r.ldate).slice(0, 10); return r.kid === o.kid && r.game === o.game && d >= from && d <= to; })
      .reduce(function (s, r) { return s + (+r.secs || 0); }, 0);
    return { kid: o.kid, game: GAME_NAMES[o.game] || o.game, where: o.last ? o.last.where : "", pct: o.last ? o.last.pct : 0,
      gain: o.last ? o.last.pct - (o.before ? o.before.pct : 0) : 0, detail: o.last ? o.last.detail : "", lastDay: o.last ? o.last.d : "", min: Math.round(secs / 60) };
  }).filter(function (x) { return x.where; });
}

/* ---------------- weekly goals ---------------- */
function goalWeek_(now) {
  var d = new Date(now.getFullYear(), now.getMonth(), now.getDate()), w2 = new Date(2026, 11, 7);
  if (d < w2) return { no: 1, from: "2026-11-28", to: "2026-12-06" };
  var k = Math.floor(Math.round((d - w2) / 864e5) / 7), f = new Date(2026, 11, 7 + 7 * k), t = new Date(2026, 11, 13 + 7 * k);
  return { no: 2 + k, from: ymd_(f), to: ymd_(t) };
}
function weeklyGoals_(answers, now) {
  var w = goalWeek_(now), out = [];
  var inW = function (r) { return r.ldate >= w.from && r.ldate <= w.to; };
  Object.keys(GOALS).forEach(function (kid) {
    GOALS[kid].forEach(function (g) {
      if (g.type === "correct") {
        var per = {}, done = 0;
        answers.forEach(function (r) {
          if (r.kid !== kid || g.games.indexOf(r.game) < 0 || !inW(r) || !isTrue_(r.correct) || Number(r.tryNo) !== 1) return;
          done++; per[r.ldate] = (per[r.ldate] || 0) + 1;
        });
        var det = Object.keys(per).sort().map(function (d) { return dayName_(d) + " " + per[d]; });
        out.push({ kid: kid, type: "correct", label: g.label, n: g.n, done: done, met: done >= g.n, detail: det });
        return;
      }
      out.push(roundsGoal_(kid, g, answers.filter(function (r) { return r.kid === kid && r.game === g.game && r.topic === g.topic && inW(r); })));
    });
  });
  return { week: w, list: out };
}
function roundsGoal_(kid, g, rows) {
  rows.sort(function (a, b) { return String(a.ts) < String(b.ts) ? -1 : 1; });
  var rounds = [], cur = null;
  rows.forEach(function (r) {
    var m = /^\[(\d+)\/(\d+)\]/.exec(String(r.q || "")); if (!m) return;
    var i = +m[1], n = +m[2];
    if (!cur || cur.session !== r.session || i < cur.last || (i === 1 && cur.last > 1)) { cur = { session: r.session, n: n, q: {}, last: 0, day: r.ldate }; rounds.push(cur); }
    cur.last = i;
    var q = cur.q[i] || (cur.q[i] = { pts: 0, done: false });
    if (q.done) return;
    if (isTrue_(r.correct)) { q.pts = Number(r.tryNo) === 1 ? 2 : 1; q.done = true; }
    else if (Number(r.tryNo) >= 2) q.done = true;
  });
  var done = 0, detail = [];
  rounds.forEach(function (rd) {
    var keys = Object.keys(rd.q), complete = keys.length >= rd.n && keys.every(function (k) { return rd.q[k].done; });
    if (!complete) { detail.push(dayName_(rd.day) + " quit"); return; }
    var pts = keys.reduce(function (s, k) { return s + rd.q[k].pts; }, 0), pct = pts / (rd.n * 2), st = pct >= .85 ? 3 : pct >= .6 ? 2 : 1;
    if (st >= g.min) done++;
    detail.push(dayName_(rd.day) + " " + "★".repeat(st) + " " + Math.round(pct * 100) + "%");
  });
  return { kid: kid, type: "rounds", label: g.label, n: g.n, min: g.min, done: done, met: done >= g.n, detail: detail };
}
function isTrue_(v) { return v === true || String(v).toLowerCase() === "true"; }

function renderHtml(rep, sheetUrl) {
  var font = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'PingFang TC','Noto Sans TC',sans-serif;";
  var muted = "color:#5f5e5a;", small = "font-size:13px;line-height:1.5;";
  var h = [];
  h.push('<div style="' + font + 'background:#f1efe8;padding:16px;color:#1b1f3b;max-width:560px;margin:0 auto">');
  h.push('<div style="padding:4px 4px 12px"><div style="font-size:18px;font-weight:600">Kids Arcade weekly report</div>');
  h.push('<div style="' + small + muted + '">' + esc_(rep.rangeLabel) + ' · Total play ' + hm_(rep.totalMin) + ' · ' + rep.totalAnswers + ' answers' +
    (rep.totalAcc !== null ? ' · ' + rep.totalAcc + '% right on the first try' : '') + '</div></div>');

  if (rep.goals && rep.goals.list.length) {
    var gw = rep.goals.week;
    h.push('<div style="background:#fff;border-radius:12px;padding:12px 14px;margin-bottom:12px">');
    h.push('<div style="font-size:15px;font-weight:600">🎯 Weekly goals · Week ' + gw.no + ' (' + esc_(gw.from.slice(5)) + ' to ' + esc_(gw.to.slice(5)) + ')</div>');
    rep.goals.list.forEach(function (x) {
      var info = KID_INFO[x.kid] || { name: x.kid, color: "#333" };
      h.push('<div style="' + small + 'margin-top:6px"><b style="color:' + info.color + '">' + esc_(info.name) + '</b> ' + (x.met ? '✅' : '❌') + ' ' + x.done + ' / ' + x.n +
        (x.type === "correct" ? ' right on the first try' : ' rounds at ' + "★".repeat(x.min) + '+') + ' · ' + esc_(x.label) + '<br><span style="' + muted + '">' + (x.detail.length ? esc_(x.detail.join(" · ")) : "Not played this week") + '</span></div>');
    });
    h.push('<div style="font-size:11px;' + muted + 'margin-top:6px">Counted from the raw answers in the Sheet, not from the iPad\'s own counter.</div></div>');
  }
  if (rep.prog && rep.prog.length) {
    h.push('<div style="background:#fff;border-radius:12px;padding:12px 14px;margin-bottom:12px"><div style="font-size:15px;font-weight:600">📖 Free play · where they are</div>');
    rep.prog.forEach(function (x) {
      var info = KID_INFO[x.kid] || { name: x.kid, color: "#333" };
      h.push('<div style="' + small + 'margin-top:6px"><b style="color:' + info.color + '">' + esc_(info.name) + '</b> · ' + esc_(x.game) + ' · <b>' + x.pct + '% done</b>' + (x.gain > 0 ? ' (▲ ' + x.gain + ' pts this week)' : '') + ' · ' + x.min + ' min this week<br><span style="' + muted + '">' + esc_(x.where) + (x.detail ? ' · ' + esc_(x.detail) : '') + '</span></div>');
    });
    h.push('</div>');
  }
  rep.kids.forEach(function (k) {
    h.push('<div style="background:#fff;border:1px solid #e3e1d9;border-radius:12px;padding:14px 16px;margin:0 0 12px">');
    var delta = !k.hadPrev ? (k.min ? "New this week" : "") : (k.deltaMin === 0 ? "Same as last week" : (k.deltaMin > 0 ? "▲ " : "▼ ") + Math.abs(k.deltaMin) + " min vs last week");
    h.push('<table width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:17px;font-weight:600;color:' + k.color + '">' + k.name + '</td><td align="right" style="' + small + muted + '">' + delta + '</td></tr></table>');
    if (!k.min && !k.answers) { h.push('<div style="' + small + muted + 'margin-top:6px">Didn’t play this week.</div></div>'); return; }

    h.push('<table width="100%" cellpadding="0" cellspacing="8" style="margin:6px -8px"><tr>' +
      stat_("Play time", hm_(k.min)) + stat_("Right on 1st try", k.acc === null ? "–" : k.acc + "%") + '</tr></table>');

    var max = Math.max.apply(null, k.perDay.map(function (d) { return d.min; }).concat([1]));
    h.push('<table width="100%" cellpadding="0" cellspacing="4" style="height:70px"><tr valign="bottom">');
    k.perDay.forEach(function (d) {
      var px = Math.round(48 * d.min / max);
      h.push('<td align="center" style="font-size:11px;' + muted + '"><div style="font-size:10px">' + (d.min ? d.min : "") + '</div>' +
        '<div style="height:' + px + 'px;background:' + k.color + ';border-radius:3px 3px 0 0"></div>' + d.label + '</td>');
    });
    h.push('</tr></table>');

    h.push(section_("By game"));
    h.push('<div style="' + small + muted + '">' + k.games.map(function (g) {
      return esc_(g.name) + " " + (g.min ? g.min + " min" : "<1 min") + (g.acc !== null ? " · " + g.acc + "%" : "");
    }).join("<br>") + '</div>');

    if (k.missed.length) {
      h.push(section_("Most missed"));
      k.missed.forEach(function (m) {
        h.push('<div style="' + small + 'border-top:1px solid #eee;padding:5px 0">' + esc_(shortQ_(m.q)) + ' → <span style="color:#a32d2d">' +
          esc_(m.givens.slice(0, 2).join(", ")) + '</span>' + (m.expected ? ' (answer <span style="color:#3b6d11">' + esc_(m.expected) + '</span>)' : '') +
          ' <span style="' + muted + '">· ' + esc_(m.game) + ' · missed ' + m.wrong + ' of ' + m.tries + '</span></div>');
      });
    }

    h.push(section_("Behavior"));
    h.push('<div style="' + small + muted + '">' + (k.flags.length ? k.flags.map(function (f) {
      return '<span style="display:inline-block;font-size:11px;padding:1px 8px;border-radius:6px;background:#faeeda;color:#854f0b;margin-right:4px">' + esc_(f.tag) + '</span>' + esc_(f.text);
    }).join("<br>") : "No flags this week.") + '</div>');

    if (k.practice.length) {
      h.push(section_("Practice next"));
      h.push('<div style="' + small + muted + '">' + k.practice.map(esc_).join(" · ") + '</div>');
    }
    h.push('</div>');
  });
  h.push('<div style="font-size:11px;' + muted + 'text-align:center;padding:6px">Play time counts only active play (pauses after 2 min idle). <a href="' + esc_(sheetUrl || "#") + '" style="color:#185fa5">All answers</a></div>');
  h.push('</div>');
  return h.join("");
}
function stat_(label, value) {
  return '<td width="50%" style="background:#f1efe8;border-radius:8px;padding:8px 10px"><div style="font-size:12px;color:#5f5e5a">' + label + '</div><div style="font-size:18px;font-weight:600">' + value + '</div></td>';
}
function section_(t) { return '<div style="font-size:13px;font-weight:600;margin:12px 0 3px">' + t + '</div>'; }

if (typeof module !== "undefined") module.exports = { buildReport: buildReport, renderHtml: renderHtml, CONFIG: CONFIG };

/* Removes rows recorded from games that only appear on the Tester page (parent test play). */
function removeTesterGames() {
  var TESTER_ONLY = ["life-skills", "story-maker", "idea-studio", "wand-writing", "cursive-quest", "doodle-studio", "song-blocks", "setup-test"];
  var ss = sheet_(), report = [];
  ["Answers", "Time"].forEach(function (name) {
    var sh = ss.getSheetByName(name), v = sh.getDataRange().getValues(), head = v[0], gi = head.indexOf("game");
    var keep = [head], removed = 0;
    for (var i = 1; i < v.length; i++) { if (TESTER_ONLY.indexOf(String(v[i][gi])) >= 0) removed++; else keep.push(v[i]); }
    if (removed) { sh.clearContents(); var r = sh.getRange(1, 1, keep.length, head.length); r.setNumberFormat("@"); r.setValues(keep.map(function (row) { return row.map(String); })); }
    report.push(name + ": removed " + removed + ", kept " + (keep.length - 1));
  });
  Logger.log(report.join(" | "));
}
