
(function(){
'use strict';
/* ---------- icons (authored, one stroke weight) ---------- */
const ICONS={
  paw:'<circle cx="7" cy="9" r="2"/><circle cx="12" cy="6.5" r="2"/><circle cx="17" cy="9" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 2.5-4 2.5S8 19 8 17z"/>',
  stamp:'<path d="M9 4h6v6l3 3v2H6v-2l3-3z"/><path d="M5 19h14"/>',
  sound:'<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute:'<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M17 10l4 4M21 10l-4 4"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  pencil:'<path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="M14 6l4 4"/>',
  build:'<path d="M4 20h16"/><path d="M6 20V10l6-5 6 5v10"/><path d="M10 20v-5h4v5"/>',
  feed:'<path d="M12 7c-4-2-8 0-8 5s3 8 5 8c1.5 0 2-.7 3-.7s1.5.7 3 .7c2 0 5-3 5-8s-4-7-8-5z"/><path d="M12 7c0-2 1-3.5 3-4"/>',
  book:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  play:'<path d="M8 5l11 7-11 7z"/>',
  undo:'<path d="M9 7L5 11l4 4"/><path d="M5 11h9a5 5 0 0 1 0 10h-2"/>',
  trash:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
  eraser:'<path d="M15 4l5 5-9 9H7l-3-3z"/><path d="M9 10l5 5M11 18h9"/>',
  sparkle:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M19 3v4M17 5h4"/>',
  arrow:'<path d="M4 12h15M13 6l6 6-6 6"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7z"/>',
  bulldozer:'<path d="M3 17h11v-5H9l-2-4H4v9z"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/><path d="M14 13l5-2v8h-3"/>',
  move:'<path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>',
  home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
  rotate:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M3 14a9 9 0 0 0 6 6M21 10a9 9 0 0 0-6-6"/>',
  ticket:'<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M15 6v2M15 11v2M15 16v2"/>',
  upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 15v5h16v-5"/>',
  bucket:'<path d="M4 11l7-7 8 8-7 7z"/><path d="M4 11h15"/><path d="M20 15s2 2.6 2 4a2 2 0 0 1-4 0c0-1.4 2-4 2-4z"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11"/><path d="M15 9.2c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2.1 0 2.8 6 1.6 6 4.4 0 1.2-1.3 2.1-3 2.1-1.5 0-2.6-.6-3.1-1.6"/>',
  expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><path d="M9 9h6v6H9z"/>',
  people:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M15 14.5c3 0 6 2 6 5"/>'
};
function icon(n){return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[n]||'')+'</svg>';}
function paintIcons(root){(root||document).querySelectorAll('[data-i]').forEach(el=>{if(!el.dataset.done){el.insertAdjacentHTML('afterbegin',icon(el.dataset.i));el.dataset.done=1;}});}

/* coloured item and food icons for trays */
const ART={
  pen_savanna:'<rect x="4" y="12" width="40" height="28" rx="6" fill="#e8cf7a" stroke="#f4c542" stroke-width="4"/><circle cx="18" cy="24" r="6" fill="#f08a3c"/><path d="M30 30h8" stroke="#8a5a2b" stroke-width="3"/>',
  pen_polar:'<rect x="4" y="12" width="40" height="28" rx="6" fill="#eef6fb" stroke="#5bc0eb" stroke-width="4"/><rect x="14" y="20" width="10" height="8" fill="#bfe6f5"/><rect x="26" y="26" width="8" height="6" fill="#bfe6f5"/>',
  pen_pond:'<rect x="4" y="12" width="40" height="28" rx="6" fill="#f2dc93" stroke="#21a89a" stroke-width="4"/><ellipse cx="24" cy="26" rx="13" ry="8" fill="#4fb3d9"/>',
  pen_jungle:'<rect x="4" y="12" width="40" height="28" rx="6" fill="#2f7d3a" stroke="#7cc142" stroke-width="4"/><path d="M14 34l4-12 4 12M26 34l5-14 5 14" fill="#7cc142"/>',
  path:'<rect x="8" y="8" width="32" height="32" rx="5" fill="#f4d98a" stroke="#d9b65c" stroke-width="3"/>',
  tree:'<rect x="21" y="28" width="6" height="14" fill="#8a5a2b"/><circle cx="24" cy="20" r="13" fill="#3fa34d"/><circle cx="18" cy="16" r="5" fill="#5cc067"/>',
  pine:'<rect x="21" y="34" width="6" height="8" fill="#8a5a2b"/><path d="M24 4l12 16h-6l8 12H10l8-12h-6z" fill="#2c8a4b"/>',
  bush:'<circle cx="16" cy="28" r="10" fill="#4fae5d"/><circle cx="30" cy="26" r="12" fill="#3f9c50"/><circle cx="34" cy="20" r="3" fill="#e8573c"/>',
  flowers:'<circle cx="14" cy="22" r="5" fill="#ff6fa8"/><circle cx="26" cy="16" r="5" fill="#f4c542"/><circle cx="34" cy="28" r="5" fill="#7048e8"/><path d="M14 27v12M26 21v18M34 33v6" stroke="#3f9c50" stroke-width="3"/>',
  rock:'<path d="M8 36l6-16 12-6 12 8 4 14z" fill="#9aa7b5" stroke="#6f7c8a" stroke-width="3"/>',
  bench:'<rect x="8" y="18" width="32" height="6" rx="2" fill="#2c4f7c"/><rect x="8" y="26" width="32" height="5" rx="2" fill="#1f3a5f"/><path d="M12 31v8M36 31v8" stroke="#1f3a5f" stroke-width="4"/>',
  lamp:'<path d="M24 16v26" stroke="#1f3a5f" stroke-width="4"/><circle cx="24" cy="12" r="7" fill="#ffd96b" stroke="#1f3a5f" stroke-width="3"/>',
  fountain:'<ellipse cx="24" cy="34" rx="18" ry="7" fill="#c9d3dd"/><ellipse cx="24" cy="32" rx="13" ry="4" fill="#4fb3d9"/><path d="M24 30V14M24 14c-4 0-6 4-8 8M24 14c4 0 6 4 8 8" stroke="#4fb3d9" stroke-width="3" fill="none"/>',
  remove:'',
  icecream:'<path d="M17 22l7 20 7-20z" fill="#e9b878" stroke="#8a5a2b" stroke-width="2"/><circle cx="24" cy="16" r="9" fill="#ff6fa8"/><circle cx="20" cy="12" r="3.5" fill="#fff" opacity=".7"/>',
  snack:'<rect x="11" y="21" width="26" height="19" rx="3" fill="#e8573c"/><path d="M11 26h26" stroke="#fff" stroke-width="3"/><circle cx="17" cy="17" r="5" fill="#fff3cc"/><circle cx="24" cy="14" r="6" fill="#fff3cc"/><circle cx="31" cy="17" r="5" fill="#fff3cc"/>',
  gift:'<rect x="8" y="19" width="32" height="21" fill="#ffd6e0" stroke="#1f3a5f" stroke-width="2"/><path d="M5 19l19-11 19 11z" fill="#e8573c"/><rect x="20" y="29" width="8" height="11" fill="#1f3a5f"/><rect x="29" y="22" width="8" height="7" fill="#f4c542"/><path d="M33 22v7" stroke="#e8573c" stroke-width="2"/>',
  restaurant:'<rect x="8" y="19" width="32" height="21" fill="#fff3cc" stroke="#1f3a5f" stroke-width="2"/><path d="M5 19l19-11 19 11z" fill="#21a89a"/><path d="M17 25v11M15 25v4M19 25v4M30 25c-3 0-3 6 0 6v5" stroke="#1f3a5f" stroke-width="2" fill="none" stroke-linecap="round"/>',
  apple:'<circle cx="24" cy="28" r="13" fill="#e8573c"/><path d="M24 15c0-4 2-6 5-7" stroke="#8a5a2b" stroke-width="3" fill="none"/><path d="M26 14c4-4 9-3 10-1-3 3-7 3-10 1z" fill="#3fa34d"/>',
  fish:'<ellipse cx="22" cy="24" rx="14" ry="8" fill="#5bc0eb"/><path d="M34 24l10-8v16z" fill="#2c8fc0"/><circle cx="15" cy="22" r="2" fill="#1f3a5f"/>',
  leaves:'<path d="M10 36C10 18 24 10 38 10c0 14-8 28-28 26z" fill="#4fae5d"/><path d="M12 34L32 16" stroke="#2f7d3d" stroke-width="3"/>',
  carrot:'<path d="M14 36l20-20 4 4-20 20c-2 2-6-2-4-4z" fill="#f08a3c"/><path d="M34 16l4-8M36 18l8-2" stroke="#3fa34d" stroke-width="4" stroke-linecap="round"/>',
  cake:'<rect x="10" y="22" width="28" height="16" rx="3" fill="#ffb3c7"/><rect x="10" y="22" width="28" height="5" fill="#fff"/><path d="M24 22v-8" stroke="#f4c542" stroke-width="3"/><circle cx="24" cy="12" r="3" fill="#e8573c"/>'
};
function art(n){return '<svg viewBox="0 0 48 48" aria-hidden="true">'+(ART[n]||'')+'</svg>';}

/* ---------- storage ---------- */
/* Saved progress lives under one fixed key and must survive every update. Never rename it or reset it. */
const KEY='liuFamilyZoo.v1',BACKUP='liuFamilyZoo.backup',RESCUE='liuFamilyZoo.rescue';
function rawGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
function parse(raw){try{const v=JSON.parse(raw);return v&&typeof v==='object'?v:null;}catch(e){return null;}}
let loadNote='';
function load(){const raw=rawGet(KEY);if(!raw)return null;const v=parse(raw);if(v)return v;
  /* a save we can't read is parked, never thrown away, and the backup is used instead */
  try{localStorage.setItem(RESCUE,raw);}catch(e){}const b=parse(rawGet(BACKUP));if(b&&b.data){loadNote='Your zoo was restored from a backup.';return b.data;}return null;}
let saveWarned=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){if(!saveWarned){saveWarned=true;toast("This device can't save the zoo right now");}}}

