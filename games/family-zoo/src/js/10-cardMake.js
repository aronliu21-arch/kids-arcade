const cardMake=(n,k)=>build(n,'cards',k,cardGen).map(q=>(q.lvl='Card battle',q.say=q.say||'',q));

/* ---- LUCAS 2: Choose-your-adventure reader ---- */
const ADV=[
{id:'cave',t:'The Cave of Glow Cards',pages:[
 ['Lucas found a map under his bed. It showed a cave behind the old oak tree. "An adventure!" he whispered.','Where did Lucas find the map?',['Under his bed','In a tree','In a cave'],0,'The story says he found the map under his bed.','Look at the first sentence.'],
 ['The cave was enormous. His flashlight could not reach the roof. Far away, something glimmered.','What does "enormous" mean?',['Very big','Very small','Very cold'],0,`The flashlight could not reach the roof, so the cave must be very big.`,'If the light cannot reach the roof, is the cave big or small?'],
 ['Lucas came to two tunnels. One had fresh footprints in the mud. The other was covered in old cobwebs. He wanted to follow someone who had walked there recently.','Which tunnel should Lucas take?',['The one with footprints','The one with cobwebs','Neither'],0,'Fresh footprints mean someone walked there recently.','Which tunnel shows a recent visitor?'],
 ['A river blocked the way. Lucas saw a rope bridge, a boat with a big hole, and a floating log. He chose the bridge because the boat would sink.','Why did Lucas not use the boat?',['It had a hole','It was too small','It was too fast'],0,'The boat had a big hole, so it would sink.','What was wrong with the boat?'],
 ['At the end of the cave, a chest glowed. Inside were five shiny cards. "I will share these with my team," said Lucas, smiling.','What will Lucas do with the cards?',['Share them with his team','Hide them','Sell them'],0,'He said he would share the cards with his team.','Read what Lucas says.']]},
{id:'pup',t:'The Mystery of the Missing Ball',pages:[
 ['On Saturday, Lucas arrived at the field early. The ball was gone! Only muddy footprints led to the fence.','What was missing?',['The ball','The goal','His shoes'],0,'The ball was gone from the field.','What does the second sentence say is gone?'],
 ['Behind the fence sat a tiny puppy, chewing the ball. "You mischievous little fellow," laughed Lucas.','What does "mischievous" mean?',['Playful and naughty','Sleepy','Very tall'],0,'A puppy chewing a ball is being playful and naughty.','What is the puppy doing with the ball?'],
 ['Lucas called his coach. "Bring a leash," said Coach. "Puppies can run very fast." Lucas found a rope in his bag.','Why did Coach say to bring a leash?',['So the puppy cannot run away','So the puppy can play','To tie the goal'],0,'Puppies run fast, so a leash keeps the puppy from running away.','Coach says puppies can do what?'],
 ['Lucas gently picked up the puppy. First he knelt down. Next he held out his hand. Last he smiled.','What did Lucas do first?',['He knelt down','He held out his hand','He smiled'],0,'The word "First" tells us he knelt down.','Find the word "First".'],
 ['The owner arrived, very thankful. "You are so kind," she said. Lucas got the ball back, and the game started on time.','Who was thankful?',['The owner','The coach','The ball'],0,'The owner arrived and was thankful.','Find the word "thankful".']]}
,{id:'egg',t:'The Surprise Egg',pages:[
 ['Lucas was digging in the garden when his shovel hit something hard. It was a big, spotted egg! "Whoa," he said.','What did Lucas find?',['A spotted egg','A shiny coin','An old shoe'],0,'His shovel hit a big, spotted egg.','Look at what the shovel hit.'],
 ['The egg was warm. Lucas wrapped it in his jacket and carried it home. He did not want it to get cold.','Why did Lucas wrap the egg in his jacket?',['To keep it warm','To hide it','To clean it'],0,'He did not want it to get cold.','Find the sentence about cold.'],
 ['That night, the egg began to wobble. Crack! A tiny line ran across the shell. Lucas held his breath.','What happened to the egg?',['It began to crack','It rolled away','It turned blue'],0,'The egg wobbled and cracked.','Read the sentence with "Crack!".'],
 ['Out popped a little green dinosaur. It squeaked and looked hungry. Lucas gave it a bowl of chopped lettuce.','What did Lucas feed the dinosaur?',['Lettuce','Pizza','Fish'],0,'He gave it a bowl of chopped lettuce.','What was in the bowl?'],
 ['Lucas named the dinosaur Spike. "You are my new best friend," he said. Spike licked his cheek and Lucas giggled.','What did Lucas name the dinosaur?',['Spike','Rex','Dot'],0,'He named the dinosaur Spike.','Find the word "named".']]},
{id:'rocket',t:'The Cardboard Rocket',pages:[
 ['Lucas built a rocket out of a big cardboard box. He painted it red and added silver wings.','What was the rocket made from?',['A cardboard box','A bucket','A bicycle'],0,'He built it out of a big cardboard box.','Read the first sentence.'],
 ['He climbed inside and counted down. "Ten, nine, eight..." Lucas pretended the box was zooming through the sky.','What does "zooming" mean?',['Moving very fast','Standing still','Falling asleep'],0,'Zooming means moving very fast.','How does a rocket move in the sky?'],
 ['Soon he reached the moon. It was gray and dusty, with big holes called craters. Lucas took one giant step.','What are craters?',['Big holes','Tall hills','Tiny rocks'],0,'The story says craters are big holes.','Find the words "called craters".'],
 ['On the moon, Lucas met a friendly alien. The alien was purple and had three eyes. "Hello!" it beeped.','How many eyes did the alien have?',['Three','Two','Four'],0,'The alien had three eyes.','Look at how the alien is described.'],
 ['The alien gave Lucas a glowing star as a gift. Then Lucas flew home in time for dinner.','Why did Lucas fly home?',['It was almost dinner time','He was lost','His rocket broke'],0,'He flew home in time for dinner.','Find the words "in time for".']]},
{id:'game',t:'The Big Game',pages:[
 ['It was the last game of the season. Lucas laced up his cleats and stretched. His team wore blue shirts.','What color were the team shirts?',['Blue','Red','Green'],0,'His team wore blue shirts.','Read the last sentence.'],
 ['At halftime, the score was tied, one to one. "We can do this," said Lucas. "We just need to pass and stay calm."','What does "tied" mean?',['Both teams have the same score','The shoes are tied','The game is over'],0,'Tied means both teams have the same score, one to one.','Look at the score.'],
 ['In the second half, Lucas saw a teammate standing open near the goal. He did not shoot. He passed the ball to her instead.','Why did Lucas pass the ball?',['His teammate was open','He was tired','The ball was flat'],0,'His teammate was open near the goal.','Who was standing open?'],
 ['She kicked it into the net! The crowd cheered. Lucas ran over and gave her a high five.','What did the crowd do?',['Cheered','Left','Slept'],0,'The crowd cheered.','Find the crowd.'],
 ['The game ended two to one. The coach said, "I am proud of how you worked together." Lucas smiled.','How did the coach feel?',['Proud','Bored','Angry'],0,'The coach said she was proud of how the team worked together.','Read the words in quotes.']]},
{id:'snow',t:'The Snow Day',pages:[
 ['Lucas woke up and looked out the window. Everything was white! It had snowed all night, and school was closed.','Why was school closed?',['It snowed all night','It was a holiday','The bus broke'],0,'It had snowed all night.','What happened during the night?'],
 ['He put on his boots, his warm coat, and thick mittens. Then he hurried outside because the snow was perfect for building.','What did Lucas wear on his hands?',['Mittens','Boots','A hat'],0,'He put on thick mittens.','Find the word for hand warmers.'],
 ['First he rolled a big ball for the bottom. Next he rolled a medium ball for the middle. Last he made a small ball for the head.','What did Lucas make last?',['A small ball for the head','A big ball','A medium ball'],0,'Last he made a small ball for the head.','Find the word "Last".'],
 ['He used two stones for eyes and a carrot for the nose. The snowman looked silly and Lucas laughed out loud.','What did he use for the nose?',['A carrot','A stone','A stick'],0,'He used a carrot for the nose.','Which item is for the nose?'],
 ['Back inside, Lucas drank hot chocolate. His cheeks were rosy and his toes were tingling. It was the best snow day ever.','What did Lucas drink?',['Hot chocolate','Orange juice','Milk'],0,'He drank hot chocolate.','What did he drink after coming inside?']]}];
