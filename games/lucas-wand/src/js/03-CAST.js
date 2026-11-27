// Each character gets their own voice: the best installed match from the list wins (Premium voices sound most human).
const CAST={
 narr:{cast:['Zoe','Samantha','Ava'],pitch:1.0,rate:.92},
 nora:{cast:['Aaron','Evan','Nathan','Daniel','Samantha'],pitch:1.3,rate:.96},
 gran:{cast:['Allison','Moira','Karen','Samantha'],pitch:.92,rate:.85},
 prof:{cast:['Serena','Kate','Moira','Karen','Samantha'],pitch:1.0,rate:.88},
 mei:{cast:['Nicky','Susan','Samantha'],pitch:1.3,rate:.9},
 iris:{cast:['Tessa','Fiona','Samantha'],pitch:1.2,rate:1.0},
 wren:{cast:['Karen','Moira','Samantha'],pitch:1.25,rate:.86},
 sunny:{cast:['Aaron','Evan','Samantha'],pitch:1.55,rate:1.02},
 juni:{cast:['Nathan','Daniel','Samantha'],pitch:1.25,rate:.95},
 lola:{cast:['Moira','Kate','Samantha'],pitch:1.15,rate:.8},
 bree:{cast:['Allison','Susan','Samantha'],pitch:.95,rate:.95},
 ember:{cast:['Samantha','Ava'],pitch:1.9,rate:1.1},
 thistle:{cast:['Karen','Allison','Samantha'],pitch:.7,rate:.82},
};
const NAMES={nora:'Lucas',gran:'Grandma',prof:'Professor Quill',mei:'Mei',iris:'Iris',wren:'Wren',sunny:'Sunny',juni:'Jun',lola:'Lola',bree:'Coach Bree',ember:'Ember',thistle:'Thistle'};
const Voice={ say(t,who,opts){ opts=Object.assign({},CAST[who||'narr']||CAST.narr,opts||{}); if(!S.sound){ opts.onEnd&&setTimeout(opts.onEnd,1200); return; } try{ window.KAVoice ? KAVoice.say(t,opts) : (opts.onEnd&&setTimeout(opts.onEnd,1500)); }catch(e){} }, stop(){ try{window.KAVoice&&KAVoice.stop();}catch(e){} } };

