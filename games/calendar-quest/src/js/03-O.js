
/* Each question: {id, q, vis, o:[correct, ...wrong], why, hint}. Options are {t, s (small line), e (picture)}. */
const O=(t,s,e)=>({t:String(t),s:s,e:e});
function uniqOpts(correct,pool,n){
  const out=[correct],seen={};seen[correct.t]=1;
  for(const p of shuffle(pool)){if(out.length>=n)break;if(!seen[p.t]){seen[p.t]=1;out.push(p);}}
  return out;
}
const dig=(h,m)=>h+':'+pad(m);
function tWords(h,m){
  const nx=h%12+1;
  if(m===0)return h+" o'clock";
  if(m===30)return 'half past '+h;
  if(m===15)return 'quarter past '+h;
  if(m===45)return 'quarter to '+nx;
  return m<30?m+' minutes past '+h:(60-m)+' minutes to '+nx;
}
const addMin=(h,m,k)=>{let t=((h%12)*60+m+k)%720;if(t<0)t+=720;let hh=Math.floor(t/60);return [hh===0?12:hh,t%60];};

/* ---------- clock reading ---------- */
function clockBank(kid){
  const out=[];
  if(kid.id==='milo'){
    for(let h=1;h<=12;h++){let w=h;while(w===h)w=rint(1,12);
      out.push({id:'mc:'+h,q:"What time is it? Look at the short hand.",vis:{k:'clock',h:h,m:0,big:true},o:[O(h+" o'clock"),O(w+" o'clock")],why:"The short hand points to "+h+". It's "+h+" o'clock!"});}
    return out;
  }
  if(kid.id==='lucas'){
    for(let h=1;h<=12;h++)for(const m of [0,30,0,30,15,45]){
      const [h2]=addMin(h,0,60),pool=[O(dig(h2,m),tWords(h2,m))];
      if(m>=30){const[hb]=addMin(h,0,-60);pool.push(O(dig(hb,m),tWords(hb,m)));} // hour-hand mix-up
      pool.push(O(dig(h,(m+30)%60),tWords(h,(m+30)%60)));
      if(m!==0)pool.push(O(dig(h,0),tWords(h,0)));
      const mh=m/5||12;if(mh!==h)pool.push(O(dig(mh,h*5%60),tWords(mh,h*5%60)));
      out.push({id:'lc:'+h+':'+m,q:'What time does the clock show?',vis:{k:'clock',h:h,m:m},o:uniqOpts(O(dig(h,m),tWords(h,m)),pool,3),
        why:'The short hand shows the hour and the long hand shows the minutes. It’s '+tWords(h,m)+'.',
        hint:m===0?'The long hand is on the 12. That means o’clock.':m===30?'The long hand is on the 6. That means half past.':'Long hand on the 3 is quarter past. On the 9 is quarter to.'});
    }
    return out;
  }
  // Nora
  for(let h=1;h<=12;h++)for(let m=5;m<60;m+=5){
    const pool=[O(dig(h,(m+5)%60)),O(dig(h,(m+55)%60)),O(dig(h,m/5))];
    const [h2]=addMin(h,0,m>=30?60:-60);pool.push(O(dig(h2,m)));
    out.push({id:'nc:'+h+':'+m,q:'What time does the clock show?',vis:{k:'clock',h:h,m:m,ticks:true},o:uniqOpts(O(dig(h,m),tWords(h,m)),pool,4),
      why:'Count by 5s from the 12 to the long hand: '+m+' minutes. The short hand is past the '+h+'. It’s '+dig(h,m)+'.'});
  }
  for(let i=0;i<40;i++){
    const h=rint(1,12),m=rint(1,59);if(m%5===0)continue;
    out.push({id:'nx:'+h+':'+m,q:'Exact time! What does the clock show?',vis:{k:'clock',h:h,m:m,ticks:true},
      o:uniqOpts(O(dig(h,m)),[O(dig(h,(m+1)%60)),O(dig(h,(m+59)%60)),O(dig(h,(m+5)%60)),O(dig(addMin(h,0,60)[0],m))],4),
      why:'Count the little ticks from the last 5. It’s '+dig(h,m)+'.'});
  }
  const events=[['Soccer practice',45],['The movie',90],['Piano lessons',30],['The car ride to Grandma’s',75],['The math contest',60],['Swim class',40]];
  for(const [ev,len] of events)for(let k=0;k<6;k++){
    const h=rint(1,11),m=pick([0,10,15,20,30,40,45,50]),[eh,em]=addMin(h,m,len);
    out.push({id:'ne:'+ev.slice(0,4)+':'+h+':'+m+':'+len,q:ev+' starts at the time on the clock and lasts '+len+' minutes. When does it end?',vis:{k:'clock',h:h,m:m,ticks:true},
      o:uniqOpts(O(dig(eh,em)),[O(dig(...addMin(eh,em,10))),O(dig(...addMin(eh,em,-10))),O(dig(...addMin(eh,em,60))),O(dig(...addMin(h,m,len-60>0?len-60:len+60)))],4),
      why:'Start at '+dig(h,m)+' and add '+len+' minutes: '+dig(eh,em)+'.'});
  }
  return out;
}

