const CATEN={hair:'Hair',top:'Tops',bottom:'Bottoms',dress:'Dresses',shoes:'Shoes',acc:'Accessories'};
const TPICS={night:'🏮🍢🧋🛍️',rain:'☔🌧️🥾🐸',space:'🚀🪐👩‍🚀🌙',newyear:'🧧🏮🐉🎆',royal:'👑🏰💎🩰',beach:'🏖️🌊🐚🕶️',sports:'🏃‍♀️⚽🏅👟',snow:'❄️⛄🧣🧤',garden:'🌸🫖🦋🌷',sea:'🐠🐙🪸🧜‍♀️',school:'🎒📚✏️🏫',camping:'⛺🔥🌲🔦',birthday:'🎂🎈🎁🎉',halloween:'🎃👻🦇🍬',concert:'🎤🎸🎶✨',autumn:'🍂🧺🍎🍁',ballet:'🩰🎀🌹🎭',fairy:'🍄🧚‍♀️🌿🦌',travel:'✈️🧳🗺️📷',candy:'🍭🍬🧁🍩'};
const tq=t=>'「'+t.zh+'」';

/* ---------- game modes: 1 theme solo · 2 face-off (computer / friend link / same device) · 3 budget ---------- */
let MODE='solo',ME='Lucas',BUDGET=0;const VS={kind:null,stage:0,p1:null,opp:null,ch:null};
'預ㄩˋ 算ㄙㄨㄢˋ 總ㄗㄨㄥˇ 共ㄍㄨㄥˋ 元ㄩㄢˊ 對ㄉㄨㄟˋ 決ㄐㄩㄝˊ 模ㄇㄛˊ 式ㄕˋ 挑ㄊㄧㄠ 戰ㄓㄢˋ 搭ㄉㄚ 電ㄉㄧㄢˋ 腦ㄋㄠˇ 朋ㄆㄥˊ 友ㄧㄡˇ 連ㄌㄧㄢˊ 結ㄐㄧㄝˊ 同ㄊㄨㄥˊ 台ㄊㄞˊ 輪ㄌㄨㄣˊ 流ㄌㄧㄡˊ 賽ㄙㄞˋ 邀ㄧㄠ 請ㄑㄧㄥˇ 你ㄋㄧˇ 名ㄇㄧㄥˊ 字ㄗˋ 贏ㄧㄥˊ 分ㄈㄣ 享ㄒㄧㄤˇ 複ㄈㄨˋ 製ㄓˋ 果ㄍㄨㄛˇ 第ㄉㄧˋ 二ㄦˋ 位ㄨㄟˋ 藏ㄘㄤˊ 起ㄑㄧˇ 最ㄗㄨㄟˋ 造ㄗㄠˋ 數ㄕㄨˋ 用ㄕㄨㄥˋ 買ㄇㄞˇ 寫ㄒㄧㄝˇ 小ㄒㄧㄠˇ 跟ㄍㄣ 已ㄧˇ 花ㄏㄨㄚ 錢ㄑㄧㄢˊ 誰ㄕㄟˊ 住ㄓㄨˋ 呢˙ㄋㄜ 鍵ㄐㄧㄢˋ'.split(' ').forEach(p=>{if(!ZD[p[0]])ZD[p[0]]=p.slice(1);});
ZD['用']='ㄩㄥˋ';ZW['名字']='ㄇㄧㄥˊ ˙ㄗ';ZW['打分數']='ㄉㄚˇ ㄈㄣ ㄕㄨˋ';
ORDER.forEach(c=>CAT[c].items.forEach(it=>it.cat=c));
const hashStr=s=>[...s].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,7);
function price(it){if(it._p!=null)return it._p;const base={hair:3,top:8,bottom:8,dress:16,shoes:7,acc:4}[it.cat];return it._p=base+(it.tags.includes('royal')?6:0)+hashStr(it.id)%5;}
function wornIn(L){const old=look;look=L;const w=worn();look=old;return w;}
const spentOf=L=>wornIn(L).reduce((a,[c,it])=>a+price(it),0);
function judgeFor(L){const old=look;look=L;const r=judge();look=old;return r;}
const clone=o=>JSON.parse(JSON.stringify(o));
/* budget: always enough for at least one outfit that fits the theme */
function makeBudget(){const fit=c=>CAT[c].items.filter(i=>i.tags.includes(theme.id)).map(price).sort((a,b)=>a-b)[0]||Math.min(...CAT[c].items.map(price));
  const min=Math.min(fit('dress'),fit('top')+fit('bottom'))+fit('shoes')+fit('hair');return Math.ceil((min+ri(10,22))/5)*5;}
