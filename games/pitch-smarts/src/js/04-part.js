// ==LOGIC-END

/* ================= UI ================= */
const $=id=>document.getElementById(id);
const cv=$('pitch');let ctx=cv.getContext('2d');

const store={
  load(){try{return JSON.parse(localStorage.getItem('pitchSmarts.v1'))||{};}catch(e){return{};}},
  save(){try{localStorage.setItem('pitchSmarts.v1',JSON.stringify(DB));}catch(e){}cloudSave();}
};
let DB=store.load();
DB.p=DB.p||{};
if(typeof DB.sound!=='boolean')DB.sound=true;
function prof(id){
  if(!DB.p[id])DB.p[id]={stars:{},seen:[],voice:id==='lucas'};
  const p=DB.p[id];p.stars=p.stars||{};p.seen=p.seen||[];if(typeof p.voice!=='boolean')p.voice=id==='lucas';
  return p;
}

const CHAPTERS=[
  {id:'team',em:'🤝',title:'Team Play',col:'#1864ab'},
  {id:'score',em:'🥅',title:'Scoring',col:'#b34d00'},
  {id:'defend',em:'🛡️',title:'Defending',col:'#087f5b'},
  {id:'rules',em:'📏',title:'Rules',col:'#9c36b5'}
];
const rep=(t,n)=>Array(n).fill(t);
const MISSIONS=[
  /* team play */
  {id:'spread',ch:'team',em:'🐝',title:"Spread Out",types:rep('spread',3),
   bl:{easy:"Everyone ran to the ball! Send your team to open spots.",hard:"Fix the bee swarm: spread the team across the pitch."}},
  {id:'space',ch:'team',em:'🎯',title:"Find the Space",types:rep('space',5),
   bl:{easy:"Move to a spot where your friend can pass to you.",hard:"Find space that is open, safe and passable."}},
  {id:'pass',ch:'team',em:'🎁',title:"Pick the Pass",types:rep('pass',5),
   bl:{easy:"Look up. Who is open? Tap them.",hard:"Read the defenders. Find the safe pass."}},
  {id:'block',ch:'team',em:'🚧',title:"Don’t Block!",types:rep('block',4),
   bl:{easy:"Your friend wants to pass. Get out of the way!",hard:"Clear the lane, then become a second option."}},
  {id:'ready',ch:'team',em:'🙋',title:"Call & Be Ready",types:['call','ready','call','ready'],
   bl:{easy:"Call when he looks up. Then get ready!",hard:"Time your call, then show you are ready to receive."}},
  {id:'brain',ch:'team',em:'🧠',title:"Soccer Brain",types:rep('quiz',6),
   bl:{easy:"Quick questions about smart soccer.",hard:"Game sense: angles, scanning, timing."}},
  /* scoring */
  {id:'corner',ch:'score',em:'🎯',title:"Pick the Corner",types:rep('shoot',5),
   bl:{easy:"Tap where to shoot so the goalie can’t reach it.",hard:"Beat the keeper: low, near the post, far from him."}},
  {id:'sop',ch:'score',em:'🤔',title:"Shoot or Pass?",types:rep('sop',6),
   bl:{easy:"Clear path? Shoot! Blocked? Pass!",hard:"Read the defenders and pick the best chance."}},
  {id:'gap',ch:'score',em:'🏃',title:"Find the Gap",types:rep('gap',5),
   bl:{easy:"Dribble through the big hole in the red wall.",hard:"Spot the widest gap, then go for goal."}},
  {id:'box',ch:'score',em:'📦',title:"Get in the Box",types:rep('box',4),
   bl:{easy:"Your friend will cross it. Run to an open spot near goal.",hard:"Time your run into open space in front of goal."}},
  {id:'goalbrain',ch:'score',em:'⚽',title:"Goal Brain",types:rep('q:score',6),
   bl:{easy:"Questions about shooting and scoring.",hard:"Finishing smarts: placement, power, rebounds."}},
  /* defending */
  {id:'goalside',ch:'defend',em:'🧱',title:"Goal-Side!",types:rep('goalside',4),
   bl:{easy:"Stand between the red player and our goal.",hard:"Get goal-side at the right distance."}},
  {id:'markup',ch:'defend',em:'👀',title:"Mark Up",types:rep('mark',4),
   bl:{easy:"Find the red player nobody is guarding.",hard:"Mark the most dangerous free attacker."}},
  {id:'cut',ch:'defend',em:'✂️',title:"Cut the Pass",types:rep('cut',4),
   bl:{easy:"Jump into the pass line and steal it!",hard:"Read the pass and intercept it."}},
  {id:'back',ch:'defend',em:'🔙',title:"Get Back!",types:rep('back',4),
   bl:{easy:"We lost the ball. Race back to protect our goal!",hard:"Recover goal-side, on the attacker’s path."}},
  {id:'pounce',ch:'defend',em:'🐯',title:"Pounce!",types:rep('pounce',4),
   bl:{easy:"Wait for a big touch, then steal it!",hard:"Be patient. Tackle only on a loose touch."}},
  {id:'angle',ch:'defend',em:'🧤',title:"Narrow the Angle",types:rep('angle',4),
   bl:{easy:"You’re the goalie! Stand where you cover the goal.",hard:"Keeper position: ball, you, middle of the goal."}},
  {id:'defbrain',ch:'defend',em:'🛡️',title:"Defense Brain",types:rep('q:defend',6),
   bl:{easy:"Questions about stopping the other team.",hard:"Pressure, cover, jockeying and marking."}},
  /* rules */
  {id:'inout',ch:'rules',em:'📏',title:"In or Out?",types:rep('line',6),
   bl:{easy:"Be the referee: is the ball out?",hard:"Whole ball, whole line. Make the call."}},
  {id:'restart',ch:'rules',em:'🚩',title:"Restart Ref",types:rep('restart',5),
   bl:{easy:"Throw-in, corner kick or goal kick?",hard:"Which restart, and for which team?"}},
  {id:'offside',ch:'rules',em:'🏳️',title:"Offside?",types:rep('offside',5),
   bl:{easy:"Count the red players in front of the goal.",hard:"Find the second-last defender. Onside or off?"}},
  {id:'rulebook',ch:'rules',em:'📖',title:"Rule Book",types:rep('q:rules',5),
   bl:{easy:"Throw-ins, goal kicks, cards and more.",hard:"Offside, penalties, restarts and cards."}},
  {id:'foul',ch:'rules',em:'🟨',title:"Foul or Fair?",types:rep('q:foul',6),
   bl:{easy:"Is that a foul? You decide.",hard:"Tricky calls: shielding, handball, diving."}},
  /* everything */
  {id:'match',ch:null,em:'🏆',title:"Match Day",mixed:true,
   bl:{easy:"A mix of everything. Show what you know!",hard:"All the skills mixed together. No hints."}}
];

