/* ---------- awesome reveal for prize and surprise cards ---------- */
function prizeCard(w){const r=rollR(w),pool=ofR(r),fresh=pool.filter(c=>!S.owned[c.id]);return pick(fresh.length?fresh:pool);}
function fanfare(){[523,659,784,1047].forEach((f,i)=>tone(f,.25,'square',.06,i*.09));[1047,1319,1568].forEach(f=>tone(f,1.2,'triangle',.08,.45));tone(131,1.2,'sawtooth',.06,.45);}
let REV=null;
function bigReveal(c,head,from,then){const r=document.createElement('div');r.className='reveal';
 if(c.r==='promo')r.style.setProperty('--rc','rgba(177,151,252,.45)');
 const isNew=!S.owned[c.id];S.owned[c.id]=(S.owned[c.id]||0)+1;save();
 r.innerHTML=`<div class="burst"></div><h2>${head}</h2><p style="font-weight:800;margin:0">${from}</p><button class="flip charge"><div class="in"><div>${backSVG()}</div><div class="front">${cardHTML(c)}</div></div></button>
 <p class="name">${c.r==='promo'?'✦ ':c.r==='legend'?'🌟 ':'✨ '}${c.name} · ${R[c.r].n}${isNew?' · <span style="color:#69db7c">NEW!</span>':''}</p><p class="name" style="font-size:1rem;margin:0">HP ${c.hp} · ${c.atk[1].n} does ${c.atk[1].d}!</p><div class="row"><button class="btn gold">Add to my binder ▶</button></div>`;
 document.body.appendChild(r);REV=r;tone(220,1.2,'sawtooth',.04);tone(330,1.2,'sawtooth',.03,.3);
 const f=r.querySelector('.flip');let opened=false;
 const open=()=>{if(opened)return;opened=true;f.classList.remove('charge');f.classList.add('open');r.classList.add('on');fanfare();setTimeout(sfx.shimmer,500);confetti();setTimeout(confetti,500);
  setTimeout(()=>{r.classList.add('shown');shout('You got '+c.name+'! '+R[c.r].n+' card!');},700);};
 const t=setTimeout(open,matchMedia('(prefers-reduced-motion:reduce)').matches?100:1400);f.onclick=()=>{clearTimeout(t);open();};
 r.querySelector('.row .btn').onclick=()=>{r.remove();REV=null;then&&then();};}

