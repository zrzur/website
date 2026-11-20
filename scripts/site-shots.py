"""The owner's app screenshots, made into page sizes for the site.

Input: a folder of screenshots named <language>-<slot>.<png|jpg|jpeg|webp>,
language ar, en or de (German is optional: only M2, for the phones in three languages), slot d1..d8 (computer) or m1..m6 (phone), as listed in
src/shots.ts. Crop or blur anything private first: the files are used as
they are.

Output, for each screenshot:
  public/assets/shots/<language>-<slot>-<width>.avif and .webp
    computer: 800, 1400 and 2400 px wide (never wider than the screenshot)
    phone:    390 and 780 px wide
  and src/shot-manifest.ts, which tells the page every shot's size (so the
  frame never jumps while it loads) and a content hash for its address.
No metadata is copied (no EXIF, no location, no device name).

  uv run --with pillow python scripts/site-shots.py <folder>
(Pillow 11.3 or later writes AVIF.)
"""
import hashlib
import json
import pathlib
import re
import sys

from PIL import Image

REPO = pathlib.Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "assets" / "shots"
MANIFEST = REPO / "src" / "shot-manifest.ts"
NAME = re.compile(r"^(ar|en|de)-(d[1-8]|m[1-6])\.(png|jpe?g|webp)$", re.IGNORECASE)
WIDTHS = {"d": [800, 1400, 2400], "m": [390, 780]}


def main(folder: pathlib.Path) -> int:
    if not folder.is_dir():
        print(f"no folder {folder}", file=sys.stderr)
        return 2
    OUT.mkdir(parents=True, exist_ok=True)
    shots = {}
    for path in sorted(folder.iterdir()):
        match = NAME.match(path.name)
        if not match:
            if path.is_file():
                print(f"skipped {path.name}: name it <ar|en|de>-<d1..d8|m1..m6>.png")
            continue
        language, slot = match.group(1).lower(), match.group(2).lower()
        with Image.open(path) as source:
            image = source.convert("RGB")  # drops transparency and every metadata block
        widths = [w for w in WIDTHS[slot[0]] if w < image.width] + [min(image.width, WIDTHS[slot[0]][-1])]
        widths = sorted(set(widths))
        digest = hashlib.sha256()
        for width in widths:
            height = round(image.height * width / image.width)
            copy = image.resize((width, height), Image.LANCZOS) if width != image.width else image
            for ext, options in (("avif", {"quality": 60, "speed": 4}), ("webp", {"quality": 82, "method": 6})):
                target = OUT / f"{language}-{slot}-{width}.{ext}"
                copy.save(target, **options)
                digest.update(target.read_bytes())
        last = widths[-1]
        shots[f"{language}-{slot}"] = {"w": last, "h": round(image.height * last / image.width), "widths": widths, "v": digest.hexdigest()[:10]}
        print(f"{language}-{slot}: {image.width} x {image.height} -> {widths}")
    body = ",\n".join(f"  {json.dumps(key)}: {json.dumps(value)}" for key, value in sorted(shots.items()))
    MANIFEST.write_text(
        "// Written by scripts/site-shots.py from the owner's screenshots; do not edit by hand.\n"
        "/** One shot: its full size, the widths made from it, and a short content hash */\n"
        "export type ShotEntry = { w: number; h: number; widths: number[]; v: string };\n"
        '/** "<language>-<slot>" → the shot, for every shot that exists */\n'
        f"export const SHOTS: Record<string, ShotEntry> = {{{chr(10) + body + chr(10) if body else ''}}};\n",
        encoding="utf-8",
    )
    print(f"{len(shots)} shots written to {OUT.relative_to(REPO)} and {MANIFEST.relative_to(REPO)}")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: site-shots.py <folder of screenshots>", file=sys.stderr)
        sys.exit(2)
    sys.exit(main(pathlib.Path(sys.argv[1])))
