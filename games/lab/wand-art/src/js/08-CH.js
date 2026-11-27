const CH=n=>CHAPTERS[n-1];
const key=(n,id)=>`c${n}:${id}`;
const isDone=(n,id)=>!!S.done[key(n,id)];
const mainOf=n=>CH(n).missions.filter(m=>m.kind!=='mini');
const nextMain=(n=S.view)=>mainOf(n).find(m=>!isDone(n,m.id));
function isOpen(n,m){ if(n>S.ch) return false; if(m.needs&&!S.done[m.needs]) return false; if(m.kind==='mini') return isDone(n,m.after); const L=mainOf(n),k=L.indexOf(m); return k===0||isDone(n,L[k-1].id); }


// ===== title magic particles =====
(function(){ const cv=$('#tFx'); if(!cv) return; const g=cv.getContext('2d'); let W=0,H=0,parts=[],stars=[],shoot=null,last=0; const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function size(){ const r=cv.getBoundingClientRect(), d=Math.min(2,devicePixelRatio||1); W=r.width; H=r.height; cv.width=W*d; cv.height=H*d; g.setTransform(d,0,0,d,0,0);
  stars=Array.from({length:Math.round(W*H/9000)},()=>({x:Math.random()*W,y:Math.random()*H*.55,r:Math.random()*1.4+.4,p:Math.random()*6.28,s:.5+Math.random()*1.5})); }
 function spark(){ const c=['#ffe066','#fff3bf','#d0bfff','#a5d8ff','#ffc9e9']; return {x:Math.random()*W,y:H+10,vx:(Math.random()-.5)*.3,vy:-(.3+Math.random()*.9),r:1+Math.random()*2.6,life:0,max:300+Math.random()*300,c:c[Math.floor(Math.random()*c.length)],w:Math.random()*6.28}; }
 function tick(t){ if(current!=='title'){ requestAnimationFrame(tick); return; } if(!W) size(); const dt=Math.min(50,t-last||16); last=t; g.clearRect(0,0,W,H);
  stars.forEach(s=>{ const a=.35+.65*Math.abs(Math.sin(t/1000*s.s+s.p)); g.globalAlpha=a; g.fillStyle='#fff'; g.beginPath(); g.arc(s.x,s.y,s.r,0,7); g.fill(); if(s.r>1.4&&a>.9){ g.strokeStyle='#fff8'; g.lineWidth=.6; g.beginPath(); g.moveTo(s.x-5,s.y); g.lineTo(s.x+5,s.y); g.moveTo(s.x,s.y-5); g.lineTo(s.x,s.y+5); g.stroke(); } });
  if(parts.length<70&&Math.random()<.5) parts.push(spark());
  parts.forEach(p=>{ p.life+=dt/16; p.w+=.03; p.x+=p.vx+Math.sin(p.w)*.35; p.y+=p.vy; const k=p.life/p.max; g.globalAlpha=Math.max(0,Math.sin(Math.PI*Math.min(1,k))); g.fillStyle=p.c; g.shadowColor=p.c; g.shadowBlur=10; g.beginPath(); g.arc(p.x,p.y,p.r,0,7); g.fill(); g.shadowBlur=0; });
  parts=parts.filter(p=>p.life<p.max&&p.y>-10);
  if(!shoot&&Math.random()<.004) shoot={x:Math.random()*W*.7+W*.2,y:Math.random()*H*.25,l:0};
  if(shoot){ shoot.l+=dt/16; const x=shoot.x-shoot.l*9,y=shoot.y+shoot.l*4; const gr=g.createLinearGradient(x,y,x+90,y-40); gr.addColorStop(0,'#fff'); gr.addColorStop(1,'#fff0'); g.globalAlpha=Math.max(0,1-shoot.l/50); g.strokeStyle=gr; g.lineWidth=2.2; g.beginPath(); g.moveTo(x,y); g.lineTo(x+90,y-40); g.stroke(); if(shoot.l>50) shoot=null; }
  g.globalAlpha=1; requestAnimationFrame(tick); }
 addEventListener('resize',()=>{ W=0; }); if(!RM) requestAnimationFrame(tick); else { size(); }
 // a burst of sparkles wherever the kid taps on the title screen
 $('#title').addEventListener('pointerdown',e=>{ if(RM) return; for(let i=0;i<14;i++){ const a=Math.random()*6.28,v=1+Math.random()*2.5; const p=spark(); const r=cv.getBoundingClientRect(); p.x=e.clientX-r.left; p.y=e.clientY-r.top; p.vx=Math.cos(a)*v; p.vy=Math.sin(a)*v; p.max=60+Math.random()*40; parts.push(p); } });
})();
// ============ screens ============
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id)); current=id; FX.ambient(id==='title'||id==='story'||id==='result'?'light':null); updateHint(); if(id==='map'){ drawMap(); } }
let current='title';
let hintShown=false; function updateHint(){ const port=innerHeight>innerWidth&&innerWidth<600; const on=port&&current!=='title'&&!hintShown; $('#rotHint').style.display=on?'block':'none'; if(on){ hintShown=true; setTimeout(()=>{ $('#rotHint').style.display='none'; },4000); } }
addEventListener('resize',()=>{ updateHint(); if(current==='map') drawMap(); if(current==='mini') miniResize(); });
function refreshStars(){ ['#stStars','#mapStars','#playStars'].forEach(s=>$(s).textContent=S.stars); const n=Math.min(S.ch,CHAPTERS.length), d=mainOf(n).filter(m=>isDone(n,m.id)).length; $('#stCh').textContent=d+'/'+mainOf(n).length; $('#stChL').textContent=S.allDone?'All chapters ✓':'Chapter '+n; }

