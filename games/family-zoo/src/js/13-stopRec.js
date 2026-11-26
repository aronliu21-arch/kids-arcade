function stopRec(){try{if(recObj&&recObj.state==='recording')recObj.stop();}catch(e){}}
function openSoundSheet(c){sndFor=c;$('#sndSheetTitle').textContent=c.a.name+"'s sound";sndEd=soundEditor($('#sndSheetBody'),c.a.sound||defaultSound(c.a));$('#soundSheet').hidden=false;speak('Pick a sound for '+c.a.name);}
$('#sndSave').onclick=()=>{if(sndFor&&sndEd){sndFor.a.sound=sndEd.get();if(!save2())return;playSound(sndFor);sndFor.dance=1.6;}$('#soundSheet').hidden=true;};
$('#sndClose').onclick=()=>$('#soundSheet').hidden=true;
function save2(){try{localStorage.setItem(KEY,JSON.stringify(S));return true;}catch(e){toast("This device is full. Use a shorter recording");if(sndFor&&sndFor.a.sound&&sndFor.a.sound.kind==='clip'){sndFor.a.sound=defaultSound(sndFor.a);}return false;}}


/* ---------- intro & players ---------- */
function showKids(){const box=$('#kids');box.hidden=false;$('#startBtn').hidden=true;
  box.innerHTML=['nora','lucas','milo'].map(k=>'<button class="kid" data-k="'+k+'"><span class="face" style="background:'+KIDS[k].color+'">'+KIDS[k].name[0]+'</span>'+KIDS[k].name+'</button>').join('');
  box.querySelectorAll('.kid').forEach(b=>b.onclick=()=>choose(b.dataset.k));}
function choose(k){S.profile=k;save();syncHub();hud();$('#intro').hidden=true;stopMusic();SFX.place();speak('Welcome to the zoo, '+KIDS[k].name+'!',true);introOrbit=false;fitView(true);
  if(!S.animals.length)setTimeout(()=>speak(tickets()<COST.draw?'Your zoo is empty! Tap Tickets and answer questions to earn tickets for your first animal.':'Tap Draw an animal to make your first one!'),2200);}
$('#startBtn').onclick=()=>{audio();if(S.sound)startMusic();SFX.boing();showKids();};
$('#whoBtn').onclick=()=>{$('#intro').hidden=false;showKids();};

/* ---------- sample animals so the zoo opens alive ---------- */
function sampleDrawing(kind){const c=document.createElement('canvas');c.width=c.height=320;const x=c.getContext('2d');x.lineCap=x.lineJoin='round';x.lineWidth=7;x.strokeStyle='#1f2a44';
  if(kind==='elephant'){x.fillStyle='#9aa7b5';x.beginPath();x.ellipse(170,170,95,65,0,0,7);x.fill();x.stroke();
    x.beginPath();x.ellipse(85,140,48,45,0,0,7);x.fill();x.stroke();x.beginPath();x.moveTo(55,160);x.quadraticCurveTo(30,220,55,250);x.lineTo(70,245);x.quadraticCurveTo(52,215,72,175);x.closePath();x.fill();x.stroke();
    [[110,215],[150,225],[200,225],[240,215]].forEach(p=>{x.beginPath();x.rect(p[0]-14,p[1],28,50);x.fill();x.stroke();});
    x.fillStyle='#ffb3c7';x.beginPath();x.ellipse(110,130,22,30,.3,0,7);x.fill();x.stroke();x.fillStyle='#1f2a44';x.beginPath();x.arc(72,128,6,0,7);x.fill();}
  else{x.fillStyle='#2b2d42';x.beginPath();x.ellipse(160,175,62,95,0,0,7);x.fill();x.stroke();x.fillStyle='#ffffff';x.beginPath();x.ellipse(165,190,40,70,0,0,7);x.fill();
    x.fillStyle='#f4c542';x.beginPath();x.moveTo(150,105);x.lineTo(185,112);x.lineTo(152,122);x.closePath();x.fill();x.stroke();
    [[130,265],[190,265]].forEach(p=>{x.beginPath();x.ellipse(p[0],p[1],22,10,0,0,7);x.fill();x.stroke();});
    x.fillStyle='#fff';x.beginPath();x.arc(148,95,10,0,7);x.fill();x.fillStyle='#1f2a44';x.beginPath();x.arc(150,95,5,0,7);x.fill();}
  return c.toDataURL('image/png');}
