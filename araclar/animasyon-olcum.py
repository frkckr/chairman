#!/usr/bin/env python3
"""Chairman — animasyon ölçümü (A2, 2026-10-08; gerçekçilik planı Ek G9)

Maçı başsız Chromium'da tohumlu ve sanal saatle oynatır; her karede js/animasyon.js'in ürettiği pozu (aktorGuncelle'nin sonucunu)
dışarıdan okur ve ölçer. Animasyon dosyasına ölçüm kodu girmez: araç aktorGuncelle'yi ve macKare'yi sarar. Motor değişmez.

Kullanım:
  python araclar/animasyon-olcum.py                      # şimdiki animasyon, tohum 3, 180 sn oyun
  python araclar/animasyon-olcum.py --once a5            # dondurulmuş "önce" animasyonu (araclar/karsilastir/a5/animasyon.js; dondur.js üretir)
  python araclar/animasyon-olcum.py --json araclar/taban/t7-anm.json        # sonucu kaydet (tur kapanışında turun animasyon tabanı)
  python araclar/animasyon-olcum.py --karsilastir araclar/taban/t7-anm.json # kayıtlı sonuçla yan yana
  Seçenekler: --tohum N · --sure S (oyun saniyesi; varsayılan 180) · --ayar JSON (H1: MOTOR_AYAR'ı kodu değiştirmeden aç/kapat; ör. '{"govdeDinamik":0}')
  · --ek '&model=kutu' (adres ekleri; A5: eski kutu modeli) · --eski-kimlik (A5 öncesi tabanlar: t15-anm, h1-anm ve öncesi). A5'ten (2026-10-15) beri Three.js'in nesne kimlikleri tohumlu Math.random'dan
    değil ayrı bir diziden çekilir (kontrol.kimlik_ayri_three): geometri değişikliği (kurulan nesne sayısı) çizimin adım fazını kaydırmaz;
    yalnız modeli değişen çizimde kemik tabanlı satırlar birebir aynı kalır.

Ölçütler ("A:" satırları; tanım ve hedefler Ek G9). Bantlar oyuncunun çizilen hızından: duran < 0,3 · yürüyüş < 2 · koşu 2–5 ·
hızlı 5–7 · depar ≥ 7 m/sn. "Eylemsiz": oyuncunun eylemi yok (vuruş, kontrol, düşüş, kaleci hareketi … dışında; tavır olabilir).
  ayak kayması   yerdeki ayak (taban 0,05 m altında, bu ve önceki karede) yatayda 0,2 m/sn'den hızlı gidiyorsa kayan karedir
  adım yolu      yerdeki ayağın bir temas boyunca yatay yolu (m)
  kadans         2 sn'lik kararlı hız pencerelerinde basma sayısı / süre (adım/sn)
  uçuş           iki ayak da 0,05 m üstündeyken eylemsiz kare payı
  sıçrama        bir karede bir eklem kanalının > 10° (eylemsiz) ya da > 20° (hepsi) değişmesi; kalça yüksekliğinde > 3 cm
  kırılma        ikinci fark > 0,06 rad (hız süreksizliği; eylemsiz)
  baş            |baş–gövde dönüşü| (P.by); dönüşte başın öncülüğü: 90°+ dönüşte kök ile başın dünyadaki yönü yarı yola ne zaman varıyor
  dönüş          90°+ dönüşlerde basma sayısı; yerinde dönerken (hız < 0,6, dönüş > 3 rad/sn) iki ayağın da yerde olduğu kare payı
  kimlik         koşu bandında oyuncuların adım boyu ve kol genliği ortalamalarının değişim katsayısı
  bekleyiş       2 sn'den uzun duran oyuncularda donuk kare payı (bütün kanalların değişimi toplamı < 0,0003 rad) ve ikiz poz payı
  düzgünlük      SPARC (başın hızı, 3 sn'lik eylemsiz pencereler); daha az eksi = daha düzgün
  süre           bütün aktörlerin aktorGuncelle süresi (ms/kare; gerçek saat)
  kurtarış       (T9b-e) elle temasın motor adımında çizilen eldivenin topa açıklığı; dalış evresi; yana adım; kapanma türleri
  vuruş stili    (T9b-e) temasta çizimin pozu motorun stiline uyuyor mu; kötü vuruşta vuran ayağın topa göre yeri türle uyumlu mu
  Kipler: --kaleci N  kaleye N yapay şut (d-sut kalıbı; maç oynanmaz, yalnız kurtarış satırı anlamlıdır)
          --koru N    A6-0: N yapay top saklama sahnesi (c-koru kalıbı; yalnız kaymanın "top saklama" bandı ve kaynağı anlamlıdır)
          --duran N   T8e: N yapay duran top (korner, barajlı ve kenar serbest vuruş, penaltı, taç, kale vuruşu sırayla; maç oynanmaz, yalnız duran top satırı anlamlıdır)
          --kotu      kötü vuruş olasılığı tavana (MOTOR_AYAR.kotuVurus 0,5; yalnız vuruş stili satırı anlamlıdır)
Çıktı: ekrana "A:" satırları; tam rapor araclar/son-animasyon.txt (Git dışında).
"""
import argparse
import asyncio
import json
import pathlib
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from kontrol import KOK, yerel_three, kopya_hazirla, kimlik_ayri_three  # noqa: E402

RAPOR = KOK / "araclar" / "son-animasyon.txt"
KARSILASTIR = KOK / "araclar" / "karsilastir"
YUKLE = KOK / "araclar" / "karsilastir" / "once-yukle.js"

BASLANGIC_JS = """
(() => {
  let s = %d >>> 0;
  Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  /* A5: Three.js nesne kimlikleri ayrı diziden (kontrol.kimlik_ayri_three; --eski-kimlik ile kullanılmaz) */
  let k = 0x2545F491;
  window.__kimlikRastgele = () => { k = (k + 0x6D2B79F5) >>> 0; let t = k; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  window.__gercekZaman = performance.now.bind(performance);
  let kuyruk = [], an = 1000;
  window.requestAnimationFrame = f => { kuyruk.push(f); return kuyruk.length; };
  window.cancelAnimationFrame = () => {};
  performance.now = () => an;
  window.__kare = n => { for (let i = 0; i < n; i++) { an += 1000 / 60; const q = kuyruk; kuyruk = []; for (const f of q) f(an); } };
})();
"""

