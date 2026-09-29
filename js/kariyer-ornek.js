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
  kayitSurumu:1,
  dunyaTohumu:20260929,
  tarih:'2026-11-28',gunIciDakika:540,          // 13. hafta maç günü sabahı (LIG.buMac: Cumartesi 19:00)
  baskanId:'kisi-1',
  gorevDurumu:'gorevde',
  final:null,
  sonrakiNo:{kisi:8,is:4,hareket:1},
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
