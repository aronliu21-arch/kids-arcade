function thumb(cat,it){const key=keyOf(cat,it.id),c=isOn(cat,it.id)?colOf(key,it):(cat==='hair'?HAIRPAL[it.col]:PAL[it.col]),d=it.draw,h=typeof d==='function'?d(c):(d.back?d.back(c):'')+(d.main?d.main(c):'')+(d.front?d.front(c):'');
  return '<svg viewBox="'+(it.vb||CAT[cat].vb)+'">'+DEFS+'<g class="tb">'+withPat(h,key,isOn(cat,it.id)?patOf(key):(it.dp||'plain'))+'</g></svg>';}
function fitThumbs(){document.querySelectorAll('.it svg').forEach(sv=>{try{const b=sv.querySelector('.tb').getBBox();if(!b.width)return;const p=Math.max(b.width,b.height)*.08;sv.setAttribute('viewBox',(b.x-p)+' '+(b.y-p)+' '+(b.width+2*p)+' '+(b.height+2*p));}catch(e){}});}
function sizeSvg(box,sv,frac){if(!box||!sv)return;const W=box.clientWidth,H=box.clientHeight*(frac||1);if(!W||!H)return;const h=Math.floor(Math.min(H,W*2));sv.setAttribute('width',Math.floor(h/2));sv.setAttribute('height',h);sv.style.width=Math.floor(h/2)+'px';sv.style.height=h+'px';}
function fitFig(){sizeSvg($('fig'),$('fig').querySelector('svg'));}
function renderFig(){$('fig').innerHTML=figureSVG();fitFig();}
const POSE=['Do I look good?','I look great!','Ready for the runway!','Yay!'];
function strike(e){audio();const fg=$('fig');fg.classList.remove('posing');void fg.offsetWidth;fg.classList.add('posing');sfx.good();say(pick(POSE));
  for(let k=0;k<5;k++){const sp=document.createElement('div');sp.className='spk';sp.textContent=pick(['✨','💖','⭐','🌟']);const r=fg.getBoundingClientRect();sp.style.left=(r.width/2+rnd(-90,90))+'px';sp.style.top=(r.height*.25+rnd(-30,60))+'px';fg.appendChild(sp);setTimeout(()=>sp.remove(),900);}}
if(window.ResizeObserver)new ResizeObserver(fitFig).observe(document.getElementById('fig'));document.getElementById('fig').addEventListener('click',e=>strike(e));addEventListener('resize',fitFig);addEventListener('orientationchange',()=>setTimeout(fitFig,300));
function renderTabs(){$('tabs').innerHTML='';ORDER.forEach(c=>{const b=document.createElement('button');b.className='tab'+(c===tab?' on':'');b.dataset.c=c;b.innerHTML=CATEN[c];b.onclick=()=>{tab=c;renderTabs();renderItems();};$('tabs').appendChild(b);});}
function isOn(cat,id){return cat==='acc'?look.acc.includes(id):look[cat]===id;}
function renderItems(){const box=$('items');box.innerHTML='';const LIST=itemsFor(tab);if(!LIST.length){box.innerHTML='<p class="note" style="grid-column:1/-1">'+zh('Nothing here yet. Go shopping!')+'</p>';renderPaint();return;}LIST.forEach(it=>{const b=document.createElement('button');b.className='it'+(isOn(tab,it.id)?' on':'');
  b.innerHTML=thumb(tab,it)+'<span class="nm">'+RB(it.zh.replace('T',''),it.zy.replace('T ',''))+(it.zh[0]==='T'?'':'')+'</span><span class="en">'+it.en+'</span>';
  if(it.zh[0]==='T')b.querySelector('.nm').innerHTML='T'+RB('恤','ㄒㄩˋ');
  if(MODE==='budget')b.insertAdjacentHTML('beforeend','<span class="pr">🪙'+price(it)+'</span>');b.onclick=()=>wear(tab,it);box.appendChild(b);});fitThumbs();renderPaint();}
