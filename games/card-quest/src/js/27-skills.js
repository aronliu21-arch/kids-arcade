/* ---------- Learning path: skills, per-skill levels, practice ---------- */
const SKILLS=[
 {k:'addsub',e:'➕',n:'Add & Subtract',z:[['加','ㄐㄧㄚ'],['減','ㄐㄧㄢˇ']],q:['packsLeft','missing','together','sumHP','damage','hitsKO']},
 {k:'times',e:'✖️',n:'Times & Share',z:[['乘','ㄔㄥˊ'],['除','ㄔㄨˊ']],q:['share','legs','fraction']},
 {k:'money',e:'💰',n:'Money',z:[['錢','ㄑㄧㄢˊ']],q:['change','coins']},
 {k:'time',e:'⏰',n:'Time & Days',z:[['時','ㄕˊ'],['間','ㄐㄧㄢ']],q:['clock','calendar']},
 {k:'numbers',e:'🔢',n:'Numbers',z:[['數','ㄕㄨˋ'],['字','ㄗˋ']],q:['placeValue','digit','compare']},
 {k:'puzzles',e:'🧩',n:'Puzzles & Clues',z:[['謎','ㄇㄧˊ'],['題','ㄊㄧˊ']],q:['pattern','notInTable','whoAmI','weakness','inspect']}];
const skillOf=kind=>(SKILLS.find(s=>s.q.includes(kind))||{k:kind}).k;
const LVN=['Starter','🥉 Bronze','🥈 Silver','🥇 Gold'],LVAT=[0,5,15,30];
function skRec(k){S.sk=S.sk||{};return S.sk[k]=S.sk[k]||{n:0,ok:0,r:[]};}
/* level = how many first-try right answers, but drops back while recent answers are mostly wrong */
function skLevel(k){const s=skRec(k);let lv=LVAT.filter(x=>s.ok>=x).length-1;const rec=s.r.slice(-6);if(rec.length>=5&&rec.filter(Boolean).length<=2)lv=Math.max(0,lv-1);return lv;}
const skDiff=k=>Math.min(3,(ME.g?2:1)+skLevel(k));
/* every answered question goes through here: first = right on the first try */
function track(kind,first,qtext,ans){const k=skillOf(kind),s=skRec(k),before=LVAT.filter(x=>s.ok>=x).length-1;
 s.n++;if(first)s.ok++;s.r=s.r.concat(first?1:0).slice(-10);
 if(!first&&qtext){S.miss=[{k,q:String(qtext).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,160),a:String(ans),t:Date.now()}].concat(S.miss||[]).slice(0,40);}
 const after=LVAT.filter(x=>s.ok>=x).length-1;save();
 if(after>before&&after>0){const sk=SKILLS.find(x=>x.k===k);S.cents+=100;save();setTimeout(()=>{FX.stamp(LVN[after].split(' ')[1].toUpperCase()+'!','small','#ffd43b');toast(`🎓 ${sk?sk.e+' '+sk.n:k}: you reached <b>${LVN[after]}</b>! +$1.00`,2800);sfx.win();},400);}}
