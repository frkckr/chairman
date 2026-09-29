/* ============ Chairman — masaüstü deposu (platform katmanı) ============
   js/kayit.js'in beklediği depo arayüzünün (oku/yaz/sil) masaüstü uygulaması. Dosya işlemlerini Electron ana süreci yapar
   (masaustu/ana.js); sayfa yalnız masaustu/onyukleme.js'in açtığı window.chairmanMasaustu köprüsünü görür.
   Kayıtlar kullanıcı veri klasöründe durur (Windows: %APPDATA%\Chairman\kayitlar\<ad>.json).
   Masaüstü dışında (tarayıcı, GitHub Pages) null döner; çağıran tarayiciDeposu()'na geçer. */
function masaustuDeposu(){
  const m=typeof window!=='undefined'&&window.chairmanMasaustu;
  if(!m||!m.depo)return null;
  const sonuc=r=>{if(!r||!r.tamam)throw new Error((r&&r.hata)||'masaüstü deposu yanıt vermedi');return r;};
  return{
    oku:ad=>sonuc(m.depo.oku(ad)).metin,
    yaz:(ad,metin)=>{sonuc(m.depo.yaz(ad,metin));},
    sil:ad=>{sonuc(m.depo.sil(ad));},
    dizin:()=>m.depo.dizin()
  };
}
