const MAGS=[
 ['The Big Puddle','After the rain, Max saw a big puddle. He put on his red rain boots and jumped in. Splash! The water went everywhere, but his feet stayed dry.',
  [['What did Max put on?',['Red rain boots','A blue hat','Sandals','A raincoat'],'Max put on his red rain boots.'],
   ['Why did his feet stay dry?',['He wore rain boots','The puddle was empty','He jumped over it','It was sunny'],'Rain boots keep water out.'],
   ['What sound did the puddle make?',['Splash!','Boom!','Moo!','Tick tock!'],'The story says “Splash!”']]],
 ['Sam’s Soccer Socks','Sam has lucky soccer socks with green stripes. One day he could not find them. He looked under his bed and in his bag. At last he found them on the dog! The dog was using them as a toy.',
  [['What is special about Sam’s socks?',['They are lucky and have green stripes','They are new and red','They are too big','They glow'],'They are his lucky socks with green stripes.'],
   ['Where did Sam find the socks?',['On the dog','Under his bed','In his bag','At school'],'He looked under his bed and in his bag first, then found them on the dog.'],
   ['How do you think Sam felt when he found them?',['Happy and surprised','Angry at his bed','Sleepy','Scared of socks'],'He found his lucky socks somewhere funny!']]],
 ['The Snowman’s Scarf','Ben built a snowman in the yard. It looked cold, so Ben gave it his old orange scarf. The next morning, the snowman was gone. Only the scarf was left on the grass, because the sun came out.',
  [['Why did Ben give the snowman a scarf?',['It looked cold','It asked for one','Ben was too hot','The scarf was new'],'The story says it looked cold.'],
   ['What happened to the snowman?',['It melted','It walked away','A dog ate it','It got bigger'],'The sun came out and the snow melted.'],
   ['What was left on the grass?',['The orange scarf','A carrot','A hat','A shoe'],'Only the scarf was left.']]],
 ['Helping Hands','Leo dropped his crayons all over the floor. His friend Kai bent down and helped him pick them up. “Thank you!” said Leo. The next day, Leo helped Kai carry his heavy bag.',
  [['Who helped Leo pick up the crayons?',['Kai','His teacher','His mom','Nobody'],'His friend Kai helped him.'],
   ['What did Leo do the next day?',['Helped Kai carry his bag','Dropped his crayons again','Went home','Bought new crayons'],'He helped Kai carry his heavy bag.'],
   ['What is this story about?',['Friends helping each other','How to draw','Heavy bags','Losing crayons forever'],'Kai helps Leo, then Leo helps Kai.']]],
 ['Why Leaves Change','In the fall, many leaves turn red, orange and yellow. The trees stop making green color. Then the leaves fall down. Kids love to jump in the leaf piles!',
  [['What colors do leaves turn in the fall?',['Red, orange and yellow','Blue and purple','Black and white','Pink only'],'The article lists red, orange and yellow.'],
   ['What happens after the leaves change color?',['They fall down','They turn blue','They grow bigger','They sing'],'Then the leaves fall down.'],
   ['What do kids love to do?',['Jump in leaf piles','Eat leaves','Paint trees','Climb clouds'],'The last sentence says so.']]],
 ['The Costume Box','Grandpa has a big box of old costumes. Today Noah picked a pirate hat and a cape. His sister picked a crown. They put on a show for the whole family, and everyone clapped.',
  [['What did Noah pick from the box?',['A pirate hat and a cape','A crown','A dress','Boots'],'Noah picked a pirate hat and a cape.'],
   ['Who owns the costume box?',['Grandpa','Noah','The teacher','A store'],'Grandpa has a big box of old costumes.'],
   ['What did the family do at the end?',['Clapped','Went to sleep','Cried','Ate cake'],'Everyone clapped.']]],
 ['Animals in Coats','Many animals have their own coats. A polar bear has thick white fur to stay warm in the snow. A duck has oily feathers so water rolls off. A turtle wears a hard shell like armor.',
  [['Why does a polar bear have thick fur?',['To stay warm in the snow','To swim fast','To look big','To fly'],'Thick fur keeps it warm.'],
   ['What is special about a duck’s feathers?',['They are oily so water rolls off','They are made of shells','They glow','They are hard'],'Oily feathers make water roll off.'],
   ['What does a turtle’s shell work like?',['Armor','A hat','A raincoat','A scarf'],'The shell is like armor.']]],
 ['The Tall Tower','Eli wanted to build the tallest block tower. It fell down two times. He did not give up. He made the bottom wider, and this time the tower stood up tall!',
  [['What happened to the tower at first?',['It fell down two times','It was perfect','It turned into a car','It got wet'],'It fell down two times.'],
   ['What did Eli change?',['He made the bottom wider','He used fewer blocks','He asked a friend to do it','He stopped'],'He made the bottom wider.'],
   ['What does this story teach?',['Keep trying and try a new way','Towers always fall','Never build towers','Give up fast'],'Eli didn’t give up and tried a new idea.']]],
 ['The Night Market','On Saturday night, Jay went to a night market with his dad. They saw bright lights and smelled yummy food. Jay ate a stick of chicken and a big cup of bubble tea. He fell asleep in the car on the way home.',
  [['Who went to the night market with Jay?',['His dad','His teacher','His dog','His class'],'He went with his dad.'],
   ['What did Jay drink?',['Bubble tea','Milk','Water','Soup'],'He had a big cup of bubble tea.'],
   ['Why do you think Jay fell asleep?',['It was late and he was tired','He was bored','He was sick','The car was cold'],'It was Saturday night, so it was late.']]],
 ['Space Shoes','Astronauts on the Moon wore big, heavy boots. The boots left deep footprints in the gray dust. There is no wind on the Moon, so those footprints may still be there today!',
  [['What color is the dust on the Moon?',['Gray','Green','Pink','Blue'],'The article says gray dust.'],
   ['Why might the footprints still be there?',['There is no wind on the Moon','Someone glued them','It rains a lot','Robots guard them'],'No wind blows them away.'],
   ['What did the astronauts wear on their feet?',['Big, heavy boots','Flip-flops','Socks only','Roller skates'],'Big, heavy boots.']]]];
