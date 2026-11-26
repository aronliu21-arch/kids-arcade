
// ==LOGIC-START (no DOM in this block)
const rnd=(a,b)=>a+Math.random()*(b-a);
const rint=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=r[i];r[i]=r[j];r[j]=t;}return r;};
const pad=n=>String(n).padStart(2,'0');
const MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const ZHNUM=[['日','ㄖˋ'],['一','ㄧ'],['二','ㄦˋ'],['三','ㄙㄢ'],['四','ㄙˋ'],['五','ㄨˇ'],['六','ㄌㄧㄡˋ'],['七','ㄑㄧ'],['八','ㄅㄚ'],['九','ㄐㄧㄡˇ'],['十','ㄕˊ']];
/* Chinese text with vertical zhuyin beside each character. zy is space-separated, one syllable per character. */
function ZYC(z){const T='ˊˇˋ',a=[...z],tn=a.find(c=>T.includes(c))||'',neu=a[0]==='˙',s=a.filter(c=>!T.includes(c)&&c!=='˙');return '<b class="zs">'+(neu?'<i class="zn">˙</i>':'')+s.map(c=>'<i>'+c+'</i>').join('')+'</b>'+(tn?'<b class="zt">'+tn+'</b>':'')}
function RB(ch,zy){const z=zy.split(' '),c=Array.from(ch);return '<span class="zy">'+c.map((x,i)=>'<span class="zc"><span class="c">'+x+'</span><span class="z">'+ZYC(z[i]||'')+'</span></span>').join('')+'</span>';}
function zhMonth(m){ // m 1..12
  if(m<=10)return RB(ZHNUM[m][0]+'月',ZHNUM[m][1]+' ㄩㄝˋ');
  return RB('十'+ZHNUM[m-10][0]+'月','ㄕˊ '+ZHNUM[m-10][1]+' ㄩㄝˋ');
}
function zhDay(d){return RB('星期'+ZHNUM[d][0],'ㄒㄧㄥ ㄑㄧˊ '+ZHNUM[d][1]);}
const ord=n=>n+((n%100>=11&&n%100<=13)?'th':(['th','st','nd','rd'][n%10]||'th'));

/* Holidays. r: fix (month/day), nth (nth weekday of month), last (last weekday), lunar (lunar date; exact dates from a table),
   text (no exact rule here), easter. mo = month answer for Lucas. */
