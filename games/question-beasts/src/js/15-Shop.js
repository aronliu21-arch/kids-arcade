/* ---------- Beast Shop (opens after every 2nd stage) ---------- */
const Shop=(()=>{const o=$('#shop');let kid=null,bought=false,sel=null,resolve=null;
  function preview(){const cv=$('#shopCv'),st=beastOf(kid),f=formOf(Save.kid(kid).xp);const eq=Object.assign({},equipOf(kid));if(sel)eq[ITEMS[sel].slot]=sel;
    const c=cv.getContext('2d'),s=cv.width/22;c.clearRect(0,0,cv.width,cv.height);if(st){drawBeast(c,st,f,3*s,5*s,s,false,1,eq)}}
  function render(){const s=Save.kid(kid),have=new Set(s.owned||[]),stars=starsOf(kid);
    $('#shopStars').textContent=`⭐ ${stars}`;$('#shopNote').textContent=bought?'Come back after 2 more stages for another treasure!':'You can take home 1 treasure this visit.';
    const box=$('#shopGrid');box.innerHTML='';
    Object.entries(ITEMS).forEach(([id,I])=>{const own=have.has(id),can=!own&&!bought&&stars>=I.price;const b=document.createElement('button');b.type='button';
      b.className='item'+(sel===id?' sel':'')+(own?' own':'');b.innerHTML=`<canvas width="56" height="56"></canvas><b class="zht">${I.zh}</b><span>${I.en}</span><em>${own?'✓ OWNED':'⭐ '+I.price}</em>`;
      itemIcon(b.querySelector('canvas'),id);b.onclick=()=>{Sfx.tap();sel=id;render()};box.appendChild(b)});
    const I=sel&&ITEMS[sel],own=sel&&have.has(sel),buy=$('#shopBuy');
    buy.disabled=!sel||own||bought||stars<(I?I.price:0);
    buy.textContent=!sel?'TAP AN ITEM TO TRY IT ON':own?'ALREADY YOURS':bought?'1 TREASURE PER VISIT':stars<I.price?`NEED ${I.price-stars} MORE ⭐`:`BUY ${I.zh} · ⭐ ${I.price}`;
    preview()}
  $('#shopBuy').onclick=()=>{if(!sel||bought)return;const s=Save.kid(kid),I=ITEMS[sel];if(starsOf(kid)<I.price)return;
    s.starsSpent=num(s.starsSpent)+I.price;s.owned=[...new Set([...(s.owned||[]),sel])];s.equip=Object.assign({},s.equip||{},{[I.slot]:sel});bought=true;Save.save();
    Sfx.level();Speech.say(I.zh,'zh-TW');render()};
  $('#shopLeave').onclick=()=>{Sfx.tap();o.hidden=true;const r=resolve;resolve=null;if(r)r()};
  return{open(k){return new Promise(res=>{kid=k;resolve=res;bought=false;sel=null;$('#shopTitle').innerHTML=`<span class="zht">神獸商店</span> · BEAST SHOP`;render();o.hidden=false;
      if(!$('#shopBuy').disabled||true)Music.start('bounce');setTimeout(()=>$('#shopLeave').focus(),50)})}}
})();

