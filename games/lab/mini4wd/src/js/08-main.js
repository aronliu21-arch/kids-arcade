/* ===== Boot: title intro, menu, buttons, test hook ===== */
(function () {
  Read.on = !(DB.settings && DB.settings.readOff);
  Race.camMode = (DB.settings && DB.settings.cam) || "auto";
  Read.lang = (DB.settings && DB.settings.lang) || "both"; $("#bLang").textContent = Read.LANGS[Read.lang][0];
  $("#logo2").innerHTML = zh("四驅小隊"); $("#logo3").innerHTML = zh("四驅小隊");
  $("#rotHint").innerHTML = "Turn your phone sideways ↻ " + zh("橫著拿手機");
  $("#bSound").textContent = KAKit.muted() ? "🔇" : "🔊";

  var t = $("#sTitle"), introT = null;
  function toMenu() { clearTimeout(introT); t.classList.remove("play"); t.classList.add("done"); refreshMenu(); show("sMenu"); }
  $("#tapStart").onclick = function (e) {
    e.stopPropagation(); KAKit.ac(); Music.start();
    $("#tapStart").style.display = "none";
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return toMenu();
    t.classList.add("play"); introT = setTimeout(toMenu, 4300);
  };
  t.onclick = function () { if (t.classList.contains("play")) toMenu(); };

  $("#pLucas").onclick = function () {
    sfx("tap"); $("#jump").classList.remove("on"); pickKid("lucas");
    var st = G.kd.stage;
    if (G.kd.ep1) { // Chapter 1 done: pick a chapter
      ovl("<div class='big title-font'>CHAPTER?</div><div class='act'><button class='btn white' id='ch1'>" + bi("第一章：再玩一次", "Chapter 1: play again") + "</button><button class='btn red' id='ch2'>🏁 " + bi("第二章：做自己的車", "Chapter 2: build your own car") + "</button></div>");
      $("#ch1").onclick = function () { closeOvl(); G.kd.stage = "shop"; G.kd.step = 0; go("shop"); };
      $("#ch2").onclick = function () { closeOvl(); go("c2"); };
      return;
    }
    go(st === "done" ? (G.kd.stage = "shop", G.kd.step = 0, "shop") : st || "shop");
  };
  $("#pTester").onclick = function () { sfx("tap"); testerMenu(); };
  $("#bLang").onclick = function () { sfx("tap"); Read.setLang({ both: "zh", zh: "en", en: "both" }[Read.lang]); };
  $("#bVoice").onclick = function () { try { KAVoice.picker(); } catch (e) {} };
  $("#bRead").onclick = function () { Read.on = !Read.on; DB.settings = DB.settings || {}; DB.settings.readOff = !Read.on; DB.save(); if (!Read.on) Read.stop(); refreshMenu(); };
  $("#bReset").onclick = function () {
    KAKit.resetGate({ kids: ["lucas"], onReset: function (list) { list.forEach(function (k) { if (DB.kids) delete DB.kids[k]; }); DB.save(); refreshMenu(); } });
  };
  $("#bHome").onclick = function () { Read.stop(); closeOvl(); Engine.stop(); refreshMenu(); show("sMenu"); };
  $("#bSound").onclick = function () {
    var m = !KAKit.muted(); KAKit.muted(m); $("#bSound").textContent = m ? "🔇" : "🔊";
    if (m) { Music.stop(); Engine.stop(); Read.stop(); } else if (CUR === "sMenu" || CUR === "sTitle") Music.start();
  };
  $("#dNext").onclick = function (e) { e.stopPropagation(); storyNext(); };
  $("#dlg").onclick = storyNext;
  $("#dSay").onclick = function (e) { e.stopPropagation(); var ln = SCENES[Story.key].lines[Story.i]; Read.pair(ln[1], ln[2], CAST[ln[0]].pitch); };
  $("#camBtn").onclick = function () { sfx("tap"); Race.camMode = { auto: "chase", chase: "iso", iso: "auto" }[Race.camMode]; DB.settings = DB.settings || {}; DB.settings.cam = Race.camMode; DB.save(); Race.camLabel(); Race.camT = -9; var c = Race.CAMS[Race.camMode]; Read.pair(c[1], c[2]); };
  $("#cheer").onclick = function () {
    sfx("pop"); var c = Race.cars && Race.cars[0];
    if (c) { var p = Race.pos(c); Race.fx.push({ x: p.x, y: p.y - 2, vx: 0, vy: -6, life: 0.6 }); }
    var lines = [["衝啊！藍色閃電！", "Go, Blue Bolt!"], ["加油！加油！", "Go, go, go!"], ["相信你的車！", "Trust your car!"]];
    Race.tick(lines[Math.random() * lines.length | 0]);
  };
  addEventListener("resize", function () { if (CUR === "sRace") { Race.resize(); Race.draw(); } });
  ["p_lucas", "p_max", "p_kai", "bg_shop"].forEach(function (n) { new Image().src = A(n); });
})();

/* Expose for automated playtests. Harmless for players. */
window.__test = {
  state: function () { return { screen: CUR, stage: G.kd && G.kd.stage, step: Garage.step, ovl: $("#ovl").classList.contains("on"), points: G.kd && G.kd.points, done: !!(G.kd && G.kd.ep1) }; },
  solve: function () {
    if ($("#ovl").classList.contains("on")) { var b = $("#ovlCard .act .btn:last-child"); if ($("#aRace") && (G.kd.build.roller === "no")) b = $("#aTune") || b; (b || $("#ovlCard .btn")).click(); return; }
    if (CUR === "sTitle") return $("#tapStart").click();
    if (CUR === "sMenu") return $("#pLucas").click();
    if (CUR === "sStory") return storyNext();
    if (CUR === "sTune") { Object.keys(BEST).forEach(function (k) { var o = $("#tCard .opt[data-k='" + k + "'][data-v='" + BEST[k] + "']"); if (o) o.click(); }); return $("#tGo").click(); }
    if (CUR === "sGarage") {
      var nx = $("#qNext"); if (nx) return nx.click();
      var q = $$(".ans .btn", $("#gCard")); if (q.length) { var p = PARTS[Garage.step]; q.forEach(function (bt) { if (bt.textContent.indexOf(p.q.a[0][1]) >= 0) bt.click(); }); return; }
      var p2 = PARTS[Garage.step]; if (p2.pick) { var o2 = $("#gCard .opt[data-v='" + BEST[p2.pick.key] + "']"); if (o2) o2.click(); }
      if (Garage.flipCircuit) { Garage.flipCircuit(); Garage.flipCircuit = null; }
      return $("#gInstall").click();
    }
    if (CUR === "sRace") Race.speed = 8;
  }
};
