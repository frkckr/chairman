/* ============ Chairman — olay paketi: gazetenin sorusu ve Cuma gazetesi (çizim yok; yol haritası 2.6, 2.8) ============
   Yerel gazete ancak gerçekten haber değeri olan, yaşanmış bir sonuç varsa sorar; sakin haftada soru gelmez.
   Dış gelişme 'basinSorusu' (veri {kulupId}): konu o günkü kayıtlardan seçilir (basinKonusu): geciken maaş, sponsora verilen pano hakkı,
     kabul edilen destek, ertelenen bakım. Konu yoksa paket açılmaz.
   Karar 'basinSorusu' (saati serbest zorunlu; son cevap gazetenin baskı saati): kendin açıkla · basın sözcüsüne bırak · cevap verme.
     Sözcünün açıklaması ekip görevidir ('basinAciklamasi'); tonu iletişim katkısına göre değişir. Sözcü rutin açıklama yapar, başkan adına söz veremez.
     Tavsiye: basın sözcüsü.
   Dış gelişme 'gazete' (Cuma sabahı): manşet o haftanın kayıtlı olayından ve verilen cevaptan seçilir (k.haberler, js/soz.js); yeni sorun icat etmez.
     Soru sorulmadıysa maç önü haberi çıkar. Manşetin ölçülebilir bir etkisi yoktur; kayıt ve görünür izdir (taraftar/medya tepkisinin ilk örneği).
   Metinler ve saatler TEST verisidir. */
const BASKI_SAATI=1110;                     // gazetenin baskıya girdiği saat, 18:30 (TEST değeri)
const SOZCU_SURESI=60;                      // sözcünün açıklamayı yapması için geçen dakika (TEST değeri)
const BASIN_KONULARI=['maas','pano','destek','bakim'];
const BASIN_TAVIRLARI=['baskan','sozcuIyi','sozcuKuru','sozcuGaf','sessiz'];

