"""2D maç görünümünün akış ve görüntü denetimi (P2, 2026-10-21 gece; kullanıcı kararı: maç tepeden 2D izlenir).

Kullanım (depo kökünden):  python -I -X utf8 araclar/akis-2d.py
araclar/akis-deneme.py figürlü loca bakışını (?pul=0) sınar; bu araç 2D varsayılanı sınar:
  1. Maç öncesi ekranından "Maça geç": locaya giriş sahnesi başlamaz, kamera tepede, pullar açık; rakip başkan varsa karar anı 2D üstünde
     kart olarak açılır (telefon kilitli), seçim MAC_PROTOKOL.karar'a yazılır, sayfa serbest kalır.
  2. Karar anı açılmadan "Santraya geç": karar anı hemen açılır, seçimden sonra ısınma biter.
  3. Rakip başkan yokken karar anı açılmaz.
  4. ?pul=0: figürlü loca bakışı ve eski giriş sahnesi.
  5. Ayar göçü: P1'in pul anahtarı düşer, 2D açılır; G tuşu loca bakışına geçer ve locaBakisi yazar; yenilemede korunur.
  6. Görüntü (oyunda): görünür pul ≥ 25, figür malzemesi çizilmiyor, insan ve top projektör gölgeleri kapalı, görüş açısı yakınlık
     seviyesinden (2·atan(E/2/H)), pulun ekrandaki çapı ≥ 20 px, topun çizimdeki çapı ≥ 6 px.
  7. E (2026-10-23): kare süresi (bilgi; rAF geri çağırmasının JS süresi, oyunda 4 sn; kontrol.py'nin ölçüsü) ve aktör güncellemesinin payı;
     kopuş (2D'de figür animasyonu yerine pulAktor), olay simgesi (kart) cezalının pulunun üstünde ve süresi bitince söner, top taşıyanın adı görünür.
Başsız yazılım çiziminde kare hızı düşüktür: koşullar zamanla değil durumla beklenir. Çıkış kodu 1: denetim düştü ya da sayfa hatası."""
import sys, pathlib, json
from playwright.sync_api import sync_playwright

KOK = pathlib.Path(__file__).resolve().parent.parent
URL = (KOK / "index.html").as_uri()
hatalar, sonuc = [], []


def yaz(ad, ok, ek=""):
    sonuc.append(ok)
    print(("  " if ok else "! ") + ad + (" — " + ek if ek else ""))


DURUM = """() => ({pul: PUL.acik, giris: LOCA_GIRIS.aktif, up: camera.up.z, karar: KARAR_ANI.acik, sayfa: ON_EKRAN.sayfa, tepeAn: TEPE_AN.aktif,
  secim: MAC_PROTOKOL.karar && MAC_PROTOKOL.karar.secim, faz: mac.phase, ayar: JSON.parse(localStorage.getItem('chairman:ayarlar') || 'null')})"""
GORUNTU = """() => { const T = STIL.pul.tepe, E = T.genislik[PUL.seviye], fov = 2 * Math.atan(E / 2 / T.yukseklik) * 180 / Math.PI;
  const gorunen = PUL.liste.filter(e => e.root.visible), V = new THREE.Vector3(), W = new THREE.Vector3();
  const pc = gorunen.map(e => { V.copy(e.root.position).project(camera); W.copy(e.root.position).add(new THREE.Vector3(e.r * e.root.scale.x, 0, 0)).project(camera);
    return Math.abs(W.x - V.x) * 960; }).filter(x => x > 0).sort((a, b) => a - b);
  const tp = (() => { const a = topMesh.position.clone().project(camera), b = topMesh.position.clone().add(new THREE.Vector3(TOP_R * topMesh.scale.x, 0, 0)).project(camera); return Math.abs(b.x - a.x) * 960; })();
  return {faz: mac.phase, pul: gorunen.length, figur: AKTORLER.filter(a => a.m.mesh.material.visible).length, insanGolge: GOLGE.insanGizli, topGolge: GOLGE.topGizli,
    fov: +camera.fov.toFixed(2), beklenen: +fov.toFixed(2), pulPx: pc.length ? +pc[Math.floor(pc.length / 2)].toFixed(1) : 0, topPx: +tp.toFixed(1)}; }"""


# E0 (2026-10-23): kare süresi — kontrol.py'nin rAF sarmalayıcısı; aktör güncellemesinin (figür ya da pul yolu) süresi ayrıca
KARE_SURE_JS = """(() => { const asil = window.requestAnimationFrame.bind(window), S = window.__kareSure = [];
  window.requestAnimationFrame = f => asil(t => { const t0 = performance.now(); try { f(t); } finally { S.push(performance.now() - t0); } }); })();"""
