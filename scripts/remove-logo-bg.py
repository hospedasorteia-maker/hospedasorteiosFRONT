from collections import deque
from PIL import Image

SRC = r"C:\Users\vicel\.cursor\projects\c-Users-vicel-Sorteio\assets\c__Users_vicel_AppData_Roaming_Cursor_User_workspaceStorage_ae2aaa34ca8939f0052438ebcbb1ca99_images_image-89830f70-2524-409d-a2f0-e7b5e35bac44.png"
OUT = r"c:\Users\vicel\Sorteio\hospedasorteiosFRONT\public\logo.png"


def rgb_to_hsv(r, g, b):
    r, g, b = r / 255, g / 255, b / 255
    mx = max(r, g, b)
    mn = min(r, g, b)
    diff = mx - mn

    if diff == 0:
        h = 0
    elif mx == r:
        h = (60 * ((g - b) / diff) + 360) % 360
    elif mx == g:
        h = (60 * ((b - r) / diff) + 120) % 360
    else:
        h = (60 * ((r - g) / diff) + 240) % 360

    s = 0 if mx == 0 else diff / mx
    v = mx
    return h, s, v


def is_logo_pixel(r, g, b):
    h, s, v = rgb_to_hsv(r, g, b)

    if v < 0.38:
        return False
    if s < 0.15 and v < 0.5:
        return False

    # Violet / purple strokes of the mark
    return 250 <= h <= 315


def main():
    img = Image.open(SRC).convert("RGBA")
    w, h = img.size
    px = img.load()

    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if is_logo_pixel(r, g, b):
                px[x, y] = (r, g, b, 255)
            else:
                px[x, y] = (0, 0, 0, 0)

    bbox = img.getbbox()
    if not bbox:
        raise SystemExit("No visible logo content found")

    img = img.crop(bbox)

    pad = 16
    padded = Image.new("RGBA", (img.width + pad * 2, img.height + pad * 2), (0, 0, 0, 0))
    padded.paste(img, (pad, pad), img)
    padded.save(OUT, optimize=True)
    print(f"Saved transparent logo: {padded.size}")


if __name__ == "__main__":
    main()
