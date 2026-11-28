#!/usr/bin/env python3
"""Write offline-files.json: every file the service worker (sw.js) saves for offline play.
Run on every push by the GitHub Action, so new games are included automatically."""
import json, pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
files = ["./", "index.html", "goals.js", "tracker.js", "voice.js", "bilingual.js", "house.js", "kit.js", "sw.js", "updated.json"]
ext = set()
for p in sorted((root / "games").rglob("*.html")):
    if "src" in p.relative_to(root).parts:
        continue  # source pieces; build.py joins them into index.html
    rel = p.relative_to(root).as_posix()
    files.append(rel)
    if p.name == "index.html":
        files.append(rel[: -len("index.html")])
    s = p.read_text(encoding="utf-8", errors="ignore")
    ext.update(re.findall(r'<script[^>]+src="(https://[^"]+)"', s))
    ext.update(re.findall(r'<link[^>]+href="(https://fonts\.googleapis\.com/css2[^"]+)"', s))
for p in sorted((root / "games").rglob("art/*")):
    if p.suffix.lower() in (".webp", ".jpg", ".jpeg", ".png"):
        files.append(p.relative_to(root).as_posix())
files = [f for f in files if (root / f.rstrip("/")).exists() or f == "./" or f.endswith("/")]
out = sorted(set(files)) + sorted(ext)
(root / "offline-files.json").write_text(json.dumps(out, indent=0) + "\n", encoding="utf-8")
print(len(out), "files listed for offline play")