OLCUM_KUR_JS = r"""() => {
  const R = window.__gercekZaman;
  const KANAL = ['lean','dy','hx','lL','kL','lR','kR','aL','aR','aLz','aRz','eL','eR','hy','hz','gx','gy','gz','by','bz','lLy','lRy','lLz','lRz','aLy','aRy'];
  const NK = KANAL.length, BACAK = new Set(['lL','kL','lR','kR','lLy','lRy','lLz','lRz']);
  const BANT = v => v < 0.3 ? 0 : v < 2 ? 1 : v < 5 ? 2 : v < 7 ? 3 : 4;
  const S = window.__ANM_OLCUM = { kare: 0, sureler: [], temas: [0,0,0,0,0], kayma: [0,0,0,0,0], adimYol: [[],[],[],[],[]], kadans: [[],[],[],[],[]],
    ucus: [0,0,0,0,0], ucusN: [0,0,0,0,0], sicramaUst: 0, sicramaBacak: 0, sicramaEylem: 0, sicramaDy: 0, kirilmaUst: 0, kirilmaBacak: 0, eylemsizKare: 0, eylemliKare: 0, kareN: 0, kanalSicrama: {},
    adimNet: [[],[],[],[],[]], basHiz: [], basHiz600: 0, basGovdeHiz: [], kokHiz: [], kanalKirilma: {}, dyEylemsiz: 0, kirilmaBacakGecis: 0,
    basMax: 0, bas70: 0, basKare: 0, basPitchMax: 0, donus: [], donusKare: 0, donusAdimsiz: 0, kimlik: [], bekle: 0, bekleDonuk: 0, ikiz: 0, cift: 0,
    sparc: [], kokSicrama: 0, kanalSicramaEylem: {},
    /* A3 (2026-10-13): fren ↔ sabit koşu (eylemsiz, çizilen hız > 2 m/sn; fren: hız 2,5 m/sn²'den hızlı düşüyor, sabit: |ivme| < 0,5) — kalça (P.dy),
       kolun yana açıklığı (|aLz|), gövde eğimi (lean), yerdeki ayağın kökün önündeki uzaklığı (m) */
    fren: { n: 0, dy: 0, kol: 0, egim: 0, ayak: 0, ayakN: 0, fr: 0 }, sabit: { n: 0, dy: 0, kol: 0, egim: 0, ayak: 0, ayakN: 0, fr: 0 }, basUc: [],
    /* A3: adım boyu (ardışık iki basış arası, m) ve motorun hızı — frende ve sabit koşuda; sabit koşuda temas süresi (sn, banda göre) */
    frenAdim: [], sabitAdim: [], sabitTemas: [[], [], [], [], []], frenDy: [], sabitDy: [],
    /* A2b zamanlama: hakem işareti olayla aynı karede mi (motor adımı farkı), vuruşta çizimin temas evresi motorun temas karesinde mi */
    zOlay: [], zIsaret: {}, zVurus: 0, zVurusAyni: 0, zVurusFark: [],
    /* T4-V vuruş hazırlığı: temas karesinde son adımın süresi / planı (tB), geri salınımın tepesi / planı, ilk görülme evresi, motorun karar→temas
       süresi (e.t, türe göre); vuruş sırasında evre sınırları (son adım başı, temas, çıkış) dışındaki > 20° sıçramalar; hız katlarında kararsız kare */
    vkN: 0, vkHazirliksiz: 0, vkSonAdim: [], vkTepe: [], vkIlkTakip: 0, vkKT: { pas: [], sut: [], uzun: [], ilk: [] }, vkKare: 0, vkDisi: 0, vkDisiEvre: {}, vkEvreKare: {}, kararsiz: 0, kararsizKanal: {},
    /* T4g çalım: hareket başına hazırlık sayısı; hazırlık çiziminin başladığı motor adımı ile motorun faz 1'e geçtiği adımın farkı; itiş pozunun adımı
       (sonDokunus.calim ile); makasta süpüren ayağın topa yanal uzaklığı (gövde çerçevesinde, en çok); aldatılan savunmacıda (aldatma) gövde yatışının
       (gz + hz) yanılgı yanında olduğu kare payı; top saklamada çizimin seçtiği yanın en yakın rakibin yanıyla aynılığı ve yan değişimi */
    ck: { N: {}, bas: 0, basAyni: 0, basFark: [], it: 0, itAyni: 0, makas: [], yutKayit: [], korKare: 0, korN: 0, korDogru: 0, korDegis: 0 },
    /* T4h (Ek H madde 5, bilgi): durum bantlarında ayak kayması — dar dönüş (kök > 2 rad/sn, hız > 0,6 m/sn), ani duruş (yumuşatılmış hız
       3 m/sn²'den hızlı düşüyor), top saklama (tavır 'koru'); T6f: sıçrama yakını (sıçramanın hazırlığı ve uçuşu ya da inişin 0,22 sn'si;
       önceliklidir); aynı tanımla (eylemsiz temas karesi, 0,2 m/sn) */
    dTemas: [0, 0, 0, 0], dKayma: [0, 0, 0, 0],
    /* T5f temas (Ek G9 "Temas"): müdahalenin temas karesinde (mudahaleSonuc, topa değdi) çizilen uzanan ayağın (taban ortası) topa açıklığı (merkeze
       uzaklık − yarıçap); ayakta iki oyuncunun çizilen gövdeleri 0,3 m'den yakın (iç içe) kare sayısı / 1 m içindeki çift-kare; kalkışın son karesinde
       kök yatış açısı ≤ 0,05 rad; tökezleme (sendelerken adım boyu çarpanı < 0,7); düşüş sayısı */
    tm: { n: 0, acik: [], icIce: 0, cift: 0, kalkN: 0, kalkDik: 0, sendKare: 0, sendKisa: 0, dususN: 0, liste: [] },
    /* T6f hava (Ek G4 ölçütü): kafa eyleminin ilk karesinde (motorun temas adımı; düellonun kaybedeni hariç) çizilen baş merkezinin topa açıklığı
       (merkezler arası − top yarıçapı 0,11 − baş 0,12); sıçrayarak vurulan pay; yüzey (kafa.yuzey); havadaki iki rakibin çizilen gövde merkezleri
       0,5 m'den yakın kare / 1,2 m içindeki havadaki çift-kare */
    hv: { n: 0, acik: [], sic: 0, yz: {}, icIce: 0, cift: 0, pl: 0, plAcik: [], plInis: [] },   /* T14e: tam plonjon — temas karesinde başın topa açıklığı, yere inişin ilk karesinde gövdenin yatışı (rad) */
    /* T9b-e kurtarış (Ek G6 ölçütü): elle temasın motor adımında (save parca 'el', yumruk, parmak) çizilen eldiven merkezlerinden topa en yakının
       açıklığı (merkezler arası − top yarıçapı 0,11); biçim, el (iki/tek), eylem (dalış/çökme, tutuş, kapanma …); dalışın evresi çizimde motorla aynı
       mı (kare payı); yana adım kare sayısı; kapanma türleri; kurtarışlarda temas parçası */
    kr: { n: 0, acik: [], bicim: {}, el: {}, tur: {}, fazN: 0, fazAyni: 0, yanAdim: 0, kapan: {}, parca: {}, liste: [],
      /* T15d: tutuşun türü (poz anahtarı ve geometri) ve planlı çelmede kolun takibi */
      tutN: 0, tutAyni: 0, tutGeo: 0, tutTur: {}, tutKotu: [], celN: 0, celIyi: 0, celAci: [] },
    /* T9b-e vuruş stili: temas karesinde çizimin poz anahtarı (vk.pk) motorun stiline uyuyor mu (stil başına); vuran ayağın taban ortasının topun çizilen
       yerine (temas karesinde temas yerinde tutulur: anmTopTut) göre
       yeri — açıklık (merkeze uzaklık − 0,11), yükseklik (taban − top merkezi), vuran ayak yanına yanal fark — kötü ve normal vuruşlar ayrı */
    vs: { n: 0, ayni: 0, stil: {}, kotu: {}, normal: [] },
    /* T8e duran top (Ek G5 ölçütü): barajın motor sıçramasında (p.zipla uçuşta) çizimin fazladan yükseltmesi (a.yEk > 0,05) ve baraj pozunun ağırlığı;
       duruşta (sıçrama yokken) çizim sıçraması (sahte hop; 0 olmalı); yerleştirme eyleminde yuva ağırlığı > 0,5 görüldü; korner kullananın kol jesti
       ≥ 0,5 sn; taç bırakışında (kullanim) kolların öne gidişi (tacAt ≥ 0,5); penaltıda kalecinin uçuşunun başlangıcı temasa göre (sn; [−0,15, +0,02]);
       duruşta kutudaki görevlilerin çizilen gövdeleri 0,3 m'den yakın kare */
    dr: { bjKare: 0, bjFazla: 0, bjPoz: 0, bjOnce: 0, yerN: 0, yerIyi: 0, kolN: 0, kolIyi: 0, tacN: 0, tacTepe: 0, tacUzun: 0, penN: 0, penDt: [], penOrta: 0, icIce: 0,
      /* T15d: duraklı penaltı koşusunda kanıp erken kalkan kaleci (kalkış penceresinden ayrı), duraklamada tereddüt pozu */
      penKan: 0, dkN: 0, dkIyi: 0 } };
  const HK_OLAY = { faul: 'ref', avantaj: 'ref', ofsayt: 'ikisi', korner: 'ikisi', kaleVurusu: 'ikisi', tac: 'biri', kickoff: 'ref', duduk: 'ref', degisiklik: 'lin', barajYeri: 'ref', uyari: 'ref', tedaviBasladi: 'ref' };
  /* T10f olay (Ek G4, G7, G8): yerdeki sakatın tutma pozu (sakat yuvası > 0,8), sedyede kökün yüksekliği (0,55–0,9 m) ve sedyeyi tutan sağlıkçı,
     tedavide sağlıkçının çömelmesi ya da gerdirmesi, topallamada iki ayağın yerde kalma karesi (sakat / sağlam), endirekt işaretin tutulduğu kare
     payı (duruşun 2. saniyesinden — önce düdük ve yön —; hakem topu hariç), hakem topunu bırakma işaretinin motorun eylemiyle aynı karede başlaması, golcünün sevinç çeşidi */
  /* A6-0 (2026-10-17): kaymanın kaynağı — kayan karede çizimin adım döngüsü o ayağı salınımda sayıyor (salinim: iniş ya da kalkış karesi yere değiyor),
     ayağın dünyadaki çapası (a.W) bu karede kaydı (surukle: 0,6 m sapma sınırında sürüklenme ya da yeniden çapa) ya da çapa yerinde duruyor ama çizilen
     ayak ondan kayıyor (sabit: bacak IK'sı erişemiyor ya da poz kanalı IK'yı eziyor); genel ve durum bandına göre. Blok teması (T19'un hamlesi): blok
     olayının karesinde çizilen ayağın topa açıklığı (top beden yüksekliğinin altında, < 0,8 m), motorun temas uzaklığına göre (≤ 0,6 / > 0,6 m) */
  S.kKaynak = { genel: { salinim: 0, surukle: 0, sabit: 0, erisim: 0 }, durum: [0, 1, 2, 3].map(() => ({ salinim: 0, surukle: 0, sabit: 0, erisim: 0 })), hiz: [] };
  S.bl = { n: 0, ust: 0, yakin: [], uzak: [], liste: [] };
  /* A6a: sıçrama yakınının evresi — [temas, kayma]: hazırlık (baraj / açık oyun) ve iniş */
  S.zEvre = { hazB: [0, 0], haz: [0, 0], inis: [0, 0] };
  S.ol = { sakKare: 0, sakPoz: 0, sedKare: 0, sedYuk: 0, sedTutN: 0, sedTut: 0, tedKare: 0, tedPoz: 0, gerdir: 0, topalN: 0, topalKotu: 0, topalIyi: 0, endKare: 0, endTut: 0, birakN: 0, birakAyni: 0, sev: {} };
  function olayOlc(a, dt) {
    const p = a.kaynak; if (!p || !(dt > 0) || typeof ANM_S === 'undefined') return; const O = S.ol, sw = a.sw, SL = ANM_S, e = p.eylem, A = mac.sakatlikAkis;
    if (p.tur === 'oyuncu') {
      if (p.sakat && e && e.ad === 'yerde') { O.sakKare++; if (sw[SL.sakat] > 0.8) O.sakPoz++; }
      if (mac.sedye && mac.sedye.p === p) { O.sedKare++; const y = a.m.root.position.y; if (y >= 0.55 && y <= 0.9) O.sedYuk++; }
      const k = K.get(a); if (p.topal && p.oyunda && a.topBacak != null && k && k.vs > 1 && !e) { O.topalN++; if (k.temas[a.topBacak]) O.topalKotu++; if (k.temas[1 - a.topBacak]) O.topalIyi++; }
      if (p.sevinc && a.sevSon && mac.celeb && mac.celeb.scorer === p) { const g = mac.score[0] + mac.score[1]; if (a._olSevG !== g) { a._olSevG = g; O.sev[a.sevC] = (O.sev[a.sevC] || 0) + 1; } } }
    if (p.kind === 'saglikci' && p.gorev && A && A === p.gorev) { if (A.evre === 'tedavi') { O.tedKare++; if (sw[SL.p0 + 2] + sw[SL.gerdir] > 0.8) O.tedPoz++; if (sw[SL.gerdir] > 0.5) O.gerdir++; }
      if (mac.sedye && A.evre === 'sedye') { O.sedTutN++; if (sw[SL.sedyeTut] > 0.8) O.sedTut++; } }
    /* gerdirme görünür mü: gerdir yuvası ağır, çömelme yuvası (p2, karışımda sonra) hafif */
    if (p.kind === 'saglikci' && sw[SL.gerdir] > 0.5 && sw[SL.p0 + 2] > 0.3) O.gerdirOrtulu = (O.gerdirOrtulu || 0) + 1;
    if (p.kind === 'ref') { const du = mac.durus, b = mac.ball, h = typeof ANM_HK !== 'undefined' ? ANM_HK.get(p) : null;
      const end = (mac.phase === 'durus' && du && du.endirekt && !du.hakemTopu && du.t > 2.0) || (mac.phase === 'play' && b && b.endirekt && !b.endirekt.hakemTopu);
      if (end) { O.endKare++; if (h && h.cur && h.cur.tur === 'endirekt') O.endTut++; }
      if (e && e.ad === 'birak' && e.t <= dt * 1.01) { O.birakN++; if (h && h.cur && h.cur.tur === 'birak') O.birakAyni++; } }
  }
  const K = new Map(), V = new THREE.Vector3(), H = new THREE.Vector3();
  let t = 0, kareSure = 0, bekleyenler = [];
  const fft = (re, im) => { const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { let x = re[i]; re[i] = re[j]; re[j] = x; x = im[i]; im[i] = im[j]; im[j] = x; } }
    for (let L = 2; L <= n; L <<= 1) { const a = -2 * Math.PI / L, wr = Math.cos(a), wi = Math.sin(a);
      for (let i = 0; i < n; i += L) { let cr = 1, ci = 0; for (let k = 0; k < L / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + L / 2] * cr - im[i + k + L / 2] * ci, vi = re[i + k + L / 2] * ci + im[i + k + L / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + L / 2] = ur - vr; im[i + k + L / 2] = ui - vi; const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr; } } } };
  /* SPARC (Balasubramanian 2015): hız profilinin normalize genlik spektrumunun yay uzunluğu; kesim ≤ 10 Hz, eşik 0,05, 4 kat dolgu */
  const sparc = (v, fs) => { let n = 1; while (n < v.length * 4) n <<= 1; const re = new Float64Array(n), im = new Float64Array(n); for (let i = 0; i < v.length; i++) re[i] = v[i];
    fft(re, im); const yari = n >> 1, M = new Float64Array(yari + 1); let mx = 0; for (let i = 0; i <= yari; i++) { M[i] = Math.hypot(re[i], im[i]); if (M[i] > mx) mx = M[i]; }
    if (!(mx > 0)) return 0; for (let i = 0; i <= yari; i++) M[i] /= mx;
    const iMax = Math.min(yari, Math.floor(10 * n / fs)); let ic = 1; for (let i = 0; i <= iMax; i++) if (M[i] >= 0.05) ic = Math.max(ic, i);
    let L = 0; for (let i = 1; i <= ic; i++) { const df = 1 / ic, dm = M[i] - M[i - 1]; L += Math.sqrt(df * df + dm * dm); } return -L; };
  const aciF = (x, y) => { let d = x - y; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const yeni = a => ({ x: a.x, z: a.z, vs: 0, ayak: [[0, 0], [0, 0]], temas: [false, false], tn: [0, 0], gecis: [-9, -9], bas0: [[0, 0], [0, 0]], basVar: [false, false], epEylem: [false, false], yol: [0, 0], ilk: true, P1: new Float64Array(NK), P2: new Float64Array(NK), pn: 0,
    gecmis: [], sonDonus: -9, pen: { t0: t, bas: [], vmin: 1e9, vmax: -1e9, eylem: false, kolMin: 1e9, kolMax: -1e9 }, bekleT: 0, sp: [], spEylem: false, yawU: a.yaw, basU: null, basHam: null,
    kimlik: { boy: [], kol: [] }, basT: [0, 0], temasG: [] });
  function kaydet(a, dt) {
    const p = a.kaynak; if (!p || !(dt > 0) || p.tur !== 'oyuncu' || !p.oyunda || !a.m.root.visible) return;
    let k = K.get(a); if (!k) K.set(a, k = yeni(a));
    /* T6f: sıçramanın uçuşu ve inişin ilk 0,12 sn'si eylem sayılır (havadaki ayak yürüyüşün ayak kilidi ölçüsüne girmez; hazırlıkta ayak yerde, sayılır) */
    const zp = p.zipla, havada = !!(zp && zp.t >= 0) || (a.inisT >= 0 && a.inisT < 0.12);
    const P = a.P, e = p.eylem ? p.eylem.ad : (havada ? 'sicrama' : ''), eylemsiz = !e;
    const v = Math.hypot(a.x - k.x, a.z - k.z) / dt, vsOnce = k.vs; if (v > 1) k.vAci = Math.atan2(a.z - k.z, a.x - k.x);   /* A3: gidiş yönü (kesme dönüşü için) */ k.x = a.x; k.z = a.z; k.vs += (Math.min(v, 12) - k.vs) * Math.min(1, dt * 8);
    const durum = p.zipla || a.inisT >= 0 ? 3 : !k.ilk && p.tavir === 'koru' ? 2 : !k.ilk && Math.abs(aciF(a.yaw, k.yawU)) / dt > 2 && k.vs > 0.6 ? 0 : !k.ilk && (vsOnce - k.vs) / dt > 3 ? 1 : -1;
    const b = BANT(k.vs);
    a.m.root.updateMatrixWorld(true);
    /* A3: fren ↔ sabit koşu (motorun hızı p.spd, 0,2 sn'lik pencere: fren < −2,5 m/sn², sabit |ivme| < 0,5; çizilen yerin türevi kare hızına duyarlıydı) */
    if (!k.spH) { k.spH = new Float64Array(12); k.spI = 0; k.spN = 0; } const spM = p.spd || 0, sp0 = k.spH[k.spI]; k.spH[k.spI] = spM; k.spI = (k.spI + 1) % 12; k.spN++;
    const ivM = (spM - sp0) / 0.2, a3 = eylemsiz && !k.ilk && k.spN > 12 && spM > 2 ? (ivM < -2.5 ? 'fren' : Math.abs(ivM) < 0.5 ? 'sabit' : null) : null;
    const yer = [false, false];
    /* temas histerezisli: taban 0,02 m altına inince basar, 0,025 m üstüne çıkınca kalkar; ilk iki temas karesi (iniş) kaymaya sayılmaz */
    for (let i = 0; i < 2; i++) {
      V.set(0, -0.5, 0.05).applyMatrix4((i ? a.m.kR : a.m.kL).matrixWorld); const c = k.temas[i] ? V.y < 0.025 : V.y < 0.02; yer[i] = c; (k.vy || (k.vy = [0, 0]))[i] = V.y;
      if (!k.ilk) {
        if (c && k.temas[i]) { k.tn[i]++; const d = Math.hypot(V.x - k.ayak[i][0], V.z - k.ayak[i][1]); k.yol[i] += d; if (!eylemsiz) k.epEylem[i] = true;
          if (eylemsiz && k.tn[i] > 2) { S.temas[b]++; const kay = d / dt > 0.2; if (kay) S.kayma[b]++; if (durum >= 0) { S.dTemas[durum]++; if (kay) S.dKayma[durum]++; }
            if (durum === 3) { const ze = S.zEvre[p.zipla && p.zipla.t < 0 ? (p.duranRol && p.duranRol.rol === 'baraj' ? 'hazB' : 'haz') : 'inis']; ze[0]++; if (kay) ze[1]++; }
            /* A6-0: kaymanın kaynağı (çizimin çapası a.W ve adım döngüsünün durumu a.anc) */
            /* çapa yerindeyse: ayak bileği (diz kemiğinde 0,5 m aşağı) çapadan 0,05 m'den uzak → erisim (bacak IK'sı yetişemiyor ya da poz kanalı ezdi);
               değilse sabit (bilek çapada, taban noktası bileğin çevresinde dönüyor: gövdenin dönüşü ya da bacak eğimi) */
            if (kay && a.anc && a.W) { const W = a.W, Wp = k.Wp; let ks = !a.anc[i] ? 'salinim' : Wp && Math.hypot(W[2 * i] - Wp[2 * i], W[2 * i + 1] - Wp[2 * i + 1]) / dt > 0.2 ? 'surukle' : 'sabit';
              if (ks === 'sabit') { H.set(0, -0.5, 0).applyMatrix4((i ? a.m.kR : a.m.kL).matrixWorld); if (Math.hypot(H.x - W[2 * i], H.z - W[2 * i + 1]) > 0.05) ks = 'erisim'; }
              S.kKaynak.genel[ks]++; if (durum >= 0) { S.kKaynak.durum[durum][ks]++; if (durum === 2 && S.kKaynak.hiz.length < 4000) S.kKaynak.hiz.push(+(d / dt).toFixed(2)); } } } }
        if (c !== k.temas[i]) k.gecis[i] = S.kare;
        if (c && !k.temas[i]) { if (a3 && k.basVar[1 - i]) (a3 === 'fren' ? S.frenAdim : S.sabitAdim).push([Math.hypot(V.x - k.bas0[1 - i][0], V.z - k.bas0[1 - i][1]), spM]);
          k.yol[i] = 0; k.tn[i] = 0; k.bas0[i][0] = V.x; k.bas0[i][1] = V.z; k.basVar[i] = true; k.epEylem[i] = !eylemsiz; k.pen.bas.push(t); k.basT[i] = t; }
        if (!c && k.temas[i] && k.basVar[i] && !k.epEylem[i] && k.tn[i] > 2) { S.adimYol[b].push(k.yol[i]); S.adimNet[b].push(Math.hypot(k.ayak[i][0] - k.bas0[i][0], k.ayak[i][1] - k.bas0[i][1]));
          const du = t - k.basT[i]; k.temasG.push([k.basT[i], du]); if (k.temasG.length > 12) k.temasG.shift(); if (a3 === 'sabit' && b >= 2) S.sabitTemas[b].push(du); }
      }
      k.ayak[i][0] = V.x; k.ayak[i][1] = V.z; k.temas[i] = c;
    }
    if (a.W) { const Wp = k.Wp || (k.Wp = [0, 0, 0, 0]); for (let j = 0; j < 4; j++) Wp[j] = a.W[j]; }   /* A6-0: çapanın önceki karesi */
    if (eylemsiz && b >= 1) { S.ucusN[b]++; if (!yer[0] && !yer[1]) S.ucus[b]++; }
    /* A3: fren ↔ sabit koşu karelerinin duruşu (durum yukarıda, a3) */
    { const F = a3 === 'fren' ? S.fren : a3 === 'sabit' ? S.sabit : null;
      if (F) { F.n++; F.fr += a.fr || 0; F.dy += P.dy || 0; if (S.kareN % 3 === 0) (a3 === 'fren' ? S.frenDy : S.sabitDy).push([P.dy || 0, spM]); F.kol += Math.abs(P.aLz || 0); F.egim += P.lean || 0; const sY = Math.sin(a.yaw), cY = Math.cos(a.yaw);
        for (let i = 0; i < 2; i++) if (yer[i]) { F.ayak += (k.ayak[i][0] - a.x) * sY + (k.ayak[i][1] - a.z) * cY; F.ayakN++; } } }
    /* eklem kanalları: sıçrama ve kırılma */
    /* T4-V: vuruşta aşağı salınım ve takip kareleri (diz hızı doğası gereği karede 25–33°) ile evre sınırı kareleri (son adım başı, temas, çıkışın
       ilk karesi) sıçramaya sayılmaz; sayılan: hazırlık, geri salınım, iniş ve çıkış (robotluğun görüldüğü yerler). Kanal değeri saçma (|x| ≥ 2π
       ya da NaN) ise kararsız kare (hız katlarında eski yayın kararsızlığı) */
    const vk = a.vk, vkSinir = !!(vk && e === 'vurus' && ((vk.evre === 2 && (vk.asagi || vk.t <= dt * 1.01)) || vk.evre === 3 || (vk.evre === 5 && vk.cikT <= dt * 1.01)));
    if (vk && e === 'vurus') { S.vkKare++; const ev = vk.evre === 2 ? (vk.asagi ? '2a' : '2g') : String(vk.evre); S.vkEvreKare[ev] = (S.vkEvreKare[ev] || 0) + 1; }
    let toplamD = 0;
    for (let i = 0; i < NK; i++) { const ham = P[KANAL[i]], x = ham || 0;
      if (ham !== undefined && !(Math.abs(ham) < 6.2832)) { S.kararsiz++; S.kararsizKanal[KANAL[i]] = (S.kararsizKanal[KANAL[i]] || 0) + 1; }
      if (k.pn >= 1) { const d = Math.abs(x - k.P1[i]), dd = k.pn >= 2 ? Math.abs(x - 2 * k.P1[i] + k.P2[i]) : 0; toplamD += d;
        if (i === 1) { if (d > 0.03) { S.sicramaDy++; if (eylemsiz) S.dyEylemsiz++; } }
        else if (!eylemsiz) { if (d > 0.3491) { S.sicramaEylem++; const ad = KANAL[i] + '@' + e; S.kanalSicramaEylem[ad] = (S.kanalSicramaEylem[ad] || 0) + 1;
            if (e === 'vurus' && vk && !vkSinir) S.vkDisi++;
            if (e === 'vurus' && vk) { const ev = (vk.evre === 2 ? (vk.asagi ? '2a' : '2g') : String(vk.evre)) + ':' + KANAL[i]; S.vkDisiEvre[ev] = (S.vkDisiEvre[ev] || 0) + 1; } } }
        else if (BACAK.has(KANAL[i])) { if (d > 0.3491) { S.sicramaBacak++; S.kanalSicrama[KANAL[i]] = (S.kanalSicrama[KANAL[i]] || 0) + 1; } if (dd > 0.2) { S.kirilmaBacak++; if (S.kare - k.gecis[KANAL[i].endsWith('R') || KANAL[i].includes('R') ? 1 : 0] <= 3) S.kirilmaBacakGecis++; S.kanalKirilma[KANAL[i]] = (S.kanalKirilma[KANAL[i]] || 0) + 1; } }
        else { if (d > 0.1745) { S.sicramaUst++; S.kanalSicrama[KANAL[i]] = (S.kanalSicrama[KANAL[i]] || 0) + 1; } if (dd > 0.06) { S.kirilmaUst++; S.kanalKirilma[KANAL[i]] = (S.kanalKirilma[KANAL[i]] || 0) + 1; } } }
      k.P2[i] = k.P1[i]; k.P1[i] = x; }
    k.pn++; S.kareN++; if (eylemsiz) S.eylemsizKare++; else S.eylemliKare++;
    /* kök ve baş yönü (açılmış) */
    const kokOnce = k.yawU; k.yawU = kokOnce + aciF(a.yaw, kokOnce);
    if (Math.abs(k.yawU - kokOnce) > 0.1745) S.kokSicrama++;
    const basHam = a.yaw + (P.hy || 0) + (P.gy || 0) + (P.by || 0), basOnce = k.basU; k.basU = k.basU === null ? basHam : k.basU + aciF(basHam, k.basHam); k.basHam = basHam;
    if (basOnce !== null && eylemsiz) { const w = Math.abs(k.basU - basOnce) / dt * 57.3; S.basHiz.push(w); if (w > 600) S.basHiz600++;
      /* A3: en hızlı baş dönüşlerinin bağlamı (kök dönüşü, gövdeye göre baş, hız, kip) — tek karelik sarmanın kaynağı için */
      if (w > 1500) { S.basUc.push({ w: Math.round(w), kok: Math.round(Math.abs(aciF(a.yaw, kokOnce)) / dt * 57.3), by: +(P.by || 0).toFixed(2), byO: +(k.byOnce || 0).toFixed(2), v: +k.vs.toFixed(1), kip: p.kip || '', hy: +((P.hy || 0) - (k.hyOnce || 0)).toFixed(2), gy: +((P.gy || 0) - (k.gyOnce || 0)).toFixed(2), tv: p.tavir || '', jest: p.jest ? p.jest.tur : '' }); if (S.basUc.length > 40) { S.basUc.sort((x, y) => y.w - x.w); S.basUc.length = 20; } }
      S.kokHiz.push(Math.abs(k.yawU - kokOnce) / dt * 57.3); if (k.byOnce !== undefined) S.basGovdeHiz.push(Math.abs((P.by || 0) - k.byOnce) / dt * 57.3); }
    k.byOnce = P.by || 0; k.hyOnce = P.hy || 0; k.gyOnce = P.gy || 0;
    /* baş */
    const by = Math.abs(P.by || 0); S.basKare++; if (by > S.basMax) S.basMax = by; if (by > 1.2217) S.bas70++; const hx = Math.abs(P.hx || 0); if (hx > S.basPitchMax) S.basPitchMax = hx;
    /* yerinde dönüş */
    const donHiz = Math.abs(k.yawU - kokOnce) / dt;
    if (donHiz > 3 && k.vs < 0.6 && eylemsiz) { S.donusKare++; if (yer[0] && yer[1]) S.donusAdimsiz++;
      /* A3: kaleci ve tavırlı (jokey, koru, bekle) kareler ayrı (kalecinin duruşu ve tavırlar ayakları bilerek yerde tutar) */
      const tur = p.rol === 'GK' ? 'gk' : p.tavir ? 'tavir' : 'saha'; const D2 = S.donusTur || (S.donusTur = {}); const d2 = D2[tur] || (D2[tur] = [0, 0]); d2[0]++; if (yer[0] && yer[1]) d2[1]++;
      if (tur === 'saha') { const G = S.donusTani || (S.donusTani = { n: 0, piv: 0, piv3: 0, cad: 0, iki: 0, ikiPiv: 0, v: 0 }); G.n++; (G.ust || (G.ust = [])).push(Math.max(k.vy[0], k.vy[1])); G.beta = (G.beta || 0) + (a.beta || 0); G.piv += a.pivO || 0; if ((a.pivO || 0) > 0.3) G.piv3++; G.cad += a.cadS || 0; G.v += k.vs; if (yer[0] && yer[1]) { G.iki++; if ((a.pivO || 0) > 0.3) G.ikiPiv++; } } }
    /* dönüş olayları: son 0,8 sn'de kök 90°'den çok döndüyse */
    k.gecmis.push([t, k.yawU, k.basU, k.pen.bas.length ? k.pen.bas[k.pen.bas.length - 1] : -1, k.vAci == null ? null : k.vAci]); while (k.gecmis.length && t - k.gecmis[0][0] > 1.2) k.gecmis.shift();
    if (t - k.sonDonus > 1.2) { const g = k.gecmis, i0 = g.findIndex(s => t - s[0] <= 0.8);
      if (i0 >= 0 && Math.abs(k.yawU - g[i0][1]) > 1.5708) { k.sonDonus = t; const top = k.yawU - g[i0][1], yon = Math.sign(top);
        let tk = null, tb = null; for (let j = i0; j < g.length; j++) { if (tk === null && (g[j][1] - g[i0][1]) * yon >= Math.abs(top) / 2) tk = g[j][0]; if (tb === null && (g[j][2] - g[i0][2]) * yon >= Math.abs(top) / 2) tb = g[j][0]; }
        let adim = 0; const basT = new Set(); for (let j = i0; j < g.length; j++) if (g[j][3] >= g[i0][0]) basT.add(g[j][3]); adim = basT.size;
        let tem = null; if (tk !== null) for (let j = k.temasG.length - 1; j >= 0; j--) { const [t0, du] = k.temasG[j]; if (t0 <= tk && t0 >= g[i0][0]) { tem = du; break; } }
        /* A6-0: dönüşün başında baş gövdeye göre nerede (dönüş yönünde +; rad) — hizalı (|·| ≤ 0,35) dönüşte öncülük anlamlıdır; önde başlayan (baş
           zaten dönüş yönüne bakıyor) ya da ters başlayan (tarama öbür yanda) dönüşte yarı yol zamanı başın başlangıcına bağlı */
        const bas0 = aciF(g[i0][2], g[i0][1]) * yon;
        S.donus.push({ aci: +(Math.abs(top) * 57.3).toFixed(0), adim, onculuk: tk !== null && tb !== null ? Math.round((tk - tb) * 1000) : null, v: +k.vs.toFixed(2), tem, bant: BANT(k.vs), kesme: g[i0][4] != null && k.vAci != null && Math.abs(aciF(k.vAci, g[i0][4])) >= 1.047, bas0: +bas0.toFixed(2) }); } }
    /* 2 sn'lik pencere: kadans ve kimlik */
    const pen = k.pen; pen.vmin = Math.min(pen.vmin, k.vs); pen.vmax = Math.max(pen.vmax, k.vs); if (!eylemsiz) pen.eylem = true;
    const kol = P.aL || 0; pen.kolMin = Math.min(pen.kolMin, kol); pen.kolMax = Math.max(pen.kolMax, kol);
    if (t - pen.t0 >= 2) {
      const bb = BANT((pen.vmin + pen.vmax) / 2), bs = pen.bas.filter(x => x >= pen.t0);
      if (!pen.eylem && pen.vmax - pen.vmin < 0.8 && bb >= 1 && bs.length >= 3) { const c = (bs.length - 1) / (bs[bs.length - 1] - bs[0]); S.kadans[bb].push(c);
        if (bb === 2) { k.kimlik.boy.push(((pen.vmin + pen.vmax) / 2) / c); k.kimlik.kol.push(pen.kolMax - pen.kolMin); } }
      k.pen = { t0: t, bas: [], vmin: 1e9, vmax: -1e9, eylem: false, kolMin: 1e9, kolMax: -1e9 }; }
    /* bekleyiş */
    if (k.vs < 0.15 && eylemsiz) k.bekleT += dt; else k.bekleT = 0;
    if (k.bekleT > 2) { S.bekle++; if (toplamD < 0.0003) S.bekleDonuk++; bekleyenler.push(Array.from(k.P1)); }
    /* SPARC: başın hızı */
    a.m.head.getWorldPosition(H); if (k.hp) k.sp.push(Math.hypot(H.x - k.hp[0], H.y - k.hp[1], H.z - k.hp[2]) / dt); k.hp = [H.x, H.y, H.z]; if (!eylemsiz) k.spEylem = true;
    if (k.sp.length >= 180) { if (!k.spEylem) S.sparc.push(sparc(k.sp, 1 / dt)); k.sp = []; k.spEylem = false; }
    k.ilk = false;
  }
  const asil = window.aktorGuncelle;
  window.aktorGuncelle = (a, al, dts, T) => { const t0 = R(); asil(a, al, dts, T); kareSure += R() - t0; kaydet(a, dts); zamanlama(a); temasOlc(a, dts); olayOlc(a, dts); };
  /* A6-0: yapay sahnelerde ışınlamadan sonra oyuncuların ölçüm durumu unutulur (ışınlama karesi kayma sayılmasın) */
  window.__ANM_OLCUM_UNUT = () => K.clear();
  const asilOlay = window.animasyonOlay;
  /* endirekt kolu havadayken yeniden başlama düdüğü çizilmez (kol inmez): ölçüme alınmaz */
  window.animasyonOlay = (ad, v) => { asilOlay(ad, v); const h0 = typeof ANM_HK !== 'undefined' && mac.refs ? ANM_HK.get(mac.refs[0]) : null;
    if (HK_OLAY[ad] && !(ad === 'duduk' && h0 && h0.cur && h0.cur.tur === 'endirekt')) S.zOlay.push({ ad, kare: mac.kare, tur: HK_OLAY[ad] });
    if (ad === 'mudahaleSonuc' && v && v.p && v.topaDegdi) zTmBekle.set(v.p, mac.kare);
    /* A6-0: şut bloğu (orta bloğu değil) — motorun temas uzaklığı ve topun yüksekliği olay anında */
    if (ad === 'block' && v && v.p && !v.orta) { const b = mac.ball; zBl.set(v.p, { kare: mac.kare, uzan: Math.hypot(b.x - v.p.x, b.z - v.p.z), y: b.y - (v.p.yuk || 0) }); }
    if (v && v.p && v.p.rol === 'GK' && ((ad === 'save' && (!v.parca || v.parca === 'el')) || ad === 'yumruk' || ad === 'parmak')) zKr.set(v.p, { kare: mac.kare, bicim: ad === 'save' ? (v.bicim || '-') : ad, el: v.el || '-' });
    if (ad === 'save' && v) S.kr.parca[v.parca || '-'] = (S.kr.parca[v.parca || '-'] || 0) + 1;
    if (ad === 'save' && v && v.p && v.niyet === 'cel' && v.celN) zCel.set(v.p, { kare: mac.kare, N: v.celN, P0: null, i: -1 });   /* T15d */
    /* T8e: kullanım anı — taç bırakışı (atanın çizimi bu karede denetlenir), penaltı teması (kalecinin uçuş başlangıcıyla karşılaştırılır), korner kol jesti */
    if (ad === 'kullanim' && v && v.p) { const D = S.dr;
      if (v.tur === 'tac') zTac.set(v.p, { kare: mac.kare, alt: v.alt });
      else if (v.tur === 'penalti') { D.penN++; const gk = mac.kaleci(1 - v.takim), k = zPenKare.get(gk); if (zPenKan.has(gk)) { zPenKan.delete(gk); D.penKan++; } else if (k !== undefined && mac.kare - k <= 60) D.penDt.push(+((k - mac.kare) / 60).toFixed(3)); else zPenBekle = { gk, kare: mac.kare }; }
      else if (v.tur === 'korner') { D.kolN++; const k = zKol.get(v.du); if (k && k.t >= 0.5) D.kolIyi++; zKol.delete(v.du); } } };
  const zCel = new Map(), zTt = new Map(), zDk = new Map(), zPenKan = new Set();   /* T15d */
  const zK = new Map(), zC = new Map(), zIt = new Map(), zY = new Map(), zKor = new Map(), zTm = new Map(), zTmBekle = new Map(), zHv = new Map(), zPj = new Map(), zKr = new Map(), zKp = new Map(), zBl = new Map();
  const zTac = new Map(), zPenKare = new Map(), zPenE = new Map(), zKol = new Map(), zYer = new Map(); let zPenBekle = null;
  /* T5f temas ölçümü (aktör başına, kare sonunda) */
  function temasOlc(a, dt) { const p = a.kaynak; if (!p || p.tur !== 'oyuncu' || !p.oyunda || !a.m.root.visible) return; const e = p.eylem, ad = e ? e.ad : '', G = S.tm;
    /* T9b-e: topun çizilen yeri (anmVkTop; temas karesinde temas yerinde tutulur) — eski çizimde motorun yeriyle aynı (iki adım arası oran ≈ 1) */
    const kare = zTmBekle.get(p); if (kare !== undefined) { zTmBekle.delete(p); if (kare === mac.kare) { a.m.root.updateMatrixWorld(true); const b = mac.ball, tbm = anmVkTop(a.al); let en = 9;
      for (let i = 0; i < 2; i++) { V.set(0, -0.5, 0.05).applyMatrix4((i ? a.m.kR : a.m.kL).matrixWorld); const d = Math.hypot(V.x - tbm[0], V.y - (tbm[1] + 0.11), V.z - tbm[2]) - 0.11; if (d < en) en = d; }
      G.n++; G.acik.push(+Math.max(0, en).toFixed(3));
      if (G.liste.length < 40) { const e2 = p.eylem; G.liste.push([e2 ? e2.ad : '-', e2 && e2.tur || '-', +Math.max(0, en).toFixed(3), +(e2 && e2.t || 0).toFixed(2), +(e2 && e2.temas || 0).toFixed(2), +Math.hypot(b.vx, b.vz).toFixed(1), +b.y.toFixed(2), +Math.hypot(b.x - p.x, b.z - p.z).toFixed(2), a.kucuk ? 'kucuk' : '']); } } }
    /* A6-0: blok teması — top beden yüksekliğinin altındaysa (< 0,8 m) çizilen ayağın (taban ortası) topa açıklığı, motorun temas uzaklığıyla */
    { const bl = zBl.get(p); if (bl !== undefined) { zBl.delete(p); if (bl.kare === mac.kare) { const B = S.bl; B.n++;
        if (bl.y >= 0.8) B.ust++; else { a.m.root.updateMatrixWorld(true); const tbm = anmVkTop(a.al); let en = 9;
          for (let i = 0; i < 2; i++) { V.set(0, -0.5, 0.05).applyMatrix4((i ? a.m.kR : a.m.kL).matrixWorld); const d = Math.hypot(V.x - tbm[0], V.y - (tbm[1] + 0.11), V.z - tbm[2]) - 0.11; if (d < en) en = d; }
          (bl.uzan > 0.6 ? B.uzak : B.yakin).push(+Math.max(0, en).toFixed(3));
          if (B.liste.length < 40) B.liste.push([+bl.uzan.toFixed(2), +bl.y.toFixed(2), +Math.max(0, en).toFixed(3), e ? e.ad : '-']); } } } }
    { const kr = zKr.get(p); if (kr !== undefined) { zKr.delete(p); if (kr.kare === mac.kare) { a.m.root.updateMatrixWorld(true); const tb = anmVkTop(a.al); let en = 9;
        for (const kb of [a.m.eL, a.m.eR]) { V.set(0, -0.3, 0).applyMatrix4(kb.matrixWorld); const d = Math.hypot(V.x - tb[0], V.y - (tb[1] + 0.11), V.z - tb[2]) - 0.11; if (d < en) en = d; }
        const R = S.kr; R.n++; R.acik.push(+Math.max(0, en).toFixed(3)); R.bicim[kr.bicim] = (R.bicim[kr.bicim] || 0) + 1; R.el[kr.el] = (R.el[kr.el] || 0) + 1;
        const ty = ad === 'ucus' ? 'ucus:' + (e.tur || 'dalis') : ad === 'kapan' ? 'kapan:' + (e.tur || 'yayil') : (ad || '-'); R.tur[ty] = (R.tur[ty] || 0) + 1;
        if (R.liste.length < 80) R.liste.push([ty, +Math.max(0, en).toFixed(3), kr.bicim, kr.el, e && e.faz || '-', +(e && e.t || 0).toFixed(2), +(a.kl ? a.kl.w : -1).toFixed(2), +tb[1].toFixed(2)]); } }
      if (ad === 'ucus') { S.kr.fazN++; if (a.uFaz === e.faz) S.kr.fazAyni++; }
      if (ad === 'yanAdim') S.kr.yanAdim++;
      if (ad === 'kapan' && zKp.get(a) !== e) { zKp.set(a, e); const ty = e.tur || 'yayil'; S.kr.kapan[ty] = (S.kr.kapan[ty] || 0) + 1; } }
    /* T15d: tutuşun türü — kurtarış dışı tutuş eyleminde (temasta tutuş, yakalama) e.t ≥ 0,07'de çizilen poz anahtarı (a.tK) motorun türüyle aynı mı;
       geometri (kol IK'sı açıkken): kepçede eller topun altında (≤ merkez + 0,06) ve kalça ≤ 0,8 m, W'de eller topun hizasında ya da üstünde
       (≥ merkez − 0,12) ve aralık ≤ 0,35 m, kucakta eller topun ±0,25 m hizasında, yukarıda eller topun hizasında ya da üstünde (≥ merkez − 0,15) */
    if (p.rol === 'GK' && ad === 'tutus' && !e.kurtar && e.t >= 0.07 && zTt.get(a) !== e) { zTt.set(a, e); const R = S.kr, mt = e.tur || '-'; R.tutN++; R.tutTur[mt] = (R.tutTur[mt] || 0) + 1; if (a.tK === mt) R.tutAyni++;
      if (!a.kucuk) { a.m.root.updateMatrixWorld(true); const tb = anmVkTop(a.al), bc = tb[1] + 0.11, Gl = [a.m.eL, a.m.eR].map(kb => { V.set(0, -0.3, 0).applyMatrix4(kb.matrixWorld); return [V.x, V.y, V.z]; });
        const gy = (Gl[0][1] + Gl[1][1]) / 2, ara = Math.hypot(Gl[0][0] - Gl[1][0], Gl[0][1] - Gl[1][1], Gl[0][2] - Gl[1][2]); a.m.hip.getWorldPosition(H); const sy = a.m.root.scale.y || 1;
        const ok = mt === 'yer' ? gy <= bc + 0.06 && H.y <= 0.8 * sy : mt === 'W' ? gy >= bc - 0.12 && ara <= 0.35 : mt === 'gogus' ? Math.abs(gy - bc) <= 0.25 : mt === 'yukari' ? gy >= bc - 0.15 : false;
        if (ok) R.tutGeo++; else if (R.tutKotu.length < 20) R.tutKotu.push([mt, a.tK, +gy.toFixed(2), +bc.toFixed(2), +ara.toFixed(2), +H.y.toFixed(2)]); } else R.tutGeo++; }
    /* T15d: planlı çelmede kolun yolu — temas karesinde topa en yakın eldiven topun itilen yanının tersinde mi: (eldiven − top)·celN < 0 (kabul ≥ %90);
       takip (bilgi): 6 kare sonra eldivenin kalçaya göre yer değiştirmesinin celN'e açısı (dalışta gövdenin uçuşu dünya çerçevesindeki yolu örter) */
    { const zc = zCel.get(p); if (zc) { a.m.root.updateMatrixWorld(true); const Gl = [a.m.eL, a.m.eR].map(kb => { V.set(0, -0.3, 0).applyMatrix4(kb.matrixWorld); return [V.x, V.y, V.z]; });
      a.m.hip.getWorldPosition(H); const N = zc.N, NL = Math.hypot(N[0], N[1], N[2]) || 1;
      if (zc.i < 0 && mac.kare === zc.kare) { const tb = anmVkTop(a.al), d = Gl.map(g => Math.hypot(g[0] - tb[0], g[1] - tb[1] - 0.11, g[2] - tb[2])); zc.i = d[0] <= d[1] ? 0 : 1; const g = Gl[zc.i];
        zc.P0 = [g[0] - H.x, g[1] - H.y, g[2] - H.z]; S.kr.celN++; if (((g[0] - tb[0]) * N[0] + (g[1] - tb[1] - 0.11) * N[1] + (g[2] - tb[2]) * N[2]) / NL < 0) S.kr.celIyi++; }
      else if (zc.i >= 0 && mac.kare >= zc.kare + 6) { const g = Gl[zc.i], dx = g[0] - H.x - zc.P0[0], dy = g[1] - H.y - zc.P0[1], dz = g[2] - H.z - zc.P0[2], L = Math.hypot(dx, dy, dz);
        if (L > 0.01) S.kr.celAci.push(+(Math.acos(Math.max(-1, Math.min(1, (dx * N[0] + dy * N[1] + dz * N[2]) / (L * NL)))) * 180 / Math.PI).toFixed(0)); zCel.delete(p); }
      else if (mac.kare > zc.kare + 12) zCel.delete(p); } }
    if (ad === 'kalkis') { let z = zTm.get(a); if (!z || z.e !== e) { z = { e, bitti: false }; zTm.set(a, z); } if (!z.bitti && e.t >= (e.sure || 0.6) - dt * 1.01) { z.bitti = true; G.kalkN++; if (a.lth <= 0.05) G.kalkDik++; } }
    if (ad === 'sendele') { G.sendKare++; if (a.gAdim < 0.7) G.sendKisa++; }
    if (ad === 'dusus' && e.t < dt * 1.01) G.dususN++;
    /* T8e duran top */
    { const D = S.dr, G = p.duranRol, du = mac.durus;
      if (G && G.rol === 'baraj') { const z = p.zipla; if (z && z.t >= 0) { D.bjKare++; if (a.yEk > 0.05) D.bjFazla++; if (a.sw[ANM_S.barajZ] > 0.5) D.bjPoz++; } else if (!z && mac.phase === 'durus' && a.yEk > 0.03) D.bjOnce++; }
      if (ad === 'yerlestir') { let z = zYer.get(a); if (!z || z.e !== e) { z = { e, iyi: false }; zYer.set(a, z); D.yerN++; } if (!z.iyi && a.sw[ANM_S.yerlestir] > 0.5) { z.iyi = true; D.yerIyi++; } }
      if (du && du.tur === 'korner' && du.kullanan === p && p.jest && p.jest.tur === 'kol') { let k = zKol.get(du); if (!k) { k = { t: 0 }; zKol.set(du, k); } k.t += dt; }
      /* T15d: duraklı penaltı koşusunda tereddüt pozu (a.w.durak > 0,5 görüldü) */
      if (ad === 'vurus' && e.kosu === 'durak') { let z = zDk.get(a); if (!z || z.e !== e) { z = { e, iyi: false }; zDk.set(a, z); D.dkN++; } if (!z.iyi && (a.w.durak || 0) > 0.5) { z.iyi = true; D.dkIyi++; } }
      const tc = zTac.get(p); if (tc !== undefined) { zTac.delete(p); if (tc.kare === mac.kare) { D.tacN++; if (a.sw[ANM_S.tacAt] >= 0.5) D.tacTepe++; if (tc.alt === 'uzun') D.tacUzun++; } }
      /* ortada kalan kaleci (penaltiTahmin 0; motor %10) sonradan topa tepkiyle dalar: erken kalkış sayılmaz */
      if (p.rol === 'GK' && ad === 'ucus' && zPenE.get(p) !== e) { zPenE.set(p, e); zPenKare.set(p, mac.kare); if (du && du.tur === 'penalti' && du.kullanan && du.kullanan.eylem && du.kullanan.eylem.kosu === 'durak') zPenKan.add(p); if (zPenBekle && zPenBekle.gk === p) { if (p.penaltiTahmin === 0) D.penOrta++; else D.penDt.push(+((mac.kare - zPenBekle.kare) / 60).toFixed(3)); zPenBekle = null; } } }
    if (ad === 'kafa' && !e.bos) { let z = zHv.get(a); if (!z || z.e !== e) { zHv.set(a, { e }); const Hv = S.hv; a.m.root.updateMatrixWorld(true); a.m.head.getWorldPosition(H);
      const tb = anmVkTop(a.al), b = { x: tb[0], y: tb[1], z: tb[2] + MOTOR_Z }, d = Math.hypot(H.x - b.x, H.y - (b.y + 0.11), H.z - (b.z - MOTOR_Z)) - 0.23; Hv.n++;   /* topun çizilen yeri */ Hv.acik.push(+Math.max(0, d).toFixed(3)); if (p.zipla) Hv.sic++;
      const y = e.yuzey || '-'; Hv.yz[y] = (Hv.yz[y] || 0) + 1; if (e.plonjon) { Hv.pl++; Hv.plAcik.push(+Math.max(0, d).toFixed(3)); zPj.set(a, true); } } }
    if (ad === 'yerde' && e.neden === 'plonjon' && zPj.get(a)) { zPj.delete(a); S.hv.plInis.push(+a.lth.toFixed(3)); } }
  function zamanlama(a) {
    const p = a.kaynak; if (!p) return;
    if ((p.tur === 'hakem') && typeof ANM_HK !== 'undefined') { const h = ANM_HK.get(p); if (h && h.basKare >= 0) { const o = zK.get(a) || -1; if (h.basKare !== o) { zK.set(a, h.basKare); (S.zIsaret[p.kind] = S.zIsaret[p.kind] || []).push(h.basKare); } } }
    if (p.tur === 'oyuncu' && a.vk) { const e = p.eylem, vk = a.vk;
      if (e && e.ad === 'vurus') {
        /* T4-V: eylem ilk görüldüğünde evresi (temasta görülen = hazırlık hiç çizilmedi); son adımda (evre 2, aşağı salınımdan önce) geri salınımın
           tepesi / planı; temas karesinde son adımın süresi / tB ve motorun karar→temas süresi (e.t) türe göre */
        let z = zK.get(a); if (!z || z.e !== e) { z = { e, tepe: 0, bitti: false }; zK.set(a, z); if (e.faz === 'takip') S.vkIlkTakip++; }
        if (vk.e === e && vk.evre === 2 && !vk.asagi) { const h = (vk.kp[1] - ANM_VK_YG) / (0.08 + 0.26 * vk.S); if (h > z.tepe) z.tepe = h; }
        if (e.faz === 'takip' && !z.bitti) { z.bitti = true; S.zVurus++;
          { const st = e.stil || '-', pk = vk.pk || '-', bek = st === 'ic' ? ['ic', 'ust'] : st === 'dis' ? ['dis'] : st === 'asirtma' ? ['asirtma'] : st === 'vole' ? ['vole'] : st === 'falso' ? ['falso'] : st === 'burun' ? ['burun'] : ['ust', 'uzun'];
            const VS = S.vs, ok = bek.includes(pk); VS.n++; if (ok) VS.ayni++; const r = VS.stil[st] || (VS.stil[st] = [0, 0]); r[0]++; if (ok) r[1]++;
            a.m.root.updateMatrixWorld(true); V.set(0, -0.5, 0.05).applyMatrix4((vk.ayak ? a.m.kR : a.m.kL).matrixWorld); const tb = anmVkTop(a.al), dx = V.x - tb[0], dy = V.y - (tb[1] + 0.11), dz = V.z - tb[2];
            const c = Math.cos(a.yaw), s = Math.sin(a.yaw), kay = { acik: +(Math.hypot(dx, dy, dz) - 0.11).toFixed(3), dy: +dy.toFixed(3), yan: +((dx * c - dz * s) * (vk.ayak ? 1 : -1)).toFixed(3) };
            { const sx = a.m.root.scale.x || 1, gv = (x, z) => { const ddx = x - a.x, ddz = z - a.z; return [+((ddx * c - ddz * s) / sx).toFixed(3), +((ddx * s + ddz * c) / sx).toFixed(3)]; };
              kay.ayakG = gv(V.x, V.z); kay.topG = gv(tb[0], tb[2]); kay.C = [+vk.C[0].toFixed(3), +vk.C[1].toFixed(3), +vk.C[2].toFixed(3)]; kay.ayakY = +V.y.toFixed(3); kay.topY = +(tb[1] + 0.11).toFixed(3);
              kay.stil = st; kay.yan0 = vk.yan; kay.ofs = +vk.ofs.toFixed(3); kay.al = +a.al.toFixed(2); kay.vTop = +Math.hypot(mac.ball.vx, mac.ball.vz).toFixed(1);
              /* çizimin aynı vuruştaki normal temas yerine (vk.C0) göre: destek yanına, yukarı, öne (gövde çerçevesi, m) */
              if (vk.C0) { const sy = a.m.root.scale.y || 1; kay.d0 = [+((kay.ayakG[0] - vk.C0[0]) * -vk.yan).toFixed(3), +((V.y - a.m.root.position.y) / sy - vk.C0[1]).toFixed(3), +(kay.ayakG[1] - vk.C0[2]).toFixed(3)]; } }
            if (e.kotu) (VS.kotu[e.kotu] = VS.kotu[e.kotu] || []).push(kay); else VS.normal.push(kay); }
          const ayni = vk.evre === 3 && vk.tT === 0; if (ayni) S.zVurusAyni++; else S.zVurusFark.push(vk.evre);
          S.vkN++; const sa = ayni ? vk.t / vk.tB : 0; S.vkSonAdim.push(+sa.toFixed(3)); if (sa < 0.8) S.vkHazirliksiz++; S.vkTepe.push(+z.tepe.toFixed(3));
          const sec = e.sec || {}, L = sec.hx != null ? Math.hypot(sec.hx - mac.ball.x, sec.hz - mac.ball.z) : 0;
          const g = sec.ilk ? 'ilk' : sec.tur === 'sut' ? 'sut' : (sec.tip === 'hava' || L > 22 || sec.tur === 'uzaklastir') ? 'uzun' : 'pas'; if (e.t != null) S.vkKT[g].push(+e.t.toFixed(3)); } } }
    if (p.tur === 'oyuncu' && a.ck && p.oyunda) { const ck = a.ck, C = p.calim, G = S.ck;
      /* çalım denemesi: motorun faz 1'e geçtiği adım = kare − ft/adım (ft hazırlıkta adım başına 1/60 artar) */
      let z = zC.get(a);
      if (z && z.C !== C) { if (z.makas) G.makas.push(+z.yan.toFixed(3)); zC.delete(a); z = null; }
      if (C && C.faz >= 1 && !C.bitti && !z) { z = { C, bas: C.faz === 1 ? mac.kare - Math.round(C.ft * 60) : null, ciz: false, yan: 0, makas: false }; zC.set(a, z);
        if (z.bas !== null) { G.N[C.hareket] = (G.N[C.hareket] || 0) + 1; G.bas++; } }
      if (z && z.bas !== null && !z.ciz && ck.e === C) { z.ciz = true; const d = ck.basKare - z.bas; if (d === 0) G.basAyni++; else G.basFark.push(d); }
      if (z && C && C.hareket === 'makas' && ck.e === C && ck.sIdx >= 0 && (C.faz === 1 || ck.sAktif)) { a.m.root.updateMatrixWorld(true);
        V.set(0, -0.5, 0.05).applyMatrix4((ck.sIdx ? a.m.kR : a.m.kL).matrixWorld); const b = mac.ball, dx = V.x - b.x, dz = V.z - (b.z - MOTOR_Z), c = Math.cos(a.yaw), s = Math.sin(a.yaw);
        const yan = Math.abs(dx * c - dz * s); if (yan > z.yan) z.yan = yan; z.makas = true; }
      /* itiş: motorun itiş dokunuşu bu adımda (sonDokunus.t === mac.t) — çizimin itiş pozu aynı adımda mı */
      const sd = p.sonDokunus; if (sd && sd.calim && sd.t !== zIt.get(a)) { zIt.set(a, sd.t); if (Math.abs(sd.t - mac.t) < 1e-6) { G.it++; if (ck.itKare === mac.kare) G.itAyni++; } }
      /* aldatılan savunmacı (aldatma): gövde yatışı yanılgı yanında mı (gz + hz; yan yanılgının başında gövdeye göre) */
      const Y = p.yutma; if (Y && Y.mek === 'aldat' && !p.eylem) { let y = zY.get(a); if (!y || y.Y !== Y) { y = { Y, n: 0, ok: 0, sag: Math.sin(aciF(Y.yon, p.yon)) > 0 }; zY.set(a, y); G.yutKayit.push(y); }
        y.n++; const r = (a.P.gz || 0) + (a.P.hz || 0); if ((y.sag ? r : -r) > 0.12) y.ok++; }
      /* top saklama: en yakın rakibin yanı (gövdeye göre 0,3 m'den belirginse) ile çizimin yanı; yan değişimi */
      if (p.tavir === 'koru') { G.korKare++; let o = null, ed = 9; for (const q of mac.teams[1 - p.team]) { if (!q.oyunda) continue; const d = (q.x - p.x) * (q.x - p.x) + (q.z - p.z) * (q.z - p.z); if (d < ed) { ed = d; o = q; } }
        if (o) { const yan = -(o.x - p.x) * Math.sin(p.yon) + (o.z - p.z) * Math.cos(p.yon); if (Math.abs(yan) > 0.3) { G.korN++; if ((yan > 0) === ck.korSag) G.korDogru++; } }
        const ks = zKor.get(a); if (ks !== undefined && ks !== ck.korSag) G.korDegis++; zKor.set(a, ck.korSag); } else zKor.delete(a); }
  }
  const asilKare = window.macKare;
  window.macKare = dt => { kareSure = 0; bekleyenler = []; asilKare(dt); t += dt; S.kare++; S.sureler.push(kareSure);
    { const L = []; for (const a of K.keys()) { const p = a.kaynak; if (p && p.tur === 'oyuncu' && p.oyunda && a.m.root.visible && !(p.eylem && p.eylem.kilit)) L.push(a); }
      for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const dx = L[i].x - L[j].x, dz = L[i].z - L[j].z, d2 = dx * dx + dz * dz; if (d2 < 1) { S.tm.cift++; if (d2 < 0.09) S.tm.icIce++; } } }
    /* T6f: havadaki iki rakip (motorun p.zipla'sı uçuşta) çizilen gövde merkezleri 0,5 m'den yakın mı */
    { const A = []; for (const a of K.keys()) { const p = a.kaynak; if (p && p.tur === 'oyuncu' && p.oyunda && p.zipla && p.zipla.t >= 0 && a.m.root.visible) A.push(a); }
      for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) { if (A[i].kaynak.team === A[j].kaynak.team) continue; const dx = A[i].x - A[j].x, dz = A[i].z - A[j].z, d2 = dx * dx + dz * dz;
        if (d2 < 1.44) { S.hv.cift++; if (d2 < 0.25) S.hv.icIce++; } } }
    /* T8e: duruşta kutudaki görevlilerin çizilen gövdeleri iç içe (< 0,3 m); penaltıda temastan 40 kare sonra uçuş başlamadıysa 'yok' */
    if (mac.phase === 'durus') { const A = []; for (const a of K.keys()) { const p = a.kaynak; if (p && p.oyunda && p.duranRol && typeof ANM_KUTU_ROL !== 'undefined' && ANM_KUTU_ROL.has(p.duranRol.rol) && a.m.root.visible) A.push(a); }
      for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) { const dx = A[i].x - A[j].x, dz = A[i].z - A[j].z; if (dx * dx + dz * dz < 0.09) S.dr.icIce++; } }
    if (zPenBekle && mac.kare - zPenBekle.kare > 40) { if (zPenBekle.gk.penaltiTahmin === 0) S.dr.penOrta++; else S.dr.penDt.push(null); zPenBekle = null; }
    for (let i = 0; i < bekleyenler.length; i++) for (let j = i + 1; j < bekleyenler.length; j++) { let s = 0; const A = bekleyenler[i], B = bekleyenler[j]; for (let q = 0; q < NK; q++) s += (A[q] - B[q]) * (A[q] - B[q]);
      S.cift++; if (Math.sqrt(s / NK) < 0.02) S.ikiz++; } };
  window.__ANM_KIMLIK = () => { const o = []; for (const k of K.values()) if (k.kimlik.boy.length >= 2) o.push({ boy: k.kimlik.boy.reduce((x, y) => x + y) / k.kimlik.boy.length, kol: k.kimlik.kol.reduce((x, y) => x + y) / k.kimlik.kol.length }); return o; };
}"""

