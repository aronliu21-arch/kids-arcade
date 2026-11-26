const drillMake=(n,k)=>build(n,'drill',k,drillGen).map(q=>(q.lvl='Practice',q.say='',q));

/* ---- MILO ---- */
const NUMW=['zero','one','two','three','four','five','six'];
function eggGen(){const L=shuffle('ABCDEFGHIJKLMNOPRSTUVW'.split('')).slice(0,3),a=L[0];return{id:'e'+L.join(''),prompt:`<div class="pic">🥚❓</div>`,say:`Find the letter ${a}`,choices:shuffle(L).map(x=>({val:x,html:`<span class="egg">${x}</span>`})),answer:a,why:'',hint:'',big:true,reward:'🦖',final:`That is ${a}!`}}
function addGen(){const a=rnd(1,3),b=rnd(1,Math.min(3,5-a)),leaf=n=>'🌿'.repeat(n);return{id:`f${a}${b}${Math.random()}`,prompt:`<div class="q" style="font-size:44px;line-height:1.4">${leaf(a)} + ${leaf(b)}</div>`,say:`${NUMW[a]} leaf and ${NUMW[b]} more. How many leaves?`,choices:shuffle([a+b,...shuffle([1,2,3,4,5,6].filter(x=>x!==a+b)).slice(0,2)]).map(v=>({val:v,html:String(v)})),answer:a+b,why:'',hint:'',reward:'🦕',final:`${NUMW[a+b]}!`}}
const MW=[['cat','🐱'],['dog','🐶'],['sun','☀️'],['egg','🥚'],['bug','🐛'],['hat','🎩'],['ball','⚽'],['fish','🐟'],['bird','🐦'],['tree','🌳'],['leaf','🍃'],['moon','🌙'],['pig','🐷'],['cow','🐮'],['bee','🐝'],['star','⭐'],['car','🚗'],['bus','🚌'],['cake','🍰'],['milk','🥛'],['frog','🐸'],['duck','🦆'],['bear','🐻'],['book','📖']];
function wordGen(){const t=shuffle(MW).slice(0,3),w=t[0];return{id:'w'+w[0],prompt:`<div class="pic" style="font-size:110px">${w[1]}</div>`,say:`Find the word ${w[0]}`,choices:shuffle(t).map(x=>({val:x[0],html:`<span style="font-size:.6em">${x[0]}</span>`})),answer:w[0],why:'',hint:'',reward:'🦖',final:w[0]+'!'}}
const ZP=PICW.filter((w,i,arr)=>plain(w[0]).length<=2&&arr.findIndex(x=>x[2]===w[2])===i);
function soundGen(){const w=pick(ZP),o=shuffle(ZP.filter(x=>x!==w&&x[2]!==w[2])).slice(0,2);return{id:'z'+w[2],prompt:`<div class="q zh" style="font-size:64px">${zy(w[0])}</div>`,say:plain(w[0]),lang:'zh-TW',choices:shuffle([w,...o]).map(x=>({val:x[2],html:x[2]})),answer:w[2],why:'',hint:'',reward:'🦖',final:plain(w[0])}}
const SH=['circle','square','triangle','star'],MC={red:'#e03131',blue:'#1c7ed6',yellow:'#fcc419',green:'#2f9e44',purple:'#7048e8',orange:'#f76707'};
function shapeGen(){const cn=Object.keys(MC),c=pick(cn),s=pick(SH),mk=(cc,ss)=>ss+'|'+MC[cc];const t=mk(c,s),o1=mk(pick(cn.filter(x=>x!==c)),s),o2=mk(c,pick(SH.filter(x=>x!==s)));
  return{id:'sh'+t+Math.random(),prompt:`<div class="pic">⛏️🪨</div>`,say:`Dig up the ${c} ${s}`,choices:shuffle([t,o1,o2]).map(k=>({val:k,html:tokSVG(k).replace('width="44" height="44"','width="84" height="84"')})),answer:t,why:'',hint:'',reward:'🦴',final:`${c} ${s}!`}}
const miloMake=g=>(n,k)=>{const out=[],ids=new Set();let t=0;while(out.length<n&&t++<200){const q=g();if(ids.has(q.id))continue;ids.add(q.id);out.push(q);}while(out.length<n)out.push(g());return out;};

