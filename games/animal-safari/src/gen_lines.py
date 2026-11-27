#!/usr/bin/env python3
"""Source of truth for every spoken / shown line in Animal Safari Detective.
Run:  python3 games/animal-safari/src/gen_lines.py   -> writes src/lines.json (with zhuyin)
Then: python3 games/animal-safari/src/make_audio.py  -> English clips (Kokoro, offline)
Then: python3 games/animal-safari/build.py            -> index.html

Fields per line:  en (shown + spoken), zh (shown), zs (Chinese spoken text if different from zh),
                  sp (English spoken text if different from en), v (voice: coco or an animal id)."""
import json, pathlib, re
HERE = pathlib.Path(__file__).resolve().parent
L = {}
def add(key, en, zh, v="coco", zs=None, sp=None):
    d = {"en": en, "zh": zh, "v": v}
    if zs: d["zs"] = zs
    if sp: d["sp"] = sp
    L[key] = d

# ---------- animals ----------
# id: (English, Chinese, first letter, letter sound, zhuyin initial, spoken syllable for it)
ANIMALS = {
 "tiger":    ("Tiger", "老虎", "T", "Tuh", "ㄌ", "勒"),
 "monkey":   ("Monkey", "猴子", "M", "Mmm", "ㄏ", "喝"),
 "elephant": ("Elephant", "大象", "E", "Eh", "ㄉ", "得"),
 "zebra":    ("Zebra", "斑馬", "Z", "Zzz", "ㄅ", "玻"),
 "parrot":   ("Parrot", "鸚鵡", "P", "Puh", "ㄧ", "衣"),
 "giraffe":  ("Giraffe", "長頸鹿", "G", "Juh", "ㄔ", "吃"),
 "deer":     ("Deer", "小鹿", "D", "Duh", "ㄒ", "希"),
}
for a, (en, zh, *_ ) in ANIMALS.items():
    add("name_" + a, en + "!", zh + "!", v=a)

add("hi_tiger", "Rawr! Hi! I'm Tiger!", "吼~嗨!我是老虎!", v="tiger")
add("hi_monkey", "Ooh ooh! Hi! I'm Monkey!", "嗚嗚!嗨!我是猴子!", v="monkey")
add("hi_elephant", "Hello there! I'm Elephant!", "哈囉!我是大象!", v="elephant")
add("hi_zebra", "Neigh! Hi! I'm Zebra!", "嘶~嗨!我是斑馬!", v="zebra")
add("hi_parrot", "Squawk! Hello! I'm Parrot!", "嘎嘎!哈囉!我是鸚鵡!", v="parrot")
add("hi_giraffe", "Hello, down there! I'm Giraffe!", "哈囉,下面的朋友!我是長頸鹿!", v="giraffe")
add("hi_deer", "Hi! I'm Deer!", "嗨!我是小鹿!", v="deer")

FACTS = {
 "tiger": ("Tigers love to swim! And every tiger has its very own stripes.", "老虎很會游泳喔!而且每隻老虎的條紋都不一樣。"),
 "monkey": ("Monkeys can hold on to branches with their long tails!", "猴子可以用長長的尾巴抓住樹枝喔!"),
 "elephant": ("Elephants drink water with their long trunks. They even give trunk hugs!", "大象用長長的鼻子喝水,還會用鼻子抱抱喔!"),
 "zebra": ("No two zebras have the same stripes. Every zebra is special!", "每一隻斑馬的條紋都不一樣,每一隻都很特別!"),
 "parrot": ("Parrots can copy sounds. Hello! Hello! And they love fruit!", "鸚鵡會學別人說話,你好!你好!而且牠們很愛吃水果!"),
 "giraffe": ("Giraffes are the tallest animals in the world. And their tongues are purple!", "長頸鹿是世界上最高的動物,牠們的舌頭是紫色的喔!"),
}
for a, (en, zh) in FACTS.items():
    add("fact_" + a, en, zh)
    add("sticker_" + a, "You got a %s sticker!" % ANIMALS[a][0].lower(), "你得到一張%s貼紙!" % ANIMALS[a][1])

