/* ===== Garage: build the car part by part, with demos, choices and a quiz ===== */
function renderStats(el, b) {
  var s = carBars(b), rows = [
    ["最高速度", "Top speed", s.speed], ["上坡力氣", "Hill power", s.hill], ["彎道抓地", "Curve grip", s.grip], ["安全", "Safety", s.safe]];
  el.innerHTML = "<b>" + bi("你的車", "Your car") + "</b>" + rows.map(function (r) {
    var v = Math.max(0.04, Math.min(1, r[2]));
    return "<div class='stat" + (v < 0.3 ? " warn" : "") + "'><span>" + bi(r[0], r[1]) + "</span><span class='bar'><i style='width:" + (v * 100).toFixed(0) + "%'></i></span></div>";
  }).join("");
}
function pickHTML(p, b, chosen) {
  return "<div class='picks'><div class='lbl'>" + bi(p.zh, p.en) + "</div><div class='opts'>" + p.opts.map(function (o) {
    return "<button class='opt" + (chosen && b[p.key] === o.v ? " sel" : "") + "' data-k='" + p.key + "' data-v='" + o.v + "'>" + bi(o.zh, o.en) + "<small>" + zh(o.d[0]) + "<br>" + esc(o.d[1]) + "</small></button>";
  }).join("") + "</div></div>";
}
function gearSVG(teeth, r) {
  var d = "", n = teeth * 2;
  for (var i = 0; i < n; i++) {
    var a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, rr = i % 2 ? r : r + 7;
    d += (i ? "L" : "M") + (Math.cos(a0) * rr).toFixed(1) + " " + (Math.sin(a0) * rr).toFixed(1) + "L" + (Math.cos(a1) * rr).toFixed(1) + " " + (Math.sin(a1) * rr).toFixed(1);
  }
  return d + "Z";
}

