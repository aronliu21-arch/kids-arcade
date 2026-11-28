function gateCell(cost){const g=19-cost.rm;for(const c of [9,10,8,11,7,12])if(isFinite(cost[g*GRID+c]))return [c,g];for(let r=g;r>=0;r--)for(let c=0;c<GRID;c++)if(isFinite(cost[r*GRID+c]))return [c,r];return null;}
const cw=(c,lr)=>({x:c-GRID/2+.5,z:lr+CRM-GRID/2+.5});
function spawnFamily(){const at=attractions();if(!at.length)return;const cost=costGrid(),g0=gateCell(cost);if(!g0)return;
  const pens0=at.filter(a=>a.kind==='pen'),shops0=at.filter(a=>a.kind==='shop');
  const picks=[...pens0.sort(()=>Math.random()-.5).slice(0,1+((Math.random()*2)|0)),...shops0.sort(()=>Math.random()-.5).slice(0,pens0.length?(Math.random()*2)|0:1)];
  const pts=[{x:0,z:GRID/2+.7}];let cur=g0;pts.push(cw(g0[0],g0[1]));let stops=0;
  for(const pk of picks){const sc=standCell(pk.it,cost);if(!sc)continue;const r=route(cur[0],cur[1],sc[0],sc[1],cost);if(!r)continue;r.slice(1).forEach(v=>pts.push(cw(v%GRID,(v/GRID)|0)));
    pts[pts.length-1]=Object.assign({},pts[pts.length-1],{stop:pk,look:itemCenter(pk.it)});cur=sc;stops++;}
  if(!stops)return;const rb=route(cur[0],cur[1],g0[0],g0[1],cost);if(rb)rb.slice(1).forEach(v=>pts.push(cw(v%GRID,(v/GRID)|0)));pts.push({x:0,z:GRID/2+.9,exit:true});
  const n=1+((Math.random()*4)|0),adults=n===1?1:1+(Math.random()<.5?1:0);
  for(let i=0;i<n;i++){const kid=i>=adults,m=personMesh(kid),off=(i-(n-1)/2)*.24;m.position.set(pts[0].x+off,0,pts[0].z);m.visible=false;scene.add(m);PEOPLE.push({m,pts,i:0,off,delay:i*.5,wait:0,kid,phase:Math.random()*6});}}
function tickPeople(dt,t){const cap=Math.min(36,S.animals.length*4+shopCount()*2);visitT-=dt;if(visitT<=0){visitT=rand(3,7);if(PEOPLE.length<cap)spawnFamily();}
  for(let k=PEOPLE.length-1;k>=0;k--){const p=PEOPLE[k];if(p.delay>0){p.delay-=dt;continue;}p.m.visible=true;const L=p.m.userData.legs;
    if(p.wait>0){p.wait-=dt;L[0].rotation.x=L[1].rotation.x=0;p.m.position.y=0;continue;}
    const tg=p.pts[p.i+1];if(!tg){scene.remove(p.m);PEOPLE.splice(k,1);continue;}
    const tx=tg.x+p.off,tz=tg.z,dx=tx-p.m.position.x,dz=tz-p.m.position.z,d=Math.hypot(dx,dz),sp=(p.kid?1.2:1.05)*dt;
    if(d<=sp){p.m.position.x=tx;p.m.position.z=tz;p.i++;if(tg.stop){p.wait=rand(2,3.2);p.m.rotation.y=Math.atan2(tg.look.x-tx,tg.look.z-tz);payAt(tg.stop,p);}}
    else{p.m.position.x+=dx/d*sp;p.m.position.z+=dz/d*sp;p.m.rotation.y=Math.atan2(dx,dz);}
    if(!reduced){const sw=Math.sin(t*10+p.phase)*.6;L[0].rotation.x=sw;L[1].rotation.x=-sw;p.m.position.y=Math.abs(Math.sin(t*10+p.phase))*.03;}}}
