// ================= YEAR 3 ENGINE =================
Object.assign(STORIES,Y3.STORIES); Object.assign(STORY_RESULT,Y3.RESULT); Object.assign(FOES,Y3.FOES);
// new places borrow the closest painted picture until their own art is made
const Y3_ALIAS={roost:'tower',arena:'courtyard',clock:'bigstairs'};
if(typeof BG_ALIAS!=='undefined') Object.assign(BG_ALIAS,Y3_ALIAS); else { const _BG3=BG; BG=function(k){ return _BG3(Y3_ALIAS[k]||k); }; }
Y3.CH.forEach(c=>c.missions.forEach(m=>{ if(m.kind==='write'&&!MISSION_BG[m.id]) MISSION_BG[m.id]=m.bg; }));
for(const k in Y3.SPELLS) Y3.SPELLS[k].forEach(w=>ELEM_OF[w]=k);

// ---------- years
function y2Done(){ return yearOf()===2?!!S.allDone:!!(S.years&&S.years[2]&&S.years[2].allDone); }
applyYear=function(){ const y=yearOf(); CHAPTERS=y===3?Y3.CH:y===2?Y2.CH:CH1; CH_TEXT=y===3?Y3.CH_TEXT:y===2?Y2.CH_TEXT:CHT1; document.body.dataset.year=y; };
applyYear();
const _ry3=renderYears; renderYears=function(){ _ry3(); const b=$('#y3Btn'); if(!b) return; const ok=y2Done(); b.disabled=!ok; b.innerHTML=ok?'📙 Year 3 <small>The Silver Pen</small>':'🔒 Year 3 <small>Finish Year 2 first</small>'; b.classList.toggle('on',yearOf()===3); };
$('#y3Btn').onclick=()=>{ if(!y2Done()) return; if(yearOf()!==3){ setYear(3); Snd.sfx('gold'); FX.burst(...FX.center($('#y3Btn')),{n:60,speed:9}); } renderYears(); };
const _st3=$('#startBtn').onclick;
$('#startBtn').onclick=function(){ if(yearOf()!==3) return _st3.apply(this,arguments); FX.burst(...FX.center($('#startBtn')),{n:60,speed:9}); Snd.init(); try{Snd.ctx.resume();}catch(e){} Snd.sfx('chime');
 if(!S.introSeen){ playStory([...Y3.INTRO(),say(null,'Year 3: The Silver Pen',Y3CARD('YEAR 3','The Silver Pen'),{sfx:'gold'}),say(null,`Chapter 1: ${CH(1).title}`,titleCard(1),{sfx:'gold'})],()=>{ S.introSeen=true; save(); goMap(); },{skippable:true}); } else { S.view=Math.min(S.view||1,S.ch,CHAPTERS.length); goMap(); } };

// ---------- phrases: any length is fine in Year 3 (she has finished the joining levels)
const _fits3=fitsJoin; fitsJoin=function(w,t){ return yearOf()>=3?true:_fits3(w,t); };
const Y3_WRITE=['y3hello','y3pip','y3guard','y3own'];
function y3Pick(k,n=5){ const un=L=>shuffle(L.filter(w=>!S.seen.includes(w))); let out=un(Y3.POOLS_W[k]).slice(0,n);
 if(out.length<n&&k!=='y3clue') for(const o of Y3_WRITE){ if(o===k) continue; out=out.concat(un(Y3.POOLS_W[o]).filter(w=>!out.includes(w))).slice(0,n); if(out.length>=n) break; }
 return out; }
Object.keys(Y3.POOLS_W).forEach(k=>{ POOLS[k]=()=>y3Pick(k); });
const _sw3=startWrite; startWrite=function(m,n){ if(m.recipe) return startWriteGo(m,n,Y3.RECIPE[m.recipe].steps.slice()); return _sw3(m,n); };

// clue spells hide the phrase; recipes show a recipe card
const _li3=loadItem; loadItem=function(){ _li3(); if(!M||M.battle||!M.m) return; const t=M.items[M.i];
 if(M.m.clue){ const c=Y3.CLUE[t]||''; $('#playTarget').textContent=t.split(' ').map(w=>'_ '.repeat(w.length).trim()).join('   '); $('#playPrompt').textContent='❓ '+c; setTimeout(()=>{ if(M&&M.items[M.i]===t) Voice.say(c); },M.i===0?2600:300); }
 if(M.m.recipe){ const R3=Y3.RECIPE[M.m.recipe]; $('#playPrompt').innerHTML=`🧪 Step ${M.i+1} of ${R3.steps.length}: `+R3.steps.map((x,k)=>k<M.i?`<s style="opacity:.55">${x}</s>`:k===M.i?`<b style="color:#5f3dc4">${x}</b>`:`<span style="opacity:.45">${x}</span>`).join(' · '); $('#playArt').innerHTML=recipeCard(R3,M.i); } };
