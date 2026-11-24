/* ---------- mystery Card Master ---------- */
const MNAMES=['Master Kenji','Captain Orion','Old Sage Bo','Ranger Tao','Wizard Felix'];
function masterChance(){return S.masterMet===0&&S.acts>=2?1:.22;}
function maybeMaster(then){if(then===undefined){if(Math.random()>=masterChance())return;then=hub;}
 S.masterMet++;save();sfx.magic();const nm=pick(MNAMES);
 const R0=makeQ(),q=R0.q,ans=R0.ans,opts=R0.opts,why=R0.why,extraHTML=R0.extra;window.__mops=R0.ops||[];
 setScreen('master',`<div class="hub"><div class="panel" style="text-align:center;background:#f3f0ff"><div class="av" style="margin:0 auto;width:110px">${MASTER}<span class="badge" style="background:#5f3dc4">${nm}</span></div>
 <h2 class="h" style="margin-top:14px">✨ A mystery Card Master appears!</h2>${zh([['神','ㄕㄣˊ'],['秘','ㄇㄧˋ'],['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['大','ㄉㄚˋ'],['師','ㄕ']])}
 <p style="font-size:1.15rem;font-weight:700">“Solve my riddle and I will give you a card, young Lucas.”</p><p style="font-size:1.2rem;font-weight:700;background:#fff;border:3px solid var(--ink);border-radius:14px;padding:8px 12px;max-width:560px;margin:6px auto">${q}</p>${extraHTML}<div class="opts" id="mo">${opts.map(o=>`<button class="btn" data-a="o" data-v="${o}">${o}</button>`).join('')}</div>${(R0.ops&&R0.ops.length)?'<button class="btn ghost small wio" onclick="deskOpen()">✏️ Work it out</button>':''}<p id="mm" style="font-weight:800;min-height:1.3em"></p></div></div>`);
 say('A mystery Card Master appears! '+q.replace(/<[^>]+>/g,'').replace(/▢/g,'blank'));
 let tries=0;window.__mans=ans;
 const gift=(good)=>{const c=prizeCard(good?[['promo',4],['legend',3],['holo',3]]:[['holo',7],['legend',3]]);
  setTimeout(()=>bigReveal(c,'✨ A gift from '+nm+'!',good?'“You solved my riddle. Take this special card!”':'“Keep practicing. This card will help you!”',then),900);};
 bindAll({o(v,b){if(tries<0)return;if(String(v)===String(ans)){qScore(tries===0);tries===0?S.stars+=2:S.stars+=1;save();sfx.good();b.classList.add('green');$('mm').textContent='“Well done!”';tries=-1;gift(true);}
  else{tries++;sfx.bad();b.disabled=true;if(tries>=2){qScore(false);$('mm').innerHTML='The answer is <b>'+ans+'</b>. '+why;tries=-1;gift(false);}else $('mm').textContent='“Hmm, think again…”';}}});}