const KIDS={
  nora:{name:'Nora',color:'#7048e8',num:9,voice:false},
  lucas:{name:'Lucas',color:'#f76707',num:6,voice:false},
  milo:{name:'Milo',color:'#2f9e44',num:3,voice:true},
  keeper:{name:'Zookeeper',color:'#6b7d93'}
};
const ITEM={
  pen_savanna:{w:4,h:4,label:'Savanna pen',zone:'savanna'},
  pen_polar:{w:4,h:4,label:'Polar pen',zone:'polar'},
  pen_pond:{w:4,h:4,label:'Pond pen',zone:'pond'},
  pen_jungle:{w:4,h:4,label:'Jungle pen',zone:'jungle'},
  path:{w:1,h:1,label:'Path'}, tree:{w:1,h:1,label:'Tree'}, pine:{w:1,h:1,label:'Pine tree'},
  bush:{w:1,h:1,label:'Bush'}, flowers:{w:1,h:1,label:'Flowers'}, rock:{w:1,h:1,label:'Rock'},
  bench:{w:1,h:1,label:'Bench'}, lamp:{w:1,h:1,label:'Lamp'}, fountain:{w:2,h:2,label:'Fountain'},
  icecream:{w:1,h:1,label:'Ice cream stand',shop:4}, snack:{w:1,h:1,label:'Snack cart',shop:4}, gift:{w:2,h:2,label:'Gift shop',shop:8}, restaurant:{w:2,h:2,label:'Restaurant',shop:10}
};
const ZONE={
  savanna:{ground:'#e8cf7a',fence:'#f4c542',name:'Savanna'},
  polar:{ground:'#eef6fb',fence:'#5bc0eb',name:'Polar'},
  pond:{ground:'#f2dc93',fence:'#21a89a',name:'Pond'},
  jungle:{ground:'#2f7d3a',fence:'#7cc142',name:'Jungle'}
};
const GRID=20;

