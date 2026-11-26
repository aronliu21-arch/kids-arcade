/* ================= watch: the whole story, scene by scene ================= */
let wi=0,wTimer=null,wAuto=true,wPeek=false;
function watch(i,peek){wPeek=!!peek;show('watch');wi=i;$('wTitle').textContent=story.title||'';mountStage($('wStage'),()=>story.scenes[wi],{quiet:false});wShow()}
function wShow(){clearTimeout(wTimer);const sc=story.scenes[wi];setTimeout(()=>stage&&stage.play&&stage.play(),50);const _z0=0,z=Z(),lastOne=wi===story.scenes.length-1;
  $('wText').textContent=mix(sc.lines.join(z?'':' '));$('wCount').textContent=`${wi+1} / ${story.scenes.length}`;
  $('wEnd').style.display=lastOne?'flex':'none';$('wEnd').innerHTML=lastOne?(story.done&&!wPeek?`<div class="theend">🎬 ${z?'全劇終':'The End'} 🎉</div>`:'')+`<div class="row" style="justify-content:center"><button class="btn go" id="wAgain">↻ ${z?'再看一次':'Watch again'}</button><button class="btn" id="wEdit">✏️ ${story.done?(z?'修改故事':'Change story'):(z?'繼續寫':'Keep writing')}</button><button class="btn" id="wShelf">📚 ${z?'我的故事':'My stories'}</button></div>`:'';
  if(lastOne){$('wAgain').onclick=()=>{wi=0;wShow()};$('wEdit').onclick=()=>{hist=[];if(story.done){story.done=false;if(curScene().kind==='end')story.scenes.pop()}touch();openBuild()};$('wShelf').onclick=()=>openShelf()}
  const u=speak(mix(sc.lines.join(z?'':' ')));
  if(wAuto&&!lastOne){const next=()=>{if($('watch').classList.contains('on')&&story.scenes[wi]===sc){wi++;wShow()}};if(u&&'onend'in u){u.onend=()=>{wTimer=setTimeout(next,1200)};wTimer=setTimeout(next,25000)}else wTimer=setTimeout(next,6000)}}
$('wPrev').onclick=()=>{if(wi>0){wi--;wShow()}};$('wNext').onclick=()=>{if(wi<story.scenes.length-1){wi++;wShow()}};
$('wPlay').onclick=()=>{wAuto=!wAuto;$('wPlay').textContent=wAuto?'⏸':'▶';if(wAuto)wShow();else{clearTimeout(wTimer);try{speechSynthesis.cancel()}catch(e){}}};
$('wBack').onclick=()=>{clearTimeout(wTimer);try{speechSynthesis.cancel()}catch(e){}if(wPeek)openBuild();else openShelf()};

/* ---------- drawing pad: layers = background (white / loaded picture) → movable emoji stickers → pen ink on top ---------- */
const COLORS=['#2b2118','#e03131','#f76707','#fcc419','#2f9e44','#1c7ed6','#7048e8','#e64980','#8d5524','#ffc9a8','#868e96','#ffffff'];
const dc=$('dc'),vx=dc.getContext('2d'),ink=document.createElement('canvas'),dx=ink.getContext('2d');
let dColor=COLORS[0],dSize=10,dTool='pen',dUndo=[],dCb=null,dDirty=false,CW=800,CH=600,dTrans=false,baseImg=null,stk=[],sel=-1;
const EMOFONT='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';
$('dbar2').innerHTML=COLORS.map((c,i)=>`<button class="sw${i?'':' sel'}" style="background:${c}" data-col="${c}"></button>`).join('')+
  `<button class="tool sel" data-t="pen">✏️</button><button class="tool" data-t="fill">🪣</button><button class="tool" data-t="eraser">🧽</button><button class="tool" id="dSize">● ${dSize}</button><button class="tool" data-t="move" title="move stickers">✋</button>
   <span class="stkbtns" id="stkBtns"><button class="tool" id="stkSmall">➖</button><button class="tool" id="stkBig">➕</button><button class="tool" id="stkDel">🗑️</button></span>`;
