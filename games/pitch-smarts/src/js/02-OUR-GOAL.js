/* ================= NEW MISSIONS: scoring, defending, keeper, rules ================= */
Object.assign(CFG.lucas,{shootReach:110,shootNearPost:0,shotRange:250,gapWide:[140,165],gapNarrow:80,gapDefs:3,
  boxDefs:2,gsLane:44,gsMin:38,gsMax:160,cutLane:34,cutEnd:55,angLane:30,angMax:120,pounceMs:1500,pounceLabel:true,
  markFree:1,markOthers:2,offDefs:1,offMargin:50,restartHard:false,lineTricky:false,gbPath:false});
Object.assign(CFG.nora,{shootReach:140,shootNearPost:100,shotRange:220,gapWide:[118,135],gapNarrow:78,gapDefs:4,
  boxDefs:3,gsLane:30,gsMin:45,gsMax:125,cutLane:26,cutEnd:65,angLane:20,angMax:100,pounceMs:850,pounceLabel:false,
  markFree:2,markOthers:2,offDefs:3,offMargin:28,restartHard:true,lineTricky:true,gbPath:true});
const OUR_GOAL={x:34,y:240},THEIR_GOAL={x:766,y:240};

/* ---------- Pick the Corner (front view of the goal; 800x480 units) ---------- */
const GF={l:160,r:640,top:110,bot:400};
function evalShoot(sc,p,cfg){
  if(p.x<GF.l+14||p.x>GF.r-14||p.y<GF.top+14||p.y>GF.bot)return{ok:false,code:'wide'};
  if(Math.abs(p.x-sc.kx)<cfg.shootReach)return{ok:false,code:'saved'};
  if(cfg.shootNearPost&&p.x>GF.l+cfg.shootNearPost&&p.x<GF.r-cfg.shootNearPost)return{ok:false,code:'middle'};
  return{ok:true};
}
function genShoot(cfg){
  const side=pick([-1,1,0]);
  const kx=side===0?rnd(380,420):side<0?rnd(270,330):rnd(470,530);
  const sc={type:'shoot',kx:kx,keeper:{id:'k',team:'d',gk:true,x:kx,y:300}};
  sc.best={x:kx<400?GF.r-50:GF.l+50,y:GF.bot-45};
  if(!evalShoot(sc,sc.best,cfg).ok)return null;
  return sc;
}

/* ---------- Shoot or Pass? ---------- */
function shotClear(sc,from,cfg){
  if(dist(from,THEIR_GOAL)>cfg.shotRange)return false;
  return [215,240,265].some(ty=>sc.defs.every(d=>segDist(d,from,{x:766,y:ty})>=cfg.lane));
}
function genSOP(cfg){
  const want=Math.random()<.5?'shoot':'pass';
  for(let k=0;k<6000;k++){
    const me={id:'me',team:'a',num:8,me:true,ball:true,x:rnd(480,640),y:rnd(110,370)};
    const mate={id:'t',team:'a',num:7,x:rnd(600,725),y:rnd(90,390)};
    if(dist(mate,me)<120)continue;
    const keeper={id:'k',team:'d',gk:true,x:742,y:240+(me.y-240)*.15};
    const defs=[];let ok=true;
    const n=cfg.id==='nora'?3:2;
    for(let i=0;i<n;i++){
      const q=placeP(p=>[me,mate].concat(defs).every(e=>dist(e,p)>=48),[500,735],[70,410],80);
      if(!q){ok=false;break;}defs.push({id:'d'+i,team:'d',x:q.x,y:q.y});
    }
    if(!ok)continue;
    const sc={type:'sop',me:me,car:me,mate:mate,keeper:keeper,defs:defs,players:[].concat(defs,[keeper,mate,me])};
    const shoot=shotClear(sc,me,cfg);
    const mOpen=defs.every(d=>dist(d,mate)>=cfg.passMark&&segDist(d,me,mate)>=cfg.passLane);
    const pass=mOpen&&shotClear(sc,mate,cfg)&&dist(mate,THEIR_GOAL)<dist(me,THEIR_GOAL)-30;
    if(shoot===pass)continue;
    if((shoot?'shoot':'pass')!==want&&k<5000)continue;
    if(cfg.id==='lucas'&&!shoot&&dist(me,THEIR_GOAL)>cfg.shotRange)continue; // Lucas: "blocked" cases only
    sc.answer=shoot?'shoot':'pass';
    if(!shoot){
      let blk=null,bd=1e9;defs.forEach(d=>{const s=segDist(d,me,THEIR_GOAL);if(s<bd){bd=s;blk=d;}});
      sc.blocker=blk;sc.tooFar=dist(me,THEIR_GOAL)>cfg.shotRange;
    }else{
      let st=null,bd=1e9;defs.forEach(d=>{const s=Math.min(dist(d,mate),segDist(d,me,mate));if(s<bd){bd=s;st=d;}});
      sc.stealer=st;
    }
    return sc;
  }
  return null;
}

