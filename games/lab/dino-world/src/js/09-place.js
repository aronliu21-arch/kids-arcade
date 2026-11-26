function place(){SFX.click();setTimeout(SFX.pop,60);const p=B.P[B.k];const i=S.bin[p.s].indexOf(B.cols[B.k]);if(i>=0)S.bin[p.s].splice(i,1);save();showWallet();B.k++;
 if(B.k<B.P.length){buildBusy=true;setTimeout(()=>{buildBusy=false;buildStep();},450);$('bpSvg').innerHTML=dinoSVG(B.t,B.cols,{built:B.k,cur:B.k,popIdx:B.k-1});return;}
 $('bpSvg').innerHTML=dinoSVG(B.t,B.cols,{built:B.k,popIdx:B.k-1});SOLVE=null;$('bOpts').innerHTML='';const T=TPL[B.t];
 buildBusy=true;setTimeout(()=>{buildBusy=false;SFX.fanfare();confetti(30);$('bTxt').innerHTML=bi(`You built a ${T.en}!`,`你蓋好了一隻${T.zh}!`);say(`Wow! You built a ${T.en}!`,`哇!你蓋好了一隻${T.zh}!`);
  setTimeout(()=>nameDino(B.t,B.cols,false,name=>{const ci=CUR!==null?CUR:Math.min(S.ch,CH.length-1);const isGoal=ci<CH.length&&CH[ci]&&CH[ci].goal===B.t&&!S.goal[ci];if(isGoal)S.goal[ci]=1;
   const area=CH[ci]&&S.areas.includes(CH[ci].key)?CH[ci].key:'home';S.dinos.push({t:B.t,c:B.cols,name,area,stage:2,hearts:0});save();
   rec({q:'built dino',given:B.t,expected:B.t,correct:true,tryNo:1,topic:'build'});
   if(isGoal&&CUR!==null)return afterName(`${T.en} is ready to help!`,`${T.zh}準備好幫忙了!`,()=>openStation(CUR),'🚉');
   Z.area=area;afterName(`Welcome to the zoo, ${name}!`,`歡迎${name}來到動物園!`,()=>{Z.newest=S.dinos.length-1;goZoo();},'🏞');}),2200);},400);}
function afterName(en,z,go,em){const st=$('nStage');$('nTxt').innerHTML=bi(en,z);const bt=document.createElement('button');bt.className='btn green';bt.innerHTML=`${em} ${bi('Next','繼續')}`;bt.onclick=go;st.appendChild(bt);SOLVE=()=>bt.click();setTimeout(()=>say(en,z),1800);}

/* ---------- naming: pick a name, then drag the letters ---------- */
// level 3 of building: a shape you see in real life + a color word
const REALSH={tri:[['🍕','pizza slice','披薩'],['⛺','tent','帳篷'],['🔺','traffic cone','三角錐']],sq:[['🎁','present','禮物盒'],['🧇','waffle','鬆餅'],['🪟','window','窗戶']],
 rect:[['🚪','door','門'],['📱','phone','手機'],['🍫','chocolate bar','巧克力']],circ:[['🍪','cookie','餅乾'],['⚽','ball','球'],['🍩','donut','甜甜圈']],semi:[['🌈','rainbow','彩虹'],['🍉','melon slice','西瓜片'],['🌙','half moon','半月']]};
const NAMES=['REX','DOT','MAX','ZIP','BOB','GUS','KIT','BEN','SAM','TED','POP','BUD','MEG','JET','FIN','DAN','LIZ','NED','TOM','LULU','BO','TAD','ROO','SUE'].filter(n=>n.length<=3);
NAMES.push('ACE','AMY','BEA','CAL','DAX','ELI','FOX','GIL','HAL','IVY','JAX','KAI','LEO','MIA','OLI','RAY','ROY','SKY','VAL','WES','ZED','ZOE','ODIE','BUZZ','KOKO','MOMO');
const RESERVED=['PIP','MOM'];
// every dino gets its own name: never reuse one already in the zoo (or Pip/Mom's)
function usedNames(skip){return new Set(S.dinos.filter(d=>d!==skip).map(d=>String(d.name).toUpperCase()).concat(RESERVED));}
function freshNames(n,skip){const used=usedNames(skip);const out=shuffle(NAMES.filter(x=>!used.has(x))).slice(0,n);const C='BDGKMNPRSTZ',V='AEIOU';let k=0;
 while(out.length<n&&k<500){k++;const x=C[rnd(C.length)]+V[rnd(V.length)]+C[rnd(C.length)];if(!used.has(x)&&!out.includes(x)&&!/^(DIK|DIN|PIS|PUS|NIP|TIT|KOK|PUK|SUK|ZIT|BUM|PEE|POO|DUM)$/.test(x))out.push(x);}return out;}
