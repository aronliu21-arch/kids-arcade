/* ---------- puzzle runner ---------- */
let A=null;
function startGame(id,ci,k){musicOff();const g=MG[id];A={id,pts:0,n:0,total:g.total,marks:[],ci,k,ups:[]};BACK=goMap;show('game');const st=$('gStage');st.className='stage';st.innerHTML='';drawDots();
 $('gHead').innerHTML=ci!==undefined?chHead(ci):`${g.icon} ${bi(g.en,g.zh)}`;g.run(api);}
function drawDots(){$('gDots').innerHTML=Array.from({length:A.total},(_,i)=>A.marks[i]===2?'⭐':A.marks[i]===1?'✨':A.marks[i]===0?'⚪':'·').join('');}
const api={
 get el(){return $('gStage');},
 prompt(en,z,extra,disp){$('gTxt').innerHTML=disp?bi(disp[0],disp[1]):bi(en,z);say(en,z,extra);},
 q(o,then){let tries=0,done=false;const qi=A.n;const g=MG[A.id];const topic=o.topic||g.topic;
  return function judge(ok,given){if(done||!A||A.n!==qi)return false;
   rec({q:o.label||g.en,given:String(given??''),expected:String(o.expected??''),correct:!!ok,tryNo:tries+1,qid:`${A.id}-${qi}`,topic});
   if(ok){done=true;const p=tries?1:2;A.pts+=p;A.marks[qi]=p;A.n++;drawDots();if(!o.notrack)track(topic,true,tries===0);SFX.ding();toast(`+${p} 🧱`);if(!o.quiet){const w=o.win||praise();say(w[0],w[1]);}setTimeout(()=>then(p,tries),o.wait||1300);return true;}
   tries++;SFX.boing();
   if(tries===1){o.hint&&o.hint();const r=o.retry||['Try again!','再試一次!'];say(r[0],r[1]);}
   else{done=true;o.reveal&&o.reveal();A.marks[qi]=0;A.n++;drawDots();if(!o.notrack)track(topic,false);const w=o.why||['Here it is!','答案在這裡!'];say(w[0],w[1]);setTimeout(()=>then(0,tries),2600);}
   return false;};},
 end(){endGame();}};
function endGame(){const g=MG[A.id];SOLVE=null;const ci=A.ci,inFlow=ci!==undefined;if(inFlow)CUR=ci;const got=earnBricks(A.pts);S.snacks+=1;S.plays[A.id]=(S.plays[A.id]||0)+1;
 if(inFlow&&A.k>=0)S.step[ci]=A.k+1;save();showWallet(true);const sk=streak()+1;streak(sk);SFX.fanfare();confetti(30);
 const icons=got.map((b,i)=>`<span style="display:inline-block;animation-delay:${i*.08}s">${shapeIcon(b.s,COL[b.c][0])}</span>`).join('');
 const ups=[...new Set(A.ups)].map(t=>`<div class="lvup">⭐ ${bi(LVNAME[t][0]+' level '+S.lv[t]+'!',LVNAME[t][1]+'第'+S.lv[t]+'級!')}</div>`).join('');
 const r=$('result');
 if(false&&sk>=3){r.innerHTML=`<div class="coins">+${got.length} 🧱 +1 🍎</div><div class="earn">${icons}</div>${ups}<div style="font-size:3rem">📖🔖💤</div><h2 style="margin:4px">${bi('Great practice! Time for a break','練習得好棒!休息一下吧')}</h2><div class="tip">${bi('Your book is bookmarked. Next time it opens right here!','書籤夾好了。下次會從這裡開始!')}</div><button class="btn green" id="rDone">${bi('Finish for now','先結束')}</button>`;
  show('result');musicOn();say('Great practice! Your book is bookmarked. Time for a break!','練習得好棒!書籤夾好了,休息一下吧!');
  $('rDone').onclick=()=>{streak(0);show('intro');try{speechSynthesis.cancel();}catch(e){}};SOLVE=()=>$('rDone').click();return;}
 r.innerHTML=`<div class="coins">+${got.length} 🧱 &nbsp;+1 🍎</div><div class="earn">${icons}</div>${ups}
  <div class="tip">💡 ${bi(g.tip[0],g.tip[1])}</div>
  <div class="acts"><button class="btn green pulse" id="rNext">${inFlow?bi('Turn the page ▶','翻到下一頁 ▶'):bi('Back to the map 🗺','回到地圖 🗺')}</button><button class="btn ghost" id="rZoo">🏞 ${bi('Zoo','動物園')}</button></div>`;
 show('result');musicOn();
 say(`You earned ${got.length} bricks and a snack! ${A.ups.length?'And you leveled up! ':''}${g.tip[0]}`,`你賺了${got.length}個積木和一個點心!${A.ups.length?'而且你升級了!':''}${g.tip[1]}`);
 $('rNext').onclick=()=>{if(inFlow){CUR=ci;flowNext();}else goMap();};$('rZoo').onclick=goZoo;SOLVE=()=>$('rNext').click();}

