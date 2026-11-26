function nextItem(){ M.i++; hideFb(); if(M.i<M.items.length) loadItem(); else finishMission(); }
function finishMission(){ const m=M.m,n=M.n,pts=M.pts; const st=Math.max(1,Math.round(M.quality.reduce((a,b)=>a+b,0)/M.quality.length));
 const fin=()=>{ markDone(n,m,pts); resultScreen(m.done,'⭐'.repeat(st)+'☆'.repeat(3-st),`+${pts} magic stars`,m.tip,n); };
 if(m.post) STORIES[m.post](fin); else fin();
}
function resultScreen(big,stars,txt,tip,n=S.view){
 show('result'); $('#resBig').textContent=big; $('#resStars').innerHTML=[...stars].map((ch,i)=>`<span style="animation-delay:${.3+i*.25}s">${ch}</span>`).join(''); FX.confetti(); Snd.sfx('fanfare'); setTimeout(()=>{ const c=FX.center($('#resStars')); FX.burst(c[0],c[1],{n:70,speed:10,size:7}); },500); $('#resTxt').textContent=txt; $('#resTip').textContent=tip?'💡 '+tip:''; $('#resTip').style.display=tip?'':'none';
 $('#resArt').innerHTML=`<div style="width:min(320px,60vw)">${svg(BGS.hall()+girl('nora',512,280,1.2,{arm:'wand',glow:true}),'0 0 1024 640')}</div>`;
 Voice.say(big);
 const nm=nextMain(n), nb=$('#resNext');
 if(nm){ nb.textContent=`Next: ${nm.name} ▶`; nb.onclick=()=>{ Snd.sfx('tap'); startMission(nm,n); }; }
 else if(!S.chDone[n]){ nb.textContent=n<CHAPTERS.length?'Chapter end ▶':'The finale ▶'; nb.onclick=()=>chapterEnd(n); }
 else { nb.textContent='Map ▶'; nb.onclick=goMap; }
}
$('#resMap').onclick=()=>goMap();
$('#playBack').onclick=()=>{ Voice.stop(); goMap(); };
$('#brkDone').onclick=()=>{ Voice.stop(); show('title'); refreshStars(); };

