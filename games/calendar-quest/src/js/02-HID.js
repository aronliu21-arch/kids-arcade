const HID={};H.forEach(h=>HID[h.id]=h);
/* Exact dates for lunar holidays (month-day). Checked against published 2026–2028 calendars. */
const LUNAR={lny:{2026:[2,17],2027:[2,6],2028:[1,26]},lantern:{2026:[3,3],2027:[2,20],2028:[2,9]},dragon:{2026:[6,19],2027:[6,9],2028:[5,28]},midautumn:{2026:[9,25],2027:[9,15],2028:[10,3]}};
function nthWd(y,m,wd,n){const d=new Date(y,m-1,1);return new Date(y,m-1,1+(wd-d.getDay()+7)%7+7*(n-1));}
function lastWd(y,m,wd){const d=new Date(y,m,0);return new Date(y,m-1,d.getDate()-(d.getDay()-wd+7)%7);}
function easterDate(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1;return new Date(y,mo-1,da);}
function dateIn(h,y){
  const r=h.r;
  if(r.t==='fix')return new Date(y,r.m-1,r.d);
  if(r.t==='nth')return nthWd(y,r.m,r.wd,r.n);
  if(r.t==='last')return lastWd(y,r.m,r.wd);
  if(r.t==='easter')return easterDate(y);
  if(r.t==='lunar'&&LUNAR[h.id]&&LUNAR[h.id][y])return new Date(y,LUNAR[h.id][y][0]-1,LUNAR[h.id][y][1]);
  return null;
}
function day0(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function daysBetween(a,b){return Math.round((day0(b)-day0(a))/864e5);}
function nextDate(h,today){for(const y of [today.getFullYear(),today.getFullYear()+1]){const d=dateIn(h,y);if(d&&daysBetween(today,d)>=0)return d;}return null;}
function whenTxt(h){
  const r=h.r;if(h.w)return h.w;
  if(r.t==='fix')return MON[r.m-1]+' '+r.d;
  if(r.t==='nth')return 'The '+ord(r.n)+' '+DAYS[r.wd]+' of '+MON[r.m-1];
  if(r.t==='last')return 'The last '+DAYS[r.wd]+' of '+MON[r.m-1];
  if(r.t==='lunar')return 'The '+ord(r.ld)+' day of the '+ord(r.lm)+' lunar month';
  return r.w;
}
function moTxt(h){const r=h.r;if(r.mo)return r.mo;if(r.m)return MON[r.m-1];return r.w;}
function holMonth(h){const r=h.r;if(r.m)return r.m;const t=moTxt(h);for(let i=0;i<12;i++)if(t.indexOf(MON[i])===0)return i+1;return 0;}
const fmtDate=d=>MON[d.getMonth()]+' '+d.getDate();
const fmtLong=d=>DAYS[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();
