/* dance party: 4 songs, each with its own dance move */
const SONGS=[
 {n:['Dino Stomp','恐龍踏踏舞'],mv:['Hop!','跳一跳!'],move:'hop',bpm:120,mel:[659,0,784,659,880,0,784,0,659,0,587,523,587,0,659,0,523,0,587,659,784,0,880,784,659,0,587,0,523,0,0,0],
  b:(st,w)=>{if(st%2===0)tone([131,131,196,196,175,175,196,196][(st>>2)%8],.22,'triangle',.22,w,master);},d:(st,w)=>{if(st%4===0)tone(150,.16,'sine',.5,w,master,45);if(st%8===4)tone(240,.1,'triangle',.2,w,master,140);if(st%2===1)tone(7000,.025,'square',.025,w,master);}},
 {n:['Jungle Bongo','叢林手鼓'],mv:['Conga line! Follow the leader!','排成一排!跟著走!'],move:'conga',bpm:104,mel:[523,0,440,0,392,440,523,0,587,0,523,0,440,0,0,0,392,0,440,523,587,0,659,0,587,523,440,0,392,0,0,0],
  b:(st,w)=>{if(st%4===0)tone([110,147,131,98][(st>>3)%4],.3,'triangle',.24,w,master);},d:(st,w)=>{if(st%4===0)tone(220,.12,'sine',.35,w,master,150);if(st%4===2)tone(330,.1,'sine',.25,w,master,250);if(st%8===7)tone(420,.07,'sine',.2,w,master,300);if(st%2===1)tone(5000,.02,'square',.015,w,master);}},
 {n:['Disco Dino','迪斯可恐龍'],mv:['Spin around!','轉圈圈!'],move:'spin',bpm:126,mel:[784,0,784,659,0,659,587,0,659,0,784,0,880,0,784,0,659,0,659,587,0,587,523,0,587,0,659,0,523,0,0,0],
  b:(st,w)=>{const r=[131,131,175,196][(st>>3)%4];tone(st%2?r*2:r,.11,'square',.08,w,master);},d:(st,w)=>{if(st%2===0)tone(140,.14,'sine',.5,w,master,45);if(st%8===4)tone(900,.06,'square',.06,w,master,300);if(st%2===1)tone(8000,.06,'square',.03,w,master);}},
 {n:['Sleepy Sway','搖搖晃晃'],mv:['Sway side to side!','左右搖一搖!'],move:'sway',bpm:96,bar:6,mel:[659,0,523,0,523,0,587,0,494,0,494,0,523,0,659,0,784,0,698,0,659,0,587,0],
  b:(st,w)=>{if(st%6===0)tone([131,196,175,196][Math.floor(st/6)%4],.6,'sine',.25,w,master);},d:(st,w)=>{if(st%6===0)tone(120,.12,'sine',.25,w,master,50);if(st%6===2||st%6===4)tone(2500,.03,'triangle',.03,w,master);}}];
let danceT=null,dStep=0,dNext=0;
function danceSched(){const a=AC;if(!a)return;const S2=SONGS[Z.song||0],dt=60/S2.bpm/2;while(dNext<a.currentTime+.3){const w=dNext-a.currentTime,st=dStep%S2.mel.length;
  S2.d(st,w);S2.b(st,w);const n=S2.mel[st];if(n){tone(n,dt*1.6,S2.move==='sway'?'sine':'square',S2.move==='sway'?.12:.07,w,master);if(st%4===0)tone(n*2,.12,'sine',.04,w+.01,master);}
  dStep++;dNext+=dt;}}
function danceOn(){const a=ac();if(!a)return;musicOff();danceOff();dStep=0;dNext=a.currentTime+.05;danceT=setInterval(danceSched,60);Z.beat0=performance.now();Z.beat=-1;const mv=SONGS[Z.song||0].move;Z.cdir=1;Z.ds.forEach((o,k)=>{if(mv==='conga'&&!o.fly){o.x=Math.max(0,Z.W*.45-k*110*o.s);o.y=Z.H*.6;}o.hx=o.x;o.tilt=0;});
 const S2=SONGS[Z.song||0];say(`${S2.n[0]}! ${S2.mv[0]}`,`${S2.n[1]}!${S2.mv[1]}`);const b=$('zSong');if(b)b.style.display='';}
