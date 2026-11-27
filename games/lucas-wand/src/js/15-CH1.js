// words for Year 2 (practice) — chosen by her joining level as in Year 1
Y2.POOLS_W={
 y2warm:['welcome','hello','again','happy','smile','glad','cheer','friends','school','home'],
 y2care:['warm','rest','safe','soft','calm','hug','sleep','gentle','blanket','cozy','better','heal'],
 y2friend:['sorry','trust','kind','share','listen','honest','forgive','buddy','laugh','true'],
 y2journey:['map','socks','boots','tea','scarf','rope','snack','lantern','compass','journey','pack'],
 y2warmth:['fire','sun','heat','glow','spark','flame','toasty','ember','sunny','candle'],
 y2heal:['heal','grow','bloom','moss','light','hope','alive','shine','strong','bright'],
};
Y2.READ_W={
 labels:['book','story','magic','dragon','poem','maps','spells','stars','owls','history','music','plants'],
 diaryRead:['trust me','tell no one','only me','our secret','stay quiet','be careful','I know'],
 notes:['hello','meet me','lunch','I am sad','be kind','sorry','thank you','who wrote this','help'],
 oldMap:['north','river','forest','bridge','tower','mountain','valley','cave','lake','peaks'],
 law:['truth','respect','listen','help','share','courage','honor','friends','promise','never'],
 pactRead:['dragons','people','tell','truth','help','each','other','never','let','go'],
};
// v1.3: two harder "challenge" words per test (longer words, tricky spellings)
Y2.READ_HARD={
 labels:['library','castle','science','treasure','creature','journey','knight','wizard','alphabet','question'],
 diaryRead:['whisper','secret','careful','because','believe','friendship','listening','mystery'],
 notes:['tomorrow','birthday','surprise','favorite','together','different','welcome','yesterday'],
 oldMap:['island','compass','southern','eastern','waterfall','straight','journey','meadow'],
 law:['honest','gentle','brave','protect','kindness','forgive','promise','trusted'],
 pactRead:['forever','dragon','another','people','remember','between','always','castle'],
};

// ================= YEAR 2 ENGINE =================
const CH1=CHAPTERS, CHT1=CH_TEXT, Y1_INTRO=INTRO;
if(!DRAGONS.granite) DRAGONS.granite=Object.assign({},DRAGONS.thistle,{c:'#7c8a7e',wing:'#a9b5aa',horn:'#f1f3f5',belly:'#d8ded9'});
Object.assign(STORIES,Y2.STORIES); Object.assign(STORY_RESULT,Y2.RESULT); Object.assign(FOES,Y2.FOES);
Object.assign(ART_BG,{attic:1,infirm:1,path:1,snow:1,cave:1,hut:1,council:1,moss:1});
Object.assign(BG_FALLBACK,{attic:'library',infirm:'room',path:'stairs',snow:'stairs',cave:'tower',hut:'room',council:'tower',moss:'courtyard'});
const Y2_TRANS=Y2.TRANS;
function yearOf(){ return S.year||1; }
function y1Done(){ return yearOf()===1?!!S.allDone:!!(S.years&&S.years[1]&&S.years[1].allDone); }
function applyYear(){ const y=yearOf(); CHAPTERS=y===2?Y2.CH:CH1; CH_TEXT=y===2?Y2.CH_TEXT:CHT1; document.body.dataset.year=y; }
function setYear(y){ S.years=S.years||{}; const cur=yearOf();
 S.years[cur]={done:S.done,ch:S.ch,view:S.view,chDone:S.chDone,seenT:S.seenT||{},allDone:S.allDone,introSeen:S.introSeen,trial:S.trial};
 const d=S.years[y]||{done:{},ch:1,view:1,chDone:{},seenT:{},allDone:false,introSeen:false,trial:true};
 Object.assign(S,{done:d.done,ch:d.ch,view:d.view,chDone:d.chDone,seenT:d.seenT,allDone:d.allDone,introSeen:d.introSeen,trial:(y===2?true:d.trial)}); S.year=y;
 applyYear(); save(); refreshStars(); spotsKey=''; }
