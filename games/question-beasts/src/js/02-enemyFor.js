function enemyFor(stage){if(stage<=6)return{...ENEMIES[stage-1]};const e=ENEMIES[R(5)];return{...e,name:'WILD '+e.name,hp:120+(stage-6)*15}}
const levelOf=xp=>1+Math.floor(xp/100);
const formOf=xp=>{const l=levelOf(xp);return l>=10?2:l>=5?1:0};

/* ================= save (device + Claude account) ================= */
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const Save={
  KEY:'question-beasts-v1',data:{kids:{}},ref:null,busy:false,dirty:false,
  kid(k){const r=this.data.kids[k]||(this.data.kids[k]={xp:0,cleared:0,seen:[],right:0,wrong:0,starter:null});for(const f of ['xp','cleared','right','wrong'])if(!Number.isFinite(r[f]))r[f]=num(r[f]);if(!Array.isArray(r.seen))r.seen=[];return r},
  load(){try{const s=JSON.parse(localStorage.getItem(this.KEY)||'null');if(s&&s.kids)this.data=s}catch(e){}},
  merge(o){if(!o||!o.kids)return;for(const k in o.kids){const a=this.kid(k),b=o.kids[k]||{};
    if(!STARTERS[a.starter]&&STARTERS[b.starter])a.starter=b.starter;
    a.xp=Math.max(num(a.xp),num(b.xp));a.story=Math.max(num(a.story),num(b.story));if(!a.qset&&b.qset)a.qset=b.qset;
    a.cleared=Math.max(num(a.cleared),num(b.cleared));a.right=Math.max(num(a.right),num(b.right));a.wrong=Math.max(num(a.wrong),num(b.wrong));
    a.seen=[...new Set([...(Array.isArray(b.seen)?b.seen:[]),...a.seen])];
    a.starsEarned=Math.max(num(a.starsEarned),num(b.starsEarned));a.starsSpent=Math.max(num(a.starsSpent),num(b.starsSpent));
    a.owned=[...new Set([...(Array.isArray(b.owned)?b.owned:[]),...(Array.isArray(a.owned)?a.owned:[])])];if(!a.equip&&b.equip)a.equip=b.equip;
    /* one-time reset sent by Claude. The saved copy already holds the reset values plus any progress made since,
       so a device that hasn't seen this reset yet simply adopts the saved copy (never re-zeroes it). */
    if(b.forceId&&b.forceId!==a.forceId){
      a.xp=num(b.xp);a.cleared=num(b.cleared);a.right=num(b.right);a.wrong=num(b.wrong);a.story=num(b.story);
      a.starter=STARTERS[b.starter]?b.starter:null;a.seen=Array.isArray(b.seen)?[...b.seen]:[];
      a.starsEarned=num(b.starsEarned);a.starsSpent=num(b.starsSpent);a.owned=Array.isArray(b.owned)?[...b.owned]:[];a.equip=b.equip||{};
      a.forceId=b.forceId}
    if(!KIDS[k]?.noRepeat)a.seen=a.seen.slice(-40)}},
  save(){try{localStorage.setItem(this.KEY,JSON.stringify(this.data))}catch(e){}if(this.ref){this.dirty=true;this.flush()}},
  async flush(){if(this.busy)return;this.busy=true;while(this.dirty){this.dirty=false;try{await this.ref.set(JSON.parse(JSON.stringify(this.data)))}catch(e){}}this.busy=false},
  async connect(){try{
    if(!window.claude||typeof claude.use!=='function')return;
    const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);if(!db||!user)return;
    const id=await user.id();if(!id)return;
    const ref=db.collection('data/users/'+id).doc('progress');const snap=await ref.get();
    const remote=snap.exists?snap.data():null;const before=JSON.stringify(remote);
    if(remote)this.merge(JSON.parse(JSON.stringify(remote)));
    this.ref=ref;$('#syncLabel').textContent='Progress saves to your Claude account';
    if(JSON.stringify(this.data)!==before)this.save();
    if(!$('#home').hidden)renderHome();if(!$('#world').hidden)renderWorld();
  }catch(e){}}
};

