/* ---------- opening a friend's link ---------- */
function bootLinks(){const h=location.hash;
  if(h.startsWith('#room=')){const c=h.slice(6,10).toUpperCase();setTimeout(()=>roomMenu(c),100);return true;}
  if(h.startsWith('#c=')){const d=dec(h.slice(3));if(!d||!d.l)return false;MODE='vs';VS.kind='link';VS.ch={name:String(d.n||'Friend').slice(0,8),look:d.l};setTheme(d.t);fresh();renderFig();renderItems();
    const m=modal2('<h2>⚔️ '+esc(VS.ch.name)+' invites you to a face-off!'+'</h2><p>Theme: '+theme.en+' '+[...new Intl.Segmenter().segment(TPICS[theme.id])].map(x=>x.segment).join('')+'</p><p>'+zh('Write your name:')+'</p><input id="fn" maxlength="8" placeholder="Friend" autocomplete="off"><div class="row"><button class="btn pink" id="fgo">'+zh('Start')+' ▶</button></div>');
    m.querySelector('#fgo').onclick=()=>{ME=(m.querySelector('#fn').value.trim()||'Friend').slice(0,8);m.remove();setBadge(ME);timeLeft=120;showTime();say(VS.ch.name+' invites you to a face-off! The theme is '+theme.en);};return true;}
  if(h.startsWith('#r=')){const d=dec(h.slice(3));if(!d||!d.a||!d.b)return false;MODE='vs';VS.kind='result';setTheme(d.t);ME=d.a.n;setBadge(ME);fresh();renderFig();renderItems();
    setTimeout(()=>show([{name:String(d.a.n).slice(0,8),look:d.a.l},{name:String(d.b.n).slice(0,8),look:d.b.l}]),400);return true;}
  return false;}

