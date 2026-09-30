/* ============ Chairman — örnek kariyer: yalnızca veri (TEST) ============
   Kariyer durumunun küçük bir örneği. Sözleşme ve alanların anlamı TEKNIK_PLAN.md §3'tedir; kurallar js/kariyer.js'tedir.
   TEST verisi: kişi adları, doğum tarihleri, başkanın yaşı ve başlangıç durumu kesin karar değildir (bkz. OYUN_TASARIMI.md §13).
   Başlangıç "görevdeki başkan"dır; gerçek oyun başlangıcı (taraftar) Aşama 5'te kurulacak.
   Kulüp kimlikleri js/kadrolar.js ve js/lig.js anahtarlarıyla aynıdır; kimlik kalıcıdır, kulübün adı değişse de değişmez.
   Tarih 'YYYY-AA-GG' metnidir; gunIciDakika gece yarısından beri geçen dakikadır (540 = 09:00).
   Kişi kimlikleri 'kisi-N' biçimindedir; yenisi kimlikUret() ile alınır, sonrakiNo bu sayacı tutar.
   Emekli, ayrılmış ya da vefat etmiş kişiler silinmez; durum alanı değişir, geçmiş referansları geçerli kalır.
   Para kuruş cinsinden tamsayıdır (850000000 = 8.500.000,00 ₺). Tutarlar TEST değeridir, denge sayısı değildir.
   isler: takvimde bekleyen işler (js/takvim.js); ödemeler 'odeme' türü iştir (js/maliye.js). gecmis ve hareketler boş başlar. */
const KARIYER_ORNEK={
  kayitSurumu:5,
  dunyaTohumu:20260929,
  icerik:{surum:0,baslangic:null},kosullar:{},rastlanti:{durum:20260929},olaylar:{},sozler:{},haberler:[],gozlem:null,
  tarih:'2026-11-28',gunIciDakika:540,          // 13. hafta maç günü sabahı (LIG.buMac: Cumartesi 19:00)
  baskanId:'kisi-1',
  gorevDurumu:'gorevde',
  final:null,
  sonrakiNo:{kisi:8,is:4,hareket:1,mesele:1,olay:1,soz:1},
  meseleler:{},
  kulupler:{
    demirkapi:{id:'demirkapi',ad:'Demirkapı SK',kisa:'DEM',kademe:3,baskanId:'kisi-1',acilisNakit:850000000,nakit:850000000},
    akdeniz:{id:'akdeniz',ad:'Akdeniz FK',kisa:'AKD',kademe:3,baskanId:'kisi-5',acilisNakit:1200000000,nakit:1200000000}
  },
  isler:{
    'is-1':{id:'is-1',tur:'hatirlatma',tarih:'2026-11-30',dakika:600,veri:{metin:'Saha sorumlusu zemin raporunu getirir.'}},
    'is-2':{id:'is-2',tur:'odeme',tarih:'2026-11-30',dakika:720,veri:{kulupId:'demirkapi',tutar:-320000000,kalem:'maas',aciklama:'Kasım maaşları'}},
    'is-3':{id:'is-3',tur:'odeme',tarih:'2026-12-01',dakika:660,veri:{kulupId:'demirkapi',tutar:150000000,kalem:'sponsor',aciklama:'Forma sponsoru ilk taksit'}}
  },
  gecmis:[],
  hareketler:[],
  kisiler:{
    'kisi-1':{id:'kisi-1',ad:'Haluk Demirel',rol:'baskan',dogumTarihi:'1972-04-17',kulupId:'demirkapi',durum:'aktif'},
    'kisi-2':{id:'kisi-2',ad:'Şükrü Hoca',rol:'teknikDirektor',dogumTarihi:'1961-09-03',kulupId:'demirkapi',durum:'aktif'},
    'kisi-3':{id:'kisi-3',ad:'Necati Uysal',rol:'yonetici',dogumTarihi:'1966-01-22',kulupId:'demirkapi',durum:'aktif'},
    'kisi-4':{id:'kisi-4',ad:'Sevim Kara',rol:'yonetici',dogumTarihi:'1979-06-11',kulupId:'demirkapi',durum:'aktif'},
    'kisi-5':{id:'kisi-5',ad:'Rahmi Aksoy',rol:'baskan',dogumTarihi:'1958-12-30',kulupId:'akdeniz',durum:'aktif'},
    'kisi-6':{id:'kisi-6',ad:'Nuri Hoca',rol:'teknikDirektor',dogumTarihi:'1956-03-14',kulupId:'akdeniz',durum:'aktif'},
    'kisi-7':{id:'kisi-7',ad:'Celal Arıkan',rol:'eskiBaskan',dogumTarihi:'1944-10-05',kulupId:'demirkapi',durum:'emekli'}
  }
};

