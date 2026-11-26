function restoreSnap(j){Object.assign(story,{trait:null,problem:null,solved:false},JSON.parse(j))}
function choose(oi){if(pv&&pv.oi===oi){confirmPick();return}
  if(pv)restoreSnap(pv.snap);else pv={snap:snapStr()};pv.oi=oi;const line=applyChoice(oi);touch();if(line)speak(mix(line));renderBuild()}
function confirmPick(){if(!pv)return;hist.push(pv.snap);pv=null;touch();renderBuild(true)}
function cancelPick(){if(!pv)return;restoreSnap(pv.snap);pv=null;try{speechSynthesis.cancel()}catch(e){}touch();renderBuild()}

/* ================= mix languages: flip chosen words into the other language ================= */
const EXTRA=[['dragon','龍'],['baby dragon','龍寶寶'],['friend','朋友'],['best friends','好朋友'],['treasure','寶藏'],['magic','魔法'],['moon','月亮'],['storm','暴風雨'],['rainbow','彩虹'],['door','門'],['candy','糖果'],['stars','星星'],['egg','蛋'],['monster','怪獸'],['fox','狐狸'],['map','地圖'],['ground','地面'],['snow','雪'],['bubbles','泡泡'],['machine','機器'],['footprints','腳印'],
  ['castle','城堡'],['jungle','叢林'],['sea','海'],['mountain','山'],['cave','山洞'],['forest','森林'],['beach','海灘'],['house','房子'],['home','家'],['clouds','雲朵'],['hero','英雄'],['dream','夢'],['banana','香蕉'],['everyone','大家'],['help','幫忙'],['owl','貓頭鷹'],['bunny','兔子'],['fairy','仙子'],['ghost','幽靈'],['alien','外星人'],['turtle','烏龜'],['troll','山怪'],['puppy','小狗'],['kitten','小貓'],['robot','機器人'],['dinosaur','恐龍'],['unicorn','獨角獸'],['panda','熊貓'],['wizard','巫師'],['cake','蛋糕'],['happy','快樂'],['brave','勇敢']];
function dict(){const d=[];HEROES.forEach(o=>{d.push([o[1],o[2]],[o[3],o[4]])});PLACES.forEach(o=>d.push([o[1],o[2]]));WANTS.forEach(o=>d.push([o[6],o[7]]));MEETS.forEach(o=>{if(o[3])d.push([o[1],o[2]],[o[3],o[4]])});EXTRA.forEach(p=>d.push(p));
  const seen=new Set(),seenZ=new Set();return d.filter(([e,z])=>e&&z&&!seen.has(e)&&!seenZ.has(z)&&seen.add(e)&&seenZ.add(z)).sort((a,b)=>b[0].length-a[0].length)}
const reEsc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function mix(t){if(!story||!story.mix||!story.mix.length||!t)return t;const z=Z();let out=t;
  for(const [en,zh] of dict()){if(!story.mix.includes(en))continue;
    if(z)out=out.split(zh).join(' '+en+' ');else out=out.replace(new RegExp('\\b'+reEsc(en)+'\\b','gi'),zh)}
  return out.replace(/ {2,}/g,' ').replace(/ ([,。!?、,.!?」])/g,'$1').replace(/^ /,'')}
function mixPanel(){const z=Z(),all=story.scenes.flatMap(s=>s.lines).join(' ');
  const found=dict().filter(([en,zh])=>z?all.includes(zh):new RegExp('\\b'+reEsc(en)+'\\b','i').test(all));
  const box=$('mixBox');box.style.display=box.style.display==='block'?'none':'block';
  box.innerHTML=`<b>🔤 ${z?'點一個詞,換成英文':'Tap a word to switch it to 中文'}</b><div class="mixw">${found.length?found.map(([en,zh])=>{const on=(story.mix||[]).includes(en);return`<button class="mw${on?' on':''}" data-mw="${esc(en)}">${z?`${esc(zh)} → ${esc(en)}`:`${esc(en)} → ${esc(zh)}`}</button>`}).join(''):`<span class="ver">${z?'先多寫一點故事':'Write a bit more story first'}</span>`}</div>
    <p class="ver" style="margin:6px 0 0">${z?'也可以用「改文字」自己混著寫。':'You can also mix languages yourself with “Edit words”.'}</p>`;
  box.querySelectorAll('[data-mw]').forEach(b=>b.onclick=()=>{story.mix=story.mix||[];const w=b.dataset.mw,i=story.mix.indexOf(w);if(i>=0)story.mix.splice(i,1);else story.mix.push(w);b.classList.toggle('on');touch();speak(mix(curScene().lines[curScene().lines.length-1]||''))})}

