function openBooth(msg){$('#booth').classList.remove('playing');closeSign();if(!S.profile)return;const k=S.profile,body=$('#boothBody');$('#boothTitle').textContent='Zoo games';Q=null;
  const lead=msg||'Play a game to earn zoo tickets. Right the first time: 2 tickets. Right the second time: 1 ticket.';
  body.innerHTML='<p class="lead">'+esc(lead)+'</p><div class="games">'+QB.ORDER[k].map(g=>{const G=QB.GAMES[g];return '<button class="gpick" data-g="'+g+'"><span class="em">'+G.em+'</span><b>'+MNAME[MECH[g]||'balloons']+'</b><span>'+esc(G.title)+': '+esc(G.blurb)+'</span></button>';}).join('')+
    '</div>'+(ON_SITE?'<p class="snote">Stars you win in 遊戲間 missions turn into zoo tickets too: every star is '+COST.star+' tickets.</p>':'')+'<p class="snote">Tickets are for drawing animals: each new animal costs '+COST.draw+' tickets. Building and food use zoo coins, which visitors pay when they come to see your animals and shops.</p>';
  body.querySelectorAll('.gpick').forEach(b=>b.onclick=()=>{SFX.tap();startRound(b.dataset.g);});
  $('#booth').hidden=false;speak(lead);}
function startRound(g){const G=QB.GAMES[g];let qs=[];try{qs=G.make(G.n,S.profile);}catch(e){qs=[];}
  if(!qs.length){toast("Those questions didn't load. Pick another game");return;}Q={g,qs,i:0,tries:0,earned:0,done:false,hero:heroPick()};save();renderQ();}
function renderQ(){window.KA&&KA.shown();$('#booth').classList.add('playing');const q=Q.qs[Q.i],G=QB.GAMES[Q.g],k=S.profile;Q.tries=0;Q.done=false;const body=$('#boothBody');const m=MECH[Q.g]||'balloons';$('#boothTitle').textContent=MNAME[m]+' · '+G.title;
  body.innerHTML='<div class="quiz arena m-'+m+(k==='milo'?' milo':'')+'"><div class="qtop"><div class="qdots">'+Q.qs.map((_,i)=>'<i class="'+(i<Q.i?'on':i===Q.i?'cur':'')+'"></i>').join('')+'</div>'+(q.say?'<button class="hear" id="qHear" aria-label="Hear it again">🔊</button>':'')+'<span class="pill sm" id="qTk">'+icon('ticket')+'<span>'+tickets()+'</span></span></div>'+
    '<div class="qbox">'+(q.lvl?'<div class="qlvl">'+esc(q.lvl)+'</div>':'')+q.prompt+'</div><div class="afield">'+fieldHTML(m,q.choices)+
    '</div><div class="qfb" id="qfb">'+(k==='milo'?'':'Tap the right answer.')+'</div></div>';
  body.querySelectorAll('.qc').forEach(b=>b.onclick=()=>pickAns(+b.dataset.i,b));body.scrollTop=0;
  const hb=$('#qHear');if(hb)hb.onclick=()=>{SFX.tap();speak(q.say,true,q.lang);};
  if(body.querySelector('.bowlWrap'))feedBowl(body,q);
  if(q.say)speak(q.say,false,q.lang);}
function feedBowl(body,q){const st=wireBowl(body.querySelector('.afield'),n=>{if(Q.done)return;const bs=[...body.querySelectorAll('.qc')];
  let i=q.choices.findIndex(c=>String(c.val)===String(n));if(i<0||bs[i].classList.contains('dead'))i=bs.findIndex((b,j)=>String(q.choices[j].val)!==String(q.answer)&&!b.classList.contains('dead'));if(i<0)return;
  pickAns(i,bs[i]);if(String(q.choices[i].val)===String(q.answer)){st.gobble(body.querySelector('.afield .hero'));}
  else if(Q.done){st.show(+q.answer);st.locked=true;}else setTimeout(st.reset,500);});}
