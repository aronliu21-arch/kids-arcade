/* 📦 Stockroom conveyor: tap the right bin before the item rolls off. Speeds up, golden items pay double */
function stockConveyor(){const BINS=['top','bottom','dress','shoes','acc'];let earn=0,combo=0,lives=3,items=[],v=60,t=0,spawn=0,done=0;
  const s=cScreen('<h2>📦 Stockroom Conveyor</h2><div class="jhud"><span id="hL">❤️❤️❤️</span><span id="hM">💰 0</span><span id="hC">🔥 x1</span></div><p class="note">Tap the <b>first box</b> on the belt, then its bin! ⭐ golden boxes pay double.</p><div class="belt" id="belt"><div class="rollers"></div></div><div class="bins" id="bins">'+BINS.map(c=>'<button class="bin" data-c="'+c+'">'+CATEN[c]+'</button>').join('')+'</div>');
  const belt=s.querySelector('#belt'),host=s.querySelector('.cin');
  const add=()=>{const c=pick(BINS),it=pick(CAT[c].items),gold=Math.random()<.12,d=document.createElement('div');d.className='box'+(gold?' gold':'');d.innerHTML='<div class="it">'+thumb(c,it)+'</div>';belt.appendChild(d);items.push({c,d,x:-14,gold});fitThumbs();};
  const shuffle=()=>{const b=s.querySelector('#bins');[...b.children].sort(()=>Math.random()-.5).forEach(x=>b.appendChild(x));b.classList.add('shuf');setTimeout(()=>b.classList.remove('shuf'),400);};
  s.querySelectorAll('.bin').forEach(b=>b.onclick=()=>{const f=items[0];if(!f)return;const r=b.getBoundingClientRect(),hr=host.getBoundingClientRect();
    if(b.dataset.c===f.c){const m=(f.gold?2:1)*(1+Math.floor(combo/5));earn+=m;combo++;done++;sfx.good();popFx(host,r.left-hr.left+r.width/2,r.top-hr.top-10,'+$'+m+(f.gold?' ⭐':''));b.classList.add('yes');setTimeout(()=>b.classList.remove('yes'),250);
      f.d.classList.add('fly');setTimeout(()=>f.d.remove(),300);items.shift();if(done%8===0){shuffle();toast('🔀 The bins moved!',1000);}}
    else{combo=0;sfx.boing();b.classList.add('no');setTimeout(()=>b.classList.remove('no'),250);toast('→ '+CATEN[f.c],800);}upd();});
  const upd=()=>{TX(s.querySelector('#hL'),'❤️'.repeat(lives)+'🤍'.repeat(3-lives));TX(s.querySelector('#hM'),'💰 '+earn);TX(s.querySelector('#hC'),'🔥 x'+(1+Math.floor(combo/5)));};
  let last=performance.now();
  const loop=now=>{if(!s.isConnected||!s.querySelector('#belt'))return;const dt=Math.min(.1,(now-last)/1000);last=now;t+=dt;v=14+t*.35;spawn-=dt;
    if(spawn<=0){add();spawn=Math.max(.9,2.6-t*.04);}
    const BW=belt.clientWidth;items.forEach(o=>{o.x+=v*dt;o.d.style.transform='translateX('+(o.x*BW/100).toFixed(1)+'px)';});
    if(items[0]&&items[0].x>100){const o=items.shift();o.d.classList.add('fall');setTimeout(()=>o.d.remove(),400);lives--;combo=0;sfx.boing();upd();}
    if(items[0]&&!items[0].d.classList.contains('first'))items[0].d.classList.add('first');
    if(lives<=0){endJob(earn,'📦 Shift over! Sorted '+done,'sort');return;}
    requestAnimationFrame(loop);};
  upd();requestAnimationFrame(loop);}

