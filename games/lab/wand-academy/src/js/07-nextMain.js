const nextMain=(n=S.view)=>mainOf(n).find(m=>!isDone(n,m.id));
function isOpen(n,m){ if(n>S.ch) return false; if(m.needs&&!S.done[m.needs]) return false; if(m.kind==='mini') return isDone(n,m.after); const L=mainOf(n),k=L.indexOf(m); return k===0||isDone(n,L[k-1].id); }

// ============ screens ============
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id)); current=id; FX.ambient(id==='title'||id==='story'||id==='result'?'light':null); updateHint(); if(id==='map'){ drawMap(); } }
let current='title';
let hintShown=false; function updateHint(){ const port=innerHeight>innerWidth&&innerWidth<600; const on=port&&current!=='title'&&!hintShown; $('#rotHint').style.display=on?'block':'none'; if(on){ hintShown=true; setTimeout(()=>{ $('#rotHint').style.display='none'; },4000); } }
addEventListener('resize',()=>{ updateHint(); if(current==='map') drawMap(); if(current==='mini') miniResize(); });
function refreshStars(){ ['#stStars','#mapStars','#playStars'].forEach(s=>$(s).textContent=S.stars); const n=Math.min(S.ch,CHAPTERS.length), d=mainOf(n).filter(m=>isDone(n,m.id)).length; $('#stCh').textContent=d+'/'+mainOf(n).length; $('#stChL').textContent=S.allDone?'All chapters ✓':'Chapter '+n; }

$('#titleArt').innerHTML=svg(BGS.gate()+girl('nora',512,260,1.05,{arm:'wand',glow:true})+`<text x="660" y="180" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="74" fill="#e9a91c" filter="url(#glow)">magic</text>`);
$('#startBtn').onclick=()=>{ FX.burst(...FX.center($('#startBtn')),{n:60,speed:9}); Snd.init(); try{Snd.ctx.resume();}catch(e){} Snd.sfx('chime'); if(!S.introSeen){ playStory(INTRO(),()=>{ S.introSeen=true; save(); startTrial(); },{skippable:true}); } else if(!S.trial) startTrial(); else { S.view=Math.min(S.ch,CHAPTERS.length); goMap(); } };
$('#voiceBtn').onclick=()=>{ try{KAVoice.picker();}catch(e){} };
$('#friendsBtn').onclick=()=>{ Snd.init(); openFriends(()=>{ show('title'); refreshStars(); }); };
$('#mapFriends').onclick=()=>{ Snd.stopMusic(); openFriends(()=>goMap()); };
['#muteBtn1','#muteBtn2'].forEach(s=>$(s).onclick=()=>{ Snd.init(); Snd.setOn(!S.sound); if(S.sound&&(current==='map')) Snd.startMusic(); });
Snd.setOn(S.sound);

