
// ==LOGIC-START
const W=800,H=480,X0=58,X1=742,Y0=58,Y1=422;
const FX=[X0,X1],FY=[Y0,Y1];
const rnd=(a,b)=>a+Math.random()*(b-a);
const rint=(a,b)=>Math.floor(rnd(a,b+1));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=r[i];r[i]=r[j];r[j]=t;}return r;};
function segDist(p,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy;
  let t=l2?((p.x-a.x)*dx+(p.y-a.y)*dy)/l2:0;t=clamp(t,0,1);
  return Math.hypot(p.x-(a.x+t*dx),p.y-(a.y+t*dy));
}
function placeP(test,xr,yr,tries){
  tries=tries||150;
  for(let i=0;i<tries;i++){const p={x:rnd(xr[0],xr[1]),y:rnd(yr[0],yr[1])};if(test(p))return p;}
  return null;
}

/* Difficulty per kid. Lucas (6): fewer red players, roomier rules, hints. Nora (9): more players, tighter rules. */
const CFG={
  lucas:{id:'lucas',name:'Lucas',level:'easy',
    spreadMates:2,spaceMates:1,spaceDefs:2,spreadDefs:2,passMates:3,passRoles:['mark','block','free'],passMaxGood:2,passNeedBoth:false,blockDefs:1,
    pairMin:100,xRange:200,yRange:0,defMin:58,
    dMin:100,dMax:340,mateMin:85,defNear:66,lane:38,
    passLane:36,passMark:64,blockLane:46,blockEnd:80,blockOption:false,upMs:1600,hintAfter:1},
  nora:{id:'nora',name:'Nora',level:'hard',
    spreadMates:3,spaceMates:2,spaceDefs:3,spreadDefs:3,passMates:4,passRoles:['mark','block','mark','free'],passMaxGood:2,passNeedBoth:true,blockDefs:2,
    pairMin:115,xRange:260,yRange:170,defMin:62,
    dMin:110,dMax:300,mateMin:95,defNear:72,lane:40,
    passLane:34,passMark:62,blockLane:44,blockEnd:85,blockOption:true,upMs:900,hintAfter:99}
};

/* ---------- Spread out ---------- */
function evalSpread(sc,cfg){
  const blue=[sc.car].concat(sc.mates);
  for(const m of sc.mates)for(const d of sc.defs)if(dist(m,d)<cfg.defMin)return{ok:false,code:'marked',culprits:[m]};
  let worst=null;
  for(let i=0;i<blue.length;i++)for(let j=i+1;j<blue.length;j++){
    const dd=dist(blue[i],blue[j]);
    if(dd<cfg.pairMin&&(!worst||dd<worst.d))worst={a:blue[i],b:blue[j],d:dd};
  }
  if(worst)return{ok:false,code:'close',culprits:[worst.a,worst.b]};
  const xs=blue.map(p=>p.x),ys=blue.map(p=>p.y);
  if(Math.max.apply(null,xs)-Math.min.apply(null,xs)<cfg.xRange)return{ok:false,code:'narrow'};
  if(cfg.yRange&&Math.max.apply(null,ys)-Math.min.apply(null,ys)<cfg.yRange)return{ok:false,code:'flat'};
  return{ok:true};
}
function solveSpread(sc,cfg){
  const saved=sc.mates.map(m=>({x:m.x,y:m.y}));
  let sol=null;
  for(let t=0;t<12000&&!sol;t++){
    sc.mates.forEach(m=>{m.x=rnd(X0,X1);m.y=rnd(Y0,Y1);});
    if(evalSpread(sc,cfg).ok)sol=sc.mates.map(m=>({x:m.x,y:m.y}));
  }
  sc.mates.forEach((m,i)=>{m.x=saved[i].x;m.y=saved[i].y;});
  return sol;
}
function genSpread(cfg){
  for(let k=0;k<120;k++){
    const car={id:'c',team:'a',num:10,x:rnd(330,440),y:rnd(190,290),ball:true};
    const n=cfg.spreadMates,nums=shuffle([2,4,5,7,8,9,11]).slice(0,n),a0=rnd(0,6.28),mates=[];
    for(let i=0;i<n;i++){
      const a=a0+i*6.283/n+rnd(-.3,.3),r=rnd(44,62);
      mates.push({id:'m'+i,team:'a',num:nums[i],drag:true,x:car.x+Math.cos(a)*r,y:car.y+Math.sin(a)*r});
    }
    const defs=[];let ok=true;
    for(let i=0;i<cfg.spreadDefs;i++){
      const q=placeP(p=>dist(p,car)>=150&&defs.every(d=>dist(d,p)>=130),FX,FY);
      if(!q){ok=false;break;}
      defs.push({id:'d'+i,team:'d',x:q.x,y:q.y});
    }
    if(!ok)continue;
    const sc={type:'spread',car:car,mates:mates,defs:defs,players:[].concat(defs,mates,[car])};
    if(evalSpread(sc,cfg).ok)continue;
    const sol=solveSpread(sc,cfg);if(!sol)continue;
    sc.sol=sol;return sc;
  }
  return null;
}

