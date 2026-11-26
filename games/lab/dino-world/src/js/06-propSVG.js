// a story beat: characters placed left→right (x fraction, size, face-left), plus a prop
function propSVG(kind,x,W,H,state,u){const g=H*.9;let o='';
 if(kind==='grass'){const h=u*(state==='hide'?.8:state==='peek'?.36:.15);for(let k=-6;k<=6;k++){const bx=x+k*u*.05,c=k%2?'#2b8a3e':'#40c057';o+=`<path d="M${bx-u*.04} ${g+4} Q${bx+k*2} ${g-h*.6} ${bx+k*3} ${g-h*(.8+((k*7+13)%5)*.06)} Q${bx+4} ${g-h*.5} ${bx+u*.04} ${g+4}Z" fill="${c}" ${ST} stroke-width="2"/>`;}}
 if(kind==='bridge'){const x0=W*.36,x1=W*.74;o+=`<rect x="${x0-10}" y="${g-6}" width="${x1-x0+20}" height="${u*.2}" fill="#339af0" ${ST}/><path d="M${x0} ${g-6} Q${(x0+x1)/2} ${g-u*.14} ${x1} ${g-6}" stroke="#8b5a2b" stroke-width="${u*.05}" fill="none"/>`;
  for(let k=0;k<=10;k++){const px=x0+(x1-x0)*k/10,py=g-6-Math.sin(Math.PI*k/10)*u*.11;o+=`<rect x="${px-5}" y="${py-6}" width="10" height="12" rx="2" fill="#c08552" ${ST} stroke-width="1.5"/>`;}}
 if(kind==='snow'){const s2=state==='open'?.45:1;o+=`<ellipse cx="${x}" cy="${g}" rx="${u*.7*s2}" ry="${u*.6*s2}" fill="#fff" ${ST}/><ellipse cx="${x-u*.22*s2}" cy="${g-u*.25*s2}" rx="${u*.22*s2}" ry="${u*.09*s2}" fill="#e7f5ff"/>`;}
 if(kind==='rocks'){const h=u*(state==='peek'?.5:1),w=u*.9;o+=`<path d="M${x-w} ${g+4} L${x-w*.8} ${g-h*.7} L${x-w*.3} ${g-h} L${x+w*.25} ${g-h*.8} L${x+w*.75} ${g-h*.9} L${x+w} ${g+4}Z" fill="#868e96" ${ST} stroke-width="3"/><path d="M${x-w*.5} ${g-h*.5} l${w*.2} -${h*.12} M${x+w*.3} ${g-h*.4} l${w*.15} ${h*.1}" stroke="#495057" stroke-width="3" fill="none"/>`;}
 if(kind==='egg'){const ey=g-u*.2;if(state==='open'){o+=crayon([[x-u*.16,g-u*.14],[x-u*.1,g-u*.2],[x-u*.04,g-u*.13],[x+u*.03,g-u*.2],[x+u*.09,g-u*.13],[x+u*.16,g-u*.2],[x+u*.15,g],[x-u*.15,g]],'#fff3bf')+crayon([[x+u*.22,g-u*.05],[x+u*.38,g-u*.08],[x+u*.32,g+2]],'#fff3bf',1.8);}
  else{o+=crayon(ellPts(x,ey,u*.15,u*.2),'#fff3bf')+`<ellipse cx="${x-u*.05}" cy="${ey-u*.06}" rx="${u*.03}" ry="${u*.02}" fill="#a9e34b"/><ellipse cx="${x+u*.05}" cy="${ey+u*.05}" rx="${u*.025}" ry="${u*.02}" fill="#a9e34b"/>`;
   if(state==='roll')o+=`<path d="M${x-u*.32} ${ey-u*.08}h${u*.12}M${x-u*.36} ${ey+u*.02}h${u*.14}M${x-u*.3} ${ey+u*.12}h${u*.1}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
   if(state==='crack')o+=`<path d="M${x-u*.12} ${ey-u*.02} l${u*.05} -${u*.04} l${u*.05} ${u*.05} l${u*.05} -${u*.05} l${u*.05} ${u*.04}" stroke="${INK}" stroke-width="2.4" fill="none"/>`;}}
 if(kind==='reeds'){o+=propSVG('grass',x,W,H,state,u);for(let k=-4;k<=4;k+=2){const h=u*(state==='hide'?.86:state==='peek'?.42:.2);o+=`<ellipse cx="${x+k*u*.05+k*3}" cy="${g-h}" rx="4" ry="10" fill="#8b5a2b" stroke="${INK}" stroke-width="1.4"/>`;}}
 if(kind==='fireflies')for(let k=0;k<12;k++){const fx=(k*173+40)%W,fy=H*.15+((k*89)%(H*.6));o+=`<circle cx="${fx}" cy="${fy}" r="7" fill="#ffe066" opacity=".35"/><circle cx="${fx}" cy="${fy}" r="3" fill="#fff9db"/>`;}
 if(kind==='chest'){const w=u*.42,h=u*.26;o+=crayon(subdiv([[x-w/2,g-h],[x+w/2,g-h],[x+w/2,g],[x-w/2,g]],2),'#c08552');
  if(state==='open')o+=crayon(subdiv([[x-w/2,g-h],[x+w/2,g-h],[x+w/2-6,g-h*2],[x-w/2+6,g-h*2]],2),'#a9714b',2)+crayon(subdiv([[x-w*.3,g-h*1.75],[x+w*.3,g-h*1.75],[x+w*.3,g-h*1.05],[x-w*.3,g-h*1.05]],2),'#fff9db',1.8)+`<text x="${x}" y="${g-h*1.2}" text-anchor="middle" font-size="${h*.55}">🥚</text><text x="${x+w*.55}" y="${g-h*1.6}" font-size="${h*.6}">✨</text>`;
  else o+=crayon(subdiv([[x-w/2,g-h],[x+w/2,g-h],[x+w/2,g-h*1.35],[x-w/2,g-h*1.35]],2),'#a9714b',2)+`<rect x="${x-6}" y="${g-h*1.1}" width="12" height="12" rx="2" fill="#ffd43b" ${ST} stroke-width="1.6"/>`;}
 if(kind==='party'){const n=14;let pts=`M${W*.03} ${H*.08}`;for(let k=0;k<=n;k++){const fx=W*.03+(W*.94)*k/n;o+=k<n?`<path d="M${fx} ${H*.08+Math.sin(k/n*Math.PI)*H*.05} l${W*.94/n/2} ${H*.07} l${W*.94/n/2} -${H*.07+(Math.sin((k+1)/n*Math.PI)-Math.sin(k/n*Math.PI))*-H*.05}" fill="${['#ff6b6b','#ffd43b','#4dabf7','#69db7c','#b197fc'][k%5]}" ${ST} stroke-width="1.5"/>`:'';}
  o+=crayon(subdiv([[x-u*.22,g-u*.25],[x+u*.22,g-u*.25],[x+u*.22,g],[x-u*.22,g]],2),'#ffc9c9')+crayon(subdiv([[x-u*.22,g-u*.25],[x+u*.22,g-u*.25],[x+u*.22,g-u*.32],[x-u*.22,g-u*.32]],2),'#fff',1.8)+[-1,0,1].map(k=>`<path d="M${x+k*u*.1} ${g-u*.32}v-${u*.1}" stroke="#4dabf7" stroke-width="4"/><circle cx="${x+k*u*.1}" cy="${g-u*.44}" r="4" fill="#ffa94d"/>`).join('');}
 if(kind==='bush')o+=hideObj('bush',x,g+2,u*.8);
 if(kind==='tree')o+=hideObj('tree',x,g+2,u*1.1);
 return o;}
// name tag under a story character (everyone, not just the dino Milo built)
let TAGS=[],TAGW=1000;
function nameTagSVG(k,cx,y){const c=CAST[k];if(!c)return '';const small=TAGW<560;
 const t=k==='goal'?(c.name||''):c.nm?(S.voice==='en'||small&&S.voice!=='zh'?c.nm[0]:S.voice==='zh'?c.nm[1]:`${c.nm[0]} ${c.nm[1]}`):'';if(!t)return '';
 const fs=small?11:13,w=[...t].reduce((a,ch)=>a+(/[一-鿿]/.test(ch)?fs+1:fs*.62),0)+14;let x=cx-w/2;
 for(let n=0;n<4&&TAGS.some(r=>x<r[0]+r[2]+4&&x+w>r[0]-4&&Math.abs(y-r[1])<22);n++)y-=24;TAGS.push([x,y,w]);
 return `<g><rect x="${x}" y="${y}" width="${w}" height="${fs+8}" rx="7" fill="#fff" ${ST} stroke-width="2"/><text x="${cx}" y="${y+fs+2}" text-anchor="middle" font-size="${fs}" font-weight="900" fill="#4a3426">${t}</text></g>`;}
function viewSVG(v,spk,W,H){TAGS=[];TAGW=W;const base=Math.min(H*.55,W*.3);let o='';const pr=v.prop;
 if(pr&&pr[0]==='bridge')o+=propSVG('bridge',W*pr[1],W,H,pr[2],base);
 (v.back||[]).forEach(q=>{o+=propSVG(q[0],W*q[1],W,H,q[2],base);});
 v.items.forEach(([k,xf,sc,left])=>{const c=CAST[k];if(!c)return;const sz=base*sc/100;const x=W*xf-50*sz;const fly=TPL[c.t].fly;const y=(fly?H*.55:H*.9)-80*sz;
  o+=`<g transform="translate(${left?x+100*sz:x},${y}) scale(${left?-sz:sz},${sz})"><g class="${k===spk?'talk':''}">${dinoSVG(c.t,c.c)}</g></g>`;
  if(!v.notags)o+=nameTagSVG(k,W*xf,Math.min(H-30,(fly?H*.55:H*.9)-2));});
 if(pr&&pr[0]!=='bridge')o+=propSVG(pr[0],W*pr[1],W,H,pr[2],base);
 (v.props||[]).forEach(q=>{o+=propSVG(q[0],W*q[1],W,H,q[2],base);});
 if(v.hearts)for(let k=0;k<5;k++)o+=`<text x="${W*(.3+k*.1)}" y="${H*(.18+(k%2)*.08)}" font-size="${Math.min(W,H)*.08}">❤️</text>`;
 return o;}
/* ---------- intro ---------- */
$('introZh').innerHTML=zh('洛明的恐龍世界');$('startZh').innerHTML=zh('點我開始');
$('zZoo').innerHTML=zh('我的動物園');$('zBuild').innerHTML=zh('蓋恐龍');$('zBuild2').innerHTML=zh('蓋恐龍');$('zFeed').querySelector('small').innerHTML=zh('餵寶寶');$('zTrain').innerHTML=zh('故事書');
(function introArt(){const T=pieces('rex');const cols=['green','orange','blue','purple','purple'];let o='';
 T.forEach((p,k)=>{o+=`<g class="fall" style="animation-delay:${k*.35}s">${brick(p.s,p.g,COL[cols[k]][0])}</g>`;});
 o+=`<g class="fall" style="animation-delay:${T.length*.35}s"><circle cx="76" cy="12" r="4.6" fill="#fff" ${ST}/><circle cx="77" cy="12" r="2.3" fill="#4a3426"/><path d="M70 22h12" stroke="#4a3426" stroke-width="2" stroke-linecap="round"/></g>`;
 $('introSvg').innerHTML=o;})();
let introTimer=null;
$('start').onclick=()=>{ac();musicOn();say("Welcome to Milo's Dino World!",'歡迎來到洛明的恐龍世界!');
 const s=$('introSvg');s.innerHTML=s.innerHTML;$('start').style.visibility='hidden';
 introTimer=setTimeout(afterIntro,REDUCED?300:2600);};
$('intro').addEventListener('click',e=>{if(introTimer&&!e.target.closest('#start'))afterIntro();});
function afterIntro(){clearTimeout(introTimer);introTimer=null;$('start').style.visibility='';
 if(!S.seen.open){S.seen.open=1;save();show('map');scene('volcano',['pip'],OPENING,()=>{goMap();});}else goMap();}

/* ---------- parent gate + reset ---------- */
$('resetBtn').onclick=e=>{e.stopPropagation();gate();};
function gate(){const a=100+rnd(900),b=10+rnd(90);const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<div><h2>Grown-ups only</h2><p style="font-size:1.2rem;font-weight:800">${a} × ${b} = ?</p><input id="gAns" inputmode="numeric" style="font:inherit;font-size:1.4rem;width:160px;text-align:center;border:3px solid var(--ink);border-radius:12px;padding:6px"><div class="acts" style="margin-top:12px"><button class="btn" id="gOk">OK</button><button class="btn ghost" id="gNo">Cancel</button></div></div>`;
 $('modalRoot').appendChild(m);m.querySelector('#gAns').focus();m.querySelector('#gNo').onclick=()=>m.remove();
 m.querySelector('#gOk').onclick=()=>{if(+m.querySelector('#gAns').value===a*b){m.remove();resetPick();}else{m.remove();toast('Not quite — try a new one');gate();}};}
function levelPanel(){const m=document.createElement('div');m.className='modal';
 const draw=()=>{m.innerHTML=`<div><h2>Skill levels (this device)</h2><p style="margin:0 0 8px">Levels still go up after 4 right in a row (once per puzzle) and down after 2 misses.</p>${Object.keys(LVNAME).map(t=>`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:52px;border-bottom:1px dashed #e0d2b8"><b>${LVNAME[t][0]} · ${LVNAME[t][1]}</b><span style="display:flex;align-items:center;gap:8px"><button class="btn ghost" data-t="${t}" data-d="-1" style="min-height:44px;padding:0 14px">−</button><b style="min-width:52px;text-align:center">${LV(t)} / ${LVMAX[t]}</b><button class="btn ghost" data-t="${t}" data-d="1" style="min-height:44px;padding:0 14px">+</button></span></div>`).join('')}<div class="acts" style="margin-top:12px"><button class="btn ghost" id="lvAll">All to level 1</button><button class="btn" id="lvDone">Done</button></div></div>`;
  m.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{const t=b.dataset.t;S.lv[t]=Math.max(1,Math.min(LVMAX[t],LV(t)+ +b.dataset.d));S.ls[t]={ok:0,bad:0};save();draw();});
  m.querySelector('#lvAll').onclick=()=>{S.lv=Object.assign({},LVDEF);S.ls={};save();draw();};m.querySelector('#lvDone').onclick=()=>m.remove();};
 draw();$('modalRoot').appendChild(m);}
function voicePanel(){const m=document.createElement('div');m.className='modal';
 const draw=()=>{const vs=zhVoices(),cur=voiceFor('zh-TW');m.innerHTML=`<div><h2>Chinese voice (this device)</h2><p style="margin:0 0 8px">Tap a voice to hear it. Missing one? Download it in the device's Spoken Content settings, then reopen the game.</p><div style="max-height:52vh;overflow:auto">${vs.length?vs.map((v,i)=>`<button class="btn ${cur&&v.voiceURI===cur.voiceURI?'green':'ghost'}" data-i="${i}" style="display:block;width:100%;margin:6px 0;min-height:52px;text-align:left">${cur&&v.voiceURI===cur.voiceURI?'✓ ':''}${v.name} <small>(${v.lang})</small></button>`).join(''):'<p>No Chinese voices on this device yet.</p>'}</div><div class="acts" style="margin-top:12px"><button class="btn ghost" id="voAuto">Auto (best)</button><button class="btn" id="voDone">Done</button></div></div>`;
  m.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const v=vs[+b.dataset.i];try{localStorage.setItem(ZHPICK,v.voiceURI);}catch(e){}delete vcache['zh-TW'];sayParts([['小恐龍,我們一起去冒險吧!','zh-TW']]);voiceNote();draw();});
  m.querySelector('#voAuto').onclick=()=>{try{localStorage.removeItem(ZHPICK);}catch(e){}delete vcache['zh-TW'];voiceNote();draw();};m.querySelector('#voDone').onclick=()=>m.remove();};
 draw();$('modalRoot').appendChild(m);}
