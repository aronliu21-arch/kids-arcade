/* character meanings for the boutique signs */
const CHM={男:'boy',生:'(person)',大:'big',小:'small',綠:'green',黃:'yellow',廁:'toilet',所:'place',球:'ball',墨:'ink / dark',領:'collar',褲:'pants',泳:'swim',帽:'hat',子:'(word ending)',裙:'skirt',鞋:'shoe',襪:'sock',外:'outside',套:'cover',圍:'wrap around',巾:'cloth',手:'hand',褲:'pants',雨:'rain',傘:'umbrella',眼:'eye',鏡:'lens / mirror',項:'neck',鍊:'chain',耳:'ear',環:'ring',錶:'watch',背:'back',包:'bag',皮:'leather',帶:'strap',睡:'sleep',衣:'clothes',泳:'swim',洋:'western',裝:'outfit',靴:'boot',髮:'hair',夾:'clip',
 新:'new',品:'product',上:'up / on',市:'market',試:'try',間:'room',結:'finish',帳:'bill',出:'out',口:'opening',入:'in',請:'please',勿:'do not',觸:'touch',摸:'feel',營:'run (a shop)',業:'business',中:'in the middle of',休:'rest',息:'breath',買:'buy',一:'one',送:'give',打:'(discount)',八:'eight',折:'tenths',五:'five',半:'half',價:'price',第:'number…',二:'two',件:'piece',紅:'red',色:'color',藍:'blue',粉:'powder / light',特:'special',限:'limit',量:'amount'};
