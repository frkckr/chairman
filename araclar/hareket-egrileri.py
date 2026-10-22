#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A7-0 (2026-10-17; atıf kutuphane/J §J.12 "Kaynaklar — A7"): hareket verisinden adım döngüsü eğrileri → js/hareket-egrileri.js.

Kaynaklar (ham veri depoya girmez; araclar/veri/ Git dışıdır; atıf kutuphane/J §J.12 "Kaynaklar — A7"):
  - CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu; asf/amc) — "The data used in this project was obtained from mocap.cs.cmu.edu.
    The database was created with funding from NSF EIA-0196217." Koşu, yürüyüş, vuruş denemeleri (seçilmiş dosyalar).
  - Fukuchi, Fukuchi & Duarte (2017), "A public dataset of running biomechanics and the effects of running speed on lower extremity kinematics
    and kinetics", PeerJ 5:e3298; veri figshare 10.6084/m9.figshare.4543435 (CC BY 4.0) — RBDSnnnprocessed.txt (2,5 / 3,5 / 4,5 m/sn).

Çıktı yalnız sayı tablolarıdır (eklem açısı eğrilerinin Fourier katsayıları, salınan ayağın yolu, temas payı, kadans): oyunda harici model,
doku ya da hareket kaydı yoktur (kullanıcı kararı 2026-10-16). İndirilen dosyalar güvensiz veri sayılır: araç `python -I` ile koşar ve veriyi
yalnız yol argümanından okur (çalıştırmaz, içe aktarmaz).

Kullanım:  python -I araclar/hareket-egrileri.py araclar/veri            (rapor araclar/son-egri.txt, tablo js/hareket-egrileri.js)
           python -I araclar/hareket-egrileri.py araclar/veri --yazma    (yalnız rapor)

Açıların tanımı (çizimin ölçüsü animasyon-olcum.py "A: eğri" ile aynı; eklemlerin yerinden, dünya ekseninde, gidiş yönü f, düşey u, sağ r = f × u):
  uyluk  kalça eklemi → diz doğrultusunun aşağı düşeyle sagital açısı (+ öne)        diz    uyluk ile baldırın arasındaki açı (0 düz)
  omuz   omuz → dirsek doğrultusunun gövde eksenine göre sagital açısı (+ öne)     dirsek pazı ile ön kolun arasındaki açı (0 düz)
  egim   kalça eklemlerinin ortası → omuzların ortası, düşeyle sagital açı (+ öne)
  legen  kalça hattının (sol → sağ eklem) yatay açısı, r'ye göre (+ başvuru yanının kalçası önde)
  gogus  omuz hattının yatay açısı, r'ye göre (+ başvuru yanının omzu önde)
  kalcaY kalça eklemlerinin ortasının yüksekliği, döngü ortalamasından (bacak boyu birimi)
  ayakX, ayakY  başvuru ayağının bileği: kalça eklemine göre ileri uzaklık ve duruştaki seviyesinden yükseklik (bacak boyu birimi)
