function weakSkills(){const L=S.log||{};return Object.keys(SKILLS).map(k=>{const e=L['sk:'+k]||[0,0,0];return{k,seen:e[0],first:e[1],rate:e[0]?e[1]/e[0]:1};})
  .filter(x=>x.seen>=2&&x.rate<0.75).sort((a,b)=>a.rate-b.rate||b.seen-a.seen);}
const RI=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const SHF=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pad=n=>String(n).padStart(2,'0');
function optsFrom(ans,cands){const set=[ans];for(const c of cands){if(c!==undefined&&c!==null&&!(typeof c==='number'&&c<=0)&&!set.includes(c)&&set.length<5)set.push(c);}
  let k=1;while(set.length<4&&typeof ans==='number'){const v=ans+(k%2?k:-k);k++;if(v>0&&!set.includes(v))set.push(v);}
  const o=SHF(set);return{opts:o.map(String),ans:o.indexOf(ans)};}
function mk(skill,icon,title,zh,en,ans,cands,hint,explain){const o=optsFrom(ans,cands);return{skill,icon,place:'魔法特訓',title,zh,en,words:[],opts:o.opts,ans:o.ans,hint,explain,fact:''};}
const ORD=n=>n+(n===1?'st':n===2?'nd':n===3?'rd':'th');
const GEN={
  count(){const n=RI(5,12),d=RI(2,6),ans=(n-1)*d;return mk('count','🌳','種魔法樹',`花園裡有${n}棵樹排成一排，每兩棵相鄰的樹距離${d}公尺。從第一棵走到最後一棵，要走幾公尺？`,
    `${n} trees stand in a row, each ${d} m from the next. How far is it from the first tree to the last?`,ans,[n*d,(n+1)*d,(n-2)*d,ans+2*d],`${n}棵樹之間有幾段路？先試試看3棵樹。`,`${n}棵樹之間有${n-1}段路，${n-1}×${d}=${ans}公尺。`);},
  pattern(){const a=RI(2,9),d=RI(2,6),k=RI(6,9),ans=a+(k-1)*d;return mk('pattern','🔮','水晶數列',`魔法水晶上的數字照規律排列：${a}、${a+d}、${a+2*d}、${a+3*d}……第${k}個數字是多少？`,
    `The numbers on magic crystals follow a pattern: ${a}, ${a+d}, ${a+2*d}, ${a+3*d}… What is the ${ORD(k)} number?`,ans,[ans-d,ans+d,ans+2*d,a*k],`每次加${d}。從第1個到第${k}個，一共加了幾次？`,`從${a}開始，加${k-1}次${d}：${a}+${k-1}×${d}=${ans}。`);},
  groups(){const k=RI(3,8),n=k*RI(2,6)+RI(1,k-1),ans=Math.ceil(n/k);return mk('groups','👜','裝水晶',`每個魔法袋可以裝${k}顆水晶。小魔女有${n}顆水晶，至少需要幾個袋子才裝得下？`,
    `Each magic bag holds ${k} crystals. The witch has ${n} crystals. What is the fewest number of bags she needs?`,ans,[ans-1,ans+1,ans+2,n],`${ans-1}個袋子可以裝幾顆？夠不夠？`,`${ans-1}個袋子只裝得下${(ans-1)*k}顆，不夠；${ans}個袋子可以裝${ans*k}顆，夠了。`);},
  multi(){const x=RI(2,4),p=RI(5,15),y=RI(1,3),q=RI(8,20),cost=x*p+y*q,pay=cost<100?100:200,ans=pay-cost;return mk('multi','🪶','魔法商店找錢',`魔法商店裡，一支羽毛筆${p}元，一瓶墨水${q}元。小魔女買了${x}支羽毛筆和${y}瓶墨水，付了${pay}元，要找回多少元？`,
    `A quill costs ${p} dollars and a bottle of ink costs ${q}. The witch buys ${x} quills and ${y} bottles of ink and pays ${pay}. How much change does she get?`,ans,[cost,ans+p,pay-x*p,pay-y*q],`先算一共花了多少錢，再用付的錢去減。`,`羽毛筆 ${x}×${p}=${x*p} 元，墨水 ${y}×${q}=${y*q} 元，一共 ${cost} 元。${pay}−${cost}=${ans} 元。`);},
  twotype(){const h=RI(6,12),r=RI(1,h-1),feet=2*h+2*r;return mk('twotype','🐰','雞和兔子',`魔法農場裡有雞和兔子，一共${h}隻，總共有${feet}隻腳。兔子有幾隻？`,
    `A magic farm has chickens and rabbits, ${h} animals with ${feet} legs in all. How many rabbits are there?`,r,[h-r,r+1,r-1,r+2],`如果全部都是雞，會有幾隻腳？還差幾隻？`,`全是雞有 ${2*h} 隻腳，還差 ${feet-2*h} 隻。每把一隻雞換成兔子多2隻腳，${feet-2*h}÷2=${r} 隻兔子。`);},
  sumdiff(){const sm=RI(5,30),d=RI(2,12),big=sm+d,tot=big+sm;return mk('sumdiff','🍬','分糖果',`姊姊和妹妹一共有${tot}顆糖，姊姊比妹妹多${d}顆。姊姊有幾顆？`,
    `Two sisters have ${tot} candies together. The older sister has ${d} more than the younger one. How many does the older sister have?`,big,[sm,Math.round(tot/2),big+d,tot-d],`先把多出來的${d}顆拿開，剩下的兩人就一樣多了。`,`${tot}−${d}=${tot-d}，${tot-d}÷2=${sm}，妹妹有${sm}顆。姊姊有 ${sm}+${d}=${big} 顆。`);},
  time(){const h=RI(7,10),m=[20,25,30,35,40,45,50][RI(0,6)],rest=RI(5,40),dur=(60-m)+rest,ans=`${h+1}:${pad(rest)}`;
    return mk('time','⏰','下課時間',`魔法課${h}點${m}分開始，上了${dur}分鐘。幾點幾分下課？`,`Magic class starts at ${h}:${pad(m)} and lasts ${dur} minutes. What time does it end?`,
    ans,[`${h}:${pad(Math.min(59,m+rest))}`,`${h+1}:${pad((rest+10)%60)}`,`${h+2}:${pad(rest)}`,`${h+1}:${pad(Math.max(0,rest-10))}`],`先加到下一個整點（${h+1}點），再加剩下的分鐘。`,`從${h}:${pad(m)}到${h+1}:00是${60-m}分鐘，再加${rest}分鐘，就是${ans}。`);},
  order(){const zh=['小明','小華','小美','阿傑'],en=['Ming','Hua','Mei','Jie'];const o=SHF([0,1,2,3]);
    const cl=SHF([0,1,2].map(i=>Math.random()<.5?[`${zh[o[i]]}比${zh[o[i+1]]}高`,`${en[o[i]]} is taller than ${en[o[i+1]]}`]:[`${zh[o[i+1]]}比${zh[o[i]]}矮`,`${en[o[i+1]]} is shorter than ${en[o[i]]}`]));
    const q=RI(0,2),qs=[['最高','tallest',0],['最矮','shortest',3],['第二高','second tallest',1]][q];const ans=zh[o[qs[2]]];
    const it=mk('order','📏','誰比較高？',`${cl.map(c=>c[0]).join('；')}。誰${qs[0]}？`,`${cl.map(c=>c[1]).join('. ')}. Who is the ${qs[1]}?`,ans,zh.filter(x=>x!==ans),`把四個人從高排到矮，一句一句排上去。`,`從高到矮是：${o.map(i=>zh[i]).join('、')}。`);return it;},
  space(){const D=['北','東','南','西'];let d=RI(0,3);const start=d;const turns=[];for(let i=0;i<3;i++){const t=Math.random()<.5?1:-1;turns.push(t);d=(d+t+4)%4;}
    const tz=turns.map(t=>t>0?'向右轉':'向左轉'),te=turns.map(t=>t>0?'turns right':'turns left');const ans=D[d]+'方';
    return mk('space','🧭','轉轉看',`小魔女面向${D[start]}方。她先${tz[0]}，再${tz[1]}，然後${tz[2]}。她現在面向哪裡？`,`The witch faces ${['north','east','south','west'][start]}. She ${te[0]}, then ${te[1]}, then ${te[2]}. Which way is she facing now?`,
    ans,D.map(x=>x+'方').filter(x=>x!==ans),`站起來真的轉轉看！向右轉：北→東→南→西。`,`從${D[start]}方開始：${(()=>{let x=start;return turns.map(t=>{x=(x+t+4)%4;return D[x];}).join(' → ');})()}，最後面向${ans}。`);}
};
/* ---------- MAGIC DUEL (no losing: wrong answers just fizzle) ---------- */
const MONS=[
 ['調皮雲怪','☁️','牠把魔法學院的天空弄得一直下雨，大家的掃帚都濕透了，飛不起來！','愛哭鬼','一不開心就下雨','light','太陽一出來，雨就停了！'],
 ['南瓜搗蛋鬼','🎃','牠把學院的糖果全部藏起來，還在走廊上滾來滾去嚇人！','藏東西大王','滾滾衝撞','ice','冰一冰，就不會亂滾了！'],
 ['墨水章魚','🐙','牠把墨水噴得魔法書到處都是，上面的字都看不清楚了！','噴墨高手','八隻腳一起噴墨','thunder','被電一下，就不敢亂噴墨了！'],
 ['瞌睡蘑菇','🍄','牠到處撒瞌睡粉，害大家上課一直打哈欠！','愛睡覺','瞌睡粉','fire','暖呼呼的火，把瞌睡蟲趕走！'],
 ['迷路小幽靈','👻','牠迷路了好久好久，心情不好，就把學院的門全部鎖起來。','怕寂寞','穿牆躲起來','light','亮亮的光，讓牠不再害怕黑暗！'],
 ['搗蛋小龍','🐲','牠打噴嚏會噴出小火花，把同學的作業燒出好多小洞！','愛打噴嚏','火花噴嚏','ice','冰涼涼的，噴嚏就停了！'],
 ['冰冰雪怪','☃️','牠把學院的噴水池全部結成冰，魚兒都不能游泳了！','怕熱','結冰魔法','fire','火一烤，冰就融化了！'],
 ['刺刺小刺蝟','🦔','牠滾來滾去，把派對的氣球全部戳破了！','害羞','刺刺滾滾','thunder','電一下，刺就軟軟的了！'],
 ['調皮貓頭鷹','🦉','牠半夜一直咕咕叫，吵得大家都睡不著覺！','夜貓子','半夜大合唱','light','天一亮，牠就想睡覺了！'],
 ['惡作劇蝙蝠','🦇','牠把圖書館的書全部倒過來放，大家都找不到要看的書！','愛倒立','倒掛魔法','thunder','雷聲一響，牠就乖乖倒掛不動！']];
