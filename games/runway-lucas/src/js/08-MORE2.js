const MORE2={
 school:{hair:['pony','braids','bob','halfup','lowpony','sidepart','bangs'],top:['shirt','sailor','cardigan','blazer','sweatervest','longtee','bowblouse','turtleneck'],bottom:['pleated','plaidskirt','trousers','jeans','skirt'],dress:['pinafore','plaiddress','sailordress','shirtdress'],shoes:['mary','loafers','sneakers','kneesocks'],acc:['backpack','headband','glasses','bow','watch']},
 camping:{hair:['braids','onebraid','highpony','pony'],top:['plaidshirt','fleece','hoodie','windbreaker','puffvest','sweatshirt'],bottom:['cargo','joggers','jeans','overalls','leggings'],dress:['poncho','shortalls'],shoes:['boots','sneakers','rainboots','hightops'],acc:['backpack','buckethat','cap','camera','beanie']},
 birthday:{hair:['curly','pigtails','spacebuns','halfup','curlypony'],top:['sequin','startop','ruffle','puffsleeve','princesstop'],bottom:['tutu','tulle','sequinskirt','circleskirt','ruffleskirt'],dress:['partydress','princess','ballet','tierdress'],shoes:['sparkleshoes','bowshoes','mary','glass'],acc:['balloon','crown','wand','bow','icecream','cottoncandy']},
 halloween:{hair:['catbuns','superlong','spacebuns','shortcurl'],top:['cape','leather','startop'],bottom:['leggings','starpants','stripepants','tutu'],dress:['galaxy','angel','fairy','lion','snowman'],shoes:['combat','tallboots','boots'],acc:['catears','bunnyears','wand','wings','halo','lantern']},
 concert:{hair:['highpony','afro','pixie','sidepony','bigwaves'],top:['sequin','leather','denimjacket','offshoulder','startop'],bottom:['sequinskirt','jeans','flares','widejeans','starpants'],dress:['galaxy','evening','jumpsuit','cheer'],shoes:['combat','hightops','sparkleshoes'],acc:['starglasses','heartglasses','earrings','sunglasses','necklace']},
 autumn:{hair:['braids','onebraid','wavy','lowpony','shoulder'],top:['cardigan','sweater','plaidshirt','trench','heartsweater','turtleneck'],bottom:['jeans','maxi','trousers','flowermaxi','wrapskirt'],dress:['sweaterdress','longsleevedress','plaiddress','pinafore'],shoes:['boots','loafers','tallboots','fuzzyboots'],acc:['beret','scarf','bag','camera']},
 ballet:{hair:['bun','updo','crownbraid','halfbun'],top:['cami','lace','puffsleeve'],bottom:['tutu','tulle','ruffleskirt'],dress:['ballet','princess','angel','fairy'],shoes:['balletflat','glass','bowshoes'],acc:['bow','pearls','bouquet','headband','flowercrown']},
 fairy:{hair:['long','wavy','crownbraid','halfup','bigwaves'],top:['ruffle','lace','offshoulder'],bottom:['floral','tiered','flowermaxi','tulle'],dress:['fairy','angel','flowerdress','sun'],shoes:['balletflat','sandals','espadrille'],acc:['wings','flowercrown','wand','bouquet','halo']},
 travel:{hair:['pony','bob','halfbun','sidepart'],top:['stripy','denimjacket','trench','tee','shirt','windbreaker'],bottom:['jeans','widepants','capris','trousers','denimshorts'],dress:['jumpsuit','shirtdress','longcoat'],shoes:['sneakers','loafers','espadrille','runners'],acc:['sunglasses','backpack','camera','strawhat','handbag','watch']},
 candy:{hair:['pigtails','spacebuns','curly','catbuns','curlypony'],top:['rainbow','heartsweater','puffsleeve','startop'],bottom:['tutu','circleskirt','bloomers','ruffleskirt'],dress:['partydress','princess','tierdress','pinafore'],shoes:['bowshoes','sparkleshoes','mary','fuzzy'],acc:['cottoncandy','icecream','balloon','boba','bow','heartglasses']}};