function sewButtons(){const N=4,COLS=[['pink','#f783ac'],['blue','#4dabf7'],['gold','#ffd43b'],['green','#69db7c'],['purple','#9775fa']],GAR=[['shirt','shirt'],['jacket','jacket'],['dress','dress']];
  let round=0,earn=0,fails=0;
  const gsvg=(g,body)=>{const sh={shirt:'M60 40L90 28Q100 38 110 28L140 40L160 80L138 90L134 70L134 190L66 190L66 70L62 90L40 80Z',jacket:'M58 40L90 26L100 44L110 26L142 40L162 110L140 116L136 80L136 196L64 196L64 80L60 116L38 110Z',dress:'M78 30L92 28Q100 40 108 28L122 30L126 80L160 196L40 196L74 80Z'}[g];
    return '<svg viewBox="30 18 140 190" class="garm"><path d="'+sh+'" fill="#f8f9fa" stroke="#4a3426" stroke-width="3" stroke-linejoin="round"/>'+body+'</svg>';};
  const SLOTS=[[100,70],[100,95],[100,120],[100,145],[100,170],[118,84]];
  const next=()=>{if(round>=N){endJob(earn,'🔘 All fixed!','sew');return;}
    round++;fails=0;const want={col:pick(COLS),n:2+Math.floor(Math.random()*4),g:pick(GAR)[0]};let col=null,sewn={};
    const draw=()=>{const body=SLOTS.map(([x,y],i)=>sewn[i]?'<g><circle cx="'+x+'" cy="'+y+'" r="8" fill="'+sewn[i]+'" stroke="#4a3426" stroke-width="2"/><path d="M'+(x-3)+' '+(y-3)+'l6 6M'+(x+3)+' '+(y-3)+'l-6 6" stroke="#4a3426" stroke-width="1.4"/></g>':'<circle class="slot" data-i="'+i+'" cx="'+x+'" cy="'+y+'" r="9" fill="#fff" stroke="#adb5bd" stroke-width="2" stroke-dasharray="3 3"/>').join('');
      const s=cScreen('<h2>🧵 Sewing Studio '+round+'/'+N+'</h2><div class="jhud"><span>💰 '+earn+'</span><span>'+'❌'.repeat(fails)+'⬜'.repeat(3-fails)+'</span></div><div class="ticket">🧾 Sew <b>'+want.n+' '+want.col[0]+'</b> buttons on the '+want.g+'</div><div class="sewbox">'+gsvg(want.g,body)+'</div>'+
        '<p>1. Pick the button color. 2. Tap the dotted spots to sew.</p><div class="bb">'+COLS.map(([n,c])=>'<button class="chip'+(col===c?' on':'')+'" data-c="'+c+'"><i class="sw2" style="background:'+c+'"></i>'+n+'</button>').join('')+'</div>'+
        '<div class="row"><button class="btn ghost" id="rip">✂️ Unpick</button><button class="btn pink" id="sdone">Done ✓</button></div>');
      s.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{col=b.dataset.c;tone(800,.05,'triangle',.06);draw();});
      s.querySelectorAll('.slot').forEach(c=>c.onclick=()=>{if(!col){toast('Pick a color first');return;}sewn[c.dataset.i]=col;[0,1,2].forEach(k=>setTimeout(()=>tone(1500+k*200,.03,'square',.04),k*70));draw();});
      s.querySelector('#rip').onclick=()=>{sewn={};draw();};
      s.querySelector('#sdone').onclick=()=>{const v=Object.values(sewn);if(v.length===want.n&&v.every(c=>c===want.col[1])){sfx.good();earn+=2;seam();}else{fails++;sfx.boing();const lose=Math.min(earn,1);earn-=lose;s.classList.add('jolt');setTimeout(()=>s.classList.remove('jolt'),300);
        if(fails>=3){toast('😤 The customer took her '+want.g+' back! No pay for this one.',2600);setTimeout(next,2200);return;}
        sewn={};draw();toast('❌ Wrong! The ticket says '+want.n+' '+want.col[0]+' buttons.'+(lose?' −$1':'')+' Strike '+fails+'/3',2600);}};};
    const seam=()=>{const P=[[64,190],[66,160],[66,130],[66,100],[64,72]].map(([x,y])=>[x+0,y]);let hit=0;
      const s=cScreen('<h2>🪡 Sew the seam!</h2><p>Drag along the dotted line from the bottom up.</p><div class="sewbox" id="seamBox">'+gsvg(want.g,'<path d="M64 190L66 72" stroke="#adb5bd" stroke-width="3" stroke-dasharray="5 5" fill="none"/><path id="stitch" d="M64 190" stroke="'+want.col[1]+'" stroke-width="4" fill="none" stroke-dasharray="6 4"/>'+P.map(([x,y],i)=>'<circle class="pt" id="pt'+i+'" cx="'+x+'" cy="'+y+'" r="7" fill="'+(i?'#fff':'#ffd43b')+'" stroke="#4a3426" stroke-width="2"/>').join(''))+'</div>');
      const sv=s.querySelector('.garm');sv.style.touchAction='none';let down=false,d='M64 190';
      const at=e=>{const p=sv.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(sv.getScreenCTM().inverse());};
      const move=e=>{if(!down)return;const q=at(e),[x,y]=P[hit];if(Math.hypot(q.x-x,q.y-y)<14){s.querySelector('#pt'+hit).setAttribute('fill','#ffd43b');tone(1200+hit*120,.05,'triangle',.08);d+=' L'+x+' '+y;s.querySelector('#stitch').setAttribute('d',d);hit++;
          if(hit>=P.length){down=false;sfx.win();earn+=2;toast('✅ Beautiful stitching! 💰+4',1200);setTimeout(next,1000);}}};
      sv.addEventListener('pointerdown',e=>{down=true;sv.setPointerCapture(e.pointerId);move(e);});sv.addEventListener('pointermove',move);sv.addEventListener('pointerup',()=>{down=false;});};
    draw();};
  next();}

