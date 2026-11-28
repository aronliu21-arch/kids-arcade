/* ===== Chapter 2: build your own car. Town map, day planner, store, home, school, job, cups ===== */
var C2S = { // state helpers
  fresh: function () { return { money: C2.START_MONEY, day: 0, slot: 0, hasKit: false, build: null, owned: {}, toolbox: [], trophies: [], lessons: {}, tests: {}, cups: {}, events: {}, coupon: 0, best: {}, gifts: [], intro: false, paid: {} }; },
  get: function () { var k = G.kd; if (!k.c2) k.c2 = this.fresh(); return k.c2; },
  week: function (c) { return Math.floor(c.day / 7) + 1; },
  dow: function (c) { return c.day % 7; },
  has: function (c, slot, v) { return !!(c.owned[slot + ":" + v]); },
  give: function (c, slot, v) { c.owned[slot + ":" + v] = (c.owned[slot + ":" + v] || 0) + 1; },
  part: function (slot, v) { return C2.PARTS[slot].filter(function (p) { return p.v === v; })[0]; },
  cupThisWeek: function (c) { var w = this.week(c); return C2.CUPS.filter(function (u) { return u.week === w; })[0]; },
  testA: function (c) { var t = c.tests[this.week(c)]; return !!(t && t.a); }
};
function money(n) { return "NT$" + n; }
function chunks(items, n) { var out = ""; for (var i = 0; i < items.length; i += n) out += "<div class='c2parts'>" + items.slice(i, i + n).join("") + "</div>"; return out; } // small blocks so the pager can split long lists