SONUC_JS = r"""() => {
  const S = window.__ANM_OLCUM, ort = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null, sirala = a => a.slice().sort((x, y) => x - y);
  const yuzde = (a, q) => { if (!a.length) return null; const s = sirala(a); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
  const cv = a => { const m = ort(a); if (!m) return null; return Math.sqrt(ort(a.map(x => (x - m) * (x - m)))) / m; };
  const kim = window.__ANM_KIMLIK();
  const don = S.donus, don90 = don.filter(d => d.aci >= 90), onc = don90.map(d => d.onculuk).filter(x => x !== null);
  const dk = S.kareN / 60 / 60;   /* oyuncu·dakika (kare sayısı / 60 / 60) */
  return {
    kare: S.kare, oyuncuDk: +dk.toFixed(1),
    kayma: S.temas.map((n, i) => n ? +(100 * S.kayma[i] / n).toFixed(2) : null),
    temas: S.temas,
    adimYol: S.adimYol.map(a => a.length ? { ort: +ort(a).toFixed(4), p90: +yuzde(a, 0.9).toFixed(4), n: a.length } : null),
    adimNet: S.adimNet.map(a => a.length ? { ort: +ort(a).toFixed(4), p90: +yuzde(a, 0.9).toFixed(4), n: a.length } : null),
    kadans: S.kadans.map(a => a.length ? { ort: +ort(a).toFixed(2), p10: +yuzde(a, 0.1).toFixed(2), p90: +yuzde(a, 0.9).toFixed(2), n: a.length } : null),
    ucus: S.ucus.map((n, i) => S.ucusN[i] ? +(100 * n / S.ucusN[i]).toFixed(1) : null),
    sicramaUstdk: +(S.sicramaUst / Math.max(1e-9, S.eylemsizKare / 3600)).toFixed(2), sicramaBacakdk: +(S.sicramaBacak / Math.max(1e-9, S.eylemsizKare / 3600)).toFixed(2),
    sicramaEylemdk: +(S.sicramaEylem / Math.max(1e-9, S.eylemliKare / 3600)).toFixed(2), sicramaDydk: +(S.sicramaDy / Math.max(1e-9, dk)).toFixed(2),
    kirilmaUstdk: +(S.kirilmaUst / Math.max(1e-9, S.eylemsizKare / 3600)).toFixed(1), kirilmaBacakdk: +(S.kirilmaBacak / Math.max(1e-9, S.eylemsizKare / 3600)).toFixed(1), kirilmaBacakGecisPay: S.kirilmaBacak ? +(100 * S.kirilmaBacakGecis / S.kirilmaBacak).toFixed(0) : null,
    basGovdeP99: S.basGovdeHiz.length ? Math.round(yuzde(S.basGovdeHiz, 0.99)) : null, kokHizP99: S.kokHiz.length ? Math.round(yuzde(S.kokHiz, 0.99)) : null,
    kanalKirilma: S.kanalKirilma, dyEylemsizdk: +(S.dyEylemsiz / Math.max(1e-9, S.eylemsizKare / 3600)).toFixed(2),
    basHizP99: S.basHiz.length ? Math.round(yuzde(S.basHiz, 0.99)) : null, basHizMax: S.basHiz.length ? Math.round(S.basHiz.reduce((x, y) => x > y ? x : y, 0)) : null, basHiz600dk: +(S.basHiz600 / Math.max(1e-9, S.eylemsizKare / 3600)).toFixed(2),
    kokSicramadk: +(S.kokSicrama / Math.max(1e-9, dk)).toFixed(2),
    kanalSicrama: S.kanalSicrama, kanalSicramaEylem: S.kanalSicramaEylem,
    basMaxDer: +(S.basMax * 57.3).toFixed(0), bas70: +(100 * S.bas70 / Math.max(1, S.basKare)).toFixed(2), basPitchMaxDer: +(S.basPitchMax * 57.3).toFixed(0),
    donus90: don90.length, donusAdim: don90.length ? +ort(don90.map(d => d.adim)).toFixed(2) : null, donusAdimsizPay: don90.length ? +(100 * don90.filter(d => d.adim === 0).length / don90.length).toFixed(1) : null,
    onculukMs: onc.length ? yuzde(onc, 0.5) : null, onculukP10: onc.length ? yuzde(onc, 0.1) : null,
    onc150: onc.length ? +(100 * onc.filter(x => x >= 150).length / onc.length).toFixed(0) : null,
    basUc: S.basUc.slice().sort((x, y) => y.w - x.w).slice(0, 5),
    /* A3: frende adım boyu ÷ sabit koşuda aynı hızdaki adım (sabit adımlara doğru: L = α + β·v); dönüşte fren adımı payı (90°+, koşarken: dönüşün
       yarısından önceki son basmanın teması ≥ 1,15 × aynı banttaki sabit koşu temasının ortancası) */
    frenAdimOran: (() => { const Sa = S.sabitAdim, Fa = S.frenAdim; if (Sa.length < 20 || !Fa.length) return null; let sv = 0, sl = 0, svv = 0, svl = 0; for (const [l, w] of Sa) { sv += w; sl += l; svv += w * w; svl += w * l; }
      const n = Sa.length, be = (n * svl - sv * sl) / Math.max(1e-9, n * svv - sv * sv), al = (sl - be * sv) / n; return { oran: +ort(Fa.map(([l, w]) => l / Math.max(0.1, al + be * w))).toFixed(2), n: Fa.length, ns: n }; })(),
    frenDyFark: (() => { const Sa = S.sabitDy, Fa = S.frenDy; if (Sa.length < 50 || !Fa.length) return null; let sv = 0, sl = 0, svv = 0, svl = 0; for (const [l, w] of Sa) { sv += w; sl += l; svv += w * w; svl += w * l; }
      const n = Sa.length, be = (n * svl - sv * sl) / Math.max(1e-9, n * svv - sv * sv), al = (sl - be * sv) / n; return +ort(Fa.map(([l, w]) => l - (al + be * w))).toFixed(3); })(),
    donusFren: (() => { const md = S.sabitTemas.map(L => L.length >= 10 ? yuzde(L.map(x => x * 1000), 0.5) / 1000 : null), D = S.donus.filter(d => d.aci >= 90 && d.v >= 2 && d.tem !== null && md[d.bant]);
      const K = D.filter(d => d.kesme), pay = L => L.length ? +(100 * L.filter(d => d.tem >= 1.15 * md[d.bant]).length / L.length).toFixed(0) : null;
      return D.length ? { pay: pay(D), n: D.length, oran: +ort(D.map(d => d.tem / md[d.bant])).toFixed(2), kPay: pay(K), kN: K.length, kOran: K.length ? +ort(K.map(d => d.tem / md[d.bant])).toFixed(2) : null } : null; })(),
    fren: (() => { const f = S.fren, s = S.sabit, o = (F, k) => F.n ? +(F[k] / F.n).toFixed(3) : null, oa = F => F.ayakN ? +(F.ayak / F.ayakN).toFixed(3) : null;
      return { n: f.n, sn: s.n, fr: o(f, 'fr'), dy: o(f, 'dy'), dyS: o(s, 'dy'), kol: o(f, 'kol'), kolS: o(s, 'kol'), egim: o(f, 'egim'), egimS: o(s, 'egim'), ayak: oa(f), ayakS: oa(s) }; })(),
    yerindeDonusTur: S.donusTur || {}, donusTani: S.donusTani ? Object.assign({}, S.donusTani, { ust: null, ustY: S.donusTani.ust ? [0.1, 0.25, 0.5, 0.75, 0.9].map(q => +yuzde(S.donusTani.ust, q).toFixed(3)) : null }) : null, yerindeDonusKare: S.donusKare, yerindeAdimsizPay: S.donusKare ? +(100 * S.donusAdimsiz / S.donusKare).toFixed(1) : null,
    kimlikBoyCv: kim.length >= 4 ? +(100 * cv(kim.map(x => x.boy))).toFixed(1) : null, kimlikKolCv: kim.length >= 4 ? +(100 * cv(kim.map(x => x.kol))).toFixed(1) : null, kimlikN: kim.length,
    bekleKare: S.bekle, bekleDonuk: S.bekle ? +(100 * S.bekleDonuk / S.bekle).toFixed(1) : null, ikizPay: S.cift ? +(100 * S.ikiz / S.cift).toFixed(2) : null,
    sparcOrt: S.sparc.length ? +ort(S.sparc).toFixed(2) : null, sparcP10: S.sparc.length ? +yuzde(S.sparc, 0.1).toFixed(2) : null, sparcN: S.sparc.length,
    sureMs: +ort(S.sureler).toFixed(3), sureP99: +yuzde(S.sureler, 0.99).toFixed(3),
    hv: (() => { const G = S.hv, sa = sirala(G.acik); return { n: G.n, acikMed: sa.length ? sa[Math.floor(sa.length / 2)] : null, acikP90: sa.length ? sa[Math.min(sa.length - 1, Math.floor(0.9 * sa.length))] : null,
      acikIyi: sa.length ? +(100 * sa.filter(x => x <= 0.15).length / sa.length).toFixed(0) : null, sicPay: G.n ? +(100 * G.sic / G.n).toFixed(0) : null, yz: G.yz, icIce: G.icIce, cift: G.cift,
      pl: G.pl, plAcikMed: G.plAcik.length ? sirala(G.plAcik)[Math.floor(G.plAcik.length / 2)] : null, plInisN: G.plInis.length, plInisYatay: G.plInis.filter(x => x >= 1.3).length }; })(),
    tm: (() => { const G = S.tm, sa = sirala(G.acik); return { n: G.n, acikMed: sa.length ? sa[Math.floor(sa.length / 2)] : null, acikP90: sa.length ? sa[Math.min(sa.length - 1, Math.floor(0.9 * sa.length))] : null,
      acikIyi: sa.length ? +(100 * sa.filter(x => x <= 0.15).length / sa.length).toFixed(0) : null, icIce: G.icIce, cift: G.cift, kalkN: G.kalkN, kalkDik: G.kalkDik, sendKare: G.sendKare,
      sendKisaPay: G.sendKare ? +(100 * G.sendKisa / G.sendKare).toFixed(0) : null, dususN: G.dususN, liste: G.liste }; })(),
    zaman: (() => { if (typeof ANM_HK === 'undefined') return null; const r = { olay: S.zOlay.length, ayni: 0, bir: 0, yok: 0, yokAd: {}, birAd: {} };
      for (const o of S.zOlay) { const L = o.tur === 'ref' ? ['ref'] : o.tur === 'lin' ? ['lin'] : o.tur === 'ikisi' ? ['ref', 'lin'] : ['ref', 'lin'];
        let enIyi = 99; for (const k of L) for (const b of (S.zIsaret[k] || [])) { const d = b - o.kare; if (d >= 0 && d < enIyi) enIyi = d; }
        if (enIyi === 0) r.ayni++; else if (enIyi === 1) { r.bir++; r.birAd[o.ad] = (r.birAd[o.ad] || 0) + 1; } else { r.yok++; r.yokAd[o.ad] = (r.yokAd[o.ad] || 0) + 1; } }
      r.vurus = S.zVurus; r.vurusAyni = S.zVurusAyni; r.vurusFark = S.zVurusFark.slice(0, 10); return r; })(),
    vk: (() => { const med = a => a.length ? +yuzde(a, 0.5).toFixed(3) : null, kt = S.vkKT;
      return { n: S.vkN, hazirliksizPay: S.vkN ? +(100 * S.vkHazirliksiz / S.vkN).toFixed(1) : null, sonAdimOrt: S.vkSonAdim.length ? +ort(S.vkSonAdim).toFixed(3) : null,
        sonAdimIyiPay: S.vkSonAdim.length ? +(100 * S.vkSonAdim.filter(x => x >= 0.8).length / S.vkSonAdim.length).toFixed(1) : null,
        tepeMed: S.vkTepe.length ? +yuzde(S.vkTepe, 0.5).toFixed(2) : null, ilkTakip: S.vkIlkTakip,
        ktPas: med(kt.pas), ktSut: med(kt.sut), ktUzun: med(kt.uzun), ktIlk: med(kt.ilk), disiVurus: S.vkN ? +(S.vkDisi / S.vkN).toFixed(2) : null, kare: S.vkKare, kararsiz: S.kararsiz,
        kararsizKanal: Object.entries(S.kararsizKanal).sort((a, b) => b[1] - a[1]).slice(0, 6),
        disiEvre: Object.entries(S.vkDisiEvre).sort((a, b) => b[1] - a[1]).slice(0, 10), evreKare: S.vkEvreKare }; })(),
    kaymaDurum: S.dTemas.map((n, i) => n ? { pay: +(100 * S.dKayma[i] / n).toFixed(2), n } : null),
    /* A6-0: kaymanın kaynağı (kayan karelerin payı), dönüşte başın öncülüğü başlangıç hizasına göre, blok teması */
    kaymaKaynak: (() => { const f = o => { const n = o.salinim + o.surukle + o.sabit + o.erisim; return n ? { n, salinim: +(100 * o.salinim / n).toFixed(0), surukle: +(100 * o.surukle / n).toFixed(0), sabit: +(100 * o.sabit / n).toFixed(0), erisim: +(100 * o.erisim / n).toFixed(0) } : null; };
      const h = S.kKaynak.hiz; return { genel: f(S.kKaynak.genel), durum: S.kKaynak.durum.map(f), koruHiz: h.length ? { med: yuzde(h, 0.5), p90: yuzde(h, 0.9), n: h.length } : null,
        zEvre: Object.fromEntries(Object.entries(S.zEvre).map(([k, x]) => [k, x[0] ? { n: x[0], pay: +(100 * x[1] / x[0]).toFixed(1) } : null])) }; })(),
    onculukAlt: (() => { const R = {}; for (const [ad, sec] of [['hizali', d => Math.abs(d.bas0) <= 0.35], ['onde', d => d.bas0 > 0.35], ['ters', d => d.bas0 < -0.35]]) {
        const L = don90.filter(d => d.bas0 != null && sec(d)).map(d => d.onculuk).filter(x => x !== null);
        R[ad] = L.length ? { n: L.length, med: yuzde(L, 0.5), p10: yuzde(L, 0.1), p150: +(100 * L.filter(x => x >= 150).length / L.length).toFixed(0) } : null; } return R; })(),
    blok: (() => { const B = S.bl, f = L => { const s = sirala(L); return s.length ? { n: s.length, med: s[Math.floor(s.length / 2)], p90: yuzde(s, 0.9), ic: +(100 * s.filter(x => x <= 0.15).length / s.length).toFixed(1) } : null; };
      return { n: B.n, ust: B.ust, yakin: f(B.yakin), uzak: f(B.uzak), hepsi: f(B.yakin.concat(B.uzak)), liste: B.liste }; })(),
    ck: (() => { const G = S.ck, Y = G.yutKayit.filter(y => y.n >= 3);
      return { N: G.N, bas: G.bas, basAyni: G.basAyni, basFark: G.basFark.slice(0, 10), it: G.it, itAyni: G.itAyni,
        makasN: G.makas.length, makasIyi: G.makas.filter(x => x >= 0.35).length, makasMed: G.makas.length ? +yuzde(G.makas, 0.5).toFixed(2) : null,
        yut: Y.length, yutGor: Y.filter(y => y.ok / y.n >= 0.5).length,
        korSn: +(G.korKare / 60).toFixed(1), korDegisSn: G.korKare ? +(G.korDegis / (G.korKare / 60)).toFixed(2) : null, korDogru: G.korN ? +(100 * G.korDogru / G.korN).toFixed(1) : null }; })(),
    kr: (() => { const G = S.kr, sa = sirala(G.acik); return { n: G.n, acikMed: sa.length ? sa[Math.floor(sa.length / 2)] : null, acikP90: sa.length ? sa[Math.min(sa.length - 1, Math.floor(0.9 * sa.length))] : null,
      acikIyi: sa.length ? +(100 * sa.filter(x => x <= 0.15).length / sa.length).toFixed(0) : null, bicim: G.bicim, el: G.el, tur: G.tur, parca: G.parca,
      faz: G.fazN ? +(100 * G.fazAyni / G.fazN).toFixed(1) : null, yanAdim: G.yanAdim, kapan: G.kapan, kaleci: window.__KALECI_SONUC || null, liste: G.liste,
      tutN: G.tutN, tutAyni: G.tutAyni, tutGeo: G.tutGeo, tutTur: G.tutTur, tutKotu: G.tutKotu, celN: G.celN, celIyi: G.celIyi, celAciMed: G.celAci.length ? sirala(G.celAci)[Math.floor(G.celAci.length / 2)] : null }; })(),
    vs: (() => { const G = S.vs, med = a => a.length ? sirala(a)[Math.floor(a.length / 2)] : null, nd = med(G.normal.map(x => x.dy)), ny = med(G.normal.map(x => x.yan)), r = {};
      /* uyum: çizimin aynı vuruştaki normal temas yerine (d0: destek yanına, yukarı, öne) göre — ıska topun üstünden (≥ 0,1 m yukarı) ve topa
         değmeden (açıklık ≥ 0,06), altına girme aşağı ya da öne (≥ 0,03), üstüne vurma yukarı (≥ 0,06), kenar destek yanına (≥ 0,05) */
      const uy = { iska: x => x.d0 && x.d0[1] >= 0.1 && x.acik >= 0.06, alt: x => x.d0 && (x.d0[1] <= -0.03 || x.d0[2] >= 0.03), ust: x => x.d0 && x.d0[1] >= 0.06, kenar: x => x.d0 && x.d0[0] >= 0.05 };
      for (const [k, L] of Object.entries(G.kotu)) r[k] = { n: L.length, uyumlu: L.filter(uy[k] || (() => false)).length, acik: med(L.map(x => x.acik)), dy: med(L.map(x => x.dy)), yan: med(L.map(x => x.yan)) };
      return { n: G.n, ayni: G.ayni, stil: G.stil, kotu: r, normalN: G.normal.length, normalDy: nd, normalYan: ny, normalAcik: med(G.normal.map(x => x.acik)), ornek: G.normal.slice(0, 30) }; })(),
    dr: (() => { const G = S.dr, d = G.penDt.filter(x => x !== null), sd = sirala(d); return { bjKare: G.bjKare, bjFazla: G.bjKare ? +(100 * G.bjFazla / G.bjKare).toFixed(1) : null, bjPoz: G.bjKare ? +(100 * G.bjPoz / G.bjKare).toFixed(1) : null, bjOnce: G.bjOnce,
      yerN: G.yerN, yerIyi: G.yerIyi, kolN: G.kolN, kolIyi: G.kolIyi, tacN: G.tacN, tacTepe: G.tacTepe, tacUzun: G.tacUzun, penN: G.penN, penMed: sd.length ? sd[Math.floor(sd.length / 2)] : null,
      penIcinde: d.filter(x => x >= -0.15 && x <= 0.02).length, penYok: G.penDt.filter(x => x === null).length, penOrta: G.penOrta, penKan: G.penKan, dkN: G.dkN, dkIyi: G.dkIyi, penDt: G.penDt.slice(0, 20), icIce: G.icIce, duran: window.__DURAN_SONUC || null }; })(),
    ol: (() => { const O = S.ol, yz = (a, b) => b ? +(100 * a / b).toFixed(1) : null; return { sakKare: O.sakKare, sakPoz: yz(O.sakPoz, O.sakKare), sedKare: O.sedKare, sedYuk: yz(O.sedYuk, O.sedKare),
      sedTut: yz(O.sedTut, O.sedTutN), tedKare: O.tedKare, tedPoz: yz(O.tedPoz, O.tedKare), gerdir: O.gerdir, topalN: O.topalN, topalOran: O.topalIyi ? +(O.topalKotu / O.topalIyi).toFixed(2) : null,
      endKare: O.endKare, endTut: yz(O.endTut, O.endKare), birakN: O.birakN, birakAyni: O.birakAyni, sev: O.sev, sevCesit: Object.keys(O.sev).length, gerdirOrtulu: O.gerdirOrtulu || 0, olay: window.__OLAY_SONUC || null }; })(),
    surum: window.ANM_SURUM || 'simdiki'
  };
}"""

