/* ===== Chapter 2 data: parts store, money, school, job, cups, events (all bilingual) ===== */
/* Money is NT$. Real Taiwan hobby-shop prices; a job shift pays NT$100-150, so a good motor takes ~3 shifts. */
/* 20 more bodies (ChatGPT art, top view, assets/b/<id>_<color>.webp). st: v = top speed, c = curve grip, a = push (start + hills). */
var C2BODIES = [
  { v: "muscle", price: 450, zh: "肌肉車", en: "Muscle Car", art: true, st: { v: 1.0, c: 0.98, a: 1.12 }, cols: ["orig", "red", "yellow", "green", "purple"] },
  { v: "armored", price: 400, zh: "裝甲車", en: "Armored Racer", art: true, st: { v: 0.94, c: 1.1, a: 0.97 }, cols: ["orig", "red", "green", "blue", "purple"] },
  { v: "crocodile", price: 460, zh: "鱷魚", en: "Crocodile", art: true, st: { v: 0.99, c: 1.07, a: 1.03 }, cols: ["orig", "red", "yellow", "blue", "purple"] },
  { v: "rhino", price: 480, zh: "犀牛", en: "Rhino", art: true, st: { v: 0.97, c: 1.08, a: 1.08 }, cols: ["orig", "red", "green", "blue", "purple"] },
  { v: "beetle", price: 500, zh: "獨角仙", en: "Beetle", art: true, st: { v: 0.98, c: 1.06, a: 1.1 }, cols: ["orig", "red", "green", "blue", "purple"] },
  { v: "shark", price: 520, zh: "鯊魚", en: "Shark", art: true, st: { v: 1.05, c: 1.02, a: 1.0 }, cols: ["orig", "red", "yellow", "green", "purple"] },
  { v: "lunar_rover", price: 540, zh: "月球車", en: "Lunar Rover", art: true, st: { v: 0.95, c: 1.06, a: 1.15 }, cols: ["orig", "red", "green", "blue", "purple"] },
  { v: "wolf", price: 560, zh: "野狼", en: "Wolf", art: true, st: { v: 1.04, c: 1.03, a: 1.02 }, cols: ["orig", "red", "yellow", "green", "purple"] },
  { v: "tiger", price: 580, zh: "老虎", en: "Tiger", art: true, st: { v: 1.03, c: 1.04, a: 1.04 }, cols: ["orig", "red", "green", "blue", "purple"] },
  { v: "formula", price: 600, zh: "方程式", en: "Formula Racer", art: true, st: { v: 1.06, c: 1.04, a: 1.0 }, cols: ["orig", "yellow", "green", "blue", "purple"] },
  { v: "cobra", price: 600, zh: "眼鏡蛇", en: "Cobra", art: true, st: { v: 1.06, c: 1.0, a: 1.03 }, cols: ["orig", "yellow", "green", "blue", "purple"] },
  { v: "scorpion", price: 620, zh: "蠍子", en: "Scorpion", art: true, st: { v: 1.02, c: 1.06, a: 1.04 }, cols: ["orig", "red", "yellow", "green", "blue"] },
  { v: "manta", price: 640, zh: "魟魚", en: "Manta Ray", art: true, st: { v: 1.08, c: 0.97, a: 0.98 }, cols: ["orig", "red", "yellow", "green", "purple"] },
  { v: "snow_leopard", price: 720, zh: "雪豹", en: "Snow Leopard", art: true, st: { v: 1.05, c: 1.05, a: 1.02 }, cols: ["orig", "red", "yellow", "green", "purple"] },
  { v: "falcon", price: 760, zh: "獵鷹", en: "Falcon", art: true, st: { v: 1.09, c: 0.98, a: 1.0 }, cols: ["orig", "red", "green", "blue", "purple"] },
  { v: "robot", price: 780, zh: "機器人", en: "Robot", art: true, st: { v: 1.04, c: 1.04, a: 1.06 }, cols: ["orig", "red", "yellow", "green", "purple"] },
  { v: "stealth", price: 820, zh: "隱形戰機", en: "Stealth Jet", art: true, st: { v: 1.1, c: 0.96, a: 1.0 }, cols: ["orig", "red", "yellow", "green", "blue"] },
  { v: "rocket", price: 880, zh: "火箭", en: "Rocket", art: true, st: { v: 1.12, c: 0.94, a: 1.0 }, cols: ["orig", "yellow", "green", "blue", "purple"] },
  { v: "dragon", price: 1500, zh: "神龍", en: "Dragon", art: true, st: { v: 1.1, c: 1.05, a: 1.05 }, cols: ["orig", "yellow", "green", "blue", "purple"] },
  { v: "phoenix", price: 1500, zh: "鳳凰", en: "Phoenix", art: true, st: { v: 1.12, c: 1.04, a: 1.03 }, cols: ["orig", "yellow", "green", "blue", "purple"] }
];
C2BODIES.forEach(function (b) { b.d = bodyTags(b.st); });
function bodyTags(st) {
  var z = [], e = [];
  if (st.v >= 1.08) { z.push("超快"); e.push("very fast"); } else if (st.v >= 1.04) { z.push("快"); e.push("fast"); } else if (st.v <= 0.97) { z.push("比較慢"); e.push("slower"); }
  if (st.c >= 1.05) { z.push("過彎很穩"); e.push("very steady in curves"); } else if (st.c <= 0.97) { z.push("過彎會滑"); e.push("slides in curves"); }
  if (st.a >= 1.08) { z.push("爬坡很強"); e.push("strong on hills"); } else if (st.a >= 1.04) { z.push("起步快"); e.push("quick start"); }
  if (!z.length) { z.push("平衡"); e.push("balanced"); }
  var en = e.join(", "); return [z.join("、") + "。", en.charAt(0).toUpperCase() + en.slice(1) + "."];
}
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
      { v: "aero", price: 560, zh: "噴射車殼", en: "Jet body", d: ["最低最尖，風阻最小。", "Lowest and pointiest. Least wind."] }].concat(C2BODIES),
    motor: [
      { v: "normal", price: 0, zh: "普通馬達", en: "Stock motor", d: ["套件附的，速度普通。", "Comes in the kit. Normal speed."] },
      { v: "turbo", price: 380, zh: "高速馬達", en: "Turbo motor", d: ["轉得快，直線很快。", "Spins fast. Great on straights."] },
      { v: "torque", price: 420, zh: "扭力馬達", en: "Torque motor", d: ["力氣大，爬坡最強。", "Strong push. Best on hills."] },
      { v: "hyper", price: 650, zh: "超級馬達", en: "Hyper motor", d: ["最快，可是爬坡比較沒力。", "Fastest, but weaker on hills."] },
      { v: "rev", price: 300, zh: "轉速馬達", en: "Rev motor", d: ["比普通快一點，也有一點力氣。", "A bit faster and a bit stronger than stock."] },
      { v: "light", price: 520, zh: "輕快馬達", en: "Light-dash motor", d: ["很快，爬坡也還可以。", "Very fast, OK on hills."] },
      { v: "sprint", price: 900, zh: "衝刺馬達", en: "Sprint motor", d: ["直線最快！爬坡很沒力。", "Fastest on straights! Weak on hills."] },
      { v: "mach", price: 1100, zh: "音速馬達", en: "Mach motor", d: ["又快又有力，最貴。", "Fast and strong. Most expensive."] }],
    gear: [
      { v: "speed", price: 0, zh: "高速齒輪", en: "Speed gears", d: ["套件附的，直線快，爬坡慢。", "Comes in the kit. Fast, weak on hills."] },
      { v: "power", price: 150, zh: "力量齒輪", en: "Power gears", d: ["比較慢，可是很有力氣。", "Slower, but strong."] },
      { v: "mid", price: 180, zh: "中速齒輪", en: "Middle gears", d: ["速度和力氣都中等。", "A bit of both."] },
      { v: "super", price: 200, zh: "超高速齒輪", en: "Super-speed gears", d: ["直線更快，爬坡更慢。", "Even faster, even weaker on hills."] },
      { v: "climb", price: 200, zh: "爬坡齒輪", en: "Climbing gears", d: ["慢，可是上坡最強。", "Slow, but best up hills."] }],
    tire: [
      { v: "hard", price: 0, zh: "硬輪胎", en: "Hard tires", d: ["套件附的，容易滑。", "Comes in the kit. Slippery."] },
      { v: "soft", price: 160, zh: "軟輪胎", en: "Soft tires", d: ["抓地力好，過彎穩。", "Good grip in curves."] },
      { v: "low", price: 220, zh: "低摩擦輪胎", en: "Low-friction tires", d: ["直線滾得快，抓地力中等。", "Roll fast on straights, medium grip."] },
      { v: "sponge", price: 240, zh: "海綿輪胎", en: "Sponge tires", d: ["抓地力最好，直線慢一點。", "Best grip, a little slower."] },
      { v: "slick", price: 260, zh: "光頭輪胎", en: "Slick tires", d: ["直線很快，彎道容易滑。", "Fast on straights, slides in curves."] },
      { v: "spike", price: 180, zh: "釘釘輪胎", en: "Spike tires", d: ["咬住地面，爬坡比較有力。", "Bites the road. Better on hills."] },
      { v: "large", price: 300, zh: "大直徑輪胎", en: "Big tires", d: ["輪子大跑得快，可是起步和爬坡比較慢。", "Big wheels go fast, but start and climb slower."] }],
    roller: [
      { v: "no", price: 0, zh: "沒有滾輪", en: "No rollers", d: ["過彎太快會飛出去！", "Too fast in a curve and it flies off!"] },
      { v: "yes", price: 140, zh: "兩個滾輪", en: "2 rollers", d: ["靠著牆滑過彎道。", "Slides along the wall in curves."] },
      { v: "four", price: 260, zh: "四個滾輪", en: "4 rollers", d: ["前後都有，彎道最穩，有一點重。", "Front and back. Steadiest, a little heavy."] },
      { v: "plastic", price: 80, zh: "塑膠滾輪", en: "Plastic rollers", d: ["最便宜，不太滑順。", "Cheapest. Not very smooth."] },
      { v: "alu", price: 220, zh: "鋁合金滾輪", en: "Aluminum rollers", d: ["兩個，比普通的滑順。", "Two rollers, smoother than normal."] },
      { v: "bearing", price: 420, zh: "軸承滾輪", en: "Ball-bearing rollers", d: ["四個超滑順，彎道最快。", "Four super-smooth rollers. Fastest in curves."] }],
    wing: [
      { v: "none", price: 0, zh: "沒有尾翼", en: "No wing", d: ["比較輕。", "Lighter."] },
      { v: "small", price: 150, zh: "小尾翼", en: "Small wing", d: ["風把車子往下壓，過彎穩一點。", "Wind pushes the car down. A bit steadier."] },
      { v: "big", price: 280, zh: "大尾翼", en: "Big wing", d: ["彎道很穩，直線慢一點點。", "Very steady in curves, slightly slower."] },
      { v: "fin", price: 120, zh: "鯊魚鰭", en: "Shark fin", d: ["小小的，幾乎不擋風。", "Tiny. Almost no wind."] },
      { v: "air", price: 220, zh: "前擾流板", en: "Front air dam", d: ["把車頭往下壓。", "Pushes the nose down."] },
      { v: "dual", price: 380, zh: "雙層尾翼", en: "Double wing", d: ["彎道最穩，直線慢一些。", "Steadiest in curves, slower on straights."] }]
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
        { id: "c3", q: ["給馬達電的是？", "What gives the motor power?"], a: [["電池", "電池"], ["尾翼", "尾翼"], ["車殼", "車殼"]], c: 0, why: ["電池有電。", "The battery has the power."] }] },
    // second lesson each day (v2.6)
    { day: 0, sub: ["自然", "Science"], ic: "🔋", title: ["電池和電路", "Batteries and circuits"], tip: ["在家試試看：手電筒的開關關掉，燈為什麼不亮？", "Try at home: why does a flashlight go dark when you switch it off?"],
      cards: [["電池裡面存著電。", "A battery stores power."],
        ["電要繞一圈回到電池，馬達才會轉。這一圈叫電路。", "Power must go all the way around, back to the battery, to spin the motor. That loop is a circuit."],
        ["開關關掉，電路就斷了，車子會停下來。", "Switch off and the loop breaks, so the car stops."]],
      quiz: [
        { id: "w1s4", q: ["電路斷掉，馬達會…", "If the circuit breaks, the motor…"], a: [["停下來", "stops"], ["轉更快", "spins faster"], ["變大", "gets bigger"]], c: 0, why: ["電過不去，馬達就不轉了。", "No power gets through, so the motor stops."] },
        { id: "w1s5", q: ["四驅車要裝幾顆電池？", "How many batteries does a Mini 4WD car use?"], a: [["2 顆", "2"], ["1 顆", "1"], ["5 顆", "5"]], c: 0, why: ["四驅車用 2 顆三號電池。", "It uses 2 AA batteries."] },
        { id: "w1s6", q: ["電池快沒電了，車子會…", "When the batteries are almost empty, the car…"], a: [["跑得很慢", "goes slowly"], ["跑更快", "goes faster"], ["飛起來", "flies"]], c: 0, why: ["電不夠，馬達就沒力氣。", "Less power makes a weaker motor."] }] },
    { day: 1, sub: ["數學", "Math"], ic: "🕘", title: ["看時鐘", "Reading the clock"], tip: ["在家試試看：看看家裡的時鐘，現在是幾點？", "Try at home: look at a clock. What time is it now?"],
      cards: [["短針告訴我們幾點，長針告訴我們幾分。", "The short hand shows the hour. The long hand shows the minutes."],
        ["長針指著 12，就是整點。長針指著 6，就是半點。", "Long hand on 12 means o'clock. Long hand on 6 means half past."],
        ["比賽 9 點開始，要提早 30 分鐘，8 點半就到。", "The race starts at 9:00. Come 30 minutes early, at 8:30."]],
      quiz: [
        { id: "w1m4", q: ["短針指著 3，長針指著 12，是幾點？", "Short hand on 3, long hand on 12. What time is it?"], a: [["3:00", "3:00"], ["12:00", "12:00"], ["3:30", "3:30"]], c: 0, why: ["長針在 12 是整點，短針在 3，就是 3 點。", "Long hand on 12 means o'clock, short hand on 3: 3:00."] },
        { id: "w1m5", q: ["長針指著 6，是…", "The long hand on 6 means…"], a: [["半點", "half past"], ["整點", "o'clock"], ["6 點", "6 o'clock"]], c: 0, why: ["長針走到 6 是走了半圈，就是半點。", "Halfway around is half past."] },
        { id: "w1m6", q: ["比賽 9 點開始，要提早 30 分鐘到，幾點要到？", "The race starts at 9:00. Arrive 30 minutes early. When?"], a: [["8:30", "8:30"], ["9:30", "9:30"], ["8:00", "8:00"]], c: 0, why: ["9 點往前 30 分鐘是 8 點半。", "30 minutes before 9:00 is 8:30."] }] },
    { day: 2, sub: ["英文", "English"], ic: "🎨", title: ["隊伍的顏色", "Team colors"], tip: ["在家試試看：用英文說出你衣服的顏色！", "Try at home: say the colors of your clothes in English!"],
      cards: [["blue 是藍色，我們隊的顏色。", "blue: our team's color."],
        ["red 紅色，green 綠色，yellow 黃色。", "red, green, yellow."],
        ["Rex 的車是 red，Kai 的車是 green。", "Rex's car is red. Kai's car is green."]],
      quiz: [
        { id: "w1e4", q: ["「藍色」的英文是？", "Which word means 藍色?"], a: [["blue", "blue"], ["black", "black"], ["brown", "brown"]], c: 0, why: ["blue 是藍色。", "blue is 藍色."] },
        { id: "w1e5", q: ["🟩 是什麼顏色？", "What color is 🟩?"], a: [["green", "green"], ["red", "red"], ["yellow", "yellow"]], c: 0, why: ["🟩 是 green 綠色。", "🟩 is green."] },
        { id: "w1e6", q: ["Rex's car is ___.", "Rex's car is ___."], a: [["red", "red"], ["blue", "blue"], ["green", "green"]], c: 0, why: ["Rex 的車是紅色 red。", "Rex's car is red."] }] },
    { day: 3, sub: ["國語", "Chinese"], ic: "↔️", title: ["相反詞", "Opposites"], tip: ["在家試試看：找一個大的東西和一個小的東西！", "Try at home: find something big and something small!"],
      cards: [["快 和 慢 是相反詞。", "快 (fast) and 慢 (slow) are opposites."],
        ["大 和 小，長 和 短，也是相反詞。", "大 big and 小 small, 長 long and 短 short."],
        ["上坡 和 下坡 也是相反的。", "上坡 uphill and 下坡 downhill are opposites too."]],
      quiz: [
        { id: "w1c4", q: ["「快」的相反是？", "What is the opposite of 快 (fast)?"], a: [["慢", "慢"], ["大", "大"], ["上", "上"]], c: 0, why: ["快的相反是慢。", "The opposite of 快 is 慢 (slow)."] },
        { id: "w1c5", q: ["「長」的相反是？", "What is the opposite of 長 (long)?"], a: [["短", "短"], ["小", "小"], ["快", "快"]], c: 0, why: ["長的相反是短。", "The opposite of 長 is 短 (short)."] },
        { id: "w1c6", q: ["「上坡」的相反是？", "What is the opposite of 上坡 (uphill)?"], a: [["下坡", "下坡"], ["上車", "上車"], ["快跑", "快跑"]], c: 0, why: ["上坡的相反是下坡。", "The opposite of uphill is 下坡 (downhill)."] }] }
  ],
  // school week 2 (City Cup, Twisty Maze): two lessons a day, Mon-Thu
  LESSONS_W: { 2: [
    { day: 0, sub: ["自然", "Science"], ic: "🌀", title: ["為什麼會甩出彎道？", "Why cars fly off curves"], tip: ["生活小技巧：騎腳踏車轉彎前，要先慢下來！", "Try it on your bike: slow down before you turn!"],
      cards: [["車子跑很快的時候，總是想直直往前走。", "A fast car always wants to keep going straight."],
        ["所以過彎太快，車子會被甩出去。", "So if it takes a curve too fast, it flies off."],
        ["慢一點，或用軟輪胎抓地，就過得了彎。", "Go a little slower, or grip with soft tires, to make the curve."]],
      quiz: [
        { id: "w2s1", q: ["過彎太快會怎樣？", "What happens if you take a curve too fast?"], a: [["被甩出去", "The car flies off"], ["變得更穩", "It gets steadier"], ["車子變小", "The car shrinks"]], c: 0, why: ["車子想直直走，就衝出彎道了。", "The car wants to go straight, so it flies off."] },
        { id: "w2s2", q: ["怎樣過彎比較安全？", "How do you take a curve safely?"], a: [["慢一點", "Slow down"], ["加速", "Speed up"], ["閉上眼睛", "Close your eyes"]], c: 0, why: ["慢一點，車子才轉得過去。", "Slower cars can make the turn."] },
        { id: "w2s3", q: ["跑很快的車子總是想…", "A fast car always wants to…"], a: [["直直往前", "go straight"], ["往後退", "go backward"], ["轉圈圈", "spin around"]], c: 0, why: ["跑得快的東西會想繼續直直走。", "Fast things want to keep going straight."] }] },
    { day: 0, sub: ["自然", "Science"], ic: "🛞", title: ["滾輪和牆", "Rollers and walls"], tip: ["在家試試看：把球沿著牆滾，看看它怎麼走！", "Try at home: roll a ball along a wall and watch where it goes!"],
      cards: [["滾輪裝在車子的四個角。", "Rollers sit on the car's four corners."],
        ["滾輪碰到牆會轉，讓車子順著牆過彎。", "They roll along the wall and guide the car around curves."],
        ["沒有滾輪，車子會撞牆，或飛出賽道。", "With no rollers, the car hits the wall or flies off the track."]],
      quiz: [
        { id: "w2s4", q: ["滾輪碰到牆會…", "When a roller touches the wall, it…"], a: [["轉動", "spins"], ["停住", "stops"], ["破掉", "breaks"]], c: 0, why: ["滾輪轉動，車子就順著牆走。", "It spins, so the car slides along the wall."] },
        { id: "w2s5", q: ["彎道很多的賽道，一定要裝…", "A track with many curves needs…"], a: [["滾輪", "rollers"], ["喇叭", "a horn"], ["車燈", "lights"]], c: 0, why: ["滾輪幫車子過彎。", "Rollers guide the car through curves."] },
        { id: "w2s6", q: ["滾輪裝在哪裡？", "Where do the rollers go?"], a: [["車子的四個角", "the 4 corners"], ["車頂", "the roof"], ["電池裡", "inside the battery"]], c: 0, why: ["四個角最先碰到牆。", "The corners touch the wall first."] }] },
    { day: 1, sub: ["數學", "Math"], ic: "⚙️", title: ["數齒輪的齒", "Counting gear teeth"], tip: ["在家試試看：5 個 5 個數，數到 50！", "Try at home: count by 5s up to 50!"],
      cards: [["齒輪上一個一個尖尖的叫做齒。", "The bumps on a gear are called teeth."],
        ["齒很多，可以 2 個 2 個數：2、4、6、8。", "With lots of teeth, count by 2s: 2, 4, 6, 8."],
        ["也可以 5 個 5 個數：5、10、15、20。", "Or count by 5s: 5, 10, 15, 20."]],
      quiz: [
        { id: "w2m1", q: ["5、10、15、？", "5, 10, 15, ?"], a: [["20", "20"], ["16", "16"], ["25", "25"]], c: 0, why: ["每次多 5：15 + 5 = 20。", "Add 5 each time: 15 + 5 = 20."] },
        { id: "w2m2", q: ["2、4、6、8、？", "2, 4, 6, 8, ?"], a: [["10", "10"], ["9", "9"], ["12", "12"]], c: 0, why: ["每次多 2：8 + 2 = 10。", "Add 2 each time: 8 + 2 = 10."] },
        { id: "w2m3", q: ["一個齒輪有 10 齒，3 個齒輪一共幾齒？", "A gear has 10 teeth. How many teeth on 3 gears?"], a: [["30", "30"], ["13", "13"], ["20", "20"]], c: 0, why: ["10 + 10 + 10 = 30。", "10 + 10 + 10 = 30."] }] },
    { day: 1, sub: ["數學", "Math"], ic: "📏", title: ["圈數和距離", "Laps and distance"], tip: ["在家試試看：在房間走一圈，數數走了幾步？", "Try at home: walk around your room. How many steps is one lap?"],
      cards: [["賽道一圈是 20 公尺。", "One lap of the track is 20 meters."],
        ["跑 3 圈：20 + 20 + 20 = 60 公尺。", "3 laps: 20 + 20 + 20 = 60 meters."],
        ["也可以寫成 20 × 3 = 60。", "You can also write 20 × 3 = 60."]],
      quiz: [
        { id: "w2m4", q: ["一圈 10 公尺，跑 4 圈是幾公尺？", "One lap is 10 m. How far is 4 laps?"], a: [["40 公尺", "40 m"], ["14 公尺", "14 m"], ["400 公尺", "400 m"]], c: 0, why: ["10 × 4 = 40。", "10 × 4 = 40."] },
        { id: "w2m5", q: ["20 × 2 = ?", "20 × 2 = ?"], a: [["40", "40"], ["22", "22"], ["202", "202"]], c: 0, why: ["20 + 20 = 40。", "20 + 20 = 40."] },
        { id: "w2m6", q: ["比賽要跑 5 圈，已經跑了 2 圈，還要跑幾圈？", "The race is 5 laps. You've done 2. How many are left?"], a: [["3 圈", "3"], ["7 圈", "7"], ["2 圈", "2"]], c: 0, why: ["5 − 2 = 3。", "5 − 2 = 3."] }] },
    { day: 2, sub: ["英文", "English"], ic: "🧭", title: ["方向", "Directions"], tip: ["在家試試看：舉起你的 left hand，再舉 right hand！", "Try at home: raise your left hand, then your right hand!"],
      cards: [["left 是左邊，right 是右邊。", "left and right."],
        ["straight 是直直走，turn 是轉彎。", "straight: no turning. turn: change direction."],
        ["The car turns left at the curve.", "The car turns left at the curve."]],
      quiz: [
        { id: "w2e1", q: ["「右邊」的英文是？", "Which word means 右邊?"], a: [["right", "right"], ["left", "left"], ["light", "light"]], c: 0, why: ["right 是右邊。", "right is 右邊."] },
        { id: "w2e2", q: ["⬅️ is ___.", "⬅️ is ___."], a: [["left", "left"], ["right", "right"], ["up", "up"]], c: 0, why: ["箭頭指向左邊 left。", "The arrow points left."] },
        { id: "w2e3", q: ["The road curves here. The car must ___.", "The road curves here. The car must ___."], a: [["turn", "turn"], ["sleep", "sleep"], ["eat", "eat"]], c: 0, why: ["彎道要轉彎 turn。", "At a curve, the car must turn."] }] },
    { day: 2, sub: ["英文", "English"], ic: "🏁", title: ["fast, faster, fastest", "fast, faster, fastest"], tip: ["在家試試看：和家人比賽走路，誰是 the fastest？", "Try at home: race your family walking. Who is the fastest?"],
      cards: [["fast 是快。", "fast."],
        ["faster 是比較快：Kai is faster than Benny.", "faster: Kai is faster than Benny."],
        ["fastest 是最快：Who is the fastest?", "fastest: Who is the fastest?"]],
      quiz: [
        { id: "w2e4", q: ["The ___ car wins the race.", "The ___ car wins the race."], a: [["fastest", "fastest"], ["slowest", "slowest"], ["fast", "fast"]], c: 0, why: ["最快的車贏：the fastest car。", "The fastest car wins."] },
        { id: "w2e5", q: ["「比較快」的英文是？", "Which word means 比較快?"], a: [["faster", "faster"], ["fastest", "fastest"], ["fast", "fast"]], c: 0, why: ["faster 是比較快。", "faster means 比較快."] },
        { id: "w2e6", q: ["The opposite of fast is ___.", "The opposite of fast is ___."], a: [["slow", "slow"], ["big", "big"], ["hot", "hot"]], c: 0, why: ["fast 的相反是 slow。", "fast ↔ slow."] }] },
    { day: 3, sub: ["國語", "Chinese"], ic: "↕️", title: ["左右前後", "Left, right, front, back"], tip: ["在家試試看：說說看，你的左邊有什麼？", "Try at home: what is on your left right now?"],
      cards: [["左 和 右：左手、右手。", "左 left and 右 right: 左手 left hand, 右手 right hand."],
        ["前 和 後：前面、後面。", "前 front and 後 back: 前面, 後面."],
        ["彎道往右邊轉，叫做右轉。", "Turning to the right is 右轉."]],
      quiz: [
        { id: "w2c1", q: ["「左」的相反是？", "What is the opposite of 左 (left)?"], a: [["右", "右"], ["前", "前"], ["下", "下"]], c: 0, why: ["左的相反是右。", "The opposite of 左 is 右 (right)."] },
        { id: "w2c2", q: ["「前」的相反是？", "What is the opposite of 前 (front)?"], a: [["後", "後"], ["左", "左"], ["上", "上"]], c: 0, why: ["前的相反是後。", "The opposite of 前 is 後 (back)."] },
        { id: "w2c3", q: ["往右邊轉彎叫做？", "Turning to the right is called?"], a: [["右轉", "右轉"], ["左轉", "左轉"], ["直走", "直走"]], c: 0, why: ["往右轉就是右轉。", "Turn right = 右轉."] }] },
    { day: 3, sub: ["國語", "Chinese"], ic: "🚦", title: ["城市裡的字", "City words"], tip: ["生活小技巧：過馬路前，先看左右！", "Try it next time you cross a street: look left and right first!"],
      cards: [["城市裡有很多大樓和馬路。", "A city has many tall buildings and roads."],
        ["紅燈停，綠燈走。", "Red light: stop. Green light: go."],
        ["過馬路前，要先看左右。", "Before you cross the road, look left and right."]],
      quiz: [
        { id: "w2c4", q: ["紅燈要…", "At a red light you…"], a: [["停", "stop"], ["走", "go"], ["跑", "run"]], c: 0, why: ["紅燈停。", "Red means stop."] },
        { id: "w2c5", q: ["綠燈要…", "At a green light you…"], a: [["走", "go"], ["停", "stop"], ["睡覺", "sleep"]], c: 0, why: ["綠燈走。", "Green means go."] },
        { id: "w2c6", q: ["過馬路前要看哪裡？", "Before crossing the road, where do you look?"], a: [["左右", "left and right"], ["天上", "up at the sky"], ["腳下", "at your feet"]], c: 0, why: ["看左右，確定沒有車。", "Look left and right to check for cars."] }] }
  ] },
  TEST_EXTRA_W: { 2: [
    { id: "w2t1", q: ["城市盃彎道很多，車子最需要什麼？", "The City Cup has lots of curves. What does the car need most?"], a: [["滾輪和軟輪胎", "Rollers and soft tires"], ["只要大馬達", "Just a big motor"]], c: 0, why: ["滾輪和軟輪胎幫車子過彎。", "Rollers and soft tires help it through curves."] },
    { id: "w2t2", q: ["10 + 10 + 10 + 10 = ?", "10 + 10 + 10 + 10 = ?"], a: [["40", "40"], ["30", "30"], ["400", "400"]], c: 0, why: ["10 × 4 = 40。", "10 × 4 = 40."] }] },
  TEST_EXTRA: [
    { id: "t1", q: ["上坡要用哪一種齒輪？", "Which gears are best for hills?"], a: [["力量齒輪", "Power gears"], ["高速齒輪", "Speed gears"]], c: 0, why: ["力量齒輪力氣大，爬得上去。", "Power gears push harder up hills."] },
    { id: "t2", q: ["200 + 160 + 140 = ?", "200 + 160 + 140 = ?"], a: [["500", "500"], ["400", "400"], ["460", "460"]], c: 0, why: ["200 + 160 = 360，360 + 140 = 500。", "200 + 160 = 360, 360 + 140 = 500."] }
  ],
  A_LINE: 0.9, // A = 90% of points (first try 2, second try 1)
  // jobs: 5 options; the thin version opens the noodle shop
  JOBS: [ // 3 open from the start; 2 open in week 2
    { id: "noodle", ic: "🍜", zh: "麵店幫忙", en: "Noodle shop", pay: 100, open: true },
    { id: "deliver", ic: "📦", zh: "送貨", en: "Delivery", pay: 110, open: true },
    { id: "bank", ic: "🏦", zh: "銀行數錢", en: "Bank helper", pay: 120, open: true },
    { id: "wash", ic: "🧽", zh: "洗車", en: "Car wash", pay: 110, open: false, week: 2 },
    { id: "books", ic: "📚", zh: "書店整理", en: "Bookstore", pay: 100, open: false, week: 2 }],
  MENU: [ // d = dish: bowl, plate, cup, steamer
    { id: "beef", ic: "🍜", zh: "牛肉麵", en: "Beef noodles", p: 120, d: "bowl" },
    { id: "rice", ic: "🍚", zh: "滷肉飯", en: "Braised pork rice", p: 40, d: "bowl" },
    { id: "fried", ic: "🍛", zh: "炒飯", en: "Fried rice", p: 80, d: "plate" },
    { id: "soup", ic: "🥣", zh: "酸辣湯", en: "Hot and sour soup", p: 45, d: "bowl" },
    { id: "dump", ic: "🥟", zh: "水餃", en: "Dumplings", p: 60, d: "plate" },
    { id: "xlb", ic: "🥟", zh: "小籠包", en: "Soup dumplings", p: 90, d: "steamer" },
    { id: "bao", ic: "🥙", zh: "刈包", en: "Gua bao", p: 55, d: "plate" },
    { id: "pancake", ic: "🫓", zh: "蔥油餅", en: "Scallion pancake", p: 35, d: "plate" },
    { id: "egg", ic: "🥚", zh: "茶葉蛋", en: "Tea egg", p: 15, d: "plate" },
    { id: "side", ic: "🥒", zh: "小菜", en: "Side dish", p: 30, d: "plate" },
    { id: "tea", ic: "🧋", zh: "珍珠奶茶", en: "Bubble tea", p: 50, d: "cup" },
    { id: "soy", ic: "🥛", zh: "豆漿", en: "Soy milk", p: 25, d: "cup" }],
  TIP: 10, // per perfect customer
  TALK: [ // small talk after paying
    ["你算錢好快喔！", "You count money so fast!"], ["我兒子也很喜歡四驅車。", "My son loves Mini 4WD cars too."], ["這裡的東西最好吃了。", "The food here is the best."],
    ["今天天氣真好！", "What a nice day today!"], ["你長大想做什麼？", "What do you want to be when you grow up?"], ["下次我還要再來！", "I'll come back next time!"],
    ["聽說星期六有比賽，加油喔！", "I heard there's a race on Saturday. Good luck!"], ["你是小幫手嗎？好棒！", "Are you the little helper? Great job!"]],
  CASH: [500, 100, 50, 10, 5], // Taiwan bills and coins Lucas uses to collect the bill
  // car wash job (week 2): wash steps in order + a price board
  WASH: { steps: [["💦", "噴水", "Spray water"], ["🧼", "抹肥皂", "Add soap"], ["🧽", "刷一刷", "Scrub"], ["🚿", "沖乾淨", "Rinse"], ["🧻", "擦乾", "Dry"]],
    price: { small: 50, big: 80, wax: 30 } },
  // bookstore job (week 2): English titles for the A-Z shelves
  BOOKS: ["Apples", "Bears", "Cars", "Dinosaurs", "Engines", "Frogs", "Gears", "Hills", "Ice", "Jets", "Kites", "Lions", "Moon", "Night", "Ocean", "Pizza", "Robots", "Rockets", "Stars", "Trains", "Up", "Volcano", "Wheels", "Zebra"],
  SHELF_AZ: [["A", "F"], ["G", "L"], ["M", "R"], ["S", "Z"]],
  // rivals (boys only in Lucas's game), team colors
  KIDS: {
    kai: { col: "green" }, benny: { col: "yellow" }, rex: { col: "red" }
  },
  // cups: week, track, rivals, entry fee, prizes. Rivals get a small random luck each race, so nobody always wins.
  CUPS: [
    { id: "c1", week: 1, track: "oval", zh: "社區盃", en: "Neighborhood Cup", tier: 1, fee: 100, laps: 3,
      rivals: [{ who: "kai", build: { motor: "turbo", gear: "speed", tire: "soft", roller: "yes", body: "armored", paint: "orig", wing: "none" } },
        { who: "benny", build: { motor: "turbo", gear: "mid", tire: "low", roller: "yes", body: "wolf", paint: "yellow", wing: "none" } }],
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
