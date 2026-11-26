function renderScene(){$('sceneBox').innerHTML=sceneSVG(theme.id);}

/* ---------- 3 more themes (10 total) ---------- */
THEMES.push(
 {id:'snow',en:'Snow Day',zh:'下雪天',zy:'ㄒㄧㄚˋ ㄒㄩㄝˇ ㄊㄧㄢ',col:['white','silver','blue','red'],h:'Warm and cozy in the snow.'},
 {id:'garden',en:'Garden Party',zh:'花園派對',zy:'ㄏㄨㄚ ㄩㄢˊ ㄆㄞˋ ㄉㄨㄟˋ',col:['pink','green','yellow','coral'],h:'Flowers, sunshine and tea.'},
 {id:'sea',en:'Under the Sea',zh:'海底世界',zy:'ㄏㄞˇ ㄉㄧˇ ㄕˋ ㄐㄧㄝˋ',col:['aqua','blue','green','purple'],h:'Splash into the ocean!'});
const MORE={snow:{hair:['pony','braids','onebraid','bun','curly'],top:['sweater','jacket','hoodie','cardigan','puffer','turtleneck','puffvest','sweatshirt','longtee'],bottom:['pants','jeans','leggings','joggers','widepants'],dress:['sweaterdress','longcoat','space'],shoes:['boots','tallboots','snowboots','moonboots','rainboots'],acc:['scarf','beanie','gloves','shawl','glasses']},
 garden:{hair:['long','halfup','wavy','curly','braids','pigtails'],top:['cami','ruffle','puffsleeve','shirt','tank'],bottom:['skirt','floral','maxi','tiered','pleated'],dress:['sun','princess','pinafore','shirtdress','ballet','hanfu'],shoes:['mary','balletflat','sandals','loafers'],acc:['hat','bow','headband','pearls','handbag','necklace','fan']},
 sea:{hair:['wavy','long','sidepony','pigtails','pony'],top:['aloha','stripy','sailor','tank','tee'],bottom:['shorts','floral','capris','skort','denimskirt'],dress:['mermaid','swimsuit','sun','galaxy'],shoes:['flipflops','clogs','sandals','glass'],acc:['swimring','sunglasses','hat','bracelet','necklace','pearls']}};
Object.entries(MORE).forEach(([th,cats])=>Object.entries(cats).forEach(([c,ids])=>ids.forEach(id=>{const it=find(c,id);if(it&&!it.tags.includes(th))it.tags.push(th);})));
/* ---------- round 3: 100 more pieces + 10 more themes (20 total) ---------- */
const BD=(x,y,r)=>'M'+(x-r)+' '+y+'a'+r+' '+r+' 0 1 0 '+(2*r)+' 0a'+r+' '+r+' 0 1 0 '+(-2*r)+' 0Z';
const FR='M84 52Q86 32 100 32Q114 32 116 52Q108 42 100 43Q92 42 84 52Z',SLK='M84 54Q86 32 100 32Q114 32 116 54Q110 40 100 40Q90 40 84 54Z';
const fillL=(d,c,w)=>'<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="'+(w||2)+'" stroke-linecap="round"/>';
add('hair',[
 ['twinbraids','雙麻花辮','ㄕㄨㄤ ㄇㄚˊ ㄏㄨㄚ ㄅㄧㄢˋ','Twin braids','brown',['school','camping','autumn'],{back:c=>[0,1,2,3,4,5,6].map(k=>wc(BD(82,62+k*10,5.5),c)+wc(BD(118,62+k*10,5.5),c)).join(''),front:c=>wc(FR,c)+dot(82,134,2.6,'#e8505b')+dot(118,134,2.6,'#e8505b')}],
 ['balletbun','芭蕾包頭','ㄅㄚ ㄌㄟˇ ㄅㄠ ㄊㄡˊ','Ballet bun','black',['ballet','royal'],{back:c=>wc(BD(100,24,10),c),front:c=>wc(SLK,c)}],
 ['rockspikes','搖滾短髮','ㄧㄠˊ ㄍㄨㄣˇ ㄉㄨㄢˇ ㄈㄚˇ','Rock spiky hair','purple',['concert','halloween'],{back:c=>wc('M80 62L72 42L86 42L82 24L96 32L100 12L106 30L118 22L116 42L130 40L120 62Z',c),front:c=>wc('M84 52L88 36L94 44L100 32L106 44L112 36L116 52Q100 42 84 52Z',c)}],
 ['fairylocks','精靈長髮','ㄐㄧㄥ ㄌㄧㄥˊ ㄔㄤˊ ㄈㄚˇ','Fairy locks','blond',['fairy','garden'],{back:c=>wc('M84 46Q100 22 116 46Q124 90 120 150Q110 140 104 156Q100 140 96 156Q90 140 80 150Q76 90 84 46Z',c),front:c=>wc(FR,c)+dot(86,44,2.6,'#f7a1c4')+dot(91,40,2.2,'#ffd25e')}],
 ['candypigtails','糖果雙馬尾','ㄊㄤˊ ㄍㄨㄛˇ ㄕㄨㄤ ㄇㄚˇ ㄨㄟˇ','Candy pigtails','red',['candy','birthday'],{back:c=>wc(BD(72,72,13),c)+wc(BD(128,72,13),c),front:c=>wc(FR,c)+dot(82,46,3.2,'#74c0fc')+dot(118,46,3.2,'#f7a1c4')}],
 ['sidebraid','側邊辮','ㄘㄜˋ ㄅㄧㄢ ㄅㄧㄢˋ','Side braid','red',['autumn','travel','fairy'],{back:c=>wc('M84 46Q100 24 116 46L118 70L84 70Z',c)+[0,1,2,3,4,5,6].map(k=>wc(BD(113+k*1.4,70+k*10,5.5),c)).join(''),front:c=>wc(FR,c)}],
 ['topknot','頭頂丸子','ㄊㄡˊ ㄉㄧㄥˇ ㄨㄢˊ ˙ㄗ','Top knot','black',['travel','camping','sports'],{back:c=>wc(BD(100,20,9),c),front:c=>wc(SLK,c)}],
 ['longstraight','黑長直','ㄏㄟ ㄔㄤˊ ㄓˊ','Long straight hair','black',['school','concert','royal'],{back:c=>wc('M82 46Q100 22 118 46L120 160L80 160Z',c),front:c=>wc('M84 52Q84 31 100 31Q116 31 116 52L116 47Q100 45 84 47Z',c)}],
 ['curlybob','捲捲短髮','ㄐㄩㄢˇ ㄐㄩㄢˇ ㄉㄨㄢˇ ㄈㄚˇ','Curly bob','brown',['birthday','candy'],{back:c=>wc('M80 74Q72 62 80 52Q78 34 92 30Q100 24 108 30Q122 34 120 52Q128 62 120 74Q112 80 104 76Q100 80 96 76Q88 80 80 74Z',c),front:c=>wc(FR,c)}],
 ['witchlong','魔女長髮','ㄇㄛˊ ㄋㄩˇ ㄔㄤˊ ㄈㄚˇ','Witch long hair','purple',['halloween'],{back:c=>wc('M84 46Q100 22 116 46L124 170L116 160L110 176L100 164L90 176L84 160L76 170Z',c),front:c=>wc(SLK,c)}],
 ['bowpony','蝴蝶結馬尾','ㄏㄨˊ ㄉㄧㄝˊ ㄐㄧㄝˊ ㄇㄚˇ ㄨㄟˇ','Bow ponytail','blond',['birthday','ballet','school'],{back:c=>wc('M106 40Q132 40 126 92Q118 70 106 56Z',c),front:c=>wc(FR,c)+wc('M110 34L100 26L100 40ZM110 34L122 26L122 40Z','#74c0fc')}],
 ['messybun','隨性丸子頭','ㄙㄨㄟˊ ㄒㄧㄥˋ ㄨㄢˊ ˙ㄗ ㄊㄡˊ','Messy bun','brown',['camping','travel','autumn'],{back:c=>wc(BD(102,24,11),c)+line('M92 22q-6-8 0-12M112 20q6-6 2-12',.8),front:c=>wc(FR,c)+line('M86 50q-2 8 1 14M114 50q2 8-1 14',.8)}]]);
