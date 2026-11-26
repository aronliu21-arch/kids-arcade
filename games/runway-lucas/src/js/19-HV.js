/* ================= Hints: a picture that helps her solve it ================= */
const HV={
 ic:(e,n,c)=>'<span class="hic"'+(c?' style="color:'+c+'"':'')+'>'+e.repeat(n)+'</span>',
 row:(...a)=>'<div class="hrow">'+a.join('')+'</div>',
 col:(...a)=>'<div class="hcol">'+a.join('')+'</div>',
 box:(h,l,cls)=>'<div class="hbox'+(cls?' '+cls:'')+'">'+h+(l!=null?'<small>'+l+'</small>':'')+'</div>',
 ar:t=>'<span class="har">'+(t||'→')+'</span>',
 q:'<span class="hq">?</span>',
 chip:(t,c)=>'<span class="hchip" style="background:'+(c||'#e7f5ff')+'">'+t+'</span>',
 /* number line: from a to b, ticks every s, marks {value:label} */
 nl(a,b,s,marks,hl){const W=560,x=v=>20+(v-a)/(b-a)*(W-40);let g='<line x1="20" y1="40" x2="'+(W-20)+'" y2="40" stroke="#4a3426" stroke-width="3"/>';
  for(let v=a;v<=b+1e-9;v+=s)g+='<line x1="'+x(v)+'" y1="32" x2="'+x(v)+'" y2="48" stroke="#4a3426" stroke-width="2"/><text x="'+x(v)+'" y="68" text-anchor="middle" font-size="15" fill="#4a3426">'+(hl&&hl[v]!=null?hl[v]:v)+'</text>';
  Object.entries(marks||{}).forEach(([v,l])=>{g+='<text x="'+x(+v)+'" y="26" text-anchor="middle" font-size="20">'+l+'</text>';});
  return '<svg class="hsvg" viewBox="0 0 '+W+' 76">'+g+'</svg>';},
 /* grid of cells: w×h, fill(i,j)->color, label(i,j)->text */
 grid(w,h,fill,lab,cs){cs=cs||Math.min(40,Math.floor(320/Math.max(w,h)));let g='';for(let j=0;j<h;j++)for(let i=0;i<w;i++){const f=fill?fill(i,j):'#fff';if(f===null)continue;g+='<rect x="'+(4+i*cs)+'" y="'+(4+j*cs)+'" width="'+cs+'" height="'+cs+'" fill="'+f+'" stroke="#1864ab" stroke-width="1.5"/>'+(lab&&lab(i,j)!=null?'<text x="'+(4+i*cs+cs/2)+'" y="'+(4+j*cs+cs/2+6)+'" text-anchor="middle" font-size="'+Math.round(cs*.45)+'" font-weight="700" fill="#4a3426">'+lab(i,j)+'</text>':'');}
  return '<svg class="hsvg" style="max-width:'+(w*cs+8)+'px" viewBox="0 0 '+(w*cs+8)+' '+(h*cs+8)+'">'+g+'</svg>';},
 /* fraction bar */
 fb(n,parts,lab){let g='';const W=360,cw=W/n;let k=0;parts.forEach(([m,c])=>{for(let i=0;i<m;i++,k++)g+='<rect x="'+(4+k*cw)+'" y="4" width="'+cw+'" height="40" fill="'+c+'" stroke="#4a3426" stroke-width="2"/>';});
  for(;k<n;k++)g+='<rect x="'+(4+k*cw)+'" y="4" width="'+cw+'" height="40" fill="#fff" stroke="#4a3426" stroke-width="2"/>';
  return '<div class="hfb">'+(lab?'<b>'+lab+'</b>':'')+'<svg class="hsvg" viewBox="0 0 368 48">'+g+'</svg></div>';},
 /* rectangle with side labels; mode 'p' draws a walking path */
 rect(w,h,lw,lh,mode){const S=Math.min(260/w,150/h),W=w*S,H=h*S;let g='<rect x="40" y="10" width="'+W+'" height="'+H+'" fill="#e7f5ff" stroke="'+(mode==='p'?'#e8590c':'#1864ab')+'" stroke-width="'+(mode==='p'?6:3)+'" '+(mode==='p'?'stroke-dasharray="10 6"':'')+'/>';
  if(mode==='a')for(let i=1;i<w;i++)g+='<line x1="'+(40+i*S)+'" y1="10" x2="'+(40+i*S)+'" y2="'+(10+H)+'" stroke="#74c0fc" stroke-width="1.5"/>';
  if(mode==='a')for(let j=1;j<h;j++)g+='<line x1="40" y1="'+(10+j*S)+'" x2="'+(40+W)+'" y2="'+(10+j*S)+'" stroke="#74c0fc" stroke-width="1.5"/>';
  g+='<text x="'+(40+W/2)+'" y="'+(H+34)+'" text-anchor="middle" font-size="17" font-weight="800" fill="#4a3426">'+lw+'</text><text x="'+(W+48)+'" y="'+(10+H/2+6)+'" font-size="17" font-weight="800" fill="#4a3426">'+lh+'</text>';
  if(mode==='p')g+='<text x="'+(40+W/2)+'" y="2" text-anchor="middle" font-size="15" fill="#e8590c" dy="6">'+lw+'</text><text x="34" y="'+(10+H/2+6)+'" text-anchor="end" font-size="15" fill="#e8590c">'+lh+'</text>';
  return '<svg class="hsvg" style="max-width:'+(W+130)+'px" viewBox="0 -4 '+(W+130)+' '+(H+44)+'">'+g+'</svg>';},
 clock(h,m,mirror){const a=(h%12+m/60)*30,b=m*6,hx=v=>100+Math.sin(v*Math.PI/180),hy=v=>100-Math.cos(v*Math.PI/180);
  let g='<circle cx="100" cy="100" r="88" fill="#fff" stroke="#4a3426" stroke-width="5"/>';for(let i=1;i<=12;i++){const t=i*30*Math.PI/180;g+='<text x="'+(100+70*Math.sin(t))+'" y="'+(107-70*Math.cos(t))+'" text-anchor="middle" font-size="20" font-weight="700" fill="#4a3426">'+i+'</text>';}
  const L=(deg,len,w,c)=>'<line x1="100" y1="100" x2="'+(100+len*Math.sin(deg*Math.PI/180))+'" y2="'+(100-len*Math.cos(deg*Math.PI/180))+'" stroke="'+c+'" stroke-width="'+w+'" stroke-linecap="round"/>';
  g+=L(a,44,8,'#1c7ed6')+L(b,64,5,'#4a3426')+'<circle cx="100" cy="100" r="6" fill="#4a3426"/>';
  return '<svg class="hsvg hclock" viewBox="0 0 200 200"'+(mirror?' style="transform:scaleX(-1)"':'')+'>'+g+'</svg>';},
 tbl(rows,head){return '<table class="htbl">'+(head?'<tr>'+head.map(c=>'<th>'+c+'</th>').join('')+'</tr>':'')+rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</table>';}
};
const SK2='🩷',BL='🔵';
const HINTS={
s1:['Match every hat with every shirt.',()=>['🎩','🧢'].map(t=>HV.row(HV.box(t),HV.ar(),HV.chip('👕 A'),HV.chip('👕 B'),HV.chip('👕 C'))).join('')+'<p class="hn">Count all the outfits in both rows.</p>'],
s2:['Number the beads.',()=>HV.grid(9,1,i=>i%2?'#ffc9c9':'#d0ebff',i=>i===8?'?':(i%2?'🔴':'🔵'),40)+HV.grid(9,1,()=>'#f8f9fa',i=>i+1,40)],
s3:['Line them up from tall to short.',()=>HV.row(HV.box('🧍‍♂️','Rex'),HV.ar('taller than'),HV.box('🧍','Lucas'),HV.ar('taller than'),HV.box('🧒','Ben'))],
s4:['Draw 5 boys and put Lucas in the middle.',()=>HV.row(HV.box('🙂'),HV.box('🙂'),HV.box('<b>Lucas</b>'),HV.box('🙂'),HV.box('🙂'))+'<p class="hn">The front is on the left. Count the boys before Lucas.</p>'],
s5:['Draw the buttons on each shirt.',()=>HV.row(HV.box('👕<br>🔘🔘🔘🔘'),HV.box('👕<br>🔘🔘🔘🔘'),HV.box('👕<br>🔘🔘🔘🔘'))],
s6:['Do it one step at a time.',()=>HV.row(HV.chip('10'),HV.ar('give 3 −3'),HV.box('?'),HV.ar('get 5 +5'),HV.q)],
s7:['How big is each jump?',()=>HV.nl(0,12,1,{2:'⬇',4:'⬇',6:'⬇',10:'⬇'})],
s8:['Draw 3 squares and count every corner.',()=>HV.row(HV.box(HV.grid(1,1,()=>'#fff',()=>'4',44)),HV.box(HV.grid(1,1,()=>'#fff',()=>'4',44)),HV.box(HV.grid(1,1,()=>'#fff',()=>'4',44)))],
s9:['Put socks in pairs.',()=>HV.row(HV.box('🧦🧦'),HV.box('🧦🧦'),HV.box('🧦🧦'),HV.box('🧦','alone'))],
s10:['Count up one year at a time.',()=>HV.row(HV.chip('6'),HV.ar('+1'),HV.chip('7'),HV.ar('+1'),HV.chip('?'),HV.ar('+1'),HV.q)],
s11:['Number the hats.',()=>HV.grid(10,1,i=>i%2?'#fff3bf':'#fff',i=>i===9?'?':(i%2?'🧢':'🎩'),36)+HV.grid(10,1,()=>'#f8f9fa',i=>i+1,36)],
s12:['Each boy has 2 shoes. Count by 2s.',()=>HV.row(...[1,2,3,4].map(()=>HV.box('🧒<br>👟👟')))],
s13:['Move the short hand forward.',()=>HV.row(HV.box(HV.clock(3,0),'now'),HV.ar('+1 hour'),HV.box(HV.clock(4,0)),HV.ar('+1 hour'),HV.box(HV.q,'?'))],
s14:['Swap the melon for apples.',()=>HV.row(HV.box('🍈','1 melon'),HV.ar('='),HV.box('🍎🍎🍎','3 apples'))+HV.row(HV.box('🍎🍎🍎','melon'),HV.ar('vs'),HV.box('🍎🍎','2 apples'))],
s15:['Draw the stairs.',()=>'<div class="hstack">'+[1,2,3].map(n=>'<div>'+'🟧'.repeat(n)+' <small>'+n+'</small></div>').join('')+'</div>'],
s16:['Run it backward.',()=>HV.row(HV.q,HV.ar('+4'),HV.chip('10'))+HV.row(HV.chip('10'),HV.ar('−4'),HV.q)],
s17:['Count the legs of each thing.',()=>HV.row(HV.box('🪑 table','4 legs'),HV.box('🪑 table','4 legs'),HV.box('🪑 chair','4 legs'))],
s18:['Cross out who can’t be first.',()=>HV.tbl([['Rex','',''],['Lucas','✗',''],['Ben','✗','✗']],['','1st','last'])],
s19:['Draw the cut.',()=>'<svg class="hsvg" viewBox="0 0 120 120" style="max-width:130px"><rect x="10" y="10" width="100" height="100" fill="#ffe8cc" stroke="#4a3426" stroke-width="3"/><line x1="10" y1="10" x2="110" y2="110" stroke="#e8590c" stroke-width="4" stroke-dasharray="8 5"/></svg><p class="hn">Count the sides of each piece.</p>'],
s20:['Count the days forward.',()=>HV.tbl([['Mon','Tue','Wed','Thu'],['today','+1','+2','+3']])],
s21:['Deal the cookies one at a time.',()=>HV.row(...[1,2,3,4].map(()=>HV.box('🧒<br>🍪?')))+'<p class="hn">12 cookies: give each boy 1, then 1 more… until none are left.</p>'],
s22:['Draw the ladder.',()=>'<div class="hstack">'+[6,5,4,3,2,1].map(n=>'<div>'+(n===2?'🧒':'')+'▭ <small>step '+n+'</small></div>').join('')+'</div><p class="hn">Climb up 3 from step 2.</p>'],
s23:['Count legs on each animal.',()=>HV.row(HV.box('🐕','4 legs'),HV.box('🐕','4 legs'),HV.box('🐦','2 legs'))],
s24:['What plus 2 makes 7?',()=>HV.row(HV.chip('2'),HV.ar('+'),HV.q,HV.ar('='),HV.chip('7'))+HV.grid(7,1,i=>i<2?'#74c0fc':'#fff',null,32)],
s25:['Number the cars both ways.',()=>HV.tbl([['🚂','🚃','🚃','🚃','🚃'],['1','2 🧒','3','4','5'],['5','?','3','2','1']])+'<p class="hn">Top numbers: from the front. Bottom numbers: from the back.</p>'],
s26:['Folding makes 2 layers.',()=>HV.row(HV.box(HV.grid(1,1,()=>'#fff',()=>'●',50),'folded'),HV.ar('open'),HV.box(HV.grid(2,1,()=>'#fff',()=>'?',50),'2 halves'))],
s27:['Look at the tens.',()=>HV.tbl([['38','3 tens','8 ones'],['83','8 tens','3 ones']],['number','tens','ones'])],
s28:['Change each hat into 2 socks.',()=>HV.row(HV.box('🎩','='),HV.box('🧦🧦'))+HV.row(HV.box('🎩🎩'),HV.ar('='),HV.box('🧦🧦 + ?'))],
s29:['Number the boys and give caps to 1, 3, 5…',()=>HV.grid(9,1,i=>i%2?'#fff':'#d0ebff',i=>i%2?'':'🧢',36)+HV.grid(9,1,()=>'#f8f9fa',i=>i+1,36)],
s30:['Pair each red block with a blue one.',()=>HV.row(HV.box('🟥🟥🟥'))+HV.row(HV.box('🟦🟦🟦'),HV.box('🟦🟦','no partner'))],
f1:['Line the ribbons up side by side.',()=>HV.grid(8,1,i=>'#ffa8a8',null,32)+HV.grid(8,1,i=>i<5?'#74c0fc':null,null,32)+'<p class="hn">How many squares stick out?</p>'],
f2:['Count the squares in each row.',()=>HV.grid(3,2,()=>'#d0ebff',(i,j)=>j*3+i+1,40)],
f3:['A meter stick is 100 cm.',()=>HV.fb(2,[[2,'#74c0fc']],'1 m = 100 cm')+HV.fb(2,[[1,'#ffa94d']],'50 cm')],
f4:['2 equal pieces.',()=>HV.fb(2,[[1,'#74c0fc']],'1 of 2 pieces')],
f5:['Count the sides and check if they match.',()=>HV.row(HV.box('🟥','4 same sides'),HV.box('🔺','3 sides'),HV.box('⚪','no corners'))],
f6:['Count by 10s on a meter stick.',()=>HV.nl(0,100,10,{0:'⬇',100:'⬇'})],
f7:['Count all the parts, then the blue ones.',()=>HV.fb(4,[[1,'#74c0fc']])],
f8:['Add 10 to 20.',()=>HV.nl(0,40,10,{20:'🧵',30:'?'})],
f9:['Make 10 first.',()=>HV.row(HV.chip('$7'),HV.ar('+3'),HV.chip('$10'),HV.ar('+2'),HV.q)],
f10:['Count up from the price.',()=>HV.nl(6,10,1,{8:'🧢',10:'💵'})],
f11:['Walk all the way around the edge.',()=>HV.rect(3,3,'3 cm','3 cm','p')+'<p class="hn">3 + 3 + 3 + 3</p>'],
f12:['Draw it and count the sides.',()=>'<svg class="hsvg" viewBox="0 0 120 100" style="max-width:140px"><path d="M60 10L110 90H10Z" fill="#ffe8cc" stroke="#4a3426" stroke-width="3"/></svg>'],
f13:['Which tool has centimeter marks?',()=>HV.row(HV.box('📏'),HV.box('⏰'),HV.box('⚖️'),HV.box('🌡️'))],
f14:['Split 10 into 2 equal groups.',()=>HV.row(HV.box('🔘🔘🔘🔘🔘'),HV.box('🔘🔘🔘🔘🔘'))],
f15:['Count row by row.',()=>HV.grid(4,3,()=>'#d0ebff',(i,j)=>j*4+i+1,40)],
f16:['Put them end to end.',()=>HV.grid(13,1,i=>i<6?'#ffa8a8':'#74c0fc',i=>i+1,26)],
f17:['Where does the shoe end?',()=>HV.nl(0,20,2,{0:'👟',18:'⬇'})],
f18:['Which one would make a scale go down the most?',()=>HV.row(HV.box('⚖️'),HV.box('🎳'),HV.box('🪶'),HV.box('👟'),HV.box('🧦'))],
f19:['Add $4 three times.',()=>HV.row(HV.box('👕','$4'),HV.box('👕','$4'),HV.box('👕','$4'))],
f20:['4 equal parts.',()=>HV.fb(4,[[1,'#74c0fc']],'1 of 4 parts')],
f21:['A centimeter is tiny.',()=>HV.nl(0,5,1,{0:'⬇',1:'⬇'})+'<p class="hn">The space between two marks is 1 cm.</p>'],
f22:['Take 5 off.',()=>HV.grid(15,1,i=>i<10?'#74c0fc':'#dee2e6',i=>i<10?'':'✂️',24)],
f23:['Draw a rectangle and count its corners.',()=>HV.rect(4,2,'','','a')],
f24:['Add the two coins.',()=>HV.row(HV.chip('25¢','#fff3bf'),HV.ar('+'),HV.chip('25¢','#fff3bf'))],
f25:['Fold it corner to corner.',()=>'<svg class="hsvg" viewBox="0 0 120 120" style="max-width:130px"><rect x="10" y="10" width="100" height="100" fill="#d0ebff" stroke="#4a3426" stroke-width="3"/><line x1="10" y1="110" x2="110" y2="10" stroke="#e8590c" stroke-width="4" stroke-dasharray="8 5"/></svg>'],
f26:['Split 8 into 2 equal groups.',()=>HV.row(HV.box('🧦🧦🧦🧦','red'),HV.box('🧦🧦🧦🧦'))],
f27:['Compare the paper clips.',()=>HV.row(HV.box('📎📎📎📎📎','blue')+HV.box('📎📎📎','red'))],
f28:['Count row by row.',()=>HV.grid(5,2,()=>'#d0ebff',(i,j)=>j*5+i+1,40)],
f29:['Big hands cover more, so you need fewer.',()=>HV.row(HV.box('✋✋✋✋✋✋','Lucas: 6'),HV.box('🤚🤚🤚🤚🤚🤚🤚🤚🤚','baby: 9'))],
f30:['Think of a dice.',()=>HV.row(HV.box('🎲'),HV.box('top, bottom, front, back, left, right'))],
m1:['🐑 Baa! Who gets a haircut once a year?'],m2:['🌱 It grows on a plant as white fluffy balls.'],m3:['🌞 Dark colors soak up sunlight like a sponge.'],m4:['💧 Water slides right off it.'],m5:['🫧 Think of all the puffy air inside.'],
m6:['🎨 Think of grass: 🟦 + 🟨 = ?'],m7:['🎨 Think of an orange: 🟥 + 🟨 = ?'],m8:['🎨 Think of grapes: 🟥 + 🟦 = ?'],m9:['🌰 The seed balls had tiny hooks… what has tiny hooks and loops?'],m10:['🐛 A tiny caterpillar spins a cocoon.'],
m11:['✋🪡 No machines yet…'],m12:['🚀 Can you breathe in space?'],m13:['🔥 What do firefighters walk into?'],m14:['🐄 It comes from an animal.'],m15:['🗻 Mount Fuji and 🍣 sushi come from the same country.'],
m16:['😎 Too bright!'],m17:['🚲 What part of you does a helmet cover?'],m18:['🚗💡 Car lights bounce back to the driver.'],m19:['❄️ Snow is cold and wet.'],m20:['⚽ Bumps help you not slip on grass.'],
m21:['💦 Jeans soak up water like a sponge.'],m22:['🧧 Red envelopes and lion dances!'],m23:['☀️ A big brim makes a big shadow.'],m24:['🎈 Like a balloon, water can’t get through it.'],m25:['🏰 Clank, clank! Shiny and hard.'],
m26:['🎨 Cloth can be colored with…'],m27:['🐧 Look at a penguin!'],m28:['🤝 Fingers together share warmth.'],m29:['🧥 Little round things that go through holes.'],m30:['👨‍🍳 Nobody wants hair in their soup!']};