/* ---------- Equipment page (from the map, between stages) ---------- */
const Equip=(()=>{const o=$('#equip');let kid=null;
  function preview(){const cv=$('#eqCv'),st=beastOf(kid),f=formOf(Save.kid(kid).xp),c=cv.getContext('2d'),s=cv.width/22;c.clearRect(0,0,cv.width,cv.height);if(st)drawBeast(c,st,f,3*s,5*s,s,false,1,equipOf(kid))}
  function render(){const s=Save.kid(kid),own=s.owned||[],eq=equipOf(kid);$('#eqStars').textContent=`⭐ ${starsOf(kid)}`;const box=$('#eqSlots');box.innerHTML='';
    SLOTS.forEach(([slot,zh,en])=>{const row=document.createElement('div');row.className='eqrow';const items=own.filter(id=>ITEMS[id]&&ITEMS[id].slot===slot);
      row.innerHTML=`<span class="tag"><span class="zht">${zh}</span> ${en}</span>`;const list=document.createElement('div');list.className='eqlist';
      const none=document.createElement('button');none.type='button';none.className='item small'+(!eq[slot]?' sel':'');none.innerHTML='<b>—</b><span>NONE</span>';none.onclick=()=>{set(slot,null)};list.appendChild(none);
      items.forEach(id=>{const I=ITEMS[id],b=document.createElement('button');b.type='button';b.className='item small'+(eq[slot]===id?' sel':'');b.innerHTML=`<canvas width="40" height="40"></canvas><b class="zht">${I.zh}</b>`;itemIcon(b.querySelector('canvas'),id);b.onclick=()=>set(slot,id);list.appendChild(b)});
      if(!items.length)list.insertAdjacentHTML('beforeend','<span class="tag">Buy one in the shop!</span>');row.appendChild(list);box.appendChild(row)});preview()}
  function set(slot,id){const s=Save.kid(kid);s.equip=Object.assign({},s.equip||{},{[slot]:id});if(!id)delete s.equip[slot];Save.save();Sfx.tap();render()}
  $('#eqClose').onclick=()=>{Sfx.tap();o.hidden=true;renderWorld()};
  return{open(k){kid=k;render();o.hidden=false;setTimeout(()=>$('#eqClose').focus(),50)}}
})();

