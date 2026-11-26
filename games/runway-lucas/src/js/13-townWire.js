function townWire(s){const T=s.querySelector('.townbox'),N=s.querySelector('#tnora');let pos=+(N.dataset.x||50),busy=false;
  const walkers=s.querySelector('#walkers');for(let i=0;i<4;i++){const d=document.createElement('div');d.className='walker w'+i;d.innerHTML=fan(i*3+1);walkers.appendChild(d);}
  s.querySelectorAll('.bld').forEach(b=>b.onclick=()=>{if(busy)return;busy=true;audio();const t=curTown().find(x=>x.k===b.dataset.k),tx=t.x/10,dist=Math.abs(tx-pos),ms=Math.max(350,dist*28);
    N.classList.toggle('flip',tx<pos);N.classList.add('walking');N.style.transition='left '+ms+'ms linear';N.style.left=tx+'%';
    const st=setInterval(()=>tone(1500,.02,'square',.03),260);
    setTimeout(()=>{clearInterval(st);N.classList.remove('walking');b.classList.add('pop');tone(880,.08,'triangle',.1);pos=tx;C.tx=tx;cSave();setTimeout(()=>{busy=false;t.go();},380);},ms);});}

/* ---------- story dialog: big painted portrait + dark name band, tap to continue ---------- */
const CAST={
 lucas:{name:'Lucas',hair:'#2b2118',style:'spiky',skin:'#f8dccb',iris:'#7a4a2a',top:'#1c7ed6',trim:'#ffffff'},
 mia:{name:'Agent Marco',hair:'#6b4226',style:'short',skin:'#f1c9a8',iris:'#3a6b8a',top:'#3b3b58',trim:'#f4f1ea',glasses:1},
 stella:{name:'Rex',hair:'#e8c063',style:'short',skin:'#fbe3d3',iris:'#7048e8',top:'#9b7fd4',trim:'#f7d6e6'},
 rose:{name:'Monsieur Remy',hair:'#d9d4cf',style:'short',skin:'#f3d2bc',iris:'#8a5a7a',top:'#1971c2',trim:'#ffd43b'},
 bea:{name:'Mr. Ben',hair:'#a0522d',style:'short',skin:'#e8b48f',iris:'#2f6b3a',top:'#2f9e44',trim:'#f4f1ea',apron:1},
 sue:{name:'Grandpa Sam',hair:'#e9ecef',style:'short',skin:'#f6d7c3',iris:'#5b6b8a',top:'#7048e8',trim:'#ffd25e',glasses:1},
 kay:{name:'Mr. Kai',hair:'#3a3a44',style:'short',skin:'#c68b5e',iris:'#3a2618',top:'#e8793a',trim:'#fff'}};
