
/* ================= helpers ================= */
const $=s=>document.querySelector(s);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const R=n=>Math.floor(Math.random()*n), RI=(a,b)=>a+R(b-a+1), pick=a=>a[R(a.length)];
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=R(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasCJK=s=>/[㄀-ㄯ一-鿿]/.test(s);

/* ================= sprites (16x16, 2px+ pixels) ================= */
const SPR={
dino:['................','.........kkkk...','........kGGGGk..','.......kGGwkGGk.','.......kGGGGGGGk','.......kGGGGrrrk','..k....kGGGGkkk.','.kGk..kGGGGk....','.kGGkkGGGGGGk...','..kGGGGyyGGGk...','...kGGyyyyGGkk..','...kGGyyyyGGkGk.','....kGGyyGGk.k..','....kGGkkGGk....','....kkk..kkk....','................'],
bird:['................','......k.k.......','.....kYkYk......','.....kkkkkk.....','....kYYYwkYk....','....kYYYkkYkk...','....kYYYYYYooo..','...kkYYYYYYkk...','..kYkYYYYYYk....','.kYYkYyyyyYYk...','.kYYYkyyyyYYk...','..kYYkyyyyYk....','...kkYYYYYk.....','.....kokok......','.....kk.kk......','................'],
cat:['................','..k.....k.......','.kOk...kOk......','.kOOkkkOOk......','.kOOOOOOOk......','.kOwkOOwkOk.....','.kOkkOOkkOk.....','.kOOOrrOOOk..kk.','..kOOOOOOk..kRk.','...kOOOOOOkkRk..','..kOyyyyOOOkk...','..kOyyyyOOOk....','..kOOkOOkOOk....','..kkk.kk.kkk....','................','................'],
turtle:['................','................','................','....kkkkkk......','...kTtTTtTk.kkk.','..kTTtTTtTTkBBBk','.kTtTTtTTtTTkBwk','.kTTtTTtTTtTkBBk','kkkkkkkkkkkkkBrk','kBBkyyyyyyykBBk.','kBBkkkkkkkkkBk..','.kk.kBk..kBk.k..','....kBk..kBk....','....kkk..kkk....','................','................'],
bunny:['....kk..kk......','...kWk.kWk......','...kWk.kWk......','...kWk.kWk......','...kWWkWWk......','..kWWWWWWWk.....','..kWWwkWWwkk....','..kWWkkWWkkk....','..kWpWWWWpWk....','...kWWkkWWk..kk.','..kLLWWWWLLk.kLk','.kLLWWWWWWLLkLk.','.kWWWWWWWWWWkk..','..kWWkkkkWWk....','..kkk....kkk....','................'],
penguin:['................','.....kkkkk......','....kNNNNNk.....','...kNNNNNNNk....','...kNwkNwkNk....','...kNNNNNNoook..','...kNNwwwwNk....','..kNNwwwwwwNk...','.kNkNwwwwwwNkNk.','.kNkNwwwwwwNkNk.','..kkNwwwwwwNkk..','...kNNwwwwNNk...','....kNNNNNNk....','...kooook.oook..','...kkkkk..kkkk..','................'],
owl:['................','..kk......kk....','..kUk....kUk....','..kUUkkkkUUk....','.kUUUUUUUUUUk...','.kUkkkUUkkkUk...','.kkwwwkkwwwkk...','.kkwkwkkwkwkk...','.kUkkkookkkUk...','..kUUUooUUUk....','.kUUyyyyyyUUk...','.kUyyyyyyyyUk...','.kUUyyyyyyUUk...','..kUUUUUUUUk....','...kokk.kkok....','...kk.....kk....'],
wyrm:['................','..........kk....','........kkDk....','.......kDDDDk...','..k...kDDwkDDk..','.kDk..kDDkkDDDk.','.kDDk.kDDDDDkkk.','.kDDDkDDDDDk....','..kDDDDDDDDk....','..kkDDyyyDDDk...','.kDDDyyyyDDDk..k','kDDkDyyyyDDDDkDk','.kk.kDyyDDkDDDk.','....kDDkDDk.kk..','....kkk.kkk.....','................'],
bear:['................','..kk.....kk.....','.kBBk...kBBk....','.kBbBkkkBbBk....','..kBBBBBBBk.....','.kBBwkBBwkBk....','.kBBkkBBkkBk....','.kBBBbbbBBBk....','.kBBbbkbbBBk....','..kBBbbbBBk.....','.kBBBBBBBBBk....','kBBkbbbbbkBBk...','kBBkbbbbbkBBk...','.kkkBBkBBkkk....','...kkk.kkk......','................'],
fox:['................','.kk........kk...','.kPk......kPk...','.kPPk....kPPk...','.kPPPkkkkPPPk...','..kPPPPPPPPk....','.kPPwkPPwkPPk...','.kPPkkPPkkPPk...','.kPPPPkkPPPPk...','..kPPPPPPPPk..k.','...kPWWWWPk..kSk','..kPPWWWWPPkkSSk','..kPPWWWWPPkSSk.','..kPPkPPkPPkk...','..kkk.kk.kkk....','................'],
slime:['................','................','.....kkkkkk.....','....kBBBBBBk....','...kBBwBBBBBk...','..kBBBBBBBBBBk..','..kBkwkBBkwkBk..','.kBBkkkBBkkkBBk.','.kBBBBBBBBBBBBk.','.kBBBkkkkkkBBBk.','.kbBBBBBBBBBBbk.','.kbbBBBBBBBBbbk.','..kbbbbbbbbbbk..','...kkkkkkkkkk...','................','................'],
bat:['................','................','.k............k.','.kk..k....k..kk.','.kVk.kk..kk.kVk.','.kVVkkVkkVkkVVk.','.kVVVVVVVVVVVVk.','.kVVVkwVVwkVVVk.','..kVVkrVVrkVVk..','...kVVVwwVVVk...','....kVVVVVVk....','.....kkVVkk.....','.......kk.......','................','................','................'],
mush:['................','.....kkkkkk.....','...kkRRwRRRkk...','..kRRRRRRwwRRk..','.kRwwRRRRwwRRRk.','.kRwwRRRRRRRwRk.','.kRRRRRwwRRRRRk.','..kkkkkkkkkkkk..','....kTTTTTTk....','....kTkTTkTk....','....kTTTTTTk....','....kTTkkTTk....','....kTTTTTTk....','.....kkkkkk.....','................','................'],
ghost:['................','.....kkkkkk.....','....kHHHHHHk....','...kHHHHHHHHk...','..kHHkkHHkkHHk..','..kHHkkHHkkHHk..','..kHHHHHHHHHHk..','..kHHHHkkHHHHk..','..kHHHHkkHHHHk..','..kHHHHHHHHHHk..','..kHHHHHHHHHHk..','..kHkHHkHHkHHk..','..kk.kk.kk.kkk..','................','................','................'],
golem:['................','....kkkkkkkk....','...kSSSSSSSSk...','..kSssSSSSssSk..','..kSSkrSSkrSSk..','..kSSSSSSSSSSk..','kkkSSSkkkkSSSkkk','kSSkSSSSSSSSkSSk','kSSkSSsSSsSSkSSk','kkkkSSSSSSSSkkkk','...kSSSkkSSSk...','...kSSk..kSSk...','...kkkk..kkkk...','................','................','................'],
dragon:['................','..k.........k...','..kDk.....kDk...','...kDkkkkkDk....','...kDDDDDDDk....','..kDDrkDDrkDk...','..kDDDDDDDDDk...','.kDkkwkwkwkDDk..','kDDk.kkkkkkDDDk.','kDDDkDDDDDDDDDk.','.kkkDDDDDDDDDk..','...kDDDDDDDDDk..','...kDDkDDDkDDk..','...kDDkkDDkkDk..','...kkk..kkk.kk..','................']
};
const BASE={k:'#1a1c2c',w:'#f4f4f4',r:'#b13e53'};
const EPAL={slime:{B:'#73eff7',b:'#41a6f6'},bat:{V:'#8b5fbf',r:'#ef7d57'},mush:{R:'#b13e53',T:'#f4d6a0'},ghost:{H:'#c0cbdc'},golem:{S:'#8b9bb4',s:'#5a6988',r:'#ef7d57'},dragon:{D:'#8a3f8f',r:'#ffcd75'}};
const LASTROW={};for(const k in SPR){let l=0;SPR[k].forEach((row,i)=>{if(/[^.]/.test(row))l=i});LASTROW[k]=l}

/* ================= kids ================= */
const KIDS={
  milo:{name:'MILO',zh:'洛明',world:'DINO JUNGLE',bg:'jungle',enemyDmg:8,every:3,shield:false,crit:[8,10,12],autoSay:true},
  lucas:{name:'LUCAS',zh:'陸晨',world:'THUNDER PLAINS',bg:'plains',enemyDmg:12,every:2,shield:true,crit:[5,9,15]},
  dad:{name:'DAD',zh:'爸爸',world:'DAD’S ARENA',bg:'night',enemyDmg:12,every:2,shield:true,crit:[4,8,15]},
  nora:{name:'NORA',zh:'幼晴',world:'STAR PEAKS',bg:'night',enemyDmg:14,every:2,shield:true,crit:[4,8,20],noRepeat:true}
};
/* 10 starters. Each evolves at Lv 5 (new colors + horns) and Lv 10 (new colors + wings + crown, bigger). */
const STARTERS={
  dino:{sprite:'dino',type:'FIRE DINO',names:['CHOMPY','CHOMP REX','THUNDER REX'],
    pal:[{G:'#38b764',y:'#ffcd75',r:'#b13e53'},{G:'#257179',y:'#a7f070',r:'#ef7d57'},{G:'#b13e53',y:'#ffcd75',r:'#ffcd75'}],
    moves:['TAIL SWIPE','STOMP','DINO ROAR'],ult:'METEOR STOMP',ultType:'meteor',shot:['#f4f4f4','#ffcd75','#ef7d57','#b13e53']},
  fox:{sprite:'fox',type:'STAR FOX',names:['STARLA','STARFOX','NOVA FOX'],
    pal:[{P:'#b55088',W:'#f4f4f4',S:'#ffcd75'},{P:'#7a3e9d',W:'#f4f4f4',S:'#73eff7'},{P:'#41a6f6',W:'#f4f4f4',S:'#ffcd75'}],
    moves:['STAR DUST','COMET','SUPERNOVA'],ult:'GALAXY BEAM',ultType:'beam',shot:['#f4f4f4','#73eff7','#41a6f6','#b55088']},
  bird:{sprite:'bird',type:'THUNDER BIRD',names:['ZIPZAP','VOLTWING','STORMHAWK'],
    pal:[{Y:'#ffcd75',y:'#f4f4f4',o:'#ef7d57'},{Y:'#41a6f6',y:'#ffcd75',o:'#ffcd75'},{Y:'#333c87',y:'#73eff7',o:'#ffcd75'}],
    moves:['SPARK','THUNDER PECK','STORM DIVE'],ult:'LIGHTNING STORM',ultType:'lightning',shot:['#f4f4f4','#ffcd75','#ffcd75','#73eff7']},
  cat:{sprite:'cat',type:'FLAME CAT',names:['EMBER','BLAZECAT','INFERNO LION'],
    pal:[{O:'#ef7d57',y:'#ffcd75',r:'#b13e53',R:'#ffcd75'},{O:'#b13e53',y:'#ffcd75',r:'#ef7d57',R:'#ef7d57'},{O:'#ffcd75',y:'#f4f4f4',r:'#b13e53',R:'#ef7d57'}],
    moves:['SCRATCH','FLAME CLAW','FIRE ROAR'],ult:'SUN BLAST',ultType:'meteor',shot:['#f4f4f4','#ffcd75','#ef7d57','#b13e53']},
  turtle:{sprite:'turtle',type:'WATER TURTLE',names:['SHELLBY','TIDETANK','TSUNAMI'],
    pal:[{B:'#41a6f6',T:'#38b764',t:'#257179',y:'#ffcd75',r:'#b13e53'},{B:'#3b5dc9',T:'#73eff7',t:'#41a6f6',y:'#f4f4f4',r:'#b13e53'},{B:'#257179',T:'#ffcd75',t:'#ef7d57',y:'#f4f4f4',r:'#b13e53'}],
    moves:['BUBBLE','WATER JET','TIDAL WAVE'],ult:'HYDRO CANNON',ultType:'beam',shot:['#f4f4f4','#73eff7','#41a6f6','#3b5dc9']},
  bunny:{sprite:'bunny',type:'LEAF BUNNY',names:['LEAFHOP','BLOOMBUN','FOREST KING'],
    pal:[{W:'#f4f4f4',L:'#38b764',p:'#ff8fc8'},{W:'#a7f070',L:'#257179',p:'#ff8fc8'},{W:'#ffcd75',L:'#38b764',p:'#ef7d57'}],
    moves:['LEAF TOSS','VINE WHIP','PETAL STORM'],ult:'SOLAR BLOOM',ultType:'beam',shot:['#f4f4f4','#a7f070','#38b764','#ff8fc8']},
  penguin:{sprite:'penguin',type:'ICE PENGUIN',names:['FROSTY','GLACIPEN','BLIZZARD KING'],
    pal:[{N:'#333c87',o:'#ffcd75'},{N:'#41a6f6',o:'#ffcd75'},{N:'#73eff7',o:'#ef7d57'}],
    moves:['SNOWBALL','ICE SLIDE','FROST BEAM'],ult:'BLIZZARD',ultType:'meteor',shot:['#f4f4f4','#73eff7','#41a6f6','#c0cbdc']},
  owl:{sprite:'owl',type:'MOON OWL',names:['HOOTIE','MOONOWL','COSMO OWL'],
    pal:[{U:'#8b5fbf',o:'#ffcd75',y:'#c0cbdc'},{U:'#5d275d',o:'#ffcd75',y:'#73eff7'},{U:'#29366f',o:'#ffcd75',y:'#ffcd75'}],
    moves:['FEATHER','MOON BEAM','STAR SHOWER'],ult:'COSMIC EYE',ultType:'lightning',shot:['#f4f4f4','#c0cbdc','#8b5fbf','#73eff7']},
  wyrm:{sprite:'wyrm',type:'SKY DRAGON',names:['PUFF','WYVERN','SKY DRAGON'],
    pal:[{D:'#41a6f6',y:'#f4f4f4'},{D:'#7a3e9d',y:'#73eff7'},{D:'#ffcd75',y:'#f4f4f4'}],
    moves:['WIND PUFF','DRAGON CLAW','SKY FIRE'],ult:'DRAGON STORM',ultType:'beam',shot:['#f4f4f4','#73eff7','#41a6f6','#3b5dc9']},
  bear:{sprite:'bear',type:'ROCK BEAR',names:['CUBBY','BOULDER BEAR','TITAN BEAR'],
    pal:[{B:'#8b5a2b',b:'#d9a066'},{B:'#5a6988',b:'#c0cbdc'},{B:'#3d2a1c',b:'#ffcd75'}],
    moves:['PAW SWIPE','ROCK THROW','QUAKE'],ult:'EARTHQUAKE',ultType:'meteor',shot:['#f4f4f4','#c0cbdc','#8b9bb4','#5a6988']}
};
const FXMAP={dino:{fx:['shot','slash','roar'],ult:'meteor'},fox:{fx:['shot','multi','stars'],ult:'beam'},bird:{fx:['shot','bolt','multi'],ult:'bolt'},
  cat:{fx:['slash','multi','pillar'],ult:'pillar'},turtle:{fx:['shot','wave','beam'],ult:'wave'},bunny:{fx:['multi','slash','tornado'],ult:'beam'},
  penguin:{fx:['shot','spikes','tornado'],ult:'spikes'},owl:{fx:['shot','stars','beam'],ult:'stars'},wyrm:{fx:['shot','tornado','pillar'],ult:'beam'},bear:{fx:['slash','spikes','meteor'],ult:'spikes'}};
const FX_POOL={dino:['shot','slash','roar','meteor','quake','pillar','bomb','spin','boomerang','multi'],
  fox:['shot','multi','stars','beam','orbit','rainbow','spin','laser','boomerang','shards'],
  bird:['bolt','shot','multi','tornado','laser','spin','orbit','boomerang','shards','stars'],
  cat:['slash','multi','pillar','spin','shot','bomb','roar','orbit','meteor','laser'],
  turtle:['shot','wave','beam','bubbles','spikes','quake','orbit','boomerang','tornado','bomb'],
  bunny:['multi','slash','tornado','vines','rainbow','bubbles','spin','stars','orbit','boomerang'],
  penguin:['shot','spikes','tornado','shards','wave','bubbles','slash','beam','spin','laser'],
  owl:['shot','stars','beam','orbit','laser','rainbow','tornado','multi','bolt','shards'],
  wyrm:['shot','tornado','pillar','beam','meteor','roar','bolt','spin','bomb','rainbow'],
  bear:['slash','spikes','meteor','quake','roar','bomb','spin','shot','boomerang','vines']};
const ZH_NAMES={dino:['咬咬龍','大嘴暴龍','雷霆暴龍'],fox:['星星狐','星光狐','超新星狐'],bird:['閃閃鳥','雷電翼','暴風鷹'],cat:['火花貓','烈焰貓','烈火獅王'],
  turtle:['小殼龜','浪潮龜','海嘯龜王'],bunny:['葉葉兔','花花兔','森林兔王'],penguin:['小冰企鵝','冰川企鵝','暴雪企鵝王'],owl:['呼呼鷹','月光鷹','星空鷹王'],
  wyrm:['噗噗龍','飛龍','天空神龍'],bear:['小熊熊','巨石熊','泰坦熊王']};
for(const k in ZH_NAMES)STARTERS[k].zh=ZH_NAMES[k];
const zhOf=(st,f)=>(st.zh&&st.zh[f])||st.names[f];
const STARTER_ORDER=['dino','fox','bird','cat','turtle','bunny','penguin','owl','wyrm','bear'];
const beastOf=kid=>STARTERS[Save.kid(kid).starter]||null;
const CARD_POW=[12,22,34], SUPER_POW=50, TIER_NAME=['EASY','MEDIUM','HARD'];
const ENEMIES=[{key:'slime',name:'GLOOP',hp:60},{key:'bat',name:'FLAPPER',hp:75},{key:'mush',name:'SPOREY',hp:90},{key:'ghost',name:'BOO-BOO',hp:105},{key:'golem',name:'ROCKO',hp:120},{key:'dragon',name:'KING DRAKO',hp:170,boss:true}];
