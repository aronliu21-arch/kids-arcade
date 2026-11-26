/* ================= 10-second opening animation ================= */
const Intro=(()=>{const o=$('#intro'),cv=$('#introCv'),c=cv.getContext('2d'),W=320,H=180,GY=150,DUR=10.2;
  let t0=null,last=0,raf=0,done=true,snd=false,cues={},parts=[],resolve=null;
  const stars=Array.from({length:70},(_,i)=>({x:(i*97)%W,y:(i*53)%110,p:i}));
  const CJK="'PingFang TC','Heiti TC','Noto Sans TC','Noto Sans CJK TC','Microsoft JhengHei',sans-serif";
  const ease=u=>1-Math.pow(1-Math.min(1,Math.max(0,u)),3);
  const once=(k,fn)=>{if(!cues[k]){cues[k]=1;fn()}};
  const burst=(x,y,cols,n)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,v=.6+Math.random()*2.2;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.6,l:30+R(25),col:pick(cols)})}};
  const kidBeasts=()=>{const out=[];for(const k of ['nora','lucas','milo']){const s=Save.kid(k);const st=STARTERS[s.starter];if(st)out.push([st,formOf(s.xp),s.equip||null])}
    const fill=['fox','bird','dino'].map(id=>[STARTERS[id],0]);while(out.length<3)out.push(fill[out.length]);return out};
  const feet=(key,sc)=>(LASTROW[key]+1)*sc;
  function scene(t){
    // sky, stars, moon, hills, ground
    ['#0b0c16','#1a1c2c','#1f2547','#29366f','#333c87','#3b5dc9'].forEach((col,i)=>{c.fillStyle=col;c.fillRect(0,i*26,W,26)});
    const sa=Math.min(1,t/1.5);stars.forEach(s=>{if((Math.floor(t*3)+s.p)%6){c.globalAlpha=sa*(.5+.5*((s.p%3)/2));c.fillStyle='#f4f4f4';c.fillRect(s.x,s.y,1,1)}});c.globalAlpha=1;
    c.fillStyle='#ffcd75';c.globalAlpha=sa;c.fillRect(262,14,16,16);c.fillStyle='#fff3c4';c.fillRect(265,14,10,16);c.fillRect(262,17,16,10);c.globalAlpha=1;
    for(let x=0;x<W;x++){const h=30+Math.round(12*Math.sin(x*.035)+7*Math.sin(x*.11));c.fillStyle='#29366f';c.fillRect(x,GY-h,1,h);if(h>44){c.fillStyle='#c0cbdc';c.fillRect(x,GY-h,1,2)}}
    for(let x=0;x<W;x++){const h=12+Math.round(5*Math.sin(x*.08+1));c.fillStyle='#257179';c.fillRect(x,GY-h,1,h)}
    c.fillStyle='#a7f070';c.fillRect(0,GY,W,2);for(let y=GY+2;y<H;y+=8)for(let x=0;x<W;x+=8){c.fillStyle=((x+y)/8|0)%2?'#38b764':'#2f9e57';c.fillRect(x,y,8,8)}
  }
  function text(str,x,y,size,col,font,alpha=1,shadow='#1a1c2c'){c.globalAlpha=alpha;c.font=`${size}px ${font}`;c.textAlign='center';c.textBaseline='middle';
    c.fillStyle=shadow;c.fillText(str,x+2,y+2);c.fillStyle=col;c.fillText(str,x,y);c.globalAlpha=1}
  function frame(now){const t=(now-t0)/1000;let sx=0,sy=0;
    if(t>5&&t<5.4){sx=RI(-2,2);sy=RI(-1,1)}if(t>8.5&&t<8.9){sx=RI(-3,3);sy=RI(-2,2)}
    c.save();c.translate(sx,sy);scene(t);
    // A: opening line
    if(t<2.4){const a=t<.4?0:t<2?Math.min(1,(t-.4)/.5):1-(t-2)/.4;text('很久很久以前……',W/2,62,16,'#f4f4f4',CJK,a);text('Long ago, in the land of Lumora…',W/2,84,8,'#73eff7',"'Press Start 2P',monospace",a)}
    // B: parade of the 10 starters
    if(t>1.8&&t<5.4){STARTER_ORDER.forEach((id,i)=>{const st=STARTERS[id],x=-30+(t-1.8)*210-i*32;if(x<-40||x>W+10)return;const hop=Math.abs(Math.sin((t*9)+i))*5;
      drawBeast(c,st,0,Math.round(x),Math.round(GY-feet(st.sprite,2)-hop),2,false)});if(t>2)once('par',()=>snd&&Music.start('adventure'))}
    // C: lightning, castle, King Drako, monsters hop in
    if(t>5){c.fillStyle='#566c86';c.fillRect(250,GY-74,52,74);c.fillRect(246,GY-84,10,12);c.fillRect(271,GY-90,10,18);c.fillRect(296,GY-84,10,12);c.fillStyle='#1a1c2c';c.fillRect(270,GY-26,12,26);c.fillStyle='#ffcd75';c.fillRect(258,GY-56,6,6);c.fillRect(288,GY-56,6,6);
      const up=ease((t-5.1)/.6);drawSprite(c,'dragon',EPAL.dragon,262,Math.round(GY-74-48*up+6),3,t>7.6&&t<8.4&&Math.floor(t*12)%2,Math.min(1,up*1.5));
      const mons=['slime','bat','mush','ghost','golem'];mons.forEach((k,i)=>{const arr=5.3+i*.18,u=ease((t-arr)/.45);if(t<arr)return;const x=W+20-(W+20-(150+i*20))*u,hop=u<1?Math.abs(Math.sin(u*Math.PI*2))*14:Math.abs(Math.sin(t*6+i))*2;
        drawSprite(c,k,EPAL[k],Math.round(x),Math.round(GY-feet(k,1.5)*1-hop-(k==='bat'?18:0)),1.5,t>7.6&&t<8.4&&Math.floor(t*12+i)%2)})}
    if(t>4.95&&t<5.25){c.fillStyle='rgba(244,244,244,.85)';c.fillRect(-4,-4,W+8,H+8);c.fillStyle='#ffcd75';let x=240,y=0;while(y<GY-60){const nx=x+RI(-8,8);c.fillRect(Math.min(x,nx),y,Math.abs(nx-x)+3,6);x=nx;y+=6}}
    if(t>5)once('thunder',()=>{if(snd){noise({dur:.9,vol:.35,lp:700});tone({f1:90,f2:30,dur:.8,vol:.25})}});
    // D: the kids' beasts leap in and attack
    if(t>6.8){kidBeasts().forEach(([st,f,eq],i)=>{const arr=6.8+i*.2,u=ease((t-arr)/.5);if(t<arr)return;const x=-40+(40+22+i*36)*u,jump=u<1?Math.sin(u*Math.PI)*26:Math.abs(Math.sin(t*5+i))*2;
        drawBeast(c,st,f,Math.round(x),Math.round(GY-feet(st.sprite,2)-jump),2,false,1,eq);
        const fire=7.55+i*.3;if(t>fire&&t<fire+.35){const q=(t-fire)/.35,sx2=x+34,ex=170+i*20,y=GY-24-i*6;st.shot.forEach((col,j)=>{c.fillStyle=col;const px=sx2+(ex-sx2)*q-(3-j)*5;c.fillRect(Math.round(px),Math.round(y-2+j%2),6-j,4)})}
        if(t>fire+.35)once('hit'+i,()=>{burst(170+i*20,GY-24-i*6,['#ffcd75','#ef7d57','#f4f4f4',st.shot[2]],22);if(snd){Sfx.zap();Sfx.hit()}});
        if(t>fire)once('shot'+i,()=>snd&&Sfx.shoot())})}
    // particles
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.l--;c.fillStyle=p.col;c.fillRect(Math.round(p.x),Math.round(p.y),2,2);if(p.l<=0)parts.splice(i,1)}
    // E: flash + title slam
    if(t>8.4){const fl=Math.max(0,1-(t-8.4)/.5);if(fl>0){c.fillStyle=`rgba(255,255,255,${fl})`;c.fillRect(-4,-4,W+8,H+8)}
      once('fan',()=>{if(snd){Music.stop();Sfx.ult();setTimeout(()=>Sfx.win(),350)}burst(W/2,70,['#ffcd75','#73eff7','#f4f4f4','#ef7d57'],60)});
      const s=1+2.2*(1-ease((t-8.45)/.35));c.save();c.translate(W/2,64);c.scale(s,s);c.globalAlpha=Math.min(1,(t-8.4)/.15);
      c.font=`900 40px ${CJK}`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#1a1c2c';c.fillText('問答神獸',4,4);c.fillStyle='#b13e53';c.fillText('問答神獸',2,2);c.fillStyle='#ffcd75';c.fillText('問答神獸',0,0);c.restore();c.globalAlpha=1;
      if(t>8.8)text('QUESTION BEASTS',W/2,98,10,'#ffcd75',"'Press Start 2P',monospace",Math.min(1,(t-8.8)/.3),'#b13e53');
      if(t>9.2&&Math.floor(t*2.5)%2)text('TAP TO START',W/2,118,8,'#f4f4f4',"'Press Start 2P',monospace")}
    c.restore();
    if(t>=DUR)finish()}
  /* the clock starts on the first frame actually shown, and pauses while the page is hidden or loading in the background */
  function loop(now){if(done)return;raf=requestAnimationFrame(loop);if(document.hidden){last=0;return}
    if(t0===null)t0=now;if(last&&now-last>200)t0+=now-last-16;last=now;try{frame(now)}catch(e){console.error(e)}}
  function finish(){if(done)return;done=true;cancelAnimationFrame(raf);o.hidden=true;Music.stop();const r=resolve;resolve=null;if(r)r()}
  function play(withSound){return new Promise(res=>{if(!done){done=true;cancelAnimationFrame(raf)}const prev=resolve;resolve=()=>{if(prev)prev();res()};snd=!!withSound&&soundOn;cues={};parts=[];done=false;o.hidden=false;
    $('#introSound').hidden=snd;t0=null;last=0;raf=requestAnimationFrame(loop)})}
  cv.addEventListener('click',()=>{ac();finish()});
  $('#introSkip').onclick=ev=>{ev.stopPropagation();ac();finish()};
  $('#introSound').onclick=ev=>{ev.stopPropagation();ac();play(true)};
  document.addEventListener('keydown',ev=>{if(!done&&!ev.metaKey&&!ev.ctrlKey){ev.preventDefault();ac();finish()}});
  return{play,finish,get running(){return !done}};
})();

