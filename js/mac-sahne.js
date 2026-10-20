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
  protokol:1                   // S1: sahne protokolleri bit maskesi (S1_BIT) — 1 seremonili barajlı serbest vuruş (S1a), 2 kart sahnesi (S1d), 4 penaltı sahnesi
                               // (S1b), 8 gol sonrası akış (S1c), 16 bakış odağı (S1c; sonucu değiştirmez), 32 korner ve kenar kullananının rutini (S1e), 64 rutinin
                               // barajlı vuruşa ve penaltıya genişlemesi (S1e); 0: K1 (birebir). Varsayılan o ana dek uygulanan bitlerin toplamı (S1a: 1)
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
});
const S1_BIT=Object.freeze({SERBEST:1,KART:2,PENALTI:4,GOL:8,ODAK:16,RUTIN:32,RUTIN2:64});
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
  /* duranHazirMi'nin son kapısı (yalnız du.dudukGerek varken): kart sürerken kullanım yok (mutlak ağ zorlaHazir + 10 sn); düdük çalınmadıysa
     güvenlik ağından 2 sn önce düdük çalar (bekleme 0,5 sn; düdüksüz kullanım hiç yok); kart sahnesinin düdüğü kart bitince ve ön koşul
     sağlanınca burada çalar; barajlı vuruşun ve penaltının düdüğünü sahnenin evre makinesi çalar. Düdükten sonra bekleme dolunca kullanılır */
  s1DudukKapisi(du,tk){
    const ag=du.zorlaHazir||28;
    if(this.refs[0].kartSira&&(MOTOR_AYAR.protokol&S1_BIT.KART)&&du.t<ag+10)return false;
    if(du.dudukT==null){
      if(du.t>=ag-2){this.dudukCal(du,0.5);return false;}
      if(du.dudukGerek==='kart'||du.kartTekrar){
        if(du.kartBitT==null||du.t<du.kartBitT+du.kartDudukT||!this.dudukOnKosul(du))return false;
        this.dudukCal(du,du.kartBek);du.kartTekrar=false;}
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
  barajItisR(du,p){const H=du.hk,e=H.evre;return H.itI===0&&(e==='gel'||e==='top'||e==='kaos')&&hyp(p.x-du.x,p.z-du.z)<9.15?MOTOR_AYAR.seremoni.kalabalik:9.6;}
});
