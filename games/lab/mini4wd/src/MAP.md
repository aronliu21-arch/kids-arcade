# mini4wd source map

Edit `src/`, then run `python3 games/lab/mini4wd/build.py` (never edit index.html by hand).
With `pypinyin` installed the build also regenerates `js/00-zy.js` (zhuyin); without it the old file is kept.
Art (ChatGPT image generation, style A "retro sports anime") lives in `assets/*.webp`.

- `shell.html` page markup (screens: sTitle, sMenu, sStory, sGarage, sTune, sRace, #ovl)
- `css/main.css` all styles, phone layouts at the bottom
- `js/00-zy.js` GENERATED zhuyin map (ZYC chars, ZYR phrases)
- `js/01-data.js` CAST, SCENES (story lines), PARTS (science text, picks, quizzes), RIVALS, TIP, ADVICE
- `js/02-sim.js` PHYS numbers, carStats, carBars, TRACK, Racer, simulate, advise
- `js/03-text.js` zh() ruby, bi(), $, Read (KAVoice read-aloud)
- `js/04-audio.js` Music anthem, Engine whine, beep
- `js/05-ui.js` DB/profiles, show(), menu, tester jump, story player, go() flow, finishEpisode
- `js/06-garage.js` renderStats, Garage (build steps + quiz), Demos (motor, circuit, gears, tires, rollers, air), Tune
- `js/07-race.js` Race: drawIso (2.5D view: raised hill via zAt/P, static track layer, speed trails), drawChase (chase cam; camD follows closer in curves, aims at Lucas's car), chaseCar (assets/r_*.webp rear sprites, flattened 0.6 + sheared along road), pickCam/camMode (Auto/Chase/Top), chaseHud (mini-map), events, commentary, finish/advice
- `js/08-main.js` boot, buttons, window.__test hook

Balance: only turbo + power gears + soft tires + rollers + sleek beats Rex; no rollers always courses out.

## Chapter 2 (build your own car)
- `js/09-ch2data.js` C2: money (NT$), parts catalog + prices (C2.PARTS by slot), starter kit, school lessons/test (LESSONS, TEST_EXTRA, A_LINE), jobs (JOBS, MENU), cups (CUPS with rivals/prizes; `soon:true` = not built yet), mystery gifts, store events, SCENES.c2intro, CAST teacher/dad/boss.
- `js/10-carart.js` CarArt.draw(ctx, build, "rear"|"top", x, y, w, {col, center}): layered car. Each layer uses `assets/L_<view>_<layer>_<variant>.webp` when listed in CarArt.LAYERS, else the code drawing.
- `js/11-ch2.js` C2S (state in G.kd.c2: money, day, slot 0-2 morning/afternoon/evening, owned parts, build, toolbox, trophies, tests, cups) and C2G screens: town, school/lesson/test/quiz, home/sleep (Sunday allowance), store (kit, buy, fit, test runs, toolbox, surprise events), work/noodle, cup/pit/cupResult. One screen `#sC2` (#c2Car preview, #c2Card paged card).
- Tracks: `TRACKS` in 02-sim.js (classic, oval, twisty, hills); `setTrack(id)`; segments S/C/R(right)/H; curve limit scales with radius; `steep` divides hill power. Race.start(mode, {track, laps, build, rivals:[{who,col,build}], onDone}).
- Zhuyin: no pypinyin here, so new characters are added by hand at the end of 00-zy.js; ZYR phrases now match inside longer runs (polyphones).
- Car art: `assets/L_rear_body_*`, `L_top_body_*` (ChatGPT shells, blue; CarArt.tinted() recolors blue pixels to team colors on http(s); file:// stays blue), `L_rear_tire_*`, `L_rear_wing_*` (tinted), `L_rear_roller` (mirrored for the right side). Top-view tires/rollers/wings and the motor/gear dots are still code-drawn. Source sheets: Mac Downloads/m4wd_*.png.
- Race caches track pieces in `Race._q`; it's cleared when `Race.start` gets a different track.
- 20 ChatGPT bodies (Dec pack): `C2BODIES` in 09-ch2data.js (id, price, st {v top, c curve, a push/hills}, cols). Art: `assets/b/<id>_<orig|red|yellow|green|blue|purple>.webp` (top view; colors picked by measured hue because the pack's color names were wrong). `build.paint` = color. `bodyStat()` in 02-sim.js. Rear view of these bodies = top art squashed on stacked dark sides (CarArt.rear). Pack source: Mac Downloads/mini4wd_claude_assets.zip.
- 2.5D race: cars drawn with height (5 dark layers + top, `CarArt.topCanvas`/`dark` caches, rebuilt when IMGN changes). Big tracks zoom in and follow Lucas (`Race.zf`, `Race.zcam`; `Race.cam` is the camera MODE, don't reuse it). bg rendered at `bgK` (≤12M px for iPad).
- Pager: `.pin` blocks stay on every page (store tabs + slot chips).
- v2.3: more parts per slot (motor 8, gear 5, tire 7 incl. tire.tq, roller 6, wing 6) in PHYS + C2.PARTS; CarArt.icon(slot,v) draws store pictures; TIREART maps new tires to the 3 rear tire images (+stripe); store uses compact one-row blocks (partCols), buy dialog shows ▲▼ stat changes; trackMap(id)/trackCard/TRACKNOTE show track maps in Test, test result ("Adjust parts for this track" → Fit parts with fitTrack note) and pit. Tester jump: c2pm (after Monday class), c2cup (cup day with kit, NT$1500, A).
