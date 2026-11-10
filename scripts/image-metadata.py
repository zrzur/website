"""Finds metadata in public/assets/product and public/brand pictures, and with
--strip removes it without decoding the picture again.

JPEG: APP1 (Exif, XMP), APP13 (IPTC/Photoshop) and COM segments are dropped
byte for byte; the image data and its colour profile (APP2 ICC) stay.
AVIF and PNG: reported only (the AVIF files are written by
scripts/product-images.py, which writes no Exif or XMP).
  uv run --with pillow python scripts/image-metadata.py [--strip]
"""
import pathlib
import sys

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent / "public"
DROP = {0xE1, 0xED, 0xFE}  # APP1, APP13, COM


def jpeg_segments(data: bytes):
    """(marker, start, end) of every segment before the image data"""
    i = 2
    while i < len(data) and data[i] == 0xFF:
        marker = data[i + 1]
        if marker == 0xDA:  # start of scan: the image data follows
            return
        length = int.from_bytes(data[i + 2 : i + 4], "big")
        yield marker, i, i + 2 + length
        i += 2 + length


def found(path: pathlib.Path) -> list[str]:
    notes = []
    if path.suffix == ".jpg":
        data = path.read_bytes()
        for marker, start, end in jpeg_segments(data):
            if marker in DROP:
                kind = {0xE1: "APP1 (Exif/XMP)", 0xED: "APP13 (IPTC)", 0xFE: "comment"}[marker]
                notes.append(f"{kind} {end - start} bytes")
    with Image.open(path) as image:
        for key in ("exif", "xmp", "XML:com.adobe.xmp", "comment", "dpi"):
            if key in image.info and key != "dpi":
                notes.append(f"{key} in Pillow info")
        if image.getexif():
            notes.append(f"{len(image.getexif())} Exif tags")
    return sorted(set(notes))


def strip(path: pathlib.Path) -> None:
    data = path.read_bytes()
    keep = bytearray(data[:2])
    last = 2
    for marker, start, end in jpeg_segments(data):
        if marker not in DROP:
            keep += data[start:end]
        last = end
    keep += data[last:]
    path.write_bytes(bytes(keep))


files = sorted(p for p in ROOT.rglob("*") if p.suffix in {".jpg", ".avif", ".png"})
dirty = 0
for path in files:
    notes = found(path)
    if notes:
        dirty += 1
        print(f"{path.relative_to(ROOT)}: {', '.join(notes)}")
        if "--strip" in sys.argv and path.suffix == ".jpg":
            strip(path)
            print(f"  stripped; left: {', '.join(found(path)) or 'nothing'}")
print(f"{len(files)} pictures checked, {dirty} with metadata")
