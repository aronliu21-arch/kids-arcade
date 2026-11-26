function bgCanvas(k){if(BGC[k])return BGC[k];const c=document.createElement('canvas');c.width=W;c.height=H;
  if(k&&k.startsWith('img:')){const src=story&&story.imgs&&story.imgs[k.slice(4)];const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);if(!src)return c;const im=new Image();im.onload=()=>x.drawImage(im,0,0,W,H);im.src=src;BGC[k]=c;return c}try{(BG[k]||BG.meadow)(c.getContext('2d'))}catch(e){console.warn(e)}BGC[k]=c;return c}

/* ================= emoji → sticker ================= */
const EMO={};
function emojiSticker(e){if(EMO[e])return EMO[e];const c=document.createElement('canvas');c.width=c.height=260;const x=c.getContext('2d');x.font='200px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,130,140);
  const d=x.getImageData(0,0,260,260).data;let x0=260,y0=260,x1=-1,y1=-1;for(let y=0;y<260;y++)for(let xx=0;xx<260;xx++)if(d[(y*260+xx)*4+3]>20){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1<0){x0=y0=0;x1=y1=259}const o=document.createElement('canvas');o.width=x1-x0+1;o.height=y1-y0+1;o.getContext('2d').drawImage(c,-x0,-y0);EMO[e]=sticker(o.toDataURL());return EMO[e]}
const spriteOf=a=>a.img?sticker(story.imgs[a.img]||''):emojiSticker(a.e);

/* ================= decisions ================= */
// option: [emoji, en label, zh label, en phrase, zh phrase, effect]
const HEROES=[['🐉','Sparky','小火花','little dragon','小龍','隻'],['🤖','Bolt','波波','robot','機器人','個'],['🐱','Mimi','咪咪','kitten','小貓','隻'],['🦖','Rexy','雷克斯','dinosaur','恐龍','隻'],['🦄','Twinkle','閃閃','unicorn','獨角獸','隻'],
  ['🕵️','Sherlock','小偵探','kid detective','小偵探','個'],['🧑‍🚀','Astro','阿斯特','astronaut','太空人','個'],['🦸','Captain Zoom','飛飛隊長','superhero','超級英雄','個'],['🧙','Merlin','小梅林','young wizard','小巫師','個'],['🐶','Buddy','巴弟','puppy','小狗','隻'],['🐼','Bao','寶寶','panda','熊貓','隻'],['🧜‍♀️','Marina','小美人魚','mermaid','美人魚','條']];
const PLACES=[['🏰','castle','城堡','in a sparkly castle','to a sparkly castle','住在閃亮亮的城堡裡','來到了閃亮亮的城堡'],['🌴','jungle','叢林','deep in the jungle','into the jungle','住在叢林深處','走進了叢林'],['🌙','moon','月亮','on the moon','all the way to the moon','住在月亮上','飛到了月亮上'],
  ['🐠','sea','海底','under the sea','down under the sea','住在海底','潛到了海底'],['🍭','candy','糖果鎮','in Candy Town','to Candy Town','住在糖果鎮','來到了糖果鎮'],['🏙️','city','城市','in a busy city','to the big city','住在熱鬧的城市','來到了大城市'],
  ['🏔️','snow','雪山','on a snowy mountain','up a snowy mountain','住在雪山上','爬上了雪山'],['🌋','dino','恐龍島','on Dino Island','to Dino Island','住在恐龍島上','來到了恐龍島'],['🦇','cave','山洞','in a secret cave','into a dark cave','住在祕密山洞裡','走進了黑漆漆的山洞'],
  ['☁️','sky','雲上','up in the clouds','up into the clouds','住在雲朵上','飛到了雲朵上'],['🌲','forest','森林','in a quiet forest','into the forest','住在安靜的森林裡','走進了森林'],['🏖️','beach','海灘','by the beach','to the beach','住在海邊','來到了海灘'],['🏡','home','家','in a cozy little house','back home','住在溫暖的小房子裡','回到了家']];
const DETAIL={castle:['where the towers sparkled in the sun','那裡的高塔在陽光下閃閃發亮'],jungle:['where monkeys swung from vine to vine','那裡的猴子在藤蔓間盪來盪去'],moon:['where every step was a giant bounce','在那裡每走一步都會彈得好高'],
  sea:['where fish glowed like tiny lanterns','那裡的小魚像小燈籠一樣發光'],candy:['where the rivers were made of chocolate','那裡的河流是巧克力做的'],city:['full of honking cars and tall, tall towers','到處都是嘟嘟叫的車子和好高好高的大樓'],
  snow:['where the wind sang icy songs','那裡的風會唱冰冰涼涼的歌'],dino:['where a sleepy volcano rumbled','那裡有一座會打呼的火山'],cave:['where crystals glowed in the dark','那裡的水晶在黑暗中發光'],
  sky:['where you could nap on fluffy clouds','在那裡可以躺在軟綿綿的雲上睡午覺'],forest:['where the trees whispered secrets','那裡的大樹會說悄悄話'],beach:['where the waves went swish, swish','那裡的海浪唰唰唰地響'],home:['that smelled like warm cookies','屋子裡總是飄著餅乾香']};
