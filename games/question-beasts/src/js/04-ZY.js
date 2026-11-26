// colors
G('milo','colors',1,()=>{const c=pick(BASIC_COLORS);return mk('mk'+c,'Find '+c.toUpperCase(),c,pick3(c,BASIC_COLORS),{kind:'color',zh:'找出'+ZC[c]+'！',say:'Find the color '+c,how:[`${cap(c)} is the color of ${COLOR_EX[c]}.`]})});
G('milo','colors',2,()=>{const [e,nm,c]=pick(COLOR_THINGS);return mk('mo'+nm,'What color is the '+nm+'?',c,pick3(c,Object.keys(COLORS)),{kind:'color',pic:e,zh:(ZT[nm]||nm)+'是什麼顏色？',say:'What color is the '+nm+'?',how:[`Look at the ${nm}: ${e}`,`The ${nm} is ${c}.`]})});
G('milo','colors',3,()=>{const [a,b,c]=pick(MIX);return mk('mx'+a+b,cap(a)+' + '+b+' = ?',c,pick3(c,['orange','green','purple','pink','brown']),{kind:'color',picHTML:`<span class="mix"><span class="sw sm" style="background:${COLORS[a]}"></span>+<span class="sw sm" style="background:${COLORS[b]}"></span></span>`,zh:ZC[a]+'加'+ZC[b]+'，會變成什麼顏色？',say:'If you mix '+a+' and '+b+' paint, what color do you get?',how:[`Mix ${a} paint and ${b} paint together.`,`You get ${c}!`]})});
// shapes
G('milo','shapes',1,()=>{const s=pick(FIRST_SHAPES);return mk('mh'+s,'Find the '+s.toUpperCase(),s,pick3(s,FIRST_SHAPES),{kind:'shape',zh:'找出'+ZS[s]+'！',say:'Find the '+s,how:[SHAPE_FACT[s]]})});
G('milo','shapes',2,()=>{const s=pick(ALL_SHAPES);return mk('mH'+s,'Find the '+s.toUpperCase(),s,pick3(s,ALL_SHAPES),{kind:'shape',zh:'找出'+ZS[s]+'！',say:'Find the '+s,how:[SHAPE_FACT[s]]})});
G('milo','shapes',2,()=>{const c=pick(BASIC_COLORS),s=pick(FIRST_SHAPES);const oc=pick(BASIC_COLORS.filter(x=>x!==c)),os=pick(FIRST_SHAPES.filter(x=>x!==s));
  return mk('mq'+c+s,'Find the '+c.toUpperCase()+' '+s.toUpperCase(),c+'-'+s,shuffle([c+'-'+s,oc+'-'+s,c+'-'+os]),{kind:'cshape',zh:'找出'+ZC[c]+'的'+ZS[s]+'！',say:'Find the '+c+' '+s,how:[`It must be ${c} AND a ${s}.`,SHAPE_FACT[s]]})});
