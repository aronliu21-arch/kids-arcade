/* ---------- train map: a real island, fog, curvy track that colors in, rescued babies, Pip on the train, tap-to-learn critters ---------- */
let trainAt=0,trainBusy=false,MAPL=null,SG=null;
const MAPS={
 land:{W:1000,H:640,R:46,isl:[500,330,452,288],st:[[175,505],[300,300],[560,525],[810,330],[520,165]],rv:[[860,240],null,[760,650]],title:[24,40,'start'],
  cr:{whale:[840,58],crab:[640,588],fish:[890,618],turtle:[952,500],ptero:[150,90]}},
 port:{W:600,H:1060,R:52,isl:[300,525,278,452],st:[[150,860],[425,705],[165,545],[430,370],[240,205]],rv:[[520,300],null,[0,470]],title:[300,1036,'middle'],
  cr:{whale:[78,110],crab:[60,505],fish:[540,995],turtle:[548,175],ptero:[515,70]}}};
const an=s=>REDUCED?'':s;
// pencil-sketch version of any crayon drawing: paper fill, grey pencil lines, no shading, no motion
const sketchify=h=>h.replace(/fill="url\(#hat\)"/g,'fill="none"').replace(/fill="#[0-9a-fA-F]{3,6}"/g,'fill="#fbf3e4"').replace(/stroke="#[0-9a-fA-F]{3,6}"/g,'stroke="#a8a29e"').replace(/<animate[^>]*\/>|<animateTransform[^>]*\/>/g,'').replace(/opacity="\.5"/g,'opacity=".35"');
function bez(p0,p1,p2,p3){return [p1,[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6],p2];}
function bpt(b,t){const u=1-t;return [0,1].map(i=>u*u*u*b[0][i]+3*u*u*t*b[1][i]+3*u*t*t*b[2][i]+t*t*t*b[3][i]);}
function bdir(b,t){const u=1-t;return [0,1].map(i=>3*u*u*(b[1][i]-b[0][i])+6*u*t*(b[2][i]-b[1][i])+3*t*t*(b[3][i]-b[2][i]));}
const bstr=b=>`M${b[0].join(' ')} C${b[1].join(' ')} ${b[2].join(' ')} ${b[3].join(' ')}`;
const restU=k=>k<4?k+.3:3.55;
function upos(u){const i=Math.max(0,Math.min(3,Math.floor(u))),t=Math.min(1,u-i);return {p:bpt(SG[i],t),d:bdir(SG[i],t)};}
function svgRuby(str,x,y,fs,anchor){const cs=[...str];const w=fs*1.05;let x0=anchor==='middle'?x-cs.length*w/2+w/2:anchor==='start'?x+w/2:x;let o='';
 cs.forEach((c,i)=>{const cx=x0+i*w;o+=`<text x="${cx}" y="${y}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${INK}">${c}</text>`;if(ZY[c])o+=`<text x="${cx}" y="${y-fs*.95}" text-anchor="middle" font-size="${fs*.36}" font-weight="700" fill="#868e96">${ZY[c]}</text>`;});return o;}
function palm(x,y,h,i){return `<g class="critter" data-k="palm"><g>${an(`<animateTransform attributeName="transform" type="rotate" values="-3 ${x} ${y};3 ${x} ${y};-3 ${x} ${y}" dur="${3+i%3*.7}s" repeatCount="indefinite"/>`)}
 <path d="M${x} ${y} q${h*.12} ${-h*.5} 0 ${-h}" stroke="#8b5e34" stroke-width="${h*.12}" fill="none" stroke-linecap="round"/><path d="M${x+h*.05} ${y} q${h*.12} ${-h*.5} 0 ${-h}" stroke="${INK}" stroke-width="1.6" fill="none"/>
 ${[-2.7,-2.1,-1.5,-.9,-.35].map(a=>`<path d="M${x} ${y-h} q${Math.cos(a)*h*.5} ${Math.sin(a)*h*.5-h*.12} ${Math.cos(a)*h*.85} ${Math.sin(a)*h*.3+h*.18}" stroke="#2b8a3e" stroke-width="${h*.16}" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;}
function cloud(cx,cy,s,cls){let o=`<g class="${cls||''}" style="transform-box:fill-box;transform-origin:center">`;[[-1,0,1],[0,-.45,1.15],[1,0,1],[.5,.4,.9],[-.5,.4,.9],[1.7,.25,.75],[-1.7,.25,.75]].forEach(([dx,dy,r])=>o+=crayon(ellPts(cx+dx*s*.9,cy+dy*s*.9,s*r*.75,s*r*.62,16),'#fff',2.4));
 return o+`<text x="${cx}" y="${cy+s*.32}" text-anchor="middle" font-size="${s*.9}" font-weight="900" fill="#adb5bd">?</text></g>`;}
