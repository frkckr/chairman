#!/usr/bin/env python3
"""Chairman — oda yürüyüşü film şeridi ve hareket ölçümü (yol haritası N6, 2026-10-04)

Başkan odasını başsız Chromium'da elle ilerleyen kare saatiyle açar, odadan balkona (ve geri) yürüyüşü oynatır:
  - film şeridi: yürüyüşün evrelerinden 12 kare tek PNG'de (araclar/anlar/<onek>yuruyus-<hedef>.png)
  - ölçüm: gözün her karedeki konumundan hız ve ivme; en büyük ivme ve kareler arası en büyük hız sıçraması (ani hareket yok mu?),
    kalkış ve oturma süreleri, adım sayısı, adımdaki dikey ve yanal salınım (araclar/anlar/<onek>yuruyus-<hedef>.json)

Kullanım:
  python araclar/yuruyus-yakala.py                 # balkona gidiş ve masaya dönüş
  python araclar/yuruyus-yakala.py --hedef balkon  # yalnız gidiş
  Seçenek: --onek AD (dosya adlarının başına; önce/sonra karşılaştırması)
"""
import argparse
import asyncio
import base64
import json
import pathlib
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from kontrol import KOK, yerel_three, kopya_hazirla  # noqa: E402

CIKTI = KOK / "araclar" / "anlar"

SAAT_JS = """(() => { let kuyruk = [], an = 1000; window.requestAnimationFrame = f => { kuyruk.push(f); return kuyruk.length; }; window.cancelAnimationFrame = () => {};
  performance.now = () => an; window.__kare = n => { for (let i = 0; i < n; i++) { an += 1000 / 60; const q = kuyruk; kuyruk = []; for (const f of q) f(an); } }; })();"""

# yürüyüşü kare kare oynatır: her karede göz konumu; seçilen karelerde görüntü şeride çizilir (4 × 3 hücre)
OYNAT_JS = """(hedef) => {
  if (hedef === 'masa') { odaYerAyarla('balkon'); __kare(3); }
  odaYuru(hedef); const Y = ODA.yol, toplam = Y.toplam, N = Math.ceil(toplam * 60) + 2, iz = [];
  const E = Y.E || { yonel: OD.adim.yonel, kalk: OD.adim.kalk, yuru: Y.yuru, otur: OD.adim.otur };
  /* evre sınırları (sn) ve şerit anları */
  const sira = ['al', 'yonel', 'kalk', 'yuru', 'otur', 'koy'].filter(a => E[a] != null), bas = {}; let t0 = 0; for (const a of sira) { bas[a] = t0; t0 += E[a]; }
  const an = (a, u) => bas[a] != null ? bas[a] + E[a] * u : null;
  const anlar = [an('al', 0.45), an('al', 0.8), an('kalk', 0.3), an('kalk', 0.7), an('yuru', 0.1), an('yuru', 0.4), an('yuru', 0.75), an('otur', 0.2), an('otur', 0.55), an('otur', 0.9), an('koy', 0.45), an('koy', 0.85)]
    .map((t, i) => t == null ? toplam * (i + 0.5) / 12 : t).sort((a, b) => a - b);
  const view = document.getElementById('view'), W = 480, H = 360, cv = document.createElement('canvas'); cv.width = W * 4; cv.height = H * 3; const g = cv.getContext('2d');
  let k = 0, bitti = null;
  for (let i = 0; i < N; i++) {
    __kare(1); const p = ODA.kamera.position, t = ODA.yol ? ODA.yol.t : toplam;
    iz.push([t, p.x, p.y, p.z, ODA.yer]);
    while (k < anlar.length && t >= anlar[k] - 1e-6) { const x = (k % 4) * W, y = Math.floor(k / 4) * H; g.drawImage(view, x, y, W, H);
      g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(x, y, 96, 22); g.fillStyle = '#fff'; g.font = '14px monospace'; g.fillText(t.toFixed(2) + ' sn', x + 6, y + 16); k++; }
    if (!ODA.yol && bitti == null) { bitti = i; break; }
  }
  return { png: cv.toDataURL('image/png'), iz, toplam, E, sira, yer: ODA.yer, telefon: ODA.nesneler.telefon.g.visible, el: ODA.el ? ODA.el.g.visible : null };
}"""


