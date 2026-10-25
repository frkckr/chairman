#!/usr/bin/env python3
"""retro.py — bir görüntüyü oyunun ekran ızgarasından geçirir: 960×720'ye indirir (2×2 ortalama gibi kutu süzgeç), kanal başına 5 bit renk ve
4×4 Bayer titremesi (%70), sonra 2× en yakın komşu büyütme. Kullanım: python -X utf8 retro.py girdi.png cikti.png [temiz.png]"""
import sys
import numpy as np
from PIL import Image
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], dtype=np.float32) / 16.0 - 0.5
src = Image.open(sys.argv[1]).convert("RGB")
if len(sys.argv) > 3:
    src.resize((1920, 1440), Image.LANCZOS).save(sys.argv[3])
kucuk = np.asarray(src.resize((960, 720), Image.BOX), dtype=np.float32) / 255.0
h, w, _ = kucuk.shape
titreme = np.tile(BAYER, (h // 4 + 1, w // 4 + 1))[:h, :w][..., None] * 0.7
q = np.clip(np.floor(kucuk * 31 + titreme + 0.5), 0, 31) / 31.0
Image.fromarray((q * 255).astype(np.uint8)).resize((1920, 1440), Image.NEAREST).save(sys.argv[2])
print("retro ok", sys.argv[2])
