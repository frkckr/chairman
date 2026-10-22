/* ============ Chairman — maç motoru: hoca tarzı (Z1 iskeleti, 2026-10-19; FUTBOL_KUTUPHANESI §7, §12.1; kutuphane/G-hoca-tarzlari.md) ============
   Yalnız veri ve saf işlev; çizim yok, rastlantı çekmez. Tarz = ilkellerin ağırlıkları + takımın düzeni + bağlılık katsayısı + ısrar (FUTBOL_KUTUPHANESI
   §1 madde 4). Z1'de iskelettir: MOTOR_AYAR.planTarz 0 iken bütün ağırlıklar 1 (iki takım aynı "dengeli" tarzla oynar). Z3'te iki canlı arketip (kısa
   kuran ↔ uzun atan; yüksek pres ↔ orta blok), Z7'de on arketip, kenar avantajları, ısrar ve hocanın gizli becerisi gelir; kadro.taktik'in
   (VARSAYILAN_TAKTIK: sakin, tempo, direkt, risk, pres …) tarz içine taşınması o turların işidir.
   Arketip tablosu Ek B-2'den (kutuphane/B-ilerletme.md; çarpanlar 0,5–2,0, tahmin): konumsal (Guardiola/Lillo), ilişkisel (Diniz), dikey/geçiş (Klopp tipi),
   kanat-orta (klasik 4-4-2). Ağırlık w = 1 + planTarz · (W − 1); takımın tarzı kadro.taktik.tarz (arketip adı ya da {ad: pay} harmanı) ya da 'dengeli'.
   Kullanım: tarzAgirlik(m, takım, ilkel) — plan katmanı (js/mac-plan.js) önerinin oranında ve plan payında çarpan olarak okur; tarzBaglilik(m, takım)
   planın bağlılık süresine katsayı. m.tarz[t] Match kurulurken değil, ilk okumada tembel kurulur (plan 0 iken hiç kurulmaz).
   Z3 (2026-10-19 gece; FUTBOL_KUTUPHANESI §12.2, kutuphane/G-hoca-tarzlari.md G1, G6; kutuphane/A-oyun-kurma.md): iki canlı arketip — arketip
   takım vektörü de taşır (takim: kisaPay kale vuruşu ve dağıtımda kısa kurma payı, presYuksek pres yüksekliği, blokCizgi savunma hattının kayması m,
   bekIceri bekin kurmada içe girmesi, kaleciArti kalecinin +1 olması, uzunHedef hedef adama uzun top, ikinciTop uzun topta ikinci top düzeni). Yeni
   arketip 'direkt' (uzun atan + orta blok; G1.5); 'konumsal' kısa kuran + yüksek pres (G1.1–G1.2). Okuma: tarzTakim(m, t) — MOTOR_AYAR.tarzEtki 0
   iken null (kadro.taktik'in eski değerleri), değilse harmanın vektörü; kullananlar etkin taktiği (js/mac-takim.js etkinTaktik), savunma hattını
   (takimNiyet), kale vuruşu planını ve kurma şeklini (js/mac-kaleci.js, js/mac-dizilis.js) ölçekler.
   B3 (2026-10-22; FUTBOL_KUTUPHANESI §12.1 B, kutuphane/G G1.0 tempo ve risk eksenleri): vektöre hücum iştahı (istah: kazanmak için ileri oynama,
   geri pas ve topu tutma isteğinin tersi) ve tempo; etkin taktiğin tempo, sakinlik, risk, ilerleme ağırlığı (ilerle), topu tutmanın bedeli (koruK),
   koşu sıklığı ve kontra eşiği iştahtan (tarzIstah; 0: eski). 'dengeli' artık nötr vektör taşır; eski "vektörsüz" davranış 'yok' arketipidir
   (tarzsız kadro ve --tarz yok buraya düşer). Değerler tahmin; 80 maçlık tarz kenarıyla ayarlanır (FUTBOL_KUTUPHANESI §12.1 B5). */
