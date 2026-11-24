/* ---------- battle ---------- */
let B=null;
function startBattle(team,p){B={kind:p.kind,round:p.round||0,foe:p.foe,me:{team,idx:0,hp:byId(team[0]).hp,en:1,hps:team.map(id=>byId(id).hp),ko:[]},op:{team:p.opp,idx:0,hp:byId(p.opp[0]).hp,en:1,hps:p.opp.map(id=>byId(id).hp),ko:[]},turn:'me',drew:false,busy:false,stars:0};PEND=null;
 setScreen('battle',`<div class="arena"><div class="side opp" id="sOpp"></div><div class="mid" id="mid"></div><div class="side me" id="sMe"></div><div class="ctrl" id="ctrl"></div></div>`);
 renderSide('op');renderSide('me');B.busy=true;renderCtrl();msg(`${B.foe[0]} wants to battle!`);vsIntro(()=>{cardEnter('me');setTimeout(()=>cardEnter('op'),250);B.busy=false;msg(`Your turn first. Draw an energy card ⚡`);say(B.foe[0]+' wants to battle! Draw an energy card.');renderCtrl();});}
const act=s=>byId(B[s].team[B[s].idx]);
function renderSide(s){const P=B[s],c=act(s),el=$(s==='me'?'sMe':'sOpp'),pct=P.hp/c.hp*100;if(!el||!c)return;
 const dots=P.team.map((id,i)=>`<span style="color:${P.ko[i]?'#868e96':T[byId(id).type].c}">${P.ko[i]?'✖':i===P.idx?'◉':'●'}</span>`).join('');
 el.innerHTML=`<div class="who">${s==='me'?`<div class="mini av me" style="width:38px;flex-basis:38px">${LUCAS}</div><span style="color:var(--lucas)">Lucas</span>`:`<div class="mini">${kidSVG(B.foe[1],B.foe[2])}</div><span style="color:var(--red)">${B.foe[0]}</span>`}<span class="dots">${dots}</span><span class="enb" id="en-${s}">⚡${P.en}</span></div>
 <div class="slot" id="slot-${s}">${cardHTML(c)}</div><div class="hp"><div class="bar"><i class="${pct<=25?'crit':pct<=50?'low':''}" style="width:${pct}%"></i></div><span>${P.hp}/${c.hp}</span></div>`;}
function setEn(s){const e=$('en-'+s);if(e&&B){e.textContent='⚡'+B[s].en;e.classList.remove('pulse');void e.offsetWidth;e.classList.add('pulse');}}
function msg(h){if(!$('mid'))return;$('mid').innerHTML='<div>'+h+'</div>';}
function renderCtrl(){if(!$('ctrl'))return;const c=act('me'),me=B.me,my=B.turn==='me'&&!B.busy;
 $('ctrl').innerHTML=`<div class="enpool">Your energy: ${me.en?'⚡'.repeat(me.en):'—'} (${me.en})</div>
 <button class="btn gold" data-a="draw" ${!my||B.drew?'disabled':''}>⚡ Draw energy</button>
 ${c.atk.map((a,i)=>`<button class="btn" data-a="atk" data-v="${i}" ${!my||me.en<a.c?'disabled':''}>${'⚡'.repeat(a.c)} ${a.n} · ${a.d}</button>`).join('')}
 ${benchAlive('me').length?`<button class="btn ghost" data-a="sw" ${!my||B.switched||me.en<retreatCost(c)?'disabled':''}>🔄 Switch ${'⚡'.repeat(retreatCost(c))}</button>`:''}
 <button class="btn ghost" data-a="end" ${!my||!B.drew?'disabled':''}>End turn</button>`;
 bindAll({draw:meDraw,atk:meAttack,sw:()=>doSwitch(false),end:()=>{if(B.turn!=='me')return;endMyTurn();}});}
