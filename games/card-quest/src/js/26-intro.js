/* ---------- Story intro + Quest Book (how the game works, what to do next) ---------- */
const STORY=[
 {art:()=>`<div class="sav">${LUCAS}</div>`,h:'Welcome to Card Town, Lucas!',zh:[['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['小','ㄒㄧㄠˇ'],['鎮','ㄓㄣˋ']],t:'This town is full of amazing creature cards. Every kid here collects them and battles with them.'},
 {art:()=>`<div class="sfan">${[10,94,13].map(i=>cardHTML(byId(i))).join('')}</div>`,h:'Your big dream',zh:[['夢','ㄇㄥˋ'],['想','ㄒㄧㄤˇ']],t:'Become the Card Quest Champion and open your very own card shop!'},
 {art:()=>`<div class="sbig">🎁📒</div>`,h:'Step 1: Collect cards',zh:[['收','ㄕㄡ'],['集','ㄐㄧˊ']],t:'Rip packs to get cards. Keep them in your binder. Get 3 of the same card to evolve it into a stronger one!'},
 {art:()=>`<div class="sbig">🧾🗂️🔍</div>`,h:'Step 2: Work and earn money',zh:[['打','ㄉㄚˇ'],['工','ㄍㄨㄥ']],t:'Do jobs at the store: give change, sort cards, and spot fake cards. Use your math to earn money and ⭐ stars.'},
 {art:()=>`<div class="sbig">⚔️🛣️🏆</div>`,h:'Step 3: Battle and win',zh:[['對','ㄉㄨㄟˋ'],['戰','ㄓㄢˋ']],t:'Battle kids on the street, beat 6 rivals on Rival Road, and win 3 tournament titles.'},
 {art:()=>`<div class="sbig">🏪✨</div>`,h:'Step 4: Open your shop',zh:[['開','ㄎㄞ'],['店','ㄉㄧㄢˋ']],t:'Save $100 and win 3 titles. Then your shop opens and you can sell your own cards!'},
 {art:()=>`<div class="sbig">✏️🔈📜</div>`,h:'Helpers',zh:[['小','ㄒㄧㄠˇ'],['幫','ㄅㄤ'],['手','ㄕㄡˇ']],t:'Tap any word to hear it. Tap ✏️ for the math helper. Open the 📜 Quest Book any time to see what to do next.'}];
function introStory(then,i){i=i||0;const s=STORY[i],last=i===STORY.length-1;
 setScreen('intro',`<div class="hub"><div class="panel story"><div class="sdots">${STORY.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div>
 <div class="sart">${s.art()}</div><h2 class="h">${s.h}</h2>${zh(s.zh)}<p class="stxt">${s.t}</p>
 <div class="row">${i?'<button class="btn ghost" data-a="b">◀ Back</button>':''}<button class="btn gold" data-a="n">${last?'Let’s go! ▶':'Next ▶'}</button>${last?'':'<button class="btn ghost small" data-a="skip">Skip</button>'}</div></div></div>`);
 sfx.pop();
 bindAll({b:()=>introStory(then,i-1),n:()=>{if(last){S.introSeen=true;save();then();}else introStory(then,i+1);},skip:()=>{S.introSeen=true;save();then();}});}
/* Quest Book: goals with live progress; the first unfinished one is marked NEXT */
function quests(){const owned=Object.keys(S.owned).length,rs=S.rivalStage||0;return [
 {e:'🎁',n:'Rip your 5 free packs',z:[['開','ㄎㄞ'],['卡','ㄎㄚˇ'],['包','ㄅㄠ']],v:5-(S.freePacks||0),of:5,how:'Tap 🎁 Free packs, or go into your house.',go:()=>openPack(true)},
 {e:'💵',n:`Save ${money(GOAL)} for your shop`,z:[['存','ㄘㄨㄣˊ'],['錢','ㄑㄧㄢˊ']],v:S.shopOpen?GOAL:Math.min(S.cents,GOAL),of:GOAL,fmt:money,how:'Work the 🧾 cashier, 🗂️ sorting and 🔍 inspector jobs. Win battles too!',go:()=>cashier(false)},
 {e:'🛣️',n:'Beat the 6 rivals on Rival Road',z:[['打','ㄉㄚˇ'],['敗','ㄅㄞˋ'],['對','ㄉㄨㄟˋ'],['手','ㄕㄡˇ']],v:rs,of:6,how:'Go to ⚔️ Battle → Rival Road. Each rival gives you a badge.',go:()=>rivalRoad()},
 {e:'🏆',n:'Win 3 tournament titles',z:[['冠','ㄍㄨㄢˋ'],['軍','ㄐㄩㄣ']],v:Math.min(S.trophies,TITLES),of:TITLES,how:'Pick a cup at the 🏆 Stadium and win 3 battles in a row.',go:()=>tourStart()},
 {e:'🏪',n:'Open your own card shop',z:[['開','ㄎㄞ'],['店','ㄉㄧㄢˋ']],v:S.shopOpen?1:0,of:1,how:`You need ${money(GOAL)} and ${TITLES} 🏆 titles.`,go:()=>hub()},
 {e:'✨',n:'Evolve a card',z:[['進','ㄐㄧㄣˋ'],['化','ㄏㄨㄚˋ']],v:Math.min(S.evolved||0,1),of:1,how:'Get 3 of the same card. Open it in 📒 My binder and tap ✨ Evolve!',go:()=>binder()},
 {e:'🎓',n:'Win a gold medal in a skill',z:[['金','ㄐㄧㄣ'],['牌','ㄆㄞˊ']],v:Math.max(0,...SKILLS.map(s=>skLevel(s.k))),of:3,how:'Open 🎓 Skill Path and practice. Every medal gives you $1.00!',go:()=>skillPath()},
 {e:'📒',n:`Collect all ${C.length} cards`,z:[['收','ㄕㄡ'],['集','ㄐㄧˊ']],v:owned,of:C.length,how:'Buy packs at the 🛒 store, win prizes, and meet the mystery Card Master!',go:()=>store()}];}
function questBook(){const Q=quests(),nx=Q.findIndex(q=>q.v<q.of);S.qbSeen=true;save();
 setScreen('quest',`<div class="hub"><div class="panel"><h2 class="h">📜 Quest Book ${zh([['任','ㄖㄣˋ'],['務','ㄨˋ'],['本','ㄅㄣˇ']])}</h2>
 <p style="text-align:center;font-weight:700">Your goal: become the Champion and open your own card shop!</p>
 <div class="qlist">${Q.map((q,i)=>{const done=q.v>=q.of,f=q.fmt||(x=>x);return `<div class="qrow ${done?'done':i===nx?'next':''}"><span class="qe">${done?'✅':q.e}</span><div class="qt"><b>${q.n}</b>${zh(q.z)}<small>${q.how}</small><div class="bar"><i style="width:${Math.min(100,q.v/q.of*100)}%"></i></div><small>${f(q.v)} / ${f(q.of)}</small></div>${i===nx?`<button class="btn gold small" data-a="go" data-v="${i}">NEXT ▶</button>`:''}</div>`;}).join('')}</div>
 <div class="tip" style="text-align:left">💡 <b>How it works</b><br>⭐ Right answers give you stars. Stars show how strong your math is.<br>✏️ Stuck on math? The math helper shows the steps for 5¢.<br>⚔️ In battle, look for <b>×2</b>: a type that beats the other card does double damage.<br>🔄 Use Switch to swap in a better card.</div>
 <div class="row"><button class="btn" data-a="skp">🎓 Skill Path</button><button class="btn" data-a="ach">🏅 Achievements</button><button class="btn ghost" data-a="story">📖 Watch the story again</button><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({ach:()=>achRoom(),skp:()=>skillPath(),go:i=>Q[+i].go(),story:()=>introStory(questBook),home:()=>hub()});}
