function lamp(){const g=new THREE.Group();const p=mesh(new THREE.CylinderGeometry(.04,.06,1.2,8),mat('#1f3a5f'));p.position.y=.6;g.add(p);
  const l=mesh(new THREE.SphereGeometry(.15,14,12),new THREE.MeshStandardMaterial({color:C('#ffe08a'),emissive:C('#ffcf4a'),emissiveIntensity:.6}));l.position.y=1.25;g.add(l);
  const cap=mesh(new THREE.ConeGeometry(.17,.12,10),mat('#1f3a5f'));cap.position.y=1.42;g.add(cap);return g;}
const waterMats=[];
function waterMat(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#4fb3d9';x.fillRect(0,0,128,128);x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;
  for(let i=0;i<9;i++){x.beginPath();const y=rand(0,128),xx=rand(0,128);x.moveTo(xx,y);x.quadraticCurveTo(xx+10,y-5,xx+22,y);x.stroke();}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;const m=new THREE.MeshStandardMaterial({map:t,roughness:.25,metalness:.05});waterMats.push(t);return m;}
function fountain(){const g=new THREE.Group();const base=mesh(new THREE.CylinderGeometry(.9,.98,.32,28),mat('#c9d3dd'));base.position.y=.16;g.add(base);
  const w=mesh(new THREE.CylinderGeometry(.78,.78,.05,28),waterMat(),false);w.position.y=.3;g.add(w);
  const col=mesh(new THREE.CylinderGeometry(.1,.14,.8,12),mat('#c9d3dd'));col.position.y=.6;g.add(col);
  const top=mesh(new THREE.CylinderGeometry(.34,.2,.12,18),mat('#b5c1cd'));top.position.y=.98;g.add(top);
  const sp=mesh(new THREE.SphereGeometry(.16,14,10),new THREE.MeshStandardMaterial({color:C('#bfe9f7'),transparent:true,opacity:.75}),false);sp.position.y=1.14;sp.userData.spray=1;g.add(sp);return g;}
