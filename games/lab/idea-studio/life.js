/* 小劉畫家 · "Bring it to life": a kid's drawing becomes a living sticker in a little world.
   Life.cutout(source)        → {c: canvas sticker with white outline, w, h} or null if the page is blank
   Life.start(stickers, opts) → runs the world on #lifeCv; opts: {kid, say(zh,en), onBack}
   Life.stop()                                                                                 */
(function(){
  const $=id=>document.getElementById(id);
  /* ---------- cut the drawing out of the white paper ---------- */
  function cutout(src){const W=1000,H=750,w=document.createElement('canvas');w.width=W;w.height=H;const x=w.getContext('2d',{willReadFrequently:true});
    x.fillStyle='#fff';x.fillRect(0,0,W,H);x.drawImage(src,0,0,W,H);const im=x.getImageData(0,0,W,H),d=im.data,bg=new Uint8Array(W*H),st=[];
    const white=i=>d[i*4]>232&&d[i*4+1]>232&&d[i*4+2]>232;
    for(let i=0;i<W;i++){st.push(i,(H-1)*W+i)}for(let j=0;j<H;j++){st.push(j*W,j*W+W-1)}
    while(st.length){const q=st.pop();if(bg[q]||!white(q))continue;bg[q]=1;const px=q%W;if(px>0)st.push(q-1);if(px<W-1)st.push(q+1);if(q>=W)st.push(q-W);if(q<W*(H-1))st.push(q+W)}
    let x0=W,y0=H,x1=-1,y1=-1;
    for(let q=0;q<W*H;q++){if(bg[q]){d[q*4+3]=0;continue}const px=q%W,py=(q/W)|0;if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py}
    if(x1<0)return null;
    // soften the edge a little
    for(let q=W;q<W*(H-1);q++){if(!bg[q]&&(bg[q-1]||bg[q+1]||bg[q-W]||bg[q+W]))d[q*4+3]=200}
    x.putImageData(im,0,0);
    const pad=14,cw=x1-x0+1,ch=y1-y0+1,full=cw*ch>W*H*.8,sc=Math.min(1,380/Math.max(cw,ch));
    const iw=Math.max(8,Math.round(cw*sc)),ih=Math.max(8,Math.round(ch*sc));
    const art=document.createElement('canvas');art.width=iw;art.height=ih;const ax=art.getContext('2d');
    if(full){ax.beginPath();ax.roundRect?ax.roundRect(0,0,iw,ih,22):ax.rect(0,0,iw,ih);ax.clip()}
    ax.drawImage(w,x0,y0,cw,ch,0,0,iw,ih);
    const sil=document.createElement('canvas');sil.width=iw;sil.height=ih;const sx=sil.getContext('2d');sx.drawImage(art,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='#fff';sx.fillRect(0,0,iw,ih);
    const out=document.createElement('canvas');out.width=iw+pad*2;out.height=ih+pad*2;const ox=out.getContext('2d');
    ox.shadowColor='rgba(0,0,0,.18)';ox.shadowBlur=6;
    for(let a=0;a<16;a++){const t=a/16*Math.PI*2;ox.drawImage(sil,pad+Math.cos(t)*7,pad+Math.sin(t)*7)}
    ox.shadowColor='transparent';ox.drawImage(art,pad,pad);
    return{c:out,w:out.width,h:out.height}}

  /* ---------- sound ---------- */
  let AC=null;function tone(f1,f2,dur,type,vol){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,o=AC.createOscillator(),v=AC.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);v.gain.setValueAtTime(vol||.13,t);v.gain.exponentialRampToValueAtTime(.001,t+dur+.05);o.connect(v).connect(AC.destination);o.start(t);o.stop(t+dur+.06)}catch(e){}}
  const SFX={jump:()=>tone(300,900,.18,'sine'),land:()=>tone(160,90,.1,'triangle',.1),giggle:()=>{tone(700,900,.08);setTimeout(()=>tone(800,1100,.08),110);setTimeout(()=>tone(900,1300,.1),220)},
    munch:()=>{tone(220,180,.06,'square',.06);setTimeout(()=>tone(240,170,.06,'square',.06),120);setTimeout(()=>tone(230,160,.06,'square',.06),240)},pop:()=>tone(500,1000,.09),
    spin:()=>tone(400,1400,.4,'sawtooth',.05),snore:()=>tone(120,90,.6,'sine',.08),drop:()=>tone(900,400,.15,'triangle',.08)};

  /* ---------- the world ---------- */
  const SCENES=['meadow','beach','space','snow','night'];
  let cv,g,W,H,dpr,raf=0,running=false,sceneI=0,critters=[],foods=[],parts=[],t0=0,opts={},feedMode=false,drag=null,bubbles=[];
  const GROUND=()=>H*.8;
  function size(){const r=cv.getBoundingClientRect();dpr=Math.min(2,devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0)}
  function bgDraw(t){const s=SCENES[sceneI],gy=GROUND();let sky;
    if(s==='space'||s==='night'){sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,s==='space'?'#0b1026':'#1b2a59');sky.addColorStop(1,s==='space'?'#2b1d55':'#3d4f8c')}
    else{sky=g.createLinearGradient(0,0,0,gy);sky.addColorStop(0,s==='snow'?'#cfe8ff':'#7cc8ff');sky.addColorStop(1,s==='snow'?'#f1f8ff':'#d6f0ff')}
    g.fillStyle=sky;g.fillRect(0,0,W,H);
    if(s==='space'||s==='night'){for(let i=0;i<70;i++){const x=(i*137.5)%W,y=(i*61.7)%(gy*.95),a=.4+.6*Math.abs(Math.sin(t*1.5+i));g.fillStyle=`rgba(255,255,255,${a})`;g.fillRect(x,y,2,2)}
      g.fillStyle=s==='space'?'#f8c96b':'#fff6d5';g.beginPath();g.arc(W*.82,H*.2,Math.min(W,H)*.07,0,7);g.fill();
      if(s==='space'){g.strokeStyle='#f8c96b';g.lineWidth=4;g.beginPath();g.ellipse(W*.82,H*.2,Math.min(W,H)*.12,Math.min(W,H)*.03,-.3,0,7);g.stroke()}}
    else{g.fillStyle='#ffe066';g.beginPath();g.arc(W*.85,H*.16,Math.min(W,H)*.07,0,7);g.fill();
      g.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<3;i++){const cx=((t*12+i*W/2.3)%(W+200))-100,cy=H*(.12+i*.08);g.beginPath();g.arc(cx,cy,22,0,7);g.arc(cx+24,cy-8,26,0,7);g.arc(cx+50,cy,20,0,7);g.fill()}}
    const ground={meadow:'#8ce99a',beach:'#ffe8a3',space:'#7b6fa8',snow:'#ffffff',night:'#3b7a57'}[s];g.fillStyle=ground;g.fillRect(0,gy,W,H-gy);
    g.fillStyle={meadow:'#69db7c',beach:'#ffd8a8',space:'#665b94',snow:'#e7f5ff',night:'#2f6b4a'}[s];g.fillRect(0,gy,W,6);
    if(s==='beach'){g.fillStyle='#4dabf7';g.fillRect(0,gy-18,W*.35,18);g.fillStyle='#a5d8ff';for(let i=0;i<5;i++){g.fillRect((i*80+t*20)%(W*.35),gy-12,30,3)}}
    if(s==='meadow')for(let i=0;i<14;i++){const x=(i*97)%W,y=gy+12+(i*37)%(H-gy-20);g.fillStyle=['#ff8787','#ffd43b','#da77f2'][i%3];g.beginPath();g.arc(x,y,4,0,7);g.fill()}
    if(s==='snow')for(let i=0;i<40;i++){const x=(i*53+Math.sin(t+i)*20)%W,y=(i*29+t*40)%H;g.fillStyle='#fff';g.beginPath();g.arc(x,y,2.5,0,7);g.fill()}}

  function addCritter(st,i){const base=Math.min(W,H)*(i?.26:.36),sc=base/Math.max(st.w,st.h);
    critters.push({st,x:W*(i?.2+.6*Math.random():.5),air:0,vy:0,face:1,sc,grow:1,state:'idle',stT:0,tx:null,squash:0,rot:0,next:2+Math.random()*3,sleep:false,id:i})}
  function hit(c,px,py){const w=c.st.w*c.sc*c.grow,h=c.st.h*c.sc*c.grow,gy=GROUND();return px>c.x-w/2&&px<c.x+w/2&&py>gy-c.air-h&&py<gy-c.air}
  function burst(x,y,kind,n){for(let i=0;i<(n||10);i++)parts.push({x,y,vx:(Math.random()-.5)*260,vy:-120-Math.random()*240,life:1.2,k:kind})}
  function bubble(c,txt){bubbles=bubbles.filter(b=>b.c!==c);bubbles.push({c,txt,life:1.8})}
  function jump(c,big){if(c.air>2)return;c.sleep=false;c.vy=big?-760:-560;c.squash=-.18;SFX.jump()}
  const LINES=[['嘿嘿!','Hehe!'],['好癢!','That tickles!'],['我會跳!','I can jump!'],['嗨!','Hi!'],['再一次!','Again!']];
  function act(kind){const z=opts.kid==='milo';critters.forEach((c,i)=>setTimeout(()=>{c.sleep=false;
    if(kind==='jump')jump(c,true);
    if(kind==='dance'){c.state='dance';c.stT=3;SFX.giggle()}
    if(kind==='spin'){c.state='spin';c.stT=1;SFX.spin()}
    if(kind==='love'){burst(c.x,GROUND()-c.air-c.st.h*c.sc*.7,'heart',14);SFX.giggle();bubble(c,'❤️')}
    if(kind==='sleep'){c.sleep=true;c.state='idle';SFX.snore()}},i*180))
    if(kind==='feed'){feedMode=!feedMode;$('lfFeed').classList.toggle('sel',feedMode);toast(feedMode?'🍎 Tap anywhere to drop food! 點一下丟食物':'')}
    if(kind==='scene'){sceneI=(sceneI+1)%SCENES.length;SFX.pop()}}
  function toast(m){const t=$('lfTip');t.textContent=m;t.style.opacity=m?1:0;clearTimeout(t._h);if(m)t._h=setTimeout(()=>t.style.opacity=0,2600)}

  function step(dt,t){const gy=GROUND();
    for(const c of critters){const h=c.st.h*c.sc*c.grow;
      if(drag&&drag.c===c){c.vy=0;c.squash*=.9;continue}
      // gravity
      if(c.air>0||c.vy<0){c.vy+=1900*dt;c.air-=c.vy*dt;if(c.air<=0){c.air=0;if(c.vy>200){c.squash=.22;SFX.land()}c.vy=0}}
      c.squash*=Math.pow(.02,dt);
      if(c.sleep){if(Math.random()<dt*.8)parts.push({x:c.x+20,y:gy-h*.6,vx:20,vy:-40,life:2,k:'z'});continue}
      // food: go eat the nearest
      const f=foods.filter(f=>f.landed).sort((a,b)=>Math.abs(a.x-c.x)-Math.abs(b.x-c.x))[0];
      if(f){c.tx=f.x;if(Math.abs(f.x-c.x)<c.st.w*c.sc*.35&&c.air===0){foods.splice(foods.indexOf(f),1);SFX.munch();c.grow=Math.min(1.5,c.grow+.06);burst(c.x,gy-h*.5,'crumb',8);bubble(c,'好吃!😋');c.tx=null}}
      if(c.state==='dance'){c.stT-=dt;c.rot=Math.sin(t*10)*.25;if(c.air===0&&Math.random()<dt*3)jump(c);if(c.stT<=0){c.state='idle';c.rot=0}}
      else if(c.state==='spin'){c.stT-=dt;c.rot+=dt*Math.PI*2*2;if(c.stT<=0){c.state='idle';c.rot=0}}
      else{c.rot*=.85;
        if(c.tx!=null){const dx=c.tx-c.x;c.face=dx<0?-1:1;if(Math.abs(dx)<8)c.tx=null;else{c.x+=Math.sign(dx)*Math.min(Math.abs(dx),200*dt);if(c.air===0&&Math.random()<dt*4){c.vy=-260;c.squash=-.08}}}
        else{c.next-=dt;if(c.next<=0){c.next=2.5+Math.random()*4;const r=Math.random();if(r<.5)c.tx=Math.max(80,Math.min(W-80,c.x+(Math.random()-.5)*W*.5));else if(r<.7)jump(c)}}}
      const hw=c.st.w*c.sc*c.grow/2;c.x=Math.max(hw*.6,Math.min(W-hw*.6,c.x))}
    for(const f of foods){if(!f.landed){f.vy+=1500*dt;f.y+=f.vy*dt;if(f.y>=gy-10){f.y=gy-10;f.landed=true}}}
    for(const p of parts){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.k!=='z')p.vy+=500*dt}parts=parts.filter(p=>p.life>0);
    for(const b of bubbles)b.life-=dt;bubbles=bubbles.filter(b=>b.life>0)}
  function draw(t){bgDraw(t);const gy=GROUND();
    for(const f of foods){g.font='34px "Apple Color Emoji","Noto Color Emoji",serif';g.textAlign='center';g.textBaseline='middle';g.fillText(f.e,f.x,f.y)}
    for(const c of critters){const w=c.st.w*c.sc*c.grow,h=c.st.h*c.sc*c.grow;
      // shadow
      g.fillStyle='rgba(0,0,0,.15)';g.beginPath();g.ellipse(c.x,gy+4,w*.35*Math.max(.3,1-c.air/400),9,0,0,7);g.fill();
      const breathe=c.sleep?Math.sin(t*2)*.03:Math.sin(t*3+c.id)*.035,sy=1+breathe-c.squash,sx=1-breathe*.6+c.squash;
      g.save();g.translate(c.x,gy-c.air);
      if(c.sleep){g.rotate(-.12)}
      g.scale(sx*c.face,sy);g.rotate(c.rot*c.face);g.drawImage(c.st.c,-w/2,-h,w,h);g.restore()}
    for(const p of parts){g.globalAlpha=Math.min(1,p.life);g.font=(p.k==='z'?'bold 26px system-ui':'24px "Apple Color Emoji","Noto Color Emoji",serif');g.textAlign='center';
      g.fillStyle='#fff';g.fillText({heart:'❤️',star:'⭐',crumb:'🍪',z:'Z'}[p.k],p.x,p.y)}
    g.globalAlpha=1;
    for(const b of bubbles){const c=b.c,h=c.st.h*c.sc*c.grow,x=c.x,y=gy-c.air-h-18;g.globalAlpha=Math.min(1,b.life*2);
      g.font='bold 22px -apple-system,system-ui,"PingFang TC",sans-serif';const tw=g.measureText(b.txt).width+28;
      g.fillStyle='#fff';g.strokeStyle='#2b2118';g.lineWidth=3;g.beginPath();g.roundRect?g.roundRect(x-tw/2,y-44,tw,40,18):g.rect(x-tw/2,y-44,tw,40);g.fill();g.stroke();
      g.beginPath();g.moveTo(x-8,y-5);g.lineTo(x,y+8);g.lineTo(x+8,y-5);g.fill();g.fillStyle='#2b2118';g.textAlign='center';g.textBaseline='middle';g.fillText(b.txt,x,y-24);g.globalAlpha=1}}
  function loop(ts){if(!running)return;raf=requestAnimationFrame(loop);const t=ts/1000,dt=Math.min(.05,t-(t0||t));t0=t;step(dt,t);draw(t)}

  /* ---------- touch ---------- */
  function pt(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  function onDown(e){e.preventDefault();const p=pt(e);const c=[...critters].reverse().find(c=>hit(c,p.x,p.y));
    if(c){drag={c,sx:p.x,sy:p.y,t:performance.now(),moved:false,ox:p.x-c.x,oy:(GROUND()-c.air)-p.y};cv.setPointerCapture(e.pointerId);return}
    if(feedMode){const E=['🍎','🍓','🍪','🍌','🧁','🍉'];foods.push({x:p.x,y:p.y,vy:0,e:E[Math.floor(Math.random()*E.length)],landed:false});SFX.drop();if(foods.length>12)foods.shift();return}
    critters.forEach(c=>{c.sleep=false;c.tx=p.x});burst(p.x,Math.min(p.y,GROUND()),'star',5)}
  function onMove(e){if(!drag)return;const p=pt(e);if(Math.hypot(p.x-drag.sx,p.y-drag.sy)>8)drag.moved=true;if(!drag.moved)return;
    const c=drag.c;c.x=p.x-drag.ox;c.air=Math.max(0,GROUND()-(p.y+drag.oy));c.face=1;c.sleep=false}
  function onUp(){if(!drag)return;const c=drag.c;if(!drag.moved&&performance.now()-drag.t<400){c.sleep=false;jump(c);SFX.giggle();burst(c.x,GROUND()-c.air-c.st.h*c.sc*.6,'star',10);
      const L=LINES[Math.floor(Math.random()*LINES.length)];bubble(c,opts.kid==='milo'?L[0]:L[0]+' '+L[1])}
    else if(c.air>0){c.vy=0}drag=null}

  function start(stickers,o){opts=o||{};cv=$('lifeCv');g=cv.getContext('2d');critters=[];foods=[];parts=[];bubbles=[];feedMode=false;sceneI=0;$('lfFeed').classList.remove('sel');
    size();stickers.forEach((s,i)=>addCritter(s,i));
    if(!start._wired){start._wired=true;cv.addEventListener('pointerdown',onDown);cv.addEventListener('pointermove',onMove);cv.addEventListener('pointerup',onUp);cv.addEventListener('pointercancel',onUp);
      addEventListener('resize',()=>{if(running){size()}});
      document.querySelectorAll('[data-lf]').forEach(b=>b.onclick=()=>act(b.dataset.lf))}
    running=true;t0=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
    const c=critters[0];if(c){c.air=0;setTimeout(()=>{jump(c,true);burst(c.x,GROUND()-120,'star',18)},250)}}
  function addFriend(st){if(critters.length>=5)return false;addCritter(st,critters.length);const c=critters[critters.length-1];c.air=H*.5;c.vy=0;SFX.pop();return true}
  function stop(){running=false;cancelAnimationFrame(raf)}
  window.Life={cutout,start,stop,addFriend,count:()=>critters.length,_state:()=>critters.map(c=>({x:Math.round(c.x),air:Math.round(c.air),grow:c.grow,sleep:c.sleep,state:c.state}))};
})();