/* ---------- set the clock ---------- */
function setBank(kid){
  const out=[];
  if(kid.id==='lucas'){
    for(let h=1;h<=12;h++)for(const m of [0,30,15,45])
      out.push({id:'ls:'+h+':'+m,set:{h:h,m:m},q:'Set the clock to '+tWords(h,m)+'.',why:tWords(h,m)+' is '+dig(h,m)+'.',
        hint:'Drag the long blue hand for minutes and the short red hand for hours.'});
    return out;
  }
  for(let h=1;h<=12;h++)for(let m=5;m<60;m+=5){
    const style=pick(['dig','words']);
    out.push({id:'ns:'+h+':'+m,set:{h:h,m:m},q:'Set the clock to '+(style==='dig'?dig(h,m):tWords(h,m))+'.',why:tWords(h,m)+' is '+dig(h,m)+'.'});
  }
  for(let i=0;i<30;i++){
    const h=rint(1,12),m=pick([0,10,20,30,40,50,55,45]),k=pick([15,25,35,40,50,70,85]),[th,tm]=addMin(h,m,k);
    out.push({id:'nk:'+h+':'+m+':'+k,set:{h:th,m:tm},q:'It’s '+dig(h,m)+' now. Set the clock to '+k+' minutes later.',why:dig(h,m)+' + '+k+' minutes = '+dig(th,tm)+'.'});
  }
  return out;
}