function wear(cat,it){audio();
  if(cat==='acc'){const i=look.acc.indexOf(it.id);if(i>=0)look.acc.splice(i,1);else look.acc.push(it.id);sel='acc:'+it.id;}
  else if(cat==='dress'){const off=look.dress===it.id;look.dress=off?null:it.id;if(look.dress){look.top=null;look.bottom=null;}sel='dress';if(off)toast('Took off the '+itemBoth(it)+'. Pick a dress, or a top and a bottom!',2400);}
  else if(cat==='top'||cat==='bottom'){const off=look[cat]===it.id;look[cat]=off?null:it.id;if(look[cat])look.dress=null;sel=cat;if(off)toast('Took off the '+itemBoth(it)+'. Tap again to put it back on.',2000);}
  else{look[cat]=it.id;sel=cat;}
  tone(700+Math.random()*300,.06,'triangle',.08);renderFig();renderItems();updBudget();}
function selItem(){if(sel.startsWith('acc:')){const id=sel.slice(4);return look.acc.includes(id)?['acc',find('acc',id)]:null;}
  const id=look[sel];return id?[sel,find(sel,id)]:null;}
function renderPaint(){const s=selItem();
  if(!s){$('paintLab').innerHTML=zh('Tap something she is wearing first');$('sw').innerHTML='';$('pats').innerHTML='';return;}
  const [cat,it]=s,key=keyOf(cat,it.id),cur=colOf(key,it),P=cat==='hair'?HAIRPAL:PAL;
  $('paintLab').innerHTML='🎨 Color: '+itemBoth(it);$('sw').innerHTML='';
  Object.entries(P).filter(([n])=>n!=='denim').forEach(([n,h])=>{const b=document.createElement('button');b.style.background=h;b.title=n;b.setAttribute('aria-label',n);if(h===cur)b.className='on';
    b.onclick=()=>{look.col[key]=h;tone(520,.05,'sine',.08);renderFig();renderItems();};$('sw').appendChild(b);});
  $('pats').innerHTML='';if(cat!=='hair')[['plain','▢'],['stripes','▤'],['dots','⠿'],['checks','▦'],['stars','★'],['hearts','♥'],['flowers','✿'],['sparkle','✦'],['zigzag','〰'],['plaid','▩']].forEach(([p,g])=>{const b=document.createElement('button');b.className='pb';b.innerHTML='<svg viewBox="0 0 40 40"><rect width="40" height="40" rx="7" fill="'+cur+'"/>'+(p==='plain'?'':'<rect width="40" height="40" rx="7" fill="url(#p-'+p+(lum(cur)>.78?'d':'')+')"/>')+'</svg>';b.title=p;b.setAttribute('aria-label',p);
    if(patOf(key)===p)b.className='on';b.onclick=()=>{look.pat[key]=p;renderFig();renderItems();};$('pats').appendChild(b);});}
function newTheme(){let seen=[];try{seen=JSON.parse(localStorage.getItem('rs_seenTh')||'[]');}catch(e){}let pool=THEMES.filter(x=>!seen.includes(x.id)&&!(theme&&x.id===theme.id));if(!pool.length){seen=[];pool=THEMES.filter(x=>!(theme&&x.id===theme.id));}const t=pick(pool);seen.push(t.id);try{localStorage.setItem('rs_seenTh',JSON.stringify(seen));}catch(e){}theme=t;$('thZh').innerHTML=t.en;$('thPics').innerHTML=[...new Intl.Segmenter().segment(TPICS[t.id]||'')].map(x=>'<span>'+x.segment+'</span>').join('');$('thHint').innerHTML=t.he||'';
  timeLeft=120;showTime();renderScene();say('Today\'s theme is '+t.en+'. '+(t.he||''));}
function showTime(){$('timer').textContent=timerOn?'⏱ '+Math.floor(timeLeft/60)+':'+pad2(timeLeft%60):'⏱ '+'—';$('timer').style.background=timerOn&&timeLeft<=20?'#ffe3e3':'#fff';}
const pad2=n=>String(n).padStart(2,'0');
tick=setInterval(()=>{if(!timerOn||running||DLG)return;timeLeft=Math.max(0,timeLeft-1);showTime();if(timeLeft===20){tone(880,.1,'square',.05);toast('⏱ 20 seconds left!');}
  if(timeLeft===0){toast('⏱ '+zh('Time’s up! To the runway!'));if(MODE==='vs'&&VS.kind==='room'){roomSubmit(true);return;}runway();}},1000);