/* ---------- Find the Gap ---------- */
function genGap(cfg){
  const n=cfg.gapDefs,span=Y1-Y0;
  for(let k=0;k<400;k++){
    const wide=rint(1,n-1); // never an edge gap: the wide gap is between two defenders
    const g=[];let sum=0;
    for(let i=0;i<=n;i++){if(i===wide){g.push(0);continue;}const v=rnd(45,cfg.gapNarrow);g.push(v);sum+=v;}
    g[wide]=span-sum;
    if(g[wide]<cfg.gapWide[0]||g[wide]>cfg.gapWide[1])continue;
    const dx=rnd(420,470),defs=[];let y=Y0;
    for(let i=0;i<n;i++){y+=g[i];defs.push({id:'d'+i,team:'d',x:dx+rnd(-14,14),y:y});}
    const ys=[Y0].concat(defs.map(d=>d.y),[Y1]);
    const me={id:'me',team:'a',num:8,me:true,ball:true,x:rnd(190,250),y:clamp((ys[wide]+ys[wide+1])/2+rnd(-90,90),110,370)};
    const keeper={id:'k',team:'d',gk:true,x:742,y:240};
    return {type:'gap',me:me,car:me,defs:defs,keeper:keeper,ys:ys,wide:wide,dx:dx,players:[].concat(defs,[keeper,me])};
  }
  return null;
}
function gapIndex(sc,y){for(let i=0;i<sc.ys.length-1;i++)if(y>=sc.ys[i]&&y<sc.ys[i+1])return i;return y<sc.ys[0]?0:sc.ys.length-2;}

/* ---------- Get in the Box (cross from the wing) ---------- */
const ZONE={x0:600,x1:742,y0:140,y1:340};
function evalBox(sc,p,cfg){
  if(p.x<ZONE.x0||p.x>ZONE.x1||p.y<ZONE.y0||p.y>ZONE.y1)return{ok:false,code:'zone'};
  if(dist(p,sc.keeper)<70)return{ok:false,code:'keeper'};
  for(const d of sc.defs)if(dist(d,p)<cfg.defNear)return{ok:false,code:'marked',defender:d};
  for(const d of sc.defs)if(segDist(d,sc.car,p)<cfg.lane)return{ok:false,code:'lane',defender:d};
  return{ok:true};
}
function genBox(cfg){
  for(let k=0;k<400;k++){
    const top=Math.random()<.5;
    const car={id:'c',team:'a',num:10,ball:true,x:rnd(610,700),y:top?rnd(68,95):rnd(385,412)};
    const keeper={id:'k',team:'d',gk:true,x:745,y:240};
    const me={id:'me',team:'a',num:8,me:true,drag:true,x:rnd(440,520),y:rnd(170,310)};
    const defs=[];let ok=true;
    for(let i=0;i<cfg.boxDefs;i++){
      const q=placeP(p=>dist(p,keeper)>=70&&dist(p,car)>=90&&defs.every(d=>dist(d,p)>=85),[600,735],[140,340],120);
      if(!q){ok=false;break;}defs.push({id:'d'+i,team:'d',x:q.x,y:q.y});
    }
    if(!ok)continue;
    const sc={type:'box',car:car,me:me,keeper:keeper,defs:defs,refs:[car,keeper],players:[].concat(defs,[keeper,car,me])};
    const good=goodPoints(sc,cfg,evalBox);
    if(good.length<14)continue;
    sc.good=good;return sc;
  }
  return null;
}

