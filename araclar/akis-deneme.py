#!/usr/bin/env python3
"""Chairman — günlük akış denemesi (yol haritası 2.3–2.8, 2.8A–2.8J)

Oyunu başsız Chromium'da açar ve gerçek ekranı tıklayarak oynar. Başlangıç geliştirici parametreleriyle sabitlenir
(?baslangic=…&sponsor=…&hoca=…&dunya=…); oyuncuya bu seçim gösterilmez. Yeni kariyer içerik sürümü 3'tür: her başkanlık kararı
tam iki cevaplıdır (2.8H). Eski içerik yalnız eski kayıtlarda sürer (8. bölüm).
A. Koyu ajanda görünümü (?ekran=ajanda) — kural akışı:
  1. Sıkışık başlangıç: sayman görüşmesi bir randevudur, adaylar sırayla gelir; İlerle destek teklifinde, nakit takviminde, sponsorun
     haberinde durur. Her karar iki cevaplıdır.
  2. Mesele dosyası kim/ne/şimdi sorularını ve kaynağıyla kanıtları (saymanın hazır görüşü dahil) gösterir; gizli koşul ekranda yoktur.
  3. İş saymana devredilir; İlerle saymanın haberinde durur, yetkiyi aşan teklif başkana döner.
  4. Sayfa yenilenir: saat, karar ve para aynı, "Kaldığın yer" özeti görünür. Karar verilir, yenilenir: ikinci kez uygulanmaz.
  5. "Stada git": maç sınırında kayıt yapılmaz; sayfa yenilenince maç geçişi hâlâ açıktır.
  6. Düzenli başlangıç: mesele açılmadan tek İlerle ile maç gününe gelinir. Rahat başlangıç: acil olmayan, cevapsız kalabilen karar açılır.
  7. "Yeni kariyer" yeni bir kariyer kurar.
  8. Sürüm 1–4 kayıtları (araclar/ornekler) yüklenir: yeni biçime dönüşür ve kendi (çok seçenekli) içerikleriyle sürer.
B. Başkan odası (oyunun açılış ekranı):
  9. Masadaki nesneler; ajandadan randevuya katılım; sıralı aday kartı; test bilgileri; telefonda kişi konuşmaları, girişim ve telefondan
     cevap; dosyada iki büyük cevap; gezinti durumu değiştirmez; basın sorusu; gazete; sözler; yenilemede aynı durum ve izler; maç telefonu.
 10. Balkon ve antrenman gözlemi (2.7).
 11. Oyun çerçevesi temizliği (2.8A, 2.8J): dış notlar/radyo/ses/çay yok, eski ses ve hareket ayarlı kayıt açılıyor, maç sessiz oynanıyor.
 12. Genel duraklatma (2.8B): oda, yürüyüş ortası, gerçek zamanlı gözlem (duraklat → kayıt aynı an → yenile → devam) ve maç.
 13. Başkanlık ekranları (2.8C, 2.8I): telefon ana ekranı/kişi listesi/konuşma ve dosyadan dönüş, okundu ile cevaplandı ayrı, dosya
     sayaçları/arşiv/test simgesi, sade ajanda ve kasa, gezintinin durumu değiştirmemesi, karar sonrası aynı dosya, yeni konunun açık dosyayı
     değiştirmemesi, hareket ayarının olmaması, görüntü kaydı, taşma.
 14. Maç öncesi tek ekran (2.8J): dolan hazırlık çubuğu, en az 10 sn etkin hazırlık, duraklatma çubuğu durdurur, kendiliğinden geçiş yok.
 15. Ortak çatısız stat ve mekân hareketi (2.8D, 2.8J): tek tarif, çatı yok, balkon/pencere aynı stat, basamaklarda iskele, kapıya tıklama,
     doğal yürüyüş, protokol locasındaki yüksek koltuk, başkan açısından okunan tabela.
 16. Maç telefonu (2.8F, 2.8I): masadaki telefona tıklama, 'telefon' duraklatma nedeni, ana ekran ve Canlı Skor istatistiği motorla aynı an,
     Esc/T, elle duraklatmayla bağımsızlık.
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
RANDEVU_JS = "etki => { const x = Object.values(OYUN.kariyer.isler).find(x => x.tur === 'ajanda' && x.veri.etki === etki); return x ? x.id : null; }"
MESELE_JS = "tur => { const m = Object.values(OYUN.kariyer.meseleler).find(m => m.tur === tur); return m ? m.id : null; }"
KAYIT_JS = "localStorage.getItem('chairman:oyun-1')"
# yürüyüş oyun içinde ~6 sn; başsız yazılım çiziminde kare hızı düşük olduğundan bekleme sınırı geniştir
YURUYUS_BEKLE = 45000
SIKISIK = "?baslangic=sikisik&sponsor=nakitSikisik&hoca=yok&dunya=7"
PAZARLIK = "?baslangic=sikisik&sponsor=pazarlik&hoca=yok&dunya=7"
ESKI_TURLER = ("koltukSecimi", "odemeSikismasi", "anlasmaDegerlendirme", "nakitTakvimi", "hocaTalebi", "hocaGorusmesi", "basinSorusu", "destekTeklifi")
# tohum 7: sayman adaylarının görüşme sırası kisi-9 (Tuncay Erbil), kisi-10 (Deniz Kocaman), kisi-8 (Hikmet Aydın)
SAYMAN_SIRASI = ("Tuncay Erbil", "Deniz Kocaman", "Hikmet Aydın")


async def durum(pg):
    return await pg.evaluate(DURUM_JS)


async def karar_isi(pg, tur):
    return await pg.evaluate(KARAR_JS, tur)


async def ilerle_tikla(pg):
    """İlerle'ye basar; kaçırılacak ya da cevapsız kalacak iş için onay isterse onaylar."""
    await pg.click('.aj-ana')
    if await pg.query_selector('.aj-ana[data-eylem="ilerle"]:has-text("Onayla")'):
        await pg.click('.aj-ana')


async def karar_ver(pg, is_id, secim):
    """Koyu ajandada: işi seç, (karar ise) seçeneği seç, uygula."""
    await pg.click(f'button.aj-satir[data-is="{is_id}"]')
    if secim:
        await pg.click(f'[data-eylem="sec"][data-secim="{secim}"]')
    await pg.click('[data-eylem="yap"]')
    if await pg.query_selector('.aj-birincil[data-eylem="yap"]:has-text("Onayla")'):
        await pg.click('.aj-birincil[data-eylem="yap"]')


async def secenekler_aj(pg, is_id):
    await pg.click(f'button.aj-satir[data-is="{is_id}"]')
    return await pg.eval_on_selector_all('#ajanda [data-eylem="sec"]', "L => L.map(b => b.dataset.secim).join(',')")


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


async def donus_kapat(pg):
    """Kayıttan dönüşte telefonda açılan 'Kaldığın yer' özetini kapatır, paneli kapatır."""
    if await pg.query_selector('[data-eylem="devam"]'):
        await pg.click('[data-eylem="devam"]')
    await pg.keyboard.press("Escape")