Object.entries(MORE2).forEach(([th,cats])=>Object.entries(cats).forEach(([c,ids])=>ids.forEach(id=>{const it=find(c,id);if(it&&!it.tags.includes(th))it.tags.push(th);})));


/* ---------- pop music: synthesized, no files. I–V–vi–IV in C, 118 bpm ---------- */
const POP={on:false,t:null,next:0,step:0,master:null,bus:null,noise:null,vol:.16,bpm:118};
const hz=m=>440*Math.pow(2,(m-69)/12);
function popGraph(){const c=audio();if(!c)return null;if(!POP.master){POP.master=c.createGain();POP.master.gain.value=0;POP.master.connect(c.destination);
  const comp=c.createDynamicsCompressor();POP.bus=c.createGain();POP.bus.connect(comp);comp.connect(POP.master);
  const d=c.createDelay(1);d.delayTime.value=60/POP.bpm*.75;const fb=c.createGain();fb.gain.value=.22;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3000;
  POP.fx=c.createGain();POP.fx.gain.value=.5;POP.fx.connect(d);d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(comp);
  const n=c.createBuffer(1,c.sampleRate,c.sampleRate),ch=n.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;POP.noise=n;}return c;}
function pOsc(c,t,f,dur,type,vol,cut,fx){const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);let n=o;
  if(cut){const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(cut,t);lp.Q.value=4;o.connect(lp);n=lp;}n.connect(g);g.connect(POP.bus);if(fx)g.connect(POP.fx);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.start(t);o.stop(t+dur+.05);}
function pNoise(c,t,dur,type,f,vol){const s=c.createBufferSource();s.buffer=POP.noise;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;const g=c.createGain();s.connect(fl);fl.connect(g);g.connect(POP.bus);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.start(t);s.stop(t+dur+.05);}
function pKick(c,t){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.0001,t+.28);o.connect(g);g.connect(POP.bus);o.start(t);o.stop(t+.3);}
const CH=[[60,64,67],[59,62,67],[57,60,64],[57,60,65]],BS=[36,43,45,41];
const MEL=[[72,null,74,76,null,79,76,74],[74,null,71,74,null,79,null,74],[76,null,72,76,null,81,79,76],[77,76,74,72,null,74,null,null]];
const MEL2=[[79,null,79,81,79,null,76,null],[74,null,74,76,74,null,71,null],[72,null,76,79,81,null,79,76],[77,null,76,null,74,null,72,null]];
function popStep(c,t,s){const st=60/POP.bpm/2,bar=(s>>3)&15,b=s&7,ci=bar&3,sec=bar>>2,run=running;
  if(b%2===0)pKick(c,t);if(b===2||b===6){pNoise(c,t,.16,'bandpass',1500,.35);pNoise(c,t+.012,.12,'bandpass',2200,.25);}
  pNoise(c,t+(b%2?0:st*.5)*0,.03,'highpass',8000,b%2?.12:.05);
  if(b===0||b===3||b===6)pOsc(c,t,hz(BS[ci]),st*1.6,'sawtooth',.22,600);
  if(b===0||b===3||b===6)CH[ci].forEach(m=>pOsc(c,t,hz(m+12),st*1.2,'square',.035,2200,true));
  const mel=sec===1||sec===3?(sec===3?MEL2:MEL):null;if(mel||run){const M=(mel||MEL2)[ci][b];if(M){let len=1;while(b+len<8&&(mel||MEL2)[ci][b+len]===null)len++;
    pOsc(c,t,hz(M),st*len*.9,'triangle',.11,0,true);pOsc(c,t,hz(M+12),st*len*.7,'square',.02,3000);}}
  if(run&&b%2===1)pNoise(c,t,.05,'highpass',6000,.1);}
