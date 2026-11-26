function storyMake(n,kid){return build(n,'story',kid,()=>{const i=rnd(0,STORIES.length-1),s=STORIES[i];
  return{id:'s'+i,lvl:'Case file',prompt:`<div class="q zh">${zy(s[0])}</div><div class="q zh" style="color:var(--acc2)">${zy(s[1])}</div>`,say:plain(s[0])+plain(s[1]),lang:'zh-TW',
   choices:s[2].map((c,j)=>({val:j,html:zy(c)})),answer:s[3],why:s[4]}})}

/* ---- NORA 3: Soccer stats coach ---- */
const GIRLS=['Nora','Mia','Zoe','Ana','Ella'];
function statsGen(){const t=rnd(0,4),N=pick(GIRLS);
  if(t===0){const tot=pick([10,20,25,50]),step=100/tot,g=rnd(2,Math.floor(tot*.8)),p=Math.round(g*step);
    return{id:`p${N}${tot}-${g}`,prompt:`<div class="q">${N} took ${tot} penalty kicks and scored ${g}. What percent did she score?</div>`,choices:numChoices(p,4,5,100).map(c=>({val:c.val,html:c.val+'%'})),answer:p,why:`${g} out of ${tot} is ${p}%.`,say:''}}
  if(t===1){let a,b,c;do{a=rnd(1,8);b=rnd(1,8);c=rnd(1,8)}while((a+b+c)%3);const av=(a+b+c)/3;
    return{id:`a${a}-${b}-${c}`,prompt:`<div class="q">${N} scored ${a}, ${b} and ${c} goals in three matches. What is her average per match?</div>`,choices:numChoices(av,4,0,12),answer:av,why:`${a} + ${b} + ${c} = ${a+b+c}, and ${a+b+c} ÷ 3 = ${av}.`,say:''}}
  if(t===2){const F=[[1,2],[2,5],[3,5],[3,4],[4,5],[7,10],[9,20],[11,20],[17,25]];const three=shuffle(F).slice(0,3),nm=shuffle(GIRLS).slice(0,3),pc=three.map(f=>f[0]/f[1]),m=pc.indexOf(Math.max(...pc));
    return{id:`b${nm.join('')}${three.join('|')}`,prompt:`<div class="q">Who is the best finisher?<br>${three.map((f,i)=>`${nm[i]} scored ${f[0]} out of ${f[1]}`).join('<br>')}</div>`,choices:nm.map(x=>({val:x,html:x})),answer:nm[m],why:`In percent: ${three.map((f,i)=>nm[i]+' '+Math.round(f[0]/f[1]*100)+'%').join(', ')}.`,say:''}}
  if(t===3){const w=rnd(2,7),d=rnd(0,4),l=rnd(0,3),p=3*w+d;
    return{id:`w${w}-${d}-${l}`,prompt:`<div class="q">A win is 3 points and a draw is 1 point. ${N}'s team won ${w}, drew ${d} and lost ${l}. How many points?</div>`,choices:numChoices(p,4,0,40),answer:p,why:`${w} × 3 = ${3*w}, plus ${d} for the draws makes ${p}.`,say:''}}
  const sc=rnd(5,15),co=rnd(1,sc-1);return{id:`g${sc}-${co}`,prompt:`<div class="q">${N}'s team scored ${sc} goals and let in ${co}. What is the goal difference?</div>`,choices:numChoices(sc-co,4,0,20),answer:sc-co,why:`${sc} − ${co} = ${sc-co}.`,say:''}}
const statsMake=(n,k)=>build(n,'stats',k,statsGen).map(q=>(q.lvl='Coach desk',q));

/* ---- NORA 4: Pattern builder ---- */
const COLS=['#7048e8','#f06595','#fcc419','#12b886','#1c7ed6','#fd7e14'],SHP=['circle','square','triangle','star','diamond'];
function tokSVG(key){const [s,c]=key.split('|'),f=`fill="${c}" stroke="#111" stroke-width="2.5" stroke-linejoin="round"`;
  const shape={circle:`<circle cx="20" cy="20" r="15" ${f}/>`,square:`<rect x="6" y="6" width="28" height="28" rx="3" ${f}/>`,triangle:`<polygon points="20,4 36,34 4,34" ${f}/>`,star:`<polygon points="20,3 25,15 38,15 28,23 32,36 20,28 8,36 12,23 2,15 15,15" ${f}/>`,diamond:`<polygon points="20,3 37,20 20,37 3,20" ${f}/>`}[s];
  return `<svg viewBox="0 0 40 40" width="44" height="44" aria-hidden="true">${shape}</svg>`}
