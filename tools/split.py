#!/usr/bin/env python3
"""Split one big game into small source files that build back into the SAME index.html.

    python3 tools/split.py games/<name>          # creates games/<name>/src/ + build.py
    python3 games/<name>/build.py                # rebuilds games/<name>/index.html

Why: Claude can open just the part it is changing (e.g. src/js/07-battle.js) instead of
the whole 300 KB file, which saves most of the tokens per edit. The live game stays one
self-contained file, so offline play, the tracker and the arcade menu are unchanged.

Layout after a split:
  src/shell.html   page markup; inline <style>/<script> bodies replaced by /*@inc ...*/ markers
  src/css/NN.css   style blocks
  src/js/NN-x.js   script blocks, cut at top-level lines into ~12 KB pieces (x = first name defined)
  src/img/NN.ext   images that were embedded as base64 (put back as data: URLs at build time)
  src/MAP.md       which file holds which top-level functions/consts (read this first)
"""
import base64, pathlib, re, sys, mimetypes

CHUNK = 12000
TOP = re.compile(r'^(?:async\s+)?(?:function\*?\s+([A-Za-z_$][\w$]*)|(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)|/\*|//|\(function|window\.)')
B64 = re.compile(r'data:(image/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]{200,})')
EXT = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg"}

def slug(s):
    return re.sub(r'[^A-Za-z0-9]+', '-', s).strip('-')[:24] or 'part'

def cut_js(body):
    lines = body.splitlines(keepends=True)
    parts, cur, size = [], [], 0
    for ln in lines:
        if size >= CHUNK and TOP.match(ln):
            parts.append(''.join(cur)); cur, size = [], 0
        cur.append(ln); size += len(ln)
    if cur: parts.append(''.join(cur))
    return parts

def names(js):
    out = []
    for ln in js.splitlines():
        m = TOP.match(ln)
        if m and (m.group(1) or m.group(2)):
            out.append(m.group(1) or m.group(2))
    return out

def main(game):
    g = pathlib.Path(game)
    src = g / 'src'
    if src.exists():
        sys.exit(f'{src} already exists; edit the src files and run build.py instead')
    html = (g / 'index.html').read_bytes().decode('utf-8')
    (src / 'js').mkdir(parents=True); (src / 'css').mkdir(); (src / 'img').mkdir()

    # 1. pull embedded images out into real files
    imgs = {}
    def img_sub(m):
        b = m.group(0)
        if b not in imgs:
            n = len(imgs) + 1
            fn = f'{n:02d}.{EXT.get(m.group(1), "bin")}'
            (src / 'img' / fn).write_bytes(base64.b64decode(m.group(2)))
            imgs[b] = (fn, m.group(1))
        fn, mime = imgs[b]
        return f'@img:{fn}:{mime}@'
    html = B64.sub(img_sub, html)

    # 2. pull inline <style> and <script> bodies out
    mp, js_n, css_n = [], 0, 0
    def blk(m):
        nonlocal js_n, css_n
        open_tag, body, close = m.group(1), m.group(2), m.group(3)
        if open_tag.lower().startswith('<style'):
            css_n += 1
            fn = f'css/{css_n:02d}.css'
            (src / fn).write_bytes((body).encode('utf-8'))
            mp.append(f'- `{fn}` styles ({len(body)//1000} KB)')
            return f'{open_tag}/*@inc {fn}*/{close}'
        if 'src=' in open_tag or len(body) < 2000:
            return m.group(0)
        files = []
        for part in cut_js(body):
            js_n += 1
            nm = names(part)
            fn = f'js/{js_n:02d}-{slug(nm[0]) if nm else "part"}.js'
            (src / fn).write_bytes((part).encode('utf-8'))
            files.append(fn)
            shown = ', '.join(nm[:25]) + (' …' if len(nm) > 25 else '')
            mp.append(f'- `{fn}` ({len(part)//1000} KB): {shown}')
        return f'{open_tag}/*@inc {" ".join(files)}*/{close}'
    html = re.sub(r'(<(?:style|script)\b[^>]*>)(.*?)(</(?:style|script)>)', blk, html, flags=re.S | re.I)

    (src / 'shell.html').write_bytes((html).encode('utf-8'))
    if imgs:
        mp.append(f'- `img/` {len(imgs)} images (were base64 in the page)')
    (src / 'MAP.md').write_text(
        f'# {g.name} source map\n\nEdit these files, then run `python3 games/.../build.py` '
        f'(never edit index.html by hand). `shell.html` holds the page markup.\n\n' + '\n'.join(mp) + '\n',
        encoding='utf-8')
    (g / 'build.py').write_bytes((BUILD).encode('utf-8'))
    print(f'{g}: {js_n} js, {css_n} css, {len(imgs)} images')

BUILD = '''#!/usr/bin/env python3
"""Build index.html from src/ (made by tools/split.py). Edit src/, never index.html."""
import base64, pathlib, re
here = pathlib.Path(__file__).resolve().parent
src = here / "src"
html = (src / "shell.html").read_bytes().decode("utf-8")
html = re.sub(r"/\\*@inc ([^*]+)\\*/", lambda m: "".join((src / f).read_bytes().decode("utf-8") for f in m.group(1).split()), html)
html = re.sub(r"@img:([^:@]+):([^@]+)@", lambda m: "data:" + m.group(2) + ";base64," + base64.b64encode((src / "img" / m.group(1)).read_bytes()).decode(), html)
(here / "index.html").write_bytes(html.encode("utf-8"))
print("built", here.name, len(html), "bytes")
'''

if __name__ == '__main__':
    for a in sys.argv[1:]:
        main(a)
