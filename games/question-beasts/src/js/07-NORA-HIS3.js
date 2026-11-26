const NORA_HIS3=[
 ['nh11','In what year did Christopher Columbus first sail to the Americas?','1492','1776','1969','“In 1492, Columbus sailed the ocean blue.”'],['nh12','In what year was the U.S. Declaration of Independence signed?','1776','1492','1865','July 4, 1776 — that is why the U.S. celebrates on the 4th of July.'],
 ['nh13','Who flew the first powered airplane in 1903?','The Wright brothers','Amelia Earhart','Charles Lindbergh','Orville and Wilbur Wright flew at Kitty Hawk, North Carolina.'],['nh14','Which president led the United States during the Civil War?','Abraham Lincoln','George Washington','Thomas Jefferson','Abraham Lincoln was the 16th president.'],
 ['nh15','Who gave the famous “I Have a Dream” speech?','Martin Luther King Jr.','Abraham Lincoln','George Washington','Dr. King gave the speech in 1963, asking for equal rights for everyone.'],['nh16','Who was the first woman to win a Nobel Prize?','Marie Curie','Amelia Earhart','Rosa Parks','Marie Curie won for her work on radioactivity, and later won a second one.'],
 ['nh17','Where did the Vikings come from?','Northern Europe','South America','Africa','Vikings came from Norway, Sweden and Denmark.'],['nh18','Who is famous for writing plays like Romeo and Juliet?','William Shakespeare','Charles Dickens','Mark Twain','Shakespeare wrote in England about 400 years ago.']];
G('nora','history',1,bank(NORA_HIS1));G('nora','history',2,bank(NORA_HIS2));G('nora','history',3,bank(NORA_HIS3));
const NORA_BANKS=[NORA_KANGAROO,NORA_ZY,NORA_PARTS,NORA_MW,NORA_SCI1,NORA_SCI2,NORA_SCI3,NORA_HIS1,NORA_HIS2,NORA_HIS3];

/* topic of each stage (6 enemies) — endless mixes everything */
const STAGE_TOPICS={
  milo:[['colors','math'],['letters'],['shapes'],['words'],['math','colors'],['letters','math','words','shapes','colors']],
  lucas:[['addsub'],['reading'],['zhuyin'],['time'],['logic'],['addsub','reading','zhuyin','time','logic']],
  nora:[['muldiv'],['chinese'],['science'],['numbers'],['history'],['kangaroo']]
};
const TOPIC_NAME={colors:'COLORS',math:'NUMBERS',letters:'LETTERS',shapes:'SHAPES',words:'WORDS',addsub:'ADD & SUBTRACT',reading:'READING',zhuyin:'注音 LISTENING',time:'TIME & MONEY',logic:'PUZZLES',muldiv:'× AND ÷',chinese:'中文',science:'SCIENCE',numbers:'NUMBERS & FRACTIONS',history:'HISTORY & WORLD',kangaroo:'KANGAROO PUZZLES'};
function avoidSet(kid){return new Set(Save.kid(kid).seen)}
function nextQuestion(kid,tier,topics,chap,src){const avoid=avoidSet(kid),P=POOLS[src||kid];topics=topics||[...new Set(P.map(g=>g.topic))];
  const tryList=list=>{for(let i=0;i<70;i++){const g=pick(list);const q=g.fn(avoid);if(q&&!avoid.has(q.id)){q.topic=g.topic;q.tier=g.tier;return q}}return null};
  chap=chap||topics;const steps=[g=>topics.includes(g.topic)&&g.tier===tier,g=>topics.includes(g.topic)&&Math.abs(g.tier-tier)===1,g=>topics.includes(g.topic),g=>chap.includes(g.topic)&&g.tier===tier,g=>chap.includes(g.topic),g=>g.tier===tier,()=>true];
  for(const f of steps){const l=P.filter(f);if(l.length){const q=tryList(l);if(q)return q}}
  for(let i=0;i<80;i++){const g=pick(P.filter(g=>g.tier===tier));const q=g.fn(new Set());if(q)return q}}
