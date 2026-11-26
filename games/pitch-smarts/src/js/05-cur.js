let cur=null,M=null,list=[],idx=0,pts=0,tries=0,S=null,locked=false,done=false,dragging=null,playId=0;
let R=19;

/* ---------- sound + voice ---------- */
let ac=null;
function audio(){
  if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){ac=null;}}
  if(ac&&ac.state==='suspended'){try{ac.resume();}catch(e){}}
  return ac;
}
function tone(f,d,type,vol,delay){
  if(!DB.sound)return;const c=audio();if(!c)return;
  try{
    const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(delay||0);
    o.type=type||'sine';o.frequency.value=f;o.connect(g);g.connect(c.destination);
    g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.start(t);o.stop(t+d+.03);
  }catch(e){}
}
const sfx={
  good(){[523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',.18,i*.08));},
  bad(){tone(200,.25,'sawtooth',.1);tone(150,.3,'sawtooth',.09,.12);shakeStage();},
  kick(){tone(130,.1,'square',.12);},
  tap(){tone(700,.06,'sine',.08);},
  star(){[660,880,1320].forEach((f,i)=>tone(f,.25,'triangle',.16,i*.12));}
};
/* feedback: a gentle shake on a miss, a "+2 ⭐" pop with sparkles on a success */
function shakeStage(){const s=$('stage');if(!s||$('play').hidden)return;s.classList.remove('shake');void s.offsetWidth;s.classList.add('shake');}
function popPoints(p){
  const st=$('stage');if(!st)return;
  const d=document.createElement('div');d.className='pop';d.textContent='+'+p+' ⭐';st.appendChild(d);setTimeout(()=>d.remove(),1300);
  for(let i=0;i<10;i++){
    const s=document.createElement('div'),a=i/10*6.283;s.className='spark';s.textContent=i%2?'★':'✦';
    s.style.setProperty('--dx',Math.round(Math.cos(a)*150)+'px');s.style.setProperty('--dy',Math.round(Math.sin(a)*100)+'px');
    st.appendChild(s);setTimeout(()=>s.remove(),950);
  }
}
function say(t){
  if(!prof(cur?cur.id:'nora').voice||!('speechSynthesis' in window))return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.rate=.95;u.pitch=1.1;u.lang='en-US';speechSynthesis.speak(u);}catch(e){}
}

/* ---------- tweens, fx, confetti ---------- */
const tweens=[],fx=[],parts=[];
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function tw(obj,to,ms,cb){
  const from={};for(const k in to)from[k]=obj[k];
  tweens.push({obj:obj,from:from,to:to,ms:ms,t0:performance.now(),cb:cb,id:playId});
}
function stepTweens(now){
  for(let i=tweens.length-1;i>=0;i--){
    const t=tweens[i];
    const u=Math.min(1,(now-t.t0)/t.ms),e=ease(u);
    for(const k in t.to)t.obj[k]=t.from[k]+(t.to[k]-t.from[k])*e;
    if(u>=1){tweens.splice(i,1);if(t.cb&&t.id===playId)t.cb();}
  }
}
function fxAdd(o,ms){o.until=performance.now()+ms;fx.push(o);}
function confetti(x,y){
  const cols=['#ffd43b','#ff6b6b','#4dabf7','#69db7c','#f783ac','#ffffff'];
  for(let i=0;i<46;i++){const a=rnd(0,6.283),s=rnd(120,380);parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-160,c:pick(cols),life:rnd(.9,1.6),r:rnd(3,6)});}
}
let ROT=false;
function upr(x,y,fn){if(!ROT){fn();return;}ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/2);ctx.translate(-x,-y);fn();ctx.restore();}
const abv=(o,d)=>ROT?{x:o.x+d,y:o.y}:{x:o.x,y:o.y-d};
const hitD=(m,p)=>ROT?Math.hypot(m.x+R*.35-p.x,m.y-p.y):Math.hypot(m.x-p.x,m.y-R*.35-p.y);
const ballPos=o=>ROT?{x:o.x-R*1.22,y:o.y+R*.8}:{x:o.x+R*.8,y:o.y+R*1.22};
function passBall(from,to,ms,cb){
  const b=S.ball,bp=ballPos(from);b.owner=null;b.x=bp.x;b.y=bp.y;sfx.kick();
  const tp=ballPos(to);
  tw(b,{x:tp.x,y:tp.y},ms,()=>{b.owner=to;if(cb)cb();});
}