/* ---------- photos: scene + outfit(s) + score, saved as a picture ---------- */
'拍ㄆㄞ 照ㄓㄠˋ 儲ㄔㄨˊ 存ㄘㄨㄣˊ 按ㄢˋ 圖ㄊㄨˊ 片ㄆㄧㄢˋ 張ㄓㄤ'.split(' ').forEach(p=>{if(!ZD[p[0]])ZD[p[0]]=p.slice(1);});ZW['長按']='ㄔㄤˊ ㄢˋ';
const svgImg=str=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(str.includes('xmlns=')?str:str.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));});
async function snap(E,tots,max){try{
  const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  x.fillStyle='#fbf7ef';x.fillRect(0,0,W,H);
  const sc=await svgImg(sceneSVG(theme.id).replace('class="scene"','width="1600" height="1200"'));const r=Math.max(W/sc.width,H/sc.height);x.globalAlpha=.9;x.drawImage(sc,(W-sc.width*r)/2,(H-sc.height*r)/2,sc.width*r,sc.height*r);x.globalAlpha=1;
  const two=E.length===2,fh=tots?(two?780:820):(two?880:1000),fw=fh/2;
  for(let i=0;i<E.length;i++){const im=await svgImg(figureSVG(E[i].look).replace('width="200" height="400"','width="'+fw+'" height="'+fh+'"'));const cx=two?(i?W*.72:W*.28):W/2;
    x.drawImage(im,cx-fw/2,H-fh-150,fw,fh);
    x.font='900 46px "PingFang TC","Noto Sans TC",system-ui,sans-serif';x.textAlign='center';const nm=E[i].name,tw=x.measureText(nm).width+50;
    x.fillStyle=i?'#e8590c':'#7048e8';x.strokeStyle='#fff';x.lineWidth=5;rr(x,cx-tw/2,H-150,tw,66,33);x.fill();x.stroke();x.fillStyle='#fff';x.fillText(nm,cx,H-102);
    if(tots){const t=tots[i],st=Math.round(t/max*5);x.font='900 64px system-ui';x.lineWidth=6;x.strokeStyle='#4a3426';
      const stars='★'.repeat(st)+'☆'.repeat(5-st);const top=H-fh-150;x.strokeText(stars,cx,top-110);x.fillStyle='#ffd43b';x.fillText(stars,cx,top-110);
      x.font='900 120px "Lilita One","Arial Black",Impact,system-ui';const g=x.createLinearGradient(0,top-100,0,top);g.addColorStop(0,'#fff6b0');g.addColorStop(.5,'#ffd43b');g.addColorStop(1,'#f08c00');
      const txt=t+'/'+max;x.lineWidth=10;x.strokeText(txt,cx,top-4);x.fillStyle=g;x.fillText(txt,cx,top-4);}}
  x.fillStyle='rgba(255,253,248,.92)';rr(x,30,26,W-60,120,28);x.fill();x.strokeStyle='#4a3426';x.lineWidth=4;x.stroke();
  x.fillStyle='#4a3426';x.textAlign='left';x.font='900 52px "PingFang TC","Noto Sans TC",system-ui,sans-serif';x.fillText('👔 Lucas’s Runway Sketchbook',60,106);
  x.textAlign='right';x.font='800 46px "PingFang TC","Noto Sans TC",system-ui,sans-serif';x.fillText(theme.en+' '+[...new Intl.Segmenter().segment(TPICS[theme.id]||'')].slice(0,2).map(s=>s.segment).join(''),W-60,104);
  x.textAlign='center';x.font='600 30px system-ui';x.fillStyle='#4a3426';const d=new Date();x.fillText(d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate(),W/2,H-28);
  const blob=await new Promise(ok=>c.toBlob(ok,'image/png'));const url=URL.createObjectURL(blob),file=new File([blob],'runway-'+d.toISOString().slice(0,10)+'.png',{type:'image/png'});
  sfx.good();shutter&&shutter();const saved=albumAdd(c);
  const m=modal2('<h2>📸 '+zh('Photo')+'</h2><img src="'+url+'" alt="photo" style="width:min(100%,420px);border-radius:14px;border:3px solid #4a3426"><p class="note">'+(saved?'📒 '+zh('Added to your album')+'　':'')+zh('Tap Save to keep it on this device')+'</p><div class="row"><button class="btn pink" id="svP">'+zh('Save')+'</button><button class="btn ghost" id="clP">OK</button></div>');
  m.querySelector('#clP').onclick=()=>m.remove();
  m.querySelector('#svP').onclick=async()=>{try{if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Runway Sketchbook'});return;}}catch(e){if(e&&e.name==='AbortError')return;}
    const a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();};
}catch(err){toast('📸 …');}}
/* ---------- in-game photo album, saved on this device ---------- */
const AK='rl_album';
function albumGet(){try{return JSON.parse(localStorage.getItem(AK)||'[]');}catch(e){return [];}}
function albumAdd(c){try{const s=document.createElement('canvas');s.width=540;s.height=675;s.getContext('2d').drawImage(c,0,0,540,675);
  const a=albumGet();a.unshift({d:s.toDataURL('image/jpeg',.82),t:Date.now()});while(a.length>40)a.pop();
  for(;;){try{localStorage.setItem(AK,JSON.stringify(a));return true;}catch(e){if(a.length<=1)return false;a.pop();}}}catch(e){return false;}}
async function sharePic(d,t){const b=await (await fetch(d)).blob(),f=new File([b],'runway-'+new Date(t).toISOString().slice(0,10)+'.jpg',{type:'image/jpeg'});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'Runway Sketchbook'});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  const a=document.createElement('a');a.href=d;a.download=f.name;document.body.appendChild(a);a.click();a.remove();}
function showAlbum(){audio();const a=albumGet();
  const m=modal2('<h2>📒 '+zh('Album')+'</h2>'+(a.length?'<div class="album">'+a.map((p,i)=>'<button class="ph" data-i="'+i+'"><img src="'+p.d+'" alt=""><span>'+(new Date(p.t).getMonth()+1)+'/'+new Date(p.t).getDate()+'</span></button>').join('')+'</div>':'<p class="note">'+zh('No photos yet. Go take some!')+'</p>')+'<div class="row"><button class="btn ghost" id="alC">OK</button></div>');
  m.querySelector('#alC').onclick=()=>m.remove();
  m.querySelectorAll('.ph').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,p=a[i];m.remove();
    const v=modal2('<img src="'+p.d+'" alt="" style="width:min(100%,420px);border-radius:14px;border:3px solid #4a3426"><div class="row"><button class="btn pink" id="pvS">'+zh('Save')+'</button><button class="btn ghost" id="pvD">🗑 '+zh('Delete')+'</button><button class="btn" id="pvB">📒 '+zh('Album')+'</button></div>');
    v.querySelector('#pvS').onclick=()=>sharePic(p.d,p.t);
    v.querySelector('#pvB').onclick=()=>{v.remove();showAlbum();};
    const del=v.querySelector('#pvD');del.onclick=()=>{if(!del.dataset.sure){del.dataset.sure=1;del.innerHTML='🗑 '+zh('Tap again to delete');del.classList.add('pink');return;}
      const b2=albumGet();b2.splice(i,1);try{localStorage.setItem(AK,JSON.stringify(b2));}catch(e){}v.remove();showAlbum();};});}