MAGS.forEach(([t,txt,qs],i)=>qs.forEach(([q,o,why],j)=>LBANK.magazine.push(['g'+(i+1)+'_'+(j+1),q,o,why,null,i])));

const SIGNW=[['帽子','ㄇㄠˋ ˙ㄗ','Hat','🎩'],['鞋子','ㄒㄧㄝˊ ˙ㄗ','Shoes','👟'],['襪子','ㄨㄚˋ ˙ㄗ','Socks','🧦'],['外套','ㄨㄞˋ ㄊㄠˋ','Coat','🧥'],['圍巾','ㄨㄟˊ ㄐㄧㄣ','Scarf','🧣'],
 ['手套','ㄕㄡˇ ㄊㄠˋ','Gloves','🧤'],['褲子','ㄎㄨˋ ˙ㄗ','Pants','👖'],['雨傘','ㄩˇ ㄙㄢˇ','Umbrella','☂️'],['眼鏡','ㄧㄢˇ ㄐㄧㄥˋ','Glasses','👓'],['手錶','ㄕㄡˇ ㄅㄧㄠˇ','Watch','⌚'],
 ['背包','ㄅㄟˋ ㄅㄠ','Backpack','🎒'],['睡衣','ㄕㄨㄟˋ ㄧ','Pajamas','😴'],['靴子','ㄒㄩㄝ ˙ㄗ','Boots','🥾'],['領帶','ㄌㄧㄥˇ ㄉㄞˋ','Necktie','👔'],['球鞋','ㄑㄧㄡˊ ㄒㄧㄝˊ','Sneakers','👟'],
 ['泳褲','ㄩㄥˇ ㄎㄨˋ','Swim shorts','🩳'],['皮帶','ㄆㄧˊ ㄉㄞˋ','Belt','🪢'],['球衣','ㄑㄧㄡˊ ㄧ','Jersey','🎽'],['帽T','ㄇㄠˋ T','Hoodie','🧥'],['墨鏡','ㄇㄛˋ ㄐㄧㄥˋ','Sunglasses','🕶️']];