function danceOff(){if(danceT){clearInterval(danceT);danceT=null;}const b=$('zSong');if(b&&Z.mode!=='dance')b.style.display='none';}
/* storybook (crayon) hiding spots for hide & seek: each is about s wide, sitting on the ground at y=b */
function hideObj(k,c,b,s){const R=(x0,y0,x1,y1,n)=>subdiv([[x0,y0],[x1,y0],[x1,y1],[x0,y1]],n||3),cr=(p,h,w)=>crayon(p,h,w||2.6),E=ellPts;let o='';
 if(k==='bush'){o+=cr(E(c-s*.24,b-s*.24,s*.27,s*.24),'#51cf66')+cr(E(c+s*.24,b-s*.24,s*.27,s*.24),'#51cf66')+cr(E(c,b-s*.42,s*.32,s*.3),'#69db7c')+cr(R(c-s*.42,b-s*.18,c+s*.42,b,4),'#51cf66');
  [[-.18,-.45],[.12,-.5],[.25,-.28],[-.28,-.25],[0,-.22]].forEach(([x,y])=>o+=cr(E(c+x*s,b+y*s,s*.035,s*.035,10),'#ff6b6b',1.4));}
 else if(k==='tree'){o+=cr(R(c-s*.07,b-s*.3,c+s*.07,b,2),'#a9714b')+cr(E(c,b-s*.5,s*.48,s*.42),'#40c057')+cr(E(c-s*.2,b-s*.6,s*.2,s*.17),'#69db7c',1.8);
  [[-.2,-.4],[.18,-.55],[.25,-.3]].forEach(([x,y])=>o+=cr(E(c+x*s,b+y*s,s*.045,s*.045,10),'#fa5252',1.4));}
 else if(k==='rock'||k==='rock2'){o+=cr([[c-s*.48,b],[c-s*.43,b-s*.34],[c-s*.16,b-s*.62],[c+s*.2,b-s*.58],[c+s*.44,b-s*.3],[c+s*.48,b]],k==='rock'?'#adb5bd':'#868e96');
  o+=`<path d="M${c-s*.08} ${b-s*.45} l${s*.06} ${s*.12} l-${s*.04} ${s*.1}" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`;}
 else if(k==='house'){o+=cr(R(c-s*.4,b-s*.52,c+s*.4,b),'#ffe8cc')+cr([[c-s*.5,b-s*.5],[c,b-s*.92],[c+s*.5,b-s*.5]],'#ff8787')+cr(R(c-s*.09,b-s*.3,c+s*.09,b,2),'#a9714b')+cr(R(c+s*.17,b-s*.42,c+s*.33,b-s*.27,2),'#a5d8ff',1.8);}
 else if(k==='tent'){o+=cr([[c-s*.5,b],[c,b-s*.78],[c+s*.5,b]],'#ffa94d')+cr([[c-s*.13,b],[c,b-s*.36],[c+s*.13,b]],'#5c3d2e',1.8)+`<path d="M${c} ${b-s*.78} v-${s*.16}" stroke="${INK}" stroke-width="2.4"/>`+cr([[c,b-s*.94],[c+s*.16,b-s*.88],[c,b-s*.82]],'#ff6b6b',1.6);}
 else if(k==='box'){o+=cr(R(c-s*.42,b-s*.62,c+s*.42,b),'#e0a96d')+cr(R(c-s*.07,b-s*.62,c+s*.07,b,2),'#ffe066',1.8)+cr([[c-s*.42,b-s*.62],[c-s*.3,b-s*.74],[c+s*.5,b-s*.74],[c+s*.42,b-s*.62]],'#d09a5e',2);}
 else if(k==='hay'){const p=semiPts(c-s*.5,b-s*.7,s,s*.7);o+=cr(p,'#ffd43b');for(let i=0;i<6;i++){const x=c-s*.35+i*s*.14;o+=`<path d="M${x} ${b-s*.08} q${s*.03} -${s*.2} 0 -${s*.38}" stroke="#e8a317" stroke-width="2" fill="none"/>`;}}
 else if(k==='hut'){o+=cr(R(c-s*.36,b-s*.42,c+s*.36,b),'#ffc078')+cr([[c-s*.52,b-s*.38],[c,b-s*.86],[c+s*.52,b-s*.38]],'#d8a657')+cr(R(c-s*.09,b-s*.28,c+s*.09,b,2),'#5c3d2e',1.8);}
 else if(k==='castle'){o+=cr([[c-s*.46,b],[c-s*.46,b-s*.6],[c-s*.32,b-s*.6],[c-s*.32,b-s*.5],[c-s*.12,b-s*.5],[c-s*.12,b-s*.78],[c+s*.12,b-s*.78],[c+s*.12,b-s*.5],[c+s*.32,b-s*.5],[c+s*.32,b-s*.6],[c+s*.46,b-s*.6],[c+s*.46,b]],'#ffe066')+cr(semiPts(c-s*.09,b-s*.26,s*.18,s*.26),'#c79a3e',1.8)+cr([[c,b-s*.78],[c,b-s*.98],[c+s*.15,b-s*.92]],'#ff6b6b',1.6);}
 else if(k==='boat'){o+=cr([[c-s*.02,b-s*.3],[c-s*.02,b-s*1],[c+s*.44,b-s*.3]],'#fff')+cr([[c-s*.06,b-s*.3],[c-s*.06,b-s*.86],[c-s*.4,b-s*.3]],'#ffe3e3')+cr([[c-s*.5,b-s*.32],[c+s*.5,b-s*.32],[c+s*.36,b],[c-s*.36,b]],'#4dabf7');}
 else if(k==='igloo'){o+=cr(semiPts(c-s*.5,b-s*.62,s,s*.62),'#f1f3f5');o+=`<path d="M${c-s*.44} ${b-s*.2} H${c+s*.44} M${c-s*.36} ${b-s*.4} H${c+s*.36}" stroke="#a5d8ff" stroke-width="2.4"/>`+cr(semiPts(c-s*.12,b-s*.28,s*.24,s*.28),'#5c3d2e',1.8);}
 else if(k==='snowman'){o+=cr(E(c,b-s*.24,s*.36,s*.24),'#fff')+cr(E(c,b-s*.6,s*.26,s*.18),'#fff')+cr(E(c,b-s*.86,s*.17,s*.12),'#fff')+cr([[c,b-s*.86],[c+s*.16,b-s*.84],[c,b-s*.82]],'#ff922b',1.4)+cr(R(c-s*.14,b-s*1.02,c+s*.14,b-s*.96,2),'#495057',1.6);}
 else if(k==='pine'){o+=cr(R(c-s*.06,b-s*.16,c+s*.06,b,2),'#a9714b')+cr([[c-s*.5,b-s*.12],[c,b-s*.62],[c+s*.5,b-s*.12]],'#2f9e44')+cr([[c-s*.38,b-s*.45],[c,b-s*.95],[c+s*.38,b-s*.45]],'#40c057');}
 else if(k==='bones'){o+=cr(semiPts(c-s*.5,b-s*.5,s,s*.5),'#a9714b')+cr(R(c-s*.3,b-s*.62,c+s*.3,b-s*.54,2),'#f8f9fa',1.8)+cr(E(c-s*.3,b-s*.58,s*.06,s*.06,10),'#f8f9fa',1.6)+cr(E(c+s*.3,b-s*.58,s*.06,s*.06,10),'#f8f9fa',1.6);}
 return o;}
