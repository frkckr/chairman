/* ============ Chairman — maç girdisi: kariyerden maç kadrosu, Match seçeneği ve maç günü bilgisi (çizim yok; F1-b, 2026-10-23) ============
   TEKNIK_PLAN §8: "Kariyer durumu → hocanın hazırladığı maç girdisi → Match → sonuç ve olaylar → kariyer durumuna tek uygulama". Bu dosya ilk
   oktur: kariyeri değiştirmez (saf), Node'da da yüklenir (araclar). Sonucun kariyere işlenmesi F2'dedir (macSonucuUygula).
   macKadrosu(k, kulüp, tarih): kulübün o günkü maç kadrosu, js/kadrolar.js biçiminde (motor ve çizim bunu okur):
     {id, ad, kisa, tamAd, forma, kaleciForma, taktik, td, oyuncular[11], yedekler[≤5], eksikler[{ad, no, mevki, durum, neden, donus}]}
     Hoca seçimi F3'te gelir; bugün kadronun ilk 11'i yerinde oynar, sakat ya da cezalı olanın yerine yedeklerden aynı mevkideki ilk uygun
     oyuncu girer (yoksa ilk uygun saha oyuncusu; kaleci yuvasına önce kaleci). Kulübede en çok MAC_YEDEK_SAYISI uygun oyuncu oturur: önce
     kaleci ve her hattan (DEF, OS, FV) ilk uygun oyuncu, kalan koltuklar tercih sırasıyla; kulübenin sırası tercih sırasıdır (kaleci ilk).
     Böylece motorun "aynı mevkiden yedek" ve "geride olan forvet sokar" değişiklikleri her takımda çalışır (F1-b incelemesi). Kayıtlar kopyadır; motor onları p.kayit olarak tutar, kariyere dokunmaz. Kayıtta oyuncunun kimliği (id) de vardır.
   macGirdisi(k, maçKimliği): {kariyer:true, macId, hafta, tarih, dakika, ev, konuk, biz, tohum, kadro:[ev, konuk], bulten}
     tohum macTohumu(dünya tohumu, kimlik): aynı kariyerde aynı maç aynı oynanır. biz: başkanın kulübünün takım sırası (0 ev, 1 konuk).
     bulten: maç öncesi ekranının verisi (lig, hafta, gün, saat, puan durumu, iki tarafın son beş maçı, takım adları). Tarz F3'e dek tohumdan. */
