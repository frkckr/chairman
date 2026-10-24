/* ============ Chairman — kulübün düzenli parası: ay başı, maç günü geliri ve nakit ufku (çizim yok; G2-b, 2026-10-24; YOL_HARITASI 4.1, 5.5, karar 44) ============
   OYUN_TASARIMI §7: nakit, dönem bütçesi ve ileri tarihteki yükümlülükler aynı değer değildir; belirsiz gelir kesin para sayılmaz.
   Ay başı (takvimde 'ayBasi' işi, görünür rutin iş; ayın 1'i MALI_TEST.saat): (1) sözleşmesi olmayanlara TEST sözleşme (js/sozlesme.js),
     (2) 22'nin altına düşen kadrolar gençlerle tamamlanır (js/kariyer-kadro.js kadroTamamla; satış, ayrılış ve sürüm 8 kayıtlar),
     (3) başkanın kulübü maaşları öder (kalem 'maas') ve lig yayın payını alır ('ligPayi'), (4) transfer takvimi onarılır (js/transfer.js),
     (5) sonraki ayın işi kurulur — sezon sonu kaydı varsa kurulmaz (yeni sezon bu sürümde yok; takvim durur).
   Maç günü geliri: başkanın kulübünün iç saha maçından sonra bilet ('bilet') = seyirci × MALI_TEST.bilet; seyirci = stat kapasitesi
     (js/stadyum-tarifleri.js statKapasitesi) × doluluk (macDolulugu; maç sayfasının çizdiği seyirciyle aynı formül). Hükmen maçta gelir yok.
   Öbür kulüplerin parası simüle edilmez (TEST sınırı): sözleşmeleri vardır, kasaları 0'dır.
   nakitUfku(k, kulüp, gün) → {nakit, kesin:{enDusuk, enDusukTarih, son}, belirsizGelir, adimlar}: bekleyen ödemeler ve gelecek ay başları (maaş ve lig
     payı: kesin), iç saha maçlarının bilet geliri (belirsiz, ayrı). maliDurum'a 'ufuk' ve 'eksi' (kasa eksiye düştü; yalnız işaret) eklenir. */
'use strict';
const MALI_TEST={saat:600,ligPayi:10000000,bilet:15000,ufukGun:90,evDoluluk:0.3};
const AY_ADLARI=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const sonrakiAyBasi=tarih=>{const [y,a]=tarih.split('-').map(Number),Y=a===12?y+1:y,A=a===12?1:a+1;return`${Y}-${String(A).padStart(2,'0')}-01`;};
/* maçın doluluğu (TEST; js/mac-gunu.js statKur da bunu kullanır: çizilen seyirci = ödeyen seyirci): başkanın kulübünün statında sabit, öbür statlarda
   kulüp ve haftadan */
const dolulukTest=(ev,biz,hafta)=>ev===biz?MALI_TEST.evDoluluk:+(0.22+0.13*h2(hafta|0,parseInt(saglamaHesapla('doluluk:'+ev),16)|0)).toFixed(2);
const macDolulugu=(k,f)=>dolulukTest(f.ev,(k.kisiler[k.baskanId]||{}).kulupId,f.hafta);
const kulupKapasitesi=(k,kulupId)=>statKapasitesi(kulupId===(k.kisiler[k.baskanId]||{}).kulupId?STADYUMLAR.kulup:statTarifiUret(kulupId,k.kulupler[kulupId].ad));
function macBiletGeliri(k,f){const seyirci=Math.round(kulupKapasitesi(k,f.ev)*macDolulugu(k,f));return{seyirci,tutar:seyirci*MALI_TEST.bilet};}