/* ================= world map ================= */
const MapV=(()=>{const cv=$('#map'),c=cv.getContext('2d'),W=240,H=150;
  const N=[[24,126],[68,106],[116,124],[166,104],[130,68],[180,36],[222,82]];
  const stars=Array.from({length:40},()=>[R(W),R(H)]);
  let kid=null,sel=0,pos={x:N[0][0],y:N[0][1]},walk=null,raf=0,arrived=null;
  const S=()=>Save.kid(kid);
  const unlocked=i=>i===6?S().cleared>=6:i<=S().cleared;
  const stageOf=i=>i<6?i+1:Math.max(7,S().cleared+1);
  function bg(t){const kind=KIDS[kid].bg;
    if(kind==='jungle'){c.fillStyle='#38b764';c.fillRect(0,0,W,H);c.fillStyle='#2f9e57';for(let y=0;y<H;y+=10)for(let x=(y/10%2)*10;x<W;x+=20)c.fillRect(x,y,10,10);
      c.fillStyle='#41a6f6';c.fillRect(0,0,W,14);c.fillRect(0,14,60,6);
      [[10,40],[44,60],[90,30],[200,120],[150,20],[230,30],[90,80],[60,140]].forEach(([x,y])=>{c.fillStyle='#5d4037';c.fillRect(x+3,y,2,6);c.fillStyle='#257179';c.fillRect(x,y-6,8,7)})}
    else if(kind==='plains'){c.fillStyle='#a7f070';c.fillRect(0,0,W,H);c.fillStyle='#8fd860';for(let y=0;y<H;y+=10)for(let x=(y/10%2)*10;x<W;x+=20)c.fillRect(x,y,10,10);
      c.fillStyle='#333c87';for(let x=0;x<W;x++){const h=14+Math.round(6*Math.sin(x*.07)+4*Math.sin(x*.19));c.fillRect(x,0,1,h)}
      if(Math.floor(t/2500)%2===0&&t%2500<100){c.fillStyle='#ffcd75';c.fillRect(60+((t/2500|0)*37)%120,0,2,22)}}
    else{c.fillStyle='#1f2547';c.fillRect(0,0,W,H);stars.forEach(([x,y],i)=>{if((Math.floor(t/500)+i)%4){c.fillStyle='#f4f4f4';c.fillRect(x,y,1,1)}});
      c.fillStyle='#29366f';for(let x=0;x<W;x++){const h=30+Math.round(10*Math.sin(x*.05)+6*Math.sin(x*.13));c.fillRect(x,H-h,1,h);if(h>40){c.fillStyle='#f4f4f4';c.fillRect(x,H-h,1,2);c.fillStyle='#29366f'}}}
  }
  function path(){for(let i=0;i<N.length-1;i++){const [x0,y0]=N[i],[x1,y1]=N[i+1],d=Math.hypot(x1-x0,y1-y0),n=Math.floor(d/6);
      for(let k=1;k<n;k++){const x=x0+(x1-x0)*k/n,y=y0+(y1-y0)*k/n;c.fillStyle=unlocked(i+1)?'#ffe9b5':'rgba(26,28,44,.45)';c.fillRect(Math.round(x)-1,Math.round(y)-1,3,3)}}}
  function node(i,t){const [x,y]=N[i],done=i<6&&i<S().cleared,open=unlocked(i),next=open&&!done;
    if(i===5){c.fillStyle='#5a6988';c.fillRect(x-12,y-30,24,18);c.fillRect(x-14,y-34,5,6);c.fillRect(x-2,y-36,5,8);c.fillRect(x+9,y-34,5,6);c.fillStyle='#1a1c2c';c.fillRect(x-3,y-20,6,8)}
    c.fillStyle='#1a1c2c';c.beginPath();c.arc(x,y,8,0,7);c.fill();
    c.fillStyle=done?'#ffcd75':next?(Math.floor(t/300)%2?'#f4f4f4':'#73eff7'):'#566c86';c.beginPath();c.arc(x,y,6,0,7);c.fill();
    c.fillStyle='#1a1c2c';if(done){c.fillRect(x-3,y,2,2);c.fillRect(x-1,y+2,2,2);c.fillRect(x+1,y,2,2);c.fillRect(x+3,y-2,2,2)}
    else if(!open){c.fillRect(x-3,y-1,6,5);c.strokeStyle='#1a1c2c';c.lineWidth=1.5;c.beginPath();c.arc(x,y-2,2.5,Math.PI,0);c.stroke()}
    else{c.font='8px monospace';c.textAlign='center';c.textBaseline='middle';c.fillText(i<6?String(i+1):'∞',x,y+1)}
    if(i<6&&i!==5)drawSprite(c,ENEMIES[i].key,EPAL[ENEMIES[i].key],x+1,y-25,1,false,open?1:.45);
    if(i===5)drawSprite(c,'dragon',EPAL.dragon,x-8,y-52,1,false,open?1:.45);
  }
  function frame(t){bg(t);path();for(let i=0;i<N.length;i++)node(i,t);
    if(walk){const seg=walk.pts.length-1,q=Math.min(1,(t-walk.t0)/(walk.ms*seg)),f=q*seg,k=Math.min(seg-1,Math.floor(f)),u=f-k;
      const a=walk.pts[k],b=walk.pts[k+1];pos={x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u};
      if(t-walk.step>170){walk.step=t;tone({f1:220,f2:180,dur:.05,vol:.05})}
      if(q>=1){walk=null;const cb=arrived;arrived=null;if(cb)cb()}}
    const st=beastOf(kid);if(st){const bob=walk?Math.floor(t/120)%2:Math.floor(t/400)%2,[sx,sy]=N[sel];
      c.strokeStyle=Math.floor(t/250)%2?'#ffcd75':'#f4f4f4';c.lineWidth=1;if(!walk){c.beginPath();c.arc(sx,sy,11,0,7);c.stroke()}
      drawBeast(c,st,formOf(S().xp),Math.round(pos.x)-20,Math.round(pos.y)-18-bob,1,false,1,equipOf(kid))}
  }
  function loop(t){if($('#world').hidden){raf=0;return}raf=requestAnimationFrame(loop);try{frame(t)}catch(e){console.error(e)}}
  function bar(){const i=sel,n=stageOf(i),e=i<6?ENEMIES[i]:null,f=$('#mFight');
    f.textContent=walk?'TRAVELING…':(i<6?`FIGHT! STAGE ${n} · ${e.name}`:`FIGHT! ENDLESS WAVE ${n-6}`);f.disabled=!!walk;
    $('#mInfo').textContent=(i<6?`${e.name} asks: `:'Endless mode asks: ')+topicsFor(kid,n).map(t=>TOPIC_NAME[t]).join(', ')+(i===5?' · Boss with ARMOR':'');
    $('#mPrev').disabled=!!walk||i===0;$('#mNext').disabled=!!walk||i===6||!unlocked(i+1)}
  function goTo(i,cb){if(walk||i===sel||i<0||i>6||!unlocked(i))return;const step=i>sel?1:-1,pts=[N[sel]];for(let k=sel+step;k!==i+step;k+=step)pts.push(N[k]);
    walk={pts,t0:performance.now(),ms:520,step:0};sel=i;arrived=()=>{bar();if(cb)cb()};bar()}
  cv.addEventListener('click',ev=>{const r=cv.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width*W,y=(ev.clientY-r.top)/r.height*H;
    let best=-1,bd=18;N.forEach(([nx,ny],i)=>{const d=Math.hypot(nx-x,ny-y);if(d<bd){bd=d;best=i}});if(best>=0){if(!unlocked(best)){Sfx.wrong();return}ac();Sfx.tap();goTo(best)}});
  $('#mPrev').onclick=()=>{Sfx.tap();goTo(sel-1)};$('#mNext').onclick=()=>{Sfx.tap();goTo(sel+1)};
  $('#mFight').onclick=()=>{if(walk)return;ac();Sfx.tap();$('#mFight').classList.remove('pulse');startBattle(kid,stageOf(sel))};
  return{show(k){kid=k;walk=null;sel=Math.min(S().cleared,6);pos={x:N[sel][0],y:N[sel][1]};$('#mFight').classList.remove('pulse');bar();if(!raf)raf=requestAnimationFrame(loop)},
    travel(from,to){this.show(kid||curKid);sel=from;pos={x:N[from][0],y:N[from][1]};bar();setTimeout(()=>goTo(to,()=>{Sfx.crit();$('#mFight').classList.add('pulse')}),450)},
    stop(){if(raf)cancelAnimationFrame(raf);raf=0;walk=null}}
})();

