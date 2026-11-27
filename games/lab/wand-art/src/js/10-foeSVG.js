function foeSVG(f,state=''){ return svg(BG(f.bg)+foeBody(f,state,512,330,1),'272 130 480 400'); }
function drawHP(){ const f=M.mon, a=f.kind==='girl'?'🛡️':'🖤'; $('#hp').textContent=a.repeat(f.hp)+'▫️'.repeat(f.max-f.hp); }
function sideMode(battle){ $('#hp').style.display=battle?'block':'none'; $('#cards').style.display=battle?'flex':'none'; $('#playTarget').style.display=battle?'none':''; }
function startBattle(m,n){ const f=Object.assign({},FOES[m.foe]); f.max=f.hp;
 M={m,n,battle:true,mon:f,pts:0,quality:[],penBonus:false,word:null,tries:0,casts:0,phase:1}; M.hearts=3; M.defend=false; { let h=$('#hpMe'); if(!h){ h=document.createElement('div'); h.id='hpMe'; h.className='hp'; $('#hp').after(h); } h.textContent=heartsTxt(); h.title='Nora'; h.style.display='block'; }
 $('#playTtl').textContent=`⚔️ ${m.title} — ${f.name}`; $('#playPrompt').textContent=`Weak to ${ELEM[f.weak].e} ${ELEM[f.weak].n}`; $('#penBadge').textContent='✨ Perfect writing = CRITICAL hit!'; $('#playDots').innerHTML='';
 show('play'); sideMode(true); $('#playArt').innerHTML=foeSVG(f); drawHP(); dealCards(true);
}
function dealCards(first){ const f=M.mon; M.word=null; pad.set(' '); pad.locked=true; M.tries=0; pad.pen=false;
 const box=$('#cards'); box.innerHTML='';
 if(M.defend&&M.phase===1){ const w=pickWords([DEFEND_W],1)[0]; const b=document.createElement('button'); b.innerHTML=`<span>🛡️</span><span class="cur">${w}</span><span class="el">Shield</span>`; b.classList.add('weak','shieldCard'); b.onclick=()=>pickCard(w,b); box.appendChild(b); const t=`${f.name} is getting ready to attack! Write a shield spell to block it!`; showFb('⚠️ '+t); Voice.say(t); $('#playArt').classList.add('charging'); return; }
 if(M.phase===2){ const w=FINAL.find(x=>!S.seen.includes(x)); if(!w) return battleWin(); const b=document.createElement('button'); b.innerHTML=`<span>💌</span><span class="cur">${w}</span><span class="el">Kindness</span>`; b.classList.add('weak'); b.onclick=()=>pickCard(w,b); box.appendChild(b); showFb('Write the kind words for Wren 💌'); return; }
 const words=spellCards(f.weak);
 if(!words.length) return battleWin();
 words.forEach(w=>{ const el=ELEM[ELEM_OF[w]]; const b=document.createElement('button'); b.innerHTML=`<span>${el.e}</span><span class="cur">${w}</span><span class="el">${el.n}</span>`; if(ELEM_OF[w]===f.weak&&(S.level||1)===1) b.classList.add('weak'); b.onclick=()=>pickCard(w,b); box.appendChild(b); });
 const t=first?`Pick a spell card, then write it to cast! ${f.name} is weak to ${ELEM[f.weak].n.toLowerCase()}.`:'Pick your next spell!';
 showFb(t); Voice.say(t);
}
function pickCard(w,b){ Snd.sfx('tap'); [...$('#cards').children].forEach(x=>x.style.opacity=x===b?1:.45); M.word=w; M.tries=0; pad.guide=guideFor(w,(M.cast||0)); M.cast=(M.cast||0)+1; pad.set(w); hideFb(); Voice.say(`Write ${w}.`); }
// The epic part: the handwriting itself becomes the spell.
async function spellSequence(elk,emoji,crit){ const host=$('#padHost'), c=FX.center(host), r=host.getBoundingClientRect(), pts=padScreenPts(), E=FX.EL[elk], col={fire:'#ff6b6b',ice:'#4dabf7',water:'#228be6',wind:'#20c997',light:'#f59f00',earth:'#37b24d',bolt:'#f59f00'}[elk]||E.c[0];
 FX.vignette(3000,.6); FX.magicCircle(c[0],c[1],Math.min(r.width,r.height)*.44,col,2300); Snd.sfx('charge');
 FX.traceRun(pts,col,560); await sleep(620);            // 1. her letters light up, stroke by stroke
 FX.converge(pts,c[0],c[1],E.c,560); FX.orb(c[0],c[1],col,900); await sleep(650); // 2. the ink lifts off and swirls into an orb
 FX.burst(c[0],c[1],{n:50,colors:E.c,shape:E.shape,speed:9}); FX.ring(c[0],c[1],col,220); FX.shake(host,8,300); Snd.sfx('whoosh'); Snd.sfx(elk);
 const t=FX.center($('#playArt')); await FX.projectile(elk,emoji,c[0],c[1],t[0],t[1],crit?560:680); // 3. launch!
 return t; }