var Garage = {
  start: function (step, done) { this.step = step; this.done = done; show("sGarage"); this.render(); },
  slots: function () {
    var st = this.step;
    $("#slots").innerHTML = PARTS.map(function (p, i) { return "<div class='slot" + (i < st ? " in" : i === st ? " cur" : "") + "' title='" + p.en + "'>" + (i < st ? "<img src='" + A(p.img) + "' alt=''>" : "") + "</div>"; }).join("");
    renderStats($("#stats"), G.kd.build);
  },
  render: function () {
    var p = PARTS[this.step], k = G.kd, self = this;
    this.picked = !p.pick; this.demoOk = p.demo !== "circuit";
    $("#gStep").textContent = (this.step + 1) + " / " + PARTS.length;
    $("#gTitle").innerHTML = bi("組裝你的四驅車", "Build your Mini 4WD");
    this.slots();
    var c = $("#gCard");
    c.innerHTML = "<div class='top'><img class='pimg' src='" + A(p.img) + "' alt=''><h2>" + bi(p.zh, p.en) + "</h2></div>" +
      "<div class='box what'><span class='lab'>🔧</span><span class='txt'>" + bi(p.what[0], p.what[1]) + "</span><button class='say' data-r='what'>🔊</button></div>" +
      "<div class='box sci'><span class='lab'>🔬</span><span class='txt'>" + bi(p.sci[0], p.sci[1]) + "</span><button class='say' data-r='sci'>🔊</button></div>" +
      (p.demo ? "<div class='demo' id='demo'></div>" : "") +
      (p.pick ? pickHTML(p.pick, k.build, false) : "") +
      "<div class='act'><button class='btn blue' id='gInstall'>🔧 " + bi("裝上去", "Install") + " ▶</button></div>";
    $$(".say", c).forEach(function (b) { b.onclick = function () { var t = p[b.dataset.r]; Read.pair(t[0], t[1]); }; });
    $$(".opt", c).forEach(function (b) {
      b.onclick = function () {
        sfx("pop"); k.build[b.dataset.k] = b.dataset.v; self.picked = true; save();
        $$(".opt", c).forEach(function (o) { o.classList.toggle("sel", o === b); });
        renderStats($("#stats"), k.build); if (self.onPick) self.onPick(b.dataset.v); self.gate();
      };
    });
    $("#gInstall").onclick = function () { sfx("tap"); Read.stop(); self.quiz(); };
    this.onPick = null;
    if (p.demo) Demos[p.demo]($("#demo"), this);
    this.gate();
    $("#sGarage .gwrap").scrollTop = 0;
    Read.pair(p.what[0], p.what[1]);
  },
  gate: function () { var b = $("#gInstall"); if (b) b.disabled = !(this.picked && this.demoOk); },
  quiz: function () {
    var p = PARTS[this.step], q = p.q, k = G.kd, self = this, tries = 0;
    var ans = shuffle(q.a.map(function (a, i) { return { a: a, ok: i === 0 }; }));
    $("#gCard").innerHTML = "<div class='top'><img class='pimg' src='" + A(p.img) + "' alt=''><h2>" + bi("科學問題", "Science question") + "</h2></div>" +
      "<div class='quiz'><div class='qq'>" + bi(q.zh, q.en) + " <button class='say' id='qSay'>🔊</button></div><div class='ans'>" +
      ans.map(function (x, i) { return "<button class='btn' data-i='" + i + "'>" + bi(x.a[0], x.a[1]) + "</button>"; }).join("") +
      "</div><div class='fb' id='qFb'></div><div class='act' id='qAct'></div></div>";
    $("#qSay").onclick = function () { Read.pair(q.zh, q.en); };
    Read.pair(q.zh, q.en);
    $$(".ans .btn", $("#gCard")).forEach(function (b) {
      b.onclick = function () {
        var x = ans[+b.dataset.i]; tries++;
        if (x.ok) {
          b.classList.add("ok"); sfx("ding");
          var pts = KAKit.score(tries);
          if (!k.quizDone[p.id]) { k.points = (k.points || 0) + pts; k.quizDone[p.id] = pts; }
          self.after(tries === 1 ? ["答對了！⭐⭐", "Correct! ⭐⭐"] : ["答對了！⭐", "Correct! ⭐"], q.why);
        } else {
          b.classList.add("no"); b.disabled = true; sfx("buzz");
          if (tries >= 2) {
            $$(".ans .btn", $("#gCard")).forEach(function (o) { if (ans[+o.dataset.i].ok) o.classList.add("ok"); });
            if (!k.quizDone[p.id]) k.quizDone[p.id] = -1;
            self.after(["正確答案在這裡：", "Here's the right answer:"], q.why);
          } else { $("#qFb").innerHTML = bi("再試一次！", "Try again!"); Read.pair("再試一次！", "Try again!"); }
        }
      };
    });
  },
  after: function (head, why) {
    var self = this;
    $$(".ans .btn", $("#gCard")).forEach(function (o) { o.disabled = true; });
    $("#qFb").innerHTML = bi(head[0], head[1]) + "<div class='tip'>" + bi(why[0], why[1]) + "</div>";
    Read.pair(head[0] + why[0], head[1] + " " + why[1]);
    var last = this.step === PARTS.length - 1;
    $("#qAct").innerHTML = "<button class='btn blue' id='qNext'>" + (last ? bi("車子組好了！", "Car complete!") : bi("下一個零件", "Next part")) + " ▶</button>";
    $("#qNext").onclick = function () {
      if (this.disabled) return; this.disabled = true; Read.stop(); sfx("pop"); self.step++; G.kd.step = self.step; save();
      if (self.step >= PARTS.length) { self.slots(); sfx("win"); setTimeout(self.done, 400); } else self.render();
    };
  }
};