applyYear();
// transitions: Year 2 keys are looked up first while in Year 2
const _afterMission=afterMission;
afterMission=function(next){ if(yearOf()!==2) return _afterMission(next); const k=lastDoneKey; lastDoneKey=null; S.seenT=S.seenT||{}; const T=k&&Y2_TRANS[k]; if(T&&!S.seenT[k]){ S.seenT[k]=true; save(); const L=T(); if(L.length) return playStory(L,next); } next(); };

// ---------- Year 2 writing: no tracing at first, a faint path only after two fizzles, five words per mission
const _guideFor=guideFor; guideFor=function(t,i){ return yearOf()===2?'free':_guideFor(t,i); };
Object.keys(Y2.POOLS_W).forEach(k=>{ POOLS[k]=()=>pickWords([Y2.POOLS_W[k]],5); });

// ---------- spelling test: hear a word, type how it is spelled
let R=null;
function startRead(m,n){ const pool=(Y2.READ_W[m.id]||[]).filter(w=>!(S.readSeen||[]).includes(w)); const hard=shuffle((Y2.READ_HARD[m.id]||[]).filter(w=>!(S.readSeen||[]).includes(w)&&!pool.includes(w))).slice(0,2); let items=shuffle(pool).slice(0,5-hard.length).concat(hard);
 if(items.length<5){ const extra=shuffle([...new Set((S.seen||[]).filter(w=>w.length>2&&!(S.readSeen||[]).includes(w)))]).slice(0,5-items.length); items=items.concat(extra); }
 if(!items.length) items=shuffle(Y2.READ_W[m.id]||['magic']).slice(0,5);
 R={m,n,items,i:0,tries:0,pts:0,good:0}; $('#rdTtl').textContent=`${m.icon} ${m.title} — ${m.goal}`; show('read'); $('#rdFb').textContent=m.intro; Voice.say(m.intro); readItem(); }
function readItem(){ const w=R.items[R.i]; R.tries=0; $('#rdWord').innerHTML=`<div style="text-align:center"><button class="hearBig" type="button" aria-label="Hear the word">🔊</button>${(Y2.READ_HARD[R.m.id]||[]).includes(w)?'<div class="rdHard">⚡ Challenge word</div>':''}<div class="rdBlanks">${w.split('').map(c=>c===' '?'&nbsp;':'_').join(' ')}</div></div>`; $('#rdWord').querySelector('.hearBig').onclick=()=>Voice.say(w); setTimeout(()=>{ if(R&&R.items[R.i]===w) Voice.say(`${w}. Spell ${w}.`); },R.i===0?2200:350); const inp=$('#rdIn'); inp.value=''; inp.disabled=false; setTimeout(()=>{ try{inp.focus({preventScroll:true});}catch(e){} },300);
 $('#rdDots').innerHTML=R.items.map((_,k)=>`<i class="${k<R.i?'ok':k===R.i?'cur':''}"></i>`).join(''); $('#rdHint').textContent=''; }
