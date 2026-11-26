const DRAGON_W=['egg','wing','claw','tail','scale','nest','roar','horn','hatch','snout','talon','spike','warm','safe','tiny','glowy','dragon','feather'];
const FLIGHT_W=['soar','glide','swoop','loop','lift','high','float','zoom','dive','flap','sky','up and away','spin','rise','breezy'];
const SONG_W=['sing','song','echo','hum','tune','call','peak','far','near','listen','music','hello there','find me','sky song'];
const FINAL=['you are','not alone']; // only ever used in the final battle
// No repeats, ever: anything Nora has written (letters, words, spells) goes into S.seen and is never served again.
// When an easier list runs out, the next harder list is used instead.
function pickUnseen(pools,n,ex=[]){ const out=[]; for(const pool of pools){ const un=shuffle([...new Set(pool)].filter(t=>!S.seen.includes(t)&&!out.includes(t)&&!ex.includes(t))); while(out.length<n&&un.length) out.push(un.pop()); if(out.length>=n) break; } return out; }
// ---- Joining school: Nora is still learning to connect letters, so joined words start tiny and grow with her.
// Tier goes up after enough successful joined words. Theme words are only used once they fit her tier.
const JOIN_T=[
 ['in','it','an','at','is','us','up','am','me','he','hi','ad'],                       // 0: two letters, easy bottom joins
 ['sun','run','fun','mud','cat','hat','man','pin','tin','cup','pet','ten','lit','sit','net','hen','nut','map'],   // 1: three letters
 ['on','no','so','we','owl','cow','box','bun','web','wig','wand','glow','moon','book','star','lamp','nest','frog','bell','swim'], // 2: tricky high joins (o, w, b) + four letters
 ['spell','magic','brave','quill','broom','light','shine','sweet','smile','cloud','dream','happy'], // 3: five letters
 ['castle','friend','wizard','potion','dragon','secret','garden','candle','school','window'],     // 4: six letters
 [] ];                                                                                    // 5: anything, phrases too
const JOIN_MAX=[2,3,4,5,6,99], JOIN_AT=[0,4,9,15,22,30];
function joinTier(){ const k=S.joinOK||0; let t=0; JOIN_AT.forEach((v,i)=>{ if(k>=v) t=i; }); return t; }
function fitsJoin(w,t=joinTier()){ if(w.includes(' ')&&t<5) return false; return w.replace(/ /g,'').length<=JOIN_MAX[t]; }
function pickWords(themes,n){ const t=joinTier(); const lists=[...themes]; for(let i=t;i>=0;i--) lists.push(JOIN_T[i]); const out=[];
 for(const L of lists){ const un=shuffle([...new Set(L)].filter(w=>fitsJoin(w,t)&&!S.seen.includes(w)&&!out.includes(w))); while(out.length<n&&un.length) out.push(un.pop()); if(out.length>=n) break; }
 if(out.length<n) out.push(...pickUnseen([JOIN_T.flat(),WORDS2,WORDS3],n-out.length,out)); return out; }
const POOLS={
 rune:()=>{ const L=pickUnseen([LOWER_P,UPPER_P],2); return [...L,...pickWords([],1)]; },
 chain:()=>pickWords([],3),
 caps:()=>{ const q=S.seen.includes('Q')?[]:['Q']; return [...q,...pickUnseen([UPPER_P],3-q.length,q)]; },
 family:()=>pickWords([FAMILY],3),
 restore:()=>pickWords([WORDS3,WORDS2],3),
 courage:()=>pickWords([COURAGE,WORDS3],3),
 dragon:()=>pickWords([DRAGON_W,WORDS2],3),
 flight:()=>pickWords([FLIGHT_W,DRAGON_W,WORDS2],3),
 song:()=>pickWords([SONG_W,FAMILY,WORDS3],3),
};

// ---- battle spells: write the word to cast that element (each word used once, ever)
const ELEM={fire:{e:'🔥',c:'#fa5252',n:'Fire'},ice:{e:'❄️',c:'#74c0fc',n:'Ice'},water:{e:'💧',c:'#339af0',n:'Water'},wind:{e:'🌪️',c:'#96f2d7',n:'Wind'},light:{e:'☀️',c:'#ffd43b',n:'Light'},earth:{e:'🪨',c:'#a9876b',n:'Earth'},bolt:{e:'⚡',c:'#fab005',n:'Thunder'}};
const SPELLS={ // [short words for beginners, longer words]
 fire:[['heat','fire','hot','lava','burn','warm'],['flame','blaze','ember','spark','torch','sizzle','magma','bonfire']],
 ice:[['ice','snow','cold','hail','cool'],['frost','chill','freeze','icicle','frozen','sleet','glacier','blizzard']],
 water:[['rain','wet','sea','drip','mist','lake','tide'],['wave','splash','river','puddle','ocean','stream','shower','fountain']],
 wind:[['wind','gust','air','puff','blow'],['breeze','storm','whirl','tornado','cloud','swirl','flutter','whoosh']],
 light:[['sun','glow','ray','halo','dawn'],['shine','beam','light','bright','sunny','gleam','glimmer','twinkle','beacon','radiant']],
 earth:[['rock','mud','leaf','sand','clay','root','moss','tree'],['stone','vine','pebble','boulder','mountain','forest','acorn','meadow']],
 bolt:[['zap','bolt','jolt','buzz','volt'],['thunder','flash','static','shock','crackle','lightning']] };
