const ART_BG={room:1,gate:1,library:1,hall:1,courtyard:1,stairs:1,tower:1,runehall:1,common:1,home:1,bigstairs:1,greenhouse:1,bridge:1,shadowgate:1,cellar:1,office:1,field:1,peaks:1};
const MISSION_BG={rune:'runehall',caps:'runehall',roost:'greenhouse',chain:'bridge',flight:'field',home:'common',restore:'library',song:'room',courage:'hall'};
const BG_FALLBACK={runehall:'hall',common:'room',home:'room',bigstairs:'hall',greenhouse:'courtyard',bridge:'stairs',shadowgate:'tower',cellar:'library',office:'library',field:'courtyard',peaks:'stairs'};
function BG(k){ return BGS[BGS[k]?k:BG_FALLBACK[k]]()+(ART_BG[k]?`<image href="art/bg-${k}.webp" x="-24" y="-16" width="1072" height="670" preserveAspectRatio="xMidYMid slice"/>`:''); }
function sceneSVG(bg,chars,extra=''){ return svg(BG(bg)+chars.map(c=>girl(...c)).join('')+extra); }

// ============ dragons (original designs) ============
const DRAGONS={ember:{c:'#ffa94d',belly:'#fff3bf',wing:'#ffd8a8',horn:'#e8590c'},thistle:{c:'#e599f7',belly:'#fff0f6',wing:'#f3d9fa',horn:'#9c36b5'},dawn:{c:'#ffd43b',belly:'#fff9db',wing:'#ffec99',horn:'#f08c00'}};
function dragon(x,y,s,o={}){ const d=DRAGONS[o.who||'ember'], st=o.stage||'baby', k=s*(st==='big'?1.6:st==='young'?1:.72);
 const dw=o.who||'ember'; if(st!=='egg'&&DRAGON_ART[dw]){ const [iw,ih,h]=DRAGON_ART[dw], w=h*iw/ih; return `<g transform="translate(${x},${y}) scale(${o.flip?-k:k},${k})"><ellipse cx="0" cy="184" rx="${w*.3}" ry="10" fill="#000" opacity="${o.fly?.08:.16}"/><g${o.fly?' transform="translate(0,-30)"':''}><image href="art/d-${dw}.webp" x="${-w/2}" y="${184-h}" width="${w}" height="${h}"/></g></g>`; }
 if(st==='egg'){ const crack=o.crack?`<path d="M-40 -10l18 14 14-20 16 18 16-16 16 12" stroke="#7a4520" stroke-width="5" fill="none"/>`:'';
  return `<g transform="translate(${x},${y}) scale(${s})" filter="url(#soft)"><ellipse cx="0" cy="40" rx="110" ry="120" fill="url(#warm)"/><ellipse cx="0" cy="0" rx="62" ry="80" fill="#ffd8a8"/><circle cx="-20" cy="-30" r="10" fill="#ffa94d"/><circle cx="22" cy="5" r="13" fill="#ffa94d"/><circle cx="-14" cy="35" r="8" fill="#ffa94d"/><ellipse cx="-22" cy="-46" rx="12" ry="18" fill="#fff" opacity=".5"/>${crack}</g>`; }
 const ex=o.expr||'happy', wingUp=o.fly?-1:1;
 const eye=ex==='closed'?`<path d="M44 12q10 8 20 0" stroke="#2b2b33" stroke-width="5" fill="none" stroke-linecap="round"/>`:`<ellipse cx="54" cy="10" rx="13" ry="${ex==='sad'?12:16}" fill="#2b2b33"/><circle cx="58" cy="4" r="5" fill="#fff"/><circle cx="50" cy="16" r="2.5" fill="#fff"/>`;
 const mouth=ex==='sad'?'M92 52q-10-6-20 0':ex==='wow'?'M80 50a7 7 0 1 0 14 0a7 7 0 1 0-14 0':'M74 48q12 12 26 0';
 return `<g transform="translate(${x},${y}) scale(${o.flip?-k:k},${k})" filter="url(#soft)">
  <path d="M-70 130C-150 150 -190 90 -160 60C-150 90 -110 110 -70 100Z" fill="${d.c}"/><path d="M-165 58l-20-14 26 2Z" fill="${d.horn}"/>
  <g transform="translate(-10,70) scale(1,${wingUp})"><path d="M0 0C-40 -60 -100 -110 -150 -120C-140 -90 -150 -70 -130 -50C-120 -60 -100 -60 -95 -40C-80 -50 -60 -45 -55 -25C-40 -30 -20 -20 -10 0Z" fill="${d.wing}" stroke="${d.c}" stroke-width="8" stroke-linejoin="round"/></g>
  <ellipse cx="0" cy="110" rx="82" ry="66" fill="${d.c}"/><ellipse cx="14" cy="124" rx="50" ry="44" fill="${d.belly}"/>
  ${[-50,-20,10].map(sx=>`<path d="M${sx} 50l12 -26 12 26Z" fill="${d.horn}"/>`).join('')}
  <ellipse cx="-40" cy="170" rx="20" ry="14" fill="${d.c}"/><ellipse cx="40" cy="172" rx="20" ry="14" fill="${d.c}"/>
  <path d="M20 70C30 40 40 20 50 10" stroke="${d.c}" stroke-width="44" stroke-linecap="round"/>
  <circle cx="50" cy="10" r="54" fill="${d.c}"/><ellipse cx="94" cy="38" rx="36" ry="26" fill="${d.c}"/><ellipse cx="102" cy="44" rx="22" ry="12" fill="${d.belly}" opacity=".6"/>
  <circle cx="112" cy="30" r="3.5" fill="#2b2b33"/><path d="M20 -36l-12 -40 30 26Z M56 -42l4 -44 22 36Z" fill="${d.horn}"/>
  ${eye}<path d="${mouth}" stroke="#2b2b33" stroke-width="4" fill="${ex==='wow'?'#c2255c':'none'}" stroke-linecap="round"/><ellipse cx="30" cy="36" rx="10" ry="6" fill="#ff8787" opacity=".5"/>
  ${o.breath?`<g filter="url(#glow)"><ellipse cx="170" cy="40" rx="40" ry="18" fill="#ffd43b"/><ellipse cx="220" cy="40" rx="30" ry="14" fill="#ff922b" opacity=".8"/></g>`:''}
 </g>`; }
