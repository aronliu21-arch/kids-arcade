const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=(a,b)=>a+Math.random()*(b-a);
const today=()=>new Date().toISOString().slice(0,10);
const fmtDay=d=>{try{return new Date(d+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'});}catch(e){return d;}};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let toastT;function toast(t){const el=$('#toast');el.textContent=t;const bb=$('#bottom').getBoundingClientRect();el.style.bottom=Math.max(20,innerHeight-bb.top+14)+'px';speak(t);el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2200);}
function kid(){return KIDS[S.profile]||KIDS.nora;}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

/* ---------- voice ---------- */
function speak(t,force,lang){
  if(!S.profile||!t)return; if(!force&&!S.voice[S.profile])return;
  try{const u=new SpeechSynthesisUtterance(t);u.rate=.95;u.pitch=1.12;if(lang)u.lang=lang;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}
}

/* ---------- audio ---------- */
let AC=null,master=null,musicGain=null,musicTimer=null;
function audio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=S.sound?1:0;master.connect(AC.destination);musicGain=AC.createGain();musicGain.gain.value=0;musicGain.connect(master);}catch(e){}}
  if(AC&&AC.state==='suspended')AC.resume();return AC;}
function tone(f,dur,type,vol,slide,when){if(!AC)return;const t=(when||AC.currentTime);const o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.2,t+.015);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05);}
function noise(dur,vol,freq){if(!AC)return;const b=AC.createBuffer(1,AC.sampleRate*dur,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=freq||1200;const g=AC.createGain();g.gain.value=vol||.3;s.connect(f);f.connect(g);g.connect(master);s.start();}
const SFX={
  tap(){tone(660,.08,'triangle',.15)},
  boing(){tone(220,.25,'sine',.25,520)},
  pop(){tone(300,.12,'square',.08,900);noise(.12,.15,2000)},
  poof(){noise(.5,.35,800);[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.12,0,AC&&AC.currentTime+.08*i))},
  munch(){for(let i=0;i<4;i++)setTimeout(()=>noise(.07,.25,500+Math.random()*400),i*120)},
  stamp(){noise(.15,.5,250);tone(110,.18,'sine',.3,60)},
  place(){tone(392,.1,'triangle',.15);setTimeout(()=>tone(523,.12,'triangle',.15),70)},
  nope(){tone(200,.18,'square',.07,150)},
  giggle(){[880,990,880,1100].forEach((f,i)=>tone(f,.07,'sine',.12,0,AC&&AC.currentTime+i*.07))},
  coin(){[1320,1760,2093].forEach((f,i)=>tone(f,.12,'triangle',.14,0,AC&&AC.currentTime+i*.06))},
  chirp(){const f=rand(2200,3200);tone(f,.07,'sine',.04,f*1.3);setTimeout(()=>tone(f*1.1,.06,'sine',.035,f*.9),90)}
};
/* epic little anthem for the title screen */
const MEL=[[76,1],[79,1],[84,2],[83,1],[81,1],[79,2],[77,1],[79,1],[81,1],[84,1],[79,4],[76,1],[79,1],[84,2],[86,1],[88,1],[86,2],[84,1],[83,1],[81,1],[83,1],[84,4]];
const BASS=[48,48,53,53,55,55,48,48,48,48,53,53,55,55,48,48];
function startMusic(){if(!AC||musicTimer)return;const beat=.22;let t=AC.currentTime+.1,i=0,b=0,bt=t;
  musicGain.gain.cancelScheduledValues(AC.currentTime);musicGain.gain.setTargetAtTime(.5,AC.currentTime,.3);
  const mtof=m=>440*Math.pow(2,(m-69)/12);
  const play=(f,d,type,vol,when)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(vol,when+.02);g.gain.exponentialRampToValueAtTime(.0001,when+d*.95);o.connect(g);g.connect(musicGain);o.start(when);o.stop(when+d);};
  musicTimer=setInterval(()=>{while(t<AC.currentTime+.6){const n=MEL[i%MEL.length];play(mtof(n[0]),n[1]*beat,'square',.06,t);play(mtof(n[0]-12),n[1]*beat,'triangle',.08,t);t+=n[1]*beat;i++;}
    while(bt<AC.currentTime+.6){play(mtof(BASS[b%BASS.length]-12),beat*2,'triangle',.18,bt);bt+=beat*2;b++;}},120);}
function stopMusic(){if(!AC||!musicTimer)return;musicGain.gain.setTargetAtTime(0,AC.currentTime,.4);const m=musicTimer;setTimeout(()=>{clearInterval(m);},1600);musicTimer=null;}