/* ================= stage (one live canvas; reads the scene every frame) ================= */
const RATE={sparkle:7,rain:70,storm:95,snow:16,bubbles:6,leaves:3,hearts:2.5,confetti:28,candy:3,fire:16};
let stage=null;
function stopStage(){if(stage){cancelAnimationFrame(stage.raf);stage.ro&&stage.ro.disconnect();stage=null}}
function mountStage(el,getScene,opts={}){stopStage();const box=document.createElement('div');box.className='stagebox';const cv=document.createElement('canvas');cv.className='living';box.appendChild(cv);el.innerHTML='';el.appendChild(box);
  const g=cv.getContext('2d'),S={raf:0,st:{}},parts=[],fxp=[],starsA=Array.from({length:45},()=>({x:rand(0,W),y:rand(0,H*.55),r:rand(1,2.6),p:rand(0,6)}));let flash=0,nextFlash=2,shake=0,nextShake=1.2,shoot=null;stage=S;
  function size(){const r=el.getBoundingClientRect();let w=r.width,h=r.height;if(!h||h<60)h=w*.75;let cw=Math.min(w,h*4/3),ch=cw*.75;const d=Math.min(devicePixelRatio||1,2);cv.style.width=cw+'px';cv.style.height=ch+'px';cv.width=Math.round(cw*d);cv.height=Math.round(ch*d)}
  S.ro=new ResizeObserver(size);S.ro.observe(el);size();
  function stOf(a){let s=S.st[a.id];if(!s){s=S.st[a.id]={x:a.x*W,y:a.y*H,lift:(a.air!=null?a.air:(a.m==='fly'?90:0)),face:1,h:0,hopT:Math.random(),sq:0,sqv:-8,wait:rand(.2,1.2),target:null,jump:0,phase:rand(0,6),pop:0};if(!opts.quiet)boing()}return s}
  function spawn(ty){const c=['#ff6b6b','#ffd43b','#69db7c','#4dabf7','#da77f2','#ff922b'][Math.floor(rand(0,6))];
    if(ty==='sparkle')return{x:rand(0,W),y:rand(0,H*.85),life:rand(.6,1.1),s:rand(6,14)};
    if(ty==='rain'||ty==='storm')return{x:rand(-80,W),y:-20,vx:ty==='storm'?220:60,vy:rand(800,1000),life:1};
    if(ty==='snow')return{x:rand(0,W),y:-10,vx:rand(-20,20),vy:rand(35,80),s:rand(3,7),life:12,p:rand(0,6)};
    if(ty==='bubbles')return{x:rand(0,W),y:H+20,vx:0,vy:-rand(40,90),s:rand(6,18),life:12,p:rand(0,6)};
    if(ty==='hearts')return{x:rand(40,W-40),y:H+20,vy:-rand(50,90),life:9,e:'💖',s:rand(22,34),p:rand(0,6)};
    if(ty==='confetti')return{x:rand(0,W),y:-10,vx:rand(-40,40),vy:rand(120,200),s:rand(6,11),life:6,r:rand(0,6),vr:rand(-8,8),c};
    if(ty==='candy')return{x:rand(0,W),y:-30,vx:rand(-15,15),vy:rand(90,140),life:8,e:Math.random()<.5?'🍬':'🍭',s:rand(24,34),r:0,vr:rand(-2,2)};return null}
  const DUR={right:1,left:1,jump:.8,flip:.9,spin:.8,dance:1.6,grow:.4,shrink:.4,hide:.5,show:.5,up:.9,down:.9,say:2.2,happy:.6,sad:.6,angry:.6,wow:.6,sleep:2,wait:1,back:.8,front:.8,runr:.8,runl:.8,hop:1.4,turn:.35,zigzag:1.4,circle:1.8,shake:.8,bounce3:1.5,fall:1.6,bow:1,wave:1.4,laugh:1.4,hearts:1,stars:1,notes:1.6,think:2.4,shout:2,ding:.4,drum:.6,wait2:2};
  const MOODS={happy:'😄',sad:'😢',angry:'😡',wow:'😲',sleep:'💤'};
  S.play=()=>{const sc=getScene();if(!sc)return;S.si=0;S.stepOn=false;for(const a of sc.actors){const s=stOf(a);Object.assign(s,{cur:null,x:a.x*W,y:a.y*H,pc:0,bt:0,k:1,alpha:1,rot:0,lift:(a.air!=null?a.air:(a.m==='fly'?90:0)),mood2:null,sayT:0,h:0})}S.running=true};
  S.reset=()=>{S.running=false;const sc=getScene();if(!sc)return;for(const a of sc.actors){const s=stOf(a);Object.assign(s,{cur:null,x:a.x*W,y:a.y*H,pc:0,bt:0,k:1,alpha:1,rot:0,lift:(a.air!=null?a.air:(a.m==='fly'?90:0)),mood2:null,sayT:0,h:0})}};
  function sfx(k){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.connect(g).connect(AC.destination);
    if(k==='ding'){o.type='sine';o.frequency.setValueAtTime(1320,t);g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.001,t+.6)}
    else if(k==='drum'){o.type='triangle';o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(50,t+.2);g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.3)}
    else{o.type='triangle';[523,659,784].forEach((f,i)=>o.frequency.setValueAtTime(f,t+i*.18));g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.7)}
    o.start(t);o.stop(t+.8)}catch(e){}}
  function burst(s,e,n){for(let i=0;i<n;i++)parts.push({x:s.x+rand(-30,30),y:s.y-(s.lift||0)-60,vx:rand(-3,3),vy:rand(-6,-2),t:0,e})}
  function startBlock(a,s,b){s.cur=b;s.bt=0;s.fx=s.x;s.fy=s.y;s.fk=s.k||1;s.fl=s.lift||0;s.D=DUR[b.k]||1;
      if(b.k==='goto'||b.k==='to'){let tx=b.x*W,ty=b.y*H;if(b.k==='to'){const o=S.st[b.id];if(o){tx=o.x+(s.x<o.x?-110:110);ty=o.y}else{tx=s.x;ty=s.y}}s.tx=clamp(tx,40,W-40);s.ty=clamp(ty,H*.14,H-4);s.D=Math.max(.5,Math.hypot(s.tx-s.x,s.ty-s.y)/230);if(b.k==='goto'&&(s.lift||0)>0){s.ty=clamp(ty+(s.lift||0),H*.14,H-4)}}
      if(b.k==='down'){s.gy=null;const fall=Math.max(0,H*.9-s.y)+(s.lift||0);s.D=Math.max(.6,fall/260)}
      if(b.k==='say'){s.sayT=2.2;s.sayTxt=b.t||'…'}if(b.k==='think'){s.sayT=2.4;s.sayTxt='💭 '+(b.t||'…')}if(b.k==='shout'){s.sayT=2;s.sayTxt=(b.t||'Hey')+'!!'}if(b.k==='home'){s.tx=a.x*W;s.ty=a.y*H;s.D=Math.max(.5,Math.hypot(s.tx-s.x,s.ty-s.y)/230)}if(b.k==='laugh')s.mood2='😂';if(b.k==='hearts')burst(s,'💖',8);if(b.k==='stars')burst(s,'⭐',8);if(b.k==='ding'||b.k==='drum')sfx(b.k);if(b.k==='notes')sfx('notes');if(b.k==='turn')s.f0=s.face||1;if(MOODS[b.k])s.mood2=MOODS[b.k];if(b.k==='jump'||b.k==='flip')boing()}
  function stepBlock(a,s,dt,t){const b=s.cur;
    s.bt+=dt;const k=Math.min(1,s.bt/s.D),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
    switch(b.k){
      case'right':case'left':{const dx=b.k==='right'?170:-170;s.face=dx>0?1:-1;s.x=clamp(s.fx+dx*e,40,W-40);s.h=Math.abs(Math.sin(k*Math.PI*3))*16;break}
      case'goto':case'to':{if(Math.abs(s.tx-s.fx)>2)s.face=s.tx>s.fx?1:-1;s.x=s.fx+(s.tx-s.fx)*e;s.y=s.fy+(s.ty-s.fy)*e;s.h=Math.abs(Math.sin(k*Math.PI*Math.max(2,s.D*3)))*16;break}
      case'jump':s.h=Math.sin(k*Math.PI)*130;if(k>=1)s.sqv-=10;break;
      case'flip':s.h=Math.sin(k*Math.PI)*140;s.rot=k*Math.PI*2*(s.face||1);if(k>=1)s.rot=0;break;
      case'spin':s.rot=e*Math.PI*2;if(k>=1)s.rot=0;break;
      case'dance':s.rot=Math.sin(k*Math.PI*8)*.3;s.h=Math.abs(Math.sin(k*Math.PI*6))*22;if(k>=1)s.rot=0;break;
      case'grow':s.k=s.fk+(Math.min(2.2,s.fk*1.35)-s.fk)*e;break;
      case'shrink':s.k=s.fk+(Math.max(.45,s.fk/1.35)-s.fk)*e;break;
      case'hide':s.alpha=1-e;break;case'show':s.alpha=e;break;
      case'up':s.lift=s.fl+(Math.min(300,s.fl+180)-s.fl)*e;s.h=0;break;
      case'down':{if(s.bt-dt<=0||s.gy==null){s.gy=s.fy;s.gt=Math.max(s.fy,H*.9)}s.lift=s.fl*(1-e);s.y=s.gy+(s.gt-s.gy)*e;s.h=0;if(k>=1){s.gy=null}break}
      case'back':s.y=clamp(s.fy-70*e,H*.3,H-4);s.h=Math.abs(Math.sin(k*Math.PI*2))*10;break;
      case'front':s.y=clamp(s.fy+70*e,H*.3,H-4);s.h=Math.abs(Math.sin(k*Math.PI*2))*10;break;
      case'runr':case'runl':{const dx=b.k==='runr'?330:-330;s.face=dx>0?1:-1;s.x=clamp(s.fx+dx*e,40,W-40);s.h=Math.abs(Math.sin(k*Math.PI*5))*22;break}
      case'hop':s.face=1;s.x=clamp(s.fx+220*k,40,W-40);s.h=Math.abs(Math.sin(k*Math.PI*3))*80;break;
      case'turn':s.face=k<1?s.f0:-s.f0;if(k>=1)s.face=-s.f0;break;
      case'zigzag':s.face=1;s.x=clamp(s.fx+220*k,40,W-40);s.y=clamp(s.fy+Math.sin(k*Math.PI*4)*40,H*.3,H-4);s.h=Math.abs(Math.sin(k*Math.PI*8))*10;break;
      case'circle':{const an=k*Math.PI*2;s.x=clamp(s.fx+Math.sin(an)*90,40,W-40);s.y=clamp(s.fy-(1-Math.cos(an))*40,H*.3,H-4);s.face=Math.cos(an)>=0?1:-1;s.h=Math.abs(Math.sin(k*Math.PI*6))*10;break}
      case'home':if(Math.abs(s.tx-s.fx)>2)s.face=s.tx>s.fx?1:-1;s.x=s.fx+(s.tx-s.fx)*e;s.y=s.fy+(s.ty-s.fy)*e;s.h=Math.abs(Math.sin(k*Math.PI*4))*14;break;
      case'shake':s.x=s.fx+Math.sin(k*Math.PI*24)*7*(1-k);if(k>=1)s.x=s.fx;break;
      case'bounce3':s.h=Math.abs(Math.sin(k*Math.PI*3))*70;break;
      case'fall':{const f=k<.25?k/.25:k>.75?(1-k)/.25:1;s.rot=f*1.4*(s.face||1)*-1;if(k>=1)s.rot=0;break}
      case'bow':s.rot=Math.sin(k*Math.PI)*.5*(s.face||1);if(k>=1)s.rot=0;break;
      case'wave':s.rot=Math.sin(k*Math.PI*6)*.12;if(Math.random()<dt*3)parts.push({x:s.x+40,y:s.y-(s.lift||0)-a.s*H*.8,vx:0,vy:-.5,t:0,e:'👋'});if(k>=1)s.rot=0;break;
      case'laugh':s.h=Math.abs(Math.sin(k*Math.PI*8))*14;s.rot=Math.sin(k*Math.PI*8)*.08;if(k>=1)s.rot=0;break;
      case'notes':s.rot=Math.sin(k*Math.PI*4)*.1;if(Math.random()<dt*4)parts.push({x:s.x+rand(-20,30),y:s.y-(s.lift||0)-a.s*H,vx:rand(-.5,1),vy:-1.5,t:0,e:Math.random()<.5?'🎵':'🎶'});if(k>=1)s.rot=0;break;
      case'shout':s.x=s.fx+Math.sin(k*Math.PI*20)*4*(1-k);break;
      case'sleep':s.h=0;if(Math.random()<dt*2)parts.push({x:s.x+30,y:s.y-a.s*H,vx:.6,vy:-1,t:0,e:'💤'});break;
      default:s.h=0}
    if(k>=1){s.cur=null;s.bt=0}}
  let last=performance.now();
  function loop(now){S.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000,sc=getScene();if(!sc)return;
    const ty=sc.fx||'none';
    const scr=scriptOf(sc);
    if(S.running&&S.si<scr.length&&!S.stepOn){for(const b of scr[S.si]){const a=sc.actors.find(x=>x.id===b.who);if(a)startBlock(a,stOf(a),b)}S.stepOn=true}
    for(const a of sc.actors){const s=stOf(a);if(s.sayT>0)s.sayT-=dt;s.pop=Math.min(1,s.pop+dt*3);s.sqv+=(-180*s.sq-12*s.sqv)*dt;s.sq+=s.sqv*dt;if(reduced){s.h=0;continue}
      if(s.jump>0){s.hopT+=dt*2.2;s.h=Math.sin(Math.min(1,s.hopT)*Math.PI)*120*s.jump;if(s.hopT>=1){s.hopT=0;s.jump=0;s.sqv-=10}continue}
      if(s.cur){stepBlock(a,s,dt,t);continue}
      if(['hero','friend','villain'].includes(a.role)||a.img){s.h=(s.lift>0&&!reduced)?Math.sin(t*1.5+s.phase)*8:0;continue}
      const m=a.m;if(m==='wander'){if(s.target){const dx=s.target.x-s.x,dy=s.target.y-s.y,dd=Math.hypot(dx,dy);if(Math.abs(dx)>2)s.face=dx>0?1:-1;
          if(dd<3){s.target=null;s.h=0;s.wait=rand(.8,2.5)}else{const sp=Math.min(dd,90*dt);s.x+=dx/dd*sp;s.y+=dy/dd*sp;s.hopT+=dt*2.4;if(s.hopT>=1){s.hopT-=1;s.sqv-=4}s.h=Math.sin(s.hopT*Math.PI)*18}}
        else{s.wait-=dt;s.h=0;if(s.wait<=0)s.target={x:clamp(a.x*W+rand(-170,170),60,W-60),y:clamp(a.y*H+rand(-35,25),H*.5,H-6)}}}
      else if(m==='bounce'){s.hopT+=dt*1.6;if(s.hopT>=1){s.hopT-=1;s.sqv-=7}s.h=Math.sin(s.hopT*Math.PI)*40}
      else if(m==='fly'){const nx=a.x*W+Math.sin(t*.55+s.phase)*150,ny=a.y*H-90+Math.sin(t*1.1+s.phase)*30;if(Math.abs(nx-s.x)>.3)s.face=nx>s.x?1:-1;s.x=clamp(nx,40,W-40);s.y=ny;s.h=0}
      else if(m==='float'){s.h=10+Math.sin(t*1.5+s.phase)*10}else s.h=0}
    if(S.running&&S.stepOn&&sc.actors.every(a=>!stOf(a).cur)){S.stepOn=false;S.si++;if(S.si>=scr.length&&sc.loop&&scr.length)S.si=0}
    if(ty!=='none'&&!reduced){const n=(RATE[ty]||0)*dt;let k=Math.floor(n)+(Math.random()<n%1?1:0);while(k--&&fxp.length<320){const q=spawn(ty);if(q){q.age=0;q.ty=ty;fxp.push(q)}}}
    for(let i=fxp.length-1;i>=0;i--){const q=fxp[i];q.age+=dt;if(q.ty!==ty||q.age>q.life||q.y>H+40||q.y<-60){fxp.splice(i,1);continue}if(q.vx!=null)q.x+=(q.vx+(q.p!=null?Math.sin(t*2+q.p)*18:0))*dt;if(q.vy!=null)q.y+=q.vy*dt;if(q.vr)q.r+=q.vr*dt}
    if(ty==='storm'){nextFlash-=dt;if(nextFlash<0){flash=1;nextFlash=rand(2.5,5)}}flash=Math.max(0,flash-dt*2.5);
    if(ty==='shake'){nextShake-=dt;if(nextShake<0){shake=.7;nextShake=rand(2.5,4);for(let i=0;i<8;i++)parts.push({x:rand(0,W),y:H-rand(0,30),vx:rand(-2,2),vy:rand(-3,-1),t:0,e:'💨'})}}shake=Math.max(0,shake-dt);
    if(ty==='stars'){if(!shoot&&Math.random()<dt*.35)shoot={x:rand(W*.2,W),y:rand(0,H*.25),t:0};if(shoot){shoot.t+=dt;if(shoot.t>.9)shoot=null}}
    draw(t,sc,ty)}
  function draw(t,sc,ty){const k=cv.width/W;g.setTransform(k,0,0,k,0,0);g.clearRect(0,0,W,H);if(shake>0)g.translate(rand(-7,7)*shake,rand(-5,5)*shake);
    g.drawImage(bgCanvas(sc.bg),0,0);
    if(ty==='stars'||ty==='storm'){g.fillStyle=ty==='stars'?'rgba(16,24,70,.5)':'rgba(30,36,60,.38)';g.fillRect(0,0,W,H)}
    if(ty==='stars'){for(const s of starsA){g.globalAlpha=.5+.5*Math.sin(t*2.5+s.p);circ(g,s.x,s.y,s.r,'#fff')}g.globalAlpha=1;if(shoot){const q=shoot.t/.9;g.strokeStyle=`rgba(255,255,255,${1-q})`;g.lineWidth=3;g.beginPath();g.moveTo(shoot.x-q*300,shoot.y+q*120);g.lineTo(shoot.x-q*300+70,shoot.y+q*120-28);g.stroke()}}
    const order=[...sc.actors].sort((p,q)=>stOf(p).y-stOf(q).y);
    for(const a of order){const s=stOf(a),sp=spriteOf(a);if(!sp||!sp.ready)continue;const hh=a.s*H*(.3+.7*easeBack(s.pop))*(s.k||1),ww=hh*sp.c.width/sp.c.height;const al=s.alpha??1;if(al<.02)continue;g.globalAlpha=al;
      if(a.m!=='fly'&&a.m!=='float'&&!(s.lift>0)){const ss=1-clamp(s.h/160,0,.6);g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(s.x,s.y,Math.max(.5,ww*.38*ss),Math.max(.5,ww*.09*ss),0,0,7);g.fill()}
      g.save();g.translate(s.x,s.y-s.h-(s.lift||0));g.rotate((reduced?0:Math.sin(t*.8+s.phase)*(a.m==='fly'?.12:.05))+(s.rot||0));const br=a.m==='stay'&&!reduced?Math.sin(t*2.2+s.phase)*.025:0;
      g.scale((1-s.sq*.5-br*.5)*s.face*(a.e&&!a.img?-1:1),1+s.sq+br);g.drawImage(sp.c,-ww/2,-hh,ww,hh);g.restore();g.globalAlpha=1;
      if(S.director&&S.sel===a.id){g.setLineDash([10,8]);g.lineWidth=4;g.strokeStyle='#e8590c';g.strokeRect(s.x-ww/2-6,s.y-s.h-(s.lift||0)-hh-6,ww+12,hh+12);g.setLineDash([])}
      const md=s.mood2||a.mood;if(md&&!reduced&&al>.5){g.font='38px serif';g.textAlign='center';g.fillText(md,s.x+ww*.42,s.y-s.h-(s.lift||0)-hh*.8)}
      const sayTxt=s.sayT>0?s.sayTxt:(a.say&&sc.sayId===a.id&&!S.running?a.say:'');if(sayTxt&&al>.5){g.font='700 24px -apple-system,system-ui,"PingFang TC",sans-serif';g.textAlign='center';const lines=wrap(g,mix(sayTxt),300),bw=Math.max(...lines.map(l=>g.measureText(l).width))+30,bh=lines.length*28+18;
        let bx=clamp(s.x-bw/2,8,W-bw-8),by=Math.max(opts.caption?96:8,s.y-s.h-(s.lift||0)-hh-bh-22);g.fillStyle='#fff';g.strokeStyle='#2b2118';g.lineWidth=3;g.beginPath();g.roundRect?g.roundRect(bx,by,bw,bh,16):g.rect(bx,by,bw,bh);g.fill();g.stroke();
        g.beginPath();g.moveTo(clamp(s.x-12,bx+14,bx+bw-30),by+bh-2);g.lineTo(clamp(s.x,bx+20,bx+bw-20),by+bh+18);g.lineTo(clamp(s.x+12,bx+30,bx+bw-14),by+bh-2);g.fill();g.stroke();
        g.fillStyle='#2b2118';lines.forEach((l,k)=>g.fillText(l,bx+bw/2,by+32+k*28))}
      if(a.name&&opts.labels!==false){g.font='700 20px -apple-system,system-ui,"PingFang TC",sans-serif';g.textAlign='center';const tw=g.measureText(a.name).width+16;const ly=s.y-(s.lift||0)-s.h;g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.roundRect?g.roundRect(s.x-tw/2,ly+6,tw,26,13):g.rect(s.x-tw/2,ly+6,tw,26);g.fill();g.fillStyle='#2b2118';g.fillText(a.name,s.x,ly+25)}}
    for(const q of fxp){const kk=q.age/q.life;
      if(q.ty==='sparkle'){g.globalAlpha=Math.sin(kk*Math.PI);g.fillStyle='#ffd43b';g.beginPath();for(let i=0;i<8;i++){const aa=i*Math.PI/4,rr=i%2?q.s*.35:q.s;g.lineTo(q.x+Math.cos(aa)*rr,q.y+Math.sin(aa)*rr)}g.fill()}
      else if(q.ty==='rain'||q.ty==='storm'){g.globalAlpha=.55;g.strokeStyle='#a5d8ff';g.lineWidth=2;g.beginPath();g.moveTo(q.x,q.y);g.lineTo(q.x-q.vx*.025,q.y-22);g.stroke()}
      else if(q.ty==='snow'){g.globalAlpha=.95;circ(g,q.x,q.y,q.s,'#fff')}
      else if(q.ty==='bubbles'){g.globalAlpha=.8;g.strokeStyle='#d0ebff';g.lineWidth=2;g.beginPath();g.arc(q.x,q.y,q.s,0,7);g.stroke()}
      else if(q.ty==='confetti'){g.globalAlpha=1;g.save();g.translate(q.x,q.y);g.rotate(q.r);g.fillStyle=q.c;g.fillRect(-q.s/2,-q.s/4,q.s,q.s/2);g.restore()}
      else if(q.e){g.globalAlpha=Math.min(1,(1-kk)*3);g.save();g.translate(q.x,q.y);g.rotate(q.r||0);g.font=q.s+'px serif';g.textAlign='center';g.fillText(q.e,0,0);g.restore()}}
    g.globalAlpha=1;if(flash>0){g.fillStyle=`rgba(255,255,255,${flash*.7})`;g.fillRect(0,0,W,H)}
    for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.t+=1/60;q.x+=q.vx;q.y+=q.vy;q.vy+=.15;if(q.t>1.2){parts.splice(i,1);continue}g.globalAlpha=1-q.t/1.2;g.font='34px serif';g.textAlign='center';g.fillText(q.e,q.x,q.y);g.globalAlpha=1}
    cv.style.filter=sc.gray?'grayscale(1)':'';
    if(opts.caption){const ln=mix(sc.lines[sc.lines.length-1]);if(ln){g.font='600 24px -apple-system,system-ui,"PingFang TC",sans-serif';g.textAlign='center';const words=wrap(g,ln,W-80);const bh=words.length*30+18;
      const cy=14;g.fillStyle='rgba(0,0,0,.55)';g.fillRect(20,cy,W-40,bh);g.fillStyle='#fff';words.forEach((w2,i)=>g.fillText(w2,W/2,cy+34+i*30))}}}
  function wrap(g2,txt,mw){const out=[];let cur='';const tokens=/[一-鿿]/.test(txt)?[...txt]:txt.split(' ');const sep=/[一-鿿]/.test(txt)?'':' ';
    for(const tk of tokens){const tt=cur?cur+sep+tk:tk;if(g2.measureText(tt).width>mw&&cur&&!/^[,。!?、:;」,.!?]$/.test(tk)){out.push(cur);cur=tk}else cur=tt}if(cur)out.push(cur);return out.slice(-3)}
  let drag=null;
  cv.addEventListener('pointermove',e=>{if(!drag)return;const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*W/r.width,py=(e.clientY-r.top)*H/r.height;drag.s.x=clamp(px+drag.ox,40,W-40);drag.s.y=clamp(py+drag.oy,H*.14,H-4)});
  const endDrag=()=>{if(!drag)return;drag.a.x=drag.s.x/W;drag.a.y=drag.s.y/H;drag=null;S.onChange&&S.onChange()};cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
  cv.addEventListener('pointerdown',e=>{const sc=getScene();if(!sc)return;const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*W/r.width,py=(e.clientY-r.top)*H/r.height;
    if(S.director){if(S.pick){const f=S.pick;S.pick=null;parts.push({x:px,y:py,vx:0,vy:-1,t:0,e:'📍'});f(px/W,py/H);return}
      for(const a of[...sc.actors].sort((p,q)=>stOf(q).y-stOf(p).y)){const s=stOf(a),sp=spriteOf(a);if(!sp||!sp.ready)continue;const hh=a.s*H*(s.k||1),ww=hh*sp.c.width/sp.c.height;
        if(px>s.x-ww/2&&px<s.x+ww/2&&py>s.y-s.h-(s.lift||0)-hh&&py<s.y-s.h-(s.lift||0)){e.preventDefault();cv.setPointerCapture(e.pointerId);S.running=false;s.y=clamp(s.y-(s.lift||0),H*.14,H-4);s.lift=0;a.air=0;drag={a,s,ox:s.x-px,oy:s.y-py};S.sel=a.id;S.onSel&&S.onSel(a.id);return}}return}
    for(const a of[...sc.actors].reverse()){const s=stOf(a),sp=spriteOf(a);if(!sp||!sp.ready)continue;const hh=a.s*H,ww=hh*sp.c.width/sp.c.height;
      if(px>s.x-ww/2&&px<s.x+ww/2&&py>s.y-s.h-hh&&py<s.y-s.h){s.jump=1;s.hopT=0;s.target=null;boing();for(let i=0;i<7;i++)parts.push({x:s.x,y:s.y-hh*.7,vx:rand(-3,3),vy:rand(-6,-2),t:0,e:['💖','⭐','✨'][i%3]});if(a.name)speak(a.name);break}}});
  S.raf=requestAnimationFrame(loop);return S}
