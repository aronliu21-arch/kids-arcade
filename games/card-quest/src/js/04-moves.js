/* ---------- every attack move gets its own effect + sound ---------- */
function hashS(s){let h=7;for(const ch of s)h=(h*31+ch.charCodeAt(0))>>>0;return h;}
const STYLES=[['meteor',/meteor|nova|galaxy|cosmic|sun burst|inferno|emperor/i],['beam',/beam|laser|cannon|blaster/i],['vortex',/tornado|cyclone|hurricane|storm|blizzard|tempest|whirlpool|fury/i],
 ['lightning',/thunder|bolt|volt|shock|zap|lightning|static|buzz|gigavolt/i],['wave',/wave|tsunami|tide|tidal|splash|crown wave/i],['sonic',/roar|howl|screech|hoot/i],
 ['chomp',/fang|bite|chomp|jaw/i],['slash',/claw|slash|scythe|blade|slice|talon|chop|whip|lash|swipe|pincer|pinch/i],['quake',/quake|stomp|stampede|crash|smash|rumble|belly|avalanche/i],
 ['charge',/punch|fist|bash|ram|charge|horn|head|jab|hug|rush/i],['leap',/dive|pounce|leap|kick|hop|dash/i],['pierce',/sting|peck|thorn|needle/i]];
const moveStyle=n=>{for(const [k,r] of STYLES)if(r.test(n))return k;return 'shot';};
function moveSound(a,type,style){if(!SOUND)return;const h=hashS(a.n),p=.8+(h%45)/100,sc=[262,294,330,392,440,523,587,659,784],big=a.c>=3;
 /* signature 3-note call, different for every move */
 [0,1,2].forEach(i=>tone(sc[(h>>(i*3))%sc.length]*p*(big?1:1.5),.1,['square','triangle','sawtooth'][(h>>i)%3],.06,i*.07));
 const d=.25;
 ({beam:()=>{const c=audio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(200*p,c.currentTime+d);o.frequency.exponentialRampToValueAtTime(1600*p,c.currentTime+d+.5);g.gain.setValueAtTime(.06,c.currentTime+d);g.gain.linearRampToValueAtTime(0,c.currentTime+d+.7);o.connect(g);g.connect(c.destination);o.start(c.currentTime+d);o.stop(c.currentTime+d+.75);},
  meteor:()=>{const c=audio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(1800*p,c.currentTime+d);o.frequency.exponentialRampToValueAtTime(120,c.currentTime+d+.8);g.gain.setValueAtTime(.06,c.currentTime+d);g.gain.linearRampToValueAtTime(0,c.currentTime+d+.85);o.connect(g);g.connect(c.destination);o.start(c.currentTime+d);o.stop(c.currentTime+d+.9);setTimeout(boom,1050);},
  vortex:()=>{whoosh();setTimeout(whoosh,250);setTimeout(whoosh,500);},
  lightning:()=>{[0,1,2].forEach(i=>setTimeout(()=>{[1400,200,1800,150].forEach((f,j)=>tone(f*p,.05,'square',.08,j*.03));},d*1000+i*180));setTimeout(()=>tone(60,.6,'sawtooth',.12),d*1000+500);},
  wave:()=>{whoosh();[500,420,350,300].forEach((f,i)=>tone(f*p,.25,'sine',.08,d+i*.08));},
  sonic:()=>{const c=audio();if(!c)return;const o=c.createOscillator(),l=c.createOscillator(),lg=c.createGain(),g=c.createGain();o.type='sawtooth';o.frequency.value=110*p;l.frequency.value=18;lg.gain.value=30;l.connect(lg);lg.connect(o.frequency);g.gain.setValueAtTime(.12,c.currentTime+d);g.gain.linearRampToValueAtTime(0,c.currentTime+d+.8);o.connect(g);g.connect(c.destination);o.start(c.currentTime+d);l.start(c.currentTime+d);o.stop(c.currentTime+d+.85);l.stop(c.currentTime+d+.85);},
  chomp:()=>{tone(140*p,.08,'square',.14,d+.35);tone(90*p,.12,'square',.14,d+.5);},
  slash:()=>{[0,1,2].forEach(i=>setTimeout(whoosh,d*1000+i*110));tone(2400*p,.05,'triangle',.05,d+.35);},
  quake:()=>{setTimeout(boom,d*1000+250);tone(55,.8,'sawtooth',.1,d+.25);},
  charge:()=>{whoosh();tone(100*p,.2,'square',.14,d+.35);},
  leap:()=>{const c=audio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.setValueAtTime(200*p,c.currentTime+d);o.frequency.exponentialRampToValueAtTime(900*p,c.currentTime+d+.3);o.frequency.exponentialRampToValueAtTime(120,c.currentTime+d+.55);g.gain.setValueAtTime(.12,c.currentTime+d);g.gain.linearRampToValueAtTime(0,c.currentTime+d+.6);o.connect(g);g.connect(c.destination);o.start(c.currentTime+d);o.stop(c.currentTime+d+.62);},
  pierce:()=>{[0,1,2].forEach(i=>tone(1900*p-i*200,.07,'square',.07,d+.1+i*.12));},
  shot:()=>{(ATKSND[type]||whoosh)();}})[style]();}
