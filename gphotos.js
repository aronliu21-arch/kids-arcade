/* Kids Arcade · Google Photos uploader (shared by all games)
   One album per kid, made by this app: "Nora's Creations 幼晴的作品" …
   Uploads wait in a queue on this device (IndexedDB) if Google isn't connected or the device is offline.
   Usage:
     KAPhotos.connect()                          // parent gate → Google sign-in (call from a tap)
     KAPhotos.upload(kid, itemsOrPromise, game)  // call from a tap; items = [{blob,name,label}]
     KAPhotos.onChange(fn)  → fn({ready,connected,waiting})
*/
(function(){
  const CLIENT_ID='394910817371-7jaj1hskdg9ilqelubphp9mtsud6pqah.apps.googleusercontent.com';
  const SCOPES='https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata';
  const API='https://photoslibrary.googleapis.com/v1/';
  const ALBUM={nora:"Nora's Creations 幼晴的作品",lucas:"Lucas's Creations 陸晨的作品",milo:"Milo's Creations 洛明的作品"};
  const NAME={nora:'Nora',lucas:'Lucas',milo:'Milo'};
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
  const listeners=[];let tokenClient=null,tokenWait=null,flushing=false;
  const tokenValid=()=>!!ls.get('gp.token')&&+ls.get('gp.exp')>Date.now();

  /* ---- queue (IndexedDB) ---- */
  let dbp=null;
  function db(){return dbp=dbp||new Promise((res,rej)=>{const r=indexedDB.open('ka-gphotos',1);r.onupgradeneeded=()=>r.result.createObjectStore('queue',{autoIncrement:true});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
  async function qAll(){const d=await db();return new Promise(res=>{const out=[];const c=d.transaction('queue').objectStore('queue').openCursor();
    c.onsuccess=()=>{const cur=c.result;if(cur){out.push({key:cur.key,...cur.value});cur.continue()}else res(out)};c.onerror=()=>res(out)})}
  async function qAdd(v){const d=await db();return new Promise(res=>{const t=d.transaction('queue','readwrite');t.objectStore('queue').add(v);t.oncomplete=res;t.onerror=res})}
  async function qDel(k){const d=await db();return new Promise(res=>{const t=d.transaction('queue','readwrite');t.objectStore('queue').delete(k);t.oncomplete=res;t.onerror=res})}

  /* ---- Google sign-in ---- */
  function loadGIS(){if(window.google&&google.accounts&&google.accounts.oauth2){setup();return}
    const sc=document.createElement('script');sc.src='https://accounts.google.com/gsi/client';sc.async=true;sc.onload=setup;document.head.appendChild(sc)}
  function setup(){try{tokenClient=google.accounts.oauth2.initTokenClient({client_id:CLIENT_ID,scope:SCOPES,
    callback:r=>{const w=tokenWait;tokenWait=null;if(r.error||!r.access_token){w&&w.rej(r.error||'no token');return}
      ls.set('gp.token',r.access_token);ls.set('gp.exp',Date.now()+(r.expires_in-60)*1000);ls.set('gp.connected','1');emit();w&&w.res(r.access_token)},
    error_callback:e=>{const w=tokenWait;tokenWait=null;w&&w.rej(e&&e.type||'popup')}})}catch(e){console.warn(e)}emit();flush()}
  // Must run inside a tap, or the browser blocks Google's window.
  function askToken(prompt){return new Promise((res,rej)=>{if(!tokenClient)return rej('not ready');tokenWait={res,rej};tokenClient.requestAccessToken({prompt})})}

  async function gfetch(path,opt={}){const r=await fetch(path.startsWith('http')?path:API+path,{...opt,headers:{...(opt.headers||{}),Authorization:'Bearer '+ls.get('gp.token')}});
    if(r.status===401){ls.del('gp.token');throw new Error('auth')}if(!r.ok)throw new Error('http '+r.status+' '+await r.text());return r}
  async function albumId(kid,fresh){let id=!fresh&&ls.get('gp.album2.'+kid);if(id)return id;
    let page='';do{const j=await (await gfetch('albums?pageSize=50&excludeNonAppCreatedData=true'+(page?'&pageToken='+page:''))).json();
      const hit=(j.albums||[]).find(a=>a.title===ALBUM[kid]);if(hit){ls.set('gp.album2.'+kid,hit.id);return hit.id}page=j.nextPageToken||''}while(page);
    const a=await (await gfetch('albums',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({album:{title:ALBUM[kid]}})})).json();
    ls.set('gp.album2.'+kid,a.id);return a.id}
  async function uploadOne(it){
    const up=await gfetch('uploads',{method:'POST',headers:{'Content-type':'application/octet-stream','X-Goog-Upload-Content-Type':it.blob.type||'image/png','X-Goog-Upload-Protocol':'raw'},body:it.blob});
    const utok=await up.text();
    const make=async fresh=>gfetch('mediaItems:batchCreate',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({albumId:await albumId(it.kid,fresh),newMediaItems:[{description:[it.label||it.name,it.game,NAME[it.kid]].filter(Boolean).join(' · ').slice(0,990),simpleMediaItem:{fileName:it.name,uploadToken:utok}}]})});
    let r;try{r=await make(false)}catch(e){if(String(e).includes('auth'))throw e;ls.del('gp.album2.'+it.kid);r=await make(true)}
    const st=((await r.json()).newMediaItemResults||[{}])[0].status||{};if(st.code)throw new Error(st.message||'create failed')}
  async function flush(){if(flushing||!tokenValid())return 0;flushing=true;let n=0;
    try{for(const it of await qAll()){try{await uploadOne(it);await qDel(it.key);n++}catch(e){console.warn('upload',e);break}}}finally{flushing=false;emit()}
    return n}

  async function state(){const waiting=(await qAll().catch(()=>[])).length;return{ready:!!tokenClient,connected:!!ls.get('gp.connected'),waiting}}
  async function emit(){const s=await state();listeners.forEach(f=>{try{f(s)}catch(e){}})}

  /* ---- parent gate (3-digit × 2-digit) ---- */
  let gate=null,ans=0;
  function gateUI(){if(gate)return gate;gate=document.createElement('div');
    gate.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483100;align-items:center;justify-content:center;font-family:-apple-system,system-ui,"PingFang TC",sans-serif';
    gate.innerHTML='<div style="background:#fff;border-radius:20px;padding:22px;max-width:340px;width:90%;text-align:center;box-shadow:0 10px 40px #0005">'+
      '<b style="font-size:20px">Parents only 家長專用</b><p style="margin:6px 0;color:#555;font-size:14px">Connect Google Photos 連結 Google 相簿</p>'+
      '<p data-q style="font-size:26px;font-weight:800;margin:10px 0"></p>'+
      '<input data-a inputmode="numeric" autocomplete="off" style="font-size:22px;width:160px;padding:10px;border-radius:12px;border:2px solid #ccc;text-align:center">'+
      '<p data-m style="color:#c92a2a;min-height:20px;margin:6px 0;font-size:14px"></p>'+
      '<div style="display:flex;gap:10px;justify-content:center"><button data-ok style="min-height:52px;padding:0 20px;font-size:18px;font-weight:700;border:0;border-radius:14px;background:#2f9e44;color:#fff">Connect 連結</button>'+
      '<button data-no style="min-height:52px;padding:0 20px;font-size:18px;font-weight:700;border:0;border-radius:14px;background:#e9ecef">Cancel 取消</button></div></div>';
    document.body.appendChild(gate);const q=s=>gate.querySelector(s);
    q('[data-no]').onclick=()=>gate.style.display='none';
    q('[data-a]').addEventListener('keydown',e=>{if(e.key==='Enter')q('[data-ok]').click()});
    q('[data-ok]').onclick=()=>{if(+q('[data-a]').value!==ans){q('[data-m]').textContent='Try again 再試一次';newQ();return}
      gate.style.display='none';
      askToken('consent').then(()=>flush()).then(n=>toast('Google Photos connected ✓ 已連結'+(n?` · ${n} uploaded 已上傳`:''))).catch(()=>toast('Not connected 沒有連結'))};
    return gate}
  function newQ(){const a=100+Math.floor(Math.random()*900),b=10+Math.floor(Math.random()*90);ans=a*b;gate.querySelector('[data-q]').textContent=`${a} × ${b} = ?`;gate.querySelector('[data-a]').value=''}
  function connect(){if(!tokenClient){toast('Google is still loading… 載入中');loadGIS();return}gateUI();newQ();gate.querySelector('[data-m]').textContent='';gate.style.display='flex';setTimeout(()=>gate.querySelector('[data-a]').focus(),50)}

  let tEl=null,tT=0;
  function toast(m){if(!tEl){tEl=document.createElement('div');tEl.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#212529;color:#fff;padding:12px 18px;border-radius:14px;font:600 16px -apple-system,system-ui,"PingFang TC",sans-serif;z-index:2147483200;max-width:90%;text-align:center;transition:opacity .3s';document.body.appendChild(tEl)}
    tEl.textContent=m;tEl.style.opacity=1;clearTimeout(tT);tT=setTimeout(()=>tEl.style.opacity=0,3200)}

  /* ---- upload: call straight from the kid's tap ----
     returns {uploaded:n, queued:m}. Items wait on this device until Google is connected. */
  function upload(kid,items,game){
    // ask for a fresh token right away while we're still inside the tap
    const tokP=ls.get('gp.connected')&&!tokenValid()&&tokenClient?askToken('').catch(()=>{}):null;
    return (async()=>{const list=await items;const t=Date.now();
      for(const it of list)await qAdd({kid,blob:it.blob,name:it.name,label:it.label||'',game:game||'',time:t});
      if(tokP)await tokP;
      await flush();const left=(await qAll()).filter(x=>x.time===t).length;emit();
      return{uploaded:list.length-left,queued:left}})()}

  addEventListener('online',()=>flush());
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadGIS);else loadGIS();
  window.KAPhotos={connect,upload,flush,state,toast,albumName:k=>ALBUM[k],
    onChange(f){listeners.push(f);state().then(s=>{try{f(s)}catch(e){}})},
    isConnected:()=>!!ls.get('gp.connected')};
})();
