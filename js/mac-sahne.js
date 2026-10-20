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
  protokol:0                   // S1: sahne protokolleri bit maskesi (S1_BIT) — 1 seremonili barajlı serbest vuruş (S1a), 2 kart sahnesi (S1d), 4 penaltı sahnesi
                               // (S1b), 8 gol sonrası akış (S1c), 16 bakış odağı (S1c; sonucu değiştirmez), 32 korner ve kenar kullananının rutini (S1e), 64 rutinin
                               // barajlı vuruşa ve penaltıya genişlemesi (S1e); 0: K1 (birebir). S1-0 yalnız ortak altyapıdır: alan yok, 0
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
    return du.t>=du.dudukT+du.dudukBek;}
});
