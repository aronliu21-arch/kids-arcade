function drawYou(p){
  const y=Math.max(R*.8,p.y-R*4.1),t='★ '+(cur?cur.name:'You');
  ctx.font='700 '+Math.round(R*.85)+'px Fredoka,system-ui,sans-serif';ctx.textAlign='center';
  const w=ctx.measureText(t).width+R*.9;
  ctx.fillStyle=cur&&cur.id==='nora'?'#7048e8':'#f76707';ctx.strokeStyle='#fff';ctx.lineWidth=2.5;
  rr(p.x-w/2,y-R*.6,w,R*1.2,R*.6);ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.fillText(t,p.x,y+R*.3);
}
function drawFx(now){
  for(let i=fx.length-1;i>=0;i--){
    const f=fx[i];if(now>f.until){fx.splice(i,1);continue;}
    if(f.k==='dots'){ctx.fillStyle=f.c;f.pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,13,0,6.283);ctx.fill();});}
  }
  for(const f of fx){
    if(f.k==='line'){
      ctx.strokeStyle=f.c;ctx.lineWidth=5;ctx.setLineDash([12,9]);
      ctx.beginPath();ctx.moveTo(f.a.x,f.a.y);ctx.lineTo(f.b.x,f.b.y);ctx.stroke();ctx.setLineDash([]);
    }else if(f.k==='ring'){
      const k=Math.sin(now/120)*3;
      upr(f.x,f.y,()=>{ctx.strokeStyle=f.c;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(f.x,f.y-R*.35,R*1.55+k,R*2.05+k,0,0,6.283);ctx.stroke();});
    }
  }
}
function drawFxText(now){
  ctx.font='700 25px Fredoka,system-ui,sans-serif';ctx.textAlign='center';
  for(const f of fx){
    if(f.k!=='text')continue;
    const tt=pr(f.t),w=ctx.measureText(tt).width+28;
    upr(f.x,f.y,()=>{
    ctx.fillStyle=f.c;ctx.beginPath();
    if(ctx.roundRect)ctx.roundRect(f.x-w/2,f.y-25,w,42,14);else ctx.rect(f.x-w/2,f.y-25,w,42);
    ctx.fill();ctx.fillStyle='#fff';ctx.fillText(tt,f.x,f.y+5);
    });
  }
}
function drawCallEye(now){
  const c=S.car,up=S.phase==='up';
  const x=c.x,y=c.y-R*2.3-26;
  ctx.fillStyle=up?'#37b24d':'rgba(60,60,60,.85)';
  if(up){ctx.save();ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(c.x,c.y-R*.35,R*1.6+Math.sin(now/90)*3,R*2.05+Math.sin(now/90)*3,0,0,6.283);ctx.stroke();ctx.restore();}
  ctx.beginPath();ctx.arc(x,y,24,0,6.283);ctx.fill();
  ctx.font='26px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';
  ctx.fillText(up?'👀':'⬇️',x,y+2);ctx.textBaseline='alphabetic';
  ctx.font='700 19px Fredoka,system-ui,sans-serif';ctx.fillStyle='#fff';
  ctx.fillText(up?'HEAD UP':'HEAD DOWN',x,y-34);
}
let lastT=performance.now();
function frame(now){
  const dt=Math.min(.05,(now-lastT)/1000);lastT=now;
  if(!$('play').hidden&&!cv.hidden&&cv.width){
    stepTweens(now);
    if(S&&S.type==='call')callTick(now);
    if(S&&S.type==='pounce')pounceTick(now,dt);
    if(ROT){const s=cv.width/H;ctx.setTransform(0,-s,s,0,0,W*s);}else{const s=cv.width/W;ctx.setTransform(s,0,0,s,0,0);}
    if(S&&S.type==='shoot')drawShootScene(now);
    else if(S&&S.type==='line')drawLineScene(now);
    else{
      drawPitch();
      if(S&&S.players){
        drawSceneUnder(now);
        drawFx(now);
        S.players.slice().sort((a,b)=>ROT?b.x-a.x:a.y-b.y).forEach(p=>upr(p.x,p.y,()=>drawPlayer(p,now)));
        const b=S.ball;
        if(b){
          if(b.owner){const bp=ballPos(b.owner);b.x=bp.x;b.y=bp.y+(S.type==='call'&&S.phase==='down'?Math.sin(now/130)*3:0);}
          drawBall(b.x,b.y,R*.58);
        }
        S.players.forEach(p=>{if(p.me)upr(p.x,p.y,()=>drawYou(p));});
        drawSceneOver(now);
        if(S.type==='call'&&!S.finished)upr(S.car.x,S.car.y,()=>drawCallEye(now));
      }
    }
    drawFxText(now);
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i];p.life-=dt;if(p.life<=0){parts.splice(i,1);continue;}
      if(ROT)p.vx-=700*dt;else p.vy+=700*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,p.r*1.6,p.r);
    }
  }else{stepTweens(now);}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ---------- screens ---------- */
