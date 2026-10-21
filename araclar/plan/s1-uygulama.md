<!-- Üretildi 2026-10-21: Claude'un 2026-10-20 oto mod oturumunda tasarım ajanlarının çıkardığı ve birleştirdiği uygulama planı. Kaynak JSON'u aynı klasörde (<tur>-tasarim.json: alan tasarımları). Kabul ve sıra kullanıcı onaylı programın (FUTBOL_KUTUPHANESI §12.13) içindedir; bu dosya uygulayıcı için ayrıntıdır, belge değildir. -->

# S1 — uygulama planı (2026-10-20; Claude'un tasarımı, kullanıcı onaylı program §12.13)

**Durum (2026-10-21 sabah, dizüstü):** Dal `claude/motor-s1` (ana ağaç). Yapıldı: S1-0 (7807d9d), S1a (2523afa), S1d (73347a7), S1b (75515df). Kaldı: S1c (gol sonrası akış), S1e (korner rutini), inceleme ve düzeltme, kapanış (S1-K). Birebirlik tabanı: K1 ucunda `araclar/taban/k1.json` (`protokol` 0 ile `--ayni`).

## Plan

S1 UYGULAMA PLANI: sahne protokolleri
Kaynaklar: FUTBOL_KUTUPHANESI §12.13; kutuphane/L L.1–L.6 ve L.9; F.8. Tempo B kullanıcı onaylı: penaltı ~40 sn, gol sonrası ~35 sn (gerçek sn; duruşta durusSaat 2).

0. ÖN KOŞUL VE DAL
- K1 kapanmış olmalı: tur/k1 etiketi var, main K1'in ucunda. Dal claude/motor-s1, K1'in ucundan açılır.
- "K1 tabanı": K1 kapanışında yazılan araclar/taban/k1.json. K1 sonucu değiştirmediyse bu dosya z5-2.json'dur.
- "K1 animasyon tabanı": K1'in devam notunda yazan *-anm.json.
- Çizim bu turda değiştiği için turun başında `node araclar/karsilastir/dondur.js k1` çalıştırılır (önce kopyası).
- Sağlıkçıların giriş-çıkışı (L.9 madde 5) K1'de uygulandı (js/mac-sakatlik.js saglikciGit/saglikciEve). S1'de bunun için yalnız bilgi ölçüsü ve "düdük sakatlık bekleyişini bekler" kuralı vardır.
- Z10'a kalanlar: kalecinin 8 sn sayımı, çoklu top, VAR varyantları.

1. ÇAKIŞMA ÇÖZÜMLERİ VE ORTAK MİMARİ (bağlayıcı; tasarımlardaki farklı adlar bunlarla değişir)

1.1 Dosya
Yeni motor dosyası js/mac-sahne.js: S1 sahne protokolleri, akış adı 'S1'.
- index.html'de js/mac-sakatlik.js'ten sonra, js/mac-senaryo.js'ten önce yüklenir.
- motor-yukle.js ve ad-denetimi.js betik listesini index.html'den okur; başka liste yok.
- Beş alanın bütün yeni Match yöntemleri bu dosyada, Object.assign(Match.prototype,{…}) içinde durur.
- Eski dosyalara yalnız korumalı tek satırlık kancalar girer: mac-durantop.js, mac-kurallar.js, mac-motoru.js, mac-takim.js, mac-mudahale.js. Böylece bit 0 bütünlüğü tek dosyada denetlenir.
- Tasarımlarda mac-durantop.js'e (S1a, S1b, S1c, S1e) ya da mac-kurallar.js'e (S1d) yazılması önerilen yöntemler buraya taşınır.

1.2 MOTOR_AYAR
Tek anahtar: protokol (bit maskesi).
- Bildirim js/mac-motoru.js'te yeni grupta: /* S1 — js/mac-sahne.js */.
- Değer js/mac-sahne.js'te ayarEkle('S1',{…}) ile atanır.
- Üst düzey sabit: const S1_BIT=Object.freeze({SERBEST:1,KART:2,PENALTI:4,GOL:8,ODAK:16,RUTIN:32,RUTIN2:64}).

