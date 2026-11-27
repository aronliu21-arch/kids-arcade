/* ===== Chapter 2 data: parts store, money, school, job, cups, events (all bilingual) ===== */
/* Money is NT$. Real Taiwan hobby-shop prices; a job shift pays NT$100-150, so a good motor takes ~3 shifts. */
var C2 = {
  START_MONEY: 800,       // red-envelope (紅包) savings
  ALLOWANCE: 100,         // from Dad every Sunday, if the week's test got an A
  SHOP_TESTS: 3,          // test runs per store visit
  TOOLBOX: 3,             // spare parts he can bring to a cup
  // the starter kit: chassis + stock parts (needed before anything else)
  KIT: { id: "kit", price: 480, zh: "入門底盤套件", en: "Starter chassis kit", build: { motor: "normal", gear: "speed", tire: "hard", roller: "no", body: "boxy", wing: "none" } },
  SLOTS: [["body", "車殼", "Body"], ["motor", "馬達", "Motor"], ["gear", "齒輪", "Gears"], ["tire", "輪胎", "Tires"], ["roller", "滾輪", "Rollers"], ["wing", "尾翼", "Wing"]],
  PARTS: {
    body: [
      { v: "boxy", price: 0, zh: "方塊車殼", en: "Box body", d: ["套件附的，比較擋風。", "Comes in the kit. Catches more wind."] },
      { v: "sleek", price: 320, zh: "閃電車殼", en: "Arrow body", d: ["流線型，風阻比較小，跑比較快。", "Smooth shape, less wind, a bit faster."] },
      { v: "aero", price: 560, zh: "噴射車殼", en: "Jet body", d: ["最低最尖，風阻最小。", "Lowest and pointiest. Least wind."] }],
    motor: [
      { v: "normal", price: 0, zh: "普通馬達", en: "Stock motor", d: ["套件附的，速度普通。", "Comes in the kit. Normal speed."] },
      { v: "turbo", price: 380, zh: "高速馬達", en: "Turbo motor", d: ["轉得快，直線很快。", "Spins fast. Great on straights."] },
      { v: "torque", price: 420, zh: "扭力馬達", en: "Torque motor", d: ["力氣大，爬坡最強。", "Strong push. Best on hills."] },
      { v: "hyper", price: 650, zh: "超級馬達", en: "Hyper motor", d: ["最快，可是爬坡比較沒力。", "Fastest, but weaker on hills."] }],
    gear: [
      { v: "speed", price: 0, zh: "高速齒輪", en: "Speed gears", d: ["套件附的，直線快，爬坡慢。", "Comes in the kit. Fast, weak on hills."] },
      { v: "power", price: 150, zh: "力量齒輪", en: "Power gears", d: ["比較慢，可是很有力氣。", "Slower, but strong."] },
      { v: "mid", price: 180, zh: "中速齒輪", en: "Middle gears", d: ["速度和力氣都中等。", "A bit of both."] }],
    tire: [
      { v: "hard", price: 0, zh: "硬輪胎", en: "Hard tires", d: ["套件附的，容易滑。", "Comes in the kit. Slippery."] },
      { v: "soft", price: 160, zh: "軟輪胎", en: "Soft tires", d: ["抓地力好，過彎穩。", "Good grip in curves."] },
      { v: "low", price: 220, zh: "低摩擦輪胎", en: "Low-friction tires", d: ["直線滾得快，抓地力中等。", "Roll fast on straights, medium grip."] }],
    roller: [
      { v: "no", price: 0, zh: "沒有滾輪", en: "No rollers", d: ["過彎太快會飛出去！", "Too fast in a curve and it flies off!"] },
      { v: "yes", price: 140, zh: "兩個滾輪", en: "2 rollers", d: ["靠著牆滑過彎道。", "Slides along the wall in curves."] },
      { v: "four", price: 260, zh: "四個滾輪", en: "4 rollers", d: ["前後都有，彎道最穩，有一點重。", "Front and back. Steadiest, a little heavy."] }],
    wing: [
      { v: "none", price: 0, zh: "沒有尾翼", en: "No wing", d: ["比較輕。", "Lighter."] },
      { v: "small", price: 150, zh: "小尾翼", en: "Small wing", d: ["風把車子往下壓，過彎穩一點。", "Wind pushes the car down. A bit steadier."] },
      { v: "big", price: 280, zh: "大尾翼", en: "Big wing", d: ["彎道很穩，直線慢一點點。", "Very steady in curves, slightly slower."] }]
  },
  // school week 1 (Mon-Thu lessons, Fri test). Each question: [zh, en], answers [[zh,en]...], c = right index, why [zh,en]
  LESSONS: [
    { day: 0, sub: ["自然", "Science"], ic: "🔬", title: ["摩擦力和輪胎", "Friction and tires"],
      cards: [["摩擦力就是兩個東西互相摩擦，會讓東西慢下來。", "Friction is when two things rub. It slows things down."],
        ["軟輪胎摩擦力大，抓地好，彎道不容易滑。", "Soft tires have more friction. They grip in curves."],
        ["硬輪胎摩擦力小，比較會滑。", "Hard tires have less friction. They slide more."]],
      quiz: [
        { id: "s1", q: ["哪一種輪胎過彎比較穩？", "Which tires are steadier in curves?"], a: [["軟輪胎", "Soft tires"], ["硬輪胎", "Hard tires"]], c: 0, why: ["軟輪胎摩擦力大，抓得住。", "Soft tires have more friction, so they grip."] },
        { id: "s2", q: ["在冰上走路很滑，是因為摩擦力…", "Ice is slippery because friction is…"], a: [["很小", "small"], ["很大", "big"]], c: 0, why: ["冰很平很滑，摩擦力很小。", "Ice is smooth, so friction is small."] },
        { id: "s3", q: ["摩擦力會讓車子…", "Friction makes a car…"], a: [["慢下來", "slow down"], ["變重", "heavier"], ["變色", "change color"]], c: 0, why: ["摩擦力會擋住東西的移動。", "Friction pushes against moving things."] }] },
    { day: 1, sub: ["數學", "Math"], ic: "🔢", title: ["零件要多少錢？", "How much do parts cost?"],
      cards: [["軟輪胎 160 元，兩個滾輪 140 元。", "Soft tires are NT$160. 2 rollers are NT$140."],
        ["一起買：160 + 140 = 300 元。", "Both together: 160 + 140 = NT$300."],
        ["付 500 元，找回 500 − 300 = 200 元。", "Pay NT$500, get back 500 − 300 = NT$200 change."]],
      quiz: [
        { id: "m1", q: ["小尾翼 150 元，加力量齒輪 150 元，一共多少？", "Small wing NT$150 + power gears NT$150 = ?"], a: [["300 元", "NT$300"], ["250 元", "NT$250"], ["350 元", "NT$350"]], c: 0, why: ["150 + 150 = 300。", "150 + 150 = 300."] },
        { id: "m2", q: ["有 500 元，買 380 元的高速馬達，還剩多少？", "You have NT$500 and buy the NT$380 turbo motor. What's left?"], a: [["120 元", "NT$120"], ["220 元", "NT$220"], ["180 元", "NT$180"]], c: 0, why: ["500 − 380 = 120。", "500 − 380 = 120."] },
        { id: "m3", q: ["一天打工賺 100 元，打工 4 天賺多少？", "A shift pays NT$100. How much for 4 shifts?"], a: [["400 元", "NT$400"], ["104 元", "NT$104"], ["40 元", "NT$40"]], c: 0, why: ["100 × 4 = 400。", "100 × 4 = 400."] }] },
    { day: 2, sub: ["英文", "English"], ic: "🔤", title: ["零件的英文", "Part words in English"],
      cards: [["motor 馬達，讓車子跑。", "motor: makes the car go."],
        ["battery 電池，給馬達電。", "battery: gives the motor power."],
        ["wheel 輪子，tire 輪胎，gear 齒輪。", "wheel, tire, gear."]],
      quiz: [
        { id: "e1", q: ["「電池」的英文是？", "Which word means 電池?"], a: [["battery", "battery"], ["butter", "butter"], ["motor", "motor"]], c: 0, why: ["battery 給馬達電。", "A battery gives power."] },
        { id: "e2", q: ["The motor makes the car ___.", "The motor makes the car ___."], a: [["go", "go"], ["sleep", "sleep"], ["eat", "eat"]], c: 0, why: ["馬達讓車子跑。", "The motor makes it go."] },
        { id: "e3", q: ["哪一個是 gear？", "Which one is a gear?"], a: [["⚙️", "⚙️"], ["🔋", "🔋"], ["🛞", "🛞"]], c: 0, why: ["⚙️ 有齒的輪子就是齒輪 gear。", "⚙️ A wheel with teeth is a gear."] }] },
    { day: 3, sub: ["國語", "Chinese"], ic: "🀄", title: ["零件的國字", "Part words in Chinese"],
      cards: [["馬達：讓車子跑的東西。", "馬達 means motor."], ["電池：給馬達電。", "電池 means battery."], ["齒輪、輪胎、滾輪，都有「輪」字。", "齒輪, 輪胎 and 滾輪 all have 輪 (wheel)."]],
      quiz: [
        { id: "c1", q: ["哪一個是「馬達」？", "Which one is the motor (馬達)?"], a: [["馬達", "馬達"], ["電池", "電池"], ["輪胎", "輪胎"]], c: 0, why: ["馬達讓車子跑。", "馬達 is the motor."] },
        { id: "c2", q: ["「輪胎」的「輪」，下面哪個詞也有？", "Which word also has 輪?"], a: [["齒輪", "齒輪"], ["電池", "電池"], ["車殼", "車殼"]], c: 0, why: ["齒輪也有「輪」。", "齒輪 has 輪 too."] },
        { id: "c3", q: ["給馬達電的是？", "What gives the motor power?"], a: [["電池", "電池"], ["尾翼", "尾翼"], ["車殼", "車殼"]], c: 0, why: ["電池有電。", "The battery has the power."] }] }
  ],
  TEST_EXTRA: [
    { id: "t1", q: ["上坡要用哪一種齒輪？", "Which gears are best for hills?"], a: [["力量齒輪", "Power gears"], ["高速齒輪", "Speed gears"]], c: 0, why: ["力量齒輪力氣大，爬得上去。", "Power gears push harder up hills."] },
    { id: "t2", q: ["200 + 160 + 140 = ?", "200 + 160 + 140 = ?"], a: [["500", "500"], ["400", "400"], ["460", "460"]], c: 0, why: ["200 + 160 = 360，360 + 140 = 500。", "200 + 160 = 360, 360 + 140 = 500."] }
  ],
  A_LINE: 0.9, // A = 90% of points (first try 2, second try 1)
  // jobs: 5 options; the thin version opens the noodle shop
  JOBS: [
    { id: "noodle", ic: "🍜", zh: "麵店幫忙", en: "Noodle shop", pay: 100, open: true },
    { id: "deliver", ic: "📦", zh: "送貨", en: "Delivery", pay: 120, open: false },
    { id: "bank", ic: "🏦", zh: "銀行數錢", en: "Bank helper", pay: 120, open: false },
    { id: "wash", ic: "🧽", zh: "洗車", en: "Car wash", pay: 110, open: false },
    { id: "books", ic: "📚", zh: "書店整理", en: "Bookstore", pay: 100, open: false }],
  MENU: [{ id: "beef", ic: "🍜", zh: "牛肉麵", en: "Beef noodles", p: 120 }, { id: "dump", ic: "🥟", zh: "水餃", en: "Dumplings", p: 60 }, { id: "tea", ic: "🧋", zh: "珍珠奶茶", en: "Bubble tea", p: 50 }, { id: "side", ic: "🥒", zh: "小菜", en: "Side dish", p: 30 }],
  TIP: 10, // per perfect customer
  // rivals (boys only in Lucas's game), team colors
  KIDS: {
    kai: { col: "green" }, benny: { col: "yellow" }, rex: { col: "red" }
  },
  // cups: week, track, rivals, entry fee, prizes. Rivals get a small random luck each race, so nobody always wins.
  CUPS: [
    { id: "c1", week: 1, track: "oval", zh: "社區盃", en: "Neighborhood Cup", tier: 1, fee: 100, laps: 3,
      rivals: [{ who: "kai", build: { motor: "turbo", gear: "speed", tire: "soft", roller: "yes", body: "boxy", wing: "none" } },
        { who: "benny", build: { motor: "turbo", gear: "mid", tire: "low", roller: "yes", body: "sleek", wing: "none" } }],
      prize: [500, 300, 200], trophy: ["🥇", "🥈", "🥉"] },
    { id: "c2", week: 2, track: "twisty", zh: "城市盃", en: "City Cup", tier: 2, fee: 150, soon: true },
    { id: "c3", week: 3, track: "hills", zh: "山區盃", en: "Mountain Cup", tier: 3, fee: 200, soon: true },
    { id: "c4", week: 5, track: "oval", zh: "全國大賽", en: "National Championship", tier: 4, fee: 300, soon: true },
    { id: "c5", week: 8, track: "twisty", zh: "世界大賽", en: "World Series", tier: 5, fee: 500, soon: true }],
  // mystery gifts: everyone who races gets one
  GIFTS: [
    { t: "money", n: 50, zh: "紅包 50 元", en: "Red envelope: NT$50" },
    { t: "sticker", zh: "閃亮星星貼紙", en: "Shiny star sticker" },
    { t: "part", slot: "roller", v: "yes", zh: "兩個滾輪", en: "2 rollers" },
    { t: "part", slot: "wing", v: "small", zh: "小尾翼", en: "Small wing" },
    { t: "money", n: 80, zh: "紅包 80 元", en: "Red envelope: NT$80" }],
  // surprise events in the store
  EVENTS: [
    { id: "sticker", who: "benny", once: true, zh: "陸晨！我多一張閃亮星星貼紙，送給你！", en: "Lucas! I have an extra shiny star sticker. It's yours!", gift: { t: "sticker" } },
    { id: "quiz", who: "max", zh: "考考你：車子一直在彎道飛出去，要裝什麼？答對送你 50 元折價券！", en: "Quiz time: a car keeps flying off in curves. What should it get? Get it right for a NT$50 coupon!",
      q: { a: [["滾輪", "Rollers"], ["更大的電池", "A bigger battery"], ["貼紙", "A sticker"]], c: 0, why: ["滾輪靠著牆，車子就不會飛出去。", "Rollers slide on the wall so the car stays on."] }, gift: { t: "money", n: 50 } },
    { id: "tip", who: "kai", zh: "聽說星期六的社區盃是長長的直線跑道，要跑得快喔！", en: "I heard Saturday's Neighborhood Cup has long straights. Speed matters!" },
    { id: "trade", who: "kai", once: true, zh: "我換了新輪胎，舊的軟輪胎送你吧！", en: "I got new tires. Have my old soft tires!", gift: { t: "part", slot: "tire", v: "soft" } }],
  DAYS: [["星期一", "Monday"], ["星期二", "Tuesday"], ["星期三", "Wednesday"], ["星期四", "Thursday"], ["星期五", "Friday"], ["星期六", "Saturday"], ["星期日", "Sunday"]],
  SLOTNAMES: [["早上", "Morning", "🌅"], ["下午", "Afternoon", "☀️"], ["晚上", "Evening", "🌙"]]
};
CAST.teacher = { zh: "王老師", en: "Mr. Wang", img: "", ic: "👨‍🏫", col: "#5c940d", pitch: 0.9 };
CAST.dad = { zh: "爸爸", en: "Dad", img: "", ic: "👨", col: "#1864ab", pitch: 0.85 };
CAST.boss = { zh: "麵店老闆", en: "Noodle boss", img: "", ic: "👨‍🍳", col: "#e8590c", pitch: 0.85 };

SCENES.c2intro = { bg: "bg_shop", lines: [
  ["max", "陸晨！上次的比賽好精彩。這次你要從頭做一台自己的車！", "Lucas! Last race was amazing. This time you'll build your own car from scratch!"],
  ["lucas", "真的嗎？我要做最快的車！", "Really? I'll build the fastest car!"],
  ["max", "零件要用你自己賺的錢買。去打工、去學校，週末還有比賽。", "You buy parts with money you earn. Work, go to school, and race on weekends."],
  ["max", "每條跑道都不一樣：直線、急彎、大坡。想一想哪種車適合哪條跑道！", "Every track is different: straights, tight curves, big hills. Think about which car fits which track!"],
  ["lucas", "爸爸說，考試拿 A 才能去比賽。我會努力的！", "Dad says I need an A on my test to race. I'll work hard!"],
  ["narr", "陸晨存了 800 元紅包錢。第二章開始！", "Lucas has NT$800 of red-envelope savings. Chapter 2 begins!"]] };
