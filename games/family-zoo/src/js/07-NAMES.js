const NAMES=['Bubbles','Mochi','Captain Fluff','Noodle','Biscuit','Rocket','Dumpling','Sparkle','Pickle','Bao','Zoom','Waffles','Peanut','Tofu','Sunny','Boba'];
const FACTS=['Loves to dance','Eats noodles','Can fly','Sleeps all day','Super fast','A little shy','Sings songs','Loves soccer','Has 100 friends','Can talk to fish'];
let factSel=null;
$('#makeBtn').onclick=async()=>{audio();if(strokes<1){$('#paper').classList.remove('shake');void paper.offsetWidth;$('#paper').classList.add('shake');SFX.nope();speak('Draw something first',true);return;}
  const small=document.createElement('canvas');small.width=small.height=320;small.getContext('2d').drawImage(paper,0,0,320,320);const png=small.toDataURL('image/png');
  const img=await loadImg(png);const inf=inflate(img,S.nextAnimal);if(!inf){SFX.nope();toast('Draw a bit bigger');return;}
  if(!spend(COST.draw,'to draw an animal')){$('#draw').hidden=true;return;}
  made={png,inf};$('#drawStep').hidden=true;$('#revealStep').hidden=false;drawStepIs('reveal');$('#drawTitle').textContent='It came alive!';$('#beforePic').innerHTML='<img alt="Your drawing" src="'+png+'">';
  factSel=null;const nm=NAMES.slice().sort(()=>Math.random()-.5).slice(0,4);$('#nameIn').value='';
  $('#nameChips').innerHTML=nm.map(n=>'<button class="chip">'+n+'</button>').join('');$('#nameChips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;$('#nameIn').value=b.textContent;SFX.tap();speak(b.textContent,true);updToZoo();};
  $('#factChips').innerHTML=FACTS.slice().sort(()=>Math.random()-.5).slice(0,5).map(n=>'<button class="chip">'+n+'</button>').join('');
  $('#factChips').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;factSel=b.classList.contains('sel')?null:b.textContent;document.querySelectorAll('#factChips .chip').forEach(x=>x.classList.toggle('sel',x.textContent===factSel));SFX.tap();};
  revealSnd=soundEditor($('#sndPane'),{kind:'synth',id:SOUNDS[(Math.random()*SOUNDS.length)|0][0]});
  updToZoo();ensurePreview();sizePreview();
  if(prevMesh){prevScene.remove(prevMesh);}prevMesh=new THREE.Mesh(inf.geo,new THREE.MeshStandardMaterial({map:inf.tex,roughness:.55}));
  const s=1.7/Math.max(inf.width,inf.height);prevMesh.scale.setScalar(s);prevMesh.position.y=0;prevMesh.userData.s=s;prevScene.add(prevMesh);
  const H=inf.height*s;prevCam.position.set(0,H*.6+.4,4.6);prevCam.lookAt(0,H*.45,0);
  prevT=0;SFX.poof();sparkle();speak('Poof! Your animal came alive! What is its name?',false);
  stopPreview();const loop=()=>{prevRAF=requestAnimationFrame(loop);prevT+=1/60;const k=Math.min(1,prevT/1.3);
    const el=reduced?1:(k<1?1-Math.pow(2,-10*k)*Math.cos(k*Math.PI*5):1);
    prevMesh.scale.set(s,s*(reduced?1:.6+.4*Math.min(1,k*1.5)),s*Math.max(.02,el));prevMesh.rotation.y=reduced?.5:(k<1?k*Math.PI*2+.4:.4+Math.sin((prevT-1.3)*.9)*.55);prevR.render(prevScene,prevCam);};loop();};
