/* ============ Chairman — değişken başlangıç: devralınan koşulların kurulması (çizim yok; yol haritası 2.4A, 2.6, 2.8) ============
   Yeni kariyer buradan kurulur: kulübün kimliği ve kişileri sabittir (js/kariyer-ornek.js + YONETIM_HAVUZU), devralınan koşullar başlangıca göre değişir.
   Üç TEST başlangıcı (BASLANGICLAR); nihai başlangıç sayısı ya da denge değildir:
     sikisik  kasa dar, sayman koltuğu boş, sponsor taksiti ertelemek isteyecek → taksit gelmezse maaş günü kasa yetmez.
     rahat    kasada pay var, sayman görevde, basın sözcüsü koltuğu boş, sponsor yine erteleme isteyecek → acil olmayan bir değerlendirme.
     duzenli  ödeme takvimi uyumlu, üç koltuk dolu, sponsor gününde ödüyor, hocanın isteği yok → sakin hafta.
   kariyerBaslat({tohum, baslangic?, sponsor?, sayman?, hoca?}): tohumdan dört rastlantı çekilir (başlangıç, sponsorun gerçek durumu, görevdeki sayman,
     hocanın talebi); verilen alanlar çekilen değerin yerine geçer (geliştirici ve deneme içindir, oyuncuya menü olarak sunulmaz). Aynı tohum aynı kariyeri kurar.
   Koşullar birlikte ve bir kez seçilir (k.kosullar, k.icerik.baslangic); sezonun olay sırası yazılmaz. Takvime gizli dış gelişmeler konur (js/olay.js);
   her biri zamanı gelince o günkü dünyaya bakar ve koşulu yoksa hiçbir şey açmaz:
     Salı destek teklifi (js/paket-destek.js) · Çarşamba sponsorun talebi (js/paket-odeme.js) · Perşembe hocanın talebi (js/paket-hoca.js) ve
     gazetenin sorusu (js/paket-basin.js) · Cuma gazete ve teşekkür (js/soz.js).
   Yönetim havuzu (2.2): koltuklar bu kişilerden kurulur; profil oyuncuya gösterilir, katkı gizlidir (test görünümü hariç, js/test-gorunum.js).
   Hafta 23 Kasım Pazartesi 08:00'de başlar, Cumartesi 19:00 maç sınırında biter (LIG.buMac ile aynı an). Tutarlar, kişiler ve saatler TEST değeridir. */
const BASLANGIC_TARIHI='2026-11-23';
const BASLANGICLAR={
  sikisik:{nakit:330000000,sayman:false,basin:true,erteleme:true,acilis:'Kasa dar ve sayman koltuğu boş; adaylar bu sabah geliyor.'},
  rahat:{nakit:850000000,sayman:true,basin:false,erteleme:true,acilis:'Kasada pay var; basın sözcüsü koltuğu boş.'},
  duzenli:{nakit:520000000,sayman:true,basin:true,erteleme:false,acilis:'Ödemeler takvimine oturmuş; sakin bir hafta görünüyor.'}
};
const BASLANGIC_SIRASI=['sikisik','rahat','duzenli'];
const SPONSOR_DURUMLARI=['nakitSikisik','pazarlik'];
const SAYMAN_ADAYLARI=['kisi-8','kisi-9','kisi-10'];
const HOCA_TALEPLERI=['kamp','yok'];
/* havuz: mevcut yöneticilerin profil/katkısı ve yeni kişiler. Sayman adaylarının kaydı js/kariyer-ornek.js'tedir (kisi-8…10) */
const YONETIM_HAVUZU={
  'kisi-3':{profil:{meslek:'Eski kulüp kaptanı; yirmi yıldır futbol şubesinde.',guclu:'Hocaları ve oyuncuları tanır; soyunma odasının nabzını bilir.',
      zayif:'Rakamlarla arası iyi değil; bütçe konuşmalarında sessiz kalır.',beklenti:'Teknik kadronun işine karışılmamasını istiyor.'},
    katki:{mali:'zayif',baglanti:'orta',futbol:'guclu',iletisim:'orta'}},
  'kisi-4':{profil:{meslek:'Yerel radyonun eski program yapımcısı.',guclu:'Gazetecileri tanır; açıklamayı sade ve sakin yazar.',
      zayif:'Futbol ayrıntısına uzak; teknik soruda zorlanır.',beklenti:'Açıklamaların ondan habersiz yapılmamasını istiyor.'},
    katki:{mali:'orta',baglanti:'orta',futbol:'zayif',iletisim:'guclu'}},
  'kisi-11':{id:'kisi-11',ad:'Aysel Tekin',rol:'yoneticiAdayi',dogumTarihi:'1963-03-27',kulupId:'demirkapi',durum:'aktif',
    profil:{meslek:'Demirkapı Postası\'nın emekli yazı işleri müdürü.',guclu:'Haberin nasıl yazılacağını önceden görür; açıklamayı buna göre kurar.',
      zayif:'Tribünle bağı zayıf; taraftar onu mesafeli bulur.',beklenti:'Kulübün basına karşı açık ve dürüst olmasını istiyor.'},
    katki:{mali:'zayif',baglanti:'orta',futbol:'orta',iletisim:'guclu'}},
  'kisi-12':{id:'kisi-12',ad:'Orhan Yazıcı',rol:'yoneticiAdayi',dogumTarihi:'1968-08-14',kulupId:'demirkapi',durum:'aktif',
    profil:{meslek:'Taraftar derneğinin eski başkanı; nalbur.',guclu:'Tribünü ve esnafı tanır; söylediği kulübün içinde çabuk yayılır.',
      zayif:'Mikrofon karşısında ölçüyü kaçırabilir.',beklenti:'Bilet fiyatlarının taraftara danışılmadan artırılmamasını istiyor.'},
    katki:{mali:'zayif',baglanti:'guclu',futbol:'orta',iletisim:'zayif'}},
  'kisi-13':{id:'kisi-13',ad:'Remzi Usta',rol:'personel',dogumTarihi:'1957-02-09',kulupId:'demirkapi',durum:'aktif'}
};
const BASIN_ADAYLARI=['kisi-11','kisi-12'];

