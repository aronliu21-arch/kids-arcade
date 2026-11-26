
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
let SOUND=true;try{SOUND=localStorage.getItem('lab.sound')!=='0';}catch(e){}
let ac=null;function audio(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(ac&&ac.state==='suspended')ac.resume();return ac;}
function tone(f,d,type,vol,dl){if(!SOUND)return;const c=audio();if(!c)return;try{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+(dl||0);o.type=type||'sine';o.frequency.setValueAtTime(f,t);o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(vol||.15,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d+.05);}catch(e){}}
const sfx={good(){[523,659,784,1047].forEach((f,i)=>tone(f,.18,'triangle',.16,i*.07));},bad(){tone(200,.25,'sawtooth',.08);},pop(){tone(880,.08,'triangle',.14);},
  boing(){if(!SOUND)return;const c=audio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(300,c.currentTime);o.frequency.exponentialRampToValueAtTime(90,c.currentTime+.3);o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.15,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.35);o.start();o.stop(c.currentTime+.4);},
  coin(){tone(1320,.08,'square',.06);tone(1760,.12,'square',.05,.06);},honk(){tone(330,.35,'square',.09);tone(415,.35,'square',.07);},
  win(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,.3,'triangle',.15,i*.1));}};
function say(t,rate){if(!SOUND||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=rate||.95;u.pitch=1.1;speechSynthesis.speak(u);}catch(e){}}
let tt=0;function toast(h,ms){const t=$('toast');t.innerHTML=h;t.classList.remove('hide');clearTimeout(tt);tt=setTimeout(()=>t.classList.add('hide'),ms||1600);}
function modal(html,btns){const m=document.createElement('div');m.className='modal';m.innerHTML='<div>'+html+'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:10px"></div></div>';
  const row=m.querySelector('div>div:last-child');(btns||[]).forEach(([l,f,ghost])=>{const b=document.createElement('button');b.className='btn'+(ghost?' ghost':'');b.textContent=l;b.onclick=()=>{m.remove();f&&f();};row.appendChild(b);});document.body.appendChild(m);return m;}
$('snd').textContent=SOUND?'🔊':'🔇';$('snd').onclick=()=>{SOUND=!SOUND;$('snd').textContent=SOUND?'🔊':'🔇';try{localStorage.setItem('lab.sound',SOUND?'1':'0');}catch(e){}if(!SOUND&&'speechSynthesis' in window)speechSynthesis.cancel();};
/* Drag helper: makeDrag(el,{onDrop(el,x,y)->bool keep}) — pointer events, works with touch + mouse */
function makeDrag(el,o){el.classList.add('drag');el.addEventListener('pointerdown',e=>{if(o.can&&!o.can(el))return;e.preventDefault();audio();el.setPointerCapture(e.pointerId);
  const r=el.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top,ph=document.createElement('div');
  const st={pos:el.style.position,l:el.style.left,t:el.style.top,z:el.style.zIndex,w:el.style.width};
  el.style.width=r.width+'px';el.style.position='fixed';el.style.left=r.left+'px';el.style.top=r.top+'px';el.style.zIndex=30;el.style.transform='scale(1.08)';
  o.start&&o.start(el);
  const mv=ev=>{el.style.left=(ev.clientX-dx)+'px';el.style.top=(ev.clientY-dy)+'px';o.move&&o.move(el,ev.clientX,ev.clientY);};
  const up=ev=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);el.style.transform='';
    const keep=o.drop?o.drop(el,ev.clientX,ev.clientY):false;
    if(!keep){el.style.position=st.pos;el.style.left=st.l;el.style.top=st.t;el.style.zIndex=st.z;el.style.width=st.w;}};
  el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);});}
const hit=(el,x,y)=>{const r=el.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;};
function confetti(){const c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:60';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);
  const x=c.getContext('2d'),P=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight/3,vx:rnd(-7,7),vy:rnd(-9,1),c:pick(['#ffd43b','#ff6b6b','#74c0fc','#b197fc','#69db7c'])}));let n=0;
  (function f(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.25;x.fillStyle=p.c;x.fillRect(p.x,p.y,7,7);});if(++n<120)requestAnimationFrame(f);else c.remove();})();}
