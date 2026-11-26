/* ---------- canvas taps for the new types ---------- */
function newTap(p){
  if(S.type==='shoot'){shootAt(p);return true;}
  if(S.type==='gap'){gapTap(p);return true;}
  if(S.type==='pounce'){onPounce();return true;}
  if(S.type==='mark'){
    let best=null,bd=R*1.8;
    S.atts.forEach(a=>{const d=hitD(a,p);if(d<bd){bd=d;best=a;}});
    if(best)markTap(best);return true;
  }
  if(['sop','line','restart','offside'].indexOf(S.type)>=0)return true;
  return false;
}

/* ---------- Pick the Corner ---------- */
function shootAt(p){
  if(locked||done)return;
  locked=true;
  const r=evalShoot(S,p,cur),k=S.keeper,b=S.ball;
  S.aim={x:p.x,y:p.y};sfx.kick();
  const dir=Math.sign(p.x-k.home)||1;
  const reach=r.code==='saved'||r.code==='middle'?Math.abs(p.x-k.home):Math.min(Math.abs(p.x-k.home),cur.shootReach*.75);
  tw(k,{x:k.home+dir*reach*.85,tilt:dir*Math.min(1.1,reach/120)},380);
  const end=(r.code==='saved'||r.code==='middle')?{x:k.home+dir*reach*.85,y:clamp(p.y,250,360)}:{x:p.x,y:p.y};
  tw(b,{x:end.x,y:end.y,r:15},480,()=>{
    if(r.ok){
      S.ripple=performance.now();confetti(p.x,p.y);sfx.good();fxText(400,70,'GOAL!','#2b8a3e',1800);
      finish(tries===0?2:1,TIP.shoot);return;
    }
    tries++;sfx.bad();
    const msg={wide:"Missed the goal! Aim inside the posts.",saved:"Saved! That was too close to the goalie.",middle:"Saved! The keeper can still dive there. Aim closer to a post."}[r.code];
    fxText(end.x,end.y-40,r.code==='wide'?'Wide!':'Saved!',RED,1200);
    later(900,()=>{
      tw(k,{x:k.home,tilt:0},300);tw(b,{x:400,y:452,r:26},300);S.aim=null;
      if(tries>=2){
        coach(msg,'bad',false);
        S.showBest=true;
        later(800,()=>{locked=false;shootReveal();});
        return;
      }
      locked=false;
      if(cur.hintAfter<=tries)S.hintZone=true;
      coach(msg+" Try again!"+(cur.hintAfter<=tries?" Shoot into a green zone.":""),'bad',false);
    });
  });
}
function shootReveal(){
  locked=true;const p=S.best,k=S.keeper,b=S.ball;S.aim={x:p.x,y:p.y};sfx.kick();
  tw(k,{x:k.home+(p.x>k.home?1:-1)*cur.shootReach*.6,tilt:(p.x>k.home?1:-1)*.7},380);
  tw(b,{x:p.x,y:p.y,r:15},480,()=>{S.ripple=performance.now();confetti(p.x,p.y);sfx.good();
    finish(0,"Here is the shot: low, near the post, far from the keeper.");});
}
function drawShootScene(now){
  const k=S.keeper;
  const sky=ctx.createLinearGradient(0,0,0,200);sky.addColorStop(0,'#74c0fc');sky.addColorStop(1,'#d0ebff');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,200);
  ctx.fillStyle='#5c7cfa';ctx.fillRect(0,150,W,50);
  ctx.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<40;i++){ctx.beginPath();ctx.arc((i*53)%W+10,160+(i*17)%30,4,0,6.283);ctx.fill();}
  grass(0,200,W,H-200,24,true);
  // net
  const rip=S.ripple?Math.max(0,1-(now-S.ripple)/900):0;
  ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(GF.l,GF.top,GF.r-GF.l,GF.bot-GF.top);
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.5;ctx.beginPath();
  for(let x=GF.l;x<=GF.r;x+=20){const w=rip*Math.sin((x+now/20)/18)*6;ctx.moveTo(x+w,GF.top);ctx.lineTo(x-w,GF.bot);}
  for(let y=GF.top;y<=GF.bot;y+=20){const w=rip*Math.sin((y+now/20)/18)*6;ctx.moveTo(GF.l,y+w);ctx.lineTo(GF.r,y-w);}
  ctx.stroke();
  if(S.hintZone||S.showBest){
    ctx.fillStyle='rgba(105,219,124,.38)';
    for(let x=GF.l+14;x<GF.r-14;x+=8){if(evalShoot(S,{x:x+4,y:300},cur).ok)ctx.fillRect(x,GF.top+14,8,GF.bot-GF.top-14);}
  }
  // keeper (drawn big, diving with tilt)
  const r0=R;R=52;
  const fy=GF.bot-6;k.y=fy-R*1.4;
  ctx.save();ctx.translate(k.x,fy);ctx.rotate((k.tilt||0)*.9);ctx.translate(-k.x,-fy);
  drawPlayer(k,now);ctx.restore();R=r0;
  // posts and bar
  ctx.fillStyle='#fff';ctx.strokeStyle='#adb5bd';ctx.lineWidth=2;
  ctx.fillRect(GF.l-14,GF.top-14,14,GF.bot-GF.top+14);ctx.fillRect(GF.r,GF.top-14,14,GF.bot-GF.top+14);ctx.fillRect(GF.l-14,GF.top-14,GF.r-GF.l+28,14);
  ctx.strokeRect(GF.l-14,GF.top-14,GF.r-GF.l+28,GF.bot-GF.top+14);
  ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,GF.bot);ctx.lineTo(W,GF.bot);ctx.stroke();
  if(S.aim){ctx.strokeStyle='#ffd43b';ctx.lineWidth=4;ctx.beginPath();ctx.arc(S.aim.x,S.aim.y,22,0,6.283);ctx.moveTo(S.aim.x-30,S.aim.y);ctx.lineTo(S.aim.x+30,S.aim.y);ctx.moveTo(S.aim.x,S.aim.y-30);ctx.lineTo(S.aim.x,S.aim.y+30);ctx.stroke();}
  if(S.showBest){const p=S.best;ctx.strokeStyle='#69db7c';ctx.lineWidth=5;ctx.beginPath();ctx.arc(p.x,p.y,26,0,6.283);ctx.stroke();}
  // penalty spot + ball
  ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(400,468,18,5,0,0,6.283);ctx.fill();
  const b=S.ball;drawBall(b.x,b.y,b.r);
  pillLabel('Tap where to shoot',400,26,'rgba(255,255,255,.92)','#12301d');
}

