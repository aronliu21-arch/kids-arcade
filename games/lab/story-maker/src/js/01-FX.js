
{
/* ---------- living pictures (Family Zoo style: hop, flip, squash, wander, tap to jump) ---------- */
const FX=[['none','🚫 None 無'],['sparkle','✨ Sparkles 閃亮'],['stars','🌟 Night stars 星空'],['rain','🌧️ Rain 下雨'],['storm','⛈️ Storm 暴風雨'],['snow','❄️ Snow 下雪'],['bubbles','🫧 Bubbles 泡泡'],['leaves','🍂 Leaves 落葉'],['hearts','💖 Hearts 愛心'],['confetti','🎉 Confetti 彩帶'],['candy','🍬 Candy rain 糖果雨'],['fire','🔥 Fire sparks 火花'],['shake','💥 Earthquake 地震']];
const MOVES=[['wander','🚶 Wander 走來走去'],['bounce','🦘 Bounce 原地跳'],['fly','🎈 Fly 飛來飛去'],['stay','🧍 Stay 待著']];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const stickers={};
function sticker(src){if(stickers[src])return stickers[src];const o={ready:false,c:null};stickers[src]=o;const im=new Image();
  im.onload=()=>{const pad=10,c=document.createElement('canvas');c.width=im.width+pad*2;c.height=im.height+pad*2;const x=c.getContext('2d');
    const sil=document.createElement('canvas');sil.width=im.width;sil.height=im.height;const sx=sil.getContext('2d');sx.drawImage(im,0,0);sx.globalCompositeOperation='source-in';sx.fillStyle='#fff';sx.fillRect(0,0,im.width,im.height);
    for(let k=0;k<16;k++)x.drawImage(sil,pad+Math.cos(k/16*6.283)*7,pad+Math.sin(k/16*6.283)*7);x.drawImage(im,pad,pad);o.c=c;o.ready=true};im.src=src;return o}
let AC=null;function boing(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;
  o.type='sine';o.frequency.setValueAtTime(220,t);o.frequency.exponentialRampToValueAtTime(660,t+.12);o.frequency.exponentialRampToValueAtTime(330,t+.3);
  g.gain.setValueAtTime(.25,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.4)}catch(e){}}
const VERSION='v1.13';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toast=m=>{const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2400)};
const KIDS={nora:{name:'Nora',color:'#7048e8'},lucas:{name:'Lucas',color:'#f76707'},milo:{name:'Milo',color:'#2f9e44'}};
const DEFLANG={nora:'zh',lucas:'en',milo:'zh'};
let kid=null,story=null,dirty=false,hist=[];
const Z=()=>story&&story.lang==='zh';
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));window.scrollTo(0,0);if(id!=='build'&&id!=='watch')stopStage()}
// same voices as Dino World: best installed voice (Premium > Enhanced), Taiwan Chinese first; the Chinese voice picked in Dino World is shared
const vcache={};
function voiceScore(v,l){const lang=(v.lang||'').replace('_','-');const id=((v.name||'')+' '+(v.voiceURI||'')).toLowerCase();let sc=0;
 if(lang===l)sc+=100;else if(l==='zh-TW'&&/^zh-(hk|hant)/i.test(lang))sc+=60;else if(lang.slice(0,2)===l.slice(0,2))sc+=40;else return -1;
 if(/premium/.test(id))sc+=30;else if(/enhanced|neural|natural|online/.test(id))sc+=20;if(/compact|eloquence|novelty/.test(id))sc-=15;
 if(l==='zh-TW'&&/lilian/.test(id))sc+=200;if(l==='zh-TW'&&/mei-?jia/.test(id))sc+=5;if(l==='en-US'&&/samantha|ava|zoe|allison|google us/.test(id))sc+=5;if(v.localService)sc+=1;return sc}
const ZHPICK='dinoworld.zhvoice';function zhPick(){try{return localStorage.getItem(ZHPICK)||''}catch(e){return''}}
function zhVoices(){try{return speechSynthesis.getVoices().filter(v=>/^(zh|yue)/i.test(v.lang||'')).sort((a,b)=>voiceScore(b,'zh-TW')-voiceScore(a,'zh-TW'))}catch(e){return[]}}
function voiceFor(l){if(vcache[l]!==undefined)return vcache[l];try{const vs=speechSynthesis.getVoices();
 if(l==='zh-TW'&&zhPick()){const v=vs.find(v=>v.voiceURI===zhPick());if(v){vcache[l]=v;return v}}let best=null,bs=-1;for(const v of vs){const sc=voiceScore(v,l);if(sc>bs){bs=sc;best=v}}if(vs.length)vcache[l]=best;return best}catch(e){return null}}