/* ---------- Goal-Side! ---------- */
function evalGoalSide(sc,p,cfg){
  const a=sc.att;
  if(p.x>=a.x-8)return{ok:false,code:'behind'};
  const d=dist(p,a);
  if(d<cfg.gsMin)return{ok:false,code:'close'};
  if(d>cfg.gsMax)return{ok:false,code:'far'};
  if(segDist(p,a,OUR_GOAL)>cfg.gsLane)return{ok:false,code:'side'};
  return{ok:true};
}
function genGoalSide(cfg){
  for(let k=0;k<300;k++){
    const att={id:'a',team:'d',ball:true,x:rnd(320,520),y:rnd(110,370)};
    const me={id:'me',team:'a',num:8,me:true,drag:true,x:clamp(att.x+rnd(70,140),X0,X1),y:clamp(att.y+rnd(-110,110),Y0,Y1)};
    const keeper={id:'k',team:'a',num:1,x:62,y:240};
    const extra={id:'r2',team:'d',x:rnd(220,320),y:att.y<240?rnd(300,400):rnd(80,180)};
    const sc={type:'goalside',att:att,car:att,me:me,keeper:keeper,defs:[att,extra],players:[att,extra,keeper,me]};
    if(evalGoalSide(sc,me,cfg).ok)continue;
    const good=goodPoints(sc,cfg,evalGoalSide);
    if(good.length<4)continue;
    const mid=(cfg.gsMin+cfg.gsMax)/2,l=dist(att,OUR_GOAL);
    sc.best={x:att.x+(OUR_GOAL.x-att.x)*mid/l,y:att.y+(OUR_GOAL.y-att.y)*mid/l};
    sc.good=good;return sc;
  }
  return null;
}

/* ---------- Mark Up (tap the attacker to mark) ---------- */
function genMark(cfg){
  for(let k=0;k<800;k++){
    const car={id:'c',team:'d',ball:true,x:rnd(560,680),y:rnd(120,360)};
    const n=cfg.markFree+cfg.markOthers,atts=[];let ok=true;
    for(let i=0;i<n;i++){
      const q=placeP(p=>atts.every(a=>dist(a,p)>=110)&&dist(p,car)>=140,[130,430],[80,400],80);
      if(!q){ok=false;break;}atts.push({id:'r'+i,team:'d',tap:true,x:q.x,y:q.y});
    }
    if(!ok)continue;
    const free=atts.slice(0,cfg.markFree),marked=atts.slice(cfg.markFree);
    const blues=[];
    marked.forEach((a,i)=>{const l=dist(a,OUR_GOAL);blues.push({id:'b'+i,team:'a',num:[3,4,5][i],x:a.x+(OUR_GOAL.x-a.x)*34/l,y:a.y+(OUR_GOAL.y-a.y)*34/l});});
    // free players: nobody blue within 90
    if(free.some(f=>blues.some(b=>dist(b,f)<90)))continue;
    const byDanger=free.slice().sort((a,b)=>dist(a,OUR_GOAL)-dist(b,OUR_GOAL));
    if(byDanger.length>1&&dist(byDanger[1],OUR_GOAL)-dist(byDanger[0],OUR_GOAL)<90)continue;
    const me={id:'me',team:'a',num:8,me:true,x:rnd(470,540),y:rnd(200,280)};
    if(atts.concat(blues,[car]).some(o=>dist(o,me)<70))continue;
    const keeper={id:'k',team:'a',num:1,x:62,y:240};
    atts.forEach(a=>{a.cls=free.indexOf(a)<0?{good:false,code:'marked'}:a===byDanger[0]?{good:true}:{good:false,code:'less'};});
    return {type:'mark',car:car,me:me,atts:atts,blues:blues,keeper:keeper,defs:atts.concat([car]),players:[].concat(atts,blues,[car,keeper,me])};
  }
  return null;
}

/* ---------- Cut the Pass ---------- */
function evalCut(sc,p,cfg){
  if(segDist(p,sc.A,sc.B)>cfg.cutLane)return{ok:false,code:'off'};
  if(dist(p,sc.A)<cfg.cutEnd)return{ok:false,code:'nearA'};
  if(dist(p,sc.B)<45)return{ok:false,code:'nearB'};
  return{ok:true};
}
function genCut(cfg){
  for(let k=0;k<300;k++){
    const A={id:'a',team:'d',ball:true,x:rnd(430,620),y:rnd(100,380)};
    const B={id:'b',team:'d',x:rnd(170,330),y:rnd(100,380)};
    if(dist(A,B)<230)continue;
    const me=placeP(p=>segDist(p,A,B)>80&&dist(p,A)>90&&dist(p,B)>90,[200,600],[70,410],100);
    if(!me)continue;
    Object.assign(me,{id:'me',team:'a',num:8,me:true,drag:true});
    const keeper={id:'k',team:'a',num:1,x:62,y:240};
    const sc={type:'cut',A:A,B:B,car:A,me:me,keeper:keeper,defs:[A,B],refs:[A,B],players:[A,B,keeper,me]};
    const good=goodPoints(sc,cfg,evalCut);
    if(good.length<5)continue;
    sc.good=good;
    const t=.55;sc.best={x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t};
    return sc;
  }
  return null;
}