# T9b-e: kaleye yapay şut (araclar/senaryolar/d-sut.js kalıbı): sahada yalnız kaleci; kaleci kendi yer tutmasıyla yerleşir (önünde bir savunmacı varken),
# çizim 30 karede yerleşir (önceki şutun duruşu söner), top havadanCoz ile hedefe gönderilir; maç karesi (motor + çizim) sonuca ve kurtarıştan sonra
# 0,5 sn daha ilerler. Yer × hedef × yan ızgarası sırayla
KALECI_JS = r"""() => {
  const dt = 1 / 60, YER = [{ u: 7, w: 0 }, { u: 11, w: 0 }, { u: 11, w: -6 }, { u: 16, w: 0 }, { u: 16, w: 8 }, { u: 20, w: 0 }, { u: 12, w: 9 }, { u: 25, w: 0 }],
    HEDEF = [{ tz: 0, ty: 0.3 }, { tz: 0, ty: 1.9 }, { tz: 1.9, ty: 1.1 }, { tz: 3.21, ty: 0.3 }, { tz: 3.21, ty: 2.04 }, { tz: 1.2, ty: 0.5 }],
    SONUC = window.__KALECI_SONUC = { sut: 0, gol: 0, kurtaris: 0, tutus: 0, disari: 0, belirsiz: 0 }, KS = { save: null, gol: false };
  const eski = window.animasyonOlay;
  window.animasyonOlay = (ad, v) => { eski(ad, v); if (ad === 'save' && v && v.p && v.p.rol === 'GK' && !KS.save) KS.save = v; if (ad === 'goal') KS.gol = true; };
  const tipik = L => 16 + 14 * (L < 11 ? 0.5 : L < 18 ? 0.7 : 0.875);
  window.__kaleciDene = i => {
    const m = mac, t = 1, gk = m.kaleci(t), d = m.dir[t], gx = -d * PL, at = m.teams[1 - t][9], df = m.teams[t][3], b = m.ball;
    const y = YER[i % YER.length], h = HEDEF[Math.floor(i / YER.length) % HEDEF.length], s = Math.floor(i / (YER.length * HEDEF.length)) % 2 ? 1 : -1;
    const bx = gx + d * y.u, bz = MZ + y.w, v = tipik(Math.hypot(y.u, y.w));
    m.phase = 'play'; m.phaseT = 0; m.gameSec = 600; m.durus = null; m.avantaj = null; m.celeb = null; m.hakemAI = function () {};
    for (const r of m.refs) { r.x = 0; r.z = -25; r.tx = 0; r.tz = -25; }
    for (const p of m.players) { p.oyunda = false; p.eylem = null; p.kickCd = 0; p.surus = null; p.tutus = null; p.x = -d * 30; p.z = -20; p.vx = p.vz = 0; p.tx = p.x; p.tz = p.z; p.sevinc = false; }
    for (const k in gk) if (k.charAt(0) === '_' && k !== '_kutle') gk[k] = null;
    Object.assign(gk, { oyunda: true, x: gx + d * 1.2, z: MZ, vx: 0, vz: 0, spd: 0, eylem: null, tavir: null, penaltiTahmin: 0, yon: d > 0 ? 0 : Math.PI, zipla: null, yuk: 0 });
    Object.assign(at, { oyunda: true, x: bx - d * 0.35, z: bz, yon: d > 0 ? Math.PI : 0 });
    const L = Math.hypot(gx - bx, MZ - bz); Object.assign(df, { oyunda: true, x: bx + (gx - bx) / L * 2.2, z: bz + (MZ - bz) / L * 2.2, vx: 0, vz: 0 });
    Object.assign(b, { x: bx, z: bz, y: 0, vx: 0, vy: 0, vz: 0, egri: 0, ust: 0, sahip: at, tasiyan: null, sut: null, pas: null, agda: false, direk: false, hedefOyuncu: null, endirekt: null, tac: null, ofsaytta: null });
    b.px = b.x; b.py = b.y; b.pz = b.z; m.topDegisti();
    for (let k = 0; k < 90; k++) { m.t += dt; m.kare = (m.kare || 0) + 1; m.kaleciKonum(gk, dt); m.moveP(gk, dt); }
    at.eylem = { ad: 'vurus', faz: 'geri', t: 0, ft: 0, sec: { tur: 'sut', hx: gx, hz: MZ + h.tz * s }, ayak: 'sag', geri: 0.17 };
    for (let k = 0; k < 10; k++) { m.t += dt; m.kare = (m.kare || 0) + 1; m.kaleciKonum(gk, dt); m.moveP(gk, dt); }
    at.eylem = null; df.oyunda = false; df.x = -d * 30; df.z = -20;
    for (const a of AKTORLER) { a.px = a.kaynak.x; a.pz = a.kaynak.z; }
    TOP.px = b.x; TOP.py = b.y; TOP.pz = b.z;
    for (let k = 0; k < 30; k++) for (const a of AKTORLER) aktorGuncelle(a, 1, dt, m.tunel);
    const hx = gx, hz = MZ + h.tz * s, hy = h.ty, T = Math.hypot(hx - bx, hz - bz) / v * 1.06, ust = hy < 0.9 ? 0.08 : 0.02;
    const c = m.havadanCoz(bx, 0.11, bz, hx, hy, hz, T, 0, ust);
    b.sahip = null; b.y = 0.11; b.vx = c.vx; b.vy = c.vy; b.vz = c.vz; b.ust = ust; b.egri = 0;
    m.dokunus(at, true); at.oyunda = false; at.x = -d * 30; at.z = -25;
    b.sut = { team: 1 - t, by: at, gkDone: false, cerceve: m.cerceveyeGider(1 - t), xg: 0, t: m.t };
    KS.save = null; KS.gol = false; SONUC.sut++; let sonra = -1, sonuc = null;
    for (let k = 0; k < 240; k++) { macKare(dt);
      if (KS.gol) { sonuc = 'gol'; break; }
      if (KS.save && sonra < 0) sonra = 30;
      if (sonra >= 0 && --sonra <= 0) { sonuc = KS.save.catch ? 'tutus' : 'kurtaris'; break; }
      if (m.phase !== 'play') { sonuc = KS.save ? (KS.save.catch ? 'tutus' : 'kurtaris') : 'disari'; break; } }
    SONUC[sonuc || 'belirsiz']++;
  };
}"""

