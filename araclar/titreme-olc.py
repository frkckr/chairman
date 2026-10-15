#!/usr/bin/env python3
"""Chairman — titreme ölçüsü (A5, 2026-10-15; gerçekçilik planı §4 A5)

an-yakala.py'nin tek kare görüntülerinde (PNG + aynı adlı JSON; JSON'da `kutular`: oyuncuların maç ızgarasındaki dikdörtgenleri) oyuncu
dikdörtgenleri içinde 5 bit renk ve Bayer titremesinin izini ölçer:
  dama   parlaklıkta dört komşusunun hepsinden büyük ya da hepsinden küçük olan (yerel uç) piksellerin payı — titremiş geçişin imzası
  düz    dört komşusuyla aynı parlaklıkta olan piksellerin payı
Yumuşak gölgelemenin geçişleri titremeyle damalı görünür; düz yüzey ve sert kenar daha az yerel uç verir. Dikdörtgen çimi de içerir; bu yüzden
yalnız aynı anın önce/sonra görüntüleri karşılaştırılır (A5 motoru değiştirmez: aynı tohumla an aynıdır, yalnız model değişir).

Kullanım:
  python araclar/titreme-olc.py araclar/anlar/a5-kutu-*.png
  python araclar/titreme-olc.py --karsilastir a5-kutu- a5-duz- a5-yumusak-     # araclar/anlar/ içindeki aynı adlı anlar, önek önek
Bağımlılık yok (PNG saf Python ile çözülür: 8 bit, taramasız).
"""
import json
import pathlib
import struct
import sys
import zlib

KOK = pathlib.Path(__file__).resolve().parent.parent
ANLAR = KOK / "araclar" / "anlar"


def png_oku(yol):
    """8 bit, taramasız PNG → (genişlik, yükseklik, kanal, bayt dizisi)"""
    d = pathlib.Path(yol).read_bytes()
    if d[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("PNG değil: %s" % yol)
    i, idat, w, h, ct = 8, bytearray(), 0, 0, 0
    while i < len(d):
        n = struct.unpack(">I", d[i:i + 4])[0]
        t, c = d[i + 4:i + 8], d[i + 8:i + 8 + n]
        i += 12 + n
        if t == b"IHDR":
            w, h, bd, ct, _, _, il = struct.unpack(">IIBBBBB", c)
            if bd != 8 or il != 0:
                raise ValueError("yalnız 8 bit, taramasız PNG: %s" % yol)
        elif t == b"IDAT":
            idat += c
        elif t == b"IEND":
            break
    bpp = {0: 1, 2: 3, 4: 2, 6: 4}[ct]
    ham, st = zlib.decompress(bytes(idat)), w * bpp
    cikti, onceki, p = bytearray(h * st), bytearray(st), 0
    for y in range(h):
        f = ham[p]
        p += 1
        s = bytearray(ham[p:p + st])
        p += st
        if f == 1:
            for x in range(bpp, st):
                s[x] = (s[x] + s[x - bpp]) & 255
        elif f == 2:
            for x in range(st):
                s[x] = (s[x] + onceki[x]) & 255
        elif f == 3:
            for x in range(st):
                s[x] = (s[x] + (((s[x - bpp] if x >= bpp else 0) + onceki[x]) >> 1)) & 255
        elif f == 4:
            for x in range(st):
                a = s[x - bpp] if x >= bpp else 0
                b = onceki[x]
                c = onceki[x - bpp] if x >= bpp else 0
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                s[x] = (s[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        cikti[y * st:(y + 1) * st] = s
        onceki = s
    return w, h, bpp, cikti


def olc(png):
    js = pathlib.Path(png).with_suffix(".json")
    o = json.loads(js.read_text(encoding="utf-8")) if js.exists() else {}
    kutular = o.get("kutular") or []
    w, h, bpp, px = png_oku(png)
    L = [0] * (w * h)
    for i in range(w * h):
        j = i * bpp
        L[i] = (299 * px[j] + 587 * px[j + 1] + 114 * px[j + 2]) // 1000 if bpp >= 3 else px[j]
    uc = duz = say = n = 0
    for x0, y0, x1, y1 in kutular:
        x0, y0, x1, y1 = max(1, x0), max(1, y0), min(w - 2, x1), min(h - 2, y1)
        if y1 - y0 < 8 or x1 - x0 < 3:
            continue
        n += 1
        for y in range(y0, y1 + 1):
            r = y * w
            for x in range(x0, x1 + 1):
                l = L[r + x]
                a, b, c, d = L[r + x - 1], L[r + x + 1], L[r - w + x], L[r + w + x]
                say += 1
                if (l > a and l > b and l > c and l > d) or (l < a and l < b and l < c and l < d):
                    uc += 1
                elif l == a == b == c == d:
                    duz += 1
    return {"kutu": n, "piksel": say, "dama": 100.0 * uc / say if say else float("nan"), "duz": 100.0 * duz / say if say else float("nan")}


def yaz(ad, r):
    print("  %-34s kutu %3d · piksel %7d · dama %%%5.2f · düz %%%5.1f" % (ad, r["kutu"], r["piksel"], r["dama"], r["duz"]))


def ana():
    arg = sys.argv[1:]
    if arg and arg[0] == "--karsilastir":
        onekler = arg[1:]
        if not onekler:
            sys.exit("önek verin: --karsilastir a5-kutu- a5-duz-")
        anlar = sorted(p.name[len(onekler[0]):] for p in ANLAR.glob(onekler[0] + "*.png"))
        print("Titreme ölçüsü (oyuncu dikdörtgenlerinde; aynı an, farklı model) · araclar/anlar/")
        top = {k: [0, 0, 0] for k in onekler}
        for an in anlar:
            print(" " + an)
            for k in onekler:
                yol = ANLAR / (k + an)
                if not yol.exists():
                    print("  %-34s yok" % (k + an))
                    continue
                r = olc(yol)
                yaz(k + an, r)
                t = top[k]
                t[0] += r["piksel"]
                t[1] += r["dama"] * r["piksel"] / 100.0
                t[2] += r["duz"] * r["piksel"] / 100.0
        print(" Toplam (piksel ağırlıklı):")
        for k in onekler:
            p, u, d = top[k]
            print("  %-34s dama %%%5.2f · düz %%%5.1f" % (k, 100.0 * u / p if p else float("nan"), 100.0 * d / p if p else float("nan")))
        return
    for a in arg:
        yaz(pathlib.Path(a).name, olc(a))


if __name__ == "__main__":
    ana()