function popTick(){const c=audio();if(!c)return;while(POP.next<c.currentTime+.15){if(running){runStep(c,POP.next,POP.step);POP.next+=60/124/2;POP.step=(POP.step+1)%64;}else{popStep(c,POP.next,POP.step);POP.next+=60/POP.bpm/2;POP.step=(POP.step+1)%128;}}}
function popLevel(v,dt){const c=audio();if(!c||!POP.master)return;const g=POP.master.gain;g.cancelScheduledValues(c.currentTime);g.setValueAtTime(g.value,c.currentTime);g.linearRampToValueAtTime(v,c.currentTime+(dt||.4));}
function popStart(){if(POP.on||!SOUND)return;const c=popGraph();if(!c)return;POP.on=true;POP.next=c.currentTime+.06;POP.step=0;POP.t=setInterval(()=>{try{popTick();}catch(e){}},25);popLevel(POP.vol,.8);}
function popStop(){if(!POP.on)return;POP.on=false;popLevel(0,.3);clearInterval(POP.t);}
/* softer under the read-aloud voice */
function sayEn(t){if(!SOUND||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t));u.lang='en-US';u.rate=.92;u.pitch=1.1;const v=speechSynthesis.getVoices().find(x=>/en[-_]US/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}}
const _say=say;say=function(t,r){if(POP.on){popLevel(.05,.2);clearTimeout(POP.duck);POP.duck=setTimeout(()=>popLevel(running?.24:POP.vol,.6),Math.min(7000,1200+String(t).length*65));}if(!SOUND||!('speechSynthesis' in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(t));u.lang='en-US';u.rate=.95;u.pitch=1.1;const v=speechSynthesis.getVoices().find(x=>/en[-_]US/i.test(x.lang));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}};
document.addEventListener('pointerdown',()=>{if(SOUND&&!POP.on)popStart();},true);
$('snd').addEventListener('click',()=>{if(SOUND)popStart();else popStop();});