function markSeen(kid,id){const k=Save.kid(kid);if(!k.seen.includes(id))k.seen.push(id);if(!KIDS[kid].noRepeat&&k.seen.length>60)k.seen=k.seen.slice(-60)}
function bankLeft(kid,list){const s=avoidSet(kid);return list.filter(b=>!s.has(b[0])).length}
/* ===== 100 new hand-written questions per kid (v5) ===== */
/* ---------- MILO ---------- */
const MILO_ANIMALS=[
 ['ma1','Which animal says “moo”?','🐮','🐶','🐱','Cows say moo.'],['ma2','Which animal says “woof”?','🐶','🐮','🐷','Dogs say woof.'],['ma3','Which animal says “meow”?','🐱','🦆','🐴','Cats say meow.'],
 ['ma4','Which animal says “oink”?','🐷','🐱','🐑','Pigs say oink.'],['ma5','Which animal says “quack”?','🦆','🐶','🐮','Ducks say quack.'],['ma6','Which animal says “baa”?','🐑','🐷','🐸','Sheep say baa.'],
 ['ma7','Which animal says “neigh”?','🐴','🦆','🐱','Horses say neigh.'],['ma8','Which animal says “roar”?','🦁','🐑','🐔','Lions say roar.'],['ma9','Which animal says “hiss”?','🐍','🐮','🐶','Snakes say hiss.'],
 ['ma10','Which animal says “buzz”?','🐝','🐷','🦁','Bees say buzz.'],['ma11','Which animal says “ribbit”?','🐸','🐴','🐝','Frogs say ribbit.'],['ma12','Which animal says “cock-a-doodle-doo”?','🐓','🦆','🐑','Roosters say cock-a-doodle-doo.'],
 ['ma13','Which animal says “hoot”?','🦉','🐸','🐮','Owls say hoot.'],
 ['ma14','Which animal lives in water?','🐟','🐶','🐦','Fish live in water and swim with fins.'],['ma15','Which animal can fly?','🐦','🐢','🐘','Birds have wings to fly.'],['ma16','Which animal has a very long neck?','🦒','🐷','🐭','Giraffes have long necks to reach tall trees.'],
 ['ma17','Which animal has black and white stripes?','🦓','🐘','🐑','Zebras have stripes.'],['ma18','Which animal is the biggest?','🐘','🐭','🐱','Elephants are huge!'],['ma19','Which animal is the smallest?','🐜','🐘','🐴','An ant is tiny.'],
 ['ma20','Which animal hops?','🐰','🐌','🐟','Bunnies hop on strong back legs.'],['ma21','Which animal is very slow?','🐌','🐆','🐇','Snails move very slowly.'],['ma22','Which animal has a hard shell?','🐢','🐶','🐦','Turtles carry a shell on their back.'],
 ['ma23','Which animal gives us milk?','🐮','🐔','🐟','Cows give us milk.'],['ma24','Which animal lays eggs that we eat?','🐔','🐮','🐷','Chickens lay eggs.'],
 ['ma25','Which one is a dinosaur?','🦖','🐘','🐄','T. rex was a dinosaur!'],['ma26','Which dinosaur has a long neck?','🦕','🦖','🐢','Long-neck dinosaurs ate leaves from tall trees.'],
 ['ma27','Baby dinosaurs came out of…','🥚','🍎','🌳','Baby dinosaurs hatched from eggs.'],['ma28','Which animal has 8 legs?','🕷️','🐜','🐦','Spiders have 8 legs.']];