const TNAME={'#7048e8':'purple','#f06595':'pink','#fcc419':'gold','#12b886':'green','#1c7ed6':'blue','#fd7e14':'orange','#e03131':'red'};
/* ---- 3x3 grid puzzles (Nora: Pattern Builder, Lucas: Grid Detective) ---- */
const GNAME={circle:'circle',square:'square',triangle:'triangle',star:'star',diamond:'diamond'};
function cellSVG(key,px,bg){const [s,c,n]=key.split('|'),N=+n,f=`fill="${c}" stroke="#111" stroke-width="2.5" stroke-linejoin="round"`;
  const sh={circle:`<circle cx="20" cy="20" r="15" ${f}/>`,square:`<rect x="6" y="6" width="28" height="28" rx="3" ${f}/>`,triangle:`<polygon points="20,4 36,34 4,34" ${f}/>`,star:`<polygon points="20,3 25,15 38,15 28,23 32,36 20,28 8,36 12,23 2,15 15,15" ${f}/>`,diamond:`<polygon points="20,3 37,20 20,37 3,20" ${f}/>`}[s];
  const P={1:[[30,30,1.25]],2:[[15,30,.7],[45,30,.7]],3:[[30,15,.6],[15,44,.6],[45,44,.6]]}[N];
  return `<svg viewBox="0 0 60 60" width="${px}" height="${px}" aria-hidden="true">${bg?'<rect x="1" y="1" width="58" height="58" rx="9" fill="#fff"/>':''}${P.map(([x,y,k])=>`<g transform="translate(${x-20*k} ${y-20*k}) scale(${k})">${sh}</g>`).join('')}</svg>`}
function cellName(key){const [s,c,n]=key.split('|');return `${n} ${TNAME[c]} ${GNAME[s]}${n>1?'s':''}`}
const G3='display:grid;grid-template-columns:repeat(3,64px);gap:6px;justify-content:center;margin:6px auto',
  G3C='width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:#fff;border:3px solid #1b1f3b;border-radius:10px',
  G3Q='width:64px;height:64px;display:flex;align-items:center;justify-content:center;border:3px dashed #7048e8;border-radius:10px;font-size:30px;font-weight:800;color:#7048e8;background:rgba(112,72,232,.12)';
function gridQ(lv){
  const V={s:shuffle(SHP).slice(0,3),c:shuffle(COLS.slice(0,6)).slice(0,3),n:shuffle([1,2,3])},AT=['s','c','n'],R={};
  if(lv==='n'){const rs=shuffle(['row','col','latin','latinB']).slice(0,3);AT.forEach((a,i)=>R[a]=rs[i])}
  else{const vary=shuffle(AT).slice(0,2),cst=AT.find(a=>!vary.includes(a));R[cst]='const';
    if(lv==='l1'){const o=shuffle(['row','col']);R[vary[0]]=o[0];R[vary[1]]=o[1]}
    else{R[vary[0]]='latin';R[vary[1]]=pick(['row','col'])}}
  const val=(a,r,c)=>{const v=V[a],x=R[a];return x==='row'?v[r]:x==='col'?v[c]:x==='latin'?v[(r+c)%3]:x==='latinB'?v[(r+2*c)%3]:v[0]};
  const cells=[];for(let r=0;r<3;r++)for(let c=0;c<3;c++)cells.push(AT.map(a=>val(a,r,c)).join('|'));
  const miss=lv==='l1'?8:lv==='l2'?6+rnd(0,2):rnd(0,8),ans=cells[miss],A=ans.split('|');
  // near-miss wrong answers: change one feature (and for Nora, one with two features changed)
  const alt=i=>{const a=AT[i],pool=R[a]==='const'?(a==='s'?SHP:a==='c'?COLS.slice(0,6):[1,2,3]).map(String):V[a].map(String);return pool.filter(x=>x!==A[i])};
  const one=[];AT.forEach((a,i)=>alt(i).forEach(x=>{const b=A.slice();b[i]=x;one.push(b.join('|'))}));
  let wrong=shuffle([...new Set(one)]).slice(0,3);
  if(lv==='n'){const i=rnd(0,2),j=(i+1+rnd(0,1))%3,b=A.slice();b[i]=pick(alt(i));b[j]=pick(alt(j));const k=b.join('|');if(!wrong.includes(k)&&k!==ans)wrong.push(k);
    while(wrong.length<4){const x=pick(one);if(!wrong.includes(x))wrong.push(x)}}
  const ANAME={s:'Shape',c:'Color',n:'How many'},RT={row:'each row has its own',col:'each column has its own',latin:'every row and column has all three, once each',latinB:'every row and column has all three, once each',const:'never changes'};
  const why=AT.map(a=>`${ANAME[a]}: ${RT[R[a]]}.`).join(' ')+` So the missing tile is ${cellName(ans)}.`;
  const grid=`<div style="${G3}">${cells.map((k,i)=>i===miss?`<span style="${G3Q}">?</span>`:`<span style="${G3C}">${cellSVG(k,52)}</span>`).join('')}</div>`;
  return{id:`g${lv}-${cells.map(k=>{const [s,c,n]=k.split('|');return SHP.indexOf(s)+''+COLS.indexOf(c)+n}).join('')}-${miss}`,
    prompt:`${grid}<div class="q">Which tile goes in the ? spot?</div>`,
    choices:shuffle([ans,...wrong]).map(k=>({val:k,html:cellSVG(k,56,1)})),answer:ans,why,
    hint:'Look across one row: what stays the same? Then look down one column.',say:'Which tile goes in the question mark spot? Look across the rows and down the columns.'}}
