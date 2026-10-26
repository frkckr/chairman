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
     digerMacPlani(k, f) → {macId, ev, konuk, tohum, secenek} ya da {macId, ev, konuk, tohum, hukmen} (tarayıcıdaki LIG_CANLI ve sezon-deneme)
   G1-e (2026-10-24, kullanıcı isteği: "Maçı bitir" doğrudan sonuca): maçı arkada (Web Worker, js/mac-isci.js; tarayıcı düzeni js/mac-arka.js)
   baştan sonuna oynatan saf parçalar. Motorun sonucu yalnız seçenek, tohum ve dışarıdan verilen tarz komutlarıyla belirlenir; sunum motora yazmaz:
     arkaMacOynat(Match, secenek, {oncesi, komutlar}) → {son: sonucKaydi, ornekler, adim}. oncesi false: santrayı ilk adımda alır (macaGec; öbür
       maçlar, kilit adımla aynı); true: maç öncesi doğal adımlanır (bizim maçın sonuç ikizi; canlı motor da macaGec almaz). komutlar
       [{t, hedef, kare}]: js/mac-tarz.js tarzDegistir baştan kurulur (komut kendi karesinde devreye girer; öncesinde motoru değiştirmez).
     ornekler: ARKA_ORNEK_KARE'de bir {kare, skor, dk, faz, n, ist} ve son durum (Canlı Skor; arkaMacDurum ile karesine göre okunur; H2-b:
       arkaMacAnlik(son, örnek) o anın olaylarını ve istatistiğini verir).
     arkaDosyalari(betik listesi) → worker'ın yükleyeceği dosyalar: ortak, kadrolar ve lig + index.html'de js/mac-motoru.js'ten js/goruntu.js'e
       kadarki motor dosyaları + bu dosya. Node'da (araclar/kariyer-deneme.js 3.8) yalnız bu listeyle kurulan bağlamın sonucu tam bağlamınkiyle aynıdır. */
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
const ARKA_ORNEK_KARE=300;   // Canlı Skor örneği: 5 motor sn'de bir
/* H2-b (2026-10-26): örnek tek sonucKaydi() çağrısıyla genişler — n: [goller, kartlar, sutlar, sakatliklar] uzunlukları, ist: o anın istatistiği.
   Motorun kayıt listeleri yalnız eklenir (araclar/kariyer-deneme.js 3.8b bunu kilitler): örneğin anındaki olaylar bitmiş kaydın önekidir */
const macOrnek=m=>{const S=m.sonucKaydi();return{kare:m.kare||0,skor:S.skor,dk:m.minuteLabel(),faz:m.phase,n:[S.goller.length,S.kartlar.length,S.sutlar.length,S.sakatliklar.length],ist:S.ist};};
/* H2-b: işçinin bitmiş kaydının (son) o örneğe kadarki hâli, sonucKaydi biçiminde (Canlı Skor'un ayrıntısı; saf). Dakikayla süzülmez: ilk yarı
   uzatmasındaki gol ile ikinci yarının başı aynı 46. dakikayı taşır. Beklenen gol ana iplikte önekten (macBeklenenGol işçide yüklü değil) */
function arkaMacAnlik(son,o){
  if(!son||!o)return null;const n=o.n||[0,0,0,0];
  return{skor:o.skor.slice(),bitti:o.faz==='fulltime',goller:son.goller.slice(0,n[0]),kartlar:son.kartlar.slice(0,n[1]),sutlar:son.sutlar.slice(0,n[2]),
    sakatliklar:son.sakatliklar.slice(0,n[3]),ist:o.ist};
}
function arkaMacOynat(MatchSinifi,secenek,o){
  o=o||{};const m=new MatchSinifi(()=>{},secenek);
  if(!o.oncesi)m.macaGec();
  for(const c of o.komutlar||[])tarzDegistir(m,c.t,c.hedef,c.kare);
  const ornekler=[macOrnek(m)],sinir=o.sinir||60*60*90;let n=0;
  while(m.phase!=='fulltime'&&n<sinir){m.step(1/60);n++;if((m.kare||0)%ARKA_ORNEK_KARE===0)ornekler.push(macOrnek(m));}
  ornekler.push(macOrnek(m));
  return{son:m.sonucKaydi(),ornekler,adim:n,bitti:m.phase==='fulltime'};
}
/* örneklerden karenin durumu (o kareye kadarki son örnek) ya da null */
function arkaMacDurum(ornekler,kare){
  let a=0,b=(ornekler||[]).length-1,r=null;
  while(a<=b){const c=(a+b)>>1;if(ornekler[c].kare<=kare){r=ornekler[c];a=c+1;}else b=c-1;}
  return r;
}
function arkaDosyalari(liste){
  const L=liste.map(s=>String(s).replace(/^.*?(js\/[^?#]+).*$/,'$1')),i=L.indexOf('js/mac-motoru.js'),j=L.indexOf('js/goruntu.js');
  if(i<0||j<i)throw new Error('Arka dosyalar: motor dosyaları bulunamadı');
  return['js/ortak.js','js/kadrolar.js','js/lig.js'].concat(L.slice(i,j),['js/lig-maclari.js']);
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
