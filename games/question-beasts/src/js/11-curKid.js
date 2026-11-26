/* ================= screens ================= */
let curKid='milo',B=null;
function show(id){['home','pick','world','battle'].forEach(s=>$('#'+s).hidden=s!==id);window.scrollTo(0,0);if(id!=='world')MapV.stop()}
function renderHome(){const box=$('#kidList');box.innerHTML='';
  for(const k of ['nora','lucas','milo']){const K=KIDS[k],s=Save.kid(k),f=formOf(s.xp),lv=levelOf(s.xp);
    const b=document.createElement('button');b.className='kid';b.type='button';
    const st=beastOf(k);b.innerHTML=`<canvas width="66" height="66"></canvas><div class="who"><span class="nm"><span class="zht">${K.zh}</span><small>${K.name}</small></span><span class="bn">${st?'<span class="zht">'+zhOf(st,f)+'</span> · Lv '+lv:'選一隻神獸！Pick your beast!'}</span><div class="xp"><i style="width:${s.xp%100}%"></i></div><span class="tag">${K.world} · ${Math.min(s.cleared,6)}/6 · ⭐ ${starsOf(k)}</span></div>`;
    paintBeast(b.querySelector('canvas'),k);b.onclick=()=>{ac();Sfx.tap();curKid=k;if(beastOf(k)){renderWorld();show('world')}else openPick(k)};box.appendChild(b)}}
let pickSel=null;
function openPick(k){curKid=k;pickSel=Save.kid(k).starter||null;renderPick();show('pick');if(pickSel)renderDetail()}
function renderPick(){const k=curKid,K=KIDS[k];$('#pickTitle').innerHTML=`<span class="zht" style="font-size:1.6em">${K.zh}</span>，選一隻神獸！ CHOOSE YOUR BEAST`;const box=$('#pickGrid');box.innerHTML='';
  STARTER_ORDER.forEach(id=>{const st=STARTERS[id],b=document.createElement('button');b.type='button';b.className='mon'+(pickSel===id?' sel':'');
    b.innerHTML=`<canvas width="66" height="66"></canvas><b class="zht">${zhOf(st,0)}</b><span>${st.names[0]} · ${st.type}</span>`;paintStarter(b.querySelector('canvas'),st,0);
    b.onclick=()=>{ac();Sfx.tap();pickSel=id;renderPick();renderDetail();Speech.say(zhOf(st,0),'zh-TW');window.scrollTo({top:0,behavior:RM?'auto':'smooth'})};box.appendChild(b)})}
function renderDetail(){const st=STARTERS[pickSel],d=$('#pickDetail');d.hidden=!st;if(!st)return;const ev=$('#evos');ev.innerHTML='';
  ['Lv 1','Lv 5','Lv 10'].forEach((lv,i)=>{const w=document.createElement('div');w.innerHTML=`<canvas width="110" height="110"></canvas><b><span class="zht">${zhOf(st,i)}</span>${st.names[i]}</b><span>${lv}</span>`;paintStarter(w.querySelector('canvas'),st,i);ev.appendChild(w)});
  $('#pMoves').textContent=`${st.moves.join(' · ')} · SUPER: ${st.ult}`;
  const cur=Save.kid(curKid).starter;$('#pickGo').textContent=(cur===pickSel?'KEEP ':'CHOOSE ')+zhOf(st,0)}
