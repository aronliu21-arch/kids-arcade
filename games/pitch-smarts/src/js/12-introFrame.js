window.addEventListener('resize',fitIntro);
function introFrame(now){
  if(!$('home').hidden&&ic.width){
    if(IT.state==='wait')IT.t0=now;
    const t=(now-IT.t0)/1000,sc=ic.width/IW;
    ix.setTransform(sc,0,0,sc,0,0);
    if(IT.state==='run'&&t>=IT.T)IT.state='ready';
    const ru=Math.min(1,t/IT.T),ex=1-(1-ru)*(1-ru);
    const blend=Math.max(0,Math.min(1,(t-IT.T)/.25));
    const kicked=IT.state==='kicked'||IT.state==='goal';
    introBg(now,IT.state==='ready'?blend:(kicked?Math.max(0,1-(now-IT.kick)/400):0));
    let bx=401,by=251,spin=0;
    if(kicked){
      const u=Math.min(1,(now-IT.kick)/750),tx=IT.winner===0?748:52;
      bx=401+(tx-401)*u;by=251-Math.sin(u*Math.PI)*120-u*38;spin=u*14*(IT.winner?-1:1);
      if(u>=1&&IT.state==='kicked'){
        IT.state='goal';IT.goal=now;sfx.good();musicFanfare();
        const cols=['#ffd43b','#ff6b6b','#4dabf7','#69db7c','#f783ac','#ffffff'];
        for(let i=0;i<70;i++){const a=rnd(0,6.283),sp=rnd(120,440);IT.parts.push({x:tx,y:200,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-200,c:pick(cols),life:rnd(1,1.8),r:rnd(3,6)});}
      }
    }
    const heads=[];
    KIDS.forEach((k,i)=>{
      const x=k.x0+(k.x1-k.x0)*ex;
      let A,ph=t*GAIT+k.ph0,yell=.5;
      if(IT.state==='run'||IT.state==='wait'){A=runA(ph);yell=.45+Math.sin(ph)*.2;}
      else if(IT.state==='ready'){ph=IT.T*GAIT+k.ph0;A=lerpA(runA(ph),KICK,blend);A.bob+=Math.sin(now/240+i)*1.2*blend;yell=.6+.4*blend;}
      else{ph=IT.T*GAIT+k.ph0;const v=Math.min(1,(now-IT.kick)/180);A=lerpA(KICK,i===IT.winner?FOLLOW:WHIFF,v);yell=i===IT.winner?1:.25;}
      heads.push(drawRunner(k,x,A,ph,yell,IT.state==='run'));
    });
    ix.fillStyle='rgba(0,0,0,.22)';ix.beginPath();ix.ellipse(bx,264,9,3,0,0,6.283);ix.fill();
    paintBall(ix,bx,by,12,spin,2.5);
    if(kicked&&now-IT.kick<240){const f=(now-IT.kick)/240;ix.fillStyle='rgba(255,255,255,'+(1-f)+')';ix.beginPath();ix.arc(401,251,10+f*60,0,6.283);ix.fill();}
    if(IT.state==='wait')introPill('\u25b6  Tap to start',IW/2,150,'#ffd43b',OUT,30+Math.sin(now/220)*2);
    if(IT.state==='ready'&&blend>=1){
      introPill('Nora',heads[0].x,heads[0].y-26,'#ffc61a','#1c4fd6',21);
      introPill('Lucas',heads[1].x,heads[1].y-26,'#1c7ed6','#fff',21);
      introPill('Tap to kick! \u26bd',IW/2,38,'#fff',OUT,25+Math.sin(now/200)*1.5);
    }
    if(IT.state==='goal'){
      const g=Math.min(1,(now-IT.goal)/300),W2=KIDS[IT.winner];
      ix.save();ix.translate(400,100);ix.scale(.6+g*.4,.6+g*.4);ix.rotate(-.05);
      ix.font='700 66px Fredoka,system-ui,sans-serif';ix.textAlign='center';ix.lineJoin='round';
      ix.lineWidth=10;ix.strokeStyle=OUT;ix.strokeText('GOAL!',0,0);ix.fillStyle='#ffd43b';ix.fillText('GOAL!',0,0);
      ix.restore();
      if(now-IT.goal>2600)introPill('Now pick your player \u2b07',IW/2,38,'#fff',OUT,23);
      else if(now-IT.goal>500)introPill(W2.name+' scores!',400,38,W2.kit.shirt,W2.kit.num,27);
    }
    const dt=1/60;
    for(let i=IT.parts.length-1;i>=0;i--){
      const p=IT.parts[i];p.life-=dt;if(p.life<=0){IT.parts.splice(i,1);continue;}
      p.vy+=700*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;ix.fillStyle=p.c;ix.fillRect(p.x,p.y,p.r*1.6,p.r);
    }
  }
  requestAnimationFrame(introFrame);
}
ic.addEventListener('pointerdown',()=>{
  audio();const now=performance.now();
  if(IT.state==='wait'){IT.state='run';IT.t0=now;musicSync();return;}
  if(IT.state==='run'){IT.t0=now-(IT.T+.3)*1000;IT.state='ready';return;}
  if(IT.state==='ready'){
    IT.winner=(typeof DB.introWin==='number')?DB.introWin:1;
    DB.introWin=1-IT.winner;store.save();
    IT.state='kicked';IT.kick=now;sfx.kick();musicHit();return;
  }
  if(IT.state==='goal'&&now-IT.goal>1500){IT.state='run';IT.t0=now;IT.goal=0;IT.parts.length=0;}
});

