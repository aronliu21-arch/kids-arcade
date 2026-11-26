// Short scenes that play after a mission, so each place leads into the next one.
const TRANS={
 'c1:rune':()=>[
  say(null,"One by one, the blue candles flicker to life. But at the very end of the hall, one candle stays dark, no matter how carefully Nora writes.",sc('runehall',[['nora',420,260,1,{arm:'wand',expr:'sad'}]])),
  say(null,"As Nora leans closer, a single word appears in its wax, written in shimmering silver ink.",sc('runehall',[['nora',420,260,1,{expr:'wow'}]],SILVER('lonely',720,230))),
  say('nora',"Lonely? Who wrote that?",sc('runehall',[['nora',420,260,1,{expr:'wow'}]],SILVER('lonely',720,230))),
  say(null,"Before she can look closer, the word melts away. And from somewhere far below, Nora hears a small sound. Someone is crying.",sc('runehall',[['nora',420,260,1,{expr:'sad'}]]),{sfx:'dissolve'}),
 ],
 'c1:sunny':()=>[
  say(null,"A girl in the tower… and a candle that says lonely. Nora wants answers. Professor Quill said the library knows everything about the castle, so that's where she goes.",sc('library',[['nora',512,250,1.05,{arm:'hold'}]])),
 ],
 'c1:mei':()=>[
  say(null,"That night, a wild thunderstorm rolls over the castle. The windows rattle, and something bright streaks across the sky, like a falling star.",sc('courtyard',[['nora',512,250,1.05,{expr:'wow'}]]),{sfx:'boom'}),
  say(null,"In the morning, someone is waving at Nora from behind the greenhouse.",sc('greenhouse',[['nora',512,250,1.05,{}]])),
 ],
 'c1:roost':()=>[
  say(null,"With Ember snoring in her hood, Nora heads to the Light Bridge, the glowing path between the two tallest towers. Tonight it flickers… broken in the middle.",sc('bridge',[['nora',420,260,1,{arm:'wand'}]],D(560,190,.4,{expr:'closed'}))),
  say('nora',"Mei said it only listens to joined-up words. Okay, Ember. No lifting my wand.",sc('bridge',[['nora',420,260,1,{arm:'wand'}]])),
 ],
 'c1:chain':()=>[
  say(null,"The last plank of light clicks into place. From the middle of the bridge, Nora can see the whole castle… and the Hollow Tower, dark against the moon.",sc('bridge',[['nora',420,260,1,{expr:'wow'}]])),
  say(null,"In its highest window, just for a second, there's a face. A girl with silver hair. Then the curtain falls.",sc('tower',[['nora',300,260,1,{expr:'wow'}]])),
  say('nora',"Sunny was right. Someone IS up there.",sc('tower',[['nora',300,260,1,{expr:'sad'}]])),
  say(null,"Suddenly, every lamp near the Shadow Gate goes out at once. Mei comes running down the bridge, her glasses crooked.",sc('bridge',[['nora',300,260,1,{expr:'wow'}],['mei',720,280,.95,{expr:'wow'}]])),
  say('mei',"Nora! Something is eating the light at the Shadow Gate!",sc('bridge',[['nora',300,260,1,{arm:'wand',expr:'wow'}],['mei',720,280,.95,{expr:'wow',arm:'wave'}]])),
 ],
 'c2:caps':()=>[
  say(null,"Every capital in Capital Hall glows. Every one except the Q. It wobbles, sputters, and fizzles like a wet firework.",sc('hall',[['nora',512,250,1.05,{arm:'wand',expr:'sad'}]])),
  say('nora',"Tonight. I'll practice until I get it. Even if it takes all night.",sc('hall',[['nora',512,250,1.05,{arm:'wand'}]])),
 ],
 'c2:midnight':()=>[
  say(null,"The next morning, Nora can't stop thinking about the silver words. But today is broom test day, and someone by the orchard needs her.",sc('field',[['nora',512,250,1.05,{}]])),
 ],
 'c2:juni':()=>[
  say(null,"Ember is getting bigger every day. She can't fly yet, and it makes her very grumpy. She sulks in Nora's hood and puffs smoke rings.",sc('field',[['nora',420,250,1.05,{}]],D(700,330,.7,{expr:'sad'}))),
  say(null,"Coach Bree says it's time for her first flying lesson. Nora decides to watch Coach Bree very carefully.",sc('field',[['nora',420,250,1.05,{arm:'hold'}]],D(700,330,.7,{}))),
 ],
 'c2:flight':()=>[
  say(null,"And then, before Nora is ready… it's duel day.",sc('courtyard',[['nora',512,250,1.05,{arm:'wand',expr:'wow'}]]),{sfx:'boom'}),
 ],
 'c2:irisDuel':()=>[
  say(null,"After the duel, Nora goes looking for Iris. She doesn't want to win. She wants to understand.",sc('courtyard',[['nora',512,250,1.05,{}]])),
 ],
 'c2:quill':()=>[
  say(null,"Iris and Nora follow a trail of tiny inky footprints. Down the stairs… down more stairs… all the way to the Ink Cellar.",sc('cellar',[['iris',330,280,.95,{arm:'wand'}],['nora',650,260,1,{arm:'wand'}]])),
 ],
 'c3:home':()=>[
  say(null,"Nora's letter flies away with the castle owls. While she waits for Grandma's answer, she goes to the deepest part of the library to search for anything about the Hollow Tower.",sc('library',[['nora',512,250,1.05,{arm:'hold'}]])),
  say(null,"On the dustiest shelf, something is glowing.",sc('library',[['nora',512,250,1.05,{expr:'wow'}]])),
 ],
 'c3:lola':()=>[
  say('lola',"The oldest books are almost blank now. If the lost words come back, maybe we can read what happened to Wren.",sc('library',[['nora',300,250,1,{expr:'sad'}],['lola',720,250,1,{expr:'sad'}]])),
 ],
 'c3:restore':()=>[
  say(null,"The pages fill with words again. One of them tells an old legend: Dawnfeather dragons find each other by singing their family's sky-song.",sc('library',[['nora',512,250,1.05,{arm:'hold',expr:'wow'}]])),
  say('nora',"Ember never heard her family's song. She was just an egg. I have to help her.",sc('library',[['nora',512,250,1.05,{arm:'hold',expr:'sad'}]])),
 ],
 'c3:song':()=>[
  say(null,"The next morning, Professor Quill calls Nora to her office. I hear you've been asking about Wren, she says. Wait here. I'll find the old school records.",sc('office',[['nora',300,250,1,{expr:'wow'}],['prof',720,250,1,{}]])),
 ],
 'c3:truth':()=>[
  say(null,"That night, Nora, Mei and Iris tiptoe out of bed. Nobody says it out loud, but they all know where they're going. The Hollow Tower.",sc('stairs',[['mei',230,280,.9,{expr:'wow'}],['nora',512,250,1.05,{arm:'wand'}],['iris',790,280,.9,{arm:'wand'}]])),
 ],
 'c4:grandma':()=>[
  say(null,"Grandma hugs Coach Bree at the gate like an old friend. Bree, you were the best dragon rider I ever saw, she says. Bree just looks away.",sc('gate',[['gran',300,270,1,{expr:'happy'}],['bree',720,250,1,{expr:'sad'}]])),
  say(null,"Later, Nora finds Coach Bree alone on the windy bridge.",sc('bridge',[['nora',512,250,1.05,{}]])),
 ],
 'c4:bree':()=>[
  say('gran',"The Hollow Tower is guarded by fear, Nora. To climb it, we need courage shields. And courage words are the hardest words of all to write.",sc('hall',[['gran',300,270,1,{expr:'sad'}],['nora',700,250,1,{arm:'wand'}]])),
 ],
 'c4:courage':()=>[
  say(null,"Shields glowing, Nora and Grandma start the long climb. The wind gets louder… and louder… until the storm itself stands up.",sc('tower',[['gran',300,280,.9,{arm:'wand'}],['nora',650,260,1,{arm:'wand',expr:'wow'}]]),{sfx:'boom'}),
 ],
};
const STORY_RESULT={ sunny:['Sunny found her way!','🌟','Try it today: help someone who looks lost or new.'], juniFear:['Juni flew!','🌳','Try it today: do one small brave thing, even if you feel scared.'], lola:['You read with Lola!','👻📖','Try it today: read a book aloud to someone in your family.'], bree:['Coach Bree told the truth!','💛','Try it today: tell someone you love about a time you felt scared.'],
 mei:['You made a new friend: Mei!','💜','Try it today: if a friend makes a mistake, tell them about a time you made one too.'],
 wispPost:['You saved the Shadow Wisp!'], midnight:['You didn\'t give up!','💪','Try it today: practice the hardest letter you know five times. It gets easier!'],
 irisPost:['You won the Wand Duel!'], quill:['You chose kindness!','🤝','Try it today: if someone seems grumpy, ask if they\'re okay.'], impsPost:['You got the silver quill back!'],
 truth:['You told the truth!','🫶','Try it today: honesty is a superpower. Use it even when it\'s hard.'], spritePost:['You melted the Frost Sprite!'],
 grandma:['You and Grandma are a team!','👵💜','Try it today: ask a grandparent about their best friend when they were little.'], golemPost:['You calmed the Storm Golem!'], wrenPost:['You saved Wren, and the whole world\'s words!'] };

