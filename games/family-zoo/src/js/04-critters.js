/* ---------- animals ---------- */
const critters=new Map();
const shadowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(0,0,0,.38)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const imgCache={};
function loadImg(src){return new Promise((res,rej)=>{if(imgCache[src])return res(imgCache[src]);const i=new Image();i.onload=()=>{imgCache[src]=i;res(i);};i.onerror=rej;i.src=src;});}
function penOf(a){return S.items.find(i=>i.id===a.pen&&i.type.startsWith('pen_'));}
function penBounds(p){const c=itemCenter(p);return {x0:c.x-1.35,x1:c.x+1.35,z0:c.z-1.35,z1:c.z+1.25,pond:p.type==='pen_pond'};}
class Critter{
  constructor(a,inf){this.a=a;this.inf=inf;this.g=new THREE.Group();
    this.body=new THREE.Group();this.m=new THREE.Mesh(inf.geo,new THREE.MeshStandardMaterial({map:inf.tex,roughness:.55,metalness:0}));this.m.castShadow=true;this.m.receiveShadow=false;
    this.body.add(this.m);this.body.rotation.y=Math.PI/4;this.g.add(this.body);
    this.sh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));this.sh.rotation.x=-Math.PI/2;this.sh.position.y=.12;this.sh.scale.set(inf.width*.9,inf.width*.55,1);this.g.add(this.sh);
    this.hit=new THREE.Mesh(new THREE.BoxGeometry(Math.max(inf.width,.9)*1.1,Math.max(inf.height,.9)*1.15,Math.max(inf.width,.9)*.8),new THREE.MeshBasicMaterial({visible:false}));
    this.hit.position.y=inf.height/2;this.hit.rotation.y=Math.PI/4;this.hit.userData.critter=this;this.g.add(this.hit);
    this.face=1;this.phase=Math.random()*6;this.sq=0;this.sqv=0;this.hopT=0;this.wait=rand(.3,2);this.y=0;this.jump=0;this.food=null;this.anim=null;
    scene.add(this.g);this.home();}
  home(){const p=penOf(this.a);if(!p)return;const b=penBounds(p);this.g.position.set(rand(b.x0,b.x1),0,rand(b.z0,b.z1));this.target=null;}
  bounds(){const p=penOf(this.a);return p?penBounds(p):null;}
  pick(){const b=this.bounds();if(!b)return;this.target=new THREE.Vector3(rand(b.x0,b.x1),0,rand(b.z0,b.z1));}
  kick(power){this.jump=Math.max(this.jump,power||1);this.sqv-=6;}
  update(dt,t){
    if(this.hold){this.body.position.y=Math.abs(Math.sin(t*5+this.phase))*.14;this.body.rotation.y=Math.PI/4;this.body.scale.set(this.face,1,1);return;}
    const b=this.bounds();const pond=b&&b.pond;
    /* spring squash */
    this.sqv+=(-180*this.sq-12*this.sqv)*dt;this.sq+=this.sqv*dt;
    if(this.anim){this.anim.t+=dt;const k=Math.min(1,this.anim.t/this.anim.d);const e=1-Math.pow(1-k,3);
      this.g.position.lerpVectors(this.anim.from,this.anim.to,e);this.y=Math.sin(k*Math.PI)*this.anim.h;if(k>=1){this.anim=null;this.sqv-=9;SFX.boing();}}
    else if(this.jump>0){this.hopT+=dt*2.6;this.y=Math.sin(Math.min(1,this.hopT)*Math.PI)*.75*this.jump;if(this.hopT>=1){this.hopT=0;this.jump=0;this.sqv-=10;}}
    else if(this.food){const fp=this.food.obj.position;const dx=fp.x-this.g.position.x,dz=fp.z-this.g.position.z,dd=Math.hypot(dx,dz);
      if(dd>.5&&!this.food.eating){this.walkTo(fp,dt,pond);}else{this.food.eating=(this.food.eating||0)+dt;this.y=Math.abs(Math.sin(t*14))*.05;
        this.food.obj.scale.setScalar(Math.max(.01,1-this.food.eating/1.6));if(this.food.eating>1.6){scene.remove(this.food.obj);this.food=null;fedDone(this);}}}
    else if(this.target){this.walkTo(this.target,dt,pond);}
    else{this.wait-=dt;if(!reduced){this.y=pond?0:0;}if(this.wait<=0){this.pick();this.wait=rand(1,3.5);}}
    const bob=pond?Math.sin(t*2+this.phase)*.04-.08:0;
    this.body.position.y=this.y+bob;
    this.body.scale.set((1-this.sq*.5)*this.face,1+this.sq,1-this.sq*.5);
    this.body.rotation.y=Math.PI/4+(reduced?0:Math.sin(t*.8+this.phase)*.28);
    if(this.dance>0){this.dance-=dt;if(!reduced){this.body.rotation.y+=(1.6-this.dance)*Math.PI*2.5;this.body.position.y+=Math.abs(Math.sin(this.dance*8))*.25;}}
    const s=1-clamp(this.y,0,1)*.4;this.sh.scale.set(this.inf.width*.9*s,this.inf.width*.55*s,1);this.sh.material.opacity=pond?.25:1;
  }
  walkTo(p,dt,pond){const dx=p.x-this.g.position.x,dz=p.z-this.g.position.z,dd=Math.hypot(dx,dz);
    const sx=dx-dz;if(Math.abs(sx)>.05)this.face=sx>0?1:-1;
    if(dd<.08){if(p===this.target)this.target=null;this.y=0;return;}
    const sp=pond?.55:.9;const step=Math.min(dd,sp*dt);this.g.position.x+=dx/dd*step;this.g.position.z+=dz/dd*step;
    if(!pond&&!reduced){this.hopT+=dt*2.4;if(this.hopT>=1){this.hopT-=1;this.sqv-=4;}this.y=Math.sin(this.hopT*Math.PI)*.16;}else this.y=0;}
  dispose(){scene.remove(this.g);this.m.geometry.dispose();this.m.material.map.dispose();this.m.material.dispose();}
}
async function spawnCritter(a){try{const img=await loadImg(a.png);const inf=inflate(img,a.id);if(!inf)return null;const c=new Critter(a,inf);critters.set(a.id,c);return c;}catch(e){return null;}}

