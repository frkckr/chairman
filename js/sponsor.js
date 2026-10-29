/* ============ Chairman — sponsor zinciri: şablon motorunun ilk kurumsal kullanıcısı (çizim yok; R6-d, 2026-10-30) ============
   Plan araclar/plan/r6-uygulama.md R6-d. Sezonda bir kez (TEST: Şubat ayının başında; sezon bitmediyse ve bu sezon sponsor dosyası açılmadıysa)
   stattaki TEST tabela markalarından biri forma göğüs reklamı önerir. Şablon `sponsor` (js/sablon.js):
     teklif (kart, fırsat; soran mali işler müdürü): Görüşelim / İlgilenmiyoruz — cevapsız: marka çekilir
     pazarlik (kart, pazarlık): ekibin iki rakamı (aylık bedel; makul ve iddialı) — tahsil yönü: markanın gizli üst sınırı ve sabrı (js/pazarlik.js)
     cevap (bekleme, 1 gün): kabul → imza; karşı teklif → yeni pazarlık kartı (rakamlar karşı teklifle son isteğimiz arasında); kopma → kapandı
     imza (son): sezon sonuna dek her ayın 1'inde kasaya aylık bedel (ödeme işleri dosyaya bağlanmaz; dosya imzayla kapanır)
   Marka adları stattaki TEST tabelalardan (js/ortak.js ADS; kulüp adı değildir), tutarlar SPONSOR_TEST; metinler TEST yer tutucu, kullanıcı değiştirir. */
'use strict';
const SPONSOR_TEST={markalar:['Şimşek Pil','Lale Kolonya','Çınar Bisküvi','Karakuş Lastik','Radyo 88'],ay:'02',aylik:[5000000,12000000],ustYari:1.3,
  cevapGun:1,kartGun:2,kartSaat:660,beklemeSaat:660};
MESELE_KATEGORILERI.kurumsal=['Kurumsal','K'];
const spPara=x=>paraYazi(x).replace(/,\d\d ₺$/,' ₺');
const spMudur=k=>personelKisisi(k,'maliMudur');
const spKartSon=k=>({tarih:tarihEkle(k.tarih,SPONSOR_TEST.kartGun),dakika:SPONSOR_TEST.kartSaat});
Object.assign(MESELE_OLAYLARI,{
  'sp.teklif':(k,p)=>`${kisiAdi(k,p.kisiId)}: “${p.marka} forma göğsü için görüşmek istiyor; ilk sözleri ayda ${spPara(p.ilk)} civarı.”`,
  'sp.ret':(k,p)=>`${p.marka} ile görüşmeyi reddettin.`,
  'sp.cevapsiz':(k,p)=>`Cevap vermedin; ${p.marka} başka kulüple görüşmeye gitti.`,
  'sp.istek':(k,p)=>`Ayda ${spPara(p.tutar)} istedin; cevap yarın.`,
  'sp.karsi':(k,p)=>`${p.marka}: “Ayda ${spPara(p.tutar)} verebiliriz.”`,
  'sp.kopma':(k,p)=>`${p.marka} görüşmeyi kesti.`,
  'sp.imza':(k,p)=>`${p.marka} ile anlaştın: sezon sonuna dek ayda ${spPara(p.tutar)} (her ayın 1'inde).`});
