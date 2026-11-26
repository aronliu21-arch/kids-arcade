/* ---- Fabric Shop ---- */
f1:['Area = how many 1 m squares cover it. Count rows × columns.',()=>HV.rect(6,4,'6 m','4 m','a')],
f2:['Lace goes all the way around. Walk the edge.',()=>HV.rect(6,4,'6 m','4 m','p')+'<p class="hn">6 + 4 + 6 + 4</p>'],
f3:['Count the little squares: rows × columns.',()=>HV.rect(7,7,'7 cm','7 cm','a')],
f4:['A square has 4 sides that are all the same.',()=>HV.row(HV.box('?'),HV.box('?'),HV.box('?'),HV.box('?'))+'<p class="hn">4 equal sides add up to 36. ? + ? + ? + ? = 36</p>'],
f5:['1 m = 100 cm. Split 100 into 4.',()=>HV.fb(4,[],'100 cm')],
f6:['Color the parts she used.',()=>HV.fb(8,[[3,'#f783ac'],[2,'#74c0fc']],'dress 🩷 + skirt 🔵')],
f7:['Color the parts she used. Count the white ones.',()=>HV.fb(10,[[7,'#f783ac']])],
f8:['Compare the pieces.',()=>HV.fb(2,[[1,'#f783ac']],'1/2 m')+HV.fb(4,[[1,'#74c0fc']],'1/4 m')],
f9:['Share 12 buttons into 3 equal groups.',()=>HV.row(HV.box('🔘🔘🔘🔘'),HV.box('🔘🔘🔘🔘'),HV.box('🔘🔘🔘🔘'))+'<p class="hn">1/3 means one of the 3 groups.</p>'],
f10:['Split 20 into 4 equal groups.',()=>HV.row(HV.box('✨✨✨✨✨','pink'),HV.box('✨✨✨✨✨','pink'),HV.box('✨✨✨✨✨','pink'),HV.box('✨✨✨✨✨'))+'<p class="hn">3/4 means 3 of the 4 groups.</p>'],
f11:['Find the cost first, then the change.',()=>HV.row(...[1,2,3,4,5,6].map(i=>HV.box('$4',i+' m')))+'<p class="hn">Add up the cost. Then $30 − cost = change.</p>'],
f12:['Count the squares in each part.',()=>HV.grid(6,3,(i,j)=>i<4?'#f783ac':(j>0?'#74c0fc':null),null,34)],
f13:['How many 2 cm squares fit across? How many down?',()=>HV.grid(5,3,()=>'#fff0f6',null,40)+'<p class="hn">10 cm across ÷ 2, and 6 cm down ÷ 2</p>'],
f14:['One row is 8 squares. How many rows make 24?',()=>HV.grid(8,1,()=>'#f783ac',null,32)+'<p class="hn">8, 16, 24 … count the rows.</p>'],
f15:['Find the square’s perimeter first.',()=>HV.row(HV.box(HV.rect(4,4,'4','4','p'),'square'),HV.box(HV.rect(6,2,'6','?','p'),'rectangle'))+'<p class="hn">6 + ? + 6 + ? = same total</p>'],
f16:['Count the squares inside each one.',()=>HV.row(HV.box(HV.grid(4,4,()=>'#f783ac',null,22),'4 × 4'),HV.box(HV.grid(6,2,()=>'#74c0fc',null,22),'6 × 2'))],
f17:['A meter stick is 100 cm.',()=>HV.fb(2,[[1,'#f783ac']],'1 m = 100 cm')+HV.fb(2,[[1,'#f783ac']],'next 100 cm: only half used')],
f18:['Change meters to cm first.',()=>HV.fb(3,[[1,'#f783ac'],[0,'']],'3 m = 300 cm')+'<p class="hn">300 − 120 = ?</p>'],
f19:['Shade 2 of 4. Is it the same as which other bar?',()=>HV.fb(4,[[2,'#f783ac']],'2/4')+HV.fb(2,[[1,'#74c0fc']],'1/2')+HV.fb(4,[[1,'#ffd43b']],'1/4')],
f20:['How many squares in the whole quilt?',()=>HV.grid(5,4,(i,j)=>j*5+i<6?'#f783ac':'#fff',(i,j)=>j*5+i+1,32)],
f21:['The belt covers the tape from 12 to 87.',()=>HV.nl(0,100,10,{12:'⬇',87:'⬇'},null)+'<p class="hn">How far is it from 12 to 87? (12 → 87: 87 − 12)</p>'],
f22:['Half size means the paper is smaller than real life.',()=>HV.row(HV.box('📄 18 cm','paper'),HV.ar('× 2'),HV.box('🧥 ?','real'))],
f23:['Count by 8s until you pass 50.',()=>HV.row(...[8,16,24,32,40,48,56].map((v,i)=>HV.chip(v,v<=50?'#d3f9d8':'#ffc9c9')))+'<p class="hn">Green ones fit. How many?</p>'],
f24:['Draw the curtain rod in cm with a hook every 50.',()=>HV.nl(0,300,50,{0:'🪝',50:'🪝'})+'<p class="hn">Keep going to 300. Count the hooks.</p>'],
f25:['Count the squares. The middle one is a hole.',()=>HV.grid(3,5,(i,j)=>i===1&&j===2?'#495057':'#f783ac',null,36)],
f26:['Change everything to cm.',()=>HV.tbl([['1/2 m','?? cm'],['1/4 m','?? cm'],['45 cm','45 cm'],['60 cm','60 cm']])+'<p class="hn">1 m = 100 cm</p>'],
f27:['Draw both patches.',()=>HV.row(HV.box(HV.grid(2,3,()=>'#f783ac',null,20),'2 × 3'),HV.box(HV.grid(4,6,()=>'#74c0fc',null,20),'4 × 6'))],
f28:['Put 3 half-meter strips end to end.',()=>HV.row(HV.fb(2,[[1,'#f783ac']]),HV.fb(2,[[1,'#f783ac']]))+'<p class="hn">Two halves make one whole. Plus one more half…</p>'],
f29:['Deal 48 buttons into 6 coats.',()=>HV.row(...[1,2,3,4,5,6].map(i=>HV.box('🧥','?')))+'<p class="hn">6 × ? = 48</p>'],
f30:['Look at the missing piece.',()=>HV.fb(3,[[2,'#74c0fc']],'Mia 2/3')+HV.fb(4,[[3,'#f783ac']],'Nora 3/4')+'<p class="hn">Whose white gap is smaller?</p>'],
f31:['Walk around the triangle.',()=>'<svg class="hsvg" viewBox="0 0 220 160" style="max-width:240px"><path d="M110 14L30 140H190Z" fill="#fff0f6" stroke="#e8590c" stroke-width="5" stroke-dasharray="10 6"/><text x="52" y="76" font-size="17" font-weight="800">5</text><text x="160" y="76" font-size="17" font-weight="800">5</text><text x="104" y="158" font-size="17" font-weight="800">6</text></svg>'],
f32:['Find the whole area, then take half.',()=>HV.grid(8,5,(i,j)=>i<4?'#f783ac':'#fff',null,30)],
f33:['Double the kg and double the g separately.',()=>HV.tbl([['roll 1','2 kg','300 g'],['roll 2','2 kg','300 g'],['total','? kg','? g']])],
f34:['Rows × columns.',()=>HV.grid(10,10,()=>'#fff0f6',null,22)],
f35:['Meter sticks: 100 cm each.',()=>HV.row(HV.fb(1,[[1,'#f783ac']],'100'),HV.fb(1,[[1,'#f783ac']],'100'),HV.fb(2,[[1,'#f783ac']],'half'))],
f36:['Draw the strip. Only the outside edge counts.',()=>HV.grid(4,1,()=>'#f783ac',()=>'3',60)+'<p class="hn">How long is it? How wide? Walk around the outside.</p>'],
/* ---- Museum ---- */
m1:['🐛 Silkworms + 🏯 the Great Wall: the country where both come from.'],m2:['⛏️ These pants had to be tough enough for digging for gold.'],m3:['☀️ Egypt is hot. They used a plant called flax.'],
m4:['🗻 Mount Fuji and 🍣 sushi come from the same country.'],m5:['🥢 Kimchi and K-pop come from the same country.'],m6:['🏛️ Ancient Rome. The answer starts with “T”.'],m7:['🐑 Baa! Who gets a haircut once a year?'],
m8:['🌱 It grows in fields as white fluffy balls.'],m9:['🛢️ It is a kind of plastic.'],m10:['🌞 Dark things soak up sunlight like a sponge.'],m11:['🌰 Prickly seed balls that stick to fur.'],
m12:['💧 Water rolls right off it.'],m13:['🐉 Look at the Chinese characters 旗袍.'],m14:['🐘 The Taj Mahal’s country.'],m15:['🫧 Think of all the puffy air inside.'],
m16:['🎨 Think of grass: 🟦 + 🟨 = ?'],m17:['🎨 Think of grapes: 🟥 + 🟦 = ?'],m18:['🐌 It took thousands of tiny sea snails to dye one robe.'],m19:['🧥 Which one has been around for thousands of years?'],
m20:['🐑➡️🧶 It turns fluffy fiber into…'],m21:['🧵⬆⬇ Threads go over and under.'],m22:['❄️🦭 What could people find in the frozen Arctic?'],m23:['🏜️ Think shade, breeze and reflecting sun.'],
m24:['✋🪡 No machines yet…'],m25:['🚗💡 Car lights bounce back to the driver.'],m26:['🤸 It stretches and snaps back.'],m27:['🐄 It comes from an animal.'],
m28:['🐫 Camels carried silk along long trade paths.'],m29:['🌺🏄 Aloha!'],m30:['🎶 Bagpipes come from the same country.'],m31:['🌷 Windmills and tulip fields.'],
m32:['🌵☀️ A really wide hat makes a big shadow.'],m33:['🚀 Can you breathe in space?'],m34:['🐑💦 Rub wet wool and the fibers grab each other.'],m35:['🔥 What do firefighters walk into?'],m36:['🦙 Llamas and alpacas live in the Andes mountains.']};
/* character meanings for the boutique signs */
const CHM={帽:'hat',子:'(word ending)',裙:'skirt',鞋:'shoe',襪:'sock',外:'outside',套:'cover',圍:'wrap around',巾:'cloth',手:'hand',褲:'pants',雨:'rain',傘:'umbrella',眼:'eye',鏡:'lens / mirror',項:'neck',鍊:'chain',耳:'ear',環:'ring',錶:'watch',背:'back',包:'bag',皮:'leather',帶:'strap',睡:'sleep',衣:'clothes',泳:'swim',洋:'western',裝:'outfit',靴:'boot',髮:'hair',夾:'clip',
 新:'new',品:'product',上:'up / on',市:'market',試:'try',間:'room',結:'finish',帳:'bill',出:'out',口:'opening',入:'in',請:'please',勿:'do not',觸:'touch',摸:'feel',營:'run (a shop)',業:'business',中:'in the middle of',休:'rest',息:'breath',買:'buy',一:'one',送:'give',打:'(discount)',八:'eight',折:'tenths',五:'five',半:'half',價:'price',第:'number…',二:'two',件:'piece',紅:'red',色:'color',藍:'blue',粉:'powder / light',特:'special',限:'limit',量:'amount'};