| Bit | Alan | Kapsam | Gerektirdiği |
|---|---|---|---|
| 1 | S1a | Seremonili barajlı serbest vuruş | sahne&1 ve sahne&4 |
| 2 | S1d | Kart sahnesi; seremonisi dahil (tasarımın bit 4'ü burada) | — |
| 4 | S1b | Penaltı sahnesi | sahne&1 |
| 8 | S1c | Gol sonrası akış: sevinç türleri, top zinciri, hakemler, Law 8, düdüklü santra | — |
| 16 | S1c | Bakış odağı (sonucu değiştirmez) | 8 |
| 32 | S1e | Korner ve kenar (kutu dolumu dahil) kullananının rutini | sahne&1 |
| 64 | S1e | Rutinin barajlı (S1a) ve penaltı (S1b) kullananına düdüklü genişlemesi | 32 ve ilgili alan |

- Her alt adımın sonunda protokol varsayılanı o ana dek uygulanan bitlerin toplamıdır: S1-0 → 0, S1a → 1, S1d → 3, S1b → 7, S1c → 31, S1e → 127.
- protokol 0 iken motor K1 ile birebirdir.
- Tasarımların maske anahtarları kullanılmaz: sahne&16/32, golSahne, kartSahne ve kRutin (maske olarak).

Parametre anahtarları (birer nesne; her biri kendi adımında bildirilip atanır):

| Alan | Anahtar | Not |
|---|---|---|
| S1a | seremoni | Tasarımdaki gibi |
| S1d | kartAyar | {tarz, kalabalik, hiz, zaman}: tasarımdaki kartTarz, kartKalabalik, kartHiz ve kartZaman tek nesnede |
| S1b | penaltiSahne | Tasarımdaki alanlar |
| S1c | golTempo | Tasarımdaki gibi |
| S1e | kRutin | {sure, varyant}: tasarımdaki kRutinSure ve kRutinVaryant tek nesnede |

- MAC_DENEME_AYAR sığ atar (Object.assign). İç içe bir değer taranacaksa nesne bütün olarak verilir.

1.3 Tohum (h2) kuralı
- S1 kodu this.rast()/normal() çekmez. Mevcut çekimler (itirazEt, zamanGecirEk) yerinde kalır.
- sahneOzet içinde this.t vardır. Bu yüzden yalnız kurulum anında, bir kez çağrılır; sonuç alanın tohumuna çevrilir: s1Tohum(v)=(v·2147483647)|0. Sonraki her karar h2(tohum, i) ile verilir. Ana zar dizisi kaymaz.
- Mevcut sahneOzet tuzları 0, 1, 4, 5, 6, 7, 8 dolu.

| Alan | Tohum | Kararlar |
|---|---|---|
| S1a | H.s = s1Tohum(sahneOzet(du,20)) | 1–16; üye 100+sira; kıpırtı h2(H.s+131·p.n, ⌊2·du.t⌋) |
| S1b | P.s = s1Tohum(sahneOzet(du,21)) | Tasarımın i'leri; oyuncu 100+n+11·team+1000·k |
| S1d | Kendi kartOzet(k,tuz) (k.no ile) | — |
| S1c | Kendi golOzet(c,tuz) | — |
| S1e | Kendi kr.oz (tuz 41) | u(k)=h2(oz,7k+5) |

1.4 Düdük ön koşulu (ortak)
Duruş (du) alanları:
- du.dudukGerek: 'baraj' | 'penalti' | 'kart'. Kuran: S1a, S1b ya da S1d.
- du.dudukT (düdüğün anı) ve du.dudukBek (düdükten kullanıma bekleme).
- du.dudukCalindi: mevcut alan. Dolu olduğu için durusKullan'daki eski düdük bir daha çalmaz.
- du.s1Sure: true ise sahnenin süre kapısını sahne planı verir.
- S1d'nin alanları: du.kartS, du.kartBitT, du.kartDudukT, du.kartBek, du.kartTekrar, du.zgGoruldu.

Ortak yöntemler (js/mac-sahne.js):
- dudukOnKosul(du) = !refs[0].kartSira && !sakatlikBekletir() && !(degisiklik && !degisiklik.girdi).
- dudukCal(du,bek):
  - du.dudukT=du.t; du.dudukBek=bek; du.dudukCalindi=true;
  - refs[0].eylem={ad:'duduk',t:0,sure:0.8};
  - on('duduk',{tur:du.tur, sinif:du.sinif||null, seremoni:true, bek, sahip:du.dudukGerek}).
- s1DudukKapisi(du,tk):

```
const ag=du.zorlaHazir||28;
if(refs[0].kartSira&&(protokol&KART)&&du.t<ag+10)return false;   // kart bitmeden yok; mutlak ağ +10
if(du.dudukT==null){
  if(du.t>=ag-2){this.dudukCal(du,0.5);return false;}            // düdüksüz kullanım hiç yok
  if(du.dudukGerek==='kart'||du.kartTekrar){
    if(du.kartBitT==null||du.t<du.kartBitT+du.kartDudukT||!this.dudukOnKosul(du))return false;
    this.dudukCal(du,du.kartBek);du.kartTekrar=false;}
  return false;}                                                  // baraj/penaltı: düdüğü sahnenin evre makinesi çalar
return du.t>=du.dudukT+du.dudukBek;
```

duranHazirMi iskeleti (mac-durantop.js; S1-0'da korumalı eklemelerle kurulur, bayraklar yokken birebir):
- sahneT bloğunda:
  - `if(du.kr){if(!du.kr.hazir)return false;} else if(!du.s1Sure&&du.t<son+(du.zgEk||0))return false;`
  - Sprey kapısı: `if(du.hk&&!du.hk.s1&&(…eski…))return false;`
- Geri noktası şartındaki `du.hazirT>H+2` muafiyeti yalnız `!du.kr` iken geçerlidir.
- Korner/kenar 'kol' bloğu yalnız `!du.kr` iken çalışır.
- 'return true'dan hemen önce: `if(du.dudukGerek&&!this.s1DudukKapisi(du,tk))return false;`

Düdükten sonra gelen kart:
- Zaman kartı ya da geç itiraz kartı gelirse kartGoster'in S1 bölümü şunu yapar: faz 'durus', du.dudukT dolu ve asama 'kullan' değilse du.dudukT=null; du.dudukCalindi=false; du.kartTekrar=true.
- Ardından kapı kart bitince yeniden düdük çalar.
- durusKullan'ın zaman kartı değişikliği (S1d) buna dayanır.

Çizim tarafı:
- Düdük işareti tektir: olay ile eylem aynı karede gelir. anmHakemAdim, olay 0,1 sn içindeyse eylem işaretini atlar; bu mevcut kuraldır.
- 'duduk' olayında v.seremoni varsa işaret süresi STIL.animasyon.s1.duduk (0,8).
- Gol sonrası santra düdüğü (S1c) aynı biçimde: on('duduk',{tur:'santra',seremoni:true}) ve hakem eylemi duduk 0,8. 'kickoff' olayına dudukOnce eklenir, çizim ikinci düdüğü atlar.

1.5 Hakemin durum makinesi: dal sırası
hakemAI (mac-kurallar.js) S1d adımında 'tutuldu' yapısına çevrilir. Bit 0'da eski if/else zinciriyle birebirdir:

```
h.bakisYon=null;   // K1: başı yalnız sahne dalları yazar
const KS=(protokol&KART)&&kartSira; if(KS)this.kartSahneAdim(h,kartSira,dt,du); const ks=h.kartSira;
if(kartSira&&!KS){…eski kart dalı aynen…}
else if(KS&&ks&&ks.s&&ks.s.tut){}                                        // S1d: hakemi kart sahnesi sürer
else if(ph==='goal'&&this.celeb&&this.celeb.hk)this.golHakemAdim(h,dt);   // S1c (S1c adımında eklenir)
else if(ph==='kickoff'&&this._santraS1){h.tx=h.x;h.tz=h.z;h.hizOran=0;h.bak=b;}   // S1c
else if(DY&&DY.h){… h.hizOran=DY.hiz!=null?DY.hiz:(uz>8?0.9:0.6); h.bak=DY.bak!==undefined?DY.bak:b; if(DY.bakisYon!=null)h.bakisYon=DY.bakisYon; … mevcut sprey çağrısı …}
else{…genel…}
```

- Öncelik kartSira > gol > duran top (DY) > genel. Uzaktan tarzda (tut false) hakemi alttaki dal sürer; kart ve 'not' eylemleri onun üstünde oynar.
- hakemDuranYeri dal sırası:
  1. korner
  2. S1b: du.pk varsa {h:P.hk, hiz:P.hk.hiz, bak:P.hk.bak, yh, yhYer}; yan hakem bugünkü yerinde kalır
  3. eski penaltı
  4. S1a: du.hk.s1 ve du.barajW varsa {h:hakemSpreyHedef(du), yh:null, yhYer:null}; duruş bitene dek
  5. eski barajlı dal
  6. hakem topu
- S1a hakemi mevcut sprey zinciriyle sürer: hakemAI'nın DY dalı → hakemSpreyAdim. İlk satırı `if(du.hk.s1){this.barajSeremoniAdim(du,h,uz,dt);return;}` olur; 12 sn tavanından önce gelir.
- K1'in yüz kuralı hakemSpreyYuz(du,h) yardımcısına çıkarılır (mac-durantop.js); iki yol da onu kullanır.
- Yan hakem: yan() kapanışından sonra, gol evresinde ve bit 8 açıkken golYanHakem.

1.6 Sahnelerin nesneleri ve evreleri
Oyuncu ya da hakem nesnesine yeni alan eklenmez; varlik'in 128 alan sınırı korunur.

| Alan | Nesne | Evreler |
|---|---|---|
| S1a | du.hk (s1:true) | gel → top → kaos → adim → cizgi → dizil → yer → dur → duduk |
| S1d | k.s (k = hakem.kartKuyruk öğesi) | karar → [kalabalik →] yaklas → goster → yaz → bitti; tarz yuru, cagir, kalabalik ya da uzak |
| S1b | du.pk | goster → itiraz → bosalt → hazir → duduk |
| S1c | this.celeb | evre kutla → donus (golDuduk → kickoff); c.top.evre git → al → cik → gonder → yol → tasi → nokta; c.hk.evre isaret → yuru → bekle |
| S1e | du.kr | Alt evreler hazır evresinin içinde: koy, duzelt, geri, don, bak, el, kol, tekrar, dolgu (ayar, bak, el), oku, hazir; bit 64'te ayrıca 'bekle' (düdük bekleyişi) |

- Baraj üyesinin görev nesnesi (p.duranRol): S1a'nın alanları g.dizik ve g.kaos={r,j,u,t}. Tasarımdaki kr/kj/ku/kT adları kullanılmaz; du.kr ile karışmasın.
- Match alanları (reset'te): this._asist {p,q,t} ve this._santraS1 {t} (S1c).
- Yeni olaylar:

| Olay | Alanlar | Alan |
|---|---|---|
| 'seremoni' | {tur:'bekle'\|'it', p, x, z, hedef} | S1a |
| 'kartSahne' | {evre, tarz, p, renk, no, sure?} | S1d |
| 'kaptanIsareti' | {kaynak:'kart'\|'penalti', ikinci, hx, hz} | S1d ve S1b ortak |
| 'penaltiSahne' | {evre: itiraz\|bosalt\|hazir\|duduk, …} | S1b |
| 'golTopAl', 'golTopGonder', 'golTopNokta' | — | S1c |

- Değişen olaylar:
  - 'goal' + {sevincT, tur, asist}
  - 'kickoff' + {dudukOnce}
  - 'kart' + {sahne}
  - 'uyari' + neden 'kalabalik' ya da 'kaleciOyun'
- 'kullananEvre' olayı (S1e'de isteğe bağlıydı) eklenmez; ölçü du.kr'yi okur.

1.7 Kalabalık ve kaptan protokolü (S1d ile S1b'nin ortak yardımcısı)
S1d'de yazılır, S1b yeniden kullanır.
- kalabalikKur(liste, kaptan, parametre) bir K nesnesi döner: {uyeler:[{q,aci,r0,r1,gec,jT}], kaptan, ux, uz (dondurulmuş yön), protoT}.
- kalabalikAdim(K,h,dt) her karede:
  - Hedef: hakemin konumu + yön u'nun yuva açısıyla döndürülmüşü × r.
  - r: protoT+0,5'ten önce r0; sonra r1; kaptan için rk.
  - hizOran: 8 m'den uzakta 0,6 (efor 0,8), 3–8 m'de 0,35, 3 m içinde 0,2.
  - bak = hakem; yonHedef null; gorevYaz(q,'kalabalik').
  - 'itiraz' jesti h2 takvimiyle.

| | r0 | r1 | rk | Yuvalar |
|---|---|---|---|---|
| S1d | 1,4–1,9 | 4,6 | 1,7 | 0,6 rad aralık |
| S1b | 1,6–2,4 | 4,2–5,2 | 1,1 | PEN_YUVA [0, ±0,55, ±1,1, ±1,65] |

- Hakemin kaptan işareti 'kaptanIsareti' olayıdır. Çizimde kaptanCapraz 1,1 sn + kaptanDur 1,2–1,4 sn; ikinci işarette yalnız kaptanDur.
- S1d'nin tek 'kaptan' pozu ve S1b'nin 'penaltiSahne' kaptan/kaptan2 evreleri bu olayla değişir.
- Kart sahnesinin oyuncu hedefleri (kartOyuncuAdim) stepDurus'ta durusYerlesim'den sonra yazılır. Kartı gören oyuncunun hedefini kart sahnesi verir; S1a kaosu ve S1b kalabalığı ondan önce gelir.

1.8 Jest
- jestVer(p,tur,sure,hedef,yenile): yenile true ise aynı tür sürerken de yeniden yazar. Varsayılanı bugünküyle aynıdır.
- Yeni türler: 'yonlendir' (kaleci, S1a) ve 'kolIki' (S1e).
- Jestin süresi niyetAdim'de ilerler. Gol evresinde golSahneAdim ilerletir.

1.9 Çizim işaret seti ve STIL
Hakem işaretleri (anmHkPoz):

| İşaret | Alan | Not |
|---|---|---|
| dudukBekle | S1a | 'bekle' adı gol işaretinde dolu |
| geriIt | S1a | — |
| durdur | S1d | — |
| cagir | — | Mevcut |
| kaptanCapraz, kaptanDur | S1b, S1d | ANM_HK_KAPTAN, S1b değerleri |
| bosalt | S1b | — |
| yon (çizgi) | S1b | Mevcut işaret |
| not | S1d, S1c | Tek poz ANM_HK_NOT; S1d'nin 'kartYaz'ı bu |
| uyari | — | Mevcut; 'saat' yalnız neden 'zaman' iken |

Hakem eylemleri:
- {ad:'not',sure}: S1d'de durarak 0,8–1,3 sn; S1c'de yürürken 2,4 sn.
- {ad:'duduk',sure:0.8}.
- {ad:'kart',sure,renk}: S1d'de sarı 1,3, ikinci sarı 2,4, kırmızı 1,8 sn.
- DEFTER prop'u js/mac-sahnesi.js'te KART'ın yanında durur; refs[0].eylem.ad==='not' iken görünür.

Oyuncu pozları:
- jestYonlendir (S1a)
- jestKolIki (S1e)
- sevGoster (S1c; ANM_SEVINC[8])
- Kaosta baraj pozu yok: anmBaraj, G.dizik===false iken 0 döner.

STIL.animasyon.s1 tek nesnedir. Her anahtar 0 iken eski çizim gelir; z2 değişmez:

| Anahtarlar | Alan |
|---|---|
| duduk 0.8, defterRenk 0x22262b | Ortak |
| serbest 1, itHz 2.5, yonHz 2.5, yonSalinim 0.2, yonTh 0.15 | S1a |
| kart 1 | S1d |
| kaptan 1, bosalt 1, cizgi 1, goster 2.4 | S1b |
| gol {not, notSure 2.4, sevincTur, sevincPay [.30,.27,.16,.12,.15], uzgunSure 6, goster, esli, cift} | S1c |
| rutin 1, kolIki 1 | S1e |

1.10 Kamera (js/kamera.js bakisOdagi)
Öncelik sırası:
1. Gol evresinde celeb.odak varsa odak. Sevinç karttan önce gelir; avantajdan gelen kart sevinci bölmez.
2. Kart sahnesi yaklas ya da kalabalik evresinde ve tut iken hakemle oyuncunun ortası. Kapatma bayrağı STIL.kameralar.baskan.kartIzle.
3. Hakem eylemi 'kart' iken, ya da kartSira varken 'not' eyleminde: hakem.
4. Gol evresinin eski focus()'u.
Açı ve pencere kuralları değişmez (K1 36°).

1.11 İzleme (js/mac-izleme.js IZLEME.anlar)
Her değişiklik ikiz-deneme ister; akis-deneme 18 kapanışta çalışır.

| Pencere | Adım | Değer |
|---|---|---|
| duduk | S1-0 | {once:1, sonra:5, kosul: v.seremoni ve (tur 'penalti' ya da sinif 'baraj')}; santra ve kartlı sıradan duruş seçilen hızda kalır (U1 kuralı) |
| kartSahne | S1d | {once:2, sonra: sarıda 2,5, değilse 4, kosul: evre 'goster'}; 'kart' penceresinin kosulu !v.sahne olur |
| faul | S1b | Penaltıda sonra 3 → 8: itiraz ve kaptan işareti |
| goal | S1c | sonra: v.sevincT varsa min(18, sevincT+1,5), yoksa 7 |

Bunlar Claude'un sunum kararıdır; U1'in seçilen anlar listesi (gol ve sevinç, faul ve kart, penaltı) içinde kalır.

1.12 Ölçü ve senaryolar
Yeni ölçü modülü araclar/olcumler/k-protokol.js:
- Sözleşmesi k-sahne'ninki: rastlantı yok, motor yöntemi çağrılmaz, yazma yok.
- Satır önekleri: s1D_ (ortak düdük), s1a_, s1d_, s1b_, s1c_, s1e_.
- k-sahne.js'e dokunulmaz; süre satırları (ksS_*) değişikliği zaten yansıtır.
- Tasarımlardaki ksB*, ksP*, ksG*, ksK*, ksKN* anahtarları bu öneklerle yeniden adlanır. S1d'nin ksKN'si ile S1e'nin ksKN_* çakışması böylece kalkar.

Yeni seyrek senaryo araclar/senaryolar/d-sahne.js, hücrelerle:
- [1] Kart (S1d)
- [2] Penaltı sahnesi (S1b; tasarımdaki d-pensahne)
- [3] Gol sonrası (S1c; tasarımdaki d-gol)
Senaryo oturum-sonu.js'in SEYREK listesine eklenir; sahibi js/mac-sahne.js'tir.

Mevcut senaryo ve ölçülerde değişenler:
- d-penalti adım tavanı 60·50 → 60·80
- d-duran penaltı hücresi 60·60 → 60·75
- d-duran: S1a ve S1e bilgi satırları
- k-duran: K_HZ penaltı bandı [30,50,'S1']
- o-olay: 'Gol → santra' etiketi S1 (~35); kırmızının 12 sn sayacı 'kartSahne' karar anından başlar

1.13 Test zinciri (her alt adım)
- Bit 0: `MAC_DENEME_AYAR='{"protokol":0}' node araclar/mac-deneme.js 12 --karsilastir <K1 tabanı> --ayni` → 12/12.
- Bir önceki adımın birebirliği: önceki maskeyle `MAC_DENEME_AYAR='{"protokol":<önceki>}' node araclar/mac-deneme.js 12 --karsilastir <scratchpad>/s1-p<önceki>.json --ayni` → 12/12. Her adımın sonunda `node araclar/mac-deneme.js 12 --json <scratchpad>/s1-p<maske>.json` yazılır; depoya alınmaz.
- Commit noktaları ve oturum sonu (`node araclar/oturum-sonu.js <K1 tabanı> --mac 24`, dizüstü):
  1. S1-0 + S1a
  2. S1d + S1b
  3. S1c
  4. S1e + kapanış
- Oturum sonu koşarken motor dosyası düzenlenmez; yalnız belge yazılır.

2. ALT ADIM SIRASI VE GEREKÇE
S1-0 ortak altyapı → S1a seremonili serbest vuruş → S1d kart → S1b penaltı → S1c gol sonrası → S1e korner rutini ve genişlemesi → S1-K kapanış.
- S1a ilk: düdük kapısını en çok ölçülmüş prototiple (proto5) sınar.
- S1d ikinci: hakemAI'da önce gelir, barajlı vuruşların %77'si kartlıdır. Kalabalık ve kaptan işaretini, 'not' pozunu ve DEFTER'i doğurur.
- S1b üçüncü: kalabalığı, kaptan işaretini ve düdük kapısını yeniden kullanır.
- S1c dördüncü: 'not'u ve düdük biçimini kullanır, kamera dalını genişletir.
- S1e son: en bağımsızı. Bit 64, S1a ve S1b'nin bıraktığı 15–20 sn'lik hareketsiz vurucuyu doldurur.
- Her adımda motor çalışır kalır, yeni bit açık olarak gelir; bit kapatılınca bir önceki adım birebir döner.

3. TASARIMLARDAN SAPMALAR (karar Claude'un; gerekçesi yukarıda)
1. Ayrı maske anahtarları yerine tek protokol anahtarı. Parametreler yeniden adlandı: kartAyar, kRutin nesnesi, golTempo.
2. Kod tek dosyada: js/mac-sahne.js.
3. h2 kuralı: bir tohum, sahneOzet yalnız kurulumda. Tasarımlardaki tuz 20'nin S1a ile S1b'de çakışması giderildi.
4. Düdük alanları tek adla: dudukT, dudukBek, olaydaki seremoni:true. dudukBekle, dudukAn ve sahne:true kullanılmaz.
5. kartYaz → 'not'. Kaptan işareti iki parçalı ve ortak olay.
6. S1d'nin seremoni biti ayrı değil. Kalabalık kartAyar.kalabalik 0 ile kapanır.
7. S1c'nin hakem ve sevinç türü bitleri bit 8'in içinde. Sevinç türleri golTempo.tur ağırlıklarıyla daraltılabilir.
8. S1e'nin kale vuruşu biti ayrılmadı (ileride). Barajlı ve penaltı rutini yeni bit 64.
9. d-pensahne ve d-gol tek d-sahne'de; buna kart hücresi eklendi.
10. k-sahne yerine k-protokol.
11. Kart sahnesi du.sahneT'yi yalnız sahibi olmayan duruşta uzatır. Barajda ve penaltıda sahne planı emer; zorlaGetir/zorlaHazir her durumda uzar.
12. Düdükten sonra gelen kart düdüğü sıfırlar.
13. 'uyari' çiziminde 'saat' yalnız neden 'zaman' iken.
14. Kamera önceliği yukarıdaki gibi.
15. İzlemeye kartSahne goster penceresi eklendi.
16. S1a'nın barajdan 1 m kuralı değişmez (tasarımda isteğe bağlıydı).
17. S1a'nın 'dur' tavanı (5 sn) yerleşim koşullarını aramadan düdük çalar; dudukOnKosul yine aranır.

Prototipler (yalnız okunur, uyarlanarak):
- C:\Users\FARUKA~1\AppData\Local\Temp\claude\C--Users-Faruk-AKIR-code-chairman\d683dfae-9eba-4af0-8067-151302484a8d\scratchpad\s1a\s1a-proto5.diff
- …\scratchpad\s1d\betik\kart-yontem.js ve yama.py
- …\scratchpad\s1e\proto-durantop-ek.js
- Ölçüm betikleri: …\scratchpad\s1b\olc*.js, …\scratchpad\s1gol\gol-probe.js

## Alt adımlar

### S1-0 — Ortak altyapı (sonucu değiştirmez; protokol 0)

**Dosyalar:** `js/mac-sahne.js (yeni)`, `index.html`, `js/mac-motoru.js`, `js/mac-durantop.js`, `js/mac-takim.js`, `js/animasyon.js`, `js/stil-99.js`, `js/mac-izleme.js`, `araclar/olcumler/k-protokol.js (yeni)`, `FUTBOL_KUTUPHANESI.md`, `TEKNIK_PLAN.md`, `YOL_HARITASI.md`

Önce turun hazırlığı yapılır:
- Dal claude/motor-s1, K1'in ucundan açılır.
- `node araclar/karsilastir/dondur.js k1` çalıştırılır.

1) js/mac-sahne.js (yeni):
- index.html'de mac-sakatlik.js'ten sonra, mac-senaryo.js'ten önce yüklenir.
- Başlık yorumu S1 sözleşmesini anlatır (plan §1).
- S1_BIT sabiti ve ayarEkle('S1',{protokol:0}).
- Ortak yöntemler: s1Tohum(v), dudukOnKosul(du), dudukCal(du,bek), s1DudukKapisi(du,tk). Kapının kart dalları da şimdiden yazılır; bayraklar kurulmadıkça çalışmaz.

2) js/mac-motoru.js:
- MOTOR_AYAR'a yeni grup `/* S1 — js/mac-sahne.js */` ve protokol:undefined.

3) js/mac-durantop.js duranHazirMi'ye dört korumalı ekleme:
- du.kr, du.s1Sure ve du.hk.s1 kapıları;
- `!du.kr` muafiyeti ve kol bloğu;
- sonda s1DudukKapisi.
Bunları kuran yok; sonuç birebir kalır.

4) js/mac-takim.js:
- jestVer'e yenile parametresi.
- Tür listesi yorumuna yonlendir ve kolIki.

5) js/animasyon.js:
- anmHakemOlay 'duduk' dalında v.seremoni varsa süre STIL.animasyon.s1.duduk; endirekt koruması aynen.
- 'uyari' dalında 'saat' yalnız neden 'zaman' iken. Bugün tek kaynak 'zaman' olduğundan çizim değişmez.

6) js/stil-99.js:
- STIL.animasyon.s1={duduk:0.8, defterRenk:0x22262b}, açıklamasıyla.

