/* ============ Chairman — maç motoru: sahne protokolleri (mantık, çizimsiz) ============
   Sahibi: S1 akışı (S1, 2026-10-20; kullanıcı onaylı, oto mod; FUTBOL_KUTUPHANESI §12.13 ve §12.15, kutuphane/L-sahne-protokolleri.md L.1–L.6
   ve L.9, kutuphane/F F.8). Tempo B: duruşlar gerçek saniyeyle tanımlıdır, duruşta maç saati durusSaat (2) ile akar.
   Kapsam (alt adımlar, her biri kendi bitiyle gelir): seremonili barajlı serbest vuruş (S1a), kart sahnesi (S1d), penaltı sahnesi (S1b), gol
   sonrası akış ve bakış odağı (S1c), korner ve kenar kullananının rutini ve barajlı vuruşla penaltıya genişlemesi (S1e).
   Sözleşme (S1 planı §1):
   - Tek anahtar MOTOR_AYAR.protokol, bit maskesidir (S1_BIT): 1 serbest vuruş, 2 kart, 4 penaltı, 8 gol, 16 bakış odağı, 32 korner rutini,
     64 rutinin barajlı vuruşa ve penaltıya genişlemesi. 0 iken motor K1 ile birebirdir. Alanların parametre anahtarları (seremoni, kartAyar,
     penaltiSahne, golTempo, kRutin) kendi adımında bildirilir ve burada atanır.
   - Bütün yeni Match yöntemleri bu dosyadadır. Eski dosyalara (mac-durantop.js, mac-kurallar.js, mac-motoru.js, mac-takim.js, mac-mudahale.js)
     yalnız korumalı tek satırlık kancalar girer; bayraklar kurulmadıkça iş yapmazlar, bit 0 bütünlüğü bu dosyada denetlenir.
   - Rastlantı: this.rast()/normal() çekilmez (mevcut itirazEt ve zamanGecirEk çekimleri yerinde kalır). sahneOzet'in içinde this.t olduğu için
     yalnız sahne kurulurken bir kez çağrılır ve s1Tohum ile alanın tohumuna çevrilir; sonraki her karar h2(tohum, i). Ana zar dizisi kaymaz.
     Dolu sahneOzet tuzları 0, 1, 4, 5, 6, 7, 8; S1a 20, S1b 21 alır. Kart (kartOzet), gol (golOzet) ve rutin (tuz 41) kendi özetlerini kurar.
   - Oyuncu ve hakem nesnesine alan eklenmez (varlik 128 alan sınırı, araclar/ad-denetimi.js (f)): sahnenin durumu duruşta (du.*), kart
     kuyruğunun öğesinde (k.s), gol sevincinde (this.celeb) ve görev nesnesinde (p.duranRol) durur.
   - Düdük ön koşulu (ortak; S1a, S1b ve S1d kurar): du.dudukGerek ('baraj' | 'penalti' | 'kart') düdüğü isteyen sahne; du.dudukT düdüğün anı
     (du.t), du.dudukBek düdükten kullanıma bekleme (gerçek sn); du.dudukCalindi eski alandır — doluyken durusKullan'daki düdük bir daha çalmaz;
     du.s1Sure true ise sahnenin süre kapısını (sahneT) sahne planı verir. js/mac-durantop.js duranHazirMi 'return true'dan hemen önce
     s1DudukKapisi'ni sorar: düdüksüz kullanım hiç yoktur, kart bitmeden düdük çalmaz. Kart dalının alanları (S1d): du.kartBitT, du.kartDudukT,
     du.kartBek, du.kartTekrar. Düdükten sonra gelen kart (zaman ya da geç itiraz) düdüğü sıfırlar (du.kartTekrar), kapı kart bitince yeniden çalar.
   - Olay 'duduk' {tur, sinif, seremoni: true, bek, sahip} ve hakemde eylem {ad 'duduk', sure 0,8} aynı karede: çizim (js/animasyon.js
     anmHakemOlay) seremonili düdüğün işaretini STIL.animasyon.s1.duduk sn tutar (eylemin işaretini olay 0,1 sn içindeyse atlar — tek işaret);
     izleme (js/mac-izleme.js IZLEME.anlar.duduk) barajlı serbest vuruşun ve penaltının düdüğünde normal hıza iner.
   Ölçü araclar/olcumler/k-protokol.js (s1D_ ortak düdük satırları; alanlar s1a_, s1d_, s1b_, s1c_, s1e_). */
