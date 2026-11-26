const pieces=t=>{const o=[];TPL[t].steps.forEach((st,i)=>st.g.forEach(g=>o.push({s:st.s,g,step:i})));return o;};
const pieceCount=t=>pieces(t).length;
function needOf(t){const n={};pieces(t).forEach(p=>n[p.s]=(n[p.s]||0)+1);return n;}
function canBuild(t){const n=needOf(t);return Object.keys(n).every(s=>S.bin[s].length>=n[s]);}
function stepCols(t){const c=shuffle(CK);return pieces(t).map(p=>c[p.step%c.length]);}
function solid(t,c){return pieces(t).map(()=>c);}
// a whole dino. cols = one color per piece. opts.built = pieces done (blueprint), opts.cur = piece being asked for
function dinoSVG(t,cols,opts){opts=opts||{};const T=TPL[t];const items=[];const all=opts.built===undefined;
 pieces(t).forEach((p,k)=>{const built=all||k<opts.built;const ck=cols[k]||'green';let svg=built?brick(p.s,p.g,COL[ck]?COL[ck][0]:ck):geoSVG(p.s,p.g,'',`slot${opts.cur===k?' now':''}`);
  if(built&&opts.popIdx===k)svg=`<g class="pop">${svg}</g>`;
  if(p.g.leg!==undefined)svg=`<g data-leg="${p.g.leg}">${svg}</g>`;else if(p.g.wing)svg=`<g data-wing="1">${svg}</g>`;
  items.push({z:p.g.z||0,svg});});
 items.sort((a,b)=>a.z-b.z);let o=items.map(x=>x.svg).join('');
 if(all||opts.built>=pieceCount(t)){const [ex,ey]=T.eye,er=T.eyeR||4.6;o+=`<g class="eye"><circle cx="${ex}" cy="${ey}" r="${er}" fill="#fff" ${ST}/><circle cx="${ex+1}" cy="${ey}" r="${er*.5}" fill="${INK}"/><circle cx="${ex+er*.4}" cy="${ey-er*.25}" r="${er*.2}" fill="#fff"/></g>`;
  o+=`<ellipse cx="${ex-3}" cy="${ey+8}" rx="3" ry="1.6" fill="#ff8787" opacity=".7"/>`;
  if(T.mouth)o+=`<path d="${T.mouth}" stroke="${INK}" stroke-width="2" stroke-linecap="round" fill="none"/>`;}
 return o;}
const dinoBox=(t,cols,cls)=>`<svg class="${cls||''}" viewBox="-6 -14 112 98" style="overflow:visible">${dinoSVG(t,cols)}</svg>`;