const HIDEK={home:['bush','tree','house','tent','box','hay'],jungle:['bush','tree','hut','rock','bush','tree'],beach:['castle','boat','rock','hut','bush'],snow:['igloo','snowman','pine','rock','house'],volcano:['rock','rock2','bones','bush','hut'],meadow:['bush','tree','hay','tent','house'],swamp:['bush','tree','hut','rock2','rock'],desert:['rock','rock2','tent','hut','bones']};
/* ---------- dino moods: dirty → bath, sleepy → bedtime, wants to play → ball, wants to dance → dance party ---------- */
const MOODS={dirty:['🛁','is all muddy! Give a bath.','髒兮兮的!幫牠洗澡吧!','bath','is squeaky clean and happy!','洗乾淨了,好開心!'],
 sleepy:['😴','is sleepy. Time for bed!','想睡覺了,該睡覺囉!','night','had a good sleep!','睡飽了!'],
 play:['⚽','wants to play ball!','想踢球!','ball','had fun playing ball!','踢球好好玩!'],
 dance:['🎵','wants to dance!','想跳舞!','dance','loves dancing!','跳舞好開心!']};
function needTick(){const now=Date.now();let ch=false;S.dinos.forEach(d=>{if(d.need||(d.stage??2)<2&&false)return;if(d.needT===undefined){d.needT=now-60000*Math.random()*3;if(Math.random()<.5){d.need=pick(Object.keys(MOODS));ch=true;}return;}
  if(now-d.needT>120000&&Math.random()<.6){d.need=pick(Object.keys(MOODS));d.needT=now;ch=true;}});if(ch)save();}