function recipeCard(R3,cur){ const rows=R3.steps.map((st,i)=>`<text x="90" y="${210+i*62}" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="40" fill="${i<cur?'#2b8a3e':i===cur?'#5f3dc4':'#adb5bd'}">${i<cur?'✓ ':i===cur?'➜ ':''}${i+1}. ${st}</text>`).join('');
 return svg(`<rect width="1024" height="640" fill="#3b2f2a"/><rect x="40" y="40" width="944" height="560" rx="26" fill="#fff4dc" stroke="#c9a46a" stroke-width="8"/><text x="512" y="130" text-anchor="middle" font-family="Poppins,system-ui" font-weight="800" font-size="40" fill="#7a4520">${R3.title}</text>${rows}`,'0 0 1024 640'); }
const _cast3=cast; cast=async function(){ const i=M&&M.i, clue=M&&M.m&&M.m.clue&&!M.battle; await _cast3(); if(clue&&M&&M.i===i&&M.tries>=1&&M.items[M.i]){ $('#playTarget').textContent=M.items[M.i]; } };

// ---------- battles: phrase spells, phrase shields, and timed duels
const _spell3=spellCards; spellCards=function(weak){ if(yearOf()<3) return _spell3(weak); const want=[weak,...shuffle(Object.keys(Y3.SPELLS).filter(k=>k!==weak))], out=[];
 for(const el of want){ const w=shuffle(Y3.SPELLS[el].filter(x=>!S.seen.includes(x)))[0]; if(w) out.push(w); if(out.length>=3) break; } return shuffle(out); };
const _pw3=pickWords; pickWords=function(themes,n){ if(yearOf()>=3&&themes&&themes[0]===DEFEND_W){ const un=shuffle(Y3.SHIELD.filter(w=>!S.seen.includes(w))); if(un.length) return un.slice(0,n); } return _pw3(themes,n); };
let TM=null;
function timerEl(){ let e=$('#y3Timer'); if(!e){ e=document.createElement('div'); e.id='y3Timer'; e.innerHTML='<i></i><span></span>'; $('#hp').after(e); } return e; }
function timerStop(){ if(TM){ clearInterval(TM.iv); TM=null; } const e=$('#y3Timer'); if(e) e.style.display='none'; }
function timerStart(){ timerStop(); if(!M||!M.battle||!M.m.timed||M.won) return; const total=M.m.timed*1000, e=timerEl(); e.style.display='block'; const me=M; let left=total, last=performance.now();
 TM={iv:setInterval(()=>{ const now=performance.now(), dt=now-last; last=now; if(M!==me||current!=='play'||M.won){ return timerStop(); }
  if(pad.locked||pad.demo||document.hidden) return; left-=dt; const f=Math.max(0,left/total); e.firstChild.style.width=(f*100)+'%'; e.firstChild.style.background=f>.5?'#40c057':f>.25?'#fab005':'#fa5252'; e.lastChild.textContent='⏳ '+Math.ceil(left/1000)+'s';
  if(left<=0){ timerStop(); timeUp(); } },100)}; }
async function timeUp(){ if(!M||!M.battle) return; pad.locked=true; pad.clear(); const who=M.mon.name.split(' (')[0]; const m=`⏳ Time's up! ${who} gets a free shot!`; showFb(m); Voice.say("Time's up!"); await sleep(900); pad.locked=false; return shieldFail(); }
const _deal3=dealCards; dealCards=function(first){ _deal3(first); if(M&&M.battle&&M.m.timed&&!M.won) setTimeout(timerStart,first?1800:400); };
const _win3=battleWin; battleWin=async function(){ if(M) M.won=true; timerStop(); return _win3(); };
const _show3=show; show=function(id){ if(id!=='play') timerStop(); return _show3(id); };

// ---------- epic battles: friends and teachers join in
async function battleHook(f){ if(!f.helpers) return; M.hd=M.hd||{}; const i=f.helpers.findIndex((h,k)=>!M.hd[k]&&f.hp<=f.max*h.at); if(i<0) return; const h=f.helpers[i]; M.hd[i]=1; timerStop();
 await new Promise(res=>playStory(h.lines(),res)); show('play'); sideMode(true); const art=$('#playArt'); art.innerHTML=foeSVG(f); drawHP(); await sleep(300);
 const t=FX.center(art); await FX.projectile(h.el||'light',h.emoji||'✨',40,innerHeight-120,t[0],t[1],650); FX.signature(h.el||'light',t[0],t[1],true); Snd.sfx('boom'); FX.flash('#fff3bf',.5,400); FX.shake(art,26,600);
 const fl=Math.max(1,(f.minCasts||5)-M.casts), d=Math.min(h.dmg||2,Math.max(0,f.hp-fl)); f.hp-=d; drawHP(); if(d) FX.text(t[0],t[1]-30,'-'+d,'#ffd43b',72);
 if(h.breakArmor) f.armor=false; M.hearts=3; $('#hpMe').textContent=heartsTxt(); FX.hearts(...FX.center($('#padHost'))); showFb(h.msg); Voice.say(h.msg); await sleep(1600); }
