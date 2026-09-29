/* ============ Chairman — tarayıcı deposu (platform katmanı) ============
   js/kayit.js'in beklediği depo arayüzünün (oku/yaz/sil) tarayıcı localStorage uygulaması.
   Kayıtlar yalnız bu tarayıcıda ve bu adreste durur; tarayıcı verisi silinirse kaybolur.
   Depo kullanılamıyorsa (gizli pencere, kapalı site verisi) null döner; çağıran bellekDeposu()'na geçip durumu bildirmelidir.
   Masaüstü sürümü aynı arayüzle dosya tabanlı ayrı bir depo kullanacak (yol haritası 1.5). */
function tarayiciDeposu(onek){
  onek=onek||'chairman:';
  let ls;
  try{
    ls=window.localStorage;
    const d=onek+'.deneme';ls.setItem(d,'1');ls.removeItem(d);
  }catch(e){return null;}
  return{
    oku:ad=>ls.getItem(onek+ad),
    yaz:(ad,metin)=>{ls.setItem(onek+ad,metin);},     // kota dolarsa hata fırlatır; kariyerKaydet bunu bildirir
    sil:ad=>{ls.removeItem(onek+ad);}
  };
}
