/* ============ Chairman — bu sayfanın maç günü: kariyerden ya da geliştirme adresinden (oturum; çizim yok; F1-b, 2026-10-23) ============
   F1 (YOL_HARITASI karar 36): maç sınırı sayfa yeniden yüklemesidir. Odada "Stada git" kaydedilmez ve sayfayı index.html?ekran=bulten&mac=<kimlik>
   adresine götürür; bu dosya o adreste kayıtlı kariyeri açar (oyunBaslat), maçın bekleyen maç günü işini bellekte (kaydetmeden) yeniden yapar
   ve maç girdisini kurar (js/mac-girdi.js macGirdisi). Maç sırasında sayfa kapanır ya da yenilenirse kayıt maç gününden öncedir; aynı adres
   aynı kimlik ve tohumla aynı maçı yeniden oynatır. Sonuç maç bitince F2'de bir kez uygulanır.
   Adreste mac yoksa (?ekran=mac, ?ekran=bulten; geliştirme ve araçlar) maç günü eskisi gibi sabit veriden kurulur: js/lig.js LIG.buMac,
   MAC_KADRO, LIG tablosu ve son maçlar; tohum ve tarz js/mac-sahnesi.js'teki adres parametrelerinden (?tohum, ?tarz).
   Kariyer yolu kurulamazsa (bekleyen maç günü işi yok, yolda karar gerektiren haber, kadro eksik) MAC_GUNU.hata yazılır, adres temizlenir ve
   oda açılır (js/ekran-mac-oncesi.js ON_EKRAN).
   MAC_GUNU: {kariyer, macId, biz, tohum, kadro:[ev, konuk], bulten, stat, doluluk, deplasman, zemin, hata?}
     biz: başkanın kulübünün takım sırası (0 ev, 1 konuk; motorda takım 0 hep ev sahibidir). kadro: js/mac-girdi.js macKadrosu biçimi (tamAd dahil).
     bulten: maç öncesi ekranının verisi. stat: STADYUMLAR anahtarı (F1-c'de deplasman statı); doluluk ve deplasman payı TEST (2.8O'dan beri sabit).
   STAT: bu maçın stat tarifi (stat, seyirci, tünel, kulübeler ve maç bundan kurulur; balkon ve oda penceresi her zaman kulübün statıdır).
   Bu dosya js/stadyum-tarifleri.js'ten (STADYUMLAR) ve kariyer dosyalarından sonra, maç motorundan ve çizimden önce yüklenir; maç motoru
   (araclar/motor-yukle.js) onu yüklemez. */
const MAC_GUNU=(()=>{
  const B=LIG.buMac,tablo=puanDurumu(LIG),ad=id=>(LIG.takimlar.find(t=>t.id===id)||{ad:id}).ad;
  const sabit=()=>({kariyer:false,macId:null,biz:0,tohum:null,
    kadro:[B.ev,B.konuk].map((id,i)=>Object.assign({},MAC_KADRO[i],{id,tamAd:ad(id)})),
    bulten:{ligAd:LIG.ad,sezonAdi:LIG.sezon,hafta:B.hafta,gun:B.gun,saat:B.saat,oynanan:B.hafta-1,bolgeler:LIG.bolgeler,tablo,
      son:[LIG.sonMaclar[B.ev]||[],LIG.sonMaclar[B.konuk]||[]],adlar:Object.fromEntries(LIG.takimlar.map(t=>[t.id,t.ad]))}});
  /* stat ve doluluk (F1-c'de deplasman statı); 2.8O: değerler sabit, ileride ekonomi ve maçın önemi belirler (TEST) */
  const ortak={stat:'kulup',doluluk:0.3,deplasman:0.08,zemin:STADYUMLAR.kulup.zemin};
  let macId=null;try{macId=new URLSearchParams(location.search).get('mac');}catch(e){}
  if(!macId)return Object.assign(sabit(),ortak);
  try{
    oyunBaslat();
    const k=OYUN.kariyer;
    if(!k)throw new Error(OYUN.bozukHata||'Kayıtlı kariyer açılamadı');
    const is=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'&&x.veri.macId===macId);
    if(!is)throw new Error('Bu maçın günü kariyerde bekleyen bir iş değil');
    const girdi=macGirdisi(k,macId);
    oyunKomut(x=>ajandaIsiYap(x,is.id),true);
    if(OYUN.kariyer.isler[is.id]){OYUN.oturum.kaydet();throw new Error('Stada giderken yolda karar gerektiren bir haber geldi; maç günü bekliyor');}
    return Object.assign(girdi,ortak);
  }catch(e){
    try{history.replaceState(null,'',location.pathname);}catch(x){}
    if(typeof OYUN!=='undefined')OYUN.mesaj='Maç günü açılamadı: '+e.message;
    return Object.assign(sabit(),ortak,{hata:e.message});
  }
})();
/* bu maçın stat tarifi (yüklemede bir kez; stat, seyirci, tünel ve kulübeler bundan kurulur) */
const STAT={...STADYUMLAR[MAC_GUNU.stat],zemin:MAC_GUNU.zemin};
