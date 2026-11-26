const STRAT=['✏️ 畫圖','📋 一個一個列出來','🔁 找規律','⏪ 倒著想','🧪 假設試試看','➗ 列算式'];
function sents(t,en){return t.split(en?/(?<=[?!.])\s+(?=[A-Z“])/:/(?<=[。？！])/).filter(Boolean).map(s=>`<span class="sent" tabindex="0" role="button">${s}</span>`).join(en?' ':'');}
function favStrat(){const s=S.strat||{};const k=Object.keys(s).sort((a,b)=>s[b]-s[a])[0];return k!==undefined?`<p class="lead" data-say="zh">你最常用的魔法方法：${STRAT[k].split(' ')[1]}</p>`:'';}
const L='ABCDE';
const KEY='nora-detective-v1';
let S={solved:[],stars:0,idx:0};
const MIG5=x=>{if(x&&!x.seenv){x.seen=[...new Set([...(x.seen||[]),...(x.solved||[]).filter(i=>i!==7&&CASES[i]).map(i=>CASES[i].title)])];x.seenv=true;}return x;};
const MIG3=x=>{if(x&&!x.b1v3){x.solved=(x.solved||[]).filter(i=>i>=7);if(x.log)for(let k=0;k<7;k++)delete x.log['case:'+k];if((x.idx||0)<7)x.idx=0;x.b1v3=true;}return x;};
const MIG=x=>{if(x&&!x.b1v2){x.solved=(x.solved||[]).filter(i=>i>=20);if((x.idx||0)<20)x.idx=0;x.b1v2=true;}return x;};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s)S=Object.assign(S,s);}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}cloudPush();}
S=MIG5(MIG3(MIG(S)));try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}

let voices=[];
function lv(){try{voices=speechSynthesis.getVoices()||[];}catch(e){}}
if('speechSynthesis' in window){lv();speechSynthesis.onvoiceschanged=lv;}
function pick(lang){
  const pref=lang==='zh'?['zh-tw','zh-hk','zh-cn','zh']:['en-us','en-gb','en'];
  for(const p of pref){const v=voices.find(v=>(v.lang||'').replace('_','-').toLowerCase().startsWith(p));if(v)return v;}
  return null;
}
function norm(t,lang){if(lang==='zh')return t.replace(/[（(]/g,'，').replace(/[）)]/g,'，').replace(/\s*×\s*/g,'乘以').replace(/\s*÷\s*/g,'除以').replace(/\s*−\s*/g,'減').replace(/\s*\+\s*/g,'加').replace(/\s*=\s*/g,'等於').replace(/，+/g,'，').replace(/，([。？！])/g,'$1');
  return t.replace(/\s*×\s*/g,' times ').replace(/\s*÷\s*/g,' divided by ').replace(/\s*−\s*/g,' minus ').replace(/\s*\+\s*/g,' plus ').replace(/\s*=\s*/g,' equals ');}
function speak(text,lang){
  if(!('speechSynthesis' in window))return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(norm(text,lang));const v=pick(lang);if(v)u.voice=v;
  u.lang=lang==='zh'?'zh-TW':'en-US';u.rate=lang==='zh'?.82:.92;speechSynthesis.speak(u);}catch(e){}
}

