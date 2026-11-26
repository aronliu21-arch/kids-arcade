const ORDER=['hair','top','bottom','dress','shoes','acc'];
const THEMES=[
 {id:'night',en:'Night Market',zh:'夜市',zy:'ㄧㄝˋ ㄕˋ',col:['red','yellow','aqua'],h:'Comfy clothes for walking and snacking!'},
 {id:'rain',en:'Rainy Day',zh:'下雨天',zy:'ㄒㄧㄚˋ ㄩˇ ㄊㄧㄢ',col:['yellow','blue','green'],h:'Stay dry and bright.'},
 {id:'space',en:'Space Explorer',zh:'太空探險',zy:'ㄊㄞˋ ㄎㄨㄥ ㄊㄢˋ ㄒㄧㄢˇ',col:['white','silver','purple','black'],h:'Ready for the moon!'},
 {id:'newyear',en:'Lunar New Year',zh:'過年',zy:'ㄍㄨㄛˋ ㄋㄧㄢˊ',col:['red','gold'],h:'Red and gold bring good luck.'},
 {id:'royal',en:'Royal Ball',zh:'皇家舞會',zy:'ㄏㄨㄤˊ ㄐㄧㄚ ㄨˇ ㄏㄨㄟˋ',col:['purple','pink','gold','silver'],h:'Fancy, sparkly and grand.'},
 {id:'beach',en:'Beach Day',zh:'海灘日',zy:'ㄏㄞˇ ㄊㄢ ㄖˋ',col:['aqua','yellow','coral','white'],h:'Sunny and cool.'},
 {id:'sports',en:'Sports Day',zh:'運動會',zy:'ㄩㄣˋ ㄉㄨㄥˋ ㄏㄨㄟˋ',col:['blue','white','red'],h:'Easy to run and jump in.'}];
const find=(cat,id)=>CAT[cat].items.find(x=>x.id===id);
[['hat','head'],['crown','head'],['glasses','face'],['bag','neck'],['scarf','neck'],['umbrella','held']].forEach(([id,z])=>find('acc',id).z=z);

let look,tab='top',sel='top',theme,timeLeft=120,timerOn=true,tick=null,running=false;
function fresh(){look={hair:'pony',top:'tee',bottom:'skirt',dress:null,shoes:'sneakers',acc:[],col:{},pat:{}};sel='top';}
const colOf=(key,it)=>look.col[key]||(key==='hair'?HAIRPAL[it.col]:PAL[it.col]);
const keyOf=(cat,id)=>cat==='acc'?'acc:'+id:cat;
let DEFS='<defs><filter id="wc" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="3.2"/></filter>'+
 '<pattern id="p-stripes" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="3" height="8" fill="#fff" opacity=".55"/></pattern>'+
 '<pattern id="p-dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="1.8" fill="#fff" opacity=".7"/></pattern>'+
 '<pattern id="p-checks" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#fff" opacity=".45"/><rect x="5" y="5" width="5" height="5" fill="#fff" opacity=".45"/></pattern>'+
 '<pattern id="p-flowers" width="16" height="16" patternUnits="userSpaceOnUse"><g fill="#fff" opacity=".8"><circle cx="8" cy="5" r="2"/><circle cx="11" cy="8" r="2"/><circle cx="8" cy="11" r="2"/><circle cx="5" cy="8" r="2"/></g><circle cx="8" cy="8" r="1.4" fill="#ffd25e"/></pattern>'+
 '<pattern id="p-sparkle" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M3.5 1l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" fill="#fff" opacity=".85"/></pattern>'+
 '<pattern id="p-hearts" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M6 9.5L2.5 6a2 2 0 0 1 3.5-2a2 2 0 0 1 3.5 2z" fill="#fff" opacity=".75"/></pattern>'+
