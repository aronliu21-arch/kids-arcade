function seek(sp){const c=sp.c;c.classList.remove('wig');void c.getBBox();c.classList.add('wig');
 if(sp.d){const o=sp.d;sp.d=null;o.hide=null;o.g.classList.remove('peek');o.x=sp.x-50*o.s;o.y=sp.y-80*o.s;o.vj=420;SFX.ding();Z.found++;c.setAttribute('opacity',.5);for(let j=0;j<5;j++)fxPop(sp.x,sp.y-60,'⭐',{size:20});
  $('fieldSvg').querySelector('#fxLayer').before(o.g);
  if(Z.found>=Z.hideN){confetti(40);say(`Found ${o.d.name}! ${Z.found}! You found all ${Z.found} dinos!`,`找到${o.d.name}了!${Z.found}!你找到全部${Z.found}隻恐龍了!`);setTimeout(()=>{if(Z.mode==='hide'){Z.mode=null;zooStart();}},5000);}
  else say(`Found ${o.d.name}! ${Z.found}!`,`找到${o.d.name}了!${Z.found}!`);}
 else if(c.getAttribute('opacity')!=='0.5'){SFX.boing();say('Not here!','不在這裡!');}}
function scoreGoal(team){const b=Z.ball;Z.score[team]++;Z.goalT=1;SFX.fanfare();confetti(40);const sc=$('zScore');if(sc)sc.textContent=`${Z.score[0]} : ${Z.score[1]}`;
 const tm=team?['Red team','紅隊']:['Blue team','藍隊'];say(`Goal! ${tm[0]} scores! Blue ${Z.score[0]}, Red ${Z.score[1]}.`,`進球!${tm[1]}得分!藍隊${Z.score[0]}分,紅隊${Z.score[1]}分。`);
 Z.ds.forEach(o=>{if(o.team===team)o.vj=360;});b.vx=0;setTimeout(()=>{if(!Z.ball)return;b.x=Z.W/2;b.h=60;b.vh=0;b.vx=0;Z.goalT=0;},1800);}
function kickBall(vx,vh){const b=Z.ball;if(!b)return;b.vx=vx;b.vh=vh;SFX.pop();}
function toyTap(o){const d=o.d,M=Z.mode;
 if(M==='bath'){o.pause=2.5;o.scrub=(o.scrub||0)+1;SFX.brush();const cx=o.x+50*o.s,cy=o.y+40*o.s;for(let j=0;j<5;j++)fxPop(cx+(Math.random()-.5)*70*o.s,cy,'🫧',{size:24+Math.random()*14,life:1.8,vy:-(30+Math.random()*40)});
  if(o.scrub>=3){o.scrub=0;o.vj=280;SFX.grow();for(let j=0;j<8;j++)fxPop(cx,cy-20,'✨',{size:22,vx:(Math.random()-.5)*160,vy:-(40+Math.random()*80)});if(!fixNeed(o,'dirty'))say(`Three! ${d.name} is squeaky clean!`,`三!${d.name}洗得好乾淨!`);}
  else say(`${o.scrub}! Scrub, scrub!`,`${o.scrub}!刷刷刷!`);return true;}
 if(M==='dance'){const f=SING[Z.note%SING.length];Z.note++;tone(f,.35,'triangle',.22);tone(f*1.5,.3,'sine',.08,.05);o.vj=380;fxPop(o.x+50*o.s,o.y,'🎵',{size:26});o.dn=(o.dn||0)+1;if(!fixNeed(o,'dance')&&o.dn===6&&!d.need)getNeed(o,'sleepy',`${d.name} danced so much. Now ${d.name} is sleepy!`,`${d.name}跳得好累,想睡覺了!`);return true;}
 if(M==='night'){if(fixNeed(o,'sleepy',true)){say(`Good night, ${d.name}! Sweet dreams.`,`${d.name}晚安!做個好夢。`);return true;}tone(160,.5,'sine',.08,0,null,120);fxPop(o.x+70*o.s,o.y,'💤',{size:24,life:2});say(`Shh… ${d.name} is sleeping.`,`噓……${d.name}在睡覺。`);return true;}
 if(M==='hide'){if(o.hide)seek(o.hide);return true;}
 return false;}