$('dbar2').querySelectorAll('[data-col]').forEach(b=>b.onclick=()=>{dColor=b.dataset.col;if(dTool!=='fill')setTool('pen');$('dbar2').querySelectorAll('.sw').forEach(x=>x.classList.toggle('sel',x===b))});
function setTool(t){dTool=t;if(t!=='move'){sel=-1;$('dbar3').querySelectorAll('[data-em]').forEach(x=>x.classList.remove('sel'))}$('dbar2').querySelectorAll('[data-t]').forEach(x=>x.classList.toggle('sel',x.dataset.t===t));showStkBtns();render()}
$('dbar2').querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>setTool(b.dataset.t));
const SIZES=[4,10,20,36];$('dSize').onclick=()=>{dSize=SIZES[(SIZES.indexOf(dSize)+1)%SIZES.length];$('dSize').textContent='● '+dSize;if(dTool==='move')setTool('pen')};
function showStkBtns(){$('stkBtns').style.display=sel>=0?'contents':'none'}
const resizeSel=f=>{if(sel<0)return;snap();stk[sel].s=clamp(stk[sel].s*f,40,CW*1.2);dDirty=true;render()};
$('stkSmall').onclick=()=>resizeSel(1/1.25);$('stkBig').onclick=()=>resizeSel(1.25);
$('stkDel').onclick=()=>{if(sel<0)return;snap();stk.splice(sel,1);sel=-1;dDirty=true;showStkBtns();render()};
function fitDraw(){const st=dc.parentElement.getBoundingClientRect();const s=Math.min((st.width-16)/CW,(st.height-16)/CH);dc.style.width=CW*s+'px';dc.style.height=CH*s+'px'}
addEventListener('resize',()=>{if($('draw').classList.contains('on'))fitDraw()});
function compose(ctx2,withUI){ctx2.clearRect(0,0,CW,CH);if(!dTrans){ctx2.fillStyle='#fff';ctx2.fillRect(0,0,CW,CH)}
  if(dScene&&!baseImg){const g2=ctx2.createLinearGradient(0,0,0,CH);g2.addColorStop(0,'#d0ebff');g2.addColorStop(.68,'#e7f5ff');g2.addColorStop(.68,'#d3f9d8');g2.addColorStop(1,'#b2f2bb');ctx2.fillStyle=g2;ctx2.fillRect(0,0,CW,CH)}
  if(baseImg)ctx2.drawImage(baseImg.c,0,0);
  for(const s of stk){ctx2.font=s.s+'px '+EMOFONT;ctx2.textAlign='center';ctx2.textBaseline='middle';ctx2.fillText(s.e,s.x,s.y)}
  ctx2.drawImage(ink,0,0);
  if(withUI&&sel>=0&&stk[sel]){const s=stk[sel],h=s.s*.62,hr=handleR();ctx2.setLineDash([12,8]);ctx2.lineWidth=4;ctx2.strokeStyle='#e8590c';ctx2.strokeRect(s.x-h,s.y-h,h*2,h*2);ctx2.setLineDash([]);
    ctx2.fillStyle='#e8590c';ctx2.beginPath();ctx2.arc(s.x+h,s.y+h,hr,0,7);ctx2.fill();ctx2.fillStyle='#fff';ctx2.font=`${hr*1.2}px sans-serif`;ctx2.textAlign='center';ctx2.textBaseline='middle';ctx2.fillText('⤡',s.x+h,s.y+h+1)}}
let rq=0;function render(){if(rq)return;rq=requestAnimationFrame(()=>{rq=0;compose(vx,true)})}
const handleR=()=>Math.max(18,26*CW/(dc.clientWidth||CW));
const EMO_MORE=['😀','😎','🥳','😴','😡','👑','🎩','🕶️','🎀','⭐','❤️','🌈','☀️','🌙','☁️','⚡','🔥','💧','🌸','🌳','🍄','🏠','🚀','⚽','🎈','🎁','🍦','🍕','🐾','✨'];
let drawEmojis=[];
function fillEmo(){const list=[...new Set([...drawEmojis,...EMO_MORE])];$('dbar3').innerHTML=`<span>😀 ${Z()?'貼圖':'Stickers'}:</span>`+list.map(e=>`<button data-em="${e}">${e}</button>`).join('');
  $('dbar3').querySelectorAll('[data-em]').forEach(b=>b.onclick=()=>{snap();const n=stk.filter(s=>s.e===b.dataset.em).length;
    stk.push({e:b.dataset.em,x:CW/2+n*30,y:CH/2+n*30,s:Math.round(CW*.32)});sel=stk.length-1;dDirty=true;setTool('move');sel=stk.length-1;showStkBtns();render();
    toast(Z()?'拖曳移動,拉角落變大變小,再用筆畫上去!':'Drag to move, pull the corner to resize, then draw on it!')})}