function meDraw(){if(B.drew||B.turn!=='me'||B.busy)return;const w=abil(act('me'))&&abil(act('me')).k==='wind'?1:0,n=(Math.random()<.6?1:2)+w;B.me.en+=n;B.drew=true;sfx.energy();setEn('me');{const bt=main.querySelector('[data-a=draw]');if(bt){const [ex,ey]=ctr(bt);FX.emit(ex,ey,'spark',14+n*6,{speed:6});}}setTimeout(()=>{const ep=main.querySelector('.enpool');if(ep){ep.classList.add('pulse');const [px,py]=ctr(ep);FX.emit(px,py,'gold',10,{speed:4});}},60);msg(`You drew <b>+${n} energy</b>! ${'⚡'.repeat(n)}${w?' (Tailwind +1)':''}<br>Now attack, or end your turn to save energy.`);renderCtrl();}
function calc(att,def,a,bonus){bonus=bonus||0;const pa=abil(att),pd=abil(def),ab=pa&&pa.k==='plus'?10:0,plus=ab+bonus,shield=pd&&pd.k==='shield'?10:0,weak=WEAK[def.type]===att.type;
 const raw=a.d+plus,dmg=Math.max(0,raw*(weak?2:1)-shield);
 let parts=[`${a.n} does <b>${a.d}</b>.`];
 if(ab)parts.push(`${pa.n}: <b>+10</b>.`);if(bonus)parts.push(`Power-up: <b>+${bonus}</b>.`);if(weak)parts.push(`${def.name} is weak — <b>×2!</b>`);if(shield)parts.push(`${def.name}’s ${pd.n}: <b>−10</b>.`);
 let why=plus?(weak?`(${a.d} + ${plus}) × 2`:`${a.d} + ${plus}`):(weak?`${a.d} × 2`:`${a.d}`);if(shield)why+=' − 10';why+=' = '+dmg;
 const ops=[];if(plus)ops.push({a:a.d,op:'+',b:plus});if(weak)ops.push({a:raw,op:'+',b:raw});if(shield)ops.push({a:raw*(weak?2:1),op:'-',b:10});
 return {dmg,raw,weak,plus,shield,mods:plus||weak||shield,prompt:parts.join(' '),why,ops};}
function meAttack(i){const me=B.me,a=act('me').atk[+i],foe=act('op');if(B.turn!=='me'||B.busy||me.en<a.c)return;
 if(!B.drew){toast('Draw your energy first ⚡');sfx.bad();return;}
 B.busy=true;me.en-=a.c;renderCtrl();setEn('me');
 const go=bonus=>{if(SCREEN!=='battle')return;const K=calc(act('me'),foe,a,bonus),dmg=K.dmg,hp=B.op.hp,left=Math.max(0,hp-dmg);
 const q2=()=>ask(left===0?`${foe.name} has <b>${hp} HP</b>. Your attack does <b>${dmg}</b>.<br>HP can’t go below 0. How much HP is left?`:`${foe.name} has <b>${hp} HP</b>. ${hp} − ${dmg} = ?`,
   left,left===0?shuffle([0,10,Math.abs(dmg-hp)||20]):shuffle([left,hp+dmg>200?left+10:hp+dmg,left===10?20:left-10]),`${hp} − ${dmg} ${left===0?'is 0 or less, so it is 0. Knocked out!':'= '+left}`,()=>hit2('op',dmg,`${a.n}!`,{card:act('me'),atk:a,weak:K.weak}),left>0?[{a:hp,op:'-',b:dmg}]:[]);
 if(K.mods)ask(`${K.prompt}<br>How much damage?`,dmg,shuffle([dmg,a.d,dmg+10,Math.max(10,dmg-20)]).slice(0,3),K.why,q2,K.ops);
 else q2();};
 if(Math.random()<.4){const r=makeQ({noCards:true});B.pu=true;ask(`⚡ <b>Power-up question!</b> Right the first time = <b>+10 damage</b>!<br>${r.q}`,r.ans,r.opts,r.why,ft=>{qScore(ft);if(ft){FX.stamp('POWER UP!','small','#ffd43b');sfx.shimmer();}go(ft?10:0);},r.ops);}
 else go(0);}
