
let TODAY=day0(new Date());
const KID={
  nora:{id:'nora',name:'Nora',num:9,color:'#7048e8',rounds:6,hints:false,nOpt:4},
  lucas:{id:'lucas',name:'Lucas',num:6,color:'#f76707',rounds:6,hints:true,nOpt:3},
  milo:{id:'milo',name:'Milo',num:3,color:'#2b8a3e',rounds:5,hints:true,nOpt:2}
};
const MISSIONS={
  big:[
    {id:'clock',e:'🕒',t:'What Time Is It?',b:'Read the clock hands',bank:clockBank,tip:'At dinner time, look at a clock and tell a grown-up what time it is.'},
    {id:'set',e:'⏰',t:'Set the Clock',b:'Drag the hands to the right time',bank:setBank,tip:'Ask a grown-up what time bedtime is, then find it on a real clock.'},
    {id:'days',e:'📆',t:'Days of the Week',b:'Yesterday, today, tomorrow',bank:daysBank,tip:'Every morning, say what day it is today and what day tomorrow will be.'},
    {id:'months',e:'🍂',t:'Months & Seasons',b:'12 months, 4 seasons',bank:monthsBank,tip:'Find your birthday month on a calendar and count how many months away it is.'},
    {id:'us',e:'🎆',t:'US Holidays',b:'Fireworks, turkey and more',bank:k=>holBank(k,['us']),tip:'Find the next US holiday on a calendar at home.'},
    {id:'tw',e:'🏮',t:'Taiwan Holidays',b:'Lanterns, mooncakes, zongzi',bank:k=>holBank(k,['tw']),tip:'Ask a grown-up which Taiwan holiday they loved most as a kid, and why.'},
    {id:'world',e:'🌍',t:'World Festivals',b:'Lights, colors and candles',bank:k=>holBank(k,['world']),tip:'Ask a friend which holidays their family celebrates.'},
    {id:'fun',e:'🧋',t:'Fun Food Days',b:'Boba, ramen, pizza, pi',bank:k=>holBank(k,['fun']),tip:'Pick a fun food day and plan a treat with your family.'},
    {id:'count',e:'⏳',t:'Countdown',b:'How long until the next holiday?',bank:countBank,tip:'Pick a day you are excited about and cross off each day on a calendar.'}
  ],
  milo:[
    {id:'mclock',e:'🕒',t:'Clock Time',b:'',bank:clockBank,tip:'Look at a clock with a grown-up. Where is the short hand?'},
    {id:'daynight',e:'🌙',t:'Day or Night',b:'',bank:dayNightBank,tip:'Look out the window. Is it day or night?'},
    {id:'pics',e:'🎃',t:'Holiday Pictures',b:'',bank:picsBank,tip:'Find a pumpkin, a lantern or a heart in a book.'},
    {id:'seasons',e:'⛄',t:'Seasons',b:'',bank:seasonsBank,tip:'Is it hot or cold outside today?'}
  ]
};
const MIX={id:'mix',e:'🎲',t:'Holiday Mix',b:'A bit of everything',tip:'Tell someone one new thing you learned about time or holidays today.'};
const listFor=id=>id==='milo'?MISSIONS.milo:MISSIONS.big;

/* ---------- saved data ---------- */
const KEY='calendarQuest.v1';
let DB={p:{},sound:true,introN:0};
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.p)DB=Object.assign(DB,s);}catch(e){}
function prof(id){if(!DB.p[id])DB.p[id]={stars:{},seen:[],voice:id!=='nora',rev:0};return DB.p[id];}
const store={save(){try{localStorage.setItem(KEY,JSON.stringify(DB));}catch(e){}cloudSave();}};
const streaks={nora:0,lucas:0,milo:0};

const $=id=>document.getElementById(id);
let cur=null,mission=null,qs=[],qi=0,pts=0,tries=0,answered=false,screen='home',lastResult=null;

