function roomMsg(d){if(!d||!d.t)return;
  if(d.t==='hi'){ROOM.opp=String(d.n||'Friend').slice(0,10);ROOM.onHi&&ROOM.onHi(ROOM.opp);}
  else if(d.t==='full'){toast('That room is already full',2500);}
  else if(d.t==='go'){ROOM.opp=String(d.n||ROOM.opp).slice(0,10);if(ROOM.joinModal){ROOM.joinModal.remove();ROOM.joinModal=null;}if(running){const r=document.querySelector('.runway');if(r)r.remove();running=false;}roomRound(d.th);}
  else if(d.t==='look'){ROOM.their=d.me;ROOM.oppReady=true;const b=document.getElementById('oppst');if(b)b.innerHTML='✅ <b>'+esc(ROOM.opp)+'</b> is ready!';tone(1320,.08,'triangle',.08);
    if(ROOM.wait){const n=ROOM.wait.querySelector('.note');if(n)n.textContent='They’re ready too!';}if(ROOM.host&&ROOM.mine)roomShow();}
  else if(d.t==='show'){if(!ROOM.mine)ROOM.mine={name:ME,look:clone(look)};if(ROOM.wait){ROOM.wait.remove();ROOM.wait=null;}const b=document.getElementById('oppst');if(b)b.remove();show(d.E);}
  else if(d.t==='bye'){const c=ROOM.conn;ROOM.conn=null;try{c&&c.close();}catch(e){}sfx.boing();toast('😢 '+ROOM.opp+' left the room',3000);}}

/* ---------- mode menu ---------- */
function modal2(html){const m=document.createElement('div');m.className='modal';m.innerHTML='<div class="mm">'+html+'</div>';document.body.appendChild(m);return m;}
function showModes(){const m=modal2('<h2>Choose a mode</h2><div class="modes">'+
  [['solo','👔','Theme Dress-up','Dress up, judges give scores'],['vs','⚔️','Fashion Face-off','Against the computer or a friend'],['budget','🪙','Budget Challenge','Shop on a budget for the best look'],['career','👑','Model Career','From new model to world supermodel']].map(([id,e,t,d])=>'<button class="mode" data-m="'+id+'"><span class="e">'+e+'</span><b>'+t+'</b><span>'+d+'</span></button>').join('')+'</div><div class="row"><button class="btn ghost" id="mirM">🪞 My face</button><button class="btn ghost" id="albM">📒 '+zh('Album')+'</button></div>');
  m.querySelector('#mirM').onclick=()=>{m.remove();maker(()=>showModes());};
  m.querySelector('#albM').onclick=()=>{m.remove();showAlbum();const w=setInterval(()=>{if(!document.querySelector('.modal')){clearInterval(w);showModes();}},300);};
  m.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{audio();const id=b.dataset.m;m.remove();if(id==='career')return careerHub();if(id==='vs')pickVS();else{MODE=id;VS.kind=null;ME='Lucas';startRound();say(id==='budget'?'Budget challenge!':'Theme dress-up!');}});}
function pickVS(){const m=modal2('<h2>Fashion Face-off</h2><div class="modes">'+
  [['room','🏠','Play with a friend','Make a room or join one'],['cpu','🤖','Vs computer','Compete with Rex'],['local','📱','Same device','Take turns, then compete'],['link','🔗','Challenge link','Send your outfit; they play later']].map(([id,e,t,d])=>'<button class="mode" data-k="'+id+'"><span class="e">'+e+'</span><b>'+t+'</b><span>'+d+'</span></button>').join('')+'</div>');
  m.querySelectorAll('.mode').forEach(b=>b.onclick=()=>{audio();m.remove();if(b.dataset.k==='room')return roomMenu();MODE='vs';VS.kind=b.dataset.k;VS.stage=0;VS.p1=null;VS.ch=null;ME='Lucas';startRound();
    say(VS.kind==='cpu'?'Compete with Rex!':VS.kind==='local'?'Player one, dress up first!':'When you’re done, send the link to your friend!');});}
