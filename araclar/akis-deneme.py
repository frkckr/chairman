#!/usr/bin/env python3
"""Chairman — günlük akış denemesi (yol haritası 2.3–2.8)

Oyunu başsız Chromium'da açar ve gerçek ekranı tıklayarak oynar. Başlangıç geliştirici parametreleriyle sabitlenir
(?baslangic=…&sponsor=…&hoca=…&dunya=…); oyuncuya bu seçim gösterilmez.
A. Koyu ajanda görünümü (?ekran=ajanda) — kural akışı:
  1. Sıkışık başlangıç: sayman seçilir; İlerle destek teklifinde (Salı) ve sponsorun haberinde (Çarşamba) durur.
  2. Mesele dosyası kim/ne/şimdi sorularını ve kaynağıyla kanıtları gösterir; gizli koşul ve paket adı ekranda yoktur.
  3. İş saymana devredilir; İlerle saymanın haberinde durur, yetkiyi aşan teklif başkana döner.
  4. Sayfa yenilenir: saat, karar ve para aynı, "Kaldığın yer" özeti görünür. Karar verilir, yenilenir: ikinci kez uygulanmaz.
  5. "Stada git": maç sınırında kayıt yapılmaz; sayfa yenilenince maç geçişi hâlâ açıktır.
  6. Düzenli başlangıç: mesele açılmadan tek İlerle ile maç gününe gelinir. Rahat başlangıç: acil olmayan karar açılır.
  7. "Yeni kariyer" yeni bir kariyer kurar.
  8. Sürüm 1, 2 ve 3 kayıtları (araclar/ornekler) yüklenir: yeni biçime dönüşür ve kendi içerikleriyle sürer.
B. Başkan odası (oyunun açılış ekranı):
  9. Masadaki nesne ve düğmeler; test bilgileri anahtarı; girişim; görüş isteme; panelde gezmek durumu değiştirmez; haber paneli
     kendiliğinden açmaz; basın sorusu; Cuma gazetesi masada; sözler; yenilemede aynı durum, ayar ve izler; "Stada git".
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
SURUM = 5
basarisiz = 0


def denetle(ad, tamam, ayrinti=""):
    global basarisiz
    if not tamam:
        basarisiz += 1
    print(("  " if tamam else "! ") + ad + (f" — {ayrinti}" if ayrinti else ""))


DURUM_JS = """() => { const k = OYUN.kariyer; const c = k.kulupler.demirkapi;
  return { tarih: k.tarih, dakika: k.gunIciDakika, nakit: c.nakit, hareket: k.hareketler.length, gecmis: k.gecmis.length,
    isler: Object.keys(k.isler).join(','), mesele: Object.values(k.meseleler).map(m => m.tur + ':' + m.durum).join(','),
    olay: Object.values(k.olaylar).map(o => o.paket + '/' + o.varyant + ':' + o.durum).join(','), baslangic: k.icerik.baslangic, icerik: k.icerik.surum,
    sayman: c.yonetim.sayman, karar: Object.values(k.isler).filter(x => x.veri.saatsiz).map(x => x.id).join(','),
    soz: Object.values(k.sozler).map(s => s.anahtar + ':' + s.durum).join(','), haber: k.haberler.map(h => h.anahtar).join(','),
    gozlem: k.gozlem ? k.gozlem.bas + '-' + k.gozlem.bitis : '' }; }"""
KARAR_JS = "tur => { const x = Object.values(OYUN.kariyer.isler).find(x => x.tur === 'ajanda' && x.veri.karar === tur); return x ? x.id : null; }"
MESELE_JS = "tur => { const m = Object.values(OYUN.kariyer.meseleler).find(m => m.tur === tur); return m ? m.id : null; }"
KAYIT_JS = "localStorage.getItem('chairman:oyun-1')"
SIKISIK = "?baslangic=sikisik&sponsor=nakitSikisik&hoca=yok&dunya=7"


async def durum(pg):
    return await pg.evaluate(DURUM_JS)


async def karar_isi(pg, tur):
    return await pg.evaluate(KARAR_JS, tur)


async def ilerle_tikla(pg):
    """İlerle'ye basar; kaçırılacak iş için onay isterse onaylar."""
    await pg.click('.aj-ana')
    if await pg.query_selector('.aj-ana[data-eylem="ilerle"]:has-text("Onayla")'):
        await pg.click('.aj-ana')


async def karar_ver(pg, is_id, secim):
    await pg.click(f'button.aj-satir[data-is="{is_id}"]')
    await pg.click(f'[data-eylem="sec"][data-secim="{secim}"]')
    await pg.click('[data-eylem="yap"]')


async def sayfa(tarayici, site, sorgu, bekle):
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text)
          if m.type == "error" and "Failed to load resource" not in m.text else None)
    await pg.goto((site / "index.html").as_uri() + sorgu)
    await pg.wait_for_selector(bekle, timeout=20000)
    return pg, hatalar


async def sayfa_ac(tarayici, site, sorgu=""):
    """Koyu ajanda görünümü (geliştirici görünümü)."""
    return await sayfa(tarayici, site, (sorgu + "&" if sorgu else "?") + "ekran=ajanda", "#ajanda:not([hidden]) .aj-ana")


