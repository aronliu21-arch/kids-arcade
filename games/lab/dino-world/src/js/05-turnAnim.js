/* ---------- books 1–4 rewritten: Pip's journey to find Mommy, a different problem in every book ---------- */
Object.assign(CAST,{b1:{t:CH[0].baby.t,c:CH[0].baby.c,sz:1,em:'🍼',pitch:1.5,nm:['Baby Long Neck','腕龍寶寶']},b2:{t:CH[1].baby.t,c:CH[1].baby.c,sz:1,em:'🍼',pitch:1.55,nm:['Baby Ptero','翼龍寶寶']},b3:{t:CH[2].baby.t,c:CH[2].baby.c,sz:1,em:'🍼',pitch:1.5,nm:['Baby Ankylo','甲龍寶寶']}});
CH[1].title=['The First Flight','第一次飛'];
CAST.neckmom.nm=['Mama Lulu','露露媽媽'];CAST.ptmom.nm=['Mama Pia','皮亞媽媽'];CAST.ankmom.nm=['Mama Kiki','琪琪媽媽'];
CH[0].flow=[P('nar','Book 1: The Hungry Jungle.','第一本書:餓肚子的叢林。'),
 P('nar','Rumble, rumble! Last night the volcano shook, and a big wind blew through the jungle.','轟隆隆!昨天晚上火山搖晃,一陣大風吹過叢林。'),
 P('nar','In the morning, little Pip woke up all alone, next to his broken eggshell.','早上,小小的皮皮在自己破掉的蛋殼旁邊醒來,只有他一個。',V([['pip',.4,.55]],[['egg',.62,'open'],['bush',.88]])),
 P('pip','Mommy? Mommy, where are you?','媽媽?媽媽,你在哪裡?',V([['pip',.4,.55]],[['egg',.62,'open'],['bush',.88]])),
 P('neckmom','Hello, little one. I’m Mama Lulu. Are you lost?','你好,小寶貝。我是露露媽媽。你迷路了嗎?',V([['pip',.25,.55],['neckmom',.62,1,1]])),
 P('pip','I can’t find my mommy. And my tummy is rumbling.','我找不到我的媽媽。而且我的肚子咕嚕咕嚕叫。'),
 P('neckmom','The wind blew all the fruit off the trees. Now every jungle dino is hungry.','大風把樹上的水果都吹掉了。現在叢林裡每隻恐龍都餓了。'),
 P('neckmom','Let’s pick up the fruit and share it, so everyone gets enough.','我們把水果撿起來分給大家,讓每個人都吃得到。'),['g','fruit'],
 P('nar','Munch, munch! But Mama Lulu’s own baby won’t eat a single bite.','嚼嚼嚼!可是露露媽媽自己的寶寶,一口都不吃。',V([['pip',.18,.55],['b1',.42,.5],['neckmom',.72,1,1]])),
 P('b1','I only want starfruit. The sweet yellow one at the top of the Star Tree!','我只想吃楊桃。星星樹最上面,那種甜甜的黃色楊桃!',V([['pip',.18,.55],['b1',.42,.5],['neckmom',.72,1,1]])),
 P('pip','I’ll help you get one! Where is the Star Tree?','我幫你拿!星星樹在哪裡?'),
 P('nar','The jungle signs show the way. Read them, Milo!','叢林的牌子會指路。洛明,讀讀看!'),['g','mail'],
 P('nar','The signs point into a twisty grass maze.','牌子指向一個彎彎曲曲的草叢迷宮。'),['g','maze'],
 P('nar','There it is, the Star Tree! But the starfruit is way, way up high.','找到了,星星樹!可是楊桃在好高好高的地方。',V([['pip',.15,.55],['neckmom',.4,1]],[['tree',.8]])),
 P('neckmom','Ouch. The wind hurt my neck last night. I can’t stretch up today.','哎喲。昨晚的大風弄痛了我的脖子,今天沒辦法伸長。'),
 P('pip','A T-Rex is super strong. One big stomp could shake the whole tree!','暴龍超級有力氣。用力一踩,就能把整棵樹搖一搖!'),
 P('nar','Let’s build a T-Rex!','我們來蓋一隻暴龍!'),['b'],['f']];
