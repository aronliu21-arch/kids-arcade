/* ---------- animation layer (canvas particles + overlays) ---------- */
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const PAL={fire:['#ff922b','#ffd43b','#fa5252'],water:['#74c0fc','#e7f5ff','#1c7ed6'],leaf:['#69db7c','#40c057','#d8f5a2'],spark:['#ffe066','#ffffff','#fab005'],rock:['#a9805b','#868e96','#e6d5c3'],sky:['#d0bfff','#ffffff','#9775fa'],gold:['#ffd43b','#fff3bf','#ffffff'],heal:['#69db7c','#b2f2bb','#ffffff'],rainbow:['#ff6b6b','#ffd43b','#69db7c','#4dabf7','#b197fc']};
const SHAPE={fire:'dot',water:'drop',leaf:'leaf',spark:'spark',rock:'rock',sky:'spark',gold:'star',heal:'plus',rainbow:'star'};
const FX=(()=>{let cv,ctx,P=[],L=[],run=false;
 function size(){const d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d;ctx=cv.getContext('2d');ctx.setTransform(d,0,0,d,0,0);}
 function ensure(){if(cv)return;cv=document.createElement('canvas');cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:67';document.body.appendChild(cv);size();addEventListener('resize',size);}
 function drawP(p){const a=Math.max(0,p.life/p.max);ctx.globalAlpha=Math.min(1,a*1.5);ctx.fillStyle=p.c;ctx.strokeStyle=p.c;
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot||0);const s=p.s*(p.grow?1+(1-a)*p.grow:1);
  switch(p.k){
   case 'dot':ctx.shadowColor=p.c;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(0,0,s,0,7);ctx.fill();break;
   case 'drop':ctx.beginPath();ctx.moveTo(0,-s*1.6);ctx.quadraticCurveTo(s,0,0,s);ctx.quadraticCurveTo(-s,0,0,-s*1.6);ctx.fill();break;
   case 'leaf':ctx.beginPath();ctx.ellipse(0,0,s*1.4,s*.6,0,0,7);ctx.fill();ctx.strokeStyle='#1b5e20';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-s,0);ctx.lineTo(s,0);ctx.stroke();break;
   case 'spark':ctx.rotate(Math.atan2(p.vy,p.vx)-(p.rot||0));ctx.lineWidth=Math.max(1.5,s*.5);ctx.lineCap='round';ctx.shadowColor=p.c;ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(-s*2.2,0);ctx.lineTo(s*2.2,0);ctx.stroke();break;
   case 'rock':ctx.beginPath();ctx.moveTo(-s,-s*.6);ctx.lineTo(s*.2,-s);ctx.lineTo(s,-s*.2);ctx.lineTo(s*.6,s);ctx.lineTo(-s*.8,s*.7);ctx.closePath();ctx.fill();ctx.strokeStyle='#1b1f3b';ctx.lineWidth=1.5;ctx.stroke();break;
   case 'star':ctx.shadowColor=p.c;ctx.shadowBlur=10;ctx.beginPath();for(let i=0;i<8;i++){const r=i%2?s*.4:s*1.3,an=i*Math.PI/4;ctx.lineTo(r*Math.cos(an),r*Math.sin(an));}ctx.fill();break;
   case 'plus':ctx.fillRect(-s*.35,-s,s*.7,s*2);ctx.fillRect(-s,-s*.35,s*2,s*.7);break;
   case 'ring':ctx.lineWidth=p.w||4;ctx.globalAlpha=a;ctx.beginPath();ctx.arc(0,0,p.s+(1-a)*p.R,0,7);ctx.stroke();break;}
  ctx.restore();ctx.globalAlpha=1;}
 function loop(){ctx.clearRect(0,0,innerWidth,innerHeight);
  L=L.filter(l=>l(performance.now())!==false);
  P=P.filter(p=>{p.life--;p.x+=p.vx;p.y+=p.vy;p.vy+=p.g||0;p.vx*=p.drag||.98;p.vy*=p.drag||.98;p.rot=(p.rot||0)+(p.spin||0);if(p.life>0)drawP(p);return p.life>0;});
  if(P.length||L.length)requestAnimationFrame(loop);else{run=false;ctx.clearRect(0,0,innerWidth,innerHeight);}}
 function go(){ensure();if(!run){run=true;requestAnimationFrame(loop);}}
 function emit(x,y,type,n,o){o=o||{};const cs=PAL[type]||PAL.gold,k=o.k||SHAPE[type]||'dot';n=RM?Math.ceil(n/4):n;
  for(let i=0;i<n;i++){const an=o.dir!==undefined?o.dir+(Math.random()-.5)*(o.spread||1):Math.random()*Math.PI*2,sp=(o.speed||5)*(.4+Math.random()*.9);
   P.push({x:x+(Math.random()-.5)*(o.jx||0),y:y+(Math.random()-.5)*(o.jy||0),vx:Math.cos(an)*sp,vy:Math.sin(an)*sp+(o.up?-2:0),g:o.g!==undefined?o.g:(k==='dot'||k==='spark'||k==='star'||k==='plus'?-.03:.25),
    s:(o.size||4)*(.6+Math.random()*.8),c:cs[Math.floor(Math.random()*cs.length)],k,life:(o.life||40)+Math.random()*20,max:(o.life||40)+20,spin:k==='leaf'||k==='rock'?(Math.random()-.5)*.3:0,rot:Math.random()*6,drag:o.drag});}go();}
 function ring(x,y,c,R,w){P.push({x,y,vx:0,vy:0,g:0,s:10,R:R||90,w:w||5,c,k:'ring',life:28,max:28});go();}
 /* projectile from (x1,y1) to (x2,y2) styled by type */
 function shot(x1,y1,x2,y2,type,big,done){if(RM){done&&done();return;}const t0=performance.now(),dur=type==='spark'?320:(big?640:500),cs=PAL[type];let fired=false;
  if(type==='spark'){L.push(now=>{const k=(now-t0)/dur;if(k>1){if(!fired){fired=true;done&&done();}return false;}
    if(Math.floor(now/50)%2){ctx.save();ctx.strokeStyle='#fff';ctx.shadowColor='#ffe066';ctx.shadowBlur=20;ctx.lineWidth=big?6:4;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x1,y1);
     const seg=9;for(let i=1;i<seg;i++){const f=i/seg;ctx.lineTo(x1+(x2-x1)*f+(Math.random()-.5)*40,y1+(y2-y1)*f+(Math.random()-.5)*40);}ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle='#ffe066';ctx.lineWidth=big?2.5:1.5;ctx.stroke();ctx.restore();}
    if(Math.random()<.5)emit(x1+(x2-x1)*Math.random(),y1+(y2-y1)*Math.random(),'spark',2,{speed:3,life:14});});go();return;}
  const n=type==='rock'?(big?3:2):type==='water'||type==='leaf'?(big?16:10):1;
  for(let j=0;j<n;j++){const delay=j*(type==='rock'?120:35),arc=type==='rock'?-90-Math.random()*40:type==='leaf'?(Math.random()-.5)*120:(type==='sky'?-40:-25),wob=Math.random()*6;
   L.push(now=>{const k=(now-t0-delay)/dur;if(k<0)return;if(k>=1){if(j===n-1&&!fired){fired=true;done&&done();}return false;}
    const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,x=x1+(x2-x1)*e+(type==='leaf'?Math.sin(k*10+wob)*14:0),y=y1+(y2-y1)*e+arc*Math.sin(Math.PI*k);
    ctx.save();
    if(type==='fire'){const r=big?18:12;const g=ctx.createRadialGradient(x,y,0,x,y,r*1.8);g.addColorStop(0,'#fff');g.addColorStop(.35,'#ffd43b');g.addColorStop(.7,'#ff6b35');g.addColorStop(1,'rgba(250,82,82,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*1.8,0,7);ctx.fill();emit(x,y,'fire',2,{speed:1.5,life:18,size:4});}
    else if(type==='water'){ctx.fillStyle=cs[j%3];ctx.shadowColor='#e7f5ff';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x,y,big?7:5,0,7);ctx.fill();}
    else if(type==='leaf'){ctx.translate(x,y);ctx.rotate(k*12+j);ctx.fillStyle=cs[j%3];ctx.beginPath();ctx.ellipse(0,0,9,4,0,0,7);ctx.fill();}
    else if(type==='rock'){ctx.translate(x,y);ctx.rotate(k*8);const s=big?14:10;ctx.fillStyle=cs[j%2];ctx.strokeStyle='#1b1f3b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-s,-s*.6);ctx.lineTo(s*.2,-s);ctx.lineTo(s,-s*.2);ctx.lineTo(s*.6,s);ctx.lineTo(-s*.8,s*.7);ctx.closePath();ctx.fill();ctx.stroke();}
    else{ctx.translate(x,y);ctx.rotate(Math.atan2(y2-y1,x2-x1));ctx.strokeStyle='#fff';ctx.shadowColor='#b197fc';ctx.shadowBlur=14;ctx.lineWidth=big?6:4;ctx.lineCap='round';ctx.beginPath();ctx.arc(-10,0,big?26:18,-1.1,1.1);ctx.stroke();ctx.strokeStyle='#d0bfff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(-22,0,big?22:15,-1,1);ctx.stroke();}
    ctx.restore();});}
  go();}
 function flash(c){if(RM)return;const d=document.createElement('div');d.className='flashov';d.style.background=c||'#fff';document.body.appendChild(d);setTimeout(()=>d.remove(),500);}
 function quake(){if(RM)return;const a=document.querySelector('.app');a.classList.remove('quake');void a.offsetWidth;a.classList.add('quake');setTimeout(()=>a.classList.remove('quake'),520);}
 function stamp(txt,cls,color){const d=document.createElement('div');d.className='stamp '+(cls||'');d.textContent=txt;if(color)d.style.color=color;document.body.appendChild(d);setTimeout(()=>d.remove(),1150);}
 function layer(f){ensure();L.push(now=>f(ctx,now));go();}
 return {emit,ring,shot,flash,quake,stamp,layer};})();
const ctr=el=>{if(!el)return [innerWidth/2,innerHeight/2];const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];};
function whoosh(){if(!SOUND)return;const c=audio();if(!c)return;try{const n=c.createBufferSource(),b=c.createBuffer(1,c.sampleRate*.4,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);n.buffer=b;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(400,c.currentTime);f.frequency.exponentialRampToValueAtTime(3000,c.currentTime+.35);const g=c.createGain();g.gain.value=.25;n.connect(f);f.connect(g);g.connect(c.destination);n.start();}catch(e){}}
function boom(){if(!SOUND)return;const c=audio();if(!c)return;try{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(160,c.currentTime);o.frequency.exponentialRampToValueAtTime(40,c.currentTime+.5);g.gain.setValueAtTime(.35,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.6);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.65);}catch(e){}whoosh();}
function riser(ms){if(!SOUND)return;const c=audio();if(!c)return;try{const o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(120,c.currentTime);o.frequency.exponentialRampToValueAtTime(900,c.currentTime+ms/1000);g.gain.setValueAtTime(.02,c.currentTime);g.gain.linearRampToValueAtTime(.08,c.currentTime+ms/1000);g.gain.linearRampToValueAtTime(0,c.currentTime+ms/1000+.05);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+ms/1000+.1);}catch(e){}}
const ATKSND={fire:()=>{whoosh();tone(220,.4,'sawtooth',.07);},water:()=>{[900,700,500].forEach((f,i)=>tone(f,.12,'sine',.1,i*.06));},spark:()=>{[1200,300,1500,200].forEach((f,i)=>tone(f,.06,'square',.07,i*.04));},leaf:()=>{whoosh();},rock:()=>{tone(90,.3,'square',.1);},sky:()=>{whoosh();whoosh();}};
