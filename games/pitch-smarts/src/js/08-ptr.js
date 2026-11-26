/* ---------- input ---------- */
function ptr(e){const r=cv.getBoundingClientRect();if(ROT){const sx=(e.clientX-r.left)*H/r.width,sy=(e.clientY-r.top)*W/r.height;return{x:W-sy,y:sx};}return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
cv.addEventListener('pointerdown',e=>{
  audio();
  if(!S||locked||done)return;
  const p=ptr(e);
  if(S.type==='call'){onCall();return;}
  if(newTap(p))return;
  if(S.type==='pass'){
    let best=null,bd=R*1.8;
    S.mates.forEach(m=>{const d=hitD(m,p);if(d<bd){bd=d;best=m;}});
    if(best)tapPass(best);return;
  }
  if(S.type!=='spread'&&DRAG_TYPES.indexOf(S.type)<0)return;
  const cand=S.type==='spread'?S.mates:[S.me];
  let best=null,bd=R*1.8;
  cand.forEach(m=>{const d=hitD(m,p);if(d<bd){bd=d;best=m;}});
  if(best){dragging={p:best,dx:best.x-p.x,dy:best.y-p.y};try{cv.setPointerCapture(e.pointerId);}catch(er){}sfx.tap();}
});
cv.addEventListener('pointermove',e=>{
  if(!dragging)return;
  const p=ptr(e);
  dragging.p.x=clamp(p.x+dragging.dx,X0,X1);dragging.p.y=clamp(p.y+dragging.dy,Y0,Y1);
});
function endDrag(){
  if(!dragging)return;
  dragging=null;
  if(!S||locked||done)return;
  endDragFor();
}
cv.addEventListener('pointerup',endDrag);
cv.addEventListener('pointercancel',()=>{dragging=null;});

/* ---------- spread ---------- */
$('done').onclick=()=>{
  audio();
  if(!S||S.type!=='spread'||locked||done)return;
  const r=evalSpread(S,cur);
  if(r.ok){
    locked=true;sfx.good();confetti(W/2,H/2);
    finish(tries===0?2:1,TIP.spread);return;
  }
  tries++;sfx.bad();
  const msg={
    marked:"A teammate is standing next to a red player. He would lose the ball!",
    close:"Some blue players are still too close together. Spread out!",
    narrow:"Your team is squished together from left to right. Use the whole pitch!",
    flat:"Everyone is in one line. Use the top and the bottom of the pitch too!"
  }[r.code];
  (r.culprits||[]).forEach(p=>fxAdd({k:'ring',x:p.x,y:p.y,c:'#ff6b9d',r:R+12},3000));
  if(tries>=2){
    locked=true;
    S.mates.forEach((m,i)=>tw(m,{x:S.sol[i].x,y:S.sol[i].y},900,i===0?()=>finish(0,"Here is one way to spread out. Everyone has their own space!"):null));
    coach(msg,'bad',false);
  }else coach(msg+" Try again!",'bad',false);
};

/* ---------- space ---------- */
function dropSpace(){
  const r=evalSpace(S,S.me,cur);
  if(r.ok){
    locked=true;
    passBall(S.car,S.me,750,()=>{confetti(S.me.x,S.me.y);sfx.good();finish(tries===0?2:1,TIP.space);});
    return;
  }
  tries++;sfx.bad();
  const car=S.car,me=S.me;
  let msg="";
  if(r.code==='lane'){msg="A red player is in the pass line. The pass would be stolen!";fxAdd({k:'line',a:car,b:{x:me.x,y:me.y},c:'#ff6b9d'},3000);fxAdd({k:'ring',x:r.defender.x,y:r.defender.y,c:'#ff6b9d'},3000);}
  else if(r.code==='mateLane'){msg="Your teammate is in the way of the pass line.";fxAdd({k:'ring',x:r.mate.x,y:r.mate.y,c:'#ff6b9d'},3000);}
  else if(r.code==='marked'){msg="A red player is right next to you. You are marked!";fxAdd({k:'ring',x:r.defender.x,y:r.defender.y,c:'#ff6b9d'},3000);}
  else if(r.code==='mate'){msg="Too close to a teammate. Two players in one spot is one wasted player!";fxAdd({k:'ring',x:r.mate.x,y:r.mate.y,c:'#ff6b9d'},3000);}
  else if(r.code==='near'){msg="Too close to the ball. Give your friend some room and get open.";}
  else if(r.code==='far'){msg="Too far away. He cannot get the ball to you safely.";}
  else msg="Stay inside the pitch.";
  if(tries>=2){
    locked=true;
    const b=bestPoint(S,S.good);
    coach(msg,'bad',false);
    tw(S.me,{x:b.x,y:b.y},900,()=>passBall(S.car,S.me,750,()=>finish(0,"Here is a good spot: open, safe, and a clear line from the ball.")));
  }else{
    if(cur.hintAfter<=tries)fxAdd({k:'dots',pts:S.good,c:'rgba(255,255,255,.3)'},5000);
    coach(msg+" Try again!"+(cur.hintAfter<=tries?" The light circles show good spots.":""),'bad',false);
  }
}

/* ---------- block ---------- */
function dropBlock(){
  const r=evalBlock(S,S.me,cur);
  if(r.ok){
    locked=true;
    passBall(S.A,S.B,800,()=>{confetti(S.B.x,S.B.y);sfx.good();finish(tries===0?2:1,TIP.block);});
    return;
  }
  tries++;sfx.bad();
  let msg={
    inlane:"You are still in the pass line. Move out of the line!",
    marked:"A red player is right next to you. Find a spot away from the red players.",
    tooclose:"Too close to a teammate. Give some space.",
    far:"Too far away to help.",
    option:"A red player could steal a pass to you there.",
    out:"Stay inside the pitch."
  }[r.code];
  if(r.defender)fxAdd({k:'ring',x:r.defender.x,y:r.defender.y,c:'#ff6b9d'},3000);
  if(r.code==='inlane'){
    locked=true;
    const A=S.A,me=S.me,b=S.ball,bp=ballPos(A);
    b.owner=null;b.x=bp.x;b.y=bp.y;sfx.kick();
    const mp=ballPos(me),pid=playId;
    tw(b,{x:mp.x,y:mp.y},520,()=>{
      fxAdd({k:'text',...abv(me,R*2.6+12),t:'Blocked!',c:'#d6336c'},1500);sfx.bad();
      setTimeout(()=>{
        if(pid!==playId)return;
        if(tries>=2){revealBlock(msg);return;}
        const home=ballPos(A);tw(b,{x:home.x,y:home.y},500,()=>{b.owner=A;locked=false;});
        coach(msg+" Try again!",'bad',false);
      },650);
    });
    return;
  }
  if(tries>=2){revealBlock(msg);return;}
  if(cur.hintAfter<=tries)fxAdd({k:'dots',pts:S.good,c:'rgba(255,255,255,.3)'},5000);
  coach(msg+" Try again!"+(cur.hintAfter<=tries?" The light circles show good spots.":""),'bad',false);
}
function revealBlock(msg){
  locked=true;
  const b=bestPoint(S,S.good);
  coach(msg,'bad',false);
  const A=S.A,ball=S.ball,home=ballPos(A);
  tw(ball,{x:home.x,y:home.y},400,()=>{
    ball.owner=A;
    tw(S.me,{x:b.x,y:b.y},900,()=>passBall(S.A,S.B,800,()=>finish(0,"Here is a good spot: out of the pass line, away from red players.")));
  });
}

/* ---------- pass ---------- */
function tapPass(m){
  locked=true;
  const c=m.cls;
  if(c.good){
    passBall(S.car,m,700,()=>{confetti(m.x,m.y);sfx.good();finish(tries===0?2:1,TIP.pass);});
    return;
  }
  tries++;
  const b=S.ball,bp=ballPos(S.car);b.owner=null;b.x=bp.x;b.y=bp.y;sfx.kick();
  const dp=ballPos(c.defender);
  fxAdd({k:'line',a:S.car,b:{x:m.x,y:m.y},c:'#ff6b9d'},3200);
  fxAdd({k:'ring',x:c.defender.x,y:c.defender.y,c:'#ff6b9d'},3200);
  const pid=playId;
  tw(b,{x:dp.x,y:dp.y},620,()=>{
    sfx.bad();
    fxAdd({k:'text',...abv(c.defender,R*2.6+12),t:'Stolen!',c:'#d6336c'},1500);
    const msg=c.code==='marked'?"That teammate had a red player right next to him. He steals it!":"A red player was in the pass line. He steals it!";
    setTimeout(()=>{
      if(pid!==playId)return;
      if(tries>=2){
        const g=S.mates.find(x=>x.cls.good);
        fxAdd({k:'ring',x:g.x,y:g.y,c:'#69db7c'},4000);
        const home=ballPos(S.car);
        tw(b,{x:home.x,y:home.y},450,()=>{b.owner=S.car;setTimeout(()=>{if(pid===playId)passBall(S.car,g,700,()=>finish(0,"This teammate was open: no red player close, and a clear line."));},400);});
        coach(msg,'bad',false);
        return;
      }
      const home=ballPos(S.car);
      tw(b,{x:home.x,y:home.y},450,()=>{b.owner=S.car;locked=false;});
      if(cur.hintAfter<=tries)S.mates.filter(x=>x.cls.good).forEach(g=>fxAdd({k:'ring',x:g.x,y:g.y,c:'#69db7c'},5000));
      coach(msg+" Try again!"+(cur.hintAfter<=tries?" The green ring shows who is open.":""),'bad',false);
    },600);
  });
}

/* ---------- call & be ready ---------- */
function startCall(){
  const car={id:'c',team:'a',num:10,x:230,y:250,ball:true};
  const me={id:'me',team:'a',num:8,me:true,x:560,y:190};
  const defs=[{id:'d0',team:'d',x:470,y:340},{id:'d1',team:'d',x:640,y:300}];
  S={type:'call',car:car,me:me,defs:defs,players:[].concat(defs,[car,me]),ball:{x:car.x,y:car.y,owner:car},
     phase:'down',end:performance.now()+rnd(1500,2300),i:0,n:5,hit:false,misses:0,lockUntil:0,finished:false,upMs:cur.upMs};
  setPrompt(PROMPT.call[cur.level]);
  $('controls').hidden=false;$('here').hidden=false;
}
function callTick(now){
  const c=S;if(c.finished||done||now<c.end)return;
  if(c.phase==='down'){c.phase='up';c.end=now+c.upMs;sfx.tap();}
  else{
    c.i++;
    if(c.i>=c.n){
      c.finished=true;locked=true;
      finish(0,"Nobody called when he looked up, so he never passed. Watch his head: call only when it comes up!");
    }else{c.phase='down';c.end=now+rnd(1400,2400);}
  }
}
function onCall(){
  audio();
  if(!S||S.type!=='call'||locked||done||S.finished)return;
  const now=performance.now();if(now<S.lockUntil)return;
  if(S.phase==='up'){
    locked=true;S.finished=true;
    const p=S.misses===0?2:S.misses<=2?1:0;
    fxAdd({k:'text',...abv(S.car,R*2.3+94),t:'He saw you!',c:'#2b8a3e'},1800);
    passBall(S.car,S.me,800,()=>{
      confetti(S.me.x,S.me.y);sfx.good();
      finish(p,p===0?"You got the ball, but you called too many times when he could not see you. Wait for his head to come up.":
        (S.misses?TIP.call+" Try not to call when his head is down.":TIP.call+" Perfect timing!"));
    });
  }else{
    S.misses++;S.lockUntil=now+600;sfx.bad();
    fxAdd({k:'text',...abv(S.car,R*2.3+94),t:'Head down!',c:'#d6336c'},900);
  }
}
$('here').onclick=onCall;
$('go').onclick=onPounce;

/* ---------- quiz ---------- */
function pickQuiz(tag){
  const p=prof(cur.id);
  let pool=QUIZ.filter(q=>q.for===cur.id&&q.tag===tag);
  let fresh=pool.filter(q=>p.seen.indexOf(q.id)<0);
  if(!fresh.length){p.seen=p.seen.filter(id=>!pool.some(q=>q.id===id));fresh=pool;}
  const q=pick(fresh);
  if(p.seen.indexOf(q.id)<0)p.seen.push(q.id);
  store.save();
  return q;
}
function startQuiz(tag){
  const q=pickQuiz(tag);
  S={type:'quiz',q:q};
  cv.hidden=true;const box=$('quiz');box.hidden=false;box.innerHTML='';
  setPrompt(q.q);
  const opts=shuffle(q.o.map((t,i)=>({t:t,ok:i===0})));
  opts.forEach(o=>{
    const b=document.createElement('button');b.className='opt';b.textContent=pr(o.t);b.dataset.ok=o.ok?'1':'0';
    b.onclick=()=>{
      audio();
      if(done)return;
      if(o.ok){
        b.classList.add('ok');sfx.good();
        finish(tries===0?2:1,q.why);
      }else{
        b.classList.add('bad');b.disabled=true;tries++;sfx.bad();
        if(tries>=2||opts.length<=2){
          [].forEach.call(box.children,(x,i)=>{if(opts[i].ok)x.classList.add('ok');x.disabled=true;});
          finish(0,"The answer was: "+pr(q.o[0])+". "+pr(q.why));
        }else coach("Not quite. Try again!",'bad',false);
      }
    };
    box.appendChild(b);
  });
}


/* ================= NEW MISSION ENGINE: scoring, defending, rules ================= */
const GENS={spread:genSpread,space:genSpace,pass:genPass,block:genBlock,shoot:genShoot,sop:genSOP,gap:genGap,box:genBox,
  goalside:genGoalSide,mark:genMark,cut:genCut,back:genBack,angle:genAngle,line:genLine,restart:genRestart,offside:genOffside};
const DRAG_TYPES=['space','block','box','goalside','cut','back','angle'];
const RED='#d6336c';
const later=(ms,fn)=>{const pid=playId;setTimeout(()=>{if(pid===playId)fn();},ms);};
const goalPt=y=>({x:782,y:clamp(y,212,268)});
function fxText(x,y,t,c,ms){fxAdd({k:'text',x:x,y:y,t:t,c:c||RED},ms||1500);}

/* ---------- choice buttons in the footer ---------- */
function showChoices(opts,onPick){
  opts.forEach(o=>{if(o.ok===undefined)o.ok=o.key===S.answer;});
  const box=$('choices');box.innerHTML='';box.hidden=false;$('controls').hidden=false;
  opts.forEach(o=>{
    const b=document.createElement('button');b.className='btn big choice';b.textContent=pr(o.label);b.dataset.ok=o.ok?'1':'0';
    b.onclick=()=>{audio();if(locked||done||b.disabled)return;sfx.tap();onPick(o,b);};
    box.appendChild(b);
  });
}
function markChoice(b,ok){if(!ok&&b&&!b.disabled)window._kaGiven=b.textContent.trim();b.style.background=ok?'var(--ok)':'var(--bad)';b.style.color='#fff';b.disabled=true;}

/* ---------- start a scene ---------- */
function startScene(t,sc){
  S=sc;
  if(!S.ball){const owner=t==='block'?sc.A:sc.car;if(owner)S.ball={x:owner.x,y:owner.y,owner:owner};}
  if(t==='shoot'){S.ball={x:400,y:452,r:26,owner:null};S.keeper.tilt=0;S.keeper.home=S.keeper.x;}
  if(t==='box')S.zone=ZONE;
  const L=cur.level;
  if(t==='line'){setPrompt(PROMPT[S.goal?'lineGoal':'line'][L]);
    showChoices(S.goal?[{label:'⚽ GOAL!',key:'out'},{label:'🚫 NO GOAL',key:'in'}]:[{label:'✅ IN',key:'in'},{label:'❌ OUT',key:'out'}],pickLine);return;}
  setPrompt(PROMPT[t][L]);
  if(t==='sop')showChoices([{label:'⚽ Shoot!',key:'shoot'},{label:'➜ Pass to #7',key:'pass'}],pickSOP);
  else if(t==='restart')showRestartChoices();
  else if(t==='offside'){
    fxAdd({k:'line',a:S.passer,b:{x:S.recv.x,y:S.recv.y},c:'rgba(255,255,255,.9)'},60000);
    showChoices([{label:'✅ Onside',key:'on'},{label:'🚩 Offside',key:'off'}],pickOffside);
  }
  else if(t==='mark'){S.atts.forEach(a=>a.tap=true);}
  if(t==='offside')S.recv.me=true;
}

