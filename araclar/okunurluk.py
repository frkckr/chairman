#!/usr/bin/env python3
"""Chairman — okunurluk ölçüsü (R1-f, 2026-10-29).

Oyun karesi üç genişlikte (640, 800, 1186 px) açılır; her ekranda görünen her metnin hesaplanan yazı boyu ve kırpılıp kırpılmadığı ölçülür.
Ekranlar: oda (masa), defter, telefonun ana ekranı, konuşma (R2: iki sütun, tek kart iş panelinde), konu menüsü (R2 eki), mesaj listesi, Canlı Skor, dosya (tek kartla), Kadro sekmesi,
oyuncu dosyası, gazete, Ayarlar › Kayıt, maç öncesi bülteni ve maç sonu kartı. R3: Canlı Skor sayfaları sürüm 11 örnek kaydından
(araclar/ornekler/kayit-s11-hafta14.json): hafta görünümü, maç sayfası (Özet, İstatistikler, Kadrolar), oyuncu sayfası, takım sayfası (Genel, Kadro).
R4: Transfer masası (Pano, Piyasa, oyuncu kâğıdı) ve transfer zincirinin aday ve pazarlık kartı (yapay haftalarla 5 Ocak'a, oyunun komut yoluyla).
R5: balkon (antrenman kâğıdı: günün türü, gözlem, Gördüklerin) ve balkonda sağ yarıda açılan oyuncu dosyası. RB: “Sahada” listesi ve takip edilen
oyuncunun ad etiketi (balkon-sahada); 1366 ve 1536 pencerede balkon kâğıt bandıyla.
R6: sponsor pazarlık kartı (1 Şubat ay başı, Görüşelim'den sonra; oyunun komut yoluyla).

Sayılmayanlar: aria-hidden ve etkileşimsiz (inert: odak açıkken arkada bulanık kalan oda) alt ağaçlar, görünmeyen öğeler, kutusunun tamamen dışında
kalan metin (kaydırılabilir alanda kaydırınca okunur; kesen alanda bilerek gizlenmiştir: ekran okuyucu metni), TEST öğeleri (yayından önce kalkar). Kırpılan metin: en yakın taşmayı kesen atası overflow hidden/clip olan ve kutusunun dışına taşan metin
(bilinçli üç nokta, text-overflow: ellipsis, sayılmaz) ya da oyun karesinin dışına düşen metin.

Eşikler (R1 Claude kararı): her genişlikte gövde (oyun karesinin yazı ölçeği, --k-yaziBoyu) ≥ 14 px, okunan her metin ≥ 12 px, kırpılan metin yok.
Kullanım: python -X utf8 araclar/okunurluk.py [--genislik 640,800] [--sahne oda,dosya] [--json DOSYA]
Çıkış kodu: eşik dışı bulgu varsa 1. Ekran görüntüleri araclar/son-okunurluk-<genişlik>-<sahne>.png (Git dışı).
"""
import asyncio
import importlib.util
import json
import pathlib
import sys

sys.stdout.reconfigure(encoding="utf-8")
ARAC = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(ARAC))
import kontrol  # noqa: E402

_spec = importlib.util.spec_from_file_location("akis_deneme", ARAC / "akis-deneme.py")
akis = importlib.util.module_from_spec(_spec)
_argv, sys.argv = sys.argv, sys.argv[:1]   # akis-deneme argv'den bölüm seçer; yüklerken boş görsün
_spec.loader.exec_module(akis)
sys.argv = _argv

GOVDE_EN_AZ, METIN_EN_AZ = 14.0, 12.0
# kare genişliği → pencere (index.html: kare = min(pencere − 32, max(640, (yükseklik − pay) · 4/3)); RN-c (2026-10-30): pay ölçülür, odada 32 px
# (js/sunum-durumu.js ekranPayGuncelle; eskiden sabit 190). Üç kare eskisiyle aynı genişlikte kalır (karşılaştırma bozulmaz); iki dizüstü penceresi eklendi:
# 1366×650 (1366×768 ekran, tarayıcı ve görev çubuğu düşülmüş) → kare 825, 1536×740 (1920×1080 %125) → kare 944
GENISLIKLER = {640: (672, 560), 800: (832, 700), 825: (1366, 650), 944: (1536, 740), 1186: (1218, 1000)}

