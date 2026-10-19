/* ============ Chairman — maç motoru: hoca tarzı (Z1 iskeleti, 2026-10-19; FUTBOL_KUTUPHANESI §7, §12.1; kutuphane/G-hoca-tarzlari.md) ============
   Yalnız veri ve saf işlev; çizim yok, rastlantı çekmez. Tarz = ilkellerin ağırlıkları + takımın düzeni + bağlılık katsayısı + ısrar (FUTBOL_KUTUPHANESI
   §1 madde 4). Z1'de iskelettir: MOTOR_AYAR.planTarz 0 iken bütün ağırlıklar 1 (iki takım aynı "dengeli" tarzla oynar). Z3'te iki canlı arketip (kısa
   kuran ↔ uzun atan; yüksek pres ↔ orta blok), Z7'de on arketip, kenar avantajları, ısrar ve hocanın gizli becerisi gelir; kadro.taktik'in
   (VARSAYILAN_TAKTIK: sakin, tempo, direkt, risk, pres …) tarz içine taşınması o turların işidir.
   Arketip tablosu Ek B-2'den (kutuphane/B-ilerletme.md; çarpanlar 0,5–2,0, tahmin): konumsal (Guardiola/Lillo), ilişkisel (Diniz), dikey/geçiş (Klopp tipi),
   kanat-orta (klasik 4-4-2). Ağırlık w = 1 + planTarz · (W − 1); takımın tarzı kadro.taktik.tarz (arketip adı ya da {ad: pay} harmanı) ya da 'dengeli'.
   Kullanım: tarzAgirlik(m, takım, ilkel) — plan katmanı (js/mac-plan.js) önerinin oranında ve plan payında çarpan olarak okur; tarzBaglilik(m, takım)
   planın bağlılık süresine katsayı. m.tarz[t] Match kurulurken değil, ilk okumada tembel kurulur (plan 0 iken hiç kurulmaz). */
'use strict';
const TARZ_ARKETIP={
  dengeli:  {ad:'dengeli',ilkel:{duvarPasi:1,ucuncuAdam:1,derinKosu:1,geriCevirme:1},baglilik:1},
  konumsal: {ad:'konumsal oyun',ilkel:{duvarPasi:1.0,ucuncuAdam:1.8,derinKosu:1.0,geriCevirme:1.8},baglilik:1.6},
  iliskisel:{ad:'ilişkisel oyun',ilkel:{duvarPasi:2.0,ucuncuAdam:1.5,derinKosu:0.8,geriCevirme:1.2},baglilik:0.7},
  dikey:    {ad:'dikey / geçiş',ilkel:{duvarPasi:1.2,ucuncuAdam:1.0,derinKosu:2.0,geriCevirme:1.2},baglilik:0.7},
  kanatOrta:{ad:'kanat ve orta',ilkel:{duvarPasi:0.8,ucuncuAdam:0.8,derinKosu:1.2,geriCevirme:1.0},baglilik:1.1}
};
/* takımın tarz harmanı: {arketip: pay} (paylar 1'e bölünür); kadro verisinde yoksa dengeli */
function tarzKur(m,t){
  const k=m.kadro&&m.kadro[t]&&m.kadro[t].taktik&&m.kadro[t].taktik.tarz;
  let H={dengeli:1};
  if(typeof k==='string'&&TARZ_ARKETIP[k])H={[k]:1};
  else if(k&&typeof k==='object'){const h={};let s=0;for(const a in k)if(TARZ_ARKETIP[a]&&k[a]>0){h[a]=+k[a];s+=h[a];}if(s>0){for(const a in h)h[a]/=s;H=h;}}
  const ilkel={},o={harman:H,ilkel,baglilik:0};
  for(const a in H){const A=TARZ_ARKETIP[a];for(const i in A.ilkel)ilkel[i]=(ilkel[i]||0)+H[a]*A.ilkel[i];o.baglilik+=H[a]*A.baglilik;}
  return o;}
/* ilkelin tarz ağırlığı (saf; planTarz 0 iken 1) */
function tarzAgirlik(m,t,ilkel){
  const e=MOTOR_AYAR.planTarz;if(!e)return 1;
  const T=m.tarz||(m.tarz=[tarzKur(m,0),tarzKur(m,1)]),W=T[t].ilkel[ilkel];
  return W==null?1:1+e*(W-1);}
/* bağlılık süresinin katsayısı (saf; planTarz 0 iken 1) */
function tarzBaglilik(m,t){
  const e=MOTOR_AYAR.planTarz;if(!e)return 1;
  const T=m.tarz||(m.tarz=[tarzKur(m,0),tarzKur(m,1)]);return 1+e*(T[t].baglilik-1);}
