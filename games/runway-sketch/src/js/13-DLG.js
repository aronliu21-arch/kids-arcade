let DLG=null;
function dlg(lines,done){if(!Array.isArray(lines)||!lines.length){done&&done();return;}
  let i=0,typing=null,full='';const el=document.createElement('div');el.id='dlg';
  el.innerHTML='<div class="dp" id="dp"></div><div class="dband"><div class="dwin"><div class="dname" id="dn"></div><div class="dtxt" id="dt"></div><span class="dnext">▶</span></div></div><button class="dskip" id="dsk">Skip ⏭</button>';
  document.body.appendChild(el);DLG=el;
  const show=()=>{const [who,mood,text]=lines[i],c=CAST[who];const dp=el.querySelector('#dp');
    if(dp.dataset.who!==who){dp.dataset.who=who;dp.classList.remove('in');void dp.offsetWidth;dp.classList.add('in');}
    dp.innerHTML=portrait(who,mood);el.querySelector('#dn').textContent=c.name;full=text.replace(/\{n\}/g,ME||'Nora');const dt=el.querySelector('#dt');dt.textContent='';let k=0;clearInterval(typing);
    typing=setInterval(()=>{k+=2;dt.textContent=full.slice(0,k);if(k%6===0&&SOUND)tone(who==='nora'?880:who==='stella'?990:660,.02,'square',.025);if(k>=full.length){clearInterval(typing);typing=null;}},28);
    say(full);};
  const end=()=>{clearInterval(typing);el.remove();DLG=null;try{speechSynthesis.cancel();}catch(e){}done&&done();};
  el.onclick=e=>{if(e.target.id==='dsk')return end();if(typing){clearInterval(typing);typing=null;el.querySelector('#dt').textContent=full;return;}i++;if(i>=lines.length)end();else show();};
  show();}
/* the story beats */
CAST.nora.skin=SK();CAST.nora.iris=EYECOL[FACE.eyeCol];
const STORY={
 intro:[['mia','happy','Hi {n}! I\'m Mia, your new agent. Welcome to the fashion world!'],['nora','surprised','Wow, my very own agent? This is so exciting!'],
  ['mia','neutral','You\'re just starting out, so your closet is tiny. Do part-time jobs to earn money, then shop for new clothes.'],
  ['mia','happy','Come to my agency for modeling gigs. Every star the judges give you makes you more famous, and famous models earn more!'],
  ['stella','proud','Hmph. A new model? Cute. But I\'m Stella, and I\'m going to be the World Supermodel.'],['nora','angry','We\'ll see about that, Stella!'],['mia','happy','That\'s the spirit! Your goal: become the World Supermodel. Let\'s go!']],
 job:{cash:[['bea','happy','Welcome to my café, {n}! Every shift is different: the lunch rush, catching boba, or baking in the ovens.'],['bea','proud','Work fast, smile, and count change carefully!']],
  sew:[['sue','happy','Hello dear! Today you might run my sewing machine, fix buttons, or thread needles.'],['sue','proud','Steady hands make beautiful clothes!']],
  sort:[['kay','neutral','Stock day! Some days it\'s the conveyor belt, some days shoe pairs, some days stacking boxes.'],['kay','happy','Be quick and don\'t drop anything!']]},
 shop:[['rose','happy','Bonjour, {n}! I\'m Madame Rose. The more famous you get, the fancier the shops that let you in.'],['rose','proud','Start small, dream big. Every great model began with a T-shirt!']],
 gig:{show:[['mia','happy','A runway show! The theme is {t}. Dress to match it and add some color and patterns.']],
  shoot:[['mia','happy','Photo shoot day! The theme is {t}. Make the camera love you!']],
  contest:[['stella','proud','Oh, it\'s you again. This contest is {t}. Try not to cry when I win.'],['nora','angry','Bring it on, Stella!']]},
 win:[[['mia','happy','Amazing walk, {n}! The crowd loved you.']],[['mia','proud','Look at those stars! Your fans are growing.']]],
 lose:[[['mia','sad','Not your best day, but every model has those. Try matching the theme more closely next time.']]],
 cwin:[['stella','surprised','What?! You beat me?'],['nora','happy','Good game, Stella!'],['stella','angry','Next time I won\'t lose!']],
 close:[['stella','proud','Ha! Better luck next time, newbie.'],['nora','sad','Aw... I\'ll practice and get better!']],
 level:[['mia','surprised','{n}, everyone is talking about you! You\'re now a {l}!'],['mia','happy','Bigger gigs pay more now, and new shops will let you in.']],
 ending:[['mia','surprised','{n}... the magazines just announced it.'],['mia','happy','You are the WORLD SUPERMODEL!'],['stella','sad','I can\'t believe it... you really did it.'],['stella','happy','Okay, okay. You earned it. Congratulations, {n}.'],
  ['rose','happy','Magnifique! I always knew that T-shirt girl would shine.'],['nora','happy','Thank you everyone! I couldn\'t have done it without you!']]};
