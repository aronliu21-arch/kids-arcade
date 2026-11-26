function drawPlayer(p,now){
  const bob=(S&&S.type==='call'&&p===S.car&&S.phase==='down')?Math.sin(now/130)*3:0;
  const lifted=!!(dragging&&dragging.p===p),lift=lifted?R*.38+Math.sin(now/90)*R*.06:0;
  const x=p.x,yg=p.y+bob,y=yg-lift,red=p.team==='d',L=lookOf(p),fy=yg+R*1.4;
  const big=p.me?(ROT?1.12:1.25):1;
  if(big!==1){ctx.save();ctx.translate(x,fy);ctx.scale(big,big);ctx.translate(-x,-fy);}
  const meNum=cur?(cur.id==='nora'?9:6):0;
  const team=red?'#e03131':'#1c7ed6',dark=red?'#a51d1d':'#145ea8',shorts=red?'#2b2b2b':'#ffffff';
  // soft shadow (smaller and lighter while lifted), then a team-colored spot on the grass
  ctx.save();ctx.translate(x,fy);ctx.scale(1,.36);
  const sr=R*(lifted?.95:1.15),sg=ctx.createRadialGradient(0,0,0,0,0,sr);
  sg.addColorStop(0,'rgba(0,0,0,'+(lifted?.22:.34)+')');sg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sg;ctx.beginPath();ctx.arc(0,0,sr,0,6.283);ctx.fill();ctx.restore();
  if(!p.me){ctx.fillStyle=red?'rgba(224,49,49,.32)':'rgba(28,126,214,.38)';ctx.beginPath();ctx.ellipse(x,fy,R*.78,R*.27,0,0,6.283);ctx.fill();}
  if(p.me){
    ctx.fillStyle='rgba(255,212,59,.4)';ctx.beginPath();ctx.ellipse(x,fy,R*1.75,R*.78,0,0,6.283);ctx.fill();
    const pu=Math.sin(now/220)*R*.12;
    ctx.strokeStyle='#ffd43b';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,fy,R*1.4+pu,R*.58+pu*.4,0,0,6.283);ctx.stroke();
  }else if((p.drag||p.tap)&&!locked&&!done){
    ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2.5;ctx.setLineDash([6,5]);
    ctx.beginPath();ctx.ellipse(x,fy,R*1.3,R*.5,0,0,6.283);ctx.stroke();ctx.setLineDash([]);
  }
  if(p.me){drawAnimeMe(p,x,y,meNum,now);if(big!==1)ctx.restore();return;}
  for(const s of [-1,1]){
    const lx=x+s*R*.3-R*.15;
    ctx.fillStyle=L.skin;rr(lx,y+R*.65,R*.3,R*.42,R*.1);ctx.fill();
    ctx.fillStyle=team;rr(lx,y+R*.98,R*.3,R*.3,R*.08);ctx.fill();
    ctx.fillStyle='#222';ctx.beginPath();ctx.ellipse(lx+R*.15+s*R*.06,y+R*1.32,R*.25,R*.13,0,0,6.283);ctx.fill();
  }
  ctx.fillStyle=shorts;rr(x-R*.68,y+R*.3,R*1.36,R*.46,R*.14);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.18)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y+R*.5);ctx.lineTo(x,y+R*.76);ctx.stroke();
  ctx.fillStyle=L.skin;
  for(const s of [-1,1]){rr(x+s*R*.92-R*.15,y-R*.15,R*.3,R*.62,R*.14);ctx.fill();}
  if(p.gk){ // goalkeeper: arms up, big gloves
    ctx.strokeStyle=L.skin;ctx.lineWidth=R*.28;ctx.lineCap='round';
    for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(x+s*R*.8,y-R*.45);ctx.lineTo(x+s*R*1.45,y-R*1.25);ctx.stroke();
      ctx.fillStyle='#94d82d';ctx.strokeStyle='#2b2b2b';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x+s*R*1.5,y-R*1.35,R*.27,0,6.283);ctx.fill();ctx.stroke();ctx.strokeStyle=L.skin;ctx.lineWidth=R*.28;}
    ctx.lineCap='butt';
  }
  ctx.fillStyle=team;ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.lineJoin='round';
  ctx.beginPath();
  ctx.moveTo(x-R*.45,y-R*.68);ctx.lineTo(x-R*1.07,y-R*.42);ctx.lineTo(x-R*.9,y-R*.02);ctx.lineTo(x-R*.66,y-R*.12);
  ctx.lineTo(x-R*.66,y+R*.42);ctx.lineTo(x+R*.66,y+R*.42);ctx.lineTo(x+R*.66,y-R*.12);ctx.lineTo(x+R*.9,y-R*.02);
  ctx.lineTo(x+R*1.07,y-R*.42);ctx.lineTo(x+R*.45,y-R*.68);ctx.quadraticCurveTo(x,y-R*.45,x-R*.45,y-R*.68);
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=dark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-R*.4,y-R*.64);ctx.quadraticCurveTo(x,y-R*.4,x+R*.4,y-R*.64);ctx.stroke();
  if(!red&&p.num){
    ctx.fillStyle='#fff';ctx.font='700 '+Math.round(R*.62)+'px Fredoka,system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(String(p.me?meNum:(p.num===meNum?3:p.num)),x,y+R*.05);ctx.textBaseline='alphabetic';
  }
  const hr=R*.62,hx=x,hy=y-R*1.2;
  hairBack(L.style,hx,hy,hr,L.hair);
  ctx.fillStyle=L.skin;rr(x-R*.14,y-R*.8,R*.28,R*.22,R*.06);ctx.fill();
  for(const s of [-1,1]){ctx.beginPath();ctx.arc(hx+s*hr*.98,hy+hr*.15,hr*.2,0,6.283);ctx.fill();}
  ctx.beginPath();ctx.arc(hx,hy,hr,0,6.283);ctx.fill();
  hairFront(L.style,hx,hy,hr,L.hair);
  let gx=0,gy=1;
  if(S&&S.ball){
    const b=S.ball,owner=b.owner===p;
    if(owner&&S.type==='call'&&S.phase==='up'&&S.me){const dx=S.me.x-hx,dy=S.me.y-hy,l=Math.hypot(dx,dy)||1;gx=dx/l;gy=dy/l;}
    else if(!owner){const dx=b.x-hx,dy=b.y-hy,l=Math.hypot(dx,dy)||1;gx=dx/l;gy=dy/l;}
  }
  drawFace(hx,hy,hr,gx,gy,red,!!(cur&&cur.id==='nora'));
  if(p.me){
    ctx.fillStyle='#ffd43b';ctx.strokeStyle='#12301d';ctx.lineWidth=1.5;
    rr(x-R*1.1,y-R*.32,R*.4,R*.18,R*.05);ctx.fill();ctx.stroke();
  }
  if(big!==1)ctx.restore();
}
function drawAnimeMe(p,x,y,num,now){
  const girl=!!(cur&&cur.id==='nora'),O='#1a1a1a',lw=Math.max(2,R*.12),SK='#f6cfae',HR='#1b120c';
  const K=girl?{shirt:'#1c7ed6',trim:'#ffc61a'}:{shirt:'#1c7ed6',trim:'#ffffff'};
  const cap=(a,b,w,c)=>{ctx.lineCap='round';ctx.strokeStyle=O;ctx.lineWidth=w+lw*1.6;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  const poly=(c,pts,r,fill)=>{ctx.beginPath();pts.forEach((q,i)=>{const px=c.x+q[0]*r,py=c.y+q[1]*r;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);});ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.stroke();};
  const hr=R*.8,hc={x:x,y:y-R*1.18};
  const dragged=dragging&&dragging.p===p;
  if(girl){
    const sw=(dragging&&dragging.p===p)?Math.sin(now/180)*hr*.1:0,bx=hc.x+hr*.55,by=hc.y-hr*.82;
    ctx.fillStyle=HR;ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.beginPath();
    ctx.moveTo(bx-hr*.2,by-hr*.05);
    ctx.bezierCurveTo(bx+hr*.9,by-hr*.75,bx+hr*1.8,by-hr*.1+sw,bx+hr*1.55,by+hr*1.25+sw);
    ctx.quadraticCurveTo(bx+hr*1.45,by+hr*1.45+sw,bx+hr*1.3,by+hr*1.3+sw);
    ctx.bezierCurveTo(bx+hr*1.4,by+hr*.55+sw,bx+hr*.9,by+hr*.05,bx+hr*.25,by+hr*.3);
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=lw*.6;ctx.lineCap='round';ctx.beginPath();
    ctx.moveTo(bx+hr*.4,by-hr*.12);ctx.quadraticCurveTo(bx+hr*1.3,by-hr*.1+sw,bx+hr*1.4,by+hr*.9+sw);ctx.stroke();
  }
  for(const s of [-1,1]){
    cap([x+s*R*.3,y+R*.45],[x+s*R*.33,y+R*.95],R*.3,SK);
    cap([x+s*R*.33,y+R*.95],[x+s*R*.34,y+R*1.18],R*.32,K.shirt);
    ctx.fillStyle='#2a2a2a';ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(x+s*R*.4,y+R*1.32,R*.3,R*.15,0,0,6.283);ctx.fill();ctx.stroke();
  }
  ctx.fillStyle='#fff';ctx.strokeStyle=O;ctx.lineWidth=lw;rr(x-R*.7,y+R*.28,R*1.4,R*.5,R*.14);ctx.fill();ctx.stroke();
  for(const s of [-1,1]){
    cap([x+s*R*.8,y-R*.38],[x+s*R*1.08,y+R*.12],R*.27,SK);
    ctx.fillStyle=SK;ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.beginPath();ctx.arc(x+s*R*1.1,y+R*.2,R*.17,0,6.283);ctx.fill();ctx.stroke();
  }
  ctx.fillStyle=K.shirt;ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.beginPath();
  ctx.moveTo(x-R*.45,y-R*.68);ctx.lineTo(x-R*1.07,y-R*.42);ctx.lineTo(x-R*.9,y-R*.02);ctx.lineTo(x-R*.66,y-R*.12);
  ctx.lineTo(x-R*.66,y+R*.42);ctx.lineTo(x+R*.66,y+R*.42);ctx.lineTo(x+R*.66,y-R*.12);ctx.lineTo(x+R*.9,y-R*.02);
  ctx.lineTo(x+R*1.07,y-R*.42);ctx.lineTo(x+R*.45,y-R*.68);ctx.quadraticCurveTo(x,y-R*.45,x-R*.45,y-R*.68);
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=K.trim;ctx.lineWidth=R*.12;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x-R*.38,y-R*.6);ctx.lineTo(x,y-R*.36);ctx.lineTo(x+R*.38,y-R*.6);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-R*1.0,y-R*.28);ctx.lineTo(x-R*.86,y-R*.06);ctx.moveTo(x+R*1.0,y-R*.28);ctx.lineTo(x+R*.86,y-R*.06);ctx.stroke();
  ctx.fillStyle='#ffd43b';ctx.strokeStyle=O;ctx.lineWidth=1.5;rr(x-R*1.12,y-R*.34,R*.4,R*.18,R*.05);ctx.fill();ctx.stroke();
  ctx.font='700 '+Math.round(R*.7)+'px Fredoka,system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=lw*1.4;ctx.strokeStyle=O;ctx.strokeText(String(num),x,y+R*.04);ctx.fillStyle='#fff';ctx.fillText(String(num),x,y+R*.04);ctx.textBaseline='alphabetic';
  for(const s of [-1,1]){ctx.fillStyle=SK;ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(hc.x+s*hr*.98,hc.y+hr*.18,hr*.17,hr*.24,0,0,6.283);ctx.fill();ctx.stroke();}
  ctx.fillStyle=SK;ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(hc.x,hc.y,hr,hr*1.02,0,0,6.283);ctx.fill();ctx.stroke();
  if(girl){
    const hx=hc.x,hy=hc.y,r=hr;
    ctx.fillStyle=HR;ctx.strokeStyle=O;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.beginPath();
    ctx.moveTo(hx-r*.92,hy+r*.55);
    ctx.bezierCurveTo(hx-r*1.18,hy-r*.1,hx-r*1.05,hy-r*1.05,hx,hy-r*1.15);
    ctx.bezierCurveTo(hx+r*1.05,hy-r*1.05,hx+r*1.18,hy-r*.1,hx+r*.92,hy+r*.55);
    ctx.quadraticCurveTo(hx+r*.8,hy+r*.05,hx+r*.78,hy-r*.3);
    ctx.quadraticCurveTo(hx+r*.58,hy-r*.32,hx+r*.44,hy-r*.2);
    ctx.quadraticCurveTo(hx+r*.3,hy-r*.52,hx+r*.05,hy-r*.56);
    ctx.quadraticCurveTo(hx-r*.12,hy-r*.38,hx-r*.3,hy-r*.26);
    ctx.quadraticCurveTo(hx-r*.45,hy-r*.46,hx-r*.78,hy-r*.3);
    ctx.quadraticCurveTo(hx-r*.8,hy+r*.05,hx-r*.92,hy+r*.55);
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=lw*1.1;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(hx-r*.05,hy-r*.35,r*.62,Math.PI*1.18,Math.PI*1.42);ctx.stroke();
    ctx.beginPath();ctx.arc(hx-r*.05,hy-r*.35,r*.62,Math.PI*1.5,Math.PI*1.6);ctx.stroke();
    ctx.fillStyle='#ff6b9d';ctx.strokeStyle=O;ctx.lineWidth=lw*.8;ctx.beginPath();ctx.ellipse(hx+r*.6,hy-r*.86,r*.21,r*.15,-.5,0,6.283);ctx.fill();ctx.stroke();
    const sx=hx-r*.52,sy=hy-r*.72,sr=r*.25;ctx.beginPath();
    for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?sr*.45:sr;ctx.lineTo(sx+Math.cos(a)*q,sy+Math.sin(a)*q);}
    ctx.closePath();ctx.fillStyle='#ffc61a';ctx.fill();ctx.strokeStyle=O;ctx.lineWidth=lw*.6;ctx.stroke();
  }else{
    poly(hc,[[1.02,0],[1.3,-.45],[.86,-.55],[1.02,-1.08],[.46,-.9],[.36,-1.55],[0,-.98],[-.36,-1.55],[-.46,-.9],[-1.02,-1.08],[-.86,-.55],[-1.3,-.45],[-1.02,0],[-.78,-.32],[-.56,-.12],[-.36,-.46],[-.12,-.18],[.1,-.48],[.34,-.16],[.56,-.46],[.78,-.32]],hr,HR);
  }
  let gx=0,gy=.3;
  if(S&&S.ball){const b=S.ball;if(b.owner!==p){const dx=b.x-hc.x,dy=b.y-hc.y,l=Math.hypot(dx,dy)||1;gx=dx/l;gy=dy/l;}else gy=1;}
  for(const s of [-1,1]){
    const ex=hc.x+s*hr*.36,ey=hc.y+hr*.14;
    const ew=girl?.23:.21,eh=girl?.31:.29;
    ctx.fillStyle='#fff';ctx.strokeStyle=O;ctx.lineWidth=lw*.9;ctx.beginPath();ctx.ellipse(ex,ey,hr*ew,hr*eh,0,0,6.283);ctx.fill();ctx.stroke();
    const px=ex+gx*hr*.07,py=ey+gy*hr*.09;
    if(girl){ctx.fillStyle='#7a4a24';ctx.beginPath();ctx.ellipse(px,py,hr*.15,hr*.21,0,0,6.283);ctx.fill();}
    ctx.fillStyle=O;ctx.beginPath();ctx.ellipse(px,py,hr*(girl?.08:.11),hr*(girl?.12:.17),0,0,6.283);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(px-hr*.05,py-hr*.08,hr*(girl?.06:.045),0,6.283);ctx.fill();
    if(girl){
      ctx.beginPath();ctx.arc(px+hr*.05,py+hr*.07,hr*.03,0,6.283);ctx.fill();
      ctx.strokeStyle=O;ctx.lineWidth=lw*1.5;ctx.lineCap='round';ctx.beginPath();ctx.ellipse(ex,ey,hr*ew,hr*eh,0,Math.PI*1.1,Math.PI*1.9);ctx.stroke();
      ctx.lineWidth=lw*.9;ctx.beginPath();ctx.moveTo(ex+s*hr*.2,ey-hr*.2);ctx.lineTo(ex+s*hr*.36,ey-hr*.3);ctx.stroke();
    }
    const oy=girl?-.38:-.3,iy=girl?-.3:-.05,th=girl?.07:.1;
    ctx.fillStyle=O;ctx.beginPath();
    ctx.moveTo(hc.x+s*hr*.62,hc.y+hr*oy);ctx.lineTo(hc.x+s*hr*.14,hc.y+hr*iy);ctx.lineTo(hc.x+s*hr*.14,hc.y+hr*(iy+th));ctx.lineTo(hc.x+s*hr*.6,hc.y+hr*(oy+th+.01));ctx.closePath();ctx.fill();
  }
  if(girl){ctx.strokeStyle='rgba(255,90,120,.8)';ctx.lineWidth=Math.max(1.2,lw*.6);for(const s of [-1,1])for(let j=0;j<3;j++){ctx.beginPath();ctx.moveTo(hc.x+s*hr*(.5+j*.1),hc.y+hr*.46);ctx.lineTo(hc.x+s*hr*(.45+j*.1),hc.y+hr*.58);ctx.stroke();}}
  ctx.fillStyle='#8a1f1f';ctx.strokeStyle=O;ctx.lineWidth=lw*.8;ctx.beginPath();
  if(girl){
    ctx.moveTo(hc.x-hr*.2,hc.y+hr*.5);ctx.lineTo(hc.x+hr*.2,hc.y+hr*.5);
    ctx.quadraticCurveTo(hc.x+hr*.17,hc.y+hr*.76,hc.x,hc.y+hr*.76);ctx.quadraticCurveTo(hc.x-hr*.17,hc.y+hr*.76,hc.x-hr*.2,hc.y+hr*.5);
    ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ff8fa3';ctx.beginPath();ctx.ellipse(hc.x,hc.y+hr*.68,hr*.1,hr*.055,0,0,6.283);ctx.fill();
    ctx.fillStyle='#fff';ctx.fillRect(hc.x-hr*.17,hc.y+hr*.52,hr*.34,hr*.05);
  }else{
  ctx.moveTo(hc.x-hr*.24,hc.y+hr*.5);ctx.lineTo(hc.x+hr*.24,hc.y+hr*.5);ctx.lineTo(hc.x+hr*.14,hc.y+hr*.68);ctx.lineTo(hc.x-hr*.14,hc.y+hr*.68);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#fff';ctx.fillRect(hc.x-hr*.21,hc.y+hr*.52,hr*.42,hr*.06);
  }
  if(dragged){
    const dx=hc.x+hr*1.1,dy=hc.y-hr*.55;
    ctx.fillStyle='#bfe3ff';ctx.strokeStyle=O;ctx.lineWidth=lw*.7;ctx.beginPath();ctx.moveTo(dx,dy-hr*.32);
    ctx.quadraticCurveTo(dx+hr*.2,dy,dx,dy+hr*.12);ctx.quadraticCurveTo(dx-hr*.2,dy,dx,dy-hr*.32);ctx.fill();ctx.stroke();
  }
}