CH[0].finale=[['nar','STOMP! {N} the T-Rex stomps, and the Star Tree shakes.','碰!暴龍{N}用力一踩,星星樹搖呀搖。',V([['pip',.1,.55],['neckmom',.3,1],['goal',.56,.9]],[['tree',.84]])],
 ['nar','Plop, plop, plop! Starfruit falls down like little yellow stars.','咚、咚、咚!楊桃像小小的黃色星星一樣掉下來。',V([['pip',.1,.55],['neckmom',.3,1],['goal',.56,.9],['baby',.78,.5,1]],[['tree',.9]],{hearts:1})],
 ['baby','Yum! Pip, you have one too. Sharing makes it yummier!','好吃!皮皮,你也吃一個。一起吃比較好吃!',V([['pip',.3,.55],['baby',.52,.5,1],['neckmom',.8,1,1]])],
 ['neckmom','Pip, last night I saw a big Tricera walking to the beach. Maybe she is looking for you!','皮皮,我昨天晚上看到一隻大三角龍往海灘走。也許她在找你!',V([['pip',.3,.55],['baby',.52,.5,1],['neckmom',.8,1,1]])],
 ['pip','My mommy is looking for me! Let’s go to the beach!','我的媽媽在找我!我們去海灘!'],
 ['nar','The End. When we share, there is enough for everyone.','完。大家一起分享,每個人就都夠。']];
CH[1].flow=[P('nar','Book 2: The First Flight.','第二本書:第一次飛。'),
 P('nar','At the sunny beach, the waves go swish, swish.','陽光海灘上,海浪刷、刷地響。'),
 P('pip','Hello! Have you seen a big Tricera? She is my mommy.','哈囉!你有看到一隻大三角龍嗎?她是我的媽媽。',V([['pip',.25,.55],['ptmom',.62,.8,1]])),
 P('ptmom','I’m Mama Pia. I saw big footprints near the tide pools. But… can you help my baby first?','我是皮亞媽媽。我在潮池旁邊看到大大的腳印。可是……你可以先幫幫我的寶寶嗎?'),
 P('ptmom','Today is Flying Day. All the baby Pteros fly for the first time. But my baby is afraid.','今天是學飛日,所有翼龍寶寶都要第一次飛。可是我的寶寶好害怕。'),
 P('b2','What if I fall? I’m too small.','如果我掉下去怎麼辦?我太小了。',V([['pip',.25,.55],['b2',.5,.5],['ptmom',.8,.8,1]])),
 P('pip','I can’t fly at all! But I can help you practice.','我完全不會飛!可是我可以陪你練習。'),
 P('nar','Practice step one: measure and compare, like a pilot checking the wings!','練習第一步:量一量、比一比,像飛行員檢查翅膀一樣!'),['g','eggs'],
 P('nar','Step two: hop, hop, hop across the stones to make strong legs for take-off!','第二步:跳、跳、跳過石頭,讓起飛的腳變得有力!'),['g','lava'],
 P('b2','I did it! But… I’m still scared to jump off the high cliff.','我做到了!可是……我還是不敢從高高的懸崖跳下去。'),
 P('pip','Look, Milo! Letters in the sand, right next to the big footprints!','洛明你看!大腳印旁邊的沙子裡有字母!'),['g','fossil'],
 P('ptmom','Someone wrote that with a big toe… and the footprints go up to Snow Mountain!','有人用大腳趾寫的……腳印往雪山去了!'),
 P('pip','My mommy! But first, I promised to help my friend fly.','是我媽媽!可是我先答應要幫朋友學飛。'),
 P('ptmom','The cliff is too high for a first try. A Stego’s back plates are like little stairs!','懸崖太高了,不適合第一次試。劍龍背上的骨板,就像小小的樓梯!'),
 P('nar','Let’s build a Stego!','我們來蓋一隻劍龍!'),['b'],['f']];
