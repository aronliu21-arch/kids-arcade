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
 storyLines=lines; storyIdx=0; storyDone=onDone; show('story'); Snd.stopMusic();
 $('#skipBtn').style.display=opts.skippable?'':'none'; stepStory();
}
function stepStory(){
 const L=storyLines[storyIdx]; if(!L){ Voice.stop(); const f=storyDone; storyDone=null; f&&f(); return; }
 if(L.scene) $('#stStage').innerHTML=`<div class="fade" style="width:100%;height:100%">${L.scene}</div>`;
 $('#stWho').textContent=L.who?(NAMES[L.who]||L.who)+':':''; if(L.who) meet(L.who); (L.meet||[]).forEach(meet); $('#stTxt').textContent=L.text;
 const ch=$('#stChoices'); ch.innerHTML='';
 $('#stNext').style.display=L.choices?'none':'';
 if(L.choices) L.choices.forEach(c=>{ const b=document.createElement('button'); b.textContent=c.t; b.onclick=()=>{ Snd.sfx('tap'); if(!c.ok){ FX.smoke([FX.center(b)]); } if(c.ok){ FX.hearts(...FX.center(b)); Snd.sfx('light'); storyIdx++; if(c.reply){ storyLines.splice(storyIdx,0,...c.reply);} stepStory(); } else { $('#stTxt').textContent=c.why; Voice.say(c.why); b.disabled=true; b.style.opacity=.5; } }; ch.appendChild(b); });
 Voice.stop(); Voice.say(L.text,L.who);
 if(L.sfx){ Snd.sfx(L.sfx); const c=FX.center($('#stStage')); FX.burst(c[0],c[1]-40,{n:L.sfx==='gold'?70:40,speed:8,size:6}); if(L.sfx==='gold') FX.flash('#fff3bf',.4); }
}
$('#stNext').onclick=()=>{ Snd.sfx('tap'); storyIdx++; stepStory(); };
$('#stStage').onclick=()=>{ if(!storyLines[storyIdx]||storyLines[storyIdx].choices) return; storyIdx++; stepStory(); };
$('#skipBtn').onclick=e=>{ e.stopPropagation(); Voice.stop(); storyIdx=storyLines.length; stepStory(); };

const ENVELOPE=`<g class="float"><g transform="translate(700,250) rotate(-8)" filter="url(#glow)"><rect x="-70" y="-46" width="140" height="92" rx="6" fill="#fff8e1"/><path d="M-70 -46L0 10L70 -46" fill="none" stroke="#c9a96b" stroke-width="4"/><circle cx="0" cy="10" r="14" fill="#c92a2a"/><path d="M0 0l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#ffd43b"/></g></g>`;
const LETTERTXT=`<g transform="translate(560,300) rotate(-4)"><rect width="320" height="210" rx="8" fill="#fff8e1" filter="url(#soft)"/><text x="24" y="56" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="40" fill="#e9a91c" filter="url(#glow)">Dear Nora,</text><text x="24" y="104" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="30" fill="#7048e8">You are invited to</text><text x="24" y="146" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="34" fill="#7048e8">Inkwell Academy</text></g>`;
const INTRO=()=>[
 {scene:sceneSVG('room',[['nora',300,250,1,{expr:'closed'}]]),text:'It was a quiet night. Nora was almost asleep… when something tapped on her window.'},
 {scene:sceneSVG('room',[['nora',300,250,1,{expr:'wow'}]],ENVELOPE),text:'A letter! It floated right inside, glowing like a tiny moon.',sfx:'spark'},
 {scene:sceneSVG('room',[['nora',300,250,1,{arm:'hold',expr:'wow'}]],LETTERTXT),who:'nora',text:'Whoa… the writing is moving! It says… Dear Nora, you are invited to Inkwell Academy!',sfx:'chime'},
 {scene:sceneSVG('room',[['gran',180,270,.95,{expr:'wow'}],['nora',430,250,1,{arm:'hold'}]],LETTERTXT),who:'gran',text:'Inkwell Academy? Oh my. I haven\'t heard that name in a very long time.'},
 {scene:sceneSVG('room',[['gran',180,270,.95,{expr:'closed'}],['nora',430,250,1,{}]]),who:'gran',text:'I went there when I was just your age, sweetheart. Over there, every spell is written by hand… in cursive.'},
 {scene:sceneSVG('room',[['gran',180,270,.95,{expr:'happy'}],['nora',430,250,1,{expr:'wow'}]]),who:'nora',text:'Wait. You\'re a wizard, Grandma?!'},
 {scene:sceneSVG('room',[['gran',180,270,.95,{expr:'closed'}],['nora',430,250,1,{}]]),who:'gran',text:'Was, dear. Was. Now go on… they\'re waiting for you.'},
 {scene:sceneSVG('gate',[['prof',760,250,1,{arm:'wave'}],['nora',300,260,1,{arm:'wand'}]]),who:'prof',text:'Ah, you must be Nora! Welcome. I\'m Professor Quill.'},
 {scene:sceneSVG('gate',[['prof',760,250,1,{}],['nora',300,260,1,{arm:'wand'}]]),who:'prof',text:'Before the gate opens, let\'s see your wand-writing. Don\'t worry about being perfect. Just do your best.'},
];

