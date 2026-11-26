/* ---------- holidays ---------- */
function holBank(kid,groups){
  const L=kid.id==='lucas',n=L?3:4,list=H.filter(h=>groups.indexOf(h.g)>=0),all=H;
  const out=[];
  for(const h of list){
    const vis={k:'emoji',e:h.e,cap:h.n,zh:h.zh};
    if(L){
      const right=moTxt(h),pool=MON.filter(m=>right.indexOf(m)<0).map(x=>O(x));
      out.push({id:'w:'+h.id,q:'In which month is '+h.n+'?',vis:vis,o:uniqOpts(O(right),pool,n),why:h.n+' is '+whenTxt(h).replace(/^The /,'the ')+'. '+h.f,
        hint:holMonth(h)?SEASON(holMonth(h)-1)==='winter'?'It’s in a cold month.':'It’s in '+SEASON(holMonth(h)-1)+'.':''});
    }else{
      const right=whenTxt(h),pool=all.filter(o=>o.id!==h.id&&whenTxt(o)!==right).map(o=>O(whenTxt(o)));
      out.push({id:'w:'+h.id,q:'When is '+h.n+'?',vis:vis,o:uniqOpts(O(right),pool,n),why:h.n+' is '+right.replace(/^The /,'the ')+'. '+h.f});
    }
    out.push({id:'m:'+h.id,q:'What is '+h.n+' about?',vis:vis,o:uniqOpts(O(h.s),all.filter(o=>o.id!==h.id).map(o=>O(o.s)),n),why:h.f});
    const same=list.filter(o=>o.id!==h.id);
    out.push({id:'e:'+h.id,q:'Which day goes with this picture?',vis:{k:'emoji',e:h.e},o:uniqOpts(O(h.n),(same.length>=n?same:all.filter(o=>o.id!==h.id)).map(o=>O(o.n)),n),why:h.e+' goes with '+h.n+'. '+h.f});
    if(h.zh)out.push({id:'z:'+h.id,q:'Read the zhuyin. Which holiday is this?',vis:{k:'zh',h:RB(h.zh[0],h.zh[1])},o:uniqOpts(O(h.n),H.filter(o=>o.zh&&o.id!==h.id).map(o=>O(o.n)),n),why:RB(h.zh[0],h.zh[1])+' is '+h.n+'. '+h.f});
    (h.x||[]).forEach((x,i)=>{if(x.lv==='b'||x.lv===(L?'l':'n'))out.push({id:'x:'+h.id+i,q:x.q,vis:vis,o:x.o.map(t=>O(t)),why:(x.why?x.why+' ':'')+h.f});});
    if(!L&&(h.r.t==='nth'||h.r.t==='last')){
      const d=nextDate(h,TODAY);if(d){const y=d.getFullYear(),m=d.getMonth(),dd=d.getDate();
        const near=[dd-7,dd+7,dd-1,dd+1].filter(x=>x>=1&&x<=new Date(y,m+1,0).getDate()).map(x=>O(MON[m]+' '+x));
        out.push({id:'d:'+h.id+':'+y,q:h.n+' is on '+whenTxt(h).replace(/^The /,'the ')+'. Use the calendar: what date is it in '+y+'?',vis:{k:'cal',y:y,m:m+1},o:uniqOpts(O(fmtDate(d)),near,4),
          why:'Find the '+DAYS[h.r.wd]+' column and count down. In '+y+' it’s '+fmtDate(d)+'.'});}
    }
  }
  return out;
}

