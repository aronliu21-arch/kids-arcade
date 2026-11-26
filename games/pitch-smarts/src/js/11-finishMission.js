/* ---------- finish ---------- */
function finishMission(){
  S=null;
  const max=list.length*2,pct=pts/max;
  const stars=pct>=.8?3:pct>=.55?2:pct>=.3?1:0;
  const p=prof(cur.id),old=p.stars[M.id]||0;
  if(stars>old)p.stars[M.id]=stars;
  store.save();
  $('rStars').textContent=starStr(stars);
  $('rTitle').textContent=["Keep practicing!","Good start!","Great teamwork!","Superstar!"][stars];
  $('rSub').textContent=pts+' of '+max+' points'+(stars>old&&old>0?' · new best!':'');
  $('rTip').textContent=pr(PRACTICE[M.id]);
  const nm=MISSIONS[(MISSIONS.indexOf(M)+1)%MISSIONS.length];
  $('nextMission').textContent='Next: '+nm.em+' '+nm.title+' ▶';
  $('nextMission').onclick=()=>{audio();sfx.tap();startMission(nm);};
  streaks[cur.id]=(streaks[cur.id]||0)+1;
  const brk=streaks[cur.id]>=3;
  $('breakCard').hidden=!brk;$('breakRow').hidden=!brk;$('goRow').hidden=brk;$('moreRow').hidden=brk;
  show('result');
  if(stars>=2)sfx.star();
  say(brk?"Great practice! Time for a break.":["Keep practicing!","Good start!","Great teamwork!","Superstar!"][stars]);
}
const streaks={};
$('endBreak').onclick=()=>{if(cur)streaks[cur.id]=0;audio();sfx.tap();renderHome();};
$('replay').onclick=()=>startMission(M);
$('toMap').onclick=()=>renderMap();

/* ---------- reset records (parent gate) ---------- */
let gateAns=0;
function newGate(){const a=rint(112,389),b=rint(13,29);gateAns=a*b;$('gateQ').textContent=' To reset records, answer: what is '+a+' × '+b+'?';$('gateA').value='';}
$('resetBtn').onclick=()=>{audio();newGate();$('gateErr').textContent='';$('resetStep1').hidden=false;$('resetStep2').hidden=true;$('resetBox').hidden=false;$('gateA').focus();};
$('gateGo').onclick=()=>{
  const v=parseInt(String($('gateA').value).replace(/[^0-9]/g,''),10);
  if(isNaN(v)){$('gateErr').textContent='Enter the answer first.';return;}
  if(v!==gateAns){newGate();$('gateErr').textContent='That’s not right. Here’s a new one.';return;}
  $('resetStep1').hidden=true;$('resetStep2').hidden=false;$('rsNora').checked=false;$('rsLucas').checked=false;$('rsErr').textContent='';
};
$('gateA').addEventListener('input',()=>{$('gateErr').textContent='';});
$('gateA').addEventListener('keydown',e=>{if(e.key==='Enter')$('gateGo').click();});
$('gateCancel').onclick=()=>{$('resetBox').hidden=true;};
$('rsCancel').onclick=()=>{$('resetBox').hidden=true;};
$('rsGo').onclick=()=>{
  const ids=[];if($('rsNora').checked)ids.push('nora');if($('rsLucas').checked)ids.push('lucas');
  if(!ids.length){$('rsErr').textContent='Pick at least one kid.';return;}
  ids.forEach(id=>{DB.p[id]={stars:{},seen:[],voice:id==='lucas',rev:Date.now()};streaks[id]=0;});
  store.save();renderHome();
};