try{speechSynthesis.onvoiceschanged=()=>{for(const k in vcache)delete vcache[k]}}catch(e){}
function speak(t,pitch){try{speechSynthesis.cancel();if(!t)return;
  const clean=t.replace(/[”」』]/g,', ').replace(/[“"「『*_~#—–]/g,' ').replace(/…/g,', ').replace(/([,,。!?!?.:])(\s*,)+/g,'$1').replace(/(,\s*){2,}/g,', ').replace(/\s+/g,' ').trim();if(!/[\p{L}\p{N}]/u.test(clean))return;
  const l=/[一-鿿]/.test(clean)?'zh-TW':'en-US',u=new SpeechSynthesisUtterance(clean);u.lang=l;const v=voiceFor(l);if(v){u.voice=v;if(v.lang)u.lang=v.lang}
  u.rate=l==='en-US'?.88:.8;u.pitch=pitch||1.15;speechSynthesis.speak(u);return u}catch(e){}}
function voicePanel(){const m=document.createElement('div');m.className='vmodal';
  const draw=()=>{const vs=zhVoices(),cur=voiceFor('zh-TW');m.innerHTML=`<div><h2>🗣 中文聲音 Chinese voice</h2><p class="ver">Same setting as Dino World. Tap a voice to hear it. 點一下試聽。</p><div style="max-height:50vh;overflow:auto">${vs.length?vs.map((v,i)=>`<button class="btn ${cur&&v.voiceURI===cur.voiceURI?'green':''}" data-i="${i}" style="display:block;width:100%;margin:6px 0;text-align:left">${cur&&v.voiceURI===cur.voiceURI?'✓ ':''}${esc(v.name)} <small>(${esc(v.lang)})</small></button>`).join(''):'<p>No Chinese voices on this device yet.</p>'}</div>
    <div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="voAuto">Auto (best) 自動</button><button class="btn go" id="voDone">Done 完成</button></div></div>`;
    m.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const v=vs[+b.dataset.i];try{localStorage.setItem(ZHPICK,v.voiceURI)}catch(e){}delete vcache['zh-TW'];speak('從前從前,有一隻小龍叫做小火花。');draw()});
    m.querySelector('#voAuto').onclick=()=>{try{localStorage.removeItem(ZHPICK)}catch(e){}delete vcache['zh-TW'];draw()};m.querySelector('#voDone').onclick=()=>m.remove()};
  draw();document.body.appendChild(m)}

/* ================= illustrated backgrounds (drawn once, cached) ================= */
const W=800,H=600,BGC={};
function grad(x,a,b,y0=0,y1=H){const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g}
function circ(x,cx,cy,r,c){x.fillStyle=c;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()}
function poly(x,pts,c){x.fillStyle=c;x.beginPath();pts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fill()}
function hills(x,y,c,amp=40,ph=0){x.fillStyle=c;x.beginPath();x.moveTo(0,H);for(let i=0;i<=W;i+=20)x.lineTo(i,y+Math.sin(i/120+ph)*amp);x.lineTo(W,H);x.fill()}
function cloud(x,cx,cy,s,c='#fff'){[[0,0,1],[-.9,.15,.7],[.9,.15,.75],[-.4,-.4,.7],[.45,-.35,.65]].forEach(([dx,dy,r])=>circ(x,cx+dx*s,cy+dy*s,r*s,c))}
function tree(x,tx,ty,s,c='#2f9e44'){x.fillStyle='#8d5524';x.fillRect(tx-s*.12,ty-s*.9,s*.24,s*.9);circ(x,tx,ty-s*1.1,s*.55,c);circ(x,tx-s*.35,ty-s*.85,s*.4,c);circ(x,tx+s*.35,ty-s*.85,s*.4,c)}
function pine(x,tx,ty,s,c='#2b8a3e'){x.fillStyle='#8d5524';x.fillRect(tx-s*.08,ty-s*.3,s*.16,s*.3);for(let i=0;i<3;i++)poly(x,[[tx,ty-s*1.3+i*s*.3],[tx-s*.5+i*.05*s,ty-s*.3-i*0+i*s*.05-s*.15*(2-i)],[tx+s*.5-i*.05*s,ty-s*.3+i*s*.05-s*.15*(2-i)]],c)}
function palm(x,tx,ty,s){x.strokeStyle='#8d5524';x.lineWidth=s*.12;x.beginPath();x.moveTo(tx,ty);x.quadraticCurveTo(tx+s*.2,ty-s*.6,tx+s*.1,ty-s*1.2);x.stroke();
  x.fillStyle='#2f9e44';for(let a=0;a<5;a++){x.save();x.translate(tx+s*.1,ty-s*1.2);x.rotate(-2.6+a*.65);x.beginPath();x.ellipse(s*.4,0,Math.abs(s*.45),Math.abs(s*.12),0,0,7);x.fill();x.restore()}}