AKTOR_SURE_JS = """() => { window.__akt = []; for (const ad of ['aktorGuncelle', 'pulAktor']) { if (typeof window[ad] !== 'function' || window[ad].__sar) continue;
  const f = window[ad], g = function () { const t0 = performance.now(); try { return f.apply(this, arguments); } finally { window.__aktT = (window.__aktT || 0) + performance.now() - t0; } };
  g.__sar = true; window[ad] = g; } window.__aktT = 0; window.__kareSure.length = 0; window.__aktKare = mac.kare; }"""
KARE_OKU_JS = """() => { const S = window.__kareSure.slice().sort((a, b) => a - b), q = f => S.length ? S[Math.min(S.length - 1, Math.floor(f * S.length))] : 0;
  return {n: S.length, o: +q(0.5).toFixed(2), p95: +q(0.95).toFixed(2), akt: +((window.__aktT || 0) / Math.max(1, S.length)).toFixed(2)}; }"""


def gec(pg):
    pg.wait_for_selector("#onEkran:not([hidden]) #btnBeklemedenGec")
    pg.wait_for_function("!document.getElementById('btnBeklemedenGec').disabled", timeout=20000)
    pg.click("#btnBeklemedenGec")


def bos_tikla(pg):
    pg.locator("body").click(position={"x": 5, "y": 990})