const DEFEND_W=['safe','wall','ward','guard','shield','block','shell','dome','armor','cover','defend','protect','barrier','bubble','fence','helmet','fort','strong','brave','stand','hold','calm','steady','sturdy'];
function heartsTxt(){ return 'Nora '+'💜'.repeat(M.hearts)+'🤍'.repeat(3-M.hearts); }
async function shieldBlock(stars){ const c=FX.center($('#padHost')), t=FX.center($('#playArt')); $('#playArt').classList.remove('charging'); M.defend=false; M.blocks=(M.blocks||0)+1;
 FX.ring(c[0],c[1],'#74c0fc',260); FX.burst(c[0],c[1],{n:50,colors:['#4dabf7','#a5d8ff','#ffffff'],shape:'circle',speed:8}); Snd.sfx('charge'); await sleep(500);
 await FX.projectile('wind','💥',t[0],t[1],c[0],c[1],600); FX.ring(c[0],c[1],'#a5d8ff',320); FX.flash('#d0ebff',.4,400); FX.text(c[0],c[1]-20,stars===3?'🛡️ PERFECT BLOCK!':'🛡️ BLOCKED!','#a5d8ff',52); Snd.sfx('boom');
 const m=stars===3?'Perfect shield! Not even a scratch. Now strike back!':'Blocked! Your shield held. Now strike back!'; showFb(m); Voice.say(m); await sleep(1400); dealCards(false); }
async function shieldFail(){ const c=FX.center($('#padHost')), t=FX.center($('#playArt')); $('#playArt').classList.remove('charging'); M.defend=false;
 await FX.projectile('wind','💥',t[0],t[1],c[0],c[1],600); FX.shake($('#play'),16,500); FX.flash('#ffc9c9',.45,400); Snd.sfx('boom'); M.hearts=Math.max(0,M.hearts-1); $('#hpMe').textContent=heartsTxt();
 if(M.hearts===0){ M.hearts=3; await sleep(500); $('#hpMe').textContent=heartsTxt(); const m='Ouch! But Ember shares her warmth with you. Hearts are full again!'; showFb(m); Voice.say(m); FX.hearts(c[0],c[1]); }
 else { const m='Ouch! The attack got through. Keep going, you can do it!'; showFb(m); Voice.say(m); }
 await sleep(1500); dealCards(false); }
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
 if(f.hp<=0&&M.phase===1&&M.casts<5){ f.hp=1; drawHP(); const m=`${f.name} is still standing! Keep casting!`; FX.text(t[0],t[1]-60,'STILL STANDING!','#ffd43b',40); showFb(m); Voice.say(m); await sleep(1100); }
 if(f.hp>0&&M.phase===1&&M.casts%2===0) M.defend=true;
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
function runTrial(){ sideMode(false); const it=TRIAL[T.i]; pad.pen=false; pad.guide='full'; pad.set(it.t); $('#playTarget').textContent=it.t; $('#playPrompt').textContent=['Lowercase rune','Capital rune','Joined word'][T.i]; $('#penBadge').textContent='Do your best — there is no wrong answer!';
 $('#playArt').innerHTML=svg(BG('gate')+girl('prof',512,330,1.2,{arm:'wave'}),'252 80 520 520');
 $('#playDots').innerHTML=TRIAL.map((_,k)=>`<i class="${k<T.i?'ok':k===T.i?'cur':''}"></i>`).join('');
 const say=T.i===0?'Trace the lowercase a. Start at the green dot and follow the arrows.':T.i===1?'Now trace a capital B.':'Last one: write the word me, joined together.';
 showFb(say); Voice.say(say,'prof');
 $('#padCast').onclick=trialCast; }
