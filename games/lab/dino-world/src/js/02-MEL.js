const MEL=['C5','E5','G5','E5','F5','A4','C5','A4','G4','B4','D5','B4','C5',0,'G4',0,'E5','G5','A4','C5','F5','E5','D5','C5','D5','B4','G4','B4','C5',0,0,0].map(k=>k?N[k]:0);
const BASS=['C3','C3','F3','F3','G3','G3','C3','C3','A3','A3','F3','F3','G3','G3','C3','C3'].map(k=>N[k]);
function sched(){if(!AC)return;while(nextT<AC.currentTime+.35){const w=nextT-AC.currentTime;const n=MEL[musicStep%MEL.length];if(n)tone(n,.2,'triangle',.11,w,musicG);if(musicStep%2===0)tone(BASS[(musicStep/2|0)%BASS.length],.36,'sine',.14,w,musicG);if(musicStep%4===0)tone(90,.08,'square',.04,w,musicG,40);musicStep++;nextT+=60/138/2;}}
function musicOn(){musicWanted=true;const a=ac();if(!a)return;musicG.gain.cancelScheduledValues(a.currentTime);musicG.gain.setTargetAtTime(.55,a.currentTime,.3);if(!musicTimer){nextT=a.currentTime+.05;musicTimer=setInterval(sched,100);}}
function musicOff(){musicWanted=false;if(!AC)return;musicG.gain.cancelScheduledValues(AC.currentTime);musicG.gain.setTargetAtTime(0,AC.currentTime,.35);setTimeout(()=>{if(!musicWanted&&musicTimer){clearInterval(musicTimer);musicTimer=null;}},2500);}
let lastParts=[];const vcache={};
// pick the best installed voice: Premium > Enhanced > other; for Chinese prefer Taiwan, then Hong Kong, then mainland
function voiceScore(v,l){const lang=(v.lang||'').replace('_','-');const id=((v.name||'')+' '+(v.voiceURI||'')).toLowerCase();let sc=0;
 if(lang===l)sc+=100;else if(l==='zh-TW'&&/^zh-(hk|hant)/i.test(lang))sc+=60;else if(lang.slice(0,2)===l.slice(0,2))sc+=40;else return -1;
 if(/premium/.test(id))sc+=30;else if(/enhanced|neural|natural|online/.test(id))sc+=20;if(/compact|eloquence|novelty/.test(id))sc-=15;
 if(l==='zh-TW'&&/lilian/.test(id))sc+=200;if(l==='zh-TW'&&/mei-?jia/.test(id))sc+=5;if(l==='en-US'&&/samantha|ava|zoe|allison|google us/.test(id))sc+=5;if(v.localService)sc+=1;return sc;}
const ZHPICK='dinoworld.zhvoice';function zhPick(){try{return localStorage.getItem(ZHPICK)||'';}catch(e){return '';}}
function zhVoices(){try{return speechSynthesis.getVoices().filter(v=>/^(zh|yue)/i.test(v.lang||'')).sort((a,b)=>voiceScore(b,'zh-TW')-voiceScore(a,'zh-TW'));}catch(e){return [];}}
function voiceFor(l){if(vcache[l]!==undefined)return vcache[l];try{const vs=speechSynthesis.getVoices();
 if(l==='zh-TW'&&zhPick()){const v=vs.find(v=>v.voiceURI===zhPick());if(v){vcache[l]=v;return v;}}let best=null,bs=-1;for(const v of vs){const sc=voiceScore(v,l);if(sc>bs){bs=sc;best=v;}}if(vs.length)vcache[l]=best;return best;}catch(e){return null;}}
function voiceNote(){const el=$('voiceNote');if(!el)return;const v=voiceFor('zh-TW');if(!v){el.textContent='';return;}const id=(v.name+' '+v.voiceURI).toLowerCase();const good=/premium|enhanced|neural|natural/.test(id);
 const mac=/Mac/.test(navigator.platform||'')&&!('ontouchend' in document);el.innerHTML=good?`🗣 Chinese voice: ${v.name} ✓`:`🗣 Chinese voice: ${v.name} (basic). For a clearer voice: `+(mac?'System Settings → Accessibility → Read & Speak → System voice ⓘ → Chinese → download Lilian (Premium)':'Settings → Accessibility → Spoken Content → Voices → Chinese → download Lilian (Premium)')+`, then reopen this game.`;el.classList.toggle('ok',good);}