'use strict';
ayarEkle('S1',{
  protokol:31                  // S1: sahne protokolleri bit maskesi (S1_BIT) — 1 seremonili barajlı serbest vuruş (S1a), 2 kart sahnesi (S1d), 4 penaltı sahnesi
                               // (S1b), 8 gol sonrası akış (S1c), 16 bakış odağı (S1c; sonucu değiştirmez), 32 korner ve kenar kullananının rutini (S1e), 64 rutinin
                               // barajlı vuruşa ve penaltıya genişlemesi (S1e); 0: K1 (birebir). Varsayılan o ana dek uygulanan bitlerin toplamı (S1a: 1, S1d: 3, S1b: 7,
                               // S1c: 31)
  /* S1a (bit 1; sahne&1 ve sahne&4 ile): seremonili barajlı serbest vuruş — hedef temasa hedef süre (gerçek sn; tempo.baraj 24'ün karşılığı, × tempoBaglam
     × (1 ± tempoSapma)); topYer topun konma anı; kaos kaosun sınırları, kaosTaban varyantın alt sınırı (sakin kendi aralığıyla: kaos[0] … kaos[0] + 1);
     ek çizgi, dizilme, duruş ve koşunun payı; sakin, uzun varyant olasılıkları (kalanı olağan), uzunEk uzun varyantın kaosuna ek; yakin üyenin topa ilk
     uzaklığı (m); dagin kaostaki yan aralık çarpanı (0,5 m × sıra ×); itAdim hakemin her itişinde barajın geri çekilmesi (m); kipir kıpırtının yenilenme
     aralığı (sn); kalabalik ilk itişe dek barajsız savunmacının topa en yakın uzaklığı (m); heykel, mesafe (vurucunun mesafe isteği), sonJest (kalecinin
     dizilmedeki son yönlendirmesi) olasılıklar; dur hakemin restart yerinde durup düdükten önce bekleyişi (sn); duduk düdükten koşuya (sn); restart
     restart yeri (kaleye göre geride, koşunun öbür yanında; m); kayM kalecinin barajı kaydırması (m); adimHiz adımlamanın hız oranı (K1 ile aynı).
     Kısaltmak için: hedef 26, kaosTaban.olagan 2,5 (MAC_DENEME_AYAR'da nesne bütün olarak verilir) */
  ,seremoni:{hedef:28,topYer:[3.5,6],kaos:[1.5,10],kaosTaban:{sakin:1.5,olagan:3,uzun:4.5},ek:7.0,sakin:0.25,uzun:0.2,uzunEk:[3,5],yakin:[6.0,7.8],dagin:1.4,
    itAdim:0.7,kipir:[1.0,1.5],kalabalik:4.0,heykel:0.12,mesafe:0.6,sonJest:0.5,dur:[0.4,0.9],duduk:[1.0,3.0],restart:[2.0,5.5],kayM:[0.4,1.0],adimHiz:0.24}
  /* S1d (bit 2): kart sahnesi (kutuphane/L L.2–L.4 ve L.9 madde 4; tempo B, gerçek sn). tarz [yürür, çağırır, uzaktan] taban ağırlıkları (uzaklıkla
     ölçeklenir: yürür × clamp((18 − d0)/8, 0, 1,2), çağırır × clamp((d0 − 6)/8, 0,2, 1,4), uzaktan × clamp((30 − d0)/15, 0,3, 1), misillemede (neden
     'asiri') uzaktan × 3); kalabalik itiraz eden varken kalabalık tarzının olasılığı (kırmızı ya da ikinci sarıda × 0,5, ikisi de yoksa 0,05; 0: kalabalık
     kapalı); hiz hakemin oyuncuya yaklaşma hızı (m/sn): 6 m içinde, 6–15 m, 15 m ötesi (depar yok); zaman evre süreleri: karar (hakem hızını keser),
     tepki (oyuncunun durması ya da yürümeye başlaması), sari / ikinci / kirmizi kartın gösterilişi, yaz deftere yazma, itiraz kalabalığın itirazından
     protokole, protokol ve dagil kaptan işareti ya da uyarıdan dağılmaya, duduk sahne bitince düdüğe, kul düdükten kullanıma, tavan sahnenin en uzun
     süresi (kalabalıkta + 6; kırmızıda karardan 12 sn içinde sahadan çıkış). Kısaltmak için: zaman.itiraz [2,3], tavan 12 (nesne bütün olarak) */
  ,kartAyar:{tarz:[0.5,0.4,0.15],kalabalik:0.3,hiz:[1.8,2.8,3.4],
    zaman:{karar:[0.5,0.9],tepki:[0.3,1.0],sari:1.3,ikinci:2.4,kirmizi:1.8,yaz:[0.8,1.3],itiraz:[3,5],protokol:1.6,dagil:0.8,duduk:[0.8,1.5],kul:[1.0,2.0],tavan:16}}
  /* S1b (bit 4; sahne&1 ile): penaltı sahnesi (kutuphane/L L.2 ve L.9 madde 2; tempo B, gerçek sn). sure faulden temasa hedefin ortası; aralik kaos 0 → 1 süre
     çarpanı (sahneT = sure × aralık: sakin 30, kaotik 50 sn); kos kullanımdan temasa (planlı düdüğün hesabı; ölçülen koşu 2,34 sn); kaos* kaosun payları
     (taban, h2, kırmızı kart, ikinci yarının son 15 dakikasında fark ≤ 1, faul yapanın hakeme itiraz eğilimi; hakemin sertliği kısaltır); goster gösterme
     evresinin en kısa ve en uzun süresi; itiraz itirazın planlı sonu ve bosalt boşaltmanın planlı sonu (düdükten önceki planlı sürenin payı; itiraz kaos
     0 → 1); kalabalik hakeme yürüyen faul yapan takım oyuncusu (kaos 0 → 1); kaptanYakin kaptanın hakeme uzaklığı, halka öbürlerinin kaptan işaretinden
     önceki, kaptanR sonraki uzaklığı (m; IFAB'ın 4 m bölgesi); gerHiz hakemin geri geri yürüyüşü (hız oranı); yuruHiz boşaltmada yürüyüş, uzakHiz kutu
     dışından son yerine gelenler (m/sn); bekle vurucunun düdükten koşuya beklemesi (sn; h2 ve soğukkanlılık); hazirDur hakemin son yerinde durup baktığı
     süre (sn); kaleciItiraz (× (0,6 + 0,8·kaos)), kaleciOyun, karsi (× (0,5 + kaos)), duzelt varyant olasılıkları; protokolSari kaptan işaretinden sonra
     itiraz bölgesindeki oyuncuya sarının çarpanı (itirazKart × eğilim × sertlik × (1 + kaos); 0: yok); zorlaGetir vurucunun topu alması için güvenlik ağı
     (sn). tempo.penalti (27) yalnız bit 4 kapalıyken. Kısaltmak için: sure 36 (nesne bütün olarak) */
  ,penaltiSahne:{sure:40,aralik:[0.75,1.25],kos:2.3,kaosTaban:0.15,kaosH:0.55,kaosKirmizi:0.3,kaosSon:0.15,kaosItiraz:0.2,kaosSert:0.15,goster:[1.6,5],
    itiraz:[0.30,0.55],bosalt:0.85,kalabalik:[3,6],kaptanYakin:1.1,halka:[1.6,2.4],kaptanR:[4.2,5.2],gerHiz:0.12,yuruHiz:[1.2,2.2],uzakHiz:[1.0,4.0],
    bekle:[0.4,3.0],hazirDur:[0.6,1.4],kaleciItiraz:0.3,kaleciOyun:0.12,karsi:0.3,duzelt:0.2,protokolSari:1,zorlaGetir:12}
  /* S1c (bit 8; bit 16 bakış odağı): gol sonrası akış (kutuphane/L L.3, L.9 madde 3; tempo B, gerçek sn; kullanıcı onaylı ~35 sn). toplam golden santra
     vuruşuna hedef (düdük = toplam − 1,6; × bağlam: gol yiyen takımın koru/acele'si tempoBaglam ile, atan takımın acelesinde tempoBaglam[1]; ± tempoSapma, h2);
     sevinc sevinç evresi (h2); kritik ikinci yarının son 6 dakikasında fark ≤ 1 iken sevinç çarpanı; atan atan takım acele ederken (geride ya da geç
     eşitlemede) sevinç çarpanı — golcü topu ağdan kapıp ortaya koşar; kumeR golcünün kümesine koşan arkadaşların yarıçapı (m); donus dönüşte süreyi
     dolduran hızın sınırları (m/sn); kaleciAl kalecinin ağa yürümeye başlaması (sn); uzgun yenen takımın yerinde üzgün bekleyişi (sn); tavan zorla
     düdük (sn); tur golcünün koşu türü ağırlıkları (L.3; profilden: agresiflik köşe ve tribün, soğukkanlılık yerinde; pasçıya koşu yalnız asistte) —
     yalnız kose bırakılırsa çeşitlilik kapanır. Kısaltmak için: toplam 30 (MAC_DENEME_AYAR'da nesne bütün olarak verilir) */
  ,golTempo:{toplam:35,sevinc:[11,15],kritik:1.3,atan:0.35,kumeR:35,donus:[1.4,3.6],kaleciAl:[1.2,2.6],uzgun:[2,5],tavan:55,
    tur:{kose:0.32,tribun:0.30,yerinde:0.18,pasci:0.12,kulube:0.04}}
});
const S1_BIT=Object.freeze({SERBEST:1,KART:2,PENALTI:4,GOL:8,ODAK:16,RUTIN:32,RUTIN2:64});
/* S1b: penaltı kalabalığının yuvaları (rad; hakemden kümeye donmuş yönün çevresinde; kaptan 0'da) — fazlası ±0,55'lik adımlarla sürer (penaltiYuvaAci) */
const PEN_YUVA=Object.freeze([0,0.55,-0.55,1.1,-1.1,1.65,-1.65]);
/* S1c: santra noktası (bakış hedefi; salt okunur) */
const GOL_NOKTA=Object.freeze({x:0,z:MZ});
Object.assign(Match.prototype,{
  /* sahneOzet'in [0, 1) değerinden alanın tohumu (h2'nin ilk girdisi; tamsayı) */
  s1Tohum(v){return(v*2147483647)|0;},
  /* düdüğün ön koşulu: hakem kart göstermiyor, sakatlık beklemiyor, değişiklik sürmüyor (oyuncu girmedi) */
  dudukOnKosul(du){const dg=this.degisiklik;return!this.refs[0].kartSira&&!this.sakatlikBekletir()&&!(dg&&!dg.girdi);},
  /* seremonili düdük: an ve bekleme duruşa yazılır, hakem düdük çalar (eylem 0,8 sn), olay aynı karede */
  dudukCal(du,bek){
    du.dudukT=du.t;du.dudukBek=bek;du.dudukCalindi=true;
    this.refs[0].eylem={ad:'duduk',t:0,sure:0.8};
    this.on('duduk',{tur:du.tur,sinif:du.sinif||null,seremoni:true,bek,sahip:du.dudukGerek||null});},
  /* duranHazirMi'nin son kapısı (yalnız du.dudukGerek varken): kart sürerken kullanım yok (mutlak ağ zorlaHazir + 10 sn); kart sahnesinin düdüğü kart
     bitince ve ön koşul sağlanınca burada çalar (S1d: güvenlik ağından önce sorulur); düdük çalınmadıysa güvenlik ağından 2 sn önce düdük çalar
     (bekleme 0,5 sn; düdüksüz kullanım hiç yok); barajlı vuruşun ve penaltının düdüğünü sahnenin evre makinesi çalar. Düdükten sonra bekleme dolunca
     kullanılır */
  s1DudukKapisi(du,tk){
    const ag=du.zorlaHazir||28;
    if(this.refs[0].kartSira&&(MOTOR_AYAR.protokol&S1_BIT.KART)&&du.t<ag+10)return false;
    if(du.dudukT==null){
      /* S1d: kartın düdüğü (sahne bitti, bekleyiş doldu, ön koşul) güvenlik ağından önce sorulur — kullanan geç hazır olsa da bekleme kartın (1–2 sn) */
      if((du.dudukGerek==='kart'||du.kartTekrar)&&du.kartBitT!=null&&du.t>=du.kartBitT+du.kartDudukT&&this.dudukOnKosul(du)){this.dudukCal(du,du.kartBek);du.kartTekrar=false;return false;}
      if(du.t>=ag-2)this.dudukCal(du,0.5);
      return false;}
    return du.t>=du.dudukT+du.dudukBek;},

  /* ============ S1a (2026-10-20): seremonili barajlı serbest vuruş — bit 1 (S1_BIT.SERBEST), sahne&1 ve sahne&4 ile; yalnız sınıf 'baraj' ============
     kutuphane/L L.1 ve L.9 madde 1; kullanıcı notları 11–13. Sıra: gel → top → kaos → adim → cizgi → dizil → yer → dur → duduk. Hakem gelir, vurucuya
     "düdüğü bekle" işaretini verir (olay 'seremoni' tur 'bekle'; vurucu çoğu zaman barajı gösterip mesafe ister: jest 'isaret'), topun yerini sıkar;
     baraj önce topa 6–7,8 m'de dağınık ve kıpır kıpırdır (g.dizik false: baraj pozu yok), barajsız savunmacılar ilk itişe dek topa 4 m'ye dek
     kalabalık eder, %12 bir "heykel" topun önüne dikilir; kaleci ön direkten barajı kaydırır (jest 'yonlendir'), hakem 1–3 kez geri iter ('seremoni'
     tur 'it'); sonra K1'in adımlamasıyla barajın dış ucunun yanına yürür (baraj önünde geri çekilir), çizgiyi çeker, baraj çizgiye oturur (g.dizik);
     hakem vurucunun arkasında çaprazdaki restart yerine yürür ve DURUR; ön koşullar (barajDudukHazir) sağlanınca düdük (dudukCal), vurucu 1–3 sn
     sonra yay koşusuna başlar (duranHazirMi'nin düdük kapısı s1DudukKapisi). Kaosun süresi sahne hedefinden kalandır (sakin / olağan / uzun).
     Durum du.hk {s1, evre, t (top konduktan beri), s (evre sayacı; K1 ile aynı anlam — 'cizgi'de spreyin zamanı), es (evrede geçen), oz (alanın
     tohumu s1Tohum(sahneOzet(du, 20)); planın H.s'i — H.s K1'de evre sayacı olduğu için oz), tur, yerT, itN, itI, kay[], kayI, kayV, kaosT, dR,
     heykelVar, heykelP, dudukBekle, dur, uzunEk, mesafe, sonJest, R (restart yeri), wc (barajın ortası), kn (kaosta bakış), nk (K1: çizgide bakış)};
     üyenin görevinde g.dizik ve g.kaos {r, j, u, t} (kaostaki uzaklık, yan ve boyuna kıpırtı, sonraki kıpırtı anı). Kararlar h2(oz, k): 1 varyant,
     2 yerT, 3 itN, 4 kayN, 5 kayın işareti, 6–8 kayın büyüklüğü, 9 heykel, 10 düdük → koşu, 11 dur, 12 uzunEk, 13 mesafe isteği, 14 son jest, 15 sakin
     kaosun süresi; üye 100 + sıra; kıpırtı h2(oz + 131·n, 3k … 3k + 2), k = ⌊2·du.t⌋. Ana zar dizisi kaymaz. Hızlı vuruş istisnası değişmez
     (hizliSerbestMi barajlı sınıfı hiç çabuk saymaz) */
  s1SerbestAcik(){const A=MOTOR_AYAR;return(A.protokol&S1_BIT.SERBEST)!==0&&(A.sahne&5)===5;},
  barajSeremoniKur(du){
    const S=MOTOR_AYAR.seremoni,oz=this.s1Tohum(this.sahneOzet(du,20)),o=k=>h2(oz,k),ar=(a,x)=>a[0]+(a[1]-a[0])*x,v=o(1);
    const tur=v<S.sakin?'sakin':v>1-S.uzun?'uzun':'olagan';
    const itN=tur==='sakin'?1:tur==='uzun'?2+(o(3)<0.5?1:0):1+(o(3)<0.5?1:0),kayN=tur==='sakin'?1:tur==='uzun'?3:1+(o(4)<0.6?1:0),s0=o(5)<0.5?1:-1,kay=[];
    for(let i=0;i<kayN;i++)kay.push((i%2?-s0:s0)*ar(S.kayM,o(6+i)));
    du.s1Sure=true;du.dudukGerek='baraj';   /* süre kapısını sahne planı verir; kullanım düdüğü bekler (duranHazirMi → s1DudukKapisi) */
    return{s1:true,evre:'gel',t:0,s:null,es:0,oz,tur,yerT:ar(S.topYer,o(2)),itN,itI:0,kay,kayI:0,kayV:0,kaosT:null,dR:1.2,heykelVar:o(9)<S.heykel,heykelP:null,
      dudukBekle:ar(S.duduk,o(10)),dur:ar(S.dur,o(11)),uzunEk:tur==='uzun'?ar(S.uzunEk,o(12)):0,mesafe:o(13)<S.mesafe,sonJest:o(14)<S.sonJest,R:null,wc:null,kn:null,nk:null};},
  /* üyelerin kaostaki yeri (barajSahne; görevler yeniden dağıtılınca yeniden kurulur, hk korunur): ilk uzaklık yakin × h2, yapılmış itişler eklenir */
  barajSeremoniUyeler(du,G,U){const H=du.hk,S=MOTOR_AYAR.seremoni,Y=S.yakin;
    for(const p of U){const g=G.get(p);if(!g)continue;g.dizik=false;g.kaos={r:Math.min(8.6,Y[0]+(Y[1]-Y[0])*h2(H.oz,100+g.sira)+S.itAdim*H.itI),j:0,u:0,t:0};}},
  /* hakemin evre başına hedefi (hakemSpreyHedef ← hakemDuranYeri): gel ve top topun içe 0,8 m yanı; kaos topun önünde kümeye doğru dR (her itişte
     yaklaşır), kümenin ortası ve kaydırma; adim, cizgi, dizil barajın dış ucunun yanı (hakem barajın içinde kalmaz); yer, dur, duduk restart yeri */
  barajSeremoniHedef(du){const H=du.hk,W=du.barajW,e=H.evre;
    if(e==='kaos'){const r=H.dR,c=0.25*(W.n-1)*MOTOR_AYAR.seremoni.dagin+H.kayV;return{x:du.x+W.ux*r+W.px*c,z:du.z+W.uz*r+W.pz*c};}
    if((e==='yer'||e==='dur'||e==='duduk')&&H.R)return H.R;
    if(e==='adim'||e==='cizgi'||e==='dizil')return{x:W.x-W.px*0.9-W.ux*0.4,z:W.z-W.pz*0.9-W.uz*0.4};
    return{x:du.x+W.px*0.8,z:du.z+W.pz*0.8};},
  /* hakemin evre makinesi (hakemAI'nın duran top dalı → hakemSpreyAdim; hakemAI h.bak'ı topa, hızı uzaklığa göre yazmıştır): hız, bakış, olaylar,
     itiş ve kaydırma, adımlamada üyelerin geri çekilmesi, dizilmenin sonunda hakemHazir ve restart yeri, durda düdüğün ön koşulu ve tavanı. Kart
     gösterilirken (hakemAI'nın kart dalı) çağrılmaz: seremoni bekler */
  barajSeremoniAdim(du,h,uz,dt){
    const H=du.hk,W=du.barajW,S=MOTOR_AYAR.seremoni,tk=du.kullanan,yer=du.asama==='yerles'||du.asama==='hazir'||du.asama==='kullan';
    if(yer)H.t+=dt;H.es+=dt;
    const WC=H.wc||(H.wc={x:du.x+W.ux*9.15+W.px*0.25*(W.n-1),z:du.z+W.uz*9.15+W.pz*0.25*(W.n-1)}),yeni=e=>{H.evre=e;H.s=null;H.es=0;};
    switch(H.evre){
    case 'gel':   /* topa gelir, 2,5 m'de vurucuya "düdüğü bekle" (1,1 sn); tavan 10 sn */
      h.hizOran=uz>6?0.7:0.4;
      if(uz<2.5){if(H.s==null){H.s=0;if(H.mesafe&&tk&&hyp(tk.x-du.x,tk.z-du.z)<12)this.jestVer(tk,'isaret',0.9,WC);this.on('seremoni',{tur:'bekle',p:tk,x:h.x,z:h.z});}
        if(tk)h.bak=tk;H.s+=dt;if(H.s>1.1)yeni('top');}
      else if(H.es>10)yeni('top');
      return;
    case 'top':   /* top yerine konunca topun yeri sıkılır (Z2c; DT_SPREY.top); hakem 6 sn'de yetişemezse yerinde sıkar */
      h.hizOran=uz>6?0.7:0.4;
      if(yer&&(uz<0.6||H.t>6)){h.hizOran=0;if(H.s==null){H.s=0;this.on('sprey',{tur:'top',x:du.x,z:du.z,zaman:DT_SPREY.top});}H.s+=dt;if(H.s>DT_SPREY.top.sure)this.barajKaosBasla(du,h);}
      return;
    case 'kaos':{   /* itiş ve kaydırma takvimi; çıkış kaosT'de ve üyeler kaos yerinde (2,5 m), en geç kaosT + 4 */
      H.s+=dt;h.hizOran=0.3;const N=H.kn||(H.kn={x:0,z:0});N.x=WC.x+W.px*H.kayV;N.z=WC.z+W.pz*H.kayV;h.bak=N;
      if(H.itI<H.itN&&H.s>=0.5+H.itI*Math.max(1,H.kaosT-1)/H.itN){H.itI++;H.dR=Math.min(4.5,1.2+1.3*H.itI);
        this.on('seremoni',{tur:'it',p:H.heykelP||null,x:h.x,z:h.z,hedef:{x:N.x,z:N.z}});
        for(const p of du.barajdakiler){const g=p.duranRol;if(g&&g.kaos)g.kaos.r=Math.min(8.6,g.kaos.r+S.itAdim);}}
      if(H.kayI<H.kay.length&&H.s>=0.8+H.kayI*Math.max(0.8,H.kaosT-0.8)/H.kay.length){H.kayV=H.kay[H.kayI];H.kayI++;
        const kl=this.kaleci(1-du.takim),sg=Math.sign(H.kayV);if(kl&&kl.oyunda)this.jestVer(kl,'yonlendir',1.0,{x:W.x+W.px*sg*2,z:W.z+W.pz*sg*2},true);}
      if(H.s>=H.kaosT){let uzak=0;for(const p of du.barajdakiler){const g=p.duranRol;if(!p.oyunda||!g||!g.kaos)continue;const T=this.barajKaosHedef(du,g);if(hyp(p.x-T.x,p.z-T.z)>2.5)uzak++;}
        if(uzak===0||H.s>=H.kaosT+4)yeni('adim');}
      return;}
    case 'adim':{   /* K1 adımlaması (yüz gidiş yönüne: hakemSpreyYuz); baraj hakemin önünde geri çekilir; uz < 0,5 ya da 8 sn */
      h.hizOran=S.adimHiz;H.s=(H.s||0)+dt;this.hakemSpreyYuz(du,h);
      const dR=(h.x-du.x)*W.ux+(h.z-du.z)*W.uz;
      for(const p of du.barajdakiler){const g=p.duranRol;if(g&&g.kaos)g.kaos.r=Math.min(9.55,Math.max(g.kaos.r,dR+0.8));}
      if(uz<0.5||H.s>8)yeni('cizgi');
      return;}
    case 'cizgi':   /* K1: barajın çizgisi (DT_SPREY.cizgi); gövde ve baş sıkılan noktada */
      h.hizOran=0;
      if(H.s==null){H.s=0;const a=-0.3,c=0.5*(W.n-1)+0.3;this.on('sprey',{tur:'cizgi',x:W.x+W.px*a,z:W.z+W.pz*a,x2:W.x+W.px*c,z2:W.z+W.pz*c,zaman:DT_SPREY.cizgi});}
      H.s+=dt;this.hakemSpreyYuz(du,h);if(H.s>DT_SPREY.cizgi.sure)yeni('dizil');
      return;
    case 'dizil':{   /* 9,15 m işareti (barajYeri), kalecinin son yönlendirmesi; üyeler son yerine (≤ 0,35 m'de dizik); 1,2 sn ve hepsi 1 m içinde (en geç 6 sn) */
      h.hizOran=uz>0.5?0.3:0;
      if(H.s==null){H.s=0;H.kayV=0;this.on('barajYeri',{hedef:{x:du.x,z:du.z},x:h.x,z:h.z});
        const kl=this.kaleci(1-du.takim);if(H.sonJest&&kl&&kl.oyunda)this.jestVer(kl,'yonlendir',0.8,{x:W.x,z:W.z},true);}
      H.s+=dt;let tamam=true;for(const [p,y] of du.barajYer)if(p.oyunda&&hyp(p.x-y.x,p.z-y.z)>1.0){tamam=false;break;}
      if(H.s>=1.2&&(tamam||H.s>6)){du.hakemHazir=true;H.R=this.barajRestartYeri(du);yeni('yer');}
      return;}
    case 'yer':   /* restart yerine: uzakta yüz gidiş yönüne, 2,5 m içinde barajın ortasına; tavan 8 sn (tavanda R o anki yer) */
      h.hizOran=uz>2.5?0.6:0.3;h.bak=uz>2.5?null:WC;
      if(uz<0.6&&h.spd<0.4)yeni('dur');else if(H.es>8){H.R={x:h.x,z:h.z};yeni('dur');}
      return;
    case 'dur':   /* R'de durur, yüzü barajda; R'den 0,8 m çıkarsa (kart) 'yer'e döner; dur sn ve ön koşul (ya da 5 sn ve dudukOnKosul) → düdük */
      h.hizOran=0;h.bak=WC;if(hyp(h.x-H.R.x,h.z-H.R.z)>0.8){yeni('yer');return;}H.s=(H.s||0)+dt;
      if(du.dudukT!=null){yeni('duduk');return;}   /* güvenlik ağı (s1DudukKapisi) önce çaldı */
      if(H.s>=H.dur&&(this.barajDudukHazir(du)||H.s>=5&&this.dudukOnKosul(du))){this.dudukCal(du,H.dudukBekle);yeni('duduk');}
      return;
    case 'duduk':h.hizOran=0;h.bak=WC;return;}
  },
  /* kaosun başı (top evresinin sonunda): süresi sahne hedefinden kalan — adımlama ((9,15 − 0,6 − 1,2) m / (adimHiz · azami hız) + 0,8 sn), restart
     yürüyüşü (|R − barajın ortası| / 3,2 m/sn), ek ve düdük → koşu çıkınca; sakinde kaos[0] … kaos[0] + 1. Heykel: 6 m içindeki en yakın görevsiz savunmacı */
  barajKaosBasla(du,h){const H=du.hk,S=MOTOR_AYAR.seremoni,ar=(a,x)=>a[0]+(a[1]-a[0])*x;
    const dA=Math.max(0,9.15-0.6-1.2)/(S.adimHiz*h.maxSpd)+0.8,R=this.barajRestartYeri(du),dY=hyp(R.x-H.wc.x,R.z-H.wc.z)/3.2;
    H.kaosT=H.tur==='sakin'?ar([S.kaos[0],S.kaos[0]+1],h2(H.oz,15)):clamp(du.sahneT-du.t-dA-dY-S.ek-H.dudukBekle,S.kaosTaban[H.tur],S.kaos[1])+H.uzunEk;
    if(H.heykelVar){let en=null,ed=6;for(const q of this.sahadakiler(1-du.takim)){if(q.rol==='GK'||du.gorev.has(q)||q.eylem&&q.eylem.kilit)continue;const L=hyp(q.x-du.x,q.z-du.z);if(L<ed){ed=L;en=q;}}H.heykelP=en;}
    H.evre='kaos';H.s=0;H.es=0;},
  /* üyenin kaos hedefi: topa göre barajın doğrultusunda r + boyuna kıpırtı, yana sıra × 0,5 × dagin + kaydırma + yan kıpırtı */
  barajKaosHedef(du,g){const W=du.barajW,H=du.hk,K=g.kaos,r=K.r+K.u,lat=g.sira*0.5*MOTOR_AYAR.seremoni.dagin+H.kayV+K.j;
    return{x:du.x+W.ux*r+W.px*lat,z:du.z+W.uz*r+W.pz*lat};},
  /* görev döngüsünün kancası (durusYerlesim; true: döngünün varsayılan yolu atlanır): çizgiye dek baraj üyesi kaos yerinde (kıpırtı 1–1,5 sn'de
     yenilenir; hız uzaklıkla 0,35–0,85, yüz topa), sonra son yerine (0,35 m içinde dizik); kaleci top, kaos, adım ve çizgide ön direkte (çizgiden
     0,7 m, direğin 0,4 m içinde) */
  barajSeremoniYer(du,p,g){
    const H=du.hk,e=H.evre,b=this.ball,S=MOTOR_AYAR.seremoni;
    if(g.rol==='baraj'&&g.kaos){
      if(e==='gel'||e==='top'||e==='kaos'||e==='adim'||e==='cizgi'){const K=g.kaos;
        if(du.t>=K.t){const k=Math.floor(2*du.t),z=H.oz+131*p.n;K.j=(h2(z,3*k)-0.5)*0.7;K.u=(h2(z,3*k+1)-0.5)*0.6;K.t=du.t+S.kipir[0]+(S.kipir[1]-S.kipir[0])*h2(z,3*k+2);}
        const T=this.barajKaosHedef(du,g),ee=hyp(p.x-T.x,p.z-T.z);p.tx=T.x;p.tz=T.z;p.hizOran=ee>8?0.85:ee>3?0.6:0.35;p.bak=b;p.yonHedef=null;this.eforVer(p,ee>3?0.8:0.4);return true;}
      if(!g.dizik&&hyp(p.x-g.hx,p.z-g.hz)<0.35)g.dizik=true;
      return false;}
    if(g.rol==='kaleci'&&(e==='top'||e==='kaos'||e==='adim'||e==='cizgi')){const d=this.dir[du.takim],yan=Math.sign(du.z-MZ)||1;
      p.tx=d*PL-d*0.7;p.tz=MZ+yan*(GW2-0.4);const ee=hyp(p.x-p.tx,p.z-p.tz);p.hizOran=ee>3?0.6:0.35;p.bak=b;return true;}
    return false;},
  /* restart yeri: vurucunun arkasında çapraz — kaleye göre restart[0] m geride, yay koşusunun (geri noktası) öbür yanında restart[1] m; saha içine kırpılır */
  barajRestartYeri(du){const S=MOTOR_AYAR.seremoni,d=this.dir[du.takim],gx=d*PL,L=hyp(gx-du.x,MZ-du.z)||1,ux=(gx-du.x)/L,uz=(MZ-du.z)/L;
    let nx=-uz,nz=ux;const gX=du.geriX!=null?du.geriX-du.x:-ux,gZ=du.geriZ!=null?du.geriZ-du.z:-uz;if(gX*nx+gZ*nz>0){nx=-nx;nz=-nz;}
    return{x:clamp(du.x-ux*S.restart[0]+nx*S.restart[1],-PL+1,PL-1),z:clamp(du.z-uz*S.restart[0]+nz*S.restart[1],1,PW-1)};},
  /* düdüğün ön koşulları: kart, sakatlık, değişiklik yok (dudukOnKosul); vurucu hazır ve geri noktasında, zaman geçirme doldu; görevliler yerinde;
     bütün üyeler dizik, son yerine ≤ 0,35 m ve < 0,3 m/sn (yerdeki ya da kilitli üye hariç); yatan yatık; kaleci son yerine ≤ 0,6 m ve < 0,5 m/sn.
     Gevşetilmemeli: üyeler ≤ 1 m iken çalan düdük barajı aralıklı bırakıyordu (prototip, d-duran 200: gol/şut %7,1 → %9,0) */
  barajDudukHazir(du){const tk=du.kullanan,H=MOTOR_AYAR.duranHazir[3];
    if(!this.dudukOnKosul(du))return false;
    if(!tk||du.asama!=='hazir'||!(du.hazirT>=H&&(hyp(tk.x-du.geriX,tk.z-du.geriZ)<0.5||du.hazirT>H+2)))return false;
    if(du.zgEk>0&&du.hazirT<H+du.zgEk)return false;
    if(!this.gorevlilerYerinde(du))return false;
    for(const [p,y] of du.barajYer){if(!p.oyunda||p.eylem&&p.eylem.kilit)continue;const g=p.duranRol;if(g&&g.dizik===false||hyp(p.x-y.x,p.z-y.z)>0.35||p.spd>0.3)return false;}
    const Y=du.yatan,GY=Y&&Y.duranRol;if(Y&&Y.oyunda&&GY&&GY.rol==='yatan'&&!GY.yatik&&!(Y.eylem&&Y.eylem.kilit))return false;
    const kl=this.kaleci(1-du.takim),gk=kl&&du.gorev?du.gorev.get(kl):null;if(gk&&kl.oyunda&&(hyp(kl.x-gk.hx,kl.z-gk.hz)>0.6||kl.spd>0.5))return false;
    return true;},
  /* durusYerlesim'in 9,15 m itişi: heykel ilk itişe dek topun 2,2 m önünde, yüzü vurucuya (true: itiş atlanır) */
  barajHeykel(du,p){const H=du.hk;if(H.heykelP!==p||H.itI>0)return false;const W=du.barajW;
    p.tx=du.x+W.ux*2.2;p.tz=du.z+W.uz*2.2;p.hizOran=0.5;p.bak=du.kullanan||this.ball;p.yonHedef=null;return true;},
  /* itişin yarıçapı: ilk itişe dek (gel, top, kaos) o an 9,15 m içindeki savunmacı topa seremoni.kalabalik m'ye dek yaklaşabilir; sonra 9,6 m */
  barajItisR(du,p){const H=du.hk,e=H.evre;return H.itI===0&&(e==='gel'||e==='top'||e==='kaos')&&hyp(p.x-du.x,p.z-du.z)<9.15?MOTOR_AYAR.seremoni.kalabalik:9.6;},
  /* ============ S1d (2026-10-20): kart sahnesi — bit 2 (S1_BIT.KART) ============
     kutuphane/L L.2–L.4 ve L.9 madde 4; kullanıcı notları (kart: hakem depar atıyor, kartların ~%21'i gösterilmiyor). Kart kuyruğunun öğesinde
     (k = hakem.kartKuyruk öğesi {p, renk, t, no, neden, oz, s}; oyuncuya ve hakeme alan eklenmez) küçük bir sahne k.s: tarz h2 ile yürür, çağırır,
     kalabalık ya da uzaktan. Evreler karar → [kalabalik →] yaklas → goster → yaz → bitti (kırmızıda kalabalık gösterdikten sonra, oyuncu çıkarken).
     Hakem kartAyar.hiz'i aşmaz (depar yok); oyuncu durur ya da hakeme yürür; kalabalıkta takım arkadaşları hakemin 1,4–1,9 m'sine gelip itiraz eder,
     hakem kaptan işareti (olay 'kaptanIsareti') ya da uyarı (olay 'uyari' neden 'kalabalik') verir, kaptan dışındakiler 4,6 m'ye çekilir. Kart
     başın üstünde (hakem eylemi 'kart'; ikinci sarıda önce sarı, sonra kırmızı), sonra deftere yazma (eylem 'not'). Duruşta kart bitmeden duran top
     kullanılmaz; sahne bitince hakemin seremonili düdüğü (s1DudukKapisi'nin kart dalı: du.kartBitT + du.kartDudukT), 1–2 sn sonra kullanım.
     Faz 'durus' değilse (gol, santra, oyunda kalecinin zaman kartı) ya da zaman kartında uzaktan; oyun başlarsa kalan sahne uzaktan. Tavan 16 sn
     (kalabalıkta 22; kırmızıda karardan 12 − kartın süresi − 0,5 sn): kart gösterilmeden sahne bitmez. Kararlar kartOzet(k, tuz): 1 kalabalık, 2 tarz,
     3 karar, 4 tepki, 5 yazma, 6 itiraz süresi, 7 kalabalığın sayısı, 8 protokolün türü, 9 yürürde oyuncunun adımı, 10+i / 20+i / 30+i üyenin yeri,
     itirazı ve geri çekilişi, 11 düdük, 12 düdükten kullanıma, 13 kart sonrası tepki. Ana zar dizisi kaymaz (itirazEt ve zamanGecirEk yerinde).
     Kancalar: js/mac-kurallar.js kartGoster (kartKur), hakemAI (kartSahneAdim; sahne tutarken hakemi sahne sürer), stepDurus (kartOyuncuAdim),
     durusKullan (zaman kartı kullanımdan önce ve tek sayım); js/mac-mudahale.js faul (du.kartNeden). Ölçü araclar/olcumler/k-protokol.js s1d_ */
  s1Kart(){return(MOTOR_AYAR.protokol&S1_BIT.KART)!==0;},
  /* kartın h2 özeti: taban (tohum, oyuncu, takım, kartın maçtaki sırası) ilk çağrıda donar — kırmızıdaki yeniden dizilişte p.n değişir */
  kartOzet(k,t){if(k.oz==null)k.oz=(this.tohum|0)*157+(k.p.n|0)*31+(k.p.team|0)*11+(k.no|0)*7;return h2(k.oz,(k.no|0)*1009+t*13+9);},
  /* kartGoster'in kancası (kayda yazılmadan önce): kartın sırası ve gerekçesi; duruşta seremoni — çabuk serbest vuruş ve hızlı taç kapanır, düdüğün
     sahibi yoksa kart olur (hakem topunda düdük yok: top bırakılır), düdükten sonra gelen kart (zaman, geç itiraz) düdüğü sıfırlar (S1 planı §1.4) */
  kartKur(k,neden){
    const du=this.phase==='durus'?this.durus:null;
    k.no=this.kayit.kartlar.length;k.neden=neden||(du&&du.faulYapan===k.p&&du.kartNeden)||null;
    if(!du)return;
    du.kartS=true;if(du.hizli==null)du.hizli=false;du.hizliTac=false;
    if(!du.dudukGerek&&!du.hakemTopu)du.dudukGerek='kart';
    if(du.dudukT!=null&&du.asama!=='kullan'){du.dudukT=null;du.dudukCalindi=false;du.kartTekrar=true;}},
  /* sahnenin kuruluşu (hakemAI'nın ilk karesi; itirazEt'ten sonra olduğu için itiraz edenler bilinir). Tarz öncelik sırasıyla (S1 planı): duruş yok,
     oyuncu sahada değil ya da zaman kartı (kullananın; hakem uzaktan gösterir) → uzak; kullanan → yürür; kalabalık (penaltıda yok); yerdeki oyuncu →
     yürür; uzaklıkla ağırlıklı yürür / çağırır / uzak.
     Duruşun süresi tahminle uzar: düdüğün sahibi kartsa sahneT (ve güvenlik ağları), barajda ve penaltıda yalnız ağlar (sahnenin planı emer) */
  kartSahneKur(h,k,du){
    const KA=MOTOR_AYAR.kartAyar,Z=KA.zaman,p=k.p,o=t=>this.kartOzet(k,t),ar=(a,t)=>a[0]+(a[1]-a[0])*o(t);
    const d0=hyp(h.x-p.x,h.z-p.z),kir=k.renk!=='sari',D=this.phase==='durus'&&du?du:null;
    let itz=0;for(const q of this.teams[p.team])if(q.oyunda&&q!==p&&q.eylem&&q.eylem.ad==='itiraz')itz++;
    let tarz;
    if(!D||!p.oyunda||k.neden==='zaman')tarz='uzak';
    else if(D.kullanan===p)tarz='yuru';
    else if(KA.kalabalik>0&&D.tur!=='penalti'&&o(1)<(itz?KA.kalabalik:kir?0.5*KA.kalabalik:0.05))tarz='kalabalik';
    else if(p.eylem&&p.eylem.kilit)tarz='yuru';
    else{const W=KA.tarz,wy=W[0]*clamp((18-d0)/8,0,1.2),wc=W[1]*clamp((d0-6)/8,0.2,1.4),wu=W[2]*(k.neden==='asiri'?3:1)*clamp((30-d0)/15,0.3,1),s=o(2)*(wy+wc+wu);
      tarz=s<wy?'yuru':s<wy+wc?'cagir':'uzak';}
    const Tg=k.renk==='sari'?Z.sari:k.renk==='ikinciSari'?Z.ikinci:Z.kirmizi;
    const S={tarz,evre:'karar',et:0,tt:0,d0,Tk:tarz==='uzak'?0.3+0.3*o(3):ar(Z.karar,3),Tr:ar(Z.tepki,4),Tg,Td:ar(Z.yaz,5)*(tarz==='uzak'?0.7:1),Ti:ar(Z.itiraz,6),
      tavan:kir?Math.min(Z.tavan,12-Tg-0.5):Z.tavan+(tarz==='kalabalik'?6:0),dur:null,adim:false,ms:0,K:null,kc:null,proto:null,gosterildi:false,yazildi:false,tut:true,itz};
    if(tarz==='kalabalik'&&!kir)S.K=this.kartKalabalikKur(k,h);
    if(D&&D.kartS){const yol=tarz==='uzak'?0:tarz==='kalabalik'?S.Ti+Z.protokol+Z.dagil+2:Math.min(6,d0/(tarz==='cagir'?4.3:KA.hiz[1]));
      const est=S.Tk+yol+S.Tg+S.Td+Z.duduk[1]+Z.kul[0]+(D.hk&&!D.hk.s1&&D.hk.evre==='top'?12:0);
      if(D.dudukGerek==='kart'){
        if(D.sahneT&&D.t+est+D.sahneKos>D.sahneT){D.sahneT=D.t+est+D.sahneKos;const pay=D.tur==='tac'?1.0:D.hk?12:3.0;D.zorlaGetir=Math.max(D.zorlaGetir||16,D.sahneT-D.sahneKos-pay+2);}
        D.zorlaHazir=Math.max(D.zorlaHazir||28,(D.sahneT||D.t+est)+10);}
      else D.zorlaHazir=(D.zorlaHazir||28)+est;}
    return S;},
  /* kalabalık (kartın): önce kartı gören, sonra itiraz edenler, kaptan, 18 m içindeki en yakınlar; sayı 1 + ⌊3·h2⌋ (kırmızıda + 1, en çok 4); kaleci,
     kullanan ve yerdeki hariç. Yön hakemden kartı görene (donar); yuvalar 0,6 rad aralıkla */
  kartKalabalikKur(k,h){
    const p=k.p,du=this.durus,L=[],o=t=>this.kartOzet(k,t);
    for(const q of this.teams[p.team]){if(!q.oyunda||q.rol==='GK'||q.eylem&&q.eylem.kilit||du&&q===du.kullanan)continue;
      const dq=Math.min(hyp(q.x-h.x,q.z-h.z),hyp(q.x-p.x,q.z-p.z));if(dq>18&&q!==p)continue;
      L.push({q,s:dq-(q.eylem&&q.eylem.ad==='itiraz'?8:0)-(q.kaptan?4:0)-(q===p?30:0)});}
    L.sort((a,c)=>a.s-c.s||a.q.n-c.q.n);
    const n=clamp(1+Math.floor(3*o(7))+(k.renk!=='sari'?1:0),1,4),Q=L.slice(0,Math.min(n,L.length)).map(e=>e.q);
    const kp=Q.find(q=>q.kaptan)||Q.find(q=>q!==p)||p,L0=hyp(p.x-h.x,p.z-h.z)||1;
    return this.kalabalikKur(Q,kp,{r0:[1.4,1.9],r1:4.6,rk:1.7,yuva:(i,m)=>(i-(m-1)/2)*0.6},o,(p.x-h.x)/L0,(p.z-h.z)/L0);},
  /* ortak kalabalık (S1d ve S1b; S1 planı §1.7): K {uyeler [{q, aci (yuvanın açısı), r0 (protokole dek), r1 (protokolden 0,5 sn sonra), gec (geri
     çekildi), jT (itirazın fazı), jk}], kaptan, ux, uz (donmuş yön: hakemden kümeye), protoT (protokolün anı, K.t), t, rk (kaptanın protokolden sonraki
     uzaklığı)}. P: {r0, r1 ([a, b] ya da sayı), rk, yuva(i, n)}; o(i): h2 değeri */
  kalabalikKur(Q,kaptan,P,o,ux,uz){const n=Q.length,ar=(a,x)=>Array.isArray(a)?a[0]+(a[1]-a[0])*x:a;
    return{uyeler:Q.map((q,i)=>({q,aci:P.yuva(i,n),r0:ar(P.r0,o(10+i)),r1:ar(P.r1,o(30+i)),gec:false,jT:1.8*o(20+i),jk:-1})),kaptan,ux,uz,protoT:null,t:0,rk:P.rk};},
  /* her kare (durusYerlesim'den sonra): hedef hakemin konumu + donmuş yönün yuva açısıyla döndürülmüşü × r; hız hedefe uzaklıkla (8 m'den uzakta 0,6,
     3–8 m 0,35, 3 m içinde 0,2); yüzü hakemde; geri çekilmeyen üye hakeme 4 m içindeyse 1,8 sn'de bir itiraz jesti. izin(q): sahne bu oyuncuyu
     sürebilir mi (kullanan, topu durduran, yerdeki hariç) */
  kalabalikAdim(K,h,dt,izin){K.t+=dt;const b=Math.atan2(K.uz,K.ux),pr=K.protoT!=null;
    for(const e of K.uyeler){const q=e.q;if(!q.oyunda||izin&&!izin(q))continue;
      const kp=pr&&q===K.kaptan;e.gec=pr&&!kp&&K.t>K.protoT+0.5;
      const R=kp?K.rk:e.gec?e.r1:e.r0,a=b+e.aci,tx=clamp(h.x+Math.cos(a)*R,-PL+0.3,PL-0.3),tz=clamp(h.z+Math.sin(a)*R,0.3,PW-0.3),d=hyp(q.x-tx,q.z-tz);
      q.tx=tx;q.tz=tz;q.hizOran=d>8?0.6:d>3?0.35:0.2;q.bak=h;q.yonHedef=null;this.eforVer(q,d>8?0.8:d>3?0.5:0.3);this.gorevYaz(q,'kalabalik');
      if(!e.gec){const jk=Math.floor((K.t+e.jT)/1.8);if(jk!==e.jk){e.jk=jk;if(hyp(q.x-h.x,q.z-h.z)<4)this.jestVer(q,'itiraz',1.2,{x:h.x,z:h.z});}}}},
  /* oyuncu meşgul: sahada değil, yerde ya da kilitli eylemde, ya da faulden sonra yuvarlanan topu durduran (top gönderilmemişken) */
  kartMesgul(p,du){return!p.oyunda||!!(p.eylem&&p.eylem.kilit)||!!du&&(p===du.durduran&&!du.gonderildi&&(du.asama==='bekle'||du.asama==='getir'));},
  /* hakemin evre makinesi (hakemAI; sahne tutarken — S.tut, faz 'play' değil — hakemin hedefini, hızını ve bakışını yazar): olaylar 'kartSahne'
     {evre, tarz, p, renk, no, sure?}, hakem eylemleri 'kart' ve 'not'; bitince kuyruk ilerler, son kartta düdüğün zamanı duruşa yazılır */
  kartSahneAdim(h,k,dt,du){
    const KA=MOTOR_AYAR.kartAyar,Z=KA.zaman,p=k.p,ar=(a,t)=>a[0]+(a[1]-a[0])*this.kartOzet(k,t);k.t+=dt;
    let S=k.s;
    const ev=(e,ek)=>this.on('kartSahne',Object.assign({evre:e,tarz:S.tarz,p,renk:k.renk,no:k.no},ek||null));
    if(!S){S=k.s=this.kartSahneKur(h,k,du);ev('karar');}
    S.et+=dt;S.tt+=dt;
    const gec=e=>{S.evre=e;S.et=0;if(e==='kalabalik'&&!S.K)S.K=this.kartKalabalikKur(k,h);ev(e);};
    const oyunda=this.phase==='play';
    if(oyunda&&S.evre!=='goster'&&S.evre!=='yaz'){S.tarz='uzak';S.K=null;gec(S.gosterildi?'yaz':'goster');}
    else if(!p.oyunda&&!S.gosterildi&&S.evre!=='goster'){S.tarz='uzak';S.K=null;gec('goster');}   /* kartı görecek oyuncu sahadan çıktı (değişiklik): uzaktan */
    S.tut=!oyunda;
    const dd=hyp(h.x-p.x,h.z-p.z),dur=()=>{if(S.tut){h.tx=h.x;h.tz=h.z;h.hizOran=0.15;}};
    if(S.tut)h.bak=p;
    if(S.tt>S.tavan&&S.evre!=='goster'&&S.evre!=='yaz')gec(S.gosterildi?'yaz':'goster');
    switch(S.evre){
    case 'karar':   /* faulün düdüğü ve yön işareti sürer; hakem hızını keser (hedef 0,35 sn önü), yüzü oyuncuda */
      if(S.tut){h.tx=clamp(h.x+h.vx*0.35,-PL+1,PL-1);h.tz=clamp(h.z+h.vz*0.35,1,PW-1);h.hizOran=0.3;}
      if(S.et>=S.Tk)gec(S.tarz==='uzak'?'goster':S.tarz==='kalabalik'&&k.renk==='sari'?'kalabalik':'yaklas');
      return;
    case 'kalabalik':{   /* hakem oyuncunun 1,6 m'sine 1,6 m/sn ile, yüzü kümenin ortasında; Ti'de protokol, protokol + dağılma sonra kart ya da yazma */
      dur();const K=S.K;
      if(S.tut&&dd>2.2&&p.oyunda){const u=dd||1;h.tx=p.x+(h.x-p.x)/u*1.6;h.tz=p.z+(h.z-p.z)/u*1.6;h.hizOran=Math.min(1,1.6/h.maxSpd);}
      if(K&&S.tut){let x=0,z=0,n=0;for(const e of K.uyeler)if(e.q.oyunda){x+=e.q.x;z+=e.q.z;n++;}if(n){const C=S.kc||(S.kc={x:0,z:0});C.x=x/n;C.z=z/n;h.bak=C;}}
      if(!S.proto&&S.et>=S.Ti){const kp=K?K.kaptan:p;S.proto={t:S.et,tip:this.kartOzet(k,8)<0.6?'kaptan':'uyari',kaptan:kp};if(K)K.protoT=K.t;
        if(S.proto.tip==='kaptan'){const C=S.kc||p;this.on('kaptanIsareti',{kaynak:'kart',ikinci:false,hx:C.x,hz:C.z});}else this.on('uyari',{p:kp,neden:'kalabalik'});}
      if(S.proto&&S.et>=S.proto.t+Z.protokol+Z.dagil)gec(k.renk==='sari'?(dd<2.4?'goster':'yaklas'):'yaz');
      return;}
    case 'yaklas':{   /* hakem oyuncunun 1,3 m yanına, kartAyar.hiz ile (çağırırda buluşmaya yürür); meşgul oyuncuda süre durur. Kart 1,9 m'de; süre
         (1,5 + d0/3,5, en çok 9 sn) dolunca 5 m içinde, en geç 6 sn sonra (ve tavanda) nerede olursa */
      const ms=this.phase==='durus'&&this.kartMesgul(p,du);if(ms)S.ms+=dt;
      if(S.tut){const u=dd||1,H=KA.hiz,v=dd>15?H[2]:dd>6?H[1]:H[0];h.tx=clamp(p.x+(h.x-p.x)/u*1.3,-PL+0.5,PL-0.5);h.tz=clamp(p.z+(h.z-p.z)/u*1.3,0.5,PW-0.5);
        h.hizOran=Math.min(1,(S.tarz==='cagir'&&!ms?(S.d0>10?Math.min(v,2.4):1.0):v)/h.maxSpd);}
      const Ty=Math.min(9,1.5+S.d0/3.5)+S.ms;if(dd<1.9||S.et>Ty&&dd<5||S.et>Ty+6)gec('goster');
      return;}
    case 'goster':   /* hakem durur, kart başın üstünde (eylem 'kart'); oyuncunun tepkisi (sarıda %30 itiraz, kırmızıda %50 başı ellerinde) */
      dur();
      if(!S.gosterildi){S.gosterildi=true;h.eylem={ad:'kart',t:0,sure:S.Tg,renk:k.renk};
        if(p.oyunda&&this.phase==='durus'){const r=this.kartOzet(k,13),sari=k.renk==='sari';if(r<(sari?0.3:0.5))this.jestVer(p,sari?'itiraz':'basEl',sari?1.4:1.8,sari?{x:h.x,z:h.z}:null,true);}}
      if(S.et>=S.Tg){if(p.kart===2&&p.oyunda)this.oyundanCikar(p);gec(S.tarz==='kalabalik'&&k.renk!=='sari'&&!S.proto?'kalabalik':'yaz');}
      return;
    case 'yaz':   /* deftere yazma (eylem 'not'); oyuncu 0,4 sn sonra serbest. Bitince kuyruk ilerler; son kartta düdüğün zamanı */
      dur();if(!S.yazildi){S.yazildi=true;h.eylem={ad:'not',t:0,sure:S.Td};}
      if(S.et>=S.Td){const Q=h.kartKuyruk;if(Q&&Q[0]===k)Q.shift();h.kartSira=Q&&Q.length?Q[0]:null;if(p.kart===2&&p.oyunda)this.oyundanCikar(p);
        S.tut=false;S.evre='bitti';ev('bitti',{sure:S.tt});
        if(du&&du.kartS&&!h.kartSira&&this.phase==='durus'){du.kartBitT=du.t;du.kartDudukT=ar(Z.duduk,11);du.kartBek=ar(Z.kul,12);}}
      return;}
  },
  /* oyuncuların hedefleri (stepDurus; durusYerlesim'den sonra): kalabalık (kalabalikAdim), kartı görenin durması ya da hakeme yürümesi (çağırırda
     hakemin 1,3 m önüne 1,9 m/sn; yürürde tepkiden sonra frenin yolunun sonunda durur, %50 hakem 6 m'ye gelince 0,6–1,2 m'lik bir iki adım). Kullanan ve
     meşgul oyuncu ezilmez */
  kartOyuncuAdim(du,dt){
    const h=this.refs[0],k=h.kartSira,S=k&&k.s;if(!S||!S.tut||S.evre==='bitti')return;
    const p=k.p,dd=hyp(h.x-p.x,h.z-p.z),serbest=q=>q!==du.kullanan&&!this.kartMesgul(q,du);
    const yaz=(q,x,z,hiz,ef)=>{q.tx=clamp(x,-PL+0.3,PL-0.3);q.tz=clamp(z,0.3,PW-0.3);q.hizOran=Math.min(1,hiz/q.maxSpd);q.bak=h;q.yonHedef=null;this.eforVer(q,ef);this.gorevYaz(q,'kart');};
    const K=S.K;
    if(K&&(S.evre==='kalabalik'||S.evre==='karar'&&S.tarz==='kalabalik')){this.kalabalikAdim(K,h,dt,serbest);if(K.uyeler.some(e=>e.q===p))return;}
    if(!serbest(p)||S.tarz==='uzak'||S.evre==='karar'||S.evre==='kalabalik')return;
    if(S.evre==='yaz'&&S.et>0.4)return;
    if(S.tarz==='cagir'&&S.evre==='yaklas'){if(S.et<S.Tr)return;const u=dd||1;yaz(p,h.x+(p.x-h.x)/u*1.3,h.z+(p.z-h.z)/u*1.3,1.9,0.3);return;}
    if(S.evre==='yaklas'&&S.tt<S.Tk+S.Tr)return;   /* tepki sahnenin başından (kalabalıktan sonra oyuncu bırakılmaz) */
    if(!S.dur){const u=clamp(hyp(p.vx,p.vz)/13,0.1,0.45);S.dur={x:p.x+p.vx*u,z:p.z+p.vz*u};}   /* durma noktası: kararlı frenin yolu (~6,5 m/sn²; ileri yürüyüp geri dönmesin) */
    const o9=this.kartOzet(k,9);
    if(S.tarz==='yuru'&&S.evre==='yaklas'&&!S.adim&&dd<6&&o9<0.5){S.adim=true;const L=hyp(h.x-S.dur.x,h.z-S.dur.z)||1,a=Math.min(1.2,Math.max(0,L-2))*(0.5+o9);
      S.dur={x:S.dur.x+(h.x-S.dur.x)/L*a,z:S.dur.z+(h.z-S.dur.z)/L*a};}
    yaz(p,S.dur.x,S.dur.z,S.adim?1.0:1.2,p.spd>1.5?1:0.3);},   /* koşarken durması istenen oyuncu kararlı frenler */

  /* ============ S1b (2026-10-20): penaltı sahnesi — bit 4 (S1_BIT.PENALTI), sahne&1 ile ============
     kutuphane/L L.2 ve L.9 madde 2; kullanıcı notu (penaltıda herkes yerinde bekliyor, itiraz yok, hakem kart için depar atıyor). Tempo B: faulden temasa
     ~40 sn (sakin 30, kaotik 50). Durum du.pk (oyuncuya alan eklenmez); evreler goster → itiraz → bosalt → hazir → duduk:
     - goster: hakem noktanın yanına koşar (gösterme yeri: nokta + (−d·3, hakemin yanı · 2,5)), noktaya bakar; faul yapan takımdan 3–6 kişi (kaos) ve kaptan
       0–1,2 sn gecikmeyle hakeme yürür (ortak kalabalık: kalabalikKur/kalabalikAdim, yuvalar PEN_YUVA, kaptan 1,1 m, öbürleri 1,6–2,4 m), hücumdan ≤ 3
       kişi sevinir (jest kol/alkış), biri yerdeki faul yiyene gider (A4-3'ün el uzatması), vurucu bekler ve topu alır (top ışınlanmaz).
     - itiraz: kalabalığın yönü donar (itirazEt'in seçtikleri katılır), hakem geri geri yürür (gerHiz), yüzü kaptanda; kaptan işareti (olay kaptanIsareti
       kaynak 'penalti'; ≥ 2 kişi 3,5 m içinde ya da 2,5 sn) — kaptan dışındakiler 0,5 sn sonra 4,2–5,2 m'ye çekilir; kaos > 0,6'da biri yeniden yaklaşır,
       ikinci işaret ve protokol sarısı (kartGoster neden 'itiraz'; S1d'nin sahnesi koşar); karsi varyantında hücumcu faul yapana itiraz eder; kaleci itiraza
       katılır ya da altıpasta gezinir; vurucu topu elinde tutar (tut). Kutudakiler bekleme noktasında, dışarıdakiler son yerine yürür.
     - bosalt: hakem 1,6 sn kutuyu boşaltma işareti (olay penaltiSahne evre 'bosalt'), son yerine yürür; oyuncular kişisel gecikmeyle (kaptan en son)
       1,2–2,2 m/sn yürüyerek çıkar; vurucu tY'de topu noktaya koyar (eski yerleştirme yolu; duzelt varyantında ikinci kez); kaleci çizgiye döner
       (kaleciOyun varyantında önce noktaya yürüyüp oyalar, hakem uyarır: olay 'uyari' neden 'kaleciOyun').
     - hazir: hakem son yerinde durur, önce kaleciye sonra vurucuya bakar; ön koşullar (planlı an, hakemin duruşu, dudukOnKosul, vurucu geri noktasında,
       kaleci çizgide — penaltiKaleciBakis) → düdük (dudukCal, bekleme bekle sn) → duduk; kullanım s1DudukKapisi'yle (duranHazirMi).
     Kararlar h2(P.s, i) — P.s = s1Tohum(sahneOzet(du, 21)): 1 kaos, 2 bekle, 3 tY, 4 kaleciItiraz, 5 kaleciOyun, 6 karsi, 7 duzelt, 8 protokol sarısı,
     9 hazirDur, 10 vurucunun kol jesti; 200 + i kalabalığın kuruluşu; oyuncu başına 100 + n + 11·takım + 1000·k (k: 0 kalabalık puanı, 1 kalabalığın
     gecikmesi, 2 boşaltmanın gecikmesi, 3 dışarıdakinin varışı, 4 sevincin anı, 5 sevincin türü, 7 kıpırtının fazı); kalecinin gezinmesi 600 + k;
     kaptan işaretinden sonraki jestler 10000 + …; kıpırtı h2(P.s + 131·(n + 11·takım), k). Ana zar dizisi kaymaz (itirazEt'in çekimi yerinde).
     Kancalar: js/mac-durantop.js sahneKur (penaltiSahneKur), durusYerlesim (penaltiSahneAdim, penaltiSahneRol), hakemDuranYeri (du.pk.hk); js/mac-kurallar.js
     durusBaslat (top ışınlanmaz), stepDurus (penaltiKullanan, penaltiDuzelt), hakemAI (DY.hiz, DY.bak). Ölçü araclar/olcumler/k-protokol.js s1b_
     (s1bIzleyici; araclar/senaryolar/d-sahne.js [2] de kullanır) */
  s1PenaltiAcik(){const A=MOTOR_AYAR;return(A.protokol&S1_BIT.PENALTI)!==0&&(A.sahne&1)!==0;},
  /* oyuncu başına h2 kararı (k: yukarıdaki liste) */
  penaltiOz(P,p,k){return h2(P.s,100+p.n+11*p.team+1000*k);},
  /* i. yuva (0 kaptan; fazlası ±0,55'lik adımlarla) */
  penaltiYuvaAci(i){return i<PEN_YUVA.length?PEN_YUVA[i]:(i%2?1:-1)*0.55*Math.ceil(i/2);},
  /* kalabalığın yönü c'den kümenin ortasına donar; yuvalar açı sırasıyla dağılır (kaptan 0'da, öbürleri yönün çevresindeki açılarına göre: yollar kesişmez) */
  penaltiYuva(K,c){let x=0,z=0,n=0;for(const e of K.uyeler)if(e.q.oyunda){x+=e.q.x;z+=e.q.z;n++;}
    if(n){const ux=x/n-c.x,uz=z/n-c.z,L=hyp(ux,uz);if(L>0.5){K.ux=ux/L;K.uz=uz/L;}}
    const ux=K.ux,uz=K.uz,D=[];for(const e of K.uyeler){if(e.q===K.kaptan){e.aci=0;continue;}const vx=e.q.x-c.x,vz=e.q.z-c.z;D.push({e,a:Math.atan2(ux*vz-uz*vx,ux*vx+uz*vz)});}
    D.sort((p,q)=>p.a-q.a||p.e.q.n-q.e.q.n);
    const Y=[];for(let i=1;Y.length<D.length;i++)Y.push(this.penaltiYuvaAci(i));Y.sort((p,q)=>p-q);
    D.forEach((d,i)=>{d.e.aci=Y[i];});},
  /* plan (sahneKur; rastlantısız): kaos, zamanlar (sahneT, Tpre planlı düdük, tI itirazın sonu, tB boşaltmanın sonu, tY topun konması, bekle), yerler (nokta,
     gösterme yeri gY, son yer sonYer — eski hakemDuranYeri —, vurucunun topu tuttuğu tut, faulün yeri fy), kalabalık (K) ve kaptan, roller (R: oyuncu →
     {rol, bek, varis, gB, jT, j, jk}; rol kalabalik | kaptan | kaleci | yardim | sevinc | karsi | yerles — görev dağıtımı yenilenince eksik oyuncu tembel
     'yerles'), varyantlar ve hakemin ilk hedefi (P.hk {x, z, hiz, bak}: hakemDuranYeri → hakemAI). Duruşa: s1Sure, dudukGerek 'penalti', sahneT, sahneKos,
     güvenlik ağları (zorlaGetir, zorlaHazir = max(28, sahneT + 12)) */
  penaltiSahneKur(du){
    const S=MOTOR_AYAR.penaltiSahne,s=this.s1Tohum(this.sahneOzet(du,21)),o=i=>h2(s,i),ar=(a,x)=>a[0]+(a[1]-a[0])*clamp(x,0,1);
    const t=du.takim,sv=1-t,d=this.dir[t],h=this.refs[0],tk=du.kullanan,b=this.ball,fy=du.faulYapan&&du.faulYapan.oyunda?du.faulYapan:null;
    const son=this.half===2&&this.gameSec>=4500&&Math.abs(this.score[0]-this.score[1])<=1;
    const kaos=clamp(S.kaosTaban+S.kaosH*o(1)+(du.kart==='kirmizi'?S.kaosKirmizi:0)+(son?S.kaosSon:0)+S.kaosItiraz*Math.max(0,fy?profilEgilim(fy,'hakemeItiraz'):0)
      -S.kaosSert*(2*hkDeger(this,'sertlik')-1),0,1);
    const sahneT=S.sure*ar(S.aralik,kaos),bekle=ar(S.bekle,0.45*o(2)+0.55*(tk?profilAlt(tk,'sogukkanlilik',tk.oz.karar):0.5));
    const Tpre=sahneT-S.kos-bekle,tI=Tpre*ar(S.itiraz,kaos),tB=S.bosalt*Tpre,tY=tI+(tB-tI)*(0.25+0.35*o(3));
    const sy=Math.sign(h.z-MZ)||1,sx=Math.sign(du.x)||1,nokta={x:du.x,z:du.z},gY={x:du.x-d*3,z:du.z+sy*2.5};
    const P={s,kaos,evre:'goster',et:0,sahneT,bekle,Tpre,tI,tB,tY,nokta,gY,sonYer:{x:d*(PL-17),z:MZ+(sx>0?-6:6)},tut:{x:du.x-d*1.6,z:du.z-sy*1.2},fy:{x:b.x,z:b.z},
      hk:{x:gY.x,z:gY.z,hiz:0.6,bak:nokta},K:null,kaptan:null,R:new Map(),izin:new Set(),km:{x:gY.x,z:gY.z},kaptanT:null,k2:false,kaptan2T:null,sariK:false,sari:false,
      ihlal:null,bosaltT:null,bx:null,hazirT:null,durT:null,hazirDur:ar(S.hazirDur,o(9)),dudukT:null,kaleciItiraz:false,kaleciOyun:null,karsi:null,
      duzelt:o(7)<S.duzelt,dz:false,yiyen:null,kolJ:false};
    const R=P.R,rol=(p,r,ek)=>{R.set(p,Object.assign({rol:r,bek:undefined,varis:null,gB:null,jT:null,j:false,jk:null},ek||null));};
    /* kalabalık: faul yapan takımın gösterme yerine 40 m içindeki saha oyuncuları — uzaklık, itiraz eğilimi, faul yapan, kaptan, sarı kartlı, h2 */
    const C=[];for(const q of this.sahadakiler(sv)){if(q.rol==='GK')continue;const L=hyp(q.x-gY.x,q.z-gY.z);if(L>40)continue;
      C.push({q,s:-L/10+0.8*profilEgilim(q,'hakemeItiraz')+(q===fy?1.5:0)+(q.kaptan?1:0)-(q.kart===1?0.5:0)+0.4*h2(s,100+q.n+11*q.team)});}
    C.sort((a,c)=>c.s-a.s||a.q.n-c.q.n);
    const Q=C.slice(0,Math.round(ar(S.kalabalik,kaos))).map(e=>e.q);
    let kp=this.sahadakiler(sv).find(q=>q.kaptan&&q.rol!=='GK'&&hyp(q.x-gY.x,q.z-gY.z)<=45)||null;
    if(kp&&!Q.includes(kp))Q.push(kp);
    if(!kp&&Q.length)kp=Q.reduce((a,c)=>c.oz.karar>a.oz.karar?c:a);
    if(Q.length){const L=[kp].concat(Q.filter(q=>q!==kp));
      const K=P.K=this.kalabalikKur(L,kp,{r0:S.halka,r1:S.kaptanR,rk:S.kaptanYakin,yuva:()=>0},i=>h2(s,200+i),-d,0);
      for(const e of K.uyeler){e.d0=e.q===fy?0:1.2*this.penaltiOz(P,e.q,1);if(e.q===kp)e.r0=S.kaptanYakin;rol(e.q,e.q===kp?'kaptan':'kalabalik');}
      this.penaltiYuva(K,gY);}
    P.kaptan=kp;
    /* kaleci ve varyantları */
    const kl=this.kaleci(sv);if(kl&&kl.oyunda){rol(kl,'kaleci');P.kaleciItiraz=o(4)<S.kaleciItiraz*(0.6+0.8*kaos);if(!P.kaleciItiraz&&o(5)<S.kaleciOyun)P.kaleciOyun={t0:null,uyari:false,bitti:false};}
    /* hücum: yerdeki faul yiyen (topa 5 m içinde kilitli eylemde), karşı itiraz (faul yapana en yakın), yardım (yiyene en yakın) ve sevinç (noktaya en yakın; ≤ 3) */
    const serbest=q=>q!==tk&&q.rol!=='GK'&&!(q.eylem&&q.eylem.kilit),HC=this.sahadakiler(t);
    let y=null,ey=5;for(const q of HC){if(q===tk||q.rol==='GK'||!(q.eylem&&q.eylem.kilit))continue;const L=hyp(q.x-b.x,q.z-b.z);if(L<ey){ey=L;y=q;}}P.yiyen=y;
    if(fy&&o(6)<S.karsi*(0.5+kaos)){let en=null,ed=25;for(const q of HC){if(!serbest(q))continue;const L=hyp(q.x-fy.x,q.z-fy.z);if(L<ed){ed=L;en=q;}}if(en){P.karsi=en;rol(en,'karsi');}}
    let n=0;
    if(y){let en=null,ed=15;for(const q of HC){if(!serbest(q)||R.has(q))continue;const L=hyp(q.x-y.x,q.z-y.z);if(L<ed){ed=L;en=q;}}if(en){rol(en,'yardim',{jT:0.3+1.2*this.penaltiOz(P,en,4)});n++;}}
    for(const q of HC.filter(q=>serbest(q)&&!R.has(q)&&hyp(q.x-nokta.x,q.z-nokta.z)<30).sort((a,c)=>hyp(a.x-nokta.x,a.z-nokta.z)-hyp(c.x-nokta.x,c.z-nokta.z)||a.n-c.n)){
      if(n>=3)break;rol(q,'sevinc',{jT:0.3+1.2*this.penaltiOz(P,q,4)});n++;}
    du.pk=P;du.s1Sure=true;du.dudukGerek='penalti';
    du.sahneT=sahneT;du.sahneKos=S.kos;du.zorlaGetir=S.zorlaGetir;du.zorlaHazir=Math.max(28,sahneT+12);
  },
  /* evrenin makinesi (durusYerlesim'in başı; hakemAI bu karenin P.hk'sini sonraki karede okur): geçişler ve olaylar ('penaltiSahne' {evre, du, x, z, hx?, hz?,
     n?, bek?, kaos}, 'kaptanIsareti' kaynak 'penalti', 'uyari' neden 'kaleciOyun' rolde), hakemin hedefi, kalabalık ve jestleri. Kart gösterilirken (hakemAI'nın
     kart dalı; S1d) evre geçişi ve işaret bekler */
  penaltiSahneAdim(du,dt){
    const P=du.pk,S=MOTOR_AYAR.penaltiSahne,h=this.refs[0],K=P.K,kart=!!h.kartSira,tk=du.kullanan,b=this.ball,d=this.dir[du.takim],H=P.hk;
    P.et+=dt;
    if(du.dudukT!=null&&P.evre!=='duduk'){P.dudukT=du.dudukT;P.evre='duduk';P.et=0;this.on('penaltiSahne',{evre:'duduk',du,x:h.x,z:h.z,bek:du.dudukBek,kaos:P.kaos});}   /* güvenlik ağının düdüğü */
    switch(P.evre){
    case 'goster':{   /* hakem gösterme yerine (6 m'den uzakta ~4,3 m/sn, içinde ~2,2), yüzü noktada; geçiş: en az goster[0] sn ve varış, ya da goster[1] sn ve yavaş (≤ 2,5 m/sn;
         itirazda hakem koşmaz), kart dalı; tavan goster[1] + 7 sn */
      const L=hyp(h.x-P.gY.x,h.z-P.gY.z);H.x=P.gY.x;H.z=P.gY.z;H.hiz=L>6?0.6:0.3;H.bak=P.nokta;
      if(kart||du.t>=S.goster[0]&&L<1.5||du.t>=S.goster[1]&&(h.spd||0)<2.5||du.t>=S.goster[1]+7)this.penaltiItirazBasla(du,h);
      break;}
    case 'itiraz':{   /* hakem gösterme yerinden kümenin tersine 2,5 m geri geri (uzaktaysa ~2,2 m/sn), yüzü kaptanda; kaptan işaretini yerine yakınken (4 m)
         verir ve işaret boyunca (2,6 sn) durur */
      const ux=K?K.ux:-d,uz=K?K.uz:0,tx=P.gY.x-ux*2.5,tz=P.gY.z-uz*2.5,L=hyp(h.x-tx,h.z-tz);
      if(P.kaptanT!=null&&du.t<P.kaptanT+2.6){H.x=h.x;H.z=h.z;H.hiz=0;}else{H.x=tx;H.z=tz;H.hiz=L>4?0.3:S.gerHiz;}H.bak=P.kaptan&&P.kaptan.oyunda?P.kaptan:P.km;
      if(K&&!kart){
        if(P.kaptanT==null){let n=0;for(const e of K.uyeler)if(e.q.oyunda&&hyp(e.q.x-h.x,e.q.z-h.z)<3.5)n++;
          if((n>=2||P.et>=2.5)&&(L<4||P.et>=8)){P.kaptanT=du.t;K.protoT=K.t;this.on('kaptanIsareti',{kaynak:'penalti',ikinci:false,hx:P.km.x,hz:P.km.z});
            /* kaos > 0,6: itiraz eğilimi en yüksek kaptan dışı üye sonra yeniden yaklaşır (ikinci işaret ve protokol sarısının adayı) */
            if(P.kaos>0.6){let eg=-1e9;for(const e of K.uyeler){if(e.q===K.kaptan||!e.q.oyunda)continue;const g=profilEgilim(e.q,'hakemeItiraz');if(g>eg){eg=g;P.ihlal=e;}}}}}
        else{
          if(P.kaos>0.6&&!P.k2&&du.t>=P.kaptanT+4.5){P.k2=true;P.kaptan2T=du.t;this.on('kaptanIsareti',{kaynak:'penalti',ikinci:true,hx:P.km.x,hz:P.km.z});}
          if(!P.sariK&&du.t>=P.kaptanT+3.8){P.sariK=true;this.penaltiSari(du,P,h);}}}
      if(!kart&&((P.kaptanT!=null&&du.t>=P.kaptanT+2.4||!K)&&du.t>=P.tI&&L<4||du.t>=P.tI+8))this.penaltiBosaltBasla(du,h);   /* hakem yerine dönmüş olmalı (kartta uzaklaşır) */
      break;}
    case 'bosalt':{   /* 1,6 sn boşaltma işareti yerinde, sonra son yerine (~2,2 m/sn), yüzü topta; geçiş: hakem yerinde, top konmuş, görevliler yerinde (en geç tB + 8) */
      const L=hyp(h.x-P.sonYer.x,h.z-P.sonYer.z);
      if(P.et<1.6){H.x=h.x;H.z=h.z;H.hiz=0;H.bak=P.bx;}else{H.x=P.sonYer.x;H.z=P.sonYer.z;H.hiz=L>0.5?0.3:0;H.bak=b;}
      if(P.et>=1.6&&!kart&&(L<1.2&&du.asama==='hazir'&&this.gorevlilerYerinde(du)||du.t>=P.tB+8)){P.hazirT=du.t;P.durT=null;P.evre='hazir';P.et=0;
        this.on('penaltiSahne',{evre:'hazir',du,x:h.x,z:h.z,hx:d*PL,hz:MZ,kaos:P.kaos});}
      break;}
    case 'hazir':{   /* son yerinde durur, önce kaleciye (0,8 sn) sonra vurucuya bakar; ön koşullar ve düdük (güvenlik: zorlaHazir − 3) */
      const L=hyp(h.x-P.sonYer.x,h.z-P.sonYer.z),kl=this.kaleci(1-du.takim);
      H.x=P.sonYer.x;H.z=P.sonYer.z;H.hiz=L>0.4?0.25:0;H.bak=P.et<0.8&&kl&&kl.oyunda?kl:tk&&tk.oyunda?tk:b;
      if(P.durT==null&&(h.spd||0)<0.3)P.durT=du.t;
      const vur=!!tk&&du.asama==='hazir'&&du.hazirT>=MOTOR_AYAR.duranHazir[4]&&hyp(tk.x-du.geriX,tk.z-du.geriZ)<0.5;
      const kal=!kl||!kl.oyunda||this.penaltiKaleciBakis(kl)!=null;
      const hazir=du.t>=P.Tpre&&P.durT!=null&&du.t>=P.durT+P.hazirDur&&vur&&kal&&(!du.kr||du.kr.hazir);
      if(this.dudukOnKosul(du)&&(hazir||du.t>=du.zorlaHazir-3)){this.dudukCal(du,P.bekle);P.dudukT=du.t;P.evre='duduk';P.et=0;
        this.on('penaltiSahne',{evre:'duduk',du,x:h.x,z:h.z,bek:P.bekle,kaos:P.kaos});}
      break;}
    case 'duduk':H.x=h.x;H.z=h.z;H.hiz=0;H.bak=tk&&tk.oyunda?tk:b;break;}
    /* kalabalık (gösterme ve itiraz): gecikmesi dolan, meşgul olmayan üyeler hakemle yürür (kalabalikAdim); kaptan itirazla faulün yerini gösterme arasında,
       işaretten sonra öbürleri başı ellerinde / itiraz / suskun */
    if(K&&(P.evre==='goster'||P.evre==='itiraz')){
      const A=P.izin;A.clear();
      for(const e of K.uyeler){const q=e.q;if(q.oyunda&&du.t>=e.d0&&q!==tk&&!this.kartMesgul(q,du))A.add(q);}
      const I=P.ihlal;if(I&&P.kaptanT!=null){if(I.r1s==null)I.r1s=I.r1;I.r1=du.t>=P.kaptanT+2.6&&du.t<P.kaptanT+5.2?I.r0+0.3:I.r1s;}
      const ke=K.uyeler.find(e=>e.q===K.kaptan),jk0=ke?ke.jk:null;
      this.kalabalikAdim(K,h,dt,q=>A.has(q));
      /* "yaklaşmayın"dan sonra kaptan dışındakiler 4 m bölgesinden çabuk çıkar: hedefe 1,2 m'den uzakken arkasını dönüp yürür (yüzü hakemdeyken geri adım
         ~1,6 m/sn'de kalıyordu), en az 2,2 m/sn (efor 0,8: yürüme kipine düşmez) */
      if(K.protoT!=null)for(const e of K.uyeler){const q=e.q;if(!e.gec||!A.has(q))continue;const L=hyp(q.x-q.tx,q.z-q.tz);if(L<0.6)continue;q.hizOran=Math.max(q.hizOran,2.2/q.maxSpd);this.eforVer(q,0.8);if(L>1.2)q.bak=null;}
      if(ke&&ke.jk!==jk0&&(ke.jk&1)&&A.has(K.kaptan))this.jestVer(K.kaptan,'isaret',1.3,P.fy,true);
      if(K.protoT!=null)for(const e of K.uyeler){if(!e.gec||!A.has(e.q))continue;const k=Math.floor((K.t+e.jT)/1.6);if(k===e.jk2)continue;e.jk2=k;
        const r=h2(P.s,10000+(e.q.n+11*e.q.team)*211+k%200);if(r<0.35)this.jestVer(e.q,'basEl',1.4,null,true);else if(r<0.6)this.jestVer(e.q,'itiraz',1.2,{x:h.x,z:h.z},true);}
      let x=0,z=0,n=0;for(const e of K.uyeler)if(A.has(e.q)){x+=e.q.x;z+=e.q.z;n++;}if(n){P.km.x=x/n;P.km.z=z/n;}}
  },
  /* itirazın başı: itirazEt'in seçtikleri (eylem 'itiraz', faul yapan takım) kalabalığa katılır, yön hakemden kümeye donar, yuvalar yeniden dağılır */
  penaltiItirazBasla(du,h){const P=du.pk,K=P.K,S=MOTOR_AYAR.penaltiSahne;
    if(K){for(const q of this.sahadakiler(1-du.takim)){if(q.rol==='GK'||!(q.eylem&&q.eylem.ad==='itiraz')||K.uyeler.some(e=>e.q===q))continue;
        K.uyeler.push({q,aci:0,r0:S.halka[0]+(S.halka[1]-S.halka[0])*h2(P.s,260+q.n),r1:S.kaptanR[0]+(S.kaptanR[1]-S.kaptanR[0])*h2(P.s,270+q.n),gec:false,jT:1.8*h2(P.s,280+q.n),jk:-1,d0:0});
        P.R.set(q,{rol:'kalabalik',bek:undefined,varis:null,gB:null,jT:null,j:false,jk:null});}
      this.penaltiYuva(K,h);}
    P.evre='itiraz';P.et=0;this.on('penaltiSahne',{evre:'itiraz',du,x:h.x,z:h.z,n:K?K.uyeler.length:0,kaos:P.kaos});},
  /* protokol sarısı (kaptan işaretinden 3,8 sn sonra, bir kez): hakemin 4 m içindeki kaptan dışı üyelerden itiraz eğilimi en yüksek olana; olasılık itirazKart ×
     (1 + 1,5·eğilim) × (0,5 + sertlik) × (1 + kaos) × protokolSari (sarı kartlıya yarısı) */
  penaltiSari(du,P,h){const S=MOTOR_AYAR.penaltiSahne,K=P.K;if(!(S.protokolSari>0)||!K)return;
    let en=null,eg=-1e9;for(const e of K.uyeler){const q=e.q;if(q===K.kaptan||!q.oyunda||(q.kart||0)>=2||hyp(q.x-h.x,q.z-h.z)>=4)continue;const g=profilEgilim(q,'hakemeItiraz');if(g>eg){eg=g;en=q;}}
    if(!en)return;
    const pr=MOTOR_AYAR.itirazKart*(1+1.5*Math.max(0,eg))*(0.5+hkDeger(this,'sertlik'))*(1+P.kaos)*S.protokolSari*(en.kart===1?0.5:1);
    if(h2(P.s,8)<pr){P.sari=true;this.kartGoster(en,'sari','itiraz');}},
  /* boşaltmanın başı: kişisel gecikmeler (bosaltT + h2 · 0,5 · (tB − bosaltT); kaptan + 2 sn), işaretin hedefi (ceza sahası çizgisinin 1,5 m dışı, hakemin hizası) */
  penaltiBosaltBasla(du,h){const P=du.pk,d=this.dir[du.takim];P.bosaltT=du.t;const sure=Math.max(0,P.tB-du.t);
    for(const [p,r] of P.R)r.gB=du.t+(r.rol==='kaptan'?2:0)+this.penaltiOz(P,p,2)*0.5*sure;
    P.bx={x:d*(PL-CEZA_U-1.5),z:clamp(h.z,MZ-CEZA_W+2,MZ+CEZA_W-2)};
    P.evre='bosalt';P.et=0;this.on('penaltiSahne',{evre:'bosalt',du,x:h.x,z:h.z,hx:P.bx.x,hz:P.bx.z,kaos:P.kaos});},
  /* görev döngüsünün kancası (durusYerlesim; penaltıda her görevli için true): rolün ve evrenin hedefi. Kilitli eylemdeki (yerde, kalkışta) oyuncuya
     dokunulmaz. Kıpırtı: son yerine varan oyuncu 2,8 sn'de bir kaleden uzağa ve dışa doğru 0,8 × 0,6 m içinde yer değiştirir (hareketsiz bekleyiş yok;
     ceza sahası ve yay boş kalır) — düdükten sonra durur. Boşaltmada kişisel gecikme dolana dek ağır ağır (0,7 m/sn) yürür */
  penaltiSahneRol(du,p,g){
    const P=du.pk,S=MOTOR_AYAR.penaltiSahne,e=P.evre,b=this.ball,h=this.refs[0],d=this.dir[du.takim];
    let r=P.R.get(p);if(!r){r={rol:g.rol==='kaleci'?'kaleci':'yerles',bek:undefined,varis:null,gB:P.bosaltT,jT:null,j:false,jk:null};P.R.set(p,r);}
    if(p.eylem&&p.eylem.kilit)return true;
    const once=e==='goster'||e==='itiraz';
    if((r.rol==='kalabalik'||r.rol==='kaptan')&&once&&P.izin.has(p))return true;   /* kalabalikAdim yazdı */
    this.gorevYaz(p,'duran');
    const git=(x,z,v,ef,bak)=>{p.tx=clamp(x,-PL+0.3,PL-0.3);p.tz=clamp(z,0.3,PW-0.3);p.hizOran=Math.min(1,v/p.maxSpd);p.bak=bak===undefined?b:bak;p.yonHedef=null;this.eforVer(p,ef);};
    if(r.rol==='kaleci'){this.penaltiKaleciRol(du,p,g,r,git);return true;}
    if(once){
      if(r.rol==='kalabalik'||r.rol==='kaptan'){git(p.x,p.z,0.6,0.3,h);return true;}   /* gecikme dolmadı ya da topu durduruyor */
      if(r.rol==='yardim'){const y=P.yiyen;if(y&&y.oyunda&&y.eylem&&y.eylem.kilit&&du.t<10){const L=hyp(p.x-y.x,p.z-y.z)||1;git(y.x+(p.x-y.x)/L*1.2,y.z+(p.z-y.z)/L*1.2,L>3?3.0:1.0,0.6,y);
        if(!r.j&&du.t>=r.jT){r.j=true;this.jestVer(p,'kol',1.2,null,true);}return true;}}
      if(r.rol==='karsi'){const f=du.faulYapan;if(f&&f.oyunda&&!(P.kaptanT!=null&&du.t>=P.kaptanT+2)){const L=hyp(p.x-f.x,p.z-f.z)||1;
        git(f.x+(p.x-f.x)/L*1.5,f.z+(p.z-f.z)/L*1.5,L>3?2.5:1.0,0.6,f);
        const k=Math.floor(du.t/1.6);if(k!==r.jk){r.jk=k;this.jestVer(p,k&1?'itiraz':'isaret',1.3,k&1?{x:f.x,z:f.z}:P.nokta,true);}return true;}}
      if(r.rol==='sevinc'&&!r.j&&du.t>=r.jT){r.j=true;const v=this.penaltiOz(P,p,5);this.jestVer(p,v<0.5?'kol':'alkis',1.2+0.4*v,null,true);}
      /* kutudakiler (ceza sahası ya da yay) bekleme noktasında: 0,3 sn'deki yer, noktadan ≥ 2,5 m, gösterme yerinden ≥ 5 m (kaptan protokolünün 4 m bölgesi dışı) */
      if(r.bek===undefined&&du.t>=0.3){const gx=d*PL,ic=Math.abs(p.x-gx)<CEZA_U&&Math.abs(p.z-MZ)<CEZA_W||hyp(p.x-P.nokta.x,p.z-P.nokta.z)<9.15;
        if(!ic)r.bek=null;else{let x=p.x,z=p.z;const it=(c,R)=>{const L=hyp(x-c.x,z-c.z);if(L<R){const u=L>0.05?1/L:0;x=c.x+(L>0.05?(x-c.x)*u:-d)*R;z=c.z+(L>0.05?(z-c.z)*u:0)*R;}};
          it(P.nokta,2.5);it(P.gY,5);r.bek={x,z};}}
      if(r.bek){const L=hyp(p.x-r.bek.x,p.z-r.bek.z);git(r.bek.x,r.bek.z,L>1?1.5:0.8,0.4);return true;}
      if(r.varis==null)r.varis=P.tI+(P.tB-P.tI)*this.penaltiOz(P,p,3);
      const L=hyp(p.x-g.hx,p.z-g.hz);
      if(L>0.6&&!r.var){git(g.hx,g.hz,clamp(L/Math.max(0.5,r.varis-du.t),S.uzakHiz[0],S.uzakHiz[1]),0.6);return true;}
      r.var=true;}
    else{
      if(e==='bosalt'&&r.gB!=null&&du.t<r.gB&&!r.var){git(g.hx,g.hz,0.7,0.3,r.rol==='kalabalik'||r.rol==='kaptan'?h:b);return true;}   /* kişisel gecikme: ağır ağır (0,7 m/sn) */
      const L=hyp(p.x-g.hx,p.z-g.hz);
      if(L>0.6&&!r.var){git(g.hx,g.hz,clamp(L/Math.max(0.5,P.tB-du.t),S.yuruHiz[0],S.yuruHiz[1]),0.45);return true;}
      r.var=true;}
    if(e==='duduk'){git(g.hx,g.hz,0.8,0.3);return true;}
    const k=Math.floor(du.t/2.8+this.penaltiOz(P,p,7)),z0=P.s+131*(p.n+11*p.team),sg=Math.sign(g.hz-MZ)||1;
    git(g.hx-d*0.8*h2(z0,2*k),g.hz+sg*0.6*h2(z0,2*k+1),0.9,0.3);
    return true;},
  /* kaleci: itirazda kalabalığa katılır (hakemden 2,6 m, işaretten sonra 4,5) ya da altıpasta gezinir (5 sn'de bir; kale çizgisinden 2,5 m, ortadan ≤ 2,5 m);
     boşaltmadan sonra çizgiye döner — kaleciOyun varyantında önce noktanın 2,2 m önüne yürür, 2,5 sn oyalar, hakem uyarır */
  penaltiKaleciRol(du,p,g,r,git){
    const P=du.pk,e=P.evre,h=this.refs[0],d=this.dir[du.takim],tk=du.kullanan,b=this.ball;
    if(e==='goster'||e==='itiraz'){
      if(P.kaleciItiraz){const L=hyp(p.x-h.x,p.z-h.z)||1,R=P.kaptanT!=null&&du.t>P.kaptanT+1.2?4.5:2.6,x=h.x+(p.x-h.x)/L*R,z=h.z+(p.z-h.z)/L*R,dd=hyp(p.x-x,p.z-z);
        git(x,z,dd>8?4.5:dd>3?2.6:1.4,dd>3?0.6:0.3,h);this.gorevYaz(p,'kalabalik');
        const k=Math.floor(du.t/1.9);if(k!==r.jk){r.jk=k;if(L<4.5&&R<3)this.jestVer(p,'itiraz',1.2,{x:h.x,z:h.z},true);}return;}
      const k=Math.floor(du.t/5),sg=h2(P.s,600+k)<0.5?1:-1;git(d*(PL-2.5),MZ+sg*2.5*h2(P.s,650+k),1.4,0.3,tk&&tk.oyunda?tk:b);return;}
    const O=P.kaleciOyun;
    if(O&&!O.bitti&&e==='bosalt'&&du.t>=P.tY+1){const x=P.nokta.x+d*2.2,z=P.nokta.z,L=hyp(p.x-x,p.z-z);
      if(O.t0==null){if(L<0.6)O.t0=du.t;git(x,z,1.8,0.4,tk&&tk.oyunda?tk:b);return;}
      git(x,z,0.6,0.3,tk&&tk.oyunda?tk:b);if(du.t>=O.t0+2.5){O.bitti=true;if(!O.uyari){O.uyari=true;this.on('uyari',{p,neden:'kaleciOyun'});}}return;}
    const L=hyp(p.x-g.hx,p.z-g.hz);git(g.hx,g.hz,L>6?3.2:L>1?(O&&O.bitti?2.5:2.2):0.8,0.4,tk&&tk.oyunda?tk:b);},
  /* vurucu (stepDurus 'bekle', 'getir', 'yerles'; true: eski yol atlanır): bekle — yerinde (%50 kol jesti), du.bekle'den sonra getir; getir — topa koşar adım
     (≤ 3,2 m/sn), 1 m'de alır (top topçudaysa ya da saha dışındaysa eski yol); yerles — tY'ye dek topu tut noktasında tutar, yüzü kalecide (sonra eski
     yerleştirme yolu: noktaya yürür, koyar, geri çekilir) */
  penaltiKullanan(du,tk,nk){
    const P=du.pk,b=this.ball;
    if(du.asama==='bekle'){if(!(tk.eylem&&tk.eylem.kilit)){tk.tx=tk.x;tk.tz=tk.z;tk.hizOran=0.3;tk.bak=P.nokta;tk.yonHedef=null;}
      if(!P.kolJ&&du.t>0.4){P.kolJ=true;if(h2(P.s,10)<0.5)this.jestVer(tk,'kol',1.2,null);}
      if(du.t>(du.bekle||0.45))du.asama='getir';return true;}
    if(du.asama==='getir'){
      if(b.tasiyan)return false;
      if(Math.abs(b.x)>PL||b.z<0||b.z>PW)return false;
      if(tk.eylem&&tk.eylem.kilit)return true;
      const k=this.yakalamaNoktasi(tk,2.2);tk.tx=clamp(k.x,-PL-1.6,PL+1.6);tk.tz=clamp(k.z,-1.6,PW+1.6);tk.hizOran=Math.min(0.8,3.2/tk.maxSpd);tk.bak=b;tk.yonHedef=null;
      if(hyp(b.x-tk.x,b.z-tk.z)<1.0&&b.y<2.3){b.tasiyan=tk;b.vx=b.vy=b.vz=0;this.topDegisti();du.asama='yerles';}
      return true;}
    if(du.asama==='yerles'){
      if(b.tasiyan!==tk||du.t>=P.tY)return false;
      const kl=this.kaleci(1-du.takim);tk.tx=P.tut.x;tk.tz=P.tut.z;tk.hizOran=Math.min(0.3,2.4/tk.maxSpd);tk.bak=kl&&kl.oyunda?kl:null;tk.yonHedef=null;
      return true;}
    return false;},
  /* duzelt varyantı (stepDurus 'hazir', geri hedefinden sonra): hazırlıktan 1 sn sonra vurucu topa döner, ikinci kez yerleştirir (düdükten önce, bir kez) */
  penaltiDuzelt(du,tk){const P=du.pk;if(!P.duzelt||P.dz||du.kr||P.evre==='duduk'||du.hazirT<1)return;
    const a=du.aci,x=du.x-Math.cos(a)*0.45,z=du.z-Math.sin(a)*0.45;
    tk.tx=x;tk.tz=z;tk.hizOran=0.3;tk.yonHedef=a;tk.bak=null;this.eforVer(tk,0.8);
    if(hyp(tk.x-x,tk.z-z)<0.4){P.dz=true;tk.eylem={ad:'yerlestir',t:0,sure:0.6};du.yerT=du.t;}},

  /* ============ S1c (2026-10-21): gol sonrası akış ve bakış odağı (protokol bit 8; bit 16 odak) ============
     'goal' evresi sahnenin tamamını taşır: kutla (sevinç, sevincT) → donus (dönüş) → düdük (Law 8 ve hakemin hazırlığı; golDuduk) → 'kickoff'
     (stepKick düdükten 1,6 sn sonra vurur, ikinci düdük yok). Plan gol anında bir kez kurulur (golSahneKur; h2 özeti golOzet, ana zar dizisi
     kaymaz). Sahnenin durumu this.celeb'de (oyuncu nesnesine alan yok):
     - c.s1, c.kt (santrayı yapan, gol yiyen takım), c.evre ('kutla' | 'donus'), c.sevincT, c.dudukT (planlanan düdük; phaseT, gerçek sn).
     - c.sc sevincin merkezi (golcü; kendi kalesine golde atan takımın topa en yakın saha oyuncusu), c.tur koşu türü ('kose' | 'tribun' | 'pasci' |
       'kulube' | 'yerinde' | 'atan'), c.kosuYer, c.asist (pasör ya da null), c.es (eşli sevinçte golcünün eşi), c.katil (kümeye koşanlar), c.cift
       (uzaktakilerin ikili sarılma eşleri), c.uzgunT (yenen takımın üzgün bekleyişi).
     - c.top {tur 'tasi' (T10d: gerideki takım ağdan alıp koşar) | 'atan' | 'el' | 'ayak', p, evre 'git' | 'cik' | 'gonder' | 'yol' | 'tasi' | 'nokta',
       t, hedef, alici, son, zincir, bos}: yenen takımın topa en yakını (kaleci ya da 14 m içindeki savunmacı) ağdan alır, kaleci 4,5 m dışarı taşır,
       elle yuvarlar ya da ayakla gönderir — hedef yolun üstündeki bir arkadaş ya da doğrudan santra noktası (yerIlkHiz ile). Kaleci uzağa atmaz;
       yoldaki oyuncu durdurup yeniden gönderir, noktaya 12 m içinde (ya da 4 göndermeden sonra) elde taşınır ve yerleştirilir. Santracı yalnız
       noktadaki topa gider.
     - c.hk {evre 'isaret' | 'yuru' | 'bekle', yer, bekT}: hakem 2,4 sn santrayı gösterir, deftere yazar ('not' eylemi), santra yerine yürür
       (≤ 3 m/sn), orada bekler. Yan hakem 1,5 sn hakeme bakar, sonra savunmanın hizasına (top terimi yok).
     - c.odak {x, y, z} (bit 16; yalnız js/kamera.js okur, sonucu değiştirmez): sevinçte golcü ve küme, dönüşte takım, düdüğe yakın nokta.
     Olaylar: 'goal' + {sevincT, tur, asist}; 'golTopAl' {p, tur, takim}; 'golTopGonder' {p, q, tur, L}; 'golTopNokta' {p}; 'duduk' {tur 'santra',
     seremoni}; 'kickoff' + {dudukOnce}. */
  golOzet(c,t){return h2(c.oz,c.oz2+t*7+11);},
  golSahneKur(c){
    const A=MOTOR_AYAR,T=A.golTempo,b=this.ball,att=c.team,kt=1-att,B=A.tempoBaglam;
    c.s1=true;c.kt=kt;c.evre='kutla';c.odak=null;c.yon=new Set();
    c.oz=((this.tohum|0)*157+(c.scorer?c.scorer.n|0:0)*29+(this.score[0]+this.score[1])*31+att*5)|0;c.oz2=(this.score[0]*7+this.score[1]*13+this.half*3)*1013;
    const D=this.macDurumu(kt),DA=this.macDurumu(att);
    let sc=c.own?null:c.scorer;
    if(!sc||!sc.oyunda||sc.team!==att){sc=null;let ed=1e9;for(const q of this.teams[att])if(q.oyunda&&!q.sakat&&q.rol!=='GK'){const d=hyp(q.x-b.x,q.z-b.z);if(d<ed){ed=d;sc=q;}}}
    c.sc=sc;
    const as=this._asist;c.asist=!c.own&&sc&&as&&as.q===c.scorer&&as.p!==sc&&as.p.oyunda&&this.t-as.t<=15?as.p:null;
    /* T10d alanı (eski formül): gol yiyen takım hâlâ gerideyse (ikinci yarıda ya da acelede) topa en yakın saha oyuncusu ağdan alıp koşar */
    c.alan=null;
    if(this.score[kt]<this.score[att]&&(this.half===2||D.acele>0)){let en=1e9;for(const q of this.teams[kt])if(q.oyunda&&q.rol!=='GK'&&!q.sakat){const d=hyp(q.x-b.x,q.z-b.z);if(d<en){en=d;c.alan=q;}}}
    const atan=!c.alan&&!!sc&&(DA.acele>0.3||this.half===2&&DA.kalanDk<=10&&DA.fark===0);
    /* bağlam: atan takımın acelesinde ve T10d'de (gerideki takım topu kapıp koşar) acele çarpanı; değilse gol yiyenin koru/acele'si (Z2a deseni) */
    let k=1;if(atan||c.alan)k=B?B[1]:0.75;else if(B){k*=1+(B[0]-1)*D.koru;k*=1-(1-B[1])*D.acele;}
    let sv=lerp(T.sevinc[0],T.sevinc[1],this.golOzet(c,1));
    if(this.half===2&&DA.kalanDk<=6&&Math.abs(DA.fark)<=1)sv*=T.kritik;
    if(atan)sv*=T.atan;else if(c.own)sv*=0.7;
    c.sevincT=sv;c.tur=atan?'atan':this.golTurSec(c,sc);c.kosuYer=this.golKosuYer(c,sc);
    /* dönüşün üst hızı: gerideki takım beklerken (T10d ya da atan takımın acelesi) hakem dönüşü hızlandırır — tırıs (5 m/sn), değilse donus[1] */
    c.donusUst=atan||c.alan?Math.max(T.donus[1],5):T.donus[1];
    const K=sc?this.santraKonumu(sc,kt):GOL_NOKTA,Ld=hyp(K.x-c.kosuYer.x,K.z-c.kosuYer.z);
    c.dudukT=Math.max(T.toplam*k*(1+(A.tempoSapma||0)*(2*this.golOzet(c,0)-1))-1.6,sv+Ld/c.donusUst+2);
    /* küme, eş ve uzaktakilerin ikilileri */
    c.es=null;c.katil=new Set();c.cift=new Map();c.uzgunT=new Map();
    if(sc){const uzak=[];
      for(const q of this.teams[att]){if(!q.oyunda||q.sakat||q===sc||q.rol==='GK')continue;if(hyp(q.x-sc.x,q.z-sc.z)<=T.kumeR)c.katil.add(q);else uzak.push(q);}
      if(!atan&&this.golOzet(c,3)<0.19){let ed=1e9;for(const q of c.katil){const d=hyp(q.x-sc.x,q.z-sc.z);if(d<ed){ed=d;c.es=q;}}}
      while(uzak.length>=2){const a=uzak.shift();let j=-1,ed=25;for(let i=0;i<uzak.length;i++){const d=hyp(uzak[i].x-a.x,uzak[i].z-a.z);if(d<ed){ed=d;j=i;}}
        if(j>=0){const e=uzak.splice(j,1)[0];c.cift.set(a,e);c.cift.set(e,a);}}}
    for(const q of this.teams[kt])if(q.oyunda)c.uzgunT.set(q,lerp(T.uzgun[0],T.uzgun[1],this.golOzet(c,20+(q.n|0))));
    /* top: kimin alacağı */
    const gk=this.kaleci(kt),top={tur:null,p:null,evre:'git',t:0,bekle:0,hedef:null,alici:null,son:null,zincir:0,bos:0,nokta:false};
    if(c.alan){top.tur='tasi';top.p=c.alan;top.bekle=0.6;}
    else if(atan){top.tur='atan';top.p=sc;}
    else{let en=null,et=1e9,bek=0;
      if(gk&&gk.oyunda&&!gk.sakat){const g=lerp(T.kaleciAl[0],T.kaleciAl[1],this.golOzet(c,5));et=hyp(gk.x-b.x,gk.z-b.z)/2.2+g;en=gk;bek=g;}
      for(const q of this.teams[kt]){if(!q.oyunda||q.sakat||q.rol==='GK')continue;const d=hyp(q.x-b.x,q.z-b.z);if(d>14)continue;const u=c.uzgunT.get(q)||0,tq=d/2.2+u;if(tq<et){et=tq;en=q;bek=u;}}
      if(!en){let ed=1e9;for(const q of this.teams[kt])if(q.oyunda&&!q.sakat&&q.rol!=='GK'){const d=hyp(q.x-b.x,q.z-b.z);if(d<ed){ed=d;en=q;}}}
      top.p=en;top.bekle=bek;top.tur=en&&en.rol==='GK'?'el':this.golOzet(c,4)<0.75?'ayak':'el';}
    c.top=top;
    c.hk={evre:'isaret',yer:{x:-6*this.dir[kt],z:MZ-8},bekT:0};c.yh0=[Math.abs(this.refs[1].x),Math.abs(this.refs[2].x)];
  },
  /* golcünün koşu türü (L.3): taban ağırlıklar golTempo.tur, profilden (agresiflik köşe ve tribün, soğukkanlılık yerinde), pasçıya koşu yalnız asistte */
  golTurSec(c,sc){const W=MOTOR_AYAR.golTempo.tur||{},al=sc&&sc.profil&&sc.profil.alt,f=k=>al&&al[k]!=null?al[k]:0.5;
    const w=[['kose',(W.kose||0)*(0.7+0.6*f('agresiflik'))],['tribun',(W.tribun||0)*(0.7+0.6*f('agresiflik'))],['yerinde',(W.yerinde||0)*(0.7+0.6*f('sogukkanlilik'))],
      ['pasci',c.asist?(W.pasci||0):0],['kulube',W.kulube||0]];
    let top=0;for(const x of w)top+=x[1];if(!(top>0)||!sc)return'yerinde';
    let u=this.golOzet(c,2)*top;for(const x of w){u-=x[1];if(u<0)return x[0];}return'yerinde';},
  golKosuYer(c,sc){const s=c.side;if(!sc)return{x:s*(PL-3),z:MZ};const t=c.tur;
    if(t==='kose')return{x:s*(PL-3),z:sc.z<MZ?3:PW-3};
    if(t==='tribun'){const y=c.team===0?this.taraftarYeri:this.deplasmanYeri;if(!y)return{x:s*(PL-3),z:sc.z<MZ?3:PW-3};
      let x=clamp(y.x,-PL+2,PL-2),z=clamp(y.z,1.5,PW-1.5);const d=hyp(x-sc.x,z-sc.z);if(d>30){x=sc.x+(x-sc.x)*30/d;z=sc.z+(z-sc.z)*30/d;}return{x,z};}
    if(t==='pasci'&&c.asist)return{x:c.asist.x,z:c.asist.z};
    if(t==='kulube'){const k=this.kulubeler[c.team].alan;return{x:clamp(k.x,-PL+2,PL-2),z:k.z<MZ?1.2:PW-1.2};}
    if(t==='atan')return{x:sc.x,z:sc.z};
    const gx=s*PL,dx=sc.x-gx,dz=sc.z-MZ,d=hyp(dx,dz)||1;return{x:clamp(sc.x+dx/d*3,-PL,PL),z:clamp(sc.z+dz/d*3,0.5,PW-0.5)};},
  /* dönüş: kendi yarısındaki santra yerine, düdüğe kalan süreyi yürüyerek dolduran hızla (geç kalınca tırıs; donus sınırları), en az hz oranı */
  golDonusHedef(p,kt,kalan,hz){const k=this.santraKonumu(p,kt),L=hyp(k.x-p.x,k.z-p.z),D=MOTOR_AYAR.golTempo.donus,c=this.celeb,rk=p.team!==kt;p.tx=k.x;p.tz=k.z;
    /* varış: rakip yarıda kalan (noktayı geçen) ve santrayı yapmayan takımda orta yuvarlağın içinde kalan durmaz */
    if(L<0.4||L<1&&p.x*this.dir[p.team]<=0&&(!rk||hyp(p.x,p.z-MZ)>=9.3)){p.hizOran=0;p.bak=GOL_NOKTA;return;}
    /* santrayı yapmayan takım orta yuvarlağın içinden geçmez: yolu yuvarlağı kesiyorsa 10,3 m'lik çemberi izler (her karede en çok 0,8 rad ileri) */
    if(rk&&segD(0,MZ,p.x,p.z,k.x,k.z)<9.6){const ap=Math.atan2(p.z-MZ,p.x),a=ap+clamp(aciFark(Math.atan2(k.z-MZ,k.x),ap),-0.8,0.8);p.tx=Math.cos(a)*10.3;p.tz=MZ+Math.sin(a)*10.3;}
    p.hizOran=Math.max(hz||0,clamp(L/kalan,D[0],c&&c.donusUst||D[1])/p.maxSpd);p.bak=null;},
  golSahneAdim(dt){
    const c=this.celeb,T=MOTOR_AYAR.golTempo,ph=this.phaseT,att=c.team,kt=c.kt,sc=c.sc;
    if(c.evre==='kutla'&&ph>=c.sevincT){c.evre='donus';for(const p of this.teams[att])p.sevinc=false;}
    const Y=this.golTopAdim(c,dt),kutla=c.evre==='kutla',kalan=Math.max(1,c.dudukT-1.5-ph);
    for(const p of this.players){
      if(!p.oyunda||p.sakat||p.eylem&&p.eylem.kilit||Y.has(p))continue;
      p.surus=null;p.yonHedef=null;
      if(p.team===att){
        if(p.rol==='GK'){const ileri=ph<Math.min(4,c.sevincT);p.tx=-c.side*(PL-(ileri?8:1.5));p.tz=MZ;p.hizOran=ileri?0.5:0.3;p.bak=null;p.sevinc=ileri&&ph>0.5;continue;}
        if(!kutla||!sc){this.golDonusHedef(p,kt,kalan,0);p.sevinc=false;continue;}
        if(p===sc){const pa=c.tur==='pasci'&&c.asist&&c.asist.oyunda,y=pa?c.asist:c.kosuYer,d=hyp(p.x-y.x,p.z-y.z);
          if(pa&&d<1.3){p.tx=p.x;p.tz=p.z;p.hizOran=0;}else{p.tx=y.x;p.tz=y.z;p.hizOran=d>8?1:d>2.5?0.6:0.2;}
          p.bak=pa?c.asist:null;p.sevinc=ph>0.3;continue;}
        if(c.katil.has(p)){
          if(ph<0.5){p.tx=p.x;p.tz=p.z;p.hizOran=0.3;p.bak=sc;}
          else{let a,r;if(p===c.es){a=sc.yon+Math.PI/2;r=1.0;}else{a=((p.n|0)*2.39996+(sc.n|0))%6.2832;r=0.9+0.7*h2(c.oz,(p.n|0)+40);}
            p.tx=clamp(sc.x+Math.cos(a)*r,-PL-2,PL+2);p.tz=clamp(sc.z+Math.sin(a)*r,-2,PW+2);const d=hyp(p.tx-p.x,p.tz-p.z);p.hizOran=d>6?0.9:d>2?0.6:0.25;p.bak=sc;}
          p.sevinc=ph>0.5;continue;}
        const e=c.cift.get(p);
        if(e&&ph<5){const d=hyp(e.x-p.x,e.z-p.z);if(d>1.0){p.tx=(p.x+e.x)/2;p.tz=(p.z+e.z)/2;p.hizOran=d>8?0.5:0.3;}else{p.tx=p.x;p.tz=p.z;p.hizOran=0;}p.bak=e;p.sevinc=ph>0.5;continue;}
        if(ph<0.5+5*h2(c.oz,(p.n|0)+60)){p.tx=p.x;p.tz=p.z;p.hizOran=0;p.bak=null;p.sevinc=ph>0.5;continue;}
        this.golDonusHedef(p,kt,kalan,0);p.sevinc=false;continue;}
      /* yenen takım: yerinde üzgün, sonra santra yerine (kaleci kalesine) */
      const u=c.uzgunT.get(p)||0;
      if(ph<u){p.tx=p.x;p.tz=p.z;p.hizOran=0;p.bak=null;continue;}
      if(p.rol==='GK'){p.tx=c.side*(PL-1.5);p.tz=MZ;p.hizOran=0.3;p.bak=null;continue;}
      this.golDonusHedef(p,kt,kalan,0.25);}
    /* jestlerin süresi (oyunda niyetAdim ilerletir; gol evresinde burada) */
    for(const p of this.players){const j=p.jest;if(j){j.t+=dt;if(j.t>=j.sure)p.jest=null;}}
    if(MOTOR_AYAR.protokol&S1_BIT.ODAK)this.golOdak(c,dt);
    this.hareketHepsi(dt);this.topAdim(dt);
    if(this.golSantraHazirMi(c)||ph>=T.tavan)this.golDuduk(c);
  },
  /* top zinciri: git → (cik → gonder) → yol → (tasi | yeniden gonder) → nokta. Döner: bu karede top makinesinin yönettiği oyuncular */
  golTopAdim(c,dt){
    const T=c.top,b=this.ball,Y=c.yon,kt=c.kt;Y.clear();T.t+=dt;
    let p=T.p;if(p&&(!p.oyunda||p.sakat)){T.p=p=null;if(b.tasiyan&&!b.tasiyan.oyunda)b.tasiyan=null;if(T.evre!=='yol'&&T.evre!=='nokta'){T.evre='yol';T.bos=0;}}
    const al=(q,tur)=>{b.agda=false;b.tasiyan=q;b.vx=b.vy=b.vz=0;this.topDegisti();T.p=q;T.alici=null;T.t=0;
      if(tur)this.on(tur==='tasi'?'topuAgdanAldi':'golTopAl',tur==='tasi'?{p:q}:{p:q,tur,takim:q.team});
      T.evre=T.tur==='tasi'||T.tur==='atan'||hyp(q.x,q.z-MZ)<=12||T.zincir>=4?'tasi':T.zincir===0?'cik':'gonder';T.hedef=null;};   /* ağdan alan (kaleci ya da savunan) önce dışarı taşır */
    if(T.evre==='git'){
      if(!p){T.evre='yol';T.bos=0;}
      else{Y.add(p);p.sevinc=false;p.surus=null;
        if(this.phaseT<T.bekle){p.tx=p.x;p.tz=p.z;p.hizOran=0;p.bak=b;}
        else{const kos=T.tur==='tasi'||T.tur==='atan';p.tx=b.x-(b.agda?c.side*0.4:0);p.tz=b.z;p.hizOran=kos?1:0.3;p.bak=b;p.yonHedef=null;
          if(b.tasiyan&&b.tasiyan!==p){T.evre='yol';T.bos=0;}
          else if(hyp(p.x-b.x,p.z-b.z)<0.9&&b.y<1.5)al(p,b.agda?T.tur:null);}}}
    else if(T.evre==='cik'){Y.add(p);const cx=c.side*(PL-4.5),cz=MZ+(this.golOzet(c,8)<0.5?-3:3);p.tx=cx;p.tz=cz;p.hizOran=0.3;p.bak=null;p.yonHedef=null;
      if(hyp(p.x-cx,p.z-cz)<0.8){T.evre='gonder';T.t=0;}}
    else if(T.evre==='gonder'){Y.add(p);if(!T.hedef)T.hedef=this.golHedefSec(c,p);const H=T.hedef;
      if(H.q){Y.add(H.q);H.q.tx=H.q.x;H.q.tz=H.q.z;H.q.hizOran=0;H.q.bak=p;H.q.yonHedef=null;H.x=H.q.x;H.z=H.q.z;}
      p.tx=p.x;p.tz=p.z;p.hizOran=0;p.bak=H.q||H;p.yonHedef=Math.atan2(H.z-p.z,H.x-p.x);
      if(T.t>0.7)this.golGonder(c,p,H);}
    else if(T.evre==='yol'){
      const q=T.alici,v=hyp(b.vx,b.vz);
      if(q&&q.oyunda&&!q.sakat){Y.add(q);q.tx=q.x;q.tz=q.z;q.hizOran=0;q.bak=b;q.yonHedef=null;
        if(!b.tasiyan&&hyp(q.x-b.x,q.z-b.z)<1.2&&b.y<2.2){al(q,null);return Y;}}
      if(!b.tasiyan&&b.y<0.5&&v<5){let en=null,ed=0.9;
        for(const o of this.players){if(!o.oyunda||o.sakat||o.sevinc||o===T.son||o.rol==='GK'||o.eylem&&o.eylem.kilit)continue;const d=hyp(o.x-b.x,o.z-b.z);if(d<ed){ed=d;en=o;}}
        if(en){if(en.team===kt){al(en,null);return Y;}
          Y.add(en);this.golGonder(c,en,{x:0,z:MZ,q:null,tur:'tekme'});return Y;}}
      if(b.tasiyan){const o=b.tasiyan;T.p=o;T.evre=hyp(o.x,o.z-MZ)<=12?'tasi':'gonder';T.hedef=null;T.t=0;return Y;}
      if(v<0.3&&b.y<0.05){T.bos+=dt;
        if(hyp(b.x,b.z-MZ)<=2.5){T.evre='nokta';T.t=0;}
        else if(T.bos>3){let en=null,ed=1e9;for(const o of this.teams[kt])if(o.oyunda&&!o.sakat&&o.rol!=='GK'){const d=hyp(o.x-b.x,o.z-b.z);if(d<ed){ed=d;en=o;}}
          if(en){T.p=en;T.evre='git';T.bekle=0;T.t=0;}}}
      else T.bos=0;}
    else if(T.evre==='tasi'){
      if(!p||b.tasiyan!==p){T.evre='yol';T.bos=0;return Y;}
      Y.add(p);const kos=T.tur==='tasi'?1:T.tur==='atan'?0.9:0.3;p.tx=0;p.tz=MZ;p.hizOran=kos;p.bak=null;p.yonHedef=null;p.sevinc=false;
      if(hyp(p.x,p.z-MZ)<0.8){b.tasiyan=null;Object.assign(b,{x:0,z:MZ,y:0,vx:0,vy:0,vz:0,egri:0,ust:0});this.topDegisti();p.eylem={ad:'yerlestir',t:0,sure:0.6};
        T.evre='nokta';T.p=null;T.son=p;T.t=0;if(!T.nokta){T.nokta=true;this.on('golTopNokta',{p});}}}
    else if(T.evre==='nokta'){
      const d=hyp(b.x,b.z-MZ),v=hyp(b.vx,b.vz);
      if(b.tasiyan){T.p=b.tasiyan;T.evre='tasi';return Y;}
      if(d>2.5&&v<0.3){T.evre='yol';T.bos=0;return Y;}
      if(d>0.3&&v<0.3){const s=this.santraci(kt);if(s&&s.oyunda&&!s.sakat&&!(s.eylem&&s.eylem.kilit)){Y.add(s);s.tx=b.x-0.5*this.dir[kt];s.tz=b.z;s.hizOran=0.3;s.bak=b;s.yonHedef=null;
          if(hyp(s.x-b.x,s.z-b.z)<1.0){Object.assign(b,{x:0,z:MZ,y:0,vx:0,vy:0,vz:0,egri:0,ust:0});this.topDegisti();s.eylem={ad:'yerlestir',t:0,sure:0.6};
            if(!T.nokta){T.nokta=true;this.on('golTopNokta',{p:s});}}}}
      else if(d<=0.3&&v<0.2&&!T.nokta){T.nokta=true;this.on('golTopNokta',{p:T.son});}}
    return Y;
  },
  /* hedef: noktaya ≤ 45 m ve ayakla ise doğrudan nokta; değilse yolun üstündeki arkadaş (kendi yarısında, 12–30 m, noktaya 8 m daha yakın, yola en az
     sapan saha oyuncusu), yoksa nokta. Kaleci 26 m'ye dek yuvarlar, ötesinde omuzdan atar (yalnız alıcıya; noktaya yuvarlar) */
  golHedefSec(c,p){const L=hyp(p.x,p.z-MZ)||0.1,T=c.top,ayak=p.rol!=='GK'&&(T.zincir===0?T.tur==='ayak':this.golOzet(c,30+T.zincir)<0.5);
    let q=null;
    if(!(ayak&&L<=45)){let es=1e9;const ux=-p.x/L,uz=(MZ-p.z)/L;
      for(const o of this.teams[c.kt]){if(!o.oyunda||o.sakat||o===p||o.rol==='GK'||o===T.son||o.eylem&&o.eylem.kilit||o.x*this.dir[c.kt]>-2)continue;const d=hyp(o.x-p.x,o.z-p.z);if(d<12||d>30)continue;   /* alıcı kendi yarısında */
        if(hyp(o.x,o.z-MZ)>L-8)continue;const sap=Math.abs((o.x-p.x)*uz-(o.z-p.z)*ux);if(sap<es){es=sap;q=o;}}}
    const Lh=q?hyp(q.x-p.x,q.z-p.z):L;
    return{x:q?q.x:0,z:q?q.z:MZ,q,tur:p.rol==='GK'?(q&&Lh>26?'omuz':'yuvarla'):ayak?'tekme':'yuvarla'};},
  golGonder(c,p,H){const T=c.top,b=this.ball,L=hyp(H.x-p.x,H.z-p.z)||0.1,ux=(H.x-p.x)/L,uz=(H.z-p.z)/L;
    b.tasiyan=null;b.agda=false;b.sahip=null;b.egri=0;b.ust=0;
    if(H.tur==='omuz'){const Tu=0.9+L/18;b.x=p.x+ux*0.3;b.z=p.z+uz*0.3;b.y=1.9;const v=this.havadanCoz(b.x,1.9,b.z,H.x,1.2,H.z,Tu,0);b.vx=v.vx;b.vy=v.vy;b.vz=v.vz;
      p.eylem={ad:'elleAtis',t:0,sure:0.6,stil:'omuz'};}
    else{const v0=yerIlkHiz(Math.max(0.5,L-0.35),H.q?1.2:0.3,undefined,this.kosullar);b.x=p.x+ux*0.35;b.z=p.z+uz*0.35;b.y=0;b.vy=0;b.vx=ux*v0;b.vz=uz*v0;
      p.eylem=H.tur==='tekme'?{ad:'tekme',t:0,sure:0.3,ayak:p.ayak==='sol'?'sol':'sag',kucuk:true}:{ad:'elleAtis',t:0,sure:0.6,stil:'yuvarla'};}
    p.kickCd=0.3;this.topDegisti();
    this.on('golTopGonder',{p,q:H.q||null,tur:H.tur,L});
    T.son=p;T.zincir++;T.alici=H.q||null;T.p=null;T.evre='yol';T.t=0;T.bos=0;T.hedef=null;},
  /* Law 8: herkes kendi yarısında, rakipler orta yuvarlağın dışında, noktanın 3 m içinde santracıdan başka kimse yok (santraTek 0 iken yardımcı da) */
  santraKuralHazir(t){const s=this.santraci(t),y=MOTOR_AYAR.santraTek?null:this.santraYardimcisi(t);
    for(const p of this.players){if(!p.oyunda||p.sakat)continue;
      if(p.x*this.dir[p.team]>0.3)return false;
      const d=hyp(p.x,p.z-MZ);if(p.team!==t&&d<9.15||p!==s&&p!==y&&d<3)return false;}
    return true;},
  /* düdüğün ön koşulu: planlanan an geldi, top noktada ve durgun, santracı topun başında, hakem santra yerinde ≥ 0,5 sn, sakatlık ve kart yok, Law 8 */
  golSantraHazirMi(c){const b=this.ball,H=c.hk;
    if(this.phaseT<c.dudukT||b.tasiyan||hyp(b.x,b.z-MZ)>0.3||hyp(b.vx,b.vz)>0.2||b.y>0.05)return false;
    const s=this.santraci(c.kt);if(!s||hyp(s.x,s.z-MZ)>1.2)return false;
    if(!H||H.evre!=='bekle'||H.bekT<0.5||this.sakatlikBekletir()||this.refs[0].kartSira)return false;
    return this.santraKuralHazir(c.kt);},
  golDuduk(c){const tavan=this.phaseT>=MOTOR_AYAR.golTempo.tavan,b=this.ball;
    if(tavan&&(b.tasiyan||hyp(b.x,b.z-MZ)>0.3))this.topuSifirla(0,MZ);
    this.refs[0].eylem={ad:'duduk',t:0,sure:0.8};this.on('duduk',{tur:'santra',sinif:null,seremoni:true,bek:0,sahip:'santra',tavan});
    for(const p of this.players)p.sevinc=false;
    const al=c.alan;this.santraHazirla(c.kt,false);this.santraAcele=!!al;this._santraS1={t:this.t};},
  /* hakem (hakemAI'nın gol dalı): isaret 2,4 sn yerinde, golcüye bakar (çizim santrayı gösterir) → yuru: deftere yazarak (not, 2,4 sn; 0,17 hız)
     sonra santra yerine 0,25–0,42 hız oranıyla (düdüğe yetişecek hız; ≤ 3 m/sn), yüz gidiş yönünde → bekle: yerinde, topa bakar */
  golHakemAdim(h,dt){const c=this.celeb,H=c.hk,ph=this.phaseT,y=H.yer;
    if(H.evre==='isaret'){h.tx=h.x;h.tz=h.z;h.hizOran=0;h.bak=c.sc||this.ball;if(ph>=2.4){H.evre='yuru';h.eylem={ad:'not',t:0,sure:2.4};}return;}
    const d=hyp(y.x-h.x,y.z-h.z);
    if(H.evre==='yuru'){h.tx=y.x;h.tz=y.z;h.bak=null;const not=h.eylem&&h.eylem.ad==='not',kal=c.dudukT-ph-1.5;
      h.hizOran=not?0.17:clamp(kal>0?d/kal/h.maxSpd:1,0.25,0.42);if(d>0.3)h.bakisYon=Math.atan2(y.z-h.z,y.x-h.x);
      if(d<1.0){H.evre='bekle';H.bekT=0;}return;}
    h.tx=y.x;h.tz=y.z;h.hizOran=d>0.5?0.15:0;h.bak=this.ball;H.bekT+=dt;},
  /* yan hakem: 1,5 sn hakemle göz göze, sonra savunmanın sondan ikinci oyuncusunun gittiği yerin hizasına (hedefleri, tx; top terimi yok) — golden
     önceki yerinden kaleye doğru inmez (kale çizgisine koşmaz), dönen savunmayla orta çizgiye kayar */
  golYanHakem(q,s,z){if(this.phaseT<1.5){q.tx=q.x;q.tz=q.z;q.hizOran=0;q.bak=this.refs[0];q.yonHedef=null;return;}
    const def=this.dir[0]===-s?0:1,c=this.celeb,ust=c&&c.yh0?c.yh0[s>0?0:1]:PL-1;let a=-Infinity,e=-Infinity;for(const p of this.teams[def])if(p.oyunda){const v=p.tx*s;if(v>a){e=a;a=v;}else if(v>e)e=v;}
    q.tx=clamp(Math.max(e,0),0,Math.min(PL-1,Math.max(ust,0)))*s;q.tz=z;const uz=Math.abs(q.tx-q.x);q.hizOran=uz>8?0.6:0.45;q.yonHedef=uz>6?null:(z>MZ?-Math.PI/2:Math.PI/2);q.bak=uz>6?null:this.ball;},
  /* bakış odağı (bit 16; sonucu değiştirmez, yalnız js/kamera.js okur): sevinçte golcü (×2) ve 8 m içindeki küme; dönüşte dönen takımın merkezi
     kendi yarısındakilerin payının karesiyle (× 0,8) noktaya karışır; düdüğe son 2 sn'de nokta. exp(−dt/0,5) ile süzülür */
  golOdak(c,dt){const sc=c.sc,ph=this.phaseT;let x=0,z=MZ;
    if(c.evre==='kutla'&&sc){let n=2,sx=sc.x*2,sz=sc.z*2;for(const p of this.teams[c.team])if(p!==sc&&p.oyunda&&hyp(p.x-sc.x,p.z-sc.z)<8){sx+=p.x;sz+=p.z;n++;}x=sx/n;z=sz/n;}
    else if(ph<c.dudukT-2){let n=0,sx=0,sz=0,ev=0,top=0;
      for(const p of this.teams[c.team]){if(!p.oyunda||p.rol==='GK')continue;top++;const evde=p.x*this.dir[p.team]<=0.3;if(evde)ev++;const w=evde?0.3:1;sx+=p.x*w;sz+=p.z*w;n+=w;}
      const w=top?Math.pow(ev/top,2)*0.8:1;x=n?sx/n:0;z=n?sz/n:MZ;x=lerp(x,0,w);z=lerp(z,MZ,w);}
    const o=c.odak;if(!o){c.odak={x,y:1,z};return;}const k=1-Math.exp(-dt/0.5);o.x+=(x-o.x)*k;o.z+=(z-o.z)*k;},
});