'use strict';
ayarEkle('Z',{
  tarzEtki:1,                  // Z3: takım vektörünün etkisi (0: kadro.taktik'in eski değerleri; 1: tarzın vektörü etkin taktiğe ve kurmaya tam girer)
  tarzUzun:2.2,                // Z3: ileriye uzun topun tarz payı katsayısı (uzunHedef − 0,5 ile; js/mac-karar.js tarzUzunEk; 1,4'te direkt takımın uzun pas payı konumsalınkinden
                               // düşüktü; Z3'te 3; Z7a'da 2,2 — payın bir kısmı yüksek hattın arkasına, tarzArka: uzun pas %20 → %22)
  tarzArka:1.5,                // Z7a (G2.3 uzun top ↔ yüksek hat): hedefi rakibin çizgisinin arkasındaki ileri uzun topa, rakibin hattı kalesinden 28 m'den uzaksa
                               // uzun topa eğilimli tarz (uzunHedef − 0,3) pay alır (hat 38 m'de tam); 0: eski
  tarzIstah:1,                 // B3 (2026-10-22): tarzın hücum iştahı ve temposu etkin taktiğe girer (js/mac-takim.js etkinTaktik, takimNiyet); 0: eski
  tarzSabir:0,                 // B1b (2026-10-22): tarzın sabrı — sakinlik hedefi, geri pas kapısının genişliği ve amaçsız zincir bütçesi tarzdan (js/mac-takim.js
                               // etkinTaktik, js/mac-karar.js pasDegeri, js/mac-motoru.js pasSay); 0: B1+B3 (tarzlar pas yönünde ayrışmıyordu)
  tarzSabirZincir:1,           // B1b: zincir bütçesinin tarzla açılması (N = 2 + tarzSabir · bu · (2·sabir − 1); 0: her tarzda 2 pas)
  tarzSecim:1,                 // B4 (2026-10-22): secenek.tarz 'dagilim' iken (oyun, mac-deneme) iki takımın tarzı tohumdan TARZ_DAGILIM ile; 0: kadronun tarzı
  tarzGecis:40,                // B4b (2026-10-22): maç içi tarz değişikliğinin oturma süresi (motor sn; ~3 ekran dakikası) — eski harmandan yenisine yumuşak geçiş
  tarzTalimat:20,              // B4b: talimat duruşta uygulanır; bu kadar motor sn içinde duruş olmazsa hoca kenardan seslenir (geçiş yine başlar)
  tarzYanUzun:1.5              // Z3: kısa kuran tarzda yana ve geriye uzun pasın (≥ 28 m) cezası (kisaPay − 0,5'in artısı ile; konumsal takımın uzun paslarının çoğu savunmalar arası yan ve geri pastı)
});
const TARZ_ARKETIP={
  yok:      {ad:'tarzsız',ilkel:{duvarPasi:1,ucuncuAdam:1,derinKosu:1,geriCevirme:1},baglilik:1,takim:null},   /* B3: eski 'dengeli' (vektörsüz: kadronun taktiği) */
  dengeli:  {ad:'dengeli',ilkel:{duvarPasi:1,ucuncuAdam:1,derinKosu:1,geriCevirme:1},baglilik:1,
    takim:{kisaPay:0.5,presYuksek:0.5,blokCizgi:0,bekIceri:0.2,kaleciArti:0.4,uzunHedef:0.5,ikinciTop:0.5,karsiSn:3,istah:0.6,tempo:0.5,sabir:0.45}},
  konumsal: {ad:'konumsal oyun',ilkel:{duvarPasi:1.0,ucuncuAdam:1.8,derinKosu:1.0,geriCevirme:1.8},baglilik:1.6,
    takim:{kisaPay:0.8,presYuksek:0.8,blokCizgi:5,bekIceri:0.6,kaleciArti:0.8,uzunHedef:0.15,ikinciTop:0.3,karsiSn:5.5,istah:0.6,tempo:0.4,sabir:0.85}},
  iliskisel:{ad:'ilişkisel oyun',ilkel:{duvarPasi:2.0,ucuncuAdam:1.5,derinKosu:0.8,geriCevirme:1.2},baglilik:0.7,
    takim:{kisaPay:0.6,presYuksek:0.55,blokCizgi:2,bekIceri:0.3,kaleciArti:0.5,uzunHedef:0.25,ikinciTop:0.4,karsiSn:4,istah:0.7,tempo:0.6,sabir:0.55}},
  dikey:    {ad:'dikey / geçiş',ilkel:{duvarPasi:1.2,ucuncuAdam:1.0,derinKosu:2.0,geriCevirme:1.2},baglilik:0.7,
    takim:{kisaPay:0.45,presYuksek:0.85,blokCizgi:6,bekIceri:0.2,kaleciArti:0.4,uzunHedef:0.5,ikinciTop:0.7,karsiSn:6,istah:0.9,tempo:0.85,sabir:0.2}},
  kanatOrta:{ad:'kanat ve orta',ilkel:{duvarPasi:0.8,ucuncuAdam:0.8,derinKosu:1.2,geriCevirme:1.0},baglilik:1.1,
    takim:{kisaPay:0.35,presYuksek:0.45,blokCizgi:0,bekIceri:0,kaleciArti:0.2,uzunHedef:0.5,ikinciTop:0.6,karsiSn:2.5,istah:0.65,tempo:0.55,sabir:0.4}},
  /* Z3: uzun atan + orta blok (G1.5 direkt oyun ve ikinci top; Brentford/Burnley tipi): kale vuruşu ve kaleci uzun, hat ve pres orta, uzun topta
     ikinci top düzeni; derin koşu sık, kombinasyon az */
  direkt:   {ad:'direkt ve ikinci top',ilkel:{duvarPasi:0.7,ucuncuAdam:0.7,derinKosu:1.4,geriCevirme:0.9},baglilik:0.8,
    takim:{kisaPay:0.12,presYuksek:0.3,blokCizgi:-5,bekIceri:0,kaleciArti:0.1,uzunHedef:0.9,ikinciTop:0.9,karsiSn:2,istah:0.75,tempo:0.75,sabir:0.15}}
};
/* Z5c: karsiSn — hocanın karşı pres penceresi (sn; E.3 N2, N12: kolektif karşı pres 5–6 sn, tavan 8; Klopp tipi dikey 6, konumsal 5,5, direkt 2 —
   direkt takım kayıpta çoğunlukla geri çekilir; değerler tahmin, js/mac-takim.js karsiPresKarar okur) */