/* ---------- ready: check the outfit, then the show ---------- */
function ready(){if(running)return;audio();
  const need=!look.dress&&!look.top&&!look.bottom?['top','👔','Pick a dress, or a top and a bottom!']:!look.dress&&!look.top?['top','👚','You still need a top! (or an outfit)']:!look.dress&&!look.bottom?['bottom','👖','You still need a bottom! (or an outfit)']:!look.shoes?['shoes','👟','Don’t forget shoes!']:null;
  if(need){sfx.boing();toast(need[1]+' '+zh(need[2]),2600);say(need[2]);tab=need[0];renderTabs();renderItems();const t=document.querySelector('.tab[data-c="'+need[0]+'"]');if(t){t.classList.add('need');t.scrollIntoView({block:'center',behavior:'smooth'});}return;}
  if(MODE==='budget'&&spentOf(look)>BUDGET){sfx.boing();const m='Over budget! Take something off first.';toast('🪙 '+zh(m),2600);say(m);return;}
  if(MODE==='vs'&&VS.kind==='room')return roomSubmit();
  const me={name:ME,look:clone(look)};
  if(MODE==='career'&&GIG&&GIG.opp)return show([me,GIG.opp]);
  if(MODE==='vs'&&VS.kind==='cpu')return show([me,VS.opp]);
  if(MODE==='vs'&&VS.kind==='local'){if(VS.stage===0){VS.p1=me;VS.stage=1;const m=modal2('<h2>📱 '+zh('Player two’s turn!')+'</h2><p>'+'Hide '+esc(ME)+'\'s outfit for now.'+'</p><p>'+zh('Write your name:')+'</p><input id="p2n" maxlength="8" placeholder="Friend" autocomplete="off"><div class="row"><button class="btn pink" id="p2go">'+zh('Start')+' ▶</button></div>');
      m.querySelector('#p2go').onclick=()=>{ME=(m.querySelector('#p2n').value.trim()||'Friend').slice(0,8);m.remove();startRound(true);say(ME+'\'s turn!');};return;}
    return show([VS.p1,me]);}
  if(MODE==='vs'&&VS.kind==='link'&&VS.ch)return show([VS.ch,me]);
  if(MODE==='vs'&&VS.kind==='link'){const url=baseURL()+'#c='+enc({t:theme.id,n:ME,l:me.look});
    const m=modal2('<h2>🔗 '+zh('Send this link to a friend to compete!')+'</h2><input id="lnk" readonly value="'+url+'"><div class="row"><button class="btn pink" id="shr">'+zh('Share')+'</button><button class="btn ghost" id="cpy">'+zh('Copy')+'</button><button class="btn" id="solo">'+zh('I’ll walk first')+' ▶</button></div>');
    m.querySelector('#shr').onclick=async()=>{try{await navigator.share({title:'Runway Sketchbook',text:ME+' invites you to a fashion face-off!',url:url});}catch(e){m.querySelector('#cpy').click();}};
    m.querySelector('#cpy').onclick=async()=>{try{await navigator.clipboard.writeText(url);toast('✅ '+zh('Copied'));}catch(e){const i=m.querySelector('#lnk');i.select();document.execCommand&&document.execCommand('copy');toast('✅ '+zh('Copied'));}};
    m.querySelector('#solo').onclick=()=>{m.remove();show([me]);};return;}
  show([me]);}