function updBudget(){const p=$('budgetPill');if(MODE!=='budget'){p.hidden=true;return;}p.hidden=false;const s=spentOf(look);p.innerHTML='🪙 Spent '+s+' / Budget '+BUDGET;p.classList.toggle('over',s>BUDGET);}
/* the computer girl, 小雷, dresses for the theme too */
function genCPU(){const fits=c=>CAT[c].items.filter(i=>i.tags.includes(theme.id)),pk=c=>{const f=fits(c);return (f.length&&Math.random()<.72?pick(f):pick(CAT[c].items)).id;};
  const L={hair:pk('hair'),top:null,bottom:null,dress:null,shoes:pk('shoes'),acc:[],col:{},pat:{}};
  if(fits('dress').length&&Math.random()<.5)L.dress=pk('dress');else{L.top=pk('top');L.bottom=pk('bottom');}
  const a=fits('acc');for(let k=0;k<ri(0,2);k++){const x=(a.length&&Math.random()<.7?pick(a):pick(CAT.acc.items)).id;if(!L.acc.includes(x))L.acc.push(x);}
  ['top','bottom','dress','shoes'].forEach(k=>{if(L[k]&&Math.random()<.55)L.col[k]=PAL[pick(theme.col)];});
  if(Math.random()<.45){const k=L.dress?'dress':'top';L.pat[k]=pick(['stripes','dots','stars','hearts','flowers']);}
  return L;}