Döngü başvuru ayağının (sağ; sol döngüler aynalanır) yere basışından başlar; çizimde ayak 0 (lL kemiği, oyuncunun sağı) u = 0'da basar.
"""
import sys, os, math, argparse, io, glob

N = 50                 # döngü örnek sayısı
EGIM_YURU = 2.0        # yürüyüşte gövdenin öne eğimi (derece; kabul — yürüyüşte gövde neredeyse dik, 1–3°)
ESIK = [0.04, 0.05, 2.0]   # CMU temas: basış (taban + m), kalkış (taban + m), basışta ayağın yatay hızı (m/sn) — RBDS'nin kuvvet plakası temas payıyla ayarlanır
HARM = 6               # Fourier harmonik sayısı

# ---------- 3×3 matris (satır öncelikli demet) ----------
def mm(a, b):
    return (a[0]*b[0]+a[1]*b[3]+a[2]*b[6], a[0]*b[1]+a[1]*b[4]+a[2]*b[7], a[0]*b[2]+a[1]*b[5]+a[2]*b[8],
            a[3]*b[0]+a[4]*b[3]+a[5]*b[6], a[3]*b[1]+a[4]*b[4]+a[5]*b[7], a[3]*b[2]+a[4]*b[5]+a[5]*b[8],
            a[6]*b[0]+a[7]*b[3]+a[8]*b[6], a[6]*b[1]+a[7]*b[4]+a[8]*b[7], a[6]*b[2]+a[7]*b[5]+a[8]*b[8])
def mv(m, v):
    return (m[0]*v[0]+m[1]*v[1]+m[2]*v[2], m[3]*v[0]+m[4]*v[1]+m[5]*v[2], m[6]*v[0]+m[7]*v[1]+m[8]*v[2])
def tr(m):
    return (m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8])
def euler(rx, ry, rz):
    """ASF/AMC: sabit eksenler x, y, z sırasıyla (R = Rz·Ry·Rx), derece."""
    a, b, c = math.radians(rx), math.radians(ry), math.radians(rz)
    ca, sa, cb, sb, cc, sc = math.cos(a), math.sin(a), math.cos(b), math.sin(b), math.cos(c), math.sin(c)
    Rx = (1, 0, 0, 0, ca, -sa, 0, sa, ca); Ry = (cb, 0, sb, 0, 1, 0, -sb, 0, cb); Rz = (cc, -sc, 0, sc, cc, 0, 0, 0, 1)
    return mm(Rz, mm(Ry, Rx))
I3 = (1, 0, 0, 0, 1, 0, 0, 0, 1)
def ekle(a, b, k=1.0): return (a[0]+b[0]*k, a[1]+b[1]*k, a[2]+b[2]*k)
def fark(a, b): return (a[0]-b[0], a[1]-b[1], a[2]-b[2])
def nokta(a, b): return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
def boy(a): return math.sqrt(nokta(a, a))
def orta(a, b): return ((a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2)
def capraz(a, b): return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])

# ---------- ASF / AMC okuyucu ----------
def oku_asf(yol):
    sat = io.open(yol, encoding='latin-1').read().replace('\r', '').split('\n')
    kemik, hiyerarsi, bolum, cur = {}, {}, None, None
    uzunluk_birim = 0.45
    for s in sat:
        t = s.strip()
        if not t or t.startswith('#'): continue
        if t.startswith(':'):
            w = t.split(); bolum = w[0]
            continue
        w = t.split()
        if bolum == ':units' and w[0] == 'length': uzunluk_birim = float(w[1])
        elif bolum == ':bonedata':
            if w[0] == 'begin': cur = {'dof': []}
            elif w[0] == 'end': kemik[cur['name']] = cur; cur = None
            elif cur is not None:
                if w[0] == 'name': cur['name'] = w[1]
                elif w[0] == 'direction': cur['dir'] = tuple(float(x) for x in w[1:4])
                elif w[0] == 'length': cur['len'] = float(w[1])
                elif w[0] == 'axis':
                    cur['axis'] = tuple(float(x) for x in w[1:4])
                    if len(w) > 4 and w[4].upper() != 'XYZ': raise ValueError('eksen sırası XYZ değil: ' + yol)
                elif w[0] == 'dof': cur['dof'] = [x.lower() for x in w[1:]]
        elif bolum == ':hierarchy':
            if w[0] in ('begin', 'end'): continue
            hiyerarsi[w[0]] = w[1:]
    birim = 0.0254 / uzunluk_birim   # CMU: uzunluklar (1/0,45) inç
    for k in kemik.values():
        C = euler(*k['axis']); k['C'] = C; k['Ci'] = tr(C); k['L'] = k['len'] * birim
    sira, kuyruk, ebeveyn = [], ['root'], {}
    while kuyruk:
        x = kuyruk.pop(0)
        for c in hiyerarsi.get(x, []): ebeveyn[c] = x; sira.append(c); kuyruk.append(c)
    return {'kemik': kemik, 'sira': sira, 'ebeveyn': ebeveyn, 'birim': birim}

def oku_amc(yol):
    sat = io.open(yol, encoding='latin-1').read().replace('\r', '').split('\n')
    kareler, cur = [], None
    for s in sat:
        t = s.strip()
        if not t or t.startswith('#') or t.startswith(':'): continue
        w = t.split()
        if len(w) == 1 and w[0].isdigit():
            cur = {}; kareler.append(cur); continue
        if cur is not None: cur[w[0]] = [float(x) for x in w[1:]]
    return kareler

def ileri_kin(isk, kare):
    """Bir karenin kemik uçlarını (kemiğin bittiği nokta, m) döndürür: {kemik: (x, y, z)}; 'root' kökün yeri."""
    K, birim = isk['kemik'], isk['birim']
    r = kare['root']
    M = {'root': euler(r[3], r[4], r[5])}
    P = {'root': (r[0]*birim, r[1]*birim, r[2]*birim)}
    for b in isk['sira']:
        k = K[b]; p = isk['ebeveyn'][b]
        v = kare.get(b, []); rx = ry = rz = 0.0
        for i, d in enumerate(k['dof']):
            if i < len(v):
                if d == 'rx': rx = v[i]
                elif d == 'ry': ry = v[i]
                elif d == 'rz': rz = v[i]
        Mb = mm(M[p], mm(k['C'], mm(euler(rx, ry, rz), k['Ci'])))
        M[b] = Mb
        P[b] = ekle(P[p], mv(Mb, k['dir']), k['L'])
    return P

# ---------- açılar ----------
def sag(v, f, u):
    """aşağı düşeyle sagital açı (derece; + öne)"""
    return math.degrees(math.atan2(nokta(v, f), -nokta(v, u)))
def aci3(a, b):
    c = nokta(a, b) / (boy(a) * boy(b) or 1); return math.degrees(math.acos(max(-1.0, min(1.0, c))))
def yatay_aci(v, f, r):
    return math.degrees(math.atan2(nokta(v, f), nokta(v, r)))

KANALLAR = ['uyluk', 'diz', 'omuz', 'dirsek', 'egim', 'legen', 'gogus', 'kalcaY', 'kalcaH', 'ayakX', 'ayakY', 'karsiUyluk', 'karsiDiz', 'karsiOmuz', 'karsiDirsek']

def kare_kanallari(J, f, u, r, yan, bacak, taban, sol):
    """J: eklemler; yan 'r' ya da 'l' (başvuru yanı); bacak: kalça → bilek uzunluğu; taban: duruştaki bilek yüksekliği."""
    o = 'l' if yan == 'r' else 'r'
    def bac(s):
        kal, diz, bil = J[s + 'hipjoint'], J[s + 'femur'], J[s + 'tibia']
        return sag(fark(diz, kal), f, u), aci3(fark(diz, kal), fark(bil, diz))
    kalR, kalL = J['rhipjoint'], J['lhipjoint']; omR, omL = J['rclavicle'], J['lclavicle']
    kc, oc = orta(kalR, kalL), orta(omR, omL); g = fark(oc, kc)
    egim = math.degrees(math.atan2(nokta(g, f), nokta(g, u)))
    def kol(s):
        om, dr, bl = J[s + 'clavicle'], J[s + 'humerus'], J[s + 'radius']
        return sag(fark(dr, om), f, u) + egim, aci3(fark(dr, om), fark(bl, dr))
    uy, dz = bac(yan); kuy, kdz = bac(o); om, ds = kol(yan); kom, kds = kol(o)
    isaret = 1 if yan == 'r' else -1
    legen = isaret * yatay_aci(fark(kalR, kalL), f, r)
    gogus = isaret * yatay_aci(fark(omR, omL), f, r)
    kal = J[yan + 'hipjoint']; bil = J[yan + 'tibia']
    ayakX = nokta(fark(bil, kal), f) / bacak
    ayakY = (bil[1] - taban) / bacak
    return {'uyluk': uy, 'diz': dz, 'omuz': om, 'dirsek': ds, 'egim': egim, 'legen': legen, 'gogus': gogus,
            'kalcaY': kc[1] / bacak, 'kalcaH': (kc[1] - sol) / (bacak + taban - sol), 'ayakX': ayakX, 'ayakY': ayakY, 'karsiUyluk': kuy, 'karsiDiz': kdz, 'karsiOmuz': kom, 'karsiDirsek': kds}

# ---------- deneme → döngüler ----------
def yuzdelik(x, q):
    s = sorted(x); return s[min(len(s) - 1, max(0, int(q * (len(s) - 1))))]

def ornekle(y, n=None):
    """y'yi (uçlar dahil) N noktaya (döngü başından, son nokta hariç) doğrusal örnekler"""
    n = n or N; m = len(y) - 1; o = []
    for q in range(n):
        p = q / n * m; i = int(p); w = p - i
        o.append(y[i] + (y[min(m, i + 1)] - y[i]) * w)
    return o