function hintFor(k,q){const id=q[0];
  if(k==='magazine'){const txt=MAGS[q[5]][1],ss=txt.match(/[^.!?]+[.!?]+["”]?/g)||[txt],key=(q[3]+' '+q[2][0]).toLowerCase().match(/[a-z’']{4,}/g)||[];
    let best=0,bi=0;ss.forEach((s,i)=>{const w=s.toLowerCase();const sc=key.filter(x=>w.includes(x)).length;if(sc>best){best=sc;bi=i;}});
    if(/mostly about|main idea|lesson|teach/i.test(q[1]))return {t:'Read the whole article again. What is EVERY sentence about? The title is a big clue.',h:null,mark:-1};
    return {t:'The answer is in the highlighted sentence. Read it slowly.',h:null,mark:bi};}
  if(k==='boutique'){const s=q[6]||null;const target=s||(typeof q[2][0]==='object'?null:null);
    if(s){const ch=[...s.zh],zy=s.zy.split(' ');let h='<div class="hchars">'+ch.map((c,i)=>'<div class="hcc">'+RB(c,zy[i]||'')+'<small>'+(CHM[c]||'')+'</small></div>').join('')+'</div>';
      const m=/打(.)折/.exec(s.zh);if(m){const n={八:8,五:5}[m[1]];h+=HV.fb(10,[[n,'#74c0fc']],'pay '+n+' of every 10 parts');}
      if(s.zh==='半價')h+=HV.fb(2,[[1,'#74c0fc']],'pay half');
      h=h.replace(/<div class="hcc">/g,'<div class="hcc" data-say>');return {t:'Look at what each character means. Tap a card to hear it.',h};}
    return {t:'Tap each card to hear it read aloud. Which one sounds like the Chinese word for what he wants?',h:'<div class="hchars">'+q[2].slice().sort(()=>Math.random()-.5).map(x=>'<div class="hcc" data-say="'+x.zh+'">'+RB(x.zh,x.zy)+'<small>🔈</small></div>').join('')+'</div>'};}
  const H=HINTS[id];if(!H)return null;
  let h=H[1]?H[1]():null;if(k==='museum'){h=null;}
  return {t:H[0],h,elim:k==='museum'};}
function sayZh(t){if(!SOUND||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='zh-TW';u.rate=.8;const v=speechSynthesis.getVoices().find(x=>/zh[-_]TW/i.test(x.lang))||speechSynthesis.getVoices().find(x=>/^zh/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}}
/* ---- skill state ---- */
function LS(k){C.learn=C.learn||{};return C.learn[k]=C.learn[k]||{seen:[],miss:[],first:0};}
function badgesOf(k){const f=LS(k).first;return BADGE.filter(t=>f>=t).length;}
function totalBadges(){return LKEYS.reduce((a,k)=>a+badgesOf(k),0);}
function capLevel(){const b=totalBadges();let i=0;LV_BADGES.forEach((n,k)=>{if(b>=n)i=k;});return i;}
function rawLv(s){let i=0;LV.forEach((l,k)=>{if(s>=l[0])i=k;});return i;}
function lvUpLines(){const L=lvOf(C.stars);let P=[];if(L>(C.lvShown||0)){C.lvShown=L;if(L===LV.length-1&&!C.top){C.top=true;P=STORY.ending;}else P=fillS(STORY.level,{l:LV[L][1]});setTimeout(()=>{confetti();sfx.win();},400);}
  else if(rawLv(C.stars)>L&&C.toldBadge!==L){C.toldBadge=L;P=STORY.needBadge;}
  if(rawLv(C.stars)<=L)C.toldBadge=null;cSave();return P;}

/* ---- second street: the Fashion District ---- */
const TOWN2=[{k:'studio',x:110,w:150,lab:'Studio',go:()=>learnJob('studio')},{k:'fabric',x:300,w:150,lab:'Fabric',go:()=>learnJob('fabric')},{k:'magazine',x:500,w:160,lab:'Magazine',go:()=>learnJob('magazine')},
  {k:'boutique',x:700,w:150,lab:'Boutique',go:()=>learnJob('boutique')},{k:'museum',x:890,w:170,lab:'Museum',go:()=>learnJob('museum')}];
const curTown=()=>C&&C.street===2?TOWN2:TOWN;
function B2(k,x){const O='stroke="#4a3426" stroke-width="3" stroke-linejoin="round"';
  if(k==='studio')return '<rect x="'+(x-62)+'" y="250" width="124" height="190" fill="#f3f0ff" '+O+'/><path d="M'+(x-70)+' 250L'+x+' 205L'+(x+70)+' 250Z" fill="#7048e8" '+O+'/><rect x="'+(x-44)+'" y="276" width="88" height="70" rx="6" fill="#fff" '+O+'/><path d="M'+(x-20)+' 334l14-40 10 26 8-14 12 28" fill="none" stroke="#1c7ed6" stroke-width="3"/><path d="M'+(x+30)+' 290l10-10 6 6-10 10z" fill="#ffd43b" '+O+'/><rect x="'+(x-15)+'" y="386" width="30" height="54" fill="#5f3dc4" '+O+'/>';
  if(k==='fabric')return '<rect x="'+(x-62)+'" y="270" width="124" height="170" fill="#e6fcf5" '+O+'/><path d="M'+(x-68)+' 290H'+(x+68)+'L'+(x+60)+' 262H'+(x-60)+'Z" fill="#0ca678" '+O+'/>'+[['#74c0fc',-38],['#74c0fc',-8],['#ffd43b',22]].map(([c,d])=>'<rect x="'+(x+d)+'" y="304" width="24" height="70" rx="4" fill="'+c+'" '+O+'/><ellipse cx="'+(x+d+12)+'" cy="304" rx="12" ry="5" fill="'+shade(c,.3)+'" '+O+'/>').join('')+'<path d="M'+(x-50)+' 384h100" stroke="#4a3426" stroke-width="3"/>'+[0,1,2,3,4,5,6,7,8,9,10].map(i=>'<path d="M'+(x-50+i*10)+' 384v'+(i%5?5:9)+'" stroke="#4a3426" stroke-width="2"/>').join('')+'<rect x="'+(x-14)+'" y="400" width="28" height="40" fill="#087f5b" '+O+'/>';
  if(k==='magazine')return '<rect x="'+(x-70)+'" y="180" width="140" height="260" fill="#e7f5ff" '+O+'/><rect x="'+(x-56)+'" y="196" width="112" height="78" fill="#fff" '+O+'/><text x="'+x+'" y="222" text-anchor="middle" font-size="18" font-weight="900" fill="#1c7ed6">STYLE</text><path d="M'+(x-44)+' 236h88M'+(x-44)+' 250h60M'+(x-44)+' 262h74" stroke="#adb5bd" stroke-width="4"/>'+'<rect x="'+(x-56)+'" y="290" width="40" height="34" rx="3" fill="#d0ebff" '+O+'/><rect x="'+(x+16)+'" y="290" width="40" height="34" rx="3" fill="#d0ebff" '+O+'/><rect x="'+(x-22)+'" y="370" width="44" height="70" fill="#1971c2" '+O+'/>';
  if(k==='boutique')return '<rect x="'+(x-60)+'" y="270" width="120" height="170" fill="#fff5f5" '+O+'/><path d="M'+(x-68)+' 300H'+(x+68)+'L'+(x+60)+' 270H'+(x-60)+'Z" fill="#e03131" '+O+'/>'+[0,1,2,3,4].map(i=>'<path d="M'+(x-56+i*26)+' 272L'+(x-46+i*26)+' 300" stroke="#ffd43b" stroke-width="7"/>').join('')+'<rect x="'+(x-34)+'" y="226" width="68" height="40" rx="6" fill="#ffd43b" '+O+'/><text x="'+x+'" y="255" text-anchor="middle" font-size="24" font-weight="900" fill="#c92a2a">服飾</text><rect x="'+(x-44)+'" y="314" width="88" height="54" rx="6" fill="#d0ebff" '+O+'/><text x="'+x+'" y="350" text-anchor="middle" font-size="26">🏷️👚</text><rect x="'+(x-15)+'" y="388" width="30" height="52" fill="#c92a2a" '+O+'/>';
  if(k==='museum')return '<path d="M'+(x-80)+' 280L'+x+' 226L'+(x+80)+' 280Z" fill="#f1f3f5" '+O+'/><rect x="'+(x-80)+'" y="280" width="160" height="14" fill="#dee2e6" '+O+'/>'+[-60,-30,0,30,60].map(d=>'<rect x="'+(x+d-8)+'" y="294" width="16" height="120" fill="#fff" '+O+'/>').join('')+'<rect x="'+(x-86)+'" y="414" width="172" height="26" fill="#dee2e6" '+O+'/><circle cx="'+x+'" cy="258" r="10" fill="#ffd43b" '+O+'/>';
  return '';}

/* ---- parent gate ---- */
function parentGate(ok){let a,b;const m=modal2('<h2>👨 Grown-ups only</h2><p>Solve to continue:</p><p style="font-size:1.6rem;font-weight:800" id="pq"></p><input id="pa" inputmode="numeric" style="font-size:1.4rem;width:10em;text-align:center;border:3px solid #4a3426;border-radius:12px;padding:6px"><p class="note" id="pn"></p><div class="row"><button class="btn pink" id="pok">OK</button><button class="btn ghost" id="pno">Cancel</button></div>');
  const nq=()=>{a=100+Math.floor(Math.random()*900);b=10+Math.floor(Math.random()*90);m.querySelector('#pq').textContent=a+' × '+b+' = ?';m.querySelector('#pa').value='';};nq();
  m.querySelector('#pno').onclick=()=>m.remove();
  m.querySelector('#pok').onclick=()=>{if(+m.querySelector('#pa').value===a*b){m.remove();ok();}else{m.querySelector('#pn').textContent='Not quite. Here’s a new one.';nq();}};}

/* ---- the learning job ---- */
let LROW=0,LQ=null;
const optHTML=o=>typeof o==='object'?'<span class="sign">'+RB(o.zh,o.zy)+'</span>':ZT(o);
function figSVG(f){const W=300,H=Math.max(60,Math.min(200,W*f.h/f.w)),cw=W/f.w,ch=H/f.h;let g='';
  if(f.grid!=null||f.cells){const nx=f.cells||f.w,ny=f.cells?1:f.h;for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const n=j*nx+i;g+='<rect x="'+(20+i*W/nx)+'" y="'+(10+j*H/ny)+'" width="'+(W/nx)+'" height="'+(H/ny)+'" fill="'+(f.grid&&n<f.grid?'#74c0fc':'#e7f5ff')+'" stroke="#1864ab" stroke-width="1.5"/>';}}
  else g='<rect x="20" y="10" width="'+W+'" height="'+H+'" fill="url(#fpat)" stroke="#1864ab" stroke-width="3"/>';
  const lw=f.cells?f.w:f.w,lh=f.h;
  return '<svg class="lfig" viewBox="0 0 380 '+(H+44)+'"><defs><pattern id="fpat" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#e7f5ff"/><circle cx="7" cy="7" r="2.2" fill="#74c0fc"/></pattern></defs>'+g+
    (f.u==='squares'?'':'<text x="'+(20+W/2)+'" y="'+(H+34)+'" text-anchor="middle" font-size="18" font-weight="800" fill="#4a3426">'+lw+' '+f.u+'</text><text x="'+(W+30)+'" y="'+(10+H/2+6)+'" font-size="18" font-weight="800" fill="#4a3426">'+lh+' '+f.u+'</text>')+'</svg>';}
function pickQs(k,n){const st=LS(k),bank=LBANK[k];let un=bank.filter(q=>!st.seen.includes(q[0])).sort(()=>Math.random()-.5);
  if(k==='magazine'&&un.length){const p=un[0][5];un=un.filter(q=>q[5]===p).sort((a,b)=>a[0]<b[0]?-1:1).concat(un.filter(q=>q[5]!==p));}
  let out=un.slice(0,n);if(out.length<n)out=out.concat(bank.filter(q=>st.miss.includes(q[0])&&!out.includes(q)).sort(()=>Math.random()-.5).slice(0,n-out.length));return out;}
function learnJob(k){const J=LJOBS[k];C.met=C.met||{};const go=()=>runLearn(k);if(!C.met['L'+k]){C.met['L'+k]=1;cSave();dlg(STORY.learn[k],go);}else go();}
function runLearn(k){try{$('toast').classList.add('hide');}catch(e){}const J=LJOBS[k],qs=pickQs(k,k==='magazine'?3:5);
  if(!qs.length){const m=modal2('<h2>'+J.e+' '+ZT(J.t)+'</h2><p style="font-size:1.2rem">🎉 You answered every question here, and you got them all right!</p><p class="note">Ask Dad for a new batch of questions.</p><div class="row"><button class="btn pink" id="ok1">OK</button></div>');m.querySelector('#ok1').onclick=()=>{m.remove();careerHub();};return;}
  const st=LS(k);let i=0,pts=0,bonus=0,firsts=0;const L=lvOf(C.stars);
  const s=cScreen('<h2>'+J.e+' '+ZT(J.t)+'</h2><div class="lhud"><span id="lDots"></span><span id="lPts">⭐ 0</span></div><div class="lbox" id="lbox"></div>');
  const box=s.querySelector('#lbox');
  const dots=()=>{s.querySelector('#lDots').innerHTML=qs.map((_,j)=>'<i class="'+(j<i?'d':j===i?'n':'')+'"></i>').join('');s.querySelector('#lPts').textContent='⭐ '+pts;};
  const show=()=>{const q=qs[i];LQ={k,q,solve:null};const [id,text,o,why,rs,pi,sign]=q;let tries=0,done=false,hinted=false;
    if(!st.seen.includes(id))st.seen.push(id);cSave();dots();
    const order=o.map((_,j)=>j).sort(()=>Math.random()-.5);
    const fig=k==='fabric'&&rs&&rs.w?figSVG(rs):'';
    const mag=k==='magazine'?'<div class="lpass"><b>📰 '+ZT(MAGS[pi][0])+'</b><p>'+ZT(MAGS[pi][1])+'</p></div>':'';
    const sg=sign?'<div class="lsign">'+RB(sign.zh,sign.zy)+'</div>':'';
    box.innerHTML=mag+sg+fig+'<div class="lq"><span>'+ZT(text)+'</span><button class="lsay" aria-label="Read aloud">🔊</button></div><div class="lhw"><button class="lhint" id="lHint">💡 Hint</button></div><div id="lhp"></div><div class="lopts'+(o.some(x=>typeof x==='object')?' signs':'')+'">'+order.map(j=>'<button class="lo" data-j="'+j+'">'+optHTML(o[j])+'</button>').join('')+'</div><div class="lfb" id="lfb"></div>';
    box.querySelector('.lsay').onclick=()=>sayEn((k==='magazine'?MAGS[pi][1]+' ':'')+text+' '+o.filter(x=>typeof x!=='object').join('. '));
    box.scrollIntoView({block:'start'});s.scrollTop=0;
    const fb=box.querySelector('#lfb');
    const HB=box.querySelector('#lHint');HB.onclick=()=>{if(hinted||done)return;hinted=true;HB.disabled=true;HB.classList.remove('pulse');tone(990,.08,'triangle',.08);const H=hintFor(k,q),P=box.querySelector('#lhp');
      if(!H){P.innerHTML='<div class="lhpan">💡 Read it again slowly and draw a picture on paper.</div>';return;}
      P.innerHTML='<div class="lhpan"><div class="lht">💡 '+ZT(H.t)+'</div>'+(H.h?'<div class="lhv">'+H.h+'</div>':'')+'<div class="lhn2">Hint answers still earn ⭐, but badges need no-hint answers.</div></div>';
      P.querySelectorAll('.hcc[data-say]').forEach(c=>c.onclick=()=>sayZh(c.dataset.say||c.textContent.replace(/[^\u4e00-\u9fff]/g,'')));
      if(H.mark!=null){const pp=box.querySelector('.lpass p');if(pp){if(H.mark<0)box.querySelector('.lpass b').classList.add('hmark');else{const ss=MAGS[pi][1].match(/[^.!?]+[.!?]+["”]?/g)||[MAGS[pi][1]];pp.innerHTML=ss.map((x,i)=>'<span'+(i===H.mark?' class="hmark"':'')+'>'+ZT(x)+'</span>').join('');}}}
      if(H.elim){const w=[...box.querySelectorAll('.lo[data-j]')].filter(x=>x.dataset.j!=='0'&&!x.disabled);if(w.length>1){const g=w[Math.floor(Math.random()*w.length)];g.disabled=true;g.classList.add('gone');}}
      try{P.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){}};
    const seeFb=()=>setTimeout(()=>{try{fb.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){}},60);const next=(extra)=>{seeFb();fb.innerHTML+=(extra||'')+'<div class="row"><button class="btn pink" id="lNext">'+(i<qs.length-1?'Next ▶':'Finish ✓')+'</button></div>';fb.querySelector('#lNext').onclick=()=>{i++;if(i<qs.length)show();else finish();};LQ.solve=()=>fb.querySelector('#lNext').click();};
    const reasonStep=()=>{const rr=rs.map((_,j)=>j).sort(()=>Math.random()-.5);
      fb.innerHTML='<div class="lwhy ok">✅ '+ZT(why)+'</div><div class="lthink">🤔 <b>Show your thinking:</b> which reason explains it best?</div><div class="lopts rs">'+rr.map(j=>'<button class="lo" data-r="'+j+'">'+ZT(rs[j])+'</button>').join('')+'</div>';
      LQ.solve=()=>fb.querySelector('[data-r="0"]').click();seeFb();
      fb.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{fb.querySelectorAll('[data-r]').forEach(x=>{x.disabled=true;if(x.dataset.r==='0')x.classList.add('right');});
        if(b.dataset.r==='0'){bonus+=2;sfx.good();toast('🧠 Great thinking! +$2');}else{b.classList.add('wrong');sfx.boing();}
        next();});};
    const pick=b=>{if(done)return;const j=+b.dataset.j;
      try{const t=v=>{const d=document.createElement('div');d.innerHTML=String(typeof optHTML==='function'?optHTML(v):v);return d.textContent.trim()};const d=document.createElement('div');d.innerHTML=String(text);window.KA&&KA.answer({q:d.textContent.trim(),qid:k+':'+id,given:t(o[j]),expected:t(o[0]),correct:j===0,tryNo:tries+1,topic:k+(hinted?' (hint used)':'')});}catch(e){}
      if(j===0){done=true;b.classList.add('right');box.querySelectorAll('.lo[data-j]').forEach(x=>x.disabled=true);sfx.good();
        const got=tries===0?2:1;pts+=got;dots();
        if(tries===0&&!hinted){firsts++;const before=badgesOf(k);st.first++;st.miss=st.miss.filter(x=>x!==id);if(badgesOf(k)>before){confetti();toast('🏅 New '+['bronze','silver','gold'][badgesOf(k)-1]+' '+ZT(J.skill)+' badge!',2600);}}
        else if(!hinted&&!st.miss.includes(id))st.miss.push(id);cSave();
        if(k==='studio'&&rs)reasonStep();else{fb.innerHTML='<div class="lwhy ok">✅ '+(tries===0?'Perfect! ':'Got it! ')+ZT(why)+'</div>';next();}}
      else{tries++;b.classList.add('wrong');b.disabled=true;sfx.boing();
        if(tries<2){fb.innerHTML='<div class="lwhy">❌ Not quite. Try again!'+(hinted?'':' Need a 💡 hint?')+'</div>';if(!hinted)setTimeout(()=>{if(!hinted&&!done)HB.click();},450);}
        else{done=true;box.querySelectorAll('.lo[data-j]').forEach(x=>{x.disabled=true;if(x.dataset.j==='0')x.classList.add('right');});if(!st.miss.includes(id))st.miss.push(id);cSave();
          fb.innerHTML='<div class="lwhy">💡 The answer is <b>'+optHTML(o[0])+'</b>. '+ZT(why)+'</div>';next();}}};
    box.querySelectorAll('.lo[data-j]').forEach(b=>b.onclick=()=>pick(b));
    LQ.solve=()=>box.querySelector('.lo[data-j="0"]').click();LQ.hint=()=>HB.click();if(SOUND)setTimeout(()=>{const b=box.querySelector('.lsay');if(b&&document.body.contains(b))b.click();},500);};
  const finish=()=>{const earn=Math.round((pts*3+bonus)*(1+.15*L));C.money+=earn;LROW++;
    const b0=C.b0==null?0:C.b0,bt=totalBadges();let P=[];if(b0<1&&bt>=1)P=P.concat(STORY.badge1);if(b0<6&&bt>=6)P=P.concat(STORY.badge6);C.b0=bt;cSave();P=P.concat(lvUpLines());
    const bn=badgesOf(k),nt=BADGE[bn],ni=LKEYS[(LKEYS.indexOf(k)+1)%LKEYS.length];sfx.win();if(pts>=qs.length*2-1)confetti();
    const s2=cScreen(cHead()+'<h2>'+J.e+' '+ZT('Shift done!')+'</h2><div class="cres">⭐ '+pts+'/'+qs.length*2+' &nbsp; 💰 +'+earn+'</div>'+
      '<div class="lbadge">'+[0,1,2].map(t=>'<span class="'+(t<bn?'on':'')+'">'+['🥉','🥈','🥇'][t]+'</span>').join('')+'<div>'+ZT(J.skill)+': '+(nt?st.first+' / '+nt+' first-try answers to the next badge':'All badges earned! 🌟')+'</div></div>'+
      '<div class="ltip">💡 <b>Try it in real life:</b> '+ZT(J.tip)+'</div>'+
      '<div class="row">'+(LROW>=3?'<button class="btn pink" id="lBreak">Next ▶</button>':'<button class="btn pink" id="lGo">Next: '+LJOBS[ni].e+' '+ZT(LJOBS[ni].t)+' ▶</button>')+'<button class="btn ghost" id="cBack">🏙️ '+ZT('Back to town')+'</button></div>');
    s2.querySelector('#cBack').onclick=careerHub;
    const g=s2.querySelector('#lGo');if(g)g.onclick=()=>learnJob(ni);
    const br=s2.querySelector('#lBreak');if(br)br.onclick=breakScreen;
    if(P.length)setTimeout(()=>dlg(P),500);LQ={k,done:true};};
  show();}
