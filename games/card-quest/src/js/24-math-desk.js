/* ---------- Math desk: column sums (加減法直式) to fill in, steps for 5¢ ---------- */
const DESK_FEE=5;
function opsNow(){if(SCREEN==='cash'&&CJ)return CJ.ops||[];if(SCREEN==='battle'&&B&&B.q)return B.q.ops||[];if(SCREEN==='master')return window.__mops||[];return [];}
const opTxt=o=>{const f=v=>o.m?money(v):v;return `${f(o.a)} ${o.op==='+'?'+':'−'} ${f(o.b)}`;};
let DK=null;
function deskOpen(){audio();const ops=opsNow();padClose();
 const d=document.createElement('div');d.className='desk';d.innerHTML=`<div class="dk"><div class="dkh"><b>✏️ Math desk</b> ${zh([['直','ㄓˊ'],['式','ㄕˋ'],['計','ㄐㄧˋ'],['算','ㄙㄨㄢˋ']])}<button class="btn ghost small" id="dkx">✕ Close</button></div>
 <div id="dkops" class="row"></div><div id="dkcol"></div><p id="dkmsg" class="dkmsg"></p><div class="dkpad" id="dkpad"></div>
 <div class="row"><button class="btn green small" id="dkchk">✓ Check</button><button class="btn gold small" id="dkhelp">💡 Show me the steps (${DESK_FEE}¢)</button><button class="btn ghost small" id="dkfree">✍️ Free writing</button></div></div>`;
 document.body.appendChild(d);$('dkx').onclick=deskClose;$('dkfree').onclick=()=>{deskClose();padOpen();};
 $('dkpad').innerHTML=[1,2,3,4,5,6,7,8,9,0].map(n=>`<button class="dkd" data-n="${n}">${n}</button>`).join('')+`<button class="dkd" data-n="x">⌫</button>`;
 $('dkpad').querySelectorAll('.dkd').forEach(b=>b.onclick=()=>deskKey(b.dataset.n));
 DK={ops,i:0,el:d};
 if(!ops.length){$('dkcol').innerHTML='<p style="font-weight:800;text-align:center">This one has no adding or taking away.<br>Use ✍️ Free writing to work it out!</p>';$('dkchk').style.display='none';$('dkhelp').style.display='none';$('dkpad').style.display='none';return;}
 $('dkops').innerHTML=ops.length>1?ops.map((o,i)=>`<button class="btn small ${i?'ghost':'gold'}" data-i="${i}">Step ${i+1}: ${opTxt(o)}</button>`).join(''):'';
 $('dkops').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{$('dkops').querySelectorAll('[data-i]').forEach(x=>x.className='btn small '+(x===b?'gold':'ghost'));deskShow(+b.dataset.i);});
 $('dkchk').onclick=deskCheck;$('dkhelp').onclick=deskHelp;deskShow(0);}
