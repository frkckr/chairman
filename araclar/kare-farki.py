#!/usr/bin/env python3
"""Chairman — pencerede kıpırtı ölçüsü (RK2, 2026-10-31).

Kullanıcı (31 Ekim): “odada dururken pencerenin sol kenarında ekran titriyor gibi”. Ölçüm (araştırma turu): saha boşken pencerede kareler arası değişen
piksel sıfır; antrenman sahada görünürken değişen tek şey iki üç piksellik figürler — titremenin deseninde kıpırdıyorlar. RK2'nin TEST düzeltmesi:
pencere dikdörtgeninde titreme maskesi ve uzak figürlerin sade silueti (STIL.oda.pencere.titremesiz, siluet).

Araç oyunu ?dunya=7 ile açar, TEST “Balkonda her saat antrenman”ı açar, masada kalır; pencerenin karedeki dikdörtgeninde ardışık kareler arasında
eşiği (renk toplamı > 24) geçen piksel sayısını, düzeltme kapalıyken ve açıkken ölçer. Kabul: açıkken kapalıya göre en az yarıya iner (sıfır olamaz:
figürler hareket eder). Figürlerin kendi hareketi her iki ölçümde vardır; fark titremenin ve gölgelemenin payıdır.
RK2 sonucu (2026-10-31): oran ~0,93 — değişimin çoğu figürlerin kendi hareketi; anahtarlar TEST olarak kaldı, varsayılan kapalı. Oran bilgidir;
çıkış kodu yalnız sayfa hatasında 1.
Kullanım: python -X utf8 araclar/kare-farki.py [--kare 24]   Çıkış kodu: sayfa hatasında 1."""
import asyncio
import importlib.util
import pathlib
import sys

ARAC = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(ARAC))
import kontrol  # noqa: E402

_spec = importlib.util.spec_from_file_location("akis_deneme", ARAC / "akis-deneme.py")
akis = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(akis)

OLC_JS = """async ([acik, n]) => {
  const P = STIL.oda.pencere; P.titremesiz = acik; P.siluet = acik; BALKON.uzak = !acik; balkonUzak(acik);
  await new Promise(r => setTimeout(r, 800));
  const cv = document.getElementById('view'), W = cv.width, H = cv.height, v = new THREE.Vector3();
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const x of [P.x0, P.x1]) for (const y of [P.y0, P.y1]) { v.set(x, y, -3.44).project(ODA.kamera); const gx = (v.x + 1) / 2 * W, gy = (1 - v.y) / 2 * H;
    x0 = Math.min(x0, gx); x1 = Math.max(x1, gx); y0 = Math.min(y0, gy); y1 = Math.max(y1, gy); }
  x0 = Math.max(0, Math.floor(x0) + 2); y0 = Math.max(0, Math.floor(y0) + 2); x1 = Math.min(W, Math.ceil(x1) - 2); y1 = Math.min(H, Math.ceil(y1) - 2);
  const al = () => new Promise(r => requestAnimationFrame(() => { const c = document.createElement('canvas'); c.width = x1 - x0; c.height = y1 - y0;
    const g = c.getContext('2d'); g.drawImage(cv, x0, y0, x1 - x0, y1 - y0, 0, 0, x1 - x0, y1 - y0); r(g.getImageData(0, 0, x1 - x0, y1 - y0).data); }));
  let once = await al(), top = 0;
  for (let i = 0; i < n; i++) { await new Promise(r => setTimeout(r, 90)); const d = await al();
    for (let j = 0; j < d.length; j += 4) if (Math.abs(d[j] - once[j]) + Math.abs(d[j + 1] - once[j + 1]) + Math.abs(d[j + 2] - once[j + 2]) > 24) top++;
    once = d; }
  return { degisen: top, kare: n, alan: [(x1 - x0), (y1 - y0)], maske: Array.from(postMat.uniforms.uMaske.value.toArray()).map(x => +x.toFixed(1)) };
}"""


async def ana():
    from playwright.async_api import async_playwright
    n = int(sys.argv[sys.argv.index("--kare") + 1]) if "--kare" in sys.argv else 24
    site = kontrol.kopya_hazirla(kontrol.yerel_three())
    async with async_playwright() as p:
        tr = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        pg, hatalar = await akis.oda_ac(tr, site, "?dunya=7")
        await pg.set_viewport_size({"width": 1180, "height": 1000})
        await pg.evaluate("() => { OYUN.ayarlar.herSaat = true; OYUN.ayarlar.kaydet(); }")
        await akis.oda_yenile(pg)
        await pg.wait_for_function("typeof BALKON !== 'undefined' && BALKON.antrenman && ODA.yer === 'masa'", timeout=15000)
        await pg.wait_for_timeout(1500)
        kapali = await pg.evaluate(OLC_JS, [False, n])
        acik = await pg.evaluate(OLC_JS, [True, n])
        kapali2 = await pg.evaluate(OLC_JS, [False, n])
        await pg.evaluate("() => { OYUN.ayarlar.herSaat = false; OYUN.ayarlar.kaydet(); STIL.oda.pencere.titremesiz = true; STIL.oda.pencere.siluet = true; }")
        await tr.close()
    k = (kapali["degisen"] + kapali2["degisen"]) / 2
    oran = acik["degisen"] / k if k else 0
    print(f"Pencerede kıpırtı · alan {acik['alan']} px · {n} kare aralığı")
    print(f"  düzeltme kapalı: {kapali['degisen']} ve {kapali2['degisen']} piksel değişti (ortalama {k:.0f})")
    print(f"  düzeltme açık:   {acik['degisen']} piksel değişti · maske {acik['maske']}")
    print(f"  açıkken kapalıya oranı {oran:.2f} (bilgi; RK2 hedefi ≤ 0,50 tutmadı: değişimin çoğu figürlerin hareketi)")
    if hatalar:
        print("SAYFA HATALARI:", hatalar[:5])
    sys.exit(1 if hatalar else 0)


if __name__ == "__main__":
    asyncio.run(ana())