const ELEM_OF={}; for(const k in SPELLS) SPELLS[k].flat().forEach(w=>ELEM_OF[w]=k);
function spellCards(weak){ const tier=w=>{ const all=SPELLS[w].flat(); const ok=all.filter(x=>fitsJoin(x)); return ok.length?ok:all.slice().sort((a,b)=>a.length-b.length); };
 const want=[weak,...shuffle(Object.keys(SPELLS).filter(k=>k!==weak))]; const out=[];
 for(const el of want){ const w=tier(el).find(x=>!S.seen.includes(x)); if(w) out.push(w); if(out.length>=3) break; } return shuffle(out); }

// ---- foes
const FOES={
 wisp:{name:'Shadow Wisp',hp:4,weak:'light',kind:'blob',body:'#2b2540',eye:'#ffd43b',bg:'hall'},
 iris:{name:'Iris (friendly duel)',hp:4,weak:'water',kind:'girl',who:'iris',shield:'#ff8787',bg:'courtyard',duel:true},
 imps:{name:'Ink Imps',hp:5,weak:'wind',kind:'imps',body:'#1b1b2f',eye:'#69db7c',bg:'library'},
 sprite:{name:'Frost Sprite',hp:5,weak:'fire',kind:'crystal',body:'#a5d8ff',eye:'#1864ab',bg:'stairs'},
 golem:{name:'Storm Golem',hp:6,weak:'earth',kind:'golem',body:'#495057',eye:'#fab005',bg:'tower'},
 wren:{name:'The Hollow Quill',hp:6,weak:'light',kind:'girl',who:'wren',shield:'#5f3dc4',bg:'tower',final:true},
};