const ZYS={'ㄅ':'玻','ㄆ':'坡','ㄇ':'摸','ㄈ':'佛','ㄉ':'德','ㄊ':'特','ㄋ':'訥','ㄌ':'勒','ㄍ':'哥','ㄎ':'科','ㄏ':'喝','ㄐ':'基','ㄑ':'七','ㄒ':'西','ㄓ':'知','ㄔ':'吃','ㄕ':'詩','ㄖ':'日','ㄗ':'資','ㄘ':'疵','ㄙ':'思'};
const clean=t=>t.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/¢/g,' cents').replace(/\s+/g,' ').trim();
function speakers(root){root.querySelectorAll('[data-say]').forEach(el=>{if(el.querySelector(':scope > .spk'))return;const b=document.createElement('button');b.className='spk';b.type='button';b.textContent='🔊';b.setAttribute('aria-label','Read aloud');b.onclick=e=>{e.stopPropagation();let t=el.dataset.text;if(!t){const c=el.cloneNode(true);c.querySelectorAll('rt,.spk').forEach(x=>x.remove());t=c.textContent;}speak(clean(t),el.dataset.say);};el.appendChild(b);});}
new MutationObserver(()=>speakers(document.body)).observe(document.body,{childList:true,subtree:true});
const ART_FULL='@img:01.webp:image/webp@';
const ART_FACE='@img:02.webp:image/webp@';
const ART_CAT='@img:03.webp:image/webp@';
const MASCOT=`<img class="art-hero" src="${ART_FULL}" alt="小魔女和黑貓">`;
const CAT=`<img class="peekcat" src="${ART_CAT}" alt="">`;
const SCENES=['#F7D9A0,#E4A85B','#CFE8C4,#8CC48A','#F4D7A8,#C9935A','#2A3570,#5B6BB0','#FFE69A,#F2B84B','#D6E4C8,#9DB58A','#D8F0C8,#8CCB7A','#FBE3C8,#E7A9A0','#FFB48A,#B84A32','#BFE3F5,#5E9FCF','#E6D2B0,#B98E5A','#E8E1D2,#B9A98C','#1B1F4B,#4B3A8C','#F3E3C3,#C9A26B','#BFE6C8,#4F9A6A','#F5DFA0,#C99A4A','#F0E2C4,#B4874E','#E3F3FB,#9CCBE6','#FBDDE8,#E59BB8','#F2B48C,#A84C2E','#D9C8F2,#8E6CC0','#F6D7A8,#C98A3A','#CDE3F5,#6C8FC8','#F3E9D2,#C2A878','#F2D6C9,#B8745A','#1E2450,#4B4B9C','#F3E3C3,#B98E4A','#DDF2C4,#7DB85A','#FBE7B5,#D9A23B','#E2D6F5,#7A5CC4','#BFE3F5,#2E6FA8','#F6EAD2,#C0A06A','#E8ECF5,#9AA6C8','#F3E3C3,#B9874E','#D6F0C4,#5E9E4A','#EDE2D2,#A68A6A','#E2F2D6,#6FA858','#E6E0F0,#6E6890','#F2E0D0,#A86A4E','#E8DDF8,#5E4AA0'];
function bg(on){document.body.classList.toggle('bg-fun',on);}
function confetti(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const cols=['#D2553E','#E2A93B','#2E8B66','#5A9BD5','#C77DFF'];const w=document.createElement('div');w.className='confetti';w.setAttribute('aria-hidden','true');
for(let i=0;i<30;i++){const s=document.createElement('i');s.style.left=(42+Math.random()*16)+'%';s.style.background=cols[i%cols.length];s.style.setProperty('--x',(Math.random()*600-300)+'px');s.style.setProperty('--y',(-180-Math.random()*260)+'px');s.style.setProperty('--r',(Math.random()*720)+'deg');w.appendChild(s);}
document.body.appendChild(w);setTimeout(()=>w.remove(),1700);}
const SND=(()=>{
  const CFG={id:'nora',music:false,bar:4.8,steps:4,arp:.4,ring:2.2,oct:0,wave:'sine',vol:.55,cut:1600};
  let ctx=null,master=null,mg=null,on=CFG.music,nextBar=0,bar=0;
  try{const v=localStorage.getItem('music-'+CFG.id);if(v!==null)on=v==='1';}catch(e){}
  const N=m=>440*Math.pow(2,(m-69)/12);
  function init(){
    if(ctx)return true;
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    try{ctx=new AC();}catch(e){return false;}
    master=ctx.createGain();master.gain.value=.8;master.connect(ctx.destination);
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=CFG.cut;lp.connect(master);
    mg=ctx.createGain();mg.gain.value=0;mg.connect(lp);
    setInterval(tick,200);return true;
  }
  function tone(f,t,d,o){o=o||{};const os=ctx.createOscillator(),g=ctx.createGain();os.type=o.type||'sine';os.frequency.setValueAtTime(f,t);
    if(o.glide)os.frequency.exponentialRampToValueAtTime(o.glide,t+d);
    const a=o.a||.015,v=o.v||.15;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    os.connect(g);g.connect(o.dest||master);os.start(t);os.stop(t+d+.05);}
  const PROG=[[48,[60,64,67,71]],[45,[57,60,64,67]],[41,[57,60,64,65]],[43,[59,62,67,64]]];
  const PENT=[72,74,76,79,81,84,86,88];
  function playBar(t){
    const [root,ch]=PROG[bar%PROG.length];bar++;const L=CFG.bar;
    tone(N(root),t,L*.95,{v:.09,a:.3,dest:mg});
    ch.forEach(m=>tone(N(m),t,L*1.05,{v:.035,a:L*.35,type:'triangle',dest:mg}));
    const dt=L/CFG.steps;
    for(let i=0;i<CFG.steps;i++)if(Math.random()<CFG.arp)tone(N(PENT[Math.floor(Math.random()*PENT.length)]+CFG.oct),t+i*dt,CFG.ring,{v:.05,dest:mg,type:CFG.wave});
  }
  function tick(){
    const speaking=(('speechSynthesis' in window)&&speechSynthesis.speaking)||!!(window.VOICE_PLAYING&&window.VOICE_PLAYING());
    const target=on&&!document.hidden?(speaking?CFG.vol*.25:CFG.vol):0;
    mg.gain.setTargetAtTime(target,ctx.currentTime,.4);
    if(!on)return;
    if(nextBar<ctx.currentTime)nextBar=ctx.currentTime+.1;
    while(nextBar<ctx.currentTime+.6){playBar(nextBar);nextBar+=CFG.bar;}
  }
  function unlock(){if(init()&&ctx.state!=='running')ctx.resume();}
  document.addEventListener('pointerdown',unlock,true);document.addEventListener('keydown',unlock,true);
  const btn=document.createElement('button');btn.className='mus';btn.type='button';
  function label(){btn.textContent=on?'🎵':'🔇';btn.setAttribute('aria-label',on?'Music on':'Music off');btn.setAttribute('aria-pressed',String(on));}
  label();
  btn.onclick=e=>{e.stopPropagation();unlock();on=!on;try{localStorage.setItem('music-'+CFG.id,on?'1':'0');}catch(err){}label();};
  document.body.appendChild(btn);
  function fx(fn){if(!init())return;if(ctx.state!=='running')ctx.resume();fn(ctx.currentTime+.02);}
  return{
    correct:()=>fx(t=>[72,76,79,84].forEach((m,i)=>tone(N(m),t+i*.09,.5,{type:'triangle',v:.16}))),
    wrong:()=>fx(t=>{tone(N(64),t,.25,{v:.09});tone(N(60),t+.16,.35,{v:.09});}),
    win:()=>fx(t=>{[72,74,76,79,81,84,88].forEach((m,i)=>tone(N(m),t+i*.06,.4,{type:'triangle',v:.12}));[72,76,79].forEach(m=>tone(N(m),t+.5,1.2,{v:.08}));}),
    pop:()=>fx(t=>tone(N(67),t,.18,{v:.15,glide:N(79)})),
    thump:()=>fx(t=>tone(110,t,.3,{v:.25,glide:55})),
    bell:()=>fx(t=>{tone(N(69),t,2.5,{v:.07});tone(N(76),t,2.5,{v:.035});})
  };
})();
const uni=(a,b)=>[...new Set([...(a||[]),...(b||[])])];
const MERGE=(a,b)=>{b=MIG5(MIG3(MIG(b)));const solved=uni(a.solved,b.solved);const strat={...(a.strat||{})};Object.entries(b.strat||{}).forEach(([k,v])=>{strat[k]=Math.max(strat[k]||0,v);});const idx=(b.solved||[]).length>(a.solved||[]).length?b.idx:a.idx;const tot=l=>Object.values(l||{}).reduce((s,e)=>s+(e[0]||0),0);const lb=tot(b.log)>tot(a.log);return{...a,solved,stars:Math.max(a.stars||0,b.stars||0),strat,idx:idx||0,log:lb?b.log:(a.log||{}),moods:((b.moods||[]).length>(a.moods||[]).length?b.moods:a.moods)||[],power:Math.max(a.power||0,b.power||0),pet:a.pet!==undefined?a.pet:b.pet,seen:uni(a.seen,b.seen),seenv:true,mnext:Math.max(a.mnext||0,b.mnext||0),mfriends:((b.mfriends||[]).length>(a.mfriends||[]).length?b.mfriends:a.mfriends)||[],chain:Math.max(a.chain||0,b.chain||0),battle:(b.mnext||0)>(a.mnext||0)?b.battle:a.battle};};
const ON_HOME=()=>!!(document.querySelector('.home'));

