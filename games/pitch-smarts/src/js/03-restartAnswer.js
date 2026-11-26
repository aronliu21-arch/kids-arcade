/* ---------- Rules: Restart Ref (throw-in, corner kick, goal kick) ---------- */
function restartAnswer(edge,last){
  const other=last==='blue'?'red':'blue';
  if(edge==='top'||edge==='bottom')return{kind:'throw',team:other};
  if(edge==='right')return last==='red'?{kind:'corner',team:'blue'}:{kind:'goalkick',team:'red'};
  return last==='blue'?{kind:'corner',team:'red'}:{kind:'goalkick',team:'blue'};
}
function genRestart(cfg){
  const edge=pick(['top','bottom','right','left','top','bottom','right','left']);
  const last=pick(['blue','red']);
  let ex,ey,px,py;
  if(edge==='top'||edge==='bottom'){ex=Math.random()<.5?rnd(130,300):rnd(500,670);ey=edge==='top'?34:446;px=ex+rnd(-90,90);py=edge==='top'?rnd(110,160):rnd(320,370);}
  else{ex=edge==='right'?766:34;ey=pick([rnd(70,180),rnd(300,410)]);px=edge==='right'?rnd(600,680):rnd(120,200);py=clamp(ey+rnd(-60,60),90,390);}
  const ball={x:ex+(ex-px)/Math.max(1,dist({x:ex,y:ey},{x:px,y:py}))*18,y:ey+(ey-py)/Math.max(1,dist({x:ex,y:ey},{x:px,y:py}))*18};
  const toucher={id:'tch',team:last==='blue'?'a':'d',num:7,x:px,y:py};
  const near={id:'n',team:last==='blue'?'d':'a',num:4,x:clamp(px+(px<400?1:-1)*rnd(90,130),70,730),y:clamp(py+rnd(-25,25),80,400)};
  const ans=restartAnswer(edge,last);
  const sc={type:'restart',edge:edge,last:last,toucher:toucher,exit:{x:ex,y:ey},ball:{x:ball.x,y:ball.y,owner:null},answer:ans,players:[toucher,near]};
  return sc;
}

/* ---------- Rules: Offside? ---------- */
function offsideCheck(sc){
  const reds=sc.reds.slice().sort((a,b)=>b.x-a.x);
  const second=reds[1];
  const r=sc.recv;
  const off=r.x>W/2&&r.x>sc.passer.x&&r.x>second.x;
  return{off:off,line:second.x,second:second};
}
function genOffside(cfg){
  for(let k=0;k<500;k++){
    const passer={id:'p',team:'a',num:10,ball:true,x:rnd(330,480),y:rnd(120,360)};
    const keeper={id:'k',team:'d',gk:true,x:rnd(728,748),y:rnd(215,265)};
    const reds=[keeper];let ok=true;
    for(let i=0;i<cfg.offDefs;i++){
      const q=placeP(p=>reds.every(r=>dist(r,p)>=70)&&dist(p,passer)>=90,[520,690],[80,400],80);
      if(!q){ok=false;break;}reds.push({id:'d'+i,team:'d',x:q.x,y:q.y});
    }
    if(!ok)continue;
    const sorted=reds.slice().sort((a,b)=>b.x-a.x),line=sorted[1].x;
    const wantOff=Math.random()<.5;
    let rx;
    if(wantOff)rx=line+rnd(cfg.offMargin,cfg.offMargin+50);
    else rx=line-rnd(cfg.offMargin,cfg.offMargin+80);
    if(rx>735||rx<passer.x-60)continue;
    const recv={id:'r',team:'a',num:9,x:rx,y:rnd(90,390)};
    if(reds.some(r=>dist(r,recv)<55)||dist(recv,passer)<120)continue;
    if(reds.some(r=>r!==keeper&&segDist(r,passer,recv)<26))continue;
    const sc={type:'offside',passer:passer,car:passer,recv:recv,reds:reds,keeper:keeper,defs:reds,players:[].concat(reds,[passer,recv])};
    const c=offsideCheck(sc);
    if(c.off!==wantOff)continue;
    sc.answer=c.off?'off':'on';sc.line=c.line;sc.second=c.second;
    return sc;
  }
  return null;
}