/* ============ eski sabit TEST haftası: maçtan önceki hafta (yol haritası 2.1–2.4) ============
   Oyun artık bu kariyerle açılmaz (2.4A): yeni kariyer js/baslangic.js'teki kariyerBaslat ile kurulur. Bu veri yalnız kural
   denemelerinin (araclar/kariyer-deneme.js) ve eski kayıt uyumunun örneğidir; içerik sürümü 0'dır.
   Pazartesi 23 Kasım 08:00'de başlar. Kulüpler ve kişiler KARIYER_ORNEK ile aynıdır (kariyerOlustur derin kopyalar).
   Ajanda işleri (js/ajanda.js) hafta boyunca dağılır; Cumartesi 19:00 maçı zorunlu maç sınırıdır (LIG.buMac ile aynı an).
   Metinler, saatler ve tutarlar TEST verisidir; kesin içerik ya da denge değeri değildir.
   KARIYER_ORNEK'in işleri (is-1…is-3) maçtan sonraya düşer; maç sonucu kariyere Aşama 3'te bağlanana kadar oraya varılmaz.
   Yönetim (2.2, js/yonetim.js): futbol şube sorumlusu Necati Uysal, basın sözcüsü Sevim Kara; sayman koltuğu boş.
   Üç sayman adayı (kisi-8…10) Pazartesi görüşülür. Profilleri oyuncuya metin olarak gösterilir; katkı seviyeleri gizlidir ve
   Perşembe sponsor işinin saymana devredilince nasıl sonuçlanacağını belirler.
   Mesele (2.3, js/mesele.js): forma sponsorunun geciken taksiti tek meseledir (mesele-1). Perşembe kararı (is-10) ve 1 Aralık
   ödemesi (is-3) ona bağlıdır; devredilirse saymanın haberi Cuma sabahı gelir. */