add('top',[
 ['uniform','學生制服','ㄒㄩㄝˊ ㄕㄥ ㄓˋ ㄈㄨˊ','School uniform','white',['school'],c=>sleeves('short',c)+wc(torso(154),c)+wc('M97 86L103 86L104 112L100 118L96 112Z','#3a5a99')+line('M88 82L100 90L112 82',.8)],
 ['flannel','法蘭絨襯衫','ㄈㄚˇ ㄌㄢˊ ㄖㄨㄥˊ ㄔㄣˋ ㄕㄢ','Flannel shirt','green',['camping','autumn'],c=>sleeves('long',c)+wc(torso(156),c)+line('M92 82L100 94L108 82M100 96V154',.8),{dp:'plaid'}],
 ['bandtee','樂團T恤','ㄩㄝˋ ㄊㄨㄢˊ T ㄒㄩˋ','Band tee','black',['concert','night'],c=>sleeves('short',c)+wc(torso(152),c)+'<text x="100" y="128" text-anchor="middle" font-size="20" fill="#fff" opacity=".9">★</text>'],
 ['pumpkintop','南瓜上衣','ㄋㄢˊ ㄍㄨㄚ ㄕㄤˋ ㄧ','Pumpkin top','coral',['halloween','autumn'],c=>sleeves('long',c)+wc(torso(152),c)+'<path d="M92 112L96 106L98 114ZM108 112L104 106L102 114ZM90 124Q100 134 110 124L106 128L102 124L98 128L94 124Z" fill="#3a3a44"/>'],
 ['partytop','派對上衣','ㄆㄞˋ ㄉㄨㄟˋ ㄕㄤˋ ㄧ','Party top','gold',['birthday','concert'],c=>sleeves('cap',c)+wc(torso(150),c),{dp:'sparkle'}],
 ['leotard','芭蕾舞衣','ㄅㄚ ㄌㄟˇ ㄨˇ ㄧ','Leotard','pink',['ballet'],c=>sleeves('long',c)+wc(torso(150),c)+line('M90 84Q100 92 110 84',.7)],
 ['wraptop','綁帶上衣','ㄅㄤˇ ㄉㄞˋ ㄕㄤˋ ㄧ','Wrap top','white',['ballet','travel'],c=>sleeves('long',c)+wc(torso(150),c)+line('M84 88L114 134M116 88L102 106',.8)],
 ['leafvest','樹葉背心','ㄕㄨˋ ㄧㄝˋ ㄅㄟˋ ㄒㄧㄣ','Leaf vest','green',['fairy','camping'],c=>sleeves('short','#f4f1ea')+wc(torso(150),'#f4f1ea')+wc('M84 86L116 86L118 150L110 144L104 152L96 144L90 152L82 144Z',c)],
 ['candystripe','糖果條紋衫','ㄊㄤˊ ㄍㄨㄛˇ ㄊㄧㄠˊ ㄨㄣˊ ㄕㄢ','Candy-stripe top','pink',['candy','birthday'],c=>sleeves('short',c)+wc(torso(152),c),{dp:'stripes'}],
 ['linen','亞麻襯衫','ㄧㄚˋ ㄇㄚˊ ㄔㄣˋ ㄕㄢ','Linen shirt','white',['travel','beach'],c=>sleeves('long',c)+wc(torso(156),c)+line('M92 82L100 92L108 82M100 94V154',.8)],
 ['anorak','登山外套','ㄉㄥ ㄕㄢ ㄨㄞˋ ㄊㄠˋ','Hiking jacket','red',['camping','rain','travel'],c=>sleeves('long',c)+wc(torso(160),c)+line('M100 86V160M86 84Q100 72 114 84',.9)],
 ['batshirt','蝙蝠上衣','ㄅㄧㄢ ㄈㄨˊ ㄕㄤˋ ㄧ','Bat shirt','black',['halloween'],c=>sleeves('long',c)+wc(torso(152),c)+'<path d="M86 116Q92 106 100 114Q108 106 114 116L110 120Q104 116 100 122Q96 116 90 120Z" fill="#9b7fd4"/>'],
 ['croptop','短版上衣','ㄉㄨㄢˇ ㄅㄢˇ ㄕㄤˋ ㄧ','Crop top','purple',['concert','beach'],c=>sleeves('short',c)+wc(torso(128),c)],
 ['cablesweater','麻花毛衣','ㄇㄚˊ ㄏㄨㄚ ㄇㄠˊ ㄧ','Cable sweater','brown',['autumn','snow','school'],c=>sleeves('long',c)+wc(torso(156),c)+line('M94 92q4 6 0 12q-4 6 0 12q4 6 0 12q-4 6 0 12M106 92q4 6 0 12q-4 6 0 12q4 6 0 12q-4 6 0 12',.7)],
 ['petaltop','花瓣上衣','ㄏㄨㄚ ㄅㄢˋ ㄕㄤˋ ㄧ','Petal top','aqua',['fairy','garden','candy'],c=>sleeves('puff',c)+wc(torso(144),c)+wc('M82 138Q88 158 94 144Q100 160 106 144Q112 158 118 138Z',c)]]);