const spVeri=m=>m.sablon.veri;
SABLONLAR.sponsor={meseleTuru:'kurumsal',baslangic:'teklif',asamalar:{
  teklif:{tur:'kart',sinif:'firsat',
    giris:(k,m)=>{const V=spVeri(m),md=spMudur(k);return meseleOlay(k,m.id,'sp.teklif',{kisiId:md?md.id:k.baskanId,marka:V.marka,ilk:V.ilk});},
    baslik:(k,m)=>`Sponsor: ${spVeri(m).marka}`,
    aciklama:(k,m)=>`${spVeri(m).marka} forma göğüs reklamı için görüşmek istiyor (sezon sonuna dek, aylık).`,
    son:k=>spKartSon(k),soran:k=>(spMudur(k)||{}).id||null,
    secenekler:(k,m)=>[{id:'gorus',metin:'Görüşelim',sure:15,aciklama:['Mali işler müdürü iki rakam önerir; pazarlığı sen yaparsın.']},
      {id:'reddet',metin:'İlgilenmiyoruz',sure:0,aciklama:['Bu sezon forma göğsü boş kalır.']}],
    uygula:(k,m,s)=>s==='gorus'?{asama:'pazarlik'}:{asama:'kapandi',p:{sonuc:'reddedildi'},bilgi:meseleOlay(k,m.id,'sp.ret',{marka:spVeri(m).marka})},
    cevapsiz:{metin:()=>'Cevap vermezsen marka başka kulübe gider.',uygula:(k,m)=>({asama:'kapandi',p:{sonuc:'cevapsiz'},bilgi:meseleOlay(k,m.id,'sp.cevapsiz',{marka:spVeri(m).marka})})},
    baglam:k=>({tur:'kasa',kulupId:bizimKulup(k)})},
  pazarlik:{tur:'kart',sinif:'pazarlik',
    giris:(k,m)=>{const V=spVeri(m);if(!(V.pazarlik&&V.pazarlik.aylik)){const md=spMudur(k);pazarlikKur(k,m,'aylik',{deger:V.ilk,oneren:md?md.id:null,konu:'pazarlik',yon:'tahsil',yuvarla:100000});}return null;},
    veri:(k,m)=>{const V=spVeri(m);if(!V.bekliyor)pazarlikRakamlari(k,m,'aylik');V.bekliyor=false;return{rakamlar:pazarlikDurumu(m,'aylik').rakamlar.slice()};},
    baslik:(k,m)=>`Sponsor pazarlığı: ${spVeri(m).marka}`,
    aciklama:(k,m)=>{const P=pazarlikDurumu(m,'aylik');return P&&P.karsi?`${spVeri(m).marka} ayda ${spPara(P.karsi)} diyor. Ne isteyelim?`:`${spVeri(m).marka} ile aylık bedel: ne isteyelim?`;},
    son:k=>spKartSon(k),soran:k=>(spMudur(k)||{}).id||null,
    secenekler:(k,m)=>{const P=pazarlikDurumu(m,'aylik'),[a,b]=P.rakamlar||pazarlikRakamlari(k,m,'aylik'),md=spMudur(k),on=md?md.ad:'Kendi tahminin';
      return[{id:'temkinli',metin:spPara(a)+' / ay',sure:15,aciklama:[`${on}: makul istek.`,'Kabul şansı yüksek.']},
        {id:'guclu',metin:spPara(b)+' / ay',sure:15,aciklama:[`${on}: iddialı istek.`,'Kabul görmezse markanın sabrı azalır.']}];},
    uygula:(k,m,s)=>{const P=pazarlikDurumu(m,'aylik'),t=P.rakamlar[s==='guclu'?1:0];pazarlikTeklif(m,'aylik',t);
      return{asama:'cevap',bilgi:meseleOlay(k,m.id,'sp.istek',{tutar:t})};},
    cevapsiz:{metin:()=>'Cevap vermezsen markanın sabrı azalır.',uygula:(k,m)=>pazarlikBekledi(k,m,'aylik')==='kopma'
      ?{asama:'kapandi',p:{sonuc:'kopma'},bilgi:meseleOlay(k,m.id,'sp.kopma',{marka:spVeri(m).marka})}:(spVeri(m).bekliyor=true,{asama:'pazarlik'})},
    baglam:k=>({tur:'kasa',kulupId:bizimKulup(k)})},
  cevap:{tur:'bekleme',an:k=>({tarih:tarihEkle(k.tarih,SPONSOR_TEST.cevapGun),dakika:SPONSOR_TEST.beklemeSaat}),
    bitince:(k,m)=>{const V=spVeri(m),P=pazarlikDurumu(m,'aylik'),r=pazarlikCevap(k,m,'aylik');
      if(r==='kabul')return{asama:'imza',p:{tutar:P.son}};
      if(r==='karsi')return{asama:'pazarlik',bilgi:meseleOlay(k,m.id,'sp.karsi',{marka:V.marka,tutar:P.karsi}),dur:true};
      return{asama:'kapandi',p:{sonuc:'kopma'},bilgi:meseleOlay(k,m.id,'sp.kopma',{marka:V.marka}),dur:true};}},
  imza:{tur:'son',
    giris:(k,m,p)=>{const V=spVeri(m),biz=bizimKulup(k),son=`${sezonBitisYili(k)}${SOZLESME_AY_GUN}`;V.aylik=p.tutar;
      for(let t=ayBasiSonraki(k.tarih);tarihKarsilastir(t,son)<=0;t=ayBasiSonraki(t))
        odemePlanla(k,{kulupId:biz,tarih:t,dakika:600,tutar:p.tutar,kalem:'sponsor',aciklama:`${V.marka} forma sponsorluğu`});   /* dosyaya bağlanmaz: dosya imzayla kapanır, ödemeler kasada ve raporda */
      return meseleOlay(k,m.id,'sp.imza',{marka:V.marka,tutar:p.tutar});},
    sonuc:()=>'imza'},
  kapandi:{tur:'son',sonuc:(k,m,p)=>p.sonuc||'kapandi'}
}};
SABLONLAR.sponsor.asamaMetni={teklif:'Teklif: görüşelim mi',pazarlik:'Aylık bedel pazarlığı',cevap:'Markanın cevabı bekleniyor',imza:'Anlaşıldı; ödemeler her ayın 1\'inde',kapandi:'Kapandı'};
SABLONLAR.sponsor.sonucMetni={imza:'Anlaşıldı',reddedildi:'Görüşme reddedildi',cevapsiz:'Cevapsız kaldı',kopma:'Marka görüşmeyi kesti',dustu:'Dosya düştü',kapandi:'Kapandı'};
/* bir sonraki ayın 1'i (YYYY-MM-01) */
function ayBasiSonraki(t){const [y,a]=t.split('-').map(Number),Y=a===12?y+1:y,A=a===12?1:a+1;return`${Y}-${String(A).padStart(2,'0')}-01`;}
/* açılış: ay başında (Şubat), sezon sürerken ve bu sezon sponsor dosyası yoksa; marka ve ilk söz belirlenimci; üst yarıdaki kulübe daha güçlü */
function sponsorAcilisi(k){
  const T=SPONSOR_TEST;if(!k.sezon||k.sezon.sonuc||k.tarih.slice(5,7)!==T.ay)return null;
  if(Object.values(k.meseleler||{}).some(m=>m.sablon&&m.sablon.ad==='sponsor'&&m.sablon.veri.sezon===k.sezon.id))return null;
  const r=kadroRastgele(k.dunyaTohumu,'sponsor:'+k.sezon.id),marka=T.markalar[Math.floor(r()*T.markalar.length)],tb=sezonTablosu(k),i=tb.findIndex(t=>t.id===bizimKulup(k));
  const ilk=Math.round((T.aylik[0]+(T.aylik[1]-T.aylik[0])*r())*(i>=0&&i<tb.length/2?T.ustYari:1)/100000)*100000;
  return sablonAc(k,'sponsor',{baslik:`Sponsor: ${marka}`,kaynak:'dunya',kisiler:spMudur(k)?[spMudur(k).id]:[],veri:{marka,ilk,sezon:k.sezon.id,pazarlik:{},bekliyor:false,aylik:null}});
}
AY_BASI_EKLERI.push(k=>sponsorAcilisi(k)?'Sponsor teklifi geldi; dosyada.':null);