function ask(h,ans,opts,why,then,ops){padClear();deskClose();ans=String(ans);opts=[...new Set(opts.map(String))];if(!opts.includes(ans))opts.push(ans);let tries=0,first=true;B.q={ans,go:null,ops:ops||[]};
 $('mid').innerHTML=`<div>${h}</div><div class="opts">${opts.map(o=>`<button class="btn" data-q="${o}">${o}</button>`).join('')}</div>${(ops&&ops.length)?'<button class="btn ghost small wio" onclick="deskOpen()">✏️ Work it out</button>':''}`;say(h.replace(/<[^>]+>/g,' ').replace(/▢/g,'blank').replace(/−/g,'minus').replace(/×/g,'times'));
 const pu=!!B.pu;B.pu=false;const fin=()=>{B.q=null;const ft=first;if(!pu)track('damage',ft,ft?'':h,ans);setTimeout(()=>then(ft),900);};
 B.q.go=()=>{const b=$('mid').querySelector(`[data-q="${ans}"]`);b&&b.click();};
 $('mid').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{if(tries<0)return;if(b.dataset.q===ans){first=tries===0;B.stars+=tries?1:2;S.stars+=tries?1:2;save();sfx.good();b.classList.add('green');tries=-1;fin();}
  else{sfx.bad();b.disabled=true;first=false;if(++tries>=2){tries=-1;$('mid').querySelector(`[data-q="${ans}"]`).classList.add('green');$('mid').insertAdjacentHTML('beforeend',`<div>👉 ${why}</div>`);say(why.replace('−','minus').replace('×','times'));setTimeout(fin,1800);}}});}
function floatDmg(el,t){const r=el.getBoundingClientRect(),d=document.createElement('div');d.className='dmg';d.textContent=t;d.style.left=(r.left+r.width/2-40)+'px';d.style.top=(r.top+r.height/3)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1200);}
function hit2(target,dmg,label,info){const atkSide=target==='op'?'me':'op',P=B[target],as=$('slot-'+atkSide),ts=$('slot-'+target);
 const card=(info&&info.card)||act(atkSide),atk=(info&&info.atk)||card.atk[0],style=moveStyle(atk.n),big=atk.c>=3,tc=T[card.type].c;
 FX.stamp(atk.n+'!','small',tc);moveSound(atk,card.type,style);if(!['charge','leap','quake'].includes(style)){as.classList.add('lunge');setTimeout(()=>as.classList.remove('lunge'),420);}
 setTimeout(()=>moveFX(style,card.type,big,hashS(atk.n),as,ts,()=>{if(SCREEN!=='battle')return;
  const [x,y]=ctr(ts);sfx.hit();FX.emit(x,y,card.type,big?44:26,{speed:big?9:6,size:big?5:4});FX.ring(x,y,'#fff',big?130:85);
  ts.classList.remove('shake','hitflash');void ts.offsetWidth;ts.classList.add('shake','hitflash');
  if(big||(info&&info.weak))FX.quake();if(big)FX.flash(tc+'66');
  floatDmg(ts,'-'+dmg);if(info&&info.weak)setTimeout(()=>FX.stamp('SUPER ×2!','small','#ff6b6b'),300);
  P.hp=Math.max(0,P.hp-dmg);setTimeout(()=>renderSide(target),350);msg(`${label} <b>${dmg} damage!</b>`);
  setTimeout(()=>{if(SCREEN!=='battle')return;if(P.hp===0){const k=$('slot-'+target),kc=act(target),[kx,ky]=ctr(k);sfx.ko();boom();FX.emit(kx,ky,kc.type,60,{speed:10,size:5});FX.emit(kx,ky,'gold',24,{speed:7});FX.ring(kx,ky,'#ffd43b',150,7);FX.flash('#fff');FX.stamp('KO!');
    k.classList.add('ko');msg(`${kc.name} is knocked out! 💫`);
    setTimeout(()=>{P.ko[P.idx]=true;P.hps[P.idx]=0;const alive=benchAlive(target);if(!alive.length)return endBattle(target==='op');
     const bring=nx=>{P.idx=nx;P.hp=P.hps[nx];renderSide(target);cardEnter(target);msg(`${target==='op'?B.foe[0]+' sends out':'Go,'} <b>${act(target).name}</b>!`);setTimeout(()=>target==='op'?endMyTurn():startMyTurn(),1200);};
     if(target==='me'&&alive.length>1)chooseBench('Your card was knocked out! Who goes next?',bring);else bring(target==='op'?oppPick():alive[0]);},1300);}
   else{target==='op'?endMyTurn():startMyTurn();}},1000);}),450);}