add('bottom',[
 ['uniformskirt','制服裙','ㄓˋ ㄈㄨˊ ㄑㄩㄣˊ','Uniform skirt','blue',['school'],c=>wc(skirtP(212,12),c)+line('M92 154L90 210M100 154V212M108 154L110 210',.6),{dp:'plaid'}],
 ['hikingpants','登山褲','ㄉㄥ ㄕㄢ ㄎㄨˋ','Hiking pants','brown',['camping','travel'],c=>wc(pantsP(330,4),c)+line('M86 210h10M104 210h10',.8)],
 ['leatherpants','皮褲','ㄆㄧˊ ㄎㄨˋ','Leather pants','black',['concert','halloween'],c=>wc(pantsP(334,0),c)],
 ['balletskirt','芭蕾紗裙','ㄅㄚ ㄌㄟˇ ㄕㄚ ㄑㄩㄣˊ','Ballet skirt','pink',['ballet'],c=>wc(skirtP(192,32),c)+line('M80 186Q100 192 120 186',.6)],
 ['leafskirt','樹葉裙','ㄕㄨˋ ㄧㄝˋ ㄑㄩㄣˊ','Leaf skirt','green',['fairy','autumn'],c=>wc('M84 150Q100 154 116 150L124 202L116 194L110 208L100 196L90 208L84 194L76 202Z',c)],
 ['candyskirt','棒棒糖裙','ㄅㄤˋ ㄅㄤˋ ㄊㄤˊ ㄑㄩㄣˊ','Lollipop skirt','pink',['candy','birthday'],c=>wc(skirtP(200,22),c),{dp:'dots'}],
 ['corduroy','燈芯絨褲','ㄉㄥ ㄒㄧㄣ ㄖㄨㄥˊ ㄎㄨˋ','Corduroy pants','coral',['autumn','school'],c=>wc(pantsP(332,2),c),{dp:'stripes'}],
 ['casualshorts','休閒短褲','ㄒㄧㄡ ㄒㄧㄢˊ ㄉㄨㄢˇ ㄎㄨˋ','Casual shorts','denim',['travel','camping','beach'],c=>wc(pantsP(196,3),c)],
 ['pumpkinskirt','南瓜裙','ㄋㄢˊ ㄍㄨㄚ ㄑㄩㄣˊ','Pumpkin skirt','coral',['halloween','autumn'],c=>wc('M84 150Q100 154 116 150Q136 170 126 198Q100 208 74 198Q64 170 84 150Z',c)+line('M92 154Q86 176 90 202M108 154Q114 176 110 202M100 154V206',.7)],
 ['sparkleleggings','亮片內搭褲','ㄌㄧㄤˋ ㄆㄧㄢˋ ㄋㄟˋ ㄉㄚ ㄎㄨˋ','Sparkle leggings','silver',['concert','birthday'],c=>wc(pantsP(338,-2),c),{dp:'sparkle'}],
 ['puffyskirt','蓬蓬裙','ㄆㄥˊ ㄆㄥˊ ㄑㄩㄣˊ','Puffy skirt','purple',['birthday','candy','ballet'],c=>wc(skirtP(198,34),c)],
 ['culottes','寬褲裙','ㄎㄨㄢ ㄎㄨˋ ㄑㄩㄣˊ','Culottes','yellow',['travel','school'],c=>wc(pantsP(240,10),c)],
 ['pleatlong','百褶長裙','ㄅㄞˇ ㄓㄜˇ ㄔㄤˊ ㄑㄩㄣˊ','Long pleated skirt','brown',['autumn','school','travel'],c=>wc(skirtP(318,16),c)+line('M90 156L84 316M100 156V320M110 156L116 316',.6)],
 ['mushroomshorts','蘑菇短褲','ㄇㄛˊ ㄍㄨ ㄉㄨㄢˇ ㄎㄨˋ','Mushroom shorts','red',['fairy','candy'],c=>wc(pantsP(192,6),c),{dp:'dots'}],
 ['cargoshorts','工作短褲','ㄍㄨㄥ ㄗㄨㄛˋ ㄉㄨㄢˇ ㄎㄨˋ','Cargo shorts','green',['camping','travel'],c=>wc(pantsP(204,4),c)+wc('M82 176L92 176L92 190L82 190Z',c)+wc('M108 176L118 176L118 190L108 190Z',c)]]);