/* ---------- audio: effects + speech ---------- */
let ac=null;
function audio(){if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)();}catch(e){ac=null;}}if(ac&&ac.state==='suspended'){try{ac.resume();}catch(e){}}return ac;}
function tone(f,d,type,vol,delay){
  if(!DB.sound)return;const c=audio();if(!c)return;
  try{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(delay||0);o.type=type||'sine';o.frequency.value=f;o.connect(g);g.connect(c.destination);
    g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d+.03);}catch(e){}
}
const sfx={good(){[523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',.18,i*.08));},bad(){tone(220,.25,'sawtooth',.08);tone(165,.3,'sawtooth',.07,.12);},
  tick(){tone(1400,.03,'square',.05);},star(){[660,880,1320].forEach((f,i)=>tone(f,.25,'triangle',.16,i*.12));},chime(){[784,988,1175].forEach((f,i)=>tone(f,.6,'sine',.12,i*.18));}};
function speakable(html){
  return String(html).replace(/<span class="z">.*?<\/span>/g,'').replace(/<[^>]+>/g,'').replace(/[㄀-ㄯˊˇˋ˙㐀-鿿]+/g,'')
    .replace(/\(\s*\)/g,'').replace(/\s+([,.!?])/g,'$1').replace(/\s{2,}/g,' ').trim();
}
function say(t){
  if(!cur||!prof(cur.id).voice||!('speechSynthesis' in window))return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(speakable(t));u.rate=cur.id==='milo'?.85:.95;u.pitch=1.1;u.lang='en-US';speechSynthesis.speak(u);}catch(e){}
}
const pr=t=>String(t).replace(/\{name\}/g,cur?cur.name:'');

/* ---------- screens ---------- */
function show(id){
  screen=id;['home','map','play','result','cal'].forEach(s=>$(s).hidden=s!==id);
  $('back').hidden=id==='home';
  $('roundInfo').hidden=$('ptsInfo').hidden=id!=='play';
  $('voiceBtn').hidden=!(cur&&(id==='play'||id==='map'));
  if(cur){$('voiceBtn').setAttribute('aria-pressed',String(!!prof(cur.id).voice));}
  const bt=id==='cal'?['📅','Holiday Calendar']:id==='play'&&mission?[mission.e,mission.id==='mix'&&cur&&cur.id==='milo'?'Dino Mix':mission.t]:['🕰️',RB('時間專家','ㄕˊ ㄐㄧㄢ ㄓㄨㄢ ㄐㄧㄚ')+' Time Expert'];
  $('brand').innerHTML='<span class="be">'+bt[0]+'</span> <span class="bt">'+bt[1]+'</span>';document.body.classList.toggle('playing',id==='play');
  if(id!=='play'&&'speechSynthesis' in window)try{speechSynthesis.cancel();}catch(e){}
  musicSync();
}
const starStr=n=>'★'.repeat(n)+'☆'.repeat(3-n);
const totalStars=id=>listFor(id).concat([MIX]).reduce((a,m)=>a+(prof(id).stars[m.id]||0),0);

/* ---------- weekly goal (Week 1 = Sat Nov 28 – Sun Dec 6 2026, then Monday–Sunday weeks) ---------- */
const GOALS={lucas:{m:'clock',n:3,min:2},nora:{m:'clock',n:4,min:2}};
function weekOf(d){const W1=new Date(2026,10,28),W2=new Date(2026,11,7),x=day0(d);
  if(x<W2){return{no:1,from:W1,to:new Date(2026,11,6)};}
  const k=Math.floor(daysBetween(W2,x)/7),f=new Date(2026,11,7+7*k);return{no:2+k,from:f,to:new Date(f.getFullYear(),f.getMonth(),f.getDate()+6)};}
function goalState(id){const g=GOALS[id];if(!g)return null;const w=weekOf(new Date()),p=prof(id);
  if(!p.wk||p.wk.no!==w.no)p.wk={no:w.no,rounds:[]};
  const done=p.wk.rounds.filter(r=>r.stars>=g.min).length;return{g:g,w:w,done:Math.min(done,g.n),met:done>=g.n,tries:p.wk.rounds.length};}
function goalCard(id){const s=goalState(id);if(!s)return '';const m=listFor(id).find(x=>x.id===s.g.m);
  const dots=Array.from({length:s.g.n},(_,i)=>'<span class="gd'+(i<s.done?' on':'')+'">'+(i<s.done?'★':'')+'</span>').join('');
  return '<div class="goal'+(s.met?' met':'')+'"><div class="gt">🎯 '+RB('本週目標','ㄅㄣˇ ㄓㄡ ㄇㄨˋ ㄅㄧㄠ')+' Week '+s.w.no+' goal <span class="gr">'+fmtDate(s.w.from)+' – '+fmtDate(s.w.to)+'</span></div>'+
    '<div class="gb">Play <b>'+m.e+' '+m.t+'</b> '+s.g.n+' times and get <b>'+'★'.repeat(s.g.min)+'</b> or better each time.</div>'+
    '<div class="gp">'+dots+' <b>'+s.done+' / '+s.g.n+'</b>'+(s.met?' ✅ '+RB('完成','ㄨㄢˊ ㄔㄥˊ')+' Done!':'')+'</div></div>';}
function goalRound(stars){if(!cur||!mission)return '';const s0=goalState(cur.id);if(!s0||mission.id!==s0.g.m)return '';
  const p=prof(cur.id);p.wk.rounds.push({t:Date.now(),stars:stars,pts:pts,max:qs.length*2});const s=goalState(cur.id);
  return s.met?'🎯 Weekly goal done! '+s.done+' / '+s.g.n+' ✅':stars>=s.g.min?'🎯 This one counts! Weekly goal: '+s.done+' / '+s.g.n:'🎯 Get '+'★'.repeat(s.g.min)+' to count it. Weekly goal: '+s.done+' / '+s.g.n;}
function renderHome(){
  $('kits').innerHTML='';
  ['nora','lucas','milo'].forEach(id=>{const k=KID[id],b=document.createElement('button');b.className='kit '+id;
    b.innerHTML='<div class="num">'+k.num+'</div><div class="nm">'+k.name+'</div><div class="st">★ '+totalStars(id)+' / '+(listFor(id).length+1)*3+'</div>';
    b.onclick=()=>{cur=k;renderMap();show('map');};$('kits').appendChild(b);});
}
function renderMap(){
  const p=prof(cur.id),L=listFor(cur.id);
  $('who').innerHTML='<span style="color:'+cur.color+'">'+cur.name+'</span>’s missions';
  $('mapStars').textContent='★ '+totalStars(cur.id)+' / '+(L.length+1)*3;
  $('goalBox').innerHTML=goalCard(cur.id);const gs=goalState(cur.id);
  const g=$('missions');g.className='grid'+(cur.id==='milo'?' two':'');g.innerHTML='';
  L.forEach(m=>{const b=document.createElement('button');b.className='mcard'+(gs&&gs.g.m===m.id&&!gs.met?' goalm':'');
    b.innerHTML='<div class="em">'+m.e+'</div><div class="tt">'+m.t+'</div>'+(m.b?'<div class="bl">'+m.b+'</div>':'')+'<div class="stars">'+starStr(p.stars[m.id]||0)+'</div>';
    b.onclick=()=>startMission(m);g.appendChild(b);});
  $('mix').innerHTML='<span class="em">'+(cur.id==='milo'?'🦖':MIX.e)+'</span><span class="tt">'+(cur.id==='milo'?'Dino Mix':MIX.t)+'</span><span class="bl">'+MIX.b+'</span><span class="stars">'+starStr(p.stars.mix||0)+'</span>';
  $('mix').onclick=()=>startMission(MIX);
}

/* ---------- choosing questions: Nora never sees a question twice until a bank runs out ---------- */
function bankOf(m){
  if(m.id!=='mix')return m.bank(cur);
  let all=[];listFor(cur.id).forEach(x=>{if(x.id!=='set')all=all.concat(x.bank(cur).map(q=>Object.assign({},q,{from:x.id})));});return all;
}
function chooseQs(m){
  const bank=bankOf(m),n=cur.rounds,p=prof(cur.id),seen=new Set(p.seen),byId={};
  bank.forEach(q=>{byId[q.id]=q;});let ids=Object.keys(byId);
  let fresh=cur.id==='nora'?ids.filter(id=>!seen.has(id)):ids;
  if(cur.id==='nora'&&fresh.length<n){ // bank ran out: allow repeats again for this bank
    const set=new Set(ids);p.seen=p.seen.filter(id=>!set.has(id));fresh=ids;
  }
  let picked;
  if(m.id==='mix'){const groups={};shuffle(fresh).forEach(id=>{const f=byId[id].from;(groups[f]=groups[f]||[]).push(id);});
    const keys=shuffle(Object.keys(groups));picked=[];let i=0;while(picked.length<n&&keys.some(k=>groups[k].length)){const k=keys[i++%keys.length];if(groups[k].length)picked.push(groups[k].pop());}}
  else picked=shuffle(fresh).slice(0,n);
  return picked.map(id=>byId[id]);
}
function startMission(m){
  mission=m;TODAY=day0(new Date());qs=chooseQs(m);qi=0;pts=0;
  show('play');startBuddy();showQ();
}
function setPrompt(t){$('prompt').innerHTML=pr(t);say(pr(t));}
function showQ(){
  const q=qs[qi];tries=0;answered=false;if(window.KA){KA.setKid(cur&&cur.id);KA.shown();}
  if(cur.id==='nora'){const p=prof(cur.id);if(p.seen.indexOf(q.id)<0)p.seen.push(q.id);p.rev=Date.now();store.save();}
  $('roundInfo').textContent=(qi+1)+' / '+qs.length;$('ptsInfo').textContent='⭐ '+pts;
  $('coach').hidden=true;buddyMood('idle');
  renderVis(q.vis||{k:'none'},q);
  const box=$('opts');box.innerHTML='';
  if(q.set){
    clockState={t:0,drag:null,on:true,ticks:cur.id==='nora'};drawClock();
    const done=document.createElement('button');done.className='btn big';done.textContent='Done ✓';done.onclick=()=>checkSet();
    box.style.gridTemplateColumns='1fr';const row=document.createElement('div');row.className='setrow';
    [['− hour',-60],['+ hour',60],['− 5 min',-5],['+ 5 min',5]].forEach(([l,d])=>{const b=document.createElement('button');b.className='btn ghost small';b.textContent=l;b.onclick=()=>{nudge(d);};row.appendChild(b);});
    row.appendChild(done);box.appendChild(row);
  }else{
    box.style.gridTemplateColumns=cur.id==='milo'?'repeat(2,minmax(0,1fr))':'';
    shuffle(q.o.map((o,i)=>({o:o,ok:i===0}))).forEach(x=>{
      const b=document.createElement('button');b.className='opt'+(x.o.e?' pic':'');b.dataset.ok=x.ok?'1':'';
      b.innerHTML=(x.o.e?'<span class="e">'+x.o.e+'</span>':'')+(x.o.e?'<span class="sm">'+x.o.t+'</span>'+(x.o.s?'<span class="sm">'+x.o.s+'</span>':''):(/^\d+:\d\d$|^\d+$/.test(x.o.t)?'<span class="big">'+x.o.t+'</span>':'<span>'+x.o.t+'</span>')+(x.o.s?'<span class="sm">'+x.o.s+'</span>':''));
      b.onclick=()=>choose(b,x.ok);box.appendChild(b);});
  }
  setPrompt(q.q);
}
function revealView(){const st=$('stage'),ok=document.querySelector('.opt.ok');if(ok&&st.scrollHeight>st.clientHeight)ok.scrollIntoView({block:'nearest'});}
function coach(html,kind,face){
  $('coach').hidden=false;$('coach').className=kind||'';$('face').textContent=face||'🦉';$('coachText').innerHTML=pr(html);
  $('next').hidden=!answered;$('next').textContent=qi+1<qs.length?'Next ▶':'Finish ▶';
  if(answered)requestAnimationFrame(revealView);
}
const PRAISE=['Yes!','Great job!','You got it!','Super!','Nailed it!'];
function _ka(ok){try{const q=qs[qi];window.KA&&KA.answer({q:'['+(qi+1)+'/'+qs.length+'] '+String(q.q||'').replace(/<[^>]*>/g,''),qid:q.id,given:window._kaGiven,expected:answerText(q).replace(/<[^>]*>/g,''),correct:ok,tryNo:tries+1,topic:mission&&mission.t});}catch(e){}}
function win(){
  _ka(true);answered=true;pts+=tries===0?2:1;$('ptsInfo').textContent='⭐ '+pts;sfx.good();buddyMood('cheer');
  const q=qs[qi];coach('<b>'+pick(PRAISE)+'</b> '+(q.why||''),'ok','🎉');say(pick(PRAISE)+' '+(cur.id==='milo'?(q.why||''):''));
}
function miss(reveal){
  _ka(false);sfx.bad();buddyMood('oops');tries++;const q=qs[qi];
  if(tries>=2){answered=true;reveal();coach('The answer is <b>'+answerText(q)+'</b>. '+(q.why||''),'bad','💡');say('The answer is '+speakable(answerText(q)));return;}
  let h='Not quite. Try again!';
  if(cur.hints){if(q.hint)h+=' '+q.hint;if(q.hintVis)renderVis(q.hintVis,q,true);if(q.calHint)renderVis({k:'cal',y:q.calHint.y,m:q.calHint.m},q,true);
    if(cur.id==='milo')document.querySelectorAll('.opt').forEach(b=>{if(b.dataset.ok)b.classList.add('hint');});}
  coach(h,'bad','🤔');say(h);
}
const answerText=q=>q.set?tWords(q.set.h,q.set.m)+' ('+dig(q.set.h,q.set.m)+')':q.o[0].t+(q.o[0].s&&!/^\d/.test(q.o[0].s)?'':'');
function choose(b,ok){
  if(answered||b.classList.contains('bad'))return;
  window._kaGiven=b.textContent.trim();
  if(ok){b.classList.add('ok');win();}
  else{b.classList.add('bad');miss(()=>document.querySelectorAll('.opt').forEach(x=>{if(x.dataset.ok)x.classList.add('ok');}));}
}
$('next').onclick=()=>{qi++;if(qi<qs.length)showQ();else finish();};
$('again').onclick=()=>{const q=qs[qi];if(q){const was=prof(cur.id).voice;prof(cur.id).voice=true;say(pr(q.q));prof(cur.id).voice=was;}};

function finish(){
  const max=qs.length*2,pct=pts/max,stars=pct>=.85?3:pct>=.6?2:1,p=prof(cur.id);
  p.stars[mission.id]=Math.max(p.stars[mission.id]||0,stars);const gl=goalRound(stars);p.rev=Date.now();store.save();
  streaks[cur.id]++;
  $('rStars').textContent=starStr(stars);$('rTitle').textContent=stars===3?'Amazing, '+cur.name+'!':stars===2?'Nice work, '+cur.name+'!':'Good try, '+cur.name+'!';
  $('rSub').textContent=pts+' of '+max+' points';$('rTip').textContent=mission.tip;$('rGoal').textContent=gl;$('rGoal').hidden=!gl;
  const brk=streaks[cur.id]>=3,L=listFor(cur.id).concat([MIX]),nx=L[(L.indexOf(mission)+1)%L.length];
  $('breakCard').hidden=$('breakRow').hidden=!brk;$('goRow').hidden=$('moreRow').hidden=brk;
  $('nextMission').textContent='Next: '+(nx===MIX&&cur.id==='milo'?'Dino Mix':nx.t)+' ▶';$('nextMission').onclick=()=>startMission(nx);
  show('result');sfx.star();stopBuddy();
}
$('replay').onclick=()=>startMission(mission);
$('toMap').onclick=()=>{renderMap();show('map');};
$('endBreak').onclick=()=>{streaks[cur.id]=0;renderHome();show('home');};
$('back').onclick=()=>{stopBuddy();if(screen==='play'||screen==='result'){renderMap();show('map');}else if(screen==='cal'&&calFrom==='map'&&cur){renderMap();show('map');}else{renderHome();show('home');}};
$('soundBtn').onclick=()=>{DB.sound=!DB.sound;$('soundBtn').setAttribute('aria-pressed',String(DB.sound));$('soundBtn').textContent=DB.sound?'🔊':'🔇';store.save();musicSync();};
$('voiceBtn').onclick=()=>{const p=prof(cur.id);p.voice=!p.voice;p.rev=Date.now();$('voiceBtn').setAttribute('aria-pressed',String(p.voice));store.save();if(!p.voice&&'speechSynthesis' in window)try{speechSynthesis.cancel();}catch(e){}};


(function(){var h=document.querySelector('#home h1');if(h)h.innerHTML=RB('時間專家','ㄕˊ ㄐㄧㄢ ㄓㄨㄢ ㄐㄧㄚ')+'<br><small style="font-size:.55em">Time Expert</small>';var b=document.querySelector('#brand .bt');if(b)b.innerHTML=RB('時間專家','ㄕˊ ㄐㄧㄢ ㄓㄨㄢ ㄐㄧㄚ')+' Time Expert';})();
