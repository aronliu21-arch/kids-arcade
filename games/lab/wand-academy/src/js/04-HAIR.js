// ============ watercolor art (SVG) ============
const HAIR={nora:'#24232c',mei:'#6b3d1f',gran:'#c9c9d4',prof:'#8a8fa8',iris:'#e8b64a',wren:'#dee2e6',sunny:'#f08c00',juni:'#2b8a3e',lola:'#a5d8ff',bree:'#343a40'};
const ROBE={nora:'#7048e8',mei:'#2f9e44',gran:'#364fc7',prof:'#5c3d8f',iris:'#e03131',wren:'#495057',sunny:'#fcc419',juni:'#66a80f',lola:'#d0ebff',bree:'#0b7285'};
const TRIM={nora:'#ffd43b',mei:'#d3f9d8',gran:'#ced4da',prof:'#ffd43b',iris:'#ffe066',wren:'#b197fc',sunny:'#ffffff',juni:'#d8f5a2',lola:'#ffffff',bree:'#ffd43b'};
const DEFS=`<defs>
<filter id="soft"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>
<filter id="wash" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".015" numOctaves="3" seed="5"/><feDisplacementMap in="SourceGraphic" scale="26"/><feGaussianBlur stdDeviation="3"/></filter>
<filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<radialGradient id="warm"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
</defs>`;
function girl(who,x,y,s,o={}){
 const hair=HAIR[who],robe=ROBE[who],trim=TRIM[who],skin=(who==='gran'||who==='prof')?'#f3d3bd':who==='lola'?'#eef6ff':'#f9dcc6';const g=[];
 const glow=o.glow?`<ellipse cx="0" cy="120" rx="110" ry="170" fill="url(#warm)" opacity=".8"/>`:'';
 g.push(glow);
 g.push(`<path d="M-66 250C-64 150 -42 106 0 102S64 150 66 250Z" fill="${robe}"/>`);
 g.push(`<path d="M-34 112L0 152L34 112" fill="none" stroke="${trim}" stroke-width="6"/>`);
 const arm=o.arm||'none';
 const armP=arm==='wand'?'M40 126q46 0 86-46':arm==='hold'?'M40 130q40 30 60 10':arm==='wave'?'M40 126q40-20 60-80':'M40 130q20 50 30 70';
 g.push(`<path d="${armP}" stroke="${skin}" stroke-width="15" stroke-linecap="round" fill="none"/>`);
 if(arm==='wand') g.push(`<path d="M124 82l52-42" stroke="#6b4a2b" stroke-width="7" stroke-linecap="round"/><circle cx="180" cy="38" r="10" fill="#fff59d" filter="url(#glow)"/>`);
 if(who==='nora'){g.push(`<path d="M50 -50q58-34 66 12q4 34-22 54q14-34-8-48q-16-10-36 4Z" fill="${hair}"/><circle cx="56" cy="-46" r="10" fill="#ff6fa8"/>`);}
 if(who==='iris')[-46,46].forEach(dx=>g.push(`<circle cx="${dx}" cy="-50" r="24" fill="${hair}"/>`));
 if(who==='gran'||who==='prof')g.push(`<circle cx="0" cy="-58" r="26" fill="${hair}"/>`);
 if(who==='mei')g.push(`<path d="M-64 40C-74 -40 -30 -60 0 -58S74 -40 64 40L60 80L-60 80Z" fill="${hair}"/>`);
 if(who==='sunny')[-70,70].forEach(dx=>g.push(`<circle cx="${dx}" cy="30" r="20" fill="${hair}"/><circle cx="${dx*.8}" cy="12" r="7" fill="#ff6fa8"/>`));
 if(who==='lola')g.push(`<path d="M-64 40C-74 -40 -30 -60 0 -58S74 -40 64 40L70 130L-70 130Z" fill="${hair}" opacity=".8"/>`);
 g.push(`<circle cx="0" cy="30" r="60" fill="${skin}"/>`);
 if(who==='gran'||who==='prof') g.push(`<path d="M-60 20C-64 -30 -20 -46 0 -44S64 -30 60 20C40 -4 20 -14 0 -14S-40 -4 -60 20Z" fill="${hair}"/>`);
 else g.push(`<path d="M-62 34C-70 -34 -22 -56 8 -54S70 -28 62 30C54 -2 32 -16 6 -18C-10 -2 -34 4 -54 2C-60 16 -60 26 -62 34Z" fill="${hair}"/>`);
 if(who==='nora') g.push(`<path d="M-58 22q-8 44 4 70M58 22q8 44 -4 70" stroke="${hair}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M32 -30l5 11 12 1-9 8 3 12-11-7-10 7 3-12-9-8 12-1Z" fill="#ffd43b"/>`);
 if(who==='juni') g.push(`<path d="M-20 -50q20-40 50-30q-20 10-50 30Z" fill="#8ce99a"/><circle cx="-40" cy="-30" r="8" fill="#ff8787"/>`);
 if(who==='bree') g.push(`<rect x="-60" y="-26" width="120" height="12" rx="6" fill="#5c4033"/><circle cx="-22" cy="-22" r="15" fill="#a5d8ff" stroke="#5c4033" stroke-width="5"/><circle cx="22" cy="-22" r="15" fill="#a5d8ff" stroke="#5c4033" stroke-width="5"/>`);
 if(who==='sunny') g.push(`<circle cx="30" cy="62" r="5" fill="#ffd43b"/>`);
 if(who==='prof') g.push(`<path d="M-80 -30L0 -150L80 -30Z" fill="${robe}"/><path d="M-90 -28h180" stroke="${robe}" stroke-width="14" stroke-linecap="round"/><path d="M20 -100l4 9 9 3-9 3-4 9-4-9-9-3 9-3Z" fill="#ffd43b"/>`);
 const ex=o.expr||'happy';
 if(ex==='closed') g.push(`<path d="M-32 40q12 10 22 0M12 40q12 10 22 0" stroke="#2b2b33" stroke-width="4" fill="none" stroke-linecap="round"/>`);
 else [-21,23].forEach(dx=>g.push(`<ellipse cx="${dx}" cy="38" rx="12" ry="${ex==='sad'?13:16}" fill="#6b3f22"/><circle cx="${dx+4}" cy="31" r="5" fill="#fff"/><circle cx="${dx-4}" cy="45" r="2.5" fill="#fff"/>`));
 if(who==='mei') g.push(`<circle cx="-21" cy="38" r="20" fill="none" stroke="#333" stroke-width="3.5"/><circle cx="23" cy="38" r="20" fill="none" stroke="#333" stroke-width="3.5"/><path d="M-1 38h4" stroke="#333" stroke-width="3.5"/>`);
 if(who==='gran'||who==='prof') g.push(`<circle cx="-21" cy="38" r="18" fill="none" stroke="#777" stroke-width="2.5"/><circle cx="23" cy="38" r="18" fill="none" stroke="#777" stroke-width="2.5"/>`);
 const br=ex==='sad'?'M-36 14q12 6 24 0M12 14q12 6 24 0':who==='iris'?'M-36 18q12-10 26-2M10 16q14-8 26 2':'M-36 16q12-8 26-4M10 12q14-4 26 4';
 g.push(`<path d="${br}" stroke="#2b2b33" stroke-width="4" fill="none" stroke-linecap="round"/>`);
 const m=ex==='sad'?'M-12 70q12-10 24 0':ex==='shy'?'M-8 66q8 4 16 0':ex==='smirk'?'M-10 66q14 6 22-6':ex==='wow'?'M-8 62a8 10 0 1 0 16 0a8 10 0 1 0-16 0':'M-14 62q14 18 28 0Z';
 g.push(`<path d="${m}" fill="${(m.endsWith('Z')||ex==='wow')?'#c2255c':'none'}" stroke="#b5524f" stroke-width="3.5" stroke-linecap="round"/>`);
 g.push(`<ellipse cx="-40" cy="56" rx="9" ry="5" fill="#f2a0a0" opacity=".6"/><ellipse cx="40" cy="56" rx="9" ry="5" fill="#f2a0a0" opacity=".6"/>`);
 if(who==='nora'&&o.badge!==false) g.push(`<g transform="translate(-42,176)"><rect width="84" height="28" rx="14" fill="#7048e8"/><text x="42" y="20" font-family="Poppins,system-ui" font-weight="700" font-size="16" fill="#fff" text-anchor="middle">Nora</text></g>`);
 const sc=who==='nora'?s*1.12:s;
 return `<g transform="translate(${x},${y}) scale(${o.flip?-sc:sc},${sc})" filter="url(#soft)"${who==='lola'?' opacity=".78"':''}>${g.join('')}</g>`;
}
const svg=(inner,vb='0 0 1024 640')=>`<svg viewBox="${vb}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${DEFS}${inner}</svg>`;
const BGS={
 room:()=>`<rect width="1024" height="640" fill="#e9dcc2"/><g filter="url(#wash)" opacity=".85"><rect x="-30" y="-30" width="1100" height="700" fill="#6a76ad"/><rect x="600" y="70" width="320" height="260" fill="#2b3566"/><circle cx="760" cy="170" r="60" fill="#fff6d8"/><rect x="-30" y="470" width="1100" height="200" fill="#8a6f55"/></g><path d="M600 70h320v260H600Z M760 70v260M600 200h320" stroke="#5a4632" stroke-width="10" fill="none" filter="url(#soft)"/><circle cx="300" cy="360" r="260" fill="url(#warm)" opacity=".7"/>`,
 gate:()=>`<rect width="1024" height="640" fill="#e9dcc2"/><g filter="url(#wash)" opacity=".85"><rect x="-30" y="-30" width="1100" height="420" fill="#8b9bd0"/><path d="M380 420V160l40-60 40 60V420ZM560 420V140l40-70 40 70V420ZM460 420V230h120V420Z" fill="#4d5b8f"/><path d="M-30 400C200 360 500 420 1060 380V680H-30Z" fill="#a9b98a"/><circle cx="880" cy="90" r="44" fill="#fff6d8"/></g><path d="M480 420V320q40-50 80 0V420Z" fill="#3b2a50" filter="url(#soft)"/><circle cx="520" cy="300" r="170" fill="url(#warm)" opacity=".6"/>`,
 library:()=>`<rect width="1024" height="640" fill="#efe2c8"/><g filter="url(#wash)" opacity=".85"><rect x="-30" y="-30" width="1100" height="480" fill="#b99c78"/>${[40,240,780].map(x=>`<rect x="${x}" y="60" width="180" height="360" fill="#7a5a40"/>`).join('')}${[40,240,780].flatMap(x=>[100,190,280,370].map(y=>`<rect x="${x+10}" y="${y-24}" width="160" height="22" fill="${['#c0392b','#2f6f9e','#3f8f4f','#8e44ad'][(x+y)%4]}"/>`)).join('')}<rect x="-30" y="440" width="1100" height="240" fill="#a88a6a"/></g><circle cx="540" cy="300" r="240" fill="url(#warm)" opacity=".55"/>`,
 hall:()=>`<rect width="1024" height="640" fill="#efe2c8"/><g filter="url(#wash)" opacity=".85"><rect x="-30" y="-30" width="1100" height="480" fill="#c7b79a"/><path d="M120 420V140q90-120 180 0V420ZM420 420V120q90-120 180 0V420ZM720 420V140q90-120 180 0V420Z" fill="#8fa0cf"/><rect x="-30" y="420" width="1100" height="260" fill="#a88a6a"/></g>`,
 courtyard:()=>`<rect width="1024" height="640" fill="#f3e3c8"/><g filter="url(#wash)" opacity=".85"><rect x="-30" y="-30" width="1100" height="420" fill="#f2a76b"/><circle cx="820" cy="140" r="70" fill="#ffd43b"/><path d="M60 400V160l50-70 50 70V400ZM820 400V200l40-60 40 60V400Z" fill="#8a6fb0"/><path d="M-30 380C200 350 600 400 1060 370V680H-30Z" fill="#a9b98a"/><ellipse cx="512" cy="470" rx="160" ry="40" fill="#8fa0cf"/></g>`,
 stairs:()=>`<rect width="1024" height="640" fill="#e7f5ff"/><g filter="url(#wash)" opacity=".85"><rect x="-30" y="-30" width="1100" height="700" fill="#a5d8ff"/>${[0,1,2,3,4,5].map(i=>`<rect x="${80+i*150}" y="${460-i*60}" width="190" height="40" fill="#d0ebff"/>`).join('')}<path d="M0 0L60 80L120 0L180 90L240 0L300 70L360 0" fill="#e7f5ff"/></g>`,
 tower:()=>`<rect width="1024" height="640" fill="#ced4da"/><g filter="url(#wash)" opacity=".9"><rect x="-30" y="-30" width="1100" height="700" fill="#495057"/><path d="M380 640V160l132-120 132 120V640Z" fill="#343a40"/><rect x="470" y="220" width="84" height="120" fill="#5f3dc4"/><path d="M-30 500C200 470 600 520 1060 490V680H-30Z" fill="#2b3a33"/></g><path d="M150 40l-30 80 40 0-40 90" stroke="#ffe066" stroke-width="6" fill="none" opacity=".7"/>`,
};
function sceneSVG(bg,chars,extra=''){ return svg(BGS[bg]()+chars.map(c=>girl(...c)).join('')+extra); }

