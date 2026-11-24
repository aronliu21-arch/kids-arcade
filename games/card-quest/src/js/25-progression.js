/* ---------- Cups (tournament rules), Rival Road (story), Evolve ---------- */
const CUPS=[{k:'open',e:'🏆',n:'Open Cup',d:'Any cards you like',ok:()=>true},
 {k:'rookie',e:'🌱',n:'Rookie Cup',d:'Common cards only',ok:c=>c.r==='common'},
 {k:'small',e:'🐜',n:'Small Team Cup',d:'Your 3 cards’ HP must add up to 200 or less',ok:()=>true,team:t=>t.reduce((a,id)=>a+byId(id).hp,0)<=200},
 {k:'noboss',e:'🚫',n:'No-Boss Cup',d:'No Legend or Prize cards',ok:c=>c.r!=='legend'&&c.r!=='promo'},
 {k:'dragon',e:'🐉',n:'Dragon Kingdom Cup',d:'Dragon Kingdom cards only',ok:c=>c.set===2},
 ...Object.keys(T).map(t=>({k:t,e:T[t].i,n:T[t].n+' Cup',d:`${T[t].n} cards only`,ok:c=>c.type===t}))];
const cupBy=k=>CUPS.find(c=>c.k===k);
function cupCanEnter(cup){const mine=Object.keys(S.owned).map(Number).map(byId).filter(cup.ok);if(mine.length<3)return false;
 if(cup.team){const hs=mine.map(c=>c.hp).sort((a,b)=>a-b);return hs[0]+hs[1]+hs[2]<=200;}return true;}
