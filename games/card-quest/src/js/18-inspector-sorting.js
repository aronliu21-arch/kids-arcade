/* ---------- Inspector job: real or fake? ---------- */
function misspell(w){const vow='aeiou';for(let i=0;i<30;i++){const a=[...w],k=ri(1,a.length-2),op=ri(0,3);let r;
 if(op===0)[a[k],a[k+1]]=[a[k+1],a[k]];else if(op===1)a.splice(k,1);else if(op===2)a.splice(k,0,a[k]);
 else{if(vow.includes(a[k].toLowerCase()))a[k]=pick([...vow].filter(v=>v!==a[k].toLowerCase()));else continue;}
 r=a.join('');if(r!==w&&r.toLowerCase()!==w.toLowerCase())return r;}return w.slice(0,-1);}
const FAULTS={1:['spell','type','frame'],2:['spell','type','frame','hp','num','deal'],3:['spell','type','frame','hp','num','deal','art','double']};
const isBoss=c=>c.r==='legend'||c.r==='promo';
function region(c,f){const ab=abil(c),boss=isBoss(c),base=(ab?126:134)+(ab?34:0)+(boss?14:0),ay=i=>base+12+i*(ab?24:30);
 return {name:[6,6,116,34],hp:[110,10,154,34],type:[150,8,178,34],num:boss?[6,232,62,246]:[6,230,74,248],art:boss?[6,34,174,138]:[6,34,174,128],
  atk0:[12,ay(0)-12,170,ay(0)+5],atk1:[12,ay(1)-12,170,ay(1)+5],frame:'edge'}[f];}
function makeFake(c,kind){const f={...c,atk:c.atk.map(a=>({...a})),pal:c.pal.slice()},why=[],reg=[];
 const one=k=>{if(k==='spell'){if(Math.random()<.5){const w=misspell(c.name);f.name=w;why.push(`The name is spelled wrong: “${w}” should be “${c.name}”.`);reg.push('name');}
   else{const i=ri(0,1),words=c.atk[i].n.split(' '),j=ri(0,words.length-1),w=misspell(words[j]);words[j]=w;f.atk[i].n=words.join(' ');why.push(`The attack is spelled wrong: “${f.atk[i].n}” should be “${c.atk[i].n}”.`);reg.push('atk'+i);}}
  if(k==='type'){const x=pick(Object.keys(T).filter(t=>t!==c.type));f.icon=x;why.push(`This is a ${T[c.type].n} card, but the symbol next to its HP is ${T[x].n}.`);reg.push('type');}
  if(k==='frame'){const x=c.r==='common'||c.r==='rare'?pick(['legend','promo']):'common';f.frameR=x;why.push(`A ${R[c.r].n} card never has a ${R[x].n} frame.`);reg.push('frame');}
  if(k==='hp'){const v=c.hp+pick([-5,5,-15,15]);f.hp=v;why.push(`HP always goes up in tens (like 60, 70, 80). ${v} can’t be real!`);reg.push('hp');}
  if(k==='num'){const v=C.length+ri(3,40);f.num=v;why.push(`The set has only ${C.length} cards, so card number ${v} can’t exist.`);reg.push('num');}
  if(k==='deal'){f.atk[1]={...c.atk[1],c:3,d:10};why.push(`A 3-energy attack never does just 10. The real ${c.atk[1].n} does ${c.atk[1].d}.`);reg.push('atk1');}
  if(k==='art'){if(Math.random()<.5){const cols=['#ff6b6b','#51cf66','#339af0','#fcc419','#cc5de8','#ff922b'].filter(x=>x.toLowerCase()!==c.pal[0].toLowerCase());f.pal[0]=pick(cols);why.push(`The creature is the wrong color. Look at the real card!`);}
   else{const [h,bk,mk]=(c.ad||'||').split('|');if(h){f.ad=['',bk||'',mk||''].join('|');why.push(`The creature is missing its ${h==='flamehair'?'flame':h}!`);}else{f.ad=['horns',bk||'',mk||''].join('|');why.push('The creature has extra horns that the real one doesn’t have!');}}reg.push('art');}};
 if(kind==='double'){const ks=shuffle(['spell','type','hp','num','frame']).slice(0,2);ks.forEach(one);}else one(kind);
 return {card:f,why,reg};}
