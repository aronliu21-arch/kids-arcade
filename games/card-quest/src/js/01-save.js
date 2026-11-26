/* ---------- save: versioned, with a backup and import from the sample ---------- */
const KEY='cardquest.'+KID,BAK=KEY+'.backup',OLD=KID==='lucas'?'lab.cardshop2':'-none-',VER=1;
const DEF={ver:VER,started:false,cents:200,stars:0,owned:{},shopOpen:false,trophies:0,shelf:[],masterMet:0,acts:0,stats:{}};
function migrate(s){s=Object.assign({},DEF,s);if(!s.stats||typeof s.stats!=='object')s.stats={};
 /* future versions add steps here, e.g. if(s.ver<2){...;s.ver=2;} */
 s.ver=VER;return s;}
function loadSave(){let raw=null;try{raw=localStorage.getItem(KEY);}catch(e){}
 if(!raw){try{const old=localStorage.getItem(OLD);if(old){const o=JSON.parse(old);o.importedFrom='sample';return migrate(o);}}catch(e){}return migrate({});}
 try{const s=JSON.parse(raw);if((s.ver||0)<VER){try{localStorage.setItem(BAK,raw);}catch(e){}}return migrate(s);}
 catch(e){try{const b=JSON.parse(localStorage.getItem(BAK)||'{}');return migrate(b);}catch(e2){return migrate({});}}}
let S=loadSave();
let _bk=19;function save(){try{const j=JSON.stringify(S);localStorage.setItem(KEY,j);if(++_bk%20===0)localStorage.setItem(BAK,j);}catch(e){}hud();}
function hud(){$('wal').textContent='💵 '+money(S.cents);$('str').textContent='⭐ '+S.stars;}
let SOUND=true;try{SOUND=localStorage.getItem('cardquest.sound')!=='0';}catch(e){}