async def ayar_ac(pg, bolum):
    """Ayarlar panelini açar ve bölümünü seçer (2.8J: Okuma, Kayıt, Geliştirici; hareket bölümü yok)."""
    if await pg.query_selector('.od-panel[aria-label="Ayarlar"]') is None:
        await pg.click('.od-nesne[data-panel="ayar"]')
    await pg.click(f'[data-eylem="ayarBolum"][data-bolum="{bolum}"]')


async def oda_karar(pg, secim):
    """Açık paneldeki karar kartında (dosya ya da telefon) cevabı seçer ve onaylar; uyarılı onay varsa ikinci kez onaylar."""
    await pg.click(f'.od-panel .kk-cevap[data-secim="{secim}"]')
    await pg.click('.od-panel .kk-gonder')
    if await pg.query_selector('.od-panel .kk-gonder'):
        await pg.click('.od-panel .kk-gonder')


async def cevaplar(pg, kap=".od-panel"):
    return await pg.eval_on_selector_all(f'{kap} .kk-cevap', "L => L.map(b => b.dataset.secim).join(',')")


async def tel_kisi(pg, ad):
    """Telefonu açar (açıksa olduğu yerden), Mesajlar'a girer ve kişinin konuşmasını açar."""
    if await pg.query_selector('.od-telefonPanel') is None:
        await pg.keyboard.press("Digit1")
    if await pg.query_selector('.tel[data-ekran="konusma"]'):
        await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    if await pg.query_selector('.tel[data-ekran="ana"]'):
        await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await pg.click(f'.tel-kisi:has-text("{ad}")')


async def ajanda_katil(pg, baslik):
    """Ajandada randevuyu seçip katılır (uyarı varsa onaylar)."""
    if await pg.query_selector('.od-panel[aria-label="Ajanda"]') is None:
        await pg.keyboard.press("Digit2")
    await pg.click(f'.od-panel button.od-satir:has-text("{baslik}")')
    await pg.click('.od-panel [data-eylem="yap"], .od-panel [data-eylem="yapSor"]')
    if await pg.query_selector('.od-panel [data-eylem="yap"]:has-text("Onayla")'):
        await pg.click('.od-panel [data-eylem="yap"]:has-text("Onayla")')


async def aday_sec(pg, ad):
    """Dosyada sıralı aday kartlarından istenen adayı göreve alır (öncekileri 'Sıradaki adayı dinle' ile geçer)."""
    for _ in range(4):
        await pg.keyboard.press("Digit3")
        kim = await pg.text_content(".od-kisiSatir b")
        await oda_karar(pg, "al" if kim == ad else "sonraki")
        if kim == ad:
            break
    await pg.keyboard.press("Escape")


async def oda_ilerle(pg):
    await pg.click(".od-ana")
    if await pg.query_selector('.od-ana[data-eylem="ilerle"]:has-text("Onayla")'):
        await pg.click(".od-ana")


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
    await donus_kapat(pg)
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
    await donus_kapat(pg)
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


# ekran dışı hazırlık: yeni içerik komutlarıyla (aynı kariyer komutları) bir noktaya kadar oynar.
# S: karar türü → cevap ya da öncelik listesi; aday görüşmesinde 'al:<kişi>' o kişiyi göreve alır. dur(k): true olunca durur
HAZIRLIK_JS = """([S, durAd]) => { const DUR = { kriz: k => Object.values(k.meseleler).some(m => m.tur === 'odemeSikismasi'),
    maas: k => Object.values(k.sozler).some(s => s.anahtar === 'soz.maas') };
  for (let i = 0; i < 40; i++) {
    const k = OYUN.kariyer;
    if (DUR[durAd] && DUR[durAd](k)) break;
    const x = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.karar && S[x.veri.karar] !== undefined && (x.veri.saatsiz || (x.tarih === k.tarih && x.dakika <= k.gunIciDakika)));
    if (x) { let t = S[x.veri.karar];
      const L = ajandaOnizle(k, x.id).secenekler.filter(s => !s.engel).map(s => s.id);
      if (typeof t === 'string' && t.startsWith('al:')) t = x.veri.kisiId === t.slice(3) ? 'al' : ['sonraki', 'bos'];
      const s = [].concat(t).find(a => L.includes(a)) || L[0];
      oyunKomut(c => ajandaIsiYap(c, x.id, s)); continue; }
    const r = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.etki && x.tarih === k.tarih && x.dakika <= k.gunIciDakika && x.veri.zorunluluk !== 'istege');
    if (r) { oyunKomut(c => ajandaIsiYap(c, r.id)); continue; }
    if (ilerleOnizle(k).engel.length) break;
    oyunKomut(c => duragaIlerle(c));
  } }"""
TASMA_JS = "() => { const e = document.querySelector('.od-panel .od-icerik'); return e ? e.scrollWidth - e.clientWidth : -1; }"