'<pattern id="p-zigzag" width="12" height="8" patternUnits="userSpaceOnUse"><path d="M0 6L3 2L6 6L9 2L12 6" fill="none" stroke="#fff" stroke-width="1.6" opacity=".75"/></pattern>'+
 '<pattern id="p-plaid" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="4" fill="#fff" opacity=".35"/><rect width="4" height="14" fill="#fff" opacity=".35"/><path d="M0 9h14M9 0v14" stroke="#3a3a44" stroke-width=".6" opacity=".35"/></pattern>'+
'<pattern id="p-stars" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 2l1.4 3 3.2.4-2.4 2.2.7 3.2L7 9.2l-2.9 1.6.7-3.2-2.4-2.2 3.2-.4z" fill="#fff" opacity=".8"/></pattern></defs>';
const lum=h=>{const n=parseInt(h.slice(1),16);return ((n>>16)*.299+((n>>8)&255)*.587+(n&255)*.114)/255;};
function patOf(key){if(look.pat[key])return look.pat[key];const [c,id]=key.startsWith('acc:')?['acc',key.slice(4)]:[key,look[key]];const it=id&&find(c,id);return it&&it.dp||'plain';}
function withPat(html,key,force){const p=force||patOf(key);return p&&p!=='plain'?html.replace(/<path d="([^"]+)" fill="(#[0-9a-f]{6})" opacity=".86" filter="url\(#wc\)"\/>/g,(m,d,c)=>m+'<path d="'+d+'" fill="url(#p-'+p+(lum(c)>.78?'d':'')+')"/>'):html;}
(()=>{const pats=DEFS.match(/<pattern id="p-[^"]+"[\s\S]*?<\/pattern>/g)||[];DEFS=DEFS.replace('</defs>',pats.map(p=>p.replace(/id="(p-[^"]+)"/,'id="$1d"').replace(/#fff\b/g,'#4a3426').replace(/opacity="\.(\d+)"/g,(m,o)=>'opacity="'+Math.min(.6,+('.'+o)*.6).toFixed(2)+'"')).join('')+'</defs>');})();
function piece(cat,id,layer){const it=find(cat,id);if(!it)return '';const key=keyOf(cat,id),c=colOf(key,it),d=it.draw;
  let h=typeof d==='function'?(layer==='main'?d(c):''):(d[layer]?d[layer](c):'');return withPat(h,key);}
const HD=h=>'<g transform="translate(100 82) scale(1.38) translate(-100 -82)">'+h+'</g>';
let FIGN=0;const LONGD=['gown','princess','mermaid','hanfu','evening','yukata','maxi','snowgown','grandgown','flowermaxi','tulle'];
/* ---------- model maker: Lucas designs her own face ---------- */
const SKINS=[['#fde7d9','#fadfcf'],['#f8dccb','#f6d7c3'],['#f1c9a8','#ecc29f'],['#e0ac85','#d9a47c'],['#c68b5e','#bd8256'],['#8d5a3b','#855436']];
const EYECOL={brown:'#7a4a2a',black:'#2b2118',blue:'#3b7dd8',green:'#2f9e44',purple:'#7048e8',hazel:'#a67b2e'};
const LIPS={pink:'#e64980',red:'#c92a2a',coral:'#ff8a72',berry:'#9c36b5',nude:'#b9806a'};
const FDEF={skin:1,eyes:'round',eyeCol:'brown',brows:'soft',mouth:'smile',lips:'nude',blush:false,freckles:false,mole:false};
let FACE=Object.assign({},FDEF);try{Object.assign(FACE,JSON.parse(localStorage.getItem('rl_face')||'{}'));}catch(e){}
const SK=()=>SKINS[FACE.skin][0],SKB=()=>SKINS[FACE.skin][1];
function faceSVG(){const ec=EYECOL[FACE.eyeCol]||'#7a4a2a',lc=LIPS[FACE.lips]||'#e64980',I=INK;let e='';
  const eye=x=>{switch(FACE.eyes){
    case 'dot':return '<circle cx="'+x+'" cy="54" r="1.5" fill="'+I+'"/>';
    case 'sleepy':return '<path d="M'+(x-2.6)+' 54q2.6 2.4 5.2 0" fill="none" stroke="'+I+'" stroke-width="1.1" stroke-linecap="round"/>';
    case 'sparkle':return '<ellipse cx="'+x+'" cy="54" rx="2.9" ry="3.5" fill="#fff" stroke="'+I+'" stroke-width=".5"/><ellipse cx="'+x+'" cy="54.4" rx="2.2" ry="2.9" fill="'+ec+'"/><circle cx="'+x+'" cy="54.6" r="1.1" fill="#1a1010"/><circle cx="'+(x+.8)+'" cy="53" r=".9" fill="#fff"/><circle cx="'+(x-.8)+'" cy="55.8" r=".5" fill="#fff"/><path d="M'+(x-3.2)+' 51.6q3.2-2.2 6.4 .2" fill="none" stroke="'+I+'" stroke-width="1.1"/>';
    case 'lash':return '<ellipse cx="'+x+'" cy="54.3" rx="2.4" ry="2.8" fill="#fff" stroke="'+I+'" stroke-width=".5"/><circle cx="'+x+'" cy="54.6" r="1.8" fill="'+ec+'"/><circle cx="'+x+'" cy="54.7" r=".8" fill="#1a1010"/><circle cx="'+(x+.6)+'" cy="53.8" r=".55" fill="#fff"/><path d="M'+(x-3)+' 52.4q3-2 6 0'+(x<100?'l-7.2 -1':'l1.2 -1')+'" fill="none" stroke="'+I+'" stroke-width="1.2" stroke-linecap="round"/>';
    default:return '<ellipse cx="'+x+'" cy="54.3" rx="2.3" ry="2.7" fill="#fff" stroke="'+I+'" stroke-width=".5"/><circle cx="'+x+'" cy="54.6" r="1.7" fill="'+ec+'"/><circle cx="'+x+'" cy="54.7" r=".75" fill="#1a1010"/><circle cx="'+(x+.6)+'" cy="53.8" r=".55" fill="#fff"/>';}};
  e+=eye(94)+eye(106);
  const bw={thin:.7,soft:1.1,bold:1.8}[FACE.brows];if(bw)e+='<path d="M90.5 '+(FACE.eyes==='dot'||FACE.eyes==='sleepy'?51:50)+'q3.5-2 7 0M102.5 '+(FACE.eyes==='dot'||FACE.eyes==='sleepy'?51:50)+'q3.5-2 7 0" fill="none" stroke="'+I+'" stroke-width="'+bw+'" stroke-linecap="round"/>';
  const m={smile:'<path d="M96 61.6q4 3.2 8 0" fill="none" stroke="'+lc+'" stroke-width="1.3" stroke-linecap="round"/>',
    grin:'<path d="M95.5 61q4.5 5 9 0Z" fill="'+lc+'" stroke="'+I+'" stroke-width=".5"/><path d="M96.5 61.3h7" stroke="#fff" stroke-width="1"/>',
    cat:'<path d="M96 61.5q2 2 4 0q2 2 4 0" fill="none" stroke="'+lc+'" stroke-width="1.2" stroke-linecap="round"/>',
    small:'<ellipse cx="100" cy="62" rx="1.6" ry="1.1" fill="'+lc+'"/>',
    open:'<ellipse cx="100" cy="62.4" rx="2.2" ry="2.4" fill="'+lc+'" stroke="'+I+'" stroke-width=".5"/>',
    smirk:'<path d="M96.5 62.4q4 1.6 7.5-1.6" fill="none" stroke="'+lc+'" stroke-width="1.3" stroke-linecap="round"/>'}[FACE.mouth]||'';
  e+=m;
  if(FACE.blush)e+='<ellipse cx="90" cy="59" rx="3" ry="1.6" fill="#ffa8a8" opacity=".65"/><ellipse cx="110" cy="59" rx="3" ry="1.6" fill="#ffa8a8" opacity=".65"/>';
  if(FACE.freckles)e+=[[88,58],[90.5,59.6],[92,57.8],[108,57.8],[109.5,59.6],[112,58]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r=".45" fill="#8a5a3b"/>').join('');
  if(FACE.mole)e+='<circle cx="107" cy="63" r=".6" fill="#3a2a22"/>';
  return e;}
function saveFace(){try{localStorage.setItem('rl_face',JSON.stringify(FACE));}catch(e){}CAST.lucas.skin=SK();CAST.lucas.iris=EYECOL[FACE.eyeCol];}
const headView=svg=>svg.replace('viewBox="0 0 200 400" width="200" height="400"','viewBox="66 55 68 64" width="100%" height="100%"');
function maker(done,first){const keep=Object.assign({},FACE);
  const ROWS=[['skin','Skin',SKINS.map((s,i)=>[i,'<i class="sw" style="background:'+s[0]+'"></i>'])],
    ['eyes','Eyes',['round','sparkle','dot','sleepy'].map(v=>[v,null])],
    ['eyeCol','Eye color',Object.entries(EYECOL).map(([k,c])=>[k,'<i class="sw" style="background:'+c+'"></i>'])],
    ['brows','Eyebrows',['soft','thin','bold','none'].map(v=>[v,null])],
    ['mouth','Mouth',['smile','grin','cat','smirk','small','open'].map(v=>[v,null])],
    ['blush','Blush',[[true,'On'],[false,'Off']]],['freckles','Freckles',[[true,'On'],[false,'Off']]],['mole','Mole',[[true,'On'],[false,'Off']]]];
  const el=document.createElement('div');el.id='maker';document.body.appendChild(el);
  const mini=(k,v)=>{const o=FACE[k];FACE[k]=v;const h=headView(figureSVG(look));FACE[k]=o;return '<span class="mh">'+h+'</span>';};
  const draw=()=>{el.innerHTML='<div class="mk"><h2>'+(first?'✨ Create your model':'🪞 Mirror')+'</h2><p class="note">'+(first?'Design your face before your career begins!':'Change your look any time.')+'</p>'+
    '<div class="mkwrap"><div class="mkprev"><div class="mkhead">'+headView(figureSVG(look))+'</div><div class="mkbody">'+figureSVG(look)+'</div></div><div class="mkopts">'+
    ROWS.map(([k,lab,opts])=>'<div class="mkrow"><b>'+lab+'</b><div class="mkch">'+opts.map(([v,face])=>'<button class="mkb'+(FACE[k]===v?' on':'')+'" data-k="'+k+'" data-v="'+JSON.stringify(v).replace(/"/g,'&quot;')+'" aria-label="'+lab+' '+v+'">'+(face!==null&&face!==undefined?face:mini(k,v))+'<span>'+(typeof v==='string'?v:'')+'</span></button>').join('')+'</div></div>').join('')+
    '</div></div><div class="row"><button class="btn ghost" id="mkR">🎲 Random</button>'+(first?'':'<button class="btn ghost" id="mkC">Cancel</button>')+'<button class="btn pink" id="mkD">✓ Done</button></div></div>';
    el.querySelectorAll('.mkb').forEach(b=>b.onclick=()=>{FACE[b.dataset.k]=JSON.parse(b.dataset.v);tone(900,.04,'triangle',.06);const y=el.scrollTop;draw();el.scrollTop=y;});
    el.querySelector('#mkR').onclick=()=>{ROWS.forEach(([k,,o])=>{FACE[k]=pick(o)[0];});sfx.good();const y=el.scrollTop;draw();el.scrollTop=y;};
    if(el.querySelector('#mkC'))el.querySelector('#mkC').onclick=()=>{FACE=keep;el.remove();};
    el.querySelector('#mkD').onclick=()=>{saveFace();el.remove();sfx.win();renderFig&&renderFig();done&&done();};};
  draw();}

function figureSVG(L,walk){const old=look;look=L||look;
  const body='<g>'+wc('M84 178L96 178L95 268L95 360L89 360L88 268Z',SKB())+wc('M104 178L116 178L112 268L111 360L105 360L105 268Z',SKB())+
   wc('M78 86L84 92L74 142L71 196L65 196L66 140Z',SKB())+wc('M122 86L116 92L126 142L129 196L135 196L134 140Z',SKB())+
   wc('M78 84Q100 78 122 84L116 150Q100 154 84 150Z',SKB())+wc('M84 150L80 178L120 178L116 150Z',SKB())+wc('M95 66L105 66L105 82L95 82Z',SKB())+
   '</g>';
  const headSk=wc('M85 52a15 18 0 1 0 30 0a15 18 0 1 0 -30 0Z',SK());
  const face=faceSVG();
  const feet='<ellipse cx="92" cy="364" rx="6" ry="3" fill="'+SKB()+'" stroke="'+INK+'" stroke-width=".9"/><ellipse cx="108" cy="364" rx="6" ry="3" fill="'+SKB()+'" stroke="'+INK+'" stroke-width=".9"/>';
  const hands='<circle cx="68" cy="200" r="4" fill="'+SKB()+'" stroke="'+INK+'" stroke-width=".9"/><circle cx="132" cy="200" r="4" fill="'+SKB()+'" stroke="'+INK+'" stroke-width=".9"/>';
  const L2=look,accZ=z=>L2.acc.filter(id=>find('acc',id).z===z).map(id=>piece('acc',id,'main')).join('');
  let s='<svg viewBox="0 0 200 400" width="200" height="400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fashion sketch of Lucas’s outfit">'+DEFS+'<ellipse cx="100" cy="372" rx="38" ry="5" fill="#e3d6c7"/>'+
   '<g class="wgt"><g transform="translate(100 372) scale(1.12 .86) translate(-100 -372)">'+HD('<g class="hd">'+piece('hair',L2.hair,'back')+(L2.dress?piece('dress',L2.dress,'back'):'')+'</g>')+(L2.top?piece('top',L2.top,'back'):'')+accZ('back')+body+HD('<g class="hd">'+headSk+'<g class="ey">'+face+'</g></g>')+feet+piece('shoes',L2.shoes,'main')+
   (L2.dress?piece('dress',L2.dress,'main'):piece('bottom',L2.bottom,'main')+piece('top',L2.top,'main'))+accZ('waist')+accZ('neck')+hands+accZ('wrist')+
   HD('<g class="hd">'+piece('hair',L2.hair,'front')+accZ('head')+accZ('face')+accZ('top')+'</g>')+accZ('held')+'</g></g>';
  if(walk&&!(L2.dress&&LONGD.includes(L2.dress))&&!(L2.bottom&&LONGD.includes(L2.bottom))){const id='lg'+(FIGN++),inner=s.slice(s.indexOf('<g class="wgt">'));
    s=s.slice(0,s.indexOf('<g class="wgt">'))+'<defs><clipPath id="'+id+'u"><rect x="0" y="0" width="200" height="300"/></clipPath><clipPath id="'+id+'l"><rect x="0" y="296" width="100" height="110"/></clipPath><clipPath id="'+id+'r"><rect x="100" y="296" width="100" height="110"/></clipPath></defs>'+
      '<g clip-path="url(#'+id+'u)">'+inner+'</g><g class="lgL" clip-path="url(#'+id+'l)"><g class="lgLi">'+inner+'</g></g><g class="lgR" clip-path="url(#'+id+'r)"><g class="lgRi">'+inner+'</g></g>';}
  s+='</svg>';
  look=old;return s;}