/* B1b: sabir — topu çevirme sabrı (G1.0'ın risk / ileri pas payı ekseninin tersi; iştahtan ayrı: kazanmak için oynamak ≠ ileri acele etmek). Konumsal önü
   kapalıyken birkaç pas çevirir sonra ileri arar, direkt hemen ileri oynar; harmanda karıştığı için maç içi tarz değişikliğinde pasın sabrı da kademeli değişir */
const TARZ_ALAN=['kisaPay','presYuksek','blokCizgi','bekIceri','kaleciArti','uzunHedef','ikinciTop','karsiSn','istah','tempo','sabir'];
/* B3: yükleme denetimi — vektörlü her arketipte bütün alanlar (eksik alan harmanda NaN üretir) */
for(const a in TARZ_ARKETIP){const T=TARZ_ARKETIP[a].takim;if(T)for(const k of TARZ_ALAN)if(typeof T[k]!=='number')throw new Error('mac-tarz.js: '+a+' arketipinde '+k+' yok');}
/* B4: maç başına tarz dağılımı (veri; tahmin, atak ağırlıklı — FUTBOL_KUTUPHANESI §12.1 B): oyunda ve mac-deneme'de her maç iki takıma tohumdan
   bir arketip; konuk evinkini almaz (iki tarz tepeden ayırt edilsin). Hocanın kendi tarzı bağlanınca (F, Z7-2) maç hocanın tarzıyla kurulur */
const TARZ_DAGILIM={dikey:0.22,iliskisel:0.18,konumsal:0.17,direkt:0.15,kanatOrta:0.15,dengeli:0.13};
/* tohumdan [ev, konuk] arketip (saf; this.rast çekmez: ikiz motor ve işçiler aynı tarzı alır) */
function tarzDagilimSec(tohum){
  const sec=(u,haric)=>{let s=0,son=null;for(const a in TARZ_DAGILIM)if(a!==haric)s+=TARZ_DAGILIM[a];let x=u*s;
    for(const a in TARZ_DAGILIM){if(a===haric)continue;son=a;x-=TARZ_DAGILIM[a];if(x<0)return a;}return son;};
  const a0=sec(h2(tohum,7919),null);return[a0,sec(h2(tohum,7920),a0)];}
/* takımın tarz harmanı: {arketip: pay} (paylar 1'e bölünür). Öncelik (B4): maçın açık seçimi (secenek.tarz [ev, konuk]; 'yok' dahil) > 'dagilim'
   (tarzSecim > 0) > kadronun tarzı > 'yok' (vektörsüz; eskiden 'dengeli' adıyla) */