/* ============ games ============ */
const GAMES={
 kang:{kid:'nora',em:'🦘',title:'Kangaroo Ladder',blurb:'Five logic puzzles that climb from easy to tricky.',n:5,make:kangMake,tip:'When a puzzle looks hard, draw it. Pictures and little tables turn tricky problems into counting.',cheer:'Nice climb'},
 story:{kid:'nora',em:'🔍',title:'Zhuyin Story Detective',blurb:'Read a short mystery in Chinese and find the clue.',n:5,make:storyMake,tip:'Read the question first. Then hunt for the clue words in the story.',cheer:'Case closed'},
 stats:{kid:'nora',em:'📊',title:'Soccer Stats Coach',blurb:'Use percents and averages to make coach decisions.',n:5,make:statsMake,tip:'Try it at your next game: compare shooting percentages, not just goals, to see who finishes best.',cheer:'Great call, Coach'},
 pattern:{kid:'nora',em:'🔷',title:'Pattern Builder',blurb:'Crack 3×3 grid puzzles and number rules.',n:5,make:patMake,tip:'Check one feature at a time: shape, then color, then how many. Each one can follow its own rule.',cheer:'Pattern found'},
 grids:{kid:'lucas',em:'🧩',title:'Grid Detective',blurb:'Find the missing tile in a 3×3 grid.',n:5,make:lucasGridMake,tip:'Try it at home: lay out 9 cards or toys in a 3×3 grid, hide one, and ask someone to work out what is missing.',cheer:'Grid solved'},
 race:{kid:'nora',em:'🏁',title:'Word Match Race',blurb:'Match zhuyin, characters and meanings as fast as you can.',n:5,make:raceMake,tip:'Try it today: find three Chinese words on signs or books and read them out loud.',cheer:'Fast!',timed:true},
 cards:{kid:'lucas',em:'🃏',title:'Card Quest Math',blurb:'Win card battles with adding, groups and halves.',n:5,make:cardMake,tip:'Try it with your own cards: sort them into piles of 5 and count by 5s.',cheer:'Battle won'},
 adv:{kid:'lucas',em:'🗺️',title:'Adventure Reader',blurb:'Read a story page by page and answer to move on.',n:5,make:advMake,tip:'When a word is new, read the sentence around it. Clues are often right next to it.',cheer:'On to the next page'},
 hunt:{kid:'lucas',em:'🏴‍☠️',title:'Zhuyin Treasure Hunt',blurb:'Crack the zhuyin code to open the chests.',n:5,make:huntMake,tip:'Try it at home: find the zhuyin on a book cover and say each sound.',cheer:'Chest open'},
 shop:{kid:'lucas',em:'🏪',title:'Shop Keeper',blurb:'Run a card shop: change, totals and sales.',n:5,make:shopMake,tip:'When you pay, count up from the price to the money you gave. That is how to check your change.',cheer:'Sold'},
 drill:{kid:'lucas',em:'⚽',title:'Soccer Number Drills',blurb:'Count, pass and score with number friends.',n:5,make:drillMake,tip:'Try it at practice: count your passes in 2s and 5s.',cheer:'GOAL'},
 eggs:{kid:'milo',em:'🥚',title:'Dino Alphabet Eggs',blurb:'Tap the egg with the right letter.',n:4,make:miloMake(eggGen),tip:'Point out the first letter of your name on a sign today.',cheer:'Yay'},
 feed:{kid:'milo',em:'🌿',title:'Dino Feeding',blurb:'Count leaves for a hungry dinosaur.',n:4,make:miloMake(addGen),tip:'Count steps or snacks together today.',cheer:'Yum'},
 trail:{kid:'milo',em:'👣',title:'Dino Word Trail',blurb:'Match the picture to its word.',n:4,make:miloMake(wordGen),tip:'Point at a word on a box and say it together.',cheer:'Yay'},
 sound:{kid:'milo',em:'🔔',title:'Zhuyin Sound Play',blurb:'Listen to the word and tap the picture.',n:4,make:miloMake(soundGen),tip:'Say one Chinese word with a picture each day.',cheer:'Yay'},
 dig:{kid:'milo',em:'⛏️',title:'Shapes and Colors Dig',blurb:'Dig up the right fossil.',n:4,make:miloMake(shapeGen),tip:'Hunt for circles and squares around the house.',cheer:'Yay'}};
const ORDER={nora:['kang','story','stats','pattern','race'],lucas:['cards','adv','hunt','shop','drill','grids'],milo:['eggs','feed','trail','sound','dig']};
return {GAMES,ORDER};
})();

