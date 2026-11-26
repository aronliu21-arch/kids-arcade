function afterFX(k){
  if(k==='fire')return Array.from({length:8},(_,i)=>`<i class="ember" style="--x:${22+i*8}%;--i:${i}"></i>`).join('');
  if(k==='ice')return '<div class="iceover"></div>'+Array.from({length:6},(_,i)=>`<span class="shard" style="--a:${i*60}deg">❄</span>`).join('');
  if(k==='thunder')return '<svg class="zap" viewBox="0 0 100 150" aria-hidden="true"><polyline points="52,0 36,42 60,58 38,98 62,112 50,150"/></svg><svg class="zap z2" viewBox="0 0 100 150" aria-hidden="true"><polyline points="30,0 44,36 26,60 46,92 34,150"/></svg>';
  return '<div class="glint"></div>'+Array.from({length:8},(_,i)=>`<span class="twk" style="--x:${[18,78,30,66,12,86,44,58][i]}%;--y:${[20,26,70,64,48,52,12,84][i]}%;--i:${i}">✦</span>`).join('');
}
function playAttack(o,cont){
  const {dmg,b,hp0,kind,fin,up,ti,chain,E,weak,pet,pi,m}=o,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const name=`${E.e} ${E.n}${TIERS[ti].n}`,tier=ti+1;
  const el=document.createElement('div');el.className=`atk t${tier}`;el.setAttribute('role','status');el.style.setProperty('--ec',E.c);
  el.innerHTML=`<div class="atkbox">
  <div class="aname">${kind==='assist'?'🤝 合力 · ':''}${name}${chain>=2?`<small>${chain} 連擊！</small>`:''}</div>
  <div class="stage el-${E.k}${weak?' weakhit':''}">${weak?'<div class="critburst"></div>':''}
  <img class="caster" src="${ART_FACE}" alt=""><div class="charge">${Array.from({length:8},(_,k)=>`<i style="--a:${k*45}deg"></i>`).join('')}</div>
  <div class="amon react-${E.k}${b.hp<=0?' beat':''}">${m[1]}</div>${fxHTML(TIERS[ti].fx,E)}
  <div class="shock"></div><div class="sparks">${Array.from({length:10},(_,k)=>`<i style="--a:${k*36}deg"></i>`).join('')}</div>${afterFX(E.k)}
  ${chain>=2?`<div class="cbadge">×${chain}</div>`:''}${pet?`<span class="fx f-cat">${pi.e}</span>`:''}</div>
  <div class="admg">−${dmg}${fin?' 終極咒語！':''}</div>
  <div class="ahp" style="--from:${hp0}%;--to:${b.hp}%"><b class="lag"></b><i></i></div>
  ${weak?'<p class="aweak">💥 效果絕佳！打中弱點 ×1.5</p>':(m[5]?'<p class="anote">牠不太怕這個，下次試試別的咒語！</p>':'')}
  <p class="adesc">${DESC[ti](E.n)}</p>
  <p class="asay">${m[0]}：「${b.hp<=0?'我投降了……我們做朋友吧！':E.say+(tier>=5?'這招太強了！':'')}」</p>
  ${pet?`<p class="acat">${pi.e} ${pi.n}助攻 +${pet}！</p>`:''}
  ${up?`<b class="lvup">⬆️ 魔力升級！現在是 Lv${lvl()}，每一招都更強了！</b>`:''}
  ${kind==='first'&&ti<TIERS.length-1?`<p class="anext">再答對一題 → ${TIERS[ti+1].e} ${TIERS[ti+1].n}</p>`:''}
  </div>`;
  document.body.appendChild(el);
  const sfx=[()=>SND.pop(),()=>{SND.thump();setTimeout(()=>SND.thump(),220);},()=>{SND.bell();SND.thump();},()=>{SND.thump();setTimeout(()=>SND.thump(),160);setTimeout(()=>SND.win(),400);},()=>{SND.win();setTimeout(()=>SND.thump(),300);},()=>{SND.win();setTimeout(()=>SND.win(),450);setTimeout(()=>SND.thump(),700);}];
  setTimeout(()=>{(sfx[tier-1]||sfx[0])();if(weak)setTimeout(()=>SND.correct(),500);},300);
  let done=false;const end=()=>{if(done)return;done=true;el.remove();cont();};
  el.onclick=end;setTimeout(end,rm?1000:1800+tier*260+(up?600:0)+(weak?300:0));
}
function victory(next){
  const b=PR.on?PRB:S.battle,m=monOf(b);b.shown=true;
  if(!PR.on)S.mfriends=(S.mfriends||[]).concat([b.mi]);save();bg(true);
  const stars=b.first>=4?3:b.first>=2?2:1;
  app.innerHTML=`<section class="center vict"><div class="vmon">${m[1]}<span>💜</span></div>
  <h2 data-say="zh">勝利！${PR.on?m[0]+'被打倒了':m[0]+'變成你的魔法朋友了'}！</h2>
  <p class="vstars">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</p>
  <p data-say="zh">第一次就答對 ${b.first} 題・魔力 Lv${lvl()} ${spell()[0]}</p>
  <button class="primary" id="vgo">繼續 ✨</button></section>`;
  confetti();SND.win();$('#vgo').onclick=()=>{if(!PR.on)newBattle();next();};
}