/* ---------- Get Back! ---------- */
function evalBack(sc,p,cfg){
  const a=sc.att;
  if(p.x>a.x-30)return{ok:false,code:'ahead'};
  if(p.x<95)return{ok:false,code:'deep'};
  if(p.y<130||p.y>350)return{ok:false,code:'wide'};
  if(cfg.gbPath&&segDist(p,a,OUR_GOAL)>60)return{ok:false,code:'path'};
  return{ok:true};
}
function genBack(cfg){
  for(let k=0;k<300;k++){
    const att={id:'a',team:'d',ball:true,x:rnd(400,520),y:rnd(110,370)};
    const me={id:'me',team:'a',num:8,me:true,drag:true,x:rnd(600,720),y:rnd(90,390)};
    const mate={id:'t',team:'a',num:4,x:rnd(130,200),y:att.y<240?rnd(320,400):rnd(80,160)};
    const r2={id:'r2',team:'d',x:rnd(560,700),y:rnd(90,390)};
    const keeper={id:'k',team:'a',num:1,x:62,y:240};
    const sc={type:'back',att:att,car:att,me:me,keeper:keeper,defs:[att,r2],refs:[att],players:[att,r2,mate,keeper,me]};
    const good=goodPoints(sc,cfg,evalBack);
    if(good.length<10)continue;
    sc.good=good;
    const l=dist(att,OUR_GOAL),dd=Math.min(l-80,170);
    sc.best={x:att.x+(OUR_GOAL.x-att.x)*dd/l,y:att.y+(OUR_GOAL.y-att.y)*dd/l};
    if(!evalBack(sc,sc.best,cfg).ok)continue;
    return sc;
  }
  return null;
}

/* ---------- Narrow the Angle (you are the keeper) ---------- */
function evalAngle(sc,p,cfg){
  if(dist(p,OUR_GOAL)>cfg.angMax)return{ok:false,code:'far'};
  if(segDist(p,sc.att,OUR_GOAL)>cfg.angLane)return{ok:false,code:'angle'};
  if(dist(p,OUR_GOAL)<26)return{ok:false,code:'line'};
  return{ok:true};
}
function genAngle(cfg){
  for(let k=0;k<300;k++){
    const att={id:'a',team:'d',ball:true,x:rnd(150,330),y:rnd(80,400)};
    if(dist(att,OUR_GOAL)<150)continue;
    const off=att.y<240?1:-1;
    const me={id:'me',team:'a',num:1,me:true,drag:true,gk:true,x:rnd(60,80),y:240+off*rnd(40,60)};
    const sc={type:'angle',att:att,car:att,me:me,defs:[att],refs:[att],players:[att,me]};
    if(evalAngle(sc,me,cfg).ok)continue;
    const good=goodPoints(sc,cfg,evalAngle);
    if(good.length<2){continue;}
    const l=dist(att,OUR_GOAL),dd=Math.min(cfg.angMax-20,70);
    sc.best={x:OUR_GOAL.x+(att.x-OUR_GOAL.x)*dd/l,y:OUR_GOAL.y+(att.y-OUR_GOAL.y)*dd/l};
    if(!evalAngle(sc,sc.best,cfg).ok)continue;
    sc.good=good;return sc;
  }
  return null;
}

/* ---------- Rules: In or Out? (top view close-up) ---------- */
const LINE={top:226,bot:258},BALLR=58;
function lineAnswer(sc){
  // The whole ball must be past the outer edge of the line (LINE.top) to be out / to be a goal.
  return sc.by+BALLR<LINE.top?'out':'in';
}
function genLine(cfg){
  const goal=Math.random()<.4;
  const wantOut=Math.random()<.5;
  let by;
  if(wantOut)by=cfg.lineTricky?rnd(150,162):rnd(110,140);
  else{
    const tricky=cfg.lineTricky?Math.random()<.7:Math.random()<.35;
    by=tricky?rnd(cfg.lineTricky?176:192,210):rnd(250,330);
  }
  const sc={type:'line',goal:goal,by:by,bx:rnd(goal?330:220,goal?470:580)};
  sc.answer=lineAnswer(sc);
  return sc;
}

