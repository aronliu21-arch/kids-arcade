
/* ---------- opening scene: Nora and Lucas race to a giant clock, the hands land on the real time, Milo pops up ---------- */
const ic=$('intro'),ix=ic.getContext('2d'),IW=800,IH=300,OUT='#1a1a1a';
const reduceMo=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const IT={state:'wait',t0:0,parts:[],stars:Array.from({length:40},()=>({x:Math.random()*IW,y:Math.random()*200,r:Math.random()*1.6+.4}))};
const RUNNERS=[
  {name:'Nora',num:9,s:.9,gy:282,x0:-120,x1:215,flip:false,girl:true,look:{skin:'#f6cfae',hair:'#1b120c',style:'pony'},kit:{shirt:'#ffc61a',trim:'#1c4fd6',shorts:'#1c4fd6',socks:'#ffc61a',num:'#1c4fd6'}},
  {name:'Lucas',num:6,s:.82,gy:282,x0:920,x1:585,flip:true,girl:false,look:{skin:'#f6cfae',hair:'#1b120c',style:'spiky'},kit:{shirt:'#1c7ed6',trim:'#ffffff',shorts:'#ffffff',socks:'#1c7ed6',num:'#ffffff'}}
];
function runA(ph){const sa=Math.sin(ph),sb=Math.sin(ph+Math.PI);return{tA:sa*.9,kA:.2+Math.max(0,Math.cos(ph))*1.5,tB:sb*.9,kB:.2+Math.max(0,Math.cos(ph+Math.PI))*1.5,aA:-sa*1.0,aB:-sb*1.0,lean:.24,bob:Math.abs(Math.sin(ph))*5};}
const CHEER={tA:.15,kA:.1,tB:-.15,kB:.1,aA:2.7,aB:-2.5,lean:-.05,bob:0};
function lerpA(a,b,u){const o={};for(const k in a)o[k]=a[k]+(b[k]-a[k])*u;return o;}
function limb(a,b,w,c){ix.strokeStyle=c;ix.lineWidth=w;ix.lineCap='round';ix.beginPath();ix.moveTo(a.x,a.y);ix.lineTo(b.x,b.y);ix.stroke();}
function limbO(a,b,w,c,s){limb(a,b,w+3.6*s,OUT);limb(a,b,w,c);}
function polyR(c,pts,r){ix.beginPath();pts.forEach((q,i)=>{const x=c.x+q[0]*r,y=c.y+q[1]*r;if(i)ix.lineTo(x,y);else ix.moveTo(x,y);});ix.closePath();}
const HAIR_SPIKY=[[.95,-.08],[.7,-.42],[1.18,-.72],[.45,-.82],[.6,-1.55],[-.05,-1.02],[-.55,-1.62],[-.6,-.9],[-1.4,-1.12],[-1.0,-.42],[-1.6,-.25],[-.98,.12],[-.72,.55],[-.22,-.22],[.35,-.38]];
const HAIR_GIRL=[[.95,-.02],[.66,-.36],[.9,-.5],[.38,-.56],[.58,-.78],[.2,-.68],[.38,-1.02],[0,-1.12],[-.5,-1.05],[-.92,-.76],[-1.12,-.3],[-1.02,.25],[-.76,.6],[-.24,-.2],[.3,-.36]];
function drawRunner(k,x,A,ph,yell,run){
  const s=k.s,gy=k.gy,L=k.look,K=k.kit;
  ix.save();ix.translate(x,0);if(k.flip)ix.scale(-1,1);
  ix.fillStyle='rgba(0,0,0,.3)';ix.beginPath();ix.ellipse(0,gy+2*s,32*s,7*s,0,0,6.283);ix.fill();
  if(run){ix.strokeStyle='rgba(255,255,255,.6)';ix.lineCap='round';for(let j=0;j<4;j++){const yy=gy-(28+j*20)*s;ix.lineWidth=3;ix.beginPath();ix.moveTo(-(38+j*5)*s,yy);ix.lineTo(-(96+j*16)*s,yy);ix.stroke();}}
  const hip={x:0,y:gy-46*s-A.bob*s},u={x:Math.sin(A.lean),y:-Math.cos(A.lean)},pp={x:Math.cos(A.lean),y:Math.sin(A.lean)},sh={x:hip.x+u.x*30*s,y:hip.y+u.y*30*s};
  const leg=(t,kk)=>{const kn={x:hip.x+Math.sin(t)*23*s,y:hip.y+Math.cos(t)*23*s},sa=t-kk,ft={x:kn.x+Math.sin(sa)*22*s,y:kn.y+Math.cos(sa)*22*s};
    limbO(hip,kn,11*s,L.skin,s);limbO(kn,ft,9.5*s,L.skin,s);limbO({x:(kn.x+ft.x)/2,y:(kn.y+ft.y)/2},ft,10.5*s,K.socks,s);
    const fw={x:Math.cos(sa),y:-Math.sin(sa)};ix.fillStyle='#2a2a2a';ix.strokeStyle=OUT;ix.lineWidth=2.5*s;ix.beginPath();ix.ellipse(ft.x+fw.x*6*s,ft.y+fw.y*6*s,10*s,5.5*s,Math.atan2(fw.y,fw.x),0,6.283);ix.fill();ix.stroke();};
  const arm=a=>{const el={x:sh.x+Math.sin(a)*15*s,y:sh.y+Math.cos(a)*15*s},fa=a+.9,hd={x:el.x+Math.sin(fa)*13*s,y:el.y+Math.cos(fa)*13*s};
    limbO(sh,el,8*s,L.skin,s);limbO(el,hd,7.5*s,L.skin,s);limbO(sh,{x:sh.x+(el.x-sh.x)*.55,y:sh.y+(el.y-sh.y)*.55},11*s,K.trim,s);
    ix.fillStyle=L.skin;ix.strokeStyle=OUT;ix.lineWidth=2.5*s;ix.beginPath();ix.arc(hd.x,hd.y,5.2*s,0,6.283);ix.fill();ix.stroke();};
  arm(A.aB);leg(A.tB,A.kB);leg(A.tA,A.kA);
  ix.fillStyle=K.shorts;ix.strokeStyle=OUT;ix.lineWidth=2.8*s;rrect(ix,hip.x-14*s,hip.y-8*s,28*s,18*s,5*s);ix.fill();ix.stroke();
  const r=20*s,hc={x:sh.x+u.x*20*s,y:sh.y+u.y*20*s};limbO(sh,hc,8*s,L.skin,s);
  ix.fillStyle=K.shirt;ix.strokeStyle=OUT;ix.lineWidth=3*s;ix.lineJoin='round';ix.beginPath();
  ix.moveTo(hip.x-pp.x*13*s,hip.y-pp.y*13*s);ix.lineTo(hip.x+pp.x*13*s,hip.y+pp.y*13*s);ix.lineTo(sh.x+pp.x*14*s,sh.y+pp.y*14*s);ix.lineTo(sh.x-pp.x*14*s,sh.y-pp.y*14*s);ix.closePath();ix.fill();ix.stroke();
  limb({x:sh.x-pp.x*6*s,y:sh.y-pp.y*6*s},{x:sh.x+pp.x*6*s,y:sh.y+pp.y*6*s},4*s,K.trim);
  ix.save();ix.translate((hip.x+sh.x)/2,(hip.y+sh.y)/2+2*s);if(k.flip)ix.scale(-1,1);ix.font='700 '+Math.round(17*s)+'px Fredoka,system-ui,sans-serif';ix.textAlign='center';ix.textBaseline='middle';
  ix.lineWidth=3*s;ix.strokeStyle=OUT;ix.strokeText(String(k.num),0,0);ix.fillStyle=K.num;ix.fillText(String(k.num),0,0);ix.restore();ix.textBaseline='alphabetic';
  arm(A.aA);
  ix.strokeStyle=OUT;ix.lineWidth=2.8*s;ix.lineJoin='round';
  if(L.style==='pony'){const w=run?Math.sin(ph*2)*.25:0;ix.fillStyle=L.hair;ix.beginPath();ix.moveTo(hc.x-r*.55,hc.y-r*.8);ix.quadraticCurveTo(hc.x-r*1.9,hc.y-r*(1.0+w),hc.x-r*2.25,hc.y+r*(.15+w));ix.quadraticCurveTo(hc.x-r*1.55,hc.y-r*.05,hc.x-r*.9,hc.y-r*.05);ix.closePath();ix.fill();ix.stroke();}
  ix.fillStyle=L.skin;ix.beginPath();ix.ellipse(hc.x,hc.y,r,r*1.04,0,0,6.283);ix.fill();ix.stroke();
  ix.fillStyle=L.hair;polyR(hc,L.style==='spiky'?HAIR_SPIKY:HAIR_GIRL,r);ix.fill();ix.stroke();
  if(L.style==='pony'){ix.fillStyle='#ff6b9d';ix.beginPath();ix.arc(hc.x-r*.78,hc.y-r*.5,r*.18,0,6.283);ix.fill();ix.stroke();}
  ix.fillStyle=L.skin;ix.lineWidth=2*s;ix.beginPath();ix.ellipse(hc.x-r*.18,hc.y+r*.16,r*.17,r*.22,0,0,6.283);ix.fill();ix.stroke();
  ix.beginPath();ix.moveTo(hc.x+r*.93,hc.y+r*.02);ix.lineTo(hc.x+r*1.08,hc.y+r*.22);ix.lineTo(hc.x+r*.9,hc.y+r*.27);ix.fill();ix.stroke();
  ix.fillStyle='#fff';ix.lineWidth=2.2*s;ix.beginPath();ix.ellipse(hc.x+r*.5,hc.y-r*.03,r*.2,r*.27,0,0,6.283);ix.fill();ix.stroke();
  ix.fillStyle='#1a1a1a';ix.beginPath();ix.ellipse(hc.x+r*.6,hc.y+r*.02,r*.09,r*.15,0,0,6.283);ix.fill();ix.fillStyle='#fff';ix.beginPath();ix.arc(hc.x+r*.57,hc.y-r*.06,r*.035,0,6.283);ix.fill();
  if(k.girl){limb({x:hc.x+r*.62,y:hc.y-r*.27},{x:hc.x+r*.8,y:hc.y-r*.4},r*.08,OUT);limb({x:hc.x+r*.68,y:hc.y-r*.18},{x:hc.x+r*.86,y:hc.y-r*.27},r*.07,OUT);}
  const bt=k.girl?.12:.2;ix.fillStyle=OUT;ix.beginPath();ix.moveTo(hc.x+r*.22,hc.y-r*(.45-bt*.2));ix.lineTo(hc.x+r*.8,hc.y-r*(.3-bt));ix.lineTo(hc.x+r*.8,hc.y-r*(.2-bt));ix.lineTo(hc.x+r*.24,hc.y-r*.33);ix.closePath();ix.fill();
  if(k.girl){ix.strokeStyle='rgba(255,90,120,.75)';ix.lineWidth=1.6*s;for(let j=0;j<3;j++){ix.beginPath();ix.moveTo(hc.x+r*(.28+j*.12),hc.y+r*.36);ix.lineTo(hc.x+r*(.22+j*.12),hc.y+r*.48);ix.stroke();}}
  ix.strokeStyle=OUT;ix.lineWidth=2.2*s;const mo=.08+.3*yell;ix.fillStyle='#8a1f1f';ix.beginPath();
  ix.moveTo(hc.x+r*.48,hc.y+r*.5);ix.lineTo(hc.x+r*.88,hc.y+r*.44);ix.lineTo(hc.x+r*.86,hc.y+r*(.46+mo));ix.lineTo(hc.x+r*.56,hc.y+r*(.52+mo*.8));ix.closePath();ix.fill();ix.stroke();
  ix.fillStyle='#fff';ix.beginPath();ix.moveTo(hc.x+r*.5,hc.y+r*.51);ix.lineTo(hc.x+r*.87,hc.y+r*.45);ix.lineTo(hc.x+r*.87,hc.y+r*(.45+mo*.35));ix.lineTo(hc.x+r*.53,hc.y+r*(.51+mo*.3));ix.closePath();ix.fill();
  if(run){const dx=hc.x-r*1.05,dy=hc.y-r*.85+Math.sin(ph)*2;ix.fillStyle='#bfe3ff';ix.lineWidth=2*s;ix.beginPath();ix.moveTo(dx,dy-r*.32);ix.quadraticCurveTo(dx+r*.2,dy,dx,dy+r*.12);ix.quadraticCurveTo(dx-r*.2,dy,dx,dy-r*.32);ix.fill();ix.stroke();}
  ix.restore();
}
function fitIntro(){
  const hero=ic.parentElement,w=Math.min(hero.clientWidth-8,880),maxH=Math.max(120,window.innerHeight*.36),s=Math.min(w/IW,maxH/IH),d=window.devicePixelRatio||1;
  ic.style.width=IW*s+'px';ic.style.height=IH*s+'px';ic.width=IW*s*d;ic.height=IH*s*d;
}
function introClock(now,t,landT,bigT){
  const cx=400,cy=128,R=92;
  ix.fillStyle='#fffaf0';ix.strokeStyle=OUT;ix.lineWidth=7;ix.beginPath();ix.arc(cx,cy,R,0,6.283);ix.fill();ix.stroke();
  ix.fillStyle='#e03131';ix.beginPath();ix.arc(cx,cy-R-10,14,0,6.283);ix.fill();ix.stroke(); // bell
  ix.textAlign='center';ix.textBaseline='middle';ix.fillStyle=OUT;ix.font='700 19px Fredoka,system-ui,sans-serif';
  for(let i=1;i<=12;i++){const a=i/12*6.283;ix.fillText(i,cx+Math.sin(a)*R*.76,cy-Math.cos(a)*R*.76);}ix.textBaseline='alphabetic';
  const real=new Date(),target=(real.getHours()%12)*60+real.getMinutes();
  let tm=target;if(t<landT){const u=t/landT,e=1-Math.pow(1-u,3);tm=target-(1-e)*720*3;}
  const ma=(tm%60)/60*6.283,ha=(tm%720)/720*6.283;
  const hand=(a,len,w,col)=>{ix.lineCap='round';ix.strokeStyle=OUT;ix.lineWidth=w+5;ix.beginPath();ix.moveTo(cx,cy);ix.lineTo(cx+Math.sin(a)*len,cy-Math.cos(a)*len);ix.stroke();ix.strokeStyle=col;ix.lineWidth=w;ix.stroke();};
  hand(ha,R*.48,9,'#e03131');hand(ma,R*.74,6,'#1c7ed6');ix.fillStyle=OUT;ix.beginPath();ix.arc(cx,cy,7,0,6.283);ix.fill();
  if(t>=landT){const h=real.getHours()%12||12;introPill("It's "+h+':'+pad(real.getMinutes())+'!',cx-110,cy+R+30,'#ffd43b','#1a1a1a',22);}
}
function introPill(t,x,y,bg,fg,size){ix.font='700 '+size+'px Fredoka,system-ui,sans-serif';ix.textAlign='center';ix.textBaseline='middle';const w=ix.measureText(t).width+size*1.2;
  ix.fillStyle=bg;ix.strokeStyle=OUT;ix.lineWidth=3;rrect(ix,x-w/2,y-size*.8,w,size*1.6,size*.8);ix.fill();ix.stroke();ix.fillStyle=fg;ix.fillText(t,x,y+1);ix.textBaseline='alphabetic';}