/* ---------- CLOUD SAVE (Claude account) ---------- */
const CLOUD={ref:null,timer:null,ready:false};
async function cloudInit(){
  try{
    if(!window.claude||typeof claude.use!=='function')return;
    const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);
    if(!db||!user)return;
    const id=await user.id();if(!id)return;CLOUD.db=db;CLOUD.uid=id;
    CLOUD.ref=db.collection('data/users/'+id).doc(KEY);
    const snap=await CLOUD.ref.get();
    if(snap.exists){const d=snap.data();if(d&&typeof d.state==='string'){try{S=MERGE(S,JSON.parse(d.state));}catch(e){}}}
    CLOUD.ready=true;
    if(typeof voiceLoad==='function')voiceLoad();
    try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}
    cloudPush(true);
    if(ON_HOME())home();
  }catch(e){}
}
function cloudPush(now){
  if(!CLOUD.ref||!CLOUD.ready)return;
  clearTimeout(CLOUD.timer);
  const go=()=>CLOUD.ref.set({state:JSON.stringify(S),at:Date.now()}).catch(()=>{});
  if(now)go();else CLOUD.timer=setTimeout(go,700);
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&CLOUD.timer){clearTimeout(CLOUD.timer);cloudPush(true);}});
const cloudNote=()=>`<p class="cloudnote">${CLOUD.ready?'☁️ Progress saves to your Claude account':'📱 Progress saves on this device only'}</p>`;
const app=document.getElementById('app');
const $=s=>app.querySelector(s);
let cur=0,tries=0,wrong=[],hintOn=false,showEn=false,note='',session=0;