// ============ dragons (original designs) ============
const DRAGONS={ember:{c:'#ffa94d',belly:'#fff3bf',wing:'#ffd8a8',horn:'#e8590c'},thistle:{c:'#e599f7',belly:'#fff0f6',wing:'#f3d9fa',horn:'#9c36b5'},dawn:{c:'#ffd43b',belly:'#fff9db',wing:'#ffec99',horn:'#f08c00'}};
function dragon(x,y,s,o={}){ const d=DRAGONS[o.who||'ember'], st=o.stage||'baby', k=s*(st==='big'?1.6:st==='young'?1:.72);
 if(st==='egg'){ const crack=o.crack?`<path d="M-40 -10l18 14 14-20 16 18 16-16 16 12" stroke="#7a4520" stroke-width="5" fill="none"/>`:'';
  return `<g transform="translate(${x},${y}) scale(${s})" filter="url(#soft)"><ellipse cx="0" cy="40" rx="110" ry="120" fill="url(#warm)"/><ellipse cx="0" cy="0" rx="62" ry="80" fill="#ffd8a8"/><circle cx="-20" cy="-30" r="10" fill="#ffa94d"/><circle cx="22" cy="5" r="13" fill="#ffa94d"/><circle cx="-14" cy="35" r="8" fill="#ffa94d"/><ellipse cx="-22" cy="-46" rx="12" ry="18" fill="#fff" opacity=".5"/>${crack}</g>`; }
 const ex=o.expr||'happy', wingUp=o.fly?-1:1;
 const eye=ex==='closed'?`<path d="M44 12q10 8 20 0" stroke="#2b2b33" stroke-width="5" fill="none" stroke-linecap="round"/>`:`<ellipse cx="54" cy="10" rx="13" ry="${ex==='sad'?12:16}" fill="#2b2b33"/><circle cx="58" cy="4" r="5" fill="#fff"/><circle cx="50" cy="16" r="2.5" fill="#fff"/>`;
 const mouth=ex==='sad'?'M92 52q-10-6-20 0':ex==='wow'?'M80 50a7 7 0 1 0 14 0a7 7 0 1 0-14 0':'M74 48q12 12 26 0';
 return `<g transform="translate(${x},${y}) scale(${o.flip?-k:k},${k})" filter="url(#soft)">
  <path d="M-70 130C-150 150 -190 90 -160 60C-150 90 -110 110 -70 100Z" fill="${d.c}"/><path d="M-165 58l-20-14 26 2Z" fill="${d.horn}"/>
  <g transform="translate(-10,70) scale(1,${wingUp})"><path d="M0 0C-40 -60 -100 -110 -150 -120C-140 -90 -150 -70 -130 -50C-120 -60 -100 -60 -95 -40C-80 -50 -60 -45 -55 -25C-40 -30 -20 -20 -10 0Z" fill="${d.wing}" stroke="${d.c}" stroke-width="8" stroke-linejoin="round"/></g>
  <ellipse cx="0" cy="110" rx="82" ry="66" fill="${d.c}"/><ellipse cx="14" cy="124" rx="50" ry="44" fill="${d.belly}"/>
  ${[-50,-20,10].map(sx=>`<path d="M${sx} 50l12 -26 12 26Z" fill="${d.horn}"/>`).join('')}
  <ellipse cx="-40" cy="170" rx="20" ry="14" fill="${d.c}"/><ellipse cx="40" cy="172" rx="20" ry="14" fill="${d.c}"/>
  <path d="M20 70C30 40 40 20 50 10" stroke="${d.c}" stroke-width="44" stroke-linecap="round"/>
  <circle cx="50" cy="10" r="54" fill="${d.c}"/><ellipse cx="94" cy="38" rx="36" ry="26" fill="${d.c}"/><ellipse cx="102" cy="44" rx="22" ry="12" fill="${d.belly}" opacity=".6"/>
  <circle cx="112" cy="30" r="3.5" fill="#2b2b33"/><path d="M20 -36l-12 -40 30 26Z M56 -42l4 -44 22 36Z" fill="${d.horn}"/>
  ${eye}<path d="${mouth}" stroke="#2b2b33" stroke-width="4" fill="${ex==='wow'?'#c2255c':'none'}" stroke-linecap="round"/><ellipse cx="30" cy="36" rx="10" ry="6" fill="#ff8787" opacity=".5"/>
  ${o.breath?`<g filter="url(#glow)"><ellipse cx="170" cy="40" rx="40" ry="18" fill="#ffd43b"/><ellipse cx="220" cy="40" rx="30" ry="14" fill="#ff922b" opacity=".8"/></g>`:''}
 </g>`; }