const D=(x,y,s,o)=>dragon(x,y,s,o);

// ============ the cast: everyone has a story ============
const CHARS=[
 {id:'nora',name:'Nora',role:'New student',art:()=>girl('nora',0,0,1,{arm:'wand',badge:false}),bio:'Loves math puzzles and big adventures. She came to Inkwell Academy with a glowing letter and a brave heart. Her secret power: she never gives up for long.'},
 {id:'mei',name:'Mei',role:'Roommate',art:()=>girl('mei',0,0,1,{expr:'shy'}),bio:'Shy and clever. Her family makes the best dumplings in town, and she misses them every night. Her dream is to invent a spell that makes anyone feel at home. Her worry: being laughed at.'},
 {id:'iris',name:'Iris',role:'Top of the class',art:()=>girl('iris',0,0,1,{expr:'smirk'}),bio:'The best duelist in her year. Her mom captains a sky-ship far away and left her a silver quill. She acts tough because she feels lonely. Underneath, she is fiercely loyal.'},
 {id:'sunny',name:'Sunny',role:'Youngest first-year',art:()=>girl('sunny',0,0,1,{}),bio:'Seven years old, covered in stickers, and always a little lost. She thinks Nora is the coolest big kid ever. Her dream is to cast a rainbow spell.'},
 {id:'juni',name:'Juni',role:'Garden student',art:()=>girl('juni',0,0,1,{}),bio:'Talks to plants, and the plants talk back! She found a dragon egg after the storm. She is scared of heights because she once fell out of a tree, but she is learning to fly anyway.'},
 {id:'ember',name:'Ember',role:'Baby dragon',dragon:true,art:()=>dragon(0,40,1,{who:'ember'}),bio:'A Dawnfeather hatchling who loves berries, shiny letters and sneezing sparks. Her egg was blown far from home by a storm. She is searching for her family.'},
 {id:'bree',name:'Coach Bree',role:'Flying teacher',art:()=>girl('bree',0,0,1,{}),bio:'The fastest flyer at the academy. Long ago she rode a dragon named Thistle, until a storm pulled them apart. She has carried that sad secret for twenty years.'},
 {id:'lola',name:'Lola',role:'Library ghost',art:()=>girl('lola',0,0,1,{}),bio:'A friendly ghost who has lived in the library for two hundred years. She has read every single book. What she misses most is someone to read with.'},
 {id:'prof',name:'Professor Quill',role:'Headmistress',art:()=>girl('prof',0,0,1,{}),bio:'Wise, warm and a little strict. She failed her first hundred spells and keeps every failed page in a drawer to show students that mistakes are how wizards grow.'},
 {id:'gran',name:'Grandma Rose',role:'Nora\'s grandma',art:()=>girl('gran',0,0,1,{}),bio:'Nora\'s grandma, and a former student of Inkwell Academy. She once made a promise to her best friend that she did not keep, and she has never forgotten it.'},
 {id:'wren',name:'Wren',role:'The girl in the tower',art:()=>girl('wren',0,0,1,{expr:'sad'}),bio:'Rose\'s best friend from long ago. She loved writing letters more than anything. When no one wrote back, her loneliness grew into the Fading.'},
 {id:'thistle',name:'Thistle',role:'Dragon elder',dragon:true,art:()=>dragon(0,40,.6,{who:'thistle',stage:'big'}),bio:'A great Dawnfeather dragon and Ember\'s aunt. She was Coach Bree\'s flying partner, and she has searched every sky for her lost family.'},
];
function meet(id){ if(id&&CHARS.some(c=>c.id===id)&&!S.met[id]){ S.met[id]=true; save(); } }
function openFriends(back){ const box=$('#frList'); box.innerHTML='';
 CHARS.forEach(c=>{ const met=!!S.met[c.id]; const d=document.createElement('button'); d.className='fr'+(met?'':' locked');
  const vb=c.dragon?'-200 -140 420 360':'-110 -90 220 230';
  d.innerHTML=`<div class="frArt">${met?svg(c.art(),vb):'<span style="font-size:44px">❔</span>'}</div><div class="frTxt"><b>${met?c.name:'???'}</b><small>${met?c.role:'Not met yet'}</small><p>${met?c.bio:'Keep playing to meet this friend.'}</p></div>`;
  if(met) d.onclick=()=>{ Snd.sfx('tap'); Voice.say(c.name+'. '+c.bio); FX.hearts(...FX.center(d)); };
  box.appendChild(d); });
 $('#frCount').textContent=`${CHARS.filter(c=>S.met[c.id]).length} / ${CHARS.length} friends met`;
 $('#frBack').onclick=()=>{ Voice.stop(); back(); };
 show('friends'); }