/* ================= audio ================= */
let AC=null,soundOn=true,musicOn=true;
function ac(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}return AC}
function tone({type='square',f1=440,f2=f1,dur=.15,vol=.1,delay=0,dest}){if(!soundOn&&!dest)return;const a=ac();if(!a)return;const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();
  o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(f2,20),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g).connect(dest||a.destination);o.start(t);o.stop(t+dur+.05)}
function noise({dur=.2,vol=.2,delay=0,lp=2000}){if(!soundOn)return;const a=ac();if(!a)return;const t=a.currentTime+delay,len=Math.floor(a.sampleRate*dur),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=a.createBufferSource();s.buffer=buf;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;const g=a.createGain();g.gain.value=vol;s.connect(f).connect(g).connect(a.destination);s.start(t)}
const Sfx={
  tap(){tone({f1:880,dur:.05,vol:.06})},
  shoot(){tone({f1:1200,f2:200,dur:.22})},
  hit(){noise({dur:.25,vol:.25,lp:3000});tone({f1:180,f2:50,dur:.2,vol:.14})},
  crit(){[988,1319,1760].forEach((f,i)=>tone({f1:f,dur:.08,delay:i*.06}))},
  ult(){for(let i=0;i<6;i++)tone({f1:300+i*150,f2:1500,dur:.12,delay:i*.06});noise({dur:.8,vol:.3,lp:1500,delay:.4});tone({f1:120,f2:40,dur:.7,vol:.2,delay:.4})},
  zap(){noise({dur:.15,vol:.25,lp:6000});tone({type:'sawtooth',f1:1600,f2:100,dur:.18,vol:.08})},
  boom(){noise({dur:.35,vol:.35,lp:900});tone({f1:110,f2:35,dur:.35,vol:.2})},
  wrong(){tone({f1:330,f2:300,dur:.15});tone({f1:220,f2:200,dur:.25,delay:.15})},
  fizzle(){tone({type:'triangle',f1:500,f2:80,dur:.4,vol:.12})},
  block(){tone({f1:1500,dur:.06,vol:.08});tone({f1:2000,dur:.12,vol:.06,delay:.06})},
  swish(){noise({dur:.15,vol:.2,lp:7000});tone({type:'sawtooth',f1:900,f2:300,dur:.12,vol:.05})},
  roar(){tone({type:'sawtooth',f1:150,f2:70,dur:.5,vol:.12});noise({dur:.5,vol:.15,lp:500})},
  water(){noise({dur:.5,vol:.18,lp:1200});tone({type:'sine',f1:300,f2:700,dur:.3,vol:.08})},
  crack(){noise({dur:.12,vol:.3,lp:4000});tone({f1:90,f2:40,dur:.3,vol:.15,delay:.2})},
  whoosh(){noise({dur:.7,vol:.18,lp:1800});tone({type:'triangle',f1:200,f2:900,dur:.6,vol:.06})},
  fire(){noise({dur:.6,vol:.22,lp:2500});tone({type:'sawtooth',f1:200,f2:600,dur:.4,vol:.05})},
  twinkle(){tone({type:'sine',f1:1800+R(800),dur:.12,vol:.06})},
  beam(){tone({type:'sawtooth',f1:300,f2:1200,dur:.45,vol:.06});noise({dur:.45,vol:.1,lp:5000})},
  win(){[523,659,784,1047,784,1047].forEach((f,i)=>tone({f1:f,dur:.12,delay:i*.1}))},
  lose(){[392,330,262,196].forEach((f,i)=>tone({type:'triangle',f1:f,dur:.25,vol:.12,delay:i*.18}))},
  level(){[523,659,784,1047,1319,1568].forEach((f,i)=>tone({f1:f,dur:.1,vol:.08,delay:i*.07}))}
};
const midi=m=>440*Math.pow(2,(m-69)/12);
const TRACKS={
  adventure:{bpm:132,wave:'square',vol:.025,mel:[72,0,76,0,79,0,76,0,74,0,77,0,81,0,77,0,72,0,76,0,79,0,84,0,83,0,79,0,74,0,0,0],bass:[48,0,0,0,55,0,0,0,50,0,0,0,57,0,0,0,45,0,0,0,52,0,0,0,43,0,0,0,50,0,0,0]},
  bounce:{bpm:142,wave:'square',vol:.022,mel:[67,0,71,0,74,0,71,74,76,0,74,0,71,0,67,0,69,0,72,0,76,0,72,76,74,0,71,0,67,0,0,0],bass:[43,0,50,0,43,0,50,0,40,0,47,0,40,0,47,0,36,0,43,0,36,0,43,0,38,0,45,0,38,0,45,0]},
  mystery:{bpm:108,wave:'triangle',vol:.06,mel:[69,0,0,72,0,0,71,0,69,0,0,64,0,0,0,0,65,0,0,69,0,0,67,0,64,0,0,0,0,0,0,0],bass:[45,0,52,0,45,0,52,0,41,0,48,0,41,0,48,0,43,0,50,0,43,0,50,0,40,0,47,0,40,0,47,0]},
  space:{bpm:124,wave:'square',vol:.016,mel:[72,76,79,84,79,76,72,76,71,74,79,83,79,74,71,74,69,72,76,81,76,72,69,72,65,69,72,77,72,69,65,69],bass:[48,0,0,0,48,0,0,0,43,0,0,0,43,0,0,0,45,0,0,0,45,0,0,0,41,0,0,0,41,0,0,0]},
  race:{bpm:160,wave:'sawtooth',vol:.014,mel:[74,0,77,0,81,0,77,0,79,0,76,0,72,0,76,0,74,77,82,0,81,0,77,0,76,0,73,0,69,0,0,0],bass:[38,0,50,0,38,0,50,0,36,0,48,0,36,0,48,0,34,0,46,0,34,0,46,0,33,0,45,0,33,0,45,0]},
  boss:{bpm:150,wave:'square',vol:.025,mel:[69,0,72,69,76,0,75,0,74,0,72,0,71,0,68,0,69,0,72,69,77,0,76,0,74,72,71,0,68,0,64,0],bass:[45,0,45,0,45,0,45,0,41,0,41,0,41,0,41,0,40,0,40,0,40,0,40,0,44,0,44,0,40,0,40,0]}
};
const TRACK_ORDER=['adventure','bounce','mystery','space','race'];
const Music={timer:null,step:0,next:0,track:null,gain:null,
  start(name){this.stop();if(!musicOn||!soundOn)return;const a=ac();if(!a)return;this.track=TRACKS[name];this.step=0;this.next=a.currentTime+.1;
    this.gain=a.createGain();this.gain.gain.value=1;this.gain.connect(a.destination);
    this.timer=setInterval(()=>this.tick(),40)},
  tick(){const a=AC,T=this.track,dt=60/T.bpm/4;
    /* the browser slowed our timer (tab in background, busy frame): skip the missed notes instead of playing them all at once */
    if(this.next<a.currentTime-.05){const miss=Math.ceil((a.currentTime-this.next)/dt);this.step+=miss;this.next+=miss*dt}
    let n=0;while(this.next<a.currentTime+.2&&n++<8){const m=T.mel[this.step%32],b=T.bass[this.step%32];
    if(m)tone({type:T.wave||'square',f1:midi(m),dur:dt*1.6,vol:T.vol||.025,delay:this.next-a.currentTime,dest:this.gain});
    if(b)tone({type:'triangle',f1:midi(b),dur:dt*3,vol:.07,delay:this.next-a.currentTime,dest:this.gain});
    this.next+=dt;this.step++}},
  stop(){clearInterval(this.timer);this.timer=null;try{this.gain&&this.gain.disconnect()}catch(e){}this.gain=null}
};
const Speech={voices:[],
  init(){if(!('speechSynthesis' in window))return;const load=()=>{try{this.voices=speechSynthesis.getVoices()}catch(e){}};load();try{speechSynthesis.onvoiceschanged=load}catch(e){}},
  zh(){return this.voices.some(v=>/^zh/i.test(v.lang))},
  utt(text,lang){const u=new SpeechSynthesisUtterance(text);u.lang=lang;const v=this.voices.find(v=>v.lang.replace('_','-')===lang)||this.voices.find(v=>v.lang.slice(0,2)===lang.slice(0,2));if(v)u.voice=v;u.rate=lang.startsWith('zh')?.7:.9;return u},
  say(text,lang='en-US'){try{if(!('speechSynthesis' in window))return;speechSynthesis.cancel();speechSynthesis.speak(this.utt(text,lang))}catch(e){}},
  seq(list){try{if(!('speechSynthesis' in window))return;speechSynthesis.cancel();list.forEach(([t,l])=>{if(t)speechSynthesis.speak(this.utt(t,l||'en-US'))})}catch(e){}}
};