function tarzKur(m,t){
  const S=m.tarzSec;let k=m.kadro&&m.kadro[t]&&m.kadro[t].taktik&&m.kadro[t].taktik.tarz;
  if(Array.isArray(S)&&S[t]!=null)k=S[t];
  else if(S==='dagilim'&&MOTOR_AYAR.tarzSecim>0)k=tarzDagilimSec(m.tohum)[t];
  return tarzHarmanKur(tarzHarmanOku(k)||{yok:1});}
/* arketip adı ya da {arketip: pay} → paylar 1'e bölünmüş harman (saf); geçersizse null */
function tarzHarmanOku(k){
  const var_=a=>Object.prototype.hasOwnProperty.call(TARZ_ARKETIP,a);   /* 'toString' gibi kalıtılmış adlar arketip sayılmaz */
  if(typeof k==='string')return var_(k)?{[k]:1}:null;
  if(k&&typeof k==='object'){const h={};let s=0;for(const a in k)if(var_(a)&&k[a]>0){h[a]=+k[a];s+=h[a];}if(s>0){for(const a in h)h[a]/=s;return h;}}
  return null;}
/* harmandan tarz nesnesi (saf): ilkel ağırlıkları, bağlılık ve takım vektörü paylarla */
function tarzHarmanKur(H){
  const ilkel={},o={harman:H,ilkel,baglilik:0,takim:null};let tp=0;const tk={};
  for(const a in H){const A=TARZ_ARKETIP[a];for(const i in A.ilkel)ilkel[i]=(ilkel[i]||0)+H[a]*A.ilkel[i];o.baglilik+=H[a]*A.baglilik;
    if(A.takim){tp+=H[a];for(const k of TARZ_ALAN)tk[k]=(tk[k]||0)+H[a]*A.takim[k];}}
  if(tp>0){for(const k of TARZ_ALAN)tk[k]/=tp;o.takim=tk;}   /* Z3: takım vektörü ('yok' payı vektörsüz: tarzsız takımın eski taktiği) */
  return o;}
/* B4b (2026-10-22): maç içinde tarz değişikliği — hocanın kapısı (ileride hocanın maç içi kararı, F ve Z7-2; bugün geliştirici panelinin TEST seçimi,
   js/mac-sahnesi.js tarzTestDegistir). hedef: arketip adı ya da {arketip: pay}; kare: komutun en erken karesi (verilmezse şimdi; dışarıdan gelen
   komut ikiz motora aynı kareyle verilir, js/mac-izleme.js izlemeKomut). Talimat bir duruşta uygulanır (duruş olmazsa en geç tarzTalimat sn sonra),
   takım eski harmandan yenisine tarzGecis sn'de yumuşakça geçer (ilkel ağırlıkları, bağlılık ve takım vektörü paylarla; etkin taktik niyetin
   yenilenmesinde okur); açık planlar kendi bağlılıklarıyla biter. Yeni komut eskisinin yerini alır, yarım kalan geçiş bulunduğu harmandan sürer.
   Rastlantı çekmez; komut yokken motor bu yolu hiç okumaz (sonuç değişmez). Olay 'tarzGecis' {takim, evre: 'basladi' | 'bitti', hedef: [arketip]}
   iki motorda aynı karede. Sınır: 'yok' (vektörsüz) payı karışınca takım vektörü öbür payların vektörüdür (geçiş vektörde sıçrar; panel 'yok' sunmaz) */
function tarzDegistir(m,t,hedef,kare){
  const H=tarzHarmanOku(hedef);if(!H||(t!==0&&t!==1))return false;
  const S=m._tarzG||(m._tarzG={K:[[],[]],G:[null,null]}),Q=S.K[t];
  Q.push({H,kare:kare!=null?kare:(m.kare||0)});Q.sort((x,y)=>x.kare-y.kare);return true;}
/* her motor adımında, yalnız komut varken (js/mac-motoru.js step). Komut kendi karesinde devreye girer (öncesinde hiçbir şeyi değiştirmez: ikiz
   motor komutu ana motordan önce alır); aynı takımın önceki geçişi o karede bulunduğu harmanda kalır, yenisi oradan başlar */