OLC_JS = r"""() => {
  const E = document.getElementById('screen'), R = E.getBoundingClientRect();
  const tanim = el => el.tagName.toLowerCase() + [...el.classList].slice(0, 2).map(c => '.' + c).join('');
  /* görünmez: gizli, saydam ya da ekran okuyucu için görsel olarak gizlenmiş (clip-path inset(50%), clip rect(0…), 1 px'lik kesen kutu) */
  const gorunur = el => { for (let x = el; x && x !== document.documentElement; x = x.parentElement) { const s = getComputedStyle(x);
      if (x.hidden || s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false;
      if (/inset\(50%\)/.test(s.clipPath) || /rect\(0(px)?,? 0(px)?,? 0(px)?,? 0(px)?\)/.test(s.clip)) return false;
      const b = x.getBoundingClientRect(); if (b.width <= 1 && b.height <= 1 && /hidden|clip/.test(s.overflowX + s.overflowY)) return false; } return true; };
  const metin = [], kirp = [];
  const w = document.createTreeWalker(E, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const t = n.textContent.replace(/\s+/g, ' ').trim(); if (!t) continue;
    const el = n.parentElement; if (!el || el.closest('[aria-hidden="true"],[inert],script,style,canvas,svg,.ckm-ortu')) continue;
    /* TEST öğeleri (Test bilgileri kutusu, TEST simgeleri ve şerit düğmeleri) yayından önce kalkar; ölçüye girmez */
    if (t === 'TEST' || el.closest('[class*="test" i]')) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || !gorunur(el)) continue;
    /* en yakın taşmayı kesen ata: auto/scroll → kaydırılabilir (görünmeyen kısım sayılmaz); hidden/clip → dışarıdaki kısım kırpılmıştır */
    let kesen = null, kaydir = null;
    for (let a = el; a && a !== E; a = a.parentElement) { const s = getComputedStyle(a), o = s.overflowX + ' ' + s.overflowY;
      if (/auto|scroll/.test(o)) { kaydir = a; break; } if (/hidden|clip/.test(o)) { kesen = a; break; } }
    const kutu = (kaydir || kesen || E).getBoundingClientRect();
    const disarda = r.right <= kutu.left + 1 || r.left >= kutu.right - 1 || r.bottom <= kutu.top + 1 || r.top >= kutu.bottom - 1;
    if (disarda) continue;                                 // kaydırınca okunur ya da bilerek gizlenmiş (ekran okuyucu metni, text-indent)
    const elips = x => x && getComputedStyle(x).textOverflow === 'ellipsis';
    const tasan = r.left < kutu.left - 1 || r.right > kutu.right + 1 || r.top < kutu.top - 1 || r.bottom > kutu.bottom + 1;
    /* kaydırılabilir alanda yarısı görünen metin kaydırınca okunur; kırpılan yalnız kesen (hidden/clip) atanın ya da karenin dışına taşan */
    if (tasan && !kaydir && !elips(el) && !elips(kesen)) kirp.push({ ad: tanim(el), kap: tanim(kesen || E), t: t.slice(0, 48) });
    metin.push({ px: Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10, ad: tanim(el), t: t.slice(0, 48) });
  }
  /* gövde: oyun karesinin ortak yazı ölçeği (--k-yaziBoyu; bütün HTML katmanları okur), sonda öğesiyle */
  const sonda = document.createElement('i'); sonda.style.cssText = 'position:absolute;visibility:hidden;font-size:var(--k-yaziBoyu,1.5cqw)';
  E.appendChild(sonda); const govde = parseFloat(getComputedStyle(sonda).fontSize); sonda.remove();
  return { kare: Math.round(R.width), govde: Math.round(govde * 10) / 10, metin, kirp };
}"""


async def tikla(pg, secici):
    """Önce gerçek tıklama; öğe görünür alana gelmiyorsa (dar karede yerleşim sorunu, ölçü bunu kırpılan olarak raporlar) DOM'dan tıklanır."""
    try:
        await pg.click(secici, timeout=3000)
    except Exception:
        await pg.evaluate("(s) => { const e = document.querySelector(s); if (e) e.click(); }", secici)