function updToZoo(){const n=$('#nameIn').value.trim();$('#toZooTxt').textContent=n?'Take '+n+' to the zoo':'Take it to the zoo';}
$('#makeTop').onclick=()=>$('#makeBtn').onclick();
$('#zooTop').onclick=()=>{$('#nameIn').blur();$('#toZooBtn').onclick();};
$('#nameIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#nameIn').blur();}});
$('#nameIn').addEventListener('blur',()=>setTimeout(()=>{window.scrollTo(0,0);document.documentElement.scrollTop=document.body.scrollTop=0;},50));
function drawResize(){if($('#draw').hidden)return;fitPaper();if(prevR&&!$('#revealStep').hidden)sizePreview();}
addEventListener('resize',drawResize);if(window.visualViewport)visualViewport.addEventListener('resize',drawResize);addEventListener('orientationchange',()=>setTimeout(drawResize,300));
$('#nameIn').addEventListener('input',updToZoo);
function saveNow(){try{localStorage.setItem(KEY,JSON.stringify(S));return true;}catch(e){return false;}}
$('#toZooBtn').onclick=async()=>{if(!made)return;let n=$('#nameIn').value.trim();if(!n){n=$('#nameChips .chip')?.textContent||'Buddy';}
  const sound=revealSnd?revealSnd.get():null;if(!pens().length)autoPen();const pen0=bestPen();
  /* save the new animal right away, so closing or reloading can never lose it */
  const a={id:S.nextAnimal++,name:n.slice(0,16),fact:factSel,maker:S.profile||'nora',made:today(),png:made.png,pen:pen0?pen0.id:null,sound};
  S.animals.push(a);let ok=saveNow();if(!ok&&a.sound&&a.sound.kind==='clip'){a.sound=defaultSound(a);ok=saveNow();}
  if(!ok)toast("This device is full, so "+a.name+" couldn't be saved");
  made=null;$('#draw').hidden=true;stopPreview();
  const c=await spawnCritter(a);hud();setTimeout(()=>addStamp('new',a,a.name+' joined the zoo'),900);if(!c)return;
  if(pens().length>1){c.hold=true;c.g.position.set(0,0,GRID/2-.6);pending={move:c,isNew:true};setMode('choosePen');banner('Tap a pen for '+a.name);speak('Tap a pen for '+a.name);flyTo(c.g.position);}
  else{const to=c.g.position.clone();c.anim={from:new THREE.Vector3(0,0,GRID/2+.5),to,t:0,d:1.4,h:3};flyTo(to);}};
function bestPen(){const ps=pens();if(!ps.length)return autoPen();return ps.slice().sort((a,b)=>S.animals.filter(x=>x.pen===a.id).length-S.animals.filter(x=>x.pen===b.id).length)[0];}
function autoPen(){const types=['pen_savanna','pen_jungle','pen_polar','pen_pond'];for(let r=rMin()+1;r<GRID-4;r++)for(let c=1;c<GRID-4;c++){if(fits('pen_savanna',c,r)){const it={id:S.nextItem++,type:types[(Math.random()*4)|0],c,r};S.items.push(it);addItemObj(it);save();return it;}}return null;}
async function finishPlace(pen){
  if(pending&&pending.move){const c=pending.move;c.hold=false;c.a.pen=pen.id;save();const b=penBounds(pen);const to=new THREE.Vector3(rand(b.x0,b.x1),0,rand(b.z0,b.z1));c.anim={from:c.g.position.clone(),to,t:0,d:1.2,h:pending.isNew?3:2.2};c.target=null;pending=null;setMode('zoo');flyTo(to);if(giftNext===c){giftNext=null;banner(null);setTimeout(()=>openBowl(c),1500);}return;}
  if(!pending)return;const a={id:S.nextAnimal++,name:pending.name,fact:pending.fact,maker:S.profile||'nora',made:today(),png:pending.png,pen:pen.id,sound:pending.sound};pending=null;
  S.animals.push(a);save();setMode('zoo');const c=await spawnCritter(a);hud();
  if(c){const b=penBounds(pen);const to=c.g.position.clone();c.anim={from:new THREE.Vector3(to.x,0,GRID/2+.5),to,t:0,d:1.4,h:3};flyTo(to);}
  setTimeout(()=>addStamp('new',a,a.name+' joined the zoo'),900);}
