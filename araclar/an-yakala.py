#!/usr/bin/env python3
"""Chairman — maç anı yakalama aracı (2026-10-03, maç motoru güncellemesi Faz 0)

Maçı başsız Chromium'da tohumlu ve sanal saatle oynatır, istenen anı başkanın gözünden (640×480 iç çözünürlükte) PNG olarak kaydeder.
Görüntüler tekrarlanabilir: Math.random tohumludur, requestAnimationFrame elle ilerletilir (her kare 1/60 sn).

Kullanım:
  python3 araclar/an-yakala.py santra korner sut            # hazır anlar
  python3 araclar/an-yakala.py --hepsi                      # bütün hazır anlar
  python3 araclar/an-yakala.py --kosul "mac.ball.x>40" --ad sag   # kendi koşulun (JS ifadesi; mac, __son(ad,sn) kullanılabilir)
  Seçenekler: --tohum N (varsayılan 3) · --bino (dürbünle) · --kare N --aralik S (film şeridi: N kare, S sn arayla)
              --sonra S (koşuldan S sn sonra çek) · --yakin top|<forma no> (yalnız geliştirme: kamera o noktaya yakından bakar, KAMERA_ZORLA)
              --onek AD (dosya adlarının başına; ör. once/sonra karşılaştırması) · --en-cok S (koşul için en çok oyun süresi, varsayılan 900)
              --js "<ifade>" (sayfa yüklenince çalışır; ör. bir STIL ayarını açıp kapatmak: --js "STIL.okunurluk.disCizgi=true")
Çıktı: araclar/anlar/<onek><ad>.png ve .json (topun ekrandaki yeri ve boyu (topPx gerçek, topCizimPx asgari boya büyütülmüş çizim), oyuncuların
piksel boyu, görüş açısı, aşama). --bino dürbünü anında açar: bakış ve görüş açısı geçişsiz oturur (kameraOturt). Depoya eklenmez.
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

# hazır anlar: (koşul, sonra sn, ön koşul: 'mac' maça geç / 'oncesi' maç öncesinde kal)
HAZIR = {
    "santra": ("mac.phase==='play'&&mac.phaseT>1.2", 0, "mac"),
    "orta-saha": ("mac.phase==='play'&&mac.ball.sahip&&Math.abs(mac.ball.x)<12&&mac.t>20", 0, "mac"),
    "korner": ("mac.phase==='durus'&&mac.durus.tur==='korner'&&mac.durus.asama==='hazir'", 0.3, "mac"),
    "sut": ("__son('shot',0.05)", 0.12, "mac"),
    "kafa": ("__son('header',0.05)", 0, "mac"),
    "faul": ("__son('faul',0.05)||__son('avantaj',0.05)", 0.25, "mac"),
    "dusus": ("mac.players.some(p=>p.oyunda&&p.eylem&&p.eylem.ad==='yerde')", 0, "mac"),
    "mudahale": ("mac.players.some(p=>p.oyunda&&p.eylem&&(p.eylem.ad==='kayma'||p.eylem.ad==='mudahale')&&p.eylem.t>0.12)", 0, "mac"),
    "penalti": ("mac.phase==='durus'&&mac.durus.tur==='penalti'&&mac.durus.asama==='hazir'", 0.5, "mac"),
    "kurtaris": ("__son('save',0.05)", 0.1, "mac"),
    "gol": ("__son('goal',0.05)", 0.6, "mac"),
    "uzun-top": ("__son('pass',0.05,v=>v.long)", 0.5, "mac"),
    "sol-ceza": ("mac.phase==='play'&&mac.ball.x<-38&&Math.abs(mac.ball.z-34)<18", 0, "mac"),
    "sag-ceza": ("mac.phase==='play'&&mac.ball.x>38&&Math.abs(mac.ball.z-34)<18", 0, "mac"),
    "uzak-kenar": ("mac.phase==='play'&&mac.ball.z>60&&Math.abs(mac.ball.x)<35", 0, "mac"),
    "yakin-kenar": ("mac.phase==='play'&&mac.ball.z<8&&Math.abs(mac.ball.x)<35", 0, "mac"),
    "tac": ("mac.phase==='durus'&&mac.durus.tur==='tac'&&mac.durus.asama==='hazir'", 0.2, "mac"),
    "toren": ("mac.phase==='toren'&&mac.phaseT>3", 0, "oncesi"),
    "sevinc": ("mac.players.some(p=>p.oyunda&&p.sevinc)", 1.0, "mac"),
    "kalkis": ("mac.players.some(p=>p.oyunda&&p.eylem&&p.eylem.ad==='kalkis'&&p.eylem.t>0.2)", 0, "mac"),
    "ucus": ("mac.players.some(p=>p.oyunda&&p.eylem&&p.eylem.ad==='ucus'&&p.eylem.t>0.15)", 0, "mac"),
    # sözleşmedeki yeni durumlar (TEKNIK_PLAN §8): ilgili akış birleşene kadar gerçekleşmez
    "omuz": ("mac.players.some(p=>p.oyunda&&p.eylem&&p.eylem.ad==='omuz')", 0.1, "mac"),
    "sendele": ("mac.players.some(p=>p.oyunda&&p.eylem&&p.eylem.ad==='sendele')", 0.1, "mac"),
    "jokey": ("mac.players.some(p=>p.oyunda&&p.tavir==='jokey')&&mac.ball.sahip", 0.3, "mac"),
    "tek-vurus": ("mac.players.some(p=>p.oyunda&&p.eylem&&p.eylem.ad==='vurus'&&p.eylem.tekDokunus&&p.eylem.faz==='takip')", 0, "mac"),
    "kapan": ("mac.players.some(p=>p.oyunda&&p.eylem&&p.eylem.ad==='kapan')", 0.1, "mac"),
}
VARSAYILAN_SET = ["santra", "orta-saha", "korner", "sut", "faul", "sol-ceza", "uzak-kenar", "yakin-kenar"]

BASLANGIC_JS = """
(() => {
  /* tohumlu Math.random (mulberry32) */
  let s = %d >>> 0;
  Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  /* elle ilerleyen kare saati */
  let kuyruk = [], an = 1000;
  window.requestAnimationFrame = f => { kuyruk.push(f); return kuyruk.length; };
  window.cancelAnimationFrame = () => {};
  performance.now = () => an;
  window.__kare = n => { for (let i = 0; i < n; i++) { an += 1000 / 60; const q = kuyruk; kuyruk = []; for (const f of q) f(an); } };
  window.__olaylar = [];
})();
"""

KUR_JS = """() => {
  /* olayları kaydet (mac-sahnesi.js'teki olay işlevini sar) */
  const asil = window.olay;
  window.olay = (ad, v) => { __olaylar.push([ad, mac.t, v]); if (__olaylar.length > 400) __olaylar.splice(0, 200); return asil(ad, v); };
  window.__son = (ad, sn, f) => { for (let i = __olaylar.length - 1; i >= 0; i--) { const o = __olaylar[i]; if (mac.t - o[1] > sn) return false; if (o[0] === ad && (!f || f(o[2] || {}))) return true; } return false; };
  /* görüntüsüz ileri sarma: motor ve sahne (bakış dahil) ilerler, çizim yok */
  window.__ileri = (kosul, enCok) => { const f = new Function('return (' + kosul + ')'); let n = 0, N = Math.round(enCok * 60);
    while (n < N) { macKare(1 / 60); n++; if (f()) return { tamam: true, n }; } return { tamam: false, n }; };
  window.__ileriSure = sn => { for (let i = 0, N = Math.round(sn * 60); i < N; i++) macKare(1 / 60); };
}"""

OLCU_JS = """() => {
  const H = 480, W = 640, f = camera.fov * Math.PI / 180, b = mac.ball, v = new THREE.Vector3();
  const piksel = (x, y, z, r) => { v.set(x, y, z); const d = v.distanceTo(camera.position); return 2 * r * (H / 2) / (d * Math.tan(f / 2)); };
  v.set(b.x, b.y + (typeof TOP_R !== 'undefined' ? TOP_R : 0.14), b.z - 34).project(camera);
  const topNdc = { x: +v.x.toFixed(3), y: +v.y.toFixed(3) }, topPx = +piksel(b.x, b.y, b.z - 34, typeof TOP_R !== 'undefined' ? TOP_R : 0.14).toFixed(2);
  const boylar = [];
  for (const a of AKTORLER) { const p = a.kaynak; if (!p || p.tur !== 'oyuncu' || !p.oyunda || !a.m.root.visible) continue;
    const ay = new THREE.Vector3(a.x, 0, a.z).project(camera), bas = new THREE.Vector3(a.x, 1.8 * (p.boy || 1), a.z).project(camera);
    if (Math.abs(ay.x) > 1 || Math.abs(ay.y) > 1) continue; boylar.push(Math.abs(bas.y - ay.y) / 2 * H); }
  boylar.sort((x, y) => x - y);
  const yakin = mac.players.filter(p => p.oyunda && p.eylem).map(p => ({ no: p.no, takim: p.team, eylem: p.eylem.ad, x: +p.x.toFixed(1), z: +p.z.toFixed(1) }))
    .filter(o => Math.hypot(o.x - b.x, o.z - b.z) < 12);
  const topCizimPx = +(topPx * (typeof topMesh !== 'undefined' ? topMesh.scale.x : 1)).toFixed(2);
  return { faz: mac.phase, dakika: mac.minuteLabel(), t: +mac.t.toFixed(2), skor: mac.score.join('-'), fov: camera.fov, bino: typeof bino !== 'undefined' && bino,
    top: { x: +b.x.toFixed(2), y: +b.y.toFixed(2), z: +b.z.toFixed(2) }, topNdc, topPx, topCizimPx,
    oyuncuPx: { ortanca: boylar.length ? +boylar[boylar.length >> 1].toFixed(1) : null, enAz: boylar.length ? +boylar[0].toFixed(1) : null, sayi: boylar.length }, yakin };
}"""

# görünümü (3B + HUD maskesi) tek tuvale bas; şerit için yan yana
CIZ_JS = """(o) => {
  const v = document.getElementById('view'), h = document.getElementById('hud');
  let c = window.__serit;
  if (!c || o.yeni) { c = window.__serit = document.createElement('canvas'); const sut = Math.min(o.adet, 4); c.width = 640 * sut; c.height = 480 * Math.ceil(o.adet / sut); }
  const g = c.getContext('2d'), sut = Math.min(o.adet, 4), x = (o.i % sut) * 640, y = Math.floor(o.i / sut) * 480;
  g.imageSmoothingEnabled = false; g.drawImage(v, x, y, 640, 480); g.drawImage(h, x, y, 640, 480);
  return o.son ? c.toDataURL('image/png') : null;
}"""


async def yakala(tarayici, site, ad, kosul, sonra, on, a):
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script(BASLANGIC_JS % a.tohum)
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
    await pg.goto((site / "index.html").as_uri() + f"?ekran=mac&tohum={a.tohum}")
    await pg.wait_for_selector("#btnMacaGec", timeout=30000)
    await pg.evaluate("__kare(2)")
    await pg.evaluate(KUR_JS)
    if a.js:
        await pg.evaluate("(k) => { new Function(k)(); }", a.js)
    if on == "mac":
        await pg.evaluate("macaGecIste(); document.getElementById('btnMacaGec').hidden = true;")
    if a.yakin:
        hedef = "mac.ball" if a.yakin == "top" else f"mac.players.find(p=>p.no=={int(a.yakin)}&&p.oyunda)"
        await pg.evaluate(f"window.KAMERA_ZORLA = {{ get hedef() {{ const t = {hedef}; return t ? {{ x: t.x, y: 1, z: t.z - 34 }} : {{ x: 0, y: 1, z: 0 }}; }}, fov: 14 }}")
    s = await pg.evaluate("([k, n]) => __ileri(k, n)", [kosul, a.en_cok])
    if not s["tamam"]:
        print(f"{ad}: koşul {a.en_cok} oyun saniyesinde gerçekleşmedi ({kosul})")
        await baglam.close()
        return False, hatalar
    if sonra:
        await pg.evaluate(f"__ileriSure({sonra})")
    if a.bino:
        await pg.evaluate("bino = true; if (typeof BASKAN !== 'undefined') { BASKAN.eylem = null; BASKAN.durbunAcik = true; } if (typeof kameraOturt === 'function') kameraOturt();")
    # birkaç tam kare: çizim, eller ve sahne güncellensin
    await pg.evaluate("__kare(3)")
    adet = max(1, a.kare)
    veri = None
    olcu = None
    for i in range(adet):
        if i:
            await pg.evaluate(f"__kare({max(1, round(a.aralik * 60))})")
        if i == 0:
            olcu = await pg.evaluate(OLCU_JS)
        veri = await pg.evaluate(CIZ_JS, {"i": i, "adet": adet, "yeni": i == 0, "son": i == adet - 1})
    CIKTI.mkdir(parents=True, exist_ok=True)
    yol = CIKTI / f"{a.onek}{ad}.png"
    yol.write_bytes(base64.b64decode(veri.split(",", 1)[1]))
    olcu.update({"ad": ad, "tohum": a.tohum, "kosul": kosul, "kare": adet, "hatalar": hatalar})
    (CIKTI / f"{a.onek}{ad}.json").write_text(json.dumps(olcu, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{ad}: {yol.relative_to(KOK)} · faz {olcu['faz']} {olcu['dakika']}' · top ekranda {olcu['topNdc']} ({olcu['topPx']} px, çizimde {olcu['topCizimPx']} px) · oyuncu boyu ortanca {olcu['oyuncuPx']['ortanca']} px, en az {olcu['oyuncuPx']['enAz']} px · fov {olcu['fov']}"
          + (f" · {len(hatalar)} hata" if hatalar else ""))
    await baglam.close()
    return True, hatalar


async def ana():
    ap = argparse.ArgumentParser(description="Chairman maç anı yakalama")
    ap.add_argument("anlar", nargs="*")
    ap.add_argument("--hepsi", action="store_true")
    ap.add_argument("--kosul")
    ap.add_argument("--ad", default="ozel")
    ap.add_argument("--tohum", type=int, default=3)
    ap.add_argument("--bino", action="store_true")
    ap.add_argument("--kare", type=int, default=1)
    ap.add_argument("--aralik", type=float, default=0.1)
    ap.add_argument("--sonra", type=float, default=None)
    ap.add_argument("--yakin")
    ap.add_argument("--onek", default="")
    ap.add_argument("--en-cok", dest="en_cok", type=float, default=900)
    ap.add_argument("--js")
    a = ap.parse_args()
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright==1.56.0")
    isler = []
    if a.kosul:
        isler.append((a.ad, a.kosul, a.sonra or 0, "mac"))
    secim = list(HAZIR) if a.hepsi else (a.anlar or ([] if a.kosul else VARSAYILAN_SET))
    for ad in secim:
        if ad not in HAZIR:
            sys.exit(f"Bilinmeyen an: {ad}. Hazır anlar: {', '.join(HAZIR)}")
        k, s, on = HAZIR[ad]
        isler.append((ad, k, a.sonra if a.sonra is not None else s, on))
    site = kopya_hazirla(yerel_three())
    toplam_hata = 0
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for ad, k, s, on in isler:
            _, h = await yakala(tarayici, site, ad, k, s, on, a)
            toplam_hata += len(h)
            for x in h:
                print("  - " + x)
        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    sys.exit(1 if toplam_hata else 0)


if __name__ == "__main__":
    asyncio.run(ana())
