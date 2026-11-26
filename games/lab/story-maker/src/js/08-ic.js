/* ---------- opening animation: a crayon pen draws two characters, they pop alive, title bursts in ---------- */
{
const ic=$('ic'),ix=ic.getContext('2d');const IW=1000,IH=700;let iraf=0,it0=0,running=false,done=false;
let seed=7;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
const ell=(cx,cy,rx,ry,n=34,a0=0,a1=Math.PI*2)=>Array.from({length:n+1},(_,i)=>{const a=a0+(a1-a0)*i/n;return[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]});
const rect=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];
const wob=pts=>pts.map(([x,y])=>[x+(rnd()-.5)*5,y+(rnd()-.5)*5]);
// dragon (left) and robot (right), drawn as crayon strokes over flat fills
const DRAGON={fills:[[ell(330,450,115,80),'#69db7c'],[ell(455,355,58,50),'#69db7c'],[[[300,395],[245,290],[370,372]],'#ffd43b']],
  strokes:[ell(330,450,115,80),ell(455,355,58,50),[[300,395],[245,290],[370,372]],[[250,392],[272,350],[292,382],[314,342],[336,378],[358,340],[380,376]],
    [[218,470],[160,450],[120,400],[150,395]],[[290,525],[285,575]],[[370,525],[375,575]],ell(470,345,7,7,10),ell(450,372,20,10,12,.2,Math.PI-.2)],c:'#2b8a3e'};
const ROBOT={fills:[[rect(645,290,120,95),'#a5d8ff'],[rect(625,395,160,135),'#74c0fc']],
  strokes:[rect(645,290,120,95),rect(625,395,160,135),[[705,290],[705,245]],ell(705,236,11,11,12),ell(678,330,12,12,12),ell(732,330,12,12,12),[[680,360],[730,360]],
    [[625,430],[565,470],[560,500]],[[785,430],[845,400],[860,360]],[[665,530],[665,585]],[[745,530],[745,585]],rect(670,430,70,40)],c:'#1864ab'};
[DRAGON,ROBOT].forEach(o=>{o.strokes=o.strokes.map(wob);o.len=o.strokes.map(st=>st.reduce((a,p,i)=>i?a+Math.hypot(p[0]-st[i-1][0],p[1]-st[i-1][1]):0,0));o.total=o.len.reduce((a,b)=>a+b,0)});
function drawArt(o,k,fillK,ctx2){const c=ctx2||ix;
  c.globalAlpha=fillK;o.fills.forEach(([pts,col])=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.fill()});c.globalAlpha=1;
  let left=k*o.total,tip=null;c.strokeStyle=o.c;c.lineWidth=9;c.lineCap=c.lineJoin='round';
  o.strokes.forEach((st,si)=>{if(left<=0)return;const L=o.len[si];c.beginPath();c.moveTo(st[0][0],st[0][1]);let acc=0;
    for(let i=1;i<st.length;i++){const d=Math.hypot(st[i][0]-st[i-1][0],st[i][1]-st[i-1][1]);if(acc+d>left){const f=(left-acc)/d;const x=st[i-1][0]+(st[i][0]-st[i-1][0])*f,y=st[i-1][1]+(st[i][1]-st[i-1][1])*f;c.lineTo(x,y);tip=[x,y];break}c.lineTo(st[i][0],st[i][1]);acc+=d;tip=st[i]}
    c.stroke();left-=L});return tip}
function bake(o){const c=document.createElement('canvas');c.width=IW;c.height=IH;const x=c.getContext('2d');drawArt(o,1,1,x);
  const d=x.getImageData(0,0,IW,IH).data;let x0=IW,y0=IH,x1=0,y1=0;for(let y=0;y<IH;y+=2)for(let xx=0;xx<IW;xx+=2)if(d[(y*IW+xx)*4+3]>20){x0=Math.min(x0,xx);x1=Math.max(x1,xx);y0=Math.min(y0,y);y1=Math.max(y1,y)}
  const o2=document.createElement('canvas');o2.width=x1-x0+12;o2.height=y1-y0+12;o2.getContext('2d').drawImage(c,-x0+6,-y0+6);return{s:sticker(o2.toDataURL()),cx:(x0+x1)/2,by:y1,h:y1-y0}}