# T8e: yapay duran toplar (araclar/senaryolar/d-duran.js kalıbı): motorun gerçek duruşu (durusBaslat) oyunun içinde kurulur, kullanım olayına kadar
# (en çok 32 sn) ve sonra 6 sn maç karesi (motor + çizim) ilerler. Sırayla: korner (iki yan), barajlı serbest vuruş (19 ve 24 m), kenar, penaltı, uzun taç, kale vuruşu
DURAN_JS = r"""() => {
  const dt = 1 / 60, T = [['korner', 1, 0.4, 33.6], ['korner', 0, 0.4, -33.6], ['serbest', 1, 19, 0], ['serbest', 0, 24, -3], ['serbest', 1, 22, 16], ['penalti', 0, PENALTI_U, 0], ['tac', 1, 12, 33.9], ['kaleVurusu', 0, 5, -4]];
  const S = window.__DURAN_SONUC = { deneme: 0, kullanim: 0, turler: {} }; let kul = null;
  const eski = window.animasyonOlay; window.animasyonOlay = (ad, v) => { eski(ad, v); if (ad === 'kullanim' && v && v.du === window.__DURAN_DU) kul = v; };
  window.__duranDene = i => { const m = mac, [tur, t, u, w] = T[i % T.length], d = m.dir[t]; let x, z;
    if (tur === 'kaleVurusu') { x = -d * (PL - u); z = MZ + w; } else { x = d * (PL - u); z = MZ + w; }
    m.phase = 'play'; m.phaseT = 0; m.celeb = null; m.avantaj = null; for (const p of m.players) p.sevinc = false;   /* önceki denemenin golü: sevinç sıçraması taşınmasın */
    if (tur === 'korner') m.topuSifirla(x - d * 1.2, z - Math.sign(w) * 0.8); else if (tur === 'tac') m.topuSifirla(x, z < MZ ? -0.4 : PW + 0.4); else m.topuSifirla(x, z);
    const b = m.ball; b.px = b.x; b.py = b.y; b.pz = b.z;
    m.durusBaslat(tur, t, x, z, tur === 'serbest' ? { bekle: 1.0, duduk: true } : tur === 'penalti' ? { bekle: 0.3 } : undefined); window.__DURAN_DU = m.durus; kul = null;
    S.deneme++; S.turler[tur] = (S.turler[tur] || 0) + 1;
    for (let k = 0; k < 60 * 32 && !kul; k++) macKare(dt);
    if (kul) { S.kullanim++; for (let k = 0; k < 60 * 6 && (m.phase === 'play' || m.phase === 'goal'); k++) macKare(dt); } };
}"""

