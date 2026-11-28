// ================= YEAR 3 ART =================
// Painted Year 3 pictures (Gemini watercolor). Built from tools in the art chat; dims are [width,height] of each webp.
const Y3ART={pen:{"pen": [202, 484], "pen-awake": [195, 488], "pen2": [472, 536]},mirror:{"smirk": [230, 523], "wave": [279, 523], "brave": [298, 523], "sad": [231, 524]}};
Object.assign(Y2ART.f,{celeste:[277,514,330]});
Object.assign(Y2ART.femo,{"celeste-sad": [223, 495], "celeste-wow": [356, 497]});
Object.assign(Y2ART.drag,{pip:[587,496,400],'pip-fly':[610,537,420]});
DRAGONS['pip-fly']=DRAGONS.pip;
{ const _dragon=dragon; dragon=function(x,y,s,o={}){ if(o.who==='pip'&&o.fly) o=Object.assign({},o,{who:'pip-fly',fly:false}); return _dragon(x,y,s,o); }; }
// Silver Pen battles use the painted pen
if(Y3ART.pen['pen-awake']){ Object.assign(Y2ART.foe,{'pen-awake':[...Y3ART.pen['pen-awake'],270]}); if(FOES.pen1) FOES.pen1.kind='pen-awake'; }
if(Y3ART.pen.pen2){ Object.assign(Y2ART.foe,{pen2:[...Y3ART.pen.pen2,275]}); if(FOES.pen2) FOES.pen2.kind='pen2'; }
// the three new places now have their own paintings
['roost','arena','clock'].forEach(k=>{ if(typeof BG_ALIAS!=='undefined') delete BG_ALIAS[k]; delete Y3_ALIAS[k]; ART_BG[k]=1; });
Object.assign(BG_FALLBACK,{roost:'tower',arena:'courtyard',clock:'hall'});
// battle helpers were drawn before this file loaded: redraw flying Pip with the flying picture
Object.values(FOES).forEach(f=>(f.helpers||[]).forEach(h=>{ if(h.emoji==='🪶'&&typeof h.x==='string') Object.defineProperty(h,'x',{get:()=>PIP(512,400,.45,{expr:'happy',fly:true}),configurable:true});
 else if(typeof h.x==='string'&&h.x.length&&h.emoji==='🔥'&&/Ember hit it together/.test(h.msg||'')) Object.defineProperty(h,'x',{get:()=>D2(880,200,.4,{fly:true}),configurable:true}); }));
