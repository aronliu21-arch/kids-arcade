const LESSONS=[['🤝','teamwork','合作',c=>`${c.H} learned that friends can do more together.`,c=>`${c.H}學到了:朋友一起合作,可以做到更多事。`],['💖','kindness','善良',c=>`${c.H} learned that being kind is a super power.`,c=>`${c.H}學到了:善良就是超能力。`],
  ['🏃','never give up','不放棄',c=>`${c.H} learned to never, ever give up.`,c=>`${c.H}學到了:永遠不要放棄。`],['😨','scared is OK','害怕沒關係',c=>`${c.H} learned that it is OK to be scared. Brave people feel scared too.`,c=>`${c.H}學到了:害怕沒關係,勇敢的人也會害怕。`],
  ['🧩','mistakes help','錯了也沒關係',c=>`${c.H} learned that mistakes help us learn.`,c=>`${c.H}學到了:犯錯可以幫助我們學習。`],['😂','laughter helps','笑一笑',c=>`${c.H} learned that a good laugh makes everything better.`,c=>`${c.H}學到了:笑一笑,什麼都會變好。`]];
const TALKS=[['💪','I won’t give up!','我不會放棄!','😤','You can do it!','你一定做得到!'],['😨','I’m a little scared…','我有一點害怕……','😨','Don’t worry, I’m right here.','別擔心,我在這裡陪你。'],
  ['🤔','Hmm, let me think.','嗯,讓我想一想。','🤔','Good idea, let’s think together.','好主意,我們一起想。'],['😆','This is so fun!','這好好玩!','😆','Best day ever!','今天是最棒的一天!'],
  ['🙋','Can someone help me?','有人可以幫我嗎?','🙋','I’ll help you!','我來幫你!'],['😂','Ha ha, that’s silly!','哈哈,好好笑!','😂','You’re so funny!','你好好笑喔!']];
const NEXTS=[['🔁','try again','再試一次',c=>`${c.H} tried again, more carefully this time, and got one step closer.`,c=>`${c.H}再試一次,這次更小心,離目標又近了一步。`,{mood:'🙂'}],
  ['🔎','look closer','仔細看',c=>`${c.H} looked closer and spotted something nobody else noticed: a tiny golden key!`,c=>`${c.H}仔細一看,發現了別人都沒注意到的東西:一把小小的金鑰匙!`,{prop:'🗝️',mood:'😮'}],
  ['🤝','team up','一起想辦法',c=>c.hasF?`${c.H} and ${c.F} put their heads together and made a plan.`:`${c.H} asked some little animals nearby to help, and they all made a plan together.`,c=>c.hasF?`${c.H}和${c.F}一起動腦筋,想出了一個計畫。`:`${c.H}請附近的小動物幫忙,大家一起想出了一個計畫。`,{mood:'🤝'}],
  ['🍪','snack break','點心時間',c=>`${c.H} sat down for a snack. Feeling strong again, ${c.H} was ready to keep going.`,c=>`${c.H}坐下來吃點心。吃飽了力氣又回來了,${c.H}準備好繼續出發!`,{prop:'🍪',mood:'😋'}],
  ['🎵','brave song','勇敢的歌',c=>`${c.H} sang a brave little song, and everyone felt braver.`,c=>`${c.H}唱了一首勇敢的小歌,大家都覺得更勇敢了。`,{fx:'sparkle',mood:'🎶'}],
  ['🗺️','make a plan','想計畫',c=>`${c.H} drew a plan in the dirt: first this, then that, then… surprise!`,c=>`${c.H}在地上畫了一個計畫:先這樣,再那樣,然後……驚喜!`,{mood:'🧐'}]];
const STEPS={
 begin:[{id:'hero',q:['Who is your hero?','誰是主角?'],opts:HEROES,draw:true},{id:'trait',q:['What is HERO like?','HERO 是什麼個性?'],opts:TRAITS},{id:'place',q:['Where does HERO live?','HERO 住在哪裡?'],opts:PLACES},{id:'want',q:['What does HERO want most?','HERO 最想要什麼?'],opts:WANTS},{id:'problem',q:['Uh oh! What goes wrong?','糟糕!發生什麼事?'],opts:PROBLEMS}],
 middle:[{id:'action',q:['What does HERO do?','HERO 決定怎麼做?'],opts:ACTIONS},{id:'result',q:['What happens?','結果呢?'],opts:RESULTS},{id:'talk',q:['What does HERO say?','HERO 說了什麼?'],opts:TALKS},{id:'next',q:['What does HERO try next?','HERO 接著怎麼做?'],opts:NEXTS},{id:'twist',q:['Then suddenly…','然後突然……'],opts:TWISTS}],
extra:{go:{id:'go',q:['Where does HERO go?','HERO 要去哪裡?'],opts:PLACES.map(p=>[p[0],p[1],p[2]])},meet:{id:'meet',q:['Who shows up?','誰出現了?'],opts:MEETS.filter(m=>m[5]!=='none')}},
 end:[{id:'climax',q:['The big moment! How does HERO fix the problem?','關鍵時刻!HERO 要怎麼解決問題?'],opts:CLIMAX},{id:'ending',q:['How does the story end?','故事怎麼結束?'],opts:ENDINGS},{id:'lesson',q:['What did HERO learn?','HERO 學到了什麼?'],opts:LESSONS}]};
