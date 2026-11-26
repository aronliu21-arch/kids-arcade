/* ---------- questions copied from 遊戲間 (the kids' game hub) ---------- */
const QB=(function(){
const DB={get kids(){return {nora:{seen:S.seen.nora},lucas:{seen:S.seen.lucas},milo:{seen:S.seen.milo}};}};
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rnd(0,a.length-1)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const plain=s=>s.replace(/\{[^}]*\}/g,'');
const zyCol=z=>{const t=(z.match(/[ˊˇˋ˙]/)||[''])[0],b=z.replace(/[ˊˇˋ˙]/g,'').split('');return '<span class="zv">'+(t==='˙'?'<i class="zq">˙</i>':'')+b.map((c,i)=>i===b.length-1&&t&&t!=='˙'?'<i class="zl">'+c+'<b class="zt">'+t+'</b></i>':'<i>'+c+'</i>').join('')+'</span>';};
const zy=s=>s.replace(/([^\s{}])\{([^}]*)\}/g,(m,c,z)=>`<span class="zc"><span class="zch">${c}</span>${zyCol(z)}</span>`);
const zyOnly=s=>(s.match(/\{([^}]*)\}/g)||[]).map(x=>x.slice(1,-1)).join(' ');
const numChoices=(ans,n=4,lo=0,hi=9999)=>{const s=new Set([ans]);let g=0;while(s.size<n&&g++<300){const v=ans+pick([-1,1,-2,2,-3,3,-5,5,-10,10]);if(v>=lo&&v<=hi)s.add(v)}return shuffle([...s]).map(v=>({val:v,html:String(v)}))};
const opts=(vals,ans)=>shuffle(vals).map(v=>({val:v,html:String(v)}));
const WORDS=[ // marked zhuyin, English, emoji
['大{ㄉㄚˋ}','big'],['小{ㄒㄧㄠˇ}','small'],['山{ㄕㄢ}','mountain','⛰️'],['水{ㄕㄨㄟˇ}','water','💧'],['火{ㄏㄨㄛˇ}','fire','🔥'],['日{ㄖˋ}','sun','☀️'],['月{ㄩㄝˋ}','moon','🌙'],['人{ㄖㄣˊ}','person'],['手{ㄕㄡˇ}','hand','✋'],['球{ㄑㄧㄡˊ}','ball','⚽'],['狗{ㄍㄡˇ}','dog','🐶'],['貓{ㄇㄠ}','cat','🐱'],['魚{ㄩˊ}','fish','🐟'],['鳥{ㄋㄧㄠˇ}','bird','🐦'],['花{ㄏㄨㄚ}','flower','🌸'],['雨{ㄩˇ}','rain','🌧️'],['風{ㄈㄥ}','wind'],['星{ㄒㄧㄥ}','star','⭐'],['書{ㄕㄨ}','book','📖'],['家{ㄐㄧㄚ}','home','🏠'],['心{ㄒㄧㄣ}','heart','❤️'],['跑{ㄆㄠˇ}','run'],['踢{ㄊㄧ}','kick'],['吃{ㄔ}','eat'],['爸{ㄅㄚˋ}','dad'],['媽{ㄇㄚ}','mom'],
['朋{ㄆㄥˊ}友{ㄧㄡˇ}','friend'],['老{ㄌㄠˇ}師{ㄕ}','teacher'],['學{ㄒㄩㄝˊ}校{ㄒㄧㄠˋ}','school'],['足{ㄗㄨˊ}球{ㄑㄧㄡˊ}','soccer ball','⚽'],['太{ㄊㄞˋ}陽{ㄧㄤˊ}','sun','☀️'],['月{ㄩㄝˋ}亮{ㄌㄧㄤ˙}','moon','🌙'],['水{ㄕㄨㄟˇ}果{ㄍㄨㄛˇ}','fruit'],['蘋{ㄆㄧㄥˊ}果{ㄍㄨㄛˇ}','apple','🍎'],['香{ㄒㄧㄤ}蕉{ㄐㄧㄠ}','banana','🍌'],['恐{ㄎㄨㄥˇ}龍{ㄌㄨㄥˊ}','dinosaur','🦖'],['電{ㄉㄧㄢˋ}腦{ㄋㄠˇ}','computer','💻'],['媽{ㄇㄚ}媽{ㄇㄚ}','mom'],['爸{ㄅㄚˋ}爸{ㄅㄚ˙}','dad'],['下{ㄒㄧㄚˋ}雨{ㄩˇ}','raining'],['圖{ㄊㄨˊ}書{ㄕㄨ}館{ㄍㄨㄢˇ}','library'],
['手{ㄕㄡˇ}機{ㄐㄧ}','phone','📱'],['飛{ㄈㄟ}機{ㄐㄧ}','airplane','✈️'],['汽{ㄑㄧˋ}車{ㄔㄜ}','car','🚗'],['火{ㄏㄨㄛˇ}車{ㄔㄜ}','train','🚆'],['牛{ㄋㄧㄡˊ}奶{ㄋㄞˇ}','milk','🥛'],['麵{ㄇㄧㄢˋ}包{ㄅㄠ}','bread','🍞'],['西{ㄒㄧ}瓜{ㄍㄨㄚ}','watermelon','🍉'],['雨{ㄩˇ}傘{ㄙㄢˇ}','umbrella','☂️'],['教{ㄐㄧㄠˋ}室{ㄕˋ}','classroom'],['開{ㄎㄞ}心{ㄒㄧㄣ}','happy'],['生{ㄕㄥ}日{ㄖˋ}','birthday','🎈'],['蛋{ㄉㄢˋ}糕{ㄍㄠ}','cake','🍰'],['鉛{ㄑㄧㄢ}筆{ㄅㄧˇ}','pencil','✏️'],['老{ㄌㄠˇ}虎{ㄏㄨˇ}','tiger','🐯'],['大{ㄉㄚˋ}象{ㄒㄧㄤˋ}','elephant','🐘'],['長{ㄔㄤˊ}頸{ㄐㄧㄥˇ}鹿{ㄌㄨˋ}','giraffe','🦒'],['兔{ㄊㄨˋ}子{ㄗ˙}','rabbit','🐰'],['冰{ㄅㄧㄥ}淇{ㄑㄧˊ}淋{ㄌㄧㄣˊ}','ice cream','🍦'],['蝴{ㄏㄨˊ}蝶{ㄉㄧㄝˊ}','butterfly','🦋']];
const PICW=WORDS.filter(w=>w[2]);