async def oda_ac(tarayici, site, sorgu=""):
    """Oyunun varsayılan açılışı: başkan odası."""
    return await sayfa(tarayici, site, sorgu, "#oda:not([hidden]) .od-ana")


async def yenile(pg):
    await pg.reload()
    await pg.wait_for_selector("#ajanda:not([hidden]) .aj-ana", timeout=20000)


async def oda_yenile(pg):
    await pg.reload()
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)


async def oda_karar(pg, secim):
    """Açık paneldeki kararda seçeneği seçer ve uygular."""
    await pg.click(f'.od-panel [data-eylem="sec"][data-secim="{secim}"]')
    await pg.click('.od-panel [data-eylem="yap"]')


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

        # ---- 1. sıkışık başlangıç: sayman seçimi, destek teklifi, nakit takvimi, sponsorun haberi ----
        pg, hatalar = await sayfa_ac(tarayici, site, SIKISIK)
        tum_hatalar += hatalar
        d0 = await durum(pg)
        denetle("Yeni kariyer Pazartesi 08:00; sıkışık başlangıç, sayman koltuğu boş, henüz mesele yok",
                d0["tarih"] == "2026-11-23" and d0["dakika"] == 480 and d0["baslangic"] == "sikisik" and d0["sayman"] is None and d0["mesele"] == "" and d0["icerik"] == 2, str(d0))
        yazi = await pg.inner_text("#ajanda")
        denetle("Henüz olmamış gelişmeler ve eski sabit işler ekranda yok", "Gelişme" not in yazi and "gelisme" not in yazi and "yönetim toplantısı" not in yazi and "röportaj" not in yazi)
        await karar_ver(pg, await karar_isi(pg, "koltukSecimi"), "kisi-9")
        d = await durum(pg)
        denetle("Sayman seçildi; komut kaydedildi", d["sayman"] == "kisi-9" and d["dakika"] == 690 and json.loads(await pg.evaluate(KAYIT_JS))["veri"]["gunIciDakika"] == 690, str(d))
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, Salı 10:30'da gelen destek teklifinde durdu; karar acil değil",
                d["tarih"] == "2026-11-24" and d["dakika"] == 630 and d["mesele"] == "kosulluDestek:kararBekliyor" and d["karar"] != "", str(d))
        await karar_ver(pg, await karar_isi(pg, "destekTeklifi"), "reddet")
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, Salı 14:00 nakit takvimi görüşmesinde durdu", d["tarih"] == "2026-11-24" and d["dakika"] == 840, str(d))
        await karar_ver(pg, await karar_isi(pg, "nakitTakvimi"), "bekle")
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, sponsorun haberinde (Çarşamba 09:30) durdu; mesele açıldı, karar saati serbest bekliyor",
                d["tarih"] == "2026-11-25" and d["dakika"] == 570 and "odemeSikismasi:kararBekliyor" in d["mesele"] and "odemeSikismasi/kriz:acik" in d["olay"] and d["karar"] != "", str(d))
        denetle("Kayıt her komuttan sonra yazılmış: kayıt oyun-içi saati yansıtıyor", json.loads(await pg.evaluate(KAYIT_JS))["veri"]["tarih"] == "2026-11-25")
        await pg.screenshot(path=str(ARAC / "son-akis-1-haber.png"))

        # ---- 2. mesele dosyası: kim, ne, şimdi, kanıtlar ----
        mesele = await pg.evaluate(MESELE_JS, "odemeSikismasi")
        await pg.click(f'button.aj-mesele[data-mesele="{mesele}"]')
        yazi = await pg.inner_text("#ajanda .aj-p-ayrinti")
        denetle("Mesele dosyası: yürüten, bekleyen, şimdi ve kaynağıyla bilinenler",
                "Karar sende" in yazi and "Bekleyen" in yazi and "Şimdi" in yazi and "Bilinenler" in yazi and "Muhasebe kayıtları" in yazi and "Sponsorluk sözleşmesi" in yazi,
                yazi.replace("\n", " | ")[:220])
        tum_yazi = await pg.inner_text("body")
        denetle("Gizli koşul, paket adı ve tohum koyu ajandada yok", not any(x in tum_yazi for x in ("nakitSikisik", "pazarlik", "odemeSikismasi", "P01", "sikisik")))
        await pg.screenshot(path=str(ARAC / "son-akis-2-mesele.png"))
        await pg.click('[data-eylem="kararAc"]')
        secenekler = await pg.eval_on_selector_all('[data-eylem="sec"]', "L => L.map(b => b.dataset.secim).join(',')")
        denetle("Kriz kararı dört yol sunuyor", secenekler == "kendin,devret,bakimErtele,maasGeciktir", secenekler)
        await pg.screenshot(path=str(ARAC / "son-akis-3-karar.png"))

        # ---- 3. saymana devret; İlerle haber anında durur ----
        await pg.click('[data-eylem="sec"][data-secim="devret"]')
        await pg.click('[data-eylem="yap"]')
        await pg.click(f'button.aj-mesele[data-mesele="{mesele}"]')
        yazi = await pg.text_content("#ajanda .aj-p-ayrinti")
        denetle("Devirden sonra mesele ekipte; yürüten sayman", "Ekipte" in yazi and "Tuncay Erbil" in yazi, yazi.replace("\n", " | ")[:160])
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, saymanın haberinde (Perşembe 09:30) durdu; yetkiyi aşan teklif başkana döndü",
                d["tarih"] == "2026-11-26" and d["dakika"] == 570 and d["karar"] != "" and "odemeSikismasi:kararBekliyor" in d["mesele"], str(d))

        # ---- 4. yenile: aynı durum, Kaldığın yer; karar bir kez ----
        onceki = await durum(pg)
        await yenile(pg)
        sonra = await durum(pg)
        yazi = await pg.inner_text("#ajanda .aj-p-ayrinti")
        denetle("Sayfa yenilenince saat, karar ve para aynı", onceki == sonra, f"{onceki} → {sonra}")
        denetle("Dönüş özeti: son karar, beklenen haber ve yaklaşan iş", "Kaldığın yer" in yazi and "Son yaptığın" in yazi and "Karar sende" in yazi, yazi.replace("\n", " | ")[:260])
        await pg.screenshot(path=str(ARAC / "son-akis-4-donus.png"))
        await pg.click('[data-eylem="devam"]')
        await karar_ver(pg, await karar_isi(pg, "odemeTeklifi"), "kabul")
        karar_sonra = await durum(pg)
        await yenile(pg)
        yenilenmis = await durum(pg)
        denetle("Karar verildi (indirim kabul) ve yenilemeden sonra ikinci kez uygulanmadı",
                karar_sonra == yenilenmis and yenilenmis["karar"] == "" and yenilenmis["nakit"] == sonra["nakit"] and "odemeSikismasi:haberBekliyor" in yenilenmis["mesele"], str(yenilenmis))
        await pg.click('[data-eylem="devam"]')

        # ---- 5. Stada git: maç sınırında kayıt yok ----
        for _ in range(8):
            if await pg.query_selector('.aj-ana:has-text("Stada git")'):
                break
            await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("Maç gününe gelindi: indirimli taksit ve maaş birer kez işlendi, kasa eksiye düşmedi; gazete ve teşekkür kayıtlı",
                d["tarih"] == "2026-11-28" and d["nakit"] == 330000000 - 4500000 - 35000000 + 135000000 + 12000000 - 320000000 and d["hareket"] == 5
                and d["mesele"] == "kosulluDestek:kapandi,odemeSikismasi:kapandi" and d["haber"] == "gazete.macOnu,tesekkur.maas", str(d))
        onceki_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        await pg.click('.aj-ana:has-text("Stada git")')
        if await pg.query_selector('.aj-ana[data-eylem="yap"]:has-text("Onayla")'):
            await pg.click('.aj-ana')
        await pg.wait_for_selector("#onEkran:not([hidden])", timeout=20000)
        denetle("Stada git: ajanda kapandı, maç bülteni açıldı", await pg.evaluate("document.getElementById('ajanda').hidden") is True)
        son_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        denetle("Maç sınırında kayıt yapılmadı: kayıt Stada git öncesinde kaldı",
                son_kayit["tarih"] == onceki_kayit["tarih"] and son_kayit["gunIciDakika"] == onceki_kayit["gunIciDakika"] and len(son_kayit["isler"]) == len(onceki_kayit["isler"]) == 1,
                f"{son_kayit['tarih']} {son_kayit['gunIciDakika']}")
        await yenile(pg)
        denetle("Yenilenince maç geçişi hâlâ açık: Stada git düğmesi var", await pg.query_selector('.aj-ana:has-text("Stada git")') is not None)
        await pg.screenshot(path=str(ARAC / "son-akis-5-mac-siniri.png"))
        await pg.context.close()

        # ---- 6. düzenli ve rahat başlangıç ----
        pg, hatalar = await sayfa_ac(tarayici, site, "?baslangic=duzenli&dunya=7")
        tum_hatalar += hatalar
        d0 = await durum(pg)
        await ilerle_tikla(pg)
        d = await durum(pg)
        yazi = await pg.inner_text("#ajanda")
        denetle("Düzenli başlangıç: tek İlerle ile maç gününe gelindi; mesele, olay ve söz doğmadı, ödemeler işlendi",
                d0["baslangic"] == "duzenli" and d0["sayman"] is not None and d["tarih"] == "2026-11-28" and d["dakika"] == 1140 and d["mesele"] == "" and d["olay"] == "" and d["soz"] == ""
                and d["nakit"] == 322500000 and "Henüz bir mesele yok" in yazi and await pg.query_selector('.aj-ana:has-text("Stada git")') is not None, str(d))
        await pg.screenshot(path=str(ARAC / "son-akis-6-duzenli.png"))

        # ---- 7. Yeni kariyer: aynı sayfada yeni başlangıç kurulur ----
        await pg.click('[data-eylem="yeniSor"]')
        await pg.click('[data-eylem="yeniEvet"]')
        d = await durum(pg)
        denetle("Yeni kariyer: Pazartesi 08:00'e dönüldü, geçmiş boş, kayıt yenilendi",
                d["tarih"] == "2026-11-23" and d["dakika"] == 480 and d["gecmis"] == 0 and json.loads(await pg.evaluate(KAYIT_JS))["veri"]["tarih"] == "2026-11-23", str(d))
        await pg.context.close()

        pg, hatalar = await sayfa_ac(tarayici, site, "?baslangic=rahat&sponsor=pazarlik&sayman=kisi-9&hoca=yok&dunya=7")
        tum_hatalar += hatalar
        for _ in range(8):
            if (await durum(pg))["olay"]:
                break
            await ilerle_tikla(pg)
        d = await durum(pg)
        await pg.click(f'button.aj-satir[data-is="{await karar_isi(pg, "anlasmaDegerlendirme")}"]')
        secenekler = await pg.eval_on_selector_all('[data-eylem="sec"]', "L => L.map(b => b.dataset.secim).join(',')")
        yazi = await pg.text_content("#ajanda .aj-p-ayrinti")
        denetle("Rahat başlangıç: aynı haber acil olmayan, ertelenebilir bir karar açtı; seçenekler farklı",
                d["tarih"] == "2026-11-25" and d["dakika"] == 570 and d["olay"] == "odemeSikismasi/degerlendirme:acik" and d["karar"] == "" and secenekler == "kabul,bedel,devret" and "Ertelenebilir" in yazi,
                f"{secenekler} · {d}")
        await pg.screenshot(path=str(ARAC / "son-akis-7-rahat.png"))
        await pg.context.close()

        # ---- 8. eski kayıtlar ----
        for surum, ad in ((1, "indirim-bekliyor"), (1, "taksit"), (2, "ekipte"), (2, "indirim-bekliyor"), (3, "kriz-acik"), (3, "teklif-bekliyor"),
                          (4, "destek-bekliyor"), (4, "gorus-bekliyor"), (4, "sorumlu-ekipte"), (4, "soz-acik"), (4, "basin-bekliyor"), (4, "mac-gunu")):
            kayit = (ARAC / "ornekler" / f"kayit-s{surum}-{ad}.json").read_text(encoding="utf-8")
            baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
            pg2 = await baglam.new_page()
            hatalar2 = []
            pg2.on("pageerror", lambda e: hatalar2.append("Betik hatası: " + str(e)))
            await pg2.goto((site / "index.html").as_uri() + "?ekran=ajanda")
            await pg2.evaluate("k => localStorage.setItem('chairman:oyun-1', k)", kayit)
            await pg2.reload()
            await pg2.wait_for_selector("#ajanda:not([hidden]) .aj-ana", timeout=20000)
            d = await pg2.evaluate(DURUM_JS)
            eski = json.loads(kayit)["veri"]
            yeni = json.loads(await pg2.evaluate(KAYIT_JS))["veri"]
            yedek = json.loads(await pg2.evaluate("localStorage.getItem('chairman:oyun-1.onceki')") or "{}")
            yazi = await pg2.inner_text("#ajanda .aj-mesaj")
            denetle(f"Sürüm {surum} kayıt ({ad}): açıldı, sürüm {SURUM} olarak yeniden yazıldı, eski kayıt yedek; para ve tarih aynı, kendi içeriği sürüyor",
                    yeni["kayitSurumu"] == SURUM and yedek.get("veri", {}).get("kayitSurumu") == surum and d["mesele"] != "" and d["icerik"] == (0, 0, 0, 1, 2)[surum]
                    and (surum == 4 or (d["soz"] == "" and d["haber"] == "")) and d["gozlem"] == "" and d["tarih"] == eski["tarih"] and d["nakit"] == eski["kulupler"]["demirkapi"]["nakit"], f"{d['tarih']} {d['mesele']} · {yazi[:80]}")
            if (surum, ad) in ((2, "indirim-bekliyor"), (3, "teklif-bekliyor")):
                await pg2.click('[data-eylem="devam"]')
                await karar_ver(pg2, d["karar"], "kabul")
                d2 = await pg2.evaluate(DURUM_JS)
                denetle(f"Sürüm {surum} kayıtta bekleyen karar verilebildi; sonradan eklenen paket açılmadı", d2["karar"] == "" and d2["olay"] == d["olay"] and "haberBekliyor" in d2["mesele"], str(d2))
            await pg2.screenshot(path=str(ARAC / f"son-akis-8-s{surum}-{ad}.png"))
            tum_hatalar += hatalar2
            await baglam.close()

        # ---- 9. başkan odası: oyunun açılış ekranı; aynı kariyer komutları, farklı sunum ----
        pg, hatalar = await oda_ac(tarayici, site, SIKISIK)
        tum_hatalar += hatalar
        d0 = await durum(pg)
        denetle("Oyun başkan odasıyla açılıyor; ajanda gizli, masada dosya ve gazete yok, dosya düğmesi kapalı",
                d0["tarih"] == "2026-11-23" and await pg.evaluate("document.getElementById('ajanda').hidden && !ODA.nesneler.dosya.g.visible && !ODA.nesneler.gazete.g.visible")
                and await pg.query_selector('.od-nesne[data-panel="dosya"][disabled]') is not None and await pg.query_selector('.od-nesne[data-panel="gazete"]') is None
                and await pg.query_selector(".od-panel") is None, str(d0))
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-acilis.png"))
        # masadaki nesneye tıklamak düğmeyle aynı paneli açar
        nokta = await pg.evaluate("""() => { const v = ODA.nesneler.ajanda.merkez.clone().project(ODA.kamera), r = document.getElementById('oda').getBoundingClientRect();
          return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; }""")
        await pg.mouse.move(nokta["x"], nokta["y"])
        await pg.mouse.click(nokta["x"], nokta["y"])
        denetle("Masadaki ajanda defterine tıklamak Ajanda panelini açtı", await pg.text_content(".od-panel h3") == "Ajanda")

        # test bilgileri: açıkken görünür, kapalıyken ekranda yok
        yazi = await pg.text_content(".od-panel")
        acik = await pg.eval_on_selector_all(".od-panel .od-test", "L => L.length")
        await pg.click('.od-nesne[data-panel="ayar"]')
        await pg.click('[data-eylem="test"]')
        await pg.keyboard.press("Digit2")
        kapali_yazi = await pg.text_content("#oda")
        kapali = await pg.eval_on_selector_all("#oda .od-test", "L => L.length")
        denetle("Test bilgileri açıkken adayların katkısı ve seçim sonucu görünür; kapalıyken ekranda hiçbiri yok",
                acik >= 3 and "katkı:" in yazi and "güçlü" in yazi and kapali == 0 and "katkı:" not in kapali_yazi and "TEST" not in kapali_yazi, f"açık {acik} kutu · kapalı {kapali}")
        await pg.click('.od-nesne[data-panel="ayar"]')
        await pg.click('[data-eylem="test"]')
        await pg.click('[data-eylem="ac"][data-panel="kadro"]')
        yazi = await pg.text_content(".od-panel")
        denetle("Kadro (TEST) paneli futbolcu özelliklerini gösteriyor", "Erdal" in yazi and "Engin" in yazi and await pg.eval_on_selector_all(".od-kadro tbody tr", "L => L.length") >= 11)
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-kadro.png"))

        await pg.keyboard.press("Digit2")
        await oda_karar(pg, "kisi-8")
        await pg.keyboard.press("Escape")
        denetle("Esc paneli kapattı; sayman seçildi ve kaydedildi", await pg.query_selector(".od-panel") is None and (await durum(pg))["sayman"] == "kisi-8"
                and json.loads(await pg.evaluate(KAYIT_JS))["veri"]["gunIciDakika"] == 690)

        # girişim: başkan hocayla görüşmeyi kendisi başlatır
        await pg.keyboard.press("Digit2")
        girisimler = await pg.eval_on_selector_all('[data-eylem="girisim"]', "L => L.map(b => b.dataset.girisim).join(',')")
        await pg.click('[data-eylem="girisim"][data-girisim="hocaGorusmesi"]')
        await oda_karar(pg, "dinle")
        d = await durum(pg)
        yazi = await pg.text_content(".od-panel")
        denetle("Girişim: hocayla görüşme ajandadan başlatıldı ve yapıldı; isteği olmadığı öğrenildi", "hocaGorusmesi" in girisimler and d["dakika"] == 735 and "isteği yok" in yazi and d["mesele"] == "", f"{girisimler} · {d['dakika']}")
        await pg.keyboard.press("Escape")

        # destek teklifi: görüş iste, görüş gelince dur
        await pg.click(".od-ana")
        d = await durum(pg)
        denetle("İlerle destek teklifinde durdu; panel kendiliğinden açılmadı, telefon yandı, dosya masaya geldi",
                d["tarih"] == "2026-11-24" and d["dakika"] == 630 and await pg.query_selector(".od-panel") is None and await pg.evaluate("ODA.durum.haber > 0 && ODA.nesneler.dosya.g.visible"), str(d))
        await pg.keyboard.press("Digit3")
        onceki = await durum(pg)
        await pg.click('.od-panel [data-eylem="tavsiye"]')
        d = await durum(pg)
        denetle("Görüş istendi: saat, para ve karar aynı; yalnız saymanın işi eklendi", d["dakika"] == onceki["dakika"] and d["nakit"] == onceki["nakit"] and d["karar"] == onceki["karar"]
                and await pg.query_selector('.od-panel [data-eylem="tavsiye"][disabled]') is not None, await pg.inner_text("#oda .od-mesaj"))
        await pg.keyboard.press("Escape")
        await pg.click(".od-ana")
        d = await durum(pg)
        await pg.keyboard.press("Digit3")
        yazi = await pg.text_content(".od-panel")
        denetle("Karar beklerken görüş beklendi: İlerle görüş gelince (12:30) durdu; görüş dosyada kaynağıyla",
                d["dakika"] == 750 and d["karar"] != "" and "Hikmet Aydın" in yazi and "Görüşü:" in yazi, (await pg.inner_text("#oda .od-mesaj"))[:120])
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-gorus.png"))
        await oda_karar(pg, "reddet")
        await pg.keyboard.press("Escape")
        await pg.click(".od-ana")
        await pg.keyboard.press("Digit2")
        await oda_karar(pg, "bekle")
        await pg.keyboard.press("Escape")
        await pg.click(".od-ana")
        d = await durum(pg)
        oda = await pg.evaluate("({haber: ODA.durum.haber, dosya: ODA.nesneler.dosya.g.visible, panel: !!document.querySelector('.od-panel'), rozet: (document.querySelector('.od-nesne[data-panel=\"telefon\"] .od-rozet') || {}).textContent || ''})")
        yazi = await pg.inner_text("#oda .od-alt")
        denetle("İlerle sponsorun haberinde durdu: panel kendiliğinden açılmadı, telefon yandı, alt şerit haberi yazdı",
                d["tarih"] == "2026-11-25" and d["dakika"] == 570 and "odemeSikismasi:kararBekliyor" in d["mesele"] and oda["haber"] > 0 and oda["dosya"] and not oda["panel"] and oda["rozet"] != "" and "Telefon" in yazi, f"{oda} · {yazi[:90]}")
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-haber.png"))
        onceki = await durum(pg)
        await pg.keyboard.press("Digit1")
        yazi = await pg.text_content(".od-panel")
        denetle("Telefon: karar bekleyen konu ve yeni haberler", "Karar sende" in yazi and "Haberler" in yazi and "Yeni" in yazi and "ertelemek istiyorlar" in yazi, yazi[:160])
        await pg.click('.od-panel [data-eylem="dosyaAc"]')
        yazi = await pg.text_content(".od-panel")
        denetle("Dosya: bilinenler kaynağıyla, karar seçenekleri dosyanın içinde; test kutusu gizli koşulu gösteriyor",
                "Bilinenler" in yazi and "Muhasebe kayıtları" in yazi and "Sponsorluk sözleşmesi" in yazi and "Sponsorun gerçek durumu: nakitSikisik" in yazi
                and await pg.eval_on_selector_all('.od-panel [data-eylem="sec"]', "L => L.map(b => b.dataset.secim).join(',')") == "kendin,devret,bakimErtele,maasGeciktir", yazi[:120])
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-dosya.png"))
        await pg.keyboard.press("Digit2")
        await pg.keyboard.press("Escape")
        sonra = await durum(pg)
        denetle("Telefon, ajanda ve dosya arasında gezmek ve kapatmak tarihi, saati, parayı ve geçmişi değiştirmedi", onceki == sonra, f"{onceki} → {sonra}")
        await pg.keyboard.press("Digit1")
        await pg.click('.od-panel [data-eylem="dosyaAc"]')
        await oda_karar(pg, "maasGeciktir")
        await pg.keyboard.press("Escape")
        d = await durum(pg)
        denetle("Maaş bekletildi: söz kaydedildi, kasa açığı kapandı", d["soz"] == "soz.maas:acik" and d["karar"] == "", str(d))

        # basın sorusu, ayar ve yenileme
        await pg.click(".od-ana")
        d = await durum(pg)
        denetle("İlerle gazetenin sorusunda (Perşembe 16:00) durdu", d["tarih"] == "2026-11-26" and d["dakika"] == 960 and "basinSorusu:kararBekliyor" in d["mesele"], str(d))
        await pg.click('.od-nesne[data-panel="ayar"]')
        await pg.click('[data-eylem="yazi"][data-yazi="buyuk"]')
        onceki = await durum(pg)
        await oda_yenile(pg)
        sonra = await durum(pg)
        denetle("Sayfa yenilenince oda aynı durumla açıldı; yazı büyüklüğü ve test ayarı korundu",
                onceki == sonra and await pg.evaluate("OYUN.ayarlar.yazi === 'buyuk' && OYUN.ayarlar.test === true")
                and "buyuk" in (await pg.evaluate("localStorage.getItem('chairman:ayarlar')") or ""), f"{onceki} → {sonra}")
        await pg.keyboard.press("Digit1")
        yazi = await pg.text_content(".od-panel")
        denetle("Dönüşte telefonda Kaldığın yer özeti", "Kaldığın yer" in yazi and "Son yaptığın" in yazi, yazi[:160])
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-donus.png"))
        await pg.click('[data-eylem="devam"]')
        await pg.click('.od-nesne[data-panel="ayar"]')
        await pg.click('[data-eylem="yazi"][data-yazi="normal"]')
        await pg.keyboard.press("Digit1")
        await pg.click('.od-panel [data-eylem="dosyaAc"]')
        await oda_karar(pg, "kendin")
        await pg.keyboard.press("Escape")
        for _ in range(8):
            if await pg.query_selector('.od-ana:has-text("Stada git")'):
                break
            await pg.click(".od-ana")
        d = await durum(pg)
        iz = await pg.evaluate("({gazete: ODA.nesneler.gazete.g.visible, kart: ODA.kart.visible, iskele: ODA.iskele, not: ODA.panoNotu.visible, yeni: ODA.durum.gazeteYeni})")
        denetle("Maç gününe gelindi: gazete masada (yeni), pencerede iskele; teşekkür kartı ve pano notu yok (maaş gecikti, pano sözü yok)",
                d["tarih"] == "2026-11-28" and d["haber"] == "gazete.maas" and iz == {"gazete": True, "kart": False, "iskele": True, "not": False, "yeni": True}, f"{iz} · {d['haber']}")
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-mac-gunu.png"))
        await pg.keyboard.press("Digit4")
        yazi = await pg.text_content(".od-panel")
        denetle("Gazete paneli: manşet başkanın açıklamasını yansıtıyor; açınca yeni işareti kalktı",
                "Demirkapı Postası" in yazi and "Başkan Demirel açıkladı" in yazi and await pg.evaluate("OYUN.kariyer.haberler.every(h => h.gorulen)"), yazi[:160])
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-gazete.png"))
        await pg.keyboard.press("Digit2")
        yazi = await pg.text_content(".od-panel")
        denetle("Ajandada verilen söz görünüyor (açık: maaş günü)", "Verdiğin sözler" in yazi and "Açık" in yazi and "10 Aralık" in yazi)
        await pg.keyboard.press("Escape")
        onceki = (await durum(pg), iz)
        await oda_yenile(pg)
        iz2 = await pg.evaluate("({gazete: ODA.nesneler.gazete.g.visible, kart: ODA.kart.visible, iskele: ODA.iskele, not: ODA.panoNotu.visible, yeni: ODA.durum.gazeteYeni})")
        denetle("Yenilemeden sonra izler aynı (gazete masada, iskele pencerede); yeni işareti kalkmış", await durum(pg) == onceki[0] and iz2 == dict(iz, yeni=False), str(iz2))
        onceki_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        await pg.click('.od-ana:has-text("Stada git")')
        await pg.wait_for_selector("#onEkran:not([hidden])", timeout=20000)
        son_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        denetle("Stada git: oda kapandı, maç bülteni açıldı; maç sınırında kayıt yapılmadı",
                await pg.evaluate("document.getElementById('oda').hidden") is True and son_kayit["gunIciDakika"] == onceki_kayit["gunIciDakika"] and len(son_kayit["isler"]) == len(onceki_kayit["isler"]))
        await pg.click("#btnIlerle")
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-sonrasi-mac.png"))
        await pg.context.close()

        pg, hatalar = await oda_ac(tarayici, site, "?baslangic=duzenli&dunya=7")
        tum_hatalar += hatalar
        await pg.click(".od-ana")
        d = await durum(pg)
        denetle("Düzenli başlangıç odada: tek İlerle ile maç günü; masada dosya yok, telefon sessiz, gazete maç önü haberiyle masada",
                d["tarih"] == "2026-11-28" and d["mesele"] == "" and d["haber"] == "gazete.macOnu" and await pg.evaluate("!ODA.nesneler.dosya.g.visible && ODA.durum.haber === 0 && ODA.nesneler.gazete.g.visible && !ODA.kart.visible")
                and await pg.query_selector('.od-ana:has-text("Stada git")') is not None, str(d))
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-duzenli.png"))
        await pg.context.close()

        # ---- 10. balkon ve antrenman gözlemi (2.7): yürüyüş, gözlem, telefonla kesilme, kısa iş, devam, dönüş ----
        pg, hatalar = await oda_ac(tarayici, site, SIKISIK)
        tum_hatalar += hatalar
        # hazırlık (ekran dışı, aynı kariyer komutlarıyla): maaş bekletilir, saat Perşembe 15:00'e getirilir; gazete 16:00'da arayacak
        await pg.evaluate("""() => { const S = { koltukSecimi: 'kisi-8', destekTeklifi: 'reddet', nakitTakvimi: 'bekle', odemeSikismasi: 'maasGeciktir' };
          for (let i = 0; i < 12; i++) {
            let yapilan = null;
            for (const x of Object.values(OYUN.kariyer.isler).filter(x => x.tur === 'ajanda' && S[x.veri.karar])) {
              const t = x.veri.karar;
              try { oyunKomut(k => ajandaIsiYap(k, x.id, S[t])); yapilan = t; break; } catch (e) { /* bugünün işi değil: ilerle */ }
            }
            if (yapilan === 'odemeSikismasi') break;
            if (!yapilan) oyunKomut(k => duragaIlerle(k));
          }
          oyunKomut(k => zamanIlerlet(k, anDakika('2026-11-26', 900) - simdikiAn(k))); }""")
        await oda_yenile(pg)
        if await pg.query_selector('[data-eylem="devam"]'):
            await pg.click('[data-eylem="devam"]')
        await pg.keyboard.press("Escape")
        d0 = await durum(pg)
        denetle("(hazırlık) Perşembe 15:00, maaş sözü açık; başkan masada, Balkona çık düğmesi var",
                d0["tarih"] == "2026-11-26" and d0["dakika"] == 900 and d0["soz"] == "soz.maas:acik" and await pg.evaluate("ODA.yer") == "masa"
                and "Balkona çık" in await pg.text_content(".od-yer") and await pg.query_selector(".od-gozlem") is None, str(d0))
        await pg.keyboard.press("Digit5")
        await pg.wait_for_function("ODA.yer === 'balkon'", timeout=15000)
        yazi = await pg.text_content(".od-gozlem")
        denetle("Balkona yüründü: yer değiştirmek tarihi, saati, parayı ve geçmişi değiştirmedi; antrenman sürüyor, izleme seçenekleri var",
                await durum(pg) == d0 and "Antrenman sürüyor" in yazi and "Odaya dön" in await pg.text_content(".od-yer")
                and await pg.eval_on_selector_all('[data-eylem="gozlem"]:not([disabled])', "L => L.map(b => b.dataset.dk).join(',')") == "15,30,120", yazi[:140])
        await pg.wait_for_timeout(1200)
        await pg.screenshot(path=str(ARAC / "son-akis-10-balkon.png"))
        await pg.click('[data-eylem="gozlem"][data-dk="120"]')
        d = await durum(pg)
        mesaj = await pg.inner_text("#oda .od-mesaj")
        denetle("Sonuna kadar izle: gazete arayınca (16:00) gözlem durdu, aralık açık kaldı (kalan 60 dk), telefon yandı",
                d["dakika"] == 960 and d["gozlem"] == "900-1020" and "basinSorusu:kararBekliyor" in d["mesele"] and "Telefon çaldı" in mesaj and await pg.evaluate("ODA.durum.haber > 0 && ODA.yer === 'balkon'"), f"{d['dakika']} {d['gozlem']} · {mesaj[:90]}")
        await pg.wait_for_selector('[data-eylem="gozlemSurdur"]', timeout=15000)
        denetle("Karar beklerken Gözleme devam et kapalı; Gözlemi bırak açık",
                await pg.query_selector('[data-eylem="gozlemSurdur"][disabled]') is not None and await pg.query_selector('[data-eylem="gozlemBirak"]:not([disabled])') is not None)
        await pg.screenshot(path=str(ARAC / "son-akis-10-balkon-durdu.png"))
        await oda_yenile(pg)
        if await pg.query_selector('[data-eylem="devam"]'):
            await pg.click('[data-eylem="devam"]')
        await pg.keyboard.press("Escape")
        denetle("Yenilemeden sonra başkan yine balkonda, gözlem aynı yerde açık", await durum(pg) == d and await pg.evaluate("ODA.yer") == "balkon" and "Gözlem durdu" in await pg.text_content(".od-gozlem"))
        await pg.keyboard.press("Digit1")
        await pg.click('.od-panel [data-eylem="dosyaAc"]')
        yazi = await pg.text_content(".od-panel")
        denetle("Dosya balkondan açıldı; uzun görüşme kapalı ve nedeni yazıyor, kısa seçenekler açık",
                "tam dikkat" in yazi and await pg.query_selector('.od-panel [data-eylem="sec"][data-secim="kendin"][disabled]') is not None
                and await pg.query_selector('.od-panel [data-eylem="sec"][data-secim="devret"]:not([disabled])') is not None, yazi[:160])
        await pg.screenshot(path=str(ARAC / "son-akis-10-balkon-dosya.png"))
        await oda_karar(pg, "devret")
        await pg.keyboard.press("Escape")
        d = await durum(pg)
        denetle("Kısa iş gözlemin içinde geçti: saat 16:15, gözlem aralığı aynı, karar kapandı", d["dakika"] == 975 and d["gozlem"] == "900-1020" and d["karar"] == "", str(d))
        await pg.click('[data-eylem="gozlemSurdur"]')
        d = await durum(pg)
        g = await pg.evaluate("OYUN.kariyer.gecmis.filter(x => x.tur === 'gozlem')")
        kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        denetle("Gözleme devam: 17:00'de bitti; geçmişte tek gözlem kaydı (15:00–17:00, 120 dk, notuyla), kayda yazıldı",
                d["dakika"] == 1020 and d["gozlem"] == "" and len(g) == 1 and g[0]["izlenen"] == 120 and g[0]["bas"] == 900 and bool(g[0].get("not"))
                and kayit["gozlem"] is None and kayit["gunIciDakika"] == 1020, f"{d['dakika']} {g}")
        await pg.wait_for_function("document.querySelector('.od-gozlem') && /Saha boş/.test(document.querySelector('.od-gozlem').textContent)", timeout=15000)
        await pg.wait_for_timeout(600)
        await pg.screenshot(path=str(ARAC / "son-akis-10-balkon-bitti.png"))
        await pg.keyboard.press("Digit5")
        await pg.wait_for_function("ODA.yer === 'masa'", timeout=15000)
        denetle("Odaya dönüldü: durum aynı, gözlem şeridi yok", await durum(pg) == d and await pg.query_selector(".od-gozlem") is None and "Balkona çık" in await pg.text_content(".od-yer"))
        await pg.wait_for_timeout(600)
        await pg.screenshot(path=str(ARAC / "son-akis-10-odaya-donus.png"))
        await pg.context.close()

        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    denetle("Sayfa ve betik hatası yok", not tum_hatalar, "; ".join(tum_hatalar[:3]))
    print("\nEkran görüntüleri: araclar/son-akis-*.png")
    print(f"BAŞARISIZ: {basarisiz} denetim" if basarisiz else "Tüm denetimler geçti")
    sys.exit(1 if basarisiz else 0)


if __name__ == "__main__":
    asyncio.run(ana())
