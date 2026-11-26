const LUCAS_READ1=[
 ['lr3','Which word rhymes with “light”?','night','lamp','list','light and night both end in “-ight”.'],
 ['lr4','Which word is the opposite of “hot”?','cold','warm','sun','Hot and cold are opposites.'],
 ['lr6','Which word is an action word?','jump','table','blue','You can DO a jump. Table is a thing, blue is a color.'],
 ['lr9','Which word means “very big”?','huge','tiny','quick','Huge means very, very big.'],
 ['lr11','Which word has the same vowel sound as “cake”?','rain','cat','car','“ai” in rain says the long A, like in cake.'],
 ['lr12','What is more than one “mouse”?','mice','mouses','mousies','Mouse is special: one mouse, two mice.'],
 ['lr14','Which word is spelled correctly?','because','becuz','becos','b-e-c-a-u-s-e.'],
 ['lr17','Which word is a color?','purple','table','jump','Purple is a color.'],
 ['lr18','What is the opposite of “up”?','down','top','over','Up and down are opposites.'],
 ['lr19','Which word rhymes with “cake”?','lake','cat','cook','cake and lake both end in “-ake”.'],
 ['lr20','Which word is a naming word (a noun)?','apple','run','happy','An apple is a thing, so it is a noun.'],
 ['lr21','What is more than one “child”?','children','childs','childes','One child, many children.']
];
const LUCAS_READ2=[
 ['lr1','“The dog ran to the park to find his red ball.” What color was the ball?','Red','Blue','Green','The sentence says “his red ball”.'],
 ['lr2','“Mia put on her coat because it was cold.” Why did Mia wear a coat?','It was cold','It was raining','It was her birthday','The word “because” tells us why: it was cold.'],
 ['lr5','“Ben has two cats and one fish.” How many pets does Ben have?','3','2','1','2 cats + 1 fish = 3 pets.'],
 ['lr7','“The sun went down and the stars came out.” What time is it?','Night','Morning','Lunchtime','When the sun goes down and stars come out, it is night.'],
 ['lr10','“Leo was so happy he jumped up and down.” How did Leo feel?','Happy','Sleepy','Angry','The sentence says he was so happy.'],
 ['lr13','“First Ava brushed her teeth. Then she went to bed.” What did Ava do first?','Brushed her teeth','Went to bed','Ate lunch','“First” tells us: she brushed her teeth.'],
 ['lr22','“Tim’s kite flew high until the wind stopped.” Why did the kite stop flying?','The wind stopped','Tim was tired','It started to rain','“until the wind stopped” — kites need wind.'],
 ['lr23','“Owls sleep in the day and hunt at night.” When do owls hunt?','At night','In the morning','At lunch','The sentence says they hunt at night.'],
 ['lr24','“The cat sat on the warm, sunny window.” Where did the cat sit?','On the window','Under the bed','In the box','It sat on the window.'],
 ['lr25','“Max has a red hat and blue shoes.” What color are Max’s shoes?','Blue','Red','Green','“blue shoes” — the shoes are blue.']
];
const LUCAS_READ3=[
 ['lr30','“Maya took her umbrella and boots. The sky was dark gray.” What is the weather probably like?','Rainy','Sunny','Hot','Umbrella + boots + gray sky are clues for rain.'],
 ['lr31','“The puppy chewed Dad’s shoe, then hid under the bed when Dad came home.” How did the puppy probably feel?','Worried','Proud','Sleepy','It hid after doing something wrong, so it was worried.'],
 ['lr32','“Ben planted a seed and watered it every day. After two weeks, a tiny green leaf poked out.” What happened to the seed?','It started to grow','It was eaten','It blew away','A green leaf poking out means it is growing.'],
 ['lr33','“Lily stopped running to help a friend who fell. She finished last, but she smiled.” Why did Lily smile?','She was glad she helped','She won the race','She was tired','She didn’t win, so she smiled because she helped her friend.'],
 ['lr34','Which sentence is written correctly?','My dog is named Max.','my dog is named max.','My Dog is named max.','Start with a capital, names get capitals, end with a period.'],
 ['lr35','“Grandpa’s garden has tomatoes, carrots and peas.” What does Grandpa grow?','Vegetables','Flowers','Trees','Tomatoes, carrots and peas are vegetables.'],
 ['lr36','“The whale was enormous.” What does “enormous” mean?','Very big','Very fast','Very small','Whales are huge, so enormous means very big.'],
 ['lr37','“First, mix flour and eggs. Next, pour it into a pan. Last, bake it.” What do you do second?','Pour it into a pan','Mix flour and eggs','Bake it','First → mix, Next (second) → pour, Last → bake.'],
 ['lr38','“Zoe yawned and rubbed her eyes during the movie.” How does Zoe feel?','Sleepy','Excited','Hungry','Yawning and rubbing eyes are clues for sleepy.']
];
G('lucas','reading',1,bank(LUCAS_READ1));G('lucas','reading',2,bank(LUCAS_READ2));G('lucas','reading',3,bank(LUCAS_READ3));