function deskClose(){if(DK&&DK.el)DK.el.remove();DK=null;}
function deskShow(i){const o=DK.ops[i];DK.i=i;const res=o.op==='+'?o.a+o.b:o.a-o.b,A=String(o.a),Bs=String(o.b),R=String(res);
 const n=Math.max(A.length,Bs.length,R.length,o.m?3:1),pad=s=>s.padStart(n,' ');DK.o=o;DK.res=res;DK.n=n;DK.A=pad(A);DK.B=pad(Bs);DK.R=pad(R);DK.sel=null;DK.steps=0;
 const cols=[];for(let c=0;c<n;c++){cols.push(c);if(o.m&&c===n-3)cols.push('dot');}
 const cell=(row,c,ch)=>c==='dot'?`<div class="dkc dot">${row==='a'||row==='b'?'.':row==='r'?'<span>.</span>':''}</div>`:row==='k'?`<button class="dkc kb" data-k="${c}"></button>`:row==='r'?`<button class="dkc rb" data-r="${c}"></button>`:`<div class="dkc">${ch.trim()}</div>`;
 const grid=r=>cols.map(c=>c==='dot'?cell(r,'dot'):cell(r,c,r==='a'?DK.A[c]:r==='b'?DK.B[c]:'')).join('');
 $('dkcol').innerHTML=`<div class="dkg" style="grid-template-columns:44px repeat(${cols.length},auto)">
  <div class="dkc lbl">${o.op==='+'?'進位':'借位'}</div>${grid('k')}<div class="dkc"></div>${grid('a')}<div class="dkc op">${o.op==='+'?'+':'−'}</div>${grid('b')}<div class="dkline" style="grid-column:1/-1"></div><div class="dkc"></div>${grid('r')}</div>`;
 $('dkmsg').innerHTML=`${o.op==='+'?'<b>Adding</b> 加法':'<b>Taking away</b> 減法'}: start on the <b>right</b>. Tap a box, then a number.`;
 $('dkcol').querySelectorAll('.rb,.kb').forEach(b=>b.onclick=()=>{DK.sel=b;$('dkcol').querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');});
 const first=$('dkcol').querySelector(`.rb[data-r="${n-1}"]`);if(first){first.click();}}
function deskKey(k){const b=DK&&DK.sel;if(!b)return;sfx.pop();if(k==='x'){b.textContent='';return;}b.textContent=k;b.classList.remove('bad','good');
 if(b.classList.contains('rb')){const c=+b.dataset.r;const nx=$('dkcol').querySelector(`.rb[data-r="${c-1}"]`);if(nx)nx.click();}}
function deskCheck(){let ok=true;$('dkcol').querySelectorAll('.rb').forEach(b=>{const c=+b.dataset.r,want=DK.R[c].trim(),got=b.textContent.trim();const good=got===want||(want===''&&(got===''||got==='0'));
 if(!good)ok=false;b.classList.toggle('good',good&&got!=='');b.classList.toggle('bad',!good);});
 if(ok){sfx.good();$('dkmsg').innerHTML=`🎉 Correct! ${opTxt(DK.o)} = <b>${DK.o.m?money(DK.res):DK.res}</b>. Now pick that answer!`;FX.stamp('MATH WHIZ!','small','#69db7c');}
 else{sfx.bad();$('dkmsg').innerHTML='Some boxes are not right yet (red). Check each column from the right!';}}
function deskHelp(){const key=JSON.stringify(DK.o);S.deskPaid=S.deskPaid||[];if(!S.deskPaid.includes(key)){if(S.cents<DESK_FEE){sfx.bad();$('dkmsg').innerHTML=`You need ${DESK_FEE}¢ for help. Try it yourself, you can do it!`;return;}
  S.cents-=DESK_FEE;S.deskPaid=[key].concat(S.deskPaid).slice(0,40);save();tone(1200,.08,'square',.05);}
 $('dkhelp').textContent='Next step ▶';$('dkhelp').onclick=deskStep;deskStep();}
function deskStep(){const n=DK.n,o=DK.o;let carry=0,borrow=0,txt='';
 for(let s=0;s<=DK.steps&&s<n;s++){const c=n-1-s,da=+(DK.A[c].trim()||0),db=+(DK.B[c].trim()||0);
  if(o.op==='+'){const sum=da+db+carry;txt=`${da} + ${db}${carry?' + 1 (carried 進位)':''} = <b>${sum}</b> → write <b>${sum%10}</b>${sum>=10?', carry 1 to the next column 進位':''}`;carry=sum>=10?1:0;
   if(s===DK.steps){const k=$('dkcol').querySelector(`.kb[data-k="${c-1}"]`);if(carry&&k)k.textContent='1';}}
  else{let x=da-borrow;if(x<db){txt=x<0?`This column lent 1 and had 0, so it borrows 10 too 借位: 10 − 1 − ${db} = <b>${x+10-db}</b>`:`${x} is smaller than ${db}, so borrow 10 from the next column 借位: ${x+10} − ${db} = <b>${x+10-db}</b>`;borrow=1;const k=$('dkcol').querySelector(`.kb[data-k="${c-1}"]`);if(s===DK.steps&&k)k.textContent='−1';}
   else{txt=`${x} − ${db} = <b>${x-db}</b>${borrow?' (after lending 1)':''}`;borrow=0;}}
  if(s===DK.steps){const r=$('dkcol').querySelector(`.rb[data-r="${c}"]`);if(r){r.textContent=DK.R[c].trim();r.classList.add('good');}}}
 if(DK.steps>=n-1){$('dkmsg').innerHTML=txt+`<br>✅ So ${opTxt(o)} = <b>${o.m?money(DK.res):DK.res}</b>`;$('dkhelp').style.display='none';}
 else $('dkmsg').innerHTML=`Column ${DK.steps+1}: `+txt;DK.steps++;}