def temas_bul(J, hz):
    n = len(J); dt = 1.0 / hz; temas = {}
    for s in 'rl':
        bil = [j[s + 'tibia'] for j in J]; top = [j[s + 'foot'] for j in J]
        hb = [b[1] for b in bil]; ht = [t[1] for t in top]
        gb, gt = yuzdelik(hb, 0.03), yuzdelik(ht, 0.03)
        # topuk (CMU'da işaret yok): bilek, duruştaki bilek yüksekliği kadar aşağıda; koşuda topuk ayak düzleşmeden önce basar
        h = [min(b - (gb - gt), t) for b, t in zip(hb, ht)]
        g = yuzdelik(h, 0.03)
        hiz = [0.0] * n
        for i in range(n):
            a, b = max(0, i - 1), min(n - 1, i + 1)
            if b > a: hiz[i] = math.hypot(top[b][0] - top[a][0], top[b][2] - top[a][2]) / ((b - a) * dt)
        c, on = [False] * n, False
        for i in range(n):
            if on: on = h[i] < g + ESIK[1]
            else: on = h[i] < g + ESIK[0] and hiz[i] < ESIK[2]
            c[i] = on
        temas[s] = (c, gb, gt)
    return temas

def denemeden_donguler(isk, kareler, hz, ad):
    J = [ileri_kin(isk, k) for k in kareler]
    n = len(J); dt = 1.0 / hz
    K = isk['kemik']; bacak = (K['rfemur']['L'] + K['rtibia']['L'] + K['lfemur']['L'] + K['ltibia']['L']) / 2
    temas = temas_bul(J, hz)
    kok = [orta(j['rhipjoint'], j['lhipjoint']) for j in J]
    donguler, red = [], {}
    for s in 'rl':
        c, gb, gt = temas[s]; o = 'l' if s == 'r' else 'r'; co = temas[o][0]
        bas = [i for i in range(1, n) if c[i] and not c[i - 1]]
        for a, b in zip(bas, bas[1:]):
            T = (b - a) * dt
            if not (0.45 <= T <= 1.7): red['süre'] = red.get('süre', 0) + 1; continue
            ka = sum(1 for i in range(a, b) if c[i]); kb = sum(1 for i in range(a, b) if co[i])
            ob = sum(1 for i in range(a + 1, b) if co[i] and not co[i - 1])
            if ob != 1 or ka < 3 or kb < 3: red['temas'] = red.get('temas', 0) + 1; continue
            m = (a + b) // 2
            d1 = (kok[m][0] - kok[a][0], kok[m][2] - kok[a][2]); d2 = (kok[b][0] - kok[m][0], kok[b][2] - kok[m][2])
            v1, v2 = math.hypot(*d1) / ((m - a) * dt), math.hypot(*d2) / ((b - m) * dt)
            if v1 < 0.5 or v2 < 0.5 or abs(v1 - v2) / max(v1, v2) > 0.15: red['hız'] = red.get('hız', 0) + 1; continue
            yon = math.degrees(math.atan2(d2[1], d2[0]) - math.atan2(d1[1], d1[0]))
            yon = (yon + 180) % 360 - 180
            if abs(yon) > 15: red['yön'] = red.get('yön', 0) + 1; continue
            dx, dz = kok[b][0] - kok[a][0], kok[b][2] - kok[a][2]; L = math.hypot(dx, dz)
            f = (dx / L, 0.0, dz / L); u = (0.0, 1.0, 0.0); r = capraz(f, u)
            v = L / T
            ham = [kare_kanallari(J[i], f, u, r, s, bacak, gb, gt) for i in range(a, b + 1)]
            # geri ya da yana yürüyüş (09_12): kalça hattı gidiş yönüne dik değil
            if abs(sum(x['legen'] for x in ham) / len(ham)) > 30: red['geri/yan'] = red.get('geri/yan', 0) + 1; continue
            kY = sum(x['kalcaY'] for x in ham[:-1]) / (len(ham) - 1)
            for x in ham: x['kalcaY'] -= kY
            orn = {kn: ornekle([x[kn] for x in ham]) for kn in KANALLAR}
            beta = ka / (b - a)
            donguler.append({'ad': ad, 'yan': s, 'v': v, 'T': T, 'beta': beta, 'adim': v * T / 2, 'orn': orn, 'bacak': bacak})
    return donguler, red

# ---------- RBDS ----------
def oku_rbds(klasor):
    sonuc = {25: [], 35: [], 45: []}
    for yol in sorted(glob.glob(os.path.join(klasor, 'RBDS[0-9][0-9][0-9]processed.txt'))):
        sat = io.open(yol, encoding='latin-1').read().replace('\r', '').split('\n')
        bas = sat[0].split('\t'); d = [[float(y) if y.strip() else float('nan') for y in x.split('\t')] for x in sat[1:] if x.strip()]
        for hz in (25, 35, 45):
            for s in 'RL':
                try:
                    ik, iz, ib, ig = (bas.index('%shipAngZ%d' % (s, hz)), bas.index('%skneeAngZ%d' % (s, hz)),
                                      bas.index('%sankleAngZ%d' % (s, hz)), bas.index('%sgrfY%d' % (s, hz)))
                except ValueError:
                    continue
                kal = [r[ik] for r in d]; diz = [r[iz] for r in d]; bil = [r[ib] for r in d]; grf = [r[ig] for r in d]
                if any(x != x for x in kal + diz): continue
                gm = max(x for x in grf if x == x)   # kuvvet ve moment salınımda NaN
                temas = sum(1 for x in grf[:-1] if x == x and x > 0.05 * gm) / (len(grf) - 1)
                sonuc[hz].append({'kalca': kal, 'diz': diz, 'bilek': bil, 'beta': temas})
    return sonuc