function rightIndex(q){return q.choices.findIndex(x=>String(x.val)===String(q.answer));}
function pickAns(i,btn){if(!Q||Q.done)return;const q=Q.qs[Q.i],c=q.choices[i];if(!c||btn.classList.contains('dead'))return;const k=S.profile,fb=$('#qfb'),body=$('#boothBody');
  try{const t=v=>{const d=document.createElement('div');d.innerHTML=String(v==null?'':v);return d.textContent.trim()};const ri=rightIndex(q),cc=q.choices[ri];window.KA&&(KA.setKid(k),KA.answer({q:t(q.prompt),qid:q.id,given:t(c.label!=null?c.label:(c.txt!=null?c.txt:c.val)),expected:t(cc&&(cc.label!=null?cc.label:(cc.txt!=null?cc.txt:cc.val))),correct:String(c.val)===String(q.answer),tryNo:Q.tries+1,topic:QB.GAMES[Q.g]&&QB.GAMES[Q.g].title}));}catch(e){}
  if(String(c.val)===String(q.answer)){Q.done=true;const got=Q.tries===0?2:1;Q.earned+=got;earn(got);btn.classList.add('right');mechFx(btn,true);SFX.place();
    if(k==='nora'){const sd=S.seen.nora[Q.g]=S.seen.nora[Q.g]||[];if(!sd.includes(q.id))sd.push(q.id);save();}
    fb.className='qfb good';fb.innerHTML='<span class="grow"><b>Yes! +'+got+' ticket'+(got>1?'s':'')+'</b> '+esc(q.final||'')+'</span><button class="next" id="qNext">Next</button>';
    speak(got>1?'Yes! Two tickets!':'Yes! One ticket!');}
  else{Q.tries++;btn.classList.add('dead');mechFx(btn,false);SFX.nope();const ri=rightIndex(q),rb=body.querySelector('.qc[data-i="'+ri+'"]');
    if(Q.tries<2){const hint=(k!=='nora'&&q.hint)?q.hint:'';fb.className='qfb bad';fb.innerHTML='<span class="grow"><b>Not quite. Try again!</b> '+esc(hint)+'</span>';speak('Not quite. Try again! '+hint);
      if(k==='milo'&&rb)rb.classList.add('pulse');}
    else{Q.done=true;if(rb){rb.classList.remove('pulse');rb.classList.add('reveal');}body.querySelectorAll('.qc').forEach(b=>{if(b!==rb)b.classList.add('dead');});
      fb.className='qfb';fb.innerHTML='<span class="grow"><b>Here is the answer.</b> '+esc(q.why||'')+'</span><button class="next" id="qNext">Next</button>';speak('Here is the answer. '+(q.why||''));}}
  const nx=$('#qNext');if(nx)nx.onclick=()=>{SFX.tap();Q.i++;if(Q.i>=Q.qs.length)roundDone();else renderQ();};}
function roundDone(){$('#booth').classList.remove('playing');chain++;const G=QB.GAMES[Q.g],k=S.profile,body=$('#boothBody'),ord=QB.ORDER[k],nx=ord[(ord.indexOf(Q.g)+1)%ord.length];SFX.poof();
  if(chain>=3){$('#boothTitle').textContent='Break time';body.innerHTML='<div class="result"><div class="big">'+icon('ticket')+'+'+Q.earned+'</div><h3>Great practice! Time for a break</h3><p class="tip"><b>Real-life tip:</b> '+esc(G.tip)+'</p><button class="next" id="qFin">Finish for now</button></div>';
    $('#qFin').onclick=closeBooth;speak('Great practice! Time for a break.');return;}
  $('#boothTitle').textContent=G.cheer||'Round done';
  body.innerHTML='<div class="result"><div class="big">'+icon('ticket')+'+'+Q.earned+'</div><p>You have '+tickets()+' tickets now.</p><p class="tip"><b>Real-life tip:</b> '+esc(G.tip)+'</p><div class="row"><button class="next" id="qNx">Next: '+esc(QB.GAMES[nx].title)+' ▶</button><button class="btnLine" id="qZoo">Back to the zoo</button></div></div>';
  $('#qNx').onclick=()=>{SFX.tap();startRound(nx);};$('#qZoo').onclick=closeBooth;speak('You earned '+Q.earned+' tickets!');}
