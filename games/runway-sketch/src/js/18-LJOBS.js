const LJOBS={
 studio:{e:'✏️',t:'Design Studio',d:'Logic puzzles',boss:'ivy',skill:'Logic',tip:'Next time you get dressed, count how many outfits your clothes can make. Tops × bottoms!'},
 fabric:{e:'📏',t:'Fabric Shop',d:'Area, perimeter, fractions',boss:'fay',skill:'Measuring',tip:'Measure your desk with a ruler at home, then work out its perimeter.'},
 magazine:{e:'📰',t:'Magazine Office',d:'Read articles',boss:'jo',skill:'Reading',tip:'Read a short article with Dad and tell him the main idea in one sentence.'},
 boutique:{e:'🏷️',t:'Boutique Signs',d:'Read zhuyin signs',boss:'lan',skill:'注音 Reading',tip:'Next time you visit a Taiwanese shop or market, try reading the signs out loud!'},
 museum:{e:'🏛️',t:'Fashion Museum',d:'Science & history',boss:'ada',skill:'Science & History',tip:'Check the tag inside a shirt at home. Is it cotton, wool or polyester?'}};
const LKEYS=Object.keys(LJOBS);
const BADGE=[4,10,18];           /* first-try solves for bronze / silver / gold in each job */
const LV_BADGES=[0,1,3,5,7,10];  /* skill badges needed to reach each fame level */

Object.assign(CAST,{
 ivy:{name:'Designer Ivy',hair:'#1f1b2e',style:'bob',skin:'#e6b991',iris:'#5b3a8a',top:'#7048e8',trim:'#ffd43b'},
 fay:{name:'Ms. Fay',hair:'#c2410c',style:'curls',skin:'#f8dccb',iris:'#2f6b3a',top:'#0ca678',trim:'#fff'},
 jo:{name:'Editor Jo',hair:'#3b2a20',style:'long',skin:'#c68b5e',iris:'#3a2618',top:'#1c7ed6',trim:'#f4f1ea',glasses:1},
 lan:{name:'Auntie Lan',hair:'#2b2118',style:'bun',skin:'#f1c9a8',iris:'#3a2618',top:'#e03131',trim:'#ffd43b'},
 ada:{name:'Curator Ada',hair:'#e9ecef',style:'long',skin:'#a86b45',iris:'#3a2618',top:'#5f3dc4',trim:'#ffd43b',pearls:1}});
Object.assign(STORY,{
 learn:{
  studio:[['ivy','happy','Welcome to my Design Studio, {n}! Great designers are great puzzle solvers.'],['ivy','proud','Solve my puzzles, then tell me WHY your answer works. That’s how designers think!']],
  fabric:[['fay','happy','Hi {n}! At my Fabric Shop we measure, cut and share fabric.'],['fay','neutral','You’ll need area, perimeter and fractions. Measure twice, cut once!']],
  magazine:[['jo','happy','Welcome to Style Weekly, {n}! I need a sharp reader to check our articles.'],['jo','proud','Read carefully. The answers are always hiding in the text.']],
  boutique:[['lan','happy','歡迎光臨! Welcome, {n}! My boutique’s signs are all in Chinese.'],['lan','proud','Read the zhuyin beside each character and you can read any sign!']],
  museum:[['ada','happy','Welcome to the Fashion Museum, {n}. Every outfit here has a story.'],['ada','proud','Learn where clothes come from, and the science that makes them work.']]},
 badge1:[['mia','happy','{n}, you earned your first skill badge!'],['mia','proud','Top designers want models who understand clothes. Badges help you level up!'],['stella','proud','Badges? Pfft. Models just need to look good.'],['nora','neutral','I think being smart AND stylish is even better.']],
 badge6:[['stella','sad','Um... {n}? Designer Ivy gave me a puzzle and I can’t figure it out.'],['nora','happy','Want to solve it together? Let’s draw it out step by step.'],['stella','surprised','You’d help me? Even though we’re rivals?'],['nora','happy','Rivals can still be friends. Teamwork!'],['stella','happy','...Thanks, {n}. You’re actually pretty nice.']],
 needBadge:[['mia','neutral','{n}, you have enough stars for the next level!'],['mia','happy','But you need more skill badges first. Visit the Fashion District and learn something new!']]});


