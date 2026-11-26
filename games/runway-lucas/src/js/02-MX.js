/* ---------- 100 more pieces ---------- */
const MX=d=>d.replace(/(-?[\d.]+) (-?[\d.]+)/g,(m,x,y)=>(200-+x)+' '+y);
const SL={short:'M78 85L66 104L76 109L82 98Z',long:'M78 85L64 140L62 196L72 196L76 142L82 100Z',puff:'M80 84Q60 84 65 101Q73 109 82 100Z',wide:'M78 85L56 150L50 202L74 198L80 140Z',cap:'M79 84Q68 88 72 98L82 96Z',ruffle:'M79 84Q64 90 70 102Q74 98 78 104Q80 98 83 100Z',cuff:'M78 85L64 140L62 190L74 190L76 142L82 100Z'};
const sleeves=(t,c)=>wc(SL[t],c)+wc(MX(SL[t]),c);
const torso=h=>{const w=Math.max(0,(h-150)*.12);return 'M78 84Q100 78 122 84L118 100L'+(117+w)+' '+h+'Q100 '+(h+4)+' '+(83-w)+' '+h+'L82 100Z';};
const dressP=(len,fl,sh)=>(sh?'M78 84Q100 78 122 84L118 100':'M86 86L114 86')+'L117 150L'+(116+fl)+' '+len+'Q100 '+(len+8)+' '+(84-fl)+' '+len+'L83 150'+(sh?'L82 100':'')+'Z';
const skirtP=(len,fl)=>'M84 150Q100 154 116 150L'+(116+fl)+' '+len+'Q100 '+(len+8)+' '+(84-fl)+' '+len+'Z';
const pantsP=(cuff,wd)=>cuff<260?'M83 150Q100 154 117 150L'+(118+wd)+' '+cuff+'L102 '+(cuff+2)+'L100 182L98 '+(cuff+2)+'L'+(82-wd)+' '+cuff+'Z':
  'M83 150Q100 154 117 150L117 268L'+(114+wd)+' '+cuff+'L'+(103-wd*.3)+' '+cuff+'L102 270L100 186L98 270L'+(97+wd*.3)+' '+cuff+'L'+(86-wd)+' '+cuff+'L83 268Z';