/* ---------- Find the space ---------- */
function evalSpace(sc,p,cfg){
  const car=sc.car;
  if(p.x<X0||p.x>X1||p.y<Y0||p.y>Y1)return{ok:false,code:'out'};
  for(const d of sc.defs)if(segDist(d,car,p)<cfg.lane)return{ok:false,code:'lane',defender:d};
  for(const m of sc.mates)if(segDist(m,car,p)<cfg.lane-8)return{ok:false,code:'mateLane',mate:m};
  for(const d of sc.defs)if(dist(d,p)<cfg.defNear)return{ok:false,code:'marked',defender:d};
  for(const m of sc.mates)if(dist(m,p)<cfg.mateMin)return{ok:false,code:'mate',mate:m};
  const dc=dist(car,p);
  if(dc<cfg.dMin)return{ok:false,code:'near'};
  if(dc>cfg.dMax)return{ok:false,code:'far'};
  return{ok:true};
}
function goodPoints(sc,cfg,fn){
  const pts=[];
  for(let x=X0;x<=X1;x+=18)for(let y=Y0;y<=Y1;y+=18){const p={x:x,y:y};if(fn(sc,p,cfg).ok)pts.push(p);}
  return pts;
}
function bestPoint(sc,pts){
  let best=null,bs=-1;
  const refs=sc.defs.concat(sc.refs||[]);
  for(const p of pts){let m=1e9;for(const o of refs)m=Math.min(m,dist(o,p));if(m>bs){bs=m;best=p;}}
  return best;
}
function genSpace(cfg){
  for(let k=0;k<300;k++){
    const car={id:'c',team:'a',num:10,x:rnd(230,430),y:rnd(150,330),ball:true};
    const ang=rnd(0,6.28);
    const me={id:'me',team:'a',num:8,me:true,drag:true,x:car.x+Math.cos(ang)*46,y:car.y+Math.sin(ang)*46};
    const mates=[],nums=[4,7,9,11];let ok=true;
    for(let i=0;i<cfg.spaceMates;i++){
      const q=placeP(p=>[car,me].concat(mates).every(e=>dist(e,p)>=140),FX,FY);
      if(!q){ok=false;break;}
      mates.push({id:'t'+i,team:'a',num:nums[i],x:q.x,y:q.y});
    }
    if(!ok)continue;
    const defs=[];
    for(let i=0;i<cfg.spaceDefs;i++){
      const q=placeP(p=>[car,me].concat(mates,defs).every(e=>dist(e,p)>=110),FX,FY);
      if(!q){ok=false;break;}
      defs.push({id:'d'+i,team:'d',x:q.x,y:q.y});
    }
    if(!ok)continue;
    const sc={type:'space',car:car,me:me,mates:mates,defs:defs,refs:mates.concat([car]),players:[].concat(defs,mates,[car,me])};
    if(evalSpace(sc,me,cfg).ok)continue;
    const good=goodPoints(sc,cfg,evalSpace);
    if(good.length<30)continue;
    sc.good=good;return sc;
  }
  return null;
}