/* ================= questions ================= */
/* Every question: {id, text, answer, choices[3], how:[steps], kind?, pic?, picHTML?, say?, sayZh?, big?} */
function mk(id,text,answer,choices,extra={}){return Object.assign({id,text,answer:String(answer),choices:choices.map(String),how:[]},extra)}
function numOpts(ans,spread=4,min=0){const s=new Set([ans]);let g=0;while(s.size<3&&g++<200){const v=ans+RI(1,spread)*(Math.random()<.5?-1:1);if(v>=min)s.add(v)}let k=1;while(s.size<3)s.add(ans+10*k++);return shuffle([...s])}
const range=(a,b)=>{const r=[];for(let i=a;i<=b;i++)r.push(i);return r};
const cap=s=>s[0].toUpperCase()+s.slice(1);
const LET='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
function letterOpts(L){const s=new Set([L]);while(s.size<3)s.add(pick(LET));return shuffle([...s])}
const NUMW=['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
function uniq3(arr,ans,step=1){const s=new Set(arr.map(String));let k=1;while(s.size<3){s.add(String(Number(String(ans).replace(/[^\d.]/g,''))+step*k)+(String(ans).match(/[^\d.]+$/)||[''])[0]);k++}return shuffle([...s].slice(0,3))}
function pick3(ans,pool){return shuffle([ans,...shuffle(pool.filter(x=>x!==ans)).slice(0,2)])}
const cname=v=>String(v).replace('-',' ');

/* ---------- worked-solution helpers ---------- */
const PLACES=['ones','tens','hundreds','thousands'];
const digs=n=>String(n).split('').reverse().map(Number);
function howAdd(a,b){const s=a+b;
  if(a<10&&b<10){const big=Math.max(a,b),sm=Math.min(a,b);
    if(s>10){const need=10-big;return[`Make a 10 first: ${big} + ${need} = 10.`,`${sm} − ${need} = ${sm-need} is left.`,`10 + ${sm-need} = ${s}.`]}
    return[`Start at the bigger number: ${big}.`,`Count up ${sm}: ${range(big+1,s).join(', ')}.`,`${a} + ${b} = ${s}.`]}
  if(a<=20&&b<10&&a+b<=20)return[`Start at ${a}.`,`Count up ${b}: ${range(a+1,s).join(', ')}.`,`${a} + ${b} = ${s}.`];
  const A=digs(a),B=digs(b),n=Math.max(A.length,B.length),st=[];let c=0;
  for(let i=0;i<n;i++){const x=A[i]||0,y=B[i]||0,t=x+y+c;st.push(`${cap(PLACES[i])}: ${x} + ${y}${c?' + 1 carried':''} = ${t}${t>=10?` → write ${t%10}, carry 1`:''}.`);c=t>=10?1:0}
  if(c)st.push('Write the carried 1 in front.');st.push(`${a} + ${b} = ${s}.`);return st}
function howSub(a,b){const r=a-b;
  if(a<=20)return[`Think addition: ${b} + ? = ${a}.`,`Count up from ${b} to ${a}: that is ${r} steps.`,`${a} − ${b} = ${r}.`];
  const A=digs(a),B=digs(b),st=[];let br=0;
  for(let i=0;i<A.length;i++){let x=A[i]-br;const y=B[i]||0,lent=br;
    if(x<y){st.push(`${cap(PLACES[i])}: ${x}${lent?` (was ${A[i]}, lent 1)`:''} is less than ${y}, so borrow 1 from the ${PLACES[i+1]}: ${x+10} − ${y} = ${x+10-y}.`);br=1}
    else{if(i<B.length||lent)st.push(`${cap(PLACES[i])}: ${x}${lent?` (was ${A[i]}, lent 1)`:''} − ${y} = ${x-y}.`);br=0}}
  st.push(`${a} − ${b} = ${r}.`);return st}