const DUMMY=['魔法稻草人','🎯','專門陪你練習的稻草人，打不痛也不會生氣，儘管放大招！','超有耐心','站著不動'];let PRB=null;
function newBattle(){const n=S.mnext||0;S.battle={mi:n%MONS.length,hp:100,combo:0,turns:0,first:0,shown:false};S.mnext=n+1;save();}
function battle(){if(PR.on)return PRB;if(!S.battle||(S.battle.hp<=0&&S.battle.shown))newBattle();return S.battle;}
const monOf=b=>PR.on?DUMMY:MONS[b.mi];
const lvl=()=>1+Math.min(19,Math.floor((S.power||0)/5));
function spell(){const L=lvl();return L>=9?['🌈','彩虹咒']:L>=7?['⚡','雷電咒']:L>=5?['❄️','冰晶咒']:L>=3?['🔥','火焰咒']:['✨','星光咒'];}
const TIERS=[{n:'彈',e:'💫',m:1.0,fx:'star'},{n:'漩渦',e:'🌀',m:1.3,fx:'fire'},{n:'風暴',e:'🌨️',m:1.6,fx:'snow'},{n:'重擊',e:'💥',m:2.0,fx:'bolt'},{n:'龍捲風',e:'🌪️',m:2.5,fx:'tornado'},{n:'神龍',e:'🐉',m:3.0,fx:'dragon'}];
const ELEMS=[{k:'fire',n:'火焰',e:'🔥',c:'#FF6B3D',say:'哇！好燙好燙！'},{k:'ice',n:'冰晶',e:'❄️',c:'#56C2FF',say:'好冷好冷！鼻涕都結冰了！'},
 {k:'thunder',n:'雷電',e:'⚡',c:'#E9B94A',say:'被電得頭髮都豎起來了！'},{k:'light',n:'星光',e:'✨',c:'#C77DFF',say:'哇！好亮，眼睛都睜不開！'}];
