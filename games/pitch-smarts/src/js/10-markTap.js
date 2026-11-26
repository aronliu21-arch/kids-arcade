/* ---------- Mark Up ---------- */
function markTap(a){
  if(locked||done)return;
  locked=true;const me=S.me;
  const spot=()=>{const l=dist(a,OUR_GOAL);return{x:a.x+(OUR_GOAL.x-a.x)*36/l,y:a.y+(OUR_GOAL.y-a.y)*36/l};};
  if(a.cls.good){
    const s=spot();tw(me,{x:s.x,y:s.y},800,()=>{fxText(me.x,me.y-R*3.2-14,'Marked!','#2b8a3e');confetti(me.x,me.y);sfx.good();finish(tries===0?2:1,TIP.mark);});
    return;
  }
  tries++;sfx.bad();
  const msg=a.cls.code==='marked'?"A teammate is already marking him. Look for a red player with nobody near him.":"He is free, but another free player is closer to our goal. Mark the most dangerous one!";
  fxAdd({k:'ring',x:a.x,y:a.y,c:'#ff6b9d'},2500);
  if(a.cls.code==='marked'){const bl=S.blues.slice().sort((p,q)=>dist(p,a)-dist(q,a))[0];if(bl)fxAdd({k:'ring',x:bl.x,y:bl.y,c:'#4dabf7'},2500);}
  const g=S.atts.find(x=>x.cls.good);
  if(tries>=2){
    coach(msg,'bad',false);fxAdd({k:'ring',x:g.x,y:g.y,c:'#69db7c'},5000);
    later(700,()=>{const l=dist(g,OUR_GOAL);tw(me,{x:g.x+(OUR_GOAL.x-g.x)*36/l,y:g.y+(OUR_GOAL.y-g.y)*36/l},800,()=>finish(0,"This red player was free and closest to our goal. Mark him, goal-side."));});
    return;
  }
  locked=false;
  if(cur.hintAfter<=tries)fxAdd({k:'ring',x:g.x,y:g.y,c:'#69db7c'},5000);
  coach(msg+" Try again!"+(cur.hintAfter<=tries?" The green ring shows him.":""),'bad',false);
}

/* ---------- Pounce! (timing) ---------- */
function startPounce(){
  const att={id:'a',team:'d',x:640,y:rnd(170,310)};
  const me={id:'me',team:'a',num:8,me:true,x:att.x-85,y:att.y-6};
  const keeper={id:'k',team:'a',num:1,x:62,y:240};
  S={type:'pounce',att:att,car:att,me:me,keeper:keeper,defs:[att],players:[att,keeper,me],ball:{x:att.x,y:att.y,owner:null},
     phase:'close',end:performance.now()+rnd(1500,2300),i:0,n:5,misses:0,lockUntil:0,finished:false,off:0};
  setPrompt(PROMPT.pounce[cur.level]);
  $('controls').hidden=false;$('go').hidden=false;
}
function pounceTick(now,dt){
  const c=S;
  if(!c.finished&&!done){
    c.att.x=Math.max(230,c.att.x-24*dt);
    c.me.x=c.att.x-85;
    if(now>=c.end){
      if(c.phase==='close'){c.phase='loose';c.end=now+cur.pounceMs;sfx.tap();}
      else{c.i++;if(c.i>=c.n){c.finished=true;locked=true;finish(0,"He kept the ball every time. Wait for a big touch, then pounce!");}
        else{c.phase='close';c.end=now+rnd(1400,2400);}}
    }
  }
  if(!c.stolen){
    const target=c.phase==='loose'&&!c.finished?54:0;
    c.off+=(target-c.off)*Math.min(1,dt*10);
    const bp=ballPos(c.att);c.ball.x=bp.x-c.off-R*.6;c.ball.y=bp.y;
  }
}
function onPounce(){
  audio();
  if(!S||S.type!=='pounce'||locked||done||S.finished)return;
  const now=performance.now();if(now<S.lockUntil)return;
  if(S.phase==='loose'){
    locked=true;S.finished=true;S.stolen=true;
    const p=S.misses===0?2:S.misses<=2?1:0,me=S.me,b=S.ball;
    tw(me,{x:b.x-R*.8,y:b.y-R*1.22},260,()=>{b.owner=me;fxText(me.x,me.y-R*3.2-14,'Got it!','#2b8a3e');confetti(me.x,me.y);sfx.good();
      finish(p,p===0?"You won it, but you dived in too early many times. Wait for the big touch.":TIP.pounce+(S.misses?" Try not to go too early.":" Perfect timing!"));});
  }else{
    S.misses++;S.lockUntil=now+650;sfx.bad();
    fxText(S.att.x,S.att.y-R*2.6-12,'Too early! He dodged.',RED,900);
    const a=S.att,y0=a.y;tw(a,{y:clamp(y0+(Math.random()<.5?-26:26),90,390)},250);
  }
}