7) js/mac-izleme.js:
- IZLEME.anlar.duduk penceresi (plan §1.11).

8) araclar/olcumler/k-protokol.js (yeni). Ortak s1D_ satırları:
- seremonili düdük / maç, sahibine göre (baraj, penaltı, kart, santra);
- düdük → kullanım (gerçek sn, ortanca) ve ≥ 1 sn %;
- düdükte hakem ≤ 0,3 m/sn %;
- düdüksüz kullanım / maç (du.dudukGerek var, dudukT yok); kabul 0;
- düdükten önce kullanım; kabul 0;
- sağlıkçının kulübedeki yerinden (ev) 1,5 m'den uzak geçen sn / maç (bilgi; L.9 madde 5, K1'in sonucu).

9) Belgeler:
- FUTBOL_KUTUPHANESI §12.15 'S1 — plan' (belgeNotu);
- TEKNIK_PLAN §8: dosya sahipliği (js/mac-sahne.js, akış 'S1') ve 'duduk' olayının seremoni alanı;
- YOL_HARITASI devam notu.

**Denetim:** - `node araclar/ad-denetimi.js` (yeni betik, S1_BIT, yeni yöntemler); bulgu 0.
- `node araclar/mac-deneme.js 4`: sonuç aynı.
- `node araclar/mac-deneme.js 12 --karsilastir <K1 tabanı> --ayni`: 12/12 (protokol 0 = K1).
- `node araclar/ikiz-deneme.js`: Aynılık N/N (izleme değişti).
- `PYTHONUTF8=1 python araclar/kontrol.py`: hata yok, görüntü incelenir.
- Zincir için `node araclar/mac-deneme.js 12 --json <scratchpad>/s1-p0.json`.
- Commit yok; S1a ile birlikte commit edilir.