async def sahneler_oda(pg, olc):
    """TEST içerikli oda: Salı 10:30 kararına ilerlenir (akış §27 kalıbı); telefon ve dosyada tek kart görünür."""
    await olc("oda")
    await pg.keyboard.press("Digit2")
    await pg.wait_for_selector(".dft", timeout=10000)
    await olc("defter")
    await tikla(pg, '.od-alt .od-ana[data-eylem="yap"]')
    if await pg.query_selector('.od-alt .od-ana[data-eylem="yap"]:has-text("Onayla")'):
        await pg.click('.od-alt .od-ana[data-eylem="yap"]:has-text("Onayla")')
    await akis.masaya_don(pg)
    for _ in range(4):
        if (await akis.durum(pg))["mesele"]:
            break
        await akis.oda_ilerle(pg)
    await akis.masaya_don(pg)
    await pg.keyboard.press("Digit1")
    await pg.wait_for_selector(".tel-ekran", timeout=10000)
    await olc("telefon-ana")
    await tikla(pg, ".tel-bildirim[data-kisi]")
    await pg.wait_for_selector(".tlf-is .kk-kart", timeout=10000)   # R2: kart telefonun sağındaki iş panelinde
    await olc("telefon-konusma")
    await tikla(pg, '.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await olc("telefon-mesajlar")
    # R2 eki: konu menüsü (hocanın konuşmasında “Yeni konu aç”)
    hid = await pg.evaluate("() => OYUN.kariyer.kulupler[OYUN.kariyer.kisiler[OYUN.kariyer.baskanId].kulupId].hocaId")
    await tikla(pg, f'.tel [data-eylem="telKisi"][data-kisi="{hid}"]')
    await tikla(pg, '.tel-yeniKonu button')
    await pg.wait_for_selector(".tlf-menu", timeout=10000)
    await olc("telefon-konu-menusu")
    await tikla(pg, '.tel-kisiBas .tel-geri')
    await tikla(pg, '.tel [data-eylem="telEv"]')
    await tikla(pg, '.tel [data-eylem="telUyg"][data-uyg="skor"]')
    await olc("canli-skor")
    await pg.keyboard.press("Digit3")
    await pg.wait_for_selector(".dsy .kk-kart", timeout=10000)
    await olc("dosya-kart")
    await tikla(pg, ".dsy-kadroSekme")
    await pg.wait_for_selector(".dsy-kadro", timeout=10000)
    await olc("kadro")
    await tikla(pg, '.dsy-kadro button[data-eylem="oyuncuAc"]')
    await pg.wait_for_timeout(300)
    await olc("oyuncu-dosyasi")
    await pg.keyboard.press("Digit4")
    await pg.wait_for_timeout(400)
    await olc("gazete")
    await akis.masaya_don(pg)
    await tikla(pg, '.od-nesne[data-panel="ayar"]')
    await tikla(pg, '[data-eylem="ayarBolum"][data-bolum="kayit"]')
    await olc("ayarlar-kayit")


async def sahneler_canli(pg, olc):
    """R3: sürüm 11 örnek kaydı (14. hafta sonu, oynanmış iki hafta): hafta görünümü, maç sayfası, oyuncu ve takım sayfası (geniş karede sağ
    panelde, dar karede telefonun içinde)."""
    await pg.keyboard.press("Digit1")
    await pg.wait_for_selector(".tel-ekran", timeout=10000)
    await tikla(pg, '.tel [data-eylem="telUyg"][data-uyg="skor"]')
    await olc("canli-hafta")
    mid = await pg.evaluate("() => OYUN.kariyer.fikstur.find(f => f.hafta === 14 && (f.ev === 'demirkapi' || f.konuk === 'demirkapi')).id")
    await tikla(pg, f'.tel [data-eylem="csAc"][data-tur="mac"][data-id="{mid}"]')
    await olc("canli-mac-ozet")
    await tikla(pg, '.cs-sayfa [data-eylem="csBolum"][data-bolum="ist"]')
    await olc("canli-mac-ist")
    await tikla(pg, '.cs-sayfa [data-eylem="csBolum"][data-bolum="kadro"]')
    await olc("canli-mac-kadro")
    await tikla(pg, '.cs-sayfa .cs-kadro [data-eylem="csAc"][data-tur="oyuncu"]')
    await olc("canli-oyuncu")
    await tikla(pg, '.cs-sayfa [data-eylem="csAc"][data-tur="kulup"]')
    await olc("canli-kulup")
    await tikla(pg, '.cs-sayfa [data-eylem="csBolum"][data-bolum="kadro"]')
    await olc("canli-kulup-kadro")


CANLI_SAHNELER = {"canli-hafta", "canli-mac-ozet", "canli-mac-ist", "canli-mac-kadro", "canli-oyuncu", "canli-kulup", "canli-kulup-kadro"}


TRANSFER_SAHNELER = {"transfer-pano", "transfer-piyasa", "transfer-oyuncu", "transfer-aday-karti", "transfer-pazarlik-karti"}
# R4: şablon kartlarını politikayla cevaplayarak hedef aşamanın kartına dek sürer (öbür kararlar reddet ya da ilk; maç günü yapay 0–0)
ZINCIR_JS = """async ([hedef, pol]) => {
  const Z = {skor: [0, 0], bitti: true, goller: [], kartlar: [], sakatliklar: [], degisiklikler: [], ist: {}};
  for (let i = 0; i < 300; i++) {
    const k = OYUN.kariyer, kr = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.karar === 'sablonKarti');
    if (kr) { const a = k.meseleler[kr.veri.meseleId].sablon.asama; if (a === hedef) return kr.id;
      const S = ajandaOnizle(k, kr.id).secenekler; let s = pol[a]; if (!S.some(o => o.id === s && !o.engel)) s = (S.find(o => !o.engel) || S[0]).id;
      oyunKomut(x => ajandaIsiYap(x, kr.id, s)); continue; }
    const kd = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.karar);
    if (kd) { const S = ajandaOnizle(k, kd.id).secenekler; oyunKomut(x => ajandaIsiYap(x, kd.id, (S.find(s => s.id === 'reddet') || S[0]).id)); continue; }
    const j = Object.values(k.isler).find(x => x.tur === 'ajanda' && x.veri.eylem === 'macGunu');
    if (j && j.tarih === k.tarih && j.dakika === k.gunIciDakika) { const id = j.veri.macId;
      oyunKomut(x => ajandaIsiYap(x, j.id));
      oyunKomut(x => haftaSonuclariUygula(x, id, Z, macTohumu(7, id), {}, haftaninDigerMaclari(x, id).map(g => ({macId: g.id, sonuc: Z, tohum: macTohumu(7, g.id)}))));
      continue; }
    oyunKomut(x => duragaIlerle(x));
  }
  return null; }"""
ZINCIR_POL = {"ihtiyac": "onayla", "aday": "adayA", "gorus": "gorus", "yurutme": "kendim", "kulupPazarlik": "guclu"}


async def sahneler_transfer(pg, olc):
    """R4: Transfer masası (yeni kariyer) ve zincirin aday ve pazarlık kartı (kart kendi yerinde, Sonra yığınından)."""
    await pg.keyboard.press("Digit6")
    await pg.wait_for_selector(".tm-masa", timeout=10000)
    await olc("transfer-pano")
    await tikla(pg, '.tm-sekmeler [data-bolum="piyasa"]')
    await olc("transfer-piyasa")
    await tikla(pg, ".tm-oyuncu")
    await olc("transfer-oyuncu")
    await akis.masaya_don(pg)
    if not (set(TRANSFER_SAHNELER) & {"transfer-aday-karti", "transfer-pazarlik-karti"}):
        return
    for sahne, hedef in (("transfer-aday-karti", "aday"), ("transfer-pazarlik-karti", "kulupPazarlik")):
        await pg.evaluate(akis.SUR_JS, "2027-01-05")
        kid = await pg.evaluate(ZINCIR_JS, [hedef, ZINCIR_POL])
        if not kid:
            continue
        await akis.oda_yenile(pg)
        await akis.masaya_don(pg)
        await tikla(pg, f'.od-sonraKagit[data-is="{kid}"]')
        await pg.wait_for_selector(f'.kk-kart[data-is="{kid}"]', timeout=10000)
        await olc(sahne)
        await akis.masaya_don(pg)


BALKON_SAHNELER = {"balkon", "balkon-sahada", "balkon-dosya"}


async def sahneler_balkon(pg, olc):
    """R5: Salı 15:00 yoğun gün, iki yorgun oyuncu, gözlem bir saat sürmüş (akış §23 kalıbı); sinyalin adından oyuncu dosyası (sağ yarı)."""
    await pg.evaluate("""() => oyunKomut(k => { const D = k.kulupler.demirkapi.kadro, x = Object.assign({}, k.oyuncular);
      for (const id of D.ilk11.slice(1, 3)) x[id] = Object.assign({}, x[id], { hal: { kon: 58, gun: '2026-11-23', form: 0, gel: 0, tav: 60 } });
      k.oyuncular = x; zamanIlerlet(k, anDakika('2026-11-24', 900) - simdikiAn(k)); gozlemAc(k, 120); gozlemAdim(k, 60); })""")
    await akis.oda_yenile(pg)
    await akis.yokla(pg, "() => ODA.yer === 'balkon'", 60)
    await olc("balkon")
    # RB: “Sahada” — pas çemberine bakış, ilk oyuncunun takibi (liste açık, ad etiketi sahada); geniş pencerede kâğıt bantta
    await tikla(pg, '#oda [data-eylem="bakGrup"][data-grup="rondo"]')
    await tikla(pg, '#oda [data-eylem="bakOyuncu"]')
    await pg.wait_for_timeout(1200)
    await olc("balkon-sahada")
    await tikla(pg, '#oda .od-gorduklerin [data-eylem="gozlemOyuncu"]')
    await pg.wait_for_selector("#oda .dsy-baslik", timeout=10000)
    await olc("balkon-dosya")


SPONSOR_SAHNELER = {"sponsor-pazarlik-karti"}


async def sahneler_sponsor(pg, olc):
    """R6: 1 Şubat 12:00'ye ilerlenir, teklif kartı Görüşelim ile cevaplanır; pazarlık kartı kendi yerinde (Sonra yığınından)."""
    kid = await pg.evaluate("""() => { oyunKomut(k => zamanIlerlet(k, anDakika('2027-02-01', 720) - simdikiAn(k)));
      const B = () => Object.values(OYUN.kariyer.isler).find(i => i.veri && i.veri.karar === 'sablonKarti' && OYUN.kariyer.meseleler[i.veri.meseleId].sablon.ad === 'sponsor');
      const a = B(); oyunKomut(k => ajandaIsiYap(k, a.id, 'gorus')); const b = B(); return b ? b.id : null; }""")
    await akis.oda_yenile(pg)
    await akis.masaya_don(pg)
    await tikla(pg, f'.od-sonraKagit[data-is="{kid}"]')
    await pg.wait_for_selector(f'.kk-kart[data-is="{kid}"]', timeout=10000)
    await olc("sponsor-pazarlik-karti")


async def sahneler_mac(pg, olc):
    """Boş kariyer: İlerle maç gününe; Stada git → bülten. Ayrı sayfada TEST 'Maçı izleme' → maç sonu kartı."""
    await akis.oda_ilerle(pg)
    await tikla(pg, '.od-alt .od-ana[data-eylem="yap"]')
    await akis.yokla(pg, "() => typeof MAC_GUNU !== 'undefined' && !!document.querySelector('#onEkran:not([hidden])')", 60)
    await pg.wait_for_timeout(800)
    await olc("bulten")


async def sahne_mac_sonu(pg, olc):
    await akis.oda_ilerle(pg)
    await tikla(pg, '.od-alt [data-eylem="yapIzlemesiz"]')
    await akis.yokla(pg, "() => typeof MAC_SONU !== 'undefined' && MAC_SONU.acik", 120)
    await pg.wait_for_timeout(600)
    await olc("mac-sonu")


async def ana():
    arg = sys.argv[1:]

    def secenek(ad):
        if ad in arg:
            i = arg.index(ad)
            return arg[i + 1]
        return None
    genislikler = [int(x) for x in secenek("--genislik").split(",")] if secenek("--genislik") else list(GENISLIKLER)
    secili = set(secenek("--sahne").split(",")) if secenek("--sahne") else None
    json_yol = secenek("--json")
    from playwright.async_api import async_playwright
    site = kontrol.kopya_hazirla(kontrol.yerel_three())
    idx = (site / "index.html").read_text(encoding="utf-8")
    ek = '<script src="js/baslangic.js"></script>\n<script src="araclar/test-icerik.js"></script>\n<script>BASLANGIC_EKLERI.push(k => testIcerikKur(k));</script>'
    (site / "index-test.html").write_text(idx.replace('<script src="js/baslangic.js"></script>', ek), encoding="utf-8")
    sonuc, hatalar = {}, []
    ornek = (ARAC / "ornekler" / "kayit-s11-hafta14.json").read_text(encoding="utf-8")
    async with async_playwright() as p:
        t = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for g in genislikler:
            pencere = GENISLIKLER[g]

            async def ac(ad, sorgu, kayit=None):
                b = await t.new_context(viewport={"width": pencere[0], "height": pencere[1]})
                if kayit:   # R3: örnek kayıt ilk açılışta depoya yazılır (akış §31 kalıbı)
                    await b.add_init_script("""(m => { if (!sessionStorage.getItem('__ok')) { sessionStorage.setItem('__ok', '1'); localStorage.setItem('chairman:oyun-1', m); } })(""" + json.dumps(kayit) + ")")
                pg = await b.new_page()
                pg.on("pageerror", lambda e: hatalar.append(f"{g}: {e}"))
                await pg.goto((site / ad).as_uri() + sorgu)
                await akis.yokla(pg, akis.ODA_HAZIR_JS, 60)
                return pg

            async def olc_kur(pg):
                async def olc(sahne):
                    if secili and sahne not in secili:
                        return
                    await pg.wait_for_timeout(350)   # açılış geçişleri (≤ 300 ms) bitsin
                    o = await pg.evaluate(OLC_JS)
                    await pg.screenshot(path=str(ARAC / f"son-okunurluk-{g}-{sahne}.png"))
                    sonuc[f"{g}/{sahne}"] = o
                return olc
            pg = await ac("index-test.html", "?dunya=7&pul=0")
            await sahneler_oda(pg, await olc_kur(pg))
            await pg.context.close()
            if not secili or secili & CANLI_SAHNELER:
                pg = await ac("index.html", "?pul=0", ornek)
                await sahneler_canli(pg, await olc_kur(pg))
                await pg.context.close()
            if not secili or secili & TRANSFER_SAHNELER:
                pg = await ac("index.html", "?dunya=7&pul=0")
                await sahneler_transfer(pg, await olc_kur(pg))
                await pg.context.close()
            if not secili or secili & BALKON_SAHNELER:
                pg = await ac("index.html", "?dunya=7&pul=0")
                await sahneler_balkon(pg, await olc_kur(pg))
                await pg.context.close()
            if not secili or secili & SPONSOR_SAHNELER:
                pg = await ac("index.html", "?dunya=7&pul=0")
                await sahneler_sponsor(pg, await olc_kur(pg))
                await pg.context.close()
            if not secili or "bulten" in secili:
                pg = await ac("index.html", "?dunya=7&pul=0")
                await sahneler_mac(pg, await olc_kur(pg))
                await pg.context.close()
            if not secili or "mac-sonu" in secili:
                pg = await ac("index.html", "?dunya=7&pul=0")
                await sahne_mac_sonu(pg, await olc_kur(pg))
                await pg.context.close()
        await t.close()
    bulgu = 0
    print(f"Okunurluk ölçüsü · eşik: gövde ≥ {GOVDE_EN_AZ:g} px, metin ≥ {METIN_EN_AZ:g} px, kırpılan yok")
    print(f"{'kare/sahne':28} {'gövde':>6} {'en küçük':>9} {'<12 px':>7} {'kırpılan':>9}")
    for ad, o in sonuc.items():
        px = [m["px"] for m in o["metin"]]
        kucuk = sorted((m for m in o["metin"] if m["px"] < METIN_EN_AZ), key=lambda m: m["px"])
        kotu = o["govde"] < GOVDE_EN_AZ or kucuk or o["kirp"]
        bulgu += bool(kotu)
        print(f"{'!' if kotu else ' '} {ad:26} {o['govde']:6.1f} {min(px) if px else 0:9.1f} {len(kucuk):7d} {len(o['kirp']):9d}   (kare {o['kare']} px, {len(px)} metin)")
        ornek = {}
        for m in kucuk:
            ornek.setdefault((m["ad"], m["px"]), m["t"])
        for (a, p_), t_ in list(ornek.items())[:4]:
            print(f"      {p_:5.1f} px  {a}  “{t_}”")
        for k in o["kirp"][:3]:
            print(f"      kırpılan  {k['ad']} ⊂ {k['kap']}  “{k['t']}”")
    if hatalar:
        bulgu += 1
        print("! Sayfa hataları: " + "; ".join(hatalar[:3]))
    if json_yol:
        pathlib.Path(json_yol).write_text(json.dumps(sonuc, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{'Eşik dışı ' + str(bulgu) + ' ekran' if bulgu else 'Bütün ekranlar eşikte'} · görüntüler araclar/son-okunurluk-*.png")
    sys.exit(1 if bulgu else 0)


if __name__ == "__main__":
    asyncio.run(ana())