const DESC=[n=>`一顆${n}彈飛向怪獸！`,n=>`三團${n}轉著圈飛過去！`,n=>`${n}從天空嘩啦啦落下來！`,n=>`轟隆！${n}從天而降！`,n=>`${n}龍捲風把怪獸捲上天！`,n=>`傳說中的${n}神龍飛來了！`];
const MPET=[{t:'shield',d:'保護罩：答錯一次也不會打斷連擊'},{t:'dmg',v:8,d:'每次出招 +8 傷害'},{t:'double',d:'多噴一次墨：傷害 +30%'},{t:'weaken',v:20,d:'瞌睡粉：怪獸生命值 −20'},
 {t:'shield',d:'保護罩：答錯一次也不會打斷連擊'},{t:'dmg',v:10,d:'每次出招 +10 傷害'},{t:'weaken',v:25,d:'冰凍：怪獸生命值 −25'},{t:'double',d:'刺刺滾過去：傷害 +30%'},
 {t:'weaken',v:20,d:'大眼睛瞪一瞪：怪獸生命值 −20'},{t:'double',d:'倒掛偷襲：傷害 +30%'}];
const petInfo=k=>k==='cat'?{n:'小黑',e:'🐈‍⬛',t:'dmg',v:5,d:'每次出招 +5 傷害'}:{n:MONS[k][0],e:MONS[k][1],...MPET[k]};
const myPets=()=>['cat',...new Set(S.mfriends||[])];
const curPet=()=>myPets().some(p=>String(p)===String(S.pet))?S.pet:'cat';
const CHO=()=>PR.on?PRB:S;
const tierIx=c=>Math.min(TIERS.length,Math.max(1,c))-1;
function introThen(go){
  const b=battle();if(b.intro){go();return;}
  const m=monOf(b),c=CHO().chain||0,Wk=m[5]?ELEMS.find(x=>x.k===m[5]):null;bg(true);
  app.innerHTML=`<section class="center intro">
  <p class="ialert">${PR.on?'🎯 特訓對手出現了！':'⚠️ 怪獸出現了！'}</p>
  <div class="imon">${m[1]}</div>
  <h2 data-say="zh">${m[0]}</h2>
  <p class="istory" data-say="zh">${m[2]}</p>
  <p class="iweak" data-say="zh">${Wk?`弱點：${Wk.e} ${Wk.n}　<small>${m[6]}</small>`:'弱點：什麼咒語都可以！'}</p>
  <div class="istats"><div><b>❤️ ${b.hp}</b><small>怪獸生命值</small></div><div><b>Lv${lvl()}</b><small>你的魔力</small></div><div><b>${c?TIERS[tierIx(c)].e+' '+c:'0'}</b><small>目前連擊</small></div></div>
  <div class="ipets"><p class="small">帶一位夥伴一起對決：</p><div class="prow">${myPets().map(k=>{const pi=petInfo(k);return `<button class="pchip${String(k)===String(curPet())?' on':''}" data-p="${k}" aria-label="${pi.n}">${pi.e}<span>${pi.n}</span></button>`;}).join('')}</div>
  <p class="small pdesc" id="pdesc">${petInfo(curPet()).e} ${petInfo(curPet()).d}</p></div>
  <button class="primary" id="fight">🪄 開始對決！</button></section>`;
  SND.thump();
  app.querySelectorAll('.pchip').forEach(x=>x.onclick=()=>{const k=x.dataset.p==='cat'?'cat':+x.dataset.p;S.pet=k;save();
    app.querySelectorAll('.pchip').forEach(y=>y.classList.toggle('on',y===x));const pi=petInfo(k);$('#pdesc').textContent=`${pi.e} ${pi.d}`;SND.pop();});
  $('#fight').onclick=()=>{const pi=petInfo(curPet());if(pi.t==='weaken'&&!b.wk){b.hp=Math.max(40,b.hp-pi.v);b.wk=true;}b.shield=pi.t==='shield'?1:0;b.intro=true;save();go();};
}
function battleBar(){const b=battle(),m=monOf(b),c=CHO().chain||0,nx=TIERS[tierIx(c+1)],pi=petInfo(curPet());
  return `<div class="bbar" aria-label="${m[0]} 還剩 ${b.hp}"><span class="bmon">${m[1]}</span>
  <div class="bmid"><div class="bname">${m[0]}</div><div class="bhp"><i style="width:${b.hp}%"></i></div>
  <div class="chain" aria-label="連擊 ${c}">${TIERS.map((t,k)=>`<span class="${k<c?'on':''}" title="${t.n}">${t.e}</span>`).join('')}</div></div>
  <div class="bpow"><b>Lv${lvl()} ${pi.e}</b><small>下一招</small><small class="nx">${nx.e}${nx.n}</small></div></div>`;}