/* ---------- three.js scene ---------- */
const canvas=$('#scene');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.NoToneMapping;
const C=c=>new THREE.Color(c).convertSRGBToLinear();
const scene=new THREE.Scene();scene.background=C('#2f7d3d');
const cam=new THREE.OrthographicCamera(-1,1,1,-1,0.1,300);
const view={x:0,z:.5,zoom:1};
const ISO=new THREE.Vector3(1,1.18,1).normalize().multiplyScalar(60);
function placeCam(){const W=innerWidth,H=innerHeight;const base=(H<520?13:17);const h=base/view.zoom;const a=W/H;
  cam.left=-h*a/2;cam.right=h*a/2;cam.top=h/2;cam.bottom=-h/2;cam.position.set(view.x+ISO.x,ISO.y,view.z+ISO.z);cam.lookAt(view.x,0,view.z);cam.updateProjectionMatrix();}
function resize(){renderer.setSize(innerWidth,innerHeight,false);placeCam();}
addEventListener('resize',resize);

scene.add(new THREE.HemisphereLight(C('#fff6e0'),C('#5d8b5f'),.8));
const sun=new THREE.DirectionalLight(C('#fff3d6'),1.15);sun.position.set(-8,18,6);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-17,right:17,top:17,bottom:-17,near:1,far:60});sun.shadow.bias=-0.0006;sun.shadow.normalBias=0.02;
scene.add(sun);scene.add(sun.target);

const M={};function mat(col,o){const k=col+JSON.stringify(o||{});if(!M[k])M[k]=new THREE.MeshStandardMaterial(Object.assign({color:C(col),roughness:.85,metalness:0},o||{}));return M[k];}
function mesh(g,m,cast,recv){const x=new THREE.Mesh(g,m);x.castShadow=cast!==false;x.receiveShadow=recv!==false;return x;}

/* ground: painted park map */
/* the zoo grows by whole strips of 6 rows on the far side; existing rows 0..19 never move */
const EXPAND_COST=5000,EXPAND_MAX=5;
const rMin=()=>-6*Math.min(EXPAND_MAX,S.expand||0);
function groundTex(rows,rm){const t=Math.floor(1024/GRID),c=document.createElement('canvas');c.width=t*GRID;c.height=t*rows;const x=c.getContext('2d');
  for(let r=0;r<rows;r++)for(let q=0;q<GRID;q++){x.fillStyle=(r+rm+q+400)%2?'#4aa95a':'#44a254';x.fillRect(q*t,r*t,t+1,t+1);}
  for(let i=0;i<130*rows;i++){x.fillStyle=Math.random()<.5?'rgba(255,255,255,.06)':'rgba(20,70,30,.08)';const px=Math.random()*c.width,py=Math.random()*c.height;x.beginPath();x.ellipse(px,py,rand(2,6),rand(1,3),rand(0,3),0,7);x.fill();}
  const tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;tx.anisotropy=4;return tx;}
const outer=mesh(new THREE.PlaneGeometry(90,90),mat('#357f43'),false,true);outer.rotation.x=-Math.PI/2;outer.position.y=-0.02;scene.add(outer);


