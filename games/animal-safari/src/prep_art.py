#!/usr/bin/env python3
"""Copy/convert the supplied artwork into ../art/ (WebP).
Usage: python3 prep_art.py <unzipped Animal_Safari_Detective_All_Assets dir> <dir of cut-out PNGs>
The cut-outs (walk frames, Coco poses, props) were cropped from original-reference/ sheets with a
border flood-fill matte (largest component kept, 1px feathered edge) and checked on a dark backdrop."""
import sys, pathlib
from PIL import Image, ImageFilter
src = pathlib.Path(sys.argv[1]); cut = pathlib.Path(sys.argv[2])
out = pathlib.Path(__file__).resolve().parent.parent / "art"; out.mkdir(exist_ok=True)
gr = src / "game-ready"
def save(im, name, q=86): im.save(out / (name + ".webp"), "WEBP", quality=q, method=6)
for n in ["leo", "coco", "tiger", "monkey", "elephant", "zebra", "parrot", "giraffe", "lens", "chest", "apple", "banana", "berry", "rock"]:
    save(Image.open(gr / (n + ".webp")), n, 90)
save(Image.open(gr / "trail.webp").convert("RGB"), "trail", 84)
save(Image.open(gr / "canopy.webp").convert("RGB"), "canopy", 82)
save(Image.open(gr / "cover.webp").convert("RGB"), "cover", 82)
r = Image.open(gr / "river.webp").convert("RGB"); r = r.crop((2, 5, r.width, r.height))
r = r.resize((r.width * 2, r.height * 2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
save(r, "river", 84)
for p in sorted(cut.glob("*.png")):
    im = Image.open(p)
    if p.stem == "fg_plants": im = im.crop((0, 10, im.width, im.height))
    save(im, "elephant" if p.stem == "elephant2" else p.stem, 88)  # elephant2: the showcase-sheet elephant (game-ready one has a torn ear)
# footprint: the dark paw shape from the paw stone
im = Image.open(cut / "paw.png").convert("RGBA"); px = im.load()
fp = Image.new("RGBA", im.size, (0, 0, 0, 0)); q = fp.load()
for y in range(im.height):
    for x in range(im.width):
        r_, g, b, a = px[x, y]; lum = (r_ + g + b) / 3
        if a > 200 and lum < 95: q[x, y] = (70, 45, 30, int(min(255, (95 - lum) * 5)))
fp = fp.crop(fp.getbbox()); save(fp, "print", 90)
print("ok", len(list(out.glob("*.webp"))))
# --- remove light grey ground shadows baked under cut-outs (flood from transparent pixels, bottom band only) ---
import numpy as np
from collections import deque
def deshadow(name, band, lum_min=150, sat_max=.26):
    p = out / (name + ".webp"); im = Image.open(p).convert("RGBA"); a = np.array(im).astype(int)
    h, w = a.shape[:2]; rgb = a[..., :3]; al = a[..., 3]
    mx = rgb.max(-1); mn = rgb.min(-1); sat = (mx - mn) / np.maximum(mx, 1); lum = rgb.mean(-1)
    cand = (lum > lum_min) & (sat < sat_max); cand[: int(h * (1 - band))] = False
    semi = al < 250
    seen = (al < 40); q = deque(zip(*np.where(seen)))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and (cand[ny, nx] or (semi[ny, nx] and ny >= h * (1 - band) and lum[ny, nx] > 120)):
                seen[ny, nx] = True; q.append((ny, nx))
    a[..., 3] = np.where(seen, 0, al)
    out_im = Image.fromarray(a.astype(np.uint8), "RGBA"); out_im = out_im.crop(out_im.getbbox())
    out_im.save(p, "WEBP", quality=90, method=6)
for n, band in [("leo", .15), ("coco", .15), ("leo_walk1", .12), ("leo_walk2", .12), ("leo_walk3", .12), ("coco_side", .14), ("coco_happy", .14), ("coco_jump", .12),
                ("banana2", .45), ("cherry", .3), ("mushroom", .3), ("flowers", .25), ("fern", .25), ("egg", .25), ("nest", .3), ("crate", .25), ("chest", .25),
                ("barrel", .25), ("lantern", .2), ("binoculars", .3), ("log", .3), ("palm", .2), ("gem", .3), ("star", .3), ("map", .3),
                ("tiger", .15), ("monkey", .15), ("elephant", .12), ("zebra", .12), ("parrot", .15), ("giraffe", .1), ("deer", .12)]:
    deshadow(n, band)
print("deshadowed")
# --- thin white fringe on the supplied Coco/Leo cut-outs: pull the matte in by one pixel ---
for n in ("coco", "leo"):
    p = out / (n + ".webp"); im = Image.open(p).convert("RGBA"); r, g, b, a = im.split()
    a = a.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.6))
    Image.merge("RGBA", (r, g, b, a)).save(p, "WEBP", quality=90, method=6)
print("fringe ok")