const _sb3=startBattle; startBattle=function(m,n){ _sb3(m,n); const f=M.mon; if(f.boss){ $('#playTtl').textContent=`👑 BOSS · ${f.name}`; if(f.armor) $('#playPrompt').textContent=`🛡️ Silver armor! Hold on until help comes… · Weak to ${ELEM[f.weak].e} ${ELEM[f.weak].n}`; } };

// ---------- spot the forgery: see a misspelled word, type it correctly
const RD_PROMPT=$('.rdPrompt').textContent;
const _sr3=startRead; startRead=function(m,n){ if(!m.fix){ $('.rdPrompt').textContent=RD_PROMPT; return _sr3(m,n); } const seen=S.readSeen||[]; let items=shuffle((Y3.FIX[m.id]||[]).filter(p=>!seen.includes(p[1]))).slice(0,5); if(!items.length) items=shuffle(Y3.FIX[m.id]||[]).slice(0,5);
 R={m,n,items,i:0,tries:0,pts:0,good:0,fix:true}; $('.rdPrompt').textContent='🔍 The pen spelled this wrong. Type it the RIGHT way.'; $('#rdTtl').textContent=`${m.icon} ${m.title} — ${m.goal}`; show('read'); $('#rdFb').textContent=m.intro; Voice.say(m.intro); readItem(); };
const _ri3=readItem; readItem=function(){ if(!R||!R.fix) return _ri3(); const [bad]=R.items[R.i]; R.tries=0;
 $('#rdWord').innerHTML=`<div class="y3forged">${cursiveSVG(bad,{unit:70,color:'#5f3dc4',lines:true,fullLines:true,sw:5})}<b>FORGED</b></div>`; const inp=$('#rdIn'); inp.value=''; inp.disabled=false; setTimeout(()=>{ try{inp.focus({preventScroll:true});}catch(e){} },300);
 $('#rdDots').innerHTML=R.items.map((_,k)=>`<i class="${k<R.i?'ok':k===R.i?'cur':''}"></i>`).join(''); $('#rdHint').textContent='Type the word the RIGHT way'; };
const _rc3=readCheck; readCheck=function(){ if(!R||!R.fix) return _rc3(); if($('#rdIn').disabled) return; const [bad,w]=R.items[R.i], v=normW($('#rdIn').value); if(!v){ $('#rdFb').textContent='Type the correct spelling ⌨️'; return; }
 R.tries++; const done=()=>{ S.readSeen=S.readSeen||[]; S.readSeen.push(w); save(); $('#rdIn').disabled=true; };
 if(v===normW(w)){ const p=R.tries===1?2:1; R.pts+=p; R.good++; done(); Snd.sfx('gold'); const c=FX.center($('#rdWord')); FX.burst(c[0],c[1],{n:50,speed:8}); FX.text(c[0],c[1]-30,R.tries===1?'FORGERY CAUGHT!':'FIXED!','#ffd43b',44);
  $('#rdFb').textContent=(R.tries===1?'Caught it! ':'Fixed! ')+`“${bad}” should be “${w}” ✨ +${p}`; Voice.say(w); setTimeout(readNext,1700); return; }
 Snd.sfx('poof');
 if(v===normW(bad)){ $('#rdFb').textContent='That\'s how the pen spelled it. Fix the mistake!'; Voice.say('That is the forged spelling. Fix the mistake!'); R.tries--; $('#rdIn').select(); return; }
 if(R.tries===1){ $('#rdFb').textContent='Not quite. Try again!'; $('#rdHint').textContent=`Hint: “${w[0]}…” with ${w.length} letters.`; Voice.say('Not quite. Try again!'); $('#rdIn').select(); return; }
 $('#rdFb').textContent=`The right spelling is “${w}”. The pen copies handwriting, but it can't spell!`; Voice.say(`It should be ${w}.`); done(); setTimeout(readNext,2800); };
$('#rdGo').onclick=()=>readCheck();

// ---------- test hook
const _solve3=window.__test.solve; window.__test.solve=()=>{ if(current==='read'&&R&&R.fix){ $('#rdIn').value=R.items[R.i][1]; return readCheck(); } return _solve3(); };
renderYears();
