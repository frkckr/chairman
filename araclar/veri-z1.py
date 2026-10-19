"""Chairman — Z1 açık veri ölçümü (2026-10-19; FUTBOL_KUTUPHANESI §9, Z1 planı "Z1-v").

Kullanım:  python -I -X utf8 araclar/veri-z1.py araclar/veri [--hizli]
  araclar/veri/skillcorner/opendata-master.zip  (MIT)        — 20 maçın dynamic_events.csv'si (koşu etiketleri, kare 10 Hz)
  araclar/veri/wyscout/events.zip, matches.zip  (CC BY 4.0)  — 1.941 maçın olayları (yüzde ölçeği, saniye)
  araclar/veri/idsse/*.xml                      (CC BY 4.0)  — iki maçın 25 Hz konumu ve olayları
Güvensiz veri kuralı (CLAUDE.md, A7): dosyalar yalnız okunur, zip açılmaz (akışla okunur), XML'de DOCTYPE/ENTITY varsa durur, iterparse ile
akışla ve öğeler temizlenerek okunur. Çıktı yalnız yuvarlanmış özet sayıdır (ekrana); maç, oyuncu ya da takım kimliği yazılmaz.

Ölçülenler (Z1'in dört ilkeli için):
  A. SkillCorner: koşu türlerinin takım·90 dk ve takım·oyun dakikası başına sıklığı; hedeflenen (pas yapılan) koşuda koşu başı − pas çıkışı
     (Δt = koşunun ilk karesi − pasçının sahipliğinin bittiği kare; negatif: koşu pastan önce), türe göre ortanca, %10–90, alındı payı.
  B. Wyscout: takım·maç başına ver-kaç (A→B→A, 3 sn), hızlı üçlü (A→B→C, C ≠ A, ileri; üçüncü adamın olay verisindeki yaklaşığı), geri çevirme
     (kale çizgisine yakın kanattan geriye ve ortaya pas), akıllı pas (ara pası); isabet payları; 3 sn içinde şut.
  C. IDSSE: 25 Hz takipte, alıcısı yazılı başarılı açık oyun paslarında alıcının koşusu (≥ 15 km/sa, ≥ 0,7 sn) başı − pasın topun yörüngesinden
     bulunan çıkış anı; alıcı pas anında ofsayt çizgisine 3 m yakın ya da ötesindeyse "derin".
"""
import sys, os, io, csv, json, zipfile, collections, math, statistics
from datetime import datetime, timezone
import xml.etree.ElementTree as ET

KOK = sys.argv[1] if len(sys.argv) > 1 else os.path.join('araclar', 'veri')
HIZLI = '--hizli' in sys.argv


def yuzde(a, q):
    if not a:
        return float('nan')
    s = sorted(a)
    return s[min(len(s) - 1, int(q * len(s)))]


def ozet(a):
    if not a:
        return 'n 0'
    return f'ortanca {statistics.median(a):+.2f} · %10 {yuzde(a, 0.1):+.2f} · %90 {yuzde(a, 0.9):+.2f} · n {len(a)}'


def dogru(v):
    return str(v).strip().lower() == 'true'