G('milo','shapes',2,()=>{const [s,n]=pick([['triangle',3],['square',4],['rectangle',4],['diamond',4]]);return mk('mi'+s,'How many sides?',n,n===3?[3,4,5]:[3,4,5],{picHTML:shapeSVG(s,'#ffcd75'),zh:ZS[s]+'有幾條邊？',say:'How many sides does the '+s+' have?',big:1,how:[`Touch each side and count: ${range(1,n).join(', ')}.`,`A ${s} has ${n} sides.`]})});
G('milo','shapes',3,()=>{const [e,nm,s]=pick(SHAPE_THINGS);return mk('mS'+nm,'A '+nm+' looks like a…',s,pick3(s,ALL_SHAPES),{kind:'shape',pic:e,zh:(ZT[nm]||nm)+'看起來像什麼形狀？',say:'What shape is the '+nm+'?',how:[`Look at the ${nm}: ${e}`,SHAPE_FACT[s],`So it looks like a ${s}.`]})});
G('milo','shapes',3,()=>{const [s,n]=pick([['triangle',3],['square',4],['rectangle',4],['circle',0]]);return mk('mC'+s,'How many corners?',n,n===0?[0,1,4]:n===3?[2,3,4]:[3,4,5],{picHTML:shapeSVG(s,'#73eff7'),zh:ZS[s]+'有幾個角？',say:'How many corners does the '+s+' have?',big:1,how:n?[`Touch each pointy corner: ${range(1,n).join(', ')}.`,`A ${s} has ${n} corners.`]:['A circle is round all the way around.','It has 0 corners!']})});
// words
G('milo','words',1,()=>{const [e,w]=pick(ANIMALS);const o=shuffle(ANIMALS.filter(x=>x[1]!==w)).slice(0,2).map(x=>x[0]);return mk('mA'+w,'Which one is a '+w.toUpperCase()+'?',e,shuffle([e,...o]),{say:'Which one is a '+w+'?',big:1,how:[`${w.split('').join('-')} spells ${w}.`,`${e} is a ${w}.`]})});
G('milo','words',2,()=>{const w=pick(SIGHT);const o=shuffle(SIGHT.filter(x=>x!==w&&x.length===w.length)).slice(0,2);while(o.length<2)o.push(pick(SIGHT.filter(x=>x!==w&&!o.includes(x))));
  return mk('ms'+w,'Find the word “'+w+'”',w,shuffle([w,...o]),{kind:'word',say:'Find the word, '+w,how:[`Sound it out: ${w.split('').join(' - ')}.`,`That spells “${w}”.`]})});
G('milo','words',3,()=>{const [e,w]=pick(WORDS3);const o=shuffle(WORDS3.filter(x=>x[1]!==w&&x[1].length===w.length)).slice(0,2).map(x=>x[1]);
  return mk('mr'+w,'Which word matches the picture?',w,shuffle([w,...o]),{pic:e,kind:'word',say:'Which word matches the picture?',how:[`The picture is a ${w}: ${e}`,`Sound it out: ${w.split('').join(' - ')} → ${w}.`]})});
G('milo','words',3,()=>{const [e,w]=pick(WORDS3.filter(x=>'aeiou'.includes(x[1][1])));const v=w[1];const opts=shuffle([v,...shuffle(['a','e','i','o','u'].filter(x=>x!==v)).slice(0,2)]);
  return mk('mv'+w,w[0]+' _ '+w[2],v,opts,{pic:e,kind:'word',say:w+'. What letter is missing?',how:[`Say it slowly: ${w[0]} - ${v} - ${w[2]}.`,`The middle sound is “${v}”, so ${w}.`]})});
G('milo','words',3,()=>{const [a,b]=pick(RHYME);const end=a.slice(-2);const o=shuffle([...new Set(RHYME.flat())].filter(x=>x.slice(-2)!==end)).slice(0,2);
  return mk('mR'+a+b,'Which word rhymes with “'+a+'”?',b,shuffle([b,...o]),{kind:'word',say:'Which word rhymes with '+a+'?',how:[`“${a}” ends with “-${end}”.`,`“${b}” ends with “-${end}” too, so they rhyme!`]})});