$('tmBtn').onclick=()=>{timerOn=!timerOn;$('tmBtn').innerHTML='⏱ '+zh(timerOn?'Timer on':'Timer off');showTime();};
$('newTheme').onclick=()=>{audio();if(MODE==='vs'&&VS.kind==='room'){toast('Both players share the same theme');return;}if(MODE==='career'){toast(zh('Job themes can’t be changed'));return;}if(MODE==='vs'&&(VS.ch||VS.stage===1)){toast(zh('Can’t change the theme in a face-off'));return;}startRound();};
$('modeBtn').onclick=()=>{audio();if(running)return;if(MODE==='career')careerHub();else showModes();};
/* ---------- judging: three judge girls, each explains her score ---------- */
function worn(){const w=[];if(look.dress)w.push(['dress',look.dress]);else{if(look.top)w.push(['top',look.top]);if(look.bottom)w.push(['bottom',look.bottom]);}
  if(look.shoes)w.push(['shoes',look.shoes]);w.push(['hair',look.hair]);look.acc.forEach(a=>w.push(['acc',a]));return w.map(([c,id])=>[c,find(c,id)]);}
const nameOf=hex=>(Object.entries(PAL).find(([,h])=>h===hex)||['?'])[0];
function judge(){const W=worn(),clothes=W.filter(([c])=>c!=='hair');
  const fit=W.filter(([c,it])=>it.tags.includes(theme.id)),miss=clothes.filter(([c,it])=>!it.tags.includes(theme.id));
  const m=fit.length/W.length,s1=Math.max(1,Math.min(5,1+Math.round(4*m)));
  const r1='';
  const p1=(fit.length?fit.slice(0,2).map(([,i])=>'the '+i.en).join(' and ').replace(/^t/,'T')+(fit.length>1||/[^s]s$/.test(fit[0][1].en)?' fit ':' fits ')+theme.en+' perfectly!':'Hmm, this doesn\'t look much like '+theme.en+' yet.')+(miss.length&&s1<5?' But the '+miss[0][1].en+(/[^s]s$/.test(miss[0][1].en)?' don\'t':' doesn\'t')+' quite match the theme.':'');
  const cols=[...new Set(clothes.map(([c,it])=>nameOf(colOf(keyOf(c,it.id),it))))],hits=cols.filter(c=>theme.col.includes(c));
  let s2=2+(hits.length>=1?2:0)+(hits.length>=2?1:0)-(cols.length>4?1:0);s2=Math.max(1,Math.min(5,s2));
  const p2=hits.length?'Lovely colors! '+hits.map(c=>c[0].toUpperCase()+c.slice(1)).join(' and ')+(hits.length>1?' are':' is')+' perfect for '+theme.en+'.':'Try '+theme.col.slice(0,2).join(' or ')+' for this theme!',r2=esc(p2);
  const pats=Object.entries(look.pat).filter(([k,p])=>p&&p!=='plain'&&clothes.some(([c,it])=>keyOf(c,it.id)===k&&it.dp!==p)).length,custom=Object.keys(look.col).length;
  const s3=Math.max(1,Math.min(5,1+Math.min(2,pats)+(look.acc.length>=2?1:0)+(custom>=2?1:0)));
  const p3=s3>=4?'So creative! Your own patterns and colors make this outfit special.':pats?'Pretty patterns! Add an accessory or two to make it sparkle.':'Try adding a pattern or changing a color to make it your own!',r3=esc(p3);
  return [['👩🏻‍🦰','Ms. Ellie','Theme',s1,esc(p1),'Ms. Ellie',p1],['👩🏽','Ms. Coco','Color',s2,r2,'Ms. Coco',p2],['👩🏼‍🦱','Ms. Lily','Creativity',s3,r3,'Ms. Lily',p3]];}
