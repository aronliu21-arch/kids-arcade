/* ---------- Duo battle: Nora vs Lucas on two devices with a 4-digit room code ----------
   Finding each other: the free public PeerJS relay (0.peerjs.com) passes a few setup messages,
   then the two devices talk directly (WebRTC). If a direct link can't be made in time, the
   game messages go through the relay instead. The room maker's device runs the battle
   (it holds the true state) and sends it to the other device after every move. */
const DUO_NS='liukidscq-';
const NET={};
function netReset(){try{NET.dc&&NET.dc.close();}catch(e){}try{NET.pc&&NET.pc.close();}catch(e){}try{NET.ws&&NET.ws.close();}catch(e){}
 clearInterval(NET.hb);clearInterval(NET.ping);clearTimeout(NET.t1);clearTimeout(NET.t2);
 Object.keys(NET).forEach(k=>delete NET[k]);}
function sigSend(type,payload){try{NET.ws&&NET.ws.send(JSON.stringify({type,payload,dst:NET.peer}));}catch(e){}}
/* the relay connection; window.__duoBC swaps in a same-browser stand-in for automated tests */
function sigOpen(id,onOpen,onFail){NET.id=id;
 if(window.__duoBC){const bc=new BroadcastChannel('cqduo');NET.ws={send:s=>{const o=JSON.parse(s);if(o.type==='HEARTBEAT')return;o.src=id;bc.postMessage(o);},close:()=>bc.close()};
  bc.onmessage=e=>{if(e.data.dst===id)sigMsg(e.data);};setTimeout(()=>onOpen(),60);NET.onOpen=onOpen;return;}
 let ws;try{ws=new WebSocket(`wss://0.peerjs.com/peerjs?key=peerjs&id=${id}&token=${Math.random().toString(36).slice(2,12)}&version=1.5.4`);}catch(e){return onFail('net');}
 NET.ws=ws;NET.onOpen=onOpen;NET.onFail=onFail;
 ws.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch(x){return;}if(m.type==='OPEN'){const f=NET.onOpen;NET.onOpen=null;f&&f();}else if(m.type==='ID-TAKEN'){onFail('taken');}else if(m.type==='ERROR'){onFail('net');}else sigMsg(m);};
 ws.onerror=()=>{if(!NET.live)onFail('net');};ws.onclose=()=>{if(!NET.live&&!NET.closing)onFail('net');};
 NET.hb=setInterval(()=>{try{ws.readyState===1&&ws.send('{"type":"HEARTBEAT"}');}catch(e){}},5000);}
function mkPC(){const pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});NET.qc=[];
 pc.onicecandidate=e=>{if(e.candidate)sigSend('CANDIDATE',{c:e.candidate.toJSON?e.candidate.toJSON():e.candidate});};
 pc.onconnectionstatechange=()=>{if(['failed','closed'].includes(pc.connectionState)&&NET.live&&!NET.relay)duoLost();};return pc;}
function wireDC(dc){NET.dc=dc;dc.onopen=()=>netLive(false);dc.onmessage=e=>{try{netIn(JSON.parse(e.data));}catch(x){}};dc.onclose=()=>{if(NET.live&&!NET.relay&&!NET.closing)duoLost();};}
async function sigMsg(m){const p=m.payload||{};
 if(m.type==='OFFER'&&NET.host){if(NET.peer&&NET.peer!==m.src)return;NET.peer=m.src;const pc=NET.pc=mkPC();pc.ondatachannel=e=>wireDC(e.channel);
  try{await pc.setRemoteDescription(p.sdp);for(const c of NET.qc)await pc.addIceCandidate(c).catch(()=>{});NET.qc=null;const a=await pc.createAnswer();await pc.setLocalDescription(a);sigSend('ANSWER',{sdp:pc.localDescription});}catch(e){}
  netFallbackTimer();duoStatus('🔗 Connecting to the other player…');}
 else if(m.type==='ANSWER'&&!NET.host&&NET.pc){NET.got=true;clearTimeout(NET.t1);try{await NET.pc.setRemoteDescription(p.sdp);for(const c of NET.qc)await NET.pc.addIceCandidate(c).catch(()=>{});NET.qc=null;}catch(e){}netFallbackTimer();}
 else if(m.type==='CANDIDATE'){if(p.g){if(!NET.live)netLive(true);netIn(p.g);return;}if(!p.c||!NET.pc)return;if(NET.qc)NET.qc.push(p.c);else NET.pc.addIceCandidate(p.c).catch(()=>{});}
 else if(m.type==='EXPIRE'&&!NET.host&&!NET.got)duoNoRoom();
 else if(m.type==='LEAVE'&&NET.live)duoLost();}