// ============ Spell battles ============
function foeBody(f,state,x,y,k){ const hurt=state==='hurt'; const eyes=(ex,ey,r)=>`<ellipse cx="${-ex}" cy="${ey}" rx="${hurt?r+4:r}" ry="${hurt?6:r*1.3}" fill="${f.eye}" filter="url(#glow)"/><ellipse cx="${ex}" cy="${ey}" rx="${hurt?r+4:r}" ry="${hurt?6:r*1.3}" fill="${f.eye}" filter="url(#glow)"/>`;
 let b='';
 if(f.kind==='blob') b=`<ellipse cx="0" cy="40" rx="190" ry="170" fill="${f.body}" opacity=".35" filter="url(#wash)"/><path d="M-150 120C-170 -40 -90 -170 0 -170S170 -40 150 120C120 90 100 140 70 110C40 140 20 100 0 130C-20 100 -40 140 -70 110C-100 140 -120 90 -150 120Z" fill="${f.body}"/>${eyes(50,-30,26)}<path d="M-40 50q40 ${hurt?-20:25} 80 0" stroke="${f.eye}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
 if(f.kind==='imps') b=[[-120,40,.8],[0,-20,1],[120,40,.8]].map(([dx,dy,s])=>`<g transform="translate(${dx},${dy}) scale(${s})"><path d="M-60 -60L-40 -110L-20 -70ZM60 -60L40 -110L20 -70Z" fill="${f.body}"/><ellipse cx="0" cy="0" rx="75" ry="80" fill="${f.body}"/><path d="M-70 60q20 40 0 60M70 60q-20 40 0 60M0 70q10 40-10 60" stroke="${f.body}" stroke-width="16" fill="none" stroke-linecap="round"/>${eyes(26,-10,14)}<path d="M-22 30q22 ${hurt?-10:16} 44 0" stroke="${f.eye}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`).join('');
 if(f.kind==='crystal') b=`<ellipse cx="0" cy="20" rx="200" ry="190" fill="#d0ebff" opacity=".5" filter="url(#wash)"/><path d="M0 -190L60 -60L190 -40L80 40L120 170L0 100L-120 170L-80 40L-190 -40L-60 -60Z" fill="${f.body}" stroke="#e7f5ff" stroke-width="6"/><path d="M0 -190L0 100M-190 -40L80 40M190 -40L-80 40" stroke="#e7f5ff" stroke-width="3" opacity=".7"/>${eyes(40,-10,18)}<path d="M-30 50q30 ${hurt?-14:18} 60 0" stroke="${f.eye}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
 if(f.kind==='golem') b=`<ellipse cx="0" cy="40" rx="220" ry="190" fill="#868e96" opacity=".35" filter="url(#wash)"/><rect x="-130" y="-90" width="260" height="230" rx="30" fill="${f.body}"/><rect x="-90" y="-180" width="180" height="110" rx="24" fill="${f.body}"/><rect x="-210" y="-60" width="70" height="170" rx="26" fill="${f.body}"/><rect x="140" y="-60" width="70" height="170" rx="26" fill="${f.body}"/><path d="M-40 -60L-10 0L-40 40L0 100M60 -20L30 30L60 70" stroke="${f.eye}" stroke-width="6" fill="none" filter="url(#glow)"/>${eyes(36,-130,14)}`;
 if(f.kind==='girl'){ const aura=f.who==='wren'?`<ellipse cx="0" cy="40" rx="230" ry="260" fill="#2b2540" opacity=".55" filter="url(#wash)"/>`:''; b=`${aura}<g transform="translate(0,-110)">${girl(f.who,0,0,1.25,{arm:'wand',expr:hurt?'sad':(f.who==='wren'?'sad':'smirk'),flip:true})}</g><ellipse cx="0" cy="10" rx="215" ry="250" fill="${f.shield}" opacity="${hurt?.45:.22}" stroke="${f.shield}" stroke-width="6"/>`; }
 return `<g transform="translate(${x},${y}) scale(${k})" filter="url(#soft)">${b}</g>`; }
function foeSVG(f,state=''){ return svg(BGS[f.bg]()+foeBody(f,state,512,330,1),'272 130 480 400'); }
function drawHP(){ const f=M.mon, a=f.kind==='girl'?'🛡️':'🖤'; $('#hp').textContent=a.repeat(f.hp)+'▫️'.repeat(f.max-f.hp); }
function sideMode(battle){ $('#hp').style.display=battle?'block':'none'; $('#cards').style.display=battle?'flex':'none'; $('#playTarget').style.display=battle?'none':''; }
function startBattle(m,n){ const f=Object.assign({},FOES[m.foe]); f.max=f.hp;
 M={m,n,battle:true,mon:f,pts:0,quality:[],penBonus:false,word:null,tries:0,casts:0,phase:1};
 $('#playTtl').textContent=`⚔️ ${m.title} — ${f.name}`; $('#playPrompt').textContent=`Weak to ${ELEM[f.weak].e} ${ELEM[f.weak].n}`; $('#penBadge').textContent='✨ Perfect writing = CRITICAL hit!'; $('#playDots').innerHTML='';
 show('play'); sideMode(true); $('#playArt').innerHTML=foeSVG(f); drawHP(); dealCards(true);
}
function dealCards(first){ const f=M.mon; M.word=null; pad.set(' '); pad.locked=true; M.tries=0; pad.pen=false;
 const box=$('#cards'); box.innerHTML='';
 if(M.phase===2){ const w=FINAL.find(x=>!S.seen.includes(x)); if(!w) return battleWin(); const b=document.createElement('button'); b.innerHTML=`<span>💌</span><span class="cur">${w}</span><span class="el">Kindness</span>`; b.classList.add('weak'); b.onclick=()=>pickCard(w,b); box.appendChild(b); showFb('Write the kind words for Wren 💌'); return; }
 const words=spellCards(f.weak);
 if(!words.length) return battleWin();
 words.forEach(w=>{ const el=ELEM[ELEM_OF[w]]; const b=document.createElement('button'); b.innerHTML=`<span>${el.e}</span><span class="cur">${w}</span><span class="el">${el.n}</span>`; if(ELEM_OF[w]===f.weak&&(S.level||1)===1) b.classList.add('weak'); b.onclick=()=>pickCard(w,b); box.appendChild(b); });
 const t=first?`Pick a spell card, then write it to cast! ${f.name} is weak to ${ELEM[f.weak].n.toLowerCase()}.`:'Pick your next spell!';
 showFb(t); Voice.say(t);
}
function pickCard(w,b){ Snd.sfx('tap'); [...$('#cards').children].forEach(x=>x.style.opacity=x===b?1:.45); M.word=w; M.tries=0; pad.set(w); hideFb(); Voice.say(`Write ${w}.`); }
// The epic part: the handwriting itself becomes the spell.
async function spellSequence(elk,emoji,crit){ const host=$('#padHost'), c=FX.center(host), r=host.getBoundingClientRect(), pts=padScreenPts(), E=FX.EL[elk], col={fire:'#ff6b6b',ice:'#4dabf7',water:'#228be6',wind:'#20c997',light:'#f59f00',earth:'#37b24d',bolt:'#f59f00'}[elk]||E.c[0];
 FX.vignette(3000,.6); FX.magicCircle(c[0],c[1],Math.min(r.width,r.height)*.44,col,2300); Snd.sfx('charge');
 FX.traceRun(pts,col,560); await sleep(620);            // 1. her letters light up, stroke by stroke
 FX.converge(pts,c[0],c[1],E.c,560); FX.orb(c[0],c[1],col,900); await sleep(650); // 2. the ink lifts off and swirls into an orb
 FX.burst(c[0],c[1],{n:50,colors:E.c,shape:E.shape,speed:9}); FX.ring(c[0],c[1],col,220); FX.shake(host,8,300); Snd.sfx('whoosh'); Snd.sfx(elk);
 const t=FX.center($('#playArt')); await FX.projectile(elk,emoji,c[0],c[1],t[0],t[1],crit?560:680); // 3. launch!
 return t; }
async function battleHit(stars){ const f=M.mon; const kind=M.phase===2; const elk=kind?'light':ELEM_OF[M.word], el=kind?{e:'💌',n:'Kindness'}:ELEM[elk];
 const weak=kind||elk===f.weak, crit=stars===3; M.casts++;
 const t=await spellSequence(elk,el.e,crit);
 let dmg=(weak?2:1)+(crit?1:0); if(kind) dmg=f.hp; f.hp=Math.max(0,f.hp-dmg);
 FX.signature(elk,t[0],t[1],weak||crit); Snd.sfx('boom'); if(weak) setTimeout(()=>Snd.sfx('light'),120);
 const art=$('#playArt'); art.innerHTML=foeSVG(f,'hurt'); art.classList.remove('hit'); void art.offsetWidth; art.classList.add('hit'); if(elk==='ice'){ art.classList.add('frozen'); setTimeout(()=>art.classList.remove('frozen'),1100); }
 FX.shake(art,weak?22:12,500); if(weak||crit) FX.shake($('#play'),10,420); drawHP();
 if(!kind){ FX.text(t[0],t[1]-30,'-'+dmg,weak?'#ffd43b':'#fff',weak?72:56); if(crit) setTimeout(()=>FX.text(t[0],t[1]-100,'CRITICAL!','#ff922b',44),120); if(weak) setTimeout(()=>FX.text(t[0],t[1]+50,'SUPER EFFECTIVE!','#ff6fa8',34),240); }
 const msg=kind?'Your kind words reach her…':weak?`Super effective! ${el.e} ${el.n} hits for ${dmg}!`:`${el.e} Hit for ${dmg}! Try ${ELEM[f.weak].n.toLowerCase()} for more!`; showFb(msg); Voice.say(kind?'Your kind words reach her.':crit?'Critical hit!':weak?'Super effective!':'Hit!');
 await sleep(1400); art.classList.remove('hit'); art.innerHTML=foeSVG(f);
 if(f.hp>0&&M.phase===1&&S.done['c2:flight']&&M.casts%2===0){ await emberBreath(f); }
 if(f.hp<=0){ if(f.final&&M.phase===1){ return wrenPhase2(); } if(f.final&&M.phase===2&&FINAL.some(x=>!S.seen.includes(x))){ f.hp=1; drawHP(); return dealCards(false); } return battleWin(); }
 dealCards(false);
}
async function emberBreath(f){ const t=FX.center($('#playArt')), sx=40, sy=innerHeight-120;
 const d=document.createElement('div'); d.style.cssText=`position:fixed;left:${sx-70}px;top:${sy-150}px;width:240px;height:210px;z-index:34;pointer-events:none`; d.innerHTML=svg(dragon(0,0,1,{fly:true,breath:true}),'-220 -150 480 360'); document.body.appendChild(d);
 d.animate&&d.animate([{transform:'translateY(160px) scale(.6)'},{transform:'translateY(0) scale(1)'}],{duration:350,easing:'ease-out'}); Snd.sfx('fire'); await sleep(380);
 FX.text(sx+80,sy-90,'EMBER\'S BREATH!','#ff922b',34); await FX.projectile('fire','🔥',sx+60,sy-40,t[0],t[1],550); FX.signature('fire',t[0],t[1],false); Snd.sfx('boom');
 f.hp=Math.max(0,f.hp-1); drawHP(); FX.text(t[0],t[1]-30,'-1','#ff922b',56); Voice.say('Rrr-eee!','ember');
 d.animate&&d.animate([{opacity:1},{opacity:0,transform:'translateY(120px)'}],{duration:400,delay:300}); await sleep(800); d.remove(); }
async function wrenPhase2(){ const f=M.mon; f.hp=1; f.max=1; drawHP(); M.phase=2;
 await new Promise(res=>STORIES.wrenMid(res)); show('play'); sideMode(true); $('#playArt').innerHTML=foeSVG(f); dealCards(false); }
async function battleMiss(){ const art=$('#playArt'); { const t=FX.center(art), c=FX.center($('#padHost')); await FX.projectile('wind','💨',t[0],t[1],c[0],c[1],600); FX.burst(c[0],c[1],{n:40,colors:['#4dabf7','#a5d8ff','#ffffff'],shape:'circle',speed:7}); FX.ring(c[0],c[1],'#74c0fc',200); FX.text(c[0],c[1],'🛡️ BLOCKED!','#a5d8ff',44); Snd.sfx('boom'); FX.shake($('#padHost'),10); }
 showFb('A counter-attack… but your friends\' shield blocks it! 🛡️ Try another spell.'); Voice.say('Your friends\' shield blocks it! Try another spell.'); await sleep(1500); dealCards(false); }
async function battleWin(){ const f=M.mon; const art=$('#playArt'), t=FX.center(art); art.classList.add('gone'); Snd.sfx('dissolve');
 for(let i=0;i<4;i++){ setTimeout(()=>FX.burst(t[0],t[1],{n:40,colors:[f.body||f.shield,'#5f3dc4','#fff3bf','#ffd43b'],shape:i%2?'star':'circle',speed:5+i*2,grav:-.05,life:1400,size:6}),i*160); }
 setTimeout(()=>{ FX.flash('#fff3bf',.6,500); FX.ring(t[0],t[1],'#ffd43b',320); FX.text(t[0],t[1],f.duel?'YOU WIN!':'VICTORY!','#ffd43b',70); Snd.sfx('fanfare'); },700);
 await sleep(1800); art.classList.remove('gone');
 const m=M.m,n=M.n,pts=M.pts,q=M.quality;
 STORIES[m.post](()=>{ markDone(n,m,pts); const st=q.length?Math.max(1,Math.round(q.reduce((a,b)=>a+b,0)/q.length)):1;
   resultScreen(STORY_RESULT[m.post][0],'⭐'.repeat(st)+'☆'.repeat(3-st),`+${pts} magic stars`,m.tip,n); });
}

// ============ Wand Trial (placement) ============
const TRIAL=[{t:'a',lv:1},{t:'B',lv:2},{t:'me',lv:3}];
let T=null;
function startTrial(){ T={i:0,sc:[]}; M=null; show('play'); $('#playTtl').textContent='🪄 The Wand Trial'; runTrial(); }
function runTrial(){ sideMode(false); const it=TRIAL[T.i]; pad.pen=false; pad.set(it.t); $('#playTarget').textContent=it.t; $('#playPrompt').textContent=['Lowercase rune','Capital rune','Joined word'][T.i]; $('#penBadge').textContent='Do your best — there is no wrong answer!';
 $('#playArt').innerHTML=svg(BGS.gate()+girl('prof',512,330,1.2,{arm:'wave'}),'252 80 520 520');
 $('#playDots').innerHTML=TRIAL.map((_,k)=>`<i class="${k<T.i?'ok':k===T.i?'cur':''}"></i>`).join('');
 const say=T.i===0?'Trace the lowercase a. Start at the green dot and follow the arrows.':T.i===1?'Now trace a capital B.':'Last one: write the word me, joined together.';
 showFb(say); Voice.say(say,'prof');
 $('#padCast').onclick=trialCast; }