PATCH = {
 "tiger": ("Orange fur with black stripes!", "橘色的毛,還有黑色的條紋!"),
 "monkey": ("Soft, brown, fuzzy fur!", "咖啡色、毛茸茸的毛!"),
 "elephant": ("Gray, wrinkly skin!", "灰灰的、皺皺的皮膚!"),
 "zebra": ("Black and white stripes!", "黑白相間的條紋!"),
 "parrot": ("Bright red, blue, and yellow feathers!", "紅色、藍色、黃色的漂亮羽毛!"),
 "giraffe": ("Yellow, with big brown spots!", "黃色的,有大大的咖啡色斑點!"),
}
PART = {
 "tiger": ("A big, stripy tail!", "一條有條紋的大尾巴!"),
 "monkey": ("A long, curly tail!", "一條長長的、捲捲的尾巴!"),
 "elephant": ("A long, long trunk!", "長長的、長長的鼻子!"),
 "zebra": ("A stripy head with a fuzzy mane!", "有條紋的頭,還有毛毛的鬃毛!"),
 "parrot": ("A strong, curvy beak!", "彎彎的、硬硬的嘴巴!"),
 "giraffe": ("A long, long neck!", "長長的、長長的脖子!"),
}
NOTME = {
 "tiger": ("Not me! I have orange fur and black stripes.", "不是我喔!我是橘色的,有黑色的條紋。"),
 "monkey": ("Not me! I have brown, fuzzy fur.", "不是我喔!我的毛是咖啡色的。"),
 "elephant": ("Not me! I have gray skin and a long trunk.", "不是我喔!我是灰色的,有長長的鼻子。"),
 "zebra": ("Not me! I'm black and white.", "不是我喔!我是黑白條紋的。"),
 "parrot": ("Not me! I have colorful feathers.", "不是我喔!我有彩色的羽毛。"),
 "giraffe": ("Not me! I have brown spots and a long neck.", "不是我喔!我有咖啡色的斑點和長脖子。"),
}
for a in PATCH:
    add("patch_" + a, *PATCH[a]); add("part_" + a, *PART[a]); add("notme_" + a, *NOTME[a], v=a)

SOLVED = {
 ("trail", "monkey"): ("Hee hee! It was me! The bananas were so yummy. Sorry!", "嘻嘻!是我啦!香蕉太好吃了,對不起嘛!"),
 ("trail", "elephant"): ("It was me! I picked the bananas with my trunk. Oops! Sorry!", "是我!我用鼻子把香蕉拿走了。哎呀,對不起!"),
 ("trail", "parrot"): ("Squawk! It was me! I love bananas! Sorry, sorry!", "嘎嘎!是我!我最愛吃香蕉了!對不起、對不起!"),
 ("river", "elephant"): ("It was me! I was splashing with my trunk! Splash, splash!", "是我!我用鼻子噴水玩,嘩啦嘩啦!"),
 ("river", "zebra"): ("It was me! I came to the river for a cool drink.", "是我!我來河邊喝涼涼的水。"),
 ("river", "tiger"): ("Rawr! It was me! Tigers love to swim!", "吼~是我!老虎最喜歡游泳了!"),
 ("canopy", "monkey"): ("It was me! I borrowed it to look at bugs. Here you go!", "是我!我借來看小蟲蟲,還給你!"),
 ("canopy", "parrot"): ("Squawk! It was me! It was so shiny! Here you go!", "嘎嘎!是我!它亮晶晶的好漂亮!還給你!"),
 ("canopy", "giraffe"): ("It was me! My long neck reached right up here. Here you go!", "是我!我的長脖子一伸就拿到了。還給你!"),
}
for (area, a), (en, zh) in SOLVED.items():
    add("solved_%s_%s" % (area, a), en, zh, v=a)

# ---------- title / map / journal ----------
add("title", "Animal Safari Detective", "動物探險小偵探")
add("hello", "Hi Milo! I'm Coco. Let's solve animal mysteries together! Tap the big green button!",
    "嗨,洛明!我是可可。我們一起去解開動物的謎題吧!按一下綠色的大按鈕!")
