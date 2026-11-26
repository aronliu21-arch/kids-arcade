/* ---------- input: pan, pinch, tap ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
function groundAt(x,y){ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(ndc,cam);const p=new THREE.Vector3();return ray.ray.intersectPlane(plane,p)?p:null;}
function critterAt(x,y){ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(ndc,cam);const hits=ray.intersectObjects([...critters.values()].map(c=>c.hit));return hits.length?hits[0].object.userData.critter:null;}
const ptrs=new Map();let moved=false,pinch0=0,zoom0=1,downAt=null;
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=false;downAt={x:e.clientX,y:e.clientY};
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0=Math.hypot(a.x-b.x,a.y-b.y);zoom0=view.zoom;}});
canvas.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);
  if(!p){if(mode==='build'&&e.pointerType==='mouse')ghostAt(e.clientX,e.clientY);return;}
  if(ptrs.size===1){if(Math.hypot(e.clientX-downAt.x,e.clientY-downAt.y)>9)moved=true;
    if(moved){const a=groundAt(p.x,p.y),b=groundAt(e.clientX,e.clientY);if(a&&b){view.x=clamp(view.x+a.x-b.x,-11,11);view.z=clamp(view.z+a.z-b.z,-11+rMin(),12);placeCam();}}}
  else if(ptrs.size===2){moved=true;p.x=e.clientX;p.y=e.clientY;const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);view.zoom=clamp(zoom0*d/Math.max(pinch0,1),.6,2.4);placeCam();return;}
  p.x=e.clientX;p.y=e.clientY;if(mode==='build'&&e.pointerType==='mouse')ghostAt(e.clientX,e.clientY);});
function up(e){const had=ptrs.has(e.pointerId);ptrs.delete(e.pointerId);if(had&&!moved&&ptrs.size===0)tap(e.clientX,e.clientY);}
canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',e=>ptrs.delete(e.pointerId));
canvas.addEventListener('wheel',e=>{e.preventDefault();view.zoom=clamp(view.zoom*(e.deltaY>0?.9:1.1),.6,2.4);placeCam();},{passive:false});

const ghost=new THREE.Mesh(new THREE.BoxGeometry(1,.06,1),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.45,depthWrite:false}));ghost.visible=false;scene.add(ghost);
function cellAt(x,y){const p=groundAt(x,y);if(!p)return null;return {c:Math.floor(p.x+GRID/2),r:Math.floor(p.z+GRID/2),p};}
function penNear(x,y){const g=groundAt(x,y);if(!g)return null;let best=null,bd=1e9;for(const p of pens()){const c=itemCenter(p);const d=Math.max(Math.abs(g.x-c.x),Math.abs(g.z-c.z));if(d<2.9&&d<bd){bd=d;best=p;}}return best;}
function anchorFor(type,cell){const d=ITEM[type];return {c:cell.c-Math.floor((d.w-1)/2),r:cell.r-Math.floor((d.h-1)/2)};}
function ghostAt(x,y){if(!buildSel||buildSel==='remove'||buildSel==='expand'){ghost.visible=false;return;}const cl=cellAt(x,y);if(!cl){ghost.visible=false;return;}const a=anchorFor(buildSel,cl);const d=ITEM[buildSel];
  ghost.visible=true;ghost.scale.set(d.w,1,d.h);ghost.position.set(a.c-GRID/2+d.w/2,.08,a.r-GRID/2+d.h/2);ghost.material.color.set(fits(buildSel,a.c,a.r)?'#ffffff':'#e8573c');}

function tap(x,y){audio();
  if(mode!=='choosePen'&&collectAt(x,y))return;
  if(mode==='zoo'){const c=critterAt(x,y);if(c){pet(c);showSign(c);return;}closeSign();const cl=cellAt(x,y);if(cl){const it=itemAt(cl.c,cl.r);if(it&&it.type.startsWith('pen_')){const cs=[...critters.values()].filter(k=>k.a.pen===it.id&&!k.food&&!k.anim);
      if(cs.length){cs.forEach((k,i)=>{const b=k.bounds();k.target=new THREE.Vector3(clamp(cl.p.x+rand(-.4,.4),b.x0,b.x1),0,clamp(cl.p.z+rand(-.4,.4),b.z0,b.z1));setTimeout(()=>playSound(k),i*350);});}
      else toast('This pen is empty. Draw an animal for it!');}}return;}
  if(mode==='feed'){const c=critterAt(x,y);if(c){giveFood(c,FOODS.find(f=>f.id===foodSel)||FOODS[0]);return;}
    const cl=cellAt(x,y);const it=penNear(x,y);if(it&&cl){const inPen=[...critters.values()].filter(k=>k.a.pen===it.id&&!k.food);if(inPen.length){giveFood(inPen[(Math.random()*inPen.length)|0],FOODS.find(f=>f.id===foodSel),cl.p);return;}}
    SFX.nope();toast('Tap an animal to feed it');return;}
  if(mode==='build'){if(buildSel==='expand'){toast('Tap Bigger zoo again to buy it');return;}const cl=cellAt(x,y);if(!cl)return;
    if(buildSel==='remove'){const it=itemAt(cl.c,cl.r);if(!it){SFX.nope();return;}
      if(it.type.startsWith('pen_')&&S.animals.some(a=>a.pen===it.id)){SFX.nope();toast('Animals live here. Move them first');speak('Animals live in this pen. Move them first.');return;}
      const o=itemObjs.get(it.id);if(o)scene.remove(o);itemObjs.delete(it.id);dropBubble(it.id);S.items=S.items.filter(i=>i!==it);save();SFX.pop();return;}
    const a=anchorFor(buildSel,cl);if(!fits(buildSel,a.c,a.r)){SFX.nope();toast("That spot's taken");return;}
    if(!spendCoins(costOf(buildSel),'to build that'))return;
    const it={id:S.nextItem++,type:buildSel,c:a.c,r:a.r};S.items.push(it);const o=addItemObj(it);save();SFX.place();
    if(!reduced){o.scale.setScalar(.01);popIn.push({o,t:0});}
    if(it.type.startsWith('pen_')&&!S.stamps.some(s=>s.kind==='build'&&s.label===ITEM[it.type].label&&s.kid===S.profile))addStamp('build',null,'You built a '+ITEM[it.type].label.toLowerCase());
    ghostAt(x,y);return;}
  if(mode==='choosePen'){const it=penNear(x,y);if(it){finishPlace(it);}else{SFX.nope();toast('Tap inside a pen');}}
}
const popIn=[];
function pet(c){playSound(c);c.kick(1);hearts(c.g.position,5);const d=today();
  if(!S.stamps.some(s=>s.kind==='pet'&&s.animal===c.a.id&&s.day===d)&&S.profile)setTimeout(()=>addStamp('pet',c.a,'You hugged '+c.a.name),700);}

/* ---------- drawing overlay ---------- */
const paper=$('#paper'),px=paper.getContext('2d');
const COLS=['#1f2a44','#e8573c','#f08a3c','#f4c542','#3fa34d','#2c8fc0','#7048e8','#ff6fa8','#8a5a2b','#9aa7b5','#ffffff','#5bc0eb'];
let pen={col:COLS[0],size:16,erase:false},hist=[],drawn=false,strokes=0;
$('#swatches').innerHTML=COLS.map((c,i)=>'<button class="sw'+(i?'':' sel')+'" style="background:'+c+'" data-c="'+c+'" aria-label="Colour '+(i+1)+'"></button>').join('');
$('#sizes').innerHTML=[8,16,30].map(s=>'<button class="sz'+(s===16?' sel':'')+'" data-s="'+s+'" aria-label="Brush size"><i style="width:'+(s*.6+4)+'px;height:'+(s*.6+4)+'px"></i></button>').join('');
$('#swatches').onclick=e=>{const b=e.target.closest('.sw');if(!b)return;pen.col=b.dataset.c;pen.erase=false;$('#eraser').classList.remove('sel');document.querySelectorAll('.sw').forEach(x=>x.classList.toggle('sel',x===b));SFX.tap();};
$('#sizes').onclick=e=>{const b=e.target.closest('.sz');if(!b)return;pen.size=+b.dataset.s;document.querySelectorAll('.sz').forEach(x=>x.classList.toggle('sel',x===b));SFX.tap();};
$('#eraser').onclick=()=>{pen.erase=!pen.erase;pen.fill=false;$('#fill').classList.remove('sel');$('#eraser').classList.toggle('sel',pen.erase);SFX.tap();};
$('#fill').onclick=()=>{pen.fill=!pen.fill;pen.erase=false;$('#eraser').classList.remove('sel');$('#fill').classList.toggle('sel',pen.fill);SFX.tap();if(pen.fill)speak('Tap inside your animal to fill it with color');};
$('#undo').onclick=()=>{if(hist.length){px.putImageData(hist.pop(),0,0);strokes=Math.max(0,strokes-1);SFX.tap();}};
$('#clear').onclick=()=>{hist.push(px.getImageData(0,0,640,640));px.clearRect(0,0,640,640);strokes=0;SFX.pop();};
let last=null,dpid=null;
function pp(e){const r=paper.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*640,y:(e.clientY-r.top)/r.height*640};}
paper.addEventListener('pointerdown',e=>{if(dpid!==null)return;if(pen.fill){const q=pp(e);const snap=px.getImageData(0,0,640,640);if(floodFill(q.x,q.y,pen.col)){hist.push(snap);if(hist.length>25)hist.shift();strokes++;SFX.pop();}return;}dpid=e.pointerId;paper.setPointerCapture(e.pointerId);hist.push(px.getImageData(0,0,640,640));if(hist.length>25)hist.shift();last=pp(e);dot(last);});
paper.addEventListener('pointermove',e=>{if(e.pointerId!==dpid)return;const p=pp(e);seg(last,p);last=p;});
function endStroke(e){if(e.pointerId!==dpid)return;dpid=null;last=null;strokes++;}
paper.addEventListener('pointerup',endStroke);paper.addEventListener('pointercancel',endStroke);
function style(){px.globalCompositeOperation=pen.erase?'destination-out':'source-over';px.strokeStyle=px.fillStyle=pen.col;px.lineWidth=pen.erase?pen.size*2:pen.size;px.lineCap=px.lineJoin='round';}
function hexRgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function floodFill(fx,fy,hex){const W=640,H=640,x=clamp(Math.floor(fx),0,W-1),y=clamp(Math.floor(fy),0,H-1);const img=px.getImageData(0,0,W,H),d=img.data,s0=(y*W+x)*4;
  const empty=d[s0+3]<60,tr=d[s0],tg=d[s0+1],tb=d[s0+2],col=hexRgb(hex);
  if(!empty&&Math.abs(tr-col[0])+Math.abs(tg-col[1])+Math.abs(tb-col[2])<30)return false;
  const ok=i=>{const a=d[i*4+3];if(empty)return a<60;return a>=60&&Math.abs(d[i*4]-tr)+Math.abs(d[i*4+1]-tg)+Math.abs(d[i*4+2]-tb)<100;};
  const mark=new Uint8Array(W*H),st=[y*W+x];mark[y*W+x]=1;let n=0,edge=false;
  while(st.length){const i=st.pop();n++;const xx=i%W,yy=(i/W)|0;if(xx===0||yy===0||xx===W-1||yy===H-1)edge=true;
    if(xx>0&&!mark[i-1]&&ok(i-1)){mark[i-1]=1;st.push(i-1);}if(xx<W-1&&!mark[i+1]&&ok(i+1)){mark[i+1]=1;st.push(i+1);}
    if(yy>0&&!mark[i-W]&&ok(i-W)){mark[i-W]=1;st.push(i-W);}if(yy<H-1&&!mark[i+W]&&ok(i+W)){mark[i+W]=1;st.push(i+W);}}
  if(empty&&edge&&n>W*H*.3){toast('Tap inside your animal to fill it');return false;}
  for(let g=0;g<2;g++){const grow=[];for(let i=0;i<W*H;i++){if(!mark[i])continue;const xx=i%W;for(const j of [xx>0?i-1:-1,xx<W-1?i+1:-1,i-W,i+W]){if(j<0||j>=W*H||mark[j])continue;if(d[j*4+3]<250)grow.push(j);}}grow.forEach(j=>mark[j]=2);}
  for(let i=0;i<W*H;i++){if(!mark[i])continue;const k=i*4;if(mark[i]===1){d[k]=col[0];d[k+1]=col[1];d[k+2]=col[2];d[k+3]=255;}
    else{const a=d[k+3]/255;d[k]=d[k]*a+col[0]*(1-a);d[k+1]=d[k+1]*a+col[1]*(1-a);d[k+2]=d[k+2]*a+col[2]*(1-a);d[k+3]=255;}}
  px.putImageData(img,0,0);return true;}