/* ===== LUCAS (6): add/sub, reading, 注音 by ear, time & money, logic ===== */
const ZY=[['ㄅ','玻'],['ㄆ','坡'],['ㄇ','摸'],['ㄈ','佛'],['ㄉ','得'],['ㄊ','特'],['ㄋ','訥'],['ㄌ','勒'],['ㄍ','哥'],['ㄎ','科'],['ㄏ','喝'],['ㄐ','基'],['ㄑ','欺'],['ㄒ','希'],['ㄚ','啊'],['ㄛ','喔'],['ㄜ','鵝'],['ㄧ','衣'],['ㄨ','屋'],['ㄩ','迂']];
const ZY_SOUND={'ㄅ':'b','ㄆ':'p','ㄇ':'m','ㄈ':'f','ㄉ':'d','ㄊ':'t','ㄋ':'n','ㄌ':'l','ㄍ':'g','ㄎ':'k','ㄏ':'h','ㄐ':'j','ㄑ':'q','ㄒ':'x','ㄓ':'zh','ㄔ':'ch','ㄕ':'sh','ㄖ':'r','ㄗ':'z','ㄘ':'c','ㄙ':'s','ㄚ':'a','ㄛ':'o','ㄜ':'e','ㄝ':'ê','ㄞ':'ai','ㄟ':'ei','ㄠ':'ao','ㄡ':'ou','ㄢ':'an','ㄣ':'en','ㄤ':'ang','ㄥ':'eng','ㄦ':'er','ㄧ':'i','ㄨ':'u','ㄩ':'ü'};
const SYL=[['ㄅㄚ','八'],['ㄇㄚ','媽'],['ㄊㄚ','他'],['ㄏㄨㄚ','花'],['ㄕㄨ','書'],['ㄕㄢ','山'],['ㄇㄠ','貓'],['ㄈㄟ','飛'],['ㄒㄧㄥ','星'],['ㄔ','吃'],['ㄉㄨㄛ','多'],['ㄐㄧ','雞'],['ㄊㄧㄢ','天'],['ㄈㄥ','風'],['ㄔㄜ','車'],['ㄉㄠ','刀'],['ㄍㄠ','高'],['ㄒㄧ','西'],['ㄍㄜ','哥'],['ㄅㄟ','杯'],['ㄆㄚ','趴'],['ㄙㄢ','三'],['ㄓㄨ','豬'],['ㄎㄞ','開']];
const zySplit=z=>[...z].map(c=>`${c} (${ZY_SOUND[c]||'?'})`).join(' + ');
G('lucas','zhuyin',1,()=>{if(!Speech.zh())return null;const [z,c]=pick(ZY);const s=new Set([z]);while(s.size<3)s.add(pick(ZY)[0]);
  return mk('lz'+z,'Tap the sound you hear',z,shuffle([...s]),{sayZh:c,big:1,how:[`Listen again: ${c}.`,`${z} makes the “${ZY_SOUND[z]}” sound.`]})});
const sylQ=(tier,similar)=>()=>{if(!Speech.zh())return null;const [z,c]=pick(SYL);let pool=SYL.filter(x=>x[0]!==z);
  if(similar){const sim=pool.filter(x=>[...x[0]].some(ch=>z.includes(ch)));if(sim.length>=2)pool=sim}
  const o=shuffle(pool).slice(0,2).map(x=>x[0]);return mk('lZ'+tier+z,'Tap the sound you hear',z,shuffle([z,...o]),{sayZh:c,big:1,how:[`Listen again: ${c}.`,`${z} = ${zySplit(z)}.`,`Blend them: ${[...z].map(ch=>ZY_SOUND[ch]).join('')}.`]})};