$('#titleArt').innerHTML=svg(`
 <defs><radialGradient id="tg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3bf" stop-opacity=".9"/><stop offset=".5" stop-color="#ffd43b" stop-opacity=".35"/><stop offset="1" stop-color="#ffd43b" stop-opacity="0"/></radialGradient></defs>
 <ellipse cx="512" cy="520" rx="300" ry="70" fill="url(#tg)" opacity=".55"/>
 <g class="tCircle" opacity=".9"><ellipse cx="512" cy="520" rx="250" ry="58" fill="none" stroke="#ffe066" stroke-width="3" stroke-dasharray="14 10"/></g>
 <g class="tCircle2" opacity=".7"><ellipse cx="512" cy="520" rx="200" ry="44" fill="none" stroke="#b197fc" stroke-width="2.5" stroke-dasharray="4 12"/></g>
 <g class="tNora">${girl('nora',512,250,1.05,{arm:'wand',badge:false})}</g>
 <text class="tWrite" x="640" y="170" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="96" stroke="#ffe066" stroke-width="2.5" filter="url(#glow)">magic</text>
 <g class="tEmber"><image href="art/d-ember.webp" x="-55" y="-70" width="110" height="137"/></g>`,'232 70 560 540');
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
$('#chPrev').onclick=()=>{ if(S.view>1){ S.view--; save(); spotsKey=''; Snd.sfx('tap'); setTimeout(centerMap,60); } };
$('#chNext').onclick=()=>{ if(S.view<Math.min(S.ch,CHAPTERS.length)){ S.view++; save(); spotsKey=''; Snd.sfx('tap'); setTimeout(centerMap,60); } };
let walking=false; async function walkTo(x,y){ walking=true; const sx=noraPos.x,sy=noraPos.y; for(let k=1;k<=18;k++){ noraPos={x:sx+(x-sx)*k/18,y:sy+(y-sy)*k/18}; await sleep(28); } walking=false; }
let spotBusy=false;
async function openSpot(m){ if(spotBusy) return; spotBusy=true; try{ await openSpotGo(m); } finally { setTimeout(()=>spotBusy=false,400); } }