/* ---------- regions (zoo areas + station scenes) ---------- */
// draws a background into a W×H box; returns svg markup
function areaArt(key,W,H){const sky=H*.36,m=Math.min(W,H);let o='';
 const pal={home:['#a5d8ff','#b2f2bb','#d3f9d8'],jungle:['#b2f2bb','#69db7c','#a9e34b'],beach:['#a5d8ff','#ffe8a3','#fff3bf'],snow:['#d0ebff','#e9ecef','#f8f9fa'],volcano:['#ffc078','#adb5bd','#ced4da'],meadow:['#a5d8ff','#c0eb75','#e9fac8'],swamp:['#5f3dc4','#2f9e44','#b2f2bb'],desert:['#ffe066','#ffc078','#ffe8cc']}[key];
 o+=`<rect width="${W}" height="${H}" fill="#fbf3e4"/><rect width="${W}" height="${sky+20}" fill="${pal[0]}" opacity=".55"/><rect width="${W}" height="${sky+20}" fill="url(#skyh)"/>`;
 const cr=(pts,c,sw)=>crayon(pts,c,sw||2.4);
 if(key==='swamp'){o+=cr(ellPts(W*.82,sky*.38,m*.06,m*.06),'#fff3bf');for(let i=0;i<14;i++)o+=`<circle cx="${(i*137)%W}" cy="${(i*61)%(sky*.9)}" r="2.2" fill="#fff" opacity=".85"/>`;}
 if(key==='desert'){o+=cr(ellPts(W*.8,sky*.45,m*.09,m*.09),'#ffa94d')+cr(ellPts(W*.8,sky*.45,m*.06,m*.06),'#ffd43b',1.6);o+=cr([[W*.02,sky+14],[W*.2,sky*.55],[W*.42,sky+14]],'#e8a35c')+cr([[W*.3,sky+14],[W*.52,sky*.7],[W*.74,sky+14]],'#f0b870');}
 if(key==='home'||key==='beach'||key==='meadow'){o+=cr(ellPts(W*.86,sky*.42,m*.07,m*.07),'#ffd43b');o+=cr(ellPts(W*.4,sky*.3,W*.07,sky*.1),'#fff',1.6)+cr(ellPts(W*.47,sky*.25,W*.05,sky*.12),'#fff',1.6);}
 if(key==='beach')o+=`<rect y="${sky-4}" width="${W}" height="${H*.16}" fill="#74c0fc"/><rect y="${sky-4}" width="${W}" height="${H*.16}" fill="url(#hat)"/>`+Array.from({length:6},(_,i)=>`<path d="M${W*(.05+i*.17)} ${sky+H*.06} q${W*.03} -8 ${W*.06} 0 t${W*.06} 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('');
 if(key==='snow'){o+=cr([[W*.04,sky+12],[W*.24,sky*.12],[W*.44,sky+12]],'#ced4da')+cr([[W*.18,sky*.42],[W*.24,sky*.12],[W*.3,sky*.42],[W*.24,sky*.36]],'#fff',1.6);
  o+=cr([[W*.48,sky+12],[W*.72,sky*.02],[W*.96,sky+12]],'#adb5bd')+cr([[W*.65,sky*.35],[W*.72,sky*.02],[W*.79,sky*.35],[W*.72,sky*.28]],'#fff',1.6);
  for(let i=0;i<22;i++)o+=`<path d="M${(i*97)%W} ${(i*53)%(H*.85)} l3 3 m0 -3 l-3 3" stroke="#74c0fc" stroke-width="1.6"/>`;}
 if(key==='volcano'){o+=cr([[W*.44,sky+14],[W*.61,sky*.22],[W*.75,sky*.22],[W*.93,sky+14]],'#8d6e63')+cr([[W*.61,sky*.22],[W*.68,sky*.34],[W*.75,sky*.22]],'#ff6b6b',1.8);
  o+=`<path d="M${W*.64} ${sky*.28} q-8 30 3 60 M${W*.72} ${sky*.28} q12 30 0 60" stroke="#fa5252" stroke-width="4" fill="none" stroke-linecap="round"/>`+cr(ellPts(W*.68,sky*.02,m*.05,m*.04),'#ced4da',1.6)+cr(ellPts(W*.75,-sky*.06,m*.06,m*.05),'#ced4da',1.6);}
 const hill=[];for(let i=0;i<=12;i++){const x=W*i/12;hill.push([x,sky+8-Math.sin(i/12*3.1416*1.3)*H*.06]);}hill.push([W,H],[0,H]);
 o+=`<path d="${wob(hill,2.5,4)}" fill="${pal[1]}"/><path d="${wob(hill,2.5,4)}" fill="url(#hat)"/><path d="${wob(hill.slice(0,13),2,5).replace(/Z$/,'')}" stroke="${INK}" stroke-width="2.2" fill="none"/>`;
 o+=`<rect y="${sky+18}" width="${W}" height="${H}" fill="${pal[2]}" opacity=".7"/>`;
 if(key==='jungle'||key==='home'){for(let x=4;x<W;x+=9)o+=`<path d="M${x} ${H} q2 -${8+(x*7)%10} ${2+(x%3)} -${14+(x*13)%10}" stroke="${key==='jungle'?'#2f9e44':'#51cf66'}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>`;}
 if(key==='jungle')for(let i=0;i<5;i++){const x=W*(.08+i*.22),h=sky*(.62+(i%2)*.18),b=sky+12;o+=`<path d="M${x} ${b} q${m*.02} ${-h*.5} 0 ${-h}" stroke="#8b5e34" stroke-width="${m*.022}" fill="none" stroke-linecap="round"/><path d="M${x} ${b} q${m*.02} ${-h*.5} 0 ${-h}" stroke="${INK}" stroke-width="1.4" fill="none" transform="translate(${m*.011},0)"/>`;
  for(let a=0;a<5;a++){const an=-2.6+a*.55;o+=`<path d="M${x} ${b-h} q${Math.cos(an)*m*.08} ${Math.sin(an)*m*.08-10} ${Math.cos(an)*m*.14} ${Math.sin(an)*m*.05+12}" stroke="#2b8a3e" stroke-width="${m*.026}" fill="none" stroke-linecap="round"/>`;}}
 if(key==='home')o+=cr(ellPts(W*.2,H*.64,W*.12,H*.07),'#74c0fc')+cr(ellPts(W*.64,sky-6,H*.07,H*.07),'#40c057')+cr(ellPts(W*.72,sky-12,H*.08,H*.08),'#2f9e44');
 if(key==='meadow')for(let i=0;i<26;i++){const x=(i*97+31)%W,y=sky+24+((i*53)%(H-sky-30)),c=['#ff8787','#ffd43b','#da77f2','#fff'][i%4];o+=`<path d="M${x} ${y+9} v-9" stroke="#2f9e44" stroke-width="2"/>`+[0,1,2,3,4].map(k=>`<circle cx="${x+Math.cos(k*1.256)*4}" cy="${y+Math.sin(k*1.256)*4}" r="3.2" fill="${c}" stroke="${INK}" stroke-width=".8"/>`).join('')+`<circle cx="${x}" cy="${y}" r="2.4" fill="#ffd43b"/>`;}
 if(key==='swamp'){o+=cr(ellPts(W*.3,H*.72,W*.26,H*.1),'#3bc9db')+`<rect x="0" y="0" width="${W}" height="${H}" fill="#1b2550" opacity=".18"/>`;for(let i=0;i<9;i++){const x=W*(.62+i*.045),h=H*(.16+(i%3)*.05);o+=`<path d="M${x} ${H*.92} q3 -${h/2} 0 -${h}" stroke="#2b8a3e" stroke-width="3" fill="none"/><ellipse cx="${x+1}" cy="${H*.92-h}" rx="3.5" ry="9" fill="#8b5a2b" stroke="${INK}" stroke-width="1.2"/>`;}
  o+=cr(ellPts(W*.22,H*.7,W*.05,H*.025),'#51cf66',1.6)+cr(ellPts(W*.38,H*.75,W*.04,H*.02),'#51cf66',1.6);}
 if(key==='desert')for(const [cx,h] of [[.1,.22],[.9,.3],[.56,.16]]){const x=W*cx,b=H*.94,hh=H*h,w=Math.max(10,W*.02);o+=cr(subdiv([[x-w,b],[x-w,b-hh],[x+w,b-hh],[x+w,b]],2),'#40c057')+cr(subdiv([[x+w,b-hh*.55],[x+w*2.6,b-hh*.55],[x+w*2.6,b-hh*.85],[x+w*1.8,b-hh*.85],[x+w*1.8,b-hh*.7],[x+w,b-hh*.7]],1),'#40c057',1.8);}
 if(key==='beach')o+=`<text x="${W*.15}" y="${H*.9}" font-size="${m*.08}">🐚</text><text x="${W*.8}" y="${H*.75}" font-size="${m*.07}">⭐</text>`;
 if(key==='volcano')o+=`<path d="M${W*.1} ${H*.8} q${W*.1} -12 ${W*.2} 0" stroke="#fa5252" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>`;
 return o;}
const AREAS={home:['🏞','Home','家園'],jungle:['🌴','Jungle','叢林'],beach:['🏖','Beach','海灘'],snow:['❄️','Snow','雪山'],volcano:['🌋','Volcano','火山'],meadow:['🌼','Meadow','花草原'],swamp:['🐸','Swamp','沼澤'],desert:['🌵','Desert','沙漠']};

/* ---------- the story ---------- */
const PIPC=['green','green','green','#ffa8a8','#b2f2bb','orange','#fff4e6','#fff4e6'];
const MOMC=['green','green','#40c057','#40c057','green','green','orange','yellow','orange','#fff4e6','#fff4e6','#fff4e6'];
const CAST={pip:{t:'babytrike',c:PIPC,sz:.6,em:'🦕',pitch:1.6},nar:{em:'⭐'},
 mom:{t:'trike',c:MOMC,sz:1.15,em:'🦖',pitch:1},neckmom:{t:'brachio',c:solid('brachio','yellow'),sz:1.1,em:'🦕',pitch:1.05},
 ptmom:{t:'ptero',c:solid('ptero','blue'),sz:1,em:'🪽',pitch:1.25},ankmom:{t:'ankylo',c:solid('ankylo','orange'),sz:1,em:'🛡️',pitch:.95}};
const CH=[
 {key:'jungle',em:'🌴',en:'Jungle Station',zh:'叢林站',friend:'neckmom',goal:'rex',baby:{t:'brachio',c:solid('brachio','yellow')},
  missions:[{g:'fruit',en:'Feed the hungry dinos',zh:'餵飽肚子餓的恐龍'},{g:'fossil',en:'Dig for clues',zh:'挖出線索'},{g:'care',en:'Care for the baby',zh:'照顧寶寶'}],
  arrive:[['pip','Are you my mommy?','你是我的媽媽嗎?'],['neckmom','No, little one. And my baby is lost too!','不是喔,小寶貝。我的寶寶也走丟了!'],['pip','Milo can help! Milo is the Dino Ranger!','洛明會幫忙!洛明是恐龍巡守員!'],['nar','Do the jobs to earn bricks. Then build a T-Rex to help!','完成任務賺積木,再蓋一隻暴龍來幫忙!']],
  finale:[['nar','Look! {N} the T-Rex is sniffing the tall grass…','你看!暴龍{N}在高高的草叢裡聞一聞……',{items:[['pip',.12,.55],['neckmom',.34,1],['goal',.6,.9]],prop:['grass',.84,'hide']}],
   ['nar','{N} found something! Who is hiding in the grass?','{N}找到東西了!誰躲在草叢裡?',{items:[['pip',.12,.55],['neckmom',.34,1],['goal',.6,.9],['baby',.85,.5,1]],prop:['grass',.85,'peek']}],
   ['neckmom','My baby! Thank you, Milo and {N}!','我的寶寶!謝謝洛明和{N}!',{items:[['pip',.12,.55],['neckmom',.4,1],['baby',.62,.5,1],['goal',.84,.9,1]],hearts:1}],
   ['pip','Yay! Now let’s go to the beach!','耶!我們去海灘吧!',{items:[['pip',.12,.55],['neckmom',.4,1],['baby',.62,.5,1],['goal',.84,.9,1]]}]]},
 {key:'beach',em:'🏖',en:'Beach Station',zh:'海灘站',friend:'ptmom',goal:'stego',baby:{t:'ptero',c:solid('ptero','blue')},
  missions:[{g:'shadow',en:'Fix the broken bridge',zh:'修好壞掉的橋'},{g:'eggs',en:'Sort the beach eggs',zh:'把海灘的蛋分類'},{g:'mail',en:'Deliver the letters',zh:'送信'}],
  arrive:[['pip','Are you my mommy?','你是我的媽媽嗎?'],['ptmom','No! I can fly, see? But the bridge is broken, and my baby is on the other side!','不是!你看,我會飛!可是橋壞了,我的寶寶在另一邊!'],['nar','Fix the bridge, then build a Stego to guard the eggs!','修好橋,再蓋一隻劍龍來保護蛋!']],
  finale:[['nar','The bridge is fixed! {N} the Stego walks across…','橋修好了!劍龍{N}走過橋……',{items:[['pip',.1,.55],['ptmom',.25,.8],['goal',.5,.8]],prop:['bridge',.52]}],
   ['nar','Look! Baby Ptero is on the other side!','你看!翼龍寶寶在另一邊!',{items:[['pip',.1,.55],['ptmom',.25,.8],['goal',.62,.8],['baby',.88,.5,1]],prop:['bridge',.52]}],
   ['ptmom','My baby! You are safe! Thank you, Milo and {N}!','我的寶寶!你安全了!謝謝洛明和{N}!',{items:[['pip',.1,.55],['goal',.3,.8],['baby',.68,.5,1],['ptmom',.86,.8,1]],prop:['bridge',.52],hearts:1}],
   ['pip','Brr… let’s go to Snow Mountain next!','我們接著去雪山吧!',{items:[['pip',.1,.55],['goal',.3,.8],['baby',.68,.5,1],['ptmom',.86,.8,1]],prop:['bridge',.52]}]]},
 {key:'snow',em:'❄️',en:'Snow Station',zh:'雪山站',friend:'ankmom',goal:'ankylo',baby:{t:'ankylo',c:solid('ankylo','orange')},
  missions:[{g:'pattern',en:'Follow the footprints',zh:'跟著腳印走'},{g:'zhuyin',en:'Echo cave sounds',zh:'山洞回音'},{g:'care',en:'Warm up the babies',zh:'幫寶寶取暖'}],
  arrive:[['pip','Brr! It’s cold! Are you my mommy?','好冷!你是我的媽媽嗎?'],['ankmom','No, little one. My baby is lost in the snow!','不是喔,小寶貝。我的寶寶在雪裡走丟了!'],['nar','Follow the footprints, then build a strong Ankylo!','跟著腳印走,再蓋一隻強壯的甲龍!']],
  finale:[['nar','{N} the Ankylo pushes the big snow pile…','甲龍{N}推開大雪堆……',{items:[['pip',.1,.55],['ankmom',.3,.9],['goal',.58,.9]],prop:['snow',.83,'hide']}],
   ['nar','Push, push! Look who was behind the snow!','推呀推!你看雪堆後面是誰!',{items:[['pip',.1,.55],['ankmom',.3,.9],['goal',.6,.9],['baby',.84,.5,1]],prop:['snow',.95,'open']}],
   ['ankmom','My baby! Thank you, Milo and {N}!','我的寶寶!謝謝洛明和{N}!',{items:[['pip',.1,.55],['ankmom',.36,.9],['baby',.58,.5,1],['goal',.82,.9,1]],prop:['snow',.97,'open'],hearts:1}],
   ['pip','I hear a big roar from the volcano… is that my mommy?','我聽到火山傳來大吼聲……是我的媽媽嗎?',{items:[['pip',.1,.55],['ankmom',.36,.9],['baby',.58,.5,1],['goal',.82,.9,1]],prop:['snow',.97,'open']}]]},
 {key:'volcano',em:'🌋',en:'Volcano Station',zh:'火山站',friend:'mom',hideFriend:true,goal:'brachio',baby:null,
  missions:[{g:'lava',en:'Cross the lava',zh:'跳過岩漿'},{g:'fruit',en:'Pack food for everyone',zh:'幫大家準備食物'},{g:'fossil',en:'Open the stone door',zh:'打開石頭門'}],
  arrive:[['pip','I hear a big roar… Mommy? Is that you?','我聽到大吼聲……媽媽?是你嗎?'],['nar','Cross the lava, then build a Long Neck to see over the rocks!','跳過岩漿,再蓋一隻腕龍,看看石頭後面!']],
  finale:[['nar','{N} the Long Neck stretches up to look over the big rocks…','腕龍{N}伸長脖子,看看大石頭後面……',{items:[['pip',.12,.55],['goal',.42,1.1]],prop:['rocks',.76,'hide']}],
   ['nar','…and sees a big Tricera!','……看到了一隻大三角龍!',{items:[['pip',.12,.55],['goal',.4,1.1],['mom',.76,1.15,1]],prop:['rocks',.76,'peek']}],
   ['mom','Pip! My baby! I looked everywhere for you!','皮皮!我的寶寶!我到處找你!',{items:[['goal',.2,1.1],['pip',.45,.55],['mom',.7,1.15,1]],hearts:1}],
   ['pip','Mommy! Milo found you!','媽媽!洛明找到你了!',{items:[['goal',.2,1.1],['pip',.45,.55],['mom',.7,1.15,1]],hearts:1}],
   ['nar','The volcano is calm. Every dino family is home. You did it, Dino Ranger!','火山安靜了。每個恐龍家庭都回家了。恐龍巡守員,你做到了!',{items:[['goal',.2,1.1],['pip',.45,.55],['mom',.7,1.15,1]]}]]}];