function show(id){
  ['home','map','play','result'].forEach(s=>$(s).hidden=s!==id);
  $('back').hidden=id==='home';
  $('voiceBtn').hidden=id==='home'||!cur;
  $('roundInfo').hidden=$('ptsInfo').hidden=id!=='play';
  if(cur)$('voiceBtn').setAttribute('aria-pressed',String(prof(cur.id).voice));
  if(id==='play')requestAnimationFrame(fit);
  window.scrollTo(0,0);
  musicSync();
}
function totalStars(id){const p=prof(id);return MISSIONS.reduce((a,m)=>a+(p.stars[m.id]||0),0);}
function starStr(n){return '★'.repeat(n)+'☆'.repeat(3-n);}
function renderHome(){
  cur=null;
  $('brand').innerHTML='⚽ <span class="zh"><ruby>足<rt>ㄗㄨˊ</rt></ruby><ruby>球<rt>ㄑㄧㄡˊ</rt></ruby><ruby>高<rt>ㄍㄠ</rt></ruby><ruby>手<rt>ㄕㄡˇ</rt></ruby></span>';
  const k=$('kits');k.innerHTML='';
  [['nora','9','Nora'],['lucas','6','Lucas']].forEach(a=>{
    const b=document.createElement('button');b.className='kit '+a[0];
    b.innerHTML='<div class="pic"><div class="face"><canvas aria-hidden="true"></canvas></div><span class="badge">'+a[1]+'</span></div><div class="nm">'+a[2]+'</div><div class="st">'+totalStars(a[0])+' / '+(MISSIONS.length*3)+' ★</div>';
    b.onclick=()=>{cur=CFG[a[0]];mapTab='team';M=null;audio();sfx.tap();renderMap();};
    k.appendChild(b);
  });
  show('home');
  [].forEach.call(k.querySelectorAll('.kit'),(b,i)=>drawPortrait(b.querySelector('canvas'),i?'lucas':'nora'));
  requestAnimationFrame(fitIntro);
  if($('resetBox'))$('resetBox').hidden=true;
}
/* the kid's in-game anime figure (head and shirt), drawn into a start-screen card */
function drawPortrait(c,kid){
  if(!c)return;
  const keep={ctx:ctx,cur:cur,R:R,S:S,dragging:dragging};
  try{
    const d=Math.min(window.devicePixelRatio||1,3),sz=Math.max(64,Math.round(c.getBoundingClientRect().width||96));
    c.width=Math.round(sz*d);c.height=Math.round(sz*d);
    ctx=c.getContext('2d');cur=CFG[kid];S=null;dragging=null;R=10;
    const k=c.width/(R*2.7);ctx.setTransform(k,0,0,k,0,0);
    drawAnimeMe({me:true},R*1.35,R*2.62,kid==='nora'?9:6,performance.now());
  }catch(e){}
  ctx=keep.ctx;cur=keep.cur;R=keep.R;S=keep.S;dragging=keep.dragging;
}
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(!$('home').hidden)renderHome();});
let mapTab=null;
function renderMap(tab){
  if(tab)mapTab=tab;
  if(!mapTab)mapTab=(M&&M.ch)||'team';
  $('brand').textContent='⚽ '+cur.name+'’s locker room';
  $('mapStars').textContent=totalStars(cur.id)+' / '+(MISSIONS.length*3)+' ★';
  const p=prof(cur.id);
  $('map').style.setProperty('--ch',(CHAPTERS.find(c=>c.id===mapTab)||{}).col||'');
  const tabs=$('tabs');tabs.innerHTML='';
  CHAPTERS.forEach(c=>{
    const ms=MISSIONS.filter(m=>m.ch===c.id),got=ms.reduce((a,m)=>a+(p.stars[m.id]||0),0);
    const b=document.createElement('button');b.className='tab';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(c.id===mapTab));b.style.setProperty('--ch',c.col);
    b.innerHTML='<span>'+c.em+'</span><span>'+c.title+'</span><span class="ts">'+got+'/'+(ms.length*3)+'★</span>';
    b.onclick=()=>{audio();sfx.tap();renderMap(c.id);};
    tabs.appendChild(b);
  });
  const g=$('missions');g.innerHTML='';
  const list=MISSIONS.filter(m=>m.ch===mapTab);
  g.style.gridTemplateRows='repeat('+Math.ceil(list.length/(window.innerWidth<=760?2:3))+',minmax(0,1fr))';
  list.forEach(m=>{
    const n=p.stars[m.id]||0;
    const b=document.createElement('button');b.className='mcard'+(n>=3?' full':'');
    b.innerHTML='<span class="em">'+m.em+'</span><div class="tt">'+m.title+'</div><div class="bl">'+pr(m.bl[cur.level])+'</div><div class="foot"><div class="bar"><i style="width:'+Math.round(n/3*100)+'%"></i></div><div class="stars" aria-label="'+n+' of 3 stars">'+starStr(n)+'</div></div>';
    b.onclick=()=>{audio();sfx.tap();startMission(m);};
    g.appendChild(b);
  });
  const md=MISSIONS.find(m=>m.mixed),mb=$('mday');
  mb.innerHTML='<span class="em">'+md.em+'</span><span class="tt">'+md.title+'</span><span class="bl">'+md.bl[cur.level]+'</span><span class="stars">'+starStr(p.stars[md.id]||0)+'</span>';
  mb.onclick=()=>{audio();sfx.tap();startMission(md);};
  show('map');
  fitCards();
}
function fitCards(){
  const g=$('missions');if(!g||$('map').hidden)return;
  g.classList.remove('compact');g.style.gridTemplateColumns='';
  const n=g.children.length;
  const clipped=()=>[...g.querySelectorAll('.mcard')].some(c=>{const s=c.querySelector('.stars').getBoundingClientRect(),r=c.getBoundingClientRect();return s.height<1||s.bottom>r.bottom-2||s.top<r.top;});
  if(!clipped())return;
  g.classList.add('compact');
  const cols=(innerWidth>innerHeight&&innerWidth>700)?3:(innerWidth<520?1:2);
  g.style.gridTemplateColumns='repeat('+cols+',minmax(0,1fr))';
  g.style.gridTemplateRows='repeat('+Math.ceil(n/cols)+',minmax(0,1fr))';
}
window.addEventListener('resize',()=>{if(!$('map').hidden&&cur)renderMap();});
$('back').onclick=()=>{
  try{speechSynthesis.cancel();}catch(e){}
  playId++;
  if(!$('play').hidden||!$('result').hidden)renderMap();
  else if(!$('map').hidden)renderHome();
};
$('soundBtn').onclick=()=>{DB.sound=!DB.sound;store.save();$('soundBtn').setAttribute('aria-pressed',String(DB.sound));$('soundBtn').textContent=DB.sound?'🔊':'🔇';audio();musicSync();};
$('soundBtn').setAttribute('aria-pressed',String(DB.sound));$('soundBtn').textContent=DB.sound?'🔊':'🔇';
$('voiceBtn').onclick=()=>{
  if(!cur)return;const p=prof(cur.id);p.voice=!p.voice;store.save();
  $('voiceBtn').setAttribute('aria-pressed',String(p.voice));
  if(p.voice&&S)say($('prompt').textContent);else{try{speechSynthesis.cancel();}catch(e){}}
};
$('again').onclick=()=>{const p=prof(cur.id);const was=p.voice;p.voice=true;say($('prompt').textContent);p.voice=was;};