function decorate(o){o.g.querySelectorAll('.need,.mud').forEach(e=>e.remove());const n=o.d.need;if(!n)return;const sz=o.s,bx=88*sz,by=-14;
 const b=svgEl('g',{class:'need'});b.innerHTML=`<circle cx="${bx-12}" cy="${by+14}" r="4" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="${bx}" cy="${by}" r="17" fill="#fff" stroke="${INK}" stroke-width="2.2"/><text x="${bx}" y="${by+1}" text-anchor="middle" dominant-baseline="central" font-size="18">${MOODS[n][0]}</text>`;o.g.appendChild(b);
 if(n==='dirty'){const m=svgEl('g',{class:'mud'});m.innerHTML=[[30,44,9,6],[52,52,11,7],[66,38,7,5],[40,62,6,4],[78,58,5,4]].map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#8b5a2b" opacity=".85"/>`).join('')+`<path d="M44 14 q4 -6 0 -12 M54 12 q4 -6 0 -12" stroke="#8b5a2b" stroke-width="2" fill="none" opacity=".7"/>`;o.g.querySelector('.sc').appendChild(m);}
 if(n==='sleepy')o.g.querySelector('.need text').textContent='😴';}
function needSay(o){const n=o.d.need;if(!n)return false;const N=MOODS[n];say(`${o.d.name} ${N[1]}`,`${o.d.name}${N[2]}`);const b=$('zToys').querySelector(`[data-m="${N[3]}"]`);if(b){b.classList.remove('wiggle');void b.offsetWidth;b.classList.add('wiggle');setTimeout(()=>b.classList.remove('wiggle'),1800);}return true;}
function fixNeed(o,n,quiet){if(o.d.need!==n)return false;o.d.need=null;o.d.needT=Date.now();save();decorate(o);SFX.grow();
 for(let j=0;j<5;j++)fxPop(o.x+50*o.s,o.y+10,'❤️',{size:20,vx:(Math.random()-.5)*90,vy:-(40+Math.random()*60),life:1.4});if(!quiet)say(`${o.d.name} ${MOODS[n][4]}`,`${o.d.name}${MOODS[n][5]}`);return true;}
function getNeed(o,n,en,zh){if(o.d.need)return;o.d.need=n;o.d.needT=Date.now();save();decorate(o);say(en,zh);}
/* ---------- zoo toys: ball, bath, dance party, bedtime stars, hide & seek ---------- */
const TOYSAY={ball:['Soccer time! Blue team and red team. Tap the ball to kick it!','踢足球囉!藍隊對紅隊。點球來踢!'],bath:['Bath time! Tap a dino to scrub it.','洗澡時間!點恐龍刷一刷。'],
 dance:['Dance party! Tap a dino to sing!','跳舞派對!點恐龍唱歌!'],night:['Good night, dinos! Tap the stars and count them.','恐龍晚安!點星星,數一數。'],hide:['Close your eyes… one, two, three! Find the dinos!','閉上眼睛……一、二、三!找恐龍!']};
const SING=[523,587,659,698,784,880,988,1047];
function svgEl(tag,attrs,txt){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!==undefined)e.textContent=txt;return e;}
function fxPop(x,y,ch,opt){opt=opt||{};const e=svgEl('text',{x:0,y:0,'text-anchor':'middle','font-size':opt.size||26},ch);$('fieldSvg').querySelector('#fxLayer')?.appendChild(e);
 Z.fx.push({e,x,y,vx:opt.vx??(Math.random()-.5)*30,vy:opt.vy??-(40+Math.random()*40),life:opt.life||1.4,t:0});}
