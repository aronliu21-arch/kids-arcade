/* ---------- binder ---------- */
function binder(){
 setScreen('binder',`<div class="hub"><div class="panel"><h2 class="h">📒 My binder ${zh([['收','ㄕㄡ'],['藏','ㄘㄤˊ'],['冊','ㄘㄜˋ']])} · ${Object.keys(S.owned).length}/${C.length}</h2>
 <div class="cgrid">${C.map(c=>S.owned[c.id]?`<button class="pickc" data-a="see" data-v="${c.id}">${cardHTML(c)}${S.owned[c.id]>1?`<span class="cnt">×${S.owned[c.id]}</span>`:''}</button>`:`<div class="ghostc" style="position:relative">${backSVG()}<span class="cnt" style="background:${c.r==='promo'?'#7048e8':'#868e96'}">${c.r==='promo'?'✦ prize':'#'+c.id}</span></div>`).join('')}</div></div>
 <div class="row"><button class="btn ghost" data-a="home">🏠 Home</button></div></div>`);
 bindAll({home:()=>hub(),see(id){const c=byId(+id);sfx.flip();modal(`<div style="width:min(260px,70vw);margin:0 auto">${cardHTML(c)}</div><p><b>${c.name}</b> · ${T[c.type].n} type · weak to ${T[WEAK[c.type]].i}</p>`,[['Close',null,'ghost']]);}});}

