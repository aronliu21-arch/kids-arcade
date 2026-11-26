/* ---------- art: full-art action cards (original designs) ---------- */
const O='#1b1f3b',SW='stroke="#1b1f3b" stroke-width="2.5" stroke-linejoin="round"';
function seeded(n){let s=n*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
/* type symbol: coloured disc with a white glyph */
function ticon(t,x,y,r){const k=r/8,g={
 fire:`<path d="M0 -6Q5 -1 4 2Q4 6 0 6Q-4 6 -4 2Q-4 -1 -1 -3Q-1 0 1 0Q1 -3 0 -6Z"/>`,
 water:`<path d="M0 -6Q5 0 5 2.5A5 5 0 0 1 -5 2.5Q-5 0 0 -6Z"/>`,
 leaf:`<path d="M-5 5Q-6 -5 5 -6Q6 5 -5 5Z"/>`,
 spark:`<path d="M1 -7L-5 1H-1L-2 7L5 -1H1Z"/>`,
 rock:`<path d="M-5 3L-3 -4L3 -5L6 1L2 5Z"/>`,
 sky:`<path d="M-6 -1Q-1 -6 4 -2Q6 1 2 2Q-1 2 0 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M-5 3H4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`}[t];
 return `<g transform="translate(${x} ${y}) scale(${k})"><circle r="8" fill="${T[t].c}" stroke="${O}" stroke-width="1.6"/><g fill="#fff">${g}</g></g>`;}
/* angry almond eyes with V brows */
function eyes(x1,x2,y,glow){const iris=glow?'#ffd43b':O;let s='';
 [[x1,1],[x2,-1]].forEach(([x,d])=>{s+=`<path d="M${x-6*d} ${y-5}L${x+6*d} ${y-1}Q${x+6*d} ${y+6} ${x} ${y+6}Q${x-7*d} ${y+5} ${x-6*d} ${y-5}Z" fill="#fff" ${SW}/><circle cx="${x+2*d}" cy="${y+1.5}" r="3.3" fill="${iris}"/>${glow?`<circle cx="${x+2*d}" cy="${y+1.5}" r="1.5" fill="${O}"/>`:''}<circle cx="${x+3*d}" cy="${y}" r="1.2" fill="#fff"/>`;});
 s+=`<path d="M${x1-9} ${y-11}L${x1+6} ${y-4}M${x2+9} ${y-11}L${x2-6} ${y-4}" stroke="${O}" stroke-width="3.6" stroke-linecap="round"/>`;return s;}
function fangMouth(x,y,w){w=w||9;return `<path d="M${x-w} ${y}Q${x} ${y+w*1.3} ${x+w} ${y}Z" fill="#a61e4d" ${SW}/><path d="M${x-w+2} ${y+.5}L${x-w+4} ${y+5}L${x-w+6} ${y+.5}ZM${x+w-2} ${y+.5}L${x+w-4} ${y+5}L${x+w-6} ${y+.5}Z" fill="#fff" stroke="${O}" stroke-width="1"/>`;}
function claws(x,y,n,dir){let s='';for(let i=0;i<n;i++)s+=`<path d="M${x+i*4-4} ${y}L${x+i*4-3+dir*2} ${y+5}L${x+i*4-1} ${y}Z" fill="#fff" stroke="${O}" stroke-width="1"/>`;return s;}
function flourish(t,x,y){
 if(t==='fire')return `<path d="M${x} ${y-18}Q${x+13} ${y-4} ${x+2} ${y+7}Q${x-12} ${y+2} ${x-6} ${y-8}Q${x-3} ${y-2} ${x} ${y-18}Z" fill="#ff922b" ${SW}/><path d="M${x} ${y-7}Q${x+6} ${y} ${x+1} ${y+4}Q${x-5} ${y+1} ${x} ${y-7}Z" fill="#ffe066"/>`;
 if(t==='spark')return `<path d="M${x-3} ${y-18}L${x+10} ${y-4}L${x+2} ${y-3}L${x+8} ${y+11}L${x-9} ${y-4}L${x-1} ${y-6}Z" fill="#ffe066" ${SW}/>`;
 if(t==='leaf')return `<path d="M${x} ${y+2}Q${x-16} ${y-14} ${x+2} ${y-24}Q${x+16} ${y-8} ${x} ${y+2}Z" fill="#51cf66" ${SW}/><path d="M${x} ${y+2}L${x+1} ${y-18}" stroke="${O}" stroke-width="1.5"/>`;
 if(t==='water')return `<path d="M${x} ${y-16}Q${x+9} ${y-3} ${x+6} ${y+2}A7 7 0 0 1 ${x-6} ${y+2}Q${x-9} ${y-3} ${x} ${y-16}Z" fill="#74c0fc" ${SW}/>`;
 if(t==='rock')return `<path d="M${x-11} ${y+3}L${x-6} ${y-15}L${x} ${y+3}ZM${x-2} ${y+3}L${x+5} ${y-22}L${x+12} ${y+3}Z" fill="#91a7ff" ${SW}/>`;
 return `<g fill="#fff" ${SW}><circle cx="${x}" cy="${y-6}" r="7"/><circle cx="${x+9}" cy="${y-9}" r="6"/><circle cx="${x+16}" cy="${y-4}" r="5"/></g>`;}
/* creatures in a 148x92 box: every card gets its own original creature */
function crown(x,y,k){k=k||1;return `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-14 6L-16 -10L-7 -2L0 -14L7 -2L16 -10L14 6Z" fill="#ffd43b" ${SW}/><circle cx="0" cy="-1" r="2.6" fill="#e03131"/><circle cx="-9" cy="2" r="1.8" fill="#339af0"/><circle cx="9" cy="2" r="1.8" fill="#339af0"/></g>`;}
function spikyRing(cx,cy,r1,r2,n,fill){let p='';for(let i=0;i<n*2;i++){const r=i%2?r1:r2,a=i*Math.PI/n-Math.PI/2;p+=(i?'L':'M')+(cx+r*Math.cos(a)).toFixed(1)+' '+(cy+r*Math.sin(a)).toFixed(1);}return `<path d="${p}Z" fill="${fill}" ${SW}/>`;}
/* ---- extra bodies for the expansion ---- */
function eyesK(x1,x2,y,g,k){const cx=(x1+x2)/2;return `<g transform="translate(${cx} ${y}) scale(${k}) translate(${-cx} ${-y})">${eyes(x1,x2,y,g)}</g>`;}
function body2(c,a,b,g){const t=c.type;switch(c.tpl){
 case 'frog':return `<ellipse cx="38" cy="80" rx="15" ry="9" fill="${a}" ${SW}/><ellipse cx="110" cy="80" rx="15" ry="9" fill="${a}" ${SW}/><path d="M30 88h14M104 88h14" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="74" cy="64" rx="35" ry="23" fill="${a}" ${SW}/><ellipse cx="74" cy="72" rx="22" ry="12" fill="${b}"/><circle cx="56" cy="38" r="13" fill="${a}" ${SW}/><circle cx="92" cy="38" r="13" fill="${a}" ${SW}/>`+eyes(56,92,39,g)+
  `<path d="M48 56Q74 70 100 56Q74 64 48 56Z" fill="#a61e4d" ${SW}/><path d="M66 60Q74 76 80 60" fill="#ff8787" ${SW}/><path d="M52 57L55 62L58 58M90 58L93 62L96 57" fill="#fff" stroke="${O}" stroke-width="1"/>`;
 case 'scorpion':return [[56,64,30,70,24,84],[56,70,32,80,30,92],[92,64,118,70,124,84],[92,70,116,80,118,92]].map(([x1,y1,x2,y2,x3,y3])=>`<path d="M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}" fill="none" stroke="${O}" stroke-width="4"/>`).join('')+
  `<path d="M80 70Q128 84 124 44Q122 14 100 12" stroke="${O}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M80 70Q128 84 124 44Q122 14 100 12" stroke="${a}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M104 6L88 12L102 20Z" fill="${b}" ${SW}/>
  <path d="M54 52L36 40M94 52L112 40" stroke="${O}" stroke-width="8" stroke-linecap="round"/><path d="M54 52L36 40M94 52L112 40" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
  <path d="M18 36Q20 20 36 22L32 32L42 34Q38 48 24 46Z" fill="${a}" ${SW}/><path d="M130 36Q128 20 112 22L116 32L106 34Q110 48 124 46Z" fill="${a}" ${SW}/>
  <ellipse cx="74" cy="66" rx="24" ry="15" fill="${a}" ${SW}/><path d="M58 64H90M60 72H88" stroke="${b}" stroke-width="2.5"/><ellipse cx="74" cy="50" rx="17" ry="12" fill="${a}" ${SW}/>`+eyesK(67,81,48,g,.8)+fangMouth(74,55,5);
 case 'mantis':return `<path d="M66 84L58 92M82 84L90 92M64 76L46 90M84 76L102 90" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="74" cy="74" rx="14" ry="17" fill="${a}" ${SW}/><path d="M64 70H84M64 78H84" stroke="${b}" stroke-width="2.5"/>
  <path d="M64 50L40 34L22 8L44 28L66 42Z" fill="${b}" ${SW}/><path d="M84 50L108 34L126 8L104 28L82 42Z" fill="${b}" ${SW}/><path d="M28 14L34 18M36 22L42 26M120 14L114 18M112 22L106 26" stroke="${O}" stroke-width="1.6"/>
  <ellipse cx="74" cy="52" rx="11" ry="13" fill="${a}" ${SW}/><path d="M56 22L92 22L74 46Z" fill="${a}" ${SW}/><path d="M60 22L52 4M88 22L96 4" stroke="${O}" stroke-width="2"/><ellipse cx="62" cy="26" rx="7" ry="8" fill="#fff" ${SW}/><ellipse cx="86" cy="26" rx="7" ry="8" fill="#fff" ${SW}/><circle cx="64" cy="27" r="3.4" fill="${g?'#ffd43b':O}"/><circle cx="84" cy="27" r="3.4" fill="${g?'#ffd43b':O}"/><path d="M54 16L68 22M94 16L80 22" stroke="${O}" stroke-width="3.2" stroke-linecap="round"/><path d="M70 38L74 44L78 38" fill="#fff" stroke="${O}" stroke-width="1.2"/>`;
 case 'owl':return `<path d="M64 84L58 92M70 86L68 92M80 86L82 92M86 84L92 92" stroke="#f08c00" stroke-width="3" stroke-linecap="round"/><path d="M46 46Q30 66 48 86L56 60ZM102 46Q118 66 100 86L92 60Z" fill="${b}" ${SW}/><ellipse cx="74" cy="56" rx="28" ry="32" fill="${a}" ${SW}/>
  <path d="M52 30L46 8L62 24ZM96 30L102 8L86 24Z" fill="${a}" ${SW}/><circle cx="62" cy="44" r="13" fill="${b}" ${SW}/><circle cx="86" cy="44" r="13" fill="${b}" ${SW}/><path d="M64 70L70 76L74 70L78 76L84 70" fill="none" stroke="${b}" stroke-width="2.5"/>`+eyes(62,86,44,g)+`<path d="M70 52H78L74 60Z" fill="#ffa94d" ${SW}/>`;
 case 'raptor':return `<path d="M98 54Q130 46 146 26Q132 54 100 64Z" fill="${a}" ${SW}/><path d="M80 64L84 84L76 92H90L92 82L88 64ZM64 62L62 84L54 92H68L70 82L72 64Z" fill="${a}" ${SW}/>`+claws(58,92,3,-1)+claws(80,92,3,1)+
  `<ellipse cx="78" cy="54" rx="26" ry="15" fill="${a}" ${SW}/><path d="M62 50Q78 42 96 50" stroke="${b}" stroke-width="4" fill="none"/><path d="M58 56L48 66L54 68Z" fill="${a}" ${SW}/>
  <path d="M60 48Q52 34 46 28L34 34Q44 42 52 54Z" fill="${a}" ${SW}/><path d="M50 22Q34 14 14 22L10 32Q26 40 50 36Z" fill="${a}" ${SW}/><path d="M12 30L48 34" stroke="${O}" stroke-width="1.6"/><path d="M14 29L16 33L19 29L21 33L24 29L26 33L29 30" fill="#fff" stroke="${O}" stroke-width=".9"/>`+eyesK(32,44,22,g,.75);
 case 'ram':return `<path d="M52 84L50 92H62L62 84ZM86 84L86 92H98L96 84Z" fill="${O}"/>`+spikyRing(74,68,22,28,14,b)+`<ellipse cx="74" cy="68" rx="24" ry="18" fill="${b}"/>
  <circle cx="74" cy="42" r="16" fill="${a}" ${SW}/><circle cx="50" cy="38" r="13" fill="${a}" ${SW}/><circle cx="98" cy="38" r="13" fill="${a}" ${SW}/><path d="M50 38m-8 0a8 8 0 1 0 8-8M98 38m8 0a8 8 0 1 1 -8-8" fill="none" stroke="${O}" stroke-width="2.2"/>`+eyes(67,81,40,g)+`<ellipse cx="74" cy="52" rx="7" ry="4" fill="${b}" ${SW}/>`;
 case 'manta':return `<path d="M74 70Q80 86 104 92" stroke="${O}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M74 30Q100 30 144 52Q112 62 92 70Q74 78 56 70Q36 62 4 52Q48 30 74 30Z" fill="${a}" ${SW}/><path d="M46 52Q74 66 102 52Q74 74 46 52Z" fill="${b}"/>
  <path d="M58 32L52 14L66 30ZM90 32L96 14L82 30Z" fill="${a}" ${SW}/>`+eyesK(64,84,42,g,.85)+fangMouth(74,52,6);
 case 'yeti':return spikyRing(74,58,30,37,18,a)+`<path d="M30 52Q14 66 20 88L36 86Q32 70 42 62Z" fill="${a}" ${SW}/><path d="M118 52Q134 66 128 88L112 86Q116 70 106 62Z" fill="${a}" ${SW}/><circle cx="28" cy="88" r="9" fill="${b}" ${SW}/><circle cx="120" cy="88" r="9" fill="${b}" ${SW}/>
  <path d="M54 30Q74 22 94 30Q98 50 88 58Q74 64 60 58Q50 50 54 30Z" fill="${b}" ${SW}/><path d="M56 22L50 8L62 18ZM92 22L98 8L86 18Z" fill="#f8f9fa" ${SW}/>`+eyes(66,82,38,g)+fangMouth(74,48,7);
 case 'robot':return `<path d="M60 80L56 92H70L68 80ZM80 80L80 92H94L90 80Z" fill="${b}" ${SW}/><rect x="50" y="46" width="48" height="36" rx="6" fill="${a}" ${SW}/><circle cx="74" cy="62" r="8" fill="${b}" ${SW}/><circle cx="74" cy="62" r="3.5" fill="#ffe066"/>
  <rect x="24" y="48" width="22" height="12" rx="4" fill="${a}" ${SW}/><rect x="16" y="44" width="12" height="20" rx="3" fill="${b}" ${SW}/><rect x="102" y="48" width="22" height="12" rx="4" fill="${a}" ${SW}/><path d="M120 42L136 36V68L120 62Z" fill="${b}" ${SW}/>
  <path d="M74 18V6" stroke="${O}" stroke-width="2.5"/><circle cx="74" cy="5" r="3.5" fill="#ff6b6b" ${SW}/><rect x="54" y="16" width="40" height="28" rx="6" fill="${a}" ${SW}/><rect x="58" y="24" width="32" height="10" rx="4" fill="${O}"/>
  <path d="M61 26L71 30L61 32ZM87 26L77 30L87 32Z" fill="${g?'#ffd43b':'#ff6b6b'}"/><path d="M62 39H86" stroke="${O}" stroke-width="2"/><path d="M66 39v3M72 39v3M78 39v3M84 39v3" stroke="${O}" stroke-width="1.2"/>`;
 case 'jelly':return [44,58,74,90,104].map((x,i)=>`<path d="M${x} 46Q${x+(i%2?8:-8)} 62 ${x} 74T${x} 94" stroke="${O}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x} 46Q${x+(i%2?8:-8)} 62 ${x} 74T${x} 94" stroke="${b}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('')+
  `<path d="M40 50Q38 10 74 8Q110 10 108 50Q100 44 92 50Q84 44 74 50Q64 44 56 50Q48 44 40 50Z" fill="${a}" ${SW} opacity=".95"/><ellipse cx="62" cy="18" rx="8" ry="4" fill="#fff" opacity=".6"/>`+eyes(63,85,30,g)+fangMouth(74,38,5);
 case 'rhino':return `<path d="M100 74L100 90H112L110 74ZM70 76L68 90H80L80 78Z" fill="${a}" ${SW}/><ellipse cx="88" cy="60" rx="34" ry="22" fill="${a}" ${SW}/><path d="M70 46Q88 38 110 46M72 56Q90 50 116 56" stroke="${b}" stroke-width="4" fill="none"/>
  <path d="M120 54Q136 52 140 40" stroke="${O}" stroke-width="3" fill="none"/><ellipse cx="44" cy="54" rx="24" ry="18" fill="${a}" ${SW}/><path d="M28 48L14 18L36 42Z" fill="#f8f9fa" ${SW}/><path d="M40 40L38 26L48 38Z" fill="#f8f9fa" ${SW}/>
  <path d="M54 36L58 24L64 38Z" fill="${a}" ${SW}/>`+eyesK(42,58,48,g,.8)+`<path d="M24 64Q36 70 50 64" fill="none" stroke="${O}" stroke-width="2.4"/>`;
 case 'dragon':return `<path d="M56 46Q20 6 4 22Q16 28 10 38Q22 36 22 48Q34 42 42 56Z" fill="${b}" ${SW}/><path d="M92 46Q128 6 144 22Q132 28 138 38Q126 36 126 48Q114 42 106 56Z" fill="${b}" ${SW}/><path d="M56 46L22 22M92 46L126 22" stroke="${O}" stroke-width="1.6"/>
  <path d="M96 78Q130 88 138 62" stroke="${O}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M96 78Q130 88 138 62" stroke="${a}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M134 66L146 54L140 70Z" fill="${b}" ${SW}/>
  <path d="M60 80L56 92H70L70 82ZM86 82L86 92H100L96 80Z" fill="${a}" ${SW}/>`+claws(58,92,3,-1)+claws(90,92,3,1)+`<ellipse cx="76" cy="66" rx="25" ry="24" fill="${a}" ${SW}/><ellipse cx="76" cy="70" rx="13" ry="17" fill="${b}" ${SW}/><path d="M64 62H88M64 70H88M66 78H86" stroke="${O}" stroke-width="1.4"/>
  <path d="M62 22L54 2L68 16ZM88 22L96 2L82 16Z" fill="#f8f9fa" ${SW}/><ellipse cx="75" cy="30" rx="19" ry="15" fill="${a}" ${SW}/><ellipse cx="75" cy="40" rx="12" ry="7" fill="${b}" ${SW}/><circle cx="70" cy="38" r="1.4" fill="${O}"/><circle cx="80" cy="38" r="1.4" fill="${O}"/>`+eyes(67,83,27,g)+fangMouth(75,43,6);
 case 'treant':return `<path d="M50 90L46 82L58 84ZM98 90L102 82L90 84Z" fill="#8d6e63" ${SW}/><path d="M56 40L50 90H98L92 40Z" fill="${a}" ${SW}/><path d="M64 48L62 84M74 46V86M84 48L86 84" stroke="${O}" stroke-width="1.5" opacity=".5"/>
  <path d="M56 52Q30 44 22 26M92 52Q118 44 126 26" stroke="${O}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M56 52Q30 44 22 26M92 52Q118 44 126 26" stroke="${a}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="20" cy="22" rx="9" ry="6" fill="${b}" ${SW}/><ellipse cx="128" cy="22" rx="9" ry="6" fill="${b}" ${SW}/>
  ${[[48,26,17],[74,14,22],[100,26,17],[60,36,15],[88,36,15]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${b}" ${SW}/>`).join('')}<path d="M60 52Q74 46 88 52L86 68Q74 72 62 68Z" fill="${O}"/>`+eyesK(66,82,57,g,.8)+`<path d="M64 74L68 70L72 76L76 70L80 76L84 72" stroke="${O}" stroke-width="2.6" fill="none"/>`;
 case 'snail':return `<path d="M10 88Q14 70 44 72L118 72Q138 74 136 88Z" fill="${b}" ${SW}/><path d="M30 66L20 38M40 64L38 34" stroke="${O}" stroke-width="3"/><circle cx="20" cy="36" r="8" fill="#fff" ${SW}/><circle cx="38" cy="32" r="8" fill="#fff" ${SW}/><circle cx="21" cy="37" r="3.6" fill="${g?'#ffd43b':O}"/><circle cx="39" cy="33" r="3.6" fill="${g?'#ffd43b':O}"/>
  <path d="M12 26L26 32M46 22L32 28" stroke="${O}" stroke-width="3" stroke-linecap="round"/><circle cx="36" cy="72" r="14" fill="${b}" ${SW}/>`+fangMouth(30,76,5)+`<circle cx="84" cy="48" r="31" fill="${a}" ${SW}/><path d="M84 48m-4 0a4 4 0 1 1 8 0a9 9 0 1 1 -18 0a15 15 0 1 1 30 0a21 21 0 1 1 -42 0" fill="none" stroke="${O}" stroke-width="3"/>`;
 case 'spider':return [[-1,0],[1,0]].map(([d])=>[[50,52,22,34,10,48],[52,60,20,56,8,74],[54,68,26,78,16,92],[58,74,40,90,34,94]].map(([x1,y1,x2,y2,x3,y3])=>`<path d="M${74+d*(x1-74)} ${y1}L${74+d*(x2-74)} ${y2}L${74+d*(x3-74)} ${y3}" fill="none" stroke="${O}" stroke-width="5" stroke-linejoin="round"/>`).join('')).join('')+
  `<ellipse cx="74" cy="36" rx="24" ry="20" fill="${b}" ${SW}/><path d="M64 30L74 20L84 30L74 40Z" fill="${a}" opacity=".8"/><circle cx="74" cy="62" r="22" fill="${a}" ${SW}/>`+eyesK(66,82,58,g,.85)+`<circle cx="60" cy="50" r="3" fill="${O}"/><circle cx="88" cy="50" r="3" fill="${O}"/><circle cx="66" cy="47" r="2.2" fill="${O}"/><circle cx="82" cy="47" r="2.2" fill="${O}"/>
  <path d="M68 72L66 82L72 74ZM80 72L82 82L76 74Z" fill="#fff" ${SW}/>`;
 case 'penguin':return `<path d="M60 86L52 92H68ZM88 86L80 92H96Z" fill="#ff922b" ${SW}/><path d="M48 50Q30 66 36 80L52 66ZM100 50Q118 66 112 80L96 66Z" fill="${a}" ${SW}/><ellipse cx="74" cy="56" rx="27" ry="34" fill="${a}" ${SW}/><ellipse cx="74" cy="64" rx="18" ry="24" fill="${b}"/>`+eyes(65,83,40,g)+`<path d="M68 48H80L74 56Z" fill="#ff922b" ${SW}/>`;
 case 'griffin':return `<path d="M100 66Q132 64 136 40" stroke="${O}" stroke-width="5" fill="none"/>`+flourish(t,136,42)+`<path d="M60 76L56 92H70L70 78ZM96 76L96 92H110L106 76Z" fill="${b}" ${SW}/>`+claws(58,92,3,-1)+`<ellipse cx="86" cy="66" rx="30" ry="17" fill="${b}" ${SW}/>
  <path d="M74 54L94 8L104 22L112 6L114 30L124 22L116 54Z" fill="${a}" ${SW}/><path d="M64 50L40 72L48 74L44 90L58 82L62 90L66 70Z" fill="${a}" ${SW}/>
  <circle cx="52" cy="40" r="17" fill="${a}" ${SW}/><path d="M40 30L44 16L50 28ZM54 26L62 12L62 28Z" fill="${a}" ${SW}/><path d="M32 42H46Q44 56 34 54Q38 50 32 42Z" fill="#ffa94d" ${SW}/>`+eyesK(47,59,36,g,.8);
 case 'crab':return [[-1],[1]].map(([d])=>[[50,72,30,80,24,92],[54,76,38,88,34,94],[58,78,48,90,46,94]].map(([x1,y1,x2,y2,x3,y3])=>`<path d="M${74+d*(x1-74)} ${y1}L${74+d*(x2-74)} ${y2}L${74+d*(x3-74)} ${y3}" fill="none" stroke="${O}" stroke-width="4"/>`).join('')).join('')+
  `<path d="M48 60L28 40M100 60L120 40" stroke="${O}" stroke-width="8" stroke-linecap="round"/><path d="M48 60L28 40M100 60L120 40" stroke="${a}" stroke-width="4" stroke-linecap="round"/>
  <path d="M14 36Q12 14 32 16L30 28L42 30Q40 46 24 44Z" fill="${a}" ${SW}/><path d="M134 36Q136 14 116 16L118 28L106 30Q108 46 124 44Z" fill="${a}" ${SW}/>
  <ellipse cx="74" cy="64" rx="36" ry="19" fill="${a}" ${SW}/><path d="M50 58Q74 48 98 58" stroke="${b}" stroke-width="4" fill="none"/><path d="M66 50L62 34M82 50L86 34" stroke="${O}" stroke-width="3"/>`+eyes(62,86,32,g)+fangMouth(74,68,7);
 case 'unicorn':return `<path d="M58 84L56 94H66L66 84ZM82 84L82 94H92L90 84Z" fill="${a}" ${SW}/><ellipse cx="74" cy="80" rx="26" ry="12" fill="${a}" ${SW}/>
  <path d="M86 18Q112 26 108 52Q100 44 98 58Q92 46 88 54Z" fill="${b}" ${SW}/><ellipse cx="74" cy="44" rx="17" ry="24" fill="${a}" ${SW}/><ellipse cx="74" cy="60" rx="12" ry="9" fill="${b}" ${SW}/><circle cx="70" cy="60" r="1.6" fill="${O}"/><circle cx="78" cy="60" r="1.6" fill="${O}"/>
  <path d="M62 24L60 10L68 20ZM86 24L88 10L80 20Z" fill="${a}" ${SW}/><path d="M70 20L74 -6L78 20Z" fill="#ffd43b" ${SW}/><path d="M71 12L77 10M70 6L77 4" stroke="${O}" stroke-width="1.2"/>`+eyes(67,81,38,g)+`<path d="M70 66Q74 69 78 66" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>`;
 case 'hydra':return `<path d="M60 70Q40 50 36 30M74 66V20M88 70Q108 50 112 30" stroke="${O}" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M60 70Q40 50 36 30M74 66V20M88 70Q108 50 112 30" stroke="${a}" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M60 86L58 92H70L70 86ZM80 86L80 92H92L90 86Z" fill="${a}" ${SW}/><ellipse cx="74" cy="74" rx="28" ry="15" fill="${a}" ${SW}/><path d="M58 76Q74 84 90 76" stroke="${b}" stroke-width="4" fill="none"/>`+
  [[36,28],[74,16],[112,28]].map(([x,y])=>`<path d="M${x-8} ${y-8}L${x-10} ${y-18}L${x-2} ${y-10}ZM${x+8} ${y-8}L${x+10} ${y-18}L${x+2} ${y-10}Z" fill="${b}" ${SW}/><circle cx="${x}" cy="${y}" r="12" fill="${a}" ${SW}/>`+eyesK(x-6,x+6,y-2,g,.6)+fangMouth(x,y+4,4)).join('');
 } return null;}
const ANCH={dragon:[75,12,76,46,76,66],treant:[74,0,74,36,74,64],snail:[84,16,84,48,84,48],spider:[74,18,74,40,74,62],penguin:[74,22,74,50,74,66],griffin:[52,22,96,50,86,66],crab:[74,46,74,62,74,62],unicorn:[74,16,100,40,74,80],frog:[74,26,74,46,74,66],scorpion:[74,38,74,60,74,68],mantis:[74,18,74,56,74,74],owl:[74,14,74,50,74,70],raptor:[34,12,80,40,78,56],ram:[74,24,74,58,74,72],manta:[74,28,74,48,74,58],
 yeti:[74,14,74,50,74,72],robot:[74,14,74,56,74,62],jelly:[74,8,74,28,74,34],rhino:[50,32,90,40,88,62],hydra:[74,2,74,56,74,74],
 wolf:[66,20,76,52,76,64],lion:[62,14,84,52,84,66],turtle:[74,48,74,40,74,60],sprout:[74,30,74,54,74,66],golem:[74,26,74,48,74,72],hawk:[74,26,74,50,74,62],beetle:[74,28,74,56,74,66],shark:[80,30,70,44,70,60],bat:[74,30,74,46,74,62],dino:[44,18,78,46,78,64],croc:[56,40,86,54,86,68],kraken:[74,6,74,30,74,40],bull:[74,14,74,60,74,66],gorilla:[74,18,74,52,74,62],wyvern:[74,6,74,40,74,64],phoenix:[74,26,74,44,74,56],serpent:[116,22,60,60,64,72]};
function addHead(k,x,y,b){switch(k){
 case 'horn':return `<path d="M${x-5} ${y+6}L${x+2} ${y-18}L${x+5} ${y+6}Z" fill="#f8f9fa" ${SW}/>`;
 case 'horns':return `<path d="M${x-14} ${y+6}Q${x-24} ${y-6} ${x-18} ${y-18}Q${x-14} ${y-6} ${x-6} ${y+4}ZM${x+14} ${y+6}Q${x+24} ${y-6} ${x+18} ${y-18}Q${x+14} ${y-6} ${x+6} ${y+4}Z" fill="#f8f9fa" ${SW}/>`;
 case 'crown':return crown(x,y-2,.8);
 case 'antlers':return `<path d="M${x-8} ${y+4}L${x-18} ${y-14}M${x-14} ${y-6}L${x-24} ${y-8}M${x-16} ${y-11}L${x-12} ${y-20}M${x+8} ${y+4}L${x+18} ${y-14}M${x+14} ${y-6}L${x+24} ${y-8}M${x+16} ${y-11}L${x+12} ${y-20}" stroke="${O}" stroke-width="5" stroke-linecap="round"/><path d="M${x-8} ${y+4}L${x-18} ${y-14}M${x-14} ${y-6}L${x-24} ${y-8}M${x-16} ${y-11}L${x-12} ${y-20}M${x+8} ${y+4}L${x+18} ${y-14}M${x+14} ${y-6}L${x+24} ${y-8}M${x+16} ${y-11}L${x+12} ${y-20}" stroke="#c19a6b" stroke-width="2.6" stroke-linecap="round"/>`;
 case 'crest':return `<path d="M${x-10} ${y+4}L${x-8} ${y-12}L${x-3} ${y}L${x} ${y-18}L${x+3} ${y}L${x+8} ${y-12}L${x+10} ${y+4}Z" fill="${b}" ${SW}/>`;
 case 'crystal':return `<path d="M${x-8} ${y+4}L${x-10} ${y-10}L${x-4} ${y+2}ZM${x-3} ${y+4}L${x} ${y-20}L${x+4} ${y+4}ZM${x+5} ${y+3}L${x+11} ${y-12}L${x+9} ${y+4}Z" fill="#a5d8ff" ${SW}/>`;
 case 'antenna':return `<path d="M${x-5} ${y+4}Q${x-12} ${y-10} ${x-16} ${y-14}M${x+5} ${y+4}Q${x+12} ${y-10} ${x+16} ${y-14}" stroke="${O}" stroke-width="2.2" fill="none"/><circle cx="${x-16}" cy="${y-14}" r="3.5" fill="#ffe066" ${SW}/><circle cx="${x+16}" cy="${y-14}" r="3.5" fill="#ffe066" ${SW}/>`;
 case 'flamehair':return flourish('fire',x,y);
 } return '';}
function addBack(k,x,y,a,b){switch(k){
 case 'batwings':return `<path d="M${x-10} ${y}Q${x-40} ${y-34} ${x-70} ${y-24}Q${x-60} ${y-14} ${x-64} ${y-4}Q${x-50} ${y-8} ${x-48} ${y+4}Q${x-36} ${y} ${x-12} ${y+10}Z" fill="${b}" ${SW}/><path d="M${x+10} ${y}Q${x+40} ${y-34} ${x+70} ${y-24}Q${x+60} ${y-14} ${x+64} ${y-4}Q${x+50} ${y-8} ${x+48} ${y+4}Q${x+36} ${y} ${x+12} ${y+10}Z" fill="${b}" ${SW}/>`;
 case 'wings':return `<path d="M${x-8} ${y}L${x-64} ${y-30}L${x-52} ${y-16}L${x-70} ${y-10}L${x-50} ${y-2}L${x-62} ${y+8}L${x-10} ${y+10}Z" fill="#fff" ${SW}/><path d="M${x+8} ${y}L${x+64} ${y-30}L${x+52} ${y-16}L${x+70} ${y-10}L${x+50} ${y-2}L${x+62} ${y+8}L${x+10} ${y+10}Z" fill="#fff" ${SW}/>`;
 case 'flames':return [[-34,-6],[34,-6],[-22,-24],[22,-24],[0,-34]].map(([dx,dy])=>flourish('fire',x+dx,y+dy)).join('');
 case 'crystals':return [[-36,0,18],[36,0,18],[-24,-22,22],[24,-22,22]].map(([dx,dy,k])=>`<path d="M${x+dx} ${y+dy-k}L${x+dx+k*.35} ${y+dy}L${x+dx} ${y+dy+k*.4}L${x+dx-k*.35} ${y+dy}Z" fill="#a5d8ff" ${SW}/>`).join('');
 case 'spikes':return spikyRing(x,y,24,40,12,O);
 case 'jets':return `<rect x="${x-34}" y="${y-6}" width="12" height="22" rx="3" fill="#868e96" ${SW}/><rect x="${x+22}" y="${y-6}" width="12" height="22" rx="3" fill="#868e96" ${SW}/>`+flourish('fire',x-28,y+30).replace('M','M')+`<path d="M${x-32} ${y+16}Q${x-28} ${y+34} ${x-24} ${y+16}ZM${x+24} ${y+16}Q${x+28} ${y+34} ${x+32} ${y+16}Z" fill="#ff922b" ${SW}/>`;
 case 'aura':return `<circle cx="${x}" cy="${y}" r="44" fill="none" stroke="#ffe066" stroke-width="5" opacity=".8"/><circle cx="${x}" cy="${y}" r="36" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>`;
 case 'shell':return `<path d="M${x-30} ${y+14}Q${x-30} ${y-24} ${x} ${y-26}Q${x+30} ${y-24} ${x+30} ${y+14}Z" fill="${b}" ${SW}/><path d="M${x-16} ${y-14}L${x-22} ${y-34}L${x-6} ${y-22}ZM${x+16} ${y-14}L${x+22} ${y-34}L${x+6} ${y-22}Z" fill="#f8f9fa" ${SW}/>`;
 } return '';}
function addMark(k,x,y,col){switch(k){
 case 'stripes':return `<path d="M${x-12} ${y-6}L${x-6} ${y+4}M${x-2} ${y-8}L${x+2} ${y+4}M${x+8} ${y-6}L${x+12} ${y+4}" stroke="${col}" stroke-width="3.2" stroke-linecap="round"/>`;
 case 'spots':return `<circle cx="${x-8}" cy="${y-2}" r="3.5" fill="${col}"/><circle cx="${x+6}" cy="${y-5}" r="2.6" fill="${col}"/><circle cx="${x+3}" cy="${y+5}" r="3" fill="${col}"/>`;
 case 'bolt':return `<path d="M${x+2} ${y-10}L${x-6} ${y+1}H${x}L${x-3} ${y+10}L${x+7} ${y-2}H${x+1}Z" fill="#ffe066" stroke="${O}" stroke-width="1.4"/>`;
 case 'star':return `<path d="M${x} ${y-8}L${x+2.4} ${y-2.5}L${x+8} ${y-2.5}L${x+3.5} ${y+1.5}L${x+5} ${y+7.5}L${x} ${y+4}L${x-5} ${y+7.5}L${x-3.5} ${y+1.5}L${x-8} ${y-2.5}L${x-2.4} ${y-2.5}Z" fill="#ffe066" stroke="${O}" stroke-width="1.4"/>`;
 case 'rings':return `<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="${col}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="4" fill="${col}"/>`;
 } return '';}
function creature(c){const [a,b]=c.pal,g=c.r==='legend'||c.r==='promo',an=ANCH[c.tpl]||[74,20,74,50,74,66],[h,bk,mk]=(c.ad||'||').split('|');
 return addBack(bk,an[2],an[3],a,b)+(body2(c,a,b,g)||creatureCore(c))+addMark(mk,an[4],an[5],b)+addHead(h,an[0],an[1],b);}
function creatureCore(c){const [a,b]=c.pal,t=c.type,g=c.r==='legend'||c.r==='promo',v=c.v||'';let s='';
 switch(c.tpl){
 case 'wolf':
  if(v==='fluffy')s+=[[100,58,132,22],[102,62,140,44],[100,66,134,66]].map(([x1,y1,x2,y2])=>`<path d="M${x1} ${y1}Q${x2-14} ${y2+14} ${x2} ${y2}" stroke="${O}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M${x1} ${y1}Q${x2-14} ${y2+14} ${x2} ${y2}" stroke="${b}" stroke-width="8" fill="none" stroke-linecap="round"/>`).join('')+flourish(t,136,24);
  else s+=`<path d="M98 64L116 60L110 52L130 46L120 40L140 20L118 30L120 18L102 40Z" fill="${a}" ${SW}/>`+flourish(t,138,22);
  s+=`<ellipse cx="90" cy="84" rx="9" ry="5" fill="${a}" ${SW}/><path d="M50 66L46 86H58L60 70Z" fill="${a}" ${SW}/>`+claws(52,86,3,-1)+
  `<ellipse cx="76" cy="64" rx="30" ry="17" fill="${a}" ${SW}/>`+(v==='fluffy'?spikyRing(66,58,12,17,9,b):`<path d="M56 56L62 74L66 62L70 76L74 62L78 74L84 56Z" fill="${b}" ${SW}/>`)+
  (v==='fluffy'?`<circle cx="50" cy="26" r="9" fill="${a}" ${SW}/><circle cx="84" cy="26" r="9" fill="${a}" ${SW}/>`:`<path d="M48 32L40 0L64 24Z" fill="${a}" ${SW}/><path d="M72 24L92 0L86 34Z" fill="${a}" ${SW}/><path d="M50 26L45 9L59 23ZM78 23L88 9L85 28Z" fill="${b}"/>`)+
  `<path d="M46 40L34 48L48 50ZM86 40L98 46L86 50Z" fill="${a}" ${SW}/><circle cx="66" cy="40" r="19" fill="${a}" ${SW}/><ellipse cx="64" cy="50" rx="10" ry="7" fill="${b}" ${SW}/><ellipse cx="64" cy="45" rx="3" ry="2" fill="${O}"/>`+eyes(57,74,37,g)+(v==='fluffy'?`<path d="M58 52Q64 57 70 52" fill="none" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>`:fangMouth(64,52,6));break;
 case 'lion':{const k=v==='king';
  s+=`<path d="M104 64Q128 62 126 38" stroke="${O}" stroke-width="5" fill="none"/><path d="M104 64Q128 62 126 38" stroke="${a}" stroke-width="2.5" fill="none"/>`+flourish(t,126,40)+
  `<path d="M90 74L90 90H102L100 74ZM58 74L56 90H70L70 76Z" fill="${a}" ${SW}/>`+claws(60,90,3,-1)+claws(94,90,3,1)+`<ellipse cx="84" cy="66" rx="28" ry="16" fill="${a}" ${SW}/>`+
  (k?spikyRing(62,40,26,40,12,'#ffd43b')+spikyRing(62,40,22,30,12,b):spikyRing(62,40,20,30,11,b))+
  `<circle cx="52" cy="24" r="6" fill="${a}" ${SW}/><circle cx="72" cy="24" r="6" fill="${a}" ${SW}/><circle cx="62" cy="42" r="16" fill="${a}" ${SW}/><ellipse cx="62" cy="50" rx="9" ry="6" fill="${b}" ${SW}/><path d="M59 45H65L62 48Z" fill="${O}"/>`+eyes(55,70,38,g)+fangMouth(62,53,5)+(k?crown(62,14,.9):'');break;}
 case 'turtle':
  s+=`<path d="M38 82L36 92H50L50 84ZM98 84L98 92H112L110 82Z" fill="${b}" ${SW}/>`+claws(40,92,3,-1)+claws(102,92,3,1)+
  `<path d="M30 80Q32 36 74 34Q116 36 118 80Z" fill="${a}" ${SW}/><path d="M50 72L58 50L74 46L90 50L98 72" fill="none" stroke="${b}" stroke-width="3"/><circle cx="58" cy="56" r="5" fill="${b}"/><circle cx="90" cy="56" r="5" fill="${b}"/>
  <ellipse cx="74" cy="80" rx="46" ry="8" fill="${b}" ${SW}/>`+flourish(t,74,32)+`<path d="M36 54Q24 48 26 36Q34 44 40 46Z" fill="${b}" ${SW}/><path d="M112 54Q124 48 122 36Q114 44 108 46Z" fill="${b}" ${SW}/>
  <circle cx="74" cy="66" r="15" fill="${b}" ${SW}/>`+eyes(68,80,63,g)+fangMouth(74,71,5);break;
 case 'sprout':
  s+=`<path d="M74 34Q50 10 30 18Q44 36 72 38Z" fill="#40c057" ${SW}/><path d="M74 34Q98 6 122 14Q108 36 76 38Z" fill="#51cf66" ${SW}/><path d="M74 38L74 26" stroke="${O}" stroke-width="3"/>
  <path d="M50 66Q24 60 22 42Q32 52 46 56M98 66Q124 60 126 42Q116 52 102 56" fill="none" stroke="#2b8a3e" stroke-width="5" stroke-linecap="round"/><path d="M28 48L24 44M120 48L124 44" stroke="${O}" stroke-width="2"/>
  <path d="M58 82L50 92M64 84L62 92M84 84L86 92M90 82L98 92" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/><ellipse cx="74" cy="64" rx="27" ry="23" fill="${a}" ${SW}/><ellipse cx="74" cy="72" rx="15" ry="10" fill="${b}"/>`+eyes(65,83,58,g)+fangMouth(74,67,5);break;
 case 'golem':
  s+=flourish(t,74,20)+`<path d="M44 34L36 14L56 28ZM104 34L112 14L92 28Z" fill="#91a7ff" ${SW}/>
  <path d="M54 80L50 92H66L64 82ZM84 82L82 92H98L94 80Z" fill="${a}" ${SW}/><path d="M44 46L56 28L92 28L106 46L104 76L90 88L58 88L44 76Z" fill="${a}" ${SW}/>
  <path d="M60 44L66 54L62 62M90 60L84 70L88 78" fill="none" stroke="${O}" stroke-width="1.6"/><path d="M62 66L74 62L86 66L84 80L64 80Z" fill="${b}" ${SW}/>
  <path d="M24 56L36 50L44 60L38 74L26 72Z" fill="${a}" ${SW}/><path d="M124 56L112 50L104 60L110 74L122 72Z" fill="${a}" ${SW}/>`+eyes(63,85,44,g)+fangMouth(74,54,8);break;
 case 'hawk':{const k=v==='king';
  if(k)s+=`<path d="M54 44L10 4L18 26L2 24L22 40Z" fill="${a}" ${SW}/><path d="M94 44L138 4L130 26L146 24L126 40Z" fill="${a}" ${SW}/>`;
  s+=`<path d="M54 50L4 18L16 36L0 40L18 50L4 60L30 62L50 70Z" fill="${b}" ${SW}/><path d="M94 50L144 18L132 36L148 40L130 50L144 60L118 62L98 70Z" fill="${b}" ${SW}/>`+flourish(t,140,26)+
  `<path d="M62 76L56 92L68 82L74 94L80 82L92 92L86 76Z" fill="${b}" ${SW}/>`+(k?crown(74,16,1):`<path d="M62 30L54 4L72 26ZM72 26L76 0L82 26ZM82 28L96 6L90 34Z" fill="${b}" ${SW}/>`)+
  `<circle cx="74" cy="52" r="25" fill="${a}" ${SW}/><path d="M62 64L68 72L74 64L80 72L86 64" fill="none" stroke="${b}" stroke-width="3"/>`+(k?`<path d="M52 38H96L92 48H56Z" fill="${O}"/>`:'')+
  `<path d="M66 52H84Q84 64 74 66Q76 60 70 58Z" fill="#ffa94d" ${SW}/>`+eyes(64,84,42,g);break;}
 case 'beetle':
  s+=[[50,60,28,52,22,66],[50,70,26,74,22,88],[54,80,38,88,36,94],[98,60,120,52,126,66],[98,70,122,74,126,88],[94,80,110,88,112,94]].map(([x1,y1,x2,y2,x3,y3])=>`<path d="M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}" fill="none" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>`).join('')+
  `<ellipse cx="74" cy="64" rx="28" ry="24" fill="${a}" ${SW}/><path d="M74 42V88" stroke="${O}" stroke-width="2.5"/><ellipse cx="62" cy="58" rx="6" ry="9" fill="${b}" opacity=".7"/><ellipse cx="86" cy="58" rx="6" ry="9" fill="${b}" opacity=".7"/>
  <ellipse cx="74" cy="40" rx="17" ry="11" fill="${O}"/><path d="M70 32Q60 10 78 0Q72 14 80 32Z" fill="${b}" ${SW}/>`+flourish(t,78,4)+
  `<path d="M60 46L52 52L62 52M88 46L96 52L86 52" fill="#fff" ${SW}/><path d="M64 37L71 40M84 37L77 40" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="67" cy="42" r="2.6" fill="${g?'#ffd43b':'#ff6b6b'}"/><circle cx="81" cy="42" r="2.6" fill="${g?'#ffd43b':'#ff6b6b'}"/>`;break;
 case 'shark':
  s+=`<path d="M118 50L146 24L138 52L146 80Z" fill="${a}" ${SW}/><path d="M66 36L80 8L92 40Z" fill="${a}" ${SW}/>
  <path d="M10 56Q30 30 80 34Q120 38 124 54Q118 72 78 74Q30 76 10 56Z" fill="${a}" ${SW}/><path d="M20 62Q50 76 110 62Q90 74 60 74Q32 72 20 62Z" fill="${b}"/>
  <path d="M70 62L60 84L84 68Z" fill="${a}" ${SW}/><path d="M12 54L40 50L44 66L16 64Z" fill="#a61e4d" ${SW}/>
  <path d="M15 54L18 58L21 53L24 58L27 52L30 57L33 51L36 56L39 50" fill="#fff" stroke="${O}" stroke-width="1"/><path d="M18 64L21 60L24 64L27 60L30 65L33 60L36 65L39 61L42 66" fill="#fff" stroke="${O}" stroke-width="1"/>
  <path d="M88 44L100 46M92 50L102 52M96 56L104 58" stroke="${O}" stroke-width="1.6"/>`+flourish(t,80,10)+
  `<path d="M42 40L56 44Q56 52 48 52Q42 50 42 40Z" fill="#fff" ${SW}/><circle cx="50" cy="46" r="2.6" fill="${g?'#ffd43b':O}"/><path d="M40 36L58 42" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`;break;
 case 'bat':
  s+=`<path d="M60 46Q30 14 2 22Q12 30 8 40Q20 36 24 48Q32 44 38 56Q46 50 58 60Z" fill="${b}" ${SW}/><path d="M88 46Q118 14 146 22Q136 30 140 40Q128 36 124 48Q116 44 110 56Q102 50 90 60Z" fill="${b}" ${SW}/>
  <path d="M60 46L40 26M88 46L108 26" stroke="${O}" stroke-width="2"/><path d="M64 34L56 4L72 28ZM84 34L92 4L76 28Z" fill="${a}" ${SW}/><path d="M64 28L60 12L69 26ZM84 28L88 12L79 26Z" fill="#ff8787"/>
  <path d="M66 78L62 90M82 78L86 90" stroke="${O}" stroke-width="3"/>`+claws(62,90,2,-1)+claws(86,90,2,1)+`<ellipse cx="74" cy="56" rx="20" ry="24" fill="${a}" ${SW}/><ellipse cx="74" cy="66" rx="10" ry="12" fill="${b}"/>`+eyes(66,82,48,g)+fangMouth(74,58,6)+flourish(t,74,96);break;
 case 'dino':{const cr=v==='crystal',sp=cr?'#a5d8ff':b;
  s+=`<path d="M100 66Q136 72 146 46Q130 58 100 56Z" fill="${a}" ${SW}/>`+flourish(t,144,46)+
  `<path d="M54 50L58 26L68 46ZM68 46L78 ${cr?10:18}L86 46ZM84 48L96 ${cr?16:26}L98 54ZM104 58L116 44L114 62Z" fill="${sp}" ${SW}/>
  <path d="M60 76L56 90H70L70 78ZM88 78L88 90H102L98 76Z" fill="${a}" ${SW}/>`+claws(60,90,3,-1)+claws(92,90,3,1)+
  `<ellipse cx="78" cy="64" rx="32" ry="20" fill="${a}" ${SW}/>`+(cr?`<path d="M56 60Q78 52 104 60M58 70Q80 62 104 68" stroke="#63e6be" stroke-width="3" fill="none" opacity=".9"/><path d="M60 64Q80 56 102 64" stroke="#ff8cc6" stroke-width="2" fill="none"/>`:`<path d="M60 62Q70 80 88 76" fill="none" stroke="${b}" stroke-width="7" stroke-linecap="round"/>`)+
  `<path d="M50 62L40 72L50 74Z" fill="${a}" ${SW}/>`+claws(42,72,2,-1)+
  `<path d="M42 22L48 ${cr?-4:2}L54 22Z" fill="${sp}" ${SW}/>${cr?`<path d="M32 26L30 8L40 22Z" fill="${sp}" ${SW}/>`:''}<circle cx="44" cy="38" r="20" fill="${a}" ${SW}/><path d="M8 40Q12 30 34 32L36 46Q20 46 8 40Z" fill="${a}" ${SW}/>
  <path d="M10 42L36 46L32 58Q18 58 12 50Z" fill="#a61e4d" ${SW}/><path d="M14 43L16 49L19 43ZM22 44L24 50L27 44ZM18 56L20 51L23 56Z" fill="#fff" stroke="${O}" stroke-width="1"/>
  <path d="M10 50Q18 64 36 58L34 64Q16 66 10 50Z" fill="${a}" ${SW}/>`+eyes(38,54,32,g);break;}
 case 'croc':
  s+=`<path d="M118 66Q140 70 146 56Q136 76 118 76Z" fill="${a}" ${SW}/><path d="M56 82L52 92H64L64 84ZM96 82L96 92H108L106 82Z" fill="${a}" ${SW}/>`+claws(54,92,3,-1)+claws(100,92,3,1)+
  `<ellipse cx="86" cy="68" rx="36" ry="15" fill="${a}" ${SW}/>`+[64,76,88,100,112].map(x=>`<path d="M${x-5} 56L${x} 46L${x+5} 56Z" fill="${b}" ${SW}/>`).join('')+
  `<path d="M60 56Q30 52 4 60L6 70Q30 74 60 76Z" fill="${a}" ${SW}/><path d="M6 64L58 66" stroke="${O}" stroke-width="2"/>
  <path d="M10 63L12 59L15 63L17 59L20 63L22 59L25 64L27 60L30 64L32 60L35 64L37 60L40 65" fill="#fff" stroke="${O}" stroke-width=".9"/><path d="M12 66L14 70L17 66L19 70L22 66L24 70L27 66L29 71L32 66L34 71L37 66L39 71L42 66" fill="#fff" stroke="${O}" stroke-width=".9"/>
  <circle cx="48" cy="50" r="9" fill="${a}" ${SW}/><circle cx="62" cy="50" r="9" fill="${a}" ${SW}/>`+eyes(48,62,50,g)+`<path d="M86 40Q98 26 108 34Q98 36 94 46Z" fill="#51cf66" ${SW}/>`+flourish(t,100,40);break;
 case 'kraken':
  s+=[[52,56,24,70,30,90],[60,62,46,82,58,94],[70,64,66,86,76,94],[80,64,86,86,92,94],[90,62,104,82,116,92],[96,56,126,70,122,88]].map(([x1,y1,x2,y2,x3,y3])=>`<path d="M${x1} ${y1}Q${x2} ${y2} ${x3} ${y3}" stroke="${O}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M${x1} ${y1}Q${x2} ${y2} ${x3} ${y3}" stroke="${a}" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="1.6" fill="${b}"/>`).join('')+
  `<path d="M46 56Q42 8 74 6Q106 8 102 56Q90 66 74 66Q58 66 46 56Z" fill="${a}" ${SW}/><circle cx="62" cy="22" r="5" fill="${b}"/><circle cx="86" cy="18" r="4" fill="${b}"/><circle cx="76" cy="30" r="3" fill="${b}"/>`+eyes(63,85,44,true)+fangMouth(74,55,6)+flourish(t,108,14);break;
 case 'bull':
  s+=`<path d="M46 36Q20 34 12 8Q30 20 48 26Z" fill="#f8f9fa" ${SW}/><path d="M102 36Q128 34 136 8Q118 20 100 26Z" fill="#f8f9fa" ${SW}/><path d="M22 20L18 14M30 26L28 18M126 20L130 14M118 26L120 18" stroke="#2b8a3e" stroke-width="3" stroke-linecap="round"/>
  <path d="M40 92L36 70Q30 50 74 48Q118 50 112 70L108 92Z" fill="${a}" ${SW}/><path d="M44 92V82H56V92ZM92 92V82H104V92Z" fill="${O}"/><path d="M60 60Q74 70 88 60" stroke="${b}" stroke-width="5" fill="none"/>
  <path d="M52 30Q52 14 74 14Q96 14 96 30L92 48Q74 58 56 48Z" fill="${a}" ${SW}/><ellipse cx="74" cy="46" rx="14" ry="9" fill="${b}" ${SW}/><circle cx="69" cy="46" r="2" fill="${O}"/><circle cx="79" cy="46" r="2" fill="${O}"/>
  <path d="M68 52Q74 60 80 52" fill="none" stroke="#fcc419" stroke-width="2.5"/><path d="M50 44L42 40M98 44L106 40" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`+eyes(64,84,30,g)+flourish(t,74,12);break;
 case 'gorilla':
  s+=`<path d="M30 40Q14 50 16 86L34 88Q34 62 44 54Z" fill="${a}" ${SW}/><path d="M118 40Q134 50 132 86L114 88Q114 62 104 54Z" fill="${a}" ${SW}/><circle cx="24" cy="86" r="10" fill="${b}" ${SW}/><circle cx="124" cy="86" r="10" fill="${b}" ${SW}/>
  <path d="M40 38Q74 20 108 38L104 82Q74 92 44 82Z" fill="${a}" ${SW}/><path d="M56 52Q74 46 92 52L90 74Q74 80 58 74Z" fill="${b}" ${SW}/>
  <path d="M32 34L42 24L50 34L40 42ZM116 34L106 24L98 34L108 42Z" fill="#91a7ff" ${SW}/>
  <circle cx="74" cy="34" r="16" fill="${a}" ${SW}/><path d="M60 28Q74 22 88 28L86 34H62Z" fill="${O}"/><ellipse cx="74" cy="42" rx="10" ry="7" fill="${b}" ${SW}/>
  <path d="M66 44Q64 54 60 56M82 44Q84 54 88 56" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>`+eyes(67,81,33,g)+flourish(t,74,16);break;
 case 'wyvern':
  s+=`<path d="M60 40L14 8L20 30L4 32L22 46L10 56L44 56Z" fill="${b}" ${SW}/><path d="M88 40L134 8L128 30L144 32L126 46L138 56L104 56Z" fill="${b}" ${SW}/><path d="M60 40L20 30M88 40L128 30" stroke="${O}" stroke-width="1.6"/>
  <path d="M96 72Q130 80 140 64" stroke="${O}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M96 72Q130 80 140 64" stroke="${a}" stroke-width="5" fill="none" stroke-linecap="round"/>`+flourish(t,142,62)+
  `<path d="M58 80L54 92H68L68 82ZM82 82L82 92H96L92 80Z" fill="${a}" ${SW}/>`+claws(56,92,3,-1)+claws(86,92,3,1)+
  `<ellipse cx="74" cy="66" rx="22" ry="22" fill="${a}" ${SW}/><path d="M64 52H84M62 60H86M62 68H86M64 76H84" stroke="${b}" stroke-width="3"/>
  <path d="M66 46Q70 28 74 24Q78 28 82 46Z" fill="${a}" ${SW}/><path d="M62 14L54 0L68 10ZM86 14L94 0L80 10Z" fill="#ffd43b" ${SW}/><ellipse cx="74" cy="20" rx="14" ry="12" fill="${a}" ${SW}/>`+eyes(68,80,18,g)+fangMouth(74,26,6);break;
 case 'phoenix':
  s+=`<path d="M70 70Q40 96 14 90Q36 84 46 70ZM78 70Q108 96 134 90Q112 84 102 70ZM74 72Q74 96 80 94Q84 86 78 72Z" fill="#ffd43b" ${SW}/>
  <path d="M56 50Q30 30 8 34Q16 42 6 48Q22 50 14 58Q30 58 26 66Q42 62 58 62Z" fill="#ff922b" ${SW}/><path d="M92 50Q118 30 140 34Q132 42 142 48Q126 50 134 58Q118 58 122 66Q106 62 90 62Z" fill="#ff922b" ${SW}/>
  <path d="M48 52Q30 42 18 46M100 52Q118 42 130 46" stroke="#ffe066" stroke-width="3" fill="none"/>
  <path d="M66 26Q58 4 70 2Q66 14 74 22Q76 0 86 6Q80 16 82 28Z" fill="#ff6b6b" ${SW}/><circle cx="74" cy="48" r="22" fill="${a}" ${SW}/><path d="M62 58L68 66L74 58L80 66L86 58" fill="none" stroke="${b}" stroke-width="3"/>
  <path d="M66 46H82Q82 58 74 60Q76 54 70 52Z" fill="#ffd43b" ${SW}/>`+eyes(64,84,38,g)+crown(74,10,.55);break;
 default: // serpent / sea dragon
  s+=`<path d="M10 86Q38 44 64 72T110 60" stroke="${O}" stroke-width="18" fill="none" stroke-linecap="round"/><path d="M10 86Q38 44 64 72T110 60" stroke="${a}" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M26 62L24 46L34 56ZM44 52L46 36L54 52ZM70 66L76 52L80 68ZM90 60L96 46L100 62Z" fill="${b}" ${SW}/>`+flourish(t,10,82)+
  (v==='king'?crown(116,20,1):`<path d="M104 28L94 4L112 24ZM120 24L126 0L130 28Z" fill="${b}" ${SW}/>`)+`<circle cx="116" cy="42" r="19" fill="${a}" ${SW}/>
  <path d="M100 50Q88 56 82 52M132 50Q144 56 148 50" fill="none" stroke="${O}" stroke-width="2" stroke-linecap="round"/>`+eyes(108,125,38,g)+fangMouth(117,52,8)+(v==='king'?`<path d="M140 20V70M132 24L140 12L148 24" stroke="#ffd43b" stroke-width="3" fill="none" stroke-linecap="round"/>`:'');
 }
 return s;}
/* type scenery behind the burst */
function scene(t,w,h,u){const G={fire:['#ffd43b','#e03131'],water:['#a5d8ff','#1864ab'],leaf:['#d8f5a2','#2b8a3e'],spark:['#4c6ef5','#1b1f3b'],rock:['#ffe8cc','#8d6e63'],sky:['#e5dbff','#5f3dc4']}[t];
 let s=`<linearGradient id="${u}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${G[0]}"/><stop offset="1" stop-color="${G[1]}"/></linearGradient><rect width="${w}" height="${h}" fill="url(#${u}g)"/>`;
 if(t==='fire')s+=`<path d="M0 ${h}L0 ${h*.55}L40 ${h*.3}L60 ${h*.34}L100 ${h*.62}L${w} ${h*.5}L${w} ${h}Z" fill="#7a1f1f" opacity=".55"/><path d="M48 ${h*.32}Q54 ${h*.5} 46 ${h}" stroke="#ffa94d" stroke-width="5" fill="none" opacity=".7"/>`;
 if(t==='water')for(let i=0;i<4;i++)s+=`<path d="M0 ${h*(.45+i*.15)}Q${w*.25} ${h*(.4+i*.15)} ${w*.5} ${h*(.45+i*.15)}T${w} ${h*(.45+i*.15)}" stroke="#fff" stroke-width="3" fill="none" opacity=".35"/>`;
 if(t==='leaf')s+=`<g fill="#1b5e20" opacity=".45"><circle cx="10" cy="${h*.25}" r="26"/><circle cx="${w-6}" cy="${h*.3}" r="30"/><circle cx="${w*.5}" cy="${h+10}" r="40"/></g>`;
 if(t==='spark')s+=`<g fill="#495057" opacity=".8"><ellipse cx="30" cy="10" rx="40" ry="16"/><ellipse cx="${w-20}" cy="6" rx="46" ry="18"/></g><path d="M${w*.2} 16L${w*.15} 40L${w*.22} 40L${w*.12} 70" stroke="#ffe066" stroke-width="2.5" fill="none"/>`;
 if(t==='rock')s+=`<path d="M0 ${h}L0 ${h*.5}L30 ${h*.25}L60 ${h*.5}L90 ${h*.2}L130 ${h*.55}L${w} ${h*.35}L${w} ${h}Z" fill="#5d4037" opacity=".45"/>`;
 if(t==='sky')s+=`<g fill="#fff" opacity=".6"><ellipse cx="20" cy="${h*.3}" rx="30" ry="10"/><ellipse cx="${w-10}" cy="${h*.55}" rx="36" ry="11"/></g>`;
 return s;}
/* explosive colour slashes, like an action poster */
function burst(id,cx,cy,big){const r=seeded(id),cols=['#f06595','#fcc419','#339af0','#ff922b','#845ef7','#20c997','#fff'];let s='';
 const n=big?26:18;for(let i=0;i<n;i++){const a=r()*Math.PI*2,len=(big?90:70)+r()*70,wd=.05+r()*.07,r0=24+r()*18,col=cols[Math.floor(r()*cols.length)];
  s+=`<path d="M${cx+r0*Math.cos(a)} ${cy+r0*Math.sin(a)}L${cx+len*Math.cos(a-wd)} ${cy+len*Math.sin(a-wd)}L${cx+(len+20)*Math.cos(a)} ${cy+(len+20)*Math.sin(a)}L${cx+len*Math.cos(a+wd)} ${cy+len*Math.sin(a+wd)}Z" fill="${col}" opacity="${col==='#fff'?.8:.9}"/>`;}
 for(let i=0;i<8;i++){const x=r()*170,y=r()*120;s+=`<path d="M${x} ${y-5}L${x+1.5} ${y-1.5}L${x+5} ${y}L${x+1.5} ${y+1.5}L${x} ${y+5}L${x-1.5} ${y+1.5}L${x-5} ${y}L${x-1.5} ${y-1.5}Z" fill="#fff"/>`;}
 return s;}
function crystals(id){const r=seeded(id+77),cols=['rgba(255,255,255,.45)','rgba(165,216,255,.5)','rgba(252,194,215,.5)','rgba(255,236,153,.5)'];let s='';
 for(let i=0;i<14;i++){const x=r()*180,y=r()*252,k=6+r()*14;s+=`<path d="M${x} ${y-k}L${x+k*.6} ${y}L${x} ${y+k}L${x-k*.6} ${y}Z" fill="${cols[i%4]}" stroke="#fff" stroke-width=".6"/>`;}return s;}
/* abilities (rare and better) are real rules in battle */
const ABIL={fire:{n:'Blazing Heart',k:'plus',t:['This card’s attacks do','10 more damage.']},spark:{n:'Overcharge',k:'plus',t:['This card’s attacks do','10 more damage.']},
 water:{n:'Bubble Shield',k:'shield',t:['This card takes 10 less','damage from attacks.']},rock:{n:'Stone Skin',k:'shield',t:['This card takes 10 less','damage from attacks.']},
 leaf:{n:'Regrow',k:'heal',t:['At the start of your turn,','heal 10 HP from this card.']},sky:{n:'Tailwind',k:'wind',t:['When you draw energy,','get 1 more.']}};
const abil=c=>c&&c.r!=='common'?ABIL[c.type]:null;
const EVO={9:1,10:2,11:4,12:6,13:8,14:11,15:5,43:23,44:24,45:26,46:27,47:29,48:31,49:33,50:35,51:36,52:37,53:38,57:25,58:54,59:46,60:49,62:47,63:32,64:51,93:73,94:74,95:75,96:76,97:77,98:78,99:79,100:80,101:81,102:83,103:84,104:87,105:85,106:86,107:93,108:94,109:96,110:97,111:98,112:99,113:100};
const stage=c=>c.r==='legend'||c.r==='promo'?'BOSS':EVO[c.id]?(EVO[EVO[c.id]]?'STAGE 2':'STAGE 1'):'BASIC';
const FLAV={dragon:'Its wings make a wind that knocks over trees.',treant:'It has been growing for a thousand years.',snail:'It is slow, but its shell can stop any attack.',spider:'Its web can catch a falling star.',penguin:'It slides on ice faster than a sled.',griffin:'Half eagle, half lion, all courage.',crab:'Its claws can crack a coconut in one pinch.',unicorn:'Its horn glows when a friend is in trouble.',frog:'It can jump over a house in one hop.',scorpion:'Its tail is always ready for a surprise.',mantis:'It practices sword moves all day long.',owl:'It sees in the dark and never misses a thing.',raptor:'It runs so fast that its footprints smoke.',ram:'It never backs down from a head-to-head.',manta:'It glides like a giant kite through the waves.',yeti:'It gives bear hugs that can freeze a lake.',robot:'Built to protect, it never runs out of battery.',jelly:'It glows at night like a floating lantern.',rhino:'Its horn can push a train off the tracks.',hydra:'Three heads means three times the roar.',wolf:'It howls before battle so its friends feel brave.',lion:'Its mane glows brighter every time it wins.',sprout:'It drinks sunshine and grows a new leaf each day.',golem:'It loves to wrestle. Nobody has ever pushed it over.',hawk:'It dives faster than a race car to catch the wind.',beetle:'Its horn is hot enough to cook an egg in a second.',shark:'It can smell a snack from ten miles away.',bat:'It sleeps upside down inside thunder clouds.',croc:'It hides in tall grass and waits very patiently.',kraken:'Sailors say it can hug a whole ship.',bull:'When it stomps, flowers pop up from the ground.',gorilla:'It pounds its chest so hard that rocks fall.',wyvern:'Lightning follows it wherever it flies.',phoenix:'It is reborn from its own flames, again and again.',dino:'Its roar can be heard on the other side of the mountain.',blob:'It loves to wrestle. Nobody has ever pushed it over.',
 bird:'It dives faster than a race car to catch the wind.',turtle:'Its spiky shell is harder than steel.',serpent:'It guards the deep places where the light never reaches.'};
let UID=0;
function cardSVG(c){const t=T[c.type],u='k'+(++UID),wt=WEAK[c.type],ab=abil(c),boss=c.r==='legend'||c.r==='promo',st=stage(c),ev=EVO[c.id]?byId(EVO[c.id]):null;
 const frame={common:'#adb5bd',rare:'#ced4da',holo:`url(#${u}s)`,legend:`url(#${u}o)`,promo:`url(#${u}r)`}[c.frameR||c.r];
 const cost=(n,x,y)=>Array.from({length:n},(_,i)=>ticon(c.type,x+i*11,y,4.8)).join('');
 const nameX=st.length*4.6+21,nameFs=Math.min(14,(108-nameX)/(c.name.length*.68));
 const retreat=c.hp<=70?1:c.hp<=100?2:3;
 let panelY=ab?126:134,body='';
 if(ab){body+=`<rect x="14" y="${panelY+4}" width="30" height="10" rx="3" fill="#e03131" stroke="#fff" stroke-width=".8"/><text x="29" y="${panelY+11.5}" font-size="7" font-weight="900" fill="#fff" text-anchor="middle" font-style="italic">Ability</text>
  <text x="48" y="${panelY+12.5}" font-size="10" font-weight="900" fill="#c92a2a">${ab.n}</text>
  <text x="15" y="${panelY+22}" font-size="6.4" font-weight="700" fill="${O}">${ab.t[0]}</text><text x="15" y="${panelY+29}" font-size="6.4" font-weight="700" fill="${O}">${ab.t[1]}</text>`;panelY+=34;}
 c.atk.forEach((a,i)=>{const y=panelY+12+i*(ab?24:30),x=16+a.c*11+2,avail=166-x-(a.d>=100?30:22),fs=Math.min(11.5,avail/(a.n.length*.68));
  body+=`${cost(a.c,18,y-4)}<text x="${x}" y="${y}" font-size="${fs.toFixed(1)}" font-weight="900" fill="${O}">${a.n}</text><text x="164" y="${y+1}" font-size="14" font-weight="900" fill="${O}" text-anchor="end">${a.d}</text>`;});
 return `<svg viewBox="0 0 180 252" xmlns="http://www.w3.org/2000/svg" font-family="Arial Rounded MT Bold,ui-rounded,system-ui,sans-serif"><defs>
<linearGradient id="${u}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8f9fa"/><stop offset=".5" stop-color="#adb5bd"/><stop offset="1" stop-color="#e9ecef"/></linearGradient>
<linearGradient id="${u}o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3bf"/><stop offset=".5" stop-color="#f59f00"/><stop offset="1" stop-color="#ffe066"/></linearGradient>
<linearGradient id="${u}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b6b"/><stop offset=".25" stop-color="#ffd43b"/><stop offset=".5" stop-color="#69db7c"/><stop offset=".75" stop-color="#4dabf7"/><stop offset="1" stop-color="#b197fc"/></linearGradient>
<linearGradient id="${u}n" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.c}"/><stop offset=".7" stop-color="${t.c}" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
<linearGradient id="${u}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8f9fa"/><stop offset=".5" stop-color="#868e96"/><stop offset="1" stop-color="#dee2e6"/></linearGradient>
<clipPath id="${u}c"><rect x="6" y="6" width="168" height="240" rx="7"/></clipPath></defs>
<rect x="1.5" y="1.5" width="177" height="249" rx="11" fill="${frame}" stroke="${O}" stroke-width="1.5"/>
<g clip-path="url(#${u}c)"><g transform="translate(6 6)">${scene(c.type,168,240,u)}</g>
<g>${burst(c.id,90,boss?98:78,boss)}</g>
<ellipse cx="90" cy="${boss?104:84}" rx="46" ry="40" fill="#fff" opacity=".35"/>
<g transform="${boss?'translate(-2 26) scale(1.25)':'translate(6 30) scale(1.13)'}">${creature(c)}</g>
${c.r==='promo'?crystals(c.id):''}
<rect x="6" y="6" width="168" height="27" fill="url(#${u}n)"/>
${boss?'':`<rect x="6" y="${panelY>160?124:121}" width="168" height="4" fill="url(#${u}m)"/>`}
<rect x="6" y="${boss?140:(ab?127:132)}" width="168" height="${boss?78:(ab?89:84)}" fill="${t.p}" opacity="${boss?.82:.9}"/>
${boss?`<rect x="6" y="137" width="168" height="4" fill="url(#${u}m)"/>`:''}
</g>
<rect x="9" y="8" width="${st.length*4.6+8}" height="9" rx="2" fill="url(#${u}m)" stroke="${O}" stroke-width=".6"/><text x="13" y="15" font-size="6.5" font-weight="900" font-style="italic" fill="${O}">${st}</text>
<text x="${nameX}" y="${ev?24:27}" font-size="${nameFs.toFixed(1)}" font-weight="900" fill="#fff" stroke="${O}" stroke-width="2.4" paint-order="stroke" font-style="italic">${c.name}</text>
${ev?`<text x="${st.length*4.6+22}" y="31" font-size="5.8" font-weight="800" font-style="italic" fill="#fff" stroke="${O}" stroke-width="1.5" paint-order="stroke">Evolves from ${ev.name}</text>`:''}
<text x="152" y="27" text-anchor="end" font-weight="900" fill="#fff" stroke="${O}" stroke-width="2.4" paint-order="stroke"><tspan font-size="7">HP</tspan><tspan font-size="17">${c.hp}</tspan></text>${ticon(c.icon||c.type,164,21,7.5)}
<g transform="translate(0 ${boss?14:0})">${body}</g>
<rect x="10" y="218" width="160" height="10" rx="2" fill="#f1f3f5" opacity=".95"/>
<text x="14" y="225.5" font-size="5.8" font-weight="800" fill="${O}">weakness</text>${ticon(wt,50,223,3.6)}<text x="55" y="225.8" font-size="6.5" font-weight="900" fill="${O}">×2</text>
<text x="72" y="225.5" font-size="5.8" font-weight="800" fill="${O}">resistance</text><text x="114" y="225.5" font-size="5.8" fill="${O}">—</text>
<text x="128" y="225.5" font-size="5.8" font-weight="800" fill="${O}">retreat</text>${Array.from({length:retreat},(_,i)=>`<circle cx="${153+i*6}" cy="223" r="2.3" fill="#fff" stroke="${O}" stroke-width=".8"/>`).join('')}
${boss?`<text x="12" y="240" font-size="5.5" font-weight="900" fill="#fff" stroke="${O}" stroke-width="1.2" paint-order="stroke">${c.set===2?'DK':'CQ'} ${String(c.num||c.id).padStart(3,'0')}/${C.length} ${R[c.r].m}</text><rect x="58" y="231" width="112" height="12" rx="6" fill="url(#${u}o)" stroke="${O}" stroke-width=".8"/><text x="114" y="239.3" font-size="6" font-weight="900" fill="${O}" text-anchor="middle" font-style="italic">★ BOSS card · super strong! ★</text>`:
 `<text x="12" y="236" font-size="5" font-weight="700" fill="#fff" stroke="${O}" stroke-width="1.2" paint-order="stroke">Illus. Card Quest Studio</text><text x="12" y="243" font-size="5.5" font-weight="900" fill="#fff" stroke="${O}" stroke-width="1.2" paint-order="stroke">${c.set===2?'DK':'CQ'} ${String(c.num||c.id).padStart(3,'0')}/${C.length} ${R[c.r].m}</text>
 <text x="168" y="236" font-size="5" font-weight="700" font-style="italic" fill="#fff" stroke="${O}" stroke-width="1.2" paint-order="stroke" text-anchor="end">${FLAV[c.tpl].slice(0,FLAV[c.tpl].indexOf(' ',26))}</text><text x="168" y="243" font-size="5" font-weight="700" font-style="italic" fill="#fff" stroke="${O}" stroke-width="1.2" paint-order="stroke" text-anchor="end">${FLAV[c.tpl].slice(FLAV[c.tpl].indexOf(' ',26)+1)}</text>`}
</svg>`;}

function cardHTML(c,extraCls){return `<div class="cardw ${c.r} ${extraCls||''}">${cardSVG(c)}</div>`;}
function backSVG(){return `<div class="cardw"><svg viewBox="0 0 180 252"><rect x="2" y="2" width="176" height="248" rx="11" fill="#1864ab" stroke="${O}" stroke-width="2"/><rect x="12" y="12" width="156" height="228" rx="8" fill="#1c7ed6"/><circle cx="90" cy="126" r="52" fill="#f76707" stroke="${O}" stroke-width="4"/><circle cx="90" cy="126" r="34" fill="#ffd43b" stroke="${O}" stroke-width="4"/><path d="M90 102l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#fff" stroke="${O}" stroke-width="3"/><text x="90" y="222" font-size="16" font-weight="900" fill="#fff" text-anchor="middle" font-family="system-ui">CARD QUEST</text></svg></div>`;}
/* Lucas: bold retro sports-anime, spiky hair, blue #6 jersey */
const LUCAS=`<svg viewBox="0 0 100 112"><path d="M14 112Q16 80 50 77Q84 80 86 112Z" fill="#1c7ed6" stroke="${O}" stroke-width="3.5"/><path d="M38 79L50 90L62 79" fill="none" stroke="#fff" stroke-width="4"/><text x="50" y="108" font-size="17" font-weight="900" fill="#fff" text-anchor="middle" font-family="system-ui">6</text>
<circle cx="50" cy="50" r="27" fill="#ffd8b1" stroke="${O}" stroke-width="3.5"/><path d="M22 52L13 30L27 33L22 12L39 24L46 2L57 21L72 6L72 27L90 20L80 40L84 52L72 34L60 30L45 32L32 34Z" fill="${O}" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
<path d="M30 44L46 49M70 44L54 49" stroke="${O}" stroke-width="4.5" stroke-linecap="round"/><ellipse cx="40" cy="56" rx="6" ry="7.5" fill="#fff" stroke="${O}" stroke-width="2.5"/><ellipse cx="60" cy="56" rx="6" ry="7.5" fill="#fff" stroke="${O}" stroke-width="2.5"/><circle cx="41" cy="57" r="3.8" fill="${O}"/><circle cx="59" cy="57" r="3.8" fill="${O}"/><circle cx="42.5" cy="55" r="1.4" fill="#fff"/><circle cx="60.5" cy="55" r="1.4" fill="#fff"/>
<path d="M38 66Q50 78 62 66Z" fill="#fff" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M39 68H61" stroke="${O}" stroke-width="1.5"/><circle cx="32" cy="66" r="3.5" fill="#ffa8a8"/><circle cx="68" cy="66" r="3.5" fill="#ffa8a8"/></svg>`;
/* Nora: bold retro sports-anime; smooth rounded hair, side-swept bangs, high ponytail with curled tip, pink scrunchie, gold star clip, blue #9 jersey with gold trim */
const NORA=`<svg viewBox="0 0 100 112"><path d="M68 30Q90 16 93 40Q95 58 84 68Q80 72 78 66Q86 56 84 44Q82 32 70 36Z" fill="#1b1f3b" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M80 64Q74 72 81 74" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
<path d="M14 112Q16 80 50 77Q84 80 86 112Z" fill="#1c7ed6" stroke="${O}" stroke-width="3.5"/><path d="M38 79L50 90L62 79" fill="none" stroke="#ffd43b" stroke-width="4"/><text x="50" y="108" font-size="17" font-weight="900" fill="#ffd43b" text-anchor="middle" font-family="system-ui">9</text>
<path d="M24 46Q20 62 25 72L31 70Q27 60 29 48Z" fill="#1b1f3b" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/><path d="M76 46Q80 62 75 72L69 70Q73 60 71 48Z" fill="#1b1f3b" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>
<circle cx="50" cy="50" r="27" fill="#ffd8b1" stroke="${O}" stroke-width="3.5"/>
<path d="M22 50Q19 20 50 19Q81 20 78 50Q76 38 68 32Q60 44 38 42Q30 44 22 50Z" fill="#1b1f3b" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M34 27Q44 22 56 24" fill="none" stroke="#868e96" stroke-width="3" stroke-linecap="round"/>
<circle cx="72" cy="30" r="6.5" fill="#f783ac" stroke="${O}" stroke-width="2.5"/><path d="M30 31L32.4 35.6L37.5 36.2L33.8 39.6L34.8 44.6L30 42.2L25.2 44.6L26.2 39.6L22.5 36.2L27.6 35.6Z" fill="#ffd43b" stroke="${O}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M33 45Q39 42 45 44M55 44Q61 42 67 45" fill="none" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
<ellipse cx="40" cy="56" rx="6" ry="7.5" fill="#fff" stroke="${O}" stroke-width="2"/><ellipse cx="60" cy="56" rx="6" ry="7.5" fill="#fff" stroke="${O}" stroke-width="2"/><circle cx="41" cy="57.5" r="4.2" fill="#8b5a2b"/><circle cx="59" cy="57.5" r="4.2" fill="#8b5a2b"/><circle cx="41" cy="58" r="2" fill="${O}"/><circle cx="59" cy="58" r="2" fill="${O}"/><circle cx="42.6" cy="55.4" r="1.4" fill="#fff"/><circle cx="60.6" cy="55.4" r="1.4" fill="#fff"/><circle cx="39.6" cy="59.6" r=".8" fill="#fff"/><circle cx="57.6" cy="59.6" r=".8" fill="#fff"/>
<path d="M33 52Q40 46 47 51M53 51Q60 46 67 52" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
<path d="M41 66Q50 76 59 66Z" fill="#ff8787" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/><path d="M42.5 67H57.5" stroke="#fff" stroke-width="2.5"/><circle cx="32" cy="65" r="3.5" fill="#ffa8a8"/><circle cx="68" cy="65" r="3.5" fill="#ffa8a8"/></svg>`;
const MEAV=ME.g?NORA:LUCAS;
/* opponents: softer style, no outlines, red shirts */
function kidSVG(hair,skin){return `<svg viewBox="0 0 100 112">${ME.g?`<path d="M22 50Q18 80 30 92L70 92Q82 80 78 50Z" fill="${hair}"/>`:''}<path d="M16 112Q18 82 50 79Q82 82 84 112Z" fill="#e03131"/><path d="M40 81L50 89L60 81" fill="none" stroke="#ffc9c9" stroke-width="4"/><circle cx="50" cy="52" r="26" fill="${skin}"/><path d="M24 50Q24 22 50 22Q76 22 76 50Q70 34 50 34Q32 34 24 50Z" fill="${hair}"/>${ME.g?'<circle cx="68" cy="30" r="5" fill="#f06595"/><circle cx="74" cy="34" r="4" fill="#f06595"/>':''}<circle cx="41" cy="55" r="3.5" fill="#343a40"/><circle cx="59" cy="55" r="3.5" fill="#343a40"/><path d="M42 66Q50 72 58 66" fill="none" stroke="#c92a2a" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="63" r="3.5" fill="#ffc9c9"/><circle cx="67" cy="63" r="3.5" fill="#ffc9c9"/></svg>`;}
const FOES=ME.g?[['Mia','#5c3d2e','#f1c27d'],['Emma','#e0a96d','#ffe0bd'],['Ava','#212529','#c68642'],['Lily','#a0522d','#ffdbac'],['Zoe','#343a40','#e0ac69'],['Ruby','#d9480f','#ffe0bd'],['Ivy','#1b1f3b','#8d5524'],['Chloe','#ffd43b','#ffdbac']]:[['Leo','#5c3d2e','#f1c27d'],['Max','#e0a96d','#ffe0bd'],['Kai','#212529','#c68642'],['Ben','#a0522d','#ffdbac'],['Theo','#343a40','#e0ac69'],['Sam','#d9480f','#ffe0bd'],['Jay','#1b1f3b','#8d5524'],['Ryan','#ffd43b','#ffdbac']];
const MASTER=`<svg viewBox="0 0 100 112"><path d="M10 112L26 40Q50 6 74 40L90 112Z" fill="#5f3dc4"/><path d="M28 44Q50 14 72 44Q72 70 50 74Q28 70 28 44Z" fill="#3b2a80"/><circle cx="50" cy="52" r="18" fill="#e0b48a"/><path d="M34 58Q50 96 66 58Q60 68 50 68Q40 68 34 58Z" fill="#f8f9fa"/><circle cx="43" cy="50" r="2.8" fill="#212529"/><circle cx="57" cy="50" r="2.8" fill="#212529"/><path d="M38 45L46 46M62 45L54 46" stroke="#f8f9fa" stroke-width="3" stroke-linecap="round"/><g fill="#ffd43b"><path d="M20 30l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z"/><path d="M80 24l2 4 4 1-3 3 1 4-4-2-3 2 1-4-3-3 4-1z"/></g><rect x="60" y="80" width="18" height="25" rx="3" fill="#1c7ed6" transform="rotate(12 69 92)"/><rect x="64" y="84" width="10" height="17" rx="2" fill="#ffd43b" transform="rotate(12 69 92)"/></svg>`;

