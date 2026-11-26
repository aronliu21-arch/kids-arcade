async function trialCast(){ if(!pad.hasInk()){ showFb('Write with your finger or Pencil first ✍️'); return; } const r=pad.score(); T.sc.push(r.score); S.seen.push(TRIAL[T.i].t); save(); Snd.sfx(r.stars?'chime':'spark'); showFb(r.stars?'The gate glows! ✨':'The gate hums… good try!'); await sleep(1100); T.i++;
 if(T.i<TRIAL.length) return runTrial();
 const lv= T.sc[2]>=.62&&T.sc[1]>=.55 ? 3 : T.sc[1]>=.55||T.sc[0]>=.8 ? 2 : 1;
 S.level=lv; S.trial=true; save(); $('#padCast').onclick=()=>cast();
 const lvTxt=['','Rune Reader (lowercase letters)','Capital Caster (capital letters)','Chain Weaver (joined words)'][lv];
 playStory([
  {scene:sceneSVG('gate',[['prof',760,250,1,{arm:'wave'}],['nora',300,260,1,{arm:'wand',expr:'wow'}]],`<g filter="url(#glow)"><rect x="470" y="300" width="100" height="120" fill="#ffe066" opacity=".7"/></g>`),who:'prof',text:`Wonderful! The gate likes you. You'll start as a ${lvTxt}.`,sfx:'gold'},
  {scene:sceneSVG('hall',[['prof',760,250,1,{expr:'sad'}],['nora',300,260,1,{}]]),who:'prof',text:'Now… I\'m afraid I need your help already. The castle lamps are going out, one by one.'},
  {scene:sceneSVG('hall',[['prof',760,250,1,{expr:'sad'}],['nora',300,260,1,{expr:'sad'}]]),who:'nora',text:'Going out? But why?'},
  {scene:sceneSVG('hall',[['prof',760,250,1,{}],['nora',300,260,1,{}]]),who:'prof',text:'Nobody knows yet. But a new student with a steady wand might be exactly what we need.'},
  {scene:sceneSVG('hall',[['prof',760,250,1,{}],['nora',300,260,1,{arm:'wand'}]]),who:'nora',text:'Okay. I\'ll try my very best!'},
 ],()=>goMap()); }