async function boot(){
  S.items.forEach(addItemObj);
  if(!S.samples){const sv=S.items.find(i=>i.type==='pen_savanna'),po=S.items.find(i=>i.type==='pen_polar');
    if(sv)S.animals.push({id:S.nextAnimal++,name:'Peanut',fact:'Sample animal: draw your own!',maker:'keeper',made:today(),png:sampleDrawing('elephant'),pen:sv.id});
    if(po)S.animals.push({id:S.nextAnimal++,name:'Waddles',fact:'Sample animal: draw your own!',maker:'keeper',made:today(),png:sampleDrawing('penguin'),pen:po.id});
    S.samples=true;save();}
  const ids=new Set(pens().map(p=>p.id));S.animals.forEach(a=>{if(!ids.has(a.pen)){const p=bestPen();if(p)a.pen=p.id;}});
  for(const a of S.animals)await spawnCritter(a);
  hud();bottom();resize();
  try{await Promise.race([document.fonts.load('60px "Lilita One"'),new Promise(r=>setTimeout(r,2500))]);}catch(e){}
  /* repaint text boards once the sign font is ready */
  if(document.fonts&&document.fonts.check('60px "Lilita One"')){itemObjs.forEach((o,id)=>{const it=S.items.find(i=>i.id===id);if(it&&it.type.startsWith('pen_')){scene.remove(o);addItemObj(it);}});
    const g=window.__gate;g.children.forEach(ch=>{if(Array.isArray(ch.material)){ch.material[4].map=textTex('LIU FAMILY ZOO',1024,200,'#1f3a5f','#ffffff',120);ch.material[4].needsUpdate=true;}});}
}
paintIcons();
if(loadNote)setTimeout(()=>toast(loadNote),1500);
addEventListener('keydown',e=>{if(e.key==='Escape'&&(mode==='build'||mode==='feed'))setMode('zoo');});
if(ON_SITE)$('#hubLink').hidden=false;

/* ---------- loop ---------- */
let introOrbit=true,lastT=performance.now(),chirpT=4;
function frame(now){requestAnimationFrame(frame);if(!document.hidden)step(now);}
function step(now){const dt=Math.min(.05,(now-lastT)/1000);lastT=now;const t=now/1000;
  if(introOrbit&&!reduced){view.x=Math.sin(t*.15)*3;view.z=.5+Math.cos(t*.15)*2;placeCam();}
  if(fly){fly.t+=dt/.7;const k=Math.min(1,fly.t),e=1-Math.pow(1-k,3);view.x=fly.x0+(fly.x1-fly.x0)*e;view.z=fly.z0+(fly.z1-fly.z0)*e;view.zoom=fly.m0+(fly.m1-fly.m0)*e;placeCam();if(k>=1)fly=null;}
  critters.forEach(c=>c.update(dt,t));tickPeople(dt,t);tickParts(dt);tickDrops(dt);
  for(let i=popIn.length-1;i>=0;i--){const p=popIn[i];p.t+=dt*2.5;const k=Math.min(1,p.t);const s=k<1?1+Math.sin(k*Math.PI)*.25*(1-k)+(k-1)*0:1;p.o.scale.setScalar(Math.max(.01,1-Math.pow(1-k,3))*s);if(k>=1){p.o.scale.setScalar(1);popIn.splice(i,1);}}
  waterMats.forEach((tx,i)=>{tx.offset.x=(t*.03+i*.1)%1;tx.offset.y=Math.sin(t*.4+i)*.02;});
  if(mode==='choosePen'){const o=.45+.4*Math.sin(t*5);pens().forEach(p=>{const ob=itemObjs.get(p.id);if(ob&&ob.userData.ringMesh)ob.userData.ringMesh.material.opacity=o;});}
  if(selected)placeSign();
  chirpT-=dt;if(chirpT<=0){chirpT=rand(5,11);if($('#intro').hidden&&S.sound)SFX.chirp();}
  renderer.render(scene,cam);}
resize();boot().then(()=>requestAnimationFrame(frame));