function sayParts(parts,pitch,onEnd){parts=parts||[];lastParts=parts;let fired=false;const fin=()=>{if(!fired){fired=true;onEnd&&onEnd();}};const est=parts.reduce((a,[t,l])=>a+t.length*(l==='zh-TW'?330:85),0)+1200;
 if(onEnd)setTimeout(fin,S.snd?est+2500:est);if(!S.snd||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();parts.forEach(([t,l],k)=>{const u=new SpeechSynthesisUtterance(t);u.lang=l;const v=voiceFor(l);if(v){u.voice=v;if(v.lang)u.lang=v.lang;}u.rate=l==='en-US'?.88:.8;u.pitch=pitch||1.15;if(k===parts.length-1&&onEnd)u.onend=()=>setTimeout(fin,50);speechSynthesis.speak(u);});}catch(e){}}
function parts(en,z){const p=[];if(S.voice!=='zh'&&en)p.push([en,'en-US']);if(S.voice!=='en'&&z)p.push([typeof z==='string'?z:z.map(x=>x[0]).join(''),'zh-TW']);return p;}
function say(en,z,extra,pitch,onEnd){sayParts(parts(en,z).concat(extra||[]),pitch,onEnd);}
document.addEventListener('click',e=>{if(e.target.closest('[data-rep]'))sayParts(lastParts);});
function setSnd(){$('snd').textContent=S.snd?'🔊':'🔇';if(master)master.gain.value=S.snd?1:0;}
$('snd').onclick=()=>{S.snd=!S.snd;save();setSnd();if(!S.snd)try{speechSynthesis.cancel();}catch(e){}};
const LANGL={both:'EN+中',en:'EN',zh:'中'};
function setLang(){$('lang').textContent=LANGL[S.voice]||'EN+中';}
$('lang').onclick=()=>{S.voice={both:'en',en:'zh',zh:'both'}[S.voice]||'both';save();setLang();sayParts(lastParts);};
setSnd();setLang();

/* ---------- small UI helpers ---------- */
let toastT;function toast(h,ms){const t=$('toast');t.innerHTML=h;t.classList.remove('hide');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.add('hide'),ms||1300);}
function bump(id){const e=$(id);e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump');}
function showWallet(b){$('bricks').textContent='🧱 '+binCount();$('snacks').textContent='🍎 '+S.snacks;if(b){bump('bricks');}}
function confetti(n=40){if(REDUCED)return;const cs=['#ff6b6b','#4dabf7','#ffd43b','#69db7c','#b197fc','#ffa94d'];for(let i=0;i<n;i++){const d=document.createElement('div');d.className='confetti';d.style.left=Math.random()*100+'vw';d.style.background=pick(cs);d.style.animationDelay=Math.random()*.6+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),2600);}}
let SCREEN='intro',SOLVE=null,BACK=null;
function show(id){document.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.id===id));if(id!==SCREEN&&id!=='page'){const el=$(id);if(el&&!REDUCED){el.classList.remove('turn');void el.offsetWidth;el.classList.add('turn');}}SCREEN=id;$('main').scrollTop=0;if(id==='zoo')zooStart();else zooStop();if(id==='map')mapDraw();}
document.addEventListener('click',e=>{if(e.target.closest('[data-map]'))goMap();else if(e.target.closest('[data-back]'))(BACK||goMap)();});
function praise(){return pick([['Yes!','答對了!'],['Great job!','好棒!'],['You did it!','太厲害了!']]);}
function draggable(el,onEnd){el.classList.add('drag');el.addEventListener('pointerdown',e=>{if(el.dataset.lock)return;e.preventDefault();try{el.setPointerCapture(e.pointerId);}catch(_){}const sx=e.clientX,sy=e.clientY;let moved=false;
 const mv=ev=>{const dx=ev.clientX-sx,dy=ev.clientY-sy;if(Math.hypot(dx,dy)>10)moved=true;if(moved){el.classList.add('lift');el.style.transform=`translate(${dx}px,${dy}px) scale(1.08)`;}};
 const up=ev=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.classList.remove('lift');el.style.transform='';
  if(!moved){onEnd(null,true);return;}const t=document.elementsFromPoint(ev.clientX,ev.clientY).find(n=>n!==el&&n.dataset&&n.dataset.drop!==undefined);onEnd(t||null,false);};
 el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);});}

