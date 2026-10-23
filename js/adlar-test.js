/* ============ Chairman — TEST ad havuzu: üretilen kadroların oyuncu ve hoca adları (yalnız veri; F1, 2026-10-23) ============
   Kullanıcı kararı (2026-10-23, YOL_HARITASI karar 33): ligin öbür kulüplerine üretilen kadroların oyuncu ve hoca adlarını Claude TEST verisi
   olarak yazar; kullanıcı bu listeyi istediği gibi değiştirebilir (ad eklemek, çıkarmak, değiştirmek yalnız yeni kariyerleri etkiler).
   Kulüp adları kullanıcınındır (js/lig.js) ve burada yoktur. Demirkapı ve Akdeniz'in kadroları js/kadrolar.js'tedir, bu listeden üretilmez.
   Adlar tek sözcüktür (kadrolar.js'teki gibi); oyunun 3×5 piksel yazısında olmayan harf (â, î, û) kullanılmaz. Hoca adı "<ad> Hoca" olur.
   Kullanan: js/kariyer-kadro.js (kadroUret). */
const ADLAR_TEST=[
  'Ali','Mehmet','Mustafa','Hasan','İbrahim','İsmail','Osman','Ömer','Ramazan','Recep','Süleyman','Yakup','Salih','Kemal','Erol',
  'Erkan','Ercan','Erhan','Ertan','Ersin','Ertuğrul','Gökhan','Gürkan','Harun','Hayati','İlhan','Kamil','Kenan','Mahmut','Necati',
  'Nazım','Nusret','Okan','Onur','Ozan','Özcan','Özgür','Rasim','Remzi','Sabri','Sedat','Selim','Serkan','Sezer','Soner',
  'Suat','Şenol','Tahsin','Taner','Tarkan','Tevfik','Tolga','Tuncay','Turan','Ufuk','Uğur','Ümit','Vedat','Veysel','Yavuz',
  'Yücel','Zafer','Zeki','Adem','Alper','Arif','Aydın','Bahri','Barış','Bayram','Cafer','Cahit','Celal','Cevdet','Cüneyt',
  'Davut','Doğan','Ekrem','Emin','Enver','Erdem','Fatih','Ferdi','Fuat','Gürsel','Hamdi','Hilmi','İhsan','İrfan','Kazım',
  'Mesut','Muammer','Naci','Nedim','Oktay','Oral','Polat','Saffet','Savaş','Semih','Şahin','Şeref','Talat','Tayfun','Temel',
  'Tufan','Umut','Vahit','Yasin','Yener','Yunus','Zihni','Coşkun','Burak','Kaan'
];
