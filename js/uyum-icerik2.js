/* ============ Chairman — içerik sürümü 2 ve öncesinin çok seçenekli kararları: yalnız kayıt uyumu ve kural denemesi (çizim yok; yol haritası 2.8H) ============
   2026-10-02 kararıyla yeni kariyerde (içerik sürümü 3) bütün başkanlık kararları iki cevaplıdır (js/yonetim.js ikiSecenek). Buradaki türler 2.2–2.8'in
   üç/dört seçenekli kararlarıdır ve davranışları değiştirilmez:
     koltukSecimi           bütün adaylar tek ekranda (yeni: sıralı adayGorusmesi)
     odemeSikismasi         kendin · devret · bakimErtele · maasGeciktir (yeni: odemeYolu)
     anlasmaDegerlendirme   kabul · bedel · devret, ertelenebilir iş (yeni: ertelemeTalebi)
     nakitTakvimi           takip · bakim · kalici · bekle (yeni: nakitOnerisi)
     hocaTalebi             onayla · soz · reddet (yeni: kampTalebi)
     hocaGorusmesi          tek seçenekli karar (yeni: katılım etkisi, karar değil)
     basinSorusu            kendin · devret · sessiz, zorunlu (yeni: basinCevabi, cevapsız kalabilir)
     destekTeklifi          kabul · kucult · reddet (yeni: destekCevabi)
   Bu türleri yalnız içerik sürümü 2 ve öncesindeki kariyerler üretir: sürüm 1–5 kayıtları (araclar/ornekler) ve kural denemelerinin
   kariyerBaslat({icerik:2}) örnekleri. Yeni kariyer bunları üretmez. Yollar ve uygulamaları paket dosyalarıyla ortaktır; yalnız seçenek listesi
   ve eski "Görüş iste" (tavsiye) düğmesi farklıdır. Ödenmiş para, verilen söz ve görülen geçmiş bu türlerle yazıldığı gibi kalır. */
KARAR_TURLERI.koltukSecimi={
  denetle:adayDenetle,
  secenekler:(k,is)=>{
    const v=is.veri,c=k.kulupler[v.kulupId],dolu=!!(c.yonetim&&c.yonetim[v.koltuk]);
    return v.adaylar.map(id=>{const p=k.kisiler[id],pr=p.profil||{};
      return{id,metin:p.ad,aciklama:[pr.meslek,pr.guclu&&'Güçlü yanı: '+pr.guclu,pr.zayif&&'Zayıf yanı: '+pr.zayif,pr.beklenti&&'Beklentisi: '+pr.beklenti].filter(Boolean),
        engel:dolu?`${YONETIM_KOLTUKLARI[v.koltuk].ad} koltuğu artık dolu`:p.durum!=='aktif'?`${p.ad} artık aday değil`:koltuktaMi(k,id)?`${p.ad} zaten bir koltukta`:null};});
  },
  uygula:(k,is,secim)=>{
    const v=is.veri,p=k.kisiler[secim];
    koltugaAta(k,v.kulupId,v.koltuk,secim);
    return{bilgi:koltukAtamaBilgisi(k,v.koltuk,p)};
  }
};
KARAR_TURLERI.odemeSikismasi={denetle:odemeMeseleDenetle,tavsiye:odemeTavsiyesi,secenekler:odemeYollari,uygula:odemeYoluUygula};
KARAR_TURLERI.anlasmaDegerlendirme={denetle:odemeMeseleDenetle,tavsiye:odemeTavsiyesi,secenekler:anlasmaYollari,uygula:anlasmaUygula};
KARAR_TURLERI.nakitTakvimi={denetle:nakitDenetle,secenekler:nakitYollari,uygula:nakitUygula};
KARAR_TURLERI.hocaTalebi={denetle:hocaDenetle,tavsiye:hocaTavsiyesi,secenekler:(k,is)=>hocaYollari(k,is).filter(s=>s.id!=='lokal'),uygula:hocaUygula};
KARAR_TURLERI.hocaGorusmesi={
  denetle:(k,v)=>(k.kisiler||{})[v.hocaId]?[]:[`hoca bulunamadı (${v.hocaId})`],
  secenekler:()=>[{id:'dinle',metin:'Haftayı ve ihtiyaçları sor',engel:null,aciklama:['45 dakika sürer. Hoca haftanın planını anlatır; bir isteği varsa şimdi söyler.']}],
  uygula:hocaGorusmesiSonucu
};
KARAR_TURLERI.basinSorusu={denetle:basinDenetle,tavsiye:basinTavsiyesi,secenekler:(k,is)=>basinYollari(k,is).filter(s=>s.id!=='yorumYok'),uygula:basinUygula};
KARAR_TURLERI.destekTeklifi={denetle:destekDenetle,tavsiye:destekTavsiyesi,secenekler:destekYollari,uygula:destekUygula};