# ---------------------------------------------------------------- A. SkillCorner
def skillcorner():
    yol = os.path.join(KOK, 'skillcorner', 'opendata-master.zip')
    if not os.path.exists(yol):
        print('SkillCorner yok:', yol)
        return
    say = collections.Counter()           # alt tür → koşu sayısı (bütün maçlar)
    hedef = collections.Counter()         # alt tür → hedeflenen
    alindi = collections.Counter()
    dt = collections.defaultdict(list)    # alt tür → Δt (sn)
    takim_mac = 0
    oyun_dk = 0.0
    with zipfile.ZipFile(yol) as z:
        adlar = sorted(n for n in z.namelist() if n.endswith('_dynamic_events.csv'))
        for ad in adlar:
            mj = ad.replace('_dynamic_events.csv', '_match.json')
            try:
                m = json.loads(z.read(mj).decode('utf-8'))
                # oyun süresi: iki takımın topa sahip olma süreleri (dk); bilinmezse 55 dk varsayılır
                pt = 0.0
                for k in ('home_team_playing_time', 'away_team_playing_time'):
                    v = m.get(k)
                    if isinstance(v, dict):
                        v = v.get('minutes_tip') or v.get('minutes') or v.get('total')
                    if isinstance(v, (int, float)):
                        pt += float(v)
                oyun_dk += pt if 30 < pt < 90 else 55.0
            except Exception:
                oyun_dk += 55.0
            takim_mac += 2
            # iki geçiş: önce sahiplik olaylarının bitiş karesi (pasın çıktığı kare), sonra koşular
            sahip_son = {}
            kosular = []
            with z.open(ad) as f:
                r = csv.DictReader(io.TextIOWrapper(f, encoding='utf-8'))
                for d in r:
                    et = d.get('event_type')
                    if et == 'player_possession':
                        try:
                            sahip_son[d['event_id']] = float(d['frame_end'])
                        except (ValueError, KeyError):
                            pass
                    elif et == 'off_ball_run':
                        kosular.append((d.get('event_subtype') or '?', dogru(d.get('targeted')), dogru(d.get('received')),
                                        d.get('frame_start'), d.get('associated_player_possession_event_id')))
            for a, hd, al, fs, pid in kosular:
                say[a] += 1
                if hd:
                    hedef[a] += 1
                    if al:
                        alindi[a] += 1
                    try:
                        fe = sahip_son.get(pid)
                        if fe is not None:
                            dt[a].append((float(fs) - fe) / 10.0)
                    except (TypeError, ValueError):
                        pass
    print(f'\nA. SkillCorner: {len(adlar)} maç, {takim_mac} takım·maç; takım·oyun dakikası toplamı ≈ {oyun_dk:.0f} (iki takımın sahiplik süresi)')
    print('   koşu türü                 takım·90dk   oyun dk başına (iki takım)   hedeflenen %   alındı % (hedefte)   Δt koşu başı − pas çıkışı (sn)')
    for a, n in say.most_common():
        per90 = n / takim_mac
        perdk = n / max(1.0, oyun_dk)
        hd = hedef[a]
        print(f'   {a:<25} {per90:>9.1f}   {perdk:>10.2f}                   {100 * hd / n:>6.1f}        {100 * alindi[a] / max(1, hd):>6.1f}          {ozet(dt[a])}')
    tum = [x for a in dt for x in dt[a]]
    print('   hepsi (hedeflenen):', ozet(tum), '· erken (≤ −0,3) %', f'{100 * sum(1 for x in tum if x <= -0.3) / max(1, len(tum)):.1f}')


# ---------------------------------------------------------------- B. Wyscout
TOPLA = {'Pass', 'Shot', 'Others on the ball', 'Free Kick'}


