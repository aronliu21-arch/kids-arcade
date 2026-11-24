/* ---------- Card Quest Street: the walkable village ---------- */
const VH=600,GROUND=470;
const BLD=[
 {k:'home',x:60,w:300,door:200,e:'🏠',n:'Lucas’s House',z:[['陸','ㄌㄨˋ'],['晨','ㄔㄣˊ'],['的','˙ㄉㄜ'],['家','ㄐㄧㄚ']],d:'Your binder and trophies',go:()=>S.freePacks>0?openPack(true):binder()},
 {k:'store',x:420,w:320,door:580,e:'🛒',n:'Card Store',z:[['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['店','ㄉㄧㄢˋ']],d:'Packs $2 and single cards',go:()=>store()},
 {k:'cash',x:800,w:260,door:930,e:'🧾',n:'Corner Shop',z:[['收','ㄕㄡ'],['銀','ㄧㄣˊ'],['打','ㄉㄚˇ'],['工','ㄍㄨㄥ']],d:'Cashier job · 35–50¢ a customer + tips',go:()=>cashier(false)},
 {k:'sort',x:1110,w:280,door:1250,e:'🗂️',n:'Card Warehouse',z:[['整','ㄓㄥˇ'],['理','ㄌㄧˇ'],['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ']],d:'Sorting job · 50¢ a row',go:()=>sortJob()},
 {k:'insp',x:1440,w:250,door:1565,e:'🔍',n:'Inspector Office',z:[['鑑','ㄐㄧㄢˋ'],['定','ㄉㄧㄥˋ'],['真','ㄓㄣ'],['假','ㄐㄧㄚˇ']],d:'Real or fake? 40–60¢ a card',go:()=>inspectJob()},
 {k:'arena',x:1750,w:340,door:1920,e:'⚔️',n:'Battle Arena',z:[['對','ㄉㄨㄟˋ'],['戰','ㄓㄢˋ']],d:'Friendly battle or Rival Road',go:()=>arenaMenu()},
 {k:'stadium',x:2150,w:400,door:2350,e:'🏆',n:'Card Quest Stadium',z:[['錦','ㄐㄧㄣˇ'],['標','ㄅㄧㄠ'],['賽','ㄙㄞˋ']],d:'Tournament · $1 entry, win $5 + Prize card',go:()=>tourStart()},
 {k:'lot',x:2610,w:330,door:2775,e:'🏪',n:'',z:[['我','ㄨㄛˇ'],['的','˙ㄉㄜ'],['店','ㄉㄧㄢˋ']],d:'',go:()=>lotGo()}];
const WORLD_W=3000;
let VL=null;
function skyMode(){const h=new Date().getHours();return h>=6&&h<17?'day':h>=17&&h<19?'dusk':'night';}
const SW5='stroke="#1b1f3b" stroke-width="5" stroke-linejoin="round"';
function bHome(b,night){const x=b.x,lit=night?'#ffe066':'#d0ebff';return `<g>
 <rect x="${x+230}" y="${GROUND-260}" width="34" height="70" fill="#c92a2a" ${SW5}/><g class="smoke"><circle cx="${x+247}" cy="${GROUND-280}" r="12" fill="#fff" opacity=".7"/><circle cx="${x+258}" cy="${GROUND-305}" r="16" fill="#fff" opacity=".5"/></g>
 <rect x="${x+20}" y="${GROUND-200}" width="260" height="200" fill="#fff3bf" ${SW5}/><path d="M${x} ${GROUND-195}L${x+150} ${GROUND-310}L${x+300} ${GROUND-195}Z" fill="#fa5252" ${SW5}/>
 <path d="M${x+40} ${GROUND-220}H${x+260}" stroke="#c92a2a" stroke-width="6"/><circle cx="${x+150}" cy="${GROUND-245}" r="22" fill="${lit}" ${SW5}/><path d="M${x+150} ${GROUND-267}V${GROUND-223}M${x+128} ${GROUND-245}H${x+172}" stroke="#1b1f3b" stroke-width="4"/>
 <rect x="${x+40}" y="${GROUND-160}" width="70" height="60" fill="${lit}" ${SW5}/><text x="${x+75}" y="${GROUND-118}" font-size="34" text-anchor="middle">🏆</text>
 <rect x="${x+190}" y="${GROUND-160}" width="70" height="60" fill="${lit}" ${SW5}/><text x="${x+225}" y="${GROUND-118}" font-size="34" text-anchor="middle">📒</text>
 <rect x="${x+125}" y="${GROUND-110}" width="50" height="110" rx="6" fill="#1c7ed6" ${SW5}/><circle cx="${x+165}" cy="${GROUND-55}" r="5" fill="#ffd43b"/>
 <rect x="${x+70}" y="${GROUND-185}" width="160" height="22" rx="6" fill="#f76707" ${SW5}/><text x="${x+150}" y="${GROUND-168}" font-size="17" font-weight="900" fill="#fff" text-anchor="middle">LUCAS’S HOUSE</text>
 ${S.freePacks>0?`<g class="bob"><text x="${x+150}" y="${GROUND-330}" font-size="40" text-anchor="middle">🎁</text></g>`:''}</g>`;}
function bStore(b,night){const x=b.x;let stripes='';for(let i=0;i<8;i++)stripes+=`<path d="M${x+i*40} ${GROUND-210}H${x+i*40+40}L${x+i*40+34} ${GROUND-180}H${x+i*40+6}Z" fill="${i%2?'#fff':'#f76707'}" stroke="#1b1f3b" stroke-width="3"/>`;
 return `<g><rect x="${x}" y="${GROUND-300}" width="320" height="300" fill="#4c6ef5" ${SW5}/><rect x="${x+20}" y="${GROUND-290}" width="280" height="60" rx="10" fill="#1b1f3b"/>
 <text class="neon" x="${x+160}" y="${GROUND-247}" font-size="40" font-weight="900" font-style="italic" fill="#ffe066" text-anchor="middle">CARD STORE</text>${stripes}
 <rect x="${x+20}" y="${GROUND-170}" width="150" height="120" fill="${night?'#fff3bf':'#e7f5ff'}" ${SW5}/>
 <g transform="translate(${x+35} ${GROUND-160}) rotate(-8) scale(.32)">${cardBackMini('#e03131')}</g><g transform="translate(${x+90} ${GROUND-165}) rotate(6) scale(.32)">${cardBackMini('#ffd43b')}</g>
 <rect x="${x+200}" y="${GROUND-170}" width="90" height="170" rx="6" fill="#ffd8a8" ${SW5}/><rect x="${x+212}" y="${GROUND-155}" width="66" height="70" fill="${night?'#ffe066':'#a5d8ff'}" stroke="#1b1f3b" stroke-width="3"/>
 <g class="bob2"><path d="M${x+280} ${GROUND-360}Q${x+262} ${GROUND-330} ${x+280} ${GROUND-300}" stroke="#1b1f3b" stroke-width="2" fill="none"/><rect x="${x+255}" y="${GROUND-410}" width="50" height="62" rx="6" fill="#9775fa" stroke="#1b1f3b" stroke-width="4"/><text x="${x+280}" y="${GROUND-370}" font-size="24" text-anchor="middle">🎁</text></g></g>`;}
function cardBackMini(c){return `<rect width="120" height="168" rx="10" fill="#1864ab" stroke="#1b1f3b" stroke-width="8"/><circle cx="60" cy="84" r="34" fill="${c}" stroke="#1b1f3b" stroke-width="8"/><path d="M60 62l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#fff"/>`;}
function bCash(b,night){const x=b.x;let st='';for(let i=0;i<7;i++)st+=`<path d="M${x-10+i*40} ${GROUND-200}H${x+30+i*40}L${x+24+i*40} ${GROUND-168}H${x-4+i*40}Z" fill="${i%2?'#fff':'#2f9e44'}" stroke="#1b1f3b" stroke-width="3"/>`;
 return `<g><rect x="${x}" y="${GROUND-260}" width="260" height="260" fill="#ffe3e3" ${SW5}/><rect x="${x+30}" y="${GROUND-250}" width="200" height="40" rx="8" fill="#fff" ${SW5}/><text x="${x+130}" y="${GROUND-221}" font-size="24" font-weight="900" fill="#2f9e44" text-anchor="middle">CORNER SHOP</text>${st}
 <rect x="${x+20}" y="${GROUND-150}" width="120" height="100" fill="${night?'#fff3bf':'#e7f5ff'}" ${SW5}/><rect x="${x+45}" y="${GROUND-105}" width="70" height="40" rx="6" fill="#868e96" stroke="#1b1f3b" stroke-width="3"/><rect x="${x+55}" y="${GROUND-120}" width="50" height="16" fill="#69db7c" stroke="#1b1f3b" stroke-width="3"/>
 <rect x="${x+160}" y="${GROUND-150}" width="80" height="150" rx="6" fill="#2f9e44" ${SW5}/><text x="${x+200}" y="${GROUND-100}" font-size="30" text-anchor="middle">🧾</text></g>`;}
function bSort(b,night){const x=b.x;let bricks='';for(let r=0;r<7;r++)for(let i=0;i<7;i++)bricks+=`<rect x="${x+8+i*38+(r%2?19:0)}" y="${GROUND-250+r*22}" width="34" height="18" fill="#e8590c" opacity=".35"/>`;
 return `<g><rect x="${x}" y="${GROUND-280}" width="280" height="280" fill="#d9480f" ${SW5}/>${bricks}<rect x="${x+20}" y="${GROUND-270}" width="240" height="40" rx="6" fill="#1b1f3b"/><text x="${x+140}" y="${GROUND-241}" font-size="24" font-weight="900" fill="#ffd43b" text-anchor="middle">CARD WAREHOUSE</text>
 <rect x="${x+40}" y="${GROUND-190}" width="200" height="190" fill="#495057" ${SW5}/>${[0,1,2,3,4,5].map(i=>`<path d="M${x+40} ${GROUND-170+i*14}H${x+240}" stroke="#868e96" stroke-width="3"/>`).join('')}
 <g>${[[60,40],[110,40],[85,80],[170,40]].map(([a,h])=>`<rect x="${x+a}" y="${GROUND-h}" width="44" height="40" fill="#c19a6b" stroke="#1b1f3b" stroke-width="3"/><path d="M${x+a} ${GROUND-h+12}H${x+a+44}" stroke="#8d6e63" stroke-width="4"/>`).join('')}</g></g>`;}
function bInsp(b,night){const x=b.x;return `<g><rect x="${x}" y="${GROUND-270}" width="250" height="270" fill="#364fc7" ${SW5}/><rect x="${x+20}" y="${GROUND-258}" width="210" height="38" rx="6" fill="#fff" ${SW5}/><text x="${x+125}" y="${GROUND-231}" font-size="22" font-weight="900" fill="#364fc7" text-anchor="middle">INSPECTOR</text>
 <g class="swing" style="transform-origin:${x+190}px ${GROUND-210}px"><circle cx="${x+190}" cy="${GROUND-165}" r="34" fill="${night?'#fff3bf':'#e7f5ff'}" stroke="#1b1f3b" stroke-width="8"/><path d="M${x+214} ${GROUND-140}L${x+240} ${GROUND-112}" stroke="#8d6e63" stroke-width="12" stroke-linecap="round"/><text x="${x+190}" y="${GROUND-153}" font-size="30" text-anchor="middle">🃏</text></g>
 <rect x="${x+30}" y="${GROUND-190}" width="80" height="70" fill="${night?'#ffe066':'#a5d8ff'}" ${SW5}/><path d="M${x+30} ${GROUND-155}H${x+110}M${x+70} ${GROUND-190}V${GROUND-120}" stroke="#1b1f3b" stroke-width="4"/>
 <rect x="${x+90}" y="${GROUND-110}" width="70" height="110" rx="6" fill="#1b1f3b" ${SW5}/><text x="${x+125}" y="${GROUND-60}" font-size="30" text-anchor="middle">🕵️</text></g>`;}
function bArena(b,night){const x=b.x;return `<g>${night?`<path d="M${x+60} ${GROUND-250}L${x-20} 0H${x+40}Z" fill="#fff" opacity=".18"/><path d="M${x+280} ${GROUND-250}L${x+360} 0H${x+300}Z" fill="#fff" opacity=".18"/>`:''}
 <path d="M${x} ${GROUND}V${GROUND-150}Q${x+170} ${GROUND-360} ${x+340} ${GROUND-150}V${GROUND}Z" fill="#ced4da" ${SW5}/><path d="M${x+20} ${GROUND-160}Q${x+170} ${GROUND-330} ${x+320} ${GROUND-160}" stroke="#fff" stroke-width="8" fill="none" opacity=".7"/>
 <circle cx="${x+170}" cy="${GROUND-210}" r="42" fill="#ffd43b" ${SW5}/><path d="M${x+176} ${GROUND-245}L${x+150} ${GROUND-205}H${x+168}L${x+160} ${GROUND-175}L${x+192} ${GROUND-218}H${x+174}Z" fill="#fff" stroke="#1b1f3b" stroke-width="4"/>
 <rect x="${x+20}" y="${GROUND-140}" width="300" height="36" rx="8" fill="#e03131" ${SW5}/><text class="neon" x="${x+170}" y="${GROUND-113}" font-size="26" font-weight="900" font-style="italic" fill="#fff" text-anchor="middle">BATTLE ARENA</text>
 <path d="M${x+110} ${GROUND}V${GROUND-80}Q${x+170} ${GROUND-130} ${x+230} ${GROUND-80}V${GROUND}Z" fill="#1b1f3b"/>
 ${[[x+30,'#1c7ed6'],[x+310,'#e03131']].map(([fx,c])=>`<path d="M${fx} ${GROUND-150}V${GROUND-250}" stroke="#1b1f3b" stroke-width="5"/><path class="flag" d="M${fx} ${GROUND-250}L${fx+40} ${GROUND-238}L${fx} ${GROUND-224}Z" fill="${c}" stroke="#1b1f3b" stroke-width="3"/>`).join('')}</g>`;}
function bStadium(b,night){const x=b.x;let lights='';for(let i=0;i<9;i++)lights+=`<circle cx="${x+40+i*40}" cy="${GROUND-250}" r="8" fill="${night?'#ffe066':'#fff'}" stroke="#1b1f3b" stroke-width="3" class="${night?'twink':''}" style="animation-delay:${i*.15}s"/>`;
 return `<g><path d="M${x} ${GROUND}V${GROUND-240}H${x+400}V${GROUND}Z" fill="#7048e8" ${SW5}/>${lights}<path d="M${x} ${GROUND-170}H${x+400}" stroke="#ffd43b" stroke-width="10"/>
 <g class="bob"><path d="M${x+170} ${GROUND-330}H${x+230}Q${x+230} ${GROUND-280} ${x+200} ${GROUND-275}Q${x+170} ${GROUND-280} ${x+170} ${GROUND-330}Z" fill="#ffd43b" ${SW5}/><rect x="${x+188}" y="${GROUND-275}" width="24" height="18" fill="#ffd43b" stroke="#1b1f3b" stroke-width="4"/><rect x="${x+175}" y="${GROUND-260}" width="50" height="12" rx="3" fill="#f08c00" stroke="#1b1f3b" stroke-width="4"/></g>
 <rect x="${x+50}" y="${GROUND-225}" width="300" height="44" rx="10" fill="#1b1f3b"/><text class="neon" x="${x+200}" y="${GROUND-193}" font-size="28" font-weight="900" font-style="italic" fill="#ffd43b" text-anchor="middle">CARD QUEST CUP</text>
 ${[0,1,2].map(i=>`<rect x="${x+40+i*120}" y="${GROUND-150}" width="80" height="80" fill="${['#e03131','#1c7ed6','#2f9e44'][i]}" stroke="#1b1f3b" stroke-width="4"/><text x="${x+80+i*120}" y="${GROUND-98}" font-size="36" text-anchor="middle">${['🔥','💧','🍃'][i]}</text>`).join('')}
 <path d="M${x+160} ${GROUND}V${GROUND-60}H${x+240}V${GROUND}Z" fill="#1b1f3b"/><text x="${x+200}" y="${GROUND-75}" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">🏆 ×${S.trophies}</text></g>`;}
function bLot(b,night){const x=b.x;if(S.shopOpen)return `<g><rect x="${x}" y="${GROUND-290}" width="330" height="290" fill="#1b1f3b" ${SW5}/><rect x="${x+15}" y="${GROUND-280}" width="300" height="56" rx="12" fill="#1b1f3b" stroke="#ffd43b" stroke-width="5"/>
 <text class="neon pink" x="${x+165}" y="${GROUND-240}" font-size="34" font-weight="900" font-style="italic" fill="#ff8cc6" text-anchor="middle">LUCAS’S CARDS</text>
 <rect x="${x+20}" y="${GROUND-200}" width="180" height="150" fill="#fff3bf" ${SW5}/>${[0,1,2].map(i=>`<g transform="translate(${x+35+i*55} ${GROUND-185}) scale(.34)">${cardBackMini(['#e03131','#ffd43b','#4dabf7'][i])}</g>`).join('')}
 <rect x="${x+220}" y="${GROUND-180}" width="90" height="180" rx="6" fill="#f76707" ${SW5}/><text x="${x+265}" y="${GROUND-120}" font-size="16" font-weight="900" fill="#fff" text-anchor="middle">OPEN</text></g>`;
 const pr=Math.min(1,(S.cents/GOAL)*.6+(Math.min(S.trophies,TITLES)/TITLES)*.4),hgt=Math.round(40+pr*220);
 return `<g><rect x="${x+20}" y="${GROUND-hgt}" width="290" height="${hgt}" fill="#ffe8cc" stroke="#1b1f3b" stroke-width="4" stroke-dasharray="14 8"/>
 ${[0,1,2,3].map(i=>`<path d="M${x+20+i*96} ${GROUND}V${GROUND-hgt-20}" stroke="#f08c00" stroke-width="8"/>`).join('')}${[1,2,3].map(i=>`<path d="M${x+20} ${GROUND-i*hgt/3.2}H${x+310}" stroke="#f08c00" stroke-width="6"/>`).join('')}
 <path d="M${x+250} ${GROUND-hgt-20}V${GROUND-hgt-140}H${x+150}" stroke="#ffd43b" stroke-width="10" fill="none"/><path d="M${x+160} ${GROUND-hgt-140}V${GROUND-hgt-100}" stroke="#1b1f3b" stroke-width="3"/><rect x="${x+145}" y="${GROUND-hgt-100}" width="30" height="20" fill="#c19a6b" stroke="#1b1f3b" stroke-width="3"/>
 <rect x="${x+60}" y="${GROUND-150}" width="210" height="110" rx="10" fill="#fff" ${SW5}/><text x="${x+165}" y="${GROUND-118}" font-size="18" font-weight="900" fill="#1b1f3b" text-anchor="middle">FUTURE SHOP OF</text><text x="${x+165}" y="${GROUND-94}" font-size="22" font-weight="900" fill="#f76707" text-anchor="middle">LUCAS!</text>
 <text x="${x+165}" y="${GROUND-60}" font-size="16" font-weight="900" fill="#1b1f3b" text-anchor="middle">${Math.round(pr*100)}% built</text>
 ${[0,1,2,3,4,5,6].map(i=>`<path d="M${x+i*55} ${GROUND}V${GROUND-50}" stroke="#ced4da" stroke-width="6"/>`).join('')}<path d="M${x} ${GROUND-38}H${x+330}" stroke="#ced4da" stroke-width="6"/></g>`;}
const BART={home:bHome,store:bStore,cash:bCash,sort:bSort,insp:bInsp,arena:bArena,stadium:bStadium,lot:bLot};
function lucasWalker(){return `<g id="lw"><g id="lwb"><ellipse cx="0" cy="58" rx="26" ry="6" fill="#000" opacity=".2"/>
 <path id="lgL" d="M-6 30L-10 54" stroke="#1b1f3b" stroke-width="9" stroke-linecap="round"/><path id="lgR" d="M6 30L10 54" stroke="#1b1f3b" stroke-width="9" stroke-linecap="round"/>
 <g transform="translate(-50 -78) scale(1)" filter="url(#glow)">${LUCAS.replace('<svg viewBox="0 0 100 112">','<g>').replace('</svg>','</g>')}</g></g>
 <rect x="-32" y="-96" width="64" height="20" rx="10" fill="#f76707" stroke="#1b1f3b" stroke-width="3"/><text x="0" y="-81" font-size="14" font-weight="900" fill="#fff" text-anchor="middle">Lucas</text></g>`;}
function kidWalker(f){return `<g><ellipse cx="0" cy="58" rx="22" ry="5" fill="#000" opacity=".2"/><path class="kl" d="M-5 30L-7 54M5 30L7 54" stroke="#495057" stroke-width="8" stroke-linecap="round"/><g transform="translate(-42 -62) scale(.84)">${kidSVG(f[1],f[2]).replace('<svg viewBox="0 0 100 112">','<g>').replace('</svg>','</g>')}</g></g>`;}
function villageSVG(night,dusk){const sky=night?['#0b1026','#364fc7']:dusk?['#ff922b','#ffd8a8']:['#4dabf7','#d0ebff'];
 let stars='';if(night)for(let i=0;i<60;i++)stars+=`<circle cx="${(i*197)%WORLD_W}" cy="${(i*71)%260}" r="${i%4?1.5:2.6}" fill="#fff" class="${i%5?'':'twink'}" style="animation-delay:${(i%7)*.3}s"/>`;
 let sky2='';for(let i=0;i<14;i++){const h=120+((i*53)%140),w=90+((i*37)%70);sky2+=`<rect x="${i*230}" y="${GROUND-h-40}" width="${w}" height="${h+40}" fill="${night?'#1c2a6b':dusk?'#e8590c':'#a5d8ff'}" opacity=".8"/>`;}
 let props='';for(let x=380;x<WORLD_W;x+=420)props+=`<path d="M${x} ${GROUND+30}V${GROUND-170}Q${x} ${GROUND-190} ${x+24} ${GROUND-190}" stroke="#1b1f3b" stroke-width="6" fill="none"/><circle cx="${x+28}" cy="${GROUND-184}" r="12" fill="${night?'#ffe066':'#fff3bf'}" stroke="#1b1f3b" stroke-width="4"/>${night?`<circle cx="${x+28}" cy="${GROUND-184}" r="40" fill="#ffe066" opacity=".18"/>`:''}`;
 for(const x of [395,1080,1715,2580])props+=`<circle cx="${x}" cy="${GROUND-40}" r="34" fill="#2f9e44" stroke="#1b1f3b" stroke-width="4"/><rect x="${x-6}" y="${GROUND-12}" width="12" height="16" fill="#8d6e63"/>`;
 return `<svg id="world" xmlns="http://www.w3.org/2000/svg" font-family="Arial Rounded MT Bold,ui-rounded,system-ui,sans-serif"><defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
 <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ffd43b"/></filter></defs>
 <rect x="-400" y="0" width="${WORLD_W+800}" height="${VH}" fill="url(#skyg)"/>
 <g id="pfar">${stars}<circle cx="300" cy="90" r="${night?34:46}" fill="${night?'#f8f9fa':'#ffe066'}"/>${night?'':'<circle cx="300" cy="90" r="64" fill="#ffe066" opacity=".25"/>'}</g>
 <g id="pcloud">${[100,700,1300,1900,2500].map((x,i)=>`<g class="drift" style="animation-delay:${-i*7}s"><ellipse cx="${x}" cy="${70+i%2*50}" rx="70" ry="22" fill="#fff" opacity="${night?.25:.9}"/><ellipse cx="${x+40}" cy="${60+i%2*50}" rx="40" ry="20" fill="#fff" opacity="${night?.25:.9}"/></g>`).join('')}
  <g class="blimp"><ellipse cx="900" cy="150" rx="110" ry="34" fill="#f76707" stroke="#1b1f3b" stroke-width="5"/><path d="M1000 150L1040 126V174Z" fill="#e8590c" stroke="#1b1f3b" stroke-width="4"/><rect x="870" y="182" width="60" height="18" rx="5" fill="#495057" stroke="#1b1f3b" stroke-width="3"/><text x="900" y="160" font-size="26" font-weight="900" font-style="italic" fill="#fff" text-anchor="middle">CARD QUEST</text></g></g>
 <g id="pmid">${sky2}</g>
 <g id="phill"><path d="M-400 ${GROUND-60}Q200 ${GROUND-160} 800 ${GROUND-70}T2000 ${GROUND-80}T3400 ${GROUND-60}V${GROUND}H-400Z" fill="${night?'#2b8a3e':'#69db7c'}" opacity=".9"/></g>
 <g id="blds">${BLD.map(b=>`<g class="bld" data-b="${b.k}">${BART[b.k](b,night)}</g>`).join('')}</g>
 <rect x="-400" y="${GROUND}" width="${WORLD_W+800}" height="40" fill="#dee2e6" stroke="#1b1f3b" stroke-width="3"/><path d="M-400 ${GROUND+40}H${WORLD_W+400}" stroke="#adb5bd" stroke-width="4"/>
 <rect x="-400" y="${GROUND+40}" width="${WORLD_W+800}" height="${VH-GROUND}" fill="${night?'#343a40':'#495057'}"/><path d="M-400 ${GROUND+95}H${WORLD_W+400}" stroke="#ffd43b" stroke-width="6" stroke-dasharray="40 30"/>
 ${props}<g id="coins"></g><g id="npcs"></g><g id="master"></g><g id="lucas" style="cursor:pointer">${lucasWalker()}</g></svg>`;}
function hub(fromAct){
 if(fromAct&&RUN>=3)return breakScreen();
 if(fromAct&&Math.random()<masterChance())S.masterHere=true;
 if(S.started&&!S.freePacks&&!S.qbSeen)return questBook();
 if(S.hubMode==='list')return hubList(fromAct);
 const mode=skyMode(),night=mode==='night',dusk=mode==='dusk';
 setScreen('hub',`<div class="vill"><div class="vhud"><div class="vgoal">${S.shopOpen?`<b>🏪 Your shop is open!</b>`:`<b>🏪 Shop: ${money(S.cents)} / ${money(GOAL)}</b><div class="bar"><i style="width:${Math.min(100,S.cents/GOAL*100)}%"></i></div><span>${'🏆'.repeat(Math.min(S.trophies,TITLES))}${'<span style="opacity:.3">🏆</span>'.repeat(Math.max(0,TITLES-S.trophies))}</span>`}</div>
 <button class="btn small" id="vqb">📜</button><button class="btn small" id="vsk">🎓</button><button class="btn ghost small" id="vlist">☰ List</button></div>
 <div class="vview" id="vview">${villageSVG(night,dusk)}<button class="btn ghost vmv" id="vl" aria-label="Walk left">◀</button><button class="btn ghost vmv" id="vr" aria-label="Walk right">▶</button></div>
 <div class="vbar"><div class="vinfo" id="vinfo">Tap a building to walk there!</div></div>
 <div class="vmap">${BLD.map(b=>`<button class="vm" data-go="${b.k}" aria-label="${b.n||'My shop'}">${b.e}<small>${{home:'Home',store:'Store',cash:'Cashier',sort:'Sorting',insp:'Inspect',arena:'Battle',stadium:'Cup',lot:'My shop'}[b.k]}</small></button>`).join('')}</div></div>`);
 villageStart(fromAct);}
function villageStart(fromAct){const svg=$('world'),view=$('vview');S.vx=S.vx||BLD[0].door;
 VL={x:S.vx,tx:S.vx,cam:0,dir:1,t:0,at:null,hold:0,coins:VL&&VL.coins&&!fromAct?VL.coins:[],kids:[],master:S.masterHere?{x:pick(BLD.slice(1,7)).x+30}:null};
 if(fromAct||!VL.coins.length){VL.coins=[0,1,2].map(()=>({x:ri(300,WORLD_W-300),v:pick([1,5,5,10]),got:false}));}
 VL.kids=shuffle(FOES).slice(0,2).map((f,i)=>({f,x:ri(700,2500),dir:i?1:-1,spd:40+i*15,mood:0}));
 $('coins').innerHTML=VL.coins.map((c,i)=>c.got?'':`<g class="coin2" id="cn${i}" transform="translate(${c.x} ${GROUND+12})"><g class="spinc"><ellipse rx="14" ry="14" fill="#fcc419" stroke="#7a4a00" stroke-width="3"/><text y="5" font-size="13" font-weight="900" text-anchor="middle" fill="#7a4a00">${c.v}¢</text></g></g>`).join('');
 $('npcs').innerHTML=VL.kids.map((k,i)=>`<g class="npc" data-k="${i}" id="kid${i}" style="cursor:pointer">${kidWalker(k.f)}<g class="kbub"><rect x="-44" y="-100" width="88" height="26" rx="10" fill="#fff" stroke="#1b1f3b" stroke-width="3"/><text x="0" y="-82" font-size="14" font-weight="900" text-anchor="middle" fill="#1b1f3b">Battle? ⚔️</text></g></g>`).join('');
 if(VL.master)$('master').innerHTML=`<g id="mst" style="cursor:pointer" transform="translate(${VL.master.x} ${GROUND-60})"><circle r="60" cy="40" fill="#b197fc" opacity=".35" class="twink"/><g transform="translate(-45 -20) scale(.9)">${MASTER.replace('<svg viewBox="0 0 100 112">','<g>').replace('</svg>','</g>')}</g><text y="-34" font-size="26" text-anchor="middle" class="bob">❓</text></g>`;
 const resize=()=>{const r=view.getBoundingClientRect(),asp=r.width/Math.max(1,r.height);VL.vy=asp<1.4?90:0;VL.vh=VH-VL.vy;VL.vw=VL.vh*asp;};resize();VL.onr=resize;addEventListener('resize',resize);
 VL.cam=Math.max(0,Math.min(WORLD_W-VL.vw,VL.x-VL.vw/2));
 const toWorld=e=>{const r=svg.getBoundingClientRect();return VL.cam+(e.clientX-r.left)/r.width*VL.vw;};
 svg.addEventListener('click',e=>{audio();const k=e.target.closest('.npc'),m=e.target.closest('#mst'),bl=e.target.closest('.bld'),lc=e.target.closest('#lucas');
  if(lc){VL.jump=1;tone(600,.12,'triangle',.08);tone(900,.12,'triangle',.08,.08);return;}
  if(m){walkTo(VL.master.x,()=>{S.masterHere=false;save();maybeMaster(()=>hub());});return;}
  if(k){const kd=VL.kids[+k.dataset.k];walkTo(kd.x-60*kd.dir,()=>kidTalk(kd));return;}
  if(bl){const b=BLD.find(x=>x.k===bl.dataset.b);walkTo(b.door,()=>arrive(b));return;}
  walkTo(toWorld(e));});
 const hold=d=>()=>{VL.hold=d;VL.after=null;VL.at=null;};const stop=()=>{VL.hold=0;};
 [['vl',-1],['vr',1]].forEach(([id,d])=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();audio();hold(d)();});['pointerup','pointerleave','pointercancel'].forEach(k=>b.addEventListener(k,stop));});
 $('vqb').onclick=()=>questBook();$('vsk').onclick=()=>skillPath();$('vlist').onclick=()=>{S.hubMode='list';save();hubList();};
 main.querySelectorAll('.vm').forEach(m=>m.onclick=()=>{audio();const b=BLD.find(x=>x.k===m.dataset.go);walkTo(b.door,()=>arrive(b));});
 const near=BLD.find(b=>Math.abs(b.door-VL.x)<40);if(near)arrive(near,true);
 let last=performance.now();const loop=now=>{if(SCREEN!=='hub'||!$('world')){removeEventListener('resize',resize);return;}const dt=Math.min(.05,(now-last)/1000);last=now;vTick(dt,now);requestAnimationFrame(loop);};requestAnimationFrame(loop);}
