/* ---------- question bank: 20 kinds, 3 levels; gets harder as Lucas gets them right ---------- */
const qLv=()=>Math.min(3,1+Math.floor((S.qRight||0)/4));
function qScore(first){S.qRight=first?(S.qRight||0)+1:Math.max(0,(S.qRight||0)-1);save();}
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const tfmt=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mm=m%60,h12=h%12||12;return `${h12}:${String(mm).padStart(2,'0')}`;};
function mkQ(q,ans,wrong,why,extra){ans=String(ans);const w=[...new Set(wrong.map(String))].filter(x=>x!==ans&&x!=='NaN'&&!x.startsWith('-'));return {q,ans,opts:shuffle([ans,...shuffle(w).slice(0,3)]),why,extra:extra||''};}
const near=(a,st)=>[a+st,a-st,a+2*st,a-2*st];
const RIDDLES={
 packsLeft(L){const a=ri(3,4+L*2),b=ri(4,5+L),t=a*b,g=ri(3,t-4),ans=t-g;return Object.assign(mkQ(`I opened <b>${a} packs</b> with <b>${b} cards</b> in each. Then I gave <b>${g}</b> cards to my friends. How many cards do I have left?`,ans,[t-g+b,t+g,t-g-1,a*b],`${a} × ${b} = ${t}, then ${t} − ${g} = ${ans}`),{ops:[{a:t,op:'-',b:g}]});},
 missing(L){const k=ri(0,2);if(k===0){const a=ri(3,6+L),b=ri(4,6+L*2);return mkQ(`What number goes in the box?<br><b>${a} × ▢ = ${a*b}</b>`,b,near(b,1),`${a} × ${b} = ${a*b}`);}
  if(k===1){const c=ri(12,30*L),b=ri(9,25*L);return Object.assign(mkQ(`What number goes in the box?<br><b>▢ − ${b} = ${c}</b>`,b+c,[...near(b+c,10),b+c+1],`${c} + ${b} = ${b+c}`),{ops:[{a:c,op:'+',b}]});}
  const a=ri(15,40*L),s=a+ri(18,50*L);return Object.assign(mkQ(`What number goes in the box?<br><b>${a} + ▢ = ${s}</b>`,s-a,[...near(s-a,10),s-a+1],`${s} − ${a} = ${s-a}`),{ops:[{a:s,op:'-',b:a}]});},
 pattern(L){const ps=[()=>{const s=ri(2,9),k=ri(3,6+L*3);const a=[0,1,2,3,4].map(i=>s+i*k);return [a,s+5*k,`it goes up by ${k} each time`];},
  ()=>{const s=ri(2,5);const a=[0,1,2,3,4].map(i=>s*2**i);return [a,s*32,'it doubles each time'];},
  ()=>{const a=[1,4,9,16,25];return [a,36,'1×1, 2×2, 3×3, 4×4, 5×5, so next is 6×6'];},
  ()=>{const a=[1,3,6,10,15];return [a,21,'it adds 2, then 3, then 4, then 5, so next add 6'];},
  ()=>{const a=[2,3,5,8,13];return [a,21,'each number is the two before it added together'];},
  ()=>{const s=ri(40,90),a=[s,s-7,s-14,s-21,s-28];return [a,s-35,'it goes down by 7 each time'];},
  ()=>{const s=ri(5,15),a=[s,s+5,s+3,s+8,s+6];return [a,s+11,'it goes +5, −2, +5, −2…'];}];
  const [seq,ans,why]=pick(ps.slice(0,L===1?3:7))();return mkQ(`What comes next?<br><b>${seq.join(', ')}, ▢</b>`,ans,[ans+1,ans-1,ans+2,seq[4]+(seq[4]-seq[3])+3],`Next is ${ans}: ${why}.`);},
 weakness(L){const foe=pick(C.filter(c=>c.r!=='promo')),wt=WEAK[foe.type];const good=pick(C.filter(c=>c.type===wt&&c.r==='common'));
  const bad=shuffle(C.filter(c=>c.type!==wt&&c.r==='common')).slice(0,2);return {...mkQ(`Your rival sends out <b>${foe.name}</b>. Which of your cards hits it for <b>×2</b> damage? (Look at its weakness!)`,good.name,bad.map(c=>c.name),`${foe.name} is weak to ${T[wt].n}, and ${good.name} is a ${T[wt].n} card.`),extra:`<div style="width:120px;margin:0 auto">${cardHTML(foe)}</div>`};},
 damage(L){const d=pick([20,30,40,50,60,70]),plus=L>=2&&Math.random()<.5,sh=Math.random()<.5,ans=(d+(plus?10:0))*2-(sh?10:0),r0=d+(plus?10:0);
  return Object.assign(mkQ(`An attack does <b>${d}</b>.${plus?' The attacker’s Ability adds <b>+10</b>.':''} The defender is weak to it: <b>×2</b>!${sh?' But its shield blocks <b>10</b>.':''} How much damage?`,ans,[d*2,ans+10,ans-10,d+20],`${plus?`(${d} + 10)`:d} × 2${sh?' − 10':''} = ${ans}`),{ops:[...(plus?[{a:d,op:'+',b:10}]:[]),{a:r0,op:'+',b:r0},...(sh?[{a:r0*2,op:'-',b:10}]:[])]});},
 hitsKO(L){const d=pick([20,30,40,50,60]),hp=pick([60,70,90,110,120,130,150].filter(h=>h>d)),ans=Math.ceil(hp/d);
  return mkQ(`A card has <b>${hp} HP</b>. Your attack does <b>${d}</b> damage every time. How many attacks to knock it out?`,ans,[ans-1,ans+1,Math.floor(hp/d)+2],`${ans-1} attack${ans-1===1?'':'s'} = ${(ans-1)*d}, not enough. ${ans} attacks = ${ans*d}, that’s ${hp} or more!`);},
 change(L){const n=ri(1,L+1),single=pick([30,80,250]),cost=n*200+single,pay=cost<=500?500:1000,ans=pay-cost;
  return Object.assign(mkQ(`You buy <b>${n} pack${n>1?'s':''}</b> ($2.00 each) and one card for <b>${money(single)}</b>. You pay with <b>${money(pay)}</b>. How much change?`,money(ans),[money(ans+50),money(ans-25),money(pay-n*200),money(ans+100)],`${n} × $2.00 + ${money(single)} = ${money(cost)}, and ${money(pay)} − ${money(cost)} = ${money(ans)}`),{ops:[{a:n*200,op:'+',b:single,m:true},{a:pay,op:'-',b:cost,m:true}]});},
 share(L){const k=ri(3,4+L),each=ri(4,6+L*2),rem=L>=2?ri(1,k-1):0,t=k*each+rem;
  if(rem)return Object.assign(mkQ(`<b>${t} cards</b> are shared equally between <b>${k} kids</b>. Everyone gets the same number. How many cards are left over?`,rem,[rem+1,rem+2,each,0],`${k} × ${each} = ${k*each}, and ${t} − ${k*each} = ${rem} left over.`),{ops:[{a:t,op:'-',b:k*each}]});
  return mkQ(`<b>${t} cards</b> are shared equally between <b>${k} kids</b>. How many cards does each kid get?`,each,[each+1,each-1,each+2],`${k} × ${each} = ${t}`);},
 together(L){const m=ri(5,12+L*5),d=ri(2,4+L*2),t=2*m+d;return Object.assign(mkQ(`Leo has <b>${d} more</b> cards than Max. Together they have <b>${t}</b> cards. How many cards does Leo have?`,m+d,[m,t-d,m+d+1,Math.round(t/2)+1],`Max has ${m} and Leo has ${m} + ${d} = ${m+d}. Check: ${m} + ${m+d} = ${t}.`),{ops:[{a:t,op:'-',b:d}]});},
 notInTable(L){const n=pick(L===1?[3,4,5]:[4,6,7,8]),ins=shuffle([2,3,4,5,6,7,8,9]).slice(0,3).map(x=>x*n),out=n*ri(3,8)+ri(1,n-1);
  return mkQ(`Which number is <b>NOT</b> in the <b>${n} times table</b>?`,out,ins,`${out} ÷ ${n} doesn’t come out even. The others do.`);},
 clock(L){const st=ri(9,16)*60+pick([0,15,30,45,10,40,50]),dur=pick(L===1?[30,45,60]:[35,50,75,90,105]),ans=tfmt(st+dur);
  return mkQ(`A tournament starts at <b>${tfmt(st)}</b> and lasts <b>${dur} minutes</b>. What time does it end?`,ans,[tfmt(st+dur+10),tfmt(st+dur-15),tfmt(st+dur+60)],`${tfmt(st)} + ${dur} minutes = ${ans}`);},
 sumHP(L){const cs=shuffle(C).slice(0,L===1?2:3),ans=cs.reduce((a,c)=>a+c.hp,0);return {ops:cs.slice(1).map((c,i)=>({a:cs.slice(0,i+1).reduce((x,y)=>x+y.hp,0),op:'+',b:c.hp})),...mkQ(`Add up the <b>HP</b> of ${cs.length===2?'both':'all three'} cards. What is the total?`,ans,near(ans,10),cs.map(c=>c.hp).join(' + ')+' = '+ans),extra:`<div class="row">${cs.map(c=>`<div style="width:100px">${cardHTML(c)}</div>`).join('')}</div>`};},
 fraction(L){const f=pick(L===1?[[1,2],[1,4]]:[[1,3],[3,4],[2,3],[1,5]]),den=f[1],t=den*ri(3,9),ans=t/den*f[0];
  return mkQ(`I have <b>${t} cards</b>. <b>${f[0]}/${den}</b> of them are Holo cards. How many Holo cards do I have?`,ans,[t/den,ans+den,t-ans,ans-1],`${t} ÷ ${den} = ${t/den}${f[0]>1?`, and ${t/den} × ${f[0]} = ${ans}`:''}`);},
 compare(L){let a,b,x,y;do{a=ri(2,6);b=ri(2,6);x=ri(3,9);y=ri(3,9);}while(a===b||x===y);const A=a*x,B=b*y,ans=A>B?'Box A':B>A?'Box B':'Same';
  return mkQ(`<b>Box A</b> has ${a} packs of ${x} cards. <b>Box B</b> has ${b} packs of ${y} cards. Which box has more cards?`,ans,['Box A','Box B','Same'],`Box A: ${a} × ${x} = ${A}. Box B: ${b} × ${y} = ${B}.`);},
 whoAmI(L){const pairs=[[2,5],[3,4],[2,7],[3,5],[4,6],[3,7]];for(let i=0;i<40;i++){const [a,b]=pick(pairs),lo=ri(1,8)*10,c=[];for(let n=lo+1;n<lo+10;n++)if(n%a===0&&n%b===0)c.push(n);
  if(c.length===1)return mkQ(`I am a number between <b>${lo}</b> and <b>${lo+10}</b>. I am in the <b>${a}</b> times table AND the <b>${b}</b> times table. Who am I?`,c[0],[c[0]+a,c[0]-b,c[0]+1,lo+5],`${c[0]} = ${a} × ${c[0]/a} = ${b} × ${c[0]/b}`);}return RIDDLES.pattern(L);},
 placeValue(L){const h=ri(1,9),t=pick([0,ri(1,9)]),o=ri(0,9),th=L>=2?ri(1,9):0,ans=th*1000+h*100+t*10+o;
  return mkQ(`What number has ${th?`<b>${th} thousands</b>, `:''}<b>${h} hundreds</b>, <b>${t} tens</b> and <b>${o} ones</b>?`,ans,[th*1000+h*100+o*10+t,th*100+h*10+t+o,ans+10,th*1000+h*100+t+o],`${th?th*1000+' + ':''}${h*100} + ${t*10} + ${o} = ${ans}`);},
 legs(L){const n=ri(4,5+L*2),v=ri(1,n-1),legs=v*4+(n-v)*2;
  return mkQ(`My shop has some <b>Voltkits</b> (4 legs each) and some <b>Gustlings</b> (2 legs each). There are <b>${n} creatures</b> and <b>${legs} legs</b>. How many Voltkits?`,v,[v+1,v-1,n-v,Math.round(legs/4)],`${v} Voltkits = ${v*4} legs, ${n-v} Gustlings = ${(n-v)*2} legs. ${v*4} + ${(n-v)*2} = ${legs}`);},
 digit(L){const d=ri(1,4),top=pick(L===1?[30,40]:[50,60,100]);let n=0;for(let i=1;i<=top;i++)n+=String(i).split(d).length-1;
  return mkQ(`I write all the numbers from <b>1 to ${top}</b>. How many times do I write the digit <b>${d}</b>?`,n,[n-1,n+1,Math.floor(top/10),n+2],`Count the ${d}s in the ones place and in the tens place: ${n} in all.`);},
 calendar(L){const s=ri(0,6),k=ri(L===1?3:8,L===1?9:25),ans=DAYS[(s+k)%7];return mkQ(`Today is <b>${DAYS[s]}</b>. The big tournament is in <b>${k} days</b>. What day is the tournament?`,ans,DAYS.filter(x=>x!==ans).slice(0,6).filter((_,i)=>i%2===0),`${k} days = ${Math.floor(k/7)} week${Math.floor(k/7)===1?'':'s'} and ${k%7} more day${k%7===1?'':'s'} after ${DAYS[s]}.`);},
 coins(L){const sets=[[40,'25¢ + 10¢ + 5¢',['25¢ + 25¢ + 5¢','10¢ + 10¢ + 10¢','25¢ + 5¢ + 5¢']],[60,'25¢ + 25¢ + 10¢',['25¢ + 10¢ + 10¢','25¢ + 25¢ + 5¢','10¢ + 25¢ + 5¢']],[35,'10¢ + 10¢ + 10¢ + 5¢',['25¢ + 5¢ + 1¢ + 1¢','10¢ + 10¢ + 5¢ + 5¢','25¢ + 5¢ + 5¢ + 1¢']],[85,'25¢ + 25¢ + 25¢ + 10¢',['25¢ + 25¢ + 10¢ + 10¢','25¢ + 25¢ + 25¢ + 5¢','25¢ + 25¢ + 25¢ + 1¢']]];
  const [v,ans,w]=pick(sets);const n=ans.split('+').length;return mkQ(`Make exactly <b>${v}¢</b> using exactly <b>${n} coins</b>. Which coins?`,ans,w,`${ans} = ${v}¢`);}};
function makeQ(opts){opts=opts||{};let ks=Object.keys(RIDDLES);if(opts.noCards)ks=ks.filter(k=>!['weakness','sumHP'].includes(k));const L=qLv();
 S.qLast=S.qLast||[];S.qSeen=S.qSeen||[];let r,key;for(let i=0;i<60;i++){let k;do{k=pick(ks);}while(S.qLast.includes(k)&&i<40);r=RIDDLES[k](L);key=r.q.replace(/<[^>]+>/g,'');if(!S.qSeen.includes(key)){S.qLast=[k].concat(S.qLast).slice(0,6);break;}}
 S.qSeen=[key].concat(S.qSeen).slice(0,500);save();return r;}

