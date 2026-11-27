async function openSpotGo(m){ const n=S.view; if(!isOpen(n,m)){ Snd.sfx('fizz'); $('#mapMsg').textContent='Locked! Finish the glowing place first.'; setTimeout(()=>{spotsKey='';renderSpots();},1600); return; }
 Snd.sfx('tap'); await walkTo(m.x,m.y+22); const sp=document.querySelector(`.spot[data-id="${m.id}"]`); if(sp){ FX.burst(...FX.center(sp),{n:45,speed:7}); Snd.sfx('spark'); } await sleep(350); startMission(m,n); }
function goMap(){ if(S.trial&&!nextMain(S.view)&&!S.chDone[S.view]) return chapterEnd(S.view); show('map'); refreshStars(); Snd.startMusic(); spotsKey='';  setTimeout(centerMap,60); }
function centerMap(){ const wr=$('#map .wrap'), box=$('#mapBox'); if(!wr||wr.scrollWidth<=wr.clientWidth+4) return; const nm=nextMain(S.view); const x=nm?nm.x:50; wr.style.scrollBehavior='auto'; wr.scrollLeft=Math.max(0,box.offsetWidth*x/100-wr.clientWidth/2); wr.style.scrollBehavior=''; const h=$('#swipeHint'); h.classList.remove('gone'); clearTimeout(centerMap.t); centerMap.t=setTimeout(()=>h.classList.add('gone'),3500); setTimeout(()=>wr.addEventListener('scroll',()=>h.classList.add('gone'),{once:true}),300); }
addEventListener('resize',()=>{ if(current==='map') centerMap(); });
$('#mapHome').onclick=()=>{ Snd.stopMusic(); show('title'); refreshStars(); };

// ============ missions ============
let M=null; // current mission run
let lastDoneKey=null;
function markDone(n,m,pts){ S.stars+=pts; S.done[key(n,m.id)]=true; lastDoneKey=key(n,m.id); if(m.kind!=='mini') sessionMissions++; save(); refreshStars(); }
function startMission(m,n=S.view){
 // (no break screen in this game: user's choice)
 Snd.stopMusic();
 if(m.kind==='story') return STORIES[m.story](()=>{ markDone(n,m,2); const r=STORY_RESULT[m.story]; resultScreen(r[0],r[1],'+2 magic stars',r[2],n); });
 if(m.kind==='mini') return startMini(m,n);
 if(m.kind==='battle') return STORIES[m.pre](()=>startBattle(m,n));
 if(m.pre) return STORIES[m.pre](()=>startWrite(m,n));
 startWrite(m,n);
}
const JOIN_LESSONS={
 join:()=>[
  say('prof',"Today you'll learn the most important cursive secret of all. In cursive, letters hold hands.",sc('runehall',[['nora',300,260,1,{expr:'wow'}],['prof',760,250,1,{arm:'wave'}]])),
  say('prof',"Finish the first letter. Then, without lifting your wand, slide up from the bottom line to where the next letter starts. Like a little slide going up.",sc('runehall',[['nora',300,260,1,{arm:'wand'}],['prof',760,250,1,{}]])),
  say('prof',"Watch the magic quill first. Then trace it slowly. Slow is perfect.",sc('runehall',[['nora',300,260,1,{arm:'wand'}],['prof',760,250,1,{expr:'happy'}]])) ],
 high:()=>[
  say('mei',"New trick! After o, w, v and b, the join doesn't go down to the bottom. It stays up high, like a little bridge, and then dips into the next letter.",sc('library',[['nora',300,260,1,{expr:'wow'}],['mei',720,280,.95,{arm:'wave'}]])),
  say('nora',"A bridge, not a slide. Okay. I'll watch the quill first.",sc('library',[['nora',300,260,1,{arm:'wand'}],['mei',720,280,.95,{expr:'happy'}]])) ],
 long:()=>[
  say('iris',"Long words are just short words holding hands. Keep your wand down, go slowly, and breathe between letters if you need to.",sc('courtyard',[['nora',300,260,1,{expr:'wow'}],['iris',730,260,1,{arm:'wand',flip:true}]])) ],
};
function lessonFor(items){ S.les=S.les||{}; const words=items.filter(w=>w.replace(/ /g,'').length>1);
 if(words.length&&!S.les.join) return 'join';
 if(words.some(w=>/[owvb][a-z]/.test(w))&&!S.les.high) return 'high';
 if(words.some(w=>w.length>=5)&&!S.les.long) return 'long';
 return null; }