SIGNW.forEach((w,i)=>{const others=SIGNW.filter(x=>x!==w&&x[3]!==w[3]&&x[2]!==w[2]).sort(()=>Math.random()-.5).slice(0,3);
  if(i%2===0)LBANK.boutique.push(['z'+(i+1),'Read the sign. What does this corner of the shop sell?',[w[3]+' '+w[2]].concat(others.map(x=>x[3]+' '+x[2])),w[0]+' means “'+w[2]+'”.',null,null,{zh:w[0],zy:w[1]}]);
  else LBANK.boutique.push(['z'+(i+1),'A customer wants: '+w[3]+' '+w[2]+'. Which sign should he follow?',[{zh:w[0],zy:w[1]}].concat(others.map(x=>({zh:x[0],zy:x[1]}))),w[0]+' means “'+w[2]+'”.']);});
[['z21','出口','ㄔㄨ ㄎㄡˇ','What does this door sign mean?',['Exit (the way out)','Entrance','Toilet','Closed'],'出 = go out, 口 = opening. 出口 is the way out.'],
 ['z22','入口','ㄖㄨˋ ㄎㄡˇ','What does this door sign mean?',['Entrance (the way in)','Exit','Push','Stop'],'入 = go in. 入口 is the way in.'],
 ['z23','紅色','ㄏㄨㄥˊ ㄙㄜˋ','Which color does this label name?',['🔴 Red','🔵 Blue','🟡 Yellow','🟢 Green'],'紅 = red, 色 = color.'],
 ['z24','藍色','ㄌㄢˊ ㄙㄜˋ','Which color does this label name?',['🔵 Blue','🔴 Red','🟣 Purple','🟢 Green'],'藍 = blue.'],
 ['z25','綠色','ㄌㄩˋ ㄙㄜˋ','Which color does this label name?',['🟢 Green','🔵 Blue','🟡 Yellow','🟠 Orange'],'綠 = green.'],
 ['z26','黃色','ㄏㄨㄤˊ ㄙㄜˋ','Which color does this label name?',['🟡 Yellow','🔴 Red','🟢 Green','⚫ Black'],'黃 = yellow.'],
 ['z27','大','ㄉㄚˋ','This tag is on a T-shirt. What size is it?',['Big','Small','Long','Short'],'大 means big.'],
 ['z28','小','ㄒㄧㄠˇ','This tag is on a T-shirt. What size is it?',['Small','Big','Tall','Wide'],'小 means small.'],
 ['z29','男生','ㄋㄢˊ ㄕㄥ','This sign hangs over a clothes rack. Who are the clothes for?',['Boys','Babies','Dogs','Girls'],'男生 means boys.'],
 ['z30','廁所','ㄘㄜˋ ㄙㄨㄛˇ','Where does this sign point?',['🚽 The toilet','🍔 The food court','🚪 The exit','👟 Shoe shop'],'廁所 means toilet (restroom).']
].forEach(([id,zh,zy,q,o,why])=>LBANK.boutique.push([id,q,o,why,null,null,{zh,zy}]));

