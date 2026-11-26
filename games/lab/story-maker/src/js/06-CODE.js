/* ================= build: half picture, half decision ================= */
const CODE=[['move','Move 移動',[['right','➡️','walk right','往右走'],['left','⬅️','walk left','往左走'],['back','🔼','walk back','往後走'],['front','🔽','walk front','往前走'],['runr','🏃','run right','往右跑'],['runl','🏃‍♂️','run left','往左跑'],['hop','🐇','hop along','跳跳走'],['zigzag','〰️','zigzag','走 S 形'],['circle','⭕','walk a circle','繞圈走'],['turn','🔙','turn around','轉身'],['jump','⬆️','jump','跳一下'],['goto','🎯','go to a spot','走到那裡'],['home','🏠','back to start','回起點'],['up','🎈','fly up','飛起來'],['down','⬇️','land','降落']]],
  ['fun','Fun 好玩',[['spin','🔄','spin','轉圈'],['flip','🤸','flip','翻跟斗'],['dance','💃','dance','跳舞'],['grow','📏','bigger','變大'],['shrink','🤏','smaller','變小'],['hide','👻','disappear','消失'],['show','✨','appear','出現'],['sleep','😴','sleep','睡覺'],['bounce3','🏀','bounce x3','彈三下'],['shake','🫨','shiver','發抖'],['fall','😵','fall over','跌倒'],['bow','🙇','bow','鞠躬'],['wave','👋','wave','揮手'],['laugh','😂','laugh','哈哈笑'],['hearts','💖','hearts','愛心'],['stars','⭐','sparkles','星星'],['notes','🎵','sing','唱歌'],['ding','🔔','ding!','叮'],['drum','🥁','drum','咚']]],
  ['talk','Talk & feel 說話和心情',[['say','💬','say…','說話'],['think','💭','think…','想一想'],['shout','📢','shout…','大喊'],['happy','😄','happy','開心'],['sad','😢','sad','難過'],['angry','😡','angry','生氣'],['wow','😲','surprised','驚訝']]],
  ['ctrl','Control 控制',[['wait','⏱️','wait','等一下'],['wait2','⏳','wait longer','等久一點'],['loop','🔁','repeat forever','一直重複']]]];
const CODEMAP=Object.fromEntries(CODE.flatMap(g=>g[2].map(b=>[b[0],b])));
let director=false;
function codeIcon(b){if(b.k==='think')return'💭';if(b.k==='shout')return'📢';if(b.k==='to'){const a=curScene().actors.find(x=>x.id===b.id);return'👉'+(a?(a.e||'🎨'):'')}if(b.k==='say')return'💬';return(CODEMAP[b.k]||['','❓'])[1]}
function scriptOf(sc){if(!sc.script){const progs=sc.actors.filter(a=>a.prog&&a.prog.length);sc.script=[];const n=Math.max(0,...progs.map(a=>a.prog.length));
    for(let i=0;i<n;i++){const st=[];progs.forEach(a=>{const b=a.prog[i];if(b&&b.k!=='loop')st.push({...b,who:a.id});if(b&&b.k==='loop')sc.loop=true});if(st.length)sc.script.push(st)}progs.forEach(a=>delete a.prog)}
  return sc.script}