function startPractice(){const w=weakSkills();if(!w.length)return;PRB={hp:100,combo:0,turns:0,first:0,shown:false,chain:0};PR.on=true;PR.skill=w[0].k;PR.i=0;PR.right=0;PR.items=Array.from({length:5},()=>GEN[PR.skill]());openPractice();}
function openPractice(){tries=0;wrong=[];hintOn=false;showEn=false;note='';phase='full';introThen(renderCase);}
function practiceDone(){
  const r=PR.right,sk=SKILLS[PR.skill];PR.on=false;if(r>=4)S.stars++;save();bg(true);
  app.innerHTML=`<section class="center"><div class="hero-art">${MASCOT}</div>
  <h2 data-say="zh">特訓完成！${sk}：第一次就答對 ${r} / 5 題</h2>
  <p class="big" data-say="zh">${r>=4?'太厲害了！送你一顆魔法星星 ⭐':r>=2?'有進步喔！下次再練一次會更熟。':'這個很難，我們之後再一起多練習。'}</p>
  <button class="primary" id="h">回到首頁</button></section>`;
  $('#h').onclick=home;
}
function report(){
  bg(false);const L=S.log||{};const pct=e=>e[0]?Math.round(e[1]/e[0]*100):0;
  const sk=Object.keys(SKILLS).map(k=>({k,e:L['sk:'+k]||[0,0,0]})).filter(x=>x.e[0]).sort((a,b)=>pct(a.e)-pct(b.e));
  const tot=sk.reduce((a,x)=>a+x.e[0],0),first=sk.reduce((a,x)=>a+x.e[1],0),hints=sk.reduce((a,x)=>a+x.e[2],0);
  const hard=Object.entries(L).filter(([k,e])=>k.startsWith('case:')&&e[1]<e[0]).map(([k,e])=>({n:+k.slice(5),e})).filter(x=>CASES[x.n]);
  const since=Date.now()-14*864e5,md=(S.moods||[]).filter(x=>x.d>=since),mc=m=>md.filter(x=>x.m===m).length;
  app.innerHTML=`<section class="case rpt"><header class="file"><span>📊 學習報告</span><button class="chip" id="h">回首頁</button></header>
  ${tot?`<div class="rsum"><div><b>${tot}</b><small>答過的題目</small></div><div><b>${pct([tot,first])}%</b><small>第一次就答對</small></div><div><b>${hints}</b><small>用了提示</small></div></div>`:'<p>還沒有作答紀錄。從下一題開始記錄。</p>'}
  ${sk.length?`<h3>各類題型（最弱的在最上面）</h3>${sk.map(x=>`<div class="rrow"><span class="rl">${SKILLS[x.k]}</span><span class="rbar"><i style="width:${pct(x.e)}%;background:${pct(x.e)>=75?'#3DAA4A':pct(x.e)>=50?'#E9B94A':'#C8453A'}"></i></span><span class="rn">${x.e[1]}/${x.e[0]}</span></div>`).join('')}`:''}
  ${hard.length?`<h3>需要幫忙的任務</h3><p class="small">${hard.map(x=>`${x.n+1}. ${CASES[x.n].title}`).join('、')}</p>`:''}
  <h3>最近兩週的心情</h3><p>😌 很平靜 ${mc('a')}　😕 有點卡卡 ${mc('b')}　😣 很煩躁 ${mc('c')}</p>
  <p class="small">「第一次就答對」= 沒有答錯就選到正確答案。🎯 弱點特訓會自動練習最弱的題型，每次5題，題目每次都不一樣。</p></section>`;
  $('#h').onclick=home;
}