/* ---------- the 9 puzzles, each with levels ---------- */
const FRUIT=[['🍎','apple','apples','蘋果'],['🍌','banana','bananas','香蕉'],['🍓','strawberry','strawberries','草莓'],['🥕','carrot','carrots','紅蘿蔔'],['🍊','orange','oranges','橘子']];
const LETTERS='ABCDEFGHIJKLMNOPRSTUW'.split('');
const smallDino=(t,cols)=>`<svg viewBox="-6 -14 112 98">${dinoSVG(t,cols||stepCols(t))}</svg>`;
const iconInner=(s,hex)=>shapeIcon(s,hex||'#4a3426').replace(/^<svg[^>]*>|<\/svg>$/g,'');
const FOOTD='M30 58c-12 0-18-8-16-18 1-6 6-9 6-9l-8-20c-1-4 4-6 6-2l8 15 4-20c1-4 6-4 6 0l1 20 8-15c2-4 7-2 6 2l-8 20s5 3 6 9c2 10-4 18-16 18z';
const optsHTML=list=>`<div class="opts">${list.map((h,i)=>`<button class="opt" data-i="${i}" data-drop="${i}">${h}</button>`).join('')}</div>`;
const shakeIt=b=>{b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),450);};
const ri=(a,b)=>a+rnd(b-a+1);
const nm=(n,f)=>n===1?f[1]:f[2];
function numOpts(ans,min,max){min=min??0;max=max??100;const s=new Set([ans]);for(const d of shuffle([1,-1,2,-2,10,-10,3,5])){if(s.size>=4)break;const v=ans+d;if(v>=min&&v<=max)s.add(v);}while(s.size<4)s.add(ri(min,max));return shuffle([...s]);}
// a word card that reads itself: short words are sounded out first (b, a, t… bat)
const soundOut=w=>/^[a-z]{2,5}$/i.test(w)?`${w.split('').join(', ')}. ${w}`:w;
function readCard(el,en,z){if(!el)return;el.insertAdjacentHTML('beforeend','<span class="wc-say" aria-hidden="true">🔊</span>');el.setAttribute('role','button');el.setAttribute('aria-label','Read it to me');
 el.onclick=()=>{SFX.click();el.classList.remove('wiggle');void el.offsetWidth;el.classList.add('wiggle');sayParts([[soundOut(en),'en-US']].concat(z&&S.voice!=='en'?[[z,'zh-TW']]:[]));};}