const pair=f=>f+'<g transform="translate(16 0)">'+f+'</g>';
const dot=(x,y,r,c)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" stroke="'+INK+'" stroke-width=".7"/>';
const strap='M88 86L90 76M112 86L110 76';
function add(cat,list){list.forEach(x=>{const it=I(...x);Object.assign(it,x.o||x[7]||{});CAT[cat].items.push(it);});}
const P=(id,zh,zy,en,col,tags,draw,o)=>{const it=[id,zh,zy,en,col,tags,draw];it.o=o;return it;};
add('hair',[
 ['pigtails','雙馬尾','ㄕㄨㄤ ㄇㄚˇ ㄨㄟˇ','Pigtails','brown',['night','sports','beach'],{back:c=>wc('M84 44Q60 50 64 96Q72 76 86 56Z',c)+wc(MX('M84 44Q60 50 64 96Q72 76 86 56Z'),c),front:c=>wc('M84 52Q86 31 100 32Q114 31 116 52Q108 40 100 42Q92 40 84 52Z',c)+dot(85,46,2.5,'#74c0fc')+dot(115,46,2.5,'#74c0fc')}],
 ['curly','捲髮','ㄐㄩㄢˇ ㄈㄚˇ','Curly hair','brown',['royal','night'],{back:c=>wc('M80 60Q70 40 86 30Q96 18 110 26Q128 30 122 50Q132 66 120 84Q112 92 100 86Q86 92 78 82Q70 72 80 60Z',c),front:c=>wc('M84 52Q84 36 94 34Q100 30 106 34Q116 36 116 52Q110 44 104 46Q98 40 92 46Q88 44 84 52Z',c)}],
 ['highpony','高馬尾','ㄍㄠ ㄇㄚˇ ㄨㄟˇ','High ponytail','black',['sports','night'],{back:c=>wc('M98 26Q120 6 130 30Q136 56 124 76Q122 50 104 32Z',c),front:c=>wc('M84 52Q86 30 100 30Q114 30 116 52Q110 40 100 40Q90 40 84 52Z',c)+dot(101,29,3,'#ff6b6b')}],
 ['spacebuns','雙丸子頭','ㄕㄨㄤ ㄨㄢˊ ˙ㄗ ㄊㄡˊ','Space buns','black',['space','night'],{back:c=>wc('M78 32a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z',c)+wc('M104 32a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z',c),front:c=>wc('M84 52Q86 33 100 33Q114 33 116 52Q108 42 100 43Q92 42 84 52Z',c)}],
 ['halfup','公主頭','ㄍㄨㄥ ㄓㄨˇ ㄊㄡˊ','Half-up','blond',['royal'],{back:c=>wc('M84 46Q100 22 116 46L122 118Q100 126 78 118Z',c),front:c=>wc('M84 54Q85 31 100 32Q115 31 116 54Q108 42 100 43Q92 42 84 54Z',c)+'<path d="M96 34q4-6 8 0q-4 3-8 0z" fill="#74c0fc" stroke="'+INK+'" stroke-width=".6"/>'}],
 ['wavy','波浪長髮','ㄅㄛ ㄌㄤˋ ㄔㄤˊ ㄈㄚˇ','Wavy long hair','red',['beach','royal'],{back:c=>wc('M84 46Q100 22 116 46Q126 66 118 84Q128 102 120 124Q100 130 80 124Q72 102 82 84Q74 66 84 46Z',c),front:c=>wc('M84 54Q85 31 100 32Q115 31 116 54Q112 42 102 42Q92 44 84 54Z',c)}],
 ['bangs','齊瀏海','ㄑㄧˊ ㄌㄧㄡˊ ㄏㄞˇ','Bangs bob','black',['night','newyear'],{back:c=>wc('M82 72L82 50Q84 30 100 31Q116 30 118 50L118 72Q110 70 108 62L92 62Q90 70 82 72Z',c),front:c=>wc('M84 48Q86 32 100 32Q114 32 116 48L84 48Z',c)}],
 ['sidepony','側馬尾','ㄘㄜˋ ㄇㄚˇ ㄨㄟˇ','Side ponytail','blond',['beach','night'],{back:c=>wc('M114 44Q134 52 128 104Q120 84 112 60Z',c),front:c=>wc('M84 52Q86 31 100 32Q114 31 116 50Q106 40 98 42Q90 42 84 52Z',c)+dot(116,46,3,'#ffd43b')}],
 ['onebraid','麻花辮','ㄇㄚˊ ㄏㄨㄚ ㄅㄧㄢˋ','Long braid','black',['newyear','rain'],{back:c=>wc('M110 50Q120 70 112 90Q120 106 112 126Q108 134 104 126Q110 106 104 90Q112 70 104 54Z',c)+line('M106 72l8 2M106 90l8 2M105 108l8 2',.7),front:c=>wc('M84 52Q86 31 100 32Q114 31 116 52Q108 40 100 42Q92 40 84 52Z',c)}],
 ['shortcurl','短捲髮','ㄉㄨㄢˇ ㄐㄩㄢˇ ㄈㄚˇ','Short curls','brown',['space','sports'],{back:c=>wc('M82 60Q74 46 84 36Q90 24 102 28Q116 24 120 38Q128 50 118 64Q110 56 100 58Q90 56 82 60Z',c),front:c=>wc('M85 50Q86 36 96 36Q100 32 106 36Q116 38 115 50Q108 44 100 46Q92 44 85 50Z',c)}],
 ['updo','盤髮','ㄆㄢˊ ㄈㄚˇ','Fancy updo','brown',['royal','newyear'],{back:c=>wc('M88 30Q88 10 100 10Q112 10 112 30Z',c),front:c=>wc('M84 52Q86 30 100 30Q114 30 116 52Q110 40 100 40Q90 40 84 52Z',c)+dot(110,22,2.4,'#fff')+dot(104,16,2,'#fff')}],
 ['mushroom','蘑菇頭','ㄇㄛˊ ˙ㄍㄨ ㄊㄡˊ','Mushroom cut','brown',['night'],{back:c=>wc('M80 62Q78 28 100 28Q122 28 120 62Q100 56 80 62Z',c),front:c=>wc('M82 54Q84 32 100 32Q116 32 118 54Q100 46 82 54Z',c)}]]);
