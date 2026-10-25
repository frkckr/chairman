#!/usr/bin/env python3
"""post.py — gerçekçi karenin sonrası-işlemesi (Python; tarayıcıdaki kare-tamponu yolu yazılım WebGL'de çizgileniyor).
Girdi: guzel.png (doğrudan çizim, MSAA) + derinlik.png (RGBA paketli derinlik, aynı kamera). Çıktı: temiz 1920×1440 ve oyunun retro ızgarası.
Kullanım: python -X utf8 post.py guzel.png derinlik.png cikti-temiz.png cikti-retro.png [near far]"""
import sys
import numpy as np
from PIL import Image, ImageFilter

guzel = np.asarray(Image.open(sys.argv[1]).convert("RGB"), dtype=np.float32) / 255.0
der = np.asarray(Image.open(sys.argv[2]).convert("RGBA"), dtype=np.float32) / 255.0
near, far = (float(sys.argv[5]), float(sys.argv[6])) if len(sys.argv) > 6 else (2.0, 1600.0)
# RGBA paketli derinlik (three.js RGBADepthPacking): z = dot(rgba, 1/(256^k))
z = der[..., 0] + der[..., 1] / 256 + der[..., 2] / 65536 + der[..., 3] / 16777216
z = np.clip(z, 0, 1)
lin = (near * far) / (far - z * (far - near))  # perspektif derinliği metreye çevir
lin[z >= 0.9999] = far
H, W = lin.shape


def bulanik(a, r):
    return np.asarray(Image.fromarray(a.astype(np.float32), mode="F").filter(ImageFilter.GaussianBlur(r)), dtype=np.float32)


# derinlik karartması (SSAO yaklaşığı): piksel çevresinin ortalamasından daha uzaktaysa çukurdadır → kararır
ao = np.zeros_like(lin)
for r, w, olcek in ((2, 0.35, 0.8), (5, 0.35, 1.6), (12, 0.2, 3.0), (28, 0.1, 6.0)):
    fark = lin - bulanik(lin, r)
    ao += w * np.clip(fark / olcek, 0, 1)
ao = np.clip(ao, 0, 1)
ao = bulanik(ao, 1.2)
guc = 0.55
renk = guzel * (1 - ao[..., None] * guc)
# hafif bloom: parlak alanların bulanığı
par = np.clip((renk.max(axis=2) - 0.86) / 0.14, 0, 1)[..., None] * renk
bloom = np.stack([bulanik(par[..., i], 18) for i in range(3)], axis=2)
renk = renk + bloom * 0.22
# vinyet, hafif kontrast ve sıcaklık
yy, xx = np.mgrid[0:H, 0:W]
d = np.hypot((xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2))
vin = 1 - np.clip((d - 0.55) / 0.9, 0, 1) ** 1.6 * 0.3
renk = renk * vin[..., None]
renk = (renk - 0.5) * 1.06 + 0.5
renk = renk * np.array([1.02, 1.0, 0.96], dtype=np.float32)
renk = np.clip(renk, 0, 1)
im = Image.fromarray((renk * 255).astype(np.uint8))
im.resize((1920, 1440), Image.LANCZOS).save(sys.argv[3])
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], dtype=np.float32) / 16.0 - 0.5
kucuk = np.asarray(im.resize((960, 720), Image.BOX), dtype=np.float32) / 255.0
tit = np.tile(BAYER, (720 // 4 + 1, 960 // 4 + 1))[:720, :960][..., None] * 0.7
q = np.clip(np.floor(kucuk * 31 + tit + 0.5), 0, 31) / 31.0
Image.fromarray((q * 255).astype(np.uint8)).resize((1920, 1440), Image.NEAREST).save(sys.argv[4])
print("post ok", sys.argv[3], sys.argv[4], "ao ort %.3f" % ao.mean())