function cupOffer(){if(!S.cupOffer||S.cupOffer.some(k=>!cupBy(k))){const others=shuffle(CUPS.slice(1).map(c=>c.k)).filter(k=>cupCanEnter(cupBy(k))).slice(0,2);S.cupOffer=['open',...others];save();}return S.cupOffer;}
function tourStart(){if(Object.keys(S.owned).length<3){toast('You need 3 cards');return;}const offer=cupOffer();S.cupWins=S.cupWins||{};
 setScreen('tour',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🏆 Card Quest Stadium ${zh([['錦','ㄐㄧㄣˇ'],['標','ㄅㄧㄠ'],['賽','ㄙㄞˋ']])}</h2>
 <p style="font-weight:700">Today’s cups. Pick one! Win 3 battles in a row to be champion.<br>Entry <b>$1.00</b> · you have ${money(S.cents)}</p>
 <div class="cups">${offer.map(k=>{const c=cupBy(k),can=cupCanEnter(c);return `<button class="cupb ${can?'':'off'}" data-a="cup" data-v="${k}"><span class="e">${c.e}</span><b>${c.n}</b><small>${c.d}</small>${S.cupWins[k]?`<span class="won">🏅 won ×${S.cupWins[k]}</span>`:''}${can?'':'<small style="color:#e03131">You need more cards for this one</small>'}</button>`;}).join('')}</div>
 <div class="tip" style="text-align:left">🏆 Champion: <b>$5.00</b> + a title + an exclusive <b>✦ Prize card</b> or Legend<br>🥈 Lose the final: <b>$1.50</b> + a Holo or Legend card<br>🔄 New cups appear after every tournament.</div>
 <div class="row"><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({home:()=>hub(),cup(k){const c=cupBy(k);if(!cupCanEnter(c)){sfx.bad();toast('You need 3 cards that follow the rule!');return;}if(S.cents<100){sfx.bad();toast('You need $1.00. Try a job! 🧾');return;}
  modal(`<div class="big">${c.e}</div><h2>${c.n}</h2><p><b>Rule:</b> ${c.d}.<br>Pay $1.00 to enter?</p>`,[['Enter! ▶',()=>{S.cents-=100;save();sfx.coin();TR={round:0,cup:k};tourBracket();}],['Not now',null,'ghost']]);}});}
/* Rival Road: six rivals with their own decks, beaten in order */
const RIVALS=[{n:'Sprout Sam',f:['#5c940d','#ffdbac'],deck:[4,27,74],e:'🌱',say:'My leafy team grows stronger every day!',cash:100},
 {n:'Splash Kai',f:['#1c7ed6','#c68642'],deck:[3,77,34],e:'💧',say:'Water beats fire. Just saying!',cash:150},
 {n:'Blaze Leo',f:['#e03131','#f1c27d'],deck:[24,73,10],e:'🔥',say:'Feel the heat of my fire deck!',cash:200},
 {n:'Rocky Ben',f:['#5c5f66','#ffdbac'],deck:[99,49,15],e:'🪨',say:'My rock cards never back down.',cash:250},
 {n:'Storm Ryan',f:['#7048e8','#ffe0bd'],deck:[104,62,16],e:'🌪️',say:'Lightning and wind. Good luck!',cash:300},
 {n:'Champion Max',f:['#ffd43b','#e0ac69'],deck:[114,13,108],e:'👑',say:'I am the Champion. Show me your best!',cash:500}];
function arenaMenu(){modal(`<div class="big">⚔️</div><h2>Battle Arena ${zh([['對','ㄉㄨㄟˋ'],['戰','ㄓㄢˋ']])}</h2><p>Practice against a kid, or take on the Rival Road!</p>`,[['🤝 Friendly battle',()=>teamPick('friendly')],['🛣️ Rival Road',rivalRoad,'gold']]);}
function rivalRoad(){const st=S.rivalStage||0;
 setScreen('rival',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🛣️ Rival Road ${zh([['對','ㄉㄨㄟˋ'],['手','ㄕㄡˇ'],['之','ㄓ'],['路','ㄌㄨˋ']])}</h2><p style="font-weight:700">Beat each rival to win their badge. The Champion waits at the end!</p>
 <div class="road">${RIVALS.map((r,i)=>`<button class="rv ${i<st?'done':i===st?'now':'lock'}" data-a="rv" data-v="${i}"><div class="rva">${kidSVG(r.f[0],r.f[1])}</div><div class="rvt"><b>${i+1}. ${r.n}</b><small>${i<st?'Badge won! '+r.e:i===st?'Tap to battle!':'🔒 Beat '+RIVALS[i-1].n+' first'}</small><span>${r.deck.map(id=>T[byId(id).type].i).join(' ')}</span></div><span class="badge2">${i<st?r.e:i===st?'⚔️':'🔒'}</span></button>`).join('')}</div>
 <div class="row"><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({home:()=>hub(),rv(v){v=+v;if(v>st){sfx.bad();toast('🔒 Beat '+RIVALS[v-1].n+' first!');return;}const r=RIVALS[v];
  modal(`<div style="width:100px;margin:0 auto">${kidSVG(r.f[0],r.f[1])}</div><h2>${r.n}</h2><p style="font-size:1.1rem">“${r.say}”</p><div class="row">${r.deck.map(id=>`<div style="width:90px">${cardHTML(byId(id))}</div>`).join('')}</div><p>Win: <b>${money(r.cash)}</b> + a card from this deck${v<st?' (rematch: half money)':''}</p>`,
   [['⚔️ Battle!',()=>{PEND={kind:'rival',round:v,foe:[r.n,r.f[0],r.f[1]],opp:r.deck.slice(),sel:[]};teamPick('rival',v);}],['Not yet',null,'ghost']]);}});}
function rivalAfter(won){const v=B.round,r=RIVALS[v],first=v===(S.rivalStage||0);
 if(!won){save();return result('rival','Good battle!',`<div class="big">💪</div><p style="font-weight:800">${r.n}: “Come back when you’re stronger!”</p><p>Tip: look at the ×2 tags and use 🔄 Switch.</p>`,'Real players learn the most from the games they lose.');}
 const cash=first?r.cash:Math.round(r.cash/2);S.cents+=cash;if(first){S.rivalStage=v+1;S.badges=(S.badges||[]).concat(r.e);}const prize=pick(r.deck.map(byId));save();
 const show=()=>result('rival',first?`${r.e} Badge won!`:'🏆 You won the rematch!',`<p style="font-size:1.2rem;font-weight:800">${r.n}: “Wow, you’re good!”</p><p>+${money(cash)}${first&&v<5?` · Next rival: <b>${RIVALS[v+1].n}</b>`:''}</p>${first&&v===5?'<p style="font-weight:900;color:#d9480f">👑 You beat the Champion! You are the new Card Quest Champion!</p>':''}`,'Good players say “thanks for the battle” to their rivals.');
 bigReveal(prize,`${r.e} ${r.n}’s card!`,'Your rival gives you a card from their deck!',show);}
/* Evolve: trade 3 copies for the evolved card */
const evoTo=id=>C.find(c=>EVO[c.id]===id);
function evolveInfo(c){const to=evoTo(c.id);if(!to)return '';const n=S.owned[c.id]||0;
 return `<div class="evo"><b>✨ Evolves into ${to.name}</b> ${S.owned[to.id]?'':'<span class="newtag" style="position:static">NEW</span>'}<div class="evbar">${[0,1,2].map(i=>`<span class="${i<n?'on':''}"></span>`).join('')}</div><small>Trade 3 copies of ${c.name}. You have ${n}.</small>${n>=3?`<button class="btn gold" id="evob">✨ Evolve!</button>`:''}</div>`;}
function evolveGo(c){const to=evoTo(c.id);if(!to||(S.owned[c.id]||0)<3)return;S.owned[c.id]-=3;if(S.owned[c.id]<=0)delete S.owned[c.id];save();
 const d=document.createElement('div');d.className='evolve';d.innerHTML=`<div class="burst"></div><h2>✨ ${c.name} is evolving! ✨</h2><div class="evring">${[0,1,2].map(i=>`<div class="evc" style="--i:${i}">${cardHTML(c)}</div>`).join('')}</div>`;document.body.appendChild(d);
 riser(2200);let t=0;const sp=setInterval(()=>{t++;const [x,y]=[innerWidth/2,innerHeight/2];FX.emit(x,y,c.type,6,{speed:6,size:4});if(t%4===0)tone(400+t*30,.1,'triangle',.06);},90);
 setTimeout(()=>{clearInterval(sp);FX.flash('#fff');boom();d.remove();bigReveal(to,'✨ Evolution!',`${c.name} evolved into ${to.name}!`,()=>binder());},RM?100:2400);}
