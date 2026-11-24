
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const money=c=>'$'+(c/100).toFixed(2);
function zh(t){return '<span class="zh" lang="zh-Hant">'+t.map(([c,z])=>{const neutral=z.startsWith('˙'),body=z.replace(/[˙ˊˇˋ]/g,''),tone=(z.match(/[ˊˇˋ]/)||[''])[0];
 const col=(neutral?'<i class="zn">˙</i>':'')+[...body].map(s=>'<i>'+s+'</i>').join('');return '<span class="zc"><span>'+c+'</span><span class="zy"><span class="zs">'+col+'</span>'+(tone?'<span class="zt">'+tone+'</span>':'')+'</span></span>';}).join('')+'</span>';}