const ghostD='M90 80Q100 70 110 80Q138 120 134 222L124 212L114 224L104 212L94 224L84 212L66 222Q62 120 90 80Z';
add('dress',[
 ['witch','女巫裝','ㄋㄩˇ ㄨ ㄓㄨㄤ','Witch dress','black',['halloween'],c=>sleeves('wide',c)+wc(dressP(330,30,true),c)+line('M84 150Q100 156 116 150',1.6).replace(INK,'#9b7fd4')],
 ['pumpkin','南瓜裝','ㄋㄢˊ ㄍㄨㄚ ㄓㄨㄤ','Pumpkin costume','coral',['halloween','autumn'],c=>sleeves('short','#7cc47f')+wc('M86 86L114 86Q150 120 140 184Q100 204 60 184Q50 120 86 86Z',c)+line('M86 92Q76 140 84 192M114 92Q124 140 116 192M100 88V198',.7)+'<path d="M90 130L96 122L98 132ZM110 130L104 122L102 132ZM88 146Q100 158 112 146L108 150L104 146L100 152L96 146L92 150Z" fill="#3a3a44"/>'],
 ['ghost','小幽靈裝','ㄒㄧㄠˇ ㄧㄡ ㄌㄧㄥˊ ㄓㄨㄤ','Ghost costume','white',['halloween'],c=>wc(ghostD,c)+'<ellipse cx="93" cy="120" rx="3.5" ry="5" fill="#3a3a44"/><ellipse cx="107" cy="120" rx="3.5" ry="5" fill="#3a3a44"/><ellipse cx="100" cy="136" rx="4" ry="3" fill="#3a3a44"/>'],
 ['bat','蝙蝠裝','ㄅㄧㄢ ㄈㄨˊ ㄓㄨㄤ','Bat costume','purple',['halloween','night'],{back:c=>'<path d="M90 96Q60 80 40 100Q50 104 48 114Q60 108 64 118Q74 108 90 118ZM110 96Q140 80 160 100Q150 104 152 114Q140 108 136 118Q126 108 110 118Z" fill="#3a3a44" stroke="'+INK+'" stroke-width="1"/>',main:c=>sleeves('long',c)+wc(dressP(214,18,true),c)}],
 ['tutudress','芭蕾舞裙','ㄅㄚ ㄌㄟˇ ㄨˇ ㄑㄩㄣˊ','Tutu dress','pink',['ballet','birthday'],c=>line(strap,.8)+wc('M86 88L114 88L117 150L83 150Z',c)+wc('M68 150Q100 140 132 150L142 176Q100 188 58 176Z',c)+line('M64 166Q100 176 136 166',.6)],
 ['swan','天鵝舞衣','ㄊㄧㄢ ㄜˊ ㄨˇ ㄧ','Swan costume','white',['ballet','royal'],{back:c=>'<path d="M92 100Q60 76 48 104Q62 118 92 116ZM108 100Q140 76 152 104Q138 118 108 116Z" fill="#fff" opacity=".9" stroke="'+INK+'" stroke-width="1"/>',main:c=>line(strap,.8)+wc('M86 88L114 88L117 150L83 150Z',c)+wc('M66 150Q100 140 134 150L144 174Q100 186 56 174Z',c)},{dp:'sparkle'}],
 ['birthdaydress','生日洋裝','ㄕㄥ ㄖˋ ㄧㄤˊ ㄓㄨㄤ','Birthday dress','purple',['birthday'],c=>sleeves('puff',c)+wc(dressP(222,26,true),c),{dp:'stars'}],
 ['cupcake','杯子蛋糕裙','ㄅㄟ ˙ㄗ ㄉㄢˋ ㄍㄠ ㄑㄩㄣˊ','Cupcake dress','pink',['candy','birthday'],c=>line(strap,.8)+wc('M86 88L114 88L117 150L83 150Z','#f4f1ea')+wc('M80 150L120 150L128 214Q100 220 72 214Z',c)+line('M88 152L84 214M96 152L94 216M104 152L106 216M112 152L116 214',.6)+wc('M82 152Q88 138 96 148Q102 136 108 148Q114 138 118 152Z','#fff')+dot(100,96,3.2,'#e8505b')],
 ['lollipopdress','棒棒糖洋裝','ㄅㄤˋ ㄅㄤˋ ㄊㄤˊ ㄧㄤˊ ㄓㄨㄤ','Lollipop dress','aqua',['candy'],c=>sleeves('short',c)+wc(dressP(214,20,true),c),{dp:'zigzag'}],
 ['candyprincess','糖果公主裙','ㄊㄤˊ ㄍㄨㄛˇ ㄍㄨㄥ ㄓㄨˇ ㄑㄩㄣˊ','Candy princess dress','yellow',['candy','royal'],c=>sleeves('puff',c)+wc(dressP(340,46,true),c),{dp:'dots'}],
 ['leaffairy','葉子精靈裝','ㄧㄝˋ ˙ㄗ ㄐㄧㄥ ㄌㄧㄥˊ ㄓㄨㄤ','Leaf fairy dress','green',['fairy','garden'],{back:c=>'<path d="M94 100Q62 60 50 94Q60 116 94 118ZM106 100Q138 60 150 94Q140 116 106 118Z" fill="#c3fae8" opacity=".85" stroke="'+INK+'" stroke-width="1"/>',main:c=>line(strap,.8)+wc('M86 88L114 88L117 150L128 196L118 190L112 210L100 196L88 210L82 190L72 196L83 150Z',c)}],
 ['mushroomdress','蘑菇洋裝','ㄇㄛˊ ㄍㄨ ㄧㄤˊ ㄓㄨㄤ','Mushroom dress','red',['fairy','candy'],c=>sleeves('puff','#f4f1ea')+wc(dressP(214,30,true),c),{dp:'dots'}],
 ['forestgown','森林長禮服','ㄙㄣ ㄌㄧㄣˊ ㄔㄤˊ ㄌㄧˇ ㄈㄨˊ','Forest gown','green',['fairy','royal'],c=>sleeves('long',c)+wc(dressP(350,38,true),c)+fillL('M92 100Q84 160 96 220Q108 280 92 340','#2f9e44',1.4)],
 ['stagedress','舞台亮片裝','ㄨˇ ㄊㄞˊ ㄌㄧㄤˋ ㄆㄧㄢˋ ㄓㄨㄤ','Stage sequin dress','silver',['concert','birthday'],c=>line(strap,.8)+wc(dressP(212,10,false),c),{dp:'sparkle'}],
 ['rockdress','搖滾洋裝','ㄧㄠˊ ㄍㄨㄣˇ ㄧㄤˊ ㄓㄨㄤ','Rock dress','black',['concert','halloween'],c=>sleeves('short',c)+wc(dressP(208,14,true),c)+line('M84 148Q100 152 116 148',1.8),{dp:'stars'}],
 ['uniformdress','制服洋裝','ㄓˋ ㄈㄨˊ ㄧㄤˊ ㄓㄨㄤ','Uniform dress','blue',['school'],c=>sleeves('short',c)+wc(dressP(220,16,true),c)+wc('M88 82L100 94L112 82L110 80L100 88L90 80Z','#fff'),{dp:'plaid'}],
 ['smock','圍裙洋裝','ㄨㄟˊ ㄑㄩㄣˊ ㄧㄤˊ ㄓㄨㄤ','Smock dress','yellow',['school','autumn','garden'],c=>sleeves('puff',c)+wc(dressP(220,22,true),c)+wc('M90 150L110 150L110 170L90 170Z','#fff')],
 ['knitdress','秋天針織裙','ㄑㄧㄡ ㄊㄧㄢ ㄓㄣ ㄓ ㄑㄩㄣˊ','Autumn knit dress','brown',['autumn','snow'],c=>sleeves('long',c)+wc(dressP(230,12,true),c)+line('M96 96q4 8 0 16q-4 8 0 16q4 8 0 16M104 96q4 8 0 16q-4 8 0 16q4 8 0 16',.7)],
 ['picnicdress','野餐格子裙','ㄧㄝˇ ㄘㄢ ㄍㄜˊ ˙ㄗ ㄑㄩㄣˊ','Picnic gingham dress','red',['autumn','garden','camping'],c=>sleeves('puff',c)+wc(dressP(224,22,true),c),{dp:'checks'}],
 ['travelsuit','旅行連身褲','ㄌㄩˇ ㄒㄧㄥˊ ㄌㄧㄢˊ ㄕㄣ ㄎㄨˋ','Travel jumpsuit','denim',['travel','camping'],c=>sleeves('short',c)+wc(torso(152),c)+wc(pantsP(334,4),c)+line('M84 150Q100 154 116 150',1.6)],
 ['trenchdress','風衣洋裝','ㄈㄥ ㄧ ㄧㄤˊ ㄓㄨㄤ','Trench dress','brown',['travel','rain','autumn'],c=>sleeves('long',c)+wc(dressP(232,14,true),c)+line('M84 146Q100 150 116 146',1.8)+dot(94,110,1.6,'#3a3a44')+dot(106,110,1.6,'#3a3a44')+dot(94,126,1.6,'#3a3a44')+dot(106,126,1.6,'#3a3a44')],
 ['safari','探險洋裝','ㄊㄢˋ ㄒㄧㄢˇ ㄧㄤˊ ㄓㄨㄤ','Safari dress','green',['camping','travel'],c=>sleeves('short',c)+wc(dressP(218,14,true),c)+wc('M88 104L98 104L98 116L88 116Z',c)+wc('M102 104L112 104L112 116L102 116Z',c)+line('M84 148Q100 152 116 148',1.6)]]);
