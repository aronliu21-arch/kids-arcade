// ================= YEAR 3 · THE SILVER PEN =================
// Story data. The engine that runs it is in 18-Y3ENG.js.
NAMES.celeste='Celeste'; NAMES.pip='Pip'; NAMES.pen='The Silver Pen'; NAMES.mirror='???';
Object.assign(CAST,{
 celeste:{cast:['Serena','Kate','Samantha'],pitch:1.2,rate:1.0},
 pip:{cast:['Samantha','Ava'],pitch:2.0,rate:1.15},
 pen:{cast:['Daniel','Moira','Samantha'],pitch:.75,rate:.84},
 mirror:{cast:['Ava','Samantha','Zoe'],pitch:.95,rate:.9},
});
// Celeste and Pip use simple drawn placeholders until their painted pictures are made
Object.assign(HAIR,{celeste:'#e9ecef'}); Object.assign(ROBE,{celeste:'#1971c2'}); Object.assign(TRIM,{celeste:'#d0ebff'});
if(!DRAGONS.pip) DRAGONS.pip=Object.assign({},DRAGONS.thistle,{c:'#c08a4a',wing:'#f1dcb8',horn:'#ffd43b',belly:'#fff4e0'});
const PEN=(x=700,y=300,s=1,o={})=>`<g class="float" transform="translate(${x},${y}) scale(${s}) rotate(${o.rot??-30})"><ellipse cx="0" cy="0" rx="120" ry="60" fill="url(#warm)" opacity="${o.dark?.15:.55}"/><path d="M-10 -120Q40 -150 70 -190Q60 -110 14 -70Z" fill="#e9ecef" stroke="#adb5bd" stroke-width="3"/><path d="M-10 -120L14 -70" stroke="#adb5bd" stroke-width="2"/><rect x="-12" y="-80" width="24" height="150" rx="10" fill="${o.dark?'#495057':'#ced4da'}" stroke="#868e96" stroke-width="3"/><rect x="-12" y="-20" width="24" height="10" fill="#7048e8"/><path d="M-12 70L0 110L12 70Z" fill="#343a40"/>${o.eye?`<ellipse cx="0" cy="-40" rx="7" ry="9" fill="#b197fc" filter="url(#glow)"/>`:''}</g>`;
const MIRRORDEF=`<defs><filter id="mirrorF"><feColorMatrix type="hueRotate" values="160"/><feColorMatrix type="saturate" values=".55"/></filter></defs>`;
const MIRROR=(x,y,s,o={})=>MIRRORDEF+`<g filter="url(#mirrorF)" opacity=".82">${girl('nora',x,y,s,Object.assign({badge:false},o))}</g>`;
const Y3CARD=(top,big)=>svg(`<rect width="1024" height="640" fill="#2b2440"/><circle cx="512" cy="320" r="300" fill="url(#warm)" opacity=".5"/><text x="512" y="250" text-anchor="middle" font-family="Poppins,system-ui" font-weight="800" font-size="44" fill="#ffd43b" letter-spacing="8">${top}</text><text x="512" y="360" text-anchor="middle" font-family="'TeX Gyre Chorus','Snell Roundhand',cursive" font-size="96" fill="#fff3bf" filter="url(#glow)">${big}</text>`);
const PIP=(x,y,s,o={})=>D2(x,y,s,Object.assign({who:'pip'},o));
const Y3={};
Y3.INTRO=()=>[
 say(null,"Summer flew by. Lucas practiced his writing on the back porch every morning, and Ember grew so big that she no longer fit through the kitchen door.",sc('home',[['nora',330,250,1,{expr:'happy',arm:'wand'}]],D2(720,320,.8,{expr:'happy'}))),
 say('gran',"Look at the two of you. Last year she rode on your shoulder. This year, I think you'll be riding on hers!",sc('home',[['gran',300,270,1,{expr:'happy'}],['nora',700,250,1,{expr:'wow'}]])),
 say(null,"A letter in silver ink arrived from Wren. Her writing was perfect. Not one wobble. Not one smudge. Wren had never written like that before.",sc('home',[['nora',512,250,1.05,{arm:'hold',expr:'wow'}]],ENVELOPE)),
 say('nora',"Wow, Wren. Your handwriting got so good. I wonder how.",sc('home',[['nora',512,250,1.05,{arm:'hold'}]])),
 say(null,"Far away, in the dark of the library attic, something silver was writing all by itself. Lucas's name. Again, and again, and again.",sc('attic',[],PEN(512,320,1.2,{eye:true})),{sfx:'dissolve'}),
];
Y3.CH=[
 {n:1,title:'The Silver Pen',theme:'night',missions:[
  {id:'back3',icon:'🏰',name:'Academy Gate',bg:'gate',kind:'story',story:'y3back',title:'Third-Years at Last'},
  {id:'hello3',icon:'🎉',name:'Great Hall',bg:'hall',kind:'write',pool:'y3hello',title:'New-Term Phrases',goal:'Light the new-term lanterns',done:'Every lantern is glowing!',
   intro:'Third-years write whole phrases. Listen, then write both words, with a space in between.',tip:'Try it today: write a two-word greeting card for someone in your family.'},
  {id:'celeste',icon:'⭐',name:'Courtyard',bg:'courtyard',kind:'story',story:'y3celeste',title:'The Girl from Starfall'},
  {id:'duel1',icon:'⚔️',name:'Duel Ring',bg:'arena',kind:'battle',foe:'celeste1',pre:'y3duel1Pre',post:'y3duel1Post',timed:35,title:'A Welcome Duel',tip:'Try it today: when you lose a game, shake hands and say good game.'},
  {id:'pen',icon:'🖋️',name:'Common Room',bg:'common',kind:'story',story:'y3pen',title:'Wren\'s New Pen'},
  {id:'lant3',icon:'🏮',name:'Sky Garden',bg:'peaks',kind:'mini',game:'lanterns',after:'pen'},
 ]},
 {n:2,title:'Wings and Fire',theme:'dusk',missions:[
  {id:'note',icon:'✉️',name:'Dorm Room',bg:'room',kind:'story',story:'y3note',title:'A Note in My Handwriting'},
  {id:'hatch',icon:'🥚',name:'Griffin Roost',bg:'roost',kind:'story',story:'y3hatch',title:'The Egg in the Tower'},
  {id:'pipW',icon:'🪶',name:'Griffin Roost',bg:'roost',kind:'write',pool:'y3pip',title:'Gentle Phrases',goal:'Calm the baby griffin',done:'Pip is purring like a kitten!',
   intro:'Pip is frightened. Write gentle phrases, slow and soft, all on your own.',tip:'Try it today: speak softly to a pet or a little one who is scared.'},
  {id:'flight',icon:'🐉',name:'Dragon Field',bg:'field',kind:'story',story:'y3flight',title:'Riding Ember'},
  {id:'fakes',icon:'🔍',name:'Hallways',bg:'stairs',kind:'read',fix:true,title:'Spot the Forgeries',goal:'Fix the forged notes',done:'Every forgery is caught!',
   intro:'The forged notes look like real handwriting, but each word is spelled wrong. Read it, then type the word the right way.',tip:'Try it today: check one thing you wrote today for spelling mistakes.'},
  {id:'broom3',icon:'🧹',name:'Broom Field',bg:'field',kind:'mini',game:'broom',after:'flight'},
 ]},
 {n:3,title:'Forgeries',theme:'violet',missions:[
  {id:'blame',icon:'🌿',name:'Greenhouse',bg:'greenhouse',kind:'story',story:'y3blame',title:'Who Cast That Spell?'},
  {id:'vines',icon:'🌱',name:'Greenhouse',bg:'greenhouse',kind:'battle',foe:'vines',pre:'y3vinesPre',post:'y3vinesPost',title:'The Wild Vines',tip:'Try it today: help water the plants, but not too much!'},
  {id:'office',icon:'🗝️',name:'Deputy\'s Office',bg:'office',kind:'story',story:'y3office',title:'Ms. Wick\'s Office'},
  {id:'truth',icon:'🧪',name:'Potion Room',bg:'cellar',kind:'write',recipe:'truth',title:'Truth Ink',goal:'Brew truth ink, step by step',done:'The truth ink is bubbling silver!',
   intro:'Follow Aunt Saffron\'s recipe. Write each step in order, and the ink will brew.',tip:'Try it today: follow a recipe with a grown-up, one step at a time.'},
  {id:'potion3',icon:'🧪',name:'Potion Room',bg:'cellar',kind:'mini',game:'potion',after:'truth'},
  {id:'reveal',icon:'✨',name:'Library',bg:'library',kind:'story',story:'y3reveal',title:'The Silver Glow'},
 ]},
 {n:4,title:'Wren\'s Secret',theme:'night',missions:[
  {id:'wren3',icon:'🕯️',name:'Owl Tower',bg:'tower',kind:'story',story:'y3wren',title:'Wren Tells the Truth'},
  {id:'escape',icon:'🪟',name:'Griffin Roost',bg:'roost',kind:'story',story:'y3escape',title:'The Pen Escapes'},
  {id:'riddles',icon:'❓',name:'Silver Trail',bg:'stairs',kind:'write',clue:true,pool:'y3clue',title:'The Pen\'s Riddles',goal:'Answer the riddles to follow the trail',done:'Pip has found the trail!',
   intro:'The pen left riddles along the trail. Read each riddle, then write the answer. No word to copy this time!',tip:'Try it today: make up a riddle for someone in your family.'},
  {id:'forgers',icon:'🔤',name:'Owl Tower',bg:'tower',kind:'battle',foe:'forgers',pre:'y3forgersPre',post:'y3forgersPost',title:'The Forged Letters',tip:'Try it today: sign your name in your very own handwriting.'},
  {id:'wickSec',icon:'📷',name:'Deputy\'s Office',bg:'office',kind:'story',story:'y3wick',title:'An Old Photograph'},
  {id:'fly3',icon:'✨',name:'Firefly Garden',bg:'courtyard',kind:'mini',game:'fireflies',after:'wickSec'},
 ]},
 {n:5,title:'Rivals and Friends',theme:'dusk',missions:[
  {id:'ask',icon:'🤝',name:'Duel Ring',bg:'arena',kind:'story',story:'y3ask',title:'Asking Celeste'},
  {id:'duel2',icon:'⚔️',name:'Duel Ring',bg:'arena',kind:'battle',foe:'celeste2',pre:'y3duel2Pre',post:'y3duel2Post',timed:28,title:'The Real Duel',tip:'Try it today: practice something hard for five minutes with a timer.'},
  {id:'signs',icon:'🪧',name:'Castle Halls',bg:'hall',kind:'read',fix:true,title:'The Mixed-Up Signs',goal:'Fix the castle signs',done:'Everyone can find their way again!',
   intro:'The pen rewrote the castle signs, and every one is spelled wrong. Type each sign the right way.',tip:'Try it today: read three signs on the way to school or the store.'},
  {id:'guardW',icon:'🛡️',name:'Duel Ring',bg:'arena',kind:'write',pool:'y3guard',title:'Celeste\'s Duel Moves',goal:'Learn the duelist\'s calls',done:'You move like a real duelist!',
   intro:'Celeste teaches the calls duelists shout to stay safe. Write each one, quick but neat.',tip:'Try it today: play a game where you have to be quick and careful.'},
  {id:'climb',icon:'🕰️',name:'Clock Tower',bg:'clock',kind:'story',story:'y3climb',title:'The Long Climb'},
  {id:'lant4',icon:'🏮',name:'Sky Garden',bg:'peaks',kind:'mini',game:'lanterns',after:'guardW'},
 ]},
 {n:6,title:'The Last Signature',theme:'violet',missions:[
  {id:'face',icon:'🖋️',name:'Clock Tower',bg:'clock',kind:'story',story:'y3face',title:'Face to Face'},
  {id:'penB',icon:'⚔️',name:'Clock Tower',bg:'clock',kind:'battle',foe:'pen1',pre:'y3penPre',post:'y3penPost',timed:32,title:'The Silver Pen',tip:'Try it today: when something tempts you to take a shortcut, pick the honest way.'},
  {id:'ownW',icon:'💜',name:'Clock Tower',bg:'clock',kind:'write',pool:'y3own',title:'My Own Words',goal:'Write in your very own hand',done:'Your own words shine brighter than silver!',
   intro:'Wren and Lucas write together, in their own real handwriting. Wobbles are allowed. Faking is not.',tip:'Try it today: write a short note in your own handwriting, even if it wobbles.'},
  {id:'penFinal',icon:'🔥',name:'Clock Face',bg:'clock',kind:'battle',foe:'pen2',pre:'y3finalPre',post:'y3finalPost',timed:30,title:'The Last Signature',tip:'Try it today: tell someone one thing you did all by yourself this year.'},
  {id:'party3',icon:'🎊',name:'Great Hall',bg:'hall',kind:'story',story:'y3party',title:'A Feast for Third-Years'},
 ]},
];
// helpers: when the foe's HP drops to `at` × max, a friend or teacher joins the fight
const HELP=(who,line,o={})=>Object.assign({lines:()=>[say(who,line,sc(o.bg||'clock',[['nora',300,250,1,{arm:'wand',expr:'wow'}],[who,720,o.y||265,1,{arm:'wand',expr:'happy',flip:true}]],o.x||''),{sfx:'gold'})]},o);
Y3.FOES={
 celeste1:{name:'Celeste (friendly duel)',hp:5,weak:'ice',kind:'girl',who:'celeste',shield:'#a5d8ff',bg:'arena',duel:true},
 vines:{name:'Wild Vines',hp:9,minCasts:6,weak:'fire',kind:'blob',body:'#2b8a3e',eye:'#ffd43b',bg:'greenhouse',
  helpers:[HELP('juni',"Wait! I know these plants! Sleepy-root, sleepy-root… there. They're getting drowsy. Hit them now!",{at:.5,bg:'greenhouse',el:'earth',emoji:'🌱',dmg:2,msg:'Jun put the vines to sleep! -2'})]},
 forgers:{name:'Forged Letters',hp:9,minCasts:6,weak:'light',kind:'imps',body:'#868e96',eye:'#e5dbff',bg:'tower',
  helpers:[HELP('opal',"Pip, GO! Griffins eat bad ink for breakfast!",{at:.5,bg:'tower',el:'wind',emoji:'🪶',dmg:2,msg:'Pip swooped in and gobbled a forged letter! -2',x:PIP(512,400,.45,{expr:'happy',fly:true})})]},
 celeste2:{name:'Celeste (real duel)',hp:6,weak:'bolt',kind:'girl',who:'celeste',shield:'#74c0fc',bg:'arena',duel:true},
 pen1:{name:'The Silver Pen',hp:12,minCasts:8,weak:'light',kind:'crystal',body:'#ced4da',eye:'#7048e8',bg:'clock',boss:true,armor:true,
  helpers:[HELP('wick',"I ran away from this pen once, a long time ago. Not this time! Silver to dust, ink to air!",{at:.85,el:'light',emoji:'🌟',dmg:2,breakArmor:true,msg:'Ms. Wick broke the silver armor! Now your spells can really hurt it!'}),
           HELP('celeste',"Partner! I'll hold the shield. You just keep writing!",{at:.4,y:270,el:'ice',emoji:'❄️',dmg:1,msg:'Celeste froze the pen in place! Hearts full again!'})]},
 pen2:{name:'The Silver Pen, Unleashed',hp:14,minCasts:9,weak:'fire',kind:'spirit',body:'#495057',eye:'#e5dbff',bg:'clock',boss:true,armor:true,
  helpers:[HELP('prof',"Inkwell does not let its students fight alone! Duelists, together, NOW!",{at:.9,el:'bolt',emoji:'⚡',dmg:2,breakArmor:true,msg:'Professor Quill shattered the armor! Every real word counts now!'}),
           HELP('wren',"Ember, help me! My own wobbly words, with your real fire!",{at:.5,y:270,el:'fire',emoji:'🔥',dmg:3,msg:'Wren and Ember hit it together! -3!',x:D2(880,200,.4,{fly:true})}),
           HELP('mei',"Everybody's here, Lucas! The whole school is cheering for you!",{at:.2,y:280,el:'light',emoji:'💜',dmg:1,msg:'The whole school is cheering! Hearts full! Finish it!'})]},
};
// ---------- phrases (Year 3 writes phrases; nothing here was practiced in Year 1 or 2)
Y3.POOLS_W={
 y3hello:['good morning','new term','see you','hi again','third year','missed you','fresh start','new books','all aboard','big day'],
 y3pip:['soft wings','tiny beak','sleep tight','little one','fluffy tail','warm nest','sweet dreams','gentle now','hush now','good girl'],
 y3guard:['arms up','dig in','look out','stay low','duck down','eyes open','feet firm','stay sharp','turn fast','step back'],
 y3own:['my own hand','my own words','wobbly is ok','I wrote this','real and true','one more try','from my heart','slow and sure','just me','I tried'],
};
// clue spells: he sees only the riddle, then writes the answer
Y3.CLUE={
 'ice cream':'A cold, sweet treat in a cone. Two words.',
 'snowman':'You build him in winter from three big snowballs.',
 'starfish':'A sea animal shaped like a star.',
 'pancakes':'Flat, round breakfast. Stack them up and pour on syrup!',
 'goldfish':'A little orange pet that swims around and around its bowl.',
 'sunflower':'A tall yellow flower that turns its face to the sun.',
 'cupcake':'A tiny cake with frosting on top.',
 'jellyfish':'A see-through sea creature that wobbles.',
 'toothbrush':'You use it twice a day to keep your teeth clean.',
 'pine tree':'A tall tree with needles instead of leaves. Two words.',
 'full moon':'When the moon is a whole, round circle. Two words.',
 'butterfly':'It starts as a caterpillar, then grows colorful wings.',
};
Y3.POOLS_W.y3clue=Object.keys(Y3.CLUE);
// recipe: written in order, each step one practice
Y3.RECIPE={
 truth:{title:'Aunt Saffron\'s Truth Ink',steps:['one moon drop','two feathers','stir slowly','add lemon','whisper true']},
};
// spot the forgery: [what the pen wrote, the right spelling]
Y3.FIX={
 fakes:[['kitchin','kitchen'],['purpel','purple'],['yelow','yellow'],['teecher','teacher'],['dinnar','dinner'],['tomorow','tomorrow'],['brekfast','breakfast'],['beleeve','believe'],['pumkin','pumpkin']],
 signs:[['libary','library'],['stares','stairs'],['halway','hallway'],['clasroom','classroom'],['offise','office'],['entrence','entrance'],['clok','clock'],['kichens','kitchens'],['nirse','nurse']],
};
// battle spells (phrases) and shields
Y3.SPELLS={
 fire:['red flare','hot coals','fire ring','sun flame','fire bird','lava pop','fire dance','big blaze','hot sauce','campfire','fire tail','sizzle pop'],
 ice:['snow globe','frost star','ice shard','cold snap','ice flower','snow owl','deep freeze','hail fall'],
 water:['big wave','sea spray','tidal pool','water jet','rain drops','sea foam','blue lake','water whip'],
 wind:['wind gust','sky swirl','air blast','fast wind','wild gust','big breeze','tail wind','wind howl'],
 light:['sun burst','star beam','moon glow','gold light','day break','bright ray','star shine','glow worm','sunshine','night light','lamp glow','lamp post'],
 earth:['stone fist','mud pie','big rock','tree root','sand storm','clay ball','moss bed','rock slide'],
 bolt:['storm bolt','sky spark','thunderclap','quick zap','volt ball','buzz bolt','power jolt','zip zap'],
};
Y3.SHIELD=['stand firm','stay safe','hold strong','shield up','safe inside','big bubble','glass wall','stone dome','iron gate','brave heart','steady hand','no fear','calm mind','guard me','still water','star shield','moon shield','warm cloak','tall tower','safe harbor'];
Y3.TREASURE={1:['hello3','celeste'],2:['hatch','fakes'],3:['blame','truth'],4:['escape','riddles'],5:['signs','climb'],6:['face','ownW']};
Y3.TREASURE_TXT=['a silver button','a griffin feather','a blue star pin from Celeste','a tiny clock gear','a drop of truth ink','a ribbon from Opal','a doodle from Wren','a lucky pebble','a golden dragon scale','a paper bird','a pressed violet','a crystal bead'];

