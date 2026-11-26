/* ---------- runway show: strut, pose, photographers, crowd ---------- */
const reduceMo=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const WALK=5.2; // seconds on the catwalk before the judges appear
function shutter(){if(!SOUND)return;const c=audio();if(!c||!POP.noise)return;const t=c.currentTime;
  const s=c.createBufferSource();s.buffer=POP.noise;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=3000;const g=c.createGain();s.connect(f);f.connect(g);g.connect(c.destination);
  g.gain.setValueAtTime(.22,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);g.gain.setValueAtTime(.16,t+.07);g.gain.exponentialRampToValueAtTime(.0001,t+.11);s.start(t);s.stop(t+.13);}
function crowd(kind){if(!SOUND)return;const c=audio();if(!c||!POP.noise)return;const t=c.currentTime;
  if(kind==='ooh'){[0,.08,.16].forEach((d,i)=>{const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(200+i*55,t+d);o.frequency.linearRampToValueAtTime(260+i*55,t+d+.5);o.frequency.linearRampToValueAtTime(190+i*55,t+d+1.1);
    f.type='bandpass';f.frequency.value=700;f.Q.value=3;o.connect(f);f.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.0001,t+d);g.gain.linearRampToValueAtTime(.05,t+d+.25);g.gain.exponentialRampToValueAtTime(.0001,t+d+1.2);o.start(t+d);o.stop(t+d+1.3);});return;}
  for(let i=0;i<70;i++){const d=Math.random()*1.8,s=c.createBufferSource();s.buffer=POP.noise;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=1200+Math.random()*1800;f.Q.value=1.5;const g=c.createGain();
    s.connect(f);f.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.12*(1-d/2),t+d);g.gain.exponentialRampToValueAtTime(.0001,t+d+.06);s.start(t+d,Math.random()*.5);s.stop(t+d+.08);}}
function step(){if(!SOUND)return;tone(1500,.03,'square',.04);tone(180,.05,'sine',.08);}
function scoreFX(sc,R){const c=R.querySelector('.cat');
  const notes={1:[300,250],2:[320,260],3:[330,280],4:[392,330],5:[440,392],6:[494,523],7:[523,587],8:[587,659],9:[659,784],10:[698,880],11:[784,988],12:[880,1047],13:[988,1175],14:[1047,1319],15:[1047,1568]}[sc];
  notes.forEach((f,i)=>setTimeout(()=>tone(f,.18,sc<5?'sine':'triangle',.12),i*140));
  if(sc>=12)confetti();if(sc>=14)setTimeout(confetti,500);if(sc===15){c.classList.add('shake');setTimeout(()=>c.classList.remove('shake'),700);setTimeout(confetti,1000);crowd('ooh');}
  if(sc<=3)setTimeout(()=>tone(180,.4,'sawtooth',.05),400);}
