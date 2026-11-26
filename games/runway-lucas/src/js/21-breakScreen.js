function breakScreen(){LROW=0;const s=cScreen('<div class="lbreak"><div style="font-size:4rem">🌸</div><h2>Great practice, Lucas! Time for a break</h2><p>Stretch, drink some water, and come back later.</p><div class="row"><button class="btn pink" id="fin">Finish for now</button></div></div>',true);
  s.querySelector('#fin').onclick=()=>{cClose();MODE='solo';showModes();};}

window.__test=Object.assign(window.__test||{},{career:()=>({money:C&&C.money,stars:C&&C.stars,lv:C&&lvOf(C.stars),badges:C&&totalBadges(),learn:C&&C.learn}),
  learn:k=>learnJob(k),hint:()=>LQ&&LQ.hint&&LQ.hint(),allHints:()=>LKEYS.map(k=>LBANK[k].map(q=>{const h=hintFor(k,q);return h?null:k+':'+q[0];})).flat().filter(Boolean),lq:()=>LQ&&{k:LQ.k,id:LQ.q&&LQ.q[0],done:!!LQ.done},solve:()=>LQ&&LQ.solve&&LQ.solve(),banks:()=>Object.fromEntries(LKEYS.map(k=>[k,LBANK[k].length]))});

