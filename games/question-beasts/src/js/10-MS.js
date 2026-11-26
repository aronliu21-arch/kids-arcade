/* ---------- register (topic, tier) ---------- */
const MS={sayQ:1,big:1};
G('milo','animals',1,bank(MILO_ANIMALS.slice(0,13),MS));G('milo','animals',2,bank(MILO_ANIMALS.slice(13,24),MS));G('milo','animals',3,bank(MILO_ANIMALS.slice(24),MS));
G('milo','body',1,bank(MILO_BODY.slice(0,7),MS));G('milo','body',2,bank(MILO_BODY.slice(7),MS));G('milo','body',3,bank(MILO_BODY.slice(0,7),MS));
G('milo','things',1,bank(MILO_THINGS.slice(0,6),MS));G('milo','things',2,bank(MILO_THINGS.slice(6),MS));G('milo','things',3,bank(MILO_THINGS.slice(6),MS));
G('milo','nature',1,bank(MILO_NATURE.slice(0,5),MS));G('milo','nature',2,bank(MILO_NATURE.slice(5),MS));G('milo','nature',3,bank(MILO_NATURE.slice(5),MS));
G('milo','opposites',1,bank(MILO_OPP.slice(0,8),MS));G('milo','opposites',2,bank(MILO_OPP.slice(0,8),MS));G('milo','opposites',3,bank(MILO_OPP.slice(8),{sayQ:1,kind:'word'}));
G('milo','patterns',1,bank(MILO_PAT.slice(0,5),MS));G('milo','patterns',2,bank(MILO_PAT.slice(5),MS));G('milo','patterns',3,bank(MILO_PAT.slice(5),MS));
G('milo','numbers2',1,bank(MILO_NUM2.slice(0,6),MS));G('milo','numbers2',2,bank(MILO_NUM2.slice(6),MS));G('milo','numbers2',3,bank(MILO_NUM2.slice(6),MS));
G('milo','colors2',1,bank(MILO_COL2.slice(0,5),{sayQ:1,kind:'color'}));G('milo','colors2',2,bank(MILO_COL2.slice(5),{sayQ:1,kind:'color'}));G('milo','colors2',3,bank(MILO_COL2.slice(5),{sayQ:1,kind:'color'}));
G('lucas','science',1,bank(LUCAS_SCI.slice(0,8)));G('lucas','science',2,bank(LUCAS_SCI.slice(8,17)));G('lucas','science',3,bank(LUCAS_SCI.slice(17)));
G('lucas','stories',2,bank(LUCAS_STORIES.slice(0,10)));G('lucas','stories',3,bank(LUCAS_STORIES.slice(10)));
G('lucas','kangaroo2',2,bank(LUCAS_KANG2.slice(0,10)));G('lucas','kangaroo2',3,bank(LUCAS_KANG2.slice(10)));
G('lucas','measure',1,bank(LUCAS_MEAS.slice(0,5)));G('lucas','measure',2,bank(LUCAS_MEAS.slice(5,10)));G('lucas','measure',3,bank(LUCAS_MEAS.slice(10)));
G('lucas','world',1,bank(LUCAS_WORLD.slice(0,5)));G('lucas','world',2,bank(LUCAS_WORLD.slice(5)));
G('lucas','zyread',2,bank(LUCAS_ZYR.slice(0,5),{big:1}));G('lucas','zyread',3,bank(LUCAS_ZYR.slice(5),{big:1}));
G('nora','kangaroo2',2,bank(NORA_KANG2.slice(0,10)));G('nora','kangaroo2',3,bank(NORA_KANG2.slice(10)));
G('nora','wordprob',1,bank(NORA_WP.slice(0,7)));G('nora','wordprob',2,bank(NORA_WP.slice(7,14)));G('nora','wordprob',3,bank(NORA_WP.slice(14)));
G('nora','geometry',1,bank(NORA_GEO.slice(0,5)));G('nora','geometry',2,bank(NORA_GEO.slice(5,10)));G('nora','geometry',3,bank(NORA_GEO.slice(10)));
G('nora','science2',1,bank(NORA_SCI4.slice(0,5)));G('nora','science2',2,bank(NORA_SCI4.slice(5,10)));G('nora','science2',3,bank(NORA_SCI4.slice(10)));
G('nora','chinese2',1,bank(NORA_CHI2.slice(0,5),{big:1}));G('nora','chinese2',2,bank(NORA_CHI2.slice(5,10)));G('nora','chinese2',3,bank(NORA_CHI2.slice(10)));
G('nora','world2',1,bank(NORA_WORLD2.slice(0,4)));G('nora','world2',2,bank(NORA_WORLD2.slice(4,7)));G('nora','world2',3,bank(NORA_WORLD2.slice(7)));
NORA_BANKS.push(NORA_KANG2,NORA_WP,NORA_GEO,NORA_SCI4,NORA_CHI2,NORA_WORLD2);
const NEW_BANKS={milo:[MILO_ANIMALS,MILO_BODY,MILO_THINGS,MILO_NATURE,MILO_OPP,MILO_PAT,MILO_NUM2,MILO_COL2],lucas:[LUCAS_SCI,LUCAS_STORIES,LUCAS_KANG2,LUCAS_MEAS,LUCAS_WORLD,LUCAS_ZYR],nora:[NORA_KANG2,NORA_WP,NORA_GEO,NORA_SCI4,NORA_CHI2,NORA_WORLD2]};