const HUBKEY='liu-league-v1';
function syncHub(){let H=null;try{H=JSON.parse(localStorage.getItem(HUBKEY));}catch(e){}if(!H||!H.kids)return;S.hubClaimed=S.hubClaimed||{};let mine=0;
  ['nora','lucas','milo'].forEach(k=>{const e=(H.kids[k]&&H.kids[k].earned)||0;let c=S.hubClaimed[k]||0;if(e<c)c=e;if(e>c){const add=(e-c)*COST.star;S.tickets[k]=(S.tickets[k]||0)+add;if(k===S.profile)mine+=add;}S.hubClaimed[k]=e;});
  save();hud();if(mine){toast('+'+mine+' tickets from 遊戲間 stars!');}}
addEventListener('focus',syncHub);document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncHub();});
const ON_SITE=(function(){try{return window.top===window&&/^https?:/.test(location.protocol);}catch(e){return false;}})();
function closeBooth(){$('#booth').hidden=true;Q=null;chain=0;try{speechSynthesis.cancel();}catch(e){}}
$('#boothClose').onclick=closeBooth;

/* ---------- animal sounds ---------- */
const SOUNDS=[['roar','Roar'],['squeak','Squeak'],['moo','Moo'],['tweet','Tweet'],['honk','Honk'],['purr','Purr'],['hoot','Hoot'],['boing','Boing']];
const VOICES=[['normal','Normal',1,1],['squeaky','Squeaky',2,1.25],['deep','Deep',.1,.8],['slow','Slow',.9,.6]];
function synth(id,size){audio();if(!AC)return;const t=AC.currentTime,p=clamp(1.5-(size||1)*.45,.6,1.4);
  const sw=(type,f0,f1,dur,vol,when,lp)=>{const o=AC.createOscillator(),g=AC.createGain(),w=t+(when||0);o.type=type;o.frequency.setValueAtTime(f0,w);o.frequency.exponentialRampToValueAtTime(f1,w+dur);
    g.gain.setValueAtTime(.0001,w);g.gain.exponentialRampToValueAtTime(vol,w+.04);g.gain.exponentialRampToValueAtTime(.0001,w+dur);let n=o;if(lp){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;o.connect(f);n=f;}n.connect(g);g.connect(master);o.start(w);o.stop(w+dur+.05);};
  if(id==='roar'){sw('sawtooth',170*p,65*p,1,.35,0,900);noise(.8,.2,300);}
  else if(id==='squeak'){sw('sine',1300*p,2300*p,.13,.2);sw('sine',1500*p,2600*p,.12,.18,.17);}
  else if(id==='moo'){sw('sawtooth',150*p,105*p,1.1,.3,0,650);}
  else if(id==='tweet'){for(let i=0;i<3;i++)sw('sine',2400*p,3600*p,.08,.15,i*.13);}
  else if(id==='honk'){sw('square',340*p,300*p,.25,.12,0,1800);sw('square',340*p,290*p,.32,.12,.32,1800);}
  else if(id==='purr'){for(let i=0;i<14;i++)setTimeout(()=>noise(.06,.22,140*p),i*55);}
  else if(id==='hoot'){sw('sine',430*p,380*p,.3,.25);sw('sine',430*p,350*p,.5,.25,.42);}
  else sw('sine',150*p,620*p,.42,.3);}
function sayAs(text,voice){try{const v=VOICES.find(x=>x[0]===voice)||VOICES[0];const u=new SpeechSynthesisUtterance(text);u.pitch=v[2];u.rate=v[3];speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}}
function defaultSound(a){return {kind:'synth',id:SOUNDS[(a.id||0)%SOUNDS.length][0]};}
function playSpec(s,size){if(!S.sound)return;audio();
  if(s.kind==='clip'&&s.data){try{const au=new Audio(s.data);const pr=au.play();if(pr&&pr.catch)pr.catch(()=>synth('boing',size));}catch(e){synth('boing',size);}return;}
  if(s.kind==='say'&&s.text){sayAs(s.text,s.voice);return;}synth(s.id||'squeak',size);}