/* ================= Hints: a picture that helps her solve it ================= */
const HV={
 ic:(e,n,c)=>'<span class="hic"'+(c?' style="color:'+c+'"':'')+'>'+e.repeat(n)+'</span>',
 row:(...a)=>'<div class="hrow">'+a.join('')+'</div>',
 col:(...a)=>'<div class="hcol">'+a.join('')+'</div>',
 box:(h,l,cls)=>'<div class="hbox'+(cls?' '+cls:'')+'">'+h+(l!=null?'<small>'+l+'</small>':'')+'</div>',
 ar:t=>'<span class="har">'+(t||'→')+'</span>',
 q:'<span class="hq">?</span>',
 chip:(t,c)=>'<span class="hchip" style="background:'+(c||'#fff0f6')+'">'+t+'</span>',
 /* number line: from a to b, ticks every s, marks {value:label} */
 nl(a,b,s,marks,hl){const W=560,x=v=>20+(v-a)/(b-a)*(W-40);let g='<line x1="20" y1="40" x2="'+(W-20)+'" y2="40" stroke="#4a3426" stroke-width="3"/>';
  for(let v=a;v<=b+1e-9;v+=s)g+='<line x1="'+x(v)+'" y1="32" x2="'+x(v)+'" y2="48" stroke="#4a3426" stroke-width="2"/><text x="'+x(v)+'" y="68" text-anchor="middle" font-size="15" fill="#4a3426">'+(hl&&hl[v]!=null?hl[v]:v)+'</text>';
  Object.entries(marks||{}).forEach(([v,l])=>{g+='<text x="'+x(+v)+'" y="26" text-anchor="middle" font-size="20">'+l+'</text>';});
  return '<svg class="hsvg" viewBox="0 0 '+W+' 76">'+g+'</svg>';},
 /* grid of cells: w×h, fill(i,j)->color, label(i,j)->text */
 grid(w,h,fill,lab,cs){cs=cs||Math.min(40,Math.floor(320/Math.max(w,h)));let g='';for(let j=0;j<h;j++)for(let i=0;i<w;i++){const f=fill?fill(i,j):'#fff';if(f===null)continue;g+='<rect x="'+(4+i*cs)+'" y="'+(4+j*cs)+'" width="'+cs+'" height="'+cs+'" fill="'+f+'" stroke="#a61e4d" stroke-width="1.5"/>'+(lab&&lab(i,j)!=null?'<text x="'+(4+i*cs+cs/2)+'" y="'+(4+j*cs+cs/2+6)+'" text-anchor="middle" font-size="'+Math.round(cs*.45)+'" font-weight="700" fill="#4a3426">'+lab(i,j)+'</text>':'');}
  return '<svg class="hsvg" style="max-width:'+(w*cs+8)+'px" viewBox="0 0 '+(w*cs+8)+' '+(h*cs+8)+'">'+g+'</svg>';},
 /* fraction bar */
 fb(n,parts,lab){let g='';const W=360,cw=W/n;let k=0;parts.forEach(([m,c])=>{for(let i=0;i<m;i++,k++)g+='<rect x="'+(4+k*cw)+'" y="4" width="'+cw+'" height="40" fill="'+c+'" stroke="#4a3426" stroke-width="2"/>';});
  for(;k<n;k++)g+='<rect x="'+(4+k*cw)+'" y="4" width="'+cw+'" height="40" fill="#fff" stroke="#4a3426" stroke-width="2"/>';
  return '<div class="hfb">'+(lab?'<b>'+lab+'</b>':'')+'<svg class="hsvg" viewBox="0 0 368 48">'+g+'</svg></div>';},
 /* rectangle with side labels; mode 'p' draws a walking path */
 rect(w,h,lw,lh,mode){const S=Math.min(260/w,150/h),W=w*S,H=h*S;let g='<rect x="40" y="10" width="'+W+'" height="'+H+'" fill="#fff0f6" stroke="'+(mode==='p'?'#e8590c':'#a61e4d')+'" stroke-width="'+(mode==='p'?6:3)+'" '+(mode==='p'?'stroke-dasharray="10 6"':'')+'/>';
  if(mode==='a')for(let i=1;i<w;i++)g+='<line x1="'+(40+i*S)+'" y1="10" x2="'+(40+i*S)+'" y2="'+(10+H)+'" stroke="#f783ac" stroke-width="1.5"/>';
  if(mode==='a')for(let j=1;j<h;j++)g+='<line x1="40" y1="'+(10+j*S)+'" x2="'+(40+W)+'" y2="'+(10+j*S)+'" stroke="#f783ac" stroke-width="1.5"/>';
  g+='<text x="'+(40+W/2)+'" y="'+(H+34)+'" text-anchor="middle" font-size="17" font-weight="800" fill="#4a3426">'+lw+'</text><text x="'+(W+48)+'" y="'+(10+H/2+6)+'" font-size="17" font-weight="800" fill="#4a3426">'+lh+'</text>';
  if(mode==='p')g+='<text x="'+(40+W/2)+'" y="2" text-anchor="middle" font-size="15" fill="#e8590c" dy="6">'+lw+'</text><text x="34" y="'+(10+H/2+6)+'" text-anchor="end" font-size="15" fill="#e8590c">'+lh+'</text>';
  return '<svg class="hsvg" style="max-width:'+(W+130)+'px" viewBox="0 -4 '+(W+130)+' '+(H+44)+'">'+g+'</svg>';},
 clock(h,m,mirror){const a=(h%12+m/60)*30,b=m*6,hx=v=>100+Math.sin(v*Math.PI/180),hy=v=>100-Math.cos(v*Math.PI/180);
  let g='<circle cx="100" cy="100" r="88" fill="#fff" stroke="#4a3426" stroke-width="5"/>';for(let i=1;i<=12;i++){const t=i*30*Math.PI/180;g+='<text x="'+(100+70*Math.sin(t))+'" y="'+(107-70*Math.cos(t))+'" text-anchor="middle" font-size="20" font-weight="700" fill="#4a3426">'+i+'</text>';}
  const L=(deg,len,w,c)=>'<line x1="100" y1="100" x2="'+(100+len*Math.sin(deg*Math.PI/180))+'" y2="'+(100-len*Math.cos(deg*Math.PI/180))+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"/>';
  g+=L(a,44,8,'#d6336c')+L(b,64,5,'#4a3426')+'<circle cx="100" cy="100" r="6" fill="#4a3426"/>';
  return '<svg class="hsvg hclock" viewBox="0 0 200 200"'+(mirror?' style="transform:scaleX(-1)"':'')+'>'+g+'</svg>';},
 tbl(rows,head){return '<table class="htbl">'+(head?'<tr>'+head.map(c=>'<th>'+c+'</th>').join('')+'</tr>':'')+rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</table>';}
};
const SK2='🩷',BL='🔵';
const HINTS={
/* ---- Design Studio ---- */
d1:['Match every top with every skirt. Count the outfits in each row.',()=>['👕','👚','🎽'].map(t=>HV.row(HV.box(t),HV.ar(),HV.chip('A'),HV.chip('B'),HV.chip('C'),HV.chip('D'))).join('')+'<p class="hn">Each row has 4 outfits. How many rows?</p>'],
d2:['Number the beads. Where do the ★ land?',()=>HV.grid(15,1,i=>i%3===0?'#fff3bf':'#fff',i=>i===13?'?':(i%3===0?'★':'●'),36)+HV.grid(15,1,()=>'#f8f9fa',i=>i+1,36)],
d3:['Draw what each clue says, then join them.',()=>HV.row(HV.chip('Stella'),HV.ar('→'),HV.chip('Nora'))+HV.row(HV.chip('Nora'),HV.ar('→'),HV.chip('Mia'))+'<p class="hn">→ means “walks before”. Put all three on one line.</p>'],
d4:['Swap step by step.',()=>HV.row(HV.box('👗','dress'),HV.ar('='),HV.box('🎩 🎩','2 hats'))+HV.row(HV.box('🎩','1 hat'),HV.ar('='),HV.box('🧣🧣🧣','3 scarves'))+'<p class="hn">Change each 🎩 into 🧣🧣🧣. Count all the scarves.</p>'],
d5:['Put a bow in each gap between buttons.',()=>HV.row(...[0,1,2,3,4].map(i=>'<span class="hic">🔘</span>'+(i<4?'<span class="hgap">🎀?</span>':'')))],
d6:['Count the layers after each fold.',()=>HV.row(HV.box(HV.grid(1,1,()=>'#fff0f6',null,40),'start: 1 layer'),HV.ar(),HV.box(HV.grid(2,1,()=>'#fff0f6',null,40),'fold 1: 2 layers'),HV.ar(),HV.box(HV.grid(2,2,()=>'#fff0f6',null,40),'fold 2: ? layers'))+'<p class="hn">The punch makes one hole in every layer.</p>'],
d7:['Jump to the next hour first, then the rest.',()=>HV.row(HV.chip('9:45'),HV.ar('+15 min'),HV.chip('10:00'),HV.ar('+? min'),HV.q)+'<p class="hn">15 + ? = 50</p>'],
d8:['Take away what you know.',()=>HV.row(HV.box('🎩🎩🎩','2 kg each'),HV.ar('+'),HV.box('👜','?'),HV.ar('='),HV.box('⚖️','10 kg'))+'<p class="hn">How much do the 3 hats weigh? What is left for the bag?</p>'],
d9:['Use a chart. Cross out ✗ what each clue says.',()=>HV.tbl([['Nora','','✗','✗'],['Mia','','',''],['Stella','','✗','']],['','🩷 pink','🔵 blue','🟡 gold'])+'<p class="hn">Each row and each column gets exactly one ✓.</p>'],
d10:['Draw the runway and put a 💡 on every 2 m.',()=>HV.nl(0,12,2,{0:'💡',2:'💡'})+'<p class="hn">Keep going to 12. Don’t forget the end!</p>'],
d11:['Go back in time first.',()=>HV.row(HV.box('Nora now','?'),HV.ar('+2 years'),HV.box('Nora later','11'))+HV.row(HV.box('Stella now','Nora + 3'))],
d12:['Undo the gift.',()=>HV.row(HV.box('Nora '+'📿'.repeat(5),'after'),HV.box('Mia '+'📿'.repeat(5),'after'))+'<p class="hn">Nora gave 2 away. Give them back to her. How many does she have?</p>'],
d13:['What happens from one size to the next?',()=>HV.row(HV.chip('2'),HV.ar('×2'),HV.chip('4'),HV.ar('×?'),HV.chip('8'),HV.ar('×?'),HV.chip('16'),HV.ar('×?'),HV.q)],
d14:['Count cuts and pieces on small ribbons.',()=>HV.tbl([['━━ ✂️ ━━','2','1'],['━ ✂️ ━ ✂️ ━','3','2'],['━✂️━✂️━✂️━','4','3'],['…','10','?']],['ribbon','pieces','cuts'])],
d15:['A mirror swaps left and right.',()=>HV.row(HV.box(HV.clock(3,0),'in the mirror'),HV.ar('🪞'),HV.box(HV.clock(3,0,true),'flip it back'))],
d16:['Draw 4 dots and connect every pair once.',()=>'<svg class="hsvg" viewBox="0 0 200 140" style="max-width:220px"><line x1="30" y1="30" x2="170" y2="30" stroke="#d6336c" stroke-width="4"/><line x1="30" y1="30" x2="30" y2="110" stroke="#d6336c" stroke-width="4"/>'+[[30,30,'A'],[170,30,'B'],[30,110,'C'],[170,110,'D']].map(([x,y,t])=>'<circle cx="'+x+'" cy="'+y+'" r="16" fill="#fff0f6" stroke="#4a3426" stroke-width="3"/><text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" font-weight="800" font-size="16">'+t+'</text>').join('')+'</svg><p class="hn">A–B and A–C are drawn. Which lines are still missing?</p>'],
d17:['Write a list in order so you don’t miss any.',()=>HV.tbl([['1','2','3'],['1','3','2'],['2','?','?'],['…','','']],['1st','2nd','3rd'])+'<p class="hn">How many codes start with 1? With 2? With 3?</p>'],
d18:['Make groups of 3: '+SK2+SK2+BL,()=>HV.row(...[0,1,2,3,4,5].map(()=>HV.box(SK2+SK2+BL)))+'<p class="hn">Each group has 3 sequins and 1 blue. How many full groups fit in 20, and what is left over?</p>'],
d19:['Look down column 1. What’s missing?',()=>HV.grid(3,3,(i,j)=>i===0?'#fff3bf':'#fff',(i,j)=>[['⭐','❤️','🌙'],['❤️','🌙','⭐'],['?','','']][j][i],56)],
d20:['Draw one round on a number line.',()=>HV.nl(0,10,1,{0:'🚶',3:'⬆',2:'⬅'})+'<p class="hn">Round 1: forward to 3, back to 2. Each round you end up ? steps further.</p>'],
d21:['Write the days under the numbers.',()=>HV.tbl([['1','2','3','4','5','6','7','8','9','10'],['Mon','Tue','Wed','Thu','Fri','Sat','Sun','?','?','?']])],
d22:['Fill boxes 4 at a time.',()=>HV.row(...[0,1,2,3,4].map(i=>HV.box('🎩🎩<br>🎩🎩','box '+(i+1))),HV.box('🎩🎩🎩','left over'))+'<p class="hn">Do the left-over hats need a box too?</p>'],
d23:['Draw the prices as bars.',()=>'<div class="hbars"><div><b>scarf</b><span style="width:120px">?</span></div><div><b>hat</b><span style="width:120px">?</span><span class="x" style="width:46px">$3</span></div></div><p class="hn">Both bars together are $15. Take away the extra $3. Then split.</p>'],
d24:['Count small squares, then look for bigger ones.',()=>HV.row(HV.box(HV.grid(2,2,()=>'#fff0f6',(i,j)=>j*2+i+1,50),'small ones'),HV.box('<svg class="hsvg" viewBox="0 0 108 108" style="max-width:108px"><rect x="4" y="4" width="100" height="100" fill="#fff0f6" stroke="#e8590c" stroke-width="6"/><line x1="54" y1="4" x2="54" y2="104" stroke="#a61e4d"/><line x1="4" y1="54" x2="104" y2="54" stroke="#a61e4d"/></svg>','and this one?'))],
d25:['Draw the round table with 4 seats.',()=>'<svg class="hsvg" viewBox="0 0 200 200" style="max-width:220px"><circle cx="100" cy="100" r="50" fill="#f3d9fa" stroke="#4a3426" stroke-width="3"/>'+[[100,24,'Nora'],[24,100,'Mia'],[176,100,'Stella'],[100,180,'?']].map(([x,y,t])=>'<circle cx="'+x+'" cy="'+y+'" r="20" fill="#fff" stroke="#4a3426" stroke-width="3"/><text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="12" font-weight="800">'+t+'</text>').join('')+'</svg>'],
d26:['Imagine the unluckiest grabs.',()=>HV.row(HV.box('🔴','grab 1'),HV.box('🔵','grab 2: no match yet'),HV.box('❓','grab 3'))+'<p class="hn">The 3rd sock can only be red or blue…</p>'],
d27:['Run the machine backward.',()=>HV.row(HV.q,HV.ar('×2'),HV.box('?'),HV.ar('+4'),HV.chip('20'))+HV.row(HV.chip('20'),HV.ar('−4'),HV.box('?'),HV.ar('÷2'),HV.q)],
d28:['Count the sides.',()=>HV.row(HV.box('🔺','3'),HV.ar(),HV.box('🟥','4'),HV.ar(),HV.box('⬟','5'),HV.ar(),HV.box('?','?'))],
d29:['Use big bills first.',()=>HV.row(HV.chip('$5','#d3f9d8'),HV.chip('$5','#d3f9d8'),HV.chip('$5','#d3f9d8'),HV.ar('= $15'),HV.chip('$?','#fff3bf'))+'<p class="hn">How much more makes $17? Which bill does that?</p>'],
d30:['Mark each hole on the belt.',()=>HV.nl(0,30,3,{3:'⚫',6:'⚫',9:'⚫'})+'<p class="hn">Keep marking every 3 up to 30, then count the ⚫.</p>'],
d31:['Look at every number from 1 to 30. Circle each 2.',()=>'<div class="hnums">'+Array.from({length:30},(_,i)=>i+1).map(n=>'<span>'+String(n).replace(/2/g,'<b>2</b>')+'</span>').join('')+'</div><p class="hn">Count the pink 2s. Careful with 22!</p>'],
d32:['Draw the line of models.',()=>HV.row(HV.box('🙂🙂🙂🙂','in front'),HV.box('<b>Nora</b>','5th'),HV.box('🙂🙂🙂🙂','behind'))+'<p class="hn">5th from the front means 4 people are ahead of her.</p>'],
d33:['Draw the stack row by row.',()=>'<div class="hstack">'+[1,2,3,4,5].map(n=>'<div>'+'📦'.repeat(n)+' <small>'+n+'</small></div>').join('')+'</div>'],
d34:['A fast watch is ahead. Turn it back.',()=>HV.row(HV.box(HV.clock(2,5),'watch says 2:05'),HV.ar('−10 min'),HV.box(HV.q,'real time'))],
d35:['Put them on a balance.',()=>HV.row(HV.box('🪶🪶🪶🪶🪶🪶','1 kg feathers'),HV.ar('⚖️'),HV.box('🧵','1 kg silk'))+'<p class="hn">What does the label say each one weighs?</p>'],
d36:['Pair the cards so each pair makes 10.',()=>HV.tbl([['1','+','9','✓'],['2','+','?',''],['3','+','?',''],['4','+','?',''],['5','+','5','can’t: only one 5']])],