const fillS=(L,v)=>L.map(([w,m,t])=>[w,m,t.replace('{t}',v.t||'').replace('{l}',v.l||'')]);

/* ---------- career mode: from new model to world supermodel ---------- */
const CK='rs_career';
const LV=[[0,'New Model',1],[15,'Rising Face',1.5],[40,'Fashion Star',2],[80,'Top Model',3],[140,'International Model',4],[220,'World Supermodel',5]];
const START={hair:['pony','bun'],top:['tee','tank'],bottom:['skirt','shorts'],dress:[],shoes:['sneakers'],acc:[]};
let C=null,GIG=null;
function cLoad(){try{C=JSON.parse(localStorage.getItem(CK)||'null');}catch(e){C=null;}if(!C)C={money:20,stars:0,own:JSON.parse(JSON.stringify(START)),done:0,gigs:null,top:false,keep:0,lvShown:0};if(C.keep==null){C.keep=rawLv(C.stars);C.lvShown=C.keep;}return C;}
function cSave(){try{localStorage.setItem(CK,JSON.stringify(C));}catch(e){}}
function lvOf(s){const r=rawLv(s);if(!C)return r;return Math.min(r,Math.max(capLevel(),C.keep||0));}
const owns=(c,id)=>C&&C.own[c]&&C.own[c].includes(id);
function itemsFor(c){return MODE==='career'&&C?CAT[c].items.filter(i=>owns(c,i.id)):CAT[c].items;}
function cScreen(html,town){const old=document.getElementById('career');const s=document.createElement('div');s.id='career';if(old)old.replaceWith(s);else document.body.appendChild(s);s.innerHTML='<div class="cin">'+html+'</div>'+(town?'':'<button class="cquit" aria-label="Leave">🏙️ Leave</button>');s.scrollTop=0;const q=s.querySelector('.cquit');if(q)q.onclick=()=>{audio();careerHub();};return s;}
function cClose(){const s=document.getElementById('career');if(s)s.remove();}
function cHead(){const L=lvOf(C.stars),nx=LV[L+1],p=nx?Math.min(100,Math.round((C.stars-LV[L][0])/(nx[0]-LV[L][0])*100)):100;
  return '<div class="chead"><div class="cst"><span>💰 '+C.money+'</span><span>⭐ '+C.stars+'</span><span>🏅 '+totalBadges()+'</span></div><div class="clv">'+ZT(LV[L][1])+'</div>'+
    '<div class="cbar"><i style="width:'+p+'%"></i></div><div class="cnx">'+(nx?'Next: '+nx[1]+' ⭐'+nx[0]+' + 🏅'+LV_BADGES[L+1]+(C.stars>=nx[0]&&totalBadges()<LV_BADGES[L+1]?' · Earn badges in the Fashion District!':''):'👑 '+ZT('You are the World Supermodel!'))+'</div></div>';}
function careerHub(){MODE='career';cLoad();ME='Nora';
  const n=ORDER.reduce((a,c)=>a+C.own[c].length,0);
  const tx=C.tx||50;const s=cScreen(cHead()+'<div class="cgoal">🎯 Goal: become the World Supermodel! <span class="tip">Tap a building</span></div><div class="streets"><button class="btn'+(C.street!==2?' on':' ghost')+'" id="st1">🏙️ Main Street</button><button class="btn'+(C.street===2?' on':' ghost')+'" id="st2">✨ Fashion District <small>learn &amp; earn badges</small></button></div><div class="townbox">'+townSVG(lvOf(C.stars))+'<div id="walkers"></div><div id="tnora" data-x="'+tx+'" style="left:'+tx+'%">'+figureSVG(look)+'</div></div><div class="row"><button class="btn ghost" id="cExit">🏠 '+ZT('Modes')+'</button><button class="btn ghost" id="cReset">'+ZT('Reset records')+'</button></div>');
  s.querySelector('#st1').onclick=()=>{audio();C.street=1;cSave();careerHub();};s.querySelector('#st2').onclick=()=>{audio();C.street=2;cSave();careerHub();};townWire(s);{const q0=s.querySelector('.cquit');if(q0)q0.remove();}
  s.querySelector('#cExit').onclick=()=>{cClose();MODE='solo';showModes();};
  C.met=C.met||{};if(!C.intro){C.intro=1;cSave();setTimeout(()=>maker(()=>dlg(STORY.intro),true),300);}else if(C.pending){const p=C.pending;C.pending=null;cSave();setTimeout(()=>dlg(p),300);}
  const r=s.querySelector('#cReset');r.onclick=()=>parentGate(()=>{localStorage.removeItem(CK);C=null;careerHub();});}