/* links: everything lives in the link itself, no server */
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const dec=s=>{try{return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/')))));}catch(e){return null;}};
const baseURL=()=>location.href.split('#')[0];
function setTheme(id){theme=THEMES.find(t=>t.id===id)||theme;$('thZh').innerHTML=theme.en;$('thPics').innerHTML=[...new Intl.Segmenter().segment(TPICS[theme.id]||'')].map(x=>'<span>'+x.segment+'</span>').join('');$('thHint').innerHTML=theme.he||'';renderScene();timeLeft=120;showTime();}
function setBadge(n){$('badge').innerHTML=zh(n)||n;}
function startRound(keepTheme){fresh();if(!keepTheme)newTheme();timeLeft=120;showTime();if(MODE==='budget'){BUDGET=makeBudget();toast('🪙 Budget: '+BUDGET+' coins',2200);}
  if(MODE==='vs'&&VS.kind==='cpu')VS.opp={name:'Rex',look:genCPU()};renderFig();renderItems();updBudget();setBadge(ME);}
/* ---------- live room: one makes a room, the other joins; same theme, same timer, walk together ---------- */
const ROOM={conn:null,peer:null,host:false,code:'',opp:'Friend',mine:null,their:null,oppReady:false,wait:null};
const rCode=()=>{const A='ABCDEFGHJKMNPQRSTUVWXYZ23456789';return [...Array(4)].map(()=>A[Math.floor(Math.random()*A.length)]).join('');};
const LOCALNET=/localnet/.test(location.search);
function loadPeer(){return new Promise((ok,no)=>{if(LOCALNET||window.Peer)return ok();const s=document.createElement('script');s.src='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';s.onload=ok;s.onerror=()=>no(new Error('net'));document.head.appendChild(s);});}
/* tiny transport: PeerJS on the web; BroadcastChannel when testing on one computer */
function mkConn(send,close){const h={data:[],close:[]};return {send,close,on:(e,f)=>h[e].push(f),_emit:(e,v)=>h[e].forEach(f=>f(v))};}
function netHost(code,onConn,onErr){if(LOCALNET){const bc=new BroadcastChannel('rs-'+code);let c=null;bc.onmessage=e=>{const m=e.data;if(m.to!=='host')return;if(!c){c=mkConn(o=>bc.postMessage({to:'guest',o}),()=>bc.close());onConn(c);}if(m.bye)c._emit('close');else c._emit('data',m.o);};return {destroy:()=>bc.close()};}
  const p=new Peer('runwaysk-'+code);p.on('connection',k=>{const c=mkConn(o=>k.send(o),()=>k.close());k.on('data',d=>c._emit('data',d));k.on('close',()=>c._emit('close'));k.on('open',()=>onConn(c));});p.on('error',e=>onErr(e));return p;}
function netJoin(code,onOpen,onErr){if(LOCALNET){const bc=new BroadcastChannel('rs-'+code);const c=mkConn(o=>bc.postMessage({to:'host',o}),()=>{bc.postMessage({to:'host',bye:1});bc.close();});bc.onmessage=e=>{if(e.data.to==='guest')c._emit('data',e.data.o);};setTimeout(()=>onOpen(c),50);return {destroy:()=>bc.close()};}
  const p=new Peer();p.on('open',()=>{const k=p.connect('runwaysk-'+code,{reliable:true});const c=mkConn(o=>k.send(o),()=>k.close());k.on('open',()=>onOpen(c));k.on('data',d=>c._emit('data',d));k.on('close',()=>c._emit('close'));});p.on('error',e=>onErr(e));return p;}
function roomLeave(){try{ROOM.conn&&ROOM.conn.send({t:'bye'});}catch(e){}try{ROOM.conn&&ROOM.conn.close();}catch(e){}try{ROOM.peer&&ROOM.peer.destroy();}catch(e){}ROOM.conn=null;ROOM.peer=null;if(ROOM.wait){ROOM.wait.remove();ROOM.wait=null;}const b=document.getElementById('oppst');if(b)b.remove();}
function roomMenu(pre){const nm=(()=>{try{return localStorage.getItem('rl_name')||'Lucas';}catch(e){return 'Lucas';}})();
  const m=modal2('<h2>🏠 Play with a friend</h2><p>Each of you plays on your own device. Same theme, same timer, then you walk the runway together!</p><p><b>Your name</b></p><input id="rn" maxlength="10" value="'+esc(nm)+'" autocomplete="off">'+
    '<div class="modes"><button class="mode" id="rMake"><span class="e">✨</span><b>Make a room</b><span>Get a code for your friend</span></button><button class="mode" id="rJoin"><span class="e">🚪</span><b>Join a room</b><span>Type your friend’s code</span></button></div>'+
    '<div id="rj" style="display:'+(pre?'block':'none')+'"><p><b>Room code</b></p><input id="rc" maxlength="4" value="'+esc(pre||'')+'" autocomplete="off" style="text-transform:uppercase;font-size:2rem;letter-spacing:.4em;text-align:center;max-width:220px"><div class="row"><button class="btn pink" id="rGo">Join ▶</button></div></div><div class="row"><button class="btn ghost" id="rX">Back</button></div>');
  const nameOf=()=>{const n=(m.querySelector('#rn').value.trim()||'Lucas').slice(0,10);try{localStorage.setItem('rl_name',n);}catch(e){}return n;};
  m.querySelector('#rX').onclick=()=>{m.remove();roomLeave();history.replaceState(null,'',baseURL());pickVS();};
  m.querySelector('#rMake').onclick=()=>{const n=nameOf();m.remove();roomCreate(n);};
  m.querySelector('#rJoin').onclick=()=>{m.querySelector('#rj').style.display='block';m.querySelector('#rc').focus();};
  m.querySelector('#rGo').onclick=()=>{const c=m.querySelector('#rc').value.trim().toUpperCase();if(c.length!==4){toast('Type the 4-letter code');return;}const n=nameOf();m.remove();roomJoin(c,n);};}
function wire(c){ROOM.conn=c;c.on('data',roomMsg);c.on('close',()=>{if(!ROOM.conn)return;ROOM.conn=null;sfx.boing();toast('😢 '+ROOM.opp+' left the room',3000);});}
async function roomCreate(name){ME=name;ROOM.host=true;ROOM.code=rCode();const url=baseURL()+'#room='+ROOM.code;
  const m=modal2('<h2>✨ Your room</h2><p>Tell your friend this code, or send the link:</p><div class="rcode">'+ROOM.code+'</div><div class="row"><button class="btn pink" id="rShare">🔗 Send link</button><button class="btn ghost" id="rCancel">Cancel</button></div><p id="rst" class="note">⏳ Waiting for your friend to join…</p><div id="rgo"></div>');
  m.querySelector('#rCancel').onclick=()=>{m.remove();roomLeave();pickVS();};
  m.querySelector('#rShare').onclick=async()=>{try{await navigator.share({title:'Runway Sketchbook',text:name+' made a fashion room! Code: '+ROOM.code,url});}catch(e){try{await navigator.clipboard.writeText(url);toast('✅ Link copied');}catch(e2){prompt('Copy this link',url);}}};
  try{await loadPeer();}catch(e){m.querySelector('#rst').textContent='⚠️ Can’t reach the internet. Check Wi-Fi and try again.';return;}
  ROOM.peer=netHost(ROOM.code,c=>{if(ROOM.conn){c.send({t:'full'});return;}wire(c);},e=>{m.querySelector('#rst').textContent='⚠️ '+(String(e.type||e).includes('unavailable-id')?'That code is busy. Cancel and try again.':'Connection problem. Cancel and try again.');});
  ROOM.onHi=(n)=>{ROOM.opp=n;sfx.win();m.querySelector('#rst').innerHTML='🎉 <b>'+esc(n)+'</b> joined!';m.querySelector('#rgo').innerHTML='<div class="row"><button class="btn pink" id="rStart">Start dressing ▶</button></div>';m.querySelector('#rStart').onclick=()=>{m.remove();roomGo();};say(n+' joined your room!');};}
async function roomJoin(code,name){ME=name;ROOM.host=false;ROOM.code=code;const m=modal2('<h2>🚪 Joining room '+esc(code)+'</h2><p id="rst" class="note">⏳ Connecting…</p><div class="row"><button class="btn ghost" id="rCancel">Cancel</button></div>');
  m.querySelector('#rCancel').onclick=()=>{m.remove();roomLeave();history.replaceState(null,'',baseURL());pickVS();};
  try{await loadPeer();}catch(e){m.querySelector('#rst').textContent='⚠️ Can’t reach the internet. Check Wi-Fi and try again.';return;}
  const to=setTimeout(()=>{if(!ROOM.conn)m.querySelector('#rst').textContent='⚠️ Can’t find room '+code+'. Check the code with your friend.';},9000);
  ROOM.peer=netJoin(code,c=>{clearTimeout(to);wire(c);c.send({t:'hi',n:name});m.querySelector('#rst').innerHTML='✅ Connected! Waiting for the room owner to start…';ROOM.joinModal=m;},e=>{clearTimeout(to);m.querySelector('#rst').textContent='⚠️ '+(String(e.type||e).includes('peer-unavailable')?'Can’t find room '+code+'. Check the code with your friend.':'Connection problem. Try again.');});}
function roomGo(){newTheme();ROOM.conn&&ROOM.conn.send({t:'go',th:theme.id,n:ME});roomRound(theme.id);}
function roomRound(th){document.querySelectorAll('.modal').forEach(x=>x.remove());if(ROOM.wait){ROOM.wait.remove();ROOM.wait=null;}
  MODE='vs';VS.kind='room';ROOM.mine=null;ROOM.their=null;ROOM.oppReady=false;fresh();setTheme(th);timeLeft=120;timerOn=true;showTime();renderFig();renderItems();setBadge(ME);
  let b=document.getElementById('oppst');if(!b){b=document.createElement('div');b.id='oppst';document.body.appendChild(b);}b.innerHTML='👀 <b>'+esc(ROOM.opp)+'</b> is dressing… no peeking!';
  sfx.win();say('Ready, set, dress! The theme is '+theme.en);}
function roomSubmit(force){if(ROOM.mine)return;const me={name:ME,look:clone(look)};ROOM.mine=me;ROOM.conn&&ROOM.conn.send({t:'look',me});
  if(ROOM.host&&ROOM.their)return roomShow();
  ROOM.wait=modal2('<h2>✅ You’re ready!</h2><p>Waiting for <b>'+esc(ROOM.opp)+'</b> to finish…</p><p class="note">'+(ROOM.oppReady?'They’re ready too!':'The timer keeps going for them.')+'</p><div class="dots"><i></i><i></i><i></i></div>');}
function roomShow(){if(!ROOM.mine||!ROOM.their)return;const E=ROOM.host?[ROOM.mine,ROOM.their]:[ROOM.their,ROOM.mine];if(ROOM.host)ROOM.conn&&ROOM.conn.send({t:'show',E});
  if(ROOM.wait){ROOM.wait.remove();ROOM.wait=null;}const b=document.getElementById('oppst');if(b)b.remove();show(E);}
