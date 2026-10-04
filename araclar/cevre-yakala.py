#!/usr/bin/env python3
"""Chairman — stadın çevresini görüntüleme ve ölçme aracı (yol haritası N8, 2026-10-04)

Maç sahnesini (gece) ve balkon/pencere sahnesini (gündüz) başsız Chromium'da açar; serbest kamerayla stadın dört yanını, başkanın
yerinden bakışı ve dürbünü çeker. Oyunun kare döngüsü durdurulur (requestAnimationFrame elle), Math.random tohumludur; görüntüler
oyunun kendi çizim yolundan (2× iç çizim, renk ve titreme) geçer. Başkanın ön plandaki elleri ve rafı çizilmez (çevre incelemesi içindir).

Ölçülenler:
  ufuk boşluğu   sahanın ortasından (13 m yükseklikten) dört yöne yatay bakışta, göz hizasının biraz üstündeki satırlarda gökyüzü kalan
                 sütunların payı (gökyüzü ve yıldızlar o ölçümde gizlenir, arka plan düz renge boyanır). Hedef: her yönde %0.
  maliyet        başkanın bakışında ve geniş bakışta çizim çağrısı, üçgen sayısı ve ortalama çizim süresi (ms; yazılım GPU'sunda göreli).

Kullanım:
  python3 araclar/cevre-yakala.py                # bütün görünümler
  python3 araclar/cevre-yakala.py --onek once    # değişiklikten önce (dosya adlarının başına)
  Seçenekler: --tohum N (varsayılan 3) · --tekrar N (süre ölçümünde çizim sayısı, varsayılan 20)
Çıktı: araclar/cevre/<onek><ad>.png ve araclar/cevre/<onek>olcum.json (depoya eklenmez). Hata bulunursa çıkış kodu 1.
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

CIKTI = KOK / "araclar" / "cevre"

BASLANGIC_JS = """
(() => {
  let s = %d >>> 0;
  Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let kuyruk = [], an = 1000;
  window.requestAnimationFrame = f => { kuyruk.push(f); return kuyruk.length; };
  window.cancelAnimationFrame = () => {};
  window.__kare = n => { for (let i = 0; i < n; i++) { an += 1000 / 60; const q = kuyruk; kuyruk = []; for (const f of q) f(an); } };
})();
"""

# sahne ve kamera verilip oyunun çizim yolundan geçirilir; dönen: PNG, çizim çağrısı/üçgen, isteğe bağlı ufuk ölçümü ve çizim süresi
CIZ_JS = """(o) => {
  const g = o.gunduz, S = g ? ODA.sahne : scene, kok = g ? BALKON.stat : null;
  const dunya = p => { const v = new THREE.Vector3(p[0], p[1], p[2]); return kok ? kok.localToWorld(v) : v; };
  const k = new THREE.PerspectiveCamera(o.fov, RW / RH, 0.3, 1200);
  let goz = o.goz, hedef = o.hedef;
  if (o.baskan) { goz = [BASKAN_KOLTUGU.x, BASKAN_KOLTUGU.y + 0.78, BASKAN_KOLTUGU.z]; }
  if (o.oda) { k.position.copy(ODA.kamera.position); k.quaternion.copy(ODA.kamera.quaternion); k.fov = ODA.kamera.fov; k.near = ODA.kamera.near; k.far = ODA.kamera.far; }
  else if (o.balkon) { const D = ODA.dis; k.position.copy(D.localToWorld(new THREE.Vector3(...STIL.balkon.goz))); k.lookAt(D.localToWorld(new THREE.Vector3(...STIL.balkon.bakis))); k.fov = STIL.balkon.aci; }
  else { k.position.copy(dunya(goz)); k.lookAt(dunya(hedef)); }
  k.updateProjectionMatrix(); k.updateMatrixWorld();
  if (g) ODA.dis.visible = true;
  const gok = [], arka = renderer.getClearColor(new THREE.Color()).getHex();
  const ciz = (ufuk) => {
    renderer.setRenderTarget(rt); renderer.setClearColor(ufuk ? 0xff00ff : (g ? OD.arkaPlan : STIL.ekran.arkaPlan), 1); renderer.clear(); renderer.render(S, k);
    const bilgi = { cagri: renderer.info.render.calls, ucgen: renderer.info.render.triangles };
    renderer.setRenderTarget(null); renderer.clear(); renderer.render(post, postCam); return bilgi; };
  /* ufuk ölçümü: gökyüzü küresi ve yıldızlar gizlenir (sis rengi ya da gök rengi boşluk diye sayılmaz, düz macenta sayılır) */
  let ufuk = null;
  if (o.ufuk) {
    S.traverse(m => { if ((m.isMesh && m.material && m.material.side === THREE.BackSide && m.geometry && m.geometry.type === 'SphereGeometry') || m.isPoints) { if (m.visible) { gok.push(m); m.visible = false; } } });
    ciz(true);
    const c = document.createElement('canvas'); c.width = RW; c.height = RH; const x = c.getContext('2d'); x.drawImage(document.getElementById('view'), 0, 0, RW, RH);
    const d = x.getImageData(0, 0, RW, RH).data, f = k.fov * Math.PI / 180, satir = a => Math.round(RH / 2 - Math.tan(a * Math.PI / 180) / Math.tan(f / 2) * RH / 2);
    const sonuc = {};
    for (const a of o.ufuk) { const y = satir(a); let bos = 0; for (let i = 0; i < RW; i++) { const j = (y * RW + i) * 4; if (d[j] > 200 && d[j + 1] < 60 && d[j + 2] > 200) bos++; } sonuc[a] = +(bos / RW * 100).toFixed(1); }
    ufuk = sonuc; for (const m of gok) m.visible = true;
  }
  const bilgi = ciz(false);
  const png = document.getElementById('view').toDataURL('image/png');
  let ms = null;
  if (o.tekrar) { const gl = renderer.getContext(), px = new Uint8Array(4); renderer.setRenderTarget(rt);
    const t0 = Date.now(); for (let i = 0; i < o.tekrar; i++) { renderer.render(S, k); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); }
    ms = +((Date.now() - t0) / o.tekrar).toFixed(1); renderer.setRenderTarget(null); }
  return { png, ...bilgi, ufuk, ms };
}"""

YONLER = {"dogu": [200, 13, 0], "bati": [-200, 13, 0], "kuzey": [0, 13, 200], "guney": [0, 13, -200]}
UFUK_ACILARI = [0.3, 1.0, 2.0]

GECE = [
    # dört köşeden yüksek bakış
    ("gece-kose-kd", {"goz": [115, 48, 108], "hedef": [0, 0, 0], "fov": 52}),
    ("gece-kose-kb", {"goz": [-115, 48, 108], "hedef": [0, 0, 0], "fov": 52}),
    ("gece-kose-gd", {"goz": [115, 48, -108], "hedef": [0, 0, 0], "fov": 52}),
    ("gece-kose-gb", {"goz": [-115, 48, -108], "hedef": [0, 0, 0], "fov": 52}),
    # başkanın yerinden: ölü top geniş açısı ve dürbün
    ("gece-baskan-orta", {"baskan": True, "hedef": [0, 0, 0], "fov": 36, "tekrar": True}),
    ("gece-baskan-dogu", {"baskan": True, "hedef": [52, 0, 10], "fov": 36}),
    ("gece-baskan-bati", {"baskan": True, "hedef": [-52, 0, 10], "fov": 36}),
    ("gece-baskan-karsi", {"baskan": True, "hedef": [0, 2, 34], "fov": 36}),
    ("gece-durbun-yamac", {"baskan": True, "hedef": [85, 12, 0], "fov": 9}),
    ("gece-durbun-evler", {"baskan": True, "hedef": [0, 6, 85], "fov": 9}),
    ("gece-durbun-kapi", {"baskan": True, "hedef": [-76, 4, 0], "fov": 9}),
    ("gece-genis", {"goz": [0, 110, -170], "hedef": [0, 0, 20], "fov": 60, "tekrar": True}),
    # ana tribünün arkası (başkanın yerinden görünmez): sahadan kulüp binasına, binanın arkasından sokağa
    ("gece-bina-on", {"goz": [0, 14, 10], "hedef": [0, 8, -60], "fov": 40}),
    ("gece-bina-arka", {"goz": [-30, 9, -110], "hedef": [0, 6, -62], "fov": 45}),
] + [(f"gece-ufuk-{ad}", {"goz": [0, 13, 0], "hedef": h, "fov": 70, "ufuk": UFUK_ACILARI}) for ad, h in YONLER.items()]

GUNDUZ = [
    ("gunduz-pencere", {"oda": True}),
    ("gunduz-balkon", {"balkon": True, "tekrar": True}),
    ("gunduz-kose-kd", {"goz": [115, 48, 108], "hedef": [0, 0, 0], "fov": 52}),
    ("gunduz-kose-kb", {"goz": [-115, 48, 108], "hedef": [0, 0, 0], "fov": 52}),
] + [(f"gunduz-ufuk-{ad}", {"goz": [0, 13, 0], "hedef": h, "fov": 70, "ufuk": UFUK_ACILARI}) for ad, h in YONLER.items() if ad != "guney"]


async def sayfa_ac(tarayici, site, sorgu, bekle, tohum):
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script(BASLANGIC_JS % tohum)
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
    await pg.goto((site / "index.html").as_uri() + sorgu)
    await pg.wait_for_selector(bekle, timeout=30000)
    await pg.evaluate("__kare(3)")
    return pg, hatalar


async def ana():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--onek", default="")
    ap.add_argument("--tohum", type=int, default=3)
    ap.add_argument("--tekrar", type=int, default=20)
    a = ap.parse_args()
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright==1.56.0")
    CIKTI.mkdir(parents=True, exist_ok=True)
    site = kopya_hazirla(yerel_three())
    olcum, hata = {}, []
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for sorgu, bekle, liste, gunduz in ((f"?ekran=mac&tohum={a.tohum}", "#btnMacaGec", GECE, False),
                                            ("?dunya=7", "#oda:not([hidden]) .od-ana", GUNDUZ, True)):
            pg, h = await sayfa_ac(tarayici, site, sorgu, bekle, a.tohum)
            if gunduz:
                await pg.evaluate("() => { if (typeof balkonDurum === 'function') balkonDurum({ antrenman: false, dakika: 13 * 60 }); }")
            for ad, o in liste:
                o = dict(o, gunduz=gunduz, tekrar=a.tekrar if o.get("tekrar") else 0)
                r = await pg.evaluate(CIZ_JS, o)
                (CIKTI / f"{a.onek}{ad}.png").write_bytes(base64.b64decode(r.pop("png").split(",", 1)[1]))
                olcum[ad] = r
                ek = (f" · ufuk boşluğu {r['ufuk']}" if r["ufuk"] else "") + (f" · {r['ms']} ms/çizim" if r["ms"] is not None else "")
                print(f"  {ad}: {r['cagri']} çağrı, {r['ucgen']} üçgen{ek}")
            hata += h
            await pg.context.close()
        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    bos = {ad: r["ufuk"] for ad, r in olcum.items() if r["ufuk"] and any(v > 0 for v in r["ufuk"].values())}
    (CIKTI / f"{a.onek}olcum.json").write_text(json.dumps(olcum, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Ufukta boşluk kalan yön: {len(bos)}" + (f" — {bos}" if bos else ""))
    for x in hata:
        print("  - " + x)
    print(f"Görüntüler: araclar/cevre/{a.onek}*.png")
    sys.exit(1 if hata else 0)


if __name__ == "__main__":
    asyncio.run(ana())