/* ---------- little science demos ---------- */
var Demos = {
  motor: function (el) {
    el.innerHTML = "<img class='motorimg' src='" + A("x_motor") + "' alt=''>" +
      "<svg viewBox='0 0 120 120' width='110'><circle cx='60' cy='60' r='50' fill='#fff' stroke='#111' stroke-width='3'/><g class='spin' id='mRot' style='animation-play-state:paused;animation-duration:.4s'><rect x='52' y='14' width='16' height='92' rx='6' fill='#e03131' stroke='#111' stroke-width='2'/><text x='60' y='30' text-anchor='middle' font-size='14' font-weight='900' fill='#fff'>N</text><text x='60' y='100' text-anchor='middle' font-size='14' font-weight='900' fill='#fff'>S</text></g></svg>" +
      "<button class='btn' id='mGo'>⚡ " + bi("通電", "Power on") + "</button>";
    var on = false;
    $("#mGo").onclick = function () {
      on = !on; $(".motorimg", el).classList.toggle("go", on); $("#mRot").style.animationPlayState = on ? "running" : "paused";
      if (on) { beep(220, 0.25); beep(330, 0.4); }
    };
  },
  circuit: function (el, g) {
    el.innerHTML = "<svg viewBox='0 0 320 170' width='320'>" +
      "<path d='M60 50 V20 H130' stroke='#111' stroke-width='5' fill='none'/><path d='M190 20 H260 V50' stroke='#111' stroke-width='5' fill='none'/><path d='M60 120 V150 H260 V120' stroke='#111' stroke-width='5' fill='none'/>" +
      "<path id='cFlow' d='M60 50 V20 H260 V50 M260 120 V150 H60 V120' stroke='#ffd43b' stroke-width='4' fill='none' class='flow' style='display:none'/>" +
      "<rect x='35' y='50' width='50' height='70' rx='8' fill='#1c7ed6' stroke='#111' stroke-width='3'/><text x='60' y='92' text-anchor='middle' font-size='26'>⚡</text><text x='60' y='46' text-anchor='middle' font-size='14' font-weight='900'>+</text>" +
      "<circle cx='260' cy='85' r='34' fill='#dee2e6' stroke='#111' stroke-width='3'/><g class='spin' id='cFan' style='animation-play-state:paused;animation-duration:.35s'><path d='M260 85 L260 58 L270 62 Z M260 85 L287 85 L283 95 Z M260 85 L260 112 L250 108 Z M260 85 L233 85 L237 75 Z' fill='#e03131' stroke='#111' stroke-width='2'/></g>" +
      "<circle cx='130' cy='20' r='6' fill='#111'/><circle cx='190' cy='20' r='6' fill='#111'/>" +
      "<line id='cSw' x1='130' y1='20' x2='182' y2='-8' stroke='#f76707' stroke-width='8' stroke-linecap='round' style='transition:all .25s'/>" +
      "<rect x='110' y='-14' width='100' height='60' fill='transparent' id='cHit' style='cursor:pointer'/></svg>" +
      "<div id='cTxt' style='min-width:200px'>" + bi("點橘色開關，把電路接起來！", "Tap the orange switch to close the circuit!") + "</div>";
    var svg = $("svg", el); svg.setAttribute("style", "overflow:visible");
    var closed = false;
    function flip() {
      closed = !closed; var sw = $("#cSw");
      sw.setAttribute("x2", closed ? 190 : 182); sw.setAttribute("y2", closed ? 20 : -8);
      $("#cFlow").style.display = closed ? "" : "none"; $("#cFan").style.animationPlayState = closed ? "running" : "paused";
      $("#cTxt").innerHTML = closed ? bi("電路接通了！電流流動，馬達轉起來了！", "The circuit is closed! Current flows and the motor spins!") : bi("電路斷掉了，馬達停了。", "The circuit is broken. The motor stops.");
      sfx(closed ? "ding" : "tap");
      if (closed) { g.demoOk = true; g.gate(); }
    }
    $("#cHit").onclick = flip; $("#cSw").onclick = flip;
    g.flipCircuit = function () { if (!closed) flip(); };
  },
  gears: function (el, g) {
    function draw(v) {
      var power = v === "power", big = power ? 22 : 14, small = 9, ratio = big / small, R = big * 3, r = small * 3;
      el.innerHTML = "<svg viewBox='0 0 260 150' width='280'><g transform='translate(" + (70) + ",75)'><path class='spin' style='animation-duration:1s' d='" + gearSVG(small, r) + "' fill='#ffd43b' stroke='#111' stroke-width='2'/><circle r='4' fill='#111'/></g>" +
        "<g transform='translate(" + (70 + r + R + 7) + ",75)'><path class='spin rev' style='animation-duration:" + ratio + "s' d='" + gearSVG(big, R) + "' fill='" + (power ? "#e03131" : "#1c7ed6") + "' stroke='#111' stroke-width='2'/><circle r='5' fill='#111'/><rect x='-3' y='-" + R + "' width='6' height='" + (R - 6) + "' fill='#fff' class='spin rev' style='animation-duration:" + ratio + "s;transform-origin:3px " + R + "px'/></g></svg>" +
        "<div style='min-width:180px'>" + (power ? bi("小帶大：慢慢轉，力氣大！", "Small turns big: slow and strong!") : bi("大小差不多：轉很快，力氣小。", "Close in size: fast but weaker.")) + "<br><small>" + bi("黃色是馬達的齒輪", "Yellow = the motor's gear") + "</small></div>";
    }
    draw(G.kd.build.gear); g.onPick = draw;
  },
  tires: function (el) {
    el.innerHTML = "<div style='display:flex;gap:16px;flex-wrap:wrap;justify-content:center'>" +
      ["hard", "soft"].map(function (t) {
        return "<div style='text-align:center'><svg viewBox='0 0 160 110' width='150'><polygon points='5,100 155,100 155,30' fill='" + (t === "hard" ? "#c5f6fa" : "#d8f5a2") + "' stroke='#111' stroke-width='3'/>" +
          "<g id='tr_" + t + "' style='transition:transform 1.4s ease-in'><g transform='translate(128,26) rotate(-25)'><circle r='14' fill='" + (t === "hard" ? "#adb5bd" : "#212529") + "' stroke='#111' stroke-width='3'/><circle r='5' fill='#1c7ed6'/></g></g></svg><br>" +
          (t === "hard" ? bi("硬塑膠", "Hard plastic") : bi("軟橡膠", "Soft rubber")) + "</div>";
      }).join("") + "</div><button class='btn' id='tGo'>▶ " + bi("放在斜坡上", "Put on the ramp") + "</button>";
    $("#tGo").onclick = function () {
      sfx("tap");
      $("#tr_hard").style.transform = "translate(0,0)"; $("#tr_soft").style.transform = "translate(0,0)";
      setTimeout(function () { $("#tr_hard").style.transform = "translate(-104px,48px)"; $("#tr_soft").style.transform = "translate(-10px,5px)"; }, 60);
    };
  },
  rollers: function (el, g) {
    el.innerHTML = "<canvas id='rCv' width='300' height='190' style='width:300px'></canvas><div style='min-width:180px'><div id='rTxt'>" + bi("按測試，看看車子怎麼轉彎。", "Press Test to see how the car turns.") + "</div><div class='act' style='justify-content:flex-start'>" +
      "<button class='btn' id='rTog'></button><button class='btn blue' id='rGo'>▶ " + bi("測試", "Test") + "</button></div></div>";
    var cv = $("#rCv"), x = cv.getContext("2d"), img = new Image(), withR = G.kd.build.roller === "yes", raf = 0;
    img.src = A("c_blue");
    function lab() { $("#rTog").innerHTML = withR ? "✅ " + bi("有導輪", "Rollers on") : "❌ " + bi("沒導輪", "No rollers"); }
    function scene(cx, cy, ang, msg) {
      x.clearRect(0, 0, 300, 190); x.fillStyle = "#2b8a3e"; x.fillRect(0, 0, 300, 190);
      x.lineWidth = 34; x.strokeStyle = "#dee2e6"; x.beginPath(); x.moveTo(0, 150); x.lineTo(150, 150); x.arc(150, 70, 80, Math.PI / 2, 0, true); x.lineTo(230, 0); x.stroke();
      x.lineWidth = 4; x.strokeStyle = "#e03131"; x.beginPath(); x.moveTo(0, 167); x.lineTo(150, 167); x.arc(150, 70, 97, Math.PI / 2, 0, true); x.lineTo(247, 0); x.stroke();
      if (cx != null) { x.save(); x.translate(cx, cy); x.rotate(ang + Math.PI / 2); x.drawImage(img, -10, -15, 20, 30); x.restore(); }
      if (msg) { x.font = "900 28px system-ui"; x.fillStyle = "#ffd43b"; x.strokeStyle = "#111"; x.lineWidth = 5; x.strokeText(msg, 160, 110); x.fillText(msg, 160, 110); }
    }
    scene(20, 150, 0);
    function run() {
      cancelAnimationFrame(raf); var t = 0, crashed = false, px = 0, py = 0, pa = 0;
      (function f() {
        t += 1 / 60; var s = t * 160;
        if (s < 150) { px = s; py = 150; pa = 0; }
        else if (withR) { var a = Math.min(Math.PI / 2, (s - 150) / 80); px = 150 + Math.sin(a) * 80; py = 70 + Math.cos(a) * 80; pa = -a; if (a >= Math.PI / 2) { py = 70 - (s - 150 - 80 * Math.PI / 2); px = 230; } }
        else { crashed = true; px = s; py = 150 - (s - 150) * 0.15; pa = (s - 150) / 20; }
        scene(px, py, pa, crashed && s > 220 ? "脫軌!" : "");
        if (s < 420) raf = requestAnimationFrame(f);
        else $("#rTxt").innerHTML = withR ? bi("導輪靠著牆滾，車子乖乖轉彎了！", "The rollers roll along the wall, and the car turns!") : bi("沒有導輪，車子照慣性直直衝出去了！", "No rollers: inertia sends the car straight off the track!");
        if (crashed && s > 160 && s < 168) sfx("buzz");
      })();
    }
    lab();
    $("#rTog").onclick = function () { withR = !withR; lab(); sfx("tap"); };
    $("#rGo").onclick = run;
  },
  air: function (el, g) {
    function draw(v) {
      var sleek = v !== "boxy";
      el.innerHTML = "<svg viewBox='0 0 260 110' width='280'>" +
        [25, 45, 65, 85].map(function (y, i) { return "<path class='flow' d='M0 " + y + (sleek ? " C100 " + y + " 120 " + (y < 55 ? y - 15 : y + 12) + " 260 " + y : " H95 " + (y < 55 ? "q12 -14 0 -22" : "q12 14 0 22")) + "' stroke='#4dabf7' stroke-width='3' fill='none' style='animation-duration:" + (sleek ? .5 : 1.2) + "s'/>"; }).join("") +
        (sleek ? "<path d='M100 75 L200 75 L220 60 L150 40 Z' fill='#1c7ed6' stroke='#111' stroke-width='3'/>" : "<rect x='100' y='35' width='90' height='42' rx='4' fill='#868e96' stroke='#111' stroke-width='3'/>") +
        "<circle cx='125' cy='80' r='10' fill='#111'/><circle cx='185' cy='80' r='10' fill='#111'/></svg><div style='min-width:160px'>" +
        (sleek ? bi("空氣順順地滑過去。", "Air slides smoothly past.") : bi("空氣撞到車子，往後推！", "Air crashes into the car and pushes back!")) + "</div>";
    }
    draw(G.kd.build.body); g.onPick = draw;
  }
};