function ctx(){const z=Z(),h=story.hero||{};const fr=[...curScene().actors].reverse().find(a=>a.role==='friend');const w=story.want;
  return{z,hasF:!!fr,H:h.name||(z?'主角':'our hero'),F:fr?fr.name:(z?'新朋友':'a new friend'),goalEn:w?w[6]:'',goalZh:w?w[7]:'',wantEn:w?w[3]:'',wantZh:w?w[4]:''}}
const val=(v,c)=>typeof v==='function'?v(c):v;
const curScene=()=>story.scenes[story.scenes.length-1];
const stepsOf=sc=>(sc.pre?[STEPS.extra[sc.pre]]:[]).concat(STEPS[sc.kind]);
function newScene(kind){const prev=story.scenes.length?curScene():null;
  const sc={kind,bg:prev?prev.bg:'meadow',fx:prev&&kind==='middle'&&['stars','snow','rain','bubbles'].includes(prev.fx)?prev.fx:'none',gray:prev?!!prev.gray:false,actors:prev?JSON.parse(JSON.stringify(prev.actors.filter(a=>a.role!=='prop'||a.keep))).map(a=>{delete a.say;delete a.mood;delete a.prog;return a}):[],lines:[],step:0};
  story.scenes.push(sc);return sc}
function addActor(sc,a){a.id='a'+Math.random().toString(36).slice(2,8);sc.actors.push(a);return a}
const heroOf=sc=>sc.actors.find(a=>a.role==='hero');
function sayBy(sc,a,en,zh){if(!a)return;a.say=Z()?zh:en;sc.sayId=a.id}
function saveHist(){hist.push(JSON.stringify({scenes:story.scenes,hero:story.hero,want:story.want,title:story.title,trait:story.trait,problem:story.problem,solved:story.solved}))}
const DRAWABLE={hero:['My hero','我的主角',true,'What is your hero’s name?','主角叫什麼名字?'],place:['Draw the place','畫出這個地方',false,'What is this place called?','這個地方叫什麼?'],
  go:['Draw the new place','畫出新的地方',false,'What is this place called?','這個地方叫什麼?'],want:['What do they want? Draw it','畫出最想要的東西',true,'What is it?','這是什麼?'],
  problem:['Draw the trouble-maker','畫出搗蛋鬼',true,'Who or what is it?','這是誰或什麼?'],meet:['Draw who they meet','畫出遇到的角色',true,'What is their name?','他叫什麼名字?'],twist:['Draw what appears','畫出突然出現的東西',true,'What is it?','這是什麼?']};