add('top',[
 ['longtee','長袖上衣','ㄔㄤˊ ㄒㄧㄡˋ ㄕㄤˋ ㄧ','Long-sleeve tee','blue',['sports','space','rain'],c=>sleeves('long',c)+wc(torso(152),c)],
 ['hoodie','連帽衫','ㄌㄧㄢˊ ㄇㄠˋ ㄕㄢ','Hoodie','purple',['rain','night','sports'],c=>wc('M84 84Q84 62 100 62Q116 62 116 84Z',c)+sleeves('cuff',c)+wc(torso(158),c)+wc('M88 126h24v16h-24Z',c)+line('M96 88l-1 14M104 88l1 14',.8)],
 ['cami','細肩帶上衣','ㄒㄧˋ ㄐㄧㄢ ㄉㄞˋ ㄕㄤˋ ㄧ','Camisole','pink',['beach','royal'],c=>line(strap,.8)+wc('M86 90Q100 96 114 90L117 152Q100 156 83 152Z',c)],
 ['ruffle','荷葉邊上衣','ㄏㄜˊ ㄧㄝˋ ㄅㄧㄢ ㄕㄤˋ ㄧ','Ruffle top','coral',['royal','beach'],c=>sleeves('ruffle',c)+wc(torso(152),c)+wc('M84 92Q92 100 100 94Q108 100 116 92L116 98Q108 106 100 100Q92 106 84 98Z',c)],
 ['puffsleeve','泡泡袖上衣','ㄆㄠˋ ㄆㄠˋ ㄒㄧㄡˋ ㄕㄤˋ ㄧ','Puff-sleeve top','white',['royal','newyear'],c=>sleeves('puff',c)+wc(torso(152),c)],
 ['stripy','條紋衫','ㄊㄧㄠˊ ㄨㄣˊ ㄕㄢ','Striped shirt','blue',['beach','night'],c=>sleeves('short',c)+wc(torso(152),c),{dp:'stripes'}],
 ['sweatshirt','運動衫','ㄩㄣˋ ㄉㄨㄥˋ ㄕㄢ','Sweatshirt','green',['sports','rain'],c=>sleeves('cuff',c)+wc(torso(156),c)+line('M82 150Q100 156 118 150M92 84Q100 90 108 84',.8)],
 ['cardigan','針織衫','ㄓㄣ ㄓ ㄕㄢ','Cardigan','yellow',['rain','night'],c=>'<path d="M86 86Q100 96 114 86L116 150H84Z" fill="#fff" stroke="'+INK+'" stroke-width=".8"/>'+sleeves('long',c)+wc('M78 84Q90 80 96 86L98 158L82 156L82 100Z',c)+wc(MX('M78 84Q90 80 96 86L98 158L82 156L82 100Z'),c)+dot(96,110,1.3,'#fff')+dot(96,130,1.3,'#fff')],
 ['denimjacket','牛仔外套','ㄋㄧㄡˊ ㄗㄞˇ ㄨㄞˋ ㄊㄠˋ','Denim jacket','denim',['night','rain'],c=>sleeves('long',c)+wc(torso(160),c)+line('M100 88V160M86 104h10M104 104h10M90 84L100 98L110 84',.8)],
 ['puffer','羽絨外套','ㄩˇ ㄖㄨㄥˊ ㄨㄞˋ ㄊㄠˋ','Puffer jacket','silver',['rain','space'],c=>sleeves('cuff',c)+wc('M76 84Q100 76 124 84L122 100L121 166Q100 172 79 166L78 100Z',c)+line('M80 106Q100 112 120 106M79 126Q100 132 121 126M79 146Q100 152 121 146M100 86V168',.8)],
 ['blazer','西裝外套','ㄒㄧ ㄓㄨㄤ ㄨㄞˋ ㄊㄠˋ','Blazer','black',['royal','space'],c=>sleeves('long',c)+wc(torso(164),c)+line('M92 84L100 118L108 84M100 118V164',.9)+dot(100,130,1.4,'#ffd43b')+dot(100,144,1.4,'#ffd43b')],
 ['cape','斗篷','ㄉㄡˇ ㄆㄥˊ','Cape','red',['royal','space'],{back:c=>wc('M80 84Q100 76 120 84L146 250Q100 262 54 250Z',c),main:c=>wc('M86 80Q100 92 114 80L116 88Q100 100 84 88Z',c)+dot(100,90,2.5,'#ffd43b')}],
 ['jersey','球衣','ㄑㄧㄡˊ ㄧ','Team jersey','blue',['sports'],c=>sleeves('short',c)+wc(torso(156),c)+'<text x="100" y="134" text-anchor="middle" font-size="22" font-weight="700" fill="#fff" stroke="'+INK+'" stroke-width=".8" font-family="system-ui">9</text>'],
 ['sailor','水手服','ㄕㄨㄟˇ ㄕㄡˇ ㄈㄨˊ','Sailor top','white',['night','beach'],c=>sleeves('short',c)+wc(torso(154),c)+wc('M84 84L100 110L116 84L112 82L100 102L88 82Z','#4a6fa5')+'<path d="M96 108l4 8 4-8z" fill="#e8505b" stroke="'+INK+'" stroke-width=".6"/>'],
 ['turtleneck','高領毛衣','ㄍㄠ ㄌㄧㄥˇ ㄇㄠˊ ㄧ','Turtleneck','black',['space','rain'],c=>wc('M92 70H108V86H92Z',c)+sleeves('long',c)+wc(torso(154),c)],
 ['tang','唐裝上衣','ㄊㄤˊ ㄓㄨㄤ ㄕㄤˋ ㄧ','Tang jacket','red',['newyear'],c=>sleeves('long',c)+wc(torso(158),c)+wc('M94 74H106V84H94Z',c)+line('M100 86V158',.8)+[100,116,132].map(y=>line('M94 '+y+'h12',1.4).replace(INK,'#d9a520')).join('')],
 ['aloha','夏威夷衫','ㄒㄧㄚˋ ㄨㄟ ㄧˊ ㄕㄢ','Hawaiian shirt','aqua',['beach'],c=>sleeves('short',c)+wc(torso(154),c)+line('M92 82L100 94L108 82M100 96V152',.8),{dp:'flowers'}],
 ['puffvest','羽絨背心','ㄩˇ ㄖㄨㄥˊ ㄅㄟˋ ㄒㄧㄣ','Puffer vest','red',['rain','sports'],c=>sleeves('long','#f4f1ea')+wc('M80 84Q100 78 120 84L121 160Q100 166 79 160Z',c)+line('M80 108Q100 114 120 108M79 132Q100 138 121 132M100 86V162',.8)],
 ['tennis','網球衫','ㄨㄤˇ ㄑㄧㄡˊ ㄕㄢ','Tennis shirt','white',['sports'],c=>sleeves('short',c)+wc(torso(154),c)+wc('M92 82L100 90L108 82L106 78L100 84L94 78Z',c)+line('M100 90V104',.8)],
 ['sequin','亮片上衣','ㄌㄧㄤˋ ㄆㄧㄢˋ ㄕㄤˋ ㄧ','Sequin top','gold',['royal','night'],c=>sleeves('cap',c)+wc(torso(152),c),{dp:'sparkle'}]]);