/* automated playtest hook, harmless for players */
window.__test={
  tick:(n)=>{let t=performance.now();for(let i=0;i<(n||30);i++){t+=16;step(t);}},
  critters:()=>[...critters.values()].map(c=>[c.a.name,+c.g.position.x.toFixed(2),+c.g.position.z.toFixed(2),+c.body.position.y.toFixed(2),c.a.pen]),
  info:()=>({calls:renderer.info.render.calls,frames:renderer.info.render.frame,cam:[cam.left,cam.top,cam.position.x,cam.position.y]}),
  state:()=>({screen:!$('#intro').hidden?'intro':!$('#draw').hidden?'draw':!$('#passport').hidden?'passport':'zoo',mode,animals:S.animals.length,critters:critters.size,stamps:S.stamps.length,items:S.items.length}),
  choose:k=>choose(k),
  give:n=>earn(n),
  coins:n=>{if(n!=null){S.coins=n;hud();}return S.coins;},
  place:(type,c,r)=>{if(!fits(type,c,r))return 'blocked';if(!spendCoins(costOf(type),'x'))return 'nocoins';const it={id:S.nextItem++,type,c,r};S.items.push(it);addItemObj(it);save();return 'ok';},
  expand:()=>{doExpand();return S.expand||0;},
  people:()=>PEOPLE.length,bubbles:()=>[...bubbles.values()].map(b=>b.amt),spawn:()=>spawnFamily(),collectAll:()=>{let t=0;[...bubbles.keys()].forEach(id=>{t+=bubbles.get(id).amt;dropBubble(id);});S.coins+=t;hud();return t;},
  qcheck:rounds=>{const bad=[];let total=0;const keep=JSON.stringify(S.seen);
    for(const k of ['nora','lucas','milo'])for(const g of QB.ORDER[k])for(let r=0;r<(rounds||20);r++){let qs;try{qs=QB.GAMES[g].make(QB.GAMES[g].n,k);}catch(e){bad.push(g+': make threw '+e.message);continue;}
      if(!qs||qs.length!==QB.GAMES[g].n)bad.push(g+': got '+(qs?qs.length:0)+' questions');
      const ids=new Set();for(const q of qs){total++;const vals=q.choices.map(c=>String(c.val));const hits=vals.filter(v=>v===String(q.answer)).length;
        if(hits!==1)bad.push(g+' '+q.id+': answer '+q.answer+' appears '+hits+' times in '+vals.join('|'));
        if(new Set(vals).size!==vals.length)bad.push(g+' '+q.id+': duplicate choices '+vals.join('|'));
        if(q.choices.length<2)bad.push(g+' '+q.id+': only '+q.choices.length+' choices');
        if(q.choices.some(c=>c.html==null||String(c.html).trim()===''))bad.push(g+' '+q.id+': empty choice');
        if(!q.prompt)bad.push(g+' '+q.id+': no prompt');
        if(ids.has(q.id)&&!String(q.id).startsWith('f')&&!String(q.id).startsWith('sh'))bad.push(g+' '+q.id+': repeated in one round');ids.add(q.id);}}
    S.seen=JSON.parse(keep);return {total,bad:[...new Set(bad)].slice(0,40),badCount:bad.length};},
  quiz:g=>{openBooth();startRound(g);return Q.qs.length;},
  answer:ok=>{const q=Q.qs[Q.i],ri=rightIndex(q),bs=[...document.querySelectorAll('#boothBody .qc')];const b=ok?bs[ri]:bs.find((x,i)=>i!==ri&&!x.classList.contains('dead'));b.click();return document.getElementById('qfb').textContent;},
  next:()=>{const n=document.getElementById('qNext');if(n)n.click();return document.getElementById('boothTitle').textContent;},
  drawSample:()=>{px.clearRect(0,0,640,640);px.lineWidth=14;px.strokeStyle='#e8573c';px.lineCap='round';px.beginPath();px.ellipse(330,340,190,120,0,0,7);px.stroke();px.beginPath();px.arc(170,240,70,0,7);px.stroke();
    [[230,450],[420,450]].forEach(p=>{px.beginPath();px.moveTo(p[0],p[1]);px.lineTo(p[0],560);px.stroke();});px.fillStyle='#1f2a44';px.beginPath();px.arc(150,225,12,0,7);px.fill();strokes=3;},
  solve:async()=>{earn(8);openDraw();window.__test.drawSample();await $('#makeBtn').onclick();await new Promise(r=>setTimeout(r,400));$('#nameIn').value='Testy';$('#toZooBtn').onclick();if(mode==='choosePen')await finishPlace(pens()[0]);}
};
})();
