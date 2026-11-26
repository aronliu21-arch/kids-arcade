/* ---- parent gate ---- */
function parentGate(ok){let a,b;const m=modal2('<h2>👨 Grown-ups only</h2><p>Solve to continue:</p><p style="font-size:1.6rem;font-weight:800" id="pq"></p><input id="pa" inputmode="numeric" style="font-size:1.4rem;width:10em;text-align:center;border:3px solid #4a3426;border-radius:12px;padding:6px"><p class="note" id="pn"></p><div class="row"><button class="btn pink" id="pok">OK</button><button class="btn ghost" id="pno">Cancel</button></div>');
  const nq=()=>{a=100+Math.floor(Math.random()*900);b=10+Math.floor(Math.random()*90);m.querySelector('#pq').textContent=a+' × '+b+' = ?';m.querySelector('#pa').value='';};nq();
  m.querySelector('#pno').onclick=()=>m.remove();
  m.querySelector('#pok').onclick=()=>{if(+m.querySelector('#pa').value===a*b){m.remove();ok();}else{m.querySelector('#pn').textContent='Not quite. Here’s a new one.';nq();}};}

/* ---- the learning job ---- */
let LROW=0,LQ=null;
const optHTML=o=>typeof o==='object'?'<span class="sign">'+RB(o.zh,o.zy)+'</span>':ZT(o);
function figSVG(f){const W=300,H=Math.max(60,Math.min(200,W*f.h/f.w)),cw=W/f.w,ch=H/f.h;let g='';
  if(f.grid!=null||f.cells){const nx=f.cells||f.w,ny=f.cells?1:f.h;for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const n=j*nx+i;g+='<rect x="'+(20+i*W/nx)+'" y="'+(10+j*H/ny)+'" width="'+(W/nx)+'" height="'+(H/ny)+'" fill="'+(f.grid&&n<f.grid?'#f783ac':'#fff0f6')+'" stroke="#a61e4d" stroke-width="1.5"/>';}}
  else g='<rect x="20" y="10" width="'+W+'" height="'+H+'" fill="url(#fpat)" stroke="#a61e4d" stroke-width="3"/>';
  const lw=f.cells?f.w:f.w,lh=f.h;
  return '<svg class="lfig" viewBox="0 0 380 '+(H+44)+'"><defs><pattern id="fpat" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#fff0f6"/><circle cx="7" cy="7" r="2.2" fill="#f783ac"/></pattern></defs>'+g+
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
        if(tries<2){fb.innerHTML='<div class="lwhy">❌ Not quite. Try again!'+(hinted?'':' Need a 💡 hint?')+'</div>';if(!hinted)HB.classList.add('pulse');}
        else{done=true;box.querySelectorAll('.lo[data-j]').forEach(x=>{x.disabled=true;if(x.dataset.j==='0')x.classList.add('right');});if(!st.miss.includes(id))st.miss.push(id);cSave();
          fb.innerHTML='<div class="lwhy">💡 The answer is <b>'+optHTML(o[0])+'</b>. '+ZT(why)+'</div>';next();}}};
    box.querySelectorAll('.lo[data-j]').forEach(b=>b.onclick=()=>pick(b));
    LQ.solve=()=>box.querySelector('.lo[data-j="0"]').click();LQ.hint=()=>HB.click();};
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
function breakScreen(){LROW=0;const s=cScreen('<div class="lbreak"><div style="font-size:4rem">🌸</div><h2>Great practice, Nora! Time for a break</h2><p>Stretch, drink some water, and come back later.</p><div class="row"><button class="btn pink" id="fin">Finish for now</button></div></div>',true);
  s.querySelector('#fin').onclick=()=>{cClose();MODE='solo';showModes();};}

window.__test=Object.assign(window.__test||{},{career:()=>({money:C&&C.money,stars:C&&C.stars,lv:C&&lvOf(C.stars),badges:C&&totalBadges(),learn:C&&C.learn}),
  learn:k=>learnJob(k),hint:()=>LQ&&LQ.hint&&LQ.hint(),allHints:()=>LKEYS.map(k=>LBANK[k].map(q=>{const h=hintFor(k,q);return h?null:k+':'+q[0];})).flat().filter(Boolean),lq:()=>LQ&&{k:LQ.k,id:LQ.q&&LQ.q[0],done:!!LQ.done},solve:()=>LQ&&LQ.solve&&LQ.solve(),banks:()=>Object.fromEntries(LKEYS.map(k=>[k,LBANK[k].length]))});

