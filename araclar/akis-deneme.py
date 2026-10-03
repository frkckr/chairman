#!/usr/bin/env python3
"""Chairman — günlük akış denemesi (yol haritası 2.3–2.8, 2.8A–2.8O)

Oyunu başsız Chromium'da açar ve gerçek ekranı tıklayarak oynar. 2.8L'den (2026-10-02) beri oyunda senaryo içeriği yoktur:
  1. İçeriksiz yeni kariyer: oda, boş telefon (Kaldığın yer yok), iki sayfalı defter (hafta, Cumartesi maç, boş gün, hafta okları),
     kapalı dosya, İlerle ile doğrudan maç günü, yenileme.
  2. Eski kayıt (araclar/ornekler/kayit-eski-s5.json): "Kayıt açılamadı" ve nedeni; kayıt saklanıp yeni kariyer başlıyor.
  3. TEST içeriği (araclar/test-icerik.js; yalnız bu denemenin kopyaladığı index-test.html yükler): defterden randevuya katılım, İlerle'nin
     karar haberinde durması, telefonda kişi konuşması ve iki cevap, masada açık dosya (sekme, damga, ataşlı kanıtlar, iki cevap, sonuç),
     yenilemede aynı durum ve kararın bir kez uygulanması, tahsilatla sözün tutulup konunun arşive geçmesi, büyük yazıda taşma olmaması.
 12. Genel duraklatma (2.8B): oda, yürüyüş ortası, gerçek zamanlı gözlem (duraklat → kayıt aynı an → yenile → devam) ve maç.
 14. Maç öncesi ekranı (2.8J, 2.8N): iki takımın ilk 11'i ve son 5 maçı, dolan hazırlık çubuğu, en az 10 sn, duraklatma, elle geçiş.
 15. Ortak çatısız stat ve mekân (2.8D, 2.8J, 2.8O): tek tarif, balkon/pencere aynı stat, iskele, kapıya tıklama, doğal yürüyüş;
     maçta binadaki loca, geniş açıda yedek kulübeleri ve okunur tabela; oyunda topa odaklı yakın bakış ve topa kilitli dürbün.
 16. Maç telefonu (2.8F, 2.8I).
 17. Topa odaklı bakış ve maçın netliği (A akışı, 2026-10-03): belirlenimli 30 sn oyunda (1× ve 4×) top ekranın ortasında, dürbünde maskenin
     içinde; oyuncu boyu, topun çizim boyu, iç çözünürlükte 2× çizim ve D kısayolu.
 11. Oyun çerçevesi (2.8A, 2.8J, 2.8O): dış notlar/radyo/ses/çay yok, deneme ayarlarında yalnız hız ve Durdur, eski ayar kaydı, sessiz maç.
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


DURUM_JS = """() => { const k = OYUN.kariyer; const c = k.kulupler.demirkapi;
  return { tarih: k.tarih, dakika: k.gunIciDakika, nakit: c.nakit, hareket: k.hareketler.length, gecmis: k.gecmis.length,
    isler: Object.keys(k.isler).join(','), mesele: Object.values(k.meseleler).map(m => m.tur + ':' + m.durum).join(','),
    olay: Object.values(k.olaylar).map(o => o.paket + '/' + o.varyant + ':' + o.durum).join(','), baslangic: k.icerik.baslangic, icerik: k.icerik.surum,
    sayman: c.yonetim.sayman, karar: Object.values(k.isler).filter(x => x.veri.saatsiz).map(x => x.id).join(','),
    soz: Object.values(k.sozler).map(s => s.anahtar + ':' + s.durum).join(','), haber: k.haberler.map(h => h.anahtar).join(','),
    gozlem: k.gozlem ? k.gozlem.bas + '-' + k.gozlem.bitis : '' }; }"""
KAYIT_JS = "localStorage.getItem('chairman:oyun-1')"
# yürüyüş oyun içinde ~6 sn; başsız yazılım çiziminde kare hızı düşük olduğundan bekleme sınırı geniştir
YURUYUS_BEKLE = 45000


async def durum(pg):
    return await pg.evaluate(DURUM_JS)


async def sayfa(tarayici, site, sorgu, bekle, ad="index.html"):
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text)
          if m.type == "error" and "Failed to load resource" not in m.text else None)
    await pg.goto((site / ad).as_uri() + sorgu)
    await pg.wait_for_selector(bekle, timeout=20000)
    return pg, hatalar


async def oda_ac(tarayici, site, sorgu="", ad="index.html"):
    """Oyunun varsayılan açılışı: başkan odası."""
    return await sayfa(tarayici, site, sorgu, "#oda:not([hidden]) .od-ana", ad)


async def oda_yenile(pg):
    await pg.reload()
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)


async def oda_ilerle(pg):
    """İlerle'ye basar; kaçırılacak ya da cevapsız kalacak iş için onay isterse onaylar."""
    await pg.click(".od-ana")
    if await pg.query_selector('.od-ana[data-eylem="ilerle"]:has-text("Onayla")'):
        await pg.click(".od-ana")