/* ---------- Pick the pass ---------- */
function classifyMate(sc,m,cfg){
  let near=null,nd=1e9;
  for(const d of sc.defs){const dd=dist(d,m);if(dd<nd){nd=dd;near=d;}}
  if(nd<cfg.passMark)return{good:false,code:'marked',defender:near};
  for(const d of sc.defs)if(segDist(d,sc.car,m)<cfg.passLane)return{good:false,code:'lane',defender:d};
  return{good:true};
}
function genPass(cfg){
  for(let k=0;k<5000;k++){
    const car={id:'c',team:'a',num:10,me:true,ball:true,x:rnd(110,230),y:rnd(150,330)};
    const mates=[],nums=shuffle([4,7,9,11,5,8]);let ok=true;
    for(let i=0;i<cfg.passMates;i++){
      const q=placeP(p=>dist(p,car)<=440&&dist(p,car)>=150&&[car].concat(mates).every(e=>dist(e,p)>=110),[300,730],[65,415],60);
      if(!q){ok=false;break;}
      mates.push({id:'t'+i,team:'a',num:nums[i],x:q.x,y:q.y});
    }
    if(!ok)continue;
    const defs=[];
    for(const role of cfg.passRoles){
      let q;
      if(role==='mark'){const m=pick(mates),a=rnd(0,6.28),r=rnd(30,50);q={x:m.x+Math.cos(a)*r,y:m.y+Math.sin(a)*r};}
      else if(role==='block'){const m=pick(mates),t=rnd(.35,.7);q={x:car.x+(m.x-car.x)*t+rnd(-12,12),y:car.y+(m.y-car.y)*t+rnd(-12,12)};}
      else q={x:rnd(200,740),y:rnd(65,415)};
      q.x=clamp(q.x,X0,X1);q.y=clamp(q.y,Y0,Y1);
      if(dist(q,car)<90||defs.some(d=>dist(d,q)<70)||mates.some(m=>dist(m,q)<26)){ok=false;break;}
      defs.push({id:'d'+defs.length,team:'d',x:q.x,y:q.y});
    }
    if(!ok)continue;
    let blockedByMate=false;
    for(const m of mates)for(const o of mates)if(m!==o&&segDist(o,car,m)<34)blockedByMate=true;
    if(blockedByMate)continue;
    const sc={type:'pass',car:car,mates:mates,defs:defs,players:[].concat(defs,mates,[car])};
    const cl=mates.map(m=>classifyMate(sc,m,cfg));
    const good=cl.filter(c=>c.good).length;
    if(good<1||good>cfg.passMaxGood||good===mates.length)continue;
    if(cfg.passNeedBoth&&(!cl.some(c=>c.code==='marked')||!cl.some(c=>c.code==='lane')))continue;
    mates.forEach((m,i)=>{m.cls=cl[i];m.tap=true;});
    return sc;
  }
  return null;
}

/* ---------- Don't block ---------- */
function evalBlock(sc,p,cfg){
  const A=sc.A,B=sc.B;
  if(p.x<X0||p.x>X1||p.y<Y0||p.y>Y1)return{ok:false,code:'out'};
  if(segDist(p,A,B)<cfg.blockLane)return{ok:false,code:'inlane'};
  for(const d of sc.defs)if(dist(d,p)<cfg.defNear)return{ok:false,code:'marked',defender:d};
  if(dist(p,A)<cfg.blockEnd||dist(p,B)<cfg.blockEnd)return{ok:false,code:'tooclose'};
  if(cfg.blockOption){
    if(dist(A,p)>340)return{ok:false,code:'far'};
    for(const d of sc.defs)if(segDist(d,A,p)<cfg.passLane)return{ok:false,code:'option',defender:d};
  }
  return{ok:true};
}
function genBlock(cfg){
  for(let k=0;k<500;k++){
    const A={id:'a',team:'a',num:10,ball:true,x:rnd(100,170),y:rnd(190,290)};
    const B={id:'b',team:'a',num:7,x:rnd(520,680),y:rnd(110,370)};
    const t=rnd(.42,.58);
    const me={id:'me',team:'a',num:8,me:true,drag:true,x:A.x+(B.x-A.x)*t+rnd(-5,5),y:A.y+(B.y-A.y)*t+rnd(-5,5)};
    const defs=[];let ok=true;
    for(let i=0;i<cfg.blockDefs;i++){
      const q=placeP(p=>segDist(p,A,B)>=80&&dist(p,B)>=110&&dist(p,A)>=110&&defs.every(d=>dist(d,p)>=120),FX,FY);
      if(!q){ok=false;break;}
      defs.push({id:'d'+i,team:'d',x:q.x,y:q.y});
    }
    if(!ok)continue;
    const sc={type:'block',A:A,B:B,me:me,defs:defs,refs:[A,B],players:[].concat(defs,[A,B,me])};
    if(evalBlock(sc,me,cfg).ok)continue;
    const good=goodPoints(sc,cfg,evalBlock);
    if(good.length<30)continue;
    sc.good=good;return sc;
  }
  return null;
}