/* ---------- question types rotate every 3 levels ---------- */
/* chapter 1 = levels 1–3, chapter 2 = levels 4–6, then Endless alternates chapters 3 and 4.
   Neighbouring chapters share no topics, so a type never runs for more than 3 levels in a row. */
const CHAPTERS={
  milo:[[['colors','animals'],['letters','body'],['math','things']],[['shapes','nature'],['words','opposites'],['patterns','numbers2','colors2']],
        [['animals','colors'],['letters','things'],['math','body']],[['nature','shapes'],['opposites','words'],['numbers2','patterns','colors2']]],
  lucas:[[['addsub'],['reading'],['zhuyin','zyread']],[['time','measure'],['science'],['logic','kangaroo2']],
         [['stories'],['world','addsub'],['zyread','reading']],[['measure','time'],['science','logic'],['kangaroo2']]],
  nora:[[['muldiv'],['chinese'],['science']],[['numbers','geometry'],['history','world2'],['kangaroo','kangaroo2']],
        [['wordprob'],['chinese2'],['science2','muldiv']],[['kangaroo2','numbers'],['history','chinese'],['geometry','science']]]
};
function chapterOf(stage){if(stage<=6)return Math.floor((stage-1)/3);return 2+Math.floor((stage-7)/3)%2}
function levelInChapter(stage){return stage<=6?(stage-1)%3:(stage-7)%3}
const QSETS=['milo','lucas','nora'];
function qsetOf(kid){if(kid!=='dad')return kid;const q=Save.kid('dad').qset;return q==='mix'||QSETS.includes(q)?q:'nora'}
TOPIC_NAME.mix='ALL 3 SETS MIXED';
function topicsFor(kid,stage){const k=qsetOf(kid);if(k==='mix')return ['mix'];return CHAPTERS[k][chapterOf(stage)][levelInChapter(stage)]}
function chapterTopics(kid,stage){const k=qsetOf(kid);if(k==='mix')return ['mix'];return [...new Set(CHAPTERS[k][chapterOf(stage)].flat())]}
Object.assign(TOPIC_NAME,{animals:'ANIMALS',body:'MY BODY',things:'EVERYDAY THINGS',nature:'NATURE',opposites:'OPPOSITES',patterns:'PATTERNS',numbers2:'COUNTING',colors2:'MORE COLORS',
  stories:'STORIES',kangaroo2:'MORE PUZZLES',measure:'SHAPES & MEASURING',world:'OUR WORLD',zyread:'注音 READING',wordprob:'WORD PROBLEMS',geometry:'GEOMETRY',science2:'SCIENCE LAB',chinese2:'成語 & 部首',world2:'GEOGRAPHY'});
if(!TOPIC_NAME.science)TOPIC_NAME.science='SCIENCE';



/* ================= pixel renderer ================= */
function drawSprite(c,key,pal,x,y,sc,flash,alpha=1){const g=SPR[key],P=Object.assign({},BASE,pal);c.globalAlpha=alpha;
  for(let r=0;r<16;r++)for(let q=0;q<16;q++){const ch=g[r][q];if(!ch||ch==='.')continue;c.fillStyle=flash?'#f4f4f4':(P[ch]||'#f0f');c.fillRect(Math.round(x+q*sc),Math.round(y+r*sc),sc,sc)}c.globalAlpha=1}
const BBOX={};for(const k in SPR){let l=16,r=-1,t=16;SPR[k].forEach((row,i)=>{for(let q=0;q<16;q++)if(row[q]!=='.'){if(i<t)t=i}});
  for(let q=0;q<16;q++)if(SPR[k][t][q]!=='.'){l=Math.min(l,q);r=Math.max(r,q)};let bl=16;SPR[k].forEach(row=>{const i=row.search(/[^.]/);if(i>=0)bl=Math.min(bl,i)});BBOX[k]={l,r,t,bl}}
function px(c,x,y,sc,q,r,col){c.fillStyle=col;c.fillRect(Math.round(x+q*sc),Math.round(y+r*sc),sc,sc)}
/* form 0: base · form 1 (Lv5): new colors + horns · form 2 (Lv10): new colors + wings + crown, drawn bigger */
function drawBeast(c,st,form,x,y,sc,flash,alpha=1,eq=null){const b=BBOX[st.sprite],acc=st.shot[2],acc2=st.shot[1],K='#1a1c2c';c.globalAlpha=alpha;
  if(form===2){const mid=Math.round((b.t+LASTROW[st.sprite])/2),wx=b.bl+3;
    for(let i=0;i<5;i++){const row=mid-4+i;for(let q=wx-1-i;q<=wx;q++){const edge=q===wx-1-i||i===4||q===wx;px(c,x,y,sc,q,row,flash?'#f4f4f4':edge?K:(q%2?acc:acc2))}}}
  c.globalAlpha=1;drawSprite(c,st.sprite,st.pal[form],x,y,sc,flash,alpha);c.globalAlpha=alpha;
  if(form===1){const pts=b.r-b.l>=2?[b.l,b.r]:[b.l];pts.forEach(q=>{px(c,x,y,sc,q,b.t-1,flash?'#f4f4f4':acc);px(c,x,y,sc,q,b.t-2,flash?'#f4f4f4':acc2)})}
  if(form===2){const cx=Math.round((b.l+b.r)/2),G=flash?'#f4f4f4':'#ffcd75';
    [-2,0,2].forEach(d=>px(c,x,y,sc,cx+d,b.t-3,G));for(let d=-2;d<=2;d++){px(c,x,y,sc,cx+d,b.t-2,G);px(c,x,y,sc,cx+d,b.t-1,G)}px(c,x,y,sc,cx,b.t-2,flash?'#f4f4f4':'#b13e53')}
  c.globalAlpha=1;if(eq)drawEquip(c,st,eq,x,y,sc,flash)}
