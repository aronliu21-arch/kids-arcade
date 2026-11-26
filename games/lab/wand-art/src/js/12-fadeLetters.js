function fadeLetters(){ return `<g opacity=".7">${['o','u','d','f','y','e','r'].map((c,i)=>`<text x="${700+i*36}" y="${380-i*38}" font-family="'TeX Gyre Chorus',cursive" font-size="40" fill="#e9a91c" filter="url(#glow)">${c}</text>`).join('')}</g>`; }
function titleCard(n){ return svg(`<rect width="1024" height="640" fill="#2b2440"/><circle cx="512" cy="320" r="300" fill="url(#warm)" opacity=".5"/><text x="512" y="250" text-anchor="middle" font-family="Poppins,system-ui" font-weight="800" font-size="44" fill="#ffd43b" letter-spacing="8">CHAPTER ${n}</text><text x="512" y="360" text-anchor="middle" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="96" fill="#fff3bf" filter="url(#glow)">${CH(n).title}</text>`); }
function chapterEnd(n){ const last=n===CHAPTERS.length;
 playStory(CH_TEXT[n].end(),()=>{ S.chDone[n]=true; if(last){ S.allDone=true; save(); FX.confetti(); setTimeout(()=>FX.confetti(),800); show('title'); refreshStars(); return; }
  S.ch=Math.max(S.ch,n+1); S.view=n+1; save(); FX.flash('#fff3bf',.5,600);
  playStory([say(null,`Chapter ${n+1}: ${CH(n+1).title}`,titleCard(n+1),{sfx:'gold'}),...CH_TEXT[n+1].start()],()=>goMap()); }); }

// ============ mini games (just for fun) ============
const miniCv=$('#miniCv'), xg=miniCv.getContext('2d'); let MG=null;
const MINI={ fireflies:{title:'✨ Firefly Garden',say:'Catch the fireflies! Golden ones are worth three.',unit:'fireflies'},
 lanterns:{title:'🏮 Sky Lanterns',say:'Tap the floating lanterns to light them! Golden ones are worth three.',unit:'lanterns'},
 broom:{title:'🧹 Broom Race',say:'Tap above or below your broom to fly up and down. Grab stars, dodge the rain clouds!',unit:'stars'},
 potion:{title:'🧪 Potion Mix',say:'Slide the cauldron to catch the sparkly ingredients. Watch out for stinky socks!',unit:'points'} };
function miniResize(){ const r=miniCv.getBoundingClientRect(); miniCv.width=Math.max(120,Math.round(r.width/3)); miniCv.height=Math.max(80,Math.round(r.height/3)); xg.imageSmoothingEnabled=false; }
function startMini(m,n){ const def=MINI[m.game]; show('mini'); miniResize(); $('#miniTtl').textContent=def.title; $('#miniBest').textContent=(S.bests[m.game]||0);
 MG={m,n,game:m.game,n2:0,t0:performance.now(),dur:m.game==='broom'?30000:25000,things:[],pops:[],over:false,lane:1,cx:.5};
 if(m.game==='fireflies'||m.game==='lanterns') for(let i=0;i<9;i++) MG.things.push(newThing());
 Voice.say(def.say); requestAnimationFrame(miniLoop); }
function newThing(){ const W=miniCv.width,H=miniCv.height,gm=MG.game,gold=Math.random()<.12;
 if(gm==='fireflies') return {x:Math.random()*W,y:20+Math.random()*(H-40),a:Math.random()*6,s:(gold?.9:.5)+Math.random()*.6,gold,ph:Math.random()*6};
 if(gm==='lanterns') return {x:10+Math.random()*(W-20),y:H+10+Math.random()*40,s:.25+Math.random()*.35,gold,lit:false,ph:Math.random()*6};
 if(gm==='broom') return {x:W+10,lane:rnd(3),kind:Math.random()<.65?'star':'cloud',s:.9+Math.random()*.5};
 if(gm==='potion'){ const r=Math.random(); return {x:10+Math.random()*(W-20),y:-10,s:.45+Math.random()*.4,kind:r<.12?'gold':r<.3?'sock':'good',c:['#ff6fa8','#69db7c','#74c0fc','#ffd43b','#b197fc'][rnd(5)]}; } }
