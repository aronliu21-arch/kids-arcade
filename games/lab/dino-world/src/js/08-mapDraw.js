function mapDraw(){const box=$('mapBox');const land=box.clientWidth/Math.max(1,box.clientHeight)>=1.05;const L=land?SHELF.land:SHELF.port;const {W,H,bw,bh}=L;
 let o=`<rect width="${W}" height="${H}" fill="#fff4e6"/>`;for(let x=0;x<W;x+=60)o+=`<path d="M${x+30} 0V${H}" stroke="#ffe8cc" stroke-width="22"/>`;
 for(let x=20;x<W;x+=60)for(let y=40;y<H;y+=90)o+=`<circle cx="${x+((y/90)%2)*30}" cy="${y}" r="3" fill="#ffc9c9" opacity=".6"/>`;
 const tw=land?400:460,tx=W/2;o+=crayon(subdiv([[tx-tw/2,12],[tx+tw/2,12],[tx+tw/2,112],[tx-tw/2,112]],3),'#c08552',3)+`<text x="${tx}" y="52" text-anchor="middle" font-size="32" font-weight="900" fill="#fff">Milo's Dino Books</text>${svgRuby('恐龍故事書',tx,100,28,'middle').replace(/fill="#5c3d2e"/g,'fill="#fff"').replace(/fill="#868e96"/g,'fill="#ffe8cc"')}`;
 L.shelves.forEach(yb=>{o+=crayon(subdiv([[20,yb],[W-20,yb],[W-20,yb+26],[20,yb+26]],4),'#a0703c',3)+`<rect x="40" y="${yb+26}" width="16" height="${land?H-yb-26:40}" fill="#8b5e34"/><rect x="${W-56}" y="${yb+26}" width="16" height="${land?H-yb-26:40}" fill="#8b5e34"/>`;});
 const newly=[];
 const pg=MAPPG,np=Math.ceil(CH.length/4);
 CH.forEach((c,ci)=>{if(Math.floor(ci/4)!==pg)return;const [x,yb]=L.pos[ci%4];let st=ci<S.ch?'done':ci===S.ch?'next':'lock';if(st!=='lock'&&ci>0&&!S.seen['col'+(ci+1)]){st='new';newly.push(ci+1);}o+=bookSVG(ci,x,yb,bw,bh,st);});
 if(np>1){const ay=land?330:62,r=land?46:34;for(const d of [-1,1]){const p2=pg+d;if(p2<0||p2>=np)continue;const ax=d<0?(land?42:36):W-(land?42:36);
   o+=`<g class="shelfnav" data-p="${p2}" style="cursor:pointer"><circle cx="${ax}" cy="${ay}" r="${r}" fill="#ffd43b" stroke="${INK}" stroke-width="4"/><path d="M${ax+(d<0?10:-10)} ${ay-18} L${ax+(d<0?-12:12)} ${ay} L${ax+(d<0?10:-10)} ${ay+18}" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
  o+=`<text x="${W/2}" y="${H-8}" text-anchor="middle" font-size="22" font-weight="900" fill="${INK}" opacity=".6">${Array.from({length:np},(_,k)=>k===pg?'●':'○').join(' ')}</text>`;}
 $('mapSvg').setAttribute('viewBox',`0 0 ${W} ${H}`);$('mapSvg').innerHTML=o;
 if(newly.length){newly.forEach(k=>S.seen['col'+k]=1);save();setTimeout(()=>{SFX.grow();say('A new book is ready to read!','有一本新的故事書可以讀了!');},700);}
 $('mapSvg').querySelectorAll('.bk').forEach(g=>g.addEventListener('click',()=>tapStation(+g.dataset.ci+1)));
 $('mapSvg').querySelectorAll('.shelfnav').forEach(g=>g.addEventListener('click',e=>{e.stopPropagation();ac();SFX.page();MAPPG=+g.dataset.p;mapDraw();say(MAPPG?'More books!':'Back to the first books!',MAPPG?'還有更多書!':'回到前面的書!');}));
 $('mapSvg').querySelectorAll('.critter').forEach(g=>g.addEventListener('click',e=>{e.stopPropagation();ac();const c=CRIT[g.dataset.k];if(!c)return;SFX.pop();g.classList.remove('boing');void g.getBBox();g.classList.add('boing');toast(bi(c[0],c[1]));say(c[0],c[1]);}));
 SOLVE=()=>tapStation(Math.min(S.ch+1,CH.length));}
let MAPPG=0;function goMap(){MAPPG=Math.min(Math.floor(Math.min(S.ch,CH.length-1)/4),Math.ceil(CH.length/4)-1);musicOn();BACK=null;show('map');say('Which book shall we read?','我們要讀哪一本書?');}
function tapStation(i){if(trainBusy)return;ac();if(i===0)return goZoo();const ci=i-1;
 if(ci>S.ch){SFX.boing();say('Not yet! Finish the book before it first.','還不行!先讀完前面那本書。');const g=$('mapSvg').querySelector(`.bk[data-ci="${ci}"]`);if(g){g.classList.remove('shake');void g.getBBox();g.classList.add('shake');}return;}
 trainBusy=true;SFX.page();const g=$('mapSvg').querySelector(`.bk[data-ci="${ci}"]`);if(g&&!REDUCED)g.classList.add('openbook');
 const c=CH[ci];const k=(S.step||{})[ci]||0;say(k>0&&k<c.flow.length?'Let’s keep reading!':`${c.en.replace(' Station','')}! Let’s read!`,k>0&&k<c.flow.length?'我們繼續讀!':`${c.zh}!我們來讀吧!`);
 setTimeout(()=>{trainBusy=false;enter(i);},REDUCED?0:650);}
function enter(i){if(i===0)return goZoo();openStation(i-1);}

/* ---------- the book: each chapter is a run of pages, puzzles and a build; a bookmark remembers the page ---------- */
let CUR=null;
function unlockArea(k){if(!S.areas.includes(k)){S.areas.push(k);save();}}
function needChips(t){const n=needOf(t);return `<div class="need">${Object.keys(n).map(s=>{const have=S.bin[s].length;return `<span class="${have>=n[s]?'ok':''}">${shapeIcon(s,'#ced4da')}${Math.min(have,n[s])}/${n[s]}</span>`;}).join('')}</div>`;}
const chHead=ci=>`📖 ${bi('Book '+(ci+1)+' · '+CH[ci].title[0],'第'+'一二三四五六七八'[ci]+'本書 · '+CH[ci].title[1])}`;
function openStation(ci){runChapter(ci);}
function runChapter(ci){CUR=ci;const c=CH[ci];unlockArea(c.key);S.step=S.step||{};if((S.step[ci]||0)>=c.flow.length)S.step[ci]=0;save();flowNext();}
function flowNext(){const ci=CUR,c=CH[ci];const k=S.step[ci]||0;if(k>=c.flow.length)return goMap();const it=c.flow[k];
 if(it[0]==='p'){const lines=[];let j=k;while(j<c.flow.length&&c.flow[j][0]==='p'){lines.push(c.flow[j].slice(1));j++;}
  const cast=['pip'].concat(c.hideFriend&&!(ci<S.ch)?[]:[c.friend]);scene(c.key,cast,lines,()=>{S.step[ci]=j;save();flowNext();},chHead(ci));return;}
 if(it[0]==='g')return startGame(it[1],ci,k);
 if(it[0]==='b'){if(S.goal[ci]){S.step[ci]=k+1;save();return flowNext();}
  if(canBuild(c.goal)){BACK=goMap;return startBuild(c.goal);}
  const extra=pick(c.flow.filter(x=>x[0]==='g'))[1];
  return scene(c.key,['pip'],[['pip',`We need a few more bricks for the ${TPL[c.goal].en}! Let’s solve one more puzzle.`,`蓋${TPL[c.goal].zh}還需要一些積木!再解一個謎題吧!`]],()=>startGame(extra,ci,-1),chHead(ci));}
 if(it[0]==='f')return finale(ci);}
function finale(ci){const c=CH[ci];S.rescued=S.rescued||{};
 const mine=S.dinos.slice().reverse().find(d=>d.t===c.goal&&(d.stage??2)===2)||{t:c.goal,c:stepCols(c.goal),name:''};
 CAST.goal={t:c.goal,c:mine.c,sz:1,em:'🦖',name:mine.name,pitch:.9,nm:[mine.name||TPL[c.goal].en,mine.name||TPL[c.goal].zh]};if(c.baby)CAST.baby={t:c.baby.t,c:c.baby.c,sz:.5,em:'🍼',pitch:1.7,nm:['Baby','寶寶']};
 const nm=mine.name||TPL[c.goal].en;const lines=c.finale.map(([w,en,z,v])=>[w,en.split('{N}').join(nm),z.split('{N}').join(nm),v]);
 scene(c.key,['pip',c.friend],lines,()=>{SFX.fanfare();confetti(60);const first=!S.rescued[ci];
  const finish=()=>{S.rescued[ci]=1;S.step[ci]=c.flow.length;const opened=S.ch<=ci;S.ch=Math.max(S.ch,ci+1);if(first)S.snacks+=2;save();showWallet(true);
   if(ci===3){if(first){S.dinos.push({t:'babytrike',c:PIPC,name:'PIP',area:'volcano',stage:0,hearts:0});S.dinos.push({t:'trike',c:MOMC,name:'MOM',area:'volcano',stage:2,hearts:0});save();}
    return scene('volcano',['pip','mom'],[['nar','The End. Pip and Mommy moved into your zoo! Feed Pip to help him grow.','完。皮皮和媽媽搬進你的動物園了!餵皮皮讓牠長大。']],()=>{Z.area='volcano';goZoo();},`📖 ${bi('The End','完')}`);}
   trainAt=ci+1;goMap();if(opened&&CH[ci+1])toast(`${CH[ci+1].em} ${bi(CH[ci+1].en+' is ready to color in!',CH[ci+1].zh+'可以著色了!')}`,2400);};
  if(c.baby&&first){say('Give the baby a name!','幫寶寶取名字!');nameDino(c.baby.t,c.baby.c,true,name=>{S.dinos.push({t:c.baby.t,c:c.baby.c,name,area:c.key,stage:0,hearts:0});save();afterName(`Baby ${name} moves to your zoo!`,`${name}寶寶搬進你的動物園了!`,finish,'🚂');});}
  else finish();},chHead(ci));}

/* ---------- rewards: bricks (build) + snacks (grow babies) ---------- */
// bricks lean toward the shapes the current station's dino still needs, so a build is never far away
function earnBricks(n){const out=[];const goal=CUR!==null&&!S.goal[CUR]?CH[CUR].goal:(CH[Math.min(S.ch,CH.length-1)]||CH[0]).goal;const need=needOf(goal);
 for(let i=0;i<n;i++){const want=SHAPES.filter(s=>(need[s]||0)>S.bin[s].length+out.filter(b=>b.s===s).length);const s=want.length?pick(want):pick(SHAPES);const b={s,c:pick(CK)};out.push(b);S.bin[s].push(b.c);}
 return out;}

/* ---------- build a dino (uses bricks from the bin) ---------- */
function binHTML(){return SHAPES.map(s=>S.bin[s].map(c=>shapeIcon(s,COL[c][0])).join('')).join('')||`<span class="zh" style="color:var(--muted)">${zh('積木箱是空的')} · Brick bin is empty</span>`;}
$('mapBuild').onclick=()=>{ac();BACK=goMap;openPick();};$('zBuildB').onclick=()=>{ac();BACK=goZoo;openPick();};
function openPick(star){musicOn();if(CUR!==null&&SCREEN==='station')BACK=()=>openStation(CUR);show('pick');const goal=star||(CUR!==null&&!S.goal[CUR]?CH[CUR].goal:null);
 $('pickBin').innerHTML=binHTML();
 $('pickTxt').innerHTML=bi('Pick a dino to build!','選一隻恐龍來蓋!');
 const ok=Object.keys(TPL).filter(k=>!TPL[k].nobuild&&canBuild(k));
 say(ok.length?'Pick a dino to build!':'You need more bricks! Play a job to earn bricks.',ok.length?'選一隻恐龍來蓋!':'積木不夠!去玩任務賺積木吧!');
 $('pickGrid').innerHTML=Object.keys(TPL).filter(k=>!TPL[k].nobuild).map(k=>{const T=TPL[k];const can=canBuild(k);return `<button class="pickc${can?'':' no'}${k===goal?' star':''}" data-t="${k}">${k===goal?'<span class="flag">⭐ Goal</span>':''}<svg class="d" viewBox="-6 -14 112 98">${dinoSVG(k,can?stepCols(k):solid(k,'#dee2e6'))}</svg><span class="en">${T.en}</span><span class="zh">${zh(T.zh)}</span>${needChips(k)}</button>`;}).join('');
 $('pickGrid').querySelectorAll('.pickc').forEach(b=>b.onclick=()=>{const t=b.dataset.t;if(!canBuild(t)){SFX.boing();const n=needOf(t);const miss=SHAPES.filter(s=>(n[s]||0)>S.bin[s].length).map(s=>[n[s]-S.bin[s].length,s]);const [k,s]=miss[0];say(`You need ${k} more ${k>1?SH[s][1]:SH[s][0]}!`,`還需要${k}個${SH[s][2]}!`);return;}startBuild(t);});
 SOLVE=()=>{const t=goal&&canBuild(goal)?goal:ok[0];if(t)startBuild(t);};}
let B=null,buildBusy=false;
function startBuild(t){musicOff();const P=pieces(t);
 // pick the actual bricks from the bin for each piece
 const bin={};SHAPES.forEach(s=>bin[s]=shuffle(S.bin[s].slice()));const cols=P.map(p=>bin[p.s].pop());
 B={t,P,cols,k:0,tries:0};show('build');buildStep();}
function buildStep(){const p=B.P[B.k];const c=COL[B.cols[B.k]],sh=SH[p.s];const L=LV('build');B.L=L;
 let w=[`Find the ${c[1]} ${sh[0]}!`,`找一個${c[2]}的${sh[2]}!`];let opts;
 $('bpSvg').innerHTML=dinoSVG(B.t,B.cols,{built:B.k,cur:B.k,popIdx:B.k-1});
 if(L<3){const other=shuffle(SHAPES.filter(s=>s!==p.s))[0],wc=shuffle(CK.filter(x=>x!==B.cols[B.k]))[0];const wc2=shuffle(CK.filter(x=>x!==B.cols[B.k]&&x!==wc))[0];
  opts=shuffle([{s:p.s,c:B.cols[B.k],ok:1},{s:p.s,c:wc},{s:other,c:B.cols[B.k]},{s:shuffle(SHAPES.filter(x=>x!==p.s&&x!==other))[0],c:wc2}]);
  if(L===1){$('bTxt').innerHTML=bi(w[0],w[1]);say(w[0],w[1]);}
  else{$('bTxt').innerHTML=`<div class="wordcard sm">${c[1]} ${sh[0]}<small>${zh(c[2]+sh[2])}</small></div>`;readCard($('bTxt').querySelector('.wordcard'),`${c[1]} ${sh[0]}`,c[2]+'的'+sh[2]);if(B.k===0)say(`Read the card: ${c[1]} ${sh[0]}! Find that brick.`,`讀卡片:${c[2]}的${sh[2]}!找到那塊積木。`);else say(`${c[1]} ${sh[0]}!`,`${c[2]}的${sh[2]}!`);}}
 else{const R=pick(REALSH[p.s]);const other=shuffle(SHAPES.filter(x=>x!==p.s));const wc=shuffle(CK.filter(x=>x!==B.cols[B.k]));
  opts=shuffle([{s:p.s,c:B.cols[B.k],ok:1},{s:p.s,c:wc[0]},{s:other[0],c:B.cols[B.k]},{s:other[1],c:wc[1]}]);
  w=[`It looks like a ${R[1]}! Find the ${c[1]} one.`,`它長得像${R[2]}!找${c[2]}的那一塊。`];B.hintSay=[`A ${R[1]} is a ${sh[0]}. Find the ${c[1]} ${sh[0]}.`,`${R[2]}是${sh[2]}。找${c[2]}的${sh[2]}。`];
  $('bTxt').innerHTML=`<div class="realsh"><span class="rpic">${R[0]}</span><span>${bi(w[0],w[1])}</span></div>`;say(w[0],w[1]);}
 B.w=w;$('bOpts').innerHTML=opts.map((o,i)=>`<button class="opt" data-i="${i}" aria-label="${COL[o.c][1]} ${SH[o.s][0]}">${shapeIcon(o.s,COL[o.c][0])}${o.d?`<span class="dots">${'●'.repeat(o.d)}</span>`:''}</button>`).join('');
 const btns=[...$('bOpts').children];const okB=btns[opts.findIndex(o=>o.ok)];
 btns.forEach((b,i)=>b.onclick=()=>buildPick(opts[i],b,okB));SOLVE=()=>okB.click();}
function buildPick(o,btn,okB){if(buildBusy)return;const p=B.P[B.k];const want=`${COL[B.cols[B.k]][1]} ${SH[p.s][0]}`;
 rec({q:`build ${B.t} L${B.L}: ${want}`,given:`${COL[o.c][1]} ${SH[o.s][0]}${o.d?' '+o.d:''}`,expected:want,correct:!!o.ok,tryNo:B.tries+1,topic:'build'});
 if(o.ok){track('build',true,B.tries===0);B.tries=0;return place();}
 SFX.boing();btn.classList.remove('shake');void btn.offsetWidth;btn.classList.add('shake');B.tries++;
 if(B.tries===1){okB.classList.add('wiggle');setTimeout(()=>okB.classList.remove('wiggle'),1900);const h=B.L===3?B.hintSay:B.w;say(h[0],h[1]);}
 else{track('build',false);B.tries=0;okB.classList.add('glow');say(`Here it is!`,`在這裡!`);buildBusy=true;setTimeout(()=>{buildBusy=false;place();},1500);}}