const normW=s=>s.toLowerCase().replace(/[^a-z ]/g,'').replace(/\s+/g,' ').trim();
function readCheck(){ if(!R||$('#rdIn').disabled) return; const w=R.items[R.i], v=normW($('#rdIn').value); if(!v){ $('#rdFb').textContent='Type the word you hear ⌨️ (tap 🔊 to hear it again)'; return; }
 R.tries++;
 if(v===normW(w)){ const p=R.tries===1?2:1; R.pts+=p; R.good++; S.readSeen=S.readSeen||[]; S.readSeen.push(w); save(); Snd.sfx('gold'); const c=FX.center($('#rdWord')); FX.burst(c[0],c[1],{n:50,speed:8}); FX.text(c[0],c[1]-30,R.tries===1?'SPELLED IT!':'GOT IT!','#ffd43b',48);
  $('#rdFb').textContent=(R.tries===1?'Perfect spelling! ':'Well done! ')+`“${w}” ✨ +${p}`; Voice.say(w); $('#rdIn').disabled=true; setTimeout(readNext,1500); return; }
 if(R.tries===1){ Snd.sfx('poof'); $('#rdFb').textContent='Not quite. Listen again and say each sound slowly. Try again!'; $('#rdHint').textContent=`Hint: it starts with “${w[0]}” and has ${w.replace(/ /g,'').length} letters. Green letters are right!`; const tv=$('#rdIn').value.toLowerCase(); $('#rdWord').querySelector('.rdBlanks').innerHTML=w.split('').map((c,k)=>c===' '?'&nbsp;':(k===0||tv[k]===c.toLowerCase())?`<b class="rdOk">${c}</b>`:'_').join(' '); Voice.say(`Not quite. Listen again. ${w}.`); $('#rdIn').select(); return; }
 Snd.sfx('poof'); $('#rdWord').querySelector('.rdBlanks').textContent=w; $('#rdFb').textContent=`It is spelled: ${w.split('').join('-')}. Look at it once more, then we go on.`; Voice.say(`${w} is spelled ${w.split('').filter(c=>c!==' ').join(', ')}.`); S.readSeen=S.readSeen||[]; S.readSeen.push(w); save(); $('#rdIn').disabled=true; setTimeout(readNext,2600); }
function readNext(){ if(!R) return; R.i++; if(R.i<R.items.length) return readItem(); const m=R.m,n=R.n,st=R.good>=R.items.length?3:R.good>=R.items.length-1?2:1; markDone(n,m,R.pts); resultScreen(m.done,'⭐'.repeat(st)+'☆'.repeat(3-st),`+${R.pts} magic stars · spelled ${R.good} of ${R.items.length}`,m.tip,n); R=null; }
const _startMission=startMission;
startMission=function(m,n=S.view){ if(m.kind==='read'){ Snd.stopMusic(); return startRead(m,n); } return _startMission(m,n); };