$('#pickGo').onclick=()=>{if(!pickSel)return;Save.kid(curKid).starter=pickSel;Save.save();Sfx.level();renderWorld();show('world')};
$('#pickBack').onclick=()=>{Sfx.tap();if(beastOf(curKid)){renderWorld();show('world')}else{renderHome();show('home')}};
$('#changeBeast').onclick=()=>{Sfx.tap();openPick(curKid)};
function renderWorld(){const k=curKid,K=KIDS[k],s=Save.kid(k),f=formOf(s.xp),lv=levelOf(s.xp);
  const st=beastOf(k);if(!st)return openPick(k);$('#wTitle').textContent=K.zh+' '+K.name+' · '+K.world;$('#wBeast').innerHTML=`<span class="zht">${zhOf(st,f)}</span>${st.names[f]} · ${st.type}`;
  const nextEvo=lv<5?`Evolves at Lv 5`:lv<10?`Evolves again at Lv 10`:`Fully evolved`;
  $('#wLv').textContent=`Lv ${lv} · ${s.xp%100}/100 XP · ${nextEvo}`;$('#wXp').style.width=(s.xp%100)+'%';
  paintBeast($('#wSprite'),k);
  const sp=$('#setPick');sp.hidden=k!=='dad';if(k==='dad'){const cur=qsetOf('dad');
    sp.innerHTML=`<span class="tag">題目 · QUESTION SET</span><div>${[['milo','洛明','MILO'],['lucas','陸晨','LUCAS'],['nora','幼晴','NORA'],['mix','全部','ALL 3 MIX']].map(([id,z,e])=>`<button type="button" class="chip${cur===id?' on':''}" data-set="${id}" aria-pressed="${cur===id}"><span class="zht">${z}</span> ${e}</button>`).join('')}</div>`;
    sp.querySelectorAll('[data-set]').forEach(b=>b.onclick=()=>{Sfx.tap();Save.kid('dad').qset=b.dataset.set;Save.save();renderWorld()})}
  $('#eqBtn').onclick=()=>{ac();Sfx.tap();Equip.open(k)};$('#wLv').textContent=$('#wLv').textContent+` · ⭐ ${starsOf(k)}`;
  const bb=$('#bookBtn');bb.hidden=!Story.has(k);if(Story.has(k)){bb.textContent=`📖 STORY BOOK ${Save.kid(k).story||0}/10`;bb.onclick=()=>{ac();Sfx.tap();Story.book(k).then(()=>renderWorld())}}
  const rb=$('#replayEvo');rb.hidden=f===0;rb.textContent=f?`▶ 看${zhOf(st,f-1)}進化 WATCH EVOLUTION`:'';rb.onclick=()=>{ac();evolveAnim(st,f-1,f).then(()=>renderWorld())};
  let note=`Right answers: ${s.right} · Misses: ${s.wrong} · New question types every 3 levels`;
  if(K.noRepeat){const left=NORA_BANKS.reduce((a,l)=>a+bankLeft('nora',l),0),tot=NORA_BANKS.reduce((a,l)=>a+l.length,0);
    note+=` · Questions never repeat. Hand-written questions left: ${left} of ${tot}.`;if(left<40)note+=' Ask Claude for a new question pack soon.'}
  $('#wNote').textContent=note;
  MapV.show(k)}

/* ================= battle ================= */
function startBattle(kid,stage){const e=enemyFor(stage),K=KIDS[kid];
  B={kid,stage,php:100,ehp:e.hp,emax:e.hp,enemy:e,combo:0,eCount:K.every,armor:!!e.boss,busy:false,q:null,mode:null,topics:topicsFor(kid,stage),chap:chapterTopics(kid,stage),lastTier:0};
  Fx.setup(kid,e);$('#pName').innerHTML=`<span class="zht">${zhOf(beastOf(kid),formOf(Save.kid(kid).xp))}</span>`;$('#eName').textContent=e.name;
  $('#bTitle').textContent=(stage<=6?'STAGE '+stage:'ENDLESS '+(stage-6))+' · '+B.topics.map(t=>TOPIC_NAME[t]).join(' + ');
  show('battle');hud();showCards();msg(stage===6?`${e.name} has ARMOR. Land a HARD or SUPER attack to break it!`:stage>6?`A wild ${e.name} appears! Anything goes in Endless mode.`:`A wild ${e.name} appears! It asks ${B.topics.map(t=>TOPIC_NAME[t]).join(' and ')} questions.`);
  B.track=e.boss?'boss':stage<=5?TRACK_ORDER[stage-1]:pick(TRACK_ORDER);Music.start(B.track)}
function hud(){$('#pHp').style.width=B.php+'%';$('#eHp').style.width=(B.ehp/B.emax*100)+'%';$('#pHpN').textContent=`HP ${Math.ceil(B.php)}/100`;$('#eHpN').textContent=`HP ${Math.ceil(B.ehp)}/${B.emax}`;$('#armor').hidden=!B.armor;
  const cb=$('#combo');cb.querySelectorAll('b').forEach((b,i)=>b.classList.toggle('on',i<Math.min(B.combo,3)));cb.classList.toggle('full',B.combo>=3);
  const every=KIDS[B.kid].every;$('#eturn').innerHTML=`ENEMY ATTACKS IN ${B.eCount} `+Array.from({length:every},(_,i)=>`<b class="${i<every-B.eCount?'on':''}"></b>`).join('')}