add('shoes',[
 ['schoolshoes','學生皮鞋','ㄒㄩㄝˊ ㄕㄥ ㄆㄧˊ ㄒㄧㄝˊ','School shoes','black',['school'],c=>pair(wc('M82 354Q84 348 92 350L99 352L100 368L80 368Z',c)+line('M84 358h12',.6).replace(INK,'#fff'))],
 ['hikingboots','登山靴','ㄉㄥ ㄕㄢ ㄒㄩㄝ','Hiking boots','brown',['camping','travel'],c=>pair(wc('M84 330L98 330L99 358L102 368L80 368L82 350Z',c)+line('M86 336h10M86 342h10M86 348h10',.7).replace(INK,'#ffd25e'))],
 ['pointe','芭蕾足尖鞋','ㄅㄚ ㄌㄟˇ ㄗㄨˊ ㄐㄧㄢ ㄒㄧㄝˊ','Pointe shoes','pink',['ballet'],c=>pair(wc('M86 350L96 350L94 370L88 370Z',c)+fillL('M86 350L96 332M96 350L86 332',c,1.6))],
 ['platform','厚底靴','ㄏㄡˋ ㄉㄧˇ ㄒㄩㄝ','Platform boots','black',['concert','halloween'],c=>pair(wc('M84 328L98 328L100 360L80 360Z',c)+wc('M78 360L102 360L102 372L78 372Z','#3a3a44'))],
 ['pointyshoes','尖頭鞋','ㄐㄧㄢ ㄊㄡˊ ㄒㄧㄝˊ','Pointy shoes','purple',['halloween','fairy'],c=>pair(wc('M84 354L98 352L100 366L72 368Q78 362 84 354Z',c))],
 ['candyshoes','糖果鞋','ㄊㄤˊ ㄍㄨㄛˇ ㄒㄧㄝˊ','Candy shoes','pink',['candy','birthday'],c=>pair(wc('M84 352L98 352L100 368L80 368Z',c)+line('M86 354L84 366M92 354L90 366M98 356L96 366',1.2).replace(INK,'#fff'))],
 ['partyheels','派對低跟鞋','ㄆㄞˋ ㄉㄨㄟˋ ㄉㄧ ㄍㄣ ㄒㄧㄝˊ','Party heels','gold',['birthday','concert','royal'],c=>pair(wc('M84 352L98 352L100 364L80 366Z',c)+line('M96 364L97 372',1.8))],
 ['leafshoes','樹葉鞋','ㄕㄨˋ ㄧㄝˋ ㄒㄧㄝˊ','Leaf shoes','green',['fairy'],c=>pair(wc('M84 352L98 352L102 368L76 368Q74 362 84 352Z',c)+line('M78 366L100 356',.6))],
 ['ankleboots','短靴','ㄉㄨㄢˇ ㄒㄩㄝ','Ankle boots','brown',['autumn','travel','school'],c=>pair(wc('M84 340L98 340L100 368L80 368Z',c))],
 ['slipons','懶人鞋','ㄌㄢˇ ㄖㄣˊ ㄒㄧㄝˊ','Slip-ons','white',['travel','school'],c=>pair(wc('M82 356Q90 350 98 354L100 368L80 368Z',c)+line('M80 365h20',1).replace(INK,'#3a3a44'))],
 ['glittersneakers','亮片球鞋','ㄌㄧㄤˋ ㄆㄧㄢˋ ㄑㄧㄡˊ ㄒㄧㄝˊ','Glitter sneakers','silver',['concert','birthday','candy'],c=>pair(wc('M84 348L98 348L100 368L80 368Z',c)+line('M80 365h20',1.4).replace(INK,'#fff')),{dp:'sparkle'}],
 ['sportsandals','運動涼鞋','ㄩㄣˋ ㄉㄨㄥˋ ㄌㄧㄤˊ ㄒㄧㄝˊ','Sport sandals','blue',['camping','beach','travel'],c=>pair(wc('M80 364L100 364L100 370L80 370Z','#3a3a44')+fillL('M84 356L98 362M84 362L98 352',c,3))],
 ['mushroomboots','蘑菇靴','ㄇㄛˊ ㄍㄨ ㄒㄩㄝ','Mushroom boots','red',['fairy','candy','rain'],c=>pair(wc('M84 332L98 332L100 368L80 368Z',c)+dot(88,342,2,'#fff')+dot(94,354,2,'#fff'))],
 ['balletslippers','芭蕾軟鞋','ㄅㄚ ㄌㄟˇ ㄖㄨㄢˇ ㄒㄧㄝˊ','Ballet slippers','white',['ballet','school'],c=>pair(wc('M84 356Q91 350 98 356L99 368L81 368Z',c)+line('M85 358L97 358',.8).replace(INK,'#74c0fc'))]]);