/* ---------- particles (hearts, crumbs) ---------- */
const heartTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#e8573c';x.beginPath();x.moveTo(32,56);x.bezierCurveTo(4,36,6,10,22,10);x.bezierCurveTo(28,10,32,16,32,20);x.bezierCurveTo(32,16,36,10,42,10);x.bezierCurveTo(58,10,60,36,32,56);x.fill();x.strokeStyle='#fff';x.lineWidth=4;x.stroke();const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;})();
const parts=[];
function hearts(pos,n){for(let i=0;i<(n||5);i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:heartTex,transparent:true,depthWrite:false}));s.scale.setScalar(.35);s.position.copy(pos).add(new THREE.Vector3(rand(-.3,.3),rand(.6,1.2),rand(-.3,.3)));scene.add(s);parts.push({s,v:new THREE.Vector3(rand(-.3,.3),rand(1,1.6),rand(-.3,.3)),life:1.2});}}
function crumbs(pos,col){for(let i=0;i<10;i++){const m=new THREE.Mesh(G.sphere,mat(col));m.scale.setScalar(.35);m.position.copy(pos).add(new THREE.Vector3(0,.3,0));scene.add(m);parts.push({s:m,v:new THREE.Vector3(rand(-1,1),rand(1,2.2),rand(-1,1)),life:.7,grav:1});}}
function tickParts(dt){for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life-=dt;p.s.position.addScaledVector(p.v,dt);if(p.grav)p.v.y-=6*dt;
  if(p.s.material&&p.s.material.opacity!==undefined&&!p.grav){p.s.material.opacity=clamp(p.life,0,1);}if(p.life<=0){scene.remove(p.s);parts.splice(i,1);}}}