/* ---------- days of the week ---------- */
const wk=i=>DAYS[(i+70)%7];
function daysBank(kid){
  const out=[],L=kid.id==='lucas',strip=on=>({k:'week',on:on});
  if(L){
    for(let i=0;i<7;i++){
      out.push({id:'da:'+i,q:'What day comes after '+wk(i)+'?',vis:{k:'emoji',e:'📆'},o:[O(wk(i+1)),O(wk(i-1)),O(wk(i+2))],why:'After '+wk(i)+' comes '+wk(i+1)+'.',hintVis:strip(i)});
      out.push({id:'db:'+i,q:'What day comes before '+wk(i)+'?',vis:{k:'emoji',e:'📆'},o:[O(wk(i-1)),O(wk(i+1)),O(wk(i-2))],why:'Before '+wk(i)+' comes '+wk(i-1)+'.',hintVis:strip(i)});
      out.push({id:'dy:'+i,q:'Today is '+wk(i)+'. What day was yesterday?',vis:{k:'emoji',e:'⬅️'},o:[O(wk(i-1)),O(wk(i+1)),O(wk(i))],why:'Yesterday is one day back: '+wk(i-1)+'.',hintVis:strip(i)});
      out.push({id:'dt:'+i,q:'Today is '+wk(i)+'. What day is tomorrow?',vis:{k:'emoji',e:'➡️'},o:[O(wk(i+1)),O(wk(i-1)),O(wk(i+3))],why:'Tomorrow is one day ahead: '+wk(i+1)+'.',hintVis:strip(i)});
      out.push({id:'dz:'+i,q:'Read the zhuyin. Which day is this?',vis:{k:'zh',h:zhDay(i)},o:[O(wk(i)),O(wk(i+1)),O(wk(i+3))],why:zhDay(i)+' is '+wk(i)+'. 星期 means week. '+(i===0?'日 means sun!':'The number tells which day after Sunday.')});
    }
    out.push({id:'dwk',q:'Which two days are the weekend?',vis:{k:'emoji',e:'🛝'},o:[O('Saturday and Sunday'),O('Monday and Tuesday'),O('Friday and Monday')],why:'Saturday and Sunday are the weekend. No school!',hintVis:strip(6)});
    out.push({id:'dn',q:'How many days are in a week?',vis:{k:'emoji',e:'7️⃣'},o:[O('7'),O('5'),O('10')],why:'Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday: 7 days.',hintVis:strip(-1)});
    out.push({id:'dsch',q:'Which day is usually a school day?',vis:{k:'emoji',e:'🎒'},o:[O('Wednesday'),O('Saturday'),O('Sunday')],why:'School days are Monday to Friday.'});
    out.push({id:'dfirst',q:'On most US calendars, which day is first in the week?',vis:{k:'emoji',e:'🗓️'},o:[O('Sunday'),O('Wednesday'),O('Friday')],why:'US calendars start the week on Sunday. Many Taiwan calendars start on Monday!',hintVis:strip(0)});
    return out;
  }
  for(let i=0;i<7;i++){
    for(const n of [3,8,10,12,15,20,30,100]){const a=(i+n)%7;
      out.push({id:'dp:'+i+':'+n,q:'Today is '+wk(i)+'. What day will it be in '+n+' days?',vis:{k:'emoji',e:'🔮'},o:uniqOpts(O(wk(a)),[O(wk(a+1)),O(wk(a-1)),O(wk(i+n%7+2)),O(wk(i))],4),
        why:n+' days = '+Math.floor(n/7)+' weeks and '+(n%7)+' days. Whole weeks land on '+wk(i)+' again, then count '+(n%7)+' more: '+wk(a)+'.'});}
    for(const n of [5,9,14,16]){const a=i-n;
      out.push({id:'dm:'+i+':'+n,q:'Today is '+wk(i)+'. What day was it '+n+' days ago?',vis:{k:'emoji',e:'⏪'},o:uniqOpts(O(wk(a)),[O(wk(a+1)),O(wk(a-1)),O(wk(i+n))],4),
        why:n+' days = '+Math.floor(n/7)+' weeks and '+(n%7)+' days back: '+wk(a)+'.'});}
    for(const t of [8,10,15,20,22,25,29,31]){const a=i+t-1;
      out.push({id:'d1:'+i+':'+t,q:'The 1st of the month is a '+wk(i)+'. What day is the '+ord(t)+'?',vis:{k:'emoji',e:'🗓️'},o:uniqOpts(O(wk(a)),[O(wk(a+1)),O(wk(a-1)),O(wk(i+t))],4),
        why:'The 1st, 8th, 15th, 22nd and 29th are all '+wk(i)+'s. Count on from there: the '+ord(t)+' is a '+wk(a)+'.'});}
    out.push({id:'dz:'+i,q:'Read it! Which day is this?',vis:{k:'zh',h:zhDay(i)},o:uniqOpts(O(wk(i)),[O(wk(i+1)),O(wk(i-1)),O(wk(i+2))],4),why:zhDay(i)+' is '+wk(i)+'.'});
  }
  const y=TODAY.getFullYear();
  for(const id of ['halloween','christmas','july4','valentine','children','doubleten','pi','boba','newyear','fatherstw'])
    for(const yy of [y,y+1]){const h=HID[id],d=dateIn(h,yy),w=d.getDay();
      out.push({id:'dw:'+id+':'+yy,q:'What day of the week is '+h.n+' ('+fmtDate(d)+') in '+yy+'?',vis:{k:'emoji',e:h.e},o:uniqOpts(O(DAYS[w]),[O(wk(w+1)),O(wk(w-1)),O(wk(w+3))],4),
        why:'Use a calendar or count from today: '+fmtDate(d)+', '+yy+' is a '+DAYS[w]+'.',calHint:{y:yy,m:d.getMonth()+1}});}
  [['dh','How many hours are in one day?','24',['12','60','100'],'A day has 24 hours: 12 in the morning half and 12 in the afternoon half.'],
   ['dmin','How many minutes are in one hour?','60',['100','24','30'],'60 minutes make one hour.'],
   ['dsec','How many seconds are in one minute?','60',['100','10','24'],'60 seconds make one minute.'],
   ['dyr','How many days are in a regular year?','365',['366','360','300'],'A regular year has 365 days. A leap year has 366.'],
   ['dwkyr','About how many weeks are in a year?','52',['12','100','30'],'365 ÷ 7 is about 52 weeks.'],
   ['dfort','How many days are in 3 weeks?','21',['14','18','30'],'3 × 7 = 21 days.'],
   ['dleap','Which year is a leap year?','2028',['2026','2027','2030'],'Leap years come every 4 years: 2024, 2028, 2032…'],
   ['dhalf','How many minutes are in half an hour?','30',['15','50','45'],'Half of 60 is 30.'],
   ['dday2','How many hours are in 2 days?','48',['24','36','72'],'2 × 24 = 48 hours.']
  ].forEach(([id,q,a,w,why])=>out.push({id:id,q:q,vis:{k:'emoji',e:'🧮'},o:[O(a)].concat(w.map(x=>O(x))),why:why}));
  return out;
}