function ZYC(z){const T='ˊˇˋ',a=[...z],tn=a.find(c=>T.includes(c))||'',neu=a[0]==='˙',s=a.filter(c=>!T.includes(c)&&c!=='˙');return '<b class="zs">'+(neu?'<i class="zn">˙</i>':'')+s.map(c=>'<i>'+c+'</i>').join('')+'</b>'+(tn?'<b class="zt">'+tn+'</b>':'')}
function RB(ch,zy){const z=zy.split(' '),c=Array.from(ch);return '<span class="zy">'+c.map((x,i)=>'<span class="zc"><span class="c">'+x+'</span><span class="z">'+ZYC(z[i]||'')+'</span></span>').join('')+'</span>';}
const PAL={red:'#e8505b',coral:'#ff8a72',pink:'#f7a1c4',purple:'#9b7fd4',blue:'#5b8def',aqua:'#4fc9bd',green:'#7cc47f',yellow:'#ffd25e',gold:'#d9a520',silver:'#b8c0cc',white:'#f4f1ea',black:'#3a3a44',brown:'#a0704f',denim:'#4a6fa5'};
const HAIRPAL={black:'#2b2118',brown:'#6b4226',red:'#b5502e',blond:'#e2b866',purple:'#8a6bd1'};
const INK='#4a3426';
/* watercolor piece: wash (blurred edge) + pattern + double sketch line */
function wc(d,col,pat){return '<path d="'+d+'" fill="'+col+'" opacity=".86" filter="url(#wc)"/>'+(pat&&pat!=='plain'?'<path d="'+d+'" fill="url(#p-'+pat+')"/>':'')+
  '<path d="'+d+'" fill="none" stroke="'+INK+'" stroke-width="1.1" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="'+INK+'" stroke-width=".6" opacity=".35" transform="translate(.9 .7)"/>';}