/* agency: modelling gigs. Pay grows with fame */
function makeGigs(){const L=lvOf(C.stars),g=[];C.used=C.used||[];let pool=THEMES.map(t=>t.id).filter(id=>!C.used.includes(id));if(pool.length<4){C.used=[];pool=THEMES.map(t=>t.id);}pool.sort(()=>Math.random()-.5);
  const kinds=[['show','Runway Show',12],['shoot','Photo Shoot',10],['contest','Model Contest',18]];
  for(let i=0;i<4;i++){const k=kinds[i%3],need=i===3?Math.min(LV.length-1,L+1):0;g.push({k:k[0],zh:k[1],en:k[1],base:k[2]+need*4,t:pool[i],need:need});}
  return g;}
function payOf(g,stars,won){const m=LV[lvOf(C.stars)][2];let p=g.base*stars/15*m;if(g.k==='contest')p*=won?1.6:.6;p*=.75;return Math.max(1,Math.round(p));}
function agency(){if(!C.gigs){C.gigs=makeGigs();cSave();}const L=lvOf(C.stars),m=LV[L][2];
  const s=cScreen(cHead()+'<h2>🏢 '+ZT('Agency')+'</h2><p class="note">'+ZT('The more famous, the more you earn!')+' ×'+m+'</p><div class="cgigs">'+
    C.gigs.map((g,i)=>{const t=THEMES.find(x=>x.id===g.t),lock=g.need>L;return '<button class="gig'+(lock?' lock':'')+'" data-i="'+i+'"><span class="e">'+(g.k==='show'?'💃':g.k==='shoot'?'📸':'🏆')+'</span><b>'+ZT(g.zh)+'</b><span>'+ZT('Theme')+': '+t.en+' '+[...new Intl.Segmenter().segment(TPICS[t.id]||'')].slice(0,2).map(x=>x.segment).join('')+'</span><span class="pay">💰 '+ZT('Up to')+' '+payOf(g,15,true)+'</span>'+(lock?'<span>🔒 '+ZT('Needs ')+ZT(LV[g.need][1])+'</span>':'')+'</button>';}).join('')+
    '</div><div class="row"><button class="btn ghost" id="cBack">🏙️ '+ZT('Back to town')+'</button></div>');
  s.querySelector('#cBack').onclick=careerHub;
  s.querySelectorAll('.gig').forEach(b=>b.onclick=()=>{const g=C.gigs[+b.dataset.i];if(g.need>lvOf(C.stars)){sfx.boing();toast('🔒 '+ZT('Not famous enough yet'));return;}startGig(g);});}
function startGig(g){GIG=g;C.used=C.used||[];if(!C.used.includes(g.t))C.used.push(g.t);cSave();cClose();MODE='career';fresh();setTheme(g.t);timeLeft=120;showTime();
  GIG.opp=g.k==='contest'?{name:'Stella',look:genCPU()}:null;renderTabs();renderFig();renderItems();setBadge(ME);
  dlg(fillS(STORY.gig[g.k],{t:THEMES.find(x=>x.id===g.t).en}));}
function careerResult(tot,max,two,E){const me=tot[0],won=two?tot[0]>tot[1]:true,pay=payOf(GIG,me,won);
  C.money+=pay;C.stars+=me;C.done++;C.gigs=null;cSave();
  let h='<div class="cres">💰 +'+pay+' &nbsp; ⭐ +'+me+(two?' &nbsp; '+(won?'🏆 '+ZT('You won!'):ZT('Better luck next time!')):'')+'</div>';
  let P=two?(won?STORY.cwin:STORY.close):(me>=9?pick(STORY.win):pick(STORY.lose));
  P=P.concat(lvUpLines());
  C.pending=P;cSave();
  return h;}