/* ===== NORA (9): ×÷, 中文/注音, science, numbers & fractions, history, Kangaroo ===== */
// times & division
G('nora','muldiv',1,()=>{const a=RI(2,12),b=RI(2,12);return mk('nx'+a+'x'+b,a+' × '+b+' = ?',a*b,numOpts(a*b,Math.max(3,Math.min(a,b)),1),{big:1,how:howMul(a,b)})});
G('nora','muldiv',1,()=>{const a=RI(2,12),b=RI(2,12);return mk('nd'+(a*b)+'/'+a,(a*b)+' ÷ '+a+' = ?',b,numOpts(b,3,1),{big:1,how:howDiv(a*b,a)})});
G('nora','muldiv',2,()=>{const a=RI(12,99),b=RI(3,9);return mk('nm'+a+'x'+b,a+' × '+b+' = ?',a*b,numOpts(a*b,Math.max(8,b*3),1),{big:1,how:howBigMul(a,b)})});
G('nora','muldiv',2,()=>{const d=RI(3,9),q=RI(3,11),r=RI(1,d-1),n=d*q+r;return mk('nr'+n+'/'+d,n+' ÷ '+d+' = ?',`${q} R${r}`,shuffle([`${q} R${r}`,`${q+1} R${r}`,`${q} R${r===1?2:r-1}`]),{big:1,how:howRem(n,d)})});
G('nora','muldiv',3,()=>{const a=RI(3,12),b=RI(3,12);return mk('nq'+a+'x'+b,'? × '+b+' = '+(a*b),a,numOpts(a,3,1),{big:1,how:[`Think: what times ${b} makes ${a*b}?`,`${a*b} ÷ ${b} = ${a}.`,`Check: ${a} × ${b} = ${a*b}. ✓`]})});
G('nora','muldiv',3,()=>{const A=RI(3,9),B=RI(4,12),C=RI(5,A*B-5);return mk('nt'+A+'x'+B+'-'+C,'Nora buys '+A+' packs of '+B+' stickers. She gives '+C+' to friends. How many stickers are left?',A*B-C,numOpts(A*B-C,6,0),{how:[`Total stickers: ${A} × ${B} = ${A*B}.`,`Give away ${C}: ${A*B} − ${C} = ${A*B-C}.`]})});
G('nora','muldiv',3,()=>{const d=RI(3,8),q=RI(21,99);const n=d*q;return mk('nD'+n+'/'+d,n+' ÷ '+d+' = ?',q,numOpts(q,6,1),{big:1,how:[`Split ${n} into easy parts: ${d*(q-q%10)} + ${d*(q%10)}.`,`${d*(q-q%10)} ÷ ${d} = ${q-q%10}, and ${d*(q%10)} ÷ ${d} = ${q%10}.`,`${q-q%10} + ${q%10} = ${q}.`]})});
// numbers & fractions
G('nora','numbers',1,()=>{const a=RI(120,699),b=RI(105,299);return mk('nA'+a+'+'+b,a+' + '+b+' = ?',a+b,numOpts(a+b,20,0),{big:1,how:howAdd(a,b)})});
G('nora','numbers',1,()=>{const n=RI(101,989),to=pick([10,100]);const r=Math.round(n/to)*to;const d=to===10?n%10:Math.floor(n/10)%10;
  return mk('nR'+n+'r'+to,`Round ${n} to the nearest ${to}.`,r,(()=>{let alt=r===Math.ceil(n/to)*to?Math.floor(n/to)*to:Math.ceil(n/to)*to;if(alt===r)alt=r+to;const third=alt>r?(r-to>=0?r-to:alt+to):r+to;return shuffle([r,alt,third])})(),{big:1,how:[`Look at the ${to===10?'ones':'tens'} digit: ${d}.`,d>=5?'5 or more → round up.':'Less than 5 → round down.',`${n} rounds to ${r}.`]})});