// ============ writing pad ============
class Pad{
 constructor(host){ this.host=host; this.cv=document.createElement('canvas'); host.appendChild(this.cv); this.g=this.cv.getContext('2d'); this.strokes=[]; this.cur=null; this.pen=false; this.text='a'; this.L=layoutText('a'); this.demo=null; this.locked=false; this.trail=[];
  this.bind(); new ResizeObserver(()=>requestAnimationFrame(()=>this.resize())).observe(this.cv); }
 set(text){ this.text=text; this.L=text.trim()?layoutText(text):{strokes:[],bbox:{minX:0,maxX:1.4,w:1.4,minY:0,maxY:2,h:2},len:1}; this.strokes=[]; this.cur=null; this.locked=false; this.demo=null; this.resize(); }
 resize(){ const r=this.cv.getBoundingClientRect(); if(!r.width) return; const dpr=Math.min(3,devicePixelRatio||1); this.W=r.width; this.H=r.height; this.cv.width=r.width*dpr; this.cv.height=r.height*dpr; this.g.setTransform(dpr,0,0,dpr,0,0);
  const b=this.L.bbox,w=Math.max(b.w,1.4)+1.0, vTop=Math.max(2.35,b.maxY+.35), vBot=Math.min(-1.25,b.minY-.3);
  this.U=Math.min((this.H-16)/(vTop-vBot),(this.W-20)/w,170); this.ox=(this.W-b.w*this.U)/2-b.minX*this.U; this.oy=8+vTop*this.U+((this.H-16)-(vTop-vBot)*this.U)/2; this.draw(); }
 toPx(p){ return [this.ox+p[0]*this.U,this.oy-p[1]*this.U]; }
 toU(x,y){ return [(x-this.ox)/this.U,(this.oy-y)/this.U]; }
 bind(){ const cv=this.cv, pos=e=>{const r=cv.getBoundingClientRect();return this.toU(e.clientX-r.left,e.clientY-r.top);};
  cv.addEventListener('pointerdown',e=>{ if(this.demo){ this.demo=null; this.draw(); } if(this.locked) return; if(this.cur&&e.pointerId!==this.curId) return; e.preventDefault(); try{cv.setPointerCapture(e.pointerId);}catch(_){} this.curId=e.pointerId; if(e.pointerType==='pen') this.pen=true; this.cur=[pos(e)]; this.strokes.push(this.cur); hideFb(); this.draw(); });
  cv.addEventListener('pointermove',e=>{ if(!this.cur||e.pointerId!==this.curId) return; e.preventDefault(); const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e]; for(const ev of (evs.length?evs:[e])){ const p=pos(ev),q=this.cur[this.cur.length-1]; if(d2(p,q)>.012){ this.cur.push(p); if(Math.random()<.25) this.trail.push({p,t:performance.now()}); } } this.draw(); });
  const end=e=>{ if(this.cur&&e.pointerId===this.curId){ this.cur=null; this.curId=null; this.draw(); } };
  cv.addEventListener('pointerup',end); cv.addEventListener('pointercancel',end); cv.addEventListener('lostpointercapture',end);
  cv.addEventListener('touchstart',e=>e.preventDefault(),{passive:false}); }
 clear(){ this.strokes=[]; this.cur=null; this.draw(); }
 hasInk(){ return this.strokes.some(s=>s.length>1); }
 path(pts,n){ const g=this.g; g.beginPath(); n=n==null?pts.length:n; for(let i=0;i<n;i++){ const [x,y]=this.toPx(pts[i]); i?g.lineTo(x,y):g.moveTo(x,y); } }
 draw(){ const g=this.g; if(!this.W) return; g.clearRect(0,0,this.W,this.H);
  // parchment
  const gr=g.createRadialGradient(this.W/2,this.H/2,10,this.W/2,this.H/2,this.W*.7); gr.addColorStop(0,'#fffdf5'); gr.addColorStop(1,'#f6ead0'); g.fillStyle=gr; g.fillRect(0,0,this.W,this.H);
  const y=k=>this.oy-k*this.U; g.lineCap='round';
  g.strokeStyle='#9bb3d8'; g.lineWidth=2.5; g.setLineDash([]); g.beginPath(); g.moveTo(0,y(2)); g.lineTo(this.W,y(2)); g.stroke();
  g.strokeStyle='#f3a0a0'; g.lineWidth=2; g.setLineDash([12,10]); g.beginPath(); g.moveTo(0,y(1)); g.lineTo(this.W,y(1)); g.stroke(); g.setLineDash([]);
  g.strokeStyle='#8fa6cf'; g.lineWidth=3; g.beginPath(); g.moveTo(0,y(0)); g.lineTo(this.W,y(0)); g.stroke();
  g.strokeStyle='#e7dcc4'; g.lineWidth=1.5; g.beginPath(); g.moveTo(0,y(-1)); g.lineTo(this.W,y(-1)); g.stroke();
  // model path
  const U=this.U; g.lineJoin='round';
  for(const s of this.L.strokes){ if(s.dot){ const [x,yy]=this.toPx(s.pts[0]); g.fillStyle='rgba(201,178,120,.6)'; g.beginPath(); g.arc(x,yy,U*.16,0,7); g.fill(); continue; }
   g.strokeStyle='rgba(233,215,170,.9)'; g.lineWidth=Math.max(12,U*.32); this.path(s.pts); g.stroke();
   g.strokeStyle='rgba(176,140,80,.85)'; g.lineWidth=2.5; g.setLineDash([3,9]); this.path(s.pts); g.stroke(); g.setLineDash([]); }
  // arrows + start dots
  let num=1; for(const s of this.L.strokes){ if(!s.dot){ let acc=0; for(let i=1;i<s.pts.length-1;i++){ acc+=d2(s.pts[i-1],s.pts[i]); if(acc>.85&&i>4){ acc=0; const [x,yy]=this.toPx(s.pts[i]),[x2,y2]=this.toPx(s.pts[Math.min(s.pts.length-1,i+2)]); const a=Math.atan2(y2-yy,x2-x),r=Math.max(7,U*.13); g.fillStyle='rgba(112,72,232,.75)'; g.beginPath(); g.moveTo(x+Math.cos(a)*r,yy+Math.sin(a)*r); g.lineTo(x+Math.cos(a+2.4)*r,yy+Math.sin(a+2.4)*r); g.lineTo(x+Math.cos(a-2.4)*r,yy+Math.sin(a-2.4)*r); g.fill(); } } }
   const [sx,sy]=this.toPx(s.pts[0]),r=Math.max(14,U*.17); g.fillStyle='#40c057'; g.beginPath(); g.arc(sx,sy,r,0,7); g.fill(); g.fillStyle='#fff'; g.font=`700 ${Math.round(r*1.2)}px system-ui`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(String(num++),sx,sy+1); g.textAlign='start'; g.textBaseline='alphabetic'; }
  // demo
  if(this.demo&&this.demo.tip&&Math.random()<.5){ const r=this.cv.getBoundingClientRect(); FX.burst(r.left+this.demo.tip[0],r.top+this.demo.tip[1],{n:2,colors:['#b197fc','#e5dbff','#fff'],speed:2,grav:0,life:500,size:4}); }
  if(this.demo){ g.strokeStyle='#7048e8'; g.lineWidth=Math.max(6,U*.13); g.shadowColor='#b197fc'; g.shadowBlur=14; let left=this.demo.k; for(const s of this.L.strokes){ if(left<=0) break; if(s.dot){ const [x,yy]=this.toPx(s.pts[0]); g.fillStyle='#7048e8'; g.beginPath(); g.arc(x,yy,U*.1,0,7); g.fill(); left--; continue; } const n=Math.min(s.pts.length,Math.floor(left)); if(n>0){ this.path(s.pts,n); g.stroke(); this.demo.tip=this.toPx(s.pts[n-1]); } left-=s.pts.length; } g.shadowBlur=0; }
  // ink (glowing gold)
  g.lineCap='round'; g.lineJoin='round';
  for(const pass of [[Math.max(14,U*.24),'rgba(255,212,59,.35)'],[Math.max(6,U*.12),'#e9a91c'],[Math.max(2,U*.04),'#fff3bf']]){ g.strokeStyle=pass[1]; g.fillStyle=pass[1]; g.lineWidth=pass[0]; for(const s of this.strokes){ if(s.length===1){ const [x,yy]=this.toPx(s[0]); g.beginPath(); g.arc(x,yy,pass[0]*.6,0,7); g.fill(); continue; } this.path(s); g.stroke(); } }
  // sparkles
  const now=performance.now(); this.trail=this.trail.filter(t=>now-t.t<600); for(const t of this.trail){ const [x,yy]=this.toPx(t.p),k=1-(now-t.t)/600; g.fillStyle=`rgba(255,240,150,${k})`; g.beginPath(); g.arc(x+(Math.random()-.5)*10,yy-(1-k)*20,3*k+1,0,7); g.fill(); }
  if(this.trail.length&&!this.raf){ this.raf=requestAnimationFrame(()=>{this.raf=null;this.draw();}); }
 }
 playDemo(){ return new Promise(res=>{ const total=this.L.strokes.reduce((a,s)=>a+(s.dot?1:s.pts.length),0); const me={k:0}; this.demo=me; let done=false;
  const finish=()=>{ if(done) return; done=true; if(this.demo===me) this.demo=null; try{ this.draw(); }catch(e){} res(); };
  const guard=setTimeout(finish,6000); // safety net: the pad can never stay frozen
  const step=()=>{ if(this.demo!==me){ clearTimeout(guard); return finish(); } me.k+=Math.max(1,total/90); try{ this.draw(); }catch(e){ clearTimeout(guard); return finish(); } if(me.k<total+20) requestAnimationFrame(step); else { clearTimeout(guard); setTimeout(finish,500); } }; step(); }); }
 score(){ const r=scoreInk(this.text,this.strokes,'trace'); if(this.pen){ r.stars=r.score>=.86?3:r.score>=.7?2:r.score>=.5?1:0; } return r; }
}