/* ---------- More quiz banks: scoring, defending, rules, fouls ---------- */
QUIZ.push(
 /* Lucas, scoring */
 {id:'LS1',for:'lucas',tag:'score',q:"Where is the best place to shoot?",o:["Low, into a corner, away from the goalie","Right at the goalie","High over the goal"],why:"The goalie has to dive far to reach a low corner shot."},
 {id:'LS2',for:'lucas',tag:'score',q:"Your shot hits the goalie and bounces out. What do you do?",o:["Run in and shoot again","Walk back sad","Wait for the referee"],why:"A rebound is a free second chance. Always follow your shot!"},
 {id:'LS3',for:'lucas',tag:'score',q:"You want a shot that goes exactly where you aim. Which part of the foot?",o:["The inside of your foot","Your toe","Your heel"],why:"The inside of the foot is flat like a paddle, so it aims well."},
 {id:'LS4',for:'lucas',tag:'score',q:"When you shoot, where should the foot you stand on point?",o:["At the target","Away from the goal","At the sky"],why:"Your standing foot points where the ball will go."},
 {id:'LS5',for:'lucas',tag:'score',q:"The goalie stands near the left post. Where do you shoot?",o:["The right side, far from him","Right at him","At the left post"],why:"Shoot where the goalie is not."},
 {id:'LS6',for:'lucas',tag:'score',q:"Your teammate shoots. Where should you run?",o:["Toward the goal, ready for a rebound","Back to our goal","Off the pitch"],why:"Lots of goals come from rebounds."},
 {id:'LS7',for:'lucas',tag:'score',q:"You are far from the goal. A teammate is close to the goal and open. Best choice?",o:["Pass to your open teammate","Shoot from very far","Stop and wait"],why:"A close, open teammate has a better chance to score."},
 {id:'LS8',for:'lucas',tag:'score',q:"At the moment you kick, where are your eyes?",o:["On the ball","On the crowd","Closed"],why:"Look at the goal first, then watch the ball as you kick it."},
 /* Nora, scoring */
 {id:'NS1',for:'nora',tag:'score',q:"The goalkeeper rushes out and is close to you. What is a smart finish?",o:["A calm, low shot past him or a dribble around him","Blast it straight at him","Stop and pass backward"],why:"When the keeper comes close, placement and calm beat power."},
 {id:'NS2',for:'nora',tag:'score',q:"Why aim for the far post on many shots?",o:["The keeper has farther to go, and a save can bounce to a teammate","The far post is always closer","Referees give extra points"],why:"Far-post shots are hard to save and often create rebounds."},
 {id:'NS3',for:'nora',tag:'score',q:"You shoot with your laces. What gives you power?",o:["Toes pointed down, ankle locked, strike the middle of the ball","Toes up and a floppy ankle","Hit the very top of the ball"],why:"A locked ankle through the middle of the ball makes a hard, low shot."},
 {id:'NS4',for:'nora',tag:'score',q:"Your shots keep flying over the bar. What usually fixes it?",o:["Lean over the ball and strike its middle","Lean back more","Kick the bottom of the ball"],why:"Leaning back and hitting under the ball lifts it."},
 {id:'NS5',for:'nora',tag:'score',q:"A cross is coming from the wing. What should a striker do?",o:["Time a late run into space in front of goal","Stand still on the goal line","Run away from the goal"],why:"Arriving late and on the move is very hard to mark."},
 {id:'NS6',for:'nora',tag:'score',q:"You have a shot, but a teammate is in a better spot. How do you decide?",o:["Pick whichever gives the team the best chance to score","Always shoot","Always pass"],why:"Great finishers read the situation, not just the goal."},
 {id:'NS7',for:'nora',tag:'score',q:"What is a give-and-go (a one-two)?",o:["You pass, sprint forward, and get the ball right back","Two players kick at the same time","Shooting twice in a row"],why:"A quick give-and-go gets you past a defender."},
 {id:'NS8',for:'nora',tag:'score',q:"Which shot is usually hardest for a keeper to save?",o:["A low shot just inside the post","A high shot at the middle","A slow shot right at him"],why:"Low by the post means a long dive all the way to the ground."},
 {id:'NS9',for:'nora',tag:'score',q:"Why shoot quickly when you get a chance in the box?",o:["Defenders and the keeper close the space fast","It is a rule","The ball gets tired"],why:"In the box, a chance lasts about one second."},
 {id:'NS10',for:'nora',tag:'score',q:"A defender is standing right in your shooting line. What can you do?",o:["Take one touch sideways to open a new angle, then shoot","Shoot into the defender","Turn around and run back"],why:"One touch to the side can open up the goal."},
 /* Lucas, defending */
 {id:'LD1',for:'lucas',tag:'defend',q:"The other team has the ball. Where should you stand?",o:["Between the ball and our goal","Behind the player with the ball","Next to their goal"],why:"Goal-side means you block his path to our goal."},
 {id:'LD2',for:'lucas',tag:'defend',q:"Should you dive in to kick the ball away?",o:["No. Stay on your feet and wait for a chance","Yes, always dive","Close your eyes and dive"],why:"If you dive and miss, he runs right past you."},
 {id:'LD3',for:'lucas',tag:'defend',q:"A red player has the ball and you are close. What do you do?",o:["Get low, stay close, and watch the ball","Turn your back","Grab his shirt"],why:"Watch the ball, not his tricky feet."},
 {id:'LD4',for:'lucas',tag:'defend',q:"Is it OK to push a player to get the ball?",o:["No, pushing is a foul","Yes, if you push hard","Yes, every time"],why:"Pushing gives the other team a free kick."},
 {id:'LD5',for:'lucas',tag:'defend',q:"A red player is about to pass. What is a smart move?",o:["Step into the pass line to steal it","Look at the sky","Sit down"],why:"Defenders steal passes by guessing where they will go."},
 {id:'LD6',for:'lucas',tag:'defend',q:"A red player without the ball is near our goal, and nobody is near him. What do you do?",o:["Go mark him, between him and our goal","Leave him alone","Run to their goal"],why:"A free attacker near our goal is dangerous."},
 {id:'LD7',for:'lucas',tag:'defend',q:"When is the best time to steal the ball?",o:["When he lets the ball roll away from his feet","When the ball is stuck to his feet","Never"],why:"A big touch gives you your chance. Pounce!"},
 {id:'LD8',for:'lucas',tag:'defend',q:"Who helps on defense?",o:["Everyone on the team","Only the goalie","Only the tallest player"],why:"When we lose the ball, everyone helps get it back."},
 /* Nora, defending */
 {id:'ND1',for:'nora',tag:'defend',q:"Why do defenders stand side-on instead of facing the attacker square?",o:["They can turn and run quickly either way","It looks cooler","It is a rule"],why:"Side-on lets you turn fast if the attacker speeds past."},
 {id:'ND2',for:'nora',tag:'defend',q:"Which way should you try to push (show) an attacker?",o:["Toward the sideline, away from the middle","Into the middle in front of our goal","Toward our goalkeeper"],why:"The sideline acts like an extra defender."},
 {id:'ND3',for:'nora',tag:'defend',q:"A teammate goes to press the ball. What is your job?",o:["Cover behind him, ready if the attacker gets past","Also run at the ball","Stand still and watch"],why:"Pressure plus cover: two defenders working together."},
 {id:'ND4',for:'nora',tag:'defend',q:"What does “jockeying” mean?",o:["Backing up slowly, staying close, waiting for the right moment to tackle","Riding a horse","Charging in as fast as you can"],why:"Jockeying slows the attacker down until help arrives or he makes a mistake."},
 {id:'ND5',for:'nora',tag:'defend',q:"When you mark a player without the ball, where should you be?",o:["Goal-side, where you can see him and the ball","Behind him, only watching him","Far away near the ball"],why:"You need to see both, so you can react to the pass."},
 {id:'ND6',for:'nora',tag:'defend',q:"Why do the keeper and defenders talk so much?",o:["So everyone knows who is marking whom","To distract the referee","They are bored"],why:"Calls like “I’ve got him!” stop two players chasing one attacker."},
 {id:'ND7',for:'nora',tag:'defend',q:"Where should a goalkeeper stand?",o:["On the line between the ball and the middle of the goal","Always on the goal line in the middle","Next to one post"],why:"That covers the most goal. It is called narrowing the angle."},
 {id:'ND8',for:'nora',tag:'defend',q:"Why is staying on your feet usually better than a slide tackle?",o:["If you miss a slide, you are on the ground and out of the play","Sliding is not allowed in soccer","The grass gets dirty"],why:"On your feet, you get a second chance."},
 {id:'ND9',for:'nora',tag:'defend',q:"The other team takes a corner kick. What should defenders do?",o:["Mark attackers, stay goal-side, and watch the ball","All stand on the goal line","Leave the box"],why:"Marked attackers can’t get a free header."},
 {id:'ND10',for:'nora',tag:'defend',q:"Your team just lost the ball near their goal. A smart reaction?",o:["Press fast to win it back, or get goal-side if you can’t","Walk back slowly","Argue with the referee"],why:"The first few seconds after losing the ball are the best time to win it back."},
 /* Lucas, rules */
 {id:'LRu1',for:'lucas',tag:'rules',q:"How much of the ball must cross the line to be out?",o:["The whole ball","Just a little bit","Half of it"],why:"If any part of the ball is still on the line, it is still in."},
 {id:'LRu2',for:'lucas',tag:'rules',q:"The ball rolls over the side line. How does play start again?",o:["A throw-in","A corner kick","A penalty"],why:"Side line = throw-in, for the team that did not touch it last."},
 {id:'LRu3',for:'lucas',tag:'rules',q:"How do you take a throw-in?",o:["Two hands, from behind your head, feet on the ground","One hand, like a baseball","Kick it in"],why:"Both hands, over your head, both feet down."},
 {id:'LRu4',for:'lucas',tag:'rules',q:"Who can touch the ball with their hands?",o:["Only the goalie, in his own big box","Everybody","The tallest player"],why:"Everyone else uses feet, legs, body and head."},
 {id:'LRu5',for:'lucas',tag:'rules',q:"A red player kicks the ball over our goal line, but not into the goal. What happens?",o:["A goal kick for our team","A corner kick for the red team","A throw-in"],why:"The attackers touched it last, so the defenders get a goal kick."},
 {id:'LRu6',for:'lucas',tag:'rules',q:"Our player kicks the ball over our own goal line, but not into the goal. What happens?",o:["A corner kick for the red team","A goal kick for us","Nothing"],why:"The defenders touched it last, so the attackers get a corner kick."},
 {id:'LRu7',for:'lucas',tag:'rules',q:"When is it a goal?",o:["When the whole ball crosses the goal line between the posts","When the ball touches the outside of the net","When the ball hits the post"],why:"The whole ball has to go over the line, inside the goal."},
 {id:'LRu8',for:'lucas',tag:'rules',q:"What does a yellow card mean?",o:["A warning from the referee","You scored a goal","Time for snacks"],why:"A yellow card says: careful, no more fouls like that."},
 /* Nora, rules */
 {id:'NRu1',for:'nora',tag:'rules',q:"Can you score directly from a throw-in?",o:["No. Another player must touch it first","Yes","Only in the second half"],why:"A throw-in straight into the goal does not count."},
 {id:'NRu2',for:'nora',tag:'rules',q:"Can you be offside straight from a throw-in, corner kick or goal kick?",o:["No. Offside doesn’t count on those","Yes, always","Only on corners"],why:"Those three restarts have no offside."},
 {id:'NRu3',for:'nora',tag:'rules',q:"When are you in an offside position?",o:["In their half, nearer their goal line than the ball and the second-last defender, when the pass is played","Any time you are near their goal","When you stand behind the ball"],why:"It is judged at the moment your teammate passes. The keeper usually counts as the last defender."},
 {id:'NRu4',for:'nora',tag:'rules',q:"You are exactly level with the second-last defender. Is that offside?",o:["No, level is onside","Yes","Only if the keeper is out of goal"],why:"Level counts as onside."},
 {id:'NRu5',for:'nora',tag:'rules',q:"A defender trips an attacker inside the defender’s own penalty box. What is given?",o:["A penalty kick","A throw-in","A goal kick"],why:"A foul like that inside your own box gives the other team a penalty."},
 {id:'NRu6',for:'nora',tag:'rules',q:"Two yellow cards for the same player in one game mean…",o:["A red card: the player must leave the game","Nothing","A penalty kick"],why:"Two yellows make a red, and the team plays with one fewer."},
 {id:'NRu7',for:'nora',tag:'rules',q:"How far away must opponents stand at a free kick?",o:["About 10 yards (9.15 meters)","One step","Anywhere they like"],why:"The space gives the kicker a fair chance."},
 {id:'NRu8',for:'nora',tag:'rules',q:"Can you score directly from a corner kick?",o:["Yes","No","Only with your head"],why:"A curling corner straight in counts. It is called an Olimpico!"},
 {id:'NRu9',for:'nora',tag:'rules',q:"A teammate kicks the ball back to your goalkeeper on purpose. Can the keeper pick it up?",o:["No, he has to play it with his feet","Yes, any time","Only if it is raining"],why:"This is the back-pass rule. Picking it up gives the other team a free kick."},
 {id:'NRu10',for:'nora',tag:'rules',q:"Can a player be offside in her own half?",o:["No, never","Yes, always","Only near the halfway line"],why:"Offside only happens in the other team’s half."},
 /* Lucas, foul or fair */
 {id:'LF1',for:'lucas',tag:'foul',q:"Foul or fair? He pushes a player in the back to get the ball.",o:["Foul","Fair"],why:"Pushing is a foul. The other team gets a free kick."},
 {id:'LF2',for:'lucas',tag:'foul',q:"Foul or fair? He runs fast and kicks the ball away without touching the player.",o:["Fair","Foul"],why:"Getting the ball cleanly is great defending."},
 {id:'LF3',for:'lucas',tag:'foul',q:"Foul or fair? He holds the other player’s shirt.",o:["Foul","Fair"],why:"Holding is a foul. Use your feet, not your hands."},
 {id:'LF4',for:'lucas',tag:'foul',q:"Foul or fair? The goalie catches the ball in his own big box.",o:["Fair","Foul"],why:"That is the goalie’s special job."},
 {id:'LF5',for:'lucas',tag:'foul',q:"Foul or fair? A player stops the ball with his hand on purpose.",o:["Foul","Fair"],why:"Handball! Only the goalie may use hands, in his own box."},
 {id:'LF6',for:'lucas',tag:'foul',q:"Foul or fair? He trips a player with his foot.",o:["Foul","Fair"],why:"Tripping is a foul."},
 {id:'LF7',for:'lucas',tag:'foul',q:"Foul or fair? Two players run shoulder to shoulder for the ball, without pushing hard.",o:["Fair","Foul"],why:"A gentle shoulder-to-shoulder bump while going for the ball is allowed."},
 {id:'LF8',for:'lucas',tag:'foul',q:"Foul or fair? He bumps into a player by accident, then helps him up.",o:["Fair, and good sportsmanship","Foul"],why:"Helping a player up shows respect."},
 /* Nora, foul or fair */
 {id:'NF1',for:'nora',tag:'foul',q:"A defender touches the ball first, then wildly kicks the attacker’s legs. Foul or fair?",o:["Foul: touching the ball first doesn’t make a reckless tackle OK","Fair: he touched the ball first"],why:"Referees judge the whole tackle, not only who touched the ball."},
 {id:'NF2',for:'nora',tag:'foul',q:"The goalkeeper picks up the ball outside his penalty box. Foul or fair?",o:["Foul: handball","Fair"],why:"Outside the box, the keeper is like any other player."},
 {id:'NF3',for:'nora',tag:'foul',q:"An attacker keeps her body between the ball and the defender, without pushing with her arms. Foul or fair?",o:["Fair: that is shielding","Foul"],why:"Shielding the ball is a legal, smart skill."},
 {id:'NF4',for:'nora',tag:'foul',q:"A player steps into an opponent’s path on purpose to block his run, without going for the ball. Foul or fair?",o:["Foul: that is blocking","Fair"],why:"You can’t block a player when you aren’t playing the ball."},
 {id:'NF5',for:'nora',tag:'foul',q:"The ball hits a player’s arm by accident while the arm is close to his body. Is it handball?",o:["Usually not","Always"],why:"Handball is mostly about using the hand or arm on purpose or making yourself bigger."},
 {id:'NF6',for:'nora',tag:'foul',q:"A player falls on purpose, pretending to be fouled. Foul or fair?",o:["Unfair: it’s called diving and can get a yellow card","Fair: it’s a clever trick"],why:"Tricking the referee is unsporting."},
 {id:'NF7',for:'nora',tag:'foul',q:"A defender pulls an attacker’s shirt inside the defender’s own penalty box. What happens?",o:["Foul: penalty kick","Fair: play on"],why:"Holding in your own box gives the other team a penalty."},
 {id:'NF8',for:'nora',tag:'foul',q:"Two players jump for a header, both going for the ball, no elbows. Foul or fair?",o:["Fair","Foul"],why:"A fair challenge for the ball is part of the game."},
 {id:'NF9',for:'nora',tag:'foul',q:"During a throw-in, the thrower lifts one foot off the ground. What happens?",o:["Foul throw: the other team gets the throw-in","Nothing, play on"],why:"Both feet must stay on the ground, on or behind the line."},
 {id:'NF10',for:'nora',tag:'foul',q:"After the referee stops play, a player kicks the ball away to waste time. Foul or fair?",o:["Unsporting: it can get a yellow card","Fair"],why:"Delaying the restart is a cautionable offence."}
);