const TIP={
  spread:"That is a team! Each player has their own spot, so the passer has lots of safe choices and the other team has to run more.",
  space:"That is real space: away from teammates, away from red players, and with a clear line from the ball.",
  pass:"Right pass! An open teammate with a clear lane is a safe pass.",
  block:"Never stand in the pass line. Step out of it, and you can even be a second option.",
  call:"You called when he could see you. That is the secret. Now be ready!",
  shoot:"GOAL! Low and far from the keeper is the hardest shot to save.",
  sop:"Great decision! Clear path: shoot. Blocked: find the open teammate.",
  gap:"Through the gap and GOAL! Look for the biggest space between defenders.",
  box:"GOAL! You found open space in front of goal, so the cross could reach you.",
  goalside:"Stopped him! Between him and our goal, close but not too close.",
  mark:"Marked! You picked the free player closest to our goal, the most dangerous one.",
  cut:"Intercepted! Standing in the pass line lets you steal the ball.",
  back:"Back in time! You got between the ball and our goal.",
  angle:"Saved! On the line between the ball and the middle of the goal, you cover the most goal.",
  pounce:"You waited for the big touch, then pounced. That is patient defending!"
};
const PRACTICE={
  spread:"Before the ball comes your way, look at where your teammates are. If you are standing next to a teammate, one of you moves away. When the ball is far from you, stay wide and wait for it.",
  space:"When a teammate has the ball, take two steps into open space, then look at the ball. Ask yourself: is a red player near me? Is a red player in the line?",
  pass:"Look up before you pass. Pick a teammate with no defender close and nobody in the line between you.",
  block:"When your teammate is about to pass, check the line between them and the target. If you are on it, take one big step out.",
  ready:"Call one time, with his name, when his head comes up. Then stay on your toes with bent knees and your eyes on the ball.",
  brain:"Three words to remember: SPREAD, LOOK, MOVE.",
  corner:"Before you shoot, take one quick look at the goalie. Then aim low, for the side he is NOT standing on.",
  sop:"Near the goal, ask yourself one question: can I see the goal with nobody in the way? Yes: shoot. No: who is open?",
  gap:"When defenders stand in a line, look for the biggest space between two of them and dribble through it with speed.",
  box:"When a teammate is on the wing, run toward the goal into a space with no defender. Arrive just as the ball does.",
  goalbrain:"Shoot low. Aim for the corners. Always follow your shot for the rebound.",
  goalside:"When the other team has the ball, ask: am I between the ball and our goal? If not, run there first.",
  markup:"When the other team has the ball, find a red player nobody is guarding near our goal, and stand goal-side of him.",
  cut:"Watch the passer’s eyes and hips. They often show where the pass is going. Step into that line.",
  back:"The second we lose the ball, sprint back toward our goal, past the ball. Then turn and face it.",
  pounce:"Don’t dive in. Stay close, stay low, and wait. When he pushes the ball too far, that’s your moment.",
  angle:"If you play goalie, imagine a string from the ball to the middle of the goal. Stand on that string, a few steps out.",
  defbrain:"Three words for defending: GOAL-SIDE, PATIENT, TALK.",
  inout:"Remember: the whole ball has to cross the whole line. If any part of it touches the line, play on!",
  restart:"Side line: throw-in. Goal line: who touched it last? Attackers → goal kick. Defenders → corner kick.",
  offside:"Before you run forward, peek at the defenders. Stay level with the second-last one until the pass is played.",
  rulebook:"Next time you watch a game, call out the restarts before the referee does!",
  foul:"Play the ball, not the player. Keep your hands to yourself and stay on your feet.",
  match:"Pick one thing from today. Next game, just try to do that one thing every time."
};
const PROMPT={
  spread:{easy:"Everybody ran to the ball! Drag your teammates to open spots. Then tap DONE.",hard:"Everyone is bunched around the ball. Drag each teammate into open space, away from teammates and red players. Then tap DONE."},
  space:{easy:"Your friend has the ball. Drag YOU to an open spot where he can pass to you.",hard:"#10 has the ball. Drag YOU into space: away from teammates and red players, with a clear pass line."},
  pass:{easy:"You have the ball! Tap the teammate who is open.",hard:"Look up before you pass. Tap the teammate with no defender close and a clear pass line."},
  block:{easy:"#10 wants to pass to #7, but you are in the way! Drag YOU out of the pass line.",hard:"#10 wants to pass to #7 and you are in the lane. Move out of the line and become a second option, away from red players."},
  call:{easy:"Your friend is dribbling with his head down. Tap HERE! only when he looks up.",hard:"He is dribbling head-down. Call for the ball only when he looks up. Calling too early wastes your voice."},
  shoot:{easy:"Penalty kick! Tap the spot in the goal where the goalie can’t reach.",hard:"Penalty kick. Tap where to shoot: far from the keeper and close to a post."},
  sop:{easy:"You have the ball near the goal. Is the way to goal clear? Shoot or pass?",hard:"You have the ball. Check the shooting lane and #7. Shoot or pass?"},
  gap:{easy:"A wall of red players! Tap the biggest gap to dribble through.",hard:"Tap the gap you will dribble through. Pick the widest one."},
  box:{easy:"#10 will cross the ball. Drag YOU into the yellow zone, away from red players.",hard:"#10 is about to cross. Drag YOU into the yellow zone: away from defenders and the keeper, with a clear line from #10."},
  goalside:{easy:"The red player is running at our goal! Drag YOU between him and our goal.",hard:"Get goal-side: in the line between him and our goal, close enough to stop him but not so close he can dodge you."},
  mark:{easy:"Red has the ball far away. Tap the red player that nobody is guarding.",hard:"Two red players are free. Tap the one YOU should mark: the most dangerous one."},
  cut:{easy:"The red player wants to pass to his friend. Drag YOU into the pass line to steal it!",hard:"Read the pass. Drag YOU onto the line between the two red players, not too close to the passer."},
  back:{easy:"We lost the ball! Drag YOU back between the ball and our goal.",hard:"We lost the ball. Recover: get goal-side of the ball, in the middle, on his path to goal."},
  pounce:{easy:"Stay close. Tap GO! when the ball rolls away from his feet.",hard:"Jockey him. Tap GO! only when he takes a big touch. Diving in early lets him past."},
  angle:{easy:"You are the goalie! Drag YOU onto the dotted line so you cover the goal.",hard:"You are the keeper. Drag YOU onto the line between the ball and the middle of the goal, a few steps off the line."},
  line:{easy:"Look closely. Is the ball out?",hard:"Referee’s call. Did the whole ball cross the whole line?"},
  lineGoal:{easy:"Look closely. Is it a goal?",hard:"Goal-line check. Did the whole ball cross the line?"},
  restart:{easy:"The ball went out. How does the game start again?",hard:"The ball went out. Which restart, and for which team?"},
  offside:{easy:"#10 passes to YOU. Count the red players nearer the goal than YOU. Fewer than two means offside. Onside or offside?",hard:"#10 passes to YOU. Find the second-last red player. Is YOU onside or offside?"}
};

