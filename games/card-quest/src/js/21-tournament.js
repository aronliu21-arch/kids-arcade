/* ---------- tournament ---------- */
let TR=null;
const RNAMES=['Round 1','Semi-final','Final'];
function tourStart(){if(Object.keys(S.owned).length<3){toast('You need 3 cards');return;}
 setScreen('tour',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🏆 Card Quest Cup ${zh([['錦','ㄐㄧㄣˇ'],['標','ㄅㄧㄠ'],['賽','ㄙㄞˋ']])}</h2>
 <p style="font-weight:700">Win 3 battles in a row to be champion!<br>Entry costs <b>$1.00</b>. You have ${money(S.cents)}.</p>
 <div class="brk">${RNAMES.map(r=>`<div>${r}</div>`).join('')}<div>🏆</div></div>
 <div class="tip" style="text-align:left">🏆 Champion: <b>$5.00</b> + a trophy + an exclusive <b>✦ Prize card</b> or Legend (you can’t buy these!)<br>🥈 Lose the final: <b>$1.50</b> + a <b>Holo or Legend</b> card</div>
 <div class="row"><button class="btn gold" data-a="go">Pay $1.00 and enter ▶</button><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({home:()=>hub(),go(){if(S.cents<100){sfx.bad();toast('You need $1.00. Try a job! 🧾');return;}S.cents-=100;save();sfx.coin();TR={round:0};tourBracket();}});}
function tourBracket(note){setScreen('tour',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🏆 Card Quest Cup</h2>${note||''}
 <div class="brk">${RNAMES.map((r,i)=>`<div class="${i<TR.round?'done':i===TR.round?'now':''}">${i<TR.round?'✅ ':''}${r}</div>`).join('')}<div>🏆</div></div>
 <p style="font-weight:700">Next: <b>${RNAMES[TR.round]}</b>. ${TR.round===2?'The best player is waiting!':'Pick a strong team.'}</p>
 <div class="row"><button class="btn gold" data-a="go">Pick my team ▶</button></div></div></div>`);
 bindAll({go:()=>teamPick('tour',TR.round)});}
function tourAfter(won){
 if(won&&TR.round<2){TR.round++;sfx.win();return tourBracket('<div class="big">✅</div><p style="font-weight:800">You won! On to the next round.</p>');}
 let c=null,head,body;
 if(won){S.cents+=500;S.trophies++;c=prizeCard([['promo',6],['legend',4]]);head='🏆 CHAMPION!';sfx.win();}
 else if(TR.round===2){S.cents+=150;c=prizeCard([['holo',8],['legend',2]]);head='🥈 Runner-up!';sfx.good();}
 else{head='Out in '+RNAMES[TR.round];sfx.bad();}
 save();restock();
 const show=()=>result('tour',head,`${c?`<p style="font-weight:800">Prize card${won?' and $5.00':' and $1.50'}:</p><div style="width:min(200px,55vw);margin:0 auto">${cardHTML(c)}</div><p><b>${c.name}</b> · ${R[c.r].n}</p>`:`<div class="big">💪</div><p style="font-weight:800">Practice with friendly battles and try again!</p>`}`,
  'At a real tournament, shake hands and say “good game” whether you win or lose.');
 TR=null;if(c)bigReveal(c,won?'🏆 Champion prize!':'🥈 Runner-up prize!',won?'The Card Quest Cup winner gets an exclusive card!':'Great final! Here is your prize.',show);else show();}

