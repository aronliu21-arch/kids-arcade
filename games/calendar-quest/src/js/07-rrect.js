
/* ---------- the kid's own character (front view, same look as Pitch Smarts) ---------- */
function rrect(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);}
function drawKid(c,who,x,y,R,now,mood,num){
  const girl=who==='nora',O='#1a1a1a',lw=Math.max(2,R*.12),SK='#f6cfae',HR='#1b120c';
  const K=girl?{shirt:'#1c7ed6',trim:'#ffc61a'}:{shirt:'#1c7ed6',trim:'#ffffff'};
  const cap=(a,b,w,col)=>{c.lineCap='round';c.strokeStyle=O;c.lineWidth=w+lw*1.6;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();};
  const poly=(cc,pts,r,fill)=>{c.beginPath();pts.forEach((q,i)=>{const px=cc.x+q[0]*r,py=cc.y+q[1]*r;if(i)c.lineTo(px,py);else c.moveTo(px,py);});c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=O;c.lineWidth=lw;c.lineJoin='round';c.stroke();};
  const hr=R*.8,hc={x:x,y:y-R*1.18},cheer=mood==='cheer';
  if(girl){
    const sw=cheer?Math.sin(now/180)*hr*.1:0,bx=hc.x+hr*.55,by=hc.y-hr*.82;
    c.fillStyle=HR;c.strokeStyle=O;c.lineWidth=lw;c.lineJoin='round';c.beginPath();
    c.moveTo(bx-hr*.2,by-hr*.05);c.bezierCurveTo(bx+hr*.9,by-hr*.75,bx+hr*1.8,by-hr*.1+sw,bx+hr*1.55,by+hr*1.25+sw);
    c.quadraticCurveTo(bx+hr*1.45,by+hr*1.45+sw,bx+hr*1.3,by+hr*1.3+sw);c.bezierCurveTo(bx+hr*1.4,by+hr*.55+sw,bx+hr*.9,by+hr*.05,bx+hr*.25,by+hr*.3);
    c.closePath();c.fill();c.stroke();
    c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=lw*.6;c.lineCap='round';c.beginPath();c.moveTo(bx+hr*.4,by-hr*.12);c.quadraticCurveTo(bx+hr*1.3,by-hr*.1+sw,bx+hr*1.4,by+hr*.9+sw);c.stroke();
  }
  for(const s of [-1,1]){
    cap([x+s*R*.3,y+R*.45],[x+s*R*.33,y+R*.95],R*.3,SK);cap([x+s*R*.33,y+R*.95],[x+s*R*.34,y+R*1.18],R*.32,K.shirt);
    c.fillStyle='#2a2a2a';c.strokeStyle=O;c.lineWidth=lw;c.beginPath();c.ellipse(x+s*R*.4,y+R*1.32,R*.3,R*.15,0,0,6.283);c.fill();c.stroke();
  }
  c.fillStyle='#fff';c.strokeStyle=O;c.lineWidth=lw;rrect(c,x-R*.7,y+R*.28,R*1.4,R*.5,R*.14);c.fill();c.stroke();
  for(const s of [-1,1]){ // arms: up when cheering
    const hx=cheer?x+s*R*1.25:x+s*R*1.1,hy=cheer?y-R*1.35:y+R*.2;
    cap([x+s*R*.8,y-R*.38],[hx,hy],R*.27,SK);c.fillStyle=SK;c.strokeStyle=O;c.lineWidth=lw;c.beginPath();c.arc(hx,hy,R*.17,0,6.283);c.fill();c.stroke();
  }
  c.fillStyle=K.shirt;c.strokeStyle=O;c.lineWidth=lw;c.lineJoin='round';c.beginPath();
  c.moveTo(x-R*.45,y-R*.68);c.lineTo(x-R*1.07,y-R*.42);c.lineTo(x-R*.9,y-R*.02);c.lineTo(x-R*.66,y-R*.12);c.lineTo(x-R*.66,y+R*.42);c.lineTo(x+R*.66,y+R*.42);c.lineTo(x+R*.66,y-R*.12);c.lineTo(x+R*.9,y-R*.02);
  c.lineTo(x+R*1.07,y-R*.42);c.lineTo(x+R*.45,y-R*.68);c.quadraticCurveTo(x,y-R*.45,x-R*.45,y-R*.68);c.closePath();c.fill();c.stroke();
  c.strokeStyle=K.trim;c.lineWidth=R*.12;c.lineCap='round';c.beginPath();c.moveTo(x-R*.38,y-R*.6);c.lineTo(x,y-R*.36);c.lineTo(x+R*.38,y-R*.6);c.stroke();
  c.font='700 '+Math.round(R*.7)+'px Fredoka,system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';
  c.lineWidth=lw*1.4;c.strokeStyle=O;c.strokeText(String(num),x,y+R*.04);c.fillStyle='#fff';c.fillText(String(num),x,y+R*.04);c.textBaseline='alphabetic';
  for(const s of [-1,1]){c.fillStyle=SK;c.strokeStyle=O;c.lineWidth=lw;c.beginPath();c.ellipse(hc.x+s*hr*.98,hc.y+hr*.18,hr*.17,hr*.24,0,0,6.283);c.fill();c.stroke();}
  c.fillStyle=SK;c.strokeStyle=O;c.lineWidth=lw;c.beginPath();c.ellipse(hc.x,hc.y,hr,hr*1.02,0,0,6.283);c.fill();c.stroke();
  if(girl){
    const hx=hc.x,hy=hc.y,r=hr;c.fillStyle=HR;c.strokeStyle=O;c.lineWidth=lw;c.lineJoin='round';c.beginPath();
    c.moveTo(hx-r*.92,hy+r*.55);c.bezierCurveTo(hx-r*1.18,hy-r*.1,hx-r*1.05,hy-r*1.05,hx,hy-r*1.15);c.bezierCurveTo(hx+r*1.05,hy-r*1.05,hx+r*1.18,hy-r*.1,hx+r*.92,hy+r*.55);
    c.quadraticCurveTo(hx+r*.8,hy+r*.05,hx+r*.78,hy-r*.3);c.quadraticCurveTo(hx+r*.58,hy-r*.32,hx+r*.44,hy-r*.2);c.quadraticCurveTo(hx+r*.3,hy-r*.52,hx+r*.05,hy-r*.56);
    c.quadraticCurveTo(hx-r*.12,hy-r*.38,hx-r*.3,hy-r*.26);c.quadraticCurveTo(hx-r*.45,hy-r*.46,hx-r*.78,hy-r*.3);c.quadraticCurveTo(hx-r*.8,hy+r*.05,hx-r*.92,hy+r*.55);
    c.closePath();c.fill();c.stroke();
    c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=lw*1.1;c.lineCap='round';
    c.beginPath();c.arc(hx-r*.05,hy-r*.35,r*.62,Math.PI*1.18,Math.PI*1.42);c.stroke();c.beginPath();c.arc(hx-r*.05,hy-r*.35,r*.62,Math.PI*1.5,Math.PI*1.6);c.stroke();
    c.fillStyle='#ff6b9d';c.strokeStyle=O;c.lineWidth=lw*.8;c.beginPath();c.ellipse(hx+r*.6,hy-r*.86,r*.21,r*.15,-.5,0,6.283);c.fill();c.stroke();
    const sx=hx-r*.52,sy=hy-r*.72,sr=r*.25;c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?sr*.45:sr;c.lineTo(sx+Math.cos(a)*q,sy+Math.sin(a)*q);}
    c.closePath();c.fillStyle='#ffc61a';c.fill();c.strokeStyle=O;c.lineWidth=lw*.6;c.stroke();
  }else poly(hc,[[1.02,0],[1.3,-.45],[.86,-.55],[1.02,-1.08],[.46,-.9],[.36,-1.55],[0,-.98],[-.36,-1.55],[-.46,-.9],[-1.02,-1.08],[-.86,-.55],[-1.3,-.45],[-1.02,0],[-.78,-.32],[-.56,-.12],[-.36,-.46],[-.12,-.18],[.1,-.48],[.34,-.16],[.56,-.46],[.78,-.32]],hr,HR);
  const gx=0,gy=.25;
  for(const s of [-1,1]){
    const ex=hc.x+s*hr*.36,ey=hc.y+hr*.14,ew=girl?.23:.21,eh=girl?.31:.29;
    c.fillStyle='#fff';c.strokeStyle=O;c.lineWidth=lw*.9;c.beginPath();c.ellipse(ex,ey,hr*ew,hr*eh,0,0,6.283);c.fill();c.stroke();
    const px=ex+gx*hr*.07,py=ey+gy*hr*.09;
    if(girl){c.fillStyle='#7a4a24';c.beginPath();c.ellipse(px,py,hr*.15,hr*.21,0,0,6.283);c.fill();}
    c.fillStyle=O;c.beginPath();c.ellipse(px,py,hr*(girl?.08:.11),hr*(girl?.12:.17),0,0,6.283);c.fill();
    c.fillStyle='#fff';c.beginPath();c.arc(px-hr*.05,py-hr*.08,hr*(girl?.06:.045),0,6.283);c.fill();
    if(girl){c.beginPath();c.arc(px+hr*.05,py+hr*.07,hr*.03,0,6.283);c.fill();
      c.strokeStyle=O;c.lineWidth=lw*1.5;c.lineCap='round';c.beginPath();c.ellipse(ex,ey,hr*ew,hr*eh,0,Math.PI*1.1,Math.PI*1.9);c.stroke();
      c.lineWidth=lw*.9;c.beginPath();c.moveTo(ex+s*hr*.2,ey-hr*.2);c.lineTo(ex+s*hr*.36,ey-hr*.3);c.stroke();}
    const oy=girl?-.38:-.3,iy=girl?-.3:-.05,th=girl?.07:.1;
    c.fillStyle=O;c.beginPath();c.moveTo(hc.x+s*hr*.62,hc.y+hr*oy);c.lineTo(hc.x+s*hr*.14,hc.y+hr*iy);c.lineTo(hc.x+s*hr*.14,hc.y+hr*(iy+th));c.lineTo(hc.x+s*hr*.6,hc.y+hr*(oy+th+.01));c.closePath();c.fill();
  }
  if(girl){c.strokeStyle='rgba(255,90,120,.8)';c.lineWidth=Math.max(1.2,lw*.6);for(const s of [-1,1])for(let j=0;j<3;j++){c.beginPath();c.moveTo(hc.x+s*hr*(.5+j*.1),hc.y+hr*.46);c.lineTo(hc.x+s*hr*(.45+j*.1),hc.y+hr*.58);c.stroke();}}
  c.fillStyle='#8a1f1f';c.strokeStyle=O;c.lineWidth=lw*.8;c.beginPath();
  if(girl){c.moveTo(hc.x-hr*.2,hc.y+hr*.5);c.lineTo(hc.x+hr*.2,hc.y+hr*.5);c.quadraticCurveTo(hc.x+hr*.17,hc.y+hr*.76,hc.x,hc.y+hr*.76);c.quadraticCurveTo(hc.x-hr*.17,hc.y+hr*.76,hc.x-hr*.2,hc.y+hr*.5);
    c.closePath();c.fill();c.stroke();c.fillStyle='#ff8fa3';c.beginPath();c.ellipse(hc.x,hc.y+hr*.68,hr*.1,hr*.055,0,0,6.283);c.fill();c.fillStyle='#fff';c.fillRect(hc.x-hr*.17,hc.y+hr*.52,hr*.34,hr*.05);}
  else{c.moveTo(hc.x-hr*.24,hc.y+hr*.5);c.lineTo(hc.x+hr*.24,hc.y+hr*.5);c.lineTo(hc.x+hr*.14,hc.y+hr*.68);c.lineTo(hc.x-hr*.14,hc.y+hr*.68);c.closePath();c.fill();c.stroke();c.fillStyle='#fff';c.fillRect(hc.x-hr*.21,hc.y+hr*.52,hr*.42,hr*.06);}
  if(mood==='oops')sweat(c,hc.x+hr*1.1,hc.y-hr*.55,hr,lw);
}
function sweat(c,dx,dy,hr,lw){c.fillStyle='#bfe3ff';c.strokeStyle='#1a1a1a';c.lineWidth=lw*.7;c.beginPath();c.moveTo(dx,dy-hr*.32);c.quadraticCurveTo(dx+hr*.2,dy,dx,dy+hr*.12);c.quadraticCurveTo(dx-hr*.2,dy,dx,dy-hr*.32);c.fill();c.stroke();}
/* Milo: a friendly dinosaur in the blue team shirt, #3 */
function drawDino(c,x,y,R,now,mood){
  const O='#1a1a1a',G='#51cf66',lw=Math.max(2,R*.12);
  c.lineJoin='round';c.lineCap='round';
  c.fillStyle=G;c.strokeStyle=O;c.lineWidth=lw;c.beginPath();c.moveTo(x+R*.6,y-R*.2);c.quadraticCurveTo(x+R*1.9,y-R*.1,x+R*2.1,y-R*.9);c.quadraticCurveTo(x+R*1.6,y+R*.35,x+R*.5,y+R*.4);c.closePath();c.fill();c.stroke();
  for(const s of [-1,1]){c.fillStyle=G;c.beginPath();c.ellipse(x+s*R*.42,y+R*.95,R*.3,R*.42,0,0,6.283);c.fill();c.stroke();}
  c.fillStyle=G;c.beginPath();c.ellipse(x,y+R*.15,R*.85,R*.95,0,0,6.283);c.fill();c.stroke();
  c.fillStyle='#1c7ed6';c.beginPath();c.moveTo(x-R*.8,y-R*.25);c.quadraticCurveTo(x,y-R*.55,x+R*.8,y-R*.25);c.lineTo(x+R*.72,y+R*.55);c.quadraticCurveTo(x,y+R*.8,x-R*.72,y+R*.55);c.closePath();c.fill();c.stroke();
  c.font='700 '+Math.round(R*.6)+'px Fredoka,system-ui,sans-serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=lw*1.2;c.strokeText('3',x,y+R*.15);c.fillStyle='#fff';c.fillText('3',x,y+R*.15);c.textBaseline='alphabetic';
  const up=mood==='cheer';for(const s of [-1,1]){c.strokeStyle=O;c.lineWidth=R*.22+lw*1.4;c.beginPath();c.moveTo(x+s*R*.6,y-R*.05);c.lineTo(x+s*R*.95,up?y-R*.75:y+R*.2);c.stroke();c.strokeStyle=G;c.lineWidth=R*.22;c.stroke();}
  const hc={x:x,y:y-R*1.25},hr=R*.85;
  c.fillStyle='#ff922b';c.strokeStyle=O;c.lineWidth=lw;for(let i=-2;i<=2;i++){const a=-Math.PI/2+i*.42,bx=hc.x+Math.cos(a)*hr*.92,by=hc.y+Math.sin(a)*hr*.92;c.beginPath();c.moveTo(bx-Math.sin(a)*hr*.2,by+Math.cos(a)*hr*.2);c.lineTo(hc.x+Math.cos(a)*hr*1.3,hc.y+Math.sin(a)*hr*1.3);c.lineTo(bx+Math.sin(a)*hr*.2,by-Math.cos(a)*hr*.2);c.closePath();c.fill();c.stroke();}
  c.fillStyle=G;c.beginPath();c.ellipse(hc.x,hc.y,hr,hr*.9,0,0,6.283);c.fill();c.stroke();
  for(const s of [-1,1]){const ex=hc.x+s*hr*.38,ey=hc.y-hr*.08;c.fillStyle='#fff';c.lineWidth=lw*.8;c.beginPath();c.ellipse(ex,ey,hr*.22,hr*.27,0,0,6.283);c.fill();c.stroke();
    c.fillStyle=O;c.beginPath();c.ellipse(ex,ey+hr*.04,hr*.12,hr*.16,0,0,6.283);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(ex-hr*.04,ey-hr*.04,hr*.05,0,6.283);c.fill();}
  c.fillStyle='rgba(255,120,150,.6)';for(const s of [-1,1]){c.beginPath();c.ellipse(hc.x+s*hr*.62,hc.y+hr*.28,hr*.13,hr*.08,0,0,6.283);c.fill();}
  c.strokeStyle=O;c.lineWidth=lw;c.beginPath();if(up){c.fillStyle='#8a1f1f';c.moveTo(hc.x-hr*.3,hc.y+hr*.3);c.quadraticCurveTo(hc.x,hc.y+hr*.75,hc.x+hr*.3,hc.y+hr*.3);c.closePath();c.fill();c.stroke();}
  else{c.arc(hc.x,hc.y+hr*.25,hr*.3,.2,Math.PI-.2);c.stroke();}
  if(mood==='oops')sweat(c,hc.x+hr*1.05,hc.y-hr*.5,hr,lw);
}
/* buddy panel during play: the kid stands out with a gold glow and a name badge */
const bc=$('buddy'),bx=bc.getContext('2d');let bMood='idle',bSince=0,bRaf=0;
function fitBuddy(){const r=bc.getBoundingClientRect(),d=window.devicePixelRatio||1;if(!r.width)return;bc.width=r.width*d;bc.height=r.height*d;}
function buddyMood(m){bMood=m;bSince=performance.now();}
function startBuddy(){fitBuddy();cancelAnimationFrame(bRaf);const loop=now=>{drawBuddy(now);bRaf=requestAnimationFrame(loop);};bRaf=requestAnimationFrame(loop);}
function stopBuddy(){cancelAnimationFrame(bRaf);}
function drawBuddy(now){
  const W=bc.width,Hh=bc.height;if(!W||!cur)return;bx.clearRect(0,0,W,Hh);
  const R=Math.min(W/3.1,Hh/5.4),t=(now-bSince)/1000;let mood=bMood;if(mood!=='idle'&&t>2.2)mood='idle';
  const jump=mood==='cheer'&&!reduceMo?Math.abs(Math.sin(t*7))*R*.5*Math.max(0,1-t/2):0;
  const x=W/2,y=Hh*.72-jump,cy=y-R*.8;
  const g=bx.createRadialGradient(x,cy,R*.3,x,cy,R*2.6);g.addColorStop(0,'rgba(255,212,59,.55)');g.addColorStop(1,'rgba(255,212,59,0)');bx.fillStyle=g;bx.fillRect(0,0,W,Hh);
  bx.fillStyle='rgba(0,0,0,.18)';bx.beginPath();bx.ellipse(x,Hh*.72+R*1.4,R*.9,R*.18,0,0,6.283);bx.fill();
  if(cur.id==='milo')drawDino(bx,x,y,R,now,mood);else drawKid(bx,cur.id,x,y,R,now,mood,cur.num);
  if(mood==='cheer')for(let i=0;i<5;i++){const a=t*3+i*1.256,rr=R*(1.8+.2*Math.sin(t*5+i));bx.font=Math.round(R*.5)+'px system-ui';bx.textAlign='center';bx.fillText('⭐',x+Math.cos(a)*rr,cy+Math.sin(a)*rr*.8);}
  const by=y-R*(cur.id==='milo'?2.7:3.25);bx.font='700 '+Math.round(R*.5)+'px Fredoka,system-ui,sans-serif';bx.textAlign='center';bx.textBaseline='middle';
  const tw=bx.measureText(cur.name).width+R*.6;bx.fillStyle=cur.color;bx.strokeStyle='#fff';bx.lineWidth=R*.08;rrect(bx,x-tw/2,by-R*.36,tw,R*.72,R*.36);bx.fill();bx.stroke();
  bx.fillStyle='#fff';bx.fillText(cur.name,x,by+R*.02);bx.textBaseline='alphabetic';
}

