/* ---------- team pick ---------- */
let PEND=null;
/* opponents are matched to Lucas's own best 3 cards, so battles stay fair as his collection grows */
const pw=c=>c.hp+c.atk[1].d+(c.r!=='common'?15:0);
function oppTeam(kind,round){const mine=Object.keys(S.owned).map(Number).map(byId),myP=mine.map(pw).sort((a,b)=>b-a).slice(0,3).reduce((a,b)=>a+b,0);
 const ratio=kind==='friendly'?1:[.95,1.05,1.15][round],tgt=myP*ratio,pool=C.filter(c=>c.r!=='promo'||(kind==='tour'&&round===2&&tgt>800));let best=null;
 for(let i=0;i<60;i++){const t=shuffle(pool).slice(0,3),d=Math.abs(t.reduce((a,c)=>a+pw(c),0)-tgt);if(!best||d<best[0])best=[d,t];}
 return best[1].map(c=>c.id);}
function teamPick(kind,round){
 const foe=PEND&&PEND.kind===kind&&PEND.round===round?PEND.foe:pick(FOES);const opp=PEND&&PEND.kind===kind&&PEND.round===round?PEND.opp:oppTeam(kind,round||0);
 const keep=(PEND&&PEND.kind===kind&&PEND.round===round&&PEND.sel)||[];PEND={kind,round,foe,opp,sel:keep};
 const mode=S.pickSort||'power',mine=Object.keys(S.owned).map(Number).sort((a,b)=>mode==='power'?pw(byId(b))-pw(byId(a))||a-b:a-b),need=Math.min(3,mine.length);let sel=(PEND.sel||[]).filter(x=>mine.includes(x));
 const beats=c=>opp.filter(i=>WEAK[byId(i).type]===c.type).map(i=>byId(i));
 setScreen('pick',`<div class="hub"><div class="panel"><div class="who" style="justify-content:center"><div class="mini">${kidSVG(foe[1],foe[2])}</div><span>${foe[0]}’s team: ${opp.map(i=>{const t=T[byId(i).type];return `<span title="${t.n}" style="font-size:1.6rem">${t.i}</span>`;}).join(' ')}</span></div>
 <p style="text-align:center;font-weight:700;margin:6px 0">Pick <b>${need}</b> cards for your team. Tip: check what ${foe[0]}’s cards are weak to!</p>
 <div class="row" style="font-weight:800">${opp.map(i=>{const c=byId(i);return `<span>${T[c.type].i} is weak to ${T[WEAK[c.type]].i}</span>`;}).join(' · ')}</div></div>
 <div class="row" style="margin:4px 0"><span style="font-weight:800">Sort:</span><button class="btn small ${mode==='power'?'gold':'ghost'}" data-a="srt" data-v="power">💪 Strongest first</button><button class="btn small ${mode==='num'?'gold':'ghost'}" data-a="srt" data-v="num">🔢 Card number</button></div>
 <div class="cgrid">${mine.map(id=>{const c=byId(id),bt=beats(c);return `<button class="pickc ${sel.includes(id)?'sel':''}" data-a="p" data-v="${id}">${cardHTML(c)}${bt.length?`<span class="x2tag">×2 vs ${bt.map(x=>T[x.type].i).join('')}</span>`:''}</button>`;}).join('')}</div>
 <div class="row" style="position:sticky;bottom:0;padding:6px;background:var(--bg)"><button class="btn gold" id="fight" disabled>⚔️ Battle! (<span id="pc">0</span>/${need})</button><button class="btn ghost" data-a="home">🏠 Home</button></div></div>`);
 bindAll({srt(v){S.pickSort=v;save();PEND.sel=sel;teamPick(kind,round);},home:()=>{PEND=null;hub();},p(id,b){id=+id;if(sel.includes(id)){sel=sel.filter(x=>x!==id);b.classList.remove('sel');}else{if(sel.length>=need){sfx.bad();toast('Only '+need+' cards!');return;}sel.push(id);b.classList.add('sel');}sfx.pop();$('pc').textContent=sel.length;$('fight').disabled=sel.length!==need;}});
 $('pc').textContent=sel.length;$('fight').disabled=sel.length!==need;
 $('fight').onclick=()=>{audio();startBattle(sel,PEND);};}