/* ---------- In or Out? ---------- */
function pickLine(o,btn){
  locked=true;const ok=o.key===S.answer;markChoice(btn,ok);S.revealed=true;
  const g=S.goal,over=S.by+BALLR>LINE.top&&S.by-BALLR<LINE.bot;
  let why;
  if(S.answer==='out')why=g?"The whole ball crossed the whole line. Goal!":"The whole ball crossed the whole line. Out!";
  else why=over?(g?"Part of the ball is still over the line. No goal yet!":"Part of the ball is still over the line, so it is still in play."):(g?"The ball didn’t reach the line. No goal.":"The ball is inside the pitch. Play on!");
  if(ok){sfx.good();confetti(S.bx,S.by);finish(2,"Right call! "+why);}
  else{sfx.bad();tries++;finish(0,why+" Remember: the whole ball must cross the whole line.");}
}
function drawLineScene(now){
  grass(0,0,W,H,100,false);
  const g=S.goal;
  if(g){
    ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(150,0,500,LINE.top);
    ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1.5;ctx.beginPath();
    for(let x=150;x<=650;x+=22){ctx.moveTo(x,0);ctx.lineTo(x,LINE.top);}for(let y=8;y<LINE.top;y+=22){ctx.moveTo(150,y);ctx.lineTo(650,y);}ctx.stroke();
  }
  ctx.fillStyle='#fff';ctx.fillRect(0,LINE.top,W,LINE.bot-LINE.top);
  if(g){for(const px of [150,650]){ctx.fillStyle='#e9ecef';ctx.strokeStyle='#868e96';ctx.lineWidth=3;ctx.beginPath();ctx.arc(px,(LINE.top+LINE.bot)/2,24,0,6.283);ctx.fill();ctx.stroke();}}
  pillLabel(g?'INSIDE THE GOAL':'OUTSIDE THE PITCH',400,40,'rgba(0,0,0,.45)','#fff');
  pillLabel(g?'THE PITCH ⬇':'THE PITCH ⬇',400,H-28,'rgba(0,0,0,.45)','#fff');
  pillLabel(g?'GOAL LINE':'SIDE LINE',720,LINE.top-20,'#ffd43b','#12301d');
  // ball, top view
  const bx=S.bx,by=S.by;
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(bx+10,by+12,BALLR,BALLR*.9,0,0,6.283);ctx.fill();
  paintBall(ctx,bx,by,BALLR,0,3);
  if(S.revealed){
    ctx.strokeStyle='#ffd43b';ctx.lineWidth=4;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(0,LINE.top);ctx.lineTo(W,LINE.top);ctx.stroke();ctx.setLineDash([]);
    pillLabel('Outer edge of the line',150,LINE.top-20,'#ffd43b','#12301d');
  }
  pillLabel('Close-up, from above',110,40,'rgba(255,255,255,.92)','#12301d');
}