function miniLoop(t){ if(current!=='mini'||!MG) return; const W=miniCv.width,H=miniCv.height,g=xg,gm=MG.game; const left=Math.max(0,MG.dur-(t-MG.t0));
 const bg={fireflies:'#141838',lanterns:'#1f1640',broom:'#4dabf7',potion:'#2b2140'}[gm]; g.fillStyle=bg; g.fillRect(0,0,W,H);
 if(gm==='fireflies'||gm==='lanterns'){ g.fillStyle='#1f6d3a'; g.fillRect(0,H-18,W,18); }
 if(gm==='fireflies'){ g.fillStyle='#a5d8ff55'; g.fillRect(W-30,H-44,20,26); g.fillStyle='#8d5a2b'; g.fillRect(W-32,H-48,24,4); g.fillStyle='#fff59d'; for(let i=0;i<Math.min(MG.n2,20);i++) g.fillRect(W-28+(i*5)%16,H-22-Math.floor(i/4)*4,2,2);
  for(const f of MG.things){ f.a+=(Math.random()-.5)*.3; f.x+=Math.cos(f.a)*f.s; f.y+=Math.sin(f.a)*f.s*.7; if(f.x<0||f.x>W) f.a=Math.PI-f.a; if(f.y<10||f.y>H-24) f.a=-f.a; f.x=Math.max(0,Math.min(W,f.x)); f.y=Math.max(10,Math.min(H-24,f.y)); f.ph+=.15;
   const on=Math.sin(f.ph)>-.3; g.fillStyle=f.gold?'#ffd43b':'#c0eb75'; if(on){ g.globalAlpha=.3; g.fillRect(f.x-3,f.y-3,7,7); g.globalAlpha=1; } g.fillRect(Math.round(f.x),Math.round(f.y),f.gold?3:2,f.gold?3:2); } }
 if(gm==='lanterns'){ g.fillStyle='#fff'; for(let i=0;i<20;i++) g.fillRect((i*37)%W,(i*23)%(H-30),1,1);
  MG.things.forEach((l,i)=>{ l.y-=l.s; l.ph+=.05; const x=Math.round(l.x+Math.sin(l.ph)*3),y=Math.round(l.y); if(l.lit){ g.fillStyle=l.gold?'#ffd43b55':'#ff922b44'; g.fillRect(x-6,y-7,13,16); } g.fillStyle=l.lit?(l.gold?'#ffd43b':'#ff922b'):'#5c4b3a'; g.fillRect(x-3,y-4,7,9); g.fillStyle='#3b2f2f'; g.fillRect(x-2,y+5,5,1); if(y<-15) MG.things[i]=newThing(); }); }
 if(gm==='broom'){ const laneY=k=>Math.round(H*(.25+k*.25)); g.fillStyle='#e7f5ff'; for(let i=0;i<6;i++){ const x=((i*71)-(t/30))%(W+40); g.fillRect((x+W+40)%(W+40)-20,(i*29)%H,16,5); }
  if(Math.random()<.04) MG.things.push(newThing());
  MG.things.forEach(o=>{ o.x-=o.s*1.4; const y=laneY(o.lane); if(o.kind==='star'){ g.fillStyle='#ffd43b'; g.fillRect(Math.round(o.x)-2,y-2,5,5); g.fillRect(Math.round(o.x),y-4,1,9); g.fillRect(Math.round(o.x)-4,y,9,1); } else { g.fillStyle='#495057'; g.fillRect(Math.round(o.x)-7,y-4,15,7); g.fillStyle='#74c0fc'; g.fillRect(Math.round(o.x)-5,y+4,1,3); g.fillRect(Math.round(o.x),y+4,1,3); } });
  const ny=laneY(MG.lane), bx=Math.round(W*.18); g.fillStyle='#8d5a2b'; g.fillRect(bx-10,ny+4,22,2); g.fillStyle='#c9a26b'; g.fillRect(bx-14,ny+2,5,6); g.fillStyle='#7048e8'; g.fillRect(bx-3,ny-4,7,8); g.fillStyle='#ffd8be'; g.fillRect(bx-2,ny-9,5,5); g.fillStyle='#1d1d24'; g.fillRect(bx-3,ny-10,7,2); g.fillRect(bx+3,ny-9,2,3);
  MG.things=MG.things.filter(o=>{ if(o.x<-10) return false; if(o.lane===MG.lane&&Math.abs(o.x-bx)<6){ const sx=miniCv.getBoundingClientRect(); const px=sx.left+o.x/W*sx.width, py=sx.top+laneY(o.lane)/H*sx.height;
    if(o.kind==='star'){ MG.n2++; Snd.sfx('catch'); FX.burst(px,py,{n:14,speed:5,size:4}); } else { MG.n2=Math.max(0,MG.n2-2); Snd.sfx('poof'); FX.smoke([[px,py]]); FX.text(px,py-10,'-2','#a5d8ff',30); } return false; } return true; }); }
 if(gm==='potion'){ const cx=Math.round(MG.cx*W), cy=H-14; if(Math.random()<.05) MG.things.push(newThing());
  MG.things.forEach(o=>{ o.y+=o.s; const x=Math.round(o.x),y=Math.round(o.y); if(o.kind==='sock'){ g.fillStyle='#ced4da'; g.fillRect(x-3,y-6,5,9); g.fillRect(x-3,y+2,9,4); g.fillStyle='#868e96'; g.fillRect(x-3,y-6,5,2); g.fillStyle='#94d82d'; g.fillRect(x+4,y-8,1,2); g.fillRect(x+6,y-6,1,2); } else { const c=o.kind==='gold'?'#ffd43b':o.c; g.fillStyle=c+'55'; g.fillRect(x-5,y-5,11,11); g.fillStyle=c; g.fillRect(x-3,y-4,7,8); g.fillRect(x-4,y-2,9,4); g.fillStyle='#fff'; g.fillRect(x-2,y-3,2,2); } });
  g.fillStyle='#212529'; g.fillRect(cx-13,cy-7,26,13); g.fillRect(cx-15,cy-8,30,3); g.fillStyle='#69db7c'; g.fillRect(cx-11,cy-6,22,3); g.fillStyle='#ffd43b'; g.fillRect(cx-1,cy+6,2,2); if(Math.random()<.3){ g.fillStyle='#b2f2bb'; g.fillRect(cx-6+rnd(12),cy-10-rnd(4),2,2); }
  MG.things=MG.things.filter(o=>{ if(o.y>H+6) return false; if(o.y>cy-8&&o.y<cy+4&&Math.abs(o.x-cx)<13){ const r=miniCv.getBoundingClientRect(), px=r.left+o.x/W*r.width, py=r.top+cy/H*r.height;
    if(o.kind==='sock'){ MG.n2=Math.max(0,MG.n2-2); Snd.sfx('poof'); FX.smoke([[px,py]]); FX.text(px,py-20,'P-U!','#94d82d',34); } else { const v=o.kind==='gold'?3:1; MG.n2+=v; Snd.sfx(v>1?'gold':'catch'); FX.burst(px,py,{n:v>1?30:12,colors:[o.kind==='gold'?'#ffd43b':o.c,'#fff'],speed:5,size:4}); } return false; } return true; }); }
 MG.pops=MG.pops.filter(p=>t-p.t<500); for(const p of MG.pops){ g.fillStyle='#fff'; g.font='8px Unifont,monospace'; g.fillText(p.txt,p.x,p.y-(t-p.t)/40); }
 $('#miniN').textContent=MG.n2; $('#miniT').textContent=Math.ceil(left/1000);
 if(left<=0&&!MG.over){ MG.over=true; const sc2=MG.n2, nb=sc2>(S.bests[gm]||0); if(nb) S.bests[gm]=sc2; markDone(MG.n,MG.m,1);
  setTimeout(()=>resultScreen(nb?`New record: ${sc2} ${MINI[gm].unit}!`:`You got ${sc2} ${MINI[gm].unit}!`,'🎉✨','+1 magic star',null,MG.n),400); return; }
 requestAnimationFrame(miniLoop); }
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
  if(current==='story'){ const L=storyLines[storyIdx]; if(L&&L.choices){ const c=L.choices.find(c=>c.ok); [...$('#stChoices').children].find(b=>b.textContent===c.t).click(); } else $('#stNext').click(); return; }
  if(current==='play'&&M&&M.battle&&!M.word){ const bs=[...$('#cards').children]; const w=bs.find(b=>b.classList.contains('weak'))||bs[0]; w&&w.click(); return; }
  if(current==='play'){ pad.strokes=pad.L.strokes.map(s=>s.pts.slice()); pad.draw(); $('#padCast').click(); return; }
  if(current==='map'){ const m=nextMain(S.view); if(m) return openSpot(m); const mini=CH(S.view).missions.find(x=>x.kind==='mini'&&!isDone(S.view,x.id)&&isOpen(S.view,x)); if(mini) return openSpot(mini); if(!S.chDone[S.view]) return chapterEnd(S.view); if(S.view<S.ch&&S.view<CHAPTERS.length){ S.view++; spotsKey=''; } return; }
  if(current==='mini'){ if(MG) MG.dur=0; return; }
  if(current==='result') return $('#resNext').click();
  if(current==='brk') return $('#brkDone').click();
 },
 resetSession:()=>{ sessionMissions=0; }
};
