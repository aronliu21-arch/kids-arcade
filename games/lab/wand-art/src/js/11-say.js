// ============ stories ============
const say=(who,text,scene,x={})=>Object.assign({who,text,scene},x);
const SILVER=(w,x=640,y=200,sz=50)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="'TeX Gyre Chorus',cursive" font-size="${sz}" fill="#f8f9fa" stroke="#4c3d8f" stroke-width="4" paint-order="stroke" class="float">${w}</text>`;
const STORIES={
 // ===== Chapter 1: The Lamps Go Dark =====
 sunny:done=>{ const s=(n,u)=>sc('bigstairs',[['nora',330,250,1,n],['sunny',700,300,.8,u]]); playStory([
  say(null,"Nora follows the sound down the winding steps. Under the big staircase, a little girl with orange pigtails is hugging her knees.",s({expr:'wow'},{expr:'sad'})),
  say('sunny',"Go away… I mean… sorry. I'm Sunny. I'm seven. It's my very first day.",s({expr:'sad'},{expr:'sad'})),
  say('sunny',"Every hallway looks the same, and the stairs keep MOVING, and my map turned into a paper bird and flew away!",s({expr:'wow'},{expr:'sad'})),
  say(null,"Nora remembers standing at the big gate this morning, feeling very small. Her tummy had done flips, too.",s({expr:'sad'},{expr:'sad'})),
  say(null,"What should Nora do?",s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:"⏩ “Sorry, I'm busy. Ask someone else.”",ok:false,why:"Sunny sniffles even harder. Nora remembers how scary her own first day was. Try again."},
   {t:"🧭 Walk her to her room and show her a trick",ok:true,reply:[
    say('nora',"I'm new too! I just got here this morning. But I learned a trick. See the blue candles? They always point to the first-year rooms.",s({arm:'wave'},{expr:'wow'})),
    say(null,"They follow the little blue flames together, past a snoring suit of armor and a painting of a duke who winks at them.",s({arm:'wave'},{expr:'happy'})),
    say('sunny',"THERE'S MY DOOR! You're the nicest big kid in the whole entire castle!",s({},{expr:'happy',arm:'wave'}),{sfx:'chime'}),
    say('sunny',"Can I sit with you at lunch? Tomorrow? And the day after that?",s({expr:'happy'},{expr:'shy'})),
    say('nora',"Every single day.",s({arm:'wave'},{expr:'happy',arm:'wave'})),
    say('sunny',"Oh! Nora? Last night I saw a girl with silver hair in the tallest tower window. She was looking down at everyone. She looked… really sad.",s({expr:'wow'},{expr:'sad'})),
    say('nora',"A girl in the tower? Who would live all the way up there?",s({expr:'wow'},{expr:'sad'})),
   ]}]}),
 ],done); },
 mei:done=>{ const s=(a,b)=>sc('library',[['mei',700,280,1,a],['nora',300,260,1,b]]); playStory([
  say(null,"The library is so tall that the top shelves disappear into the dark. It is so quiet you can hear the candles flicker. Then… a sniffle.",s({expr:'sad'},{})),
  say('mei',"Oh! Um… sorry. I didn't think anyone was here.",s({expr:'wow'},{expr:'wow'})),
  say(null,"A girl with round glasses quickly wipes her eyes. A tiny curl of smoke is still rising from the tip of her wand.",s({expr:'sad'},{})),
  say('mei',"My first spell in class today went pop… and then fizzle. Everyone laughed. Even the teacher's owl laughed.",s({expr:'sad'},{expr:'sad'})),
  say(null,"What should Nora do?",s({expr:'sad'},{}),{choices:[
    {t:"😂 Laugh. It does sound kind of funny!",ok:false,why:"Mei pulls her hood over her face. Laughing would make her feel worse. Try something else."},
    {t:"🚶 Say nothing and walk away",ok:false,why:"Mei looks down at her book. Being left alone feels lonely. What else could Nora do?"},
    {t:"💜 Sit next to her: “Mine fizzle too, you know.”",ok:true,reply:[
      say('nora',"Hey… mine fizzle too, you know. Yesterday my spell turned into a puff of purple smoke. It smelled like burnt toast!",s({expr:'shy'},{})),
      say('mei',"Really? You're not just saying that?",s({expr:'wow'},{})),
      say('nora',"Really! Want to practice together? We can be fizzle buddies.",s({expr:'shy'},{arm:'wave'})),
      say('mei',"Fizzle buddies… I like that! I'm Mei, by the way.",s({expr:'happy',arm:'wave'},{expr:'happy'}),{sfx:'chime'}),
      say('nora',"I'm Nora. Mei, have you ever heard of a girl with silver hair up in the tower?",s({expr:'happy'},{})),
      say('mei',"The Hollow Tower? Nobody goes up there. Its door has been locked for fifty years.",s({expr:'wow'},{expr:'wow'})),
      say('mei',"There's an old story about a student who sat in that tower waiting for something… and never came down.",s({expr:'sad'},{expr:'sad'})),
      say('mei',"Oh, and one more secret. The Light Bridge only listens to joined-up words. If you lift your wand, it falls apart!",s({expr:'happy',arm:'wave'},{arm:'wave'})),
    ]}]}),
 ],done); },
 eggPre:done=>{ const s=(e,j='happy')=>sc('greenhouse',[['juni',260,270,.95,{expr:j}],['nora',720,250,1,{expr:e}]],D(420,330,.8,{stage:'egg'})); playStory([
  say(null,"Behind the greenhouse, a girl with leaves in her hair waves Nora over. She is hugging something round, wrapped in her scarf.",s('wow')),
  say('juni',"Hi! I'm Juni. The tomatoes told me you were nice. They're very good judges of people.",s('happy')),
  say('juni',"Look what I found in the herb garden after the storm. It fell right out of the sky. Plop!",s('wow','wow')),
  say('nora',"Is that… a dragon egg?!",s('wow','happy')),
  say('juni',"It's getting colder and colder. Dragon eggs only hatch when they hear kind words. But my writing is… really wobbly.",s('sad','sad')),
  say('nora',"Then I'll write them, and you can hold it. We'll do it together.",s('happy','happy')),
 ],done); },
 eggPost:done=>{ const g=(j,n,d)=>sc('greenhouse',[['juni',260,270,.95,j],['nora',720,250,1,n]],D(470,300,.8,d)); playStory([
  say(null,"Crack… crack… CRACK!",sc('greenhouse',[['juni',260,270,.95,{expr:'wow'}],['nora',720,250,1,{expr:'wow'}]],D(470,330,.8,{stage:'egg',crack:true})),{sfx:'spark'}),
  say(null,"A tiny golden dragon tumbles out, blinks three times, and sneezes a spark right onto Nora's shoe.",g({expr:'happy'},{expr:'wow'},{}),{sfx:'gold'}),
  say('ember',"Rrr-eee!",g({expr:'happy'},{arm:'wave'},{expr:'happy'})),
  say('juni',"She likes you! She needs a name.",g({arm:'wave'},{},{})),
  say('nora',"Ember. Because she's small, but she glows.",g({expr:'happy'},{arm:'hold',glow:true},{expr:'closed'}),{sfx:'chime'}),
  say('juni',"Dawnfeather dragons live on the Five Peaks, far, far away. A storm must have carried her egg here. Her family must be so worried.",g({expr:'sad'},{},{expr:'sad'})),
  say('nora',"Don't worry, Ember. Someday we'll find them. I promise.",g({expr:'sad'},{arm:'hold'},{expr:'sad'})),
  say(null,"Ember curls up inside Nora's hood and falls asleep at once, warm as a little teapot.",g({expr:'happy'},{expr:'happy'},{expr:'closed'})),
 ],done); },
 wispPre:done=>{ const f=FOES.wisp, s=(e,me)=>sc('shadowgate',[['mei',200,280,.9,{expr:me}],['nora',430,260,1,{arm:'wand',expr:e}]],foeBody(f,'',790,300,.6)); playStory([
  say(null,"At the Shadow Gate, the air turns cold enough to see your breath. Something is drifting between the dark lamps.",s('wow','wow')),
  say('mei',"Nora, look out! It's a Shadow Wisp!",s('wow','wow')),
  say('nora',"It's swallowing the light, one lamp at a time!",s('sad','sad')),
  say('mei',"Shadow Wisps can't stand sunshine. Pick a light spell, write it, and send it flying!",s('happy','happy')),
 ],done); },
 wispPost:done=>playStory([
  say(null,"The wisp shrinks… and shrinks… until it is just a tiny, shivering spark.",sc('shadowgate',[['mei',230,280,.9,{expr:'wow'}],['nora',480,260,1,{arm:'wand',expr:'wow'}]],`<circle cx="790" cy="330" r="22" fill="#fff59d" filter="url(#glow)"/>`),{sfx:'chime'}),
  say('nora',"Oh… it wasn't mean. I think it was just scared of the dark, too.",sc('shadowgate',[['mei',230,280,.9,{expr:'sad'}],['nora',480,260,1,{arm:'hold',expr:'sad'}]],`<circle cx="620" cy="370" r="16" fill="#fff59d" filter="url(#glow)"/>`)),
  say('mei',"Let's give it a lamp to live in. Then it'll never be scared again.",sc('shadowgate',[['mei',230,280,.9,{expr:'happy',arm:'wave'}],['nora',480,260,1,{arm:'hold'}]],`<circle cx="620" cy="370" r="16" fill="#fff59d" filter="url(#glow)"/>`)),
  say('mei',"But Nora… if the wisp was only scared, then what made all the lamps go dark in the first place?",sc('shadowgate',[['mei',230,280,.9,{expr:'wow'}],['nora',480,260,1,{expr:'sad'}]])),
 ],done),
 // ===== Chapter 2: The Wand Duel =====
 midnight:done=>{ const s=(n,m,x='')=>sc('room',[['nora',330,250,1,n],['mei',700,270,.95,m]],x); playStory([
  say(null,"The dormitory is dark, except for one tiny wand-light glowing under a blanket.",s({expr:'sad',arm:'hold'},{expr:'closed'})),
  say(null,"It's past midnight. Nora has written the capital Q forty times. Every single one fizzled.",s({expr:'sad',arm:'hold'},{expr:'closed'})),
  say('nora',"It's no use. Iris is right. I'll never get it.",s({expr:'sad'},{expr:'closed'})),
  say('mei',"Nora? You're still up? …Can I see?",s({expr:'sad'},{expr:'wow'})),
  say(null,"What should Nora do?",s({expr:'sad'},{expr:'shy'}),{choices:[
   {t:"📕 Close the book. “I quit. Magic isn't for me.”",ok:false,why:"Nora's wand flickers sadly. Giving up feels safe, but then she'll never find out what she can do. Try another way."},
   {t:"😠 “Leave me alone, Mei!”",ok:false,why:"Mei steps back, hurt. She only wanted to help. Maybe there's a kinder way."},
   {t:"💪 Show Mei: “Can you help me find what's wrong?”",ok:true,reply:[
    say('mei',"Look… your tail starts too early. Professor Quill says every hard letter is just two easy letters holding hands.",s({},{arm:'wave'})),
    say('nora',"Two easy letters… holding hands. Okay. One more try.",s({arm:'wand'},{expr:'shy'})),
    say(null,"Swish… loop… tail. The Q glows gold for the very first time.",s({arm:'wand',expr:'wow'},{expr:'wow'}),{sfx:'gold'}),
    say('nora',"Mei, I did it! Thank you for not letting me quit.",s({arm:'wave'},{expr:'happy',arm:'wave'})),
    say(null,"Then something strange happens. Under Nora's golden Q, a line of silver writing appears on the page, all by itself.",s({expr:'wow'},{expr:'wow'},SILVER('Is anyone there?',640,170,44)),{sfx:'chime'}),
    say('mei',"That's the same silver ink as the word on the candle in Rune Hall!",s({expr:'wow'},{expr:'wow'},SILVER('Is anyone there?',640,170,44))),
    say(null,"Nora's hand is shaking a little. Underneath, she writes: Yes. I'm here. Who are you?",s({arm:'wand'},{expr:'wow'},SILVER('Is anyone there?',640,170,44))),
    say(null,"They wait and wait, until the candle burns low. But no answer comes.",s({expr:'sad'},{expr:'sad'})),
   ]}]}),
 ],done); },
 juniFear:done=>{ const s=(n,j)=>sc('field',[['nora',300,250,1,n],['juni',720,270,1,j]]); playStory([
  say(null,"It's broom test day. Everyone is zooming around the field, laughing and looping. Everyone except Juni. She hasn't moved.",s({},{expr:'sad'})),
  say('juni',"When I was little, I fell out of an apple tree. Now my legs turn into jelly whenever I'm up high.",s({expr:'sad'},{expr:'sad'})),
  say('juni',"If I fail the broom test, I can't stay in the Greenhouse Club. And the plants need me.",s({expr:'sad'},{expr:'sad'})),
  say(null,"What should Nora do?",s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:"🙄 “Just do it, it's easy!”",ok:false,why:"Juni looks down. Saying a fear is silly doesn't make it smaller. Try another way."},
   {t:"🧹 “Let's fly together, low and slow, one tree at a time.”",ok:true,reply:[
    say('nora',"Let's fly together. Low and slow. Just one tree at a time. I'll be right next to you the whole way.",s({arm:'wave'},{expr:'shy'})),
    say(null,"One tree… two trees… five trees… the whole orchard. Juni is flying!",s({arm:'wand',expr:'wow'},{expr:'wow',arm:'wave'}),{sfx:'gold'}),
    say('juni',"I did it! It's still scary… but I did it scared!",s({expr:'happy'},{expr:'happy',arm:'wave'})),
    say('nora',"That's exactly what brave means.",s({arm:'wave'},{expr:'happy'})),
    say('juni',"Nora, can I tell you something? On the night Ember's egg fell, Coach Bree was out on the field, staring at the sky. She looked like she'd seen a ghost.",s({expr:'wow'},{expr:'sad'})),
   ]}]}),
 ],done); },
 flightPre:done=>{ const s=(b,e,n={})=>sc('field',[['bree',260,250,1,b],['nora',700,250,1,n]],D(470,330,.8,e)); playStory([
  say(null,"Ember is twice as big as last week. She flaps and flops, flaps and flops. She just can't get off the ground.",s({},{expr:'sad'})),
  say('bree',"I'm Coach Bree, flying teacher. That little one needs wind words. Write a few, and she'll catch the breeze.",s({arm:'wave'},{})),
  say('bree',"I used to ride a dragon, you know. A big Dawnfeather named Thistle. Pink as a sunrise.",s({expr:'happy'},{expr:'wow'},{expr:'wow'})),
  say('nora',"Used to?",s({expr:'sad'},{},{expr:'sad'})),
  say('bree',"…That's a story for another day. Let's get this one flying.",s({expr:'sad'},{expr:'sad'})),
 ],done); },
 flightPost:done=>playStory([
  say(null,"Ember's wings catch the wind. Up… up… a loop-the-loop! She lands on Nora's head, very proud of herself.",sc('field',[['bree',260,250,1,{expr:'wow'}],['nora',700,260,1,{expr:'wow'}]],D(520,160,.8,{fly:true,expr:'happy'})),{sfx:'gold'}),
  say('bree',"She flies just like Thistle did.",sc('field',[['bree',260,250,1,{expr:'closed'}],['nora',700,260,1,{}]],D(700,90,.5,{expr:'happy'}))),
  say(null,"Coach Bree stares at the far mountains for a long, long time. Nora wants to ask about Thistle… but Bree's eyes look shiny, so she waits.",sc('field',[['bree',260,250,1,{expr:'sad'}],['nora',700,260,1,{expr:'sad'}]],D(700,90,.5,{}))),
 ],done),
 irisPre:done=>{ const s=(n,i)=>sc('courtyard',[['nora',300,250,1,n],['iris',730,260,1,i]]); playStory([
  say(null,"The whole academy crowds into the courtyard for the Wand Duel. Sunny is waving a sign that says GO NORA in very big letters.",s({arm:'wand',expr:'wow'},{expr:'smirk',flip:true})),
  say('iris',"Ready to lose, new girl? My fire shield has never been broken. Not once.",s({arm:'wand',expr:'sad'},{expr:'smirk',arm:'wand',flip:true})),
  say(null,"Nora's knees are wobbling. But she thinks of the golden Q, and of Mei saying, every hard letter is just two easy letters holding hands.",s({arm:'wand'},{expr:'smirk',flip:true})),
  say('prof',"Remember, this is a friendly duel. Spells hit the shield, never the student. Begin!",sc('courtyard',[['prof',512,240,1,{arm:'wave'}]])),
  say('mei',"Psst! Fire shields hate water spells!",sc('courtyard',[['mei',512,260,1,{expr:'wow',arm:'wave'}]])),
 ],done); },
 irisPost:done=>{ const s=(n,i)=>sc('courtyard',[['nora',300,250,1,n],['iris',730,260,1,i]]); playStory([
  say(null,"Iris's shield shatters into a hundred sparkles. The courtyard goes silent… then everyone cheers!",s({arm:'wand',expr:'wow'},{expr:'wow',flip:true}),{sfx:'gold'}),
  say('nora',"Good duel, Iris. Your fire shield was really strong.",s({arm:'wave'},{expr:'sad',flip:true})),
  say('iris',"…Whatever. You just got lucky.",s({},{expr:'sad',flip:true})),
  say(null,"Iris turns and walks away fast. But Nora notices something: her eyes were wet. And her hand kept reaching for an empty pocket.",s({expr:'sad'},{expr:'sad',flip:true})),
 ],done); },
 quill:done=>{ const s=(n,i)=>sc('courtyard',[['nora',300,250,1,n],['iris',720,270,1,i]]); playStory([
  say(null,"Behind the fountain, Iris is searching the grass on her hands and knees, again and again.",s({},{expr:'sad',flip:true})),
  say('iris',"It's gone. My mom's silver quill. Ink Imps took it while I was dueling. I saw their little ink footprints.",s({expr:'wow'},{expr:'sad',flip:true})),
  say('iris',"Mom works far away. She gave it to me so I'd have a piece of her here. It's the only thing I…",s({expr:'sad'},{expr:'sad',flip:true})),
  say(null,"What should Nora do?",s({expr:'sad'},{expr:'sad',flip:true}),{choices:[
   {t:"🙄 “Well, you were mean to me.”",ok:false,why:"That's true… but Iris looks so small right now. Being kind doesn't mean what she did was okay. Try again."},
   {t:"🤷 “Ask a teacher, not me.”",ok:false,why:"Iris turns away. Sometimes people just need someone to stand next to them. What else could Nora do?"},
   {t:"🤝 “I miss my family too. Let's get it back together.”",ok:true,reply:[
    say('nora',"I miss my family too, you know. Let's get your mom's quill back. Together.",s({arm:'wave'},{expr:'wow',flip:true})),
    say('iris',"You'd help me? Even after… everything I said?",s({},{expr:'shy',flip:true})),
    say('iris',"I'm sorry, Nora. I wasn't really mad at you. I was just lonely, and being mean felt easier than saying so.",s({},{expr:'sad',flip:true})),
    say('nora',"Apology accepted. Now… Ink Imps don't usually steal. Mei says pens and quills have been going missing all over the castle.",s({arm:'wand'},{expr:'wow',flip:true}),{sfx:'chime'}),
    say('iris',"Then somebody sent them. Come on. The footprints lead downstairs.",s({arm:'wand'},{expr:'happy',flip:true})),
   ]}]}),
 ],done); },
 impsPre:done=>{ const f=FOES.imps, s=(e)=>sc('cellar',[['iris',180,290,.85,{arm:'wand'}],['nora',420,260,1,{arm:'wand',expr:e}]],foeBody(f,'',790,300,.5)); playStory([
  say(null,"Down, down, down they go, until the stairs end in the Ink Cellar. It smells like wet paper and old secrets.",s('wow')),
  say(null,"Three giggling Ink Imps are juggling a shiny silver quill… and behind them is a mountain of stolen pens.",s('wow')),
  say('iris',"Ink Imps hate wind. It blows their ink everywhere!",s('happy')),
  say('nora',"Then let's make a storm!",s('happy')),
 ],done); },
 impsPost:done=>playStory([
  say(null,"The imps tumble away in a puff of ink. The silver quill spins in the air… and lands in Iris's hands.",sc('cellar',[['iris',330,270,1,{arm:'hold',expr:'wow'}],['nora',700,260,1,{expr:'happy'}]]),{sfx:'gold'}),
  say(null,"As the last imp squeezes into a crack in the wall, it squeaks: The Lonely One wanted ALL the pens! So nobody else can write!",sc('cellar',[['iris',330,270,1,{expr:'wow'}],['nora',700,260,1,{expr:'wow'}]])),
  say('iris',"The Lonely One? Who's that?",sc('cellar',[['iris',330,270,1,{expr:'wow'}],['nora',700,260,1,{expr:'sad'}]])),
  say('nora',"I don't know. But I think it's the same person who writes in silver ink.",sc('cellar',[['iris',330,270,1,{expr:'sad'}],['nora',700,260,1,{expr:'sad'}]])),
  say('iris',"Thank you, Nora. Will you… be my friend? A real one?",sc('cellar',[['iris',330,270,1,{arm:'hold',expr:'shy'}],['nora',700,260,1,{expr:'happy'}]])),
  say('nora',"I already am.",sc('cellar',[['iris',330,270,1,{expr:'happy',arm:'wave'}],['nora',700,260,1,{arm:'wave'}]]),{sfx:'chime'}),
 ],done),
 // ===== Chapter 3: The Fading Letters =====
 lola:done=>{ const s=(n,l)=>sc('library',[['nora',300,250,1,n],['lola',720,250,1,l]]); playStory([
  say(null,"Deep in the library, past the shelves that whisper, a glowing girl floats between the books. She's a ghost. A friendly one.",s({expr:'wow'},{})),
  say('lola',"Oh! A visitor! I'm Lola. I've lived in this library for two hundred years.",s({expr:'wow'},{arm:'wave',expr:'wow'})),
  say('lola',"I've read every book in here. Twice. But nobody has read with me in a very, very long time.",s({},{expr:'sad'})),
  say(null,"What should Nora do?",s({},{expr:'sad'}),{choices:[
   {t:"😱 Run away screaming",ok:false,why:"Lola fades a little. She's a ghost, but she has feelings too. Try again."},
   {t:"📖 Pick a book and read it aloud with her",ok:true,reply:[
    say('nora',"Want to read this one together? You can do the dragon voices.",s({arm:'hold'},{expr:'wow'})),
    say('lola',"Oh, I'd LOVE to! Once upon a time, high on the Five Peaks…",s({arm:'hold'},{expr:'happy',arm:'wave'}),{sfx:'chime'}),
    say(null,"They read until the candles burn down to stubs. Lola laughs so hard she floats upside down.",s({expr:'happy'},{expr:'happy'})),
    say('lola',"Thank you, Nora. Now, I know you're looking for clues. Fifty years ago, a girl with silver hair sat right here every day, writing letters.",s({expr:'wow'},{expr:'sad'})),
    say('lola',"Her name was Wren. One day she stopped coming. And now all the vanishing words drift toward the Hollow Tower, like leaves in a stream.",s({expr:'wow'},{expr:'sad'})),
   ]}]}),
 ],done); },
 songPre:done=>{ const s=(e,n)=>sc('room',[['nora',300,250,1,n]],D(700,320,.85,e)); playStory([
  say(null,"Ember sits on the windowsill, staring at the far mountains. She hums a few notes… then stops, and hides her head under her wing.",s({expr:'sad'},{expr:'sad'})),
  say('nora',"The old book said dragons sing their family's sky-song so they can find each other. You never got to learn yours, did you?",s({expr:'sad'},{expr:'sad'})),
  say('nora',"Then let's write you a brand new song, Ember. The best one ever.",s({},{arm:'wand'})),
 ],done); },
 songPost:done=>playStory([
  say(null,"Ember sings. The words float out of the window like golden birds, all the way to the mountains.",sc('room',[['nora',300,250,1,{expr:'wow'}]],D(700,300,.85,{expr:'closed'})),{sfx:'chime'}),
  say(null,"Then, very far away… an answering roar echoes from the Five Peaks.",sc('room',[['nora',300,250,1,{expr:'wow'}]],D(700,300,.85,{expr:'wow'})),{sfx:'boom'}),
  say('nora',"Ember! Your family is out there. And they heard you!",sc('room',[['nora',300,250,1,{arm:'wave',expr:'happy'}]],D(700,300,.85,{expr:'happy',fly:true}))),
  say(null,"Down on the field, a lonely figure in a teal jacket hears the roar too. Coach Bree drops her whistle.",sc('field',[['bree',512,250,1,{expr:'wow'}]])),
 ],done),
 truth:done=>{ const s=(n,m)=>sc('office',[['nora',330,250,1,n],['mei',720,270,.95,m]]); playStory([
  say(null,"Professor Quill's office is full of ticking clocks and tottering towers of books. While they wait, Mei reads the titles out loud.",s({},{expr:'happy'})),
  say(null,"Nora turns around too fast. CRASH! The ancient inkwell on the desk smashes into pieces.",s({expr:'wow'},{expr:'wow'}),{sfx:'boom'}),
  say('mei',"Oh no. That's her great-great-grandmother's inkwell. Quick, nobody saw. Let's just go.",s({expr:'sad'},{expr:'sad'})),
  say(null,"What should Nora do?",s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:"🏃 Sneak out before anyone comes",ok:false,why:"Nora's tummy twists. A secret like this gets heavier every day. Try another way."},
   {t:"🐈 Say the castle cat did it",ok:false,why:"Then the cat gets in trouble for something it didn't do. That isn't fair. What else could Nora do?"},
   {t:"🫶 Wait and tell Professor Quill the truth",ok:true,reply:[
    say('nora',"Professor… I broke your inkwell. It was an accident. I'm really sorry.",sc('office',[['nora',330,250,1,{expr:'sad'}],['prof',720,250,1,{expr:'sad'}]])),
    say(null,"For a long moment, Professor Quill says nothing. Nora's heart is thumping like a drum.",sc('office',[['nora',330,250,1,{expr:'sad'}],['prof',720,250,1,{expr:'sad'}]])),
    say('prof',"Thank you for telling me, Nora. That took more courage than any duel.",sc('office',[['nora',330,250,1,{expr:'shy'}],['prof',720,250,1,{expr:'happy'}]])),
    say('prof',"Wait… look. A folded note was hidden inside the inkwell all these years. It says: Wren is waiting in the Hollow Tower.",sc('office',[['nora',330,250,1,{expr:'wow'}],['prof',720,250,1,{arm:'hold',expr:'wow'}]]),{sfx:'chime'}),
    say('prof',"Wren was a student here long ago. One day she locked herself in the tower and never came out. We never knew why.",sc('office',[['nora',330,250,1,{expr:'sad'}],['prof',720,250,1,{expr:'sad'}]])),
   ]}]}),
 ],done); },
 spritePre:done=>{ const f=FOES.sprite, s=(e)=>sc('stairs',[['mei',180,290,.85,{expr:'wow'}],['iris',330,290,.85,{arm:'wand'}],['nora',540,260,1,{arm:'wand',expr:e}]],foeBody(f,'',840,290,.5)); playStory([
  say(null,"The stairs to the Hollow Tower float up into the clouds, and every step is covered in ice. A Frost Sprite blocks the way.",s('wow')),
  say('iris',"My mom says Frost Sprites melt from fire. I'll keep us warm. You cast!",s('happy')),
 ],done); },
 spritePost:done=>playStory([
  say(null,"The sprite melts into a puddle… and the puddle giggles and runs away. The stairs are open.",sc('stairs',[['nora',512,260,1,{arm:'wand',expr:'wow'}]]),{sfx:'gold'}),
  say(null,"At the very top, carved deep into the tower door, are two names inside a heart: WREN and ROSE. Best friends, forever.",sc('stairs',[['nora',512,260,1,{expr:'wow'}]],`<g font-family="'TeX Gyre Chorus',cursive" font-size="46" fill="#e9a91c" filter="url(#glow)"><text x="700" y="200">Wren &amp; Rose</text></g>`)),
  say('nora',"Rose… that's Grandma's name.",sc('stairs',[['nora',512,260,1,{expr:'sad',arm:'hold'}]])),
 ],done),
 // ===== Chapter 4: The Heart of Ink =====
 grandma:done=>{ const s=(n,gx)=>sc('gate',[['gran',300,270,1,gx],['nora',700,250,1,n]]); playStory([
  say(null,"At sunrise, a small figure in a blue robe is waiting at the academy gate, holding an old wand like she hasn't touched it in years.",s({expr:'wow'},{arm:'wave'}),{sfx:'chime'}),
  say('nora',"GRANDMA!",s({arm:'wave',expr:'happy'},{expr:'happy'})),
  say('gran',"You found Wren's name. Then it's time I told you the truth, sweetheart. All of it.",s({expr:'sad'},{expr:'sad'})),
  say('gran',"Wren was my best friend. We carved our names on that door. When we graduated, I promised to write to her every single week.",s({expr:'sad'},{expr:'sad'})),
  say('gran',"I wrote twice. Then I got busy with my new life… and I stopped. She waited and waited in that tower.",s({expr:'sad'},{expr:'sad'})),
  say('gran',"Her loneliness grew so big that it started eating the words of the whole world. The Fading is my fault.",s({expr:'sad'},{expr:'closed'})),
  say(null,"What should Nora say?",s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:"😤 “Grandma! How could you?”",ok:false,why:"Grandma's eyes fill with tears. She already feels terrible. Maybe there's a gentler way."},
   {t:"🤐 Pretend she didn't hear",ok:false,why:"Grandma looks even sadder. Hard truths are easier when someone listens. Try again."},
   {t:"🤗 Hug her: “Thank you for telling me. Let's fix it together.”",ok:true,reply:[
    say('nora',"Thank you for telling me the truth, Grandma. Everyone makes mistakes. Let's fix it, together.",s({arm:'wave'},{expr:'wow'})),
    say('gran',"You're braver than I ever was, sweetheart. Together, then.",s({expr:'happy'},{expr:'happy',arm:'wave'}),{sfx:'gold'}),
   ]}]}),
 ],done); },
 bree:done=>{ const s=(n,b)=>sc('bridge',[['nora',300,250,1,n],['bree',720,250,1,b]],D(520,380,.6,{expr:'sad'})); playStory([
  say(null,"Up on the windy tower bridge, Coach Bree is holding a faded pink ribbon. The wind tugs at it, but she won't let go.",s({},{expr:'sad'})),
  say('bree',"Twenty years ago, Thistle and I flew into a storm just like the one that's coming. I got scared and pulled us back too hard.",s({expr:'sad'},{expr:'sad'})),
  say('bree',"The wind tore us apart. I told everyone she flew away. The truth is… I let go.",s({expr:'sad'},{expr:'closed'})),
  say(null,"What should Nora say?",s({expr:'sad'},{expr:'sad'}),{choices:[
   {t:"😮 “So it was your fault?”",ok:false,why:"Coach Bree turns away. She already feels terrible. A kinder answer might help her heal."},
   {t:"💛 “Being scared isn't wrong. Telling the truth was brave.”",ok:true,reply:[
    say('nora',"Being scared isn't wrong. And telling the truth after all these years? That's really brave.",s({arm:'wave'},{expr:'wow'})),
    say('bree',"…Thank you, Nora. If Thistle is out there, I want to tell her I'm sorry.",s({},{expr:'happy'})),
    say('nora',"Ember's song got an answer from the Five Peaks. Maybe Thistle is closer than you think.",s({arm:'hold'},{expr:'wow'}),{sfx:'chime'}),
    say('bree',"Then I'm not hiding from storms anymore. When you climb that tower, I'll be right behind you.",s({arm:'wand'},{expr:'happy',arm:'wave'})),
   ]}]}),
 ],done); },
 golemPre:done=>{ const f=FOES.golem, s=(e)=>sc('tower',[['gran',170,280,.85,{arm:'wand'}],['nora',420,260,1,{arm:'wand',expr:e}]],foeBody(f,'',790,300,.5)); playStory([
  say(null,"Thunder shakes the bridge. The rain blows sideways. And out of the clouds, a giant Storm Golem rises up, made of rock and lightning.",s('wow')),
  say('gran',"Storms can't stand against solid ground. Earth spells, Nora! I'll hold the bridge steady!",s('happy')),
 ],done); },
 golemPost:done=>playStory([
  say(null,"The golem crumbles into little pebbles… and the storm clouds part. Moonlight floods the bridge.",sc('tower',[['gran',300,270,.95,{expr:'wow'}],['nora',650,250,1,{arm:'wand',expr:'wow'}]]),{sfx:'gold'}),
  say('gran',"Just one door left. She's in there. Fifty years, Nora. What if she hates me?",sc('tower',[['gran',300,270,.95,{expr:'sad'}],['nora',650,250,1,{expr:'sad'}]])),
  say('nora',"Then we'll keep knocking. That's what friends do.",sc('tower',[['gran',300,270,.95,{expr:'sad'}],['nora',650,250,1,{arm:'hold'}]])),
 ],done),
 wrenPre:done=>{ const f=FOES.wren, s=(e,g='sad')=>sc('tower',[['gran',170,280,.85,{expr:g}],['nora',420,260,1,{arm:'wand',expr:e}]],foeBody(f,'',800,300,.5)); playStory([
  say(null,"Inside the Hollow Tower, millions of faded words swirl through the air like dark snow. In the middle floats a girl with silver hair. Wren.",s('wow','wow')),
  say('wren',"Go away! Nobody ever comes. Nobody ever writes. I'll make ALL the words disappear!",s('sad')),
  say('gran',"Wren… it's me. Rose.",s('sad')),
  say('wren',"Rose? No. You're too late. FIFTY YEARS too late!",s('wow','wow')),
  say('nora',"Her shadow shield is too strong to talk through. Light spells first, then we can reach her!",s('happy')),
 ],done); },
 wrenMid:done=>{ const s=(e)=>sc('tower',[['gran',200,280,.9,{expr:'sad'}],['nora',480,260,1,{arm:'hold',expr:e}],['wren',800,270,.95,{expr:'sad',flip:true}]]); playStory([
  say(null,"The shadow shield shatters. Wren drops to the floor, small and shaking, just a girl again.",s('wow'),{sfx:'dissolve'}),
  say('nora',"Spells won't fix this part. Only words will.",s('sad')),
  say('nora',"Grandma, let's write her the letter she's been waiting for. Together.",s('happy')),
 ],done); },
 wrenPost:done=>{ const s=(w,g={expr:'happy',arm:'wave'})=>sc('tower',[['gran',230,270,.95,g],['nora',500,250,1,{arm:'wave'}],['wren',790,270,.95,w]],`<circle cx="512" cy="120" r="80" fill="url(#warm)"/>`); playStory([
  say(null,"The letter glows… and floats gently into Wren's hands. She reads it. Then she reads it again. Then she holds it to her heart.",s({arm:'hold',expr:'wow',flip:true}),{sfx:'chime'}),
  say('wren',"You… came back. You really came back.",s({expr:'shy',flip:true})),
  say('gran',"I'm so sorry I stopped writing, Wren. I thought about you every day, and I was too ashamed to start again. I'll never stop again. I promise.",s({expr:'sad',flip:true},{expr:'sad'})),
  say('wren',"I wrote 'Is anyone there?' in every book I could reach. And only one person ever wrote back.",s({expr:'sad',flip:true})),
  say('wren',"…It was you, wasn't it, Nora?",s({expr:'wow',flip:true})),
  say('nora',"Yes. I'm here. I've been here the whole time.",s({expr:'happy',flip:true}),{sfx:'chime'}),
  say(null,"All across the world, the faded words come flying home. Every lamp in the academy bursts into light.",sc('hall',[['mei',150,280,.85,{arm:'wave'}],['iris',330,280,.85,{arm:'wave'}],['nora',512,250,1.05,{arm:'wand',glow:true}],['wren',700,280,.85,{arm:'wave'}],['gran',870,280,.85,{arm:'wave'}]]),{sfx:'gold'}),
  say(null,"Then, out of the dawn sky, come giant shimmering wings. The Dawnfeather dragons have followed Ember's song!",sc('peaks',[['nora',300,260,1,{expr:'wow'}]],D(560,200,.55,{who:'thistle',stage:'big',fly:true})+D(820,380,.75,{fly:true,expr:'wow'})),{sfx:'boom'}),
  say('ember',"RRR-EEE!",sc('peaks',[['nora',300,260,1,{expr:'happy'}]],D(600,250,.5,{who:'thistle',stage:'big'})+D(800,360,.75,{expr:'happy',fly:true}))),
  say('thistle',"Little one! We have searched every sky for you since the storm.",sc('peaks',[['nora',260,260,1,{expr:'wow'}]],D(620,250,.5,{who:'thistle',stage:'big',expr:'closed'})+D(860,380,.7,{expr:'closed'}))),
  say('thistle',"…And Bree? Is that you? I never stopped looking for you either.",sc('peaks',[['bree',280,250,1,{expr:'wow'}]],D(640,250,.5,{who:'thistle',stage:'big',expr:'happy'}))),
  say('bree',"Thistle. I'm so sorry I let go.",sc('peaks',[['bree',280,250,1,{expr:'sad'}]],D(640,250,.5,{who:'thistle',stage:'big',expr:'sad'}))),
  say('thistle',"You held on to me in your heart for twenty years. That is enough.",sc('peaks',[['bree',280,250,1,{expr:'happy',arm:'wave'}]],D(640,250,.5,{who:'thistle',stage:'big',expr:'happy'})),{sfx:'chime'}),
  say('thistle',"Ember may stay at the academy with her friend Nora, if she wishes. Every summer, she will fly home to us.",sc('peaks',[['nora',260,260,1,{arm:'wave'}]],D(560,250,.5,{who:'thistle',stage:'big'})+D(840,330,.7,{expr:'happy',fly:true}))),
  say('wren',"Nora… would you write to me sometimes?",s({expr:'shy',flip:true})),
  say('nora',"Every week. In my very best cursive.",s({expr:'happy',arm:'wave',flip:true}),{sfx:'chime'}),
 ],done); },
};