function region(k,p,L,open){const [x,y]=p,R=L.R;let o='';
 if(k===0)o+=crayon(ellPts(x+R*1.6,y+R*.3,R*.9,R*.4),'#74c0fc',2)+`<g stroke="${INK}" stroke-width="2">${[0,1,2,3].map(i=>`<rect x="${x-R*1.9+i*R*.32}" y="${y-R*.2}" width="${R*.12}" height="${R*.7}" fill="#c08552"/>`).join('')}<rect x="${x-R*1.95}" y="${y}" width="${R*1.1}" height="${R*.12}" fill="#c08552"/></g>`;
 if(k===1){o+=crayon(ellPts(x,y+R*.2,R*2.6,R*1.6,26),'#8ce99a',2.2);[[-1.9,-.6,1.5],[1.8,-.9,1.3],[-1.2,1.2,1.1],[2.1,.9,1.2],[-.2,-1.5,1.2]].forEach(([dx,dy,h],i)=>o+=palm(x+dx*R,y+dy*R+R*.5,h*R,i));}
 if(k===2){const lr=L===MAPS.port?-1:0;o+=crayon(ellPts(x+lr*R*.8,y+(lr?0:R*.9),R*2.4,R*1.2,24),'#ffe8a3',2.2)+`<g stroke="${INK}" stroke-width="2"><path d="M${x+R*1.5} ${y-R*.2} v${R*1.1}" fill="none"/><path d="M${x+R*.8} ${y-R*.15} q${R*.7} -${R*.7} ${R*1.4} 0z" fill="#ff6b6b"/></g>`;}
 if(k===3){o+=crayon(ellPts(x,y+R*.3,R*2.4,R*1.4,24),'#f1f3f5',2.2)+crayon([[x-R*2.6,y-R*.2],[x-R*1.4,y-R*2.6],[x-R*.2,y-R*.2]],'#ced4da')+crayon([[x-R*1.75,y-R*1.9],[x-R*1.4,y-R*2.6],[x-R*1.05,y-R*1.9],[x-R*1.4,y-R*2.05]],'#fff',1.6)+
   crayon([[x+R*.2,y-R*.3],[x+R*1.5,y-R*2.9],[x+R*2.8,y-R*.3]],'#adb5bd')+crayon([[x+R*1.12,y-R*2.15],[x+R*1.5,y-R*2.9],[x+R*1.88,y-R*2.15],[x+R*1.5,y-R*2.3]],'#fff',1.6);
  if(open)for(let i=0;i<14;i++){const sx=x-R*2.6+i*R*.38,sy=y-R*2.8+(i*37)%(R*2);o+=`<circle cx="${sx}" cy="${sy}" r="3" fill="#fff" stroke="#a5d8ff" stroke-width="1">${an(`<animate attributeName="cy" values="${sy};${sy+R*2.2}" dur="${2.5+i%4*.6}s" repeatCount="indefinite"/>`)}</circle>`;}}
 if(k===4){o+=`<g class="critter" data-k="volcano">`+crayon([[x-R*2.6,y+R*.5],[x-R*.8,y-R*2.6],[x+R*.8,y-R*2.6],[x+R*2.6,y+R*.5]],'#8d6e63',2.6)+crayon([[x-R*.8,y-R*2.6],[x,y-R*2.1],[x+R*.8,y-R*2.6]],'#ff6b6b',2)+
  `<path d="M${x-R*.5} ${y-R*2.3} q-${R*.3} ${R*1} ${R*.2} ${R*1.8} M${x+R*.4} ${y-R*2.3} q${R*.5} ${R*.9} 0 ${R*1.7}" stroke="#fa5252" stroke-width="${R*.14}" fill="none" stroke-linecap="round"/>`;
  if(open){for(let i=0;i<3;i++){const bx=x+(i-1)*R*.45;o+=`<circle cx="${bx}" cy="${y-R*2.7}" r="${R*.14}" fill="#ff8787">${an(`<animate attributeName="cy" values="${y-R*2.6};${y-R*3.5}" dur="${1.4+i*.4}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="${1.4+i*.4}s" repeatCount="indefinite"/>`)}</circle>`;}
   o+=`<g opacity=".85">${crayon(ellPts(x+R*.3,y-R*3.3,R*.5,R*.4),'#dee2e6',1.6)}${crayon(ellPts(x+R*.9,y-R*3.9,R*.6,R*.45),'#dee2e6',1.6)}${an(`<animateTransform attributeName="transform" type="translate" values="0 0;${R*.2} -${R*.3};0 0" dur="4s" repeatCount="indefinite"/>`)}</g>`;}
  o+='</g>';}
 return o;}
const CRIT={whale:['whale','鯨魚'],crab:['crab','螃蟹'],fish:['fish','魚'],turtle:['sea turtle','海龜'],ptero:['Pteranodon','翼龍'],palm:['palm tree','椰子樹'],volcano:['volcano','火山'],wave:['wave','海浪']};
function critter(k,x,y,R){let o=`<g class="critter" data-k="${k}">`;
 if(k==='whale')o+=crayon(ellPts(x,y,R*1.2,R*.6),'#4263eb',2.4)+crayon([[x-R*1.1,y],[x-R*1.8,y-R*.5],[x-R*1.6,y+R*.5]],'#4263eb',2)+`<circle cx="${x+R*.7}" cy="${y-R*.1}" r="${R*.1}" fill="#fff"/><path d="M${x+R*.3} ${y-R*.6} q-${R*.2} -${R*.6} ${R*.1} -${R*.8} M${x+R*.3} ${y-R*.6} q${R*.3} -${R*.6} ${R*.6} -${R*.5}" stroke="#74c0fc" stroke-width="${R*.12}" fill="none" stroke-linecap="round">${an(`<animate attributeName="opacity" values="0;1;0;0" dur="3s" repeatCount="indefinite"/>`)}</path>`;
 if(k==='crab')o+=crayon(ellPts(x,y,R*.5,R*.32),'#ff6b6b',2)+`<path d="M${x-R*.45} ${y-R*.1} l-${R*.35} -${R*.35} M${x+R*.45} ${y-R*.1} l${R*.35} -${R*.35}" stroke="${INK}" stroke-width="3" fill="none"/>`+crayon(ellPts(x-R*.85,y-R*.5,R*.16,R*.16,10),'#ff6b6b',1.6)+crayon(ellPts(x+R*.85,y-R*.5,R*.16,R*.16,10),'#ff6b6b',1.6)+`<circle cx="${x-R*.15}" cy="${y-R*.12}" r="${R*.06}" fill="${INK}"/><circle cx="${x+R*.15}" cy="${y-R*.12}" r="${R*.06}" fill="${INK}"/>`;
 if(k==='fish')o+=`<g>${an(`<animateTransform attributeName="transform" type="translate" values="0 0;0 -${R*.9};0 0;0 0" dur="2.6s" repeatCount="indefinite"/>`)}${crayon(ellPts(x,y,R*.55,R*.32),'#ffa94d',2)}${crayon([[x-R*.5,y],[x-R*.95,y-R*.3],[x-R*.95,y+R*.3]],'#ffa94d',1.8)}<circle cx="${x+R*.28}" cy="${y-R*.06}" r="${R*.07}" fill="${INK}"/></g>`;
 if(k==='turtle')o+=crayon(ellPts(x+R*.65,y,R*.22,R*.18,10),'#94d82d',1.8)+crayon(ellPts(x,y,R*.6,R*.42),'#2f9e44',2.2)+`<path d="M${x-R*.3} ${y-R*.1} h${R*.6} M${x} ${y-R*.35} v${R*.7}" stroke="#94d82d" stroke-width="3"/>`;
 if(k==='ptero')o+=`<g>${an(`<animateTransform attributeName="transform" type="translate" values="0 0;${R*1.5} ${R*.4};0 ${R*.8};-${R*1.5} ${R*.4};0 0" dur="9s" repeatCount="indefinite"/>`)}<g transform="translate(${x-R*.7},${y-R*.5}) scale(${R*.014})">${dinoSVG('ptero',solid('ptero','purple'))}</g></g>`;
 return o+'</g>';}
function trainSVG(s){const r=(x,y,w,h,c,sw)=>crayon(subdiv([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],2),c,sw||2.2);
 return `<g transform="scale(${s})">${r(-34,-30,44,26,'#e03131')}${r(4,-46,26,42,'#1c7ed6')}${r(9,-40,16,12,'#d0ebff',1.6)}${r(-28,-44,9,15,'#495057',1.8)}<circle cx="-24" cy="-52" r="5" fill="#fff" opacity=".85">${an('<animate attributeName="cy" values="-52;-70" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".9;0" dur="1.6s" repeatCount="indefinite"/>')}</circle><circle cx="-18" cy="-62" r="6" fill="#fff" opacity=".7"/>${r(-38,-8,72,6,'#ffd43b',1.8)}${[-22,2,22].map(x=>crayon(ellPts(x,2,8,8,12),'#343a40',1.8)).join('')}</g>`;}
/* ---------- bookshelf: one storybook per chapter ---------- */
const SHELF={land:{W:1000,H:640,bw:200,bh:350,pos:[[70,575],[305,575],[540,575],[775,575]],shelves:[575]},port:{W:600,H:1060,bw:250,bh:370,pos:[[35,568],[315,568],[35,1018],[315,1018]],shelves:[568,1018]}};
function bookSVG(ci,x,yb,w,h,state){const c=CH[ci];const y=yb-h;const cw=w-24,chh=h*.58;const ax=x+14,ay=y+16;let o='';const col=['#69db7c','#ffd43b','#74c0fc','#ff8787','#f783ac','#9775fa','#ffa94d','#38d9a9'][ci%8];
 const cover=crayon(subdiv([[x,y],[x+w,y],[x+w,yb],[x,yb]],3),col,3)+`<rect x="${x+4}" y="${y+4}" width="8" height="${h-8}" fill="#000" opacity=".12"/>`;
 let art=areaArt(c.key,cw,chh);const fr=CAST[c.friend];if(fr&&!c.hideFriend){const s=Math.min(chh*.55,cw*.4)/100;art+=`<g transform="translate(${cw*.62-50*s},${chh*.92-80*s}) scale(${s})">${dinoSVG(fr.t,fr.c)}</g>`;}
 const ps=chh*.32/100;art+=`<g transform="translate(${cw*.14},${chh*.92-80*ps}) scale(${ps})">${dinoSVG('babytrike',PIPC)}</g>`;
 const pic=`<svg x="${ax}" y="${ay}" width="${cw}" height="${chh}" viewBox="0 0 ${cw} ${chh}" preserveAspectRatio="xMidYMid slice">${art}</svg><rect x="${ax}" y="${ay}" width="${cw}" height="${chh}" rx="6" fill="none" stroke="${INK}" stroke-width="2.4"/>`;
 const fs=w*.12;const plate=crayon(subdiv([[x+12,y+chh+28],[x+w-12,y+chh+28],[x+w-12,yb-14],[x+12,yb-14]],2),'#fffdf6',2)+
  `<text x="${x+w/2}" y="${y+chh+28+fs*1.2}" text-anchor="middle" font-size="${Math.min(fs*.72,(w-34)/c.title[0].length*1.85)}" font-weight="900" fill="${INK}">${c.title[0]}</text>${svgRuby(c.title[1],x+w/2,y+chh+28+fs*2.75,Math.min(fs*.8,(w-30)/c.title[1].length/1.08),'middle')}`;
 let book=cover+pic+plate;
 if(state==='lock')book=sketchify(book)+`<g opacity=".85"><path d="M${x} ${y+h*.42}H${x+w}M${x+w*.5} ${y}V${yb}" stroke="#e8590c" stroke-width="${w*.05}" opacity=".55"/>${crayon(ellPts(x+w*.5,y+h*.42,w*.12,w*.12,14),'#ffa94d',2)}<text x="${x+w*.5}" y="${y+h*.42+w*.06}" text-anchor="middle" font-size="${w*.15}" font-weight="900" fill="#fff">?</text></g>`;
 else if(state==='new')book=sketchify(book)+`<g class="colorin">${book}</g>`;
 o+=`<g class="bk" data-ci="${ci}">`;
 if(state==='next'||state==='new')o+=`<rect x="${x-8}" y="${y-8}" width="${w+16}" height="${h+16}" rx="14" fill="#ffd43b" opacity=".45">${an(`<animate attributeName="opacity" values=".25;.6;.25" dur="1.6s" repeatCount="indefinite"/>`)}</rect>`;
 o+=`<g>${state==='next'||state==='new'?an(`<animateTransform attributeName="transform" type="translate" values="0 0;0 -10;0 0" dur="1.6s" repeatCount="indefinite"/>`):''}${book}`;
 // bookmark ribbon while a book is half read
 const k=(S.step||{})[ci]||0,len=c.flow.length;if(state!=='lock'&&k>0&&k<len)o+=`<path d="M${x+w*.72} ${y-18} h${w*.12} v${h*.25} l-${w*.06} -${w*.07} l-${w*.06} ${w*.07}z" fill="#e03131" stroke="${INK}" stroke-width="2"/>`;
 if(state==='done'){o+=`<g transform="translate(${x+w-12},${y+14})">${crayon(subdiv([[0,-w*.13],[w*.04,-w*.04],[w*.13,-w*.03],[w*.06,w*.03],[w*.08,w*.12],[0,w*.07],[-w*.08,w*.12],[-w*.06,w*.03],[-w*.13,-w*.03],[-w*.04,-w*.04]],1),'#ffd43b',2)}</g>`;
  const bb=c.baby;const s=w*.0042;if(bb)o+=`<g transform="translate(${x+w*.12},${y-80*s+4}) scale(${s})">${dinoSVG(bb.t,bb.c)}</g>`;else o+=`<g transform="translate(${x+w*.05},${y-80*s*1.3+4}) scale(${s*1.3})">${dinoSVG('trike',MOMC)}</g><g transform="translate(${x+w*.55},${y-80*s*.9+4}) scale(${s*.9})">${dinoSVG('babytrike',PIPC)}</g>`;}
 return o+'</g></g>';}