let fly=null;function flyTo(p){fly={x0:view.x,z0:view.z,x1:clamp(p.x,-11,11),z1:clamp(p.z+1,-11+rMin(),12),m0:view.zoom,m1:view.zoom,t:0};}
function fitView(animate){const W=innerWidth,H=innerHeight;if(!W||!H)return;let ps=pens().filter(p=>S.animals.some(a=>a.pen===p.id));if(!ps.length)ps=pens();if(!ps.length)return;
  let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;ps.forEach(p=>{const c=itemCenter(p);x0=Math.min(x0,c.x-2.3);x1=Math.max(x1,c.x+2.3);z0=Math.min(z0,c.z-2.3);z1=Math.max(z1,c.z+2.6);});
  const top=$('#top').getBoundingClientRect().bottom+8,bot=Math.max(90,H-$('#bottom').getBoundingClientRect().top+8);
  const keep={x:view.x,z:view.z,zoom:view.zoom};view.x=(x0+x1)/2;view.z=(z0+z1)/2;view.zoom=1;placeCam();
  let ax=1e9,bx=-1e9,ay=1e9,by=-1e9;for(const x of [x0,x1])for(const z of [z0,z1])for(const y of [0,2.4]){const p=new THREE.Vector3(x,y,z).project(cam);ax=Math.min(ax,p.x);bx=Math.max(bx,p.x);ay=Math.min(ay,p.y);by=Math.max(by,p.y);}
  const sx0=-1+32/W,sx1=1-32/W,sy1=1-2*top/H,sy0=-1+2*bot/H;
  const zm=clamp(Math.min((sx1-sx0)/(bx-ax),(sy1-sy0)/(by-ay)),.6,2.4);view.zoom=zm;placeCam();
  const toPx=(nx,ny)=>[(nx+1)/2*W,(1-ny)/2*H];const b=toPx((ax+bx)/2*zm,(ay+by)/2*zm),sc=toPx((sx0+sx1)/2,(sy0+sy1)/2);
  const gB=groundAt(b[0],b[1]),gS=groundAt(sc[0],sc[1]);if(!gB||!gS||!isFinite(zm)){view.x=keep.x;view.z=keep.z;view.zoom=keep.zoom;placeCam();return;}const tx=clamp(view.x+(gB.x-gS.x),-11,11),tz=clamp(view.z+(gB.z-gS.z),-11+rMin(),12);
  view.x=keep.x;view.z=keep.z;view.zoom=keep.zoom;placeCam();
  if(animate&&!reduced)fly={x0:view.x,z0:view.z,x1:tx,z1:tz,m0:view.zoom,m1:zm,t:0};else{view.x=tx;view.z=tz;view.zoom=zm;placeCam();}}

/* ---------- passport ---------- */
function openPassport(){closeSign();SFX.tap();const grid=$('#stampGrid');const st=S.stamps.slice().reverse();
  const ic={new:'star',fed:'feed',pet:'heart',build:'build',frog:'sparkle'};
  grid.innerHTML=st.map((s,ix)=>{const k=KIDS[s.kid]||KIDS.keeper;return '<div class="st" style="transform:rotate('+((ix*37)%15-7)+'deg)" title="'+esc(s.label||'')+'">'+icon(ic[s.kind]||'star')+'<b>'+({new:'New!',fed:'Yum',pet:'Hug',build:'Built'}[s.kind]||'Stamp')+'</b><span>'+fmtDay(s.day)+'</span><span style="color:'+k.color+'">'+esc(k.name)+'</span></div>';}).join('')+
    Array.from({length:Math.max(0,8-st.length)},()=>'<div class="st empty">'+icon('stamp')+'<span>Next stamp</span></div>').join('');
  const list=$('#ticketList');
  list.innerHTML=S.animals.length?S.animals.slice().reverse().map(a=>{const k=KIDS[a.maker]||KIDS.keeper;return '<div class="ticket"><img src="'+a.png+'" alt=""><div><h4>'+esc(a.name)+'</h4><p><span class="badge" style="background:'+k.color+'">'+esc(k.name)+'</span> '+fmtDay(a.made)+(a.fact?' · '+esc(a.fact):'')+'</p></div><button class="see" data-a="'+a.id+'" aria-label="See '+esc(a.name)+'">'+icon('eye')+'</button></div>';}).join('')
    :'<p class="emptyNote">No animals yet. Tap <b>Draw an animal</b> to make your first one.</p>';
  list.querySelectorAll('.see').forEach(b=>b.onclick=()=>{const c=critters.get(+b.dataset.a);$('#passport').hidden=true;if(c){flyTo(c.g.position);setTimeout(()=>showSign(c),600);}});
  $('#passport').hidden=false;speak('Your zoo passport. You have '+S.stamps.length+' stamps.');}
$('#ppClose').onclick=()=>$('#passport').hidden=true;