function toyTick(t,dt){const W=Z.W,H=Z.H;
 Z.fx=Z.fx.filter(p=>{p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;const a=Math.max(0,1-p.t/p.life);p.e.setAttribute('transform',`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`);p.e.setAttribute('opacity',a.toFixed(2));if(a<=0){p.e.remove();return false;}return true;});
 const b=Z.ball;if(b){b.x+=b.vx*dt;b.vx*=Math.pow(.45,dt);if(Math.abs(b.vx)<4)b.vx=0;b.h+=b.vh*dt;b.vh-=900*dt;if(b.h<=0){b.h=0;b.vh=b.vh<-120?-b.vh*.4:0;}
  const G=Z.goal;if(G&&!Z.goalT&&(b.x<G.gw*.6||b.x>W-G.gw*.6)&&b.h<G.gh*.8){scoreGoal(b.x<W/2?1:0);}
  if(b.x<18){b.x=18;b.vx=Math.abs(b.vx)*.8;}if(b.x>W-18){b.x=W-18;b.vx=-Math.abs(b.vx)*.8;}b.rot+=b.vx*dt*2.2;
  b.g.setAttribute('transform',`translate(${b.x.toFixed(1)},${(b.y-b.h).toFixed(1)}) rotate(${b.rot.toFixed(0)})`);
  Z.kcool-=dt;if(Z.kcool<=0&&b.h<20)for(const o of Z.ds){if(o.fly)continue;const cx=o.x+50*o.s;if(Math.abs(cx-b.x)<30+30*o.s&&!Z.goalT){const dir=o.team===undefined||Z.goal&&Z.goal.solo?(b.x>=cx?1:-1):(o.team?-1:1);kickBall(dir*(240+Math.random()*200),Math.random()<.4?320:200);o.vj=220;Z.kicks++;Z.kcool=.9;o.kk=(o.kk||0)+1;if(o.kk===3&&fixNeed(o,'play')){Z.kcool=2;break;}if(o.kk===6&&!o.d.need){Z.kcool=2;getNeed(o,'dirty',`Oh no! ${o.d.name} got muddy playing ball!`,`哎呀!${o.d.name}踢球踢得髒兮兮!`);break;}
   break;}}}
 if(Z.mode==='dance'){const S2=SONGS[Z.song||0],bms=60000/S2.bpm*((S2.bar||8)===6?1:1),ph=(t-(Z.beat0||0))/bms,bt=Math.floor(ph),nb=bt!==Z.beat;if(nb)Z.beat=bt;
  Z.ds.forEach((o,k)=>{o.hx=o.hx??o.x;const w=100*o.s;
   if(S2.move==='hop'){o.tilt=0;if(nb){if((bt+k)%2===0&&o.jump===0)o.vj=210;if(bt%4===0)o.vx=-o.vx;}}
   else if(S2.move==='sway'){o.x=o.hx+Math.sin(ph*Math.PI/ ((S2.bar||8)===6?1.5:1)+k)*22;o.tilt=Math.sin(ph*Math.PI/1.5+k)*12;o.vx=Math.cos(ph*Math.PI/1.5+k)>0?20:-20;}
   else if(S2.move==='spin'){if(nb){o.vx=-o.vx;if(bt%2===0&&o.jump===0)o.vj=300;}o.tilt=Math.sin(ph*Math.PI*2)*8;}
   else if(S2.move==='conga'){Z.cdir=Z.cdir||1;const sp=55;o.x+=Z.cdir*sp*dt;o.vx=Z.cdir*sp;o.ph+=dt*10;o.tilt=(bt%2?1:-1)*7;if(nb&&k===0&&o.jump===0)o.vj=150;
    if((Z.cdir>0&&o.x>Z.W-w)||(Z.cdir<0&&o.x<0)){Z.cdir=-Z.cdir;}}});}
 else Z.ds.forEach(o=>{o.tilt=0;});
 if(Z.mode==='night'&&Math.random()<dt*1.2&&Z.ds.length){const o=pick(Z.ds);fxPop(o.x+70*o.s,o.y,'💤',{size:20,life:2.2,vy:-25,vx:12});}}