const PICNAME={'🐱':['cat','貓'],'🐶':['dog','狗'],'🐷':['pig','豬'],'🐔':['hen','母雞'],'🦊':['fox','狐狸'],'🐛':['bug','蟲'],'☀️':['sun','太陽'],'🚌':['bus','公車'],'🛏️':['bed','床'],'🎩':['hat','帽子'],'🥤':['cup','杯子'],'📦':['box','箱子'],'🥚':['egg','蛋'],'🕸️':['web','蜘蛛網'],'🗺️':['map','地圖'],'🚐':['van','廂型車'],'🦇':['bat','蝙蝠'],'🐜':['ant','螞蟻'],'🥅':['net','網子'],'✈️':['jet','飛機'],'🐸':['frog','青蛙'],'🦆':['duck','鴨子'],'🐟':['fish','魚'],'🚢':['ship','船'],'⭐':['star','星星'],'🦀':['crab','螃蟹'],'🥁':['drum','鼓'],'🪺':['nest','鳥巢'],'⛺':['tent','帳篷'],'🥛':['milk','牛奶'],'🔔':['bell','鈴鐺'],'🐤':['chick','小雞'],'🐌':['snail','蝸牛'],'🚚':['truck','卡車'],'🕰️':['clock','時鐘'],'🧦':['sock','襪子'],'🦢':['swan','天鵝'],'🚩':['flag','旗子'],'🪴':['plant','植物'],'🐚':['shell','貝殼'],'🐦':['bird','鳥'],'🦋':['butterfly','蝴蝶'],'🐝':['bee','蜜蜂'],'🐢':['turtle','烏龜'],'🐘':['elephant','大象'],'🐄':['cow','牛'],'🐳':['whale','鯨魚'],'🐙':['octopus','章魚'],'🐰':['bunny','兔子'],'🦁':['lion','獅子'],'🐮':['cow','牛'],'🔥':['fire','火'],'🌶️':['hot pepper','辣椒'],'☕':['hot cocoa','熱可可'],'🧊':['ice','冰塊'],'☃️':['snowman','雪人'],'🍦':['ice cream','冰淇淋'],'❄️':['snowflake','雪花'],'🚗':['car','汽車'],'🚲':['bike','腳踏車'],'⛵':['boat','帆船'],'🎈':['balloon','氣球'],'🪁':['kite','風箏'],'🐴':['horse','馬'],'🍎':['apple','蘋果'],'🍌':['banana','香蕉'],'🍰':['cake','蛋糕'],'🥕':['carrot','紅蘿蔔'],'🪑':['chair','椅子'],'📚':['books','書'],'🧸':['teddy bear','泰迪熊']};
const REALSZ=[['An elephant is bigger than a mouse!','大象比老鼠大!','🐘','🐭','Which one is bigger?','哪一個比較大?'],['A giraffe is taller than a dog!','長頸鹿比狗高!','🦒','🐕','Which one is taller?','哪一個比較高?'],
 ['A snake is longer than a worm!','蛇比蟲長!','🐍','🐛','Which one is longer?','哪一個比較長?'],['A truck is heavier than a bike!','卡車比腳踏車重!','🚚','🚲','Which one is heavier?','哪一個比較重?'],
 ['A whale is bigger than a fish!','鯨魚比魚大!','🐳','🐟','Which one is bigger?','哪一個比較大?'],['A tree is taller than a flower!','樹比花高!','🌳','🌷','Which one is taller?','哪一個比較高?'],
 ['An ant is smaller than a cat!','螞蟻比貓小!','🐜','🐱','Which one is smaller?','哪一個比較小?'],['A feather is lighter than a rock!','羽毛比石頭輕!','🪶','🪨','Which one is lighter?','哪一個比較輕?']];
const DAYNIGHT=[['☀️','🌈','🐓','🏖️','🦋'],['🌙','⭐','🦉','🛌','🦇']];
const TSEQ3=[[['🥚','egg','蛋'],['🐣','hatch','孵出來'],['🐥','chick','小雞']],[['🌱','sprout','發芽'],['🌿','grow','長大'],['🌻','flower','開花']],[['🛁','bath','洗澡'],['🪥','brush teeth','刷牙'],['🛌','sleep','睡覺']],
 [['⛅','clouds','雲'],['🌧️','rain','下雨'],['🌈','rainbow','彩虹']],[['❄️','snow','下雪'],['⛄','snowman','雪人'],['💧','melt','融化']],[['🍞','bread','麵包'],['🥪','sandwich','三明治'],['😋','yum','好吃']],[['🥚','egg','蛋'],['🦕','baby dino','恐龍寶寶'],['🦖','big dino','大恐龍']]];
