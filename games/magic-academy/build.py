#!/usr/bin/env python3
"""Build index.html from src/ (made by tools/split.py). Edit src/, never index.html."""
import base64, pathlib, re
here = pathlib.Path(__file__).resolve().parent
src = here / "src"
html = (src / "shell.html").read_bytes().decode("utf-8")
html = re.sub(r"/\*@inc ([^*]+)\*/", lambda m: "".join((src / f).read_bytes().decode("utf-8") for f in m.group(1).split()), html)
html = re.sub(r"@img:([^:@]+):([^@]+)@", lambda m: "data:" + m.group(2) + ";base64," + base64.b64encode((src / "img" / m.group(1)).read_bytes()).decode(), html)
(here / "index.html").write_bytes(html.encode("utf-8"))
print("built", here.name, len(html), "bytes")