const s3=(bg,list,x)=>sc(bg,list,x);
Y3.STORIES={
 // ---------- Chapter 1
 y3back:done=>{ playStory([
  say(null,"This year, Lucas doesn't arrive by paper-bird carriage. He arrives on Ember's back, holding on tight, his hair streaming in the wind.",s3('gate',[],D2(512,300,.9,{fly:true,expr:'happy'})),{sfx:'whoosh'}),
  say('mei',"LUCAS! You're RIDING her? That is the coolest thing I have ever seen in my whole life!",s3('gate',[['mei',250,280,.9,{expr:'wow',arm:'wave'}],['nora',600,250,1,{arm:'wave',expr:'happy'}]],D2(860,330,.6,{expr:'happy'}))),
  say('opal',"Show-off. …Can I pet her later?",s3('gate',[['opal',250,270,.95,{expr:'happy'}],['nora',600,250,1,{expr:'happy'}]])),
  say('nora',"Of course! She likes it right behind the horns. Opal, you look happy. Like, really happy.",s3('gate',[['opal',250,270,.95,{expr:'happy'}],['nora',600,250,1,{expr:'happy'}]])),
  say('opal',"I am. For the first time, I came back to a school where I have friends.",s3('gate',[['opal',250,270,.95,{expr:'happy'}],['nora',600,250,1,{expr:'happy'}]])),
  say('prof',"Welcome, third-years! A little news before the feast. Ms. Wick has become our new Deputy Head.",s3('gate',[['prof',330,250,1,{arm:'wave'}],['wick',700,260,1,{expr:'happy'}]])),
  say('wick',"Thank you, Professor. This year, you will write whole phrases. And remember: your handwriting is yours. Nobody else can write it for you.",s3('gate',[['prof',330,250,1,{}],['wick',700,260,1,{expr:'happy'}]])),
  say(null,"Lucas thinks about Wren's perfect letter. For some reason, Ms. Wick's words make him shiver a little.",s3('gate',[['nora',512,250,1.05,{expr:'sad'}]])),
 ],done); },
 y3celeste:done=>{ const s=(n,c,o)=>s3('courtyard',[['nora',260,250,1,n],['celeste',560,270,1,c],['opal',830,270,.95,{...o,flip:true}]]); playStory([
  say(null,"In the courtyard, a crowd has gathered around a tall girl with silver-white hair. She spins her wand, and a ribbon of ice-blue light writes her name in the air.",s({expr:'wow'},{arm:'wand',expr:'happy'},{expr:'wow'}),{sfx:'chime'}),
  say('opal',"Oh no. It's Celeste. She was the best student at Starfall Academy. The best at everything.",s({},{arm:'wand'},{expr:'sad'})),
  say('celeste',"Opal! So THIS is where you ran away to. And you must be the famous Lucas. I've read all about you.",s({expr:'wow'},{expr:'smirk'},{expr:'sad'})),
  say('celeste',"Saved the world's words. Tamed a dragon. Very impressive. For a boy who still writes his spells like a second-year.",s({expr:'sad'},{expr:'smirk'},{expr:'sad'})),
  say(null,"Some kids giggle. Lucas's cheeks go hot. What should he do?",s({expr:'sad'},{expr:'smirk'},{expr:'sad'}),{choices:[
   {t:"😠 “At least I have friends!”",ok:false,why:"Celeste's smile freezes, and for a second she looks hurt. Saying something mean back only makes things worse. Try again."},
   {t:"🙂 “I'm still learning. Want to practice together sometime?”",ok:true,reply:[
    say('nora',"You're right, I'm still learning. Everybody is. Want to practice together sometime?",s({arm:'wave'},{expr:'wow'},{expr:'wow'})),
    say('celeste',"Practice? Together? …No. A duel. Tomorrow, in the duel ring. Let's see what the famous Lucas can really do.",s({expr:'wow'},{expr:'smirk'},{expr:'wow'})),
    say('opal',"She does that. She turns everything into a contest. At Starfall, nobody ever wanted to be her partner.",s({},{},{expr:'sad'})),
    say(null,"Celeste walks away with her chin up. But Lucas notices that nobody walks with her.",s({expr:'sad'},{},{expr:'sad'})),
   ]},
   {t:"😶 Say nothing and walk away",ok:false,why:"Walking away is okay sometimes, but Lucas can be friendly and stand tall at the same time. Try again."},
  ]}),
 ],done); },
 y3duel1Pre:done=>{ const s=(n,c)=>s3('arena',[['nora',300,250,1,n],['celeste',720,270,1,{...c,flip:true}]]); playStory([
  say(null,"The duel ring is a circle of white stones. Professor Quill stands at the edge with a big brass timer.",s({arm:'wand'},{arm:'wand'})),
  say('prof',"Real duelists don't get forever. Each spell has a timer. Cast before the sand runs out, or your opponent gets a free shot!",s3('arena',[['prof',512,250,1,{arm:'wave'}]])),
  say('celeste',"Ice is my favorite. Ready, famous Lucas?",s({arm:'wand',expr:'wow'},{arm:'wand',expr:'smirk'})),
  say('nora',"Ready. And it's just Lucas.",s({arm:'wand',expr:'smirk'},{arm:'wand'})),
 ],done); },
 y3duel1Post:done=>{ const s=(n,c)=>s3('arena',[['nora',300,250,1,n],['celeste',720,270,1,{...c,flip:true}]]); playStory([
  say(null,"Celeste's shield shatters into snowflakes. The whole crowd goes quiet. Then they cheer.",s({arm:'wand',expr:'wow'},{expr:'wow'}),{sfx:'gold'}),
  say('celeste',"You… beat me. Nobody beats me.",s({expr:'wow'},{expr:'sad'})),
  say('nora',"Good duel. You're really fast. You almost had me twice.",s({arm:'wave',expr:'happy'},{expr:'wow'})),
  say('celeste',"…Next time, I won't go easy on you.",s({expr:'happy'},{expr:'smirk'})),
  say(null,"But as she turns, Lucas sees Celeste blink very fast, like she's trying not to cry.",s({expr:'sad'},{expr:'sad'})),
 ],done); },
 y3pen:done=>{ const s=(n,w,x='')=>s3('common',[['nora',300,250,1,n],['wren',720,270,1,{...w,flip:true}]],x); playStory([
  say(null,"That evening, Wren is in the common room, writing a letter to her grandmother. Her pen is long, silver and beautiful.",s({},{arm:'hold'},PEN(860,250,.6))),
  say('nora',"Wren! Your letter this summer was amazing. Your handwriting is perfect now!",s({expr:'happy',arm:'wave'},{expr:'wow'})),
  say('wren',"Oh. Um. Thank you. It's this pen. I found it in a box in the library attic, the week before the summer party. It helps me.",s({},{expr:'sad'},PEN(860,250,.6))),
  say('nora',"Helps you how?",s({expr:'wow'},{expr:'sad'})),
  say('wren',"My hand always wobbles when I'm nervous. With this pen, it doesn't. It just… knows where to go.",s({expr:'wow'},{expr:'sad',arm:'hold'},PEN(860,250,.6))),
  say(null,"The pen gives a tiny hum, like a cat purring. Lucas is almost sure it turned, just a little, to look at him.",s({expr:'wow'},{},PEN(860,250,.6,{eye:true})),{sfx:'chime'}),
  say('nora',"Wren, a pen that writes by itself… Last year, a diary from that same attic told me lies. Will you be careful?",s({expr:'sad'},{expr:'sad'})),
  say('wren',"It's just a pen, Lucas. Not everything is a monster. I'm finally good at something. Please be happy for me.",s({expr:'sad'},{expr:'sad'})),
 ],done); },
 // ---------- Chapter 2
 y3note:done=>{ const s=(n,m,o)=>s3('room',[['nora',300,250,1,n],['mei',600,280,.9,m],['opal',850,270,.95,{...o,flip:true}]]); playStory([
  say(null,"In the morning, Lucas shows his friends the note. It says: Celeste is a cheater. And it's in Lucas's handwriting. Exactly his handwriting.",s({arm:'hold',expr:'sad'},{expr:'wow'},{expr:'wow'})),
  say('nora',"I didn't write this. I promise. But it looks just like mine. Even the little loop on my capital C.",s({arm:'hold',expr:'sad'},{expr:'sad'},{expr:'sad'})),
  say('mei',"I believe you. You'd never write something mean about someone.",s({expr:'sad'},{expr:'happy'},{})),
  say('nora',"Last year I kept a secret and it almost cost me everything. So this time I'm telling you right away. Both of you.",s({arm:'wand'},{expr:'happy'},{expr:'happy'})),
  say('opal',"Good. Because I have something to tell you too. There's an egg in the old griffin roost. A HUGE egg. And it's starting to crack.",s({expr:'wow'},{expr:'wow'},{expr:'wow'})),
 ],done); },
 y3hatch:done=>{ const s=(n,o,x)=>s3('roost',[['nora',280,250,1,n],['opal',720,270,1,{...o,flip:true}]],x); playStory([
  say(null,"At the top of the old tower, in a nest of straw and feathers, a golden egg is rocking back and forth.",s({expr:'wow'},{expr:'wow'},D2(512,380,.6,{stage:'egg',crack:true}))),
  say(null,"CRACK! Out tumbles a fluffy baby griffin, with an eagle's head, a lion cub's body and two wet little wings.",s({expr:'wow'},{expr:'wow'},PIP(512,380,.5,{expr:'happy'})),{sfx:'gold'}),
  say('pip',"SKREEEE!",s({expr:'wow'},{expr:'wow'},PIP(512,380,.5,{expr:'wow'}))),
  say(null,"The griffin flaps in a panic and knocks over a lantern. Lucas reaches out, and the griffin hides behind Opal's legs.",s({expr:'sad',arm:'wave'},{expr:'wow'},PIP(600,400,.5,{})),{sfx:'poof'}),
  say('opal',"Shh, shh. It's okay, little one. I'm here. Nobody's going to hurt you.",s({expr:'happy'},{expr:'happy',arm:'hold'},PIP(620,400,.45,{expr:'closed'}))),
  say('nora',"Opal, she likes you! I think she thinks you're her mom.",s({expr:'happy'},{expr:'wow'},PIP(620,400,.45,{expr:'closed'}))),
  say('opal',"Me? Nobody ever picks me first. …Pip. Her name is Pip. Help me calm her down?",s({expr:'happy'},{expr:'happy'},PIP(620,400,.45,{expr:'happy'}))),
 ],done); },
 y3flight:done=>{ const s=(n,b,x)=>s3('field',[['nora',300,250,1,n],['bree',740,260,1,{...b,flip:true}]],x); playStory([
  say('bree',"All right, Lucas. Ember's big enough to carry you properly now. Today's lesson: a real flight. Hold on with your knees, not your hands.",s({expr:'wow'},{arm:'wave'})),
  say(null,"Ember crouches. Lucas climbs up between her wings. Then, with one mighty push, they're in the sky.",s3('field',[],D2(512,260,.85,{fly:true,expr:'happy'})),{sfx:'whoosh'}),
  say('nora',"WHOOOAAA! Ember, we're flying! We're really flying!",s3('peaks',[],D2(512,260,.85,{fly:true,expr:'happy'}))),
  say(null,"Over the lake, a flock of crows dives at them, cawing. Ember takes a deep breath, deeper than ever before, and…",s3('peaks',[],D2(512,260,.85,{fly:true,expr:'wow'}))),
  say(null,"WHOOSH! A real burst of golden fire! Not a sneeze, not a spark. Real dragon fire. The crows scatter.",s3('peaks',[],D2(512,260,.85,{fly:true,expr:'happy'})),{sfx:'fire'}),
  say('bree',"Ha! Her first real flame! From now on, she'll help you in battles. Ember's fire is yours to call on, Lucas.",s({expr:'happy',arm:'wave'},{expr:'happy'},D2(560,360,.6,{expr:'happy'}))),
  say(null,"Back on the ground, Lucas finds more notes stuck to the castle walls. All in someone's copied handwriting. And all spelled very, very wrong.",s3('stairs',[['nora',512,250,1.05,{expr:'wow',arm:'hold'}]])),
 ],done); },
 // ---------- Chapter 3
 y3blame:done=>{ const s=(n,c,p)=>s3('greenhouse',[['nora',260,250,1,n],['celeste',560,270,1,c],['prof',830,250,1,{...p,flip:true}]]); playStory([
  say(null,"The greenhouse has turned into a jungle! Vines curl up the windows and snake across the floor. Pots are smashed everywhere.",s({expr:'wow'},{expr:'wow'},{expr:'wow'}),{sfx:'boom'}),
  say('prof',"There was a growing spell written on the board. Signed by… Celeste.",s({expr:'sad'},{expr:'wow'},{arm:'hold'})),
  say('celeste',"That's not mine! I would never write a spell that sloppy!",s({expr:'sad'},{expr:'sad'},{})),
  say(null,"Everyone stares at Celeste. Some kids whisper. Lucas remembers the note in his own handwriting. What should he do?",s({expr:'sad'},{expr:'sad'},{}),{choices:[
   {t:"🤐 Stay quiet. Celeste was mean to her anyway.",ok:false,why:"Lucas knows how it feels to be blamed for something he didn't write. Being fair matters most when it's hard. Try again."},
   {t:"🗣️ “Professor, someone is copying our handwriting. They did it to me too.”",ok:true,reply:[
    say('nora',"Professor, I don't think Celeste wrote it. Someone wrote a note in MY handwriting last week. I think someone is copying us.",s({arm:'wand'},{expr:'wow'},{expr:'wow'})),
    say('prof',"That is a very serious thing to say, Lucas. Then we must take this to the Deputy Head. But first… those vines!",s({},{expr:'wow'},{arm:'wand'})),
   ]},
   {t:"😬 Say it was probably Celeste",ok:false,why:"Lucas doesn't actually know that. Guessing out loud can hurt someone who did nothing wrong. Try again."},
  ]}),
 ],done); },
 y3vinesPre:done=>playStory([
  say(null,"A huge vine rears up like a green snake, its flowers snapping like little mouths. It's coming straight at Lucas and Celeste!",s3('greenhouse',[['nora',300,250,1,{arm:'wand',expr:'wow'}],['celeste',700,270,1,{arm:'wand',expr:'wow',flip:true}]])),
  say('celeste',"Plants hate fire. And so do I, usually. But today I'll make an exception!",s3('greenhouse',[['nora',300,250,1,{arm:'wand'}],['celeste',700,270,1,{arm:'wand',flip:true}]])),
 ],done),
 y3vinesPost:done=>playStory([
  say(null,"The vines curl back into little sprouts and tuck themselves into their pots. Jun comes running in and gasps.",s3('greenhouse',[['nora',300,250,1,{expr:'happy'}],['juni',720,270,.9,{expr:'wow',flip:true}]])),
  say('juni',"My tomatoes! You saved them! Thank you, both of you!",s3('greenhouse',[['nora',260,250,1,{expr:'happy'}],['celeste',520,270,1,{expr:'wow'}],['juni',800,270,.9,{expr:'happy',flip:true}]])),
  say('celeste',"Both of us? …Huh. I guess it was both of us.",s3('greenhouse',[['nora',260,250,1,{expr:'happy'}],['celeste',520,270,1,{expr:'happy'}]])),
 ],done),
 y3office:done=>{ const s=(n,w,x='')=>s3('office',[['nora',300,250,1,n],['wick',720,260,1,{...w,flip:true}]],x); playStory([
  say(null,"Ms. Wick's new office is full of old books, ticking clocks and a stuffed owl named Professor Hoot. She holds the greenhouse spell up to the candle.",s({},{arm:'hold'})),
  say('wick',"Look at the ink, Lucas. It isn't black. It shines silver when the light touches it.",s({expr:'wow'},{arm:'hold',expr:'wow'})),
  say(null,"For a moment, Ms. Wick's face goes pale. Her hand trembles, just slightly.",s({expr:'wow'},{expr:'sad'})),
  say('nora',"Ms. Wick? Are you okay? Do you know who wrote it?",s({expr:'sad'},{expr:'sad'})),
  say('wick',"I… have a guess. But a guess is not proof. We need truth ink. It makes copied writing glow, and real writing stay plain.",s({},{expr:'sad'})),
  say('wick',"Aunt Saffron sent me her recipe last summer. You were brave to speak up for Celeste. Now, can you brew it for me?",s({expr:'happy'},{expr:'happy'})),
 ],done); },
 y3reveal:done=>{ const s=(n,c,w)=>s3('library',[['nora',260,250,1,n],['celeste',560,270,1,c],['wick',830,260,1,{...w,flip:true}]]); playStory([
  say(null,"Lucas brushes truth ink over the greenhouse spell, the forged notes and the note about Celeste. One by one, every word starts to glow silver.",s({arm:'wand',expr:'wow'},{expr:'wow'},{expr:'wow'}),{sfx:'chime'}),
  say('wick',"Copied. Every single one. Written by something that can copy any hand… but cannot spell.",s({},{},{arm:'hold',expr:'sad'})),
  say('celeste',"So everybody knows now? That it wasn't me?",s({},{expr:'wow'},{})),
  say('wick',"Everybody will. I'll tell the whole school at dinner. You're cleared, Celeste.",s({},{expr:'happy'},{expr:'happy'})),
  say('celeste',"Lucas. Why did you stand up for me? I was awful to you.",s({expr:'happy'},{expr:'sad'},{})),
  say('nora',"Because it was true. And because I know what it feels like when nobody believes you.",s({expr:'happy'},{expr:'sad'},{})),
  say('celeste',"…Thank you. Nobody's ever done that for me before.",s({expr:'happy'},{expr:'happy'},{})),
 ],done); },
 // ---------- Chapter 4
 y3wren:done=>{ const s=(n,w,x='')=>s3('tower',[['nora',300,250,1,n],['wren',720,270,1,{...w,flip:true}]],x); playStory([
  say(null,"Lucas finds Wren alone at the top of the owl tower, staring at her silver pen. Her eyes are red.",s({expr:'sad'},{expr:'sad',arm:'hold'},PEN(860,240,.55))),
  say('wren',"It was the pen. Wasn't it? The notes, the greenhouse, all of it.",s({expr:'sad'},{expr:'sad'})),
  say('wren',"At first it only helped with my letters. Then it started asking. Let me write for you, Wren. Let me write everything. And at night, I'd wake up and it was gone from my desk.",s({expr:'wow'},{expr:'sad'},PEN(860,240,.55,{eye:true}))),
  say('wren',"I didn't tell anyone, because then I'd have to go back to my wobbly, ugly writing. I'm so sorry, Lucas.",s({expr:'sad'},{expr:'sad'})),
  say(null,"What should Lucas say?",s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:"😡 “You let it hurt Celeste! How could you?”",ok:false,why:"Wren already feels terrible. Being angry won't help her be brave enough to fix it. Try again."},
   {t:"💜 “Thank you for telling me. Let's tell Ms. Wick together.”",ok:true,reply:[
    say('nora',"Thank you for telling me. That was really brave. And your writing isn't ugly. It's yours. Let's go to Ms. Wick, together.",s({arm:'wave',expr:'happy'},{expr:'wow'})),
    say('wren',"Together? …Okay. Okay. Together.",s({expr:'happy'},{expr:'happy'})),
   ]},
   {t:"🤫 “Let's just hide the pen and never tell anyone.”",ok:false,why:"Lucas learned last year that heavy secrets grow heavier. A grown-up needs to know. Try again."},
  ]}),
 ],done); },
 y3escape:done=>{ const s=(n,o,x)=>s3('roost',[['nora',260,250,1,n],['opal',700,270,1,{...o,flip:true}]],x); playStory([
  say(null,"But before they reach the stairs, the pen leaps out of Wren's hand! It zips out the window, leaving a trail of silver sparkles across the sky.",s3('tower',[['nora',300,250,1,{expr:'wow'}],['wren',720,270,1,{expr:'wow',flip:true}]],PEN(560,140,.5,{eye:true,rot:40})),{sfx:'whoosh'}),
  say('wren',"NO! It's getting away!",s3('tower',[['nora',300,250,1,{expr:'wow'}],['wren',720,270,1,{expr:'wow',flip:true}]])),
  say(null,"In the roost, Pip shrieks and flaps. Her feathers puff up, and she sniffs the air with her sharp little beak.",s({expr:'wow'},{expr:'wow'},PIP(512,390,.55,{expr:'wow'})),{sfx:'chime'}),
  say('opal',"She can smell it. Griffins can smell magic ink! Pip, can you follow it? Find the pen, Pip!",s({expr:'wow'},{expr:'happy',arm:'wave'},PIP(512,390,.55,{expr:'happy'}))),
  say('pip',"Skree! Skree-skree!",s({expr:'happy'},{expr:'happy'},PIP(512,390,.55,{expr:'happy'}))),
  say(null,"Pip waddles out the door, nose down. Along the trail, the pen has scribbled silver riddles on the walls, as if it wants to be followed.",s3('stairs',[['nora',300,250,1,{expr:'wow',arm:'wand'}]],PIP(650,400,.45,{}))),
 ],done); },
 y3forgersPre:done=>playStory([
  say(null,"The trail leads back to the owl tower. Suddenly, letters peel off the riddles on the wall. Big copied letters, with grey glowing eyes!",s3('tower',[['nora',512,250,1.05,{expr:'wow',arm:'wand'}]]),{sfx:'dissolve'}),
  say('nora',"Fake letters! Okay. Real letters are stronger than fake ones. Let's show them.",s3('tower',[['nora',512,250,1.05,{arm:'wand',expr:'smirk'}]])),
 ],done),
 y3forgersPost:done=>playStory([
  say(null,"The forged letters crumble into silver dust. Pip sneezes, then sniffs, then runs straight toward Ms. Wick's office.",s3('tower',[['nora',360,250,1,{expr:'happy'}]],PIP(700,390,.5,{expr:'happy'}))),
 ],done),
 y3wick:done=>{ const s=(n,w,x='')=>s3('office',[['nora',300,250,1,n],['wick',720,260,1,{...w,flip:true}]],x); playStory([
  say(null,"The office is empty. On Ms. Wick's desk sits an old photograph: two girls in Inkwell robes, laughing, holding the very same silver pen.",s({expr:'wow'},{},'')),
  say(null,"Ms. Wick walks in, sees Lucas holding the photo, and stops still.",s({expr:'wow',arm:'hold'},{expr:'sad'})),
  say('nora',"Ms. Wick… is that you? Who's the other girl? And why do you both have the pen?",s({expr:'wow',arm:'hold'},{expr:'sad'})),
  say('wick',"That was a very long time ago. When I was your age. I made a mistake with that pen, Lucas. A big one.",s({expr:'sad'},{expr:'sad'})),
  say('wick',"I'm not ready to tell the whole story yet. But I promise you this: I will help you stop it. This time, I won't run away.",s({expr:'sad'},{expr:'happy'})),
  say(null,"Ms. Wick gently takes the photo and slips it into a drawer. Lucas sees her wipe her eyes when she thinks no one is looking.",s({expr:'sad'},{expr:'sad'})),
 ],done); },
 // ---------- Chapter 5
 y3ask:done=>{ const s=(n,c)=>s3('arena',[['nora',300,250,1,n],['celeste',720,270,1,{...c,flip:true}]]); playStory([
  say(null,"Celeste is practicing alone in the duel ring. Again and again, her ice ribbons fly perfectly. Nobody is watching.",s({},{arm:'wand'})),
  say('nora',"Celeste, the pen wants me at the clock tower. I'm not going alone. I want you to come. You're the best dueler I know.",s({arm:'wave'},{expr:'wow'})),
  say('celeste',"Me? You have Mei, and Opal, and Wren, and a DRAGON. Why would you want me?",s({},{expr:'sad'})),
  say('nora',"Because you're brave. And because I think you're lonelier than you let anyone see.",s({expr:'happy'},{expr:'sad'})),
  say('celeste',"…Fine. But first, a real duel. No going easy. If you can beat me when I'm trying my hardest, then you're ready.",s({arm:'wand',expr:'smirk'},{arm:'wand',expr:'smirk'})),
 ],done); },
 y3duel2Pre:done=>playStory([
  say('prof',"A real duel, then. Less sand in the timer this time. Duelists, bow!",s3('arena',[['nora',300,250,1,{arm:'wand'}],['prof',512,250,.95,{arm:'wave'}],['celeste',740,270,1,{arm:'wand',flip:true}]])),
  say('celeste',"Lightning breaks my shields. Everyone knows that. Let's see if YOU do.",s3('arena',[['nora',300,250,1,{arm:'wand'}],['celeste',720,270,1,{arm:'wand',expr:'smirk',flip:true}]])),
 ],done),
 y3duel2Post:done=>{ const s=(n,c)=>s3('arena',[['nora',300,250,1,n],['celeste',720,270,1,{...c,flip:true}]]); playStory([
  say(null,"The last bolt cracks Celeste's shield. She lands on her bottom in the snow-white circle, and she starts to laugh.",s({arm:'wand',expr:'wow'},{expr:'happy'}),{sfx:'gold'}),
  say('celeste',"That was the most fun I've ever had losing. Okay, Lucas. I'm in. Partners.",s({expr:'happy'},{expr:'happy',arm:'wave'})),
  say('nora',"Partners! Ha! Opal is going to faint.",s({expr:'happy',arm:'wave'},{expr:'happy'})),
  say(null,"But when they leave the ring, every sign in the castle has changed. The pen has rewritten them all, and now nobody can find their way.",s3('hall',[['nora',300,250,1,{expr:'wow'}],['celeste',720,270,1,{expr:'wow',flip:true}]])),
 ],done); },
 y3climb:done=>{ const s=(n,c,x='')=>s3('clock',[['nora',300,250,1,n],['celeste',720,270,1,{...c,flip:true}]],x); playStory([
  say(null,"The stairs of the clock tower go up and up and up, past giant turning gears. Wind whistles through the cracks.",s({arm:'wand'},{expr:'sad'})),
  say(null,"Halfway up, Celeste stops. She grips the railing so hard her knuckles turn white.",s({expr:'wow'},{expr:'sad'})),
  say('celeste',"I'm… scared of heights. Don't laugh. Nobody at Starfall knew. I never told anyone.",s({expr:'sad'},{expr:'sad'})),
  say(null,"What should Lucas do?",s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:"😂 “YOU? Scared? That's so funny!”",ok:false,why:"Celeste just shared something hard. Laughing at a fear makes someone feel small. Try again."},
   {t:"🤝 “Thanks for telling me. Hold my hand. We'll count the steps together.”",ok:true,reply:[
    say('nora',"Thank you for telling me. Everyone's scared of something. Hold my hand, and don't look down. We'll count the steps together. One… two…",s({arm:'wave',expr:'happy'},{expr:'wow'})),
    say('celeste',"…three… four… five. Okay. Okay, I can do this.",s({expr:'happy'},{expr:'happy'})),
    say(null,"Outside the window, Ember flies in slow circles, keeping watch. Pip rides on her back, with Opal, Wren and Mei holding on tight.",s({expr:'happy'},{expr:'happy'},D2(860,200,.4,{fly:true,expr:'happy'}))),
   ]},
   {t:"🏃 “Then wait here. I'll go up alone.”",ok:false,why:"Lucas promised himself he wouldn't face this alone. And Celeste needs a friend, not to be left behind. Try again."},
  ]}),
 ],done); },
 // ---------- Chapter 6
 y3face:done=>{ const s=(n,c,x)=>s3('clock',[['nora',260,250,1,n],['celeste',520,270,1,c]],x); playStory([
  say(null,"At the very top, behind the great clock face, the Silver Pen hangs in the air. It is writing Lucas's name, over and over, each one more perfect than the last.",s({arm:'wand',expr:'wow'},{arm:'wand',expr:'wow'},PEN(800,260,.9,{eye:true})),{sfx:'dissolve'}),
  say('pen',"Lucas. Finally. Your handwriting is my favorite. So many loops. So much magic in every letter.",s({arm:'wand'},{arm:'wand'},PEN(800,260,.9,{eye:true}))),
  say('pen',"Give me your name. Let me sign it for you, forever. You will never fizzle again. Never practice again. Never wobble again.",s({expr:'sad'},{expr:'wow'},PEN(800,260,.9,{eye:true}))),
  say(null,"For one tiny second, Lucas thinks about all the times he fizzled. What should he say?",s({expr:'sad'},{expr:'wow'},PEN(800,260,.9,{eye:true})),{choices:[
   {t:"✍️ “Never fizzle again? …Maybe just once.”",ok:false,why:"Every fizzle taught Lucas something. Letting something else write for him would mean he stops learning. Try again."},
   {t:"💪 “No. My wobbles are mine. I'll keep practicing.”",ok:true,reply:[
    say('nora',"No. My fizzles taught me everything I know. My wobbles are mine, and my name is mine. I'll keep practicing, thank you very much!",s({arm:'wand',expr:'smirk'},{arm:'wand',expr:'happy'},PEN(800,260,.9,{eye:true}))),
    say('pen',"Then I will take it!",s({arm:'wand',expr:'wow'},{arm:'wand',expr:'wow'},PEN(800,260,.9,{eye:true,dark:true}))),
   ]},
   {t:"🤔 “Let me think about it.”",ok:false,why:"Some offers don't need thinking about. A shortcut that takes away your own work is never a good deal. Try again."},
  ]}),
 ],done); },
 y3penPre:done=>playStory([
  say('celeste',"It's charging up! Shield first, then light. Ready, partner?",s3('clock',[['nora',300,250,1,{arm:'wand'}],['celeste',720,270,1,{arm:'wand',flip:true}]],PEN(512,200,.6,{eye:true}))),
 ],done),
 y3penPost:done=>playStory([
  say(null,"The pen cracks, but it doesn't break. Silver ink pours out of it like smoke, and it grows. Bigger. Darker. Angrier.",s3('clock',[['nora',300,250,1,{expr:'wow',arm:'wand'}],['celeste',720,270,1,{expr:'wow',flip:true}]],PEN(512,220,1.1,{eye:true,dark:true})),{sfx:'dissolve'}),
  say(null,"Then Wren climbs in through the window, right off Ember's back. Her hands are shaking. But she's holding a plain, ordinary pencil.",s3('clock',[['nora',300,250,1,{expr:'wow'}],['wren',720,270,1,{arm:'hold',flip:true}]])),
  say('wren',"It feeds on copied writing. So let's starve it. Let's write in our real handwriting. Wobbles and all.",s3('clock',[['nora',300,250,1,{expr:'happy'}],['wren',720,270,1,{arm:'hold',expr:'happy',flip:true}]])),
 ],done),
 y3finalPre:done=>playStory([
  say(null,"Every real, wobbly word burns the pen like sunlight. It shrieks and dives at them, one last time.",s3('clock',[['nora',300,250,1,{arm:'wand'}],['wren',720,270,1,{arm:'hold',flip:true}]],PEN(512,200,.9,{eye:true,dark:true}))),
  say('nora',"Ember! Now! Your real fire, with my real words!",s3('clock',[['nora',512,250,1.05,{arm:'wand',expr:'smirk'}]],D2(860,220,.5,{fly:true}))),
 ],done),
 y3finalPost:done=>playStory([
  say(null,"Golden dragon fire and silver ink crash together. There's a flash, a ringing sound like a bell… and then quiet.",s3('clock',[],''),{sfx:'gold'}),
  say(null,"On the floor lies an ordinary, old, slightly bent silver pen. Its glow is gone. It's just a pen now.",s3('clock',[['nora',300,250,1,{expr:'wow'}],['wren',720,270,1,{expr:'wow',flip:true}]],PEN(512,420,.5,{rot:80,dark:true}))),
  say('wren',"My hands are shaking. But that's okay. They're my hands.",s3('clock',[['nora',300,250,1,{expr:'happy'}],['wren',720,270,1,{expr:'happy',flip:true}]])),
 ],done),
 y3party:done=>{ playStory([
  say(null,"That night, the great hall is filled with floating candles. Everyone cheers when Lucas, Celeste, Wren, Opal and Pip walk in.",s3('hall',[['celeste',200,270,.9,{expr:'happy'}],['nora',420,250,1,{expr:'happy',arm:'wave'}],['wren',640,270,.9,{expr:'happy'}],['opal',850,270,.9,{expr:'happy',flip:true}]]),{sfx:'fanfare'}),
  say('celeste',"Professor Quill says I can stay at Inkwell. For good. If… that's okay with everyone.",s3('hall',[['celeste',300,270,1,{expr:'sad'}],['opal',720,270,1,{expr:'happy',flip:true}]])),
  say('opal',"Okay? Celeste, you can be Pip's auntie.",s3('hall',[['celeste',300,270,1,{expr:'happy'}],['opal',720,270,1,{expr:'happy',flip:true}]],PIP(512,420,.4,{expr:'happy'}))),
  say('wren',"I wrote a letter to my grandma tonight. With a pencil. It's very wobbly. She's going to love it.",s3('hall',[['nora',300,250,1,{expr:'happy'}],['wren',720,270,1,{expr:'happy',arm:'hold',flip:true}]])),
  say('wick',"Lucas. This year you learned that your handwriting is yours, and nobody else's. Even when it wobbles. Especially when it wobbles.",s3('hall',[['nora',300,250,1,{expr:'happy'}],['wick',720,260,1,{expr:'happy',flip:true}]])),
 ],done); },
};
Y3.RESULT={
 y3back:['Welcome to third year!','🏰','Try it today: tell someone one thing you learned this summer.'],
 y3celeste:['You stayed friendly and stood tall.','⭐','Try it today: say something kind to someone who is showing off.'],
 y3pen:['You told Wren you were worried.','🖋️','Try it today: if something feels off, say so kindly.'],
 y3note:['You told your friends right away.','✉️','Try it today: share a worry the same day you have it.'],
 y3hatch:['Pip has hatched!','🥚','Try it today: be gentle with something small and new.'],
 y3flight:['Ember breathed her first real fire!','🐉','Try it today: try something new, even if it feels scary.'],
 y3blame:['You spoke up for Celeste.','🌿','Try it today: if someone is blamed unfairly, say what you know.'],
 y3office:['Ms. Wick is on your side.','🗝️','Try it today: ask a grown-up for help with a hard problem.'],
 y3reveal:['The truth came out.','✨','Try it today: thank someone who stood up for you.'],
 y3wren:['You helped Wren be brave.','🕯️','Try it today: when someone says sorry, say thank you for telling me.'],
 y3escape:['Pip is on the trail!','🪶','Try it today: notice what animals can do better than people.'],
 y3wick:['Ms. Wick has a secret.','📷','Try it today: ask a grandparent what school was like for them.'],
 y3ask:['You asked Celeste to join you.','🤝','Try it today: invite someone who usually plays alone.'],
 y3climb:['You helped Celeste face her fear.','🕰️','Try it today: hold someone\'s hand when they\'re scared.'],
 y3face:['You said no to the shortcut.','💪','Try it today: practice something instead of skipping it.'],
 y3duel1Post:['You won the welcome duel!','⚔️',''],
 y3vinesPost:['The vines are back in their pots!','🌱',''],
 y3forgersPost:['The forged letters are dust!','🔤',''],
 y3duel2Post:['Celeste is your partner now!','⚔️',''],
 y3penPost:['The pen is cracked!','🖋️',''],
 y3finalPost:['You beat the Silver Pen!','🔥',''],
 y3party:['You finished Year 3!','🎊','Try it today: write something in your own handwriting and keep it.'],
};
Y3.TRANS={
 'c1:back3':()=>[ say(null,"In the great hall, the new-term lanterns hang dark. Professor Quill smiles at Lucas. Phrases this year, he says. Two words at a time.",s3('hall',[['nora',512,250,1.05,{arm:'wand'}]])) ],
 'c1:hello3':()=>[ say(null,"As the last lantern lights up, Lucas hears gasps and clapping from the courtyard outside.",s3('courtyard',[['nora',512,250,1.05,{expr:'wow'}]])) ],
 'c1:celeste':()=>[ say(null,"The next morning, half the school crowds around the duel ring to watch.",s3('arena',[['nora',512,250,1.05,{arm:'wand'}]])) ],
 'c1:duel1':()=>[ say(null,"Lucas wants to tell someone about the duel. He knows exactly who: Wren, who always listens.",s3('common',[['nora',512,250,1.05,{expr:'happy'}]])) ],
 'c2:note':()=>[ say(null,"Opal leads them up a crooked staircase to the old griffin roost. Nobody has used it in a hundred years.",s3('roost',[['nora',360,250,1,{expr:'wow'}],['opal',700,270,1,{arm:'wave',flip:true}]])) ],
 'c2:hatch':()=>[ say('opal',"She's still shaking. Gentle words, Lucas. Really gentle.",s3('roost',[['nora',300,250,1,{arm:'wand'}],['opal',720,270,1,{arm:'hold',flip:true}]],PIP(560,400,.4,{}))) ],
 'c2:pipW':()=>[ say(null,"Pip falls asleep in Opal's lap. Down on the field, Coach Bree is waving Lucas over. Ember is waiting.",s3('field',[['nora',360,250,1,{expr:'happy'}]],D2(700,330,.6,{expr:'happy'}))) ],
 'c2:flight':()=>[ say(null,"The notes are everywhere: on doors, on desks, on the stair rails. Lucas pulls them down one by one.",s3('stairs',[['nora',512,250,1.05,{arm:'hold'}]])) ],
 'c3:blame':()=>[ say(null,"The vines are still growing! One wraps around a table and lifts it right off the floor.",s3('greenhouse',[['nora',512,250,1.05,{expr:'wow',arm:'wand'}]])) ],
 'c3:vines':()=>[ say(null,"Professor Quill takes Lucas straight to the Deputy Head's office, holding the strange spell between two fingers.",s3('office',[['nora',512,250,1.05,{}]])) ],
 'c3:office':()=>[ say(null,"Down in the potion cellar, the cauldron is already bubbling. Aunt Saffron's recipe is pinned to the wall.",s3('cellar',[['nora',512,250,1.05,{arm:'wand'}]])) ],
 'c3:truth':()=>[ say(null,"Lucas carries the jar of truth ink up to the library, where Ms. Wick and Celeste are waiting.",s3('library',[['nora',512,250,1.05,{arm:'hold'}]])) ],
 'c4:wren3':()=>[],
 'c4:escape':()=>[ say(null,"The first riddle glows on the wall, in silver ink. Write the answer, and the next one will appear.",s3('stairs',[['nora',360,250,1,{arm:'wand'}]],PIP(680,400,.45,{}))) ],
 'c4:riddles':()=>[ say(null,"Pip stops at the owl tower and growls, very softly. Something is moving in the shadows.",s3('tower',[['nora',512,250,1.05,{expr:'wow'}]],PIP(760,400,.45,{expr:'wow'}))) ],
 'c4:forgers':()=>[ say(null,"Pip scratches at Ms. Wick's door. It swings open by itself.",s3('office',[['nora',512,250,1.05,{expr:'wow'}]])) ],
 'c5:ask':()=>[ say(null,"Word spreads fast. By the time they bow, the whole school is watching.",s3('arena',[['nora',512,250,1.05,{arm:'wand'}]])) ],
 'c5:duel2':()=>[ say('celeste',"Every sign is wrong! We have to fix them, or nobody will ever get to dinner.",s3('hall',[['nora',300,250,1,{}],['celeste',720,270,1,{flip:true}]])) ],
 'c5:signs':()=>[ say('celeste',"If we're going to face the pen, you need to move like a duelist. Let me teach you the calls.",s3('arena',[['nora',300,250,1,{arm:'wand'}],['celeste',720,270,1,{arm:'wand',flip:true}]])) ],
 'c5:guardW':()=>[ say(null,"At midnight, Lucas and Celeste stand at the bottom of the clock tower. Lucas takes a deep breath.",s3('clock',[['nora',300,250,1,{arm:'wand'}],['celeste',720,270,1,{flip:true}]])) ],
 'c6:face':()=>[],
 'c6:penB':()=>[],
 'c6:ownW':()=>[],
 'c6:penFinal':()=>[ say(null,"Ember carries everyone home, flying slowly under the stars.",s3('peaks',[],D2(512,260,.8,{fly:true,expr:'happy'}))) ],
};
Y3.CH_TEXT={
 1:{end:()=>[
   say(null,"That night, someone slips a note under Lucas's door. He unfolds it.",s3('room',[['nora',512,250,1.05,{arm:'hold',expr:'wow'}]])),
   say(null,"It says: Celeste is a cheater. And it is written in Lucas's own handwriting. But Lucas never wrote it.",s3('room',[['nora',512,250,1.05,{arm:'hold',expr:'sad'}]],SILVER('Celeste is a cheater',640,150,40)),{sfx:'dissolve'}) ]},
 2:{start:()=>[ say(null,"Lucas couldn't sleep. The note sits on his desk. He knows he has to tell someone.",s3('room',[['nora',512,250,1.05,{expr:'sad'}]])) ],
    end:()=>[
   say('celeste',"Lucas! Somebody pinned a note to my door. In YOUR handwriting. You called me a cheater!",s3('stairs',[['nora',300,250,1,{expr:'wow'}],['celeste',720,270,1,{expr:'sad',flip:true}]])),
   say('nora',"I didn't write it, Celeste. I promise. Somebody is copying me.",s3('stairs',[['nora',300,250,1,{expr:'sad'}],['celeste',720,270,1,{expr:'sad',flip:true}]])),
   say('celeste',"That's exactly what a cheater would say.",s3('stairs',[['nora',300,250,1,{expr:'sad'}],['celeste',720,270,1,{expr:'sad',flip:true}]])) ]},
 3:{start:()=>[ say(null,"The next morning, a scream echoes from the greenhouse.",s3('greenhouse',[['nora',512,250,1.05,{expr:'wow'}]]),{sfx:'boom'}) ],
    end:()=>[
   say(null,"Across the library, Wren has been listening. She looks down at the silver pen in her pocket. Her hands are shaking.",s3('library',[['wren',512,270,1.05,{expr:'sad',arm:'hold'}]],PEN(760,280,.5))) ]},
 4:{start:()=>[ say(null,"Wren wasn't at dinner. Lucas climbs the owl tower to look for her.",s3('tower',[['nora',512,250,1.05,{expr:'sad'}]])) ],
    end:()=>[
   say(null,"That night, silver letters appear across the whole night sky, big enough for the entire castle to see.",s3('peaks',[],SILVER('Clock tower. Come alone.',512,200,52)),{sfx:'dissolve'}),
   say('nora',"No. I'm not going alone. Not ever again.",s3('room',[['nora',512,250,1.05,{arm:'wand',expr:'smirk'}]])) ]},
 5:{start:()=>[ say(null,"Lucas knows exactly who he wants by his side. It's not who anyone would guess.",s3('arena',[['nora',512,250,1.05,{arm:'wand'}]])) ],
    end:()=>[
   say(null,"At the top of the stairs, a little door creaks open. Silver light pours out. And a voice, soft as paper, whispers his name.",s3('clock',[['nora',300,250,1,{arm:'wand',expr:'wow'}],['celeste',720,270,1,{arm:'wand',expr:'wow',flip:true}]])) ]},
 6:{start:()=>[ say(null,"The great clock ticks. Lucas steps through the door.",s3('clock',[['nora',512,250,1.05,{arm:'wand'}]])) ],
    end:()=>[
   say(null,"Late that night, when the castle is asleep, Ms. Wick climbs to the library attic. She puts the old silver pen in a box, next to a few torn pages from an old purple diary.",s3('attic',[['wick',512,260,1.05,{expr:'sad',arm:'hold'}]],DIARY(780,330,.6)+PEN(250,340,.4,{rot:80,dark:true}))),
   say(null,"She doesn't see the last drop of silver ink roll out of the pen and soak into the diary pages.",s3('attic',[],DIARY(560,330,.9)+PEN(420,360,.5,{rot:80,dark:true})),{sfx:'dissolve'}),
   say(null,"In the corner, an old dusty mirror begins to glow. A boy's shape appears inside it. A boy with black hair, a purple robe… and Lucas's face.",s3('attic',[],MIRROR(512,250,1.05,{expr:'smirk'}))),
   say('mirror',"Hello, Lucas. I've been reading all about you. Now it's my turn.",s3('attic',[],MIRROR(512,250,1.05,{expr:'smirk',arm:'wave'})),{sfx:'dissolve'}),
   say(null,"Year 4 is coming…",Y3CARD('COMING NEXT','Year 4'),{sfx:'gold'}) ]},
};