function toyButtons(){$('zSong').onclick=()=>{ac();SFX.click();Z.song=((Z.song||0)+1)%SONGS.length;danceOn();};$('zToys').querySelectorAll('button[data-m]').forEach(b=>{b.classList.toggle('on',b.dataset.m===Z.mode);
 b.onclick=()=>{ac();SFX.click();const m=b.dataset.m;Z.mode=Z.mode===m?null:m;if(Z.mode){Z.feed=false;$('zFeed').classList.remove('on');}zooStart();
  if(Z.mode){const needDinos=Z.mode!=='night'&&Z.mode!=='ball';if(needDinos&&!Z.ds.length){say('No dinos here yet!','這裡還沒有恐龍!');Z.mode=null;zooStart();return;}if(Z.mode!=='dance')say(...TOYSAY[Z.mode]);}};});}
function toyInit(){if(Z.mode==='dance')danceOn();else if(danceT){danceOff();musicOn();}Z.fx=[];Z.ball=null;Z.goal=null;Z.goalT=0;Z.kicks=0;Z.kcool=0;Z.stars=0;Z.found=0;Z.beat=-1;Z.note=0;toyButtons();const svg=$('fieldSvg'),W=Z.W,H=Z.H,M=Z.mode;if(!M)return;
 const base=Math.min(H*.26,W*.22,150)/100;
 if(M==='ball'){const fx=svg.querySelector('#fxLayer'),gy=H*.62,gh=H*.27,gw=Math.max(34,W*.05);Z.goal={gy,gh,gw};Z.score=[0,0];
  for(const side of [0,1]){const x=side?W-gw:0,col=side?'#ff6b6b':'#4dabf7';const gg=svgEl('g',{});let o=`<rect x="${x}" y="${gy}" width="${gw}" height="${gh}" fill="#fff" opacity=".55"/>`;
   for(let k=1;k<5;k++)o+=`<path d="M${x} ${gy+gh*k/5}h${gw}" stroke="#adb5bd" stroke-width="1.5"/>`;for(let k=1;k<3;k++)o+=`<path d="M${x+gw*k/3} ${gy}v${gh}" stroke="#adb5bd" stroke-width="1.5"/>`;
   o+=`<path d="M${side?x:x+gw} ${gy+gh} V${gy} H${side?x+gw:x}" stroke="${col}" stroke-width="7" fill="none" stroke-linecap="round"/>`;gg.innerHTML=o;fx.appendChild(gg);}
  const sb=svgEl('g',{});sb.innerHTML=`<rect x="${W/2-78}" y="8" width="156" height="40" rx="14" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="${W/2-52}" cy="28" r="11" fill="#4dabf7" stroke="${INK}" stroke-width="2"/><circle cx="${W/2+52}" cy="28" r="11" fill="#ff6b6b" stroke="${INK}" stroke-width="2"/><text id="zScore" x="${W/2}" y="37" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">0 : 0</text>`;fx.appendChild(sb);
  let k=0;Z.ds.forEach(o=>{if(o.fly)return;o.team=k++%2;const t=svgEl('g',{class:'teamtag'});t.innerHTML=`<circle cx="${50*o.s}" cy="-8" r="9" fill="${o.team?'#ff6b6b':'#4dabf7'}" stroke="${INK}" stroke-width="2"/>`;o.g.appendChild(t);});
  if(k<2)Z.goal.solo=true;
  const g=svgEl('g',{class:'zball',style:'cursor:pointer'});g.appendChild(svgEl('text',{x:0,y:0,'text-anchor':'middle','dominant-baseline':'central','font-size':Math.max(34,46*base)},'⚽'));svg.querySelector('#fxLayer').appendChild(g);
  Z.ball={g,x:W/2,y:H*.8,h:0,vx:0,vh:0,rot:0};g.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();ac();kickBall((Math.random()<.5?-1:1)*(300+Math.random()*120),260);});
  svg.onpointerdown=ev=>{if(Z.mode!=='ball'||!Z.ball||ev.target.closest('.dino'))return;const r=svg.getBoundingClientRect();const x=(ev.clientX-r.left)*W/r.width;kickBall(Math.sign(x-Z.ball.x)*Math.min(480,120+Math.abs(x-Z.ball.x)*1.6),200);};}
 else svg.onpointerdown=null;
 if(M==='night'){const L=svg.querySelector('#nightLayer');L.appendChild(svgEl('rect',{x:0,y:0,width:W,height:H,fill:'#1b2550',opacity:.6}));L.appendChild(svgEl('text',{x:W-60,y:70,'font-size':56,'text-anchor':'middle'},'🌙'));
  const n=ri(5,8);Z.starN=n;const top=svg.querySelector('#fxLayer');const used=[];
  for(let i=0;i<n;i++){let x,y,k=0;do{x=80+Math.random()*(W-200);y=78+Math.random()*(H*.38);k++;}while(k<40&&used.some(([a,b])=>Math.hypot(a-x,b-y)<70));used.push([x,y]);
   const st=svgEl('text',{x,y,'text-anchor':'middle','dominant-baseline':'central','font-size':40,opacity:.6,style:'cursor:pointer'},'⭐');
   st.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();ac();if(st.dataset.on)return;st.dataset.on=1;st.setAttribute('opacity',1);st.setAttribute('font-size',54);Z.stars++;SFX.ding();
    for(let j=0;j<4;j++)fxPop(x,y,'✨',{size:18,life:.9});
    if(Z.stars>=n){confetti(30);Z.ds.forEach(o=>fixNeed(o,'sleepy',true));say(`${n}! You counted ${n} stars! Good night, dinos!`,`${n}!你數了${n}顆星星!恐龍晚安!`);}else say(`${Z.stars}!`,`${Z.stars}!`);});top.appendChild(st);}
  Z.ds.forEach(o=>{o.zz=0;});}
 if(M==='dance'){Z.ds.forEach(o=>{o.pause=0;});}
 if(M==='hide'){const n=Math.min(10,Math.max(4,Z.ds.length*2)),L=svg.querySelector('#coverLayer');const two=n>5||(n>3&&W<H*1.1),cols=two?Math.ceil(n/2):n;
  const em=[...new Set(shuffle(HIDEK[Z.area]||HIDEK.home).concat(shuffle(['bush','rock','tree','box','hay'])))];
  const fs=Math.max(60,Math.min(W/cols*.66,H*(two?.3:.46),160*base));
  const spots=Array.from({length:n},(_,i)=>{const row=two?(i<cols?0:1):0,c=two?(i%cols):i,cn=two&&row?n-cols:cols;return {x:W*(c+.5+(two&&row?.25:0))/cn,y:two?(row?H*.9:H*.6):H*.88,d:null,row};});
  const pick2=shuffle(spots.map((_,i)=>i)).slice(0,Math.min(Z.ds.length,Math.floor(n/2)));
  Z.ds.forEach((o,k)=>{if(k>=pick2.length){o.g.style.display='none';return;}const sp=spots[pick2[k]];sp.d=o;o.hide=sp;const side=Math.random()<.5?-1:1;o.s=Math.min(o.s,fs*.72/100);const wd=100*o.s;
   o.x=sp.x-wd/2+side*Math.max(0,fs*.4-wd*.36);o.y=sp.y-fs*.12-80*o.s+Math.random()*12;o.vx=side*Math.abs(o.vx||20);o.vj=0;o.jump=0;o.g.classList.add('peek');});
  spots.forEach((sp,si)=>{const c=svgEl('g',{class:'zcov'});c.innerHTML=hideObj(em[si%em.length],sp.x,sp.y,fs*.95);c.style.transformOrigin=`${sp.x}px ${sp.y}px`;c.style.transformBox='view-box';sp.c=c;
   c.addEventListener('pointerdown',ev=>{ev.preventDefault();ev.stopPropagation();ac();seek(sp);});L.appendChild(c);});
  Z.hideN=pick2.length;}}