/* ---- generic mission builder: unique in mission, unseen for Nora ---- */
function build(n,gid,kid,gen){const out=[],ids=new Set();let seen=new Set(DB.kids[kid].seen[gid]||[]),tries=0;
  while(out.length<n){const q=gen(out.length);tries++;
    if(ids.has(q.id)&&tries<400)continue;
    if(kid==='nora'&&seen.has(q.id)){if(tries<80)continue;DB.kids[kid].seen[gid]=[];seen=new Set()}
    ids.add(q.id);out.push(q)}
  return out}

/* ---- NORA 1: Kangaroo ladder ---- */
const KANG=[
[1,'Lily has 8 stickers. She gives 3 to Zoe, then gets 5 more from Ana. How many does Lily have now?',[8,10,11,16],10,'8 − 3 = 5, then 5 + 5 = 10.'],
[1,'What comes next? 2, 4, 8, 16, ?',[24,30,32,34],32,'Each number doubles, so 16 × 2 = 32.'],
[1,'3 dogs and 2 birds walk by. How many legs in all?',[10,14,16,20],16,'Dogs: 3 × 4 = 12. Birds: 2 × 2 = 4. Total 16.'],
[1,'A ribbon is 20 cm long. Mia cuts pieces of 4 cm. How many pieces?',[4,5,6,16],5,'20 ÷ 4 = 5.'],
[1,'Which is the biggest?',['3 × 9','5 × 6','4 × 7','2 × 13'],'5 × 6','The products are 27, 30, 28 and 26. The biggest is 30.'],
[2,'Ella reads 6 pages a day. How many days to finish a 48-page book?',[6,7,8,9],8,'48 ÷ 6 = 8.'],
[2,'A soccer team has 11 players. How many players are on 3 teams?',[30,31,33,36],33,'11 × 3 = 33.'],
[2,'Today is Wednesday. What day will it be in 10 days?',['Friday','Saturday','Sunday','Monday'],'Saturday','10 days = 1 week + 3 days. Wednesday plus 3 days is Saturday.'],
[2,'Ana is 4th from the front of a line and 6th from the back. How many girls are in the line?',[9,10,11,24],9,'4 + 6 − 1 = 9, because Ana is counted twice.'],
[2,'Double a number, add 3, and you get 17. What is the number?',[6,7,8,10],7,'17 − 3 = 14, and half of 14 is 7.'],
[3,'A big triangle is split into 4 small triangles by joining the middles of its sides. How many triangles of any size can you find?',[4,5,6,8],5,'4 small triangles plus the 1 big one makes 5.'],
[3,'Zoe has twice as many marbles as Lily. Together they have 18. How many does Zoe have?',[6,9,12,14],12,'Lily has 6, Zoe has 12. 6 + 12 = 18.'],
[3,'Mia is 9. Her mom is 4 times as old. How old will her mom be when Mia is 18?',[36,40,45,54],45,'Mom is 36 now. In 9 years she is 45.'],
[3,'What is 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10?',[45,50,55,60],55,'Pair them: 1+10, 2+9, 3+8, 4+7, 5+6. Five pairs of 11 is 55.'],
[3,'Which number between 20 and 40 is a multiple of both 4 and 9?',[24,32,36,40],36,'4 × 9 = 36, and 36 is between 20 and 40.'],
[4,'A cake is cut with 3 straight cuts. What is the most pieces you can make?',[6,7,8,9],7,'One cut makes 2 pieces, two cuts make 4, and three cuts make 7 at most.'],
[4,'Ella has 6 coins, all 5¢ or 10¢, worth 40¢ in all. How many 10¢ coins does she have?',[1,2,3,4],2,'2 tens = 20¢ and 4 fives = 20¢. That is 6 coins and 40¢.'],
[4,'How many squares of any size are on a 3 × 3 grid?',[9,13,14,16],14,'9 small + 4 medium (2×2) + 1 big = 14.'],
[4,'Six friends each give one high-five to every other friend. How many high-fives happen?',[12,15,30,36],15,'5 + 4 + 3 + 2 + 1 = 15.'],
[4,'A snail climbs 3 m each day and slides back 2 m each night. The wall is 10 m. On which day does it reach the top?',[7,8,9,10],8,'After 7 days it is at 7 m. On day 8 it climbs 3 m to reach 10 m.'],
[5,'How many different 3-digit numbers can you make using the digits 1, 2 and 3 once each?',[3,4,6,9],6,'123, 132, 213, 231, 312, 321.'],
[5,'A rectangle has a perimeter of 24 cm and a length of 8 cm. What is its area?',[24,32,48,64],32,'The width is 4 cm, because 8+4+8+4 = 24. Area is 8 × 4 = 32.'],
[5,'Mia and Zoe are 25 years old together. Mia is 5 years older. How old is Mia?',[10,15,20,25],15,'Zoe is 10 and Mia is 15. 10 + 15 = 25.'],
[5,'What is the last digit of 7 × 7 × 7 × 7?',[1,3,7,9],1,'7×7 = 49, 49×7 = 343, 343×7 = 2401. It ends in 1.'],
[5,'How many 2-digit numbers have digits that add up to 9?',[8,9,10,11],9,'18, 27, 36, 45, 54, 63, 72, 81, 90.'],
[1,'Ana has 12 stickers. She gives 4 to Mia and 3 to Zoe. How many does she have left?',[3,5,7,9],5,'12 − 4 = 8, then 8 − 3 = 5.'],
[1,'What comes next? 5, 10, 15, 20, ?',[24,25,30,35],25,'Each number goes up by 5, so 20 + 5 = 25.'],
[1,'How many wheels are on 4 bikes and 3 tricycles?',[14,17,18,20],17,'Bikes: 4 × 2 = 8. Tricycles: 3 × 3 = 9. Total 17.'],
[1,'A pizza has 8 slices. Lily eats 3 and Ella eats 2. How many slices are left?',[2,3,4,5],3,'3 + 2 = 5 eaten, so 8 − 5 = 3 left.'],
[1,'Which number is the smallest?',['7 + 8','4 × 4','20 − 6','3 × 5'],'20 − 6','The values are 15, 16, 14 and 15. The smallest is 14.'],
[2,'Mia has 3 times as many cards as Zoe. Zoe has 7 cards. How many cards do they have together?',[21,24,28,31],28,'Mia has 3 × 7 = 21. Together 21 + 7 = 28.'],
[2,'Today is Monday. What day will it be in 12 days?',['Thursday','Friday','Saturday','Sunday'],'Saturday','12 days = 1 week + 5 days. Monday plus 5 days is Saturday.'],
[2,'A bus has 30 seats. 18 are full, then 5 girls get on. How many seats are still empty?',[7,12,13,23],7,'18 + 5 = 23 seats are full, so 30 − 23 = 7 are empty.'],
[2,'Multiply a number by 3, then subtract 4, and you get 14. What is the number?',[4,5,6,7],6,'14 + 4 = 18, and 18 ÷ 3 = 6.'],
[2,'Ella walks 2 km a day for 6 days, then 3 km on day 7. How far does she walk in all?',[12,14,15,18],15,'6 × 2 = 12, and 12 + 3 = 15.'],
[3,'Zoe is 7th from the left and 5th from the right in a row of girls. How many girls are in the row?',[11,12,13,35],11,'7 + 5 − 1 = 11, because Zoe is counted twice.'],
[3,'Three numbers in a row (like 4, 5, 6) add up to 27. What is the biggest one?',[9,10,11,12],10,'The middle number is 27 ÷ 3 = 9, so the numbers are 8, 9 and 10.'],
[3,'A minute hand starts at 12. How many degrees does it turn in 20 minutes?',[60,90,120,180],120,'20 minutes is one third of an hour, and one third of 360° is 120°.'],
[3,'Ana has 5 more stickers than Mia. Together they have 25. How many does Ana have?',[10,15,20,25],15,'Mia has 10 and Ana has 15. 10 + 15 = 25.'],
[3,'How many 2-digit numbers are bigger than 85?',[13,14,15,16],14,'The numbers are 86 up to 99, which is 14 numbers.'],
[4,'A frog hops 4 steps forward, then 1 step back, over and over. After how many forward hops does she first reach step 13?',[3,4,5,6],4,'After each forward and back she is 3 steps further. After 3 rounds she is on step 9, and the 4th forward hop takes her to 13.'],
[4,'Four friends each shake hands once with every other friend. How many handshakes happen?',[4,6,8,12],6,'3 + 2 + 1 = 6.'],
[4,'How many rectangles of any size (squares count) are in a 2 × 2 grid of squares?',[4,6,9,10],9,'4 single squares, 2 flat pairs, 2 tall pairs and 1 big square make 9.'],
[4,'In 4 years, Mia will be twice as old as she was 5 years ago. How old is Mia now?',[12,13,14,15],14,'At 14: in 4 years she is 18, and 5 years ago she was 9. 18 is twice 9.'],
[4,'A box has 12 balls, red and blue. There are twice as many red as blue. How many red balls?',[6,8,9,10],8,'4 blue and 8 red make 12, and 8 is twice 4.'],
[5,'What is 1 + 3 + 5 + 7 + 9 + 11?',[30,32,36,40],36,'Adding the first 6 odd numbers gives 6 × 6 = 36.'],
[5,'A square has a perimeter of 36 cm. What is its area?',[72,81,96,144],81,'Each side is 36 ÷ 4 = 9 cm. Area is 9 × 9 = 81.'],
[5,'Ella has 10 coins, all 5¢ or 10¢, worth 70¢ in all. How many 10¢ coins does she have?',[3,4,5,6],4,'4 tens = 40¢ and 6 fives = 30¢. That is 10 coins and 70¢.'],
[5,'Zoe picks 2 different colors from red, blue, green and yellow. How many different pairs can she make?',[4,6,8,12],6,'RB, RG, RY, BG, BY, GY makes 6 pairs.'],
[5,'Two numbers multiply to 36 and add to 13. What is the bigger one?',[6,9,12,18],9,'9 × 4 = 36 and 9 + 4 = 13.']];
function kangMake(n,kid){const seen=new Set(DB.kids[kid].seen.kang||[]);const out=[];
  for(let r=0;r<n;r++){const lvl=r+1;let pool=KANG.map((x,i)=>[x,i]).filter(([x,i])=>x[0]===lvl&&!seen.has('k'+i)&&!out.some(o=>o.id==='k'+i));
    if(!pool.length){pool=KANG.map((x,i)=>[x,i]).filter(([x,i])=>x[0]===lvl);DB.kids[kid].seen.kang=(DB.kids[kid].seen.kang||[]).filter(id=>!pool.some(([x,i])=>id==='k'+i))}
    const [x,i]=pick(pool);out.push({id:'k'+i,lvl:`Rung ${lvl} of 5`,prompt:`<div class="q">${x[1]}</div>`,say:x[1],choices:opts(x[3]===undefined?[]:x[2],x[3]),answer:x[3],why:x[4]})}
  return out}