G('nora','numbers',2,()=>{const a=RI(300,999),b=RI(101,a-50);return mk('nS'+a+'-'+b,a+' − '+b+' = ?',a-b,numOpts(a-b,20,0),{big:1,how:howSub(a,b)})});
G('nora','numbers',2,()=>{const d=pick([3,4,5,6,8,10]),n=RI(1,d-1),k=RI(2,12);return mk('nf'+n+'/'+d+'of'+d*k,n+'/'+d+' of '+(d*k)+' = ?',n*k,numOpts(n*k,Math.max(2,k),1),{big:1,how:howFrac(n,d,d*k)})});
G('nora','numbers',2,()=>{const n=RI(1000,9999);const s=String(n);const i=RI(0,2);const val=Number(s[i])*Math.pow(10,3-i);if(!Number(s[i]))return null;
  const nm=['thousands','hundreds','tens','ones'][i];return mk('nv'+n+'p'+i,`In ${n.toLocaleString('en-US')}, what is the value of the ${s[i]} (in the ${nm} place)?`,val,shuffle([val,Number(s[i]),val*10]),{how:[`The ${s[i]} is in the ${nm} place.`,`${s[i]} × ${Math.pow(10,3-i)} = ${val}.`]})});
G('nora','numbers',3,()=>{const b=pick([2,3,4,5]),a=RI(1,b-1),k=RI(2,5),den=b*k;return mk('ne'+a+'/'+b+'='+den,`${a}/${b} = ?/${den}`,a*k,numOpts(a*k,3,1),{big:1,how:[`${b} × ${k} = ${den}, so the bottom was multiplied by ${k}.`,`Do the same to the top: ${a} × ${k} = ${a*k}.`,`${a}/${b} = ${a*k}/${den}.`]})});
G('nora','numbers',3,()=>{let a,b,c,d;do{b=RI(3,8);d=RI(3,8);a=RI(1,b-1);c=RI(1,d-1)}while(b===d||a*d===c*b);const big=a*d>c*b?`${a}/${b}`:`${c}/${d}`;
  return mk('nc'+a+b+c+d,`Which is bigger: ${a}/${b} or ${c}/${d}?`,big,[`${a}/${b}`,`${c}/${d}`,'They are equal'],{how:[`Give them the same bottom: ${b} × ${d} = ${b*d}.`,`${a}/${b} = ${a*d}/${b*d} and ${c}/${d} = ${c*b}/${b*d}.`,`${Math.max(a*d,c*b)} > ${Math.min(a*d,c*b)}, so ${big} is bigger.`]})});
G('nora','numbers',3,()=>{const l=RI(4,15),w=RI(2,l-1);const area=Math.random()<.5;const ans=area?l*w:2*(l+w);
  return mk('n'+(area?'a':'p')+l+'x'+w,`A rectangle is ${l} cm long and ${w} cm wide. What is its ${area?'area':'perimeter'}?`,ans+(area?' cm²':' cm'),uniq3([ans,area?2*(l+w):l*w,area?l*w+l:l+w].map(v=>v+(area?' cm²':' cm')),ans+(area?' cm²':' cm'),2),{how:area?[`Area = length × width.`,`${l} × ${w} = ${l*w} cm².`]:[`Perimeter = all 4 sides added.`,`${l} + ${w} + ${l} + ${w} = ${2*(l+w)} cm.`]})});