async function trialCast(){ if(!pad.hasInk()){ showFb('Write with your finger or Pencil first ✍️'); return; } const r=pad.score(); T.sc.push(r.score); S.seen.push(TRIAL[T.i].t); save(); Snd.sfx(r.stars?'chime':'spark'); showFb(r.stars?'The gate glows! ✨':'The gate hums… good try!'); await sleep(1100); T.i++;
 if(T.i<TRIAL.length) return runTrial();
 const lv= T.sc[2]>=.62&&T.sc[1]>=.55 ? 3 : T.sc[1]>=.55||T.sc[0]>=.8 ? 2 : 1;
 S.level=lv; S.trial=true; save(); $('#padCast').onclick=()=>cast();
 const lvTxt=['','Rune Reader (lowercase letters)','Capital Caster (capital letters)','Chain Weaver (joined words)'][lv];
 playStory([
  {scene:sceneSVG('gate',[['prof',760,250,1,{arm:'wave'}],['nora',300,260,1,{arm:'wand',expr:'wow'}]],`<ellipse cx="625" cy="330" rx="110" ry="130" fill="url(#warm)" opacity=".85"/>`),who:'prof',text:`Wonderful! The gate likes you. We'll start with single runes, and I'll teach you to join letters together, one small step at a time.`,sfx:'gold'},
  {scene:sceneSVG('runehall',[['nora',300,260,1,{expr:'wow'}],['prof',760,250,1,{}]]),text:'The gate swings open. Inside, the castle is humming with magic… but something feels wrong. Half the candles in Rune Hall are dark.'},
  {scene:sceneSVG('runehall',[['prof',760,250,1,{expr:'sad'}],['nora',300,260,1,{}]]),who:'prof',text:'Now… I\'m afraid I need your help already. The castle lamps are going out, one by one, and nobody knows why.'},
  {scene:sceneSVG('runehall',[['prof',760,250,1,{expr:'sad'}],['nora',300,260,1,{expr:'sad'}]]),who:'nora',text:'Going out? But lamps don\'t just… stop.'},
  {scene:sceneSVG('runehall',[['prof',760,250,1,{expr:'sad'}],['nora',300,260,1,{expr:'sad'}]]),who:'prof',text:'Ours never did. Not in three hundred years. Some say the words inside them are fading, like old ink left in the sun.'},
  {scene:sceneSVG('runehall',[['prof',760,250,1,{}],['nora',300,260,1,{arm:'hold'}]]),text:'Fading words. Nora touches Grandma\'s letter in her pocket. It still feels warm.'},
  {scene:sceneSVG('runehall',[['prof',760,250,1,{}],['nora',300,260,1,{}]]),who:'prof',text:'Each candle needs a rune written just right. A new student with a steady wand might be exactly what we need. Will you try?'},
  {scene:sceneSVG('runehall',[['prof',760,250,1,{expr:'happy'}],['nora',300,260,1,{arm:'wand'}]]),who:'nora',text:'I\'ll try my very best!'},
 ],()=>goMap()); }