function path(){const m=mesh(G.pathTile,mat('#f4d98a'),false);m.position.y=.02;return m;}
function penGroup(zone){const z=ZONE[zone];const g=new THREE.Group();
  const slab=mesh(new THREE.BoxGeometry(4,.1,4),mat(z.ground));slab.position.y=.05;g.add(slab);
  if(zone==='pond'){const w=mesh(new THREE.BoxGeometry(3.1,.05,3.1),waterMat(),false);w.position.y=.1;g.add(w);}
  const fm=mat(z.fence);
  for(let i=0;i<=4;i++)for(const s of [[i-2,-2],[i-2,2],[-2,i-2],[2,i-2]]){const p=mesh(G.post,mat('#ffffff'));p.position.set(s[0],.31,s[1]);g.add(p);}
  for(let i=0;i<4;i++)for(const side of [0,1,2,3])for(const hgt of [.28,.5]){const r=mesh(G.rail,fm);
    if(side<2){r.position.set(i-1.5,hgt,side?2:-2);}else{r.rotation.y=Math.PI/2;r.position.set(side===2?-2:2,hgt,i-1.5);}g.add(r);}
  if(zone==='savanna'){const t=tree();t.scale.set(1.1,.8,1.1);t.position.set(-1.35,.1,-1.35);g.add(t);const rk=rock();rk.position.set(1.3,.1,-1.2);g.add(rk);}
  if(zone==='polar'){[[-1.3,-1.2,.5],[1.2,-1.3,.35],[-1.2,1.1,.3]].forEach(b=>{const m=mesh(new THREE.BoxGeometry(b[2]*1.4,b[2],b[2]*1.2),mat('#bfe6f5',{roughness:.3}));m.position.set(b[0],.1+b[2]/2,b[1]);m.rotation.y=b[0];g.add(m);});}
  if(zone==='jungle'){[[-1.4,-1.3],[1.35,-1.35],[-1.35,1.3]].forEach(p=>{const pn=pine();pn.scale.setScalar(.75);pn.position.set(p[0],.1,p[1]);g.add(pn);});}
  if(zone==='pond'){[[-1.55,-1.5],[1.5,1.5]].forEach(p=>{const pad=mesh(new THREE.CylinderGeometry(.22,.22,.02,14),mat('#4fae5d'),false);pad.position.set(p[0]+.3,.14,p[1]-.3);g.add(pad);});}
  const sign=new THREE.Group();const board=mesh(new THREE.BoxGeometry(1.75,.5,.06),[mat('#1f3a5f'),mat('#1f3a5f'),mat('#1f3a5f'),mat('#1f3a5f'),new THREE.MeshStandardMaterial({map:signTex(z.name,zone),roughness:.6}),mat('#1f3a5f')]);
  board.position.y=.95;sign.add(board);[-.6,.6].forEach(x=>{const p=mesh(new THREE.CylinderGeometry(.04,.04,.75,6),mat('#1f3a5f'));p.position.set(x,.38,-.02);sign.add(p);});
  sign.position.set(-.9,0,2.32);sign.rotation.y=0;g.add(sign);
  const ring=new THREE.Mesh(new THREE.RingGeometry(2.2,2.55,48),new THREE.MeshBasicMaterial({color:C('#e8573c'),transparent:true,opacity:.0,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.13;ring.userData.ring=1;g.add(ring);g.userData.ringMesh=ring;
  return g;}
function shopHouse(w,d,wall,roof,label){const g=new THREE.Group();const b=mesh(new THREE.BoxGeometry(w,.95,d),mat(wall));b.position.y=.48;g.add(b);
  const r=mesh(new THREE.ConeGeometry(Math.max(w,d)*.78,.6,4),mat(roof,{flatShading:true}));r.position.y=1.25;r.rotation.y=Math.PI/4;g.add(r);
  for(let i=0;i<6;i++){const st=mesh(new THREE.BoxGeometry(w/6,.06,.42),mat(i%2?'#ffffff':roof));st.position.set(-w/2+w/12+i*w/6,.8,d/2+.18);st.rotation.x=.4;g.add(st);}
  const door=mesh(new THREE.BoxGeometry(.32,.52,.04),mat('#1f3a5f'));door.position.set(0,.26,d/2+.02);g.add(door);
  [-.55,.55].forEach(x=>{const wdw=mesh(new THREE.BoxGeometry(.28,.24,.04),mat('#bfe6f5',{roughness:.3}));wdw.position.set(x*w/1.8,.5,d/2+.02);g.add(wdw);});
  const sg=mesh(new THREE.BoxGeometry(w*.85,.34,.06),[mat(roof),mat(roof),mat(roof),mat(roof),new THREE.MeshStandardMaterial({map:textTex(label,512,128,'#1f3a5f','#ffffff',72),roughness:.5}),mat(roof)]);sg.position.set(0,1.12,d/2+.1);g.add(sg);return g;}
function cart(top,body,label){const g=new THREE.Group();const b=mesh(new THREE.BoxGeometry(.7,.45,.45),mat(body));b.position.y=.38;g.add(b);
  [-.25,.25].forEach(x=>{const wh=mesh(new THREE.CylinderGeometry(.11,.11,.06,14),mat('#1f3a5f'));wh.rotation.x=Math.PI/2;wh.position.set(x,.12,.25);g.add(wh);});
  const pole=mesh(new THREE.CylinderGeometry(.025,.025,.7,6),mat('#ffffff'));pole.position.y=.95;g.add(pole);
  const um=mesh(new THREE.ConeGeometry(.55,.28,10),mat(top,{flatShading:true}));um.position.y=1.32;g.add(um);
  const sg=mesh(new THREE.BoxGeometry(.6,.2,.04),[mat(body),mat(body),mat(body),mat(body),new THREE.MeshStandardMaterial({map:textTex(label,256,90,'#1f3a5f','#ffffff',50),roughness:.5}),mat(body)]);sg.position.set(0,.42,.24);g.add(sg);return g;}
function icecream(){const g=cart('#ff6fa8','#ffffff','Ice cream');const cone=mesh(new THREE.ConeGeometry(.1,.28,10),mat('#e9b878'));cone.rotation.x=Math.PI;cone.position.set(.18,.75,0);g.add(cone);const sc=mesh(new THREE.SphereGeometry(.11,12,10),mat('#ff6fa8'));sc.position.set(.18,.92,0);g.add(sc);return g;}
function snack(){const g=cart('#f4c542','#e8573c','Snacks');for(let i=0;i<5;i++){const pc=mesh(new THREE.SphereGeometry(.06,8,6),mat('#fff3cc'));pc.position.set(-.18+i*.07,.66,(i%2)*.06);g.add(pc);}return g;}
function gift(){return shopHouse(1.7,1.6,'#ffd6e0','#e8573c','Gift Shop');}
function restaurant(){const g=shopHouse(1.8,1.7,'#fff3cc','#21a89a','Restaurant');const ch=mesh(new THREE.BoxGeometry(.2,.5,.2),mat('#b5c1cd'));ch.position.set(.55,1.45,-.3);g.add(ch);
  [-.6,.6].forEach(x=>{const t=mesh(new THREE.CylinderGeometry(.18,.18,.04,14),mat('#ffffff'));t.position.set(x,.32,1.15);g.add(t);const l=mesh(new THREE.CylinderGeometry(.03,.03,.3,6),mat('#1f3a5f'));l.position.set(x,.16,1.15);g.add(l);});return g;}
const BUILD={pen_savanna:()=>penGroup('savanna'),pen_polar:()=>penGroup('polar'),pen_pond:()=>penGroup('pond'),pen_jungle:()=>penGroup('jungle'),path,tree,pine,bush,flowers,rock,bench,lamp,fountain,icecream,snack,gift,restaurant};

/* gate */
(function gate(){const g=new THREE.Group();[-1.35,1.35].forEach(x=>{const p=mesh(new THREE.BoxGeometry(.4,2.2,.4),mat('#1f3a5f'));p.position.set(x,1.1,0);g.add(p);const cap=mesh(new THREE.SphereGeometry(.28,16,12),mat('#f4c542'));cap.position.set(x,2.35,0);g.add(cap);});
  const tex=textTex('LIU FAMILY ZOO',1024,200,'#1f3a5f','#ffffff',120);const b=mesh(new THREE.BoxGeometry(3.4,.68,.16),[mat('#1f3a5f'),mat('#1f3a5f'),mat('#1f3a5f'),mat('#1f3a5f'),new THREE.MeshStandardMaterial({map:tex,roughness:.5}),mat('#1f3a5f')]);
  b.position.set(0,2.05,0);g.add(b);g.position.set(0,0,GRID/2+.25);g.userData.tex=tex;scene.add(g);window.__gate=g;})();
/* border trees */
let landG=null;
function buildLand(){if(landG){scene.remove(landG);landG.traverse(o=>{if(o.material&&o.material.map)o.material.map.dispose();});}
  landG=new THREE.Group();const rm=rMin(),rows=GRID-rm,top=rm-GRID/2,bot=GRID/2,zc=(top+bot)/2;
  const gr=mesh(new THREE.PlaneGeometry(GRID,rows),new THREE.MeshStandardMaterial({map:groundTex(rows,rm),roughness:.95}),false,true);gr.rotation.x=-Math.PI/2;gr.position.z=zc;landG.add(gr);
  const hz=new THREE.BoxGeometry(GRID+.6,.18,.3),vz=new THREE.BoxGeometry(rows+.6,.18,.3);
  [[0,top-.15,hz,0],[0,bot+.15,hz,0],[-GRID/2-.15,zc,vz,1],[GRID/2+.15,zc,vz,1]].forEach(q=>{const b=mesh(q[2],mat('#2c6b38'));b.position.set(q[0],.06,q[1]);if(q[3])b.rotation.y=Math.PI/2;landG.add(b);});
  let sd=7;const Rn=()=>{sd=(sd*9301+49297)%233280;return sd/233280;};const count=120+40*Math.min(EXPAND_MAX,S.expand||0);
  for(let i=0;i<count;i++){const side=i%4,d=1.2+Rn()*4;let x,z;
    if(side===0||side===3){x=Rn()*(GRID+8)-(GRID/2+4);z=side===0?top-d:bot+d;if(side===3&&Math.abs(x)<2.2)continue;}
    else{z=top-4+Rn()*(rows+8);x=side===1?-GRID/2-d:GRID/2+d;}
    const tr=Rn()<.5?tree():pine();tr.position.set(x,0,z);tr.scale.setScalar(.9+Rn()*.7);tr.rotation.y=Rn()*6;landG.add(tr);}
  scene.add(landG);const ext=17+6*Math.min(EXPAND_MAX,S.expand||0);Object.assign(sun.shadow.camera,{left:-ext,right:ext,top:ext,bottom:-ext,far:60+12*Math.min(EXPAND_MAX,S.expand||0)});sun.shadow.camera.updateProjectionMatrix();}
buildLand();

/* ---------- world items ---------- */
const itemObjs=new Map();
function itemCenter(it){const d=ITEM[it.type];return {x:it.c-GRID/2+d.w/2,z:it.r-GRID/2+d.h/2};}
function addItemObj(it){const o=BUILD[it.type]();const p=itemCenter(it);o.position.set(p.x,0,p.z);o.userData.item=it;scene.add(o);itemObjs.set(it.id,o);return o;}
function occ(){const m=new Map();for(const it of S.items){const d=ITEM[it.type];for(let a=0;a<d.w;a++)for(let b=0;b<d.h;b++)m.set((it.c+a)+','+(it.r+b),it);}return m;}
function itemAt(c,r){return occ().get(c+','+r)||null;}
function fits(type,c,r,ignore){const d=ITEM[type];if(c<0||r<rMin()||c+d.w>GRID||r+d.h>GRID)return false;const o=occ();
  for(let a=0;a<d.w;a++)for(let b=0;b<d.h;b++){const h=o.get((c+a)+','+(r+b));if(h&&h!==ignore)return false;}return true;}
function pens(){return S.items.filter(i=>i.type.startsWith('pen_'));}

/* ---------- drawing → 3D (inflate the kid's drawing) ---------- */
function dilate(src,N,r){if(r<=0)return src.slice();let a=src.slice();for(let k=0;k<r;k++){const b=a.slice();for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;if(a[i])continue;
  if((x>0&&a[i-1])||(x<N-1&&a[i+1])||(y>0&&a[i-N])||(y<N-1&&a[i+N]))b[i]=1;}a=b;}return a;}
function floodOutside(wall,N){const out=new Uint8Array(N*N),q=new Int32Array(N*N);let h=0,t=0;
  const push=i=>{if(!wall[i]&&!out[i]){out[i]=1;q[t++]=i;}};
  for(let i=0;i<N;i++){push(i);push((N-1)*N+i);push(i*N);push(i*N+N-1);}
  while(h<t){const i=q[h++],x=i%N,y=(i/N)|0;if(x>0)push(i-1);if(x<N-1)push(i+1);if(y>0)push(i-N);if(y<N-1)push(i+N);}return out;}
function bodyColour(img){const c=document.createElement('canvas');c.width=c.height=80;const x=c.getContext('2d');x.drawImage(img,0,0,80,80);const d=x.getImageData(0,0,80,80).data;const buckets={};
  for(let i=0;i<d.length;i+=4){if(d[i+3]<60)continue;const r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mx<.2||mx-mn<.18)continue;
    const k=(d[i]>>5)+'-'+(d[i+1]>>5)+'-'+(d[i+2]>>5);(buckets[k]=buckets[k]||{n:0,r:0,g:0,b:0}).n++;buckets[k].r+=d[i];buckets[k].g+=d[i+1];buckets[k].b+=d[i+2];}
  let best=null;for(const k in buckets)if(!best||buckets[k].n>best.n)best=buckets[k];
  if(!best)return null;const r=best.r/best.n,g=best.g/best.n,b=best.b/best.n;const L=.5;return 'rgb('+Math.round(r+(255-r)*L)+','+Math.round(g+(255-g)*L)+','+Math.round(b+(255-b)*L)+')';}
const PASTELS=['#ffd6a5','#caffbf','#9bf6ff','#bdb2ff','#ffc6ff','#fdffb6','#ffadad'];
function inflate(img,seed){
  const N=192;const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.drawImage(img,0,0,N,N);const d=x.getImageData(0,0,N,N).data;
  const stroke=new Uint8Array(N*N);let any=0;for(let i=0;i<N*N;i++){if(d[i*4+3]>50){stroke[i]=1;any++;}}
  if(any<8)return null;
  let wall=dilate(stroke,N,2),shape=floodOutside(wall,N).map(v=>v?0:1);
  let area=0,warea=0;for(let i=0;i<N*N;i++){area+=shape[i];warea+=wall[i];}
  let tube=false;if(area<warea*1.3){wall=dilate(stroke,N,6);shape=floodOutside(wall,N).map(v=>v?0:1);tube=true;}
  /* mesh grid */
  const Gn=96,f=N/Gn;const cell=new Uint8Array(Gn*Gn);
  for(let j=0;j<Gn;j++)for(let i=0;i<Gn;i++){let s=0;for(let b=0;b<f;b++)for(let a=0;a<f;a++)s+=shape[(j*f+b)*N+i*f+a];cell[j*Gn+i]=s>=f*f/2?1:0;}
  let minI=Gn,maxI=-1,minJ=Gn,maxJ=-1;for(let j=0;j<Gn;j++)for(let i=0;i<Gn;i++)if(cell[j*Gn+i]){minI=Math.min(minI,i);maxI=Math.max(maxI,i);minJ=Math.min(minJ,j);maxJ=Math.max(maxJ,j);}
  if(maxI<0)return null;
  /* chamfer distance to outside */
  const INF=1e9,dist=new Float32Array(Gn*Gn);for(let i=0;i<Gn*Gn;i++)dist[i]=cell[i]?INF:0;
  const at=(i,j)=>(i<0||j<0||i>=Gn||j>=Gn)?0:dist[j*Gn+i];
  for(let j=0;j<Gn;j++)for(let i=0;i<Gn;i++){const k=j*Gn+i;if(!dist[k])continue;dist[k]=Math.min(dist[k],at(i-1,j)+1,at(i,j-1)+1,at(i-1,j-1)+1.414,at(i+1,j-1)+1.414);}
  for(let j=Gn-1;j>=0;j--)for(let i=Gn-1;i>=0;i--){const k=j*Gn+i;if(!dist[k])continue;dist[k]=Math.min(dist[k],at(i+1,j)+1,at(i,j+1)+1,at(i+1,j+1)+1.414,at(i-1,j+1)+1.414);}
  let dmax=1;for(let i=0;i<Gn*Gn;i++)dmax=Math.max(dmax,dist[i]);
  const bw=maxI-minI+1,bh=maxJ-minJ+1,big=Math.max(bw,bh);
  const target=1.0+1.0*(big/Gn);const u=target/big;
  const hmax=clamp(dmax*u*.85,.12,.5),cH=hmax/Math.sqrt(dmax);
  /* vertices */
  const V=Gn+1,inside=(i,j)=>i>=0&&j>=0&&i<Gn&&j<Gn&&cell[j*Gn+i];
  const vh=new Float32Array(V*V),vin=new Uint8Array(V*V),vb=new Uint8Array(V*V);
  for(let j=0;j<V;j++)for(let i=0;i<V;i++){const cs=[[i-1,j-1],[i,j-1],[i-1,j],[i,j]];let n=0,s=0,out=0;for(const q of cs){if(inside(q[0],q[1])){n++;s+=dist[q[1]*Gn+q[0]];}else out++;}
    const k=j*V+i;if(n){vin[k]=1;if(out){vb[k]=1;vh[k]=0;}else vh[k]=cH*Math.sqrt(Math.max(0,s/n-.5));}}
  for(let it=0;it<3;it++){const nh=vh.slice();for(let j=1;j<V-1;j++)for(let i=1;i<V-1;i++){const k=j*V+i;if(!vin[k]||vb[k])continue;nh[k]=(vh[k]*2+vh[k-1]+vh[k+1]+vh[k-V]+vh[k+V])/6;}vh.set(nh);}
  /* smooth outline: snap edge vertices to a blurred edge, then relax them along the rim */
  const F=new Float32Array(N*N);for(let i=0;i<N*N;i++)F[i]=shape[i];
  const blurP=(A)=>{const r=3,w=2*r+1,B=new Float32Array(N*N),C2=new Float32Array(N*N);
    for(let y=0;y<N;y++){let s=0;for(let x=-r;x<=r;x++)s+=A[y*N+clamp(x,0,N-1)];for(let x=0;x<N;x++){B[y*N+x]=s/w;s+=A[y*N+clamp(x+r+1,0,N-1)]-A[y*N+clamp(x-r,0,N-1)];}}
    for(let x=0;x<N;x++){let s=0;for(let y=-r;y<=r;y++)s+=B[clamp(y,0,N-1)*N+x];for(let y=0;y<N;y++){C2[y*N+x]=s/w;s+=B[clamp(y+r+1,0,N-1)*N+x]-B[clamp(y-r,0,N-1)*N+x];}}return C2;};
  const FB=blurP(F);
  const smp=(x,y)=>{x-=.5;y-=.5;const x0=clamp(Math.floor(x),0,N-1),y0=clamp(Math.floor(y),0,N-1),x1=Math.min(N-1,x0+1),y1=Math.min(N-1,y0+1),fx=clamp(x-x0,0,1),fy=clamp(y-y0,0,1);
    return (FB[y0*N+x0]*(1-fx)+FB[y0*N+x1]*fx)*(1-fy)+(FB[y1*N+x0]*(1-fx)+FB[y1*N+x1]*fx)*fy;};
  const vx=new Float32Array(V*V),vy=new Float32Array(V*V);
  for(let j=0;j<V;j++)for(let i=0;i<V;i++){const k=j*V+i;vx[k]=i*f;vy[k]=j*f;if(!vb[k])continue;let x0=vx[k],y0=vy[k];
    for(let n=0;n<5;n++){const v=smp(x0,y0),gx=(smp(x0+1,y0)-smp(x0-1,y0))/2,gy=(smp(x0,y0+1)-smp(x0,y0-1))/2,g2=gx*gx+gy*gy;if(g2<1e-6)break;
      let dx=(.5-v)*gx/g2,dy=(.5-v)*gy/g2;const L=Math.hypot(dx,dy);if(L>f*.6){dx*=f*.6/L;dy*=f*.6/L;}x0+=dx;y0+=dy;}
    if(Math.hypot(x0-i*f,y0-j*f)<f*1.2){vx[k]=x0;vy[k]=y0;}}
  for(let it=0;it<3;it++){const nx=vx.slice(),ny=vy.slice();for(let j=1;j<V-1;j++)for(let i=1;i<V-1;i++){const k=j*V+i;if(!vb[k])continue;let sx=0,sy=0,n=0;
    for(const q of [k-1,k+1,k-V,k+V])if(vb[q]){sx+=vx[q];sy+=vy[q];n++;}if(n>=2){nx[k]=vx[k]*.5+sx/n*.5;ny[k]=vy[k]*.5+sy/n*.5;}}vx.set(nx);vy.set(ny);}
  const pos=[],uv=[],idx=[],fi=new Int32Array(V*V).fill(-1),bi=new Int32Array(V*V).fill(-1);
  const cx=(minI+maxI+1)/2,bottom=maxJ+1;
  for(let j=0;j<V;j++)for(let i=0;i<V;i++){const k=j*V+i;if(!vin[k])continue;const gi=vx[k]/f,gj=vy[k]/f,X=(gi-cx)*u,Y=(bottom-gj)*u,U=gi/Gn,W2=1-gj/Gn;
    fi[k]=pos.length/3;pos.push(X,Y,vh[k]);uv.push(U,W2);
    if(vb[k])bi[k]=fi[k];else{bi[k]=pos.length/3;pos.push(X,Y,-vh[k]*.85);uv.push(U,W2);}}
  for(let j=0;j<Gn;j++)for(let i=0;i<Gn;i++){if(!cell[j*Gn+i])continue;const a=j*V+i,b=a+1,c2=a+V+1,d2=a+V;
    idx.push(fi[a],fi[c2],fi[b],fi[a],fi[d2],fi[c2]);idx.push(bi[a],bi[b],bi[c2],bi[a],bi[c2],bi[d2]);}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
  /* texture: body colour under the kid's own lines */
  const T=512,tc=document.createElement('canvas');tc.width=tc.height=T;const tx=tc.getContext('2d');
  const body=bodyColour(img)||PASTELS[(seed||0)%PASTELS.length];tx.fillStyle=body;tx.fillRect(0,0,T,T);
  const sh=tx.createRadialGradient(T/2,T*.35,T*.05,T/2,T/2,T*.7);sh.addColorStop(0,'rgba(255,255,255,.18)');sh.addColorStop(1,'rgba(0,0,0,.06)');tx.fillStyle=sh;tx.fillRect(0,0,T,T);
  tx.drawImage(img,0,0,T,T);
  const tex=new THREE.CanvasTexture(tc);tex.encoding=THREE.sRGBEncoding;tex.anisotropy=4;
  return {geo,tex,width:bw*u,height:bh*u,thick:hmax,tube};
}