/* ---------- music (synthesized live, no audio files) ---------- */
const MUS={armed:false,playing:false,timer:null,next:0,step:0,bpm:124,master:null,bus:null,noise:null};
const mhz=m=>440*Math.pow(2,(m-69)/12);
function musGraph(){
  const c=audio();if(!c)return null;
  if(!MUS.master){
    MUS.master=c.createGain();MUS.master.gain.value=0;MUS.master.connect(c.destination);
    MUS.bus=c.createGain();MUS.bus.connect(MUS.master);
    const d=c.createDelay(1);d.delayTime.value=.24;const fb=c.createGain();fb.gain.value=.28;
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;
    MUS.bus.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(MUS.master);
    const n=c.createBuffer(1,c.sampleRate,c.sampleRate),ch=n.getChannelData(0);
    for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;
    MUS.noise=n;
  }
  return c;
}
function mOsc(c,t,f,dur,type,vol,cut,att){
  const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  let node=o;if(cut){const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(cut,t);o.connect(lp);node=lp;}
  node.connect(g);g.connect(MUS.bus);
  const a=att||.015;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+a);
  g.gain.setValueAtTime(vol,t+Math.max(a,dur*.6));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.start(t);o.stop(t+dur+.05);return o;
}
function mNoise(c,t,dur,type,freq,vol){
  const s=c.createBufferSource();s.buffer=MUS.noise;
  const f=c.createBiquadFilter();f.type=type;f.frequency.value=freq;const g=c.createGain();
  s.connect(f);f.connect(g);g.connect(MUS.bus);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.start(t);s.stop(t+dur+.05);
}
function mKick(c,t,v){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);g.gain.setValueAtTime(v||.9,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+.32);}
function mTom(c,t,f,v){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.6,t+.35);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.45);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+.5);}
function mSnare(c,t){mNoise(c,t,.18,'bandpass',1800,.45);mOsc(c,t,185,.1,'triangle',.18);}
function mCrash(c,t){mNoise(c,t,1.8,'highpass',4500,.28);}
function mBrass(c,t,notes,dur,vol){notes.forEach(m=>{[-7,7].forEach(dt=>{const o=mOsc(c,t,mhz(m),dur,'sawtooth',vol,1900,.03);o.detune.value=dt;});});}
const MCH=[[62,65,69],[58,62,65],[60,65,69],[60,64,67]],MBASS=[38,34,41,36];
const MMEL=[[69,null,74,null,76,77,null,76],[74,null,null,null,77,null,74,null],[72,null,77,null,79,81,null,79],[76,null,null,null,79,77,76,72]];
function musStep(c,t,s){
  const bar=(s>>3)&7,b=s&7,ci=bar&3,full=bar>=4,st=60/MUS.bpm/2;
  if(b===0)mBrass(c,t,MCH[ci],full?st*1.6:st*7.6,full?.035:.022);
  if(full&&(b===3||b===6))mBrass(c,t,MCH[ci],st*1.4,.032);
  if(bar>=1)mOsc(c,t,mhz(MBASS[ci]),st*.9,'sawtooth',.16,420);
  if(bar>=2)mNoise(c,t,.04,'highpass',7000,b%2?.06:.1);
  if(!full){
    if(b%4===0)mTom(c,t,95,.55);
    if(bar===3&&b%2===1)mTom(c,t,130,.4);
    if(bar===3&&b>=4)mSnare(c,t);
  }else{
    if(b===0||b===4)mKick(c,t);
    if(b===2||b===6)mSnare(c,t);
    if(b===0&&bar===4)mCrash(c,t);
    const m=MMEL[ci][b];
    if(m){let len=1;while(b+len<8&&MMEL[ci][b+len]===null)len++;
      mOsc(c,t,mhz(m),st*len*.92,'square',.07,2600,.02);mOsc(c,t,mhz(m+12),st*len*.92,'triangle',.03,4000,.02);}
  }
}
function musTick(){
  const c=audio();if(!c)return;
  while(MUS.next<c.currentTime+.15){musStep(c,MUS.next,MUS.step);MUS.next+=60/MUS.bpm/2;MUS.step=(MUS.step+1)%64;}
}
function musicStart(){
  if(MUS.playing)return;const c=musGraph();if(!c)return;
  MUS.playing=true;MUS.step=0;MUS.next=c.currentTime+.08;
  const g=MUS.master.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(.24,c.currentTime+.4);
  MUS.timer=setInterval(()=>{try{musTick();}catch(e){}},25);
}
function musicStop(){
  if(!MUS.playing)return;MUS.playing=false;clearInterval(MUS.timer);
  const c=audio();
  if(c&&MUS.master){const g=MUS.master.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(0,c.currentTime+.35);}
}
function musicSync(){
  const want=DB.sound&&MUS.armed&&(!$('home').hidden||!$('map').hidden);
  if(want)musicStart();else musicStop();
}
function musicHit(){
  if(!MUS.playing)return;const c=audio();if(!c)return;const t=c.currentTime+.01;
  mCrash(c,t);mTom(c,t,80,.8);mKick(c,t,1);mBrass(c,t,[50,62,65,69],1.2,.04);
}
function musicFanfare(){
  if(!MUS.playing)return;const c=audio();if(!c)return;const t=c.currentTime+.02;
  mCrash(c,t);[74,78,81,86].forEach((m,i)=>mBrass(c,t+i*.12,[m],.5,.05));
  mBrass(c,t+.5,[62,66,69,74],1.6,.04);mKick(c,t+.5,1);
}
document.addEventListener('pointerdown',()=>{if(!MUS.armed){MUS.armed=true;audio();musicSync();}},true);