def wyscout():
    yol = os.path.join(KOK, 'wyscout', 'events.zip')
    if not os.path.exists(yol):
        print('Wyscout yok:', yol)
        return
    toplam = collections.Counter()
    maclar = set()
    with zipfile.ZipFile(yol) as z:
        adlar = sorted(z.namelist())
        if HIZLI:
            adlar = [a for a in adlar if 'World_Cup' in a or 'European' in a]
        for ad in adlar:
            with z.open(ad) as f:
                veri = json.load(io.TextIOWrapper(f, encoding='utf-8'))
            mac = collections.defaultdict(list)
            for e in veri:
                mac[e['matchId']].append(e)
            del veri
            for mid, E in mac.items():
                maclar.add(mid)
                E.sort(key=lambda e: (e['matchPeriod'], e['eventSec']))
                # topla olaylar (alıcı çıkarımı için): pas, şut, topla diğerleri, duran top; hücum düellosu
                T = [e for e in E if e['eventName'] in TOPLA or e.get('subEventName') == 'Ground attacking duel']
                for i, e in enumerate(T):
                    if e['eventName'] != 'Pass':
                        continue
                    tags = {t['id'] for t in e.get('tags', [])}
                    if 1801 not in tags:
                        continue
                    p = e['positions']
                    if len(p) < 2:
                        continue
                    x0, y0, x1, y1 = p[0]['x'], p[0]['y'], p[1]['x'], p[1]['y']
                    # alıcı: aynı takımın sonraki topla olayı (3 sn içinde)
                    j = i + 1
                    if j >= len(T) or T[j]['teamId'] != e['teamId'] or T[j]['matchPeriod'] != e['matchPeriod'] or T[j]['eventSec'] - e['eventSec'] > 4:
                        continue
                    A, B = e['playerId'], T[j]['playerId']
                    if B == A:
                        continue
                    toplam['pas_tamam'] += 1
                    if e.get('subEventName') == 'Smart pass':
                        toplam['akilli'] += 1
                    # geri çevirme: kale çizgisine ≤ 12 % (≈ 12,6 m) ve kanattan (y < 25 ya da > 75), geriye (x1 < x0 − 2) ve ortaya (30–70), x1 ≥ 75
                    if x0 >= 88 and (y0 < 25 or y0 > 75) and x1 < x0 - 2 and x1 >= 75 and 30 <= y1 <= 70 and e.get('subEventName') in ('Simple pass', 'Cross', 'Smart pass'):
                        toplam['geri_cevirme'] += 1
                        # 3 sn içinde aynı takımın şutu
                        for k in range(j, min(len(T), j + 6)):
                            if T[k]['teamId'] == e['teamId'] and T[k]['eventName'] == 'Shot' and T[k]['eventSec'] - e['eventSec'] <= 3:
                                toplam['geri_cevirme_sut'] += 1
                                break
                    # B'nin sonraki pası (en çok bir B dokunuşu araya girerek)
                    k = j
                    nB = 0
                    while k < len(T) and T[k]['playerId'] == B and T[k]['eventName'] != 'Pass' and nB < 2:
                        k += 1
                        nB += 1
                    if k >= len(T) or T[k]['playerId'] != B or T[k]['eventName'] != 'Pass' or T[k]['teamId'] != e['teamId']:
                        continue
                    e2 = T[k]
                    if e2['eventSec'] - e['eventSec'] > 3 or e2['matchPeriod'] != e['matchPeriod']:
                        continue
                    t2 = {t['id'] for t in e2.get('tags', [])}
                    q = e2['positions']
                    if len(q) < 2:
                        continue
                    # B'nin pasının alıcısı
                    m2 = k + 1
                    if m2 >= len(T) or T[m2]['teamId'] != e['teamId'] or T[m2]['eventSec'] - e2['eventSec'] > 4:
                        alici2 = None
                    else:
                        alici2 = T[m2]['playerId']
                    if alici2 == A:
                        toplam['verkac'] += 1
                        if 1801 in t2:
                            toplam['verkac_tamam'] += 1
                        if nB == 0:
                            toplam['verkac_tek'] += 1
                    elif alici2 is not None and x1 - x0 >= 6 and q[1]['x'] >= q[0]['x'] - 3:
                        toplam['ucuncu'] += 1
                        if 1801 in t2:
                            toplam['ucuncu_tamam'] += 1
    n = len(maclar)
    tm = 2 * n
    print(f'\nB. Wyscout: {n} maç ({tm} takım·maç); takım·maç başına (90 dk):')
    for k, ad in (('pas_tamam', 'tamamlanan pas'), ('akilli', 'akıllı pas (ara)'), ('verkac', 'ver-kaç A→B→A (3 sn)'), ('verkac_tamam', '  dönüşü isabetli'),
                  ('verkac_tek', '  B tek dokunuş'), ('ucuncu', 'hızlı üçlü A→B→C ileri (üçüncü adam yaklaşığı)'), ('ucuncu_tamam', '  ikinci pas isabetli'),
                  ('geri_cevirme', 'geri çevirme (kanattan, geriye, ortaya)'), ('geri_cevirme_sut', '  3 sn içinde şut')):
        print(f'   {ad:<48} {toplam[k] / max(1, tm):>8.2f}')


