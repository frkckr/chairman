#!/usr/bin/env python3
"""Chairman — günlük akış denemesi (yol haritası 2.3–2.8, 2.8A–2.8O)

Oyunu başsız Chromium'da açar ve gerçek ekranı tıklayarak oynar. 2.8L'den (2026-10-02) beri oyunda senaryo içeriği yoktur:
  1. İçeriksiz yeni kariyer: oda, boş telefon (Kaldığın yer yok), iki sayfalı defter (hafta, Cumartesi maç, boş gün, hafta okları),
     kapalı dosya, İlerle ile doğrudan maç günü, yenileme.
  2. Eski kayıt (araclar/ornekler/kayit-eski-s5.json): "Kayıt açılamadı" ve nedeni; kayıt saklanıp yeni kariyer başlıyor.
  3. TEST içeriği (araclar/test-icerik.js; yalnız bu denemenin kopyaladığı index-test.html yükler): defterden randevuya katılım, İlerle'nin
     karar haberinde durması, telefonda kişi konuşması ve tek karar kartı, masada açık dosya (sekme, damga, ataşlı kanıtlar, tek kart, sonuç),
     yenilemede aynı durum ve kararın bir kez uygulanması, tahsilatla sözün tutulup konunun arşive geçmesi, büyük yazıda taşma olmaması.
     H1 (F4, 2026-10-26): tek kart (js/ekran-kart.js): kenar etiketi yalnız önizler, %25 sürükleme uygulamaz, %55 uygular; karar panelinde
     ←/→ önizler, Esc bırakır, → + Enter uygular; Duraklat'ta kart kilitli; 15 dk'lık cevabın yüzünde kaçırılacak iş uyarısı.
 12. Genel duraklatma (2.8B): oda, yürüyüş ortası, gerçek zamanlı gözlem (duraklat → kayıt aynı an → yenile → devam) ve maç.
 14. Maç öncesi ekranı (2.8J, 2.8N): iki takımın ilk 11'i ve son 5 maçı, dolan hazırlık çubuğu, en az 10 sn, duraklatma, elle geçiş.
 14 (N11, 2026-10-04): stada varış: karanlıktan açılış, sokak kapısı, kesme, merdiven, kalabalık loca, oturma; atlama ve Santraya geç.
 14b. N12: rakip başkan yerinde / sonra / yok; beş saniyelik karar anı (süre, duraklatma, klavye, büyük yazı, atlamanın geçememesi);
     H1: tek kart (kenar etiketi ve → yalnız önizler, → + Enter ya da 1/2 seçer). H2-a: perde açıkken karar anı örtünün üstünde (örtü gizli).
 15. Ortak çatısız stat ve mekân (2.8D, 2.8J, 2.8O): tek tarif, balkon/pencere aynı stat, iskele, kapıya tıklama, doğal yürüyüş;
     N6 (2026-10-04): insan gibi kalkış, adım ve oturma (ivme ve hız sıçraması sınırı), telefonu alma ve masaya koyma.
 15b. Maçta binadaki loca, 52°'lik geniş bakışta yedek kulübeleri ve okunur tabela; N4 (2026-10-04): bakış topu izler (elle bakış,
     Topu izle düğmesi ve F tuşu yok); Z1 (2026-10-19): görüş açısı sabit (K1 2026-10-20: 36°), top geniş pencerede (32°'de ±9° / ±5°;
     açıyla ekrandaki oranı korunarak ölçeklenir), masa sabit; K1i (2026-10-20): kulübeler ön plandaki masanın ve ellerin arkasında kalmaz.
 16. Maç telefonu (2.8F, 2.8I).
 17. Topu izleyen bakış ve maçın netliği (2026-10-03; Z1 2026-10-19): belirlenimli 30 sn oyunda (1× ve 4×) top ekranda ve pencere bandında,
     görüş açısı sabit, masa kıpırdamıyor; oyuncu boyu, topun çizim boyu, 960×720 maç ızgarası ve 2× iç çizim; dürbünün kaldırıldığı (2026-10-07:
     düğme, D, maske tuvali, ayar yok) denetlenir.
 18. İzleme hızı ve önemli anlar (U1, 2026-10-12): Ayarlar > Maç, maç şeridindeki ×1 ×2 ×4 ve 1/2/4 tuşları, kalıcılık; belirlenimli maçta
     ×4'te şut ve golden önce 1×'e iniş (ikiz motor 7 sn önde), maçın sonuna dek ikizin ana motorla aynılığı.
 19. Maç sonucu kariyere (F2, 2026-10-23): oda → Stada git → bülten → "TEST Maçı bitir" (kalan maç görüntüsüz) → Maç bitti kartı →
     Odaya dön → oda 21:00, sonuç bir kez kayıtta, puan durumu ilerledi, sıradaki iş 14. hafta, Canlı Skor'da son maç; oynanmış maçın adresi odaya düşer;
     belirlenimli iki sayfada aynı tohumla Maçı bitir ile ×16 izlenen maç birebir aynı sonuç kaydı; F3-0 (2026-10-24): üçüncü sayfada Santraya geç
     maç öncesinin başka bir anında basılır, sonuç kaydı yine birebir aynı (basılan an maçı değiştirmez). H2-a (2026-10-26): kariyerde rakip başkan
     yok; Maçı bitir perdesi (çizim durur, örtü, file:// işçisiz yolda önce bizim maç), sayfanın kendi kare döngüsüyle; Odaya dön öbür maçları
     dondurmadan bekler (ligCanliBitir çağrılmaz); doğal bitişte de; süreler yazılır.
 19b. TEST “Maçı izleme” (H2-a, file://): oda → Maçı izleme → perde ilk kareden → kart; T ve P; aynı kayıttan izlenen maçla birebir; hükmen.
 20. Maçı bitir anında (G1-e, 2026-10-24): oyun yerel http sunucusundan açılır (Web Worker file:// altında açılmaz): öbür maçlar ve bizim maçın
     sonuç ikizi işçide maç öncesinde biter (ana iplikteki hesapla birebir), Canlı Skor öbür maçları örneklerden okur, “Maçı bitir” kartı hemen
     ikizin sonucuyla açar, Odaya dön sekiz sonucu yazar; sonuna dek oynanan canlı maç ikizle birebir. H2-a: http'de Maçı izleme (yarış),
     işçiler bitmeden basılan Maçı bitir, kart açıldıktan sonra işçi düşüşü (donma yok).
 26. Tek yazı ölçeği (U0, 2026-10-28): oda, bülten ve maç telefonu aynı --k-yaziBoyu'yu okur (normal 1,5, büyük 1,8 cqw); gövde IBM Plex Sans;
     640 px kareden geniş karede gövde ≥ 12 px.
 27. Odak kabı (U1, 2026-10-28): her iş aynı kapta, oda bulanık; başlıkta ‹ Geri · başlık · Kapat; Esc tablosu (telefon, Canlı Skor, dosya,
     oyuncu dosyası, Kadro TEST, karar paneli, defter); Kapat ve perde masaya; odakta İlerle yok; 3B donar.
 31. Canlı Skor sayfaları (R3, 2026-10-29): sürüm 11 örnek kaydında hafta görünümü (tarafsız, armalı), maç sayfası (Özet, İstatistikler,
     Kadrolar, Puan durumu), oyuncu ve takım sayfası, kamuya açık bilgi sınırı, sağ panelde Esc zinciri ve okuma yeri, balkonda tek telefon.
 32. Transfer masası (R4-k, 2026-10-29): masada Transfer (6); Pano (dönem sayacı, kasa, açık işler), Piyasa, oyuncu kâğıdı (bildiklerimiz, eylemler),
     takip (zaman almaz), Hocaya araştırt (dosya açılır; dosyada aşama satırı, ‹ Transfer), Geçmiş, Duraklat'ta eylemler kapalı, Esc zinciri.
 33. Transfer zinciri (R4): yapay haftalarla 5 Ocak; hocanın isteği telefonda; aday, yürütme, pazarlık kartının iki yüzü, Yanına git, imza ya da kayıp.
 34. Balkon (R5): antrenman kâğıdı sağ üstte (günün türü, Gördüklerin, sinyalden oyuncu dosyası), sahadakiler kariyerin kadrosu ve programa göre
     gruplar, iş sağ yarıda, TEST “her saat antrenman” yalnız görüntü, gözlemde telefon rozeti (B44).
 35. Zincirler (R6): gazetede başka kulüpler arasındaki transfer; sponsor teklifi telefonda (Fırsat), pazarlık kartının iki aylık rakamı, dosyada aşama.
 11. Oyun çerçevesi (2.8A, 2.8J, 2.8O): dış notlar/radyo/ses/çay yok, deneme ayarlarında yalnız hız, Durdur ve tarz seçimi (TEST, B4b), eski ayar kaydı, sessiz maç.
Site hazırlığı araclar/kontrol.py ile aynıdır (Three.js yerel kopyadan). Başarısız denetim ya da sayfa hatası çıkış kodunu 1 yapar.
Ekran görüntüleri: araclar/son-akis-*.png (depoya eklenmez).

Kullanım:  python3 araclar/akis-deneme.py            # bütün bölümler
           python3 araclar/akis-deneme.py 12 16      # yalnız verilen bölümler (hızlı inceleme; tam doğrulama yerine geçmez)
"""
import asyncio
import json
import math
import pathlib
import re
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import kontrol  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")

KOK, ARAC = kontrol.KOK, kontrol.ARAC
basarisiz = 0
dusenler = []   # R1-d: düşen denetimlerin adları; sonunda borç defteriyle (araclar/BORCLAR.md) eşlenir


def denetle(ad, tamam, ayrinti=""):
    global basarisiz
    if not tamam:
        basarisiz += 1
        dusenler.append(ad)
    print(("  " if tamam else "! ") + ad + (f" — {ayrinti}" if ayrinti else ""))


def borc_defteri():
    """R1-d (2026-10-29): araclar/BORCLAR.md'nin açık ve kapsamı `akis` olan satırları: [(no, konu, [kalıp])]. Okuyucunun Node eşi araclar/borclar.js."""
    yol = ARAC / "BORCLAR.md"
    if not yol.exists():
        return []
    sonuc = []
    for s in yol.read_text(encoding="utf-8").splitlines():
        if not re.match(r"^\|\s*B\d+\s*\|", s):
            continue
        h = [x.strip() for x in s.split("|")[1:-1]]
        parca = re.findall(r"`([^`]+)`", h[-1])
        if len(h) > 3 and h[3].lower().startswith("açık") and parca and parca[0] == "akis" and len(parca) > 1:
            sonuc.append((h[0], h[1], [re.compile(k) for k in parca[1:]]))
    return sonuc


DURUM_JS = """() => { const k = OYUN.kariyer; const c = k.kulupler.demirkapi;
  return { tarih: k.tarih, dakika: k.gunIciDakika, nakit: c.nakit, hareket: k.hareketler.length, gecmis: k.gecmis.length,
    isler: Object.keys(k.isler).join(','), ajanda: Object.values(k.isler).filter(x => x.tur === 'ajanda').map(x => x.id).join(','), mesele: Object.values(k.meseleler).map(m => m.tur + ':' + m.durum).join(','),
    olay: Object.values(k.olaylar).map(o => o.paket + '/' + o.varyant + ':' + o.durum).join(','), baslangic: k.icerik.baslangic, icerik: k.icerik.surum,
    sayman: c.yonetim.sayman, karar: Object.values(k.isler).filter(x => x.veri.saatsiz).map(x => x.id).join(','),
    soz: Object.values(k.sozler).map(s => s.anahtar + ':' + s.durum).join(','), haber: k.haberler.map(h => h.anahtar).join(','),
    gozlem: k.gozlem ? k.gozlem.bas + '-' + k.gozlem.bitis : '' }; }"""
KAYIT_JS = "localStorage.getItem('chairman:oyun-1')"
# yürüyüş oyun içinde ~6 sn; başsız yazılım çiziminde kare hızı düşük olduğundan bekleme sınırı geniştir
YURUYUS_BEKLE = 45000


async def durum(pg):
    return await pg.evaluate(DURUM_JS)


def loca(sorgu):
    """P2 (2026-10-21 gece): maç 2D varsayılan; bu aracın denetimleri figürlü loca bakışını varsayar → ?pul=0 (2D akışı: araclar/akis-2d.py)"""
    if "pul=" in sorgu:
        return sorgu
    return sorgu + ("&" if "?" in sorgu else "?") + "pul=0"


async def sayfa(tarayici, site, sorgu, bekle, ad="index.html"):
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text)
          if m.type == "error" and "Failed to load resource" not in m.text else None)
    await pg.goto((site / ad).as_uri() + (loca(sorgu) if ad == "index.html" else sorgu))
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

# ---- U0 (2026-10-28): ortak yardımcılar. Odak modelinde (U1–U6) kap, Esc ve masa şeridi değişince yalnız bunlar güncellenir ----
async def ayar_yazi(pg, yazi):
    """Ayarlar > Okuma > yazı büyüklüğü ("normal" ya da "buyuk"); panel kapanır. U1: odak açıkken masadaki düğmeler perdenin arkasındadır; önce masaya dönülür."""
    await masaya_don(pg)
    await pg.click('.od-nesne[data-panel="ayar"]')
    await pg.click(f'[data-eylem="yazi"][data-yazi="{yazi}"]')
    await pg.keyboard.press("Escape")


ODAK_ACIK_JS = "() => !!document.querySelector('#oda section.odk:not(.odk-cikis)')"


async def masaya_don(pg, en_cok=4):
    """Odak kapanana dek Esc'e basar; kaç basış gerektiğini döndürür (en_cok basışta kapanmazsa -1)."""
    for n in range(en_cok + 1):
        if not await pg.evaluate(ODAK_ACIK_JS):
            return n
        if n < en_cok:
            await pg.keyboard.press("Escape")
    return -1


ODAK_TUS = {"telefon": "Digit1", "ajanda": "Digit2", "dosya": "Digit3", "gazete": "Digit4"}


async def odak_ac(pg, ad):
    """Masadaki nesneyi açar; zaten açıksa dokunmaz. U1: bir iş açıkken masadaki düğmeler perdenin arkasındadır; nesne tuşu (1–4) öbür işten
    doğrudan geçer, Ayarlar için önce masaya dönülür."""
    acik = await pg.evaluate("() => { const s = document.querySelector('#oda section.odk:not(.odk-cikis)'); return s ? s.dataset.odak : null; }")
    if acik == ad:
        return
    if acik and ad in ODAK_TUS:
        await pg.keyboard.press(ODAK_TUS[ad])
        return
    await masaya_don(pg)
    await pg.click(f'.od-nesne[data-panel="{ad}"]')


async def gecis_bitir(pg, sn=2):
    """Süren CSS geçişleri ve animasyonlar bitene dek (en çok sn saniye) bekler; sabit beklemelerin yerine."""
    await pg.evaluate("(ms) => Promise.race([Promise.all(document.getAnimations().map(a => a.finished.catch(() => null))), new Promise(r => setTimeout(r, ms))])", int(sn * 1000))


async def yazi_bekle(pg):
    """Yazı tipleri yüklenene dek bekler (ölçümler ve görüntüler yedek yazıyla alınmasın)."""
    await pg.evaluate("() => document.fonts.ready.then(() => true)")



# Canlı Skor satırı (N2): satır yüksekliği (yazı boyuna oran), parçaların dikey ortalarının yayılımı (piksel) ve yatay taşma
TEK_SATIR_JS = """(kok) => { const m = document.querySelector(kok + ' .tel-mac'); if (!m) return null; const r = m.getBoundingClientRect(), fs = parseFloat(getComputedStyle(m).fontSize);
  const orta = [...m.children].map(c => { const q = c.getBoundingClientRect(); return q.top + q.height / 2; });
  return { satir: +(r.height / fs).toFixed(2), yayilim: +(Math.max(...orta) - Math.min(...orta)).toFixed(1), yazi: [...m.children].map(c => c.textContent).join(' | '), tasma: m.scrollWidth - m.clientWidth, baslik: m.title }; }"""


async def bolum_1(tarayici, site, tum_hatalar):
    """İçeriksiz yeni kariyer (2.8L, 2.8M)."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    d0 = await durum(pg)
    # F1 (2026-10-23): takvimde maç günü ajanda işinin yanında kış transfer döneminin iki hatırlatması da durur; G2 (2026-10-24): 1 Aralık ay başı ve kış
    # döneminin dört gizli transfer gelişmesi (8 iş)
    denetle("Yeni kariyer Pazartesi 08:00; içerik sürümü 5 (F6-a); mesele, olay ve söz yok; tek haber mali işler müdürünün açılış özeti (H2-d); takvimde tek ajanda işi: maç günü (yanında 2 hatırlatma, ay başı, haftalık mali özet, 4 transfer gelişmesi)",
            d0["tarih"] == "2026-11-23" and d0["dakika"] == 480 and d0["icerik"] == 5 and d0["mesele"] == "" and d0["olay"] == "" and d0["soz"] == ""
            and d0["haber"] == "mali.haftalik" and d0["ajanda"] == "is-1" and len(d0["isler"].split(",")) == 9, str(d0))
    await pg.keyboard.press("Digit1")
    tel = await pg.text_content(".od-telefonPanel")
    denetle("Telefon ana ekranla açılıyor; 'Kaldığın yer' özeti yok", "Mesajlar" in tel and "Canlı Skor" in tel and "Kaldığın" not in tel
            and await pg.query_selector('[data-eylem="devam"]') is None, tel[:80])
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    # N14 (kullanıcı kararı 2026-10-18): konuşma yoksa boş durum yazısı yok. H2-c: hoca ve yardımcı antrenör konu önerileriyle her zaman listede (mesajsız;
    # önizlemede konunun açıklaması), bildirim yok
    msj = await pg.text_content(".tel-govde")
    kisiler = await pg.eval_on_selector_all(".tel-kisi", "L => L.map(b => b.textContent)")
    denetle("N14, H2-c, H2-d: Mesajlar'da hoca, yardımcı ve mali işler müdürü (mesajsız, önizlemede konu açıklaması, okunmamış yok); boş durum yazısı yok",
            len(kisiler) == 3 and any("Şükrü Hoca" in x for x in kisiler) and any("Tahsin" in x for x in kisiler) and any("Nusret Bey" in x and "Kasayı sorarsın" in x for x in kisiler)
            and all("Kadronun durumunu sorarsın" in x for x in kisiler if "Nusret Bey" not in x)
            and await pg.query_selector(".tel-kisi .tel-rozet") is None and await pg.query_selector(".tel-govde .tel-bos") is None and "Mesaj yok" not in msj and "sessiz" not in msj, " | ".join(kisiler)[:160])
    await pg.click('.tel [data-eylem="telEv"]')
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    sk, skor, hs = await pg.evaluate(TEK_SATIR_JS, ".od-telefonPanel"), await pg.text_content(".tel"), await pg.evaluate(HAFTA_JS)
    denetle("N2, R3: Canlı Skor hafta görünümüyle açılır (13. hafta, 8 maç, her satırda iki arma, satırlar aynı kalıpta); maç tek satır (saat · ev sahibi · – · deplasman; N7: kısa kulüp adı, tam ad başlıkta); 'veri bağlı değil' notu yok",
            sk and sk["satir"] <= 2.8 and sk["yayilim"] <= 4 and sk["tasma"] <= 0 and "19:00" in sk["yazi"] and " – " in sk["baslik"]
            and hs["h"] == "13. hafta" and hs["n"] == 8 and hs["arma"] == 16 and hs["sinif"] == "tel-mac" and "Demirkapı SK – Akdeniz FK · başlamadı" in hs["basliklar"]
            and "bağlı değil" not in skor, f"{sk} · {hs['h']} · {hs['n']} satır · {hs['arma']} arma · {hs['sinif']}")
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
    # H2-d (kullanıcı istekleri 1–2): Kasa düğmesi kalktı; mali bilgi müdürün raporuyla dosyada. Dosya masada (rapor var), düğme açık ve “yeni” rozetli
    dd = await pg.evaluate("() => { const b = document.querySelector('.od-nesne[data-panel=\"dosya\"]'); return { var: !!b, kapali: !!(b && b.disabled), rozet: b && b.querySelector('.od-rozet') ? b.querySelector('.od-rozet').textContent : '' }; }")
    denetle("H2-d: Kasa düğmesi yok; dosya masada, düğme açık ve “yeni” rozetli", await pg.query_selector('.od-nesne[data-panel="kasa"]') is None and dd["var"] and not dd["kapali"] and dd["rozet"] == "yeni", str(dd))
    await pg.keyboard.press("Digit6")
    denetle("H2-d, R4: 6 tuşu kasa açmaz; R4'ten beri Transfer masasını açar (dosya açılmaz)",
            await pg.query_selector('.od-nesne[data-panel="kasa"]') is None and await pg.query_selector("#oda .tm-masa") is not None and await pg.query_selector(".dsy") is None)
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit3")
    await pg.wait_for_selector(".dsy", timeout=10000)
    rap = await pg.text_content(".dsy")
    secili = await pg.evaluate("() => (document.querySelector('.dsy-raporSekme') || {}).getAttribute ? document.querySelector('.dsy-raporSekme').getAttribute('aria-selected') : null")
    await pg.wait_for_timeout(300)
    await pg.screenshot(path=str(ARAC / "son-akis-1-dosya-rapor.png"))
    denetle("H2-d: 3 tuşu dosyayı Raporlar ile açar (kasadaki para, 90 gün içinde en düşük, 90 gün sonrası, belirsiz gelir; kaynak mali işler müdürü); zaman değişmedi",
            secili == "true" and "Kasadaki para" in rap and "90 gün içinde en düşük" in rap and "90 gün sonra" in rap and "Belirsiz gelir" in rap and "Nusret Bey" in rap and await durum(pg) == d0, rap[:160])
    await pg.keyboard.press("Escape")
    r2 = await pg.evaluate("() => { const b = document.querySelector('.od-nesne[data-panel=\"dosya\"]'); return b && b.querySelector('.od-rozet') ? b.querySelector('.od-rozet').textContent : ''; }")
    denetle("H2-d: rapor okununca dosyanın rozeti kalkar", r2 == "", r2)
    await oda_ilerle(pg)
    d1 = await durum(pg)
    denetle("İlerle doğrudan Cumartesi 19:00 maç sınırına gidiyor; ana düğme 'Stada git'",
            d1["tarih"] == "2026-11-28" and d1["dakika"] == 1140 and "Stada git" in await pg.text_content(".od-ana"), str(d1))
    # H2-a (TEST, yayından önce kalkar): şeritte "Stada git" ana düğme, yanında "Maçı izleme" ikinci düğme
    serit = await pg.evaluate("""() => ({ ana: [...document.querySelectorAll('.od-alt .od-ana')].map(b => b.dataset.eylem + ':' + b.textContent),
      ikinci: [...document.querySelectorAll('.od-alt .od-ikinci')].map(b => b.dataset.eylem + ':' + b.textContent) })""")
    denetle("H2-a: maç günü şeridinde 'Stada git' .od-ana'da (tek), TEST 'Maçı izleme' .od-ikinci'de",
            len(serit["ana"]) == 1 and "Stada git" in serit["ana"][0] and any(x.startswith("yapIzlemesiz:") and "TEST" in x and "Maçı izleme" in x for x in serit["ikinci"]), str(serit))
    await oda_yenile(pg)
    rozet = await pg.query_selector('.od-nesne[data-panel="telefon"] .od-rozet')
    denetle("Yenileme aynı anda açıyor; telefonda dönüş rozeti yok", await durum(pg) == d1 and rozet is None)
    await pg.screenshot(path=str(ARAC / "son-akis-1-mac-gunu.png"))
    await pg.keyboard.press("Digit1")
    # N14 (kullanıcı kararı 2026-10-18): maç gününde ana ekranda Canlı Skor kartı yok; iki uygulama altta sabit sırada
    ana1 = await pg.evaluate("""() => ({ kart: [...document.querySelectorAll('.tel-bildirim')].map(b => b.textContent),
      skorKart: !!document.querySelector('.tel-bildirim[data-uyg="skor"]'), sabit: [...document.querySelectorAll('.tel-sabit .tel-uyg')].map(b => b.dataset.uyg).join(',') })""")
    denetle("N14: maç günü ana ekranda Canlı Skor kartı yok, bildirim yok; Mesajlar ve Canlı Skor uygulama olarak altta",
            not ana1["skorKart"] and ana1["kart"] == [] and ana1["sabit"] == "mesajlar,skor", str(ana1))
    await pg.wait_for_timeout(300)  # N7: telefonun açılış geçişi (0,18 sn) bitsin
    await pg.screenshot(path=str(ARAC / "son-akis-1-telefon-ana-mac-gunu.png"))
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    sk, skor, hs = await pg.evaluate(TEK_SATIR_JS, ".od-telefonPanel"), await pg.text_content(".tel"), await pg.evaluate(HAFTA_JS)
    denetle("N2, R3: maç günü Canlı Skor'da bugünün haftası (13. hafta, 8 maç), maç tek satır; not yok", sk and sk["satir"] <= 2.8 and sk["yayilim"] <= 4 and sk["tasma"] <= 0 and "19:00" in sk["yazi"]
            and hs["h"] == "13. hafta" and hs["n"] == 8 and "bağlı değil" not in skor, f"{sk} · {hs['h']}")
    await pg.wait_for_timeout(300)  # N7: telefonun açılış geçişi (0,18 sn) bitsin
    await pg.screenshot(path=str(ARAC / "son-akis-1-canli-skor.png"))
    await pg.keyboard.press("Escape")
    # F1-b (2026-10-23): "Stada git" kaydedilmez; sayfa maçın kimliğiyle yeniden yüklenir (js/mac-gunu.js), bülten fikstürden ve kariyer kadrolarından
    await pg.keyboard.press("Escape")
    # F1-b incelemesi: kayıt yazılamıyorsa (kaydedilmemiş değişiklik + depo hatası) Stada git sayfayı yeniden yüklemez; bellekteki ilerleme atılmaz
    await pg.evaluate("() => { window.__yaz = OYUN_DEPO.yaz; OYUN_DEPO.yaz = () => { throw new Error('deneme: depo dolu'); }; oyunKomut(x => {}, true); }")
    await pg.click(".od-ana")
    await pg.wait_for_timeout(600)
    msjH = await pg.text_content(".od-mesaj")
    denetle("F1-b: kayıt yazılamıyorsa Stada git maça gitmez, nedeni söylenir; maç günü işi bekliyor",
            "Maç açılamıyor" in msjH and "mac=" not in pg.url and await pg.evaluate("() => Object.values(OYUN.kariyer.isler).some(x => x.veri.eylem === 'macGunu')"), msjH)
    await pg.evaluate("() => { OYUN_DEPO.yaz = window.__yaz; OYUN.oturum.kaydet(); }")
    kayit0 = await pg.evaluate(KAYIT_JS)
    # F1-b incelemesi: oda maç günü işini bellekte tüketmez (Geri tuşuyla dönülürse iş yerinde); ayrılırken bellekteki kariyere bakılır
    await pg.evaluate("() => addEventListener('beforeunload', () => sessionStorage.setItem('f1bBekleyen', String(Object.values(OYUN.kariyer.isler).filter(x => x.veri.eylem === 'macGunu').length)))")
    await pg.click(".od-ana")
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=60000)
    bul = await pg.text_content("#onEkran")
    MAC_JS = """() => ({ kariyer: MAC_GUNU.kariyer, mac: MAC_GUNU.macId, biz: MAC_GUNU.biz, tohum: MAC_GUNU.tohum, motor: mac.tohum,
      bekleyen: Object.values(OYUN.kariyer.isler).filter(x => x.veri.eylem === 'macGunu').length, kadro: MAC_GUNU.kadro.map(k => k.oyuncular.length + '+' + k.yedekler.length).join(' ') })"""
    m1 = await pg.evaluate(MAC_JS)
    denetle("F1-b: odadan ayrılırken bellekteki kariyerde maç günü işi hâlâ bekliyordu (oda işi tüketmez)", await pg.evaluate("() => sessionStorage.getItem('f1bBekleyen')") == "1")
    denetle("F1-b: Stada git sayfayı maçın kimliğiyle açıyor; bülten fikstürden (13. hafta, iki takım), motorun tohumu maçın; bellekte maç günü geçildi, kayıt değişmedi",
            "mac=mac-2627-13-demirkapi-akdeniz" in pg.url and "13. hafta" in bul and "Demirkapı" in bul and "Akdeniz" in bul and m1["kariyer"] and m1["motor"] == m1["tohum"]
            and m1["bekleyen"] == 0 and m1["kadro"] == "11+5 11+5" and await pg.evaluate(KAYIT_JS) == kayit0, f"{pg.url.split('?')[-1]} · {m1}")
    await pg.reload()
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=60000)
    m2 = await pg.evaluate(MAC_JS)
    denetle("F1-b: maç sayfası yenilenince aynı maç aynı tohumla kurulur; kayıt yine değişmedi", m2 == m1 and await pg.evaluate(KAYIT_JS) == kayit0, str(m2["tohum"]))
    await pg.goto(pg.url.split("?")[0] + "?ekran=bulten&mac=mac-yok")
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=60000)
    msj = await pg.text_content(".od-mesaj")
    denetle("F1-b: geçersiz maç adresinde oda açılır, neden söylenir, adres temizlenir; kayıt değişmedi",
            "Maç günü açılamadı" in msj and "mac=" not in pg.url and await pg.evaluate(KAYIT_JS) == kayit0, msj)
    # F1-c (2026-10-23): deplasman maçı. 13. haftanın maç günü elle iptal edilip 14. haftanınki kurulur ve oyuncu gibi İlerle ile maç gününe gelinir
    # (F2'den beri sıradaki hafta sonuç komutuyla da kurulur: bölüm 19; burada maç oynamadan deplasman statı sınanır)
    id14 = await pg.evaluate("""() => { let id = null; oyunKomut(k => { const is = Object.values(k.isler).find(x => x.veri.eylem === 'macGunu');
      isIptal(k, is.id, 'deneme: 14. hafta'); id = k.fikstur.find(f => f.hafta === 14 && (f.ev === 'demirkapi' || f.konuk === 'demirkapi')).id; macGunuIsiKur(k, id); duragaIlerle(k); }); return id; }""")
    await pg.goto(pg.url.split("?")[0] + "?ekran=bulten&mac=" + id14)
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=60000)
    bul14 = await pg.text_content("#onEkran")
    d14 = await pg.evaluate("""() => ({ biz: MAC_GUNU.biz, ev: MAC_GUNU.kadro[0].id, konuk: MAC_GUNU.kadro[1].id, stat: MAC_GUNU.stat, statAd: STAT.ad, kisa: MAC_GUNU.kadro.map(k => k.kisa).join('-'),
      dep: !!mac.deplasmanYeri, kulup: (document.querySelector('#onEkran .oe-kulup') || {}).textContent || '', yamac: STAT.tribunler.some(t => t.tip === 'yamac'),
      evForma: MAC_GUNU.kadro[0].forma, bizForma: MAC_GUNU.kadro[MAC_GUNU.biz].forma, rakip: lgRakipKulup() })""")
    denetle("F1-c: deplasman maçında stat ev sahibinin (üretilen tarif, yamaçsız); biz konuk tarafız; tabela kısaltmaları, bülten ve puan durumunda bizim satır doğru; rakip başkan ev sahibinin",
            d14["biz"] == 1 and d14["konuk"] == "demirkapi" and d14["stat"] == d14["ev"] and d14["statAd"].split(" ")[0] in bul14 and not d14["yamac"] and d14["dep"]
            and "14. hafta" in bul14 and "Demirkapı" in d14["kulup"] and d14["kisa"].endswith("-DEM") and d14["bizForma"] == "ev" and d14["rakip"] != "Demirkapı SK", f"{id14} · {d14}")
    await pg.screenshot(path=str(ARAC / "son-akis-1-deplasman.png"))
    await pg.context.close()


async def bolum_2(tarayici, site, tum_hatalar):
    """Eski kayıt (sürüm 5) açılmaz; saklanır, yeni kariyer başlar."""
    eski = (KOK / "araclar" / "ornekler" / "kayit-eski-s5.json").read_text(encoding="utf-8")
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script("""(m => { if (!sessionStorage.getItem('__eski')) { sessionStorage.setItem('__eski', '1'); localStorage.setItem('chairman:oyun-1', m); } })(""" + json.dumps(eski) + ")")
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    await pg.goto((site / "index.html").as_uri() + loca(""))
    await pg.wait_for_selector(".od-bozuk", timeout=20000)
    yazi = await pg.text_content(".od-bozuk")
    denetle("Eski kayıt: 'Kayıt açılamadı' ve nedeni (eski sürüm, içerik kaldırıldı); kayda dokunulmadı",
            "Kayıt açılamadı" in yazi and "eski bir sürüm" in yazi and await pg.evaluate(KAYIT_JS) == eski, yazi[:140])
    await pg.click('[data-eylem="bozukYeni"]')
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)
    d = await durum(pg)
    denetle("Kaydı sakla, yeni kariyer: eski kayıt '.bozuk' olarak saklandı; içeriksiz yeni kariyer kuruldu",
            await pg.evaluate("localStorage.getItem('chairman:oyun-1.bozuk')") == eski and d["icerik"] == 5 and d["mesele"] == "", str(d))
    tum_hatalar += hatalar
    await baglam.close()


TASMA_JS = "() => [...document.querySelectorAll('.dsy-sayfa, .dft-sayfa, .dsy-sekmeler')].map(e => e.scrollWidth - e.clientWidth)"
# H2-b: Canlı Skor ayrıntısının yatay taşması — .tel-skor, .tel-ist ve telefon gövdesi (scrollWidth − clientWidth); olay satırı (kesilen ad) kendi kutusunun sağını aşmaz
TEL_TASMA_JS = """() => { const R = [], g = document.querySelector('.tel .tel-govde');
  for (const e of document.querySelectorAll('.tel .tel-skor, .tel .tel-ist')) R.push(e.scrollWidth - e.clientWidth);
  if (g) R.push(g.scrollWidth - g.clientWidth);
  for (const e of document.querySelectorAll('.tel .tel-olay')) { const k = e.closest('.tel-olaylar').getBoundingClientRect(), r = e.getBoundingClientRect(); R.push(Math.round(r.right - k.right)); }
  return { n: R.length, en: R.length ? Math.max(...R) : 0, olay: document.querySelectorAll('.tel .tel-olay').length, ayrinti: !!document.querySelector('.tel .tel-ayrinti') }; }"""
# R3 (2026-10-29): Canlı Skor'un hafta görünümü (başlık, satır sayısı, satır başlıkları, armalar, satır sınıfları) ve maç/takım/oyuncu sayfasının yatay
# taşması (sayfa, bölümleri, kesilen bölüm sekmesi, olay satırının sağ kenarı, telefon gövdesi; kadro tablosunun kendi kaydırma kutusu sayılmaz)
HAFTA_JS = """() => ({ h: (document.querySelector('.tel-haftaNav b') || {}).textContent || null, n: document.querySelectorAll('.tel .tel-mac').length,
  basliklar: [...document.querySelectorAll('.tel .tel-mac')].map(e => e.title), arma: document.querySelectorAll('.tel .tel-mac .arma').length,
  sinif: [...new Set([...document.querySelectorAll('.tel .tel-mac')].map(e => e.className))].join(',') })"""
CS_TASMA_JS = """() => { const R = [], s = document.querySelector('.cs-sayfa'), g = document.querySelector('.tel .tel-govde');
  if (s) { R.push(s.scrollWidth - s.clientWidth); for (const e of s.querySelectorAll('.cs-macBas, .cs-akis, .cs-ist, .cs-kadrolar, .cs-tablo, .cs-dl, .cs-maclar, .cs-sekme')) R.push(e.scrollWidth - e.clientWidth);
    const k = s.getBoundingClientRect(); for (const e of s.querySelectorAll('.cs-olay')) R.push(Math.round(e.getBoundingClientRect().right - k.right)); }
  if (g) R.push(g.scrollWidth - g.clientWidth);
  return { n: R.length, en: R.length ? Math.max(...R) : 0, sayfa: s ? s.dataset.tur : null }; }"""
# R3: kayıtlı (bitmiş) bir maçın sayfası: Özet'te gol satırı sayısı, golcü ve kart adları, kayıttaki beklenen gol
OBUR_SAYFA_JS = """(id) => { const k = OYUN.kariyer, s = k.maclar[id], A = document.querySelector('.cs-sayfa[data-tur=mac]'), ad = x => (k.oyuncular[x] || {}).ad;
  if (!s || !A) return { gol: -1, toplam: 0, adlar: false, xg: [] };
  return { gol: A.querySelectorAll('.cs-olay[data-tur=gol]').length, toplam: s.skor[0] + s.skor[1], adlar: s.goller.concat(s.kartlar).every(x => A.textContent.includes(ad(x.id))),
    xg: s.xg.map(x => x.toFixed(2).replace('.', ',')) }; }"""
# R3: maç telefonunda canlı maç sayfası — öbür maç (kilit adımda motor), bizim maç (motor) ve işçi yolunda arkaMacAnlik
CANLI_SAYFA_JS = """(id) => { const x = LIG_CANLI.find(y => y.d.macId === id), A = document.querySelector('#macTelefon .cs-sayfa[data-tur=mac]');
  if (!x || !x.m || !A) return { gol: -1, skor: [0, 0], adlar: false, dk: mac.minuteLabel(), bas: '', canli: false };
  const S = x.m.sonucKaydi();
  return { gol: A.querySelectorAll('.cs-olay[data-tur=gol]').length, skor: S.skor, adlar: S.goller.concat(S.kartlar).every(g => A.textContent.includes(g.ad)), dk: mac.minuteLabel(),
    bas: A.querySelector('.cs-skor b').textContent, canli: !!A.querySelector('.cs-skor .cs-canli') }; }"""
CANLI_IST_JS = """(id) => { const x = LIG_CANLI.find(y => y.d.macId === id); if (!x || !x.m) return false; const S = x.m.sonucKaydi();
  const T = [...document.querySelectorAll('#macTelefon .cs-ist tbody tr')].map(r => [...r.children].map(c => c.textContent)), B = macIstSatirlari(S.ist, macBeklenenGol(S.sutlar)).map(r => [String(r[1]), r[0], String(r[2])]);
  return JSON.stringify(T) === JSON.stringify(B) && T.length === 10; }"""
BIZ_CANLI_JS = """() => { const A = document.querySelector('#macTelefon .cs-sayfa[data-tur=mac]'); if (!A) return { var: false };
  const S = mac.sonucKaydi();
  return { var: true, gol: A.querySelectorAll('.cs-olay[data-tur=gol]').length, golBek: S.goller.length, bas: A.querySelector('.cs-skor b').textContent, basBek: mac.score.join(' – '),
    canli: !!A.querySelector('.cs-skor .cs-canli') }; }"""
BIZ_IST_JS = """() => { const S = mac.sonucKaydi(), T = [...document.querySelectorAll('#macTelefon .cs-ist tbody tr')].map(r => [...r.children].map(c => c.textContent));
  const B = macIstSatirlari(S.ist, macBeklenenGol(S.sutlar)).map(r => [String(r[1]), r[0], String(r[2])]);
  return { esit: JSON.stringify(T) === JSON.stringify(B), n: T.length, beklenen: T.some(r => r[1] === 'Beklenen gol') }; }"""
ISCI_SAYFA_JS = """(id) => { const x = LIG_CANLI.find(y => y.d.macId === id), A = document.querySelector('#macTelefon .cs-sayfa[data-tur=mac]');
  if (!x || !A || !x.son) return { gol: false, id };
  const S = arkaMacAnlik(x.son, arkaMacDurum(x.ornekler, (mac.kare || 0) - MAC_ARKA.T0));
  return { gol: A.querySelectorAll('.cs-olay[data-tur=gol]').length === S.goller.length, id, skor: S.skor.join('-'), golSay: S.goller.length }; }"""
ISCI_IST_JS = """(id) => { const x = LIG_CANLI.find(y => y.d.macId === id); if (!x || !x.son) return { tablo: false, beklenen: false };
  const S = arkaMacAnlik(x.son, arkaMacDurum(x.ornekler, (mac.kare || 0) - MAC_ARKA.T0)), T = [...document.querySelectorAll('#macTelefon .cs-ist tbody tr')].map(r => [...r.children].map(c => c.textContent));
  const B = macIstSatirlari(S.ist, macBeklenenGol(S.sutlar)).map(r => [String(r[1]), r[0], String(r[2])]);
  return { tablo: JSON.stringify(T) === JSON.stringify(B), beklenen: T.some(r => r[1] === 'Beklenen gol') }; }"""
# R3: odadaki puan durumu (tarafsız, armalı) ve sağ paneldeki takım sayfası
TABLO_JS = """() => { const k = OYUN.kariyer, T = sezonTablosu(k), R = [...document.querySelectorAll('.tel-tablo tbody tr')];
  return { n: R.length, sira: R.map(r => r.children[1].textContent.trim()).join('|') === T.map(t => telKisaAd(t.ad)).join('|'), vurgu: R.filter(r => r.className).length,
    arma: document.querySelectorAll('.tel-tablo .arma').length, ilk: R[0].children[0].className, son: R[15].children[0].className, mac: document.querySelectorAll('.tel .tel-mac').length }; }"""
KULUP_JS = """(id) => { const k = OYUN.kariyer, o = kulupOzeti(k, id), e = document.querySelector('.tlf-is .cs-sayfa[data-tur=kulup]');
  return { var: !!e, ad: e ? e.querySelector('h4').textContent : '', beklenen: o.ad, yazi: e ? e.textContent : '', stat: o.stat.ad, hoca: o.hoca && o.hoca.ad,
    bolum: e ? [...e.querySelectorAll('.cs-sekme')].map(b => b.dataset.bolum).join(',') : '', liste: document.querySelectorAll('.tel .tel-tablo tbody tr').length }; }"""
# R3 (§31): sürüm 11 örnek kaydında maç, oyuncu ve takım sayfası
MAC_SAYFA_JS = """(id) => { const k = OYUN.kariyer, s = k.maclar[id], A = document.querySelector('.tlf-is .cs-sayfa[data-tur=mac]'); if (!A) return { panel: false };
  const say = t => A.querySelectorAll('.cs-olay[data-tur=' + t + ']').length, L = [...A.querySelectorAll('.cs-akis > li')], ai = L.findIndex(l => l.classList.contains('cs-ayrac'));
  const ayrac = L.filter(l => l.classList.contains('cs-ayrac')).map(l => l.textContent), iy = ayrac.length ? ayrac[0].split(' · ')[1] : '';
  return { panel: true, bas: A.querySelector('.cs-skor b').textContent, skorBek: s.skor.join(' – '), skorBek2: s.skor.join('–'), iy: (A.querySelector('.cs-skor small') || {}).textContent, iyAyrac: iy,
    iyToplam: iy ? iy.split('–').reduce((a, b) => a + Number(b), 0) : -1, golOnce: L.slice(0, Math.max(ai, 0)).filter(l => l.dataset.tur === 'gol').length,
    golSonra: L.slice(ai + 1).filter(l => l.dataset.tur === 'gol').length, golSonraBek: s.goller.filter(g => g.yari === 2).length,
    kulup: A.querySelectorAll('.cs-macBas [data-eylem=csAc][data-tur=kulup]').length, kunye: A.querySelector('.cs-kunye').textContent,
    bolum: [...A.querySelectorAll('.cs-sekme')].map(b => b.dataset.bolum).join(','),
    olay: { gol: say('gol'), kart: say('kart'), degisiklik: say('degisiklik'), sakatlik: say('sakatlik') },
    olayBek: { gol: s.goller.length, kart: s.kartlar.length, degisiklik: s.degisiklikler.length, sakatlik: s.sakatliklar.filter(x => x.derece !== 'agri').length },
    ayrac, dkBicim: [...A.querySelectorAll('.cs-olay .cs-dk')].every(e => /^[0-9]+([+][0-9]+)?'$/.test(e.textContent)) }; }"""
IST_JS = """(id) => { const s = OYUN.kariyer.maclar[id], T = [...document.querySelectorAll('.cs-ist tbody tr')].map(r => [...r.children].map(c => c.textContent)), b = r => T.find(x => x[1] === r) || [];
  const xg = macBeklenenGol(s.sutlar).map(x => x.toFixed(2).replace('.', ','));
  return { n: T.length, sut: b('Şut')[0] === String(s.ist.sut[0]) && b('Şut')[2] === String(s.ist.sut[1]), xg: b('Beklenen gol')[0] === xg[0] && b('Beklenen gol')[2] === xg[1],
    arma: document.querySelectorAll('.cs-ist thead .arma').length }; }"""
KADRO_JS = """(id) => { const s = OYUN.kariyer.maclar[id], K = [...document.querySelectorAll('.cs-kadro')];
  const bol = (k, ad) => { const h = [...k.querySelectorAll('h6')].find(x => x.textContent === ad), n = h && h.nextElementSibling; return n && n.tagName === 'UL' ? n.children.length : 0; };
  return K.map((k, t) => ({ diz: (k.querySelector('h5 small') || {}).textContent === s.dizilis[t], ilk: bol(k, 'İlk on bir') === 11, yedek: bol(k, 'Yedekler') === s.yedek[t].length,
    degis: bol(k, 'Değişiklikler') === s.degisiklikler.filter(d => (d.takim === 1 ? 1 : 0) === t).length, eksik: bol(k, 'Eksikler') === s.eksik[t].length,
    bag: k.querySelectorAll('[data-eylem=csAc][data-tur=oyuncu]').length > 11 })); }"""
OYUNCU_JS = """([id, macId]) => { const k = OYUN.kariyer, p = k.oyuncular[id], A = document.querySelector('.tlf-is .cs-sayfa[data-tur=oyuncu]'); if (!A) return { ad: false };
  const bu = [...A.querySelectorAll('.cs-maclar [data-eylem=csAc][data-tur=mac]')].find(b => b.dataset.id === macId), s = k.maclar[macId], gol = s.goller.filter(g => g.id === id && !g.kk).length;
  return { ad: A.querySelector('h4').textContent === p.ad && A.querySelector('.cs-forma').textContent === String(p.no), kulup: !!A.querySelector('[data-eylem=csAc][data-tur=kulup][data-id=' + p.kulupId + ']'),
    sezon: ['Maç', 'Dakika', 'Gol', 'Kart'].every(x => [...A.querySelectorAll('.cs-dl dt')].some(d => d.textContent === x)),
    bu: !!bu && (gol === 0 || bu.textContent.includes(gol + ' gol')) && bu.textContent.includes(' dk'), saglik: A.textContent.includes('Sağlık geçmişi'),
    geri: (A.querySelector('.cs-geri') || {}).textContent || '' }; }"""
TAKIM_JS = """([id, bol]) => { const k = OYUN.kariyer, A = document.querySelector('.tlf-is .cs-sayfa[data-tur=kulup]'); if (!A) return null; const t = A.textContent;
  if (bol === 'genel') return { ad: A.querySelector('h4').textContent === k.kulupler[id].ad, arma: !!A.querySelector('.cs-kulupBas .arma-buyuk'), sirada: t.includes('Sıradaki'), stat: t.includes('Stat') };
  if (bol === 'maclar') { const L = [...A.querySelectorAll('.cs-maclar li')]; return { n: L.length, beklenen: k.sezon.haftaSayisi - k.sezon.ilkHafta + 1, oynanan: L.filter(l => l.querySelector('b')).length }; }
  if (bol === 'kadro') return { n: A.querySelectorAll('.cs-kadroTablo tbody tr').length, beklenen: kulupOyunculari(k, id).length };
  return { kayitli: t.includes('Kayıtlı maç2 '), golculer: t.includes('Golcüler') }; }"""
KAYDIR_JS = """(ne) => { const s = document.querySelector('.tlf-is .cs-sayfa'); let e = s; while (e && !['auto', 'scroll'].includes(getComputedStyle(e).overflowY)) e = e.parentElement;
  if (!e) return { y: -1, tur: s ? s.dataset.tur : null }; if (ne === 'alt') e.scrollTop = e.scrollHeight; return { y: Math.round(e.scrollTop), tur: s.dataset.tur, h: e.scrollHeight - e.clientHeight }; }"""
SAYFA_YERI_JS = """() => { const s = document.querySelector('.tlf-is .cs-sayfa'); return [s ? s.dataset.tur : null, (document.querySelector('.tlf-is .cs-sekme[aria-selected=true]') || {dataset: {}}).dataset.bolum || null,
  (document.querySelector('.tel-ekran') || {dataset: {}}).dataset.ekran || null]; }"""


async def cs_ac(pg, tur, kimlik, kok=".tel"):
    """R3: Canlı Skor'da satıra (maç, kulüp) ya da sayfadaki bağa dokunur: sayfa yığına girer."""
    await pg.click(f'{kok} [data-eylem="csAc"][data-tur="{tur}"][data-id="{kimlik}"]')


async def cs_bolum(pg, bolum):
    await pg.click(f'.cs-sayfa [data-eylem="csBolum"][data-bolum="{bolum}"]')


async def skor_ana(pg, en_cok=6):
    """R3: telefon ana ekrana dönene dek Esc (sayfa yığını birer birer boşalır); ana ekrana varıldı mı."""
    js = "() => (document.querySelector('.tel-ekran') || {dataset: {}}).dataset.ekran === 'ana'"
    for _ in range(en_cok):
        if await pg.evaluate(js):
            return True
        await pg.keyboard.press("Escape")
    return await pg.evaluate(js)


# N7: telefonun yerleşimi: içerideki yatay taşma (piksel), cihazın panele sığması, konuşmada iki cevabın cevap alanında kaydırmadan görünmesi
# N9: seyircinin sürekliliği (js/seyirci.js seyirciDurumlari): 0–300 sn arası 0,25 sn'de bir; seyirci saati çıkıştan sonra maç zamanıyla, atlamada sıçrar
SEYIRCI_JS = """() => {
  const R = { yuruyen: YURUYEN.length, havuz: YURUYEN_HAVUZ, belirme: 0, kapida: 0, varis: 0, enCok: 0, kotu: [], egri: true,
    gec: YURUYEN.filter(k => k.yuru.son > 262).length };
  let once = null;
  for (let A = 0; A <= 300.001; A += 0.25) {
    const D = seyirciDurumlari(A); let n = 0, dolu = 0;
    for (let j = 0; j < D.length; j++) { const d = D[j]; if (d.tur === 'yol' && d.g) n++; if (d.tur === 'yer' && d.g) dolu++;
      if (!once) continue; const p = once[j];
      if (d.g && !p.g) { R.belirme++; if (d.tur === 'yol' && d.kapida) R.kapida++; else if (R.kotu.length < 5) R.kotu.push({ A, i: d.i, tur: d.tur }); }
      else if (d.g && p.g) { const m = Math.hypot(d.x - p.x, d.y - p.y, d.z - p.z); if (m > 0.6 && R.kotu.length < 5) R.kotu.push({ A, i: d.i, m: +m.toFixed(2) }); if (p.tur === 'yol' && d.tur === 'yer') R.varis++; } }
    /* yerindekiler: eski kuraldaki (geliş sırası doluluğu geçmiş) kişilerle aynı */
    if (A <= 262 && A % 10 === 0) { const eski = SEYIRCI_KISILER.filter(k => k.kayit.gelis <= cizgiDegeri(MAC_SENARYOSU.tribun, A)).length; if (eski !== dolu) R.egri = false; }
    R.enCok = Math.max(R.enCok, n); once = D; }
  /* seyirci saati: çıkıştan sonra (senaryo durmuş) maç zamanıyla ilerler; atlamada senaryo saatine sıçrar */
  const S = SEYIRCI_SAAT, eski = { A: S.A, faz: mac.phase, t: mac.sen.t };
  S.A = 262; mac.sen.t = 262; mac.phase = 'giris'; seyirciSaatIlerlet(8); const a1 = S.A; mac.sen.t = 322; seyirciSaatIlerlet(0.016); const a2 = S.A;
  S.A = eski.A; mac.phase = eski.faz; mac.sen.t = eski.t; R.saat = [+a1.toFixed(2), +a2.toFixed(2)];
  return R; }"""
# N11: varışın göz yolu: iki yürüyüş (sokak kapısına; merdivenden locaya) ve oturma, 1/60 sn'de bir; kesme (siyah) hariç
VARIS_HAREKET_JS = """() => { const Y = LOCA_GIRIS.yol, T = STIL.locaGiris.sure, P = new THREE.Vector3(), B = new THREE.Vector3(), R = { ivme: 0, sicrama: 0 };
  const parca = K => { for (let i = 2; i < K.length; i++) { const v1 = K[i - 1].clone().sub(K[i - 2]).multiplyScalar(60), v2 = K[i].clone().sub(K[i - 1]).multiplyScalar(60);
      R.sicrama = Math.max(R.sicrama, Math.abs(v2.length() - v1.length())); R.ivme = Math.max(R.ivme, v2.clone().sub(v1).length() * 60); } };
  for (const Z of [Y.Y1, Y.Y2]) { const K = []; for (let t = 0; t <= Z.yuru; t += 1 / 60) { yrYuruAn(Z, t, P, B); K.push(P.clone()); } parca(K); }
  { const K = []; for (let t = 0; t <= T.otur; t += 1 / 60) { yrOtur(t / T.otur, Y.ayakta, Y.oturma, new THREE.Vector3(0, 0, 1), P); K.push(P.clone()); } parca(K); }
  const Z = Y.Y2, i = Z.D.findIndex(d => d >= Y.mb);
  R.merdivenAdim = +(Z.FZ[i < 0 ? Z.FZ.length - 1 : i]).toFixed(2); R.basamak = STIL.locaGiris.merdiven.basamak;
  R.toplam = +(T.bekle + Y.Y1.yuru + T.kesmeSiyah + Y.Y2.yuru + T.otur + T.raf).toFixed(2); R.ivme = +R.ivme.toFixed(2); R.sicrama = +R.sicrama.toFixed(3); return R; }"""
TEL_YERLESIM_JS = """() => { const T = document.querySelector('.tel'), P = document.querySelector('.od-telefonPanel'), E = document.querySelector('.tel-ekran'), I = document.querySelector('.tlf-is');
  if (!T || !P || !E) return { tasma: 99, sigiyor: false, cevapGorunur: false, genislik: 0 };
  const t = T.getBoundingClientRect(), p = P.getBoundingClientRect(), i = I ? I.getBoundingClientRect() : null;
  const tasma = Math.max(0, ...[...T.querySelectorAll('.tel-govde, .tel-bildirimler, .tel-liste, .tel-skor, .tel-mac'), ...(I ? [I] : [])].map(x => x.scrollWidth - x.clientWidth));
  /* R2 (2026-10-29): odada iki sütun — iş paneli telefonun sağında, kabın içinde; konuşmada panelin tek kartı ve iki kenar etiketi (nötr yüz) panelin içinde,
     kaydırmadan görünür (açılışta panel kartı görünür kılar) */
  /* R2 eki: kenar etiketleri gizli (cevaplar kaydırınca görünür); kaydırmadan görünmesi gereken kartın kendisi */
  const K = I && I.querySelector('.kk-kart'), B = K ? [K] : [];
  const cevapGorunur = !!K && B.length === 1 && K.dataset.yuz === 'notr' && B.every(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.left >= i.left - 1 && r.right <= i.right + 1
    && r.top >= i.top - 1 && r.bottom <= i.bottom + 1; });
  const yan = !!i && i.left >= t.right - 1 && i.right <= p.right + 1 && i.top >= p.top - 1 && i.bottom <= p.bottom + 1;
  /* RN-a (2026-10-30): iş yokken panel yok, telefon kabın ortasında (≤ 2 px) */
  const yalniz = !!document.querySelector('#oda .tlf.tlf-yalniz'), merkez = Math.abs((t.left + t.right) / 2 - (p.left + p.right) / 2) <= 2;
  return { tasma, sigiyor: t.left >= p.left - 1 && t.right <= p.right + 1 && t.top >= p.top - 1 && t.bottom <= p.bottom + 1 && (yalniz ? !i && merkez : yan), cevapGorunur, genislik: Math.round(t.width),
    panel: i ? Math.round(i.width) : 0, kart: K ? Math.round(K.getBoundingClientRect().height) : 0 }; }"""
# H1 (tek kart): kartın yüzü (nötr | sol | sag), yüz metni, kilit (aria-disabled), engel ve kenarların basılı durumu; kok kartı içeren kabın seçicisi
YUZ_JS = """(kok) => { const c = document.querySelector(kok + ' .kk-kart'); if (!c) return null;
  return { yuz: c.dataset.yuz, metin: c.querySelector('.kk-yuz').textContent, kilit: c.getAttribute('aria-disabled'), engel: c.hasAttribute('data-engel'),
    basili: [...c.querySelectorAll('.kk-kenar')].map(b => b.getAttribute('aria-pressed')).join(',') }; }"""
# sürüklemede kartın yüzlerini sırayla kaydeder (ev sahibi önizlemede yeniden çizer; sürüklemenin karta ulaştığının kanıtı)
YUZ_IZLE_JS = """(kok) => { window.__yuzler = []; if (window.__yuzIzle) window.__yuzIzle.disconnect();
  window.__yuzIzle = new MutationObserver(() => { const c = document.querySelector(kok + ' .kk-kart'), y = c && c.dataset.yuz; if (y && window.__yuzler[window.__yuzler.length - 1] !== y) window.__yuzler.push(y); });
  window.__yuzIzle.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-yuz'] }); }"""
YUZ_IZ_BITIR_JS = "() => { if (window.__yuzIzle) window.__yuzIzle.disconnect(); window.__yuzIzle = null; return window.__yuzler || []; }"
# inceleme (2026-10-26): önizlenen yüzün kalıcı canlı bölgesi (#kartDuyuru): odanın dışında, yeniden çizimde aynı düğüm; kartın yüzü canlı bölge değil
DUYURU_JS = """() => { const d = document.getElementById('kartDuyuru'); if (!d) return null; const ayni = window.__duyuru ? window.__duyuru === d : null; window.__duyuru = d;
  return { metin: d.textContent, canli: d.getAttribute('aria-live'), rol: d.getAttribute('role'), disarda: !document.getElementById('oda').contains(d),
    ayni, yuzCanli: document.querySelectorAll('.kk-yuz[aria-live]').length }; }"""
# kartı yüzünden tutma noktası ve kartın genişliği
KART_TUT_JS = """(kok) => { const c = document.querySelector(kok + ' .kk-kart'), r = c.getBoundingClientRect(), y = c.querySelector('.kk-yuz').getBoundingClientRect();
  return { x: r.left + r.width / 2, y: y.top + Math.min(y.height / 2, 18), g: c.offsetWidth }; }"""


async def duyuru(pg):
    """inceleme (2026-10-26): kartDuyur metni kısa bir gecikmeyle yazar (önce boşaltır); dolana dek beklenir, sonra DUYURU_JS."""
    try:
        await pg.wait_for_function("() => { const d = document.getElementById('kartDuyuru'); return !!d && d.textContent.length > 0; }", timeout=3000)
    except Exception:
        pass
    return await pg.evaluate(DUYURU_JS)


async def kart_surukle(pg, kok, oran):
    """H1: kabın kartını yüzünden tutup kart genişliğinin oran katı kadar yatay sürükler ve bırakır (eksi: sola). Kartın genişliğini döndürür."""
    await pg.locator(kok + " .kk-kart").scroll_into_view_if_needed()
    r = await pg.evaluate(KART_TUT_JS, kok)
    await surukle(pg, r["x"], r["y"], r["x"] + oran * r["g"], r["y"], 16)
    await pg.wait_for_timeout(350)  # yaylanma (STIL.kagit.kart.sure 0,2 sn) bitsin
    return r["g"]


async def kart_surukle_tus(pg, kok, oran, tus):
    """inceleme (2026-10-26): kartı oran katı kadar sürükler, düğme basılıyken tuşa basar, sonra bırakır. Sürüklemede, tuştan sonra ve bırakınca
    kartın yüzünü döndürür (sürükleme kartı odaklar; ev sahibi önizlemede yeniden çizip odağı yeni karta verir)."""
    await pg.locator(kok + " .kk-kart").scroll_into_view_if_needed()
    r = await pg.evaluate(KART_TUT_JS, kok)
    await pg.mouse.move(r["x"], r["y"])
    await pg.mouse.down()
    await pg.mouse.move(r["x"] + oran * r["g"], r["y"], steps=16)
    y0 = await pg.evaluate(YUZ_JS, kok)
    await pg.keyboard.press(tus)
    y1 = await pg.evaluate(YUZ_JS, kok)
    await pg.mouse.up()
    await pg.wait_for_timeout(350)  # yaylanma (STIL.kagit.kart.sure 0,2 sn) bitsin
    y2 = await pg.evaluate(YUZ_JS, kok)
    return [y and y["yuz"] for y in (y0, y1, y2)]


# U2: sürüklenen kartın (dönmüş) kutusu, kartı kırpan ilk atanın (overflow) iç kutusuna göre; yüz, hazır işareti ve görünen üst etiket
KART_KAP_JS = """([kok, kart]) => { const c = document.querySelector(kok + ' ' + kart); if (!c) return null; const r = c.getBoundingClientRect();
  let a = c.parentElement; while (a && a !== document.documentElement) { const s = getComputedStyle(a); if (s.overflowX !== 'visible' || s.overflowY !== 'visible') break; a = a.parentElement; }
  const pen = !a || a === document.documentElement, k = pen ? { left: 0, top: 0 } : a.getBoundingClientRect();
  const L = k.left + (pen ? 0 : a.clientLeft), T = k.top + (pen ? 0 : a.clientTop), W = pen ? innerWidth : a.clientWidth, H = pen ? innerHeight : a.clientHeight;
  /* R2 eki: cevabın adı üst etikette değil, kartın görünen yüzündedir: “ust” görünen yüzün yönü (karar anında kartın yüzü) */
  const u = c.querySelector('.kk-yuzKat.kk-yuz') || c;
  return { yuz: c.dataset.yuz, hazir: c.hasAttribute('data-hazir'), ust: u.dataset.yuz === 'sol' || u.dataset.yuz === 'sag' ? u.dataset.yuz : null, kap: pen ? 'pencere' : a.className.split(' ')[0],
    sol: +(r.left - L).toFixed(1), sag: +(L + W - r.right).toFixed(1), ustPay: +(r.top - T).toFixed(1), alt: +(T + H - r.bottom).toFixed(1) }; }"""
KART_TUT2_JS = """([kok, kart]) => { const c = document.querySelector(kok + ' ' + kart), r = c.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 40), g: c.offsetWidth }; }"""


async def kart_kap(pg, kok, oranlar=(0.1, 0.25, 0.55, 1.2), kart=".kk-kart"):
    """U2: kartı tutup sağa, sonra sola oranlar kadar (kart genişliğine göre) sürükler; her durakta kartın kutusunu onu kırpan kabın iç kutusuyla
    ölçer (KART_KAP_JS), sonra işaretçiyi başladığı yere getirip bırakır (karar uygulanmaz, kart yerine yaylanır). Ölçüleri oranla döndürür."""
    await pg.locator(kok + " " + kart).scroll_into_view_if_needed()
    r = await pg.evaluate(KART_TUT2_JS, [kok, kart])
    olc = []
    for yon in (1, -1):
        await pg.mouse.move(r["x"], r["y"])
        await pg.mouse.down()
        for o in oranlar:
            await pg.mouse.move(r["x"] + yon * o * r["g"], r["y"], steps=6)
            m = await pg.evaluate(KART_KAP_JS, [kok, kart])
            m["oran"] = yon * o
            olc.append(m)
        await pg.mouse.move(r["x"], r["y"], steps=6)
        await pg.mouse.up()
        await pg.wait_for_timeout(350)  # yaylanma (STIL.kagit.kart.sure 0,2 sn) bitsin
    return olc


def kap_disi(olc, pay=1):
    """U2: kabından (pay pikselden çok) taşan duraklar; kart sınırlı kaydığı için boş olmalı."""
    return [m for m in olc if min(m["sol"], m["sag"], m["ustPay"], m["alt"]) < -pay]


async def konu_sec(pg, girisim):
    """R2 eki: telefonun iş panelinde konu “Yeni konu aç” menüsündedir: menü kapalıysa açılır, sonra konuya basılır."""
    if not await pg.query_selector(f'.tlf-menu [data-girisim="{girisim}"]'):
        await pg.click('.tel-yeniKonu button')
    await pg.click(f'.tlf-menu [data-girisim="{girisim}"]')


async def konu_menu_ac(pg):
    """R2 eki: “Yeni konu aç” menüsünü açar (açıksa dokunmaz)."""
    if not await pg.query_selector('.tlf-menu'):
        await pg.click('.tel-yeniKonu button')


def kap_yonler(olc, hazir=True):
    """U2: her durakta yüz sürüklenen yönde; %55 ve üstünde üst etiket o yönün cevabı ve (uygulanabilir cevapta) kart hazır."""
    y = lambda m: "sag" if m["oran"] > 0 else "sol"
    return all(m["yuz"] == y(m) for m in olc) and all(m["ust"] == y(m) and m["hazir"] == hazir for m in olc if abs(m["oran"]) >= 0.55)


async def bolum_3(tarayici, site, tum_hatalar):
    """TEST içeriğiyle defter, telefon ve masada açık dosya (2.8M). H1 (F4, 2026-10-26): karar tek kart (js/ekran-kart.js): (a) dosyada tek kart,
    kenarlar Kabul et / Saymana devret, eski düğmeler yok; (b) %25 sürükleyip bırakmak uygulamaz; (c) %55 sürükleyip bırakmak bir kez uygular; (d) karar
    panelinde ←/→ önizler, Esc bırakır, → + Enter uygular; (e) Duraklat'ta kart kilitli (Enter ve sürükleme uygulamaz); (f) telefonda cevap alanındaki
    kart 13 ölçümde taşmasız ve kaydırmasız; (g) yenilemede karar bir kez; 15 dk'lık cevabın yüzünde kaçırılacak iş uyarısı. İnceleme (2026-10-26):
    önizlenen yüz kalıcı #kartDuyuru'dan duyurulur; Boşluk/P duraklatmasında odak kartta kalır; sürüklerken klavyeyle çevrilen ya da bırakılan
    önizlemede bırakmak uygulamaz."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7", "index-test.html")
    tum_hatalar += hatalar
    await pg.keyboard.press("Digit2")
    bloklar = await pg.eval_on_selector_all(".dft-sag .dft-kayit", "L => L.map(b => b.textContent)")
    denetle("Defter: Pazartesi 11:00 randevusu ve 15:00 isteğe bağlı iş saat çizgilerinde blok; ilk bekleyen seçili, Katıl ve Ertele alt şeritte",
            any("11:00 Deneme randevusu" in b for b in bloklar) and any("15:00" in b for b in bloklar)
            and await pg.query_selector('.od-alt .od-ana[data-eylem="yap"]:has-text("Katıl")') is not None
            and await pg.query_selector('.od-alt [data-eylem="ertele"]') is not None, str(bloklar))
    eylemli = await pg.eval_on_selector_all(".dft [data-eylem]", "L => L.map(b => b.dataset.eylem).filter(e => !['hafta', 'gun', 'kapat', 'testAc'].includes(e))")
    denetle("2.8Q: açık defterde eylem düğmesi yok (yalnız hafta, gün, kayıt seçimi ve Kapat)", eylemli == [], str(eylemli))
    await pg.screenshot(path=str(ARAC / "son-akis-3-defter-serit.png"))
    await pg.click('.od-alt .od-ana[data-eylem="yap"]')
    if await pg.query_selector('.od-alt .od-ana[data-eylem="yap"]:has-text("Onayla")'):
        await pg.click('.od-alt .od-ana[data-eylem="yap"]:has-text("Onayla")')
    d = await durum(pg)
    denetle("Alt şeritten randevuya katılım: saat 11:30; kayıt tamamlandı olarak üstü çizili; odakta şeritte İlerle yok (U1: zaman masadan ilerler)", d["dakika"] == 690
            and await pg.query_selector('.dft-kayit.dft-bitti:has-text("Deneme randevusu")') is not None
            and await pg.query_selector('.od-alt .od-ana[data-eylem^="ilerle"]') is None, str(d["dakika"]))
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
    # N7: tanıdık telefon düzeni: ana ekranda cihaz, büyük saat ve bildirim kartı; karta tıklayınca o konuşma açılır
    ana = await pg.evaluate("""() => ({ cihaz: !!document.querySelector('.od-telefonPanel .tel .tel-ada') && !!document.querySelector('.tel-durum .tel-pil'),
      saat: (document.querySelector('.tel-saat') || {}).textContent, kart: [...document.querySelectorAll('.tel-bildirim')].map(b => b.textContent),
      sabit: [...document.querySelectorAll('.tel-sabit .tel-uyg')].map(b => b.dataset.uyg).join(',') })""")
    await pg.screenshot(path=str(ARAC / "son-akis-3-telefon-ana.png"))
    await pg.click('.tel-bildirim[data-kisi]')
    acilan = await pg.evaluate("({ ekran: document.querySelector('.tel-ekran').dataset.ekran, bas: (document.querySelector('.tel-kisiBas') || {}).textContent || '' })")
    denetle("N7: ana ekranda cihaz, durum çubuğu ve büyük saat (10:30), sabit sırada iki uygulama, Berk Deneme bildirimi 'Cevap bekliyor'; karta tıklayınca o konuşma açıldı",
            ana["cihaz"] and ana["saat"] == "10:30" and ana["sabit"] == "mesajlar,skor" and len(ana["kart"]) >= 1 and "Berk Deneme" in ana["kart"][0]
            and "Cevap bekliyor" in ana["kart"][0] and acilan["ekran"] == "konusma" and "Berk Deneme" in acilan["bas"], f"{ana} · {acilan}")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    liste = await pg.text_content(".tel-liste")
    await pg.wait_for_timeout(300)
    await pg.screenshot(path=str(ARAC / "son-akis-3-telefon-mesajlar.png"))
    await pg.click('.tel-kisi:has-text("Berk Deneme")')
    konusma = await pg.text_content(".tel")
    tk = await pg.evaluate("""() => ({ kart: document.querySelectorAll('.tlf-is .kk-kart').length, eski: document.querySelectorAll('.tel .kk-cevap, .tel .kk-gonder, .tel .kk-onay').length,
      gizli: [...document.querySelectorAll('.tlf-is .kk-kenarlar')].every(e => e.hidden && !e.offsetParent), gorunen: (document.querySelector('.tlf-is .kk-alan') || { innerText: '' }).innerText,
      kenar: [...document.querySelectorAll('.tlf-is .kk-kenar')].map(b => b.dataset.yon + ':' + b.dataset.secim + ':' + b.querySelector('b').textContent).join(','),
      yuz: (document.querySelector('.tlf-is .kk-kart') || { dataset: {} }).dataset.yuz })""")
    denetle("Telefon: kişi listesinde Berk Deneme cevap bekliyor; konuşmada kendi sesiyle mesaj; sağdaki iş panelinde tek kart (nötr yüz; R2); R2 eki: cevaplar görünmüyor "
            "(kenarlar gizli, kartın görünen yazısında 'Kabul et' ve 'Saymana devret' yok; soru ve kişi var), cevaplar sol Kabul et / sağ Saymana devret; eski cevap düğmeleri yok",
            "cevap bekl" in liste.replace("İ", "i").lower() and "firmamız" in konusma and tk["kart"] == 1 and tk["eski"] == 0 and tk["yuz"] == "notr"
            and tk["kenar"] == "sol:kabul:Kabul et,sag:devret:Saymana devret" and tk["gizli"] and "Kabul et" not in tk["gorunen"] and "Saymana devret" not in tk["gorunen"]
            and "400.000" in tk["gorunen"] and "Berk Deneme" in tk["gorunen"], str({x: tk[x] for x in tk if x != "gorunen"}) + " · " + tk["gorunen"][:120].replace(chr(10), " | "))
    await pg.wait_for_timeout(300)  # N7: telefonun açılış geçişi (0,18 sn) bitsin
    await pg.screenshot(path=str(ARAC / "son-akis-3-telefon.png"))
    # R2 eki: cevap ancak önizleyince görünür: → yüzü o cevaba çevirir (simge, ad, süre), Esc nötre döndürür; zaman ve karar değişmez
    t0 = await durum(pg)
    await pg.focus('.tlf-is .kk-kart')
    await pg.keyboard.press("ArrowRight")
    ty1 = await pg.evaluate(YUZ_JS, ".tlf-is")
    sim1 = await pg.evaluate("() => (document.querySelector('.tlf-is .kk-yuz .kk-simge') || { dataset: {} }).dataset.simge || null")
    await pg.wait_for_timeout(300)
    await pg.screenshot(path=str(ARAC / "son-akis-3-telefon-onizleme.png"))
    await pg.keyboard.press("Escape")
    ty2 = await pg.evaluate(YUZ_JS, ".tlf-is")
    denetle("R2 eki: → önizler ('Saymana devret' yüzü: devir simgesi, ad, 15 dk), Esc nötre döndürür; zaman ve karar değişmedi",
            ty1 and ty1["yuz"] == "sag" and "Saymana devret" in ty1["metin"] and "15 dk" in ty1["metin"] and ty1["basili"] == "false,true" and sim1 == "devir"
            and ty2 and ty2["yuz"] == "notr" and await durum(pg) == t0, f"{ty1} · {sim1} · {ty2}")
    # U2: kart sürüklenirken kabından taşmaz (R2'den beri telefonun sağındaki iş paneli); R2 eki: yüz o cevaba döner, eşikte hazır; üst etiket yalnız künye
    kap_tel = await kart_kap(pg, ".tlf-is")
    tyk = await pg.evaluate(YUZ_JS, ".tlf-is")
    ust_tel = await pg.evaluate("() => { const u = document.querySelector('.tlf-is .kk-ust'); return u ? [...u.children].map(s => s.textContent).join(' | ') : null; }")
    denetle("U2, R2: iş panelinde kart %10/%25/%55/%120 sürüklenirken (iki yöne) panelin içinde kalıyor; yüz o yöne döndü, %55'ten sonra hazır; "
            "bırakınca uygulanmadı, yüz nötr; R2 eki: üst etiket yalnız künye (soranın adı ve görevi; cevap adı yok)",
            not kap_disi(kap_tel) and kap_yonler(kap_tel) and tyk and tyk["yuz"] == "notr" and await durum(pg) == t0
            and (ust_tel or "").startswith("Berk Deneme") and "Kabul et" not in ust_tel and await pg.query_selector(".tel-cevapBas") is None,
            f"{kap_disi(kap_tel) or [(m['oran'], m['yuz'], m['ust'], m['hazir'], m['sol'], m['sag']) for m in kap_tel]} · {ust_tel}")
    geri_tel = await pg.evaluate("() => { const b = document.querySelector('.tel-kisiBas .tel-geri'); return b ? [b.textContent, b.getAttribute('aria-label')] : null; }")
    denetle("U2: konuşmanın başlığında Geri gideceği yerin adını taşıyor ('Mesajlar', ekran okuyucuya 'Geri: Mesajlar'); kişi ikinci satırda",
            geri_tel == ["Mesajlar", "Geri: Mesajlar"], str(geri_tel))
    # N7: büyük yazıda kart ve iki kenarı kaydırmadan görünür; büyük yazıda ve dar pencerede dört ekranda yatay taşma yok; Esc önce ana ekrana döner
    olcumler, kaplar = {}, {}
    async def tel_yerlesim(ad):
        await pg.wait_for_timeout(450)   # RN-a: telefonun kayma geçişi (0,28 sn; kare işlenemezse 0,36 sn'de kesilir)
        olcumler[ad] = await pg.evaluate(TEL_YERLESIM_JS)
    await tel_yerlesim("normal-konusma")
    await pg.keyboard.press("Escape")
    esc1 = await pg.evaluate("({ panel: !!document.querySelector('.od-telefonPanel'), ekran: (document.querySelector('.tel-ekran') || {dataset: {}}).dataset.ekran })")
    await pg.keyboard.press("Escape")
    esc1b = await pg.evaluate("({ panel: !!document.querySelector('.od-telefonPanel'), ekran: (document.querySelector('.tel-ekran') || {dataset: {}}).dataset.ekran })")
    await pg.keyboard.press("Escape")
    esc2 = await pg.query_selector(".od-telefonPanel") is None
    denetle("U1 (N7'nin yerine): Esc konuşmadan Mesajlar'a, oradan ana ekrana döndü (telefon açık); ana ekranda Esc telefonu kapattı",
            esc1 == {"panel": True, "ekran": "mesajlar"} and esc1b == {"panel": True, "ekran": "ana"} and esc2, f"{esc1} · {esc1b} · {esc2}")
    for yazi, boyut in (("buyuk", (1180, 1000)), ("normal", (672, 600)), ("buyuk", (672, 600))):
        await pg.set_viewport_size({"width": boyut[0], "height": boyut[1]})
        await ayar_yazi(pg, yazi)
        await pg.keyboard.press("Digit1")
        etiket = f"{yazi}-{boyut[0]}"
        await tel_yerlesim(etiket + "-ana")
        await pg.click('.tel-bildirim[data-kisi]')
        await tel_yerlesim(etiket + "-konusma")
        kaplar[etiket] = await kart_kap(pg, ".tlf-is", (0.25, 1.2))
        if etiket == "buyuk-1180":
            await pg.wait_for_timeout(300)  # N7: telefonun açılış geçişi (0,18 sn) bitsin
            await pg.screenshot(path=str(ARAC / "son-akis-3-telefon-buyuk.png"))
        await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
        await tel_yerlesim(etiket + "-mesajlar")
        await pg.click('.tel [data-eylem="telEv"]')
        await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
        await tel_yerlesim(etiket + "-skor")
        await masaya_don(pg)
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    await ayar_yazi(pg, "normal")
    # R2 (2026-10-29): kart telefondan sağdaki iş paneline çıktı; R1-f'nin 800 px istisnaları (borç defteri B47, B48) kalktı, bütün ölçüler kesin
    kotu = {a: o for a, o in olcumler.items() if o["tasma"] > 1 or not o["sigiyor"] or (a.endswith("konusma") and not o["cevapGorunur"])}
    denetle("(f) N7, R2, RN-a: normal ve büyük yazıda, 1180 ve 672 piksel genişlikte (640 px kare) dört ekranda yatay taşma yok; cihaz ve iş paneli yan yana kaba sığıyor (panelsiz ekranlarda cihaz kabın ortasında); konuşmada panelin tek kartı ve iki kenarı kaydırmadan görünüyor (B47)",
            len(olcumler) == 13 and not kotu, str(kotu or {a: (o["tasma"], o["genislik"], o["panel"], o["kart"]) for a, o in olcumler.items()}))
    kap_kotu = {a: kap_disi(o) for a, o in kaplar.items() if kap_disi(o) or not kap_yonler(o)}
    denetle("U2, R2: büyük yazıda 1180 px, normal ve büyük yazıda 672 px'te (640 px kare) iş panelinde kart %25 ve %120 sürüklenirken panelin içinde; %120'de üst etikette o cevap ve hazır (B48)",
            len(kaplar) == 3 and not kap_kotu, str(kap_kotu or {a: [(m["oran"], m["sol"], m["sag"], m["ustPay"], m["alt"]) for m in o] for a, o in kaplar.items()}))
    # (g) 15 dk'lık cevabın ("Saymana devret") önizlenen yüzünde kaçırılacak iş uyarısı. TEST içeriğinin 15:00 isteğe bağlı işi Pazartesidir, karar Salı
    # 10:30'da gelir; aynı çakışma için sayfada 10 dk sonraya isteğe bağlı bir iş eklenir (yalnız bu deneme), denetimden sonra iptal edilir
    await pg.evaluate("""() => oyunKomut(k => { window.__ekIs = isEkle(k, { tur: 'ajanda', tarih: k.tarih, dakika: k.gunIciDakika + 10,
      veri: { baslik: 'İsteğe bağlı deneme (çakışma)', zorunluluk: 'istege', sure: 60, aciklama: 'Gelmezsen kaçırılır.' } }); })""")
    KEZ_JS = "(karar) => OYUN.kariyer.gecmis.filter(g => g.tur === 'is' && g.sonuc && g.sonuc.karar === karar).map(g => g.sonuc.secim)"
    await pg.keyboard.press("Digit3")
    dsy = await pg.evaluate("""() => ({ sekme: document.querySelectorAll('.dsy-sekme[role="tab"]:not(.dsy-arsivSekme):not(.dsy-raporSekme):not(.dsy-kadroSekme)').length, nokta: !!document.querySelector('.dsy-sekme:not(.dsy-raporSekme) .dsy-nokta'),
      damga: (document.querySelector('.dsy-damga') || {}).textContent, notlar: [...document.querySelectorAll('.dsy-not small')].map(x => x.textContent.trim()),
      kart: document.querySelectorAll('.dsy .kk-kart').length, eski: document.querySelectorAll('.dsy .kk-cevap, .dsy .kk-gonder, .dsy .kk-onay, .dsy [data-eylem="sec"]').length,
      kenar: [...document.querySelectorAll('.dsy .kk-kart .kk-kenar')].map(b => b.querySelector('b').textContent).join(' / '),
      yuz: (document.querySelector('.dsy .kk-kart') || { dataset: {} }).dataset.yuz, kisi: (document.querySelector('.dsy-kisi b') || {}).textContent,
      perde: !!document.querySelector('.od-perde'), arsiv: document.querySelector('.dsy-arsivSekme').disabled })""")
    denetle("(a) Masada açık dosya: tek sekme (cevap bekliyor noktası), 'Cevap bekliyor' damgası, ataşlı iki kanıt (defter ve saymanın görüşü), kişi ve tek kart "
            "(nötr yüz, kenarlar Kabul et / Saymana devret; Gönder ve cevap düğmeleri yok); arşiv boş",
            dsy["perde"] and dsy["sekme"] == 1 and dsy["nokta"] and "bekliyor" in (dsy["damga"] or "").lower() and dsy["notlar"] == ["— Deneme defteri", "— Ayla Deneme"]
            and dsy["kart"] == 1 and dsy["eski"] == 0 and dsy["kenar"] == "Kabul et / Saymana devret" and dsy["yuz"] == "notr" and dsy["kisi"] == "Berk Deneme" and dsy["arsiv"], str(dsy))
    await pg.screenshot(path=str(ARAC / "son-akis-3-dosya.png"))
    # H2-d: açılış raporu Raporlar sekmesinden bir kez okunur (görüldü), sonra konuya dönülür; konu kapanınca dosya yine son konuyu açar
    await pg.click(".dsy-raporSekme")
    rap = await pg.text_content(".dsy")
    await pg.click('.dsy-sekme[role="tab"]:not(.dsy-arsivSekme):not(.dsy-raporSekme):not(.dsy-kadroSekme)')
    denetle("H2-d: Raporlar sekmesi açılış özetini gösterir (müdür, kasadaki para); konu sekmesine dönülür, konunun kartı yerinde",
            "Haftalık mali özet" in rap and "Kasadaki para" in rap and await pg.query_selector(".dsy .kk-kart") is not None
            and await pg.evaluate("() => maliRaporlari(OYUN.kariyer).every(x => x.h.gorulen)"), rap[:100])
    once = await durum(pg)
    await pg.click(".dsy-gecmis summary")
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit3")
    denetle("Dosyayı kapatıp açmak ve geçmişi okumak zamanı ve kararı değiştirmiyor", await durum(pg) == once)
    y0 = await pg.evaluate(YUZ_JS, ".dsy")
    await pg.focus('.dsy .kk-kart')
    await pg.keyboard.press("ArrowRight")
    y1 = await pg.evaluate(YUZ_JS, ".dsy")
    du1 = await duyuru(pg)
    await pg.screenshot(path=str(ARAC / "son-akis-3-dosya-onizleme.png"))
    await pg.keyboard.press("ArrowLeft")
    y2 = await pg.evaluate(YUZ_JS, ".dsy")
    du2 = await duyuru(pg)
    await pg.keyboard.press("Escape")
    y3 = await pg.evaluate(YUZ_JS, ".dsy")
    denetle("(g) R2 eki: nötr yüzde cevap yok, yalnız 'Cevaplardan biri zaman alır.'; → 'Saymana devret' yüzünde cevabın metni, 15 dk ve 'kaçırılacak' uyarısı (10 dk sonraki "
            "isteğe bağlı iş); ← 'Kabul et' yüzünde 'zaman almaz', uyarı yok; Esc nötre döndürür; zaman ve karar değişmedi",
            y0 and y0["yuz"] == "notr" and "Cevaplardan biri zaman alır." in y0["metin"] and "Saymana devret" not in y0["metin"] and "Kabul et" not in y0["metin"]
            and y1 and y1["yuz"] == "sag" and "Saymana devret" in y1["metin"] and "15 dk" in y1["metin"] and "kaçırılacak: İsteğe bağlı deneme (çakışma)" in y1["metin"]
            and y2 and y2["yuz"] == "sol" and "Kabul et" in y2["metin"] and "zaman almaz" in y2["metin"] and "kaçırılacak" not in y2["metin"]
            and y3 and y3["yuz"] == "notr" and await durum(pg) == once, f"{y0} · {y1} · {y2} · {y3}")
    denetle("İnceleme (2026-10-26): önizlenen yüz kalıcı canlı bölgeden duyuruluyor (#kartDuyuru role=status, odanın dışında, iki önizlemede aynı düğüm; kartın yüzünde "
            "aria-live yok): önce 'Saymana devret' 15 dk ve kaçırılacak uyarısıyla, sonra 'Kabul et' zaman almaz, uyarısız",
            du1 and du1["canli"] == "polite" and du1["rol"] == "status" and du1["disarda"] and du1["yuzCanli"] == 0 and "Saymana devret" in du1["metin"]
            and "15 dk" in du1["metin"] and "kaçırılacak: İsteğe bağlı deneme (çakışma)" in du1["metin"] and du2 and du2["ayni"] is True and du2["disarda"]
            and "Kabul et" in du2["metin"] and "zaman almaz" in du2["metin"] and "kaçırılacak" not in du2["metin"], f"{du1} · {du2}")
    await pg.evaluate("() => oyunKomut(k => isIptal(k, window.__ekIs, 'deneme: çakışma denetimi bitti'))")
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit3")
    once = await durum(pg)
    # U2: dosyada kart sürüklenirken sağ sayfanın içinde kalır; kenarlar kıpırdamaz (üç yüz aynı hücrede: yüz dönünce kartın boyu aynı)
    boy0 = await pg.evaluate("() => document.querySelector('.dsy .kk-kart').offsetHeight")
    kap_dsy = await kart_kap(pg, ".dsy")
    boylar = await pg.evaluate("""async () => { const c = document.querySelector('.dsy .kk-kart'), B = [];
      for (const y of ['sag', 'sol']) { c.querySelector('.kk-kenar[data-yon="' + y + '"]').click(); B.push(document.querySelector('.dsy .kk-kart').offsetHeight); }
      document.querySelector('.dsy .kk-kenar[data-yon="sol"]').click(); return B; }""")
    denetle("U2: dosyada kart %10/%25/%55/%120 sürüklenirken (iki yöne) sayfanın içinde; yüz o yöne döndü, %55'ten sonra o cevabın yüzü ve hazır; uygulanmadı; "
            "yüz dönünce kartın boyu aynı (kenarlar yerinde)",
            not kap_disi(kap_dsy) and kap_yonler(kap_dsy) and await durum(pg) == once and boylar == [boy0, boy0]
            and (await pg.evaluate(YUZ_JS, ".dsy"))["yuz"] == "notr",
            f"{kap_disi(kap_dsy) or [(m['oran'], m['yuz'], m['ust'], m['hazir'], m['sol'], m['sag'], m['kap']) for m in kap_dsy]} · boy {boy0} → {boylar}")
    # (b) genişliğin %25'i kadar sola sürükleyip bırakmak uygulamaz: yüz önizlemeye döner, bırakınca nötre yaylanır
    await pg.evaluate(YUZ_IZLE_JS, ".dsy")
    g = await kart_surukle(pg, ".dsy", -0.25)
    iz = await pg.evaluate(YUZ_IZ_BITIR_JS)
    yb = await pg.evaluate(YUZ_JS, ".dsy")
    denetle("(b) %25 sürükleyip bırakmak uygulamadı: sürüklerken yüz 'Kabul et'e döndü, bırakınca nötre yaylandı; zaman ve kayıt aynı, geçmişte karar yok",
            "sol" in iz and yb and yb["yuz"] == "notr" and await durum(pg) == once and await pg.evaluate(KEZ_JS, "denemeKarari") == [], f"genişlik {g} px · yüzler {iz} · {yb and yb['yuz']}")
    # (c) %55 sola sürükleyip bırakmak 'Kabul et'i bir kez uygular
    await kart_surukle(pg, ".dsy", -0.55)
    dmg = await pg.evaluate("() => ({ kat: document.querySelectorAll('.kk-damgaKat').length, kart: document.querySelectorAll('.kk-kart').length, metin: document.getElementById('oda').innerText.includes('KABUL ET') })")
    await pg.wait_for_timeout(1000)
    dmg["sonra"] = await pg.evaluate("() => document.querySelectorAll('.kk-damgaKat').length")
    denetle("U2: uygulanınca kartın yerinde damgalı kopya belirdi (kapalı gölge ağacında: kart seçicileri ve sayfa metni onu görmüyor), ~0,7 sn sonra kalktı",
            dmg == {"kat": 1, "kart": 0, "metin": False, "sonra": 0}, str(dmg))
    d = await durum(pg)
    sonuc = await pg.text_content(".dsy-sonuc") if await pg.query_selector(".dsy-sonuc") else ""
    secimler = await pg.evaluate(KEZ_JS, "denemeKarari")
    denetle("(c) %55 sürükleyip bırakmak 'Kabul et'i bir kez uyguladı; sonuç aynı sayfada; söz açık, konu haber bekliyor; sekmenin noktası kalktı",
            secimler == ["kabul"] and d["mesele"] == "deneme:haberBekliyor" and d["soz"] == "deneme.soz:acik" and "Kabul et" in sonuc
            and await pg.query_selector(".dsy-nokta") is None, f"{secimler} · {d['mesele']} · {sonuc[:60]}")
    await pg.screenshot(path=str(ARAC / "son-akis-3-dosya-sonuc.png"))
    await oda_yenile(pg)
    d2 = await durum(pg)
    kez = len(await pg.evaluate(KEZ_JS, "denemeKarari"))
    denetle("(g) Yenileme: aynı durum; karar geçmişte bir kez", d2 == d and kez == 1, f"{kez}")
    for _ in range(4):
        if "kapandi" in (await durum(pg))["mesele"]:
            break
        await oda_ilerle(pg)
    d3 = await durum(pg)
    # H2-d: bu arada yeni haftalık rapor geldiyse dosya önce onu açar (okunmamış rapor kapalı konudan önce); okunup kapatılır
    yeni_rapor = await pg.evaluate("() => maliRaporlari(OYUN.kariyer).some(x => !x.h.gorulen)")
    if yeni_rapor:
        await pg.keyboard.press("Digit3")
        ilk = await pg.evaluate("() => (document.querySelector('.dsy-raporSekme') || {}).getAttribute ? document.querySelector('.dsy-raporSekme').getAttribute('aria-selected') : null")
        denetle("H2-d: konu kapalıyken yeni rapor varsa dosya Raporlar ile açılır", ilk == "true", str(ilk))
        await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit3")
    arsiv = await pg.text_content(".dsy")
    damga = await pg.text_content(".dsy-damga") if await pg.query_selector(".dsy-damga") else ""
    await pg.click('.dsy-arsivSekme')
    liste = await pg.text_content(".dsy")
    denetle("Tahsilat yapılınca söz tutuldu, konu kapandı; dosya son konuyu 'Kapandı' damgasıyla açıyor, Arşiv sekmesinde listede",
            d3["soz"] == "deneme.soz:tutuldu" and d3["mesele"] == "deneme:kapandi" and "Kapandı" in damga and "Arşiv (1)" in arsiv
            and "Kapanan konular" in liste and "Deneme: destek teklifi" in liste, f"{damga} · {d3['mesele']} · {arsiv[:140]}")
    await pg.keyboard.press("Escape")
    await ayar_yazi(pg, "buyuk")
    await pg.keyboard.press("Digit3")
    t1 = await pg.evaluate(TASMA_JS)
    await pg.keyboard.press("Digit2")
    t2 = await pg.evaluate(TASMA_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-3-defter-buyuk.png"))
    denetle("Büyük yazıda dosyada ve defterde yatay taşma yok", all(x <= 1 for x in t1 + t2), f"{t1} · {t2}")
    # 2.8Q: konuya bağlı olmayan karar: defterde yalnız görünür, "Karar ver" sağdaki karar panelini açar, cevaptan sonra deftere dönülür
    await pg.keyboard.press("Escape")
    await pg.evaluate("() => oyunKomut(k => testDosyasizKarar(k))")
    await pg.keyboard.press("Digit2")
    await pg.click('.dft-kayit:has-text("Dosyasız deneme kararı")')
    denetle("Dosyasız karar: defter kartında düğme yok, alt şeritte 'Karar ver'",
            await pg.query_selector(".dft-ayrinti button") is None and await pg.query_selector('.od-alt .od-ana[data-eylem="kararAc"]') is not None)
    once = await durum(pg)
    await pg.click('.od-alt .od-ana[data-eylem="kararAc"]')
    KP = '.od-panel[aria-label="Karar"]'
    panel = await pg.evaluate("""(kp) => ({ kart: document.querySelectorAll(kp + ' .kk-kart').length, eski: document.querySelectorAll(kp + ' .kk-cevap, ' + kp + ' .kk-gonder, ' + kp + ' .kk-onay').length,
      kenar: [...document.querySelectorAll(kp + ' .kk-kenar')].map(b => b.dataset.yon + ':' + b.dataset.secim + ':' + b.querySelector('b').textContent).join(',') })""", KP)
    denetle("Karar ver sağdaki karar panelini açıyor: tek kart, sol kenar Evet (secenekler[0]), sağ kenar Hayır; eski düğmeler yok; zaman değişmedi",
            panel["kart"] == 1 and panel["eski"] == 0 and panel["kenar"] == "sol:evet:Evet,sag:hayir:Hayır" and await durum(pg) == once, str(panel))
    await pg.screenshot(path=str(ARAC / "son-akis-3-karar-panel.png"))
    # (d) klavye: kart odaktayken → 'Hayır'ı önizler (sol yüz secenekler[0] = Evet; plan kuralı), Esc önizlemeyi bırakır ve panel açık kalır
    await pg.focus(KP + " .kk-kart")
    await pg.keyboard.press("ArrowLeft")
    ys = await pg.evaluate(YUZ_JS, KP)
    await pg.keyboard.press("ArrowRight")
    yh = await pg.evaluate(YUZ_JS, KP)
    dh = await durum(pg)
    await pg.screenshot(path=str(ARAC / "son-akis-3-karar-onizleme.png"))
    await pg.keyboard.press("Escape")
    ye = await pg.evaluate(YUZ_JS, KP)
    denetle("(d) Klavye: ← 'Evet'i, → 'Hayır'ı önizler (yüzde cevabın metni ve 'zaman almaz'); zaman değişmedi; Esc önizlemeyi bıraktı, panel açık kaldı",
            ys and ys["yuz"] == "sol" and "Evet" in ys["metin"] and yh and yh["yuz"] == "sag" and "Hayır" in yh["metin"] and "zaman almaz" in yh["metin"]
            and "Deneme: hayır." in yh["metin"] and yh["basili"] == "false,true" and dh == once and ye and ye["yuz"] == "notr" and await pg.query_selector(KP) is not None,
            f"{ys} · {yh} · {ye}")
    # U2: karar panelinde kart sürüklenirken panelin içinde; bırakınca uygulanmaz
    kap_pan = await kart_kap(pg, KP)
    denetle("U2: karar panelinde kart %10/%25/%55/%120 sürüklenirken (iki yöne) panelin içinde; yüz o yöne döndü, %55'ten sonra üst etikette o cevap ve hazır; uygulanmadı",
            not kap_disi(kap_pan) and kap_yonler(kap_pan) and await durum(pg) == once and await pg.evaluate(KEZ_JS, "denemeDosyasiz") == [],
            str(kap_disi(kap_pan) or [(m["oran"], m["yuz"], m["ust"], m["hazir"], m["sol"], m["sag"], m["kap"]) for m in kap_pan]))
    # (e) Duraklat açıkken kart kilitli (aria-disabled, nedeni yüzde): önizlenir, Enter ve sürükleyip bırakmak uygulamaz
    await pg.keyboard.press("KeyP")
    k0 = await pg.evaluate(YUZ_JS, KP)
    await pg.focus(KP + " .kk-kart")
    await pg.keyboard.press("ArrowRight")
    await pg.keyboard.press("Enter")
    k1 = await pg.evaluate(YUZ_JS, KP)
    e1 = await pg.evaluate(KEZ_JS, "denemeDosyasiz")
    await pg.keyboard.press("Escape")
    await pg.evaluate(YUZ_IZLE_JS, KP)
    await kart_surukle(pg, KP, 0.55)
    iz = await pg.evaluate(YUZ_IZ_BITIR_JS)
    k2 = await pg.evaluate(YUZ_JS, KP)
    e2 = await pg.evaluate(KEZ_JS, "denemeDosyasiz")
    denetle("(e) Duraklat açıkken kart aria-disabled ve 'Duraklatıldı' yazıyor; → önizledi ama Enter uygulamadı; %55 sürükleyip bırakmak uygulamadı (kart nötre yaylandı); zaman değişmedi",
            k0 and k0["kilit"] == "true" and "Duraklatıldı" in k0["metin"] and k1 and k1["yuz"] == "sag" and e1 == [] and "sag" in iz and k2 and k2["yuz"] == "notr"
            and e2 == [] and await pg.query_selector(KP) is not None and await durum(pg) == once, f"{k0} · {k1 and k1['yuz']} · yüzler {iz} · {e1}{e2}")
    await pg.keyboard.press("KeyP")
    # inceleme (2026-10-26): kart odaktayken Boşluk duraklatır, P devam ettirir; iki yeniden çizimde odak kartta kalır, ardından → yine önizler
    ODAK_JS = "(kp) => ({ odak: !!document.activeElement && document.activeElement.matches(kp + ' .kk-kart'), dur: duraklatmaVar('elle') })"
    await pg.focus(KP + " .kk-kart")
    od1 = await pg.evaluate(ODAK_JS, KP)
    await pg.keyboard.press("Space")
    od2 = await pg.evaluate(ODAK_JS, KP)
    await pg.keyboard.press("KeyP")
    od3 = await pg.evaluate(ODAK_JS, KP)
    await pg.keyboard.press("ArrowRight")
    od4 = await pg.evaluate(YUZ_JS, KP)
    await pg.keyboard.press("Escape")
    od5 = await pg.evaluate(YUZ_JS, KP)
    denetle("İnceleme (2026-10-26): kart odaktayken Boşluk duraklattı, P devam ettirdi; iki yeniden çizimde de odak kartta kaldı; → yine önizledi ('Hayır'), Esc bıraktı, panel açık; zaman ve karar aynı",
            od1["odak"] and not od1["dur"] and od2["odak"] and od2["dur"] and od3["odak"] and not od3["dur"] and od4 and od4["yuz"] == "sag" and od5 and od5["yuz"] == "notr"
            and await pg.query_selector(KP) is not None and await durum(pg) == once and await pg.evaluate(KEZ_JS, "denemeDosyasiz") == [],
            f"{od1} · {od2} · {od3} · {od4 and od4['yuz']} · {od5 and od5['yuz']}")
    # inceleme (2026-10-26): %55 sola sürüklerken (yüz 'Evet') → yüzü 'Hayır'a çevirir ya da Esc önizlemeyi bırakır; bırakmak yüzde görünmeyen 'Evet'i
    # uygulamaz, kart nötre yaylanır
    st1 = await kart_surukle_tus(pg, KP, -0.55, "ArrowRight")
    st2 = await kart_surukle_tus(pg, KP, -0.55, "Escape")
    denetle("İnceleme (2026-10-26): sürüklerken klavyeyle çevrilen (→) ya da bırakılan (Esc) önizlemede bırakmak uygulamadı; kart nötre yaylandı, panel açık; zaman ve karar aynı",
            st1 == ["sol", "sag", "notr"] and st2 == ["sol", "notr", "notr"] and await pg.query_selector(KP) is not None and await durum(pg) == once
            and await pg.evaluate(KEZ_JS, "denemeDosyasiz") == [], f"→ {st1} · Esc {st2}")
    # (d) → + Enter: 'Hayır' bir kez uygulandı, deftere dönüldü
    await pg.focus(KP + " .kk-kart")
    k3 = await pg.evaluate(YUZ_JS, KP)
    await pg.keyboard.press("ArrowRight")
    await pg.keyboard.press("Enter")
    secim = await pg.evaluate(KEZ_JS, "denemeDosyasiz")
    denetle("(d) → + Enter cevabı bir kez uyguladı ('Hayır'); ajandaya dönüldü, kayıt yapıldı olarak görünüyor",
            k3 and k3["kilit"] is None and secim == ["hayir"] and await pg.query_selector(".dft") is not None and await pg.query_selector(KP) is None
            and await pg.query_selector('.dft-kayit.dft-bitti:has-text("Dosyasız deneme kararı")') is not None, f"{secim} · {k3 and k3['kilit']}")
    await pg.context.close()


SAHNE_JS = "() => ({ z: +ODA.zaman.toFixed(4), k: ODA.kamera.position.toArray().map(v => +v.toFixed(5)).join(','), yol: ODA.yol ? +ODA.yol.t.toFixed(4) : null, yer: ODA.yer })"
# kare başına oyun saati artışı (n kare): başsız yazılım çiziminde kare hızı düşük ve dalgalıdır; zaman penceresi yerine kareler karşılaştırılır
KARE_JS = """(n) => new Promise(res => { const L = []; let son = mac.gameSec; const f = () => { const s = mac.gameSec; L.push(+(s - son).toFixed(3)); son = s;
  if (L.length < n) requestAnimationFrame(f); else res(L); }; requestAnimationFrame(f); })"""
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
    denetle("Duraklatmada defter açılıyor (okuma serbest), alt şeritteki karar/katılım düğmeleri kapalı",
            await pg.is_visible(".dft") and await pg.query_selector('.od-alt [data-eylem="yap"]:not([disabled]), .od-alt [data-eylem="ilerle"]:not([disabled])') is None and await durum(pg) == d0)
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
    # T16a (2026-10-15) sonrası: yarının ilk santrası hazırlanırken saat akmaz; "önce" ölçümü oyun saati akarken alınır (N14 sırasında bulundu,
    # 2026-10-18: eskiden 2,5 sn beklenip santra hazırlığında ölçülüyordu — önce kare başına 0, karşılaştırma anlamsızdı)
    await pg.wait_for_function("mac.phase === 'play' && mac.gameSec > 3", timeout=60000)
    await pg.wait_for_timeout(300)
    once = await pg.evaluate(KARE_JS, 5)
    await pg.keyboard.press("KeyP")
    m1 = await pg.evaluate(MAC_JS)
    await pg.wait_for_timeout(1500)
    m2 = await pg.evaluate(MAC_JS)
    denetle("Maçta Duraklat: maç saati, top, kamera (yer, bakış yönü, görüş açısı) ve eller 1,5 sn sonra aynı; gösterge açık",
            m1 == m2 and await pg.is_visible("#duraklatildi") and await pg.text_content("#btnDuraklat") == "Devam", f"{m1} → {m2}")
    await pg.keyboard.press("KeyP")
    sonra = await pg.evaluate(KARE_JS, 5)
    denetle("Devam: maç aynı andan sürdü; bekleme süresi tek seferde eklenmedi (devamdan sonraki karelerde oyun saati duraklatmadan önceki kadar ilerliyor, sıçrama yok)",
            sum(sonra) > 0 and max(sonra) <= max(once) * 1.5 + 0.2, f"önce kare başına {once} · sonra {sonra}")
    await pg.context.close()


PROGRAM_JS = "() => ({ ...ON_EKRAN.programDurumu(), faz: mac.phase, t: +mac.sen.t.toFixed(3), sn: +mac.gameSec.toFixed(3), kapali: document.getElementById('btnIlerle').disabled, acik: !document.getElementById('onEkran').hidden, cubuk: +document.querySelector('.prg-cubuk').getAttribute('aria-valuenow'), en: parseFloat(document.querySelector('.prg-cubuk i').style.width) || 0 })"


async def bolum_14(tarayici, site, tum_hatalar):
    """Maç öncesi ekranı (2.8J, 2.8N): iki takımın ilk 11'i ve son 5 maçı; dolan çubuk, 10 sn etkin hazırlık, duraklatma, elle geçiş."""
    pg, hatalar = await sayfa(tarayici, site, "?ekran=bulten&tohum=4&rakipBaskan=yok", "#onEkran:not([hidden]) #btnIlerle")
    tum_hatalar += hatalar
    yazi = await pg.text_content("#onEkran")
    on11 = await pg.eval_on_selector_all("#onEkran .oe-saha", "L => L.map(s => s.querySelectorAll('.oe-oy').length)")
    son5 = await pg.eval_on_selector_all("#onEkran .oe-son li", "L => L.length")
    denetle("Maç öncesi: iki arma (R3: kulübün kodla çizilmiş arması), iki takımın ilk 11'i (dizilişe göre 11'er numara ve ad), teknik direktörler, iki takımın son 5 maçı; hakem, averaj, bağlam cümlesi ve sahte yüzde yok",
            "Maç günü" in yazi and "Demirkapı İlçe Stadı" in yazi and await pg.eval_on_selector_all("#onEkran .prg-takim .arma-buyuk", "L => L.length") == 2
            and on11 == [11, 11] and son5 == 10 and yazi.count("Teknik direktör") == 2 and "Son 5 maç" in yazi and "İlk 11" in yazi
            and "Hakem" not in yazi and "Averaj" not in yazi and "en golcüsü" not in yazi and "%" not in yazi and await pg.query_selector(".prg-sayfalar") is None
            and await pg.query_selector('.prg-cubuk[role="progressbar"]') is not None, f"{on11} · {son5}")
    SAYFA_JS = "() => [...document.querySelectorAll('#onEkran .prg-sayfa')].map(s => !s.classList.contains('prg-gizli'))"
    eksik = await pg.eval_on_selector_all("#onEkran .prg-eksik li:not(.oe-bos)", "L => L.length")
    denetle("2.8S: sayfa 1 (Kadrolar) açık; iki takımın sakat ve cezalıları listede (2 + 3), puan durumu 16 satır ikinci sayfada",
            await pg.evaluate(SAYFA_JS) == [True, False] and eksik == 5 and await pg.eval_on_selector_all("#onEkran .prg-tablo tbody tr", "L => L.length") == 16, str(eksik))
    await pg.wait_for_timeout(3000)
    a = await pg.evaluate(PROGRAM_JS)
    denetle("3 sn sonra: Maça geç kapalı, çubuk kısmen dolu (etkin süre), maç ve tören ilerlemedi",
            a["kapali"] and 2 < a["gecen"] < 9 and 2 <= a["cubuk"] <= 8 and 15 < a["en"] < 90 and a["faz"] == "isinma" and a["t"] == 0, str(a))
    await pg.wait_for_function("ON_EKRAN.programDurumu().gecen >= 5.3", timeout=20000)
    s1 = await pg.evaluate(SAYFA_JS)
    ust = await pg.text_content("#onEkran .prg-ustAd b")
    denetle("U5: bülten kendiliğinden dönmez (5 sn sonra Kadrolar açık); başlıkta iki takım", s1 == [True, False] and ust == "Demirkapı SK – Akdeniz FK", f"{s1} · {ust}")
    await pg.click('.prg-gosterge [data-sayfa="1"]')
    s2 = await pg.evaluate(SAYFA_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-14-program-lig.png"))
    await pg.keyboard.press("KeyP")
    p1 = await pg.evaluate(PROGRAM_JS)
    await pg.wait_for_timeout(2500)
    p2 = await pg.evaluate(PROGRAM_JS)
    denetle("Lig sekmesi sayfa 2'yi açtı (U5: sekmeyle); Duraklat hazırlık çubuğunu dondurdu, sayfa yerinde; düğme kapalı ve 'Duraklatıldı' yazıyor",
            s2 == [False, True] and await pg.evaluate(SAYFA_JS) == [False, True] and p2["sayfa"] == 1
            and abs(p2["gecen"] - p1["gecen"]) < 0.06 and abs(p2["en"] - p1["en"]) < 1 and p2["kapali"] and "Duraklatıldı" in await pg.text_content(".prg-durum"), f"{p1['gecen']:.2f} → {p2['gecen']:.2f}")
    await pg.click('.prg-gosterge [data-sayfa="0"]')
    p3 = await pg.evaluate(PROGRAM_JS)
    denetle("Göstergeye tıklamak sayfa 1'i açıyor; hazırlık sayacı sıfırlanmıyor", await pg.evaluate(SAYFA_JS) == [True, False] and abs(p3["gecen"] - p2["gecen"]) < 0.06, str(p3["gecen"]))
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
    # N11: stada varış: karanlıktan açılış, sokak kapısı, kesme, merdiven, kalabalık loca, oturma; maç günü arkada sürer
    LOCA_JS = """() => ({ aktif: LOCA_GIRIS.aktif, evre: LOCA_GIRIS.evre, sayfa: ON_EKRAN.sayfa, masa: BK_MASA.visible, t: +LOCA_GIRIS.t.toFixed(3),
      k: camera.position.toArray().map(v => +v.toFixed(3)).join(','), kar: +(document.getElementById('karartma') || { style: { opacity: 0 } }).style.opacity })"""
    g = await pg.evaluate(LOCA_JS)
    denetle("N11: Maça geç'ten sonra stada varış başladı: ekran karanlıktan açılıyor (karartma koyu), raf henüz yok",
            g["aktif"] and g["sayfa"] == "loca" and not g["masa"] and g["evre"] in ("acilis", "yuru1") and (g["kar"] > 0.25 or g["t"] > 1.0), str(g))
    await pg.keyboard.press("KeyP")
    k1 = await pg.evaluate(LOCA_JS)
    await pg.wait_for_timeout(1200)
    k2 = await pg.evaluate(LOCA_JS)
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(300)
    k3 = await pg.evaluate(LOCA_JS)
    denetle("Duraklatmada varış, kamera ve karartma yerinde duruyor; Devam'dan sonra giriş sürüyor", k1 == k2 and k1["aktif"] and k3["aktif"] and k3["sayfa"] == "loca", f"{k1['t']} → {k2['t']} · devam {k3['t']}")
    await pg.wait_for_function("LOCA_GIRIS.evre === 'yuru1' && LOCA_GIRIS.tl > 0.4", timeout=60000)
    await pg.screenshot(path=str(ARAC / "son-akis-14-varis.png"))
    await pg.wait_for_function("LOCA_GIRIS.evre === 'kesme'", timeout=60000)
    kes = await pg.evaluate(LOCA_JS)
    await pg.wait_for_function("LOCA_GIRIS.evre === 'yuru2' && LOCA_GIRIS.tl > 1.2", timeout=60000)
    await pg.screenshot(path=str(ARAC / "son-akis-14-merdiven.png"))
    mer = await pg.evaluate(LOCA_JS)
    denetle("Kapı eşiğinde kısa karartma kesmesi (tam siyah), ardından merdiven kuyusunda açılış", kes["kar"] >= 0.99 and mer["kar"] < 0.05 and mer["evre"] == "yuru2", f"{kes['kar']} · {mer['kar']}")
    hk = await pg.evaluate(VARIS_HAREKET_JS)
    denetle("N11: insan gibi yürüyüş (ortak model): gözün ivmesi ≤ 6 m/sn², kareler arası hız sıçraması ≤ 0,1 m/sn (kesme hariç); merdivende basamak başına bir adım; varış 16–24 sn",
            hk["ivme"] <= 6 and hk["sicrama"] <= 0.1 and abs(hk["merdivenAdim"] - hk["basamak"]) <= 1.5 and 16 <= hk["toplam"] <= 24, str(hk))
    kl = await pg.evaluate("""() => ({ n: LOCA_GIRIS.kisiler.length, olcek: LOCA_GIRIS.kisiler.map(k => +k.R.root.scale.y.toFixed(2)), en: LOCA_GIRIS.kisiler.map(k => +k.R.root.scale.x.toFixed(2)),
      rakip: LOCA_GIRIS.rakip.root.visible, durum: MAC_PROTOKOL.rakipBaskan })""")
    denetle("Kalabalık loca: önde iki yönetici, arkada beş konuk, hepsi aynı insan ölçeğinde (boy ve en 0,95–1,07); rakip başkan 'yok' durumunda koltuk boş",
            kl["n"] == 7 and all(0.95 <= v <= 1.07 for v in kl["olcek"] + kl["en"]) and not kl["rakip"] and kl["durum"] == "yok", str(kl))
    await pg.wait_for_function("!LOCA_GIRIS.aktif", timeout=90000)
    son = await pg.evaluate("""() => ({ sayfa: ON_EKRAN.sayfa, masa: BK_MASA.visible, d: +camera.position.distanceTo(new THREE.Vector3(BASKAN_KOLTUGU.x, BASKAN_KOLTUGU.y + STIL.kameralar.baskan.goz, BASKAN_KOLTUGU.z)).toFixed(3),
      faz: mac.phase, kar: +document.getElementById('karartma').style.opacity, t: +LOCA_GIRIS.t.toFixed(2) })""")
    denetle("Varış kendiliğinden bitti: başkan koltuğunda (göz yerinde), raf geri geldi, karartma yok; maç günü sürüyor",
            son["sayfa"] is None and son["masa"] and son["d"] < 0.6 and son["faz"] == "isinma" and son["kar"] == 0, str(son))
    await pg.screenshot(path=str(ARAC / "son-akis-14-loca.png"))
    await pg.set_viewport_size({"width": 900, "height": 800})
    await pg.goto((site / "index.html").as_uri() + loca("?ekran=bulten"))
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle")
    tasma = await pg.evaluate("() => { const g = document.querySelector('.prg-kart'); return [g.scrollWidth - g.clientWidth, document.getElementById('onEkran').scrollHeight - document.getElementById('onEkran').clientHeight]; }")
    denetle("Dar pencerede maç öncesi ekranında taşma yok", all(t <= 0 for t in tasma), str(tasma))
    await pg.context.close()
    # N3: TEST “Beklemeden geç”: 10 sn beklemeden geçer; Duraklat'ta kapalı
    pg, hatalar = await sayfa(tarayici, site, "?ekran=bulten&tohum=4", "#onEkran:not([hidden]) #btnBeklemedenGec")
    tum_hatalar += hatalar
    await pg.keyboard.press("KeyP")
    kapali = await pg.evaluate("document.getElementById('btnBeklemedenGec').disabled")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(700)
    once = await pg.evaluate(PROGRAM_JS)
    await pg.click("#btnBeklemedenGec")
    await pg.wait_for_function("!ON_EKRAN.acik", timeout=8000)
    sonra = await pg.evaluate("({ acik: ON_EKRAN.acik, loca: LOCA_GIRIS.aktif, etiket: document.getElementById('btnBeklemedenGec').textContent })")
    denetle("N3: 'Beklemeden geç' (TEST etiketli) 10 sn dolmadan maça geçiriyor (locaya giriş başladı); Duraklat'ta düğme kapalı",
            kapali and once["kapali"] and once["gecen"] < 5 and not sonra["acik"] and sonra["loca"] and "TEST" in sonra["etiket"], f"{once['gecen']:.2f} sn · {sonra}")
    await pg.context.close()
    # N11: atlama: maç görüntüsüne tıklamak varışı bitirir (tık telefonu açmaz); rakip başkan yoksa Santraya geç önce varışı bitirir, sonra atlar
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=yok", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.evaluate("locaGirisBaslat()")
    await pg.wait_for_timeout(600)
    r = await pg.evaluate("document.getElementById('view').getBoundingClientRect().toJSON()")
    await pg.mouse.click(r["x"] + r["width"] / 2, r["y"] + r["height"] * 0.4)
    s = await pg.evaluate("({ aktif: LOCA_GIRIS.aktif, sayfa: ON_EKRAN.sayfa, masa: BK_MASA.visible, tel: typeof MAC_TELEFON !== 'undefined' && MAC_TELEFON.acik, kar: +document.getElementById('karartma').style.opacity })")
    denetle("Varış tıklayınca atlanıyor: başkan oturmuş, raf yerinde, karartma yok, tık telefonu açmadı", not s["aktif"] and s["sayfa"] is None and s["masa"] and not s["tel"] and s["kar"] == 0, str(s))
    await pg.evaluate("locaGirisBaslat()")
    await pg.click("#btnMacaGec")
    s0 = await pg.evaluate("({ aktif: LOCA_GIRIS.aktif, sayfa: ON_EKRAN.sayfa, hizli: SANTRA_HIZLI.aktif || !MAC_ONCESI.includes(mac.phase) })")
    # F3-0 (2026-10-24): Santraya geç maç öncesini görüntüsüz doğal sonuna oynatır (birkaç kare); basılan an maçı değiştirmez
    await pg.wait_for_function("!MAC_ONCESI.includes(mac.phase) && !SANTRA_HIZLI.aktif", timeout=60000)
    s = await pg.evaluate("({ faz: mac.phase, gizli: document.getElementById('btnMacaGec').hidden })")
    denetle("Santraya geç önce varışı bitiriyor, sonra maç öncesini görüntüsüz bitiriyor (F3-0)", not s0["aktif"] and s0["sayfa"] is None and s0["hizli"] and s["gizli"], f"{s0} · {s}")
    await pg.context.close()


async def bolum_14b(tarayici, site, tum_hatalar):
    """N12 (kullanıcı kararı 2026-10-04): rakip başkan yerinde / sonra / yok ve tokalaşmada beş saniyelik karar anı (TEST kaydı: Selam ver / Ses çıkarma).
    H1 (F4, 2026-10-26): karar anı da tek kart (js/ekran-an.js, js/ekran-kart.js kartEtkilesimKur): tek .ka-kart, iki .ka-kenar (cevapların adı);
    ←/→ önizler, Enter önizleneni seçer; tıklama seçmez. R2 eki: kenarlar gizli (cevaplar kaydırınca), 1/2 önizler, Enter seçer.
    İnceleme (2026-10-26): önizleme açıkken süre dolunca yüz nötre döner."""
    AN_JS = """() => ({ acik: KARAR_ANI.acik, t: +KARAR_ANI.t.toFixed(3), kalan: +KARAR_ANI.kalan.toFixed(3), sure: KARAR_ANI.sure, evre: LOCA_GIRIS.evre, mod: LOCA_GIRIS.mod,
      aktif: LOCA_GIRIS.aktif, rakip: LOCA_GIRIS.rk.evre, karar: MAC_PROTOKOL.karar && MAC_PROTOKOL.karar.secim, faz: mac.phase, onizle: KARAR_ANI.onizle,
      n: document.querySelectorAll('#kararAni .ka-kart').length, yuz: (document.querySelector('#kararAni .ka-kart') || { dataset: {} }).dataset.yuz,
      yuzMetin: (document.querySelector('#kararAni .ka-yuz') || {}).textContent || '',
      kart: [...document.querySelectorAll('#kararAni .ka-kenar b')].map(b => b.textContent), kim: (document.querySelector('#kararAni .ka-kim') || {}).textContent,
      gizli: [...document.querySelectorAll('#kararAni .ka-kenarlar')].every(e => e.hidden), gorunen: (document.querySelector('#kararAni .ka-kart') || { innerText: '' }).innerText })"""
    # yerinde: girişi atlamak tokalaşma anına götürür; süre kartlar yerine oturmadan başlamaz; tıklama atlatmaz; duraklatmada süre durur; 5 sn'de cevapsız
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=yerinde", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.evaluate("locaGirisBaslat()")
    await pg.wait_for_timeout(500)
    await pg.keyboard.press("Escape")
    await pg.wait_for_function("KARAR_ANI.acik", timeout=15000)
    a0 = await pg.evaluate(AN_JS)
    denetle("N12 yerinde: atlama tokalaşma anına götürdü; karar anı açık (üstte 'Akdeniz FK Başkanı'; H1: tek kart, nötr yüz, kenarlar Selam ver / Ses çıkarma); süre kart yerine oturmadan başlamıyor",
            a0["acik"] and a0["evre"] == "el" and a0["n"] == 1 and a0["yuz"] == "notr" and a0["kart"] == ["Selam ver", "Ses çıkarma"] and "Akdeniz FK Başkanı" in (a0["kim"] or "")
            and a0["gizli"] and "Selam ver" not in a0["gorunen"] and "Ses çıkarma" not in a0["gorunen"]
            and (a0["kalan"] == a0["sure"] == 5 or a0["t"] >= 0.4), str(a0))
    await pg.wait_for_function("KARAR_ANI.t > 0.9", timeout=15000)
    r = await pg.evaluate("document.getElementById('view').getBoundingClientRect().toJSON()")
    await pg.mouse.click(r["x"] + r["width"] * 0.5, r["y"] + r["height"] * 0.25)
    await pg.keyboard.press("Escape")
    # R2 eki: kenar etiketi yok; ← yalnız önizler (yüz o cevaba döner, karar verilmez); Esc önizlemeyi bırakır
    await pg.keyboard.press("ArrowLeft")
    pk = await pg.evaluate(AN_JS)
    await pg.keyboard.press("Escape")
    pe = await pg.evaluate(AN_JS)
    await pg.keyboard.press("KeyP")
    p1 = await pg.evaluate(AN_JS)
    await pg.wait_for_timeout(1200)
    p2 = await pg.evaluate(AN_JS)
    await pg.keyboard.press("KeyP")
    denetle("Karar anında tıklama ve Esc atlatmıyor; ← yalnız önizliyor ('Selam ver' yüzü, karar yok), Esc önizlemeyi bırakıyor; süre işliyor ve Duraklat'ta donuyor",
            p1["acik"] and p2["acik"] and p1["kalan"] == p2["kalan"] < 5 and p1["evre"] == "el" and pk["onizle"] == "sol" and pk["yuz"] == "sol" and "Selam ver" in pk["yuzMetin"]
            and pk["karar"] is None and pe["onizle"] is None and pe["yuz"] == "notr" and pe["acik"], f"{p1['kalan']} → {p2['kalan']} · {pk['onizle']}/{pk['karar']} · {pe['onizle']}")
    await pg.screenshot(path=str(ARAC / "son-akis-14b-karar.png"))
    # inceleme (2026-10-26): ← ile önizlenirken süre dolarsa sonuç cevapsızdır; önizlenen cevap yüzde ve kenarda kalmaz (kart nötr yüzle söner)
    await pg.keyboard.press("ArrowLeft")
    pc0 = await pg.evaluate(AN_JS)
    # U2: kalan süre 0,3 sn'ye indirilir (başsız yazılım çiziminde kare hızı düşük; 4 sn'lik oyun süresi dizüstünde 30 sn'yi aşıyordu); denetlenen aynı
    await pg.evaluate("() => { KARAR_ANI.sure = Math.min(KARAR_ANI.sure, Math.max(0, KARAR_ANI.t - STIL.an.giris) + 0.3); }")
    await pg.wait_for_function("KARAR_ANI.secim !== null", timeout=30000)
    pc = await pg.evaluate("""() => ({ cevapsiz: KARAR_ANI.secim === KARAR_ANI.kayit.cevapsiz, onizle: KARAR_ANI.onizle,
      yuz: (document.querySelector('#kararAni .ka-kart') || { dataset: {} }).dataset.yuz, basili: document.querySelectorAll('#kararAni .ka-kenar[aria-pressed="true"]').length,
      secildi: !!document.querySelector('#kararAni .ka-kart.ka-secildi'), yuzMetin: (document.querySelector('#kararAni .ka-yuz') || {}).textContent || '' })""")
    denetle("İnceleme (2026-10-26): ← ile 'Selam ver' önizlenirken süre doldu: sonuç cevapsız; yüz nötre döndü, önizlenen cevap yüzde ve kenarda kalmadı, kart amber değil",
            pc0["onizle"] == "sol" and pc0["yuz"] == "sol" and pc0["karar"] is None and pc["cevapsiz"] and pc["onizle"] is None and pc["yuz"] == "notr"
            and pc["basili"] == 0 and not pc["secildi"] and "Selam ver" not in pc["yuzMetin"], f"{pc0['onizle']}/{pc0['yuz']} · {pc}")
    await pg.wait_for_function("MAC_PROTOKOL.karar", timeout=30000)
    c = await pg.evaluate(AN_JS)
    await pg.wait_for_function("!LOCA_GIRIS.aktif", timeout=60000)
    c2 = await pg.evaluate("""() => ({ rakip: LOCA_GIRIS.rk.evre, z: +LOCA_GIRIS.rakip.root.position.z.toFixed(2), koltuk: +(LOCA.on - 0.55).toFixed(2), olcek: +LOCA_GIRIS.rakip.root.scale.x.toFixed(2),
      digerleri: LOCA_GIRIS.kisiler.map(k => k.R.root.scale.x), masa: BK_MASA.visible })""")
    ort = sum(c2["digerleri"]) / len(c2["digerleri"])
    denetle("Süre dolunca cevapsız sonucu işledi (el bırakıldı); tepkiden sonra ikisi de oturdu; rakip başkan diğer loca kişileriyle aynı ölçekte (±%5)",
            c["karar"] == "cevapsiz" and c2["rakip"] == "oturuyor" and c2["z"] == c2["koltuk"] and abs(c2["olcek"] - ort) / ort <= 0.05 and c2["masa"], f"{c['karar']} · {c2}")
    await pg.context.close()
    # yerinde, büyük yazı, klavye: 1 → Selam ver
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=yerinde", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.evaluate("() => { OYUN.ayarlar.yazi = 'buyuk'; locaGirisBaslat(); }")
    await pg.wait_for_timeout(400)
    await pg.keyboard.press("Escape")
    await pg.wait_for_function("KARAR_ANI.acik && KARAR_ANI.t > 0.6", timeout=30000)
    # H1: tek kart ve iki kenarı karede (karar anının içinde), kartta ve kenarlarda yatay taşma yok
    yer = await pg.evaluate("""() => { const E = document.getElementById('kararAni').getBoundingClientRect(), K = [...document.querySelectorAll('#kararAni .ka-kart')],
        P = K.length ? [K[0]] : [];
      return { n: K.length, icinde: P.length === 1 && P.every(k => { const r = k.getBoundingClientRect(); return r.left >= E.left - 1 && r.right <= E.right + 1 && r.bottom <= E.bottom + 1 && r.top >= E.top; }),
        tasma: Math.max(...P.map(k => k.scrollWidth - k.clientWidth)), boy: getComputedStyle(document.getElementById('kararAni')).getPropertyValue('--an-boy') }; }""")
    await pg.screenshot(path=str(ARAC / "son-akis-14b-karar-buyuk.png"))
    # U2: süre uzatılır (ölçüm süresi dolmasın), kart sürüklenirken karenin içinde; seçince damga
    await pg.evaluate("() => { KARAR_ANI.sure = 999; }")
    kap_an = await kart_kap(pg, "#kararAni", kart=".ka-kart")
    await pg.keyboard.press("Digit1")
    on_an = await pg.evaluate(AN_JS)
    await pg.keyboard.press("Enter")
    dmg_an = await pg.evaluate("() => { const d = document.querySelector('#kararAni .ka-kart .kk-damga'); return { damga: d ? d.textContent : null, yuz: (document.querySelector('#kararAni .ka-yuz') || {}).textContent }; }")
    await pg.wait_for_function("MAC_PROTOKOL.karar", timeout=5000)
    k1 = await pg.evaluate(AN_JS)
    denetle("U2: karar anında kart %10/%25/%55/%120 sürüklenirken (iki yöne) karenin içinde, o cevabın yüzü ve hazır; seçince kartta 'SELAM VER' damgası, yüzde büyük yazı yok",
            not kap_disi(kap_an) and kap_yonler(kap_an) and dmg_an["damga"] == "SELAM VER" and "Seçildi: Selam ver" in (dmg_an["yuz"] or ""),
            f"{kap_disi(kap_an) or [(m['oran'], m['yuz'], m['ust'], m['hazir'], m['sol'], m['sag'], m['kap']) for m in kap_an]} · {dmg_an}")
    denetle("Büyük yazıda tek kart karede, taşma yok; R2 eki: 1 tuşu yalnız 'Selam ver'i önizledi (karar yok), Enter seçti (kart kısa süre kalıyor)",
            yer["n"] == 1 and yer["icinde"] and yer["tasma"] <= 1 and "1.8" in yer["boy"] and on_an["onizle"] == "sol" and on_an["karar"] is None
            and "Selam ver" in on_an["yuzMetin"] and k1["karar"] == "selam", f"{yer} · {on_an['onizle']}/{on_an['karar']} · {k1['karar']}")
    await pg.context.close()
    # sonra: başkan oturur; Santraya geç ertelenir, rakip başkan o an kapıdan gelir; → 'Ses çıkarma'yı önizler (tek başına karar vermez), Enter seçer;
    # karar anından sonra atlama yapılır
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=sonra", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.evaluate("locaGirisBaslat()")
    await pg.wait_for_timeout(400)
    await pg.keyboard.press("Escape")
    s0 = await pg.evaluate(AN_JS)
    await pg.click("#btnMacaGec")
    s1 = await pg.evaluate(AN_JS)
    denetle("N12 sonra: atlama başkanı oturttu (rakip başkan henüz yok); Santraya geç ertelendi: rakip başkan kapıdan geliyor, karşılama başladı",
            not s0["aktif"] and s0["rakip"] == "yok" and s1["aktif"] and s1["mod"] == "selam" and s1["rakip"] == "yuruyor" and s1["faz"] == "isinma", f"{s0} · {s1}")
    await pg.wait_for_function("KARAR_ANI.acik && KARAR_ANI.t > 0.5", timeout=90000)
    await pg.keyboard.press("ArrowRight")
    sr = await pg.evaluate(AN_JS)
    # önizleme kayması (CSS geçişi, STIL.kagit.kart.sure 0,2 sn) bitsin: başsız yazılım çiziminde kare hızı düşük, geçiş duvar saatinde ~0,5–0,8 sn sürer
    KAYMA_JS = "() => { const c = document.querySelector('#kararAni .ka-kart'); return c ? new DOMMatrixReadOnly(getComputedStyle(c).transform).m41 : 0; }"
    try:
        await pg.wait_for_function(f"({KAYMA_JS})() > 5", timeout=5000)
    except Exception:
        pass
    sr["kayma"] = await pg.evaluate(KAYMA_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-14b-sonra.png"))
    await pg.keyboard.press("Enter")
    await pg.wait_for_function("!LOCA_GIRIS.aktif", timeout=60000)
    # F3-0: ertelenen Santraya geç maç öncesini görüntüsüz bitirir (birkaç kare); hiç tetiklenmezse bekleme zaman aşımına düşer
    await pg.wait_for_function("!MAC_ONCESI.includes(mac.phase) && !SANTRA_HIZLI.aktif", timeout=60000)
    s2 = await pg.evaluate(AN_JS)
    denetle("→ tek başına karar vermedi ('Ses çıkarma' yüzü önizlendi, kart sağa kaydı, MAC_PROTOKOL.karar boş); → + Enter 'Ses çıkarma'yı seçti; karşılama bitince ertelenen atlama yapıldı (maç öncesi geçti)",
            sr["acik"] and sr["onizle"] == "sag" and sr["yuz"] == "sag" and "Ses çıkarma" in sr["yuzMetin"] and sr["karar"] is None and sr["kayma"] > 5
            and s2["karar"] == "sus" and s2["faz"] != "isinma", f"{sr['onizle']}/{sr['karar']} · kayma {sr['kayma']:.1f} px · {s2['karar']} · {s2['faz']}")
    await pg.context.close()
    # yok: karar anı açılmaz, koltuk boş
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=yok", "#btnMacaGec")
    tum_hatalar += hatalar
    # (varış mantığı sayfa içinde hızlı ilerletilir: çizim beklenmez; karar anı hiç açılmamalı)
    y = await pg.evaluate("() => { duraklatmaEkle('elle'); locaGirisBaslat(); let acildi = false; for (let i = 0; i < 4000 && LOCA_GIRIS.aktif; i++) { locaGirisKare(1 / 30); acildi = acildi || KARAR_ANI.acik; } duraklatmaKaldir('elle'); return acildi; }")
    y = dict(await pg.evaluate(AN_JS), acildi=y)
    denetle("N12 yok: varış boyunca karar anı açılmadı, varış bitti, rakip başkanın koltuğu boş", not y["acildi"] and not y["aktif"] and y["karar"] is None and y["rakip"] == "yok", str(y))
    await pg.context.close()
    # H2-a: "Maçı bitir" perdesi ve karar anı (TEST adresi; kariyerde rakip başkan yok). Maç öncesinde basılınca karar anı yine açılır, perdenin örtüsü
    # onun altında kalmaz (gizli); cevaplanınca örtü görünür, maç perdenin arkasında sonuna varır (kariyersiz adreste kart yok: perde sonra kalkar)
    ORTU_JS = "() => ({ ortu: !document.getElementById('macHesap').hidden, perde: HIZLI_BITIR.perde, karar: KARAR_ANI.acik, faz: mac.phase, kapali: MAC_IZLEME.kapali })"
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=yerinde", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.evaluate("locaGirisBaslat()")
    await pg.wait_for_timeout(400)
    await pg.click("#btnHizliBitir")
    await pg.wait_for_function("KARAR_ANI.acik && KARAR_ANI.t > 0.5", timeout=60000)
    h0 = await pg.evaluate(ORTU_JS)
    await pg.keyboard.press("Digit1")
    await pg.keyboard.press("Enter")   # R2 eki: 1 önizler, Enter seçer
    await pg.wait_for_function("!KARAR_ANI.acik && !document.getElementById('macHesap').hidden", timeout=60000)
    h1 = await pg.evaluate(ORTU_JS)
    await pg.wait_for_function("mac.phase === 'fulltime'", timeout=240000)
    h2 = dict(await pg.evaluate(ORTU_JS), karar=await pg.evaluate("MAC_PROTOKOL.karar && MAC_PROTOKOL.karar.secim"))
    denetle("H2-a: maç öncesinde Maçı bitir: karar anı açık ve 'Maç hesaplanıyor' örtüsü gizli (perde açık, ikiz bırakıldı); cevaplanınca örtü görünür; maç perdenin arkasında sonuna vardı, perde kalktı",
            h0["karar"] and not h0["ortu"] and h0["perde"] and h0["kapali"] and h1["ortu"] and h1["perde"] and h2["faz"] == "fulltime" and not h2["perde"] and not h2["ortu"] and h2["karar"] == "selam",
            f"{h0} · {h1} · {h2}")
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
    # N8: çevre her cephe ayrı; kulüp binası yalnız maç kurulumunda; tribün girişleri ve çevre kapıları tarifle tutarlı
    cevre = await pg.evaluate("""() => { const W = scene.userData.duvar, D = [W.bati, W.dogu], Z = [W.kuzey, W.guney];
      const icinde = p => p[0] > D[0] && p[0] < D[1] && p[2] < Z[0] && p[2] > Z[1];
      return { mac: (scene.userData.cevre || []).join(','), balkon: (BALKON.stat.userData.cevre || []).join(','), kapi: KAPILAR.length, tarif: STAT.kapilar.length,
        duvarda: KAPILAR.every(k => D.includes(k.kapi[0]) || Z.includes(k.kapi[1])), icerde: KAPILAR.every(k => icinde(k.giris)),
        tribun: KAPILAR.map(k => k.tribun).join(',') }; }""")
    denetle("N8: maçta dört cephe (yamaç, evler, kapı, kulüp binası), balkon ve pencerede kulüp binası yok; her tribün girişinin karşısında çevre duvarında kapı, giriş duvarın içinde",
            cevre["mac"] == "yamac,evler,kapi,kulupBinasi" and cevre["balkon"] == "yamac,evler,kapi" and cevre["kapi"] == cevre["tarif"] == 6 and cevre["duvarda"] and cevre["icerde"], str(cevre))
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
            uzerinde[0] == "kapi" and uzerinde[1] and "Balkona" in uzerinde[2] and y1["yer"] == "yolda" and 6.5 < y1["toplam"] < 9.5, f"{uzerinde} · {y1}")
    # RN-b: evreler örtüşen pencereler (ODA.yol.an): ayakta yürüyüş kalkışın bitişinden oturmanın başına dek
    ornek, A = [], await pg.evaluate("(() => { const a = ODA.yol.an; return { bas: a.kalk[1], son: a.otur[0], al: a.al[1] }; })()")
    for _ in range(160):
        o = await pg.evaluate("ODA.yol ? [+ODA.yol.t.toFixed(2), +ODA.kamera.position.y.toFixed(3), +ODA.kamera.position.z.toFixed(2), +ODA.kamera.position.x.toFixed(4), ODA.el.g.visible, ODA.nesneler.telefon.g.visible] : null")
        if o is None:
            break
        ornek.append(o)
        await pg.wait_for_timeout(120)
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    ayakta = [o[1] for o in ornek if A["bas"] + 0.3 < o[0] < A["son"] - 0.3]
    denetle("Doğal yürüyüş: göz oturuştan ayakta yüksekliğe kalkıyor, adımda küçük iniş-çıkış var, balkonda oturuşa (1,30 m) iniyor; durum değişmedi",
            len(ayakta) > 3 and min(ayakta) > 1.58 and 0.002 < max(ayakta) - min(ayakta) < 0.04 and min(o[1] for o in ornek[:3]) < 1.55 and abs(await pg.evaluate("ODA.kamera.position.y") - 1.3) < 0.01 and await durum(pg) == d0,
            f"{len(ornek)} örnek · ayakta {min(ayakta) if ayakta else '-'}–{max(ayakta) if ayakta else '-'}")
    # N6: el ve telefon: başta el telefonu alır, yürürken telefon cepte (görünmez), varınca masaya konur
    yolda = [o for o in ornek if A["bas"] < o[0] < A["son"]]
    son = await pg.evaluate("({ el: ODA.el.g.visible, tel: ODA.nesneler.telefon.g.visible })")
    denetle("N6: yürüyüş telefonu almakla başlıyor (el görünür); yürürken el ve telefon görünmüyor; varışta telefon masada, el çekilmiş",
            any(o[4] for o in ornek if o[0] < A["al"]) and yolda and not any(o[4] or o[5] for o in yolda) and son == {"el": False, "tel": True}, f"{son}")
    # N6: hareket ölçüsü (saf hesap; 1/60 sn'lik adımlarla): ani sıçrama yok, kalkış ve oturma insan süresinde, adım sayısı yola uygun
    hk = await pg.evaluate("""() => { const R = {}; for (const hedef of ['balkon', 'masa']) { const Y = odaYolKur(hedef), P = new THREE.Vector3(), B = new THREE.Vector3(), K = [], Y2 = [];
      for (let t = 0; t <= Y.toplam; t += 1 / 60) { Y.t = t; odaYolAni(Y, P, B); K.push([P.x, P.y, P.z]); const dx = B.x - P.x, dy = B.y - P.y, dz = B.z - P.z; Y2.push([t, Math.atan2(dx, -dz), Math.atan2(dy, Math.hypot(dx, dz)), Y.aci]); }
      const V = [], H = []; for (let i = 1; i < K.length; i++) { const v = [0, 1, 2].map(j => (K[i][j] - K[i - 1][j]) * 60); V.push(v); H.push(Math.hypot(...v)); }
      let ivme = 0, sicrama = 0; for (let i = 1; i < V.length; i++) { ivme = Math.max(ivme, Math.hypot(...[0, 1, 2].map(j => (V[i][j] - V[i - 1][j]) * 60))); sicrama = Math.max(sicrama, Math.abs(H[i] - H[i - 1])); }
      let aciHiz = 0; for (let i = 1; i < Y2.length; i++) { const ds = Math.atan2(Math.sin(Y2[i][1] - Y2[i - 1][1]), Math.cos(Y2[i][1] - Y2[i - 1][1]));
        aciHiz = Math.max(aciHiz, Math.hypot(ds * Math.cos(Y2[i][2]), Y2[i][2] - Y2[i - 1][2]) * 60 * 180 / Math.PI); }
      const yuru = Y2.filter(r => r[0] >= Y.an.kalk[1] && r[0] <= Y.an.otur[0]);
      R[hedef] = { ivme: +ivme.toFixed(2), sicrama: +sicrama.toFixed(3), adim: +Y.FZ[Y.FZ.length - 1].toFixed(1), kalk: Y.E.kalk, otur: Y.E.otur, toplam: +Y.toplam.toFixed(2),
        aciHiz: +aciHiz.toFixed(1), egim: +(Math.min(...yuru.map(r => r[2])) * 180 / Math.PI).toFixed(1), aci: +(Math.max(...yuru.map(r => r[3])) - Math.min(...yuru.map(r => r[3]))).toFixed(3) }; }
      return R; }""")
    denetle("N6, RN-b: insan gibi hareket: gözün ivmesi ≤ 6 m/sn², kareler arası hız sıçraması ≤ 0,1 m/sn; kalkış ≥ 1 sn, oturma ≥ 1,2 sn; 8–12 adım; toplam 6,5–9,5 sn "
            "(eskiden 12,3); bakışın açısal hızı ≤ 150°/sn; yürürken bakış yere değil (eğim ≥ −15°) ve görüş açısı sabit",
            all(h["ivme"] <= 6 and h["sicrama"] <= 0.1 and h["kalk"] >= 1.0 and h["otur"] >= 1.2 and 8 <= h["adim"] <= 12 and 6.5 <= h["toplam"] <= 9.5
                and h["aciHiz"] <= 150 and h["egim"] >= -15 and h["aci"] <= 0.01 for h in hk.values()), str(hk))
    b1 = await pg.evaluate("ODA.kamera.position.toArray().map(v => +v.toFixed(5)).join(',')")
    await pg.wait_for_timeout(1500)
    b2 = await pg.evaluate("ODA.kamera.position.toArray().map(v => +v.toFixed(5)).join(',')")
    denetle("Sakin kamera: balkonda otururken kamera salınmıyor (1,5 sn sonra aynı yer)", b1 == b2, f"{b1} → {b2}")
    await pg.screenshot(path=str(ARAC / "son-akis-15-balkon.png"))
    # 2.8R, N6: başkanın balkon masasına koyduğu telefon görüşte, alt şeridin üstünde; tıklayınca telefon açılıyor
    tb = await pg.evaluate("""() => { const v = ODA.nesneler.telefon.merkez.clone().project(ODA.kamera), r = document.getElementById('oda').getBoundingClientRect(),
      alt = document.querySelector('.od-alt').getBoundingClientRect(); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height, nx: v.x, ny: v.y, alt: alt.top }; }""")
    await pg.mouse.move(tb["x"], tb["y"])
    await pg.mouse.click(tb["x"], tb["y"])
    denetle("Balkonda telefon görünür (alt şeridin üstünde) ve tıklanınca açılıyor", -0.95 < tb["nx"] < 0.95 and tb["y"] < tb["alt"] - 4
            and await pg.query_selector(".od-telefonPanel") is not None, str(tb))
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'masa'", timeout=YURUYUS_BEKLE)
    denetle("5 tuşu odaya döndürüyor (klavye erişimi sürüyor)", await pg.evaluate("ODA.yer") == "masa")
    oda = await pg.evaluate("""() => ({ koltuk: !!ODA.koltuk && Math.abs(ODA.koltuk.position.z - OD.baskanKoltugu.z) < 1e-6,
      arka: ODA.sahne.children.some(m => m.geometry && m.geometry.parameters && m.geometry.parameters.width === OD.pano.en) })""")
    denetle("2.8R: arka duvarda kulüp panosu; masaya dönünce başkan koltuğu yerine çekildi", oda["koltuk"] and oda["arka"], str(oda))
    await pg.wait_for_timeout(400)
    await pg.screenshot(path=str(ARAC / "son-akis-15-pencere.png"))
    await pg.context.close()


YON_JS = """() => ({ y: +KAM.a.y.toFixed(5), p: +KAM.a.p.toFixed(5), mod: KAM.mod, fov: +camera.fov.toFixed(3) })"""
# koltuktaki loca bakışının görüş açısı (dikey, derece) sayfadan, STIL.kameralar.baskan.aci'den okunur: Z1'de 32°, K1'de (kullanıcı kararı
# 2026-10-20, 10. maç notu) 36°; açı yeniden değişirse (ör. 40°) yalnız STIL değişir, §15b ve §17 kendiliğinden izler


def loca_aci_olcek(aci, olcek_aci):
    """K1: STIL'deki pencere, nişan bütçesi ve eğim olcekAci'de derecedir; js/kamera.js kamAciOlcek ekrandaki oranları korumak için çarpar."""
    return math.tan(math.radians(aci / 2)) / math.tan(math.radians((olcek_aci or aci) / 2))
# topun ekrandaki yeri (-1…1)
TOP_JS = """() => { kameraUygula(curView()); camera.updateMatrixWorld(); const b = mac.ball, v = new THREE.Vector3(b.x, b.y + TOP_R, b.z - MOTOR_Z).project(camera);
  return { x: +v.x.toFixed(3), y: +v.y.toFixed(3) }; }"""
# zemin noktası: {x, y} imleçteki ekran noktasının zemindeki karşılığı; {nokta: {x, z}} zemin noktasının ekrandaki yeri (sayfa pikseli)
ZEMIN_JS = """(o) => { kameraUygula(curView()); camera.updateMatrixWorld(); const r = document.getElementById('view').getBoundingClientRect();
  if (o.nokta) { const v = new THREE.Vector3(o.nokta.x, 0, o.nokta.z).project(camera); return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; }
  const R = new THREE.Raycaster(); R.setFromCamera({ x: (o.x - r.left) / r.width * 2 - 1, y: -((o.y - r.top) / r.height * 2 - 1) }, camera);
  const t = -R.ray.origin.y / R.ray.direction.y; return { x: R.ray.origin.x + R.ray.direction.x * t, z: R.ray.origin.z + R.ray.direction.z * t }; }"""


async def surukle(pg, x0, y0, x1, y1, adim=12):
    await pg.mouse.move(x0, y0)
    await pg.mouse.down()
    await pg.mouse.move(x1, y1, steps=adim)
    await pg.mouse.up()


async def bolum_15b(tarayici, site, tum_hatalar):
    """Maçta başkanın locası ve bakış (2.8O; N4, kullanıcı kararı 2026-10-04): loca geometrisi, geniş bakışta kulübeler ve tabela; bakış hep topu
    izler (elle bakış, Topu izle düğmesi ve F tuşu yok; sürükleme ve ok tuşları başı çevirmez). Dürbün 2026-10-07'de kaldırıldı (§17 denetler)."""
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&stat=sehir&tohum=5", "#btnMacaGec")
    tum_hatalar += hatalar
    # N9: seyirci kapıdan girer: 0,25 sn'de bir her kişi ya bir önceki örnekten en çok 0,6 m uzakta ya da kapıda / giriş ağzında beliriyor;
    # yürüyen yerine varınca aynı yerde oturuyor; çıkışa kadar doluluk eskisiyle aynı; çıkıştan sonra geç gelenler maç zamanıyla yürüyor
    n9 = await pg.evaluate(SEYIRCI_JS)
    denetle("N9: seyirci kapıdan girip yerine yürüyor: kimse yerinde belirmiyor (her belirme kapıda ya da giriş ağzında), yolda sıçrama yok, her yürüyen yerine kesintisiz varıyor; havuz taşmıyor; doluluk eğrisi aynı; çıkıştan sonra geç gelenler yürüyor",
            n9["yuruyen"] > 300 and n9["belirme"] == n9["kapida"] and not n9["kotu"] and n9["varis"] == n9["yuruyen"] and n9["enCok"] <= n9["havuz"]
            and n9["egri"] and n9["gec"] > 0 and n9["saat"] == [270.0, 322.0], str({k: v for k, v in n9.items() if k != "kotu"}) + str(n9["kotu"][:3]))
    k = await pg.evaluate("""() => { const t = STAT.tribunler.find(x => x.yer === 'ana'), O = tribunOlcu(t), arka = STAT_OLCU.arka.ana + 0.6;
      return { y: +BASKAN_KOLTUGU.y.toFixed(2), beklenen: +(locaZemini(t) + KOLTUK_YUKSEKLIGI * 1.14).toFixed(2), balkon: +(tribunTepe('ana') + 1.8).toFixed(2),
        z: +BASKAN_KOLTUGU.z.toFixed(2), arka: -arka, goz: +(BASKAN_KOLTUGU.y + STIL.kameralar.baskan.goz).toFixed(2), ad: STAT.ad }; }""")
    denetle("Maçta başkan binadaki locada: balkonun bir kat üstünde, ana tribünün arkasında; göz 12–15 m yüksekte; konum tarifin geometrisinden",
            k["y"] == k["beklenen"] and k["y"] > k["balkon"] + 1.5 and k["z"] < k["arka"] - 3 and 12 <= k["goz"] <= 15 and k["ad"] == "Demirkapı İlçe Stadı", str(k))
    await pg.click("#btnMacaGec")
    await pg.wait_for_function("mac.phase === 'play' && mac.phaseT > 3", timeout=60000)
    # N4: bakış hep topu izler; düğme, F tuşu ve elle bakış yok
    yapi = await pg.evaluate("""({ dugme: !!document.getElementById('btnTopIzle'), elle: typeof kamElleDondur !== 'undefined' || typeof kameraTakipAyarla !== 'undefined',
      sinif: document.getElementById('view').classList.contains('kam-elle') })""")
    r = await pg.evaluate("(() => { const r = document.getElementById('view').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()")
    cx, cy = r["x"] + r["w"] * 0.5, r["y"] + r["h"] * 0.4
    # oyun sürerken sürükleme: takip bozulmaz, top ekranın ortasına yakın kalır
    await surukle(pg, cx, cy, cx + 160, cy + 50, 10)
    ornek = []
    for _ in range(8):
        ornek.append(await pg.evaluate(TOP_JS))
        await pg.wait_for_timeout(300)
    y0 = await pg.evaluate(YON_JS)
    A = await pg.evaluate("STIL.kameralar.baskan")
    ortada = sum(1 for o in ornek if abs(o["x"]) <= 0.6 and -0.5 <= o["y"] <= 0.5)
    denetle("N4/Z1: bakış topu pencerede izliyor: Topu izle düğmesi ve elle bakış kodu yok; fareyle sürükledikten sonra da top pencere bandında (|x| ≤ 0,6), görüş açısı sabit (STIL aci)",
            not yapi["dugme"] and not yapi["elle"] and not yapi["sinif"] and (ortada >= 5 or y0["mod"] == "sahne") and abs(y0["fov"] - A["aci"]) <= 0.5, f"{yapi} · {y0} · ortada {ortada}/8")
    # duraklatılmışken bakış sabittir: sürükleme, ok tuşları ve F başı çevirmez
    await pg.keyboard.press("KeyP")
    d0 = await pg.evaluate(YON_JS)
    await surukle(pg, cx, cy, cx - 150, cy - 40, 8)
    await pg.keyboard.down("ArrowLeft")
    await pg.wait_for_timeout(400)
    await pg.keyboard.up("ArrowLeft")
    await pg.keyboard.press("KeyF")
    d1 = await pg.evaluate(YON_JS)
    denetle("N4: fareyle sürükleme, ok tuşları ve F başı çevirmiyor (duraklatılmışken bakış aynı)", d0 == d1, f"{d0} → {d1}")
    # 52°'lik geniş bakış (geometri: loca ile kulübe ve tabelanın yeri): orta sahaya zorla, kulübe ve tabela
    await pg.evaluate("""() => { const K = STIL.kameralar.baskan, g = kameraGoz(); KAMERA_ZORLA = { hedef: { x: 0, y: 1 - Math.hypot(g[0], g[2]) * K.sahneEgim, z: 0 }, fov: 52 };
      kameraUygula(curView()); camera.updateMatrixWorld(); }""")
    await pg.wait_for_timeout(300)
    t = await pg.evaluate(TABELA_JS)
    # K1i (2026-10-20): N5 rafı ekranı kenardan kenara kestiğinden kapı kulübenin ortasının rafın üst kenarının (y −0,62) üstünde kalmasıydı.
    # Raf yerine ekranın alt ortasında küçük masa var: kulübenin önünden 5 × 3 nokta ekrana izdüşürülür, her nokta ön plan kamerasından
    # (BASKAN.kamera) ışınla masaya ve ellere karşı sınanır (görünmez tıklama kutusu sayılmaz); hiçbiri masanın ya da ellerin arkasında kalmaz
    kul = await pg.evaluate("""() => { BASKAN.sahne.updateMatrixWorld(true); BASKAN.kamera.updateMatrixWorld(true);
      const R = new THREE.Raycaster(), on = [], gor = o => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
      BK_MASA.traverse(o => { if (o.isMesh) on.push(o); }); for (const el of ['sol', 'sag']) BK_EL[el].g.traverse(o => { if (o.isMesh) on.push(o); });
      return KULUBELER.map(k => { const v = new THREE.Vector3(k.x, 1, k.z).project(camera); let ortulu = 0, n = 0;
        for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const p = new THREE.Vector3(k.x - 3.25 + i * 1.625, 0.05 + j, k.z).project(camera); n++;
          R.setFromCamera({ x: p.x, y: p.y }, BASKAN.kamera); if (R.intersectObjects(on, false).some(h => gor(h.object))) ortulu++; }
        return [+v.x.toFixed(2), +v.y.toFixed(2), ortulu, n]; }); }""")
    denetle("Locadan 52°'lik geniş bakışla orta sahaya bakarken iki yedek kulübesi de görüş alanında ve başkanın masasının ve ellerinin arkasında kalmıyor (K1i: kulübenin önündeki 15 noktanın hiçbiri örtülmüyor)",
            len(kul) == 2 and all(abs(x) < 0.97 and -0.97 < y < 0.9 and ortulu == 0 for x, y, ortulu, n in kul), str(kul))
    denetle("Tek tabela 52°'lik geniş bakışla orta sahaya bakarken ekranın içinde, okunacak büyüklükte (640 satır karşılığı ≥ 60 piksel en)",
            abs(t["x"]) < 0.95 and abs(t["y"]) < 0.95 and t["en"] >= 60 and t["boy"] >= 25, str(t))
    # bakış topa odaklı ve yakın: bakış oturtulur; duraklatılmışken top yerleştirilir, bakış elle ilerletilir
    odak = await pg.evaluate("""() => { KAMERA_ZORLA = null; kameraOturt(); const b = mac.ball, eski = { x: b.x, y: b.y, z: b.z, vx: b.vx, vy: b.vy, vz: b.vz, sahip: b.sahip, tasiyan: b.tasiyan };
      const v = new THREE.Vector3(), K = STIL.kameralar, olc = () => { kameraUygula(curView()); camera.updateMatrixWorld(); v.set(b.x, b.y + TOP_R, b.z - MOTOR_Z).project(camera);
        return { x: +v.x.toFixed(3), y: +v.y.toFixed(3), fov: +camera.fov.toFixed(2) }; };
      const top = [];
      for (const [x, z] of [[30, 52], [-38, 12], [5, 62], [-15, 30]]) { Object.assign(b, { x, z, y: 0, vx: 0, vy: 0, vz: 0, sahip: null, tasiyan: null }); for (let i = 0; i < 240; i++) kameraAdim(1 / 60); top.push(olc()); }
      Object.assign(b, eski); return { faz: mac.phase, top, aci: K.baskan.aci, olcekAci: K.baskan.olcekAci || null, pencere: K.baskan.pencere, butce: K.baskan.top.butce, oran: camera.aspect }; }""")
    # Z1 borcu (2026-10-19 gece, masaüstü): son üçte birde nişan kale ağzına kayar (kamTopNisani; en çok butce derece) — top pencerenin kenarından
    # bütçe kadar dışarıda kalabilir; sınır pencere + bütçe (ekran x'i perspektifle), 45°'lik ani sıçramada yayın oturması için 4 sn.
    # K1 (2026-10-20): pencere ve bütçe açıyla ölçeklenir (loca_aci_olcek), sınır ekranda 32°'dekiyle aynı kalır
    _s = loca_aci_olcek(odak["aci"], odak["olcekAci"])
    _yx = math.tan(math.radians(odak["aci"] / 2)) * odak["oran"]
    sx = math.tan(math.radians((odak["pencere"][0] + odak["butce"][0]) * _s)) / _yx + 0.03
    sy = math.tan(math.radians((odak["pencere"][1] + odak["butce"][1]) * _s)) / math.tan(math.radians(odak["aci"] / 2)) + 0.03
    denetle(f"Z1/K1: bakış topu pencerede: duraklatılmışken dört yere konan topa bakış yavaşça döndü; top pencerenin içinde ya da kenarında, nişanın kale ağzı payı dahil (|x| ≤ {sx:.2f}, |y| ≤ {sy:.2f}), görüş açısı sabit {odak['aci']}° (STIL)",
            odak["faz"] == "play" and odak["aci"] > 0 and all(abs(o["x"]) <= sx and abs(o["y"]) <= sy and abs(o["fov"] - odak["aci"]) <= 0.01 for o in odak["top"]), str(odak["top"]))
    await pg.screenshot(path=str(ARAC / "son-akis-15-mac.png"))
    await pg.context.close()


async def bolum_16(tarayici, site, tum_hatalar):
    """Maç telefonu (2.8F, 2.8I)."""
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&hiz=8&tohum=5", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.click("#btnMacaGec")
    # F3-0: maç öncesi görüntüsüz biter. H2-b (2026-10-26): sınır 60 → 240 sn — dizüstünde (yazılım WebGL) görüntüsüz maç öncesi 60 sn'ye sığmıyor
    # (main'de de aynı yerde düşüyordu); bu bir bekleme sınırıdır, hız ölçümü değil
    await pg.wait_for_function("!MAC_ONCESI.includes(mac.phase) && !SANTRA_HIZLI.aktif", timeout=240000)
    await pg.wait_for_timeout(4000)
    sk = await pg.evaluate("""({ yazi: TABELA.yazi, sn: mac.gameSec, d: (k => k && [k.ev.x, k.ev.z])(mac.kenarBul('dorduncu')),
      foto: mac.kenar.filter(p => p.kind === 'foto').length, telBak: typeof telefonYaz === 'undefined' && !('telefon' in BK_EYLEM) })""")
    m = re.fullmatch(r"(\d\d):(\d\d)", sk["yazi"] or "")
    denetle("Tabela canlı dakika:saniye (ör. 17:33; maç saatiyle aynı, hızlı oynatmada en çok saniyede 10 kez yazılır); 4. hakem iki kulübenin ortasında; takım başına bir fotoğrafçı; başkan kendiliğinden telefona bakmaz",
            bool(m) and abs(int(m.group(1)) * 60 + int(m.group(2)) - sk["sn"]) <= 10 and sk["d"] and sk["d"][0] == 0 and sk["foto"] == 2 and sk["telBak"], str(sk))
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
    mu = await pg.evaluate("() => ({ ust: document.querySelector('#macTelefon .mt-ust').textContent, cubuk: document.querySelector('#macTelefon .tel-durum b').textContent })")
    mu["etiket"] = await pg.is_visible("#duraklatildi")
    denetle("U2: maç telefonunun üstünde yalnız 'Kapat ×' ('Telefon' başlığı yok); durum çubuğu 'Durdu · dk'; telefon tek nedenken 'Duraklatıldı' etiketi görünmüyor",
            mu["ust"] == "Kapat ×" and mu["cubuk"].startswith("Durdu · ") and mu["cubuk"].endswith("'") and not mu["etiket"], str(mu))
    # N14 (kullanıcı kararı 2026-10-18): maçta da ana ekranda Canlı Skor kartı yok; skor yalnız uygulamasından açılır
    denetle("N14: maç telefonunun ana ekranında Canlı Skor kartı yok; iki uygulama altta",
            await pg.query_selector('#macTelefon .tel-bildirim[data-uyg="skor"]') is None
            and await pg.eval_on_selector_all("#macTelefon .tel-sabit .tel-uyg", "L => L.map(b => b.dataset.uyg).join(',')") == "mesajlar,skor")
    await pg.click('#macTelefon [data-eylem="telUyg"][data-uyg="skor"]')
    yazi = await pg.text_content("#macTelefon")
    ist = await pg.evaluate("({ dk: mac.minuteLabel(), skor: mac.score })")
    sk = await pg.evaluate(TEK_SATIR_JS, "#macTelefon")
    dokunur = await pg.evaluate("() => document.querySelectorAll('#macTelefon [data-eylem=csAc]').length")
    denetle("Canlı Skor (kariyersiz TEST maçı): kendi maçın skoru ve dakikası tek satırda (N2); R3: satırlar dokunulmaz (maç sayfası kariyerden okunur; canlı sayfa §19, §20); 'veri bağlı değil' ve xG yazısı yok",
            f"{ist['skor'][0]} – {ist['skor'][1]}" in yazi and ist["dk"] in yazi and "bağlı değil" not in yazi and "xG" not in yazi and dokunur == 0
            and sk and sk["satir"] <= 2.8 and sk["yayilim"] <= 4 and sk["tasma"] <= 0, f"{sk} · dokunur {dokunur}")
    await pg.wait_for_timeout(300)  # N7: telefonun açılış geçişi (0,18 sn) bitsin
    await pg.screenshot(path=str(ARAC / "son-akis-16-canli-skor.png"))
    await pg.click('#macTelefon [data-eylem="telEv"]')
    await pg.click('#macTelefon [data-eylem="telUyg"][data-uyg="mesajlar"]')
    mg = await pg.text_content("#macTelefon .tel-govde")
    denetle("N14: Mesajlar: kariyer olmadan boş liste, boş durum yazısı yok", await pg.query_selector("#macTelefon .tel-kisi") is None
            and await pg.query_selector("#macTelefon .tel-govde .tel-bos") is None and "Mesaj yok" not in mg and "sessiz" not in mg, mg[:80])
    await pg.wait_for_timeout(300)  # N7: telefonun açılış geçişi (0,18 sn) bitsin
    await pg.screenshot(path=str(ARAC / "son-akis-16-telefon.png"))
    # U2 (N7'nin yerine): Esc bir adım geri — Mesajlar'dan ana ekrana döner (maç yine durur), ana ekranda telefonu kapatır
    await pg.keyboard.press("Escape")
    e1 = await pg.evaluate("({ acik: MAC_TELEFON.acik, ekran: MAC_TELEFON.T.ekran, nedenler: [...SUNUM.nedenler].join(','), sn: mac.gameSec, cihaz: !!document.querySelector('#macTelefon .tel .tel-ada') && !!document.querySelector('#macTelefon .tel-saat') })")
    denetle("N7: maç telefonu aynı cihaz düzeninde (kamera adası, ana ekran saati); Esc önce ana ekrana döndü, telefon açık, maç durmuş",
            e1["acik"] and e1["ekran"] == "ana" and e1["nedenler"] == "telefon" and e1["sn"] == b["sn"] and e1["cihaz"], str(e1))
    await pg.keyboard.press("Escape")
    await pg.wait_for_timeout(800)
    c = await pg.evaluate("({ acik: MAC_TELEFON.acik, nedenler: [...SUNUM.nedenler].join(','), sn: mac.gameSec })")
    denetle("Ana ekranda Esc telefonu kapattı; tek neden olduğu için maç aynı andan sürdü", not c["acik"] and c["nedenler"] == "" and c["sn"] > b["sn"], str(c))
    await pg.keyboard.press("KeyP")
    await pg.keyboard.press("KeyT")
    t1 = await pg.evaluate("[...SUNUM.nedenler].sort().join(',')")
    etiket_elle = await pg.is_visible("#duraklatildi")
    await pg.keyboard.press("KeyT")
    s1 = await pg.evaluate("mac.gameSec")
    await pg.wait_for_timeout(1000)
    d = await pg.evaluate("({ nedenler: [...SUNUM.nedenler].join(','), sn: mac.gameSec, dugme: document.getElementById('btnDuraklat').textContent })")
    denetle("Elle duraklatma sürerken T ile telefon aç/kapat: telefon kapanınca yalnız kendi nedeni kalktı, maç duraklatılmış kaldı",
            t1 == "elle,telefon" and d["nedenler"] == "elle" and d["sn"] == s1 and d["dugme"] == "Devam" and etiket_elle, f"{t1} · {d} · etiket {etiket_elle}")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_timeout(600)
    denetle("Devam: maç sürüyor", await pg.evaluate("mac.gameSec") > s1)
    await pg.context.close()


ORNEK_JS = """(o) => {
  /* duraklatılmışken maçı elle ilerletir (kare döngüsü dt 0 verir); her 0,25 sn bakışı yerleştirip topu ve oyuncuları ekrana izdüşürür */
  let g = 0; while (!(mac.phase === 'play' && mac.phaseT > 1) && g < 3600) { macKare(1 / 60); g++; }
  /* U1: etkin hız seçimden hesaplanır (izlemeHizi); sabit hız için seçim yazılır, önemli anda yavaşlama kapatılır */
  const oto0 = MAC_HIZ.oto; MAC_HIZ.oto = false; MAC_HIZ.secim = o.hiz; MAC_HIZ.deger = o.hiz;
  const v = new THREE.Vector3(), R = [], f2 = x => +x.toFixed(3);
  for (let i = 1; i <= o.sure * 60; i++) { macKare(1 / 60); if (i % 15) continue;
    kameraUygula(curView()); camera.updateMatrixWorld(); okunurlukKare(); const b = mac.ball; v.set(b.x, b.y + TOP_R, b.z - MOTOR_Z).project(camera);
    const d = camera.position.distanceTo(topMesh.position), px = 2 * TOP_R * topMesh.scale.x * 240 / (d * Math.tan(camera.fov * Math.PI / 360));
    const boy = [];
    for (const a of AKTORLER) { const p = a.kaynak; if (!p || p.tur !== 'oyuncu' || !p.oyunda) continue; const ay = new THREE.Vector3(a.x, 0, a.z).project(camera), bas = new THREE.Vector3(a.x, 1.8 * (p.boy || 1), a.z).project(camera);
      if (Math.abs(ay.x) <= 1 && Math.abs(ay.y) <= 1) boy.push(Math.abs(bas.y - ay.y) * 240); }
    boy.sort((a, b) => a - b);
    const G = kameraGovdeHedefi(KAM.a.y, KAM.a.p, null);
    R.push({ faz: mac.phase, x: f2(v.x), y: f2(v.y), px: +px.toFixed(2), boy: boy.length ? boy[boy.length >> 1] : null, fov: camera.fov, masa: Math.max(Math.abs(G.p), Math.abs(G.y)) }); }
  MAC_HIZ.secim = 1; MAC_HIZ.deger = 1; MAC_HIZ.oto = oto0;
  const O = R.filter(r => r.faz === 'play'), n = Math.max(1, O.length), B = O.map(r => r.boy).filter(x => x != null).sort((a, b) => a - b);
  return { ornek: O.length, ic: +(O.filter(r => Math.abs(r.x) <= 0.55 && r.y >= -0.35 && r.y <= 0.5).length / n).toFixed(3),
    disarida: +(O.filter(r => Math.abs(r.x) > 1 || Math.abs(r.y) > 1).length / n).toFixed(3),
    boy: B.length ? +B[B.length >> 1].toFixed(1) : 0, topPx: O.length ? Math.min(...O.map(r => r.px)) : 0,
    fovFark: O.length ? +(Math.max(...O.map(r => r.fov)) - Math.min(...O.map(r => r.fov))).toFixed(4) : 0, masa: O.length ? Math.max(...O.map(r => r.masa)) : 0 };
}"""


# belirlenimli sayfa: tohumlu Math.random ve elle ilerleyen kare saati (araclar/an-yakala.py ile aynı düzen); kareler yalnız __kare(n) ile akar
SAAT_JS = """(() => { let s = 5 >>> 0; Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let kuyruk = [], an = 1000; window.requestAnimationFrame = f => { kuyruk.push(f); return kuyruk.length; }; window.cancelAnimationFrame = () => {}; performance.now = () => an;
  window.__kare = n => { for (let i = 0; i < n; i++) { an += 1000 / 60; const q = kuyruk; kuyruk = []; for (const f of q) f(an); } }; })();"""


async def bolum_17(tarayici, site, tum_hatalar):
    """Topa odaklı bakış ve maçın netliği (A akışı 2026-10-03; ikinci paket: maç ızgarası 960×720, yakın bakış).
    Sayfa tohumlu ve elle saatli: örnekler her çalıştırmada aynıdır. Oyuncu boyu ve top 480 satır karşılığıyla ölçülür."""
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script(SAAT_JS)
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
    await pg.goto((site / "index.html").as_uri() + loca("?ekran=mac&tohum=5"))
    await pg.wait_for_selector("#btnMacaGec", timeout=30000)
    await pg.evaluate("__kare(2)")
    cizim = await pg.evaluate("({ rt: [rt.width, rt.height], tuval: [renderer.domElement.width, renderer.domElement.height], ic: [RW, RH], ornek: STIL.ekran.ornekleme, hud: !!document.getElementById('hud'), ikinciHedef: typeof rtMac !== 'undefined' })")
    denetle("Tek ızgara: maç, oda ve balkon 960×720'de, içeride 2 katında çiziliyor (1920×1440, tek hedef); tuval ızgaranın tam sayı katında; ekran üstü maske tuvali yok",
            cizim["rt"] == [1920, 1440] and cizim["ic"] == [960, 720] and not cizim["hud"] and not cizim["ikinciHedef"]
            and cizim["tuval"][0] % 960 == 0 and cizim["tuval"][0] * 3 == cizim["tuval"][1] * 4, str(cizim))
    await pg.click("#btnMacaGec")
    o1 = await pg.evaluate(ORNEK_JS, {"sure": 30, "hiz": 1})
    o4 = await pg.evaluate(ORNEK_JS, {"sure": 30, "hiz": 4})
    for ad, o in (("1×", o1), ("4×", o4)):
        denetle(f"Belirlenimli 30 sn oyunda ({ad}) top 0,25 sn'lik örneklerin ≥ %90'ında pencere bandında (|x| ≤ 0,55, −0,35 ≤ y ≤ 0,5), ≤ %1'inde ekran dışında; görüş açısı sabit (fark ≤ 0,01°), masa kıpırdamıyor (Z1)",
                o["ornek"] >= 40 and o["ic"] >= 0.9 and o["disarida"] <= 0.01 and o["fovFark"] <= 0.01 and o["masa"] <= 1e-9, str(o))
    # Z1'de (32°) kapı ≥ 23 piksel; K1 (2026-10-20, 36°): oyuncular açıyla tan 16° / tan(aci/2) oranında küçülür (36°'de ×0,88), kapı da onunla.
    # Kapının açıyla ölçeklenmesi bilinçlidir (kullanıcı kararı: geniş açı okunurluk pahasına istendi); 36°'de kapı ~20,3 px (ölçülen ~20,9 px).
    # Açının kendisi okunurluğu korumaz: açı yeniden değişirse kapının yeni değeri (40°'de ~18,2 px) kullanıcıya gösterilir
    aci = await pg.evaluate("STIL.kameralar.baskan.aci")
    esik = 23 * math.tan(math.radians(16)) / math.tan(math.radians(aci / 2))
    denetle(f"Oyunda oyuncu boyu ortancası 480 satır karşılığı ≥ {esik:.1f} piksel (Z1: 32°'de ≥ 23; K1: {aci}°, kapı açıyla küçülür), top ≥ 3 piksel", o1["boy"] >= esik and o1["topPx"] >= 2.95, f"{o1['boy']} px · top en az {o1['topPx']} px")
    # dürbün kaldırıldı (kullanıcı kararı 2026-10-07): D tuşu bir şey yapmaz; düğme, maske tuvali, ayar, el hareketi ve kamera geçiş durumu yok
    await pg.keyboard.press("KeyD")
    await pg.evaluate("__kare(45)")
    yok = await pg.evaluate("""({ bino: typeof bino, dugme: !!document.getElementById('btnBino'), hud: !!document.getElementById('hud'), ayar: 'durbun' in STIL.kameralar,
      islev: typeof baskanDurbun, kam: ('gecis' in KAM) || ('dfov' in KAM) || ('d' in KAM), eylem: BASKAN.eylem ? BASKAN.eylem.ad : null, fov: +camera.fov.toFixed(2),
      aci: STIL.kameralar.baskan.aci })""")
    denetle("Dürbün kaldırıldı (2026-10-07): bino, btnBino, maske tuvali, STIL.kameralar.durbun, baskanDurbun ve kameranın dürbün durumu yok; D tuşu görüş açısını oyun aralığından çıkarmıyor",
            yok["bino"] == "undefined" and not yok["dugme"] and not yok["hud"] and not yok["ayar"] and yok["islev"] == "undefined" and not yok["kam"]
            and not (yok["eylem"] or "").startswith("durbun") and abs(yok["fov"] - yok["aci"]) <= 0.5, str(yok))
    # elle saatli sayfada kareler sunulmadan art arda verilir; yazılım çizimi (960×720 ızgara, 2×) birikir: görüntü öncesi kuyruk boşaltılır
    await pg.evaluate("renderer.getContext().finish()")
    await pg.screenshot(path=str(ARAC / "son-akis-17-mac.png"), timeout=180000)
    tum_hatalar += hatalar
    await baglam.close()


# U1: maçı elle ilerletir (SAAT_JS sayfası); her karede motorun karesi ve etkin hız, ana motorun olayları kaydedilir
IZLEME_JS = """(o) => {
  const L = [], H = [], o0 = window.olay; window.olay = (ad, v) => { L.push([mac.kare, ad, ad === 'header' ? !!(v && v.shot) : null]); return o0(ad, v); };
  MAC_HIZ.secim = o.secim; MAC_HIZ.oto = o.oto;
  for (let g = 0; g < o.kare; g++) { macKare(1 / 60); H.push([mac.kare, +MAC_HIZ.deger.toFixed(3), mac.phase, MAC_HIZ.anda ? 1 : 0]); }
  window.olay = o0;
  const I = MAC_IZLEME; return { L, H, sapma: I.sapma, sapmaYer: I.sapmaYer, ikiz: !!I.ikiz, onde: I.ikiz ? I.ikiz.kare - mac.kare : null };
}"""
SONA_JS = """(n) => { MAC_HIZ.secim = 16; MAC_HIZ.oto = false; for (let g = 0; g < n && mac.phase !== 'fulltime'; g++) macKare(1 / 60);
  for (let g = 0; g < 4; g++) macKare(1 / 60);
  const I = MAC_IZLEME; return { faz: mac.phase, skor: mac.score.join('-'), sapma: I.sapma, sapmaYer: I.sapmaYer, son: I.son, ikizAdim: I.ikizAdim }; }"""


async def bolum_18(tarayici, site, tum_hatalar):
    """İzleme hızı ve önemli anlar (U1, 2026-10-12): 20 dakikalık maç, ×1 ×2 ×4, önemli anlarda kendiliğinden 1×, ikiz motor."""
    # oda: Ayarlar > Maç (seçim ve önemli anlarda normal hız)
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await odak_ac(pg, "ayar")
    await pg.click('[data-eylem="ayarBolum"][data-bolum="mac"]')
    panel = await pg.text_content(".od-panel")
    await pg.click('[data-eylem="macHizi"][data-hiz="4"]')
    await pg.click('[data-eylem="otoYavas"]')
    a1 = await pg.evaluate("({ h: OYUN.ayarlar.macHizi, o: OYUN.ayarlar.otoYavas, k: JSON.parse(localStorage.getItem('chairman:ayarlar')), m: [MAC_HIZ.secim, MAC_HIZ.oto] })")
    await pg.click('[data-eylem="otoYavas"]')
    a2 = await pg.evaluate("({ o: OYUN.ayarlar.otoYavas, k: JSON.parse(localStorage.getItem('chairman:ayarlar')).otoYavas, m: MAC_HIZ.oto })")
    denetle("Ayarlar > Maç: hız (×1 ×2 ×4) ve 'önemli anlarda normal hız'; seçim ayarlara yazılıyor ve maçın hızına geçiyor; anahtar açılıp kapanıyor",
            "Maç hızı" in panel and "Önemli anlarda normal hız" in panel and a1["h"] == 4 and a1["k"]["macHizi"] == 4 and a1["o"] is False and a1["k"]["otoYavas"] is False
            and a1["m"] == [4, False] and a2["o"] is True and a2["k"] is True and a2["m"] is True, f"{a1} · {a2}")
    await pg.context.close()
    # maç: şeritteki düğmeler ve tuşlar, kalıcılık (ayarlar ortak depoda)
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=3", "#btnMacaGec")
    tum_hatalar += hatalar
    d0 = await pg.evaluate("({ s: MAC_HIZ.secim, b: [...document.querySelectorAll('#izlemeHiz button')].map(b => b.textContent + ':' + b.getAttribute('aria-pressed')).join(',') })")
    await pg.click('#izlemeHiz [data-izhiz="2"]')
    d1 = await pg.evaluate("({ s: MAC_HIZ.secim, k: JSON.parse(localStorage.getItem('chairman:ayarlar')).macHizi, p: document.querySelector('#izlemeHiz [data-izhiz=\"2\"]').getAttribute('aria-pressed'), g: document.querySelector('#hizSeg [data-hiz=\"2\"]').getAttribute('aria-pressed') })")
    await pg.keyboard.press("Digit4")
    d2 = await pg.evaluate("({ s: MAC_HIZ.secim, k: JSON.parse(localStorage.getItem('chairman:ayarlar')).macHizi })")
    await pg.reload()
    await pg.wait_for_selector("#btnMacaGec", timeout=20000)
    d3 = await pg.evaluate("({ s: MAC_HIZ.secim, o: MAC_HIZ.oto, p: document.querySelector('#izlemeHiz [data-izhiz=\"4\"]').getAttribute('aria-pressed') })")
    denetle("Maç şeridi: ×1 ×2 ×4 (yeni depoda ×1); düğme ve 4 tuşu seçimi ayarlara yazar, geliştirici paneli aynı seçimi gösterir; yenilemede seçim korunur",
            d0["s"] == 1 and d0["b"] == "×1:true,×2:false,×4:false" and d1["s"] == 2 and d1["k"] == 2 and d1["p"] == "true" and d1["g"] == "true"
            and d2["s"] == 4 and d2["k"] == 4 and d3["s"] == 4 and d3["o"] is True and d3["p"] == "true", f"{d0} · {d1} · {d2} · {d3}")
    await pg.click('#izlemeHiz [data-izhiz="1"]')
    await pg.context.close()
    # belirlenimli maç: ×4 seçiliyken önemli anlardan önce 1×'e iniş; ikiz önde ve aynı
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script(SAAT_JS)
    pg = await baglam.new_page()
    hatalar = []
    pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
    pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if (m.type == "error" or m.type == "warning" and "İzleme" in m.text) and "Failed to load resource" not in m.text else None)
    await pg.goto((site / "index.html").as_uri() + loca("?ekran=mac&tohum=3"))
    await pg.wait_for_selector("#btnMacaGec", timeout=30000)
    await pg.evaluate("__kare(2)")
    await pg.click("#btnMacaGec")
    # Z7 (2026-10-20): pencere 2400 → 4800 kare — denetim pencerede en az bir şut ister; Z3–Z7 motoruyla tohum 3'ün ilk 2400 karesinde şut yoktu (sınama penceresi, işlev değil)
    # D (2026-10-22, masaüstü): 4800 → 9600 — B ve C motoruyla (maç başına tarz) tohum 3'ün ilk 4800 karesinde şut ya da gol yok (C koduyla bölüm 18 bu yüzden düştü)
    r = await pg.evaluate(IZLEME_JS, {"secim": 4, "oto": True, "kare": 9600})
    H, L = r["H"], r["L"]
    hiz = {k: v for k, v, _, _ in H}
    ana = [x for x in L if x[1] in ("shot", "goal") or (x[1] == "header" and x[2])]
    ana = [x for x in ana if x[0] > 600]   # öne çıkma (~1 sn) bittikten sonra
    yavas = []
    for k, ad, _ in ana[:6]:
        once = [v for kk, v in hiz.items() if k - 150 <= kk <= k]
        yavas.append((ad, k, max(once) if once else None))
    tepe = max(v for _, v, f, _ in H if f == "play") if H else 0
    denetle("×4'te şut ve golden en az 2,5 sn önce izleme 1×'e inmiş (ikiz önceden bildirdi); arada ×4'e çıkıyor; ikiz 7 sn önde, sapma 0; olay anında gösterge 'önemli an'",
            yavas and all(m is not None and m <= 1.05 for _, _, m in yavas) and tepe >= 3.9 and r["sapma"] == 0 and r["ikiz"] and r["onde"] == 420
            and any(a == 1 for _, _, _, a in H), f"{yavas} · tepe {tepe} · sapma {r['sapma']} {r['sapmaYer'] or ''} · önde {r['onde']}")
    s = None
    for _ in range(12):
        s = await pg.evaluate(SONA_JS, 600)
        if s["faz"] == "fulltime":
            break
    denetle("Tarayıcıda maçın sonuna dek ikiz motor ana motorla aynı: olaylar her adımda eşleşti (sapma 0), maç sonu kayıtları aynı",
            s and s["faz"] == "fulltime" and s["sapma"] == 0 and s["son"] and s["son"]["ayni"], str(s))
    tum_hatalar += hatalar
    await baglam.close()


async def bolum_11(tarayici, site, tum_hatalar):
    """Oyun çerçevesi (2.8A, 2.8J, 2.8O)."""
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
    await pg.goto((site / "index.html").as_uri() + loca("?dunya=7"))
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)
    cerceve = await pg.evaluate("""() => ({ ust: !!document.querySelector('header.top, .rules, .pal, .radyo, #radyoMetin, #radyoSkor'),
      gelistirici: !!document.querySelector('details.gelistirici:not([open]) #hizSeg'), santra: (document.getElementById('btnMacaGec') || {}).textContent,
      ayarlar: [...document.querySelectorAll('details.gelistirici button, details.gelistirici input, details.gelistirici select')].map(b => b.id || b.dataset.hiz).join(',') })""")
    denetle("Çerçeve temiz: başlık, kurallar, palet ve radyo satırı yok; deneme ayarlarında yalnız maç hızı, Durdur ve tarz seçimi (TEST, B4b; doluluk, zemin, baştan başlat yok); 'Santraya geç'",
            not cerceve["ust"] and cerceve["gelistirici"] and cerceve["santra"] == "Santraya geç" and cerceve["ayarlar"] == "1,2,4,8,btnDurdur,tarzEv,tarzKonuk", str(cerceve))
    ayar = await pg.evaluate("({ a: OYUN.ayarlar.yazi, t: OYUN.ayarlar.test, kayit: JSON.parse(localStorage.getItem('chairman:ayarlar')) })")
    denetle("Eski ayar kaydı açıldı: yazı büyüklüğü ve test ayarı korundu, ses ve hareket anahtarları düştü",
            ayar["a"] == "buyuk" and ayar["t"] is False and "ses" not in ayar["kayit"] and "sessiz" not in ayar["kayit"] and "hareket" not in ayar["kayit"], str(ayar))
    await pg.keyboard.press("Digit2")
    await pg.keyboard.press("Digit1")
    await odak_ac(pg, "ayar")
    ayar_yazi = await pg.text_content(".od-panel")
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    ses = await pg.evaluate("({ sayac: window.__sesSayaci, tanim: ['sesCal', 'sesBaslat', 'sesOrtam', 'sesAyarla', 'SES'].filter(a => a in window), cay: typeof BK_CAY !== 'undefined' || typeof BK_BUHAR !== 'undefined', soyle: typeof soyle !== 'undefined' })")
    denetle("Ses yok: paneller ve balkon sonrası ses bağlamı kurulmadı, ses işlevleri tanımsız, ayarlarda Ses ya da Hareket bölümü yok; çay ve spiker işlevi yok",
            ses["sayac"] == 0 and not ses["tanim"] and not ses["cay"] and not ses["soyle"] and "Ses" not in ayar_yazi and "Hareket" not in ayar_yazi, str(ses))
    await pg.goto((site / "index.html").as_uri() + loca("?ekran=mac&hiz=16&tohum=3"))
    await pg.wait_for_timeout(1500)
    await pg.click("#btnMacaGec")
    await pg.wait_for_timeout(8000)
    mac = await pg.evaluate("({ faz: mac.phase, sn: Math.round(mac.gameSec), sut: mac.ist.sut.join('-'), sayac: window.__sesSayaci, kuyruk: olayKuyrugu.length })")
    denetle("Maç sessiz ve spikersiz oynanıyor: santradan sonra olaylar işleniyor, istatistik üretiliyor",
            mac["faz"] not in ("isinma", "giris", "toren", "selam", "yazitura") and mac["sn"] > 0 and mac["sayac"] == 0 and not hatalar, str(mac))
    await pg.screenshot(path=str(ARAC / "son-akis-11-mac.png"))
    tum_hatalar += hatalar
    await baglam.close()


# F2 (2026-10-23): "Maçı bitir (TEST)" kalanı görüntüsüz oynatır; başsız tarayıcıda kare hızı düşük olduğundan döngü sayfanın içinden sürülür
HIZLI_JS = """(n) => { for (let g = 0; g < n && mac.phase !== 'fulltime'; g++) { if (typeof locaGirisKare === 'function') locaGirisKare(1 / 60); macKare(1 / 60); hizliBitirGosterge(); }
  return { faz: mac.phase, dk: mac.minuteLabel(), H: Object.assign({}, HIZLI_BITIR) }; }"""


# H2-a: sayfada karar anının hiç açılmadığını izleyen casus (kararAniAc sarılır; açık durum da yoklanır)
KARAR_CASUS_JS = """() => { window.__ka = false; const e = kararAniAc; window.kararAniAc = function () { window.__ka = true; return e.apply(this, arguments); };
  setInterval(() => { if (KARAR_ANI.acik) window.__ka = true; }, 30); }"""
# H2-a: "Odaya dön"ün son çaresi (eşzamanlı ligCanliBitir) çağrılırsa sayfa değişse de iz kalır
BITIR_CASUS_JS = """() => { sessionStorage.removeItem('h2aBitir'); const e = ligCanliBitir;
  window.ligCanliBitir = function () { sessionStorage.setItem('h2aBitir', '1'); return e.apply(this, arguments); }; }"""
PERDE_JS = """() => ({ ortu: !document.getElementById('macHesap').hidden, yazi: document.getElementById('macHesap').textContent, perde: HIZLI_BITIR.perde,
  cizim: renderer.info.render.frame, kare: mac.kare || 0, faz: mac.phase, kart: MAC_SONU.acik })"""


async def bolum_19(tarayici, site, tum_hatalar):
    """F2, H2-a: maç sonucu kariyere — oda → Stada git → bülten → Maçı bitir (TEST; perde, file:// işçisiz yol) → Maç bitti kartı → Odaya dön → 14. hafta.
    H2-a: kariyerde rakip başkan yok (yeniden yükleme yok); Maçı bitir'den sonra sayfa kendi kare döngüsüyle sürer (HIZLI_JS yok), çizim durur,
    önce bizim maç; Odaya dön öbür maçları sayfayı dondurmadan bekler (ligCanliBitir çağrılmaz). Doğal bitiş ikinci kariyer sayfasında."""
    import time
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    # U4: her sayfa yüklemesinde geçiş kartı (bilet / maç sonu) ilk boyamada var mı: DOMContentLoaded'da kaydedilir
    await pg.add_init_script("document.addEventListener('DOMContentLoaded', () => { const g = document.getElementById('gecisKarti'); window.__gecisIlk = g ? g.innerText.replace(/\\s+/g, ' ') : null; });")
    await oda_ilerle(pg)
    zs = await pg.evaluate("() => ({ acik: ZAMAN_SAHNE.acik, evre: ZAMAN_SAHNE.evre, an: OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika, ilerle: (document.querySelector('.od-alt .od-ana') || {}).textContent })")
    await pg.wait_for_function("() => ZAMAN_SAHNE.evre === 'ozet'", timeout=15000)
    zo = await pg.evaluate("() => (document.querySelector('.zm-sahne[data-evre=\"ozet\"]') || {}).innerText || ''")
    denetle("U4: İlerle komutu hemen uygulandı (an Cumartesi 19:00) ve “zaman geçiyor” sahnesi açıldı; sonunda durak özeti: yeni an, geçen süre (5 gün 11 saat), gazete satırları, durak cümlesi",
            zs["acik"] and zs["an"] == "2026-11-28 1140" and "28 Kasım Cumartesi · 19:00" in zo and "5 gün 11 saat geçti" in zo and "Gazete:" in zo and "Sıradaki randevuya gelindi." in zo, f"{zs} · {zo[:160]}")
    kayit0 = await pg.evaluate(KAYIT_JS)
    id13 = "mac-2627-13-demirkapi-akdeniz"
    await pg.click(".od-ana")
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=60000)
    gi = await pg.evaluate("() => window.__gecisIlk")
    await pg.wait_for_function("() => !document.getElementById('gecisKarti')", timeout=20000)
    denetle("U4: Stada git'te bilet kartı yeni sayfanın ilk boyamasında (hafta, iki kulüp, gün ve saat, stat); stat çizilince söndü, bülten görünür",
            bool(gi) and "BİLET" in gi and "13. hafta" in gi.lower().replace("13. hafta", "13. hafta") and "Demirkapı SK – Akdeniz FK" in gi and "Cumartesi 28 Kasım · 19:00" in gi and "Demirkapı İlçe Stadı" in gi, str(gi))
    bul = await pg.text_content("#onEkran")
    denetle("F3-a: bültende iki takımın hocası ve tarzı (Şükrü Hoca · direkt ve ikinci top, Nuri Hoca · konumsal oyun); maç hocaların tarzıyla kuruldu",
            "Şükrü Hoca · direkt ve ikinci top" in bul and "Nuri Hoca · konumsal oyun" in bul and await pg.evaluate("() => [0, 1].map(t => tarzBaskin(mac, t)).join() === 'direkt,konumsal'"),
            bul[bul.find("Teknik"):][:120])
    await pg.evaluate(KARAR_CASUS_JS)
    await pg.click("#btnBeklemedenGec")   # N3: TEST düğmesi hazırlığı beklemeden maça geçirir
    await pg.wait_for_function("() => !ON_EKRAN.acik", timeout=30000)
    p = await pg.evaluate("() => ({ tepe: TEPE_AN.aktif, rakip: MAC_PROTOKOL.rakipBaskan, protokol: MAC_GUNU.protokol && MAC_GUNU.protokol.rakipBaskan, sayfa: ON_EKRAN.sayfa })")
    denetle("H2-a: kariyerde rakip başkan yok: Maça geç'ten hemen sonra tepe anı kapalı, MAC_PROTOKOL.rakipBaskan 'yok' (maç gününün protokolü)",
            not p["tepe"] and p["rakip"] == "yok" and p["protokol"] == "yok" and p["sayfa"] is None, str(p))
    d0 = await pg.evaluate("() => ({ gorunur: !document.getElementById('btnHizliBitir').hidden, yazi: document.getElementById('btnHizliBitir').textContent, faz: mac.phase })")
    lc = await pg.evaluate("() => ({ n: LIG_CANLI.length, d: (MAC_GUNU.digerleri || []).length, k: LIG_CANLI.map(x => x.m.kare || 0), faz: mac.phase })")
    denetle("F7: haftanın öbür yedi maçı sayfada görüntüsüz kuruldu; bizim santramızdan önce adım atmadı", lc["n"] == 7 and lc["d"] == 7 and all(x == 0 for x in lc["k"]), str(lc))
    t0 = time.time()
    # basış ve ilk durum aynı görevde (arada kare akmaz)
    d1 = await pg.evaluate("""() => { const kare = mac.kare || 0; document.getElementById('btnHizliBitir').click();
      return { kare, dis: document.getElementById('btnHizliBitir').disabled, H: Object.assign({}, HIZLI_BITIR), kapali: MAC_IZLEME.kapali, ikizYok: MAC_IZLEME.ikiz === null,
        once: MAC_ONCESI.includes(mac.phase), faz: mac.phase }; }""")
    denetle("F2, H2-a: maç öncesinde şeritte 'TEST Maçı bitir'; basınca kapanır, perde açılır, izleme ikizi hemen bırakılır (maç öncesinde)",
            d0["gorunur"] and "TEST" in d0["yazi"] and "Maçı bitir" in d0["yazi"] and d1["dis"] and d1["H"]["perde"] and d1["H"]["bekliyor"] and d1["kapali"] and d1["ikizYok"] and d1["once"],
            f"{d0} · {d1}")
    await pg.wait_for_function("() => !document.getElementById('macHesap').hidden || MAC_SONU.acik", timeout=30000)
    r1 = await pg.evaluate(PERDE_JS)
    await pg.wait_for_timeout(1000)
    r2 = await pg.evaluate(PERDE_JS)
    denetle("H2-a: perde: 'Maç hesaplanıyor…' örtüsü görünür; çizim durdu (iki yoklama arasında renderer.info.render.frame aynı), maç arkada hesaplanıyor; U4: örtüde öbür maçlardan biten sayısı (n/7)",
            r1["ortu"] and "Maç hesaplanıyor" in r1["yazi"] and r1["perde"] and r2["cizim"] == r1["cizim"] and (r2["kare"] > r1["kare"] or r2["kart"])
            and (r2["kart"] or re.search(r"öbür maçlar [0-7]/7", r2["yazi"] or r1["yazi"]) is not None), f"{r1} → {r2}")
    await pg.wait_for_selector("#macSonu:not([hidden]) [data-eylem='odayaDon']", timeout=240000)
    sure = time.time() - t0
    k = await pg.evaluate("""() => ({ skor: mac.score.join('–'), kart: document.querySelector('#macSonu .ms-skor').textContent, sayfa: ON_EKRAN.sayfa, kare: mac.kare,
      dugmeGizli: document.getElementById('btnHizliBitir').hidden, golSatiri: document.querySelectorAll('#macSonu .ms-bolum li').length, ortu: !document.getElementById('macHesap').hidden,
      cizim: renderer.info.render.frame, ka: window.__ka, kip: MAC_ARKA.kip, obur: LIG_CANLI.filter(x => x.m && x.m.phase === 'fulltime').length,
      xg: /Beklenen gol [0-9],[0-9][0-9] – [0-9],[0-9][0-9] · şut [0-9]+ – [0-9]+/.test(document.getElementById('macSonu').textContent) })""")
    await pg.keyboard.press("KeyT")
    tel = await pg.evaluate("() => MAC_TELEFON.acik")
    denetle("F2, H2-a: 'Maç bitti' kartı skorla açıldı (file://, işçisiz: önce bizim maç); örtü kalktı, çizim yine durgun; düğme gizlendi; kart açıkken telefon açılmaz; karar anı hiç açılmadı; kayıt henüz değişmedi; F3-b: kartta beklenen gol ve şut",
            k["skor"] in k["kart"] and k["sayfa"] == "macSonu" and not k["ortu"] and k["cizim"] == r1["cizim"] and k["dugmeGizli"] and not tel and not k["ka"] and k["xg"]
            and k["kip"] == "anaIs" and await pg.evaluate(KAYIT_JS) == kayit0, f"{sure:.1f} sn · {k['kare'] - d1['kare']} kare (basıştan karta) · öbür maçlardan biten {k['obur']}/7 · {k['skor']}")
    belir = await pg.evaluate("() => document.getElementById('macSonu').classList.contains('ms-belir')")
    denetle("U4: maç sonu kartı belirme geçişiyle açıldı (ms-belir)", belir)
    await pg.evaluate(BITIR_CASUS_JS)
    t1 = time.time()
    await pg.click("#macSonu [data-eylem='odayaDon']")
    bekle = await pg.text_content("#macSonu .ms-durum")
    await pg.screenshot(path=str(ARAC / "son-akis-19-kart.png"))
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=240000)
    sure2 = time.time() - t1
    o = await pg.evaluate(f"""() => {{ const k = OYUN.kariyer, t = sezonTablosu(k).find(x => x.id === 'demirkapi'), m = k.maclar['{id13}'], T = sezonTablosu(k);
      const is = Object.values(k.isler).filter(x => x.veri && x.veri.eylem === 'macGunu');
      return {{ an: k.tarih + ' ' + k.gunIciDakika, mac: m ? m.skor.join('–') : null, macSay: Object.keys(k.maclar).length, O: t.O, protokol: m ? m.protokol : 'yok',
        is: is.map(x => x.veri.macId.split('-')[2] + ' ' + x.tarih + ' ' + x.dakika), gecmis: k.gecmis.filter(g => g.tur === 'mac').length,
        hepsi13: T.every(x => x.O === 13), kisa: Object.entries(k.maclar).filter(([id]) => id !== '{id13}').every(([, s]) => s.sutlar === null) }}; }}""")
    casus = await pg.evaluate("() => sessionStorage.getItem('h2aBitir')")
    gd = await pg.evaluate("() => window.__gecisIlk")
    denetle("U4: Odaya dön'de maç sonu kartı odanın ilk boyamasında (skor, “Odaya dönülüyor…”)", bool(gd) and "MAÇ SONU" in gd and k["skor"].replace("–", " – ") in gd and "Odaya dönülüyor" in gd, str(gd))
    denetle("F2/F7, H2-a: Odaya dön 'Öbür maçlar tamamlanıyor' diye bekledi, haftanın sekiz sonucunu bir kez kaydetti (öbürleri kısa kayıt; ligCanliBitir çağrılmadı; bizim maçın protokolü null); oda Cumartesi 21:00; 16 kulüp 13 maç; sıradaki iş 14. hafta 5 Aralık 19:00; adres parametresiz",
            "tamamlanıyor" in bekle and casus is None and o["protokol"] is None
            and "mac=" not in pg.url and o["an"] == "2026-11-28 1260" and o["mac"] == k["skor"] and o["macSay"] == 8 and o["hepsi13"] and o["kisa"] and o["O"] == 13 and o["is"] == ["14 2026-12-05 1140"]
            and o["gecmis"] == 1 and await pg.evaluate(KAYIT_JS) != kayit0, f"bekleme {sure2:.1f} sn ('{bekle.strip()}') · {o}")
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    skor = await pg.text_content(".tel")
    beklenen = k["skor"].replace("–", " – ")   # kartta 3–0, Canlı Skor satırında 3 – 0
    hs = await pg.evaluate(HAFTA_JS)
    bitti = await pg.evaluate("() => [...document.querySelectorAll('.tel .tel-mac small')].filter(e => e.textContent === 'Bitti').length")
    denetle("F2, R3: maç akşamı Canlı Skor 13. haftayla açılır; bizim maç skoruyla, öbürleriyle aynı satır kalıbında", hs["h"] == "13. hafta" and beklenen in skor and hs["sinif"] == "tel-mac", skor[:160])
    denetle("F7, R3: haftanın sekiz maçı da sonuçlanmış (8 satır, hepsi “Bitti”)", hs["n"] == 8 and bitti == 8, f"{hs['n']} satır · {bitti} bitti")
    # F3-b, R3: bizim maçın satırına dokununca maç sayfası sağ panelde; İstatistikler'de beklenen gol (kayıttaki değer) ve pas isabeti
    await cs_ac(pg, "mac", id13)
    panel = await pg.evaluate("() => !!document.querySelector('.tlf-is .cs-sayfa[data-tur=mac]') && document.querySelectorAll('.tel .tel-mac').length === 8")
    await cs_bolum(pg, "ist")
    ist = await pg.text_content(".cs-ist")
    xg = await pg.evaluate(f"() => OYUN.kariyer.maclar['{id13}'].xg.map(x => x.toFixed(2).replace('.', ',')).join(' ')")
    denetle("F3-b, R3: maç sayfası sağ panelde (telefon listeyi tutar); İstatistikler'de şut, beklenen gol (kayıttaki değer), topa sahip olma, pas isabeti",
            panel and "Beklenen gol" in ist and "Pas isabeti" in ist and "Topa sahip olma" in ist and all(x in ist for x in xg.split(" ")), f"{xg} · {ist[:120]}")
    # H2-b, R3: odada 13. haftanın sekiz satırı dokunulur; öbür bir maçın sayfası kayıttan (adlar kariyerin oyuncularından, kısa kayıtta kayıttaki beklenen gol)
    dokunur = await pg.evaluate("() => [...document.querySelectorAll('.tel [data-eylem=csAc][data-tur=mac]')].map(b => b.dataset.id)")
    obur_id = next((m for m in dokunur if m != id13), None)
    if obur_id:
        await cs_ac(pg, "mac", obur_id)
    oa = await pg.evaluate(OBUR_SAYFA_JS, obur_id)
    if obur_id:
        await cs_bolum(pg, "ist")
    oist = await pg.text_content(".cs-ist") if obur_id else ""
    denetle("H2-b, R3: odada 13. haftanın sekiz satırı dokunulur; öbür bir maçın sayfası kayıttan: Özet'te gol satırı skor toplamı kadar, golcü ve kart adları kariyerin oyuncularından; İstatistikler'de kayıttaki beklenen gol",
            len(dokunur) == 8 and id13 in dokunur and oa["gol"] == oa["toplam"] and oa["adlar"] and all(x in oist for x in oa["xg"]),
            f"{len(dokunur)} satır · {obur_id}: {oa['gol']} gol satırı · xg {oa['xg']}")
    await pg.wait_for_timeout(300)
    await pg.screenshot(path=str(ARAC / "son-akis-19-oda.png"))
    await skor_ana(pg)
    # H2-c (kullanıcı isteği 3): hocanın yorumu kendiliğinden gelmez; başkan sorar ("Maçı nasıl gördün?"), cevap birkaç saat sonra telefonda
    hid = await pg.evaluate("() => OYUN.kariyer.kulupler.demirkapi.hocaId")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    liste = await pg.text_content(".tel")
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{hid}"]')
    konusma = await pg.text_content(".tel")
    yorum = await pg.evaluate(f"() => macYorumu(OYUN.kariyer, '{id13}').metin")
    await konu_menu_ac(pg)
    oneri = await pg.query_selector('.tlf-menu [data-eylem="girisim"][data-girisim="yaz.teknikDirektor.mac"]')
    denetle("H2-c: maçtan sonra hocanın konuşmasında kendiliğinden yorum yok; “Maçı nasıl gördün?” önerisi duruyor; listede hoca ve yardımcı",
            "Şükrü Hoca" in liste and "Tahsin" in liste and yorum not in konusma and oneri is not None, konusma[:120])
    await konu_sec(pg, "yaz.teknikDirektor.mac")
    gonder = await pg.evaluate("""() => ({ giden: [...document.querySelectorAll('.tel .tel-giden')].map(e => e.textContent).join(' | '), mesaj: (document.querySelector('.od-mesaj') || {}).textContent || '',
      kapali: !!(document.querySelector('.tel-yeniKonu button') || {}).disabled, menu: !!document.querySelector('.tlf-menu') })""")
    denetle("H2-c: soru gitti — giden balon, şeritte “Mesaj gitti”; cevap gelene dek hocanın öbür konuları kapalı (R2 eki: “Yeni konu aç” kapalı, menü kapandı)",
            "Maçı nasıl gördün?" in gonder["giden"] and "Mesaj gitti" in gonder["mesaj"] and gonder["kapali"] and not gonder["menu"], str(gonder))
    await masaya_don(pg)
    await odak_ac(pg, "ajanda")
    await pg.wait_for_selector(".dft", timeout=10000)
    dft = await pg.text_content(".dft")
    denetle("F3-b: defterde maç gününde 'Maçtan not' (beklenen gol ve şutla)", "Maçtan not" in dft and "Beklenen gol" in dft, dft[dft.find("Maçtan"):][:140])
    await pg.keyboard.press("Escape")
    # H2-b, R3: büyük yazıda ve 672×600'de (640 px kare) bizim ve öbür maçın sayfası (Özet, Kadrolar) açıkken yatay taşma yok (sayfa, bölümleri, telefon gövdesi; olay satırı sayfada)
    tasma = []
    for yazi_boy, boyut in (("buyuk", (1180, 1000)), ("buyuk", (672, 600)), ("normal", (672, 600))):
        await pg.set_viewport_size({"width": boyut[0], "height": boyut[1]})
        await ayar_yazi(pg, yazi_boy)
        await pg.keyboard.press("Digit1")
        await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
        for mid in (id13, obur_id):
            await cs_ac(pg, "mac", mid)
            for bol in ("ozet", "kadro"):
                await cs_bolum(pg, bol)
                tasma.append((f"{yazi_boy}-{boyut[0]}-{'son' if mid == id13 else 'obur'}-{bol}", await pg.evaluate(CS_TASMA_JS)))
            if yazi_boy == "buyuk" and boyut[0] == 672 and mid != id13:
                await pg.wait_for_timeout(300)
                await pg.screenshot(path=str(ARAC / "son-akis-19-ayrinti-dar.png"))
            await pg.keyboard.press("Escape")
        await masaya_don(pg)
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    # H2-c: İlerle beklenen cevapta durur (Pazar 09:30); cevap hocanın konuşmasında, metni maçın okumasıyla aynı; konuşma açılınca görüldü
    await oda_ilerle(pg)
    await pg.wait_for_function("() => OYUN.kariyer.tarih === '2026-11-29'", timeout=60000)
    ozet = await pg.text_content(".od-mesaj")
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{hid}"]')
    kon2 = await pg.text_content(".tel")
    c2 = await pg.evaluate(f"() => ({{ an: OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika, okunan: OYUN.kariyer.kisiler['{hid}'].okunan === simdikiAn(OYUN.kariyer) }})")
    denetle("H2-c: İlerle cevapta durdu (Pazar 09:30, “Cevap geldi; telefonda.”); cevap hocanın konuşmasında, metni maçın okumasıyla aynı (macYorumu); konuşma açılınca görüldü",
            "Cevap geldi" in ozet and c2["an"] == "2026-11-29 570" and yorum in kon2 and c2["okunan"], f"{c2} · {ozet[:90]}")
    await masaya_don(pg)
    denetle("H2-b, R3: büyük yazıda ve 672×600'de (640 px kare) bizim ve öbür maçın sayfasında (Özet, Kadrolar) yatay taşma ≤ 1 piksel (sayfa, bölümleri, telefon gövdesi; olay satırı sayfayı aşmaz)",
            len(tasma) == 12 and all(t["sayfa"] == "mac" for _, t in tasma) and all(t["en"] <= 1 for _, t in tasma),
            " · ".join(f"{a}: {t['en']} ({t['n']} ölçüm)" for a, t in tasma))
    kayit1 = await pg.evaluate(KAYIT_JS)
    await pg.goto(pg.url.split("?")[0] + "?ekran=bulten&mac=" + id13)
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=60000)
    msj = await pg.text_content(".od-mesaj")
    denetle("F2: oynanmış maçın adresi odaya düşer, neden söylenir; kayıt değişmedi", "bekleyen bir iş değil" in msj and await pg.evaluate(KAYIT_JS) == kayit1, msj)
    await pg.context.close()
    # H2-a: doğal bitiş — ikinci kariyer sayfası Maçı bitir'e basmadan sonuna dek (×16, kilit adımlı öbür maçlarla) oynanır; kart; Odaya dön
    # kalan öbür maçları bekler ve ligCanliBitir'siz biter
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await oda_ilerle(pg)
    await pg.click(".od-ana")
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=60000)
    await pg.evaluate(KARAR_CASUS_JS)
    await pg.click("#btnBeklemedenGec")
    await pg.wait_for_function("() => !ON_EKRAN.acik", timeout=30000)
    await pg.evaluate("document.getElementById('btnMacaGec').click()")
    # H2-b (file://, kilit adım): santradan sonra maç telefonunda öbür maçın satırı dokunulur; ayrıntı canlı motorun kaydından (x.m.sonucKaydi())
    for _ in range(120):
        await pg.evaluate(SONA_JS, 60)
        if await pg.evaluate("() => !MAC_ONCESI.includes(mac.phase) && mac.gameSec >= 900"):
            break
    await pg.evaluate("() => MAC_TELEFON.ac()")
    await pg.evaluate("() => document.querySelector('#macTelefon [data-eylem=telUyg][data-uyg=skor]').click()")
    satirlar0 = await pg.evaluate("() => [...document.querySelectorAll('#macTelefon [data-eylem=csAc][data-tur=mac]')].map(b => ({ id: b.dataset.id, skor: b.querySelector('.tel-macOrta b').textContent.split('–').map(x => +x.trim()) }))")
    satir_id = [x["id"] for x in satirlar0]
    oid = next((m for m in satir_id if m != id13), None)
    tikla = "(id) => [...document.querySelectorAll('#macTelefon [data-eylem=csAc][data-tur=mac]')].find(b => b.dataset.id === id).click()"
    # B44 (H2-e'nin “maç telefonunda kaydırma”sı): dar karede listenin sonuna kaydırılır; sayfadan dönünce okuma yeri aynı
    await pg.set_viewport_size({"width": 672, "height": 600})
    yer0 = await pg.evaluate("() => { const g = document.querySelector('#macTelefon .tel-govde'); g.scrollTop = g.scrollHeight; return { y: g.scrollTop, h: g.scrollHeight - g.clientHeight }; }")
    if oid:
        await pg.evaluate(tikla, oid)
    ca = await pg.evaluate(CANLI_SAYFA_JS, oid)
    if oid:
        await pg.evaluate("() => document.querySelector('#macTelefon [data-eylem=csBolum][data-bolum=ist]').click()")
    ca["tablo"] = await pg.evaluate(CANLI_IST_JS, oid)
    ca["satir"] = next((x["skor"] for x in satirlar0 if x["id"] == oid), [0])
    await pg.keyboard.press("Escape")
    yer1 = await pg.evaluate("() => document.querySelector('#macTelefon .tel-govde').scrollTop")
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    # H2-b, R3 (§16'dan taşındı): bizim maçın sayfası motorun aynı anına ait
    await pg.evaluate(tikla, id13)
    bm = await pg.evaluate(BIZ_CANLI_JS)
    await pg.evaluate("() => document.querySelector('#macTelefon [data-eylem=csBolum][data-bolum=ist]').click()")
    bi = await pg.evaluate(BIZ_IST_JS)
    await pg.evaluate("() => document.querySelector('#macTelefon .cs-macBas [data-eylem=csAc][data-tur=kulup]').click()")
    takim_not = await pg.evaluate("() => { const s = document.querySelector('#macTelefon .cs-sayfa[data-tur=kulup]'); return s ? s.textContent : ''; }")
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Escape")
    # H2-c: maç telefonunda kişinin konuşması okunur ama konu önerileri (yazmak) gizli
    await pg.evaluate("() => { MAC_TELEFON.T.sayfalar = []; MAC_TELEFON.T.ekran = 'konusma'; MAC_TELEFON.T.kisi = OYUN.kariyer.kulupler.demirkapi.hocaId; MAC_TELEFON.kapat(); MAC_TELEFON.ac(); }")
    mt_oneri = await pg.evaluate("() => ({ konusma: !!document.querySelector('#macTelefon .tel-kisiBas'), oneri: document.querySelectorAll('#macTelefon .tel-oneri').length })")
    await pg.evaluate("() => MAC_TELEFON.kapat()")
    denetle("H2-c: maç telefonunda hocanın konuşması açılır, konu önerileri (yazmak) gizli", mt_oneri["konusma"] and mt_oneri["oneri"] == 0, str(mt_oneri))
    await pg.evaluate("() => { MAC_TELEFON.T.ekran = 'mesajlar'; MAC_TELEFON.T.kisi = null; MAC_TELEFON.kapat(); MAC_TELEFON.ac(); }")
    mt_liste = await pg.evaluate("() => document.querySelector('#macTelefon .tel-govde').textContent")
    await pg.evaluate("() => { MAC_TELEFON.T.ekran = 'ana'; MAC_TELEFON.kapat(); }")
    denetle("B44 (H2-e): maç telefonunun Mesajlar listesinde konu önerisinin önizlemesi yok (maçta yazılmaz; odada “… sorarsın”)", "Nusret" in mt_liste and "sorarsın" not in mt_liste, mt_liste[:140])
    denetle("H2-b, R3 (file://, kilit adım): santradan sonra maç telefonunda öbür maçın satırı dokunulur; maç sayfası canlı motordan: başlıkta skor ve canlı etiketi, Özet'te gol satırı satırdaki skor toplamı kadar, adlar ve İstatistikler'in 10 satırı x.m.sonucKaydi() ile aynı",
            bool(oid) and len(satir_id) == 8 and ca["gol"] == sum(ca["satir"]) == sum(ca["skor"]) and ca["bas"] == " – ".join(map(str, ca["skor"])) and ca["canli"] and ca["tablo"] and ca["adlar"],
            f"{oid} · bizim {ca['dk']}' · satır {ca['satir']} · {ca['gol']} gol satırı · başlık {ca['bas']}")
    denetle("H2-b, R3: maç telefonunda bizim maçın sayfası motorun aynı anına ait: başlıkta skor ve canlı etiketi; Özet'te gol satırı skor kadar; İstatistikler 10 satır (beklenen gol şut listesinden, isabetli şut maç sonu kaydıyla aynı)",
            bm["var"] and bm["gol"] == bm["golBek"] and bm["bas"] == bm["basBek"] and bm["canli"] and bi["esit"] and bi["n"] == 10 and bi["beklenen"], f"{bm} · {bi}")
    denetle("R3: maç telefonunda takım sayfası kariyerdeki (maç öncesi) bilgiyi gösterdiğini söyler (“Bugünkü maçlar, maç bitince işlenir.”)", "Bugünkü maçlar" in takim_not, takim_not[:120])
    denetle("R3, B44: maç telefonunda (672×600, 640 px kare) listenin sonundan bir maça girip Esc'le dönünce okuma yeri aynı", yer0["h"] > 0 and abs(yer1 - yer0["y"]) <= 2, f"{yer0} → {yer1}")
    son = None
    for _ in range(60):
        son = await pg.evaluate(SONA_JS, 600)
        if son["faz"] == "fulltime":
            break
    await pg.wait_for_selector("#macSonu:not([hidden]) [data-eylem='odayaDon']", timeout=120000)
    dk = await pg.evaluate("() => ({ skor: MAC_SONU.sonuc.skor.join('–'), ka: window.__ka, perde: HIZLI_BITIR.perde, obur: LIG_CANLI.filter(x => x.m && x.m.phase === 'fulltime').length })")
    await pg.evaluate(BITIR_CASUS_JS)
    t2 = time.time()
    await pg.click("#macSonu [data-eylem='odayaDon']")
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=240000)
    sure3 = time.time() - t2
    o2 = await pg.evaluate(f"() => ({{ n: Object.keys(OYUN.kariyer.maclar).length, biz: OYUN.kariyer.maclar['{id13}'].skor.join('–'), an: OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika }})")
    casus = await pg.evaluate("() => sessionStorage.getItem('h2aBitir')")
    denetle("H2-a: doğal bitiş (Maçı bitir'siz, perde yok): kart açıldı, karar anı açılmadı; Odaya dön ≤ 120 sn içinde sekiz sonucu yazdı, oda 21:00; ligCanliBitir çağrılmadı",
            son and son["faz"] == "fulltime" and not dk["ka"] and not dk["perde"] and o2["n"] == 8 and o2["biz"] == dk["skor"] and o2["an"] == "2026-11-28 1260" and casus is None and sure3 <= 120,
            f"Odaya dön {sure3:.1f} sn · kart açılırken biten öbür maç {dk['obur']}/7 · {dk['skor']}")
    await pg.context.close()
    # F2 incelemesi: "Maçı bitir" ile maçın sonucu izlenen maçla aynı olmalı (adım hep 1/60 sn; atlanan olaylar motora dokunmaz). Belirlenimli iki sayfa
    # (SAAT_JS, figürlü loca bakışı, aynı tohum, rakip başkan yok): biri ×16 ve ikizle sonuna dek (bölüm 18'in yolu), öbürü Maçı bitir
    # F3-0 (2026-10-24): üçüncü sayfa "gec" maç öncesini 900 kare doğal akıtıp sonra Santraya geç'e basar — basılan an maçı değiştirmemeli
    sonuc = {}
    for ad in ("izle", "bitir", "gec"):
        baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
        await baglam.add_init_script(SAAT_JS)
        pg = await baglam.new_page()
        pg.on("pageerror", lambda e: tum_hatalar.append("Betik hatası: " + str(e)))
        await pg.goto((site / "index.html").as_uri() + loca("?ekran=mac&tohum=3&rakipBaskan=yok"))
        await pg.wait_for_selector("#btnMacaGec", timeout=30000)
        await pg.evaluate("__kare(2)")
        if ad == "gec":
            # elle saatli sayfada 900 kareden sonra Playwright'ın tıklaması öğeyi çözemiyor (düğme yerinde ve etkin; aracın sınırı): sayfa içinden tıklanır
            await pg.evaluate("__kare(900)")
            await pg.evaluate("document.getElementById('btnMacaGec').click()")
        else:
            await pg.click("#btnMacaGec")
        if ad == "izle":
            for _ in range(20):
                son = await pg.evaluate(SONA_JS, 600)
                if son["faz"] == "fulltime":
                    break
        else:
            # elle saatli sayfada Playwright'ın tıklaması öğenin kararlılığını bekler (rAF elle akar); "gec" gibi sayfa içinden (dizüstünde zaman aşımı, H2-b)
            await pg.evaluate("document.getElementById('btnHizliBitir').click()")
            for _ in range(200):
                son = await pg.evaluate(HIZLI_JS, 20)
                if son["faz"] == "fulltime":
                    break
        sonuc[ad] = await pg.evaluate("() => ({ faz: mac.phase, kayit: JSON.stringify(mac.sonucKaydi()), skor: mac.score.join('-'), ikiz: MAC_IZLEME.son, sapma: MAC_IZLEME.sapma })")
        await baglam.close()
    i, b = sonuc["izle"], sonuc["bitir"]
    denetle("F2: aynı tohumla 'Maçı bitir' izlenen maçla (×16, ikizli) birebir aynı sonuç kaydını verir; ikiz izlenen maçta aynı, hızlıda atlandı",
            i["faz"] == b["faz"] == "fulltime" and i["kayit"] == b["kayit"] and i["ikiz"] == {"ayni": True} and i["sapma"] == 0 and b["ikiz"].get("atlandi") and b["sapma"] == 0,
            f"izle {i['skor']} · bitir {b['skor']} · ikiz {i['ikiz']} / {b['ikiz']}")
    g = sonuc["gec"]
    denetle("F3-0: Santraya geç'e maç öncesinin başka bir anında basmak maçı değiştirmez (900 kare sonra basılan maçın sonuç kaydı birebir aynı)",
            g["faz"] == "fulltime" and g["kayit"] == b["kayit"] and g["sapma"] == 0, f"gec {g['skor']} · bitir {b['skor']}")



async def bolum_19b(tarayici, site, tum_hatalar):
    """H2-a: TEST “Maçı izleme” (file://, işçisiz yol): oda → Maçı izleme → adres ekran=mac&izle=0 → perde ilk kareden (bülten ve şerit yok, karar anı yok)
    → kart; perdede T telefonu açmaz, P duraklatır; sonuç aynı kayıttan izlenen maçla birebir; Odaya dön sekiz sonuç; Duraklat'ta düğme kapalı; hükmen."""
    import time
    id13 = "mac-2627-13-demirkapi-akdeniz"
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await oda_ilerle(pg)
    kayit0 = await pg.evaluate(KAYIT_JS)
    DUGME_JS = "() => { const b = document.querySelector('.od-alt [data-eylem=\"yapIzlemesiz\"]'); return b ? b.disabled : null; }"
    await pg.keyboard.press("KeyP")
    kapali = await pg.evaluate(DUGME_JS)
    await pg.keyboard.press("KeyP")
    acik = await pg.evaluate(DUGME_JS)
    denetle("H2-a: odada Duraklat açıkken TEST 'Maçı izleme' kapalı, devamda açık", kapali is True and acik is False, f"{kapali} / {acik}")
    t0 = time.time()
    await pg.click('.od-alt [data-eylem="yapIzlemesiz"]')
    await pg.wait_for_url(re.compile(r"izle=0"), timeout=60000)
    await pg.wait_for_function("() => typeof MAC_GUNU !== 'undefined' && typeof HIZLI_BITIR !== 'undefined' && HIZLI_BITIR.perde", timeout=60000)
    await pg.evaluate(KARAR_CASUS_JS)
    await pg.wait_for_function("() => !document.getElementById('macHesap').hidden || MAC_SONU.acik", timeout=30000)
    a = await pg.evaluate("""() => ({ url: location.search, izlemesiz: MAC_GUNU.izlemesiz, onEkran: document.getElementById('onEkran').hidden, serit: document.getElementById('baskanDugmeleri').hidden,
      ortu: !document.getElementById('macHesap').hidden, yazi: document.getElementById('macHesap').textContent, cizim: renderer.info.render.frame, tepe: TEPE_AN.aktif, kart: MAC_SONU.acik })""")
    denetle("H2-a: 'Maçı izleme' adresi ekran=mac&izle=0&mac=…; bülten ve şerit gizli; perde ilk kareden ('Maç hesaplanıyor…' örtüsü, hiç çizilmedi); tepe anı yok",
            f"ekran=mac&izle=0&mac={id13}" in a["url"] and a["izlemesiz"] and a["onEkran"] and a["serit"] and a["ortu"] and "Maç hesaplanıyor" in a["yazi"] and a["cizim"] == 0
            and not a["tepe"] and not a["kart"], str(a))
    await pg.keyboard.press("KeyT")
    tel = await pg.evaluate("() => MAC_TELEFON.acik")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_function("() => document.querySelector('#macHesap .ms-hesapAlt').textContent.includes('Duraklatıldı') || MAC_SONU.acik", timeout=10000)
    k1 = await pg.evaluate("() => ({ kare: mac.kare || 0, yazi: document.getElementById('macHesap').textContent, kart: MAC_SONU.acik })")
    await pg.wait_for_timeout(1000)
    k2 = await pg.evaluate("() => ({ kare: mac.kare || 0, kart: MAC_SONU.acik })")
    await pg.keyboard.press("KeyP")
    await pg.wait_for_function(f"() => (mac.kare || 0) > {k2['kare']} || MAC_SONU.acik", timeout=20000)
    denetle("H2-a: perde açıkken T telefonu açmıyor; P ile örtü 'Duraklatıldı' der ve 1 sn sonra maçın karesi aynı; ikinci P ile hesap sürüyor",
            not tel and not k1["kart"] and "Duraklatıldı" in k1["yazi"] and k2["kare"] == k1["kare"], f"{k1} → {k2}")
    await pg.wait_for_selector("#macSonu:not([hidden]) [data-eylem='odayaDon']", timeout=240000)
    sure = time.time() - t0
    s = await pg.evaluate("""() => ({ sonuc: JSON.stringify(MAC_SONU.sonuc), skor: MAC_SONU.sonuc.skor.join('–'), kart: document.querySelector('#macSonu .ms-skor').textContent,
      ka: window.__ka, kip: MAC_ARKA.kip, ortu: !document.getElementById('macHesap').hidden, cizim: renderer.info.render.frame,
      obur: LIG_CANLI.filter(x => x.m && x.m.phase === 'fulltime').length })""")
    denetle("H2-a: kart skorla açıldı; karar anı hiç açılmadı; örtü kalktı; sayfa hiç çizilmedi (file://, ana iplik)",
            s["skor"] in s["kart"] and not s["ka"] and not s["ortu"] and s["cizim"] == 0 and s["kip"] == "anaIs",
            f"Maçı izleme → kart {sure:.1f} sn (file://, duraklatma ~1 sn dahil) · kart açılırken biten öbür maç {s['obur']}/7 · {s['skor']}")
    await pg.screenshot(path=str(ARAC / "son-akis-19b-kart.png"))
    belir = await pg.evaluate("() => document.getElementById('macSonu').classList.contains('ms-belir')")
    denetle("U4: maç sonu kartı belirme geçişiyle açıldı (ms-belir)", belir)
    await pg.evaluate(BITIR_CASUS_JS)
    t1 = time.time()
    await pg.click("#macSonu [data-eylem='odayaDon']")
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=240000)
    sure2 = time.time() - t1
    o = await pg.evaluate(f"""() => {{ const k = OYUN.kariyer; return {{ n: Object.keys(k.maclar).length, biz: k.maclar['{id13}'].skor.join('–'), an: k.tarih + ' ' + k.gunIciDakika,
      O: sezonTablosu(k).every(t => t.O === 13), protokol: k.maclar['{id13}'].protokol }}; }}""")
    casus = await pg.evaluate("() => sessionStorage.getItem('h2aBitir')")
    denetle("H2-a: Odaya dön sekiz sonucu yazdı (bizim maç kartın skoru, protokol null); oda Cumartesi 21:00; 16 kulüp 13 maç; ligCanliBitir çağrılmadı",
            o["n"] == 8 and o["biz"] == s["skor"] and o["an"] == "2026-11-28 1260" and o["O"] and o["protokol"] is None and casus is None, f"Odaya dön {sure2:.1f} sn · {o}")
    # aynı kayıttan Stada git → Beklemeden geç → Maça geç → sonuna dek izlenen maç (×16) birebir aynı sonuç kaydı
    await pg.evaluate("(k) => localStorage.setItem('chairman:oyun-1', k)", kayit0)
    await pg.goto(pg.url.split("?")[0])
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=60000)
    await pg.click(".od-alt .od-ana")
    await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=60000)
    await pg.click("#btnBeklemedenGec")
    await pg.wait_for_function("() => !ON_EKRAN.acik", timeout=30000)
    await pg.evaluate("document.getElementById('btnMacaGec').click()")
    son = None
    for _ in range(60):
        son = await pg.evaluate(SONA_JS, 600)
        if son["faz"] == "fulltime":
            break
    izl = await pg.evaluate("() => ({ kayit: JSON.stringify(mac.sonucKaydi()), skor: mac.score.join('–'), mac: MAC_GUNU.macId })")
    denetle("H2-a: 'Maçı izleme'nin sonucu aynı kayıttan Stada git → Beklemeden geç → Maça geç → sonuna dek izlenen maçınkiyle birebir",
            son and son["faz"] == "fulltime" and izl["mac"] == id13 and izl["kayit"] == s["sonuc"], f"izlenen {izl['skor']} · izlemesiz {s['skor']}")
    await pg.context.close()
    # hükmen: Demirkapı'nın 12 oyuncusu sakat (kopyala-yaz, kayıtlı) → Maçı izleme → kart hemen hükmen 0–3 (perde açılmaz)
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await oda_ilerle(pg)
    await pg.evaluate("""() => oyunKomut(x => { const L = kulupOyunculari(x, 'demirkapi'), y = {};
      L.slice(0, 12).forEach(p => { y[p.id] = Object.assign({}, p, { sakat: { neden: 'deneme', donus: '2027-06-01' } }); }); x.oyuncular = Object.assign({}, x.oyuncular, y); })""")
    await oda_yenile(pg)
    t2 = time.time()
    await pg.click('.od-alt [data-eylem="yapIzlemesiz"]')
    await pg.wait_for_selector("#macSonu:not([hidden]) [data-eylem='odayaDon']", timeout=60000)
    sure3 = time.time() - t2
    h = await pg.evaluate("""() => ({ hukmen: !!MAC_GUNU.hukmen, skor: MAC_SONU.sonuc.skor.join('–'), perde: HIZLI_BITIR.perde, kart: document.getElementById('macSonu').textContent,
      serit: document.getElementById('baskanDugmeleri').hidden, ortu: !document.getElementById('macHesap').hidden })""")
    denetle("H2-a: hükmen: 'Maçı izleme' kartı hemen hükmen 0–3 ile açtı (perde ve örtü yok, şerit gizli)",
            h["hukmen"] and h["skor"] == "0–3" and not h["perde"] and not h["ortu"] and h["serit"] and "hükmen" in h["kart"], f"{sure3:.1f} sn · {h['skor']}")
    await pg.context.close()


async def bolum_21(tarayici, site, tum_hatalar):
    """H2-c: kişiye yazmak ve görüşme isteği — Görüşelim → İlerle (karar) → telefonda tek kart (Kabul et / Şu gün olsun, U3) → defterde randevu →
    İlerle randevuda durur → Katıl → Öğrendiklerin; Şu gün olsun; Duraklat'ta öneriler kapalı. U3: bekleme notu, bağlam şeridi, göz atma, Sonra yığını."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    hid = await pg.evaluate("() => OYUN.kariyer.kulupler.demirkapi.hocaId")
    async def konusma_ac():
        await pg.keyboard.press("Digit1")
        await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
        await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{hid}"]')
    # Duraklat'ta öneriler kapalı
    await pg.click(".od-duraklat")
    await konusma_ac()
    await konu_menu_ac(pg)
    dur = await pg.evaluate("() => [...document.querySelectorAll('.tlf-is .tlf-konu')].map(b => b.disabled)")
    await masaya_don(pg)
    await pg.click(".od-duraklat")
    denetle("H2-c: Duraklat açıkken konu önerileri kapalı", len(dur) > 0 and all(dur), str(dur))
    await konusma_ac()
    await konu_sec(pg, "yaz.teknikDirektor.gorusme")
    bekle = await pg.evaluate("""() => ({ satir: [...document.querySelectorAll('.tlf-is .tlf-bekleme')].map(x => x.textContent), tel: document.querySelectorAll('.tel .tel-bekleme').length,
      yeni: !!(document.querySelector('.tel-yeniKonu button') || {}).disabled, panel: (document.querySelector('.tlf-is') || {}).innerText || '' })""")
    denetle("R2-c: soru gidince iş panelinin üstünde bir kez “Şükrü Hoca'dan cevap bekleniyor.” ve yaklaşık anı; telefonda ayrıca not yok; R2 eki: “Yeni konu aç” kapalı, engel yazısı tekrarlanmıyor",
            len(bekle["satir"]) == 1 and bekle["satir"][0].startswith("Şükrü Hoca'dan cevap bekleniyor.") and bekle["satir"][0].endswith("civarı.") and bekle["tel"] == 0
            and bekle["yeni"] and "cevabını bekliyorsun" not in bekle["panel"], str(bekle))
    await masaya_don(pg)
    await oda_ilerle(pg)
    await pg.wait_for_function("() => Object.values(OYUN.kariyer.isler).some(x => x.veri && x.veri.karar === 'gorusmeOnerisi')", timeout=60000)
    ozet = await pg.text_content(".od-mesaj")
    # U3: Sonra yığını — masada cevap bekleyen karar kâğıdı; dokununca kararın yeri (soranın konuşması) açılır
    sonra = await pg.evaluate("() => [...document.querySelectorAll('.od-sonra .od-sonraKagit')].map(b => b.textContent)")
    await pg.click(".od-sonra .od-sonraKagit")
    syer = await pg.evaluate("() => ({ ekran: (document.querySelector('.tel-ekran') || { dataset: {} }).dataset.ekran, kart: !!document.querySelector('.tlf-is .kk-kart') })")
    await masaya_don(pg)
    denetle("U3: masada “Sonra” yığınında görüşme kâğıdı (son cevap ve yeri: telefonda); dokununca telefonda o konuşma ve kartı açıldı",
            len(sonra) == 1 and "Görüşme: Şükrü Hoca" in sonra[0] and "telefonda" in sonra[0] and syer == {"ekran": "konusma", "kart": True}, f"{sonra} · {syer}")
    kart = await pg.evaluate("() => { const x = Object.values(OYUN.kariyer.isler).find(y => y.veri && y.veri.karar === 'gorusmeOnerisi'); return { id: x.id, tarih: x.veri.oneri.tarih, dakika: x.veri.oneri.dakika }; }")
    await konusma_ac()
    kenar = await pg.eval_on_selector_all(".tlf-is .kk-kenar", "L => L.map(b => b.textContent)")
    denetle("H2-c: Görüşelim → İlerle cevapta karar diye durdu; telefonda tek kart, kenarlar “Kabul et” / “Şu gün olsun” (U3; altında bizim saat)",
            "karar" in ozet and len(kenar) == 2 and "Kabul et" in kenar[0] and "Şu gün olsun" in kenar[1], f"{ozet[:70]} · {kenar} · {kart}")
    await pg.screenshot(path=str(ARAC / "son-akis-21-kart.png"))
    # R2 eki: bağlam cevabın yüzünde: nötr yüzde şerit ve cevap yok; → ile önizleyince bizim saatimizin günü (işaretli şerit) ve ipucunda Enter'ın cevabı;
    # telefonda göz atma kâğıdı yok; Esc önizlemeyi bırakır, konuşma yerinde
    BAGLAM_JS = """() => { const t = document.querySelector('.tlf-is .kk-kart'), y = t && t.querySelector('.kk-yuz'), sr = y && y.querySelector('.kk-serit');
      return { var: !!sr, baslik: sr ? sr.getAttribute('aria-label') : '', isaret: y ? y.textContent : '',
        yuz: t ? t.dataset.yuz : null, ipucu: (document.querySelector('.tlf-is .kk-ipucu p') || {}).textContent || '', goz: !!document.querySelector('aside.odk-goz'),
        gozAt: document.querySelectorAll('.tlf-is [data-eylem="gozAt"]').length, serit: document.querySelectorAll('.tlf-is .kk-serit').length,
        ekran: (document.querySelector('.tel-ekran') || { dataset: {} }).dataset.ekran }; }"""
    bg0 = await pg.evaluate(BAGLAM_JS)
    await pg.focus('.tlf-is .kk-kart')
    await pg.keyboard.press("ArrowRight")
    bg1 = await pg.evaluate(BAGLAM_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-21-baglam.png"))
    await pg.keyboard.press("Escape")
    bg2 = await pg.evaluate(BAGLAM_JS)
    denetle("R2 eki: nötr yüzde bağlam ve cevap yok; → önizlemesinde 'Şu gün olsun' yüzü ve o günün işaretli şeridi, ipucunda Enter'ın cevabı; göz atma kâğıdı yok; Esc önizlemeyi bırakır, konuşma yerinde",
            not bg0["var"] and bg0["yuz"] == "notr" and bg0["gozAt"] == 0 and "Şu gün olsun" not in bg0["isaret"] and "Kabul et" not in bg0["isaret"]
            and bg1["var"] and bg1["yuz"] == "sag" and "işaretli" in bg1["baslik"] and "Şu gün olsun" in bg1["isaret"] and bg1["ipucu"].startswith("Enter: Şu gün olsun") and not bg1["goz"]
            and bg2["yuz"] == "notr" and not bg2["var"] and bg2["ekran"] == "konusma", f"{bg0} · {bg1} · {bg2}")
    await pg.focus('.tlf-is .kk-kart')
    await pg.keyboard.press("ArrowLeft")
    await pg.keyboard.press("Enter")
    await pg.wait_for_function("() => Object.values(OYUN.kariyer.isler).some(x => x.veri && x.veri.etki === 'ekipGorusmesi')", timeout=10000)
    await masaya_don(pg)
    await odak_ac(pg, "ajanda")
    await pg.wait_for_selector(".dft", timeout=10000)
    await pg.click(f'[data-eylem="gun"][data-tarih="{kart["tarih"]}"]')
    dft = await pg.text_content(".dft")
    await pg.keyboard.press("Escape")
    denetle("H2-c: kartı sola bırakmak (←, Enter) kabul eder: defterde öneri gününde “Görüşme: Şükrü Hoca”", "Görüşme: Şükrü Hoca" in dft, dft[dft.find("Görüşme"):][:60] if "Görüşme" in dft else dft[:80])
    for _ in range(6):
        if await pg.evaluate(f"() => OYUN.kariyer.tarih === '{kart['tarih']}' && OYUN.kariyer.gunIciDakika === {kart['dakika']}"):
            break
        await oda_ilerle(pg)
    # randevuya katıl: defterde işe dokunmak onu seçer, alt şeritte "Katıl ▸" (onay adımı varsa "Onayla ▸")
    rv = await pg.evaluate("() => Object.values(OYUN.kariyer.isler).find(x => x.veri && x.veri.etki === 'ekipGorusmesi').id")
    await odak_ac(pg, "ajanda")
    await pg.wait_for_selector(".dft", timeout=10000)
    await pg.click(f'.dft [data-is="{rv}"]:not([data-eylem])')
    katil = await pg.text_content(".od-ana")
    await pg.click(".od-ana")
    if await pg.query_selector('.od-ana[data-eylem="yap"]:has-text("Onayla")'):
        await pg.click(".od-ana")
    await pg.keyboard.press("Escape")
    try:
        await pg.wait_for_function("() => OYUN.kariyer.gecmis.some(g => g.tur === 'is' && g.sonuc && g.sonuc.durum === 'yapildi' && /ile görüştün/.test(g.sonuc.bilgi || ''))", timeout=20000)
    except Exception:
        print("  (tanı) " + str(await pg.evaluate("""() => ({ an: OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika, ana: (document.querySelector('.od-ana') || {}).textContent,
          mesaj: (document.querySelector('.od-mesaj') || {}).textContent, isler: Object.values(OYUN.kariyer.isler).filter(x => x.tur === 'ajanda').map(x => x.id + ' ' + x.tarih + ' ' + x.dakika + ' ' + x.veri.baslik),
          son: OYUN.kariyer.gecmis.slice(-3).map(g => g.tur + ' ' + (g.isTuru || '') + ' ' + JSON.stringify(g.sonuc || {}).slice(0, 120)) })""")) + f" · katıl düğmesi: {katil}")
    await odak_ac(pg, "ajanda")
    await pg.wait_for_selector(".dft", timeout=10000)
    await pg.click(f'.dft [data-is="{rv}"]:not([data-eylem])')   # geçmiş kayda dokununca ayrıntı: "Öğrendiklerin"
    dft2 = await pg.text_content(".dft")
    await pg.keyboard.press("Escape")
    denetle("H2-c: İlerle randevuda durdu (alt şeritte Katıl), Katıl → defterde öğrendiklerin (“… ile görüştün”)", "Katıl" in katil and "ile görüştün" in dft2, dft2[dft2.find("görüştün") - 40:][:100] if "görüştün" in dft2 else dft2[:80])
    await pg.context.close()
    # U3 Şu gün olsun: kart sağa (→, Enter) — bizim saatimize randevu, karşı taraf hemen kabul eder
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await konusma_ac()
    await konu_sec(pg, "yaz.teknikDirektor.gorusme")
    await masaya_don(pg)
    await oda_ilerle(pg)
    await pg.wait_for_function("() => Object.values(OYUN.kariyer.isler).some(x => x.veri && x.veri.karar === 'gorusmeOnerisi')", timeout=60000)
    await konusma_ac()
    oneri2 = await pg.evaluate("() => { const x = Object.values(OYUN.kariyer.isler).find(y => y.veri && y.veri.karar === 'gorusmeOnerisi'); return anDakika(x.veri.oneri.tarih, x.veri.oneri.dakika); }")
    await pg.focus('.tlf-is .kk-kart')
    await pg.keyboard.press("ArrowRight")
    await pg.keyboard.press("Enter")
    await pg.wait_for_function("() => !Object.values(OYUN.kariyer.isler).some(x => x.veri && x.veri.karar === 'gorusmeOnerisi')", timeout=10000)
    b = await pg.evaluate("""() => { const r = Object.values(OYUN.kariyer.isler).find(x => x.veri && x.veri.etki === 'ekipGorusmesi');
      return { randevu: r ? anDakika(r.tarih, r.dakika) : null, giden: [...document.querySelectorAll('.tel .tel-giden')].map(e => e.textContent).join(' | '),
        gelen: [...document.querySelectorAll('.tel .tel-gelen')].map(e => e.textContent).pop() || '' }; }""")
    denetle("U3: kartı sağa bırakmak “Şu gün olsun”: kart kalkar, bizim saatimize randevu (önerisinden önce), konuşmada giden cevap ve “Olur başkanım, görüşelim.”",
            bool(b["randevu"]) and b["randevu"] < oneri2 and "Şu gün olsun: " in b["giden"] and "Olur başkanım, görüşelim." in b["gelen"], f"{b} · öneri {oneri2}")
    await pg.context.close()
    # H2-d: müdüre “Kasa ne durumda?” → cevap telefonda
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    mid = await pg.evaluate("() => personelKisisi(OYUN.kariyer, 'maliMudur').id")
    # inceleme (H2-e): biriken raporlarda “yeni” yalnız en yenisidir; dosya onu açar ve birikenler görüldü sayılır, rozet söner
    await pg.evaluate("() => oyunKomut(k => { maliRaporBirak(k, 'demirkapi', 'haftalik'); maliRaporBirak(k, 'demirkapi', 'aylik'); })")
    await pg.keyboard.press("Digit2")
    await pg.keyboard.press("Escape")
    await pg.wait_for_timeout(200)
    r1 = await pg.evaluate("() => { const b = document.querySelector('.od-nesne[data-panel=\"dosya\"] .od-rozet'); return b ? b.textContent : ''; }")
    await pg.keyboard.press("Digit3")
    await pg.wait_for_selector(".dsy", timeout=10000)
    r2 = await pg.evaluate("() => ({ baslik: [...document.querySelectorAll('.dsy .dsy-baslik')].map(x => x.textContent).join(' | '), gorulmedi: maliRaporlari(OYUN.kariyer).filter(x => !x.h.gorulen).length })")
    await pg.keyboard.press("Escape")
    r3 = await pg.evaluate("() => { const b = document.querySelector('.od-nesne[data-panel=\"dosya\"] .od-rozet'); return b ? b.textContent : ''; }")
    denetle("İnceleme (H2-e): üç görülmemiş raporda dosya “yeni”; 3 en yeni raporu (aylık) açar, birikenler görüldü sayılır, kapatınca rozet söner",
            r1 == "yeni" and "Aylık mali rapor" in r2["baslik"] and r2["gorulmedi"] == 0 and r3 == "", f"{r1} · {r2} · {r3!r}")
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{mid}"]')
    await konu_sec(pg, "yaz.maliMudur.kasa")
    odak = await pg.evaluate("() => { const a = document.activeElement; return { tel: !!(a && a.closest('.tel')), ad: a ? (a.className || a.tagName) : '', duyuru: (document.getElementById('kartDuyuru') || {}).textContent || '' }; }")
    await pg.wait_for_timeout(150)
    duy = await pg.evaluate("() => (document.getElementById('kartDuyuru') || {}).textContent || ''")
    denetle("İnceleme (H2-e): kişiye yazınca odak telefonda kalır ve gönderildiği duyurulur", odak["tel"] and "Mesaj gitti" in duy, f"{odak} · {duy}")
    await masaya_don(pg)
    await oda_ilerle(pg)
    await pg.wait_for_function("() => OYUN.kariyer.gecmis.some(g => g.sonuc && g.sonuc.yazisma && g.sonuc.yazisma.konu === 'kasa')", timeout=60000)
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{mid}"]')
    kmet = await pg.text_content(".tel")
    denetle("H2-d: müdüre “Kasa ne durumda?” → cevap telefonda (kasadaki para, 90 günün en düşüğü, maaş yükü)", "Kasada" in kmet and "Aylık maaş yükü" in kmet and "Pazartesi özetinde" in kmet, kmet[kmet.find("Kasada"):][:120] if "Kasada" in kmet else kmet[:100])
    await pg.context.close()
    # H2-d: sürüm 9 kaydı (Ocak, açık gelen teklifle) tarayıcıda geçişle açılır
    ocak = (ARAC / "ornekler" / "kayit-s9-ocak.json").read_text(encoding="utf-8")
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script("""(m => { if (!sessionStorage.getItem('__s9')) { sessionStorage.setItem('__s9', '1'); localStorage.setItem('chairman:oyun-1', m); } })(""" + json.dumps(ocak) + ")")
    pg = await baglam.new_page()
    pg.on("pageerror", lambda e: tum_hatalar.append("Betik hatası: " + str(e)))
    await pg.goto((site / "index.html").as_uri() + loca(""))
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=30000)
    s9 = await pg.evaluate("""() => { const k = OYUN.kariyer, t = Object.values(k.isler).find(x => x.veri && x.veri.karar === 'teklifKarari');
      return { surum: k.kayitSurumu, guncel: KARIYER_SURUM, bozuk: !!document.querySelector('.od-bozuk'), roller: konusmaListesi(k).map(c => c.kisi.rol).sort().join(','), teklif: !!t,
        secenek: t ? kararSecenekleri(k, t).map(s => s.id).join(',') : '', rapor: Object.values(k.isler).some(x => x.tur === 'maliRapor') }; }""")
    denetle("H2-d: sürüm 9 Ocak kaydı geçişle açılır: oda hatasız, kayıt sürümü güncel (KARIYER_SURUM); telefonda hoca, yardımcı ve müdür; gelen teklif kartı iki cevapla yerinde; mali rapor işi kaydın anında",
            s9["surum"] == s9["guncel"] and not s9["bozuk"] and "maliMudur" in s9["roller"] and "yardimciAntrenor" in s9["roller"] and "teknikDirektor" in s9["roller"] and s9["teklif"] and s9["secenek"] == "sat,reddet" and s9["rapor"], str(s9))
    # inceleme (H2-e): masadan açılışta cevap bekleyen konu, seçili açık konunun önündedir
    SECILI_JS = "() => { const b = document.querySelector('.dsy-sekme[aria-selected=\"true\"][data-mesele]'); const m = b && OYUN.kariyer.meseleler[b.dataset.mesele]; return m ? m.id + ':' + m.durum : ''; }"
    await pg.keyboard.press("Digit3")
    await pg.wait_for_selector(".dsy", timeout=10000)
    s1 = await pg.evaluate(SECILI_JS)
    obur = await pg.evaluate("() => { const b = [...document.querySelectorAll('.dsy-sekme[data-mesele]')].find(x => x.getAttribute('aria-selected') !== 'true'); return b ? b.dataset.mesele : null; }")
    s2 = ""
    if obur:
        await pg.click(f'.dsy-sekme[data-mesele="{obur}"]')
        await pg.keyboard.press("Escape")
        await pg.keyboard.press("Digit3")
        await pg.wait_for_selector(".dsy", timeout=10000)
        s2 = await pg.evaluate(SECILI_JS)
    await pg.keyboard.press("Escape")
    denetle("İnceleme (H2-e): Ocak kaydında dosya karar bekleyen konuyla açılır; öbür açık konu seçilip kapatılınca masadan yine karar bekleyen konu açılır",
            s1.endswith(":kararBekliyor") and (obur is None or s2 == s1), f"{s1} · öbür {obur} · {s2}")
    await oda_ilerle(pg)
    await pg.keyboard.press("Digit3")
    await pg.wait_for_selector(".dsy", timeout=10000)
    rs = await pg.text_content(".dsy-sekmeler")
    denetle("H2-d: ilk İlerle'den sonra dosyada “Raporlar (1)”", "Raporlar (1)" in rs, rs[:120])
    # inceleme (H2-e): büyük yazıda, 672 px'te (640 px kare) iki açık konu, Raporlar, Arşiv ve Kapat: sekmeler birbirinin üstüne binmez, sayaçlı sekmenin yazısı kutusunda
    await pg.keyboard.press("Escape")
    await pg.set_viewport_size({"width": 672, "height": 600})
    await ayar_yazi(pg, "buyuk")
    await pg.keyboard.press("Digit3")
    await pg.wait_for_selector(".dsy", timeout=10000)
    sk = await pg.evaluate("""() => { const B = [...document.querySelectorAll('.dsy-sekmeler > button')], r = B.map(b => b.getBoundingClientRect());
      return { n: B.length, binme: r.slice(1).map((x, i) => Math.round(r[i].right - x.left)).filter(v => v > 1),
        tasan: B.filter(b => b.matches('.dsy-kadroSekme, .dsy-raporSekme, .dsy-arsivSekme, .od-kapat') && b.scrollWidth > b.clientWidth + 1).map(b => b.textContent) }; }""")
    await pg.screenshot(path=str(ARAC / "son-akis-21-sekmeler-dar.png"))
    denetle("İnceleme (H2-e): büyük yazı ve 672 px'te dosya şeridinde sekmeler üst üste binmez, Raporlar ve Arşiv yazısı kutusunda (konu başlıkları kısalır)",
            sk["n"] >= 5 and not sk["binme"] and not sk["tasan"], str(sk))
    # inceleme (H2-e): hocaya sabır verilince o konu açık ama karar beklemiyor; o seçiliyken dosya kapatılıp masadan açılınca karar bekleyen teklif önde
    await pg.keyboard.press("Escape")
    sb = await pg.evaluate("""() => { const k = OYUN.kariyer, is = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.karar && /sabır/i.test((k.meseleler[x.veri.meseleId] || {}).baslik || ''));
      if (!is) return null; const s = kararSecenekleri(k, is).find(x => /sab/i.test(x.id + ' ' + x.metin)); if (!s) return null;
      oyunKomut(x => ajandaIsiYap(x, is.id, s.id)); const k2 = OYUN.kariyer; return { p12: is.veri.meseleId, durum: k2.meseleler[is.veri.meseleId].durum }; }""")
    await pg.keyboard.press("Digit2")
    await pg.keyboard.press("Escape")
    s3 = s4 = ""
    if sb:
        await pg.keyboard.press("Digit3")
        await pg.wait_for_selector(".dsy", timeout=10000)
        await pg.click(f'.dsy-sekme[data-mesele="{sb["p12"]}"]')
        s3 = await pg.evaluate(SECILI_JS)
        await pg.keyboard.press("Escape")
        await pg.keyboard.press("Digit3")
        await pg.wait_for_selector(".dsy", timeout=10000)
        s4 = await pg.evaluate(SECILI_JS)
    denetle("İnceleme (H2-e): sabırdan sonra açık hoca konusu seçiliyken dosya kapatılıp masadan açılınca karar bekleyen teklif açılır (Claude kararı 17: karar öndedir)",
            bool(sb) and sb["durum"] != "kararBekliyor" and s3.startswith(sb["p12"] + ":") and s4.endswith(":kararBekliyor") and not s4.startswith(sb["p12"] + ":"), f"{sb} · {s3} → {s4}")
    await baglam.close()


async def bolum_20(tarayici, site, tum_hatalar):
    """G1-e: “Maçı bitir” anında — oyun http'den açılır (Web Worker): öbür maçlar ve bizim maçın sonuç ikizi işçide; kart hemen; Odaya dön sekiz sonuç.
    H2-a: rakip başkan kariyerde yok (yeniden yükleme yok); TEST “Maçı izleme” (perde, yarış; sonuç ikiz ve canlı maçla aynı); işçiler bitmeden basılan
    Maçı bitir'de örtü ve yarış; kart açıldıktan sonra işçi düşerse donma yok, Odaya dön ligCanliBitir'siz biter."""
    import socket
    import subprocess
    import time
    three = kontrol.yerel_three()
    shutil.copy(three, site / "three-yerel.js")
    (site / "index-http.html").write_text((site / "index.html").read_text(encoding="utf-8").replace(three.as_uri(), "three-yerel.js"), encoding="utf-8")
    port = 8766
    sunucu = subprocess.Popen([sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1", "--directory", str(site)],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for _ in range(100):
            try:
                socket.create_connection(("127.0.0.1", port), 0.2).close()
                break
            except OSError:
                await asyncio.sleep(0.1)
        kok = f"http://127.0.0.1:{port}/index-http.html"

        async def oda_sayfasi():
            baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
            pg = await baglam.new_page()
            pg.on("pageerror", lambda e: tum_hatalar.append("Betik hatası (20): " + str(e)))
            pg.on("console", lambda m: tum_hatalar.append("Konsol (20): " + m.text)
                  if m.type == "error" and "Failed to load resource" not in m.text else None)
            await pg.goto(kok + "?dunya=7")
            await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=30000)
            await oda_ilerle(pg)
            return baglam, pg

        # H2-a: kariyerde rakip başkan yok; eskiden &rakipBaskan=yok ile yeniden yüklenirdi
        async def mac_sayfasi(bekle=True):
            baglam, pg = await oda_sayfasi()
            await pg.click(".od-ana")
            await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=60000)
            t0 = time.time()
            if bekle:
                await pg.wait_for_function("() => MAC_ARKA.kip !== 'isci' || (MAC_ARKA.ikiz && MAC_ARKA.ikiz.son && LIG_CANLI.every(x => x.son))", timeout=120000)
            return baglam, pg, time.time() - t0

        baglam, pg, hazir = await mac_sayfasi()
        e = await pg.evaluate("""() => { const R = LIG_CANLI.map(y => arkaMacOynat(Match, y.d.secenek, {})), Z = arkaMacOynat(Match, Object.assign({}, MAC_SECENEK, { tohum: mac.tohum }), { oncesi: true });
          return { kip: MAC_ARKA.kip, hata: MAC_ARKA.hata, n: MAC_ARKA.havuz.length, son: LIG_CANLI.filter(y => y.son).length, motorYok: LIG_CANLI.every(y => !y.m),
            obur: LIG_CANLI.every((y, i) => JSON.stringify(R[i].son) === JSON.stringify(y.son) && JSON.stringify(R[i].ornekler) === JSON.stringify(y.ornekler)),
            ikiz: JSON.stringify(Z.son) === JSON.stringify(MAC_ARKA.ikiz.son), ikizKayit: JSON.stringify(MAC_ARKA.ikiz.son), rakip: MAC_GUNU.protokol && MAC_GUNU.protokol.rakipBaskan,
            skorlar: LIG_CANLI.map((y, i) => [y.d.macId, R[i].son.skor.join('-')]) }; }""")
        denetle("G1-e: http'de işçi kipi; öbür yedi maç ve bizim maçın sonuç ikizi işçide, maç öncesinde bitti; sayfada öbür maç motoru yok; işçinin yedi sonucu ve örnekleri ana iplikteki aynı hesapla (arkaMacOynat) birebir; H2-a: rakip başkan yok",
                e["kip"] == "isci" and e["n"] >= 1 and e["son"] == 7 and e["motorYok"] and e["obur"] and e["ikiz"] and e["rakip"] == "yok", f"{hazir:.1f} sn · {e['n']} işçi · {e['hata']}")
        await pg.click("#btnBeklemedenGec")
        await pg.wait_for_function("() => !ON_EKRAN.acik", timeout=30000)
        await pg.evaluate("document.getElementById('btnMacaGec').click()")
        # H2-b: sınır 60 → 240 sn (dizüstünde doğal maç öncesi 60 sn'de santraya varmıyor; bekleme sınırı, hız ölçümü değil)
        await pg.wait_for_function("() => !MAC_ONCESI.includes(mac.phase) && MAC_ARKA.T0 !== null", timeout=240000)
        await pg.wait_for_timeout(2500)
        await pg.evaluate("() => MAC_TELEFON.ac()")
        await pg.evaluate("() => document.querySelector('#macTelefon [data-eylem=telUyg][data-uyg=skor]').click()")
        satirlar = await pg.evaluate("() => [...document.querySelectorAll('#macTelefon .tel-mac')].map(e => e.textContent)")
        # H2-b, R3 (http, işçi): öbür maçın sayfası işçinin bitmiş kaydının o örneğe kadarki önekinden (arkaMacAnlik + arkaMacDurum)
        iid = await pg.evaluate("() => { const b = [...document.querySelectorAll('#macTelefon [data-eylem=csAc][data-tur=mac]')].find(x => x.dataset.id !== MAC_GUNU.macId); if (!b) return null; b.click(); return b.dataset.id; }")
        ia = await pg.evaluate(ISCI_SAYFA_JS, iid)
        if iid:
            await pg.evaluate("() => document.querySelector('#macTelefon [data-eylem=csBolum][data-bolum=ist]').click()")
        ia.update(await pg.evaluate(ISCI_IST_JS, iid))
        dakikali = [s for s in satirlar[1:] if re.search(r"\d+'", s)]
        denetle("G1-e: santradan sonra Canlı Skor'da öbür yedi maç işçinin örneklerinden dakikasıyla", len(satirlar) == 8 and len(dakikali) == 7, " | ".join(satirlar[:3]))
        denetle("H2-b, R3 (http, işçi): santradan ~2,5 sn sonra öbür maçın sayfası arkaMacAnlik(x.son, arkaMacDurum(…)) ile aynı (Özet'in gol satırları, İstatistikler'in 10 satırı); tabloda 'Beklenen gol'",
                ia["gol"] and ia["tablo"] and ia["beklenen"], str(ia))
        # B44 (H2-e'nin “telefon açıkken Maçı bitir”i): telefon açıkken basılır; telefon kapanır, perde ve kart telefonun altında kalmaz
        tel_acik = await pg.evaluate("() => MAC_TELEFON.acik")
        t1 = time.time()
        await pg.evaluate("() => document.getElementById('btnHizliBitir').click()")
        tel_sonra = await pg.evaluate("() => ({ acik: MAC_TELEFON.acik, gizli: document.getElementById('macTelefon').hidden })")
        denetle("B44 (H2-e): telefon açıkken Maçı bitir'e basınca telefon kapanır (perde ve kart telefonun altında kalmaz)", tel_acik and tel_sonra == {"acik": False, "gizli": True}, f"{tel_acik} → {tel_sonra}")
        await pg.wait_for_selector("#macSonu:not([hidden]) [data-eylem='odayaDon']", timeout=60000)
        sure = time.time() - t1
        k = await pg.evaluate("""() => ({ anlik: HIZLI_BITIR.anlik, kart: document.querySelector('#macSonu .ms-skor').textContent, skor: HIZLI_BITIR.sonuc.skor.join('–'),
          ayni: JSON.stringify(MAC_SONU.sonuc) === JSON.stringify(HIZLI_BITIR.sonuc) && JSON.stringify(HIZLI_BITIR.sonuc) === JSON.stringify(MAC_ARKA.ikiz.son),
          tabela: TABELA.yazi, dugme: document.getElementById('btnHizliBitir').hidden, test: (document.querySelector('#macSonu .ms-test') || {}).textContent || '' })""")
        denetle("G1-e: işçiler bittikten sonra 'Maçı bitir' kartı hemen açtı (anlık dal: sonuç ikizinin kopyası HIZLI_BITIR.sonuc); tabela maç sonu; düğme gizli",
                k["anlik"] and k["skor"] in k["kart"] and k["ayni"] and k["tabela"] == "MAÇ SONU" and k["dugme"] and sure <= 5, f"{sure:.1f} sn · {k['kart'].strip()} · {k['test'][:80]}")
        await pg.screenshot(path=str(ARAC / "son-akis-20-kart.png"))
        # S-d: kart (ve Maçı bitir perdesi) açıkken maç telefonu açılmaz; denetim için iki kilit bir anlığına kaldırılıp telefonun Puan durumu okunur (maç sonu, sekiz skor)
        mt = await pg.evaluate("""() => { const s = ON_EKRAN.sayfa, p = HIZLI_BITIR.perde; ON_EKRAN.sayfa = null; HIZLI_BITIR.perde = false;
          MAC_TELEFON.T.ekran = 'skor'; MAC_TELEFON.T.skorSekme = 'tablo'; MAC_TELEFON.T.sayfalar = []; MAC_TELEFON.ac(); ON_EKRAN.sayfa = s; HIZLI_BITIR.perde = p;
          const R = [...document.querySelectorAll('#macTelefon .tel-tablo tbody tr')].map(r => [...r.children].map(c => c.textContent).join('|')); MAC_TELEFON.kapat(); return R; }""")
        await pg.click("#macSonu [data-eylem='odayaDon']")
        await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=90000)
        o = await pg.evaluate("""() => { const k = OYUN.kariyer; return { n: Object.keys(k.maclar).length, biz: k.maclar['mac-2627-13-demirkapi-akdeniz'].skor.join('–'),
          skorlar: Object.entries(k.maclar).map(([id, s]) => [id, s.skor.join('-')]), O: sezonTablosu(k).every(t => t.O === 13) }; }""")
        obur = dict(o["skorlar"])
        denetle("G1-e: Odaya dön sekiz sonucu yazdı: bizim maç kartın skoru, öbürleri işçinin sonuçları; 16 kulüp 13 maç",
                o["n"] == 8 and o["biz"] == k["skor"] and all(obur.get(i) == s for i, s in e["skorlar"]) and o["O"], f"{o['biz']} · {o['n']} maç")
        ot = await pg.evaluate("() => sezonTablosu(OYUN.kariyer).map((t, i) => [i + 1, telKisaAd(t.ad), t.O, (t.AV > 0 ? '+' : '') + t.AV, t.P].join('|'))")
        denetle("S-d: maç bitince maç telefonundaki canlı tablo odadaki tabloyla birebir aynı (16 satır)", len(mt) == 16 and mt == ot, f"{mt[:2]} · {ot[:2]}")
        await baglam.close()
        # doğal biten maç: canlı motorun sonucu sonuç ikizininkiyle aynı (izlenen maç)
        baglam, pg, _ = await mac_sayfasi()
        d = await pg.evaluate("""() => { for (let i = 0; i < 60 * 60 * 90 && mac.phase !== 'fulltime'; i++) mac.step(1 / 60); arkaIkizKarsilastir(mac);
          return { ayni: MAC_ARKA.ikizAyni, skor: mac.score.join('-'), kayit: JSON.stringify(mac.sonucKaydi()) }; }""")
        denetle("G1-e: sonuna dek oynanan canlı maçın sonuç kaydı işçideki sonuç ikiziyle birebir", d["ayni"] is True and d["kayit"] == e["ikizKayit"], d["skor"])
        await baglam.close()
        # H2-a: TEST "Maçı izleme" (http): perde ilk kareden; sonuç ikiziyle yarış; kart T sn içinde; sonuç ikizle ve canlı maçla birebir
        baglam, pg = await oda_sayfasi()
        t2 = time.time()
        await pg.click('.od-alt [data-eylem="yapIzlemesiz"]')
        await pg.wait_for_url(re.compile(r"izle=0"), timeout=60000)
        await pg.wait_for_selector("#macSonu:not([hidden]) [data-eylem='odayaDon']", timeout=120000)
        sure2 = time.time() - t2
        await pg.wait_for_function("() => MAC_ARKA.kip !== 'isci' || (MAC_ARKA.ikiz && MAC_ARKA.ikiz.son)", timeout=120000)
        z = await pg.evaluate("""() => ({ sonuc: JSON.stringify(MAC_SONU.sonuc), ikiz: MAC_ARKA.ikiz && MAC_ARKA.ikiz.son ? JSON.stringify(MAC_ARKA.ikiz.son) : null, anlik: HIZLI_BITIR.anlik,
          kip: MAC_ARKA.kip, skor: MAC_SONU.sonuc.skor.join('–'), cizim: renderer.info.render.frame, serit: document.getElementById('baskanDugmeleri').hidden })""")
        denetle("H2-a: http'de 'Maçı izleme': kart açıldı; MAC_SONU.sonuc, işçinin sonuç ikizi ve aynı tohumla doğal oynanan canlı maçın kaydı birebir; sayfa hiç çizilmedi, şerit gizli",
                z["kip"] == "isci" and z["sonuc"] == z["ikiz"] == d["kayit"] and z["cizim"] == 0 and z["serit"],
                f"Maçı izleme → kart {sure2:.1f} sn (http) · kazanan yol: {'sonuç ikizi (anlık)' if z['anlik'] else 'ana iplik'} · {z['skor']} · kip {z['kip']} · ikiz {'var' if z['ikiz'] else 'yok'}"
                f" · sonuç=ikiz {z['sonuc'] == z['ikiz']} · sonuç=canlı {z['sonuc'] == d['kayit']} · çizim {z['cizim']} · şerit gizli {z['serit']}")
        await baglam.close()
        # H2-a: sayfa açılışından hemen sonra (işçiler bitmeden) basılan Maçı bitir: örtü görünür, kart yarışı kazanan yolun sonucuyla; sonra işçi düşer
        baglam, pg, _ = await mac_sayfasi(bekle=False)
        await pg.evaluate("() => { window.__ortu = false; setInterval(() => { if (!document.getElementById('macHesap').hidden) window.__ortu = true; }, 15); }")
        await pg.click("#btnBeklemedenGec")
        await pg.wait_for_function("() => !ON_EKRAN.acik", timeout=30000)
        t3 = time.time()
        b0 = await pg.evaluate("""() => { const o = { ikiz: !!(MAC_ARKA.ikiz && MAC_ARKA.ikiz.son), obur: LIG_CANLI.filter(x => x.son).length, faz: mac.phase };
          document.getElementById('btnHizliBitir').click(); return Object.assign(o, { perde: HIZLI_BITIR.perde }); }""")
        await pg.wait_for_selector("#macSonu:not([hidden]) [data-eylem='odayaDon']", timeout=120000)
        sure3 = time.time() - t3
        b1 = await pg.evaluate("() => ({ sonuc: JSON.stringify(MAC_SONU.sonuc), anlik: HIZLI_BITIR.anlik, ortu: window.__ortu, isciBekle: MAC_SONU.isciBekle })")
        denetle("H2-a: işçiler bitmeden maç öncesinde basılan Maçı bitir: perde açıldı, 'Maç hesaplanıyor' örtüsü göründü; kart yarışı kazanan yolun sonucuyla açıldı, sonuç ikiz ve canlı maçla aynı",
                b0["perde"] and (b1["ortu"] or b0["ikiz"]) and b1["sonuc"] == e["ikizKayit"] == d["kayit"],
                f"{sure3:.1f} sn · kazanan yol: {'sonuç ikizi (anlık)' if b1['anlik'] else 'ana iplik'} · basışta ikiz {'hazırdı' if b0['ikiz'] else 'hazır değildi'}, öbür maçlardan biten {b0['obur']}/7 · örtü {'göründü' if b1['ortu'] else 'görülmedi'}")
        g = await pg.evaluate("""async () => { let son = performance.now(), bosluk = 0, dur = false;
          const f = t => { bosluk = Math.max(bosluk, t - son); son = t; if (!dur) requestAnimationFrame(f); };
          requestAnimationFrame(f); await new Promise(r => setTimeout(r, 300));
          const kalan = LIG_CANLI.filter(x => !x.son).length; arkaDus('deneme');
          const t0 = performance.now(); while (performance.now() - t0 < 6000 && ligCanliSuruyor()) await new Promise(r => setTimeout(r, 100));
          await new Promise(r => setTimeout(r, 300)); dur = true;
          return { bosluk: Math.round(bosluk), kalan, kip: MAC_ARKA.kip, suruyor: ligCanliSuruyor(), motor: LIG_CANLI.filter(x => x.m).length }; }""")
        await pg.evaluate(BITIR_CASUS_JS)
        t4 = time.time()
        await pg.click("#macSonu [data-eylem='odayaDon']")
        await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=240000)
        sure4 = time.time() - t4
        o2 = await pg.evaluate("""() => { const k = OYUN.kariyer; return { n: Object.keys(k.maclar).length, skorlar: Object.entries(k.maclar).map(([id, s]) => [id, s.skor.join('-')]) }; }""")
        casus = await pg.evaluate("() => sessionStorage.getItem('h2aBitir')")
        obur2 = dict(o2["skorlar"])
        denetle("H2-a: kart açıldıktan sonra işçi düştü (arkaDus): rAF kareleri arasında 1 sn'den uzun boşluk yok; Odaya dön bitti, sekiz sonuç (öbür yedisi arkaMacOynat'ınkiyle aynı); ligCanliBitir çağrılmadı; MAC_SONU.isciBekle ≥ 60000",
                g["kip"] == "anaIs" and g["bosluk"] <= 1000 and o2["n"] == 8 and all(obur2.get(i) == s for i, s in e["skorlar"]) and casus is None and b1["isciBekle"] >= 60000,
                f"en uzun kare boşluğu {g['bosluk']} ms · düşüşte işçide bitmeyen {g['kalan']}/7 (ana iplikte kurulan motor {g['motor']}) · Odaya dön {sure4:.1f} sn")
        await baglam.close()
    finally:
        sunucu.terminate()


SECIM = set(sys.argv[1:])


def sec(n):
    return not SECIM or n in SECIM


async def bolum_23(tarayici, site, tum_hatalar):
    """S-b: balkon sinyalleri (yürüyüşsüz, gerçek zaman beklemesiz): düşük kondisyonlu oyuncu, Salı 15:00, gözlem sayfa içinden açılır ve ilerletilir;
    yenilemede oda balkonda açılır, şeritteki "Gördüklerin" sayfa içinde hesaplanan sinyallerle aynı; bırakınca geçmiş kaydında sinyaller var"""
    print("\n23. Balkon sinyalleri (S-b)")
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await pg.evaluate("""() => oyunKomut(k => { const D = k.kulupler.demirkapi.kadro, x = Object.assign({}, k.oyuncular);
      for (const id of D.ilk11.slice(1, 3)) x[id] = Object.assign({}, x[id], { hal: { kon: 58, gun: '2026-11-23', form: 0, gel: 0, tav: 60 } });
      k.oyuncular = x; zamanIlerlet(k, anDakika('2026-11-24', 900) - simdikiAn(k)); gozlemAc(k, 120); gozlemAdim(k, 60); })""")
    await oda_yenile(pg)
    await pg.wait_for_timeout(500)
    b = await pg.evaluate("""() => { const k = OYUN.kariyer, S = (k.gozlem && k.gozlem.sinyaller || []).filter(s => s.dk < k.gunIciDakika).map(s => gozlemSinyalMetni(k, s));
      return { yer: ODA.yer, acik: gozlemAcik(k), beklenen: S, sayfa: [...document.querySelectorAll('.od-gorduklerin li')].map(x => x.textContent),
        serit: (document.querySelector('.od-gozlem') || {}).textContent || '' }; }""")
    denetle("S-b, R5: gözlem açıkken yenileme odayı balkonda açar; antrenman kâğıdındaki “Gördüklerin” sayfa içinde hesaplanan bütün sinyaller (R5: yalnız sonuncusu değil; en az bir yorgun)",
            b["yer"] == "balkon" and b["acik"] and len(b["beklenen"]) >= 1 and b["sayfa"] == b["beklenen"] and any("koşularda geride kaldı" in s for s in b["beklenen"]), str(b)[:300])
    kes = {}
    for boyut in ((1180, 1000), (672, 600)):
        await pg.set_viewport_size({"width": boyut[0], "height": boyut[1]})
        await ayar_yazi(pg, "buyuk")
        kes[boyut[0]] = await pg.evaluate("""() => { const g = document.querySelector('.od-gozlem'); if (!g) return null; const a = g.getBoundingClientRect();
          return [...document.querySelectorAll('.od-nesneler button')].filter(b => { const r = b.getBoundingClientRect(); return r.width > 1 && r.left < a.right && r.right > a.left && r.top < a.bottom && r.bottom > a.top; }).map(b => b.textContent); }""")
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    await ayar_yazi(pg, "normal")
    denetle("İnceleme: büyük yazıda (1180 ve 672 px) balkon şeridi masadaki düğmelerle kesişmez", all(v == [] for v in kes.values()), str(kes))
    await pg.click('[data-eylem="gozlemBirak"]')
    await pg.wait_for_timeout(300)
    g = await pg.evaluate("() => { const g = OYUN.kariyer.gecmis.filter(x => x.tur === 'gozlem').pop(); return g ? g.sinyaller || [] : null; }")
    m = await pg.text_content(".od-mesaj") if await pg.query_selector(".od-mesaj") else ""
    denetle("S-b: Gözlemi bırak → geçmişteki gözlem kaydında izlenen kısmın sinyalleri; şerit metni sinyalden ve dosyaya düşen nottan söz eder",
            g is not None and len(g) == len(b["beklenen"]) and "dosya" in m, f"{g} · {m[:120]}")
    await pg.context.close()


async def bolum_22(tarayici, site, tum_hatalar):
    """S-c: Dosya'da Kadro sekmesi ve oyuncu dosyası — Duraklat'ta açılır; 22 satır, gizli değer yok; taşma yok (normal ve büyük yazı, 1180 ve 672 px);
    ada dokununca oyuncu dosyası; [ ve ] gezinir; Esc önce listeye, sonra kapatır; TEST kutusu yalnız Test bilgileri açıkken; sürüm 10 kaydında M/Dk —"""
    print("\n22. Kadro sekmesi (S-c)")
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    d0 = await durum(pg)
    async def kadro_ac():
        await pg.keyboard.press("Digit3")
        await pg.wait_for_selector(".dsy", timeout=10000)
        await pg.click(".dsy-kadroSekme")
        await pg.wait_for_selector(".dsy-kadro", timeout=10000)
    await pg.click(".od-duraklat")
    await kadro_ac()
    L = await pg.evaluate("""() => { const k = OYUN.kariyer, S = kadroSatirlari(k, k.kisiler[k.baskanId].kulupId);
      return { satir: document.querySelectorAll('.dsy-kadro tbody tr').length, beklenen: S.length,
        adlar: [...document.querySelectorAll('.dsy-kadro tbody button[data-eylem="oyuncuAc"]')].map(b => b.textContent).join('|') === S.map(x => x.ad).join('|'),
        kadro: document.querySelector('.dsy-kadroSekme').getAttribute('aria-selected'), rapor: document.querySelector('.dsy-raporSekme').getAttribute('aria-selected'),
        test: !!document.querySelector('.dsy .od-testIpucu'), yazi: document.querySelector('.dsy-genis').textContent }; }""")
    gizli = [w for w in ("Kondisyon", "Kon ", "Frm", "Tavan", "Ort", "bilgi", "ısrar") if w in L["yazi"]]
    denetle("S-c: Duraklat'ta Dosya açılır; Kadro sekmesi 22 satırlık listeyi kadroSatirlari sırasıyla gösterir; Raporlar seçili değil; gizli değer ve TEST kutusu yok; zaman değişmedi",
            L["satir"] == 22 == L["beklenen"] and L["adlar"] and L["kadro"] == "true" and L["rapor"] == "false" and not L["test"] and not gizli and await durum(pg) == d0,
            str({a: L[a] for a in ("satir", "adlar", "kadro", "rapor", "test")}) + f" · {gizli}")
    await pg.screenshot(path=str(ARAC / "son-akis-22-kadro.png"))
    ilk = await pg.evaluate("() => document.querySelector('.dsy-kadro tbody button[data-eylem=\"oyuncuAc\"]').dataset.oyuncu")
    await pg.click(f'.dsy-kadro [data-eylem="oyuncuAc"][data-oyuncu="{ilk}"]')
    O = await pg.evaluate("""() => ({ ad: (document.querySelector('.dsy-baslik') || {}).textContent, kunye: !!document.querySelector('.dsy-kunye'), notlar: !!document.querySelector('.dsy-sag h4'),
      don: !!document.querySelector('[data-eylem="kadroDon"]'), beklenen: OYUN.kariyer.oyuncular[%s].ad })""" % json.dumps(ilk))
    denetle("S-c: ada dokununca oyuncu dosyası açılır (künye, Bu sezon, Notlar, “◂ Kadro”)", O["ad"] == O["beklenen"] and O["kunye"] and O["notlar"] and O["don"], str(O))
    await pg.screenshot(path=str(ARAC / "son-akis-22-oyuncu.png"))
    await pg.keyboard.press("BracketRight")
    a2 = await pg.text_content(".dsy-baslik")
    await pg.keyboard.press("BracketLeft")
    a3 = await pg.text_content(".dsy-baslik")
    S = await pg.evaluate("() => { const k = OYUN.kariyer; return kadroSatirlari(k, k.kisiler[k.baskanId].kulupId).map(x => x.ad); }")
    denetle("S-c: oyuncu dosyasında ] sonraki, [ önceki oyuncu (liste sırası)", a2 == S[1] and a3 == S[0], f"{a2} · {a3}")
    await pg.keyboard.press("Escape")
    e1 = await pg.evaluate("() => ({ liste: !!document.querySelector('.dsy-kadro'), odak: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.oyuncu || null : null })")
    await pg.keyboard.press("Escape")
    e2 = await pg.query_selector(".dsy") is None
    denetle("S-c: Esc oyuncu dosyasından önce listeye döner (odak o oyuncuda), sonra dosyayı kapatır", e1["liste"] and e1["odak"] == ilk and e2, f"{e1} · {e2}")
    await pg.click(".od-duraklat")
    await pg.set_viewport_size({"width": 672, "height": 600})
    await kadro_ac()
    y0 = await pg.evaluate("() => { const g = document.querySelector('.dsy-genis'); g.scrollTop = g.scrollHeight; return g.scrollTop; }")
    sonid = await pg.evaluate("() => [...document.querySelectorAll('.dsy-kadro [data-eylem=\"oyuncuAc\"]')].pop().dataset.oyuncu")
    await pg.click(f'.dsy-kadro [data-eylem="oyuncuAc"][data-oyuncu="{sonid}"]')
    await pg.keyboard.press("Escape")
    yd = await pg.evaluate("""(id) => { const g = document.querySelector('.dsy-genis'), f = document.activeElement, a = g.getBoundingClientRect(), r = f.getBoundingClientRect();
      return { y: g.scrollTop, odak: f.dataset ? f.dataset.oyuncu : null, gorunur: r.top >= a.top - 1 && r.bottom <= a.bottom + 1 }; }""", sonid)
    await pg.keyboard.press("Escape")
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    denetle("İnceleme: oyuncu dosyasından listeye dönünce okuma yeri geri gelir, odak o oyuncunun satırında ve görünür (672 px)",
            y0 > 0 and abs(yd["y"] - y0) <= 2 and yd["odak"] == sonid and yd["gorunur"], f"{y0} → {yd}")
    tasma = {}
    for yazi, boyut in (("normal", (1180, 1000)), ("buyuk", (1180, 1000)), ("normal", (672, 600)), ("buyuk", (672, 600))):
        await pg.set_viewport_size({"width": boyut[0], "height": boyut[1]})
        await ayar_yazi(pg, yazi)
        await kadro_ac()
        liste = await pg.evaluate(TASMA_JS)
        ad = await pg.evaluate("() => { const b = [...document.querySelectorAll('.dsy-kadro tbody tr td:nth-child(2)')]; return b.filter(x => x.scrollWidth > x.clientWidth + 1).length; }")
        await pg.click('.dsy-kadro [data-eylem="oyuncuAc"]')
        oy = await pg.evaluate(TASMA_JS)
        tasma[f"{yazi}-{boyut[0]}"] = (liste, oy, ad)
        await masaya_don(pg)
    # R1-f (2026-10-29): yazı tabanında dar karede (672 px pencere = 640 px kare; RN-c'den önce 800 px) kadro listesi sayfasıyla yatay kayar; oyuncu dosyası taşmaz
    denetle("S-c/R1-f: 1180 px'te kadro listesi ve oyuncu dosyasında yatay taşma yok (normal ve büyük yazı); 672 px'te oyuncu dosyası taşmaz, liste yalnız kendi sayfasında yatay kayar; uzun ad hücresinde kısalır",
            all(max(o) <= 0 for _, o, _ in tasma.values()) and all(max(l) <= 0 for a, (l, _, _) in tasma.items() if a.endswith("-1180"))
            and all(l[0] <= 0 for a, (l, _, _) in tasma.items() if a.endswith("-672")), str(tasma))   # l: [sekme satırı, sayfa]
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    await ayar_yazi(pg, "normal")
    # Test bilgileri geliştirmede varsayılan açıktır (js/oyun-oturumu.js): açıkken künyede TEST kutusu, kapatınca yok; listede hiç yok
    test0 = await pg.evaluate("() => !!OYUN.ayarlar.test")
    await kadro_ac()
    tl = await pg.query_selector(".dsy .od-testIpucu") is None
    await pg.click('.dsy-kadro [data-eylem="oyuncuAc"]')
    tk = await pg.evaluate("() => { const t = document.querySelector('.dsy-sol .od-testIpucu'); return t ? t.textContent : null; }")
    await masaya_don(pg)
    await odak_ac(pg, "ayar")
    await pg.click('[data-eylem="ayarBolum"][data-bolum="gelistirici"]')
    await pg.click('[data-eylem="test"]')
    await pg.keyboard.press("Escape")
    test1 = await pg.evaluate("() => !!OYUN.ayarlar.test")
    await kadro_ac()
    await pg.click('.dsy-kadro [data-eylem="oyuncuAc"]')
    tk2 = await pg.query_selector(".dsy .od-testIpucu")
    denetle("S-c: Test bilgileri açıkken oyuncu dosyasının künyesinde TEST kutusu (gizli değerler orada), kapatınca yok; listede hiç yok",
            test0 and not test1 and tl and tk is not None and "kondisyon" in tk and tk2 is None, f"{test0}→{test1} · {str(tk)[:100]} · {tk2 is None}")
    await pg.context.close()
    # sürüm 10 kaydı (hafta 14) geçişle açılır: M ve Dk “—”
    s10 = (ARAC / "ornekler" / "kayit-s10-hafta14.json").read_text(encoding="utf-8")
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script("""(m => { if (!sessionStorage.getItem('__s10')) { sessionStorage.setItem('__s10', '1'); localStorage.setItem('chairman:oyun-1', m); } })(""" + json.dumps(s10) + ")")
    pg = await baglam.new_page()
    pg.on("pageerror", lambda e: tum_hatalar.append("Betik hatası: " + str(e)))
    await pg.goto((site / "index.html").as_uri() + loca(""))
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=30000)
    await kadro_ac()
    md = await pg.evaluate("() => [...document.querySelectorAll('.dsy-kadro tbody tr')].map(r => r.children[4].textContent + '/' + r.children[5].textContent)")
    denetle("S-c: sürüm 10 kaydı geçişle açılır; Kadro'da M ve Dk “—”", len(md) >= 22 and all(x == "—/—" for x in md), str(md[:3]))
    await pg.context.close()


async def bolum_24(tarayici, site, tum_hatalar):
    """S-d, R3: Canlı Skor'da lig — varsayılan Maçlar (hafta görünümü); Puan durumu 16 satır (sıra sezonTablosu, tarafsız, armalı, bölgeler);
    takıma dokununca takım sayfası sağ panelde, Esc → Canlı Skor → ana ekran; hafta ‹ › ile gezilir; taşma ≤ 1; Duraklat'ta açık; okuma yeri;
    kariyersiz maçta yalnız canlı satırlar ve tablo, dokunulmaz"""
    print("\n24. Canlı Skor'da lig (S-d, R3)")
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    d0 = await durum(pg)
    await pg.click(".od-duraklat")
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    a = await pg.evaluate("() => ({ sekme: [...document.querySelectorAll('.tel .tel-sekme')].map(b => b.dataset.sekme + ':' + b.getAttribute('aria-selected')).join(','), mac: document.querySelectorAll('.tel .tel-mac').length, tablo: !!document.querySelector('.tel-tablo'), kesik: [...document.querySelectorAll('.tel .tel-sekme')].filter(b => b.scrollWidth > b.clientWidth + 1).map(b => b.textContent) })")
    denetle("S-d, R3: Duraklat'ta Canlı Skor açılır, Maçlar seçili (Maçlar · Puan durumu; Fikstür hafta görünümüne katıldı; sekme yazıları kesilmez); haftanın 8 satırı, tablo çizilmedi",
            a["sekme"] == "maclar:true,tablo:false" and a["mac"] == 8 and not a["tablo"] and not a["kesik"], str(a))
    await pg.click('.tel [data-eylem="skorSekme"][data-sekme="tablo"]')
    t = await pg.evaluate(TABLO_JS)
    tas1 = await pg.evaluate(TEL_TASMA_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-24-tablo.png"))
    denetle("S-d, R3: Puan durumu 16 satır, sıra sezonTablosu ile aynı; tarafsız (vurgulu satır yok), her satırda arma; şampiyonluk ve küme düşme bölgesi kenarda; maç satırı yok; taşma ≤ 1",
            t["n"] == 16 and t["sira"] and t["vurgu"] == 0 and t["arma"] == 16 and t["ilk"] == "tel-b-cikma" and t["son"] == "tel-b-dusme" and t["mac"] == 0 and tas1["en"] <= 1, f"{t} · taşma {tas1['en']}")
    kid = await pg.evaluate("() => sezonTablosu(OYUN.kariyer).map(t => t.id).find(id => id !== 'demirkapi')")
    await cs_ac(pg, "kulup", kid)
    ku = await pg.evaluate(KULUP_JS, kid)
    tas2 = await pg.evaluate(CS_TASMA_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-24-kulup.png"))
    denetle("S-d, R3: takıma dokununca takım sayfası sağ panelde (Genel · Maçlar · Kadro · İstatistik; ad, sıra, son beş, sıradaki, teknik direktör, stat); telefon tabloyu tutar; taşma ≤ 1",
            ku["var"] and ku["ad"] == ku["beklenen"] and ku["stat"] in ku["yazi"] and (ku["hoca"] or "") in ku["yazi"] and "Sıradaki" in ku["yazi"] and ku["bolum"] == "genel,maclar,kadro,ist"
            and ku["liste"] == 16 and tas2["en"] <= 1, f"{ku['ad']} · {ku['bolum']} · taşma {tas2['en']}")
    await pg.keyboard.press("Escape")
    e1 = await pg.evaluate("() => ({ ekran: document.querySelector('.tel-ekran').dataset.ekran, sekme: (document.querySelector('.tel .tel-sekme[aria-selected=true]') || {dataset: {}}).dataset.sekme, sayfa: !!document.querySelector('.cs-sayfa') })")
    await pg.keyboard.press("Escape")
    e2 = await pg.evaluate("() => document.querySelector('.tel-ekran') ? document.querySelector('.tel-ekran').dataset.ekran : null")
    denetle("S-d, R3: Esc takım sayfasını kapatır (telefon Puan durumunda kalır), sonra ana ekran", e1 == {"ekran": "skor", "sekme": "tablo", "sayfa": False} and e2 == "ana", f"{e1} · {e2}")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')

    async def hafta():
        return await pg.evaluate("() => ({ h: document.querySelector('.tel-haftaNav b').textContent, n: document.querySelectorAll('.tel .tel-mac').length, geri: document.querySelector('.tel-haftaOk[data-yon=geri]').disabled })")
    f1 = await hafta()
    await pg.click('.tel-haftaOk[data-yon="ileri"]')
    f2 = await hafta()
    tas3 = await pg.evaluate(TEL_TASMA_JS)
    await pg.click('.tel-haftaOk[data-yon="geri"]')
    f3 = await hafta()
    await pg.focus('.tel-haftaOk[data-yon="ileri"]')
    await pg.keyboard.press("Enter")
    await pg.keyboard.press("Enter")
    fk = await pg.evaluate("() => ({ h: document.querySelector('.tel-haftaNav b').textContent, yon: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.yon : null })")
    denetle("İnceleme: hafta görünümünde › klavyeyle iki kez: odak ileri okta kalır (15. hafta)", fk == {"h": "15. hafta", "yon": "ileri"}, str(fk))
    denetle("S-d, R3: hafta görünümü odada bekleyen maç gününün haftasıyla açılır (13, ‹ kapalı); › 14. hafta, ‹ 13; her hafta 8 maç; taşma ≤ 1; zaman değişmedi",
            f1 == {"h": "13. hafta", "n": 8, "geri": True} and f2["h"] == "14. hafta" and f2["n"] == 8 and f3["h"] == "13. hafta" and tas3["en"] <= 1 and await durum(pg) == d0, f"{f1} · {f2} · {f3}")
    await pg.set_viewport_size({"width": 672, "height": 600})
    await pg.evaluate("() => { OYUN.ayarlar.yazi = 'buyuk'; }")   # büyük yazıda tablo telefonda taşar (okuma yeri anlamlı)
    await pg.click('.tel [data-eylem="skorSekme"][data-sekme="tablo"]')
    t0 = await pg.evaluate("() => { const g = document.querySelector('.tel .tel-govde'); g.scrollTop = g.scrollHeight; return g.scrollTop; }")
    skid = await pg.evaluate("() => [...document.querySelectorAll('.tel [data-eylem=csAc][data-tur=kulup]')].pop().dataset.id")
    await cs_ac(pg, "kulup", skid)
    await pg.keyboard.press("Escape")
    td = await pg.evaluate("""() => { const g = document.querySelector('.tel .tel-govde'), f = document.activeElement, a = g.getBoundingClientRect(), r = f.getBoundingClientRect();
      return { y: g.scrollTop, odak: f.dataset ? f.dataset.id : null, gorunur: r.top >= a.top - 1 && r.bottom <= a.bottom + 1 }; }""")
    await pg.evaluate("() => { OYUN.ayarlar.yazi = 'normal'; }")
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    denetle("İnceleme, R3: takım sayfasından Puan durumuna dönünce okuma yeri geri gelir, odak o kulübün satırında ve görünür (672 px)",
            t0 > 0 and abs(td["y"] - t0) <= 2 and td["odak"] == skid and td["gorunur"], f"{t0} → {td}")
    await pg.context.close()
    # kariyersiz maç: yalnız Maçlar ve Puan durumu; satırlar ve tablo dokunulmaz
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=yok", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.evaluate("() => MAC_TELEFON.ac()")
    await pg.evaluate("() => document.querySelector('#macTelefon [data-eylem=telUyg][data-uyg=skor]').click()")
    s0 = await pg.evaluate("() => [...document.querySelectorAll('#macTelefon .tel-sekme')].map(b => b.dataset.sekme).join(',')")
    await pg.evaluate("() => document.querySelector('#macTelefon [data-eylem=skorSekme][data-sekme=tablo]').click()")
    s1 = await pg.evaluate("() => ({ n: document.querySelectorAll('#macTelefon .tel-tablo tbody tr').length, dokunur: document.querySelectorAll('#macTelefon [data-eylem=csAc]').length, canli: !!document.querySelector('#macTelefon .tel-canliNot') })")
    denetle("S-d, R3: kariyersiz maçta Canlı Skor'da Maçlar ve Puan durumu; tablo dokunulmaz; santradan önce “Canlı” notu yok",
            s0 == "maclar,tablo" and s1["n"] >= 2 and s1["dokunur"] == 0 and not s1["canli"], f"{s0} · {s1}")
    await pg.context.close()


async def bolum_25(tarayici, site, tum_hatalar):
    """S-e: günlük gazete — açılışta masada ve “yeni”; 4 açar, rozet söner; sürüm 10 kaydında 29 Kasım 08:00'e geçilince manşet 13. haftanın bizim maçı;
    önceki sayıya gezinti; sayfadaki metin sayfa içinde hesaplanan gazeteSayisi ile aynı; taşma ≤ 1"""
    print("\n25. Günlük gazete (S-e)")
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    d0 = await durum(pg)
    r0 = await pg.evaluate("() => { const b = document.querySelector('.od-nesne[data-panel=\"gazete\"]'); return b ? { var: true, rozet: (b.querySelector('.od-rozet') || {}).textContent || '' } : { var: false }; }")
    await pg.keyboard.press("Digit4")
    await pg.wait_for_selector(".gz-sayi", timeout=10000)
    g0 = await pg.evaluate("""() => { const k = OYUN.kariyer, G = gazeteSayisi(k, '2026-11-23');
      return { sayfa: document.querySelector('.gz-manset').textContent, beklenen: G.manset.metin, okunan: k.gazeteOkunan || null }; }""")
    await pg.keyboard.press("Escape")
    r1 = await pg.evaluate("() => { const b = document.querySelector('.od-nesne[data-panel=\"gazete\"]'); return b && b.querySelector('.od-rozet') ? b.querySelector('.od-rozet').textContent : ''; }")
    denetle("S-e: açılışta gazete masada ve “yeni”; 4 son sayıyı açar (manşet gazeteSayisi ile aynı), okundu yazılır, rozet söner; zaman değişmedi",
            r0.get("var") and r0.get("rozet") == "yeni" and g0["sayfa"] == g0["beklenen"] and g0["okunan"] == "2026-11-23" and r1 == "" and await durum(pg) == d0, f"{r0} · {g0} · {r1!r}")
    await pg.context.close()
    s10 = (ARAC / "ornekler" / "kayit-s10-hafta14.json").read_text(encoding="utf-8")
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script("""(m => { if (!sessionStorage.getItem('__s10g')) { sessionStorage.setItem('__s10g', '1'); localStorage.setItem('chairman:oyun-1', m); } })(""" + json.dumps(s10) + ")")
    pg = await baglam.new_page()
    pg.on("pageerror", lambda e: tum_hatalar.append("Betik hatası: " + str(e)))
    await pg.goto((site / "index.html").as_uri() + loca(""))
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=30000)
    await pg.evaluate("() => oyunKomut(k => { zamanIlerlet(k, anDakika('2026-11-29', 480) - simdikiAn(k)); })")
    await oda_yenile(pg)
    await pg.keyboard.press("Digit4")
    await pg.wait_for_selector(".gz-sayi", timeout=10000)
    async def oku():
        return await pg.evaluate("""() => { const k = OYUN.kariyer, t = document.querySelector('.gz-kunye small').textContent, no = Number((t.match(/Sayı (\\d+)/) || [])[1]);
          const tarih = tarihEkle('2026-11-23', no - 1), G = gazeteSayisi(k, tarih), P = document.querySelector('.gz-sayi');
          const sayfa = [P.querySelector('.gz-manset').textContent].concat([...P.querySelectorAll('.gz-haber, .gz-kutu')].map(x => x.textContent));
          const H = G.haberler.slice(1), bek = [G.manset.metin].concat(H.filter(h => !h.kutu).map(h => h.metin), H.filter(h => h.kutu).map(h => h.metin));
          return { tarih, kalin: P.classList.contains('gz-kalin'), anahtar: G.manset.anahtar, ayni: JSON.stringify(sayfa) === JSON.stringify(bek), n: sayfa.length,
            hafta: G.manset.p && G.manset.p.macId ? k.fikstur.find(f => f.id === G.manset.p.macId).hafta : null, tasma: document.querySelector('.od-icerik').scrollWidth - document.querySelector('.od-icerik').clientWidth }; }""")
    a = await oku()
    await pg.screenshot(path=str(ARAC / "son-akis-25-gazete.png"))
    denetle("S-e: sürüm 10 kaydında 29 Kasım 08:00'de son sayı kalın, manşet 13. haftanın bizim maçı; sayfadaki metinler gazeteSayisi ile aynı; taşma ≤ 1",
            a["tarih"] == "2026-11-29" and a["kalin"] and a["anahtar"] == "gz.mac" and a["hafta"] == 13 and a["ayni"] and a["n"] >= 4 and a["tasma"] <= 1, str(a))
    await pg.click('[data-eylem="gazeteSayi"]:has-text("Önceki")')
    b = await oku()
    await pg.keyboard.press("BracketRight")
    c = await oku()
    for _ in range(9):
        await pg.keyboard.press("BracketLeft")
    go = await pg.evaluate("() => ({ no: (document.querySelector('.gz-kunye small').textContent.match(/Sayı (\\d+)/) || [])[1], yon: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.yon : null, gez: !!(document.activeElement && document.activeElement.closest('.gz-gezinti')) })")
    await pg.keyboard.press("BracketRight")
    g2 = await pg.evaluate("() => ({ yon: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.yon : null })")
    denetle("İnceleme: gazetede [ ile ilk sayıya (Sayı 1) gelinir, odak gezinti düğmesinde kalır (uçta ileri düğmesi); ] ile odak ileri düğmesinde",
            go == {"no": "1", "yon": "ileri", "gez": True} and g2["yon"] == "ileri", f"{go} · {g2}")
    for _ in range(9):
        await pg.keyboard.press("BracketRight")
    denetle("S-e: ◂ Önceki sayı 28 Kasım'ı açar (maç günü: manşet yaklaşan maç; metinler gazeteSayisi ile aynı); ] yeniden son sayıya döner",
            b["tarih"] == "2026-11-28" and b["ayni"] and not b["kalin"] and b["anahtar"] == "gz.yaklasan" and c["tarih"] == "2026-11-29" and b["tasma"] <= 1, f"{b} · {c['tarih']}")
    await pg.context.close()

# U0 (2026-10-28): tek yazı ölçeği ve yazı tipleri. Görünür metin düğümlerinin hesaplanmış yazı boyu; TEST kutuları ve gizli metin hariç
YAZI_OLCU_JS = """(kok) => { const R = document.querySelector(kok); if (!R) return null; const S = document.getElementById('screen');
  const boy = [...R.querySelectorAll('*')].filter(e => { if (!e.childNodes.length || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return false;
      if (e.closest('.od-test,[aria-hidden="true"],.od-testSimge,.dsy-damga,[data-rozet="yeni"]')) return false;
      const r = e.getBoundingClientRect(), c = getComputedStyle(e); return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none'; })
    .map(e => parseFloat(getComputedStyle(e).fontSize));
  return { ekran: S.clientWidth, govde: parseFloat(getComputedStyle(R).fontSize), enKucuk: boy.length ? Math.min(...boy) : null,
    degisken: getComputedStyle(S).getPropertyValue('--k-yaziBoyu').trim(), aile: getComputedStyle(R).fontFamily.split(',')[0].replace(/"/g, '') }; }"""


async def bolum_26(tarayici, site, tum_hatalar):
    """U0: bütün HTML katmanları tek ölçekte (STIL.kagit.yaziBoyu: normal 1,5 cqw, büyük 1,8 cqw) ve orantılı gövde yazısında; büyük yazı bültende ve
    maç telefonunda da geçerli; 640 px'lik karede gövde ≥ 12 px; masaüstü kopyasının aradığı üç yazı tipinden IBM Plex Sans yüklü."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7", "index-test.html")
    tum_hatalar += hatalar
    await yazi_bekle(pg)
    yt = await pg.evaluate("() => [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/\"/g, '')))]")
    denetle("U0: IBM Plex Sans yüklü (gövde yazısı); Jersey 10 başlıkta", "IBM Plex Sans" in yt and "Jersey 10" in yt, str(yt))
    olc = {}
    for yazi, boyut in (("normal", (1100, 810)), ("buyuk", (1100, 810)), ("normal", (672, 600)), ("buyuk", (672, 600))):
        await pg.set_viewport_size({"width": boyut[0], "height": boyut[1]})
        await ayar_yazi(pg, yazi)
        for ad in ("dosya", "ajanda", "telefon"):
            await odak_ac(pg, ad)
            if ad == "telefon":
                await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
            olc[f"{yazi}-{boyut[0]}-{ad}"] = await pg.evaluate(YAZI_OLCU_JS, "#oda")
            await masaya_don(pg)
    bilgi = {a: (o["govde"], o["enKucuk"]) for a, o in olc.items() if o}
    print(f"  bilgi: gövde ve en küçük metin (px) {bilgi}")
    # R1-f (2026-10-29): ölçek piksel tabanlı — max(14 px, 1,5 cqw), büyük yazıda max(16 px, 1,8 cqw)
    beklenen = lambda a, ekran: max(16 if a.startswith("buyuk") else 14, (1.8 if a.startswith("buyuk") else 1.5) * ekran / 100)
    denetle("U0/R1-f: odada yazı ölçeği tek değişkenden (--k-yaziBoyu; normal max(14 px, 1,5 cqw), büyük max(16 px, 1,8 cqw)); gövde orantılı yazı (IBM Plex Sans)",
            all(o and o["aile"] == "IBM Plex Sans" for o in olc.values())
            and all(abs(o["govde"] - beklenen(a, o["ekran"])) < 0.15 for a, o in olc.items()), str({a: (o["ekran"], o["govde"]) for a, o in olc.items()}))
    denetle("R1-f: her genişlikte gövde ≥ 14 px, normal yazıda en küçük metin ≥ 12 px (ayrıntılı ölçü: araclar/okunurluk.py)",
            all(o["govde"] >= 14 for o in olc.values()) and all(olc[k]["enKucuk"] >= 12 for k in olc if k.startswith("normal")),
            str({a: (o["ekran"], o["govde"], o["enKucuk"]) for a, o in olc.items()}))
    await pg.context.close()
    # bülten ve maç telefonu aynı ölçeği ve büyük yazıyı alır (eskiden sabit 1,3 cqw)
    for yazi in ("normal", "buyuk"):
        pg, hatalar = await sayfa(tarayici, site, "?ekran=bulten&tohum=4&rakipBaskan=yok", "#onEkran:not([hidden]) #btnIlerle")
        tum_hatalar += hatalar
        await pg.evaluate("(y) => { OYUN.ayarlar.yazi = y; OYUN.ayarlar.kaydet(); }", yazi)
        await pg.reload()
        await pg.wait_for_selector("#onEkran:not([hidden]) #btnIlerle", timeout=20000)
        await yazi_bekle(pg)
        b = await pg.evaluate(YAZI_OLCU_JS, "#onEkran")
        kart = await pg.evaluate("() => { const k = document.querySelector('.prg-kart'), E = document.getElementById('onEkran').getBoundingClientRect(), r = k.getBoundingClientRect(); return { icinde: r.top >= E.top - 1 && r.bottom <= E.bottom + 1 }; }")
        hedef = 1.8 if yazi == "buyuk" else 1.5
        denetle(f"U0/R1-f: bültende yazı ortak ölçekte (max(taban, {hedef} cqw), {yazi}), orantılı gövde; kart karenin içinde",
                b and abs(b["govde"] - max(16 if yazi == "buyuk" else 14, hedef * b["ekran"] / 100)) < 0.15 and b["aile"] == "IBM Plex Sans" and kart["icinde"], f"{b} · {kart}")
        await pg.context.close()
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&tohum=4&rakipBaskan=yok", "#btnMacaGec")
    tum_hatalar += hatalar
    await pg.evaluate("() => { OYUN.ayarlar.yazi = 'buyuk'; OYUN.ayarlar.kaydet(); }")
    await pg.reload()
    await pg.wait_for_selector("#btnMacaGec", timeout=20000)
    await pg.keyboard.press("KeyT")
    await pg.wait_for_selector("#macTelefon:not([hidden])", timeout=5000)
    m = await pg.evaluate(YAZI_OLCU_JS, "#macTelefon")
    denetle("U0/R1-f: maç telefonu büyük yazıyı alır (max(16 px, 1,8 cqw)), orantılı gövde", m and abs(m["govde"] - max(16, 1.8 * m["ekran"] / 100)) < 0.15 and m["aile"] == "IBM Plex Sans", str(m))
    await pg.evaluate("() => { OYUN.ayarlar.yazi = 'normal'; OYUN.ayarlar.kaydet(); }")
    await pg.context.close()

# U1 (2026-10-28): odak kabının hâli — açık kap sayısı, boy, başlık, Geri etiketi, Kapat'ın yeri, perdenin bulanıklığı ve karartması, masadaki
# düğmelerin etkileşimsizliği, alt şeritte İlerle, 3B'nin donması
ODAK_JS = """() => { const S = [...document.querySelectorAll('#oda section.odk:not(.odk-cikis)')], s = S[0], P = document.querySelector('#oda .odk-perde:not(.odk-cikis)');
  const pc = P ? getComputedStyle(P) : null, tel = document.querySelector('.tel-ekran');
  return { n: S.length, ad: s ? s.dataset.odak : null, boy: s ? s.dataset.boy : null, baslik: s ? (s.querySelector('.odk-ust h3') || {}).textContent : null,
    geri: s ? ((s.querySelector('.odk-geri') || {}).textContent || null) : null, kapatUstte: !!(s && s.querySelector('.odk-ust .od-kapat')),
    kapatIcte: !!document.querySelector('#oda .dsy-sekmeler .od-kapat, #oda .dft-ust .od-kapat'),
    bulanik: pc ? (pc.backdropFilter || pc.webkitBackdropFilter || '') : null, zemin: pc ? pc.backgroundColor : null,
    gecis: pc ? pc.transitionProperty + ' ' + pc.animationName : null, inert: !!document.querySelector('#oda .od-nesneler[inert]'),
    ilerle: !!document.querySelector('#oda .od-alt .od-ana[data-eylem^="ilerle"]'), tel: tel ? tel.dataset.ekran : null,
    dondu: typeof odaDondur === 'function' ? odaDondur() : null, cikis: document.querySelectorAll('#oda .odk-cikis').length }; }"""


async def odak(pg):
    return await pg.evaluate(ODAK_JS)


async def bolum_27(tarayici, site, tum_hatalar):
    """U1: odak kabı ve tek Esc zinciri. Her iş aynı kapta (oda statik bulanık ve karartılmış, başlıkta ‹ Geri · başlık · Kapat); odakta masadaki
    düğmeler etkileşimsiz ve İlerle yok; masada kamera yerleşince 3B çizim durur; Esc bir adım geri, Geri düğmesi Esc ile aynı yere, Kapat ve perde
    masaya bırakır; kapanışta çıkış kopyası söner."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7", "index-test.html")
    tum_hatalar += hatalar
    await pg.set_viewport_size({"width": 1100, "height": 810})
    # TEST içeriğin Salı 10:30 kararına ilerlenir (§3 kalıbı)
    await pg.keyboard.press("Digit2")
    await pg.click('.od-alt .od-ana[data-eylem="yap"]')
    if await pg.query_selector('.od-alt .od-ana[data-eylem="yap"]:has-text("Onayla")'):
        await pg.click('.od-alt .od-ana[data-eylem="yap"]:has-text("Onayla")')
    await masaya_don(pg)
    for _ in range(4):
        if (await durum(pg))["mesele"]:
            break
        await oda_ilerle(pg)
    await pg.keyboard.press("Digit3")
    # kamera nesneye yaklaşıp yerine oturunca 3B çizim durur (başsız tarayıcıda kare hızı düşük: sabit bekleme yerine durumu bekle)
    await pg.wait_for_function("() => typeof odaDondur === 'function' && odaDondur()", timeout=30000)
    d = await odak(pg)
    denetle("U1: dosya odak kabında (tek kap, geniş); başlık 'Dosya', Kapat başlıkta (sekme satırında değil); perde 7 px bulanık ve %33 karartma, "
            "bulanıklık canlandırılmıyor; masadaki düğmeler etkileşimsiz; odakta İlerle yok; kamera yerleşince 3B donuk",
            d["n"] == 1 and d["ad"] == "dosya" and d["boy"] == "genis" and d["baslik"] == "Dosya" and d["kapatUstte"] and not d["kapatIcte"]
            and "blur(7px)" in d["bulanik"] and d["zemin"].replace(" ", "").endswith("0.33)") and "backdrop" not in d["gecis"]
            and d["inert"] and not d["ilerle"] and d["dondu"] is True, str(d))
    await pg.screenshot(path=str(ARAC / "son-akis-27-dosya.png"))
    await pg.keyboard.press("Escape")
    c = await odak(pg)
    await gecis_bitir(pg)
    c2 = await odak(pg)
    denetle("U1: Esc dosyayı masaya bıraktı; kapanışta çıkış kopyası belirdi ve söndü; 3B yeniden çiziliyor",
            c["n"] == 0 and c["cikis"] >= 1 and c2["cikis"] == 0 and c2["dondu"] is False and not c2["inert"], f"{c} · {c2}")
    # Esc tablosu: (başlangıç, adımlar) → her Esc'ten sonra beklenen (açık iş, telefon ekranı)
    async def esc_zinciri(beklenen):
        gorulen = []
        for _ in beklenen:
            await pg.keyboard.press("Escape")
            o = await odak(pg)
            gorulen.append((o["ad"], o["tel"] if o["ad"] == "telefon" else None))
        return gorulen
    # telefon: bildirimden konuşma → Mesajlar → ana ekran → masa
    await pg.keyboard.press("Digit1")
    await pg.click('.tel-bildirim[data-kisi]')
    tel1 = await esc_zinciri([1, 2, 3])
    denetle("U1 Esc: telefonda konuşma → Mesajlar → ana ekran → masa (bir adım geri; N7'nin 'uygulamadan ana ekrana' kuralı U1'de değişti)",
            tel1 == [("telefon", "mesajlar"), ("telefon", "ana"), (None, None)], str(tel1))
    # telefon: Canlı Skor → Puan durumu → takım sayfası (R3: sağ panelde) → Canlı Skor (aynı sekme) → ana → masa
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    await pg.click('.tel [data-eylem="skorSekme"][data-sekme="tablo"]')
    await pg.click('.tel [data-eylem="csAc"][data-tur="kulup"]')
    tel2 = await esc_zinciri([1, 2, 3])
    denetle("U1 Esc, R3: takım sayfası → Canlı Skor → ana ekran → masa", tel2 == [("telefon", "skor"), ("telefon", "ana"), (None, None)], str(tel2))
    # dosyayı telefondan aç: başlıkta '‹ Mesajlar'; Geri ile Esc aynı yere (aynı konuşma)
    await pg.keyboard.press("Digit1")
    await pg.click('.tel-bildirim[data-kisi]')
    await pg.click('.tlf-is [data-eylem="dosyaAc"]')
    g = await odak(pg)
    await pg.click('.odk-geri')
    g1 = await odak(pg)
    await pg.click('.tlf-is [data-eylem="dosyaAc"]')
    await pg.keyboard.press("Escape")
    g2 = await odak(pg)
    denetle("U1: telefondan açılan dosyada başlıkta '‹ Mesajlar'; Geri ve Esc aynı konuşmaya döner",
            g["ad"] == "dosya" and g["geri"] == "‹ Mesajlar" and g1["ad"] == "telefon" and g1["tel"] == "konusma" and g2["ad"] == "telefon" and g2["tel"] == "konusma", f"{g} · {g1} · {g2}")
    # Kapat × her zaman masaya bırakır (konuşmanın ortasından da)
    await pg.click('.odk-ust .od-kapat')
    k1 = await odak(pg)
    denetle("U1: Kapat × konuşmanın ortasından masaya bırakır", k1["n"] == 0, str(k1))
    # oyuncu dosyası → Kadro → masa; başlıkta '‹ Kadro'
    await pg.keyboard.press("Digit3")
    await pg.click('[data-eylem="kadroSekme"]')
    await pg.click('[data-eylem="oyuncuAc"]')
    o = await odak(pg)
    kad = await esc_zinciri([1, 2])
    denetle("U1: oyuncu dosyasında başlıkta '‹ Kadro'; Esc → Kadro listesi → masa", o["geri"] == "‹ Kadro" and kad == [("dosya", None), (None, None)]
            and await pg.query_selector('[data-eylem="kadroDon"]') is None, f"{o} · {kad}")
    # ayarlar → Kadro (TEST) → '‹ Ayarlar' → masa
    await odak_ac(pg, "ayar")
    await pg.click('[data-eylem="ayarBolum"][data-bolum="gelistirici"]')
    kt = await pg.query_selector('[data-eylem="ac"][data-panel="kadro"]')
    if kt:
        await kt.click()
        a = await odak(pg)
        ay = await esc_zinciri([1, 2])
        denetle("U1: Kadro (TEST) başlıkta '‹ Ayarlar'; Esc → Ayarlar (küçük kap) → masa", a["geri"] == "‹ Ayarlar" and ay == [("ayar", None), (None, None)], f"{a} · {ay}")
    else:
        await masaya_don(pg)
    # dosyasız karar: defterden 'Karar ver' → karar paneli (orta); '‹ Ajanda' ve Esc deftere; Kapat masaya
    await pg.evaluate("() => oyunKomut(k => testDosyasizKarar(k))")
    await pg.keyboard.press("Digit2")
    await pg.click('.dft-kayit:has-text("Dosyasız deneme kararı")')
    await pg.click('.od-alt .od-ana[data-eylem="kararAc"]')
    kp = await odak(pg)
    await pg.keyboard.press("Escape")
    kp1 = await odak(pg)
    await pg.click('.dft-kayit:has-text("Dosyasız deneme kararı")')
    await pg.click('.od-alt .od-ana[data-eylem="kararAc"]')
    await pg.click('.odk-ust .od-kapat')
    kp2 = await odak(pg)
    denetle("U1: karar paneli orta boy, başlıkta '‹ Ajanda'; Esc deftere döner; Kapat masaya bırakır (2.8Q'nun 'Kapat'tan sonra deftere' kuralı U1'de değişti)",
            kp["ad"] == "karar" and kp["boy"] == "orta" and kp["geri"] == "‹ Ajanda" and kp1["ad"] == "ajanda" and kp2["n"] == 0, f"{kp} · {kp1} · {kp2}")
    # defterde seçili işin eylemi alt şeritte kalır; perdeye tıklamak masaya bırakır
    await pg.keyboard.press("Digit2")
    df = await odak(pg)
    serit = await pg.query_selector('.od-alt .od-ana') is not None
    await pg.click(".od-perde", position={"x": 5, "y": 300})
    df2 = await odak(pg)
    denetle("U1: defterde seçili işin eylemi alt şeritte (2.8Q); İlerle yok; perdeye tıklamak masaya bırakır", df["ad"] == "ajanda" and serit and not df["ilerle"] and df2["n"] == 0, f"{df} · {df2}")
    await pg.context.close()


CAKISMA_JS = """() => { const o = document.querySelector('.ckm-ortu'), b = o && o.querySelector('.ckm-ac');
  return { ortu: !!o, metin: o ? o.innerText : '', odak: !!b && document.activeElement === b, rol: o ? o.getAttribute('role') : null,
    cakisma: !!(OYUN.oturum && OYUN.oturum.durum.cakisma), durdu: typeof duraklatmaVar === 'function' && duraklatmaVar('cakisma'),
    inert: [...document.getElementById('screen').children].filter(c => c !== o).every(c => c.inert),
    an: OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika, kayit: localStorage.getItem('chairman:oyun-1') }; }"""


async def yokla(pg, js, sure=30):
    """Koşul doğru olana dek js'i 250 ms arayla değerlendirir (iki sayfalı bağlamda Playwright'ın kare tabanlı beklemesi arka plandaki sayfada
    çözülmüyor; R1-a). Sayfa gezinirken değerlendirme düşerse yeniden dener. Süre dolarsa False."""
    son = asyncio.get_event_loop().time() + sure
    while asyncio.get_event_loop().time() < son:
        try:
            if await pg.evaluate(js):
                return True
        except Exception:
            pass
        await asyncio.sleep(0.25)
    return False


ODA_HAZIR_JS = "() => typeof OYUN !== 'undefined' && !!OYUN.kariyer && !!document.querySelector('#oda:not([hidden]) .od-ana')"
ORTU_JS = "() => !!document.querySelector('.ckm-ortu')"


async def bolum_28(tarayici, site, tum_hatalar):
    """R1-a (2026-10-29): aynı kariyer iki pencerede. Öndeki pencere yazınca geride kalan pencerede örtü kendiliğinden belirir (storage olayı);
    komut uygulanmaz, kayıt değişmez; klavye alttaki oyuna gitmez; “Kayıttan yeniden aç” öndeki pencerenin anında odayı açar."""
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    sayfalar = []
    for _ in range(2):
        pg = await baglam.new_page()
        pg.on("pageerror", lambda e: tum_hatalar.append("Betik hatası: " + str(e)))
        # TEST içerikli sayfa: İlerle'nin maç gününden önce durakları var (öndeki pencere iki kez yazabilsin); maç günündeki Stada git kayıt yazmaz
        await pg.goto((site / "index-test.html").as_uri() + "?dunya=7&pul=0")
        await yokla(pg, ODA_HAZIR_JS)
        sayfalar.append(pg)
    p1, p2 = sayfalar
    a1, a2 = await p1.evaluate(CAKISMA_JS), await p2.evaluate(CAKISMA_JS)
    denetle("R1-a: iki pencere aynı kaydı açar; çakışma yok", a1["an"] == a2["an"] and a1["kayit"] == a2["kayit"] and not a1["ortu"] and not a2["ortu"],
            f"{a1['an']} · {a2['an']}")
    await oda_ilerle(p1)
    await yokla(p2, ORTU_JS, 10)
    b1, b2 = await p1.evaluate(CAKISMA_JS), await p2.evaluate(CAKISMA_JS)
    denetle("R1-a: öndeki pencere İlerle'yle yazınca geride kalanda örtü kendiliğinden belirir; düğmede odak, sahne duraklatılmış, alttaki her şey etkileşimsiz",
            b1["an"] != a1["an"] and not b1["ortu"] and b2["ortu"] and b2["odak"] and b2["rol"] == "alertdialog" and b2["cakisma"] and b2["durdu"] and b2["inert"]
            and "Kayıtta:" in b2["metin"] and "Bu pencerede:" in b2["metin"], f"{b1['an']} · {b2['metin'][:120]!r}")
    deneme = await p2.evaluate("() => { try { oyunKomut(k => duragaIlerle(k)); return 'uygulandı'; } catch (e) { return e.cakisma ? 'çakışma' : e.message; } }")
    # odak örtünün dışına alınır (boşluğa tıklama); nesne tuşları yine alttaki oyuna gitmemeli ve odak düğmeye döner
    await p2.click(".ckm-ortu", position={"x": 8, "y": 8})
    await p2.keyboard.press("Digit1")
    await p2.keyboard.press("Digit3")
    c2 = await p2.evaluate(CAKISMA_JS)
    telefon = await p2.evaluate("() => !!document.querySelector('#oda section.odk:not(.odk-cikis)')")
    denetle("R1-a: geride kalan pencerede komut uygulanmaz, kayıt öndekinde kalır; tuşlar alttaki oyuna gitmez",
            deneme == "çakışma" and c2["kayit"] == b1["kayit"] and c2["an"] == a2["an"] and not telefon and c2["odak"], f"{deneme} · odak açık: {telefon}")
    await p2.screenshot(path=str(ARAC / "son-akis-28-cakisma.png"))
    async with p2.expect_navigation(wait_until="commit", timeout=30000):
        await p2.click(".ckm-ac")
    await yokla(p2, ODA_HAZIR_JS)
    d2 = await p2.evaluate(CAKISMA_JS)
    denetle("R1-a: “Kayıttan yeniden aç” öndeki pencerenin anında odayı açar; örtü yok", d2["an"] == b1["an"] and not d2["ortu"] and not d2["cakisma"], d2["an"])
    await oda_ilerle(p2)
    await yokla(p1, ORTU_JS, 10)
    e1 = await p1.evaluate(CAKISMA_JS)
    denetle("R1-a: ters yönde de: yenilenen pencere ilerleyince eski öndeki pencerede örtü belirir", e1["ortu"] and e1["cakisma"] and d2["an"] != (await p2.evaluate(CAKISMA_JS))["an"], e1["an"])
    await baglam.close()


ANA_JS = "() => localStorage.getItem('chairman:oyun-1')"


async def ayar_kayit_ac(pg):
    await masaya_don(pg)
    await pg.click('.od-nesne[data-panel="ayar"]')
    await pg.click('[data-eylem="ayarBolum"][data-bolum="kayit"]')


async def bolum_29(tarayici, site, tum_hatalar):
    """R1-b (2026-10-29): Ayarlar › Kayıt'ta kaydı dışa aktarma (dosya ana kayıt metninin kendisi) ve kayıt dosyası yükleme (önce doğrulama ve onay,
    sonra yazım; şimdiki kayıt .ice-oncesi'nde; oyun dosyadaki kariyerle yeniden açılır); bozuk dosya reddedilir, kayıt değişmez."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await ayar_kayit_ac(pg)
    async with pg.expect_download() as bilgi:
        await pg.click('[data-eylem="kayitDisa"]')
    indirilen = await bilgi.value
    metin = pathlib.Path(await indirilen.path()).read_text(encoding="utf-8")
    ana = await pg.evaluate(ANA_JS)
    denetle("R1-b: dışa aktarılan dosya kaydın kendisi (ana metinle birebir); ad kulübü ve oyun anını taşır",
            metin == ana and indirilen.suggested_filename == "chairman-demirkapi-2026-11-23-0800.json", indirilen.suggested_filename)
    ornek = ARAC / "ornekler" / "kayit-s10-hafta14.json"
    veri = json.loads(ornek.read_text(encoding="utf-8"))["veri"]
    async with pg.expect_file_chooser() as secici:
        await pg.click('[data-eylem="kayitIce"]')
    await (await secici.value).set_files(str(ornek))
    await yokla(pg, "() => !!document.querySelector('.od-iceOnay')", 10)
    onay = await pg.evaluate("() => { const o = document.querySelector('.od-iceOnay'); return o ? o.innerText : ''; }")
    denetle("R1-b: seçilen dosya önce doğrulanır; onay dosyadaki ve şimdiki kariyeri yan yana gösterir, eski sürümü söyler; kayıt henüz değişmedi",
            "Dosyadaki kariyer" in onay and "Şimdiki kariyer" in onay and "10→11" in onay and await pg.evaluate(ANA_JS) == ana, onay[:200])
    await pg.screenshot(path=str(ARAC / "son-akis-29-ice.png"))
    async with pg.expect_navigation(wait_until="commit", timeout=30000):
        await pg.click('[data-eylem="kayitIceYukle"]')
    await yokla(pg, ODA_HAZIR_JS)
    s = await pg.evaluate("() => ({ an: OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika, surum: OYUN.kariyer.kayitSurumu, guncel: KARIYER_SURUM,"
                          " yedek: localStorage.getItem('chairman:oyun-1.ice-oncesi'), bozuk: !!document.querySelector('.od-bozuk') })")
    denetle("R1-b: “Yükle”den sonra oda dosyadaki kariyerle açılır (sürüm güncel); önceki kayıt yedekte",
            s["an"] == f"{veri['tarih']} {veri['gunIciDakika']}" and s["surum"] == s["guncel"] and s["yedek"] == ana and not s["bozuk"], f"{s['an']} · sürüm {s['surum']}")
    ana2 = await pg.evaluate(ANA_JS)
    bozuk = site.parent / "bozuk-kayit.json"
    bozuk.write_text('{"oyun":"chairman","bicim":1,"saglama":"00000000","ozet":{},"veri":{"kayitSurumu":11}}', encoding="utf-8")
    await ayar_kayit_ac(pg)
    async with pg.expect_file_chooser() as secici:
        await pg.click('[data-eylem="kayitIce"]')
    await (await secici.value).set_files(str(bozuk))
    await yokla(pg, "() => document.body.innerText.includes('Kayıt dosyası açılamadı')", 10)
    r = await pg.evaluate("() => ({ onay: !!document.querySelector('.od-iceOnay'), metin: document.body.innerText.includes('sağlama tutmuyor') })")
    denetle("R1-b: bozuk dosya reddedilir, nedeni yazılır; onay açılmaz, kayıt değişmez", not r["onay"] and r["metin"] and await pg.evaluate(ANA_JS) == ana2, str(r))
    await pg.context.close()


YENI_GOVDE_JS = """() => { const g = document.querySelector('.tel-govde'), y = g && g.querySelector('.tel-yeni'); if (!g) return null; const a = g.getBoundingClientRect();
  const r = y ? y.getBoundingClientRect() : null;
  return { st: Math.round(g.scrollTop), alt: g.scrollTop + g.clientHeight >= g.scrollHeight - 8, kayar: g.scrollHeight > g.clientHeight + 8,
    yeni: r ? { ust: Math.round(r.top - a.top), gorunur: r.top >= a.top - 1 && r.top <= a.bottom - 20 } : null }; }"""
MENU_JS = """() => { const b = document.querySelector('.tel-yeniKonu button'), a = document.activeElement;
  return { bos: (document.querySelector('.tlf-is .tlf-bos') || {}).textContent || '', dugme: b ? b.getAttribute('aria-expanded') : null, kapali: b ? b.disabled : null,
    menu: !!document.querySelector('.tlf-menu'), basliklar: [...document.querySelectorAll('.tlf-menu .tlf-kategori span')].map(x => x.textContent),
    simge: document.querySelectorAll('.tlf-menu .tlf-kSimge').length, tek: !!document.querySelector('.tlf-is.tlf-tekKart'), kart: document.querySelectorAll('.tlf-is .kk-kart').length,
    odak: a && a.closest && a.closest('.tel-yeniKonu') ? 'yeni' : a ? a.className : '', ekran: (document.querySelector('.tel-ekran') || { dataset: {} }).dataset.ekran }; }"""
ESIK_JS = """() => { const i = document.querySelector('.tlf-is .kk-ipucu'), e = i && i.querySelector('.kk-esik'), c = document.querySelector('.tlf-is .kk-kart');
  const u = c && c.querySelector(':scope>.kk-ust');
  return i ? { yon: e.dataset.yon || null, oran: +(e.style.getPropertyValue('--kk-oran') || 0), hazir: i.hasAttribute('data-hazir'), yazi: i.querySelector('p').textContent,
    ust: u ? u.textContent : null, kartHazir: !!c && c.hasAttribute('data-hazir'), yuz: c ? c.dataset.yuz : null } : null; }"""


TLF_YER_JS = """() => { const s = document.querySelector('#oda section.odk'), e = document.querySelector('#oda .tlf'), t = e && e.querySelector('.tel'), i = e && e.querySelector('.tlf-is');
  if (!s || !t) return null; const a = s.getBoundingClientRect(), b = t.getBoundingClientRect();
  return { boy: s.dataset.boy, yalniz: e.classList.contains('tlf-yalniz'), panel: !!i, merkez: Math.abs((b.left + b.right) / 2 - (a.left + a.right) / 2) <= 2,
    yan: !!i && b.right <= i.getBoundingClientRect().left + 1, ekran: (document.querySelector('.tel-ekran') || { dataset: {} }).dataset.ekran }; }"""


async def balkona_atla(pg):
    """RN: balkona çıkar ve yürüyüşü tıklayarak atlar (yürüyüşün kendisi §15'te; dizüstünde gerçek zaman beklemesi B42)."""
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'yolda'", timeout=10000)
    kb = await pg.evaluate("() => { const r = document.getElementById('oda').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }")
    await pg.mouse.click(kb[0], kb[1])
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)


async def tlf_yer(pg):
    """RN-a: telefonun yeri, kayma geçişi bittikten sonra (0,28 sn; kare işlenemezse 0,36 sn'de kesilir)."""
    await pg.wait_for_timeout(500)
    return await pg.evaluate(TLF_YER_JS)


async def bolum_30(tarayici, site, tum_hatalar):
    """R2 (2026-10-29): odada iki sütunlu telefon — solda cihaz, sağda iş paneli. R2 eki: panel tek iş (karar varsa yalnız kart), konular “Yeni konu aç”
    menüsünde (başlıklı), cevaplar kartta gizli. Oyuncu sorusu uçtan uca (seçim panelde, Esc seçimi kapatır, giden
    mesaj, İlerle, cevap, oyuncunun dosyasında not; dosyadan “Hocaya sor ▸”), RN-a: panel yalnız iş varken (telefon önce ortada, iş çıkınca sola kayar;
    Bekleyenler kalktı, bildirimler ana ekranda), okuma yeri (yeni mesajda
    ilk yeni, yoksa bırakılan yer), kartın eşik ipucu (sürüklerken çubuk dolar, eşikte “Bırak:”), balkonda tek telefon."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    hid = await pg.evaluate("() => OYUN.kariyer.kulupler.demirkapi.hocaId")
    yid = await pg.evaluate("() => personelKisisi(OYUN.kariyer, 'yardimciAntrenor').id")
    await pg.keyboard.press("Digit1")
    y0 = await tlf_yer(pg)
    denetle("RN-a: odada telefon odak kabının 'telefon' boyunda; ana ekranda panel yok (Bekleyenler kalktı), telefon kabın ortasında (≤ 2 px)",
            y0 == {"boy": "telefon", "yalniz": True, "panel": False, "merkez": True, "yan": False, "ekran": "ana"}, str(y0))
    # oyuncu sorusu: konu menüdür — seçim panelde açılır (mevkiye göre; yalnız forma ve ad), Esc önce seçimi kapatır
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{hid}"]')
    t0 = await durum(pg)
    # R2 eki: panel tek iş gösterir; konular “Yeni konu aç” menüsünde (başlıklı, simgeli); Esc önce menüyü kapatır.
    # RN-a: karar ve bekleme yokken panel yok, telefon ortada; menü açılınca panel belirir ve telefon sola kayar (geçiş sürerken telefonda dönüşüm var)
    ym0 = await tlf_yer(pg)
    m0 = await pg.evaluate(MENU_JS)
    await pg.click('.tel-yeniKonu button')
    kay = await pg.evaluate("() => { const t = document.querySelector('#oda .tlf-sol .tel'), p = document.querySelector('#oda .tlf .tlf-is'); return { t: getComputedStyle(t).transform, belir: !!p && p.classList.contains('tlf-isBelir') }; }")
    ym1 = await tlf_yer(pg)
    kay1 = await pg.evaluate("() => getComputedStyle(document.querySelector('#oda .tlf-sol .tel')).transform")
    m1 = await pg.evaluate(MENU_JS)
    await pg.keyboard.press("Escape")
    ym2 = await tlf_yer(pg)
    m2 = await pg.evaluate(MENU_JS)
    denetle("RN-a: işsiz konuşmada panel yok, telefon ortada; “Yeni konu aç” → panel belirir, telefon sola kayar (geçiş başında dönüşüm var, sonunda yok; telefon panelin solunda); "
            "Esc menüyü kapatınca telefon ortaya",
            ym0["yalniz"] and ym0["merkez"] and not ym0["panel"] and ym0["ekran"] == "konusma" and kay["t"] != "none" and kay["belir"]
            and ym1["panel"] and ym1["yan"] and not ym1["yalniz"] and kay1 == "none" and ym2["yalniz"] and ym2["merkez"] and not ym2["panel"],
            f"{ym0} · {kay} · {ym1} · {kay1} · {ym2}")
    denetle("R2 eki: konuşmada panel sakin, telefonun altında “Yeni konu aç”; basınca panelde başlıklı konu menüsü (Takım, Görüşme, R4: Transfer; simgeli), "
            "odak ilk konuda; Esc menüyü kapatır, odak düğmede, konuşma yerinde",
            m0["dugme"] == "false" and not m0["menu"] and m1["menu"] and m1["basliklar"] == ["Takım", "Görüşme", "Transfer"]
            and m1["simge"] == 3 and m1["dugme"] == "true" and m1["odak"] == "tlf-konu" and not m2["menu"] and m2["dugme"] == "false" and m2["odak"] == "yeni"
            and m2["ekran"] == "konusma" and await durum(pg) == t0, f"{m0} · {m1} · {m2}")
    await konu_sec(pg, "yaz.teknikDirektor.oyuncu")
    sec1 = await pg.evaluate("""() => ({ n: document.querySelectorAll('.tlf-oyuncular [data-arg]').length, kadro: kulupOyunculari(OYUN.kariyer, 'demirkapi').length,
      mevki: [...document.querySelectorAll('.tlf-oyuncular h6')].map(h => h.textContent).join(','),
      acik: document.querySelector('.tlf-konu[data-girisim="yaz.teknikDirektor.oyuncu"]').getAttribute('aria-expanded'), odak: !!(document.activeElement && document.activeElement.dataset.arg) })""")
    await pg.keyboard.press("Escape")
    sec2 = await pg.evaluate("""() => ({ n: document.querySelectorAll('.tlf-oyuncular').length, ekran: document.querySelector('.tel-ekran').dataset.ekran,
      odak: document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.girisim || '' : '' })""")
    denetle("R2-e: “Oyuncu hakkında sor” seçimi panelde açar (bütün kadro, dört mevki; odak ilk oyuncuda; zaman akmaz); Esc önce seçimi kapatır, konuşma yerinde, odak konuda",
            sec1["n"] == sec1["kadro"] and sec1["n"] >= 18 and sec1["mevki"] == "Kaleci,Savunma,Orta saha,Forvet" and sec1["acik"] == "true" and sec1["odak"]
            and sec2 == {"n": 0, "ekran": "konusma", "odak": "yaz.teknikDirektor.oyuncu"} and await durum(pg) == t0, f"{sec1} · {sec2}")
    oy = await pg.evaluate("""() => { const k = OYUN.kariyer, D = k.kulupler.demirkapi.kadro, p = D.ilk11.map(id => k.oyuncular[id]).find(p => !p.sakat && !(p.ceza && p.ceza.mac > 0));
      return { id: p.id, ad: yzOyuncu(k, p.id) }; }""")
    await konu_sec(pg, "yaz.teknikDirektor.oyuncu")
    await pg.click(f'.tlf-oyuncular [data-arg="{oy["id"]}"]')
    gid = await pg.evaluate("""() => ({ giden: [...document.querySelectorAll('.tel .tel-giden')].map(e => e.textContent).pop() || '', secim: document.querySelectorAll('.tlf-oyuncular').length,
      bekle: [...document.querySelectorAll('.tlf-is .tlf-bekleme')].map(x => x.textContent) })""")
    denetle("R2-e: oyuncuyu seçince soru gider: telefonda giden balon “<ad> hakkında ne düşünüyorsun?”, panelde tek bekleme satırı, seçim kapandı",
            gid["giden"].startswith(oy["ad"] + " hakkında ne düşünüyorsun?") and gid["secim"] == 0 and len(gid["bekle"]) == 1
            and gid["bekle"][0].startswith("Şükrü Hoca'dan cevap bekleniyor."), str(gid))
    # yardımcıdan görüşme iste (karar doğuracak). RN-a: Bekleyenler kalktı — ana ekranda panel yok; beklenen cevap konuşmanın kendisinde
    await pg.click('.tel-kisiBas .tel-geri')
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{yid}"]')
    await konu_sec(pg, "yaz.yardimciAntrenor.gorusme")
    await pg.click('.tel-kisiBas .tel-geri')
    await pg.click('.tel [data-eylem="telEv"]')
    yb = await tlf_yer(pg)
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    yl = await tlf_yer(pg)
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{hid}"]')
    yh = await tlf_yer(pg)
    bek = await pg.evaluate("() => [...document.querySelectorAll('#oda .tlf-is .tlf-bekleme')].map(x => x.textContent)")
    denetle("RN-a: ana ekranda ve Mesajlar'da panel yok (telefon ortada); hocanın konuşmasında beklenen cevap panelde tek bekleme satırı, telefon solda (iki sütun)",
            not yb["panel"] and yb["merkez"] and not yl["panel"] and yl["merkez"] and yl["ekran"] == "mesajlar" and yh["panel"] and yh["yan"]
            and len(bek) == 1 and bek[0].startswith("Şükrü Hoca'dan cevap bekleniyor."), f"{yb} · {yl} · {yh} · {bek}")
    await masaya_don(pg)
    for _ in range(6):
        if await pg.evaluate("() => !Object.values(OYUN.kariyer.isler).some(x => x.tur === 'gelisme' && x.veri.gelisme === 'yazismaCevap')"):
            break
        await oda_ilerle(pg)
        await yokla(pg, "() => !document.querySelector('.od-alt .od-ana[data-eylem=\"ilerle\"]') || !/İlerliyor/.test(document.querySelector('.od-alt .od-ana').textContent)", 20)
    await pg.keyboard.press("Digit1")
    bd = await pg.evaluate("""() => [...document.querySelectorAll('#oda .tel-bildirim')].map(b => ({ kisi: b.dataset.kisi || '', bekliyor: !!b.querySelector('.tel-bekliyor'), yazi: b.textContent }))""")
    denetle("RN-a: cevaplar gelince ana ekranın bildirimleri (Bekleyenler'in yerine): yardımcının kartında “Cevap bekliyor” (görüşme kararı), hocanınki yeni mesaj; panel yok",
            {x["kisi"] for x in bd} == {hid, yid} and any(x["kisi"] == yid and x["bekliyor"] for x in bd) and any(x["kisi"] == hid and not x["bekliyor"] for x in bd)
            and not await pg.query_selector('#oda .tlf .tlf-is'), str(bd))
    # okuma yeri: dar pencerede (konuşma kayar) bildirimden hocanın konuşması → ilk yeni mesaj görünür; başa kaydırıp çıkınca ve yeniden açınca yer korunur
    await pg.set_viewport_size({"width": 672, "height": 600})
    await ayar_yazi(pg, "buyuk")
    await pg.keyboard.press("Digit1")
    await pg.click(f'#oda .tel-bildirim[data-kisi="{hid}"]')
    ok1 = await pg.evaluate(YENI_GOVDE_JS)
    cevap = await pg.evaluate("() => [...document.querySelectorAll('.tel .tel-gelen')].map(e => e.querySelector('p').textContent).pop() || ''")
    await pg.evaluate("() => { document.querySelector('.tel-govde').scrollTop = 0; }")
    await masaya_don(pg)
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await pg.click(f'.tel [data-eylem="telKisi"][data-kisi="{hid}"]')
    ok2 = await pg.evaluate(YENI_GOVDE_JS)
    denetle("R2-b: konuşma yeni mesajla açılınca ilk yeni mesaj görünür; okuyup başa dönüp çıkınca, masadan yeniden açılışta (yeni yok) aynı yer (en alta atlamaz)",
            ok1 and ok1["yeni"] and ok1["yeni"]["gorunur"] and ok2 and ok2["kayar"] and ok2["st"] == 0 and not ok2["alt"] and ok2["yeni"] is None, f"{ok1} · {ok2}")
    denetle("R2-e: hocanın cevabı kendi gözüyle: “<ad> ilk tercihlerimden …”; metinde rakam yok",
            cevap.startswith(oy["ad"] + " ilk tercihlerimden") and not any(ch.isdigit() for ch in cevap), cevap)
    await masaya_don(pg)
    await ayar_yazi(pg, "normal")
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    # dosyada not ve “Hocaya sor ▸”: oyuncunun dosyasında hocanın sözü tarihli not; buradan sormak aynı soruyu gönderir, düğme beklerken kapalı
    await pg.keyboard.press("Digit3")
    await pg.wait_for_selector(".dsy", timeout=10000)
    if await pg.query_selector('.dsy-kadroSekme[aria-selected="false"]'):
        await pg.click(".dsy-kadroSekme")
    await pg.click(f'.dsy [data-eylem="oyuncuAc"][data-oyuncu="{oy["id"]}"]')
    ds1 = await pg.evaluate("""() => ({ notlar: [...document.querySelectorAll('.dsy-not')].map(n => n.textContent), dugme: (() => { const b = document.querySelector('.dsy-sor button');
      return b ? { yazi: b.textContent, kapali: b.disabled, arg: b.dataset.arg } : null; })() })""")
    await pg.click(".dsy-sor button")
    ds2 = await pg.evaluate("""() => ({ mesaj: (document.querySelector('.od-mesaj') || {}).textContent || '', kapali: (document.querySelector('.dsy-sor button') || {}).disabled,
      neden: (document.querySelector('.dsy-sor small') || {}).textContent || '', bekleyen: Object.values(OYUN.kariyer.isler).filter(x => x.tur === 'gelisme' && x.veri.gelisme === 'yazismaCevap').map(x => x.veri.oyuncuId) })""")
    denetle("R2-e: oyuncunun dosyasında hocanın cevabı not (“…” — Şükrü Hoca); “Hocaya sor ▸” aynı soruyu gönderir (Mesaj gitti), sonra düğme kapalı ve nedeni yazılı",
            any(cevap in n and "Şükrü Hoca" in n for n in ds1["notlar"]) and ds1["dugme"] == {"yazi": "Hocaya sor ▸", "kapali": False, "arg": oy["id"]}
            and "Mesaj gitti" in ds2["mesaj"] and ds2["kapali"] and "cevabını bekliyorsun" in ds2["neden"] and ds2["bekleyen"] == [oy["id"]], f"{ds1['dugme']} · {ds2}")
    await masaya_don(pg)
    # kartın eşik ipucu: yardımcının görüşme kartı panelde; sürüklerken çubuk o yöne dolar, eşikte “Bırak: <cevap>” (üst etiket) ve hazır; geri bırakınca uygulanmaz
    await pg.keyboard.press("Digit1")
    await pg.click(f'#oda .tel-bildirim[data-kisi="{yid}"]')
    tk = await pg.evaluate(MENU_JS)
    denetle("R2 eki: karar varken panelde yalnız kart (tek kart düzeni; menü ve boş durum yok), “Yeni konu aç” kapalı",
            tk["tek"] and tk["kart"] == 1 and not tk["menu"] and not tk["bos"] and tk["kapali"], str(tk))
    e0 = await pg.evaluate(ESIK_JS)
    await pg.locator(".tlf-is .kk-kart").scroll_into_view_if_needed()
    r = await pg.evaluate(KART_TUT2_JS, [".tlf-is", ".kk-kart"])
    t1 = await durum(pg)
    await pg.mouse.move(r["x"], r["y"])
    await pg.mouse.down()
    await pg.mouse.move(r["x"] + 0.2 * r["g"], r["y"], steps=6)
    e1 = await pg.evaluate(ESIK_JS)
    await pg.mouse.move(r["x"] + 1.2 * r["g"], r["y"], steps=6)
    e2 = await pg.evaluate(ESIK_JS)
    await pg.screenshot(path=str(ARAC / "son-akis-30-esik.png"))
    await pg.mouse.move(r["x"], r["y"], steps=6)
    await pg.mouse.up()
    await pg.wait_for_timeout(350)
    e3 = await pg.evaluate(ESIK_JS)
    denetle("R2-d, R2 eki: kartın altında ipucu (“Cevabı görmek için kartı kaydır”); sürüklerken yüz o cevaba döner, çubuk dolar (“Eşiğe kadar kaydır: …”), eşikte kart ve çubuk hazır, ipucu “Bırak: <cevap>”; "
            "üst etiket hep künye; geri bırakınca uygulanmadı, ipucu dinlenmeye döndü",
            e0 and e0["yazi"].startswith("Cevabı görmek için kartı kaydır") and e0["yuz"] == "notr" and e1["yon"] == "sag" and e1["yuz"] == "sag" and 0 < e1["oran"] < 1
            and e1["yazi"].startswith("Eşiğe kadar kaydır: ") and not e1["hazir"] and e2["hazir"] and e2["kartHazir"] and e2["oran"] == 1 and e2["yazi"].startswith("Bırak: Şu gün olsun")
            and e3["yon"] is None and e3["yazi"] == e0["yazi"] and e0["ust"] == e1["ust"] == e2["ust"] == e3["ust"] and e0["ust"].startswith("Tahsin")
            and not e3["kartHazir"] and await durum(pg) == t1, f"{e0} · {e1} · {e2} · {e3}")
    await masaya_don(pg)
    # balkonda tek telefon (iş sağ yarıda; R5'te yeniden düzenlenir). RN: yürüyüş tıklayınca atlanır (yürüyüş §15'te; dizüstünde gerçek zaman beklemesi B42)
    await balkona_atla(pg)
    await pg.keyboard.press("Digit1")
    bl = await pg.evaluate("() => ({ boy: (document.querySelector('#oda section.odk') || { dataset: {} }).dataset.boy, iki: !!document.querySelector('.tlf'), tel: !!document.querySelector('.tel') })")
    denetle("R2-a: balkonda telefon tek cihaz ('cihaz' boyu; iş paneli yok)", bl == {"boy": "cihaz", "iki": False, "tel": True}, str(bl))
    await pg.context.close()


async def bolum_31(tarayici, site, tum_hatalar):
    """R3: Canlı Skor sayfaları — sürüm 11 örnek kaydı (araclar/ornekler/kayit-s11-hafta14.json; tohum 7, 14. hafta sonu): hafta görünümü tarafsız;
    maç sayfası dört bölüm (Özet akışı, devre ayracı, dakika biçimi; İstatistikler; Kadrolar: diziliş, ilk on bir, yedekler, değişiklikler, eksikler;
    Puan durumu); oyuncu ve takım sayfası; kamuya açık bilgi sınırı; sağ panelde gezinti ve Esc; okuma yeri (B44); balkonda tek telefonda sayfa"""
    ornek = (ARAC / "ornekler" / "kayit-s11-hafta14.json").read_text(encoding="utf-8")
    baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
    await baglam.add_init_script("""(m => { if (!sessionStorage.getItem('__s11')) { sessionStorage.setItem('__s11', '1'); localStorage.setItem('chairman:oyun-1', m); } })(""" + json.dumps(ornek) + ")")
    pg = await baglam.new_page()
    pg.on("pageerror", lambda e: tum_hatalar.append("Betik hatası: " + str(e)))
    await pg.goto((site / "index.html").as_uri() + loca(""))
    await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=30000)
    d0 = await durum(pg)
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    hs = await pg.evaluate(HAFTA_JS)
    bitti = await pg.evaluate("() => [...document.querySelectorAll('.tel .tel-mac small')].filter(e => e.textContent === 'Bitti').length")
    denetle("R3-c: maç akşamı hafta görünümü 14. haftayla açılır; sekiz maç bitti, her satırda iki arma; Demirkapı'nın satırı öbürleriyle aynı sınıfta (ayrıcalık yok)",
            hs["h"] == "14. hafta" and hs["n"] == 8 and bitti == 8 and hs["arma"] == 16 and hs["sinif"] == "tel-mac", f"{hs['h']} · {hs['n']} · {bitti} bitti · {hs['sinif']}")
    mid = await pg.evaluate("() => OYUN.kariyer.fikstur.find(f => f.hafta === 14 && (f.ev === 'demirkapi' || f.konuk === 'demirkapi')).id")
    metinler = []
    await cs_ac(pg, "mac", mid)
    m = await pg.evaluate(MAC_SAYFA_JS, mid)
    metinler.append(await pg.text_content(".tlf-is .cs-sayfa"))
    await pg.screenshot(path=str(ARAC / "son-akis-31-mac.png"))
    denetle("R3-d: maç sayfası sağ panelde: başlıkta iki kulüp (dokunulur), skor ve devre arası skoru, künyede hafta; bölümler Özet · İstatistikler · Kadrolar · Puan durumu",
            m["panel"] and m["bas"] == m["skorBek"] and m["iy"] == "İY " + m["iyAyrac"] and m["kulup"] == 2 and "14. hafta" in m["kunye"] and m["bolum"] == "ozet,ist,kadro,tablo", str(m)[:300])
    denetle("R3-d Özet: gol, kart, değişiklik ve sakatlık tek akışta, sayıları kayıtla aynı; devre arası ayracının skoru ilk yarı gollerine, ardından gelen gol satırları ikinci yarıya uyar; maç sonu ayracı; dakikalar 45+2' biçiminde",
            m["olay"] == m["olayBek"] and len(m["ayrac"]) == 2 and m["ayrac"][1] == "Maç sonu · " + m["skorBek2"] and m["iyToplam"] == m["golOnce"]
            and m["golSonra"] == m["golSonraBek"] and m["dkBicim"], f"{m['olay']} · {m['olayBek']} · {m['ayrac']} · önce {m['golOnce']} sonra {m['golSonra']}/{m['golSonraBek']}")
    await cs_bolum(pg, "ist")
    ist = await pg.evaluate(IST_JS, mid)
    metinler.append(await pg.text_content(".tlf-is .cs-sayfa"))
    denetle("R3-d İstatistikler: 10 satır; şut ve beklenen gol kayıttan; başlıkta iki arma", ist == {"n": 10, "sut": True, "xg": True, "arma": 2}, str(ist))
    await cs_bolum(pg, "kadro")
    kd = await pg.evaluate(KADRO_JS, mid)
    metinler.append(await pg.text_content(".tlf-is .cs-sayfa"))
    await pg.screenshot(path=str(ARAC / "son-akis-31-kadro.png"))
    denetle("R3-d Kadrolar: iki takımın dizilişi, ilk on biri, yedekleri, değişiklikleri ve eksikleri kayıtla aynı sayıda; adlar oyuncu sayfasına bağlı",
            len(kd) == 2 and all(all(x.values()) for x in kd), str(kd))
    await cs_bolum(pg, "tablo")
    tb = await pg.evaluate("() => ({ n: document.querySelectorAll('.cs-sayfa .cs-tablo tbody tr').length, ilgili: document.querySelectorAll('.cs-sayfa .cs-tablo tr.cs-ilgili').length, arma: document.querySelectorAll('.cs-sayfa .cs-tablo .arma').length })")
    denetle("R3-d Puan durumu: 16 satır, maçın iki kulübü işaretli, armalı", tb == {"n": 16, "ilgili": 2, "arma": 16}, str(tb))
    await cs_bolum(pg, "kadro")
    oid = await pg.evaluate("(id) => { const s = OYUN.kariyer.maclar[id], g = s.goller.find(x => !x.kk); return g ? g.id : s.ilk11[0][0]; }", mid)
    await cs_ac(pg, "oyuncu", oid, ".cs-sayfa")
    oy = await pg.evaluate(OYUNCU_JS, [oid, mid])
    metinler.append(await pg.text_content(".tlf-is .cs-sayfa"))
    await pg.screenshot(path=str(ARAC / "son-akis-31-oyuncu.png"))
    denetle("R3-f: oyuncu sayfası: künye (ad, forma, kulüp bağı), bu sezon (maç, dakika, gol, kart), maç maç listesinde bu maç (dakika, gol), sağlık geçmişi; geri düğmesi maçın kısa adıyla",
            oy["ad"] and oy["kulup"] and oy["sezon"] and oy["bu"] and oy["saglik"] and oy["geri"].startswith("‹ ") and "–" in oy["geri"], str(oy))
    kid = await pg.evaluate("(id) => OYUN.kariyer.oyuncular[id].kulupId", oid)
    await cs_ac(pg, "kulup", kid, ".cs-sayfa")
    tk = {}
    for bol in ("genel", "maclar", "kadro", "ist"):
        await cs_bolum(pg, bol)
        tk[bol] = await pg.evaluate(TAKIM_JS, [kid, bol])
        metinler.append(await pg.text_content(".tlf-is .cs-sayfa"))
    await pg.screenshot(path=str(ARAC / "son-akis-31-kulup.png"))
    denetle("R3-e: takım sayfası (oyuncunun kulübünden): Genel (ad, büyük arma, sıradaki, stat), Maçlar (sezonun 18 maçı, 2'si skorlu), Kadro (bütün oyuncular), İstatistik (kayıtlı 2 maç, golcüler)",
            tk["genel"] == {"ad": True, "arma": True, "sirada": True, "stat": True} and tk["maclar"]["n"] == tk["maclar"]["beklenen"] == 18 and tk["maclar"]["oynanan"] == 2
            and tk["kadro"]["n"] == tk["kadro"]["beklenen"] and tk["ist"] == {"kayitli": True, "golculer": True}, str(tk))
    yasak = ["₺", "maaş", "sözleşme", "kondisyon", "yetenek", "dönüş", "potansiyel"]
    bulunan = sorted({y for t in metinler for y in yasak if y in t.lower()})
    denetle("R3: kamuya açık bilgi sınırı — maç, oyuncu ve takım sayfalarında maaş, sözleşme, dönüş tarihi ve gizli değer (kondisyon, yetenek) yok",
            not bulunan and len(metinler) == 8, f"{len(metinler)} sayfa · {bulunan}")
    zincir = []
    for _ in range(4):
        await pg.keyboard.press("Escape")
        zincir.append(await pg.evaluate(SAYFA_YERI_JS))
    denetle("R3-g: Esc sayfa yığınından birer geri: takım → oyuncu → maç (Kadrolar bölümü korunur) → liste → ana ekran",
            zincir == [["oyuncu", None, "skor"], ["mac", "kadro", "skor"], [None, None, "skor"], [None, None, "ana"]], str(zincir))
    # B44: sayfadan sayfaya geçip dönünce okuma yeri (sağ panel)
    await pg.set_viewport_size({"width": 1180, "height": 540})
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    await pg.click('.tel [data-eylem="skorSekme"][data-sekme="tablo"]')
    await cs_ac(pg, "kulup", "demirkapi")
    await cs_bolum(pg, "maclar")
    y0 = await pg.evaluate(KAYDIR_JS, "alt")
    son_mac = await pg.evaluate("() => [...document.querySelectorAll('.tlf-is .cs-maclar [data-eylem=csAc][data-tur=mac]')].pop().dataset.id")
    await cs_ac(pg, "mac", son_mac, ".cs-sayfa")
    y1 = await pg.evaluate(KAYDIR_JS, "oku")
    await pg.keyboard.press("Escape")
    y2 = await pg.evaluate(KAYDIR_JS, "oku")
    denetle("R3-g, B44: takım sayfasının okuma yeri korunur: Maçlar'ın sonundan bir maça girip Esc'le dönünce kaydırma yeri aynı; yeni sayfa baştan açılır",
            y0["y"] > 0 and y1["y"] == 0 and abs(y2["y"] - y0["y"]) <= 2 and y2["tur"] == "kulup", f"{y0} → {y1} → {y2}")
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    await masaya_don(pg)
    # balkonda tek telefon: sayfa telefonun içinde, telefonun ‹ Geri'siyle
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    await pg.keyboard.press("Digit1")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    await cs_ac(pg, "mac", mid)
    bk = await pg.evaluate("() => ({ ic: !!document.querySelector('.tel .cs-sayfa[data-tur=mac]'), panel: !!document.querySelector('.tlf-is'), liste: document.querySelectorAll('.tel .tel-mac').length, geri: !!document.querySelector('.tel [data-eylem=csGeri]') })")
    tb2 = await pg.evaluate(CS_TASMA_JS)
    await pg.wait_for_timeout(300)  # açılış geçişi bitsin
    await pg.screenshot(path=str(ARAC / "son-akis-31-balkon.png"))
    await pg.keyboard.press("Escape")
    bk2 = await pg.evaluate("() => ({ sayfa: !!document.querySelector('.cs-sayfa'), liste: document.querySelectorAll('.tel .tel-mac').length })")
    denetle("R3-g: balkonda tek telefon: maç sayfası telefonun içinde (liste yerine, ‹ Geri ile; iş paneli yok); taşma ≤ 1; Esc listeye döner",
            bk == {"ic": True, "panel": False, "liste": 0, "geri": True} and tb2["en"] <= 1 and bk2 == {"sayfa": False, "liste": 8}, f"{bk} · {tb2} · {bk2}")
    denetle("R3: Canlı Skor'da gezinti oyun zamanını ilerletmez", await durum(pg) == d0, "")
    await pg.context.close()



# ---- R4 (§32, §33): Transfer masası ve transfer zinciri ----
TM_JS = """() => { const m = document.querySelector('#oda .tm-masa'); if (!m) return null;
  return { bolum: m.dataset.bolum, sekme: [...m.querySelectorAll('.tm-sekmeler [data-bolum]')].map(b => b.dataset.bolum + (b.getAttribute('aria-pressed') === 'true' ? '*' : '')).join(','),
    donem: (m.querySelector('.tm-donem') || {}).textContent || '', sonGun: !!m.querySelector('.tm-donem.tm-sonGun'),
    oyuncu: m.querySelectorAll('.tm-oyuncu').length, dosya: m.querySelectorAll('.tm-dosya').length,
    kagit: (m.querySelector('.tm-kagit') || {dataset: {}}).dataset.oyuncu || null,
    eylem: [...m.querySelectorAll('.tm-eylemler [data-eylem]')].map(b => b.dataset.eylem + (b.disabled ? '-' : '')).join(','), metin: m.textContent } }"""

# maç gününde bir yapay hafta (0–0; oyunun komut yoluyla)
HAFTA_YAPAY_JS = """() => { const k = OYUN.kariyer, Z = {skor: [0, 0], bitti: true, goller: [], kartlar: [], sakatliklar: [], degisiklikler: [], ist: {}};
  const j = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.eylem === 'macGunu'), id = j.veri.macId;
  oyunKomut(x => ajandaIsiYap(x, j.id));
  oyunKomut(x => haftaSonuclariUygula(x, id, Z, macTohumu(7, id), {}, haftaninDigerMaclari(x, id).map(g => ({macId: g.id, sonuc: Z, tohum: macTohumu(7, g.id)})))); }"""
# yapay haftalarla (0–0) verilen ana dek sürer; zincir dışındaki kararlarda reddet ya da ilk cevap (oyunun kendi komut yolu, oyunKomut)
SUR_JS = """async (bitis) => {
  const Z = {skor: [0, 0], bitti: true, goller: [], kartlar: [], sakatliklar: [], degisiklikler: [], ist: {}};
  for (let i = 0; i < 500; i++) {
    const k = OYUN.kariyer;
    if (k.tarih >= bitis && Object.values(k.isler).some(x => x.tur === 'ajanda' && x.veri.karar === 'sablonKarti')) return k.tarih + ' ' + k.gunIciDakika;
    const kr = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.karar && x.veri.karar !== 'sablonKarti');
    if (kr) { const S = ajandaOnizle(k, kr.id).secenekler; oyunKomut(x => ajandaIsiYap(x, kr.id, (S.find(s => s.id === 'reddet') || S[0]).id)); continue; }
    const j = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.eylem === 'macGunu');
    if (j && j.tarih === k.tarih && j.dakika === k.gunIciDakika) { const id = j.veri.macId;
      oyunKomut(x => ajandaIsiYap(x, j.id));
      oyunKomut(x => haftaSonuclariUygula(x, id, Z, macTohumu(7, id), {}, haftaninDigerMaclari(x, id).map(g => ({macId: g.id, sonuc: Z, tohum: macTohumu(7, g.id)}))));
      continue; }
    oyunKomut(x => duragaIlerle(x));
  }
  return 'bitmedi ' + OYUN.kariyer.tarih; }"""


async def bolum_32(tarayici, site, tum_hatalar):
    """R4-k: Transfer masası — masada Transfer (6) odak kabında; Pano (dönem sayacı, kasa, açık işler, takip), Piyasa (serbestler, forma bulamayanlar,
    sözleşmesi bitecekler; gizli değer ve maaş yok), oyuncu kâğıdı (künye, bildiklerimiz, eylemler; ‹ Geri bölüme), takibe al (zaman almaz) ve Takip,
    Hocaya araştırt (dosya açılır, Pano'da aşamasıyla; dosyada aşama satırı; ‹ Transfer), Geçmiş, Duraklat'ta eylemler kapalı, Esc zinciri."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await pg.set_viewport_size({"width": 1100, "height": 810})
    nesne = await pg.evaluate("() => [...document.querySelectorAll('.od-nesneler .od-nesne[data-panel]')].map(b => b.dataset.panel).join(',')")
    await pg.keyboard.press("Digit6")
    t = await pg.evaluate(TM_JS)
    o = await odak(pg)
    denetle("R4-k: masada Transfer (6) odak kabında (geniş, başlık Transfer); Pano · Takip · Piyasa · Geçmiş; dönem kapalıyken açılışa kalan gün ve tarih; kasa; açık iş yok",
            "transfer" in nesne and o["ad"] == "transfer" and o["boy"] == "genis" and o["baslik"] == "Transfer" and bool(t) and t["bolum"] == "pano"
            and t["sekme"] == "pano*,takip,piyasa,gecmis" and "açılışa" in t["donem"] and "4 Ocak" in t["donem"] and not t["sonGun"] and "Kasa" in t["metin"] and t["dosya"] == 0,
            f"{nesne} · {o.get('ad')} · {t and t['donem']}")
    await pg.screenshot(path=str(ARAC / "son-akis-32-pano.png"))
    await pg.click('.tm-sekmeler [data-bolum="piyasa"]')
    t = await pg.evaluate(TM_JS)
    denetle("R4-k Piyasa: serbestler (ne zamandır boşta, eski yıldız), forma bulamayanlar, sözleşmesi bitecekler; maaş, yetenek ve puan yazmaz",
            t["bolum"] == "piyasa" and t["oyuncu"] >= 24 and "boşta" in t["metin"] and "Eski yıldız" in t["metin"] and "Sözleşmesi bitecekler" in t["metin"]
            and not re.search(r"maaş|yetenek|puan", t["metin"], re.I), str(t["oyuncu"]))
    await pg.screenshot(path=str(ARAC / "son-akis-32-piyasa.png"))
    ilk = await pg.get_attribute(".tm-oyuncu", "data-oyuncu")
    an0 = await pg.evaluate("() => OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika")
    await pg.click(".tm-oyuncu")
    t = await pg.evaluate(TM_JS)
    o = await odak(pg)
    denetle("R4-k oyuncu kâğıdı: künye, bu sezon, kaynaklı bildiklerimiz; Takibe al, Hocaya araştırt, İzlemeye git; başlıkta ‹ Piyasa",
            t["bolum"] == "oyuncu" and t["kagit"] == ilk and t["eylem"] == "tmTakip,tmArastirt,tmIzle" and "Bu sezon" in t["metin"] and "boşta" in t["metin"]
            and (o["geri"] or "").strip().endswith("Piyasa"), f"{t['eylem']} · geri {o.get('geri')}")
    await pg.click('.tm-eylemler [data-eylem="tmTakip"]')
    t = await pg.evaluate(TM_JS)
    an1 = await pg.evaluate("() => OYUN.kariyer.tarih + ' ' + OYUN.kariyer.gunIciDakika")
    denetle("R4-k Takibe al: zaman almaz; düğme “Takipten çıkar” olur; Takip sekmesinde (1)",
            an0 == an1 and "tmTakipBirak" in t["eylem"] and "takip*" not in t["sekme"] and "Takip (1)" in t["metin"], f"{an0} → {an1} · {t['eylem']}")
    await pg.keyboard.press("Escape")
    t = await pg.evaluate(TM_JS)
    denetle("R4-k Esc: oyuncu kâğıdından Piyasa listesine", bool(t) and t["bolum"] == "piyasa", str(t and t["bolum"]))
    await pg.click('.tm-sekmeler [data-bolum="takip"]')
    t = await pg.evaluate(TM_JS)
    denetle("R4-k Takip: takibe alınan oyuncu tarih ve kaynağıyla", t["bolum"] == "takip" and t["oyuncu"] == 1 and "senin notun" in t["metin"], t["metin"][:200])
    await pg.click(".tm-oyuncu")
    await pg.click('.tm-eylemler [data-eylem="tmArastirt"]')
    t = await pg.evaluate(TM_JS)
    m = await pg.evaluate("() => Object.values(OYUN.kariyer.meseleler).filter(m => m.sablon && m.sablon.ad === 'transferAlim').map(m => m.id + ':' + m.sablon.asama + ':' + m.sablon.kaynak)")
    denetle("R4-k Hocaya araştırt: dosya açılır (kaynak başkan, hoca bakıyor); kâğıtta “Dosyası açık”, araştır düğmesi kalkar",
            len(m) == 1 and m[0].endswith(":hocaGorus:baskan") and "tmArastirt" not in t["eylem"] and "Dosyası açık" in t["metin"], f"{m} · {t['eylem']}")
    await pg.click('.tm-kagit [data-eylem="dosyaAc"]')
    await gecis_bitir(pg)
    o = await odak(pg)
    a = await pg.evaluate("() => (document.querySelector('#oda .dsy-asama') || {}).textContent || null")
    denetle("R4-k dosyada şablonlu konunun aşama satırı (“Hoca oyuncuya bakıyor”); başlıkta ‹ Transfer", o["ad"] == "dosya" and a == "Hoca oyuncuya bakıyor"
            and (o["geri"] or "").strip().endswith("Transfer"), f"{a} · {o.get('geri')}")
    await pg.keyboard.press("Escape")
    o = await odak(pg)
    t = await pg.evaluate(TM_JS)
    denetle("R4-k Esc dosyadan Transfer masasına döner; Pano'da açık iş aşamasıyla", o["ad"] == "transfer" and bool(t) and (t["dosya"] >= 1 or t["bolum"] == "oyuncu"), f"{o['ad']} · {t and t['bolum']}")
    await pg.click('.tm-sekmeler [data-bolum="pano"]')
    t = await pg.evaluate(TM_JS)
    denetle("R4-k Pano: açık transfer dosyası tek satır ve aşamasıyla", t["dosya"] == 1 and "Hoca oyuncuya bakıyor" in t["metin"], t["metin"][:200])
    await pg.click('.tm-sekmeler [data-bolum="gecmis"]')
    t = await pg.evaluate(TM_JS)
    denetle("R4-k Geçmiş: gelen, giden, kaçan (boşken sakin metin)", t["bolum"] == "gecmis" and "Gelenler" in t["metin"] and "Kaçanlar" in t["metin"], t["metin"][:160])
    # Duraklat: okuma açık, iş veren eylemler kapalı
    await pg.click('.tm-sekmeler [data-bolum="piyasa"]')
    await pg.click(".tm-oyuncu >> nth=1")
    await pg.keyboard.press("KeyP")
    t = await pg.evaluate(TM_JS)
    await pg.keyboard.press("KeyP")
    denetle("R4-k Duraklat'ta oyuncu kâğıdı okunur; takip, araştırma ve izleme kapalı", bool(t) and t["bolum"] == "oyuncu" and all(x.endswith("-") for x in t["eylem"].split(",")), t and t["eylem"])
    await pg.keyboard.press("Escape")
    await pg.keyboard.press("Escape")
    o = await odak(pg)
    denetle("R4-k Esc zinciri: oyuncu → Piyasa → masa", o["n"] == 0, str(o["ad"]))
    await pg.close()


async def bolum_33(tarayici, site, tum_hatalar):
    """R4: transfer zinciri ekranda — yapay haftalarla 5 Ocak'a (hocanın isteği), telefonda ihtiyaç kartı (soran hoca), aday kartı, pazarlığı kim
    yürütecek, pazarlık kartının iki yüzü (iki rakam, künyede Pazarlık), karşı teklif varsa yeni rakamlar, oyuncuyla görüşme (Yanına git: zaman
    geçer, yol masrafı), maaş pazarlığı, sağlık, imza ya da kayıp; her adımda dosyada aşama satırı; sonda dosya kapalı, sonuç yazılı."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await pg.set_viewport_size({"width": 1100, "height": 810})
    an = await pg.evaluate(SUR_JS, "2027-01-05")
    await oda_yenile(pg)
    POL = {"ihtiyac": "onayla", "aday": "adayA", "gorus": "gorus", "yurutme": "kendim", "kulupPazarlik": "guclu", "devirOnay": "imza", "bedelArtti": "farkiOde",
           "temas": "git", "oyuncuPazarlik": "guclu", "saglikKarari": "risk", "alternatif": "obur"}
    gorulen, yuzler, asamalar, telefonda, git_once = [], {}, set(), None, None
    for _ in range(60):
        d = await pg.evaluate("""() => { const k = OYUN.kariyer, M = Object.values(k.meseleler).filter(m => m.sablon && m.sablon.ad === 'transferAlim');
          const kr = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.karar === 'sablonKarti');
          return { acik: M.filter(m => m.durum !== 'kapandi').length, sonuc: M.map(m => m.sablon.sonuc), kart: kr ? kr.id : null,
            asama: kr ? k.meseleler[kr.veri.meseleId].sablon.asama : null, mesele: kr ? kr.veri.meseleId : null, an: k.tarih + ' ' + k.gunIciDakika,
            nakit: k.kulupler.demirkapi.nakit, yol: k.hareketler.filter(h => h.kalem === 'yol').length,
            diger: Object.values(k.isler).filter(x => x.tur === 'ajanda' && x.veri.karar && x.veri.karar !== 'sablonKarti').map(x => x.id),
            mac: Object.values(k.isler).some(x => x.tur === 'ajanda' && x.veri.eylem === 'macGunu' && x.tarih === k.tarih && x.dakika === k.gunIciDakika) }; }""")
        if not d["acik"] and gorulen:
            break
        await masaya_don(pg)
        if d["diger"]:
            await pg.evaluate("(id) => { const S = ajandaOnizle(OYUN.kariyer, id).secenekler; oyunKomut(x => ajandaIsiYap(x, id, (S.find(s => s.id === 'reddet') || S[0]).id)); }", d["diger"][0])
            await oda_yenile(pg)
            continue
        if not d["kart"] and d["mac"]:   # maç günü: yapay hafta (oyunun komut yoluyla; maça gidilmez)
            await pg.evaluate(HAFTA_YAPAY_JS)
            await oda_yenile(pg)
            continue
        if not d["kart"]:   # İlerle (ana düğme maç gününde “Stada git” olur: o zaman oyunun komut yoluyla durağa)
            if ((await pg.get_attribute(".od-ana", "data-eylem")) or "").startswith("ilerle"):
                await oda_ilerle(pg)
            else:
                await pg.evaluate("() => oyunKomut(x => duragaIlerle(x))")
                await oda_yenile(pg)
            continue
        # kart kendi yerinde (Sonra yığınından): soranı hoca ya da müdürse telefonda, değilse dosyada
        await pg.click(f'.od-sonraKagit[data-is="{d["kart"]}"]')
        kart = f'.kk-kart[data-is="{d["kart"]}"]'
        await pg.wait_for_selector(kart, timeout=10000)
        o = await odak(pg)
        if d["asama"] == "ihtiyac":
            telefonda = o["ad"]
        sol, sag = await pg.get_attribute(kart, "data-sol"), await pg.get_attribute(kart, "data-sag")
        if d["asama"] == "kulupPazarlik" and "kulupPazarlik" not in yuzler:
            await pg.focus(kart)
            await pg.keyboard.press("ArrowLeft")
            y1 = await pg.evaluate(f"() => document.querySelector('{kart} .kk-yuz').textContent")
            await pg.keyboard.press("ArrowRight")
            y2 = await pg.evaluate(f"() => document.querySelector('{kart} .kk-yuz').textContent")
            ust = await pg.evaluate(f"() => document.querySelector('{kart} .kk-ustNotr').textContent")
            yuzler["kulupPazarlik"] = (y1, y2, ust)
            await pg.keyboard.press("Escape")
        hedef = POL.get(d["asama"])
        yon = "ArrowLeft" if hedef == sol else "ArrowRight" if hedef == sag else "ArrowLeft"
        if d["asama"] == "temas" and hedef in (sol, sag):
            git_once = (d["an"], d["yol"])
        await pg.focus(kart)
        await pg.keyboard.press(yon)
        await pg.keyboard.press("Enter")
        gorulen.append(f"{d['asama']}:{sol if yon == 'ArrowLeft' else sag}")
        asamalar.add(d["asama"])
        await pg.wait_for_timeout(150)
        if d["mesele"]:
            a = await pg.evaluate("(id) => { const m = OYUN.kariyer.meseleler[id]; return sablonAsamaSatiri(OYUN.kariyer, m).metin; }", d["mesele"])
            asamalar.add("satir:" + a)
    son = await pg.evaluate("""() => { const k = OYUN.kariyer, M = Object.values(k.meseleler).filter(m => m.sablon && m.sablon.ad === 'transferAlim');
      return { sonuc: M.map(m => m.sablon.sonuc), acik: M.filter(m => m.durum !== 'kapandi').length, an: k.tarih + ' ' + k.gunIciDakika, hata: kariyerDogrula(k),
        yol: k.hareketler.filter(h => h.kalem === 'yol').length, imza: k.gecmis.filter(g => g.tur === 'transfer' && g.yeni === 'demirkapi').length }; }""")
    denetle("R4 §33: yapay haftalarla 5 Ocak'a; hocanın isteği telefonda (ihtiyaç kartı, soran hoca)", an.startswith("2027-01-05") and telefonda == "telefon", f"{an} · {telefonda}")
    denetle("R4 §33: zincir ekranda kartlarla yürür (ihtiyaç → aday → yürütme → kulüple pazarlık …); her adımda dosyada aşama satırı",
            {"ihtiyac", "aday", "yurutme", "kulupPazarlik"} <= asamalar and any(x.startswith("satir:") for x in asamalar), " → ".join(gorulen))
    if "kulupPazarlik" in yuzler:
        y1, y2, ust = yuzler["kulupPazarlik"]
        denetle("R4 §33 pazarlık kartı: iki yüz iki rakam (temkinli, güçlü; ₺), künyede Pazarlık; rakam alt sınırı söylemez",
                "temkinli" in y1 and "güçlü" in y2 and "₺" in y1 and "₺" in y2 and "Pazarlık" in ust, f"{ust} · {y1[:80]} · {y2[:80]}")
    if git_once:
        denetle("R4 §33 Yanına git: görüşme zaman alır ve yol masrafı kasadan düşer", son["yol"] > git_once[1], f"{git_once} → {son['yol']}")
    denetle("R4 §33: sonda transfer dosyası kapalı ve sonucu yazılı (imza ya da kayıp); kariyer geçerli",
            son["acik"] == 0 and all(son["sonuc"]) and not son["hata"], str(son))
    await pg.screenshot(path=str(ARAC / "son-akis-33-son.png"))
    await pg.close()



BALKON_JS = """() => { const g = document.querySelector('#oda .od-gozlem'), r = g ? g.getBoundingClientRect() : null, oda = document.querySelector('#oda').getBoundingClientRect();
  const B = typeof BALKON !== 'undefined' ? BALKON : null, gor = a => a && a.m.root.visible;
  return { yer: ODA.yer, metin: g ? g.textContent : '', sag: r ? r.left > oda.left + oda.width * 0.45 : null, antrenman: B ? B.antrenman : null, tur: B ? B.tur : null,
    sahada: B ? [...B.havuz.values()].filter(gor).length : 0, gruplar: B ? [B.kosu.length, B.rondo.length, B.sut.length, B.esneme.length, B.ayri.length] : null,
    gozlemDugme: !!document.querySelector('#oda [data-eylem="gozlem"]'), linkler: [...document.querySelectorAll('#oda .od-gorduklerin [data-eylem="gozlemOyuncu"]')].map(b => b.dataset.oyuncu) }; }"""


async def bolum_34(tarayici, site, tum_hatalar):
    """R5: balkon — antrenman kâğıdı sağ üstte (günün türü hocanın programından, Gördüklerin bütün sinyaller, ada dokununca oyuncunun dosyası);
    sahadakiler kariyerin kadrosu (gruplar programa göre; sakat sahada yok); iş sağ yarıda, saha solda; TEST “her saat antrenman” yalnız görüntü
    (saha dolu, gözlem düğmesi yok); gözlem sürerken gelen cevapta telefonun rozeti (B44)."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    # Salı 15:00 (yoğun gün), iki oyuncu yorgun: gözlem açılır ve bir saat ilerletilir (§23 kalıbı); bir oyuncu uzun sakat
    sakat = await pg.evaluate("""() => { let id = null; oyunKomut(k => { const D = k.kulupler.demirkapi.kadro, x = Object.assign({}, k.oyuncular);
      for (const i of D.ilk11.slice(1, 3)) x[i] = Object.assign({}, x[i], { hal: { kon: 58, gun: '2026-11-23', form: 0, gel: 0, tav: 60 } });
      id = D.yedekler[2]; x[id] = Object.assign({}, x[id], { sakat: { neden: 'arka adale', donus: '2026-12-20' } });
      k.oyuncular = x; zamanIlerlet(k, anDakika('2026-11-24', 900) - simdikiAn(k)); gozlemAc(k, 120); gozlemAdim(k, 60); }); return id; }""")
    await oda_yenile(pg)
    await pg.wait_for_function("ODA.yer === 'balkon' && typeof BALKON !== 'undefined' && BALKON.antrenman", timeout=YURUYUS_BEKLE)
    await pg.wait_for_timeout(500)
    b = await pg.evaluate(BALKON_JS)
    kad = await pg.evaluate("() => kulupOyunculari(OYUN.kariyer, 'demirkapi').filter(p => !(p.sakat && tarihKarsilastir(p.sakat.donus, OYUN.kariyer.tarih) > 0)).length")
    gor_sakat = await pg.evaluate("(id) => { const a = BALKON.havuz.get(id); return !!(a && a.m.root.visible); }", sakat)
    denetle("R5-a: balkonda antrenman kâğıdı sağ üstte; günün türü düz yazı (“Bugün yoğun çalışma”); Gördüklerin bütün sinyaller, adları dokunulur",
            b["yer"] == "balkon" and b["sag"] and "Bugün yoğun çalışma" in b["metin"] and "(TEST)" not in b["metin"].split("TEST")[0] and len(b["linkler"]) >= 1, str(b)[:300])
    denetle("R5-b, c: sahadakiler kariyerin kadrosu — sağlam oyuncuların hepsi sahada (yoğun: koşu, pas çemberi, şut), uzun sakat sahada yok",
            b["antrenman"] and b["tur"] == "yogun" and b["sahada"] == kad and b["gruplar"][0] == 6 and b["gruplar"][1] > 2 and b["gruplar"][2] > 0 and not gor_sakat,
            f"{b['sahada']}/{kad} · {b['gruplar']} · sakat görünür {gor_sakat}")
    await pg.screenshot(path=str(ARAC / "son-akis-34-balkon.png"))
    oid = b["linkler"][0]
    await pg.click(f'#oda .od-gorduklerin [data-oyuncu="{oid}"]')
    await gecis_bitir(pg)
    o = await odak(pg)
    sec_oyuncu = await pg.evaluate("() => (document.querySelector('#oda .dsy-baslik') || {}).textContent || null")
    ad = await pg.evaluate("(id) => OYUN.kariyer.oyuncular[id].ad", oid)
    sag = await pg.evaluate("() => { const s = document.querySelector('#oda section.odk:not(.odk-cikis)'), o = document.querySelector('#oda').getBoundingClientRect(); const r = s.getBoundingClientRect(); return r.left > o.left + o.width * 0.4; }")
    denetle("R5-a: sinyalin adına dokununca oyuncunun dosyası açılır; iş sağ yarıda, saha solda görünür", o["ad"] == "dosya" and sec_oyuncu == ad and sag, f"{o['ad']} · {sec_oyuncu} / {ad} · sağ {sag}")
    await pg.screenshot(path=str(ARAC / "son-akis-34-balkon-dosya.png"))
    await masaya_don(pg)
    # B44: gözlem sürerken hocaya “Takım ne durumda?”; cevabın anı gözlemin içine alınır (kurgu), Gözleme devam et — cevap gözlemi kesmez, telefonda rozet
    await pg.evaluate("""() => oyunKomut(k => { girisimBaslat(k, 'yaz.teknikDirektor.takim'); const c = Object.values(k.isler).find(x => x.veri && x.veri.gelisme === 'yazismaCevap');
      c.tarih = k.tarih; c.dakika = k.gunIciDakika + 10; })""")
    await oda_yenile(pg)
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    await pg.click('[data-eylem="gozlemSurdur"]')
    await pg.wait_for_function("OYUN.kariyer.gozlem === null || !gozlemAcik(OYUN.kariyer)", timeout=30000)
    await pg.wait_for_timeout(400)
    r = await pg.evaluate("""() => { const t = document.querySelector('#oda .od-nesne[data-panel="telefon"] .od-rozet'), g = OYUN.kariyer.gecmis.filter(x => x.tur === 'gozlem').pop();
      return { rozet: t ? t.textContent : null, yer: ODA.yer, izlenen: g ? g.izlenen : null, bitis: g ? g.bitis : null, cevap: OYUN.kariyer.gecmis.some(x => x.sonuc && x.sonuc.yazisma) }; }""")
    denetle("R5-e (B44): gözlem sürerken gelen cevap gözlemi kesmez (17:00'ye dek sürdü); balkondaki telefon düğmesinde rozet",
            r["yer"] == "balkon" and r["rozet"] not in (None, "") and r["bitis"] == 1020 and r["cevap"], str(r))
    # TEST “her saat antrenman”: Cumartesi sabahı (maç günü) saha dolu, gözlem düğmesi yok
    await pg.evaluate("() => { OYUN.ayarlar.herSaat = true; OYUN.ayarlar.kaydet(); oyunKomut(k => { k.gozlem = null; zamanIlerlet(k, anDakika('2026-11-28', 600) - simdikiAn(k)); }); }")
    await oda_yenile(pg)
    await masaya_don(pg)
    await balkona_atla(pg)
    await pg.wait_for_timeout(500)
    t = await pg.evaluate(BALKON_JS)
    denetle("R5-d: TEST “her saat antrenman” açıkken maç günü sabahı saha dolu (yoğun düzen), gözlem düğmesi yok, kâğıtta TEST notu",
            t["yer"] == "balkon" and t["antrenman"] and t["tur"] == "yogun" and not t["gozlemDugme"] and "yalnız görüntü" in t["metin"], str(t)[:300])
    await pg.click('#oda [data-panel="ayar"]')
    await pg.click('[data-eylem="ayarBolum"][data-bolum="gelistirici"]')
    await pg.click('[data-eylem="herSaat"]')
    await masaya_don(pg)
    await pg.wait_for_timeout(400)
    t2 = await pg.evaluate(BALKON_JS)
    denetle("R5-d: anahtar kapalıyken maç günü saha boş", t2["antrenman"] is False and "Bugün maç günü" in t2["metin"], str(t2)[:200])
    await pg.context.close()



async def bolum_35(tarayici, site, tum_hatalar):
    """R6: gazetede rakiplerin gündemi (başka kulüpler arasındaki transfer ertesi sabahın sayısında); sponsor zinciri ekranda — 1 Şubat ay başında
    teklif kartı (Fırsat, mali işler müdürü telefonda), Görüşelim → pazarlık kartının iki yüzü (aylık iki rakam, künyede Pazarlık), dosyada aşama satırı."""
    pg, hatalar = await oda_ac(tarayici, site, "?dunya=7")
    tum_hatalar += hatalar
    await pg.set_viewport_size({"width": 1180, "height": 1000})
    # gazete: dünyada dar transfer (kural komutuyla), ertesi sabah 09:00
    await pg.evaluate("""() => oyunKomut(k => { const p = Object.values(k.oyuncular).find(q => q.kulupId === 'karaova' && q.mevki === 'OS');
      dunyaTransferi(k, p.id, 'akdeniz'); zamanIlerlet(k, anDakika('2026-11-24', 540) - simdikiAn(k)); })""")
    await oda_yenile(pg)
    await masaya_don(pg)
    await pg.keyboard.press("Digit4")
    await pg.wait_for_selector("#oda .gz-sayi", timeout=10000)
    gz = await pg.text_content("#oda .gz-sayi")
    denetle("R6-b: başka kulüpler arasındaki transfer ertesi sabahın gazetesinde (“… formasını … ile değiştirdi”)", "formasını" in gz and "Akdeniz" in gz, gz[:200])
    await masaya_don(pg)
    # sponsor: 1 Şubat 12:00
    await pg.evaluate("() => oyunKomut(k => zamanIlerlet(k, anDakika('2027-02-01', 720) - simdikiAn(k)))")
    await oda_yenile(pg)
    await masaya_don(pg)
    kid = await pg.evaluate("() => { const x = Object.values(OYUN.kariyer.isler).find(i => i.veri && i.veri.karar === 'sablonKarti' && OYUN.kariyer.meseleler[i.veri.meseleId].sablon.ad === 'sponsor'); return x ? x.id : null; }")
    await pg.click(f'.od-sonraKagit[data-is="{kid}"]')
    kart = f'.kk-kart[data-is="{kid}"]'
    await pg.wait_for_selector(kart, timeout=10000)
    o = await odak(pg)
    ust = await pg.text_content(f"{kart} .kk-ustNotr")
    yuz = await pg.text_content(f"{kart} .kk-yuz")
    denetle("R6-d: 1 Şubat'ta sponsor teklifi; kart telefonda (soran mali işler müdürü), künyede Fırsat; nötr yüzde markanın teklifi",
            kid is not None and o["ad"] == "telefon" and "Fırsat" in ust and "forma göğüs" in yuz, f"{o['ad']} · {ust} · {yuz[:120]}")
    await pg.focus(kart)
    await pg.keyboard.press("ArrowLeft")
    await pg.keyboard.press("Enter")
    await pg.wait_for_timeout(300)
    await masaya_don(pg)
    kid2 = await pg.evaluate("() => { const x = Object.values(OYUN.kariyer.isler).find(i => i.veri && i.veri.karar === 'sablonKarti' && OYUN.kariyer.meseleler[i.veri.meseleId].sablon.ad === 'sponsor'); return x ? x.id : null; }")
    await pg.click(f'.od-sonraKagit[data-is="{kid2}"]')
    kart2 = f'.kk-kart[data-is="{kid2}"]'
    await pg.wait_for_selector(kart2, timeout=10000)
    await pg.focus(kart2)
    await pg.keyboard.press("ArrowLeft")
    y1 = await pg.text_content(f"{kart2} .kk-yuz")
    await pg.keyboard.press("ArrowRight")
    y2 = await pg.text_content(f"{kart2} .kk-yuz")
    ust2 = await pg.text_content(f"{kart2} .kk-ustNotr")
    denetle("R6-d: Görüşelim → pazarlık kartı; iki yüz iki aylık rakam (makul, iddialı; “/ ay”), künyede Pazarlık", kid2 not in (None, kid) and "/ ay" in y1 and "/ ay" in y2
            and "makul" in y1 and "iddialı" in y2 and "Pazarlık" in ust2, f"{ust2} · {y1[:80]} · {y2[:80]}")
    await pg.keyboard.press("ArrowLeft")
    await pg.keyboard.press("Enter")
    await pg.wait_for_timeout(300)
    mid = await pg.evaluate("() => Object.values(OYUN.kariyer.meseleler).find(m => m.sablon && m.sablon.ad === 'sponsor').id")
    await masaya_don(pg)
    await pg.keyboard.press("Digit3")
    await pg.click(f'#oda .dsy-sekme[data-mesele="{mid}"]')
    a = await pg.evaluate("() => (document.querySelector('#oda .dsy-asama') || {}).textContent || null")
    await pg.screenshot(path=str(ARAC / "son-akis-35-sponsor.png"))
    denetle("R6-d: dosyada aşama satırı (“Markanın cevabı bekleniyor”), kategori Kurumsal", a == "Markanın cevabı bekleniyor" and "Kurumsal" in (await pg.text_content("#oda .dsy-kat")), str(a))
    await pg.context.close()


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

        if sec("1"):
            print("\n1. İçeriksiz yeni kariyer")
            await bolum_1(tarayici, site, tum_hatalar)
        if sec("2"):
            print("\n2. Eski kayıt")
            await bolum_2(tarayici, site, tum_hatalar)
        if sec("3"):
            print("\n3. TEST içeriği: defter, telefon, masada açık dosya")
            await bolum_3(tarayici, site, tum_hatalar)
        if sec("12"):
            print("\n12. Genel duraklatma")
            await bolum_12(tarayici, site, tum_hatalar)
        if sec("14"):
            print("\n14. Maç öncesi ekranı")
            await bolum_14(tarayici, site, tum_hatalar)
        if sec("14b"):
            print("\n14b. Rakip başkan ve karar anı")
            await bolum_14b(tarayici, site, tum_hatalar)
        if sec("15"):
            print("\n15. Stat, mekân, balkon ve yürüyüş")
            await bolum_15(tarayici, site, tum_hatalar)
        if sec("15b"):
            print("\n15b. Maçta loca ve topu izleyen bakış")
            await bolum_15b(tarayici, site, tum_hatalar)
        if sec("16"):
            print("\n16. Maç telefonu")
            await bolum_16(tarayici, site, tum_hatalar)
        if sec("17"):
            print("\n17. Topa odaklı bakış ve maçın netliği")
            await bolum_17(tarayici, site, tum_hatalar)
        if sec("18"):
            print("\n18. İzleme hızı ve önemli anlar (U1)")
            await bolum_18(tarayici, site, tum_hatalar)
        if sec("19"):
            print("\n19. Maç sonucu kariyere: Maçı bitir (TEST), Maç bitti kartı, Odaya dön (F2)")
            await bolum_19(tarayici, site, tum_hatalar)
        if sec("19b"):
            print("\n19b. Maçı izleme (TEST, H2-a): perdenin arkasında sonuç, file://")
            await bolum_19b(tarayici, site, tum_hatalar)
        if sec("20"):
            print("\n20. Maçı bitir anında: http'de işçiler, sonuç ikizi (G1-e)")
            await bolum_20(tarayici, site, tum_hatalar)
        if sec("21"):
            print("\n21. Kişiye yazmak ve görüşme isteği (H2-c)")
            await bolum_21(tarayici, site, tum_hatalar)
        if sec("23"):
            await bolum_23(tarayici, site, tum_hatalar)
        if sec("22"):
            await bolum_22(tarayici, site, tum_hatalar)
        if sec("24"):
            await bolum_24(tarayici, site, tum_hatalar)
        if sec("25"):
            await bolum_25(tarayici, site, tum_hatalar)
        if sec("26"):
            print("\n26. Tek yazı ölçeği ve yazı tipleri (U0)")
            await bolum_26(tarayici, site, tum_hatalar)
        if sec("27"):
            print("\n27. Odak kabı ve Esc zinciri (U1)")
            await bolum_27(tarayici, site, tum_hatalar)
        if sec("28"):
            print("\n28. İki pencere: kayıt çakışması (R1-a)")
            await bolum_28(tarayici, site, tum_hatalar)
        if sec("29"):
            print("\n29. Kaydı dışa ve içe aktarma (R1-b)")
            await bolum_29(tarayici, site, tum_hatalar)
        if sec("30"):
            print("\n30. İki sütunlu telefon (R2)")
            await bolum_30(tarayici, site, tum_hatalar)
        if sec("31"):
            print("\n31. Canlı Skor sayfaları (R3)")
            await bolum_31(tarayici, site, tum_hatalar)
        if sec("32"):
            print("\n32. Transfer masası (R4-k)")
            await bolum_32(tarayici, site, tum_hatalar)
        if sec("33"):
            print("\n33. Transfer zinciri (R4)")
            await bolum_33(tarayici, site, tum_hatalar)
        if sec("34"):
            print("\n34. Balkon (R5)")
            await bolum_34(tarayici, site, tum_hatalar)
        if sec("35"):
            print("\n35. Zincirler: gazetede rakipler ve sponsor (R6)")
            await bolum_35(tarayici, site, tum_hatalar)
        if sec("11"):
            print("\n11. Oyun çerçevesi")
            await bolum_11(tarayici, site, tum_hatalar)

        await tarayici.close()
    shutil.rmtree(site.parent, ignore_errors=True)
    denetle("Sayfa ve betik hatası yok", not tum_hatalar, "; ".join(tum_hatalar[:3]))
    print("\nEkran görüntüleri: araclar/son-akis-*.png")
    # R1-d: düşen denetim borç defterindeki açık bir satıra uyuyorsa bilinendir; çıkış kodunu yalnız yeni düşüş belirler
    defter = borc_defteri()
    bilinen, yeni = [], []
    for ad in dusenler:
        b = next((x for x in defter if all(k.search(ad) for k in x[2])), None)
        (bilinen if b else yeni).append((b[0] if b else "YENİ", ad))
    for no, ad in bilinen + yeni:
        print(f"  [{no}] {ad[:150]}")
    if yeni:
        print(f"BAŞARISIZ: {len(yeni)} yeni denetim" + (f" (+{len(bilinen)} bilinen, araclar/BORCLAR.md)" if bilinen else ""))
    elif bilinen:
        print(f"Tüm denetimler geçti; yalnız bilinen {len(bilinen)} düşüş (araclar/BORCLAR.md)")
    else:
        print("Tüm denetimler geçti")
    sys.exit(1 if yeni else 0)


if __name__ == "__main__":
    asyncio.run(ana())