/* ---------- Shoot or Pass? ---------- */
function shootTo(from,cb){
  const b=S.ball,bp=ballPos(from);b.owner=null;b.x=bp.x;b.y=bp.y;sfx.kick();
  const g=goalPt(from.y);tw(b,{x:g.x,y:g.y},650,()=>{confetti(g.x-10,g.y);sfx.good();fxText(700,120,'GOAL!','#2b8a3e',1600);if(cb)cb();});
}
function pickSOP(o,btn){
  locked=true;const ok=o.key===S.answer;markChoice(btn,ok);
  const me=S.me,mate=S.mate;
  if(ok){
    if(o.key==='shoot')shootTo(me,()=>finish(2,TIP.sop));
    else passBall(me,mate,650,()=>later(250,()=>shootTo(mate,()=>finish(2,TIP.sop))));
    return;
  }
  sfx.bad();tries++;
  const b=S.ball,bp=ballPos(me);b.owner=null;b.x=bp.x;b.y=bp.y;
  let msg;
  if(o.key==='shoot'){
    const tgt=S.tooFar?S.keeper:S.blocker;
    tw(b,{x:tgt.x,y:tgt.y+R*.9},560,()=>fxText(tgt.x,tgt.y-R*2.6-12,S.tooFar?'Saved!':'Blocked!'));
    if(S.blocker&&!S.tooFar)fxAdd({k:'ring',x:S.blocker.x,y:S.blocker.y,c:'#ff6b9d'},4000);
    msg=S.tooFar?"Too far to shoot. #7 was open and closer to the goal. Pass!":"A red player was blocking your shot. #7 was open and closer to the goal. Pass!";
    later(1300,()=>{const h=ballPos(me);tw(b,{x:h.x,y:h.y},350,()=>{b.owner=me;fxAdd({k:'ring',x:mate.x,y:mate.y,c:'#69db7c'},4000);
      later(300,()=>passBall(me,mate,650,()=>later(250,()=>shootTo(mate,()=>finish(0,msg)))));});});
  }else{
    const st=S.stealer;
    tw(b,{x:st.x,y:st.y+R*.9},560,()=>fxText(st.x,st.y-R*2.6-12,'Stolen!'));
    fxAdd({k:'ring',x:st.x,y:st.y,c:'#ff6b9d'},4000);
    msg="The pass to #7 wasn’t safe, and YOU had a clear path to goal. Shoot!";
    later(1300,()=>{const h=ballPos(me);tw(b,{x:h.x,y:h.y},350,()=>{b.owner=me;later(250,()=>shootTo(me,()=>finish(0,msg)));});});
  }
  coach(msg,'bad',false);
}