### S1a — Seremonili barajlı serbest vuruş (protokol bit 1; varsayılan 1)

**Dosyalar:** `js/mac-sahne.js`, `js/mac-motoru.js (seremoni bildirimi)`, `js/mac-durantop.js`, `js/animasyon.js`, `js/stil-99.js`, `araclar/olcumler/k-protokol.js`, `araclar/senaryolar/d-duran.js`, `araclar/animasyon-olcum.py`, `araclar/poz-galerisi.html`

Tasarımın tamamı, plan §1'deki değişikliklerle. Yalnız sinif 'baraj' sınıfında çalışır; protokol&1, sahne&4 ve sahne&1 gerekir. Hızlı vuruş istisnası değişmez.

Motor (js/mac-sahne.js; yeni yöntemler):
- barajSeremoniKur: rastlantısız. H.s = s1Tohum(sahneOzet(du,20)). Varyant sakin %25 / olağan %55 / uzun %20; yerT 3,5–6; itN; kay[]; heykel %12; mesafe %60; sonJest %50; dudukBekle 1,0–3,0; dur 0,4–0,9; uzunEk 3–5. Hepsi h2(H.s,k).
- barajSeremoniAdim: evre makinesi gel → top → kaos → adim → cizgi → dizil → yer → dur → duduk. Süreler, hızlar, olaylar, it ve kaydırma zamanlaması tasarımdaki gibi.
  - kaosT = clamp(sahneT − t − [adım + restart yürüyüşü + ek 7 + dudukBekle], taban, 10).
  - 'dur' evresinde barajDudukHazir sağlanınca dudukCal(du,H.dudukBekle) çalınır. Tavan 5 sn: yerleşim koşulları aranmaz, dudukOnKosul yine aranır.
- barajKaosHedef, barajSeremoniYer (görev döngüsü kancası; g.kaos {r,j,u,t} ve g.dizik ≤ 0,35 m), barajRestartYeri (R).
- barajDudukHazir. Koşullar:
  - vurucu hazır ve geri noktasında;
  - zgEk doldu;
  - gorevlilerYerinde;
  - üyeler dizik, ≤ 0,35 m ve < 0,3 m/sn;
  - yatan yatık;
  - kaleci ≤ 0,6 m ve < 0,5 m/sn;
  - dudukOnKosul (kart, sakatlık, değişiklik yok).

Kancalar (js/mac-durantop.js):
- barajKur: S1a'da kalecinin t=0 jesti verilmez.
- barajSahne: `if(!du.hk) du.hk = protokol&1 ? barajSeremoniKur(du) : eski`. Ayrıca du.s1Sure=true ve du.dudukGerek='baraj'. Üyelerin g.kaos alanları kurulur.
- sahneKur: t0 = seremoni.hedef × bağlam × (1 ± sapma). zorlaGetir = max(16, yerT+6); zorlaHazir = max(28, sahneT+14).
- sahneHiz: kalan = hk.yerT + zgEk − du.t.
- hakemSpreyHedef: S1a hedefleri.
- hakemSpreyAdim: ilk satır s1 yönlendirmesi; hakemSpreyYuz yardımcısı.
- hakemDuranYeri: S1a dalı (plan §1.5).
- durusYerlesim: barajSeremoniYer kancası. Yatan yalnız hakemHazir'dan sonra yatar. Heykel ve kalabalık itişin ilk anına dek 4 m. Barajdakilerin yonHedef'i dizik değilken null.
- Kalecinin yönlendirmesi: jestVer(kl,'yonlendir',1.0,hedef,true).

Çizim:
- 'seremoni' olayı: tur 'bekle' → dudukBekle 1,1 sn; tur 'it' → geriIt 1,0 sn.
- ANM_JEST.yonlendir → ANM_POZ.jestYonlendir (nişanlı, sallanır).
- anmBaraj: G.dizik===false iken 0.
- anmHakemAdim: hk.evre 'dur' ya da 'duduk' iken saat bakışı bastırılır.
- STIL s1 anahtarları: serbest, itHz, yonHz, yonSalinim, yonTh.

Ölçü (k-protokol s1a_):
- evre girişleri;
- varyant payları;
- kaosT;
- adımlama başlamadan dizili %;
- kaosta topa en yakın üye uzaklığı ve 9,15 m içindeki savunmacı;
- üye yolu ÷ doğrudan uzaklık;
- it / kay / bekle sayıları ve heykel %;
- adımlamada yüz gidiş yönünde %;
- düdük → koşu, ≥ 1 sn %, düdük → temas;
- düdükte hakem durmuş %, hakem vurucunun arkasında %;
- koşu başında kalecinin son yerine uzaklığı.