/* ---------- shapes, colors, brick dinos ---------- */
const COL={red:['#ff6b6b','red','紅色'],blue:['#4dabf7','blue','藍色'],yellow:['#ffd43b','yellow','黃色'],green:['#69db7c','green','綠色'],orange:['#ffa94d','orange','橘色'],purple:['#b197fc','purple','紫色']};
const CK=Object.keys(COL);
const SH={oval:['oval','ovals','橢圓形'],pent:['pentagon','pentagons','五邊形'],hex:['hexagon','hexagons','六邊形'],sq:['square','squares','正方形'],rect:['rectangle','rectangles','長方形'],tri:['triangle','triangles','三角形'],circ:['circle','circles','圓形'],semi:['half circle','half circles','半圓形'],star:['star','stars','星形'],heart:['heart','hearts','心形'],dia:['diamond','diamonds','菱形']};
const ST='stroke="#4a3426" stroke-width="2.4" stroke-linejoin="round"';
function shade(h,f){const n=parseInt(h.slice(1),16);const g=x=>Math.max(0,Math.min(255,Math.round(f>1?x+(255-x)*(f-1):x*f)));return '#'+[g(n>>16),g(n>>8&255),g(n&255)].map(x=>x.toString(16).padStart(2,'0')).join('');}
function geoSVG(s,g,fill,cls,extra){cls=cls?` class="${cls}"`:'';extra=extra||'';
 if(s==='tri')return `<polygon${cls} points="${g.p.map(q=>q.join(',')).join(' ')}" fill="${fill}" ${ST} ${extra}/>`;
 if(s==='circ')return `<ellipse${cls} cx="${g.x+g.w/2}" cy="${g.y+g.h/2}" rx="${g.w/2}" ry="${g.h/2}" fill="${fill}" ${ST} ${extra}/>`;
 if(s==='semi')return `<path${cls} d="M${g.x},${g.y+g.h} A${g.w/2},${g.h} 0 0 1 ${g.x+g.w},${g.y+g.h} Z" fill="${fill}" ${ST} ${extra}/>`;
 return `<rect${cls} x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}" rx="2.5" fill="${fill}" ${ST} ${extra}/>`;}
// lego-like brick: studs, a darker lower band for depth, and a shine
// ---- crayon kit: wobbly (but stable) lines, hatch texture, double ink outline ----
const INK='#5c3d2e';
function jit(x,y,k){const v=Math.sin(x*12.9898+y*78.233+k*37.719)*43758.5453;return v-Math.floor(v)-.5;}
function wob(pts,a,k){k=k||0;return 'M'+pts.map(([x,y],i)=>`${(x+jit(x,y,k+i)*a).toFixed(1)} ${(y+jit(y,x,k+i+7)*a).toFixed(1)}`).join(' L')+'Z';}
function subdiv(pts,n){const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}return o;}
const ellPts=(cx,cy,rx,ry,n=22)=>Array.from({length:n},(_,i)=>[cx+rx*Math.cos(i/n*6.2832),cy+ry*Math.sin(i/n*6.2832)]);
const semiPts=(x,y,w,h)=>Array.from({length:15},(_,i)=>[x+w/2-w/2*Math.cos(i/14*3.1416),y+h-h*Math.sin(i/14*3.1416)]).concat([[x+w*.66,y+h],[x+w*.33,y+h]]);
function shapePts(s,g){if(s==='tri')return subdiv(g.p,2);if(s==='circ')return ellPts(g.x+g.w/2,g.y+g.h/2,g.w/2,g.h/2);if(s==='semi')return semiPts(g.x,g.y,g.w,g.h);
 return subdiv([[g.x,g.y],[g.x+g.w,g.y],[g.x+g.w,g.y+g.h],[g.x,g.y+g.h]],3);}
function crayon(pts,hex,sw){sw=sw||2.2;const k=Math.round(pts[0][0]*3+pts[0][1]);const a=wob(pts,.7,k);
 return `<path d="${a}" fill="${hex}"/><path d="${a}" fill="url(#hat)"/><path d="${wob(pts,1.3,k+3)}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/><path d="${wob(pts,1.9,k+9)}" fill="none" stroke="${INK}" stroke-width="${sw*.4}" opacity=".5"/>`;}
function brick(s,g,hex){let o=crayon(shapePts(s,g),hex);
 if(s==='rect'||s==='sq')o+=`<path d="M${g.x+3} ${g.y+4} l${Math.min(g.w-6,12)} -1" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>`;
 if(s==='circ'||s==='semi')o+=`<path d="M${g.x+g.w*.25} ${g.y+(s==='semi'?g.h*.5:g.h*.35)} q${g.w*.08} -${g.h*.15} ${g.w*.22} -${g.h*.18}" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`;
 return o;}
