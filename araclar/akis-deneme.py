#!/usr/bin/env python3
"""Chairman — günlük akış denemesi (yol haritası 2.3–2.8, 2.8A–2.8F)

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
 10. Balkon ve antrenman gözlemi (2.7).
 11. Oyun çerçevesi temizliği (2.8A): dış notlar/radyo/ses/çay yok, eski ses ayarlı kayıt açılıyor, maç sessiz oynanıyor.
 12. Genel duraklatma (2.8B): oda, yürüyüş ortası, gerçek zamanlı gözlem (duraklat → kayıt aynı an → yenile → devam) ve maç.
 13. Başkanlık ekranları (2.8C): telefon konuşmaları ve dönüş, dosya sayaçları/arşiv/test simgesi, ajanda günleri ve kasa, gezintinin
     durumu değiştirmemesi, karar sonrası aynı dosya, yeni konunun açık dosyayı değiştirmemesi, hareket azaltma, görüntü kaydı, taşma.
 14. Maç programı (2.8E): en az 10 sn etkin hazırlık, sayfa değişimi sayacı sıfırlamaz, duraklatma sayacı durdurur, kendiliğinden geçiş yok.
 15. Ortak stat ve mekân hareketi (2.8D): tek tarif, ?stat=sehir yok sayılır, balkon/pencere aynı stat, 3B iskele, kapıya tıklama, doğal yürüyüş, yüksek koltuk.
 16. Maç telefonu (2.8F): masadaki telefona tıklama, 'telefon' duraklatma nedeni, Canlı Skor istatistiği motorla aynı an, Esc/T, elle duraklatmayla bağımsızlık.
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


async def ayar_ac(pg, bolum):
    """Ayarlar panelini açar ve bölümünü seçer (2.8C: Görüntü/Hareket, Okuma, Kayıt, Geliştirici)."""
    if await pg.query_selector('.od-panel[aria-label="Ayarlar"]') is None:
        await pg.click('.od-nesne[data-panel="ayar"]')
    await pg.click(f'[data-eylem="ayarBolum"][data-bolum="{bolum}"]')


async def oda_karar(pg, secim):
    """Açık paneldeki kararda seçeneği seçer ve uygular."""
    await pg.click(f'.od-panel [data-eylem="sec"][data-secim="{secim}"]')
    await pg.click('.od-panel [data-eylem="yap"]')


SAHNE_JS = "() => ({ z: +ODA.zaman.toFixed(4), k: ODA.kamera.position.toArray().map(v => +v.toFixed(5)).join(','), yol: ODA.yol ? +ODA.yol.t.toFixed(4) : null, yer: ODA.yer })"
MAC_JS = """() => ({ sn: +mac.gameSec.toFixed(3), top: [mac.ball.x, mac.ball.z].map(v => +v.toFixed(3)).join(','),
  kamera: camera.position.toArray().map(v => +v.toFixed(4)).join(','), el: BK_EL.sag.g.position.toArray().map(v => +v.toFixed(4)).join(',') })"""


def saat_metni(dk):
    return f"{dk // 60:02d}:{dk % 60:02d}"


async def bolum_12(tarayici, site, tum_hatalar):
    """Genel duraklatma (2.8B)."""
    pg, hatalar = await oda_ac(tarayici, site, "?baslangic=duzenli&dunya=7")
    tum_hatalar += hatalar
    d0 = await durum(pg)
    await pg.keyboard.press("KeyP")
    s1 = await pg.evaluate(SAHNE_JS)
    await pg.wait_for_timeout(1500)
    s2 = await pg.evaluate(SAHNE_JS)
    denetle("Odada Duraklat: oda sahnesi, kamera ve kariyer saati 1,5 sn beklemede değişmedi; gösterge görünüyor, İlerle kapalı",
            s1 == s2 and await durum(pg) == d0 and await pg.is_visible("#duraklatildi") and await pg.query_selector(".od-ana[disabled]") is not None, f"{s1} → {s2}")
    await pg.keyboard.press("Digit2")
    denetle("Duraklatmada panel açılıyor (okuma serbest), karar/katılım düğmeleri kapalı",
            await pg.text_content(".od-panel h3") == "Ajanda" and await pg.query_selector('.od-panel [data-eylem="yap"]:not([disabled])') is None and await durum(pg) == d0)
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(500)
    denetle("Devam: oda hareketi sürüyor, gösterge kalktı", (await pg.evaluate(SAHNE_JS))["z"] > s2["z"] and not await pg.is_visible("#duraklatildi"))
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
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=15000)
    # gerçek zamanlı gözlem: Pazartesi 15:00 (hazırlık ekran dışı, aynı kariyer komutuyla)
    await pg.evaluate("() => oyunKomut(k => zamanIlerlet(k, anDakika('2026-11-23', 900) - simdikiAn(k)))")
    await oda_yenile(pg)
    if await pg.query_selector('[data-eylem="devam"]'):
        await pg.click('[data-eylem="devam"]')
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=15000)
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
    if await pg.query_selector('[data-eylem="devam"]'):
        await pg.click('[data-eylem="devam"]')
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
    denetle("Maçta Duraklat: maç saati, top, kamera ve eller 1,5 sn sonra aynı; dürbün kapalı, gösterge açık",
            m1 == m2 and await pg.is_visible("#duraklatildi") and await pg.evaluate("btnBino.disabled") and await pg.text_content("#btnDuraklat") == "Devam", f"{m1} → {m2}")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(1000)
    m3 = await pg.evaluate(MAC_JS)
    adim = a1["sn"] - a0["sn"]
    denetle("Devam: maç aynı andan sürdü; bekleme süresi tek seferde eklenmedi (sıçrama yok)",
            0 < m3["sn"] - m2["sn"] < 2 * adim + 1, f"1 sn'de {adim:.1f} oyun sn · devamdan sonra {m3['sn'] - m2['sn']:.1f}")
    await pg.context.close()


CARSAMBA_JS = """() => { const S = { koltukSecimi: 'kisi-8', destekTeklifi: 'reddet', nakitTakvimi: 'bekle' };
  for (let i = 0; i < 12; i++) {
    if (Object.values(OYUN.kariyer.meseleler).some(m => m.tur === 'odemeSikismasi')) break;
    let yapilan = null;
    for (const x of Object.values(OYUN.kariyer.isler).filter(x => x.tur === 'ajanda' && S[x.veri.karar])) {
      try { oyunKomut(k => ajandaIsiYap(k, x.id, S[x.veri.karar])); yapilan = 1; break; } catch (e) { /* bugünün işi değil */ }
    }
    if (!yapilan) oyunKomut(k => duragaIlerle(k));
  } }"""
TASMA_JS = "() => { const e = document.querySelector('.od-panel .od-icerik'); return e ? e.scrollWidth - e.clientWidth : -1; }"


async def bolum_13(tarayici, site, tum_hatalar):
    """Başkanlık ekranları (2.8C): dosya, arşiv, telefon, ajanda, kasa, ayarlar."""
    pg, hatalar = await oda_ac(tarayici, site, SIKISIK)
    tum_hatalar += hatalar
    # hazırlık (ekran dışı, aynı kariyer komutları): Çarşamba 09:30, sponsor haberi geldi, destek teklifi kapandı
    await pg.evaluate(CARSAMBA_JS)
    await oda_yenile(pg)
    if await pg.query_selector('[data-eylem="devam"]'):
        await pg.click('[data-eylem="devam"]')
    await pg.keyboard.press("Escape")
    d0 = await durum(pg)
    denetle("(hazırlık) Çarşamba 09:30: sponsor kararı bekliyor, destek teklifi kapanmış", d0["dakika"] == 570 and "odemeSikismasi:kararBekliyor" in d0["mesele"] and "kosulluDestek:kapandi" in d0["mesele"], str(d0))
    taşmalar = []
    # telefon: konuşmalar arasında gez, dosyaya git, aynı konuşmaya dön
    await pg.keyboard.press("Digit1")
    taşmalar.append(await pg.evaluate(TASMA_JS))
    ilk = await pg.get_attribute('.od-konusmalar [aria-pressed="true"]', "data-mesele")
    await pg.click('.od-gezinti [data-eylem="mesaj"]:has-text("Sonraki")')
    ikinci = await pg.get_attribute('.od-konusmalar [aria-pressed="true"]', "data-mesele")
    await pg.click('.od-konusma [data-eylem="dosyaAc"]')
    dosya_baslik = await pg.text_content(".od-dosyaBaslik")
    mesaja_don = await pg.query_selector('[data-eylem="donus"]:has-text("Mesaja dön")') is not None
    await pg.click('[data-eylem="donus"]')
    donulen = await pg.get_attribute('.od-konusmalar [aria-pressed="true"]', "data-mesele")
    denetle("Telefon: Mesajlar ve Canlı Skor; konuşmalar arasında gezilir, dosyadan '◂ Mesaja dön' aynı konuşmaya döner",
            ilk != ikinci and mesaja_don and donulen == ikinci and bool(dosya_baslik) and await pg.query_selector('[data-eylem="uyg"][data-uyg="skor"]') is not None, f"{ilk} → {ikinci} → {donulen}")
    await pg.click('[data-eylem="uyg"][data-uyg="skor"]')
    yazi = await pg.text_content(".od-panel")
    denetle("Canlı Skor: bugün maç yok, sıradaki maç ve 'diğer maç verileri henüz bağlı değil' dürüstçe yazıyor", "Bugün maç yok" in yazi and "Sıradaki maç" in yazi and "henüz bağlı değil" in yazi, yazi[:120])
    await pg.click('[data-eylem="uyg"][data-uyg="mesajlar"]')
    # dosya: kategori, ne oldu, sayaçlar, arşiv; test simgesi (cevap bekleyen konuşmadan açılır)
    await pg.click(f'.od-konusmalar [data-mesele="{ilk}"]')
    await pg.click('.od-konusma [data-eylem="dosyaAc"]')
    yazi = await pg.text_content(".od-panel")
    alt = await pg.text_content(".od-panelAlt")
    denetle("Dosya: kategori, başlık, son cevap, 'Ne oldu?', karar ve ayrı geçmiş; altta önceki/sıradaki ve sayaçlar",
            "Mali" in yazi and "Son cevap" in yazi and "Ne oldu?" in yazi and "Karar sende" in yazi and "Geçmiş ve belgeler" in yazi
            and "1 açık" in alt and "1 cevap bekleyen" in alt and "Arşiv (1)" in alt and await pg.query_selector(".od-sekmeler") is None, alt)
    taşmalar.append(await pg.evaluate(TASMA_JS))
    simge = await pg.query_selector(".od-dosyaUst .od-testSimge")
    await simge.click()
    denetle("Test simgesi tıklayınca bilgi kutusu açılır; kariyer değişmez",
            await pg.get_attribute(".od-dosyaUst .od-testSimge", "aria-expanded") == "true" and await pg.is_visible(".od-dosyaUst .od-test") and await durum(pg) == d0)
    await pg.click('[data-eylem="arsiv"]')
    arsiv = await pg.text_content(".od-panel .od-icerik")
    await pg.click('.od-icerik [data-eylem="dosyaAc"]')
    kapali = await pg.text_content(".od-panel")
    await pg.click('.od-panelAlt [data-eylem="dosyaAc"]:has-text("Sıradaki")')
    acik_dosya = await pg.text_content(".od-dosyaBaslik")
    denetle("Arşiv ayrı açılır: kapanan destek dosyası listede ve okunabiliyor; Sıradaki açık dosyaya döndürüyor",
            "Arşiv" in arsiv and "destek" in arsiv and "Kapandı" in kapali and "Sponsor" in acik_dosya, acik_dosya)
    # ajanda: gün seçici, gelecek gün, girişim ve söz bölümleri, kasa
    await pg.keyboard.press("Digit2")
    taşmalar.append(await pg.evaluate(TASMA_JS))
    karar_baglanti = await pg.query_selector('.od-panel [data-eylem="dosyaAc"][data-donus="ajanda"]') is not None
    await pg.click('[data-eylem="gun"][data-tarih="2026-11-28"]')
    yazi = await pg.text_content(".od-panel")
    await pg.click('[data-eylem="ajSekme"][data-sekme="girisim"]')
    await pg.click('[data-eylem="ajSekme"][data-sekme="soz"]')
    await pg.click('[data-eylem="ajSekme"][data-sekme="gun"]')
    await pg.click('.od-panel [data-eylem="ac"][data-panel="kasa"]')
    kasa = await pg.text_content(".od-panel")
    taşmalar.append(await pg.evaluate(TASMA_JS))
    denetle("Ajanda: bağlı karar dosyaya yönlendiriyor; Cumartesi seçilince maç randevusu görünüyor; kasa ayrı panelde ödeme tarihleriyle",
            karar_baglanti and "Maç: Demirkapı SK – Akdeniz FK" in yazi and "28 Kasım Cumartesi" in yazi and "Kasadaki para" in kasa and "Kasım maaşları" in kasa and "Ödeme takvimi" in kasa, kasa[:100])
    denetle("Telefon, dosya, arşiv, ajanda günleri, sekmeler, kasa ve test simgesi arasında gezmek tarihi, saati, parayı ve geçmişi değiştirmedi", await durum(pg) == d0, str(await durum(pg)))
    # karar: aynı dosya açık kalır, sonucu orada görünür; otomatik sonraki dosyaya geçilmez
    await pg.keyboard.press("Digit3")
    once_baslik = await pg.text_content(".od-dosyaBaslik")
    await oda_karar(pg, "maasGeciktir")
    sonra = await pg.text_content(".od-panel")
    denetle("Karar sonrası aynı dosya açık, kısa sonuç orada görünüyor", await pg.text_content(".od-dosyaBaslik") == once_baslik and "Sonuç" in sonra and await pg.text_content(".od-panel h3") == "Dosya", sonra[:140])
    # yeni haber açık dosyayı değiştirmez: İlerle → gazetenin sorusu gelir; dosya yine önceki konuyla açılır, yeni konu sıranın sonunda
    await pg.keyboard.press("Escape")
    await pg.click(".od-ana")
    d = await durum(pg)
    await pg.keyboard.press("Digit3")
    denetle("Yeni konu geldi (gazetenin sorusu); dosya yine kaldığın konuyla açılıyor, yeni konu 'Sıradaki dosya'da",
            "basinSorusu:kararBekliyor" in d["mesele"] and await pg.text_content(".od-dosyaBaslik") == once_baslik and "2 açık" in await pg.text_content(".od-panelAlt"), d["mesele"])
    await pg.keyboard.press("BracketRight")
    denetle("Klavye ']' sıradaki dosyayı açar", "Postası" in await pg.text_content(".od-dosyaBaslik"))
    # ayarlar: bölümler; hareket azaltma yenilemede korunur ve yürüyüşü atlar; görüntü kaydı
    await ayar_ac(pg, "goruntu")
    await pg.click('[data-eylem="hareket"]')
    await ayar_ac(pg, "gelistirici")
    async with pg.expect_download() as indirme:
        await pg.click('[data-eylem="goruntu"]')
    ad = (await indirme.value).suggested_filename
    d_once = await durum(pg)
    await oda_yenile(pg)
    if await pg.query_selector('[data-eylem="devam"]'):
        await pg.click('[data-eylem="devam"]')
    await pg.keyboard.press("Escape")
    hareket = await pg.evaluate("[OYUN.ayarlar.hareket, SUNUM.hareketAz]")
    await pg.keyboard.press("Digit5")
    await pg.wait_for_timeout(200)
    denetle("Hareket azaltma yenilemede korunuyor ve balkona yürüyüşü atlıyor; Görüntüyü kaydet PNG indirdi, kariyer değişmedi",
            hareket == [True, True] and await pg.evaluate("ODA.yer") == "balkon" and ad.startswith("chairman-") and ad.endswith(".png") and await durum(pg) == d_once, f"{hareket} · {ad}")
    # büyük yazıda taşma yok
    await ayar_ac(pg, "okuma")
    await pg.click('[data-eylem="yazi"][data-yazi="buyuk"]')
    for tus in ("Digit1", "Digit2", "Digit3"):
        await pg.keyboard.press(tus)
        taşmalar.append(await pg.evaluate(TASMA_JS))
    await pg.screenshot(path=str(ARAC / "son-akis-13-buyuk-dosya.png"))
    denetle("Normal ve büyük yazıda panellerde yatay taşma yok", all(t == 0 for t in taşmalar), str(taşmalar))
    await pg.context.close()


PROGRAM_JS = "() => ({ ...ON_EKRAN.programDurumu(), faz: mac.phase, t: +mac.sen.t.toFixed(3), sn: +mac.gameSec.toFixed(3), kapali: document.getElementById('btnIlerle').disabled, acik: !document.getElementById('onEkran').hidden })"


async def bolum_14(tarayici, site, tum_hatalar):
    """Maç programı (2.8E): 10 sn etkin hazırlık, kaynak hazırlığı, sayfa değişimi, duraklatma, elle geçiş."""
    pg, hatalar = await sayfa(tarayici, site, "?ekran=bulten&tohum=4", "#onEkran:not([hidden]) #btnIlerle")
    tum_hatalar += hatalar
    yazi = await pg.text_content("#onEkran")
    denetle("Program açık kâğıt kitapçık: Kapak (karşılaşma, saat, yer, stat planı), Kadrolar, Lig sayfaları; sahte yüzde yok",
            "Maç programı" in yazi and "Demirkapı İlçe Stadı" in yazi and await pg.query_selector("#onEkran svg.prg-stat") is not None
            and await pg.eval_on_selector_all(".prg-sayfalar button", "L => L.map(b => b.textContent).join(',')") == "Kapak,Kadrolar,Lig" and "%" not in yazi)
    await pg.wait_for_timeout(3000)
    a = await pg.evaluate(PROGRAM_JS)
    denetle("3 sn sonra: Maça geç kapalı, 'Maç hazırlanıyor…' yazıyor; maç ve tören ilerlemedi",
            a["kapali"] and "hazırlanıyor" in await pg.text_content(".prg-hazirlik") and a["faz"] == "isinma" and a["t"] == 0 and 2 < a["gecen"] < 9, str(a))
    await pg.click('.prg-sayfalar [data-sayfa="kadrolar"]')
    k_yazi = await pg.text_content('.prg-govde[data-sayfa="kadrolar"]')
    await pg.click('.prg-sayfalar [data-sayfa="lig"]')
    b = await pg.evaluate(PROGRAM_JS)
    denetle("Sayfa değiştirmek sayacı sıfırlamadı; kadrolar hocanın olası 11'i, lig puan durumu",
            b["gecen"] >= a["gecen"] and "Olası 11" in k_yazi and "teknik direktörler belirler" in k_yazi and await pg.is_visible('.prg-govde[data-sayfa="lig"] .oe-tablo'), f"{a['gecen']:.2f} → {b['gecen']:.2f}")
    await pg.keyboard.press("KeyP")
    p1 = await pg.evaluate(PROGRAM_JS)
    await pg.wait_for_timeout(2500)
    p2 = await pg.evaluate(PROGRAM_JS)
    denetle("Duraklat hazırlık sayacını durdurdu; düğme kapalı ve 'Duraklatıldı' yazıyor",
            abs(p2["gecen"] - p1["gecen"]) < 0.06 and p2["kapali"] and "Duraklatıldı" in await pg.text_content(".prg-hazirlik"), f"{p1['gecen']:.2f} → {p2['gecen']:.2f}")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_function("!document.getElementById('btnIlerle').disabled", timeout=20000)
    c = await pg.evaluate(PROGRAM_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-14-program-hazir.png"))
    await pg.wait_for_timeout(2000)
    d = await pg.evaluate(PROGRAM_JS)
    denetle("En az 10 sn etkin hazırlıktan sonra Maça geç açıldı; kendiliğinden maça geçilmedi",
            c["gecen"] >= 10 and c["kaynak"] and d["acik"] and d["faz"] == "isinma" and d["t"] == 0, str(c))
    await pg.click("#btnIlerle")
    await pg.wait_for_timeout(1500)
    e = await pg.evaluate(PROGRAM_JS)
    denetle("Maça geç tıklanınca program kapandı, maç günü başladı", not e["acik"] and e["t"] > 0 and await pg.is_visible("#baskanDugmeleri"), str(e))
    # büyük yazı tercihi programa uygulanmaz ama dar pencerede taşma olmamalı: 900 px genişlikte kapak ve lig
    await pg.set_viewport_size({"width": 900, "height": 800})
    await pg.goto((site / "index.html").as_uri() + "?ekran=bulten")
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle")
    tasma = await pg.evaluate("() => [...document.querySelectorAll('.prg-govde')].map(g => { g.hidden = false; const t = g.scrollWidth - g.clientWidth; return t; })")
    denetle("Dar pencerede program sayfalarında yatay taşma yok", all(t <= 0 for t in tasma), str(tasma))
    await pg.context.close()


KAPI_JS = """() => { const v = ODA.kapiHedef.merkez.clone().project(ODA.kamera), r = document.getElementById('oda').getBoundingClientRect();
  return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; }"""
TEL_JS = """() => { BASKAN.sahne.updateMatrixWorld(true); const v = new THREE.Vector3(); BK_TEL.getWorldPosition(v); v.project(BASKAN.kamera);
  const r = document.getElementById('view').getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; }"""


async def bolum_15(tarayici, site, tum_hatalar):
    """Ortak stat ve mekân hareketi (2.8D)."""
    pg, hatalar = await oda_ac(tarayici, site, "?baslangic=duzenli&dunya=7&stat=sehir")
    tum_hatalar += hatalar
    stat = await pg.evaluate("""() => ({ tarifler: Object.keys(STADYUMLAR).join(','), ad: STAT.ad, secim: !!document.getElementById('statSeg'),
      balkon: BALKON.stat ? BALKON.stat.children.length : 0, pencere: ODA.disHep === true && ODA.dis.visible, yer: ODA.yer,
      balkonButonu: (() => { const b = document.querySelector('.od-yer'); if (!b) return null; const r = b.getBoundingClientRect(); return r.width > 2; })() })""")
    denetle("Tek kulüp stadı: şehir tarifi ve seçimi yok, eski ?stat=sehir güvenli varsayılana düştü; balkon aynı kurucuyla kuruldu, pencere dışarı açık; görünür 'Balkona çık' düğmesi yok",
            stat["tarifler"] == "kulup" and stat["ad"] == "Demirkapı İlçe Stadı" and not stat["secim"] and stat["balkon"] > 10 and stat["pencere"] and stat["yer"] == "masa" and stat["balkonButonu"] is False, str(stat))
    iskele = await pg.evaluate("() => { const a = BALKON.iskele.visible; odaDurum({ iskele: true }); const b = BALKON.iskele.visible; odaDurum({ iskele: false }); return [a, b, BALKON.iskele.visible]; }")
    denetle("Onarım iskelesi 3B olarak karşı tribünün çatısında; yalnız iz varken görünür", iskele == [False, True, False], str(iskele))
    d0 = await durum(pg)
    nokta = await pg.evaluate(KAPI_JS)
    await pg.mouse.move(nokta["x"], nokta["y"])
    uzerinde = await pg.evaluate("[ODA.uzerinde, ODA.kapiHedef.cerceve.visible, document.getElementById('oda').title]")
    await pg.mouse.click(nokta["x"], nokta["y"])
    await pg.wait_for_timeout(150)
    y1 = await pg.evaluate("({ yer: ODA.yer, t: ODA.yol && ODA.yol.t, y: ODA.kamera.position.y, toplam: ODA.yol && ODA.yol.toplam })")
    denetle("Kapının üzerine gelince amber çerçeve ve 'Balkona çık' ipucu; tıklayınca yürüyüş başlıyor",
            uzerinde[0] == "kapi" and uzerinde[1] and "Balkona" in uzerinde[2] and y1["yer"] == "yolda" and 3 < y1["toplam"] < 9, f"{uzerinde} · {y1}")
    # yürüyüş bitene kadar örnekle (başsız tarayıcıda kare hızı düşük: oyun zamanı gerçek zamandan yavaş akar)
    ornek, A = [], await pg.evaluate("({ bas: OD.adim.kalk + OD.adim.yonel, son: ODA.yol.toplam - OD.adim.otur })")
    for _ in range(120):
        o = await pg.evaluate("ODA.yol ? [+ODA.yol.t.toFixed(2), +ODA.kamera.position.y.toFixed(3), +ODA.kamera.position.z.toFixed(2)] : null")
        if o is None:
            break
        ornek.append(o)
        await pg.wait_for_timeout(120)
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=15000)
    ayakta = [o[1] for o in ornek if A["bas"] + 0.3 < o[0] < A["son"] - 0.3]
    denetle("Doğal yürüyüş: göz oturuştan (1,28 m) ayakta yüksekliğe kalkıyor, yürürken hafif iniş-çıkış var, balkonda oturuşa (1,30 m) iniyor; durum değişmedi",
            len(ayakta) > 3 and min(ayakta) > 1.58 and max(ayakta) - min(ayakta) > 0.002 and min(o[1] for o in ornek[:3]) < 1.55 and abs(await pg.evaluate("ODA.kamera.position.y") - 1.3) < 0.01 and await durum(pg) == d0,
            f"{len(ornek)} örnek · ayakta {min(ayakta) if ayakta else '-'}–{max(ayakta) if ayakta else '-'}")
    await pg.screenshot(path=str(ARAC / "son-akis-15-balkon.png"))
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'masa'", timeout=15000)
    denetle("5 tuşu odaya döndürüyor (klavye erişimi sürüyor)", await pg.evaluate("ODA.yer") == "masa")
    await pg.context.close()
    # maç: başkan koltuğu tarifteki yüksek sırada; altında sıralar var
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&stat=sehir", "#btnMacaGec")
    tum_hatalar += hatalar
    k = await pg.evaluate("""() => { const t = STAT.tribunler.find(x => x.yer === 'ana'), O = tribunOlcu(t);
      return { y: +BASKAN_KOLTUGU.y.toFixed(2), beklenen: +(O.y0 + t.baskanSira * O.eg + KOLTUK_YUKSEKLIGI * 1.14).toFixed(2), sira: t.baskanSira, ad: STAT.ad }; }""")
    denetle("Maçta başkan koltuğu ana tribünün 8. sırasında (altında 7 sıra); konum tarifin geometrisinden geliyor",
            k["y"] == k["beklenen"] and k["sira"] == 8 and k["y"] > 5 and k["ad"] == "Demirkapı İlçe Stadı", str(k))
    await pg.screenshot(path=str(ARAC / "son-akis-15-mac.png"))
    await pg.context.close()


async def bolum_16(tarayici, site, tum_hatalar):
    """Maç telefonu (2.8F)."""
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
    denetle("Masadaki telefona tıklayınca telefon açıldı; 'telefon' duraklatma nedeni eklendi, maç durdu",
            a["acik"] and a["nedenler"] == "telefon" and a["sn"] == b["sn"] and await pg.is_visible("#macTelefon"), f"{a} → {b}")
    await pg.click('[data-mt="mac"]')
    yazi = await pg.text_content("#macTelefon")
    ist = await pg.evaluate("({ sut: mac.ist.sut, isabet: mac.ist.isabet, korner: mac.ist.korner, faul: mac.ist.faul, dk: mac.minuteLabel(), skor: mac.score })")
    satirlar = await pg.eval_on_selector_all(".mt-ist tbody tr", "L => L.map(r => [...r.children].map(c => c.textContent))")
    tablo = {s[1]: (s[0], s[2]) for s in satirlar}
    denetle("Canlı Skor: kendi maçın skoru ve dakikası; istatistikler motorun aynı anına ait; diğer maçlar için dürüst boş durum",
            tablo["Şut"] == (str(ist["sut"][0]), str(ist["sut"][1])) and tablo["Faul"] == (str(ist["faul"][0]), str(ist["faul"][1])) and tablo["Korner"] == (str(ist["korner"][0]), str(ist["korner"][1]))
            and f"{ist['skor'][0]} – {ist['skor'][1]}" in yazi and ist["dk"] in yazi and "Diğer maç verileri henüz bağlı değil" in yazi and "xG" in yazi, str(tablo))
    await pg.click('[data-mt="uyg"][data-uyg="mesajlar"]')
    denetle("Mesajlar: kariyer olmadan sakin boş durum", "yeni mesaj yok" in await pg.text_content("#macTelefon"))
    await pg.screenshot(path=str(ARAC / "son-akis-16-telefon.png"))
    await pg.keyboard.press("Escape")
    await pg.wait_for_timeout(800)
    c = await pg.evaluate("({ acik: MAC_TELEFON.acik, nedenler: [...SUNUM.nedenler].join(','), sn: mac.gameSec })")
    denetle("Esc telefonu kapattı; tek neden olduğu için maç aynı andan sürdü", not c["acik"] and c["nedenler"] == "" and c["sn"] > b["sn"], str(c))
    # elle duraklat → telefonu aç/kapat → maç hâlâ duruyor
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
        await ayar_ac(pg, "gelistirici")
        await pg.click('[data-eylem="test"]')
        await pg.keyboard.press("Digit2")
        kapali_yazi = await pg.text_content("#oda")
        kapali = await pg.eval_on_selector_all("#oda .od-test", "L => L.length")
        denetle("Test bilgileri açıkken adayların katkısı ve seçim sonucu görünür; kapalıyken ekranda hiçbiri yok",
                acik >= 3 and "katkı:" in yazi and "güçlü" in yazi and kapali == 0 and "katkı:" not in kapali_yazi and "TEST" not in kapali_yazi, f"açık {acik} kutu · kapalı {kapali}")
        await ayar_ac(pg, "gelistirici")
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
        await pg.click('[data-eylem="ajSekme"][data-sekme="girisim"]')
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
        denetle("Telefon: Mesajlar'da cevap bekleyen konuşma önde, yeni mesajlar işaretli", "Cevap gerekiyor" in yazi and "Mesajlar" in yazi and "Yeni" in yazi and "ertelemek istiyorlar" in yazi, yazi[:160])
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
        await ayar_ac(pg, "okuma")
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
        await ayar_ac(pg, "okuma")
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
        await pg.click('[data-eylem="ajSekme"][data-sekme="soz"]')
        yazi = await pg.text_content(".od-panel")
        denetle("Ajandanın Sözler bölümünde verilen söz görünüyor (açık: maaş günü)", "Verdiğin sözler" in yazi and "Açık" in yazi and "10 Aralık" in yazi)
        await pg.keyboard.press("Escape")
        onceki = (await durum(pg), iz)
        await oda_yenile(pg)
        iz2 = await pg.evaluate("({gazete: ODA.nesneler.gazete.g.visible, kart: ODA.kart.visible, iskele: ODA.iskele, not: ODA.panoNotu.visible, yeni: ODA.durum.gazeteYeni})")
        denetle("Yenilemeden sonra izler aynı (gazete masada, iskele pencerede); yeni işareti kalkmış", await durum(pg) == onceki[0] and iz2 == dict(iz, yeni=False), str(iz2))
        onceki_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        await pg.click('.od-ana:has-text("Stada git")')
        await pg.wait_for_selector("#onEkran:not([hidden])", timeout=20000)
        son_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        denetle("Stada git: oda kapandı, maç programı açıldı; maç sınırında kayıt yapılmadı",
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
        denetle("(hazırlık) Perşembe 15:00, maaş sözü açık; başkan masada, klavye için Balkona çık düğmesi var",
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
        # 2.8B: gözlem gerçek zamanlı akar; haber gelince durur
        await pg.wait_for_function("/Gözlem durdu/.test((document.querySelector('.od-gozlem') || {}).textContent || '')", timeout=30000)
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
        await pg.wait_for_function("OYUN.kariyer.gozlem === null", timeout=30000)
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

        # ---- 12. genel duraklatma (2.8B): oda, yürüyüş, gerçek zamanlı gözlem ve maç ----
        await bolum_12(tarayici, site, tum_hatalar)

        # ---- 13. başkanlık ekranları (2.8C) ----
        await bolum_13(tarayici, site, tum_hatalar)

        # ---- 14. maç programı (2.8E) ----
        await bolum_14(tarayici, site, tum_hatalar)

        # ---- 15. ortak stat ve mekân hareketi (2.8D) ----
        await bolum_15(tarayici, site, tum_hatalar)

        # ---- 16. maç telefonu (2.8F) ----
        await bolum_16(tarayici, site, tum_hatalar)

        # ---- 11. oyun çerçevesi temizliği (2.8A): dış notlar, ses, çay ve yazılı spiker yok; eski ayarlar açılıyor ----
        baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
        # ses denetimi: sayfa betiklerinden önce AudioContext kurulumu sayılır
        await baglam.add_init_script("""window.__sesSayaci = 0; for (const ad of ['AudioContext', 'webkitAudioContext']) if (window[ad]) {
          const A = window[ad]; window[ad] = function (...a) { window.__sesSayaci++; return new A(...a); }; }""")
        # eski (2.5–2.8) ayar kaydı: ses ve sessiz anahtarları vardı
        await baglam.add_init_script("""if (!sessionStorage.getItem('__ayarYazildi')) { sessionStorage.setItem('__ayarYazildi', '1');
          localStorage.setItem('chairman:ayarlar', JSON.stringify({ ses: 0.3, sessiz: true, yazi: 'buyuk', test: false })); }""")
        pg = await baglam.new_page()
        hatalar = []
        pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
        await pg.goto((site / "index.html").as_uri() + SIKISIK)
        await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)
        cerceve = await pg.evaluate("""() => ({ ust: !!document.querySelector('header.top, .rules, .pal, .radyo, #radyoMetin, #radyoSkor'),
          gelistirici: !!document.querySelector('details.gelistirici:not([open]) #hizSeg'), santra: (document.getElementById('btnMacaGec') || {}).textContent })""")
        denetle("Çerçeve temiz: başlık, kurallar, palet ve radyo satırı yok; deneme ayarları kapalı Geliştirici alanında; tören atlama düğmesi 'Santraya geç'",
                not cerceve["ust"] and cerceve["gelistirici"] and cerceve["santra"] == "Santraya geç", str(cerceve))
        ayar = await pg.evaluate("({ a: OYUN.ayarlar.yazi, t: OYUN.ayarlar.test, kayit: JSON.parse(localStorage.getItem('chairman:ayarlar')) })")
        denetle("Eski ayar kaydı açıldı: yazı büyüklüğü ve test ayarı korundu, ses anahtarları düştü",
                ayar["a"] == "buyuk" and ayar["t"] is False and "ses" not in ayar["kayit"] and "sessiz" not in ayar["kayit"], str(ayar))
        await pg.keyboard.press("Digit2")
        await pg.keyboard.press("Digit1")
        await pg.click('.od-nesne[data-panel="ayar"]')
        ayar_yazi = await pg.text_content(".od-panel")
        await pg.keyboard.press("Escape")
        await pg.keyboard.press("Digit5")
        await pg.wait_for_function("ODA.yer === 'balkon'", timeout=15000)
        ses = await pg.evaluate("({ sayac: window.__sesSayaci, tanim: ['sesCal', 'sesBaslat', 'sesOrtam', 'sesAyarla', 'SES'].filter(a => a in window), cay: typeof BK_CAY !== 'undefined' || typeof BK_BUHAR !== 'undefined', soyle: typeof soyle !== 'undefined' })")
        denetle("Ses yok: paneller ve balkon sonrası ses bağlamı kurulmadı, ses işlevleri tanımsız, ayarlarda Ses bölümü yok; çay ve spiker işlevi yok",
                ses["sayac"] == 0 and not ses["tanim"] and not ses["cay"] and not ses["soyle"] and "Ses" not in ayar_yazi, str(ses))
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