function shade(h,a){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('');}
function portrait(k,mood){const c=CAST[k],u=k+(mood||'')+Math.floor(Math.random()*1e6),L='#6b3f3f',O='stroke="'+L+'" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';mood=mood||'happy';
  const hl=shade(c.hair,.35),hd=shade(c.hair,-.35),sk=c.skin,skd=shade(c.skin,-.12);
  const defs='<defs><linearGradient id="h'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+hl+'"/><stop offset=".55" stop-color="'+c.hair+'"/><stop offset="1" stop-color="'+hd+'"/></linearGradient>'+
    '<linearGradient id="i'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+shade(c.iris,-.55)+'"/><stop offset=".55" stop-color="'+c.iris+'"/><stop offset="1" stop-color="'+shade(c.iris,.55)+'"/></linearGradient>'+
    '<radialGradient id="s'+u+'" cx=".5" cy=".42" r=".62"><stop offset=".7" stop-color="'+sk+'"/><stop offset="1" stop-color="'+skd+'"/></radialGradient>'+
    '<radialGradient id="b'+u+'"><stop offset="0" stop-color="#ff8fab" stop-opacity=".75"/><stop offset="1" stop-color="#ff8fab" stop-opacity="0"/></radialGradient>'+
    '<linearGradient id="t'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+shade(c.top,.25)+'"/><stop offset="1" stop-color="'+shade(c.top,-.2)+'"/></linearGradient>'+
    '<radialGradient id="g'+u+'" cx=".5" cy=".55" r=".55"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';
  const H='url(#h'+u+')',glow='<ellipse cx="150" cy="190" rx="135" ry="170" fill="url(#g'+u+')"/>'+[[60,90],[240,70],[230,230],[70,250],[255,150]].map(([x,y],i)=>'<path d="M'+x+' '+(y-9)+'Q'+x+' '+y+' '+(x+9)+' '+y+'Q'+x+' '+y+' '+x+' '+(y+9)+'Q'+x+' '+y+' '+(x-9)+' '+y+'Q'+x+' '+y+' '+x+' '+(y-9)+'Z" fill="#fff" opacity="'+(.5+i%2*.4)+'"/>').join('');
  let back='',front='',strands='';
  if(c.style==='pony'){back='<path d="M196 70Q268 46 266 132Q266 206 230 246Q246 196 232 162Q222 122 200 108Z" fill="'+H+'" '+O+'/><path d="M84 124Q80 48 150 42Q220 48 216 124L222 216Q204 170 198 144L102 144Q96 170 78 216Z" fill="'+H+'" '+O+'/>';
    front='<path d="M86 132Q84 58 150 50Q214 56 216 128Q200 90 164 84Q174 104 152 118Q132 96 118 90Q100 104 86 132Z" fill="'+H+'" '+O+'/><path d="M90 128Q92 170 86 210M210 126Q212 170 216 206" fill="none" stroke="'+hd+'" stroke-width="7" stroke-linecap="round"/>'+
      (k==='lucas'?'<circle cx="203" cy="78" r="9" fill="#74c0fc" '+O+'/><path d="M100 96l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z" fill="#ffd43b" stroke="'+L+'" stroke-width="2"/>':'');
    strands='<path d="M228 120Q246 170 236 220M244 110Q258 150 250 200" fill="none" stroke="'+hl+'" stroke-width="2" opacity=".7"/>';}
  else if(c.style==='bob'){back='<path d="M82 132Q74 46 150 40Q226 46 218 132L226 206Q190 218 186 164L114 164Q110 218 74 206Z" fill="'+H+'" '+O+'/>';
    front='<path d="M86 134Q84 56 150 50Q216 56 214 134Q200 96 150 90Q104 94 86 134Z" fill="'+H+'" '+O+'/>';strands='<path d="M90 150Q94 180 84 200M210 150Q206 180 216 200" fill="none" stroke="'+hl+'" stroke-width="2" opacity=".7"/>';}
  else if(c.style==='curls'){back='<path d="M74 150Q54 108 82 78Q88 36 140 34Q198 26 216 70Q248 98 228 150Q252 192 224 232Q196 248 186 204L114 204Q100 248 72 232Q48 192 74 150Z" fill="'+H+'" '+O+'/>'+[[70,180],[228,180],[80,222],[220,222]].map(([x,y])=>'<path d="M'+x+' '+y+'q12 -10 0 -22" fill="none" stroke="'+hd+'" stroke-width="2.5"/>').join('');
    front='<path d="M86 132Q82 58 150 50Q218 58 214 132Q200 94 176 88Q168 108 146 98Q126 90 110 96Q96 106 86 132Z" fill="'+H+'" '+O+'/>';}
  else if(c.style==='spiky'){back='<path d="M84 140L60 112L82 98L54 66L92 68L80 26L120 48L134 4L156 44L186 10L190 52L232 38L214 82L250 96L216 116L216 140Z" fill="'+H+'" '+O+'/>';front='<path d="M88 132L92 84L108 112L116 72L134 104L150 66L166 104L182 74L192 110L208 86L212 132Q150 96 88 132Z" fill="'+H+'" '+O+'/>';strands='<path d="M120 46L130 22M170 40L182 18" stroke="'+hl+'" stroke-width="3" opacity=".7"/>';}
  else if(c.style==='short'){back='<path d="M86 140Q80 50 150 44Q220 50 214 140Z" fill="'+H+'" '+O+'/>';front='<path d="M88 128Q86 58 150 52Q214 58 212 128Q196 92 170 90Q160 102 140 96Q110 92 88 128Z" fill="'+H+'" '+O+'/>';}
  else {back='<circle cx="150" cy="40" r="30" fill="'+H+'" '+O+'/><path d="M128 30q22-14 44 0" fill="none" stroke="'+hl+'" stroke-width="3"/>';front='<path d="M88 130Q86 56 150 50Q214 56 212 130Q190 84 150 82Q110 84 88 130Z" fill="'+H+'" '+O+'/>';}
  const shine='<path d="M104 74Q150 56 196 76" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/><path d="M118 82Q150 70 182 82" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>';
  const bust='<path d="M58 400Q58 300 150 286Q242 300 242 400Z" fill="url(#t'+u+')" '+O+'/>'+(c.apron?'<path d="M112 320L188 320L196 400L104 400Z" fill="#fff" '+O+'/>':'')+
    '<path d="M116 294Q150 334 184 294" fill="none" stroke="'+c.trim+'" stroke-width="8"/><path d="M100 330Q120 360 118 400M200 330Q180 360 182 400" fill="none" stroke="'+shade(c.top,-.3)+'" stroke-width="2" opacity=".6"/>'+
    (c.pearls?[0,1,2,3,4,5,6].map(i=>'<circle cx="'+(122+i*9.5)+'" cy="'+(300+Math.sin(i/6*Math.PI)*14)+'" r="4.5" fill="#fff" stroke="#ced4da"/>').join(''):'')+'<path d="M134 248L134 292Q150 302 166 292L166 248Z" fill="'+skd+'" '+O+'/>';
  const face='<path d="M90 118Q90 238 150 264Q210 238 210 118Q210 66 150 64Q90 66 90 118Z" fill="url(#s'+u+')" '+O+'/>';
  const eye=(x,side)=>{if(mood==='laugh')return '<path d="M'+(x-18)+' 172Q'+x+' 150 '+(x+18)+' 172" fill="none" stroke="'+L+'" stroke-width="5" stroke-linecap="round"/>';
    const ry=mood==='surprised'?25:mood==='sad'?18:mood==='proud'?15:22,cy=172,top=cy-ry;
    let e='<ellipse cx="'+x+'" cy="'+cy+'" rx="17" ry="'+ry+'" fill="#fff"/><ellipse cx="'+x+'" cy="'+(cy+2)+'" rx="13" ry="'+(ry-2)+'" fill="url(#i'+u+')"/><ellipse cx="'+x+'" cy="'+(cy+4)+'" rx="6" ry="'+(ry*.42)+'" fill="'+shade(c.iris,-.75)+'"/>'+
      '<ellipse cx="'+(x-5)+'" cy="'+(cy-ry*.38)+'" rx="5.5" ry="7" fill="#fff"/><circle cx="'+(x+6)+'" cy="'+(cy+ry*.45)+'" r="2.8" fill="#fff"/><circle cx="'+(x+7)+'" cy="'+(cy-ry*.2)+'" r="1.6" fill="#fff" opacity=".9"/>'+
      '<path d="M'+(x-21)+' '+(top+6)+'Q'+(x-4)+' '+(top-8)+' '+(x+19)+' '+(top+3)+'" fill="none" stroke="#3a2020" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<path d="M'+(x-16)+' '+(top-6)+'Q'+x+' '+(top-14)+' '+(x+16)+' '+(top-6)+'" fill="none" stroke="'+L+'" stroke-width="1.5" opacity=".7"/><path d="M'+(x-10)+' '+(cy+ry+2)+'Q'+x+' '+(cy+ry+5)+' '+(x+10)+' '+(cy+ry+1)+'" fill="none" stroke="'+L+'" stroke-width="1.5"/>';
    if(mood==='proud')e+='<path d="M'+(x-20)+' '+(cy-ry+7)+'Q'+x+' '+(cy-ry+3)+' '+(x+20)+' '+(cy-ry+7)+'L'+(x+20)+' '+(cy-ry-12)+'L'+(x-20)+' '+(cy-ry-12)+'Z" fill="'+sk+'"/><path d="M'+(x-19)+' '+(cy-ry+8)+'Q'+x+' '+(cy-ry+3)+' '+(x+20)+' '+(cy-ry+8)+'" fill="none" stroke="#3a2020" stroke-width="4.5"/>';
    if(false)e+='<path d="M'+(x+5)+' '+(cy-4)+'l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#fff"/>';
    return e;};
  const by=mood==='surprised'?128:mood==='sad'?136:134,brow=mood==='sad'?'<path d="M104 '+(by+4)+'Q118 '+(by-6)+' 136 '+(by+2)+'M164 '+(by+2)+'Q182 '+(by-6)+' 196 '+(by+4)+'" fill="none" stroke="'+hd+'" stroke-width="3.2" stroke-linecap="round"/>':mood==='angry'?'<path d="M106 128L136 140M164 140L194 128" fill="none" stroke="'+hd+'" stroke-width="3.6" stroke-linecap="round"/>':'<path d="M104 '+by+'Q120 '+(by-8)+' 136 '+(by-2)+'M164 '+(by-2)+'Q180 '+(by-8)+' 196 '+by+'" fill="none" stroke="'+hd+'" stroke-width="3" stroke-linecap="round"/>';
  const lip='#8a4a40',mouth=mood==='happy'||mood==='laugh'?'<path d="M132 214Q150 238 168 214Q150 222 132 214Z" fill="#8c3a36" stroke="'+L+'" stroke-width="2"/><path d="M140 226Q150 230 160 226" stroke="#e07a7a" stroke-width="3" fill="none"/>':
    mood==='surprised'?'<ellipse cx="150" cy="222" rx="8" ry="11" fill="#1864ab" stroke="'+L+'" stroke-width="2"/>':mood==='sad'?'<path d="M138 226Q150 216 162 226" fill="none" stroke="'+lip+'" stroke-width="3" stroke-linecap="round"/>':
    mood==='proud'?'<path d="M134 216Q154 226 168 210" fill="none" stroke="'+lip+'" stroke-width="3.2" stroke-linecap="round"/>':mood==='angry'?'<path d="M138 224Q150 216 162 224" fill="none" stroke="'+lip+'" stroke-width="3" stroke-linecap="round"/>':'<path d="M138 216Q150 224 162 216" fill="none" stroke="'+lip+'" stroke-width="3" stroke-linecap="round"/>';
  const nose='<path d="M151 190q3 5 -1 8" fill="none" stroke="'+shade(sk,-.3)+'" stroke-width="2" stroke-linecap="round"/>';
  const extra=(c.glasses?'<g fill="none" stroke="'+L+'" stroke-width="2.6"><rect x="98" y="150" width="40" height="38" rx="12"/><rect x="162" y="150" width="40" height="38" rx="12"/><path d="M138 166h24"/></g><path d="M104 158l10-4" stroke="#fff" stroke-width="2" opacity=".7"/>':'')+(mood==='sad'?'<path d="M184 196q-5 12 2 16q7-4 2-16z" fill="#a5d8ff" stroke="#4dabf7" stroke-width="1"/>':'')+(mood==='surprised'?'<path d="M216 98l10-8M222 116l14-2" stroke="'+L+'" stroke-width="3" stroke-linecap="round"/>':'')+(mood==='angry'?'<path d="M206 84l8 6-8 6M214 78l10 4" stroke="#e03131" stroke-width="3" fill="none"/>':'');
  return '<svg viewBox="40 20 230 380" preserveAspectRatio="xMidYMax meet" class="ptr">'+defs+glow+back+strands+bust+face+eye(124,-1)+eye(176,1)+brow+nose+mouth+extra+front+shine+'</svg>';}

