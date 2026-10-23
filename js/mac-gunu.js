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
     bulten: maç öncesi ekranının verisi. stat: statın sahibi ('kulup' ya da ev sahibinin kimliği), statTarifi: tarif (F1-c: ev sahibinin statı);
     doluluk ve deplasman payı TEST (2.8O'dan beri sabit).
   STAT: bu maçın stat tarifi (stat, seyirci, tünel, kulübeler ve maç bundan kurulur; balkon ve oda penceresi her zaman kulübün statıdır).
   Bu dosya js/stadyum-tarifleri.js'ten (STADYUMLAR) ve kariyer dosyalarından sonra, maç motorundan ve çizimden önce yüklenir; maç motoru
   (araclar/motor-yukle.js) onu yüklemez. */
const MAC_GUNU=(()=>{
  const B=LIG.buMac,tablo=puanDurumu(LIG),ad=id=>(LIG.takimlar.find(t=>t.id===id)||{ad:id}).ad;
  const sabit=()=>({kariyer:false,macId:null,biz:0,tohum:null,
    kadro:[B.ev,B.konuk].map((id,i)=>Object.assign({},MAC_KADRO[i],{id,tamAd:ad(id)})),
    bulten:{ligAd:LIG.ad,sezonAdi:LIG.sezon,hafta:B.hafta,gun:B.gun,saat:B.saat,oynanan:B.hafta-1,bolgeler:LIG.bolgeler,tablo,
      son:[LIG.sonMaclar[B.ev]||[],LIG.sonMaclar[B.konuk]||[]],adlar:Object.fromEntries(LIG.takimlar.map(t=>[t.id,t.ad]))}});
  /* stat: ev sahibinin statı (F1-c). Başkanın kulübü evdeyse kulübün statı (js/stadyum-tarifleri.js STADYUMLAR.kulup), değilse ev sahibinin
     tarifi (statTarifiUret). doluluk (2.8O'dan beri sabit, TEST): kulüpte 0,3; öbür statlarda 0,22–0,35 (kulüp ve haftadan); deplasman payı 0,08 */
  const statKur=(ev,evAd,biz,hafta)=>{
    if(!ev||ev===biz)return{stat:'kulup',statTarifi:STADYUMLAR.kulup,doluluk:0.3,deplasman:0.08,zemin:STADYUMLAR.kulup.zemin};
    const T=statTarifiUret(ev,evAd);
    return{stat:ev,statTarifi:T,doluluk:+(0.22+0.13*h2(hafta|0,parseInt(saglamaHesapla('doluluk:'+ev),16)|0)).toFixed(2),deplasman:0.08,zemin:T.zemin};
  };
  let macId=null,evOn=null;try{const q=new URLSearchParams(location.search);macId=q.get('mac');evOn=q.get('ev');}catch(e){}
  /* geliştirme: ?ev=<kulüp> kariyersiz maçı o kulübün statında açar (tarif önizlemesi; kadrolar ve taraflar aynı) */
  if(!macId){const ev=evOn&&LIG.takimlar.some(t=>t.id===evOn)?evOn:null;return Object.assign(sabit(),statKur(ev,ad(ev),'demirkapi',B.hafta));}
  try{
    oyunBaslat();
    const k=OYUN.kariyer;
    if(!k)throw new Error(OYUN.bozukHata||'Kayıtlı kariyer açılamadı');
    const is=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'&&x.veri.macId===macId);
    if(!is)throw new Error('Bu maçın günü kariyerde bekleyen bir iş değil');
    const girdi=macGirdisi(k,macId),biz=(k.kisiler[k.baskanId]||{}).kulupId;
    oyunKomut(x=>ajandaIsiYap(x,is.id),true);
    if(OYUN.kariyer.isler[is.id]){OYUN.oturum.kaydet();throw new Error('Stada giderken yolda karar gerektiren bir haber geldi; maç günü bekliyor');}
    return Object.assign(girdi,statKur(girdi.ev,k.kulupler[girdi.ev].ad,biz,girdi.hafta));
  }catch(e){
    try{history.replaceState(null,'',location.pathname);}catch(x){}
    if(typeof OYUN!=='undefined')OYUN.mesaj='Maç günü açılamadı: '+e.message;
    return Object.assign(sabit(),statKur(null),{hata:e.message});
  }
})();
/* bu maçın stat tarifi (yüklemede bir kez; stat, seyirci, tünel ve kulübeler bundan kurulur) */
const STAT={...MAC_GUNU.statTarifi,zemin:MAC_GUNU.zemin};