/* ---- NORA 2: Zhuyin story detective ---- */
const STORIES=[
['小{ㄒㄧㄠˇ}美{ㄇㄟˇ}的{ㄉㄜ˙}書{ㄕㄨ}不{ㄅㄨˋ}見{ㄐㄧㄢˋ}了{ㄌㄜ˙}。書{ㄕㄨ}不{ㄅㄨˋ}在{ㄗㄞˋ}桌{ㄓㄨㄛ}子{ㄗ˙}上{ㄕㄤˋ},也{ㄧㄝˇ}不{ㄅㄨˋ}在{ㄗㄞˋ}書{ㄕㄨ}包{ㄅㄠ}裡{ㄌㄧˇ}。貓{ㄇㄠ}在{ㄗㄞˋ}椅{ㄧˇ}子{ㄗ˙}下{ㄒㄧㄚˋ}面{ㄇㄧㄢˋ}玩{ㄨㄢˊ}書{ㄕㄨ}。','書{ㄕㄨ}在{ㄗㄞˋ}哪{ㄋㄚˇ}裡{ㄌㄧˇ}?',['桌{ㄓㄨㄛ}子{ㄗ˙}上{ㄕㄤˋ}','椅{ㄧˇ}子{ㄗ˙}下{ㄒㄧㄚˋ}','書{ㄕㄨ}包{ㄅㄠ}裡{ㄌㄧˇ}'],1,`Mei's book is not on the desk or in her bag. The cat is playing with it under the chair.`],
['小{ㄒㄧㄠˇ}玲{ㄌㄧㄥˊ}的{ㄉㄜ˙}書{ㄕㄨ}包{ㄅㄠ}是{ㄕˋ}紅{ㄏㄨㄥˊ}色{ㄙㄜˋ}的{ㄉㄜ˙},不{ㄅㄨˋ}是{ㄕˋ}藍{ㄌㄢˊ}色{ㄙㄜˋ}的{ㄉㄜ˙}。','哪{ㄋㄚˇ}個{ㄍㄜ˙}是{ㄕˋ}小{ㄒㄧㄠˇ}玲{ㄌㄧㄥˊ}的{ㄉㄜ˙}書{ㄕㄨ}包{ㄅㄠ}?',['紅{ㄏㄨㄥˊ}色{ㄙㄜˋ}','藍{ㄌㄢˊ}色{ㄙㄜˋ}','綠{ㄌㄩˋ}色{ㄙㄜˋ}'],0,`Ling's backpack is red, not blue.`],
['足{ㄗㄨˊ}球{ㄑㄧㄡˊ}比{ㄅㄧˇ}賽{ㄙㄞˋ}在{ㄗㄞˋ}下{ㄒㄧㄚˋ}午{ㄨˇ}三{ㄙㄢ}點{ㄉㄧㄢˇ}。小{ㄒㄧㄠˇ}花{ㄏㄨㄚ}四{ㄙˋ}點{ㄉㄧㄢˇ}才{ㄘㄞˊ}到{ㄉㄠˋ}。','她{ㄊㄚ}來{ㄌㄞˊ}得{ㄉㄜ˙}早{ㄗㄠˇ}還{ㄏㄞˊ}是{ㄕˋ}晚{ㄨㄢˇ}?',['早{ㄗㄠˇ}','晚{ㄨㄢˇ}','沒{ㄇㄟˊ}來{ㄌㄞˊ}'],1,'The game is at 3 and Hua arrives at 4, so she is late.'],
['小{ㄒㄧㄠˇ}美{ㄇㄟˇ}有{ㄧㄡˇ}三{ㄙㄢ}個{ㄍㄜ˙}蘋{ㄆㄧㄥˊ}果{ㄍㄨㄛˇ}。她{ㄊㄚ}吃{ㄔ}了{ㄌㄜ˙}一{ㄧ}個{ㄍㄜ˙}。','她{ㄊㄚ}還{ㄏㄞˊ}有{ㄧㄡˇ}幾{ㄐㄧˇ}個{ㄍㄜ˙}?',['一{ㄧ}個{ㄍㄜ˙}','兩{ㄌㄧㄤˇ}個{ㄍㄜ˙}','三{ㄙㄢ}個{ㄍㄜ˙}'],1,'Mei had 3 apples and ate 1, so 2 are left.'],
['天{ㄊㄧㄢ}上{ㄕㄤˋ}有{ㄧㄡˇ}太{ㄊㄞˋ}陽{ㄧㄤˊ},沒{ㄇㄟˊ}有{ㄧㄡˇ}雲{ㄩㄣˊ}。','今{ㄐㄧㄣ}天{ㄊㄧㄢ}的{ㄉㄜ˙}天{ㄊㄧㄢ}氣{ㄑㄧˋ}怎{ㄗㄣˇ}麼{ㄇㄜ˙}樣{ㄧㄤˋ}?',['下{ㄒㄧㄚˋ}雨{ㄩˇ}','晴{ㄑㄧㄥˊ}天{ㄊㄧㄢ}','下{ㄒㄧㄚˋ}雪{ㄒㄩㄝˇ}'],1,'There is sun and no clouds, so it is a sunny day.'],
['小{ㄒㄧㄠˇ}花{ㄏㄨㄚ}的{ㄉㄜ˙}朋{ㄆㄥˊ}友{ㄧㄡˇ}在{ㄗㄞˋ}學{ㄒㄩㄝˊ}校{ㄒㄧㄠˋ}等{ㄉㄥˇ}她{ㄊㄚ}。','小{ㄒㄧㄠˇ}花{ㄏㄨㄚ}要{ㄧㄠˋ}去{ㄑㄩˋ}哪{ㄋㄚˇ}裡{ㄌㄧˇ}?',['學{ㄒㄩㄝˊ}校{ㄒㄧㄠˋ}','公{ㄍㄨㄥ}園{ㄩㄢˊ}','醫{ㄧ}院{ㄩㄢˋ}'],0,`Hua's friend is waiting at school, so she is going to school.`],
['媽{ㄇㄚ}媽{ㄇㄚ}買{ㄇㄞˇ}了{ㄌㄜ˙}香{ㄒㄧㄤ}蕉{ㄐㄧㄠ}和{ㄏㄜˊ}蘋{ㄆㄧㄥˊ}果{ㄍㄨㄛˇ}。小{ㄒㄧㄠˇ}美{ㄇㄟˇ}喜{ㄒㄧˇ}歡{ㄏㄨㄢ}黃{ㄏㄨㄤˊ}色{ㄙㄜˋ}的{ㄉㄜ˙}水{ㄕㄨㄟˇ}果{ㄍㄨㄛˇ}。','小{ㄒㄧㄠˇ}美{ㄇㄟˇ}想{ㄒㄧㄤˇ}吃{ㄔ}什{ㄕㄜˊ}麼{ㄇㄜ˙}?',['香{ㄒㄧㄤ}蕉{ㄐㄧㄠ}','蘋{ㄆㄧㄥˊ}果{ㄍㄨㄛˇ}','水{ㄕㄨㄟˇ}'],0,'Mei likes yellow fruit. Bananas are yellow, apples are not.'],
['小{ㄒㄧㄠˇ}花{ㄏㄨㄚ}有{ㄧㄡˇ}兩{ㄌㄧㄤˇ}隻{ㄓ}貓{ㄇㄠ}和{ㄏㄜˊ}一{ㄧ}隻{ㄓ}狗{ㄍㄡˇ}。','小{ㄒㄧㄠˇ}花{ㄏㄨㄚ}一{ㄧˊ}共{ㄍㄨㄥˋ}有{ㄧㄡˇ}幾{ㄐㄧˇ}隻{ㄓ}動{ㄉㄨㄥˋ}物{ㄨˋ}?',['兩{ㄌㄧㄤˇ}隻{ㄓ}','三{ㄙㄢ}隻{ㄓ}','四{ㄙˋ}隻{ㄓ}'],1,'Hua has 2 cats and 1 dog, so she has 3 animals.'],
['今{ㄐㄧㄣ}天{ㄊㄧㄢ}是{ㄕˋ}小{ㄒㄧㄠˇ}玲{ㄌㄧㄥˊ}的{ㄉㄜ˙}生{ㄕㄥ}日{ㄖˋ}。媽{ㄇㄚ}媽{ㄇㄚ}給{ㄍㄟˇ}她{ㄊㄚ}一{ㄧ}個{ㄍㄜ˙}大{ㄉㄚˋ}蛋{ㄉㄢˋ}糕{ㄍㄠ}。','今{ㄐㄧㄣ}天{ㄊㄧㄢ}是{ㄕˋ}什{ㄕㄜˊ}麼{ㄇㄜ˙}日{ㄖˋ}子{ㄗ˙}?',['生{ㄕㄥ}日{ㄖˋ}','考{ㄎㄠˇ}試{ㄕˋ}','放{ㄈㄤˋ}假{ㄐㄧㄚˋ}'],0,'It is the birthday of Ling, and her mom gave her a big cake.'],
['小{ㄒㄧㄠˇ}雅{ㄧㄚˇ}想{ㄒㄧㄤˇ}喝{ㄏㄜ}水{ㄕㄨㄟˇ}。杯{ㄅㄟ}子{ㄗ˙}在{ㄗㄞˋ}桌{ㄓㄨㄛ}子{ㄗ˙}上{ㄕㄤˋ}。','小{ㄒㄧㄠˇ}雅{ㄧㄚˇ}要{ㄧㄠˋ}拿{ㄋㄚˊ}什{ㄕㄜˊ}麼{ㄇㄜ˙}?',['杯{ㄅㄟ}子{ㄗ˙}','書{ㄕㄨ}','球{ㄑㄧㄡˊ}'],0,'Ya wants a drink of water, and the cup is on the table.'],
['下{ㄒㄧㄚˋ}雨{ㄩˇ}了{ㄌㄜ˙},小{ㄒㄧㄠˇ}琪{ㄑㄧˊ}帶{ㄉㄞˋ}了{ㄌㄜ˙}一{ㄧ}把{ㄅㄚˇ}傘{ㄙㄢˇ}。','小{ㄒㄧㄠˇ}琪{ㄑㄧˊ}為{ㄨㄟˋ}什{ㄕㄜˊ}麼{ㄇㄜ˙}帶{ㄉㄞˋ}傘{ㄙㄢˇ}?',['下{ㄒㄧㄚˋ}雨{ㄩˇ}了{ㄌㄜ˙}','天{ㄊㄧㄢ}氣{ㄑㄧˋ}很{ㄏㄣˇ}熱{ㄖㄜˋ}','要{ㄧㄠˋ}去{ㄑㄩˋ}游{ㄧㄡˊ}泳{ㄩㄥˇ}'],0,'It is raining, so Qi brought an umbrella.'],
['小{ㄒㄧㄠˇ}美{ㄇㄟˇ}每{ㄇㄟˇ}天{ㄊㄧㄢ}早{ㄗㄠˇ}上{ㄕㄤˋ}七{ㄑㄧ}點{ㄉㄧㄢˇ}起{ㄑㄧˇ}床{ㄔㄨㄤˊ}。今{ㄐㄧㄣ}天{ㄊㄧㄢ}她{ㄊㄚ}六{ㄌㄧㄡˋ}點{ㄉㄧㄢˇ}就{ㄐㄧㄡˋ}起{ㄑㄧˇ}床{ㄔㄨㄤˊ}了{ㄌㄜ˙}。','今{ㄐㄧㄣ}天{ㄊㄧㄢ}她{ㄊㄚ}起{ㄑㄧˇ}得{ㄉㄜ˙}早{ㄗㄠˇ}還{ㄏㄞˊ}是{ㄕˋ}晚{ㄨㄢˇ}?',['早{ㄗㄠˇ}','晚{ㄨㄢˇ}','一{ㄧ}樣{ㄧㄤˋ}'],0,'Mei usually gets up at 7, but today she got up at 6, which is early.'],
['足{ㄗㄨˊ}球{ㄑㄧㄡˊ}隊{ㄉㄨㄟˋ}有{ㄧㄡˇ}十{ㄕˊ}一{ㄧ}個{ㄍㄜ˙}人{ㄖㄣˊ}。小{ㄒㄧㄠˇ}花{ㄏㄨㄚ}是{ㄕˋ}其{ㄑㄧˊ}中{ㄓㄨㄥ}一{ㄧ}個{ㄍㄜ˙}。','球{ㄑㄧㄡˊ}隊{ㄉㄨㄟˋ}有{ㄧㄡˇ}幾{ㄐㄧˇ}個{ㄍㄜ˙}人{ㄖㄣˊ}?',['十{ㄕˊ}個{ㄍㄜ˙}','十{ㄕˊ}一{ㄧ}個{ㄍㄜ˙}','十{ㄕˊ}二{ㄦˋ}個{ㄍㄜ˙}'],1,'The soccer team has 11 people.'],
['小{ㄒㄧㄠˇ}玲{ㄌㄧㄥˊ}喜{ㄒㄧˇ}歡{ㄏㄨㄢ}看{ㄎㄢˋ}書{ㄕㄨ}。她{ㄊㄚ}常{ㄔㄤˊ}常{ㄔㄤˊ}去{ㄑㄩˋ}圖{ㄊㄨˊ}書{ㄕㄨ}館{ㄍㄨㄢˇ}。','小{ㄒㄧㄠˇ}玲{ㄌㄧㄥˊ}常{ㄔㄤˊ}常{ㄔㄤˊ}去{ㄑㄩˋ}哪{ㄋㄚˇ}裡{ㄌㄧˇ}?',['圖{ㄊㄨˊ}書{ㄕㄨ}館{ㄍㄨㄢˇ}','公{ㄍㄨㄥ}園{ㄩㄢˊ}','商{ㄕㄤ}店{ㄉㄧㄢˋ}'],0,'Ling loves books and often goes to the library.'],
['小{ㄒㄧㄠˇ}花{ㄏㄨㄚ}的{ㄉㄜ˙}花{ㄏㄨㄚ}開{ㄎㄞ}了{ㄌㄜ˙}。花{ㄏㄨㄚ}是{ㄕˋ}黃{ㄏㄨㄤˊ}色{ㄙㄜˋ}的{ㄉㄜ˙}。','花{ㄏㄨㄚ}是{ㄕˋ}什{ㄕㄜˊ}麼{ㄇㄜ˙}顏{ㄧㄢˊ}色{ㄙㄜˋ}?',['紅{ㄏㄨㄥˊ}色{ㄙㄜˋ}','黃{ㄏㄨㄤˊ}色{ㄙㄜˋ}','藍{ㄌㄢˊ}色{ㄙㄜˋ}'],1,'The flower is yellow.'],
['弟{ㄉㄧˋ}弟{ㄉㄧ˙}比{ㄅㄧˇ}小{ㄒㄧㄠˇ}美{ㄇㄟˇ}小{ㄒㄧㄠˇ}。小{ㄒㄧㄠˇ}美{ㄇㄟˇ}九{ㄐㄧㄡˇ}歲{ㄙㄨㄟˋ},弟{ㄉㄧˋ}弟{ㄉㄧ˙}六{ㄌㄧㄡˋ}歲{ㄙㄨㄟˋ}。','誰{ㄕㄟˊ}比{ㄅㄧˇ}較{ㄐㄧㄠˋ}大{ㄉㄚˋ}?',['小{ㄒㄧㄠˇ}美{ㄇㄟˇ}','弟{ㄉㄧˋ}弟{ㄉㄧ˙}','一{ㄧ}樣{ㄧㄤˋ}大{ㄉㄚˋ}'],0,'Mei is 9 and her little brother is 6, so Mei is older.'],
['小{ㄒㄧㄠˇ}琪{ㄑㄧˊ}早{ㄗㄠˇ}上{ㄕㄤˋ}吃{ㄔ}了{ㄌㄜ˙}麵{ㄇㄧㄢˋ}包{ㄅㄠ}和{ㄏㄜˊ}牛{ㄋㄧㄡˊ}奶{ㄋㄞˇ}。','小{ㄒㄧㄠˇ}琪{ㄑㄧˊ}喝{ㄏㄜ}了{ㄌㄜ˙}什{ㄕㄜˊ}麼{ㄇㄜ˙}?',['牛{ㄋㄧㄡˊ}奶{ㄋㄞˇ}','果{ㄍㄨㄛˇ}汁{ㄓ}','水{ㄕㄨㄟˇ}'],0,'Qi had bread and milk. Bread is eaten, and milk is the drink.'],
['星{ㄒㄧㄥ}期{ㄑㄧ}六{ㄌㄧㄡˋ}不{ㄅㄨˋ}用{ㄩㄥˋ}上{ㄕㄤˋ}學{ㄒㄩㄝˊ}。小{ㄒㄧㄠˇ}美{ㄇㄟˇ}在{ㄗㄞˋ}家{ㄐㄧㄚ}玩{ㄨㄢˊ}。','今{ㄐㄧㄣ}天{ㄊㄧㄢ}小{ㄒㄧㄠˇ}美{ㄇㄟˇ}在{ㄗㄞˋ}哪{ㄋㄚˇ}裡{ㄌㄧˇ}?',['學{ㄒㄩㄝˊ}校{ㄒㄧㄠˋ}','家{ㄐㄧㄚ}裡{ㄌㄧˇ}','公{ㄍㄨㄥ}園{ㄩㄢˊ}'],1,'There is no school on Saturday, and Mei is playing at home.'],
['媽{ㄇㄚ}媽{ㄇㄚ}說{ㄕㄨㄛ}:「先{ㄒㄧㄢ}洗{ㄒㄧˇ}手{ㄕㄡˇ},再{ㄗㄞˋ}吃{ㄔ}飯{ㄈㄢˋ}。」','小{ㄒㄧㄠˇ}美{ㄇㄟˇ}要{ㄧㄠˋ}先{ㄒㄧㄢ}做{ㄗㄨㄛˋ}什{ㄕㄜˊ}麼{ㄇㄜ˙}?',['洗{ㄒㄧˇ}手{ㄕㄡˇ}','吃{ㄔ}飯{ㄈㄢˋ}','看{ㄎㄢˋ}書{ㄕㄨ}'],0,'Mom says to wash your hands first, then eat.'],
['小{ㄒㄧㄠˇ}雅{ㄧㄚˇ}有{ㄧㄡˇ}五{ㄨˇ}支{ㄓ}筆{ㄅㄧˇ}。她{ㄊㄚ}給{ㄍㄟˇ}朋{ㄆㄥˊ}友{ㄧㄡˇ}兩{ㄌㄧㄤˇ}支{ㄓ}。','她{ㄊㄚ}還{ㄏㄞˊ}有{ㄧㄡˇ}幾{ㄐㄧˇ}支{ㄓ}筆{ㄅㄧˇ}?',['兩{ㄌㄧㄤˇ}支{ㄓ}','三{ㄙㄢ}支{ㄓ}','四{ㄙˋ}支{ㄓ}'],1,'Ya had 5 pens and gave 2 away, so 3 are left.']];