function drawOwn(id){const D=DRAWABLE[id],z=Z();const st=stepsOf(curScene()).find(x=>x.id===id);drawEmojis=st?st.opts.map(o=>o[0]).filter(e=>e!=='📍'&&e!=='🙅'):[];openDraw(z?D[1]:D[0],null,img=>{if(!img)return;let nm=(prompt(z?D[4]:D[3],'')||'').trim();
  const sc=curScene(),c=ctx(),key='i'+Date.now().toString(36);story.imgs[key]=img;saveHist();let line='';const hero=heroOf(sc);
  if(id==='hero'){nm=nm||(z?'小英雄':'Hero');story.hero={img:key,name:nm,type:z?'英雄':'hero'};sc.actors=sc.actors.filter(a=>a.role!=='hero');const h=addActor(sc,{role:'hero',img:key,name:nm,x:.32,y:.9,s:.36,m:'wander'});
    sayBy(sc,h,'Hi! I’m '+nm+'!','嗨!我是'+nm+'!');line=z?`從前從前,有一個英雄叫做${nm}。`:`Once upon a time, there was a hero named ${nm}.`;if(!story.title)story.title=z?`${nm}的大冒險`:`${nm}'s Big Adventure`}
  else if(id==='place'||id==='go'){nm=nm||(z?'一個神祕的地方':'a mysterious place');sc.bg='img:'+key;line=id==='place'?(z?`${c.H}住在${nm}。`:`${c.H} lived in ${nm}.`):(z?`接著,${c.H}來到了${nm}。`:`Then ${c.H} went to ${nm}.`)}
  else if(id==='want'){nm=nm||(z?'一個神祕的寶物':'a mysterious treasure');story.want=['🎨',nm,nm,nm,nm,'',nm,nm,'',''];sc.actors=sc.actors.filter(a=>a.role!=='goal');addActor(sc,{role:'goal',img:key,name:'',x:.84,y:.42,s:.16,m:'float',keep:true});
    line=z?`${c.H}最想要${nm}。`:`More than anything, ${c.H} wanted ${nm}.`}
  else if(id==='problem'){nm=nm||(z?'搗蛋鬼':'a trouble-maker');story.problem='custom';story.solved=false;story.customProblem=nm;const v=addActor(sc,{role:'villain',img:key,name:nm,x:.74,y:.9,s:.32,m:'stay'});
    sayBy(sc,v,'Hee hee! Trouble time!','嘻嘻!搗蛋時間到!');line=z?`可是有一天,${nm}出現了,惹出了大麻煩!`:`But one day, ${nm} showed up and caused big trouble!`}
  else if(id==='meet'){nm=nm||(z?'新朋友':'a new friend');const a=addActor(sc,{role:'friend',img:key,name:nm,x:.62,y:.9,s:.3,m:'bounce'});sayBy(sc,a,'Hi! Can I help?','嗨!我可以幫忙嗎?');line=z?`${c.H}遇到了${nm}。${nm}說:「我可以幫忙嗎?」`:`${c.H} met ${nm}. “Can I help?” asked ${nm}.`}
  else if(id==='twist'){nm=nm||(z?'一個奇怪的東西':'something strange');addActor(sc,{role:'prop',img:key,name:'',x:.55+Math.random()*.25,y:.88,s:.2,m:'bounce'});sc.fx='sparkle';line=z?`突然,${nm}出現了!`:`Suddenly, ${nm} appeared!`}
  if(line)sc.lines.push(line);sc.step++;touch();renderBuild()},DRAWABLE[id][2],id==='place'||id==='go')}