function playSound(c){playSpec(c.a.sound||defaultSound(c.a),c.inf?c.inf.height:1);}
function soundEditor(el,init){const st=Object.assign({kind:'synth',id:'squeak',text:'',voice:'normal',data:null},init||{});
  const draw=()=>{el.innerHTML='<div class="snd"><div class="chips">'+SOUNDS.map(s=>'<button class="chip'+(st.kind==='synth'&&st.id===s[0]?' sel':'')+'" data-s="'+s[0]+'">'+s[1]+'</button>').join('')+
      '<button class="chip'+(st.kind==='say'?' sel':'')+'" data-k="say">Say words</button><button class="chip'+(st.kind==='clip'?' sel':'')+'" data-k="clip">Record my voice</button></div>'+
      (st.kind==='say'?'<input type="text" class="sayIn" maxlength="60" placeholder="Hi, I love bananas!" value="'+esc(st.text||'')+'" aria-label="Words to say"><div class="chips">'+VOICES.map(v=>'<button class="chip'+(st.voice===v[0]?' sel':'')+'" data-v="'+v[0]+'">'+v[1]+' voice</button>').join('')+'</div>':'')+
      (st.kind==='clip'?(canRec()?'<button class="chip rec'+(recOn?' on':'')+'">'+(recOn?'Stop':'Record')+'</button><p class="snote">'+(recOn?'Recording… make the animal sound now!':(st.data?'Got it! Tap Hear it, or Record again.':'Tap Record and make the sound. It stops by itself after 5 seconds.'))+'</p>':'')+
        '<label class="chip fileBtn">'+icon('upload')+(st.data?'Use a different file':'Pick a sound file')+'<input type="file" accept="audio/*" hidden class="clipIn"></label><p class="err clipErr">'+(recMsg||'')+'</p>':'')+
      '<button class="chip play">'+icon('sound')+'Hear it</button></div>';
    el.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{st.kind='synth';st.id=b.dataset.s;draw();playSpec(st,1);});
    el.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{st.kind=b.dataset.k;SFX.tap();draw();});
    el.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{st.voice=b.dataset.v;draw();playSpec(st,1);});
    const si=el.querySelector('.sayIn');if(si)si.oninput=()=>{st.text=si.value;};
    const ci=el.querySelector('.clipIn');if(ci)ci.onchange=()=>{const f=ci.files&&ci.files[0];if(!f)return;const er=el.querySelector('.clipErr');
      if(f.size>900000){er.textContent='That recording is too long. Keep it under 10 seconds.';return;}
      const r=new FileReader();r.onload=()=>{st.data=r.result;draw();playSpec(st,1);};r.onerror=()=>{er.textContent="Couldn't read that file. Try another one.";};r.readAsDataURL(f);};
    const rb=el.querySelector('.rec');if(rb)rb.onclick=()=>{if(recOn){stopRec();return;}startRec(d=>{st.data=d;draw();playSpec(st,1);},draw);};
    el.querySelector('.play').onclick=()=>playSpec(st,1);};
  draw();
  return {get:()=>{const o={kind:st.kind,id:st.id,voice:st.voice,text:(st.text||'').trim()};if(st.kind==='clip'){if(st.data)o.data=st.data;else o.kind='synth';}if(st.kind==='say'&&!o.text)o.kind='synth';return o;}};}
let sndEd=null,sndFor=null,revealSnd=null;
/* live recording (works when the game runs as a normal website; Claude's viewer blocks the microphone) */
let recOn=false,recMsg='',recObj=null,recTimer=null;
function canRec(){return !!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);}
async function startRec(done,redraw){recMsg='';let stream;
  try{stream=await navigator.mediaDevices.getUserMedia({audio:true});}catch(e){recMsg='The microphone is blocked here. Open the zoo website to record, or pick a sound file.';redraw();return;}
  try{const chunks=[];const mr=new MediaRecorder(stream);recObj=mr;mr.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
    mr.onstop=()=>{stream.getTracks().forEach(t=>t.stop());recOn=false;clearTimeout(recTimer);const blob=new Blob(chunks,{type:mr.mimeType||'audio/mp4'});
      if(blob.size>900000){recMsg='That was too long. Try a shorter sound.';redraw();return;}
      const r=new FileReader();r.onload=()=>done(r.result);r.readAsDataURL(blob);};
    mr.start();recOn=true;SFX.tap();redraw();recTimer=setTimeout(stopRec,5000);}
  catch(e){stream.getTracks().forEach(t=>t.stop());recMsg="Recording isn't supported in this browser. Pick a sound file instead.";redraw();}}
