async function enemyTurn(){const K=KIDS[B.kid];hud();$('#cards').hidden=true;
  if(K.shield){msg(`${B.enemy.name} is about to attack! Answer to raise your shield!`);B.card={name:'SHIELD'};await wait(500);ask(1,'shield')}
  else{const dmg=K.enemyDmg+(B.enemy.boss?4:0);msg(`${B.enemy.name} attacks!`);await wait(500);
    await Fx.enemyAttack(dmg,false,()=>{B.php=Math.max(0,B.php-dmg);hud()});if(B.php<=0)return defeat();showCards();msg('Your turn! Pick an attack.')}}
async function victory(){Music.stop();msg(`You beat ${B.enemy.name}!`);await Fx.enemyDie();Sfx.win();
  const s=Save.kid(B.kid),K=beastOf(B.kid),oldLv=levelOf(s.xp),oldF=formOf(s.xp),gain=20+Math.min(B.stage,8)*10+(B.php===100?10:0);
  const stars=B.enemy.boss?STAR_BOSS:STAR_WIN;s.starsEarned=num(s.starsEarned)+stars;
  s.xp+=gain;s.cleared=Math.max(s.cleared,B.stage);Save.save();const lv=levelOf(s.xp),f=formOf(s.xp);
  let l2=B.php===100?'Perfect battle! +10 bonus XP.':'';
  if(f>oldF)l2=`${zhOf(K,oldF)} 進化成 ${zhOf(K,f)}！ (${K.names[oldF]} → ${K.names[f]})`;else if(lv>oldLv)l2=`Level up! Now Lv ${lv}.`;
  if(f>oldF){await wait(300);await evolveAnim(K,oldF,f);$('#pName').innerHTML=`<span class="zht">${zhOf(K,f)}</span>`}else if(lv>oldLv)setTimeout(()=>Sfx.level(),700);
  const from=Math.min(B.stage,7)-1,to=Math.min(B.stage+1,7)-1;
  result(f>oldF?'EVOLUTION!':B.enemy.boss?'BOSS DEFEATED!':'VICTORY!',`+${gain} XP · +${stars} ⭐`,l2,'NEXT ▶',()=>{curKid=B.kid;const k=B.kid;const shopNow=B.stage%2===0;Mini.play(k).then(()=>Story.next(k)?Story.play(k):null).then(()=>shopNow?Shop.open(k):null).then(()=>{renderWorld();show('world');if(to>from)MapV.travel(from,to);else MapV.show(k)})})}
function evolveAnim(st,from,to){return new Promise(res=>{const o=$('#evolve'),cv=$('#evoCv'),c=cv.getContext('2d'),W=cv.width,s=10,t0=performance.now(),parts=[],T=RM?900:3200;
  o.hidden=false;$('#eGo').hidden=true;$('#eText').innerHTML=`咦？<span class="zht">${zhOf(st,from)}</span>要進化了！<br>What? ${st.names[from]} is evolving!`;Music.stop();
  for(let i=0;i<16;i++)tone({f1:330+i*55,dur:.14,vol:.06,delay:i*.19});
  let done=false,flashed=false;
  function frame(t){const e=Math.max(0,t-t0);c.fillStyle='#0b0c16';c.fillRect(0,0,W,W);
    c.save();c.translate(W/2,W/2);if(!RM)c.rotate(e/1600);for(let i=0;i<12;i++){c.rotate(Math.PI/6);c.fillStyle=i%2?'rgba(115,239,247,.12)':'rgba(255,205,117,.12)';c.beginPath();c.moveTo(0,0);c.lineTo(-22,-W);c.lineTo(22,-W);c.fill()}c.restore();
    for(let k=0;k<3;k++){const r=Math.max(1,((e/5)+k*45)%150);c.strokeStyle=`rgba(244,244,244,${Math.max(0,1-r/150)})`;c.lineWidth=3;c.beginPath();c.arc(W/2,W/2+10,r,0,7);c.stroke()}
    if(e<T){if(e<600)drawBeast(c,st,from,3*s,4*s,s,false);else{const per=Math.max(55,360-(e-600)/7);drawBeast(c,st,Math.floor(e/per)%2?to:from,3*s,4*s,s,true)}
      if(Math.random()<.5)parts.push({x:W/2+RI(-90,90),y:W,vx:0,vy:-1-Math.random()*2,l:90,col:pick(['#73eff7','#ffcd75','#f4f4f4'])})}
    else{if(!flashed){flashed=true;Sfx.level();Sfx.crit();for(let i=0;i<90;i++){const a=Math.random()*6.28,v=1+Math.random()*4;parts.push({x:W/2,y:W/2,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:60+R(50),col:pick(['#ffcd75','#73eff7','#f4f4f4',st.shot[2]])})}
        $('#eText').innerHTML=`<span class="zht">${zhOf(st,from)}</span> 進化成 <span class="zht">${zhOf(st,to)}</span>！<br>${st.names[from]} evolved into ${st.names[to]}!`;$('#eGo').hidden=false;setTimeout(()=>$('#eGo').focus(),50)}
      drawBeast(c,st,to,3*s,4*s,s,false);const fl=Math.max(0,1-(e-T)/500);if(fl>0){c.fillStyle=`rgba(255,255,255,${fl})`;c.fillRect(0,0,W,W)}}
    for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.l--;c.fillStyle=p.col;c.fillRect(Math.round(p.x),Math.round(p.y),4,4);if(p.l<=0)parts.splice(i,1)}
  }
  function finish(){if(done)return;done=true;o.hidden=true;o.onclick=null;Sfx.tap();res()}
  function showBtn(){$('#eText').innerHTML=`<span class="zht">${zhOf(st,from)}</span> 進化成 <span class="zht">${zhOf(st,to)}</span>！<br>${st.names[from]} evolved into ${st.names[to]}!`;$('#eGo').hidden=false}
  function loop(t){if(done)return;try{frame(t)}catch(err){console.error(err)}requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
  setTimeout(()=>{if(!done&&$('#eGo').hidden)showBtn()},T+800);
  $('#eGo').onclick=ev=>{ev.stopPropagation();finish()};
  setTimeout(()=>{o.onclick=()=>{if($('#eGo').hidden)showBtn();else finish()}},1500)})}