add("map_pick", "Where should we go, detective? Tap a picture!", "小偵探,我們要去哪裡呢?點一張圖吧!")
add("area_trail", "Jungle Trail!", "叢林小路!")
add("area_river", "Waterfall Crossing!", "瀑布吊橋!")
add("area_canopy", "Treetop Lookout!", "樹頂瞭望台!")
add("journal_open", "Here's our sticker book! Tap a sticker to hear about the animal.", "這是我們的貼紙本!點一下貼紙,聽聽動物的故事。")
add("journal_empty", "Who's hiding here? Solve a mystery to find out!", "這裡躲著誰呢?解開謎題就知道囉!")
add("journal_cases", "Look how many mysteries you solved!", "你看,你解開了好多謎題!")

# ---------- area intros ----------
add("intro_trail", "Oh no! Our picnic bananas are gone! Someone ate them! Let's be detectives and find three clues. Tap things to look around!",
    "糟糕!我們野餐的香蕉不見了!是誰吃掉的呢?我們來當小偵探,找出三個線索吧!點點看四周的東西!")
add("intro_river", "Look! Big, wet footprints by the river! Who was splashing here? Let's find three clues!",
    "你看!河邊有好多濕濕的腳印!是誰在這裡玩水呢?我們來找三個線索吧!")
add("intro_canopy", "Uh oh! Leo's magnifying glass is missing! Someone took it up here. Let's find three clues!",
    "哎呀!里歐的放大鏡不見了!有人把它拿到樹上來了。我們來找三個線索吧!")
add("walk_help", "Tap the ground to walk there. Or press the big arrows!", "點一下地面,就可以走過去。也可以按大箭頭喔!")
add("hint_look", "Hmm, what's over there? Let's tap something!", "嗯……那邊有什麼呢?我們點點看吧!")
add("hint_sparkle", "Look! Something is sparkling. Tap it!", "你看!有東西在閃閃發亮,點一下!")
add("hint_walk", "Let's walk this way! There's more to see.", "我們往這邊走吧!還有好多東西可以看。")
add("looked_here", "We already looked here. Let's try something else!", "這裡我們看過了喔,換別的看看!")

# ---------- clues ----------
add("clue_look", "Look! A clue!", "你看!一個線索!")
add("clue_1", "We found one clue! Let's find two more.", "找到一個線索了!再找兩個吧。")
add("clue_2", "Another clue! Just one more!", "又一個線索!只差一個了!")
add("clue_3", "Three clues! Now we can solve the mystery!", "三個線索都找到了!我們可以解開謎題了!")
add("shadow", "And here's its shadow!", "還有,這是牠的影子!")
add("witness_clue", "Our new friend saw who did it! Here's a clue!", "我們的新朋友有看到是誰喔!這是一個線索!")
add("ui_pick", "Pick a place!", "選一個地方!")
add("ui_book", "Sticker Book", "貼紙本")
add("ui_cases", "Mysteries solved", "解開的謎題")
add("final_intro", "Let's look at our clues.", "我們來看看線索。")
add("final_ask", "Who matches all our clues? Tap the animal!", "誰跟我們的線索一樣呢?點一下那隻動物!")
add("final_again", "Let's look at the clues again.", "我們再看一次線索吧。")
add("solved_yay", "You solved the mystery! Great detective work, Milo!", "你解開謎題了!洛明,你真是厲害的小偵探!")
add("play_again", "Play again, or pick a new place!", "要再玩一次,還是換個地方呢?")

# ---------- object actions ----------
ACT = {
 "log": ("Let's peek under the log!", "我們來看看木頭下面!"),
 "bananas": ("Shake, shake! What falls down?", "搖一搖!會掉下什麼呢?"),
 "fern": ("Rustle, rustle! Who's hiding in there?", "沙沙沙!是誰躲在裡面?"),
 "prints": ("Footprints! Let's follow them!", "有腳印!我們跟著走!"),
 "nest": ("A nest! Let's look inside.", "一個鳥窩!我們看看裡面。"),
 "crate": ("A wooden box! Let's open it!", "一個木箱子!打開看看!"),
 "chest": ("A treasure chest! Let's open it!", "一個寶箱!打開看看!"),
 "barrel": ("A floating barrel! What's inside?", "一個漂來的木桶!裡面有什麼?"),
 "plank": ("This board is wiggly! Let's lift it up.", "這塊木板鬆鬆的,我們掀開看看!"),
 "binoculars": ("Binoculars! Let's look far, far away.", "望遠鏡!我們來看好遠好遠的地方。"),
 "basket": ("A basket on a rope! Let's pull it down.", "繩子上有一個籃子!我們把它拉下來。"),
 "egg": ("A big spotty egg! Let's look behind it.", "一顆有斑點的大蛋!我們看看後面。"),
}
for k, (en, zh) in ACT.items():
    add("act_" + k, en, zh)
