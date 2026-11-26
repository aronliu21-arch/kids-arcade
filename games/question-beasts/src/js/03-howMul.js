function howMul(a,b){const g=Math.min(a,b),sz=Math.max(a,b),list=range(1,g).map(i=>i*sz);
  return[`${a} × ${b} means ${g} groups of ${sz}.`,`Count by ${sz}s: ${list.join(', ')}.`,`${a} × ${b} = ${a*b}.`]}
function howBigMul(a,b){const t=a-a%10,o=a%10;return[`Break ${a} into ${t} + ${o}.`,`${t} × ${b} = ${t*b}.`,`${o} × ${b} = ${o*b}.`,`Add them: ${t*b} + ${o*b} = ${a*b}.`]}
function howDiv(n,a){return[`${n} ÷ ${a} asks: ${a} times what makes ${n}?`,`${a} × ${n/a} = ${n}.`,`So ${n} ÷ ${a} = ${n/a}.`]}
function howRem(n,d){const q=Math.floor(n/d),r=n%d;return[`Find the biggest ${d}× fact that is not more than ${n}: ${d} × ${q} = ${d*q}.`,`Left over: ${n} − ${d*q} = ${r}.`,`So ${n} ÷ ${d} = ${q} R${r}.`]}
function howFrac(n,d,tot){const k=tot/d;return[`Split ${tot} into ${d} equal parts: ${tot} ÷ ${d} = ${k}.`,n>1?`Take ${n} parts: ${n} × ${k} = ${n*k}.`:`Take 1 part: ${k}.`]}

/* ---------- pictures ---------- */
const COLORS={red:'#e43b44',blue:'#2f6fe0',yellow:'#ffe14d',green:'#3cb043',orange:'#f78a1d',purple:'#9b5fe0',pink:'#ff8fc8',brown:'#8b5a2b',white:'#f4f4f4',black:'#111111'};
const BASIC_COLORS=['red','blue','yellow','green','orange','purple'];
const COLOR_EX={red:'🍓 strawberries',blue:'💧 water and the sky',yellow:'🍌 bananas',green:'🐸 frogs',orange:'🥕 carrots',purple:'🍇 grapes',pink:'🐷 pigs',brown:'🐻 bears',white:'⛄ snow',black:'the night sky'};
const SHAPE_PATHS={circle:'<circle cx="20" cy="20" r="16"/>',square:'<rect x="5" y="5" width="30" height="30"/>',triangle:'<polygon points="20,4 37,35 3,35"/>',star:'<polygon points="20,2 25,15 39,15 28,24 32,38 20,30 8,38 12,24 1,15 15,15"/>',heart:'<path d="M20 36 L5 21 A8 8 0 0 1 20 9 A8 8 0 0 1 35 21 Z"/>',rectangle:'<rect x="2" y="11" width="36" height="18"/>',oval:'<ellipse cx="20" cy="20" rx="18" ry="11"/>',diamond:'<polygon points="20,2 36,20 20,38 4,20"/>'};
const FIRST_SHAPES=['circle','square','triangle','star','heart'],ALL_SHAPES=Object.keys(SHAPE_PATHS);
const SHAPE_FACT={circle:'A circle is round all the way around, with no corners.',square:'A square has 4 sides that are all the same length.',triangle:'A triangle has 3 sides and 3 corners.',star:'A star has 5 points.',heart:'A heart has 2 bumps on top and a point at the bottom.',rectangle:'A rectangle has 4 sides: 2 long and 2 short.',oval:'An oval is like a stretched circle, like an egg.',diamond:'A diamond has 4 sides and stands on a corner.'};
function shapeSVG(sh,col){return `<svg class="shp" viewBox="0 0 40 40" aria-hidden="true"><g fill="${col}" stroke="#f4f4f4" stroke-width="2" stroke-linejoin="round">${SHAPE_PATHS[sh]}</g></svg>`}
function clockSVG(h,m){const ha=((h%12)+m/60)*30*Math.PI/180,ma=m*6*Math.PI/180;let t='';
  for(let i=0;i<12;i++){const a=i*Math.PI/6;t+=`<line x1="${(50+38*Math.sin(a)).toFixed(1)}" y1="${(50-38*Math.cos(a)).toFixed(1)}" x2="${(50+44*Math.sin(a)).toFixed(1)}" y2="${(50-44*Math.cos(a)).toFixed(1)}" stroke="#1a1c2c" stroke-width="${i%3?2:4}"/>`}
  const num=(n,x,y)=>`<text x="${x}" y="${y}" font-size="11" font-family="monospace" text-anchor="middle" dominant-baseline="middle" fill="#1a1c2c">${n}</text>`;
  return `<svg class="clk" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47" fill="#f4f4f4" stroke="#ffcd75" stroke-width="5"/>${t}${num(12,50,16)}${num(3,84,51)}${num(6,50,85)}${num(9,16,51)}
  <line x1="50" y1="50" x2="${(50+23*Math.sin(ha)).toFixed(1)}" y2="${(50-23*Math.cos(ha)).toFixed(1)}" stroke="#b13e53" stroke-width="6" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="${(50+35*Math.sin(ma)).toFixed(1)}" y2="${(50-35*Math.cos(ma)).toFixed(1)}" stroke="#1a1c2c" stroke-width="3.5" stroke-linecap="round"/><circle cx="50" cy="50" r="4" fill="#1a1c2c"/></svg>`}