/* ---------- mission flow ---------- */
function startMission(m){
  M=m;idx=0;pts=0;playId++;if(m.ch)mapTab=m.ch;
  if(m.mixed){
    const pool=['spread','space','pass','block','call','quiz','shoot','sop','gap','box','goalside','mark','cut','back','pounce','angle','line','restart','offside','q:score','q:defend','q:rules','q:foul'];
    let l=shuffle(pool).slice(0,7);
    l.splice(rint(2,5),0,'ready');
    list=l.slice(0,8);
  }else list=m.types.slice();
  $('brand').textContent=m.em+' '+m.title;
  show('play');
  setTimeout(startRound,60);
}
function pr(t){
  if(cur&&t)t=t.replace(/\bYOU\b/g,cur.name.toUpperCase());
  if(ROT&&t)t=t.replace('from left to right','from top to bottom').replace('the top and the bottom','the left and the right');
  if(!cur||cur.id!=='nora'||!t)return t;
  return t.replace(/\bHe\b/g,'She').replace(/\bhe\b/g,'she').replace(/\bHis\b/g,'Her').replace(/\bhis\b/g,'her').replace(/\bhim\b/g,'her');
}
function setPrompt(t){t=pr(t);$('prompt').textContent=t;say(t);}
function gen(fn){for(let i=0;i<8;i++){const s=fn(cur);if(s)return s;}return null;}
function coach(text,kind,showNext,face){
  const c=$('coach');c.hidden=false;c.className=kind||'';c.style.animation='none';void c.offsetWidth;c.style.animation='';
  text=pr(text);$('coachText').textContent=text;$('face').textContent=face||(kind==='ok'?'🧑‍🏫':'🤔');
  $('next').hidden=!showNext;
  if(text)say(text);
}
function finish(p,text){
  try{if(window.KA&&!done){KA.setKid(cur&&cur.id);KA.answer({q:(M&&M.title?M.title+': ':'')+$('prompt').textContent,qid:(S&&S.q&&S.q.id)||((M&&M.id)+':'+(S&&S.type)+':'+$('prompt').textContent),given:p>0?'right':(window._kaGiven||'wrong'),expected:'',correct:p>0,tryNo:p===2?1:2,topic:M&&M.title});window._kaGiven='';}}catch(e){}
  done=true;locked=true;pts+=p;if(p>0)popPoints(p);
  $('ptsInfo').textContent='⭐ '+pts;
  $('controls').hidden=true;$('done').hidden=true;$('here').hidden=true;$('go').hidden=true;
  coach(text,p>0?'ok':'bad',true,p===2?'🎉':p===1?'👍':'💪');
}
$('next').onclick=()=>{
  idx++;
  if(idx>=list.length)finishMission();else startRound();
};
function startRound(){
  const t=list[idx];
  tries=0;done=false;locked=false;dragging=null;fx.length=0;tweens.length=0;parts.length=0;playId++;
  $('coach').hidden=true;$('done').hidden=true;$('here').hidden=true;$('go').hidden=true;$('controls').hidden=true;
  $('choices').hidden=true;$('choices').innerHTML='';
  $('quiz').hidden=true;cv.hidden=false;
  $('roundInfo').textContent='Round '+(idx+1)+'/'+list.length;
  $('ptsInfo').textContent='⭐ '+pts;
  requestAnimationFrame(fit);
  if(t==='quiz'||t==='ready')return startQuiz(t==='ready'?'ready':'general');
  if(t.indexOf('q:')===0)return startQuiz(t.slice(2));
  if(t==='call')return startCall();
  if(t==='pounce')return startPounce();
  const sc=gen(GENS[t]);
  if(!sc)return startQuiz('general');
  startScene(t,sc);
  if(t==='spread'){$('controls').hidden=false;$('done').hidden=false;}
}