G('lucas','zhuyin',2,sylQ(2,false));G('lucas','zhuyin',3,sylQ(3,true));
// add/sub
G('lucas','addsub',1,()=>{const a=RI(3,15),b=RI(2,20-a);return mk('la'+a+'+'+b,a+' + '+b+' = ?',a+b,numOpts(a+b,3,0),{big:1,how:howAdd(a,b)})});
G('lucas','addsub',1,()=>{const a=RI(8,20),b=RI(2,a-1);return mk('ls'+a+'-'+b,a+' − '+b+' = ?',a-b,numOpts(a-b,3,0),{big:1,how:howSub(a,b)})});
G('lucas','addsub',2,()=>{const a=RI(12,58),b=RI(11,39);return mk('lA'+a+'+'+b,a+' + '+b+' = ?',a+b,numOpts(a+b,10,0),{big:1,how:howAdd(a,b)})});
G('lucas','addsub',2,()=>{const a=RI(30,99),b=RI(11,a-10);return mk('lS'+a+'-'+b,a+' − '+b+' = ?',a-b,numOpts(a-b,10,0),{big:1,how:howSub(a,b)})});
G('lucas','addsub',2,()=>{const a=RI(3,12),s=RI(a+3,20);return mk('lm'+a+'+'+s,a+' + ? = '+s,s-a,numOpts(s-a,3,1),{big:1,how:[`Count up from ${a} to ${s}: ${range(a+1,s).join(', ')}.`,`That is ${s-a} steps, so ${a} + ${s-a} = ${s}.`]})});
G('lucas','addsub',3,()=>{const A=RI(8,20),B=RI(3,9),C=RI(2,8);return mk('lc'+A+'-'+B+'-'+C,'Lucas has '+A+' trading cards. He wins '+B+' more, then gives '+C+' to Milo. How many cards now?',A+B-C,numOpts(A+B-C,4,0),{how:[`Wins ${B}: ${A} + ${B} = ${A+B}.`,`Gives away ${C}: ${A+B} − ${C} = ${A+B-C}.`]})});
G('lucas','addsub',3,()=>{const a=RI(2,5),b=RI(2,5);return mk('lg'+a+'x'+b,a+' bags have '+b+' candies each. How many candies?',a*b,numOpts(a*b,3,1),{how:[`Count by ${b}s, ${a} times: ${range(1,a).map(i=>i*b).join(', ')}.`,`${a} bags × ${b} = ${a*b} candies.`]})});
G('lucas','addsub',3,()=>{const a=RI(110,480),b=RI(105,399);return mk('lH'+a+'+'+b,a+' + '+b+' = ?',a+b,numOpts(a+b,20,0),{big:1,how:howAdd(a,b)})});
// time & money
G('lucas','time',1,()=>{const h=RI(1,12);const o=shuffle(range(1,12).filter(x=>x!==h)).slice(0,2);return mk('lt'+h,'What time is it?',tstr(h,0),shuffle([tstr(h,0),...o.map(x=>tstr(x,0))]),{picHTML:clockSVG(h,0),big:1,how:['The long hand points to 12, so it is “o’clock”.',`The short hand points to ${h}.`,`It is ${tstr(h,0)}.`]})});
G('lucas','time',2,()=>{const h=RI(1,12);return mk('lT'+h,'What time is it?',tstr(h,30),shuffle([tstr(h,30),tstr(h%12+1,30),tstr(h,0)]),{picHTML:clockSVG(h,30),big:1,how:['The long hand points to 6, so it is “thirty” (half past).',`The short hand is between ${h} and ${h%12+1}, so the hour is ${h}.`,`It is ${tstr(h,30)}.`]})});
G('lucas','time',2,()=>{const n=RI(2,4);const coins=Array.from({length:n},()=>pick([1,5,10,10,5]));coins.sort((a,b)=>b-a);const s=coins.reduce((a,b)=>a+b,0);
  return mk('lC'+coins.join('-'),'How much money?',s+'¢',numOpts(s,5,1).map(v=>v+'¢'),{picHTML:coinsHTML(coins),big:1,how:['Start with the biggest coin and count on.',coins.map((c,i)=>coins.slice(0,i+1).reduce((a,b)=>a+b,0)+'¢').join(' → '),`Total: ${s}¢.`]})});