/* ---------- Restart Ref ---------- */
const RS_NAME={throw:'Throw-in',corner:'Corner kick',goalkick:'Goal kick'};
const TEAMNAME={blue:'Blue',red:'Red'};
function showRestartChoices(){
  const a=S.answer;
  let opts;
  if(!cur.restartHard)opts=['throw','corner','goalkick'].map(k=>({label:RS_NAME[k],key:k,ok:k===a.kind}));
  else{
    const all=[];['throw','corner','goalkick'].forEach(k=>['blue','red'].forEach(t=>all.push({label:TEAMNAME[t]+' '+RS_NAME[k].toLowerCase(),key:k+':'+t,ok:k===a.kind&&t===a.team})));
    const right=all.find(o=>o.ok),twin=all.find(o=>!o.ok&&o.key.split(':')[0]===a.kind);
    const rest=shuffle(all.filter(o=>o!==right&&o!==twin)).slice(0,2);
    opts=shuffle([right,twin].concat(rest));
  }
  showChoices(opts,pickRestart);
}
function restartWhy(){
  const a=S.answer,lastName=S.last==='blue'?'our team (blue)':'the red team',getName=a.team==='blue'?'our team (blue)':'the red team';
  if(a.kind==='throw')return "It went over the side line, so it’s a throw-in. "+cap1(lastName)+" touched it last, so "+getName+" throws it in.";
  if(a.kind==='corner')return "It went over the goal line, and the defending team ("+lastName+") touched it last. Corner kick for "+getName+"!";
  return "It went over the goal line, and the attacking team ("+lastName+") touched it last. Goal kick for "+getName+"!";
}
function cap1(t){return t.charAt(0).toUpperCase()+t.slice(1);}
function pickRestart(o,btn){
  const ok=!!o.ok;
  markChoice(btn,ok);
  if(ok){locked=true;S.revealed=true;sfx.good();confetti(S.exit.x,S.exit.y);finish(tries===0?2:1,"Right! "+restartWhy());return;}
  tries++;sfx.bad();
  if(tries>=2){locked=true;S.revealed=true;
    [].forEach.call($('choices').children,b=>{if(b.dataset.ok==='1')markChoice(b,true);b.disabled=true;});
    finish(0,restartWhy());return;}
  coach("Not quite. Look at where it went out, and who touched it last. Try again!",'bad',false);
}
function drawRestartExtras(){
  const t=S.toucher,lq=abv(t,R*2.6+16);
  pillLabel('LAST TOUCH',lq.x,lq.y,'#ffd43b','#12301d');
  if(S.revealed){
    const a=S.answer,e=S.exit;
    const lx=W/2,ly=H/2;
    pillLabel(RS_NAME[a.kind]+': '+TEAMNAME[a.team],lx,ly,a.team==='blue'?'#1c7ed6':'#e03131','#fff');
  }
}

/* ---------- Offside? ---------- */
function pickOffside(o,btn){
  locked=true;const ok=o.key===S.answer;markChoice(btn,ok);S.revealed=true;
  const L=cur.level;
  const why=S.answer==='off'
    ?(L==='easy'?"Only the goalie was nearer the goal than YOU when #10 passed. That’s offside! The flag goes up.":"When #10 passed, YOU had already gone past the second-last red player (the keeper is the last). Offside!")
    :(L==='easy'?"Two red players (the goalie counts!) were nearer the goal than YOU when #10 passed. Onside!":"When #10 passed, YOU had not gone past the second-last red player (the keeper counts). Onside!");
  passBall(S.passer,S.recv,800,()=>{
    if(ok){sfx.good();confetti(S.recv.x,S.recv.y);finish(2,"Right call! "+why);}
    else{sfx.bad();tries++;finish(0,why);}
  });
}
function drawOffsideExtras(now){
  if(!S.revealed)return;
  const x=S.line;
  ctx.strokeStyle='#ffd43b';ctx.lineWidth=4;ctx.setLineDash([12,9]);ctx.beginPath();ctx.moveTo(x,36);ctx.lineTo(x,H-36);ctx.stroke();ctx.setLineDash([]);
  pillLabel('Offside line',x,ROT?H-90:H-22,'#ffd43b','#12301d');
  const sp=S.second;upr(sp.x,sp.y,()=>{ctx.strokeStyle='#ffd43b';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(sp.x,sp.y-R*.35,R*1.55,R*2.05,0,0,6.283);ctx.stroke();});
}