// ============ stories ============
const say=(who,text,scene,x={})=>Object.assign({who,text,scene},x);
const STORIES={
 // ----- Chapter 1
 // ----- side stories: the cast
 sunny:done=>{ const s=(n,u)=>sc('hall',[['nora',330,250,1,n],['sunny',700,300,.8,u]]); playStory([
  say(null,'On the way back from Rune Hall, Nora hears crying under the big staircase.',s({expr:'wow'},{expr:'sad'})),
  say('sunny','I\'m Sunny. I\'m seven. It\'s my first day and every hallway looks the same and I can\'t find my room…',s({expr:'sad'},{expr:'sad'})),
  say(null,'What should Nora do?',s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:'⏩ "Sorry, I\'m busy. Ask someone else."',ok:false,why:'Sunny sniffles even harder. Nora remembers how scary her own first day was. Try again.'},
   {t:'🧭 Walk her to her room and show her a trick',ok:true,reply:[
    say('nora','I got lost on my first day too. See the blue candles? They always point to the first-year rooms.',s({arm:'wave'},{expr:'wow'})),
    say('sunny','Blue candles… blue candles… THERE\'S MY DOOR! You\'re the nicest big kid ever!',s({},{expr:'happy',arm:'wave'}),{sfx:'chime'}),
    say('sunny','Can I sit with you at lunch? Tomorrow? And the day after?',s({expr:'happy'},{expr:'shy'})),
    say('nora','Every single day.',s({arm:'wave'},{expr:'happy',arm:'wave'})),
   ]}]}),
 ],done); },
 eggPre:done=>{ const s=(e)=>sc('courtyard',[['juni',260,270,.95,{arm:'hold'}],['nora',720,250,1,{expr:e}]],D(420,330,.8,{stage:'egg'})); playStory([
  say(null,'Behind the greenhouse, a girl with leaves in her hair waves Nora over. She\'s hugging something warm.',s('wow')),
  say('juni','Hi! I\'m Juni. The tomatoes told me you were nice. Look what I found in the herb garden after the storm…',s('wow')),
  say('nora','Is that… a dragon egg?!',s('wow')),
  say('juni','It\'s getting cold. Dragon eggs hatch when they hear kind words. Will you write some for it?',s('happy')),
 ],done); },
 eggPost:done=>{ playStory([
  say(null,'Crack… crack… CRACK!',sc('courtyard',[['juni',260,270,.95,{expr:'wow'}],['nora',720,250,1,{expr:'wow'}]],D(470,330,.8,{stage:'egg',crack:true})),{sfx:'spark'}),
  say(null,'A tiny golden dragon tumbles out, blinks, and sneezes a spark right onto Nora\'s shoe.',sc('courtyard',[['juni',260,270,.95,{expr:'happy'}],['nora',720,250,1,{expr:'wow'}]],D(470,300,.8,{})),{sfx:'gold'}),
  say('ember','Rrr-eee!',sc('courtyard',[['juni',260,270,.95,{expr:'happy'}],['nora',720,250,1,{arm:'wave'}]],D(470,300,.8,{expr:'happy'}))),
  say('juni','She likes you! She needs a name.',sc('courtyard',[['juni',260,270,.95,{arm:'wave'}],['nora',720,250,1,{}]],D(470,300,.8,{}))),
  say('nora','Ember. Because she\'s small, but she glows.',sc('courtyard',[['juni',260,270,.95,{expr:'happy'}],['nora',720,250,1,{arm:'hold',glow:true}]],D(470,300,.8,{expr:'closed'})),{sfx:'chime'}),
  say('juni','Dawnfeather dragons live on the Five Peaks, far away. I wonder how her egg got all the way here…',sc('courtyard',[['juni',260,270,.95,{expr:'sad'}],['nora',720,250,1,{}]],D(470,300,.8,{expr:'sad'}))),
 ],done); },
 juniFear:done=>{ const s=(n,j)=>sc('courtyard',[['nora',300,250,1,n],['juni',720,270,1,j]]); playStory([
  say(null,'It\'s broom test day. Everyone is zooming around the field, except Juni. She hasn\'t moved.',s({},{expr:'sad'})),
  say('juni','When I was little, I fell out of an apple tree. Now my legs turn into jelly when I\'m up high.',s({expr:'sad'},{expr:'sad'})),
  say(null,'What should Nora do?',s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:'🙄 "Just do it, it\'s easy!"',ok:false,why:'Juni looks down. Saying a fear is silly doesn\'t make it smaller. Try another way.'},
   {t:'🧹 "Let\'s fly together, low and slow, one tree at a time."',ok:true,reply:[
    say('nora','Let\'s fly together. Low and slow. Just one tree at a time. I\'ll be right next to you.',s({arm:'wave'},{expr:'shy'})),
    say(null,'One tree… two trees… the whole orchard. Juni is flying!',s({arm:'wand',expr:'wow'},{expr:'wow',arm:'wave'}),{sfx:'gold'}),
    say('juni','I did it! It\'s still scary… but I did it scared!',s({expr:'happy'},{expr:'happy',arm:'wave'})),
    say('nora','That\'s exactly what brave means.',s({arm:'wave'},{expr:'happy'})),
   ]}]}),
 ],done); },
 flightPre:done=>{ const s=(b,e)=>sc('courtyard',[['bree',260,250,1,b],['nora',700,250,1,{}]],D(470,330,.8,e)); playStory([
  say(null,'Ember flaps and flops, flaps and flops. She can\'t get off the ground.',s({},{expr:'sad'})),
  say('bree','I\'m Coach Bree, flying teacher. That little one needs wind words. Write a few, and she\'ll catch the breeze.',s({arm:'wave'},{})),
  say('bree','I used to ride a dragon, you know. A big Dawnfeather named Thistle.',s({expr:'happy'},{})),
  say('nora','Used to?',s({expr:'sad'},{})),
  say('bree','…That\'s a story for another day. Let\'s get this one flying.',s({expr:'sad'},{expr:'sad'})),
 ],done); },
 flightPost:done=>playStory([
  say(null,'Ember\'s wings catch the wind. Up… up… a loop-the-loop! She lands on Nora\'s head, very proud.',sc('courtyard',[['bree',260,250,1,{expr:'wow'}],['nora',700,260,1,{expr:'wow'}]],D(520,160,.8,{fly:true,expr:'happy'})),{sfx:'gold'}),
  say('bree','She flies just like Thistle did.',sc('courtyard',[['bree',260,250,1,{expr:'closed'}],['nora',700,260,1,{}]],D(700,90,.5,{expr:'happy'}))),
 ],done),
 lola:done=>{ const s=(n,l)=>sc('library',[['nora',300,250,1,n],['lola',720,250,1,l]]); playStory([
  say(null,'Deep in the library, a glowing girl floats between the shelves. She\'s a ghost. A friendly one.',s({expr:'wow'},{})),
  say('lola','Oh! A visitor! I\'m Lola. I\'ve lived in this library for two hundred years.',s({expr:'wow'},{arm:'wave'})),
  say('lola','I\'ve read every book here. But nobody has read with me in a very, very long time.',s({},{expr:'sad'})),
  say(null,'What should Nora do?',s({},{expr:'sad'}),{choices:[
   {t:'😱 Run away screaming',ok:false,why:'Lola fades a little. She\'s a ghost, but she has feelings too. Try again.'},
   {t:'📖 Pick a book and read it aloud with her',ok:true,reply:[
    say('nora','Want to read this one together? You do the dragon voices.',s({arm:'hold'},{expr:'wow'})),
    say('lola','Oh, I\'d LOVE to! "Once upon a time, high on the Five Peaks…"',s({arm:'hold'},{expr:'happy',arm:'wave'}),{sfx:'chime'}),
    say('lola','Thank you, Nora. And since you\'re looking for clues… the vanishing words all drift toward the Hollow Tower. Like leaves in a stream.',s({expr:'wow'},{expr:'happy'})),
   ]}]}),
 ],done); },
 songPre:done=>{ const s=(e,n)=>sc('room',[['nora',300,250,1,n]],D(700,320,.85,e)); playStory([
  say(null,'Ember sits on the windowsill, staring at the far mountains. She hums a few notes… then stops.',s({expr:'sad'},{})),
  say('nora','Juni says dragons sing their family\'s sky-song so they can find each other. Ember can\'t remember hers. The Fading took it.',s({expr:'sad'},{expr:'sad'})),
  say('nora','Then let\'s write her new song words, Ember. The best ones ever.',s({},{arm:'wand'})),
 ],done); },
 songPost:done=>playStory([
  say(null,'Ember sings. The words float out of the window like golden birds, all the way to the mountains.',sc('room',[['nora',300,250,1,{expr:'wow'}]],D(700,300,.85,{expr:'closed'})),{sfx:'chime'}),
  say(null,'Then, very far away… an answering roar echoes from the Five Peaks.',sc('room',[['nora',300,250,1,{expr:'wow'}]],D(700,300,.85,{expr:'wow'})),{sfx:'boom'}),
  say('nora','Ember! Your family is out there. And they heard you!',sc('room',[['nora',300,250,1,{arm:'wave',expr:'happy'}]],D(700,300,.85,{expr:'happy',fly:true}))),
 ],done),
 bree:done=>{ const s=(n,b)=>sc('tower',[['nora',300,250,1,n],['bree',720,250,1,b]],D(520,380,.6,{expr:'sad'})); playStory([
  say(null,'Before the last climb, Coach Bree finds Nora on the windy tower bridge.',s({},{expr:'sad'})),
  say('bree','Twenty years ago, Thistle and I flew into a storm just like this one. I got scared and pulled us back.',s({expr:'sad'},{expr:'sad'})),
  say('bree','The wind tore us apart. I told everyone she flew away. The truth is… I let go.',s({expr:'sad'},{expr:'closed'})),
  say(null,'What should Nora say?',s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:'😮 "So it was your fault?"',ok:false,why:'Coach Bree turns away. She already feels terrible. A kinder answer might help her heal.'},
   {t:'💛 "Being scared isn\'t wrong. Telling the truth was brave."',ok:true,reply:[
    say('nora','Being scared isn\'t wrong. And telling the truth after all these years? That\'s really brave.',s({arm:'wave'},{expr:'wow'})),
    say('bree','…Thank you, Nora. If Thistle is out there, I want to tell her I\'m sorry.',s({},{expr:'happy'})),
    say('nora','Ember heard a roar from the Five Peaks. Maybe Thistle is closer than you think.',s({arm:'hold'},{expr:'wow'}),{sfx:'chime'}),
   ]}]}),
 ],done); },
 mei:done=>{ const s=(a,b)=>sc('library',[['mei',700,280,1,a],['nora',300,260,1,b]]); playStory([
  say(null,'The library is so quiet you can hear the candles flicker. Then… a sniffle.',s({expr:'sad'},{})),
  say('mei','Oh! Um… sorry. I didn\'t think anyone was here.',s({expr:'wow'},{})),
  say('mei','My first spell in class today went pop… and then fizzle. Everyone laughed at me.',s({expr:'sad'},{})),
  say(null,'What should Nora do?',s({expr:'sad'},{}),{choices:[
    {t:'😂 Laugh. It does sound kind of funny!',ok:false,why:'Mei pulls her hood over her face. Laughing would make her feel worse. Try something else.'},
    {t:'🚶 Say nothing and walk away',ok:false,why:'Mei looks down at her book. Being left alone feels lonely. What else could Nora do?'},
    {t:'💜 Sit next to her: "Mine fizzle too, you know."',ok:true,reply:[
      say('nora','Hey… mine fizzle too, you know. Yesterday my spell turned into a puff of smoke!',s({expr:'shy'},{})),
      say('mei','Really? You\'re not just saying that?',s({expr:'shy'},{})),
      say('nora','Really! Want to practice together? We can be fizzle buddies.',s({expr:'shy'},{arm:'wave'})),
      say('mei','Fizzle buddies… I like that! Oh, and I know a secret. The Light Bridge only listens to joined-up words.',s({expr:'happy',arm:'wave'},{arm:'wave'}),{sfx:'chime'}),
    ]}]}),
 ],done); },
 wispPre:done=>{ const f=FOES.wisp, s=(e,me)=>sc('hall',[['mei',200,280,.9,{expr:me}],['nora',430,260,1,{arm:'wand',expr:e}]],foeBody(f,'',790,300,.6)); playStory([
  say(null,'At the Shadow Gate, the air turns cold. Something is drifting between the dark lamps.',s('happy','shy')),
  say('mei','Nora, look out! It\'s a Shadow Wisp!',s('wow','wow')),
  say('nora','It\'s swallowing the light!',s('sad','sad')),
  say('mei','Shadow Wisps can\'t stand sunshine. Pick a light spell, write it, and send it flying!',s('happy','happy')),
 ],done); },
 wispPost:done=>playStory([
  say(null,'The wisp shrinks… and shrinks… until it\'s just a tiny, shivering spark.',sc('hall',[['mei',230,280,.9,{expr:'wow'}],['nora',480,260,1,{arm:'wand',expr:'wow'}]],`<circle cx="790" cy="330" r="22" fill="#fff59d" filter="url(#glow)"/>`),{sfx:'chime'}),
  say('nora','Oh… it wasn\'t mean. I think it was just scared of the dark, too.',sc('hall',[['mei',230,280,.9,{expr:'shy'}],['nora',480,260,1,{arm:'hold',expr:'sad'}]],`<circle cx="620" cy="370" r="16" fill="#fff59d" filter="url(#glow)"/>`)),
  say('mei','Let\'s give it a lamp to live in. Then it\'ll never be scared again.',sc('hall',[['mei',230,280,.9,{expr:'happy',arm:'wave'}],['nora',480,260,1,{arm:'hold'}]],`<circle cx="620" cy="370" r="16" fill="#fff59d" filter="url(#glow)"/>`)),
 ],done),
 // ----- Chapter 2
 midnight:done=>{ const s=(n,m)=>sc('room',[['nora',330,250,1,n],['mei',700,270,.95,m]]); playStory([
  say(null,'It\'s past midnight. Nora has written the capital Q forty times. Every single one fizzled.',s({expr:'sad',arm:'hold'},{expr:'closed'})),
  say('nora','It\'s no use. Iris is right. I\'ll never get it.',s({expr:'sad'},{expr:'closed'})),
  say('mei','Nora? You\'re still up? …Can I see?',s({expr:'sad'},{expr:'wow'})),
  say(null,'What should Nora do?',s({expr:'sad'},{expr:'shy'}),{choices:[
   {t:'📕 Close the book. "I quit. Magic isn\'t for me."',ok:false,why:'Nora\'s wand flickers sadly. Giving up feels safe, but it means never finding out. Try another way.'},
   {t:'😠 "Leave me alone, Mei!"',ok:false,why:'Mei steps back, hurt. She only wanted to help. Maybe there\'s a kinder way.'},
   {t:'💪 Show Mei: "Can you help me find what\'s wrong?"',ok:true,reply:[
    say('mei','Look… your tail starts too early. Professor Quill says every hard letter is just two easy letters holding hands.',s({},{arm:'wave'})),
    say('nora','Two easy letters… holding hands. Let me try again.',s({arm:'wand'},{expr:'shy'})),
    say(null,'Swish… loop… tail. The Q glows gold for the very first time.',s({arm:'wand',expr:'wow'},{expr:'wow'}),{sfx:'gold'}),
    say('nora','Mei, I did it! Thank you for not letting me quit.',s({arm:'wave'},{expr:'happy',arm:'wave'})),
   ]}]}),
 ],done); },
 irisPre:done=>{ const s=(n,i)=>sc('courtyard',[['nora',300,250,1,n],['iris',730,260,1,i]]); playStory([
  say(null,'The whole academy gathers in the courtyard for the Wand Duel. The air crackles.',s({arm:'wand'},{expr:'smirk',flip:true})),
  say('iris','Ready to lose, new girl? My fire shield has never been broken.',s({arm:'wand'},{expr:'smirk',arm:'wand',flip:true})),
  say('prof','Remember, this is a friendly duel. Spells hit the shield, never the student. Begin!',sc('courtyard',[['prof',512,240,1,{arm:'wave'}]])),
  say('mei','Psst! Fire shields hate water spells!',sc('courtyard',[['mei',512,260,1,{expr:'wow',arm:'wave'}]])),
 ],done); },
 irisPost:done=>{ const s=(n,i)=>sc('courtyard',[['nora',300,250,1,n],['iris',730,260,1,i]]); playStory([
  say(null,'Iris\'s shield shatters into a hundred sparkles. The courtyard goes silent… then cheers!',s({arm:'wand',expr:'wow'},{expr:'wow',flip:true}),{sfx:'gold'}),
  say('nora','Good duel, Iris. Your fire shield was really strong.',s({arm:'wave'},{expr:'sad',flip:true})),
  say('iris','…Whatever. You just got lucky.',s({},{expr:'sad',flip:true})),
  say(null,'Iris storms off. But Nora notices something: her eyes were wet.',s({expr:'sad'},{expr:'sad',flip:true})),
 ],done); },
 quill:done=>{ const s=(n,i)=>sc('courtyard',[['nora',300,250,1,n],['iris',720,270,1,i]]); playStory([
  say(null,'Behind the fountain, Iris is searching the grass, again and again.',s({},{expr:'sad',flip:true})),
  say('iris','It\'s gone. My mom\'s silver quill. Ink Imps took it while I was dueling.',s({expr:'wow'},{expr:'sad',flip:true})),
  say('iris','Mom works far away. She gave it to me so I\'d have a piece of her here. It\'s the only thing I…',s({expr:'sad'},{expr:'sad',flip:true})),
  say(null,'What should Nora do?',s({expr:'sad'},{expr:'sad',flip:true}),{choices:[
   {t:'🙄 "Well, you were mean to me."',ok:false,why:'That\'s true… but Iris looks so small right now. Being kind doesn\'t mean what she did was okay. Try again.'},
   {t:'🤷 "Ask a teacher, not me."',ok:false,why:'Iris turns away. Sometimes people just need someone to stand next to them. What else could Nora do?'},
   {t:'🤝 "I miss my family too. Let\'s get it back together."',ok:true,reply:[
    say('nora','I miss my family too, you know. Let\'s get your mom\'s quill back. Together.',s({arm:'wave'},{expr:'wow',flip:true})),
    say('iris','You\'d help me? Even after… everything I said?',s({},{expr:'shy',flip:true})),
    say('iris','I\'m sorry, Nora. I wasn\'t really mad at you. I was just lonely.',s({},{expr:'sad',flip:true})),
    say('nora','Apology accepted. Now, where do Ink Imps hide?',s({arm:'wand'},{expr:'happy',flip:true}),{sfx:'chime'}),
   ]}]}),
 ],done); },
 impsPre:done=>{ const f=FOES.imps, s=(e)=>sc('library',[['iris',180,290,.85,{arm:'wand'}],['nora',420,260,1,{arm:'wand',expr:e}]],foeBody(f,'',790,300,.5)); playStory([
  say(null,'Down in the Ink Cellar, three giggling Ink Imps are juggling a shiny silver quill.',s('wow')),
  say('iris','Ink Imps hate wind. It blows their ink everywhere!',s('happy')),
  say('nora','Then let\'s make a storm!',s('happy')),
 ],done); },
 impsPost:done=>playStory([
  say(null,'The imps tumble away in a puff of ink. The silver quill spins in the air… and lands in Iris\'s hands.',sc('library',[['iris',330,270,1,{arm:'hold',expr:'wow'}],['nora',700,260,1,{expr:'happy'}]]),{sfx:'gold'}),
  say('iris','Thank you, Nora. Will you… be my friend? A real one?',sc('library',[['iris',330,270,1,{arm:'hold',expr:'shy'}],['nora',700,260,1,{expr:'happy'}]])),
  say('nora','I already am.',sc('library',[['mei',150,280,.85,{arm:'wave'}],['iris',420,270,1,{arm:'wave'}],['nora',720,260,1,{arm:'wave'}]]),{sfx:'chime'}),
 ],done),
 // ----- Chapter 3
 truth:done=>{ const s=(n,m)=>sc('library',[['nora',330,250,1,n],['mei',720,270,.95,m]]); playStory([
  say(null,'While looking for clues in Professor Quill\'s office, Nora bumps the desk. CRASH! The ancient inkwell breaks.',s({expr:'wow'},{expr:'wow'})),
  say('mei','Oh no. That\'s her great-great-grandmother\'s inkwell. Quick, nobody saw. Let\'s just go.',s({expr:'sad'},{expr:'sad'})),
  say(null,'What should Nora do?',s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:'🏃 Sneak out before anyone comes',ok:false,why:'Nora\'s tummy twists. A secret like this gets heavier every day. Try another way.'},
   {t:'🐈 Say the castle cat did it',ok:false,why:'Then the cat gets in trouble for something it didn\'t do. That isn\'t fair. What else could Nora do?'},
   {t:'🫶 Wait and tell Professor Quill the truth',ok:true,reply:[
    say('nora','Professor… I broke your inkwell. It was an accident. I\'m really sorry.',sc('library',[['nora',330,250,1,{expr:'sad'}],['prof',720,250,1,{expr:'sad'}]])),
    say('prof','Thank you for telling me, Nora. That took more courage than any duel.',sc('library',[['nora',330,250,1,{expr:'shy'}],['prof',720,250,1,{expr:'happy'}]])),
    say('prof','Look, a hidden note was inside the inkwell all these years. It says: "Wren is waiting in the Hollow Tower."',sc('library',[['nora',330,250,1,{expr:'wow'}],['prof',720,250,1,{arm:'hold',expr:'wow'}]]),{sfx:'chime'}),
   ]}]}),
 ],done); },
 spritePre:done=>{ const f=FOES.sprite, s=(e)=>sc('stairs',[['mei',180,290,.85,{expr:'wow'}],['iris',330,290,.85,{arm:'wand'}],['nora',540,260,1,{arm:'wand',expr:e}]],foeBody(f,'',840,290,.5)); playStory([
  say(null,'The stairs to the Hollow Tower are covered in ice. A Frost Sprite blocks the way.',s('wow')),
  say('iris','My mom says Frost Sprites melt from fire. I\'ll keep us warm. You cast!',s('happy')),
 ],done); },
 spritePost:done=>playStory([
  say(null,'The sprite melts into a puddle… and the puddle giggles and runs away. The stairs are open.',sc('stairs',[['nora',512,260,1,{arm:'wand',expr:'wow'}]]),{sfx:'gold'}),
  say(null,'At the top, carved on the door, are two names: WREN and ROSE. Best friends, forever.',sc('stairs',[['nora',512,260,1,{expr:'wow'}]],`<g font-family="'TeX Gyre Chorus',cursive" font-size="46" fill="#e9a91c" filter="url(#glow)"><text x="700" y="200">Wren &amp; Rose</text></g>`)),
  say('nora','Rose… that\'s Grandma\'s name.',sc('stairs',[['nora',512,260,1,{expr:'sad',arm:'hold'}]])),
 ],done),
 // ----- Chapter 4
 grandma:done=>{ const s=(n,gx)=>sc('gate',[['gran',300,270,1,gx],['nora',700,250,1,n]]); playStory([
  say(null,'Nora writes Grandma a letter. The very next morning, Grandma is standing at the academy gate.',s({expr:'wow'},{arm:'wave'}),{sfx:'chime'}),
  say('gran','You found Wren\'s name. Then it\'s time I told you the truth.',s({expr:'sad'},{expr:'closed'})),
  say('gran','Wren was my best friend. When we graduated, I promised to write to her every week.',s({expr:'sad'},{expr:'sad'})),
  say('gran','I wrote twice… then I got busy. And I stopped. She waited and waited in that tower.',s({expr:'sad'},{expr:'sad'})),
  say('gran','Her loneliness grew so big it started eating the words of the whole world. The Fading is my fault.',s({expr:'sad'},{expr:'closed'})),
  say(null,'What should Nora say?',s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:'😤 "Grandma! How could you?"',ok:false,why:'Grandma\'s eyes fill with tears. She already feels terrible. Maybe there\'s a gentler way.'},
   {t:'🤐 Pretend she didn\'t hear',ok:false,why:'Grandma looks even sadder. Hard truths are easier when someone listens. Try again.'},
   {t:'🤗 Hug her: "Thank you for telling me. Let\'s fix it together."',ok:true,reply:[
    say('nora','Thank you for telling me the truth, Grandma. Everyone makes mistakes. Let\'s fix it, together.',s({arm:'wave'},{expr:'wow'})),
    say('gran','You\'re braver than I ever was, sweetheart. Together, then.',s({expr:'happy'},{expr:'happy',arm:'wave'}),{sfx:'gold'}),
   ]}]}),
 ],done); },
 golemPre:done=>{ const f=FOES.golem, s=(e)=>sc('tower',[['gran',170,280,.85,{arm:'wand'}],['nora',420,260,1,{arm:'wand',expr:e}]],foeBody(f,'',790,300,.5)); playStory([
  say(null,'A storm howls around the tower bridge. A giant Storm Golem rises out of the clouds!',s('wow')),
  say('gran','Storms can\'t stand against solid ground. Earth spells, Nora!',s('happy')),
 ],done); },
 golemPost:done=>playStory([
  say(null,'The golem crumbles into little pebbles… and the storm clouds part. Moonlight floods the bridge.',sc('tower',[['gran',300,270,.95,{expr:'wow'}],['nora',650,250,1,{arm:'wand',expr:'wow'}]]),{sfx:'gold'}),
  say('gran','Just one door left. She\'s in there.',sc('tower',[['gran',300,270,.95,{expr:'sad'}],['nora',650,250,1,{}]])),
 ],done),
 wrenPre:done=>{ const f=FOES.wren, s=(e)=>sc('tower',[['gran',170,280,.85,{expr:'sad'}],['nora',420,260,1,{arm:'wand',expr:e}]],foeBody(f,'',800,300,.5)); playStory([
  say(null,'Inside the Hollow Tower, a girl floats in a whirl of dark ink. Wren.',s('wow')),
  say('wren','Go away! Nobody ever comes. Nobody ever writes. I\'ll make ALL the words disappear!',s('sad')),
  say('gran','Wren… it\'s me. Rose.',s('sad')),
  say('wren','You\'re too late!',s('wow')),
  say('nora','Her shadow shield is too strong to talk through. Light spells, first!',s('happy')),
 ],done); },
 wrenMid:done=>{ const s=(e)=>sc('tower',[['gran',200,280,.9,{expr:'sad'}],['nora',480,260,1,{arm:'hold',expr:e}],['wren',800,270,.95,{expr:'sad',flip:true}]]); playStory([
  say(null,'The shadow shield shatters. Wren drops to the floor, small and shaking.',s('wow'),{sfx:'dissolve'}),
  say('nora','Spells won\'t fix this part. Only words will.',s('sad')),
  say('nora','Grandma, let\'s write her the letter she\'s been waiting for. Together.',s('happy')),
 ],done); },
 wrenPost:done=>{ const s=(w)=>sc('tower',[['gran',230,270,.95,{expr:'happy',arm:'wave'}],['nora',500,250,1,{arm:'wave'}],['wren',790,270,.95,w]],`<circle cx="512" cy="120" r="80" fill="url(#warm)"/>`); playStory([
  say(null,'The letter glows… and floats gently into Wren\'s hands. She reads it. Then she reads it again.',s({arm:'hold',expr:'wow',flip:true}),{sfx:'chime'}),
  say('wren','You… came back. You really came back.',s({expr:'shy',flip:true})),
  say('gran','I\'m so sorry I stopped writing, Wren. I\'ll never stop again. I promise.',s({expr:'sad',flip:true})),
  say(null,'All across the world, the faded words come flying home. Every lamp in the academy bursts into light.',sc('hall',[['mei',150,280,.85,{arm:'wave'}],['iris',330,280,.85,{arm:'wave'}],['nora',512,250,1.05,{arm:'wand',glow:true}],['wren',700,280,.85,{arm:'wave'}],['gran',870,280,.85,{arm:'wave'}]]),{sfx:'gold'}),
  say(null,'Then, out of the dawn sky, come giant shimmering wings. The Dawnfeather dragons have followed Ember\'s song!',sc('tower',[['nora',300,260,1,{expr:'wow'}]],D(560,200,.55,{who:'thistle',stage:'big',fly:true})+D(820,380,.75,{fly:true,expr:'wow'})),{sfx:'boom'}),
  say('ember','RRR-EEE!',sc('tower',[['nora',300,260,1,{expr:'happy'}]],D(600,250,.5,{who:'thistle',stage:'big'})+D(800,360,.75,{expr:'happy',fly:true}))),
  say('thistle','Little one! We have searched every sky for you since the storm.',sc('tower',[['nora',260,260,1,{expr:'wow'}]],D(620,250,.5,{who:'thistle',stage:'big',expr:'closed'})+D(860,380,.7,{expr:'closed'}))),
  say('thistle','…And Bree? Is that you? I never stopped looking for you either.',sc('tower',[['bree',280,250,1,{expr:'wow'}]],D(640,250,.5,{who:'thistle',stage:'big',expr:'happy'}))),
  say('bree','Thistle. I\'m so sorry I let go.',sc('tower',[['bree',280,250,1,{expr:'sad'}]],D(640,250,.5,{who:'thistle',stage:'big',expr:'sad'}))),
  say('thistle','You held on to me in your heart for twenty years. That is enough.',sc('tower',[['bree',280,250,1,{expr:'happy',arm:'wave'}]],D(640,250,.5,{who:'thistle',stage:'big',expr:'happy'})),{sfx:'chime'}),
  say('thistle','Ember may stay at the academy with her friend Nora, if she wishes. Every summer, she will fly home to us.',sc('tower',[['nora',260,260,1,{arm:'wave'}]],D(560,250,.5,{who:'thistle',stage:'big'})+D(840,330,.7,{expr:'happy',fly:true}))),
  say('wren','Nora… would you write to me sometimes?',s({expr:'shy',flip:true})),
  say('nora','Every week. In my very best cursive.',s({expr:'happy',arm:'wave',flip:true}),{sfx:'chime'}),
 ],done); },
};