/* ---------- Chinese UI: every character gets zhuyin; clothing names stay bilingual ---------- */
const ZD={};'一ㄧ 上ㄕㄤˋ 下ㄒㄧㄚˋ 不ㄅㄨˋ 主ㄓㄨˇ 之ㄓ 了˙ㄌㄜ 些ㄒㄧㄝ 亮ㄌㄧㄤˋ 人ㄖㄣˊ 今ㄐㄧㄣ 仔ㄗㄞˇ 以ㄧˇ 件ㄐㄧㄢˋ 來ㄌㄞˊ 便ㄅㄧㄢˋ 個˙ㄍㄜ 做ㄗㄨㄛˋ 備ㄅㄟˋ 傳ㄔㄨㄢˊ 像ㄒㄧㄤˋ 先ㄒㄧㄢ 光ㄍㄨㄤ 兩ㄌㄧㄤˇ 再ㄗㄞˋ 出ㄔㄨ 別ㄅㄧㄝˊ 到ㄉㄠˋ 剩ㄕㄥˋ 創ㄔㄨㄤˋ 加ㄐㄧㄚ 午ㄨˇ 去ㄑㄩˋ 又ㄧㄡˋ 可ㄎㄜˇ 吃ㄔ 合ㄏㄜˊ 吧˙ㄅㄚ 和ㄏㄜˊ 喔ㄛ 嗯ㄣ 回ㄏㄨㄟˊ 在ㄗㄞˋ 地ㄉㄧˋ 型ㄒㄧㄥˊ 大ㄉㄚˋ 天ㄊㄧㄢ 太ㄊㄞˋ 她ㄊㄚ 好ㄏㄠˇ 始ㄕˇ 子˙ㄗ 家ㄐㄧㄚ 審ㄕㄣˇ 尚ㄕㄤˋ 巨ㄐㄩˋ 己ㄐㄧˇ 師ㄕ 帶ㄉㄞˋ 平ㄆㄧㄥˊ 幼ㄧㄡˋ 很ㄏㄣˇ 得˙ㄉㄜ 忘ㄨㄤˋ 快ㄎㄨㄞˋ 怕ㄆㄚˋ 意ㄧˋ 感ㄍㄢˇ 我ㄨㄛˇ 或ㄏㄨㄛˋ 手ㄕㄡˇ 打ㄉㄚˇ 扮ㄅㄢˋ 把ㄅㄚˇ 掉ㄉㄧㄠˋ 描ㄇㄧㄠˊ 換ㄏㄨㄢˋ 放ㄈㄤˋ 新ㄒㄧㄣ 方ㄈㄤ 星ㄒㄧㄥ 是ㄕˋ 時ㄕˊ 晴ㄑㄧㄥˊ 暖ㄋㄨㄢˇ 更ㄍㄥˋ 會ㄏㄨㄟˋ 月ㄩㄝˋ 有ㄧㄡˇ 服ㄈㄨˊ 本ㄅㄣˇ 朵ㄉㄨㄛˇ 板ㄅㄢˇ 格ㄍㄜˊ 棒ㄅㄤˋ 棕ㄗㄨㄥ 機ㄐㄧ 橫ㄏㄥˊ 次ㄘˋ 比ㄅㄧˇ 水ㄕㄨㄟˇ 洋ㄧㄤˊ 海ㄏㄞˇ 涼ㄌㄧㄤˊ 準ㄓㄨㄣˇ 溫ㄨㄣ 漂ㄆㄧㄠˋ 牛ㄋㄧㄡˊ 特ㄊㄜˋ 玩ㄨㄢˊ 珊ㄕㄢ 球ㄑㄧㄡˊ 瑚ㄏㄨˊ 白ㄅㄞˊ 的˙ㄉㄜ 直ㄓˊ 看ㄎㄢˋ 秀ㄒㄧㄡˋ 秒ㄇㄧㄠˇ 穿ㄔㄨㄢ 等ㄉㄥˇ 粉ㄈㄣˇ 紅ㄏㄨㄥˊ 紋ㄨㄣˊ 級ㄐㄧˊ 素ㄙㄨˋ 紫ㄗˇ 給ㄍㄟˇ 綠ㄌㄩˋ 繼ㄐㄧˋ 續ㄒㄩˋ 老ㄌㄠˇ 脫ㄊㄨㄛ 自ㄗˋ 舒ㄕㄨ 色ㄙㄜˋ 艾ㄞˋ 花ㄏㄨㄚ 茶ㄔㄚˊ 莉ㄌㄧˋ 華ㄏㄨㄚˊ 藍ㄌㄢˊ 衣ㄧ 裝ㄓㄨㄤ 裡ㄌㄧˇ 要ㄧㄠˋ 計ㄐㄧˋ 設ㄕㄜˋ 評ㄆㄧㄥˊ 試ㄕˋ 讓ㄖㄤˋ 走ㄗㄡˇ 超ㄔㄠ 跑ㄆㄠˇ 跳ㄊㄧㄠˋ 身ㄕㄣ 較ㄐㄧㄠˋ 這ㄓㄜˋ 逛ㄍㄨㄤˋ 進ㄐㄧㄣˋ 運ㄩㄣˋ 過ㄍㄨㄛˋ 適ㄕˋ 選ㄒㄩㄢˇ 還ㄏㄞˊ 邊ㄅㄧㄢ 配ㄆㄟˋ 金ㄐㄧㄣ 銀ㄧㄣˊ 閃ㄕㄢˇ 開ㄎㄞ 間ㄐㄧㄢ 關ㄍㄨㄢ 陽ㄧㄤˊ 雨ㄩˇ 雪ㄒㄩㄝˇ 需ㄒㄩ 鞋ㄒㄧㄝˊ 頭ㄊㄡˊ 題ㄊㄧˊ 顏ㄧㄢˊ 風ㄈㄥ 髮ㄈㄚˇ 麗ㄌㄧˋ 黃ㄏㄨㄤˊ 黑ㄏㄟ 點ㄉㄧㄢˇ'.split(' ').forEach(p=>{ZD[p[0]]=p.slice(1);});
Object.entries({世:'ㄕˋ',作:'ㄗㄨㄛˋ',價:'ㄐㄧㄚˋ',兒:'ㄦˊ',公:'ㄍㄨㄥ',升:'ㄕㄥ',厲:'ㄌㄧˋ',司:'ㄙ',告:'ㄍㄠˋ',咖:'ㄎㄚ',品:'ㄆㄧㄣˇ',商:'ㄕㄤ',啡:'ㄈㄟ',喜:'ㄒㄧˇ',國:'ㄍㄨㄛˊ',城:'ㄔㄥˊ',夠:'ㄍㄡˋ',夢:'ㄇㄥˋ',客:'ㄎㄜˋ',室:'ㄕˋ',害:'ㄏㄞˋ',少:'ㄕㄠˇ',屋:'ㄨ',工:'ㄍㄨㄥ',巴:'ㄅㄚ',市:'ㄕˋ',幣:'ㄅㄧˋ',幻:'ㄏㄨㄢˋ',序:'ㄒㄩˋ',店:'ㄉㄧㄢˋ',廣:'ㄍㄨㄤˇ',後:'ㄏㄡˋ',從:'ㄘㄨㄥˊ',恭:'ㄍㄨㄥ',找:'ㄓㄠˇ',接:'ㄐㄧㄝ',收:'ㄕㄡ',東:'ㄉㄨㄥ',標:'ㄅㄧㄠ',櫃:'ㄍㄨㄟˋ',氣:'ㄑㄧˋ',油:'ㄧㄡˊ',涯:'ㄧㄚˊ',為:'ㄨㄟˊ',班:'ㄅㄢ',理:'ㄌㄧˇ',生:'ㄕㄥ',界:'ㄐㄧㄝˋ',目:'ㄇㄨˋ',硬:'ㄧㄥˋ',禮:'ㄌㄧˇ',答:'ㄉㄚˊ',紀:'ㄐㄧˋ',紉:'ㄖㄣˋ',經:'ㄐㄧㄥ',縫:'ㄈㄥˊ',能:'ㄋㄥˊ',街:'ㄐㄧㄝ',西:'˙ㄒㄧ',記:'ㄐㄧˋ',貨:'ㄏㄨㄛˋ',賺:'ㄓㄨㄢˋ',都:'ㄉㄡ',重:'ㄔㄨㄥˊ',鈕:'ㄋㄧㄡˇ',門:'ㄇㄣˊ',際:'ㄐㄧˋ',順:'ㄕㄨㄣˋ',飾:'ㄕˋ',黎:'ㄌㄧˊ',也:'ㄧㄝˇ',優:'ㄧㄡ',冷:'ㄌㄥˇ',動:'ㄉㄨㄥˋ',嚇:'ㄒㄧㄚˋ',多:'ㄉㄨㄛ',彩:'ㄘㄞˇ',心:'ㄒㄧㄣ',愛:'ㄞˋ',慶:'ㄑㄧㄥˋ',成:'ㄔㄥˊ',整:'ㄓㄥˇ',晚:'ㄨㄢˇ',林:'ㄌㄧㄣˊ',森:'ㄙㄣ',樣:'ㄧㄤˋ',燈:'ㄉㄥ',甜:'ㄊㄧㄢˊ',發:'ㄈㄚ',祝:'ㄓㄨˋ',秋:'ㄑㄧㄡ',精:'ㄐㄧㄥ',累:'ㄌㄟˋ',耐:'ㄋㄞˋ',舞:'ㄨˇ',課:'ㄎㄜˋ',變:'ㄅㄧㄢˋ',越:'ㄩㄝˋ',路:'ㄌㄨˋ',輕:'ㄑㄧㄥ',酷:'ㄎㄨˋ',雅:'ㄧㄚˇ',靈:'ㄌㄧㄥˊ',髒:'ㄗㄤ',齊:'ㄑㄧˊ',相:'ㄒㄧㄤˋ',簿:'ㄅㄨˋ',刪:'ㄕㄢ',除:'ㄔㄨˊ',沒:'ㄇㄟˊ'}).forEach(([k,v])=>{if(!ZD[k])ZD[k]=v;});
const ZW={'衣服':'ㄧ ˙ㄈㄨ','舒服':'ㄕㄨ ˙ㄈㄨ','涼快':'ㄌㄧㄤˊ ˙ㄎㄨㄞ','漂亮':'ㄆㄧㄠˋ ˙ㄌㄧㄤ'};
function zh(s){let out='',i=0;const a=[...s];
  while(i<a.length){let hit=null;for(const w in ZW){const L=[...w].length;if(a.slice(i,i+L).join('')===w){hit=[w,ZW[w]];break;}}
    if(hit){out+=RB(hit[0],hit[1]);i+=[...hit[0]].length;continue;}
    const c=a[i];if(/[一-鿿]/.test(c)){out+=ZD[c]?RB(c,ZD[c]):'<span class="nozy">'+c+'</span>';}else out+=c.replace('<','&lt;');i++;}
  return out;}