async function defeat(){Music.stop();Sfx.lose();msg('Knocked out!');await wait(600);
  const s=Save.kid(B.kid);s.xp+=5;Save.save();result('KNOCKED OUT','+5 XP for trying','Every miss teaches you something. Try again!','TRY AGAIN',()=>startBattle(B.kid,B.stage))}
function result(title,l1,l2,goLabel,go){$('#rTitle').textContent=title;$('#rLine1').textContent=l1;$('#rLine2').textContent=l2;$('#rGo').textContent=goLabel;
  paintBeast($('#rSprite'),B.kid);$('#result').hidden=false;
  $('#rGo').onclick=()=>{$('#result').hidden=true;go()};$('#rMap').onclick=()=>{$('#result').hidden=true;renderWorld();show('world')}}

/* ================= mini games (pure fun, between monsters) ================= */
const Mini=(()=>{const o=$('#mini'),cv=$('#miniCv'),c=cv.getContext('2d'),W=240,H=180;
  let g=null,raf=0,last=0,score=0,tLeft=0,state='idle',resolve=null,lastIdx=-1,parts=[],keys={};
  const pop=(x,y,col,n=10)=>{for(let i=0;i<n;i++){const a=Math.random()*6.28,v=.6+Math.random()*1.8;parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.5,l:26+R(14),col})}};
  const band=(cols)=>{const h=Math.ceil(H/cols.length);cols.forEach((col,i)=>{c.fillStyle=col;c.fillRect(0,i*h,W,h)})};
  const grass=(y,a='#38b764',b='#2f9e57',off=0)=>{c.fillStyle='#a7f070';c.fillRect(0,y,W,2);for(let yy=y+2;yy<H;yy+=8)for(let x=-16;x<W+8;x+=8){const xx=x-((off|0)%16);c.fillStyle=((Math.floor((x+off)/8)+yy/8)|0)%2?a:b;c.fillRect(xx,yy,8,8)}};
  const star=(x,y,col)=>{x=Math.round(x);y=Math.round(y);c.fillStyle=col;c.fillRect(x-1,y-4,3,9);c.fillRect(x-4,y-1,9,3);c.fillRect(x-2,y-2,5,5);c.fillStyle='#f4f4f4';c.fillRect(x,y-1,1,1)};
  const gem=(x,y)=>{x=Math.round(x);y=Math.round(y);c.fillStyle='#73eff7';c.fillRect(x-3,y-3,7,7);c.fillStyle='#41a6f6';c.fillRect(x-1,y-5,3,11);c.fillStyle='#f4f4f4';c.fillRect(x-2,y-2,2,2)};
  const rock=(x,y,s=1)=>{x=Math.round(x);y=Math.round(y);c.fillStyle='#1a1c2c';c.fillRect(x-6*s,y-5*s,12*s,10*s);c.fillStyle='#8b9bb4';c.fillRect(x-5*s,y-4*s,10*s,8*s);c.fillStyle='#5a6988';c.fillRect(x-5*s,y+1*s,10*s,3*s)};
  const coin=(x,y,t)=>{x=Math.round(x);y=Math.round(y);const w=Math.abs(Math.sin(t/150))*4+1;c.fillStyle='#ef7d57';c.fillRect(x-w-1,y-5,w*2+2,10);c.fillStyle='#ffcd75';c.fillRect(x-w,y-4,w*2,8)};
  let miniKid=null,miniEq=null,earned=0;
  const beastAt=(st,f,x,gy,sc,flash)=>drawBeast(c,st,f,Math.round(x-8*sc),Math.round(gy-(LASTROW[st.sprite]+1)*sc),sc,flash,1,miniEq);

  function catchGame(st,f){let px=W/2,tx=W/2,items=[],spawn=0,bonk=0;
    return{name:'STAR CATCH',how:'Move your beast to catch the falling stars! Blue gems are worth 3. Drag, tap, or use ← →.',timed:15000,
      down(x){tx=x},move(x){tx=x},
      update(dt){const s=dt/1000;if(keys.ArrowLeft)tx=px-40;if(keys.ArrowRight)tx=px+40;px+=Math.sign(tx-px)*Math.min(Math.abs(tx-px),230*s);px=Math.max(14,Math.min(W-14,px));
        spawn-=dt;if(spawn<=0){spawn=340+R(300);const r=Math.random();items.push({x:12+R(W-24),y:-8,v:42+R(45),k:r<.12?'rock':r<.24?'gem':'star'})}
        items.forEach(it=>it.y+=it.v*s);
        items=items.filter(it=>{if(it.y>128&&it.y<158&&Math.abs(it.x-px)<17){if(it.k==='rock'){bonk=450;Sfx.hit();pop(it.x,it.y,'#8b9bb4')}else{score+=it.k==='gem'?3:1;Sfx.twinkle();pop(it.x,it.y,it.k==='gem'?'#73eff7':'#ffcd75')}return false}return it.y<H+10});bonk-=dt},
      draw(t){band(['#1a1c2c','#1f2547','#29366f','#333c87','#3b5dc9']);for(let i=0;i<24;i++){if((i+Math.floor(t/400))%5){c.fillStyle='#f4f4f4';c.fillRect((i*53)%W,(i*29)%110,1,1)}}grass(156);
        items.forEach(it=>it.k==='star'?star(it.x,it.y,'#ffcd75'):it.k==='gem'?gem(it.x,it.y):rock(it.x,it.y));beastAt(st,f,px,157+(Math.floor(t/200)%2),2,bonk>0&&Math.floor(t/80)%2)}}}

  function whack(){const holes=[];for(let r=0;r<3;r++)for(let q=0;q<3;q++)holes.push({x:48+q*72,y:66+r*40,up:0,t:0,kind:'slime',hit:0,gold:0});let spawn=300;
    return{name:'MONSTER POP',how:'Tap the monsters when they pop up! Gold ones with a crown are worth 3.',timed:12500,
      down(x,y){for(const h of holes){if(h.up>.5&&!h.hit&&Math.abs(x-h.x)<20&&y>h.y-34&&y<h.y+6){h.hit=1;h.t=Math.min(h.t,260);score+=h.gold?3:1;Sfx.hit();pop(h.x,h.y-14,h.gold?'#ffcd75':'#73eff7');break}}},
      update(dt){spawn-=dt;if(spawn<=0){spawn=420+R(380);const free=holes.filter(h=>h.t<=0&&h.up===0);if(free.length){const h=pick(free);h.t=850+R(550);h.kind=pick(['slime','mush','ghost','bat']);h.gold=Math.random()<.13;h.hit=0}}
        holes.forEach(h=>{if(h.t>0){h.t-=dt;h.up=Math.min(1,h.up+dt/110)}else h.up=Math.max(0,h.up-dt/110)})},
      draw(t){band(['#41a6f6','#73eff7']);grass(28);
        holes.forEach(h=>{c.fillStyle='#1a1c2c';c.beginPath();c.ellipse(h.x,h.y,19,6,0,0,7);c.fill();
          if(h.up>0){c.save();c.beginPath();c.rect(h.x-22,h.y-44,44,44);c.clip();const yy=h.y-30*h.up+(h.hit?6:0);
            drawSprite(c,h.kind,EPAL[h.kind],h.x-16,yy-4,2,false);c.restore();
            if(h.gold&&h.up>.6){c.fillStyle='#ffcd75';c.fillRect(h.x-6,yy-8,12,4);c.fillRect(h.x-6,yy-11,2,3);c.fillRect(h.x-1,yy-12,2,4);c.fillRect(h.x+4,yy-11,2,3)}
            if(h.hit){for(let i=0;i<3;i++){const a=t/120+i*2.1;star(h.x+Math.cos(a)*12,yy-6+Math.sin(a)*3,'#ffcd75')}}}
          c.fillStyle='#257179';c.fillRect(h.x-20,h.y,40,3)})}}}

  function balloons(){let bs=[],spawn=0;const cols=['#e43b44','#2f6fe0','#ffe14d','#3cb043','#f78a1d','#9b5fe0','#ff8fc8'];
    return{name:'BALLOON POP',how:'Pop the balloons before they float away!',timed:12500,
      down(x,y){for(let i=bs.length-1;i>=0;i--){const b=bs[i];if(Math.hypot(x-b.x,y-b.y)<15){bs.splice(i,1);score++;tone({type:'triangle',f1:900,f2:200,dur:.12,vol:.12});noise({dur:.08,vol:.15,lp:5000});pop(b.x,b.y,b.c,14);break}}},
      update(dt){spawn-=dt;if(spawn<=0){spawn=420+R(380);bs.push({x:18+R(W-36),y:H+18,v:26+R(32),c:pick(cols),w:Math.random()*6})}
        bs.forEach(b=>{b.y-=b.v*dt/1000;b.x+=Math.sin((b.y+b.w*30)/18)*.35});bs=bs.filter(b=>b.y>-30)},
      draw(t){band(['#41a6f6','#55b6f8','#73eff7','#9ff4f9']);for(let i=0;i<4;i++){const x=((i*70+t*.01)%(W+40))-20,y=20+i*28;c.fillStyle='#f4f4f4';c.fillRect(x,y,24,5);c.fillRect(x+4,y-4,14,4)}
        bs.forEach(b=>{c.strokeStyle='#f4f4f4';c.lineWidth=1;c.beginPath();c.moveTo(b.x,b.y+13);c.lineTo(b.x+Math.sin(b.y/9)*3,b.y+28);c.stroke();
          c.fillStyle=b.c;c.beginPath();c.ellipse(b.x,b.y,11,13,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.55)';c.fillRect(Math.round(b.x-6),Math.round(b.y-8),3,5);c.fillStyle=b.c;c.fillRect(Math.round(b.x-2),Math.round(b.y+12),4,3)})}}}

  function runner(st,f){let y=0,vy=0,obs=[],coins=[],spd=85,spawn=1300,cspawn=700,bump=0,dist=0;const GY=150,BX=42;
    const jump=()=>{if(y===0){vy=-255;tone({f1:500,f2:950,dur:.12,vol:.06})}};
    return{name:'BEAST RUN',how:'Tap (or press Space) to jump over the rocks and grab the coins!',timed:15000,down:jump,key(k){if(k===' '||k==='ArrowUp')jump()},
      update(dt){const s=dt/1000;spd+=s*2.5;dist+=spd*s;vy+=720*s;y+=vy*s;if(y>0){y=0;vy=0}
        spawn-=dt;if(spawn<=0){spawn=1000+R(1000);obs.push({x:W+10,big:Math.random()<.3})}cspawn-=dt;if(cspawn<=0){cspawn=550+R(700);coins.push({x:W+10,y:GY-22-R(46)})}
        obs.forEach(o=>o.x-=spd*s);coins.forEach(o=>o.x-=spd*s);const feet=GY+y;
        obs=obs.filter(o=>{const hh=o.big?18:10;if(!o.hit&&Math.abs(o.x-BX)<12&&feet>GY-hh+2){o.hit=1;bump=500;Sfx.hit();pop(BX,GY-10,'#8b9bb4')}else if(!o.done&&o.x<BX-14){o.done=1;if(!o.hit){score++;tone({f1:1200,dur:.06,vol:.05})}}return o.x>-20});
        coins=coins.filter(o=>{if(Math.abs(o.x-BX)<12&&Math.abs(o.y-(feet-14))<16){score+=2;Sfx.twinkle();pop(o.x,o.y,'#ffcd75');return false}return o.x>-10});bump-=dt},
      draw(t){band(['#29366f','#5d275d','#b13e53','#ef7d57','#ffcd75']);
        for(let x=0;x<W;x++){const X=x+dist*.25;const h=22+Math.round(9*Math.sin(X*.04)+5*Math.sin(X*.11));c.fillStyle='#333c87';c.fillRect(x,GY-h,1,h)}
        grass(GY,'#a7f070','#8fd860',dist);obs.forEach(o=>rock(o.x,GY-(o.big?9:5),o.big?1.6:1));coins.forEach(o=>coin(o.x,o.y,t));
        beastAt(st,f,BX,GY+y+(y===0?Math.floor(t/110)%2:0),2,bump>0&&Math.floor(t/80)%2)}}}

  function memory(){const em=shuffle(['🦖','🐱','🍎','⭐','🚗','🐟','🌈','🍩','🦄','🍕']).slice(0,3);
    const cards=shuffle([...em,...em]).map((e,i)=>({e,up:0,done:0,x:38+(i%3)*60,y:38+Math.floor(i/3)*60}));let open=[],lock=0,matched=0;
    return{name:'MEMORY MATCH',how:'Flip two cards at a time. Find all 3 matching pairs!',timed:0,
      down(x,y){if(lock>0||open.length>=2)return;const cd=cards.find(k=>x>k.x&&x<k.x+44&&y>k.y&&y<k.y+44);if(!cd||cd.up||cd.done)return;
        cd.up=1;tone({f1:700,dur:.05,vol:.05});open.push(cd);
        if(open.length===2){if(open[0].e===open[1].e){open.forEach(k=>{k.done=1;pop(k.x+22,k.y+22,'#ffcd75')});matched++;score=matched;Sfx.crit();open=[];if(matched===3)setTimeout(end,700)}else lock=850}},
      update(dt){if(lock>0){lock-=dt;if(lock<=0){open.forEach(k=>k.up=0);open=[];tone({f1:300,dur:.05,vol:.04})}}},
      draw(t){band(['#5d275d','#7a3e9d','#5d275d']);
        cards.forEach(k=>{c.fillStyle='#1a1c2c';c.fillRect(k.x-2,k.y-2,48,48);
          if(k.up||k.done){c.fillStyle=k.done?'#a7f070':'#f4f4f4';c.fillRect(k.x,k.y,44,44);c.font='28px system-ui,"Apple Color Emoji","Segoe UI Emoji",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(k.e,k.x+22,k.y+24)}
          else{c.fillStyle='#3b5dc9';c.fillRect(k.x,k.y,44,44);c.fillStyle='#333c87';for(let i=0;i<44;i+=8)c.fillRect(k.x+i,k.y,4,44);c.fillStyle='#ffcd75';c.font='16px "Press Start 2P",monospace';c.textAlign='center';c.textBaseline='middle';c.fillText('?',k.x+23,k.y+24)}})}}}

  function flappy(st,f){let y=80,vy=0,pipes=[],spawn=500,coins=[],bump=0;const X=56,GAP=34;
    const flap=()=>{vy=-165;tone({f1:600,f2:900,dur:.08,vol:.05})};
    return{name:'SKY FLAP',how:'Tap (or press Space) to flap! Fly through the gaps and grab the stars.',timed:15000,down:flap,key(k){if(k===' '||k==='ArrowUp')flap()},
      update(dt){const s=dt/1000;vy+=430*s;y+=vy*s;if(y<18){y=18;vy=0}if(y>158){y=158;vy=0}
        spawn-=dt;if(spawn<=0){spawn=1400;const gy=50+R(80);pipes.push({x:W+12,gy});coins.push({x:W+12,y:gy})}
        pipes.forEach(p=>p.x-=72*s);coins.forEach(k=>k.x-=72*s);
        pipes=pipes.filter(p=>{if(!p.hit&&Math.abs(p.x-X)<14&&Math.abs(y-p.gy)>GAP-8){p.hit=1;bump=450;Sfx.hit();pop(X,y,'#c0cbdc')}
          if(!p.done&&p.x<X-14){p.done=1;if(!p.hit){score++;tone({f1:1200,dur:.06,vol:.05})}}return p.x>-20});
        coins=coins.filter(k=>{if(Math.abs(k.x-X)<12&&Math.abs(k.y-y)<14){score+=2;Sfx.twinkle();pop(k.x,k.y,'#ffcd75');return false}return k.x>-10});bump-=dt},
      draw(t){band(['#41a6f6','#55b6f8','#73eff7','#9ff4f9']);for(let i=0;i<4;i++){const x=((i*70-t*.02)%(W+40)+W+40)%(W+40)-20;c.fillStyle='#f4f4f4';c.fillRect(x,18+i*30,22,5);c.fillRect(x+4,14+i*30,12,4)}
        pipes.forEach(p=>{c.fillStyle='#38b764';c.fillRect(Math.round(p.x-10),0,20,p.gy-GAP);c.fillRect(Math.round(p.x-10),p.gy+GAP,20,H);c.fillStyle='#257179';c.fillRect(Math.round(p.x-12),p.gy-GAP-6,24,6);c.fillRect(Math.round(p.x-12),p.gy+GAP,24,6)});
        coins.forEach(k=>star(k.x,k.y,'#ffcd75'));beastAt(st,f,X,y+15,2,bump>0&&Math.floor(t/80)%2)}}}

  function stack(){const BH=12,cols=['#e43b44','#f78a1d','#ffe14d','#3cb043','#2f6fe0','#9b5fe0'];let blocks=[{x:70,w:100}],cur={x:0,w:100,dir:1},speed=90,cam=0;
    const levelY=i=>H-14-BH*(i+1)+cam;
    const place=()=>{const top=blocks[blocks.length-1],l=Math.max(cur.x,top.x),r=Math.min(cur.x+cur.w,top.x+top.w);
      if(r-l<=3){Sfx.hit();pop(cur.x+cur.w/2,levelY(blocks.length),'#c0cbdc',16);blocks=[{x:70,w:100}];cur={x:0,w:100,dir:1};speed=90;return}
      const perfect=Math.abs(cur.x-top.x)<3,nb=perfect?{x:top.x,w:top.w}:{x:l,w:r-l};blocks.push(nb);score++;
      if(perfect){Sfx.crit();pop(nb.x+nb.w/2,levelY(blocks.length-1),'#ffcd75',12)}else tone({f1:330+blocks.length*35,dur:.1,vol:.08});
      cur={x:cur.dir>0?W-nb.w:0,w:nb.w,dir:-cur.dir};speed=Math.min(175,speed+8)};
    return{name:'TOWER STACK',how:'Tap to drop the swinging block. Stack them as high as you can! Line them up perfectly for a sparkle.',timed:15000,down:place,key(k){if(k===' ')place()},
      update(dt){cur.x+=cur.dir*speed*dt/1000;if(cur.x<0){cur.x=0;cur.dir=1}if(cur.x+cur.w>W){cur.x=W-cur.w;cur.dir=-1}
        const want=Math.max(0,(blocks.length-8)*BH);cam+=(want-cam)*Math.min(1,dt/200)},
      draw(t){band(['#5d275d','#b13e53','#ef7d57','#ffcd75']);c.fillStyle='#38b764';c.fillRect(0,H-14+cam,W,40);c.fillStyle='#a7f070';c.fillRect(0,H-14+cam,W,2);
        blocks.forEach((b2,i)=>{const y=Math.round(levelY(i));if(y>H)return;c.fillStyle=cols[i%6];c.fillRect(Math.round(b2.x),y,Math.round(b2.w),BH-1);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(Math.round(b2.x),y,Math.round(b2.w),2)});
        const y=Math.round(levelY(blocks.length));c.fillStyle=cols[blocks.length%6];c.fillRect(Math.round(cur.x),y,Math.round(cur.w),BH-1);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(Math.round(cur.x),y,Math.round(cur.w),2)}}}

  function simon(){const pads=[{x:30,y:24,c:'#e43b44',f:330},{x:124,y:24,c:'#2f6fe0',f:440},{x:30,y:96,c:'#3cb043',f:523},{x:124,y:96,c:'#ffe14d',f:659}];
    let seq=[R(4)],show=0,wait=700,inp=0,lit=-1,litT=0,phase='wait',el=0;const goal=4;
    const light=i=>{lit=i;litT=320;tone({type:'square',f1:pads[i].f,dur:.25,vol:.08})};
    return{name:'LIGHT PADS',how:'Watch the pads light up, then tap them in the same order! Get to 4 in a row.',timed:0,
      down(x,y){if(phase!=='input')return;const i=pads.findIndex(p=>x>p.x&&x<p.x+86&&y>p.y&&y<p.y+62);if(i<0)return;light(i);
        if(i===seq[inp]){inp++;if(inp===seq.length){score=seq.length;phase='wait';wait=900;pop(W/2,H/2,'#ffcd75',12);if(seq.length>=goal){phase='over';setTimeout(end,700)}else seq.push(R(4))}}
        else{Sfx.wrong();phase='wait';wait=1000;inp=0}},
      update(dt){litT-=dt;if(litT<=0)lit=-1;if(phase!=='over'){el+=dt;if(el>20000){phase='over';end();return}}
        if(phase==='wait'){wait-=dt;if(wait<=0){phase='show';show=0;wait=350}}
        else if(phase==='show'){wait-=dt;if(wait<=0){if(show<seq.length){light(seq[show]);show++;wait=Math.max(380,650-seq.length*40)}else{phase='input';inp=0}}}},
      draw(t){band(['#1a1c2c','#262b44']);pads.forEach((p,i)=>{c.fillStyle='#000';c.fillRect(p.x-3,p.y-3,92,68);c.globalAlpha=lit===i?1:.32;c.fillStyle=p.c;c.fillRect(p.x,p.y,86,62);c.globalAlpha=1;
          if(lit===i){c.fillStyle='rgba(255,255,255,.55)';c.fillRect(p.x+4,p.y+4,78,8)}});
        c.fillStyle=phase==='input'?'#a7f070':'#f4f4f4';c.font='8px "Press Start 2P",monospace';c.textAlign='center';c.textBaseline='middle';c.fillText(phase==='input'?'YOUR TURN!':phase==='over'?'YOU DID IT!':'WATCH…',W/2,H-8)}}}

  function fishing(){const SURF=46;let boat=W/2,dir=1,hook=null,fish=[],spawn=0,caught=null;
    const cast=()=>{if(!hook){hook={x:boat,y:SURF,state:'down'};tone({f1:300,f2:150,dur:.15,vol:.06})}};
    const fishPx=(x,y,d,gold)=>{x=Math.round(x);y=Math.round(y);c.fillStyle=gold?'#ffcd75':'#ef7d57';c.fillRect(x-6,y-3,12,6);c.fillRect(x-4,y-4,8,8);
      c.fillRect(d>0?x-10:x+6,y-4,4,8);c.fillStyle='#1a1c2c';c.fillRect(d>0?x+3:x-4,y-2,2,2)};
    return{name:'GONE FISHING',how:'Tap (or press Space) to drop your hook and catch fish! Gold fish are worth 3.',timed:15000,down:cast,key(k){if(k===' ')cast()},
      update(dt){const s=dt/1000;if(!hook){boat+=dir*55*s;if(boat<26){boat=26;dir=1}if(boat>W-26){boat=W-26;dir=-1}}
        spawn-=dt;if(spawn<=0&&fish.length<7){spawn=450+R(450);const l=Math.random()<.5;fish.push({x:l?-12:W+12,y:SURF+22+R(H-SURF-36),v:(l?1:-1)*(22+R(30)),gold:Math.random()<.15})}
        fish.forEach(fh=>fh.x+=fh.v*s);fish=fish.filter(fh=>fh.x>-20&&fh.x<W+20&&!fh.got);
        if(hook){if(hook.state==='down'){hook.y+=160*s;const hit=fish.find(fh=>Math.abs(fh.x-hook.x)<10&&Math.abs(fh.y-hook.y)<7);
            if(hit){hit.got=1;caught=hit;hook.state='up';score+=hit.gold?3:1;Sfx.twinkle()}else if(hook.y>H-8)hook.state='up'}
          else{hook.y-=200*s;if(hook.y<=SURF){if(caught){pop(hook.x,SURF-4,caught.gold?'#ffcd75':'#73eff7',14);caught=null}hook=null}}}},
      draw(t){c.fillStyle='#9ff4f9';c.fillRect(0,0,W,SURF);c.fillStyle='#ffcd75';c.fillRect(W-30,8,12,12);
        c.fillStyle='#2f6fe0';c.fillRect(0,SURF,W,H-SURF);c.fillStyle='#3b5dc9';for(let y=SURF+10;y<H;y+=16)for(let x=((t/30)|0)%20-20;x<W;x+=20)c.fillRect(x,y,8,2);
        c.fillStyle='#d9a066';c.fillRect(0,H-6,W,6);c.fillStyle='#38b764';for(let x=8;x<W;x+=34){c.fillRect(x,H-18+Math.round(Math.sin(t/400+x)*2),2,12)}
        fish.forEach(fh=>fishPx(fh.x,fh.y,fh.v,fh.gold));
        const bx=Math.round(hook?hook.x:boat);c.fillStyle='#8b5a2b';c.fillRect(bx-16,SURF-6,32,6);c.fillRect(bx-12,SURF,24,3);c.fillStyle='#f4f4f4';c.fillRect(bx-2,SURF-20,2,14);c.fillStyle='#e43b44';c.fillRect(bx,SURF-20,8,6);
        if(hook){c.fillStyle='#f4f4f4';c.fillRect(bx,SURF,1,Math.round(hook.y-SURF));c.fillStyle='#c0cbdc';c.fillRect(bx-2,Math.round(hook.y),4,3);if(caught)fishPx(bx,hook.y+6,1,caught.gold)}}}}

  function cups(){const pos=[50,120,190],CY=118;let slot=[0,1,2],ball=0,phase='show',pt=0,swapsLeft=0,cur=null,round=0,picked=-1,spd=360;
    const cx=k=>{if(cur&&(k===cur.a||k===cur.b)){const u=Math.min(1,cur.t/spd),from=pos[slot[k]],to=pos[slot[k===cur.a?cur.b:cur.a]];return from+(to-from)*u}return pos[slot[k]]};
    const cy=k=>{if(cur&&(k===cur.a||k===cur.b)){const u=Math.min(1,cur.t/spd);return CY+(k===cur.a?-1:1)*Math.sin(u*Math.PI)*12}return CY};
    const startRound=()=>{phase='show';pt=1100;ball=R(3);picked=-1;swapsLeft=4+round*2;spd=Math.max(170,360-round*90);cur=null};startRound();
    const cup=(x,y,lift)=>{x=Math.round(x);y=Math.round(y-lift);c.fillStyle='#1a1c2c';c.fillRect(x-17,y-31,34,32);c.fillStyle='#e43b44';c.fillRect(x-15,y-29,30,28);c.fillStyle='#f4f4f4';c.fillRect(x-15,y-20,30,4);c.fillStyle='#b13e53';c.fillRect(x-11,y-33,22,4)};
    return{name:'CUP SWAP',how:'Watch which cup the slime hides under… then tap that cup! 3 rounds.',timed:0,
      down(x,y){if(phase!=='pick')return;const k=[0,1,2].find(k=>Math.abs(x-cx(k))<22&&y>CY-40&&y<CY+6);if(k==null)return;picked=k;phase='reveal';pt=1200;
        if(k===ball){score++;Sfx.crit();pop(cx(k),CY-12,'#ffcd75',16)}else Sfx.wrong()},
      update(dt){pt-=dt;
        if(phase==='show'&&pt<=0)phase='shuffle';
        else if(phase==='shuffle'){if(!cur){if(swapsLeft<=0){phase='pick';return}const a=R(3);cur={a,b:(a+1+R(2))%3,t:0};tone({f1:200+R(120),dur:.05,vol:.04})}
          else{cur.t+=dt;if(cur.t>=spd){const s0=slot[cur.a];slot[cur.a]=slot[cur.b];slot[cur.b]=s0;cur=null;swapsLeft--}}}
        else if(phase==='reveal'&&pt<=0){round++;if(round>=3){phase='over';end()}else startRound()}},
      draw(t){band(['#257179','#2f9e57']);c.fillStyle='#8b5a2b';c.fillRect(10,CY,W-20,10);c.fillStyle='#5d4037';c.fillRect(10,CY+10,W-20,4);
        const showBall=phase==='show'||phase==='reveal';
        if(showBall)drawSprite(c,'slime',EPAL.slime,cx(ball)-8,CY-14,1,false);
        [0,1,2].forEach(k=>cup(cx(k),cy(k),showBall&&(phase==='show'?k===ball:(k===picked||k===ball))?20:0));
        c.fillStyle='#f4f4f4';c.font='8px "Press Start 2P",monospace';c.textAlign='center';c.textBaseline='middle';
        c.fillText(phase==='pick'?'WHERE IS THE SLIME?':phase==='show'?'WATCH THE SLIME!':phase==='shuffle'?'SHUFFLING…':'ROUND '+Math.min(round+1,3)+' / 3',W/2,26)}}}

  const GAMES=[catchGame,whack,balloons,runner,memory,flappy,stack,simon,fishing,cups];
  function hud(){c.fillStyle='rgba(0,0,0,.55)';c.fillRect(0,0,W,15);c.fillStyle='#ffcd75';c.font='8px "Press Start 2P",monospace';c.textAlign='left';c.textBaseline='middle';
    c.fillText((g.name==='MEMORY MATCH'?'PAIRS ':'★ ')+score,5,8);
    if(g.timed){const f=Math.max(0,tLeft/g.timed);c.fillStyle='#1a1c2c';c.fillRect(W-86,4,82,7);c.fillStyle=f<.25?'#b13e53':'#73eff7';c.fillRect(W-85,5,Math.round(80*f),5)}}
  function banner(){c.fillStyle='rgba(10,10,20,.75)';c.fillRect(0,0,W,H);c.textAlign='center';c.textBaseline='middle';c.fillStyle='#ffcd75';c.font='14px "Press Start 2P",monospace';c.fillText('GREAT JOB!',W/2,H/2-16);
    c.fillStyle='#f4f4f4';c.font='9px "Press Start 2P",monospace';c.fillText(g.name==='MEMORY MATCH'?'ALL PAIRS FOUND!':'SCORE: '+score,W/2,H/2+10);c.fillStyle='#ffcd75';c.fillText('+'+earned+' STARS ★',W/2,H/2+28)}
  function loop(t){raf=requestAnimationFrame(loop);const dt=Math.min(50,Math.max(0,t-(last||t)));last=t;
    try{if(state==='run'){g.update(dt);if(g.timed){tLeft-=dt;if(tLeft<=0)end()}}
      g.draw(t);for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.06;p.l--;c.fillStyle=p.col;c.fillRect(Math.round(p.x),Math.round(p.y),2,2);if(p.l<=0)parts.splice(i,1)}
      hud();if(state==='done')banner()}catch(e){console.error(e)}}
  function end(){if(state!=='run')return;state='done';earned=Math.min(5,2+Math.floor(score/4));if(miniKid)addStars(miniKid,earned);Music.stop();Sfx.win();$('#miniGo').textContent='CONTINUE ▶';$('#miniGo').hidden=false;$('#miniSkip').hidden=true;setTimeout(()=>$('#miniGo').focus(),50)}
  function close(){cancelAnimationFrame(raf);raf=0;state='idle';Music.stop();keys={};o.hidden=true;const r=resolve;resolve=null;if(r)r()}
  const pt=ev=>{const r=cv.getBoundingClientRect();return[(ev.clientX-r.left)/r.width*W,(ev.clientY-r.top)/r.height*H]};
  cv.addEventListener('pointerdown',ev=>{ev.preventDefault();if(state!=='run')return;const [x,y]=pt(ev);g.down&&g.down(x,y)});
  cv.addEventListener('pointermove',ev=>{if(state!=='run'||!g.move)return;if(ev.pointerType==='mouse'||ev.buttons){const [x,y]=pt(ev);g.move(x,y)}});
  document.addEventListener('keydown',ev=>{if(o.hidden||state!=='run')return;if(['ArrowLeft','ArrowRight','ArrowUp',' '].includes(ev.key)){ev.preventDefault();keys[ev.key]=true;g.key&&g.key(ev.key)}});
  document.addEventListener('keyup',ev=>{keys[ev.key]=false});
  $('#miniGo').onclick=()=>{if(state==='ready'){ac();Sfx.tap();state='run';tLeft=g.timed;$('#miniGo').hidden=true;if(musicOn&&soundOn)Music.start('bounce')}else if(state==='done')close()};
  $('#miniSkip').onclick=()=>{Sfx.tap();close()};
  return{play(kid){return new Promise(res=>{resolve=res;miniKid=kid;miniEq=equipOf(kid);earned=0;const st=beastOf(kid),f=formOf(Save.kid(kid).xp);let i;do{i=R(GAMES.length)}while(i===lastIdx&&GAMES.length>1);lastIdx=i;
      g=GAMES[i](st,f);score=0;parts=[];tLeft=g.timed;state='ready';last=0;
      $('#mTitle').textContent='MINI GAME: '+g.name;$('#mHow').textContent=g.how;$('#miniGo').textContent='START!';$('#miniGo').hidden=false;$('#miniSkip').hidden=false;
      o.hidden=false;setTimeout(()=>$('#miniGo').focus(),50);if(KIDS[kid].autoSay)Speech.say(g.how.replace(/[←→]/g,''));
      if(!raf)raf=requestAnimationFrame(loop)})},
    _test:{get state(){return state},get score(){return score},end,get game(){return g&&g.name},tap:(x,y)=>g.down&&g.down(x,y)}}
})();