function rr(x,X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath();}

$('walk').onclick=runway;$('ready').onclick=runway;
document.querySelector('.ttl').innerHTML='👔 Lucas’s Runway Sketchbook';document.documentElement.lang='en';document.title='Lucas’s Runway Sketchbook';
$('badge').innerHTML='Lucas';$('thK').innerHTML=zh('Today’s theme');$('walkL').innerHTML='✨ '+zh('I’m ready! To the runway');$('walkS').innerHTML='✨ '+zh('Ready!');$('ready').innerHTML='✨ '+zh('Ready!');
$('newTheme').innerHTML='🎲 '+zh('New theme');$('modeBtn').innerHTML='🏠 '+zh('Modes');$('snapBtn').innerHTML='📸 '+zh('Photo');$('snapBtn').onclick=e=>{e.stopPropagation();audio();snap([{name:ME,look:clone(look)}],null,0);};
{const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';document.head.appendChild(l);}$('tmBtn').innerHTML='⏱ '+zh('Timer on');$('smallTip').innerHTML=zh('Tap clothes to try them on!');
document.querySelector('.rot.l').innerHTML=zh('Turn your phone sideways')+' ↻';document.querySelector('.rot.p').innerHTML=zh('Hold your phone upright')+' ↻';

/* ================= Lucas edition: boys' clothes only ================= */
add('hair',[
 ['spiky','刺刺頭','ㄘˋ ㄘˋ ㄊㄡˊ','Spiky hair','black',['sports','concert','halloween','space','school'],{back:c=>wc('M82 64L72 52L83 47L74 32L89 35L88 18L100 28L109 13L113 30L126 24L120 40L130 46L118 64Z',c),front:c=>wc('M84 52L85 40L91 45L95 34L101 43L107 33L111 44L116 39L116 52Q100 43 84 52Z',c)}],
 ['buzz','平頭','ㄆㄧㄥˊ ㄊㄡˊ','Buzz cut','black',['sports','camping','beach'],{back:c=>wc('M84 54Q84 33 100 33Q116 33 116 54Z',c),front:c=>wc('M85 45Q88 34 100 34Q112 34 115 45Q100 40 85 45Z',c)}],
 ['swoop','旁分瀏海','ㄆㄤˊ ㄈㄣ ㄌㄧㄡˊ ㄏㄞˇ','Side swoop','brown',['school','travel','royal','concert'],{back:c=>wc('M82 60L82 48Q84 29 100 29Q118 29 118 48L118 60Z',c),front:c=>wc('M84 52Q80 30 102 29Q122 29 118 46Q112 36 100 39Q90 43 84 52Z',c)}],
 ['crew','小平頭','ㄒㄧㄠˇ ㄆㄧㄥˊ ㄊㄡˊ','Crew cut','brown',['sports','school','space'],{back:c=>wc('M83 56L84 36Q100 30 116 36L117 56Z',c),front:c=>wc('M84 46L84 35Q100 29 116 35L116 46Q100 41 84 46Z',c)}],
 ['fauxhawk','小莫霍克','ㄒㄧㄠˇ ㄇㄛˋ ㄏㄨㄛˋ ㄎㄜˋ','Faux hawk','black',['concert','halloween','sports'],{back:c=>wc('M85 54Q85 35 100 35Q115 35 115 54Z',c),front:c=>wc('M88 45Q91 37 95 36L100 18L105 36Q109 37 112 45Q100 40 88 45Z',c)}],
 ['curlytop','捲捲頭','ㄐㄩㄢˇ ㄐㄩㄢˇ ㄊㄡˊ','Curly top','brown',['birthday','garden','candy','autumn'],{back:c=>wc('M83 58Q78 44 86 38Q86 28 96 30Q102 22 110 30Q120 28 118 40Q124 48 117 58Z',c),front:c=>wc('M85 48Q82 40 90 38Q92 32 99 35Q104 30 109 36Q117 36 115 46Q110 42 104 44Q98 40 92 44Q88 44 85 48Z',c)}],
 ['slick','油頭','ㄧㄡˊ ㄊㄡˊ','Slicked back','black',['royal','night','newyear'],{back:c=>wc('M82 60Q82 29 100 29Q118 29 118 60Z',c),front:c=>wc('M85 47Q85 31 100 31Q115 31 115 47Q108 37 100 37Q92 37 85 47Z',c)+line('M92 36Q100 33 108 36M90 41Q100 36 110 41',.6)}],
 ['shaggy','滑板頭','ㄏㄨㄚˊ ㄅㄢˇ ㄊㄡˊ','Skater shag','blond',['beach','travel','concert','camping'],{back:c=>wc('M80 66Q77 29 100 29Q123 29 120 66L114 58L108 64L100 57L92 64L86 58Z',c),front:c=>wc('M84 54Q82 31 100 31Q118 31 116 54L112 46L106 52L100 44L94 52L88 46Z',c)}]]);
add('acc',[
 A('necktie','領帶','ㄌㄧㄥˇ ㄉㄞˋ','Necktie','red',['school','royal','travel','night'],'neck',c=>wc('M96.5 83L103.5 83L102 90L106 132L100 140L94 132L98 90Z',c),'86 78 28 66'),
 A('bowtie','領結','ㄌㄧㄥˇ ㄐㄧㄝˊ','Bow tie','black',['royal','birthday','concert','newyear'],'neck',c=>wc('M89 80L99 85L89 90Z',c)+wc('M111 80L101 85L111 90Z',c)+dot(100,85,2.4,c),'84 74 32 22'),
 A('headphones','耳機','ㄦˇ ㄐㄧ','Headphones','blue',['concert','travel','space','night'],'head',c=>'<path d="M82 56Q82 24 100 24Q118 24 118 56" fill="none" stroke="'+INK+'" stroke-width="3.4"/><path d="M82 56Q82 24 100 24Q118 24 118 56" fill="none" stroke="'+c+'" stroke-width="2"/>'+wc('M78 48h7v14h-7Z',c)+wc('M115 48h7v14h-7Z',c),'72 16 56 52'),
 A('skateboard','滑板','ㄏㄨㄚˊ ㄅㄢˇ','Skateboard','red',['beach','travel','sports','concert'],'held',c=>wc('M134 150Q140 146 146 150L142 262Q136 266 130 262Z',c)+dot(131,165,2.6,'#ffd25e')+dot(145,165,2.6,'#ffd25e')+dot(128,248,2.6,'#ffd25e')+dot(143,248,2.6,'#ffd25e'),'120 140 34 132'),
 A('basketball','籃球','ㄌㄢˊ ㄑㄧㄡˊ','Basketball','coral',['sports','school'],'held',c=>'<circle cx="142" cy="206" r="11" fill="'+c+'" stroke="'+INK+'" stroke-width="1.1"/>'+line('M131 206h22M142 195v22M134 198Q140 206 134 214M150 198Q144 206 150 214',.7),'128 192 28 28'),
 A('dinotoy','恐龍玩偶','ㄎㄨㄥˇ ㄌㄨㄥˊ ㄨㄢˊ ㄡˇ','Toy dinosaur','green',['birthday','camping','candy','garden'],'held',c=>wc('M132 210Q130 196 140 194Q146 182 156 186Q162 190 156 194Q150 194 150 200Q156 206 152 216L148 216L146 208L138 210L136 218L132 218Z',c)+dot(155,189,.9,INK)+line('M140 194l1-4M144 192l2-4M148 192l2-3',.8),'126 180 40 42'),
 A('magnifier','放大鏡','ㄈㄤˋ ㄉㄚˋ ㄐㄧㄥˋ','Magnifying glass','brown',['school','travel','camping','night'],'held',c=>line('M136 204L148 176',3)+'<circle cx="151" cy="169" r="9" fill="#d0ebff" fill-opacity=".6" stroke="'+c+'" stroke-width="2.4"/>','128 156 36 56'),
 A('kite','風箏','ㄈㄥ ㄓㄥ','Kite','yellow',['beach','garden','autumn','sports'],'held',c=>line('M134 200Q150 170 146 120',.7)+wc('M146 92L160 112L146 132L132 112Z',c)+line('M146 92V132M132 112H160',.7)+line('M146 132q-4 8 2 12q-6 4 0 10',.8),'126 88 40 116')]);
add('dress',[
 ['tuxedo','燕尾服','ㄧㄢˋ ㄨㄟˇ ㄈㄨˊ','Tuxedo','black',['royal','newyear','concert','night','birthday'],c=>wc(pantsP(352,2),c)+sleeves('long',c)+wc(torso(176),c)+wc('M92 86L100 84L108 86L104 150L100 156L96 150Z','#f4f1ea')+wc('M93 82L99 87L93 91ZM107 82L101 87L107 91Z',c)+dot(100,110,1.2,INK)+dot(100,124,1.2,INK)+dot(100,138,1.2,INK)],
 ['karate','空手道服','ㄎㄨㄥ ㄕㄡˇ ㄉㄠˋ ㄈㄨˊ','Karate uniform','white',['sports','school'],c=>wc(pantsP(340,4),c)+sleeves('cuff',c)+wc(torso(176),c)+line('M88 86L104 140M112 86L98 132',.9)+wc('M82 146H118V154H82Z','#3a3a44')+wc('M96 152L92 176L98 176L100 156ZM104 152L108 176L102 176L100 156Z','#3a3a44')],
 ['hero','超級英雄裝','ㄔㄠ ㄐㄧˊ ㄧㄥ ㄒㄩㄥˊ ㄓㄨㄤ','Superhero suit','blue',['space','halloween','sports','birthday'],{back:c=>wc('M80 86L120 86L136 300L64 300Z','#e8505b'),main:c=>wc(pantsP(352,0),c)+sleeves('long',c)+wc(torso(178),c)+wc('M100 100L112 112L100 132L88 112Z','#ffd25e')+'<text x="100" y="121" text-anchor="middle" font-size="12" font-weight="900" fill="#e8505b" font-family="system-ui">★</text>'+wc('M82 148H118V156H82Z','#ffd25e')}],
 ['firefighter','消防員裝','ㄒㄧㄠ ㄈㄤˊ ㄩㄢˊ ㄓㄨㄤ','Firefighter gear','yellow',['rain','sports','night'],c=>wc(pantsP(350,4),c)+sleeves('wide',c)+wc(torso(180),c)+wc('M80 120H120V126H80ZM80 168H120V174H80Z','#ffe066')+wc('M82 300H118V306H82Z','#ffe066')+line('M100 86V176',1)],
 ['pirate','海盜裝','ㄏㄞˇ ㄉㄠˋ ㄓㄨㄤ','Pirate outfit','red',['sea','halloween','beach','travel'],c=>wc(pantsP(290,3),'#3a3a44')+sleeves('long','#f4f1ea')+wc(torso(170),'#f4f1ea')+wc('M80 86L94 86L92 168L82 168ZM120 86L106 86L108 168L118 168Z',c)+line('M100 92V140',.8)+wc('M82 150H118V158H82Z','#3a3a44')+dot(100,154,3,'#ffd25e')],
 ['knight','騎士盔甲','ㄑㄧˊ ㄕˋ ㄎㄨㄟ ㄐㄧㄚˇ','Knight armor','silver',['royal','halloween','travel'],c=>wc(pantsP(352,3),c)+sleeves('long',c)+wc(torso(182),c)+wc('M86 98L114 98L112 150Q100 160 88 150Z','#e8505b')+wc('M100 106V146M92 120H108','#ffd25e')+line('M84 300H116M84 250H116',.8)]]);

