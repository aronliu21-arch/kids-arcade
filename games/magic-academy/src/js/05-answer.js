function answer(k){
  const c=CC();
  try{const t=v=>{const d=document.createElement('div');d.innerHTML=String(v);return d.textContent.trim()};window.KA&&KA.answer({q:t(c.title),qid:c.title,given:t(c.opts[k]),expected:t(c.opts[c.ans]),correct:k===c.ans,tryNo:tries+1,topic:'math case'});}catch(e){}
  if(k===c.ans){SND.correct();const f=tries===0;logAns(f,hintOn);pickSpell(f?'first':'retry',e=>battleHit(f?'first':'retry',e,()=>solved(true)));return;}
  SND.wrong();const sh=comboBreak();tries++;wrong.push(k);
  if(tries===1){note=sh?`${sh.e} ${sh.n}的保護罩擋住了！連擊沒有中斷。再看一次線索！`:'咒語差一點點！再看一次線索，你可以的。';renderCase();}
  else if(tries===2){calm(()=>{hintOn=true;renderCase();},'這題有點難，魔女也需要補充魔力。補充完，給你一個提示。');}
  else{logAns(false,hintOn);pickSpell('assist',e=>battleHit('assist',e,()=>solved(false)));}
}

function solved(self){
  RT++;const c=CC();
  if(!PR.on){if(!seenT().includes(c.title))S.seen=seenT().concat([c.title]);if(self&&!S.solved.includes(cur))S.solved.push(cur);S.idx=(cur+1)%CASES.length;}save();
  const sol=`<div class="explain"><h3>解法</h3><p data-say="zh">${c.explain}</p></div>`;
  app.innerHTML=`${battleBar()}<section class="case">
  <div class="scene" style="background:linear-gradient(160deg,${PR.on?'#F6E7FF,#8E6CC0':SCENES[cur]})"><span class="sicon">${c.icon}</span><div class="mini-m"><img src="${ART_FACE}" alt=""></div></div>
  <div class="stampwrap"><div class="stamp">${self?'咒語成功':'合力完成'}</div></div>
  <h2 data-say="zh">${self?'你找到答案了！':'這題我們一起看看'}</h2>
  <p class="ans" data-say="zh">答案是 <b>${L[c.ans]}　${c.opts[c.ans]}</b></p>
  ${self?'':sol}
  <div class="report" id="rep"><h3>📔 魔法日記</h3><p data-say="zh">${self?'把你是怎麼想的，說給爸爸或媽媽聽。說完就能拿一顆星星。':'看完解法，換你用自己的話說一次給爸爸或媽媽聽。'}</p>
  ${self?`<p class="small" data-say="zh">你用了哪個方法？可以選很多個。</p><div class="strat">${STRAT.map((s,k)=>`<button class="chip st" data-k="${k}" aria-pressed="false">${s}</button>`).join('')}</div>`:''}
  <button class="primary" id="star">⭐ 我說完了</button><button class="skip" id="skip">先跳過</button></div>
  <div id="st2" hidden>
  ${self||PR.on?'':'<p class="small" data-say="zh">這種題型之後會在 🎯 弱點特訓 用新的題目再練習！</p>'}
  ${self?`<details class="sol"><summary>看看魔法書的解法</summary>${sol}</details>`:''}
  ${c.fact?`<div class="fact"><h3>📖 魔法書小知識 <button class="chip" id="rf">🔊</button></h3><p>${c.fact}</p></div>`:''}
  <button class="primary" id="next">${PR.on?'下一題 ✨':'下一個任務 ✨'}</button></div>
  </section>`;
  bg(true);if(self)confetti();setTimeout(()=>SND.thump(),150);
  app.querySelectorAll('.st').forEach(b=>b.onclick=()=>{b.classList.toggle('sel');b.setAttribute('aria-pressed',String(b.classList.contains('sel')));});
  $('#star').onclick=e=>{SND.win();S.stars++;S.strat=S.strat||{};app.querySelectorAll('.st.sel').forEach(b=>{const k=b.dataset.k;S.strat[k]=(S.strat[k]||0)+1;});save();e.target.disabled=true;e.target.textContent='⭐ 拿到一顆星星了！';setTimeout(step2,700);};
  const step2=()=>{$('#rep').hidden=true;$('#st2').hidden=false;scrollTo(0,0);};
  $('#skip').onclick=step2;
  if($('#rf'))$('#rf').onclick=()=>speak(c.fact,'zh');
  const goNext=()=>{
    if(PR.on){PR.i++;if(PR.i>=PR.items.length)practiceDone();else openPractice();return;}
    session++;
    if(CASES.every(c=>seenT().includes(c.title))){home();return;}
    if(session>=3)rest();
    else if(session===2)mood(()=>openCase(nextCase()));
    else openCase(nextCase());
  };
  $('#next').onclick=()=>{const b=PR.on?PRB:S.battle;if(b&&b.hp<=0&&!b.shown)victory(goNext);else goNext();};
}

function rest(){
  bg(true);
  app.innerHTML=`<section class="center"><div class="hero-art">${MASCOT}</div>
  <h2 data-say="zh">今天完成了3個任務，魔力用了好多！</h2>
  <p class="big" data-say="zh">去喝口水、伸伸懶腰，或到外面走一走吧。</p>
  <button class="primary" id="h">回到首頁</button>
  <button class="quiet" id="more" style="width:100%;margin-top:12px">休息好了，再辦一個</button></section>`;
  $('#h').onclick=home;
  $('#more').onclick=()=>{session=0;mood(()=>openCase(nextCase()));};
}

function calm(done,msg){
  const o=document.createElement('div');o.className='calm';o.setAttribute('role','dialog');
  o.innerHTML=`<div class="calmbox"><p class="cmsg" data-say="zh">${msg}</p>
  <div class="breath"><div class="ball"></div><span>準備</span></div>
  <p class="small cyc">&nbsp;</p>
  <button class="primary rd" disabled>我準備好了</button>
  <p class="small" data-say="zh">也可以喝口水，或用力握拳再放鬆。</p></div>`;
  document.body.appendChild(o);
  const ball=o.querySelector('.ball'),bt=o.querySelector('.breath span'),cyc=o.querySelector('.cyc'),rd=o.querySelector('.rd');
  let n=0,alive=true;
  function run(){
    if(!alive)return;
    if(n>=3){bt.textContent='很棒';speak('很棒，你做到了','zh');rd.disabled=false;return;}
    n++;cyc.textContent=`第 ${n} 次，共 3 次`;
    SND.bell();bt.textContent='吸氣…';speak('吸氣','zh');ball.className='ball in';
    setTimeout(()=>{if(!alive)return;bt.textContent='吐氣…';speak('吐氣','zh');ball.className='ball out';
      setTimeout(()=>{if(n===1)rd.disabled=false;run();},6000);},4000);
  }
  setTimeout(run,700);
  rd.onclick=()=>{alive=false;o.remove();if(done)done();};
}

home();
cloudInit();