/* audience: a packed crowd of girls and animal people, holding up phones and cameras */
const FAN=[['#2b2118','#f7a1c4','#f8dccb'],['#6b4226','#74c0fc','#e8b48f'],['#b5502e','#ffd25e','#f8dccb'],['#2b2118','#7cc47f','#c68b5e'],['#e2b866','#9b7fd4','#f8dccb'],['#3a3a44','#ff8a72','#a86b44']];
const ANI=[['cat','#f4a460'],['bunny','#f1f1f1'],['bear','#a0704f'],['panda','#fafafa'],['fox','#e8793a'],['dog','#d9b68c'],['cat','#8d8d96'],['koala','#b7b7c2']];
function fan(i){const [h,c,sk0]=FAN[i%FAN.length],an=i%2===1?ANI[(i>>1)%ANI.length]:null,sk=an?an[1]:sk0,pony=!an&&i%3===0,bun=!an&&i%3===2,phone=i%3!==1;
  const O='stroke="#4a3426"';let head='';
  if(an){const k=an[0];
    if(k==='bunny')head+='<ellipse cx="23" cy="4" rx="4.5" ry="13" fill="'+sk+'" '+O+'/><ellipse cx="37" cy="4" rx="4.5" ry="13" fill="'+sk+'" '+O+'/><ellipse cx="23" cy="5" rx="2" ry="8" fill="#f7a1c4"/><ellipse cx="37" cy="5" rx="2" ry="8" fill="#f7a1c4"/>';
    else if(k==='cat'||k==='fox')head+='<path d="M18 20L19 4L29 14Z" fill="'+sk+'" '+O+'/><path d="M42 20L41 4L31 14Z" fill="'+sk+'" '+O+'/>';
    else if(k==='koala')head+='<circle cx="16" cy="16" r="8" fill="'+sk+'" '+O+'/><circle cx="44" cy="16" r="8" fill="'+sk+'" '+O+'/><circle cx="16" cy="16" r="4" fill="#f1f1f1"/><circle cx="44" cy="16" r="4" fill="#f1f1f1"/>';
    else if(k==='dog')head+='<ellipse cx="17" cy="24" rx="5" ry="10" fill="#8a5a3a" '+O+'/><ellipse cx="43" cy="24" rx="5" ry="10" fill="#8a5a3a" '+O+'/>';
    else head+='<circle cx="20" cy="14" r="5.5" fill="'+(k==='panda'?'#2b2b2b':sk)+'" '+O+'/><circle cx="40" cy="14" r="5.5" fill="'+(k==='panda'?'#2b2b2b':sk)+'" '+O+'/>';
    head+='<ellipse cx="30" cy="26" rx="13" ry="13" fill="'+sk+'" '+O+' stroke-width="1.2"/>';
    if(k==='panda')head+='<ellipse cx="24" cy="25" rx="3.5" ry="4.5" fill="#2b2b2b"/><ellipse cx="36" cy="25" rx="3.5" ry="4.5" fill="#2b2b2b"/>';
    if(k==='fox')head+='<path d="M20 30Q30 40 40 30Q30 34 20 30Z" fill="#fff"/>';
    head+='<circle cx="25" cy="25" r="1.6" fill="#2b2b2b"/><circle cx="35" cy="25" r="1.6" fill="#2b2b2b"/><ellipse cx="30" cy="30" rx="2.2" ry="1.6" fill="#4a3426"/>';}
  else head=(pony?'<path d="M40 14Q56 18 52 40Q48 28 40 22Z" fill="'+h+'" '+O+' stroke-width="1"/>':'')+(bun?'<circle cx="30" cy="7" r="6" fill="'+h+'" '+O+' stroke-width="1"/>':'')+
   '<ellipse cx="30" cy="26" rx="12" ry="14" fill="'+sk+'" '+O+' stroke-width="1.2"/><path d="M18 26Q18 10 30 10Q42 10 42 26Q36 18 30 19Q24 18 18 26Z" fill="'+h+'" '+O+' stroke-width="1"/>';
  const dev=phone?'<g class="cam"><rect x="31" y="14" width="13" height="21" rx="2.5" fill="#f1f3f5" stroke="#1a1a1a" stroke-width="1"/><rect x="33" y="17" width="9" height="14" rx="1" fill="#74c0fc"/></g>'
    :'<g class="cam"><rect x="20" y="24" width="22" height="14" rx="3" fill="#3a3a44" stroke="#1a1a1a" stroke-width="1"/><circle cx="33" cy="31" r="4.5" fill="#74c0fc" stroke="#1a1a1a" stroke-width="1"/><rect x="22" y="21" width="6" height="4" rx="1" fill="#3a3a44"/></g>';
  const arm=phone?'<path d="M46 52L40 32" stroke="'+sk+'" stroke-width="5" stroke-linecap="round"/>':'<path d="M16 50L24 34M44 50L38 34" stroke="'+sk+'" stroke-width="5" stroke-linecap="round"/>';
  return '<svg viewBox="0 0 60 64" width="100%" style="display:block;overflow:visible"><path d="M8 64Q10 44 30 42Q50 44 52 64Z" fill="'+c+'" '+O+' stroke-width="1.3"/>'+head+arm+dev+'</svg>';}