function kariyerBaslat({tohum,baslangic,sponsor,sayman,hoca}={}){
  if(!Number.isInteger(tohum))throw new Error(`Dünya tohumu tamsayı olmalı: ${tohum}`);
  tohum=tohum>>>0;
  const O=KARIYER_ORNEK,E=KARIYER_BASLANGIC,KULUP=O.kisiler[O.baskanId].kulupId;
  const k=kariyerOlustur({kayitSurumu:KARIYER_SURUM,dunyaTohumu:tohum,icerik:{surum:ICERIK_SURUM,baslangic:null},kosullar:{},rastlanti:rastlantiBaslat(tohum),olaylar:{},sozler:{},haberler:[],gozlem:null,
    tarih:BASLANGIC_TARIHI,gunIciDakika:GUN_BASLANGICI,baskanId:O.baskanId,gorevDurumu:'gorevde',final:null,
    sonrakiNo:{kisi:14,is:1,hareket:1,mesele:1,olay:1,soz:1},meseleler:{},kulupler:O.kulupler,isler:{},gecmis:[],hareketler:[],kisiler:E.kisiler});
  for(const [id,p] of Object.entries(kariyerOlustur(YONETIM_HAVUZU)))k.kisiler[id]=Object.assign(k.kisiler[id]||{},p);
  /* dört çekiliş her zaman yapılır: bir alanı elle vermek diğerlerinin seçimini değiştirmez */
  const sec=L=>L[Math.floor(rastlantiCek(k)*L.length)],r=[sec(BASLANGIC_SIRASI),sec(SPONSOR_DURUMLARI),sec(SAYMAN_ADAYLARI),sec(HOCA_TALEPLERI)];
  const ad=baslangic||r[0],B=BASLANGICLAR[ad];
  if(!B)throw new Error(`Bilinmeyen başlangıç: ${ad}`);
  const spDurum=B.erteleme?sponsor||r[1]:'saglam',saymanId=sayman||r[2],talep=ad==='duzenli'?'yok':hoca||r[3];
  if(B.erteleme&&!SPONSOR_DURUMLARI.includes(spDurum))throw new Error(`Bilinmeyen sponsor durumu: ${spDurum}`);
  if(B.sayman&&!SAYMAN_ADAYLARI.includes(saymanId))throw new Error(`Bilinmeyen sayman: ${saymanId}`);
  if(!HOCA_TALEPLERI.includes(talep))throw new Error(`Bilinmeyen hoca talebi: ${talep}`);
  k.icerik.baslangic=ad;
  k.kosullar={sponsor:{durum:spDurum},hoca:{talep}};
  const c=k.kulupler[KULUP],hocaKisi=Object.values(k.kisiler).find(p=>p.kulupId===KULUP&&p.rol==='teknikDirektor');
  c.acilisNakit=c.nakit=B.nakit;
  c.yonetim={sayman:null,futbol:'kisi-3',basin:B.basin?'kisi-4':null};
  if(!B.basin){k.kisiler['kisi-4'].durum='ayrildi';k.kisiler['kisi-4'].rol='eskiYonetici';}
  if(B.sayman)koltugaAta(k,KULUP,'sayman',saymanId);

  const gun=n=>tarihEkle(BASLANGIC_TARIHI,n),odeme=(n,dakika,tutar,kalem,aciklama)=>odemePlanla(k,{kulupId:KULUP,tarih:gun(n),dakika,tutar,kalem,aciklama});
  const gelisme=(n,dakika,veri)=>isEkle(k,{tur:'gelisme',tarih:gun(n),dakika,veri});
  odeme(1,720,-4500000,'isletme','Stat elektrik faturası (Kasım)');
  const bakimIsId=odeme(3,600,-35000000,'bakim','Tribün çatısı bakım taksiti');
  const odemeIsId=odeme(3,660,150000000,'sponsor','Forma sponsoru ilk taksit');
  odeme(3,900,12000000,'bilet','Bilet ön satış geliri');
  const maasIsId=odeme(4,720,-320000000,'maas','Kasım maaşları');
  const ortak={kulupId:KULUP,odemeIsId,maasIsId,bakimIsId};
  if(B.erteleme){
    const gelismeIsId=gelisme(2,570,Object.assign({gelisme:'sponsorErteleme',gun:14},ortak));
    if(!B.sayman){
      const a=nakitAcigi(k,KULUP,odemeIsId);
      isEkle(k,{tur:'ajanda',tarih:gun(0),dakika:600,veri:{baslik:'Sayman adaylarıyla görüşme',zorunluluk:'zorunlu',sure:90,
        karar:'koltukSecimi',kulupId:KULUP,koltuk:'sayman',adaylar:SAYMAN_ADAYLARI.slice(),
        aciklama:'Eski sayman istifa etti; koltuk boş. Üç kulüp üyesiyle görüşeceksin. Görüşmenin sonunda birini seçmelisin.'}});
      isEkle(k,{tur:'ajanda',tarih:gun(1),dakika:840,veri:Object.assign({baslik:'Saymanla nakit takvimi',zorunluluk:'istege',sure:45,karar:'nakitTakvimi',gelismeIsId,
        aciklama:'Yeni sayman haftanın ödeme takvimini birlikte gözden geçirmek istiyor.'+
          (a.acik?` Defter şunu gösteriyor: Perşembe günkü sponsor taksiti gelmezse ${gunAyYazi(a.is.tarih)} günü “${a.is.veri.aciklama}” için kasada ${paraYazi(a.acik)} eksik kalır.`:'')},ortak)});
    }
  }
  if(!B.basin)isEkle(k,{tur:'ajanda',tarih:gun(0),dakika:660,veri:{baslik:'Basın sözcüsü adaylarıyla görüşme',zorunluluk:'ertelenebilir',sure:60,sonTarih:gun(2),
    karar:'koltukSecimi',kulupId:KULUP,koltuk:'basin',adaylar:BASIN_ADAYLARI.concat(SAYMAN_ADAYLARI.find(x=>x!==saymanId&&x!=='kisi-9')),
    aciklama:'Sevim Kara geçen ay görevi bıraktı; basın sözcüsü koltuğu boş. Üç kulüp üyesiyle görüşüp birini seçebilirsin. Çarşambaya kadar ertelenebilir.'}});
  /* gizli dış gelişmeler: koşulu yoksa iz bırakmadan geçer */
  gelisme(1,630,{gelisme:'destekTeklifi',kulupId:KULUP,kisiId:'kisi-9',tutar:40000000,kucuk:15000000});
  if(talep==='kamp')gelisme(3,840,{gelisme:'hocaTalebi',kulupId:KULUP,hocaId:hocaKisi.id,tutar:-6000000,maasIsId});
  gelisme(3,960,{gelisme:'basinSorusu',kulupId:KULUP});
  gelisme(4,510,{gelisme:'gazete',kulupId:KULUP});
  gelisme(4,900,{gelisme:'tesekkur',kulupId:KULUP,kisiId:'kisi-13',maasIsId});
  isEkle(k,{tur:'ajanda',tarih:gun(5),dakika:1140,veri:{baslik:'Maç: Demirkapı SK – Akdeniz FK',zorunluluk:'zorunlu',sure:0,eylem:'macGunu',
    aciklama:'3. Lig 13. hafta. Başkan koltuğunda yerini al.'}});
  const h=kariyerDogrula(k);
  if(h.length)throw new Error('Başlangıç tutarsız kuruldu: '+h.slice(0,3).join('; '));
  return k;
}