with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=swiftshader", "--enable-unsafe-swiftshader"])

    def ac(ek, depo=None, kare=False):
        c = b.new_context(viewport={"width": 1200, "height": 1000})
        if kare:
            c.add_init_script(KARE_SURE_JS)
        if depo is not None:
            c.add_init_script("if(!sessionStorage.getItem('akis2d')){sessionStorage.setItem('akis2d','1');localStorage.setItem('chairman:ayarlar', %s);}" % json.dumps(json.dumps(depo)))
        pg = c.new_page()
        pg.on("pageerror", lambda e: hatalar.append(str(e)))
        pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
        pg.goto(URL + ek)
        pg.wait_for_timeout(1500)
        return c, pg

    # 1
    c, pg = ac("?ekran=bulten&tohum=4&rakipBaskan=yerinde")
    gec(pg); pg.wait_for_timeout(500); d0 = pg.evaluate(DURUM)
    yaz("2D: giriş sahnesi başlamadı, kamera tepede, pullar açık", d0["pul"] and not d0["giris"] and d0["up"] == 1 and d0["tepeAn"], str(d0))
    pg.wait_for_function("KARAR_ANI.acik", timeout=180000); d1 = pg.evaluate(DURUM)
    yaz("2D: karar anı açıldı, telefon kilitli (sayfa loca)", d1["karar"] and d1["sayfa"] == "loca", str(d1))
    bos_tikla(pg); pg.keyboard.press("Digit1"); pg.wait_for_function("!TEPE_AN.aktif", timeout=180000); d2 = pg.evaluate(DURUM)
    yaz("2D: seçim kaydedildi, karar anı kapandı, sayfa serbest", bool(d2["secim"]) and not d2["karar"] and d2["sayfa"] is None, str(d2))
    c.close()
    # 2
    c, pg = ac("?ekran=bulten&tohum=4&rakipBaskan=yerinde")
    gec(pg); pg.wait_for_timeout(300)
    pg.click("#btnMacaGec"); pg.wait_for_function("KARAR_ANI.acik", timeout=180000); e1 = pg.evaluate(DURUM)
    bos_tikla(pg); pg.keyboard.press("Digit2"); pg.wait_for_function("!TEPE_AN.aktif", timeout=180000); pg.wait_for_timeout(1500); e2 = pg.evaluate(DURUM)
    yaz("2D: Santraya geç karar anını bekletti, seçimden sonra ısınma bitti", e1["karar"] and bool(e2["secim"]) and e2["faz"] != "isinma",
        str({"once": e1["faz"], "sonra": e2["faz"], "secim": e2["secim"]}))
    c.close()
    # 3
    c, pg = ac("?ekran=bulten&tohum=4&rakipBaskan=yok")
    gec(pg); pg.wait_for_timeout(3000); f = pg.evaluate(DURUM)
    yaz("2D, rakip başkan yok: karar anı açılmadı", not f["karar"] and not f["tepeAn"] and f["sayfa"] is None, str(f))
    c.close()
    # 4
    c, pg = ac("?ekran=bulten&tohum=4&rakipBaskan=yerinde&pul=0")
    gec(pg); pg.wait_for_timeout(500); g = pg.evaluate(DURUM)
    yaz("?pul=0: figürlü loca bakışı ve giriş sahnesi", not g["pul"] and g["giris"] and g["up"] == 0, str(g))
    c.close()
    # 5
    c, pg = ac("?ekran=mac&tohum=3", {"yazi": "normal", "test": True, "macHizi": 1, "otoYavas": True, "pul": False})
    h = pg.evaluate(DURUM)
    yaz("Göç: eski 'pul:false' kaydına rağmen 2D açık, depoda pul yok, locaBakisi false",
        h["pul"] and "pul" not in (h["ayar"] or {}) and (h["ayar"] or {}).get("locaBakisi") is False, str(h["ayar"]))
    bos_tikla(pg); pg.keyboard.press("KeyG"); pg.wait_for_timeout(500); k = pg.evaluate(DURUM)
    yaz("G tuşu: loca bakışına geçti ve locaBakisi true yazıldı", not k["pul"] and k["ayar"].get("locaBakisi") is True and k["up"] == 0, str(k["ayar"]))
    pg.reload(); pg.wait_for_timeout(1500); m = pg.evaluate(DURUM)
    yaz("Yenileme: loca bakışı korunur", not m["pul"], "")
    c.close()
    # 6
    c, pg = ac("?ekran=mac&tohum=5", kare=True)
    pg.click("#btnMacaGec"); pg.wait_for_function("mac.phase === 'play' && mac.phaseT > 3", timeout=240000)
    pg.wait_for_timeout(1500); v = pg.evaluate(GORUNTU)
    pg.evaluate(AKTOR_SURE_JS); pg.wait_for_timeout(4000); ks = pg.evaluate(KARE_OKU_JS)
    print(f"  Kare süresi (bilgi; 2D oyunda, rAF geri çağırması, ms): ortanca {ks['o']} · p95 {ks['p95']} · {ks['n']} kare · aktör güncellemesi kare başına {ks['akt']} ms")
    pg.evaluate("""() => { const b = mac.ball, s = b.sahip || mac.teams[0][9], q = mac.teams[1 - s.team].find(x => x.oyunda && x.rol !== 'GK'); pulOlay('kart', {p: q, renk: 'kirmizi'}); }""")
    pg.wait_for_timeout(800)
    SIMGE = """() => { const o = PUL_SIMGE.liste.find(o => o.tur === 'kirmizi'), E = o && PUL.liste.find(e => e.a.kaynak === o.p && e.root.visible), s = mac.ball.sahip;
      return {var: !!o, gor: !!(o && o.s.visible), yakin: o && E ? +Math.hypot(o.s.position.x - E.x, o.s.position.z - E.z).toFixed(2) : null, ust: o && E ? o.s.position.z > E.z : null,
        et: !!(PUL_SIMGE.etiket && PUL_SIMGE.etiket.visible), etP: PUL_SIMGE.etP ? PUL_SIMGE.etP.name : null, sahip: s ? s.name : null, kopus: pulKopus(), kart3b: KART.visible}; }"""
    k = pg.evaluate(SIMGE)
    yaz("E: kopuş açık, kart simgesi cezalının pulunun üstünde (3B kart çizilmiyor), top taşıyanın adı görünür",
        k["var"] and k["gor"] and k["yakin"] is not None and k["yakin"] < 4 and k["ust"] and k["kopus"] and not k["kart3b"] and (k["sahip"] is None or (k["et"] and k["etP"] == k["sahip"])), str(k))
    pg.wait_for_function("(() => { const o = PUL_SIMGE.liste.find(o => o.tur === 'kirmizi'); return !o; })()", timeout=120000)
    yaz("E: kart simgesi süresi bitince söndü", True, "")
    yaz("Görüntü: oyunda pullar görünür, figür çizilmiyor, insan ve top projektör gölgeleri kapalı",
        v["pul"] >= 25 and v["figur"] == 0 and v["insanGolge"] and v["topGolge"], str(v))
    yaz("Görüntü: görüş açısı yakınlık seviyesinden, pul ≥ 20 px, top ≥ 6 px",
        abs(v["fov"] - v["beklenen"]) < 0.5 and v["pulPx"] >= 20 and v["topPx"] >= 6, str(v))
    c.close()
    b.close()

print("sayfa hataları:", hatalar[:5] or "yok")
tamam = all(sonuc) and not hatalar
print("SONUÇ:", "geçti" if tamam else "BAŞARISIZ")
sys.exit(0 if tamam else 1)