function advMake(n,kid){const a=pick(ADV);return a.pages.map((p,i)=>({id:a.id+i,lvl:`${a.t} · page ${i+1}`,prompt:`<div class="story">${p[0]}</div><div class="q" style="color:var(--acc)">${p[1]}</div>`,say:p[0]+' '+p[1],
  choices:shuffle(p[2].map((c,j)=>({val:c,html:c}))),answer:p[2][0],why:p[4],hint:p[5]}))}

/* ---- LUCAS 3: Zhuyin treasure hunt ---- */
function huntGen(){const w=pick(PICW),mode=rnd(0,1),i=WORDS.indexOf(w);
  if(mode===0){const first=zyOnly(w[0]).trim()[0],all=['ㄅ','ㄆ','ㄇ','ㄈ','ㄉ','ㄊ','ㄋ','ㄌ','ㄍ','ㄎ','ㄏ','ㄐ','ㄑ','ㄒ','ㄓ','ㄔ','ㄕ','ㄖ','ㄗ','ㄘ','ㄙ','ㄧ','ㄨ','ㄩ'].filter(x=>x!==first);
    return{id:'h0'+i,lvl:'Treasure chest',prompt:`<div class="pic">${w[2]}</div><div class="q zh">${zy(w[0])}</div><div class="q">Which zhuyin sound comes first?</div>`,choices:shuffle([first,...shuffle(all).slice(0,3)]).map(x=>({val:x,html:`<span style="font-size:1.4em">${x}</span>`})),answer:first,why:`${plain(w[0])} is ${zyOnly(w[0])}, and it starts with ${first}.`,hint:'Look at the first small symbol above the character.',say:`Which zhuyin sound comes first in ${w[1]}?`}}
  const others=[];for(const x of shuffle(PICW)){if(x!==w&&x[1]!==w[1]&&x[2]!==w[2]&&!others.some(o=>o[1]===x[1]||o[2]===x[2]))others.push(x);if(others.length===2)break;}
  return{id:'h1'+i,lvl:'Treasure map',prompt:`<div class="q zh" style="color:var(--acc)">${zyOnly(w[0])}</div><div class="q">Which picture matches this zhuyin?</div>`,choices:shuffle([w,...others]).map(x=>({val:x[1],html:`<span style="font-size:2.2em">${x[2]}</span>`})),answer:w[1],why:`${zyOnly(w[0])} is ${plain(w[0])}: ${w[1]} ${w[2]}.`,hint:'Say the sounds out loud, slowly, one after another.',say:'Which picture matches this zhuyin?'}}