const itemZH=it=>(it.zh[0]==='T'?'T'+RB('恤','ㄒㄩˋ'):RB(it.zh,it.zy));
const itemBoth=it=>'<span class="ib">'+itemZH(it)+' <small>'+it.en+'</small></span>';
const COLZH={red:'紅色',coral:'珊瑚色',pink:'粉紅色',purple:'紫色',blue:'藍色',aqua:'水藍色',green:'綠色',yellow:'黃色',gold:'金色',silver:'銀色',white:'白色',black:'黑色',brown:'棕色',denim:'牛仔藍'};
const HZ={night:'舒服好走，邊逛邊吃！',rain:'不怕下雨，穿得亮亮的。',space:'準備好上月球了！',newyear:'紅色和金色會帶來好運。',royal:'華麗又閃亮！',beach:'涼快又有陽光感。',sports:'方便跑跑跳跳。',snow:'在雪地裡溫暖又舒服。',garden:'花朵、陽光和下午茶。',sea:'跳進大海裡吧！',school:'整齊又方便，準備上課！',camping:'好動又耐髒，晚上會變冷喔。',birthday:'開心又閃亮，一起慶祝！',halloween:'扮成可愛又有點嚇人的樣子！',concert:'酷酷的，在舞台燈光下閃閃發亮！',autumn:'穿上秋天的顏色，暖暖的。',ballet:'輕輕的、優雅的，像在跳舞。',fairy:'像森林裡的小精靈！',travel:'舒服好走，走很多路也不累。',candy:'甜甜的、彩色的，越可愛越好！'};
THEMES.forEach(t=>{t.hz=HZ[t.id];const z=t.zy.split(' ');[...t.zh].forEach((c,i)=>{if(!ZD[c])ZD[c]=z[i];});});
const HE={night:'Comfy clothes for walking and snacking!',rain:'Stay dry and bright.',space:'Ready for the moon!',newyear:'Red and gold bring good luck.',royal:'Fancy, sparkly and grand.',beach:'Sunny and cool.',sports:'Easy to run and jump in.',snow:'Warm and cozy in the snow.',garden:'Flowers, sunshine and tea.',sea:'Splash into the ocean!',school:'Neat and easy, ready for class!',camping:'Tough and comfy. It gets cold at night!',birthday:'Happy and sparkly, let\'s celebrate!',halloween:'Cute and a little bit spooky!',concert:'Cool and shiny under the stage lights!',autumn:'Warm autumn colors.',ballet:'Light and graceful, like a dancer.',fairy:'Like a little fairy of the forest!',travel:'Comfy for walking all day.',candy:'Sweet, colorful and super cute!'};THEMES.forEach(t=>t.he=HE[t.id]);