function iconGeo(s){return {sq:{x:12,y:12,w:36,h:36},rect:{x:4,y:18,w:52,h:26},tri:{p:[[30,6],[56,52],[4,52]]},circ:{x:8,y:8,w:44,h:44},semi:{x:4,y:22,w:52,h:28}}[s];}
const heartPts=()=>Array.from({length:28},(_,i)=>{const t=i/28*6.2832;return [30+1.65*16*Math.pow(Math.sin(t),3),28-1.65*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))];});
const EXTRA={star:()=>subdiv([[30,4],[37,22],[57,23],[41,35],[47,55],[30,43],[13,55],[19,35],[3,23],[23,22]],1),heart:heartPts,dia:()=>subdiv([[30,3],[54,30],[30,57],[6,30]],2),
 oval:()=>ellPts(30,30,27,17),pent:()=>subdiv([[30,4],[56,23],[46,55],[14,55],[4,23]],2),hex:()=>subdiv([[16,6],[44,6],[58,30],[44,54],[16,54],[2,30]],2)};
function shapeIcon(s,hex){if(EXTRA[s])return `<svg viewBox="-2 -2 64 64">${crayon(EXTRA[s](),hex)}</svg>`;return `<svg viewBox="-2 -6 64 64">${brick(s,iconGeo(s),hex)}</svg>`;}
const TPL={
 rex:{en:'T-Rex',zh:'暴龍',eye:[76,12],mouth:'M70 22h12',steps:[
  {s:'tri',g:[{p:[[2,38],[34,30],[34,50]]}]},{s:'rect',g:[{x:30,y:28,w:36,h:24}]},{s:'sq',g:[{x:58,y:4,w:26,h:24}]},
  {s:'rect',g:[{x:36,y:52,w:10,h:28,leg:0},{x:54,y:52,w:10,h:28,leg:1}]}]},
 brachio:{en:'Long Neck',zh:'腕龍',eye:[69,0],steps:[
  {s:'semi',g:[{x:18,y:28,w:52,h:30}]},{s:'rect',g:[{x:58,y:6,w:10,h:36,z:-1}]},{s:'circ',g:[{x:56,y:-8,w:18,h:18}]},
  {s:'tri',g:[{p:[[0,56],[26,42],[26,58]],z:-1}]},{s:'rect',g:[{x:24,y:58,w:10,h:22,leg:0},{x:52,y:58,w:10,h:22,leg:1}]}]},
 stego:{en:'Stego',zh:'劍龍',eye:[82,52],steps:[
  {s:'semi',g:[{x:16,y:36,w:60,h:28}]},{s:'tri',g:[{p:[[22,48],[30,22],[38,48]],z:-1},{p:[[38,42],[46,14],[54,42]],z:-1},{p:[[54,48],[62,22],[70,48]],z:-1}]},
  {s:'sq',g:[{x:72,y:46,w:16,h:16}]},{s:'rect',g:[{x:24,y:64,w:10,h:16,leg:0},{x:56,y:64,w:10,h:16,leg:1}]}]},
 trike:{en:'Tricera',zh:'三角龍',eye:[74,35],mouth:'M78 42q4 2 7-1',steps:[
  {s:'semi',g:[{x:14,y:26,w:58,h:32}]},{s:'tri',g:[{p:[[0,46],[22,40],[22,54]],z:-1}]},
  {s:'rect',g:[{x:18,y:52,w:10,h:28,z:-2,leg:0},{x:52,y:52,w:10,h:28,z:-2,leg:1},{x:26,y:56,w:10,h:24,leg:1},{x:58,y:56,w:10,h:24,leg:0}]},
  {s:'circ',g:[{x:45,y:5,w:38,h:38,z:-1}]},{s:'sq',g:[{x:64,y:26,w:21,h:21}]},{s:'tri',g:[{p:[[85,30],[98,38],[85,44]]}]},
  {s:'tri',g:[{p:[[66,28],[90,10],[74,30]]},{p:[[72,30],[98,14],[80,32]]},{p:[[83,30],[87,20],[89,30]]}]}]},
 babytrike:{en:'Baby Tricera',zh:'三角龍寶寶',nobuild:true,eye:[66,45],eyeR:6,mouth:'M72 53q4 3 8-1',steps:[
  {s:'semi',g:[{x:18,y:44,w:44,h:24}]},{s:'rect',g:[{x:24,y:66,w:10,h:14,leg:0},{x:46,y:66,w:10,h:14,leg:1}]},
  {s:'circ',g:[{x:36,y:10,w:44,h:44,z:-1}]},{s:'sq',g:[{x:54,y:32,w:28,h:28}]},{s:'tri',g:[{p:[[82,42],[93,49],[82,55]]}]},
  {s:'tri',g:[{p:[[58,34],[62,24],[66,34]]},{p:[[70,34],[74,24],[78,34]]}]}]},
 ptero:{en:'Ptero',zh:'翼龍',fly:true,eye:[64,22],steps:[
  {s:'circ',g:[{x:36,y:30,w:28,h:28}]},{s:'tri',g:[{p:[[40,40],[0,20],[22,54]],z:-1,wing:1},{p:[[60,40],[100,20],[78,54]],z:-1,wing:1}]},
  {s:'circ',g:[{x:52,y:12,w:20,h:20}]},{s:'tri',g:[{p:[[68,18],[94,24],[68,30]],z:-1}]}]},
 spino:{en:'Spino',zh:'棘龍',eye:[82,33],mouth:'M84 40h10',steps:[
  {s:'semi',g:[{x:26,y:4,w:38,h:30,z:-1}]},{s:'rect',g:[{x:22,y:32,w:46,h:22}]},{s:'tri',g:[{p:[[0,40],[26,34],[26,52]]}]},
  {s:'rect',g:[{x:64,y:28,w:32,h:13}]},{s:'rect',g:[{x:28,y:54,w:10,h:26,leg:0},{x:52,y:54,w:10,h:26,leg:1}]}]},
 para:{en:'Parasaur',zh:'副櫛龍',eye:[72,12],mouth:'M76 19q4 2 7-1',steps:[
  {s:'semi',g:[{x:14,y:36,w:54,h:28}]},{s:'tri',g:[{p:[[0,52],[18,42],[18,58]]}]},{s:'rect',g:[{x:56,y:16,w:11,h:28,z:-1}]},
  {s:'circ',g:[{x:56,y:2,w:26,h:22}]},{s:'tri',g:[{p:[[60,6],[30,-12],[64,-2]],z:-1}]},{s:'rect',g:[{x:22,y:62,w:10,h:18,leg:0},{x:48,y:62,w:10,h:18,leg:1}]}]},
 pachy:{en:'Dome Head',zh:'腫頭龍',eye:[76,38],mouth:'M74 46q4 2 7-1',steps:[
  {s:'semi',g:[{x:14,y:38,w:50,h:26}]},{s:'tri',g:[{p:[[0,48],[18,42],[18,56]]}]},{s:'sq',g:[{x:60,y:30,w:24,h:22}]},
  {s:'semi',g:[{x:58,y:12,w:28,h:20}]},{s:'rect',g:[{x:24,y:62,w:10,h:18,leg:0},{x:46,y:62,w:10,h:18,leg:1}]}]},
 raptor:{en:'Raptor',zh:'迅猛龍',eye:[82,22],mouth:'M86 28h8',steps:[
  {s:'tri',g:[{p:[[0,26],[34,30],[34,44]]}]},{s:'rect',g:[{x:30,y:28,w:34,h:18}]},{s:'sq',g:[{x:58,y:20,w:12,h:12,z:-1}]},
  {s:'rect',g:[{x:64,y:16,w:30,h:14}]},{s:'tri',g:[{p:[[58,40],[70,48],[60,52]]}]},{s:'rect',g:[{x:36,y:46,w:8,h:34,leg:0},{x:50,y:46,w:8,h:34,leg:1}]}]},
 diplo:{en:'Diplodocus',zh:'梁龍',eye:[96,22],steps:[
  {s:'tri',g:[{p:[[-4,30],[34,34],[34,46]]}]},{s:'semi',g:[{x:28,y:26,w:44,h:30}]},{s:'tri',g:[{p:[[64,32],[92,18],[70,46]],z:-1}]},
  {s:'circ',g:[{x:86,y:14,w:16,h:16}]},{s:'rect',g:[{x:34,y:54,w:10,h:26,leg:0},{x:58,y:54,w:10,h:26,leg:1}]}]},
 ankylo:{en:'Ankylo',zh:'甲龍',eye:[82,54],steps:[
  {s:'semi',g:[{x:18,y:36,w:58,h:30}]},{s:'tri',g:[{p:[[26,46],[32,28],[38,46]],z:-1},{p:[[42,42],[48,22],[54,42]],z:-1},{p:[[58,46],[64,28],[70,46]],z:-1}]},
  {s:'circ',g:[{x:0,y:44,w:18,h:18}]},{s:'sq',g:[{x:72,y:48,w:16,h:16}]},{s:'sq',g:[{x:26,y:66,w:14,h:14,leg:0},{x:56,y:66,w:14,h:14,leg:1}]}]}};