/* ---------- intro animation: bold retro sports-anime style ---------- */
const ic=$('intro'),ix=ic.getContext('2d'),IW=800,IH=300;
const reduceMo=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const IT={T:2.3,t0:performance.now(),state:'wait',kick:0,goal:0,parts:[],winner:1};
if(reduceMo){IT.t0=performance.now()-3000;IT.state='ready';}
const OUT='#1a1a1a';
const KIDS=[
  {name:'Nora',num:9,s:1,gy:262,x0:-130,x1:334,flip:false,ph0:0,girl:true,
   look:{skin:'#f6cfae',hair:'#1b120c',style:'pony'},kit:{shirt:'#ffc61a',trim:'#1c4fd6',shorts:'#1c4fd6',socks:'#ffc61a',num:'#1c4fd6'}},
  {name:'Lucas',num:6,s:.9,gy:262,x0:940,x1:468,flip:true,ph0:1.4,girl:false,
   look:{skin:'#f6cfae',hair:'#1b120c',style:'spiky'},kit:{shirt:'#1c7ed6',trim:'#ffffff',shorts:'#ffffff',socks:'#1c7ed6',num:'#ffffff'}}
];
const KICK={tA:-.85,kA:1.85,tB:.14,kB:.25,aA:1.4,aB:-1.05,lean:-.08,bob:0};
const FOLLOW={tA:1.35,kA:.15,tB:.02,kB:.2,aA:-1.15,aB:1.35,lean:-.2,bob:-2};
const WHIFF={tA:.35,kA:.5,tB:-.15,kB:.35,aA:-1.7,aB:1.7,lean:-.32,bob:0};
const GAIT=2*Math.PI*2.4;
function runA(ph){
  const sa=Math.sin(ph),sb=Math.sin(ph+Math.PI);
  return{tA:sa*.9,kA:.2+Math.max(0,Math.cos(ph))*1.5,tB:sb*.9,kB:.2+Math.max(0,Math.cos(ph+Math.PI))*1.5,aA:-sa*1.0,aB:-sb*1.0,lean:.24,bob:Math.abs(Math.sin(ph))*5};
}
function lerpA(a,b,u){const o={};for(const k in a)o[k]=a[k]+(b[k]-a[k])*u;return o;}
function limb(a,b,w,c){ix.strokeStyle=c;ix.lineWidth=w;ix.lineCap='round';ix.beginPath();ix.moveTo(a.x,a.y);ix.lineTo(b.x,b.y);ix.stroke();}
function limbO(a,b,w,c,s){limb(a,b,w+3.6*s,OUT);limb(a,b,w,c);}
function polyR(c,pts,r){ix.beginPath();pts.forEach((q,i)=>{const x=c.x+q[0]*r,y=c.y+q[1]*r;if(i)ix.lineTo(x,y);else ix.moveTo(x,y);});ix.closePath();}
const HAIR_SPIKY=[[.95,-.08],[.7,-.42],[1.18,-.72],[.45,-.82],[.6,-1.55],[-.05,-1.02],[-.55,-1.62],[-.6,-.9],[-1.4,-1.12],[-1.0,-.42],[-1.6,-.25],[-.98,.12],[-.72,.55],[-.22,-.22],[.35,-.38]];
const HAIR_GIRL=[[.95,-.02],[.66,-.36],[.9,-.5],[.38,-.56],[.58,-.78],[.2,-.68],[.38,-1.02],[0,-1.12],[-.5,-1.05],[-.92,-.76],[-1.12,-.3],[-1.02,.25],[-.76,.6],[-.24,-.2],[.3,-.36]];
function drawRunner(k,x,A,ph,yell,run){
  const s=k.s,gy=k.gy,L=k.look,K=k.kit;
  ix.save();ix.translate(x,0);if(k.flip)ix.scale(-1,1);
  ix.fillStyle='rgba(0,0,0,.25)';ix.beginPath();ix.ellipse(0,gy+2*s,32*s,7*s,0,0,6.283);ix.fill();
  if(run){
    ix.strokeStyle='rgba(255,255,255,.7)';ix.lineCap='round';
    for(let j=0;j<4;j++){const yy=gy-(28+j*20)*s;ix.lineWidth=3;ix.beginPath();ix.moveTo(-(38+j*5)*s,yy);ix.lineTo(-(96+j*16)*s,yy);ix.stroke();}
  }
  const hip={x:0,y:gy-46*s-A.bob*s};
  const u={x:Math.sin(A.lean),y:-Math.cos(A.lean)},pp={x:Math.cos(A.lean),y:Math.sin(A.lean)};
  const sh={x:hip.x+u.x*30*s,y:hip.y+u.y*30*s};
  const leg=(t,kk)=>{
    const kn={x:hip.x+Math.sin(t)*23*s,y:hip.y+Math.cos(t)*23*s},sa=t-kk;
    const ft={x:kn.x+Math.sin(sa)*22*s,y:kn.y+Math.cos(sa)*22*s};
    limbO(hip,kn,11*s,L.skin,s);limbO(kn,ft,9.5*s,L.skin,s);
    limbO({x:(kn.x+ft.x)/2,y:(kn.y+ft.y)/2},ft,10.5*s,K.socks,s);
    const fw={x:Math.cos(sa),y:-Math.sin(sa)};
    ix.fillStyle='#2a2a2a';ix.strokeStyle=OUT;ix.lineWidth=2.5*s;ix.beginPath();
    ix.ellipse(ft.x+fw.x*6*s,ft.y+fw.y*6*s,10*s,5.5*s,Math.atan2(fw.y,fw.x),0,6.283);ix.fill();ix.stroke();
  };
  const arm=a=>{
    const el={x:sh.x+Math.sin(a)*15*s,y:sh.y+Math.cos(a)*15*s},fa=a+.9;
    const hd={x:el.x+Math.sin(fa)*13*s,y:el.y+Math.cos(fa)*13*s};
    limbO(sh,el,8*s,L.skin,s);limbO(el,hd,7.5*s,L.skin,s);
    limbO(sh,{x:sh.x+(el.x-sh.x)*.55,y:sh.y+(el.y-sh.y)*.55},11*s,K.trim,s);
    ix.fillStyle=L.skin;ix.strokeStyle=OUT;ix.lineWidth=2.5*s;ix.beginPath();ix.arc(hd.x,hd.y,5.2*s,0,6.283);ix.fill();ix.stroke();
  };
  arm(A.aB);leg(A.tB,A.kB);leg(A.tA,A.kA);
  ix.fillStyle=K.shorts;ix.strokeStyle=OUT;ix.lineWidth=2.8*s;ix.beginPath();
  if(ix.roundRect)ix.roundRect(hip.x-14*s,hip.y-8*s,28*s,18*s,5*s);else ix.rect(hip.x-14*s,hip.y-8*s,28*s,18*s);
  ix.fill();ix.stroke();
  const r=20*s,hc={x:sh.x+u.x*20*s,y:sh.y+u.y*20*s};
  limbO(sh,hc,8*s,L.skin,s);
  ix.fillStyle=K.shirt;ix.strokeStyle=OUT;ix.lineWidth=3*s;ix.lineJoin='round';ix.beginPath();
  ix.moveTo(hip.x-pp.x*13*s,hip.y-pp.y*13*s);ix.lineTo(hip.x+pp.x*13*s,hip.y+pp.y*13*s);
  ix.lineTo(sh.x+pp.x*14*s,sh.y+pp.y*14*s);ix.lineTo(sh.x-pp.x*14*s,sh.y-pp.y*14*s);ix.closePath();ix.fill();ix.stroke();
  limb({x:sh.x-pp.x*6*s,y:sh.y-pp.y*6*s},{x:sh.x+pp.x*6*s,y:sh.y+pp.y*6*s},4*s,K.trim);
  ix.save();ix.translate((hip.x+sh.x)/2,(hip.y+sh.y)/2+2*s);if(k.flip)ix.scale(-1,1);
  ix.font='700 '+Math.round(17*s)+'px Fredoka,system-ui,sans-serif';ix.textAlign='center';ix.textBaseline='middle';
  ix.lineWidth=3*s;ix.strokeStyle=OUT;ix.strokeText(String(k.num),0,0);ix.fillStyle=K.num;ix.fillText(String(k.num),0,0);
  ix.restore();ix.textBaseline='alphabetic';
  arm(A.aA);
  ix.strokeStyle=OUT;ix.lineWidth=2.8*s;ix.lineJoin='round';
  if(L.style==='pony'){
    const w=Math.sin(ph*2)*.25;ix.fillStyle=L.hair;ix.beginPath();
    ix.moveTo(hc.x-r*.55,hc.y-r*.8);
    ix.quadraticCurveTo(hc.x-r*1.9,hc.y-r*(1.0+w),hc.x-r*2.25,hc.y+r*(.15+w));
    ix.quadraticCurveTo(hc.x-r*1.55,hc.y-r*.05,hc.x-r*.9,hc.y-r*.05);ix.closePath();ix.fill();ix.stroke();
  }
  ix.fillStyle=L.skin;ix.beginPath();ix.ellipse(hc.x,hc.y,r,r*1.04,0,0,6.283);ix.fill();ix.stroke();
  ix.fillStyle=L.hair;polyR(hc,L.style==='spiky'?HAIR_SPIKY:HAIR_GIRL,r);ix.fill();ix.stroke();
  if(L.style==='pony'){ix.fillStyle='#ff6b9d';ix.beginPath();ix.arc(hc.x-r*.78,hc.y-r*.5,r*.18,0,6.283);ix.fill();ix.stroke();}
  ix.fillStyle=L.skin;ix.lineWidth=2*s;ix.beginPath();ix.ellipse(hc.x-r*.18,hc.y+r*.16,r*.17,r*.22,0,0,6.283);ix.fill();ix.stroke();
  ix.beginPath();ix.moveTo(hc.x+r*.93,hc.y+r*.02);ix.lineTo(hc.x+r*1.08,hc.y+r*.22);ix.lineTo(hc.x+r*.9,hc.y+r*.27);ix.fill();ix.stroke();
  ix.fillStyle='#fff';ix.lineWidth=2.2*s;ix.beginPath();ix.ellipse(hc.x+r*.5,hc.y-r*.03,r*.2,r*.27,0,0,6.283);ix.fill();ix.stroke();
  ix.fillStyle='#1a1a1a';ix.beginPath();ix.ellipse(hc.x+r*.6,hc.y+r*.02,r*.09,r*.15,0,0,6.283);ix.fill();
  ix.fillStyle='#fff';ix.beginPath();ix.arc(hc.x+r*.57,hc.y-r*.06,r*.035,0,6.283);ix.fill();
  if(k.girl){limb({x:hc.x+r*.62,y:hc.y-r*.27},{x:hc.x+r*.8,y:hc.y-r*.4},r*.08,OUT);limb({x:hc.x+r*.68,y:hc.y-r*.18},{x:hc.x+r*.86,y:hc.y-r*.27},r*.07,OUT);}
  const bt=k.girl?.12:.2;
  ix.fillStyle=OUT;ix.beginPath();
  ix.moveTo(hc.x+r*.22,hc.y-r*(.45-bt*.2));ix.lineTo(hc.x+r*.8,hc.y-r*(.3-bt));ix.lineTo(hc.x+r*.8,hc.y-r*(.2-bt));ix.lineTo(hc.x+r*.24,hc.y-r*.33);ix.closePath();ix.fill();
  if(k.girl){ix.strokeStyle='rgba(255,90,120,.75)';ix.lineWidth=1.6*s;for(let j=0;j<3;j++){ix.beginPath();ix.moveTo(hc.x+r*(.28+j*.12),hc.y+r*.36);ix.lineTo(hc.x+r*(.22+j*.12),hc.y+r*.48);ix.stroke();}}
  ix.strokeStyle=OUT;ix.lineWidth=2.2*s;
  const mo=.08+.3*yell;
  ix.fillStyle='#8a1f1f';ix.beginPath();
  ix.moveTo(hc.x+r*.48,hc.y+r*.5);ix.lineTo(hc.x+r*.88,hc.y+r*.44);ix.lineTo(hc.x+r*.86,hc.y+r*(.46+mo));ix.lineTo(hc.x+r*.56,hc.y+r*(.52+mo*.8));ix.closePath();ix.fill();ix.stroke();
  ix.fillStyle='#fff';ix.beginPath();ix.moveTo(hc.x+r*.5,hc.y+r*.51);ix.lineTo(hc.x+r*.87,hc.y+r*.45);ix.lineTo(hc.x+r*.87,hc.y+r*(.45+mo*.35));ix.lineTo(hc.x+r*.53,hc.y+r*(.51+mo*.3));ix.closePath();ix.fill();
  if(run||yell>.5){
    const dx=hc.x-r*1.05,dy=hc.y-r*.85+(run?Math.sin(ph)*2:0);
    ix.fillStyle='#bfe3ff';ix.lineWidth=2*s;ix.beginPath();ix.moveTo(dx,dy-r*.32);
    ix.quadraticCurveTo(dx+r*.2,dy,dx,dy+r*.12);ix.quadraticCurveTo(dx-r*.2,dy,dx,dy-r*.32);ix.fill();ix.stroke();
  }
  ix.restore();
  return {x:x+(k.flip?-1:1)*hc.x,y:hc.y-r};
}
function goalAt(post,dir,shk){
  const x0=dir>0?post:post-70;
  ix.strokeStyle='rgba(255,255,255,.55)';ix.lineWidth=1.5;ix.beginPath();
  for(let y=160;y<=250;y+=10){ix.moveTo(x0+shk,y);ix.lineTo(x0+70+shk,y);}
  for(let x=x0;x<=x0+70;x+=10){ix.moveTo(x+shk,160);ix.lineTo(x+shk,250);}
  ix.stroke();
  ix.strokeStyle='#fff';ix.lineWidth=6;ix.lineCap='round';ix.beginPath();
  ix.moveTo(post,252);ix.lineTo(post,156);ix.lineTo(post+dir*76,156);ix.stroke();
}
function introBg(now,burst){
  ix.fillStyle='#2f9e44';ix.fillRect(0,0,IW,IH);
  ix.fillStyle='rgba(0,0,0,.07)';for(let i=0;i<10;i+=2)ix.fillRect(i*80,0,80,IH);
  if(burst>0){
    ix.save();ix.translate(401,240);ix.rotate(now/4000);ix.fillStyle='rgba(255,236,150,'+(.22*burst)+')';
    for(let i=0;i<18;i++){ix.beginPath();ix.moveTo(0,0);ix.arc(0,0,700,i*Math.PI/9,i*Math.PI/9+Math.PI/18);ix.closePath();ix.fill();}
    ix.restore();
  }
  ix.strokeStyle='rgba(255,255,255,.8)';ix.lineWidth=3;ix.beginPath();ix.moveTo(0,288);ix.lineTo(IW,288);ix.moveTo(400,288);ix.lineTo(400,276);ix.stroke();
  const shk=IT.goal?Math.sin((now-IT.goal)/40)*Math.max(0,1-(now-IT.goal)/700)*4:0;
  goalAt(712,1,IT.winner===0?shk:0);goalAt(88,-1,IT.winner===1?shk:0);
}
function introPill(t,x,y,bg,fg,size){
  ix.font='700 '+size+'px Fredoka,system-ui,sans-serif';ix.textAlign='center';
  const w=ix.measureText(t).width+28,h=size+16;
  ix.fillStyle=bg;ix.strokeStyle=OUT;ix.lineWidth=3;ix.beginPath();if(ix.roundRect)ix.roundRect(x-w/2,y-h/2,w,h,h/2);else ix.rect(x-w/2,y-h/2,w,h);ix.fill();ix.stroke();
  ix.fillStyle=fg;ix.fillText(t,x,y+size*.36);
}
function fitIntro(){
  const hero=$('hero'),hr=hero.getBoundingClientRect();if(!hr.width||!hr.height)return;
  let other=0,n=0;[].forEach.call(hero.children,c=>{if(c!==ic&&c.offsetParent!==null){other+=c.getBoundingClientRect().height;n++;}});
  const availH=Math.max(80,hr.height-other-30-n*6);
  const w=Math.floor(Math.min(hr.width-36,availH*IW/IH,900)),h=Math.floor(w*IH/IW);
  ic.style.width=w+'px';ic.style.height=h+'px';
  const d=Math.min(window.devicePixelRatio||1,3);
  ic.width=Math.round(w*d);ic.height=Math.round(h*d);
}
if(window.ResizeObserver){try{new ResizeObserver(()=>fitIntro()).observe($('hero'));}catch(e){}}