/* ---------- months and seasons ---------- */
const mo=i=>MON[(i+120)%12];
const SEASON=m=>['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter'][m];
const SE={winter:'⛄',spring:'🌷',summer:'☀️',fall:'🍂'};
const DIM=[31,28,31,30,31,30,31,31,30,31,30,31];
function monthsBank(kid){
  const out=[],L=kid.id==='lucas';
  for(let i=0;i<12;i++){
    const s=SEASON(i);
    if(L){
      out.push({id:'ma:'+i,q:'What month comes after '+mo(i)+'?',vis:{k:'emoji',e:'🗓️'},o:[O(mo(i+1)),O(mo(i-1)),O(mo(i+2))],why:'After '+mo(i)+' comes '+mo(i+1)+'.',hint:'Say the months in order: January, February, March…'});
      if(i%2===0)out.push({id:'mb:'+i,q:'What month comes before '+mo(i)+'?',vis:{k:'emoji',e:'🗓️'},o:[O(mo(i-1)),O(mo(i+1)),O(mo(i+3))],why:'Before '+mo(i)+' comes '+mo(i-1)+'.'});
      out.push({id:'ms:'+i,q:'In Taiwan and most of the US, what season is '+mo(i)+'?',vis:{k:'emoji',e:SE[s]},o:uniqOpts(O(s),['winter','spring','summer','fall'].map(x=>O(x)),3),why:mo(i)+' is in '+s+'.'});
      if(i<6)out.push({id:'mz:'+i,q:'Read the zhuyin. Which month is this?',vis:{k:'zh',h:zhMonth(i+1)},o:[O(mo(i)),O(mo(i+1)),O(mo(i+5))],why:zhMonth(i+1)+' means month number '+(i+1)+': '+mo(i)+'.'});
    }else{
      out.push({id:'md:'+i,q:'How many days are in '+mo(i)+'?',vis:{k:'emoji',e:'✊'},o:i===1?[O('28, or 29 in a leap year'),O('30'),O('31')]:[O(DIM[i]),O(DIM[i]===31?30:31),O(28)],
        why:'Knuckle trick: make two fists. Knuckles are 31 days, the gaps between are 30 (or February). '+mo(i)+' has '+(i===1?'28, or 29 in a leap year':DIM[i])+' days.'});
      for(const n of [3,5,7,10]){out.push({id:'mp:'+i+':'+n,q:'What month is '+n+' months after '+mo(i)+'?',vis:{k:'emoji',e:'⏩'},o:uniqOpts(O(mo(i+n)),[O(mo(i+n+1)),O(mo(i+n-1)),O(mo(i-n))],4),why:'Count forward '+n+' months from '+mo(i)+': '+mo(i+n)+'.'});}
      out.push({id:'mo:'+i,q:mo(i)+' is which month of the year?',vis:{k:'emoji',e:'🔢'},o:uniqOpts(O('The '+ord(i+1)),[O('The '+ord(i+2)),O('The '+ord(i===0?3:i)),O('The '+ord((i+6)%12+1))],4),why:mo(i)+' is month number '+(i+1)+', so we write it as '+(i+1)+'/1, '+(i+1)+'/2 and so on.'});
      out.push({id:'mz:'+i,q:'Read it! Which month is this?',vis:{k:'zh',h:zhMonth(i+1)},o:uniqOpts(O(mo(i)),[O(mo(i+1)),O(mo(i-1)),O(mo(i+2))],4),why:zhMonth(i+1)+' means month number '+(i+1)+': '+mo(i)+'.'});
      const so=SEASON((i+6)%12);
      out.push({id:'mau:'+i,q:'In Australia, south of the equator, what season is '+mo(i)+'?',vis:{k:'emoji',e:'🦘'},o:uniqOpts(O(so),['winter','spring','summer','fall'].map(x=>O(x)),4),why:'South of the equator the seasons are flipped. '+mo(i)+' is '+s+' in Taiwan but '+so+' in Australia.'});
    }
  }
  if(L){
    [['m1','Which month is first in the year?','January',['December','March']],['mn','How many months are in a year?','12',['7','10']],['mshort','Which month is the shortest?','February',['July','October']],
     ['mlast','Which month is last in the year?','December',['January','June']],['mhallo','Which month has Halloween?','October',['December','April']],['mxmas','Which month has Christmas?','December',['July','March']]
    ].forEach(([id,q,a,w])=>out.push({id:id,q:q,vis:{k:'emoji',e:'🗓️'},o:[O(a)].concat(w.map(x=>O(x))),why:'The answer is '+a+'.'}));
  }else{
    const t=TODAY,iso=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate();
    for(const n of [10,14,21,30]){const d=new Date(t.getFullYear(),t.getMonth(),t.getDate()+n);
      const opt=k=>O(fmtDate(new Date(t.getFullYear(),t.getMonth(),t.getDate()+k)));
      out.push({id:'mlater:'+iso+':'+n,q:'Today is '+fmtDate(t)+'. What is the date '+(n%7===0?(n/7)+' weeks':n+' days')+' from today?',vis:{k:'cal',y:t.getFullYear(),m:t.getMonth()+1,today:t.getDate()},
        o:uniqOpts(O(fmtDate(d)),[opt(n+1),opt(n-1),opt(n+7),opt(n-7)],4),why:fmtDate(t)+' + '+n+' days = '+fmtDate(d)+'. When you pass the end of a month, keep counting from the 1st.'});}
    out.push({id:'mseason',q:'Which season comes right after winter?',vis:{k:'emoji',e:'🌷'},o:[O('spring'),O('summer'),O('fall'),O('winter again')],why:'Winter → spring → summer → fall.'});
    out.push({id:'mquarter',q:'How many months are in a quarter of a year?',vis:{k:'emoji',e:'🍕'},o:[O('3'),O('4'),O('6'),O('25')],why:'12 ÷ 4 = 3 months.'});
  }
  return out;
}