/* ---------- ticket booth: answer questions, earn zoo tickets ---------- */
const COST={draw:70,food:3,star:3};
function costOf(t){return t.startsWith('pen_')?60:({fountain:30,path:5,icecream:40,snack:40,gift:90,restaurant:140})[t]||10;}
function doExpand(){if((S.expand||0)>=EXPAND_MAX){toast('The zoo is as big as it can get');return;}if(!spendCoins(EXPAND_COST,'to make the zoo bigger'))return;
  S.expand=(S.expand||0)+1;const r0=rMin();const add=(type,c,r)=>{if(fits(type,c,r)){const it={id:S.nextItem++,type,c,r};S.items.push(it);addItemObj(it);return it;}return null;};
  for(let r=r0;r<r0+7;r++){add('path',9,r);add('path',10,r);}
  const zs=['pen_savanna','pen_polar','pen_pond','pen_jungle'].sort(()=>Math.random()-.5);add(zs[0],3,r0+1);add(zs[1],13,r0+1);
  add('tree',1,r0+2);add('pine',18,r0+3);add('flowers',8,r0+2);add('bench',11,r0+4);add('lamp',8,r0+5);
  save();buildLand();SFX.poof();buildSel='tree';bottom();banner(null);addStamp('build',null,'The zoo got bigger!');
  flyTo({x:0,z:r0-GRID/2+2});speak('Your zoo got bigger! Two new pens are ready for animals.');}
function spendCoins(n,why){if(S.coins<n){SFX.nope();toast('You need '+n+' coins '+why+'. You have '+S.coins+'.');speak('You need '+n+' coins. Visitors pay coins when they see your animals and shops.');return false;}S.coins-=n;save();hud();return true;}
function tickets(){return (S.tickets&&S.profile&&S.tickets[S.profile])||0;}
function earn(n){if(!S.profile)return;S.tickets[S.profile]=tickets()+n;save();hud();const qt=document.querySelector('#qTk span');if(qt)qt.textContent=tickets();const b=$('#tkBtn');if(b&&!reduced)b.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:450});}
function spend(n,why){if(tickets()<n){needTickets(n,why);return false;}S.tickets[S.profile]-=n;save();hud();return true;}
function needTickets(n,why){SFX.nope();openBooth('You need '+n+' ticket'+(n===1?'':'s')+' '+why+'. You have '+tickets()+'. Play a zoo game to earn more!');}
let Q=null,chain=0;
const MECH={kang:'climb',story:'feed',stats:'goals',pattern:'balloons',grids:'balloons',race:'fish',cards:'balloons',adv:'climb',hunt:'eggs',shop:'feed',drill:'goals',eggs:'eggs',feed:'feed',trail:'balloons',sound:'fish',dig:'eggs'};
const MNAME={climb:'Tree Climb',feed:'Feeding Time',goals:'Penalty Kicks',balloons:'Balloon Pop',fish:'Fishing Pond',eggs:'Egg Hatch'};
const PAL=['#ffd6e0','#ffe8a3','#c7ecfa','#d9f2c4'];
const MASCOT='<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="28" cy="34" rx="9" ry="15" fill="#f4c542" stroke="#1f3a5f" stroke-width="5"/><ellipse cx="72" cy="34" rx="9" ry="15" fill="#f4c542" stroke="#1f3a5f" stroke-width="5"/><ellipse cx="50" cy="63" rx="35" ry="31" fill="#f4c542" stroke="#1f3a5f" stroke-width="5"/><circle cx="38" cy="57" r="5" fill="#1f3a5f"/><circle cx="62" cy="57" r="5" fill="#1f3a5f"/><path d="M42 71q8 7 16 0" stroke="#1f3a5f" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
function heroPick(){const mine=S.animals.filter(a=>a.maker===S.profile),pool=mine.length?mine:S.animals;return pool.length?pool[(Math.random()*pool.length)|0].png:null;}
function heroHTML(cls){return Q.hero?'<img class="hero'+(cls||'')+'" alt="" src="'+Q.hero+'">':'<span class="hero'+(cls||'')+'">'+MASCOT+'</span>';}
function fieldHTML(m,cs){const qc=(cls,i,st,inner)=>'<button class="qc '+cls+'" data-i="'+i+'"'+(st?' style="'+st+'"':'')+'>'+inner+'</button>';
  if(m==='balloons')return heroHTML()+'<div class="items">'+cs.map((c,i)=>qc('bal',i,'--c:'+PAL[i%4]+';--d:-'+(i*.7).toFixed(1)+'s',c.html)).join('')+'</div>';
  if(m==='fish')return '<div class="lanes">'+cs.map((c,i)=>'<div class="lane">'+qc('fish',i,'--c:'+PAL[i%4]+';--t:'+(4.5+i*1.3).toFixed(1)+'s;--d:-'+(i*1.9).toFixed(1)+'s',c.html)+'</div>').join('')+'</div>';
  if(m==='feed')return '<div class="plates">'+cs.map((c,i)=>qc('plate',i,'',art(FOODS[i%FOODS.length].id)+'<span class="tag">'+c.html+'</span>')).join('')+'</div>'+heroHTML(' big');
  if(m==='eggs')return '<div class="nest">'+cs.map((c,i)=>qc('egg2',i,'--d:-'+(i*.9).toFixed(1)+'s','<span>'+c.html+'</span>')).join('')+'</div>';
  if(m==='goals')return '<div class="goals">'+cs.map((c,i)=>qc('goal',i,'','<span class="net"></span><span class="tag">'+c.html+'</span>')).join('')+'</div><span class="ball"></span>'+heroHTML();
  const n=Q.qs.length;return '<div class="ladder" style="--n:'+n+'">'+Array.from({length:n+1},()=>'<i></i>').join('')+'<span class="climber" style="--r:'+Q.i+'">'+heroHTML()+'</span></div><div class="signs">'+cs.map((c,i)=>qc('sign',i,'',c.html)).join('')+'</div>';}