async def bolum_13(tarayici, site, tum_hatalar):
    """Başkanlık ekranları (2.8C, 2.8I): telefon, dosya, arşiv, ajanda, kasa, ayarlar."""
    pg, hatalar = await oda_ac(tarayici, site, PAZARLIK)
    tum_hatalar += hatalar
    # hazırlık (ekran dışı, aynı kariyer komutları): Hikmet Aydın sayman; küçük destek; nakit takvimine gidilmez; Çarşamba 09:30 sponsorun haberi
    await pg.evaluate(HAZIRLIK_JS, [{"adayGorusmesi": "al:kisi-8", "destekCevabi": "kucult"}, "kriz"])
    await oda_yenile(pg)
    await donus_kapat(pg)
    d0 = await durum(pg)
    denetle("(hazırlık) Çarşamba 09:30: sponsor kararı bekliyor; koltuk ve destek dosyaları kapanmış",
            d0["dakika"] == 570 and "odemeSikismasi:kararBekliyor" in d0["mesele"] and "kosulluDestek:kapandi" in d0["mesele"] and "koltuk:kapandi" in d0["mesele"], str(d0))
    taşmalar = []
    # telefon: ana ekran → Mesajlar → kişi listesi → konuşma; okumak cevaplamak değildir
    await pg.keyboard.press("Digit1")
    ana = await pg.text_content(".tel")
    rozet = await pg.text_content(".tel-uygMesaj")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    liste = await pg.eval_on_selector_all(".tel-kisi .tel-kisiAd b", "L => L.map(b => b.textContent)")
    etiket = await pg.text_content(".tel-kisi:has-text('Hikmet Aydın')")
    denetle("Telefon ana ekranı: saat ve iki uygulama (Mesajlar, Canlı Skor); Mesajlar kişi listesi, cevap bekleyen kişi önde",
            "Mesajlar" in ana and "Canlı Skor" in ana and liste and liste[0] == "Hikmet Aydın" and "Selim Çınar" in liste and "Cevap bekliyor" in etiket and rozet, f"{liste}")
    OKUNDU_JS = "id => { const c = konusmaListesi(OYUN.kariyer).find(x => x.anahtar === id); return [c.okunmamis, c.cevapBekliyor, OYUN.kariyer.isler[Object.keys(OYUN.kariyer.isler).find(i => OYUN.kariyer.isler[i].veri.karar === 'odemeYolu')] ? 1 : 0]; }"
    once = await pg.evaluate(OKUNDU_JS, "kisi-14")
    await pg.click(".tel-kisi:has-text('Selim Çınar')")
    sonra = await pg.evaluate(OKUNDU_JS, "kisi-14")
    selim = await pg.text_content(".tel")
    denetle("Okumak cevaplamak değildir: sponsor temsilcisinin konuşmasını açmak yeni işaretini kaldırdı, karar hâlâ bekliyor; mesaj kendi ağzından",
            once[0] > 0 and sonra[0] == 0 and sonra[2] == 1 and "babam selam söyledi" in selim and await pg.query_selector(".tel .kk") is None, f"{once} → {sonra}")
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await pg.click(".tel-kisi:has-text('Hikmet Aydın')")
    taşmalar.append(await pg.evaluate(TASMA_JS))
    konusma = await pg.text_content(".tel")
    c1 = await cevaplar(pg)
    denetle("Kararı soran saymanın konuşmasında hazır görüşü ve iki cevap [kendin görüş / sayman görüşsün]; gezinmek durumu değiştirmedi",
            c1 == "kendin,devret" and "Görüşü" in konusma and (await durum(pg))["karar"] == d0["karar"] and (await durum(pg))["nakit"] == d0["nakit"], c1)
    await pg.click('.tel [data-eylem="dosyaAc"]')
    dosya_baslik = await pg.text_content(".od-dosyaBaslik")
    mesaja_don = await pg.query_selector('[data-eylem="donus"]:has-text("Mesaja dön")') is not None
    await pg.click('[data-eylem="donus"]')
    donulen = await pg.text_content(".tel-baslik h4")
    denetle("Konuşmadan dosyaya gidilir, '◂ Mesaja dön' aynı konuşmaya döner", mesaja_don and "Sponsor" in dosya_baslik and "Hikmet Aydın" in donulen, donulen)
    await pg.click('.tel [data-eylem="telEv"]')
    await pg.click('.tel [data-eylem="telUyg"][data-uyg="skor"]')
    yazi = await pg.text_content(".tel")
    denetle("Canlı Skor: bugün maç yok, sıradaki maç ve 'diğer maçların verisi henüz bağlı değil' dürüstçe yazıyor", "Bugün maç yok" in yazi and "Sıradaki" in yazi and "henüz bağlı değil" in yazi, yazi[:120])
    # dosya: kategori, kişi portresi, iki büyük cevap, sayaçlar, arşiv; test simgesi
    await pg.keyboard.press("Digit3")
    yazi = await pg.text_content(".od-panel")
    alt = await pg.text_content(".od-panelAlt")
    denetle("Dosya: kategori, başlık, kişi portresi, son cevap, kısa konu, iki büyük cevap ve ayrı geçmiş; altta önceki/sıradaki ve sayaçlar",
            "Mali" in yazi and "Son cevap" in yazi and "Geçmiş ve belgeler" in yazi and await pg.query_selector(".od-panel .od-portre") is not None
            and await cevaplar(pg) == "kendin,devret" and "1 açık" in alt and "1 cevap bekleyen" in alt and "Arşiv (2)" in alt and await pg.query_selector('.od-panel [data-eylem="tavsiye"]') is None, alt)
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
    denetle("Arşiv ayrı açılır: kapanan koltuk ve destek dosyaları listede ve okunabiliyor; Sıradaki açık dosyaya döndürüyor",
            "Arşiv" in arsiv and "destek" in arsiv and "koltuğu" in arsiv and "Kapandı" in kapali and "Sponsor" in acik_dosya, acik_dosya)
    # ajanda: gün şeridi, gelecek gün, sekme yok; kasa mali dosyadan
    await pg.keyboard.press("Digit2")
    taşmalar.append(await pg.evaluate(TASMA_JS))
    karar_baglanti = await pg.query_selector('.od-panel [data-eylem="dosyaAc"][data-donus="ajanda"]') is not None
    await pg.click('[data-eylem="gun"][data-tarih="2026-11-28"]')
    yazi = await pg.text_content(".od-panel")
    sekme = await pg.query_selector('[data-eylem="ajSekme"]') is not None
    await pg.keyboard.press("Digit3")
    await pg.click('.od-panel [data-eylem="ac"][data-panel="kasa"]')
    kasa = await pg.text_content(".od-panel")
    taşmalar.append(await pg.evaluate(TASMA_JS))
    denetle("Ajanda sade: bağlı karar dosyaya yönlendiriyor, Cumartesi maç randevusu görünüyor, girişim/söz sekmesi ve kasa yok; kasa mali dosyadan açılıyor",
            karar_baglanti and not sekme and "Maç: Demirkapı SK – Akdeniz FK" in yazi and "28 Kasım Cumartesi" in yazi and "Kasa" not in yazi
            and "Kasadaki para" in kasa and "Kasım maaşları" in kasa and "Ödeme takvimi" in kasa, kasa[:100])
    denetle("Telefon, dosya, arşiv, ajanda günleri, kasa ve test simgesi arasında gezmek tarihi, saati, parayı ve geçmişi değiştirmedi",
            {a: b for a, b in (await durum(pg)).items()} == d0, str(await durum(pg)))
    # karar: aynı dosya açık kalır, sonucu orada görünür; otomatik sonraki dosyaya geçilmez
    await pg.keyboard.press("Digit3")
    once_baslik = await pg.text_content(".od-dosyaBaslik")
    await oda_karar(pg, "kendin")
    sonra = await pg.text_content(".od-panel")
    yeni_cevap = await cevaplar(pg)
    denetle("Karar sonrası aynı dosya açık; kısa sonuç orada, gerçekten doğan karşı teklif aynı dosyada iki cevaplı",
            await pg.text_content(".od-dosyaBaslik") == once_baslik and "Sonuç" in sonra and await pg.text_content(".od-panel h3") == "Dosya" and yeni_cevap == "kabul,ret", sonra[:140])
    await oda_karar(pg, "ret")
    ikinci = await cevaplar(pg)
    await oda_karar(pg, "maasGeciktir")
    denetle("Teklif reddedilince kart açığı kapatma yollarıyla döndü [bakımı ertelet / maaşı beklet]; maaş bekletildi, söz kaydedildi",
            ikinci == "bakimErtele,maasGeciktir" and (await durum(pg))["soz"] == "soz.maas:acik", ikinci)
    # yeni haber açık dosyayı değiştirmez: İlerle → gazetenin sorusu gelir; dosya yine önceki konuyla açılır, yeni konu sıranın sonunda
    await pg.keyboard.press("Escape")
    await oda_ilerle(pg)
    d = await durum(pg)
    await pg.keyboard.press("Digit3")
    denetle("Yeni konu geldi (gazetenin sorusu); dosya yine kaldığın konuyla açılıyor, yeni konu 'Sıradaki dosya'da",
            "basinSorusu:kararBekliyor" in d["mesele"] and await pg.text_content(".od-dosyaBaslik") == once_baslik and "2 açık" in await pg.text_content(".od-panelAlt"), d["mesele"])
    await pg.keyboard.press("BracketRight")
    denetle("Klavye ']' sıradaki dosyayı açar", "Postası" in await pg.text_content(".od-dosyaBaslik"))
    # ayarlar: hareket bölümü yok; eski 'hareket' ayarı yürüyüşü atlatmaz; görüntü kaydı
    await ayar_ac(pg, "gelistirici")
    bolumler = await pg.eval_on_selector_all('[data-eylem="ayarBolum"]', "L => L.map(b => b.dataset.bolum).join(',')")
    ayar_yazi = await pg.text_content(".od-panel")
    async with pg.expect_download() as indirme:
        await pg.click('[data-eylem="goruntu"]')
    ad = (await indirme.value).suggested_filename
    d_once = await durum(pg)
    await pg.evaluate("localStorage.setItem('chairman:ayarlar', JSON.stringify({ yazi: 'normal', test: true, hareket: true }))")
    await oda_yenile(pg)
    await donus_kapat(pg)
    ayar = await pg.evaluate("({ ayar: Object.keys(OYUN.ayarlar).filter(a => typeof OYUN.ayarlar[a] !== 'function').join(','), kayit: localStorage.getItem('chairman:ayarlar'), fn: typeof hareketAz })")
    await pg.keyboard.press("Digit5")
    await pg.wait_for_timeout(200)
    yer = await pg.evaluate("ODA.yer")
    denetle("Ayarlar: Okuma, Kayıt, Geliştirici (hareket ayarı yok); eski 'hareket' kaydı okunmadı ve düştü, yürüyüş atlanmadı; Görüntüyü kaydet PNG indirdi",
            bolumler == "okuma,kayit,gelistirici" and "Hareket" not in ayar_yazi and ayar["ayar"] == "yazi,test" and "hareket" not in ayar["kayit"] and ayar["fn"] == "undefined"
            and yer == "yolda" and ad.startswith("chairman-") and ad.endswith(".png") and await durum(pg) == d_once, f"{bolumler} · {ayar} · {yer} · {ad}")
    await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
    await pg.keyboard.press("Digit5")
    await pg.wait_for_function("ODA.yer === 'masa'", timeout=YURUYUS_BEKLE)
    # büyük yazıda taşma yok
    await ayar_ac(pg, "okuma")
    await pg.click('[data-eylem="yazi"][data-yazi="buyuk"]')
    for tus in ("Digit1", "Digit2", "Digit3"):
        await pg.keyboard.press(tus)
        taşmalar.append(await pg.evaluate(TASMA_JS))
    await pg.screenshot(path=str(ARAC / "son-akis-13-buyuk-dosya.png"))
    await tel_kisi(pg, "Nalan Ergin")
    taşmalar.append(await pg.evaluate(TASMA_JS))
    await pg.screenshot(path=str(ARAC / "son-akis-13-buyuk-telefon.png"))
    denetle("Normal ve büyük yazıda panellerde (telefon dahil) yatay taşma yok", all(t == 0 for t in taşmalar), str(taşmalar))
    await pg.context.close()


