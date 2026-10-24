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
   Öbür maçların kaydı kısadır (kayıt boyu; sezonda ~210 maç): sutlar null (beklenen gol xg'de), degisiklikler boş.
   G1-a (2026-10-24, kullanıcı kararı 43: kadro yeterliliği; TEST kuralı): maç günü 11 uygun oyuncu (js/mac-girdi.js oyuncuUygunMu) çıkaramayan
   taraf maçı HUKMEN_SKOR farkla hükmen kaybeder; iki taraf da çıkaramazsa 0–0 (TEST sınırı). Hükmen maçta motor oynamaz:
     kulupHazirMi(k, kulüp, tarih) · hukmenKarari(k, f) → null | {skor, neden:'ev'|'konuk'|'cift'} (neden: hükmen kaybeden taraf)
     hukmenSonucu(h) → sonucKaydi biçiminde düz sonuç (atansız goller, boş listeler, varsayılan istatistik; js/mac-sonuc.js macKaydiYaz kabul eder ve
       kararı yeniden hesaplayıp karşılaştırır)
     digerMacPlani(k, f) → {macId, ev, konuk, tohum, secenek} ya da {macId, ev, konuk, tohum, hukmen} (tarayıcıdaki LIG_CANLI ve sezon-deneme) */
'use strict';
function haftaninDigerMaclari(k,macId){
  const f=(k.fikstur||[]).find(x=>x.id===macId);if(!f)return[];
  return k.fikstur.filter(x=>x.hafta===f.hafta&&x.id!==macId&&!(k.maclar||{})[x.id]);
}
const HUKMEN_SKOR=3;
const kulupHazirMi=(k,kulupId,tarih)=>kulupOyunculari(k,kulupId).filter(p=>oyuncuUygunMu(p,tarih)).length>=11;
function hukmenKarari(k,f){
  const e=kulupHazirMi(k,f.ev,f.tarih),c=kulupHazirMi(k,f.konuk,f.tarih);
  if(e&&c)return null;
  return!e&&!c?{skor:[0,0],neden:'cift'}:!e?{skor:[0,HUKMEN_SKOR],neden:'ev'}:{skor:[HUKMEN_SKOR,0],neden:'konuk'};
}
function hukmenSonucu(h){
  const goller=[],z=()=>[0,0];
  for(const t of [0,1])for(let i=0;i<h.skor[t];i++)goller.push({ad:'',no:0,takim:t,kendiKalesine:false,dakika:0});
  return{skor:h.skor.slice(),bitti:true,goller,kartlar:[],sakatliklar:[],degisiklikler:[],sutlar:[],ilk11:null,hukmen:h.neden,
    ist:{sut:z(),isabet:z(),korner:z(),faul:z(),sari:z(),kirmizi:z(),ofsayt:z(),sahiplik:[0.5,0.5],pas:z(),pasTamam:z(),uzunPas:z()}};
}
function digerMacPlani(k,f){
  const h=hukmenKarari(k,f),tohum=macTohumu(k.dunyaTohumu,f.id),A={macId:f.id,ev:f.ev,konuk:f.konuk,tohum};
  return h?Object.assign(A,{hukmen:h}):Object.assign(A,{secenek:digerMacSecenegi(k,f)});
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