/* ---------- Quiz banks (first option is the correct one; options are shuffled when shown) ---------- */
const QUIZ=[
 /* Lucas, general */
 {id:'L1',for:'lucas',tag:'general',q:"Your team has the ball. Where is a great place to stand?",o:["In open space, where a teammate can pass to you","Right next to the ball","Right next to a red player"],why:"Open space makes you easy to pass to, and nobody can steal it."},
 {id:'L2',for:'lucas',tag:'general',q:"Everyone runs after the ball. What happens?",o:["The other team gets lots of free space","We score more goals","Nothing at all"],why:"When everyone bunches up, the rest of the pitch is empty. Spread out!"},
 {id:'L3',for:'lucas',tag:'general',q:"Your teammate is dribbling. Why not stand right in front of him?",o:["You are in his way","It helps him run faster","It is fine, nothing happens"],why:"Stay out of his dribbling space and out of his pass line."},
 {id:'L4',for:'lucas',tag:'general',q:"When do you shout “here!”?",o:["When your teammate is looking up","When he is looking down at the ball","After he already passed"],why:"He can only pass to you if he can see you."},
 {id:'L5',for:'lucas',tag:'general',q:"You just passed the ball. What next?",o:["Move to a new open spot","Stand still and watch","Sit down"],why:"Pass and move! Then you are ready for the next pass."},
 {id:'L6',for:'lucas',tag:'general',q:"Which pass is safest?",o:["To a teammate with no red player near","To a teammate with a red player right next to him","Straight into a red player"],why:"A red player close by can steal the ball."},
 {id:'L7',for:'lucas',tag:'general',q:"How can you ask for the ball?",o:["Say his name and show your open hands","Hide behind a red player","Stay quiet and hope"],why:"A loud name and a clear hand show him where to pass."},
 {id:'L8',for:'lucas',tag:'general',q:"Your team loses the ball. What do you do?",o:["Run back and help stop the other team","Stand and feel sad","Walk off the pitch"],why:"Everyone helps, on offense and on defense."},
 {id:'L9',for:'lucas',tag:'general',q:"What does teamwork mean in soccer?",o:["Passing to a teammate who is open","Keeping the ball all game","Shouting at your friends"],why:"Teams win when the ball moves from player to player."},
 {id:'L10',for:'lucas',tag:'general',q:"Your teammate wants to pass to your friend, but you are in the middle. What now?",o:["Step out of the pass line","Stand still","Wave your arms in the way"],why:"Keep the line between your teammates clear."},
 {id:'L11',for:'lucas',tag:'general',q:"Where is the best place to get the ball?",o:["Where you can see the ball and the pitch","Hidden behind a red player","Outside the lines"],why:"If you can see everything, you know what to do next."},
 {id:'L12',for:'lucas',tag:'general',q:"Two blue players stand in the same spot. What is the problem?",o:["One player is wasted. One should move away","They are too far apart","There is no problem"],why:"Two players in one spot means an empty spot somewhere else."},
 /* Lucas, be ready */
 {id:'LR1',for:'lucas',tag:'ready',q:"You called for the ball. How should you stand?",o:["Knees bent, on your toes, eyes on the ball","Hands in pockets, looking away","Sitting on the grass"],why:"Bent knees and toes: you can move fast in any direction."},
 {id:'LR2',for:'lucas',tag:'ready',q:"Where do you look just before the ball arrives?",o:["At the ball, with a quick peek at the pitch","Only at the sky","Only at your shoes"],why:"Ball first, then a quick look to see what is around you."},
 {id:'LR3',for:'lucas',tag:'ready',q:"After you shout “here!”, what do you do?",o:["Stay ready. The pass comes fast","Walk away","Turn around and chat"],why:"If you ask for it, be ready for it."},
 {id:'LR4',for:'lucas',tag:'ready',q:"The ball is rolling to you. What is a good move?",o:["Take a small step toward the ball","Run away from it","Close your eyes"],why:"Meeting the ball beats waiting for it."},
 /* Nora, general */
 {id:'N1',for:'nora',tag:'general',q:"Your teammate has the ball and a defender is close. Where is the best support spot?",o:["A few steps away at an angle, with a clear pass line","Right behind the defender","Right next to your teammate"],why:"An angle gives him a safe pass. Standing close or behind the defender gives him nothing."},
 {id:'N2',for:'nora',tag:'general',q:"Why is standing in a straight line behind the ball carrier a bad idea?",o:["The player in front blocks the pass to you","Defenders cannot see you","It is too far from the goal"],why:"Angles make passing lanes. Straight lines make blocked lanes."},
 {id:'N3',for:'nora',tag:'general',q:"When is a good time to pass?",o:["Before the defender gets close enough to tackle","Only when you run out of space","Never, always dribble"],why:"Pass early, while you still have time and space."},
 {id:'N4',for:'nora',tag:'general',q:"What does “checking your shoulder” mean?",o:["Looking around quickly to see defenders and teammates before the ball comes","Looking at your shirt number","Rubbing your shoulder after a tackle"],why:"The best players know what they will do before the ball arrives."},
 {id:'N5',for:'nora',tag:'general',q:"A defender is sneaking up behind your teammate who has the ball. Which call helps most?",o:["“Man on!”","“Nice shirt!”","“Slow down!”"],why:"“Man on!” warns him a defender is close, so he can pass or turn."},
 {id:'N6',for:'nora',tag:'general',q:"You ask for the ball but a red player stands in the pass line. Best fix?",o:["Move to a spot where the pass line is clear","Stand still and shout louder","Walk toward the red player"],why:"A new angle opens the lane."},
 {id:'N7',for:'nora',tag:'general',q:"Everyone is bunched around the ball. What fixes it?",o:["Some players move away to use width and depth","Everyone moves closer","Everyone stops moving"],why:"Players far apart make the defenders stretch and cover more ground."},
 {id:'N8',for:'nora',tag:'general',q:"Why does using the whole width of the pitch help?",o:["Defenders have to stretch out, which creates gaps","The ball gets lighter","The pitch gets shorter"],why:"Gaps between defenders are where passes and runs happen."},
 {id:'N9',for:'nora',tag:'general',q:"After you pass, what is a smart next step?",o:["Move into open space for another pass","Watch the ball roll","Walk back to the center circle"],why:"Pass and move keeps the whole team connected."},
 {id:'N10',for:'nora',tag:'general',q:"A teammate runs forward into open space. Where should you pass?",o:["Into the space in front of the runner","Behind the runner","At a defender"],why:"A good pass leads the runner, so they do not have to slow down."},
 {id:'N11',for:'nora',tag:'general',q:"Why scan the field before the ball arrives?",o:["So you know what to do with your first touch","To decorate the pitch","Because it is a rule"],why:"If you already know where the defenders are, your first touch can move away from trouble."},
 {id:'N12',for:'nora',tag:'general',q:"The ball is on the far side of the pitch. What should you do?",o:["Stay wide and ready. A long pass may switch sides","Run to the crowd around the ball","Sit down"],why:"The open side is often where the next pass goes."},
 {id:'N13',for:'nora',tag:'general',q:"You call for the ball but your teammate is not looking. What is best?",o:["Keep moving, wait for him to look up, call again","Stop and give up","Run over and take it from him"],why:"Calling when he cannot see you wastes the call. Wait for his head to come up."},
 {id:'N14',for:'nora',tag:'general',q:"A forward pass looks risky. What is the safest choice?",o:["A safe pass sideways or back to keep the ball","Kick it as hard as you can forward","Dribble into three defenders"],why:"Keeping the ball gives your team time to find a better chance."},
 /* Nora, be ready */
 {id:'NR1',for:'nora',tag:'ready',q:"You call for the ball. Which body position is best?",o:["Side-on, knees bent, on your toes, so you can see the ball and the field","Facing the ball with feet together and your back to the field","Back to the ball, looking at the goal"],why:"Side-on lets you see the pass and the defenders at the same time."},
 {id:'NR2',for:'nora',tag:'ready',q:"Before the ball arrives you should…",o:["Check your shoulder to see where the defenders are","Look only at the passer","Close your eyes until it touches you"],why:"Information before the ball arrives makes a better first touch."},
 {id:'NR3',for:'nora',tag:'ready',q:"The pass is slow and a defender is closing in. Best move?",o:["Step toward the ball to meet it first","Wait until it reaches you","Run away from the pass"],why:"Meeting the ball keeps the defender from stepping in front."},
 {id:'NR4',for:'nora',tag:'ready',q:"You called and the pass is on the way. What is your job now?",o:["Be ready: body open, eyes up, step to meet the ball","Relax. The pass will find you","Start talking to a defender"],why:"Ask for it only if you are ready to receive it."}
];