/* ================= stars, shop items & equipment (looks only) ================= */
const STAR_WIN=10,STAR_BOSS=15;
const starsOf=kid=>{const s=Save.kid(kid);return Math.max(0,num(s.starsEarned)-num(s.starsSpent))};
const addStars=(kid,n)=>{const s=Save.kid(kid);s.starsEarned=num(s.starsEarned)+n;Save.save()};
/* item grid letters → colors; anchor: head = sits on top of the head, neck = centered under the face, hand = held at the front, face = drawn over the eyes */
const IPAL={r:'#e43b44',y:'#ffe14d',Y:'#f78a1d',p:'#ff8fc8',b:'#9b5fe0',B:'#2f6fe0',g:'#3cb043',G:'#257179',k:'#1a1c2c',w:'#f4f4f4',n:'#8b5a2b',s:'#c0cbdc',c:'#73eff7'};
const ITEMS={
  partyhat:{slot:'head',zh:'派對帽',en:'Party Hat',price:15,g:['..y..','..r..','.rrr.','.ryr.','rrrrr','yyyyy']},
  flowercrown:{slot:'head',zh:'花冠',en:'Flower Crown',price:20,g:['.p...p.','pyp.pyp','.ggggg.']},
  wizardhat:{slot:'head',zh:'魔法帽',en:'Wizard Hat',price:25,g:['...b..','..bb..','..bbb.','.bbyb.','.bbbb.','bbbbbb']},
  piratehat:{slot:'head',zh:'海盜帽',en:'Pirate Hat',price:25,g:['..kkk..','.kkwkk.','kkkkkkk']},
  sunglasses:{slot:'face',zh:'墨鏡',en:'Sunglasses',price:15,face:'shades'},
  heartglasses:{slot:'face',zh:'愛心眼鏡',en:'Heart Glasses',price:20,face:'hearts'},
  mustache:{slot:'face',zh:'小鬍子',en:'Funny Mustache',price:15,face:'stache'},
  heromask:{slot:'face',zh:'英雄面具',en:'Hero Mask',price:25,face:'mask'},
  bowtie:{slot:'neck',zh:'領結',en:'Bow Tie',price:15,g:['rr.rr','rrrrr','rr.rr']},
  scarf:{slot:'neck',zh:'紅圍巾',en:'Red Scarf',price:20,g:['rrrrrr','rrrrrr','...rr.','...rr.']},
  medal:{slot:'neck',zh:'星星獎牌',en:'Star Medal',price:25,g:['B...B','.B.B.','..y..','.yyy.','..y..']},
  bell:{slot:'neck',zh:'鈴鐺項圈',en:'Bell Collar',price:15,g:['rrrrr','.yyy.','..y..']},
  sword:{slot:'hand',zh:'木劍',en:'Wooden Sword',price:20,g:['.s.','.s.','.s.','.s.','.s.','nnn','.n.']},
  wand:{slot:'hand',zh:'魔法棒',en:'Magic Wand',price:25,g:['.y.','yyy','.y.','.b.','.b.','.b.','.b.']},
  lollipop:{slot:'hand',zh:'棒棒糖',en:'Lollipop',price:15,g:['.ppp.','pwpwp','ppwpp','.ppp.','..w..','..w..','..w..']},
  balloon:{slot:'hand',zh:'氣球',en:'Balloon',price:20,g:['.rrr.','rrwrr','rrrrr','.rrr.','..r..','..k..','.k...','..k..']},
  hammer:{slot:'hand',zh:'玩具槌',en:'Toy Hammer',price:30,g:['kkkkk','kpppk','kkkkk','..n..','..n..','..n..']}
};
const SLOTS=[['head','帽子','HAT'],['face','臉','FACE'],['neck','脖子','NECK'],['hand','手上','HOLD']];
/* where each item goes on each beast, worked out from the sprite pixels */
const ANCH={};for(const k in SPR){const g=SPR[k];let er=g.findIndex(r=>r.includes('w'));if(er<0)er=4;
  const eyes=[];for(let q=0;q<16;q++)if(g[er][q]==='w')eyes.push(q);const ex=eyes.reduce((a,b)=>a+b,0)/eyes.length;
  const groups=[];eyes.forEach(q=>{const l=groups[groups.length-1];if(l&&q===l[l.length-1]+1)l.push(q);else groups.push([q])});
  const hr=Math.min(15,Math.round((er+LASTROW[k])/2)+1);let hx=0;for(let q=15;q>=0;q--)if(g[hr][q]!=='.'){hx=q;break}
  ANCH[k]={er,ex,eyes:groups.map(gr=>gr.reduce((a,b)=>a+b,0)/gr.length),hr,hx}}
