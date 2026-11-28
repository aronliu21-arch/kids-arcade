/* Kids Arcade progress tracker hooks: play time comes from tracker.js; this records each written spell and each reading answer. */
(function(){ if(!window.KA) return; try{ KA.setKid('lucas'); }catch(e){}
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