function walkTo(x,after){VL.tx=Math.max(40,Math.min(WORLD_W-40,x));VL.after=after||null;VL.at=null;VL.hold=0;$('vinfo').innerHTML='🚶 Walking…';}
function vTick(dt,now){const V=VL,sp=330;let moving=false;
 if(V.hold){V.x=Math.max(40,Math.min(WORLD_W-40,V.x+V.hold*sp*dt));V.tx=V.x;V.dir=V.hold;moving=true;const nb=BLD.find(b=>Math.abs(b.door-V.x)<30);if(nb&&V.at!==nb.k)arrive(nb,true);if(!nb&&V.at){V.at=null;$('vinfo').innerHTML='Tap a building to walk there!';}}
 else if(Math.abs(V.tx-V.x)>3){const d=Math.sign(V.tx-V.x);V.x+=d*Math.min(sp*dt,Math.abs(V.tx-V.x));V.dir=d;moving=true;if(Math.abs(V.tx-V.x)<=3&&V.after){const f=V.after;V.after=null;setTimeout(f,120);}}
 else if(V.after){const f=V.after;V.after=null;f();}
 S.vx=V.x;V.t+=dt*(moving?1:0);const sw=moving?Math.sin(V.t*14)*10:0,bob=moving?Math.abs(Math.sin(V.t*14))*-5:0;
 if(V.jump){V.jump+=dt*4;if(V.jump>2)V.jump=0;}const jy=V.jump?-Math.sin((V.jump-1)*Math.PI)*60:0;
 $('lw').setAttribute('transform',`translate(${V.x} ${GROUND-30+bob+jy}) scale(${V.dir} 1)`);$('lgL').setAttribute('d',`M-6 30L${-10+sw} 54`);$('lgR').setAttribute('d',`M6 30L${10-sw} 54`);
 const tc=Math.max(0,Math.min(WORLD_W-V.vw,V.x-V.vw/2));V.cam+=(tc-V.cam)*Math.min(1,dt*5);
 const svg=$('world');svg.setAttribute('viewBox',`${V.cam} ${V.vy} ${V.vw} ${V.vh}`);
 $('pfar').setAttribute('transform',`translate(${V.cam*.92} 0)`);$('pcloud').setAttribute('transform',`translate(${V.cam*.75} 0)`);$('pmid').setAttribute('transform',`translate(${V.cam*.55} 0)`);$('phill').setAttribute('transform',`translate(${V.cam*.3} 0)`);
 V.coins.forEach((c,i)=>{if(!c.got&&Math.abs(c.x-V.x)<26){c.got=true;S.cents+=c.v;save();const el=$('cn'+i);if(el)el.remove();const r=svg.getBoundingClientRect(),sx=r.left+(c.x-V.cam)/V.vw*r.width,sy=r.top+((GROUND-V.vy)/V.vh)*r.height;
  FX.emit(sx,sy,'gold',14,{speed:5});tone(1800,.08,'square',.06);tone(2400,.12,'square',.05,.06);toast(`🪙 You found ${c.v}¢!`,1200);}});
 V.kids.forEach((k,i)=>{const el=$('kid'+i);if(!el)return;if(Math.abs(k.x-V.x)>90||!k.stop){k.x+=k.dir*k.spd*dt;if(k.x<500||k.x>2700)k.dir*=-1;}k.stop=Math.abs(k.x-V.x)<90;
  el.setAttribute('transform',`translate(${k.x} ${GROUND-26}) scale(${k.dir} 1)`);const kb=el.querySelector('.kbub');if(kb)kb.setAttribute('transform',`scale(${k.dir} 1)`);el.querySelector('.kl').setAttribute('transform',k.stop?'':`rotate(${Math.sin(now/90+i)*6})`);});}
