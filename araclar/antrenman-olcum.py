#!/usr/bin/env python3
"""Chairman — balkon antrenmanının ölçüsü (RK1, 2026-10-31; RK9'da büyür).

Oyun ?dunya=7 ile açılır, TEST “Balkonda her saat antrenman” açılır, balkona çıkılır ve oyun duraklatılır (normal döngü sahneyi ilerletmez).
Sahne sayfa içinde sabit adımla (1/60 sn) oynatılır; çizim yoktur, ölçüm kare hızından bağımsız ve belirlenimlidir. Ölçülenler (RK1 kabulü,
araclar/plan/rk-program.md §10.2):
  top       şut havuzunun ve pas çemberinin topu yerden 0,05 m yukarıda 0,4 sn'den uzun durağan kalmaz (elde tutulan top hariç)
  pas       60 sn'de çemberin her oyuncusu en az iki kez topa dokunur; pas, kesme ve kötü kontrol sayıları
  kaleci    her şutun başında kaleci yerde ve dik (kök yüksekliği ≤ 0,05 m, yana yatış 0)
  kimlik    sahadaki oyuncuların 3,5 m/sn'deki adım boyunun değişim katsayısı ≥ %8 (kutuphane/J §J.12 G9 “Kimlik”)
  koşu      10 sn'de her koşucu çiftinin adım fazı farkı değişir
            (aynı adımda kilitli çift yok)
  şut       atış, gol, kurtarış ve ıska sayıları (bilgi)
  süre      bir sahne adımının ortalama süresi (ms; bilgi — balkon karesinin çizimsiz bedeli, RK9 bütçesi 2 ms)
Kullanım: python -X utf8 araclar/antrenman-olcum.py [--sn 60] [--gun toparlanma|yogun] [--json DOSYA]
Çıkış kodu: kabul dışı ölçü varsa 1."""
import asyncio
import importlib.util
import json
import pathlib
import sys

ARAC = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(ARAC))
import kontrol  # noqa: E402

_spec = importlib.util.spec_from_file_location("akis_deneme", ARAC / "akis-deneme.py")
akis = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(akis)

OLCUM_JS = """async ([sn, gun]) => {
  const B = BALKON, dt = 1 / 60, N = Math.round(sn / dt), PY = STIL.balkon.saha[1];
  const toplar = () => [B.top.rondo].concat(B.top.sut).filter(t => t.visible);
  const elde = t => !!(B.sutD && B.sutD.toplar.some(U => U.m === t && U.elde));
  const son = new Map(), donmus = new Map(); let enUzun = 0, enUzunTop = null;
  const dok0 = Object.assign({}, B.olcu.dokunus), pas0 = B.olcu.pas, kes0 = B.olcu.kesme, kotu0 = B.olcu.kotuKontrol, sut0 = Object.assign({}, B.olcu.sut), kh0 = B.olcu.kaleciHazir.length;
  const kosu = B.kosu.slice(), faz = t => kosu.map(a => a.faz), faz0 = faz(), cember = B.rondoD ? B.rondoD.cember.concat([B.rondoD.orta]).map(a => a.id) : B.rondo.map(a => a.id);
  let faz10 = null, boylar = null;
  const t0 = performance.now();
  for (let i = 0; i < N; i++) {
    balkonKare(dt);
    for (const t of toplar()) {
      const y = t.position.y - PY - 0.14, p = son.get(t), d = p ? Math.hypot(t.position.x - p.x, t.position.y - p.y, t.position.z - p.z) : 1;
      if (y > 0.05 && d < 0.0015 && !elde(t)) { const n = (donmus.get(t) || 0) + 1; donmus.set(t, n); if (n * dt > enUzun) { enUzun = n * dt; enUzunTop = { y: +y.toFixed(2), x: +(t.position.x).toFixed(1), z: +(t.position.z).toFixed(1) }; } }
      else donmus.set(t, 0);
      son.set(t, { x: t.position.x, y: t.position.y, z: t.position.z });
    }
    if (i === Math.round(10 / dt)) { faz10 = faz(); boylar = kosu.map(a => a.adimBoy || 0); }
  }
  const ms = (performance.now() - t0) / N;
  const dok = {}; for (const id of cember) dok[id] = (B.olcu.dokunus[id] || 0) - (dok0[id] || 0);
  const kh = B.olcu.kaleciHazir.slice(kh0);
  const sut = {}; for (const k in B.olcu.sut) sut[k] = B.olcu.sut[k] - (sut0[k] || 0);
  const ciftler = [], kilitli = [];
  for (let i = 0; i < kosu.length; i++) for (let j = i + 1; j < kosu.length; j++) {
    const a = boylar[i], b = boylar[j]; ciftler.push(Math.max(a, b) / Math.max(1e-6, Math.min(a, b)) - 1);
    const d0 = Math.atan2(Math.sin(faz0[i] - faz0[j]), Math.cos(faz0[i] - faz0[j])), d1 = Math.atan2(Math.sin(faz10[i] - faz10[j]), Math.cos(faz10[i] - faz10[j]));
    if (Math.abs(Math.atan2(Math.sin(d1 - d0), Math.cos(d1 - d0))) < 0.5 && Math.abs(d1) < 0.3) kilitli.push([kosu[i].id, kosu[j].id]);
  }
  return { gun: B.tur, sn, ms: +ms.toFixed(3), enUzun: +enUzun.toFixed(2), enUzunTop, dokunus: dok, pas: B.olcu.pas - pas0, kesme: B.olcu.kesme - kes0, kotu: B.olcu.kotuKontrol - kotu0,
    sut, kaleci: kh, kosucu: kosu.length, adimFarki: ciftler.map(x => +x.toFixed(3)), kilitli,
    adim: [...B.havuz.values()].filter(a => a.m.root.visible && a.kim).map(a => +blkAdimBoyu(a, 3.5).toFixed(3)),
    gruplar: { kosu: B.kosu.length, rondo: B.rondo.length, sut: B.sut.length, esneme: B.esneme.length, kenar: B.kenar.length } };
}"""