function dot(p){style();px.beginPath();px.arc(p.x,p.y,px.lineWidth/2,0,7);px.fill();}
function seg(a,b){style();px.beginPath();px.moveTo(a.x,a.y);px.lineTo(b.x,b.y);px.stroke();}
function fitPaper(){const w=paper.parentElement;if(!w||$('#draw').hidden)return;paper.style.width=paper.style.height='';const s=Math.floor(Math.min(w.clientWidth,w.clientHeight));if(s>40){paper.style.width=paper.style.height=s+'px';}}
function drawStepIs(k){$('#draw').dataset.step=k;}
function openDraw(){audio();closeSign();if(tickets()<COST.draw){needTickets(COST.draw,'to draw an animal');return;}$('#draw').hidden=false;drawStepIs('draw');requestAnimationFrame(fitPaper);$('#drawStep').hidden=false;$('#revealStep').hidden=true;$('#drawTitle').textContent='Draw an animal';
  px.clearRect(0,0,640,640);hist=[];strokes=0;speak('Draw any animal you like. Make it big, and join up the lines!');}
$('#drawClose').onclick=()=>{if(made&&!$('#revealStep').hidden){$('#toZooBtn').onclick();return;}$('#draw').hidden=true;stopPreview();};

/* reveal */
let prevR=null,prevScene,prevCam,prevMesh=null,prevT=0,prevRAF=0,made=null;
function ensurePreview(){if(prevR)return;const cv=$('#preview');prevR=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});prevR.setPixelRatio(Math.min(devicePixelRatio||1,2));prevR.outputEncoding=THREE.sRGBEncoding;
  prevScene=new THREE.Scene();prevScene.add(new THREE.HemisphereLight(C('#ffffff'),C('#9fc09f'),.85));const d=new THREE.DirectionalLight(C('#fff4dc'),1);d.position.set(3,5,4);prevScene.add(d);
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.6,.18,40),mat('#4aa95a'));disc.position.y=-.09;prevScene.add(disc);
  prevCam=new THREE.PerspectiveCamera(32,1,.1,50);}
function stopPreview(){cancelAnimationFrame(prevRAF);prevRAF=0;}
function sizePreview(){const cv=$('#preview');const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;prevR.setSize(w,h,false);prevCam.aspect=w/h;prevCam.updateProjectionMatrix();}
function sparkle(){const box=$('#sparks');box.innerHTML='';if(reduced)return;for(let i=0;i<22;i++){const s=document.createElement('i');s.className='spark';s.style.left='60%';s.style.top='55%';s.style.background=['#f4c542','#e8573c','#ffffff','#5bc0eb'][i%4];box.appendChild(s);
  const a=Math.random()*Math.PI*2,r=rand(80,220);s.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+Math.cos(a)*r+'px,'+Math.sin(a)*r+'px) scale(.2)',opacity:0}],{duration:rand(600,1100),easing:'cubic-bezier(.1,.8,.2,1)',fill:'forwards'});}}