// ============ map (pixel, one look per chapter) ============
const mapCv=$('#mapCv'),mg=mapCv.getContext('2d'); mg.imageSmoothingEnabled=false;
let noraPos={x:50,y:60};
const SPR=["......KKK.......",".....KKKKK.PP...","...KKKKKKKKKPK..","..KKKKKKKKKKKK..","..KKKYKKKKKKKK..","..KKSSKKKKSSKK..","..KSSSSSSSSSSK..","..KSBWSSSSBWSK..","..KSBBSSSSBBSK..","..KSRSSSSSSRSK..","..KSSSSMMSSSSK..","...SSSSSSSSSS...","....VVVVVVVV....","...VVVLLLLVVV...","..VVVVVLLVVVVV..","..VVVVVVVVVVVV..","..VVVVVVVVVVVV..","...VVVVVVVVVV...","....SS....SS....","....NN....NN...."];
const PAL={K:'#1d1d24',P:'#ff6fa8',Y:'#ffd43b',S:'#ffd8be',B:'#7a4520',W:'#fff',R:'#f59fb5',M:'#c2255c',V:'#7048e8',L:'#ffd43b',N:'#3b2f2f'};
const EMBER_PX=['..HH......','.OOOO..W..','OOEOOOWWW.','OOOOOOOWW.','.OOOBBOO..','..OO..OO..'];
const EMBER_PAL={H:'#e8590c',O:'#ffa94d',E:'#2b2b33',W:'#ffd8a8',B:'#fff3bf'};
function sprite(g,ox,oy,p,map=SPR,pal=PAL){ map.forEach((r,j)=>[...r].forEach((c,i)=>{ if(pal[c]){ g.fillStyle=pal[c]; g.fillRect(ox+i*p,oy+j*p,p,p);} })); }
const THEMES={
 night:{sky:['#1b1f4a','#262b63'],castle:'#3a3f86',top:'#2b2f6e',ground:'#2f6f3e',g2:'#37844a',moon:true},
 dusk:{sky:['#5f3dc4','#e8590c'],castle:'#4c3b7a',top:'#3b2d63',ground:'#5c7f3a',g2:'#6f9544',sun:true},
 violet:{sky:['#2b1747','#5f3dc4'],castle:'#3b2a6b',top:'#2a1f52',ground:'#3b3f6b',g2:'#4a4f82',pages:true,moon:true},
 storm:{sky:['#212529','#495057'],castle:'#343a40',top:'#212529',ground:'#2b3a33',g2:'#34463d',rain:true},
};
function drawMap(t=performance.now()){
 const g=mg,W=480,H=270,P=2, n=S.view, th=THEMES[CH(n).theme], L=mainOf(n), lit=L.filter(m=>isDone(n,m.id)).length; const wr=mapCv.parentNode.parentNode; if(wr.dataset.th!==CH(n).theme){ wr.dataset.th=CH(n).theme; wr.style.background=th.sky[0]; }
 for(let y=0;y<200;y+=6){ g.fillStyle=y<100?th.sky[0]:th.sky[1]; if(y>=90&&y<110&&(y/6)%2) g.fillStyle=th.sky[0]; g.fillRect(0,y,W,6); }
 g.fillStyle='#fff'; for(let i=0;i<30;i++){ const x=(i*97)%W,y=(i*53)%90; if(!th.sun&&(i+Math.floor(t/700))%7) g.fillRect(x,y,P,P); }
 if(th.moon){ g.fillStyle='#fff6d8'; for(let j=0;j<20;j+=2){ const w=Math.round(Math.sqrt(100-(j-10)*(j-10))); g.fillRect(440-w,14+j,w*2,2);} g.fillStyle=th.sky[0]; for(let j=0;j<20;j+=2){ const w=Math.round(Math.sqrt(100-(j-10)*(j-10))); g.fillRect(446-w,12+j,w*2,2);} }
 if(th.sun){ g.fillStyle='#ffd43b'; for(let j=0;j<24;j+=2){ const w=Math.round(Math.sqrt(144-(j-12)*(j-12))); g.fillRect(420-w,150+j,w*2,2);} }
 g.fillStyle=th.castle; g.fillRect(60,70,360,140); g.fillStyle=th.top; for(let x=60;x<420;x+=20) g.fillRect(x,62,10,8);
 g.fillRect(200,24,80,50); for(let x=200;x<280;x+=16) g.fillRect(x,18,8,8); g.fillRect(70,40,40,40); g.fillRect(370,40,40,40);
 const wins=[[90,60],[385,60],[225,40],[250,40],[100,110],[160,110],[300,110],[360,110],[130,150],[330,150]];
 wins.forEach(([x,y],i)=>{ const on=i<2+lit*2; g.fillStyle=on?(Math.sin(t/180+i*2)>.85?'#ffe8a3':'#ffd43b'):'#151838'; g.fillRect(x,y,8,12); if(on){ g.fillStyle='#ffd43b22'; g.fillRect(x-4,y-4,16,20); } });
 if(th.pages) for(let i=0;i<10;i++){ const x=(i*53+t/40)%W, y=40+((i*37+t/25)%140); g.fillStyle='#f8f0e3'; g.fillRect(Math.round(x),Math.round(y),6,4); }
 if(th.rain){ g.fillStyle='#a5d8ff88'; for(let i=0;i<60;i++){ const x=(i*41+t/4)%W, y=(i*67+t/2)%270; g.fillRect(Math.round(x),Math.round(y),1,5); } if(Math.sin(t/900)>.985){ g.fillStyle='#fff8'; g.fillRect(0,0,W,H); } }
 g.fillStyle=th.ground; g.fillRect(0,200,W,70); for(let x=0;x<W;x+=6) for(let y=200;y<H;y+=6) if(((x+y)/6)%5===0){ g.fillStyle=th.g2; g.fillRect(x,y,6,6);}
 g.fillStyle='#c9a26b'; for(let x=40;x<440;x+=4) g.fillRect(x,226+Math.round(Math.sin(x/40)*3)*2,4,6);
 // dark swirl over the next battle spot
 const nb=L.find(m=>m.kind==='battle'&&!isDone(n,m.id)); if(nb){ const cx=nb.x/100*W, cy=nb.y/100*H; for(let i=0;i<14;i++){ const a=t/500+i; g.fillStyle=i%2?'#5f3dc4':'#141838'; g.fillRect(Math.round(cx+Math.cos(a)*16),Math.round(cy+Math.sin(a)*16),4,4);} }
 const bob=walking?Math.round(Math.abs(Math.sin(t/60))*-6):Math.round(Math.sin(t/400)*1.5); g.fillStyle='#0005'; g.fillRect(Math.round(noraPos.x/100*W)-12,Math.round(noraPos.y/100*H),24,4); sprite(g,Math.round(noraPos.x/100*W)-16,Math.round(noraPos.y/100*H)-40+bob,2);
 if(S.done['c1:roost']){ const ex=Math.round(noraPos.x/100*W)+18, ey=Math.round(noraPos.y/100*H)-46+Math.round(Math.sin(t/220)*3); sprite(g,ex,ey,2,EMBER_PX,EMBER_PAL); }
 if(current==='map') requestAnimationFrame(drawMap);
 renderSpots();
}
let spotsKey='';
function renderSpots(){ const n=S.view, k=JSON.stringify(S.done)+n+S.ch; if(k===spotsKey&&$('#spots').children.length) return; spotsKey=k; const box=$('#spots'); box.innerHTML='';
 const nm=nextMain(n);
 CH(n).missions.forEach(m=>{ const b=document.createElement('button'); const open=isOpen(n,m); b.className='spot'+(open?'':' lock')+(isDone(n,m.id)?' done':'')+(m===nm?' next':''); b.style.left=m.x+'%'; b.style.top=m.y+'%'; b.innerHTML=`<span class="ic">${open?m.icon:'🔒'}</span><span>${m.name}</span>`; b.dataset.id=m.id; b.onclick=()=>openSpot(m); box.appendChild(b); });
 $('#mapTtl').textContent=`Chapter ${n} · ${CH(n).title}`;
 $('#chPrev').style.visibility=n>1?'visible':'hidden'; $('#chNext').style.visibility=n<Math.min(S.ch,CHAPTERS.length)?'visible':'hidden';
 $('#mapMsg').textContent= nm&&nm.needs&&!S.done[nm.needs] ? 'First hatch the dragon egg in Chapter 1 ◀' : nm ? `Go to the ${nm.name}! ${nm.icon}` : (n<CHAPTERS.length?`Chapter ${n} complete! ▶ Chapter ${n+1}`:'You saved Inkwell Academy! ✨');
}
$('#chPrev').onclick=()=>{ if(S.view>1){ S.view--; save(); spotsKey=''; Snd.sfx('tap'); } };
$('#chNext').onclick=()=>{ if(S.view<Math.min(S.ch,CHAPTERS.length)){ S.view++; save(); spotsKey=''; Snd.sfx('tap'); } };
let walking=false; async function walkTo(x,y){ walking=true; const sx=noraPos.x,sy=noraPos.y; for(let k=1;k<=18;k++){ noraPos={x:sx+(x-sx)*k/18,y:sy+(y-sy)*k/18}; await sleep(28); } walking=false; }
async function openSpot(m){ const n=S.view; if(!isOpen(n,m)){ Snd.sfx('fizz'); $('#mapMsg').textContent='Locked! Finish the glowing place first.'; setTimeout(()=>{spotsKey='';renderSpots();},1600); return; }
 Snd.sfx('tap'); await walkTo(m.x,m.y+22); const sp=document.querySelector(`.spot[data-id="${m.id}"]`); if(sp){ FX.burst(...FX.center(sp),{n:45,speed:7}); Snd.sfx('spark'); } await sleep(350); startMission(m,n); }