function ruby(w,z){const s=z.split(' ');return [...w].map((c,i)=>`<ruby>${c}<rt>${s[i]||''}</rt></ruby>`).join('');}
const BOOKS=[[0,20,'📕 第一冊'],[20,40,'📗 第二冊']];let book=1;
const seenT=()=>S.seen||[];const isDone=i=>seenT().includes(CASES[i].title);
const doneIn=b=>CASES.slice(BOOKS[b][0],BOOKS[b][1]).filter(c=>seenT().includes(c.title)).length;
function nextCase(){const [lo,hi]=BOOKS[book];for(let j=lo;j<hi;j++){if(!isDone(j))return j;}return -1;}

/* ---------- LEARNING: tracking + targeted practice ---------- */
const SKILLS={order:'排順序與邏輯',count:'仔細數數',pattern:'找規律',groups:'分組與倍數',multi:'多步驟計算',twotype:'雞兔同籠',sumdiff:'和差問題',time:'時間與日期',space:'方向與圖形'};
const CASE_SKILL=['count','groups','multi','order','multi','groups','count','multi','pattern','count','groups','pattern','multi','groups','multi','pattern','time','groups','twotype','count',
 'multi','time','order','time','space','pattern','sumdiff','pattern','groups','count','multi','count','space','time','multi','count','multi','order','time','twotype'];
const PR={on:false,items:[],i:0,right:0,skill:null};
const CC=()=>PR.on?PR.items[PR.i]:CASES[cur];
const skillOf=()=>PR.on?CC().skill:CASE_SKILL[cur];
function logAns(first,hint){
  S.log=S.log||{};const bump=(k)=>{const e=S.log[k]||[0,0,0];e[0]++;if(first)e[1]++;if(hint)e[2]++;S.log[k]=e;};
  bump('sk:'+skillOf());if(!PR.on)bump('case:'+cur);else if(first)PR.right++;
  save();
}