SUR = {
 "star": ("A sparkly star! Twinkle, twinkle!", "一顆亮晶晶的星星!一閃一閃!"),
 "gem": ("Ooh! A shiny blue gem!", "哇!一顆藍色的寶石!"),
 "mushroom": ("Boing! A bouncy mushroom!", "咚!會彈跳的香菇!"),
 "map": ("An old treasure map! So cool!", "一張舊舊的藏寶圖!好酷喔!"),
 "nothing": ("Nothing here. Let's look somewhere else!", "這裡沒有東西,我們去別的地方看看!"),
 "flower": ("What a pretty flower! Sniff, sniff. It smells nice!", "好漂亮的花!聞一聞,香香的!"),
 "splash": ("Splash! The water is nice and cool!", "嘩啦!水涼涼的好舒服!"),
 "waterfall": ("Whoosh! Listen to the waterfall!", "嘩~聽聽瀑布的聲音!"),
 "lantern": ("A glowing lantern! It's warm and bright.", "一盞亮亮的燈籠!暖暖的好亮喔。"),
 "egg": ("A big spotty egg! Shh, it's resting.", "一顆有斑點的大蛋!噓,牠在休息喔。"),
 "palm": ("Wiggle, wiggle! What a tall palm tree!", "搖搖搖!好高的椰子樹!"),
 "coco": ("Hee hee! That tickles!", "嘻嘻!好癢喔!"),
 "leo": ("Leo is ready to explore!", "里歐準備好去探險了!"),
 "orchid": ("Purple flowers! So pretty up high!", "紫色的花!在高高的樹上好漂亮!"),
}
for k, (en, zh) in SUR.items():
    add("sur_" + k, en, zh)

# ---------- counting ----------
ITEMS = {  # id: (plural English, Chinese, measure word)
 "berries": ("berries", "藍莓", "顆"), "apples": ("apples", "蘋果", "顆"), "bananas": ("bananas", "香蕉", "根"),
 "eggs": ("eggs", "蛋", "顆"), "gems": ("gems", "寶石", "顆"), "stars": ("stars", "星星", "顆"), "cherries": ("cherries", "櫻桃", "顆"),
}
for k, (en, zh, mw) in ITEMS.items():
    add("count_intro_" + k, "Look at all these %s! Let's count them. Touch each one!" % en,
        "哇,好多%s!我們來數一數。每一%s都摸一下喔!" % (zh, mw))
    add("count_ask_" + k, "How many %s are there?" % en, "總共有幾%s%s呢?" % (mw, zh))
EN_NUM = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"]
ZH_NUM = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]
ZH_QTY = ["", "一", "兩", "三", "四", "五", "六", "七", "八", "九", "十"]
for n in range(1, 11):
    add("num_%d" % n, EN_NUM[n] + "!", ZH_NUM[n] + "!")
    add("yes_%d" % n, "Yes! %s!" % EN_NUM[n], "對!%s!" % ZH_NUM[n])
    add("group_%d" % n, "%s here." % EN_NUM[n], "這邊有%s個。" % ZH_QTY[n])
    add("more_%d" % n, "And %s more here!" % EN_NUM[n].lower(), "這邊還有%s個!" % ZH_QTY[n])
add("count_right", "You counted them all! Great counting!", "你全部都數完了!數得好棒!")
add("count_again", "Hmm, not quite. Let's count them together!", "嗯,好像不是喔。我們一起再數一次!")
add("count_glow", "This many! Tap the glowing number.", "就是這麼多!點一下發亮的數字。")
add("count_more", "There are more to touch! Find the ones without a number.", "還有沒摸到的喔!找找看沒有數字的。")

