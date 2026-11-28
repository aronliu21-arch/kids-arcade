/* Kids Arcade progress tracker hooks: play time comes from tracker.js; this records each written spell and each reading answer. */
(function(){ if(!window.KA) return; try{ KA.setKid('nora'); }catch(e){}
 const _ps=Pad.prototype.score;
 Pad.prototype.score=function(){ const r=_ps.apply(this,arguments);
  try{ const st=r&&r.stars||0, mm=(typeof M!=='undefined'&&M)?M:null;
   KA.answer({q:'Write: '+this.text, qid:'w:'+this.text, given:st+'★ '+Math.round(((r&&r.score)||0)*100)+'%', expected:this.text, correct:st>=1, tryNo:mm?mm.tries+1:1, topic:(mm&&mm.m&&mm.m.title)||'Writing'}); }catch(e){}
  return r; };
 const _rc=readCheck;
 readCheck=function(){ let w=null,t=0,v='';
  try{ if(R&&!$('#rdIn').disabled){ w=R.fix?R.items[R.i][1]:R.items[R.i]; t=R.tries; v=$('#rdIn').value; } }catch(e){}
  const out=_rc.apply(this,arguments);
  try{ if(w!==null&&R&&R.tries>t) KA.answer({q:'Read: '+w, qid:'r:'+w, given:v, expected:w, correct:normW(v)===normW(w), tryNo:R.tries, topic:(R.m&&R.m.title)||'Reading'}); }catch(e){}
  return out; };
})();
/* Free-play progress for the Baba page: which year/chapter, and % of all years' main missions done. */
(function(){ if(!window.KA||!KA.progress) return;
 function frac(list,done){ let t=0,d=0; (list||[]).forEach((c,i)=>(c.missions||[]).forEach(m=>{ if(m.kind==='mini') return; t++; if(done&&done[`c${i+1}:${m.id}`]) d++; })); return {t:t,d:d}; }
 function report(){ try{
  const L={1:CH1,2:Y2.CH}; if(typeof Y3!=='undefined'&&Y3.CH) L[3]=Y3.CH;
  const ys=Object.keys(L).map(Number), y=yearOf(); let sum=0, here={t:0,d:0};
  ys.forEach(k=>{ const st=k===y?S:(S.years&&S.years[k]); if(!st) return; const f=frac(L[k],st.done); if(k===y) here=f; sum+=st.allDone?1:(f.t?f.d/f.t:0); });
  const n=Math.max(1,Math.min(S.ch||1,CHAPTERS.length)), c=CH(n);
  KA.progress({where:'Year '+y+' · Chapter '+n+(c&&c.title?': '+c.title:'')+(S.allDone?' (year finished)':''), pct:100*sum/ys.length, detail:here.d+'/'+here.t+' missions in Year '+y+' · '+(S.stars||0)+' stars'});
 }catch(e){} }
 const _md=markDone; markDone=function(){ const r=_md.apply(this,arguments); report(); return r; };
 const _sy=setYear; setYear=function(){ const r=_sy.apply(this,arguments); report(); return r; };
 setTimeout(report,2500);
})();