const TRAITS=[['💪','brave','勇敢',c=>`${c.H} was super brave, but sometimes rushed in too fast.`,c=>`${c.H}超級勇敢,不過有時候衝太快。`],['🙈','shy','害羞',c=>`${c.H} was a little shy, but had the kindest heart.`,c=>`${c.H}有一點害羞,但心地超善良。`],
  ['🔍','curious','好奇',c=>`${c.H} was very curious and always asked, “Why?”`,c=>`${c.H}很好奇,總是問:「為什麼?」`],['😜','funny','愛搞笑',c=>`${c.H} loved telling jokes and making everyone laugh.`,c=>`${c.H}最愛講笑話,讓大家哈哈笑。`],
  ['🤸','clumsy','笨手笨腳',c=>`${c.H} tripped over everything, but never gave up.`,c=>`${c.H}常常跌倒,可是從來不放棄。`],['🧠','smart','聰明',c=>`${c.H} was clever and loved solving puzzles.`,c=>`${c.H}很聰明,最愛解謎題。`]];
// [emoji, label, labelZh, phrase, phraseZh, prop, goal noun, goal noun zh, why, whyZh]
const WANTS=[['💎','treasure','寶藏','find a hidden treasure','找到藏起來的寶藏','💎','treasure map','藏寶圖','Legend said it could grant one wish.','傳說它可以實現一個願望。'],
  ['🤝','a friend','朋友','make a new friend','交到新朋友','','friendship bracelet','友誼手環','Playing alone was not much fun.','一個人玩一點都不好玩。'],
  ['🏆','win','贏比賽','win the big game','贏得大比賽','🏆','lucky ball','幸運球','The whole town would be cheering.','全鎮的人都會來加油。'],
  ['⭐','the stars','星星','fly to the stars','飛到星星上','⭐','star map','星星地圖','Every night, the stars seemed to wave hello.','每天晚上,星星好像都在揮手打招呼。'],
  ['🐶','lost puppy','小狗','find a lost puppy','找到走丟的小狗','🐶','puppy’s collar','小狗的項圈','Its little bark echoed from far away.','遠遠的地方傳來小狗汪汪的叫聲。'],
  ['🎂','giant cake','大蛋糕','bake the biggest cake ever','烤出世界最大的蛋糕','🎂','secret recipe','祕密食譜','A cake big enough for the whole town!','大到可以請全鎮的人吃!'],
  ['🦸','be a hero','當英雄','become a real hero','成為真正的英雄','','hero cape','英雄披風','A real hero helps everyone.','真正的英雄會幫助每一個人。'],
  ['🎤','sing','唱歌','sing on a big stage','在大舞台上唱歌','🎤','golden microphone','金麥克風','Every day, the songs got a little better.','每天練習,歌聲越來越好聽。']];
// [emoji, label, labelZh, phrase, phraseZh, effect, fix, fixZh]
const PROBLEMS=[['⛈️','storm','暴風雨','a huge storm blew everything away','一場大風暴把東西都吹走了',{fx:'storm'},'calmed the wild storm','讓暴風雨停了下來'],
  ['🦊','a thief','小偷',c=>`a sneaky fox stole the ${c.goalEn||'magic map'}`,c=>`一隻狡猾的狐狸偷走了${c.goalZh||'魔法地圖'}`,{add:['🦊','Sly Fox','狡猾狐狸','villain'],say:['Ha ha! Now it’s mine!','哈哈!現在是我的了!'],dropGoal:true},c=>`got the ${c.goalEn||'magic map'} back`,c=>`拿回了${c.goalZh||'魔法地圖'}`],
  ['💤','sleep spell','睡著了','everyone fell fast asleep and would not wake up','大家都睡著了,怎麼叫都叫不醒',{fx:'stars'},'woke everyone up','把大家都叫醒了'],
  ['🥚','strange egg','怪蛋','a mysterious glowing egg appeared','出現了一顆會發光的神祕蛋',{prop:'🥚',fx:'sparkle'},'found where the egg belonged, and it hatched','幫蛋找到了家,蛋還孵出來了'],
  ['🎨','colors gone','顏色不見','all the colors in the world disappeared','世界上的顏色全部不見了',{gray:true},'brought all the colors back','把所有的顏色都找回來了'],
  ['🕳️','giant hole','大洞','a giant hole opened in the ground','地上裂開了一個大洞',{fx:'shake'},'filled the giant hole','把大洞補好了'],
  ['👾','monster','怪獸','a hungry monster showed up','一隻肚子好餓的怪獸出現了',{add:['👾','Grumbles','咕嚕怪','villain'],say:['GRRR! I’m sooo hungry!','咕嚕嚕!我好餓好餓!']},'made sure the monster was never hungry again','讓怪獸再也不會餓肚子'],
  ['🗺️','got lost','迷路',c=>`${c.H} got completely lost`,c=>`${c.H}完全迷路了`,{},'found the way home','找到了回家的路']];