function home(){
  RT++;
  const n=CASES.filter(c=>seenT().includes(c.title)).length,done=n>=CASES.length;bg(true);
  app.innerHTML=`<section class="home${weakSkills().length?' withprac':''}">
  <div class="hero-art">${MASCOT}</div>
  <p class="name" data-say="zh"><ruby>幼<rt>ㄧㄡˋ</rt></ruby><ruby>晴<rt>ㄑㄧㄥˊ</rt></ruby></p><h1>魔法學院<span>見習魔女任務簿</span></h1>
  <p class="lead" data-say="zh">歡迎來到魔法學院！每個任務都藏著一道數學咒語。不用趕時間，慢慢找線索。</p>
  <div class="tally"><div><b>${n}</b> / ${CASES.length}<small>完成任務</small></div><div><b>${S.stars}</b><small>魔法星星</small></div><div><b>Lv${lvl()}</b><small>魔力 ${spell()[0]}</small></div></div>${(S.mfriends||[]).length?`<p class="mfr">魔法朋友：${S.mfriends.map(i=>MONS[i][1]).join('')}</p>`:''}${favStrat()}
  ${done?'<p class="big" data-say="zh">全部任務完成了！你是真正的魔女了！🎉</p><p class="small">請爸爸媽媽幫你準備新的任務。</p>':''}
  <div class="books">${[1,0].map(b=>{const d=doneIn(b),tot=BOOKS[b][1]-BOOKS[b][0],full=d>=tot;return `<button class="primary book${b?'':' old'}${full?' full':''}" data-b="${b}"${full?' disabled':''}>${BOOKS[b][2]}${b?' 新任務':''}<small>${full?'✓ 全部完成':d+' / '+tot}</small></button>`;}).join('')}</div>
  ${(()=>{const w=weakSkills();return w.length?`<button class="primary practice" id="prac">🎯 弱點特訓：${SKILLS[w[0].k]}</button>`:'';})()}
  <button class="quiet" id="calm">🫧 魔法冥想室</button>
  <details class="parent"><summary>給爸爸媽媽</summary><button class="quiet" id="rpt" style="width:100%;margin:6px 0">📊 學習報告</button>
  <p>每一輪3個任務，大約10–12分鐘，沒有計時。開始時和第2題後會問她的心情。</p>
  <p>答錯兩次會先做30秒呼吸，再給提示；答錯三次會一起看解法，不扣分。</p>
  <p>完成任務後請聽她說自己的解法，再讓她按「我說完了」拿星星。生字的注音請您核對一次。</p></details>
  ${cloudNote()}
  </section>`;
  
  app.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{book=+b.dataset.b;if(nextCase()<0)return;session=0;mood(()=>openCase(nextCase()));});
  $('#calm').onclick=()=>calm(null,'歡迎來到魔法冥想室。我們一起慢慢呼吸三次。');
  if($('#prac'))$('#prac').onclick=()=>mood(startPractice);
  $('#rpt').onclick=report;
}

function mood(next){
  bg(false);
  app.innerHTML=`<section class="center"><h2 data-say="zh" data-text="開始前，你現在感覺怎麼樣？很平靜、有點卡卡，還是很煩躁？">開始前，你現在感覺怎麼樣？</h2>
  <div class="moods"><button data-m="a">😌<span>很平靜</span></button><button data-m="b">😕<span>有點卡卡</span></button><button data-m="c">😣<span>很煩躁</span></button></div></section>`;
  app.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{
    const m=b.dataset.m;S.moods=(S.moods||[]).concat([{d:Date.now(),m}]).slice(-60);save();
    if(m==='a')next();
    else if(m==='b'){app.innerHTML=`<section class="center"><p class="big" data-say="zh">謝謝你告訴我。<br>卡卡的感覺很正常。<br>我們先做一題就好，慢慢來。</p><button class="primary" id="ok">好</button></section>`;$('#ok').onclick=next;}
    else calm(next,'謝謝你說出來。煩躁的時候，大腦需要先充電。我們一起呼吸三次。');
  });
}