const MILO_BODY=[
 ['mbd1','What do you use to see?','👀','👂','👃','You see with your eyes.'],['mbd2','What do you use to hear?','👂','👀','👅','You hear with your ears.'],['mbd3','What do you use to smell?','👃','✋','👂','You smell with your nose.'],
 ['mbd4','What do you use to taste?','👅','👃','🦶','You taste with your tongue.'],['mbd5','What do you use to walk?','🦶','👂','👀','You walk with your feet.'],['mbd6','What do you use to clap?','👏','🦶','👃','You clap with your hands.'],
 ['mbd7','What do you brush every morning and night?','🦷','👂','🦶','Brush your teeth to keep them strong.'],
 ['mbd8','How many fingers are on one hand?','5','4','10','Count them: 1, 2, 3, 4, 5.'],['mbd9','How many eyes do you have?','2','1','3','You have 2 eyes.'],
 ['mbd10','How many noses do you have?','1','2','3','You have 1 nose.'],['mbd11','How many ears do you have?','2','4','1','One on each side: 2 ears.']];
const MILO_THINGS=[
 ['mth1','Which one is a fruit?','🍎','🚗','👟','An apple is a fruit.'],['mth2','Which one can you eat?','🍌','🧱','👟','You can eat a banana.'],['mth3','Which one do you wear on your feet?','👟','🍕','🚗','Shoes go on your feet.'],
 ['mth4','Which one goes “vroom”?','🚗','🐟','🍎','Cars go vroom!'],['mth5','What do you need when it rains?','☂️','🕶️','🍦','An umbrella keeps you dry.'],['mth6','What do you use to brush your teeth?','🪥','🍴','✏️','A toothbrush!'],
 ['mth7','Where do you sleep?','🛏️','🛁','🚗','You sleep in a bed.'],['mth8','Which one is a vegetable?','🥕','🍰','🍬','A carrot is a vegetable.'],['mth9','What do you wear on your head?','🧢','🧦','👟','A hat goes on your head.'],
 ['mth10','What helps you see in the dark?','🔦','🧸','🍎','A flashlight makes light.'],['mth11','Which one flies in the sky?','✈️','🚗','🚲','Airplanes fly.'],['mth12','Which one floats on water?','⛵','🚗','🚂','Boats float on water.']];
const MILO_NATURE=[
 ['mnt1','What do you see in the sky at night?','🌙','🌞','🌈','The moon comes out at night.'],['mnt2','What gives us light in the day?','🌞','🌙','⭐','The sun shines in the day.'],
 ['mnt3','What falls from rain clouds?','💧','🍎','⭐','Raindrops fall from clouds.'],['mnt4','What can you build from snow?','⛄','🏖️','🌵','You can build a snowman.'],
 ['mnt5','What grows on apple trees?','🍎','🐟','🚗','Apples grow on trees.'],['mnt6','Which one is cold and falls in winter?','❄️','🌸','🏖️','Snow is cold and falls in winter.'],
 ['mnt7','What do plants need to grow?','💧','🍕','🧸','Plants need water and sun.'],['mnt8','Where do fish live?','🌊','🌳','🏜️','Fish live in water.'],['mnt9','What can you see after rain and sun?','🌈','🌙','⛄','A rainbow!']];
const MILO_OPP=[
 ['mop1','Which one is HOT?','🔥','🧊','⛄','Fire is hot.'],['mop2','Which one is COLD?','🧊','🔥','🌞','Ice is cold.'],['mop3','Which one is FAST?','🚀','🐌','🐢','Rockets are super fast.'],
 ['mop4','Which one is BIG?','🐘','🐭','🐜','An elephant is big.'],['mop5','Which one is SMALL?','🐭','🐘','🦒','A mouse is small.'],['mop6','Which one is WET?','💧','🔥','🧱','Water is wet.'],
 ['mop7','Which face is HAPPY?','😀','😢','😠','A smile means happy.'],['mop8','Which face is SAD?','😢','😀','😂','Tears mean sad.'],
 ['mop9','What is the opposite of “up”?','down','big','hot','Up and down are opposites.'],['mop10','What is the opposite of “hot”?','cold','sun','big','Hot and cold are opposites.'],
 ['mop11','What is the opposite of “big”?','small','tall','red','Big and small are opposites.'],['mop12','What is the opposite of “day”?','night','sun','play','Day and night are opposites.'],
 ['mop13','What is the opposite of “in”?','out','on','it','In and out are opposites.'],['mop14','What is the opposite of “yes”?','no','go','so','Yes and no are opposites.'],
 ['mop15','What is the opposite of “on”?','off','in','up','On and off are opposites.'],['mop16','What is the opposite of “fast”?','slow','fun','fat','Fast and slow are opposites.']];
