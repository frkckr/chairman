/* ============ Chairman — ligin öbür maçları: haftanın maçları, görüntüsüz maç seçeneği ve haftanın sonuçları (çizim yok; F7, 2026-10-24) ============
   Yol haritası 3.8; sıra kullanıcı kararı (2026-10-24, karar 39). Bizim maçımız sürerken haftanın öbür maçları aynı sayfada görüntüsüz ve kilit adımla
   oynanır (js/mac-sahnesi.js LIG_CANLI: bizim santramızdan sonra bizim motorun her adımında birer adım; duraklatma ve telefon onları da durdurur).
   Bu dosya saf kuraldır, Node'da da yüklenir (araclar/kariyer-deneme.js, araclar/sezon-deneme.js):
     haftaninDigerMaclari(k, macId) → bizim maçla aynı haftanın öbür, oynanmamış fikstür kayıtları
     digerMacSecenegi(k, f) → Match seçeneği {kadro:[ev, konuk] (hocaların seçimi, macKadrosu), tohum (macTohumu), tunel:{x:0,z:-6}, tarz:[ev, konuk]}.
       Stat alanı yoktur: tarayıcıdaki öbür maç Node'daki sezon-deneme maçıyla birebir aynıdır (zemin kuru, atmosfer yok, kulübe varsayılan: TEST sınırı).
       Santrayı ilk adımda alır (macaGec; görüntüsüz maçın maç öncesi yoktur).
     haftaSonuclariUygula(k, macId, sonuc, tohum, ek, digerleri) — maç sayfasının "Odaya dön" komutu: önce öbür maçlar (macKaydiYaz, kısa kayıt),
       sonra bizim maç (macSonucuUygula: zaman 21:00, sıradaki hafta), en sonda haftanın kulüplerinin dönüşü gelmiş sakatlıkları temizlenir.
       digerleri [{macId, sonuc, tohum}] haftanın bütün öbür maçlarıdır (eksik ya da fazla → red). Biri reddedilirse komut düşer, hiçbiri yazılmaz.
   Öbür maçların kaydı kısadır (kayıt boyu; sezonda ~210 maç): sutlar null (beklenen gol xg'de), degisiklikler boş. */
'use strict';
function haftaninDigerMaclari(k,macId){
  const f=(k.fikstur||[]).find(x=>x.id===macId);if(!f)return[];
  return k.fikstur.filter(x=>x.hafta===f.hafta&&x.id!==macId&&!(k.maclar||{})[x.id]);
}
function digerMacSecenegi(k,f){
  const tohum=macTohumu(k.dunyaTohumu,f.id),kadro=[macKadrosu(k,f.ev,f.tarih,tohum),macKadrosu(k,f.konuk,f.tarih,tohum)];
  return{kadro,tohum,tunel:{x:0,z:-6},tarz:[f.ev,f.konuk].map(id=>kulupHocasi(k,id).hoca.tarz)};
}
function haftaSonuclariUygula(k,macId,sonuc,tohum,ek,digerleri){
  const f=(k.fikstur||[]).find(x=>x.id===macId);
  if(!f)throw new Error(`Haftanın sonuçları işlenemedi: fikstürde ${macId} yok`);
  const beklenen=haftaninDigerMaclari(k,macId).map(x=>x.id).sort(),gelen=(digerleri||[]).map(x=>x.macId).sort();
  if(JSON.stringify(beklenen)!==JSON.stringify(gelen))throw new Error(`Haftanın sonuçları işlenemedi: öbür maçlar eksik ya da fazla (${gelen.length}/${beklenen.length})`);
  for(const d of digerleri)macKaydiYaz(k,k.fikstur.find(x=>x.id===d.macId),d.sonuc,d.tohum,{},true);
  const r=macSonucuUygula(k,macId,sonuc,tohum,ek);
  const temiz={};
  for(const x of k.fikstur)if(x.hafta===f.hafta)for(const c of [x.ev,x.konuk])for(const p of kulupOyunculari(k,c))if(p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)<=0)temiz[p.id]=Object.assign({},p,{sakat:null});
  if(Object.keys(temiz).length)k.oyuncular=Object.assign({},k.oyuncular,temiz);
  return Object.assign(r,{digerleri:digerleri.length});
}