add('acc',[
 A('schoolbag','書包','ㄕㄨ ㄅㄠ','School bag','red',['school','travel'],'back',c=>wc('M68 96Q68 86 80 86L120 86Q132 86 132 96L132 160L68 160Z',c),'60 80 80 90'),
 A('pencil','鉛筆','ㄑㄧㄢ ㄅㄧˇ','Pencil','yellow',['school'],'held',c=>'<g transform="rotate(-20 132 190)">'+wc('M128 160L136 160L136 214L132 222L128 214Z',c)+wc('M128 156L136 156L136 162L128 162Z','#74c0fc')+'</g>','116 148 34 80'),
 A('book','故事書','ㄍㄨˋ ㄕˋ ㄕㄨ','Storybook','blue',['school','travel'],'held',c=>wc('M120 186L146 180L148 214L122 220Z',c)+line('M134 183L135 217',.8),'116 174 36 50'),
 A('flashlight','手電筒','ㄕㄡˇ ㄉㄧㄢˋ ㄊㄨㄥˇ','Flashlight','yellow',['camping'],'held',c=>'<path d="M126 186L116 158L148 158L138 186Z" fill="#fff6b0" opacity=".6"/>'+wc('M126 186L138 186L136 214L128 214Z',c),'112 154 40 64'),
 A('marshmallow','烤棉花糖','ㄎㄠˇ ㄇㄧㄢˊ ㄏㄨㄚ ㄊㄤˊ','Toasted marshmallow','white',['camping','candy'],'held',c=>line('M130 220L146 154',1.4)+'<rect x="141" y="142" width="11" height="13" rx="3" fill="'+c+'" stroke="'+INK+'" stroke-width=".8"/><rect x="141" y="150" width="11" height="5" rx="2" fill="#c98b4a" opacity=".7"/>','124 136 34 90'),
 A('partyhat','派對帽','ㄆㄞˋ ㄉㄨㄟˋ ㄇㄠˋ','Party hat','purple',['birthday'],'top',c=>wc('M90 36L100 6L110 36Z',c)+dot(100,6,3,'#ffd25e')+dot(97,22,1.6,'#ffd25e')+dot(104,28,1.6,'#74c0fc'),'86 0 28 40'),
 A('gift','禮物','ㄌㄧˇ ㄨˋ','Gift box','pink',['birthday'],'held',c=>wc('M120 196L146 196L146 222L120 222Z',c)+fillL('M133 196V222M120 209H146','#ffd25e',2)+wc('M133 196L124 188L126 196ZM133 196L142 188L140 196Z','#ffd25e'),'116 184 34 42'),
 A('cupcakeheld','杯子蛋糕','ㄅㄟ ˙ㄗ ㄉㄢˋ ㄍㄠ','Cupcake','pink',['birthday','candy'],'held',c=>wc('M124 206L142 206L139 222L127 222Z','#d9a520')+wc('M122 206Q122 192 133 192Q144 192 144 206Z',c)+dot(133,190,2.5,'#e8505b'),'118 184 30 42'),
 A('witchhat','女巫帽','ㄋㄩˇ ㄨ ㄇㄠˋ','Witch hat','black',['halloween'],'top',c=>wc('M88 40L104 2L112 38Z',c)+wc('M74 42Q100 34 126 42L122 47Q100 40 78 47Z',c)+fillL('M90 38Q100 35 110 38','#9b7fd4',3),'70 0 60 50'),
 A('pumpkinbasket','南瓜提籃','ㄋㄢˊ ㄍㄨㄚ ㄊㄧˊ ㄌㄢˊ','Pumpkin basket','coral',['halloween','autumn'],'held',c=>line('M122 192Q133 168 144 192',1.2)+wc('M120 198Q120 188 133 188Q146 188 146 198Q148 216 133 218Q118 216 120 198Z',c)+'<path d="M127 198L130 194L131 200ZM139 198L136 194L135 200ZM127 206Q133 212 139 206Z" fill="#3a3a44"/>','114 164 38 58'),
 A('mic','麥克風','ㄇㄞˋ ㄎㄜˋ ㄈㄥ','Microphone','silver',['concert'],'held',c=>wc('M130 196L134 196L133 222L131 222Z','#3a3a44')+dot(132,191,5.5,c),'122 182 20 44'),
 A('guitar','吉他','ㄐㄧˊ ㄊㄚ','Guitar','red',['concert','camping'],'held',c=>wc('M132 196L137 196L141 146L137 146Z','#a0704f')+wc(BD(134,200,10),c)+wc(BD(138,217,12),c)+dot(137,210,3,'#3a3a44'),'118 140 40 92'),
 A('glowstick','螢光棒','ㄧㄥˊ ㄍㄨㄤ ㄅㄤˋ','Glow stick','aqua',['concert','night','halloween'],'held',c=>'<rect x="126" y="156" width="14" height="46" rx="7" fill="'+c+'" opacity=".3"/><rect x="130" y="158" width="6" height="42" rx="3" fill="'+c+'" stroke="'+INK+'" stroke-width=".8"/>','120 150 26 58'),
 A('leafcrown','樹葉頭冠','ㄕㄨˋ ㄧㄝˋ ㄊㄡˊ ㄍㄨㄢ','Leaf crown','green',['fairy','autumn'],'head',c=>[84,90,96,102,108,114].map((x,i)=>'<ellipse cx="'+x+'" cy="'+(36+Math.abs(x-99)*.25)+'" rx="5" ry="2.6" transform="rotate('+(i%2?30:-30)+' '+x+' '+(36+Math.abs(x-99)*.25)+')" fill="'+(i%3===1?'#e8793a':c)+'" stroke="'+INK+'" stroke-width=".6"/>').join(''),'76 26 48 22'),
 A('fairywings','精靈翅膀','ㄐㄧㄥ ㄌㄧㄥˊ ㄔˋ ㄅㄤˇ','Fairy wings','aqua',['fairy','garden'],'back',c=>'<path d="M92 100Q60 50 44 80Q50 112 92 116ZM108 100Q140 50 156 80Q150 112 108 116ZM92 116Q64 130 66 154Q84 152 94 122ZM108 116Q136 130 134 154Q116 152 106 122Z" fill="'+c+'" opacity=".55" stroke="'+INK+'" stroke-width="1"/>','40 46 120 112'),
 A('tiara','小皇冠','ㄒㄧㄠˇ ㄏㄨㄤˊ ㄍㄨㄢ','Tiara','silver',['ballet','royal','birthday'],'head',c=>'<path d="M88 40L92 30L96 36L100 26L104 36L108 30L112 40Q100 37 88 40Z" fill="'+c+'" stroke="'+INK+'" stroke-width=".8"/>'+dot(100,30,1.8,'#74c0fc'),'84 22 32 22'),
 A('rose','玫瑰花','ㄇㄟˊ ㄍㄨㄟ ㄏㄨㄚ','Rose','red',['ballet','garden'],'held',c=>fillL('M132 222L134 186','#2f9e44',1.6)+wc('M128 188Q127 176 134 176Q141 176 140 188Q134 194 128 188Z',c)+'<path d="M133 204q-8-6-8 2q6 2 8-2z" fill="#7cc47f" stroke="'+INK+'" stroke-width=".6"/>','120 170 26 56'),
 A('suitcase','行李箱','ㄒㄧㄥˊ ㄌㄧˇ ㄒㄧㄤ','Suitcase','blue',['travel'],'held',c=>line('M130 206V196H142V206',1.4)+wc('M122 206L150 206L150 240L122 240Z',c)+dot(126,242,2,'#3a3a44')+dot(146,242,2,'#3a3a44'),'118 192 36 54'),
 A('map','地圖','ㄉㄧˋ ㄊㄨˊ','Map','yellow',['travel','camping'],'held',c=>wc('M118 190L130 186L140 190L150 186L150 214L140 218L130 214L118 218Z',c)+line('M130 186V214M140 190V218',.7)+fillL('M142 198l4 4M146 198l-4 4','#e8505b',1.4),'114 182 40 40'),
 A('neckpillow','頸枕','ㄐㄧㄥˇ ㄓㄣˇ','Neck pillow','purple',['travel'],'neck',c=>wc('M78 78Q78 98 100 98Q122 98 122 78L114 78Q114 90 100 90Q86 90 86 78Z',c),'74 72 52 30'),
 A('biglolli','大棒棒糖','ㄉㄚˋ ㄅㄤˋ ㄅㄤˋ ㄊㄤˊ','Big lollipop','pink',['candy','birthday'],'held',c=>fillL('M132 224L134 180','#fff',2.4)+line('M132 224L134 180',.5)+dot(134,168,13,c)+fillL('M134 168m-8 0a8 8 0 1 0 16 0a5 5 0 1 0 -10 0','#fff',2),'118 152 32 76'),
 A('autumnscarf','秋天圍巾','ㄑㄧㄡ ㄊㄧㄢ ㄨㄟˊ ㄐㄧㄣ','Autumn scarf','coral',['autumn','school'],'neck',c=>wc('M82 82Q100 96 118 82L120 92Q100 104 80 92Z',c)+wc('M106 94L114 132L104 134L100 98Z',c)+line('M84 88Q100 98 116 88M106 112l8-1M107 122l8-1',.6),'76 76 48 62')]);
