/* ---------- v1.2: welcome gift, leaf bowl, find-the-frog, play-as ---------- */
const NUMS=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
const URLKID=(function(){try{const k=new URLSearchParams(location.search).get('kid');return KIDS[k]?k:null;}catch(e){return null;}})();
const STARTERS=[{id:'elephant',name:'Elephant'},{id:'giraffe',name:'Giraffe'},{id:'monkey',name:'Monkey'},{id:'zebra',name:'Zebra'}];
const ART_DIR='../animal-safari/art/';
let giftNext=null;
function needsGift(k){return !(S.gift&&S.gift[k])&&!S.animals.some(a=>a.maker===k);}
function starterPng(src){return new Promise(res=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=c.height=320;const x=c.getContext('2d');const s=Math.min(300/im.width,300/im.height),w=im.width*s,h=im.height*s;x.drawImage(im,(320-w)/2,315-h,w,h);res(c.toDataURL('image/png'));};im.onerror=()=>res(null);im.src=src;});}
function giftShow(title,html){$('#giftTitle').textContent=title;$('#giftBody').innerHTML=html;$('#gift').hidden=false;}
function giftClose(){$('#gift').hidden=true;}
function openGift(){closeSign();
  giftShow('🎁 Welcome gift!','<p class="gsay">Pick your first animal. It is free!</p><div class="giftGrid">'+STARTERS.map(s=>'<button class="giftCard" data-s="'+s.id+'"><img alt="" src="'+ART_DIR+s.id+'.webp"><span>'+s.name+'</span></button>').join('')+'</div>');
  speak('Welcome gift! Pick your first animal.',true);
  $('#giftBody').querySelectorAll('.giftCard').forEach(b=>b.onclick=()=>{SFX.boing();giftName(STARTERS.find(s=>s.id===b.dataset.s));});}
function giftName(st){const nm=NAMES.slice().sort(()=>Math.random()-.5).slice(0,3);let pick=nm[0];
  giftShow('Name your '+st.name.toLowerCase(),'<div class="gRow"><img class="gPic" alt="" src="'+ART_DIR+st.id+'.webp"><div class="gCol"><p class="gsay">Pick a silly name!</p><div class="gNames">'+nm.map((n,i)=>'<button class="chip big'+(i?'':' sel')+'">'+n+'</button>').join('')+'</div><input id="giftIn" maxlength="16" placeholder="or type a name" aria-label="Animal name"><button class="go gGo" id="giftGo">▶ Take <span id="gNm">'+esc(pick)+'</span> to the zoo</button></div></div>');
  speak('Pick a silly name for your '+st.name+'!',true);
  const box=$('#giftBody');box.querySelectorAll('.gNames .chip').forEach(b=>b.onclick=()=>{pick=b.textContent;box.querySelectorAll('.gNames .chip').forEach(x=>x.classList.toggle('sel',x===b));$('#giftIn').value='';$('#gNm').textContent=pick;SFX.tap();speak(pick,true);});
  $('#giftIn').oninput=e=>{const v=e.target.value.trim();$('#gNm').textContent=v||pick;};
  $('#giftGo').onclick=()=>{SFX.place();giftPlace(st,($('#giftIn').value.trim()||pick).slice(0,16));};}
async function giftPlace(st,name){giftClose();const png=await starterPng(ART_DIR+st.id+'.webp');if(!png){toast('Could not load the animal. Try again on Wi-Fi.');return;}
  if(!pens().length)autoPen();const p0=bestPen();
  const a={id:S.nextAnimal++,name,fact:null,maker:S.profile,made:today(),png,pen:p0?p0.id:null,sound:null,gift:true};
  S.animals.push(a);S.gift=S.gift||{};S.gift[S.profile]=today();saveNow();
  const c=await spawnCritter(a);hud();setTimeout(()=>addStamp('new',a,a.name+' joined the zoo'),600);if(!c)return;
  if(pens().length>1){giftNext=c;c.hold=true;c.g.position.set(0,0,GRID/2-.6);pending={move:c,isNew:true};setMode('choosePen');banner('Tap a home for '+name);flyTo(c.g.position);setTimeout(()=>{if(giftNext===c)speak('Tap a home for '+name+'!',true);},2300);}
  else setTimeout(()=>openBowl(c),2200);}