# T10f: yapay olaylar (motorun gerçek akışları oyunun içinde): sırayla tedavi, sedye (çıkış), kramp, zaman geçirmede uyarı, hakem topu, endirekt
# serbest vuruş (yüksek ayak), gol (golcünün sevinci; her denemede başka oyuncu), topallama (12 sn). Her deneme akış bitene ya da oyun dönene dek
# maç karesi (motor + çizim) ilerler
OLAY_JS = r"""() => {
  const dt = 1 / 60, S = window.__OLAY_SONUC = { deneme: 0, tur: {} };
  const ilerle = (sn, kosul) => { for (let k = 0; k < 60 * sn && !(kosul && kosul()); k++) macKare(dt); };
  window.__olayDene = i => { const m = mac, TUR = ['tedavi', 'cikis', 'kramp', 'uyari', 'hakemTopu', 'endirekt', 'gol', 'topal'], tur = TUR[i % TUR.length];
    if (m.phase !== 'play') ilerle(60, () => m.phase === 'play');
    if (m.phase !== 'play') return;
    m.gameSec = m.half === 1 ? 900 : 3600; m.uzatmaIlan = [false, false];   /* devre bitmesin (bitince sakatlık akışı ve topallama işlemez) */
    const t = Math.floor(i / TUR.length) % 2, T0 = m.teams[t], p = T0.filter(q => q.oyunda && q.rol !== 'GK' && !q.sakat)[(i * 3) % 7];
    if (!p) return; S.deneme++; S.tur[tur] = (S.tur[tur] || 0) + 1;
    if (tur === 'tedavi' || tur === 'cikis' || tur === 'kramp') {
      if (tur === 'cikis' && m.ist.degisiklik[t] >= 5) m.ist.degisiklik[t] = 4;
      m.sakatlikBaslat(p, tur === 'kramp' ? 'kramp' : 'temas', tur === 'kramp' ? 'baldir' : ['diz', 'kafa', 'bilek'][i % 3], tur === 'kramp' ? 'tedavi' : tur);
      ilerle(70, () => !m.sakatlikAkis && !m.sakatlikSira.length && !m.tedavideBekleyen.length && m.phase === 'play'); ilerle(2); }
    else if (tur === 'uyari') { m.zgUyari[t] = 0; const kA = m.kuralAdim;   /* motor adımının içinde (olay ve işaret aynı karede) */
      m.kuralAdim = function (d) { m.kuralAdim = kA; kA.call(this, d); const r = this.rast; this.rast = () => 0; this.zamanGecirmeGoruldu(p, 4); this.rast = r; }; ilerle(3); }
    else if (tur === 'hakemTopu') { const b = m.ball; m.hakemTopuBaslat(t, b.x, b.z, 'olcum'); ilerle(30, () => m.phase === 'play'); ilerle(2); }
    else if (tur === 'endirekt') { const b = m.ball, x = clamp(b.x, -35, 35), z = clamp(b.z, 8, 60), o = m.teams[1 - t].find(q => q.oyunda && q.rol !== 'GK');
      const kA = m.kuralAdim;   /* motor adımının içinde: olay motorun olay kuyruğundan (aynı kare) */
      m.kuralAdim = function (d) { m.kuralAdim = kA; kA.call(this, d); if (this.phase !== 'play') return;
        this.on('faul', { faulYapan: o, faulYiyen: p, takim: t, aleyhe: 1 - t, endirekt: true, x, z, kaynak: 'yuksekAyak', neden: 'yuksekAyak' });
        this.durusBaslat('serbest', t, x, z, { bekle: 1.0, endirekt: true, duduk: true }); };
      ilerle(1); ilerle(30, () => m.phase === 'play'); ilerle(4); }
    else if (tur === 'gol') { const b = m.ball, side = m.dir[t]; b.sahip = null; b.tasiyan = null; b.sonDokunan = p; b.sonTakim = t; b.endirekt = null; b.x = side * (PL + 0.3); b.z = MZ; b.y = 0.5;
      m.gol(side); ilerle(9); ilerle(40, () => m.phase === 'play'); }
    else if (tur === 'topal') { p.topal = { oran: 0.62 + 0.08 * ((i * 7) % 5) / 4, son: m.t + 14 }; ilerle(14); }
  };
}"""