const TSEQ4=[[['😴','sleep','睡覺'],['🌅','wake up','起床'],['🪥','brush teeth','刷牙'],['🍳','breakfast','吃早餐']],[['🥚','egg','蛋'],['🐣','hatch','孵出來'],['🐥','chick','小雞'],['🐔','hen','母雞']],
 [['🛒','shop','買菜'],['🥕','wash carrots','洗紅蘿蔔'],['🍲','cook soup','煮湯'],['😋','eat','吃飯']],[['🌧️','rain','下雨'],['🌱','sprout','發芽'],['🌻','flower','開花'],['🐝','bee visits','蜜蜂來了']],
 [['🧱','bricks','積木'],['🏗️','build','蓋房子'],['🏠','house','房子'],['🎉','party','開派對']]];
Object.assign(PICNAME,{'🐭':['mouse','老鼠'],'🦒':['giraffe','長頸鹿'],'🐕':['dog','狗'],'🐍':['snake','蛇'],'🐳':['whale','鯨魚'],'🌷':['flower','花'],'🪶':['feather','羽毛'],'🪨':['rock','石頭'],
 '🌈':['rainbow','彩虹'],'🐓':['rooster','公雞'],'🏖️':['beach','海灘'],'🌙':['moon','月亮'],'⭐':['star','星星'],'🦉':['owl','貓頭鷹'],'🛌':['bed','床'],'🥚':['egg','蛋'],'🐣':['hatching chick','小雞孵出來'],'🐥':['chick','小雞'],
 '🌱':['sprout','嫩芽'],'🌿':['plant','植物'],'🌻':['sunflower','向日葵'],'🛁':['bath','洗澡'],'🪥':['toothbrush','牙刷'],'⛅':['clouds','雲'],'🌧️':['rain','下雨'],'❄️':['snow','雪'],'⛄':['snowman','雪人'],'💧':['water','水滴'],
 '🍞':['bread','麵包'],'🥪':['sandwich','三明治'],'😋':['yum','好吃'],'🦕':['baby dino','恐龍寶寶'],'🦖':['big dino','大恐龍'],'😴':['sleep','睡覺'],'🌅':['sunrise','日出'],'🍳':['breakfast','早餐'],'🐔':['hen','母雞'],
 '🛒':['shopping','買東西'],'🥕':['carrot','紅蘿蔔'],'🍲':['soup','湯'],'🐝':['bee','蜜蜂'],'🧱':['bricks','積木'],'🏗️':['building','蓋房子'],'🏠':['house','房子'],'🎉':['party','派對'],'🐶':['dog','狗'],'🐰':['bunny','兔子'],'🦊':['fox','狐狸'],'🦁':['lion','獅子'],'🐘':['elephant','大象'],'🐢':['turtle','烏龜'],'🐷':['pig','豬'],'🐸':['frog','青蛙'],'🦆':['duck','鴨子'],'🐟':['fish','魚'],'🐱':['cat','貓'],'🦋':['butterfly','蝴蝶'],'🦇':['bat','蝙蝠'],'🐛':['worm','蟲'],'🚚':['truck','卡車'],'🚲':['bike','腳踏車'],'🌳':['tree','樹'],'🐜':['ant','螞蟻']});