function resetPick(){const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<div><h2>Reset records on this device</h2><p>Story progress, bricks, snacks, dinos and settings for:</p>${Object.keys(KIDS).map(k=>`<label style="display:flex;gap:10px;align-items:center;justify-content:center;font-size:1.2rem;font-weight:800;min-height:48px"><input type="checkbox" value="${k}" style="width:26px;height:26px"> ${KIDS[k]}</label>`).join('')}<div class="acts" style="margin-top:10px"><button class="btn orange" id="rGo">Reset</button><button class="btn ghost" id="rNo">Cancel</button></div><hr style="margin:14px 0;border:0;border-top:2px dashed #e0d2b8"><button class="btn" id="rLv">⭐ Change skill levels</button> <button class="btn" id="rVo">🗣 Chinese voice</button></div>`;
 $('modalRoot').appendChild(m);m.querySelector('#rNo').onclick=()=>m.remove();m.querySelector('#rLv').onclick=()=>{m.remove();levelPanel();};m.querySelector('#rVo').onclick=()=>{m.remove();voicePanel();};
 m.querySelector('#rGo').onclick=()=>{const ks=[...m.querySelectorAll('input:checked')].map(i=>i.value);ks.forEach(k=>{try{localStorage.removeItem(skey(k));localStorage.removeItem('dinoworld.v1.'+k);sessionStorage.removeItem('dinoworld.streak.'+k);}catch(e){}});if(ks.includes(KID)){S=fresh();setSnd();setLang();showWallet();}m.remove();toast(ks.length?'Reset done':'Nothing picked');};}