CH[1].finale=[['nar','{N} the Stego lies down low, and the baby climbs up the plates, one step at a time.','劍龍{N}趴得低低的,寶寶一階一階爬上骨板。',V([['pip',.12,.55],['ptmom',.3,.8],['goal',.6,.9],['baby',.62,.5]])],
 ['baby','One… two… three… Flap, flap, flap!','一……二……三……拍、拍、拍!',V([['pip',.12,.55],['goal',.5,.9],['baby',.72,.5,1]])],
 ['nar','The baby flies! Just a little, then a little more, over the sparkly waves!','寶寶飛起來了!先飛一點點,再飛多一點點,飛過亮晶晶的海浪!',V([['pip',.12,.55],['goal',.36,.9],['ptmom',.62,.8,1],['baby',.84,.5,1]],[],{hearts:1})],
 ['ptmom','You were scared, and you tried anyway. I am so proud of you!','你很害怕,可是你還是試了。我好為你驕傲!'],
 ['pip','Thank you, {N}! Now I’m off to Snow Mountain to find my mommy!','謝謝你,{N}!現在我要去雪山找媽媽了!'],
 ['nar','The End. Big things start with small steps. Try, and try again.','完。大事情都從小小的一步開始。試試看,再試一次。']];
CH[2].flow=[P('nar','Book 3: The Snowy Echo Cave.','第三本書:雪山回音洞。'),
 P('nar','Pip followed the big footprints up Snow Mountain. Crunch, crunch… brrr!','皮皮跟著大腳印爬上雪山。喀滋、喀滋……好冷!'),
 P('nar','Then the wind blew, and fresh snow covered every footprint. They were gone.','然後風一吹,新的雪蓋住了每一個腳印。腳印不見了。',V([['pip',.3,.55]],[['snow',.78]])),
 P('pip','Oh no… now how will I find Mommy?','糟糕……現在要怎麼找到媽媽?'),
 P('ankmom','Hello! I’m Mama Kiki. You look cold, little one. Come into our cave.','哈囉!我是琪琪媽媽。小寶貝,你看起來好冷。來我們的山洞裡。',V([['pip',.25,.55],['ankmom',.65,.9,1]])),
 P('ankmom','This is the Echo Cave. When you call into it, the mountain calls back!','這是回音洞。你對它喊,山就會回答你!'),
 P('nar','The cave door is made of ice crystals. Finish the pattern to open it!','山洞的門是冰晶做的。把規律完成,門就會打開!'),['g','pattern'],
 P('nar','Inside, the cave plays sounds back. Listen and match them, Milo!','山洞裡會傳回聲音。洛明,聽一聽,配一配!'),['g','zhuyin'],
 P('pip','Hello? Mommy? …Mommy… mommy… mommy…','哈囉?媽媽?……媽媽……媽媽……媽媽……'),
 P('nar','Then, far away, a voice answered: Pip… Pip… Pip…','然後,遠遠的地方,有一個聲音回答:皮皮……皮皮……皮皮……'),
 P('pip','That’s my mommy’s voice! She’s at the volcano!','那是我媽媽的聲音!她在火山那邊!'),
 P('ankmom','The cave tunnel goes all the way to the volcano. But my little ones caught a cold in the storm.','山洞的隧道一路通到火山。可是我的小寶貝們在暴風雪裡感冒了。',V([['pip',.18,.55],['b3',.42,.5],['ankmom',.72,.9,1]])),
 P('pip','Mommy can wait a little longer. Let’s take care of the babies first.','媽媽可以再等一下。我們先照顧寶寶。'),['g','care'],
 P('nar','The babies are warm and cozy now. But a wall of ice blocks the tunnel.','寶寶們現在暖暖的、好舒服。可是一道冰牆擋住了隧道。',V([['pip',.15,.55],['ankmom',.38,.9]],[['snow',.82,'hide']])),
 P('ankmom','An Ankylo’s club tail can break ice. Bonk!','甲龍的棒子尾巴可以打破冰塊。咚!'),
 P('nar','Let’s build an Ankylo!','我們來蓋一隻甲龍!'),['b'],['f']];
