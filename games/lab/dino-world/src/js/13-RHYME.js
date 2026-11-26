const RHYME=[['cat','hat','bat','mat','rat'],['dog','log','frog','fog'],['pig','big','wig','dig'],['sun','run','fun','bun'],['bed','red','fed'],['hop','top','mop','pop'],['bug','rug','hug','mug']];
const SPELL=[null,CVC.map(w=>[w[0].toUpperCase(),w[1]]),BLEND.filter(w=>w[0].length===4).map(w=>[w[0].toUpperCase(),w[1]]),[['SHIP','🚢'],['FISH','🐟'],['CHIP','🍟'],['SHOP','🏪'],['MOTH','🦋'],['BATH','🛁'],['DUCK','🦆'],['SOCK','🧦'],['MILK','🥛'],['BELL','🔔']],
 [['CHICK','🐤'],['SNAIL','🐌'],['TRUCK','🚚'],['CLOCK','🕰️'],['PLANT','🪴'],['SHELL','🐚'],['SKUNK','🦨'],['BRUSH','🪥'],['TRAIN','🚆'],['SHEEP','🐑']]];
// zhuyin banks
const INI=[['ㄅ','玻'],['ㄆ','坡'],['ㄇ','摸'],['ㄈ','佛'],['ㄉ','得'],['ㄊ','特'],['ㄋ','訥'],['ㄌ','勒'],['ㄍ','哥'],['ㄎ','科'],['ㄏ','喝'],['ㄐ','基'],['ㄑ','欺'],['ㄒ','希'],['ㄓ','知'],['ㄔ','吃'],['ㄕ','詩'],['ㄖ','日'],['ㄗ','資'],['ㄘ','雌'],['ㄙ','思']];
const FIN=[['ㄚ','阿'],['ㄛ','喔'],['ㄜ','餓'],['ㄞ','愛'],['ㄠ','奧'],['ㄡ','歐'],['ㄢ','安'],['ㄣ','恩'],['ㄤ','昂'],['ㄦ','兒'],['ㄧ','衣'],['ㄨ','屋'],['ㄩ','魚']];
const SYL=[['媽','ㄇ','ㄚ','👩'],['爸','ㄅ','ㄚ','👨'],['茶','ㄔ','ㄚ','🍵'],['哥','ㄍ','ㄜ','👦'],['車','ㄔ','ㄜ','🚗'],['蛇','ㄕ','ㄜ','🐍'],['貓','ㄇ','ㄠ','🐱'],['包','ㄅ','ㄠ','🎒'],['狗','ㄍ','ㄡ','🐶'],['手','ㄕ','ㄡ','✋'],['山','ㄕ','ㄢ','⛰️'],['門','ㄇ','ㄣ','🚪'],['糖','ㄊ','ㄤ','🍬'],['風','ㄈ','ㄥ','🌬️'],['白','ㄅ','ㄞ','⚪'],['黑','ㄏ','ㄟ','⚫'],['飛','ㄈ','ㄟ','✈️'],['書','ㄕ','ㄨ','📚'],['兔','ㄊ','ㄨ','🐰']];
const TONES=[['ㄇㄚ',['媽','麻','馬','罵']],['ㄧ',['衣','姨','椅','意']],['ㄅㄚ',['巴','拔','把','爸']],['ㄊㄤ',['湯','糖','躺','燙']],['ㄈㄨ',['夫','福','斧','父']]];
const TMARK=['','ˊ','ˇ','ˋ'];
// logic banks
const CATS=[['fruit','水果',['🍎','🍌','🍇','🍓','🍊','🍐']],['animal','動物',['🐶','🐱','🐰','🐻','🐼','🦁']],['vehicle','交通工具',['🚗','🚌','🚲','🚂','✈️','🚀']],['clothes','衣服',['👕','👖','🧦','🧢','👟','🧤']],['instrument','樂器',['🥁','🎸','🎺','🎹','🎻']],['sea animal','海洋動物',['🐟','🐙','🦀','🐳','🐬']]];
const PROPS=[['can fly','會飛',['🐦','🦋','🐝','🦅','🦇'],['🐶','🐱','🐢','🐘']],['lives in water','住在水裡',['🐟','🐙','🦀','🐳'],['🐶','🐔','🐰','🦁']],['has wheels','有輪子',['🚗','🚌','🚲','🚂'],['⛵','🎈','🛶','🪁']]];
const NEEDS=[{b:'🍽️',it:'🍖',w:['Baby is hungry!','寶寶肚子餓了!'],a:['Food! Yum yum!','吃東西!好好吃!']},{b:'🥵',it:'🥤',w:['Baby is hot and thirsty!','寶寶又熱又口渴!'],a:['Water! Gulp gulp!','喝水!咕嚕咕嚕!']},
 {b:'💤',it:'🛏️',w:['Baby is sleepy!','寶寶想睡覺了!'],a:['Bed! Good night!','睡覺!晚安!']},{b:'🪰',it:'🛁',w:['Baby is dirty!','寶寶好髒!'],a:['A bath! So clean!','洗澡!好乾淨!']},
 {b:'😢',it:'🤗',w:['Baby is sad!','寶寶難過了!'],a:['A hug! Baby feels better!','抱抱!寶寶好多了!']},{b:'🥶',it:'🧣',w:['Baby is cold!','寶寶好冷!'],a:['A warm scarf! So cozy!','溫暖的圍巾!好舒服!']},
 {b:'🤕',it:'🩹',w:['Baby fell down and hurt his knee!','寶寶跌倒,膝蓋受傷了!'],a:['A bandage! All better!','貼OK繃!好多了!']},{b:'😨',it:'🔦',w:['Baby is scared of the dark!','寶寶怕黑!'],a:['A flashlight! Now it’s bright!','手電筒!現在亮亮的!']}];
const SOCIAL=[['⚽','Two dinos want the same ball. What should they do?','兩隻恐龍都想要同一顆球。牠們應該怎麼做?',[['🔁','Take turns','輪流玩',1],['✊','Grab it','用搶的'],['😭','Cry loudly','大哭'],['🙈','Hide the ball','把球藏起來']]],
 ['🤕','A friend fell down and is crying. What should you do?','朋友跌倒在哭。你應該怎麼做?',[['🤗','Help and ask “Are you OK?”','幫忙並問「你還好嗎?」',1],['😂','Laugh','笑他'],['🏃','Run away','跑走'],['🙄','Ignore him','不理他']]],
 ['🧱','You knocked down your friend’s tower by accident. What should you do?','你不小心弄倒朋友的積木塔。你應該怎麼做?',[['🙏','Say sorry and help fix it','說對不起並幫忙蓋好',1],['🙈','Hide','躲起來'],['😠','Say it’s their fault','說是他的錯'],['🏃','Run away','跑走']]],
 ['🦕','A new dino has no one to play with. What should you do?','一隻新來的恐龍沒有人陪牠玩。你應該怎麼做?',[['👋','Invite it to play','邀請牠一起玩',1],['🙅','Say “Go away”','說「走開」'],['😴','Pretend not to see','假裝沒看到'],['😝','Make faces','扮鬼臉']]],
 ['🛝','You want a turn on the slide. What should you do?','你想玩溜滑梯。你應該怎麼做?',[['🧍','Wait in line','排隊等',1],['🫸','Push to the front','推別人插隊'],['😭','Cry','哭'],['😠','Yell','大叫']]],
 ['🍪','You have two cookies. Your friend has none. What could you do?','你有兩塊餅乾,朋友一塊都沒有。你可以怎麼做?',[['🤝','Share one','分他一塊',1],['😋','Eat both fast','趕快兩塊都吃掉'],['🙈','Hide them','藏起來'],['😝','Tease him','逗他']]]];