function msg(t,why){$('#msg').innerHTML='';const s=document.createElement('span');s.textContent=t;$('#msg').appendChild(s);if(why){const w=document.createElement('span');w.className='why';w.textContent=why;$('#msg').appendChild(w)}}
function showCards(){B.mode='pick';B.busy=false;$('#qbox').hidden=true;const box=$('#cards');box.hidden=false;box.innerHTML='';const K=beastOf(B.kid);
  const list=[1,2,3].map(t=>({tier:t,name:K.moves[t-1],pow:CARD_POW[t-1]}));
  if(B.combo>=3)list.push({tier:3,name:K.ult,pow:SUPER_POW,sup:true});
  box.classList.toggle('four',false);
  list.forEach(cd=>{const b=document.createElement('button');b.type='button';b.className='card'+(cd.sup?' super':'');
    const tired=!cd.sup&&cd.tier===1&&B.lastTier===1;b.disabled=tired;
    b.innerHTML=`<span class="num" aria-hidden="true">${box.children.length+1}</span><b>${cd.name}</b><span class="st">${cd.sup?'★ SUPER ★':'★'.repeat(cd.tier)+'☆'.repeat(3-cd.tier)}</span><em>${tired?'RESTING<br>pick a harder card':(cd.sup?'HARD':TIER_NAME[cd.tier-1])+'<br>POW '+cd.pow}</em>`;
    b.onclick=()=>{ac();Sfx.tap();B.card=cd;B.lastTier=cd.tier;ask(cd.tier,'attack')};box.appendChild(b)})}
const zhOn=q=>!!(q&&q.zh&&B&&(B.kid==='milo'||B.src==='milo'));
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function qTextHTML(el,q){if(zhOn(q)){el.innerHTML=`<span class="zq">${esc(q.zh)}</span><span class="eq">${esc(q.text)}</span>`;el.classList.remove('cjk')}else{el.textContent=q.text;el.classList.toggle('cjk',hasCJK(q.text))}}
function sayQ(q){if(q.sayZh)return Speech.say(q.sayZh,'zh-TW');if(zhOn(q))return Speech.seq([[q.zh,'zh-TW'],[q.say||sayable(q.text),'en-US']]);if(q.say)Speech.say(q.say)}
function zhLabel(q,v){if(!zhOn(q))return '';let t='';if(q.kind==='color')t=ZC[v];else if(q.kind==='shape')t=ZS[v];else if(q.kind==='cshape'){const [c,sh]=v.split('-');t=(ZC[c]||'')+(ZS[sh]||'')}return t?`<span class="zl">${t}</span>`:''}
function choiceHTML(q,v){if(q.kind==='color')return `<span class="sw" style="background:${COLORS[v]}"></span>`+zhLabel(q,v);if(q.kind==='shape')return shapeSVG(v,'#ffcd75')+zhLabel(q,v);
  if(q.kind==='cshape'){const [c,sh]=v.split('-');return shapeSVG(sh,COLORS[c])+zhLabel(q,v)}return null}
const sayable=t=>String(t).replace(/−/g,' minus ').replace(/\+/g,' plus ').replace(/×/g,' times ').replace(/=/g,' equals ').replace(/→/g,', ');
function showSolution(q,choice){return new Promise(res=>{const o=$('#solve');
  qTextHTML($('#sQ'),q);
  const pic=$('#sPic');if(q.picHTML)pic.innerHTML=q.picHTML;else pic.textContent=q.pic||'';
  const fill=(el,v)=>{const h=choiceHTML(q,v);if(h)el.innerHTML=h;else el.textContent=v;el.classList.toggle('cjk',hasCJK(v))};
  fill($('#sMine'),choice);fill($('#sAns'),q.answer);
  const ol=$('#sSteps');ol.innerHTML='';(q.how&&q.how.length?q.how:[`The answer is ${cname(q.answer)}.`]).forEach(t=>{const li=document.createElement('li');li.textContent=t;li.classList.toggle('cjk',hasCJK(t));ol.appendChild(li)});
  o.hidden=false;o.scrollTop=0;setTimeout(()=>$('#sGo').focus(),50);
  if(q.sayZh)Speech.say(q.sayZh,'zh-TW');else if(KIDS[B.kid].autoSay||B.src==='milo')Speech.say(sayable(`The answer is ${cname(q.answer)}. `+(q.how||[]).join(' ')));
  $('#sGo').onclick=()=>{o.hidden=true;try{speechSynthesis.cancel()}catch(e){}Sfx.tap();res()}})}
