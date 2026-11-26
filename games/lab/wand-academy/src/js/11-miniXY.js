function miniXY(e){ const r=miniCv.getBoundingClientRect(); return [(e.clientX-r.left)/r.width*miniCv.width,(e.clientY-r.top)/r.height*miniCv.height,r]; }
miniCv.addEventListener('pointerdown',e=>{ if(!MG||MG.over) return; e.preventDefault(); const [x,y]=miniXY(e); const gm=MG.game, rad=innerWidth<800?16:11;
 if(gm==='broom'){ const ny=miniCv.height*(.25+MG.lane*.25); MG.lane=Math.max(0,Math.min(2,MG.lane+(y<ny?-1:1))); Snd.sfx('tap'); return; }
 if(gm==='potion'){ MG.drag=true; MG.cx=Math.max(.05,Math.min(.95,x/miniCv.width)); try{miniCv.setPointerCapture(e.pointerId);}catch(_){} return; }
 let hit=false; MG.things.forEach((f,i)=>{ if(hit||(gm==='lanterns'&&f.lit)) return; if(Math.hypot(f.x-x,f.y-y)<rad){ hit=true; MG.n2+=f.gold?3:1; Snd.sfx(f.gold?'gold':'catch'); FX.burst(e.clientX,e.clientY,{n:f.gold?40:16,colors:f.gold?['#ffd43b','#fff3bf']:(gm==='lanterns'?['#ff922b','#ffd43b']:['#c0eb75','#fff59d']),speed:f.gold?8:5,size:f.gold?6:4}); if(f.gold) FX.text(e.clientX,e.clientY-20,'+3','#ffd43b',40);
   if(gm==='lanterns') f.lit=true; else MG.things[i]=newThing(); } }); });
miniCv.addEventListener('pointermove',e=>{ if(MG&&MG.game==='potion'&&MG.drag){ const [x]=miniXY(e); MG.cx=Math.max(.05,Math.min(.95,x/miniCv.width)); } });
['pointerup','pointercancel'].forEach(k=>miniCv.addEventListener(k,()=>{ if(MG) MG.drag=false; }));
$('#miniBack').onclick=()=>{ MG=null; goMap(); };

// ============ parent gate / reset ============
let gateAns=0; function newGateQ(){ const a=100+rnd(900),b=10+rnd(90); gateAns=a*b; $('#gateQ').textContent=`${a} × ${b} = ?`; $('#gateIn').value=''; }
$('#resetBtn').onclick=()=>{ newGateQ(); $('#gateKids').style.display='none'; $('#gateIn').style.display=''; $('#gate').classList.add('on'); $('#gateOk').onclick=gateCheck; };
function gateCheck(){ if(+$('#gateIn').value!==gateAns){ newGateQ(); $('#gateQ').textContent='Not quite — new question: '+$('#gateQ').textContent; return; }
 $('#gateQ').textContent='Who should be reset?'; $('#gateIn').style.display='none'; $('#gateKids').style.display=''; $('#gateNora').checked=false;
 $('#gateOk').onclick=()=>{ if($('#gateNora').checked){ S=fresh(); save(); sessionMissions=0; refreshStars(); Snd.setOn(true); } $('#gate').classList.remove('on'); }; }
$('#gateCancel').onclick=()=>$('#gate').classList.remove('on');

S.met=S.met||{}; S.met.nora=true; refreshStars(); updateHint();
// If anything ever goes wrong mid-animation, free the writing pad so the game never freezes.
addEventListener('error',()=>{ try{ pad.demo=null; if(current==='play'&&!(M&&M.battle&&!M.word)) pad.locked=false; pad.draw(); }catch(e){} });

// ============ test hook ============
window.__test={
 state:()=>({screen:current, mission:M&&M.m&&M.m.id, item:M&&M.items&&M.items[M.i], trial:T&&T.i, word:M&&M.word, hp:M&&M.mon&&M.mon.hp, phase:M&&M.phase, story:current==='story'?storyIdx:null, done:Object.assign({},S.done), stars:S.stars, level:S.level, ch:S.ch, view:S.view, allDone:S.allDone}),
 solve:()=>{
  if(current==='title') return $('#startBtn').click();
  if(current==='story'){ const L=storyLines[storyIdx]; if(L&&L.choices){ const i=L.choices.findIndex(c=>c.ok); $('#stChoices').children[i].click(); } else $('#stNext').click(); return; }
  if(current==='play'&&M&&M.battle&&!M.word){ const bs=[...$('#cards').children]; const w=bs.find(b=>b.classList.contains('weak'))||bs[0]; w&&w.click(); return; }
  if(current==='play'){ pad.strokes=pad.L.strokes.map(s=>s.pts.slice()); pad.draw(); $('#padCast').click(); return; }
  if(current==='map'){ const m=nextMain(S.view); if(m) return openSpot(m); const mini=CH(S.view).missions.find(x=>x.kind==='mini'&&!isDone(S.view,x.id)&&isOpen(S.view,x)); if(mini) return openSpot(mini); if(!S.chDone[S.view]) return chapterEnd(S.view); if(S.view<S.ch&&S.view<CHAPTERS.length){ S.view++; spotsKey=''; } return; }
  if(current==='mini'){ if(MG) MG.dur=0; return; }
  if(current==='result') return $('#resNext').click();
  if(current==='brk') return $('#brkDone').click();
 },
 resetSession:()=>{ sessionMissions=0; }
};