# ---------- adding ----------
add("add_intro", "Two little groups! Let's look.", "有兩小堆!我們來看看。")
add("add_push", "Let's put them all in the basket! Tap each group.", "我們把它們都放進籃子裡!點一下每一堆。")
add("add_countall", "Now count them all together! Touch each one.", "現在全部一起數!每一個都摸一下。")
add("add_right", "Yes! Putting groups together is called adding!", "對了!把兩堆合在一起,就是加法喔!")
for a in range(1, 10):
    for b in range(1, 10):
        if a + b <= 10:
            add("add_ask_%d_%d" % (a, b), "%s and %s make how many?" % (EN_NUM[a], EN_NUM[b].lower()),
                "%s個和%s個,合起來是幾個呢?" % (ZH_QTY[a], ZH_QTY[b]))

# ---------- first sound ----------
add("sound_teach", "Every word starts with a sound. Listen: Lll, Lll, Leo! Leo starts with L!",
    "每個詞都有開頭的聲音。聽聽看:ㄎ、ㄎ、可可!可可的開頭是ㄎ!",
    zs="每個詞都有開頭的聲音。聽聽看:科、科、可可!可可的開頭是,科!",
    sp="Every word starts with a sound. Listen: Lll, Lll, Leo! Leo starts with L!")
for a, (en, zh, letter, snd, zy, zys) in ANIMALS.items():
    add("sound_ask_" + a, "Now listen: %s, %s, %s! Which letter makes the %s sound? Tap it!" % (snd, snd.lower(), en.lower(), snd.lower()),
        "現在聽:%s、%s、%s!%s的開頭是哪一個注音呢?點一下!" % (zy, zy, zh, zh),
        zs="現在聽:%s、%s、%s!%s的開頭是哪一個注音呢?點一下!" % (zys, zys, zh, zh))
    add("sound_right_" + a, "Yes! %s says %s. %s, %s, %s!" % (letter, snd.lower(), snd, snd.lower(), en.lower()),
        "對了!%s,%s!" % (zy, zh), zs="對了!%s,%s!" % (zys, zh))
    add("sound_again_" + a, "Listen again: %s, %s, %s!" % (snd, snd.lower(), en.lower()),
        "再聽一次:%s、%s、%s!" % (zy, zy, zh), zs="再聽一次:%s、%s、%s!" % (zys, zys, zh))
LETTER_SOUNDS = {"A": "Ah", "B": "Buh", "D": "Duh", "E": "Eh", "F": "Fff", "G": "Guh", "H": "Hhh", "M": "Mmm", "N": "Nnn",
                 "P": "Puh", "R": "Rrr", "S": "Sss", "T": "Tuh", "Z": "Zzz"}
for k, s in LETTER_SOUNDS.items():
    add("letter_" + k, "%s says %s." % (k, s.lower()), k)
add("letter_ok_G", "G can say juh, like giraffe!", "G")
ZY = {"ㄅ": "玻", "ㄆ": "坡", "ㄇ": "摸", "ㄈ": "佛", "ㄉ": "得", "ㄊ": "特", "ㄋ": "訥", "ㄌ": "勒", "ㄍ": "哥",
      "ㄎ": "科", "ㄏ": "喝", "ㄒ": "希", "ㄔ": "吃", "ㄙ": "思", "ㄧ": "衣"}
add("sound_hmm", "Hmm, that one sounds different.", "嗯,這個聲音不一樣喔。")
add("sound_glow", "It's this one! Tap the glowing letter.", "是這一個!點一下發亮的符號。")

# ---------- praise ----------
add("praise_1", "Great job!", "好棒喔!")
add("praise_2", "Wow, you did it!", "哇,你做到了!")
add("praise_3", "Super detective!", "超級小偵探!")
add("praise_4", "Yes! That's right!", "對了!答對了!")
add("tap_here", "Tap here!", "點這裡!")

