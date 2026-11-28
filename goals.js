/* Kids Arcade weekly goals — the one place to change goals for the arcade menu.
   Keep tools/weekly-report/Code.gs GOALS in step (the Sheet/email/Baba side).
   Week 1 = Sat Nov 28 – Sun Dec 6 2026, then Monday–Sunday weeks.
   type "rounds":  finished rounds of one 時間專家 mission at `min` stars or better.
   type "correct": answers right on the first try in any of `games` (tracker game ids). */
window.KA_GOALS = {
  kids: {
    nora: [
      { type: "rounds", url: "games/calendar-quest/", game: "calendar-quest", mission: "clock", topic: "What Time Is It?", n: 4, min: 2 },
      { type: "correct", url: "games/times-tables/", games: ["times-tables", "times-challenge"], n: 40 },
      { type: "correct", url: "games/spelling-bees/", games: ["spelling-bees"], n: 20 },
      { type: "correct", url: "games/kanga-hop/", games: ["kanga-hop"], n: 10 }
    ],
    lucas: [
      { type: "rounds", url: "games/calendar-quest/", game: "calendar-quest", mission: "clock", topic: "What Time Is It?", n: 3, min: 2 },
      { type: "correct", url: "games/spelling-bees/", games: ["spelling-bees"], n: 15 },
      { type: "correct", url: "games/zhuyin/", games: ["zhuyin"], n: 15 }
    ]
  },
  week: function (now) {
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var ymd = function (d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate()), w2 = new Date(2026, 11, 7);
    if (d < w2) return { no: 1, from: "2026-11-28", to: "2026-12-06" };
    var k = Math.floor(Math.round((d - w2) / 864e5) / 7);
    return { no: 2 + k, from: ymd(new Date(2026, 11, 7 + 7 * k)), to: ymd(new Date(2026, 11, 13 + 7 * k)) };
  }
};