function cardEnter(s){const sl=$('slot-'+s);if(!sl)return;sl.classList.add('enter');whoosh();setTimeout(()=>{const [x,y]=ctr(sl);FX.ring(x,y,s==='me'?'#4dabf7':'#ff6b6b',90);FX.emit(x,y+50,'rock',8,{dir:-Math.PI/2,spread:2.4,speed:4,life:22,size:3});tone(120,.15,'square',.1);},500);}
function vsIntro(then){if(RM){then();return;}const me=act('me'),op=act('op'),v=document.createElement('div');v.className='vs';
 v.innerHTML=`<div class="l"><div class="av me">${LUCAS}</div>Lucas<div style="width:clamp(90px,22vh,170px)">${cardHTML(me)}</div></div><div class="r"><div class="av">${kidSVG(B.foe[1],B.foe[2])}</div>${B.foe[0]}<div style="width:clamp(90px,22vh,170px)">${cardHTML(op)}</div></div><b>VS</b>`;
 document.body.appendChild(v);whoosh();setTimeout(()=>{boom();FX.quake();FX.flash('#fff');},500);
 let done=false;const end=()=>{if(done)return;done=true;v.classList.add('out');setTimeout(()=>{v.remove();then();},330);};v.onclick=end;setTimeout(end,2200);}
function banner(won,then){const d=document.createElement('div');d.className='banner'+(won?'':' lose');d.innerHTML=`<div class="rays"></div><h1>${won?'VICTORY!':'GOOD BATTLE!'}</h1>`;document.body.appendChild(d);
 if(won){sfx.win();confetti();setTimeout(confetti,400);fanfare();}else{[392,330,262].forEach((f,i)=>tone(f,.3,'triangle',.1,i*.2));}
 setTimeout(()=>{d.classList.add('out');setTimeout(()=>{d.remove();then();},480);},won?2000:1500);}
function endMyTurn(){if(SCREEN!=='battle')return;B.turn='op';B.busy=true;renderCtrl();setTimeout(oppTurn,700);}
function oppTurn(){if(SCREEN!=='battle')return;const op=B.op,c=act('op'),mine=act('me'),oa=abil(c);op.en+=1+(oa&&oa.k==='wind'?1:0);sfx.energy();setEn('op');{const e=$('en-op');if(e){const [x,y]=ctr(e);FX.emit(x,y,'spark',10,{speed:4});}}if(oa&&oa.k==='heal'&&op.hp<c.hp){op.hp=Math.min(c.hp,op.hp+10);renderSide('op');{const [hx,hy]=ctr($('slot-op'));FX.emit(hx,hy,'heal',18,{dir:-Math.PI/2,spread:1.4,speed:3});}toast('🌿 '+c.name+' used Regrow: +10 HP');}
 const can=c.atk.filter(a=>a.c<=op.en).sort((x,y)=>y.d-x.d)[0];
 if(!can){msg(`${B.foe[0]} draws energy and waits… ⚡ (${op.en})`);setTimeout(startMyTurn,1300);return;}
 op.en-=can.c;setEn('op');const K=calc(c,mine,can);
 msg(`${c.name} uses <b>${can.n}</b>!${K.mods?'<br>'+K.why.replace(/^/,''):''}`);setTimeout(()=>hit2('me',K.dmg,`${c.name} used ${can.n}!`,{card:c,atk:can,weak:K.weak}),900);}
