"""Smaller copies of the app screens in public/assets/product, for the page.

From every capture <lang>-<view>-<shade>.jpg (2304 x 1440):
  <lang>-<view>-<shade>-1152.jpg and .avif   half width, for 1x screens
  <lang>-<view>-<shade>.avif                 full width
From every phone capture <lang>-<view>-phone-<shade>.jpg (780 x 1688):
  <lang>-<view>-crop-<shade>.jpg and .avif   its top 780 x 488, the part a
                                             16:10 frame shows on a phone

The captures themselves stay as they are. Run after a new capture:
  uv run --with pillow python scripts/product-images.py
(Pillow 11.3 or later writes AVIF.)
"""
import pathlib
import re

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent / "public" / "assets" / "product"
DESKTOP = re.compile(r"^(ar|en|de)-([a-z]+)-(dark|light)\.jpg$")
PHONE = re.compile(r"^(ar|en|de)-([a-z]+)-phone-(dark|light)\.jpg$")
CROP = (780, 488)


def save(image: Image.Image, stem: str) -> None:
    image.save(ROOT / f"{stem}.jpg", quality=80, optimize=True, progressive=True)
    image.save(ROOT / f"{stem}.avif", quality=55, speed=4)


written = 0
for path in sorted(ROOT.glob("*.jpg")):
    desktop = DESKTOP.match(path.name)
    phone = PHONE.match(path.name)
    if desktop:
        lang, view, shade = desktop.groups()
        with Image.open(path) as image:
            image = image.convert("RGB")
            image.save(ROOT / f"{lang}-{view}-{shade}.avif", quality=55, speed=4)
            half = image.resize((image.width // 2, image.height // 2), Image.LANCZOS)
            save(half, f"{lang}-{view}-{shade}-1152")
        written += 3
    elif phone:
        lang, view, shade = phone.groups()
        with Image.open(path) as image:
            image = image.convert("RGB")
            if image.width != CROP[0]:
                raise SystemExit(f"{path.name}: expected a {CROP[0]} px wide phone capture")
            save(image.crop((0, 0, CROP[0], CROP[1])), f"{lang}-{view}-crop-{shade}")
        written += 2
print(f"{written} files written")