PROGRAM_JS = "() => ({ ...ON_EKRAN.programDurumu(), faz: mac.phase, t: +mac.sen.t.toFixed(3), sn: +mac.gameSec.toFixed(3), kapali: document.getElementById('btnIlerle').disabled, acik: !document.getElementById('onEkran').hidden, cubuk: +document.querySelector('.prg-cubuk').getAttribute('aria-valuenow'), en: parseFloat(document.querySelector('.prg-cubuk i').style.width) || 0 })"


async def bolum_14(tarayici, site, tum_hatalar):
    """Maç öncesi tek ekran (2.8J): dolan çubuk, 10 sn etkin hazırlık, kaynak hazırlığı, duraklatma, elle geçiş."""
    pg, hatalar = await sayfa(tarayici, site, "?ekran=bulten&tohum=4", "#onEkran:not([hidden]) #btnIlerle")
    tum_hatalar += hatalar
    yazi = await pg.text_content("#onEkran")
    denetle("Tek kompakt ekran: armalar, karşılaşma, saat, sıra/puan karşılaştırması, tek cümle bağlam; sayfa sekmesi, stat çizimi ve sahte yüzde yok",
            "Maç günü" in yazi and "Demirkapı İlçe Stadı" in yazi and await pg.query_selector("#onEkran svg") is None and await pg.query_selector(".prg-sayfalar") is None
            and await pg.eval_on_selector_all("#onEkran .oe-arma", "L => L.length") == 2 and "Sıra" in yazi and "Puan" in yazi and "%" not in yazi
            and await pg.query_selector('.prg-cubuk[role="progressbar"]') is not None and "kadro" not in yazi.lower())
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
    pg, hatalar = await oda_ac(tarayici, site, "?baslangic=duzenli&dunya=7&stat=sehir")
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
    # maç: başkan koltuğu protokol locasında; altında sıralar; tabela başkanın normal bakışında okunur
    pg, hatalar = await sayfa(tarayici, site, "?ekran=mac&stat=sehir&tohum=5", "#btnMacaGec")
    tum_hatalar += hatalar
    k = await pg.evaluate("""() => { const t = STAT.tribunler.find(x => x.yer === 'ana'), O = tribunOlcu(t);
      return { y: +BASKAN_KOLTUGU.y.toFixed(2), beklenen: +(O.y0 + t.baskanSira * O.eg + (t.protokol || 0) + KOLTUK_YUKSEKLIGI * 1.14).toFixed(2), sira: t.baskanSira, protokol: t.protokol, tribun: t.sira, ad: STAT.ad }; }""")
    denetle("Maçta başkan koltuğu küçük ana tribünün protokol locasında (5. sıra, 1,5 m yükseltilmiş; altında 4 sıra ve geçit); konum tarifin geometrisinden",
            k["y"] == k["beklenen"] and k["sira"] == 5 and k["protokol"] == 1.5 and k["tribun"] <= 9 and k["y"] > 5 and k["ad"] == "Demirkapı İlçe Stadı", str(k))
    await pg.click("#btnMacaGec")
    await pg.wait_for_timeout(2500)
    await pg.keyboard.press("KeyP")
    await pg.evaluate("BAKIS.set(0, 1, 0)")
    await pg.wait_for_timeout(300)
    t = await pg.evaluate(TABELA_JS)
    denetle("Tek tabela başkan bakışında: orta sahaya bakarken ekranın içinde, okunacak büyüklükte (iç çözünürlükte ≥ 60 piksel en)",
            abs(t["x"]) < 0.95 and abs(t["y"]) < 0.95 and t["en"] >= 60 and t["boy"] >= 25, str(t))
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

        # ---- 1. sıkışık başlangıç: sıralı sayman görüşmesi, destek teklifi, nakit takvimi, sponsorun haberi ----
        pg, hatalar = await sayfa_ac(tarayici, site, SIKISIK)
        tum_hatalar += hatalar
        d0 = await durum(pg)
        denetle("Yeni kariyer Pazartesi 08:00; sıkışık başlangıç, içerik sürümü 3, sayman koltuğu boş, henüz mesele ve karar yok",
                d0["tarih"] == "2026-11-23" and d0["dakika"] == 480 and d0["baslangic"] == "sikisik" and d0["sayman"] is None and d0["mesele"] == "" and d0["icerik"] == 3 and d0["karar"] == "", str(d0))
        yazi = await pg.inner_text("#ajanda")
        denetle("Henüz olmamış gelişmeler ve eski sabit işler ekranda yok", "Gelişme" not in yazi and "gelisme" not in yazi and "yönetim toplantısı" not in yazi and "röportaj" not in yazi)
        await ilerle_tikla(pg)
        await karar_ver(pg, await pg.evaluate(RANDEVU_JS, "adayGorusmesi"), None)
        aday = await karar_isi(pg, "adayGorusmesi")
        s = await secenekler_aj(pg, aday)
        d = await durum(pg)
        denetle("Sayman görüşmesi randevudur (karar değil); katılınca ilk adayın kartı gelir: [Göreve al] / [Sıradaki adayı dinle]",
                s == "al,sonraki" and d["dakika"] == 630 and "koltuk:kararBekliyor" in d["mesele"], f"{s} · {d['dakika']}")
        await karar_ver(pg, aday, "al")
        d = await durum(pg)
        denetle("Tuncay Erbil göreve alındı; komut kaydedildi", d["sayman"] == "kisi-9" and "koltuk:kapandi" in d["mesele"] and json.loads(await pg.evaluate(KAYIT_JS))["veri"]["gunIciDakika"] == 630, str(d))
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, Salı 10:30'da gelen destek teklifinde durdu; karar acil değil, iki cevaplı",
                d["tarih"] == "2026-11-24" and d["dakika"] == 630 and "kosulluDestek:kararBekliyor" in d["mesele"] and d["karar"] != ""
                and await secenekler_aj(pg, await karar_isi(pg, "destekCevabi")) == "kabul,kucult", str(d))
        await karar_ver(pg, await karar_isi(pg, "destekCevabi"), "kucult")
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, Salı 14:00 yeni saymanın istediği nakit takvimi randevusunda durdu: [sponsoru bugün ara] / [tahsilat bundan sonra sende]",
                d["tarih"] == "2026-11-24" and d["dakika"] == 840 and await secenekler_aj(pg, await karar_isi(pg, "nakitOnerisi")) == "takip,kalici", str(d))
        await karar_ver(pg, await karar_isi(pg, "nakitOnerisi"), "takip")
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, sponsorun haberinde (Çarşamba 09:30) durdu; mesele açıldı, kriz kartı [kendin / sayman] bekliyor",
                d["tarih"] == "2026-11-25" and d["dakika"] == 570 and "odemeSikismasi:kararBekliyor" in d["mesele"] and "odemeSikismasi/kriz:acik" in d["olay"]
                and await secenekler_aj(pg, await karar_isi(pg, "odemeYolu")) == "kendin,devret", str(d))
        denetle("Kayıt her komuttan sonra yazılmış: kayıt oyun-içi saati yansıtıyor", json.loads(await pg.evaluate(KAYIT_JS))["veri"]["tarih"] == "2026-11-25")
        await pg.screenshot(path=str(ARAC / "son-akis-1-haber.png"))

        # ---- 2. mesele dosyası: kim, ne, şimdi, kanıtlar ----
        mesele = await pg.evaluate(MESELE_JS, "odemeSikismasi")
        await pg.click(f'button.aj-mesele[data-mesele="{mesele}"]')
        yazi = await pg.inner_text("#ajanda .aj-p-ayrinti")
        denetle("Mesele dosyası: yürüten, bekleyen, şimdi ve kaynağıyla bilinenler (saymanın hazır görüşü dahil)",
                "Karar sende" in yazi and "Bekleyen" in yazi and "Şimdi" in yazi and "Bilinenler" in yazi and "Muhasebe kayıtları" in yazi and "Tuncay Erbil" in yazi,
                yazi.replace("\n", " | ")[:220])
        tum_yazi = await pg.inner_text("body")
        denetle("Gizli koşul, paket adı ve tohum koyu ajandada yok", not any(x in tum_yazi for x in ("nakitSikisik", "pazarlik", "odemeSikismasi", "P01", "sikisik")))
        await pg.screenshot(path=str(ARAC / "son-akis-2-mesele.png"))
        await pg.click('[data-eylem="kararAc"]')
        secenekler = await pg.eval_on_selector_all('[data-eylem="sec"]', "L => L.map(b => b.dataset.secim).join(',')")
        denetle("Kriz kararı iki yol sunuyor (gizli üçüncü karar ya da 'Görüş iste' yok)", secenekler == "kendin,devret" and await pg.query_selector('[data-eylem="tavsiye"]') is None, secenekler)
        await pg.screenshot(path=str(ARAC / "son-akis-3-karar.png"))

        # ---- 3. saymana devret; İlerle haber anında durur ----
        await pg.click('[data-eylem="sec"][data-secim="devret"]')
        await pg.click('[data-eylem="yap"]')
        await pg.click(f'button.aj-mesele[data-mesele="{mesele}"]')
        yazi = await pg.text_content("#ajanda .aj-p-ayrinti")
        denetle("Devirden sonra mesele ekipte; yürüten sayman", "Ekipte" in yazi and "Tuncay Erbil" in yazi, yazi.replace("\n", " | ")[:160])
        await ilerle_tikla(pg)
        d = await durum(pg)
        denetle("İlerle, saymanın haberinde (Perşembe 09:30) durdu; yetkiyi aşan indirim teklifi başkana döndü",
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
        denetle("Maç gününe gelindi: küçük destek, indirimli taksit ve maaş birer kez işlendi, kasa eksiye düşmedi; gazete ve teşekkür kayıtlı",
                d["tarih"] == "2026-11-28" and d["nakit"] == 330000000 - 4500000 - 35000000 + 15000000 + 135000000 + 12000000 - 320000000 and d["hareket"] == 6
                and d["mesele"] == "koltuk:kapandi,kosulluDestek:kapandi,odemeSikismasi:kapandi" and d["haber"] == "gazete.macOnu,tesekkur.maas", str(d))
        onceki_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        await pg.click('.aj-ana:has-text("Stada git")')
        if await pg.query_selector('.aj-ana[data-eylem="yap"]:has-text("Onayla")'):
            await pg.click('.aj-ana')
        await pg.wait_for_selector("#onEkran:not([hidden])", timeout=20000)
        denetle("Stada git: ajanda kapandı, maç öncesi ekranı açıldı", await pg.evaluate("document.getElementById('ajanda').hidden") is True)
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
        for _ in range(10):
            if (await durum(pg))["olay"]:
                break
            await ilerle_tikla(pg)
        d = await durum(pg)
        secenekler = await secenekler_aj(pg, await karar_isi(pg, "ertelemeTalebi"))
        yazi = await pg.text_content("#ajanda .aj-p-ayrinti")
        denetle("Rahat başlangıç: aynı haber acil olmayan, cevapsız kalabilen bir karar açtı: [sayman konuşsun] / [%2 bedeli iste]; son cevap Cuma 18:00",
                d["tarih"] == "2026-11-25" and d["dakika"] == 570 and d["olay"] == "odemeSikismasi/degerlendirme:acik" and d["karar"] != "" and secenekler == "devret,bedel" and "27 Kas" in yazi,
                f"{secenekler} · {d}")
        await pg.screenshot(path=str(ARAC / "son-akis-7-rahat.png"))
        await pg.context.close()

        # ---- 8. eski kayıtlar: kendi (çok seçenekli) içerikleriyle sürer ----
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
            if (surum, ad) == (3, "kriz-acik"):
                await pg2.click('[data-eylem="devam"]')
                s = await secenekler_aj(pg2, d["karar"])
                denetle("Eski kayıttaki kriz kararı eski içeriğiyle (dört yol) sürüyor; yeni türlere sessizce dönüşmedi", s == "kendin,devret,bakimErtele,maasGeciktir", s)
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
        nokta = await pg.evaluate("""() => { const v = ODA.nesneler.ajanda.merkez.clone().project(ODA.kamera), r = document.getElementById('oda').getBoundingClientRect();
          return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height }; }""")
        await pg.mouse.move(nokta["x"], nokta["y"])
        await pg.mouse.click(nokta["x"], nokta["y"])
        ajanda = await pg.text_content(".od-panel")
        denetle("Masadaki ajanda defterine tıklamak sade Ajanda panelini açtı: gün şeridi ve randevu; sekme/kasa yok",
                await pg.text_content(".od-panel h3") == "Ajanda" and "Sayman adaylarıyla görüşme" in ajanda and await pg.query_selector('[data-eylem="ajSekme"]') is None)
        await ajanda_katil(pg, "Sayman adaylarıyla görüşme")
        await pg.keyboard.press("Digit3")
        yazi = await pg.text_content(".od-panel")
        acik = await pg.eval_on_selector_all(".od-panel .od-test", "L => L.length")
        denetle("Randevuya katılınca dosyada ilk adayın kartı: portre, profil, [Göreve al] / [Sıradaki adayı dinle]; test açıkken katkı ve sonuç görünür",
                "Tuncay Erbil" in await pg.text_content(".od-kisiSatir") and await cevaplar(pg) == "al,sonraki" and acik >= 2 and "katkı:" in yazi and "güçlü" in yazi, f"{acik} test kutusu")
        await ayar_ac(pg, "gelistirici")
        await pg.click('[data-eylem="test"]')
        await pg.keyboard.press("Digit3")
        kapali = await pg.eval_on_selector_all("#oda .od-test", "L => L.length")
        kapali_yazi = await pg.text_content("#oda")
        denetle("Test bilgileri kapalıyken ekranda katkı ya da TEST simgesi yok", kapali == 0 and "katkı:" not in kapali_yazi and "TEST" not in kapali_yazi, f"{kapali}")
        await ayar_ac(pg, "gelistirici")
        await pg.click('[data-eylem="test"]')
        await pg.click('[data-eylem="ac"][data-panel="kadro"]')
        yazi = await pg.text_content(".od-panel")
        denetle("Kadro (TEST) paneli futbolcu özelliklerini gösteriyor", "Erdal" in yazi and "Engin" in yazi and await pg.eval_on_selector_all(".od-kadro tbody tr", "L => L.length") >= 11)
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-kadro.png"))
        await pg.keyboard.press("Digit3")
        await oda_karar(pg, "al")
        await pg.keyboard.press("Escape")
        denetle("Esc paneli kapattı; sayman (Tuncay Erbil) göreve alındı ve kaydedildi", await pg.query_selector(".od-panel") is None and (await durum(pg))["sayman"] == "kisi-9"
                and json.loads(await pg.evaluate(KAYIT_JS))["veri"]["gunIciDakika"] == 630)

        # girişim: başkan hocayla görüşmeyi telefondaki konuşmadan kendisi başlatır; görüşme karar değil, katılınan randevudur
        await tel_kisi(pg, "Şükrü Hoca")
        oneri = await pg.text_content(".tel-oneri")
        await pg.click('.tel [data-eylem="girisim"][data-girisim="hocaGorusmesi"]')
        await ajanda_katil(pg, "Şükrü Hoca ile görüşme")
        d = await durum(pg)
        yazi = await pg.text_content(".od-panel")
        denetle("Girişim: hocayla görüşme telefondan başlatıldı, ajandadan katılındı; isteği olmadığı öğrenildi, karar sorulmadı",
                "Hocayla görüş" in oneri and d["dakika"] == 675 and "isteği yok" in yazi and "koltuk:kapandi" == d["mesele"] and await pg.query_selector(".od-panel .kk") is None, f"{d['dakika']} · {d['mesele']}")
        await pg.keyboard.press("Escape")

        # destek teklifi: telefonda teklif sahibinin konuşmasında iki cevap; teklif sahibi sayman olduğu için görüşü yok; telefondan cevap
        await oda_ilerle(pg)
        d = await durum(pg)
        denetle("İlerle destek teklifinde durdu; panel kendiliğinden açılmadı, telefon yandı, dosya masaya geldi",
                d["tarih"] == "2026-11-24" and d["dakika"] == 630 and await pg.query_selector(".od-panel") is None and await pg.evaluate("ODA.durum.haber > 0 && ODA.nesneler.dosya.g.visible"), str(d))
        await tel_kisi(pg, "Tuncay Erbil")
        konusma = await pg.text_content(".tel")
        c = await cevaplar(pg)
        denetle("Konuşmada teklif sahibinin kendi mesajı ve iki cevap [kabul / küçük destek]; teklif sahibi sayman olduğu için hazır görüş yok",
                "firma olarak" in konusma and c == "kabul,kucult" and "Görüşü" not in konusma, c)
        gecmis_once = d["gecmis"]
        await oda_karar(pg, "kucult")
        d = await durum(pg)
        giden = await pg.eval_on_selector_all(".tel-giden", "L => L.map(x => x.textContent)")
        denetle("Telefondan cevap verildi: gönderilen cevap baloncuğu konuşmada, karar bir kez uygulandı, dosyada karar kalmadı",
                any("Küçük destek" in g for g in giden) and d["gecmis"] == gecmis_once + 1 and await pg.query_selector(".tel .kk") is None and "kosulluDestek:haberBekliyor" in d["mesele"], f"{giden} · {d['mesele']}")
        await pg.keyboard.press("Escape")
        await oda_ilerle(pg)
        await oda_ilerle(pg)
        d = await durum(pg)
        oda = await pg.evaluate("({haber: ODA.durum.haber, dosya: ODA.nesneler.dosya.g.visible, panel: !!document.querySelector('.od-panel'), rozet: (document.querySelector('.od-nesne[data-panel=\"telefon\"] .od-rozet') || {}).textContent || ''})")
        yazi = await pg.inner_text("#oda .od-alt")
        denetle("İlerle (nakit takvimi kaçırıldı) sponsorun haberinde durdu: panel kendiliğinden açılmadı, telefon yandı, alt şerit haberi yazdı",
                d["tarih"] == "2026-11-25" and d["dakika"] == 570 and "odemeSikismasi:kararBekliyor" in d["mesele"] and oda["haber"] > 0 and oda["dosya"] and not oda["panel"] and oda["rozet"] != "" and "Telefon" in yazi, f"{oda} · {yazi[:90]}")
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-haber.png"))
        onceki = await durum(pg)
        await tel_kisi(pg, "Tuncay Erbil")
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-telefon.png"))
        tel_cevap = await cevaplar(pg)
        await pg.keyboard.press("Digit3")
        yazi = await pg.text_content(".od-panel")
        denetle("Aynı karar telefonda (saymanın konuşması) ve dosyada iki cevaplı; dosyada bilinenler kaynağıyla, test kutusu gizli koşulu gösteriyor",
                tel_cevap == "kendin,devret" and "Bilinenler" in yazi and "Muhasebe kayıtları" in yazi and "Sponsorluk sözleşmesi" in yazi and "Sponsorun gerçek durumu: nakitSikisik" in yazi
                and await cevaplar(pg) == "kendin,devret", yazi[:120])
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-dosya.png"))
        await pg.keyboard.press("Digit2")
        await pg.keyboard.press("Escape")
        sonra = await durum(pg)
        denetle("Telefon, ajanda ve dosya arasında gezmek ve kapatmak tarihi, saati, parayı ve geçmişi değiştirmedi", onceki == sonra, f"{onceki} → {sonra}")
        await pg.keyboard.press("Digit3")
        await oda_karar(pg, "devret")
        await pg.keyboard.press("Escape")
        await oda_ilerle(pg)
        await pg.keyboard.press("Digit3")
        await oda_karar(pg, "ret")
        await oda_karar(pg, "maasGeciktir")
        await pg.keyboard.press("Escape")
        d = await durum(pg)
        denetle("Sayman indirim getirdi, reddedildi; kart döndü ve maaş bekletildi: söz kaydedildi, kasa açığı kapandı", d["soz"] == "soz.maas:acik" and d["karar"] == "" and d["tarih"] == "2026-11-26" and d["dakika"] == 600, str(d))

        # basın sorusu, ayar ve yenileme
        await oda_ilerle(pg)
        d = await durum(pg)
        denetle("İlerle gazetenin sorusunda (Perşembe 16:00) durdu; soru muhabirin kendi mesajı", d["tarih"] == "2026-11-26" and d["dakika"] == 960 and "basinSorusu:kararBekliyor" in d["mesele"], str(d))
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
        denetle("Dönüşte telefonun ana ekranında Kaldığın yer özeti", "Kaldığın yer" in yazi and "Son yaptığın" in yazi, yazi[:160])
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-donus.png"))
        await pg.click('[data-eylem="devam"]')
        await ayar_ac(pg, "okuma")
        await pg.click('[data-eylem="yazi"][data-yazi="normal"]')
        await tel_kisi(pg, "Nalan Ergin")
        nalan = await pg.text_content(".tel")
        c = await cevaplar(pg)
        await oda_karar(pg, "kendin")
        await pg.keyboard.press("Escape")
        tavir = await pg.evaluate("Object.values(OYUN.kariyer.olaylar).find(o => o.paket === 'basinSorusu').sonuc.basin")
        denetle("Basın sorusu muhabirin kendi mesajı; konuşmada [kendin konuş / sözcü açıklasın]; telefondan cevaplandı (başkan konuştu)",
                "Demirkapı Postası'ndan Nalan" in nalan and c == "kendin,devret" and tavir == "baskan", f"{c} · {tavir}")
        for _ in range(8):
            if await pg.query_selector('.od-ana:has-text("Stada git")'):
                break
            await oda_ilerle(pg)
        d = await durum(pg)
        iz = await pg.evaluate("({gazete: ODA.nesneler.gazete.g.visible, kart: ODA.kart.visible, iskele: ODA.iskele, not: ODA.panoNotu.visible, yeni: ODA.durum.gazeteYeni})")
        denetle("Maç gününe gelindi: gazete masada (yeni), pencerede basamak onarımı iskelesi; teşekkür kartı ve pano notu yok (maaş gecikti, pano sözü yok)",
                d["tarih"] == "2026-11-28" and d["haber"] == "gazete.maas" and iz == {"gazete": True, "kart": False, "iskele": True, "not": False, "yeni": True}, f"{iz} · {d['haber']}")
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-mac-gunu.png"))
        await pg.keyboard.press("Digit4")
        yazi = await pg.text_content(".od-panel")
        denetle("Gazete paneli: manşet başkanın açıklamasını yansıtıyor; açınca yeni işareti kalktı",
                "Demirkapı Postası" in yazi and "Başkan Demirel açıkladı" in yazi and await pg.evaluate("OYUN.kariyer.haberler.every(h => h.gorulen)"), yazi[:160])
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-gazete.png"))
        await pg.keyboard.press("Digit3")
        while "Sponsor" not in await pg.text_content(".od-dosyaBaslik"):
            await pg.keyboard.press("BracketRight")
        yazi = await pg.text_content(".od-panel")
        denetle("Sözler dosyada: sponsor dosyasında personele verilen açık söz (maaş günü) görünüyor", "Sözler" in yazi and "Açık" in yazi and "10 Aralık" in yazi)
        await pg.keyboard.press("Escape")
        onceki = (await durum(pg), iz)
        await oda_yenile(pg)
        iz2 = await pg.evaluate("({gazete: ODA.nesneler.gazete.g.visible, kart: ODA.kart.visible, iskele: ODA.iskele, not: ODA.panoNotu.visible, yeni: ODA.durum.gazeteYeni})")
        denetle("Yenilemeden sonra izler aynı (gazete masada, iskele pencerede); yeni işareti kalkmış", await durum(pg) == onceki[0] and iz2 == dict(iz, yeni=False), str(iz2))
        await donus_kapat(pg)
        onceki_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        await pg.click('.od-ana:has-text("Stada git")')
        await pg.wait_for_selector("#onEkran:not([hidden])", timeout=20000)
        son_kayit = json.loads(await pg.evaluate(KAYIT_JS))["veri"]
        denetle("Stada git: oda kapandı, maç öncesi ekranı açıldı; maç sınırında kayıt yapılmadı",
                await pg.evaluate("document.getElementById('oda').hidden") is True and son_kayit["gunIciDakika"] == onceki_kayit["gunIciDakika"] and len(son_kayit["isler"]) == len(onceki_kayit["isler"]))
        await pg.wait_for_function("!document.getElementById('btnIlerle').disabled", timeout=30000)
        await pg.click("#btnIlerle")
        await pg.wait_for_timeout(1500)
        await pg.keyboard.press("KeyT")
        await pg.click('#macTelefon [data-eylem="telUyg"][data-uyg="mesajlar"]')
        liste = await pg.eval_on_selector_all("#macTelefon .tel-kisi .tel-kisiAd b", "L => L.map(b => b.textContent)")
        await pg.click("#macTelefon .tel-kisi:has-text('Tuncay Erbil')")
        mac_tel = await pg.text_content("#macTelefon")
        denetle("Maçta aynı telefon: kariyerin kişi konuşmaları okunur; maçta cevap ya da girişim düğmesi yok",
                "Tuncay Erbil" in liste and "Nalan Ergin" in liste and await pg.query_selector('#macTelefon [data-eylem="girisim"], #macTelefon .kk-cevap:not([disabled])') is None, f"{liste}")
        await pg.keyboard.press("Escape")
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-sonrasi-mac.png"))
        await pg.context.close()

        pg, hatalar = await oda_ac(tarayici, site, "?baslangic=duzenli&dunya=7")
        tum_hatalar += hatalar
        await oda_ilerle(pg)
        d = await durum(pg)
        denetle("Düzenli başlangıç odada: tek İlerle ile maç günü; masada dosya yok, telefon sessiz, gazete maç önü haberiyle masada",
                d["tarih"] == "2026-11-28" and d["mesele"] == "" and d["haber"] == "gazete.macOnu" and await pg.evaluate("!ODA.nesneler.dosya.g.visible && ODA.durum.haber === 0 && ODA.nesneler.gazete.g.visible && !ODA.kart.visible")
                and await pg.query_selector('.od-ana:has-text("Stada git")') is not None, str(d))
        await pg.screenshot(path=str(ARAC / "son-akis-9-oda-duzenli.png"))
        await pg.context.close()

        # ---- 10. balkon ve antrenman gözlemi (2.7): yürüyüş, gözlem, telefonla kesilme, kısa iş, devam, dönüş ----
        pg, hatalar = await oda_ac(tarayici, site, SIKISIK)
        tum_hatalar += hatalar
        # hazırlık (ekran dışı, aynı kariyer komutları): Tuncay sayman; maaş bekletilir; saat Perşembe 15:00'e getirilir; gazete 16:00'da arayacak
        await pg.evaluate(HAZIRLIK_JS, [{"adayGorusmesi": "al:kisi-9", "destekCevabi": "kucult", "odemeYolu": ["devret", "maasGeciktir"], "odemeTeklifi": "ret"}, "maas"])
        await pg.evaluate("() => oyunKomut(k => zamanIlerlet(k, anDakika('2026-11-26', 900) - simdikiAn(k)))")
        await oda_yenile(pg)
        await donus_kapat(pg)
        d0 = await durum(pg)
        denetle("(hazırlık) Perşembe 15:00, maaş sözü açık; başkan masada, klavye için Balkona çık düğmesi var",
                d0["tarih"] == "2026-11-26" and d0["dakika"] == 900 and d0["soz"] == "soz.maas:acik" and await pg.evaluate("ODA.yer") == "masa"
                and "Balkona çık" in await pg.text_content(".od-yer") and await pg.query_selector(".od-gozlem") is None, str(d0))
        await pg.keyboard.press("Digit5")
        await pg.wait_for_function("ODA.yer === 'balkon'", timeout=YURUYUS_BEKLE)
        yazi = await pg.text_content(".od-gozlem")
        denetle("Balkona yüründü: yer değiştirmek tarihi, saati, parayı ve geçmişi değiştirmedi; antrenman sürüyor, izleme seçenekleri var",
                await durum(pg) == d0 and "Antrenman sürüyor" in yazi and "Odaya dön" in await pg.text_content(".od-yer")
                and await pg.eval_on_selector_all('[data-eylem="gozlem"]:not([disabled])', "L => L.map(b => b.dataset.dk).join(',')") == "15,30,120", yazi[:140])
        await pg.wait_for_timeout(1200)
        await pg.screenshot(path=str(ARAC / "son-akis-10-balkon.png"))
        await pg.click('[data-eylem="gozlem"][data-dk="120"]')
        await pg.wait_for_function("/Gözlem durdu/.test((document.querySelector('.od-gozlem') || {}).textContent || '')", timeout=30000)
        d = await durum(pg)
        mesaj = await pg.inner_text("#oda .od-mesaj")
        denetle("Sonuna kadar izle: gazete arayınca (16:00) gözlem durdu, aralık açık kaldı (kalan 60 dk), telefon yandı",
                d["dakika"] == 960 and d["gozlem"] == "900-1020" and "basinSorusu:kararBekliyor" in d["mesele"] and "Telefon çaldı" in mesaj and await pg.evaluate("ODA.durum.haber > 0 && ODA.yer === 'balkon'"), f"{d['dakika']} {d['gozlem']} · {mesaj[:90]}")
        await pg.wait_for_selector('[data-eylem="gozlemSurdur"]', timeout=15000)
        denetle("Acil olmayan basın sorusu beklerken Gözleme devam et açık (cevap baskı saatine kadar bekleyebilir); Gözlemi bırak açık",
                await pg.query_selector('[data-eylem="gozlemSurdur"]:not([disabled])') is not None and await pg.query_selector('[data-eylem="gozlemBirak"]:not([disabled])') is not None)
        await pg.screenshot(path=str(ARAC / "son-akis-10-balkon-durdu.png"))
        await oda_yenile(pg)
        await donus_kapat(pg)
        denetle("Yenilemeden sonra başkan yine balkonda, gözlem aynı yerde açık", await durum(pg) == d and await pg.evaluate("ODA.yer") == "balkon" and "Gözlem durdu" in await pg.text_content(".od-gozlem"))
        await pg.keyboard.press("Digit3")
        yazi = await pg.text_content(".od-panel")
        denetle("Dosya balkondan açıldı; uzun görüşme kapalı ve nedeni yazıyor, kısa cevap açık",
                "tam dikkat" in yazi and await pg.query_selector('.od-panel .kk-cevap[data-secim="kendin"][disabled]') is not None
                and await pg.query_selector('.od-panel .kk-cevap[data-secim="devret"]:not([disabled])') is not None, yazi[:160])
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
        await pg.wait_for_function("ODA.yer === 'masa'", timeout=YURUYUS_BEKLE)
        denetle("Odaya dönüldü: durum aynı, gözlem şeridi yok", await durum(pg) == d and await pg.query_selector(".od-gozlem") is None and "Balkona çık" in await pg.text_content(".od-yer"))
        await pg.wait_for_timeout(600)
        await pg.screenshot(path=str(ARAC / "son-akis-10-odaya-donus.png"))
        await pg.context.close()

        # ---- 12. genel duraklatma (2.8B): oda, yürüyüş, gerçek zamanlı gözlem ve maç ----
        await bolum_12(tarayici, site, tum_hatalar)

        # ---- 13. başkanlık ekranları (2.8C, 2.8I) ----
        await bolum_13(tarayici, site, tum_hatalar)

        # ---- 14. maç öncesi tek ekran (2.8J) ----
        await bolum_14(tarayici, site, tum_hatalar)

        # ---- 15. ortak çatısız stat ve mekân hareketi (2.8D, 2.8J) ----
        await bolum_15(tarayici, site, tum_hatalar)

        # ---- 16. maç telefonu (2.8F, 2.8I) ----
        await bolum_16(tarayici, site, tum_hatalar)

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
        await pg.goto((site / "index.html").as_uri() + SIKISIK)
        await pg.wait_for_selector("#oda:not([hidden]) .od-ana", timeout=20000)
        cerceve = await pg.evaluate("""() => ({ ust: !!document.querySelector('header.top, .rules, .pal, .radyo, #radyoMetin, #radyoSkor'),
          gelistirici: !!document.querySelector('details.gelistirici:not([open]) #hizSeg'), santra: (document.getElementById('btnMacaGec') || {}).textContent })""")
        denetle("Çerçeve temiz: başlık, kurallar, palet ve radyo satırı yok; deneme ayarları kapalı Geliştirici alanında; tören atlama düğmesi 'Santraya geç'",
                not cerceve["ust"] and cerceve["gelistirici"] and cerceve["santra"] == "Santraya geç", str(cerceve))
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
