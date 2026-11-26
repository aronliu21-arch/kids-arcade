const easeBack=k=>{const c=1.7;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)};

/* ================= storage ================= */
let dbp=null;
function db(){if(dbp)return dbp;dbp=new Promise((res,rej)=>{try{const r=indexedDB.open('story-maker-2',1);r.onupgradeneeded=()=>r.result.createObjectStore('stories',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});return dbp}
async function dbPut(s){try{const d=await db();await new Promise((res,rej)=>{const t=d.transaction('stories','readwrite');t.objectStore('stories').put(s);t.oncomplete=res;t.onerror=()=>rej(t.error)})}catch(e){console.warn(e)}}
async function dbAll(){try{const d=await db();return await new Promise(res=>{const r=d.transaction('stories').objectStore('stories').getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>res([])})}catch(e){return[]}}
async function dbDel(id){try{const d=await db();await new Promise(res=>{const t=d.transaction('stories','readwrite');t.objectStore('stories').delete(id);t.oncomplete=res;t.onerror=res})}catch(e){}}
function touch(){dirty=true;if(story)story.updated=Date.now()}
async function saveNow(){if(!story||!dirty)return;dirty=false;await dbPut(story)}
setInterval(saveNow,60000);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow()});addEventListener('pagehide',saveNow);

