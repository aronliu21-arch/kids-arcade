/* ===== Story, parts and science content (all bilingual) ===== */
var CAST = {
  lucas: { zh: "陸晨", en: "Lucas", img: "p_lucas", col: "#f76707", pitch: 1.25 },
  kai:   { zh: "阿凱", en: "Kai", img: "p_kai", col: "#2f9e44", pitch: 1.0 },
  benny: { zh: "小斌", en: "Benny", img: "p_benny", col: "#f59f00", pitch: 1.4 },
  max:   { zh: "麥叔叔", en: "Uncle Max", img: "p_max", col: "#1864ab", pitch: 0.8 },
  rex:   { zh: "雷克斯", en: "Rex", img: "p_rex", col: "#e03131", pitch: 1.05 },
  narr:  { zh: "", en: "", img: "", col: "#495057", pitch: 1.0 }
};

/* Story scenes. Each line: [who, zh, en]. */
var SCENES = {
  shop: { bg: "bg_shop", lines: [
    ["narr", "星期六下午，陸晨走進了齒輪模型店。", "Saturday afternoon. Lucas walks into the Gear Up Hobby Shop."],
    ["max", "歡迎！你是第一次來嗎？", "Welcome! Is this your first time here?"],
    ["lucas", "哇！好多小車！它們會自己跑嗎？", "Whoa! So many little cars! Do they run by themselves?"],
    ["max", "這是四驅車。裡面有馬達跟電池，放上跑道就會衝出去！", "These are Mini 4WD cars. A motor and batteries inside make them zoom down the track!"],
    ["kai", "不只是快喔。每一個零件都很重要。", "It's not just about speed. Every part matters."],
    ["lucas", "你是誰？", "Who are you?"],
    ["kai", "我是阿凱。我最喜歡研究車子為什麼會跑。", "I'm Kai. I love figuring out WHY cars go."],
    ["max", "下星期公園有社區盃比賽。陸晨，要不要自己組一台車？", "There's a Neighborhood Cup race in the park next week. Lucas, want to build your own car?"],
    ["lucas", "要！我要組全世界最快的車！", "Yes! I'll build the fastest car in the world!"],
    ["max", "好！這盒給你。我們一個零件一個零件來。", "Great! This kit is yours. Let's go one part at a time."]
  ]},
  test: { bg: "bg_shop", lines: [
    ["max", "組好了！先在測試跑道跑一圈看看。", "All built! Let's try one lap on the test track."],
    ["kai", "看清楚喔：上坡、彎道，車子哪裡變慢？", "Watch closely: on the hill and in the curves, where does the car slow down?"]
  ]},
  park: { bg: "bg_park", lines: [
    ["narr", "比賽日！公園的社區盃開始了！", "Race day! The Neighborhood Cup in the park is starting!"],
    ["benny", "加油！加油！哇，你的車好帥！", "Go, go, go! Whoa, your car looks so cool!"],
    ["lucas", "謝謝！你是誰？", "Thanks! Who are you?"],
    ["benny", "我是小斌！我還沒有車，可是我最會加油了！", "I'm Benny! I don't have a car yet, but I'm the best cheerer!"],
    ["rex", "哼，新手。我的紅色火焰號裝了最快的齒輪，你贏不了的。", "Hmph, a beginner. My Red Blaze has the fastest gears. You can't win."],
    ["kai", "最快的齒輪不一定最好，要看跑道。", "The fastest gear isn't always the best. It depends on the track."],
    ["max", "這條跑道有一個上坡和四個彎道。三圈決勝負！", "This track has one hill and four curves. Three laps to win!"]
  ]},
  win: { bg: "bg_park", lines: [
    ["lucas", "我贏了！每一個零件都有幫忙！", "I won! Every single part helped!"],
    ["rex", "哼……上坡輸了。下次我也要換力量齒輪。", "Hmph... I lost on the hill. Next time I'm getting power gears too."],
    ["kai", "陸晨，你的車在彎道又快又穩。我們組一隊吧！", "Lucas, your car was fast AND steady in the curves. Let's make a team!"],
    ["benny", "我也要！我負責加油，也要學組車！", "Me too! I'll cheer, and I'll learn to build!"],
    ["lucas", "好！我們就叫藍色閃電隊！下一站：全國大賽，然後是世界大賽！", "Yes! We're Team Blue Bolt! Next stop: the national race, then the World Series!"],
    ["narr", "第一集完。待續……", "End of Episode 1. To be continued..."]
  ]}
};