var C2G = {
  /* ---------- screen frame ---------- */
  frame: function (title) {
    var c = C2S.get(), d = C2.DAYS[C2S.dow(c)], sl = C2.SLOTNAMES[Math.min(2, c.slot)];
    $("#c2When").innerHTML = "📅 " + bi("第" + C2S.week(c) + "週 " + d[0] + " " + (c.slot > 2 ? "晚上" : sl[0]), "Week " + C2S.week(c) + " · " + d[1] + " · " + (c.slot > 2 ? "Night" : sl[1]));
    $("#c2Money").textContent = "💰 " + money(c.money);
    $("#c2Title").innerHTML = title ? bi(title[0], title[1]) : "";
    this.drawCar(); show("sC2");
  },
  drawCar: function (b) {
    var c = C2S.get(), cv = $("#c2Car"), st = $("#c2Stats"); b = b || c.build;
    var r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.max(10, r.width * d); cv.height = Math.max(10, r.height * d);
    var x = cv.getContext("2d"); x.clearRect(0, 0, cv.width, cv.height);
    if (!b) { st.innerHTML = "<b>" + bi("還沒有車", "No car yet") + "</b><div>" + bi("先去模型店買底盤套件！", "Buy a chassis kit at the store first!") + "</div>"; return; }
    var W = cv.width, H = cv.height, s = Math.min(W * 0.42, H * 0.5);
    CarArt.draw(x, b, "rear", W * 0.3, H * 0.88, s, { col: "blue" });   // chase-cam view
    CarArt.draw(x, b, "top", W * 0.76, H * 0.5, Math.min(W * 0.22, H * 0.5), { col: "blue", center: true }); // top view
    renderStats(st, b);
  },
  card: function (html, opt) { var cd = $("#c2Card"); cd.innerHTML = html; setTimeout(function () { Pager.fit(cd, opt || {}); }, 0); return cd; },
  say: function (who, z, e) { var c = CAST[who]; Read.pair(z, e, c.pitch); return "<div class='c2say'>" + (c.img ? "<img src='" + A(c.img) + "' alt=''>" : "<span class='ic'>" + c.ic + "</span>") + "<div><b style='color:" + c.col + "'>" + zh(c.zh) + " " + esc(c.en) + "</b>" + bi(z, e) + "</div></div>"; },
  advance: function () { var c = C2S.get(); c.slot++; save(); this.town(); },

  /* ---------- start ---------- */
  start: function () {
    var c = C2S.get();
    if (!c.intro) { c.intro = true; save(); return playScene("c2intro", function () { C2G.town(); }); }
    this.town();
  },
  /* ---------- town map ---------- */
  town: function () {
    var c = C2S.get(), dow = C2S.dow(c), school = dow < 5 && c.slot === 0, night = c.slot > 2, cup = C2S.cupThisWeek(c);
    var cupOpen = cup && !cup.soon && dow === 5 && c.slot === 0 && !c.cups[cup.id];
    function loc(id, ic, z, e, sub, ok) { return "<button class='loc" + (ok ? "" : " off") + "' data-l='" + id + "'" + (ok ? "" : " aria-disabled='true'") + "><span class='ic'>" + ic + "</span>" + bi(z, e) + "<small>" + sub + "</small></button>"; }
    var lockS = bi("上學時間", "School time"), lockN = bi("太晚了", "Too late");
    var testDone = c.tests[C2S.week(c)];
    var schoolSub = dow === 4 ? bi("今天考試！", "Test today!") : dow < 4 ? bi("上課", "Lesson") : bi("週末不上課", "No school today");
    var html = "<div class='c2town'>" +
      loc("school", "🏫", "學校", "School", schoolSub, school) +
      loc("store", "🏪", "模型店", "Hobby store", night ? lockN : school ? lockS : bi("買零件、測試", "Parts & testing"), !school && !night) +
      loc("work", "💼", "打工", "Work", night ? lockN : school ? lockS : bi("賺錢", "Earn money"), !school && !night) +
      loc("home", "🏠", "家", "Home", night ? bi("睡覺時間", "Bedtime") : bi("收藏、家人", "Collection, family"), !school) +
      loc("cup", "🏆", "比賽場", "Race arena", cup ? (cup.soon ? bi("下一場：" + cup.zh + "（快開放）", "Next: " + cup.en + " (soon)") : c.cups[cup.id] ? bi("比完了", "Done") : bi("星期六早上：" + cup.zh, "Sat morning: " + cup.en)) : bi("這週沒有比賽", "No cup this week"), !!cupOpen) +
      "</div>" + this.calendar(c);
    this.frame(["小鎮地圖", "Town map"]);
    var cd = this.card(html);
    $$(".loc", cd).forEach(function (b) { b.onclick = function () { if (b.classList.contains("off")) { sfx("buzz"); return; } sfx("tap"); Read.stop(); C2G[b.dataset.l](); }; });
    if (school) Read.pair("早上要去上學喔！", "Morning: time for school!");
    else if (night) Read.pair("晚上了，回家睡覺吧。", "It's night. Go home to sleep.");
  },
  calendar: function (c) {
    var w = C2S.week(c), cup = C2S.cupThisWeek(c), t = c.tests[w];
    return "<div class='c2cal'>" + C2.DAYS.map(function (d, i) {
      var mark = i < 4 ? "📖" : i === 4 ? "📝" : i === 5 && cup ? "🏆" : i === 6 ? "💰" : "";
      return "<span class='dd" + (i === C2S.dow(c) ? " now" : "") + "'><b>" + zh(d[0].slice(2)) + "</b>" + mark + "</span>";
    }).join("") + "</div><div class='c2goal'>" + (cup && !cup.soon ? bi("目標：星期五考試拿 A，才能參加星期六的" + cup.zh + "（" + TRACKS[cup.track].zh + "）", "Goal: get an A on Friday's test to race in Saturday's " + cup.en + " (" + TRACKS[cup.track].en + ")") : bi("下一場比賽準備中", "Next cup coming soon")) +
      (t ? " · " + (t.a ? "✅ A" : "📝 " + Math.round(t.pct * 100) + "%") : "") + "</div>";
  },

  /* ---------- school ---------- */
  school: function () {
    var c = C2S.get(), dow = C2S.dow(c), w = C2S.week(c);
    if (w > 1) { this.frame(["學校", "School"]); this.card(this.say("teacher", "今天複習。下一個單元快準備好了！", "Today we review. The next unit is almost ready!") + "<div class='act'><button class='btn blue' id='sOk'>" + bi("好", "OK") + " ▶</button></div>"); $("#sOk").onclick = function () { Read.stop(); C2G.advance(); }; return; }
    if (dow < 4) return this.lesson(C2.LESSONS[dow]);
    this.test(false);
  },
  lesson: function (L) {
    var c = C2S.get(), i = 0, self = this;
    this.frame([L.sub[0] + "：" + L.title[0], L.sub[1] + ": " + L.title[1]]);
    function card() {
      if (i >= L.cards.length) return quiz();
      var cd = L.cards[i];
      self.card("<div class='c2sub'>" + L.ic + " " + bi(L.sub[0], L.sub[1]) + "</div>" + self.say("teacher", cd[0], cd[1]) + "<div class='act'><button class='btn white' id='lAgain'>🔊</button><button class='btn blue' id='lNext'>" + bi("下一張", "Next") + " ▶</button></div>");
      $("#lNext").onclick = function () { sfx("tap"); Read.stop(); i++; card(); };
      $("#lAgain").onclick = function () { Read.pair(cd[0], cd[1], CAST.teacher.pitch); };
    }
    function quiz() {
      self.quiz(L.quiz, ["小考", "Quick quiz"], function (pts, max) {
        c.lessons[L.day] = true; save();
        self.card(self.say("teacher", "上完課了！你得到 " + pts + " / " + max + " 分。星期五考試會考這些喔。", "Lesson done! You got " + pts + " / " + max + ". Friday's test covers this.") +
          "<div class='tip'>💡 " + bi("在家試試看：數一數家裡有幾個輪子？", "Try at home: how many wheels can you find at home?") + "</div><div class='act'><button class='btn blue' id='lDone'>" + bi("下課", "Class over") + " ▶</button></div>");
        sfx("win"); $("#lDone").onclick = function () { Read.stop(); C2G.advance(); };
      });
    }
    card();
  },
  testQs: function () { var q = []; C2.LESSONS.forEach(function (L) { q = q.concat(L.quiz); }); q = q.concat(C2.TEST_EXTRA); return q.sort(function () { return Math.random() - 0.5; }).slice(0, 10); },
  test: function (retake) {
    var c = C2S.get(), w = C2S.week(c), self = this;
    this.frame(retake ? ["在家複習再考", "Study at home: retake"] : ["星期五考試", "Friday test"]);
    this.card(this.say("teacher", "考試開始！拿到 90 分以上就是 A。", "Test time! 90% or more is an A.") + "<div class='act'><button class='btn red' id='tGo'>" + bi("開始", "Start") + " ▶</button></div>");
    $("#tGo").onclick = function () {
      Read.stop();
      self.quiz(self.testQs(), ["考試", "Test"], function (pts, max) {
        var pct = pts / max, a = pct >= C2.A_LINE, old = c.tests[w];
        if (!old || pct > old.pct) c.tests[w] = { pct: pct, a: a || (old && old.a) }; save();
        var cup = C2S.cupThisWeek(c);
        var msg = a ? ["拿到 A 了！爸爸說：可以去比賽！", "You got an A! Dad says: you can race!"] : ["這次 " + Math.round(pct * 100) + " 分，還不是 A。回家可以複習再考一次。", "You got " + Math.round(pct * 100) + "%, not an A yet. Study at home and retake it."];
        self.card("<div class='big'>" + (a ? "🅰️" : "📝") + " " + Math.round(pct * 100) + "%</div>" + self.say(a ? "dad" : "teacher", msg[0], msg[1]) +
          (a && cup && !cup.soon ? "<div class='tip'>🎫 " + bi("得到比賽許可：" + cup.zh, "Permission to race: " + cup.en) + "</div>" : "") + "<div class='act'><button class='btn blue' id='tDone'>" + bi("好", "OK") + " ▶</button></div>");
        sfx(a ? "win" : "pop"); $("#tDone").onclick = function () { Read.stop(); C2G.advance(); };
      });
    };
  },
  /* two tries: 2 points first try, 1 point second try, then show the answer with a reason */
  quiz: function (qs, title, done) {
    var i = 0, pts = 0, self = this;
    function one() {
      if (i >= qs.length) return done(pts, qs.length * 2);
      var q = qs[i], tries = 0, order = q.a.map(function (_, j) { return j; }).sort(function () { return Math.random() - 0.5; });
      var cd = self.card("<div class='c2sub'>" + bi(title[0], title[1]) + " " + (i + 1) + " / " + qs.length + "</div><div class='quiz'><div class='qq'>" + bi(q.q[0], q.q[1]) + "</div><div class='ans'>" +
        order.map(function (j) { return "<button class='btn' data-j='" + j + "'>" + bi(q.a[j][0], q.a[j][1]) + "</button>"; }).join("") + "</div><div class='why'></div></div><div class='act'></div>");
      Read.pair(q.q[0], q.q[1]);
      $$(".ans .btn", cd).forEach(function (b) {
        b.onclick = function () {
          if (b.disabled) return; var j = +b.dataset.j; tries++;
          if (j === q.c) { b.classList.add("ok"); sfx("ding"); pts += tries === 1 ? 2 : 1; return next(); }
          b.classList.add("no"); b.disabled = true; sfx("buzz");
          if (tries >= 2) { $$(".ans .btn", cd).forEach(function (x) { if (+x.dataset.j === q.c) x.classList.add("ok"); }); next(true); }
          else Read.pair("再試一次！", "Try again!");
        };
      });
      function next(reveal) {
        $$(".ans .btn", cd).forEach(function (x) { x.disabled = true; });
        $(".why", cd).innerHTML = "<div class='tip'>" + (reveal ? "👉 " : "✅ ") + bi(q.why[0], q.why[1]) + "</div>";
        if (reveal) Read.pair(q.why[0], q.why[1]);
        $(".act", cd).innerHTML = "<button class='btn blue' id='qNext2'>" + bi("下一題", "Next") + " ▶</button>";
        Pager.fit(cd, { keep: true });
        $("#qNext2").onclick = function () { sfx("tap"); Read.stop(); i++; one(); };
      }
    }
    one();
  },

  /* ---------- home ---------- */
  home: function () {
    var c = C2S.get(), w = C2S.week(c), dow = C2S.dow(c), t = c.tests[w], cup = C2S.cupThisWeek(c), self = this;
    var night = c.slot > 2, canRetake = t && !t.a && dow === 4;
    var shelf = c.trophies.length ? c.trophies.map(function (tr) { return "<span class='tro' title='" + esc(tr.en) + "'>" + tr.ic + "<small>" + zh(tr.zh) + "</small></span>"; }).join("") : "<i>" + bi("還沒有獎盃，加油！", "No trophies yet. You can do it!") + "</i>";
    var inv = Object.keys(c.owned).filter(function (k) { return c.owned[k] > 0; }).map(function (k) { var a = k.split(":"), p = C2S.part(a[0], a[1]); return p ? "<span class='chip'>" + zh(p.zh) + " ×" + c.owned[k] + "</span>" : ""; }).join(" ");
    var dadMsg = t && t.a ? ["這週考試拿 A，爸爸很驕傲！比賽加油！", "An A this week. Dad is proud! Good luck at the race!"] : t ? ["考試還沒拿 A。複習一下再考，才能去比賽。", "No A yet. Study and retake the test to get permission to race."] : ["先把學校功課做好，星期五考 A 就可以去比賽。", "Do your school work first. An A on Friday means you can race."];
    this.frame(["家", "Home"]);
    var cd = this.card(this.say("dad", dadMsg[0], dadMsg[1]) +
      "<div class='box'><b>🏆 " + bi("獎盃架", "Trophy shelf") + "</b><div class='shelf'>" + shelf + "</div></div>" +
      "<div class='box'><b>🧰 " + bi("零件收藏", "Parts collection") + "</b><div>" + (inv || bi("還沒有零件", "No parts yet")) + "</div>" + (c.sticker ? "<div>⭐ " + bi("閃亮星星貼紙（貼在車上了）", "Star sticker (on your car)") + "</div>" : "") + "</div>" +
      "<div class='act'>" + (canRetake && !night ? "<button class='btn red' id='hStudy'>📖 " + bi("複習再考", "Study & retake") + "</button>" : "") +
      (!night ? "<button class='btn white' id='hRest'>🛋 " + bi("休息一下", "Rest a while") + "</button>" : "") +
      "<button class='btn blue' id='hSleep'>🛏 " + bi("睡覺（明天）", "Sleep (next day)") + "</button>" +
      "<button class='btn white' id='hBack'>🗺 " + bi("出門", "Go out") + "</button></div>");
    if ($("#hStudy")) $("#hStudy").onclick = function () { Read.stop(); self.test(true); };
    if ($("#hRest")) $("#hRest").onclick = function () { Read.stop(); self.advance(); };
    $("#hSleep").onclick = function () { Read.stop(); self.sleep(); };
    $("#hBack").onclick = function () { Read.stop(); if (c.slot > 2) return self.sleep(); self.town(); };
  },
  sleep: function () {
    var c = C2S.get(), self = this; c.day++; c.slot = 0; save();
    if (C2S.dow(c) === 6) { // Sunday: allowance if last week's test was an A
      var t = c.tests[C2S.week(c)], got = t && t.a && !c.paid[C2S.week(c)];
      if (got) { c.money += C2.ALLOWANCE; c.paid[C2S.week(c)] = true; save(); }
      this.frame(["星期日", "Sunday"]);
      this.card(this.say("dad", got ? "這週表現很好，零用錢 100 元給你！" : "今天星期日，好好休息，也可以去打工喔。", got ? "Great week! Here's your NT$100 allowance!" : "It's Sunday. Rest, or go to work if you like.") + "<div class='act'><button class='btn blue' id='zOk'>" + bi("好", "OK") + " ▶</button></div>");
      if (got) sfx("win"); $("#zOk").onclick = function () { Read.stop(); self.town(); }; return;
    }
    this.town();
  },

  /* ---------- store ---------- */
  store: function () {
    var c = C2S.get(), self = this;
    this.shopRuns = C2.SHOP_TESTS;
    // surprise event?
    var evs = C2.EVENTS.filter(function (e) { return !(e.once && c.events[e.id]); });
    if (c.hasKit && Math.random() < 0.4 && evs.length) { var ev = evs[Math.random() * evs.length | 0]; c.events[ev.id] = (c.events[ev.id] || 0) + 1; save(); return this.event(ev, function () { self.shop(); }); }
    this.shop();
  },
  event: function (ev, done) {
    var c = C2S.get(), self = this;
    this.frame(["驚喜！", "Surprise!"]);
    if (ev.q) {
      var cd = this.card(this.say(ev.who, ev.zh, ev.en) + "<div class='quiz'><div class='ans'>" + ev.q.a.map(function (a, j) { return "<button class='btn' data-j='" + j + "'>" + bi(a[0], a[1]) + "</button>"; }).join("") + "</div><div class='why'></div></div><div class='act'></div>");
      var tries = 0;
      $$(".ans .btn", cd).forEach(function (b) { b.onclick = function () {
        if (b.disabled) return; tries++; var ok = +b.dataset.j === ev.q.c;
        if (!ok && tries < 2) { b.classList.add("no"); b.disabled = true; sfx("buzz"); return; }
        $$(".ans .btn", cd).forEach(function (x) { x.disabled = true; if (+x.dataset.j === ev.q.c) x.classList.add("ok"); });
        if (ok) { sfx("ding"); self.gift(ev.gift); } else sfx("buzz");
        $(".why", cd).innerHTML = "<div class='tip'>" + (ok ? "🎁 " + bi("答對了！得到 50 元！", "Correct! You get NT$50!") + "<br>" : "") + bi(ev.q.why[0], ev.q.why[1]) + "</div>";
        $(".act", cd).innerHTML = "<button class='btn blue' id='eOk'>" + bi("謝謝", "Thanks") + " ▶</button>"; Pager.fit(cd, { keep: true });
        $("#eOk").onclick = function () { Read.stop(); done(); };
      }; });
      return;
    }
    var g = ev.gift ? this.gift(ev.gift) : null;
    this.card(this.say(ev.who, ev.zh, ev.en) + (g ? "<div class='tip'>🎁 " + bi("得到：" + g.zh, "You got: " + g.en) + "</div>" : "") + "<div class='act'><button class='btn blue' id='eOk'>" + bi("謝謝", "Thanks") + " ▶</button></div>");
    sfx("win"); $("#eOk").onclick = function () { Read.stop(); done(); };
  },
  gift: function (g) {
    var c = C2S.get();
    if (g.t === "money") { c.money += g.n; save(); return { zh: g.n + " 元", en: money(g.n) }; }
    if (g.t === "sticker") { c.sticker = true; if (c.build) c.build.sticker = true; save(); return { zh: "閃亮星星貼紙", en: "Star sticker" }; }
    if (g.t === "part") { C2S.give(c, g.slot, g.v); save(); var p = C2S.part(g.slot, g.v); return { zh: p.zh, en: p.en }; }
  },
  shop: function (tab) {
    var c = C2S.get(), self = this; tab = tab || (c.hasKit ? "buy" : "kit");
    this.frame(["模型店", "Hobby store"]);
    var tabs = "<div class='c2tabs'>" + [["buy", "🛒", "買零件", "Buy"], ["equip", "🔧", "裝零件", "Fit parts"], ["test", "🏁", "測試", "Test"], ["box", "🧰", "工具箱", "Toolbox"]].map(function (t) {
      return "<button class='btn " + (tab === t[0] ? "blue" : "white") + "' data-t='" + t[0] + "'>" + t[1] + " " + bi(t[2], t[3]) + "</button>"; }).join("") + "</div>";
    var body = "";
    if (!c.hasKit) {
      var K = C2.KIT;
      body = this.say("max", "從頭做一台自己的車吧！先買入門底盤套件，裡面有底盤、車殼、普通馬達、高速齒輪和硬輪胎。", "Let's build your own car from scratch! First get the starter chassis kit: chassis, body, stock motor, speed gears and hard tires.") +
        "<div class='act'><button class='btn red' id='bKit'>" + bi("買 " + K.zh, "Buy " + K.en) + " " + money(K.price) + "</button><button class='btn white' id='bOut'>🗺 " + bi("離開", "Leave") + "</button></div>";
      this.card(body);
      $("#bKit").onclick = function () {
        if (c.money < K.price) { sfx("buzz"); return Read.pair("錢不夠喔。", "Not enough money."); }
        c.money -= K.price; c.hasKit = true; c.build = JSON.parse(JSON.stringify(K.build)); if (c.sticker) c.build.sticker = true;
        Object.keys(K.build).forEach(function (s) { C2S.give(c, s, K.build[s]); }); save(); sfx("win"); Read.stop(); self.shop("buy");
      };
      $("#bOut").onclick = function () { Read.stop(); self.advance(); };
      return;
    }
    var cur = this.shopSlot || "motor", slotBar = "<div class='c2slots'>" + C2.SLOTS.map(function (sl) { return "<button class='chip" + (sl[0] === cur ? " on" : "") + "' data-sl='" + sl[0] + "'>" + bi(sl[1], sl[2]) + "</button>"; }).join("") + "</div>";
    if (tab === "buy") {
      body = slotBar + chunks(C2.PARTS[cur].filter(function (p) { return p.price > 0; }).map(function (p) {
        var own = C2S.has(c, cur, p.v), price = Math.max(0, p.price - (c.coupon || 0));
        return "<button class='opt" + (own ? " own" : "") + "' data-s='" + cur + "' data-v='" + p.v + "'>" + (p.art ? "<img class='thumb' src='" + A("b/" + p.v + "_orig") + "' alt=''>" : cur === "body" ? "<img class='thumb' src='" + A("L_top_body_" + p.v) + "' alt=''>" : "") + bi(p.zh, p.en) + "<small>" + zh(p.d[0]) + "<br>" + esc(p.d[1]) + "</small><span class='pr'>" + (own ? "✅ " + bi("已經有了", "Owned") : money(price)) + "</span></button>";
      }), innerWidth > 900 ? 4 : 3);
    } else if (tab === "equip") {
      body = slotBar + chunks(C2.PARTS[cur].filter(function (p) { return C2S.has(c, cur, p.v); }).map(function (p) {
        return "<button class='opt" + (c.build[cur] === p.v ? " sel" : "") + "' data-s='" + cur + "' data-v='" + p.v + "'>" + (p.art ? "<img class='thumb' src='" + A("b/" + p.v + "_" + (p.v === c.build.body && c.build.paint ? c.build.paint : "orig")) + "' alt=''>" : "") + bi(p.zh, p.en) + "<small>" + zh(p.d[0]) + "<br>" + esc(p.d[1]) + "</small></button>";
      }), innerWidth > 900 ? 4 : 3);
      var cb = C2S.part("body", c.build.body);
      if (cur === "body" && cb && cb.art) body = slotBar + "<div class='c2sub'>🎨 " + bi("車殼顏色（免費換）", "Body color (free to change)") + "</div><div class='c2paint'>" + cb.cols.map(function (k) {
        return "<button class='paint" + ((c.build.paint || "orig") === k ? " on" : "") + "' data-p='" + k + "'><img src='" + A("b/" + cb.v + "_" + k) + "' alt='" + k + "'></button>"; }).join("") + "</div>" + body.slice(slotBar.length); // paint row goes under the pinned slot bar
    } else if (tab === "test") {
      body = "<div class='c2sub'>" + bi("選一條跑道測試（這次還能測 " + this.shopRuns + " 次）", "Pick a track to test (" + this.shopRuns + " runs left this visit)") + "</div><div class='c2tracks'>" + ["oval", "twisty", "hills"].map(function (id) {
        var T = TRACKS[id], b = c.best[id];
        return "<button class='opt' data-tr='" + id + "'>" + bi(T.zh, T.en) + "<small>" + ({ oval: "直線很長 · Long straights", twisty: "很多急彎 · Lots of tight curves", hills: "兩個大坡 · Two big hills" }[id]) + "</small><span class='pr'>⏱ " + (b ? b.toFixed(1) + "s" : "—") + "</span></button>";
      }).join("") + "</div>";
    } else if (tab === "box") {
      var spares = Object.keys(c.owned).filter(function (k) { var a = k.split(":"); return c.owned[k] > 0 && c.build[a[0]] !== a[1] && C2S.part(a[0], a[1]).price > 0; });
      body = "<div class='c2sub'>" + bi("選最多 " + C2.TOOLBOX + " 個備用零件帶去比賽，比賽前可以換。", "Pick up to " + C2.TOOLBOX + " spare parts to bring to the cup. You can swap them in before the race.") + "</div><div class='c2parts'>" +
        (spares.length ? spares.map(function (k) { var a = k.split(":"), p = C2S.part(a[0], a[1]); return "<button class='opt" + (c.toolbox.indexOf(k) >= 0 ? " sel" : "") + "' data-k='" + k + "'>" + bi(p.zh, p.en) + "</button>"; }).join("") : "<i>" + bi("沒有備用零件（裝在車上的不算）", "No spare parts (parts on the car don't count)") + "</i>") + "</div>";
    }
    var pinned = body.indexOf("<div class='c2slots'>") === 0 ? body.slice(0, body.indexOf("</div>") + 6) : "";
    if (pinned) body = body.slice(pinned.length);
    var cd = this.card("<div class='pin'>" + tabs + pinned + "</div>" + body + "<div class='act'><button class='btn white' id='bOut'>🗺 " + bi("離開模型店", "Leave the store") + "</button></div>");
    $$(".c2paint .paint", cd).forEach(function (b) { b.onclick = function () { sfx("tap"); c.build.paint = b.dataset.p; save(); self.shop("equip"); }; });
    $$(".c2slots .chip", cd).forEach(function (b) { b.onclick = function () { sfx("tap"); self.shopSlot = b.dataset.sl; self.shop(tab); }; });
    $$(".c2tabs .btn", cd).forEach(function (b) { b.onclick = function () { sfx("tap"); Read.stop(); self.shop(b.dataset.t); }; });
    $("#bOut").onclick = function () { Read.stop(); self.advance(); };
    $$(".opt", cd).forEach(function (b) {
      if (tab === "buy") b.onclick = function () {
        var s = b.dataset.s, v = b.dataset.v, p = C2S.part(s, v), price = Math.max(0, p.price - (c.coupon || 0));
        if (C2S.has(c, s, v)) { sfx("buzz"); return; }
        self.drawCar(Object.assign({}, c.build, (function () { var o = {}; o[s] = v; return o; })())); // preview it on the car
        if (c.money < price) { sfx("buzz"); return Read.pair("錢不夠，去打工賺錢吧！還差 " + (price - c.money) + " 元。", "Not enough money. Work to earn " + money(price - c.money) + " more!"); }
        self.confirm(["買 " + p.zh + "，" + price + " 元？", "Buy " + p.en + " for " + money(price) + "?"], function () {
          c.money -= price; c.coupon = 0; C2S.give(c, s, v); c.build[s] = v; if (s === "body") c.build.paint = "orig"; save(); sfx("win"); self.shop("buy");
        }, function () { self.shop("buy"); });
      };
      if (tab === "equip") b.onclick = function () { sfx("tap"); c.build[b.dataset.s] = b.dataset.v; c.toolbox = c.toolbox.filter(function (k) { return k !== b.dataset.s + ":" + b.dataset.v; }); save(); self.shop("equip"); };
      if (tab === "box") b.onclick = function () { var k = b.dataset.k, i = c.toolbox.indexOf(k); if (i >= 0) c.toolbox.splice(i, 1); else if (c.toolbox.length < C2.TOOLBOX) c.toolbox.push(k); else { sfx("buzz"); return; } sfx("tap"); save(); self.shop("box"); };
      if (tab === "test") b.onclick = function () {
        if (self.shopRuns <= 0) { sfx("buzz"); return Read.pair("今天測試次數用完了。", "No test runs left this visit."); }
        self.shopRuns--; var id = b.dataset.tr; Read.stop();
        Race.start("practice", { track: id, laps: 1, build: Object.assign({ luck: 1 }, c.build), rivals: [], onDone: function (res) { self.testResult(id, res); } });
      };
    });
  },
  confirm: function (q, yes, no) {
    ovl("<div class='big'>🛒</div><div style='text-align:center'>" + bi(q[0], q[1]) + "</div><div class='act'><button class='btn white' id='cfN'>" + bi("先不要", "Not now") + "</button><button class='btn red' id='cfY'>" + bi("買！", "Buy!") + "</button></div>");
    Read.pair(q[0], q[1]);
    $("#cfY").onclick = function () { closeOvl(); Read.stop(); yes(); }; $("#cfN").onclick = function () { closeOvl(); Read.stop(); no(); };
  },
  testResult: function (id, res) {
    var c = C2S.get(), self = this, t = res.r.t, old = c.best[id];
    if (!res.out && (!old || t < old)) { c.best[id] = t; save(); }
    var hint = res.out ? ["衝出跑道了！彎道太快，要裝滾輪。", "Course out! Too fast in a curve. It needs rollers."] :
      res.r.log.hillSlow > 4 ? ["上坡變很慢。試試扭力馬達或力量齒輪。", "Very slow up the hills. Try a torque motor or power gears."] :
      res.r.log.scrape > 3 ? ["彎道一直擦牆。軟輪胎、四個滾輪或尾翼會更穩。", "Lots of wall scraping in curves. Soft tires, 4 rollers or a wing are steadier."] :
      ["跑得很順！想更快可以換馬達、車殼或低摩擦輪胎。", "Smooth run! For more speed try a motor, body or low-friction tires."];
    this.frame(["測試結果", "Test result"]);
    this.card("<div class='big'>⏱ " + (res.out ? "—" : t.toFixed(1) + "s") + "</div><div style='text-align:center'>" + bi(TRACKS[id].zh + (old && !res.out && t < old ? "　新紀錄！" : ""), TRACKS[id].en + (old && !res.out && t < old ? " · New best!" : "")) + "</div>" +
      this.say("max", hint[0], hint[1]) + "<div class='act'><button class='btn blue' id='trBack'>🔧 " + bi("回到模型店", "Back to the store") + "</button></div>");
    $("#trBack").onclick = function () { Read.stop(); self.shop("test"); };
  },

  /* ---------- work ---------- */
  work: function () {
    var self = this;
    this.frame(["打工", "Work"]);
    var cd = this.card("<div class='c2sub'>" + bi("選一個工作（一次工作用掉一段時間）", "Pick a job (one job uses one time slot)") + "</div><div class='c2jobs'>" + C2.JOBS.map(function (j) {
      return "<button class='opt" + (j.open ? "" : " off") + "' data-j='" + j.id + "'><span class='ic'>" + j.ic + "</span>" + bi(j.zh, j.en) + "<span class='pr'>" + (j.open ? money(j.pay) + "+" : bi("快開放", "Soon")) + "</span></button>";
    }).join("") + "</div><div class='act'><button class='btn white' id='wBack'>🗺 " + bi("回地圖", "Back to map") + "</button></div>");
    $$(".opt", cd).forEach(function (b) { b.onclick = function () { if (b.classList.contains("off")) { sfx("buzz"); return Read.pair("這個工作快開放了！", "This job opens soon!"); } sfx("tap"); self.noodle(); }; });
    $("#wBack").onclick = function () { Read.stop(); self.town(); };
  },
  /* noodle shop: make the tray for each order, then pick the right total */
  noodle: function () {
    var self = this, c = C2S.get(), n = 0, tips = 0, N = 5;
    this.frame(["麵店幫忙", "Noodle shop"]);
    var faces = ["👦", "👴", "👨", "🧑", "👨‍🦱", "👱‍♂️"];
    function customer() {
      if (n >= N) return pay();
      var k = 2 + (Math.random() < 0.5 ? 1 : 0), want = [];
      while (want.length < k) { var m = C2.MENU[Math.random() * C2.MENU.length | 0]; want.push(m); }
      var tray = [], tries = 0, perfect = true;
      var cnt = {}; want.forEach(function (m) { cnt[m.id] = (cnt[m.id] || 0) + 1; });
      var grp = C2.MENU.filter(function (m) { return cnt[m.id]; });
      var oz = grp.map(function (m) { return (cnt[m.id] > 1 ? cnt[m.id] + "份" : "") + m.zh; }).join("、"), oe = grp.map(function (m) { return m.en + (cnt[m.id] > 1 ? " ×" + cnt[m.id] : ""); }).join(", ");
      function draw() {
        var cd = self.card("<div class='c2sub'>🍜 " + bi("客人", "Customer") + " " + (n + 1) + " / " + N + "</div>" +
          "<div class='c2say'><span class='ic'>" + faces[n % faces.length] + "</span><div>" + bi("我要：" + oz, "I'd like: " + oe) + "</div></div>" +
          "<div class='menu'>" + C2.MENU.map(function (m) { return "<button class='opt' data-m='" + m.id + "'><span class='ic'>" + m.ic + "</span>" + bi(m.zh, m.en) + "<span class='pr'>" + money(m.p) + "</span></button>"; }).join("") + "</div>" +
          "<div class='tray'>🍽 " + (tray.length ? tray.map(function (m, i) { return "<button class='chip' data-i='" + i + "'>" + m.ic + " ✕</button>"; }).join("") : bi("點上面的菜放到托盤", "Tap the menu to fill the tray")) + "</div>" +
          "<div class='act'><button class='btn blue' id='nDone'>" + bi("送餐", "Serve") + " ▶</button></div>");
        $$(".menu .opt", cd).forEach(function (b) { b.onclick = function () { sfx("tap"); if (tray.length < 4) tray.push(C2.MENU.filter(function (m) { return m.id === b.dataset.m; })[0]); draw(); }; });
        $$(".tray .chip", cd).forEach(function (b) { b.onclick = function () { tray.splice(+b.dataset.i, 1); draw(); }; });
        $("#nDone").onclick = function () {
          var a = want.map(function (m) { return m.id; }).sort().join(), t = tray.map(function (m) { return m.id; }).sort().join();
          if (a === t) { sfx("ding"); return bill(); }
          tries++; perfect = false; sfx("buzz");
          if (tries >= 2) { tray = want.slice(); Read.pair("托盤應該是：" + oz, "The tray should have: " + oe); draw(); setTimeout(bill, 1600); }
          else { Read.pair("不太對，再聽一次：" + oz, "Not quite. Listen again: " + oe); }
        };
      }
      function bill() {
        var sum = want.reduce(function (s, m) { return s + m.p; }, 0), opts = [sum, sum + 30, sum - 20 > 0 ? sum - 20 : sum + 50].sort(function () { return Math.random() - 0.5; }), bt = 0;
        var cd = self.card("<div class='c2sub'>🧾 " + bi("一共多少錢？", "What's the total?") + "</div><div class='bill'>" + want.map(function (m) { return m.ic + " " + money(m.p); }).join(" + ") + " = ?</div><div class='quiz'><div class='ans'>" +
          opts.map(function (o) { return "<button class='btn' data-v='" + o + "'>" + money(o) + "</button>"; }).join("") + "</div></div>");
        Read.pair("一共多少錢？", "What's the total?");
        $$(".ans .btn", cd).forEach(function (b) { b.onclick = function () {
          if (b.disabled) return; bt++;
          if (+b.dataset.v === sum) { b.classList.add("ok"); sfx("ding"); if (perfect && bt === 1) tips += C2.TIP; n++; setTimeout(customer, 700); return; }
          b.classList.add("no"); b.disabled = true; sfx("buzz");
          if (bt >= 2) { $$(".ans .btn", cd).forEach(function (x) { if (+x.dataset.v === sum) x.classList.add("ok"); }); Read.pair("答案是 " + sum + " 元。", "It's " + money(sum) + "."); n++; setTimeout(customer, 1800); }
        }; });
      }
      Read.pair("我要：" + oz, "I'd like: " + oe);
      draw();
    }
    function pay() {
      var job = C2.JOBS[0], got = job.pay + tips; c.money += got; save(); sfx("win");
      self.frame(["下班了", "Shift done"]);
      self.card("<div class='big'>💰 +" + money(got) + "</div>" + self.say("boss", "做得很好！薪水 " + job.pay + " 元，小費 " + tips + " 元。", "Great work! Pay NT$" + job.pay + ", tips NT$" + tips + ".") +
        "<div class='tip'>💡 " + bi("生活小技巧：去店裡買東西時，先算算看總共多少錢！", "Try it next time you shop: add up the total before you pay!") + "</div><div class='act'><button class='btn blue' id='pOk'>" + bi("回家路上", "Head out") + " ▶</button></div>");
      $("#pOk").onclick = function () { Read.stop(); self.advance(); };
    }
    customer();
  },

  /* ---------- the cup ---------- */
  cup: function () {
    var c = C2S.get(), cup = C2S.cupThisWeek(c), self = this;
    this.frame([cup.zh, cup.en]);
    if (!c.hasKit) { this.card(this.say("max", "你還沒有車！先去模型店。", "You don't have a car yet! Visit the store first.") + "<div class='act'><button class='btn blue' id='cuB'>🗺 " + bi("回地圖", "Back") + "</button></div>"); $("#cuB").onclick = function () { Read.stop(); self.town(); }; return; }
    if (!C2S.testA(c)) {
      this.card(this.say("dad", "這週考試還沒拿 A，所以這次不能比賽。下次加油！", "No A on this week's test, so no race this time. Try again next week!") + "<div class='act'><button class='btn blue' id='cuB'>" + bi("好", "OK") + " ▶</button></div>");
      $("#cuB").onclick = function () { Read.stop(); c.cups[cup.id] = { missed: true }; save(); self.advance(); }; return;
    }
    if (c.money < cup.fee) { this.card(this.say("max", "報名費 " + cup.fee + " 元，錢不夠喔。", "Entry is NT$" + cup.fee + ". Not enough money.") + "<div class='act'><button class='btn blue' id='cuB'>🗺 " + bi("回地圖", "Back") + "</button></div>"); $("#cuB").onclick = function () { Read.stop(); self.town(); }; return; }
    c.money -= cup.fee; save();
    this.pit(cup);
  },
  pit: function (cup) { // swap parts from the toolbox before the race
    var c = C2S.get(), self = this;
    this.frame(["維修區", "Pit area"]);
    var cd = this.card(this.say("max", "今天的跑道是" + TRACKS[cup.track].zh + "。要用工具箱換零件嗎？", "Today's track: " + TRACKS[cup.track].en + ". Swap anything from your toolbox?") +
      "<div class='c2parts'>" + (c.toolbox.length ? c.toolbox.map(function (k) { var a = k.split(":"), p = C2S.part(a[0], a[1]), on = c.build[a[0]] === a[1]; return "<button class='opt" + (on ? " sel" : "") + "' data-k='" + k + "'>" + bi(p.zh, p.en) + "<small>" + (on ? bi("裝上了", "Fitted") : bi("點一下裝上", "Tap to fit")) + "</small></button>"; }).join("") : "<i>" + bi("工具箱是空的", "The toolbox is empty") + "</i>") +
      "</div><div class='act'><button class='btn red' id='puGo'>🏁 " + bi("出發！", "Race!") + "</button></div>");
    $$(".opt", cd).forEach(function (b) { b.onclick = function () { var a = b.dataset.k.split(":"); c.build[a[0]] = a[1]; save(); sfx("tap"); self.pit(cup); }; });
    $("#puGo").onclick = function () {
      Read.stop();
      var luck = function (a) { return 1 + (Math.random() * 2 - 1) * a; };
      Race.start("race", { track: cup.track, laps: cup.laps, build: Object.assign({}, c.build, { luck: luck(0.02) }),
        rivals: cup.rivals.map(function (r) { return { who: r.who, col: C2.KIDS[r.who].col, car: "c_red", build: Object.assign({}, r.build, { luck: luck(0.045) }) }; }),
        onDone: function (res) { self.cupResult(cup, res); } });
    };
  },
  cupResult: function (cup, res) {
    var c = C2S.get(), self = this, place = res.place, prize = !res.out && place <= 3 ? cup.prize[place - 1] : 0;
    var g = C2.GIFTS[Math.random() * C2.GIFTS.length | 0], gift = this.gift(g);
    c.money += prize; c.cups[cup.id] = { place: place };
    if (prize) c.trophies.push({ ic: cup.trophy[place - 1], zh: cup.zh + " 第" + place + "名", en: cup.en + " #" + place });
    save();
    var winner = res.order[0], friend = winner === "lucas" ? (res.order[1] || "kai") : winner;
    var line = winner === "lucas" ? [CAST[friend].zh + "：「恭喜你！下次我會更快喔！」", CAST[friend].en + ": \"Congrats! I'll be faster next time!\""] : [CAST[winner].zh + "：「好精彩的比賽！你的車也很快！」", CAST[winner].en + ": \"What a great race! Your car is fast too!\""];
    this.frame([cup.zh + " 結果", cup.en + " results"]);
    this.card("<div class='big'>" + (res.out ? "💥" : cup.trophy[place - 1] || "🏁") + " " + bi(res.out ? "脫軌" : "第 " + place + " 名", res.out ? "Course out" : "Place " + place) + "</div>" +
      "<div class='c2sub'>" + res.order.map(function (w, i) { return (i + 1) + ". " + zh(CAST[w].zh) + " " + esc(CAST[w].en); }).join(" · ") + "</div>" +
      "<div class='tip'>" + bi(line[0], line[1]) + "</div>" +
      (prize ? "<div class='tip'>💰 " + bi("獎金 " + prize + " 元，獎盃放在家裡的獎盃架！", "Prize NT$" + prize + ". The trophy goes on your shelf at home!") + "</div>" : "") +
      "<div class='tip' style='background:#fff4e6'>🎁 " + bi("神秘禮物：" + gift.zh, "Mystery gift: " + gift.en) + "</div>" +
      "<div class='tip' style='background:#e7f5ff'>🚧 " + bi("第二章第一部分完成！下一場城市盃（彎道迷宮）快開放了。", "Chapter 2, part 1 done! The City Cup (Twisty Maze) opens soon.") + "</div>" +
      "<div class='act'><button class='btn blue' id='crOk'>" + bi("回小鎮", "Back to town") + " ▶</button></div>");
    Read.pair(line[0], line[1]); sfx(place === 1 && !res.out ? "win" : "pop");
    $("#crOk").onclick = function () { Read.stop(); self.advance(); };
  }
};