function drawEquip(c,st,eq,x,y,sc,flash){if(!eq)return;const A=ANCH[st.sprite];if(!A)return;
  const P=(col,row,clr)=>{c.fillStyle=flash?'#f4f4f4':clr;c.fillRect(Math.round(x+col*sc),Math.round(y+row*sc),Math.ceil(sc),Math.ceil(sc))};
  const grid=(it,left,top)=>it.g.forEach((r,ri)=>[...r].forEach((ch,ci)=>{if(ch!=='.')P(left+ci,top+ri,IPAL[ch])}));
  const it=id=>ITEMS[id];
  if(eq.neck&&it(eq.neck)){const I=it(eq.neck),w=I.g[0].length;grid(I,Math.round(A.ex+.5-w/2),A.er+3)}
  if(eq.face&&it(eq.face)){const f=it(eq.face).face,ey=A.eyes.map(Math.round),er=A.er;
    if(f==='shades'){ey.forEach(e=>{for(let q=e-1;q<=e+1;q++)P(q,er,'#1a1c2c');P(e-1,er,'#566c86')});if(ey.length>1)for(let q=ey[0]+2;q<=ey[ey.length-1]-2;q++)P(q,er,'#1a1c2c')}
    else if(f==='hearts'){ey.forEach(e=>{P(e-1,er-1,'#ff8fc8');P(e+1,er-1,'#ff8fc8');for(let q=e-1;q<=e+1;q++)P(q,er,'#ff8fc8');P(e,er+1,'#ff8fc8')})}
    else if(f==='stache'){const cx=Math.round(A.ex);for(let d=-2;d<=2;d++)P(cx+d,er+2,'#5d4037');P(cx-3,er+1,'#5d4037');P(cx+3,er+1,'#5d4037')}
    else if(f==='mask'){const l=Math.min(...ey)-2,r=Math.max(...ey)+2;for(let q=l;q<=r;q++){if(!ey.includes(q))P(q,er,'#e43b44');P(q,er-1,'#e43b44')}}}
  if(eq.hand&&it(eq.hand)){const I=it(eq.hand),h=I.g.length;grid(I,A.hx,A.hr+1-h)}
  if(eq.head&&it(eq.head)){const I=it(eq.head),w=I.g[0].length,h=I.g.length;grid(I,Math.round(A.ex+.5-w/2),A.er-1-h)}}
const equipOf=kid=>{const s=Save.kid(kid);return s.equip||{}};
function itemIcon(cv,id){const c=cv.getContext('2d'),I=ITEMS[id];c.clearRect(0,0,cv.width,cv.height);
  if(I.g){const w=I.g[0].length,h=I.g.length,s=Math.floor(Math.min(cv.width/(w+2),cv.height/(h+2)));const ox=(cv.width-w*s)/2,oy=(cv.height-h*s)/2;
    I.g.forEach((r,ri)=>[...r].forEach((ch,ci)=>{if(ch!=='.'){c.fillStyle=IPAL[ch];c.fillRect(ox+ci*s,oy+ri*s,s,s)}}))}
  else{const s=cv.width/14;const fake={sprite:'slime'};c.fillStyle='#262b44';c.fillRect(0,0,cv.width,cv.height);drawSprite(c,'slime',EPAL.slime,s*-1,s*-2,s,false);drawEquip(c,{sprite:'slime'},{face:id},s*-1,s*-2,s,false)}}