function stars(x,n,maxY,seed=3){let r=seed;const rn=()=>(r=(r*9301+49297)%233280)/233280;for(let i=0;i<n;i++)circ(x,rn()*W,rn()*maxY,rn()*2+.6,'rgba(255,255,255,'+(.5+rn()*.5)+')')}
const BG={
 meadow:x=>{x.fillStyle=grad(x,'#8fd3ff','#e3f6ff');x.fillRect(0,0,W,H);circ(x,680,110,55,'#ffd43b');cloud(x,200,110,40);cloud(x,470,80,30);hills(x,420,'#8ce99a',30);hills(x,470,'#51cf66',25,2);for(let i=0;i<30;i++)circ(x,(i*137)%W,500+(i*53)%90,5,['#ff8787','#ffd43b','#fff'][i%3])},
 castle:x=>{x.fillStyle=grad(x,'#a5d8ff','#fff0f6');x.fillRect(0,0,W,H);cloud(x,130,90,35);cloud(x,640,120,30);hills(x,430,'#b2f2bb',25);
   x.fillStyle='#dee2e6';x.fillRect(300,250,200,220);x.fillRect(255,190,70,280);x.fillRect(475,190,70,280);x.fillRect(370,150,60,110);
   [[255,190,70],[475,190,70],[370,150,60]].forEach(([a,b,w])=>poly(x,[[a-8,b],[a+w/2,b-70],[a+w+8,b]],'#e64980'));
   [[290,120],[510,120],[400,80]].forEach(([a,b])=>{x.fillStyle='#868e96';x.fillRect(a,b-40,3,40);poly(x,[[a+3,b-40],[a+30,b-32],[a+3,b-24]],'#ffd43b')});
   x.fillStyle='#8d5524';x.beginPath();x.moveTo(370,470);x.lineTo(370,400);x.arc(400,400,30,Math.PI,0);x.lineTo(430,470);x.fill();
   [[275,260],[495,260],[390,190],[330,320],[455,320]].forEach(([a,b])=>{x.fillStyle='#4dabf7';x.fillRect(a,b,22,30)});hills(x,480,'#69db7c',15,1)},
 jungle:x=>{x.fillStyle=grad(x,'#96f2d7','#2b8a3e');x.fillRect(0,0,W,H);for(let i=0;i<9;i++){x.save();x.translate((i*97)%W,i%2?40:520);x.rotate(i);x.fillStyle=i%2?'#2b8a3e':'#37b24d';x.beginPath();x.ellipse(0,0,140,45,0,0,7);x.fill();x.restore()}
   x.strokeStyle='#2b8a3e';x.lineWidth=6;for(let i=0;i<6;i++){x.beginPath();x.moveTo(60+i*140,0);x.quadraticCurveTo(80+i*140,120,50+i*140,200+i%3*40);x.stroke()}hills(x,480,'#5c940d',20);[[150,470],[600,500],[420,520]].forEach(([a,b])=>circ(x,a,b,12,'#ff6b6b'))},
 moon:x=>{x.fillStyle=grad(x,'#0b1026','#2b2f77');x.fillRect(0,0,W,H);stars(x,90,380);circ(x,640,130,55,'#4dabf7');circ(x,625,115,22,'#69db7c');circ(x,660,150,16,'#69db7c');
   x.fillStyle='#adb5bd';x.beginPath();x.moveTo(0,H);x.lineTo(0,440);x.quadraticCurveTo(400,380,800,450);x.lineTo(W,H);x.fill();[[150,500,40],[420,470,28],[620,530,50],[300,560,22]].forEach(([a,b,r])=>{x.fillStyle='#868e96';x.beginPath();x.ellipse(a,b,Math.abs(r),Math.abs(r*.35),0,0,7);x.fill()})},
 sea:x=>{x.fillStyle=grad(x,'#74c0fc','#1864ab');x.fillRect(0,0,W,H);x.fillStyle='rgba(255,255,255,.12)';for(let i=0;i<4;i++)poly(x,[[100+i*180,0],[160+i*180,0],[60+i*200,H],[i*200,H]],'rgba(255,255,255,.1)');
   x.fillStyle='#ffe8a1';x.beginPath();x.moveTo(0,H);for(let i=0;i<=W;i+=20)x.lineTo(i,520+Math.sin(i/60)*12);x.lineTo(W,H);x.fill();
   x.strokeStyle='#2f9e44';x.lineWidth=10;x.lineCap='round';[[80,530],[140,540],[690,525],[740,535]].forEach(([a,b])=>{x.beginPath();x.moveTo(a,b);for(let k=1;k<6;k++)x.lineTo(a+(k%2?14:-14),b-k*28);x.stroke()});
   [[300,525,'#ff8787'],[330,515,'#f783ac'],[520,530,'#ffa94d']].forEach(([a,b,c])=>circ(x,a,b,18,c));[[200,200],[600,120],[450,300]].forEach(([a,b])=>{x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.arc(a,b,10,0,7);x.stroke()})},
 candy:x=>{x.fillStyle=grad(x,'#ffdeeb','#fff0f6');x.fillRect(0,0,W,H);cloud(x,180,100,40,'#fcc2d7');cloud(x,600,80,34,'#fff');
   [[120,430,60,'#ff6b6b'],[650,420,70,'#845ef7'],[380,450,45,'#20c997']].forEach(([a,b,r,c])=>{x.fillStyle='#fff';x.fillRect(a-5,b,10,140);circ(x,a,b,r,c);x.strokeStyle='#fff';x.lineWidth=8;x.beginPath();for(let t=0;t<12;t+=.2)x.lineTo(a+Math.cos(t)*t*r/12,b+Math.sin(t)*t*r/12);x.stroke()});
   x.fillStyle='#fcc2d7';x.beginPath();x.moveTo(0,H);for(let i=0;i<=W;i+=20)x.lineTo(i,520+Math.sin(i/50)*10);x.lineTo(W,H);x.fill();for(let i=0;i<20;i++)circ(x,(i*89)%W,540+(i*37)%50,6,['#fff','#ffd43b','#74c0fc'][i%3])},
 city:x=>{x.fillStyle=grad(x,'#ffa94d','#845ef7');x.fillRect(0,0,W,H);circ(x,650,160,40,'#fff3bf');
   [[20,250,90],[120,180,80],[210,280,100],[320,140,90],[420,220,110],[540,170,80],[630,260,90],[720,200,80]].forEach(([a,b,w],i)=>{x.fillStyle=i%2?'#343a40':'#495057';x.fillRect(a,b,w,H-b);x.fillStyle='#ffe066';for(let yy=b+20;yy<480;yy+=36)for(let xx=a+12;xx<a+w-16;xx+=26)if((xx+yy+i)%3)x.fillRect(xx,yy,12,16)});
   x.fillStyle='#212529';x.fillRect(0,500,W,100);x.fillStyle='#fff';for(let i=0;i<W;i+=80)x.fillRect(i,548,40,6)},
 snow:x=>{x.fillStyle=grad(x,'#d0ebff','#f8f9fa');x.fillRect(0,0,W,H);poly(x,[[0,430],[200,150],[400,430]],'#ced4da');poly(x,[[300,430],[560,100],[800,430]],'#adb5bd');poly(x,[[155,215],[200,150],[245,215],[220,200],[200,225],[180,200]],'#fff');poly(x,[[505,170],[560,100],[615,170],[585,155],[560,180],[535,155]],'#fff');
   x.fillStyle='#fff';x.fillRect(0,430,W,170);[[90,520],[170,490],[640,510],[720,480]].forEach(([a,b])=>pine(x,a,b,110));for(let i=0;i<50;i++)circ(x,(i*151)%W,(i*71)%420,3,'#fff')},
 dino:x=>{x.fillStyle=grad(x,'#ffd8a8','#fff4e6');x.fillRect(0,0,W,H);poly(x,[[380,420],[520,140],[580,140],[720,420]],'#8d5524');poly(x,[[520,140],[550,180],[580,140]],'#ff6b00');[[550,110,30],[575,70,38],[540,30,30]].forEach(([a,b,r])=>circ(x,a,b,r,'rgba(134,142,150,.7)'));
   x.fillStyle='#4dabf7';x.fillRect(0,400,W,40);hills(x,450,'#94d82d',15);palm(x,120,520,160);palm(x,280,540,130)},
 cave:x=>{x.fillStyle=grad(x,'#495057','#212529');x.fillRect(0,0,W,H);for(let i=0;i<10;i++)poly(x,[[i*85,0],[i*85+40,60+(i*37)%90],[i*85+80,0]],'#343a40');
   [[150,470,'#66d9e8'],[600,440,'#cc5de8'],[420,500,'#66d9e8'],[700,510,'#ffd43b']].forEach(([a,b,c])=>{x.shadowColor=c;x.shadowBlur=25;poly(x,[[a,b],[a+15,b-50],[a+30,b]],c);poly(x,[[a+20,b],[a+38,b-35],[a+52,b]],c);x.shadowBlur=0});x.fillStyle='#343a40';x.fillRect(0,510,W,90)},
 sky:x=>{x.fillStyle=grad(x,'#4dabf7','#d0ebff');x.fillRect(0,0,W,H);['#ff6b6b','#ffa94d','#ffd43b','#69db7c','#4dabf7','#845ef7'].forEach((c,i)=>{x.strokeStyle=c;x.lineWidth=16;x.beginPath();x.arc(400,520,320-i*16,Math.PI,0);x.stroke()});
   cloud(x,150,150,45);cloud(x,620,110,38);cloud(x,120,560,90);cloud(x,400,590,110);cloud(x,700,560,90)},
 forest:x=>{x.fillStyle=grad(x,'#b2f2bb','#ebfbee');x.fillRect(0,0,W,H);hills(x,430,'#8ce99a',20);[[60,450,120],[190,430,100],[620,440,120],[740,460,110],[330,420,80],[500,425,85]].forEach(([a,b,s],i)=>tree(x,a,b,s,i%2?'#2f9e44':'#37b24d'));
   x.fillStyle='#e9c46a';x.beginPath();x.moveTo(330,H);x.quadraticCurveTo(400,480,420,440);x.lineTo(450,440);x.quadraticCurveTo(470,500,520,H);x.fill();[[250,540],[560,560]].forEach(([a,b])=>{x.fillStyle='#fff';x.fillRect(a-4,b-12,8,14);circ(x,a,b-14,14,'#fa5252')})},
 beach:x=>{x.fillStyle=grad(x,'#99e9f2','#e3fafc');x.fillRect(0,0,W,H);circ(x,140,110,50,'#ffd43b');x.fillStyle='#22b8cf';x.fillRect(0,330,W,110);x.fillStyle='rgba(255,255,255,.6)';for(let i=0;i<W;i+=60)x.fillRect(i,360+(i%120?10:30),30,4);
   x.fillStyle='#ffec99';x.beginPath();x.moveTo(0,H);x.lineTo(0,430);x.quadraticCurveTo(400,400,800,440);x.lineTo(W,H);x.fill();palm(x,680,540,170);x.fillStyle='#fff';x.fillRect(250,420,6,110);poly(x,[[170,430],[253,370],[336,430]],'#ff6b6b')},
 home:x=>{x.fillStyle=grad(x,'#a5d8ff','#e7f5ff');x.fillRect(0,0,W,H);cloud(x,600,100,36);hills(x,440,'#8ce99a',12);x.fillStyle='#ffe8cc';x.fillRect(260,260,280,200);poly(x,[[240,270],[400,150],[560,270]],'#e8590c');
   x.fillStyle='#8d5524';x.fillRect(375,360,50,100);x.fillStyle='#74c0fc';x.fillRect(290,300,60,50);x.fillRect(450,300,60,50);tree(x,140,470,110);tree(x,680,470,100,'#37b24d');for(let i=0;i<14;i++)circ(x,40+i*55,500+(i%2)*15,7,i%2?'#ff8787':'#ffd43b')}};