function skillPath(){const tot=SKILLS.reduce((a,s)=>a+skLevel(s.k),0);
 setScreen('skills',`<div class="hub"><div class="panel"><h2 class="h">🎓 Skill Path ${zh([['學','ㄒㄩㄝˊ'],['習','ㄒㄧˊ'],['之','ㄓ'],['路','ㄌㄨˋ']])}</h2>
 <p style="text-align:center;font-weight:700">Answer right on the first try to fill your bar. Each new medal gives you <b>$1.00</b>! (${tot}/${SKILLS.length*3} medals)</p>
 <div class="sklist">${SKILLS.map(sk=>{const s=skRec(sk.k),lv=skLevel(sk.k),nxt=LVAT[Math.min(3,lv+1)],pct=lv>=3?100:Math.min(100,(s.ok-LVAT[lv])/(nxt-LVAT[lv])*100),acc=s.n?Math.round(s.ok/s.n*100):0;
  return `<div class="skrow lv${lv}"><span class="ske">${sk.e}</span><div class="skt"><b>${sk.n}</b>${zh(sk.z)}<div class="medals">${[1,2,3].map(i=>`<span class="${i<=lv?'on':''}">${['','🥉','🥈','🥇'][i]}</span>`).join('')}</div><div class="bar"><i style="width:${pct}%"></i></div><small>${lv>=3?'Gold! You are a master.':`${Math.max(0,nxt-s.ok)} more to ${LVN[lv+1]}`}${s.n?` · ${acc}% first try`:''}</small></div><button class="btn small gold" data-a="pr" data-v="${sk.k}">Practice ▶</button></div>`;}).join('')}</div>
 <div class="tip" style="text-align:left">💡 Practice pays <b>5¢</b> for each first-try answer. Jobs pay more, but practice makes your weakest skill stronger!</div>
 <div class="row"><button class="btn ghost" data-a="qb">📜 Quest Book</button><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({pr:k=>practice(k,0,0),qb:()=>questBook(),home:()=>hub()});}
/* practice: 5 questions from one skill, two tries each */
function practice(k,i,earn){const sk=SKILLS.find(s=>s.k===k);if(i>=5){return result('practice',`🎓 ${sk.e} Practice done!`,`<div class="big">📚</div><p style="font-size:1.2rem;font-weight:800">You earned ${money(earn)}</p><p>${sk.n}: <b>${LVN[skLevel(k)]}</b></p>`,'Practicing a little every day makes your brain stronger, just like training for soccer.');}
 const R0=makeQ({only:sk.q});window.__mops=R0.ops||[];window.__mans=R0.ans;let tries=0;
 setScreen('practice',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">${sk.e} ${sk.n} ${zh(sk.z)}</h2><div class="sdots">${[0,1,2,3,4].map(j=>`<i class="${j<i?'done':j===i?'on':''}"></i>`).join('')}</div>
 <p class="pq">${R0.q}</p>${R0.extra||''}<div class="opts">${R0.opts.map(o=>`<button class="btn" data-a="o" data-v="${o}">${o}</button>`).join('')}</div>${(R0.ops&&R0.ops.length)?'<button class="btn ghost small wio" onclick="deskOpen()">✏️ Work it out</button>':''}
 <p id="pm" style="font-weight:800;min-height:1.3em"></p><div class="row"><button class="btn ghost small" data-a="home">🏠 Stop</button></div></div></div>`);
 const next=ms=>setTimeout(()=>{if(SCREEN==='practice')practice(k,i+1,earn);},ms);
 kaShown();
 bindAll({home:()=>skillPath(),o(v,b){if(tries<0)return;kaAns(R0.q,v,R0.ans,String(v)===String(R0.ans),tries+1,skName(R0.kind));if(String(v)===String(R0.ans)){const ft=tries===0;qScore(ft);S.stars+=ft?2:1;if(ft){S.cents+=5;earn+=5;}save();sfx.good();b.classList.add('green');$('pm').textContent=ft?'Right! +5¢':'Right on the second try!';tries=-1;next(1100);}
  else{tries++;sfx.bad();b.disabled=true;if(tries>=2){qScore(false);$('pm').innerHTML='The answer is <b>'+R0.ans+'</b>. '+R0.why;main.querySelector(`[data-a=o][data-v="${R0.ans}"]`).classList.add('green');tries=-1;next(2600);}else $('pm').textContent='Not quite. Try again!';}}});}
/* shared arcade progress tracker (weekly report): one row per tap */
const kaTxt=v=>String(v==null?'':v).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
function kaAns(q,given,expected,ok,tryNo,topic,qid){try{if(window.KA){KA.setKid(KID);KA.answer({q:kaTxt(q),qid:qid?kaTxt(qid):undefined,given:kaTxt(given),expected:kaTxt(expected),correct:!!ok,tryNo:tryNo||1,topic:topic||''});}}catch(e){}}
function kaShown(){try{if(window.KA){KA.setKid(KID);KA.shown();}}catch(e){}}
const skName=kind=>{const s=SKILLS.find(x=>x.q.includes(kind));return s?s.n:kind;};