/* style animations: call hit(n) at the moment of impact */
function moveFX(style,type,big,h,as,ts,hit){const [x1,y1]=ctr(as),[x2,y2]=ctr(ts),cs=PAL[type],dir=Math.atan2(y2-y1,x2-x1),now0=performance.now();
 if(RM){hit();return;}
 const L=f=>FX.layer(f);
 switch(style){
 case 'beam':{const w=big?26:16;L((c,now)=>{const k=(now-now0)/700;if(k>1){return false;}const len=Math.min(1,k*3);const ex=x1+(x2-x1)*len,ey=y1+(y2-y1)*len;
   c.save();c.lineCap='round';c.shadowColor=cs[0];c.shadowBlur=30;c.strokeStyle=cs[0];c.globalAlpha=k>.8?(1-k)*5:1;c.lineWidth=w*(1+Math.sin(now/30)*.15);c.beginPath();c.moveTo(x1,y1);c.lineTo(ex,ey);c.stroke();c.strokeStyle='#fff';c.lineWidth=w*.4;c.stroke();c.restore();
   if(len>=1&&Math.random()<.7)FX.emit(x2,y2,type,3,{speed:5,life:16});});setTimeout(()=>hit(),280);break;}
 case 'meteor':{const n=big?5:3;for(let i=0;i<n;i++){const sx=x2-160+Math.random()*80,sy=-40,tx=x2+(Math.random()-.5)*40,ty=y2+(Math.random()-.5)*30,t0=now0+i*140;
   L((c,now)=>{const k=(now-t0)/450;if(k<0)return;if(k>1){FX.emit(tx,ty,type,14,{speed:6,life:24});FX.ring(tx,ty,cs[0],60);return false;}const x=sx+(tx-sx)*k,y=sy+(ty-sy)*k;
    c.save();const g=c.createRadialGradient(x,y,0,x,y,22);g.addColorStop(0,'#fff');g.addColorStop(.4,cs[0]);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,22,0,7);c.fill();c.restore();FX.emit(x,y,type,2,{speed:1,life:16,size:4});});}
   setTimeout(()=>{FX.flash(cs[0]);hit();},n*140+420);break;}
 case 'vortex':{L((c,now)=>{const k=(now-now0)/900;if(k>1)return false;c.save();c.translate(x2,y2);c.rotate(now/80);for(let i=0;i<3;i++){c.strokeStyle=cs[i%3];c.globalAlpha=.85*(1-k*.5);c.lineWidth=5-i;c.beginPath();
   for(let a=0;a<12;a+=.3){const r=a*(5+i*2)*(0.6+k*.6);c.lineTo(Math.cos(a+i*2)*r,Math.sin(a+i*2)*r*.6);}c.stroke();}c.restore();if(Math.random()<.6)FX.emit(x2+(Math.random()-.5)*90,y2+40,type,1,{dir:-Math.PI/2,spread:1,speed:4,life:20});});
   setTimeout(()=>hit(),650);break;}
 case 'lightning':{const strikes=big?3:2;for(let i=0;i<strikes;i++){const t0=now0+i*200,ox=(Math.random()-.5)*50;L((c,now)=>{const k=(now-t0)/180;if(k<0)return;if(k>1)return false;
   c.save();c.strokeStyle='#fff';c.shadowColor=type==='spark'?'#ffe066':cs[0];c.shadowBlur=24;c.lineWidth=big?7:5;c.beginPath();let x=x2+ox,y=-10;c.moveTo(x,y);while(y<y2){y+=24;x=x2+ox*(1-y/y2)+(Math.random()-.5)*36;c.lineTo(x,Math.min(y,y2));}c.stroke();c.strokeStyle=type==='spark'?'#ffe066':cs[0];c.lineWidth=2;c.stroke();c.restore();});}
   setTimeout(()=>{FX.flash('#fff');hit();},strikes*200);break;}
 case 'wave':{const fromL=x1<x2,W=innerWidth;L((c,now)=>{const k=(now-now0)/800;if(k>1)return false;const front=fromL?-120+(W+240)*k:W+120-(W+240)*k,top=y2-60-Math.sin(k*Math.PI)*30;
   c.save();c.globalAlpha=.85;c.fillStyle=cs[2]||cs[0];c.beginPath();c.moveTo(fromL?-200:W+200,y2+90);for(let i=0;i<=20;i++){const xx=(fromL?-200:W+200)+(front-(fromL?-200:W+200))*i/20;c.lineTo(xx,top+Math.sin(i*.8+now/90)*8+(i===20?0:20));}
   c.lineTo(front,y2+90);c.closePath();c.fill();c.fillStyle=cs[0];c.beginPath();c.arc(front,top+14,22,0,7);c.fill();c.restore();if(Math.random()<.8)FX.emit(front,top,type,2,{speed:4,life:18});});
   setTimeout(()=>hit(),Math.max(150,800*Math.abs((x2-(fromL?-120:W+120))/(W+240))));break;}
 case 'sonic':{for(let i=0;i<5;i++)setTimeout(()=>{const t0=performance.now();L((c,now)=>{const k=(now-t0)/500;if(k>1)return false;const x=x1+(x2-x1)*k,y=y1+(y2-y1)*k;c.save();c.translate(x,y);c.rotate(dir);c.strokeStyle=cs[i%3];c.lineWidth=5;c.globalAlpha=1-k*.6;c.beginPath();c.arc(0,0,14+k*30,-1,1);c.stroke();c.restore();});},i*90);
   setTimeout(()=>{FX.quake();hit();},560);break;}
 case 'chomp':{L((c,now)=>{const k=(now-now0)/650;if(k>1)return false;const open=k<.55?1-k*0.3:Math.max(0,1-(k-.55)*6),r=big?70:54,gap=open*r*.9;c.save();c.translate(x2,y2);c.globalAlpha=k>.85?(1-k)*6:1;
   [[-1],[1]].forEach(([s])=>{c.save();c.translate(0,s*gap*.5);c.fillStyle='#a61e4d';c.strokeStyle='#1b1f3b';c.lineWidth=4;c.beginPath();c.ellipse(0,0,r,r*.45,0,s<0?Math.PI:0,s<0?2*Math.PI:Math.PI);c.fill();c.stroke();c.fillStyle='#fff';
    for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(i*r/3.6-7,0);c.lineTo(i*r/3.6,s*-16);c.lineTo(i*r/3.6+7,0);c.closePath();c.fill();c.stroke();}c.restore();});c.restore();});
   setTimeout(()=>{FX.quake();hit();},440);break;}
 case 'slash':{const n=big?4:3;for(let i=0;i<n;i++)setTimeout(()=>{const t0=performance.now(),off=(i-(n-1)/2)*20,ang=-.9+((h>>i)%3)*.15;L((c,now)=>{const k=(now-t0)/260;if(k>1.6)return false;const kk=Math.min(1,k);
   c.save();c.translate(x2+off,y2);c.rotate(ang);c.strokeStyle='#fff';c.shadowColor=cs[0];c.shadowBlur=18;c.lineCap='round';c.globalAlpha=k>1?1.6-k:1;c.lineWidth=big?8:6;c.beginPath();c.moveTo(-70,0);c.lineTo(-70+140*kk,0);c.stroke();c.strokeStyle=cs[0];c.lineWidth=2;c.stroke();c.restore();});
   FX.emit(x2+off,y2,type,5,{speed:4,life:14});},i*110);setTimeout(()=>hit(),n*110+40);break;}
 case 'quake':{as.classList.add('lunge');setTimeout(()=>{FX.quake();L((c,now)=>{const k=(now-now0-250)/700;if(k<0)return;if(k>1)return false;c.save();c.strokeStyle='#1b1f3b';c.lineWidth=4;c.globalAlpha=1-k;
   for(let i=0;i<6;i++){const a=Math.PI+i*Math.PI/5;c.beginPath();c.moveTo(x2,y2+60);let x=x2,y=y2+60;for(let j=0;j<4;j++){x+=Math.cos(a)*22+(Math.random()-.5)*8;y+=Math.sin(a)*10;c.lineTo(x,y);}c.stroke();}c.restore();});
   FX.emit(x2,y2+60,'rock',big?24:14,{dir:-Math.PI/2,spread:1.6,speed:9,life:40});FX.emit(x2,y2+60,type,12,{dir:-Math.PI/2,spread:2,speed:6});hit();},250);break;}
 case 'charge':{const dx=(x2-x1)*.55,dy=(y2-y1)*.55;as.animate([{transform:'none'},{transform:`translate(${-dx*.15}px,${-dy*.15}px) scale(.95)`,offset:.3},{transform:`translate(${dx}px,${dy}px) scale(1.12)`,offset:.65},{transform:'none'}],{duration:620,easing:'ease-in-out'});
   FX.layer((c,now)=>{const k=(now-now0)/400;if(k>1)return false;if(k>.3){FX.emit(x1+dx*k,y1+dy*k,type,2,{dir:dir+Math.PI,spread:.6,speed:4,life:12});}});setTimeout(()=>hit(),400);break;}
 case 'leap':{const dx=x2-x1,dy=y2-y1;as.animate([{transform:'none'},{transform:`translate(${dx*.5}px,${dy*.5-120}px) rotate(180deg) scale(.8)`,offset:.5},{transform:`translate(${dx*.85}px,${dy*.85}px) rotate(360deg)`,offset:.75},{transform:'none'}],{duration:800,easing:'ease-in-out'});
   setTimeout(()=>{FX.ring(x2,y2,'#fff',110);hit();},600);break;}
 case 'pierce':{const n=3;for(let i=0;i<n;i++)setTimeout(()=>{const t0=performance.now(),oy=(i-1)*22;L((c,now)=>{const k=(now-t0)/160;if(k>1.4)return false;const kk=Math.min(1,k),x=x1+(x2-x1)*kk,y=y1+(y2+oy-y1)*kk;
   c.save();c.strokeStyle='#fff';c.shadowColor=cs[0];c.shadowBlur=12;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(x-Math.cos(dir)*40,y-Math.sin(dir)*40);c.lineTo(x,y);c.stroke();c.restore();});
   setTimeout(()=>{FX.emit(x2,y2+oy,'gold',6,{speed:4,life:14,size:3});tone(2000,.04,'square',.05);},160);},i*140);setTimeout(()=>hit(),n*140+120);break;}
 default:FX.shot(x1,y1,x2,y2,type,big,()=>hit());}}