const MILO_PAT=[
 ['mpa1','What comes next? 🔴 🔵 🔴 🔵 🔴 …','🔵','🔴','🟢','Red, blue, red, blue… blue is next.'],['mpa2','What comes next? 🐶 🐱 🐶 🐱 🐶 …','🐱','🐶','🐭','Dog, cat, dog, cat… cat is next.'],
 ['mpa3','What comes next? ⭐ ⭐ 🌙 ⭐ ⭐ …','🌙','⭐','🌞','Star, star, moon… moon is next.'],['mpa4','What comes next? 🍎 🍌 🍎 🍌 …','🍎','🍌','🍇','Apple, banana… apple is next.'],
 ['mpa5','What comes next? 🟦 🟨 🟦 🟨 🟦 …','🟨','🟦','🟥','Blue, yellow… yellow is next.'],['mpa6','What comes next? 🦖 🦕 🦖 🦕 …','🦖','🦕','🐢','T. rex, long-neck… T. rex is next.'],
 ['mpa7','What comes next? 1 2 1 2 1 …','2','1','3','1, 2, 1, 2… 2 is next.'],['mpa8','What comes next? A B A B A …','B','A','C','A, B, A, B… B is next.'],
 ['mpa9','What comes next? 🔺 🔺 🟢 🔺 🔺 …','🟢','🔺','🟦','Two triangles, then a circle.'],['mpa10','What comes next? 1 2 3 1 2 …','3','1','4','1, 2, 3 repeats… 3 is next.']];
const MILO_NUM2=[
 ['mnu1','How many wheels does a bike have?','2','3','4','A bike has 2 wheels.'],['mnu2','How many wheels does a car have?','4','2','3','A car has 4 wheels.'],
 ['mnu3','Which number comes after 4?','5','3','6','1, 2, 3, 4, 5!'],['mnu4','Which number comes before 3?','2','4','1','1, 2, 3 — 2 comes before 3.'],
 ['mnu5','How many legs does a bird have?','2','4','6','Birds stand on 2 legs.'],['mnu6','How many legs does a cat have?','4','2','3','Cats walk on 4 legs.'],
 ['mnu7','Which has MORE cookies?','🍪🍪🍪🍪','🍪🍪','🍪','4 cookies is more than 2 or 1.'],['mnu8','Which has FEWER apples?','🍎','🍎🍎🍎','🍎🍎','1 apple is the fewest.'],
 ['mnu9','Which number comes after 9?','10','8','11','… 8, 9, 10!'],['mnu10','You have 2 hands. How many hands do 2 people have?','4','2','3','2 + 2 = 4.'],
 ['mnu11','Which number is the smallest?','1','5','9','1 is the smallest.'],['mnu12','How many sides does a triangle have?','3','4','5','A triangle has 3 sides.']];
const MILO_COL2=[
 ['mcl1','What color is a fire truck?','red','blue','green','Fire trucks are red.'],['mcl2','What color is grass?','green','purple','orange','Grass is green.'],
 ['mcl3','What color are clouds?','white','green','orange','Clouds are white.'],['mcl4','What color is a lemon?','yellow','blue','purple','Lemons are yellow.'],
 ['mcl5','What color is the night sky?','black','yellow','pink','The night sky is dark black.'],['mcl6','What color is a pumpkin?','orange','blue','pink','Pumpkins are orange.'],
 ['mcl7','What color is a flamingo?','pink','green','blue','Flamingos are pink.'],['mcl8','What color is chocolate?','brown','green','white','Chocolate is brown.'],
 ['mcl9','What color is the sky on a sunny day?','blue','red','brown','A sunny sky is blue.'],['mcl10','What color is a tomato?','red','blue','purple','Tomatoes are red.']];