function startWrite(m,n){
 const items=POOLS[m.pool]();
 const les=lessonFor(items); if(les){ S.les[les]=true; save(); return playStory(JOIN_LESSONS[les](),()=>startWriteGo(m,n,items)); }
 startWriteGo(m,n,items); }
function startWriteGo(m,n,items){
 if(!items.length){ resultScreen('You have written every spell here!','🌟','New spells are waiting in other places.',null,n); return; }
 M={m,n,items,i:0,tries:0,pts:0,quality:[],penBonus:false}; sideMode(false);
 $('#playTtl').textContent=`${m.icon} ${m.title} — ${m.goal}`;
 show('play'); showFb(m.intro); Voice.say(m.intro); loadItem();
}
// Fading guide: full trace while learning, then a faint path, then some freehand words. Two fizzles bring the full trace back.
function guideFor(t,i=0){ const k=S.joinOK||0; if(k>=30) return (i%2===1)?'free':'faint'; if(k>=15) return 'faint'; return 'full'; }
function guidePrompt(t){ const g=pad.guide; if(g==='free') return '✍️ Write it yourself!'; if(g==='faint') return '✨ Follow the faint path'; return null; }
function loadItem(){ { const h=document.getElementById('hpMe'); if(h) h.style.display='none'; } const t=M.items[M.i]; M.tries=0; pad.pen=false; pad.guide=guideFor(t,M.i); pad.set(t);
 if(!M.battle&&t.replace(/ /g,'').length>1&&(S.joinOK||0)<6) setTimeout(()=>{ if(M&&M.items[M.i]===t&&!pad.hasInk()){ showFb('👀 Watch the quill join them'); Voice.say('Watch the quill. It never lifts between letters. Then you try.'); pad.playDemo().then(()=>hideFb()); } },700);
 const isWord=t.length>1, cap=t.length===1&&t===t.toUpperCase();
 $('#playPrompt').textContent=t.includes(' ')?'Write the courage words':t.length===2?'Join the two letters':isWord?'Trace the joined word':'Trace the rune'; { const gp=guidePrompt(t); if(gp) $('#playPrompt').textContent=gp; }
 $('#playTarget').textContent=t;
 $('#playArt').innerHTML=svg(BG(MISSION_BG[M.m&&M.m.id]||'hall')+girl('nora',480,300,1.3,{arm:'wand'}),'232 100 520 520');
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
  if(!S.seen.includes(pad.text)) S.seen.push(pad.text); if(r.stars>=2&&pad.text.replace(/ /g,'').length>1){ const before=joinTier(); S.joinOK=(S.joinOK||0)+1; if(joinTier()>before) M.levelUp=joinTier(); } save();
  if(M.battle&&M.defend) return shieldBlock(r.stars);
  if(M.battle){ showFb(r.stars===3?'PERFECT writing: CRITICAL spell! ✨✨✨':'The words are turning into magic…'); return battleHit(r.stars); }
  { const pts=padScreenPts(); FX.inkSparkle(pts); const e=pts[pts.length-1]||FX.center($('#padHost')); FX.burst(e[0],e[1],{n:40+r.stars*15,speed:7,size:6}); padFlash('glowok'); Snd.sfx('rise');
    const c=FX.center($('#padHost')); FX.text(c[0],c[1]-40,r.stars===3?'PERFECT!':r.stars===2?'GREAT!':'NICE!',r.stars===3?'#ffd43b':'#fff3bf',r.stars===3?64:52); if(r.stars===3){ FX.flash('#fff3bf',.35); FX.ring(c[0],c[1],'#ffd43b',260); } }
  const msg=(r.stars===3?'Perfect spell! ':r.stars===2?'Strong spell! ':'The spell worked! ')+'✨'.repeat(r.stars)+(p===2?'  +2':'  +1')+(pad.pen&&M.penBonus?'  ✏️+1':'');
  showFb(msg); Voice.say(r.stars===3?'Perfect spell!':r.stars===2?'Strong spell!':'The spell worked!');
  await sleep(1400); nextItem();
 } else if(M.tries<((S.year===2)?3:2)){
  FX.smoke(padScreenPts()); padFlash('wobble'); Snd.sfx('poof'); if(S.year===2){ const tip=r.tips[0]||'Look at the word above and go slowly.'; if(M.tries>=2){ pad.guide='faint'; pad.clear(); const m='Fizzle! Here is a faint path to help. One more try.'; showFb(m); Voice.say(m); } else { pad.clear(); showFb('Fizzle! '+tip+' Try again, on your own.'); Voice.say('Fizzle! '+tip+' Try again.'); } } else if(pad.guide!=='full'){ pad.guide='full'; pad.clear(); const m='Fizzle! Here is the full path to help. Try once more.'; showFb(m); Voice.say(m); if(!M.battle) $('#playPrompt').textContent='Trace the joined word'; } else { const tip=r.tips[0]||'Follow the glowing path.'; showFb('Fizzle! '+tip+' Try once more.'); Voice.say('Fizzle! '+tip+' Try once more.'); pad.clear(); }
 } else {
  FX.smoke(padScreenPts()); padFlash('wobble'); Snd.sfx('poof'); pad.locked=true; showFb('Watch how this one is written, then we move on.'); Voice.say('Watch how this one is written.'); pad.clear(); pad.locked=false; await pad.playDemo(); M.quality.push(0); S.seen.push(pad.text); save(); await sleep(400); if(M.battle&&M.defend) return shieldFail(); if(M.battle) return battleMiss(); nextItem();
 }
}
function nextItem(){ M.i++; hideFb(); if(M.i<M.items.length) loadItem(); else finishMission(); }
function finishMission(){ const m=M.m,n=M.n,pts=M.pts; const st=Math.max(1,Math.round(M.quality.reduce((a,b)=>a+b,0)/M.quality.length));
 const fin=()=>{ markDone(n,m,pts); const up=M.levelUp?`  ·  🔗 New joining level: up to ${JOIN_MAX[M.levelUp]>20?'any':JOIN_MAX[M.levelUp]} letters!`:''; resultScreen(m.done,'⭐'.repeat(st)+'☆'.repeat(3-st),`+${pts} magic stars`+up,m.tip,n); };
 if(m.post) STORIES[m.post](fin); else fin();
}
function resultScreen(big,stars,txt,tip,n=S.view){
 show('result'); $('#resBig').textContent=big; $('#resStars').innerHTML=[...stars].map((ch,i)=>`<span style="animation-delay:${.3+i*.25}s">${ch}</span>`).join(''); FX.confetti(); Snd.sfx('fanfare'); setTimeout(()=>{ const c=FX.center($('#resStars')); FX.burst(c[0],c[1],{n:70,speed:10,size:7}); },500); $('#resTxt').textContent=txt; $('#resTip').textContent=tip?'💡 '+tip:''; $('#resTip').style.display=tip?'':'none';
 $('#resArt').innerHTML=`<div style="width:min(320px,60vw)">${svg(BG('hall')+girl('nora',512,280,1.2,{arm:'wand',glow:true}),'0 0 1024 640')}</div>`;
 Voice.say(big);
 const nm=nextMain(n), nb=$('#resNext');
 $('#resMap').style.display='';
 if(nm){ nb.textContent=`Next: ${nm.name} ▶`; nb.onclick=()=>{ Snd.sfx('tap'); afterMission(()=>startMission(nm,n)); }; }
 else if(!S.chDone[n]){ nb.textContent=n<CHAPTERS.length?'Chapter end ▶':'The finale ▶'; nb.onclick=()=>afterMission(()=>chapterEnd(n)); }
 else { nb.textContent='Map ▶'; nb.onclick=()=>afterMission(goMap); }
}
$('#resMap').onclick=()=>afterMission(goMap);
// Each finished mission leads into the next place with a short scene (played once).
function afterMission(next){ const k=lastDoneKey; lastDoneKey=null; S.seenT=S.seenT||{}; if(k&&TRANS[k]&&!S.seenT[k]){ S.seenT[k]=true; save(); playStory(TRANS[k](),next); } else next(); }
// No break screen in this game (user's choice).
$('#playBack').onclick=()=>{ Voice.stop(); goMap(); };
$('#brkDone').onclick=()=>{ Voice.stop(); show('title'); refreshStars(); };

