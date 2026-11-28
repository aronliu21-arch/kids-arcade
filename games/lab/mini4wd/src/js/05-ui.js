/* ===== Screens, profiles, story player, overlays ===== */
var DB = KAKit.store("mini4wd", { kids: {} });
var BEST = { motor: "turbo", gear: "power", tire: "soft", roller: "yes", body: "sleek" };
var G = { kid: null, kd: null, tester: false };

function freshKid() { return { stage: "shop", step: 0, build: JSON.parse(JSON.stringify(DEFAULT_BUILD)), points: 0, quizDone: {}, ep1: false, races: 0, settings: {} }; }
function save() { if (!G.tester) DB.save(); }
function pickKid(kid) {
  G.tester = kid === "tester";
  if (G.tester) { G.kd = freshKid(); G.kid = "tester"; return; }
  DB.kids = DB.kids || {};
  if (!DB.kids[kid]) DB.kids[kid] = freshKid();
  G.kid = kid; G.kd = DB.kids[kid];
}

var CUR = "sTitle";
function show(id) {
  $$(".scr").forEach(function (s) { s.classList.toggle("on", s.id === id); });
  CUR = id;
  var home = id !== "sTitle" && id !== "sMenu";
  $("#bHome").style.display = home ? "" : "none";
  if (home) Music.stop(); else Music.start();
  if (id !== "sRace") Engine.stop();
}

/* ---------- overlay ---------- */
function ovl(html) { $("#ovlCard").innerHTML = html; $("#ovl").classList.add("on"); $("#ovl").scrollTop = 0; setTimeout(function () { Pager.fit($("#ovlCard")); }, 0); }

/* ---------- Pager: on phones, split a too-tall card into pages (◀ ▶) instead of scrolling ---------- */
var FIT = window.matchMedia("all"); // page on every screen size, never scroll
var Pager = {
  fit: function (card, opt) {
    opt = opt || {}; card.__opt = opt;
    var keep = opt.keep ? (card.__pg || 0) : 0;
    var nav = card.querySelector(".pgnav"), act = card.__act;
    if (nav) { if (act && act.__home) { act.__home.insertBefore(act, act.__next || null); act.style.display = ""; } nav.remove(); }
    var blocks = opt.blocks ? opt.blocks() : $$(":scope > *", card).filter(function (b) { return !b.classList.contains("act") && !b.classList.contains("pin"); }); // .pin blocks stay on every page
    act = opt.act ? opt.act() : card.querySelector(":scope > .act");
    blocks.forEach(function (b) { b.style.display = ""; b.style.zoom = ""; });
    card.classList.remove("paged"); card.__pages = null; card.__act = null;
    if (!FIT.matches) return;
    $$("img", card).forEach(function (im) { if (!im.complete) im.addEventListener("load", function () { if (card.__opt === opt) Pager.fit(card, Object.assign({}, opt, { keep: true, find: null })); }, { once: true }); });
    if (card.scrollHeight <= card.clientHeight + 2) return;
    nav = document.createElement("div"); nav.className = "pgnav";
    nav.innerHTML = "<button class='btn white pgp' aria-label='Back'>◀</button><span class='pgd'></span><button class='btn blue pgn'>" + bi("下一頁", "Next") + " ▶</button>";
    if (act) { act.__home = act.parentNode; act.__next = act.nextSibling; nav.appendChild(act); card.__act = act; }
    card.appendChild(nav); card.classList.add("paged");
    var cs = getComputedStyle(card);
    var avail = card.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - nav.offsetHeight - 10;
    $$(":scope > .pin", card).forEach(function (pn) { avail -= pn.getBoundingClientRect().height + 6; });
    var pages = [[]], h = 0;
    blocks.forEach(function (b) {
      var bs = getComputedStyle(b), bh = b.getBoundingClientRect().height + parseFloat(bs.marginTop) + parseFloat(bs.marginBottom);
      if (bh > avail) b.style.zoom = Math.max(0.55, avail / bh).toFixed(3), bh = avail;
      if (h + bh > avail && pages[pages.length - 1].length) { pages.push([]); h = 0; }
      pages[pages.length - 1].push(b); h += bh;
    });
    card.__pages = pages;
    var self = this;
    $(".pgp", nav).onclick = function () { sfx("tap"); self.go(card, card.__pg - 1); };
    $(".pgn", nav).onclick = function () { sfx("tap"); self.go(card, card.__pg + 1); };
    var start = opt.find ? pages.findIndex(function (pg) { return pg.indexOf(opt.find()) >= 0; }) : keep;
    this.go(card, start < 0 ? 0 : start);
  },
  go: function (card, i) {
    var pages = card.__pages; if (!pages) return;
    i = Math.max(0, Math.min(pages.length - 1, i)); card.__pg = i;
    pages.forEach(function (pg, j) { pg.forEach(function (b) { b.style.display = j === i ? "" : "none"; }); });
    var nav = card.querySelector(".pgnav"), last = i === pages.length - 1;
    $(".pgp", nav).style.visibility = i ? "" : "hidden";
    $(".pgn", nav).style.display = last ? "none" : "";
    if (card.__act) card.__act.style.display = last ? "" : "none";
    $(".pgd", nav).textContent = pages.length > 1 ? (i + 1) + " / " + pages.length : "";
  },
  refit: function () { $$(".card").forEach(function (c) { if (c.offsetParent || c.closest(".ovl.on")) Pager.fit(c, Object.assign({}, c.__opt || {}, { keep: true, find: null })); }); }
};
addEventListener("resize", function () { clearTimeout(Pager.t); Pager.t = setTimeout(Pager.refit, 150); });
function closeOvl() { $("#ovl").classList.remove("on"); }