let dScene=false;
function openDraw(what,img,cb,trans,scene){dScene=!!scene;fillEmo();dCb=cb;dUndo=[];dDirty=false;dTrans=!!trans;CW=dTrans?640:800;CH=dTrans?640:600;dc.width=ink.width=CW;dc.height=ink.height=CH;
  stk=[];sel=-1;baseImg=null;dx.clearRect(0,0,CW,CH);setTool('pen');
  dc.classList.toggle('trans',dTrans);$('dWhat').textContent='🎨 '+what+(dTrans?' — draw just the character 只畫角色,不用畫背景':dScene?' — draw the whole background 畫整個背景,它會換掉原本的背景':'');$('draw').classList.add('on');
  if(img){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=CW;c.height=CH;const x=c.getContext('2d');
    if(dTrans){const r=Math.min(560/im.width,560/im.height);x.drawImage(im,(CW-im.width*r)/2,(CH-im.height*r)/2,im.width*r,im.height*r)}else x.drawImage(im,0,0,CW,CH);baseImg={c};render()};im.src=img}
  if(kid==='milo'&&dSize<20){dSize=20;$('dSize').textContent='● 20'}requestAnimationFrame(()=>{fitDraw();render()})}
function closeDraw(){$('draw').classList.remove('on')}
function flat(){const c=document.createElement('canvas');c.width=CW;c.height=CH;compose(c.getContext('2d'),false);return c}
function trimmed(){const c=flat(),d=c.getContext('2d').getImageData(0,0,CW,CH).data;let x0=CW,y0=CH,x1=-1,y1=-1;
  for(let y=0;y<CH;y++)for(let x=0;x<CW;x++)if(d[(y*CW+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0)return'';const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,-x0,-y0);return o.toDataURL('image/png')}
$('dCancel').onclick=closeDraw;
$('dDone').onclick=()=>{sel=-1;if(dDirty&&dCb)dCb(dTrans?trimmed():flat().toDataURL('image/jpeg',.85));closeDraw()};
$('dUndo').onclick=()=>{const u=dUndo.pop();if(!u)return;dx.putImageData(u.ink,0,0);stk=JSON.parse(u.stk);baseImg=u.base;sel=-1;showStkBtns();render()};
$('dClear').onclick=()=>{snap();dx.clearRect(0,0,CW,CH);stk=[];baseImg=null;sel=-1;dDirty=true;showStkBtns();render()};
function snap(){try{dUndo.push({ink:dx.getImageData(0,0,CW,CH),stk:JSON.stringify(stk),base:baseImg});if(dUndo.length>12)dUndo.shift()}catch(e){}}
const dp=e=>{const r=dc.getBoundingClientRect();return{x:(e.clientX-r.left)*CW/r.width,y:(e.clientY-r.top)*CH/r.height}};
let dDown=false,dLast=null,grab=null;const ptrs=new Map();
function hitStk(p){for(let i=stk.length-1;i>=0;i--){const s=stk[i],h=s.s*.62;if(Math.abs(p.x-s.x)<h&&Math.abs(p.y-s.y)<h)return i}return-1}
dc.addEventListener('pointerdown',e=>{e.preventDefault();dc.setPointerCapture(e.pointerId);const p=dp(e);ptrs.set(e.pointerId,p);
  if(dTool==='move'){
    if(ptrs.size===2&&sel>=0){const [a,b]=[...ptrs.values()];grab={pinch:true,d0:Math.hypot(a.x-b.x,a.y-b.y)||1,s0:stk[sel].s};return}
    if(sel>=0){const s=stk[sel],h=s.s*.62;if(Math.hypot(p.x-(s.x+h),p.y-(s.y+h))<handleR()*1.6){snap();grab={resize:true,d0:Math.hypot(p.x-s.x,p.y-s.y)||1,s0:s.s};return}}
    const i=hitStk(p);sel=i;showStkBtns();if(i>=0){snap();const s=stk.splice(i,1)[0];stk.push(s);sel=stk.length-1;grab={dx:s.x-p.x,dy:s.y-p.y}}render();return}
  snap();dDirty=true;
  if(dTool==='fill'){flood(Math.round(p.x),Math.round(p.y),dColor);render();return}
  dDown=true;dLast=p;stroke(p,p);render()});
dc.addEventListener('pointermove',e=>{if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,dp(e));
  if(dTool==='move'){if(!grab||sel<0)return;const s=stk[sel];
    if(grab.pinch&&ptrs.size>=2){const [a,b]=[...ptrs.values()];s.s=clamp(grab.s0*Math.hypot(a.x-b.x,a.y-b.y)/grab.d0,40,CW*1.2)}
    else if(grab.resize){const p=dp(e);s.s=clamp(grab.s0*Math.hypot(p.x-s.x,p.y-s.y)/grab.d0,40,CW*1.2)}
    else if(!grab.pinch){const p=dp(e);s.x=clamp(p.x+grab.dx,0,CW);s.y=clamp(p.y+grab.dy,0,CH)}
    dDirty=true;render();return}
  if(!dDown)return;for(const ev of(e.getCoalescedEvents?e.getCoalescedEvents():[e])){const p=dp(ev);stroke(dLast,p);dLast=p}render()});
