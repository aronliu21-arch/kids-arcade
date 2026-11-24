/* ---------- audio ---------- */
let ac=null;function audio(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();return ac;}
function tone(f,d,type,vol,dl,dest){if(!SOUND)return;const c=audio();if(!c)return;try{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(dl||0);o.type=type||'sine';o.frequency.setValueAtTime(f,t);o.connect(g);g.connect(dest||c.destination);g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d+.05);}catch(e){}}
const sfx={good(){[523,659,784,1047].forEach((f,i)=>tone(f,.18,'triangle',.16,i*.07));},bad(){tone(200,.25,'sawtooth',.08);},pop(){tone(880,.08,'triangle',.14);},
 coin(){tone(1320,.08,'square',.06);tone(1760,.12,'square',.05,.06);},win(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,.3,'triangle',.15,i*.1));},
 hit(){tone(140,.2,'square',.12);tone(90,.3,'sawtooth',.08,.05);},ko(){[400,300,200,120].forEach((f,i)=>tone(f,.2,'square',.09,i*.1));},
 flip(){tone(660,.06,'triangle',.1);tone(990,.08,'triangle',.08,.05);},shimmer(){[1047,1319,1568,2093,2637].forEach((f,i)=>tone(f,.25,'sine',.09,i*.06));},
 energy(){tone(440,.1,'square',.06);tone(880,.15,'square',.06,.08);},magic(){[392,523,659,784,1047,784,1047].forEach((f,i)=>tone(f,.3,'sine',.1,i*.09));}};
function say(t){return;}
function shout(t){if(!SOUND||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.95;u.pitch=1.05;speechSynthesis.speak(u);}catch(e){}}
/* music: a theme per place, menu-type screens only (fades out on jobs, battles and questions) */
let MUS=null;
const THEMES={
 anthem:{bpm:132,mel:[[392,659,784,659],[523,659,784,1047],[440,523,659,880],[392,494,587,784]],bass:[131,175,110,98],w:'square',drum:[0,2]},
 shop:{bpm:116,mel:[[523,659,523,784],[587,698,587,880],[523,659,784,1047],[494,587,784,587]],bass:[131,147,131,98],w:'triangle',drum:[1,3]},
 calm:{bpm:84,mel:[[523,0,659,784],[440,0,523,659],[349,440,523,0],[392,494,587,0]],bass:[131,110,87,98],w:'sine',drum:[]},
 stadium:{bpm:144,mel:[[330,392,494,659],[349,440,523,698],[392,494,587,784],[440,554,659,880]],bass:[82,87,98,110],w:'sawtooth',drum:[0,1,2,3]},
 night:{bpm:96,mel:[[659,0,587,523],[494,0,523,587],[440,0,494,523],[392,0,0,0]],bass:[110,98,87,82],w:'triangle',drum:[0]}};
function musicStart(theme){theme=theme||'anthem';if(!SOUND)return;if(MUS&&MUS.th===theme)return;if(MUS)musicStop();const c=audio();if(!c)return;const T0=THEMES[theme];const g=c.createGain();g.gain.value=0;g.connect(c.destination);g.gain.linearRampToValueAtTime(theme==='stadium'?.4:.5,c.currentTime+.6);
 const beat=60/T0.bpm;let bar=0;
 const play=()=>{const m=T0.mel[bar%4];m.forEach((f,i)=>{if(!f)return;tone(f,beat*.9,T0.w,T0.w==='sawtooth'?.025:.05,i*beat,g);if(T0.w!=='sine')tone(f*2,beat*.4,'triangle',.025,i*beat+beat/2,g);});tone(T0.bass[bar%4],beat*3.8,'triangle',.12,0,g);T0.drum.forEach(i=>tone(70,.12,'sine',.18,i*beat,g));bar++;};
 play();MUS={g,th:theme,id:setInterval(play,beat*4000)};}
function musicStop(){if(!MUS)return;const m=MUS;MUS=null;clearInterval(m.id);try{const c=audio();m.g.gain.cancelScheduledValues(c.currentTime);m.g.gain.setValueAtTime(m.g.gain.value,c.currentTime);m.g.gain.linearRampToValueAtTime(0,c.currentTime+.8);setTimeout(()=>m.g.disconnect(),1500);}catch(e){}}
let tt=0;function toast(h,ms){const t=$('toast');t.innerHTML=h;t.classList.remove('hide');clearTimeout(tt);tt=setTimeout(()=>t.classList.add('hide'),ms||1600);}
function modal(html,btns){const m=document.createElement('div');m.className='modal';m.innerHTML='<div>'+html+'<div class="row" style="margin-top:10px"></div></div>';
 const row=m.querySelector('.row:last-child');(btns||[]).forEach(([l,f,cls])=>{const b=document.createElement('button');b.className='btn '+(cls||'');b.innerHTML=l;b.onclick=()=>{m.remove();f&&f();};row.appendChild(b);});document.body.appendChild(m);return m;}
