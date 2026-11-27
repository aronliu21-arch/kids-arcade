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
