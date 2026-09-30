#!/usr/bin/env python3
"""Chairman — günlük akış denemesi (yol haritası 2.3–2.4)

Oyunu başsız Chromium'da açar ve gerçek ekranı tıklayarak oynar:
  1. Yönetim toplantısı ve sayman seçimi, İlerle ile Perşembeye gelinir; sponsor işi saymana devredilir.
  2. İlerle, saymanın haberinde (Cuma 09:30) durur; karar gerektiren haber meseleye ve ajandaya düşer.
  3. Sayfa yenilenir: saat, karar ve para aynı, "Kaldığın yer" özeti görünür.
  4. Karar verilir, sayfa yenilenir: karar ikinci kez uygulanmaz, mesele ödemeyle kapanmaya gider.
  5. "Stada git": maç sınırında kayıt yapılmaz; sayfa yenilenince maç geçişi hâlâ açıktır.
  6. Sürüm 1 kayıt (araclar/ornekler) yüklenir: yeni biçime dönüşür ve oyun sürer.
Site hazırlığı araclar/kontrol.py ile aynıdır (Three.js yerel kopyadan). Başarısız denetim ya da sayfa hatası çıkış kodunu 1 yapar.
Ekran görüntüleri: araclar/son-akis-*.png (depoya eklenmez).

Kullanım:  python3 araclar/akis-deneme.py
"""
import asyncio
import json
import pathlib
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import kontrol  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")

KOK, ARAC = kontrol.KOK, kontrol.ARAC
basarisiz = 0


def denetle(ad, tamam, ayrinti=""):
    global basarisiz
    if not tamam:
        basarisiz += 1
    print(("  " if tamam else "! ") + ad + (f" — {ayrinti}" if ayrinti else ""))


DURUM_JS = """() => { const k = AJANDA_EKRANI.kariyer; const c = k.kulupler.demirkapi;
  return { tarih: k.tarih, dakika: k.gunIciDakika, nakit: c.nakit, hareket: k.hareketler.length, gecmis: k.gecmis.length,
    isler: Object.keys(k.isler).join(','), mesele: Object.values(k.meseleler).map(m => m.id + ':' + m.durum).join(','),
    sayman: c.yonetim.sayman, karar: Object.values(k.isler).filter(x => x.veri.saatsiz).map(x => x.id).join(',') }; }"""


async def durum(pg):
    return await pg.evaluate(DURUM_JS)


async def ilerle_tikla(pg):
    """İlerle'ye basar; kaçırılacak iş için onay isterse onaylar."""
    await pg.click('.aj-ana')
    if await pg.query_selector('.aj-ana[data-eylem="ilerle"]:has-text("Onayla")'):
        await pg.click('.aj-ana')


async def sayfa_ac(tarayici, site, sorgu=""):
    pg = await tarayici.new_page(viewport={"width": 1180, "height": 1000})
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text)
          if m.type == "error" and "Failed to load resource" not in m.text else None)
    pg.on("requestfailed", lambda i: None)
    await pg.goto((site / "index.html").as_uri() + sorgu)
    await pg.wait_for_selector("#ajanda:not([hidden]) .aj-ana", timeout=20000)
    return pg, hatalar


async def yenile(pg):
    await pg.reload()
    await pg.wait_for_selector("#ajanda:not([hidden]) .aj-ana", timeout=20000)