let baked=null;
function music(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t0=AC.currentTime+.05,m=AC.createGain();m.gain.value=.22;m.connect(AC.destination);
  const note=(f,t,d,type,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,t0+t);g.gain.linearRampToValueAtTime(v,t0+t+.02);g.gain.exponentialRampToValueAtTime(.001,t0+t+d);o.connect(g).connect(m);o.start(t0+t);o.stop(t0+t+d+.05)};
  const N={C4:261.6,D4:293.7,E4:329.6,F4:349.2,G4:392,A4:440,B4:493.9,C5:523.3,D5:587.3,E5:659.3,G5:784,C6:1046.5,C3:130.8,F3:174.6,G3:196,A3:220};
  // gentle "drawing" plinks, then a bright fanfare when they come alive
  ['C5','E5','G5','E5','D5','G4','C5','E5'].forEach((n,i)=>note(N[n],.4+i*.6,.5,'triangle',.25));
  [['C3',0],['A3',1.2],['F3',2.4],['G3',3.6]].forEach(([n,t])=>note(N[n],.4+t,1.1,'sine',.35));
  const fan=[['C5',0],['E5',.15],['G5',.3],['C6',.45],['G5',.9],['C6',1.05],['E5',1.5],['G5',1.65],['C6',1.8]];fan.forEach(([n,t])=>note(N[n],5.4+t,.45,'square',.12));
  [['C3',5.4],['F3',6.3],['G3',7.0],['C3',7.6]].forEach(([n,t])=>note(N[n],t,.8,'triangle',.4));
  for(let i=0;i<10;i++)note(2000+i*180,5.4+i*.05,.25,'sine',.06)}catch(e){}}
