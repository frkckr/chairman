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
   (takimNiyet), kale vuruşu planını ve kurma şeklini (js/mac-kaleci.js, js/mac-dizilis.js) ölçekler. */
'use strict';
ayarEkle('Z',{
  tarzEtki:1,                  // Z3: takım vektörünün etkisi (0: kadro.taktik'in eski değerleri; 1: tarzın vektörü etkin taktiğe ve kurmaya tam girer)
  tarzUzun:3,                  // Z3: ileriye uzun topun tarz payı katsayısı (uzunHedef − 0,5 ile; js/mac-karar.js tarzUzunEk; 1,4'te direkt takımın uzun pas payı konumsalınkinden düşüktü)
  tarzYanUzun:1.5              // Z3: kısa kuran tarzda yana ve geriye uzun pasın (≥ 28 m) cezası (kisaPay − 0,5'in artısı ile; konumsal takımın uzun paslarının çoğu savunmalar arası yan ve geri pastı)
});
const TARZ_ARKETIP={
  dengeli:  {ad:'dengeli',ilkel:{duvarPasi:1,ucuncuAdam:1,derinKosu:1,geriCevirme:1},baglilik:1,takim:null},
  konumsal: {ad:'konumsal oyun',ilkel:{duvarPasi:1.0,ucuncuAdam:1.8,derinKosu:1.0,geriCevirme:1.8},baglilik:1.6,
    takim:{kisaPay:0.8,presYuksek:0.8,blokCizgi:5,bekIceri:0.6,kaleciArti:0.8,uzunHedef:0.15,ikinciTop:0.3}},
  iliskisel:{ad:'ilişkisel oyun',ilkel:{duvarPasi:2.0,ucuncuAdam:1.5,derinKosu:0.8,geriCevirme:1.2},baglilik:0.7,
    takim:{kisaPay:0.6,presYuksek:0.55,blokCizgi:2,bekIceri:0.3,kaleciArti:0.5,uzunHedef:0.25,ikinciTop:0.4}},
  dikey:    {ad:'dikey / geçiş',ilkel:{duvarPasi:1.2,ucuncuAdam:1.0,derinKosu:2.0,geriCevirme:1.2},baglilik:0.7,
    takim:{kisaPay:0.45,presYuksek:0.85,blokCizgi:6,bekIceri:0.2,kaleciArti:0.4,uzunHedef:0.5,ikinciTop:0.7}},
  kanatOrta:{ad:'kanat ve orta',ilkel:{duvarPasi:0.8,ucuncuAdam:0.8,derinKosu:1.2,geriCevirme:1.0},baglilik:1.1,
    takim:{kisaPay:0.35,presYuksek:0.45,blokCizgi:0,bekIceri:0,kaleciArti:0.2,uzunHedef:0.5,ikinciTop:0.6}},
  /* Z3: uzun atan + orta blok (G1.5 direkt oyun ve ikinci top; Brentford/Burnley tipi): kale vuruşu ve kaleci uzun, hat ve pres orta, uzun topta
     ikinci top düzeni; derin koşu sık, kombinasyon az */
  direkt:   {ad:'direkt ve ikinci top',ilkel:{duvarPasi:0.7,ucuncuAdam:0.7,derinKosu:1.4,geriCevirme:0.9},baglilik:0.8,
    takim:{kisaPay:0.12,presYuksek:0.3,blokCizgi:-5,bekIceri:0,kaleciArti:0.1,uzunHedef:0.9,ikinciTop:0.9}}
};
const TARZ_ALAN=['kisaPay','presYuksek','blokCizgi','bekIceri','kaleciArti','uzunHedef','ikinciTop'];
/* takımın tarz harmanı: {arketip: pay} (paylar 1'e bölünür); kadro verisinde yoksa dengeli */
function tarzKur(m,t){
  const k=m.kadro&&m.kadro[t]&&m.kadro[t].taktik&&m.kadro[t].taktik.tarz;
  let H={dengeli:1};
  if(typeof k==='string'&&TARZ_ARKETIP[k])H={[k]:1};
  else if(k&&typeof k==='object'){const h={};let s=0;for(const a in k)if(TARZ_ARKETIP[a]&&k[a]>0){h[a]=+k[a];s+=h[a];}if(s>0){for(const a in h)h[a]/=s;H=h;}}
  const ilkel={},o={harman:H,ilkel,baglilik:0,takim:null};let tp=0;const tk={};
  for(const a in H){const A=TARZ_ARKETIP[a];for(const i in A.ilkel)ilkel[i]=(ilkel[i]||0)+H[a]*A.ilkel[i];o.baglilik+=H[a]*A.baglilik;
    if(A.takim){tp+=H[a];for(const k of TARZ_ALAN)tk[k]=(tk[k]||0)+H[a]*A.takim[k];}}
  if(tp>0){for(const k of TARZ_ALAN)tk[k]/=tp;o.takim=tk;}   /* Z3: takım vektörü (dengeli payı vektörsüz: tarzsız takımın eski taktiği) */
  return o;}
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