async def ana():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright && python3 -m playwright install chromium")
    site = kontrol.kopya_hazirla(kontrol.yerel_three())
    tum_hatalar = []
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(
            args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        pg, hatalar = await sayfa_ac(tarayici, site)
        tum_hatalar += hatalar
        d0 = await durum(pg)
        denetle("Yeni kariyer Pazartesi 08:00, tek açık mesele", d0["tarih"] == "2026-11-23" and d0["dakika"] == 480 and d0["mesele"] == "mesele-1:kararBekliyor", str(d0))

        # ---- 1. Pazartesi: toplantı, sayman seçimi; İlerle ile Perşembeye ----
        await pg.click('button[data-is="is-4"]')
        await pg.click('[data-eylem="yap"]')
        await pg.click('button[data-is="is-14"]')
        await pg.click('[data-eylem="sec"][data-secim="kisi-9"]')
        await pg.click('[data-eylem="yap"]')
        d = await durum(pg)
        denetle("Toplantı ve sayman seçimi yapıldı; ekrandan sonra her komut kaydedildi", d["sayman"] == "kisi-9" and d["dakika"] == 870, str(d))
        for _ in range(12):
            d = await durum(pg)
            if d["tarih"] == "2026-11-26":
                break
            await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle ile Perşembeye gelindi (Salı-Çarşamba boş günler tek tıkla geçildi)", d["tarih"] == "2026-11-26", str(d))
        kayit_once = await pg.evaluate("localStorage.getItem('chairman:oyun-1')")
        denetle("Kayıt her komuttan sonra yazılmış: kayıt oyun-içi saati yansıtıyor", json.loads(kayit_once)["veri"]["tarih"] == "2026-11-26")
        await pg.screenshot(path=str(ARAC / "son-akis-1-persembe.png"))

        # ---- 2. sponsor işini devret; İlerle haber anında durur ----
        await pg.click('button[data-is="is-10"]')
        await pg.click('[data-eylem="sec"][data-secim="devret"]')
        await pg.click('[data-eylem="yap"]')
        await pg.click('button.aj-mesele[data-mesele="mesele-1"]')
        yazi = await pg.text_content("#ajanda .aj-p-ayrinti")
        denetle("Mesele dosyası: kim ilgileniyor, ne bekleniyor, şimdi ne yapılabilir",
                "Tuncay Erbil" in yazi and "Bekleyen" in yazi and "Şimdi" in yazi and "Ekipte" in yazi, yazi.replace("\n", " | ")[:200])
        await pg.screenshot(path=str(ARAC / "son-akis-2-mesele.png"))
        for _ in range(6):
            d = await durum(pg)
            if d["karar"]:
                break
            await ilerle_tikla(pg)
            if (await durum(pg))["tarih"] == "2026-11-26":
                await pg.click('button[data-is="is-6"]')
                if await pg.query_selector('[data-eylem="yap"]:not([disabled])'):
                    await pg.click('[data-eylem="yap"]')
        d = await durum(pg)
        denetle("İlerle, saymanın haberinde (Cuma 09:30) durdu; karar saati serbest bir iş olarak bekliyor",
                d["tarih"] == "2026-11-27" and d["dakika"] == 570 and d["karar"] != "", str(d))
        await pg.screenshot(path=str(ARAC / "son-akis-3-karar.png"))

        # ---- 3. yenile: aynı durum, Kaldığın yer ----
        onceki = await durum(pg)
        await yenile(pg)
        sonra = await durum(pg)
        yazi = await pg.inner_text("#ajanda .aj-p-ayrinti")
        denetle("Sayfa yenilenince saat, karar ve para aynı", onceki == sonra, f"{onceki} → {sonra}")
        denetle("Dönüş özeti: son karar, beklenen haber ve yaklaşan iş", "Kaldığın yer" in yazi and "Son yaptığın" in yazi and "Karar sende" in yazi, yazi.replace("\n", " | ")[:260])
        await pg.screenshot(path=str(ARAC / "son-akis-4-donus.png"))
        await pg.click('[data-eylem="devam"]')

        # ---- 4. kararı ver, yenile: ikinci kez uygulanmaz ----
        await pg.click(f'button[data-is="{sonra["karar"]}"]')
        await pg.click('[data-eylem="sec"][data-secim="kabul"]')
        await pg.click('[data-eylem="yap"]')
        karar_sonra = await durum(pg)
        await yenile(pg)
        yenilenmis = await durum(pg)
        denetle("Karar verildi (indirim kabul) ve yenilemeden sonra ikinci kez uygulanmadı", karar_sonra == yenilenmis and yenilenmis["karar"] == "" and yenilenmis["nakit"] == sonra["nakit"], str(yenilenmis))

        # ---- 5. Stada git: maç sınırında kayıt yok ----
        for _ in range(14):
            if await pg.query_selector('.aj-ana:has-text("Stada git")'):
                break
            d = await durum(pg)
            if await pg.query_selector('.aj-ana[disabled]'):
                # zorunlu iş: ilk katılınabilir zorunlu/son günlü işe katıl
                satir = await pg.query_selector('button.aj-satir[data-durum="bekliyor"]')
                if satir:
                    await satir.click()
                    if await pg.query_selector('[data-eylem="yap"]:not([disabled])'):
                        await pg.click('[data-eylem="yap"]')
                continue
            await ilerle_tikla(pg)
        onceki_kayit = json.loads(await pg.evaluate("localStorage.getItem('chairman:oyun-1')"))["veri"]
        await pg.click('.aj-ana:has-text("Stada git")')
        if await pg.query_selector('.aj-ana[data-eylem="yap"]:has-text("Onayla")'):
            await pg.click('.aj-ana')
        await pg.wait_for_selector("#onEkran:not([hidden])", timeout=20000)
        denetle("Stada git: ajanda kapandı, maç bülteni açıldı", await pg.evaluate("document.getElementById('ajanda').hidden") is True)
        son_kayit = json.loads(await pg.evaluate("localStorage.getItem('chairman:oyun-1')"))["veri"]
        denetle("Maç sınırında kayıt yapılmadı: kayıt Stada git öncesinde kaldı", son_kayit["tarih"] == onceki_kayit["tarih"] and son_kayit["gunIciDakika"] == onceki_kayit["gunIciDakika"] and "is-13" in son_kayit["isler"],
                f"{son_kayit['tarih']} {son_kayit['gunIciDakika']}")
        await yenile(pg)
        denetle("Yenilenince maç geçişi hâlâ açık: Stada git düğmesi var", await pg.query_selector('.aj-ana:has-text("Stada git")') is not None)
        await pg.screenshot(path=str(ARAC / "son-akis-5-mac-siniri.png"))
        await pg.close()

        # ---- 6. sürüm 1 kayıt ----
        for ad in ("indirim-bekliyor", "taksit"):
            kayit = (ARAC / "ornekler" / f"kayit-s1-{ad}.json").read_text(encoding="utf-8")
            baglam = await tarayici.new_context()
            pg2 = await baglam.new_page()
            hatalar2 = []
            pg2.on("pageerror", lambda e: hatalar2.append("Betik hatası: " + str(e)))
            await pg2.goto((site / "index.html").as_uri())
            await pg2.evaluate("k => localStorage.setItem('chairman:oyun-1', k)", kayit)
            await pg2.reload()
            await pg2.wait_for_selector("#ajanda:not([hidden]) .aj-ana", timeout=20000)
            d = await pg2.evaluate(DURUM_JS)
            yeni = json.loads(await pg2.evaluate("localStorage.getItem('chairman:oyun-1')"))["veri"]
            yedek = json.loads(await pg2.evaluate("localStorage.getItem('chairman:oyun-1.onceki')") or "{}")
            yazi = await pg2.inner_text("#ajanda .aj-mesaj")
            denetle(f"Sürüm 1 kayıt ({ad}): açıldı, sürüm 2 olarak yeniden yazıldı, eski kayıt yedek", yeni["kayitSurumu"] == 2 and yedek.get("veri", {}).get("kayitSurumu") == 1 and "mesele-1" in d["mesele"], f"{d['tarih']} {d['mesele']} · {yazi[:80]}")
            await pg2.screenshot(path=str(ARAC / f"son-akis-6-{ad}.png"))
            tum_hatalar += hatalar2
            await baglam.close()
        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    denetle("Sayfa ve betik hatası yok", not tum_hatalar, "; ".join(tum_hatalar[:3]))
    print("\nEkran görüntüleri: araclar/son-akis-*.png")
    print(f"BAŞARISIZ: {basarisiz} denetim" if basarisiz else "Tüm denetimler geçti")
    sys.exit(1 if basarisiz else 0)


if __name__ == "__main__":
    asyncio.run(ana())
