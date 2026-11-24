/* ---------- store ---------- */
function store(){
 if(!S.shelf||!S.shelf.length)restock();
 setScreen('store',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🛒 Card store ${zh([['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['店','ㄉㄧㄢˋ']])}</h2>
 <div class="row"><button class="pack" data-a="pack" style="cursor:pointer"><span class="e">🎁</span>Mystery pack<span style="font-size:1rem">4 cards</span></button>
 <div style="text-align:left;max-width:260px;font-weight:700">A pack costs <b>$2.00</b>.<br>The last card is always rare or better!<br><br>You have <b>${money(S.cents)}</b>.</div></div></div>
 <div class="panel" style="text-align:center"><h2 class="h">Single cards ${zh([['單','ㄉㄢ'],['張','ㄓㄤ']])}</h2><div class="shelf">${S.shelf.map((id,i)=>{const c=byId(id);return `<div>${cardHTML(c)}<button class="btn ${S.cents>=R[c.r].p?'':'ghost'} price small" data-a="buy" data-v="${i}">${money(R[c.r].p)}</button></div>`;}).join('')}</div>
 <p style="color:var(--muted);font-weight:700">New cards come after every job or battle.</p></div>
 <div class="row"><button class="btn ghost" data-a="home">🏠 Home</button></div></div>`);
 bindAll({home:()=>hub(),pack(){if(S.cents<200){sfx.bad();toast('You need $2.00. Try a job! 🧾');return;}S.cents-=200;save();sfx.coin();openPack();},
  buy(i){const c=byId(S.shelf[i]),p=R[c.r].p;if(S.cents<p){sfx.bad();toast('You need '+money(p-S.cents)+' more');return;}
   S.cents-=p;S.owned[c.id]=(S.owned[c.id]||0)+1;S.shelf.splice(+i,1);save();sfx.coin();if(c.r==='holo'||c.r==='legend')sfx.shimmer();toast('📒 '+c.name+' added to your binder!');store();}});}
function packSVG(f){let top='',bot='';for(let x=6;x<=114;x+=6){top+=`L${x} ${(x/6)%2?4:8}`;bot=`L${x} ${(x/6)%2?168:164}`+bot;}
 return `<svg viewBox="0 0 120 172"><defs><linearGradient id="pf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4c6ef5"/><stop offset=".5" stop-color="#9775fa"/><stop offset="1" stop-color="#f06595"/></linearGradient><clipPath id="pc"><rect x="6" y="22" width="108" height="142"/></clipPath></defs>
 <g class="flap"><path d="M6 22V8${top}V22Z" fill="#dee2e6" stroke="#1b1f3b" stroke-width="2"/><path d="M10 15H110" stroke="#adb5bd" stroke-width="2" stroke-dasharray="4 3"/></g>
 <path d="M6 22H114V164${bot}L6 164Z" fill="url(#pf)" stroke="#1b1f3b" stroke-width="2"/>
 <g clip-path="url(#pc)"><g opacity=".35" fill="#fff">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M60 92L${(60+120*Math.cos(a)).toFixed(1)} ${(92+120*Math.sin(a)).toFixed(1)}L${(60+120*Math.cos(a+.2)).toFixed(1)} ${(92+120*Math.sin(a+.2)).toFixed(1)}Z"/>`;}).join('')}</g>
 <circle cx="60" cy="92" r="36" fill="#fff" opacity=".35"/><g transform="translate(9 52) scale(.69)">${creature(f)}</g><path d="M-20 164L60 22L80 22L0 164Z" fill="#fff" opacity=".18"/></g>
 <text x="60" y="44" text-anchor="middle" font-size="17" font-weight="900" font-style="italic" fill="#ffd43b" stroke="#1b1f3b" stroke-width="3" paint-order="stroke" font-family="system-ui">CARD QUEST</text>
 <text x="60" y="154" text-anchor="middle" font-size="10" font-weight="900" fill="#fff" stroke="#1b1f3b" stroke-width="2.5" paint-order="stroke" font-family="system-ui">★ 4 CARDS ★</text></svg>`;}
const RK={common:0,rare:1,holo:2,legend:3,promo:4};
function drumroll(ms){if(!SOUND)return;let t=0,gap=.12;while(t<ms/1000){tone(170+t*120,.05,'square',.05+t*.03,t);t+=gap;gap=Math.max(.035,gap*.9);}}
/* big full-screen moment for a great card */
function spotlight(c,isNew,then){const rk=RK[c.r],col=rk>=3?'#ffd43b':rk===2?'#e599f7':'#74c0fc',title=c.r==='promo'?'✦ PRIZE CARD! ✦':rk===3?'🌟 LEGENDARY! 🌟':rk===2?'✨ HOLO! ✨':'◆ RARE! ◆';
 const d=document.createElement('div');d.className='spot r'+rk;d.style.setProperty('--sc',col);
 d.innerHTML=`<div class="burst"></div><h2>${title}</h2><div class="sc">${cardHTML(c)}</div><p class="nm">${c.name}${isNew?' <span class="newtag">NEW!</span>':''}</p><p class="tapc">Tap to keep going ▶</p>`;
 document.body.appendChild(d);FX.flash(col);boom();fanfare();setTimeout(sfx.shimmer,350);shout((rk>=3?'Legendary! ':rk===2?'Holo! ':'Rare! ')+c.name+'!');
 const fw=[];const n=rk>=3?9:rk===2?6:3;for(let i=0;i<n;i++)fw.push(setTimeout(()=>{const x=innerWidth*(.15+Math.random()*.7),y=innerHeight*(.12+Math.random()*.45);FX.emit(x,y,rk>=2?'rainbow':'gold',rk>=3?50:34,{speed:7,size:4,g:.08,life:45});FX.ring(x,y,col,70,4);tone(600+Math.random()*600,.15,'triangle',.06);},300+i*330));
 if(rk>=3){const rain=setInterval(()=>FX.emit(Math.random()*innerWidth,-10,'gold',2,{dir:Math.PI/2,spread:.4,speed:4,g:.12,life:90,size:5}),60);fw.push(setTimeout(()=>clearInterval(rain),2600));}
 let ok=false;setTimeout(()=>{ok=true;d.classList.add('ready');},1300);
 d.onclick=()=>{if(!ok)return;fw.forEach(clearTimeout);d.classList.add('out');setTimeout(()=>{d.remove();then&&then();},300);};}
function openPack(free){if(free){if(!(S.freePacks>0))return hub();S.freePacks--;save();}
 const before=Object.assign({},S.owned);
 const cards=[0,1,2].map(()=>randCard([['common',7],['rare',3]])).concat([randCard([['rare',70],['holo',22],['legend',8]])]);
 const best=cards.reduce((a,c)=>RK[c.r]>RK[a.r]?c:a),glow={common:'rgba(255,255,255,.4)',rare:'rgba(77,171,247,.5)',holo:'rgba(218,119,242,.55)',legend:'rgba(255,212,59,.6)',promo:'rgba(255,212,59,.6)'}[best.r];
 setScreen('pack',`<div class="hub"><div class="stage" id="stg"><div class="rays"></div><h2>${free?`🎁 Free pack ${5-S.freePacks} of 5!`:'🎁 Mystery pack'}</h2>
 <button class="pk2" id="pb" aria-label="Rip open the pack">${packSVG(pick(C.filter(c=>c.r==='legend')))}<span class="leak"></span></button><div class="prow" id="pk"></div><p id="pm">Tap the pack to rip it open!</p><div class="row" id="pdone"></div></div></div>`);
 const stg=$('stg');stg.style.setProperty('--glow',glow);let ripping=false;
 $('pb').onclick=()=>{if(ripping)return;ripping=true;audio();const pb=$('pb');pb.classList.add('charge');pb.style.setProperty('--lk',glow);riser(1100);$('pm').textContent='It’s shaking…!';
  const spark=setInterval(()=>{const [x,y]=ctr(pb);FX.emit(x,y,RK[best.r]>=2?'rainbow':'gold',4,{speed:5,size:3,life:20});},90);
  setTimeout(()=>{clearInterval(spark);pb.classList.add('torn');const [x,y]=ctr(pb);boom();FX.flash('#fff');FX.emit(x,y-40,'rainbow',50,{speed:9,size:4});FX.ring(x,y,'#fff',160,6);stg.classList.add('boom');
   setTimeout(()=>{pb.classList.add('gone');setTimeout(()=>{pb.remove();dealCards();},380);},350);},RM?100:1150);};
 function dealCards(){cards.forEach(c=>S.owned[c.id]=(S.owned[c.id]||0)+1);save();const pk=$('pk');pk.innerHTML=cards.map((c,i)=>`<div class="fly"><button class="flip ${c.r!=='common'?'g-'+c.r:''} ${i===3?'last':''}" data-i="${i}"><div class="in"><div>${backSVG()}</div><div class="front">${cardHTML(c)}</div></div></button></div>`).join('');
  const sr=stg.getBoundingClientRect(),cx=sr.left+sr.width/2,cy=sr.top+sr.height/2,flies=[...pk.querySelectorAll('.fly')];
  flies.forEach(f=>{const r=f.getBoundingClientRect();f.style.transition='none';f.style.transform=`translate(${cx-(r.left+r.width/2)}px,${cy-(r.top+r.height/2)}px) scale(.3) rotate(${((Math.random()-.5)*90).toFixed(0)}deg)`;f.style.opacity='0';});
  void pk.offsetWidth;flies.forEach((f,i)=>setTimeout(()=>{f.style.transition='';f.style.transform='';f.style.opacity='1';whoosh();},RM?0:i*170));
  $('pm').textContent='Tap each card to flip it! The last one is the special card ✨';let left=4;
  $('pdone').innerHTML='<button class="btn ghost small" id="fa">Flip all ✨</button>';
  const isNew=c=>!before[c.id];
  const tag=(f,c)=>{const t=document.createElement('span');t.className=isNew(c)?'newtag':'duptag';t.textContent=isNew(c)?'NEW!':'×'+((before[c.id]||0)+1);f.parentElement.appendChild(t);};
  const flipOne=(f,quick)=>new Promise(res=>{if(f.classList.contains('open')||f.dataset.busy)return res();const c=cards[+f.dataset.i],rk=RK[c.r],last=f.classList.contains('last');f.dataset.busy=1;
   const reveal=()=>{f.classList.remove('wob','tense');f.classList.add('open');const [x,y]=ctr(f);tag(f,c);
    const fin=()=>{if(--left===0)allDone();res();};
    if(rk>=1&&!quick){if(rk>=2){FX.quake();FX.emit(x,y,rk>=3?'gold':'rainbow',40,{speed:8,size:5});}else{FX.emit(x,y,'gold',22,{speed:6});}FX.ring(x,y,'#fff',120,5);setTimeout(()=>spotlight(c,isNew(c),fin),rk>=2?350:200);}
    else{if(rk>=1){sfx.good();FX.emit(x,y,'gold',20,{speed:6});}else{sfx.flip();FX.emit(x,y,c.type,10,{speed:4,size:3});}if(isNew(c))tone(1320,.12,'triangle',.07,.1);fin();}};
   if(last&&!RM){f.classList.add('tense');$('pm').textContent='The special card… 🥁';drumroll(1400);setTimeout(reveal,1500);}
   else if(rk>=1&&!quick){f.classList.add('wob');riser(450);setTimeout(reveal,500);}else reveal();});
  pk.querySelectorAll('.flip').forEach(f=>f.onclick=()=>{audio();flipOne(f);});
  $('fa').onclick=async()=>{$('fa').remove();const fs=[...pk.querySelectorAll('.flip')];for(const f of fs){const c=cards[+f.dataset.i];await flipOne(f,!f.classList.contains('last')&&RK[c.r]<2);await new Promise(r=>setTimeout(r,250));}};
  function allDone(){const nn=cards.filter(isNew).length;setTimeout(()=>{$('pm').innerHTML=`All 4 cards went into your binder! ${nn?`<b style="color:#69db7c">${nn} NEW</b>`:''}`;const fa=$('fa');if(fa)fa.remove();
   if(S.freePacks>0){$('pdone').innerHTML=`<button class="btn gold" id="again">Rip the next free pack ▶ (${S.freePacks} left)</button>`;$('again').onclick=()=>openPack(true);}
   else{$('pdone').innerHTML=(free?'<button class="btn green" id="hm">📒 All done! Go to town ▶</button>':'<button class="btn gold" id="again">Another pack ($2.00)</button><button class="btn ghost" id="hm">🏠 Home</button>');const ag=$('again');if(ag)ag.onclick=()=>{if(S.cents<200){sfx.bad();toast('You need $2.00');return;}S.cents-=200;save();openPack();};$('hm').onclick=()=>hub();}},500);}}}