function openCase(i){
  if(i<0){home();return;}
  cur=i;tries=0;wrong=[];hintOn=false;showEn=false;note='';phase='full';
  introThen(renderCase);
}

let phase='full',RT=0;
const isPhone=()=>matchMedia('(max-width:520px)').matches;
function lastSent(t,en){const a=t.split(en?/(?<=[?!.])\s+(?=[A-Z“])/:/(?<=[。？！])/).filter(Boolean);return a[a.length-1];}
function renderCase(){
  const c=CC();bg(false);const tok=++RT;
  const txt=showEn?c.en:c.zh,lang=showEn?'en':'zh';
  const head=`<div class="peek" aria-hidden="true">${CAT}</div>
  <header class="file">${PR.on?`<span>🎯 弱點特訓：${SKILLS[PR.skill]}</span><span>${PR.i+1} / ${PR.items.length}</span>`:`<span>🌀 傳送門 → ${c.icon} ${c.place}</span><span>任務 ${cur+1} / ${CASES.length}</span>`}</header>
  <h2 data-say="zh">${c.title}</h2>`;
  const story=`<div class="story"><p>${sents(txt,showEn)}</p><p class="small tip">點一句，就只唸那一句。</p>
  <div class="tools"><button class="chip" id="read">🔊 唸給我聽</button>${phase==='full'?'<button class="chip" id="ro">🔊 唸選項</button>':''}<button class="chip" id="en">${showEn?'看中文':'看英文 English'}</button></div></div>
  ${c.words.length?`<div class="words"><span class="wl">生字</span>${c.words.map((w,k)=>`<button class="word" data-k="${k}" aria-label="${w[0]}">${ruby(w[0],w[1])}</button>`).join('')}</div>`:''}`;
  const opts=`<div class="opts">${c.opts.map((o,k)=>`<button class="opt${wrong.includes(k)?' no':''}" data-k="${k}"${wrong.includes(k)?' disabled':''}><b>${L[k]}</b>${o}</button>`).join('')}</div>
  <div class="msg${hintOn?' hint':''}"${(hintOn||note)?' data-say="zh"':''} aria-live="polite">${hintOn?'💡 '+c.hint:note}</div>`;
  const bar=`<div class="bar"><button class="quiet" id="calm">🫧 冷靜一下</button>${tries>0&&!hintOn?'<button class="quiet" id="hint">💡 看提示</button>':''}<button class="quiet" id="home" aria-label="回首頁">🏠</button></div>`;
  let body;
  if(phase==='read')body=story+`<button class="primary" id="toans">我讀完了，去作答 ➜</button>`;
  else if(phase==='answer')body=`<div class="qline"><p data-say="${lang}">${lastSent(txt,showEn)}</p><div class="tools"><button class="chip" id="seeq">📜 再看題目</button><button class="chip" id="ro">🔊 唸選項</button></div></div>`+opts;
  else body=story+opts;
  app.innerHTML=`${battleBar()}<section class="case">${head}${body}${bar}</section>`;
  if(phase==='full'&&isPhone()&&document.documentElement.scrollHeight>innerHeight+2){phase='read';renderCase();return;}
  const on=(id,fn)=>{const e=$(id);if(e)e.onclick=fn;};
  on('#read',()=>speak(txt,lang));
  on('#ro',()=>speak(c.opts.map((o,k)=>L[k]+'，'+o).join('。'),'zh'));
  app.querySelectorAll('.sent').forEach(s=>{const go=()=>{speak(s.textContent,lang);s.classList.add('on');setTimeout(()=>s.classList.remove('on'),1800);};s.onclick=go;s.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}};});
  on('#en',()=>{showEn=!showEn;phase='full';renderCase();});
  on('#toans',()=>{phase='answer';renderCase();scrollTo(0,0);});
  on('#seeq',()=>{phase='read';renderCase();scrollTo(0,0);});
  app.querySelectorAll('.word').forEach(b=>b.onclick=()=>speak(c.words[b.dataset.k][0],'zh'));
  app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.k));
  on('#calm',()=>calm(null,'休息一下沒關係。我們一起慢慢呼吸。'));
  on('#hint',()=>{hintOn=true;renderCase();});
  on('#home',home);
  if(phase==='full'&&isPhone())setTimeout(()=>{if(tok===RT&&phase==='full'&&$('.opts')&&document.documentElement.scrollHeight>innerHeight+2){phase='read';renderCase();}},150);
}