IS_TURLERI.ayBasi={
  denetle:(k,v)=>v&&k.kulupler&&k.kulupler[v.kulupId]?[]:['ay başı: kulüp bulunamadı'],
  baslik:(k,is)=>`Ay başı: maaşlar ve lig payı`,
  uygula:(k,is)=>{
    const id=is.veri.kulupId,[,a]=is.tarih.split('-').map(Number),ay=AY_ADLARI[a-1];
    for(const c of Object.keys(k.kulupler))if(k.kulupler[c].kadro&&kulupOyunculari(k,c).length<KADRO_HEDEF)kadroTamamla(k,c,KADRO_HEDEF,'ay:'+is.tarih);
    sozlesmeleriTamamla(k);
    const maas=aylikMaas(k,id),n=kulupOyunculari(k,id).filter(p=>p.sozlesme).length;
    paraHareketi(k,{kulupId:id,tutar:-maas,kalem:'maas',aciklama:`${ay} maaşları (${n} oyuncu ve hoca)`});
    paraHareketi(k,{kulupId:id,tutar:MALI_TEST.ligPayi,kalem:'ligPayi',aciklama:`${ay} lig yayın payı`});
    if(typeof transferTakvimiKur==='function')transferTakvimiKur(k);
    if(!(k.sezon&&k.sezon.sonuc))isEkle(k,{tur:'ayBasi',tarih:sonrakiAyBasi(is.tarih),dakika:MALI_TEST.saat,veri:{kulupId:id}});
    return{metin:`${ay} maaşları ödendi (${paraYazi(maas)}); lig payı geldi (${paraYazi(MALI_TEST.ligPayi)}).`};
  }
};
/* yeni kariyerin ilk ay başı (js/baslangic.js); ayın 1'i ay başı saatinden önceyse o günün */
const ayBasiKur=(k,kulupId)=>isEkle(k,{tur:'ayBasi',tarih:/-01$/.test(k.tarih)&&k.gunIciDakika<MALI_TEST.saat?k.tarih:sonrakiAyBasi(k.tarih),dakika:MALI_TEST.saat,veri:{kulupId}});

/* maç günü geliri: başkanın kulübünün iç saha maçı (hükmen değil) */
MAC_SONUCU_EKLERI.push((k,f)=>{
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,s=k.maclar[f.id];
  if(!biz||f.ev!==biz||!s||s.hukmen)return;
  const B=macBiletGeliri(k,f),rakip=(k.kulupler[f.konuk]||{ad:f.konuk}).ad;
  paraHareketi(k,{kulupId:biz,tutar:B.tutar,kalem:'bilet',aciklama:`${rakip} maçı bilet geliri (${B.seyirci.toLocaleString('tr-TR')} seyirci)`});
});

function nakitUfku(k,kulupId,gun){
  gun=gun||MALI_TEST.ufukGun;
  const simdi=simdikiAn(k),sinir=simdi+gun*1440,A=[];
  for(const is of Object.values(k.isler)){
    const an=anDakika(is.tarih,is.dakika);if(an>sinir)continue;
    if(is.tur==='odeme'&&is.veri.kulupId===kulupId)A.push({an,tarih:is.tarih,tutar:is.veri.tutar,kesin:true,neden:is.veri.aciklama});
  }
  /* ay başları: bekleyen ilk ay başı ve ardından gelenler (bugünkü sözleşmelerle). Zincir ay başı kuralını izler: sezon sonu kaydından sonra yeni ay
     başı kurulmaz, yani son maçtan sonraki ilk ay başı sonuncudur (G2 incelemesi; yeni sezon 5.1'de gelince bu sınır da değişir) */
  const ab=Object.values(k.isler).filter(x=>x.tur==='ayBasi'&&x.veri.kulupId===kulupId).sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika))[0];
  if(ab){const net=MALI_TEST.ligPayi-aylikMaas(k,kulupId,true);let t=ab.tarih;   /* sözleşmesi henüz kurulmamış oyuncu ilk ay başının TEST maaşıyla */
    const sonMac=(k.fikstur||[]).reduce((m,f)=>Math.max(m,anDakika(f.tarih,f.dakika)),-Infinity);
    for(let i=0;i<24&&anDakika(t,ab.dakika)<=sinir;i++){A.push({an:anDakika(t,ab.dakika),tarih:t,tutar:net,kesin:true,neden:'ay başı (maaş ve lig payı)'});
      if((k.sezon&&k.sezon.sonuc)||anDakika(t,ab.dakika)>sonMac)break;t=sonrakiAyBasi(t);}}
  /* iç saha maçlarının bileti: belirsiz gelir */
  let belirsiz=0;
  for(const f of k.fikstur||[])if(f.ev===kulupId&&!(k.maclar||{})[f.id]&&f.hafta>=k.sezon.ilkHafta){const an=anDakika(f.tarih,f.dakika);
    if(an>=simdi&&an<=sinir){const B=macBiletGeliri(k,f);belirsiz+=B.tutar;A.push({an,tarih:f.tarih,tutar:B.tutar,kesin:false,neden:'bilet (tahmin)'});}}
  A.sort((a,b)=>a.an-b.an);
  let b=k.kulupler[kulupId].nakit,en=b,enT=k.tarih;
  for(const x of A)if(x.kesin){b+=x.tutar;if(b<en){en=b;enT=x.tarih;}}
  return{nakit:k.kulupler[kulupId].nakit,kesin:{enDusuk:en,enDusukTarih:enT,son:b},belirsizGelir:belirsiz,adimlar:A};
}