/* Garage build steps. pick = a choice the kid makes (changes the car). */
var PARTS = [
  { id: "chassis", img: "x_chassis", zh: "底盤", en: "Chassis",
    what: ["底盤是車子的骨架，所有零件都裝在上面。", "The chassis is the car's skeleton. Every part attaches to it."],
    sci: ["底盤用又輕又硬的塑膠做的。車子越輕，馬達越容易推動它。", "It's made of light, stiff plastic. The lighter the car, the easier it is for the motor to push it."],
    demo: null,
    q: { zh: "為什麼底盤要輕？", en: "Why should the chassis be light?",
      a: [["輕的車比較容易加速", "A light car speeds up more easily"], ["輕的車比較好看", "Light cars look nicer"], ["輕的車不需要電池", "Light cars don't need batteries"]],
      why: ["推輕的東西比推重的東西容易，所以輕的車加速比較快。", "Pushing something light is easier than pushing something heavy, so a light car speeds up faster."] } },
  { id: "motor", img: "x_motor", zh: "馬達", en: "Motor",
    what: ["馬達把電變成轉動，讓輪子轉起來。", "The motor turns electricity into spinning, and that turns the wheels."],
    sci: ["馬達裡面有磁鐵跟線圈。電流過線圈，線圈也變成磁鐵，一推一拉就轉起來了！", "Inside are magnets and a coil of wire. Electricity turns the coil into a magnet too. Push, pull, spin!"],
    demo: "motor",
    pick: { key: "motor", zh: "選一個馬達", en: "Choose a motor", opts: [
      { v: "normal", zh: "一般馬達", en: "Normal motor", d: ["穩穩的，比較好控制。", "Steady and easy to control."] },
      { v: "turbo", zh: "衝刺馬達", en: "Turbo motor", d: ["轉得更快！但是彎道比較難控制。", "Spins faster! But harder to handle in curves."] }] },
    q: { zh: "馬達把什麼變成轉動？", en: "The motor turns what into spinning?",
      a: [["電", "Electricity"], ["水", "Water"], ["風", "Wind"]],
      why: ["電流讓線圈變成磁鐵，磁鐵一推一拉就轉動。", "Electric current makes the coil a magnet, and magnets push and pull to spin it."] } },
  { id: "battery", img: "x_battery", zh: "電池", en: "Batteries",
    what: ["電池存著電，是車子的能量來源。", "Batteries store electricity. They are the car's energy."],
    sci: ["電要走一個完整的圈圈，叫做電路。圈圈斷掉，電就停了。", "Electricity must travel around a full loop called a circuit. Break the loop and it stops."],
    demo: "circuit",
    q: { zh: "電路斷掉了，馬達會怎樣？", en: "If the circuit loop is broken, what does the motor do?",
      a: [["停下來", "It stops"], ["轉更快", "It spins faster"], ["倒著轉", "It spins backward"]],
      why: ["電只能在完整的圈圈裡流動。圈圈斷了，電流就停了。", "Electricity can only flow around a complete loop. Break it and the current stops."] } },
  { id: "gears", img: "x_gears", zh: "齒輪", en: "Gears",
    what: ["齒輪把馬達的轉動傳到輪子。", "Gears pass the motor's spin to the wheels."],
    sci: ["小齒輪帶大齒輪：轉得慢，可是力氣大。兩個齒輪大小差不多：轉得快，可是力氣小。", "A small gear turning a big gear: slower, but stronger. Gears closer in size: faster, but weaker."],
    demo: "gears",
    pick: { key: "gear", zh: "選一組齒輪", en: "Choose a gear set", opts: [
      { v: "speed", zh: "速度齒輪", en: "Speed gears", d: ["最高速度很快！上坡沒力。", "Great top speed! Weak on hills."] },
      { v: "power", zh: "力量齒輪", en: "Power gears", d: ["上坡很有力，最高速度慢一點。", "Strong on hills, a little less top speed."] }] },
    q: { zh: "要爬上坡，哪一種齒輪比較好？", en: "Which gears help a car climb a hill?",
      a: [["力量齒輪", "Power gears"], ["速度齒輪", "Speed gears"], ["不要齒輪", "No gears"]],
      why: ["小齒輪帶大齒輪，轉得慢但是力氣大，上坡才推得動。", "A small gear turning a big gear is slow but strong, so it can push the car up a hill."] } },
  { id: "tires", img: "x_tires", zh: "輪胎", en: "Tires",
    what: ["輪胎讓車子抓住跑道。", "Tires let the car grip the track."],
    sci: ["輪胎跟跑道磨來磨去的力量叫做摩擦力，就是抓地力。軟橡膠摩擦力大，硬塑膠容易滑。", "The rubbing force between tire and track is called friction. That's grip! Soft rubber grips; hard plastic slides."],
    demo: "tires",
    pick: { key: "tire", zh: "選輪胎", en: "Choose tires", opts: [
      { v: "hard", zh: "硬輪胎", en: "Hard tires", d: ["直線快一點點，彎道很滑。", "A tiny bit faster on straights, slippery in curves."] },
      { v: "soft", zh: "軟輪胎", en: "Soft tires", d: ["抓地力好，彎道很穩。", "Good grip, steady in curves."] }] },
    q: { zh: "哪一種輪胎抓地力比較好？", en: "Which tire grips better?",
      a: [["軟橡膠", "Soft rubber"], ["硬塑膠", "Hard plastic"], ["冰塊", "Ice"]],
      why: ["軟橡膠跟跑道的摩擦力比較大，所以抓得比較緊。", "Soft rubber has more friction with the track, so it holds on tighter."] } },
  { id: "rollers", img: "x_rollers", zh: "導輪", en: "Rollers",
    what: ["導輪裝在車子的四個角，碰到跑道的牆就會轉。", "Rollers sit at the car's corners and roll along the track wall."],
    sci: ["車子轉彎時，會想一直往前直直衝，這叫做慣性。導輪靠著牆，幫車子轉彎，不會脫軌。", "In a curve the car wants to keep going straight. That's called inertia. Rollers lean on the wall so the car turns instead of flying out."],
    demo: "rollers",
    pick: { key: "roller", zh: "要裝導輪嗎？", en: "Add rollers?", opts: [
      { v: "yes", zh: "裝導輪", en: "Add rollers", d: ["靠著牆，安全轉彎。", "Leans on the wall and turns safely."] },
      { v: "no", zh: "不要裝", en: "No rollers", d: ["比較輕……可是很危險！", "Lighter... but risky!"] }] },
    q: { zh: "車子在彎道想一直往前直走，這叫什麼？", en: "In a curve, the car wants to keep going straight. What is that called?",
      a: [["慣性", "Inertia"], ["重力", "Gravity"], ["磁力", "Magnetism"]],
      why: ["會動的東西想一直照原來的方向走，這就是慣性。", "Moving things want to keep going the same way. That's inertia."] } },
  { id: "body", img: "x_body", zh: "車殼", en: "Body shell",
    what: ["車殼保護裡面的零件。", "The body shell protects the parts inside."],
    sci: ["車子跑的時候，空氣會往後推它，叫做空氣阻力。流線型的車殼讓空氣滑過去。", "When the car runs, air pushes back on it. That's air resistance, or drag. A sleek shape lets the air slide past."],
    demo: "air",
    pick: { key: "body", zh: "選車殼", en: "Choose a body", opts: [
      { v: "sleek", zh: "流線型", en: "Sleek", d: ["空氣滑過去，跑得快。", "Air slides past. Faster!"] },
      { v: "boxy", zh: "方塊型", en: "Boxy", d: ["很堅固，可是空氣推得比較多。", "Tough, but the air pushes back more."] }] },
    q: { zh: "空氣往後推車子，叫做什麼？", en: "Air pushing back on a moving car is called what?",
      a: [["空氣阻力", "Air resistance"], ["電流", "Electric current"], ["磁力", "Magnetism"]],
      why: ["車子往前衝，要推開前面的空氣，空氣就往後推車子。", "The car has to push air out of the way, so the air pushes back on the car."] } }
];