G('lucas','time',3,()=>{const h=RI(1,9),add=RI(2,3),m=pick([0,30]);const hh=x=>((x-1)%12)+1,e=hh(h+add);return mk('lE'+h+m+add,`It is ${tstr(h,m)}. Soccer starts in ${add} hours. What time does it start?`,tstr(e,m),shuffle([tstr(e,m),tstr(hh(e+1),m),tstr(hh(e+11),m)]),{how:[`Count the hours: ${range(1,add).map(i=>tstr(hh(h+i),m)).join(' → ')}.`,`Soccer starts at ${tstr(e,m)}.`]})});
G('lucas','time',3,()=>{const have=pick([25,30,40,50]),cost=RI(1,(have-5)/5)*5;return mk('lM'+have+'-'+cost,`You have ${have}¢. A sticker costs ${cost}¢. How much is left?`,(have-cost)+'¢',numOpts(have-cost,5,0).map(v=>v+'¢'),{how:[...howSub(have,cost),`So ${have-cost}¢ is left.`]})});
// logic
G('lucas','logic',1,()=>{const k=pick([2,5,10,3]),s=k*RI(1,6);const seq=[s,s+k,s+2*k,s+3*k];return mk('lp'+s+'+'+k,'What comes next? '+seq.join(', ')+', ?',s+4*k,numOpts(s+4*k,Math.max(2,k-1),1),{big:1,how:[`Each number goes up by ${k}.`,`${s+3*k} + ${k} = ${s+4*k}.`]})});
G('lucas','logic',1,()=>{const sets=[['🔴','🔵'],['🐶','🐱'],['⭐','🌙'],['🍎','🍌']];const [a,b]=pick(sets);const pat=pick(['AB','ABB','AAB']);
  const unit=pat.split('').map(x=>x==='A'?a:b);const full=[...unit,...unit,...unit];const n=full.length-1;const shown=full.slice(0,n);
  return mk('lP'+pat+a,'What comes next?',full[n],shuffle([a,b,'❓'].slice(0,2).concat([pick(['🟢','🐸','☀️'])])),{pic:shown.join(' ')+' ?',big:1,how:[`The pattern repeats: ${unit.join(' ')}.`,`Next is ${full[n]}.`]})});