function showRunway(R){const cat=R.querySelector('.cat'),MS=[...R.querySelectorAll('.model')],m=MS[0];MS.forEach((x,i)=>{if(MS.length===2)x.style.left=(i?68:32)+'%';});const fitM=()=>{const h=Math.floor(cat.clientHeight*(MS.length===2?.8:.92));MS.forEach(x=>{const sv=x.querySelector('svg');sv.setAttribute('height',h);sv.setAttribute('width',Math.floor(h/2));sv.style.height=h+'px';sv.style.width=Math.floor(h/2)+'px';x.style.width=Math.floor(h/2)+'px';});};fitM();addEventListener('resize',fitM);if(window.ResizeObserver)new ResizeObserver(fitM).observe(cat);
  // a packed crowd on both sides of the catwalk: far rows small and high, near rows big and low
  const cams=[],ROWS=8,cw=cat.clientWidth||600,chh=cat.clientHeight||600,narrow=cw<500;let n=0,gs='',LY=['','','',''],lyr=0;
  const inner=i=>fan(i).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
  const put=(xPct,topPct,wPx,flip,op)=>{const x=xPct/100*cw,y=topPct/100*chh,sc=wPx/60,tx=flip?cw-x:x;
    LY[lyr]+='<g transform="translate('+tx.toFixed(1)+' '+y.toFixed(1)+') scale('+(flip?-sc:sc).toFixed(3)+' '+sc.toFixed(3)+')"'+(op<1?' opacity="'+op.toFixed(2)+'"':'')+'>'+inner(n++)+'</g>';};
  { const wPx=chh*.045,wPct=wPx/cw*100;let q=0;for(let x=-2;x<102;x+=wPct*.62){lyr=q++%4;put(x,0,wPx,false,.8);}}
  for(let r=0;r<ROWS;r++){const t=r/(ROWS-1),wPx=chh*(.055+t*.12),wPct=wPx/cw*100,inn=(narrow?34:40)-t*(narrow?31:35),cols=Math.max(2,Math.ceil(inn/(wPct*.6))+1);
    for(const left of [true,false])for(let k=0;k<cols;k++){const x=inn-wPct*(.6*k+.5)+(r%2?wPct*.3:0);if(x<-wPct*.7)continue;lyr=(r%2)*2+(k%2);put(x,6+t*80,wPx,!left,t<.3?.85:1);}}
  LY.forEach((g,i)=>{const cs=document.createElementNS('http://www.w3.org/2000/svg','svg');cs.setAttribute('class','crowd l'+i);cs.setAttribute('viewBox','0 0 '+cw+' '+chh);cs.setAttribute('preserveAspectRatio','none');cs.innerHTML=g;cat.appendChild(cs);cs.querySelectorAll('.cam').forEach(c=>cams.push(c));});
  const fl=document.createElement('div');fl.className='bigflash';cat.appendChild(fl);
  const flash=(n)=>{for(let k=0;k<(n||1);k++){const cam=pick(cams),r=cam.getBoundingClientRect(),cr=cat.getBoundingClientRect(),f=document.createElement('div');f.className='flash';
      f.style.left=(r.left-cr.left+r.width/2-20)+'px';f.style.top=(r.top-cr.top+r.height/2-20)+'px';cat.appendChild(f);setTimeout(()=>f.remove(),500);}
    fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on');shutter();};
  const t0=performance.now();let lastStep=-1,nextFlash=.3,posed=false;
  const frame=now=>{if(!R.isConnected)return;const t=(now-t0)/1000,p=Math.min(1,t/(WALK*.72)),e=1-Math.pow(1-p,1.6);
    const sc=.36+.64*e,ty=-58*(1-e),walking=p<1&&!reduceMo,ph=t*3.4,bob=walking?Math.abs(Math.sin(ph))*-2.2:0,rot=walking?Math.sin(ph)*2.2:(posed?-4:0);
    MS.forEach((x,i)=>{const q=ph+i*1.3,sw=walking?Math.sin(q)*1.6:0,b2=walking?-Math.abs(Math.sin(q))*1.1:0,r2=walking?Math.sin(q)*.9:(posed?(i?3:-3):0),turn=posed&&t-WALK*.72<.5?Math.cos((t-WALK*.72)/.5*Math.PI*2):1;
      x.style.transform='translateX(calc(-50% + '+sw+'%)) translateY('+(ty+b2)+'%) scale('+(sc*turn)+','+sc+') rotate('+r2+'deg)';
      const l=x.querySelector('.lgLi'),rr=x.querySelector('.lgRi'),a=walking?Math.sin(q):0;if(l){l.setAttribute('transform','translate('+(a>0?2*a:0)+' '+(a>0?-9*a:0)+')');rr.setAttribute('transform','translate('+(a<0?2*a:0)+' '+(a<0?9*a:0)+')');}});
    const st=Math.floor(ph/Math.PI);if(walking&&st!==lastStep){lastStep=st;step();}
    if(t>nextFlash){flash(p>=1?2:1);nextFlash=t+(p>=1?rnd(.12,.3):rnd(.35,.7));}
    if(p>=1&&!posed){posed=true;cat.classList.add('cheer');MS.forEach(x=>x.classList.add('pose'));crowd('ooh');for(let k=0;k<4;k++)setTimeout(()=>flash(2),k*110);}
    if(t>WALK-.4&&!R._clap){R._clap=1;cat.classList.add('cheer','clapping');crowd('clap');sfx.win();}
    if(t<WALK+.6)requestAnimationFrame(frame);};
  requestAnimationFrame(frame);}

/* ---------- runway song: a different track. Minor-key fashion-show house, 124 bpm ---------- */
const RCH=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],RBS=[33,29,36,31];
const RARP=[0,1,2,1,0,2,1,2];
const RHOOK=[[76,null,76,74,76,null,79,null],[77,null,76,null,72,null,74,null],[76,null,76,74,76,null,84,null],[83,null,79,null,74,null,null,null]];
function runStep(c,t,s){const st=60/124/2,bar=(s>>3)&7,b=s&7,ci=bar&3;
  if(b%2===0)pKick(c,t);
  if(b%2===1)pNoise(c,t,.05,'highpass',7000,.16);                 // open hat on the off-beat
  if(b===2||b===6)pNoise(c,t,.2,'bandpass',1800,.4);              // clap
  if(b%2===1)pOsc(c,t,hz(RBS[ci]),st*.9,'sawtooth',.26,500);      // pumping off-beat bass
  const ch=RCH[ci];pOsc(c,t,hz(ch[RARP[b]]+24),st*.8,'square',.035,2600,true);  // sparkly arpeggio
  if(b===0)ch.forEach(m=>pOsc(c,t,hz(m+12),st*7,'sawtooth',.018,1400));          // pad
  if(bar>=4){const M=RHOOK[ci][b];if(M){let len=1;while(b+len<8&&RHOOK[ci][b+len]===null)len++;pOsc(c,t,hz(M),st*len*.9,'triangle',.1,0,true);}}
  if(bar===7&&b>=4)pNoise(c,t,.06,'bandpass',3000+b*800,.18);}  // build-up