// ---- chapters
const sc=(bg,chars,extra)=>sceneSVG(bg,chars,extra||'');
const CHAPTERS=[
 {n:1,title:'The Lamps Go Dark',theme:'night',missions:[
  {id:'rune',icon:'🕯️',name:'Rune Hall',x:22,y:40,kind:'write',pool:'rune',title:'Rune Casting',goal:'Light the candles',done:'The candles are glowing!',
   intro:'The castle lamps are going dark! Trace each rune to light a candle.',tip:'Try it today: write your name in cursive on something you made.'},
  {id:'sunny',icon:'🕯️',name:'Big Stairs',x:36,y:56,kind:'story',story:'sunny',title:'Lost on Day One'},
  {id:'mei',icon:'📚',name:'Library',x:50,y:28,kind:'story',story:'mei',title:'A Friend in the Library'},
  {id:'roost',icon:'🥚',name:'Greenhouse',x:62,y:44,kind:'write',pool:'dragon',pre:'eggPre',post:'eggPost',title:'The Dragon Egg',goal:'Keep the egg warm',done:'Ember has hatched!',
   intro:'Write warm dragon words. The egg is listening!',tip:'Try it today: draw a baby dragon and write its name in cursive.'},
  {id:'chain',icon:'🌉',name:'Light Bridge',x:76,y:62,kind:'write',pool:'chain',title:'Spell Chain',goal:'Build the bridge of light',done:'The bridge of light is built!',
   intro:'Join the letters without lifting your wand. Each joined word adds a plank of light!',tip:'Try it today: write a short note to someone in your family in cursive.'},
  {id:'duel',icon:'⚔️',name:'Shadow Gate',x:88,y:34,kind:'battle',foe:'wisp',pre:'wispPre',post:'wispPost',title:'Spell Battle',
   tip:'Try it today: write a secret "spell word" in cursive and hide it for someone to find.'},
  {id:'fly',icon:'✨',name:'Firefly Garden',x:32,y:72,kind:'mini',game:'fireflies',after:'rune'},
 ]},
 {n:2,title:'The Wand Duel',theme:'dusk',missions:[
  {id:'caps',icon:'🏛️',name:'Capital Hall',x:20,y:42,kind:'write',pool:'caps',title:'Capital Casting',goal:'Master the capitals',done:'Capital letters mastered!',
   intro:'Capitals are the strongest runes. Even the tricky Q!',tip:'Try it today: write the first letter of everyone in your family as a cursive capital.'},
  {id:'midnight',icon:'🌙',name:'Night Tower',x:46,y:24,kind:'story',story:'midnight',title:'Midnight Practice'},
  {id:'juni',icon:'🌳',name:'Orchard',x:32,y:60,kind:'story',story:'juniFear',title:'Brave and Scared'},
  {id:'flight',icon:'🐉',name:'Dragon Field',x:56,y:66,kind:'write',pool:'flight',needs:'c1:roost',pre:'flightPre',post:'flightPost',title:'Ember\'s First Flight',goal:'Give Ember wind words',done:'Ember can fly!',
   intro:'Write wind words to lift Ember\'s wings!',tip:'Try it today: make a paper airplane and write a cursive word on its wings.'},
  {id:'broom',icon:'🧹',name:'Broom Field',x:16,y:76,kind:'mini',game:'broom',after:'juni'},
  {id:'irisDuel',icon:'⚔️',name:'Duel Ring',x:66,y:40,kind:'battle',foe:'iris',pre:'irisPre',post:'irisPost',title:'Wand Duel',
   tip:'Try it today: after a game, tell the other player "good game!" whether you win or lose.'},
  {id:'quill',icon:'🪶',name:'Courtyard',x:82,y:66,kind:'story',story:'quill',title:'The Missing Quill'},
  {id:'imps',icon:'👾',name:'Ink Cellar',x:90,y:30,kind:'battle',foe:'imps',pre:'impsPre',post:'impsPost',title:'Spell Battle',
   tip:'Try it today: help someone find something they lost.'},
 ]},
 {n:3,title:'The Fading Letters',theme:'violet',missions:[
  {id:'home',icon:'💌',name:'Owl Post',x:18,y:44,kind:'write',pool:'family',title:'Letters Home',goal:'Write words for Grandma',done:'Your letter flew home!',
   intro:'Grandma\'s letter is fading. Write words full of love to send home and keep the magic strong.',tip:'Try it today: write a real letter or card to a grandparent.'},
  {id:'lola',icon:'👻',name:'Ghost Shelves',x:32,y:56,kind:'story',story:'lola',title:'The Library Ghost'},
  {id:'restore',icon:'📜',name:'Deep Library',x:44,y:26,kind:'write',pool:'restore',title:'Restore the Pages',goal:'Bring back the lost words',done:'The pages are whole again!',
   intro:'Words are vanishing from the old books. Rewrite them in cursive to bring them back.',tip:'Try it today: copy a favorite sentence from a book in cursive.'},
  {id:'song',icon:'🎵',name:'Dragon Window',x:58,y:36,kind:'write',pool:'song',pre:'songPre',post:'songPost',title:'Ember\'s Sky-Song',goal:'Write Ember a song',done:'Ember\'s song reached the mountains!',
   intro:'Write song words for Ember to sing to her family.',tip:'Try it today: make up a short song about your family and write the title in cursive.'},
  {id:'potion',icon:'🧪',name:'Potion Room',x:16,y:76,kind:'mini',game:'potion',after:'home'},
  {id:'truth',icon:'🫖',name:'Quill\'s Office',x:66,y:52,kind:'story',story:'truth',title:'The Broken Inkwell'},
  {id:'sprite',icon:'❄️',name:'Frozen Stairs',x:88,y:30,kind:'battle',foe:'sprite',pre:'spritePre',post:'spritePost',title:'Spell Battle',
   tip:'Try it today: when you make a mistake, say "I did it, I\'m sorry." It takes real courage.'},
 ]},
 {n:4,title:'The Heart of Ink',theme:'storm',missions:[
  {id:'grandma',icon:'👵',name:'Academy Gate',x:20,y:44,kind:'story',story:'grandma',title:'Grandma\'s Secret'},
  {id:'bree',icon:'🌬️',name:'Windy Bridge',x:34,y:58,kind:'story',story:'bree',title:'Coach Bree\'s Secret'},
  {id:'courage',icon:'🛡️',name:'Courage Hall',x:44,y:28,kind:'write',pool:'courage',title:'Courage Words',goal:'Charge the shields',done:'Your courage shield is glowing!',
   intro:'Courage words make the strongest shields. Write each one, joined together.',tip:'Try it today: when something is hard, say "try again" out loud. It really helps.'},
  {id:'lanterns',icon:'🏮',name:'Sky Garden',x:16,y:78,kind:'mini',game:'lanterns',after:'courage'},
  {id:'golem',icon:'🌩️',name:'Storm Bridge',x:68,y:56,kind:'battle',foe:'golem',pre:'golemPre',post:'golemPost',title:'Spell Battle',
   tip:'Try it today: count to five and breathe when you feel stormy inside.'},
  {id:'wren',icon:'🕯️',name:'Hollow Tower',x:88,y:24,kind:'battle',foe:'wren',pre:'wrenPre',post:'wrenPost',title:'Final Battle',
   tip:'Try it today: write a note to someone who might feel lonely.'},
 ]},
];
const CH=n=>CHAPTERS[n-1];
const key=(n,id)=>`c${n}:${id}`;
const isDone=(n,id)=>!!S.done[key(n,id)];
const mainOf=n=>CH(n).missions.filter(m=>m.kind!=='mini');
const nextMain=(n=S.view)=>mainOf(n).find(m=>!isDone(n,m.id));
function isOpen(n,m){ if(n>S.ch) return false; if(m.needs&&!S.done[m.needs]) return false; if(m.kind==='mini') return isDone(n,m.after); const L=mainOf(n),k=L.indexOf(m); return k===0||isDone(n,L[k-1].id); }


