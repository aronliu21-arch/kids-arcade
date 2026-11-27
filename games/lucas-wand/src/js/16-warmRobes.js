function warmRobes(){ if(!LUCAS_ART) return; ['happy','wow','brave','cast','sad','sleepy','wave'].forEach(p=>{ robeSrc(`art/nora-${p}.webp`); robeSrc(`art/nora2-${p}.webp`); }); }
let shopFrom='title', shopTab='wand';
function openShop(from){ shopFrom=from||'title'; eq(); show('shop'); Snd.sfx('tap'); renderShop(); }
function renderShop(){ eq(); $('#shStars').textContent=S.stars; document.querySelectorAll('#shTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===shopTab));
 const box=$('#shItems'); box.innerHTML='';
 if(shopTab==='nest'){ const love=S.emberLove||0; box.innerHTML=`<div class="nest"><div class="nestArt">${svg(BG('room')+dragon(512,300,1,{expr:'happy'}),'212 40 600 560')}</div><div class="love">${'❤️'.repeat(Math.min(10,love))}${'🤍'.repeat(Math.max(0,10-love))}</div><div id="nestMsg">${love?'Ember loves you this much!':'Feed Ember a treat!'}</div><div class="feed">${SHOP.treat.map(t=>`<button data-id="${t.id}" ${(S.treats[t.id]||0)?'':'disabled'}>${t.e}<small>${t.n} ×${S.treats[t.id]||0}</small></button>`).join('')}</div></div>`;
  box.querySelectorAll('.feed button').forEach(b=>b.onclick=()=>{ const t=SHOP.treat.find(x=>x.id===b.dataset.id); if(!(S.treats[t.id]>0)) return; S.treats[t.id]--; S.emberLove=(S.emberLove||0)+1; save(); Snd.sfx('gold'); FX.hearts(...FX.center($('.nestArt'))); renderShop(); $('#nestMsg').textContent=t.say; Voice.say(t.say); });
  return; }
 SHOP[shopTab].forEach(it=>{ const own=shopTab==='treat'?false:!!(S.owned[shopTab]||{})[it.id], on=shopTab!=='treat'&&S.equip[shopTab]===it.id; const d=document.createElement('div'); d.className='item'+(on?' on':'');
  let pic='';
  if(shopTab==='wand'){ const c=it.c==='rainbow'?['','#e64980','']:it.c; pic=`<div class="pic wandPic" style="--ink:${it.c==='rainbow'?'linear-gradient(90deg,#fa5252,#fab005,#40c057,#228be6,#7048e8)':c[1]}"><span class="cur">magic</span></div>`; }
  else if(shopTab==='robe'){ pic=`<div class="pic robePic" data-h="${it.h===null?'':it.h}"><img src="art/nora-happy.webp" alt=""></div>`; }
  else pic=`<div class="pic treatPic">${it.e}</div>`;
  const btn= shopTab==='treat' ? `<button class="btn gold sm buy">${it.p} ✨ Buy</button><small>You have ${S.treats[it.id]||0}</small>` : on ? `<button class="btn ghost sm" disabled>Wearing ✓</button>` : own ? `<button class="btn sm use">Use</button>` : `<button class="btn gold sm buy">${it.p} ✨ Buy</button>`;
  d.innerHTML=`${pic}<b>${it.n}</b>${btn}`; box.appendChild(d);
  const buy=d.querySelector('.buy'), use=d.querySelector('.use');
  if(buy) buy.onclick=()=>{ if(S.stars<it.p){ Snd.sfx('fizz'); $('#shMsg').textContent=`You need ${it.p-S.stars} more ✨. Keep casting spells!`; return; } S.stars-=it.p; if(shopTab==='treat'){ S.treats[it.id]=(S.treats[it.id]||0)+1; $('#shMsg').textContent=`${it.e} ${it.n} bought! Feed it to Ember in Ember's Nest.`; } else { S.owned[shopTab]=S.owned[shopTab]||{}; S.owned[shopTab][it.id]=1; S.equip[shopTab]=it.id; $('#shMsg').textContent=`${it.n} is yours! ✨`; if(shopTab==='robe') warmRobes(); } save(); refreshStars(); Snd.sfx('gold'); FX.burst(...FX.center(d),{n:50,speed:8}); renderShop(); };
  if(use) use.onclick=()=>{ S.equip[shopTab]=it.id; save(); Snd.sfx('tap'); if(shopTab==='robe') warmRobes(); renderShop(); };
 });
 // robe previews recolored in place
 box.querySelectorAll('.robePic').forEach(p=>{ const h=p.dataset.h; if(h==='') return; recolor('art/nora-happy.webp',+h).then(u=>{ p.querySelector('img').src=u; }).catch(()=>{}); });
}
document.querySelectorAll('#shTabs button').forEach(b=>b.onclick=()=>{ shopTab=b.dataset.t; Snd.sfx('tap'); renderShop(); });
$('#shBack').onclick=()=>{ Snd.sfx('tap'); if(shopFrom==='map2') goMap(); else if(shopFrom==='map') goMap(); else { show('title'); refreshStars(); } };
$('#shopBtn').onclick=()=>openShop('title');

// ---------- title: choose the year
function renderYears(){ const b2=$('#y2Btn'), b1=$('#y1Btn'); const ok=y1Done(); b2.disabled=!ok; b2.innerHTML=ok?'📗 Year 2 <small>The Dragon Pact</small>':'🔒 Year 2 <small>Finish Year 1 first</small>'; b1.classList.toggle('on',yearOf()===1); b2.classList.toggle('on',yearOf()===2); }
$('#y1Btn').onclick=()=>{ if(yearOf()!==1){ setYear(1); Snd.sfx('tap'); } renderYears(); };
$('#y2Btn').onclick=()=>{ if(!y1Done()) return; if(yearOf()!==2){ setYear(2); Snd.sfx('gold'); FX.burst(...FX.center($('#y2Btn')),{n:60,speed:9}); } renderYears(); };
const _refreshStars=refreshStars; refreshStars=function(){ _refreshStars(); try{ renderYears(); }catch(e){} try{ $('#m2Stars').textContent=S.stars; }catch(e){} };
// start button in Year 2: its own opening story (no entrance test)
const _start=$('#startBtn').onclick;
$('#startBtn').onclick=function(){ if(yearOf()!==2) return _start.apply(this,arguments); FX.burst(...FX.center($('#startBtn')),{n:60,speed:9}); Snd.init(); try{Snd.ctx.resume();}catch(e){} Snd.sfx('chime');
 if(!S.introSeen){ playStory([...Y2.INTRO(),say(null,'Year 2: The Dragon Pact',titleCard(1),{sfx:'gold'})],()=>{ S.introSeen=true; save(); goMap(); },{skippable:true}); } else { S.view=Math.min(S.view||1,S.ch,CHAPTERS.length); goMap(); } };
eq(); warmRobes(); renderYears();
// test hook: new screens
const _solve=window.__test.solve; window.__test.solve=()=>{
 if(current==='read'&&R){ $('#rdIn').value=R.items[R.i]; return readCheck(); }
 if(current==='map2'){ const m=nextMain(S.view); if(m){ const b=document.querySelector(`#m2Rooms .room[data-id="${m.id}"]`); if(b&&!b.dataset.busy){ b.dataset.busy=1; return startMission(m,S.view); } return; } if(!S.chDone[S.view]) return chapterEnd(S.view); if(S.view<CHAPTERS.length){ S.view++; return renderMap2(); } return; }
 if(current==='shop') return $('#shBack').click();
 return _solve(); };

$('#rdGo').onclick=readCheck; $('#rdIn').addEventListener('keydown',e=>{ if(e.key==='Enter') readCheck(); }); $('#rdMap').onclick=()=>{ R=null; goMap(); };
const _rs2=refreshStars; refreshStars=function(){ _rs2(); try{ $('#rdStars').textContent=S.stars; }catch(e){} };