add('bottom',[
 ['pleated','百褶裙','ㄅㄞˇ ㄓㄜˇ ㄑㄩㄣˊ','Pleated skirt','blue',['sports','night'],c=>wc(skirtP(206,10),c)+line('M90 154L86 210M96 154L94 212M104 154L106 212M110 154L114 210',.7)],
 ['maxi','長裙','ㄔㄤˊ ㄑㄩㄣˊ','Long skirt','green',['newyear','royal','beach'],c=>wc(skirtP(330,22),c)],
 ['denimskirt','牛仔裙','ㄋㄧㄡˊ ㄗㄞˇ ㄑㄩㄣˊ','Denim skirt','denim',['night','beach'],c=>wc(skirtP(200,6),c)+line('M100 154V200M88 160h8',.7)],
 ['tiered','蛋糕裙','ㄉㄢˋ ㄍㄠ ㄑㄩㄣˊ','Tiered skirt','pink',['royal','night'],c=>wc(skirtP(184,6),c)+wc('M80 182Q100 188 120 182L126 214Q100 222 74 214Z',c)+wc('M74 212Q100 220 126 212L132 244Q100 254 68 244Z',c)],
 ['joggers','運動褲','ㄩㄣˋ ㄉㄨㄥˋ ㄎㄨˋ','Joggers','black',['sports','night'],c=>wc(pantsP(348,0),c)+line('M83 160L86 344M117 160L114 344',1.6).replace(INK,'#fff')+line('M86 340h11M103 340h11',.8)],
 ['flares','喇叭褲','ㄌㄚˇ ˙ㄅㄚ ㄎㄨˋ','Flared pants','denim',['night'],c=>wc(pantsP(356,8),c)],
 ['overalls','吊帶褲','ㄉㄧㄠˋ ㄉㄞˋ ㄎㄨˋ','Overalls','denim',['night','rain'],c=>wc(pantsP(350,1),c)+wc('M88 110H112V152H88Z',c)+line('M88 112L84 86M112 112L116 86',1.4)+dot(89,112,1.6,'#ffd43b')+dot(111,112,1.6,'#ffd43b')+wc('M94 122H106V132H94Z',c)],
 ['capris','七分褲','ㄑㄧ ㄈㄣ ㄎㄨˋ','Capri pants','white',['beach','night'],c=>wc(pantsP(300,0),c)],
 ['leggings','內搭褲','ㄋㄟˋ ㄉㄚ ㄎㄨˋ','Leggings','black',['sports','space'],c=>wc('M84 150Q100 154 116 150L116 268L112 354L105 354L104 270L100 184L96 270L95 354L88 354L84 268Z',c)],
 ['cargo','工裝褲','ㄍㄨㄥ ㄓㄨㄤ ㄎㄨˋ','Cargo pants','green',['space','rain'],c=>wc(pantsP(350,2),c)+wc('M82 220H92V236H82Z',c)+wc('M108 220H118V236H108Z',c)],
 ['widepants','寬褲','ㄎㄨㄢ ㄎㄨˋ','Wide pants','purple',['newyear','royal'],c=>wc(pantsP(354,10),c)],
 ['skort','褲裙','ㄎㄨˋ ㄑㄩㄣˊ','Skort','white',['sports','beach'],c=>wc(skirtP(198,8),c)+line('M100 160V196',.7)],
 ['rainpants','雨褲','ㄩˇ ㄎㄨˋ','Rain pants','yellow',['rain'],c=>wc(pantsP(350,4),c)+line('M84 230h14M102 230h14',1.2).replace(INK,'#fff')],
 ['tulle','紗裙','ㄕㄚ ㄑㄩㄣˊ','Tulle skirt','pink',['royal'],c=>wc(skirtP(300,26),c)+wc(skirtP(260,18),c)],
 ['floral','花裙','ㄏㄨㄚ ㄑㄩㄣˊ','Flower skirt','yellow',['beach','night'],c=>wc(skirtP(226,14),c),{dp:'flowers'}],
 ['bike','自行車褲','ㄗˋ ㄒㄧㄥˊ ㄔㄜ ㄎㄨˋ','Bike shorts','black',['sports'],c=>wc(pantsP(222,-1),c)]]);