/* o günkü kayıtlardan haber değeri olan ilk konu (kariyeri değiştirmez): {konu, olayId} ya da null */
function basinKonusu(k){
  const odeme=Object.values(k.olaylar).find(o=>o.paket==='odemeSikismasi'&&o.durum!=='onlendi'),destek=Object.values(k.olaylar).find(o=>o.paket==='kosulluDestek');
  if(odeme&&odeme.sonuc.maasGecikti)return{konu:'maas',olayId:odeme.id};
  if(odeme&&odeme.sonuc.hak==='panoGelecekSezon')return{konu:'pano',olayId:odeme.id};
  if(destek&&destek.sonuc.cozum==='kabul')return{konu:'destek',olayId:destek.id};
  if(k.gecmis.some(g=>g.tur==='iptal'&&g.neden==='Bakım taksiti ertelendi'))return{konu:'bakim',olayId:odeme?odeme.id:null};
  return null;
}
const BASIN_SORULARI={
  maas:'Maaşların bu ay gününde ödenmeyeceğini duymuşlar; doğru mu, neden?',
  pano:'Forma sponsoruna gelecek sezon için stat içinde pano sözü verildiğini duymuşlar; karşılığında ne alındı?',
  destek:'Bir kulüp üyesinin firmasından pano karşılığı destek alındığını duymuşlar; koşulları ne?',
  bakim:'Tribün çatısındaki onarımın ertelendiğini duymuşlar; tribün güvenli mi, neden ertelendi?'
};
const MANSETLER={
  maas:{baskan:'Başkan Demirel açıkladı: “Maaşlar gecikti, günü belli; sponsor ödemesi gelir gelmez yatacak.”',sozcuIyi:'Demirkapı\'da maaşlar gecikiyor; kulüp ödeme gününü açıkladı.',
    sozcuKuru:'Demirkapı\'da maaşlar gecikti. Kulüpten kısa açıklama: “Ödenecek.”',sozcuGaf:'Demirkapı\'da maaş krizi: sözcü “kasada para yok” dedi, sonra düzeltti.',sessiz:'Demirkapı\'da maaşlar yatmadı; kulüp sorularımızı cevapsız bıraktı.'},
  pano:{baskan:'Başkan Demirel: “Sponsor taksiti gününde ödedi; gelecek sezon bir pano onların.”',sozcuIyi:'Demirkapı sponsoruyla anlaştı: taksit ödendi, karşılığı gelecek sezon bir pano.',
    sozcuKuru:'Demirkapı sponsoruna pano hakkı verdi. Kulüp ayrıntı vermedi.',sozcuGaf:'Sponsora pano sözü: sözcü anlaşmanın bedelini söyleyemedi.',sessiz:'Sponsora pano sözü verildi iddiası; kulüp sessiz.'},
  destek:{baskan:'Başkan Demirel: “Kulüp üyemizin desteği açık koşullarla alındı; karşılığı iki sezon bir pano.”',sozcuIyi:'Demirkapı\'ya üyesinden destek: koşullar açıklandı.',
    sozcuKuru:'Demirkapı bir üyesinden destek aldı. Kulüp: “Usulüne uygun.”',sozcuGaf:'Destek karşılığı pano: sözcü “kim verirse onun adı asılır” dedi.',sessiz:'Kulüp üyesinden pano karşılığı para: Demirkapı yönetimi konuşmuyor.'},
  bakim:{baskan:'Başkan Demirel: “Çatı onarımı Ocak\'a kaldı; tribün güvenli, takvimi müteahhitle yazdık.”',sozcuIyi:'Tribün çatısının onarımı Ocak\'a ertelendi; kulüp takvimi açıkladı.',
    sozcuKuru:'Tribün çatısı onarımı ertelendi. Kulüp: “Planlı bir erteleme.”',sozcuGaf:'Çatı onarımı ertelendi: sözcü nedenini açıklayamadı.',sessiz:'Tribün çatısı onarımı ertelendi; kulüpten açıklama yok.'}
};
Object.assign(MESELE_OLAYLARI,{
  'basin.soru':(k,p)=>`Demirkapı Postası aradı. ${BASIN_SORULARI[p.konu]}`,
  'basin.baskan':()=>'Gazeteciyle kendin konuştun; olanı ve takvimi anlattın.',
  'basin.devir':(k,p)=>`Açıklamayı ${kisiAdi(k,p.kisiId)} yapacak; bir saat içinde gazeteyle konuşur.`,
  'basin.sozcuIyi':(k,p)=>`${kisiAdi(k,p.kisiId)} gazeteyle konuştu: olanı sade anlattı, soruları cevapladı.`,
  'basin.sozcuKuru':(k,p)=>`${kisiAdi(k,p.kisiId)} gazeteye kısa bir açıklama gönderdi; ayrıntıya girmedi.`,
  'basin.sozcuGaf':(k,p)=>`${kisiAdi(k,p.kisiId)} gazeteyle konuşurken ölçüyü kaçırdı; söylediğini sonradan düzeltmeye çalıştı.`,
  'basin.sessiz':()=>'Gazeteye cevap vermedin.',
  'basin.kanit.soru':(k,p)=>BASIN_SORULARI[p.konu],
  'basin.tavsiye.net':()=>'Görüşü: kendin açıklarsan haber yumuşar, çünkü günü ve nedeni senden duyarlar. Susarsak kendi bildiklerini yazarlar.',
  'basin.tavsiye.genel':()=>'Görüşü: bir açıklama yapılmalı; kimin yapacağı sana kalmış.',
  'basin.tavsiye.emin':()=>'Görüşü: ne derlerse desinler, bence cevap vermeyelim — ama emin değilim.',
  'gazete.maas':(k,p)=>MANSETLER.maas[p.tavir],'gazete.pano':(k,p)=>MANSETLER.pano[p.tavir],'gazete.destek':(k,p)=>MANSETLER.destek[p.tavir],'gazete.bakim':(k,p)=>MANSETLER.bakim[p.tavir],
  'gazete.macOnu':()=>'Demirkapı, Akdeniz\'i ağırlıyor: Şükrü Hoca “Kanatlardan gideceğiz” dedi.'
});

