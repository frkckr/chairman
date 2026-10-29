/* ============ Chairman — maç girdisi: kariyerden maç kadrosu, Match seçeneği ve maç günü bilgisi (çizim yok; F1-b, 2026-10-23) ============
   TEKNIK_PLAN §8: "Kariyer durumu → hocanın hazırladığı maç girdisi → Match → sonuç ve olaylar → kariyer durumuna tek uygulama". Bu dosya ilk
   oktur: kariyeri değiştirmez (saf), Node'da da yüklenir (araclar). Sonucun kariyere işlenmesi F2'dedir (macSonucuUygula).
   macKadrosu(k, kulüp, tarih, tohum): kulübün o günkü maç kadrosu, js/kadrolar.js biçiminde (motor ve çizim bunu okur):
     {id, ad, kisa, tamAd, forma, kaleciForma, taktik, td, oyuncular[11], yedekler[≤5], eksikler[{ad, no, mevki, durum, neden, donus}]}
     F3-a (2026-10-24): on biri ve kulübeyi kulübün hocası seçer (js/hoca.js hocaKadroSec: uygunluk, hocanın gürültülü değerlendirmesi, tarzı ve
     son on bire bağlılığı; kulübede kaleci ve her hattan biri). Böylece motorun "aynı mevkiden yedek" ve "geride olan forvet sokar" değişiklikleri
     her takımda çalışır. taktik.tarz hocanın tarzıdır, td.ad hocanın adı. Kayıtlar kopyadır; motor onları p.kayit olarak tutar, kariyere dokunmaz.
     Kayıtta oyuncunun kimliği (id) de vardır.
   macGirdisi(k, maçKimliği): {kariyer:true, macId, hafta, tarih, dakika, ev, konuk, biz, tohum, tarz:[ev, konuk], hocalar:[{id, ad, tarz}×2],
     kadro:[ev, konuk], bulten}
     tohum macTohumu(dünya tohumu, kimlik): aynı kariyerde aynı maç aynı oynanır. biz: başkanın kulübünün takım sırası (0 ev, 1 konuk).
     tarz: iki hocanın tarzı (Match secenek.tarz; F3'ten önce tohumdan 'dagilim'). bulten: maç öncesi ekranının verisi (lig, hafta, gün, saat,
     puan durumu, iki tarafın son beş maçı, takım adları, hocalar). */