async def bolum_1(tarayici, site, tum_hatalar):
    """İçeriksiz yeni kariyer (2.8L, 2.8M)."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    d0 = await durum(pg)
    denetle("Yeni kariyer Pazartesi 08:00; içerik sürümü 4; mesele, olay, söz ve haber yok; takvimde yalnız maç günü",
            d0["tarih"] == "2026-11-23" and d0["dakika"] == 480 and d0["icerik"] == 4 and d0["mesele"] == "" and d0["olay"] == "" and d0["soz"] == ""
            and d0["haber"] == "" and len(d0["isler"].split(",")) == 1, str(d0))
    await pg.keyboard.press("Digit1")
    tel = await pg.text_content(".od-telefonPanel")
    denetle("Telefon ana ekranla açılıyor; 'Kaldığın yer' özeti yok", "Mesajlar" in tel and "Canlı Skor" in tel and "Kaldığın" not in tel
            and await pg.query_selector('[data-eylem="devam"]') is None, tel[:80])
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    denetle("Mesajlar boş: kişi yok", "Mesaj yok" in await pg.text_content(".tel") and await pg.query_selector(".tel-kisi") is None)
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit2")
    gunler = await pg.eval_on_selector_all(".dft-gun", "L => L.map(b => b.dataset.tarih)")
    defter = await pg.text_content(".dft")
    denetle("Ajanda odanın ortasında iki sayfalı defter: perde, haftanın 7 günü (Pazartesi–Pazar), bugün daireli, Cumartesi maç işareti; bugün boş gün",
            await pg.query_selector(".od-perde") is not None and gunler[0] == "2026-11-23" and len(gunler) == 7
            and await pg.query_selector('.dft-gun.dft-bugun[data-tarih="2026-11-23"]') is not None
            and await pg.query_selector('.dft-gun[data-tarih="2026-11-28"] .dft-mac') is not None and "Boş gün" in defter, str(gunler))
    await pg.screenshot(path=str(ARAC / "son-akis-1-defter-bos.png"))
    await pg.click('.dft-gun[data-tarih="2026-11-28"]')
    cmt = await pg.text_content(".dft-sag")
    denetle("Cumartesi seçilince 19:00 maç kaydı ve kartı açılıyor; zaman değişmiyor",
            "19:00" in cmt and "Demirkapı SK – Akdeniz FK" in cmt and await pg.query_selector(".dft-ayrinti") is not None and await durum(pg) == d0, cmt[:120])
    await pg.click('[data-eylem="hafta"][data-hafta="1"]')
    g2 = await pg.eval_on_selector_all(".dft-gun", "L => L.map(b => b.dataset.tarih)")
    denetle("Hafta oku sonraki haftayı açıyor (en çok iki hafta ileri); zaman değişmedi",
            g2[0] == "2026-11-30" and await durum(pg) == d0 and await pg.query_selector('[data-eylem="hafta"][data-hafta="3"]:not([disabled])') is None, str(g2[:2]))
    await pg.click(".od-perde", position={"x": 5, "y": 300})
    denetle("Perdeye tıklamak defteri kapatıyor", await pg.query_selector(".dft") is None)
    denetle("Dosya masada yok: düğme kapalı", await pg.query_selector('.od-nesne[data-panel="dosya"][disabled]') is not None)
    await oda_ilerle(pg)
    d1 = await durum(pg)
    denetle("İlerle doğrudan Cumartesi 19:00 maç sınırına gidiyor; ana düğme 'Stada git'",
            d1["tarih"] == "2026-11-28" and d1["dakika"] == 1140 and "Stada git" in await pg.text_content(".od-ana"), str(d1))
    await oda_yenile(pg)
    rozet = await pg.query_selector('.od-nesne[data-panel="telefon"] .od-rozet')
    denetle("Yenileme aynı anda açıyor; telefonda dönüş rozeti yok", await durum(pg) == d1 and rozet is None)
    await pg.screenshot(path=str(ARAC / "son-akis-1-mac-gunu.png"))
    await pg.context.close()


async def bolum_2(tarayici, site, tum_hatalar):
    """Eski kayıt (sürüm 5) açılmaz; saklanır, yeni kariyer başlar."""
    eski = (KOK / "araclar" / "ornekler" / "kayit-eski-s5.json").read_text(encoding="utf-8")
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script("""(m => { if (!sessionStorage.getItem('__eski')) { sessionStorage.setItem('__eski', '1'); localStorage.setItem('chairman:oyun-1', m); } })(""" + json.dumps(eski) + ")")
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    await pg.goto((site / "index.html").as_uri())
    await pg.wait_for_selector(".od-bozuk", timeout=20000)
    yazi = await pg.text_content(".od-bozuk")
    denetle("Eski kayıt: 'Kayıt açılamadı' ve nedeni (eski sürüm, içerik kaldırıldı); kayda dokunulmadı",
            "Kayıt açılamadı" in yazi and "eski bir sürüm" in yazi and await pg.evaluate(KAYIT_JS) == eski, yazi[:140])
    await pg.click('[data-eylem="bozukYeni"]')
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)
    d = await durum(pg)
    denetle("Kaydı sakla, yeni kariyer: eski kayıt '.bozuk' olarak saklandı; içeriksiz yeni kariyer kuruldu",
            await pg.evaluate("localStorage.getItem('chairman:oyun-1.bozuk')") == eski and d["icerik"] == 4 and d["mesele"] == "", str(d))
    tum_hatalar += hatalar
    await baglam.close()


TASMA_JS = "() => [...document.querySelectorAll('.dsy-sayfa, .dft-sayfa, .dsy-sekmeler')].map(e => e.scrollWidth - e.clientWidth)"


async def bolum_3(tarayici, site, tum_hatalar):
    """TEST içeriğiyle defter, telefon ve masada açık dosya (2.8M)."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7", "index-test.html")
    tum_hatalar += hatalar
    await pg.keyboard.press("Digit2")
    bloklar = await pg.eval_on_selector_all(".dft-sag .dft-kayit", "L => L.map(b => b.textContent)")
    denetle("Defter: Pazartesi 11:00 randevusu ve 15:00 isteğe bağlı iş saat çizgilerinde blok; ilk bekleyen seçili, kartında Katıl",
            any("11:00 Deneme randevusu" in b for b in bloklar) and any("15:00" in b for b in bloklar)
            and await pg.query_selector('.dft-ayrinti [data-eylem="yap"]') is not None, str(bloklar))
    await pg.click('.dft-ayrinti [data-eylem="yap"]')
    if await pg.query_selector('.dft-ayrinti [data-eylem="yap"]:has-text("Onayla")'):
        await pg.click('.dft-ayrinti [data-eylem="yap"]:has-text("Onayla")')
    d = await durum(pg)
    denetle("Defterden randevuya katılım: saat 11:30; kayıt tamamlandı olarak üstü çizili", d["dakika"] == 690
            and await pg.query_selector('.dft-kayit.dft-bitti:has-text("Deneme randevusu")') is not None, str(d["dakika"]))
    await pg.screenshot(path=str(ARAC / "son-akis-3-defter.png"))
    await pg.keyboard.press("Escape")
    for _ in range(4):
        if (await durum(pg))["mesele"]:
            break
        await oda_ilerle(pg)
    d = await durum(pg)
    denetle("İlerle, Salı 10:30 karar haberinde durdu: TEST konusu açık, karar bekliyor", d["tarih"] == "2026-11-24" and d["dakika"] == 630
            and d["mesele"] == "deneme:kararBekliyor", str(d))
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    liste = await pg.text_content(".tel-liste")
    await pg.click('.tel-kisi:has-text("Berk Deneme")')
    konusma = await pg.text_content(".tel")
    cev = await pg.eval_on_selector_all(".tel .kk-cevap", "L => L.map(b => b.dataset.secim).join(',')")
    denetle("Telefon: kişi listesinde Berk Deneme cevap bekliyor; konuşmada kendi sesiyle mesaj ve iki cevap",
            "cevap bekl" in liste.replace("İ", "i").lower() and "firmamız" in konusma and cev == "kabul,devret", cev)
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit3")
    dsy = await pg.evaluate("""() => ({ sekme: document.querySelectorAll('.dsy-sekme[role="tab"]:not(.dsy-arsivSekme)').length, nokta: !!document.querySelector('.dsy-sekme .dsy-nokta'),
      damga: (document.querySelector('.dsy-damga') || {}).textContent, notlar: [...document.querySelectorAll('.dsy-not small')].map(x => x.textContent.trim()),
      cevap: [...document.querySelectorAll('.dsy .kk-cevap')].map(b => b.dataset.secim).join(','), kisi: (document.querySelector('.dsy-kisi b') || {}).textContent,
      perde: !!document.querySelector('.od-perde'), arsiv: document.querySelector('.dsy-arsivSekme').disabled })""")
    denetle("Masada açık dosya: tek sekme (cevap bekliyor noktası), 'Cevap bekliyor' damgası, ataşlı iki kanıt (defter ve saymanın görüşü), kişi ve iki cevap; arşiv boş",
            dsy["perde"] and dsy["sekme"] == 1 and dsy["nokta"] and "bekliyor" in (dsy["damga"] or "").lower() and dsy["notlar"] == ["— Deneme defteri", "— Ayla Deneme"]
            and dsy["cevap"] == "kabul,devret" and dsy["kisi"] == "Berk Deneme" and dsy["arsiv"], str(dsy))
    await pg.screenshot(path=str(ARAC / "son-akis-3-dosya.png"))
    once = await durum(pg)
    await pg.click(".dsy-gecmis summary")
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit3")
    denetle("Dosyayı kapatıp açmak ve geçmişi okumak zamanı ve kararı değiştirmiyor", await durum(pg) == once)
    await pg.click('.dsy .kk-cevap[data-secim="kabul"]')
    await pg.click(".dsy .kk-gonder")
    if await pg.query_selector(".dsy .kk-gonder"):
        await pg.click(".dsy .kk-gonder")
    d = await durum(pg)
    sonuc = await pg.text_content(".dsy-sonuc") if await pg.query_selector(".dsy-sonuc") else ""
    denetle("Dosyada karar: 'Kabul et' bir kez uygulandı; sonuç aynı sayfada; söz açık, konu haber bekliyor; sekmenin noktası kalktı",
            d["mesele"] == "deneme:haberBekliyor" and d["soz"] == "deneme.soz:acik" and "Kabul et" in sonuc and await pg.query_selector(".dsy-nokta") is None, f"{d['mesele']} · {sonuc[:60]}")
    await pg.screenshot(path=str(ARAC / "son-akis-3-dosya-sonuc.png"))
    await oda_yenile(pg)
    d2 = await durum(pg)
    kez = await pg.evaluate("OYUN.kariyer.gecmis.filter(g => g.tur === 'is' && g.sonuc && g.sonuc.karar === 'denemeKarari').length")
    denetle("Yenileme: aynı durum; karar geçmişte bir kez", d2 == d and kez == 1, f"{kez}")
    for _ in range(4):
        if "kapandi" in (await durum(pg))["mesele"]:
            break
        await oda_ilerle(pg)
    d3 = await durum(pg)
    await pg.keyboard.press("Digit3")
    arsiv = await pg.text_content(".dsy")
    damga = await pg.text_content(".dsy-damga") if await pg.query_selector(".dsy-damga") else ""
    await pg.click('.dsy-arsivSekme')
    liste = await pg.text_content(".dsy")
    denetle("Tahsilat yapılınca söz tutuldu, konu kapandı; dosya son konuyu 'Kapandı' damgasıyla açıyor, Arşiv sekmesinde listede",
            d3["soz"] == "deneme.soz:tutuldu" and d3["mesele"] == "deneme:kapandi" and "Kapandı" in damga and "Arşiv (1)" in arsiv
            and "Kapanan konular" in liste and "Deneme: destek teklifi" in liste, f"{damga} · {d3['mesele']}")
    await pg.keyboard.press("Escape")
    await pg.click('.od-nesne[data-panel="ayar"]')
    await pg.click('[data-eylem="yazi"][data-yazi="buyuk"]')
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit3")
    t1 = await pg.evaluate(TASMA_JS)
    await pg.keyboard.press("Digit2")
    t2 = await pg.evaluate(TASMA_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-3-defter-buyuk.png"))
    denetle("Büyük yazıda dosyada ve defterde yatay taşma yok", all(x <= 1 for x in t1 + t2), f"{t1} · {t2}")
    await pg.context.close()


SAHNE_JS = "() => ({ z: +ODA.zaman.toFixed(4), k: ODA.kamera.position.toArray().map(v => +v.toFixed(5)).join(','), yol: ODA.yol ? +ODA.yol.t.toFixed(4) : null, yer: ODA.yer })"
MAC_JS = """() => ({ sn: +mac.gameSec.toFixed(3), top: [mac.ball.x, mac.ball.z].map(v => +v.toFixed(3)).join(','),
  kamera: camera.position.toArray().map(v => +v.toFixed(4)).join(','), el: BK_EL.sag.g.position.toArray().map(v => +v.toFixed(4)).join(','),
  fov: +camera.fov.toFixed(5), yon: camera.quaternion.toArray().map(v => +v.toFixed(6)).join(',') })"""


def saat_metni(dk):
    return f"{dk // 60:02d}:{dk % 60:02d}"


async def bolum_12(tarayici, site, tum_hatalar):
    """Genel duraklatma (2.8B)."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    d0 = await durum(pg)
    await pg.keyboard.press("KeyP")
    s1 = await pg.evaluate(SAHNE_JS)
    await pg.wait_for_timeout(1500)
    s2 = await pg.evaluate(SAHNE_JS)
    denetle("Odada Duraklat: oda sahnesi, kamera ve kariyer saati 1,5 sn beklemede değişmedi; gösterge görünüyor, İlerle kapalı",
            s1 == s2 and await durum(pg) == d0 and await pg.is_visible("#duraklatildi") and await pg.query_selector(".od-ana[disabled]") is not None, f"{s1} → {s2}")
    await pg.keyboard.press("Digit2")
    denetle("Duraklatmada defter açılıyor (okuma serbest), karar/katılım düğmeleri kapalı",
            await pg.is_visible(".dft") and await pg.query_selector('.dft [data-eylem="yap"]:not([disabled])') is None and await durum(pg) == d0)
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(500)
    denetle("Devam: oda zamanı sürüyor, gösterge kalktı", (await pg.evaluate(SAHNE_JS))["z"] > s2["z"] and not await pg.is_visible("#duraklatildi"))
    # yürüyüş ortasında duraklat: kamera ve yol yerinde kalır; tıklamak yürüyüşü atlatmaz
    await pg.keyboard.press("Digit5")
    await pg.wait_for_timeout(700)
    await pg.keyboard.press("KeyP")
    y1 = await pg.evaluate(SAHNE_JS)
    await pg.wait_for_timeout(1500)
    await pg.mouse.click(400, 400)
    y2 = await pg.evaluate(SAHNE_JS)
    denetle("Yürüyüşün ortasında Duraklat: yol, kamera ve yer 1,5 sn sonra aynı; tıklamak yürüyüşü atlatmadı", y1 == y2 and y1["yer"] == "yolda" and y1["yol"] is not None, f"{y1} → {y2}")
    await pg.screenshot(path=str(ARAC / "son-akis-12-yuruyus-durdu.png"))
    await pg.keyboard.press("KeyP")
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    # gerçek zamanlı gözlem: Pazartesi 15:00 (hazırlık ekran dışı, aynı kariyer komutuyla)
    await pg.evaluate("() => oyunKomut(k => zamanIlerlet(k, anDakika('2026-11-23', 900) - simdikiAn(k)))")
    await oda_yenile(pg)
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    await pg.click('[data-eylem="gozlem"][data-dk="120"]')
    await pg.wait_for_function("OYUN.kariyer.gunIciDakika >= 905", timeout=15000)
    await pg.keyboard.press("KeyP")
    g1 = await durum(pg)
    k1 = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
    await pg.wait_for_timeout(2000)
    g2 = await durum(pg)
    denetle("Gözlem sürerken Duraklat: saat dakika dakika ilerlemişti, duraklatınca durdu; kayıt aynı ana yazıldı, aralık açık, ekrandaki saat kariyerin saati",
            g1 == g2 and 900 < g1["dakika"] < 1020 and g1["gozlem"] == "900-1020" and k1["gunIciDakika"] == g1["dakika"] and k1["gozlem"] is not None
            and await pg.text_content(".od-tarih span") == saat_metni(g1["dakika"]), f"{g1['dakika']} · kayıt {k1['gunIciDakika']}")
    await pg.screenshot(path=str(ARAC / "son-akis-12-gozlem-durdu.png"))
    await oda_yenile(pg)
    await pg.keyboard.press("Escape")
    denetle("Yenileme: aynı saatte, açık gözlemle balkonda; gözlem kendiliğinden akmıyor",
            await durum(pg) == g1 and await pg.evaluate("ODA.yer") == "balkon" and "Gözlem durdu" in await pg.text_content(".od-gozlem"))
    await pg.click('[data-eylem="gozlemSurdur"]')
    await pg.wait_for_function("OYUN.kariyer.gozlem === null", timeout=30000)
    g3 = await durum(pg)
    gk = await pg.evaluate("OYUN.kariyer.gecmis.filter(x => x.tur === 'gozlem')")
    denetle("Devam: aynı noktadan sürdü ve 17:00'de bitti; geçmişte tek gözlem kaydı (120 dk)",
            g3["dakika"] == 1020 and len(gk) == 1 and gk[0]["izlenen"] == 120 and gk[0]["bas"] == 900, f"{g3['dakika']} · {gk}")
    await pg.context.close()
    # maç: duraklat → motor, kamera ve eller sabit; devam edince sıçrama yok
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&hiz=4&tohum=5", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.click("#btnMacaGec")
    await pg.wait_for_timeout(2500)
    a0 = await pg.evaluate(MAC_JS)
    await pg.wait_for_timeout(1000)
    a1 = await pg.evaluate(MAC_JS)
    await pg.keyboard.press("KeyP")
    m1 = await pg.evaluate(MAC_JS)
    await pg.wait_for_timeout(1500)
    m2 = await pg.evaluate(MAC_JS)
    denetle("Maçta Duraklat: maç saati, top, kamera (yer, bakış yönü, görüş açısı) ve eller 1,5 sn sonra aynı; dürbün kapalı, gösterge açık",
            m1 == m2 and await pg.is_visible("#duraklatildi") and await pg.evaluate("btnBino.disabled") and await pg.text_content("#btnDuraklat") == "Devam", f"{m1} → {m2}")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(1000)
    m3 = await pg.evaluate(MAC_JS)
    adim = a1["sn"] - a0["sn"]
    denetle("Devam: maç aynı andan sürdü; bekleme süresi tek seferde eklenmedi (sıçrama yok)",
            0 < m3["sn"] - m2["sn"] < 2 * adim + 1, f"1 sn'de {adim:.1f} oyun sn · devamdan sonra {m3['sn'] - m2['sn']:.1f}")
    await pg.context.close()


PROGRAM_JS = "() => ({ ...ON_EKRAN.programDurumu(), faz: mac.phase, t: +mac.sen.t.toFixed(3), sn: +mac.gameSec.toFixed(3), kapali: document.getElementById('btnIlerle').disabled, acik: !document.getElementById('onEkran').hidden, cubuk: +document.querySelector('.prg-cubuk').getAttribute('aria-valuenow'), en: parseFloat(document.querySelector('.prg-cubuk i').style.width) || 0 })"


async def bolum_14(tarayici, site, tum_hatalar):
    """Maç öncesi ekranı (2.8J, 2.8N): iki takımın ilk 11'i ve son 5 maçı; dolan çubuk, 10 sn etkin hazırlık, duraklatma, elle geçiş."""
    pg, hatalar = await sayfa(tarayici, site, "?ekran=bulten&tohum=4", "#onEkran:not([hidden]) #btnIlerle")
    tum_hatalar += hatalar
    yazi = await pg.text_content("#onEkran")
    on11 = await pg.eval_on_selector_all("#onEkran .oe-saha", "L => L.map(s => s.querySelectorAll('.oe-oy').length)")
    son5 = await pg.eval_on_selector_all("#onEkran .oe-son li", "L => L.length")
    denetle("Maç öncesi: iki arma, iki takımın ilk 11'i (dizilişe göre 11'er numara ve ad), teknik direktörler, iki takımın son 5 maçı; hakem, averaj, bağlam cümlesi ve sahte yüzde yok",
            "Maç günü" in yazi and "Demirkapı İlçe Stadı" in yazi and await pg.eval_on_selector_all("#onEkran .oe-arma", "L => L.length") == 2
            and on11 == [11, 11] and son5 == 10 and yazi.count("Teknik direktör") == 2 and "Son 5 maç" in yazi and "İlk 11" in yazi
            and "Hakem" not in yazi and "Averaj" not in yazi and "en golcüsü" not in yazi and "%" not in yazi and await pg.query_selector(".prg-sayfalar") is None
            and await pg.query_selector('.prg-cubuk[role="progressbar"]') is not None, f"{on11} · {son5}")
    await pg.wait_for_timeout(3000)
    a = await pg.evaluate(PROGRAM_JS)
    denetle("3 sn sonra: Maça geç kapalı, çubuk kısmen dolu (etkin süre), maç ve tören ilerlemedi",
            a["kapali"] and 2 < a["gecen"] < 9 and 2 <= a["cubuk"] <= 8 and 15 < a["en"] < 90 and a["faz"] == "isinma" and a["t"] == 0, str(a))
    await pg.keyboard.press("KeyP")
    p1 = await pg.evaluate(PROGRAM_JS)
    await pg.wait_for_timeout(2500)
    p2 = await pg.evaluate(PROGRAM_JS)
    denetle("Duraklat hazırlık çubuğunu dondurdu; düğme kapalı ve 'Duraklatıldı' yazıyor",
            abs(p2["gecen"] - p1["gecen"]) < 0.06 and abs(p2["en"] - p1["en"]) < 1 and p2["kapali"] and "Duraklatıldı" in await pg.text_content(".prg-durum"), f"{p1['gecen']:.2f} → {p2['gecen']:.2f}")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_function("!document.getElementById('btnIlerle').disabled", timeout=20000)
    c = await pg.evaluate(PROGRAM_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-14-program-hazir.png"))
    await pg.wait_for_timeout(2000)
    d = await pg.evaluate(PROGRAM_JS)
    denetle("En az 10 sn etkin hazırlıktan sonra çubuk doldu, Maça geç açıldı; kendiliğinden maça geçilmedi",
            c["gecen"] >= 10 and c["kaynak"] and c["en"] >= 99.9 and c["cubuk"] == 10 and d["acik"] and d["faz"] == "isinma" and d["t"] == 0, str(c))
    await pg.click("#btnIlerle")
    await pg.wait_for_timeout(1500)
    e = await pg.evaluate(PROGRAM_JS)
    denetle("Maça geç tıklanınca ekran kapandı, maç günü başladı", not e["acik"] and e["t"] > 0 and await pg.is_visible("#baskanDugmeleri"), str(e))
    await pg.set_viewport_size({"width": 900, "height": 800})
    await pg.goto((site / "index.html").as_uri() + "?ekran=bulten")
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle")
    tasma = await pg.evaluate("() => { const g = document.querySelector('.prg-kart'); return [g.scrollWidth - g.clientWidth, document.getElementById('onEkran').scrollHeight - document.getElementById('onEkran').clientHeight]; }")
    denetle("Dar pencerede maç öncesi ekranında taşma yok", all(t <= 0 for t in tasma), str(tasma))
    await pg.context.close()


KAPI_JS = """() => { const v = ODA.kapiHedef.merkez.clone().project(ODA.kamera), r = document.getElementById('oda').getBoundingClientRect();
  return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; }"""
TEL_JS = """() => { BASKAN.sahne.updateMatrixWorld(true); const v = new THREE.Vector3(); BK_TEL.getWorldPosition(v); v.project(BASKAN.kamera);
  const r = document.getElementById('view').getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; }"""
TABELA_JS = """() => { const g = TABELA.grup, [w, h, dh] = TABELA.boyut; g.updateMatrixWorld(true); camera.updateMatrixWorld(true);
  const p = (x, y) => g.localToWorld(new THREE.Vector3(x, y, 0)).project(camera), a = p(-w / 2, dh), b = p(w / 2, dh + h), m = p(0, dh + h / 2);
  return { x: +m.x.toFixed(3), y: +m.y.toFixed(3), en: Math.round(Math.abs(b.x - a.x) / 2 * 640), boy: Math.round(Math.abs(b.y - a.y) / 2 * 480) }; }"""


async def bolum_15(tarayici, site, tum_hatalar):
    """Ortak çatısız stat ve mekân hareketi (2.8D, 2.8J)."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7&stat=sehir")
    tum_hatalar += hatalar
    stat = await pg.evaluate("""() => ({ tarifler: Object.keys(STADYUMLAR).join(','), ad: STAT.ad, secim: !!document.getElementById('statSeg'),
      cati: STAT.tribunler.filter(t => t.cati).length, balkon: BALKON.stat ? BALKON.stat.children.length : 0, pencere: ODA.disHep === true && ODA.dis.visible, yer: ODA.yer,
      balkonButonu: (() => { const b = document.querySelector('.od-yer'); if (!b) return null; const r = b.getBoundingClientRect(); return r.width > 2; })() })""")
    denetle("Tek kulüp stadı ve çatısız: şehir tarifi yok, ?stat=sehir güvenli varsayılana düştü; hiçbir tribünün çatısı yok; balkon aynı kurucuyla, pencere dışarı açık; görünür 'Balkona çık' düğmesi yok",
            stat["tarifler"] == "kulup" and stat["ad"] == "Demirkapı İlçe Stadı" and not stat["secim"] and stat["cati"] == 0 and stat["balkon"] > 10 and stat["pencere"] and stat["yer"] == "masa" and stat["balkonButonu"] is False, str(stat))
    iskele = await pg.evaluate("""() => { const a = BALKON.iskele.visible; odaDurum({ iskele: true }); const b = BALKON.iskele.visible; odaDurum({ iskele: false });
      const B = tribunBakimYeri(); return [a, b, BALKON.iskele.visible, B.y < 3, STAT.bakim.yer]; }""")
    denetle("Onarım iskelesi 3B olarak karşı tribünün basamaklarında (çatıya bağlı değil); yalnız iz varken görünür", iskele == [False, True, False, True, "karsi"], str(iskele))
    d0 = await durum(pg)
    nokta = await pg.evaluate(KAPI_JS)
    await pg.mouse.move(nokta["x"], nokta["y"])
    uzerinde = await pg.evaluate("[ODA.uzerinde, ODA.kapiHedef.cerceve.visible, document.getElementById('oda').title]")
    await pg.mouse.click(nokta["x"], nokta["y"])
    await pg.wait_for_timeout(150)
    y1 = await pg.evaluate("({ yer: ODA.yer, t: ODA.yol && ODA.yol.t, y: ODA.kamera.position.y, toplam: ODA.yol && ODA.yol.toplam })")
    denetle("Kapının üzerine gelince amber çerçeve ve 'Balkona çık' ipucu; tıklayınca yürüyüş başlıyor",
            uzerinde[0] == "kapi" and uzerinde[1] and "Balkona" in uzerinde[2] and y1["yer"] == "yolda" and 3 < y1["toplam"] < 9, f"{uzerinde} · {y1}")
    ornek, A = [], await pg.evaluate("({ bas: OD.adim.kalk + OD.adim.yonel, son: ODA.yol.toplam - OD.adim.otur })")
    for _ in range(120):
        o = await pg.evaluate("ODA.yol ? [+ODA.yol.t.toFixed(2), +ODA.kamera.position.y.toFixed(3), +ODA.kamera.position.z.toFixed(2), +ODA.kamera.position.x.toFixed(4)] : null")
        if o is None:
            break
        ornek.append(o)
        await pg.wait_for_timeout(120)
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    ayakta = [o[1] for o in ornek if A["bas"] + 0.3 < o[0] < A["son"] - 0.3]
    denetle("Doğal yürüyüş: göz oturuştan ayakta yüksekliğe kalkıyor, adım hissi için küçük iniş-çıkış var (yana yalpa yok), balkonda oturuşa (1,30 m) iniyor; durum değişmedi",
            len(ayakta) > 3 and min(ayakta) > 1.58 and 0.002 < max(ayakta) - min(ayakta) < 0.03 and min(o[1] for o in ornek[:3]) < 1.55 and abs(await pg.evaluate("ODA.kamera.position.y") - 1.3) < 0.01 and await durum(pg) == d0,
            f"{len(ornek)} örnek · ayakta {min(ayakta) if ayakta else '-'}–{max(ayakta) if ayakta else '-'}")
    b1 = await pg.evaluate("ODA.kamera.position.toArray().map(v => +v.toFixed(5)).join(',')")
    await pg.wait_for_timeout(1500)
    b2 = await pg.evaluate("ODA.kamera.position.toArray().map(v => +v.toFixed(5)).join(',')")
    denetle("Sakin kamera: balkonda otururken kamera salınmıyor (1,5 sn sonra aynı yer)", b1 == b2, f"{b1} → {b2}")
    await pg.screenshot(path=str(ARAC / "son-akis-15-balkon.png"))
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'masa'", timeout=YURUYUS_BEKLE)
    denetle("5 tuşu odaya döndürüyor (klavye erişimi sürüyor)", await pg.evaluate("ODA.yer") == "masa")
    await pg.wait_for_timeout(400)
    await pg.screenshot(path=str(ARAC / "son-akis-15-pencere.png"))
    await pg.context.close()
    # maç (2.8O): başkan binadaki locada, balkonun bir kat üstünde; yüksek ve geniş bakış, yedek kulübeleri görünür; tabela okunur
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&stat=sehir&tohum=5", "#btnMacaGec")
    tum_hatalar += hatalar
    k = await pg.evaluate("""() => { const t = STAT.tribunler.find(x => x.yer === 'ana'), O = tribunOlcu(t), arka = YAN_MESAFE + O.D + 0.6;
      return { y: +BASKAN_KOLTUGU.y.toFixed(2), beklenen: +(locaZemini(t) + KOLTUK_YUKSEKLIGI * 1.14).toFixed(2), balkon: +(tribunTepe('ana') + 1.8).toFixed(2),
        z: +BASKAN_KOLTUGU.z.toFixed(2), arka: -arka, goz: +(BASKAN_KOLTUGU.y + STIL.kameralar.baskan.goz).toFixed(2), aci: STIL.kameralar.baskan.aci, ad: STAT.ad }; }""")
    denetle("Maçta başkan binadaki locada: balkonun bir kat üstünde, ana tribünün arkasında; göz 12–15 m yüksekte, görüş açısı geniş; konum tarifin geometrisinden",
            k["y"] == k["beklenen"] and k["y"] > k["balkon"] + 1.5 and k["z"] < k["arka"] - 3 and 12 <= k["goz"] <= 15 and k["aci"] >= 45 and k["ad"] == "Demirkapı İlçe Stadı", str(k))
    await pg.click("#btnMacaGec")
    await pg.wait_for_function("mac.phase === 'play'", timeout=60000)
    await pg.keyboard.press("KeyP")
    # geniş bakış (maç öncesi, devre arası ve maç sonundaki oyun dışı bakış: geniş açı, odağın biraz altı): orta sahaya zorla, kulübe ve tabela
    await pg.evaluate("""() => { const K = STIL.kameralar.baskan, g = kameraGoz(); KAMERA_ZORLA = { hedef: { x: 0, y: 1 - Math.hypot(g[0], g[2]) * K.sahneEgim, z: 0 }, fov: K.aci };
      kameraUygula(curView()); camera.updateMatrixWorld(); }""")
    await pg.wait_for_timeout(300)
    t = await pg.evaluate(TABELA_JS)
    kul = await pg.evaluate("""() => KULUBELER.map(k => { const v = new THREE.Vector3(k.x, 1, k.z).project(camera); return [+v.x.toFixed(2), +v.y.toFixed(2)]; })""")
    denetle("Oyun dışı geniş bakışla orta sahaya bakarken iki yedek kulübesi de görüş alanında ve masanın üstünde kalıyor (baş çevirmeden)",
            len(kul) == 2 and all(abs(x) < 0.97 and -0.62 < y < 0.9 for x, y in kul), str(kul))
    denetle("Tek tabela başkan bakışında: oyun dışı geniş bakışla orta sahaya bakarken ekranın içinde, okunacak büyüklükte (iç çözünürlükte ≥ 60 piksel en)",
            abs(t["x"]) < 0.95 and abs(t["y"]) < 0.95 and t["en"] >= 60 and t["boy"] >= 25, str(t))
    # A akışı (2026-10-03): oyunda bakış topa odaklı ve yakın; dürbün topa kilitli. Duraklatılmışken top yerleştirilir, bakış elle ilerletilir
    odak = await pg.evaluate("""() => { KAMERA_ZORLA = null; const b = mac.ball, eski = { x: b.x, y: b.y, z: b.z, vx: b.vx, vy: b.vy, vz: b.vz, sahip: b.sahip, tasiyan: b.tasiyan };
      const v = new THREE.Vector3(), K = STIL.kameralar, R = 480 * 0.407, olc = () => { kameraUygula(curView()); camera.updateMatrixWorld(); v.set(b.x, b.y + TOP_R, b.z - MOTOR_Z).project(camera);
        const sx = (v.x + 1) * 320, sy = (1 - v.y) * 240; return { x: +v.x.toFixed(3), y: +v.y.toFixed(3), fov: +camera.fov.toFixed(2), maske: Math.min(Math.hypot(sx - 224, sy - 240), Math.hypot(sx - 416, sy - 240)) < R }; };
      const top = [];
      for (const [x, z] of [[30, 52], [-38, 12], [5, 62], [-15, 30]]) { Object.assign(b, { x, z, y: 0, vx: 0, vy: 0, vz: 0, sahip: null, tasiyan: null }); for (let i = 0; i < 150; i++) kameraAdim(1 / 60); top.push(olc()); }
      bino = true; for (let i = 0; i < 90; i++) kameraAdim(1 / 60); const d = olc(); bino = false; for (let i = 0; i < 60; i++) kameraAdim(1 / 60);
      Object.assign(b, eski); return { faz: mac.phase, top, d, oyunAci: K.baskan.oyunAci, durbunAci: K.durbun.oyunAci, aci: K.baskan.aci }; }""")
    A, D = odak["oyunAci"], odak["durbunAci"]
    denetle("Bakış topa odaklı: duraklatılmışken dört yere konan topa bakış yayla döndü; top ekranın ortasına yakın (|x| ≤ 0,15, −0,1 ≤ y ≤ 0,3; masanın üstünde), oyunda görüş açısı yakın (oyunAci), geniş açı 52°",
            odak["faz"] == "play" and odak["aci"] == 52 and all(abs(o["x"]) <= 0.15 and -0.1 <= o["y"] <= 0.3 and A[0] - 0.01 <= o["fov"] <= A[1] + 0.01 for o in odak["top"]), str(odak["top"]))
    denetle("Dürbün topa kilitli: top dürbün maskesinin içinde ve ortada, görüş açısı dürbünün oyun aralığında",
            odak["d"]["maske"] and abs(odak["d"]["x"]) <= 0.12 and abs(odak["d"]["y"]) <= 0.12 and D[0] - 0.01 <= odak["d"]["fov"] <= D[1] + 0.01, str(odak["d"]))
    await pg.screenshot(path=str(ARAC / "son-akis-15-mac.png"))
    await pg.context.close()


async def bolum_16(tarayici, site, tum_hatalar):
    """Maç telefonu (2.8F, 2.8I)."""
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&hiz=8&tohum=5", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.click("#btnMacaGec")
    await pg.wait_for_timeout(4000)
    n = await pg.evaluate(TEL_JS)
    await pg.mouse.move(n["x"], n["y"])
    await pg.mouse.click(n["x"], n["y"])
    await pg.wait_for_timeout(200)
    a = await pg.evaluate("({ acik: MAC_TELEFON.acik, nedenler: [...SUNUM.nedenler].join(','), sn: mac.gameSec, skor: mac.score.join('-') })")
    await pg.wait_for_timeout(1500)
    b = await pg.evaluate("({ sn: mac.gameSec, skor: mac.score.join('-') })")
    ana = await pg.text_content("#macTelefon")
    denetle("Masadaki telefona tıklayınca odadakiyle aynı telefon ana ekranla açıldı; 'telefon' duraklatma nedeni eklendi, maç durdu",
            a["acik"] and a["nedenler"] == "telefon" and a["sn"] == b["sn"] and await pg.is_visible("#macTelefon") and "Mesajlar" in ana and "Canlı Skor" in ana, f"{a} → {b}")
    await pg.click('#macTelefon [data-eylem="telUyg"][data-uyg="skor"]')
    await pg.click('#macTelefon [data-eylem="skorAc"]')
    yazi = await pg.text_content("#macTelefon")
    ist = await pg.evaluate("({ sut: mac.ist.sut, isabet: mac.ist.isabet, korner: mac.ist.korner, faul: mac.ist.faul, dk: mac.minuteLabel(), skor: mac.score })")
    satirlar = await pg.eval_on_selector_all(".tel-ist tbody tr", "L => L.map(r => [...r.children].map(c => c.textContent))")
    tablo = {s[1]: (s[0], s[2]) for s in satirlar}
    denetle("Canlı Skor: kendi maçın skoru ve dakikası; istatistikler motorun aynı anına ait; diğer maçlar için dürüst boş durum",
            tablo.get("Şut") == (str(ist["sut"][0]), str(ist["sut"][1])) and tablo.get("Faul") == (str(ist["faul"][0]), str(ist["faul"][1])) and tablo.get("Korner") == (str(ist["korner"][0]), str(ist["korner"][1]))
            and f"{ist['skor'][0]} – {ist['skor'][1]}" in yazi and ist["dk"] in yazi and "henüz bağlı değil" in yazi and "xG" in yazi, str(tablo))
    await pg.click('#macTelefon [data-eylem="telEv"]')
    await pg.click('#macTelefon [data-eylem="telUyg"][data-uyg="mesajlar"]')
    denetle("Mesajlar: kariyer olmadan sakin boş durum", "Mesaj yok" in await pg.text_content("#macTelefon"))
    await pg.screenshot(path=str(ARAC / "son-akis-16-telefon.png"))
    await pg.keyboard.press("Escape")
    await pg.wait_for_timeout(800)
    c = await pg.evaluate("({ acik: MAC_TELEFON.acik, nedenler: [...SUNUM.nedenler].join(','), sn: mac.gameSec })")
    denetle("Esc telefonu kapattı; tek neden olduğu için maç aynı andan sürdü", not c["acik"] and c["nedenler"] == "" and c["sn"] > b["sn"], str(c))
    await pg.keyboard.press("KeyP")
    await pg.keyboard.press("KeyT")
    t1 = await pg.evaluate("[...SUNUM.nedenler].sort().join(',')")
    await pg.keyboard.press("KeyT")
    s1 = await pg.evaluate("mac.gameSec")
    await pg.wait_for_timeout(1000)
    d = await pg.evaluate("({ nedenler: [...SUNUM.nedenler].join(','), sn: mac.gameSec, dugme: document.getElementById('btnDuraklat').textContent })")
    denetle("Elle duraklatma sürerken T ile telefon aç/kapat: telefon kapanınca yalnız kendi nedeni kalktı, maç duraklatılmış kaldı",
            t1 == "elle,telefon" and d["nedenler"] == "elle" and d["sn"] == s1 and d["dugme"] == "Devam", f"{t1} · {d}")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(600)
    denetle("Devam: maç sürüyor", await pg.evaluate("mac.gameSec") > s1)
    await pg.context.close()


ORNEK_JS = """(o) => {
  /* duraklatılmışken maçı elle ilerletir (kare döngüsü dt 0 verir); her 0,25 sn bakışı yerleştirip topu ve oyuncuları ekrana izdüşürür */
  let g = 0; while (!(mac.phase === 'play' && mac.phaseT > 1) && g < 3600) { macKare(1 / 60); g++; }
  MAC_HIZ.deger = o.hiz; if (o.bino) bino = true;
  const v = new THREE.Vector3(), R = [], f2 = x => +x.toFixed(3);
  for (let i = 1; i <= o.sure * 60; i++) { macKare(1 / 60); if (i % 15) continue;
    kameraUygula(curView()); camera.updateMatrixWorld(); okunurlukKare(); const b = mac.ball; v.set(b.x, b.y + TOP_R, b.z - MOTOR_Z).project(camera);
    const d = camera.position.distanceTo(topMesh.position), px = 2 * TOP_R * topMesh.scale.x * 240 / (d * Math.tan(camera.fov * Math.PI / 360));
    const sx = (v.x + 1) * 320, sy = (1 - v.y) * 240, boy = [];
    for (const a of AKTORLER) { const p = a.kaynak; if (!p || p.tur !== 'oyuncu' || !p.oyunda) continue; const ay = new THREE.Vector3(a.x, 0, a.z).project(camera), bas = new THREE.Vector3(a.x, 1.8 * (p.boy || 1), a.z).project(camera);
      if (Math.abs(ay.x) <= 1 && Math.abs(ay.y) <= 1) boy.push(Math.abs(bas.y - ay.y) * 240); }
    boy.sort((a, b) => a - b);
    R.push({ faz: mac.phase, x: f2(v.x), y: f2(v.y), px: +px.toFixed(2), boy: boy.length ? boy[boy.length >> 1] : null,
      maske: Math.min(Math.hypot(sx - 224, sy - 240), Math.hypot(sx - 416, sy - 240)) < 480 * 0.407 }); }
  MAC_HIZ.deger = 1; bino = false;
  const O = R.filter(r => r.faz === 'play'), n = Math.max(1, O.length), B = O.map(r => r.boy).filter(x => x != null).sort((a, b) => a - b);
  return { ornek: O.length, ic: +(O.filter(r => Math.abs(r.x) <= 0.45 && r.y >= -0.35 && r.y <= 0.45).length / n).toFixed(3),
    disarida: +(O.filter(r => Math.abs(r.x) > 1 || Math.abs(r.y) > 1).length / n).toFixed(3), maske: +(O.filter(r => r.maske).length / n).toFixed(3),
    boy: B.length ? +B[B.length >> 1].toFixed(1) : 0, topPx: O.length ? Math.min(...O.map(r => r.px)) : 0 };
}"""


# belirlenimli sayfa: tohumlu Math.random ve elle ilerleyen kare saati (araclar/an-yakala.py ile aynı düzen); kareler yalnız __kare(n) ile akar
SAAT_JS = """(() => { let s = 5 >>> 0; Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let kuyruk = [], an = 1000; window.requestAnimationFrame = f => { kuyruk.push(f); return kuyruk.length; }; window.cancelAnimationFrame = () => {}; performance.now = () => an;
  window.__kare = n => { for (let i = 0; i < n; i++) { an += 1000 / 60; const q = kuyruk; kuyruk = []; for (const f of q) f(an); } }; })();"""


async def bolum_17(tarayici, site, tum_hatalar):
    """Topa odaklı bakış ve maçın netliği (A akışı, 2026-10-03). Sayfa tohumlu ve elle saatli: örnekler her çalıştırmada aynıdır."""
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script(SAAT_JS)
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
    await pg.goto((site / "index.html").as_uri() + "?ekran=mac&tohum=5")
    await pg.wait_for_selector("#btnMacaGec", timeout=30000)
    await pg.evaluate("__kare(2)")
    cizim = await pg.evaluate("({ rt: [rtMac.width, rtMac.height], oda: [rt.width, rt.height], tuval: [renderer.domElement.width, renderer.domElement.height], ic: [RW, RH], ornek: STIL.ekran.ornekleme })")
    denetle("Maç sahnesi iç çözünürlüğün 2 katında çiziliyor (1280×960), iç çözünürlük 640×480; oda 640×480 hedefte; tuval tam sayı katında",
            cizim["rt"] == [1280, 960] and cizim["ic"] == [640, 480] and cizim["oda"] == [640, 480] and cizim["tuval"][0] % 640 == 0 and cizim["tuval"][0] * 3 == cizim["tuval"][1] * 4, str(cizim))
    await pg.click("#btnMacaGec")
    o1 = await pg.evaluate(ORNEK_JS, {"sure": 30, "hiz": 1, "bino": False})
    o4 = await pg.evaluate(ORNEK_JS, {"sure": 30, "hiz": 4, "bino": False})
    ob = await pg.evaluate(ORNEK_JS, {"sure": 20, "hiz": 1, "bino": True})
    for ad, o in (("1×", o1), ("4×", o4)):
        denetle(f"Belirlenimli 30 sn oyunda ({ad}) top 0,25 sn'lik örneklerin ≥ %90'ında ekranın ortasında (|x| ≤ 0,45, −0,35 ≤ y ≤ 0,45), ≤ %1'inde ekran dışında",
                o["ornek"] >= 40 and o["ic"] >= 0.9 and o["disarida"] <= 0.01, str(o))
    denetle("Oyunda oyuncu boyu ortancası ≥ 18 piksel, top çizimde ≥ 3 piksel", o1["boy"] >= 18 and o1["topPx"] >= 2.95, f"{o1['boy']} px · top en az {o1['topPx']} px")
    denetle("Dürbün açıkken top örneklerin ≥ %85'inde maskenin içinde", ob["ornek"] >= 30 and ob["maske"] >= 0.85, str(ob))
    # D kısayolu dürbünü açar (eller kaldırınca maske, ~0,5 sn) ve kapatır
    await pg.keyboard.press("KeyD")
    await pg.evaluate("__kare(45)")
    acik = await pg.evaluate("({ bino, basili: btnBino.getAttribute('aria-pressed'), kisayol: btnBino.getAttribute('aria-keyshortcuts') })")
    await pg.evaluate("__kare(30)")
    await pg.screenshot(path=str(ARAC / "son-akis-17-durbun.png"))
    await pg.keyboard.press("KeyD")
    await pg.evaluate("__kare(90)")
    kapali = await pg.evaluate("({ bino, basili: btnBino.getAttribute('aria-pressed') })")
    denetle("D tuşu dürbünü açıyor (eller kaldırınca maske) ve kapatıyor; düğme durumu eşleşiyor", acik["bino"] and acik["basili"] == "true" and acik["kisayol"] == "D" and not kapali["bino"] and kapali["basili"] == "false", f"{acik} · {kapali}")
    await pg.screenshot(path=str(ARAC / "son-akis-17-mac.png"))
    tum_hatalar += hatalar
    await baglam.close()


async def ana():
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright && python3 -m playwright install chromium")
    site = kontrol.kopya_hazirla(kontrol.yerel_three())
    # TEST içerikli sayfa: oyunun kopyasına yalnız bu deneme için eklenir (oyun içerik yüklemez)
    idx = (site / "index.html").read_text(encoding="utf-8")
    ek = '<script src="js/baslangic.js"></script>\n<script src="araclar/test-icerik.js"></script>\n<script>BASLANGIC_EKLERI.push(k => testIcerikKur(k));</script>'
    (site / "index-test.html").write_text(idx.replace('<script src="js/baslangic.js"></script>', ek), encoding="utf-8")
    tum_hatalar = []
    async with async_playwright() as p:
        tarayici = await p.chromium.launch(
            args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])

        print("\n1. İçeriksiz yeni kariyer")
        await bolum_1(tarayici, site, tum_hatalar)
        print("\n2. Eski kayıt")
        await bolum_2(tarayici, site, tum_hatalar)
        print("\n3. TEST içeriği: defter, telefon, masada açık dosya")
        await bolum_3(tarayici, site, tum_hatalar)
        print("\n12. Genel duraklatma")
        await bolum_12(tarayici, site, tum_hatalar)
        print("\n14. Maç öncesi ekranı")
        await bolum_14(tarayici, site, tum_hatalar)
        print("\n15. Stat, mekân ve başkanın locası")
        await bolum_15(tarayici, site, tum_hatalar)
        print("\n16. Maç telefonu")
        await bolum_16(tarayici, site, tum_hatalar)
        print("\n17. Topa odaklı bakış ve maçın netliği")
        await bolum_17(tarayici, site, tum_hatalar)
        print("\n11. Oyun çerçevesi")
        # ---- 11. oyun çerçevesi temizliği (2.8A, 2.8J): dış notlar, ses, çay ve yazılı spiker yok; eski ayarlar açılıyor ----
        baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
        await baglam.add_init_script("""window.__sesSayaci = 0; for (const ad of ['AudioContext', 'webkitAudioContext']) if (window[ad]) {
          const A = window[ad]; window[ad] = function (...a) { window.__sesSayaci++; return new A(...a); }; }""")
        # eski (2.5–2.8F) ayar kaydı: ses, sessiz ve hareket anahtarları vardı
        await baglam.add_init_script("""if (!sessionStorage.getItem('__ayarYazildi')) { sessionStorage.setItem('__ayarYazildi', '1');
          localStorage.setItem('chairman:ayarlar', JSON.stringify({ ses: 0.3, sessiz: true, yazi: 'buyuk', test: false, hareket: true })); }""")
        pg = await baglam.new_page()
        hatalar = []
        pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
        await pg.goto((site / "index.html").as_uri() + "?dunya=7")
        await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)
        cerceve = await pg.evaluate("""() => ({ ust: !!document.querySelector('header.top, .rules, .pal, .radyo, #radyoMetin, #radyoSkor'),
          gelistirici: !!document.querySelector('details.gelistirici:not([open]) #hizSeg'), santra: (document.getElementById('btnMacaGec') || {}).textContent,
          ayarlar: [...document.querySelectorAll('details.gelistirici button, details.gelistirici input')].map(b => b.id || b.dataset.hiz).join(',') })""")
        denetle("Çerçeve temiz: başlık, kurallar, palet ve radyo satırı yok; deneme ayarlarında yalnız maç hızı ve Durdur (doluluk, zemin, baştan başlat yok); 'Santraya geç'",
                not cerceve["ust"] and cerceve["gelistirici"] and cerceve["santra"] == "Santraya geç" and cerceve["ayarlar"] == "1,2,4,8,btnDurdur", str(cerceve))
        ayar = await pg.evaluate("({ a: OYUN.ayarlar.yazi, t: OYUN.ayarlar.test, kayit: JSON.parse(localStorage.getItem('chairman:ayarlar')) })")
        denetle("Eski ayar kaydı açıldı: yazı büyüklüğü ve test ayarı korundu, ses ve hareket anahtarları düştü",
                ayar["a"] == "buyuk" and ayar["t"] is False and "ses" not in ayar["kayit"] and "sessiz" not in ayar["kayit"] and "hareket" not in ayar["kayit"], str(ayar))
        await pg.keyboard.press("Digit2")
        await pg.keyboard.press("Digit1")
        await pg.click('.od-nesne[data-panel="ayar"]')
        ayar_yazi = await pg.text_content(".od-panel")
        await pg.keyboard.press("Escape")
        await pg.keyboard.press("Digit5")
        await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
        ses = await pg.evaluate("({ sayac: window.__sesSayaci, tanim: ['sesCal', 'sesBaslat', 'sesOrtam', 'sesAyarla', 'SES'].filter(a => a in window), cay: typeof BK_CAY !== 'undefined' || typeof BK_BUHAR !== 'undefined', soyle: typeof soyle !== 'undefined' })")
        denetle("Ses yok: paneller ve balkon sonrası ses bağlamı kurulmadı, ses işlevleri tanımsız, ayarlarda Ses ya da Hareket bölümü yok; çay ve spiker işlevi yok",
                ses["sayac"] == 0 and not ses["tanim"] and not ses["cay"] and not ses["soyle"] and "Ses" not in ayar_yazi and "Hareket" not in ayar_yazi, str(ses))
        await pg.goto((site / "index.html").as_uri() + "?ekran=mac&hiz=16&tohum=3")
        await pg.wait_for_timeout(1500)
        await pg.click("#btnMacaGec")
        await pg.wait_for_timeout(8000)
        mac = await pg.evaluate("({ faz: mac.phase, sn: Math.round(mac.gameSec), sut: mac.ist.sut.join('-'), sayac: window.__sesSayaci, kuyruk: olayKuyrugu.length })")
        denetle("Maç sessiz ve spikersiz oynanıyor: santradan sonra olaylar işleniyor, istatistik üretiliyor",
                mac["faz"] not in ("isinma", "giris", "toren", "selam", "yazitura") and mac["sn"] > 0 and mac["sayac"] == 0 and not hatalar, str(mac))
        await pg.screenshot(path=str(ARAC / "son-akis-11-mac.png"))
        tum_hatalar += hatalar
        await baglam.close()

        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    denetle("Sayfa ve betik hatası yok", not tum_hatalar, "; ".join(tum_hatalar[:3]))
    print("\nEkran görüntüleri: araclar/son-akis-*.png")
    print(f"BAŞARISIZ: {basarisiz} denetim" if basarisiz else "Tüm denetimler geçti")
    sys.exit(1 if basarisiz else 0)


if __name__ == "__main__":
    asyncio.run(ana())