const LUCAS_LOGIC2=[
 ['lo1','Which one does not belong? 🍎 🍌 🚗 🍇','🚗','🍌','🍇','The others are fruits. A car is not food!'],
 ['lo2','Which one does not belong? 🐶 🐱 🐟 🌳','🌳','🐟','🐱','The others are animals. A tree is a plant.'],
 ['lo3','Which number does not belong? 2, 4, 7, 8','7','2','8','2, 4 and 8 are even. 7 is odd.'],
 ['lo4','Which is the longest?','1 meter','50 cm','10 cm','1 meter is 100 cm, so it is longer than 50 cm and 10 cm.'],
 ['lo5','Which is the heaviest?','Elephant','Cat','Mouse','An elephant weighs as much as a car!'],
 ['lo6','Which is the biggest number?','98','89','79','Compare the tens first: 98 has 9 tens, 89 and 79 have fewer. So 98 is biggest.'],
 ['lo7','Which number has 4 tens and 7 ones?','47','74','11','4 tens = 40, plus 7 ones = 47.'],
 ['lo8','Tom is taller than Sam. Sam is taller than Kim. Who is the tallest?','Tom','Sam','Kim','Line them up: Tom > Sam > Kim.'],
 ['lo9','Which one does not belong? circle, square, triangle, banana','banana','circle','square','Circle, square and triangle are shapes. A banana is a fruit.'],
 ['lo10','Which is the shortest time?','1 minute','1 hour','1 day','1 minute is 60 seconds. An hour is 60 minutes, so a minute is shortest.'],
 ['lo11','What is 10 more than 47?','57','48','37','Adding 10 makes the tens digit go up by 1: 47 → 57.'],
 ['lo12','Which one does not belong? 🚗 🚌 🚲 🐴','🐴','🚌','🚲','Car, bus and bike are machines. A horse is an animal.']
];
G('lucas','logic',2,bank(LUCAS_LOGIC2));
const LUCAS_KANGAROO=[
 ['lk1','Sam has 5 apples. He eats 2 and buys 4 more. How many apples does he have now?','7','6','11','5 − 2 = 3, then 3 + 4 = 7.'],
 ['lk2','What comes next? 2, 4, 6, 8, ?','10','9','12','Each number goes up by 2: 8 + 2 = 10.'],
 ['lk3','There are 4 cats. Each cat has 4 legs. How many legs altogether?','16','8','12','Count by 4s: 4, 8, 12, 16.'],
 ['lk4','Mia is taller than Ben. Ben is taller than Leo. Who is the shortest?','Leo','Ben','Mia','Mia > Ben > Leo, so Leo is shortest.'],
 ['lk5','How many sides do 2 triangles have altogether?','6','3','5','Each triangle has 3 sides: 3 + 3 = 6.'],
 ['lk6','I am a number. If you add 5 to me, you get 12. What number am I?','7','17','6','12 − 5 = 7. Check: 7 + 5 = 12.'],
 ['lk7','10 birds sit on a tree. 3 fly away, then 5 more land. How many birds are on the tree?','12','8','18','10 − 3 = 7, then 7 + 5 = 12.'],
 ['lk8','Today is Monday. What day will it be in 3 days?','Thursday','Wednesday','Friday','Tuesday (1), Wednesday (2), Thursday (3).'],
 ['lk9','Which number is between 39 and 41?','40','42','30','39, 40, 41 — 40 is in the middle.'],
 ['lk10','5 kids stand in a line. Lucas is exactly in the middle. How many kids are in front of him?','2','3','1','Middle of 5 is spot 3, so 2 kids are in front.'],
 ['lk11','A pizza has 8 slices. Mom eats 2 and Dad eats 3. How many slices are left?','3','5','4','2 + 3 = 5 eaten. 8 − 5 = 3 left.'],
 ['lk12','What is double 9?','18','11','19','Double means 2 times: 9 + 9 = 18.'],
 ['lk13','You have 3 dimes (10¢ each) and 2 nickels (5¢ each). How much money is that?','40¢','35¢','50¢','10 + 10 + 10 = 30¢, then 5 + 5 = 10¢. 30 + 10 = 40¢.'],
 ['lk14','Ana has 6 cards. Tom has 3 more cards than Ana. How many cards do they have together?','15','9','12','Tom has 6 + 3 = 9. Together: 6 + 9 = 15.'],
 ['lk15','What comes next? ▲ ● ● ▲ ● ● ▲ ?','●','▲','■','The pattern is ▲ ● ●, so after ▲ comes ●.'],
 ['lk16','Count by 5s: 5, 10, 15, ?','20','16','25','15 + 5 = 20.'],
 ['lk17','A spider has 8 legs. How many legs do 2 spiders have?','16','10','18','8 + 8 = 16.'],
 ['lk18','There are 3 red balls and twice as many blue balls. How many balls altogether?','9','6','5','Twice 3 is 6 blue balls. 3 + 6 = 9.'],
 ['lk19','Leo has 2 shirts and 3 pants. How many different outfits can he make?','6','5','3','Each shirt goes with 3 pants: 3 + 3 = 6 outfits.'],
 ['lk20','A worm is 9 cm long. It grows 2 cm every week. How long is it after 3 weeks?','15 cm','11 cm','13 cm','It grows 2 + 2 + 2 = 6 cm. 9 + 6 = 15 cm.'],
 ['lk21','Ana is 4th in line. There are 3 kids behind her. How many kids are in the line?','7','6','8','3 kids in front, Ana, and 3 behind: 3 + 1 + 3 = 7.'],
 ['lk22','Which is heavier: 1 kg of rocks or 1 kg of feathers?','Same weight','Rocks','Feathers','Both weigh 1 kg, so they weigh the same!'],
 ['lk23','A bike has 2 wheels and a car has 4. How many wheels do 3 bikes and 1 car have?','10','9','12','3 bikes: 2 + 2 + 2 = 6. Add the car’s 4: 6 + 4 = 10.'],
 ['lk24','I am a 2-digit number. My tens digit is 3. My ones digit is 2 more than that. What am I?','35','32','53','Tens = 3, ones = 3 + 2 = 5, so the number is 35.'],
 ['lk25','Sam reads 4 pages every day. How many pages does he read in one week?','28','11','24','A week has 7 days. Count by 4s seven times: 4, 8, 12, 16, 20, 24, 28.'],
 ['lk26','What comes next? 1, 3, 6, 10, ?','15','13','14','It adds 2, then 3, then 4, then 5: 10 + 5 = 15.']
];
G('lucas','logic',3,bank(LUCAS_KANGAROO));
