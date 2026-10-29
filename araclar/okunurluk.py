#!/usr/bin/env python3
"""Chairman — okunurluk ölçüsü (R1-f, 2026-10-29).

Oyun karesi üç genişlikte (640, 800, 1186 px) açılır; her ekranda görünen her metnin hesaplanan yazı boyu ve kırpılıp kırpılmadığı ölçülür.
Ekranlar: oda (masa), defter, telefonun ana ekranı, konuşma (tek kartla), mesaj listesi, Canlı Skor, dosya (tek kartla), Kadro sekmesi,
oyuncu dosyası, gazete, Ayarlar › Kayıt, maç öncesi bülteni ve maç sonu kartı.

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
# kare genişliği → pencere (index.html: kare = min(pencere − 32, max(640, (yükseklik − 190) · 4/3)))
GENISLIKLER = {640: (800, 620), 800: (832, 800), 1186: (1218, 1080)}

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
    await pg.wait_for_selector(".tel .tel-cevap .kk-kart", timeout=10000)
    await olc("telefon-konusma")
    await tikla(pg, '.tel [data-eylem="telUyg"][data-uyg="mesajlar"]')
    await olc("telefon-mesajlar")
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
    async with async_playwright() as p:
        t = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
        for g in genislikler:
            pencere = GENISLIKLER[g]

            async def ac(ad, sorgu):
                b = await t.new_context(viewport={"width": pencere[0], "height": pencere[1]})
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