/* ---------- a sketched background scene for each theme ---------- */
function sceneSVG(id){const W=(d,c,o)=>'<path d="'+d+'" fill="'+c+'" opacity="'+(o||.55)+'" filter="url(#wc)"/>',Ln=(d,c,w,o)=>'<path d="'+d+'" fill="none" stroke="'+(c||INK)+'" stroke-width="'+(w||1)+'" opacity="'+(o||.5)+'" stroke-linecap="round"/>',
  C=(x,y,r,c,o)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" opacity="'+(o||.55)+'" filter="url(#wc)"/>',T=(x,y,s,e)=>'<text x="'+x+'" y="'+y+'" font-size="'+s+'" text-anchor="middle" opacity=".75">'+e+'</text>';
  let g='';const R=(a,b,n)=>{let s=17*n+3;return()=>a+((s=s*9301+49297)%233280)/233280*(b-a);};
  switch(id){
  case 'night':g=W('M0 0H400V300H0Z','#2e2a5a',.85)+[40,140,240,340].map(x=>W('M'+(x-40)+' 230L'+(x-30)+' 150H'+(x+30)+'L'+(x+40)+' 230Z','#a0704f',.7)+W('M'+(x-46)+' 150L'+x+' 120L'+(x+46)+' 150Z',['#e8505b','#ffd25e','#4fc9bd','#e8505b'][x/100|0])).join('')+
     Ln('M0 40Q100 80 200 40Q300 80 400 40','#ffd25e',1.2,.8)+[20,60,100,140,180,220,260,300,340,380].map(x=>C(x,52+Math.sin(x)*8,4,['#ffd25e','#ff8a72','#4fc9bd'][x%3],.95)).join('')+T(60,215,26,'🍢')+T(160,215,26,'🧋')+T(260,215,26,'🥟')+T(345,215,26,'🍡');break;
  case 'rain':g=W('M0 0H400V300H0Z','#b8c6d8',.6)+W('M30 70Q40 30 90 40Q120 10 160 40Q210 30 200 70Z','#8a99ad',.7)+W('M220 60Q230 20 280 30Q320 0 350 34Q400 30 390 64Z','#8a99ad',.7)+
     (()=>{const r=R(0,400,3);let s='';for(let i=0;i<40;i++){const x=r(),y=r()*.6+80;s+=Ln('M'+x+' '+y+'l-4 12','#5b8def',1.4,.6);}return s;})()+W('M40 270Q100 256 160 270Q100 284 40 270Z','#7fa3d8',.6)+W('M250 280Q310 266 370 280Q310 294 250 280Z','#7fa3d8',.6)+T(330,240,30,'🐸');break;
  case 'space':g=W('M0 0H400V300H0Z','#1d1a3a',.92)+(()=>{const r=R(0,400,7);let s='';for(let i=0;i<60;i++)s+='<circle cx="'+r()+'" cy="'+r()*.75+'" r="'+(r()/300+.4)+'" fill="#fff" opacity=".85"/>';return s;})()+
     C(320,70,34,'#d9a520',.8)+Ln('M270 80Q320 52 372 62','#ffd25e',3,.7)+C(70,230,50,'#9b7fd4',.7)+C(55,215,10,'#7c63b8',.6)+T(200,60,28,'🚀')+T(120,90,18,'🛰️');break;
  case 'newyear':g=W('M0 0H400V300H0Z','#f8e1d4',.7)+[60,150,250,340].map((x,i)=>Ln('M'+x+' 0V'+(30+i%2*14),'#a0704f',1.2,.7)+W('M'+(x-18)+' '+(48+i%2*14)+'Q'+x+' '+(28+i%2*14)+' '+(x+18)+' '+(48+i%2*14)+'Q'+(x+22)+' '+(68+i%2*14)+' '+(x+18)+' '+(86+i%2*14)+'Q'+x+' '+(100+i%2*14)+' '+(x-18)+' '+(86+i%2*14)+'Q'+(x-22)+' '+(68+i%2*14)+' '+(x-18)+' '+(48+i%2*14)+'Z','#e8505b',.85)).join('')+
     [[90,170],[300,150]].map(([x,y])=>[0,1,2,3,4,5,6,7].map(k=>Ln('M'+x+' '+y+'l'+Math.cos(k*.785)*26+' '+Math.sin(k*.785)*26,'#d9a520',2,.75)).join('')).join('')+W('M20 120H44V260H20Z','#e8505b',.8)+W('M356 120H380V260H356Z','#e8505b',.8)+T(32,150,14,'福')+T(368,150,14,'春');break;
  case 'royal':g=W('M0 0H400V300H0Z','#efe3f7',.7)+W('M0 0H70Q60 150 80 300H0Z','#9b7fd4',.7)+W('M400 0H330Q340 150 320 300H400Z','#9b7fd4',.7)+W('M0 0H400V26Q200 50 0 26Z','#7c63b8',.7)+
     Ln('M200 30V60','#d9a520',1.4,.8)+W('M160 60H240L226 90H174Z','#d9a520',.6)+[170,185,200,215,230].map(x=>C(x,98,3.5,'#cfe8ff',.95)).join('')+W('M120 300V180Q200 130 280 180V300Z','#f7d6e6',.6)+T(200,250,30,'🏰');break;
  case 'beach':g=W('M0 0H400V170H0Z','#bfe6f7',.7)+W('M0 160Q100 150 200 162Q300 150 400 160V220H0Z','#4fc9bd',.7)+W('M0 210Q100 200 200 214Q300 200 400 210V300H0Z','#f2d59a',.8)+C(330,60,30,'#ffd25e',.85)+
     Ln('M60 290Q70 220 56 160','#a0704f',4,.75)+W('M56 160Q20 150 10 176Q34 160 56 168Q40 132 70 120Q66 150 60 164Q90 140 108 160Q80 156 58 166Z','#7cc47f',.85)+T(300,270,26,'🐚')+T(240,280,24,'🦀');break;
  case 'sports':g=W('M0 0H400V160H0Z','#cfe8ff',.6)+W('M0 150H400V300H0Z','#e8893f',.55)+[180,210,240,270].map(y=>Ln('M0 '+y+'H400','#fff',2.2,.9)).join('')+
     [[50,'#e8505b'],[110,'#5b8def'],[170,'#ffd25e'],[230,'#7cc47f'],[290,'#9b7fd4'],[350,'#e8505b']].map(([x,c])=>Ln('M'+x+' 30V0','#4a3426',.8,.6)+W('M'+(x-10)+' 30L'+x+' 48L'+(x+10)+' 30Z',c,.85)).join('')+Ln('M0 30Q200 50 400 30','#4a3426',.8,.6)+T(70,130,28,'🏆')+T(330,130,28,'⚽');break;
  case 'snow':g=W('M0 0H400V300H0Z','#dbe8f5',.7)+W('M0 200Q80 150 160 190Q250 140 400 190V300H0Z','#fff',.95)+W('M260 160L300 90L340 160Z','#7cc47f',.6)+W('M60 180L90 120L120 180Z','#7cc47f',.6)+
     (()=>{const r=R(0,400,5);let s='';for(let i=0;i<34;i++)s+=T(r(),r()*.7+10,10+r()/60,'❄');return s;})()+T(330,250,40,'⛄');break;
  case 'garden':g=W('M0 0H400V300H0Z','#e8f5dc',.7)+W('M0 170Q100 140 200 170Q300 140 400 170V300H0Z','#7cc47f',.6)+W('M0 120H400V170H0Z','#5aa060',.45)+
     (()=>{const r=R(0,400,9);let s='';for(let i=0;i<22;i++){const x=r(),y=180+r()/4,c=['#f7a1c4','#ffd25e','#ff8a72','#9b7fd4'][i%4];s+=[0,1,2,3,4].map(k=>C(x+Math.cos(k*1.256)*6,y+Math.sin(k*1.256)*6,4.5,c,.85)).join('')+C(x,y,3,'#ffd25e',.95);}return s;})()+T(320,110,30,'🫖')+T(80,90,22,'🦋')+T(250,60,20,'🦋');break;
  case 'school':g=W('M0 0H400V300H0Z','#f3ead8',.8)+W('M60 36H340V170H60Z','#2f5d50',.9)+Ln('M60 36H340V170H60Z','#a0704f',4,.8)+Ln('M84 70H190M84 96H230M84 122H160','#fff',1.6,.75)+T(280,110,26,'✏️')+W('M0 222H400V300H0Z','#d9b68c',.75)+W('M150 200H250V214H150Z','#a0704f',.8)+T(60,262,28,'🎒')+T(345,262,28,'📚');break;
  case 'camping':g=W('M0 0H400V300H0Z','#cfe8ff',.7)+W('M0 200L90 100L180 200Z','#8fbf8a',.65)+W('M150 200L260 80L370 200Z','#7cb07a',.6)+W('M0 196H400V300H0Z','#b7d98b',.75)+W('M232 262L286 168L340 262Z','#ff8a72',.85)+Ln('M286 168V262','#4a3426',1.2,.7)+T(44,200,40,'🌲')+T(372,210,40,'🌲')+T(120,272,30,'🔥')+T(330,52,26,'☀️');break;
  case 'birthday':g=W('M0 0H400V300H0Z','#fde2ef',.8)+Ln('M0 30Q200 56 400 30','#4a3426',.8,.6)+[30,80,130,180,230,280,330,380].map((x,i)=>W('M'+(x-11)+' '+(36+Math.sin(x/127)*10)+'L'+x+' '+(58+Math.sin(x/127)*10)+'L'+(x+11)+' '+(36+Math.sin(x/127)*10)+'Z',['#f7a1c4','#ffd25e','#9b7fd4','#74c0fc'][i%4],.85)).join('')+[[60,110,'#e8505b'],[100,90,'#ffd25e'],[310,100,'#9b7fd4'],[350,120,'#4fc9bd']].map(([x,y,c])=>Ln('M'+x+' '+(y+18)+'Q'+(x-6)+' '+(y+60)+' '+x+' '+(y+100),'#4a3426',.7,.5)+C(x,y,16,c,.85)).join('')+T(200,262,40,'🎂')+T(80,262,28,'🎁')+T(320,262,28,'🎁');break;
  case 'halloween':g=W('M0 0H400V300H0Z','#2b2448',.9)+C(320,70,36,'#ffd25e',.85)+W('M0 222Q100 182 200 222Q300 182 400 222V300H0Z','#4a3b6b',.85)+T(80,262,34,'🎃')+T(330,268,30,'🎃')+T(200,96,22,'🦇')+T(140,62,18,'🦇')+T(120,186,28,'👻')+T(272,170,20,'🍬');break;
  case 'concert':g=W('M0 0H400V300H0Z','#1d1a3a',.92)+W('M40 0L100 0L190 300L-40 300Z','#ffd25e',.22)+W('M300 0L360 0L440 300L210 300Z','#f7a1c4',.22)+W('M160 0L240 0L280 300L120 300Z','#74c0fc',.15)+W('M0 232H400V300H0Z','#3a3a44',.9)+W('M14 150H64V232H14Z','#222',.9)+W('M336 150H386V232H336Z','#222',.9)+C(39,180,14,'#555',.9)+C(361,180,14,'#555',.9)+(()=>{const r=R(0,400,13);let s='';for(let i=0;i<24;i++)s+=C(r(),r()*.25+6,2.4,['#ffd25e','#f7a1c4','#74c0fc'][i%3],.95);return s;})()+T(200,70,26,'🎶')+T(110,218,26,'🎸')+T(290,218,26,'🎤');break;
  case 'autumn':g=W('M0 0H400V300H0Z','#fbe7c6',.75)+[[60,'#e8793a'],[180,'#d9a520'],[330,'#c2410c']].map(([x,c])=>Ln('M'+x+' 220V120','#7a4b2a',7,.8)+C(x,100,46,c,.75)+C(x-30,124,28,c,.7)+C(x+30,124,28,c,.7)).join('')+W('M0 210Q200 190 400 210V300H0Z','#c9a15b',.7)+W('M130 248L270 248L290 292L110 292Z','#e8505b',.75)+Ln('M150 248L136 292M190 248L184 292M230 248L236 292M270 248L278 292M120 270H280','#fff',1.4,.7)+T(200,272,26,'🧺')+(()=>{const r=R(0,400,15);let s='';for(let i=0;i<10;i++)s+=T(r(),r()*.5+20,16,'🍂');return s;})();break;
  case 'ballet':g=W('M0 0H400V300H0Z','#2a1f3d',.9)+W('M0 0H90Q70 150 96 300H0Z','#c2255c',.85)+W('M400 0H310Q330 150 304 300H400Z','#c2255c',.85)+W('M0 0H400V30Q200 60 0 30Z','#a61e4d',.9)+W('M0 232H400V300H0Z','#e8d5b7',.85)+'<ellipse cx="200" cy="250" rx="110" ry="26" fill="#fff6d6" opacity=".55"/>'+T(200,80,24,'✨')+T(150,120,16,'✨')+T(66,268,26,'🌹')+T(334,268,26,'🎀');break;
  case 'fairy':g=W('M0 0H400V300H0Z','#d8f3dc',.8)+[30,110,290,370].map((x,i)=>Ln('M'+x+' 300V'+(60+i%2*30),'#6b4f2a',10,.7)+C(x,50+i%2*30,40,'#2f9e44',.55)).join('')+W('M0 230Q200 210 400 230V300H0Z','#8ccf7e',.75)+[[150,250],[240,262]].map(([x,y])=>Ln('M'+x+' '+(y+20)+'V'+y,'#f4f1ea',6,.95)+W('M'+(x-16)+' '+y+'Q'+x+' '+(y-24)+' '+(x+16)+' '+y+'Z','#e8505b',.9)+C(x-5,y-8,2.4,'#fff',1)+C(x+6,y-5,2,'#fff',1)).join('')+(()=>{const r=R(0,400,17);let s='';for(let i=0;i<16;i++)s+=C(r(),r()*.6+20,2.2,'#ffd25e',.95);return s;})()+T(330,140,26,'🧚‍♀️')+T(80,120,20,'🦋')+T(200,120,22,'🦌');break;
  case 'travel':g=W('M0 0H400V300H0Z','#cfe8ff',.75)+C(80,70,20,'#fff',.9)+C(105,64,24,'#fff',.9)+C(130,72,18,'#fff',.9)+T(300,64,34,'✈️')+[0,100,200,300,400].map(x=>Ln('M'+x+' 0V200','#868e96',5,.7)).join('')+Ln('M0 200H400','#868e96',5,.7)+T(200,182,30,'🗼')+T(90,186,22,'🏯')+W('M0 200H400V300H0Z','#dee2e6',.85)+T(70,262,32,'🧳')+T(330,258,28,'🗺️');break;
  case 'candy':g=W('M0 0H400V300H0Z','#ffe3f1',.8)+W('M0 210Q100 170 200 205Q300 170 400 205V300H0Z','#c3fae8',.8)+[[60,'#f7a1c4'],[160,'#ffd25e'],[260,'#9b7fd4'],[350,'#4fc9bd']].map(([x,c],i)=>Ln('M'+x+' 230V'+(130+i%2*20),'#fff',5,.95)+C(x,118+i%2*20,24,c,.85)+Ln('M'+x+' '+(118+i%2*20)+'m-14 0a14 14 0 1 0 28 0a9 9 0 1 0 -18 0','#fff',2,.85)).join('')+(()=>{const r=R(0,400,19);let s='';for(let i=0;i<30;i++){const x=r(),y=r()*.7+10;s+=Ln('M'+x+' '+y+'l4 3',['#e8505b','#5b8def','#ffd25e','#7cc47f'][i%4],2.2,.9);}return s;})()+T(80,268,28,'🍭')+T(320,268,28,'🧁')+T(200,62,26,'🍬')+T(200,262,24,'🍩');break;
  case 'sea':g=W('M0 0H400V300H0Z','#3f8fc2',.75)+W('M0 0H400V60H0Z','#6fb8e0',.5)+W('M0 260Q100 240 200 262Q300 240 400 262V300H0Z','#f2d59a',.8)+
     [40,90,310,360].map((x,i)=>Ln('M'+x+' 290Q'+(x-12)+' 240 '+x+' 200Q'+(x+12)+' 170 '+(x-4)+' 140','#4caf50',5,.75)).join('')+W('M150 290Q160 240 175 268Q185 220 200 270Q215 230 226 290Z','#ff8a72',.8)+
     (()=>{const r=R(0,400,11);let s='';for(let i=0;i<16;i++)s+='<circle cx="'+r()+'" cy="'+r()*.6+'" r="'+(2+r()/80)+'" fill="none" stroke="#fff" opacity=".7"/>';return s;})()+T(110,120,26,'🐠')+T(300,90,26,'🐢')+T(250,180,22,'🐟')+T(60,60,22,'🪼');break;}
  return '<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+DEFS+g+'</svg>';}
