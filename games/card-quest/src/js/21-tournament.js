/* ---------- tournament ---------- */
let TR=null;
const RNAMES=['Round 1','Semi-final','Final'];
function tourBracket(note){setScreen('tour',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">${(cupBy(TR.cup)||CUPS[0]).e} ${(cupBy(TR.cup)||CUPS[0]).n}</h2>${note||''}
 <div class="brk">${RNAMES.map((r,i)=>`<div class="${i<TR.round?'done':i===TR.round?'now':''}">${i<TR.round?'✅ ':''}${r}</div>`).join('')}<div>🏆</div></div>
 <p style="font-weight:700">Next: <b>${RNAMES[TR.round]}</b>. ${TR.round===2?'The best player is waiting!':'Pick a strong team.'}</p>
 <div class="row"><button class="btn gold" data-a="go">Pick my team ▶</button></div></div></div>`);
 bindAll({go:()=>teamPick('tour',TR.round)});}
function tourAfter(won){
 if(won&&TR.round<2){TR.round++;sfx.win();return tourBracket('<div class="big">✅</div><p style="font-weight:800">You won! On to the next round.</p>');}
 let c=null,head,body;
 if(won){S.cents+=500;S.trophies++;S.cupWins=S.cupWins||{};S.cupWins[TR.cup||'open']=(S.cupWins[TR.cup||'open']||0)+1;c=prizeCard([['promo',6],['legend',4]]);head='🏆 CHAMPION!';sfx.win();}
 else if(TR.round===2){S.cents+=150;c=prizeCard([['holo',8],['legend',2]]);head='🥈 Runner-up!';sfx.good();}
 else{head='Out in '+RNAMES[TR.round];sfx.bad();}
 S.cupOffer=null;save();restock();
 const show=()=>result('tour',head,`${c?`<p style="font-weight:800">Prize card${won?' and $5.00':' and $1.50'}:</p><div style="width:min(200px,55vw);margin:0 auto">${cardHTML(c)}</div><p><b>${c.name}</b> · ${R[c.r].n}</p>`:`<div class="big">💪</div><p style="font-weight:800">Practice with friendly battles and try again!</p>`}`,
  'At a real tournament, shake hands and say “good game” whether you win or lose.');
 const cupN=(cupBy(TR.cup)||CUPS[0]).n;TR=null;if(c)bigReveal(c,won?'🏆 Champion prize!':'🥈 Runner-up prize!',won?'The '+cupN+' winner gets an exclusive card!':'Great final! Here is your prize.',show);else show();}