// ============ FX: particles, flashes, shake, projectiles (one full-screen canvas) ============
const FX=(()=>{
 const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const cv=document.createElement('canvas'); cv.id='fx'; cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:35';
 document.body.appendChild(cv); const g=cv.getContext('2d'); let W=0,H=0,dpr=1;
 const fit=()=>{ dpr=Math.min(2,devicePixelRatio||1); W=innerWidth; H=innerHeight; cv.width=W*dpr; cv.height=H*dpr; g.setTransform(dpr,0,0,dpr,0,0); }; fit(); addEventListener('resize',fit);
 const P=[], TX=[], RINGS=[], PROJ=[], CIRC=[], ORBS=[], BEAMS=[]; let flash=null, amb=null, vig=null, raf=0, last=performance.now();
 const MAX=RM?60:320, R=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
 function add(p){ if(P.length>=MAX) P.shift(); P.push(p); kick(); }
 function burst(x,y,o={}){ const n=RM?Math.ceil((o.n||30)/4):(o.n||30); for(let i=0;i<n;i++){ const a=o.dir!=null?o.dir+R(-(o.spread||.6),(o.spread||.6)):R(0,Math.PI*2), sp=R(.3,1)*(o.speed||6);
   add({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:o.grav??.12,drag:o.drag??.97,life:R(.6,1)*(o.life||900),t:0,size:R(.6,1.2)*(o.size||5),c:pick(o.colors||['#ffd43b','#fff3bf','#ffa94d']),shape:o.shape||'star',rot:R(0,6),vr:R(-.2,.2),glow:o.glow??true}); } }
 function text(x,y,t,c='#fff',sz=44){ TX.push({x,y,t,c,sz,life:1100,t0:performance.now()}); kick(); }
 function ring(x,y,c='#fff',max=160){ RINGS.push({x,y,c,max,life:450,t0:performance.now()}); kick(); }
 function flashScreen(c='#fff',a=.6,ms=260){ if(RM) a*=.4; flash={c,a,ms,t0:performance.now()}; kick(); }
 function shake(el,mag=12,ms=420){ if(!el||RM) return; el.animate&&el.animate([0,1,2,3,4,5,6].map(i=>({transform:i===6?'none':`translate(${R(-mag,mag)*(1-i/6)}px,${R(-mag,mag)*(1-i/6)}px)`})),{duration:ms}); }
 function ambient(kind){ amb=kind; kick(); }
 // element styles for spell trails + impacts
 const EL={
  fire:{c:['#ff6b6b','#ffa94d','#ffd43b','#fff3bf'],shape:'circle',g:-.08,trail:'ember'},
  ice:{c:['#d0ebff','#74c0fc','#ffffff','#a5d8ff'],shape:'shard',g:.05,trail:'shard'},
  water:{c:['#4dabf7','#a5d8ff','#e7f5ff','#339af0'],shape:'drop',g:.25,trail:'drop'},
  wind:{c:['#c3fae8','#96f2d7','#ffffff','#e6fcf5'],shape:'swirl',g:0,trail:'swirl'},
  light:{c:['#fff3bf','#ffd43b','#ffffff','#ffe066'],shape:'star',g:0,trail:'star'},
  earth:{c:['#a9876b','#8d6e4f','#c9a26b','#69db7c'],shape:'chunk',g:.35,trail:'chunk'},
  bolt:{c:['#fff3bf','#fab005','#ffffff','#74c0fc'],shape:'spark',g:0,trail:'spark'},
 };
 function projectile(elk,emoji,x0,y0,x1,y1,ms=760){ return new Promise(res=>{ PROJ.push({elk,emoji,x0,y0,x1,y1,ms,t0:performance.now(),res,cx:(x0+x1)/2,cy:Math.min(y0,y1)-R(90,160)}); kick(); }); }
 function impact(elk,x,y,big){ const e=EL[elk]||EL.light; burst(x,y,{n:big?90:55,colors:e.c,shape:e.shape,speed:big?11:8,grav:e.g,life:1000,size:big?9:7});
  burst(x,y,{n:24,colors:['#ffffff',e.c[0]],shape:'circle',speed:3,grav:0,life:500,size:12}); ring(x,y,e.c[0],big?260:180); ring(x,y,'#ffffff',big?160:110);
  if(elk==='bolt') for(let i=0;i<4;i++) add({x,y,bolt:true,ang:R(0,6.28),len:R(60,140),t:0,life:260,c:'#fff3bf',size:3});
  flashScreen(e.c[0],big?.3:.18,big?300:200); }
 // Each shape+colour is drawn once (with its glow) into a small sprite, then stamped: fast on iPad.
 const SPR={}, EMO={};
 function emojiImg(e){ if(EMO[e]) return EMO[e]; const c=document.createElement('canvas'); c.width=c.height=128; const x=c.getContext('2d'); x.font='100px "Apple Color Emoji","Noto Color Emoji",sans-serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillText(e,64,70); let ink=0; try{ const d=x.getImageData(0,0,128,128).data; for(let i=3;i<d.length;i+=64) ink+=d[i]; }catch(_){ ink=1; } if(!ink){ x.font='100px sans-serif'; x.fillText(e,64,70); return c; } return EMO[e]=c; }
 function sprite(shape,c,glow){ if(/^#[0-9a-f]{3}$/i.test(c)) c='#'+[...c.slice(1)].map(h=>h+h).join(''); const key=shape+c+glow; if(SPR[key]) return SPR[key]; const S=64,cv2=document.createElement('canvas'); cv2.width=cv2.height=S; const x=cv2.getContext('2d'); x.translate(S/2,S/2);
  if(glow){ const gr=x.createRadialGradient(0,0,0,0,0,S/2); gr.addColorStop(0,c+'aa'); gr.addColorStop(.35,c+'44'); gr.addColorStop(1,c+'00'); x.fillStyle=gr; x.fillRect(-S/2,-S/2,S,S); }
  x.fillStyle=c; x.strokeStyle=c; const s=12;
  switch(shape){
   case 'star': x.beginPath(); for(let i=0;i<8;i++){ const r=i%2?s*.4:s*1.4, a=i*Math.PI/4; x.lineTo(Math.cos(a)*r,Math.sin(a)*r);} x.closePath(); x.fill(); break;
   case 'shard': x.beginPath(); x.moveTo(0,-s*1.8); x.lineTo(s*.6,0); x.lineTo(0,s*1.8); x.lineTo(-s*.6,0); x.closePath(); x.fill(); break;
   case 'drop': x.beginPath(); x.arc(0,s*.3,s*.8,0,Math.PI); x.lineTo(0,-s*1.4); x.closePath(); x.fill(); break;
   case 'swirl': x.lineWidth=4; x.beginPath(); x.arc(0,0,s*1.4,0,Math.PI*1.3); x.stroke(); break;
   case 'chunk': x.fillRect(-s*.7,-s*.6,s*1.4,s*1.2); break;
   case 'spark': x.lineWidth=4; x.beginPath(); x.moveTo(-s*1.6,0); x.lineTo(s*1.6,0); x.stroke(); break;
   case 'heart': x.beginPath(); x.moveTo(0,s*.9); x.bezierCurveTo(-s*1.6,-s*.2,-s*.6,-s*1.4,0,-s*.5); x.bezierCurveTo(s*.6,-s*1.4,s*1.6,-s*.2,0,s*.9); x.fill(); break;
   case 'confetti': x.fillRect(-s*.9,-s*.4,s*1.8,s*.8); break;
   case 'smoke': { const gr=x.createRadialGradient(0,0,0,0,0,S/2); gr.addColorStop(0,c); gr.addColorStop(1,c+'00'); x.fillStyle=gr; x.beginPath(); x.arc(0,0,S/2,0,7); x.fill(); break; }
   default: x.beginPath(); x.arc(0,0,s,0,7); x.fill();
  } return SPR[key]=cv2; }
 function drawShape(p,k){ const sc=(p.size/12)*(p.shape==='smoke'?(1+(1-k)*3)*.6:1), img=sprite(p.shape,p.c,p.glow&&p.shape!=='smoke');
  g.globalAlpha=Math.min(1,k*1.5)*(p.shape==='smoke'?.45:1); g.setTransform(dpr*sc*Math.cos(p.rot),dpr*sc*Math.sin(p.rot),-dpr*sc*Math.sin(p.rot),dpr*sc*Math.cos(p.rot),dpr*p.x,dpr*p.y); g.drawImage(img,-32,-32); g.setTransform(dpr,0,0,dpr,0,0); g.globalAlpha=1; }
 function loop(now){ raf=-1; const dt=Math.min(40,now-last); last=now; const f=dt/16.7; g.clearRect(0,0,W,H);
  // ambient sparkles (story/title)
  if(amb&&!RM&&Math.random()<.35*f){ add({x:R(0,W),y:H+10,vx:R(-.3,.3),vy:R(-1.1,-.4),g:-.002,drag:1,life:R(3000,6000),t:0,size:R(1.5,3.5),c:pick(amb==='dark'?['#b197fc','#748ffc','#fff3bf']:['#fff3bf','#ffe066','#ffffff']),shape:Math.random()<.3?'star':'circle',rot:0,vr:.02,glow:true}); }
  // projectiles
  for(let i=PROJ.length-1;i>=0;i--){ const pr=PROJ[i], k=Math.min(1,(now-pr.t0)/pr.ms), e=k*k*(3-2*k), u=1-e;
   const x=u*u*pr.x0+2*u*e*pr.cx+e*e*pr.x1, y=u*u*pr.y0+2*u*e*pr.cy+e*e*pr.y1, el=EL[pr.elk]||EL.light;
   for(let j=0;j<(RM?1:4);j++) add({x:x+R(-8,8),y:y+R(-8,8),vx:R(-1.2,1.2),vy:R(-1.2,1.2)+(pr.elk==='fire'?-1:0),g:el.g*.5,drag:.94,life:R(350,700),t:0,size:R(3,8),c:pick(el.c),shape:el.shape,rot:R(0,6),vr:R(-.3,.3),glow:true});
   const sz=56+44*e, gl=sprite('circle',el.c[0],true), em=emojiImg(pr.emoji); g.save(); g.translate(x,y); g.globalAlpha=.9; g.drawImage(gl,-sz*1.1,-sz*1.1,sz*2.2,sz*2.2); const core=sprite('circle','#ffffff',true); g.drawImage(core,-sz*.45,-sz*.45,sz*.9,sz*.9); g.globalAlpha=1;
   g.rotate(k*Math.PI*(pr.elk==='wind'?6:1.2)); g.drawImage(em,-sz/2,-sz/2,sz,sz); g.restore();
   if(k>=1){ PROJ.splice(i,1); pr.res(); } }
  // particles
  for(let i=P.length-1;i>=0;i--){ const p=P[i]; p.t+=dt; if(p.t>=p.life){ P.splice(i,1); continue; } const k=1-p.t/p.life;
   if(p.bolt){ g.save(); g.strokeStyle=p.c; g.lineWidth=p.size; g.globalAlpha=k; g.beginPath(); let bx=p.x,by=p.y; g.moveTo(bx,by); for(let s=1;s<=5;s++){ bx=p.x+Math.cos(p.ang)*p.len*s/5+R(-14,14); by=p.y+Math.sin(p.ang)*p.len*s/5+R(-14,14); g.lineTo(bx,by);} g.stroke(); g.restore(); continue; }
   if(p.home){ const q=Math.min(1,p.t/p.life); p.x+=(p.home.x-p.x)*Math.min(1,.06+q*.25)*f+p.vx*(1-q); p.y+=(p.home.y-p.y)*Math.min(1,.06+q*.25)*f+p.vy*(1-q); p.vx*=.9; p.vy*=.9; p.rot+=p.vr*f; drawShape(p,Math.max(.3,k)); continue; }
   if(p.orbit){ const o=p.orbit; o.a+=o.va*f; o.r=Math.max(4,o.r+o.vr*f); p.x=o.cx+Math.cos(o.a)*o.r; p.y=o.cy+Math.sin(o.a)*o.r*.6-(1-k)*40; p.rot+=p.vr*f; drawShape(p,k); continue; }
   p.vx*=Math.pow(p.drag,f); p.vy=p.vy*Math.pow(p.drag,f)+p.g*f; p.x+=p.vx*f; p.y+=p.vy*f; p.rot+=p.vr*f; drawShape(p,k); }
  // rings
  for(let i=RINGS.length-1;i>=0;i--){ const r=RINGS[i], k=(now-r.t0)/r.life; if(k>=1){ RINGS.splice(i,1); continue; } g.save(); g.strokeStyle=r.c; g.globalAlpha=1-k; g.lineWidth=10*(1-k)+1; g.beginPath(); g.arc(r.x,r.y,r.max*Math.sqrt(k),0,7); g.stroke(); g.restore(); }
  // floating text
  for(let i=TX.length-1;i>=0;i--){ const t=TX[i], k=(now-t.t0)/t.life; if(k>=1){ TX.splice(i,1); continue; } const pop=k<.15?k/.15*1.3:1.3-Math.min(.3,(k-.15)*1.2);
   g.save(); g.font=`900 ${t.sz}px Poppins,system-ui,sans-serif`; const hw=g.measureText(t.t).width*.68+10, tx=Math.max(hw,Math.min(W-hw,t.x)); g.translate(tx,t.y-k*70); g.scale(pop,pop); g.globalAlpha=k>.7?(1-k)/.3:1; g.textAlign='center'; g.textBaseline='middle'; g.lineWidth=7; g.strokeStyle='#2b1d4a'; g.strokeText(t.t,0,0); g.fillStyle=t.c; g.fillText(t.t,0,0); g.restore(); }
  // vignette (darkens the edges while a spell charges)
  if(vig){ const k=(now-vig.t0)/vig.ms; if(k>=1) vig=null; else { const a=vig.a*Math.min(1,k*5,(1-k)*4); const gr=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.25,W/2,H/2,Math.max(W,H)*.75); gr.addColorStop(0,'rgba(20,10,40,0)'); gr.addColorStop(1,`rgba(20,10,40,${a})`); g.fillStyle=gr; g.fillRect(0,0,W,H); } }
  // magic circles
  for(let i=CIRC.length-1;i>=0;i--){ const c=CIRC[i], k=(now-c.t0)/c.ms; if(k>=1){ CIRC.splice(i,1); continue; } const sc=k<.15?(.3+k/.15*.7):1, al=Math.min(1,(1-k)*3,k*8);
   g.save(); g.translate(c.x,c.y); g.globalAlpha=al; g.strokeStyle=c.c; g.fillStyle=c.c; const r=c.r*sc;
   g.lineWidth=4; g.beginPath(); g.arc(0,0,r,0,7); g.stroke(); g.lineWidth=2; g.beginPath(); g.arc(0,0,r*.82,0,7); g.stroke(); g.beginPath(); g.arc(0,0,r*.45,0,7); g.stroke();
   g.save(); g.rotate(now/900); g.beginPath(); for(let j=0;j<6;j++){ const a=j/6*Math.PI*2; g.lineTo(Math.cos(a)*r*.82,Math.sin(a)*r*.82); const b=(j+2)/6*Math.PI*2; g.lineTo(Math.cos(b)*r*.82,Math.sin(b)*r*.82); } g.stroke();
   g.font=`${Math.round(r*.13)}px "Chalkboard SE","Comic Sans MS",system-ui,sans-serif`; g.textAlign='center'; g.textBaseline='middle'; c.runes.forEach((ch,j)=>{ const a=j/c.runes.length*Math.PI*2; g.save(); g.translate(Math.cos(a)*r*.91,Math.sin(a)*r*.91); g.rotate(a+Math.PI/2); g.fillText(ch,0,0); g.restore(); }); g.restore();
   g.save(); g.rotate(-now/600); for(let j=0;j<12;j++){ const a=j/12*Math.PI*2; g.fillRect(Math.cos(a)*r-3,Math.sin(a)*r-3,6,6); } g.restore(); g.restore(); }
  // charging orbs
  for(let i=ORBS.length-1;i>=0;i--){ const o=ORBS[i], k=(now-o.t0)/o.ms; if(k>=1){ ORBS.splice(i,1); continue; } const s2=(20+80*Math.min(1,k*1.4))*(1+Math.sin(now/40)*.06), gl=sprite('circle',o.c,true), core=sprite('circle','#ffffff',true);
   g.globalAlpha=Math.min(1,(1-k)*6); g.drawImage(gl,o.x-s2*1.5,o.y-s2*1.5,s2*3,s2*3); g.drawImage(core,o.x-s2*.6,o.y-s2*.6,s2*1.2,s2*1.2); g.globalAlpha=1; }
  // light beams + lightning from the sky
  for(let i=BEAMS.length-1;i>=0;i--){ const b=BEAMS[i], k=(now-b.t0)/b.ms; if(k>=1){ BEAMS.splice(i,1); continue; }
   if(b.type==='beam'){ const w=b.w*(1-k*.7); g.save(); g.globalAlpha=Math.min(1,(1-k)*2); const gr=g.createLinearGradient(b.x-w/2,0,b.x+w/2,0); gr.addColorStop(0,'rgba(255,243,191,0)'); gr.addColorStop(.5,'rgba(255,255,255,.95)'); gr.addColorStop(1,'rgba(255,243,191,0)'); g.fillStyle=gr; g.fillRect(b.x-w/2,0,w,b.y+40); g.restore(); }
   else { g.save(); g.strokeStyle='#fff'; g.lineWidth=6*(1-k)+2; g.globalAlpha=1-k; g.beginPath(); g.moveTo(b.x0,0); const segs=7; for(let s3=1;s3<=segs;s3++){ const q=s3/segs; g.lineTo(b.x0+(b.x-b.x0)*q+(s3<segs?R(-26,26):0),b.y*q); } g.stroke(); g.strokeStyle='#fab005'; g.lineWidth=2; g.stroke(); g.restore(); if(k<.2&&!b.hit){ b.hit=true; burst(b.x,b.y,{n:16,colors:['#fff3bf','#fab005','#fff'],shape:'spark',speed:7,grav:0,life:400,size:6}); } } }
  // flash
  if(flash){ const k=(now-flash.t0)/flash.ms; if(k>=1) flash=null; else { g.save(); g.globalAlpha=flash.a*(1-k); g.fillStyle=flash.c; g.fillRect(0,0,W,H); g.restore(); } }
  raf=(P.length||TX.length||RINGS.length||PROJ.length||CIRC.length||ORBS.length||BEAMS.length||vig||flash||amb)?requestAnimationFrame(loop):0; }
 function kick(){ if(!raf){ last=performance.now(); raf=requestAnimationFrame(loop); } }
 // sparkles along an ink path given in screen coords
 function inkSparkle(pts,colors){ const step=Math.max(1,Math.floor(pts.length/70)); pts.forEach((p,i)=>{ if(i%step) return; setTimeout(()=>burst(p[0],p[1],{n:3,colors:colors||['#ffd43b','#fff3bf','#ffffff'],speed:3,grav:-.04,life:700,size:4}), i/step*8); }); }
 function smoke(pts){ const step=Math.max(1,Math.floor(pts.length/30)); pts.forEach((p,i)=>{ if(i%step) return; add({x:p[0],y:p[1],vx:R(-.5,.5),vy:R(-1.4,-.4),g:-.01,drag:.98,life:R(700,1100),t:0,size:R(6,12),c:pick(['#adb5bd','#868e96','#ced4da']),shape:'smoke',rot:0,vr:0,glow:false}); }); }
 function confetti(){ for(let i=0;i<(RM?20:110);i++) add({x:R(0,W),y:R(-60,-10),vx:R(-1.5,1.5),vy:R(1,4),g:.06,drag:.99,life:R(2200,3400),t:0,size:R(5,9),c:pick(['#7048e8','#ffd43b','#ff6fa8','#40c057','#4dabf7','#fff']),shape:Math.random()<.3?'star':'confetti',rot:R(0,6),vr:R(-.2,.2),glow:false}); }
 function hearts(x,y){ burst(x,y,{n:18,colors:['#ff6fa8','#f783ac','#b197fc'],shape:'heart',speed:4,grav:-.05,life:1400,size:9}); }
 const center=el=>{ const r=el.getBoundingClientRect(); return [r.left+r.width/2,r.top+r.height/2]; };
 // ---- epic spell effects
 const RUNES='abcdefghklmnopqrstuvwxyz';
 function magicCircle(x,y,r,c,ms=2000){ CIRC.push({x,y,r,c,ms,t0:performance.now(),runes:[...Array(12)].map(()=>RUNES[Math.floor(Math.random()*RUNES.length)])}); kick(); }
 function vignette(ms=2500,a=.55){ vig={t0:performance.now(),ms,a}; kick(); }
 function traceRun(pts,c,ms=550){ if(!pts.length) return; const step=Math.max(1,Math.floor(pts.length/90)), n=Math.ceil(pts.length/step); pts.forEach((p,i)=>{ if(i%step) return; setTimeout(()=>{ add({x:p[0],y:p[1],vx:0,vy:0,g:0,drag:1,life:700,t:0,size:13,c,shape:'circle',rot:0,vr:0,glow:true}); add({x:p[0],y:p[1],vx:R(-.6,.6),vy:R(-.6,.6),g:0,drag:.95,life:500,t:0,size:5,c:'#ffffff',shape:'star',rot:0,vr:.1,glow:true}); },(i/step)/n*ms); }); }
 function converge(pts,x,y,colors,ms=550){ const step=Math.max(1,Math.floor(pts.length/70)); pts.forEach((p,i)=>{ if(i%step) return; add({x:p[0],y:p[1],vx:R(-3,3),vy:R(-3,3),g:0,drag:.9,life:ms+R(0,120),t:0,size:R(5,9),c:pick(colors),shape:'star',rot:0,vr:.3,glow:true,home:{x,y}}); }); }
 function orb(x,y,c,ms=900){ ORBS.push({x,y,c,ms,t0:performance.now()}); kick(); }
 function beam(x,y,c,ms=700,w=110){ BEAMS.push({type:'beam',x,y,c,ms,w,t0:performance.now()}); kick(); }
 function skyBolt(x,y,delay=0){ setTimeout(()=>{ BEAMS.push({type:'bolt',x0:x+R(-120,120),x,y,ms:260,t0:performance.now()}); kick(); },delay); }
 function signature(elk,x,y,big){ const e=EL[elk]||EL.light;
  if(elk==='fire'){ for(let i=0;i<(RM?15:110);i++) add({x:x+R(-60,60),y:y+R(20,90),vx:R(-.8,.8),vy:R(-15,-5),g:-.06,drag:.97,life:R(700,1300),t:0,size:R(6,13),c:pick(e.c),shape:'circle',rot:0,vr:0,glow:true}); }
  if(elk==='ice'){ for(let i=0;i<14;i++){ const a=i/14*6.28; add({x:x+Math.cos(a)*30,y:y+Math.sin(a)*30,vx:Math.cos(a)*9,vy:Math.sin(a)*9,g:0,drag:.88,life:1100,t:0,size:R(16,24),c:pick(['#e7f5ff','#a5d8ff','#ffffff']),shape:'shard',rot:a+1.57,vr:0,glow:true}); } }
  if(elk==='water'){ [0,140,280].forEach(d=>setTimeout(()=>ring(x,y,'#74c0fc',220),d)); burst(x,y,{n:70,colors:e.c,shape:'drop',speed:12,dir:-1.57,spread:1.1,grav:.45,life:1300,size:8}); }
  if(elk==='wind'){ for(let i=0;i<(RM?15:90);i++) add({x,y,vx:0,vy:0,g:0,drag:1,life:R(900,1400),t:0,size:R(5,10),c:pick(e.c),shape:'swirl',rot:R(0,6),vr:.3,glow:true,orbit:{cx:x,cy:y,r:R(30,150),a:R(0,6.28),va:R(.15,.3),vr:-1.4}}); }
  if(elk==='light'){ beam(x,y,'#fff3bf',800,big?150:110); for(let i=0;i<(RM?10:60);i++) setTimeout(()=>add({x:x+R(-140,140),y:-10,vx:0,vy:R(8,14),g:.1,drag:1,life:900,t:0,size:R(5,9),c:pick(e.c),shape:'star',rot:0,vr:.2,glow:true}),i*12); }
  if(elk==='earth'){ for(let i=0;i<(RM?4:12);i++) setTimeout(()=>add({x:x+R(-90,90),y:y-R(260,380),vx:R(-.5,.5),vy:R(4,8),g:.7,drag:1,life:650,t:0,size:R(16,26),c:pick(e.c),shape:'chunk',rot:R(0,6),vr:R(-.2,.2),glow:false}),i*50); setTimeout(()=>burst(x,y+40,{n:50,colors:e.c,shape:'chunk',speed:9,dir:-1.57,spread:1.3,grav:.5,life:900,size:7}),450); }
  if(elk==='bolt'){ [0,90,200,320].forEach(d=>skyBolt(x,y,d)); }
  impact(elk,x,y,big); }
 return {burst,text,ring,flash:flashScreen,shake,ambient,projectile,impact,inkSparkle,smoke,confetti,hearts,center,EL,RM,magicCircle,vignette,traceRun,converge,orb,signature};
})();

