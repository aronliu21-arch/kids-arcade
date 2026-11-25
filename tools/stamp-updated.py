#!/usr/bin/env python3
"""Write updated.json: for every game in index.html, the time its folder was last changed in git.
The arcade menu uses it to put the most recently changed games first (Tester list)."""
import json, re, subprocess, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")
urls = sorted(set(re.findall(r'url:"(games/[^"]+)"', html)))
out = {}
for u in urls:
    path = u.split("?")[0].rstrip("/")
    t = subprocess.run(["git", "log", "-1", "--format=%cI", "--", path], cwd=root, capture_output=True, text=True).stdout.strip()
    if t:
        out[u] = t
(root / "updated.json").write_text(json.dumps(out, indent=1, sort_keys=True) + "\n", encoding="utf-8")
print(f"{len(out)} games stamped")