/* ---------- extra drawing on the normal pitch ---------- */
function drawSceneUnder(now){
  if(S.zone){const z=S.zone;ctx.fillStyle='rgba(255,212,59,.22)';ctx.fillRect(z.x0,z.y0,z.x1-z.x0,z.y1-z.y0);
    ctx.strokeStyle='rgba(255,212,59,.9)';ctx.lineWidth=3;ctx.setLineDash([10,8]);ctx.strokeRect(z.x0,z.y0,z.x1-z.x0,z.y1-z.y0);ctx.setLineDash([]);}
  if(S.type==='angle'){
    const a=S.att;ctx.fillStyle='rgba(255,255,255,.13)';ctx.beginPath();ctx.moveTo(a.x,a.y+R*1.2);ctx.lineTo(34,200);ctx.lineTo(34,280);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(OUR_GOAL.x,OUR_GOAL.y);ctx.stroke();ctx.setLineDash([]);
  }
  if(S.type==='restart'){const t=S.toucher,b=S.ball;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=4;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(t.x,t.y+R);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);}
}
function drawSceneOver(now){
  if(S.type==='pounce'&&cur.pounceLabel&&!S.finished){
    const a=S.att,loose=S.phase==='loose',aq=abv(a,R*2.6+16);
    pillLabel(loose?'BIG TOUCH! GO!':'Ball close…',aq.x,aq.y,loose?'#37b24d':'rgba(60,60,60,.85)','#fff');
  }
  if(S.type==='restart')drawRestartExtras();
  if(S.type==='offside')drawOffsideExtras(now);
  if(S.type==='gap'&&!locked&&!done){pillLabel('Tap a gap',S.dx,ROT?H-80:H-18,'rgba(255,255,255,.92)','#12301d');}
}

/* ---------- automated playtest hook (harmless for players) ---------- */
window.__test={
  state:()=>({screen:['home','map','play','result'].find(s=>!$(s).hidden),type:S&&S.type,round:idx+1,of:list.length,done:done,locked:locked,pts:pts,tries:tries}),
  start:(kid,mid)=>{cur=CFG[kid];startMission(MISSIONS.find(m=>m.id===mid));},
  missions:()=>MISSIONS.map(m=>m.id),
  next:()=>{if(done)$('next').click();},
  scroll:()=>({sh:document.documentElement.scrollHeight,ih:window.innerHeight,sw:document.documentElement.scrollWidth,iw:window.innerWidth}),
  solve:()=>{
    if(!S||done||locked)return 'wait';
    const t=S.type;
    if(t==='quiz'){[].find.call($('quiz').children,b=>b.dataset.ok==='1').click();return t;}
    if(['sop','line','restart','offside'].indexOf(t)>=0){[].find.call($('choices').children,b=>b.dataset.ok==='1').click();return t;}
    if(t==='spread'){S.mates.forEach((m,i)=>{m.x=S.sol[i].x;m.y=S.sol[i].y;});$('done').click();return t;}
    if(t==='space'||t==='block'||t==='box'){const b=bestPoint(S,S.good);S.me.x=b.x;S.me.y=b.y;endDragFor();return t;}
    if(DRAG[t]){const b=S.best;S.me.x=b.x;S.me.y=b.y;dropDrag();return t;}
    if(t==='pass'){tapPass(S.mates.find(m=>m.cls.good));return t;}
    if(t==='call'){S.phase='up';S.end=performance.now()+5000;onCall();return t;}
    if(t==='pounce'){S.phase='loose';S.end=performance.now()+5000;onPounce();return t;}
    if(t==='shoot'){shootAt(S.best);return t;}
    if(t==='gap'){gapTap({x:S.dx,y:gapCenter(S.wide)});return t;}
    if(t==='mark'){markTap(S.atts.find(a=>a.cls.good));return t;}
    return 'unknown';
  },
  fail:()=>{
    if(!S||done||locked)return 'wait';
    const t=S.type;
    if(t==='quiz'){[].find.call($('quiz').children,b=>b.dataset.ok==='0'&&!b.disabled).click();return t;}
    if(['sop','line','restart','offside'].indexOf(t)>=0){[].find.call($('choices').children,b=>b.dataset.ok==='0'&&!b.disabled).click();return t;}
    if(t==='spread'){$('done').click();return t;}
    if(t==='space'||t==='block'||t==='box'){endDragFor();return t;}
    if(DRAG[t]){dropDrag();return t;}
    if(t==='pass'){tapPass(S.mates.find(m=>!m.cls.good));return t;}
    if(t==='call'){S.phase='down';S.lockUntil=0;onCall();return t;}
    if(t==='pounce'){S.phase='close';S.lockUntil=0;onPounce();return t;}
    if(t==='shoot'){shootAt({x:S.keeper.home,y:300});return t;}
    if(t==='gap'){gapTap({x:S.dx,y:gapCenter(S.wide===1?0:1)});return t;}
    if(t==='mark'){markTap(S.atts.find(a=>!a.cls.good));return t;}
    return 'unknown';
  }
};