function defaultLayout(){
  const it=[];let id=1;const add=(type,c,r)=>it.push({id:id++,type,c,r});
  add('pen_savanna',2,2);add('pen_polar',14,2);add('pen_pond',2,13);add('pen_jungle',14,13);
  for(let r=1;r<GRID;r++){add('path',9,r);add('path',10,r);}
  for(let c=1;c<GRID-1;c++){if(c!==9&&c!==10){add('path',c,9);add('path',c,10);}}
  add('fountain',11,15);
  [['tree',1,7],['tree',7,1],['pine',7,6],['tree',12,6],['pine',18,7],['bush',8,3],['flowers',8,7],['flowers',11,3],
   ['bench',8,12],['bench',11,12],['lamp',8,16],['lamp',11,7],['tree',1,17],['pine',7,17],['bush',13,18],['flowers',8,18],
   ['rock',6,7],['tree',18,12],['flowers',12,11],['bush',1,11],['pine',17,18],['tree',6,12],['lamp',8,1],['flowers',13,8]
  ].forEach(a=>add(a[0],a[1],a[2]));
  return {items:it,nextItem:id};
}
let S=load();
if(!S){const L=defaultLayout();S={v:1,profile:null,sound:true,voice:{nora:false,lucas:false,milo:true},items:L.items,nextItem:L.nextItem,animals:[],stamps:[],nextAnimal:1,samples:false};}
/* fill in anything missing, never overwrite what is already saved */
S.v=1;if(!Array.isArray(S.items)){const L=defaultLayout();S.items=L.items;S.nextItem=L.nextItem;}
if(!Array.isArray(S.animals))S.animals=[];if(!Array.isArray(S.stamps))S.stamps=[];if(!S.voice)S.voice={nora:false,lucas:false,milo:true};if(S.sound==null)S.sound=true;
S.nextItem=Math.max(S.nextItem||1,1+S.items.reduce((m,i)=>Math.max(m,i.id||0),0));S.nextAnimal=Math.max(S.nextAnimal||1,1+S.animals.reduce((m,a)=>Math.max(m,a.id||0),0));
/* backup: copy of the zoo as it was when the game opened; only replaced when it would not lose animals, or after 3 days */
(function(){const raw=rawGet(KEY);if(!raw||!parse(raw))return;const old=parse(rawGet(BACKUP)),now=Date.now();
  const n=(S.animals||[]).length,on=old&&old.data&&Array.isArray(old.data.animals)?old.data.animals.length:-1;
  if(!old||n>=on||now-(old.at||0)>3*864e5){try{localStorage.setItem(BACKUP,JSON.stringify({at:now,data:JSON.parse(raw)}));}catch(e){}}})();

S.tickets=S.tickets||{nora:0,lucas:0,milo:0};if(S.coins==null)S.coins=150;S.seen=S.seen||{nora:{},lucas:{},milo:{}};
S.animals=S.animals.filter(a=>a.maker!=='keeper');S.samples=true;
/* ---------- helpers ---------- */