/* shops: fancier shops open as she gets famous */
const SHOPS=[['basic','🧺','Budget Shop',0,1,it=>price(it)<=9],['sport','⚽','Sports Shop',0,1,it=>it.tags.some(t=>['sports','camping','beach'].includes(t))],
  ['sweet','🍭','Sweetie House',1,1.2,it=>it.tags.some(t=>['candy','birthday','garden','fairy'].includes(t))],['boutique','👜','Boutique',2,1.3,it=>it.tags.some(t=>['school','travel','autumn','concert','night','snow','rain'].includes(t))],
  ['gown','👑','Dream Gowns',3,1.5,it=>it.tags.some(t=>['royal','ballet','halloween','newyear'].includes(t))],['paris','🗼','Paris Couture',4,1.8,it=>true]];
const cPrice=(sh,it)=>Math.round(price(it)*sh[4]);
function shopMenu(){const L=lvOf(C.stars);C.met=C.met||{};if(!C.met.shop){C.met.shop=1;cSave();setTimeout(()=>dlg(STORY.shop),250);}const s=cScreen(cHead()+'<h2>🛍️ '+ZT('Shopping')+'</h2><div class="cgrid">'+
    SHOPS.map((sh,i)=>'<button class="mode'+(sh[3]>L?' lock':'')+'" data-i="'+i+'"><span class="e">'+sh[1]+'</span><b>'+ZT(sh[2])+'</b><span>'+(sh[3]>L?'🔒 '+ZT('Needs ')+ZT(LV[sh[3]][1]):ZT('Open'))+'</span></button>').join('')+
    '</div><div class="row"><button class="btn ghost" id="cBack">🏙️ '+ZT('Back to town')+'</button></div>');
  s.querySelector('#cBack').onclick=careerHub;
  s.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{const sh=SHOPS[+b.dataset.i];if(sh[3]>lvOf(C.stars)){sfx.boing();toast('🔒 '+ZT('Not famous enough yet'));return;}shop(sh);});}
function shop(sh,cat){cat=cat||'top';const list=CAT[cat].items.filter(it=>sh[5](it)&&!owns(cat,it.id)).sort((a,b)=>price(a)-price(b));
  const s=cScreen(cHead()+'<h2>'+sh[1]+' '+ZT(sh[2])+'</h2><div class="tabs ctabs">'+ORDER.map(c=>'<button class="tab'+(c===cat?' on':'')+'" data-c="'+c+'">'+CATEN[c]+'</button>').join('')+'</div>'+
    (list.length?'<div class="items shopitems">'+list.map((it,i)=>'<button class="it" data-i="'+i+'">'+thumb(cat,it)+'<span class="nm">'+RB(it.zh.replace('T',''),it.zy.replace('T ',''))+'</span><span class="en">'+it.en+'</span><span class="pr'+(cPrice(sh,it)>C.money?' no':'')+'">💰'+cPrice(sh,it)+'</span></button>').join('')+'</div>':'<p class="note">'+ZT('You own everything here!')+'</p>')+
    '<div class="row"><button class="btn ghost" id="cBack">🛍️ '+ZT('Other shops')+'</button><button class="btn ghost" id="cHome">🏙️ '+ZT('Back to town')+'</button></div>');
  fitThumbs();s.querySelector('#cBack').onclick=shopMenu;s.querySelector('#cHome').onclick=careerHub;
  s.querySelectorAll('.ctabs .tab').forEach(b=>b.onclick=()=>shop(sh,b.dataset.c));
  s.querySelectorAll('.shopitems .it').forEach(b=>b.onclick=()=>{const it=list[+b.dataset.i],p=cPrice(sh,it);
    if(p>C.money){sfx.boing();toast('💰 '+ZT('Not enough money. Work a job or take a gig!'),2400);return;}
    const m=modal2('<div class="big">'+thumb(cat,it)+'</div><h2>'+RB(it.zh.replace('T',''),it.zy.replace('T ',''))+' <small>'+it.en+'</small></h2><p style="font-size:1.3rem">💰 '+p+'</p><div class="row"><button class="btn pink" id="buy">'+ZT('Buy')+'</button><button class="btn ghost" id="nob">'+ZT('No thanks')+'</button></div>');
    m.querySelectorAll('svg').forEach(x=>{x.style.width='140px';x.style.height='140px';});try{const sv=m.querySelector('.big svg'),bb=sv.querySelector('.tb').getBBox(),q=Math.max(bb.width,bb.height)*.08;sv.setAttribute('viewBox',(bb.x-q)+' '+(bb.y-q)+' '+(bb.width+2*q)+' '+(bb.height+2*q));}catch(e){}
    m.querySelector('#nob').onclick=()=>m.remove();
    m.querySelector('#buy').onclick=()=>{m.remove();C.money-=p;C.own[cat].push(it.id);cSave();sfx.win();tone(1200,.08,'triangle',.1);toast('🛍️ '+ZT('Bought it!'));shop(sh,cat);};});}