function applyChoice(oi){const sc=curScene(),st=stepsOf(sc)[sc.step],o=st.opts[oi];
  const c=ctx(),z=c.z;let line='';const hero=heroOf(sc);
  if(st.id==='hero'){story.hero={e:o[0],name:z?o[2]:o[1],type:z?o[4]:o[3]};sc.actors=sc.actors.filter(a=>a.role!=='hero');const h=addActor(sc,{role:'hero',e:o[0],name:story.hero.name,x:.32,y:.9,s:.34,m:'wander'});
    line=z?`從前從前,有一${o[5]}${o[4]}叫做${story.hero.name}。`:`Once upon a time, there was a ${o[3]} named ${story.hero.name}.`;sayBy(sc,h,'Hi! I’m '+story.hero.name+'!','嗨!我是'+story.hero.name+'!');
    if(!story.title)story.title=z?`${story.hero.name}的大冒險`:`${story.hero.name}'s Big Adventure`}
  else if(st.id==='trait'){story.trait=o[1];line=val(z?o[4]:o[3],c)}
  else if(st.id==='place'){sc.bg=o[1];const d=DETAIL[o[1]]||['',''];line=z?`${c.H}${o[5]},${d[1]}。`:`${c.H} lived ${o[3]}, ${d[0]}.`}
  else if(st.id==='go'&&sc.pre==='go'&&sc.step===0){const p=PLACES[oi],d=DETAIL[p[1]]||['',''];sc.bg=p[1];sc.fx='none';sc.gray=false;line=z?`${c.H}${p[6]},${d[1]}。`:`${c.H} went ${p[4]}, ${d[0]}.`}
  else if(st.id==='go'){if(oi===0)line=z?`${c.H}決定待在原地,仔細看看四周。`:`${c.H} decided to stay and look around carefully.`;else{const p=PLACES[oi-1],d=DETAIL[p[1]]||['',''];sc.bg=p[1];line=z?`接著,${c.H}${p[6]},${d[1]}。`:`Then ${c.H} went ${p[4]}, ${d[0]}.`}}
  else if(st.id==='want'){story.want=o;sc.actors=sc.actors.filter(a=>a.role!=='goal');if(o[5])addActor(sc,{role:'goal',e:o[5],name:'',x:.84,y:.42,s:.14,m:'float',keep:true});
    line=z?`${c.H}最想要${o[4]}。${o[9]}`:`More than anything, ${c.H} wanted to ${o[3]}. ${o[8]}`}
  else if(st.id==='meet'){if(o[5]!=='none'){const a=addActor(sc,{role:o[5],e:o[0],name:z?o[2]:o[1],x:o[5]==='villain'?.75:.62,y:.9,s:.3,m:o[6]});sayBy(sc,a,o[7],o[8]);
      line=o[5]==='villain'?(z?`糟糕!${o[4]}${o[2]}跳了出來,大吼:「${o[8]}」`:`Oh no! ${o[1]} the ${o[3]} jumped out. “${o[7]}” growled ${o[1]}.`):(z?`${c.H}遇到了${o[4]}${o[2]}。${o[2]}說:「${o[8]}」`:`${c.H} met ${o[1]}, a ${o[3]}. “${o[7]}” said ${o[1]}.`)}
    else line=z?`路上一個人也沒有,只有風在輕輕地吹。`:`Nobody was around. Only the wind whispered softly.`}
  else if(st.id==='talk'){if(hero){hero.mood=o[3];sayBy(sc,hero,o[1],o[2])}const fr=[...sc.actors].reverse().find(a=>a.role==='friend');
    line=z?`${c.H}說:「${o[2]}」`:`“${o[1]}” said ${c.H}.`;if(fr){line+=z?`${fr.name}笑著說:「${o[5]}」`:` ${fr.name} smiled. “${o[4]}”`;sayBy(sc,fr,o[4],o[5])}}
  else if(st.id==='lesson'){line=val(z?o[4]:o[3],c)+(z?'全劇終。':' The End.')}
  else{const ef=o[5]||{};
    if(st.id==='problem'){story.problem=oi;story.solved=false;line=z?`可是有一天,${val(o[4],c)}!`:`But one day, ${val(o[3],c)}!`}
    else if(st.id==='action')line=z?`${c.H}決定${o[4]}。`:`${c.H} decided to ${o[3]}.`;
    else if(st.id==='twist')line=z?`突然,${o[4]}!`:`Suddenly, ${o[3]}!`;
    else if(st.id==='result'||st.id==='next'){const en=val(o[3],c),zh=val(o[4],c);line=z?zh:en;if(st.id==='next'&&!ef.say)sc.sayId=null}
    else if(st.id==='climax'){const p=PROBLEMS[story.problem];const fix=story.problem==='custom'?(z?`解決了${story.customProblem}惹的麻煩`:`stopped ${story.customProblem}’s trouble`):p?val(z?p[7]:p[6],c):(z?'拯救了大家':'saved the day');line=z?`${val(o[4],c)},${c.H}${fix}!`:`${val(o[3],c)}, and ${c.H} ${fix}!`;story.solved=true;
      sc.gray=false;if(sc.fx==='storm'||sc.fx==='shake')sc.fx='none';
      sc.actors.filter(a=>a.role==='villain').forEach(a=>{if(ef.villain==='friend'){a.role='friend';a.mood='💖';sayBy(sc,a,'Thank you! Can I be your friend?','謝謝你!我可以當你的朋友嗎?')}else sc.actors=sc.actors.filter(x=>x!==a)});
      if(hero){hero.mood='😄';if(ef.villain!=='friend'||!sc.actors.some(a=>a.mood==='💖'))sayBy(sc,hero,'We did it!','我們成功了!')}sc.fx='confetti'}
    else if(st.id==='ending'){line=val(z?o[4]:o[3],c);if(ef.bg)sc.bg=ef.bg}
    if(ef.fx)sc.fx=ef.fx;if(ef.gray)sc.gray=true;if(ef.prop)addActor(sc,{role:'prop',e:ef.prop,name:'',x:.55+Math.random()*.25,y:.88,s:.16,m:'bounce'});
    if(ef.add){const v=addActor(sc,{role:ef.add[3],e:ef.add[0],name:z?ef.add[2]:ef.add[1],x:.74,y:.9,s:.3,m:'stay'});if(ef.say)sayBy(sc,v,ef.say[0],ef.say[1])}
    else if(st.id==='problem'&&hero)sayBy(sc,hero,'Oh no!','糟糕!');
    if(ef.dropGoal)sc.actors=sc.actors.filter(a=>a.role!=='goal');
    if(ef.heroMode&&hero)hero.m=ef.heroMode;
    if(ef.mood&&hero){hero.mood=ef.mood;if(ef.say)sayBy(sc,hero,ef.say[0],ef.say[1])}}
  if(line)sc.lines.push(line);sc.step++;return line}
// tap = preview (picture changes + sentence read aloud); ✓ confirm (or tap it again) = keep it and move on
let pv=null;
const snapStr=()=>JSON.stringify({scenes:story.scenes,hero:story.hero,want:story.want,title:story.title,trait:story.trait,problem:story.problem,solved:story.solved});