let NM=null,spellBusy=false;
function nameDino(t,cols,baby,done){show('name');const choices=freshNames(3);
 const art=`<svg viewBox="-6 -14 112 98" style="width:min(48vw,24vh,220px);overflow:visible">${dinoSVG(t,cols)}</svg>`;
 $('nTxt').innerHTML=bi(baby?'Pick a name for the baby!':'Pick a name for your dino!',baby?'幫寶寶選一個名字!':'幫你的恐龍選一個名字!');
 say(`Pick a name! ${choices.join('? ')}?`,baby?'幫寶寶選一個名字!':'幫你的恐龍選一個名字!');
 const st=$('nStage');st.innerHTML=`${art}<div class="opts">${choices.map(n=>`<button class="namebtn" data-n="${n}">${n}</button>`).join('')}</div>`;
 st.querySelectorAll('.namebtn').forEach(b=>b.onclick=()=>spell(b.dataset.n));
 SOLVE=()=>spell(choices[0]);
 function spell(name){NM={name,cur:0,tries:0};const extra=shuffle('ABCDEFGHIJKLMNOPRSTUW'.split('').filter(c=>!name.includes(c))).slice(0,2);const tiles=shuffle(name.split('').concat(extra));
  st.innerHTML=`${art.replace('48vw,24vh,220px','40vw,18vh,170px')}<div class="boxes">${name.split('').map((c,i)=>`<div class="box${i===0?' now':''}" data-drop="${i}">${c}</div>`).join('')}</div><div class="tiles">${tiles.map(c=>`<button class="tile" data-l="${c}">${c}</button>`).join('')}</div>`;
  prompt();st.querySelectorAll('.tile').forEach(tl=>draggable(tl,(target,tap)=>{if(tl.classList.contains('gone'))return;if(!tap&&!target)return;tryL(tl);}));
  SOLVE=()=>{const tl=[...st.querySelectorAll('.tile:not(.gone)')].find(x=>x.dataset.l===NM.name[NM.cur]);if(tl)tryL(tl);};}
 function prompt(){const L=NM.name[NM.cur];$('nTxt').innerHTML=bi(`${NM.name}: find the letter ${L}!`,`拼出名字:找到字母${L}!`);say(`${NM.name}. Find the letter ${L}!`,`找到字母${L}!`);}
 function tryL(tl){if(spellBusy)return;const want=NM.name[NM.cur],ok=tl.dataset.l===want;
  rec({q:`spell ${NM.name} letter ${NM.cur+1}`,given:tl.dataset.l,expected:want,correct:ok,tryNo:NM.tries+1,topic:'letters'});
  if(ok)return put(tl);SFX.boing();tl.classList.remove('shake');void tl.offsetWidth;tl.classList.add('shake');NM.tries++;
  const right=[...st.querySelectorAll('.tile:not(.gone)')].find(x=>x.dataset.l===want);
  if(NM.tries===1){st.querySelectorAll('.box')[NM.cur].classList.add('hint');right.classList.add('wiggle');setTimeout(()=>right.classList.remove('wiggle'),1900);say(`That's ${tl.dataset.l}. We need ${want}.`,`這是${tl.dataset.l},我們要${want}。`);}
  else{right.classList.add('glow');say(`This is ${want}!`,`這是${want}!`);spellBusy=true;setTimeout(()=>{spellBusy=false;right.classList.remove('glow');put(right);},1400);}}
 function put(tl){SFX.click();NM.tries=0;tl.classList.add('gone');const boxes=[...st.querySelectorAll('.box')];boxes[NM.cur].classList.remove('now');boxes[NM.cur].classList.add('full');NM.cur++;
  if(NM.cur<NM.name.length){boxes[NM.cur].classList.add('now');say(tl.dataset.l,'');setTimeout(prompt,600);return;}
  const n=NM.name;SOLVE=null;SFX.fanfare();confetti(40);say(`${n.split('').join(', ')}. ${n}!`,`${n}!`);done(n);}}

/* ---------- the zoo: areas, roaming dinos, feeding babies ---------- */
let Z={W:0,H:0,ds:[],raf:0,last:0,area:'home',feed:false};
const STAGE_SZ=[.55,.78,1];
function goZoo(){musicOn();BACK=null;show('zoo');say('Your dino zoo!','你的恐龍動物園!');}
function zooTabs(){$('zTabs').innerHTML=Object.keys(AREAS).map(k=>{const a=AREAS[k];const open=S.areas.includes(k);return `<button class="tab${Z.area===k?' on':''}" data-a="${k}" ${open?'':'disabled'}>${open?a[0]:'🔒'}<small>${a[1]}</small></button>`;}).join('');
 $('zTabs').querySelectorAll('.tab').forEach(b=>b.onclick=()=>{if(b.disabled)return;Z.area=b.dataset.a;SFX.click();zooStart();const a=AREAS[Z.area];say(a[1],a[2]);});}
