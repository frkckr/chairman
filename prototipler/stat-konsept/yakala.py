#!/usr/bin/env python3
"""prototipler/stat-konsept/yakala.py — konsept sayfalarının tepeden görüntüsünü başsız Chromium'da alır (2026-10-25).

Kullanım:
  python -X utf8 prototipler/stat-konsept/yakala.py            # dört konsept × üç kademe, gündüz
  python -X utf8 prototipler/stat-konsept/yakala.py k=1 asama=2 gece=1   # tek görüntü (parametreler sayfaya geçer)
  python -X utf8 prototipler/stat-konsept/yakala.py --hepsi    # kademeler + gece
Çıktı: prototipler/stat-konsept/cikti/k<K>-a<A>[-gece].png (1920×1440). Three.js araclar/kontrol.py'nin yerel kopyasından yüklenir.
"""
import asyncio
import pathlib
import sys

KOK = pathlib.Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(KOK / "araclar"))
from kontrol import yerel_three, CDN_THREE  # noqa: E402

BURADA = pathlib.Path(__file__).resolve().parent
CIKTI = BURADA / "cikti"
W, H = 1920, 1440


async def yakala(tarayici, three, sorgu, ad):
    hatalar = []
    p = dict(a.split("=", 1) for a in sorgu.split("&") if "=" in a)
    sayfa = "gercekci.html" if p.get("sayfa") == "gercekci" else "index.html"
    W, H = int(p.get("w", 1920)), int(p.get("h", 1440))
    pg = await tarayici.new_page(viewport={"width": W, "height": H})
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" else None)
    await pg.route(CDN_THREE, lambda route: route.fulfill(path=str(three), content_type="application/javascript"))
    await pg.goto((BURADA / sayfa).as_uri() + "?" + sorgu + f"&w={W}&h={H}")
    try:
        await pg.wait_for_function("window.__hazir === true", timeout=600000)
    except Exception as e:  # noqa: BLE001
        hatalar.append("Hazır olmadı: " + str(e))
    CIKTI.mkdir(exist_ok=True)
    yol = CIKTI / f"{ad}.png"
    if await pg.locator("#out").count():
        await pg.locator("#out").screenshot(path=str(yol))
    else:
        await pg.screenshot(path=str(yol), clip={"x": 0, "y": 0, "width": W, "height": H})
    bilgi = await pg.evaluate("document.getElementById('bilgi').textContent")
    await pg.close()
    return hatalar, yol, bilgi


async def ana():
    from playwright.async_api import async_playwright
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    isler = []
    if args:
        p = dict(a.split("=", 1) for a in args)
        if p.get("sayfa") == "gercekci":
            ad = f"gercekci-a{p.get('asama', '1')}" + ("-derinlik" if p.get("derinlik") == "1" else "") + ("-retro" if p.get("son") == "retro" else "") + ("-aksam" if p.get("saat") == "aksam" else "")
        else:
            ad = f"k{p.get('k', '1')}-a{p.get('asama', '0')}" + ("-gece" if p.get("gece") == "1" else "")
        isler.append(("&".join(args), ad))
    else:
        hepsi = "--hepsi" in sys.argv
        for k in (1, 2, 3, 4):
            for a in (0, 1, 2):
                isler.append((f"k={k}&asama={a}", f"k{k}-a{a}"))
            if hepsi:
                isler.append((f"k={k}&asama=0&gece=1", f"k{k}-a0-gece"))
    three = yerel_three()
    toplam = 0
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for sorgu, ad in isler:
            hatalar, yol, bilgi = await yakala(tarayici, three, sorgu, ad)
            toplam += len(hatalar)
            print(f"{ad}: {bilgi or '-'} → {yol.relative_to(KOK)}" + (f"  ({len(hatalar)} hata)" if hatalar else ""))
            for h in hatalar:
                print("   - " + h)
        await tarayici.close()
    sys.exit(1 if toplam else 0)


if __name__ == "__main__":
    asyncio.run(ana())