/* ---------- food ---------- */
const FOODS=[{id:'apple',label:'Apple',col:'#e8573c'},{id:'fish',label:'Fish',col:'#5bc0eb'},{id:'leaves',label:'Leaves',col:'#4fae5d'},{id:'carrot',label:'Carrot',col:'#f08a3c'},{id:'cake',label:'Cake',col:'#ffb3c7'}];
function foodObj(f){const g=new THREE.Group();let m;
  if(f.id==='apple'){m=mesh(new THREE.SphereGeometry(.16,14,12),mat('#e8573c',{roughness:.4}));m.position.y=.16;g.add(m);const l=mesh(new THREE.SphereGeometry(.06,8,6),mat('#3fa34d'));l.scale.set(1,.4,.6);l.position.set(.05,.33,0);g.add(l);}
  else if(f.id==='fish'){m=mesh(new THREE.SphereGeometry(.15,14,10),mat('#5bc0eb',{roughness:.3}));m.scale.set(1.6,.8,.6);m.position.y=.14;g.add(m);const t=mesh(new THREE.ConeGeometry(.1,.18,4),mat('#2c8fc0'));t.rotation.z=Math.PI/2;t.position.set(.3,.14,0);g.add(t);}
  else if(f.id==='leaves'){for(let i=0;i<4;i++){const l=mesh(new THREE.SphereGeometry(.12,10,8),mat(i%2?'#4fae5d':'#3f9c50'));l.scale.set(1.4,.3,.8);l.position.set(rand(-.1,.1),.05+i*.05,rand(-.1,.1));l.rotation.y=i;g.add(l);}}
  else if(f.id==='carrot'){m=mesh(new THREE.ConeGeometry(.08,.4,10),mat('#f08a3c'));m.rotation.z=Math.PI/2;m.position.y=.1;g.add(m);const l=mesh(new THREE.ConeGeometry(.06,.16,6),mat('#3fa34d'));l.rotation.z=-Math.PI/2;l.position.set(.26,.1,0);g.add(l);}
  else{m=mesh(new THREE.CylinderGeometry(.16,.16,.2,16),mat('#ffb3c7'));m.position.y=.1;g.add(m);const c=mesh(new THREE.CylinderGeometry(.165,.165,.05,16),mat('#ffffff'));c.position.y=.21;g.add(c);const ch=mesh(new THREE.SphereGeometry(.05,8,6),mat('#e8573c'));ch.position.y=.26;g.add(ch);}
  return g;}
function giveFood(critter,f,at){if(critter.food){toast(critter.a.name+' is still eating');return;}
  if(!spendCoins(COST.food,'for food'))return;
  const o=foodObj(f);const p=at||critter.g.position.clone().add(new THREE.Vector3(rand(-.5,.5),0,rand(-.5,.5)));const b=critter.bounds();if(b){p.x=clamp(p.x,b.x0,b.x1);p.z=clamp(p.z,b.z0,b.z1);}
  o.position.set(p.x,0,p.z);o.userData.drop=1.4;o.position.y=1.4;scene.add(o);drops.push(o);critter.food={obj:o,f};critter.target=null;SFX.pop();}
const drops=[];
function tickDrops(dt){for(let i=drops.length-1;i>=0;i--){const o=drops[i];o.userData.vy=(o.userData.vy||0)-9*dt;o.position.y+=o.userData.vy*dt;if(o.position.y<=(o.userData.floor||0)){o.position.y=o.userData.floor||0;if(Math.abs(o.userData.vy)>1.5){o.userData.vy*=-.35;}else drops.splice(i,1);}}}
function fedDone(c){SFX.munch();crumbs(c.g.position,c.food?c.food.f.col:'#e8573c');hearts(c.g.position,4);c.kick(1);
  const d=today();if(!S.stamps.some(s=>s.kind==='fed'&&s.animal===c.a.id&&s.day===d)){addStamp('fed',c.a,'Fed '+c.a.name);}else speak(c.a.name+' says yum!');}