add('dress',[
 ['princess','公主裙','ㄍㄨㄥ ㄓㄨˇ ㄑㄩㄣˊ','Princess dress','pink',['royal'],c=>sleeves('puff',c)+wc(dressP(352,44,true),c)+wc('M84 150Q100 158 116 150L118 160Q100 168 82 160Z',c)],
 ['pinafore','吊帶裙','ㄉㄧㄠˋ ㄉㄞˋ ㄑㄩㄣˊ','Pinafore','red',['night'],c=>sleeves('short','#f4f1ea')+wc(torso(150),'#f4f1ea')+line('M90 100L86 84M110 100L114 84',1.6)+wc('M88 100H112L116 150L124 214Q100 222 76 214L84 150Z',c)],
 ['shirtdress','襯衫裙','ㄔㄣˋ ㄕㄢ ㄑㄩㄣˊ','Shirt dress','blue',['night','rain'],c=>sleeves('short',c)+wc(dressP(236,12,true),c)+line('M92 82L100 94L108 82M100 96V236M84 152Q100 158 116 152',.8)],
 ['jumpsuit','連身褲','ㄌㄧㄢˊ ㄕㄣ ㄎㄨˋ','Jumpsuit','green',['space','night'],c=>sleeves('short',c)+wc(torso(154),c)+wc(pantsP(352,3),c)],
 ['yukata','浴衣','ㄩˋ ㄧ','Yukata','blue',['night','beach'],c=>sleeves('wide',c)+wc(dressP(350,6,true),c)+wc('M82 140H118V158H82Z','#ffd25e')+line('M90 84L108 140',.9),{dp:'flowers'}],
 ['hanfu','漢服','ㄏㄢˋ ㄈㄨˊ','Hanfu','pink',['newyear','royal'],c=>sleeves('wide',c)+wc(dressP(358,30,true),c)+wc('M82 138H118V150H82Z','#e8505b')+line('M88 84L104 138',.9)],
 ['ballet','芭蕾舞裙','ㄅㄚ ㄌㄟˇ ㄨˇ ㄑㄩㄣˊ','Ballet dress','pink',['royal'],c=>line(strap,.8)+wc('M86 88L114 88L116 160L84 160Z',c)+wc('M84 156Q100 162 116 156Q140 170 142 186Q100 196 58 186Q60 170 84 156Z',c)],
 ['mermaid','美人魚裙','ㄇㄟˇ ㄖㄣˊ ㄩˊ ㄑㄩㄣˊ','Mermaid gown','aqua',['royal','beach'],c=>line(strap,.8)+wc('M86 88L114 88L117 150L114 280Q136 340 138 364Q100 372 62 364Q64 340 86 280L83 150Z',c),{dp:'sparkle'}],
 ['sweaterdress','毛衣裙','ㄇㄠˊ ㄧ ㄑㄩㄣˊ','Sweater dress','coral',['rain'],c=>sleeves('cuff',c)+wc(dressP(222,6,true),c)+line('M84 200Q100 206 116 200',.8)],
 ['tennisdress','網球裙','ㄨㄤˇ ㄑㄧㄡˊ ㄑㄩㄣˊ','Tennis dress','white',['sports'],c=>wc(dressP(204,14,false),c)+line('M86 100L114 100',1.2).replace(INK,'#5b8def')],
 ['galaxy','銀河洋裝','ㄧㄣˊ ㄏㄜˊ ㄧㄤˊ ㄓㄨㄤ','Galaxy dress','purple',['space','royal'],c=>sleeves('cap',c)+wc(dressP(300,30,true),c),{dp:'stars'}],
 ['poncho','雨衣斗篷','ㄩˇ ㄧ ㄉㄡˇ ㄆㄥˊ','Rain poncho','green',['rain'],{back:c=>wc('M82 72Q84 24 100 24Q116 24 118 72Z',c),main:c=>wc(pantsP(350,0),'#3a3a44')+wc('M78 84Q100 70 122 84L150 200Q100 214 50 200Z',c)}],
 ['swimsuit','泳衣','ㄩㄥˇ ㄧ','Swimsuit','coral',['beach','sports'],c=>line(strap,.8)+wc('M86 88Q100 94 114 88L117 150L118 180Q108 176 100 186Q92 176 82 180L83 150Z',c)],
 ['longcoat','長大衣','ㄔㄤˊ ㄉㄚˋ ㄧ','Long coat','brown',['rain','space'],c=>wc(pantsP(350,0),'#3a3a44')+sleeves('long',c)+wc('M78 84Q100 78 122 84L118 100L124 270Q100 278 76 270L82 100Z',c)+line('M92 84L100 110L108 84M100 110V272',.9)+dot(104,130,1.6,INK)+dot(104,160,1.6,INK)],
 ['lion','舞獅裝','ㄨˇ ㄕ ㄓㄨㄤ','Lion dance suit','red',['newyear'],c=>sleeves('long',c)+wc(pantsP(352,4),c)+wc(torso(170),c)+[96,108,120,132,144,156,168].map(y=>line('M78 '+y+'l-6 4M122 '+y+'l6 4',1.6).replace(new RegExp(INK,'g'),'#ffd25e')).join('')+line('M84 170Q100 176 116 170',1.4)],
 ['evening','晚禮服','ㄨㄢˇ ㄌㄧˇ ㄈㄨˊ','Evening gown','black',['royal'],c=>wc('M82 92Q100 84 118 86L117 150L126 364Q100 372 74 364L83 150Z',c)+line('M112 150L114 362',.7),{dp:'sparkle'}],
 ['chef','廚師服','ㄔㄨˊ ㄕ ㄈㄨˊ','Chef outfit','white',['night'],{back:c=>wc('M86 34Q80 10 92 12Q100 2 108 12Q120 10 114 34Z','#f4f1ea'),main:c=>wc(pantsP(350,1),'#3a3a44')+sleeves('short',c)+wc(torso(170),c)+wc('M88 118H112V170H88Z','#ff8a72')+dot(94,96,1.6,INK)+dot(106,96,1.6,INK)+dot(94,108,1.6,INK)+dot(106,108,1.6,INK)}],
 ['cheer','啦啦隊服','ㄌㄚ ㄌㄚ ㄉㄨㄟˋ ㄈㄨˊ','Cheer uniform','blue',['sports'],c=>wc(torso(150),c)+line('M84 104L100 120L116 104',1.6).replace(INK,'#ffd25e')+wc(skirtP(206,10),c)+line('M92 154L88 208M108 154L112 208',.7)]]);