let IJ=null;
function inspectJob(){S.inspShifts=(S.inspShifts||0);IJ={n:0,total:5,earn:0,caught:0,side:S.inspShifts<3};inspNext();}
function inspNext(){padClear();const L=qLv(),c=pick(C),fake=Math.random()<.42;let F=null;if(fake)F=makeFake(c,pick(FAULTS[L]));
 IJ.c=c;IJ.F=F;IJ.phase='judge';IJ.peek=IJ.side;IJ.tries=0;IJ.found=[];const f=pick(FOES);IJ.who=f[0];const shown=F?F.card:c;
 setScreen('insp',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🔍 Inspector job · card ${IJ.n+1}/${IJ.total}</h2>
 <div class="row" style="flex-wrap:nowrap;align-items:center"><div style="width:52px">${kidSVG(f[1],f[2])}</div><div class="bub" style="text-align:left">${f[0]}: “I want to sell you my <b>${c.name}</b> card. It’s totally real… I think!”</div></div></div>
 <div class="insp"><div class="ref" id="ref">${IJ.peek?`<div class="lbl">📒 Real card</div>${cardHTML(c)}`:`<button class="btn ghost" data-a="peek">📒 Peek at the real card<br><small>(no find bonus)</small></button>`}</div>
 <div class="cust"><div class="lbl">🃏 ${f[0]}’s card</div><div class="ccard" id="ccard">${cardHTML(shown)}<div class="lens" id="lens"><div class="lin">${cardHTML(shown)}</div></div><div id="marks"></div></div></div></div>
 <div class="panel" style="text-align:center" id="ipan"><p style="font-weight:800;margin:4px 0" id="imsg">Check the name, the numbers, the symbols and the picture. Drag the 🔍 to look closer!</p>
 <div class="row" id="ibtn"><button class="btn green" data-a="real">✅ Real</button><button class="btn" style="background:#e03131" data-a="fake">🚫 Fake</button></div></div></div>`);
 lensSetup();
 bindAll({peek(){const c=IJ.c;IJ.peek=true;IJ.peeked=true;$('ref').innerHTML=`<div class="lbl">📒 Real card</div>${cardHTML(c)}`;sfx.flip();},
  real(){const F=IJ.F;if(IJ.phase!=='judge')return;if(!F){inspGood(40,`Correct, it’s a real card! +40¢`);}else{const pen=Math.min(25,S.cents);S.cents-=pen;save();sfx.bad();IJ.phase='done';
    $('imsg').innerHTML=`😱 Oh no, it was a <b>fake</b>! ${F.why.join(' ')} ${pen?`You lose ${pen}¢.`:''}`;F.reg.forEach(r=>markRegion(r,'#e03131'));inspNextBtn();}},
  fake(){const F=IJ.F;if(IJ.phase!=='judge')return;if(!F){sfx.bad();IJ.phase='done';$('imsg').innerHTML='🤔 Actually, this card was <b>real</b>. Nothing was wrong with it. No pay this time.';inspNextBtn();}
   else{IJ.phase='find';sfx.good();$('ibtn').innerHTML='';$('imsg').innerHTML=`🕵️ You’re right, it’s fake! Now <b>tap the mistake</b> on the card${F.reg.length>1?` (there are <b>${F.reg.length}</b>!)`:''}.`;}}});
 $('ccard').addEventListener('click',e=>{if(IJ.phase!=='find'||e.target.closest('.lens'))return;const r=$('ccard').getBoundingClientRect();inspTap((e.clientX-r.left)/r.width*180,(e.clientY-r.top)/r.height*252);});}
function inHit(c,reg,x,y){const r=region(c,reg),p=8;if(r==='edge')return x<14||x>166||y<14||y>238;return x>=r[0]-p&&x<=r[2]+p&&y>=r[1]-p&&y<=r[3]+p;}
function inspTap(x,y){const F=IJ.F,c=F.card,left=F.reg.filter(r=>!IJ.found.includes(r));const hitR=left.find(r=>inHit(c,r,x,y));
 if(hitR){IJ.found.push(hitR);markRegion(hitR,'#2f9e44');sfx.good();FX.emit(...ctr($('ccard')),'gold',14,{speed:5});
  if(IJ.found.length===F.reg.length){const bonus=IJ.tries<2&&!IJ.peeked?20:0;IJ.caught++;S.fakesCaught=(S.fakesCaught||0)+1;inspGood(40+bonus,`🕵️ Fake busted! ${F.why.join(' ')}<br>+40¢${bonus?' + 20¢ find bonus':''}`);
   if(S.fakesCaught===10)setTimeout(()=>{FX.stamp('FAKE BUSTER!','small','#ffd43b');fanfare();modal('<div class="big">🕵️</div><h2>Fake Buster badge!</h2><p>You caught 10 fake cards. Great detective work!</p>',[['Awesome!',null]]);},1500);}
  else $('imsg').innerHTML=`Nice, you found one! Find the <b>other</b> mistake.`;return;}
 const mk=document.createElement('div');mk.className='miss';mk.style.left=(x/180*100)+'%';mk.style.top=(y/252*100)+'%';$('marks').appendChild(mk);setTimeout(()=>mk.remove(),700);sfx.bad();
 if(++IJ.tries>=2){left.forEach(r=>markRegion(r,'#f08c00'));IJ.caught++;S.fakesCaught=(S.fakesCaught||0)+1;inspGood(40,`Here it is! ${F.why.join(' ')}<br>+40¢ for spotting the fake`);}
 else $('imsg').innerHTML='Not there. Look again! (Try the name, numbers, symbols or picture.)';}
function markRegion(reg,col){const r=region(IJ.F?IJ.F.card:IJ.c,reg),m=document.createElement('div');m.className='mark';m.style.borderColor=col;
 if(r==='edge'){Object.assign(m.style,{left:'0',top:'0',width:'100%',height:'100%',borderRadius:'7%',borderWidth:'6px'});}
 else Object.assign(m.style,{left:(r[0]/180*100)+'%',top:(r[1]/252*100)+'%',width:((r[2]-r[0])/180*100)+'%',height:((r[3]-r[1])/252*100)+'%'});$('marks').appendChild(m);}
function inspGood(pay,txt){track('inspect',!IJ.tries);IJ.phase='done';IJ.earn+=pay;S.cents+=pay;S.stars+=IJ.tries?1:2;save();chaching();FX.stamp('+'+pay+'¢','small','#69db7c');$('imsg').innerHTML=txt;inspNextBtn();}
function inspNextBtn(){$('ibtn').innerHTML=`<button class="btn gold" data-a="nx">${IJ.n+1<IJ.total?'Next card ▶':'Finish shift ▶'}</button>`;$('ibtn').querySelector('button').onclick=()=>{if(++IJ.n<IJ.total)inspNext();else{S.inspShifts++;save();
 result('insp','🔍 Inspection done!',`<div class="big">🕵️</div><p style="font-size:1.3rem;font-weight:800">You earned ${money(IJ.earn)}</p><p>Fakes caught: ${IJ.caught} · All-time: ${S.fakesCaught||0}${(S.fakesCaught||0)>=10?' 🏅':''}</p><p>Wallet: ${money(S.cents)}</p>`,'Real collectors check the spelling, numbers and symbols before they trade.');}};}
function lensSetup(){const L=$("lens"),box=$("ccard"),Z=2.4;let lx=.84,ly=.9,drag=null,moved=0;
 const place=()=>{const r=box.getBoundingClientRect(),R=L.offsetWidth/2,inn=L.firstElementChild;inn.style.width=(r.width*Z)+'px';L.style.left=(lx*r.width-R)+'px';L.style.top=(ly*r.height-R)+'px';inn.style.left=(R-lx*r.width*Z)+'px';inn.style.top=(R-ly*r.height*Z)+'px';};
 place();addEventListener('resize',place);
 L.addEventListener('pointerdown',e=>{e.preventDefault();L.setPointerCapture(e.pointerId);drag=[e.clientX,e.clientY];moved=0;});
 L.addEventListener('pointermove',e=>{if(!drag)return;const r=box.getBoundingClientRect();moved+=Math.abs(e.clientX-drag[0])+Math.abs(e.clientY-drag[1]);drag=[e.clientX,e.clientY];lx=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));ly=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));place();});
 L.addEventListener('pointerup',()=>{if(drag&&moved<8&&IJ.phase==='find')inspTap(lx*180,ly*252);drag=null;});}

let SJ=null;
const SORTS=[{k:c=>c.hp,d:1,t:'from <b>smallest HP</b> to <b>biggest HP</b>',s:'from smallest HP to biggest HP',h:c=>c.hp+' HP',b:c=>c.hp+' HP'},
 {k:c=>c.hp,d:-1,t:'from <b>biggest HP</b> to <b>smallest HP</b>',s:'from biggest HP to smallest HP',h:c=>c.hp+' HP',b:c=>c.hp+' HP'},
 {k:c=>c.id,d:1,t:'in <b>card number order</b> (No.), smallest first',s:'in card number order, smallest first',h:c=>'No. '+c.id,b:c=>'No. '+c.id},
 {k:c=>c.atk[1].d,d:-1,t:'by their <b>strongest attack</b>, biggest damage first',s:'by their strongest attack, biggest damage first',h:c=>c.atk[1].n+' '+c.atk[1].d,b:c=>'⚔️ '+c.atk[1].d},
 {k:c=>c.atk[0].d+c.atk[1].d,d:1,t:'by <b>both attacks added together</b>, smallest total first',s:'by both attacks added together, smallest total first',h:c=>c.atk[0].d+' + '+c.atk[1].d+' = '+(c.atk[0].d+c.atk[1].d),b:c=>c.atk[0].d+' + '+c.atk[1].d},
 {k:c=>c.hp-c.atk[1].d,d:1,t:'by <b>HP minus strongest attack</b>, smallest first',s:'by HP minus strongest attack, smallest first',h:c=>c.hp+' − '+c.atk[1].d+' = '+(c.hp-c.atk[1].d),b:c=>c.hp+' − '+c.atk[1].d}];
function sortJob(){const L=qLv(),pool=SORTS.slice(0,L===1?4:L===2?5:6);SJ={round:0,earn:0,rules:shuffle(pool).slice(0,2)};sortRound();}
function sortRound(){const R0=SJ.rules[SJ.round];let cs;do{cs=shuffle(C).slice(0,5);}while(new Set(cs.map(R0.k)).size<5);
 SJ.cards=cs;SJ.order=cs.slice().sort((a,b)=>(R0.k(a)-R0.k(b))*R0.d).map(c=>c.id);SJ.pos=0;SJ.miss=0;SJ.perfect=true;SJ.rule=R0;
 setScreen('sort',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🗂️ Sorting job ${SJ.round+1}/2</h2><p style="font-size:1.15rem;font-weight:700;margin:4px 0">Tap the cards ${R0.t}.</p>
 <div class="slots" id="sl">${cs.map((_,i)=>`<div class="s">${i+1}</div>`).join('')}</div></div>
 <div class="row" id="sc">${cs.map(c=>`<button class="pickc sortc" data-a="t" data-v="${c.id}">${cardHTML(c)}<span class="sbadge">${R0.b(c)}</span></button>`).join('')}</div></div>`);
 say('Tap the cards '+R0.s+'.');
 bindAll({t(id,b){id=+id;if(b.classList.contains('used'))return;if(id===SJ.order[SJ.pos]){place(b);}else{sfx.bad();b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),450);SJ.perfect=false;
  if(++SJ.miss>=2){const rb=main.querySelector(`.sortc[data-v="${SJ.order[SJ.pos]}"]`);rb.classList.add('hint');const c=byId(SJ.order[SJ.pos]);toast(`Next is <b>${c.name}</b> (${R0.h(c)})`,2400);}}}});}
function place(b){sfx.pop();SJ.miss=0;const slot=$('sl').children[SJ.pos];slot.innerHTML=b.querySelector('.cardw').outerHTML+'<span class="sbadge sm">'+b.querySelector('.sbadge').textContent+'</span>';slot.style.border='none';b.classList.add('used');b.classList.remove('hint');
 if(++SJ.pos===5){track('compare',SJ.perfect);const pay=50;SJ.earn+=pay;S.cents+=pay;S.stars+=SJ.perfect?2:1;save();sfx.good();toast('📦 Sorted! +50¢');
  setTimeout(()=>{if(SCREEN!=='sort')return;if(++SJ.round<2)sortRound();else result('sort','🗂️ Cards sorted!',`<div class="big">📦</div><p style="font-size:1.3rem;font-weight:800">You earned ${money(SJ.earn)}</p><p>Wallet: ${money(S.cents)}</p>`,'Sort your real cards by number to spot doubles you can trade.');},1300);}}