# ---------- zhuyin ----------
from pypinyin import pinyin, Style
OVR = {"長": "ㄔㄤˊ", "一": "ㄧ", "不": "ㄅㄨˋ", "數": "ㄕㄨˇ", "得": None, "地": None, "了": None, "著": None, "還": None, "嗚": "ㄨ", "嘶": "ㄙ", "吼": "ㄏㄡˇ", "咚": "ㄉㄨㄥ", "茸": "ㄖㄨㄥˊ", "彈": "ㄊㄢˊ", "相": "ㄒㄧㄤ", "哇": "ㄨㄚ", "著": "˙ㄓㄜ"}
PHRASE = {"數得": ["ㄕㄨˇ", "˙ㄉㄜ"], "覺得": ["ㄐㄩㄝˊ", "˙ㄉㄜ"], "還給": ["ㄏㄨㄢˊ", "ㄍㄟˇ"], "還有": ["ㄏㄞˊ", "ㄧㄡˇ"],
          "了解": ["ㄌㄧㄠˇ", "ㄐㄧㄝˇ"], "地方": ["ㄉㄧˋ", "˙ㄈㄤ"], "數字": ["ㄕㄨˋ", "ㄗˋ"], "看到": ["ㄎㄢˋ", "ㄉㄠˋ"],
          "拿到": ["ㄋㄚˊ", "ㄉㄠˋ"], "做到": ["ㄗㄨㄛˋ", "ㄉㄠˋ"], "摸到": ["ㄇㄛ", "ㄉㄠˋ"], "找到": ["ㄓㄠˇ", "ㄉㄠˋ"],
          "得到": ["ㄉㄜˊ", "ㄉㄠˋ"], "東西": ["ㄉㄨㄥ", "˙ㄒㄧ"], "朋友": ["ㄆㄥˊ", "˙ㄧㄡ"], "什麼": ["ㄕㄣˊ", "˙ㄇㄜ"],
          "哈囉": ["ㄏㄚ", "ㄌㄨㄛ"], "舒服": ["ㄕㄨ", "˙ㄈㄨ"], "漂亮": ["ㄆㄧㄠˋ", "˙ㄌㄧㄤ"], "鬃毛": ["ㄗㄨㄥ", "ㄇㄠˊ"],
          "牠們": ["ㄊㄚ", "˙ㄇㄣ"], "我們": ["ㄨㄛˇ", "˙ㄇㄣ"], "地上": ["ㄉㄧˋ", "ㄕㄤˋ"], "嘩啦": ["ㄏㄨㄚ", "ㄌㄚ"]}
def neutral(z):
    return "˙" + z.replace("˙", "") if "˙" in z else z
def zhuyin(text):
    out = []; i = 0
    while i < len(text):
        two = text[i:i + 2]
        if two in PHRASE and all('一' <= c <= '鿿' for c in two):
            for c, z in zip(two, PHRASE[two]): out.append([c, z])
            i += 2; continue
        c = text[i]
        if '一' <= c <= '鿿':
            ctx = text[max(0, i - 1):i + 2]
            z = neutral(pinyin(ctx, style=Style.BOPOMOFO)[min(i, 1)][0]) if ctx else ""
            if OVR.get(c): z = OVR[c]
            elif c in ("得", "地", "了", "著") and z.replace("˙", "") in ("ㄉㄜ", "ㄉㄧ", "ㄌㄜ", "ㄓㄜ"): z = neutral(z) if c != "地" else z
            if c == "的": z = "˙ㄉㄜ"
            if c == "了": z = "˙ㄌㄜ"
            out.append([c, z])
        else:
            if out and not out[-1][1] and len(out[-1][0]) < 40: out[-1][0] += c
            else: out.append([c, ""])
        i += 1
    return out
for k, d in L.items():
    if re.search(r'[一-鿿]', d["zh"]):
        d["zy"] = zhuyin(d["zh"])
(HERE / "lines.json").write_text(json.dumps(L, ensure_ascii=False, indent=0), encoding="utf-8")
(HERE / "animals.json").write_text(json.dumps({a: {"en": v[0], "zh": v[1], "letter": v[2], "zy": v[4], "zys": v[5]} for a, v in ANIMALS.items()}, ensure_ascii=False), encoding="utf-8")
(HERE / "letters.json").write_text(json.dumps({"en": sorted(LETTER_SOUNDS), "zh": ZY}, ensure_ascii=False), encoding="utf-8")
print(len(L), "lines")