const KARIYER_BASLANGIC=Object.assign({},KARIYER_ORNEK,{
  tarih:'2026-11-23',gunIciDakika:480,
  sonrakiNo:{kisi:11,is:15,hareket:1,mesele:2,olay:1,soz:1},
  meseleler:{
    'mesele-1':{id:'mesele-1',tur:'sponsorOdemesi',baslik:'Forma sponsoru: geciken ilk taksit',durum:'kararBekliyor',sorumluId:'kisi-1',kisiler:['kisi-4'],
      olaylar:[{tarih:'2026-11-23',dakika:480,anahtar:'sponsor.acildi',p:{kisiId:'kisi-4'}}],gorulen:0,kapanis:null}
  },
  kulupler:Object.assign({},KARIYER_ORNEK.kulupler,{
    demirkapi:Object.assign({},KARIYER_ORNEK.kulupler.demirkapi,{yonetim:{sayman:null,futbol:'kisi-3',basin:'kisi-4'}})
  }),
  kisiler:Object.assign({},KARIYER_ORNEK.kisiler,{
    'kisi-8':{id:'kisi-8',ad:'Hikmet Aydın',rol:'yoneticiAdayi',dogumTarihi:'1959-05-08',kulupId:'demirkapi',durum:'aktif',
      profil:{meslek:'Emekli banka şube müdürü.',guclu:'Otuz yıl kredi ve tahsilat işi yürüttü; ödeme planı kurmayı bilir.',
        zayif:'Futbol çevresini tanımaz; tribünle arası mesafeli.',beklenti:'Kulübün hesaplarının dışarıdan denetlenmesini istiyor.'},
      katki:{mali:'guclu',baglanti:'orta',futbol:'zayif',iletisim:'orta'}},
    'kisi-9':{id:'kisi-9',ad:'Tuncay Erbil',rol:'yoneticiAdayi',dogumTarihi:'1970-02-19',kulupId:'demirkapi',durum:'aktif',
      profil:{meslek:'Organize sanayide tekstil fabrikası sahibi.',guclu:'Şehrin iş çevresini tanır; sponsorlarla aynı masada oturur.',
        zayif:'Muhasebe ayrıntısına sabrı yok; işleri telefonla halletmeyi sever.',beklenti:'Firmasının adının stat panolarında görünmesini istiyor.'},
      katki:{mali:'orta',baglanti:'guclu',futbol:'orta',iletisim:'orta'}},
    'kisi-10':{id:'kisi-10',ad:'Deniz Kocaman',rol:'yoneticiAdayi',dogumTarihi:'1990-10-02',kulupId:'demirkapi',durum:'aktif',
      profil:{meslek:'Serbest mali müşavir; kulübün eski altyapı oyuncusu.',guclu:'Sözleşmeleri satır satır okur; kayıtları düzenler.',
        zayif:'Şehrin büyük iş insanları onu henüz ciddiye almıyor.',beklenti:'Altyapıya ayrılan bütçenin korunmasını istiyor.'},
      katki:{mali:'guclu',baglanti:'zayif',futbol:'orta',iletisim:'guclu'}}
  }),
  isler:Object.assign({},KARIYER_ORNEK.isler,{
    'is-3':Object.assign({},KARIYER_ORNEK.isler['is-3'],{veri:Object.assign({},KARIYER_ORNEK.isler['is-3'].veri,{meseleId:'mesele-1'})}),
    'is-4':{id:'is-4',tur:'ajanda',tarih:'2026-11-23',dakika:600,veri:{baslik:'Haftalık yönetim toplantısı',zorunluluk:'zorunlu',sure:90,kisiId:'kisi-3',
      aciklama:'Yönetim haftanın gündemini konuşacak: Cumartesi maçı, bilet satışı, sponsor ödemesi ve boş sayman koltuğu.',
      bilgi:'Necati Uysal: Akdeniz maçı için bilet ön satışı zayıf; tribünler yarı boş kalabilir. Sevim Kara forma sponsorunun ödemeyi geciktirebileceğini söyledi. Eski sayman istifa ettiği için koltuk boş; adaylar öğleden sonra geliyor.'}},
    'is-14':{id:'is-14',tur:'ajanda',tarih:'2026-11-23',dakika:780,veri:{baslik:'Sayman adaylarıyla görüşme',zorunluluk:'zorunlu',sure:90,
      karar:'koltukSecimi',kulupId:'demirkapi',koltuk:'sayman',adaylar:['kisi-8','kisi-9','kisi-10'],
      aciklama:'Boş sayman koltuğu için üç kulüp üyesiyle görüşeceksin. Görüşmenin sonunda birini seçmelisin.'}},
    'is-5':{id:'is-5',tur:'ajanda',tarih:'2026-11-23',dakika:900,veri:{baslik:'Antrenmanı izle',zorunluluk:'istege',sure:120,kisiId:'kisi-2',
      aciklama:'Şükrü Hoca haftanın ilk antrenmanını yaptırıyor. Tribünden izleyebilirsin.',
      bilgi:'Takım tempolu çalıştı. Şükrü Hoca duran toplara uzun süre ayırdı; sağ bekte iki oyuncuyu dönüşümlü denedi.'}},
    'is-6':{id:'is-6',tur:'ajanda',tarih:'2026-11-24',dakika:660,veri:{baslik:'Saha sorumlusuyla zemin turu',zorunluluk:'ertelenebilir',sure:60,sonTarih:'2026-11-26',
      aciklama:'Saha sorumlusu yağmurdan sonra zeminin durumunu göstermek istiyor.',
      bilgi:'Kale önleri çamurlu, orta saha tutuyor. Cumartesiye kadar yeni çim serilemez; kale ağızları kumla desteklenecek.'}},
    'is-7':{id:'is-7',tur:'odeme',tarih:'2026-11-24',dakika:720,veri:{kulupId:'demirkapi',tutar:-4500000,kalem:'isletme',aciklama:'Stat elektrik faturası (Kasım)'}},
    'is-8':{id:'is-8',tur:'ajanda',tarih:'2026-11-25',dakika:840,veri:{baslik:'Yerel gazete röportajı',zorunluluk:'ertelenebilir',sure:60,sonTarih:'2026-11-27',
      aciklama:'Demirkapı Postası sezon ortası değerlendirmesi için kısa bir söyleşi istiyor.',
      bilgi:'Muhabir en çok bilet fiyatlarını ve Akdeniz maçını sordu. Söyleşi Cuma günkü sayıda çıkacak.'}},
    'is-9':{id:'is-9',tur:'hatirlatma',tarih:'2026-11-25',dakika:540,veri:{metin:'Federasyon Cumartesi maçının hakemini açıkladı.'}},
    'is-10':{id:'is-10',tur:'ajanda',tarih:'2026-11-26',dakika:600,veri:{baslik:'Forma sponsoru ödemesi gecikiyor',zorunluluk:'zorunlu',sure:90,
      karar:'sponsorGecikmesi',kulupId:'demirkapi',odemeIsId:'is-3',meseleId:'mesele-1',
      aciklama:'Forma sponsoru 1 Aralık\'taki ilk taksiti geciktirmek istiyor. Temsilciyle kendin görüşebilir ya da işi saymana devredebilirsin.'}},
    'is-11':{id:'is-11',tur:'odeme',tarih:'2026-11-26',dakika:900,veri:{kulupId:'demirkapi',tutar:12000000,kalem:'bilet',aciklama:'Bilet ön satış geliri'}},
    'is-12':{id:'is-12',tur:'ajanda',tarih:'2026-11-27',dakika:960,veri:{baslik:'Şükrü Hoca ile maç öncesi görüşme',zorunluluk:'istege',sure:45,kisiId:'kisi-2',
      aciklama:'Hoca maç öncesi planını anlatmak için kısa bir görüşme öneriyor.',
      bilgi:'Şükrü Hoca: “Akdeniz ortada kalabalık oynuyor, kanatlardan gideceğiz.” Sakat oyuncuların dönüş tarihlerini de anlattı.'}},
    'is-13':{id:'is-13',tur:'ajanda',tarih:'2026-11-28',dakika:1140,veri:{baslik:'Maç: Demirkapı SK – Akdeniz FK',zorunluluk:'zorunlu',sure:0,eylem:'macGunu',
      aciklama:'3. Lig 13. hafta. Başkan koltuğunda yerini al.'}}
  })
});