/* ---------- settings & parent gate ---------- */
function openSettings(){closeSign();const k=kid();$('#setTitle').textContent='Settings';
  $('#setBody').innerHTML='<div class="rowSet">Read aloud for '+esc(k.name)+'<button class="toggle'+(S.voice[S.profile]?' on':'')+'" id="vT" aria-label="Read aloud"></button></div>'+
    '<div class="rowSet">Sound and music<button class="toggle'+(S.sound?' on':'')+'" id="sT" aria-label="Sound"></button></div>'+
    '<button class="btnLine" id="resetB">Reset records (grown-ups)</button><p class="hint">The zoo saves on this device only. Animals made on the iPad stay on the iPad.</p>';
  $('#vT').onclick=e=>{S.voice[S.profile]=!S.voice[S.profile];e.currentTarget.classList.toggle('on');save();speak('Read aloud is on');};
  $('#sT').onclick=e=>{S.sound=!S.sound;e.currentTarget.classList.toggle('on');if(master)master.gain.value=S.sound?1:0;save();hud();};
  $('#resetB').onclick=gate;$('#settings').hidden=false;}
let gq=null;
function gate(){gq={a:(100+Math.random()*900)|0,b:(10+Math.random()*90)|0};$('#setTitle').textContent='Grown-ups only';
  $('#setBody').innerHTML='<p class="gateQ">'+gq.a+' × '+gq.b+' = ?</p><input id="gateIn" inputmode="numeric" autocomplete="off" aria-label="Answer"><p class="err" id="gErr"></p><button class="btnLine" id="gOk">Check</button>';
  const chk=()=>{if(+$('#gateIn').value===gq.a*gq.b)resetPick();else{gq={a:(100+Math.random()*900)|0,b:(10+Math.random()*90)|0};$('.gateQ').textContent=gq.a+' × '+gq.b+' = ?';$('#gateIn').value='';$('#gErr').textContent='Not quite. Here is a new one.';}};
  $('#gOk').onclick=chk;$('#gateIn').onkeydown=e=>{if(e.key==='Enter')chk();};setTimeout(()=>$('#gateIn').focus(),50);}
function backupLine(){const b=parse(rawGet(BACKUP));if(!b||!b.data)return '';const d=new Date(b.at||0),n=(b.data.animals||[]).length;
  return '<p class="hint" style="font-size:15px;margin-top:8px">Backup from '+d.toLocaleDateString()+' '+d.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})+' with '+n+' animal'+(n===1?'':'s')+'.</p><button class="btnLine" id="doRestore">Restore that backup</button>';}
function resetPick(){$('#setTitle').textContent='Reset records';
  $('#setBody').innerHTML='<p class="hint" style="font-size:16px">Tick what to clear on this device. This can’t be undone.</p>'+
    ['nora','lucas','milo'].map(k=>'<label class="check"><input type="checkbox" value="'+k+'"> '+KIDS[k].name+'’s animals and stamps</label>').join('')+
    '<label class="check"><input type="checkbox" value="layout"> Zoo layout and coins (pens, shops, trees, paths)</label><button class="btnLine red" id="doReset">Reset</button>'+backupLine();
  $('#settings').onclick=e=>{const t=e.target.closest('#doRestore');if(!t)return;if(!t.dataset.sure){t.dataset.sure=1;t.textContent='Tap again to restore. Today\'s changes will be replaced.';return;}const b=parse(rawGet(BACKUP));if(b&&b.data){try{localStorage.setItem(KEY,JSON.stringify(b.data));location.reload();}catch(err){toast("Couldn't restore the backup");}}};
  $('#doReset').onclick=()=>{const v=[...document.querySelectorAll('#setBody input:checked')].map(i=>i.value);if(!v.length){toast('Tick something to reset');return;}
    v.filter(x=>KIDS[x]).forEach(k=>{S.animals.filter(a=>a.maker===k).forEach(a=>{const c=critters.get(a.id);if(c){c.dispose();critters.delete(a.id);}});S.animals=S.animals.filter(a=>a.maker!==k);S.stamps=S.stamps.filter(s=>s.kid!==k);S.tickets[k]=0;S.seen[k]={};});
    if(v.includes('layout')){clearVisitors();S.coins=150;itemObjs.forEach(o=>scene.remove(o));itemObjs.clear();const L=defaultLayout();S.items=L.items;S.nextItem=L.nextItem;S.items.forEach(addItemObj);const ids=new Set(pens().map(p=>p.id));S.animals.forEach(a=>{if(!ids.has(a.pen)){a.pen=bestPen().id;const c=critters.get(a.id);if(c)c.home();}});}
    save();hud();$('#settings').hidden=true;toast('Records reset');};}
$('#setClose').onclick=()=>$('#settings').hidden=true;
$('#gearBtn').onclick=openSettings;
$('#soundBtn').onclick=()=>{S.sound=!S.sound;audio();if(master)master.gain.value=S.sound?1:0;save();hud();};

