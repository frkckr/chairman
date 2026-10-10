#!/usr/bin/env python3
"""Chairman — animasyon ölçümü (A2, 2026-10-08; gerçekçilik planı Ek G9)

Maçı başsız Chromium'da tohumlu ve sanal saatle oynatır; her karede js/animasyon.js'in ürettiği pozu (aktorGuncelle'nin sonucunu)
dışarıdan okur ve ölçer. Animasyon dosyasına ölçüm kodu girmez: araç aktorGuncelle'yi ve macKare'yi sarar. Motor değişmez.

Kullanım:
  python araclar/animasyon-olcum.py                      # şimdiki animasyon, tohum 3, 180 sn oyun
  python araclar/animasyon-olcum.py --once t5            # dondurulmuş "önce" animasyonu (araclar/karsilastir/t5/animasyon.js; dondur.js üretir)
  python araclar/animasyon-olcum.py --json araclar/taban/t7-anm.json        # sonucu kaydet (tur kapanışında turun animasyon tabanı)
  python araclar/animasyon-olcum.py --karsilastir araclar/taban/t7-anm.json # kayıtlı sonuçla yan yana
  Seçenekler: --tohum N · --sure S (oyun saniyesi; varsayılan 180)

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
Çıktı: ekrana "A:" satırları; tam rapor araclar/son-animasyon.txt (Git dışında).
"""
import argparse
import asyncio
import json
import pathlib
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from kontrol import KOK, yerel_three, kopya_hazirla  # noqa: E402

RAPOR = KOK / "araclar" / "son-animasyon.txt"
KARSILASTIR = KOK / "araclar" / "karsilastir"
YUKLE = KOK / "araclar" / "karsilastir" / "once-yukle.js"

