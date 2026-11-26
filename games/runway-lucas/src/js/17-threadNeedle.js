/* 🧵 3: Thread the Needle — tap when the needle's eye lines up with the thread */
function threadNeedle(){let n=0,earn=0,lives=3,t=0,shot=null;const N=12;
  const s=cScreen('<h2>🪡 Thread the Needle</h2><div class="jhud"><span id="hN">🪡 0/'+N+'</span><span id="hL">❤️❤️❤️</span><span id="hM">💰 0</span></div><p class="note">Tap anywhere when the <b>eye</b> of the needle lines up with the thread!</p><div class="play needle" id="pl"><svg viewBox="0 0 400 260" id="nd"><path d="M0 130H40" stroke="#e64980" stroke-width="5" stroke-linecap="round"/><path id="thr" d="M40 130H70" stroke="#e64980" stroke-width="5" stroke-linecap="round"/><g id="ndl"><rect x="292" y="-120" width="16" height="320" rx="8" fill="#ced4da" stroke="#4a3426" stroke-width="3"/><path d="M292 200L300 236L308 200Z" fill="#ced4da" stroke="#4a3426" stroke-width="3"/><ellipse id="eye" cx="300" cy="0" rx="5" ry="16" fill="#fbf7ef" stroke="#4a3426" stroke-width="2"/></g></svg></div>');
  const pl=s.querySelector('#pl'),ndl=s.querySelector('#ndl'),eye=s.querySelector('#eye'),thr=s.querySelector('#thr'),host=s.querySelector('.cin');let ey=0;
  const eh=()=>Math.max(7,16-n*.8),sp=()=>1.6+n*.25;
  pl.onclick=()=>{if(shot)return;shot={x:70,hit:Math.abs(ey-130)<eh()-2,perf:Math.abs(ey-130)<3};tone(900,.08,'triangle',.06);};
  lp(s,'#nd',dt=>{if(!shot){t+=dt;ey=130+Math.sin(t*sp())*90;ndl.setAttribute('transform','translate(0 '+(ey)+')');eye.setAttribute('ry',eh());}
    else{shot.x+=520*dt;thr.setAttribute('d','M40 130H'+Math.min(shot.x,shot.hit?360:290));
      if(shot.x>=(shot.hit?360:290)){const r=pl.getBoundingClientRect(),hr=host.getBoundingClientRect();
        if(shot.hit){n++;const m=shot.perf?3:2;earn+=m;sfx.win();popFx(host,r.left-hr.left+r.width*.75,r.top-hr.top+20,(shot.perf?'Perfect! ':'')+'+$'+m);}else{lives--;sfx.boing();popFx(host,r.left-hr.left+r.width*.75,r.top-hr.top+20,'Missed!','#c92a2a');}
        shot=null;setTimeout(()=>thr.setAttribute('d','M40 130H70'),250);}}
    TX(s.querySelector('#hN'),'🪡 '+n+'/'+N);TX(s.querySelector('#hL'),'❤️'.repeat(Math.max(0,lives))+'🤍'.repeat(3-Math.max(0,lives)));TX(s.querySelector('#hM'),'💰 '+earn);
    if(n>=N||lives<=0){setTimeout(()=>endJob(earn,n>=N?'🪡 All threaded!':'🪡 Out of thread!','sew'),500);return false;}});}