const H=[
 // ---- US ----
 {id:'newyear',g:'us',n:"New Year's Day",e:'🎉',r:{t:'fix',m:1,d:1},s:'Starting a brand-new year',f:'People count down 10, 9, 8… and cheer at midnight. Many people pick a goal for the new year.'},
 {id:'mlk',g:'us',n:'Martin Luther King Jr. Day',e:'✊',r:{t:'nth',m:1,wd:1,n:3},s:'Honoring Dr. King, who worked for fair treatment of all people',f:'Dr. King believed in peaceful protest. In 1963 he gave his famous “I Have a Dream” speech.'},
 {id:'groundhog',g:'us',n:'Groundhog Day',e:'🌤️',r:{t:'fix',m:2,d:2},s:'A groundhog “guesses” when spring will come',f:'Legend says if the groundhog sees its shadow, winter lasts six more weeks.'},
 {id:'valentine',g:'us',n:"Valentine's Day",e:'❤️',r:{t:'fix',m:2,d:14},s:'Showing love to family and friends',f:'Kids often trade cards and candy hearts with classmates.',milo:['❤️','heart']},
 {id:'presidents',g:'us',n:"Presidents' Day",e:'🎩',r:{t:'nth',m:2,wd:1,n:3},s:'Honoring US presidents',f:'It started as George Washington’s birthday. He was born on February 22, 1732.'},
 {id:'stpat',g:'us',n:"St. Patrick's Day",e:'☘️',r:{t:'fix',m:3,d:17},s:'Celebrating Ireland and Irish culture',f:'People wear green. The shamrock, a three-leaf clover, is its symbol.',milo:['☘️','clover']},
 {id:'mothers',g:'us',n:"Mother's Day",e:'💐',r:{t:'nth',m:5,wd:0,n:2},s:'Thanking moms',f:'Taiwan and the US both celebrate Mother’s Day on the second Sunday of May.'},
 {id:'memorial',g:'us',n:'Memorial Day',e:'🌺',r:{t:'last',m:5,wd:1},s:'Remembering soldiers who died serving the country',f:'It also marks the start of summer for many families.'},
 {id:'juneteenth',g:'us',n:'Juneteenth',e:'🕊️',r:{t:'fix',m:6,d:19},s:'Celebrating the end of slavery in the United States',f:'On June 19, 1865, news of freedom reached enslaved people in Texas. It became a national holiday in 2021.'},
 {id:'fathersus',g:'us',n:"Father's Day (US)",e:'👔',r:{t:'nth',m:6,wd:0,n:3},s:'Thanking dads',f:'In the US it’s the third Sunday of June. Taiwan’s Father’s Day is on August 8!'},
 {id:'july4',g:'us',n:'Independence Day',e:'🎆',r:{t:'fix',m:7,d:4},s:'America’s birthday',f:'On July 4, 1776, the Declaration of Independence was adopted. Families watch fireworks and have picnics.',milo:['🎆','fireworks'],
  x:[{q:'How old is the United States on July 4, 2026?',o:['250 years','100 years','76 years'],why:'2026 − 1776 = 250. A big birthday!',lv:'n'}]},
 {id:'labor',g:'us',n:'Labor Day',e:'🛠️',r:{t:'nth',m:9,wd:1,n:1},s:'Honoring workers',f:'It’s the first Monday of September, and lots of kids start school around then.'},
 {id:'halloween',g:'us',n:'Halloween',e:'🎃',r:{t:'fix',m:10,d:31},s:'Costumes and trick-or-treating',f:'Jack-o’-lanterns started as carved turnips in Ireland. Pumpkins came later, in America.',milo:['🎃','pumpkin'],
  x:[{q:'What do kids say at the door on Halloween?',o:['“Trick or treat!”','“Happy birthday!”','“Gong xi fa cai!”'],lv:'l'}]},
 {id:'veterans',g:'us',n:'Veterans Day',e:'🎖️',r:{t:'fix',m:11,d:11},s:'Thanking everyone who served in the military',f:'It’s November 11 because World War I ended on the 11th hour of the 11th day of the 11th month, in 1918.'},
 {id:'thanksgiving',g:'us',n:'Thanksgiving',e:'🦃',r:{t:'nth',m:11,wd:4,n:4},s:'Giving thanks with a big family meal',f:'Many families eat turkey, mashed potatoes and pumpkin pie.',milo:['🦃','turkey'],
  x:[{q:'What food do many families eat at Thanksgiving?',o:['Turkey','Mooncakes','Zongzi'],lv:'l'}]},
 {id:'christmas',g:'us',n:'Christmas',e:'🎄',r:{t:'fix',m:12,d:25},s:'Christians celebrate Jesus’s birth, and families give gifts',f:'Many families decorate a tree, and kids hang stockings.',milo:['🎄','tree']},
 // ---- Taiwan / Chinese ----
 {id:'lny',g:'tw',n:'Lunar New Year',zh:['春節','ㄔㄨㄣ ㄐㄧㄝˊ'],e:'🧧',r:{t:'lunar',lm:1,ld:1,mo:'January or February'},s:'The Chinese New Year: family dinner and red envelopes',
  f:'Kids get red envelopes ('+RB('紅包','ㄏㄨㄥˊ ㄅㄠ')+') with money inside. 2026 was the Year of the Horse. 2027 is the Year of the Goat.',milo:['🧧','red envelope'],
  x:[{q:'What do kids get at Lunar New Year?',o:['Red envelopes with money','Pumpkins','Easter eggs'],lv:'l'},{q:'Which animal is 2027?',o:['Goat','Horse','Dragon','Tiger'],why:'2026 was the Horse, so 2027 is the Goat. The 12 animals take turns.',lv:'n'}]},
 {id:'lantern',g:'tw',n:'Lantern Festival',zh:['元宵節','ㄩㄢˊ ㄒㄧㄠ ㄐㄧㄝˊ'],e:'🏮',r:{t:'lunar',lm:1,ld:15,mo:'February or March'},s:'Lanterns, riddles and sweet rice balls',
  f:'It ends the New Year fun. People eat sweet rice balls ('+RB('湯圓','ㄊㄤ ㄩㄢˊ')+') and guess riddles on lanterns. In Pingxi, Taiwan, sky lanterns float up.',milo:['🏮','lantern'],
  x:[{q:'Lantern Festival is how many days after Lunar New Year’s Day?',o:['14 days','7 days','30 days'],why:'New Year is the 1st day of the 1st month. Lantern Festival is the 15th day. 15 − 1 = 14.',lv:'n'}]},
 {id:'qingming',g:'tw',n:'Tomb Sweeping Day',zh:['清明節','ㄑㄧㄥ ㄇㄧㄥˊ ㄐㄧㄝˊ'],e:'🌿',r:{t:'text',w:'April 4 or 5',mo:'April'},s:'Cleaning family graves to remember ancestors',
  f:'Families visit and clean the graves of grandparents and great-grandparents. Some eat spring rolls ('+RB('潤餅','ㄖㄨㄣˋ ㄅㄧㄥˇ')+').'},
 {id:'children',g:'tw',n:"Children's Day (Taiwan)",zh:['兒童節','ㄦˊ ㄊㄨㄥˊ ㄐㄧㄝˊ'],e:'🧒',r:{t:'fix',m:4,d:4},s:'A special day for kids in Taiwan',f:'It’s the same day as National Ramen Day!'},
 {id:'dragon',g:'tw',n:'Dragon Boat Festival',zh:['端午節','ㄉㄨㄢ ㄨˇ ㄐㄧㄝˊ'],e:'🐉',r:{t:'lunar',lm:5,ld:5,mo:'May or June'},s:'Dragon boat races and sticky rice dumplings',
  f:'People eat zongzi ('+RB('粽子','ㄗㄨㄥˋ ˙ㄗ')+'), rice wrapped in bamboo leaves. Some try to stand an egg on its end at noon!',milo:['🐉','dragon boat'],
  x:[{q:'What food do people eat at Dragon Boat Festival?',o:['Zongzi (sticky rice in leaves)','Turkey','Candy canes'],lv:'l'},{q:'The festival remembers someone from long ago. Who?',o:['Qu Yuan, a poet','George Washington','Santa Claus'],why:'Qu Yuan was a poet in ancient China. People raced boats to look for him.',lv:'n'}]},
 {id:'qixi',g:'tw',n:'Qixi (Chinese Valentine’s Day)',zh:['七夕','ㄑㄧ ㄒㄧˋ'],e:'🌌',r:{t:'lunar',lm:7,ld:7,mo:'August'},s:'A love story: the weaver girl and the cowherd meet once a year',f:'Magpie birds make a bridge across the Milky Way so the two can meet.'},
 {id:'fatherstw',g:'tw',n:"Father's Day (Taiwan)",zh:['父親節','ㄈㄨˋ ㄑㄧㄣ ㄐㄧㄝˊ'],e:'👨',r:{t:'fix',m:8,d:8},s:'Thanking dads in Taiwan',
  f:'8/8 is '+RB('八八','ㄅㄚ ㄅㄚ')+', which sounds like '+RB('爸爸','ㄅㄚˋ ˙ㄅㄚ')+', dad!',
  x:[{q:'Why is Taiwan’s Father’s Day on August 8?',o:['“Eight eight” sounds like “baba,” dad','Dads like the number 8','It is the hottest day'],lv:'n'}]},
 {id:'midautumn',g:'tw',n:'Mid-Autumn Festival',zh:['中秋節','ㄓㄨㄥ ㄑㄧㄡ ㄐㄧㄝˊ'],e:'🥮',r:{t:'lunar',lm:8,ld:15,mo:'September or October'},s:'The moon festival: mooncakes and family',
  f:'The moon is full and bright. In Taiwan, families barbecue outside and eat mooncakes ('+RB('月餅','ㄩㄝˋ ㄅㄧㄥˇ')+') and pomelos. The story says Chang’e ('+RB('嫦娥','ㄔㄤˊ ㄜˊ')+') lives on the moon with a jade rabbit.',milo:['🥮','mooncake'],
  x:[{q:'What do people look at during Mid-Autumn Festival?',o:['The full moon','The sunrise','A rainbow'],lv:'l'},{q:'What do many Taiwan families do outside on Mid-Autumn night?',o:['Have a barbecue','Go trick-or-treating','Hunt for eggs'],lv:'b'}]},
 {id:'teachers',g:'tw',n:"Teachers' Day",zh:['教師節','ㄐㄧㄠˋ ㄕ ㄐㄧㄝˊ'],e:'🍎',r:{t:'fix',m:9,d:28},s:'Thanking teachers',f:'It’s the birthday of Confucius ('+RB('孔子','ㄎㄨㄥˇ ㄗˇ')+'), a famous teacher who lived about 2,500 years ago.'},
 {id:'doubleten',g:'tw',n:'Double Ten Day',zh:['雙十節','ㄕㄨㄤ ㄕˊ ㄐㄧㄝˊ'],e:'🎇',r:{t:'fix',m:10,d:10},s:'Taiwan’s National Day',f:'Double Ten means the 10th day of the 10th month. There are parades and fireworks.'},
 {id:'doublenine',g:'tw',n:'Double Ninth Festival',zh:['重陽節','ㄔㄨㄥˊ ㄧㄤˊ ㄐㄧㄝˊ'],e:'⛰️',r:{t:'lunar',lm:9,ld:9,mo:'October'},s:'Honoring grandparents and older people',f:'Some families climb mountains together on this day.'},
 {id:'dongzhi',g:'tw',n:'Winter Solstice Festival',zh:['冬至','ㄉㄨㄥ ㄓˋ'],e:'🍡',r:{t:'text',w:'December 21 or 22',mo:'December'},s:'The shortest day and longest night of the year',
  f:'Families eat '+RB('湯圓','ㄊㄤ ㄩㄢˊ')+' rice balls. Some grandparents say eating them makes you one year older!'},
 // ---- World ----
 {id:'holi',g:'world',n:'Holi',e:'🎨',r:{t:'text',w:'The full moon in March (sometimes late February)',mo:'March'},s:'Hindu festival of colors that welcomes spring',f:'People throw bright colored powder and water at each other.'},
 {id:'easter',g:'world',n:'Easter',e:'🐣',r:{t:'easter',w:'A Sunday in spring (March or April)',mo:'March or April'},s:'Christians celebrate Jesus rising again, and kids hunt for eggs',f:'Easter moves every year. It is the first Sunday after the first full moon of spring.',milo:['🐣','egg']},
 {id:'eid',g:'world',n:'Eid al-Fitr',e:'🌙',r:{t:'text',w:'It moves about 11 days earlier every year',mo:'It moves every year'},s:'Muslims celebrate the end of Ramadan with feasts and gifts',f:'During Ramadan, many Muslims don’t eat or drink from sunrise to sunset for a month. Eid starts when the new moon is seen.'},
 {id:'diwali',g:'world',n:'Diwali',e:'🪔',r:{t:'text',w:'October or November (on a new moon)',mo:'October or November'},s:'Hindu festival of lights',f:'Families light little oil lamps called diyas, share sweets and set off fireworks.'},
 {id:'dia',g:'world',n:'Día de los Muertos',e:'🌼',r:{t:'fix',m:11,d:1},w:'November 1 and 2',s:'Mexican families remember loved ones who have died',f:'Families build colorful altars with photos, orange marigold flowers and sugar skulls.'},
 {id:'hanukkah',g:'world',n:'Hanukkah',e:'🕎',r:{t:'text',w:'8 nights, usually in December',mo:'December'},s:'Jewish festival of lights that lasts 8 nights',f:'Each night, one more candle is lit on the menorah. Kids spin a top called a dreidel.',milo:['🕎','candles']},
 {id:'kwanzaa',g:'world',n:'Kwanzaa',e:'🕯️',r:{t:'fix',m:12,d:26},w:'December 26 to January 1',s:'Celebrating African American culture and family',f:'It lasts 7 days, one for each of its 7 principles, like unity and creativity.'},
 // ---- Fun days ----
 {id:'popcorn',g:'fun',n:'National Popcorn Day',e:'🍿',r:{t:'fix',m:1,d:19},s:'Munching popcorn',f:'Popcorn pops because the water inside each kernel turns to steam.'},
 {id:'puzzle',g:'fun',n:'National Puzzle Day',e:'🧩',r:{t:'fix',m:1,d:29},s:'Solving puzzles',f:'The first jigsaw puzzles were maps, made in the 1760s to teach geography.'},
 {id:'pizza',g:'fun',n:'National Pizza Day',e:'🍕',r:{t:'fix',m:2,d:9},s:'Eating pizza',f:'Pizza Margherita is red, white and green, like the flag of Italy.',milo:['🍕','pizza']},
 {id:'pi',g:'fun',n:'Pi Day',e:'🥧',r:{t:'fix',m:3,d:14},s:'Math fans celebrate the number pi',f:'Pi is about 3.14, so Pi Day is 3/14! Pi tells how far around a circle is compared to how far across.',
  x:[{q:'Why is Pi Day on March 14?',o:['March 14 is 3/14, like pi ≈ 3.14','Pies are ripe in March','It is the 14th holiday'],lv:'b'},{q:'A circle is 10 cm across. About how far is it around?',o:['About 31 cm','About 10 cm','About 14 cm'],why:'Around = pi × across ≈ 3.14 × 10 ≈ 31.4 cm.',lv:'n'}]},
 {id:'ramen',g:'fun',n:'National Ramen Day',e:'🍜',r:{t:'fix',m:4,d:4},s:'Slurping ramen noodles',f:'Instant ramen was invented in Japan in 1958 by Momofuku Ando.',
  x:[{q:'Which Taiwan holiday is on the same day as National Ramen Day?',o:["Children's Day","Teachers' Day",'Double Ten Day'],why:'Both are on April 4.',lv:'b'}]},
 {id:'boba',g:'fun',n:'National Bubble Tea Day',e:'🧋',r:{t:'fix',m:4,d:30},s:'Drinking boba',f:'Bubble tea ('+RB('珍珠奶茶','ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ')+') was invented in Taiwan in the 1980s. The chewy balls are tapioca pearls.',milo:['🧋','boba'],
  x:[{q:'Where was bubble tea invented?',o:['Taiwan','Italy','Mexico'],lv:'b'}]},
 {id:'dino',g:'fun',n:'National Dinosaur Day',e:'🦖',r:{t:'fix',m:6,d:1},s:'Celebrating dinosaurs',f:'Tyrannosaurus rex was about as long as a school bus!',milo:['🦖','dinosaur']},
 {id:'donut',g:'fun',n:'National Donut Day',e:'🍩',r:{t:'nth',m:6,wd:5,n:1},s:'Eating donuts',f:'It started in 1938 to thank volunteers who served donuts to soldiers in World War I.'},
 {id:'sushi',g:'fun',n:'International Sushi Day',e:'🍣',r:{t:'fix',m:6,d:18},s:'Eating sushi',f:'Sushi means rice with vinegar. It doesn’t have to have fish!'},
 {id:'emoji',g:'fun',n:'World Emoji Day',e:'😀',r:{t:'fix',m:7,d:17},s:'Celebrating emoji',f:'July 17 is the date shown on the 📅 calendar emoji!'},
 {id:'icecream',g:'fun',n:'National Ice Cream Day',e:'🍦',r:{t:'nth',m:7,wd:0,n:3},s:'Eating ice cream',f:'In 1984, President Reagan made July National Ice Cream Month.',milo:['🍦','ice cream']},
 {id:'pirate',g:'fun',n:'Talk Like a Pirate Day',e:'🏴‍☠️',r:{t:'fix',m:9,d:19},s:'Talking like a pirate. Arrr!',f:'Pirates say “Ahoy, matey!” to say hello.'},
 {id:'dumpling',g:'fun',n:'National Dumpling Day',e:'🥟',r:{t:'fix',m:9,d:26},s:'Eating dumplings',f:'In Taiwan, lots of people love boiled dumplings ('+RB('水餃','ㄕㄨㄟˇ ㄐㄧㄠˇ')+').'},
 {id:'taco',g:'fun',n:'National Taco Day',e:'🌮',r:{t:'fix',m:10,d:4},s:'Eating tacos',f:'Tacos come from Mexico, where people have eaten them for hundreds of years.'},
 {id:'cookie',g:'fun',n:'National Cookie Day',e:'🍪',r:{t:'fix',m:12,d:4},s:'Baking and eating cookies',f:'The chocolate chip cookie was invented in 1938 in Massachusetts.'}
];