/* a leaf bowl: tap leaves one at a time; used by the gift and by Feeding Time */
function bowlHTML(max){return '<div class="bowlWrap"><div class="pile">'+Array.from({length:max},(_,i)=>'<button class="pleaf" data-l="'+i+'" aria-label="Leaf"><img alt="" src="'+ART_DIR+'leaf.webp"></button>').join('')+'</div>'+
  '<div class="bowlCol"><div class="bowl"><div class="inBowl"></div><b class="bowlN">0</b></div><div class="bowlBtns"><button class="bUndo" aria-label="Take one out">↺</button><button class="bFeed">Feed!</button></div></div></div>';}
function wireBowl(root,onFeed){const st={n:0,used:[]};const inB=root.querySelector('.inBowl'),nEl=root.querySelector('.bowlN');
  const draw=()=>{nEl.textContent=st.n;inB.innerHTML=Array.from({length:st.n},(_,i)=>'<img alt="" style="--r:'+((i*47)%60-30)+'deg;--x:'+((i%4)*22-33)+'px;--y:'+(-Math.floor(i/4)*14)+'px" src="'+ART_DIR+'leaf.webp">').join('');};
  root.querySelectorAll('.pleaf').forEach(b=>b.onclick=()=>{if(st.locked||b.classList.contains('gone'))return;
    const bw=root.querySelector('.bowl');if(!reduced){const a=b.getBoundingClientRect(),z=bw.getBoundingClientRect();b.animate([{transform:'translate(0,0)'},{transform:'translate('+(z.left+z.width/2-a.left-a.width/2)*.5+'px,'+((z.top-a.top)*.5-60)+'px) rotate(90deg)'},{transform:'translate('+(z.left+z.width/2-a.left-a.width/2)+'px,'+(z.top+z.height/3-a.top-a.height/2)+'px) scale(.6)'}],{duration:380,easing:'ease-in'});}
    setTimeout(()=>{b.classList.add('gone');st.used.push(b);st.n++;draw();SFX.pop();speak(st.n<NUMS.length?NUMS[st.n]:String(st.n),true);},reduced?0:360);});
  root.querySelector('.bUndo').onclick=()=>{if(st.locked||!st.n)return;st.n--;st.used.pop().classList.remove('gone');draw();SFX.tap();};
  root.querySelector('.bFeed').onclick=()=>{if(st.locked)return;if(!st.n){SFX.nope();speak('Put leaves in the bowl first!',true);return;}onFeed(st.n,st);};
  st.reset=()=>{st.n=0;st.used.forEach(b=>b.classList.remove('gone'));st.used=[];draw();};
  st.show=n=>{st.n=n;draw();};
  st.gobble=hero=>{st.locked=true;const imgs=[...inB.querySelectorAll('img')];if(hero&&!reduced){const h=hero.getBoundingClientRect();imgs.forEach((im,i)=>{const a=im.getBoundingClientRect();im.animate([{transform:'translate(0,0)'},{transform:'translate('+(h.left+h.width/2-a.left)+'px,'+(h.top+h.height/2-a.top)+'px) scale(.2)',opacity:0}],{duration:420,delay:i*90,fill:'forwards',easing:'ease-in'});});
      hero.animate([{transform:'scale(1)'},{transform:'scale(1.12,.9)'},{transform:'scale(.95,1.08)'},{transform:'scale(1.1,.92)'},{transform:'scale(1)'}],{duration:500,delay:imgs.length*90+250,iterations:2});}
    setTimeout(()=>{nEl.textContent='😋';SFX.munch();},imgs.length*90+400);};
  draw();return st;}
function openBowl(c){const need=3;
  giftShow('Feed '+c.a.name+'!','<p class="gsay">Put <b>'+need+'</b> leaves in the bowl.</p><div class="gFeed"><img class="hero gHero" alt="" src="'+c.a.png+'">'+bowlHTML(6)+'</div>');
  speak(c.a.name+' is hungry! Put '+NUMS[need]+' leaves in the bowl.',true);
  const st=wireBowl($('#giftBody'),n=>{if(n!==need){SFX.nope();speak(n<need?'More leaves! We need '+NUMS[need]+'.':'Too many! Take some out. We need '+NUMS[need]+'.',true);return;}
    st.gobble($('#giftBody .gHero'));setTimeout(()=>{giftClose();giveFood(c,FOODS.find(f=>f.id==='leaves'),null,true);setTimeout(giftWrap,3200);},1500);});}
function giftWrap(){const t=tickets(),need=COST.draw;
  const msg='Next animal: '+t+' of '+need+' tickets. Play zoo games to earn more!';toast('🎟 '+msg);speak(msg,true);
  const b=$('#tkBtn');if(b&&!reduced)b.animate([{transform:'scale(1)'},{transform:'scale(1.3)'},{transform:'scale(1)'}],{duration:600,iterations:3});
  setTimeout(()=>{speak('Psst! A little frog is hiding in your zoo. Can you find it?',true);toast('🐸 Psst… a frog is hiding in your zoo!');},5200);}