/* ---------- Find the Gap ---------- */
function gapCenter(i){return (S.ys[i]+S.ys[i+1])/2;}
function gapTap(p){
  if(locked||done)return;
  locked=true;const i=gapIndex(S,p.y),me=S.me,gy=gapCenter(i);
  const home={x:me.x,y:me.y};
  if(i===S.wide){
    tw(me,{x:S.dx-30,y:gy},500,()=>tw(me,{x:S.dx+150,y:gy},600,()=>later(150,()=>shootTo(me,()=>finish(tries===0?2:1,TIP.gap)))));
    return;
  }
  tries++;
  // the nearest defender of that gap steps across
  const d=S.defs.slice().sort((a,b)=>Math.abs(a.y-gy)-Math.abs(b.y-gy))[0],dh={x:d.x,y:d.y};
  tw(me,{x:S.dx-50,y:gy},520);
  tw(d,{x:S.dx-18,y:gy},420,()=>{sfx.bad();fxText(d.x,d.y-R*2.6-12,'Tackled!');});
  const msg="That gap was too small. A defender closed it!";
  later(1200,()=>{
    tw(d,{x:dh.x,y:dh.y},350);tw(me,{x:home.x,y:home.y},400,()=>{
      if(tries>=2){
        coach(msg,'bad',false);
        const wy=gapCenter(S.wide);fxAdd({k:'dots',pts:[-40,-20,0,20,40].map(o=>({x:S.dx+o*.6,y:wy+o})),c:'rgba(105,219,124,.75)'},5000);
        later(600,()=>tw(me,{x:S.dx-30,y:wy},500,()=>tw(me,{x:S.dx+150,y:wy},600,()=>later(150,()=>shootTo(me,()=>finish(0,"Here is the big gap. Look for the widest space between two defenders."))))));
        return;
      }
      locked=false;
      if(cur.hintAfter<=tries){const wy=gapCenter(S.wide);fxAdd({k:'dots',pts:[-30,0,30].map(o=>({x:S.dx,y:wy+o})),c:'rgba(255,255,255,.5)'},5000);}
      coach(msg+" Try again!"+(cur.hintAfter<=tries?" The light circles show the big gap.":""),'bad',false);
    });
  });
}