Senaryo ve araçlar:
- d-duran bilgi satırı 'S1a'.
- animasyon-olcum.py: HK_OLAY'a seremoni; yeni 'A: seremoni' satırı.
- poz-galerisi: s1serbest satırı (Claude'un kendi denetimi).

Prototip: scratchpad\s1a\s1a-proto5.diff. Prototipteki şu kısımlar değişir:
- yöntemler js/mac-sahne.js'e;
- tohum kuralı (§1.3);
- g.kr → g.kaos;
- jest null'lama yerine yenile;
- düdük ortak dudukCal'dan.

**Denetim:** Hızlı kademe:
- mac-deneme 4: sonuç aynı.
- ad-denetimi.
- `--senaryo d-duran`:
  - korner, penaltı, taç ve kale vuruşu satırları S1-0 ile aynı;
  - barajlı hazırlık 28–31 sn;
  - 'S1a' satırında düdük → koşu ≥ 1 sn %100, düdükte hakem durmuş ≥ %95, adımlamadan önce dizili ≤ %10;
  - gol/şut %6–10 ve 18 m doğrudan şut kapıları gürültüde.

Bit kontrolleri:
- protokol 0 → K1 tabanına --ayni 12/12.
- protokol 0 → s1-p0.json'a --ayni 12/12.

Diğer:
- ikiz-deneme: Aynılık N/N.
- `python araclar/animasyon-olcum.py --duran 24 --karsilastir <K1 animasyon tabanı>`: 'A: duran top' satırları aynı; 'A: zamanlama'da seremoni N/N; 'A: seremoni' raporlanır.
- kontrol.py.
- an-yakala: barajlı vuruşun gel, kaos, adim, cizgi, yer ve düdük anları (kendi incelemesi).
- `--json <scratchpad>/s1-p1.json`.

Commit noktası 1:
- `node araclar/oturum-sonu.js <K1 tabanı> --mac 24` (arka planda; motor dosyası düzenlenmez), sonuç okunur.
- Commit: "S1-0 + S1a: …".
- Devam notu güncellenir.

### S1d — Kart sahnesi (protokol bit 2; varsayılan 3)

**Dosyalar:** `js/mac-sahne.js`, `js/mac-motoru.js (kartAyar bildirimi)`, `js/mac-kurallar.js`, `js/mac-mudahale.js`, `js/mac-durantop.js (gerekirse yalnız yorum)`, `js/animasyon.js`, `js/mac-sahnesi.js`, `js/stil-99.js`, `js/kamera.js`, `js/mac-izleme.js`, `araclar/olcumler/k-protokol.js`, `araclar/olcumler/o-olay.js`, `araclar/senaryolar/d-sahne.js (yeni)`, `araclar/oturum-sonu.js`, `araclar/poz-galerisi.html`, `araclar/animasyon-olcum.py`

Tasarımın tamamı, plan §1'deki değişikliklerle.

Parametre kartAyar (js/mac-sahne.js; bildirimi mac-motoru.js'te):
- tarz [0.5, 0.4, 0.15]
- kalabalik 0.3
- hiz [1.8, 2.8, 3.4]
- zaman {karar [0.5,0.9], tepki [0.3,1.0], sari 1.3, ikinci 2.4, kirmizi 1.8, yaz [0.8,1.3], itiraz [3,5], protokol 1.6, dagil 0.8, duduk [0.8,1.5], kul [1.0,2.0], tavan 16}

Motor (js/mac-sahne.js):
- kartOzet, kartSahneKur, kartKalabalikKur, kartMesgul, kartSahneAdim, kartOyuncuAdim.
- Ortak kalabalikKur ve kalabalikAdim (§1.7).
- Tarz öncelik kuralları tasarımdaki gibi: faz durus değilse ya da zaman kartıysa uzak; kullanan ise yürür; penaltıda kalabalık yok.
- Evreler karar → [kalabalik] → yaklas → goster → yaz → bitti. Tavan 16 sn (kalabalıkta 22).
- Hakem kartHiz'i aşmaz, depar yok.
- 'yaz' hakem eylemi {ad:'not', sure 0,8–1,3}.
- Kart sonrası tepki jesti: sarıda itiraz %30, kırmızıda basEl %50; h2 ile, jestVer yenile.
- Kaptan protokolü 'kaptanIsareti' olayıyla. Uyarı türü on('uyari',{p:kaptan, neden:'kalabalik'}).
- Bitince du.kartBitT ayarlanır; kartDudukT ve kartBek kartOzet ile (tuz 11, 12).

kartGoster (js/mac-kurallar.js; protokol&2):
- k.no ve k.neden;
- faz durus ise du.kartS=true; du.dudukGerek boşsa 'kart'; du.hizli null ise false; du.hizliTac false;
- düdükten sonra gelen kartta düdük sıfırlanır (§1.4);
- 'kart' olayına sahne:true;
- tahminle zorlaGetir ve zorlaHazir uzar; du.sahneT yalnız dudukGerek 'kart' iken uzar (barajda sprey başlamadıysa +12 sn).

mac-mudahale.js faul: durusBaslat veri'sine kartNeden. Koşulsuz yazılır; motor okumaz, --ayni ile doğrulanır.

hakemAI: 'tutuldu' yapısı (§1.5).

stepDurus: degisiklikAdim'den önce `if(protokol&2) this.kartOyuncuAdim(du)`.

durusKullan, zaman kartı:
`if(du.zgEk>0&&!(B&&du.zgGoruldu)){ if(B)du.zgGoruldu=true; this.zamanGecirmeGoruldu(tk,du.zgEk); if(B&&du.kartS&&this.refs[0].kartSira) return; }`
Bu, çift sayımı bit açıkken kaldırır.

Çizim:
- 'kart' olayında v.sahne ve s1.kart > 0 ise eski 'cagir' çizilmez.
- 'kartSahne' olayı: yaklas → durdur 0,9 ya da cagir 1,4.
- 'kaptanIsareti' → kaptanCapraz + kaptanDur.
- anmHkPoz: durdur, kaptanCapraz, kaptanDur, not.
- 'kart' ikinci sarı: kol sürenin %42–58'inde iner ve kalkar.
- anmHakemAdim: eylem 'not' → işaret 'not'; kart işaretine renk.
- anmKenarOlay: teknik direktörün itirazı 'goster' anında.
- mac-sahnesi.js: DEFTER prop'u.
- STIL s1.kart.

Kamera ve izleme:
- kamera.js: §1.10 madde 2 ve 3.
- IZLEME: kartSahne penceresi.

Ölçü (k-protokol s1d_):
- tarz payları;
- sahne süresi tarz başına;
- düdükten kartın gösterilmesine;
- yavaşladıktan sonra hakemin tepe hızı;
- 5 m/sn üstüne çıkan sahne %;
- yürür tarzında oyuncunun durduğu kare %;
- gösterilirken ≤ 5 m %;
- gösterilmeden biten %;
- kart sürerken kullanılan / maç;
- düdükten kullanıma;
- kalabalık kişi sayısı ve protokol (kaptan / uyarı);
- kartlı duruşun süresi tür başına.

o-olay: kırmızının 12 sn sayacı 'kartSahne' karar anından.

Senaryo: araclar/senaryolar/d-sahne.js (yeni, seyrek; oturum-sonu.js SEYREK'e eklenir), hücre [1] kart.
- Kurulum: O.kur(tohum), 20–40 sn oyun.
- Sahibe en yakın rakiple m.faul(yapan, yiyen, {x, z, ciddiyet:0.6, kaynak:'mudahale'}). Kart çıkmadıysa m.kartGoster(yapan,'sari'). Ölçülen kartın kendisi değil, sahnesidir.
- Faul yerleri ve uzaklıklar çeşitlenir; N 80; duruş bitene dek izlenir.

Araçlar: poz-galerisi s1kart; animasyon-olcum 'A: zamanlama' kartSahne işaretleri.

Prototip: scratchpad\s1d\betik\kart-yontem.js ve yama.py. Şunlar prototipten farklı:
- kartYaz yerine 'not';
- 'kaptan' tek poz yerine iki parçalı olay;
- seremoni ortak kapıdan.

**Denetim:** Hızlı kademe:
- mac-deneme 4: sonuç aynı.
- ad-denetimi.
- `--senaryo d-sahne` hücre [1] kapıları:
  - gösterilmeden biten 0;
  - kart sürerken kullanım 0;
  - yavaşladıktan sonra 5 m/sn üstü sahne 0;
  - tepe hız ortancası ≤ 3,5;
  - gösterilirken ≤ 5 m ≥ %95 (uzak hariç);
  - yürür tarzında durma ≥ %70;
  - tek tarz ≤ %80;
  - düdük → kullanım 1–2 sn %100.

Bit kontrolleri:
- protokol 0 → K1 tabanına --ayni 12/12.
- protokol 1 → s1-p1.json'a --ayni 12/12.

Kısa senaryolar (beklenen birebir ya da kapı içinde): `--senaryo o-sakatlik`, d-duran, d-topcu, o-ofsayt.

Diğer:
- ikiz-deneme: Aynılık N/N.
- animasyon-olcum 'A: zamanlama'.
- kontrol.py.
- `python araclar/akis-deneme.py 17` (kamera bandı; bu dizüstünde bilinen düşen bölümler gerileme sayılmaz).
- `--json <scratchpad>/s1-p3.json`.
- Commit yok; S1b ile birlikte.

### S1b — Penaltı sahnesi (protokol bit 4; varsayılan 7)

**Dosyalar:** `js/mac-sahne.js`, `js/mac-motoru.js (penaltiSahne bildirimi)`, `js/mac-durantop.js`, `js/mac-kurallar.js`, `js/animasyon.js`, `js/stil-99.js`, `js/mac-izleme.js`, `araclar/olcumler/k-protokol.js`, `araclar/olcumler/k-duran.js`, `araclar/senaryolar/d-penalti.js`, `araclar/senaryolar/d-duran.js`, `araclar/senaryolar/d-sahne.js`, `araclar/poz-galerisi.html`

Tasarımın tamamı, plan §1'deki değişikliklerle. sahne&1 gerekir.

Parametre penaltiSahne (bildirimi mac-motoru.js'te):
- sure 40
- aralik [0.75, 1.25]
- kos 2.3
- kaos katsayıları
- goster [1.6, 5]
- itiraz [0.30, 0.55]
- bosalt 0.85
- kalabalik [3, 6]
- kaptanYakin 1.1, halka [1.6, 2.4], kaptanR [4.2, 5.2]
- gerHiz 0.12, yuruHiz [1.2, 2.2], uzakHiz [1, 4]
- bekle [0.4, 3.0]
- hazirDur [0.6, 1.4]
- varyant olasılıkları
- protokolSari 1
- zorlaGetir 12

tempo.penalti 27 yalnız bit kapalıyken kullanılır.

Motor (js/mac-sahne.js):
- penaltiSahneKur: P.s = s1Tohum(sahneOzet(du,21)).
  - Kaos, sahneT = 40·(0,75 + 0,5·kaos), Tpre, tI, tB, tY, bekle.
  - Kalabalık, kaptan, yerler, varyantlar.
  - Ayrıca du.s1Sure=true ve du.dudukGerek='penalti'.
- penaltiSahneAdim: evre geçişleri. Kart dalı sürerken geçiş bekler (`!refs[0].kartSira`).
  - Kalabalık kalabalikAdim ile yürür (§1.7).
  - Kaptan işareti 'kaptanIsareti' olayıyla; kaos > 0,6 ise ikinci işaret.
  - Protokol sarısı kartGoster(p,'sari','itiraz'); S1d sahnesi koşar, kalabalık tarzı olmaz.
  - kaleciOyun → on('uyari',{p,neden:'kaleciOyun'}).
  - Jest takvimi jestVer(…,true) ile.
  - P.hk = {x,z,hiz,bak}.
  - 'hazir' evresinin geçiş koşullarında dudukOnKosul ve kaleci çizgide aranır; bit 64 açıksa du.kr hazır olmalı. Sonra dudukCal(du,P.bekle) ve evre 'duduk'.
- penaltiSahneRol, penaltiKullanan, penaltiDuzelt. penaltiDuzelt, bit 64 açıkken rutine devredilir.
- Üst düzey PEN_YUVA.

Kancalar:
- mac-durantop.js:
  - sahneKur: `tur==='penalti'&&(protokol&4)` iken penaltiSahneKur.
  - durusYerlesim: `if(du.pk&&this.penaltiSahneRol(du,p,g))continue;` taç ve yatan dallarından sonra.
  - hakemDuranYeri: penaltı dalı.
- mac-kurallar.js:
  - durusBaslat ışınlamasına `&&!du.pk`.
  - stepDurus'un bekle, getir, yerles dallarına penaltiKullanan; hazir dalına penaltiDuzelt.
  - hakemAI DY.hiz, DY.bak ve DY.bakisYon (§1.5).
- duranHazirMi: ortak kapı; ayrı satır gerekmez.

Çizim:
- 'penaltiSahne' olayı: bosalt → 'bosalt' 1,6 sn; hazir → s1.cizgi açıksa kale ortasına 'yon' 0,9 sn.
- Kaptan işaretleri S1d'den.
- Penaltı faulünde noktaya 'yon' 1,6 → s1.goster (2,4).
- 'uyari' kaleciOyun: yalnız parmak (S1-0'da çözüldü).
- anmHkPoz: bosalt.
- STIL s1: kaptan, bosalt, cizgi, goster.
- IZLEME: penaltıda faul penceresi sonra 8.

Ölçü (k-protokol s1b_):
- faulden düdüğe;
- düdük → temas;
- düdükten kullanıma ≥ 1 sn %;
- evre süreleri;
- itiraz eden sayısı ve itiraz oyuncu·sn;
- kaptan işareti %;
- işaretten 2 sn sonra 4 m içinde kaptan dışı oyuncu;
- ceza sahasında oyuncu 5. sn / 15. sn / düdükte;
- son 20 sn'de hareketsiz %;
- itiraz ve boşaltmada hakemin tepe hızı (kart hariç);
- kaos ve varyant payları.
Bit kapalıyken de bugünkü değerleri ölçen satırlar tasarımdaki gibi vardır.

Senaryolar:
- k-duran.js: K_HZ penaltı [30,50,'S1'].
- d-penalti: döngü 60·80; bilgi satırı (sahne süresi ortancası, düdük → temas).
- d-duran: penaltı hücresi 60·75.
- d-sahne: hücre [2]. Oyundan zorlanmış penaltı; tasarımdaki olc.js kalıbı; N 80.

Araçlar: poz-galerisi s1penalti.

**Denetim:** Hızlı kademe:
- mac-deneme 4: sonuç aynı.
- ad-denetimi (PEN_YUVA dahil).
- `--senaryo d-sahne` hücre [2] kapıları:
  - düdük kullanımdan ≥ 0,4 sn önce %100;
  - düdükte ceza sahası ve yay boş (vurucu ve kaleci hariç) ≥ %95;
  - faul → temas ortanca 32–48, q10 ≥ 25, q90 ≤ 58;
  - itiraz eden ortalaması ≥ 2,5;
  - kaptan işareti ≥ %90;
  - itirazda hakemin tepe hızı (kart hariç) ≤ 2,5;
  - son 20 sn'de hareketsiz ≤ %65.
- `--senaryo d-penalti 1600`: gol %70–82; vuruşun kodu değişmedi.
- `--senaryo d-duran`: penaltı ribaund ≥ %70.

Bit kontrolleri:
- protokol 0 → K1 tabanına --ayni 12/12.
- protokol 3 → s1-p3.json'a --ayni 12/12.

Diğer:
- ikiz-deneme: Aynılık N/N.
- animasyon-olcum 'A: zamanlama' (bosalt, kaptan işaretleri).
- kontrol.py.
- `--json <scratchpad>/s1-p7.json`.

Commit noktası 2:
- `node araclar/oturum-sonu.js <K1 tabanı> --mac 24`, sonuç okunur.
- Commit: "S1d + S1b: …".

### S1c — Gol sonrası akış ve bakış (protokol bit 8 + 16; varsayılan 31)

**Dosyalar:** `js/mac-sahne.js`, `js/mac-motoru.js`, `js/mac-kurallar.js`, `js/kamera.js`, `js/animasyon.js`, `js/mac-sahnesi.js`, `js/stil-99.js`, `js/mac-izleme.js`, `araclar/olcumler/k-protokol.js`, `araclar/olcumler/o-olay.js`, `araclar/senaryolar/d-sahne.js`, `araclar/animasyon-olcum.py`, `araclar/an-yakala.py`, `araclar/poz-galerisi.html`

Tasarımın tamamı, plan §1'deki değişikliklerle.

Parametre golTempo (bildirimi mac-motoru.js'te):
- toplam 35
- sevinc [11, 15]
- kritik 1.3
- atan 0.35
- kumeR 35
- donus [1.4, 3.6]
- kaleciAl [1.2, 2.6]
- uzgun [2, 5]
- tavan 55
- tur {kose .32, tribun .30, yerinde .18, pasci .12, kulube .04}: yalnız 'kose' bırakılırsa çeşitlilik kapanır.

Motor (js/mac-sahne.js):
- golOzet, golSahneKur, golSahneAdim, golTopAdim, golGonder, golHedefSec.
- santraKuralHazir, golSantraHazirMi, golDuduk.
- golHakemAdim, golYanHakem.
- golOdak: yalnız bit 16'da yazar; kapalıyken c.odak yok, kamera eski focus()'u kullanır.
- Evreler kutla → donus. Düdük ön koşulu: Law 8; tek oyuncu yarıçapı 3 m; hakem bekle ≥ 0,5 sn; sakatlık yok; kartSira yok; phaseT ≥ dudukT.
- Top zinciri: kaleci uzağa atmaz; yerde yuvarlanan top yerIlkHiz ile; omuz atışı yalnız L > 26 m; zincir en çok 4. Yedek ağ 3 sn, tavan 55 sn.
- T10d c.alan yolu korunur.
- golSahneAdim jest süresini de ilerletir.
- golDuduk:
  - refs[0].eylem duduk 0,8;
  - on('duduk',{tur:'santra',seremoni:true});
  - santraHazirla(kickTeam,false);
  - santraAcele=!!c.alan;
  - this._santraS1={t}.

Kancalar:
- mac-motoru.js:
  - reset: this._asist=null, this._santraS1=null.
  - dokunus: _asist kaydı; yalnız kayıt, --ayni ile doğrulanır.
  - gol(): bit 8 iken golSahneKur; 'goal' olayına {sevincT, tur, asist}.
  - stepGoal'ın ilk satırı `if(MOTOR_AYAR.protokol&S1_BIT.GOL){this.golSahneAdim(dt);return;}`.
  - stepKick: S1=this._santraS1; ac=santraAcele||!!S1; yarıçap S1 ? 3 : 2; S1 varken hakem eylemi düdüğü yazılmaz; kickoff olayına dudukOnce; ardından _santraS1=null.
- mac-kurallar.js:
  - hakemAI gol ve kickoff dalları (§1.5);
  - yan hakem golYanHakem.

Kamera (kamera.js): §1.10 madde 1.

Çizim:
- 'not' işaretiyle DEFTER (S1d'den); süre eylemden (2,4 sn, yürürken).
- kickoff dudukOnce → düdük işareti yok.
- Saat bakışı gol evresinde c.hk.evre 'bekle' iken.
- Sevinç türleri: sevGoster (ANM_SEVINC[8]); c.tur ağırlıkları; L.3 payları s1.gol.sevincPay.
- Eşli sevinç (c.es) ve uzaktaki ikili sarılma (c.cift).
- Üzgün poz yalnız ilk uzgunSure boyunca ya da oyuncu durdukça.
- İsteğe bağlı: mac-sahnesi.js'te kenarın sevinç süresi sevincT'den.
- STIL s1.gol.
- IZLEME goal penceresi.

Ölçü (k-protokol s1c_):
- gol → santra dört bağlamda (tarafsız, gol yiyen geride, atan acele, gol yiyen önde);
- sevinç evresi;
- kümenin ilk anı ve kümeli zaman payı;
- koşu türü %;
- topu ağdan alan %;
- topun en uzak gidişi ve orta çizgiyi geçmesi;
- topun noktaya varışı ve zincir uzunluğu;
- santracının kovalaması ve ışınlama;
- hakemin tepe hızı, yolu ve beklemesi;
- yan hakem çizgi koşusu ve kale çizgisine gidiş;
- düdük → santra ve düdüksüz santra;
- Law 8 ihlali;
- odak kümede % ve odak topta iken top noktada değil;
- yerine varmamış oyuncu.

o-olay: 'Gol → santra' etiketi S1 (~35).

Senaryo d-sahne hücre [3]: yapay gol (top ağa konur, m.gol(side)). Altı bağlam × 40: tarafsız, gerideki gol yiyen, atan acele, öndeki gol yiyen, kendi kalesine, avantaj kartlı.

Araçlar:
- animasyon-olcum --olay: 'not' N/N, santrada çift düdük 0.
- an-yakala anları golKume, golDonus, golDuduk.
- poz-galerisi s1gol.

**Denetim:** Hızlı kademe:
- mac-deneme 4: sonuç aynı.
- ad-denetimi.
- `--senaryo d-sahne` hücre [3] kapıları:
  - tarafsız gol → santra ortancası 28–42;
  - acele ≤ tarafsız ≤ koru;
  - topun atan takımın yarısına geçmesi 0;
  - kovalama ve ışınlama 0;
  - düdüksüz santra 0;
  - Law 8 ihlali 0;
  - kartsız hakem tepe hızı ≤ 3,2;
  - tavana varan 0;
  - odak sevinç evresinin ≥ %95'inde kümede.
- `--senaryo m-isinma` ve `m-fotograf`: yarı başı santrası değişmez.

Bit kontrolleri:
- protokol 0 → K1 tabanına --ayni 12/12.
- protokol 7 → s1-p7.json'a --ayni 12/12.
- Odak sonucu değiştirmez: protokol 15 ile protokol 31 arasında --ayni (31'in --json'u ile).

Diğer:
- ikiz-deneme: Aynılık N/N; kuşkuda --esit.
- kontrol.py.
- `python araclar/akis-deneme.py 17 18` (kamera ve izleme).
- animasyon-olcum --olay 80: 10 golde ≥ 5 sevinç çeşidi, not N/N, santrada çift düdük 0.
- an-yakala gol anları (kendi incelemesi).
- `--json <scratchpad>/s1-p31.json`.

Commit noktası 3:
- `node araclar/oturum-sonu.js <K1 tabanı> --mac 24`, sonuç okunur.
- Commit: "S1c: …".

### S1e — Korner/kenar kullananının rutini ve düdüklü genişlemesi (protokol bit 32 + 64; varsayılan 127)

**Dosyalar:** `js/mac-sahne.js`, `js/mac-motoru.js (kRutin bildirimi)`, `js/mac-durantop.js`, `js/mac-kurallar.js`, `js/animasyon.js`, `js/stil-99.js`, `araclar/olcumler/k-protokol.js`, `araclar/senaryolar/d-duran.js`, `araclar/animasyon-olcum.py`, `araclar/poz-galerisi.html`

Bit 32: tasarımın tamamı, plan §1'deki değişikliklerle.

Parametre kRutin (bildirimi mac-motoru.js'te):
- sure {bak [0.8,1.8], oku [1.0,2.0], okuMax 2.0, geriV [1.0,1.8], yuru 1.3, pay 0.5}
- varyant {duzelt 0.3, el 0.45, tekrar 0.3, iki 0.5, sirt 0.35, kolOku 0.5}

Motor (js/mac-sahne.js):
- kRutinKur, kRutinSigdir, kRutinAdim, kRutinBitti, kRutinSonraki, kRutinBasla, kRutinHedef ve KR_TOG sabiti.
- Sığdırma: kesmede düşme sırası don → duzelt → el → tekrar.
- Ayar dolgusunda varış eşiği 0,3 m.
- Geri evresine 'varamadı' dalı: geri noktası kullananın yerine çekilir.

Kancalar:
- mac-durantop.js:
  - sahneKur sonunda bit 32 iken kRutinKur. Kapsam korner ve kenar; hızlı ve hakem topu hariç.
  - zorlaGetir = max(16, sahneT − sahneKos − B − pay + 2).
  - sahneHiz payı kr.B + pay; en düşük hız 1,3.
  - duranHazirMi: S1-0'daki du.kr kapıları devreye girer.
- mac-kurallar.js stepDurus:
  - getir dalında du.kr varken sahneHiz;
  - yerles dalında 1,5 m'den uzakta yonHedef null;
  - hazir dalında `if(du.tur!=='tac'&&du.kr&&!du.kisaGeri&&this.kRutinAdim(du,tk,dt)){}else{…eski…}`.

Bit 64 (yeni; S1a ve S1b'nin 15–20 sn hareketsiz vurucusu için):
- Kurulum: barajlı (du.hk.s1) ya da penaltı (du.pk) duruşunda top konunca. stepDurus yerles dalının sonunda kRutinKur(du,{dudukBagli:true}).
- Plan: koy → [duzelt] → geri (sırt varyantı penaltıda 0,6) → bak (barajda baraj ve kaleci, penaltıda kaleci) → [el, barajda du.ikili varsa ikinci vurucuya] → 'bekle'.
- 'bekle' bir dolgu döngüsüdür ve du.dudukT dolana dek sürer:
  - yerinde bakış 1,2–1,8 sn;
  - h2 ile %25 ayar yan adımı;
  - barajda %20 duzelt: topa dönüş, ikinci yerleştirme, geri dönüş;
  - kol jesti yok.
- Düdükten sonra 'oku': bakış kalecide, hareketsiz; Jordet bekleyişi. Süresi kapının dudukBek'idir.
- kr.hazir 'bekle'ye girişte true olur. S1a'nın barajDudukHazir'ına ve S1b'nin hazir geçişine `!du.kr || kr.evre==='bekle' || kr.evre==='oku'` koşulu eklenir.
- Bit 64 açıkken S1b'nin duzelt varyantı kr.duzelt'e devredilir.

Çizim:
- Baş bloğu (Z2e) s1.rutin > 0 ve du.kr varken kr.bakis'e döner; okuma evresinin son 0,35 sn'sinde topa.
- Rutin sürerken kullananda kıpırtı (bakınma) başlamaz.
- jestKolIki ve ANM_JEST.kolIki.
- STIL s1: rutin, kolIki.

Ölçü (k-protokol s1e_; korner ve kenar ayrı):
- topun konduğu an;
- topa yürüyüş hızı;
- hazırda hareketsiz;
- boş bekleme (hareketsiz, jestsiz, eylemsiz);
- en uzun kesintisiz boş bekleme (ortanca, q90, en çok);
- koldan kullanıma;
- kullanım − tKos;
- evre ortancaları ve varyant payları;
- bit 64 için barajlı ve penaltıda kullananın düdükten önceki en uzun boş beklemesi.

Senaryo ve araçlar:
- d-duran: S1e bilgi satırları.
- animasyon-olcum --duran: 'A: duran top (S1e)' satırı.
- poz-galerisi: s1kol.

Prototip: scratchpad\s1e\proto-durantop-ek.js. Şunlar prototipten farklı:
- yöntemler js/mac-sahne.js'e;
- maske yerine protokol bitleri;
- 'dudukBagli' kipi.

**Denetim:** Hızlı kademe:
- mac-deneme 4: sonuç aynı.
- ad-denetimi.
- `--senaryo d-duran` (1600 korner):
  - korner başına gol kapısı %3–5;
  - kısa / içe / dışa payları gürültüde;
  - kenar ve barajlı kapılar gürültüde.
- `--senaryo d-topcu`: zorla teslim 0.
- `--senaryo d-sahne` [2]: kapılar S1b'deki gibi; bit 64 ile.
- k-protokol satırları:
  - korner en uzun boş bekleme ortanca ≤ 2, q90 ≤ 2,5;
  - kenar q90 ≤ 3;
  - kullanım − tKos ortancası |≤ 0,3|;
  - her varyant ≥ %5 (tekrar ≥ %3);
  - bit 64'te barajlı ve penaltıda düdükten önceki en uzun boş bekleme q90 ≤ 3 sn.

Bit kontrolleri:
- protokol 0 → K1 tabanına --ayni 12/12.
- protokol 31 → s1-p31.json'a --ayni 12/12.

Diğer:
- ikiz-deneme: Aynılık N/N.
- animasyon-olcum --duran 24: 'A: duran top' satırları K1 animasyon tabanına göre aynı ya da açıklanmış; 'S1e' satırı (iki kol N/N, bakış ≤ 25° ≥ %80, kıpırtı 0).
- kontrol.py.
- Commit, kapanışla birlikte.

### S1-K — Tur kapanışı (CLAUDE.md tur kapanışı listesi; main'e alma ve push bu oto mod için kullanıcı izniyle)

**Dosyalar:** `araclar/taban/s1.json (yeni)`, `araclar/taban/s1-anm.json (yeni)`, `FUTBOL_KUTUPHANESI.md`, `kutuphane/L-sahne-protokolleri.md`, `TEKNIK_PLAN.md`, `CLAUDE.md`, `YOL_HARITASI.md`

1) 80 maç: `node araclar/mac-deneme.js 80 --karsilastir <K1 tabanı>`.
- Sağlık aralığı dışında yeni '!' satırı yok.
- Z ölçüleri ve robotluk karnesi K1'e göre gürültüde.
- Gol/maç ve şut/maç ±0,3 içinde.
- 'Top oyunda %' 55–75 içinde.
- k-sahne'de ksS_baraj ~28–32, ksS_penalti ~36–44.
- o-olay'da gol → santra ~33–37.

2) Bit 0 bütünlüğü: `MAC_DENEME_AYAR='{"protokol":0}' node araclar/mac-deneme.js 24 --karsilastir <K1 tabanı> --ayni` → 24/24.

3) Senaryolar: `node araclar/oturum-sonu.js <K1 tabanı> --mac 24 --seyrek`. Çekirdek ve seyrekler; d-sahne'nin üç hücresi, z-s3, z-s10 ve z-s14 dahil.

4) Çizim ve ekran:
- kontrol.py.
- akis-deneme.py tam; §17 ve §18 dahil. Bu dizüstünde bilinen düşen bölümler gerileme sayılmaz.
- an-yakala önce/sonra (Claude'un kendi incelemesi; kullanıcıya gösterilmez).
- animasyon-olcum --duran 24, --olay 80 ve --karsilastir <K1 animasyon tabanı>.
- Yeni animasyon tabanı araclar/taban/s1-anm.json.

5) Duyarlılık: `node araclar/oyuncu-karnesi.js 80 1 --duyarlilik`.

6) Hız:
- `git worktree add --detach <scratchpad>\k1agac tur/k1`.
- `node araclar/hiz-olcum.js 2 --tekrar 8 --kok <k1agac>`: eşleştirilmiş oranın ortancası ve en az sürelerin oranı; ortanca artış ≤ %10, mutlak tavan 250 ms.
- Duruş ve gol evresinin uzaması ms/1000 adımı oynatır; kodun payı `node araclar/hiz-evre.js <k1agac>` ile ayrılır.
- Sonra worktree silinir.

7) Tabanlar:
- Yeni taban `node araclar/mac-deneme.js 80 --json araclar/taban/s1.json`.
- Çalışma ağacında yalnız s1 ve k1 tabanları kalır; daha eskiler etiketlerindedir.
- Dondurulmuş çizim kopyası yalnız k1; z2 kopyası silinir.

8) Belgeler:
- FUTBOL_KUTUPHANESI §12.15 'S1 — Sonuç' (ölçüler ve sapmalar);
- kutuphane/L L.1–L.6 'Motorda' notları ve L.9 maddeleri 1–6 'uygulandı';
- TEKNIK_PLAN §8: motor → çizim sözleşmesi (du.hk, du.pk, k.s, celeb, du.kr, düdük olayı, yeni jestler ve işaretler);
- CLAUDE.md senaryo kapıları satırı: sahne protokolleri → d-sahne, d-duran, d-penalti, d-topcu, o-sakatlik, ikiz-deneme, k-protokol, protokol 0 ile K1'e --ayni. Seyrek listesine d-sahne;
- YOL_HARITASI: S1 tamamlandı, karar özeti, devam notu → V1.

9) Git:
- "S1 main'e alındı" commit'i.
- main ileri sarılır, tur/s1 açıklamalı etiketi konur.
- main, dal ve etiket push edilir.
- Birleşen dal kuralı uygulanır; oto modda V1 dalı S1'in ucundan açılır.

**Denetim:** Yukarıdaki listenin her maddesi geçmeden tur tamamlanmış sayılmaz ve main'e alınmaz. Sonuçlar (hız oranı, 80 maç özeti, senaryo kapıları) devam notuna ve §12.15 sonucuna yazılır.

## Kabul

S1 TUR KABULÜ

Bütünlük:
- protokol 0 iken K1 tabanına --ayni N/N (her alt adımda 12, kapanışta 24).
- Her alt adımda yeni bit kapatılınca önceki adım birebir döner.
- Odak biti (16) sonucu değiştirmez.
- ad-denetimi bulgusu 0; varlik'e alan eklenmez.
- ikiz-deneme Aynılık N/N.

80 maç, K1 tabanına göre:
- Sağlık aralığı dışında yeni '!' satırı yok.
- Gol/maç ve şut/maç gürültüde (±0,3).
- 'Top oyunda %' 55–75 içinde (beklenen düşüş 1–2 puan).
- Kart, faul ve penaltı dağılımı aynı (karar kodu değişmedi).
- Duruş süreleri (tempo B): barajlı serbest vuruş ortanca ~28–32 sn (kartlıda ~30–35), penaltı ~36–44, tarafsız gol → santra ~33–37. Kartlı duruşlar +2–5 sn. Korner temas ~18–20 sn, değişmez.

Seremoni ve düdük kapıları:
- Düdüksüz seremonili kullanım 0.
- Düdükten önce kullanım 0.
- Barajlı vuruşta düdük → koşu ≥ 1 sn %100.
- Düdükte hakem durmuş ≥ %95.
- Adımlamadan önce baraj dizili ≤ %10.
- Adımlamada hakemin yüzü gidiş yönünde ≥ %85.
- d-duran barajlı kapıları gürültüde: gol/şut %6–10, 18 m doğrudan şut %60–90.

Kart (d-sahne [1]):
- Gösterilmeden biten kart 0; kart sürerken kullanılan duran top 0.
- Yavaşladıktan sonra 5 m/sn üstüne çıkılan sahne 0; tepe hız ortancası ≤ 3,5 m/sn.
- Gösterilirken hakem–oyuncu ≤ 5 m ≥ %95.
- Yürür tarzında oyuncu durur ≥ %70.
- Tek tarz ≤ %80.
- Düdük → kullanım 1–2 sn %100.
- Kırmızı gören 12 sn sonra sahada 0.

Penaltı (d-sahne [2]):
- Düdük kullanımdan ≥ 0,4 sn önce %100.
- Düdükte ceza sahası ve yay boş ≥ %95.
- Faul → temas ortanca 32–48 (q10 ≥ 25, q90 ≤ 58).
- İtiraz eden ≥ 2,5; kaptan işareti ≥ %90.
- Hakemin itirazdaki tepe hızı ≤ 2,5 m/sn.
- Son 20 sn'de hareketsiz ≤ %65.
- d-penalti gol %70–82 (1600 atış).
- d-duran ribaund ≥ %70.

Gol (d-sahne [3]):
- Tarafsız gol → santra 28–42; sıralama acele ≤ tarafsız ≤ koru.
- Topun atan takımın yarısına geçmesi 0.
- Santracı kovalaması ve ışınlama 0.
- Düdüksüz santra 0; Law 8 ihlali 0.
- Kartsız hakem tepe hızı ≤ 3,2 m/sn.
- Tavana varan 0.
- Sevinç evresinde odak kümede ≥ %95.
- animasyon-olcum --olay: 10 golde ≥ 5 sevinç çeşidi, 'not' N/N, santrada çift düdük 0.

Korner rutini (k-protokol):
- En uzun kesintisiz boş bekleme ortanca ≤ 2, q90 ≤ 2,5 sn; kenarda q90 ≤ 3.
- Kullanım − planlanan an |ortanca| ≤ 0,3 sn.
- Her varyant ≥ %5 (tekrar ≥ %3).
- Barajlı ve penaltıda düdükten önceki en uzun boş bekleme q90 ≤ 3 sn.
- d-duran korner başına gol %3–5 (1600 korner).
- d-topcu zorla teslim 0.

Seyrek ve çekirdek senaryolar (oturum-sonu --seyrek): d-duran, d-penalti, d-topcu, m-isinma, m-fotograf, o-ofsayt, o-sakatlik, p-tip, d-sahne, c-*, b-pas, t-top, v-sut, d-sut, z-s3, z-s10, z-s14 hepsi kapı içinde.

Çizim:
- animasyon-olcum --duran 24: 'A: duran top' satırları K1 animasyon tabanına göre aynı ya da açıklanmış.
- 'A: zamanlama'da yeni hakem işaretleri olayla aynı karede N/N.
- kontrol.py ve akis-deneme (17, 18) hatasız; bu dizüstünde bilinen düşen bölümler hariç.

Hız: aynı süreçte, K1 ağacına karşı eşleştirilmiş ortanca artış ≤ %10. Evre payı hiz-evre ile ayrılır.

Duyarlılık karnesi koşulur; yeni taban s1.json ve s1-anm.json yazılır.

## Belge notu

### 12.15 S1 — plan (2026-10-20, dizüstü; dal `claude/motor-s1`, K1'in ucundan; oto mod)

**Kapsam.** L.9'un 1–4. ve 6. maddeleri bu turda uygulanır. 5. madde (sağlıkçılar) K1'de uygulandı; S1'de yalnız ölçülür.

- **Seremonili barajlı serbest vuruş:** hakem "düdüğü bekle" işareti verir, sprey sıkar, baraj kaos içinde kurulur (kalecinin yönlendirmesi ve hakemin itmesiyle), hakem 9,15 m'yi öne yürüyerek adımlar, çizgiyi çeker, baraj dizilir. Hakem restart yerinde durur, düdük çalar, 1–3 sn sonra vurucu yay koşusuna başlar.
- **Kart:** hakem yürür ya da çağırır; kalabalık varyantında kaptan protokolü işler. Kart başın üstünde gösterilir, sonra deftere yazılır. Kart bitmeden duran top kullanılmaz; kullanım düdükle olur.
- **Penaltı (~40 sn):** hakem noktayı gösterir; itiraz ve kaptan protokolü gelir, kutu boşaltılır, kaleci çizgiye döner. Düdük çalar, vurucu 0,4–3 sn bekler.
- **Gol sonrası (~35 sn):** sevinç 11–15 sn ve türleri L.3 paylarıyla seçilir. Topu yenen takım noktaya gönderir; kaleci topu uzağa atmaz. Hakem not alıp santraya yürür, yan hakem orta çizgiye koşar. Santra Law 8'e göre düdükle başlar, bakış sevinçte kalır.
- **Korner ve kenar kullananının rutini:** hareketsiz bekleme en çok 1–2 sn. Barajlı ve penaltıda vurucunun bekleyişi düdüğe kadar aynı ilkellerle dolar.

Tempo B'dir; gerçek saniyeyle tanımlıdır ve duruşta maç saati 2 kat akar.

**Mimari.**
- Kod yeni motor dosyası `js/mac-sahne.js`'tedir (akış 'S1'). Eski dosyalara yalnız korumalı kancalar girer.
- Tek anahtar `protokol`, bit maskesidir: 1 serbest vuruş, 2 kart, 4 penaltı, 8 gol, 16 bakış odağı, 32 korner rutini, 64 rutinin barajlı vuruşa ve penaltıya genişlemesi. Varsayılan 127; 0 iken motor K1 ile birebirdir.
- Parametreler: `seremoni`, `kartAyar`, `penaltiSahne`, `golTempo`, `kRutin`.
- Rastlantı yalnız h2 iledir: sahne kurulurken bir kez tohum alır, ana zar dizisi kaymaz.
- Düdük ön koşul tektir (`du.dudukGerek`, `du.dudukT`, `du.dudukBek`, `dudukCal`, `s1DudukKapisi`). Düdüksüz kullanım hiç yoktur, kart bitmeden düdük çalmaz.
- Hakemin dal sırası: kart > gol > duran top > genel.
- Ortak kalabalık ve kaptan işareti S1d ile S1b'de birlikte kullanılır. Hakemin "not" pozu ve defteri S1d ile S1c'de ortaktır.
- Ölçü `araclar/olcumler/k-protokol.js`, yeni seyrek senaryo `d-sahne` (kart, penaltı ve gol hücreleri).

**Sıra.** S1-0 ortak altyapı → S1a serbest vuruş → S1d kart → S1b penaltı → S1c gol → S1e rutin → kapanış. Her adımda yeni bit kapatılınca önceki adım birebir döner. Commit noktaları: S1-0 ile S1a, S1d ile S1b, S1c, S1e ile kapanış.

**Tasarımlardan sapmalar.**
- Alanlara özgü maske anahtarları yerine tek `protokol` anahtarı kullanılır.
- Düdük alanlarının adları birleşti.
- `kartYaz` → `not`.
- `d-pensahne` ve `d-gol` → tek `d-sahne`.
- `k-sahne` genişlemesi → `k-protokol`.
- Kart sahnesi `du.sahneT`'yi yalnız sahibi olmayan duruşlarda uzatır.
- Düdükten sonra gelen kart düdüğü sıfırlar.
- Kamerada gol sevinci kart bakışından önce gelir.
- İzlemeye kartın gösterilme penceresi eklendi.

**Kabul.**
- Barajlı duruş ortancası ~28–32 sn, penaltı ~36–44 sn, gol → santra ~33–37 sn.
- Kart, penaltı ve gol kapıları d-sahne'de.
- 80 maçta sağlık aralığı dışında yeni satır yok; hız artışı ≤ %10.
- VAR, kalecinin 8 sn sayımı ve çoklu top Z10'dadır.