BASLANGIC_JS = """
(() => {
  let s = %d >>> 0;
  Math.random = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
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
       3 m/sn²'den hızlı düşüyor), top saklama (tavır 'koru'); aynı tanımla (eylemsiz temas karesi, 0,2 m/sn) */
    dTemas: [0, 0, 0], dKayma: [0, 0, 0],
    /* T5f temas (Ek G9 "Temas"): müdahalenin temas karesinde (mudahaleSonuc, topa değdi) çizilen uzanan ayağın (taban ortası) topa açıklığı (merkeze
       uzaklık − yarıçap); ayakta iki oyuncunun çizilen gövdeleri 0,3 m'den yakın (iç içe) kare sayısı / 1 m içindeki çift-kare; kalkışın son karesinde
       kök yatış açısı ≤ 0,05 rad; tökezleme (sendelerken adım boyu çarpanı < 0,7); düşüş sayısı */
    tm: { n: 0, acik: [], icIce: 0, cift: 0, kalkN: 0, kalkDik: 0, sendKare: 0, sendKisa: 0, dususN: 0 } };
  const HK_OLAY = { faul: 'ref', avantaj: 'ref', ofsayt: 'ikisi', korner: 'ikisi', kaleVurusu: 'ikisi', tac: 'biri', kickoff: 'ref', duduk: 'ref', degisiklik: 'lin' };
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
    kimlik: { boy: [], kol: [] } });
  function kaydet(a, dt) {
    const p = a.kaynak; if (!p || !(dt > 0) || p.tur !== 'oyuncu' || !p.oyunda || !a.m.root.visible) return;
    let k = K.get(a); if (!k) K.set(a, k = yeni(a));
    const P = a.P, e = p.eylem ? p.eylem.ad : '', eylemsiz = !e;
    const v = Math.hypot(a.x - k.x, a.z - k.z) / dt, vsOnce = k.vs; k.x = a.x; k.z = a.z; k.vs += (Math.min(v, 12) - k.vs) * Math.min(1, dt * 8);
    const durum = !k.ilk && p.tavir === 'koru' ? 2 : !k.ilk && Math.abs(aciF(a.yaw, k.yawU)) / dt > 2 && k.vs > 0.6 ? 0 : !k.ilk && (vsOnce - k.vs) / dt > 3 ? 1 : -1;
    const b = BANT(k.vs);
    a.m.root.updateMatrixWorld(true);
    const yer = [false, false];
    /* temas histerezisli: taban 0,02 m altına inince basar, 0,025 m üstüne çıkınca kalkar; ilk iki temas karesi (iniş) kaymaya sayılmaz */
    for (let i = 0; i < 2; i++) {
      V.set(0, -0.5, 0.05).applyMatrix4((i ? a.m.kR : a.m.kL).matrixWorld); const c = k.temas[i] ? V.y < 0.025 : V.y < 0.02; yer[i] = c;
      if (!k.ilk) {
        if (c && k.temas[i]) { k.tn[i]++; const d = Math.hypot(V.x - k.ayak[i][0], V.z - k.ayak[i][1]); k.yol[i] += d; if (!eylemsiz) k.epEylem[i] = true;
          if (eylemsiz && k.tn[i] > 2) { S.temas[b]++; if (d / dt > 0.2) S.kayma[b]++; if (durum >= 0) { S.dTemas[durum]++; if (d / dt > 0.2) S.dKayma[durum]++; } } }
        if (c !== k.temas[i]) k.gecis[i] = S.kare;
        if (c && !k.temas[i]) { k.yol[i] = 0; k.tn[i] = 0; k.bas0[i][0] = V.x; k.bas0[i][1] = V.z; k.basVar[i] = true; k.epEylem[i] = !eylemsiz; k.pen.bas.push(t); }
        if (!c && k.temas[i] && k.basVar[i] && !k.epEylem[i] && k.tn[i] > 2) { S.adimYol[b].push(k.yol[i]); S.adimNet[b].push(Math.hypot(k.ayak[i][0] - k.bas0[i][0], k.ayak[i][1] - k.bas0[i][1])); }
      }
      k.ayak[i][0] = V.x; k.ayak[i][1] = V.z; k.temas[i] = c;
    }
    if (eylemsiz && b >= 1) { S.ucusN[b]++; if (!yer[0] && !yer[1]) S.ucus[b]++; }
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
      S.kokHiz.push(Math.abs(k.yawU - kokOnce) / dt * 57.3); if (k.byOnce !== undefined) S.basGovdeHiz.push(Math.abs((P.by || 0) - k.byOnce) / dt * 57.3); }
    k.byOnce = P.by || 0;
    /* baş */
    const by = Math.abs(P.by || 0); S.basKare++; if (by > S.basMax) S.basMax = by; if (by > 1.2217) S.bas70++; const hx = Math.abs(P.hx || 0); if (hx > S.basPitchMax) S.basPitchMax = hx;
    /* yerinde dönüş */
    const donHiz = Math.abs(k.yawU - kokOnce) / dt;
    if (donHiz > 3 && k.vs < 0.6 && eylemsiz) { S.donusKare++; if (yer[0] && yer[1]) S.donusAdimsiz++; }
    /* dönüş olayları: son 0,8 sn'de kök 90°'den çok döndüyse */
    k.gecmis.push([t, k.yawU, k.basU, k.pen.bas.length ? k.pen.bas[k.pen.bas.length - 1] : -1]); while (k.gecmis.length && t - k.gecmis[0][0] > 1.2) k.gecmis.shift();
    if (t - k.sonDonus > 1.2) { const g = k.gecmis, i0 = g.findIndex(s => t - s[0] <= 0.8);
      if (i0 >= 0 && Math.abs(k.yawU - g[i0][1]) > 1.5708) { k.sonDonus = t; const top = k.yawU - g[i0][1], yon = Math.sign(top);
        let tk = null, tb = null; for (let j = i0; j < g.length; j++) { if (tk === null && (g[j][1] - g[i0][1]) * yon >= Math.abs(top) / 2) tk = g[j][0]; if (tb === null && (g[j][2] - g[i0][2]) * yon >= Math.abs(top) / 2) tb = g[j][0]; }
        let adim = 0; const basT = new Set(); for (let j = i0; j < g.length; j++) if (g[j][3] >= g[i0][0]) basT.add(g[j][3]); adim = basT.size;
        S.donus.push({ aci: +(Math.abs(top) * 57.3).toFixed(0), adim, onculuk: tk !== null && tb !== null ? Math.round((tk - tb) * 1000) : null, v: +k.vs.toFixed(2) }); } }
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
  window.aktorGuncelle = (a, al, dts, T) => { const t0 = R(); asil(a, al, dts, T); kareSure += R() - t0; kaydet(a, dts); zamanlama(a); temasOlc(a, dts); };
  const asilOlay = window.animasyonOlay;
  /* endirekt kolu havadayken yeniden başlama düdüğü çizilmez (kol inmez): ölçüme alınmaz */
  window.animasyonOlay = (ad, v) => { asilOlay(ad, v); const h0 = typeof ANM_HK !== 'undefined' && mac.refs ? ANM_HK.get(mac.refs[0]) : null;
    if (HK_OLAY[ad] && !(ad === 'duduk' && h0 && h0.cur && h0.cur.tur === 'endirekt')) S.zOlay.push({ ad, kare: mac.kare, tur: HK_OLAY[ad] });
    if (ad === 'mudahaleSonuc' && v && v.p && v.topaDegdi) zTmBekle.set(v.p, mac.kare); };
  const zK = new Map(), zC = new Map(), zIt = new Map(), zY = new Map(), zKor = new Map(), zTm = new Map(), zTmBekle = new Map();
  /* T5f temas ölçümü (aktör başına, kare sonunda) */
  function temasOlc(a, dt) { const p = a.kaynak; if (!p || p.tur !== 'oyuncu' || !p.oyunda || !a.m.root.visible) return; const e = p.eylem, ad = e ? e.ad : '', G = S.tm;
    const kare = zTmBekle.get(p); if (kare !== undefined) { zTmBekle.delete(p); if (kare === mac.kare) { a.m.root.updateMatrixWorld(true); const b = mac.ball; let en = 9;
      for (let i = 0; i < 2; i++) { V.set(0, -0.5, 0.05).applyMatrix4((i ? a.m.kR : a.m.kL).matrixWorld); const d = Math.hypot(V.x - b.x, V.y - (b.y + 0.11), V.z - (b.z - MOTOR_Z)) - 0.11; if (d < en) en = d; }
      G.n++; G.acik.push(+Math.max(0, en).toFixed(3)); } }
    if (ad === 'kalkis') { let z = zTm.get(a); if (!z || z.e !== e) { z = { e, bitti: false }; zTm.set(a, z); } if (!z.bitti && e.t >= (e.sure || 0.6) - dt * 1.01) { z.bitti = true; G.kalkN++; if (a.lth <= 0.05) G.kalkDik++; } }
    if (ad === 'sendele') { G.sendKare++; if (a.gAdim < 0.7) G.sendKisa++; }
    if (ad === 'dusus' && e.t < dt * 1.01) G.dususN++; }
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
    yerindeDonusKare: S.donusKare, yerindeAdimsizPay: S.donusKare ? +(100 * S.donusAdimsiz / S.donusKare).toFixed(1) : null,
    kimlikBoyCv: kim.length >= 4 ? +(100 * cv(kim.map(x => x.boy))).toFixed(1) : null, kimlikKolCv: kim.length >= 4 ? +(100 * cv(kim.map(x => x.kol))).toFixed(1) : null, kimlikN: kim.length,
    bekleKare: S.bekle, bekleDonuk: S.bekle ? +(100 * S.bekleDonuk / S.bekle).toFixed(1) : null, ikizPay: S.cift ? +(100 * S.ikiz / S.cift).toFixed(2) : null,
    sparcOrt: S.sparc.length ? +ort(S.sparc).toFixed(2) : null, sparcP10: S.sparc.length ? +yuzde(S.sparc, 0.1).toFixed(2) : null, sparcN: S.sparc.length,
    sureMs: +ort(S.sureler).toFixed(3), sureP99: +yuzde(S.sureler, 0.99).toFixed(3),
    tm: (() => { const G = S.tm, sa = sirala(G.acik); return { n: G.n, acikMed: sa.length ? sa[Math.floor(sa.length / 2)] : null, acikP90: sa.length ? sa[Math.min(sa.length - 1, Math.floor(0.9 * sa.length))] : null,
      acikIyi: sa.length ? +(100 * sa.filter(x => x <= 0.15).length / sa.length).toFixed(0) : null, icIce: G.icIce, cift: G.cift, kalkN: G.kalkN, kalkDik: G.kalkDik, sendKare: G.sendKare,
      sendKisaPay: G.sendKare ? +(100 * G.sendKisa / G.sendKare).toFixed(0) : null, dususN: G.dususN }; })(),
    zaman: (() => { if (typeof ANM_HK === 'undefined') return null; const r = { olay: S.zOlay.length, ayni: 0, bir: 0, yok: 0, yokAd: {} };
      for (const o of S.zOlay) { const L = o.tur === 'ref' ? ['ref'] : o.tur === 'lin' ? ['lin'] : o.tur === 'ikisi' ? ['ref', 'lin'] : ['ref', 'lin'];
        let enIyi = 99; for (const k of L) for (const b of (S.zIsaret[k] || [])) { const d = b - o.kare; if (d >= 0 && d < enIyi) enIyi = d; }
        if (enIyi === 0) r.ayni++; else if (enIyi === 1) r.bir++; else { r.yok++; r.yokAd[o.ad] = (r.yokAd[o.ad] || 0) + 1; } }
      r.vurus = S.zVurus; r.vurusAyni = S.zVurusAyni; r.vurusFark = S.zVurusFark.slice(0, 10); return r; })(),
    vk: (() => { const med = a => a.length ? +yuzde(a, 0.5).toFixed(3) : null, kt = S.vkKT;
      return { n: S.vkN, hazirliksizPay: S.vkN ? +(100 * S.vkHazirliksiz / S.vkN).toFixed(1) : null, sonAdimOrt: S.vkSonAdim.length ? +ort(S.vkSonAdim).toFixed(3) : null,
        sonAdimIyiPay: S.vkSonAdim.length ? +(100 * S.vkSonAdim.filter(x => x >= 0.8).length / S.vkSonAdim.length).toFixed(1) : null,
        tepeMed: S.vkTepe.length ? +yuzde(S.vkTepe, 0.5).toFixed(2) : null, ilkTakip: S.vkIlkTakip,
        ktPas: med(kt.pas), ktSut: med(kt.sut), ktUzun: med(kt.uzun), ktIlk: med(kt.ilk), disiVurus: S.vkN ? +(S.vkDisi / S.vkN).toFixed(2) : null, kare: S.vkKare, kararsiz: S.kararsiz,
        kararsizKanal: Object.entries(S.kararsizKanal).sort((a, b) => b[1] - a[1]).slice(0, 6),
        disiEvre: Object.entries(S.vkDisiEvre).sort((a, b) => b[1] - a[1]).slice(0, 10), evreKare: S.vkEvreKare }; })(),
    kaymaDurum: S.dTemas.map((n, i) => n ? { pay: +(100 * S.dKayma[i] / n).toFixed(2), n } : null),
    ck: (() => { const G = S.ck, Y = G.yutKayit.filter(y => y.n >= 3);
      return { N: G.N, bas: G.bas, basAyni: G.basAyni, basFark: G.basFark.slice(0, 10), it: G.it, itAyni: G.itAyni,
        makasN: G.makas.length, makasIyi: G.makas.filter(x => x >= 0.35).length, makasMed: G.makas.length ? +yuzde(G.makas, 0.5).toFixed(2) : null,
        yut: Y.length, yutGor: Y.filter(y => y.ok / y.n >= 0.5).length,
        korSn: +(G.korKare / 60).toFixed(1), korDegisSn: G.korKare ? +(G.korDegis / (G.korKare / 60)).toFixed(2) : null, korDogru: G.korN ? +(100 * G.korDogru / G.korN).toFixed(1) : null }; })(),
    surum: window.ANM_SURUM || 'simdiki'
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
    kd = o.get("kaymaDurum")
    if kd:
        S.append("A: ayak kayması % durumlara göre (bilgi; aynı tanım): " + " · ".join(f"{ad} {v(kd[i]['pay'], 2)} ({kd[i]['n']} temas)" if kd[i] else f"{ad} —" for i, ad in enumerate(["dar dönüş", "ani duruş", "top saklama"])))
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
    S.append(f"A: baş: |baş–gövde| en çok {o['basMaxDer']}°, >70° kare payı %{v(o['bas70'], 2)}, eğim en çok {o['basPitchMaxDer']}° · dönüşte baş öncülüğü ortanca {o['onculukMs'] if o['onculukMs'] is not None else '—'} ms (p10 {o['onculukP10'] if o['onculukP10'] is not None else '—'})   [hedef ≤80°, ≥150 ms]")
    S.append(f"A: dönüş: 90°+ dönüş {o['donus90']}, basma ort {v(o['donusAdim'], 2)}, basmasız %{v(o['donusAdimsizPay'])} · yerinde dönüşte iki ayak yerde %{v(o['yerindeAdimsizPay'])} ({o['yerindeDonusKare']} kare)   [hedef basmasız 0]")
    S.append(f"A: kimlik (koşu bandı, {o['kimlikN']} oyuncu): adım boyu CV %{v(o['kimlikBoyCv'])} · kol genliği CV %{v(o['kimlikKolCv'])}   [hedef ≥8 / ≥20]")
    S.append(f"A: bekleyiş: {o['bekleKare']} kare, donuk %{v(o['bekleDonuk'])}, ikiz poz %{v(o['ikizPay'], 2)}   [hedef donuk ~0, ikiz ~0]")
    S.append(f"A: düzgünlük (SPARC, baş hızı, 3 sn, n {o['sparcN']}): ort {v(o['sparcOrt'], 2)} · p10 {v(o['sparcP10'], 2)}")
    z = o.get("zaman")
    if z:
        S.append(f"A: zamanlama: hakem işareti {z['olay']} olay — aynı karede {z['ayni']}, bir adım sonra {z['bir']}, başlamayan {z['yok']} {z['yokAd'] or ''} · vuruş {z['vurus']} temas — çizimin temas evresi aynı karede {z['vurusAyni']}   [hedef sapma 0]")
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
    S.append(f"A: süre: aktorGuncelle {v(o['sureMs'], 3)} ms/kare (p99 {v(o['sureP99'], 3)}) · {o['kare']} kare, {v(o['oyuncuDk'])} oyuncu·dk · animasyon: {o['surum']}   [hedef ≤2 ms]")
    return S


async def olc(a):
    from playwright.async_api import async_playwright
    site = kopya_hazirla(yerel_three())
    hatalar = []
    try:
        async with async_playwright() as p:
            tarayici = await p.chromium.launch(args=["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
            baglam = await tarayici.new_context(viewport={"width": 1180, "height": 1000})
            await baglam.add_init_script(BASLANGIC_JS % a.tohum)
            pg = await baglam.new_page()
            pg.on("pageerror", lambda e: hatalar.append("Betik hatası: " + str(e)))
            pg.on("console", lambda m: hatalar.append("Konsol: " + m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
            await pg.goto((site / "index.html").as_uri() + f"?ekran=mac&tohum={a.tohum}")
            await pg.wait_for_selector("#btnMacaGec", timeout=30000)
            await pg.evaluate("__kare(2)")
            if a.once:
                await pg.evaluate(YUKLE.read_text(encoding="utf-8") + "\n;window.anmOnceYukle = anmOnceYukle; true;")
                n = await pg.evaluate("(s) => anmOnceYukle(window, s)", (KARSILASTIR / a.once / "animasyon.js").read_text(encoding="utf-8"))
                await pg.evaluate(f"window.ANM_SURUM = {json.dumps(a.once)}")
                print(f"önce animasyonu yüklendi ({a.once}, {n} aktör)")
            await pg.evaluate("macaGecIste(); document.getElementById('btnMacaGec').hidden = true;")
            await pg.evaluate(OLCUM_KUR_JS)
            if a.hiz != 1:
                await pg.evaluate(f"MAC_HIZ.deger = {a.hiz}")
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
    ap.add_argument("--karsilastir")
    ap.add_argument("--hiz", type=int, default=1, choices=[1, 2, 4, 8, 16], help="oynatma hızı (MAC_HIZ; T4-V: hız katlarında vuruş katmanının kararlılığı)")
    a = ap.parse_args()
    try:
        import playwright  # noqa: F401
    except ImportError:
        sys.exit("Playwright bulunamadı. Kurmak için: pip install playwright==1.56.0")
    o, hatalar = asyncio.run(olc(a))
    o["tohum"], o["sure"] = a.tohum, a.sure
    S = satirlar(o)
    if a.karsilastir:
        e = json.loads(pathlib.Path(a.karsilastir).read_text(encoding="utf-8"))
        S.append(f"--- karşılaştırma: {a.karsilastir} (animasyon {e.get('surum')}, tohum {e.get('tohum')}, {e.get('sure')} sn) ---")
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