function runway(){ready();}
/* ---------- the show: 1 or 2 girls on the catwalk, judges score each ---------- */
const JFACE=[['#b5502e','#f8dccb','#7cc47f','short',0],['#2b2118','#a86b44','#74c0fc','curly',0],['#e2b866','#f8dccb','#9b7fd4','short',1],['#2b2118','#f1c9a5','#ffd25e','short',1]];
function judgeFace(k){const [h,sk,top,st,gl]=JFACE[k],O='#4a3426';
  const back=st==='long'?'<path d="M14 30Q12 8 32 8Q52 8 50 30L52 58H12Z" fill="'+h+'" stroke="'+O+'" stroke-width="1.2"/>':st==='curly'?'<path d="M12 30Q6 18 16 12Q22 2 34 6Q48 4 50 16Q58 26 52 38Q48 30 32 28Q16 30 12 40Z" fill="'+h+'" stroke="'+O+'" stroke-width="1.2"/>':st==='bun'?'<circle cx="32" cy="7" r="7" fill="'+h+'" stroke="'+O+'" stroke-width="1.2"/>':'';
  const front=st==='bob'?'<path d="M16 34Q14 12 32 12Q50 12 48 34L46 40Q44 26 32 22Q20 26 18 40Z" fill="'+h+'" stroke="'+O+'" stroke-width="1.2"/><path d="M18 20Q32 12 46 20" stroke="#e8505b" stroke-width="2.5" fill="none"/>':'<path d="M17 30Q18 12 32 12Q46 12 47 30Q40 20 32 21Q24 20 17 30Z" fill="'+h+'" stroke="'+O+'" stroke-width="1.2"/>';
  return '<svg viewBox="0 0 64 64" class="jf" aria-hidden="true">'+back+'<path d="M10 64Q12 48 32 46Q52 48 54 64Z" fill="'+top+'" stroke="'+O+'" stroke-width="1.2"/><path d="M28 40h8v8h-8Z" fill="'+sk+'"/>'+
   '<ellipse cx="32" cy="30" rx="14" ry="16" fill="'+sk+'" stroke="'+O+'" stroke-width="1.2"/>'+front+
   '<path d="M24 29q2.5-2 5 0M35 29q2.5-2 5 0" fill="none" stroke="'+O+'" stroke-width="1.2" stroke-linecap="round"/><circle cx="26.5" cy="31.5" r="1.6" fill="'+O+'"/><circle cx="37.5" cy="31.5" r="1.6" fill="'+O+'"/>'+
   '<ellipse cx="23" cy="36" rx="2.6" ry="1.4" fill="#ffa8a8" opacity=".7"/><ellipse cx="41" cy="36" rx="2.6" ry="1.4" fill="#ffa8a8" opacity=".7"/><path d="M28.5 39q3.5 3 7 0" fill="none" stroke="#8a3b3b" stroke-width="1.3" stroke-linecap="round"/>'+
   (gl?'<circle cx="26.5" cy="31.5" r="4.4" fill="none" stroke="'+O+'" stroke-width="1"/><circle cx="37.5" cy="31.5" r="4.4" fill="none" stroke="'+O+'" stroke-width="1"/><path d="M31 31.5h2" stroke="'+O+'"/>':'')+
   (false?'<circle cx="18" cy="38" r="1.8" fill="#ffd25e"/><circle cx="46" cy="38" r="1.8" fill="#ffd25e"/>':'')+'</svg>';}
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function show(E){running=true;POP.step=0;if(POP.on)popLevel(.26,.6);
  const budgetJ=MODE==='budget',two=E.length===2;
  const JS=E.map(e=>{const j=judgeFor(e.look);if(budgetJ){const s=spentOf(e.look),left=BUDGET-s,st=Math.max(1,Math.min(5,4+(left>=BUDGET*.2?1:0)));
      j.push(['🧮','Mr. Penn','Budget',st,'','Mr. Penn','You spent $'+s+' of your $'+BUDGET+' budget, and you still have $'+left+' left!']);}return j;});
  const R=document.createElement('div');R.className='runway'+(two?' two':'');
  R.innerHTML='<div class="cat"><div class="backdrop">'+sceneSVG(theme.id)+'</div><div class="strip"></div>'+E.map((e,i)=>'<div class="model" data-i="'+i+'">'+figureSVG(e.look,true)+'<span class="mtag">'+zh(e.name)+'</span></div>').join('')+'</div><div class="judges" id="jd"></div><div class="total" id="tot"></div>';
  $('main').appendChild(R);say(two?'Face-off time!':'Runway time!');showRunway(R);
  const jd=R.querySelector('#jd'),nJ=JS[0].length;
  for(let k=0;k<nJ;k++){const j=JS[0][k];jd.insertAdjacentHTML('beforeend','<div class="jd"><div class="f">'+judgeFace(k)+'</div><b>'+j[1]+' · '+j[2]+'</b>'+
    E.map((e,i)=>{const x=JS[i][k];return two?'<div class="pc p'+i+'"><div class="pch"><span class="mini">'+headView(figureSVG(e.look))+'</span><span class="pn">'+esc(e.name)+'</span><span class="s">'+'★'.repeat(x[3])+'☆'.repeat(5-x[3])+'</span></div><div class="r plain">'+esc(x[6])+'</div></div>':'<div class="s">'+'★'.repeat(x[3])+'☆'.repeat(5-x[3])+'</div><div class="r plain">'+esc(x[6])+'</div>';}).join('')+'</div>');}
  [...jd.children].forEach((c,i)=>setTimeout(()=>{c.classList.add('show');tone(660+i*120,.15,'triangle',.12);if(i===0&&R.scrollHeight>R.clientHeight+40)R.scrollTo({top:R.querySelector('.cat').offsetHeight*.55,behavior:'smooth'});},WALK*1000+i*700));
  const tot=JS.map(j=>j.reduce((a,x)=>a+x[3],0)),max=nJ*5;
  setTimeout(()=>{let head='';
    if(two){const w=tot[0]===tot[1]?null:(tot[0]>tot[1]?0:1);head=(w===null?'🤝 '+'It\'s a tie!':'🏆 '+esc(E[w].name)+' wins!')+' &nbsp;'+E.map((e,i)=>zh(e.name)+' '+tot[i]).join(' : ')+' / '+max+' ⭐';
      sfx.win();confetti();say(w===null?'It\'s a tie!':E[w].name+' wins!');}
    else{const t=tot[0],r=t/max,title=r>=.93?'👑 '+zh('Runway superstar!'):r>=.73?'🌟 '+zh('Fashion star!'):r>=.53?'✨ '+zh('Stylish!'):'💡 '+zh('Keep designing!');head=title+' &nbsp;'+t+' / '+max+' ⭐';sfx.win();if(r>=.73)confetti();
      sayEn(JS[0].map(x=>x[6]).join(' '));}
    R.querySelectorAll('.model').forEach((x,i)=>{const t=tot[i],st=Math.round(t/max*5),b=document.createElement('div');b.className='bigscore';const ml=parseFloat(x.style.left||'50'),narrow=R.querySelector('.cat').clientWidth<760;b.style.left=(narrow?ml:(two?(i?ml+19:ml-19):ml+24))+'%';if(narrow)b.classList.add('above');
      const sc=Math.max(1,Math.min(15,Math.round(t/max*15)));b.innerHTML='<div class="bsi sa'+sc+'">'+(sc>=13?'<div class="rays"></div>':'')+'<div class="stars">'+[...Array(5)].map((_,k)=>'<i style="--i:'+k+'"'+(k<st?'':' class="off"')+'>★</i>').join('')+'</div><div class="num">'+t+'<small> / '+max+'</small></div></div>'+(two&&tot[0]!==tot[1]&&t===Math.max(...tot)?'<div class="crown">👑</div>':'');R.querySelector('.cat').appendChild(b);scoreFX(sc,R);});
    if(MODE==='career'&&GIG){$('tot').innerHTML=head+careerResult(tot,max,two,E)+'<div class="row"><button class="btn pink" id="snapR">📸 '+zh('Photo')+'</button><button class="btn" id="toCity">🏙️ '+zh('Back to town')+' ▶</button></div>';$('snapR').onclick=()=>snap(E,tot,max);
      $('toCity').onclick=()=>{R.remove();running=false;POP.step=0;if(POP.on)popLevel(POP.vol,.6);GIG=null;careerHub();};return;}
    let extra='';if(MODE==='vs'&&VS.kind==='link'&&VS.ch&&two){const url=baseURL()+'#r='+enc({t:theme.id,a:{n:E[0].name,l:E[0].look},b:{n:E[1].name,l:E[1].look}});
      extra='<button class="btn pink" id="back2">🔗 '+'Send the result back to '+esc(E[0].name)+'</button>';R._url=url;}
    $('tot').innerHTML=head+'<div class="row">'+extra+'<button class="btn pink" id="snapR">📸 '+zh('Photo')+'</button><button class="btn" id="again">'+zh('Play again')+' ▶</button>'+(two?'':'<button class="btn ghost" id="keep">'+zh('Keep dressing')+'</button>')+'<button class="btn ghost" id="albR">📒 '+zh('Album')+'</button><button class="btn ghost" id="modeB">🏠 '+zh('Modes')+'</button></div>';
    $('snapR').onclick=()=>snap(E,tot,max);$('albR').onclick=showAlbum;
    const close=()=>{R.remove();running=false;POP.step=0;if(POP.on)popLevel(POP.vol,.6);};
    if($('back2'))$('back2').onclick=async()=>{try{await navigator.share({title:'Runway Sketchbook',url:R._url});}catch(e){try{await navigator.clipboard.writeText(R._url);toast('✅ '+zh('Copied'));}catch(e2){prompt('',R._url);}}};
    $('again').onclick=()=>{close();if(MODE==='vs'&&VS.kind==='room'){if(ROOM.host){if(ROOM.conn)roomGo();else toast('Your friend left the room',2500);}else{ROOM.wait=modal2('<h2>⏳ Next round</h2><p>Waiting for <b>'+esc(ROOM.opp)+'</b> to start…</p><div class="dots"><i></i><i></i><i></i></div>');}return;}if(MODE==='vs'&&VS.kind==='link'&&VS.ch){VS.ch=null;history.replaceState(null,'',baseURL());ME='Lucas';}VS.stage=0;VS.p1=null;if(MODE==='vs'&&VS.kind==='local')ME='Lucas';startRound();};
    if($('keep'))$('keep').onclick=()=>{close();timeLeft=Math.max(timeLeft,60);showTime();};
    $('modeB').onclick=()=>{close();if(VS.kind==='room')roomLeave();history.replaceState(null,'',baseURL());showModes();};},WALK*1000+nJ*700);}