def olc(v):
    """Göz izinden hız, ivme ve adım ölçüleri."""
    iz = [r for r in v["iz"] if r[4] == "yolda"]
    dt = 1 / 60
    hiz = [((iz[i][1] - iz[i - 1][1]) ** 2 + (iz[i][2] - iz[i - 1][2]) ** 2 + (iz[i][3] - iz[i - 1][3]) ** 2) ** 0.5 / dt for i in range(1, len(iz))]
    vek = [[(iz[i][j] - iz[i - 1][j]) / dt for j in (1, 2, 3)] for i in range(1, len(iz))]
    ivme = [sum((vek[i][j] - vek[i - 1][j]) ** 2 for j in range(3)) ** 0.5 / dt for i in range(1, len(vek))]
    E, sira = v["E"], v["sira"]
    bas, t0 = {}, 0
    for a in sira:
        bas[a] = t0
        t0 += E[a]
    yuru = [r for r in iz if bas["yuru"] + 0.4 <= r[0] <= bas["yuru"] + E["yuru"] - 0.4]
    ys = [r[2] for r in yuru]
    # adım sayısı: yürürken dikey konumun yerel en yüksek noktaları
    tepe = sum(1 for i in range(1, len(ys) - 1) if ys[i] > ys[i - 1] and ys[i] >= ys[i + 1] and ys[i] - min(ys) > 0.25 * (max(ys) - min(ys)))
    # en büyük ivmenin anı ve evresi (nerede sarsılıyor?)
    im = max(range(len(ivme)), key=lambda i: ivme[i])
    tm = iz[im + 2][0]
    evre = next((a for a in reversed(sira) if tm >= bas[a]), sira[0])
    return {"toplamSn": round(v["toplam"], 2), "enBuyukIvmeAni": [round(tm, 2), evre], "evreler": {a: round(E[a], 2) for a in sira}, "enHizliMsn": round(max(hiz), 2),
            "enBuyukIvme": round(max(ivme), 2), "ivme99": round(sorted(ivme)[int(len(ivme) * 0.99)], 2),
            "enBuyukHizSicramasi": round(max(abs(hiz[i] - hiz[i - 1]) for i in range(1, len(hiz))), 3),
            "adimSayisi": tepe, "adimDikeyCm": round((max(ys) - min(ys)) * 100, 1) if ys else 0,
            "bitisYeri": v["yer"], "telefonGorunur": v["telefon"], "elGorunur": v["el"]}


async def ana():
    ap = argparse.ArgumentParser(description="Chairman oda yürüyüşü film şeridi ve hareket ölçümü")
    ap.add_argument("--hedef", choices=["balkon", "masa", "ikisi"], default="ikisi")
    ap.add_argument("--onek", default="")
    a = ap.parse_args()
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright==1.56.0")
    site = kopya_hazirla(yerel_three())
    hata = 0
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for hedef in (["balkon", "masa"] if a.hedef == "ikisi" else [a.hedef]):
            baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
            await baglam.add_init_script(SAAT_JS)
            pg = await baglam.new_page()
            hatalar = []
            pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
            pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
            await pg.goto((site / "index.html").as_uri() + "?dunya=7")
            await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=30000)
            await pg.evaluate("__kare(5)")
            v = await pg.evaluate(OYNAT_JS, hedef)
            CIKTI.mkdir(parents=True, exist_ok=True)
            yol = CIKTI / f"{a.onek}yuruyus-{hedef}.png"
            yol.write_bytes(base64.b64decode(v["png"].split(",", 1)[1]))
            o = olc(v)
            o["hatalar"] = hatalar
            (CIKTI / f"{a.onek}yuruyus-{hedef}.json").write_text(json.dumps(o, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"{hedef}: {yol.relative_to(KOK)} · {o['toplamSn']} sn · evreler {o['evreler']} · en hızlı {o['enHizliMsn']} m/sn · en büyük ivme {o['enBuyukIvme']} m/sn² ({o['enBuyukIvmeAni'][1]} evresi, {o['enBuyukIvmeAni'][0]}. sn; %99: {o['ivme99']})"
                  f" · kareler arası en büyük hız sıçraması {o['enBuyukHizSicramasi']} m/sn · {o['adimSayisi']} adım, dikey {o['adimDikeyCm']} cm · bitiş {o['bitisYeri']}"
                  + (f" · {len(hatalar)} hata" if hatalar else ""))
            for x in hatalar:
                print("  - " + x)
            hata += len(hatalar)
            await baglam.close()
        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    sys.exit(1 if hata else 0)


if __name__ == "__main__":
    asyncio.run(ana())