function startMyTurn(){if(SCREEN!=='battle')return;B.turn='me';B.drew=false;B.busy=false;B.switched=false;const c=act('me'),ma=abil(c);let h='';if(ma&&ma.k==='heal'&&B.me.hp<c.hp){B.me.hp=Math.min(c.hp,B.me.hp+10);renderSide('me');{const [hx,hy]=ctr($('slot-me'));FX.emit(hx,hy,'heal',18,{dir:-Math.PI/2,spread:1.4,speed:3});}h='🌿 Regrow healed 10 HP! ';sfx.good();}msg(h+`Your turn! Draw an energy card ⚡`);renderCtrl();}
function endBattle(won){if(SCREEN!=='battle')return;B.busy=true;banner(won,()=>endBattle2(won));}
function endBattle2(won){const st=B.stars;if(won){S.wins=(S.wins||0)+1;save();}
 if(B.kind==='friendly'){if(won){S.cents+=150;sfx.win();confetti();}else{S.cents+=25;sfx.bad();}save();restock();
  return result('battle',won?'🏆 You won!':'Good battle!',`<div class="big">${won?'🥇':'🤝'}</div><p style="font-size:1.2rem;font-weight:800">${won?'You won $1.50!':B.foe[0]+' won this time. You still get 25¢ for a good try.'}</p><p>⭐ ${st} stars from your math</p>`,'In the real game, check the weakness before you attack. ×2 can win the match!');}
 if(B.kind==='rival')return rivalAfter(won);
 tourAfter(won);}


/* ---------- bench + switching ---------- */
const retreatCost=c=>c.hp<=70?1:c.hp<=100?2:3;
function benchAlive(s){const P=B[s];return P.team.map((_,i)=>i).filter(i=>i!==P.idx&&!P.ko[i]);}
function oppPick(){const P=B.op,mine=act('me'),al=benchAlive('op');return al.find(i=>WEAK[mine.type]===byId(P.team[i]).type)??al[0];}
function chooseBench(title,cb){const P=B.me,foe=act('op'),al=benchAlive('me');
 const m=modal(`<h2>${title}</h2><div class="row">${al.map(i=>{const c=byId(P.team[i]),x2=WEAK[foe.type]===c.type,risky=WEAK[c.type]===foe.type;return `<button class="pickc bench" data-i="${i}" style="width:clamp(100px,26vw,150px)">${cardHTML(c)}<span class="bhp">❤️ ${P.hps[i]}/${c.hp}</span>${x2?'<span class="x2tag">×2 vs '+foe.name+'</span>':risky?'<span class="x2tag" style="background:#e03131">Weak to '+foe.name+'</span>':''}</button>`;}).join('')}</div>`,[]);
 m.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{m.remove();sfx.pop();cb(+b.dataset.i);});}
function doSwitch(){const me=B.me,c=act('me'),cost=retreatCost(c);if(B.turn!=='me'||B.busy||B.switched||me.en<cost||!benchAlive('me').length)return;
 const m=chooseBench(`Switch ${c.name} out for ${'⚡'.repeat(cost)}?`,i=>{me.en-=cost;me.hps[me.idx]=me.hp;const old=c.name;me.idx=i;me.hp=me.hps[i];B.switched=true;setEn('me');renderSide('me');cardEnter('me');renderCtrl();msg(`Come back, ${old}! Go, <b>${act('me').name}</b>!`);});
 const mm=document.querySelector('.modal:last-of-type .row:last-child');if(mm){const x=document.createElement('button');x.className='btn ghost';x.textContent='Cancel';x.onclick=()=>x.closest('.modal').remove();mm.appendChild(x);}}
