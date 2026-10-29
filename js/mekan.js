/* ============ Chairman — mekânlar: görüşme, gözlem ve sağlık kontrolünün yeri (çizim yok; R4-h, 2026-10-29) ============
   Kullanıcı kararı (2026-10-29): görüşmeye gitmek oyun zamanı alır, başkan ofisten uzak kalır; her lig kademesinin kendi mekânları vardır
   (araclar/plan/transfer-tasarim.md §6). Mekân veridir: ad, kademe, tür, yolculuk süresi (tek yön, dakika), görüşme süresi, masraf (kuruş), etki
   (yüz yüze görüşmenin ikna gücü; TEST) ve sahne anahtarı (görsel turda çizilecek sahne; bugün boş, karar 49). Bugün metin ve süre olarak çalışır.
   Yolculuk ayrı bir “konum” durumu kurmaz: kartın cevabının süresi zamanı ilerletir, kaçırılacak işler kartın yüzünde yazar (H1 kuralı).
     MEKANLAR[id] = {ad, kademe, tur:'gorusme'|'gozlem'|'saglik', yol, sure, masraf, etki, sahne}
     mekanSuresi(id) → gidiş + görüşme + dönüş (dakika)   mekanMasrafi(k, id, kulupId, açıklama, meseleId?) masrafı kasadan düşer (kalem 'yol')
   2. ve 1. Lig mekânları tasarımdadır (Aşama 8); burada yalnız 3. Lig'inkiler var. Bütün sayılar TEST. */
'use strict';
const MEKANLAR={
  baskanOdasi:{ad:'Başkanın odası',kademe:3,tur:'gorusme',yol:0,sure:45,masraf:0,etki:0,sahne:null},
  kulupLokali:{ad:'Kulüp lokali',kademe:3,tur:'gorusme',yol:10,sure:60,masraf:60000,etki:0.1,sahne:null},
  cayBahcesi:{ad:'İlçedeki çay bahçesi',kademe:3,tur:'gorusme',yol:20,sure:60,masraf:20000,etki:0.1,sahne:null},
  karsiOfis:{ad:'Karşı kulübün ofisi',kademe:3,tur:'gorusme',yol:120,sure:60,masraf:150000,etki:0.2,sahne:null},
  oyuncununSehri:{ad:'Oyuncunun yaşadığı şehir',kademe:3,tur:'gorusme',yol:180,sure:90,masraf:250000,etki:0.25,sahne:null},
  amatorTribun:{ad:'Amatör maç tribünü',kademe:3,tur:'gozlem',yol:45,sure:120,masraf:10000,etki:0,sahne:null},
  karsiTesis:{ad:'Karşı kulübün antrenman sahası',kademe:3,tur:'gozlem',yol:120,sure:90,masraf:120000,etki:0,sahne:null},
  devletHastanesi:{ad:'İlçe devlet hastanesi',kademe:3,tur:'saglik',yol:20,sure:120,masraf:0,etki:0,sahne:null}
};
const MEKAN_TURLERI=['gorusme','gozlem','saglik'];
const mekanSuresi=id=>{const M=MEKANLAR[id];return M?M.yol*2+M.sure:0;};
function mekanMasrafi(k,id,kulupId,aciklama,meseleId){
  const M=MEKANLAR[id];if(!M||!M.masraf)return 0;
  paraHareketi(k,{kulupId,tutar:-M.masraf,kalem:'yol',aciklama:`${aciklama} (${M.ad})`});
  if(meseleId&&k.meseleler[meseleId])meseleOlay(k,meseleId,'odeme',{tutar:-M.masraf,aciklama:`Yol ve görüşme masrafı: ${M.ad}`});
  return M.masraf;
}
