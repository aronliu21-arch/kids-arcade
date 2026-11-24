/* ---------- screens ---------- */
let SCREEN='title',RUN=0; // RUN = missions in a row this session
const main=$('main');
function setScreen(n,html){SCREEN=n;{const hb=$('homeb');if(hb)hb.style.display=['title','hub','starter','break'].includes(n)?'none':'';const pb=$('padb');if(pb)pb.style.display=['cash','battle','master','sort','insp'].includes(n)?'':'none';padClose();padClear();if(typeof deskClose==='function')deskClose();}main.innerHTML=html;main.scrollTop=0;const th=placeTheme(n);th?musicStart(th):musicStop();if(typeof achCheck==='function'&&n!=='title')achCheck();}
function placeTheme(n){if(n==='hub')return S.hubMode!=='list'&&typeof skyMode==='function'&&skyMode()==='night'?'night':'anthem';return {title:'anthem',store:'shop',myshop:'shop',binder:'calm',quest:'calm',skills:'calm',ach:'calm',intro:'calm',tour:'stadium',rival:'stadium',pick:'stadium',result:'anthem'}[n]||null;}
function bindAll(map){main.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{audio();const f=map[b.dataset.a];if(f)f(b.dataset.v,b);});}

function title(){
 const ids=[10,13,1];
 setScreen('title',`<div class="title" id="tt"><div class="logo">Lucas’s<br>Card Quest</div><div style="font-size:1.6rem">${zh([['陸','ㄌㄨˋ'],['晨','ㄔㄣˊ'],['的','˙ㄉㄜ'],['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['大','ㄉㄚˋ'],['冒','ㄇㄠˋ'],['險','ㄒㄧㄢˇ']])}</div>
 <div class="fan" id="fan">${ids.map(i=>cardHTML(byId(i))).join('')}</div>
 <button class="btn gold tapgo" id="go">▶ Tap to start</button>
 <button class="btn ghost small" id="rst">Reset records</button></div>`);
 let started=false,timer=0;
 const done=()=>{clearTimeout(timer);const go=()=>S.started?hub():starter();S.introSeen?go():introStory(go);};
 $('go').onclick=e=>{e.stopPropagation();audio();if(started)return done();started=true;musicStart();sfx.shimmer();
  const f=$('fan');f.classList.remove('go');void f.offsetWidth;f.classList.add('go');$('go').textContent='Let’s go! (tap to skip)';
  timer=setTimeout(done,matchMedia('(prefers-reduced-motion:reduce)').matches?200:2200);};
 $('tt').onclick=()=>{if(started)done();};
 $('rst').onclick=e=>{e.stopPropagation();parentGate();};}

function parentGate(){const a=ri(101,999),b=ri(11,99);
 const m=modal(`<div class="gate"><h2>Grown-ups only</h2><p>What is <b>${a} × ${b}</b>?</p><input id="pg" inputmode="numeric" autocomplete="off"><p id="pgm" style="color:var(--bad);min-height:1.2em"></p></div>`,
  [['Check',null],['Cancel',null,'ghost']]);
 const btn=m.querySelector('.row:last-child .btn');btn.onclick=()=>{if(+m.querySelector('#pg').value===a*b){m.remove();
   modal(`<h2>Reset which kid?</h2><label style="font-size:1.2rem;font-weight:800"><input type="checkbox" id="rk" style="width:24px;height:24px"> Lucas (this device)</label>`,[['Reset',()=>{if(document.getElementById('rk')&&document.getElementById('rk').checked){S=Object.assign({},DEF);RUN=0;save();toast('Records reset');}title();}],['Cancel',null,'ghost']]);
   const chk=document.getElementById('rk');const rb=chk.closest('div').querySelector('.btn');rb.onclick=()=>{const on=chk.checked;chk.closest('.modal').remove();if(on){S=Object.assign({},DEF);RUN=0;save();toast('Records reset');}title();};}
  else{parentGate();m.remove();}};}

function starter(){
 setScreen('starter',`<div class="hub"><div class="hero"><div class="av me">${LUCAS}<span class="badge">Lucas</span></div><div class="goal"><b>Welcome, Lucas! Here is your starter deck.</b><div style="font-size:.9rem;color:var(--muted)">Tip: tap any word to hear it 🔈</div>${zh([['新','ㄒㄧㄣ'],['手','ㄕㄡˇ'],['牌','ㄆㄞˊ'],['組','ㄗㄨˇ']])}<div>One card of every type, plus <b>5 free packs</b> to rip open and <b>$2.00</b>!</div></div></div>
 <div class="cgrid">${STARTER.map(i=>cardHTML(byId(i))).join('')}</div><div class="row"><button class="btn gold" data-a="ok">Add to my binder ▶</button></div></div>`);
 say('Welcome Lucas! Here is your starter deck. One card of every type.');
 bindAll({ok(){STARTER.forEach(i=>S.owned[i]=(S.owned[i]||0)+1);S.started=true;S.cents=200;S.freePacks=5;restock();save();sfx.good();openPack(true);}});}

