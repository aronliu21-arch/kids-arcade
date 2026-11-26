/* ---------- music: synthesized anthem on start and menu screens only ---------- */
const MUS={armed:false,playing:false,timer:null,next:0,step:0,bpm:118,master:null,bus:null,noise:null};
const mhz=m=>440*Math.pow(2,(m-69)/12);
function musGraph(){const c=audio();if(!c)return null;
  if(!MUS.master){MUS.master=c.createGain();MUS.master.gain.value=0;MUS.master.connect(c.destination);MUS.bus=c.createGain();MUS.bus.connect(MUS.master);
    const d=c.createDelay(1);d.delayTime.value=.25;const fb=c.createGain();fb.gain.value=.26;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;
    MUS.bus.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(MUS.master);
    const n=c.createBuffer(1,c.sampleRate,c.sampleRate),ch=n.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;MUS.noise=n;}
  return c;}
function mOsc(c,t,f,dur,type,vol,cut,att){const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);let node=o;
  if(cut){const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(cut,t);o.connect(lp);node=lp;}node.connect(g);g.connect(MUS.bus);const a=att||.015;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.setValueAtTime(vol,t+Math.max(a,dur*.6));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.start(t);o.stop(t+dur+.05);return o;}
function mNoise(c,t,dur,type,freq,vol){const s=c.createBufferSource();s.buffer=MUS.noise;const f=c.createBiquadFilter();f.type=type;f.frequency.value=freq;const g=c.createGain();s.connect(f);f.connect(g);g.connect(MUS.bus);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.start(t);s.stop(t+dur+.05);}
function mKick(c,t,v){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.14);g.gain.setValueAtTime(v||.9,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(MUS.bus);o.start(t);o.stop(t+.32);}
function mSnare(c,t){mNoise(c,t,.18,'bandpass',1800,.4);mOsc(c,t,185,.1,'triangle',.16);}
function mCrash(c,t){mNoise(c,t,1.6,'highpass',4500,.25);}
function mBrass(c,t,notes,dur,vol){notes.forEach(m=>{[-7,7].forEach(dt=>{const o=mOsc(c,t,mhz(m),dur,'sawtooth',vol,1900,.03);o.detune.value=dt;});});}
function mBell(c,t,m){mOsc(c,t,mhz(m),.9,'sine',.06);mOsc(c,t,mhz(m+19),.5,'sine',.02);}
// Pentatonic anthem in D: a nod to lantern-festival melodies, with a marching beat.
const MCH=[[62,66,69],[59,62,66],[55,59,62],[57,61,64]],MBASS=[38,35,31,33];
const MMEL=[[74,null,76,78,null,81,78,null],[76,null,74,null,71,null,74,null],[69,null,71,74,null,76,74,71],[69,null,null,null,76,null,74,null]];
function musStep(c,t,s){
  const bar=(s>>3)&7,b=s&7,ci=bar&3,full=bar>=4,st=60/MUS.bpm/2;
  if(b===0)mBrass(c,t,MCH[ci],full?st*1.6:st*7.6,full?.03:.02);
  if(full&&(b===3||b===6))mBrass(c,t,MCH[ci],st*1.3,.028);
  if(bar>=1)mOsc(c,t,mhz(MBASS[ci]),st*.9,'sawtooth',.14,420);
  if(bar>=2)mNoise(c,t,.04,'highpass',7000,b%2?.05:.09);
  if(!full){if(b%4===0)mKick(c,t,.6);if(b===0)mBell(c,t,74+ci*0);}
  else{if(b===0||b===4)mKick(c,t);if(b===2||b===6)mSnare(c,t);if(b===0&&bar===4)mCrash(c,t);
    const m=MMEL[ci][b];if(m){let len=1;while(b+len<8&&MMEL[ci][b+len]===null)len++;mOsc(c,t,mhz(m),st*len*.92,'square',.06,2600,.02);mOsc(c,t,mhz(m+12),st*len*.92,'triangle',.025,4000,.02);}}
}
function musTick(){const c=audio();if(!c)return;while(MUS.next<c.currentTime+.15){musStep(c,MUS.next,MUS.step);MUS.next+=60/MUS.bpm/2;MUS.step=(MUS.step+1)%64;}}
function musicStart(){if(MUS.playing)return;const c=musGraph();if(!c)return;MUS.playing=true;MUS.step=0;MUS.next=c.currentTime+.08;
  const g=MUS.master.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(.22,c.currentTime+.4);MUS.timer=setInterval(()=>{try{musTick();}catch(e){}},25);}