function comboBreak(){const C=CHO(),b=battle(),pi=petInfo(curPet());
  if((C.chain||0)>0&&pi.t==='shield'&&b.shield>0){b.shield--;save();return pi;}
  C.chain=0;b.combo=0;save();return null;}
function pickSpell(kind,cb){
  const b=battle(),m=monOf(b),ti=kind==='first'?tierIx((CHO().chain||0)+1):0;
  const o=document.createElement('div');o.className='pick';o.setAttribute('role','dialog');
  o.innerHTML=`<div class="pickbox"><h3>選擇咒語！</h3><p class="small">${m[5]?`記得${m[0]}怕什麼嗎？`:'想用哪一種都可以！'}</p>
  <div class="pgrid">${ELEMS.map(E=>`<button class="pbtn" data-e="${E.k}" style="--c:${E.c}"><span>${E.e}</span><b>${E.n}${TIERS[ti].n}</b></button>`).join('')}</div></div>`;
  document.body.appendChild(o);SND.pop();
  o.querySelectorAll('.pbtn').forEach(x=>x.onclick=()=>{o.remove();cb(x.dataset.e);});
}
function battleHit(kind,ek,cont){
  const C=CHO(),b=battle(),before=lvl(),m=monOf(b),pi=petInfo(curPet()),E=ELEMS.find(x=>x.k===ek)||ELEMS[3];
  if(kind==='first'){C.chain=(C.chain||0)+1;b.first++;S.power=(S.power||0)+1;}
  else{C.chain=0;S.power=(S.power||0)+(kind==='retry'?0.5:0.25);}
  b.combo=C.chain;b.turns++;
  const ti=kind==='first'?tierIx(C.chain):0,t=TIERS[ti],weak=!!m[5]&&m[5]===ek;
  let dmg=(12+3*lvl())*(kind==='first'?t.m*1.2:kind==='retry'?0.8:0.6);if(weak)dmg*=1.5;
  const pet=pi.t==='dmg'?pi.v:pi.t==='double'?Math.round(dmg*0.3):0;dmg=Math.round(dmg)+pet;
  let fin=false;if(b.turns>=5&&b.hp-dmg>0){dmg=b.hp;fin=true;}
  const hp0=b.hp;b.hp=Math.max(0,b.hp-dmg);save();
  playAttack({dmg,b,hp0,kind,fin,up:lvl()>before,ti,chain:C.chain,E,weak,pet,pi,m},cont);
}
function fxHTML(fx,E){const e=E.e;
  switch(fx){
    case 'star':return `<span class="fx f-star">${e}</span>`;
    case 'fire':return [0,1,2].map(k=>`<span class="fx f-fire" style="--i:${k}">${e}</span>`).join('');
    case 'snow':return Array.from({length:10},(_,k)=>`<span class="fx f-snow" style="--x:${8+k*9}%;--i:${k}">${e}</span>`).join('');
    case 'bolt':return `<div class="flash"></div><span class="fx f-bolt">${e}</span><span class="fx f-bolt b2">${e}</span>`;
    case 'tornado':return `<div class="fx f-ring" style="background:conic-gradient(${E.c},#fff,${E.c},#fff,${E.c})"></div><span class="fx f-tw">🌪️</span>`;
    case 'dragon':return `<div class="flash"></div><span class="fx f-dragon">🐉</span>`+Array.from({length:10},(_,k)=>`<span class="fx f-burst" style="--a:${k*36}deg">${e}</span>`).join('');
  }return '';}