function sizeI(){const d=Math.min(devicePixelRatio||1,2);ic.width=innerWidth*d;ic.height=innerHeight*d}
function frameI(now){iraf=requestAnimationFrame(frameI);const t=(now-it0)/1000;const d=Math.min(devicePixelRatio||1,2);
  const portrait=innerHeight>innerWidth*1.1,sc=Math.min(innerWidth/(IW*(portrait?.8:1)),innerHeight/IH)*d,ox=(ic.width-IW*sc)/2,oy=(ic.height-IH*sc)/2;
  ix.setTransform(1,0,0,1,0,0);ix.fillStyle='#fbf1dc';ix.fillRect(0,0,ic.width,ic.height);ix.setTransform(sc,0,0,sc,ox,oy);
  const alive=t>5.4;
  if(alive){const k=Math.min(1,(t-5.4)/.8);const g=ix.createLinearGradient(0,0,0,IH);g.addColorStop(0,'#1b1f5c');g.addColorStop(.7,'#5f3dc4');g.addColorStop(1,'#9775fa');
    ix.globalAlpha=k;ix.fillStyle='#1b1f5c';ix.fillRect(-ox/sc,-oy/sc,ic.width/sc,ic.height/sc);ix.fillStyle=g;ix.fillRect(-ox/sc,0,ic.width/sc,IH);
    for(let i=0;i<90;i++){const x=(i*173)%IW,y=(i*97)%(IH*.6)-(i%3)*IH*.35;ix.fillStyle='#fff';ix.globalAlpha=k*(.4+.6*Math.abs(Math.sin(t*2+i)));ix.beginPath();ix.arc(x,y,1.6+(i%3),0,7);ix.fill()}
    ix.globalAlpha=k;ix.fillStyle='#fff3bf';ix.beginPath();ix.arc(840,120,46,0,7);ix.fill();ix.fillStyle='#5f3dc4';ix.beginPath();ix.arc(862,108,40,0,7);ix.fill();
    ix.fillStyle='#2f9e44';ix.beginPath();ix.moveTo(-2000,600);ix.lineTo(-200,IH-20);ix.quadraticCurveTo(250,520,600,640);ix.quadraticCurveTo(850,560,1200,620);ix.lineTo(3000,600);ix.lineTo(3000,IH+3000);ix.lineTo(-2000,IH+3000);ix.fill();ix.globalAlpha=1}
  else{ix.strokeStyle='rgba(160,130,90,.18)';ix.lineWidth=2;for(let y=80;y<IH;y+=46){ix.beginPath();ix.moveTo(60,y);ix.lineTo(940,y);ix.stroke()}}
  const dk=Math.min(1,Math.max(0,(t-.4)/2.6)),rk=Math.min(1,Math.max(0,(t-3)/2));
  if(!alive){const tip1=drawArt(DRAGON,dk,Math.min(1,Math.max(0,(t-2.9)/.5)));const tip2=t>3?drawArt(ROBOT,rk,Math.min(1,Math.max(0,(t-4.9)/.5))):null;
    const tip=t<3?tip1:tip2;if(tip&&t<5.1){ix.font='54px serif';ix.save();ix.translate(tip[0],tip[1]);ix.fillText('✏️',-4,-4);ix.restore()}}
  else if(baked){[baked.d,baked.r].forEach((b,i)=>{if(!b.s.ready)return;const tt=t-5.4,hop=Math.abs(Math.sin(tt*3.2+i*1.3))*55*Math.min(1,tt*2),
      x=b.cx+Math.sin(tt*.7+i*2)*(150),face=Math.cos(tt*.7+i*2)>0?1:-1,sq=Math.max(0,.18-hop/300)*(Math.sin(tt*3.2+i*1.3)<.15?1:0),pop=Math.min(1,tt/.35);
      const h=b.h*1.0*(.6+.4*pop),w=h*b.s.c.width/b.s.c.height;
      ix.fillStyle='rgba(0,0,0,.25)';ix.beginPath();ix.ellipse(x,b.by+20,Math.max(1,w*.35*(1-hop/150)),12,0,0,7);ix.fill();
      ix.save();ix.translate(x,b.by+20-hop);ix.rotate(Math.sin(tt*1.6+i)*.07);ix.scale(face*(1+sq*.6),1-sq);ix.drawImage(b.s.c,-w/2,-h,w,h);ix.restore()});
    for(let i=0;i<14;i++){const a=t*.6+i,x=(Math.sin(a*1.7+i)*.5+.5)*IW,y=(Math.cos(a*1.3+i*2)*.5+.5)*IH*.8,r=6+8*Math.abs(Math.sin(t*3+i));ix.fillStyle='#ffd43b';ix.globalAlpha=.8;
      ix.beginPath();for(let j=0;j<8;j++){const aa=j*Math.PI/4,rr=j%2?r*.35:r;ix.lineTo(x+Math.cos(aa)*rr,y+Math.sin(aa)*rr)}ix.fill()}ix.globalAlpha=1;
    if(t<5.9){ix.fillStyle=`rgba(255,255,255,${1-(t-5.4)/.5})`;ix.fillRect(-ox/sc,-oy/sc,ic.width/sc,ic.height/sc)}}
  if(t>6.1){const k=Math.min(1,(t-6.1)/.5),b=1+Math.sin(Math.min(1,k)*Math.PI)*.25;ix.save();ix.translate(IW/2,150);ix.scale(b*k,b*k);ix.textAlign='center';
    ix.font='900 84px -apple-system,system-ui,sans-serif';ix.lineWidth=14;ix.strokeStyle='#2b2118';ix.strokeText('Story Maker',0,0);ix.fillStyle='#ffd43b';ix.fillText('Story Maker',0,0);
    ix.font='900 52px "PingFang TC",sans-serif';ix.lineWidth=10;ix.strokeText('故事工坊',0,66);ix.fillStyle='#fff';ix.fillText('故事工坊',0,66);ix.restore()}
  if(t>7){ix.globalAlpha=Math.min(1,(t-7)/.6);ix.textAlign='center';ix.fillStyle='#fff';ix.font='800 30px -apple-system,system-ui,sans-serif';
    ix.fillText('Draw it. Write it. Watch it come alive!',IW/2,IH-70);ix.font='800 26px "PingFang TC",sans-serif';ix.fillText('畫出來、寫下來、看它動起來!',IW/2,IH-30);ix.globalAlpha=1}
  if(t>8.6&&!done){done=true;$('iskip').textContent='Tap to begin 點一下開始';$('iskip').style.cssText+=';display:block;color:#fff;font-size:20px;font-weight:800'}}
function endIntro(){cancelAnimationFrame(iraf);running=false;$('intro').classList.add('gone');try{removeEventListener('resize',sizeI)}catch(e){}}
$('istart').onclick=e=>{e.stopPropagation();if(reduced){endIntro();return}$('istart').style.display='none';$('iskip').style.display='block';
  sizeI();addEventListener('resize',sizeI);baked={d:bake(DRAGON),r:bake(ROBOT)};music();running=true;it0=performance.now();iraf=requestAnimationFrame(frameI)};
$('intro').addEventListener('click',()=>{if(running)endIntro()});
}


window.__test={state:()=>({screen:[...document.querySelectorAll('.screen.on')].map(s=>s.id)[0],kid,scenes:story?story.scenes.length:0,step:story?curScene().step:0,done:story?story.done:false,lines:story?story.scenes.map(s=>s.lines.join(' ')):[],version:VERSION}),solve:()=>{}};
}