function tarzGecisAdim(m){
  const S=m._tarzG,k=m.kare||0;
  for(let t=0;t<2;t++){const Q=S.K[t];
    while(Q.length&&Q[0].kare<=k){const c=Q.shift();S.G[t]={H:c.H,bas:-1,eski:null,w:-1,kare:c.kare};}
    const g=S.G[t];if(!g)continue;
    if(g.bas<0){if(m.phase==='play'&&k<g.kare+MOTOR_AYAR.tarzTalimat*60)continue;
      const T=m.tarz||(m.tarz=[tarzKur(m,0),tarzKur(m,1)]);g.eski=T[t].harman;g.bas=m.t;m.on('tarzGecis',{takim:t,evre:'basladi',hedef:Object.keys(g.H)});}
    const s=clamp((m.t-g.bas)/Math.max(1e-6,MOTOR_AYAR.tarzGecis),0,1),w=s>=1?1:Math.round(s*s*(3-2*s)*20)/20;
    if(w!==g.w){g.w=w;const H={};for(const a in g.eski)H[a]=(1-w)*g.eski[a];for(const a in g.H)H[a]=(H[a]||0)+w*g.H[a];
      for(const a in H)if(!(H[a]>1e-9))delete H[a];m.tarz[t]=tarzHarmanKur(H);}
    if(s>=1){S.G[t]=null;m.on('tarzGecis',{takim:t,evre:'bitti',hedef:Object.keys(g.H)});}}
  if(!S.G[0]&&!S.G[1]&&!S.K[0].length&&!S.K[1].length)m._tarzG=null;}
/* geçişin durumu (salt okunur; panel): null yok, 'talimat' komut ya da duruş bekleniyor, yoksa geçişin oranı 0–1 */
function tarzGecisDurum(m,t){const S=m._tarzG;if(!S)return null;if(S.K[t].length)return 'talimat';const g=S.G[t];return g?(g.bas<0?'talimat':Math.max(0,g.w)):null;}
/* takımın baskın arketipi (salt okunur): harmanın en büyük payı */
function tarzBaskin(m,t){const H=(m.tarz?m.tarz[t]:tarzKur(m,t)).harman;let en=null,ep=-1;for(const a in H)if(H[a]>ep){ep=H[a];en=a;}return en;}
/* B4: takımın tarzının adı (salt okunur; geliştirici paneli TEST satırı ve araçlar): harmanın arketip adları, paya göre */
function tarzAdi(m,t){
  const H=(m.tarz?m.tarz[t]:tarzKur(m,t)).harman,a=Object.keys(H).sort((x,y)=>H[y]-H[x]);
  return a.length===1?TARZ_ARKETIP[a[0]].ad:a.map(x=>TARZ_ARKETIP[x].ad+' %'+Math.round(H[x]*100)).join(' + ');}
/* Z3: takımın tarz vektörü (saf; tarzEtki 0 iken ya da tarzsız takımda null) */
function tarzTakim(m,t){
  if(!(MOTOR_AYAR.tarzEtki>0))return null;
  const T=m.tarz||(m.tarz=[tarzKur(m,0),tarzKur(m,1)]);return T[t].takim;}
/* ilkelin tarz ağırlığı (saf; planTarz 0 iken 1) */
function tarzAgirlik(m,t,ilkel){
  const e=MOTOR_AYAR.planTarz;if(!e)return 1;
  const T=m.tarz||(m.tarz=[tarzKur(m,0),tarzKur(m,1)]),W=T[t].ilkel[ilkel];
  return W==null?1:1+e*(W-1);}
/* bağlılık süresinin katsayısı (saf; planTarz 0 iken 1) */
function tarzBaglilik(m,t){
  const e=MOTOR_AYAR.planTarz;if(!e)return 1;
  const T=m.tarz||(m.tarz=[tarzKur(m,0),tarzKur(m,1)]);return 1+e*(T[t].baglilik-1);}
/* B3: etkin hücum iştahı (saf) — maç durumuyla: geride ve son dakikalarda artar; öndeyken korumaya geçiş iştahlı takımda daha az (kr = koru × tutEtki) */
function istahEtkin(V,D){const kr=D.koru*MOTOR_AYAR.tutEtki;return clamp(V.istah+0.3*D.acele-0.4*kr*(1.5-V.istah),0,1);}