function arrive(b,quiet){VL.at=b.k;const name=b.k==='lot'?(S.shopOpen?'Lucas’s Cards':'Your future shop'):b.n;let desc=b.d;
 if(b.k==='lot')desc=S.shopOpen?'Sell cards and buy upgrades':`Needs ${money(GOAL)} + ${TITLES} 🏆 · you have ${money(S.cents)} + ${S.trophies} 🏆`;
 if(b.k==='home'&&S.freePacks>0)desc=`🎁 ${S.freePacks} free pack${S.freePacks>1?'s':''} waiting!`;
 $('vinfo').innerHTML=`<span class="ve">${b.e}</span><span class="vt"><b>${name}</b> ${zh(b.z)}<br><small>${desc}</small></span><button class="btn gold" id="vgo">Go in ▶</button>`;
 $('vgo').onclick=()=>{audio();whoosh();b.go();};if(!quiet)tone(700,.1,'triangle',.08);}
function lotGo(){if(S.shopOpen)return myShop();if(canOpen())return modal(`<div class="big">🏪</div><h2>Open your own shop?</h2><p>It costs <b>${money(GOAL)}</b>. You will have ${money(S.cents-GOAL)} left.</p>`,[['Open it! 🎉',()=>{S.cents-=GOAL;S.shopOpen=true;S.up=S.up||{};S.stock=S.stock||[];save();confetti();setTimeout(confetti,400);fanfare();FX.stamp('GRAND OPENING!','small','#ffd43b');shout('Your shop is open!');setTimeout(myShop,900);}],['Not yet',null,'ghost']]);
 const need=[];if(S.cents<GOAL)need.push('save '+money(GOAL-S.cents)+' more');if(S.trophies<TITLES)need.push('win '+(TITLES-S.trophies)+' more tournament title'+(TITLES-S.trophies>1?'s':''));toast('🔒 You need to '+need.join(' and ')+'!',2600);sfx.bad();}