CH[2].finale=[['nar','{N} the Ankylo swings its club tail. Bonk! Bonk! CRACK!','甲龍{N}甩一甩棒子尾巴。咚!咚!喀啦!',V([['pip',.1,.55],['ankmom',.3,.9],['goal',.58,.9]],[['snow',.84,'hide']])],
 ['nar','The ice breaks open, and a little Ankylo hops out to say hello!','冰牆裂開了,一隻小甲龍跳出來打招呼!',V([['pip',.1,.55],['ankmom',.3,.9],['goal',.58,.9],['baby',.84,.5,1]],[['snow',.95,'open']])],
 ['baby','Pip, you took care of me. Thank you! I feel all better.','皮皮,你照顧了我。謝謝你!我全好了。',V([['pip',.3,.55],['baby',.52,.5,1],['ankmom',.8,.9,1]],[],{hearts:1})],
 ['ankmom','Pip, follow this tunnel. It will take you to your mommy.','皮皮,跟著這條隧道走,它會帶你找到媽媽。'],
 ['pip','Mommy, I’m coming!','媽媽,我來了!'],
 ['nar','The End. When we take care of others, we are never alone.','完。當我們照顧別人,我們就不會孤單。']];
CH[3].flow=[P('nar','Book 4: Pip Finds Mommy.','第四本書:皮皮找媽媽。'),
 P('nar','The tunnel came out at the volcano. It was hot and smoky, and the ground went rumble, rumble.','隧道的出口在火山。那裡又熱又多煙,地面轟隆轟隆。',V([['pip',.35,.55]],[['rocks',.8,'peek']])),
 P('pip','I’m a little scared. But Mommy is here somewhere.','我有一點害怕。可是媽媽就在這裡的某個地方。'),
 P('nar','On a rock, Pip found a big leaf with a message scratched on it.','在一塊石頭上,皮皮發現一片大葉子,上面刻著字。'),
 P('pip','It’s from Mommy! Milo, can you read it?','是媽媽寫的!洛明,你可以讀讀看嗎?'),['g','mail'],
 P('nar','The leaf says: Pip, I am looking for you. Wait by the big rocks. I love you.','葉子上寫著:皮皮,我在找你。在大石頭旁邊等我。我愛你。'),
 P('pip','She’s looking for me too! I have to get to the big rocks!','她也在找我!我一定要到大石頭那邊!'),
 P('nar','Hot lava bubbles between the stones. Hop carefully, Pip!','石頭之間有熱熱的岩漿在冒泡。皮皮,小心跳!'),['g','lava'],
 P('nar','Smoke fills the caves. Which way is out?','煙充滿了山洞。哪一條路才能出去?'),['g','maze'],
 P('pip','Here are the big rocks! Mommy? MOMMY!','大石頭到了!媽媽?媽媽!',V([['pip',.3,.55]],[['rocks',.76,'hide']])),
 P('nar','No answer. The rocks are too tall, and Pip can’t see over them.','沒有回答。石頭太高了,皮皮看不到後面。'),
 P('pip','I’m too small… I wish I were taller.','我太小了……真希望我長得高一點。'),
 P('nar','You don’t have to be tall, Pip. You have friends! A Long Neck can see over anything.','皮皮,你不用長得很高。你有朋友!腕龍什麼都看得到。'),
 P('nar','Let’s build a Long Neck!','我們來蓋一隻腕龍!'),['b'],['f']];
CH[3].finale=[['nar','{N} the Long Neck stretches up, up, up to look over the big rocks…','腕龍{N}把脖子伸高、伸高、再伸高,看看大石頭後面……',{items:[['pip',.12,.55],['goal',.42,1.1]],prop:['rocks',.76,'hide']}],
 ['nar','…and sees a big Tricera, sitting very still, holding a tiny piece of eggshell.','……看到一隻大三角龍,靜靜地坐著,手裡拿著一小片蛋殼。',{items:[['pip',.12,.55],['goal',.4,1.1],['mom',.76,1.15,1]],prop:['rocks',.76,'peek']}],
 ['mom','Pip? PIP! My baby! I looked everywhere for you!','皮皮?皮皮!我的寶寶!我到處找你!',{items:[['goal',.2,1.1],['pip',.45,.55],['mom',.7,1.15,1]],hearts:1}],
 ['pip','Mommy! I helped so many friends on the way. And Milo helped me!','媽媽!我一路上幫了好多朋友。洛明也幫了我!',{items:[['goal',.2,1.1],['pip',.45,.55],['mom',.7,1.15,1]]}],
 ['mom','You grew so brave, my little one. Let’s go home together.','我的小寶貝,你變得好勇敢。我們一起回家吧。',{items:[['goal',.2,1.1],['pip',.45,.55],['mom',.7,1.15,1]],hearts:1}],
 ['nar','The volcano grew calm. Pip and Mommy were together again. You did it, Dino Ranger!','火山安靜下來了。皮皮和媽媽又在一起了。恐龍巡守員,你做到了!',{items:[['goal',.2,1.1],['pip',.45,.55],['mom',.7,1.15,1]]}],
 ['nar','The End. No matter how far apart, families keep looking for each other.','完。不管離得多遠,家人都會一直找彼此。']];
