#!/usr/bin/env python3
"""RK3 taslakları (2026-11-01): iki dil × dört ekran (+ simge sayfası) üç genişlikte PNG ve ölçü.

Başsız Chromium'da araclar/taslak/rk/taslak.html?v=<1|2>&s=<ekran> açılır; tam sayfa görüntüsü araclar/taslak/rk/png/v<v>-<ekran>-<genişlik>.png
(palet sıkıştırmalı, küçük). Ölçü: görünen her metnin yazı boyu (gövde ≥ 15 px, en küçük ≥ 12 px) ve metin ile zemini arasındaki kontrast
(WCAG; ≥ 4,5:1; zemin, öğeden yukarı ilk opak arka plan rengi — resimli ve degrade zeminlerde yaklaşık). Okunurluk aracının (araclar/okunurluk.py)
ölçüsünün taslağa uyarlanmışı; oyun kodu değişmez.

Kullanım: python -X utf8 araclar/taslak/rk/cek.py [--genislik 640,944,1186] [--yalniz v1-mali,...]
"""
import argparse
import asyncio
import pathlib
import sys

BURA = pathlib.Path(__file__).resolve().parent
PNG = BURA / "png"
EKRANLAR = ["mali", "kart", "transfer", "gunbasi"]

OLCU_JS = """() => {
  const L = c => { const m = c.match(/[\\d.]+/g); if (!m) return null; const [r, g, b, a] = m.map(Number); return {r, g, b, a: a === undefined ? 1 : a}; };
  const lum = ({r, g, b}) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const zemin = el => { for (let e = el; e; e = e.parentElement) { const c = L(getComputedStyle(e).backgroundColor); if (c && c.a > 0.85) return c; } return {r: 251, g: 247, b: 238, a: 1}; };
  const sonuc = [], kagit = document.querySelector('.kagit');
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const t = n.textContent.trim(); if (!t) continue; const el = n.parentElement; if (!el || el.closest('svg')) continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const s = getComputedStyle(el), boy = parseFloat(s.fontSize), c = L(s.color), z = zemin(el);
    const a = lum(c), b = lum(z), oran = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    sonuc.push({t: t.slice(0, 40), boy, oran: Math.round(oran * 100) / 100, kagitta: !!(kagit && kagit.contains(el)), sinif: el.className || el.tagName});
  }
  return sonuc; }"""


async def ana():
    ap = argparse.ArgumentParser()
    ap.add_argument("--genislik", default="640,944,1186")
    ap.add_argument("--yalniz", default="")
    a = ap.parse_args()
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright bulunamadı.")
    from PIL import Image
    PNG.mkdir(exist_ok=True)
    isler = [(v, s) for v in (1, 2) for s in EKRANLAR] + [(1, "simge")]
    if a.yalniz:
        sec = set(a.yalniz.split(","))
        isler = [(v, s) for v, s in isler if f"v{v}-{s}" in sec]
    genislikler = [int(x) for x in a.genislik.split(",")]
    hata = 0
    async with async_playwright() as p:
        t = await p.chromium.launch()
        for w in genislikler:
            for v, s in isler:
                if s == "simge" and w != 1186:
                    continue
                pg = await t.new_page(viewport={"width": w, "height": int(w * 0.75)})
                hatalar = []
                pg.on("pageerror", lambda e: hatalar.append(str(e)))
                await pg.goto((BURA / "taslak.html").as_uri() + f"?v={v}&s={s}")
                await pg.wait_for_selector(".kagit")
                await pg.evaluate("document.fonts.ready")
                await pg.wait_for_timeout(300)
                olc = await pg.evaluate(OLCU_JS)
                yol = PNG / f"v{v}-{s}-{w}.png"
                await pg.screenshot(path=str(yol), full_page=True)
                im = Image.open(yol).convert("RGB").quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
                im.save(yol, optimize=True)
                kagit = [x for x in olc if x["kagitta"]]
                kucuk = min((x["boy"] for x in olc), default=0)
                govde = sorted(x["boy"] for x in kagit)[len(kagit) // 2] if kagit else 0
                dusuk = [x for x in olc if x["oran"] < 4.5]
                kb = yol.stat().st_size // 1024
                bayrak = "!" if (kucuk < 12 or (govde < 15 and s != "simge") or dusuk or hatalar) else " "   # simge sayfası başvuru sayfasıdır (altyazılar küçük)
                if bayrak == "!":
                    hata += 1
                print(f"{bayrak} v{v}-{s:<9} {w:>5}px  gövde {govde:4.1f}  en küçük {kucuk:4.1f}  kontrast<4,5: {len(dusuk):2d}  {kb:4d} KB"
                      + (f"  · {', '.join(d['t'] + ' ' + str(d['oran']) for d in dusuk[:3])}" if dusuk else "") + (f"  · HATA {hatalar[0]}" if hatalar else ""))
                await pg.close()
        await t.close()
    print("Taslak ölçüsü:", "eşik dışı " + str(hata) if hata else "hepsi eşikte")
    return hata

if __name__ == "__main__":
    sys.exit(1 if asyncio.run(ana()) else 0)