/* ================= home & shelf ================= */
document.querySelectorAll('.kid').forEach(b=>b.onclick=()=>{kid=b.dataset.kid;try{window.KA&&KA.setKid(kid)}catch(e){}openShelf()});
$('shelfHome').onclick=()=>show('home');$('voiceBtn').onclick=voicePanel;
/* ---- Save the story as picture pages (one per scene) into the device's Photos ---- */
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function storyPages(st){const z=st.lang==='zh',host=document.createElement('div');host.style.cssText='position:fixed;left:-4000px;top:0;width:1200px;height:900px;pointer-events:none';document.body.appendChild(host);
  const _d=new Date(),day=`${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,'0')}-${String(_d.getDate()).padStart(2,'0')}`;
  const title=(st.title||(z?'我的故事':'My story')).replace(/[\\/:*?"<>|]/g,'').slice(0,50),n=st.scenes.length,out=[];
  try{for(let i=0;i<n;i++){const sc=st.scenes[i];const S=mountStage(host,()=>st.scenes[i],{quiet:true});
    for(let k=0;k<30;k++){await wait(100);if(sc.actors.every(a=>{const sp=spriteOf(a);return !sp||sp.ready}))break}await wait(900);
    const src=host.querySelector('canvas'),txt=mix(sc.lines.join(z?'':' '));
    const P=document.createElement('canvas'),PW=1200;const g=P.getContext('2d');g.font='600 40px -apple-system,system-ui,"PingFang TC",sans-serif';
    const lines=[];{let cur='';const tk=/[一-鿿]/.test(txt)?[...txt]:txt.split(' '),sep=/[一-鿿]/.test(txt)?'':' ';for(const t of tk){const tt=cur?cur+sep+t:t;if(g.measureText(tt).width>PW-120&&cur){lines.push(cur);cur=t}else cur=tt}if(cur)lines.push(cur)}
    P.width=PW;P.height=900+110+lines.length*54+40;g.fillStyle='#fffaf0';g.fillRect(0,0,P.width,P.height);
    g.filter=sc.gray?'grayscale(1)':'none';g.drawImage(src,0,0,PW,900);g.filter='none';
    g.fillStyle='#e8590c';g.font='800 34px -apple-system,system-ui,"PingFang TC",sans-serif';g.textAlign='left';g.fillText(`${title} · ${sceneName(i)}  (${i+1}/${n})`,60,965);
    g.fillStyle='#2b2118';g.font='600 40px -apple-system,system-ui,"PingFang TC",sans-serif';lines.forEach((l,k)=>g.fillText(l,60,1035+k*54));
    const blob=await new Promise(r=>P.toBlob(r,'image/jpeg',.9));
    out.push({blob,name:`${KIDS[st.kid].name} - ${title} - p${String(i+1).padStart(2,'0')} - ${day}.jpg`,label:`${title} – ${sceneName(i)} (${i+1}/${n}) – ${day}${txt?'\n'+txt:''}`})}}
  finally{stopStage();host.remove()}return out}
let gpBusy=false;
/* ---- Silent story video: each scene plays with its words as subtitles; recorded in real time ---- */
function vidMime(){if(!window.MediaRecorder)return '';return ['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm'].find(t=>{try{return MediaRecorder.isTypeSupported(t)}catch(e){return false}})||''}
function sentences(t,zh){return (t.match(zh?/[^。!?!?]+[。!?!?」]*/g:/[^.!?]+[.!?"]*/g)||[t]).map(x=>x.trim()).filter(Boolean)}
async function storyVideo(st,V,onProg){const mime=vidMime();if(!mime)throw new Error('no recorder');const z=st.lang==='zh',VW=V.width,VH=V.height,g=V.getContext('2d');
  const host=document.createElement('div');host.style.cssText='position:fixed;left:-4000px;top:0;width:1200px;height:900px;pointer-events:none';document.body.appendChild(host);
  const F='-apple-system,system-ui,"PingFang TC",sans-serif';let mode='title',sub='',stc=null,gray=false,raf=0,alive=true;
  const card=(big,small)=>{g.fillStyle='#fff4e0';g.fillRect(0,0,VW,VH);g.fillStyle='#e8590c';g.textAlign='center';g.font=`800 ${VW*.07}px ${F}`;
    wrapT(big,VW*.85).forEach((l,i,a)=>g.fillText(l,VW/2,VH*.45+(i-(a.length-1)/2)*VW*.085));g.fillStyle='#5c4a36';g.font=`600 ${VW*.035}px ${F}`;g.fillText(small,VW/2,VH*.78)};
  function wrapT(t,mw){const out=[];let cur='';const cj=/[一-鿿]/.test(t),tk=cj?[...t]:t.split(' ');for(const w of tk){const tt=cur?cur+(cj?'':' ')+w:w;if(g.measureText(tt).width>mw&&cur){out.push(cur);cur=w}else cur=tt}if(cur)out.push(cur);return out}
  function frame(){if(!alive)return;raf=requestAnimationFrame(frame);
    if(mode==='title'){card(st.title||(z?'我的故事':'My story'),(z?'作者 ':'by ')+KIDS[st.kid].name);return}
    if(mode==='end'){card(z?'全劇終':'The End','🎬 '+(st.title||''));return}
    if(stc){try{g.filter=gray?'grayscale(1)':'none'}catch(e){}g.drawImage(stc,0,0,VW,VH);try{g.filter='none'}catch(e){}}
    if(sub){g.font=`700 ${VW*.04}px ${F}`;const ls=wrapT(sub,VW*.88).slice(0,3),lh=VW*.052,bh=ls.length*lh+VW*.035;g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,VW,bh);
      g.fillStyle='#fff';g.textAlign='center';ls.forEach((l,i)=>g.fillText(l,VW/2,VW*.05+i*lh))}}
  const stream=V.captureStream(30),rec=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3500000}),chunks=[];rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  frame();rec.start(1000);
  try{await wait(2500);const n=st.scenes.length;
    for(let i=0;i<n;i++){onProg&&onProg(i+1,n);const sc=st.scenes[i];mode='scene';sub='';gray=!!sc.gray;
      const S=mountStage(host,()=>st.scenes[i],{quiet:true});stc=host.querySelector('canvas');
      for(let k=0;k<30;k++){await wait(100);if(sc.actors.every(a=>{const sp=spriteOf(a);return !sp||sp.ready}))break}
      try{S.play&&S.play()}catch(e){}
      const parts=sentences(mix(sc.lines.join(z?'':' ')),z);if(!parts.length)parts.push('');
      for(const t of parts){sub=t;await wait(Math.min(9000,Math.max(2500,1200+(z?[...t].length*230:t.split(' ').length*380))))}
      await wait(600)}
    stopStage();stc=null;mode='end';await wait(2500)}
  finally{alive=false;cancelAnimationFrame(raf);stopStage();host.remove()}
  await new Promise(r=>{rec.onstop=r;rec.stop()});stream.getTracks().forEach(t=>t.stop());
  const type=mime.split(';')[0],ext=type==='video/mp4'?'mp4':'webm',title=(st.title||(z?'我的故事':'My story')).replace(/[\\/:*?"<>|]/g,'').slice(0,50);
  return{blob:new Blob(chunks,{type}),name:`${KIDS[st.kid].name} - ${title} - ${today()}.${ext}`}}
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
function saveVideo(st,after){if(gpBusy)return;gpBusy=true;const z=st.lang==='zh',prev=story;story=st;
  $('gpVid').style.display='none';$('gpGo').style.display='none';$('gpX').style.display='none';
  const V=$('gpPrev');V.width=960;V.height=720;V.style.display='block';$('gpBar').style.display='block';$('gpBarIn').style.width='0%';
  $('gpMsg').innerHTML=(z?'🎬 正在拍你的電影…':'🎬 Making your movie…')+'<small style="display:block;font-size:16px;font-weight:600;margin-top:6px">Keep this screen open 請不要離開</small>';
  storyVideo(st,V,(i,n)=>{$('gpBarIn').style.width=Math.round(i/n*100)+'%'}).then(file=>{story=prev;after&&after();V.style.display='none';$('gpBar').style.display='none';
      const mb=(file.blob.size/1048576).toFixed(1);
      $('gpMsg').innerHTML=`✅ ${z?'電影做好了!':'Your movie is ready!'} <small style="display:block;font-size:16px;font-weight:600;margin-top:6px">Tap Save, then “Save Video” 點「存起來」,再點「儲存影片」 · ${mb} MB</small>`;
      $('gpGo').textContent='📲 '+(z?'存起來':'Save');$('gpGo').style.display='';$('gpX').textContent='Later 等一下';$('gpX').style.display='';
      $('gpGo').onclick=()=>KASave.share([file],st.title||'').then(r=>{toast(r==='shared'||r==='downloaded'?(z?'🎬 存好了!在「照片」裡':'🎬 Saved! Look in Photos'):(z?'還沒存':'Not saved yet'));gpBusy=false;$('gpBusy').style.display='none'});
      $('gpX').onclick=()=>{gpBusy=false;$('gpBusy').style.display='none'}})
    .catch(e=>{console.warn(e);story=prev;after&&after();V.style.display='none';$('gpBar').style.display='none';toast(z?'這台裝置做不了影片,改存圖片吧':'This device can’t make videos — try Pictures');gpBusy=false;$('gpBusy').style.display='none'})}
// Tap 1 makes the pages; tap 2 opens the share sheet (iPad only allows it straight after a tap).
function sendStory(st,after){if(gpBusy)return;const z=st.lang==='zh';
  $('gpMsg').innerHTML=(z?'要怎麼存?':'How do you want to save it?')+`<small style="display:block;font-size:16px;font-weight:600;margin-top:6px">${z?'How do you want to save it?':'要怎麼存?'}</small>`;$('gpPrev').style.display='none';$('gpBar').style.display='none';
  $('gpGo').textContent='🖼️ '+(z?'圖片 Pictures':'Pictures 圖片');$('gpGo').style.display='';$('gpGo').onclick=()=>savePictures(st,after);
  $('gpVid').style.display=window.MediaRecorder&&HTMLCanvasElement.prototype.captureStream?'':'none';$('gpVid').onclick=()=>saveVideo(st,after);
  $('gpX').textContent=z?'取消 Cancel':'Cancel 取消';$('gpX').style.display='';$('gpX').onclick=()=>{$('gpBusy').style.display='none'};$('gpBusy').style.display='flex'}
function savePictures(st,after){if(gpBusy)return;gpBusy=true;const z=st.lang==='zh',prev=story;story=st;$('gpVid').style.display='none';$('gpX').textContent='Later 等一下';
  $('gpMsg').innerHTML='Making your story pages… 製作故事頁面中…<small style="display:block;font-size:16px;font-weight:600;margin-top:6px">Keep this screen open 請不要離開</small>';$('gpGo').style.display='none';$('gpX').style.display='none';$('gpBusy').style.display='flex';
  const done=()=>{gpBusy=false;$('gpBusy').style.display='none';story=prev;after&&after()};
  storyPages(st).then(pages=>{story=prev;after&&after();
      $('gpMsg').innerHTML=`✅ ${pages.length} ${z?'頁準備好了!':'pages ready!'}<small style="display:block;font-size:16px;font-weight:600;margin-top:6px">Tap Save, then “Save ${pages.length} Images” 點「存起來」,再點「儲存 ${pages.length} 張影像」</small>`;
      $('gpGo').textContent=`📲 ${z?'存起來':'Save'} (${pages.length})`;$('gpGo').style.display='';$('gpX').style.display='';
      $('gpGo').onclick=()=>KASave.share(pages,st.title||'').then(r=>{if(r==='shared'||r==='downloaded')toast(z?'🖼️ 存好了!在「照片」裡':'🖼️ Saved! Look in Photos');else toast(z?'還沒存':'Not saved yet');gpBusy=false;$('gpBusy').style.display='none'});
      $('gpX').onclick=()=>{gpBusy=false;$('gpBusy').style.display='none'}})
    .catch(e=>{console.warn(e);toast(z?'沒有成功,再試一次':'That didn’t work — try again');done()})}
async function openShelf(){await saveNow();const K=KIDS[kid];$('shelfWho').textContent=K.name;$('shelfWho').style.background=K.color;
  const mine=(await dbAll()).filter(s=>s.kid===kid).sort((a,b)=>b.updated-a.updated);
  $('books').innerHTML=`<button class="book new" id="newBook"><span style="font-size:52px">➕</span><b>New story 新故事</b></button>`+mine.map(s=>`<div class="book" data-id="${esc(s.id)}"><div class="cv" data-cover="${esc(s.id)}"></div>
    <b>${esc(s.title||'Untitled 未命名')}</b><small>${s.scenes.length} scenes 場景 · ${s.done?'✅ finished 完成':'✏️ in progress 進行中'}</small>
    <div class="row"><button class="btn green" data-w="${esc(s.id)}">▶ Watch 看</button><button class="btn" data-e="${esc(s.id)}">✏️ ${s.done?'Change 改':'Continue 繼續'}</button>${s.done?`<button class="btn" data-u="${esc(s.id)}" aria-label="Save to Photos">🖼️</button>`:''}</div></div>`).join('');
  $('newBook').onclick=()=>{story={id:'s'+Date.now(),kid,lang:DEFLANG[kid],title:'',created:Date.now(),updated:Date.now(),imgs:{},hero:null,want:null,scenes:[],done:false};newScene('begin');hist=[];touch();openBuild()};
  const get=id=>mine.find(s=>s.id===id);
  document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{story=get(b.dataset.w);watch(0)});
  document.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>sendStory(get(b.dataset.u)));
  document.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{story=get(b.dataset.e);hist=[];if(story.done){story.done=false;const sc=curScene();if(sc.kind==='end'){story.scenes.pop()}}touch();openBuild()});
  // tiny cover: first scene background + hero
  document.querySelectorAll('[data-cover]').forEach(el=>{const s=get(el.dataset.cover),sc=s.scenes[0];if(!sc)return;const c=document.createElement('canvas');c.width=400;c.height=300;const x=c.getContext('2d');{const old0=story;story=s;x.drawImage(bgCanvas(sc.bg),0,0,400,300);story=old0}
    const old=story;story=s;const h=sc.actors.find(a=>a.role==='hero');if(h){const sp=spriteOf(h);const put=()=>{if(sp&&sp.ready){const hh=110,ww=hh*sp.c.width/sp.c.height;x.drawImage(sp.c,200-ww/2,270-hh,ww,hh)}};put();setTimeout(put,300)}story=old;el.appendChild(c)});
  show('shelf')}