const LJOBS={
 studio:{e:'✏️',t:'Design Studio',d:'Logic puzzles',boss:'ivy',skill:'Logic',tip:'Next time you get dressed, count how many outfits your clothes can make. Tops × bottoms!'},
 fabric:{e:'📏',t:'Fabric Shop',d:'Area, perimeter, fractions',boss:'fay',skill:'Measuring',tip:'Measure your desk with a ruler at home, then work out its perimeter.'},
 magazine:{e:'📰',t:'Magazine Office',d:'Read articles',boss:'jo',skill:'Reading',tip:'Read a short article with Dad and tell him the main idea in one sentence.'},
 boutique:{e:'🏷️',t:'Boutique Signs',d:'Read zhuyin signs',boss:'lan',skill:'注音 Reading',tip:'Next time you visit a Taiwanese shop or market, try reading the signs out loud!'},
 museum:{e:'🏛️',t:'Fashion Museum',d:'Science & history',boss:'ada',skill:'Science & History',tip:'Check the tag inside a shirt at home. Is it cotton, wool or polyester?'}};
const LKEYS=Object.keys(LJOBS);
const BADGE=[4,10,18];           /* first-try solves for bronze / silver / gold in each job */
const LV_BADGES=[0,1,3,5,7,10];  /* skill badges needed to reach each fame level */

Object.assign(CAST,{
 ivy:{name:'Designer Ian',hair:'#1f1b2e',style:'short',skin:'#e6b991',iris:'#5b3a8a',top:'#7048e8',trim:'#ffd43b'},
 fay:{name:'Mr. Finn',hair:'#c2410c',style:'spiky',skin:'#f8dccb',iris:'#2f6b3a',top:'#0ca678',trim:'#fff'},
 jo:{name:'Editor Joe',hair:'#3b2a20',style:'short',skin:'#c68b5e',iris:'#3a2618',top:'#1c7ed6',trim:'#f4f1ea',glasses:1},
 lan:{name:'Uncle Lan',hair:'#2b2118',style:'short',skin:'#f1c9a8',iris:'#3a2618',top:'#e03131',trim:'#ffd43b'},
 ada:{name:'Curator Adam',hair:'#e9ecef',style:'short',skin:'#a86b45',iris:'#3a2618',top:'#5f3dc4',trim:'#ffd43b'}});
Object.assign(STORY,{
 learn:{
  studio:[['ivy','happy','Welcome to my Design Studio, {n}! Great designers are great puzzle solvers.'],['ivy','proud','Solve my puzzles, then tell me WHY your answer works. That’s how designers think!']],
  fabric:[['fay','happy','Hi {n}! At my Fabric Shop we measure, cut and share fabric.'],['fay','neutral','You’ll need area, perimeter and fractions. Measure twice, cut once!']],
  magazine:[['jo','happy','Welcome to Style Weekly, {n}! I need a sharp reader to check our articles.'],['jo','proud','Read carefully. The answers are always hiding in the text.']],
  boutique:[['lan','happy','歡迎光臨! Welcome, {n}! My boutique’s signs are all in Chinese.'],['lan','proud','Read the zhuyin beside each character and you can read any sign!']],
  museum:[['ada','happy','Welcome to the Fashion Museum, {n}. Every outfit here has a story.'],['ada','proud','Learn where clothes come from, and the science that makes them work.']]},
 badge1:[['mia','happy','{n}, you earned your first skill badge!'],['mia','proud','Top designers want models who understand clothes. Badges help you level up!'],['stella','proud','Badges? Pfft. Models just need to look good.'],['lucas','neutral','I think being smart AND stylish is even better.']],
 badge6:[['stella','sad','Um... {n}? Designer Ian gave me a puzzle and I can’t figure it out.'],['lucas','happy','Want to solve it together? Let’s draw it out step by step.'],['stella','surprised','You’d help me? Even though we’re rivals?'],['lucas','happy','Rivals can still be friends. Teamwork!'],['stella','happy','...Thanks, {n}. You’re actually pretty nice.']],
 needBadge:[['mia','neutral','{n}, you have enough stars for the next level!'],['mia','happy','But you need more skill badges first. Visit the Fashion District and learn something new!']]});