/* ================= keys 1 2 3 (MacBook) ================= */
/* use the physical key (ev.code) so 1-4 still work when a Chinese / Zhuyin keyboard is active (ev.key is then ㄅ ㄉ ˇ ˋ) */
document.addEventListener('keydown',ev=>{if(ev.metaKey||ev.ctrlKey||ev.altKey)return;const m=/^(?:Digit|Numpad)([1-4])$/.exec(ev.code||'');const n=m?+m[1]:parseInt(ev.key,10);if(!(n>=1&&n<=4))return;
  if(!$('#solve').hidden||!$('#evolve').hidden||!$('#result').hidden||!$('#mini').hidden||!$('#story').hidden||!$('#shop').hidden||!$('#equip').hidden||$('#battle').hidden)return;
  const box=!$('#qbox').hidden?$('#opts'):!$('#cards').hidden?$('#cards'):null;if(!box)return;const b=box.children[n-1];if(b&&!b.disabled){ev.preventDefault();b.click()}});

/* ================= arena size: fill the height the cards / question don't need ================= */
const WIDE=matchMedia('(min-width:640px) and (min-aspect-ratio:1/1)');
function fitStage(){const st=$('#stage'),sta=document.querySelector('#battle .status');if(!st)return;
  if(!WIDE.matches||$('#battle').hidden){st.style.width='';sta.style.width='';return}
  const box=$('#battle'),cs=getComputedStyle(document.body);const pad=parseFloat(cs.paddingTop)+parseFloat(cs.paddingBottom);
  const root=getComputedStyle(document.documentElement);const rpad=(parseFloat(root.paddingTop)||0)+(parseFloat(root.paddingBottom)||0);
  const other=box.querySelector('.topbar').offsetHeight+sta.offsetHeight+$('.bside').offsetHeight+3*8+6;
  const availH=innerHeight-pad-rpad-other-4,maxW=box.clientWidth;
  const w=Math.max(320,Math.min(maxW,availH*16/9));st.style.width=w+'px';sta.style.width=w+'px'}
let fitQ=0;const queueFit=()=>{if(fitQ)return;fitQ=requestAnimationFrame(()=>{fitQ=0;fitStage()})};
addEventListener('resize',queueFit);WIDE.addEventListener?.('change',queueFit);
new MutationObserver(queueFit).observe($('.bside'),{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
new MutationObserver(queueFit).observe($('#battle'),{attributes:true,attributeFilter:['hidden']});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(queueFit);

/* ================= full screen ================= */
const fsOK=!!(document.fullscreenEnabled||document.webkitFullscreenEnabled);
function toggleFS(){try{const d=document,el=d.documentElement;if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}
  else{const r=(el.requestFullscreen||el.webkitRequestFullscreen).call(el);if(r&&r.catch)r.catch(()=>{})}}catch(e){}}
document.querySelectorAll('.fsBtn').forEach(b=>{b.hidden=!fsOK;b.onclick=()=>{Sfx.tap();toggleFS()}});

