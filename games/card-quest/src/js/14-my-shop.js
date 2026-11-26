/* ---------- Lucas's own shop: stock, prices, upgrades ---------- */
const fair=c=>c.r==='promo'?1000:R[c.r].p;
const UPG=[{k:'shelf',e:'🗄️',n:'Bigger shelf',c:500,d:'6 shelf spots instead of 3'},{k:'sign',e:'💡',n:'Neon sign',c:400,d:'1 more customer every day'},
 {k:'music',e:'🎵',n:'Cool music',c:300,d:'Happy customers sometimes tip'},{k:'case',e:'💎',n:'Glass display case',c:800,d:'Collectors pay up to 50% over fair price'}];
const slotsN=()=>S.up&&S.up.shelf?6:3;
function priceTag(it){const c=byId(it.id),f=fair(c),r=it.price/f,lim=S.up&&S.up.case?1.5:1.3;
 return r>lim?['Too high!','#e03131']:r>1.15?['Risky','#f08c00']:r<=.8?['Super deal','#2f9e44']:['Fair price','#1c7ed6'];}
function myShop(){S.up=S.up||{};S.stock=S.stock||[];const n=slotsN();
 const slot=(it,i)=>{if(!it)return `<button class="mslot empty" data-a="add"><span class="big">＋</span>Add a card</button>`;const c=byId(it.id),[tg,tc]=priceTag(it);
  return `<div class="mslot"><div class="mcard">${cardHTML(c)}</div><div class="prc"><button class="btn ghost pm" data-a="dn" data-v="${i}" aria-label="Lower price">−</button><b>${money(it.price)}</b><button class="btn ghost pm" data-a="up" data-v="${i}" aria-label="Raise price">＋</button></div>
   <small style="color:${tc};font-weight:900">${tg}</small><small>worth about ${money(fair(c))}</small><button class="btn ghost small" data-a="back" data-v="${i}">↩ Back to binder</button></div>`;};
 setScreen('myshop',`<div class="hub"><div class="panel shopsign"><div class="sign ${S.up.sign?'neon':''}">🏪 ${ME.shop}</div>${zh([['我','ㄨㄛˇ'],['的','˙ㄉㄜ'],['店','ㄉㄧㄢˋ']])}
 <p>Put your <b>extra</b> cards on the shelf and pick a price. Too high and customers walk away. Too low and you earn less!</p>
 <div class="row" style="font-weight:800">${UPG.filter(u=>S.up[u.k]).map(u=>`<span>${u.e} ${u.n}</span>`).join(' · ')||''}</div></div>
 <div class="panel"><h2 class="h">Shelf (${S.stock.length}/${n})</h2><div class="mshelf">${Array.from({length:n},(_,i)=>slot(S.stock[i],i)).join('')}</div></div>
 <div class="row"><button class="btn gold" data-a="open">🔔 Open for business ▶</button><button class="btn ghost" data-a="home">🏠 Home</button></div>
 <div class="panel"><h2 class="h">Upgrades ${zh([['升','ㄕㄥ'],['級','ㄐㄧˊ']])}</h2><div class="upg">${UPG.map(u=>S.up[u.k]?`<div class="ub own"><span class="e">${u.e}</span><b>${u.n}</b><small>${u.d}</small><span>✅ Yours</span></div>`:
  `<button class="ub" data-a="buy" data-v="${u.k}"><span class="e">${u.e}</span><b>${u.n}</b><small>${u.d}</small><span class="btn small ${S.cents>=u.c?'gold':'ghost'}">${money(u.c)}</span></button>`).join('')}</div></div></div>`);
 bindAll({home:()=>hub(),
  add(){const ex=Object.keys(S.owned).map(Number).filter(id=>S.owned[id]>1).sort((a,b)=>fair(byId(b))-fair(byId(a)));
   if(!ex.length){modal('<div class="big">📦</div><h2>No extra cards yet</h2><p>You can only sell <b>extra copies</b>, so you always keep one of each. Rip packs to get doubles!</p>',[['OK',null]]);return;}
   const m=modal(`<h2>Pick an extra card to sell</h2><div class="cgrid" style="max-height:55vh;overflow:auto">${ex.map(id=>`<button class="pickc" data-id="${id}">${cardHTML(byId(id))}<span class="cnt">×${S.owned[id]}</span></button>`).join('')}</div>`,[['Cancel',null,'ghost']]);
   m.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>{const id=+b.dataset.id;S.owned[id]--;S.stock.push({id,price:fair(byId(id))});save();m.remove();sfx.pop();myShop();});},
  up(i){const it=S.stock[+i],st=it.price<100?5:25,mx=fair(byId(it.id))*3;it.price=Math.min(mx,it.price+st);save();sfx.pop();myShop();},
  dn(i){const it=S.stock[+i],st=it.price<=100?5:25;it.price=Math.max(5,it.price-st);save();sfx.pop();myShop();},
  back(i){const it=S.stock.splice(+i,1)[0];S.owned[it.id]=(S.owned[it.id]||0)+1;save();sfx.flip();myShop();},
  open(){if(!S.stock.length){sfx.bad();toast('Put a card on the shelf first!');return;}cashier(true);},
  buy(k){const u=UPG.find(x=>x.k===k);if(S.cents<u.c){sfx.bad();toast('You need '+money(u.c-S.cents)+' more');return;}
   modal(`<div class="big">${u.e}</div><h2>Buy ${u.n}?</h2><p>${u.d}.<br>It costs <b>${money(u.c)}</b>. You will have ${money(S.cents-u.c)} left.</p>`,[['Buy it!',()=>{S.cents-=u.c;S.up[k]=true;save();sfx.win();confetti();FX.stamp('UPGRADE!','small','#ffd43b');myShop();}],['Not now',null,'ghost']]);}});}