requestAnimationFrame(introFrame);

/* ---------- cloud save: progress kept in the signed-in Claude account, so it survives reloads and syncs devices ---------- */
var CLOUD={doc:null,busy:false,again:false,timer:null,state:'off'};
function cloudSave(){if(!CLOUD.doc)return;clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(cloudPush,600);}
async function cloudPush(){
  if(!CLOUD.doc)return;
  if(CLOUD.busy){CLOUD.again=true;return;}
  CLOUD.busy=true;
  try{await CLOUD.doc.set({v:1,data:JSON.stringify(DB),at:Date.now()});CLOUD.state='saved';}catch(e){CLOUD.state='error';}
  CLOUD.busy=false;
  if(CLOUD.again){CLOUD.again=false;cloudPush();}
}
function mergeKid(a,b){
  if(!a)return b;if(!b)return a;
  const ra=a.rev||0,rb=b.rev||0;
  if(rb>ra)return b;if(ra>rb)return a;
  const out=Object.assign({},a,{stars:Object.assign({},a.stars||{}),seen:(a.seen||[]).slice()});
  const bs=b.stars||{};for(const k in bs)out.stars[k]=Math.max(out.stars[k]||0,bs[k]||0);
  (b.seen||[]).forEach(id=>{if(out.seen.indexOf(id)<0)out.seen.push(id);});
  return out;
}
function edgeSafe(){document.documentElement.classList.add('edgeSafe');setTimeout(()=>window.dispatchEvent(new Event('resize')),60);}
async function cloudInit(){
  try{
    const isIPad=/iPad/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    if(isIPad){edgeSafe();return;}
    if(!window.claude||typeof window.claude.use!=='function')return;
    const res=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
    const db=res[0],user=res[1];
    if(!db||!user){edgeSafe();return;}
    const uid=await user.id();if(!uid){edgeSafe();return;}
    const doc=db.doc('data/users/'+uid+'/progress');
    const snap=await doc.get();
    if(snap.exists){
      let remote={};try{remote=JSON.parse((snap.data()||{}).data||'{}')||{};}catch(e){}
      const rp=remote.p||{};DB.p=DB.p||{};
      Object.keys(Object.assign({},DB.p,rp)).forEach(id=>{const m=mergeKid(DB.p[id],rp[id]);if(m)DB.p[id]=m;});
      if(typeof remote.introWin==='number')DB.introWin=remote.introWin;
    }
    CLOUD.doc=doc;CLOUD.state='on';
    try{localStorage.setItem('pitchSmarts.v1',JSON.stringify(DB));}catch(e){}
    cloudPush();
    if(!$('home').hidden)renderHome();else if(!$('map').hidden&&cur)renderMap();
  }catch(e){CLOUD.state='error';}
}
cloudInit();

renderHome();
