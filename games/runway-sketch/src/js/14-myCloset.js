function myCloset(){const s=cScreen(cHead()+'<h2>👗 '+ZT('My Closet')+'</h2>'+ORDER.map(c=>'<h3>'+CATEN[c]+' '+C.own[c].length+'</h3><div class="items shopitems">'+(C.own[c].length?C.own[c].map(id=>{const it=find(c,id);return it?'<div class="it">'+thumb(c,it)+'<span class="en">'+it.en+'</span></div>':'';}).join(''):'<p class="note">'+ZT('Nothing here yet. Go shopping!')+'</p>')+'</div>').join('')+
  '<div class="row"><button class="btn ghost" id="cBack">🏙️ '+ZT('Back to town')+'</button></div>');fitThumbs();s.querySelector('#cBack').onclick=careerHub;}
/* part-time jobs: three mini games */
function workMenu(){const s=cScreen(cHead()+'<h2>💼 '+ZT('Part-time Jobs')+'</h2><div class="cgrid">'+
    [['cash','☕','Café Barista','Make drinks, give change'],['sew','🧵','Sewing Studio','Sew buttons and seams'],['sort','📦','Stockroom Sorting','Put clothes in the right bins']].map(([k,e,t,d])=>'<button class="mode" data-k="'+k+'"><span class="e">'+e+'</span><b>'+ZT(t)+'</b><span>'+ZT(d)+'</span></button>').join('')+
    '</div><div class="row"><button class="btn ghost" id="cBack">🏙️ '+ZT('Back to town')+'</button></div>');
  s.querySelector('#cBack').onclick=careerHub;s.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{audio();startJob(b.dataset.k);});}
function payday(earn,title){C.money+=earn;cSave();sfx.win();confetti();
  const s=cScreen(cHead()+'<h2>'+title+'</h2><div class="cres">💰 +'+earn+'</div><div class="row"><button class="btn pink" id="again2">'+ZT('Work again')+'</button><button class="btn ghost" id="cBack">🏙️ '+ZT('Back to town')+'</button></div>');
  return s;}