function goMap(){ if(S.trial&&!nextMain(S.view)&&!S.chDone[S.view]) return chapterEnd(S.view); show('map'); refreshStars(); Snd.startMusic(); spotsKey=''; }
$('#mapHome').onclick=()=>{ Snd.stopMusic(); show('title'); refreshStars(); };

// ============ missions ============
let M=null; // current mission run
function markDone(n,m,pts){ S.stars+=pts; S.done[key(n,m.id)]=true; sessionMissions++; save(); refreshStars(); }
function startMission(m,n=S.view){
 if(sessionMissions>=3){ show('brk'); Snd.stopMusic(); return; }
 Snd.stopMusic();
 if(m.kind==='story') return STORIES[m.story](()=>{ markDone(n,m,2); const r=STORY_RESULT[m.story]; resultScreen(r[0],r[1],'+2 magic stars',r[2],n); });
 if(m.kind==='mini') return startMini(m,n);
 if(m.kind==='battle') return STORIES[m.pre](()=>startBattle(m,n));
 if(m.pre) return STORIES[m.pre](()=>startWrite(m,n));
 startWrite(m,n);
}
function startWrite(m,n){
 const items=POOLS[m.pool]();
 if(!items.length){ resultScreen('You have written every spell here!','🌟','New spells are waiting in other places.',null,n); return; }
 M={m,n,items,i:0,tries:0,pts:0,quality:[],penBonus:false}; sideMode(false);
 $('#playTtl').textContent=`${m.icon} ${m.title} — ${m.goal}`;
 show('play'); showFb(m.intro); Voice.say(m.intro); loadItem();
}
function loadItem(){ const t=M.items[M.i]; M.tries=0; pad.pen=false; pad.set(t);
 const isWord=t.length>1, cap=t.length===1&&t===t.toUpperCase();
 $('#playPrompt').textContent=t.includes(' ')?'Write the courage words':isWord?'Trace the joined word':'Trace the rune';
 $('#playTarget').textContent=t;
 $('#playArt').innerHTML=svg(BGS.hall()+girl('nora',480,300,1.3,{arm:'wand'}),'232 100 520 520');
 $('#penBadge').textContent='✏️ Use the Pencil for a bonus star!';
 $('#playDots').innerHTML=M.items.map((_,k)=>`<i class="${k<M.i?'ok':k===M.i?'cur':''}"></i>`).join('');
 setTimeout(()=>Voice.say(isWord?`Write ${t}, all joined together.`:`Trace ${cap?'capital':'lowercase'} ${t}.`),M.i===0?2600:200);
}
$('#padClear').onclick=()=>{ Snd.sfx('tap'); pad.clear(); hideFb(); };
$('#padShow').onclick=async()=>{ if(pad.demo) return; pad.clear(); hideFb(); await pad.playDemo(); };
$('#padCast').onclick=()=>cast();
async function cast(){
 if(!M||pad.locked) return; if(pad.demo){ showFb('Watch the magic quill first, then trace! ✨'); return; } if(!pad.hasInk()){ showFb('Write with your finger or Pencil first ✍️'); return; }
 if(M.battle&&!M.word){ showFb('Pick a spell card first! 🃏'); return; }
 const r=pad.score(); M.tries++;
 if(r.stars>=1){
  pad.locked=true; const p=M.tries===1?2:1; M.pts+=p; M.quality.push(r.stars); if(pad.pen&&!M.penBonus){ M.penBonus=true; M.pts+=1; }
  if(!S.seen.includes(pad.text)) S.seen.push(pad.text); save();
  if(M.battle){ showFb(r.stars===3?'PERFECT writing: CRITICAL spell! ✨✨✨':'The words are turning into magic…'); return battleHit(r.stars); }
  { const pts=padScreenPts(); FX.inkSparkle(pts); const e=pts[pts.length-1]||FX.center($('#padHost')); FX.burst(e[0],e[1],{n:40+r.stars*15,speed:7,size:6}); padFlash('glowok'); Snd.sfx('rise');
    const c=FX.center($('#padHost')); FX.text(c[0],c[1]-40,r.stars===3?'PERFECT!':r.stars===2?'GREAT!':'NICE!',r.stars===3?'#ffd43b':'#fff3bf',r.stars===3?64:52); if(r.stars===3){ FX.flash('#fff3bf',.35); FX.ring(c[0],c[1],'#ffd43b',260); } }
  const msg=(r.stars===3?'Perfect spell! ':r.stars===2?'Strong spell! ':'The spell worked! ')+'✨'.repeat(r.stars)+(p===2?'  +2':'  +1')+(pad.pen&&M.penBonus?'  ✏️+1':'');
  showFb(msg); Voice.say(r.stars===3?'Perfect spell!':r.stars===2?'Strong spell!':'The spell worked!');
  await sleep(1400); nextItem();
 } else if(M.tries<2){
  FX.smoke(padScreenPts()); padFlash('wobble'); Snd.sfx('poof'); const tip=r.tips[0]||'Follow the glowing path.'; showFb('Fizzle! '+tip+' Try once more.'); Voice.say('Fizzle! '+tip+' Try once more.'); pad.clear();
 } else {
  FX.smoke(padScreenPts()); padFlash('wobble'); Snd.sfx('poof'); pad.locked=true; showFb('Watch how this one is written, then we move on.'); Voice.say('Watch how this one is written.'); pad.clear(); pad.locked=false; await pad.playDemo(); M.quality.push(0); S.seen.push(pad.text); save(); await sleep(400); if(M.battle) return battleMiss(); nextItem();
 }
}