// little 🔊 on each picture answer: says what the picture is, without answering
function picSay(btns,vals){btns.forEach((b,k)=>{const n=PICNAME[vals[k]];if(!n)return;const t=document.createElement('span');t.className='opt-say';t.textContent='🔊';t.setAttribute('role','button');t.setAttribute('aria-label','Say '+n[0]);
 const f=e=>{e.stopPropagation();e.preventDefault();SFX.click();sayParts([[n[0],'en-US']].concat(S.voice!=='en'?[[n[1],'zh-TW']]:[]));};t.addEventListener('click',f);t.addEventListener('pointerdown',e=>e.stopPropagation());b.appendChild(t);});}
// wire up a row of answer buttons to one judged question
function bindOpts(o,then){const btns=[...api.el.querySelectorAll('.opt[data-i]')];
 const judge=api.q(Object.assign({hint:()=>btns[o.ans].classList.add('wiggle'),reveal:()=>btns[o.ans].classList.add('glow')},o),then);
 btns.forEach((b,k)=>b.onclick=()=>{if(judge(k===o.ans,o.vals?o.vals[k]:k)){b.classList.add('okay');o.onOk&&o.onOk(b);}else shakeIt(b);});SOLVE=()=>btns[o.ans].click();if(o.pics)picSay(btns,o.vals);return btns;}
function frames(n,em,cross){let o='',left=n,idx=0;do{const k=Math.min(10,left);o+=`<span class="tf">${Array.from({length:10},(_,i)=>{const j=idx+i;const x=cross&&j>=n-cross&&i<k;return `<span${x?' class="x"':''}>${i<k?em:''}</span>`;}).join('')}</span>`;left-=10;idx+=10;}while(left>0);return `<span class="tfs">${o}</span>`;}
const tens=n=>`<span class="tens">${'<i class="b10"></i>'.repeat(Math.floor(n/10))}${'<i class="b1"></i>'.repeat(n%10)}</span>`;
// reading banks
const CVC=[['cat','🐱'],['dog','🐶'],['pig','🐷'],['hen','🐔'],['fox','🦊'],['bug','🐛'],['sun','☀️'],['bus','🚌'],['bed','🛏️'],['hat','🎩'],['cup','🥤'],['box','📦'],['egg','🥚'],['web','🕸️'],['map','🗺️'],['van','🚐'],['bat','🦇'],['ant','🐜'],['net','🥅'],['jet','✈️']];
const BLEND=[['frog','🐸'],['duck','🦆'],['fish','🐟'],['ship','🚢'],['star','⭐'],['crab','🦀'],['drum','🥁'],['nest','🪺'],['tent','⛺'],['milk','🥛'],['bell','🔔'],['chick','🐤'],['snail','🐌'],['truck','🚚'],['clock','🕰️'],['sock','🧦'],['swan','🦢'],['flag','🚩'],['plant','🪴'],['shell','🐚']];
const SUBJ=[['cat','🐱','貓'],['dog','🐶','狗'],['pig','🐷','豬'],['hen','🐔','雞'],['fox','🦊','狐狸']],PLACE=[['box','📦','箱子'],['bed','🛏️','床'],['bus','🚌','公車'],['tent','⛺','帳篷']];
const QCAT=[['Which one can fly?','哪一個會飛?',['🐦','🦋','🐝','🦇'],['🐶','🐷','🐢','🐘','🐄']],['Which one lives in the sea?','哪一個住在海裡?',['🐟','🐳','🐙','🦀'],['🐶','🐰','🐔','🦁','🐮']],
 ['Which one is hot?','哪一個是燙的?',['🔥','☀️','🌶️','☕'],['🧊','☃️','🍦','❄️']],['Which one is cold?','哪一個是冰的?',['🧊','☃️','🍦','❄️'],['🔥','☀️','☕','🌶️']],
 ['Which one has wheels?','哪一個有輪子?',['🚌','🚗','🚲','🚚'],['⛵','🎈','🪁','🐴']],['Which one can you eat?','哪一個可以吃?',['🍎','🍌','🍰','🥕'],['🧦','🪑','📚','🧸']]];
