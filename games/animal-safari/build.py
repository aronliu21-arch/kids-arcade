#!/usr/bin/env python3
"""Join src/ into index.html. Edit src/, then run:  python3 games/animal-safari/build.py
(src/gen_lines.py -> src/lines.json holds every line of text; src/make_audio.py records the English clips.)"""
import json, pathlib
src = pathlib.Path(__file__).resolve().parent / "src"
html = (src / "shell.html").read_text(encoding="utf-8")
data = "const LINES = %s;\nconst ANIMAL_INFO = %s;\nconst LETTERS = %s;\n" % (
    json.dumps(json.loads((src / "lines.json").read_text(encoding="utf-8")), ensure_ascii=False, separators=(",", ":")),
    (src / "animals.json").read_text(encoding="utf-8"), (src / "letters.json").read_text(encoding="utf-8"))
js = data + "\n".join((src / f).read_text(encoding="utf-8") for f in ["data.js", "audio.js", "game.js", "zoo.js"])
html = html.replace("/*CSS*/", (src / "style.css").read_text(encoding="utf-8")).replace("/*JS*/", js)
(src.parent / "index.html").write_text(html, encoding="utf-8")
print("index.html", len(html.encode()) // 1024, "KB")