/* ---------- dinos play with each other: say hi, high-five, cuddle a baby, chase, roar ---------- */
function socialTick(dt){Z.socT=(Z.socT??3)-dt;const ds=Z.ds.filter(o=>!o.fly&&!o.drag);ds.forEach(o=>{o.cd=(o.cd??(1+Math.random()*3))-dt;});if(Z.socT>0)return;
 if(Z.socT<-3&&ds.length>1){const free=ds.filter(o=>!o.act);if(free.length>1){const a=pick(free),b=pick(free.filter(o=>o!==a));a.act={type:'follow',p:b,t:0,dur:7,speed:70,meet:true};Z.socT=4;return;}}
 for(let i=0;i<ds.length;i++)for(let j=i+1;j<ds.length;j++){const a=ds[i],b=ds[j];if(a.act||b.act||a.cd>0||b.cd>0)continue;
  const ax=a.x+50*a.s,bx=b.x+50*b.s;if(Math.abs(ax-bx)>(50*a.s+50*b.s)*1.15||Math.abs((a.y+80*a.s)-(b.y+80*b.s))>70)continue;startAct(a,b);Z.socT=2+Math.random()*3;return;}}
function startAct(a,b){const baby=a.stg<2?a:b.stg<2?b:null,big=baby?(baby===a?b:a):null;
 const kinds=baby&&big.stg>=2?['cuddle','cuddle','hello']:['hello','highfive','chase','roar'];const k=pick(kinds);
 const mid=()=>[(a.x+50*a.s+b.x+50*b.s)/2,Math.min(a.y,b.y)];const face=(o,p)=>({type:'face',p,t:0,dur:2});
 if(k==='hello'){a.act=face(a,b);b.act=face(b,a);const [x,y]=mid();fxPop(x,y-10,'👋',{size:28,vx:0,vy:-20,life:1.6});tone(880,.1,'sine',.12);tone(1175,.12,'sine',.1,.12);}
 else if(k==='highfive'){a.act=face(a,b);b.act=face(b,a);a.act.dur=b.act.dur=1.4;a.vj=b.vj=320;const [x,y]=mid();setTimeout(()=>{for(let n=0;n<6;n++)fxPop(x,y,'✨',{size:20,vx:(Math.random()-.5)*140,vy:-(40+Math.random()*80),life:1});SFX.pop();},280);}
 else if(k==='cuddle'){baby.act={type:'follow',p:big,t:0,dur:4,speed:55};big.act=face(big,baby);big.act.dur=2.2;const go=n=>{if(n>0&&baby.act){fxPop(baby.x+50*baby.s,baby.y,'💕',{size:24,vx:0,vy:-30,life:1.5});setTimeout(()=>go(n-1),600);}};go(4);baby.vj=200;tone(660,.15,'sine',.1);tone(990,.2,'sine',.08,.15);}
 else if(k==='chase'){const [it,run]=Math.random()<.5?[a,b]:[b,a];const away=Math.sign((run.x-it.x)||1);run.act={type:'run',t:0,dur:2.6,vx:away*120};it.act={type:'follow',p:run,t:0,dur:2.6,speed:105};
  fxPop(it.x+50*it.s,it.y-6,'❗',{size:26,vx:0,vy:-25,life:1});fxPop(run.x+50*run.s,run.y-6,'😆',{size:26,vx:0,vy:-25,life:1.2});tone(700,.08,'square',.06);tone(900,.08,'square',.06,.1);}
 else{const roarer=a.d.t==='rex'?a:b.d.t==='rex'?b:a,other=roarer===a?b:a;roarer.act=face(roarer,other);roarer.act.dur=1.6;roarer.vj=150;
  const bub=svgEl('text',{x:0,y:0,'text-anchor':'middle','font-size':20,'font-weight':900,fill:'#c92a2a',stroke:'#fff','stroke-width':4,'paint-order':'stroke'},'ROAR!');$('fieldSvg').querySelector('#fxLayer')?.appendChild(bub);Z.fx.push({e:bub,x:roarer.x+50*roarer.s,y:roarer.y-8,vx:0,vy:-18,life:1.4,t:0});
  tone(140,.45,'sawtooth',.07,0,null,70);setTimeout(()=>{other.vj=300;other.act={type:'run',t:0,dur:1.6,vx:Math.sign((other.x-roarer.x)||1)*130};fxPop(other.x+50*other.s,other.y-6,'😮',{size:24,vx:0,vy:-25,life:1});},350);}}