/* ---------- tune screen: change choices any time, see the stats move ---------- */
var Tune = {
  open: function (done, label) {
    show("sTune");
    $("#tTitle").innerHTML = bi("調整你的車", "Tune your car");
    var k = G.kd, picks = PARTS.filter(function (p) { return p.pick; });
    $("#tCard").innerHTML = picks.map(function (p) { return "<div style='display:flex;gap:10px;align-items:center'><img src='" + A(p.img) + "' alt='' style='width:54px;height:54px;object-fit:contain'>" + pickHTML(p.pick, k.build, true).replace("class='picks'", "class='picks' style='flex:1'") + "</div>"; }).join("") +
      "<div class='act'><button class='btn red' id='tGo'>🏁 " + bi(label ? label[0] : "去比賽", label ? label[1] : "Race!") + " ▶</button></div>";
    renderStats($("#tStats"), k.build);
    $$(".opt", $("#tCard")).forEach(function (b) {
      b.onclick = function () {
        sfx("pop"); k.build[b.dataset.k] = b.dataset.v; save();
        $$(".opt[data-k='" + b.dataset.k + "']", $("#tCard")).forEach(function (o) { o.classList.toggle("sel", o === b); });
        renderStats($("#tStats"), k.build);
      };
    });
    $("#tGo").onclick = function () { sfx("tap"); done(); };
    $("#sTune .gwrap").scrollTop = 0;
  }
};
