/* ---------- holiday calendar explorer ---------- */
let calFilter='all',calSel=null,calFrom='home';
function openCal(from){calFrom=from;TODAY=day0(new Date());renderCal();show('cal');}
$('calBtn').onclick=()=>openCal('home');$('calBtn2').onclick=()=>openCal('map');
function renderCal(){
  $('todayTx').textContent='Today is '+fmtLong(TODAY);
  const F=[['all','All'],['us','US'],['tw','Taiwan'],['world','World'],['fun','Fun days']];
  $('calChips').innerHTML='';F.forEach(([id,l])=>{const b=document.createElement('button');b.className='chip';b.textContent=l;b.setAttribute('aria-pressed',String(calFilter===id));b.onclick=()=>{calFilter=id;renderCal();};$('calChips').appendChild(b);});
  const vis=H.filter(h=>calFilter==='all'||h.g===calFilter);
  const up=upcoming(TODAY,400).filter(x=>vis.indexOf(x.h)>=0).slice(0,4);
  $('soon').innerHTML='';up.forEach(x=>{const n=daysBetween(TODAY,x.d),b=document.createElement('button');
    b.innerHTML=x.h.e+' '+x.h.n+' · <b>'+(n===0?'today!':n===1?'tomorrow':'in '+n+' days')+'</b>';b.onclick=()=>{calSel=x.h.id;renderCal();};$('soon').appendChild(b);});
  const det=calSel&&HID[calSel];
  if(det){const nd=nextDate(det,TODAY),n=nd?daysBetween(TODAY,nd):null;
    $('detail').innerHTML='<div class="dcard"><div class="de">'+det.e+'</div><div style="min-width:0;flex:1"><div class="dt">'+det.n+(det.zh?' '+RB(det.zh[0],det.zh[1]):'')+'</div>'+
      '<div class="dw">'+whenTxt(det)+(nd?' · next: '+fmtLong(nd)+(n===0?' (today!)':' ('+n+' days)'):'')+'</div><p><b>'+det.s+'.</b> '+det.f+'</p></div><button class="ico" id="calSay" aria-label="Read aloud">🔈</button></div>';
    $('calSay').onclick=()=>{const was=cur;cur=cur||KID.lucas;const p=prof(cur.id),v=p.voice;p.voice=true;say(det.n+'. '+whenTxt(det)+'. '+det.s+'. '+det.f);p.voice=v;cur=was;};
  }else $('detail').innerHTML='<p class="note" style="margin:0 0 6px">Tap a picture to learn about that day.</p>';
  $('months').innerHTML='';
  for(let m=1;m<=12;m++){const d=document.createElement('div');d.className='mon'+(m===TODAY.getMonth()+1?' now':'');
    d.innerHTML='<div class="mh"><span>'+MON[m-1]+'</span><span>'+zhMonth(m)+'</span></div><div class="hs"></div>';
    vis.filter(h=>holMonth(h)===m).forEach(h=>{const b=document.createElement('button');b.className='hb';b.textContent=h.e;b.title=h.n;b.setAttribute('aria-label',h.n);b.setAttribute('aria-pressed',String(calSel===h.id));
      b.onclick=()=>{calSel=h.id;renderCal();window.scrollTo&&$('detail').scrollIntoView({block:'nearest',behavior:'smooth'});};d.querySelector('.hs').appendChild(b);});
    $('months').appendChild(d);}
}

/* ---------- parent gate + reset ---------- */
let gateAns=0;
function newGate(){const a=rint(102,989),b=rint(12,98);gateAns=a*b;$('gateQ').textContent=' What is '+a+' × '+b+'?';$('gateA').value='';}
$('resetBtn').onclick=()=>{newGate();$('resetStep1').hidden=false;$('resetStep2').hidden=true;$('gateErr').textContent='';$('resetBox').hidden=false;$('gateA').focus();};
$('gateCancel').onclick=$('rsCancel').onclick=()=>{$('resetBox').hidden=true;};
$('gateGo').onclick=()=>{if(parseInt($('gateA').value.replace(/[^0-9]/g,''),10)===gateAns){$('resetStep1').hidden=true;$('resetStep2').hidden=false;['nora','lucas','milo'].forEach(id=>$('rs-'+id).checked=false);$('rsErr').textContent='';}
  else{$('gateErr').textContent='That’s not right. Here’s a new one.';newGate();}};
$('gateA').onkeydown=e=>{if(e.key==='Enter')$('gateGo').click();};
$('rsGo').onclick=()=>{const ids=['nora','lucas','milo'].filter(id=>$('rs-'+id).checked);if(!ids.length){$('rsErr').textContent='Pick at least one kid.';return;}
  ids.forEach(id=>{DB.p[id]={stars:{},seen:[],voice:id!=='nora',rev:Date.now()};streaks[id]=0;});store.save();$('resetBox').hidden=true;renderHome();};