let dirJoin=false;
function renderDirector(){const sc=curScene(),z=Z(),P=$('bPanel');stage.director=true;const scr=scriptOf(sc);
  const cast=sc.actors;if(!cast.find(a=>a.id===stage.sel))stage.sel=(cast[0]||{}).id;const a=cast.find(x=>x.id===stage.sel);
  stage.onSel=()=>renderDirector();stage.onChange=()=>touch();
  const nm=x=>x?(x.name||(x.role==='goal'&&story.want?(z?story.want[2]:story.want[1]):'')||(x.e||'🎨')):'?',face=x=>x?(x.img?'🎨':x.e):'❔',byId=id=>sc.actors.find(x=>x.id===id);
  const act=b=>`${face(byId(b.who))}${codeIcon(b)}${b.t?`<i>${esc(b.t)}</i>`:''}`;
  P.innerHTML=`<div class="dirtop"><div class="tools dtools"><button class="btn go" id="dPlay">▶ ${z?'播放':'Play'}</button><button class="btn sm" id="dUndo1">↩️ ${z?'刪掉最後一個':'Remove last'}</button><button class="btn sm" id="dClear1">🗑️ ${z?'清空':'Clear'}</button><button class="btn green" id="dDone1">✓ ${z?'完成':'Done'}</button></div>
    <div class="q" style="margin:0 0 4px"><span>🎬 ${z?'導演時間':'Director time'}</span></div>
    <div class="timeline">${scr.length?scr.map((st,i)=>`<div class="tstep"><small>${i+1}</small>${st.map((b,j)=>`<button class="blk" data-del="${i}.${j}">${act(b)}<b>✕</b></button>`).join('<span class="plus">+</span>')}</div>`).join('<span class="arr">→</span>')+(sc.loop?`<span class="arr">→</span><button class="blk" id="noLoop">🔁<b>✕</b></button>`:'')
      :`<span class="ver">${z?'選角色和動作,一步一步排出這一幕。':'Pick a character and an action to build the scene step by step.'}</span>`}</div>
    <div class="row" style="gap:6px;margin-bottom:4px"><span class="ver">${z?'誰:':'Who:'}</span>${cast.map(x=>`<button class="mw${x.id===stage.sel?' on':''}" data-who="${x.id}">${face(x)} ${esc(nm(x))}</button>`).join('')}</div>
    <div class="row" style="gap:6px"><span class="ver">${z?'什麼時候:':'When:'}</span><button class="mw${dirJoin?'':' on'}" id="jThen">➡️ ${z?'接著做':'Then'}</button><button class="mw${dirJoin?' on':''}" id="jTog">🤝 ${z?'同時做':'Same time'}</button></div></div>
    ${a?`<div class="pal">${CODE.map(g=>g[2].map(b=>`<button class="pb ${g[0]}" data-k="${b[0]}"><span>${b[1]}</span>${z?b[3]:b[2]}</button>`).join('')+(g[0]==='move'?cast.filter(x=>x.id!==a.id).map(x=>`<button class="pb move" data-to="${x.id}"><span>👉${face(x)}</span>${z?`到${esc(nm(x))}旁`:`to ${esc(nm(x))}`}</button>`).join(''):'')).join('')}</div>
    <div class="legend"><i class="move"></i>${z?'移動':'Move'} <i class="fun"></i>${z?'好玩':'Fun'} <i class="talk"></i>${z?'說話心情':'Talk'} <i class="ctrl"></i>${z?'控制':'Control'} · ${z?'拖曳角色可以換起點':'Drag characters to set where they start'}</div>`:''}`;
  const add=b=>{if(scr.flat().length>=30){toast(z?'最多 30 個動作':'Up to 30 actions');return}b.who=a.id;
    const last=scr[scr.length-1];if(dirJoin&&last){const k=last.findIndex(x=>x.who===a.id);if(k>=0){scr.push([b])}else last.push(b)}else scr.push([b]);touch();renderDirector();stage.play()};
  P.querySelectorAll('[data-who]').forEach(x=>x.onclick=()=>{stage.sel=x.dataset.who;renderDirector()});
  $('jThen').onclick=()=>{dirJoin=false;renderDirector()};$('jTog').onclick=()=>{dirJoin=true;renderDirector()};
  P.querySelectorAll('[data-k]').forEach(x=>x.onclick=()=>{const k=x.dataset.k;
    if(k==='loop'){sc.loop=true;touch();renderDirector();stage.play();return}
    if(k==='say'||k==='think'||k==='shout'){const q={say:z?'要說什麼?':'What should they say?',think:z?'在想什麼?':'What are they thinking?',shout:z?'要大喊什麼?':'What do they shout?'}[k];const t=prompt(q,{say:z?'嗨!':'Hi!',think:z?'嗯……':'Hmm…',shout:z?'救命':'Help'}[k]);if(t&&t.trim())add({k,t:t.trim().slice(0,60)});return}
    if(k==='goto'){toast(z?'點畫面上要去的地方':'Now tap the picture where to go');stage.pick=(gx,gy)=>add({k,x:+gx.toFixed(3),y:+gy.toFixed(3)});return}
    add({k})});
  P.querySelectorAll('[data-to]').forEach(x=>x.onclick=()=>add({k:'to',id:x.dataset.to}));
  P.querySelectorAll('[data-del]').forEach(x=>x.onclick=()=>{const[i,j]=x.dataset.del.split('.').map(Number);scr[i].splice(j,1);if(!scr[i].length)scr.splice(i,1);touch();renderDirector();stage.play()});
  if($('noLoop'))$('noLoop').onclick=()=>{sc.loop=false;touch();renderDirector();stage.play()};
  $('dPlay').onclick=()=>stage.play();
  $('dUndo1').onclick=()=>{const last=scr[scr.length-1];if(!last)return;last.pop();if(!last.length)scr.pop();touch();renderDirector();stage.play()};
  $('dClear1').onclick=()=>{scr.length=0;sc.loop=false;touch();renderDirector();stage.reset()};
  $('dDone1').onclick=()=>{director=false;stage.director=false;stage.pick=null;renderBuild();stage.play()}}