function patGen(i){if(i===1||i===2||i===4)return gridQ('n');const t=rnd(3,7);
  let seq,ans,why;
  if(t===3){const s=rnd(1,20),d=rnd(2,9);seq=[0,1,2,3,4].map(i=>s+d*i);ans=s+d*5;why=`Add ${d} each time.`}
  else if(t===4){const s=pick([1,2,3]),r=pick([2,3]);seq=[0,1,2,3].map(i=>s*r**i);ans=s*r**4;why=`Multiply by ${r} each time.`}
  else if(t===5){const s=rnd(1,15),a=rnd(1,5),b=rnd(6,9);seq=[s];for(let i=0;i<5;i++)seq.push(seq[i]+(i%2?b:a));ans=seq[5]+(5%2?b:a);seq=seq.slice(0,5);ans=seq[4]+(4%2?b:a);why=`The jumps alternate: +${a}, +${b}, +${a}, +${b}.`}
  else if(t===6){const o=rnd(0,3);seq=[1,2,3,4,5].map(i=>i*i+o);ans=36+o;why=`These are square numbers${o?' plus '+o:''}: 1, 4, 9, 16, 25, 36.`}
  else{const a=rnd(1,4),b=rnd(2,5);seq=[a,b];for(let i=2;i<6;i++)seq.push(seq[i-1]+seq[i-2]);ans=seq[5]+seq[4];seq=seq.slice(0,6);why='Each number is the two before it added together.'}
  return{id:`n${seq.join()}`,prompt:`<div class="seq">${seq.map(x=>`<span class="nchip">${x}</span>`).join('')}<span class="qm">?</span></div>`,choices:numChoices(ans,4,0,500),answer:ans,why}}
const patMake=(n,k)=>build(n,'pattern',k,patGen).map(q=>(q.lvl=q.id[0]==='g'?'3×3 grid puzzle':'What comes next?',q.say='',q));
const lucasGridMake=(n,k)=>build(n,'grids',k,i=>gridQ(i<2?'l1':'l2')).map(q=>(q.lvl='Find the missing tile',q));

/* ---- NORA 5: Word match race ---- */
function raceGen(){const w=pick(WORDS),mode=rnd(0,1),i=WORDS.indexOf(w);let pool=shuffle(WORDS.filter(x=>x!==w&&plain(x[0]).length===plain(w[0]).length)).slice(0,3);
  if(pool.length<3)pool=shuffle(WORDS.filter(x=>x!==w)).slice(0,3);const all=shuffle([w,...pool]);
  if(mode===0)return{id:'ra'+i,lvl:'Say it, then find it',prompt:`<div class="q zh" style="color:var(--acc2)">${zyOnly(w[0])}</div><div class="q">Which word says this?</div>`,choices:all.map(x=>({val:x[0],html:`<span style="font-size:1.3em">${plain(x[0])}</span>`})),answer:w[0],why:`${zyOnly(w[0])} is ${plain(w[0])}, which means "${w[1]}".`,say:plain(w[0]),lang:'zh-TW'};
  return{id:'rb'+i,lvl:'What does it mean?',prompt:`<div class="q zh">${zy(w[0])}</div><div class="q">What does this mean?</div>`,choices:all.map(x=>({val:x[1],html:x[1]})),answer:w[1],why:`${plain(w[0])} (${zyOnly(w[0])}) means "${w[1]}".`,say:plain(w[0]),lang:'zh-TW'}}