function introFrame(now){
  requestAnimationFrame(introFrame);
  if($('home').hidden)return;
  const sc=ic.width/IW;ix.setTransform(sc,0,0,sc,0,0);
  const RUN=1.7,LAND=2.4;let t=IT.state==='wait'?0:(now-IT.t0)/1000;if(IT.state==='done')t=99;
  const g=ix.createLinearGradient(0,0,0,IH);g.addColorStop(0,'#141a45');g.addColorStop(1,'#2b2f7a');ix.fillStyle=g;ix.fillRect(0,0,IW,IH);
  const burst=t>=LAND?Math.min(1,(t-LAND)*2):0;
  if(burst>0){ix.save();ix.translate(400,128);ix.rotate(reduceMo?0:now/5000);ix.fillStyle='rgba(255,236,150,'+(.2*burst)+')';for(let i=0;i<18;i++){ix.beginPath();ix.moveTo(0,0);ix.arc(0,0,700,i*Math.PI/9,i*Math.PI/9+Math.PI/18);ix.closePath();ix.fill();}ix.restore();}
  ix.fillStyle='#fff';IT.stars.forEach((s,i)=>{ix.globalAlpha=.5+.5*Math.sin(now/600+i);ix.beginPath();ix.arc(s.x,s.y,s.r,0,6.283);ix.fill();});ix.globalAlpha=1;
  ix.fillStyle='#fff3bf';ix.beginPath();ix.arc(700,52,26,0,6.283);ix.fill();ix.fillStyle='#141a45';ix.beginPath();ix.arc(712,46,22,0,6.283);ix.fill();
  // lantern string
  ix.strokeStyle='rgba(255,255,255,.5)';ix.lineWidth=2;ix.beginPath();ix.moveTo(0,20);ix.quadraticCurveTo(160,60,300,24);ix.moveTo(500,24);ix.quadraticCurveTo(640,62,800,20);ix.stroke();
  [[60,32],[130,44],[200,40],[600,40],[670,44],[740,32]].forEach(([x,y],i)=>{const sw=reduceMo?0:Math.sin(now/700+i)*3;ix.fillStyle='#e03131';ix.strokeStyle=OUT;ix.lineWidth=2;ix.beginPath();ix.ellipse(x+sw,y+12,11,14,0,0,6.283);ix.fill();ix.stroke();ix.fillStyle='#ffd43b';ix.fillRect(x+sw-6,y-3,12,4);ix.fillRect(x+sw-6,y+25,12,4);});
  ix.fillStyle='#0d1130';ix.fillRect(0,284,IW,16);ix.strokeStyle='rgba(255,255,255,.5)';ix.lineWidth=2;ix.beginPath();ix.moveTo(0,284);ix.lineTo(IW,284);ix.stroke();
  introClock(now,t,LAND,burst);
  RUNNERS.forEach((k,i)=>{const u=Math.min(1,t/RUN),e=1-Math.pow(1-u,2),x=k.x0+(k.x1-k.x0)*e,ph=now/1000*2*Math.PI*2.4+i*1.4;
    const running=IT.state==='run'&&u<1;const A=running?runA(ph):lerpA(runA(1),CHEER,Math.min(1,(t-RUN)*3));
    if(IT.state==='wait')drawRunner(k,k.x1,lerpA(runA(1),CHEER,0),0,0,false);else drawRunner(k,x,A,ph,t>=LAND?1:running?.4:0,running);});
  // Milo pops up
  if(t>=LAND){const u=Math.min(1,(t-LAND)*2.5),y=330-u*70+(reduceMo?0:Math.sin(now/300)*3);ix.save();ix.beginPath();ix.rect(0,0,IW,284);ix.clip();drawDino(ix,470,y,24,now,'cheer');ix.restore();
    if(u>=1&&!IT.fanfare){IT.fanfare=1;musicFanfare();for(let j=0;j<60;j++)IT.parts.push({x:400,y:128,vx:rnd(-4,4),vy:rnd(-5,1),c:pick(['#ffd43b','#ff6b6b','#74c0fc','#b197fc','#69db7c']),life:1});}}
  IT.parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.life-=.012;ix.globalAlpha=Math.max(0,p.life);ix.fillStyle=p.c;ix.fillRect(p.x,p.y,5,5);});ix.globalAlpha=1;IT.parts=IT.parts.filter(p=>p.life>0);
  if(t>=LAND+.8){introPill('TIME TO PLAY!',400,24,'#e03131','#fff',20);if(IT.state==='run')IT.state='done';}
  if(IT.state==='wait')introPill('▶ Tap to start',400,250,'#ffd43b','#1a1a1a',24);
}
ic.addEventListener('click',()=>{
  if(IT.state==='wait'){MUS.armed=true;audio();musicSync();if(reduceMo){IT.state='done';IT.fanfare=0;}else{IT.state='run';IT.t0=performance.now();IT.fanfare=0;}musicHit();}
  else if(IT.state==='run'){IT.state='done';}
  else{IT.state='run';IT.t0=performance.now();IT.fanfare=0;}
});