function actStep(o,dt){const a=o.act;a.t+=dt;
 if(a.type==='run'){if((o.x<0&&a.vx<0)||(o.x>Z.W-100*o.s&&a.vx>0))a.vx=-a.vx;o.vx=a.vx;o.x+=a.vx*dt;o.ph+=dt*13;}
 else if(a.type==='follow'){const p=a.p,dx=(p.x+50*p.s)-(o.x+50*o.s),dy=(p.y+80*p.s)-(o.y+80*o.s);o.vx=Math.sign(dx||1)*a.speed;const near=Math.abs(dx)<=(40*p.s+40*o.s);
  if(!near){o.x+=o.vx*dt;o.ph+=dt*12;}if(a.meet&&Math.abs(dy)>10)o.y+=Math.sign(dy)*Math.min(Math.abs(dy),40*dt);
  if(a.meet&&near&&Math.abs(dy)<40&&!p.act){o.act=null;startAct(o,p);return;}}
 else{const dx=(a.p.x+50*a.p.s)-(o.x+50*o.s);o.vx=Math.sign(dx||1)*Math.max(18,Math.abs(o.vx));}
 if(a.t>=a.dur){o.act=null;o.cd=4+Math.random()*5;o.pause=0;}}
function zooStop(){if(danceT){danceOff();}cancelAnimationFrame(Z.raf);Z.raf=0;}
function zooTick(t){const dt=Math.min(.05,(t-Z.last)/1000);Z.last=t;const W=Z.W;
 toyTick(t,dt);const M=Z.mode;if(!M)socialTick(dt);
 for(const o of Z.ds){const w=100*o.s;
  if(o.drag){o.g.setAttribute('transform',`translate(${o.x.toFixed(1)},${o.y.toFixed(1)})`);continue;}
  if(o.act&&!M)actStep(o,dt);
  else if(M==='night'||M==='hide'||M==='dance'){if(M==='dance')o.ph+=dt*8;}
  else if(M==='ball'&&Z.ball&&!o.fly&&o.pause<=0){const cx=o.x+w/2;const dir=Math.sign(Z.ball.x-cx)||1;o.vx=dir*(70+30*o.s);if(Math.abs(Z.ball.x-cx)>8)o.x+=o.vx*dt;o.ph+=dt*10;}
  else if(o.pause>0)o.pause-=dt;else{o.x+=o.vx*dt;o.ph+=dt*8;if(Math.random()<.004)o.pause=1+Math.random()*2;if(Math.random()<.003)o.vx=-o.vx;}
  if(o.x<0&&o.vx<0&&o.x>-w*.2)o.vx=Math.abs(o.vx);if(o.x>W-w&&o.vx>0)o.vx=-Math.abs(o.vx);
  if(o.fly)o.y=Math.max(4,o.y+Math.sin(t/600+o.ph)*.4);
  if(o.vj||o.jump>0){o.jump+=o.vj*dt;o.vj-=700*dt;if(o.jump<=0){o.jump=0;o.vj=0;}}
  const left=o.vx<0;o.g.setAttribute('transform',`translate(${o.x.toFixed(1)},${(o.y-o.jump).toFixed(1)})`);
  o.body.setAttribute('transform',(o.tilt?`rotate(${o.tilt.toFixed(1)} ${w/2} ${80*o.s}) `:'')+(left?`translate(${w},0) scale(${-o.s},${o.s})`:`scale(${o.s})`));
  const b=o.pause<=0?Math.sin(o.ph)*2.2:0;o.legs.forEach(l=>l.setAttribute('transform',`translate(0,${(l.dataset.leg==='0'?b:-b).toFixed(2)})`));
  o.wings.forEach(l=>l.setAttribute('transform',`translate(50,40) scale(1,${(1-Math.abs(Math.sin(t/180))*.5).toFixed(2)}) translate(-50,-40)`));}
 Z.raf=requestAnimationFrame(zooTick);}