/* ---------- 3 rotating mini games per job location ---------- */
function endJob(earn,title,k){const p=payday(earn,title);p.querySelector('#again2').onclick=()=>startJob(k);p.querySelector('#cBack').onclick=careerHub;}
const lp=(s,sel,fn)=>{let last=performance.now();const f=now=>{if(!s.isConnected||!s.querySelector(sel))return;const dt=Math.min(.1,(now-last)/1000);last=now;if(fn(dt,now)!==false)requestAnimationFrame(f);};requestAnimationFrame(f);};
/* ☕ 2: Boba Catch — drag the cup to catch the toppings on the ticket, dodge the silly stuff */
function bobaCatch(){const GOOD=[['pearl','🟤'],['jelly','🟨'],['berry','🍓'],['ice','🧊']],BAD=['🌶️','🐟','🧦','🥦'];let T=45,earn=0,lives=3,cx=50,falls=[],spawn=0,lvl=0,order;
  const s=cScreen('<h2>🧋 Boba Catch</h2><div class="jhud"><span id="hT">⏱ 45</span><span id="hL">❤️❤️❤️</span><span id="hM">💰 0</span></div><div class="ticket" id="tk"></div><div class="play" id="pl"><div class="bcup" id="cup">🧋</div></div><p class="note">Drag left and right to move the cup.</p>');
  const pl=s.querySelector('#pl'),cup=s.querySelector('#cup'),host=s.querySelector('.cin');
  const newOrder=()=>{order={};const a=pick(GOOD),b=pick(GOOD.filter(g=>g!==a));order[a[0]]=3+lvl;order[b[0]]=2+lvl;drawTk();};
  const drawTk=()=>{s.querySelector('#tk').innerHTML='🧾 Catch '+Object.entries(order).map(([k,n])=>'<b>'+n+'</b> '+GOOD.find(g=>g[0]===k)[1]).join(' + ');};
  let PR=null;const mv=e=>{const r=PR||(PR=pl.getBoundingClientRect());cx=Math.max(6,Math.min(94,(e.clientX-r.left)/r.width*100));cup.style.transform='translate3d('+(cx/100*r.width).toFixed(1)+'px,0,0) translateX(-50%)';};addEventListener('resize',()=>PR=null);;
  pl.style.touchAction='none';pl.addEventListener('pointerdown',e=>{PR=pl.getBoundingClientRect();pl.setPointerCapture(e.pointerId);mv(e);});pl.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType==='touch')mv(e);});
  newOrder();requestAnimationFrame(()=>{PR=pl.getBoundingClientRect();cup.style.transform='translate3d('+(PR.width/2)+'px,0,0) translateX(-50%)';});
  lp(s,'#pl',dt=>{T-=dt;spawn-=dt;if(spawn<=0){spawn=Math.max(.35,.8-lvl*.08);const bad=Math.random()<.25,need=Object.keys(order).filter(k=>order[k]>0),nk=need.length?pick(need):null,g=bad?null:(Math.random()<.7&&nk?GOOD.find(x=>x[0]===nk):pick(GOOD));
      const d=document.createElement('div');d.className='fall';d.textContent=bad?pick(BAD):g[1];pl.appendChild(d);falls.push({d,x:4+Math.random()*92,y:-8,v:28+lvl*6+Math.random()*12,k:bad?null:g[0]});}
    const PW=pl.clientWidth,PH=pl.clientHeight;falls=falls.filter(f=>{f.y+=f.v*dt;f.d.style.transform='translate('+(f.x*PW/100).toFixed(1)+'px,'+(f.y*PH/100).toFixed(1)+'px) translate(-50%,-50%)';
      if(f.y>78&&f.y<92&&Math.abs(f.x-cx)<9){f.d.remove();const r=pl.getBoundingClientRect(),hr=host.getBoundingClientRect(),px=r.left-hr.left+cx/100*r.width,py=r.top-hr.top+r.height*.75;
        if(!f.k){lives--;sfx.boing();popFx(host,px,py,'Yuck!','#c92a2a');cup.classList.add('shk');setTimeout(()=>cup.classList.remove('shk'),300);}
        else if(order[f.k]>0){order[f.k]--;tone(1200,.05,'triangle',.08);drawTk();if(Object.values(order).every(n=>n<=0)){earn+=3+lvl;lvl++;sfx.win();popFx(host,px,py-30,'Order up! +$'+(2+lvl));newOrder();}}
        else tone(600,.04,'sine',.05);return false;}
      if(f.y>104){f.d.remove();return false;}return true;});
    TX(s.querySelector('#hT'),'⏱ '+Math.ceil(T));TX(s.querySelector('#hL'),'❤️'.repeat(Math.max(0,lives))+'🤍'.repeat(3-Math.max(0,lives)));TX(s.querySelector('#hM'),'💰 '+earn);
    if(T<=0||lives<=0){endJob(earn,lives<=0?'🧋 Too much yuck! Shift over':'🧋 Shift over!','cash');return false;}});}