function zooStart(){needTick();if(!S.areas.includes(Z.area))Z.area='home';zooTabs();$('zFeed').classList.toggle('on',Z.feed);
 const r={width:$('field').clientWidth,height:$('field').clientHeight};Z.W=Math.max(200,r.width);Z.H=Math.max(200,r.height);const W=Z.W,H=Z.H,svg=$('fieldSvg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 let o=areaArt(Z.area,W,H);o+=`<path d="M0 ${H-14} H${W}" stroke="#8b5a2b" stroke-width="5"/>`;for(let x=10;x<W;x+=40)o+=`<rect x="${x}" y="${H-30}" width="8" height="30" rx="2" fill="#c08552" ${ST}/>`;
 o+=`<g id="nightLayer"></g><g id="dinoLayer"></g><g id="coverLayer"></g><g id="fxLayer"></g>`;const here=S.dinos.map((d,i)=>[d,i]).filter(([d])=>(d.area||'home')===Z.area);
 if(!here.length)o+=`<g><rect x="${W/2-150}" y="${H*.42}" width="300" height="74" rx="16" fill="#fff" ${ST}/><text x="${W/2}" y="${H*.42+32}" text-anchor="middle" font-size="21" font-weight="800" fill="#4a3426">No dinos here yet!</text><text x="${W/2}" y="${H*.42+60}" text-anchor="middle" font-size="18" font-weight="700" fill="#4a3426">這裡還沒有恐龍!</text></g>`;
 svg.innerHTML=o;const base=Math.min(H*.26,W*.22,150)/100;const layer=svg.querySelector('#dinoLayer');
 Z.ds=here.map(([d,idx])=>{const stg=d.stage===undefined?2:d.stage;const size=base*STAGE_SZ[stg];const fly=TPL[d.t].fly;const g=document.createElementNS(NS,'g');g.setAttribute('class','dino');
  const hearts=stg<2?`<text x="${50*size}" y="${80*size+40}" text-anchor="middle" font-size="13">${'❤️'.repeat(d.hearts||0)}${'🤍'.repeat(3-(d.hearts||0))}</text>`:'';
  g.innerHTML=`<g class="body"><g class="sc">${dinoSVG(d.t,d.c)}</g></g>${stg<2?`<text class="bottle" x="${50*size}" y="-6" text-anchor="middle" font-size="18">🍼</text>`:''}<g><rect x="${50*size-28}" y="${80*size+4}" width="56" height="22" rx="8" fill="#fff" ${ST} stroke-width="2"/><text x="${50*size}" y="${80*size+20}" text-anchor="middle" font-size="15" font-weight="900" fill="#4a3426" letter-spacing="1">${d.name}</text></g>${hearts}`;
  layer.appendChild(g);const o={d,idx,g,body:g.querySelector('.body'),legs:[...g.querySelectorAll('[data-leg]')],wings:[...g.querySelectorAll('[data-wing]')],s:size,fly,stg,
   x:Math.random()*(W-100*size),y:fly?H*(.08+Math.random()*.12):H*(.42+Math.random()*.3),vx:(20+Math.random()*25)*(stg<2?.7:1)*(Math.random()<.5?-1:1),ph:Math.random()*6,jump:0,vj:0,pause:0};
  g.addEventListener('pointerdown',ev=>{ev.preventDefault();ac();dinoDown(o,ev);});g.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});return o;});
 if(Z.newest!==undefined){const n=Z.ds.find(x=>x.idx===Z.newest);if(n){n.x=-100*n.s;n.vx=Math.abs(n.vx)+20;}Z.newest=undefined;}
 Z.ds.forEach(decorate);toyInit();
 cancelAnimationFrame(Z.raf);Z.last=performance.now();Z.raf=requestAnimationFrame(zooTick);
 SOLVE=()=>{const b=Z.ds.find(x=>x.stg<2);if(b&&S.snacks){Z.feed=true;tapDino(b);}};}