const huntMake=(n,k)=>build(n,'hunt',k,huntGen);

/* ---- LUCAS 4: Shop keeper ---- */
function shopGen(){const t=rnd(0,4);
  if(t===0){const pay=pick([10,20]),p=rnd(1,pay-1);return{id:`s0${pay}${p}`,prompt:`<div class="q">🏪 A pack costs ${p} coins. The customer pays ${pay} coins. How much change?</div>`,choices:numChoices(pay-p,4,0,20),answer:pay-p,why:`${pay} − ${p} = ${pay-p}.`,hint:`Count up from ${p} to ${pay}.`}}
  if(t===1){const n=rnd(2,5),p=pick([2,3,4,5,10]);return{id:`s1${n}${p}`,prompt:`<div class="q">🏪 ${n} card packs cost ${p} coins each. What is the total?</div>`,choices:numChoices(n*p,4,0,60),answer:n*p,why:`${n} × ${p} = ${n*p}.`,hint:`Count by ${p}s, ${n} times.`}}
  if(t===2){const p=pick([2,4,5,10]),m=p*rnd(2,5);return{id:`s2${p}${m}`,prompt:`<div class="q">🏪 Lucas has ${m} coins. Each sticker costs ${p}. How many can he buy?</div>`,choices:numChoices(m/p,4,0,20),answer:m/p,why:`${m} ÷ ${p} = ${m/p}.`,hint:`How many ${p}s fit into ${m}?`}}
  if(t===3){const o=rnd(3,12)*2;return{id:`s3${o}`,prompt:`<div class="q">🏪 Half-price sale! A card costs ${o} coins. What is the sale price?</div>`,choices:numChoices(o/2,4,0,30),answer:o/2,why:`Half of ${o} is ${o/2}.`,hint:'Split it into two equal parts.'}}
  const a=rnd(5,15),b=rnd(3,9);return{id:`s4${a}${b}`,prompt:`<div class="q">🏪 A booster pack is ${a} coins and a card sleeve is ${b} coins. What is the total?</div>`,choices:numChoices(a+b,4,0,40),answer:a+b,why:`${a} + ${b} = ${a+b}.`,hint:`Add ${b} to ${a}.`}}
const shopMake=(n,k)=>build(n,'shop',k,shopGen).map(q=>(q.lvl='Card shop',q.say='',q));

/* ---- LUCAS 5: Soccer number drills ---- */
function drillGen(){const t=rnd(0,3);
  if(t===0){const st=pick([2,3,5,10]),s=st*rnd(1,5),ix=rnd(2,4),seq=[0,1,2,3,4].map(i=>s+st*i),a=seq[ix];return{id:`d0${st}${s}${ix}`,prompt:`<div class="q">⚽ Count by ${st}s</div><div class="seq">${seq.map((x,i)=>i===ix?'<span class="qm">?</span>':`<span class="nchip">${x}</span>`).join('')}</div>`,choices:numChoices(a,4,0,80),answer:a,why:`Each step adds ${st}, so the missing number is ${a}.`,hint:`How far is it from one number to the next?`}}
  if(t===1){const T=pick([10,20]),a=rnd(1,T-1);return{id:`d1${T}${a}`,prompt:`<div class="q">⚽ Pass it! ${a} + ? = ${T}</div>`,choices:numChoices(T-a,4,0,20),answer:T-a,why:`${a} + ${T-a} = ${T}.`,hint:`Count up from ${a} to ${T}.`}}
  if(t===2){const m=rnd(2,6),team=rnd(m+3,15);return{id:`d2${m}${team}`,prompt:`<div class="q">⚽ Lucas scored ${m} goals. His team scored ${team} goals in all. How many did his teammates score?</div>`,choices:numChoices(team-m,4,0,20),answer:team-m,why:`${team} − ${m} = ${team-m}.`,hint:`Take Lucas's goals away from the team total.`}}
  const a=rnd(3,12);return{id:`d3${a}`,prompt:`<div class="q">⚽ Lucas makes ${a} passes in the first half and the same in the second half. How many passes in all?</div>`,choices:numChoices(a*2,4,0,30),answer:a*2,why:`${a} + ${a} = ${a*2}.`,hint:'Add the number to itself.'}}
