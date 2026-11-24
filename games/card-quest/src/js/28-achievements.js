/* ---------- Achievements: checked on every screen change; each pays 25¢ once ---------- */
const own=()=>Object.keys(S.owned).map(Number);
const ACH=[
 {k:'pack',e:'🎁',n:'First Rip',d:'Open your first pack',ok:()=>own().length>=6},
 {k:'c25',e:'📒',n:'Collector',d:'Own 25 different cards',ok:()=>own().length>=25},
 {k:'c60',e:'📚',n:'Big Collector',d:'Own 60 different cards',ok:()=>own().length>=60},
 {k:'call',e:'👑',n:'Master Collector',d:`Own all ${C.length} cards`,ok:()=>own().length>=C.length},
 {k:'dk10',e:'🐉',n:'Dragon Tamer',d:'Own 10 Dragon Kingdom cards',ok:()=>own().filter(i=>byId(i).set===2).length>=10},
 {k:'leg',e:'🌟',n:'Legend Finder',d:'Own a Legend card',ok:()=>own().some(i=>byId(i).r==='legend')},
 {k:'w1',e:'⚔️',n:'First Win',d:'Win a battle',ok:()=>(S.wins||0)>=1},
 {k:'w10',e:'🛡️',n:'Battle Pro',d:'Win 10 battles',ok:()=>(S.wins||0)>=10},
 {k:'w30',e:'🗡️',n:'Battle Legend',d:'Win 30 battles',ok:()=>(S.wins||0)>=30},
 {k:'b3',e:'🎖️',n:'Badge Hunter',d:'Win 3 Rival Road badges',ok:()=>(S.rivalStage||0)>=3},
 {k:'champ',e:'🏅',n:'Card Quest Champion',d:'Beat Champion Max',ok:()=>(S.rivalStage||0)>=6},
 {k:'t1',e:'🏆',n:'Title Winner',d:'Win a tournament',ok:()=>S.trophies>=1},
 {k:'shop',e:'🏪',n:'Shop Owner',d:'Open your own card shop',ok:()=>!!S.shopOpen},
 {k:'evo',e:'✨',n:'Evolver',d:'Evolve a card',ok:()=>(S.evolved||0)>=1},
 {k:'s100',e:'⭐',n:'Star Power',d:'Earn 100 stars',ok:()=>S.stars>=100},
 {k:'s500',e:'🌠',n:'Superstar',d:'Earn 500 stars',ok:()=>S.stars>=500},
 {k:'fake',e:'🕵️',n:'Fake Buster',d:'Catch 10 fake cards',ok:()=>(S.fakesCaught||0)>=10},
 {k:'gold',e:'🥇',n:'Gold Brain',d:'Get a gold medal in a skill',ok:()=>SKILLS.some(s=>skLevel(s.k)>=3)},
 {k:'all',e:'🎓',n:'All-Rounder',d:'Get bronze in every skill',ok:()=>SKILLS.every(s=>skLevel(s.k)>=1)},
 {k:'rich',e:'💰',n:'Big Saver',d:'Have $20.00 in your wallet',ok:()=>S.cents>=2000}];
let achBusy=false;
function achCheck(){if(achBusy||!S.started)return;achBusy=true;try{S.ach=S.ach||{};const fresh=ACH.filter(a=>!S.ach[a.k]&&a.ok());
 if(fresh.length){fresh.forEach(a=>{S.ach[a.k]=Date.now();S.cents+=25;});save();
  fresh.forEach((a,i)=>setTimeout(()=>{toast(`🏅 Achievement: <b>${a.e} ${a.n}</b><br>${a.d} · +25¢`,2600);if(i===0){sfx.win();FX.stamp('ACHIEVEMENT!','small','#ffd43b');}},600+i*2800));}}finally{achBusy=false;}}
function achRoom(){S.ach=S.ach||{};const got=ACH.filter(a=>S.ach[a.k]).length;
 setScreen('ach',`<div class="hub"><div class="panel"><h2 class="h">🏅 Achievements ${zh([['成','ㄔㄥˊ'],['就','ㄐㄧㄡˋ']])} · ${got}/${ACH.length}</h2>
 <div class="achs">${ACH.map(a=>{const g=S.ach[a.k];return `<div class="ach ${g?'got':''}"><span class="ae">${g?a.e:'🔒'}</span><b>${a.n}</b><small>${a.d}</small></div>`;}).join('')}</div>
 <div class="row"><button class="btn ghost" data-a="qb">📜 Quest Book</button><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({qb:()=>questBook(),home:()=>hub()});}