const line=(d,w)=>'<path d="'+d+'" fill="none" stroke="'+INK+'" stroke-width="'+(w||1.1)+'" stroke-linecap="round" stroke-linejoin="round"/>';
const LONG=['sweater','shirt','jacket','space','rain'];
const I=(id,zh,zy,en,col,tags,draw)=>({id,zh,zy,en,col,tags,draw});
const CAT={
 hair:{en:'Hair',zh:'頭髮',zy:'ㄊㄡˊ ㄈㄚˇ',vb:'66 8 80 80',items:[
  I('pony','馬尾','ㄇㄚˇ ㄨㄟˇ','Ponytail','black',['night','sports','beach','rain'],{back:c=>wc('M112 38Q142 40 136 94Q128 72 115 54Z',c),front:c=>wc('M84 52Q86 30 100 31Q114 30 116 52Q110 40 100 41Q90 40 84 52Z',c)+'<circle cx="113" cy="40" r="3.5" fill="#f06595" stroke="'+INK+'" stroke-width=".8"/><path d="M89 38l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#ffc61a" stroke="'+INK+'" stroke-width=".6"/>'}),
  I('bun','包包頭','ㄅㄠ ㄅㄠ ㄊㄡˊ','Bun','brown',['newyear','royal','space'],{back:c=>wc('M91 30a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z',c),front:c=>wc('M84 52Q86 32 100 33Q114 32 116 52Q110 42 100 43Q90 42 84 52Z',c)}),
  I('long','長髮','ㄔㄤˊ ㄈㄚˇ','Long hair','blond',['royal','beach'],{back:c=>wc('M84 46Q100 22 116 46L124 124Q100 132 76 124Z',c),front:c=>wc('M84 54Q85 31 100 32Q115 31 116 54Q112 44 104 42Q96 46 88 46Q86 50 84 54Z',c)}),
  I('bob','短髮','ㄉㄨㄢˇ ㄈㄚˇ','Short bob','black',['space','sports','night'],{back:c=>wc('M82 70L82 50Q84 30 100 31Q116 30 118 50L118 70Q114 64 114 56L86 56Q86 64 82 70Z',c),front:c=>wc('M84 52Q86 33 100 33Q114 33 116 52L84 52Z',c)}),
  I('braids','辮子','ㄅㄧㄢˋ ˙ㄗ','Braids','brown',['newyear','night','rain'],{back:c=>wc('M82 56Q78 90 84 120Q90 118 89 110Q86 86 88 60ZM118 56Q122 90 116 120Q110 118 111 110Q114 86 112 60Z',c)+line('M83 72l5 3M83 84l5 3M84 96l5 3M117 72l-5 3M117 84l-5 3M116 96l-5 3',.8),front:c=>wc('M84 54Q86 31 100 32Q114 31 116 54Q106 42 100 44Q94 42 84 54Z',c)})]},
 top:{en:'Tops',zh:'上衣','zy':'ㄕㄤˋ ㄧ',vb:'50 60 100 140',items:[
  I('tee','T恤','T ㄒㄩˋ','T-shirt','white',['night','sports','beach'],c=>wc('M76 84Q100 78 124 84L134 104L124 108L118 98L117 152Q100 156 83 152L82 98L76 108L66 104Z',c)),
  I('tank','背心','ㄅㄟˋ ㄒㄧㄣ','Tank top','aqua',['beach','sports','night'],c=>wc('M86 84L92 84Q100 94 108 84L114 84L117 152Q100 156 83 152Z',c)),
  I('sweater','毛衣','ㄇㄠˊ ㄧ','Sweater','coral',['rain','night'],c=>wc('M76 84Q100 78 124 84L136 140L138 196L128 196L124 142L118 100L118 156Q100 160 82 156L82 100L76 142L72 196L62 196L64 140Z',c)+line('M82 150Q100 154 118 150',.8)),
  I('shirt','襯衫','ㄔㄣˋ ㄕㄢ','Shirt','white',['sports','space','rain'],c=>wc('M76 84Q100 78 124 84L136 140L138 196L128 196L124 142L118 100L117 152Q100 156 83 152L82 100L76 142L72 196L62 196L64 140Z',c)+line('M92 82L100 94L108 82M100 96v52')+'<circle cx="100" cy="110" r="1.3" fill="'+INK+'"/><circle cx="100" cy="126" r="1.3" fill="'+INK+'"/>'),
  I('jacket','外套','ㄨㄞˋ ㄊㄠˋ','Jacket','red',['newyear','rain','space'],c=>wc('M76 84Q100 78 124 84L136 140L138 196L128 196L124 142L119 102L120 168Q100 172 80 168L81 102L76 142L72 196L62 196L64 140Z',c)+line('M100 88V170M90 84L100 104L110 84'))]},
 bottom:{en:'Bottoms',zh:'下身','zy':'ㄒㄧㄚˋ ㄕㄣ',vb:'50 100 100 260',items:[
  I('skirt','裙子','ㄑㄩㄣˊ ˙ㄗ','Skirt','pink',['royal','night','newyear'],c=>wc('M84 150Q100 154 116 150L128 214Q100 222 72 214Z',c)),
  I('tutu','蓬蓬裙','ㄆㄥˊ ㄆㄥˊ ㄑㄩㄣˊ','Tutu','purple',['royal'],c=>wc('M84 150Q100 154 116 150Q134 170 136 196Q127 203 118 198Q109 205 100 199Q91 205 82 198Q73 203 64 196Q66 170 84 150Z',c)),
  I('shorts','短褲','ㄉㄨㄢˇ ㄎㄨˋ','Shorts','yellow',['beach','sports','night'],c=>wc('M83 150Q100 154 117 150L119 200L102 202L100 182L98 202L81 200Z',c)),
  I('pants','褲子','ㄎㄨˋ ˙ㄗ','Pants','black',['space','rain','sports'],c=>wc('M83 150Q100 154 117 150L117 268L114 352L103 352L102 270L100 186L98 270L97 352L86 352L83 268Z',c)),
  I('jeans','牛仔褲','ㄋㄧㄡˊ ㄗㄞˇ ㄎㄨˋ','Jeans','denim',['night','rain'],c=>wc('M83 150Q100 154 117 150L117 268L114 352L103 352L102 270L100 186L98 270L97 352L86 352L83 268Z',c)+line('M90 156L92 340M110 156L108 340M86 344h11M103 344h11',.7))]},
 dress:{en:'Dresses',zh:'洋裝','zy':'ㄧㄤˊ ㄓㄨㄤ',vb:'40 10 120 366',items:[
  I('sun','洋裝','ㄧㄤˊ ㄓㄨㄤ','Sundress','yellow',['beach','night'],c=>line('M88 86L90 76M112 86L110 76')+wc('M86 86L114 86L117 150L132 240Q100 250 68 240L83 150Z',c)),
  I('gown','禮服','ㄌㄧˇ ㄈㄨˊ','Ball gown','purple',['royal'],c=>wc('M80 86Q100 80 120 86L117 150Q140 250 150 364Q100 376 50 364Q60 250 83 150Z',c)+line('M84 150Q100 156 116 150',.8)),
  I('qipao','旗袍','ㄑㄧˊ ㄆㄠˊ','Qipao','red',['newyear'],c=>wc('M82 84L118 84L118 100L117 150L120 272Q100 278 80 272L83 150L82 100Z',c)+wc('M94 74L106 74L106 84L94 84Z',c)+line('M116 232L118 272M100 86Q106 92 112 96',.8)+'<circle cx="108" cy="94" r="1.4" fill="#ffc61a"/><circle cx="111" cy="106" r="1.4" fill="#ffc61a"/>'),
  I('space','太空服','ㄊㄞˋ ㄎㄨㄥ ㄈㄨˊ','Space suit','white',['space'],c=>wc('M74 84Q100 76 126 84L138 196L126 196L120 150L120 356L104 356L102 190L98 190L96 356L80 356L80 150L74 196L62 196Z',c)+'<rect x="90" y="104" width="20" height="14" rx="3" fill="#5b8def" stroke="'+INK+'" stroke-width=".8"/>'+line('M80 150Q100 156 120 150',.9)),
  I('rain','雨衣','ㄩˇ ㄧ','Raincoat','yellow',['rain'],{back:c=>wc('M82 72Q84 24 100 24Q116 24 118 72Z',c),main:c=>wc('M76 84Q100 78 124 84L136 196L126 196L122 150L126 232Q100 238 74 232L78 150L74 196L64 196Z',c)+line('M100 88V234')+'<circle cx="104" cy="110" r="1.4" fill="'+INK+'"/><circle cx="104" cy="140" r="1.4" fill="'+INK+'"/><circle cx="104" cy="170" r="1.4" fill="'+INK+'"/>'})]},
 shoes:{en:'Shoes',zh:'鞋子','zy':'ㄒㄧㄝˊ ˙ㄗ',vb:'74 290 52 84',items:[
  I('sneakers','運動鞋','ㄩㄣˋ ㄉㄨㄥˋ ㄒㄧㄝˊ','Sneakers','white',['sports','night','space'],c=>{const f=wc('M86 354L97 354L99 368L82 368Z',c)+line('M82 366h17',.8);return f+'<g transform="translate(16 0)">'+f+'</g>';}),
  I('boots','靴子','ㄒㄩㄝ ˙ㄗ','Boots','brown',['space','rain','royal'],c=>{const f=wc('M86 304L97 304L98 368L81 368L85 336Z',c);return f+'<g transform="translate(16 0)">'+f+'</g>';}),
  I('sandals','涼鞋','ㄌㄧㄤˊ ㄒㄧㄝˊ','Sandals','gold',['beach'],c=>{const f=line('M84 364h14M86 358l10 6M96 358l-8 6',1.6)+'<path d="M84 364h14" stroke="'+c+'" stroke-width="2.4"/>';return f+'<g transform="translate(16 0)">'+f+'</g>';}),
  I('mary','娃娃鞋','ㄨㄚˊ ˙ㄨㄚ ㄒㄧㄝˊ','Mary Janes','black',['royal','newyear'],c=>{const f=wc('M86 358Q92 354 97 358L99 368L82 368Z',c)+line('M87 360h10',.8);return f+'<g transform="translate(16 0)">'+f+'</g>';}),
  I('rainboots','雨鞋','ㄩˇ ㄒㄧㄝˊ','Rain boots','green',['rain'],c=>{const f=wc('M84 292L99 292L99 368L80 368L84 340Z',c)+line('M84 300h15',.8);return f+'<g transform="translate(16 0)">'+f+'</g>';})]},
 acc:{en:'Extras',zh:'配件','zy':'ㄆㄟˋ ㄐㄧㄢˋ',vb:'40 10 130 200',multi:true,items:[
  I('hat','帽子','ㄇㄠˋ ˙ㄗ','Sun hat','pink',['beach','rain'],c=>wc('M86 40Q100 12 114 40Z',c)+wc('M66 40Q100 30 134 40Q100 50 66 40Z',c)),
  I('crown','皇冠','ㄏㄨㄤˊ ㄍㄨㄢ','Crown','gold',['royal'],c=>wc('M86 36L88 20L94 29L100 16L106 29L112 20L114 36Z',c)),
  I('glasses','眼鏡','ㄧㄢˇ ㄐㄧㄥˋ','Glasses','black',['space','beach'],c=>'<circle cx="94" cy="53" r="5.5" fill="#cfe8ff" fill-opacity=".5" stroke="'+c+'" stroke-width="1.6"/><circle cx="106" cy="53" r="5.5" fill="#cfe8ff" fill-opacity=".5" stroke="'+c+'" stroke-width="1.6"/>'+line('M99.5 53h1')),
  I('bag','包包','ㄅㄠ ㄅㄠ','Bag','brown',['night','newyear','beach'],c=>line('M118 86L86 166',.9)+wc('M76 164L96 164L98 182L74 182Z',c)),
  I('scarf','圍巾','ㄨㄟˊ ㄐㄧㄣ','Scarf','red',['rain','newyear'],c=>wc('M86 78Q100 90 114 78L116 88Q100 100 84 88Z',c)+wc('M104 90L110 124L100 124Z',c)),
  I('umbrella','雨傘','ㄩˇ ㄙㄢˇ','Umbrella','blue',['rain'],c=>line('M132 198V128',1.6)+wc('M100 128Q132 84 164 128Q148 121 132 128Q116 121 100 128Z',c))]}
};
