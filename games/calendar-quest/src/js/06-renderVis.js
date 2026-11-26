/* ---------- visuals: clock, calendar page, tear-off leaves, week strip ---------- */
function renderVis(v,q,isHint){
  const box=$('visual');
  if(!isHint)$('stage').classList.toggle('flow',!(v.k==='clock'||q.set));
  if(v.k==='clock'||q.set){box.innerHTML='<canvas id="clock"></canvas>';clockState=q.set?clockState:{t:((v.h%12)*60+v.m),on:false,ticks:!!v.ticks||cur.id!=='milo',big:v.big};bindClock();fitClock();return;}
  if(isHint&&box.querySelector('.hintbox'))return;
  let html='';
  if(v.k==='emoji')html='<div class="vis-emoji">'+v.e+'</div>'+(v.cap?'<div class="vis-cap">'+v.cap+(v.zh?'<br>'+RB(v.zh[0],v.zh[1]):'')+'</div>':'');
  else if(v.k==='zh')html='<div class="vis-zh">'+v.h+'</div>';
  else if(v.k==='week')html='<div class="week">'+DAYS.map((d,i)=>'<span class="'+(i===v.on?'on':'')+'">'+d+'</span>').join('')+'</div>';
  else if(v.k==='cal')html=calPage(v.y,v.m,v.today,v.marks||[]);
  else if(v.k==='leaf')html='<div class="tear">'+leaf(v.a,'Today')+(v.b?'<div class="vis-emoji" style="font-size:2.6rem">'+(v.e||'➡️')+'</div>'+leaf(v.b,''):'')+'</div>';
  if(isHint)box.insertAdjacentHTML('beforeend','<div class="hintbox">'+html+'</div>');else box.innerHTML=html;
}
function leaf(d,label){return '<div class="leaf"><div class="lm">'+MON[d.getMonth()]+' '+d.getFullYear()+'</div><div class="ld">'+d.getDate()+'</div><div class="lw">'+(label?label+' · ':'')+DAYS[d.getDay()]+'</div></div>';}
function calPage(y,m,today,marks){
  const first=new Date(y,m-1,1).getDay(),n=new Date(y,m,0).getDate();let h='<div class="calpage"><div class="ch">'+MON[m-1]+' '+y+' · '+zhMonth(m)+'</div><table><tr>'+['S','M','T','W','T','F','S'].map(x=>'<th>'+x+'</th>').join('')+'</tr><tr>';
  for(let i=0;i<first;i++)h+='<td></td>';
  for(let d=1;d<=n;d++){if((first+d-1)%7===0&&d>1)h+='</tr><tr>';h+='<td class="'+(d===today?'today ':'')+(marks.indexOf(d)>=0?'mark':'')+'">'+d+'</td>';}
  return h+'</tr></table></div>';
}
let clockState={t:0,on:false};
function fitClock(){
  const cv=$('clock');if(!cv)return;const box=$('visual'),r=box.getBoundingClientRect();
  const s=Math.max(120,Math.min(r.width,r.height-4,520)),dpr=window.devicePixelRatio||1;
  cv.style.width=s+'px';cv.style.height=s+'px';cv.width=s*dpr;cv.height=s*dpr;drawClock();
}
function drawClock(){
  const cv=$('clock');if(!cv)return;const c=cv.getContext('2d'),S=cv.width,R=S/2-6,cx=S/2,cy=S/2,O='#1a1a1a';
  c.clearRect(0,0,S,S);
  c.fillStyle='#fffaf0';c.strokeStyle=O;c.lineWidth=R*.06;c.beginPath();c.arc(cx,cy,R*.95,0,6.283);c.fill();c.stroke();
  if(clockState.ticks)for(let i=0;i<60;i++){const a=i/60*6.283,l=i%5?R*.05:R*.1;c.strokeStyle=O;c.lineWidth=i%5?R*.012:R*.025;c.beginPath();c.moveTo(cx+Math.sin(a)*(R*.88),cy-Math.cos(a)*(R*.88));c.lineTo(cx+Math.sin(a)*(R*.88-l),cy-Math.cos(a)*(R*.88-l));c.stroke();}
  c.textAlign='center';c.textBaseline='middle';c.fillStyle=O;
  for(let i=1;i<=12;i++){const a=i/12*6.283,rr=R*(clockState.big?.66:.7);c.font='700 '+Math.round(R*(clockState.big?.2:.16))+'px Fredoka,system-ui,sans-serif';c.fillText(i,cx+Math.sin(a)*rr,cy-Math.cos(a)*rr+R*.01);}
  if(cur&&cur.id==='nora'&&clockState.ticks)for(let i=1;i<=12;i++){const a=i/12*6.283;c.font='500 '+Math.round(R*.065)+'px Fredoka,system-ui,sans-serif';c.fillStyle='#8a94a8';c.fillText(i*5%60,cx+Math.sin(a)*R*1.0*.98,cy-Math.cos(a)*R*.98);}
  const t=clockState.t,ma=(t%60)/60*6.283,ha=(t%720)/720*6.283;
  const hand=(a,len,w,col)=>{c.lineCap='round';c.strokeStyle=O;c.lineWidth=w+R*.03;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(a)*len,cy-Math.cos(a)*len);c.stroke();c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(a)*len,cy-Math.cos(a)*len);c.stroke();};
  hand(ha,R*.48,R*.075,'#e03131');hand(ma,R*.78,R*.045,'#1c7ed6');
  c.fillStyle=O;c.beginPath();c.arc(cx,cy,R*.06,0,6.283);c.fill();
  if(clockState.on&&!answered){c.font='600 '+Math.round(R*.07)+'px Fredoka,system-ui,sans-serif';c.fillStyle='#56657e';c.fillText('drag the hands',cx,cy+R*.3);}
}
function bindClock(){
  const cv=$('clock');if(!cv)return;
  const ang=e=>{const r=cv.getBoundingClientRect();return Math.atan2(e.clientX-r.left-r.width/2,-(e.clientY-r.top-r.height/2));};
  cv.onpointerdown=e=>{if(!clockState.on||answered)return;cv.setPointerCapture(e.pointerId);const a=ang(e),r=cv.getBoundingClientRect(),
      dist=Math.hypot(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)/(r.width/2);
    const t=clockState.t,ma=(t%60)/60*6.283,ha=(t%720)/720*6.283,df=(x,y)=>Math.abs(Math.atan2(Math.sin(x-y),Math.cos(x-y)));
    clockState.drag={hand:(df(a,ha)+.25<df(a,ma)||(dist<.55&&df(a,ha)<.6))?'h':'m',last:a};};
  cv.onpointermove=e=>{const d=clockState.drag;if(!d)return;const a=ang(e);
    if(d.hand==='m'){let da=a-d.last;da=Math.atan2(Math.sin(da),Math.cos(da));clockState.t+=da/6.283*60;}
    else{let target=((a+6.283)%6.283)/6.283*720,cur0=clockState.t%720;let diff=target-cur0;if(diff>360)diff-=720;if(diff<-360)diff+=720;clockState.t+=diff;}
    d.last=a;clockState.t=(clockState.t%720+720)%720;drawClock();};
  cv.onpointerup=cv.onpointercancel=()=>{if(!clockState.drag)return;clockState.drag=null;clockState.t=(Math.round(clockState.t/5)*5+720)%720;sfx.tick();drawClock();};
}
function nudge(d){if(answered)return;clockState.t=((Math.round(clockState.t/5)*5+d)%720+720)%720;sfx.tick();drawClock();}
function checkSet(){
  if(answered)return;const q=qs[qi],want=((q.set.h%12)*60+q.set.m),got=Math.round(clockState.t)%720;
  window._kaGiven=(Math.floor(got/60)||12)+':'+String(got%60).padStart(2,'0');
  if(got===want){win();drawClock();}
  else{const gh=Math.floor(got/60)||12,gm=got%60;
    miss(()=>{clockState.t=want;clockState.on=false;drawClock();});
    if(!answered)$('coachText').innerHTML='Your clock says <b>'+dig(gh,gm)+'</b>. '+$('coachText').innerHTML;}
}
window.addEventListener('resize',()=>{fitClock();fitIntro();fitBuddy();});