add('shoes',[
 ['tallboots','高筒靴','ㄍㄠ ㄊㄨㄥˇ ㄒㄩㄝ','Tall boots','black',['royal','rain'],c=>pair(wc('M85 270L98 270L98 368L81 368L85 330Z',c))],
 ['balletflat','芭蕾舞鞋','ㄅㄚ ㄌㄟˇ ㄨˇ ㄒㄧㄝˊ','Ballet flats','pink',['royal'],c=>pair(wc('M85 360Q92 356 98 360L98 368L82 368Z',c)+line('M88 360L86 334M95 360L97 334',.8))],
 ['flipflops','拖鞋','ㄊㄨㄛ ㄒㄧㄝˊ','Flip-flops','aqua',['beach','night'],c=>pair('<path d="M82 366h17" stroke="'+c+'" stroke-width="3" stroke-linecap="round"/>'+line('M90 366L86 359M90 366L95 359',1))],
 ['hightops','帆布鞋','ㄈㄢ ㄅㄨˋ ㄒㄧㄝˊ','High-tops','red',['night','sports'],c=>pair(wc('M85 340L97 340L99 368L81 368Z',c)+line('M81 365h18M87 346h8M87 352h8',.8))],
 ['snowboots','雪靴','ㄒㄩㄝˇ ㄒㄩㄝ','Snow boots','white',['rain','space'],c=>pair(wc('M83 318L99 318L100 368L79 368L82 340Z',c)+wc('M82 314H100V324H82Z','#f8e7c8'))],
 ['moonboots','太空靴','ㄊㄞˋ ㄎㄨㄥ ㄒㄩㄝ','Moon boots','silver',['space'],c=>pair(wc('M81 320Q90 314 101 320L103 368L77 368Z',c)+line('M80 340h22M79 356h24',.8))],
 ['embroidered','繡花鞋','ㄒㄧㄡˋ ㄏㄨㄚ ㄒㄧㄝˊ','Embroidered shoes','red',['newyear'],c=>pair(wc('M85 358Q92 354 98 358L99 368L82 368Z',c)+dot(91,362,1.6,'#ffd25e'))],
 ['loafers','樂福鞋','ㄌㄜˋ ㄈㄨˊ ㄒㄧㄝˊ','Loafers','brown',['night','royal'],c=>pair(wc('M85 356Q92 352 98 356L99 368L82 368Z',c)+line('M86 360h11',.8))],
 ['cleats','足球鞋','ㄗㄨˊ ㄑㄧㄡˊ ㄒㄧㄝˊ','Soccer cleats','yellow',['sports'],c=>pair(wc('M85 354L97 354L99 366L81 366Z',c)+line('M83 369v2M88 369v2M93 369v2M97 369v2',1.4))],
 ['glass','水晶鞋','ㄕㄨㄟˇ ㄐㄧㄥ ㄒㄧㄝˊ','Glass slippers','aqua',['royal'],c=>pair('<path d="M85 358Q92 354 98 358L99 368L82 368Z" fill="#e7f5ff" fill-opacity=".7" stroke="'+c+'" stroke-width="1.4"/>'+dot(91,361,1,'#fff'))],
 ['fuzzy','毛毛拖鞋','ㄇㄠˊ ˙ㄇㄠ ㄊㄨㄛ ㄒㄧㄝˊ','Fuzzy slippers','pink',['night'],c=>pair(wc('M80 360Q90 350 101 360Q102 370 90 370Q78 370 80 360Z',c)+line('M82 358l-2-3M86 355l-1-3M92 354v-3M97 356l2-3',.8))],
 ['clogs','洞洞鞋','ㄉㄨㄥˋ ㄉㄨㄥˋ ㄒㄧㄝˊ','Clogs','green',['beach','rain'],c=>pair(wc('M82 356Q90 350 99 356L100 368L80 368Z',c)+dot(86,359,1,'#fff')+dot(91,358,1,'#fff')+dot(96,360,1,'#fff'))]]);