function fxBurst(f,el){if(reduced)return;const a=f.getBoundingClientRect(),b=el.getBoundingClientRect();const cx=b.left-a.left+b.width/2,cy=b.top-a.top+b.height/2;
  for(let i=0;i<14;i++){const d=document.createElement('i');d.className='fxs';d.style.left=cx+'px';d.style.top=cy+'px';d.style.background=['#f4c542','#e8573c','#ffffff','#5bc0eb'][i%4];f.appendChild(d);
    const an=Math.random()*Math.PI*2,r=rand(50,130);d.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:'translate(calc(-50% + '+Math.cos(an)*r+'px),calc(-50% + '+Math.sin(an)*r+'px)) scale(.3)',opacity:0}],{duration:rand(500,900),easing:'cubic-bezier(.1,.8,.2,1)',fill:'forwards'}).onfinish=()=>d.remove();}}
function mechFx(el,ok){const f=el.closest('.afield');if(!f||reduced)return;const hero=f.querySelector('.hero');const m=(el.className.match(/\b(bal|fish|plate|egg2|goal|sign)\b/)||[])[1];
  const fly=(src,tgt,scale,keep)=>{if(!src||!tgt)return;const a=src.getBoundingClientRect(),b=tgt.getBoundingClientRect();const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2);
    const fr=keep?[{transform:'translate(0,0)'},{transform:'translate('+dx*.5+'px,'+(dy*.5-70)+'px)'},{transform:'translate('+dx+'px,'+dy+'px) scale('+scale+')',opacity:keep==='hide'?0:1}]
      :[{transform:'translate(0,0)'},{transform:'translate('+dx*.6+'px,'+(dy*.6-50)+'px)'},{transform:'translate(0,0)'}];
    src.animate(fr,{duration:600,easing:'ease-in-out',fill:keep?'forwards':'none'});};
  if(m==='plate')fly(el.querySelector('svg'),hero,.3,ok?'hide':false);
  if(m==='goal')fly(f.querySelector('.ball'),el.querySelector('.net'),.8,ok?'keep':false);
  if(m==='egg2'&&ok){el.insertAdjacentHTML('beforeend',Q.hero?'<img class="baby" alt="" src="'+Q.hero+'">':'<span class="baby">'+MASCOT+'</span>');}
  if(m==='sign'&&ok){const c=f.querySelector('.climber');if(c)c.style.setProperty('--r',Q.i+1);}
  if(ok){fxBurst(f,el);if(hero)hero.animate([{transform:'translateY(0)'},{transform:'translateY(-34px) scale(1.08)'},{transform:'translateY(0)'}],{duration:520,easing:'ease-out'});}
  else if(hero)hero.animate([{transform:'translateX(0)'},{transform:'translateX(-9px)'},{transform:'translateX(9px)'},{transform:'translateX(0)'}],{duration:360});}