/* ---------- part-time jobs v3: arcade-style ---------- */
function popFx(host,x,y,txt,col){const d=document.createElement('div');d.className='fxpop';d.textContent=txt;d.style.left=x+'px';d.style.top=y+'px';d.style.color=col||'#2b8a3e';host.appendChild(d);setTimeout(()=>d.remove(),900);}
function hud(){return '<div class="jhud"><span id="hT">⏱ 60</span><span id="hM">💰 0</span><span id="hC">🔥 x1</span></div>';}
/* ☕ Café rush: customers queue with patience bars; make their drink fast, then give change */
function cafeRush(){const DR=[['tea','Milk tea','#d9a066',4],['coffee','Coffee','#6f4e37',3],['berry','Strawberry','#f783ac',5],['matcha','Matcha','#8ce99a',6],['taro','Taro','#b197fc',5],['mango','Mango','#ffa94d',4]],SZ=[['S',0],['M',1],['L',2]],TP=[['pearl','Pearls','#4a2c1a',1],['jelly','Jelly','#ffd43b',1],['pop','Popping boba','#ff8787',2],['pudding','Pudding','#ffe066',2],['cream','Cream','#fff',2]];
  let T=100,earn=0,combo=0,served=0,sel=null,mine={drink:null,size:'M',tops:{}},paying=null,cid=0,rush=0;const Q=[null,null];
  const cup=(o,h0)=>{const h={S:70,M:90,L:110}[o.size]||90,col=(DR.find(d=>d[0]===o.drink)||[,,'#e9ecef'])[2],top=150-h;let t='',k=0;
    TP.forEach(([id,,c])=>{for(let i=0;i<(o.tops[id]||0);i++){if(id==='cream'){t+='<ellipse cx="100" cy="'+(top+2)+'" rx="30" ry="9" fill="#fff" stroke="#4a3426" stroke-width="2"/>';continue;}t+=id==='pudding'?'<rect x="'+(66+((k*23)%56))+'" y="'+(132-Math.floor(k/3)*12)+'" width="13" height="11" rx="3" fill="'+c+'" stroke="#4a3426" stroke-width="1.5"/>':'<circle cx="'+(72+((k*23)%56))+'" cy="'+(140-Math.floor(k/3)*12)+'" r="'+(id==='pop'?8:7)+'" fill="'+c+'" stroke="#4a3426" stroke-width="1.5"/>';k++;}});
    return '<svg viewBox="40 '+(top-40)+' 120 '+(h+60)+'" style="height:'+(h0||100)+'px"><path d="M110 '+(top-30)+'L104 '+top+'" stroke="#e8505b" stroke-width="6" stroke-linecap="round"/><path d="M62 '+top+'L138 '+top+'L130 150L70 150Z" fill="'+(o.drink?col:'#f1f3f5')+'" stroke="#4a3426" stroke-width="3" stroke-linejoin="round"/>'+t+'<path d="M58 '+top+'H142" stroke="#4a3426" stroke-width="4" stroke-linecap="round"/></svg>';};
  const unit=o=>DR.find(d=>d[0]===o.drink)[3]+SZ.find(z=>z[0]===o.size)[1]+Object.entries(o.tops).reduce((a,[id,n])=>a+n*TP.find(t=>t[0]===id)[3],0);
  const newCust=()=>{const o={drink:pick(DR)[0],size:pick(SZ)[0],tops:{}};const nt=Math.random()<.25?0:Math.random()<.6?1:2;TP.slice().sort(()=>Math.random()-.5).slice(0,nt).forEach(([id])=>o.tops[id]=id==='cream'?1:1+Math.floor(Math.random()*2));
    const qty=served>=2&&Math.random()<.3?2:served>=6&&Math.random()<.15?3:1,vip=Math.random()<.12,pat=Math.max(26,40-served*.6)*(qty>1?1.3:1);return {id:++cid,o,qty,vip,face:Math.floor(Math.random()*24),p:pat,max:pat};};
  const s=cScreen('<h2>🧋 Boba Shop</h2>'+hud()+'<div class="rushb" id="rb"></div><div class="counter" id="ctr"></div><div class="station" id="st"></div>');
  const host=s.querySelector('.cin');
  const tname=id=>TP.find(t=>t[0]===id)[1].toLowerCase();
  const drawQ=()=>{s.querySelector('#ctr').innerHTML=Q.map((c,i)=>c?'<button class="cust2'+(sel===i?' on':'')+(c.vip?' vip':'')+'" data-i="'+i+'">'+(c.vip?'<span class="vipt">⭐ VIP</span>':'')+(c.qty>1?'<span class="qty">×'+c.qty+'</span>':'')+'<div class="face">'+fan(c.face)+'</div><div class="tk">'+cup(c.o,58)+'<small>'+c.o.size+' '+DR.find(d=>d[0]===c.o.drink)[1]+(Object.entries(c.o.tops).map(([k,n])=>'<br>+'+n+' '+tname(k)).join(''))+'</small></div><div class="pat"><i id="pb'+i+'"></i></div></button>':'<div class="cust2 empty">…</div>').join('');
    s.querySelectorAll('.cust2[data-i]').forEach(b=>b.onclick=()=>{if(paying)return;sel=+b.dataset.i;tone(800,.04,'triangle',.06);drawQ();});};
  const drawSt=()=>{const st=s.querySelector('#st');if(paying){const P=paying;
      st.innerHTML='<div class="rcpt"><div>'+P.qty+' × '+P.name+' <span>$'+P.unit+' each</span></div><div>Subtotal <span>$'+P.sub+'</span></div><div>Tax 10% <span>$'+P.tax+'</span></div><div class="tot">Total <span>$'+P.total+'</span></div></div>'+
        '<div class="says">💬 “Here’s <b>$'+P.pay+'</b>.'+(P.tip?' Keep <b>$'+P.tip+'</b> as a tip!”':'”')+'</div><div class="chg">Change to give back: $<b id="got">'+P.got+'</b></div><div class="coins">'+[1,5,10,20].map(v=>'<button class="coin c'+v+'" data-v="'+v+'">'+v+'</button>').join('')+'</div><div class="row"><button class="btn ghost" id="clr">Reset</button><button class="btn pink" id="give">Give ✓</button></div>';
      st.querySelectorAll('.coin').forEach(b=>b.onclick=()=>{paying.got+=+b.dataset.v;tone(1400+(+b.dataset.v)*8,.05,'square',.05);st.querySelector('#got').textContent=paying.got;});
      st.querySelector('#clr').onclick=()=>{paying.got=0;st.querySelector('#got').textContent=0;};
      st.querySelector('#give').onclick=()=>{const ans=P.pay-P.total-P.tip,ok=P.got===ans;if(ok){const gain=2+P.tip+(combo>=3?1:0);earn+=gain;combo++;sfx.good();popFx(host,host.clientWidth/2,200,'+$'+gain+(P.tip?' (tip $'+P.tip+')':''));if(combo>=3)popFx(host,host.clientWidth/2,160,'🔥 Combo x'+combo,'#e8590c');}
        else{combo=0;sfx.boing();toast('❌ $'+P.pay+' − $'+P.total+(P.tip?' − $'+P.tip+' tip':'')+' = $'+ans,3200);}
        paying=null;mine={drink:null,size:'M',tops:{}};served++;upd();drawSt();drawQ();};return;}
    st.innerHTML='<div class="mk2"><div class="cupbox">'+cup(mine,150)+'</div><div class="bctl"><div class="bb">'+SZ.map(([z])=>'<button class="chip'+(mine.size===z?' on':'')+'" data-z="'+z+'">'+z+'</button>').join('')+'</div><div class="bb">'+DR.map(([id,n,c])=>'<button class="chip'+(mine.drink===id?' on':'')+'" data-d="'+id+'"><i class="sw2" style="background:'+c+'"></i>'+n+'</button>').join('')+'</div><div class="bb">'+TP.map(([id,n,c])=>'<button class="chip" data-t="'+id+'"><i class="sw2" style="background:'+c+'"></i>'+n+' ×'+(mine.tops[id]||0)+'</button>').join('')+'</div></div></div><div class="row"><button class="btn ghost" id="dump">🗑</button><button class="btn pink" id="serve">Serve ✓</button></div>';
    st.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{mine.size=b.dataset.z;tone(700,.04,'triangle',.06);drawSt();});
    st.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{mine.drink=b.dataset.d;tone(500,.12,'sine',.08);drawSt();});
    st.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const id=b.dataset.t;mine.tops[id]=((mine.tops[id]||0)+1)%(id==='cream'?2:4);tone(1100,.04,'square',.04);drawSt();});
    st.querySelector('#dump').onclick=()=>{mine={drink:null,size:'M',tops:{}};drawSt();};
    st.querySelector('#serve').onclick=()=>{if(sel===null||!Q[sel]){toast('👆 Tap a customer first');return;}const c=Q[sel];
      const ok=mine.drink===c.o.drink&&mine.size===c.o.size&&TP.every(([id])=>(mine.tops[id]||0)===(c.o.tops[id]||0));
      if(!ok){sfx.boing();combo=0;upd();toast('❌ Not what they ordered!',1400);return;}
      const u=unit(c.o),sub=u*c.qty,tax=Math.round(sub*.1),total=sub+tax,frac=c.p/c.max,tip=Math.max(0,Math.ceil(frac*4)-1)*(c.vip?2:1),need=total+tip,pay=[10,20,50,100].find(b=>b>=need+1)||100;
      paying={name:c.o.size+' '+DR.find(d=>d[0]===c.o.drink)[1],qty:c.qty,unit:u,sub,tax,total,tip,pay,got:0};Q[sel]=null;sel=null;sfx.good();drawQ();drawSt();};};
  const upd=()=>{TX(s.querySelector('#hT'),'⏱ '+Math.ceil(T));TX(s.querySelector('#hM'),'💰 '+earn);TX(s.querySelector('#hC'),'🔥 x'+Math.max(1,combo));};
  let spawnIn=0;
  lp(s,'#ctr',dt=>{T-=dt;spawnIn-=dt;if(rush>0){rush-=dt;if(rush<=0)s.querySelector('#rb').innerHTML='';}
    if(!rush&&served>=4&&Math.random()<dt/40){rush=10;s.querySelector('#rb').innerHTML='🚨 RUSH HOUR! Customers are lining up!';tone(1200,.1,'square',.06);}
    for(let i=0;i<Q.length;i++){const c=Q[i];if(!c)continue;if(!paying)c.p-=dt;const b=s.querySelector('#pb'+i);if(b){b.style.width=Math.max(0,c.p/c.max*100)+'%';b.style.background=c.p/c.max<.3?'#fa5252':c.p/c.max<.6?'#fab005':'#40c057';}
      if(c.p<=0){Q[i]=null;if(sel===i)sel=null;combo=0;tone(200,.3,'sawtooth',.06);toast('😤 A customer left!',1200);drawQ();}}
    if(spawnIn<=0){const i=Q.indexOf(null);if(i>=0){Q[i]=newCust();drawQ();tone(Q[i].vip?1760:1320,.06,'triangle',.07);}spawnIn=rush>0?4:Math.max(6,10-served*.3);}
    upd();if(T<=0){endJob(earn,'🧋 Shop closed! Served '+served,'cash');return false;}});
  drawQ();drawSt();}