/* Starting build: before the kid picks anything */
var DEFAULT_BUILD = { motor: "normal", gear: "speed", tire: "hard", roller: "no", body: "boxy" };

/* Opponents in race 1 */
var RIVALS = [
  { who: "rex", car: "c_red", build: { motor: "turbo", gear: "speed", tire: "soft", roller: "yes", body: "sleek" } },
  { who: "kai", car: "c_green", build: { motor: "normal", gear: "power", tire: "soft", roller: "yes", body: "boxy" } }
];

var TIP = ["在家試試看：把玩具車放在地板跟地毯上推一推，哪一個比較容易滑？那就是摩擦力！",
  "Try it at home: push a toy car on the hard floor and then on a rug. Which one rolls farther? That's friction!"];

/* Uncle Max's advice after a run: [zh, en] */
var ADVICE = {
  crash: ["哎呀，脫軌了！彎道時車子想往外飛。裝上導輪，讓它靠著牆轉彎。", "Oops, course out! In a curve the car wants to fly outward. Add rollers so it can lean on the wall."],
  hill: ["上坡變好慢。試試力量齒輪：小齒輪帶大齒輪，力氣比較大。", "It slowed way down on the hill. Try power gears: a small gear turning a big one is stronger."],
  grip: ["彎道太滑了，速度掉很多。軟輪胎的摩擦力比較大。", "Too slippery in the curves, it lost lots of speed. Soft tires have more friction."],
  slow: ["很穩！可是直線不夠快。換衝刺馬達或流線型車殼試試。", "Nice and steady! But not fast enough on the straights. Try the turbo motor or a sleek body."],
  good: ["跑得太棒了！又快又穩，準備比賽吧！", "Awesome run! Fast and steady. You're ready to race!"]
};