/* ---------- visitors: families walk the paths, look at animals, shop, and pay coins ---------- */
const PEOPLE=[];let visitT=3;
const SKIN=['#ffdbac','#f1c27d','#e0ac69','#c68642','#8d5524'],HAIR=['#2b1d14','#4a3021','#111111','#d9a441','#a0522d'],SHIRT=['#e8573c','#5bc0eb','#f4c542','#7cc142','#ff6fa8','#7048e8','#ffffff','#21a89a','#f08a3c'],PANTS=['#1f3a5f','#4a6283','#6b7d93','#3d5a80','#8a5a2b'];
const PG={body:new THREE.CylinderGeometry(.12,.15,.4,10),head:new THREE.SphereGeometry(.12,14,12),hair:new THREE.SphereGeometry(.13,14,8,0,Math.PI*2,0,Math.PI/2),leg:new THREE.CylinderGeometry(.045,.045,.24,6),arm:new THREE.CylinderGeometry(.035,.035,.26,6)};
function personMesh(kid){const g=new THREE.Group(),pk=a=>a[(Math.random()*a.length)|0],legs=[],pants=mat(pk(PANTS)),shirt=mat(pk(SHIRT)),skin=mat(pk(SKIN));
  [-.065,.065].forEach(x=>{const lg=new THREE.Group();lg.position.set(x,.24,0);const m=mesh(PG.leg,pants);m.position.y=-.12;lg.add(m);g.add(lg);legs.push(lg);});
  const b=mesh(PG.body,shirt);b.position.y=.44;g.add(b);
  [-.17,.17].forEach(x=>{const a=mesh(PG.arm,shirt);a.position.set(x,.46,0);a.rotation.z=x<0?-.15:.15;g.add(a);});
  const h=mesh(PG.head,skin);h.position.y=.76;g.add(h);const hr=mesh(PG.hair,mat(pk(HAIR)));hr.position.y=.78;hr.rotation.x=-.3;g.add(hr);
  g.scale.setScalar(kid?.66:1);g.userData.legs=legs;return g;}
/* routing works in local rows (0 = the farthest row), so the zoo can grow */
let CRM=0;
function costGrid(){const o=occ(),rm=rMin(),rows=GRID-rm,cost=new Float32Array(GRID*rows);for(let lr=0;lr<rows;lr++)for(let c=0;c<GRID;c++){const it=o.get(c+','+(lr+rm));cost[lr*GRID+c]=!it?3:(it.type==='path'?1:Infinity);}cost.rows=rows;cost.rm=rm;CRM=rm;return cost;}
function route(sc,sr,tc,tr,cost){const N=GRID*cost.rows,dist=new Float32Array(N).fill(Infinity),prev=new Int32Array(N).fill(-1),done=new Uint8Array(N),s0=sr*GRID+sc,t0=tr*GRID+tc;dist[s0]=0;
  for(let k=0;k<N;k++){let u=-1,bb=Infinity;for(let i=0;i<N;i++)if(!done[i]&&dist[i]<bb){bb=dist[i];u=i;}if(u<0||u===t0)break;done[u]=1;const uc=u%GRID,ur=(u/GRID)|0;
    for(const dd of [[1,0],[-1,0],[0,1],[0,-1]]){const nc=uc+dd[0],nr=ur+dd[1];if(nc<0||nr<0||nc>=GRID||nr>=cost.rows)continue;const v=nr*GRID+nc,w=v===t0?1:cost[v];if(!isFinite(w))continue;if(dist[u]+w<dist[v]){dist[v]=dist[u]+w;prev[v]=u;}}}
  if(!isFinite(dist[t0]))return null;const out=[];for(let v=t0;v>=0;v=prev[v]){out.push(v);if(v===s0)break;}return out.reverse();}
function shopCount(){return S.items.filter(i=>ITEM[i.type]&&ITEM[i.type].shop).length;}
function attractions(){const list=[];for(const it of S.items){const d=ITEM[it.type];if(!d)continue;if(it.type.startsWith('pen_')){const n=S.animals.filter(a=>a.pen===it.id).length;if(n)list.push({it,kind:'pen',pay:1+n});}else if(d.shop)list.push({it,kind:'shop',pay:d.shop});}return list;}
function standCell(it,cost){const d=ITEM[it.type],c=[];for(let a=-1;a<=d.w;a++)for(let b=-1;b<=d.h;b++){const inside=a>=0&&a<d.w&&b>=0&&b<d.h,corner=(a<0||a>=d.w)&&(b<0||b>=d.h);if(inside||corner)continue;
  const cc=it.c+a,rr=it.r+b-cost.rm;if(cc<0||rr<0||cc>=GRID||rr>=cost.rows)continue;if(isFinite(cost[rr*GRID+cc]))c.push([cc,rr]);}
  if(!c.length)return null;const lo=Math.min(...c.map(q=>cost[q[1]*GRID+q[0]]));const best=c.filter(q=>cost[q[1]*GRID+q[0]]===lo);return best[(Math.random()*best.length)|0];}