/* ---------- countdown ---------- */
function upcoming(today,maxDays){
  return H.map(h=>({h:h,d:nextDate(h,today)})).filter(x=>x.d&&daysBetween(today,x.d)<=maxDays).sort((a,b)=>a.d-b.d);
}
function countBank(kid){
  const out=[],t=TODAY,iso=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate(),todayVis={k:'leaf',a:t};
  const up=upcoming(t,366).filter(x=>daysBetween(t,x.d)>0);
  if(kid.id==='lucas'){
    for(let i=0;i<Math.min(8,up.length-2);i++){
      const a=up[i],later=up.filter(x=>daysBetween(a.d,x.d)>20);
      if(later.length<2)continue;
      const w=shuffle(later).slice(0,2);
      out.push({id:'nxt:'+iso+':'+a.h.id,q:'Today is '+fmtLong(t)+'. Which of these comes first?',vis:todayVis,o:[O(a.h.n,fmtDate(a.d),a.h.e)].concat(w.map(x=>O(x.h.n,fmtDate(x.d),x.h.e))),
        why:a.h.n+' is on '+fmtDate(a.d)+', the soonest one.',hint:'Find the month that comes soonest after '+MON[t.getMonth()]+'.'});
    }
    const fixed=H.filter(h=>h.r.t==='fix'&&h.g!=='fun');
    for(let k=0;k<20;k++){
      const a=pick(fixed),b=pick(fixed);if(a.r.m===b.r.m)continue;
      const [f,s]=a.r.m<b.r.m?[a,b]:[b,a];
      out.push({id:'fy:'+f.id+':'+s.id,q:'Starting from January, which comes first in the year?',vis:{k:'emoji',e:'🗓️'},o:[O(f.n,MON[f.r.m-1],f.e),O(s.n,MON[s.r.m-1],s.e)],why:f.n+' is in '+MON[f.r.m-1]+', and '+s.n+' is in '+MON[s.r.m-1]+'.'});
    }
    for(const x of up.filter(x=>daysBetween(t,x.d)<=12).slice(0,3)){const n=daysBetween(t,x.d);
      out.push({id:'cdl:'+iso+':'+x.h.id,q:'Today is '+fmtDate(t)+'. '+x.h.n+' is on '+fmtDate(x.d)+'. How many more days?',vis:{k:'leaf',a:t,b:x.d,e:x.h.e},o:uniqOpts(O(n),[O(n+1),O(n-1),O(n+2),O(n+10)].filter(o=>+o.t>0),3),why:'Count the sleeps: '+n+' more days until '+x.h.n+'.'});}
    return out;
  }
  for(const x of up.filter(x=>daysBetween(t,x.d)<=200)){
    const n=daysBetween(t,x.d),m1=t.getMonth(),y1=t.getFullYear();
    let why;
    if(x.d.getMonth()===m1&&x.d.getFullYear()===y1)why=x.d.getDate()+' − '+t.getDate()+' = '+n+' days.';
    else{const left=new Date(y1,m1+1,0).getDate()-t.getDate();const parts=[left+' left in '+MON[m1]];
      let c=new Date(y1,m1+1,1);while(c.getFullYear()<x.d.getFullYear()||c.getMonth()<x.d.getMonth()){parts.push(new Date(c.getFullYear(),c.getMonth()+1,0).getDate()+' in '+MON[c.getMonth()]);c=new Date(c.getFullYear(),c.getMonth()+1,1);}
      parts.push(x.d.getDate()+' in '+MON[x.d.getMonth()]);why=parts.join(' + ')+' = '+n+' days.';}
    out.push({id:'cd:'+iso+':'+x.h.id,q:'Today is '+fmtDate(t)+'. How many days until '+x.h.n+' on '+fmtDate(x.d)+'?',vis:{k:'leaf',a:t,b:x.d,e:x.h.e},
      o:uniqOpts(O(n),[O(n+1),O(n-1),O(n+7),O(n-7),O(n+30)].filter(o=>+o.t>0),4),why:why});
    if(n>=14)out.push({id:'cw:'+iso+':'+x.h.id,q:x.h.n+' is '+n+' days away. How many weeks and days is that?',vis:{k:'leaf',a:t,b:x.d,e:x.h.e},
      o:uniqOpts(O(Math.floor(n/7)+' weeks and '+(n%7)+' days'),[O(Math.floor(n/7)+1+' weeks and '+(n%7)+' days'),O(Math.floor(n/7)+' weeks and '+((n%7)+1)+' days'),O(Math.floor(n/10)+' weeks and '+(n%10)+' days')],4),
      why:n+' ÷ 7 = '+Math.floor(n/7)+' remainder '+(n%7)+'.'});
  }
  return out;
}

/* ---------- Milo ---------- */
function dayNightBank(){
  const D=O('Day','','☀️'),N=O('Night','','🌙');
  return [['sleep','When do we sleep?',N],['sun','When can we see the sun?',D],['stars','When can we see the stars?',N],['park','When do we go to the playground?',D],
   ['owl','When do owls wake up?',N],['moon','When is the moon in the dark sky?',N],['lunch','When do we eat lunch?',D],['pj','When do we wear pajamas?',N],['school','When do we go to school?',D]]
   .map(([id,q,a])=>({id:'dn:'+id,q:q,vis:{k:'emoji',e:'🦖'},o:[a,a===D?N:D],why:a===D?'In the day the sun is up!':'At night it’s dark and the moon comes out.'}));
}
function seasonsBank(){
  const S={winter:O('Winter','','⛄'),summer:O('Summer','','🏖️'),fall:O('Fall','','🍂'),spring:O('Spring','','🌷')};
  return [['w','Which one is winter?','winter','summer'],['s','Which one is summer?','summer','winter'],['f','Which one is fall?','fall','spring'],['sp','Which one is spring?','spring','fall'],
   ['snow','When does it snow?','winter','summer'],['swim','When do we swim at the beach?','summer','winter'],['leaves','When do leaves fall down?','fall','spring'],['flowers','When do flowers grow?','spring','fall']]
   .map(([id,q,a,b])=>({id:'se:'+id,q:q,vis:{k:'emoji',e:'🦕'},o:[S[a],S[b]],why:S[a].t+'!'}));
}
function picsBank(){
  const L=H.filter(h=>h.milo),out=[];
  for(const h of L){let w=h;while(w===h)w=pick(L);
    out.push({id:'pc:'+h.id,q:'It’s '+h.n+'! Which one goes with '+h.n+'?',vis:{k:'none'},o:[O(h.milo[1],'',h.milo[0]),O(w.milo[1],'',w.milo[0])],why:'Yes! The '+h.milo[1]+' goes with '+h.n+'.'});}
  return out;
}
