/* ============ Chairman — test görünümü: geliştirme aşamasında gizli değerleri okuma (çizim yok) ============
   GEÇİCİ (kullanıcı kararı, 2026-09-30): gizli değerler yalnız geliştirme ve test sırasında, "Test bilgileri" ayarı açıkken gösterilir;
   yayından önce kaldırılacaktır. Nihai üründe yönetici katkı seviyeleri, dünyanın gizli gerçeği ve futbolcu özellikleri oyuncuya gösterilmez.
   Buradaki işlevler salt okunurdur: kariyeri, kaydı ve kayıtlı rastlantıyı değiştirmez. Sunum katmanı bunları yalnız ayar açıkken çağırır.
     testKisi(k, kisiId)              gizli katkı seviyeleri [{alan, seviye}] ya da null
     testKosullar(k)                  başlangıç, devralınan gizli koşullar ve olay kayıtları [{ad, deger}]
     testOnizleme(k, isId, secim)     seçeneğin üreteceği sonuç: karar kariyerin KOPYASINDA uygulanır, ekibe verilen iş varsa kopya haber anına
                                      kadar ilerletilir. {satirlar: [metin], hata} döner
     testKadro(kulupId)               kadrodaki futbolcuların özellikleri (js/kadrolar.js; gelişim sistemi olmadığı için sabittir) */
const TEST_KATKI_ADLARI={mali:'mali',baglanti:'bağlantı',futbol:'futbol',iletisim:'iletişim'};
const TEST_SEVIYE_ADLARI={zayif:'zayıf',orta:'orta',guclu:'güçlü'};
const TEST_OZELLIKLER=['Hız','Pas','Şut','Kafa','Sürme','Müdahale','Görüş','Karar','Kalecilik','Dayanıklılık','Sertlik'];

function testKisi(k,kisiId){
  const p=k.kisiler[kisiId];
  return p&&p.katki?Object.keys(TEST_KATKI_ADLARI).map(a=>({alan:TEST_KATKI_ADLARI[a],seviye:TEST_SEVIYE_ADLARI[p.katki[a]||'orta']})):null;
}
function testKosullar(k){
  const L=[{ad:'Başlangıç',deger:k.icerik.baslangic||'—'},{ad:'İçerik sürümü',deger:String(k.icerik.surum)},{ad:'Dünya tohumu',deger:String(k.dunyaTohumu)}];
  for(const [ad,deger] of Object.entries(k.kosullar||{}))L.push({ad:'Koşul: '+ad,deger:typeof deger==='object'?JSON.stringify(deger):String(deger)});
  for(const c of Object.values(k.kulupler))if(c.sorumluluklar)for(const [alan,s] of Object.entries(c.sorumluluklar))L.push({ad:'Kalıcı sorumluluk: '+alan,deger:(k.kisiler[s.kisiId]||{}).ad||s.kisiId});
  for(const o of Object.values(k.olaylar||{}))L.push({ad:`Olay ${o.id} (${o.paket})`,deger:[o.varyant,o.durum,JSON.stringify(o.sonuc)].filter(Boolean).join(' · ')});
  const gizli=Object.values(k.isler).filter(x=>isGizli(x)).sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika));
  if(gizli.length)L.push({ad:'Bekleyen gizli gelişmeler',deger:gizli.map(x=>`${x.veri.gelisme} ${x.tarih.slice(5)} ${saatYazi(x.dakika)}`).join(' · ')});
  return L;
}
function testOnizleme(k,isId,secim){
  try{
    const y=kariyerOlustur(k),once=new Set(Object.keys(y.isler)),satirlar=[];
    const biten=ajandaIsiYap(y,isId,secim),kayit=biten.find(g=>g.isId===isId);
    if(!kayit)return{satirlar:['Bu işe giderken yolda karar gerektiren bir haber gelir; karar verilemez.'],hata:null};
    if(kayit.sonuc&&kayit.sonuc.bilgi)satirlar.push(kayit.sonuc.bilgi);
    /* bu kararın ekibe verdiği işler: kopya haber anına kadar ilerletilir */
    for(let n=0;n<3;n++){
      const ekip=Object.values(y.isler).filter(x=>x.tur==='ekip'&&!once.has(x.id)).sort((a,b)=>isSonAn(a)-isSonAn(b))[0];
      if(!ekip)break;
      once.add(ekip.id);
      const r=zamanIlerletAna(y,isSonAn(ekip),g=>g.isId===ekip.id).biten.find(g=>g.isId===ekip.id);
      if(r&&r.sonuc&&r.sonuc.bilgi)satirlar.push(`${r.tarih.slice(8)}.${r.tarih.slice(5,7)} ${saatYazi(r.dakika)} · ${r.sonuc.bilgi}`);
    }
    const kulupId=y.kisiler[y.baskanId].kulupId;
    if(typeof nakitAcigi==='function'){const a=nakitAcigi(y,kulupId);satirlar.push(a.acik?`Kasa açığı sürüyor: ${paraYazi(a.acik)}`:`Kasa açığı yok (en düşük bakiye ${paraYazi(a.enDusuk)})`);}
    return{satirlar,hata:null};
  }catch(e){return{satirlar:[],hata:e.message};}
}
function testKadro(kulupId){
  const K=typeof KADROLAR!=='undefined'?KADROLAR[kulupId]:null;
  if(!K)return null;
  const satir=(o,yedek)=>({ad:o.ad,no:o.no,yedek,mevki:o.mevki||'',oz:o.oz.slice(),ortalama:Math.round(o.oz.reduce((t,x,i)=>t+(i===8&&o.no!==1&&o.mevki!=='KL'?0:x),0)/(o.no===1||o.mevki==='KL'?11:10))});
  return{ozellikler:TEST_OZELLIKLER,oyuncular:K.oyuncular.map(o=>satir(o,false)).concat((K.yedekler||[]).map(o=>satir(o,true)))};
}