// a story page: picture on one page, words on the other; ▶ turns the page, ◀ goes back, swipe works too
function turnAnim(el){if(REDUCED)return;el.classList.remove('turn');void el.offsetWidth;el.classList.add('turn');}
let pageTok=0,readTimer=null;
function scene(area,cast,lines,done,head){musicOff();let i=-1;const prevSolve=SOLVE;show('page');$('pgHead').innerHTML=(head||'').replace(/<rt>[^<]*<\/rt>/g,'');
 const draw=(spk,view)=>{const r={width:$('pgArt').clientWidth,height:$('pgArt').clientHeight};const W=Math.max(300,r.width),H=Math.max(180,r.height);TAGS=[];TAGW=W;let o=areaArt(area,W,H);
  if(view)o+=viewSVG(view,spk,W,H);else{const list=cast.filter(k=>CAST[k]&&CAST[k].t);const base=Math.min(H*.62,W/(list.length+.6)*.9);
   list.forEach((k,j)=>{const c=CAST[k];const sz=base*c.sz/100;const x=W*(j+1)/(list.length+1)-50*sz,y=H*.9-80*sz;const flip=x>W/2&&k!=='pip';
    o+=`<g transform="translate(${flip?x+100*sz:x},${y}) scale(${flip?-sz:sz},${sz})"><g class="${k===spk?'talk':''}">${dinoSVG(c.t,c.c)}</g></g>`+nameTagSVG(k,x+50*sz,Math.min(H-30,H*.9-2));});}
  $('pgArt').innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${o}</svg>`;};
 const go=d=>{if(i+d<0)return;i+=d;if(i>=lines.length){SOLVE=prevSolve;done&&done();return;}const [who,en,z,view]=lines[i];turnAnim($('pgSpread'));draw(who,view);
  const c=CAST[who];$('pgWho').innerHTML=c&&c.nm?`${c.em} ${biPlain(c.nm[0],c.nm[1])}`:'';$('pgLine').innerHTML=biPlain(en,z);$('pgNum').textContent=`${i+1} / ${lines.length}`;
  $('pgPrev').style.visibility=i?'visible':'hidden';const tok=++pageTok;clearTimeout(readTimer);
  say(en,z,null,c&&c.pitch,()=>{if(S.autoRead!==false&&tok===pageTok&&SCREEN==='page')readTimer=setTimeout(()=>{if(tok===pageTok&&SCREEN==='page'){SFX.page();go(1);}},1400);});};
 $('pgAuto').textContent=S.autoRead!==false?'🔊 Read to me ✓':'🔊 Read to me';$('pgAuto').classList.toggle('on',S.autoRead!==false);
 $('pgAuto').onclick=()=>{S.autoRead=S.autoRead===false;save();$('pgAuto').textContent=S.autoRead?'🔊 Read to me ✓':'🔊 Read to me';$('pgAuto').classList.toggle('on',S.autoRead);if(S.autoRead){pageTok++;const t=pageTok;readTimer=setTimeout(()=>{if(t===pageTok&&SCREEN==='page'){SFX.page();go(1);}},1500);}else{pageTok++;clearTimeout(readTimer);}};
 $('pgNext').onclick=()=>{pageTok++;SFX.page();go(1);};$('pgPrev').onclick=()=>{pageTok++;SFX.page();go(-1);};
 let sx=null;$('pgSpread').onpointerdown=e=>{sx=e.clientX;};$('pgSpread').onpointerup=e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>60){SFX.page();go(dx<0?1:-1);}};
 SOLVE=()=>$('pgNext').click();go(1);}