const MAC_YEDEK_SAYISI=5;                      // kulübedeki yedek (tohum kadrolarındaki gibi; kulübede 6 koltuk)
const MAC_GUN_ADLARI=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const macGunAdi=t=>{const [y,a,g]=t.split('-').map(Number);return MAC_GUN_ADLARI[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
/* oyuncu o gün oynayabilir mi: cezası yok ve sakatlığı (dönüş günü) bitmiş */
const oyuncuUygunMu=(p,tarih)=>!(p.ceza&&p.ceza.mac>0)&&!(p.sakat&&tarihKarsilastir(p.sakat.donus,tarih)>0);
/* motorun ve çizimin okuduğu kayıt (kadrolar.js biçimi) + kimlik */
function macKaydi(p){
  const r={id:p.id,ad:p.ad,no:p.no,mevki:p.mevki,ayak:p.ayak,oz:p.oz.slice(),gol:p.gol,sari:p.sari};
  for(const a of OYUNCU_GORUNUS)if(p[a]!==undefined)r[a]=p[a];
  for(const a of OYUNCU_BAYRAK)if(p[a])r[a]=true;
  return r;
}
/* maç öncesi ekranındaki eksik satırı: sakatlıkta dönüş günü, cezada maç sayısı */
function eksikSatiri(p){
  const s=p.ceza?{durum:'cezali',neden:p.ceza.neden,donus:p.ceza.mac+' maç'}:{durum:'sakat',neden:p.sakat.neden,donus:p.sakat.belirsiz?'Belirsiz':gunAyYazi(p.sakat.donus)};
  return Object.assign({ad:p.ad,no:p.no,mevki:p.mevki},s);
}
function macKadrosu(k,kulupId,tarih){
  const c=k.kulupler[kulupId],D=c&&c.kadro;
  if(!D)throw new Error(`Maç kadrosu kurulamadı: ${kulupId} kulübünün kadrosu yok`);
  const O=id=>k.oyuncular[id],uygun=id=>oyuncuUygunMu(O(id),tarih),M=dizilisMevkileri(D.taktik.dizilis);
  const ilk=D.ilk11.map(id=>uygun(id)?id:null),secildi=new Set(ilk.filter(Boolean)),yedekler=D.yedekler.filter(uygun);
  for(let i=0;i<11;i++){
    if(ilk[i])continue;
    const bos=yedekler.filter(id=>!secildi.has(id));
    const sec=bos.find(id=>O(id).mevki===M[i])||bos.find(id=>M[i]==='KL'||O(id).mevki!=='KL');
    if(!sec)throw new Error(`Maç kadrosu kurulamadı: ${c.ad} on bir uygun oyuncu çıkaramıyor`);
    ilk[i]=sec;secildi.add(sec);
  }
  const kalan=yedekler.filter(id=>!secildi.has(id)),kulube=new Set();
  for(const m of OYUNCU_MEVKILERI){const x=kalan.find(id=>O(id).mevki===m);if(x&&kulube.size<MAC_YEDEK_SAYISI)kulube.add(x);}
  for(const id of kalan)if(kulube.size<MAC_YEDEK_SAYISI)kulube.add(id);
  let kulubeSira=kalan.filter(id=>kulube.has(id));
  const kl=kulubeSira.find(id=>O(id).mevki==='KL');if(kl)kulubeSira=[kl,...kulubeSira.filter(id=>id!==kl)];
  const oyuncular=ilk.map(id=>macKaydi(O(id)));
  if(!oyuncular.some(o=>o.kaptan)){const sira=ilk.map(O).filter(p=>p.mevki!=='KL').sort((a,b)=>a.dogumTarihi<b.dogumTarihi?-1:a.dogumTarihi>b.dogumTarihi?1:0);
    if(sira.length)oyuncular[ilk.indexOf(sira[0].id)].kaptan=true;}
  return{id:kulupId,ad:D.ad,kisa:c.kisa,tamAd:c.ad,forma:D.forma,kaleciForma:D.kaleciForma,taktik:Object.assign({},D.taktik),td:Object.assign({},D.td),
    oyuncular,yedekler:kulubeSira.map(id=>macKaydi(O(id))),eksikler:D.ilk11.concat(D.yedekler).filter(id=>!uygun(id)).map(id=>eksikSatiri(O(id)))};
}
function macGirdisi(k,macId){
  const f=k.fikstur.find(x=>x.id===macId);
  if(!f)throw new Error(`Maç girdisi kurulamadı: fikstürde ${macId} yok`);
  if(k.maclar[macId])throw new Error(`Maç girdisi kurulamadı: ${macId} oynanmış`);
  const S=k.sezon,biz=(k.kisiler[k.baskanId]||{}).kulupId,ad=id=>(k.kulupler[id]||{ad:id}).ad;
  return{kariyer:true,macId,hafta:f.hafta,tarih:f.tarih,dakika:f.dakika,ev:f.ev,konuk:f.konuk,biz:f.konuk===biz?1:0,tohum:macTohumu(k.dunyaTohumu,macId),
    kadro:[macKadrosu(k,f.ev,f.tarih),macKadrosu(k,f.konuk,f.tarih)],
    bulten:{ligAd:S.ad,sezonAdi:S.sezonAdi,hafta:f.hafta,gun:macGunAdi(f.tarih),saat:saatYazi(f.dakika),oynanan:f.hafta-1,bolgeler:S.bolgeler,
      tablo:sezonTablosu(k),son:[sonBesMac(k,f.ev),sonBesMac(k,f.konuk)],adlar:Object.fromEntries(S.takimlar.map(id=>[id,ad(id)]))}};
}
