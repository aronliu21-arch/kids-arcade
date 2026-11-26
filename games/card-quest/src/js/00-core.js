/* ---------- whose game this is: ?kid=nora → Nora's Card Shop, otherwise Lucas's Card Quest ---------- */
const KID=(()=>{let k='';try{k=(new URLSearchParams(location.search).get('kid')||sessionStorage.getItem('ka-kid')||'').toLowerCase();}catch(e){}return k==='nora'?'nora':'lucas';})();
try{sessionStorage.setItem('ka-kid',KID);}catch(e){}
const ME=KID==='nora'?{k:'nora',n:'Nora',g:true,col:'#7048e8',num:9,title:'Nora’s Card Shop',logo:'Nora’s<br>Card Shop',zh:[['幼','ㄧㄡˋ'],['晴','ㄑㄧㄥˊ'],['的','˙ㄉㄜ'],['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['店','ㄉㄧㄢˋ']],zhName:[['幼','ㄧㄡˋ'],['晴','ㄑㄧㄥˊ']],shop:'Nora’s Cards',other:'lucas',otherN:'Lucas'}
 :{k:'lucas',n:'Lucas',g:false,col:'#f76707',num:6,title:'Lucas’s Card Quest',logo:'Lucas’s<br>Card Quest',zh:[['陸','ㄌㄨˋ'],['晨','ㄔㄣˊ'],['的','˙ㄉㄜ'],['卡','ㄎㄚˇ'],['片','ㄆㄧㄢˋ'],['大','ㄉㄚˋ'],['冒','ㄇㄠˋ'],['險','ㄒㄧㄢˇ']],zhName:[['陸','ㄌㄨˋ'],['晨','ㄔㄣˊ']],shop:'Lucas’s Cards',other:'nora',otherN:'Nora'};

const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const money=c=>'$'+(c/100).toFixed(2);
function zh(t){return '<span class="zh" lang="zh-Hant">'+t.map(([c,z])=>{const neutral=z.startsWith('˙'),body=z.replace(/[˙ˊˇˋ]/g,''),tone=(z.match(/[ˊˇˋ]/)||[''])[0];
 const col=(neutral?'<i class="zn">˙</i>':'')+[...body].map(s=>'<i>'+s+'</i>').join('');return '<span class="zc"><span>'+c+'</span><span class="zy"><span class="zs">'+col+'</span>'+(tone?'<span class="zt">'+tone+'</span>':'')+'</span></span>';}).join('')+'</span>';}

