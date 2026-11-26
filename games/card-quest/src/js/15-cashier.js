/* ---------- cashier job (making change) ---------- */
function makeDrag(el,o){el.classList.add('drag');el.addEventListener('pointerdown',e=>{e.preventDefault();audio();el.setPointerCapture(e.pointerId);
 const r=el.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top,g=el.cloneNode(true);
 g.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:30;pointer-events:none;transform:scale(1.1);margin:0;box-shadow:0 8px 14px rgba(0,0,0,.3)`;document.body.appendChild(g);
 const mv=ev=>{g.style.left=(ev.clientX-dx)+'px';g.style.top=(ev.clientY-dy)+'px';o.move&&o.move(g,ev.clientX,ev.clientY);};
 const up=ev=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);g.remove();o.drop&&o.drop(el,ev.clientX,ev.clientY);};
 el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);});}
const hit=(el,x,y)=>{const r=el.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};
const CO=[['b',100,'dollar'],['q',25,'quarter'],['d',10,'dime'],['n',5,'nickel'],['p',1,'penny']];
let CJ=null;
function coinEl(k){const c=CO.find(x=>x[0]===k),d=document.createElement('div');d.className='coin '+k;d.innerHTML=(k==='b'?'$1':c[1]+'¢')+'<small>'+c[2]+'</small>';d._v=c[1];return d;}
function cashier(own){
 CJ={own,jar:0,n:0,earn:0,tries:0,price:0,pay:0,item:null,sold:0,walk:0,tips:0,total:own?3+(S.up&&S.up.sign?1:0):3};
 setScreen('cash',`<div class="m"><div class="counter"><div class="jar" id="jar">${jarSVG(0)}<b id="jart">0¢</b></div><div style="font-weight:800">${own?'🏪 '+ME.shop:'🧾 Cashier job'} · customer <span id="cn">1</span>/${CJ.total}</div><div class="av" id="cav" style="width:90px"></div><div class="bub" id="bub"></div><div class="mini-item" id="it"></div><div class="paid" id="paid"></div><button class="btn ghost small wio" onclick="deskOpen()">✏️ Work it out</button></div>
 <div class="tray"><h3>Change tray · tap a coin to take it back</h3><div id="change"></div><button class="btn" id="give">Give change 🤲</button></div>
 <div class="reg" id="reg"><b>Drag coins →</b></div></div>`);
 CO.forEach(([k])=>{const src=coinEl(k);$('reg').appendChild(src);makeDrag(src,{move:(el,x,y)=>$('change').classList.toggle('glow',hit($('change'),x,y)),drop:(el,x,y)=>{$('change').classList.remove('glow');if(hit($('change'),x,y))addCoin(k);}});});
 $('give').onclick=giveChange;nextCust();}
function addCoin(k){const n=coinEl(k);n.onclick=()=>{n.remove();sfx.pop();};$('change').appendChild(n);sfx.coin();}
const trayTotal=()=>[...$('change').children].reduce((a,d)=>a+d._v,0);
function nextCust(){padClear();padClose();$('change').innerHTML='';CJ.tries=0;const f=pick(FOES);CJ.who=f[0];$('cav').innerHTML=kidSVG(f[1],f[2]);$('cn').textContent=CJ.n+1;$('give').disabled=false;
 if(CJ.own){if(!S.stock.length)return shiftDone();const si=Math.floor(Math.random()*S.stock.length),it=S.stock[si],c=byId(it.id),lim=fair(c)*(S.up.case?1.5:1.3);
  CJ.si=si;CJ.item=c;CJ.price=it.price;CJ.pay=Math.ceil((it.price+1)/100)*100;CJ.ops=[{a:CJ.pay,op:'-',b:CJ.price,m:true}];$('it').innerHTML=cardHTML(c);
  if(it.price>lim){$('give').disabled=true;CJ.walk++;$('bub').innerHTML=`${f[0]}: “<b>${c.name}</b> for <b>${money(it.price)}</b>? That’s way too expensive! 😤”`;$('paid').innerHTML='<b style="color:#e03131">He walks out without buying.</b>';
   sfx.bad();say(f[0]+' says that is way too expensive, and walks out.');setTimeout(()=>{if(++CJ.n>=CJ.total)shiftDone();else nextCust();},2600);return;}
  const deal=it.price<=fair(c)*.8;$('bub').innerHTML=`${f[0]}: “I’ll buy your <b>${c.name}</b>! It’s <b>${money(it.price)}</b>.${deal?' What a deal! 🤩':''}”`;
  $('paid').innerHTML=`He pays: <div class="bill">${money(CJ.pay)} = ${CJ.pay}¢</div>`;say(f[0]+' buys '+c.name+' for '+money(it.price).replace('$','')+' dollars. He pays '+CJ.pay/100+' dollars. Drag his change into the tray.');return;}
 S.cSeen=S.cSeen||[];const L=qLv(),c=pick(C);let kind,p1,p2,key;CJ.item=c;
 for(let i=0;i<40;i++){kind=rollR(L===1?[['one',4],['two',4],['five',2]]:[['one',1],['two',4],['five',5]]);
  if(kind==='one'){CJ.price=pick([15,20,30,35,40,45,55,60,65,70,80,85,90]);CJ.pay=CJ.price>50?100:pick([50,100]);}
  else if(kind==='two'){p1=pick([25,30,35,40,45,55,60,65,70,80]);p2=pick([15,20,25,35,45,55,65,75,85]);CJ.price=p1+p2;CJ.pay=Math.ceil((CJ.price+1)/100)*100;}
  else{CJ.price=ri(23,96)*5;CJ.pay=500;}
  key=kind+CJ.price+'/'+CJ.pay+(kind==='two'?':'+p1:'');if(!S.cSeen.includes(key))break;}
 S.cSeen=[key].concat(S.cSeen).slice(0,80);save();CJ.ops=kind==='two'?[{a:p1,op:'+',b:p2},{a:CJ.pay,op:'-',b:CJ.price,m:CJ.pay>=100}]:[{a:CJ.pay,op:'-',b:CJ.price,m:CJ.pay>=100}];CJ.wage={one:35,two:45,five:50}[kind];$('it').innerHTML=cardHTML(c);
 if(kind==='one')$('bub').innerHTML=`${f[0]}: “I’d like <b>${c.name}</b>. It’s <b>${CJ.price}¢</b>.”`;
 else if(kind==='two'){const sl=pick(['card sleeves','a card box','a sticker pack','a playmat']);$('bub').innerHTML=`${f[0]}: “I’d like <b>${c.name}</b> for <b>${p1}¢</b> and ${sl} for <b>${p2}¢</b>.”<br><small>Add them up first!</small>`;}
 else $('bub').innerHTML=`${f[0]}: “I’d like <b>${c.name}</b>. It’s <b>${money(CJ.price)}</b>.”`;
 const pd=CJ.pay===500?'<div class="bill">$5 bill</div>':CJ.pay===200?'<div class="bill">$1</div><div class="bill">$1</div>':CJ.pay===100?'<div class="bill">$1 = 100¢</div>':'<div class="coin q">25¢</div><div class="coin q">25¢</div>';
 $('paid').innerHTML='He pays: '+pd;
 say(f[0]+' '+$('bub').textContent.replace(/^[^:]*:/,'').replace(/[“”]/g,'').replace('Add them up first!','')+'. He pays '+(CJ.pay>=100?CJ.pay/100+' dollars':CJ.pay+' cents')+'. Drag his change into the tray.');}
function shopSell(first){const music=S.up.music&&Math.random()<.35,tip=(music||(first&&Math.random()<.3))?pick([5,10,15,25]):0;S.stock.splice(CJ.si,1);CJ.sold++;CJ.tips+=tip;CJ.earn+=CJ.price+tip;S.cents+=CJ.price+tip;save();
 jarAdd(CJ.price,false);if(tip)setTimeout(()=>giveTip(tip,music?'🎵 I love the music!':'You’re fast and right!'),1100);}