/* ☕ 3: Oven Pop — tap pastries when they turn golden, before they burn */
function ovenPop(){let T=40,earn=0,combo=0,burnt=0;const P=['🥐','🧁','🍪','🥯','🥧','🍩'];const ov=[...Array(9)].map(()=>null);
  const s=cScreen('<h2>🥐 Oven Pop</h2>'+hud()+'<p class="note">Tap a pastry when it turns <b>golden ✨</b>. Too early is raw, too late burns!</p><div class="ovens">'+ov.map((_,i)=>'<button class="oven" data-i="'+i+'"><span></span></button>').join('')+'</div>');
  const host=s.querySelector('.cin'),btns=[...s.querySelectorAll('.oven')];
  btns.forEach((b,i)=>b.onclick=()=>{const o=ov[i];if(!o)return;const r=b.getBoundingClientRect(),hr=host.getBoundingClientRect(),x=r.left-hr.left+r.width/2,y=r.top-hr.top;
    if(o.t>=o.raw&&o.t<o.raw+o.gold){combo++;const m=1+Math.floor(combo/4);earn+=m;sfx.good();popFx(host,x,y,'+$'+m+(combo>=4?' 🔥':''));}else if(o.t<o.raw){combo=0;tone(300,.12,'sine',.06);popFx(host,x,y,'Still raw!','#e8590c');}
    ov[i]=null;b.className='oven';b.firstChild.textContent='';});
  lp(s,'.ovens',dt=>{T-=dt;
    if(Math.random()<dt*(1.2+ (40-T)*.04)){const free=ov.map((o,i)=>o?null:i).filter(i=>i!==null);if(free.length){const i=pick(free);ov[i]={e:pick(P),t:0,raw:1+Math.random()*1.2,gold:Math.max(.55,1.1-(40-T)*.012)};btns[i].firstChild.textContent=ov[i].e;}}
    ov.forEach((o,i)=>{if(!o)return;o.t+=dt;const b=btns[i],cl='oven '+(o.t<o.raw?'raw':o.t<o.raw+o.gold?'gold':'burnt');if(b.className!==cl)b.className=cl;
      if(o.t>o.raw+o.gold+.7){ov[i]=null;b.className='oven';b.firstChild.textContent='';burnt++;combo=0;tone(150,.25,'sawtooth',.05);}});
    TX(s.querySelector('#hT'),'⏱ '+Math.ceil(T));TX(s.querySelector('#hM'),'💰 '+earn);TX(s.querySelector('#hC'),'🔥 x'+(1+Math.floor(combo/4)));
    if(T<=0){endJob(earn,'🥐 Baking done! '+burnt+' burnt','cash');return false;}});}