function openBuild(){show('build');mountStage($('bStage'),()=>story&&curScene(),{caption:true});renderBuild()}
function sceneName(i){const sc=story.scenes[i];if(sc.kind==='begin')return Z()?'開頭':'Beginning';if(sc.kind==='end')return Z()?'結局':'Ending';const n=story.scenes.slice(0,i+1).filter(s=>s.kind==='middle').length;return Z()?`第 ${n} 章`:`Chapter ${n}`}
function renderBuild(anim){if(director){renderDirector();return}if(stage)stage.director=false;if($('mixBox'))$('mixBox').style.display='none';const sc=curScene(),steps=stepsOf(sc),z=Z(),c=ctx();
  $('bTitle').textContent=story.title||(z?'新故事':'New story');
  const dots=steps.map((_,i)=>`<i class="${i<sc.step?'done':i===sc.step?'cur':''}"></i>`).join('');
  $('bProg').innerHTML=`<span class="sc">${story.scenes.map((s,i)=>`<b class="${i===story.scenes.length-1?'cur':''}">${s.kind==='begin'?'🌅':s.kind==='end'?'🏁':'📖'}</b>`).join('')}</span><span>${esc(sceneName(story.scenes.length-1))}</span><span class="dots">${dots}</span>`;
  const w=story.want,pb=story.problem==='custom'?['🎨',story.customProblem,story.customProblem]:PROBLEMS[story.problem];
  $('bProg').innerHTML+=(w||pb)?`<div class="goal">${w?`<span>🎯 ${esc(z?w[4]:w[3])}</span>`:''}${pb?`<span class="${story.solved?'ok':'bad'}">${story.solved?'✅':'⚠️'} ${esc(mix(z?pb[2]:pb[1]))}</span>`:''}${story.trait?`<span>${(TRAITS.find(t=>t[1]===story.trait)||[''])[0]} ${esc(z?(TRAITS.find(t=>t[1]===story.trait)||['',''," "])[2]:story.trait)}</span>`:''}</div>`:'';
  const P=$('bPanel');
  if(pv||sc.step<steps.length){const st=steps[pv?sc.step-1:sc.step];const q=(z?st.q[1]:st.q[0]).replace('HERO',c.H);
    P.innerHTML=`${sc.step===0&&story.scenes.length===1?`<div class="langpick"><span>${z?'故事語言':'Story language'}:</span><button class="lp${z?'':' on'}" data-lg="en">🇺🇸 English</button><button class="lp${z?' on':''}" data-lg="zh">🇹🇼 中文</button></div>`:''}<div class="q"><span>${esc(q)}</span><button class="btn sm" id="qSay">🔊</button></div>
      ${pv?`<div class="confirmbar"><span>👀 ${z?'看看喜歡嗎?':'Like it?'}</span><button class="btn green" id="pvOk">✓ ${z?'確定':'Confirm'}</button><button class="btn" id="pvNo">✕ ${z?'取消':'Cancel'}</button></div>`:''}<div class="opts">${DRAWABLE[st.id]&&!pv?`<button class="opt drawown" id="drawOwn"><span class="e">🎨</span><span class="t">${z?'畫我自己的':'Draw my own'}</span></button>`:''}${st.opts.map((o,i)=>`<button class="opt${pv&&pv.oi===i?' picked':''}" data-o="${i}"><span class="e">${o[0]}</span><span class="t">${esc(st.id==='hero'?(z?o[4]:o[3]):(z?o[2]:o[1]))}</span></button>`).join('')}
</div>
      <div class="tools">${story.scenes.length>1||sc.step?`<button class="btn sm" id="undo">↩️ ${z?'上一步':'Undo'}</button>`:''}<button class="btn sm" id="own">✏️ ${z?'我自己的點子':'My own idea'}</button>${story.scenes.some(s=>s.lines.length)?`<button class="btn sm" id="mixBtn">🔤 ${z?'混合語言 English':'Mix words 中文'}</button>`:''}${sc.lines.length?`<button class="btn sm" id="words">📝 ${z?'改文字':'Edit words'}</button>`:''}
${story.hero?`<button class="btn sm" id="rename">🏷️ ${z?'改名字':'Rename'}</button>`:''}</div>`;
    P.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>choose(+b.dataset.o));if($('pvOk'))$('pvOk').onclick=confirmPick;if($('pvNo'))$('pvNo').onclick=cancelPick;$('qSay').onclick=()=>speak(q);
    if($('drawOwn'))$('drawOwn').onclick=()=>drawOwn(st.id);
    if(anim!==true&&kid==='milo')speak(q)}
  else if(sc.kind!=='end'){const chap=mix(sc.lines.join(z?'':' '));P.innerHTML=`<div class="q"><span>${z?'這一章完成了!接下來呢?':'Chapter done! What next?'}</span></div>
      <div class="readbox"><div class="rbhead"><b>📖 ${esc(sceneName(story.scenes.length-1))}</b><button class="btn sm go" id="readChap">🔊 ${z?'唸這一章':'Read this chapter'}</button></div><div class="rbtext">${esc(chap)}</div></div>
      <div class="big2"><button class="opt big go2" id="more"><span class="e">➡️</span><span class="t">${z?'在這裡繼續':'Keep going here'}</span></button><button class="opt big go2" id="moreGo"><span class="e">🗺️</span><span class="t">${z?'去新的地方':'Go somewhere new'}</span></button>
        <button class="opt big go2" id="moreMeet"><span class="e">👋</span><span class="t">${z?'有新角色出現':'Someone new shows up'}</span></button><button class="opt big end2" id="finish"><span class="e">🏁</span><span class="t">${z?'結束故事':'End the story'}</span></button></div>
      <div class="tools"><button class="btn sm dirbtn" id="dirBtn">🎬 ${z?'導演這一章':'Direct this chapter'}</button><button class="btn sm" id="undo">↩️ ${z?'上一步':'Undo'}</button><button class="btn sm" id="words">📝 ${z?'改文字':'Edit words'}</button><button class="btn sm" id="peek">▶ ${z?'看到目前為止':'Watch so far'}</button>${story.scenes.some(s=>s.lines.length)?`<button class="btn sm" id="mixBtn">🔤 ${z?'混合語言 English':'Mix words 中文'}</button>`:''}</div>`;
    $('more').onclick=()=>{saveHist();newScene('middle');touch();renderBuild()};
    $('moreGo').onclick=()=>{saveHist();newScene('middle').pre='go';touch();renderBuild()};
    $('moreMeet').onclick=()=>{saveHist();newScene('middle').pre='meet';touch();renderBuild()};
    $('finish').onclick=()=>{saveHist();newScene('end');touch();renderBuild()};
    $('peek').onclick=()=>{saveNow();watch(0,true)};
    $('readChap').onclick=()=>speak(chap);if(anim===true)setTimeout(()=>speak(chap),400)}
  else{story.done=true;touch();saveNow();const whole=(story.title?story.title+(z?'。':'. '):'')+story.scenes.map(x=>mix(x.lines.join(z?'':' '))).join(z?'':' ');
    P.innerHTML=`<div class="q"><span>🎉 ${z?'故事完成了!已經存好了。':'Your story is finished and saved!'}</span></div>
      <div class="readbox"><div class="rbhead"><b>📖 ${esc(story.title||'')}</b><button class="btn sm go" id="readAll">🔊 ${z?'唸整個故事':'Read the whole story'}</button></div>
        <div class="rbtext whole">${story.scenes.map((x,i)=>`<p><b>${esc(sceneName(i))}</b><br>${esc(mix(x.lines.join(z?'':' ')))}</p>`).join('')}</div></div>
      <div class="big2"><button class="opt big go2" id="watchAll"><span class="e">🎬</span><span class="t">${z?'播放我的故事':'Watch my story'}</span></button><button class="opt big" id="toAlbum"><span class="e">🖼️</span><span class="t">${z?'存到 iPad 照片 (圖片/影片)':'Save to Photos (pictures/video)'}</span></button></div>
      <div class="tools"><button class="btn sm dirbtn" id="dirBtn">🎬 ${z?'導演這一幕':'Direct this scene'}</button><button class="btn sm" id="undo">↩️ ${z?'上一步':'Undo'}</button><button class="btn sm" id="retitle">🏷️ ${z?'故事名字':'Story name'}</button></div>`;
    $('watchAll').onclick=()=>watch(0);$('toAlbum').onclick=()=>sendStory(story,()=>renderBuild());$('retitle').onclick=()=>{const t=prompt(z?'故事的名字:':'Story name:',story.title);if(t){story.title=t.trim();touch();renderBuild()}};
    $('readAll').onclick=()=>speak(whole);if(anim===true)setTimeout(()=>speak(whole),500)}
  if($('mixBtn'))$('mixBtn').onclick=mixPanel;
  if($('dirBtn'))$('dirBtn').onclick=()=>{if(!curScene().actors.length){toast(z?'先選一個主角':'Pick a hero first');return}director=true;renderDirector()};
  if($('undo'))$('undo').onclick=()=>{if(pv){cancelPick();return}const h=hist.pop();if(!h){toast(z?'沒有上一步了':'Nothing to undo');return}const o=JSON.parse(h);Object.assign(story,{trait:null,problem:null,solved:false},o);story.done=false;touch();renderBuild()};
  if($('own'))$('own').onclick=()=>{if(pv)cancelPick();const t=prompt(z?'寫下你的點子:':'Type your own idea:','');if(t&&t.trim()){saveHist();sc.lines.push(t.trim());sc.step++;touch();renderBuild()}};
  if($('words'))$('words').onclick=()=>{const t=prompt(z?'改這一段的文字:':'Change the words for this scene:',sc.lines.join(z?'':' '));if(t!=null){sc.lines=t.trim()?[t.trim()]:[];touch();renderBuild()}};
  P.querySelectorAll('[data-lg]').forEach(b=>b.onclick=()=>{story.lang=b.dataset.lg;touch();renderBuild()});
  if($('rename'))$('rename').onclick=()=>{const t=prompt(z?'主角的新名字:':'Hero’s new name:',story.hero.name);if(t&&t.trim()){const old=story.hero.name;story.hero.name=t.trim();
    story.scenes.forEach(s=>{s.lines=s.lines.map(l=>l.split(old).join(story.hero.name));s.actors.forEach(a=>{if(a.role==='hero')a.name=story.hero.name})});if(story.title.includes(old))story.title=story.title.split(old).join(story.hero.name);touch();renderBuild()}}}
$('bBack').onclick=()=>{if(pv)cancelPick();saveNow();openShelf()};

