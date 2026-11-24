/* ---------- test hook ---------- */
window.__test={
 state:()=>({screen:SCREEN,cents:S.cents,stars:S.stars,owned:Object.keys(S.owned).length,turn:B&&B.turn,meHp:B&&B.me.hp,opHp:B&&B.op.hp,q:!!(B&&B.q),change:CJ&&CJ.pay-CJ.price}),
 give:c=>{S.cents+=c;save();},
 solve:()=>{{const bb=document.querySelector('.modal .bench');if(bb)return bb.click();}if(SCREEN==='insp'&&IJ){if(IJ.phase==='judge')return main.querySelector(IJ.F?'[data-a=fake]':'[data-a=real]').click();if(IJ.phase==='find'){const r=IJ.F.reg.find(x=>!IJ.found.includes(x)),g=region(IJ.F.card,r);return g==='edge'?inspTap(4,120):inspTap((g[0]+g[2])/2,(g[1]+g[3])/2);}if(IJ.phase==='done'){const b=$('ibtn').querySelector('button');return b&&b.click();}}{const sp=document.querySelector('.spot.ready');if(sp){sp.click();return;}}if(REV){REV.querySelector('.flip').click();return REV.querySelector('.row .btn').click();}if(SCREEN==='battle'&&B){if(B.q&&B.q.go)return B.q.go();if(B.turn==='me'&&!B.busy){if(!B.drew)return meDraw();const c=act('me');const i=[1,0].find(i=>c.atk[i].c<=B.me.en);if(i!==undefined)return meAttack(i);return endMyTurn();}}
  if(SCREEN==='cash'&&CJ){if($('give').disabled)return;let w=CJ.pay-CJ.price;$('change').innerHTML='';for(const [k,v] of CO)while(w>=v){addCoin(k);w-=v;}return giveChange();}
  if(SCREEN==='sort'&&SJ){const b=main.querySelector(`.sortc[data-v="${SJ.order[SJ.pos]}"]:not(.used)`);return b&&b.click();}
  if(REV){REV.querySelector('.flip').click();return REV.querySelector('.row .btn').click();}
  if(SCREEN==='master'){const b=[...main.querySelectorAll('[data-a="o"]')].find(x=>x.dataset.v===String(window.__mans));b&&b.click();}}};