/* ---------- drag missions: box, goal-side, cut, back, angle ---------- */
const DRAG={
  box:{ev:evalBox,best:s=>bestPoint(s,s.good),
    msg:{zone:"Get into the yellow zone in front of the goal.",keeper:"Too close to the keeper. He will grab the cross.",marked:"A red player is right next to you. He will win the ball.",lane:"A red player is in the line of the cross. He will cut it out."},
    win:(cb)=>passBall(S.car,S.me,700,()=>later(200,()=>shootTo(S.me,cb))),reveal:"Here is an open spot in the zone: away from defenders, with a clear line for the cross."},
  goalside:{ev:evalGoalSide,best:s=>s.best,line:s=>[s.att,OUR_GOAL],
    msg:{behind:"You are behind him! Get between him and our goal.",side:"Not on his path. Stand in the line between him and our goal.",close:"Too close! He can dodge right past you. Leave a little space.",far:"Too far away. Get closer so you can stop him."},
    win:(cb)=>{const a=S.att,me=S.me;tw(a,{x:a.x-25,y:a.y+(me.y-a.y)*.2},400,()=>{const b=S.ball;b.owner=null;const mp=ballPos(me);tw(b,{x:mp.x,y:mp.y},350,()=>{b.owner=me;fxText(me.x,me.y-R*3.2-14,'Stopped!','#2b8a3e');confetti(me.x,me.y);sfx.good();cb();});});},
    reveal:"Here is goal-side: right in his path to our goal, a few steps away."},
  cut:{ev:evalCut,best:s=>s.best,line:s=>[s.A,s.B],
    msg:{off:"You are not in the pass line. Stand on the line between the two red players.",nearA:"Too close to the passer. He will just go around you.",nearB:"Too close to the receiver. Step a little toward the ball."},
    win:(cb)=>{const b=S.ball,bp=ballPos(S.A);b.owner=null;b.x=bp.x;b.y=bp.y;sfx.kick();const mp=ballPos(S.me);tw(b,{x:mp.x,y:mp.y},600,()=>{b.owner=S.me;fxText(S.me.x,S.me.y-R*3.2-14,'Intercepted!','#2b8a3e');confetti(S.me.x,S.me.y);sfx.good();cb();});},
    reveal:"Here is the pass line. Standing on it lets you steal the ball."},
  back:{ev:evalBack,best:s=>s.best,line:s=>[s.att,OUR_GOAL],
    msg:{ahead:"You are still on the wrong side of the ball. Run back past it, toward our goal.",deep:"Not inside our goal! Stay in front of it.",wide:"Get to the middle, in front of our goal.",path:"Get onto his path to our goal."},
    win:(cb)=>{const a=S.att,me=S.me;tw(a,{x:a.x-40,y:a.y+(me.y-a.y)*.2},500,()=>{const b=S.ball;b.owner=null;const mp=ballPos(me);tw(b,{x:mp.x,y:mp.y},350,()=>{b.owner=me;fxText(me.x,me.y-R*3.2-14,'Back in time!','#2b8a3e');confetti(me.x,me.y);sfx.good();cb();});});},
    reveal:"Here is the spot: back between the ball and our goal, in the middle."},
  angle:{ev:evalAngle,best:s=>s.best,line:s=>[s.att,OUR_GOAL],
    msg:{far:"Too far out of the goal. He could shoot over you.",angle:"Not on the line. Stand between the ball and the middle of the goal.",line:"Step a little off the goal line to cover more goal."},
    win:(cb)=>{const b=S.ball,bp=ballPos(S.att);b.owner=null;b.x=bp.x;b.y=bp.y;sfx.kick();const mp={x:S.me.x+6,y:S.me.y-R*.2};tw(b,{x:mp.x,y:mp.y},500,()=>{fxText(S.me.x+40,S.me.y-R*3.2-14,'Saved!','#2b8a3e');confetti(S.me.x,S.me.y);sfx.good();cb();});},
    reveal:"Here is the keeper spot: on the line from the ball to the middle of the goal."}
};
function dropDrag(){
  const t=S.type,D=DRAG[t],r=D.ev(S,S.me,cur);
  if(r.ok){locked=true;D.win(()=>finish(tries===0?2:1,TIP[t]));return;}
  tries++;sfx.bad();
  const msg=D.msg[r.code]||"Not quite.";
  if(r.defender)fxAdd({k:'ring',x:r.defender.x,y:r.defender.y,c:'#ff6b9d'},3000);
  if(D.line&&['side','off','angle','path'].indexOf(r.code)>=0){const l=D.line(S);fxAdd({k:'line',a:l[0],b:l[1],c:'#ff6b9d'},3500);}
  if(r.code==='lane')fxAdd({k:'line',a:S.car,b:{x:S.me.x,y:S.me.y},c:'#ff6b9d'},3000);
  if(tries>=2){
    locked=true;coach(msg,'bad',false);
    const b=D.best(S);
    tw(S.me,{x:b.x,y:b.y},900,()=>later(200,()=>D.win(()=>finish(0,D.reveal))));
    return;
  }
  if(cur.hintAfter<=tries&&S.good)fxAdd({k:'dots',pts:S.good,c:'rgba(255,255,255,.3)'},5000);
  coach(msg+" Try again!"+(cur.hintAfter<=tries&&S.good?" The light circles show good spots.":""),'bad',false);
}

function endDragFor(){
  if(S.type==='space')dropSpace();
  else if(S.type==='block')dropBlock();
  else if(DRAG[S.type])dropDrag();
}