# A6-0: yapay top saklama (araclar/senaryolar/c-koru.js kalıbı): güçlü saklayıcı forvet (sürüş ve sertlik 0,85) sırtı kaleye dönük, top ayağında; stoper
# 0,9 m kale tarafında (sertliği sırayla 0,8 / 0,3); destek orta saha 14 m geriden, ikinci savunmacı 12 m kale tarafından 4 m/sn ile gelir. Motorun kararı
# ve çizim maç karesiyle (macKare) en çok 5 sn ilerler (oyun durur ya da top başkasına geçerse biter). Işınlamadan önce ve yerleşmeden sonra ölçüm
# durumu unutulur. Yalnız kayma satırlarının "top saklama" bandı ve kaynağı anlamlıdır
KORU_JS = r"""() => {
  const dt = 1 / 60, S = window.__KORU_SONUC = { deneme: 0, koruSn: 0 };
  window.__koruDene = i => {
    const m = mac, d = m.dir[0], hy = d > 0 ? 0 : Math.PI, A = m.teams[0][9], M = m.teams[0][7], D = m.teams[1][3], D2 = m.teams[1][2], b = m.ball, kal = [A, M, D, D2];
    m.phase = 'play'; m.phaseT = 1; m.durus = null; m.avantaj = null; m.celeb = null; m.gameSec = 600;
    for (const r of m.refs) { r.x = 0; r.z = -25; r.tx = 0; r.tz = -25; }
    for (const p of m.players) { p.sevinc = false; if (kal.includes(p) || p.rol === 'GK') continue; p.oyunda = false; p.x = p.tx = -300; p.z = p.tz = -300; p.vx = p.vz = 0; p.eylem = null; }
    A.oz.surus = 0.85; A.oz.sertlik = 0.85; D.oz.sertlik = i % 2 ? 0.3 : 0.8; D.oz.mudahale = 0.6; D.oz.karar = 0.6; D.oz.gorus = 0.6; D2.oz.mudahale = 0.6;
    for (const q of kal) { q._kutle = 0; q._cev = null; q._hk = undefined; profilKur(q, m.tohum); }
    const yer = (p, x, z, yon, v) => Object.assign(p, { x, z, tx: x, tz: z, vx: Math.cos(yon) * v, vz: Math.sin(yon) * v, spd: v, yon, eylem: null, kickCd: 0, surus: null, kosu: null, oyunda: true, denge: 1, calim: null, yutma: null, tavir: null });
    const ax = d * (PL - 25), az = MZ + (i % 5 - 2) * 2.5;
    yer(A, ax, az, hy + Math.PI, 0); yer(D, ax + d * 0.9, az + (i % 2 ? 0.3 : -0.3), hy + Math.PI, 0);
    yer(M, ax - d * 14, az + (i % 3 - 1) * 2, hy, 4); yer(D2, ax + d * 12, az + (i % 2 ? -4 : 4), hy + Math.PI, 4);
    Object.assign(b, { x: ax - d * 0.35, z: az, y: 0, vx: 0, vz: 0, vy: 0, egri: 0, ust: 0, sahip: null, tasiyan: null, hedefOyuncu: null, sut: null, pas: null, sonTakim: 0, sonDokunan: A });
    b.px = b.x; b.py = b.y; b.pz = b.z; m.topDegisti(); m.sahipYap(A);
    window.__ANM_OLCUM_UNUT();
    for (const a of AKTORLER) { a.px = a.kaynak.x; a.pz = a.kaynak.z; }
    TOP.px = b.x; TOP.py = b.y; TOP.pz = b.z;
    for (let k = 0; k < 30; k++) for (const a of AKTORLER) aktorGuncelle(a, 1, dt, m.tunel);
    window.__ANM_OLCUM_UNUT();
    S.deneme++;
    for (let k = 0; k < 60 * 5; k++) { macKare(dt); if (A.tavir === 'koru') S.koruSn += dt; if (m.phase !== 'play' || (b.sahip && b.sahip !== A)) break; }
  };
}"""

BANT_AD = ["duran", "yürüyüş", "koşu", "hızlı", "depar"]


def v(x, n=1):
    if x is None:
        return "—"
    return f"{x:.{n}f}".replace(".", ",")


def satirlar(o):
    S = []
    S.append(f"A: ayak kayması % (eylemsiz temas karesi, bant): " + " · ".join(f"{BANT_AD[i]} {v(o['kayma'][i], 2)}" for i in range(1, 5)) + "   [hedef ≤5 / ≤5 / ≤15 / ≤15]")
    kk_ = o.get("kaymaKaynak")
    if kk_:
        f_ = lambda x: f"{x['n']} kare: salınım %{x['salinim']} · sürükleme %{x['surukle']} · bilek çapadan kopuk %{x.get('erisim', 0)} · bilek çapada, taban dönüyor %{x['sabit']}" if x else "—"
        kh_ = kk_.get("koruHiz")
        S.append("A: kayma kaynağı (A6-0; kayan karelerin payı): genel " + f_(kk_["genel"]) + " | " + " | ".join(f"{ad} {f_(kk_['durum'][i])}" for i, ad in enumerate(["dar dönüş", "ani duruş", "top saklama", "sıçrama yakını"]))
                 + (f" · top saklamada kayan tabanın hızı ortanca {v(kh_['med'], 2)}, p90 {v(kh_['p90'], 2)} m/sn" if kh_ else ""))
        ze_ = kk_.get("zEvre") or {}
        S.append("A:   sıçrama yakını evreye göre (A6a; kayma %, temas): " + " · ".join(f"{ad} " + (f"%{v(ze_[k]['pay'])} ({ze_[k]['n']})" if ze_.get(k) else "—") for k, ad in [("hazB", "barajın hazırlığı"), ("haz", "açık oyunda hazırlık"), ("inis", "iniş (0,12 sn'den sonra)")]))
    oa_ = o.get("onculukAlt")
    if oa_:
        g_ = lambda x: f"{x['n']} dönüş, ortanca {x['med']} ms (p10 {x['p10']}), ≥ 150 ms %{x['p150']}" if x else "—"
        S.append("A: baş öncülüğü başlangıç hizasına göre (A6-0): hizalı (|baş − gövde| ≤ 0,35) " + g_(oa_.get("hizali")) + " · önde başlayan " + g_(oa_.get("onde")) + " · ters başlayan " + g_(oa_.get("ters")) + "   [A6b: hizalıda ≥ 150 ms ≥ %50]")
    bl_ = o.get("blok")
    if bl_:
        h_ = lambda x: f"{x['n']} — ortanca {v(x['med'], 3)} m, ≤ 0,15 %{v(x['ic'])}" if x else "—"
        S.append(f"A: blok teması (A6-0): şut bloğu {bl_['n']} (top ≥ 0,8 m {bl_['ust']}) · çizilen ayağın topa açıklığı: motorun temas uzaklığı ≤ 0,6 m " + h_(bl_.get("yakin")) + " · > 0,6 m " + h_(bl_.get("uzak")) + " · hepsi " + h_(bl_.get("hepsi")) + "   [A6c: ≤ 0,15 ≥ %90]")
    kd = o.get("kaymaDurum")
    if kd:
        S.append("A: ayak kayması % durumlara göre (bilgi; aynı tanım): " + " · ".join(f"{ad} {v(kd[i]['pay'], 2)} ({kd[i]['n']} temas)" if kd[i] else f"{ad} —" for i, ad in enumerate(["dar dönüş", "ani duruş", "top saklama", "sıçrama yakını"][:len(kd)])))
    yp = lambda d, i: f"{v(d[i]['ort'], 3)}/{v(d[i]['p90'], 3)}" if d[i] else "—"
    S.append(f"A: adım başına kayma (m; yerdeki ayağın temas boyunca yolu / net yer değiştirmesi, ort/p90): " + " · ".join(f"{BANT_AD[i]} {yp(o['adimYol'], i)} | {yp(o['adimNet'], i)}" for i in range(1, 5)) + "   [hedef yürüyüş ≤0,03, depar ≤0,08]")
    S.append(f"A: kadans (adım/sn, ort [p10–p90] n): " + " · ".join(f"{BANT_AD[i]} {v(o['kadans'][i]['ort'], 2)} [{v(o['kadans'][i]['p10'], 2)}–{v(o['kadans'][i]['p90'], 2)}] {o['kadans'][i]['n']}" if o['kadans'][i] else f"{BANT_AD[i]} —" for i in range(1, 5)) + "   [hedef 1,6–2,2 / 2,5–3,0 / 3,0–3,6 / 3,5–4,2]")
    S.append(f"A: uçuş evresi % (iki ayak havada): " + " · ".join(f"{BANT_AD[i]} {v(o['ucus'][i])}" for i in range(1, 5)) + "   [hedef yürüyüşte 0, koşuda var]")
    S.append(f"A: sıçrama /oyuncu·dk: üst gövde >10° {v(o['sicramaUstdk'], 2)} · bacak >20° {v(o['sicramaBacakdk'], 2)} · eylemde >20° {v(o['sicramaEylemdk'], 2)} · kalça >3 cm {v(o['sicramaDydk'], 2)} · kök >10° {v(o['kokSicramadk'], 2)}   [hedef ~0]")
    S.append(f"A: kırılma (ikinci fark) /oyuncu·dk: üst gövde >0,06 {v(o['kirilmaUstdk'])} · bacak >0,2 {v(o['kirilmaBacakdk'])} (%{o.get('kirilmaBacakGecisPay')} basma/kalkma anında) · baş dönüş hızı (dünya) p99 {o['basHizP99']}°/sn, en çok {o['basHizMax']}°/sn, >600°/sn {v(o['basHiz600dk'], 2)} /oyuncu·dk · gövdeye göre p99 {o.get('basGovdeP99')}°/sn · kök p99 {o.get('kokHizP99')}°/sn   [hedef baş ≤400°/sn]")
    ks = sorted(o["kanalSicrama"].items(), key=lambda x: -x[1])[:6]
    if ks:
        S.append("A:   sıçrayan kanallar: " + ", ".join(f"{k} {n}" for k, n in ks) + f" · eylemsiz kalça >3 cm {v(o.get('dyEylemsizdk'), 2)} /oyuncu·dk")
    ke = sorted((o.get("kanalSicramaEylem") or {}).items(), key=lambda x: -x[1])[:8]
    if ke:
        S.append("A:   eylemde sıçrayan kanal@eylem: " + ", ".join(f"{k} {n}" for k, n in ke))
    kk = sorted((o.get("kanalKirilma") or {}).items(), key=lambda x: -x[1])[:8]
    if kk:
        S.append("A:   kırılan kanallar: " + ", ".join(f"{k} {n}" for k, n in kk))
    S.append(f"A: baş: |baş–gövde| en çok {o['basMaxDer']}°, >70° kare payı %{v(o['bas70'], 2)}, eğim en çok {o['basPitchMaxDer']}° · dönüşte baş öncülüğü ortanca {o['onculukMs'] if o['onculukMs'] is not None else '—'} ms (p10 {o['onculukP10'] if o['onculukP10'] is not None else '—'}), ≥ 150 ms olan %{o.get('onc150') if o.get('onc150') is not None else '—'}   [hedef ≤80°, ≥150 ms; A3: ≥ 150 ms dönüşlerin ≥ %60'ı]")
    df = o.get('donusFren')
    S.append(f"A: dönüş: 90°+ dönüş {o['donus90']}, basma ort {v(o['donusAdim'], 2)}, basmasız %{v(o['donusAdimsizPay'])} · yerinde dönüşte iki ayak yerde %{v(o['yerindeAdimsizPay'])} ({o['yerindeDonusKare']} kare)"
             + (f" · koşarken fren adımı payı %{df['pay']} (temas ÷ koşu {v(df['oran'], 2)}, {df['n']} dönüş; gidiş ≥ 60° değişen kesmede %{df.get('kPay')}, ÷ {v(df.get('kOran'), 2)}, {df.get('kN')} dönüş)" if df else "")
             + (" · yerinde dönüş türe göre: " + ", ".join(f"{k} %{round(100*x[1]/max(1,x[0]))} ({x[0]})" for k, x in (o.get('yerindeDonusTur') or {}).items())) + "   [hedef basmasız 0; A3: iki ayak yerde ≤ %30, fren adımı ≥ %60]")
    dt_ = o.get('donusTani')
    if dt_:
        n_ = max(1, dt_['n']); S.append(f"A:   yerinde dönüş tanı (saha): piv ort {dt_['piv']/n_:.2f}, piv > 0,3 %{100*dt_['piv3']/n_:.0f}, adım sıklığı ort {dt_['cad']/n_:.2f}, hız ort {dt_['v']/n_:.2f}, beta ort {dt_.get('beta',0)/n_:.2f}, yüksekteki ayak (m; p10/25/50/75/90) {dt_.get('ustY')} · iki ayak yerde {dt_['iki']} kare, bunların piv > 0,3 olanı {dt_['ikiPiv']}")
    bu = o.get('basUc')
    if bu:
        S.append("A: baş — en hızlı dönüşler (°/sn; kök dönüşü, gövdeye göre baş önce→sonra, hız, kip): " + " · ".join(f"{x['w']} (kök {x['kok']}, baş {v(x['byO'], 2)}→{v(x['by'], 2)}, kalça Δ{x.get('hy')}, gövde Δ{x.get('gy')}, {v(x['v'])} m/sn, {x['kip']} {x.get('tv','')} {x.get('jest','')})" for x in bu))
    fr = o.get('fren'); fa = o.get('frenAdimOran')
    if fr:
        S.append(f"A: fren (A3): {fr['n']} fren / {fr['sn']} sabit koşu karesi (çizimin fren ağırlığı ort {v(fr.get('fr'), 2)}) — kalça (dy) {v(fr['dy'], 3)} / {v(fr['dyS'], 3)} · kol yana (|aLz|) {v(fr['kol'], 3)} / {v(fr['kolS'], 3)}"
                 f" · gövde eğimi {v(fr['egim'], 3)} / {v(fr['egimS'], 3)} · yerdeki ayak kökün önünde {v(fr['ayak'], 3)} / {v(fr['ayakS'], 3)} m · kalça aynı hızdaki sabite göre {v(o.get('frenDyFark'), 3)} m"
                 + (f" · adım boyu frende × aynı hızda sabitin {v(fa['oran'], 2)} ({fa['n']} / {fa['ns']} adım)" if fa else "") + "   [A3: frende kalça ≥ 3 cm alçak, kol açık, ayak önde, adım ≤ 0,8]")
    S.append(f"A: kimlik (koşu bandı, {o['kimlikN']} oyuncu): adım boyu CV %{v(o['kimlikBoyCv'])} · kol genliği CV %{v(o['kimlikKolCv'])}   [hedef ≥8 / ≥20]")
    S.append(f"A: bekleyiş: {o['bekleKare']} kare, donuk %{v(o['bekleDonuk'])}, ikiz poz %{v(o['ikizPay'], 2)}   [hedef donuk ~0, ikiz ~0]")
    S.append(f"A: düzgünlük (SPARC, baş hızı, 3 sn, n {o['sparcN']}): ort {v(o['sparcOrt'], 2)} · p10 {v(o['sparcP10'], 2)}")
    z = o.get("zaman")
    if z:
        S.append(f"A: zamanlama: hakem işareti {z['olay']} olay — aynı karede {z['ayni']}, bir adım sonra {z['bir']} {z.get('birAd') or ''}, başlamayan {z['yok']} {z['yokAd'] or ''} · vuruş {z['vurus']} temas — çizimin temas evresi aynı karede {z['vurusAyni']}   [hedef sapma 0]")
    k = o.get("vk")
    if k:
        S.append(f"A: vuruş (T4-V): {k['n']} temas — hazırlıksız (son adım < 0,8·tB) %{v(k['hazirliksizPay'])} · son adım/tB ort {v(k['sonAdimOrt'], 2)}, ≥ 0,8 olan %{v(k['sonAdimIyiPay'])} · geri salınım tepe/plan ortanca {v(k['tepeMed'], 2)} · ilk görülme temasta {k['ilkTakip']}"
                 f" · karar→temas ortanca (sn) pas {v(k['ktPas'], 2)} / şut {v(k['ktSut'], 2)} / uzun {v(k['ktUzun'], 2)} / gelişine {v(k['ktIlk'], 2)} · evre sınırı dışı >20° sıçrama {v(k['disiVurus'], 2)}/vuruş · kararsız kare {k['kararsiz']}"
                 f"   [hedef ≤5 / ≥90 / ≥0,85 / 0 / pas 0,40–0,55 / bilgi / 1×'te 0 (hız katlarında dondurulmuş A2b'de de aynı: araç ya da ortak kod, bilgi)]")
        if k.get("disiEvre"):
            S.append("A:   vuruşta >20° sıçrama evre:kanal (1 hazırlık, 2g geri salınım, 2a aşağı salınım, 3 takip, 4 iniş, 5 çıkış; evre kare sayısı " + ", ".join(f"{e} {n}" for e, n in sorted((k.get("evreKare") or {}).items())) + "): " + ", ".join(f"{c} {n}" for c, n in k["disiEvre"]))
        if k.get("kararsizKanal"):
            S.append("A:   kararsız kanallar: " + ", ".join(f"{c} {n}" for c, n in k["kararsizKanal"]))
    c = o.get("ck")
    if c:
        ad = " · ".join(f"{h} {n}" for h, n in sorted(c["N"].items(), key=lambda x: -x[1])) or "—"
        S.append(f"A: çalım (T4g): {c['bas']} hazırlık ({ad}) — hazırlık çizimi aynı karede {c['basAyni']}/{c['bas']}{' ' + str(c['basFark']) if c['basFark'] else ''}"
                 f" · itiş pozu aynı karede {c['itAyni']}/{c['it']} · makasta ayak topun yanına ≥ 0,35 m {c['makasIyi']}/{c['makasN']} (yanal ortanca {v(c['makasMed'], 2)} m)"
                 f" · aldatılan savunmacının gövdesi yanılgı yanında {c['yutGor']}/{c['yut']} · top saklama {v(c['korSn'])} oyuncu·sn: doğru yan %{v(c['korDogru'])}, yan değişimi {v(c['korDegisSn'], 2)}/sn"
                 f"   [hedef N/N / M/M / ≥%90 / ≥%80 / ≥90 / ≤1]")
    tm = o.get("tm")
    if tm:
        S.append(f"A: temas (T5f): müdahale topa {tm['n']} — çizilen ayağın topa açıklığı ortanca {v(tm['acikMed'], 3)} m (p90 {v(tm['acikP90'], 3)}), ≤ 0,15 olan %{v(tm['acikIyi'])}"
                 f" · ayakta gövdeler iç içe (< 0,3 m) {tm['icIce']} kare / {tm['cift']} yakın çift-kare · kalkış sonunda dik {tm['kalkDik']}/{tm['kalkN']}"
                 f" · tökezleme: sendele {tm['sendKare']} kare, kısa adım %{v(tm['sendKisaPay'])} · düşüş {tm['dususN']}   [hedef ≤0,15 / ~0 / N/N / bilgi]")
    hv = o.get("hv")
    if hv:
        yz = " / ".join(f"{k} {n}" for k, n in sorted((hv.get("yz") or {}).items()))
        S.append(f"A: hava (T6f): kafa {hv['n']} — çizilen başın topa açıklığı ortanca {v(hv['acikMed'], 3)} m (p90 {v(hv['acikP90'], 3)}), ≤ 0,15 olan %{v(hv['acikIyi'])}"
                 f" · sıçrayarak %{v(hv['sicPay'])} · yüzey {yz or '—'} · havada gövdeler iç içe (< 0,5 m) {hv['icIce']} kare / {hv['cift']} havadaki çift-kare"
                 f" · tam plonjon {hv.get('pl', 0)} (başın topa açıklığı ortanca {v(hv.get('plAcikMed'), 3)} m; yere inişte gövde yatay {hv.get('plInisYatay', 0)}/{hv.get('plInisN', 0)})"
                 f"   [hedef ≤0,15 / bilgi / bilgi / ~0 / T14e: plonjonda ≤0,15, iniş N/N]")
    sz = lambda d: " / ".join(f"{k} {n}" for k, n in sorted((d or {}).items())) or "—"
    kr = o.get("kr")
    if kr:
        S.append(f"A: kurtarış (T9b-e): elle temas {kr['n']} — çizilen eldivenin topa açıklığı ortanca {v(kr['acikMed'], 3)} m (p90 {v(kr['acikP90'], 3)}), ≤ 0,15 olan %{v(kr['acikIyi'])}"
                 f" · eylem {sz(kr['tur'])} · el {sz(kr['el'])} · dalış evresi motorla aynı %{v(kr['faz'])} · yana adım {kr['yanAdim']} kare · kapanma {sz(kr['kapan'])}"
                 f" · kurtarışta temas parçası {sz(kr['parca'])}"
                 f" · T15d tutuşun türü: poz motorla aynı {kr.get('tutAyni', 0)}/{kr.get('tutN', 0)}, geometri {kr.get('tutGeo', 0)}/{kr.get('tutN', 0)} ({sz(kr.get('tutTur'))})"
                 f" · planlı çelmede el topun itilen yanının tersinde {kr.get('celIyi', 0)}/{kr.get('celN', 0)} (takibin gövdeye göre açısı ortanca {v(kr.get('celAciMed'))}°, bilgi)"
                 f"   [hedef ≤0,15 / bilgi / bilgi / 100 / bilgi / T15d: ≥ %90, ≥ %90, ≥ %90]")
        if kr.get('tutKotu'):
            S.append("A:   tutuş geometrisi tutmayan (tür, çizilen, eller y, top merkezi y, aralık, kalça y): " + json.dumps(kr['tutKotu'], ensure_ascii=False))
        if kr.get("kaleci"):
            S.append("A:   kaleci düzeneği (yapay şut): " + sz(kr["kaleci"]))
    dr = o.get("dr")
    if dr and (dr["bjKare"] or dr["yerN"] or dr["tacN"] or dr["penN"] or dr["kolN"]):
        S.append(f"A: duran top (T8e): baraj uçuşu {dr['bjKare']} kare — çizim fazlası (yEk > 0,05) %{v(dr['bjFazla'])}, baraj pozu %{v(dr['bjPoz'])}, duruşta çizim sıçraması {dr['bjOnce']} kare"
                 f" · yerleştirme {dr['yerN']}, ağırlık > 0,5 görüldü {dr['yerIyi']} · korner kol jesti ≥ 0,5 sn {dr['kolIyi']}/{dr['kolN']} · taç bırakışında kollar öne {dr['tacTepe']}/{dr['tacN']} (uzun {dr['tacUzun']})"
                 f" · penaltıda kaleci kalkışı temasa ortanca {v(dr['penMed'], 3)} sn, [−0,15, +0,02] içinde {dr['penIcinde']}/{dr['penN'] - dr['penOrta'] - dr.get('penKan', 0)} (ortada kalan {dr['penOrta']}, başlamayan {dr['penYok']}, T15c duraklamada kanan {dr.get('penKan', 0)})"
                 f" · T15d duraklı koşuda tereddüt pozu {dr.get('dkIyi', 0)}/{dr.get('dkN', 0)} · duruşta kutuda gövdeler iç içe {dr['icIce']} kare"
                 f"   [hedef 0 / ≥90 / 0 / N/N / N/N / N/N / N/N / ~0]")
        if dr.get("duran"):
            S.append("A:   duran top düzeneği (yapay): " + json.dumps(dr["duran"], ensure_ascii=False))
    vs = o.get("vs")
    if vs:
        st = " · ".join(f"{k} {r[1]}/{r[0]}" for k, r in sorted(vs["stil"].items()))
        kt = " · ".join(f"{k} {r['uyumlu']}/{r['n']} (açıklık {v(r['acik'], 2)}, yükseklik {v(r['dy'], 2)}, yan {v(r['yan'], 2)})" for k, r in sorted(vs["kotu"].items())) or "—"
        S.append(f"A: vuruş stili (T9b-e): temas {vs['n']} — çizimin pozu motorun stiline uyan {vs['ayni']}/{vs['n']} ({st}) · kötü vuruşta ayağın topa göre yeri türle uyumlu: {kt}"
                 f" · normal vuruş: açıklık {v(vs['normalAcik'], 2)}, yükseklik {v(vs['normalDy'], 2)}, yan {v(vs['normalYan'], 2)} (n {vs['normalN']})   [hedef ≥%90 / N/N]")
    ol = o.get("ol")
    if ol and (ol["sakKare"] or ol["endKare"] or ol["topalN"] or ol["sevCesit"] or ol["birakN"]):
        sev = " ".join(f"{k}:{n}" for k, n in sorted(ol["sev"].items()))
        S.append(f"A: olay (T10f): sakatın tutma pozu %{v(ol['sakPoz'])} ({ol['sakKare']} kare) · sedyede kök 0,55–0,9 m %{v(ol['sedYuk'])} ({ol['sedKare']} kare), sedyeyi tutan sağlıkçı %{v(ol['sedTut'])}"
                 f" · tedavide sağlıkçı çömelik/gerdirir %{v(ol['tedPoz'])} ({ol['tedKare']} kare; gerdirme {ol['gerdir']}, çömelmenin altında {ol.get('gerdirOrtulu', 0)}) · topallama basma oranı {v(ol['topalOran'], 2)} ({ol['topalN']} kare)"
                 f" · endirekt işaret tutuldu %{v(ol['endTut'])} ({ol['endKare']} kare) · hakem topu bırakma aynı karede {ol['birakAyni']}/{ol['birakN']} · golcü sevinci {ol['sevCesit']} çeşit ({sev or '—'})"
                 f"   [hedef ≥90 / ≥90 / ≥80 / ≥80 / 0,55–0,75 / ≥90 / N/N / ≥5]")
        if ol.get("olay"):
            S.append("A:   olay düzeneği (yapay): " + json.dumps(ol["olay"], ensure_ascii=False))
    S.append(f"A: süre: aktorGuncelle {v(o['sureMs'], 3)} ms/kare (p99 {v(o['sureP99'], 3)}) · {o['kare']} kare, {v(o['oyuncuDk'])} oyuncu·dk · animasyon: {o['surum']}   [hedef ≤2 ms]")
    return S


