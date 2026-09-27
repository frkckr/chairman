#!/usr/bin/env python3
"""Demirkapı '99 — hızlı kontrol aracı

Sayfayı başsız Chromium'da açar, hataları listeler ve ekran görüntüsü alır.

Kullanım:
  python3 araclar/kontrol.py                     # index.html
  python3 araclar/kontrol.py prototipler/1-retro-2b-baskan-locasi.html

Çıktı: araclar/son-kontrol-<sayfa>.png (depoya eklenmez).
Three.js cdnjs yerine npm'den indirilen yerel kopyadan yüklenir; depodaki dosyalar değişmez.
Hata bulunursa çıkış kodu 1 olur.
"""
import asyncio
import pathlib
import shutil
import subprocess
import sys
import tempfile
from urllib.parse import urlparse

KOK = pathlib.Path(__file__).resolve().parent.parent
ARAC = KOK / "araclar"
ONBELLEK = ARAC / ".onbellek"
CDN_THREE = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
DIS_KAYNAK = ("fonts.googleapis.com", "fonts.gstatic.com")  # bulut ortamında erişilemeyebilir; hata sayılmaz
BEKLE_MS = 6000


def yerel_three():
    hedef = ONBELLEK / "package" / "build" / "three.min.js"
    if not hedef.exists():
        ONBELLEK.mkdir(parents=True, exist_ok=True)
        subprocess.run(["npm", "pack", "three@0.128.0", "--silent"], cwd=ONBELLEK, check=True, stdout=subprocess.DEVNULL)
        subprocess.run(["tar", "-xzf", "three-0.128.0.tgz", "package/build/three.min.js"], cwd=ONBELLEK, check=True)
    return hedef


def kopya_hazirla(three):
    gecici = pathlib.Path(tempfile.mkdtemp(prefix="demirkapi-"))
    site = gecici / "site"
    shutil.copytree(KOK, site, ignore=shutil.ignore_patterns(".git", ".onbellek", "son-kontrol-*.png"))
    for html in site.rglob("*.html"):
        metin = html.read_text(encoding="utf-8")
        if CDN_THREE in metin:
            html.write_text(metin.replace(CDN_THREE, three.as_uri()), encoding="utf-8")
    return site


async def kontrol_et(tarayici, site, sayfa):
    hatalar = []
    pg = await tarayici.new_page(viewport={"width": 1180, "height": 1000})
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text)
          if m.type == "error" and "Failed to load resource" not in m.text else None)

    def istek_basarisiz(istek):
        host = urlparse(istek.url).hostname or ""
        if not host.endswith(DIS_KAYNAK):
            hatalar.append("Yüklenemedi: " + istek.url)

    pg.on("requestfailed", istek_basarisiz)
    await pg.goto((site / sayfa).as_uri())
    await pg.wait_for_timeout(BEKLE_MS)
    goruntu = ARAC / f"son-kontrol-{pathlib.Path(sayfa).stem}.png"
    await pg.screenshot(path=str(goruntu))
    await pg.close()
    return hatalar, goruntu


async def ana():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright && python3 -m playwright install chromium")
    sayfalar = sys.argv[1:] or ["index.html"]
    site = kopya_hazirla(yerel_three())
    toplam = 0
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(
            args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for sayfa in sayfalar:
            hatalar, goruntu = await kontrol_et(tarayici, site, sayfa)
            toplam += len(hatalar)
            print(f"{sayfa}: {'hata yok' if not hatalar else str(len(hatalar)) + ' hata'}")
            for h in hatalar:
                print("  - " + h)
            print(f"  Ekran görüntüsü: {goruntu.relative_to(KOK)}")
        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    sys.exit(1 if toplam else 0)


if __name__ == "__main__":
    asyncio.run(ana())