/* coin bubbles collect over each pen and shop; tap them to collect */
const bubbles=new Map();
function coinTex(n){const c=document.createElement('canvas');c.width=192;c.height=80;const x=c.getContext('2d');x.fillStyle='#ffffff';x.strokeStyle='#1f3a5f';x.lineWidth=7;
  x.beginPath();if(x.roundRect)x.roundRect(4,4,184,72,36);else x.rect(4,4,184,72);x.fill();x.stroke();
  x.fillStyle='#f4c542';x.beginPath();x.arc(42,40,24,0,7);x.fill();x.lineWidth=5;x.stroke();x.fillStyle='#1f3a5f';x.font='bold 30px "Lilita One", sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('$',42,42);
  x.textAlign='left';x.font='44px "Lilita One", "Arial Rounded MT Bold", sans-serif';x.fillText('+'+n,74,43);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
function payAt(stop,p){const it=stop.it;if(!itemObjs.has(it.id))return;let b=bubbles.get(it.id);
  if(!b){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:coinTex(0),depthTest:false,transparent:true}));const c=itemCenter(it);sp.position.set(c.x,stop.kind==='pen'?2.5:2.2,c.z);sp.scale.set(1.25,.52,1);sp.renderOrder=20;sp.userData.bubble=it.id;scene.add(sp);b={sp,amt:0};bubbles.set(it.id,b);}
  b.amt+=stop.pay;const old=b.sp.material.map;b.sp.material.map=coinTex(b.amt);b.sp.material.needsUpdate=true;old.dispose();
  if(stop.kind==='pen'&&Math.random()<.5)hearts(p.m.position.clone().add(new THREE.Vector3(0,.4,0)),1);}
function dropBubble(id){const b=bubbles.get(id);if(b){scene.remove(b.sp);b.sp.material.map.dispose();bubbles.delete(id);}}
function collectAt(x,y){if(!bubbles.size)return false;ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(ndc,cam);const hit=ray.intersectObjects([...bubbles.values()].map(b=>b.sp));
  if(!hit.length)return false;const id=hit[0].object.userData.bubble,b=bubbles.get(id);S.coins+=b.amt;save();hud();SFX.coin();toast('+'+b.amt+' coins');
  bubbles.delete(id);parts.push({s:b.sp,v:new THREE.Vector3(0,2.4,0),life:.7});const pill=$('#nCoins').parentNode;if(pill&&!reduced)pill.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:420});return true;}
function clearVisitors(){PEOPLE.forEach(p=>scene.remove(p.m));PEOPLE.length=0;[...bubbles.keys()].forEach(dropBubble);}