function musicStop(){if(!MUS.playing)return;MUS.playing=false;clearInterval(MUS.timer);const c=audio();
  if(c&&MUS.master){const g=MUS.master.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(0,c.currentTime+.5);}}
function musicSync(){const want=DB.sound&&MUS.armed&&(screen==='home'||screen==='map'||screen==='cal');if(want)musicStart();else musicStop();}
function musicHit(){if(!MUS.playing)return;const c=audio();if(!c)return;const t=c.currentTime+.01;mCrash(c,t);mKick(c,t,1);mBrass(c,t,[50,62,66,69],1.2,.035);}
function musicFanfare(){if(!MUS.playing)return;const c=audio();if(!c)return;const t=c.currentTime+.02;mCrash(c,t);[74,78,81,86].forEach((m,i)=>mBrass(c,t+i*.12,[m],.5,.045));mBrass(c,t+.5,[62,66,69,74],1.6,.035);mKick(c,t+.5,1);}
document.addEventListener('pointerdown',()=>{if(!MUS.armed){MUS.armed=true;audio();musicSync();}},true);

/* ---------- cloud save: progress follows the signed-in account across the MacBook, iPhone and iPad ---------- */
var CLOUD={doc:null,busy:false,again:false,timer:null};
function cloudSave(){if(!CLOUD.doc)return;clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(cloudPush,600);}
async function cloudPush(){if(!CLOUD.doc)return;if(CLOUD.busy){CLOUD.again=true;return;}CLOUD.busy=true;
  try{await CLOUD.doc.set({v:1,data:JSON.stringify(DB),at:Date.now()});}catch(e){}CLOUD.busy=false;if(CLOUD.again){CLOUD.again=false;cloudPush();}}
function mergeKid(a,b){if(!a)return b;if(!b)return a;const ra=a.rev||0,rb=b.rev||0;if(rb>ra)return b;if(ra>rb)return a;
  const out=Object.assign({},a,{stars:Object.assign({},a.stars||{}),seen:(a.seen||[]).slice()});const bs=b.stars||{};for(const k in bs)out.stars[k]=Math.max(out.stars[k]||0,bs[k]||0);
  (b.seen||[]).forEach(id=>{if(out.seen.indexOf(id)<0)out.seen.push(id);});return out;}
async function cloudInit(){
  try{if(!window.claude||typeof window.claude.use!=='function')return;
    const res=await Promise.all([window.claude.use('db'),window.claude.use('user')]);const db=res[0],user=res[1];if(!db||!user)return;
    const uid=await user.id();if(!uid)return;const doc=db.doc('data/users/'+uid+'/progress');const snap=await doc.get();
    if(snap.exists){let remote={};try{remote=JSON.parse((snap.data()||{}).data||'{}')||{};}catch(e){}const rp=remote.p||{};
      Object.keys(Object.assign({},DB.p,rp)).forEach(id=>{const m=mergeKid(DB.p[id],rp[id]);if(m)DB.p[id]=m;});}
    CLOUD.doc=doc;try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){}cloudPush();
    if(screen==='home')renderHome();else if(screen==='map'&&cur)renderMap();
  }catch(e){}
}

/* ---------- automated playtest hook. Harmless for players. ---------- */
window.__test={
  state:()=>({screen:screen,round:qi+1,done:screen==='result',q:qs[qi]&&qs[qi].id}),
  solve:()=>{if(screen!=='play')return;const q=qs[qi];if(answered){$('next').click();return;}
    if(q.set){clockState.t=(q.set.h%12)*60+q.set.m;checkSet();}else{const b=[...document.querySelectorAll('.opt')].find(x=>x.dataset.ok);b&&b.click();}},
  miss:()=>{const b=[...document.querySelectorAll('.opt')].find(x=>!x.dataset.ok&&!x.classList.contains('bad'));b&&b.click();},
  setToday:d=>{TODAY=day0(new Date(d));}
};

/* ---------- boot ---------- */
$('soundBtn').setAttribute('aria-pressed',String(DB.sound));$('soundBtn').textContent=DB.sound?'🔊':'🔇';
fitIntro();renderHome();show('home');requestAnimationFrame(introFrame);cloudInit();