// ---------- Year 2 explorable castle map
const _goMap=goMap;
goMap=function(){ if(yearOf()!==2) return _goMap(); if(S.trial&&!nextMain(S.view)&&!S.chDone[S.view]) return chapterEnd(S.view); show('map2'); refreshStars(); Snd.startMusic(); renderMap2(); };
const TREASURE={1:['labels','opal'],2:['care','night'],3:['notes','friendW'],4:['pack','oldMap'],5:['saffron','law'],6:['mossW','opalSorry']};
const TREASURE_TXT=['a lost silver button','a tiny dragon tooth','a glowing marble','a four-leaf clover','a feather quill','a shiny old coin','a ribbon from Mei','a sticker from Sunny','a pressed flower','a star-shaped stone','a secret note from Lola','a crystal bead'];
function renderMap2(){ const n=S.view, ch=CH(n), nm=nextMain(n); $('#m2Ttl').textContent=`Year 2 · Chapter ${n} · ${ch.title}`;
 $('#m2Prev').style.visibility=n>1?'visible':'hidden'; $('#m2Next').style.visibility=n<Math.min(S.ch,CHAPTERS.length)?'visible':'hidden';
 const box=$('#m2Rooms'); box.innerHTML=''; S.found=S.found||{};
 ch.missions.forEach((m,i)=>{ const open=isOpen(n,m), done=isDone(n,m.id); const b=document.createElement('button'); b.className='room'+(open?'':' lock')+(done?' done':'')+(m===nm?' next':'')+(m.kind==='mini'?' mini':''); b.dataset.id=m.id;
  b.innerHTML=`<span class="pic" style="background-image:url(art/bg-${m.bg}.webp)"></span><span class="lbl">${open?m.icon:'🔒'} ${m.name}<small>${m.title||({mini:'Mini game'}[m.kind])||''}</small></span>${done?'<span class="tick">✓</span>':''}${m===nm?`<span class="here">${girl('nora',0,0,1,{arm:'wave',badge:false}).replace(/^/,'<svg viewBox="-160 -120 320 420">')+'</svg>'}</span>`:''}`;
  b.onclick=()=>{ if(!open){ Snd.sfx('fizz'); $('#m2Msg').textContent='Locked! Finish the glowing room first.'; return; } Snd.sfx('tap'); FX.burst(...FX.center(b),{n:40,speed:7}); setTimeout(()=>startMission(m,n),300); };
  const tk=`${n}:${m.id}`; if((TREASURE[n]||[]).includes(m.id)&&!S.found[tk]&&(done||open)){ const t=document.createElement('span'); t.className='treasure'; t.textContent='✨'; t.style.left=(20+((i*37)%60))+'%'; t.style.top=(18+((i*23)%40))+'%';
   t.onclick=e=>{ e.stopPropagation(); S.found[tk]=true; S.stars+=2; save(); refreshStars(); Snd.sfx('gold'); FX.burst(e.clientX,e.clientY,{n:60,speed:9}); const what=TREASURE_TXT[(n*7+i)%TREASURE_TXT.length]; $('#m2Msg').textContent=`You found ${what}! +2 ✨`; Voice.say(`You found ${what}!`); t.remove(); };
   b.appendChild(t); }
  box.appendChild(b); });
 $('#m2Msg').textContent= nm ? `Go to the ${nm.name}! ${nm.icon}   ·   Psst… look for hidden ✨ treasures` : (n<CHAPTERS.length?`Chapter ${n} complete! ▶`:'You finished Year 2! ✨');
 const cur=box.querySelector('.room.next'); if(cur) setTimeout(()=>cur.scrollIntoView({block:'center',inline:'center',behavior:'smooth'}),200);
}
$('#m2Home').onclick=()=>{ Snd.sfx('tap'); show('title'); refreshStars(); };
$('#m2Prev').onclick=()=>{ if(S.view>1){ S.view--; save(); renderMap2(); Snd.sfx('tap'); } };
$('#m2Next').onclick=()=>{ if(S.view<Math.min(S.ch,CHAPTERS.length)){ S.view++; save(); renderMap2(); Snd.sfx('tap'); } };
$('#m2Shop').onclick=()=>openShop('map2');
$('#m2Friends').onclick=()=>$('#mapFriends').click();