// ============ Spell battles ============
function foeBody(f,state,x,y,k){ const hurt=state==='hurt'; const eyes=(ex,ey,r)=>`<ellipse cx="${-ex}" cy="${ey}" rx="${hurt?r+4:r}" ry="${hurt?6:r*1.3}" fill="${f.eye}" filter="url(#glow)"/><ellipse cx="${ex}" cy="${ey}" rx="${hurt?r+4:r}" ry="${hurt?6:r*1.3}" fill="${f.eye}" filter="url(#glow)"/>`;
 let b='';
 if(f.kind==='blob') b=`<ellipse cx="0" cy="40" rx="190" ry="170" fill="${f.body}" opacity=".35" filter="url(#wash)"/><path d="M-150 120C-170 -40 -90 -170 0 -170S170 -40 150 120C120 90 100 140 70 110C40 140 20 100 0 130C-20 100 -40 140 -70 110C-100 140 -120 90 -150 120Z" fill="${f.body}"/>${eyes(50,-30,26)}<path d="M-40 50q40 ${hurt?-20:25} 80 0" stroke="${f.eye}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
 if(f.kind==='imps') b=[[-120,40,.8],[0,-20,1],[120,40,.8]].map(([dx,dy,s])=>`<g transform="translate(${dx},${dy}) scale(${s})"><path d="M-60 -60L-40 -110L-20 -70ZM60 -60L40 -110L20 -70Z" fill="${f.body}"/><ellipse cx="0" cy="0" rx="75" ry="80" fill="${f.body}"/><path d="M-70 60q20 40 0 60M70 60q-20 40 0 60M0 70q10 40-10 60" stroke="${f.body}" stroke-width="16" fill="none" stroke-linecap="round"/>${eyes(26,-10,14)}<path d="M-22 30q22 ${hurt?-10:16} 44 0" stroke="${f.eye}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`).join('');
 if(f.kind==='crystal') b=`<ellipse cx="0" cy="20" rx="200" ry="190" fill="#d0ebff" opacity=".5" filter="url(#wash)"/><path d="M0 -190L60 -60L190 -40L80 40L120 170L0 100L-120 170L-80 40L-190 -40L-60 -60Z" fill="${f.body}" stroke="#e7f5ff" stroke-width="6"/><path d="M0 -190L0 100M-190 -40L80 40M190 -40L-80 40" stroke="#e7f5ff" stroke-width="3" opacity=".7"/>${eyes(40,-10,18)}<path d="M-30 50q30 ${hurt?-14:18} 60 0" stroke="${f.eye}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 if(f.kind==='golem') b=`<ellipse cx="0" cy="40" rx="220" ry="190" fill="#868e96" opacity=".35" filter="url(#wash)"/><rect x="-130" y="-90" width="260" height="230" rx="30" fill="${f.body}"/><rect x="-90" y="-180" width="180" height="110" rx="24" fill="${f.body}"/><rect x="-210" y="-60" width="70" height="170" rx="26" fill="${f.body}"/><rect x="140" y="-60" width="70" height="170" rx="26" fill="${f.body}"/><path d="M-40 -60L-10 0L-40 40L0 100M60 -20L30 30L60 70" stroke="${f.eye}" stroke-width="6" fill="none" filter="url(#glow)"/>${eyes(36,-130,14)}`;
 if(FOE_ART[f.kind]||Y2ART.foe[f.kind]){ const [iw,ih,h]=Y2ART.foe[f.kind]||FOE_ART[f.kind], w=h*iw/ih; b=`<ellipse cx="0" cy="${h/2-10}" rx="${w*.36}" ry="14" fill="#000" opacity=".18"/><g${hurt?' opacity=".7" transform="rotate(-8) translate(-14,6)"':''}><image href="art/m-${f.kind}.webp" x="${-w/2}" y="${-h/2-30}" width="${w}" height="${h}"/></g>${hurt?'<text x="-20" y="-150" font-size="64">💥</text>':''}`; }
 else if(f.kind==='girl'){ const aura=f.who==='wren'?`<ellipse cx="0" cy="40" rx="230" ry="260" fill="#2b2540" opacity=".55" filter="url(#wash)"/>`:''; b=`${aura}<g transform="translate(0,-110)">${girl(f.who,0,0,1.25,{arm:'wand',expr:hurt?'sad':(f.who==='wren'?'sad':'smirk'),flip:true})}</g><ellipse cx="0" cy="10" rx="215" ry="250" fill="${f.shield}" opacity="${hurt?.45:.22}" stroke="${f.shield}" stroke-width="6"/>`; }
 return `<g transform="translate(${x},${y}) scale(${k})" filter="url(#soft)">${b}</g>`; }