'use strict';
const MAC_YEDEK_SAYISI=5;                      // kulübedeki yedek (tohum kadrolarındaki gibi; kulübede 6 koltuk)
const MAC_GUN_ADLARI=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const macGunAdi=t=>{const [y,a,g]=t.split('-').map(Number);return MAC_GUN_ADLARI[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
/* oyuncu o gün oynayabilir mi: cezası yok ve sakatlığı (dönüş günü) bitmiş */
const oyuncuUygunMu=(p,tarih)=>!(p.ceza&&p.ceza.mac>0)&&!(p.sakat&&tarihKarsilastir(p.sakat.donus,tarih)>0);
/* motorun ve çizimin okuduğu kayıt (kadrolar.js biçimi) + kimlik. S-a: k ve tarih verilirse oz kondisyon ve form çarpanıyla (js/oyuncu-hafta.js macOzu;
   nötr durumda birebir kopya; kariyerin oz'una yazılmaz) */
function macKaydi(p,k,tarih){
  const r={id:p.id,ad:p.ad,no:p.no,mevki:p.mevki,ayak:p.ayak,oz:k&&tarih&&typeof macOzu==='function'?macOzu(k,p,tarih):p.oz.slice(),gol:p.gol,sari:p.sari};
  for(const a of OYUNCU_GORUNUS)if(p[a]!==undefined)r[a]=p[a];
  for(const a of OYUNCU_BAYRAK)if(p[a])r[a]=true;
  return r;
}
/* maç öncesi ekranındaki eksik satırı: sakatlıkta dönüş günü, cezada maç sayısı */
function eksikSatiri(p){
  const s=p.ceza?{durum:'cezali',neden:p.ceza.neden,donus:p.ceza.mac+' maç'}:{durum:'sakat',neden:p.sakat.neden,donus:p.sakat.belirsiz?'Belirsiz':gunAyYazi(p.sakat.donus)};
  return Object.assign({ad:p.ad,no:p.no,mevki:p.mevki},s);
}
function macKadrosu(k,kulupId,tarih,tohum,se){
  const c=k.kulupler[kulupId],D=c&&c.kadro;
  if(!D)throw new Error(`Maç kadrosu kurulamadı: ${kulupId} kulübünün kadrosu yok`);
  const O=id=>k.oyuncular[id],uygun=id=>oyuncuUygunMu(O(id),tarih),h=kulupHocasi(k,kulupId),S=hocaKadroSec(k,kulupId,tarih,tohum>>>0,se);
  const ilk=S.ilk11,oyuncular=ilk.map(id=>macKaydi(O(id),k,tarih));
  if(!oyuncular.some(o=>o.kaptan)){const sira=ilk.map(O).filter(p=>p.mevki!=='KL').sort((a,b)=>a.dogumTarihi<b.dogumTarihi?-1:a.dogumTarihi>b.dogumTarihi?1:0);
    if(sira.length)oyuncular[ilk.indexOf(sira[0].id)].kaptan=true;}
  return{id:kulupId,ad:D.ad,kisa:c.kisa,tamAd:c.ad,forma:D.forma,kaleciForma:D.kaleciForma,taktik:Object.assign({},D.taktik,{tarz:h.hoca.tarz}),td:Object.assign({},D.td,{ad:h.ad}),
    oyuncular,yedekler:S.kulube.map(id=>macKaydi(O(id),k,tarih)),eksikler:D.ilk11.concat(D.yedekler).filter(id=>!uygun(id)).map(id=>eksikSatiri(O(id)))};
}
function macGirdisi(k,macId){
  const f=k.fikstur.find(x=>x.id===macId);
  if(!f)throw new Error(`Maç girdisi kurulamadı: fikstürde ${macId} yok`);
  if(k.maclar[macId])throw new Error(`Maç girdisi kurulamadı: ${macId} oynanmış`);
  const S=k.sezon,biz=(k.kisiler[k.baskanId]||{}).kulupId,ad=id=>(k.kulupler[id]||{ad:id}).ad,tohum=macTohumu(k.dunyaTohumu,macId);
  /* G1-a: 11 uygun oyuncu çıkaramayan taraf varsa maç hükmendir (girdi.hukmen); kadro yalnız sayfanın çizimi için zorla kurulur */
  const hukmen=typeof hukmenKarari==='function'?hukmenKarari(k,f):null,se=hukmen?{zorla:true}:undefined;
  const kadro=[macKadrosu(k,f.ev,f.tarih,tohum,se),macKadrosu(k,f.konuk,f.tarih,tohum,se)];
  const hocalar=[f.ev,f.konuk].map(id=>{const h=kulupHocasi(k,id);return{id:h.id,ad:h.ad,tarz:h.hoca.tarz};});
  return{kariyer:true,macId,hafta:f.hafta,tarih:f.tarih,dakika:f.dakika,ev:f.ev,konuk:f.konuk,biz:f.konuk===biz?1:0,tohum,tarz:hocalar.map(h=>h.tarz),hocalar,kadro,hukmen,
    bulten:{ligAd:S.ad,sezonAdi:S.sezonAdi,hafta:f.hafta,gun:macGunAdi(f.tarih),saat:saatYazi(f.dakika),oynanan:f.hafta-1,bolgeler:S.bolgeler,
      tablo:sezonTablosu(k),son:[sonBesMac(k,f.ev),sonBesMac(k,f.konuk)],adlar:Object.fromEntries(S.takimlar.map(id=>[id,ad(id)])),hocalar}};
}