// ---------- Star shop: wands, robes, treats for Ember
const SHOP={
 wand:[{id:'gold',n:'Classic Gold',p:0,c:['rgba(255,212,59,.35)','#e9a91c','#fff3bf']},{id:'rose',n:'Rose Quartz',p:15,c:['rgba(255,135,190,.35)','#e64980','#ffdeeb']},{id:'ice',n:'Ice Crystal',p:20,c:['rgba(116,192,252,.35)','#1c7ed6','#e7f5ff']},{id:'ember',n:'Dragon Fire',p:25,c:['rgba(255,146,43,.4)','#e8590c','#fff4e6']},{id:'forest',n:'Forest Leaf',p:25,c:['rgba(105,219,124,.35)','#2b8a3e','#ebfbee']},{id:'star',n:'Starlight',p:35,c:['rgba(208,191,255,.45)','#7048e8','#ffffff']},{id:'rainbow',n:'Rainbow',p:45,c:'rainbow'}],
 robe:[{id:'purple',n:'Academy Blue',p:0,h:null},{id:'blue',n:'Royal Purple',p:20,h:270},{id:'green',n:'Forest Green',p:25,h:140},{id:'red',n:'Ruby Red',p:30,h:355},{id:'teal',n:'Ocean Teal',p:30,h:180},{id:'pink',n:'Blossom Pink',p:35,h:325},{id:'gold',n:'Sunshine Gold',p:45,h:45}],
 treat:[{id:'berry',n:'Glow Berries',p:3,e:'🫐',say:'Ember gobbles them up. Her nose glows blue for a whole minute!'},{id:'cake',n:'Honey Cake',p:4,e:'🍯',say:'Ember licks the honey off her claws, very slowly, very happily.'},{id:'pepper',n:'Spicy Pepper',p:4,e:'🌶️',say:'Ember sneezes a tiny fireball and does a happy loop!'},{id:'cookie',n:'Star Cookie',p:5,e:'🍪',say:'Ember balances the cookie on her nose, then CHOMP!'},{id:'milk',n:'Moon Milk',p:6,e:'🥛',say:'Ember drinks it all and curls up purring like a giant kitten.'}],
};
function eq(){ S.equip=S.equip||{wand:'gold',robe:'purple'}; S.owned=S.owned||{wand:{gold:1},robe:{purple:1}}; S.treats=S.treats||{}; return S.equip; }
function inkColors(){ const w=SHOP.wand.find(x=>x.id===eq().wand)||SHOP.wand[0]; if(w.c!=='rainbow') return w.c; const h=Math.floor(performance.now()/40)%360; return [`hsla(${h},90%,60%,.35)`,`hsl(${h},85%,45%)`,`hsl(${(h+40)%360},100%,92%)`]; }
// robe recolor: only the purple robe pixels change hue (done once per picture, then cached)
const ROBE_CACHE={}, ROBE_BUSY={};
function robeSrc(src){ const r=SHOP.robe.find(x=>x.id===eq().robe); if(!r||r.h===null) return src; const k=src+'|'+r.id; if(ROBE_CACHE[k]) return ROBE_CACHE[k]; if(!ROBE_BUSY[k]){ ROBE_BUSY[k]=1; recolor(src,r.h).then(u=>{ ROBE_CACHE[k]=u; }).catch(()=>{}); } return src; }
function recolor(src,hue){ return new Promise((res,rej)=>{ const im=new Image(); im.onload=()=>{ try{ const c=document.createElement('canvas'); c.width=im.naturalWidth; c.height=im.naturalHeight; const g=c.getContext('2d'); g.drawImage(im,0,0); const d=g.getImageData(0,0,c.width,c.height), a=d.data;
  for(let i=0;i<a.length;i+=4){ if(a[i+3]<10) continue; const r=a[i]/255,gg=a[i+1]/255,b=a[i+2]/255, mx=Math.max(r,gg,b), mn=Math.min(r,gg,b), l=(mx+mn)/2, dl=mx-mn; if(dl<.08) continue; const s=dl/(1-Math.abs(2*l-1));
   let h; if(mx===r) h=60*(((gg-b)/dl)%6); else if(mx===gg) h=60*((b-r)/dl+2); else h=60*((r-gg)/dl+4); if(h<0) h+=360;
   if(h<195||h>250||s<.12) continue; // only the blue robe
   const nh=hue, L=hue===45?Math.min(.85,l*1.25):l, S2=Math.min(1,s*(hue===45?1.1:1)); const C=(1-Math.abs(2*L-1))*S2, X=C*(1-Math.abs((nh/60)%2-1)), m=L-C/2; let rr,g2,bb; const hh=nh/60;
   if(hh<1){rr=C;g2=X;bb=0;} else if(hh<2){rr=X;g2=C;bb=0;} else if(hh<3){rr=0;g2=C;bb=X;} else if(hh<4){rr=0;g2=X;bb=C;} else if(hh<5){rr=X;g2=0;bb=C;} else {rr=C;g2=0;bb=X;}
   a[i]=(rr+m)*255; a[i+1]=(g2+m)*255; a[i+2]=(bb+m)*255; }
  g.putImageData(d,0,0); res(c.toDataURL('image/png')); }catch(e){ rej(e); } }; im.onerror=rej; im.src=src; }); }