const SEQS=[[['🥚','🐣','🐔'],'First an egg, then a chick, then a hen!','先是蛋,再是小雞,然後變母雞!'],[['🌱','🌿','🌳'],'A seed grows into a big tree!','種子長成大樹!'],[['☁️','🌧️','🌈'],'After the rain comes a rainbow!','下完雨出現彩虹!'],
 [['⛄','☀️','💧'],'The sun melts the snowman!','太陽把雪人融化了!'],[['🌾','🥣','🍞'],'Wheat becomes flour, then bread!','小麥變成麵粉,再變成麵包!'],[['🌑','🌓','🌕'],'The moon grows full!','月亮慢慢變圓!']];
const MG={
 /* math: L1 add to 10 · L2 add/take away to 20 · L3 missing number · L4 two steps · L5 tens */
 fruit:{icon:'🍎',en:'Fruit Stand',zh:'水果攤',total:6,topic:'math',tip:['Count the fruit when you shop!','買東西時數一數水果!'],
  run(api){let i=0;const go=()=>{if(i>=6)return api.end();const L=LV('math'),F=pick(FRUIT),T=pick(['rex','stego','trike','ankylo']);let a,b,c,ans,q,vis,why;
   if(L===1){a=ri(1,4);b=ri(1,3);ans=a+b;q=[`I have ${a} ${nm(a,F)}. My friend gives me ${b} more. How many now?`,`我有${a}個${F[3]},朋友再給我${b}個。現在有幾個?`];vis=frames(a,F[0])+'<b class="op">+</b>'+frames(b,F[0]);why=[`${a} + ${b} = ${ans}`,`${a}加${b}等於${ans}`];}
   else if(L===2){if(rnd(2)){a=ri(6,12);b=ri(3,20-a);ans=a+b;q=[`I picked ${a} ${F[2]}, then ${b} more. How many altogether?`,`我摘了${a}個${F[3]},又摘了${b}個。一共幾個?`];vis=frames(a,F[0])+'<b class="op">+</b>'+frames(b,F[0]);why=[`${a} + ${b} = ${ans}`,`${a}加${b}等於${ans}`];}
    else{a=ri(11,20);b=ri(3,a-4);ans=a-b;q=[`There were ${a} ${F[2]}. The dinos ate ${b}. How many are left?`,`本來有${a}個${F[3]},恐龍吃掉了${b}個。還剩幾個?`];vis=frames(a,F[0],b);why=[`${a} − ${b} = ${ans}`,`${a}減${b}等於${ans}`];}}
   else if(L===3){a=ri(4,12);c=ri(a+3,20);ans=c-a;q=[`I have ${a} ${F[2]}. I need ${c} for the party. How many more do I need?`,`我有${a}個${F[3]},派對需要${c}個。還需要幾個?`];vis=frames(a,F[0])+`<b class="op">→ ${c}</b>`;why=[`${a} and ${ans} more makes ${c}!`,`${a}再加${ans}就是${c}!`];}
   else if(L===4){a=ri(8,14);b=ri(2,5);c=ri(3,7);ans=a-b+c;q=[`Rex had ${a} ${F[2]}. He ate ${b}, then found ${c} more. How many now?`,`暴龍有${a}個${F[3]},吃了${b}個,又找到${c}個。現在有幾個?`];vis=`<b class="op">${F[0]} ${a} − ${b} + ${c}</b>`;why=[`${a} − ${b} = ${a-b}, and ${a-b} + ${c} = ${ans}!`,`${a}減${b}是${a-b},${a-b}加${c}是${ans}!`];}
   else{if(rnd(2)){a=ri(1,5)*10;b=ri(1,4)*10;ans=a+b;}else{a=ri(2,8)*10+ri(1,4);b=ri(1,5);ans=a+b;}q=[`A box has ${a} ${F[2]}. Another has ${b}. How many in all?`,`一箱有${a}個${F[3]},另一箱有${b}個。一共幾個?`];vis=tens(a)+'<b class="op">+</b>'+tens(b);why=[`${a} + ${b} = ${ans}`,`${a}加${b}等於${ans}`];}
   const vals=numOpts(ans,0,100);api.el.innerHTML=`<div class="row"><div style="width:clamp(70px,min(26vmin,18vw),220px)">${smallDino(T)}</div><div class="vis">${vis}</div></div>${optsHTML(vals.map(v=>`<span class="num">${v}</span>`))}`;
   api.prompt(q[0],q[1]);bindOpts({ans:vals.indexOf(ans),vals,label:`math L${L}`,expected:ans,why,retry:['Count again!','再數一次!']},()=>{i++;go();});};go();}},
 /* counting: L1 1→8 · L2 back from 20 · L3 by 2s · L4 by 5s · L5 by 10s */
 lava:{icon:'🌋',en:'Stepping Stones',zh:'跳石頭',total:8,topic:'order',tip:['Count by 2s on the stairs: 2, 4, 6!','爬樓梯時兩個兩個數:2、4、6!'],
  run(api){const el=api.el;el.classList.add('lavaStage');const L=LV('order');
   const order={1:[1,2,3,4,5,6,7,8],2:[20,19,18,17,16,15,14,13],3:[2,4,6,8,10,12,14,16],4:[5,10,15,20,25,30,35,40],5:[10,20,30,40,50,60,70,80]}[L];
   const decoy={1:[9,10],2:[21,12],3:[7,11],4:[12,23],5:[15,35]}[L];const intro={1:['Jump in order: 1, 2, 3…','按照順序跳:1、2、3……'],2:['Count down from 20!','從20倒著數!'],3:['Count by 2s: 2, 4, 6…','兩個兩個數:2、4、6……'],4:['Count by 5s: 5, 10, 15…','五個五個數:5、10、15……'],5:['Count by 10s: 10, 20, 30…','十個十個數:10、20、30……']}[L];
   const narrow=el.clientWidth<560;const grid=narrow?[[16,30],[39,28],[62,30],[85,28],[16,55],[39,53],[62,55],[85,53],[28,78],[62,78],[85,78]]:[[20,28],[36,26],[52,30],[68,26],[84,30],[20,70],[36,72],[52,68],[68,72],[84,70]];
   const spots=shuffle(grid).map(([x,y])=>[x+ri(-2,2),y+ri(-3,3)]);const nums=order.concat(decoy);
   const ci=A.ci,gc=ci!=null&&CH[ci]?CH[ci]:null,goal=ci===3?['trike',MOMC]:gc&&gc.baby?[gc.baby.t,gc.baby.c]:['brachio',solid('brachio','yellow')];
   el.innerHTML=`<div class="hero" id="hero" style="left:${narrow?10:6}%;top:${narrow?97:52}%">${smallDino('babytrike',PIPC)}</div><div class="baby" style="left:${narrow?88:95}%;top:${narrow?14:48}%">${smallDino(goal[0],goal[1])}</div>`+nums.map((n,k)=>`<button class="stone" data-n="${n}" style="left:${spots[k][0]}%;top:${spots[k][1]}%">${n}</button>`).join('');
   const stones=[...el.querySelectorAll('.stone')];let step=0,miss=0;api.prompt(intro[0],intro[1]);
   const hop=s=>{SFX.hop();$('hero').style.left=s.style.left;$('hero').style.top=s.style.top;s.classList.add('done');};
   const ask=()=>{if(step>=order.length){$('hero').style.left=narrow?'80%':'90%';$('hero').style.top=narrow?'14%':'48%';SFX.fanfare();track('order',miss<=1,true);api.prompt('You made it across!','你跳過去了!');setTimeout(()=>api.end(),1800);SOLVE=null;return;}
    const want=order[step];const target=stones.find(s=>+s.dataset.n===want);if(step>0)api.prompt(`What comes after ${order[step-1]}?`,`${order[step-1]}的下一個是幾?`);
    const judge=api.q({label:`count L${L} ${want}`,expected:want,quiet:true,notrack:true,wait:450,hint:()=>target.classList.add('wiggle'),retry:[`Count again!`,`再數一次!`],reveal:()=>target.classList.add('glow'),why:[`${want} is next!`,`下一個是${want}!`]},()=>{target.classList.remove('glow','wiggle');if(!target.classList.contains('done'))hop(target);step++;ask();});
    stones.forEach(s=>s.onclick=()=>{const n=+s.dataset.n;if(s.classList.contains('done'))return;if(judge(n===want,n))hop(s);else{miss++;shakeIt(s);}});SOLVE=()=>target.click();};
   setTimeout(ask,REDUCED?0:2600);SOLVE=()=>{};}},
 /* reading: L1 words · L2 blends · L3 sentences · L4 questions · L5 rhymes */
 mail:{icon:'📜',en:'Read the Signs',zh:'讀牌子',total:6,topic:'read',tip:['Read the signs when you go out!','出門時讀一讀路上的牌子!'],
  run(api){let i=0;const go=()=>{if(i>=6)return api.end();const L0=LV('read');let card,vals,ans,say1,why,big=true;
   if(L0===1){const pool=CVC.concat(BLEND);const [w,em]=pick(pool);const Lt=w[0];const others=shuffle(pool.filter(x=>x[0][0]!==Lt)).slice(0,2).map(x=>x[1]);vals=shuffle([em,...others]);ans=vals.indexOf(em);
    api.el.innerHTML=`<div class="wordcard">${Lt.toUpperCase()} ${Lt}</div>${optsHTML(vals.map(v=>`<span class="pic">${v}</span>`))}`;readCard(api.el.querySelector('.wordcard'),`${Lt.toUpperCase()}. ${Lt}, ${Lt}`,'');api.prompt(`${Lt.toUpperCase()}! Which picture starts with ${Lt.toUpperCase()}?`,`哪一張圖是${Lt.toUpperCase()}開頭?`);
    bindOpts({pics:1,ans,vals,label:'read L1 first sound',expected:w,why:[`${w} starts with ${Lt.toUpperCase()}!`,`${w}是${Lt.toUpperCase()}開頭!`],hint:()=>say(`${w}. ${Lt}, ${Lt}, ${w}`,'')},()=>{i++;go();});return;}
   const L=L0-1;
   if(L<=2){const [w,em]=pick(L===1?CVC:BLEND);const others=shuffle((L===1?CVC:BLEND).filter(x=>x[0]!==w)).slice(0,3).map(x=>x[1]);vals=shuffle([em,...others]);ans=vals.indexOf(em);card=w;say1=[w,''];why=[`It says “${w}”!`,`上面寫的是 ${w}!`];}
   else if(L===3){const s=pick(SUBJ),p=pick(PLACE),s2=pick(SUBJ.filter(x=>x!==s)),p2=pick(PLACE.filter(x=>x!==p));card=`The ${s[0]} is in the ${p[0]}.`;
    const pairs=shuffle([[s,p],[s2,p],[s,p2],[s2,p2]]);vals=pairs.map(([a,b])=>`${a[1]}<small>in</small>${b[1]}`);ans=pairs.findIndex(([a,b])=>a===s&&b===p);say1=[card,''];why=[card,`${s[2]}在${p[2]}裡面。`];}
   else if(L===4){const [qe,qz,yes,no]=pick(QCAT);const y=pick(yes);vals=shuffle([y].concat(shuffle(no).slice(0,3)));ans=vals.indexOf(y);card=qe;say1=[qe,qz];why=[`${qe.replace('Which one','This one')}`,qz];}
   else{const fam=pick(RHYME);const [base,...rh]=shuffle(fam);const right=pick(rh);const others=shuffle(RHYME.filter(f=>f!==fam).map(f=>pick(f))).slice(0,3);vals=shuffle([right,...others]);ans=vals.indexOf(right);card=`Which word rhymes with “${base}”?`;say1=[card,''];why=[`${base} and ${right} rhyme!`,`${base}和${right}押韻!`];big=false;}
   api.el.innerHTML=`<div class="wordcard${L>=3?' sm':''}">${card}</div>${optsHTML(L===5?vals.map(v=>`<span class="wd">${v}</span>`):vals.map(v=>`<span class="pic">${v}</span>`))}`;
   readCard(api.el.querySelector('.wordcard'),L===5?card:say1[0],L===4?say1[1]:'');
   sayParts((i===0?parts('Listen and read along!','聽一聽,跟著讀!'):[]).concat([[soundOut(L===5?card:say1[0]),'en-US']],L===4&&S.voice!=='en'?[[say1[1],'zh-TW']]:[]));$('gTxt').innerHTML=bi('Listen and read along! Tap the card to hear it again.','聽一聽,跟著讀!點卡片可以再聽一次。');
   bindOpts({pics:L<=2||L===4,ans,vals,label:`read L${L}`,expected:vals[ans],why,hint:()=>{say(say1[0],say1[1]);},retry:['Listen and try again!','聽一聽,再試一次!']},()=>{i++;go();});};go();}},
 /* spelling: dig up letters, then spell from the picture + sound. L1 cat · L2 frog · L3 ship · L4 truck */
 fossil:{icon:'🦴',en:'Letter Dig',zh:'挖字母',total:9,topic:'spell',tip:['Sound out words: f-r-o-g, frog!','把字拼出來:f-r-o-g,frog!'],
  run(api){const L=LV('spell');const words=shuffle(SPELL[L]).slice(0,L===1?3:2);A.total=words.reduce((a,w)=>a+w[0].length,0);drawDots();let wi=0;
   const word=()=>{if(wi>=words.length)return api.end();const [W,em]=words[wi];const decoys=shuffle(LETTERS.filter(c=>!W.includes(c))).slice(0,L===1?3:4);const letters=shuffle(W.split('').concat(decoys));
    const spots=shuffle([[12,25],[32,25],[52,25],[72,25],[90,25],[20,72],[42,72],[64,72],[86,72]]);let wordMiss=0;
    const el=api.el;el.innerHTML=`<div class="row"><span style="font-size:clamp(2.6rem,10vmin,4rem)">${em}</span><div class="boxes" id="wb">${W.split('').map(()=>`<div class="box"></div>`).join('')}</div></div>
     <div class="dig" id="dig">${letters.map((c,k)=>`<button class="fl" data-l="${c}" style="left:${spots[k][0]}%;top:${spots[k][1]}%">${c}</button><div class="sand" data-hp="3" style="left:${spots[k][0]}%;top:${spots[k][1]}%"></div>`).join('')}</div>`;
    api.prompt('Brush away the sand to find letters!','把沙子刷掉,找到字母!');
    const dig=$('dig'),sands=[...dig.querySelectorAll('.sand')];let down=false,left=sands.length;const lastHit=new WeakMap();
    const brushAt=(x,y)=>{for(const s of sands){if(s.dataset.hp==='0')continue;const r=s.getBoundingClientRect();if(x<r.left||x>r.right||y<r.top||y>r.bottom)continue;const t=performance.now();if(t-(lastHit.get(s)||0)<120)continue;lastHit.set(s,t);
      const hp=+s.dataset.hp-1;s.dataset.hp=hp;s.style.opacity=hp/3;SFX.brush();if(hp===0){left--;s.style.display='none';if(left===0){down=false;setTimeout(spell,500);}}}};
    dig.addEventListener('pointerdown',e=>{down=true;brushAt(e.clientX,e.clientY);});dig.addEventListener('pointermove',e=>{if(down)brushAt(e.clientX,e.clientY);});dig.addEventListener('pointerup',()=>down=false);dig.addEventListener('pointerleave',()=>down=false);
    const tiles=[...dig.querySelectorAll('.fl')];tiles.forEach(t=>t.onclick=()=>{});
    SOLVE=()=>{sands.forEach(s=>{if(s.dataset.hp!=='0'){s.dataset.hp='0';s.style.display='none';left--;}});spell();};
    let spelled=0;const boxes=[...$('wb').children];const sl=W.toLowerCase();
    function spell(){SFX.ding();boxes[0].classList.add('now');ask();}
    function ask(){if(spelled>=W.length){SFX.fanfare();track('spell',wordMiss===0,true);say(`${W.split('').join(', ')}. ${sl}!`,'');setTimeout(()=>{wi++;word();},1900);SOLVE=null;return;}
     const Lt=W[spelled];api.prompt(spelled===0?`${sl}! Spell ${sl}. What is the first letter?`:`${sl}. What comes next?`,spelled===0?`拼出${sl}!第一個字母是什麼?`:`${sl},下一個字母是什麼?`,null,[spelled===0?`Spell “${sl}”!`:'What comes next?',spelled===0?`拼出${sl}!`:'下一個字母?']);
     const right=tiles.find(t=>t.dataset.l===Lt&&!t.disabled);
     const judge=api.q({label:`spell L${L} ${W} ${spelled+1}`,expected:Lt,quiet:true,notrack:true,wait:450,hint:()=>{right.classList.add('wiggle');boxes[spelled].textContent=Lt;boxes[spelled].style.color='#ced4da';},reveal:()=>right.classList.add('glow'),why:[`It's ${Lt}!`,`是${Lt}!`]},()=>{put(right);spelled++;ask();});
     tiles.forEach(t=>t.onclick=()=>{if(t.disabled)return;if(!judge(t.dataset.l===Lt,t.dataset.l)){wordMiss++;shakeIt(t);}});SOLVE=()=>right.click();}
    function put(t){if(t.disabled)return;t.disabled=true;t.style.visibility='hidden';SFX.pop();say(t.dataset.l,'');const b=boxes[spelled];b.textContent=t.dataset.l;b.style.color='';b.classList.remove('now');b.classList.add('full');if(boxes[spelled+1])boxes[spelled+1].classList.add('now');}};
   word();}},
 /* zhuyin: L1 8 sounds · L2 all 21 · L3 vowels · L4 build a syllable · L5 tones */
 zhuyin:{icon:'🥁',en:'Echo Cave ㄅㄆㄇ',zh:'注音回音洞',total:6,topic:'zhuyin',tip:['Say ㄅㄆㄇㄈ with Mom and Dad!','和爸爸媽媽一起念ㄅㄆㄇㄈ!'],
  run(api){let i=0;const go=()=>{if(i>=6)return api.end();const L=LV('zhuyin');let vals,ans,sound,top,disp,why;
   if(L<=3){const bank=L===1?INI.slice(0,8):L===2?INI:FIN;const z=pick(bank);vals=shuffle([z].concat(shuffle(bank.filter(x=>x!==z)).slice(0,L===1?2:3)));ans=vals.indexOf(z);vals=vals.map(x=>x[0]);sound=[[z[1],'zh-TW']];
    top=`<div style="width:clamp(90px,22vmin,170px)">${smallDino('rex',solid('rex','orange'))}</div>`;disp=['Listen! Which sound is it?','聽一聽,是哪一個?'];why=null;}
   else if(L===4){const s=pick(SYL);const askIni=rnd(2);const bank=askIni?INI.map(x=>x[0]):FIN.map(x=>x[0]);const right=askIni?s[1]:s[2];vals=shuffle([right].concat(shuffle(bank.filter(x=>x!==right)).slice(0,3)));ans=vals.indexOf(right);sound=[[s[0],'zh-TW']];
    top=`<div class="bubble">${s[3]} ${s[0]}</div><div class="bubble">${askIni?'? + '+s[2]:s[1]+' + ?'}</div>`;disp=['Which sound fills the gap?','缺了哪一個注音?'];why=null;}
   else{const [syl,chars]=pick(TONES);const t=rnd(4);vals=[0,1,2,3].map(k=>syl+TMARK[k]);ans=t;sound=[[chars[t],'zh-TW']];top=`<div class="bubble">${syl} ?</div>`;disp=['Listen! Which tone?','聽一聽,是第幾聲?'];why=null;}
   api.el.innerHTML=`<div class="row">${top}<button class="opt" id="hear" style="width:clamp(70px,14vmin,100px);font-size:2.4rem">🔊</button></div>${optsHTML(vals.map(v=>`<span class="zy">${v}</span>`))}`;
   $('hear').onclick=()=>sayParts(sound);SFX.roar();setTimeout(()=>api.prompt(disp[0],disp[1],sound),400);
   bindOpts({ans,vals,label:`zhuyin L${L}`,expected:vals[ans],quiet:true,hint:()=>{$('hear').classList.add('wiggle');setTimeout(()=>sayParts(sound),600);},win:null,
    onOk:()=>sayParts(sound.concat(S.voice!=='zh'?[['Great job!','en-US']]:[['答對了!','zh-TW']]))},()=>{i++;go();});};go();}},
 /* mazes: bigger every level; from level 4 bring the egg first */
 maze:{icon:'🌿',en:'Dino Maze',zh:'恐龍迷宮',total:3,topic:'maze',tip:['Draw a maze for Mom to solve!','畫一個迷宮給媽媽走!'],
  run(api){let m=0;const go=()=>{if(m>=3)return api.end();const L=LV('maze');const N=[4,5,6,6,7][L-1];const egg=L>=4;
   const W=Array.from({length:N*N},()=>({n:1,e:1,s:1,w:1}));const seen=new Set([0]);const stack=[0];
   while(stack.length){const c=stack[stack.length-1],x=c%N,y=Math.floor(c/N);const nb=[];if(y>0&&!seen.has(c-N))nb.push(['n',c-N,'s']);if(x<N-1&&!seen.has(c+1))nb.push(['e',c+1,'w']);if(y<N-1&&!seen.has(c+N))nb.push(['s',c+N,'n']);if(x>0&&!seen.has(c-1))nb.push(['w',c-1,'e']);
    if(!nb.length){stack.pop();continue;}const [d,n2,back]=pick(nb);W[c][d]=0;W[n2][back]=0;seen.add(n2);stack.push(n2);}
   let pos=0,hasEgg=!egg,bumps=0;const goal=N*N-1;const eggAt=egg?ri(Math.floor(N*N/3),N*N-2):-1;const cs=10;
   let walls='';W.forEach((w,c)=>{const x=(c%N)*cs,y=Math.floor(c/N)*cs;if(w.n)walls+=`M${x} ${y}h${cs}`;if(w.w)walls+=`M${x} ${y}v${cs}`;if(c%N===N-1&&w.e)walls+=`M${x+cs} ${y}v${cs}`;if(Math.floor(c/N)===N-1&&w.s)walls+=`M${x} ${y+cs}h${cs}`;});
   const cell=c=>[(c%N)*cs+cs/2,Math.floor(c/N)*cs+cs/2];const [gx,gy]=cell(goal);
   api.el.innerHTML=`<div class="mazewrap"><svg id="mz" viewBox="-2 -2 ${N*cs+4} ${N*cs+4}"><rect x="0" y="0" width="${N*cs}" height="${N*cs}" fill="#d3f9d8"/><path d="${walls}" stroke="${INK}" stroke-width="1.3" stroke-linecap="round" fill="none"/>
    <g transform="translate(${gx-4.5},${gy-4.2}) scale(.09)">${dinoSVG('babytrike',PIPC)}</g>${egg?`<g id="egg"><ellipse cx="${cell(eggAt)[0]}" cy="${cell(eggAt)[1]}" rx="2.6" ry="3.3" fill="#fff3bf" stroke="${INK}" stroke-width=".6"/></g>`:''}
    <g id="me" style="transition:transform .18s"><g transform="translate(-4.2,-4) scale(.085)">${dinoSVG('rex',solid('rex','green'))}</g></g></svg>
    <div class="pad"><span></span><button data-d="n">⬆️</button><span></span><button data-d="w">⬅️</button><span></span><button data-d="e">➡️</button><span></span><button data-d="s">⬇️</button><span></span></div></div>`;
   const me=$('me');const place=()=>{const [x,y]=cell(pos);me.setAttribute('transform',`translate(${x},${y})`);};place();
   api.prompt(egg?'Get the egg, then bring it to the baby!':'Help T-Rex find the baby!',egg?'先拿到蛋,再帶去給寶寶!':'幫暴龍找到寶寶!');
   const judge=api.q({label:`maze L${L}`,expected:'goal',quiet:true,win:null},()=>{m++;go();});
   const move=d=>{if(W[pos][d]){bumps++;SFX.boing();shakeIt($('mz'));return;}pos+={n:-N,s:N,e:1,w:-1}[d];place();SFX.click();
    if(!hasEgg&&pos===eggAt){hasEgg=true;$('egg').remove();SFX.ding();say('You got the egg!','拿到蛋了!');}
    if(pos===goal){if(!hasEgg){say('Get the egg first!','先拿到蛋!');return;}judge(true,bumps);say('You found the baby!','你找到寶寶了!');}};
   api.el.querySelectorAll('.pad button').forEach(b=>b.onclick=()=>move(b.dataset.d));
   let sp=null;$('mz').onpointerdown=e=>{sp=[e.clientX,e.clientY];};$('mz').onpointerup=e=>{if(!sp)return;const dx=e.clientX-sp[0],dy=e.clientY-sp[1];sp=null;
    if(Math.max(Math.abs(dx),Math.abs(dy))>25){move(Math.abs(dx)>Math.abs(dy)?(dx>0?'e':'w'):(dy>0?'s':'n'));return;}
    const r=$('mz').getBoundingClientRect();const cx=Math.floor((e.clientX-r.left)/r.width*N),cy=Math.floor((e.clientY-r.top)/r.height*N);const px=pos%N,py=Math.floor(pos/N);
    if(Math.abs(cx-px)+Math.abs(cy-py)===1)move(cx>px?'e':cx<px?'w':cy>py?'s':'n');};
   onkeydown=e=>{const d={ArrowUp:'n',ArrowDown:'s',ArrowLeft:'w',ArrowRight:'e'}[e.key];if(d&&SCREEN==='game'&&A&&A.id==='maze'){e.preventDefault();move(d);}};
   // test hook: walk the solution
   SOLVE=()=>{if(!hasEgg){hasEgg=true;const e2=$('egg');if(e2)e2.remove();}pos=goal;place();judge(true,0);};};go();}},
 /* logic: L1 number patterns · L2 shape+color patterns · L3 odd one out · L4 skip patterns with a gap · L5 odd one out by what it can do */
 pattern:{icon:'🧩',en:'Snow Puzzles',zh:'雪地謎題',total:6,topic:'logic',tip:['Make up a number pattern for Mom: 2, 4, 6…','出一個數字規律給媽媽猜:2、4、6……'],
  run(api){let i=0;const go=()=>{if(i>=6)return api.end();const L=LV('logic');let html,vals,ans,disp,why,opt=v=>v;
   if(L===1||L===4){const step=L===1?pick([1,2]):pick([5,10,-2,-1,3]);const start=step<0?ri(12,20):ri(1,L===1?8:10);const seq=Array.from({length:5},(_,k)=>start+k*step);const gap=L===1?4:ri(1,4);const right=seq[gap];
    html=`<div class="trail">${seq.map((v,k)=>k===gap?'<div class="qm">?</div>':`<div class="numcard">${v}</div>`).join('')}</div>`;vals=numOpts(right,0,100);ans=vals.indexOf(right);disp=['Which number is missing?','少了哪個數字?'];why=[`It goes ${step>0?'up':'down'} by ${Math.abs(step)}: ${seq.join(', ')}!`,`每次${step>0?'加':'減'}${Math.abs(step)}:${seq.join('、')}!`];opt=v=>`<span class="num">${v}</span>`;}
   else if(L===2){const [s1,s2]=shuffle(['circ','tri','sq','star','heart']).slice(0,2),cs=shuffle(CK).slice(0,3);const item=k=>[k%2?s2:s1,cs[k%3]];const seq=[0,1,2,3,4].map(item);const right=item(5);
    const cand=[right,[right[0]===s1?s2:s1,right[1]],[right[0],pick(cs.filter(c=>c!==right[1]))],[right[0]===s1?s2:s1,pick(cs.filter(c=>c!==right[1]))]];vals=shuffle(cand);ans=vals.indexOf(right);
    html=`<div class="trail">${seq.map(([s,c])=>`<span class="sh">${shapeIcon(s,COL[c][0])}</span>`).join('')}<div class="qm">?</div></div>`;opt=([s,c])=>shapeIcon(s,COL[c][0]);disp=['Look at the shapes AND the colors. What comes next?','看形狀,也看顏色。下一個是什麼?'];why=['Shapes take turns, and colors take turns too!','形狀輪流,顏色也輪流!'];}
   else if(L===3){const [c1,c2]=shuffle(CATS).slice(0,2);const odd=pick(c2[2]);vals=shuffle(shuffle(c1[2]).slice(0,3).concat([odd]));ans=vals.indexOf(odd);html='';opt=v=>`<span class="pic">${v}</span>`;disp=['Which one doesn’t belong?','哪一個不一樣?'];why=[`The others are all ${c1[0]}s!`,`其他的都是${c1[1]}!`];}
   else{const [pe,pz,yes,no]=pick(PROPS);const odd=pick(no);vals=shuffle(shuffle(yes).slice(0,3).concat([odd]));ans=vals.indexOf(odd);html='';opt=v=>`<span class="pic">${v}</span>`;disp=['Which one doesn’t belong? Think about what they can do!','哪一個不一樣?想想牠們會做什麼!'];why=[`The others ${pe}!`,`其他的都${pz}!`];}
   api.el.innerHTML=html+optsHTML(vals.map(opt));api.prompt(disp[0],disp[1]);bindOpts({ans,vals,label:`logic L${L}`,expected:String(vals[ans]),why},()=>{i++;go();});};go();}},
 /* measuring: L1 tallest/shortest · L2 how many bricks long · L3 bigger number · L4 how many more · L5 biggest of four */
 eggs:{icon:'📏',en:'Measure & Compare',zh:'量一量比一比',total:6,topic:'measure',tip:['Measure your bed with your hands!','用手量一量你的床有多長!'],
  run(api){let i=0;const go=()=>{if(i>=6)return api.end();const L=LV('measure');let html='',vals,ans,disp,why,opt=v=>`<span class="num">${v}</span>`;
   if(L===1){const hs=shuffle([2,3,4,5,6,7,8]).slice(0,4);const tall=rnd(2);const right=tall?Math.max(...hs):Math.min(...hs);vals=hs;ans=hs.indexOf(right);
    opt=h=>`<span class="tower">${Array.from({length:h},()=>`<i style="background:${COL[pick(CK)][0]}"></i>`).join('')}</span>`;disp=tall?['Which tower is the tallest?','哪一座塔最高?']:['Which tower is the shortest?','哪一座塔最矮?'];why=[`This one has ${right} bricks.`,`這座有${right}塊積木。`];}
   else if(L===2){const n=ri(3,10);html=`<div class="ruler"><div class="snake" style="width:calc(${n} * var(--u))">🐍</div><div class="bricks">${'<i></i>'.repeat(12)}</div></div>`;vals=numOpts(n,1,12);ans=vals.indexOf(n);disp=['How many bricks long is the snake?','蛇有幾塊積木長?'];why=[`It is ${n} bricks long!`,`牠有${n}塊積木長!`];}
   else if(L===3){const a=ri(11,99);let b=ri(11,99);while(b===a)b=ri(11,99);const big=rnd(2);vals=[a,b];ans=big?(a>b?0:1):(a<b?0:1);disp=big?['Which number is bigger?','哪個數字比較大?']:['Which number is smaller?','哪個數字比較小?'];why=[`${Math.max(a,b)} is bigger than ${Math.min(a,b)}.`,`${Math.max(a,b)}比${Math.min(a,b)}大。`];}
   else if(L===4){const a=ri(6,15),b=ri(2,a-2);html=`<div class="rows2"><div>${'<i style="background:#ff6b6b"></i>'.repeat(a)}</div><div>${'<i style="background:#4dabf7"></i>'.repeat(b)}</div></div>`;const d=a-b;vals=numOpts(d,0,15);ans=vals.indexOf(d);disp=['How many more red bricks than blue?','紅積木比藍積木多幾塊?'];why=[`${a} − ${b} = ${d}`,`${a}減${b}等於${d}`];}
   else{const t=ri(2,8),o=ri(1,9);const set=new Set([t*10+o,o*10+t,t*10+ri(0,9),ri(1,9)*10+o]);while(set.size<4)set.add(ri(10,99));vals=shuffle([...set]);const right=Math.max(...vals);ans=vals.indexOf(right);disp=['Which number is the biggest?','哪個數字最大?'];why=[`${right} is the biggest!`,`${right}最大!`];}
   api.el.innerHTML=html+optsHTML(vals.map(opt));api.prompt(disp[0],disp[1]);bindOpts({ans,vals,label:`measure L${L}`,expected:String(vals[ans]),why},()=>{i++;go();});};go();}},
 /* helping: L1 needs · L2 kind choices · L3 what happens next */
 /* bigger / smaller: L1 two dinos · L2 three · L3 line up 3 · L4 real things (taller, longer, heavier) · L5 line up 4 */
 size:{icon:'📏',en:'Big & Small',zh:'比大小',total:5,topic:'size',tip:['Line up your toys from small to big!','把玩具從小排到大!'],
  run(api){let i=0;const go=()=>{if(i>=5)return api.end();const L=LV('size');const t=pick(['rex','stego','trike','brachio','ankylo','spino','pachy','diplo']),cl=solid(t,pick(CK));
   const dino=p=>`<svg viewBox="-6 -14 112 98" style="width:${p}%;height:${p}%">${dinoSVG(t,cl)}</svg>`;
   if(L===3||L===5){const sz=L===3?[34,62,92]:[28,48,70,94];const order=shuffle(sz.map((_,k)=>k));api.el.innerHTML=`<div class="slots" id="szSlots">${sz.map(()=>'<div class="slot1"></div>').join('')}</div>`+optsHTML(order.map(k=>dino(sz[k])));
    const btns=[...api.el.querySelectorAll('.opt')],slots=[...api.el.querySelectorAll('.slot1')];let next=0;const W2=['small','medium','big','biggest'],Z2=['小','中','大','最大'];
    const want=()=>btns[order.indexOf(next)];
    const judge=api.q({label:`size L${L} order`,expected:'small→big',quiet:false,wait:900,hint:()=>{want().classList.add('wiggle');setTimeout(()=>want()&&want().classList.remove('wiggle'),1800);},reveal:()=>{while(next<sz.length){const b=want();slots[next].innerHTML=b.innerHTML;b.style.visibility='hidden';next++;}},
     retry:['Start with the smallest one!','從最小的開始!'],why:['Small, medium, big!','小、中、大!']},()=>{i++;go();});
    api.prompt('Line them up! Tap the smallest dino first.','排排看!先點最小的恐龍。');
    btns.forEach((b,j)=>b.onclick=()=>{if(b.style.visibility==='hidden')return;if(order[j]===next){SFX.pop();slots[next].innerHTML=b.innerHTML;b.style.visibility='hidden';const n=next;next++;
      const wd=sz.length===3?[['small','小'],['medium','中'],['big','大']]:[['small','小'],['medium','中'],['big','大'],['biggest','最大']];if(next>=sz.length)judge(true,'order');else say(wd[n][0],wd[n][1]);}else{shakeIt(b);judge(false,'order');}});
    SOLVE=()=>{const b=want();if(b)b.click();};return;}
   let html='',vals,ans,q,why,opt=v=>v;
   if(L===4){const [pe,pz,big,small,qe,qz]=pick(REALSZ);vals=shuffle([big,small]);ans=vals.indexOf(big);opt=v=>`<span class="pic">${v}</span>`;q=[qe,qz];why=[pe,pz];}
   else{const sz=L===1?[42,92]:[34,62,92];const want=rnd(2)?'big':'small';vals=shuffle(sz);ans=vals.indexOf(want==='big'?Math.max(...sz):Math.min(...sz));opt=dino;
    q=L===1?(want==='big'?['Which dino is bigger?','哪一隻恐龍比較大?']:['Which dino is smaller?','哪一隻恐龍比較小?']):(want==='big'?['Which dino is the biggest?','哪一隻恐龍最大?']:['Which dino is the smallest?','哪一隻恐龍最小?']);
    why=want==='big'?['This one is the biggest!','這隻最大!']:['This one is the smallest!','這隻最小!'];}
   api.el.innerHTML=html+optsHTML(vals.map(opt));api.prompt(q[0],q[1]);bindOpts({ans,vals,label:`size L${L}`,expected:String(ans),why,pics:L===4},()=>{i++;go();});};go();}},
 /* first, next, last: L1 day or night · L2 put 3 pictures in order · L3 put 4 in order */
 order3:{icon:'🌗',en:'First, Next, Last',zh:'先後順序',total:4,topic:'time',tip:['Tell Mom what you did first, next and last today!','跟媽媽說今天先做什麼、再做什麼、最後做什麼!'],
  run(api){let i=0;const go=()=>{if(i>=4)return api.end();const L=LV('time');
   if(L===1){const night=rnd(2);const pickA=shuffle(night?DAYNIGHT[1]:DAYNIGHT[0]).slice(0,1),pickB=shuffle(night?DAYNIGHT[0]:DAYNIGHT[1]).slice(0,2);const vals=shuffle(pickA.concat(pickB));const ans=vals.indexOf(pickA[0]);
    api.el.innerHTML=`<div class="need2">${night?'🌙':'☀️'}</div>`+optsHTML(vals.map(v=>`<span class="pic">${v}</span>`));
    const q=night?['Which one do we see at night?','哪一個是晚上看到的?']:['Which one is in the daytime?','哪一個是白天的?'];api.prompt(q[0],q[1]);
    bindOpts({pics:1,ans,vals,label:'time L1',expected:pickA[0],why:night?['At night we see the moon and stars, and we sleep!','晚上有月亮和星星,我們要睡覺!']:['In the daytime the sun is up and we play!','白天有太陽,我們出去玩!']},()=>{i++;go();});return;}
   const pool=L===2?TSEQ3:TSEQ4;const seq=pick(pool);const order=shuffle(seq.map((_,k)=>k));const WD=[['First','先'],['Next','再來'],['Then','然後'],['Last','最後']];const lab=seq.length===3?[WD[0],WD[1],WD[3]]:WD;
   api.el.innerHTML=`<div class="slots">${seq.map((_,k)=>`<div class="slot1"><small>${bi(lab[k][0],lab[k][1])}</small></div>`).join('')}</div>`+optsHTML(order.map(k=>`<span class="pic">${seq[k][0]}</span>`));
   const btns=[...api.el.querySelectorAll('.opt')],slots=[...api.el.querySelectorAll('.slot1')];let next=0;const want=()=>btns[order.indexOf(next)];
   picSay(btns,order.map(k=>seq[k][0]));
   const ask=()=>{if(next>=seq.length)return;const q=next===0?['What happens first?','先發生什麼?']:next===seq.length-1?['What happens last?','最後發生什麼?']:['What happens next?','接下來呢?'];api.prompt(q[0],q[1]);};
   const judge=api.q({label:`time L${L}`,expected:seq.map(x=>x[1]).join('→'),wait:1100,hint:()=>{want().classList.add('wiggle');setTimeout(()=>want()&&want().classList.remove('wiggle'),1800);},
    reveal:()=>{while(next<seq.length){const b=want();slots[next].insertAdjacentHTML('afterbegin',`<span class="pic">${seq[next][0]}</span>`);b.style.visibility='hidden';next++;}},
    why:[seq.map(x=>x[1]).join(', then ')+'!',seq.map(x=>x[2]).join(',然後')+'!'],retry:['Think: what happens first?','想一想:先發生什麼?']},()=>{i++;go();});
   ask();btns.forEach((b,j)=>b.onclick=e=>{if(e.target.closest('.opt-say')||b.style.visibility==='hidden')return;if(order[j]===next){SFX.pop();slots[next].insertAdjacentHTML('afterbegin',`<span class="pic">${seq[next][0]}</span>`);b.style.visibility='hidden';say(seq[next][1],seq[next][2]);next++;
     if(next>=seq.length)setTimeout(()=>judge(true,'order'),500);else setTimeout(ask,900);}else{shakeIt(b);judge(false,seq[order[j]][1]);}});
   SOLVE=()=>{const b=want();if(b)b.click();};};go();}},
 /* roar memory: watch which dinos roar, then roar them back. L1 2 roars … L5 6 roars */
 roar:{icon:'🎵',en:'Roar Echo',zh:'恐龍回音',total:4,topic:'memory',tip:['Clap a pattern and have Mom clap it back!','拍一個節奏,讓媽媽拍回來!'],
  run(api){let i=0;const P=[['rex','red',262],['brachio','blue',330],['stego','yellow',392],['ptero','green',523]];
   const go=()=>{if(i>=4)return api.end();const L=LV('memory');const n=L+1;const seq=Array.from({length:n},()=>rnd(4));let pos=0,busy=true;
    api.el.innerHTML=`<div class="pads">${P.map(([t,c],k)=>`<button class="opt pad" data-k="${k}" style="background:${COL[c][0]}33">${smallDino(t,solid(t,c))}</button>`).join('')}</div>`;
    const pads=[...api.el.querySelectorAll('.pad')];
    const lite=(k,ms)=>{const b=pads[k];b.classList.add('lit');tone(P[k][2],.32,'triangle',.25);tone(P[k][2]/2,.25,'sawtooth',.05);setTimeout(()=>b.classList.remove('lit'),ms||380);};
    const play=(then)=>{busy=true;let j=0;const step=()=>{if(j>=seq.length){busy=false;pos=0;then&&then();return;}lite(seq[j],420);j++;setTimeout(step,Math.max(520,760-L*40));};setTimeout(step,700);};
    const judge=api.q({label:`roar L${L} x${n}`,expected:seq.join(''),wait:1100,hint:()=>{play(()=>api.prompt('Your turn again!','再輪到你!'));},reveal:()=>{play();},
     why:['Listen, then copy the roars in order!','聽一聽,再照順序模仿!'],retry:['Listen again…','再聽一次……']},()=>{i++;go();});
    api.prompt(`Listen! ${n} dinos will roar.`,`聽!會有${n}隻恐龍吼叫。`);setTimeout(()=>play(()=>api.prompt('Your turn! Roar them back.','輪到你!照樣吼回去。')),1600);
    pads.forEach((b,k)=>b.onclick=()=>{if(busy)return;lite(k,260);if(k===seq[pos]){pos++;if(pos>=seq.length){busy=true;judge(true,seq.join(''));}}else{busy=true;shakeIt(b);judge(false,String(k));}});
    SOLVE=()=>{if(busy)return;pads[seq[pos]].click();};};go();}},
 /* matching pairs: flip two cards, find the same picture. L1 3 pairs · L2 4 pairs · L3 6 pairs */
 pairs:{icon:'🃏',en:'Dino Pairs',zh:'翻牌配對',total:4,topic:'pairs',tip:['Play a memory game with cards at home!','在家用卡片玩記憶遊戲!'],
  run(api){const L=LV('pairs');const n=[0,3,4,6][L];A.total=n;drawDots();const pics=shuffle(['🐶','🐱','🐷','🐸','🦆','🐟','🐢','🦁','🐘','🐰','🦊','🐝']).slice(0,n);const cards=shuffle(pics.concat(pics));
   api.el.innerHTML=`<div class="pairs c${n*2<=6?3:4}">${cards.map((c,k)=>`<button class="pcard" data-k="${k}"><span class="pf">${c}</span><span class="pb">🦕</span></button>`).join('')}</div>`;
   const bs=[...api.el.querySelectorAll('.pcard')];let open=[],found=0,flips=0,busy=false;api.prompt('Find two the same! Tap two cards.','找一樣的!翻兩張卡片。');
   const name=c=>PICNAME[c]||[c,''];
   bs.forEach((b,k)=>b.onclick=()=>{if(busy||b.classList.contains('up'))return;b.classList.add('up');SFX.click();const c=cards[k];const nm=name(c);say(nm[0],nm[1]);open.push(k);
    if(open.length===2){busy=true;flips++;const [a,b2]=open;open=[];
     if(cards[a]===cards[b2]){setTimeout(()=>{bs[a].classList.add('got');bs[b2].classList.add('got');SFX.ding();found++;A.pts+=2;A.marks[A.n]=2;A.n++;drawDots();say(`A match! Two ${nm[0]}s!`,`配對成功!兩個${nm[1]}!`);busy=false;
       if(found>=n){track('pairs',flips<=n*2,true);setTimeout(()=>api.end(),1500);}},500);}
     else setTimeout(()=>{bs[a].classList.remove('up');bs[b2].classList.remove('up');busy=false;},1100);}});
   SOLVE=()=>{if(busy)return;const left=bs.map((b,k)=>k).filter(k=>!bs[k].classList.contains('got')&&!bs[k].classList.contains('up'));if(left.length<2)return;const k0=left[0],k1=left.find(k=>k!==k0&&cards[k]===cards[k0]);bs[k0].click();setTimeout(()=>bs[k1].click(),50);};}},
 care:{icon:'🍼',en:'Helping Hands',zh:'幫助別人',total:5,topic:'feel',tip:['Ask a friend “Are you OK?” when they are sad.','朋友難過時,問他「你還好嗎?」'],
  run(api){let i=0;const go=()=>{if(i>=5)return api.end();const L=LV('feel');let html,vals,ans,q,why,opt=v=>v;
   let dq=null;if(L===1){const N=pick(NEEDS);vals=shuffle([N.it].concat(shuffle(NEEDS.filter(x=>x!==N)).slice(0,3).map(x=>x.it)));ans=vals.indexOf(N.it);html=`<div class="row"><div class="carebaby">${smallDino('brachio')}</div><div class="need2">${N.b}</div></div>`;q=[`${N.w[0]} What does baby need?`,`${N.w[1]}牠需要什麼?`];why=N.a;}
   else if(L===2){const [em,qe,qz,os]=pick(SOCIAL);const sh=shuffle(os);vals=sh;ans=sh.findIndex(o=>o[3]);html=`<div class="need2">${em}</div>`;q=[`${qe} ${sh.map(o=>o[1]).join('? ')}?`,qz];dq=[qe,qz];opt=o=>`<span class="pic" style="font-size:1.6em">${o[0]}</span><small class="cap">${o[1]}</small>`;why=[`${os[0][1]}! That is the kind thing to do.`,`${os[0][2]}!這樣做最貼心。`];}
   else{const [seq,we,wz]=pick(SEQS);const right=seq[seq.length-1];vals=shuffle([right].concat(shuffle(SEQS.filter(s=>s[0]!==seq).map(s=>s[0][s[0].length-1])).slice(0,3)));ans=vals.indexOf(right);html=`<div class="trail">${seq.slice(0,-1).map(e=>`<span class="pic big">${e}</span>`).join('<b class="op">→</b>')}<b class="op">→</b><div class="qm">?</div></div>`;q=['What happens next?','接下來會怎樣?'];why=[we,wz];}
   api.el.innerHTML=html+optsHTML(vals.map(opt));api.prompt(q[0],q[1],null,dq);bindOpts({ans,vals,label:`feel L${L}`,expected:String(ans),why,win:L===1?why:null},()=>{i++;go();});};go();}}
};