/* ---------- find the frog ---------- */
const FROG_URL=(function(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.lineWidth=5;x.strokeStyle='#1f3a5f';x.lineJoin='round';
  x.fillStyle='#5cc067';x.beginPath();x.ellipse(64,86,44,32,0,0,7);x.fill();x.stroke();
  [[40,50],[88,50]].forEach(p=>{x.fillStyle='#5cc067';x.beginPath();x.arc(p[0],p[1],17,0,7);x.fill();x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(p[0],p[1],10,0,7);x.fill();x.fillStyle='#1f3a5f';x.beginPath();x.arc(p[0]+2,p[1]+1,5.5,0,7);x.fill();});
  x.fillStyle='#ffb3c7';x.beginPath();x.arc(36,92,7,0,7);x.arc(92,92,7,0,7);x.fill();
  x.beginPath();x.moveTo(46,86);x.quadraticCurveTo(64,104,82,86);x.stroke();
  x.fillStyle='#3f9c50';[[30,116],[98,116]].forEach(p=>{x.beginPath();x.ellipse(p[0],p[1],16,7,0,0,7);x.fill();x.stroke();});
  return c.toDataURL();})();
let frog=null;const FROG_SIDE=new THREE.Vector3(.7,0,-.7);
function frogInit(){const tex=new THREE.TextureLoader().load(FROG_URL);tex.encoding=THREE.sRGBEncoding;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));sp.center.set(.5,0);sp.scale.set(.7,.7,1);sp.renderOrder=3;scene.add(sp);frog={sp,clock:0,hop:null,cool:0,base:new THREE.Vector3()};frogMove();}
function frogMove(){const ts=S.items.filter(i=>i.type==='tree'||i.type==='pine'||i.type==='bush');if(!ts.length){frog.sp.visible=false;frog.base=null;return;}
  let t,n=0;do{t=ts[(Math.random()*ts.length)|0];}while(ts.length>1&&t===frog.tree&&n++<9);frog.tree=t;const c=itemCenter(t);frog.base=new THREE.Vector3(c.x-.32,0,c.z-.32);frog.clock=rand(0,2);}
function tickFrog(dt){if(!frog||!frog.base)return;const sp=frog.sp;
  if(frog.hop){const h=frog.hop;h.t+=dt/.55;const k=Math.min(1,h.t);sp.position.lerpVectors(h.from,h.to,k);sp.position.y=Math.sin(k*Math.PI)*.9;sp.scale.set(.7,.7*(1+.25*Math.sin(k*Math.PI)),1);
    if(k>=1){if(h.left>0){const to=h.to.clone().add(new THREE.Vector3(rand(-1.2,1.2),0,rand(-1.2,1.2)));frog.hop={from:h.to.clone(),to,t:0,left:h.left-1};SFX.boing();}else{frog.hop=null;sp.visible=false;frog.cool=rand(7,12);frogMove();}}return;}
  if(frog.cool>0){frog.cool-=dt;sp.visible=false;return;}
  sp.visible=$('#intro').hidden;frog.clock+=dt;const y=frog.clock%6;const out=y<2?0:y<2.4?(y-2)/.4:y<4.4?1:y<4.8?1-(y-4.4)/.4:0;
  sp.position.copy(frog.base).addScaledVector(FROG_SIDE,out*.6);sp.position.y=0;sp.scale.set(.7,.7*(.28+.72*out),1);}
function frogTap(x,y){if(!frog||!frog.sp.visible||frog.hop||frog.cool>0)return false;const p=frog.sp.position.clone();p.y+=.25;p.project(cam);
  const sx=(p.x+1)/2*innerWidth,sy=(1-p.y)/2*innerHeight;if(Math.hypot(sx-x,sy-y)>Math.max(46,60/Math.max(1,view.zoom*.8)))return false;
  SFX.boing();frog.hop={from:frog.sp.position.clone().setY(0),to:frog.sp.position.clone().setY(0).add(new THREE.Vector3(rand(-1.4,1.4),0,rand(.4,1.4))),t:0,left:2};
  const d=today();if(S.profile&&!S.stamps.some(s=>s.kind==='frog'&&s.day===d&&s.kid===S.profile))setTimeout(()=>addStamp('frog',null,'You found the frog!'),500);
  else speak('Ribbit! You found the frog again!',true);
  return true;}