const COIN={1:['#c87a3a','1¢'],5:['#c0cbdc','5¢'],10:['#dfe6ee','10¢'],25:['#aab4c0','25¢']};
function coinsHTML(list){return `<div class="coins">${list.map(v=>`<span class="coin" style="background:${COIN[v][0]};width:${v===10?40:v===1?44:v===5?50:56}px;height:${v===10?40:v===1?44:v===5?50:56}px">${COIN[v][1]}</span>`).join('')}</div>`}
const tstr=(h,m)=>`${h}:${String(m).padStart(2,'0')}`;

/* ---------- topic pools ---------- */
const POOLS={milo:[],lucas:[],nora:[]};
const G=(kid,topic,tier,fn)=>POOLS[kid].push({topic,tier,fn});
/* bank: [id, question, answer, wrong1, wrong2, explanation] */
/* Milo: Chinese-first question text (letters, words and English-word opposites stay English) */
const ZC={red:'紅色',blue:'藍色',yellow:'黃色',green:'綠色',orange:'橘色',purple:'紫色',pink:'粉紅色',brown:'咖啡色',white:'白色',black:'黑色'};
const ZS={circle:'圓形',square:'正方形',triangle:'三角形',star:'星形',heart:'愛心',rectangle:'長方形',oval:'橢圓形',diamond:'菱形'};
const ZT={banana:'香蕉',strawberry:'草莓',broccoli:'花椰菜',orange:'橘子',grapes:'葡萄',frog:'青蛙',sun:'太陽',pig:'小豬',bear:'熊',blueberries:'藍莓',snowman:'雪人',eggplant:'茄子',carrot:'紅蘿蔔',cherries:'櫻桃',tree:'樹',whale:'鯨魚',flower:'花',chocolate:'巧克力','pizza slice':'披薩',ball:'球',door:'門',dice:'骰子',egg:'蛋',kite:'風箏',donut:'甜甜圈',TV:'電視','cheese wedge':'起司','picture frame':'相框'};
const ZQ={"ma1": "哪一隻動物會「哞哞」叫？", "ma2": "哪一隻動物會「汪汪」叫？", "ma3": "哪一隻動物會「喵喵」叫？", "ma4": "哪一隻動物會「齁齁」叫？", "ma5": "哪一隻動物會「嘎嘎」叫？", "ma6": "哪一隻動物會「咩咩」叫？", "ma7": "哪一隻動物會「咴咴」叫？", "ma8": "哪一隻動物會「吼～」？", "ma9": "哪一隻動物會「嘶嘶」叫？", "ma10": "哪一隻動物會「嗡嗡」叫？", "ma11": "哪一隻動物會「呱呱」叫？", "ma12": "哪一隻動物會「喔喔喔」叫？", "ma13": "哪一隻動物會「咕咕」叫？", "ma14": "哪一種動物住在水裡？", "ma15": "哪一種動物會飛？", "ma16": "哪一種動物的脖子很長很長？", "ma17": "哪一種動物有黑白條紋？", "ma18": "哪一種動物最大？", "ma19": "哪一種動物最小？", "ma20": "哪一種動物會跳跳跳？", "ma21": "哪一種動物走得很慢很慢？", "ma22": "哪一種動物有硬硬的殼？", "ma23": "哪一種動物給我們牛奶？", "ma24": "哪一種動物會生我們吃的蛋？", "ma25": "哪一個是恐龍？", "ma26": "哪一隻恐龍的脖子很長？", "ma27": "恐龍寶寶是從哪裡出來的？", "ma28": "哪一種動物有 8 隻腳？", "mbd1": "我們用什麼看東西？", "mbd2": "我們用什麼聽聲音？", "mbd3": "我們用什麼聞味道？", "mbd4": "我們用什麼嚐味道？", "mbd5": "我們用什麼走路？", "mbd6": "我們用什麼拍手？", "mbd7": "每天早上和晚上要刷什麼？", "mbd8": "一隻手有幾根手指頭？", "mbd9": "你有幾隻眼睛？", "mbd10": "你有幾個鼻子？", "mbd11": "你有幾隻耳朵？", "mth1": "哪一個是水果？", "mth2": "哪一個可以吃？", "mth3": "哪一個是穿在腳上的？", "mth4": "哪一個會「噗噗」開走？", "mth5": "下雨的時候需要什麼？", "mth6": "我們用什麼刷牙？", "mth7": "你在哪裡睡覺？", "mth8": "哪一個是蔬菜？", "mth9": "什麼是戴在頭上的？", "mth10": "什麼可以在黑黑的地方照亮？", "mth11": "哪一個會在天上飛？", "mth12": "哪一個會浮在水上？", "mnt1": "晚上的天空可以看到什麼？", "mnt2": "白天是什麼給我們光？", "mnt3": "雲裡會掉下什麼？", "mnt4": "雪可以堆成什麼？", "mnt5": "蘋果樹上長什麼？", "mnt6": "哪一個冷冷的，冬天會從天上飄下來？", "mnt7": "植物需要什麼才能長大？", "mnt8": "魚住在哪裡？", "mnt9": "下雨後又出太陽，可以看到什麼？", "mop1": "哪一個是熱的？", "mop2": "哪一個是冷的？", "mop3": "哪一個是快的？", "mop4": "哪一個是大的？", "mop5": "哪一個是小的？", "mop6": "哪一個是濕的？", "mop7": "哪一張臉是開心的？", "mop8": "哪一張臉是難過的？", "mnu1": "腳踏車有幾個輪子？", "mnu2": "汽車有幾個輪子？", "mnu3": "4 的後面是哪個數字？", "mnu4": "3 的前面是哪個數字？", "mnu5": "小鳥有幾隻腳？", "mnu6": "貓咪有幾隻腳？", "mnu7": "哪一個的餅乾比較多？", "mnu8": "哪一個的蘋果比較少？", "mnu9": "9 的後面是哪個數字？", "mnu10": "你有 2 隻手，2 個人一共有幾隻手？", "mnu11": "哪個數字最小？", "mnu12": "三角形有幾條邊？", "mcl1": "消防車是什麼顏色？", "mcl2": "草是什麼顏色？", "mcl3": "雲是什麼顏色？", "mcl4": "檸檬是什麼顏色？", "mcl5": "晚上的天空是什麼顏色？", "mcl6": "南瓜是什麼顏色？", "mcl7": "紅鶴是什麼顏色？", "mcl8": "巧克力是什麼顏色？", "mcl9": "晴天的天空是什麼顏色？", "mcl10": "番茄是什麼顏色？"};
function bank(list,extra={}){return avoid=>{const left=list.filter(b=>!avoid.has(b[0]));if(!left.length)return null;const b=pick(left);
  const q=mk(b[0],b[1],b[2],shuffle([b[2],b[3],b[4]]),Object.assign({},extra));q.how=b[5]?[b[5]]:[`The answer is ${b[2]}.`];
  if(ZQ[b[0]])q.zh=ZQ[b[0]];else if(/^mpa/.test(b[0]))q.zh='下一個是什麼？'+b[1].split('?').slice(1).join('?');
  if(extra.sayQ){q.say=b[1].replace(/[^\p{L}\p{N}\s,.?!'’-]/gu,' ').replace(/\s+/g,' ').trim();delete q.sayQ}return q}}

/* ===== MILO (3): letters, math, colors, shapes, words — everything read aloud ===== */
const CONFUSE={b:['d','p'],d:['b','q'],p:['q','b'],q:['p','d'],m:['n','w'],n:['m','u'],u:['n','v'],w:['m','v'],i:['l','j'],l:['i','t']};
const WORDS3=[['🐱','cat'],['🐶','dog'],['🌞','sun'],['🐷','pig'],['🚌','bus'],['☕','cup'],['🎩','hat'],['🛏️','bed'],['🥚','egg'],['🦊','fox'],['🐮','cow'],['🐝','bee'],['🐜','ant'],['🦉','owl'],['🦇','bat'],['📦','box'],['🚗','car'],['🐛','bug'],['🗺️','map'],['🐔','hen'],['🖊️','pen'],['🧢','cap']];
const SIGHT=['up','on','at','in','go','no','me','we','it','is','to','my','he','she','the','and','see','can'];
const RHYME=[['cat','hat'],['cat','bat'],['fox','box'],['bug','mug'],['sun','bun'],['pig','big'],['bed','red'],['car','jar'],['dog','log'],['hen','pen'],['top','hop'],['map','cap'],['cow','now'],['bee','see']];
const COLOR_THINGS=[['🍌','banana','yellow'],['🍓','strawberry','red'],['🥦','broccoli','green'],['🍊','orange','orange'],['🍇','grapes','purple'],['🐸','frog','green'],['🌞','sun','yellow'],['🐷','pig','pink'],['🐻','bear','brown'],['🫐','blueberries','blue'],['⛄','snowman','white'],['🍆','eggplant','purple'],['🥕','carrot','orange'],['🍒','cherries','red'],['🌲','tree','green'],['🐳','whale','blue'],['🌸','flower','pink'],['🍫','chocolate','brown']];
const MIX=[['red','yellow','orange'],['blue','yellow','green'],['red','blue','purple'],['red','white','pink']];
const SHAPE_THINGS=[['🍕','pizza slice','triangle'],['⚽','ball','circle'],['🚪','door','rectangle'],['🎲','dice','square'],['🥚','egg','oval'],['🪁','kite','diamond'],['🍩','donut','circle'],['📺','TV','rectangle'],['🧀','cheese wedge','triangle'],['🖼️','picture frame','square']];
const ANIMALS=[['🐱','cat'],['🐶','dog'],['🐷','pig'],['🐮','cow'],['🦊','fox'],['🐝','bee'],['🦉','owl'],['🐔','hen'],['🐟','fish'],['🐸','frog'],['🦆','duck'],['🐻','bear'],['🐰','bunny'],['🦁','lion']];
// letters
G('milo','letters',1,()=>{const L=pick(LET),i=LET.indexOf(L);return mk('ml'+L,'Find the letter '+L,L,letterOpts(L),{say:'Find the letter, '+L,big:1,how:[`Sing the alphabet: ${LET.slice(Math.max(0,i-2),i+3).join(' ')}`,`This one is ${L}.`]})});
G('milo','letters',2,()=>{const i=R(25),L=LET[i],A=LET[i+1];return mk('ma'+L,'What comes after '+L+'?',A,letterOpts(A),{say:'What letter comes after '+L+'?',big:1,how:[`Sing the alphabet: ${LET.slice(Math.max(0,i-2),i+1).join(' ')} …`,`After ${L} comes ${A}.`]})});
G('milo','letters',2,()=>{const l=pick(LET).toLowerCase();const s=new Set([l]);for(const x of (CONFUSE[l]||[]))s.add(x);while(s.size<3)s.add(pick(LET).toLowerCase());
  const tip=CONFUSE[l]?`Careful: ${l} and ${CONFUSE[l].join(' and ')} look alike. Look at which way it faces.`:`Big ${l.toUpperCase()} and small ${l} make the same sound.`;
  return mk('mL'+l,'Find small '+l,l,shuffle([...s].slice(0,3)),{say:'Find the small letter, '+l,big:1,how:[`Big ${l.toUpperCase()} → small ${l}.`,tip]})});
G('milo','letters',3,()=>{const i=RI(1,25),L=LET[i],P=LET[i-1];return mk('mb'+L,'What comes before '+L+'?',P,letterOpts(P),{say:'What letter comes before '+L+'?',big:1,how:[`Sing the alphabet: ${LET.slice(Math.max(0,i-3),i+1).join(' ')}`,`Just before ${L} is ${P}.`]})});
G('milo','letters',3,()=>{const [e,w]=pick(WORDS3);const L=w[0].toUpperCase();return mk('mw'+w,w+' starts with…',L,letterOpts(L),{pic:e,say:w+'. '+w+' starts with which letter?',big:1,how:[`Say it slowly: ${w[0]}… ${w}.`,`${w} starts with ${L}.`]})});
// math
G('milo','math',1,()=>{const n=RI(1,5);return mk('mc'+n,'How many dinos?',n,numOpts(n,2,1),{pic:'🦕'.repeat(n),zh:'有幾隻恐龍？',say:'How many dinos?',big:1,how:[`Point and count: ${range(1,n).join(', ')}.`,`There ${n===1?'is 1 dino':'are '+n+' dinos'}.`]})});
G('milo','math',2,()=>{const n=RI(6,10);return mk('me'+n,'How many eggs?',n,numOpts(n,2,1),{pic:'🥚'.repeat(n),zh:'有幾顆蛋？',say:'How many eggs?',big:1,how:[`Point and count: ${range(1,n).join(', ')}.`,`There are ${n} eggs.`]})});
G('milo','math',2,()=>{const a=RI(1,3),b=RI(1,2);return mk('mp'+a+'-'+b,'How many dinos in all?',a+b,numOpts(a+b,2,1),{pic:'🦖'.repeat(a)+' + '+'🦖'.repeat(b),zh:a+' 隻恐龍加 '+b+' 隻恐龍，一共有幾隻？',say:NUMW[a]+' dinos plus '+NUMW[b]+'. How many dinos in all?',big:1,how:[`Count the first group: ${range(1,a).join(', ')}.`,`Keep counting: ${range(a+1,a+b).join(', ')}.`,`${a} + ${b} = ${a+b}.`]})});
G('milo','math',2,()=>{const s=shuffle(range(1,10)).slice(0,3),m=Math.max(...s);return mk('mg'+s.join(''),'Which number is biggest?',m,s,{zh:'哪個數字最大？',say:'Which number is the biggest?',big:1,how:[`Count up: 1, 2, 3 … ${m}.`,`${m} comes last, so it is the biggest.`]})});
G('milo','math',3,()=>{const a=RI(1,6),b=RI(1,10-a);return mk('mn'+a+'+'+b,a+' + '+b+' = ?',a+b,numOpts(a+b,2,1),{zh:a+' 加 '+b+' 等於多少？',say:'What is '+NUMW[a]+' plus '+NUMW[b]+'?',big:1,how:howAdd(a,b)})});
G('milo','math',3,()=>{const a=RI(2,5),b=RI(1,a-1);return mk('mt'+a+'-'+b,a+' − '+b+' = ?',a-b,numOpts(a-b,2,0),{pic:'🍎'.repeat(a-b)+'❌'.repeat(b),zh:a+' 個蘋果，拿走 '+b+' 個，還剩幾個？',say:NUMW[a]+' apples. Take away '+NUMW[b]+'. How many are left?',big:1,how:[`Start with ${a} apples.`,`Take away ${b}. Count back: ${range(a-b,a-1).reverse().join(', ')}.`,`${a} − ${b} = ${a-b}.`]})});