async def olc(a):
    from playwright.async_api import async_playwright
    site = kopya_hazirla(yerel_three() if a.eski_kimlik else kimlik_ayri_three())
    hatalar = []
    try:
        async with async_playwright() as p:
            tarayici = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
            baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
            await baglam.add_init_script(BASLANGIC_JS % a.tohum)
            pg = await baglam.new_page()
            pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
            pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
            await pg.goto((site / "index.html").as_uri() + f"?ekran=mac&tohum={a.tohum}" + (a.ek or ""))
            await pg.wait_for_selector("#btnMacaGec", timeout=30000)
            await pg.evaluate("__kare(2)")
            if a.ayar:
                # H1 (2026-10-15): motor ayarlarını kodu değiştirmeden aç/kapat (mac-deneme.js MAC_DENEME_AYAR karşılığı; bilinmeyen anahtar hata)
                bil = await pg.evaluate("(o) => { const b = Object.keys(o).filter(k => !(k in MOTOR_AYAR)); Object.assign(MOTOR_AYAR, o); return b; }", json.loads(a.ayar))
                if bil:
                    raise SystemExit("bilinmeyen MOTOR_AYAR anahtarı: " + ", ".join(bil))
                print(f"MOTOR_AYAR: {a.ayar}")
            if a.anm:
                # A6 (2026-10-17): çizim ayarlarını (STIL.animasyon) kodu değiştirmeden aç/kapat — iç içe nesneler birleşir (ör. '{"koru":{"dokunus":0}}')
                await pg.evaluate("(o) => { const f = (t, s) => { for (const k in s) { if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && t[k] && typeof t[k] === 'object') f(t[k], s[k]); else t[k] = s[k]; } }; f(STIL.animasyon, o); }", json.loads(a.anm))
                print(f"STIL.animasyon: {a.anm}")
            if a.once:
                await pg.evaluate(YUKLE.read_text(encoding="utf-8") + "\n;window.anmOnceYukle = anmOnceYukle; true;")
                n = await pg.evaluate("(s) => anmOnceYukle(window, s)", (KARSILASTIR / a.once / "animasyon.js").read_text(encoding="utf-8"))
                await pg.evaluate(f"window.ANM_SURUM = {json.dumps(a.once)}")
                print(f"önce animasyonu yüklendi ({a.once}, {n} aktör)")
            await pg.evaluate("macaGecIste(); document.getElementById('btnMacaGec').hidden = true;")
            await pg.evaluate(OLCUM_KUR_JS)
            if a.kotu:
                await pg.evaluate("MOTOR_AYAR.kotuVurus = [0.5, 0.5]")
                print("kötü vuruş olasılığı tavanda (MOTOR_AYAR.kotuVurus 0,5; yalnız vuruş stili satırı anlamlıdır)")
            if a.kaleci:
                await pg.evaluate(KALECI_JS)
                for i in range(0, a.kaleci, 8):
                    await pg.evaluate(f"(() => {{ for (let i = {i}; i < Math.min({a.kaleci}, {i + 8}); i++) __kaleciDene(i); }})()")
                print(f"kaleci düzeneği: {a.kaleci} yapay şut (yalnız kurtarış satırı anlamlıdır)")
                a.sure = 0
            if a.koru:
                await pg.evaluate(KORU_JS)
                for i in range(a.koru):
                    await pg.evaluate(f"__koruDene({i})")
                kr_ = await pg.evaluate("window.__KORU_SONUC")
                print(f"top saklama düzeneği: {a.koru} yapay sahne, tavır 'koru' {kr_['koruSn']:.1f} sn (yalnız kaymanın 'top saklama' bandı ve kaynağı anlamlıdır)")
                a.sure = 0
            if a.duran:
                await pg.evaluate(DURAN_JS)
                for i in range(a.duran):
                    await pg.evaluate(f"__duranDene({i})")
                print(f"duran top düzeneği: {a.duran} yapay duran top (yalnız duran top satırı anlamlıdır)")
                a.sure = 0
            if a.olay:
                await pg.evaluate(OLAY_JS)
                for i in range(a.olay):
                    await pg.evaluate(f"__olayDene({i})")
                print(f"olay düzeneği: {a.olay} yapay olay (sakatlık, sedye, kramp, uyarı, hakem topu, endirekt, gol, topallama; olay satırı)")
                a.sure = 0
            if a.hiz != 1:
                # U1: etkin hız seçimden hesaplanır (izlemeHizi); sabit hız için seçim yazılır, önemli anda yavaşlama kapatılır
                await pg.evaluate(f"MAC_HIZ.oto = false; MAC_HIZ.secim = {a.hiz}; MAC_HIZ.deger = {a.hiz}")
                print(f"oynatma hızı {a.hiz}× (kare başına {a.hiz} motor adımı; yalnız vuruş/zamanlama satırları anlamlıdır)")
            kalan = a.sure
            while kalan > 0:
                parca = min(10, kalan)
                await pg.evaluate(f"(() => {{ for (let i = 0, N = Math.round({parca} * 60); i < N; i++) macKare(1 / 60); }})()")
                kalan -= parca
            o = await pg.evaluate(SONUC_JS)
            await tarayici.close()
    finally:
        shutil.rmtree(site.parent, ignore_errors=True)
    return o, hatalar


def ana():
    ap = argparse.ArgumentParser(description="Chairman animasyon ölçümü")
    ap.add_argument("--tohum", type=int, default=3)
    ap.add_argument("--sure", type=float, default=180)
    ap.add_argument("--once", default=None, choices=sorted(d.name for d in KARSILASTIR.iterdir() if (d / "animasyon.js").is_file()),
                    help="dondurulmuş animasyon: araclar/karsilastir/<ad>/animasyon.js (turun başında dondur.js <ad>)")
    ap.add_argument("--json")
    ap.add_argument("--ayar", default=None, help="H1: MOTOR_AYAR üzerine JSON (ör. '{\"govdeDinamik\":0}'; aynı kodla önce/sonra)")
    ap.add_argument("--anm", default=None, help="A6: STIL.animasyon üzerine JSON (iç içe birleşir; ör. '{\"koru\":{\"dokunus\":0}}'; çizimi kodu değiştirmeden aç/kapat)")
    ap.add_argument("--karsilastir")
    ap.add_argument("--ek", default=None, help="adrese ek parametreler (A5: '&model=kutu' ile eski kutu modeli; an-yakala.py --ek gibi)")
    ap.add_argument("--eski-kimlik", dest="eski_kimlik", action="store_true",
                    help="A5 öncesi: Three.js nesne kimlikleri tohumlu Math.random'dan çeker (t15-anm, h1-anm ve önceki tabanlar bu kipte üretildi)")
    ap.add_argument("--hiz", type=int, default=1, choices=[1, 2, 4, 8, 16], help="oynatma hızı (MAC_HIZ; T4-V: hız katlarında vuruş katmanının kararlılığı)")
    ap.add_argument("--kaleci", type=int, default=0, help="T9b-e: kaleye N yapay şut (d-sut kalıbı; maç oynanmaz; yalnız kurtarış satırı anlamlıdır)")
    ap.add_argument("--kotu", action="store_true", help="T9b-e: kötü vuruş olasılığı tavana (yalnız vuruş stili satırı anlamlıdır)")
    ap.add_argument("--olay", type=int, default=0, help="T10f: N yapay olay (sakatlık, sedye, kramp, uyarı, hakem topu, endirekt, gol, topallama sırayla; maç oynanmaz, yalnız olay satırı anlamlıdır)")
    ap.add_argument("--koru", type=int, default=0, help="A6-0: N yapay top saklama sahnesi (c-koru kalıbı; maç oynanmaz; yalnız kaymanın 'top saklama' bandı ve kaynağı anlamlıdır)")
    ap.add_argument("--duran", type=int, default=0, help="T8e: N yapay duran top (korner, serbest vuruş, penaltı, taç, kale vuruşu sırayla; maç oynanmaz; yalnız duran top satırı anlamlıdır)")
    a = ap.parse_args()
    try:
        import playwright  # noqa: F401
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright==1.56.0")
    o, hatalar = asyncio.run(olc(a))
    o["tohum"], o["sure"], o["kimlik"] = a.tohum, a.sure, "eski" if a.eski_kimlik else "ayri"
    if a.ek:
        o["ek"] = a.ek
    S = satirlar(o)
    if a.karsilastir:
        e = json.loads(pathlib.Path(a.karsilastir).read_text(encoding="utf-8"))
        S.append(f"--- karşılaştırma: {a.karsilastir} (animasyon {e.get('surum')}, tohum {e.get('tohum')}, {e.get('sure')} sn) ---")
        if e.get("kimlik", "eski") != o["kimlik"]:
            S.append(f"  uyarı: Three.js kimlik kipi farklı (önce {e.get('kimlik', 'eski')}, şimdi {o['kimlik']}): çizimin rastlantısı (adım fazı) kayar, "
                     f"aynı kodda da satırlar oynar — A5 öncesi tabanla --eski-kimlik")
        S += ["  önce " + x[3:] for x in satirlar(e)]
    for x in S:
        print(x)
    for h in hatalar:
        print("  ! " + h)
    RAPOR.write_text("\n".join(S + ["", json.dumps(o, ensure_ascii=False, indent=1)]) + "\n", encoding="utf-8")
    if a.json:
        pathlib.Path(a.json).parent.mkdir(parents=True, exist_ok=True)
        pathlib.Path(a.json).write_text(json.dumps(o, ensure_ascii=False), encoding="utf-8")
        print(f"kaydedildi: {a.json}")
    sys.exit(1 if hatalar else 0)


if __name__ == "__main__":
    ana()