let DLG=null;
function dlg(lines,done){if(!Array.isArray(lines)||!lines.length){done&&done();return;}
  let i=0,typing=null,full='';const el=document.createElement('div');el.id='dlg';
  el.innerHTML='<div class="dp" id="dp"></div><div class="dband"><div class="dwin"><div class="dname" id="dn"></div><div class="dtxt" id="dt"></div><span class="dnext">▶</span></div></div><button class="dskip" id="dsk">Skip ⏭</button>';
  document.body.appendChild(el);DLG=el;
  const show=()=>{const [who,mood,text]=lines[i],c=CAST[who];const dp=el.querySelector('#dp');
    if(dp.dataset.who!==who){dp.dataset.who=who;dp.classList.remove('in');void dp.offsetWidth;dp.classList.add('in');}
    dp.innerHTML=portrait(who,mood);el.querySelector('#dn').textContent=c.name;full=text.replace(/\{n\}/g,ME||'Lucas');const dt=el.querySelector('#dt');dt.textContent='';let k=0;clearInterval(typing);
    typing=setInterval(()=>{k+=2;dt.textContent=full.slice(0,k);if(k%6===0&&SOUND)tone(who==='lucas'?880:who==='stella'?990:660,.02,'square',.025);if(k>=full.length){clearInterval(typing);typing=null;}},28);
    say(full);};
  const end=()=>{clearInterval(typing);el.remove();DLG=null;try{speechSynthesis.cancel();}catch(e){}done&&done();};
  el.onclick=e=>{if(e.target.id==='dsk')return end();if(typing){clearInterval(typing);typing=null;el.querySelector('#dt').textContent=full;return;}i++;if(i>=lines.length)end();else show();};
  show();}