/* portraits: 22x22 cell canvas, sprite offset 3 cells so horns/crown/wings fit */
function paintStarter(cv,st,form,eq){const c=cv.getContext('2d'),s=cv.width/22;c.clearRect(0,0,cv.width,cv.height);
  if(!st){c.fillStyle='#ffcd75';c.font=`${cv.width*.6}px 'Press Start 2P',monospace`;c.textAlign='center';c.textBaseline='middle';c.fillText('?',cv.width/2,cv.height/2+cv.width*.04);return}
  if(form>0){c.fillStyle=form===2?'#ffcd7533':'#73eff722';c.fillRect(0,0,cv.width,cv.height)}drawBeast(c,st,form,3*s,5*s,s,false,1,eq||null)}
function paintBeast(cv,kid){paintStarter(cv,beastOf(kid),formOf(Save.kid(kid).xp),equipOf(kid))}

const Fx=(()=>{
  const cv=$('#cv'),c=cv.getContext('2d'),W=192,H=108,GROUND=82,stage=$('#stage'),flashEl=$('#flash');
  const stars=Array.from({length:30},(_,i)=>({x:R(W),y:R(50),p:i}));
  const clouds=Array.from({length:4},(_,i)=>({x:R(W),y:6+R(22),w:14+R(14),sp:.004+Math.random()*.006}));
  let S={},kid='milo',enemy=ENEMIES[0],bgKind='night',boss=false;
  const P=()=>{const f=formOf(Save.kid(kid).xp);return{f,sc:f===2?3:2}};
  const pRect=()=>{const {sc}=P();return{x:46-8*sc,y:GROUND-(LASTROW[beastOf(kid).sprite]+1)*sc,sc,cx:46,cy:GROUND-6*sc}};
  const eRect=()=>{const sc=boss?3:2;return{x:146-8*sc,y:GROUND-(LASTROW[enemy.key]+1)*sc,sc,cx:146,cy:GROUND-6*sc}};
  function setup(k,e){kid=k;enemy=e;boss=!!e.boss;bgKind=KIDS[k].bg;S={pdx:0,edx:0,pfl:0,efl:0,shake:0,mag:0,proj:null,beam:0,bolts:[],meteors:[],parts:[],efx:[],eDead:0,shield:0}}
  function bg(t){
    if(bgKind==='jungle'){['#41a6f6','#55b6f8','#73eff7','#9ff4f9'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(0,i*18,W,18)});
      c.fillStyle='#ffcd75';c.fillRect(160,8,14,14);c.fillStyle='#fff3c4';c.fillRect(163,8,8,14);c.fillRect(160,11,14,8);
      clouds.forEach(cl=>{const x=((cl.x+t*cl.sp)%(W+40))-30;c.fillStyle='#f4f4f4';c.fillRect(x,cl.y,cl.w,4);c.fillRect(x+3,cl.y-3,cl.w-8,3)});
      for(let x=0;x<W;x++){const h=18+Math.round(7*Math.sin(x*.045)+4*Math.sin(x*.12));c.fillStyle='#257179';c.fillRect(x,GROUND-h,1,h)}
      [[12,0],[78,1],[176,0],[110,2]].forEach(([x,v])=>{c.fillStyle='#5d4037';c.fillRect(x+4,GROUND-26,3,26);c.fillStyle=v===1?'#a7f070':'#38b764';c.fillRect(x-2,GROUND-34,15,9);c.fillRect(x+1,GROUND-38,9,4)});
      c.fillStyle='#a7f070';c.fillRect(0,GROUND,W,2);
      for(let y=GROUND+2;y<H;y+=8)for(let x=0;x<W;x+=8){c.fillStyle=((x+y)/8|0)%2?'#38b764':'#2f9e57';c.fillRect(x,y,8,8)}}
    else if(bgKind==='plains'){['#29366f','#5d275d','#b13e53','#ef7d57','#ffcd75'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(0,i*13,W,13)});
      c.fillStyle='#ffcd75';c.fillRect(84,48,24,10);c.fillStyle='#fff3c4';c.fillRect(88,46,16,4);
      for(let x=0;x<W;x++){const h=26+Math.round(10*Math.sin(x*.04+2)+5*Math.sin(x*.15));c.fillStyle='#333c87';c.fillRect(x,GROUND-h,1,h)}
      for(let x=0;x<W;x++){const h=10+Math.round(4*Math.sin(x*.08));c.fillStyle='#5d275d';c.fillRect(x,GROUND-h,1,h)}
      if(Math.floor(t/2300)%3===0&&t%2300<120){c.fillStyle='#f4f4f4';let x=30+((t/2300|0)*53)%130,y=0;while(y<30){const nx=x+RI(-3,3);c.fillRect(Math.min(x,nx),y,Math.abs(nx-x)+1,4);x=nx;y+=4}}
      c.fillStyle='#ffcd75';c.fillRect(0,GROUND,W,2);
      for(let y=GROUND+2;y<H;y+=8)for(let x=0;x<W;x+=8){c.fillStyle=((x+y)/8|0)%2?'#a7f070':'#8fd860';c.fillRect(x,y,8,8)}}
    else{['#1a1c2c','#1f2547','#29366f','#333c87','#3b5dc9','#41a6f6'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(0,i*14,W,14)});
      stars.forEach(s=>{if((Math.floor(t/400)+s.p)%5){c.fillStyle='#f4f4f4';c.fillRect(s.x,s.y,1,1)}});
      c.fillStyle='#ffcd75';c.fillRect(150,10,10,10);c.fillStyle='#fff3c4';c.fillRect(152,10,6,10);c.fillRect(150,12,10,6);
      for(let x=0;x<W;x++){const h=24+Math.round(10*Math.sin(x*.05)+6*Math.sin(x*.13));c.fillStyle='#29366f';c.fillRect(x,GROUND-h,1,h);if(h>34){c.fillStyle='#f4f4f4';c.fillRect(x,GROUND-h,1,2)}}
      for(let x=0;x<W;x++){const h=10+Math.round(5*Math.sin(x*.09+1));c.fillStyle='#257179';c.fillRect(x,GROUND-h,1,h)}
      c.fillStyle='#a7f070';c.fillRect(0,GROUND,W,2);
      for(let y=GROUND+2;y<H;y+=8)for(let x=0;x<W;x+=8){c.fillStyle=((x+y)/8|0)%2?'#38b764':'#2f9e57';c.fillRect(x,y,8,8)}}
    if(boss){c.fillStyle='rgba(177,62,83,.22)';c.fillRect(0,0,W,H)}
  }
  function burst(x,y,cols,n=14,sp=1.8){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=.5+Math.random()*sp;S.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.6,life:28+R(22),col:pick(cols)})}}
  function text(str,x,y,cls=''){const d=document.createElement('div');d.className='dmg '+cls;d.textContent=str;d.style.left=(x/W*100)+'%';d.style.top=(y/H*100)+'%';stage.appendChild(d);
    d.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:'translate(-50%,-100%) scale(1.2)',opacity:1,offset:.3},{transform:'translate(-50%,-200%) scale(1)',opacity:0}],{duration:1100,easing:'steps(10)'}).onfinish=()=>d.remove()}
  function flash(ms,o=.9){flashEl.animate([{opacity:o},{opacity:0}],{duration:ms,easing:'steps(4)'})}
  function shake(ms,mag){if(RM)return;S.shake=performance.now()+ms;S.mag=mag}
  function loop(t){requestAnimationFrame(loop);if($('#battle').hidden||!beastOf(kid))return;try{frame(t)}catch(err){console.error(err)}}
  function frame(t){
    let sx=0,sy=0;if(t<S.shake){sx=RI(-1,1)*S.mag;sy=RI(-1,1)*S.mag}
    c.save();c.translate(sx,sy);bg(t);
    const p=pRect(),e=eRect(),K=beastOf(kid),{f}=P();const bob=Math.floor(t/350)%2;
    c.fillStyle='rgba(0,0,0,.25)';c.fillRect(p.cx-10+S.pdx,GROUND,20,3);if(!S.eDead)c.fillRect(e.cx-12+S.edx,GROUND,24,3);
    if(f>0&&Math.random()<.25)S.parts.push({x:p.cx+RI(-12,12)+S.pdx,y:GROUND-RI(4,16*p.sc),vx:0,vy:-.4,life:20,col:f===2?'#ffcd75':'#73eff7'});
    drawBeast(c,K,f,p.x+S.pdx,p.y+bob,p.sc,t<S.pfl&&Math.floor(t/60)%2,1,equipOf(kid));
    if(t<S.shield){c.strokeStyle=Math.floor(t/80)%2?'#73eff7':'#f4f4f4';c.lineWidth=2;c.strokeRect(p.x-4+S.pdx,p.y-4,16*p.sc+8,(LASTROW[K.sprite]+1)*p.sc+6)}
    if(!S.eDead)drawSprite(c,enemy.key,EPAL[enemy.key],e.x+S.edx,e.y+(1-bob),e.sc,t<S.efl&&Math.floor(t/60)%2);
    else if(t<S.eDead+700)drawSprite(c,enemy.key,EPAL[enemy.key],e.x,e.y+(t-S.eDead)/35,e.sc,true,Math.max(0,1-(t-S.eDead)/700));
    if(S.proj){const q=Math.min(1,(t-S.proj.st)/S.proj.dur),x0=p.cx+10,x1=e.cx-8,x=x0+(x1-x0)*q,y=p.cy-Math.sin(q*Math.PI)*10;
      K.shot.forEach((col,i)=>{c.fillStyle=col;const s=S.proj.big?7-i:4-i*.5;c.fillRect(Math.round(x-(3-i)*4),Math.round(y-s/2),Math.ceil(s),Math.ceil(s))})}
    if(S.beam){const cols=beastOf(kid).shot,k=Math.floor(t/50)%4;c.fillStyle=cols[(k+1)%4];const bh=S.beamBig?1.8:1;c.fillRect(p.cx+10,p.cy-7*bh,e.cx-p.cx-6,14*bh);c.fillStyle=cols[k];c.fillRect(p.cx+10,p.cy-4*bh,e.cx-p.cx-6,8*bh);c.fillStyle='#fff';c.fillRect(p.cx+10,p.cy-2,e.cx-p.cx-6,4);burst(e.cx,p.cy,cols,2)}
    S.bolts=S.bolts.filter(b=>{if(t>b.t0+260)return false;if(t<b.t0)return true;c.fillStyle=Math.floor(t/40)%2?'#f4f4f4':'#ffcd75';let x=b.x,y=0;while(y<e.cy){const nx=x+RI(-4,4);c.fillRect(Math.min(x,nx),y,Math.abs(nx-x)+2,5);x=nx;y+=5}return true});
    S.meteors=S.meteors.filter(m=>{const q=(t-m.t0)/380;if(q>1)return false;if(q<0)return true;const x=m.x0+(e.cx+m.dx-m.x0)*q,y=-10+(e.cy+10)*q;
      c.fillStyle='#ef7d57';c.fillRect(x-8,y-8,6,6);c.fillStyle='#ffcd75';c.fillRect(x-4,y-4,7,7);c.fillStyle='#5d4037';c.fillRect(x-1,y-1,8,8);c.fillStyle='#8b6b5a';c.fillRect(x+1,y,4,3);return true});
    S.efx=(S.efx||[]).filter(f=>{const u=(t-f.t0)/f.dur;if(u<0)return true;if(u>1)return false;f.draw(u,t);return true});
    S.parts=S.parts.filter(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.06;q.life--;c.fillStyle=q.col;c.fillRect(Math.round(q.x),Math.round(q.y),2,2);return q.life>0});
    c.restore();
  }
  setup(kid,enemy);requestAnimationFrame(loop);
  function impact(dmg,crit,big){const e=eRect(),now=performance.now();S.efl=now+(big?500:260);shake(big?550:crit?350:220,big?3:crit?2:1);
    burst(e.cx,e.cy,['#ffcd75','#ef7d57','#b13e53','#f4f4f4'],big?40:crit?24:14);Sfx.hit();if(crit&&!big){Sfx.crit();text('CRIT!',e.cx,e.cy-30,'gold')}text('-'+dmg,e.cx,e.cy-14,crit||big?'gold':'')}
  /* ---- attack effects: each resolves at the moment of impact ---- */
  const addFx=(dur,draw,delay=0)=>S.efx.push({t0:performance.now()+delay,dur,draw});
  const O=()=>{const p=pRect(),e=eRect();return{px:p.cx+10,py:p.cy,ex:e.cx,ey:e.cy}};
  function orb(x,y,cols,sz){cols.forEach((col,i)=>{c.fillStyle=col;const s=Math.max(1,sz-i*1.1);c.fillRect(Math.round(x-(3-i)*3-s/2),Math.round(y-s/2),Math.ceil(s),Math.ceil(s))})}
  const FXR={
    shot:async(K,big)=>{const o=O();Sfx.shoot();S.pdx=5;addFx(300,u=>orb(o.px+(o.ex-8-o.px)*u,o.py-Math.sin(u*Math.PI)*10,K.shot,big?7:4));await wait(300);S.pdx=0},
    multi:async(K,big)=>{const o=O(),n=big?6:3;S.pdx=4;for(let i=0;i<n;i++){const dy=RI(-10,10);addFx(260,u=>orb(o.px+(o.ex-8-o.px)*u,o.py+dy*(1-u)-Math.sin(u*Math.PI)*6,K.shot,3),i*90);setTimeout(()=>tone({f1:1400,f2:500,dur:.1,vol:.06}),i*90)}
      await wait(260+(n-1)*90);S.pdx=0},
    slash:async(K,big)=>{const o=O(),d=o.ex-o.px-14;Sfx.swish();for(let i=1;i<=5;i++){S.pdx=d*i/5;await wait(22)}const n=big?4:2;
      for(let k=0;k<n;k++){const dir=k%2?1:-1,col=k%2?K.shot[1]:'#f4f4f4';addFx(260,u=>{c.globalAlpha=1-u*.6;c.fillStyle=col;const L=Math.min(1,u*3)*30;for(let j=0;j<L;j+=2)c.fillRect(Math.round(o.ex-15+j),Math.round(dir>0?o.ey-15+j:o.ey+15-j),3,3);c.globalAlpha=1},k*110);if(k)setTimeout(()=>Sfx.swish(),k*110)}
      await wait(140+(n-1)*110);setTimeout(async()=>{for(let i=4;i>=0;i--){S.pdx=d*i/5;await wait(30)}},250)},
    roar:async(K,big)=>{const o=O(),n=big?5:3;Sfx.roar();shake(450,1);for(let k=0;k<n;k++)addFx(450,u=>{c.strokeStyle=K.shot[1+k%3];c.globalAlpha=1-u;c.lineWidth=3;c.beginPath();c.arc(o.px-6,o.py,6+u*(o.ex-o.px+14),-.7,.7);c.stroke();c.globalAlpha=1},k*100);await wait(380+(n-1)*70)},
    bolt:async(K,big)=>{const o=O(),n=big?5:1;for(let i=0;i<n;i++){S.bolts.push({t0:performance.now()+i*120,x:o.ex+(n>1?RI(-14,14):0)});setTimeout(()=>{Sfx.zap();flash(80,.45)},i*120)}await wait(120*(n-1)+150)},
    meteor:async(K,big)=>{const o=O(),n=big?5:3;for(let i=0;i<n;i++){S.meteors.push({t0:performance.now()+i*150,x0:200+i*16,dx:RI(-10,10)});setTimeout(()=>{Sfx.boom();shake(200,2);burst(o.ex,o.ey+8,['#ef7d57','#ffcd75','#5d4037'],12)},i*150+380)}await wait(380+(n-1)*150)},
    beam:async(K,big)=>{Sfx.beam();S.beamBig=big;S.beam=1;await wait(big?650:380);S.beam=0},
    wave:async(K,big)=>{const o=O(),h=big?32:18;Sfx.water();addFx(520,u=>{const x=o.px+(o.ex+18-o.px)*u;for(let i=0;i<16;i++){const hh=Math.round(h*Math.sin(i/16*Math.PI)*(.75+.25*Math.sin(u*20+i)));c.fillStyle=i<3?'#f4f4f4':K.shot[1+i%3];c.fillRect(Math.round(x-i*2),GROUND-hh,2,hh)}});await wait(440)},
    spikes:async(K,big)=>{const o=O();Sfx.crack();addFx(260,u=>{c.fillStyle='#1a1c2c';c.fillRect(o.px,GROUND,Math.round((o.ex-o.px)*u),2)});await wait(250);
      const n=big?7:4;for(let i=0;i<n;i++){const sx=o.ex+(i-(n-1)/2)*7,hm=(big?26:16)+RI(0,6);addFx(520,u=>{const h=Math.round(hm*Math.min(1,u*4)*(u>.8?(1-u)*5:1));for(let r=0;r<h;r++){const w=Math.max(1,Math.round((h-r)/h*5));c.fillStyle=r>h-3?'#f4f4f4':K.shot[1+(i%2)];c.fillRect(Math.round(sx-w/2),GROUND-r,w,1)}})}
      Sfx.boom();if(big)shake(500,3);await wait(90)},
    tornado:async(K,big)=>{const o=O(),H=big?62:42;Sfx.whoosh();addFx(big?850:620,(u,t)=>{const cx=u<.3?o.px+(o.ex-o.px)*u/.3:o.ex;for(let r=0;r<H;r+=2){const w=4+r*.38,off=Math.sin(t/55+r*.3)*w*.4;c.globalAlpha=.85;c.fillStyle=K.shot[(r/2|0)%4];c.fillRect(Math.round(cx+off-w/2),GROUND-r,Math.round(w),2)}c.globalAlpha=1});await wait(330)},
    pillar:async(K,big)=>{const o=O(),W2=big?22:12;Sfx.fire();addFx(big?750:520,(u,t)=>{const h=Math.round(Math.min(1,u*3)*(GROUND+6));for(let y=0;y<h;y+=2){const w=W2+Math.sin(t/40+y)*3;c.fillStyle=y%6<2?'#f4f4f4':K.shot[1+((y+(t/30|0))%3)];c.fillRect(Math.round(o.ex-w/2),GROUND-y,Math.round(w),2)}});await wait(230)},
    stars:async(K,big)=>{const o=O(),n=big?9:5;for(let i=0;i<n;i++){const x0=o.ex-46+RI(0,30),dx=RI(-10,10);addFx(380,u=>{const x=Math.round(x0+(o.ex+dx-x0)*u),y=Math.round(-6+(o.ey+6)*u);c.fillStyle=K.shot[1];c.fillRect(x-1,y-3,3,7);c.fillRect(x-3,y-1,7,3);c.fillStyle='#f4f4f4';c.fillRect(x,y,1,1);c.fillStyle=K.shot[2];c.fillRect(x-6,y-6,2,2)},i*80);setTimeout(()=>Sfx.twinkle(),i*80+300)}
      await wait(380+(n-1)*80)},
    bubbles:async(K,big)=>{const o=O(),n=big?14:8;Sfx.water();for(let i=0;i<n;i++){const ph=Math.random()*6,r=2+i%3;addFx(620,u=>{const x=o.px+(o.ex-o.px)*u,y=o.py-4+Math.sin(u*9+ph)*7-u*6;c.strokeStyle=i%2?'#73eff7':'#f4f4f4';c.lineWidth=1;c.beginPath();c.arc(Math.round(x),Math.round(y),r,0,7);c.stroke();c.fillStyle='#f4f4f4';c.fillRect(Math.round(x-r/2),Math.round(y-r/2),1,1)},i*45);setTimeout(()=>tone({type:'sine',f1:500+R(500),f2:900,dur:.06,vol:.05}),i*45)}
      await wait(560+(n-1)*45)},
    boomerang:async(K,big)=>{const o=O(),sz=big?2:1;Sfx.whoosh();addFx(640,(u,t)=>{const a=u*Math.PI,x=o.px+(o.ex-o.px)*Math.sin(a),y=o.py-14*Math.sin(a*2);const k=Math.floor(t/50)%4,d=[[1,0],[0,1],[-1,0],[0,-1]][k];
        c.fillStyle=K.shot[2];for(let j=-3;j<=3;j++)c.fillRect(Math.round(x+d[0]*j*sz),Math.round(y+d[1]*j*sz),2*sz,2*sz);c.fillStyle=K.shot[1];for(let j=0;j<=3;j++)c.fillRect(Math.round(x-d[1]*j*sz),Math.round(y+d[0]*j*sz),2*sz,2*sz)});
      await wait(320)},
    vines:async(K,big)=>{const o=O(),H=big?34:24;Sfx.swish();addFx(700,u=>{const g=Math.min(1,u*2),x=o.px+(o.ex-o.px)*g;for(let xx=o.px;xx<x;xx+=2){c.fillStyle=(xx/2|0)%3?'#38b764':'#257179';c.fillRect(Math.round(xx),GROUND-1+Math.round(Math.sin(xx/5)),2,2);if((xx|0)%14===0){c.fillStyle='#a7f070';c.fillRect(Math.round(xx),GROUND-3,3,2)}}
        if(u>.5){const h=Math.round(H*Math.min(1,(u-.5)*3));for(let y=0;y<h;y+=2){const sx=o.ex+Math.round(Math.sin(y/4)*10);c.fillStyle=y%6?'#38b764':'#a7f070';c.fillRect(sx-1,GROUND-y,3,2)}}});await wait(500)},
    shards:async(K,big)=>{const o=O(),n=big?8:5;for(let i=0;i<n;i++){const off=(i-(n-1)/2)*7;addFx(300,u=>{const x=o.px+(o.ex-6-o.px)*u,y=o.py+off*(1-u);c.fillStyle=K.shot[1];c.fillRect(Math.round(x-4),Math.round(y-1),6,3);c.fillStyle='#f4f4f4';c.fillRect(Math.round(x+2),Math.round(y),3,1)},i*45);setTimeout(()=>tone({f1:2000,f2:900,dur:.07,vol:.05}),i*45)}
      await wait(300+(n-1)*45)},
    quake:async(K,big)=>{const o=O();Sfx.crack();setTimeout(()=>Sfx.boom(),150);shake(big?800:600,big?4:3);
      addFx(650,u=>{c.fillStyle='#1a1c2c';let x=o.px,y=GROUND+3;const end=o.px+(o.ex+20-o.px)*Math.min(1,u*2);while(x<end){const nx=x+4,ny=GROUND+2+R(6);c.fillRect(Math.round(x),Math.min(y,ny),2,Math.abs(ny-y)+2);x=nx;y=ny}});
      for(let i=0;i<5;i++)setTimeout(()=>burst(o.px+(o.ex-o.px)*(i+1)/5,GROUND,['#8b6b5a','#5d4037','#c0cbdc'],6,1),i*70);await wait(380)},
    spin:async(K,big)=>{const o=O(),d=o.ex-o.px-12;Sfx.whoosh();const st=performance.now();addFx(520,(u,t)=>{const cx=o.px-10+S.pdx,n=big?8:6;for(let i=0;i<n;i++){const a=t/50+i*6.28/n;c.fillStyle=i%2?K.shot[1]:'#f4f4f4';c.fillRect(Math.round(cx+Math.cos(a)*12),Math.round(o.py+Math.sin(a)*12),2,2)}});
      for(let i=1;i<=6;i++){S.pdx=d*i/6;await wait(35)}setTimeout(async()=>{for(let i=5;i>=0;i--){S.pdx=d*i/6;await wait(30)}},260)},
    rainbow:async(K,big)=>{const o=O(),cols=['#e43b44','#f78a1d','#ffe14d','#3cb043','#2f6fe0','#9b5fe0'],hgt=big?42:30;for(let i=0;i<6;i++)setTimeout(()=>Sfx.twinkle(),i*70);
      addFx(700,u=>{const g=Math.min(1,u*1.6);for(let s2=0;s2<g;s2+=.012){const x=o.px+(o.ex-o.px)*s2,y=o.py-Math.sin(s2*Math.PI)*hgt;cols.forEach((col,b)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y-6+b*2),2,2)})}});await wait(460)},
    bomb:async(K,big)=>{const o=O();tone({f1:300,f2:600,dur:.2,vol:.06});addFx(520,(u,t)=>{const x=o.px+(o.ex-o.px)*u,y=o.py-Math.sin(u*Math.PI)*42;c.fillStyle='#1a1c2c';c.fillRect(Math.round(x-4),Math.round(y-4),8,8);c.fillStyle='#566c86';c.fillRect(Math.round(x-2),Math.round(y-3),2,2);c.fillStyle=Math.floor(t/60)%2?'#ffcd75':'#ef7d57';c.fillRect(Math.round(x+2),Math.round(y-7),2,3)});
      await wait(520);Sfx.boom();flash(120,.5);shake(big?500:350,big?4:3);addFx(420,u=>{c.strokeStyle=u<.5?'#ffcd75':'#ef7d57';c.lineWidth=3;c.beginPath();c.arc(o.ex,o.ey,Math.max(1,4+u*(big?40:28)),0,7);c.stroke()});burst(o.ex,o.ey,['#ffcd75','#ef7d57','#1a1c2c'],big?30:20,2.4)},
    orbit:async(K,big)=>{const o=O(),n=big?6:4,hold=380;tone({type:'sine',f1:600,f2:1200,dur:.3,vol:.05});for(let i=0;i<n;i++){const go=hold+i*90,dur=go+230;addFx(dur,(u,t)=>{const ms=u*dur,cx=o.px-10,a=t/90+i*6.28/n;let x,y;
        if(ms<go){x=cx+Math.cos(a)*13;y=o.py+Math.sin(a)*13}else{const q=(ms-go)/230,sx=cx+Math.cos(a)*13,sy=o.py+Math.sin(a)*13;x=sx+(o.ex-sx)*q;y=sy+(o.ey-sy)*q}orb(x,y,K.shot,3)});setTimeout(()=>tone({f1:1300,f2:600,dur:.08,vol:.05}),go)}
      await wait(hold+(n-1)*90+230)},
    laser:async(K,big)=>{const o=O(),amp=big?20:14;Sfx.beam();addFx(520,(u,t)=>{const g=Math.min(1,u*2.4),end=o.px+(o.ex-o.px)*g;c.fillStyle=Math.floor(t/40)%2?K.shot[1]:'#f4f4f4';
        for(let x=o.px;x<end;x+=1){const ph=((x-o.px)%40)/40,y=o.py+(ph<.5?ph*4-1:3-ph*4)*amp*(1-(x-o.px)/(o.ex-o.px)*.8);c.fillRect(Math.round(x),Math.round(y),2,2)}});await wait(260)}
  };
  const FX_LABEL={shot:'BLAST',multi:'TRIPLE SHOT',slash:'SLASH',roar:'ROAR',bolt:'THUNDER',meteor:'METEOR RAIN',beam:'BEAM',wave:'TIDAL WAVE',spikes:'SPIKE BURST',tornado:'TORNADO',pillar:'FIRE PILLAR',stars:'STAR SHOWER',
    bubbles:'BUBBLE STORM',boomerang:'BOOMERANG',vines:'VINE WRAP',shards:'CRYSTAL SHARDS',quake:'EARTHQUAKE',spin:'SPIN DASH',rainbow:'RAINBOW ARC',bomb:'BOMB TOSS',orbit:'ORBIT ORBS',laser:'ZIGZAG LASER'};
  return{setup,text,FXR,FX_LABEL,
    async attack(kind,dmg,crit,onImpact){const K=beastOf(kid),M=FXMAP[Save.kid(kid).starter]||FXMAP.dino,sup=kind==='super';
      const pool=FX_POOL[Save.kid(kid).starter]||FX_POOL.dino;let type;
      if(sup)type=M.ult;else{type=pick(pool.filter(x=>x!==S.lastFx));S.lastFx=type;text(FX_LABEL[type]+'!',60,42,kind===3||crit?'gold':'cyan')}
      if(sup){Sfx.ult();flash(300);S.pdx=-3;text(K.ult+'!',96,30,'gold');await wait(420);S.pdx=0}
      await FXR[type](K,sup||crit||kind===3);
      if(sup)flash(250);impact(dmg,crit,sup);onImpact();await wait(sup?650:550);S.pdx=0},
    async fizzle(){const p=pRect();S.pdx=3;Sfx.fizzle();burst(p.cx+12,p.cy,['#94b0c2','#566c86'],8,.8);text('MISS',p.cx+16,p.cy-12,'');await wait(300);S.pdx=0;await wait(300)},
    async enemyAttack(dmg,blocked,onImpact){for(let i=1;i<=6;i++){S.edx=-i*5;await wait(25)}
      const p=pRect(),now=performance.now();
      if(blocked){S.shield=now+600;Sfx.block();burst(p.cx+12,p.cy,['#73eff7','#f4f4f4'],16);text('BLOCK!',p.cx,p.cy-24,'cyan')}
      else{S.pfl=now+320;shake(260,2);burst(p.cx,p.cy,['#73eff7','#41a6f6','#f4f4f4'],16);Sfx.hit();text('-'+dmg,p.cx,p.cy-18,'')}
      onImpact();for(let i=5;i>=0;i--){S.edx=-i*5;await wait(30)}await wait(450)},
    async enemyDie(){const e=eRect();S.eDead=performance.now();burst(e.cx,e.cy,['#73eff7','#41a6f6','#ffcd75','#f4f4f4'],50,2.4);await wait(800)}
  };
})();