// kangaroo-style logic
G('nora','kangaroo',1,()=>{const s=RI(2,20),k=RI(3,12);const seq=[s,s+k,s+2*k,s+3*k];return mk('nP'+s+'+'+k,'What comes next? '+seq.join(', ')+', ?',s+4*k,numOpts(s+4*k,4,1),{big:1,how:[`Find the jump: ${s+k} − ${s} = ${k}.`,`Each number goes up by ${k}: ${s+3*k} + ${k} = ${s+4*k}.`]})});
G('nora','kangaroo',2,()=>{const s=RI(2,6),f=pick([2,3]);const seq=[s,s*f,s*f*f,s*f*f*f];return mk('nG'+s+'x'+f,'What comes next? '+seq.join(', ')+', ?',s*f**4,numOpts(s*f**4,f*4,1),{big:1,how:[`Each number is ${f} times the one before.`,`${s*f**3} × ${f} = ${s*f**4}.`]})});
G('nora','kangaroo',2,()=>{const A=RI(10,15),d1=RI(2,4),d2=RI(1,4);const nm=pick([['Amy','Ben','Cara'],['Eli','Fay','Gus'],['Ivy','Jon','Kit']]);
  return mk('nY'+A+d1+d2+nm[0],`${nm[0]} is ${A}. ${nm[1]} is ${d1} years younger. ${nm[2]} is ${d2} years younger than ${nm[1]}. How old is ${nm[2]}?`,A-d1-d2,numOpts(A-d1-d2,3,1),{how:[`${nm[1]}: ${A} − ${d1} = ${A-d1}.`,`${nm[2]}: ${A-d1} − ${d2} = ${A-d1-d2}.`]})});