LONGD.push('witch','candyprincess','forestgown','pleatlong','ghost');

THEMES.push(
 {id:'school',en:'School Day',zh:'上學日',zy:'ㄕㄤˋ ㄒㄩㄝˊ ㄖˋ',col:['blue','white','yellow','black']},
 {id:'camping',en:'Camping',zh:'露營',zy:'ㄌㄨˋ ㄧㄥˊ',col:['green','brown','yellow','red']},
 {id:'birthday',en:'Birthday Party',zh:'生日派對',zy:'ㄕㄥ ㄖˋ ㄆㄞˋ ㄉㄨㄟˋ',col:['pink','purple','yellow','gold']},
 {id:'halloween',en:'Halloween',zh:'萬聖節',zy:'ㄨㄢˋ ㄕㄥˋ ㄐㄧㄝˊ',col:['black','purple','coral']},
 {id:'concert',en:'Concert',zh:'演唱會',zy:'ㄧㄢˇ ㄔㄤˋ ㄏㄨㄟˋ',col:['black','silver','pink','purple']},
 {id:'autumn',en:'Autumn Picnic',zh:'秋天野餐',zy:'ㄑㄧㄡ ㄊㄧㄢ ㄧㄝˇ ㄘㄢ',col:['brown','coral','yellow','red']},
 {id:'ballet',en:'Ballet Show',zh:'芭蕾舞台',zy:'ㄅㄚ ㄌㄟˇ ㄨˇ ㄊㄞˊ',col:['pink','white','silver']},
 {id:'fairy',en:'Fairy Forest',zh:'森林精靈',zy:'ㄙㄣ ㄌㄧㄣˊ ㄐㄧㄥ ㄌㄧㄥˊ',col:['green','aqua','gold']},
 {id:'travel',en:'Trip Abroad',zh:'出國旅行',zy:'ㄔㄨ ㄍㄨㄛˊ ㄌㄩˇ ㄒㄧㄥˊ',col:['blue','white','denim','red']},
 {id:'candy',en:'Candy Kingdom',zh:'糖果王國',zy:'ㄊㄤˊ ㄍㄨㄛˇ ㄨㄤˊ ㄍㄨㄛˊ',col:['pink','aqua','yellow','purple']});