const raceMake=(n,k)=>build(n,'race',k,raceGen);

/* ---- LUCAS 1: Card quest math ---- */
const CRE=[['Flamepup','🔥'],['Aquafin','💧'],['Leafling','🌿'],['Sparkbeak','⚡'],['Rockhorn','🪨']];
const card=(c,a)=>`<span class="tcard"><span>${c[1]}</span><span>${c[0]}</span><b>${a}</b></span>`;
function cardGen(){const t=rnd(0,5),c=pick(CRE);
  if(t===0){const a=rnd(10,30),b=rnd(5,20);return{id:`c0${a}${b}`,prompt:`<div class="cards">${card(c,a)}<span style="font-size:30px">+${b}</span></div><div class="q">${c[0]} has ATK ${a}. A boost card adds ${b}. What is its ATK now?</div>`,choices:numChoices(a+b,4,0,80),answer:a+b,why:`${a} + ${b} = ${a+b}.`,hint:`Start at ${a} and count up ${b}.`}}
  if(t===1){let a,b,cc,d,x,y;do{a=rnd(3,12);b=rnd(3,12);cc=rnd(2,5);d=rnd(2,6);x=a+b;y=cc*d}while(x===y);const c2=pick(CRE.filter(z=>z!==c));
    return{id:`c1${a}${b}${cc}${d}`,prompt:`<div class="q">Who has more ATK?</div><div class="cards">${card(c,a+' + '+b)}<span>or</span>${card(c2,cc+' × '+d)}</div>`,choices:[{val:'A',html:c[0]},{val:'B',html:c2[0]}],answer:x>y?'A':'B',why:`${a}+${b} = ${x} and ${cc}×${d} = ${y}. ${x>y?c[0]:c2[0]} is bigger.`,hint:`Work out each side first.`}}
  if(t===2){const p=rnd(2,5),k=pick([2,3,5,10]);return{id:`c2${p}${k}`,prompt:`<div class="q">Lucas opens ${p} card packs. Each pack has ${k} cards. How many cards does he have?</div>`,choices:numChoices(p*k,4,0,80),answer:p*k,why:`${p} groups of ${k} is ${p*k}.`,hint:`Count by ${k}s, ${p} times.`}}
  if(t===3){const n=pick([20,30,40,50]),m=rnd(n/2,n-3);return{id:`c3${n}${m}`,prompt:`<div class="q">Lucas needs ${n} cards for his deck. He has ${m}. How many more does he need?</div>`,choices:numChoices(n-m,4,0,60),answer:n-m,why:`${n} − ${m} = ${n-m}.`,hint:`Count up from ${m} to ${n}.`}}
  if(t===4){const a=rnd(4,15),dbl=rnd(0,1);return{id:`c4${a}${dbl}`,prompt:`<div class="cards">${card(c,dbl?a*2:a)}</div><div class="q">${dbl?`${c[0]} has ATK ${a*2}. A shrink card cuts it in half.`:`${c[0]} has ATK ${a}. A power-up doubles it.`} New ATK?</div>`,choices:numChoices(dbl?a:a*2,4,0,60),answer:dbl?a:a*2,why:dbl?`Half of ${a*2} is ${a}.`:`Double ${a} is ${a*2}.`,hint:dbl?'Split it into two equal groups.':'Add the number to itself.'}}
  const b=rnd(4,15),r=rnd(12,40);return{id:`c5${b}${r}`,prompt:`<div class="cards">${card(c,'?')}<span style="font-size:30px">+${b} = ${r+b}</span></div><div class="q">${c[0]} gets +${b} and now has ATK ${r+b}. What was its ATK before?</div>`,choices:numChoices(r,4,0,80),answer:r,why:`${r+b} − ${b} = ${r}.`,hint:`Take ${b} away from ${r+b}.`}}