function ask(tier,mode){let src=qsetOf(B.kid),tp=B.topics,ch=B.chap;
  if(src==='mix'){src=pick(QSETS);tp=topicsFor(src,B.stage);ch=chapterTopics(src,B.stage)}B.src=src;
  const q=nextQuestion(B.kid,tier,tp,ch,src);B.q=q;B.mode=mode;B.tier=tier;B.busy=false;
  $('#cards').hidden=true;$('#qbox').hidden=false;
  $('#qTier').textContent=mode==='shield'?'SHIELD QUESTION':(B.card.sup?'SUPER MOVE':TIER_NAME[tier-1]+' · '+B.card.name);
  qTextHTML($('#qText'),q);if(q.picHTML)$('#qPic').innerHTML=q.picHTML;else $('#qPic').textContent=q.pic||'';
  $('#sayBtn').hidden=!(q.say||q.sayZh||q.zh);
  const box=$('#opts');box.innerHTML='';const vis=q.kind==='color'||q.kind==='shape'||q.kind==='cshape';const long=!vis&&q.choices.some(c=>c.length>9);
  box.className='opts'+(long?' long':q.kind==='word'?' word':q.big?' big':'');
  q.choices.forEach(ch=>{const b=document.createElement('button');b.type='button';b.className='opt'+(hasCJK(ch)?' cjk':'');b.dataset.v=ch;
    const h=choiceHTML(q,ch),i=box.children.length+1;b.innerHTML=`<span class="num" aria-hidden="true">${i}</span>`+(h||'');if(h)b.setAttribute('aria-label',i+': '+cname(ch));else b.appendChild(document.createTextNode(ch));
    b.onclick=()=>answer(ch,b);box.appendChild(b)});
  if(q.sayZh||zhOn(q)||(q.say&&(KIDS[B.kid].autoSay||B.src==='milo')))sayQ(q);
  if(mode==='attack')msg('');B.t0=performance.now()}
$('#sayBtn').onclick=()=>{const q=B&&B.q;if(!q)return;sayQ(q)};
async function answer(choice,btn){if(!B||B.busy)return;B.busy=true;const K=KIDS[B.kid],ST=beastOf(B.kid),q=B.q,s=Save.kid(B.kid),dt=(performance.now()-B.t0)/1000;
  const right=choice===q.answer;try{window.KA&&(KA.setKid(B.kid),KA.answer({q:q.text,qid:q.id,given:choice,expected:q.answer,correct:right,tryNo:1,topic:q.topic,ms:dt*1000}));}catch(e){}markSeen(B.kid,q.id);right?s.right++:s.wrong++;Save.save();
  [...$('#opts').children].forEach(b=>{b.disabled=true;if(b.dataset.v===q.answer)b.classList.add('right')});if(!right)btn.classList.add('wrong');
  await wait(450);
  if(B.mode==='attack'){
    if(right){const sup=B.card.sup;let dmg=sup?SUPER_POW:CARD_POW[B.tier-1];const crit=!sup&&dt<K.crit[B.tier-1];if(crit)dmg=Math.round(dmg*1.5);
      if(B.armor&&!(sup||B.tier===3))dmg=Math.ceil(dmg/2);
      if(sup){B.combo=0;msg(ST.ult+'!!!')}else{B.combo++;msg(crit?'FAST ANSWER! CRITICAL HIT!':B.combo>=3?'3 IN A ROW! Your SUPER move is ready!':'Correct! '+B.card.name+'!')}
      $('#qbox').hidden=true;hud();
      await Fx.attack(sup?'super':B.tier,dmg,crit,()=>{B.ehp=Math.max(0,B.ehp-dmg);if(B.armor&&(sup||B.tier===3)){B.armor=false;Fx.text('ARMOR BROKEN!',146,20,'cyan')}hud()});
      if(B.ehp<=0)return victory()}
    else{B.combo=0;hud();Sfx.wrong();$('#qbox').hidden=true;msg('');await showSolution(q,choice);msg('Your attack missed! Now you know how to solve it.');await Fx.fizzle()}
    B.eCount--;hud();
    if(B.eCount<=0){B.eCount=K.every;return enemyTurn()}
    showCards()}
  else{ // shield
    const dmg=K.enemyDmg+(B.enemy.boss?5:0);$('#qbox').hidden=true;
    if(right)msg('Shield up! You blocked the attack!');else{Sfx.wrong();await showSolution(q,choice);msg('No shield this time!')}
    await Fx.enemyAttack(dmg,right,()=>{if(!right)B.php=Math.max(0,B.php-dmg);hud()});
    if(B.php<=0)return defeat();
    hud();showCards();msg('Your turn! Pick an attack.')}
}