// ----- chapter openings and endings
const CH_TEXT={
 1:{end:()=>{ const hall=(n,i,m='shy')=>sc('hall',[['mei',230,270,.95,{expr:m}],['nora',512,250,1.1,{expr:n}],['iris',800,270,.95,{expr:i,flip:true}]]); return [
  say(null,"Back in the great hall, everyone is talking about the new girl who saved the Shadow Gate. Well… almost everyone is smiling.",hall('happy','smirk','happy')),
  say('iris',"So you're the new girl everyone keeps talking about.",hall('wow','smirk','wow')),
  say('iris',"You lit a few candles. Cute. I bet you can't even write a capital Q.",hall('sad','smirk','sad')),
  say('nora',"I… I've never tried a Q. But I'm not giving up.",hall('sad','smirk')),
  say('iris',"We'll see. Wand Duel. One week. Don't be late.",hall('sad','happy')),
  say('mei',"Don't listen to her. Iris is the best duelist in our year… but I've never once seen her smile.",sc('hall',[['mei',300,270,1,{expr:'sad'}],['nora',700,250,1.05,{}]])),
  say(null,"That night, Nora opens Grandma's letter, just to feel close to home. She reads the first line… and freezes.",sc('room',[['nora',512,250,1.1,{arm:'hold',expr:'wow'}]])),
  say(null,"Some of the words are gone. Not smudged. Not torn. Just… fading away, like footprints in the snow.",sc('room',[['nora',512,250,1.1,{arm:'hold',expr:'sad'}]],fadeLetters())),
  say('nora',"The lamps… the bridge… and now Grandma's letter. What is happening to all the words?",sc('room',[['nora',512,250,1.1,{arm:'hold',expr:'sad'}]],fadeLetters())),
 ]; }},
 2:{start:()=>[
   say(null,"A week later, the whole academy is buzzing about one thing: the Wand Duel. But Nora has a problem. A big, curly problem.",sc('courtyard',[['nora',512,250,1.05,{arm:'wand',expr:'sad'}]])),
   say('nora',"The capital Q. Iris was right. I really can't write it.",sc('courtyard',[['nora',512,250,1.05,{arm:'wand',expr:'sad'}]])),
   say(null,"Meanwhile, every morning a few more lamps are dark. And every night, Grandma's letter has a few less words.",sc('room',[['nora',512,250,1.05,{arm:'hold',expr:'sad'}]],fadeLetters())) ],
    end:()=>[
   say(null,"That night, three friends share hot cocoa by the fire in the common room. Iris tells them about her mom. Mei tells terrible jokes. Nora laughs until her tummy hurts.",sc('common',[['mei',230,270,.95,{expr:'happy'}],['nora',512,250,1.05,{arm:'hold'}],['iris',800,270,.95,{expr:'happy',flip:true}]])),
   say(null,"But outside the window, one by one, more lamps are going dark.",sc('common',[['mei',230,270,.95,{expr:'sad'}],['nora',512,250,1.05,{expr:'wow'}],['iris',800,270,.95,{expr:'sad',flip:true}]])),
   say(null,"Back in her room, Nora unfolds Grandma's letter. It's almost blank now. Then, in the empty space, silver words appear.",sc('room',[['nora',512,250,1.05,{arm:'hold',expr:'wow'}]],SILVER('Please. Somebody. Write to me.',640,170,40))),
   say('nora',"The Lonely One. Whoever you are… I'm going to find you.",sc('room',[['nora',512,250,1.05,{arm:'wand'}]],SILVER('Please. Somebody. Write to me.',640,170,40))) ]},
 3:{start:()=>[
   say(null,"Words are vanishing everywhere now: from books, from signs, from the names on the classroom doors. Even the birthday cards in the post room are blank.",sc('library',[['nora',512,250,1.05,{arm:'hold',expr:'sad'}]],fadeLetters())),
   say('nora',"If words are disappearing, then I'll write new ones. And I'll start with the most important letter of all. One to Grandma.",sc('room',[['nora',512,250,1.05,{arm:'wand'}]])) ],
    end:()=>[
   say('nora',"Wren and Rose… I need to ask Grandma. Right now.",sc('room',[['nora',512,250,1.05,{arm:'wand',expr:'sad'}]])),
   say(null,"Just then, an owl taps on the window. It's Grandma's answer. Only one line is left on the whole page.",sc('room',[['nora',512,250,1.05,{arm:'hold',expr:'wow'}]],ENVELOPE),{sfx:'chime'}),
   say(null,"It says: I'm coming.",sc('room',[['nora',512,250,1.05,{arm:'hold',expr:'wow'}]],`<text x="700" y="220" font-family="'TeX Gyre Chorus',cursive" font-size="54" fill="#e9a91c" filter="url(#glow)">I'm coming.</text>`)) ]},
 4:{start:()=>[
   say(null,"The sky over the academy turns dark and stormy. The Fading is growing stronger. Now even the stars look faded.",sc('tower',[['nora',512,250,1.05,{arm:'wand',expr:'wow'}]])),
   say(null,"But this morning, someone new is coming up the hill.",sc('gate',[['nora',512,250,1.05,{expr:'wow'}]])) ],
    end:()=>[
   say(null,"At the celebration, everyone Nora helped is there: Sunny with her stickers, Juni with flowers, Lola reading aloud, Mei with homemade dumplings, Iris with her silver quill.",sc('hall',[['sunny',120,300,.75,{arm:'wave'}],['juni',270,290,.8,{arm:'wave'}],['mei',420,280,.85,{expr:'happy'}],['nora',580,250,1,{glow:true}],['iris',740,280,.85,{arm:'wave'}],['lola',890,280,.8,{arm:'wave'}]])),
   say(null,"And in the seat next to Grandma, smiling for the first time in fifty years, sits Wren.",sc('hall',[['gran',300,270,1,{expr:'happy'}],['wren',700,270,1,{expr:'happy'}]])),
   say('prof',"Nora, you came here to learn cursive. Instead, you taught all of us what words are really for.",sc('hall',[['prof',300,250,1,{arm:'wave'}],['nora',700,250,1.05,{glow:true}]])),
   say('nora',"For telling the truth. For saying sorry. For telling people they're not alone.",sc('hall',[['prof',300,250,1,{expr:'happy'}],['nora',700,250,1.05,{arm:'wand',glow:true}]]),{sfx:'gold'}),
   say(null,"That night, a letter taps on Nora's window. The handwriting is silver, and a little shaky, and very, very happy.",sc('room',[['nora',512,250,1.1,{arm:'hold',glow:true}]],`<text x="640" y="200" font-family="'TeX Gyre Chorus',cursive" font-size="54" fill="#e9a91c" filter="url(#glow)">Dear Nora,</text>`)),
   say(null,"The End… for now.",sc('room',[['nora',512,250,1.1,{arm:'hold',glow:true}]],`<text x="640" y="200" font-family="'TeX Gyre Chorus',cursive" font-size="54" fill="#e9a91c" filter="url(#glow)">Dear Nora,</text>`)) ]},
};