const ACTIONS=[['🔦','explore','探險','explore and look around','到處探險看看',{}],['🙋','ask for help','找人幫忙','ask for help','找人幫忙',{}],['🫣','hide & plan','躲起來','hide and make a clever plan','先躲起來想個好辦法',{}],['💪','be brave','勇敢','be brave and face it','勇敢面對',{}],
  ['✨','magic','魔法','try some magic','試試魔法',{fx:'sparkle'}],['⚙️','build a machine','做機器','build an amazing machine','做一台超厲害的機器',{prop:'⚙️'}],['👣','follow footprints','跟著腳印','follow the mysterious footprints','跟著神祕的腳印走',{}],['🎈','fly up','飛起來','fly up high','飛到高高的天上',{heroMode:'fly'}],['🏃','run fast','快跑','run as fast as possible','用最快的速度跑',{heroMode:'wander'}]];
const SILLY=[['everyone’s hair turned bright pink','大家的頭髮都變成了粉紅色'],['it started raining jelly beans','天上開始下雷根糖'],['HERO hiccuped bubbles for ten whole minutes','HERO打嗝打出泡泡,打了整整十分鐘'],['a cow floated by wearing sunglasses','一頭戴著太陽眼鏡的牛飄了過去']];
const RESULTS=[['✅','It worked!','成功了!',c=>`It worked! ${c.H} cheered, “Yes!”`,c=>`成功了!${c.H}歡呼:「耶!」`,{fx:'sparkle',mood:'😄',say:['Yes!','耶!']}],
  ['😅','Oops!','糟糕!','But oops! It did not work, and things got even trickier.','可是糟糕!沒有成功,事情變得更麻煩了。',{mood:'😣',say:['Uh-oh…','哎呀……']}],
  ['🤪','Something silly','好好笑',c=>{const s=SILLY[Math.floor(Math.random()*SILLY.length)];c._s=s;return`Instead, ${s[0].replace('HERO',c.H)}!`},c=>{const s=c._s||SILLY[0];return`結果,${s[1].replace('HERO',c.H)}!`},{fx:'bubbles',mood:'🤣',say:['Hee hee!','嘻嘻!']}],
  ['🔎','Found a clue','找到線索',c=>`Along the way, ${c.H} found a clue: a glowing footprint pointing the way.`,c=>`路上,${c.H}找到一個線索:一個會發光的腳印指著方向。`,{prop:'👣',mood:'🤔',say:['A clue!','有線索!']}],
  ['🩹','A little hurt','受了點傷',c=>`${c.H} fell and scraped a knee. It hurt, but ${c.H} got back up.`,c=>`${c.H}跌倒擦傷了膝蓋。好痛,可是${c.H}又站了起來。`,{mood:'🥹',say:['I can do it!','我可以的!']}]];
// [emoji, name, nameZh, type, typeZh, role, move, say, sayZh]
const MEETS=[['🦉','Hoot','咕咕','wise owl','聰明的貓頭鷹','friend','fly','Hoo! I know a secret path!','咕咕!我知道一條祕密小路!'],['🐰','Bun','小白','bunny','小兔子','friend','bounce','Hop on! I’m super fast!','跳上來!我超快的!'],
  ['🧚','Pixie','小仙','fairy','小仙子','friend','fly','I have a little magic dust!','我有一點點魔法粉!'],['👻','Boo','啵啵','friendly ghost','友善的小幽靈','friend','fly','Boo! Don’t worry, I’m friendly!','啵!別怕,我很友善!'],
  ['👽','Zib','奇比','alien','外星人','friend','bounce','Zib zab! I come in peace!','奇比奇比!我是來交朋友的!'],['🐢','Shelly','慢慢','turtle','烏龜','friend','wander','Slow and steady!','慢慢來,比較快!'],
  ['🦊','Sly Fox','狡猾狐狸','sneaky fox','狐狸','villain','stay','Ha! You’ll never catch me!','哈!你抓不到我!'],['👹','Grumpy','山怪','grumpy troll','愛生氣的山怪','villain','stay','Nobody crosses MY bridge!','誰都不准過我的橋!'],
  ['🐲','Blaze','大火龍','big dragon','大火龍','villain','fly','ROAR! Go away!','吼!走開!'],['🙅','nobody','沒有人','','','none','']];