/* ---------- stamps ---------- */
function addStamp(kind,a,label){S.stamps.push({kind,animal:a?a.id:null,day:today(),kid:S.profile,label});save();hud();slam(kind,a,label);}
function slam(kind,a,label){const el=$('#slam');$('#slamPic').innerHTML=a?'<img alt="" src="'+a.png+'">':kind==='frog'?'<img alt="" src="'+FROG_URL+'">':'';el.querySelector('b').textContent=kind==='new'?'New animal!':kind==='fed'?'Yum stamp!':kind==='pet'?'Hug stamp!':kind==='frog'?'Frog stamp!':'Builder!';
  speak(kind==='new'?'You got a new animal stamp!':label);
  if(reduced){SFX.stamp();el.style.display='block';setTimeout(()=>el.style.display='none',1200);return;}
  el.style.display='block';el.animate([{transform:'scale(2.4) rotate(-20deg)',opacity:0},{transform:'scale(.92) rotate(0)',opacity:1,offset:.45},{transform:'scale(1)',opacity:1,offset:.6},{transform:'scale(1)',opacity:1,offset:.85},{transform:'translate(0,40vh) scale(.2)',opacity:0}],{duration:1900,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>el.style.display='none';
  setTimeout(SFX.stamp,380);}

/* ---------- HUD ---------- */
let mode='zoo',buildSel=null,foodSel=null,pending=null,selected=null;
function hud(){$('#nAnimals').textContent=S.animals.length;$('#nCoins').textContent=S.coins;{const t=tickets();$('#nTickets').innerHTML=t<COST.draw?t+'<small>/'+COST.draw+'</small>':String(t);}$('#lvl').textContent=1+Math.floor(S.stamps.length/5);
  const k=kid();$('#whoDot').textContent=k.name[0];$('#whoDot').style.background=k.color;$('#whoName').textContent=k.name;
  const sb=$('#soundBtn');sb.innerHTML=icon(S.sound?'sound':'mute');}
function bottom(){const b=$('#bottom');
  if(mode==='zoo'){b.innerHTML='<div class="tools">'+
    '<button class="tool" id="tTix"><span class="roundBtn enamel">'+icon('ticket')+'</span><span class="lbl">Games</span></button>'+
    '<button class="tool" id="tBuild"><span class="roundBtn enamel">'+icon('build')+'</span><span class="lbl">Build</span></button>'+
    '<button class="tool" id="tFeed"><span class="roundBtn enamel">'+icon('feed')+'</span><span class="lbl">Feed</span></button>'+
    '<button class="tool" id="tPass"><span class="roundBtn enamel">'+icon('book')+'</span><span class="lbl">Passport</span></button></div>'+
    '<button class="drawBtn" id="tDraw"><span class="bi">'+icon('pencil')+'</span><span class="dl">Draw an animal</span><span class="cost">'+icon('ticket')+COST.draw+'</span></button>';
    $('#tTix').onclick=()=>{SFX.tap();openBooth();};$('#tBuild').onclick=()=>setMode('build');$('#tFeed').onclick=()=>setMode('feed');$('#tPass').onclick=openPassport;$('#tDraw').onclick=openDraw;}
  else if(mode==='build'){const keys=Object.keys(ITEM);b.innerHTML='<div class="trayRow"><button class="doneFix" id="doneB">'+icon('x')+'Done</button><div class="tray" id="trayRow">'+keys.map(k=>'<button class="card'+(buildSel===k?' sel':'')+'" data-k="'+k+'">'+art(k)+'<span>'+ITEM[k].label+'</span><em class="cst">'+icon('coin')+costOf(k)+'</em></button>').join('')+
    '<button class="card'+(buildSel==='remove'?' sel':'')+'" data-k="remove"><svg viewBox="0 0 24 24" class="i" style="width:44px;height:44px;color:#e8573c">'+ICONS.bulldozer+'</svg><span>Remove</span></button>'+
    ((S.expand||0)<EXPAND_MAX?'<button class="card'+(buildSel==='expand'?' sel':'')+'" data-k="expand"><svg viewBox="0 0 24 24" class="i" style="width:44px;height:44px;color:#2f9e44">'+ICONS.expand+'</svg><span>Bigger zoo (2 pens)</span><em class="cst">'+icon('coin')+EXPAND_COST+'</em></button>':'')+
    '</div></div>';
    b.querySelectorAll('[data-k]').forEach(el=>el.onclick=()=>{if(el.dataset.k==='expand'){if(buildSel==='expand'){doExpand();return;}buildSel='expand';SFX.tap();bottom();banner('Tap Bigger zoo again to buy more land for '+EXPAND_COST+' coins');speak('Tap it again to make the zoo bigger with two new pens. It costs five thousand coins.');return;}buildSel=el.dataset.k;SFX.tap();bottom();banner(buildSel==='remove'?'Tap something to remove it':'Tap the grass to place a '+ITEM[buildSel].label.toLowerCase());speak(buildSel==='remove'?'Tap something to take it away':'Tap the grass to put it there');});
    $('#doneB').onclick=()=>setMode('zoo');}
  else if(mode==='feed'){b.innerHTML='<div class="trayRow"><button class="doneFix" id="doneF">'+icon('x')+'Done</button><div class="tray">'+FOODS.map(f=>'<button class="card'+(foodSel===f.id?' sel':'')+'" data-f="'+f.id+'">'+art(f.id)+'<span>'+f.label+'</span></button>').join('')+'</div></div>';
    b.querySelectorAll('[data-f]').forEach(el=>el.onclick=()=>{foodSel=el.dataset.f;SFX.tap();bottom();banner('Tap an animal to feed it');speak('Tap an animal to feed it');});$('#doneF').onclick=()=>setMode('zoo');}
  else if(mode==='choosePen'){b.innerHTML='<div class="tray"><button class="card done" id="anyPen" style="width:150px">Any pen</button></div>';$('#anyPen').onclick=()=>{const p=bestPen();if(p)finishPlace(p);};}
}
function banner(t){const el=$('#banner');if(!t){el.hidden=true;return;}el.textContent=t;el.hidden=false;}
function setMode(m){mode=m;closeSign();ghost.visible=false;
  if(m==='build'){if(!ITEM[buildSel]&&buildSel!=='remove')buildSel='tree';banner('Tap the grass to place a '+ITEM[buildSel].label.toLowerCase());speak('Pick something to build, then tap the grass');}
  else if(m==='feed'){foodSel=foodSel||'apple';banner('Tap an animal to feed it ('+COST.food+' coins)');speak('Pick a food, then tap an animal. Food costs '+COST.food+' coins.');}
  else if(m!=='choosePen')banner(null);
  ringPens(m==='choosePen');bottom();}
function ringPens(on){pens().forEach(p=>{const o=itemObjs.get(p.id);if(o&&o.userData.ringMesh)o.userData.ringMesh.material.opacity=on?.85:0;});}

/* ---------- sign card ---------- */
function showSign(c){selected=c;const a=c.a,k=KIDS[a.maker]||KIDS.keeper;const el=$('#sign');
  el.innerHTML='<h3>'+esc(a.name)+'</h3><p class="meta"><span class="badge" style="background:'+k.color+'">'+esc(k.name)+'</span>drew it on '+fmtDay(a.made)+'</p>'+(a.fact?'<p class="fact">'+esc(a.fact)+'</p>':'')+
    '<div class="row"><button id="sHear">Hear it</button><button id="sFeed">Feed ('+COST.food+' coins)</button><button id="sSnd">Sound</button></div><div class="row"><button id="sMove">Move</button><button id="sHome" class="warn">Send home</button></div>';
  el.hidden=false;
  $('#sFeed').onclick=()=>{giveFood(c,FOODS[(Math.random()*FOODS.length)|0]);closeSign();};
  $('#sHear').onclick=()=>{playSound(c);c.dance=1.6;hearts(c.g.position,3);};$('#sSnd').onclick=()=>{closeSign();openSoundSheet(c);};
  $('#sMove').onclick=()=>{pending={move:c};closeSign();setMode('choosePen');banner('Tap a pen for '+a.name);speak('Tap a pen to move '+a.name);};
  $('#sHome').onclick=e=>{const btn=e.currentTarget;if(btn.dataset.sure){removeAnimal(a);closeSign();}else{btn.dataset.sure=1;btn.textContent='Yes, send home';}};
  speak('This is '+a.name+'. '+(k.name==='Zookeeper'?'':k.name+' drew it.')+(a.fact?' '+a.fact+'.':''));placeSign();}
function closeSign(){selected=null;$('#sign').hidden=true;}
const tmpV=new THREE.Vector3();
function placeSign(){if(!selected)return;tmpV.copy(selected.g.position);tmpV.y=selected.inf.height+.5;tmpV.project(cam);const el=$('#sign');
  const x=(tmpV.x*.5+.5)*innerWidth,y=(-tmpV.y*.5+.5)*innerHeight;el.style.left=clamp(x,140,innerWidth-140)+'px';el.style.top=clamp(y,240,innerHeight)+'px';}
function removeAnimal(a){const c=critters.get(a.id);if(c){c.dispose();critters.delete(a.id);}S.animals=S.animals.filter(x=>x!==a);save();hud();toast(a.name+' went home');}