/* scratch pad: a place to write the math with a finger */
let PAD=null;
function padInit(){if(PAD)return PAD;const d=document.createElement('div');d.className='pad';d.innerHTML=`<div class="padq" id="padq"></div><canvas id="padc"></canvas><div class="row"><div class="pens">${['#1b1f3b','#e03131','#1c7ed6'].map((c,i)=>`<button data-c="${c}" style="background:${c}" class="${i?'':'on'}" aria-label="pen color"></button>`).join('')}</div><button class="btn ghost small" id="padx">🧽 Clear</button><button class="btn gold small" id="padok">✓ Done</button></div>`;
 document.body.appendChild(d);const cv=d.querySelector('canvas');let ctx,drawing=false,last=null,col='#1b1f3b';
 const fit=()=>{const r=cv.getBoundingClientRect(),dp=devicePixelRatio||1;const img=ctx?ctx.getImageData(0,0,cv.width,cv.height):null;cv.width=r.width*dp;cv.height=r.height*dp;ctx=cv.getContext('2d');ctx.scale(dp,dp);ctx.lineCap='round';ctx.lineJoin='round';if(img)ctx.putImageData(img,0,0);};
 cv.addEventListener('pointerdown',e=>{if(!ctx)fit();drawing=true;cv.setPointerCapture(e.pointerId);const r=cv.getBoundingClientRect();last=[e.clientX-r.left,e.clientY-r.top];ctx.fillStyle=col;ctx.beginPath();ctx.arc(last[0],last[1],2,0,7);ctx.fill();});
 cv.addEventListener('pointermove',e=>{if(!drawing)return;const r=cv.getBoundingClientRect(),p=[e.clientX-r.left,e.clientY-r.top];ctx.strokeStyle=col;ctx.lineWidth=e.pointerType==='pen'?3:4;ctx.beginPath();ctx.moveTo(last[0],last[1]);ctx.lineTo(p[0],p[1]);ctx.stroke();last=p;});
 ['pointerup','pointercancel'].forEach(k=>cv.addEventListener(k,()=>{drawing=false;}));
 d.querySelectorAll('.pens button').forEach(b=>b.onclick=()=>{col=b.dataset.c;d.querySelectorAll('.pens button').forEach(x=>x.classList.toggle('on',x===b));});
 d.querySelector('#padx').onclick=()=>padClear();d.querySelector('#padok').onclick=()=>padClose();
 PAD={d,cv,fit,clear:()=>{if(ctx)ctx.clearRect(0,0,cv.width,cv.height);}};return PAD;}
function padPrompt(){const t=el=>el?el.innerText.replace(/\s+/g,' ').trim():'';
 if(SCREEN==='cash')return t($('bub'))+' · '+t($('paid'));if(SCREEN==='battle')return t($('mid')&&$('mid').querySelector('div'));
 if(SCREEN==='master'){const ps=main.querySelectorAll('.panel p');return t(ps[1]);}if(SCREEN==='sort')return t(main.querySelector('.panel p'));return '';}
function padOpen(){const P=padInit();$('padq').textContent=padPrompt()||'Work out the math here!';P.d.classList.add('on');setTimeout(()=>P.fit(),320);}
function padClose(){if(PAD)PAD.d.classList.remove('on');}
function padClear(){if(PAD){PAD.clear();if(PAD.d.classList.contains('on'))setTimeout(()=>{$('padq').textContent=padPrompt()||'Work out the math here!';},60);}}
$('padb').onclick=()=>{audio();if(DK)return deskClose();if(PAD&&PAD.d.classList.contains('on'))return padClose();deskOpen();};
$('homeb').onclick=()=>{audio();const risky={insp:'Leave the inspector job? You keep what you earned so far.',battle:'Leave this battle? It will stop and won’t count.',cash:'Leave the shop counter? You keep what you earned so far.',sort:'Leave the sorting job? You keep what you earned so far.',pick:null,master:'Leave the Card Master? He will disappear with his gift!',pack:null,tour:'Leave the tournament? Your entry money won’t come back.'};
 let m=risky[SCREEN];if(SCREEN==='battle'&&B&&B.kind==='tour')m='Leave the tournament? Your entry money won’t come back.';
 const goHome=()=>{document.querySelectorAll('.vs,.banner,.spot,.reveal,.modal').forEach(e=>e.remove());REV=null;if('speechSynthesis' in window)speechSynthesis.cancel();TR=SCREEN==='battle'&&B&&B.kind==='tour'?null:TR;hub();};
 if(m)modal(`<div class="big">🏠</div><h2>Go home?</h2><p>${m}</p>`,[['Yes, go home',goHome],['Keep playing',null,'ghost']]);else goHome();};
$('snd').textContent=SOUND?'🔊':'🔇';$('snd').onclick=()=>{SOUND=!SOUND;$('snd').textContent=SOUND?'🔊':'🔇';try{localStorage.setItem('cardquest.sound',SOUND?'1':'0');}catch(e){}if(!SOUND){musicStop();if('speechSynthesis' in window)speechSynthesis.cancel();}else if(SCREEN==='hub'||SCREEN==='title')musicStart();};
function confetti(){const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:60';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);
 const x=c.getContext('2d'),P=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight/3,vx:rnd(-7,7),vy:rnd(-9,1),c:pick(['#ffd43b','#ff6b6b','#74c0fc','#b197fc','#69db7c'])}));let n=0;
 (function f(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.25;x.fillStyle=p.c;x.fillRect(p.x,p.y,7,7);});if(++n<120)requestAnimationFrame(f);else c.remove();})();}