GELISMELER.basinSorusu={
  denetle:(k,v)=>(k.kulupler||{})[v.kulupId]?[]:[`kulüp bulunamadı (${v.kulupId})`],
  uygula:(k,is)=>{
    const olay=paketDene(k,'basinSorusu','basin:hafta',is.veri);
    return olay?{bilgi:MESELE_OLAYLARI['basin.soru'](k,olay.kosullar),dur:true}:{bilgi:null};
  }
};
PAKETLER.basinSorusu={
  surum:1,icerik:2,
  degerlendir:k=>basinKonusu(k)&&k.gunIciDakika<BASKI_SAATI-30?'soru':null,
  ac:(k,olay,b)=>{
    const K=basinKonusu(k),sozcu=koltuktaki(k,b.kulupId,'basin');
    olay.kosullar={konu:K.konu,kaynakOlay:K.olayId};
    const id=meseleAc(k,{tur:'basinSorusu',baslik:'Demirkapı Postası soruyor',sorumluId:k.baskanId,kisiler:sozcu?[sozcu.id]:[]});
    olay.meseleId=id;
    meseleOlay(k,id,'basin.soru',{konu:K.konu});
    olayBilgi(k,olay.id,'basin.kanit.soru',{konu:K.konu},'gazete');
    isEkle(k,{tur:'ajanda',tarih:k.tarih,dakika:BASKI_SAATI,veri:{baslik:'Gazetenin sorusu',zorunluluk:'zorunlu',sure:15,saatsiz:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika},
      karar:'basinSorusu',kulupId:b.kulupId,meseleId:id,olayId:olay.id,
      aciklama:`Demirkapı Postası yarınki sayı için soruyor: ${BASIN_SORULARI[K.konu]} Gazete ${saatYazi(BASKI_SAATI)}'da baskıya giriyor.`}});
  }
};
KARAR_TURLERI.basinSorusu={
  denetle:(k,v)=>{const h=[];if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);if(typeof v.meseleId!=='string')h.push('soru bir meseleye bağlı değil');if(!(k.olaylar||{})[v.olayId])h.push(`olay bulunamadı (${v.olayId})`);return h;},
  tavsiye:{koltuk:'basin',gorus:(k,is,kisi)=>{const i=katki(kisi,'iletisim');return{anahtar:i==='guclu'?'basin.tavsiye.net':i==='orta'?'basin.tavsiye.genel':'basin.tavsiye.emin',p:{}};}},
  secenekler:(k,is)=>{
    const v=is.veri,s=koltuktaki(k,v.kulupId,'basin');
    return[
      {id:'kendin',metin:'Kendin açıkla',sure:30,engel:null,aciklama:['30 dakika sürer. Olanı ve takvimi senden duyarlar.']},
      {id:'devret',metin:s?`Basın sözcüsüne (${s.ad}) bırak`:'Basın sözcüsüne bırak',sure:15,
        engel:!s?'Basın sözcüsü koltuğu boş':kisiMesgul(k,s.id)?`${s.ad} şu an başka bir işte`:simdikiAn(k)+15+SOZCU_SURESI>=isAn(is)?'Açıklama baskıya yetişmez':null,
        aciklama:['15 dakikalık bilgilendirme; açıklamayı sözcü yapar.','Sözcünün yetkisi: '+YONETIM_KOLTUKLARI.basin.yetki]},
      {id:'sessiz',metin:'Cevap verme',sure:0,engel:null,aciklama:['Zaman almaz. Gazete elindekiyle yazar.']}
    ];
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,olay=k.olaylar[v.olayId];
    if(secim==='devret'){
      const s=koltuktaki(k,v.kulupId,'basin'),t=anTarih(simdikiAn(k)+15+SOZCU_SURESI),m=k.meseleler[v.meseleId];
      isEkle(k,{tur:'ekip',tarih:t.tarih,dakika:t.dakika,veri:{meseleId:v.meseleId,kisiId:s.id,kulupId:v.kulupId,koltuk:'basin',gorev:'basinAciklamasi',olayId:olay.id}});
      if(!m.kisiler.includes(s.id))m.kisiler.push(s.id);
      return{bilgi:meseleOlay(k,v.meseleId,'basin.devir',{kisiId:s.id})};
    }
    olay.sonuc.basin=secim==='kendin'?'baskan':'sessiz';
    return{bilgi:meseleOlay(k,v.meseleId,secim==='kendin'?'basin.baskan':'basin.sessiz')};
  }
};
EKIP_GOREVLERI.basinAciklamasi={
  denetle:(k,v)=>(k.olaylar||{})[v.olayId]?[]:[`olay bulunamadı (${v.olayId})`],
  bekleme:(k,is)=>`${kisiAdi(k,is.veri.kisiId)} gazeteyle konuşacak`,
  uygula:(k,is)=>{
    const v=is.veri,i=katki(k.kisiler[v.kisiId],'iletisim'),tavir=i==='guclu'?'sozcuIyi':i==='orta'?'sozcuKuru':'sozcuGaf';
    k.olaylar[v.olayId].sonuc.basin=tavir;
    return{bilgi:meseleOlay(k,v.meseleId,'basin.'+tavir,{kisiId:v.kisiId})};
  },
  /* sözcü ayrıldı: açıklama yapılmadı, gazete cevapsız kaldı */
  geriDon:(k,is)=>{k.olaylar[is.veri.olayId].sonuc.basin='sessiz';}
};

/* Cuma gazetesi: manşet kayıtlı olaydan seçilir */
GELISMELER.gazete={
  denetle:(k,v)=>(k.kulupler||{})[v.kulupId]?[]:[`kulüp bulunamadı (${v.kulupId})`],
  uygula:k=>{
    const o=Object.values(k.olaylar).find(x=>x.paket==='basinSorusu');
    if(o)return{bilgi:'Demirkapı Postası: '+haberEkle(k,{tur:'gazete',anahtar:'gazete.'+o.kosullar.konu,p:{tavir:o.sonuc.basin||'sessiz'},olayId:o.id})};
    return{bilgi:'Demirkapı Postası: '+haberEkle(k,{tur:'gazete',anahtar:'gazete.macOnu'})};
  }
};