function hintFor(k,q){const id=q[0];
  if(k==='magazine'){const txt=MAGS[q[5]][1],ss=txt.match(/[^.!?]+[.!?]+["”]?/g)||[txt],key=(q[3]+' '+q[2][0]).toLowerCase().match(/[a-z’']{4,}/g)||[];
    let best=0,bi=0;ss.forEach((s,i)=>{const w=s.toLowerCase();const sc=key.filter(x=>w.includes(x)).length;if(sc>best){best=sc;bi=i;}});
    if(/mostly about|main idea|lesson|teach/i.test(q[1]))return {t:'Read the whole article again. What is EVERY sentence about? The title is a big clue.',h:null,mark:-1};
    return {t:'The answer is in the highlighted sentence. Read it slowly.',h:null,mark:bi};}
  if(k==='boutique'){const s=q[6]||null;const target=s||(typeof q[2][0]==='object'?null:null);
    if(s){const ch=[...s.zh],zy=s.zy.split(' ');let h='<div class="hchars">'+ch.map((c,i)=>'<div class="hcc">'+RB(c,zy[i]||'')+'<small>'+(CHM[c]||'')+'</small></div>').join('')+'</div>';
      const m=/打(.)折/.exec(s.zh);if(m){const n={八:8,五:5}[m[1]];h+=HV.fb(10,[[n,'#f783ac']],'pay '+n+' of every 10 parts');}
      if(s.zh==='半價')h+=HV.fb(2,[[1,'#f783ac']],'pay half');
      h=h.replace(/<div class="hcc">/g,'<div class="hcc" data-say>');return {t:'Look at what each character means. Tap a card to hear it.',h};}
    return {t:'Tap each card to hear it read aloud. Which one sounds like the Chinese word for what she wants?',h:'<div class="hchars">'+q[2].slice().sort(()=>Math.random()-.5).map(x=>'<div class="hcc" data-say="'+x.zh+'">'+RB(x.zh,x.zy)+'<small>🔈</small></div>').join('')+'</div>'};}
  const H=HINTS[id];if(!H)return null;
  let h=H[1]?H[1]():null;if(k==='museum'){h=null;}
  return {t:H[0],h,elim:k==='museum'};}
function sayZh(t){if(!SOUND||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='zh-TW';u.rate=.8;const v=speechSynthesis.getVoices().find(x=>/zh[-_]TW/i.test(x.lang))||speechSynthesis.getVoices().find(x=>/^zh/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}}
/* ---- skill state ---- */
function LS(k){C.learn=C.learn||{};return C.learn[k]=C.learn[k]||{seen:[],miss:[],first:0};}
function badgesOf(k){const f=LS(k).first;return BADGE.filter(t=>f>=t).length;}
function totalBadges(){return LKEYS.reduce((a,k)=>a+badgesOf(k),0);}
function capLevel(){const b=totalBadges();let i=0;LV_BADGES.forEach((n,k)=>{if(b>=n)i=k;});return i;}
function rawLv(s){let i=0;LV.forEach((l,k)=>{if(s>=l[0])i=k;});return i;}
function lvUpLines(){const L=lvOf(C.stars);let P=[];if(L>(C.lvShown||0)){C.lvShown=L;if(L===LV.length-1&&!C.top){C.top=true;P=STORY.ending;}else P=fillS(STORY.level,{l:LV[L][1]});setTimeout(()=>{confetti();sfx.win();},400);}
  else if(rawLv(C.stars)>L&&C.toldBadge!==L){C.toldBadge=L;P=STORY.needBadge;}
  if(rawLv(C.stars)<=L)C.toldBadge=null;cSave();return P;}

/* ---- second street: the Fashion District ---- */
const TOWN2=[{k:'studio',x:110,w:150,lab:'Studio',go:()=>learnJob('studio')},{k:'fabric',x:300,w:150,lab:'Fabric',go:()=>learnJob('fabric')},{k:'magazine',x:500,w:160,lab:'Magazine',go:()=>learnJob('magazine')},
  {k:'boutique',x:700,w:150,lab:'Boutique',go:()=>learnJob('boutique')},{k:'museum',x:890,w:170,lab:'Museum',go:()=>learnJob('museum')}];
const curTown=()=>C&&C.street===2?TOWN2:TOWN;
function B2(k,x){const O='stroke="#4a3426" stroke-width="3" stroke-linejoin="round"';
  if(k==='studio')return '<rect x="'+(x-62)+'" y="250" width="124" height="190" fill="#f3f0ff" '+O+'/><path d="M'+(x-70)+' 250L'+x+' 205L'+(x+70)+' 250Z" fill="#7048e8" '+O+'/><rect x="'+(x-44)+'" y="276" width="88" height="70" rx="6" fill="#fff" '+O+'/><path d="M'+(x-20)+' 334l14-40 10 26 8-14 12 28" fill="none" stroke="#d6336c" stroke-width="3"/><path d="M'+(x+30)+' 290l10-10 6 6-10 10z" fill="#ffd43b" '+O+'/><rect x="'+(x-15)+'" y="386" width="30" height="54" fill="#5f3dc4" '+O+'/>';
  if(k==='fabric')return '<rect x="'+(x-62)+'" y="270" width="124" height="170" fill="#e6fcf5" '+O+'/><path d="M'+(x-68)+' 290H'+(x+68)+'L'+(x+60)+' 262H'+(x-60)+'Z" fill="#0ca678" '+O+'/>'+[['#f783ac',-38],['#74c0fc',-8],['#ffd43b',22]].map(([c,d])=>'<rect x="'+(x+d)+'" y="304" width="24" height="70" rx="4" fill="'+c+'" '+O+'/><ellipse cx="'+(x+d+12)+'" cy="304" rx="12" ry="5" fill="'+shade(c,.3)+'" '+O+'/>').join('')+'<path d="M'+(x-50)+' 384h100" stroke="#4a3426" stroke-width="3"/>'+[0,1,2,3,4,5,6,7,8,9,10].map(i=>'<path d="M'+(x-50+i*10)+' 384v'+(i%5?5:9)+'" stroke="#4a3426" stroke-width="2"/>').join('')+'<rect x="'+(x-14)+'" y="400" width="28" height="40" fill="#087f5b" '+O+'/>';
  if(k==='magazine')return '<rect x="'+(x-70)+'" y="180" width="140" height="260" fill="#e7f5ff" '+O+'/><rect x="'+(x-56)+'" y="196" width="112" height="78" fill="#fff" '+O+'/><text x="'+x+'" y="222" text-anchor="middle" font-size="18" font-weight="900" fill="#1c7ed6">STYLE</text><path d="M'+(x-44)+' 236h88M'+(x-44)+' 250h60M'+(x-44)+' 262h74" stroke="#adb5bd" stroke-width="4"/>'+'<rect x="'+(x-56)+'" y="290" width="40" height="34" rx="3" fill="#d0ebff" '+O+'/><rect x="'+(x+16)+'" y="290" width="40" height="34" rx="3" fill="#d0ebff" '+O+'/><rect x="'+(x-22)+'" y="370" width="44" height="70" fill="#1971c2" '+O+'/>';
  if(k==='boutique')return '<rect x="'+(x-60)+'" y="270" width="120" height="170" fill="#fff5f5" '+O+'/><path d="M'+(x-68)+' 300H'+(x+68)+'L'+(x+60)+' 270H'+(x-60)+'Z" fill="#e03131" '+O+'/>'+[0,1,2,3,4].map(i=>'<path d="M'+(x-56+i*26)+' 272L'+(x-46+i*26)+' 300" stroke="#ffd43b" stroke-width="7"/>').join('')+'<rect x="'+(x-34)+'" y="226" width="68" height="40" rx="6" fill="#ffd43b" '+O+'/><text x="'+x+'" y="255" text-anchor="middle" font-size="24" font-weight="900" fill="#c92a2a">服飾</text><rect x="'+(x-44)+'" y="314" width="88" height="54" rx="6" fill="#d0ebff" '+O+'/><text x="'+x+'" y="350" text-anchor="middle" font-size="26">🏷️👚</text><rect x="'+(x-15)+'" y="388" width="30" height="52" fill="#c92a2a" '+O+'/>';
  if(k==='museum')return '<path d="M'+(x-80)+' 280L'+x+' 226L'+(x+80)+' 280Z" fill="#f1f3f5" '+O+'/><rect x="'+(x-80)+'" y="280" width="160" height="14" fill="#dee2e6" '+O+'/>'+[-60,-30,0,30,60].map(d=>'<rect x="'+(x+d-8)+'" y="294" width="16" height="120" fill="#fff" '+O+'/>').join('')+'<rect x="'+(x-86)+'" y="414" width="172" height="26" fill="#dee2e6" '+O+'/><circle cx="'+x+'" cy="258" r="10" fill="#ffd43b" '+O+'/>';
  return '';}

