// more questions for the puzzles Milo already knows
CVC.push(['pen','🖊️'],['jam','🍯'],['mug','☕'],['pot','🍲'],['log','🪵'],['rat','🐀'],['cub','🐻'],['pin','📌']);
BLEND.push(['tree','🌳'],['sled','🛷'],['clap','👏'],['skunk','🦨'],['glove','🧤'],['brush','🪥']);
QCAT.push(['Which one is a fruit?','哪一個是水果?',['🍎','🍌','🍇','🍓'],['🥕','🧀','🍞','🥚']],['Which one makes music?','哪一個會發出音樂?',['🥁','🎸','🎺','🎹'],['🧦','🪑','📚','🧸']],
 ['Which one do you wear?','哪一個可以穿?',['👕','🧦','🧢','👟'],['🍎','🚗','🪑','🎈']],['Which one can swim?','哪一個會游泳?',['🐟','🦆','🐬','🐢'],['🐈','🐄','🐓','🦒']]);
RHYME.push(['cake','lake','bake','snake'],['ball','tall','wall','fall'],['star','car','jar','far'],['bee','tree','see','knee']);
SEQS.push([['🛒','🍳','😋'],'Buy food, cook it, then eat!','買菜、煮飯,然後吃!'],[['🧦','👟','🏃'],'Socks, then shoes, then run!','先穿襪子,再穿鞋子,然後跑!']);
SOCIAL.push(['🍪','You have two cookies and your friend has none. What should you do?','你有兩塊餅乾,朋友一塊也沒有。你應該怎麼做?',[['🤝','Share one','分他一塊',1],['😋','Eat both fast','趕快兩塊都吃掉'],['🙈','Hide them','藏起來'],['😝','Tease your friend','笑朋友']]],
 ['🎨','Your friend drew a picture. What can you say?','朋友畫了一張畫。你可以說什麼?',[['👍','“I like your colors!”','「我喜歡你的顏色!」',1],['😒','“That’s ugly.”','「好醜。」'],['🙄','Walk away','走開'],['🗑️','Throw it away','丟掉']]]);
NEEDS.push({b:'🤧',it:'🧻',w:['Baby has a runny nose!','寶寶流鼻涕了!'],a:['A tissue! All clean!','衛生紙!擦乾淨了!']},{b:'🥱',it:'📖',w:['Baby is bored!','寶寶好無聊!'],a:['A story book! Baby loves stories!','故事書!寶寶最愛聽故事!']});
CATS.push(['bug','昆蟲',['🐝','🐞','🦋','🐜','🐛']],['weather','天氣',['☀️','🌧️','❄️','🌈','⛅']]);
PROPS.push(['can jump','會跳',['🐸','🦘','🐰','🦗'],['🐌','🐢','🐟','🐍']]);
FRUIT.push(['🍇','grape','grapes','葡萄'],['🍑','peach','peaches','桃子'],['🍋','lemon','lemons','檸檬']);
Object.assign(PICNAME,{'🖊️':['pen','筆'],'🍯':['jam','果醬'],'☕':['mug','杯子'],'🪵':['log','木頭'],'🐀':['rat','老鼠'],'🐻':['bear cub','小熊'],'📌':['pin','圖釘'],'🛷':['sled','雪橇'],'👏':['clap','拍手'],'🦨':['skunk','臭鼬'],'🧤':['glove','手套'],
 '🍎':['apple','蘋果'],'🍌':['banana','香蕉'],'🍇':['grapes','葡萄'],'🍓':['strawberry','草莓'],'🧀':['cheese','起司'],'🥁':['drum','鼓'],'🎸':['guitar','吉他'],'🎺':['trumpet','喇叭'],'🎹':['piano','鋼琴'],'🧦':['sock','襪子'],'🪑':['chair','椅子'],'📚':['books','書'],'🧸':['teddy bear','泰迪熊'],
 '👕':['shirt','衣服'],'🧢':['cap','帽子'],'👟':['shoe','鞋子'],'🚗':['car','汽車'],'🎈':['balloon','氣球'],'🐬':['dolphin','海豚'],'🐈':['cat','貓'],'🐄':['cow','牛'],'🦦':['otter','水獺']});
/* ---------- boot ---------- */
lvInit();migrate();S.step=S.step||{};$('zGames').innerHTML=zh('練習');
$('mapGames').onclick=()=>{ac();const m=document.createElement('div');m.className='modal';m.innerHTML=`<div><h2>${bi('Practice any puzzle','練習任何謎題')}</h2><div class="stCards" style="overflow:visible">${Object.keys(MG).map(k=>`<button class="mcard" data-g="${k}"><span class="em">${MG[k].icon}</span><span class="zh">${zh(MG[k].zh)}</span><span class="en">${MG[k].en} · L${LV(MG[k].topic)}</span></button>`).join('')}</div><button class="btn ghost" style="margin-top:12px" id="gClose">Close ✕</button></div>`;$('modalRoot').appendChild(m);m.querySelector('#gClose').onclick=()=>m.remove();m.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{m.remove();startGame(b.dataset.g);});say('Pick a puzzle to practice!','選一個謎題來練習!');};
showWallet();
if('speechSynthesis' in window)try{speechSynthesis.onvoiceschanged=()=>{for(const k in vcache)delete vcache[k];voiceNote();};setTimeout(voiceNote,600);}catch(e){}
try{window.KA&&KA.setKid&&KA.setKid(KID);}catch(e){}
trainAt=Math.min(S.ch+1,CH.length);
// fix saves where two dinos ended up with the same name
(function dedupeNames(){try{const seen=new Set();let ch=false;S.dinos.forEach(d=>{const n=String(d.name||'').toUpperCase();if(!n||seen.has(n)){d.name=null;ch=true;}else seen.add(n);});
 S.dinos.forEach(d=>{if(!d.name){d.name=freshNames(1,d)[0];seen.add(d.name);}});if(ch)save();}catch(e){}})();
// Expose for automated playtests. Harmless for players.
window.__test={state:()=>({step:S.step,screen:SCREEN,scene:!!document.querySelector('.scene'),game:A&&SCREEN==='game'?A.id:null,n:A?A.n:0,ch:S.ch,cur:CUR,bricks:binCount(),snacks:S.snacks,dinos:S.dinos.map(d=>d.name+':'+d.t+':'+(d.stage??2)+':'+(d.area||'home')),done:Object.keys(S.done),goal:Object.keys(S.goal),build:B&&{k:B.k,n:B.P.length}}),
 solve:()=>{if(SOLVE)SOLVE();},go:(id,ci,mj)=>{ac();startGame(id,ci,mj);},station:i=>openStation(i),zoo:()=>goZoo(),map:()=>goMap(),
 give:n=>{CUR=CUR??0;earnBricks(n);save();showWallet();},snacks:n=>{S.snacks=n;save();showWallet();}};