# ---------- Fourier ----------
def fourier(y):
    n = len(y); a0 = sum(y) / n; K = []
    for k in range(1, HARM + 1):
        a = 2 / n * sum(y[i] * math.cos(2 * math.pi * k * i / n) for i in range(n))
        b = 2 / n * sum(y[i] * math.sin(2 * math.pi * k * i / n) for i in range(n))
        K.append((a, b))
    return a0, K
def fourier_deger(a0, K, p):
    return a0 + sum(a * math.cos(2 * math.pi * (k + 1) * p) + b * math.sin(2 * math.pi * (k + 1) * p) for k, (a, b) in enumerate(K))

def ortalama(egriler):
    return [sum(e[i] for e in egriler) / len(egriler) for i in range(len(egriler[0]))]
def rms(a, b): return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)) / len(a))

BANTLAR = [('yuru', 0.5, 2.0), ('kos', 2.2, 3.8), ('hizli', 3.8, 6.0)]

def ana():
    ap = argparse.ArgumentParser(description='A7-0: hareket verisinden adım döngüsü eğrileri')
    ap.add_argument('veri', help='araclar/veri (cmu/, rbds/)')
    ap.add_argument('--yazma', action='store_true', help='js/hareket-egrileri.js yazılmaz (yalnız rapor)')
    ap.add_argument('--hz', type=float, default=120.0)
    ap.add_argument('--vurus', default=None, help='A7c: animasyon-olcum.py --json çıktısı; çizimin vuruş eğrisi veriyle karşılaştırılır')
    ap.add_argument('--esik', default=None, help='CMU temas eşikleri "basış,kalkış,hız" (ayar denemesi)')
    A = ap.parse_args()
    if A.esik: ESIK[:] = [float(x) for x in A.esik.split(',')]
    try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
    kok = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    R = []
    def yaz(*x):
        s = ' '.join(str(y) for y in x); R.append(s); print(s)
    cmu = os.path.join(A.veri, 'cmu')
    iskeletler, tum, vurus_dosya = {}, [], []
    for yol in sorted(glob.glob(os.path.join(cmu, '*.amc'))):
        ad = os.path.basename(yol)[:-4]; ozne = ad.split('_')[0]
        if ozne not in iskeletler: iskeletler[ozne] = oku_asf(os.path.join(cmu, ozne + '.asf'))
        if ozne in ('10', '11', '74'): vurus_dosya.append((ad, yol)); continue
        kareler = oku_amc(yol)
        d, red = denemeden_donguler(iskeletler[ozne], kareler, A.hz, ad)
        yaz('%-7s %4d kare  döngü %d  hız %s  red %s' % (ad, len(kareler), len(d), ' '.join('%.2f' % x['v'] for x in d), red or ''))
        tum.extend(d)
    yaz('')
    yaz('CMU döngüleri: %d' % len(tum))
    # gövde eğiminin sıfırı: CMU iskeletinin dinlenme pozunda kalça eklemleri → omuzlar çizgisi 6–9° geriye yatık (anatomik değil); her öznenin
    # yürüyüşü EGIM_YURU kabul edilir (yürüyüşü olmayan öznede dinlenme pozu ile yürüyüşlü öznelerin ortalama farkı). Omuz açısı aynı sıfırla.
    dinlenme = {}
    for oz, isk in iskeletler.items():
        J0 = ileri_kin(isk, {'root': [0, 0, 0, 0, 0, 0]})
        g0 = fark(orta(J0['rclavicle'], J0['lclavicle']), orta(J0['rhipjoint'], J0['lhipjoint']))
        dinlenme[oz] = math.degrees(math.atan2(g0[2], g0[1]))
    sapma = {}
    for oz in sorted(set(x['ad'].split('_')[0] for x in tum)):
        W = [x for x in tum if x['ad'].split('_')[0] == oz and x['v'] < 2.0]
        if len(W) >= 3: sapma[oz] = sum(sum(x['orn']['egim']) / N for x in W) / len(W) - EGIM_YURU
    ort_fark = sum(sapma[o] - dinlenme[o] for o in sapma) / len(sapma)
    for x in tum:
        oz = x['ad'].split('_')[0]; d = sapma.get(oz, dinlenme[oz] + ort_fark); x['egimSifir'] = d
        for kn in ('egim', 'omuz', 'karsiOmuz'): x['orn'][kn] = [y - d for y in x['orn'][kn]]
    yaz('gövde eğiminin sıfırı (yürüyüş %+.1f° kabul): ' % EGIM_YURU + '  '.join('%s %+.1f (dinlenme %+.1f)' % (o, sapma.get(o, dinlenme[o] + ort_fark), dinlenme[o])
        for o in sorted(set(x['ad'].split('_')[0] for x in tum))))
    # 127: engelli parkur koşusu (CMU "Action Adventure Obstacles"): çömelik (kalça 0,85), gövde ~20° önde, çoğu döngü hızlanma ya da duruşta —
    # futbol koşusunun dışında; yalnız raporda
    DISARI = {'127'}
    yaz('bantların dışında: özne %s (%d döngü; engelli parkur koşusu, çömelik ve öne eğik)' % (','.join(sorted(DISARI)), sum(1 for x in tum if x['ad'].split('_')[0] in DISARI)))
    def bakisim(e):
        """iki yanı birleştirir: başvuru yanı ile karşı yanın yarım döngü kaymışı; legen ve gogus ters bakışımlı, egim ve kalça yarım döngüde yinelenir"""
        h = N // 2; o = dict(e)
        for kn, kk in (('uyluk', 'karsiUyluk'), ('diz', 'karsiDiz'), ('omuz', 'karsiOmuz'), ('dirsek', 'karsiDirsek')):
            o[kn] = [(e[kn][i] + e[kk][(i + h) % N]) / 2 for i in range(N)]
        for kn in ('legen', 'gogus'): o[kn] = [(e[kn][i] - e[kn][(i + h) % N]) / 2 for i in range(N)]
        for kn in ('egim', 'kalcaH', 'kalcaY'): o[kn] = [(e[kn][i] + e[kn][(i + h) % N]) / 2 for i in range(N)]
        return o
    bant_sonuc = {}
    for ad, v0, v1 in BANTLAR:
        D = [x for x in tum if v0 <= x['v'] < v1 and x['ad'].split('_')[0] not in DISARI]
        if not D: yaz('bant %s: döngü yok' % ad); continue
        v = sum(x['v'] for x in D) / len(D); beta = sum(x['beta'] for x in D) / len(D)
        T = sum(x['T'] for x in D) / len(D); adim = sum(x['adim'] for x in D) / len(D); bacak = sum(x['bacak'] for x in D) / len(D)
        egri = bakisim({kn: ortalama([x['orn'][kn] for x in D]) for kn in KANALLAR})
        sap = {kn: math.sqrt(sum(rms(x['orn'][kn], egri[kn]) ** 2 for x in D) / len(D)) for kn in KANALLAR}
        bant_sonuc[ad] = {'v': v, 'beta': beta, 'T': T, 'adim': adim, 'bacak': bacak, 'egri': egri, 'n': len(D),
                          'ozne': sorted(set(x['ad'].split('_')[0] for x in D)), 'sap': sap}
        yaz('bant %-5s %3d döngü (özne %s)  hız %.2f m/sn  temas payı %.3f  döngü %.3f sn  kadans %.2f adım/sn  adım %.2f m (bacak %.2f m)' % (
            ad, len(D), ','.join(bant_sonuc[ad]['ozne']), v, beta, T, 2 / T, adim, bacak))
        for kn in KANALLAR:
            e = egri[kn]
            yaz('   %-11s en az %7.2f  en çok %7.2f  aralık %6.2f  döngüler arası sapma (RMS) %5.2f' % (kn, min(e), max(e), max(e) - min(e), sap[kn]))
    rb = oku_rbds(os.path.join(A.veri, 'rbds'))
    yaz('')
    yaz('RBDS (Fukuchi 2017; koşu bandı; sağ ve sol döngüler):')
    rb_ozet = {}
    for hz in (25, 35, 45):
        L = rb[hz]
        if not L: continue
        diz = ortalama([ornekle(x['diz']) for x in L]); kal = ortalama([ornekle(x['kalca']) for x in L])
        beta = sum(x['beta'] for x in L) / len(L)
        rb_ozet[hz] = {'diz': diz, 'kalca': kal, 'beta': beta, 'n': len(L)}
        yaz('  %.1f m/sn  %d döngü  temas payı %.3f  diz %.1f–%.1f (salınımda tepe %.1f)  kalça (leğene göre) %.1f–%.1f' % (
            hz / 10, len(L), beta, min(diz), max(diz), max(diz[int(N * 0.4):]), min(kal), max(kal)))
    yaz('')
    yaz('CMU ↔ RBDS (diz; aynı hız aralığındaki CMU döngüleri):')
    for hz in (25, 35, 45):
        if hz not in rb_ozet: continue
        D = [x for x in tum if abs(x['v'] - hz / 10) < 0.5]
        if not D: yaz('  %.1f m/sn: CMU döngüsü yok' % (hz / 10)); continue
        cd = ortalama([x['orn']['diz'] for x in D]); rd = rb_ozet[hz]['diz']
        kay = min(range(-5, 6), key=lambda k: rms(cd[k:] + cd[:k], rd))
        yaz('  %.1f m/sn  CMU %d döngü (hız ort. %.2f)  diz RMS %.1f° (evre kaydırınca %.1f°, %+d/%d)  salınım tepesi CMU %.1f / RBDS %.1f  temas payı CMU %.3f / RBDS %.3f' % (
            hz / 10, len(D), sum(x['v'] for x in D) / len(D), rms(cd, rd), rms(cd[kay:] + cd[:kay], rd), kay, N, max(cd), max(rd),
            sum(x['beta'] for x in D) / len(D), rb_ozet[hz]['beta']))
    # ---------- tablo: bantlar (yürüyüş CMU; 2,5 / 3,5 / 4,5 m/sn bacak RBDS + CMU, üst gövde CMU; depar uzatma) ----------
    def evre(y, b0, b1):
        """temas payı b0 olan döngü eğrisini temas payı b1'e yeniden örnekler (duruş ve salınım ayrı ayrı gerilir)"""
        o = []
        for i in range(N):
            p = i / N
            q = p / b1 * b0 if p < b1 else b0 + (p - b1) / (1 - b1) * (1 - b0)
            x = q * N; j = int(x) % N; w = x - int(x)
            o.append(y[j] + (y[(j + 1) % N] - y[j]) * w)
        return o
    HZ = [25, 35, 45]; VR = [h / 10 for h in HZ]
    def rb_egri(kn, v, b1):
        """RBDS eğrisi (temas payı b1'e gerilmiş) v hızında: 2,5–4,5 arasında doğrusal ara değer, dışında üç noktanın doğrusu"""
        C = [evre(rb_ozet[h][kn], rb_ozet[h]['beta'], b1) for h in HZ]
        if VR[0] <= v <= VR[-1]:
            j = 0 if v <= VR[1] else 1; w = (v - VR[j]) / (VR[j + 1] - VR[j])
            return [C[j][i] + (C[j + 1][i] - C[j][i]) * w for i in range(N)]
        o = []
        for i in range(N):
            ys = [c[i] for c in C]; mv_ = sum(VR) / 3; my = sum(ys) / 3
            eg = sum((x - mv_) * (y - my) for x, y in zip(VR, ys)) / sum((x - mv_) ** 2 for x in VR)
            o.append(my + eg * (v - mv_))
        return o
    def sinirla(y, a, b): return [min(b, max(a, x)) for x in y]
    CK = ['uyluk', 'diz', 'omuz', 'dirsek', 'egim', 'legen', 'gogus', 'kalcaH']
    SINIR = {'uyluk': (-40, 75), 'diz': (5, 130), 'omuz': (-80, 60), 'dirsek': (40, 125), 'egim': (-5, 20), 'legen': (-15, 15), 'gogus': (-25, 25), 'kalcaH': (0.8, 1.05)}
    Bk, Bw = bant_sonuc['kos'], bant_sonuc['yuru']
    vk = Bk['v']
    # üst gövdenin hıza göre değişimi: aynı kişinin (16) yavaş (< 3,4) ve hızlı (> 3,8 m/sn) koşu döngülerinden kanal başına iki sayı — ortalamanın
    # kayması (b, birim / m/sn) ve genliğin oranı (a, 1 / m/sn); şekil 30 döngülük koşu bandından. Bacak RBDS'den (39 kişi, üç hız).
    UST = ['omuz', 'dirsek', 'egim', 'legen', 'gogus', 'kalcaH']
    D16 = [x for x in tum if x['ad'].split('_')[0] == '16' and x['v'] > 2.2]
    Ds, Dh = [x for x in D16 if x['v'] < 3.4], [x for x in D16 if x['v'] > 3.8]
    vs_, vh_ = sum(x['v'] for x in Ds) / len(Ds), sum(x['v'] for x in Dh) / len(Dh)
    Es, Eh = bakisim({kn: ortalama([x['orn'][kn] for x in Ds]) for kn in KANALLAR}), bakisim({kn: ortalama([x['orn'][kn] for x in Dh]) for kn in KANALLAR})
    EG = {}
    for kn in UST:
        ms, mh = sum(Es[kn]) / N, sum(Eh[kn]) / N; As, Ah = max(Es[kn]) - min(Es[kn]), max(Eh[kn]) - min(Eh[kn])
        EG[kn] = ((mh - ms) / (vh_ - vs_), (Ah / As - 1) / (vh_ - vs_) if As > 1e-6 else 0.0)
    yaz('üst gövdenin hız eğilimi (özne 16: %d döngü %.2f m/sn ↔ %d döngü %.2f m/sn): ' % (len(Ds), vs_, len(Dh), vh_) +
        '  '.join('%s ort %+.2f/m/sn genlik ×%+.2f/m/sn' % (kn, EG[kn][0], EG[kn][1]) for kn in UST))
    GENLIK = (0.5, 1.8)   # genliğin oranı sınırı (depar uzatmasında omuz karede ~15°: koşucunun omuzu en çok ~900°/sn)
    def ust_govde(v, b1):
        e = {}
        for kn in UST:
            y = evre(Bk['egri'][kn], Bk['beta'], b1); m = sum(y) / N; dv = v - vk
            g = min(GENLIK[1], max(GENLIK[0], 1 + EG[kn][1] * dv))
            e[kn] = [m + EG[kn][0] * dv + (x - m) * g for x in y]
        return e
    cikis = [{'ad': 'yuru', 'v': Bw['v'], 'beta': Bw['beta'], 'kadans': 2 / Bw['T'], 'adim': Bw['adim'] / Bw['bacak'], 'uzatma': False, 'yuru': True,
              'kaynak': 'CMU (%d döngü)' % Bw['n'], 'egri': {kn: Bw['egri'][kn][:] for kn in CK}}]
    # hızlı yürüyüş (1,75 m/sn; oyunda yürüyüş kipi 2 m/sn'ye kadar): şekil yürüyüş bandından, hıza göre değişim aynı kişinin (16) yavaş (< 1,3) ve
    # hızlı (> 1,5 m/sn) yürüyüşünden — bütün kanallarda ortalamanın kayması ve genliğin oranı (koşunun üst gövdesiyle aynı yol)
    W16 = [x for x in tum if x['ad'].split('_')[0] == '16' and x['v'] < 2.0]
    Ws, Wh = [x for x in W16 if x['v'] < 1.3], [x for x in W16 if x['v'] > 1.5]
    wvs, wvh = sum(x['v'] for x in Ws) / len(Ws), sum(x['v'] for x in Wh) / len(Wh)
    WEs, WEh = bakisim({kn: ortalama([x['orn'][kn] for x in Ws]) for kn in KANALLAR}), bakisim({kn: ortalama([x['orn'][kn] for x in Wh]) for kn in KANALLAR})
    vY = 1.75; e = {}; Tw = {}
    for kn in CK:
        ms, mh = sum(WEs[kn]) / N, sum(WEh[kn]) / N; As, Ah = max(WEs[kn]) - min(WEs[kn]), max(WEh[kn]) - min(WEh[kn])
        a_ = (Ah / As - 1) / (wvh - wvs) if As > 1e-6 else 0.0; b_ = (mh - ms) / (wvh - wvs); Tw[kn] = (b_, a_)
        y = Bw['egri'][kn]; m = sum(y) / N; dv = vY - Bw['v']; g = min(GENLIK[1], max(GENLIK[0], 1 + a_ * dv))
        e[kn] = [m + b_ * dv + (x - m) * g for x in y]
    bs = sum(x['beta'] for x in Ws) / len(Ws); bh = sum(x['beta'] for x in Wh) / len(Wh)
    byH = Bw['beta'] + (bh - bs) / (wvh - wvs) * (vY - Bw['v'])
    yaz('hızlı yürüyüşün eğilimi (özne 16: %d döngü %.2f m/sn ↔ %d döngü %.2f m/sn): ' % (len(Ws), wvs, len(Wh), wvh) +
        '  '.join('%s ort %+.2f genlik ×%+.2f /m/sn' % (kn, Tw[kn][0], Tw[kn][1]) for kn in CK) + '  temas payı %.3f → %.3f' % (bs, bh))
    cikis.append({'ad': 'yuruH', 'v': vY, 'beta': byH, 'kadans': 2 / Bw['T'] * (vY / Bw['v']) ** 0.5, 'adim': Bw['adim'] / Bw['bacak'] * (vY / Bw['v']) ** 0.5, 'uzatma': False, 'yuru': True,
                  'kaynak': 'yürüyüş bandı (CMU %d döngü) ve hız eğilimi (özne 16)' % Bw['n'], 'egri': e})
    for h in HZ:
        v = h / 10; b = rb_ozet[h]['beta']
        e = ust_govde(v, b)
        e['diz'] = rb_ozet[h]['diz'][:]
        uk = evre(Bk['egri']['uyluk'], Bk['beta'], b); k1, k0 = rb_egri('kalca', v, b), rb_egri('kalca', vk, b)
        e['uyluk'] = [uk[i] + k1[i] - k0[i] for i in range(N)]
        cikis.append({'ad': 'k%d' % h, 'v': v, 'beta': b, 'kadans': 2 / Bk['T'] * (v / vk) ** 0.45, 'adim': Bk['adim'] / Bk['bacak'] * (v / vk) ** 0.55,
                      'uzatma': False, 'kaynak': 'bacak RBDS (%d döngü) + CMU koşu uyluğu; üst gövde CMU koşu (%d döngü) ve hız eğilimi' % (rb_ozet[h]['n'], Bk['n']), 'egri': e})
    vd = 7.5
    mvb = sum(VR) / 3; mb = sum(rb_ozet[h]['beta'] for h in HZ) / 3
    egb = sum((x - mvb) * (rb_ozet[h]['beta'] - mb) for x, h in zip(VR, HZ)) / sum((x - mvb) ** 2 for x in VR)
    bd = max(0.24, mb + egb * (vd - mvb))
    e = ust_govde(vd, bd)
    e['diz'] = rb_egri('diz', vd, bd)
    k1, k0 = rb_egri('kalca', vd, bd), rb_egri('kalca', vk, bd); uk = evre(Bk['egri']['uyluk'], Bk['beta'], bd)
    e['uyluk'] = [uk[i] + k1[i] - k0[i] for i in range(N)]
    for kn in CK: e[kn] = sinirla(e[kn], *SINIR[kn])
    cikis.append({'ad': 'depar', 'v': vd, 'beta': bd, 'kadans': 2 / Bk['T'] * (vd / vk) ** 0.45, 'adim': Bk['adim'] / Bk['bacak'] * (vd / vk) ** 0.55, 'uzatma': True,
                  'kaynak': 'uzatma: bacak RBDS 2,5–4,5 doğrusu, üst gövde hız eğilimi (genlik %g–%g kat); sınırlı (%s)' % (GENLIK[0], GENLIK[1], ', '.join('%s %g…%g' % (k, a, b) for k, (a, b) in SINIR.items())),
                  'egri': e})
    yaz('')
    yaz('Tablo bantları (js/hareket-egrileri.js; derece, kalcaH ayaktaki kalça yüksekliğine oran):')
    for B in cikis:
        e = B['egri']; s0 = int(B['beta'] * N)
        yaz('  %-5s %.2f m/sn  temas payı %.3f  kadans %.2f  adım/bacak %.2f  %s%s' % (B['ad'], B['v'], B['beta'], B['kadans'], B['adim'], B['kaynak'], '  [UZATMA]' if B['uzatma'] else ''))
        B['F'] = {}
        for kn in CK:
            a0, K = fourier(e[kn]); kal = rms([fourier_deger(a0, K, i / N) for i in range(N)], e[kn])
            B['F'][kn] = [a0] + [c for ab in K for c in ab]
            yaz('     %-7s en az %7.2f  en çok %7.2f  ort %7.2f  salınımda en çok %7.2f  Fourier kalanı %.2f' % (kn, min(e[kn]), max(e[kn]), sum(e[kn]) / N, max(e[kn][s0:]), kal))
    if not A.yazma:
        def sayi(x, k):
            s = ('%.' + str(k) + 'f') % x
            s = s.rstrip('0').rstrip('.') if '.' in s else s
            return '0' if s in ('-0', '') else s
        sat = ['/* ============ Chairman — hareket eğrileri (A7, 2026-10-17; atıf kutuphane/J §J.12 "Kaynaklar — A7"): yalnız sayı tabloları ============',
               '   Üreten araclar/hareket-egrileri.py (elle düzenlenmez: `python -I araclar/hareket-egrileri.py araclar/veri`). Ham veri depoda yoktur; burada',
               '   yalnız adım döngüsünün ortalama eklem açısı eğrileri (Fourier katsayıları) ve döngü sayıları durur (kullanıcı kararı 2026-10-16).',
               '   Kaynaklar: CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu; "The data used in this project was obtained from mocap.cs.cmu.edu.',
               '   The database was created with funding from NSF EIA-0196217."); Fukuchi RK, Fukuchi CA, Duarte M (2017) A public dataset of running',
               '   biomechanics and the effects of running speed on lower extremity kinematics and kinetics. PeerJ 5:e3298 — veri figshare',
               '   10.6084/m9.figshare.4543435, CC BY 4.0.',
               '   Kanallar (derece; eklemlerin yerinden, gidiş yönü ve düşeyle): uyluk (kalça → diz, aşağı düşeyle, + öne), diz (bükülme, 0 düz), omuz (omuz → dirsek,',
               '   gövde eksenine göre, + öne), dirsek (bükülme), egim (kalça eklemleri → omuzlar, düşeyle, + öne), legen ve gogus (kalça ve omuz hattının yatay',
               '   açısı; + sağ yan önde), kalcaH (kalça eklemlerinin yüksekliği / ayaktaki yükseklik). Döngü sağ ayağın basışından (u = 0); duruş u < beta;',
               '   sol yan aynı eğrinin yarım döngü kaymışıdır (legen, gogus işaret değiştirir). Değer(u) = F[0] + Σ (F[2k−1]·cos 2πku + F[2k]·sin 2πku), k = 1..6.',
               '   Bantlar hıza göre karışır (yürüyüş bantları yuru: true, koşu bantlarıyla gecis aralığında birleşir); uzatma: true bant verinin dışıdır (depar). */',
               'const HAREKET_EGRI={surum:1,harmonik:%d,gecis:[2,2.5],kanal:[%s],' % (HARM, ','.join("'%s'" % k for k in CK)), ' bant:[']
        for j, B in enumerate(cikis):
            F = ','.join('%s:[%s]' % (kn, ','.join(sayi(x, 4 if kn == 'kalcaH' else 2) for x in B['F'][kn])) for kn in CK)
            sat.append("  {ad:'%s',v:%s,beta:%s,kadans:%s,adim:%s,%suzatma:%s,F:{%s}}%s" % (B['ad'], sayi(B['v'], 2), sayi(B['beta'], 3), sayi(B['kadans'], 2),
                       sayi(B['adim'], 3), 'yuru:true,' if B.get('yuru') else '', 'true' if B['uzatma'] else 'false', F, ',' if j < len(cikis) - 1 else ''))
        sat.append(' ],')
        sat.append(" kaynak:'CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu; NSF EIA-0196217); Fukuchi, Fukuchi & Duarte 2017, PeerJ 5:e3298, figshare 10.6084/m9.figshare.4543435 (CC BY 4.0)'};")
        io.open(os.path.join(kok, 'js', 'hareket-egrileri.js'), 'w', encoding='utf-8', newline='').write('\r\n'.join(sat) + '\r\n')
        yaz('yazıldı: js/hareket-egrileri.js')
    # ---------- A7c: vuruş (CMU 10, 11, 74) — temas anı vuran ayağın (ayak ucu) en yüksek yatay hızı; −0,5 … +0,4 sn, 60 Hz'e ----------
    yaz('')
    yaz('Vuruş (CMU; temas = hız tepesinden önce vuran bileğin destek bileğini 0,1 m geçtiği kare; gövdenin önü kalça hattına dik, ayağın gidişi yönünde):')
    VK = ['uyluk', 'diz', 'destekDiz', 'egim']; vurus = []
    for ad, yol in vurus_dosya:
        oz = ad.split('_')[0]; isk = iskeletler[oz]; J = [ileri_kin(isk, k) for k in oku_amc(yol)]; n = len(J); dt = 1.0 / A.hz
        hiz = {}
        for s in 'rl':
            t = [j[s + 'foot'] for j in J]; hiz[s] = [0.0] + [math.hypot(t[i][0] - t[i - 1][0], t[i][2] - t[i - 1][2]) / dt for i in range(1, n)]
        sifir = dinlenme[oz] + ort_fark   # gövde eğiminin sıfırı (yürüyüşü olmayan özne: dinlenme pozu + yürüyüşlü öznelerin ortalama farkı)
        son = -999; bulunan = []
        tepe = sorted(((max(hiz['r'][i], hiz['l'][i]), i) for i in range(60, n - 48)), reverse=True)
        for v_, i in tepe:
            if v_ < 6.0: break
            if any(abs(i - j) < 120 for j in bulunan): continue
            bulunan.append(i)
        for i in sorted(bulunan):
            s = 'r' if hiz['r'][i] >= hiz['l'][i] else 'l'; o = 'l' if s == 'r' else 'r'
            t0, t1 = J[i - 1][s + 'foot'], J[i + 1][s + 'foot']; gd = (t1[0] - t0[0], 0.0, t1[2] - t0[2])
            hk = fark(J[i]['rhipjoint'], J[i]['lhipjoint']); f = capraz((0.0, 1.0, 0.0), hk); L = math.hypot(f[0], f[2]) or 1; f = (f[0] / L, 0.0, f[2] / L)
            if nokta(f, gd) < 0: f = (-f[0], 0.0, -f[2])
            # temas: hız tepesinden geriye, vuran bilek destek bileğini 0,1 m geçtiği kare (topsuz kayıtta ayak temastan sonra da hızlanır)
            tepe_i = i
            for k in range(i, max(60, i - 40), -1):
                if nokta(fark(J[k][s + 'tibia'], J[k][o + 'tibia']), f) < 0.1: i = k + 1; break
            if i + 48 >= n: continue
            u = (0.0, 1.0, 0.0); seri = []
            for k in range(i - 60, i + 49, 2):
                j = J[k]; kc, oc = orta(j['rhipjoint'], j['lhipjoint']), orta(j['rclavicle'], j['lclavicle']); g = fark(oc, kc)
                seri.append([sag(fark(j[s + 'femur'], j[s + 'hipjoint']), f, u), aci3(fark(j[s + 'femur'], j[s + 'hipjoint']), fark(j[s + 'tibia'], j[s + 'femur'])),
                             aci3(fark(j[o + 'femur'], j[o + 'hipjoint']), fark(j[o + 'tibia'], j[o + 'femur'])), math.degrees(math.atan2(nokta(g, f), nokta(g, u))) - sifir])
            vurus.append({'ad': ad, 'yan': s, 'hiz': hiz[s][tepe_i], 'seri': seri})
            yaz('  %-6s %s ayak, tepe temastan %+.0f ms, ayak ucu %.1f m/sn  uyluk geride en çok %.0f° · temasta %.0f° · takipte en çok %.0f° · diz geri salınımda en çok %.0f°' % (
                ad, 'sağ' if s == 'r' else 'sol', (tepe_i - i) * dt * 1000, hiz[s][tepe_i], min(x[0] for x in seri[:31]), seri[30][0], max(x[0] for x in seri[30:]), max(x[1] for x in seri[:31])))
    if vurus:
        VV = [[sum(v['seri'][t][c] for v in vurus) / len(vurus) for c in range(4)] for t in range(55)]
        yaz('  ortalama (%d vuruş; sn: uyluk / diz / destek diz / eğim): ' % len(vurus) + '  '.join('%+.2f %.0f/%.0f/%.0f/%.0f' % ((t - 30) / 60, *VV[t]) for t in range(0, 55, 6)))
        if A.vurus:
            import json
            O = json.load(io.open(A.vurus, encoding='utf-8')); C = O.get('vurusEgri') or []
            yaz('')
            yaz('Çizim ↔ veri (A7c; %s; vuruş eğrisi RMS °, −0,5 … +0,4 sn):' % os.path.basename(A.vurus))
            for tur in ('sut', 'pas', 'uzun', 'ilk'):
                D = [c for c in C if c['tur'] == tur and len(c['seri']) == 55]
                if not D: continue
                M = [[sum(d['seri'][t][c] for d in D) / len(D) for c in range(4)] for t in range(55)]
                r = [math.sqrt(sum((M[t][c] - VV[t][c]) ** 2 for t in range(55)) / 55) for c in range(4)]
                yaz('  %-4s %3d vuruş: RMS %s  | uyluk geride en çok %.0f / %.0f · takipte en çok %.0f / %.0f · diz geri salınımda en çok %.0f / %.0f · destek diz temasta %.0f / %.0f · eğim temasta %.0f / %.0f' % (
                    tur, len(D), ' · '.join('%s %.1f' % (VK[c], r[c]) for c in range(4)), min(x[0] for x in M[:31]), min(x[0] for x in VV[:31]), max(x[0] for x in M[30:]), max(x[0] for x in VV[30:]),
                    max(x[1] for x in M[:31]), max(x[1] for x in VV[:31]), M[30][2], VV[30][2], M[30][3], VV[30][3]))
    io.open(os.path.join(kok, 'araclar', 'son-egri.txt'), 'w', encoding='utf-8').write('\n'.join(R) + '\n')
    return bant_sonuc, rb_ozet, tum, iskeletler, vurus_dosya

if __name__ == '__main__':
    ana()