/* 🧵 Sewing machine: hold to sew when the dotted seam is under the needle, let go over pins */
function sewMachine(){let T=45,earn=0,combo=0,speed=90,x=0,holding=false,stitched=0,snaps=0,jam=0,messy=0;
  const COLS=['#f783ac','#4dabf7','#ffd43b','#69db7c','#9775fa'];let col=pick(COLS);
  const s=cScreen('<h2>🧵 Sewing Machine</h2>'+hud()+'<p class="note">Hold the big button when the <b>dotted seam</b> is under the needle. Let go over <b>📍 pins</b>!</p><div class="machine"><div class="fabw" id="fabw"><svg id="fab" viewBox="0 0 600 220"><g id="strip"></g><g id="stitches"></g></svg></div><svg class="ndl" viewBox="0 0 600 220"><path d="M300 0V96" stroke="#868e96" stroke-width="10"/><path id="needle" d="M300 60V120" stroke="#495057" stroke-width="4"/><rect x="250" y="0" width="100" height="40" rx="10" fill="#e64980" stroke="#4a3426" stroke-width="3"/></svg></div><button class="sewbtn" id="hold">HOLD TO SEW</button>');
  const host=s.querySelector('.cin'),strip=s.querySelector('#strip'),sts=s.querySelector('#stitches'),needle=s.querySelector('#needle');
  // course: alternating seam segments, gaps and pins
  const segs=[];let p=380;for(let i=0;i<60;i++){const r=Math.random();if(r<.62){const L=60+Math.random()*120;segs.push({t:'seam',a:p,b:p+L});p+=L+30+Math.random()*40;}else{segs.push({t:'pin',a:p,b:p+26});p+=60+Math.random()*40;}}
  const bg=['#ffe3ec','#e7f5ff','#fff3bf','#ebfbee','#f3f0ff'];
  strip.innerHTML='<rect x="0" y="40" width="'+(p+600)+'" height="160" fill="'+pick(bg)+'"/>'+[...Array(Math.ceil((p+600)/40))].map((_,i)=>'<circle cx="'+(i*40+20)+'" cy="'+(60+(i%3)*50)+'" r="4" fill="#fff" opacity=".7"/>').join('')+
    segs.map(g=>g.t==='seam'?'<path d="M'+g.a+' 120H'+g.b+'" stroke="#868e96" stroke-width="3" stroke-dasharray="8 6"/>':'<text x="'+g.a+'" y="132" font-size="28">📍</text>').join('');
  const fab=s.querySelector('#fab'),fabw=s.querySelector('#fabw'),mach=s.querySelector('.machine');let sc=1;const size=()=>{sc=mach.clientHeight/220;fab.setAttribute('viewBox','0 0 '+(p+600)+' 220');fab.style.width=((p+600)*sc)+'px';fab.style.height=mach.clientHeight+'px';};size();
  const btn=s.querySelector('#hold');const on=e=>{e.preventDefault();holding=true;btn.classList.add('on');},off=()=>{holding=false;btn.classList.remove('on');};
  btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointerleave',off);btn.addEventListener('pointercancel',off);
  const upd=()=>{TX(s.querySelector('#hT'),'⏱ '+Math.ceil(T));TX(s.querySelector('#hM'),'💰 '+earn);TX(s.querySelector('#hC'),'🔥 x'+Math.max(1,1+Math.floor(combo/20)));};
  let last=performance.now(),acc=0,t0=0,cool=0;
  const loop=now=>{if(!s.isConnected||!s.querySelector('#fab'))return;const dt=Math.min(.1,(now-last)/1000);last=now;T-=dt;t0+=dt;speed=90+t0*3;x+=speed*dt;cool-=dt;
    if(Math.abs(mach.clientHeight/220-sc)>.01)size();fabw.style.transform='translate3d('+(-x*sc).toFixed(1)+'px,0,0)';
    const at=x+300,g=segs.find(g=>at>=g.a&&at<=g.b);
    needle.setAttribute('d',holding?'M300 '+(60+Math.abs(Math.sin(now/40))*40)+'V'+(100+Math.abs(Math.sin(now/40))*24):'M300 60V96');
    jam-=dt;if(jam>0){needle.setAttribute('d','M300 60V96');s.querySelector('.machine').classList.add('jammed');}else s.querySelector('.machine').classList.remove('jammed');
    if(holding&&jam<=0){acc+=speed*dt;if(acc>=12){acc=0;
      if(g&&g.t==='seam'){if(sts.childNodes.length>70)sts.firstChild.remove();sts.insertAdjacentHTML('beforeend','<path d="M'+(at-5)+' 120h10" stroke="'+col+'" stroke-width="4" stroke-linecap="round"/>');stitched++;combo++;if(stitched%5===0){const m=1+Math.floor(combo/20);earn+=m;popFx(host,host.clientWidth/2,150,'+$'+m);}tone(1600,.015,'square',.03);}
      else if(g&&g.t==='pin'&&cool<=0){cool=.6;snaps++;combo=0;const lose=Math.min(earn,2);earn-=lose;jam=1.5;T=Math.max(0,T-3);sfx.boing();tone(120,.5,'sawtooth',.08);popFx(host,host.clientWidth/2,150,'💥 Snap! Needle jammed'+(lose?' −$'+lose:'')+' −3s','#c92a2a');s.querySelector('.machine').classList.add('jolt');setTimeout(()=>s.querySelector('.machine')&&s.querySelector('.machine').classList.remove('jolt'),300);}
      else {combo=0;messy++;sts.insertAdjacentHTML('beforeend','<path d="M'+(at-5)+' '+(110+Math.random()*20)+'l10 '+(Math.random()*12-6)+'" stroke="#e03131" stroke-width="3" stroke-linecap="round"/>');tone(220,.03,'square',.03);if(messy%4===0){const lose=Math.min(earn,1);earn-=lose;popFx(host,host.clientWidth/2,150,'Messy stitches!'+(lose?' −$1':''),'#e8590c');}}}}
    upd();if(T<=0){endJob(earn,'🧵 Done! '+stitched+' good stitches, '+snaps+' snapped pins, '+messy+' messy','sew');return;}
    requestAnimationFrame(loop);};
  requestAnimationFrame(loop);}