const TWISTS=[['💥','earthquake','地震','the ground began to shake','地面開始搖晃',{fx:'shake'}],['🆘','"Help!"','救命','a tiny voice cried, “Help me!”','一個小小的聲音喊:「救救我!」',{}],['✨','something glows','發光','something started to glow','有東西開始發光',{fx:'sparkle'}],
  ['🍬','candy snow','糖果雪','it started to snow candy','天上開始下糖果',{fx:'candy'}],['⛈️','storm','暴風雨','a wild storm rolled in','一場暴風雨來了',{fx:'storm'}],['🌈','rainbow','彩虹','a giant rainbow appeared','出現了一道超大的彩虹',{prop:'🌈',fx:'sparkle'}],
  ['🌙','night falls','天黑了','night fell and the stars came out','天黑了,星星都出來了',{fx:'stars'}],['🚪','magic door','魔法門','a magic door appeared','出現了一扇魔法門',{prop:'🚪'}],['❄️','snow','下雪','it began to snow','開始下雪了',{fx:'snow'}],['🫧','bubbles','泡泡','bubbles floated everywhere','到處都是泡泡',{fx:'bubbles'}]];
const CLIMAX=[['🤝','teamwork','團隊合作',c=>`${c.H} and ${c.F} worked together as a team`,c=>`${c.H}和${c.F}一起合作`,{villain:'run'}],
  ['💡','clever trick','聰明妙計',c=>`${c.H} thought of a super clever trick`,c=>`${c.H}想到了一個超聰明的妙計`,{villain:'run'}],
  ['💖','kindness','善良',c=>`${c.H} chose kindness instead of anger, and it turned out the trouble-maker was just lonely`,c=>`${c.H}選擇了善良,沒有生氣,原來搗蛋的人只是太寂寞了`,{villain:'friend'}],
  ['💪','courage','勇氣',c=>`${c.H} took a deep breath and stood tall`,c=>`${c.H}深深吸一口氣,勇敢地站了出來`,{villain:'run'}],
  ['✨','magic','魔法',c=>`${c.H} waved a magic spell, ZAP`,c=>`${c.H}揮了揮魔法,咻`,{villain:'run'}],
  ['😂','a big laugh','逗大家笑',c=>`${c.H} told the silliest joke ever, and everyone laughed`,c=>`${c.H}講了一個超好笑的笑話,大家都笑翻了`,{villain:'friend'}]];
const ENDINGS=[['🎉','big party','大派對',c=>`That night, everyone threw a giant party${c.wantEn?`, and ${c.H} finally got to ${c.wantEn}`:''}!`,c=>`那天晚上,大家開了一個超大派對${c.wantZh?`,${c.H}終於可以${c.wantZh}`:''}!`,{fx:'confetti'}],
  ['🏡','happy at home','開心回家',c=>`${c.H} went home tired but happy, ready for sweet dreams.`,c=>`${c.H}回到家,雖然好累,但是好開心,準備做個好夢。`,{bg:'home',fx:'stars'}],
  ['🤝','best friends','好朋友',c=>`${c.H} and ${c.F} became best friends forever.`,c=>`${c.H}和${c.F}變成了永遠的好朋友。`,{fx:'hearts'}],
  ['😲','surprise!','大驚喜','Then came the biggest surprise: a tiny baby dragon peeked out and said, “Hi!”','接著出現最大的驚喜:一隻小小的龍寶寶探出頭說:「嗨!」',{prop:'🐣',fx:'sparkle'}],
  ['😴','just a dream?','一場夢?',c=>`Then ${c.H} woke up… it was all a dream! Or was it?`,c=>`然後${c.H}醒來了……原來是一場夢!真的嗎?`,{fx:'stars'}],
  ['🗺️','new adventure','新冒險',c=>`But then ${c.H} spotted a strange new map… another adventure was waiting!`,c=>`可是這時,${c.H}看到一張奇怪的新地圖……新的冒險在等著呢!`,{prop:'🗺️'}]];