let rzT;// phone rotation: iPhone Safari can leave the page scrolled and the old height after turning back to upright,
// which pushes the top buttons off screen. Re-measure the real screen height and snap back to the top.
function fixViewport(){try{document.documentElement.style.setProperty('--appH',window.innerHeight+'px');window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0;}catch(e){}}
fixViewport();['orientationchange','resize','pageshow'].forEach(ev=>addEventListener(ev,()=>{fixViewport();setTimeout(fixViewport,150);setTimeout(fixViewport,500);setTimeout(fixViewport,1000);}));
if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(fixViewport,60));
addEventListener('scroll',()=>{if(window.scrollY||window.scrollX)window.scrollTo(0,0);},{passive:true});
addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{if(SCREEN==='zoo')zooStart();else if(SCREEN==='map')mapDraw();else if(SCREEN==='station'&&CUR!==null)openStation(CUR);},250);});
$('mapZoo').onclick=()=>{ac();goZoo();};

/* ---------- skill levels: 4 right first try in a row → level up (once per puzzle); 2 misses in a row → level down ---------- */
const LVMAX={math:5,order:5,read:6,spell:4,zhuyin:5,logic:5,measure:5,maze:5,feel:3,build:3,size:5,time:3,memory:5,pairs:3};
const LVNAME={math:['Math','數學'],order:['Counting','數數'],read:['Reading','閱讀'],spell:['Spelling','拼字'],zhuyin:['Zhuyin','注音'],logic:['Puzzles','邏輯'],measure:['Measuring','測量'],maze:['Mazes','迷宮'],feel:['Helping','幫助別人'],build:['Building','蓋恐龍'],size:['Big & small','比大小'],time:['First, next, last','先後順序'],memory:['Roar memory','聲音記憶'],pairs:['Matching pairs','翻牌配對']};
const LVDEF={math:1,order:1,read:1,spell:1,zhuyin:1,logic:1,measure:1,maze:1,feel:1,build:1,size:1,time:1,memory:1,pairs:1};
function lvInit(){if(S.lvv!==2){S.lv={};S.ls={};S.lvv=2;}S.lv=Object.assign({},LVDEF,S.lv||{});S.ls=S.ls||{};save();}
const LV=t=>S.lv[t]||1;
function track(t,ok,first){const s=S.ls[t]||(S.ls[t]={ok:0,bad:0});
 if(ok&&first){s.ok++;s.bad=0;if(s.ok>=4&&LV(t)<LVMAX[t]&&!(A&&A.ups.includes(t))){S.lv[t]++;s.ok=0;SFX.grow();toast(`⭐ ${bi('Level up! '+LVNAME[t][0]+' '+S.lv[t],LVNAME[t][1]+'升級!第'+S.lv[t]+'級')}`,1800);if(A)A.ups.push(t);}}
 else if(!ok){s.bad++;s.ok=0;if(s.bad>=2&&LV(t)>1){S.lv[t]--;s.bad=0;}}else s.ok=0;save();}