['pointerup','pointercancel'].forEach(t=>dc.addEventListener(t,e=>{ptrs.delete(e.pointerId);dDown=false;if(ptrs.size===0)grab=null;else if(grab&&grab.pinch)grab=null}));
function stroke(a,b){const er=dTool==='eraser';dx.globalCompositeOperation=er?'destination-out':'source-over';
  dx.strokeStyle=er?'#000':dColor;dx.lineWidth=er?dSize*2:dSize;dx.lineCap=dx.lineJoin='round';dx.beginPath();dx.moveTo(a.x,a.y);dx.lineTo(b.x+.01,b.y);dx.stroke();dx.globalCompositeOperation='source-over'}
// paint bucket: edges come from everything you can see (stickers + lines), paint goes on the ink layer
function flood(x,y,hex){if(x<0||y<0||x>=CW||y>=CH)return;const cv=flat(),cd=cv.getContext('2d').getImageData(0,0,CW,CH),d=cd.data,im=dx.getImageData(0,0,CW,CH),o=im.data,i0=(y*CW+x)*4,R=CW*4;
  const t=[d[i0],d[i0+1],d[i0+2],d[i0+3]],c=[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16),255];if(t.every((v,i)=>Math.abs(v-c[i])<8))return;
  const seen=new Uint8Array(CW*CH),filled=[];const near=i=>!seen[i>>2]&&(t[3]<20?d[i+3]<20:(d[i+3]>=20&&Math.abs(d[i]-t[0])+Math.abs(d[i+1]-t[1])+Math.abs(d[i+2]-t[2])<90));const st=[[x,y]];
  while(st.length){let[px,py]=st.pop();let i=(py*CW+px)*4;if(!near(i))continue;while(px>=0&&near(i)){px--;i-=4}px++;i+=4;let up=false,dn=false;
    while(px<CW&&near(i)){seen[i>>2]=1;o[i]=c[0];o[i+1]=c[1];o[i+2]=c[2];o[i+3]=255;filled.push(i);
      if(py>0){const u=i-R;if(near(u)){if(!up){st.push([px,py-1]);up=true}}else up=false}
      if(py<CH-1){const w=i+R;if(near(w)){if(!dn){st.push([px,py+1]);dn=true}}else dn=false}px++;i+=4}}
  if(t[3]<20){for(const i of filled){const x0=(i/4)%CW,y0=(i/4/CW)|0;for(let oy=-2;oy<=2;oy++)for(let ox=-2;ox<=2;ox++){const xx=x0+ox,yy=y0+oy;if(xx<0||yy<0||xx>=CW||yy>=CH)continue;
      const j=(yy*CW+xx)*4;if(seen[j>>2])continue;const al=d[j+3]/255;if(al>=.99||al<.02)continue;if(o[j+3]>250)continue;o[j]=d[j]*al+c[0]*(1-al);o[j+1]=d[j+1]*al+c[1]*(1-al);o[j+2]=d[j+2]*al+c[2]*(1-al);o[j+3]=255}}}
  dx.putImageData(im,0,0)}