/* drag a dino: drop on an area tab to move it there, or anywhere in the field to set it down */
function dinoDown(o,ev){const svg=$('fieldSvg'),sx=ev.clientX,sy=ev.clientY;let drag=false,over=null,ghost=null;
 const toField=(cx,cy)=>{const r=svg.getBoundingClientRect();return [(cx-r.left)*Z.W/r.width,(cy-r.top)*Z.H/r.height];};
 const tabAt=(x,y)=>{const e=document.elementFromPoint(x,y);return e&&e.closest?e.closest('#zTabs .tab'):null;};
 const mv=e=>{if(!drag&&Math.hypot(e.clientX-sx,e.clientY-sy)>14&&!Z.feed&&Z.mode!=='hide'){drag=true;o.drag=true;o.g.style.opacity=0;const r=svg.getBoundingClientRect();ghost=document.createElement('div');ghost.className='dghost';const gw=100*o.s*r.width/Z.W*1.15;ghost.style.width=gw+'px';ghost.innerHTML=smallDino(o.d.t,o.d.c);document.body.appendChild(ghost);$('zTabs').classList.add('drop');SFX.pop();say(`Where should ${o.d.name} live?`,`${o.d.name}要住在哪裡?`);}
  if(!drag)return;e.preventDefault();if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';}const [x,y]=toField(e.clientX,e.clientY);o.x=x-50*o.s;o.y=y-50*o.s;const t=tabAt(e.clientX,e.clientY);if(t!==over){over&&over.classList.remove('hov');over=t;t&&t.classList.add('hov');}};
 const up=e=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);removeEventListener('pointercancel',up);$('zTabs').classList.remove('drop');over&&over.classList.remove('hov');
  if(!drag){tapDino(o);return;}o.drag=false;o.g.style.opacity='';ghost&&ghost.remove();const t=tabAt(e.clientX,e.clientY);
  if(t){const k=t.dataset.a,A2=AREAS[k];if(t.disabled){SFX.boing();say('That place is still locked. Read more books to open it!','那裡還沒打開。多讀故事書就能打開!');}
   else if(k===(o.d.area||'home')){SFX.boing();say(`${o.d.name} already lives here!`,`${o.d.name}已經住在這裡了!`);}
   else{o.d.area=k;save();SFX.ding();confetti(20);say(`${o.d.name} moved to the ${A2[1]}!`,`${o.d.name}搬到${A2[2]}了!`);Z.area=k;Z.newest=o.idx;setTimeout(zooStart,250);return;}}
  const [,y]=toField(e.clientX,e.clientY);if(!o.fly)o.y=Math.max(Z.H*.3,Math.min(Z.H*.8,y-40*o.s));o.vj=200;SFX.hop();};
 addEventListener('pointermove',mv,{passive:false});addEventListener('pointerup',up);addEventListener('pointercancel',up);}
function tapDino(o){const d=o.d;if(Z.mode&&!Z.feed&&toyTap(o))return;if(o.jump===0){o.vj=260;SFX.hop();}
 if(!Z.feed&&!Z.mode&&needSay(o))return;
 if(Z.feed&&o.stg<2){if(!S.snacks){Z.feed=false;$('zFeed').classList.remove('on');say('No snacks left! Play a job to earn snacks.','沒有點心了!玩任務賺點心吧!');return;}
  S.snacks--;d.hearts=(d.hearts||0)+1;SFX.chew();showWallet();
  if(d.hearts>=3){d.hearts=0;d.stage=(d.stage||0)+1;save();SFX.grow();confetti(30);const big=d.stage>=2;
   say(big?`${d.name} is all grown up!`:`${d.name} grew bigger!`,big?`${d.name}長大了!`:`${d.name}長高了!`);setTimeout(zooStart,900);}
  else{save();say(`Yum! ${d.hearts} ${d.hearts>1?'hearts':'heart'}!`,`好吃!${d.hearts}顆愛心!`);setTimeout(zooStart,700);}
  return;}
 if(Z.feed&&o.stg>=2){say(`${d.name} is all grown up. Feed a baby with a bottle!`,`${d.name}已經長大了,餵有奶瓶的寶寶吧!`);return;}
 say(`Hi! I'm ${d.name}! ${d.name.split('').join(', ')}.`,`我是${d.name}!`,null,o.stg<2?1.6:1.15);}
$('zFeed').onclick=()=>{ac();Z.feed=!Z.feed;$('zFeed').classList.toggle('on',Z.feed);if(Z.feed&&Z.mode){Z.mode=null;zooStart();}
 if(!Z.feed)return;const babies=S.dinos.filter(d=>(d.stage??2)<2);
 if(!babies.length){Z.feed=false;$('zFeed').classList.remove('on');say('No babies yet! Read a book to rescue a baby.','還沒有寶寶!讀故事書去救寶寶吧!');return;}
 if(!S.snacks){Z.feed=false;$('zFeed').classList.remove('on');say('No snacks left! Play a job to earn snacks.','沒有點心了!玩任務賺點心吧!');return;}
 const here=babies.filter(d=>(d.area||'home')===Z.area);if(!here.length){Z.area=babies[0].area||'home';zooStart();Z.feed=true;$('zFeed').classList.add('on');}
 say('Tap a baby with a bottle to feed it!','按有奶瓶的寶寶來餵牠!');};