# ---------------------------------------------------------------- C. IDSSE
def zaman(s):
    return datetime.fromisoformat(s).astimezone(timezone.utc).timestamp()


def guvenli(yol):
    with open(yol, 'rb') as g:
        bas = g.read(4096)
    if b'<!DOCTYPE' in bas or b'<!ENTITY' in bas:
        raise RuntimeError('DOCTYPE/ENTITY bulundu, okunmadı: ' + yol)


def idsse():
    kok = os.path.join(KOK, 'idsse')
    if not os.path.isdir(kok):
        print('IDSSE yok:', kok)
        return
    maclar = sorted(f.split('_DFL-MAT-')[1][:-4] for f in os.listdir(kok) if f.startswith('DFL_04_03_positions'))
    tum_derin, tum_ileri = [], []
    for mid in maclar:
        dosya = {t: os.path.join(kok, f) for f in os.listdir(kok) if mid in f for t in ('bilgi', 'olay', 'konum')
                 if (t == 'bilgi' and 'matchinformation' in f) or (t == 'olay' and 'events_raw' in f) or (t == 'konum' and 'positions_raw' in f)}
        for y in dosya.values():
            guvenli(y)
        # oyuncu → takım
        takim = {}
        for _, el in ET.iterparse(dosya['bilgi'], events=('end',)):
            if el.tag == 'Team':
                tid = el.get('TeamId')
                for p in el.iter('Player'):
                    takim[p.get('PersonId')] = tid
        # paslar
        paslar = []
        for _, el in ET.iterparse(dosya['olay'], events=('end',)):
            if el.tag != 'Event':
                continue
            pl = el.find('Play')
            if pl is not None and pl.find('Pass') is not None and pl.get('Recipient') and pl.get('Evaluation') == 'successfullyCompleted' and pl.get('FromOpenPlay') == 'true':
                paslar.append((zaman(el.get('EventTime')), pl.get('Player'), pl.get('Recipient'), pl.get('Team')))
            el.clear()
        # konumlar: kişi ve yarı başına (t, x, y, s) — 25 Hz
        seri = collections.defaultdict(lambda: ([], [], [], []))
        top = {}
        for _, el in ET.iterparse(dosya['konum'], events=('end',)):
            if el.tag == 'FrameSet':
                bolum = el.get('GameSection')
                kim = el.get('PersonId')
                tk = el.get('TeamId')
                T, X, Y, S = seri[(bolum, kim)]
                for fr in el.iter('Frame'):
                    T.append(zaman(fr.get('T')))
                    X.append(float(fr.get('X')))
                    Y.append(float(fr.get('Y')))
                    S.append(float(fr.get('S') or 0.0))
                if tk and tk.upper() == 'BALL':
                    top[bolum] = kim
                el.clear()
        # yarı başına hücum yönü: kalecinin (en geride duranın) ortalama x'i
        bolumler = sorted({b for (b, _) in seri})

        def konum_i(T, t):
            # 25 Hz düzenli: ilk kareden indeks
            if not T:
                return -1
            i = int(round((t - T[0]) * 25))
            return i if 0 <= i < len(T) else -1
        yon = {}
        for b in bolumler:
            for tid in set(takim.values()):
                xs = []
                for (bb, kim), (T, X, Y, S) in seri.items():
                    if bb == b and takim.get(kim) == tid and X:
                        xs.append(sum(X) / len(X))
                if xs:
                    gk = min(xs, key=lambda x: -abs(x))   # en uçtaki ortalama: kaleci
                    yon[(b, tid)] = -1 if gk > 0 else 1   # kalesi +x'teyse hücum −x yönünde
        n_der = 0
        for (t, A, B, tid) in paslar:
            # yarı: pasın zamanı hangi yarının aralığında
            b = None
            for bb in bolumler:
                kt = top.get(bb)
                if kt and seri[(bb, kt)][0] and seri[(bb, kt)][0][0] - 5 <= t <= seri[(bb, kt)][0][-1] + 5:
                    b = bb
                    break
            if b is None or (b, A) not in seri or (b, B) not in seri or top.get(b) is None:
                continue
            TB, XB, YB, SB = seri[(b, top[b])]
            TA, XA, YA, _ = seri[(b, A)]
            TR, XR, YR, SR = seri[(b, B)]
            # pasın çıkışı: olay saatinin ±2 sn'sinde top pasçıya ≤ 2 m iken top hızı (km/sa) en çok artan kare
            en, eni = -1e9, -1
            for k in range(-50, 51):
                i = konum_i(TB, t + k / 25)
                if i < 1 or i + 5 >= len(TB):
                    continue
                ia = konum_i(TA, TB[i])
                if ia < 0:
                    continue
                if math.hypot(XB[i] - XA[ia], YB[i] - YA[ia]) > 2.0:
                    continue
                art = SB[i + 5] - SB[i]
                if art > en:
                    en, eni = art, i
            if eni < 0 or en < 10:
                continue
            tc = TB[eni]
            ir = konum_i(TR, tc)
            if ir < 0:
                continue
            # alıcının koşusu: çıkışta süren ya da 1 sn içinde başlayan ≥ 15 km/sa seri, ≥ 0,7 sn
            j = ir
            while j < len(SR) and j < ir + 25 and SR[j] < 15:
                j += 1
            if j >= len(SR) or SR[j] < 15:
                continue
            bas = j
            while bas > 0 and SR[bas - 1] >= 15:
                bas -= 1
            son = j
            while son + 1 < len(SR) and SR[son + 1] >= 15:
                son += 1
            if (son - bas + 1) < 0.7 * 25:
                continue
            dtt = (TR[bas] - tc)
            d = yon.get((b, tid), 1)
            # ileri pas: alıcı pasçıdan ≥ 5 m ileride
            ia = konum_i(TA, tc)
            if (XR[ir] - XA[ia]) * d < 5:
                continue
            tum_ileri.append(dtt)
            # ofsayt çizgisi: rakibin sondan ikinci oyuncusu (çıkış anında)
            us = []
            for (bb, kim), (T, X, Y, S) in seri.items():
                if bb != b or takim.get(kim) in (None, tid) or kim == top[b]:
                    continue
                ii = konum_i(T, tc)
                if ii >= 0:
                    us.append(X[ii] * d)
            us.sort(reverse=True)
            if len(us) >= 2 and XR[ir] * d >= us[1] - 3:
                tum_derin.append(dtt)
                n_der += 1
        print(f'   IDSSE maç {mid[-3:]}: başarılı açık oyun pası {len(paslar)}, ileri pas koşulu {len(tum_ileri)} (birikimli), derin {n_der}')
    print('\nC. IDSSE (25 Hz): alıcının koşusu başı − pasın çıkışı (sn)')
    print('   ileri paslar (alıcı ≥ 5 m önde, koşuyor):', ozet(tum_ileri), '· erken (≤ −0,3) %', f'{100 * sum(1 for x in tum_ileri if x <= -0.3) / max(1, len(tum_ileri)):.1f}')
    print('   derin paslar (alıcı çizgiye ≤ 3 m ya da ötesinde):', ozet(tum_derin), '· erken %', f'{100 * sum(1 for x in tum_derin if x <= -0.3) / max(1, len(tum_derin)):.1f}')


if __name__ == '__main__':
    skillcorner()
    wyscout()
    idsse()