/* 📦 2: Shoe Pairs — flip cards and find matching pairs before time runs out */
function shoePairs(){let T=70,earn=0,board=0;
  const s=cScreen('<h2>👟 Shoe Pairs</h2><div class="jhud"><span id="hT">⏱ 70</span><span id="hB">Board 1</span><span id="hM">💰 0</span></div><p class="note">The shoes got mixed up! Flip two boxes to find each pair.</p><div class="pairs" id="pr"></div>');
  const host=s.querySelector('.cin');
  const deal=()=>{board++;const np=Math.min(8,4+board*2),pk=CAT.shoes.items.slice().sort(()=>Math.random()-.5).slice(0,np),cards=pk.concat(pk).sort(()=>Math.random()-.5);let open=[],lock=false,left=np;
    const pr=s.querySelector('#pr');pr.style.gridTemplateColumns='repeat('+(np>6?4:4)+',1fr)';pr.innerHTML=cards.map((it,i)=>'<button class="card" data-i="'+i+'"><div class="back">📦</div><div class="front it">'+thumb('shoes',it)+'</div></button>').join('');fitThumbs();
    pr.querySelectorAll('.card').forEach(c=>c.onclick=()=>{if(lock||c.classList.contains('up'))return;c.classList.add('up');tone(700,.04,'triangle',.05);open.push(c);
      if(open.length===2){lock=true;const [a,b]=open;if(cards[+a.dataset.i]===cards[+b.dataset.i]){setTimeout(()=>{a.classList.add('got');b.classList.add('got');earn+=1;sfx.good();const r=b.getBoundingClientRect(),hr=host.getBoundingClientRect();popFx(host,r.left-hr.left,r.top-hr.top,'+$1');open=[];lock=false;left--;if(!left){earn+=2;sfx.win();popFx(host,host.clientWidth/2,160,'Board clear! +$2');setTimeout(deal,700);}},300);}
        else setTimeout(()=>{a.classList.remove('up');b.classList.remove('up');open=[];lock=false;},700);}});
    TX(s.querySelector('#hB'),'Board '+board);};
  deal();lp(s,'#pr',dt=>{T-=dt;TX(s.querySelector('#hT'),'⏱ '+Math.ceil(T));TX(s.querySelector('#hM'),'💰 '+earn);if(T<=0){endJob(earn,'👟 Time! You matched '+earn+' pairs','sort');return false;}});}
/* 📦 3: Box Stacker — tap to drop the sliding box; overhang falls off */
function boxStack(){let earn=0,w=46,x=0,dir=1,v=34,stack=[{x:27,w:46}],perfect=0;const COL=['#ffd8a8','#ffc9c9','#d0bfff','#a5d8ff','#b2f2bb','#ffec99'];
  const s=cScreen('<h2>📦 Box Stacker</h2><div class="jhud"><span id="hN">📦 0</span><span id="hP">✨ 0</span><span id="hM">💰 0</span></div><p class="note">Tap to drop the box. Line it up perfectly to keep it big!</p><div class="play stackp" id="pl"><div id="tower"></div><div class="mov" id="mv"></div></div>');
  const pl=s.querySelector('#pl'),tw=s.querySelector('#tower'),mv=s.querySelector('#mv'),host=s.querySelector('.cin');const H=8;
  const draw=()=>{const off=Math.max(0,stack.length-8);tw.innerHTML=stack.map((b,i)=>'<div class="sb" style="left:'+b.x+'%;width:'+b.w+'%;bottom:'+((i-off)*H)+'%;background:'+COL[i%6]+'">'+(i?'📦':'')+'</div>').join('');mv.style.bottom=((stack.length-off)*H)+'%';mv.style.width=w+'%';mv.style.background=COL[stack.length%6];};
  pl.onclick=()=>{const top=stack[stack.length-1],l=Math.max(x,top.x),r=Math.min(x+w,top.x+top.w),ov=r-l;
    if(ov<=0){sfx.boing();endJob(earn,'📦 Crash! Tower of '+(stack.length-1),'sort');return;}
    let nb;if(Math.abs(x-top.x)<1.2){nb={x:top.x,w:top.w};perfect++;earn+=2;sfx.win();popFx(host,host.clientWidth/2,140,'✨ Perfect! +$2');}else{nb={x:l,w:ov};earn+=1;tone(500+stack.length*30,.08,'triangle',.08);
      const cut=document.createElement('div');cut.className='sb cut';cut.style.width=(w-ov)+'%';cut.style.left=(x<top.x?x:r)+'%';cut.style.bottom=mv.style.bottom;cut.style.background=mv.style.background;pl.appendChild(cut);setTimeout(()=>cut.remove(),700);}
    stack.push(nb);w=nb.w;v+=2.5;x=dir>0?0:100-w;draw();
    if(stack.length>=26){sfx.win();confetti();endJob(earn+5,'📦 Sky-high tower! Bonus +$5','sort');}};
  draw();let PWc=pl.clientWidth,fr=0;lp(s,'#mv',dt=>{if(++fr%30===0)PWc=pl.clientWidth;x+=dir*v*dt;if(x<0){x=0;dir=1;}if(x>100-w){x=100-w;dir=-1;}mv.style.transform='translate3d('+(x*PWc/100).toFixed(1)+'px,0,0)';
    TX(s.querySelector('#hN'),'📦 '+(stack.length-1));TX(s.querySelector('#hP'),'✨ '+perfect);TX(s.querySelector('#hM'),'💰 '+earn);});}