/* text on a board */
function signTex(text,zone){const w=448,h=128,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#1f3a5f';x.fillRect(0,0,w,h);x.strokeStyle='#fff';x.lineWidth=10;x.strokeRect(5,5,w-10,h-10);
  const cx=72,cy=64;x.save();x.lineCap=x.lineJoin='round';
  if(zone==='savanna'){x.fillStyle='#f4c542';x.beginPath();x.arc(cx,cy,22,0,7);x.fill();x.strokeStyle='#f4c542';x.lineWidth=7;for(let i=0;i<8;i++){const a=i*Math.PI/4;x.beginPath();x.moveTo(cx+Math.cos(a)*31,cy+Math.sin(a)*31);x.lineTo(cx+Math.cos(a)*42,cy+Math.sin(a)*42);x.stroke();}}
  else if(zone==='polar'){x.strokeStyle='#bfe6f5';x.lineWidth=8;for(let i=0;i<3;i++){const a=i*Math.PI/3;x.beginPath();x.moveTo(cx+Math.cos(a)*38,cy+Math.sin(a)*38);x.lineTo(cx-Math.cos(a)*38,cy-Math.sin(a)*38);x.stroke();}}
  else if(zone==='pond'){x.strokeStyle='#5bc0eb';x.lineWidth=8;for(let r=0;r<3;r++){x.beginPath();for(let i=0;i<=4;i++){const px=cx-36+i*18,py=cy-20+r*20+(i%2?-7:7);i?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}}
  else{x.fillStyle='#7cc142';x.beginPath();x.moveTo(cx-30,cy+30);x.bezierCurveTo(cx-34,cy-20,cx+10,cy-40,cx+36,cy-36);x.bezierCurveTo(cx+34,cy+4,cx,cy+34,cx-30,cy+30);x.fill();x.strokeStyle='#1f3a5f';x.lineWidth=5;x.beginPath();x.moveTo(cx-26,cy+26);x.lineTo(cx+22,cy-20);x.stroke();}
  x.restore();x.fillStyle='#fff';x.font='70px "Lilita One", "Arial Rounded MT Bold", sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,(w+128)/2,h*.54);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
function textTex(text,w,h,bg,fg,size){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,w,h);x.strokeStyle='#fff';x.lineWidth=h*.08;x.strokeRect(x.lineWidth/2,x.lineWidth/2,w-x.lineWidth,h-x.lineWidth);
  x.fillStyle=fg;x.font=(size||h*.5)+'px "Lilita One", "Arial Rounded MT Bold", sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,w/2,h*.54);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}

/* ---------- item builders ---------- */
const G={
  post:new THREE.CylinderGeometry(.055,.065,.62,8),rail:new THREE.BoxGeometry(1,.07,.07),
  trunk:new THREE.CylinderGeometry(.07,.11,.55,7),blob:new THREE.IcosahedronGeometry(.4,1),
  cone:new THREE.ConeGeometry(.42,.7,8),sphere:new THREE.SphereGeometry(.1,12,10),pathTile:new THREE.BoxGeometry(.98,.04,.98)
};
function tree(){const g=new THREE.Group();const t=mesh(G.trunk,mat('#8a5a2b'));t.position.y=.27;g.add(t);
  [[0,.75,0,1,'#3fa34d'],[-.18,.62,.12,.7,'#4fb35c'],[.16,.66,-.1,.75,'#36964a']].forEach(b=>{const m=mesh(G.blob,mat(b[4],{flatShading:true}));m.position.set(b[0],b[1],b[2]);m.scale.setScalar(b[3]);g.add(m);});return g;}
function pine(){const g=new THREE.Group();const t=mesh(G.trunk,mat('#8a5a2b'));t.position.y=.2;t.scale.y=.7;g.add(t);
  [[.55,1],[.88,.8],[1.17,.58]].forEach(c=>{const m=mesh(G.cone,mat('#2c8a4b',{flatShading:true}));m.position.y=c[0];m.scale.setScalar(c[1]);g.add(m);});return g;}
function bush(){const g=new THREE.Group();[[-.15,.2,0,.55,'#4fae5d'],[.15,.24,.05,.65,'#3f9c50'],[0,.3,-.12,.5,'#56b864']].forEach(b=>{const m=mesh(G.blob,mat(b[4],{flatShading:true}));m.position.set(b[0],b[1],b[2]);m.scale.setScalar(b[3]);g.add(m);});
  ['#e8573c','#ff6fa8'].forEach((c,i)=>{const s=mesh(G.sphere,mat(c));s.scale.setScalar(.45);s.position.set(i?.2:-.18,.42,.2);g.add(s);});return g;}
function flowers(){const g=new THREE.Group();const cols=['#ff6fa8','#f4c542','#7048e8','#ffffff','#e8573c'];
  for(let i=0;i<7;i++){const a=i*0.9,r=.12+.2*(i%3)/2;const st=mesh(new THREE.CylinderGeometry(.015,.015,.22,4),mat('#3f9c50'));st.position.set(Math.cos(a)*r,.11,Math.sin(a)*r);g.add(st);
    const f=mesh(G.sphere,mat(cols[i%5]));f.scale.set(.8,.5,.8);f.position.set(Math.cos(a)*r,.23,Math.sin(a)*r);g.add(f);}
  const leaf=mesh(new THREE.CylinderGeometry(.42,.42,.03,14),mat('#3f9c50'));leaf.position.y=.015;g.add(leaf);return g;}
function rock(){const g=new THREE.Group();const m=mesh(new THREE.DodecahedronGeometry(.32,0),mat('#9aa7b5',{flatShading:true}));m.scale.set(1.2,.7,1);m.position.y=.18;m.rotation.y=.6;g.add(m);
  const m2=mesh(new THREE.DodecahedronGeometry(.18,0),mat('#8794a2',{flatShading:true}));m2.position.set(.25,.1,.18);g.add(m2);return g;}
function bench(){const g=new THREE.Group();const seat=mesh(new THREE.BoxGeometry(.8,.06,.28),mat('#2c4f7c'));seat.position.y=.3;g.add(seat);
  const back=mesh(new THREE.BoxGeometry(.8,.22,.05),mat('#2c4f7c'));back.position.set(0,.47,-.13);g.add(back);
  [-.33,.33].forEach(x=>{const l=mesh(new THREE.BoxGeometry(.06,.3,.26),mat('#1f3a5f'));l.position.set(x,.15,0);g.add(l);});g.rotation.y=Math.PI/4;return g;}