G('nora','kangaroo',2,()=>{const c=RI(2,8),d=RI(2,8);return mk('nL'+c+'c'+d,`A farm has ${c} chickens and ${d} cows. How many legs altogether?`,2*c+4*d,numOpts(2*c+4*d,4,1),{how:[`Chickens: ${c} × 2 = ${2*c}.`,`Cows: ${d} × 4 = ${4*d}.`,`${2*c} + ${4*d} = ${2*c+4*d}.`]})});
const NORA_KANGAROO=[
 ['nk1','Anna has 3 brothers. Each brother has 2 sisters. How many children are in the family?','5','6','8','The 2 sisters are Anna and one more girl: 2 girls + 3 boys = 5.'],
 ['nk2','A snail climbs 3 m up a 10 m wall each day and slides down 2 m each night. On which day does it reach the top?','Day 8','Day 10','Day 7','After 7 days and nights it is at 7 m. On day 8 it climbs 3 m and reaches 10 m.'],
 ['nk3','I think of a number. I double it and add 6. I get 30. What is my number?','12','18','15','Work backwards: 30 − 6 = 24, and half of 24 is 12.'],
 ['nk4','Draw a square and both of its diagonals. How many triangles can you find?','8','4','6','4 small triangles + 4 big ones made of 2 small triangles each.'],
 ['nk5','Today is Wednesday. What day will it be in 100 days?','Friday','Thursday','Saturday','100 = 14 weeks (98 days) + 2 days. Wednesday + 2 days = Friday.'],
 ['nk6','Tom is 4th from the front and 6th from the back of a line. How many kids are in the line?','9','10','11','4 + 6 = 10, but Tom was counted twice: 10 − 1 = 9.'],
 ['nk7','Pencils cost $3 and erasers cost $2. Mia bought 5 things and spent $13. How many pencils did she buy?','3','2','4','Try 3 pencils ($9) + 2 erasers ($4) = 5 things and $13. ✓'],
 ['nk8','What is the sum of the digits of the biggest 3-digit number with all different digits?','24','27','25','The number is 987, and 9 + 8 + 7 = 24.'],
 ['nk9','5 friends meet. Each friend shakes hands once with every other friend. How many handshakes?','10','20','25','Friend 1 shakes 4 hands, friend 2 three new ones, and so on: 4 + 3 + 2 + 1 = 10.'],
 ['nk10','What comes next? 2, 5, 11, 23, ?','47','46','35','Each number is doubled, then 1 is added: 23 × 2 + 1 = 47.'],
 ['nk11','A book has pages 1 to 20. How many times is the digit 1 printed?','12','11','10','1, 10, 11 (twice), and 12–19 (8 times): 1 + 1 + 2 + 8 = 12.'],
 ['nk12','Lily is older than Max. Max is older than Sam. Sam is older than Zoe. Who is the second youngest?','Sam','Max','Zoe','From oldest to youngest: Lily, Max, Sam, Zoe. Second youngest is Sam.'],
 ['nk13','A bus has 20 people. At stop 1, 6 get off and 4 get on. At stop 2, 5 get off and 8 get on. How many people are on the bus now?','21','19','23','20 − 6 + 4 = 18, then 18 − 5 + 8 = 21.'],
 ['nk14','What is the smallest number (not 0) you can divide by 2, 3 and 4 with nothing left over?','12','24','6','Check multiples of 4: 4 (no ÷3), 8 (no ÷3), 12 ✓.'],
 ['nk15','3 cats catch 3 mice in 3 minutes. How many cats are needed to catch 100 mice in 100 minutes?','3','100','33','3 cats catch 1 mouse per minute together, so in 100 minutes they catch 100.'],
 ['nk16','A 24 cm ribbon is cut into 4 cm pieces. How many cuts are needed?','5','6','4','There are 6 pieces, and the last piece needs no cut: 5 cuts.'],
 ['nk17','A kangaroo starts at 0 and jumps 3 steps each time. Which number will it land on?','21','25','14','It lands on multiples of 3: 3, 6, 9 … 21. 25 and 14 are not multiples of 3.'],
 ['nk18','Which is the biggest: half of 50, a third of 60, or a quarter of 80?','Half of 50','A third of 60','A quarter of 80','Half of 50 = 25. A third of 60 = 20. A quarter of 80 = 20.'],
 ['nk19','How many legs do 3 chickens and 4 dogs have altogether?','22','24','14','3 × 2 = 6 and 4 × 4 = 16. 6 + 16 = 22.'],
 ['nk20','The time is 3:00. What is the angle between the clock hands?','90°','45°','180°','The hands point at 12 and 3: a quarter turn, which is 90°.'],
 ['nk21','How many edges does a cube have?','12','8','6','4 on top, 4 on the bottom, and 4 going up the sides.'],
 ['nk22','Ben has twice as many marbles as Ella. Together they have 18. How many does Ben have?','12','9','6','Ella = 1 part, Ben = 2 parts. 3 parts = 18, so 1 part = 6. Ben has 12.'],
 ['nk23','There are 12 apples. You eat a third of them. How many are left?','8','4','9','A third of 12 is 12 ÷ 3 = 4 eaten. 12 − 4 = 8 left.'],
 ['nk24','How many days are in 6 weeks and 3 days?','45','42','48','6 × 7 = 42 days, plus 3 = 45.'],
 ['nk25','How many squares of ANY size are on a 3×3 grid?','14','9','13','9 small + 4 medium (2×2) + 1 big (3×3) = 14.'],
 ['nk26','Three numbers in a row (like 4, 5, 6) add up to 33. What is the biggest one?','12','11','13','The middle number is 33 ÷ 3 = 11, so the numbers are 10, 11, 12.'],
 ['nk27','A frog jumps 5 steps forward and 2 steps back each turn. How far from the start is it after 4 turns?','12','20','14','Each turn it moves 5 − 2 = 3 forward. 4 × 3 = 12.'],
 ['nk28','Which number is missing? 1, 4, 9, 16, ?, 36','25','20','24','These are square numbers: 1×1, 2×2, 3×3, 4×4, 5×5 = 25, 6×6.'],
 ['nk29','A rectangle has a perimeter of 20 cm. Its length is 6 cm. What is its width?','4 cm','14 cm','8 cm','Length + width is half the perimeter: 10. 10 − 6 = 4 cm.'],
 ['nk30','30 kids each like cats, dogs, or both. 18 like cats and 16 like dogs. How many like both?','4','2','6','18 + 16 = 34 counts the “both” kids twice. 34 − 30 = 4.'],
 ['nk31','What is the smallest 3-digit number whose digits add up to 5?','104','113','500','Start at 100 and keep the front small: 1 + 0 + 4 = 5 → 104.'],
 ['nk32','Yesterday was Sunday. What day will it be 10 days from today?','Thursday','Wednesday','Friday','Today is Monday. 10 days = 1 week + 3 days → Monday + 3 = Thursday.'],
 ['nk33','A clock strikes 3 times at 3:00 and it takes 2 seconds. How long does it take to strike 6 times at 6:00?','5 seconds','4 seconds','6 seconds','3 strikes have 2 gaps, so each gap is 1 second. 6 strikes have 5 gaps = 5 seconds.'],
 ['nk34','How many 2-digit numbers have digits that add up to 4?','4','3','5','13, 22, 31 and 40. That is 4 numbers.'],
 ['nk35','Half of a number is 3 more than a quarter of it. What is the number?','12','6','24','Half − quarter = a quarter, so a quarter is 3. The number is 4 × 3 = 12.'],
 ['nk36','A square has a perimeter of 36 cm. What is its area?','81 cm²','36 cm²','72 cm²','Each side is 36 ÷ 4 = 9 cm. Area = 9 × 9 = 81 cm².']
];
G('nora','kangaroo',3,bank(NORA_KANGAROO));