// ============ story player ============
let storyDone=null, storyLines=[], storyIdx=0;
function playStory(lines,onDone,opts={}){
 storyLines=lines; storyIdx=0; storyDone=onDone; lastScene=null; lastBg=null; show('story'); Snd.stopMusic();
 $('#skipBtn').style.display=opts.skippable?'':'none'; stepStory();
}
let lastScene=null, lastBg=null;
// Swap scenes without a flash: same background = instant swap on top of the old one; new place = soft fade.
function swapStage(html,fade){ const st=$('#stStage'); const d=document.createElement('div'); d.style.cssText='position:absolute;inset:0'; if(fade) d.className='fade'; d.innerHTML=html;
 if(getComputedStyle(st).position==='static') st.style.position='relative';
 if(!fade){ d.style.animation='none'; const os=st.querySelector('svg'), ns=d.querySelector('svg'); try{ const oa=os&&os.getAnimations()[0]; st.appendChild(d); const na=ns&&ns.getAnimations()[0]; if(oa&&na) na.currentTime=oa.currentTime; }catch(e){ st.appendChild(d); } } else st.appendChild(d); requestAnimationFrame(()=>requestAnimationFrame(()=>{ [...st.children].forEach(c=>{ if(c!==d) c.remove(); }); })); }
// Preload and decode all art once so swaps never wait on a picture.
(function(){ const L=Object.keys(ART_BG).map(k=>`art/bg-${k}.webp`).concat(['happy','wow','brave','cast','sad','sleepy','wave'].map(k=>`art/nora-${k}.webp`),Object.keys(typeof FRIEND_ART!=='undefined'?FRIEND_ART:{}).map(k=>`art/f-${k}.webp`),Object.keys(FRIEND_EMO).map(k=>`art/f-${k}.webp`),Object.keys(FOE_ART).map(k=>`art/m-${k}.webp`),Object.keys(DRAGON_ART).map(k=>`art/d-${k}.webp`)); window.__artKeep=L.map(u=>{ const i=new Image(); i.src=u; i.decode&&i.decode().catch(()=>{}); return i; }); })();
function stepStory(){
 const L=storyLines[storyIdx]; if(!L){ Voice.stop(); const f=storyDone; storyDone=null; f&&f(); return; }
 if(L.scene&&L.scene!==lastScene){ const m=L.scene.match(/art\/bg-([a-z]+)\.webp/), bg=m?m[1]:L.scene.slice(0,80); swapStage(L.scene, bg!==lastBg); lastScene=L.scene; lastBg=bg; }
 $('#stWho').textContent=L.who?(NAMES[L.who]||L.who)+':':''; if(L.who) meet(L.who); (L.meet||[]).forEach(meet); $('#stTxt').textContent=L.text;
 const ch=$('#stChoices'); ch.innerHTML='';
 $('#stNext').style.display=L.choices?'none':'';
 if(L.choices){ if(!L._ord) L._ord=shuffle(L.choices.slice()); } // mixed order, so the kind answer isn't always last
 if(L.choices) L._ord.forEach(c=>{ const b=document.createElement('button'); b.textContent=c.t; b.onclick=()=>{ Snd.sfx('tap'); if(!c.ok){ FX.smoke([FX.center(b)]); } if(c.ok){ FX.hearts(...FX.center(b)); Snd.sfx('light'); storyIdx++; if(c.reply){ storyLines.splice(storyIdx,0,...c.reply);} stepStory(); } else { $('#stTxt').textContent=c.why; Voice.say(c.why); b.disabled=true; b.style.opacity=.5; } }; ch.appendChild(b); });
 Voice.stop(); Voice.say(L.text,L.who);
 if(L.sfx){ Snd.sfx(L.sfx); const c=FX.center($('#stStage')); FX.burst(c[0],c[1]-40,{n:L.sfx==='gold'?70:40,speed:8,size:6}); if(L.sfx==='gold') FX.flash('#fff3bf',.4); }
}
$('#stNext').onclick=()=>{ Snd.sfx('tap'); storyIdx++; stepStory(); };
$('#stStage').onclick=()=>{ if(!storyLines[storyIdx]||storyLines[storyIdx].choices) return; storyIdx++; stepStory(); };
$('#skipBtn').onclick=e=>{ e.stopPropagation(); Voice.stop(); storyIdx=storyLines.length; stepStory(); };

const ENVELOPE=`<g class="float"><g transform="translate(700,250) rotate(-8)" filter="url(#glow)"><rect x="-70" y="-46" width="140" height="92" rx="6" fill="#fff8e1"/><path d="M-70 -46L0 10L70 -46" fill="none" stroke="#c9a96b" stroke-width="4"/><circle cx="0" cy="10" r="14" fill="#c92a2a"/><path d="M0 0l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#ffd43b"/></g></g>`;
const LETTERTXT=`<g transform="translate(560,300) rotate(-4)"><rect width="320" height="210" rx="8" fill="#fff8e1" filter="url(#soft)"/><text x="24" y="56" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="40" fill="#e9a91c" filter="url(#glow)">Dear Nora,</text><text x="24" y="104" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="30" fill="#7048e8">You are invited to</text><text x="24" y="146" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="34" fill="#7048e8">Inkwell Academy</text></g>`;