/* if the direct link isn't up after 9 seconds, use the relay for game messages */
function netFallbackTimer(){clearTimeout(NET.t2);NET.t2=setTimeout(()=>{if(!NET.live){netLive(true);netSend({t:'relay'});}},9000);}
function netLive(relay){if(NET.live)return;NET.live=true;NET.relay=relay;NET.seen=Date.now();
 NET.ping=setInterval(()=>{netSend({t:'ping'});if(Date.now()-NET.seen>20000)duoLost();},4000);
 netSend({t:'hi',kid:KID,n:ME.n,col:ME.col,g:ME.g});}
function netSend(o){try{if(NET.dc&&NET.dc.readyState==='open'&&!NET.relay)NET.dc.send(JSON.stringify(o));else if(NET.live)sigSend('CANDIDATE',{g:o});}catch(e){}}
function netIn(m){NET.seen=Date.now();if(m.t==='ping')return;if(m.t==='relay'){if(!NET.relay){NET.relay=true;}return;}duoIn(m);}

/* ---------- screens: make a room / join a room ---------- */
let DU=null; // this device's view of the duo game
function duoMenu(){netReset();DU=null;const o=ME.otherN;
 setScreen('duo',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">👫 Duo Battle ${zh([['雙','ㄕㄨㄤ'],['人','ㄖㄣˊ'],['對','ㄉㄨㄟˋ'],['戰','ㄓㄢˋ']])}</h2>
 <p style="font-weight:700">Battle ${o} on another iPad or phone! Both of you need the internet.</p>
 <div class="duob"><button class="cupb" data-a="mk"><span class="e">🏠</span><b>Make a room</b><small>You get a 4-digit code</small></button><button class="cupb" data-a="jn"><span class="e">🔢</span><b>Join a room</b><small>Type ${o}’s code</small></button></div>
 <div class="tip" style="text-align:left">🤝 Shake hands before and after. Say “Good game!” at the end.<br>🎁 You <b>both</b> get a mystery card after the battle!</div>
 <div class="row"><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({home:()=>hub(),mk:()=>duoHost(0),jn:()=>duoJoinPad('')});}
function duoWait(h){setScreen('duo',`<div class="hub"><div class="panel" style="text-align:center">${h}<p id="dst" class="dst"></p><div class="row"><button class="btn ghost" data-a="x">✖ Cancel</button></div></div></div>`);bindAll({x:()=>{NET.closing=true;duoMenu();}});}
function duoStatus(t){const e=$('dst');if(e)e.textContent=t;}
function duoHost(tries){netReset();const code=String(ri(1000,9999));NET.host=true;NET.code=code;
 duoWait(`<h2 class="h">🏠 Your room</h2><p style="font-weight:700">Tell ${ME.otherN} to tap <b>Join a room</b> and type:</p><div class="bigcode">${code.split('').map(d=>`<span>${d}</span>`).join('')}</div>`);duoStatus('Opening the room…');
 sigOpen(DUO_NS+code,()=>duoStatus(`⏳ Waiting for ${ME.otherN}…`),why=>{if(why==='taken'&&tries<4)return duoHost(tries+1);duoNet();});}
function duoJoinPad(v){const o=ME.otherN;
 setScreen('duo',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">🔢 Join ${o}’s room</h2><p style="font-weight:700">Type the 4 numbers on ${o}’s screen.</p>
 <div class="bigcode">${[0,1,2,3].map(i=>`<span class="${v[i]?'':'empty'}">${v[i]||''}</span>`).join('')}</div>
 <div class="keys">${[1,2,3,4,5,6,7,8,9,'⌫',0,'✔'].map(k=>`<button class="btn ${k==='✔'?'gold':''}" data-a="k" data-v="${k}" ${k==='✔'&&v.length<4?'disabled':''}>${k}</button>`).join('')}</div>
 <div class="row"><button class="btn ghost" data-a="back">◀ Back</button></div></div></div>`);
 bindAll({back:duoMenu,k(k){if(k==='⌫')return duoJoinPad(v.slice(0,-1));if(k==='✔')return duoJoin(v);if(v.length<4){sfx.pop();duoJoinPad(v+k);}}});}
function duoJoin(code){netReset();NET.host=false;NET.code=code;NET.peer=DUO_NS+code;
 duoWait(`<h2 class="h">🔢 Room ${code}</h2><div class="spin">🃏</div>`);duoStatus('Looking for the room…');
 sigOpen(DUO_NS+code+'-g'+Math.random().toString(36).slice(2,7),async()=>{const pc=NET.pc=mkPC();wireDC(pc.createDataChannel('cq'));
  try{const off=await pc.createOffer();await pc.setLocalDescription(off);sigSend('OFFER',{sdp:pc.localDescription});}catch(e){return duoNet();}
  NET.t1=setTimeout(()=>{if(!NET.got)duoNoRoom();},10000);},()=>duoNet());}
function duoNoRoom(){if(SCREEN!=='duo')return;const c=NET.code;netReset();sfx.bad();
 modal(`<div class="big">🤔</div><h2>No room ${c}</h2><p>Check the 4 numbers on ${ME.otherN}’s screen, and make sure ${ME.otherN} made the room first.</p>`,[['Try again',()=>duoJoinPad('')],['Back',duoMenu,'ghost']]);}
function duoNet(){if(SCREEN!=='duo'&&SCREEN!=='duob')return;netReset();sfx.bad();
 modal(`<div class="big">📶</div><h2>Can’t connect</h2><p>Check that this device is on the internet, then try again.</p>`,[['OK',duoMenu]]);}
function duoLost(){if(!NET.live||NET.closing)return;NET.closing=true;const st=DU&&DU.st;netReset();
 if(st&&st.phase==='prize')return;toast('📶 Lost the connection to the other player',3000);sfx.bad();setTimeout(()=>{if(['duo','duob'].includes(SCREEN))duoMenu();},400);}

/* ---------- the game: host holds DU.st and sends it after every change ---------- */
function duoIn(m){if(m.t==='hi'){DU={me:NET.host?0:1,foe:m,st:null};sfx.good();if(NET.host){DU.st={phase:'pick',turn:0,log:'',fx:null,seq:0,p:[duoP({kid:KID,n:ME.n,col:ME.col,g:ME.g}),duoP(m)]};duoPush();}return;}
 if(m.t==='st'){if(NET.host)return;if(!DU)DU={me:1,foe:{},st:null};DU.st=m.st;duoShow();return;}
 if(NET.host&&DU&&DU.st)duoAct(1,m);}
const duoP=h=>({kid:h.kid,n:h.n,col:h.col,g:!!h.g,team:null,hp:[],ko:[],idx:0,en:0,shook:0});
function duoPush(){DU.st.seq++;netSend({t:'st',st:DU.st});duoShow();}
function duoMine(m){if(!DU||!DU.st)return;if(NET.host)duoAct(0,m);else netSend(m);}
function duoAct(s,m){const st=DU.st,P=st.p[s],F=st.p[1-s];st.fx=null;
 if(m.t==='team'&&st.phase==='pick'&&!P.team){P.team=m.ids.slice(0,3);P.hp=P.team.map(id=>byId(id).hp);P.ko=[0,0,0];
  if(st.p.every(p=>p.team)){st.phase='shake1';}}
 else if(m.t==='shake'){if(st.phase==='shake1'||st.phase==='gg'){P.shook=1;if(st.p.every(p=>p.shook)){st.p.forEach(p=>p.shook=0);if(st.phase==='shake1'){st.phase='battle';st.turn=Math.random()<.5?0:1;st.drew=0;st.sw=0;st.log=`🪙 Coin flip: <b>${st.p[st.turn].n}</b> goes first!`;}else st.phase='prize';}}}
 else if(st.phase==='battle'&&st.turn===s){const c=byId(P.team[P.idx]),foe=byId(F.team[F.idx]);
  if(m.t==='draw'&&!st.drew){const n=Math.random()<.6?1:2;P.en+=n;st.drew=1;st.log=`${P.n} drew <b>+${n}</b> ⚡`;st.fx={k:'en',s};}
  else if(m.t==='atk'&&st.drew){const a=c.atk[+m.i];if(!a||P.en<a.c)return;P.en-=a.c;const weak=WEAK[foe.type]===c.type,dmg=a.d*(weak?2:1);F.hp[F.idx]=Math.max(0,F.hp[F.idx]-dmg);
   st.log=`${P.n}’s <b>${c.name}</b> used <b>${a.n}</b>! ${dmg} damage${weak?' (×2!)':''}`;st.fx={k:'hit',s,a:a.n,type:c.type,dmg,weak};
   if(!F.hp[F.idx]){F.ko[F.idx]=1;const nx=F.ko.findIndex(k=>!k);st.log+=`<br>💥 ${foe.name} is knocked out!`;st.fx.ko=1;
    if(nx<0){st.phase='gg';st.win=s;st.log+=`<br>🏆 <b>${P.n}</b> wins!`;return duoPush();}F.idx=nx;st.log+=` ${F.n} sends out <b>${byId(F.team[nx]).name}</b>.`;}
   duoNext(st);}
  else if(m.t==='sw'&&!st.sw){const j=+m.i,rc=retreatCost(c);if(j===P.idx||P.ko[j]||P.en<rc)return;P.en-=rc;P.idx=j;st.sw=1;st.log=`🔄 ${P.n} switched to <b>${byId(P.team[j]).name}</b>`;st.fx={k:'sw',s};}
  else if(m.t==='end'&&st.drew){st.log=`${P.n} ended the turn.`;duoNext(st);}
  else return;}
 else return;
 duoPush();}
function duoNext(st){st.turn=1-st.turn;st.drew=0;st.sw=0;}
let duoLastSeq=-1,duoLastPhase='';
function duoShow(){const st=DU.st;if(!st)return;const me=DU.me,P=st.p[me],F=st.p[1-me];
 const phase=st.phase,newPhase=phase!==duoLastPhase;duoLastPhase=phase;
 if(phase==='pick'){if(P.team)return duoWait2(`✅ Team ready! Waiting for ${F.n} to pick…`);if(SCREEN!=='duopick')duoPick();return;}
 if(phase==='shake1'||phase==='gg')return duoShake(phase,newPhase);
 if(phase==='prize')return duoPrize();
 if(phase==='battle')return duoBattle(newPhase);}
function duoWait2(t){setScreen('duob',`<div class="hub"><div class="panel" style="text-align:center"><div class="spin">🃏</div><h2 class="h">${t}</h2></div></div>`);}
function duoPick(){const sel=[],F=DU.st.p[1-DU.me];const mine=Object.keys(S.owned).map(Number).sort((a,b)=>pw(byId(b))-pw(byId(a)));
 setScreen('duopick',`<div class="hub"><div class="panel"><h2 class="h" style="text-align:center">👫 Connected with ${F.n}!</h2><p style="text-align:center;font-weight:700">Pick your 3 best cards (<b id="pc">0</b>/3)</p>
 <div class="pickgrid">${mine.map(id=>`<button class="pickc" data-a="t" data-v="${id}">${cardHTML(byId(id))}</button>`).join('')}</div>
 <div class="row"><button class="btn gold" id="rdy" data-a="go" disabled>✅ Ready!</button><button class="btn ghost" data-a="x">✖ Leave</button></div></div></div>`);
 bindAll({t(id,b){id=+id;const k=sel.indexOf(id);if(k>=0){sel.splice(k,1);b.classList.remove('sel');}else if(sel.length<3){sel.push(id);b.classList.add('sel');}sfx.pop();$('pc').textContent=sel.length;$('rdy').disabled=sel.length!==3;},
  go:()=>{if(sel.length===3){sfx.good();duoMine({t:'team',ids:sel});if(!NET.host)duoWait2(`✅ Team ready! Waiting for ${F.n} to pick…`);}},x:duoQuit});}
function duoQuit(){modal(`<h2>Leave the duo battle?</h2>`,[['Leave',()=>{NET.closing=true;duoMenu();}],['Stay',null,'ghost']]);}
function duoShake(phase,fresh){const st=DU.st,P=st.p[DU.me],F=st.p[1-DU.me],end=phase==='gg',won=st.win===DU.me;
 if(fresh&&end){if(won){sfx.win();confetti();}else sfx.good();setTimeout(()=>shout('Good game!'),500);}
 const av=p=>p.kid===KID?MEAV:(p.g?NORA:LUCAS);
 setScreen('duob',`<div class="hub"><div class="panel hshake" style="text-align:center">
 ${end?`<div class="gg">Good game! <div class="ggz">${zh([['好','ㄏㄠˇ'],['比','ㄅㄧˇ'],['賽','ㄙㄞˋ']])}</div></div><p style="font-weight:800;font-size:1.15rem">${won?`🏆 You won! Great battle, ${P.n}!`:`${F.n} won this time. Great try, ${P.n}!`}</p>`:`<h2 class="h">Before you battle…</h2>`}
 <div class="hands"><div class="hav">${av(P)}<b>${P.n}</b>${P.shook?'<span class="ok">✅</span>':''}</div><div class="hs ${P.shook&&F.shook?'done':''}">🤝</div><div class="hav">${av(F)}<b>${F.n}</b>${F.shook?'<span class="ok">✅</span>':''}</div></div>
 <p style="font-size:1.2rem;font-weight:800">${end?`Shake hands with ${F.n} and say <b>“Good game!”</b>`:`Shake hands with ${F.n}! 🤝`}</p>
 <div class="row">${P.shook?`<p style="font-weight:700">⏳ Waiting for ${F.n} to tap…</p>`:`<button class="btn gold big" data-a="sh">🤝 We shook hands${end?' and said “Good game!”':'!'}</button>`}</div></div></div>`);
 bindAll({sh:()=>{sfx.good();duoMine({t:'shake'});}});}
function duoPrize(){if(DU.prized)return;DU.prized=true;const st=DU.st,won=st.win===DU.me,F=st.p[1-DU.me];
 S.duo=S.duo||{games:0,wins:0};S.duo.games++;if(won){S.duo.wins++;S.wins=(S.wins||0)+1;}save();
 NET.closing=true;setTimeout(netReset,1500);
 const c=prizeCard([['rare',5],['holo',4],['legend',1]]);
 bigReveal(c,'🎁 Mystery card!',`For a great duo battle with ${F.n}!`,()=>hub());}
function duoBattle(fresh){const st=DU.st,me=DU.me,P=st.p[me],F=st.p[1-me],my=st.turn===me,c=byId(P.team[P.idx]),foe=byId(F.team[F.idx]);
 const side=(p,cd,isMe)=>`<div class="dside ${isMe?'me':'op'} ${st.turn===(isMe?me:1-me)?'turn':''}"><div class="dwho"><b style="color:${p.col}">${p.n}</b> ${p.team.map((id,i)=>`<i class="dd ${p.ko[i]?'ko':i===p.idx?'on':''}" style="--c:${T[byId(id).type].c}">${p.ko[i]?'✖':''}</i>`).join('')} <span class="den">⚡${p.en}</span></div>
  <div class="dcard" id="dc-${isMe?'me':'op'}">${cardHTML(cd)}</div><div class="hpb"><i style="width:${p.hp[p.idx]/cd.hp*100}%"></i></div><b>${p.hp[p.idx]}/${cd.hp}</b></div>`;
 setScreen('duob',`<div class="dbat">${side(F,foe,false)}<div class="dmid"><div class="dlog">${st.log||''}</div><div class="dturn">${my?`🟢 <b>Your turn, ${P.n}!</b>`:`⏳ ${F.n}’s turn…`}</div>
 <div class="dctrl"><button class="btn gold" data-a="draw" ${!my||st.drew?'disabled':''}>⚡ Draw energy</button>
 ${c.atk.map((a,i)=>`<button class="btn" data-a="atk" data-v="${i}" ${!my||!st.drew||P.en<a.c?'disabled':''}>${'⚡'.repeat(a.c)} ${a.n} · ${a.d}${WEAK[foe.type]===c.type?' ×2':''}</button>`).join('')}
 ${P.ko.filter(k=>!k).length>1?`<button class="btn ghost" data-a="sw" ${!my||st.sw||P.en<retreatCost(c)?'disabled':''}>🔄 Switch ${'⚡'.repeat(retreatCost(c))}</button>`:''}
 <button class="btn ghost" data-a="end" ${!my||!st.drew?'disabled':''}>End turn</button></div></div>${side(P,c,true)}</div>`);
 bindAll({draw:()=>duoMine({t:'draw'}),atk:i=>duoMine({t:'atk',i:+i}),end:()=>duoMine({t:'end'}),
  sw:()=>{const al=P.team.map((_,i)=>i).filter(i=>i!==P.idx&&!P.ko[i]);modal(`<h2>Switch to which card?</h2><div class="row">${al.map(i=>`<button class="pickc bench" data-i="${i}" style="width:110px">${cardHTML(byId(P.team[i]))}<span class="bhp">❤️ ${P.hp[i]}</span></button>`).join('')}</div>`,[['Cancel',null,'ghost']]);
   document.querySelectorAll('.modal .bench').forEach(b=>b.onclick=()=>{b.closest('.modal').remove();duoMine({t:'sw',i:+b.dataset.i});});}});
 if(fresh)shout('Battle start!');
 const fx=st.fx;if(!fx||DU.fxSeq===st.seq)return;DU.fxSeq=st.seq;
 if(fx.k==='en'){sfx.energy&&sfx.energy();}
 else if(fx.k==='sw'){whoosh();}
 else if(fx.k==='hit'){const tgt=$(fx.s===me?'dc-op':'dc-me'),src=$(fx.s===me?'dc-me':'dc-op');const [x,y]=ctr(tgt);
  try{(ATKSND[fx.type]||boom)();}catch(e){}if(src)src.classList.add('lunge');
  setTimeout(()=>{FX.emit(x,y,fx.type,fx.weak?40:24,{speed:7});if(fx.weak)FX.flash('#fff');boom();if(tgt){tgt.classList.add('hit');const d=document.createElement('div');d.className='dmgf';d.textContent='-'+fx.dmg+(fx.weak?' ×2!':'');tgt.appendChild(d);}
   if(fx.ko){setTimeout(()=>{FX.ring(x,y,'#ff6b6b',120);sfx.bad();},300);}},250);}}
/* leaving the duo screens (Home, back) closes the connection; the other player sees "lost connection" */
function duoLeaveCheck(n){if(!['duo','duob','duopick'].includes(n)&&(NET.ws||NET.pc)&&!(DU&&DU.prized)){NET.closing=true;netReset();}}