/* ---------- canvas ---------- */
function fit(){
  const st=$('stage'),r=st.getBoundingClientRect();if(!r.width||!r.height)return;
  ROT=false; // up-and-down phone field switched off at the user's request; set to the line below to turn it back on
  // ROT=innerHeight>innerWidth&&innerWidth<600&&!!(S&&S.players)&&S.type!=='shoot'&&S.type!=='line';
  if($('rot'))$('rot').style.display=ROT?'none':'';
  const AW=ROT?H:W,AH=ROT?W:H;
  let w=Math.floor(Math.min(r.width,r.height*AW/AH));w=Math.max(240,w);const h=Math.floor(w*AH/AW);
  cv.style.width=w+'px';cv.style.height=h+'px';
  const dpr=Math.min(window.devicePixelRatio||1,3);
  cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);
  R=w<620?25:19;
}
if(window.ResizeObserver){try{new ResizeObserver(()=>fit()).observe($('stage'));}catch(e){}}
window.addEventListener('resize',fit);

function drawGoal(x,dir,fill){
  const y0=200,y1=280,d=24,gx=dir>0?x:x-d;
  ctx.fillStyle=fill;ctx.fillRect(gx,y0,d,y1-y0);
  ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.5;ctx.beginPath();
  for(let yy=y0+8;yy<y1;yy+=8){ctx.moveTo(gx,yy);ctx.lineTo(gx+d,yy);}
  for(let xx=gx+8;xx<gx+d;xx+=8){ctx.moveTo(xx,y0);ctx.lineTo(xx,y1);}
  ctx.stroke();
  ctx.strokeStyle='#fff';ctx.lineWidth=5;ctx.beginPath();
  ctx.moveTo(x,y0);ctx.lineTo(x+dir*d,y0);ctx.lineTo(x+dir*d,y1);ctx.lineTo(x,y1);ctx.stroke();
}
function pillLabel(t,x,y,bg,fg){upr(x,y,()=>pillLabel0(t,x,y,bg,fg));}
function pillLabel0(t,x,y,bg,fg){
  ctx.font='700 19px Fredoka,system-ui,sans-serif';ctx.textAlign='center';
  const w=ctx.measureText(t).width+24;
  ctx.fillStyle=bg;ctx.beginPath();
  if(ctx.roundRect)ctx.roundRect(x-w/2,y-17,w,34,17);else ctx.rect(x-w/2,y-17,w,34);
  ctx.fill();ctx.fillStyle=fg;ctx.fillText(t,x,y+6);
}
/* grass: soft gradient, mowed stripes and a fine blade texture (drawn once, then repeated) */
let GRASS=null;
function grassTex(){
  if(GRASS)return GRASS;
  try{
    const c=document.createElement('canvas');c.width=160;c.height=160;const g=c.getContext('2d');
    for(let i=0;i<1500;i++){g.fillStyle=Math.random()<.5?'rgba(255,255,255,.05)':'rgba(0,0,0,.07)';g.fillRect(Math.random()*160,Math.random()*160,1.4,1.5+Math.random()*4);}
    GRASS=ctx.createPattern(c,'repeat')||'none';
  }catch(e){GRASS='none';}
  return GRASS;
}
function grass(x,y,w,h,stripe,across){
  const base=ctx.createLinearGradient(0,y,0,y+h);base.addColorStop(0,'#3aab4f');base.addColorStop(1,'#2a8f3e');
  ctx.fillStyle=base;ctx.fillRect(x,y,w,h);
  ctx.fillStyle='rgba(255,255,255,.05)';
  if(across){for(let i=0;i*stripe<h;i+=2)ctx.fillRect(x,y+i*stripe,w,stripe);}
  else{for(let i=0;i*stripe<w;i+=2)ctx.fillRect(x+i*stripe,y,stripe,h);}
  const p=grassTex();if(p!=='none'){ctx.fillStyle=p;ctx.fillRect(x,y,w,h);}
}
function drawPitch(){
  grass(0,0,W,H,80,false);
  ctx.fillStyle='rgba(0,0,0,.10)';ctx.fillRect(0,0,W,34);ctx.fillRect(0,H-34,W,34);ctx.fillRect(0,34,34,H-68);ctx.fillRect(W-34,34,34,H-68);
  const lt=ctx.createRadialGradient(W/2,H/2,60,W/2,H/2,520);lt.addColorStop(0,'rgba(255,255,255,.08)');lt.addColorStop(1,'rgba(0,0,0,.16)');
  ctx.fillStyle=lt;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,255,255,.10)';
  for(let i=0;i<4;i++){const cx=175+i*150;ctx.beginPath();ctx.moveTo(cx-24,H/2-50);ctx.lineTo(cx+24,H/2);ctx.lineTo(cx-24,H/2+50);ctx.lineTo(cx-6,H/2);ctx.closePath();ctx.fill();}
  ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=3;
  ctx.strokeRect(34,34,W-68,H-68);
  ctx.beginPath();ctx.moveTo(W/2,34);ctx.lineTo(W/2,H-34);ctx.stroke();
  ctx.beginPath();ctx.arc(W/2,H/2,56,0,6.283);ctx.stroke();
  ctx.strokeRect(34,150,100,180);ctx.strokeRect(W-134,150,100,180);
  ctx.strokeRect(34,205,34,70);ctx.strokeRect(W-68,205,34,70);
  ctx.fillStyle='rgba(255,212,59,.18)';ctx.fillRect(W-134,150,100,180);
  drawGoal(W-34,1,'rgba(255,212,59,.55)');
  drawGoal(34,-1,'rgba(116,192,252,.45)');
  pillLabel('⚽ SCORE HERE',W-84,136,'#ffd43b','#12301d');
  pillLabel('OUR GOAL',84,136,'#1c7ed6','#fff');
  if(ROT)pillLabel('ATTACK ⬆',250,92,'rgba(255,255,255,.92)','#12301d');
  else pillLabel('WE ATTACK THIS WAY ➜',W/2,22,'rgba(255,255,255,.92)','#12301d');
}
function paintBall(c,x,y,r,rot,lw){
  rot=rot||0;
  c.save();
  c.beginPath();c.arc(x,y,r,0,6.283);
  const g=c.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);
  g.addColorStop(0,'#ffffff');g.addColorStop(.7,'#f1f3f5');g.addColorStop(1,'#c3cad2');
  c.fillStyle=g;c.fill();c.clip();
  const pent=(cx,cy,pr,a0)=>{c.beginPath();for(let i=0;i<5;i++){const a=a0+i*1.2566;c.lineTo(cx+Math.cos(a)*pr,cy+Math.sin(a)*pr);}c.closePath();c.fill();};
  c.fillStyle='#1b1b1b';c.strokeStyle='#1b1b1b';c.lineWidth=Math.max(1,r*.08);c.lineCap='round';
  const a0=-1.5708+rot;
  pent(x,y,r*.3,a0);
  for(let i=0;i<5;i++){
    const a=a0+i*1.2566;
    c.beginPath();c.moveTo(x+Math.cos(a)*r*.3,y+Math.sin(a)*r*.3);c.lineTo(x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.8);c.stroke();
    pent(x+Math.cos(a)*r*1.04,y+Math.sin(a)*r*1.04,r*.25,a+Math.PI);
  }
  c.restore();
  c.strokeStyle='#1b1b1b';c.lineWidth=lw||2;c.beginPath();c.arc(x,y,r,0,6.283);c.stroke();
}
function drawBall(x,y,r){
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x+1,y+r*.9,r*.9,r*.35,0,0,6.283);ctx.fill();
  paintBall(ctx,x,y,r,(x+y)/(r*3),2);
}
const SKIN=['#f6d2b4','#eab38a','#d9a066','#c68642','#8d5524','#f1c9a5'];
const HAIRC=['#1b120c','#3b2314','#111111','#7a4a24','#c98b2f','#5a2e1a'];
const STYLES={nora:['pony','bob','buns','pigtails'],lucas:['spiky','swoop','curly','buzz']};
function lookOf(p){
  if(p.me&&cur)return cur.id==='nora'?{skin:'#f1c9a5',hair:'#1b120c',style:'pony'}:{skin:'#f1c9a5',hair:'#1b120c',style:'spiky'};
  if(!p.look)p.look={skin:pick(SKIN),hair:pick(HAIRC),style:pick(STYLES[cur&&cur.id==='nora'?'nora':'lucas'])};
  return p.look;
}
function rr(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}
function hairBack(st,hx,hy,r,c){
  ctx.fillStyle=c;
  if(st==='pony'){ctx.beginPath();ctx.ellipse(hx+r*1.02,hy+r*.3,r*.42,r*.78,-.35,0,6.283);ctx.fill();}
  else if(st==='bob'){rr(hx-r*1.12,hy-r*.3,r*2.24,r*1.22,r*.5);ctx.fill();}
  else if(st==='pigtails'){for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(hx+s*r*1.18,hy+r*.4,r*.32,r*.62,s*.35,0,6.283);ctx.fill();}}
}
function hairFront(st,hx,hy,r,c){
  ctx.fillStyle=c;
  const ca=Math.cos(.07*Math.PI),sa=Math.sin(.07*Math.PI);
  ctx.beginPath();ctx.arc(hx,hy,r*1.07,Math.PI*.93,Math.PI*2.07);
  ctx.quadraticCurveTo(hx+r*.55,hy-r*.75,hx+r*.05,hy-r*.42);
  ctx.quadraticCurveTo(hx-r*.6,hy-r*.75,hx-r*1.07*ca,hy+r*1.07*sa);
  ctx.fill();
  if(st==='spiky'){
    for(let i=-2;i<=2;i++){const a=-Math.PI/2+i*.38;ctx.beginPath();
      ctx.moveTo(hx+Math.cos(a-.2)*r*.95,hy+Math.sin(a-.2)*r*.95);
      ctx.lineTo(hx+Math.cos(a)*r*1.42,hy+Math.sin(a)*r*1.42);
      ctx.lineTo(hx+Math.cos(a+.2)*r*.95,hy+Math.sin(a+.2)*r*.95);ctx.fill();}
  }else if(st==='curly'){
    for(let i=0;i<=7;i++){const a=Math.PI*(1.0+i/7);ctx.beginPath();ctx.arc(hx+Math.cos(a)*r*1.0,hy+Math.sin(a)*r*1.0,r*.33,0,6.283);ctx.fill();}
  }else if(st==='buns'){
    [-.78,-.22].forEach(k=>{const a=Math.PI*k;ctx.beginPath();ctx.arc(hx+Math.cos(a)*r*1.05,hy+Math.sin(a)*r*1.05,r*.42,0,6.283);ctx.fill();});
  }else if(st==='swoop'){
    ctx.beginPath();ctx.moveTo(hx-r*.95,hy-r*.3);ctx.quadraticCurveTo(hx-r*.1,hy-r*1.35,hx+r*.95,hy-r*.05);
    ctx.lineTo(hx+r*.45,hy-r*.5);ctx.quadraticCurveTo(hx-r*.2,hy-r*.75,hx-r*.95,hy-r*.3);ctx.fill();
  }else if(st==='pony'){
    ctx.fillStyle='#ff6b9d';ctx.beginPath();ctx.arc(hx+r*.9,hy-r*.22,r*.17,0,6.283);ctx.fill();
  }else if(st==='pigtails'){
    ctx.fillStyle='#ff6b9d';for(const s of [-1,1]){ctx.beginPath();ctx.arc(hx+s*r*1.02,hy-r*.02,r*.16,0,6.283);ctx.fill();}
  }
}
function drawFace(hx,hy,r,gx,gy,red,girl){
  const ex=r*.36,ey=hy+r*.08;
  for(const s of [-1,1]){
    ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(hx+s*ex,ey,r*.2,r*.24,0,0,6.283);ctx.fill();
    const px=hx+s*ex+gx*r*.08,py=ey+gy*r*.1;
    ctx.fillStyle='#2b1a10';ctx.beginPath();ctx.arc(px,py,r*.13,0,6.283);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-r*.04,py-r*.05,r*.045,0,6.283);ctx.fill();
  }
  if(girl){
    ctx.strokeStyle='#2b1a10';ctx.lineWidth=Math.max(1.2,r*.07);ctx.lineCap='round';
    for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(hx+s*(ex+r*.15),ey-r*.16);ctx.lineTo(hx+s*(ex+r*.3),ey-r*.27);ctx.stroke();}
  }
  ctx.strokeStyle='#2b1a10';ctx.lineWidth=Math.max(1.5,r*.09);ctx.lineCap='round';
  for(const s of [-1,1]){ctx.beginPath();
    if(red){ctx.moveTo(hx+s*r*.56,ey-r*.4);ctx.lineTo(hx+s*r*.17,ey-r*.27);}
    else{ctx.moveTo(hx+s*r*.54,ey-r*.32);ctx.quadraticCurveTo(hx+s*r*.37,ey-r*.44,hx+s*r*.2,ey-r*.34);}
    ctx.stroke();}
  ctx.fillStyle='rgba(255,110,110,.35)';
  for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(hx+s*r*.58,hy+r*.4,r*.15,r*.1,0,0,6.283);ctx.fill();}
  ctx.strokeStyle='#7a2e1f';ctx.lineWidth=Math.max(1.5,r*.09);ctx.beginPath();
  if(red){ctx.moveTo(hx-r*.2,hy+r*.55);ctx.quadraticCurveTo(hx,hy+r*.49,hx+r*.2,hy+r*.53);}
  else ctx.arc(hx,hy+r*.36,r*.24,Math.PI*.15,Math.PI*.85);
  ctx.stroke();ctx.lineCap='butt';
}