def secenek(ad, varsayilan=None):
    return sys.argv[sys.argv.index(ad) + 1] if ad in sys.argv and sys.argv.index(ad) + 1 < len(sys.argv) else varsayilan


async def ana():
    from playwright.async_api import async_playwright
    sn = float(secenek("--sn", "60"))
    gun = secenek("--gun", "yogun")
    site = kontrol.kopya_hazirla(kontrol.yerel_three())
    async with async_playwright() as p:
        tr = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        pg, hatalar = await akis.oda_ac(tr, site, "?dunya=7")
        await pg.set_viewport_size({"width": 1180, "height": 1000})
        # yoğun gün: Salı 15:00 (§23 kalıbı); toparlanma: Pazartesi 15:00 (maç ertesi değil ama programın türü TEST anahtarıyla yoğun düzendir)
        tarih = "2026-11-24" if gun == "yogun" else "2026-11-23"
        await pg.evaluate("(t) => { OYUN.ayarlar.herSaat = true; OYUN.ayarlar.kaydet(); oyunKomut(k => zamanIlerlet(k, anDakika(t, 900) - simdikiAn(k))); }", tarih)
        await akis.oda_yenile(pg)
        await akis.balkona_atla(pg)
        await pg.wait_for_function("typeof BALKON !== 'undefined' && BALKON.antrenman", timeout=15000)
        await pg.keyboard.press("KeyP")
        r = await pg.evaluate(OLCUM_JS, [sn, gun])
        await pg.evaluate("() => { OYUN.ayarlar.herSaat = false; OYUN.ayarlar.kaydet(); }")
        await tr.close()
    kabul = []
    def satir(ad, tamam, ayrinti):
        kabul.append((ad, tamam))
        print(("  " if tamam else "! ") + ad + " — " + ayrinti)
    print(f"Balkon antrenmanı ölçüsü · {r['gun']} · {r['sn']:.0f} sn · gruplar {r['gruplar']}")
    satir("top havada durmuyor (≤ 0,4 sn)", r["enUzun"] <= 0.4, f"en uzun {r['enUzun']} sn {r['enUzunTop'] or ''}")
    az = min(r["dokunus"].values()) if r["dokunus"] else 0
    satir("pas çemberinde herkes en az iki kez topa dokundu", az >= 2, f"en az {az} · {r['pas']} pas, {r['kesme']} kesme, {r['kotu']} kötü kontrol · {sorted(r['dokunus'].values())}")
    kh = r["kaleci"]
    satir("kaleci her şutun başında yerde ve dik", bool(kh) and all(x["y"] <= 0.05 and abs(x["rz"]) < 0.01 for x in kh), f"{len(kh)} şut · {kh[:6]}")
    A = r["adim"]
    ort = sum(A) / max(1, len(A))
    cv = (sum((x - ort) ** 2 for x in A) / max(1, len(A))) ** 0.5 / max(1e-9, ort)
    satir("oyuncuların adım boyu değişim katsayısı ≥ %8 (J.12 G9 kimlik)", cv >= 0.08, f"%{cv * 100:.1f} · {len(A)} oyuncu · {min(A) if A else 0}–{max(A) if A else 0} m")
    satir("aynı adımda kilitli koşucu çifti yok", not r["kilitli"], f"{r['kilitli']}")
    print(f"  şut: {r['sut']} · sahne adımı {r['ms']} ms")
    if hatalar:
        print("SAYFA HATALARI:", hatalar[:5])
    if secenek("--json"):
        pathlib.Path(secenek("--json")).write_text(json.dumps(r, ensure_ascii=False, indent=1), encoding="utf-8")
    yeni = [a for a, t in kabul if not t]
    print("Kabul: " + ("hepsi geçti" if not yeni and not hatalar else f"{len(yeni)} ölçü dışı" + (" · sayfa hatası" if hatalar else "")))
    sys.exit(1 if yeni or hatalar else 0)


if __name__ == "__main__":
    asyncio.run(ana())