function kidTalk(k){modal(`<div style="width:90px;margin:0 auto">${kidSVG(k.f[1],k.f[2])}</div><h2>${k.f[0]}: “Want to battle?”</h2><p>Winner gets $1.50!</p>`,[['⚔️ Battle!',()=>{PEND={kind:'friendly',foe:k.f,opp:oppTeam('friendly'),sel:[]};teamPick('friendly');}],['Maybe later',null,'ghost']]);}

/* chained result screen */
const NEXT={insp:['Battle',()=>teamPick('friendly')],myshop:['My shop',()=>myShop()],cash:['Sorting job',sortJob],sort:['Battle',()=>teamPick('friendly')],battle:['Card store',()=>store()],tour:['Card store',()=>store()],rival:['Rival Road',()=>rivalRoad()],practice:['Skill Path',()=>skillPath()]};
function result(kind,head,body,tip){RUN++;S.acts++;save();
 if(RUN>=3)return breakScreen(head,body);
 const n=NEXT[kind];
 setScreen('result',`<div class="hub"><div class="panel" style="text-align:center"><h2 class="h">${head}</h2>${body}${tip?`<div class="tip">💡 Try it for real: ${tip}</div>`:''}
 <div class="row"><button class="btn gold" data-a="next">Next: ${n[0]} ▶</button><button class="btn ghost" data-a="home">🏠 Home</button></div></div></div>`);
 bindAll({next:()=>{if(Math.random()<masterChance())S.masterHere=true;n[1]();},home:()=>hub(true)});}
function breakScreen(head,body){setScreen('break',`<div class="hub"><div class="panel" style="text-align:center">${head?`<h2 class="h">${head}</h2>${body}`:''}<div class="big">🌟</div><h2 class="h">Great practice! Time for a break</h2>${zh([['休','ㄒㄧㄡ'],['息','ㄒㄧˊ'],['一','ㄧˊ'],['下','ㄒㄧㄚˋ']])}<div class="row" style="margin-top:10px"><button class="btn" data-a="fin">Finish for now</button></div></div></div>`);
 shout('Great practice! Time for a break.');bindAll({fin(){RUN=0;title();}});}