const JOBGAMES={cash:['cafeRush','bobaCatch','ovenPop'],sew:['sewMachine','sewButtons','threadNeedle'],sort:['stockConveyor','shoePairs','boxStack']};
const JOBNAMES={cafeRush:'☕ Café Rush',bobaCatch:'🧋 Boba Catch',ovenPop:'🥐 Oven Pop',sewMachine:'🧵 Sewing Machine',sewButtons:'🔘 Button Fix',threadNeedle:'🪡 Thread the Needle',stockConveyor:'📦 Conveyor Belt',shoePairs:'👟 Shoe Pairs',boxStack:'📦 Box Stacker'};



/* idle life: blink and glance now and then (cheap: only animates for a moment) */
setInterval(()=>{const f=document.getElementById('fig');if(!f||document.hidden)return;f.classList.add('bl');setTimeout(()=>f.classList.remove('bl'),220);},4300);
setInterval(()=>{const f=document.getElementById('fig');if(!f||document.hidden)return;f.classList.add('lk');setTimeout(()=>f.classList.remove('lk'),1850);},7000);
setTimeout(()=>{if(!bootLinks())showModes();},50);
window.__test={pop:()=>({on:POP.on,step:POP.step}),themes:()=>THEMES.length,tagCount:th=>ORDER.reduce((a,c)=>a+CAT[c].items.filter(i=>i.tags.includes(th)).length,0),state:()=>({look:JSON.parse(JSON.stringify(look)),theme:theme.id,running:running}),judge:()=>judge().map(x=>[x[2],x[3],x[4]]),runway:runway,wear:(c,id)=>wear(c,find(c,id)),tab:t=>{tab=t;renderTabs();renderItems();}};
/* ================= Fashion District: learning jobs ================= */
/* Each question: id, q, o (options, o[0] is always the right one before shuffling), why. Studio questions also have r: reasons (r[0] correct). */
const LBANK={
studio:[
['s1','Lucas has 2 hats and 3 shirts. How many different hat-and-shirt outfits can he make?',['6','5','3','8'],'Each of the 2 hats goes with each of the 3 shirts: 3 + 3 = 6.',['Each hat goes with all 3 shirts, so 3 + 3','Add them: 2 + 3','There are 3 shirts, so 3']],
['s2','Beads: 🔵 🔴 🔵 🔴 🔵 🔴 … What color is the 9th bead?',['🔵 Blue','🔴 Red','🟢 Green','🟡 Yellow'],'Blue is at 1, 3, 5, 7, 9. The odd places are all blue.',['Blue is at every odd place: 1, 3, 5, 7, 9','9 is a big number, so red','The last bead is always red']],
['s3','Rex is taller than Lucas. Lucas is taller than Ben. Who is the shortest?',['Ben','Lucas','Rex','We can’t tell'],'Line them up: Rex, then Lucas, then Ben. Ben is at the short end.',['Put them in order from tall to short: Rex, Lucas, Ben','Ben is named last','Lucas is in the middle, so he is shortest']],
['s4','5 boys stand in a line. Lucas is right in the middle. How many boys are in front of him?',['2','3','1','5'],'In the middle of 5 means 2 in front, Lucas, and 2 behind.',['Middle of 5: 2 in front, Lucas, 2 behind','5 boys, so 5','Half of 5 is about 3']],
['s5','A shirt has 4 buttons. How many buttons are on 3 shirts?',['12','7','8','10'],'4 + 4 + 4 = 12.',['Add 4 three times: 4 + 4 + 4','Add 4 + 3','Count 3 shirts and 4 buttons: 4']],
['s6','Lucas has 10 stickers. He gives 3 to Rex, then gets 5 from Marco. How many does he have now?',['12','8','18','7'],'10 − 3 = 7, then 7 + 5 = 12.',['Take away 3, then add 5: 10 − 3 + 5','10 + 3 + 5','Only count the 5 new ones']],
['s7','What number is missing? 2, 4, 6, __, 10',['8','7','9','12'],'The numbers jump by 2 each time: 6 + 2 = 8.',['Each number is 2 more than the one before','7 comes after 6','It must be between 6 and 10, so 9']],
['s8','A square has 4 corners. How many corners do 3 squares have?',['12','7','8','9'],'4 + 4 + 4 = 12 corners.',['Each square has 4, so 4 + 4 + 4','3 + 4 = 7','A square looks like 4, so 4 × 2']],
['s9','Lucas finds 7 socks. How many full pairs can he make?',['3','4','7','2'],'A pair is 2 socks. 2 + 2 + 2 = 6, and 1 sock is left over.',['3 pairs use 6 socks, and 1 is left alone','7 is near 8, and 8 makes 4 pairs','Every sock is a pair']],
['s10','Lucas is 6 years old. How old will he be in 3 years?',['9','3','8','10'],'6 + 3 = 9.',['Each year he gets 1 year older: 6 + 3','6 − 3 = 3','He turns 7, then stops']],
['s11','Hats on a shelf: 🎩 🧢 🎩 🧢 🎩 🧢 … What is the 10th hat?',['🧢 Cap','🎩 Top hat','👒 Sun hat','⛑️ Helmet'],'The cap is at every even place: 2, 4, 6, 8, 10.',['Caps are at the even places, and 10 is even','The pattern starts with a top hat, so it ends with one','10 is a big number, so a top hat']],
['s12','Each boy wears 2 shoes. How many shoes do 4 boys wear?',['8','6','4','2'],'2 + 2 + 2 + 2 = 8.',['Count by 2s four times: 2, 4, 6, 8','4 + 2 = 6','4 boys means 4 shoes']],
['s13','The clock says 3 o’clock. What time will it be 2 hours later?',['5 o’clock','1 o’clock','2 o’clock','6 o’clock'],'Move the short hand forward 2 numbers: 3 → 4 → 5.',['Count forward 2 hours: 4, then 5','Later means go backward: 3 − 2','Add 3 + 3']],
['s14','3 apples weigh the same as 1 melon. Which is heavier: 1 melon or 2 apples?',['1 melon','2 apples','They weigh the same','We can’t tell'],'1 melon = 3 apples, and 3 apples are heavier than 2 apples.',['A melon weighs the same as 3 apples, and 3 is more than 2','2 is more than 1','Apples are always heavier']],
['s15','Lucas builds stairs with cubes: 1 cube, then 2 cubes, then 3 cubes. How many cubes in all?',['6','3','5','9'],'1 + 2 + 3 = 6.',['Add every step: 1 + 2 + 3','The tallest step has 3','3 steps × 3 cubes']],
['s16','I am a number. If you add 4 to me, you get 10. What number am I?',['6','14','4','10'],'Take the 4 back off: 10 − 4 = 6.',['Go backward: 10 − 4','10 + 4 = 14','The answer is in the question: 4']],
['s17','A table has 4 legs and a chair has 4 legs. How many legs do 2 tables and 1 chair have?',['12','8','6','10'],'4 + 4 + 4 = 12 legs.',['3 things with 4 legs each: 4 + 4 + 4','2 tables × 4 = 8','2 + 1 = 3, plus 3 more']],
['s18','Rex, Lucas and Ben run a race. Lucas is not first. Ben is not first and not last. Who wins?',['Rex','Lucas','Ben','Nobody'],'Lucas isn’t first and Ben isn’t first, so Rex must be first.',['Cross out who can’t be first: only Rex is left','Rex is named first','Ben is in the middle, so he wins']],
['s19','Lucas cuts a square sandwich from one corner to the opposite corner. What shapes does he get?',['2 triangles','2 squares','4 triangles','2 circles'],'One cut from corner to corner makes 2 triangles.',['A corner-to-corner cut makes 2 three-sided pieces','Squares cut in half stay squares','Every cut makes 4 pieces']],
['s20','Today is Monday. What day is it 2 days later?',['Wednesday','Tuesday','Thursday','Sunday'],'Monday → Tuesday → Wednesday.',['Count 2 days forward: Tuesday, Wednesday','The next day is Tuesday','Count backward 2 days']],
['s21','12 cookies are shared equally by 4 boys. How many cookies does each boy get?',['3','4','8','16'],'Give 1 to each boy at a time: after 3 rounds all 12 are gone.',['Share them out 1 at a time until none are left','12 − 4 = 8','12 + 4 = 16']],
['s22','Lucas is on step 2 of a ladder. He climbs up 3 steps. Which step is he on now?',['Step 5','Step 3','Step 6','Step 1'],'2 + 3 = 5.',['Start at 2 and count up 3: 3, 4, 5','He climbed 3, so step 3','2 × 3 = 6']],
['s23','How many legs do 2 dogs and 1 bird have?',['10','12','8','6'],'Dogs: 4 + 4 = 8. Bird: 2. 8 + 2 = 10.',['Dogs have 4 legs, birds have 2: 4 + 4 + 2','Every animal has 4 legs','2 + 1 = 3 animals, so 6 legs']],
['s24','On a dice, the top and bottom always add up to 7. The top shows 2. What is on the bottom?',['5','2','7','6'],'2 + 5 = 7.',['What plus 2 makes 7? 5','The bottom matches the top','Bottom is always 6']],
['s25','A train has 5 cars. Lucas sits in the 2nd car from the front. Which car is he in, counting from the back?',['4th','2nd','3rd','5th'],'Front: 1 2 3 4 5. Car 2 from the front is car 4 from the back.',['Draw 5 cars, mark car 2, then count from the other end','Front and back are the same','Half of 5']],
['s26','Lucas folds a paper in half and cuts 1 hole through both layers. How many holes when he opens it?',['2','1','3','4'],'The paper had 2 layers, so the cut went through both.',['Folding makes 2 layers, and the cut goes through both','He cut once, so 1 hole','Folding makes 4 layers']],
['s27','Which number is bigger: 38 or 83?',['83','38','They are the same','We can’t tell'],'83 has 8 tens. 38 has only 3 tens.',['Look at the tens: 8 tens is more than 3 tens','They use the same digits, so they are equal','38 ends in 8, so it’s bigger']],
['s28','On a balance, 1 🎩 weighs the same as 2 🧦. How many 🧦 weigh the same as 2 🎩?',['4','2','3','1'],'Each hat is 2 socks: 2 + 2 = 4 socks.',['Change each hat into 2 socks: 2 + 2','2 hats, so 2 socks','1 hat + 2 socks = 3']],
['s29','9 boys stand in a line. Boys 1, 3, 5 and so on wear caps. How many caps are there?',['5','4','9','3'],'Caps on boys 1, 3, 5, 7, 9: that’s 5 caps.',['Count the odd numbers up to 9: 1, 3, 5, 7, 9','Half of 9 is about 4','Every boy wears a cap']],
['s30','Lucas has 3 red blocks and 5 blue blocks. How many more blue blocks than red blocks?',['2','8','5','3'],'Match each red with a blue. 2 blue blocks have no partner: 5 − 3 = 2.',['Pair them up and count the blue ones left over: 5 − 3','Add them all: 3 + 5','Count the blue ones: 5']]],
fabric:[
['f1','One ribbon is 8 cm long. Another is 5 cm long. How much longer is the first ribbon?',['3 cm','13 cm','5 cm','8 cm'],'8 − 5 = 3 cm.'],
['f2','How many little squares make this patch?',['6','5','3','9'],'2 rows of 3 squares: 3 + 3 = 6.',{w:3,h:2,u:'squares',grid:0}],
['f3','Which is longer: 1 meter or 50 centimeters?',['1 meter','50 centimeters','They are the same','We can’t tell'],'1 meter is 100 cm, and 100 cm is longer than 50 cm.'],
['f4','Lucas cuts a round cloth into 2 equal pieces. What is each piece called?',['A half','A quarter','A whole','A third'],'2 equal pieces are 2 halves.'],
['f5','A shape has 4 sides that are all the same length, and 4 corners. What is it?',['Square','Triangle','Circle','Rectangle with long sides'],'A square has 4 equal sides and 4 corners.'],
['f6','How many centimeters make 1 meter?',['100','10','1000','50'],'1 meter = 100 centimeters.'],
['f7','This cloth has 4 equal parts. 1 part is blue. What fraction is blue?',['1/4','1/2','4/1','3/4'],'1 out of 4 equal parts is one quarter: 1/4.',{w:4,h:1,u:'squares',grid:1}],
['f8','A belt is 20 cm long. Lucas adds 10 cm more. How long is it now?',['30 cm','10 cm','21 cm','40 cm'],'20 + 10 = 30 cm.'],
['f9','A shirt costs $7 and shorts cost $5. How much for both?',['$12','$2','$11','$75'],'7 + 5 = 12. Try 7 + 3 = 10, then 2 more.'],
['f10','Lucas pays $10 for a cap that costs $8. How much change does he get?',['$2','$18','$8','$3'],'Count up from 8 to 10: 9, 10. That’s $2.'],
['f11','Lucas sews tape all around a square patch. Each side is 3 cm. How much tape does he need?',['12 cm','9 cm','6 cm','3 cm'],'4 sides of 3 cm: 3 + 3 + 3 + 3 = 12 cm.',{w:3,h:3,u:'cm'}],
['f12','How many sides does a triangle have?',['3','4','2','5'],'Tri means three: 3 sides and 3 corners.'],
['f13','Which tool do you use to measure how long a sleeve is?',['A ruler or tape measure','A clock','A scale','A thermometer'],'Rulers and tape measures measure length.'],
['f14','Half of 10 buttons are gold. How many are gold?',['5','10','2','20'],'Half means 2 equal groups: 5 and 5.'],
['f15','How many little squares make this rug?',['12','7','10','14'],'3 rows of 4: 4 + 4 + 4 = 12.',{w:4,h:3,u:'squares',grid:0}],
['f16','Lucas joins a 6 cm strip and a 7 cm strip end to end. How long is the new strip?',['13 cm','1 cm','12 cm','14 cm'],'6 + 7 = 13 cm.'],
['f17','A shoe starts at the 0 mark on a ruler and ends at the 18 mark. How long is the shoe?',['18 cm','0 cm','17 cm','20 cm'],'Starting at 0, the end mark tells you the length: 18 cm.'],
['f18','Which is the heaviest?',['🎳 A bowling ball','🪶 A feather','👟 A sneaker','🧦 A sock'],'A bowling ball is very heavy. A scale would show the biggest number.'],
['f19','3 T-shirts cost $4 each. How much for all 3?',['$12','$7','$43','$8'],'4 + 4 + 4 = 12.'],
['f20','A round cloth is cut into 4 equal parts. What is each part called?',['A quarter','A half','A whole','A pair'],'4 equal parts are 4 quarters.'],
['f21','Which is about 1 centimeter wide?',['Your little fingernail','A door','A car','A bed'],'A centimeter is tiny, about as wide as a little fingernail.'],
['f22','A rope is 15 cm. Lucas cuts off 5 cm. How much is left?',['10 cm','20 cm','5 cm','15 cm'],'15 − 5 = 10 cm.'],
['f23','How many corners does a rectangle have?',['4','3','2','6'],'A rectangle has 4 sides and 4 corners.'],
['f24','Lucas has two 25¢ coins. How many cents is that?',['50¢','25¢','52¢','2¢'],'25 + 25 = 50 cents.'],
['f25','Lucas folds a square cloth in half from corner to corner. What shape does he get?',['A triangle','A circle','A smaller square','A star'],'Corner to corner makes a triangle.'],
['f26','Half of 8 socks are red. How many are red?',['4','8','2','16'],'8 split into 2 equal groups is 4 and 4.'],
['f27','A blue scarf is as long as 5 paper clips. A red scarf is as long as 3 paper clips. Which is longer?',['The blue scarf','The red scarf','They are the same','We can’t tell'],'5 paper clips are longer than 3 paper clips.'],
['f28','How many squares are in this patch?',['10','7','12','5'],'2 rows of 5: 5 + 5 = 10.',{w:5,h:2,u:'squares',grid:0}],
['f29','Lucas measures a table: it is 6 of his hands long. A baby measures it: 9 hands long. Whose hands are bigger?',['Lucas’s','The baby’s','The same','We can’t tell'],'Bigger hands need fewer hands to cover the table. Lucas needed fewer.'],
['f30','How many flat sides (faces) does a cube have?',['6','4','8','12'],'Top, bottom, front, back, left, right: 6 faces, like a dice.']],
magazine:[],boutique:[],museum:[
['m1','Where does wool come from?',['🐑 Sheep','🌱 Cotton plants','🐔 Chickens','🪨 Rocks'],'Wool is a sheep’s fluffy coat. It gets a haircut once a year and grows back.'],
['m2','Where does cotton come from?',['A plant','Sheep','Fish','Clouds'],'Cotton grows as white fluffy balls on the cotton plant.'],
['m3','On a sunny day, which shirt gets hotter?',['⚫ A black shirt','⚪ A white shirt','They get equally hot','A shirt with stripes'],'Dark colors soak up more sunlight and get hot. White bounces light away.'],
['m4','Why does a raincoat keep you dry?',['Water can’t get through it','It is very big','It is yellow','It has pockets'],'Raincoats are waterproof, so the rain slides off.'],
['m5','Why does a puffy jacket keep you warm?',['It traps warm air around you','It has a heater inside','It is shiny','It is heavy'],'The puffy parts hold lots of air, and the air keeps your body heat in.'],
['m6','Mix blue paint and yellow paint. What color do you get?',['🟢 Green','🟣 Purple','🟠 Orange','🟤 Brown'],'Blue + yellow = green, like grass.'],
['m7','Mix red paint and yellow paint. What color do you get?',['🟠 Orange','🟢 Green','🟣 Purple','⚫ Black'],'Red + yellow = orange.'],
['m8','Mix red paint and blue paint. What color do you get?',['🟣 Purple','🟢 Green','🟠 Orange','🟡 Yellow'],'Red + blue = purple, like grapes.'],
['m9','A man saw prickly seed balls stuck to his dog’s fur. What did that give him the idea for?',['Velcro','Zippers','Buttons','Shoelaces'],'The seed balls had tiny hooks. He copied them to make Velcro.'],
['m10','Silk is made from the cocoons of a tiny…',['Silkworm','Spider','Fish','Bird'],'Silkworms spin cocoons from one very long thread. People in China first made silk from it.'],
['m11','Long, long ago, before sewing machines, how were clothes sewn?',['By hand with a needle','With glue','With tape','By robots'],'Every stitch was made by hand, so clothes took a long time to make.'],
['m12','Why do astronauts wear spacesuits?',['Space has no air to breathe','To look cool','To swim','To stay clean'],'A spacesuit gives astronauts air and keeps them safe from very hot and cold space.'],
['m13','What do firefighters’ suits protect them from?',['Heat and fire','Rain only','Bugs','Noise'],'Their suits are made of special cloth that doesn’t catch fire easily.'],
['m14','Leather shoes are made from…',['Animal skin','Leaves','Paper','Glass'],'Leather is animal skin, often from cows, made strong and soft.'],
['m15','A kimono is traditional clothing from which country?',['🇯🇵 Japan','🇲🇽 Mexico','🇧🇷 Brazil','🇰🇪 Kenya'],'A kimono is a long robe with wide sleeves from Japan.'],
['m16','Why do people wear sunglasses?',['To protect their eyes from bright sun','To see in the dark','To hear better','To keep their nose warm'],'Sunglasses block bright light that can hurt your eyes.'],
['m17','Why should you wear a helmet when you ride a bike?',['To protect your head','To go faster','To stay dry','To look taller'],'A helmet is hard outside and soft inside, so it protects your head if you fall.'],
['m18','Why is a vest with shiny stripes easy to see at night?',['The stripes bounce car lights back','The stripes make their own light','It is very big','It is warm'],'Shiny reflective stripes send headlight light back to the driver.'],
['m19','What should you wear to play in the snow?',['Warm boots, gloves and a hat','Flip-flops','A swimsuit','Sandals and shorts'],'Snow is cold and wet, so you need warm, covered clothes.'],
['m20','Why do soccer cleats have little bumps (studs) on the bottom?',['To grip the grass so you don’t slip','To make noise','To look pretty','To keep feet warm'],'The studs dig into the grass so players can run and turn fast.'],
['m21','Why don’t people swim in jeans?',['Jeans get very heavy when wet','Jeans are too blue','Jeans float away','Jeans are too short'],'Jeans soak up lots of water and get heavy. Swimsuits dry fast and stretch.'],
['m22','The lion dance (舞獅) is usually done for which holiday?',['🧧 Lunar New Year','🎃 Halloween','🎄 Christmas','🦃 Thanksgiving'],'Lion dances bring good luck for the Lunar New Year.'],
['m23','Why do some hats have a very wide brim?',['To shade your face from the sun','To catch rain to drink','To hold snacks','To keep ears warm'],'A wide brim makes a big shadow over your face and neck.'],
['m24','Rain boots keep your feet dry. What are they usually made of?',['Rubber','Paper','Wool','Cotton'],'Rubber is waterproof, so water can’t get in.'],
['m25','Long ago, what did knights wear to protect themselves?',['Metal armor','Pajamas','Swimsuits','Paper suits'],'Knights wore heavy metal armor and helmets.'],
['m26','What makes blue jeans blue?',['Blue dye','Blue sky','Blue cotton plants','Blue water'],'The cloth is colored with a blue dye called indigo.'],
['m27','Penguins look like they are wearing a fancy suit. What colors are they?',['⚫⚪ Black and white','🔴🟡 Red and yellow','🟢🔵 Green and blue','🟣🟠 Purple and orange'],'That’s why people say penguins wear a tuxedo!'],
['m28','On a very cold day, which keeps your fingers warmer: mittens or gloves?',['Mittens','Gloves','They are the same','Neither'],'In mittens your fingers are together and share their warmth.'],
['m29','Before people had zippers or Velcro, what did they use most to close clothes?',['Buttons','Tape','Magnets','Glue'],'Buttons are thousands of years old. Zippers came much later.'],
['m30','Why do chefs wear tall hats?',['To keep hair out of the food','To stay warm','To look taller only','To hold spoons'],'Chef hats cover hair so none falls into the food.']]};