/* ---------- menu ---------- */
function refreshMenu() {
  var k = DB.kids && DB.kids.lucas;
  var sub = !k ? bi("新的冒險！", "A new adventure!") : k.ep1 ? bi("第一集完成 ⭐", "Episode 1 done ⭐") : bi("繼續", "Continue");
  $("#lucasSub").innerHTML = sub;
  $("#bRead").innerHTML = (Read.on ? "🔊 " : "🔇 ") + bi("讀出來", "Read aloud");
}
var STAGES = [["shop", "故事：模型店", "Story: hobby shop"], ["garage", "組車", "Build the car"], ["test", "測試跑道", "Test run"], ["park", "比賽日", "Race day"], ["race", "第一場比賽", "Race 1"], ["win", "結局", "Ending"], ["c2", "第二章", "Chapter 2"]];
function testerMenu() {
  var j = $("#jump");
  j.innerHTML = STAGES.map(function (s) { return "<button class='btn white' data-s='" + s[0] + "'>" + bi(s[1], s[2]) + "</button>"; }).join("");
  j.classList.add("on");
  $$("button", j).forEach(function (b) { b.onclick = function () { sfx("tap"); pickKid("tester"); if (b.dataset.s !== "shop" && b.dataset.s !== "garage") G.kd.build = JSON.parse(JSON.stringify(BEST)); go(b.dataset.s); }; });
}

/* ---------- story ---------- */
var Story = { key: null, i: 0, done: null };
function playScene(key, done) {
  Story.key = key; Story.i = 0; Story.done = done;
  var sc = SCENES[key];
  $("#sStory .bg").src = A(sc.bg);
  $$(".por").forEach(function (p) { p.classList.remove("on", "talk", "dim", "hero"); p.removeAttribute("src"); });
  show("sStory");
  storyLine();
}
function storyLine() {
  var sc = SCENES[Story.key], ln = sc.lines[Story.i], who = ln[0], c = CAST[who];
  var L = $(".por.L"), R = $(".por.R"), d = $("#dlg");
  if (who === "lucas") { L.src = A(c.img); L.classList.add("on", "hero"); }
  else if (who !== "narr") { if (R.dataset.who !== who) { R.src = A(c.img); R.dataset.who = who; } R.classList.add("on"); }
  L.classList.toggle("talk", who === "lucas"); R.classList.toggle("talk", who !== "lucas" && who !== "narr");
  L.classList.toggle("dim", who !== "lucas" && who !== "narr"); R.classList.toggle("dim", who === "lucas");
  d.classList.toggle("narr", who === "narr");
  var nm = $(".nm", d); nm.innerHTML = who === "narr" ? "" : zh(c.zh) + " " + esc(c.en); nm.style.background = c.col;
  $(".zh", d).innerHTML = zh(ln[1]); $(".en", d).textContent = ln[2];
  Read.pair(ln[1], ln[2], c.pitch);
}
function storyNext() {
  Read.stop(); sfx("tap");
  var sc = SCENES[Story.key];
  if (++Story.i >= sc.lines.length) { var f = Story.done; Story.done = null; if (f) f(); return; }
  storyLine();
}

/* ---------- flow ---------- */
function go(stage) {
  var k = G.kd; k.stage = stage; save(); closeOvl();
  if (stage === "shop") playScene("shop", function () { k.step = 0; go("garage"); });
  else if (stage === "garage") Garage.start(k.step || 0, function () { go("test"); });
  else if (stage === "test") playScene("test", function () { Race.start("practice"); });
  else if (stage === "park") playScene("park", function () { go("race"); });
  else if (stage === "race") Race.start("race");
  else if (stage === "win") playScene("win", finishEpisode);
  else if (stage === "c2") { k.stage = "done"; save(); C2G.start(); }
}
function maxSays(adv, buttons) {
  var a = ADVICE[adv];
  ovl("<div class='who'><img src='" + A("p_max") + "' alt=''><div>" + bi(a[0], a[1]) + "</div></div><div class='act'>" + buttons + "</div>");
  Read.pair(a[0], a[1], CAST.max.pitch);
}
function finishEpisode() {
  var k = G.kd; k.ep1 = true; k.stage = "done"; save();
  var pts = k.points || 0, max = PARTS.length * 2, stars = pts >= max - 1 ? 3 : pts >= max - 5 ? 2 : 1;
  ovl("<div class='big title-font'>EPISODE 1 CLEAR!</div>" +
    "<div style='text-align:center'>" + bi("第一集完成！藍色閃電隊誕生了！", "Episode 1 complete! Team Blue Bolt is born!") + "</div>" +
    "<div class='big stars'>" + "⭐".repeat(stars) + "☆".repeat(3 - stars) + "</div>" +
    "<div style='text-align:center'>" + bi("科學問題：" + pts + " / " + max + " 分", "Science quiz: " + pts + " / " + max + " points") + "</div>" +
    "<div class='tip'>💡 " + bi(TIP[0], TIP[1]) + "</div>" +
    "<div class='tip' style='background:#fff4e6'>🚧 " + bi("第二章開放了：自己做一台車！", "Chapter 2 is open: build your own car!") + "</div>" +
    "<div class='act'><button class='btn blue' id='rHome'>🏠 " + bi("回到選單", "Back to menu") + "</button></div>");
  sfx("win");
  Read.pair(TIP[0], TIP[1]);
  $("#rHome").onclick = function () { closeOvl(); Read.stop(); refreshMenu(); show("sMenu"); };
}