function restock(){S.shelf=[0,1,2].map(i=>randCard(i===2?[['rare',6],['holo',3],['legend',1]]:[['common',6],['rare',4]]).id);}
const GOAL=10000,TITLES=3;const canOpen=()=>S.cents>=GOAL&&S.trophies>=TITLES;
function hubList(fromAct){
 if(fromAct&&RUN>=3){return breakScreen();}
 const owned=Object.keys(S.owned).length;
 const T2=(e,en,z,a,sub,cls)=>`<button class="tile ${cls||''}" data-a="${a}"><span class="e">${e}</span><span class="en">${en}</span>${zh(z)}${sub?`<small>${sub}</small>`:''}</button>`;
 setScreen('hub',`<div class="hub"><div class="hero"><div class="av me">${LUCAS}<span class="badge">Lucas</span></div><div class="goal">
 ${S.shopOpen?`<b>🏪 Lucas’s Cards is open!</b><div>🏆 ×${S.trophies} · 📒 ${owned}/${C.length} cards</div>`:`<b>To open your own shop: save ${money(GOAL)} and win ${TITLES} tournament titles!</b><div>💵 ${money(S.cents)} of ${money(GOAL)}</div><div class="bar"><i style="width:${Math.min(100,S.cents/GOAL*100)}%"></i></div><div style="margin-top:4px;font-size:1.3rem">${Array.from({length:TITLES},(_,i)=>i<S.trophies?'🏆':'<span style="filter:grayscale(1);opacity:.35">🏆</span>').join(' ')} <span style="font-size:.95rem">${Math.min(S.trophies,TITLES)}/${TITLES} titles · 📒 ${owned}/${C.length}</span></div>`}</div></div>
 <div class="row" style="font-size:.9rem;color:var(--muted);font-weight:700"><span>🔈 Tap any word to hear it</span><button class="btn small" data-a="qb">📜 Quest Book</button><button class="btn small" data-a="sk">🎓 Skills</button><button class="btn small" data-a="ach">🏅 Awards</button><button class="btn gold small" data-a="street">🗺️ Walk the street</button></div>
 <div class="tiles">
 ${T2('🧾','Cashier job',[['收','ㄕㄡ'],['銀','ㄧㄣˊ'],['打','ㄉㄚˇ'],['工','ㄍㄨㄥ']],'cash','Earn 35–50¢ a customer')}
 ${T2('🗂️','Sorting job',[['整','ㄓㄥˇ'],['理','ㄌㄧˇ'],['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ']],'sort','Earn 50¢ a row')}
 ${T2('🔍','Inspector job',[['鑑','ㄐㄧㄢˋ'],['定','ㄉㄧㄥˋ'],['真','ㄓㄣ'],['假','ㄐㄧㄚˇ']],'insp','Real or fake? 40–60¢')}
 ${T2('⚔️','Battle',[['對','ㄉㄨㄟˋ'],['戰','ㄓㄢˋ']],'battle','Win $1.50')}
 ${T2('🏆','Tournament',[['錦','ㄐㄧㄣˇ'],['標','ㄅㄧㄠ'],['賽','ㄙㄞˋ']],'tour','Entry $1 · win $5 + prize','hot')}
 ${S.freePacks>0?T2('🎁','Free packs',[['免','ㄇㄧㄢˇ'],['費','ㄈㄟˋ'],['卡','ㄎㄚˇ'],['包','ㄅㄠ']],'free',S.freePacks+' left to rip!','hot'):''}
 ${T2('🛒','Card store',[['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['店','ㄉㄧㄢˋ']],'store','Packs and single cards')}
 ${T2('📒','My binder',[['收','ㄕㄡ'],['藏','ㄘㄤˊ'],['冊','ㄘㄜˋ']],'binder',owned+' of '+C.length)}
 ${S.shopOpen?T2('🏪','My shop',[['我','ㄨㄛˇ'],['的','˙ㄉㄜ'],['店','ㄉㄧㄢˋ']],'myshop','Sell cards · upgrades','hot'):
  T2(canOpen()?'🔑':'🔒','My shop',[['我','ㄨㄛˇ'],['的','˙ㄉㄜ'],['店','ㄉㄧㄢˋ']],'open',canOpen()?'Ready to open!':'Needs '+money(GOAL)+' + '+TITLES+' 🏆',canOpen()?'hot':'lock')}
 </div></div>`);
 bindAll({qb:()=>questBook(),sk:()=>skillPath(),ach:()=>achRoom(),street:()=>{S.hubMode='street';save();hub();},free:()=>openPack(true),cash:()=>cashier(false),sort:sortJob,insp:inspectJob,battle:()=>arenaMenu(),tour:tourStart,store,binder,myshop:myShop,
  open(){if(!canOpen()){const need=[];if(S.cents<GOAL)need.push('save '+money(GOAL-S.cents)+' more');if(S.trophies<TITLES)need.push('win '+(TITLES-S.trophies)+' more tournament title'+(TITLES-S.trophies>1?'s':''));toast('🔒 You need to '+need.join(' and ')+'!',2400);sfx.bad();return;}
   modal(`<div class="big">🏪</div><h2>Open your own shop?</h2><p>It costs <b>${money(GOAL)}</b>. You will have ${money(S.cents-GOAL)} left.</p>`,[['Open it! 🎉',()=>{S.cents-=GOAL;S.shopOpen=true;S.up=S.up||{};S.stock=S.stock||[];save();confetti();setTimeout(confetti,400);fanfare();FX.stamp('GRAND OPENING!','small','#ffd43b');shout('Your shop is open! Put your extra cards on the shelf and pick a price.');setTimeout(myShop,900);}],['Not yet',null,'ghost']]);}});
 if(fromAct)maybeMaster();}

