/* ============ Chairman — transfer alımı dosyası: kısa zincir, iki pazarlık, devir, kıvrımlar (çizim yok; R4-c…i, 2026-10-29) ============
   Plan araclar/plan/r4-uygulama.md; tasarım araclar/plan/transfer-tasarim.md. Şablon motoru js/sablon.js, pazarlık js/pazarlik.js, piyasa js/piyasa.js,
   mekânlar js/mekan.js. Bugünkü G2 iskeletinin (js/transfer.js) hocanın isteği artık bu şablonun ihtiyaç aşamasını açar; eski kayıtta bekleyen
   transferImza eski yoldan biter. Gelen teklif (satış) bugünkü gibidir.
   Zincir: ihtiyaç (kart) → araştırma (bekleme) → [dönem dışıysa uyku] → aday (kart, fırsat) → yürütme (kart: kendim / müdüre bırak) →
     kulüp pazarlığı (kart zinciri; cevap ertesi gün) ya da devir (iyi / vasat / kötü → onay kartı) → temas (kart: Telefonla / Yanına git; oyuncunun
     isteği) → oyuncu pazarlığı (maaş; kart zinciri) → sağlık (bekleme; ilçe devlet hastanesi) → imza. Kayıpta öbür aday uygunsa alternatif kartı.
   Serbest oyuncu bonservissiz: aday → temas; dönem dışında da alınabilir (TEST kural; açık soru, kullanıcınındır).
   Dönem: kulüplü oyuncuda aday aşamasından itibaren kartların son cevabı dönemin son günü 21:00'i geçmez; son gün saatlerle ilerler; dönem kapanınca
     dosya kaybolur (“Dönem kapandı”).
   Dosya verisi (m.sablon.veri): mevki, bonservis, tavan, hocaId, adaylar, kanaat {oyuncu: 'ilk'|'rotasyon'|'az'}, hedef, alternatif, alternatifKullanildi,
     satan, kapali (bu dönem bizimle oturmayan kulüpler), pazarlik (js/pazarlik.js), bekliyor, bedel, maas, istek, yuzYuze, fark, sakatGun, sakatNeden,
     kayip. Gizli değerler (alt sınır, sabır) hiçbir metinde sayı olarak geçmez.
   Kıvrımlar (SABLON_KIVRIMLARI.transferAlim; TEST): rakip araya girer (oyuncu rakibe gidebilir: dünyada dar transfer), satan son anda bedeli artırır,
     sağlık raporu, hocanın itirazı, basına sızıntı, tescil gecikmesi, rakibin oyuncusu. Metinler TEST yer tutucudur; kıvrımların içeriği kullanıcınındır.
   Başkanın girişimi: telefonda hocaya “<Hat> hattına oyuncu bulalım” (yazışma konusu; cevapta dosya açılır), masadan transferArastirt (bir oyuncu) ve
     izlemeyeGit (randevu; hocanın o oyuncu hakkındaki kanaati gerçeğe yaklaşır). Bütün sayılar TRANSFER_ALIM_TEST'tedir. */
'use strict';
const TRANSFER_ALIM_TEST={arastirma:[2,4],hocaGorus:1,adayOmur:3,yurutmeOmur:2,pazarlikOmur:2,onayOmur:2,temasOmur:2,saglikOmur:1,alternatifOmur:2,
  cevapGun:1,devirGun:[2,2],saglikGun:1,kartSaat:1080,beklemeSaat:660,sonGunCevap:120,sonGunKart:180,donemSonSaat:1260,
  butceKat:1.1,girisimBonservisKat:1.25,girisimTavanKat:1.2,devirKat:{iyi:[1.00,1.05],vasat:[1.12,1.20]},
  ligIstek:0.5,yuzYuzeAsar:0.6,yuzYuzeMaasKat:0.95,saglikKotu:0.10,saglikYasli:0.08,sakatHafta:[2,5],
  rakipIlgi:0.15,bedelArtis:0.12,bedelArtisKat:0.15,itiraz:0.6,sizinti:0.25,tescil:0.5,rakipYakin:2,
  acikEnCok:2,donemEnCok:3,kanaatPay:6,hatlar:{DEF:'Savunma',OS:'Orta saha',FV:'Forvet',KL:'Kaleci'}};
MESELE_KATEGORILERI.transfer=['Transfer','T'];
const TA=TRANSFER_ALIM_TEST;
const taHat=m=>TA.hatlar[m.sablon.veri.mevki]||m.sablon.veri.mevki;
const taMudur=k=>personelKisisi(k,'maliMudur');
const taOyuncu=(k,m)=>k.oyuncular[m.sablon.veri.hedef]||null;
const taKulupAdi=(k,id)=>id?(k.kulupler[id]||{ad:'—'}).ad:'serbest';
const taCekilis=(k,m,ek)=>kadroRastgele(k.dunyaTohumu,'ta:'+m.id+':'+ek)();
/* kulüplü hedefte dönem kuralı geçerlidir; serbest oyuncu dönem dışında da alınır (TEST) */
const taDonemGerek=(k,m)=>{const p=taOyuncu(k,m);return!p||p.kulupId!==null;};
const taSiradakiDonem=k=>((k.sezon&&k.sezon.transfer)||[]).find(d=>d.bas>k.tarih)||null;
function taKartSon(k,m,gun){
  const d=taDonemGerek(k,m)?transferDonemi(k,k.tarih):null;
  if(d&&k.tarih===d.bitis){const a=anTarih(Math.min(simdikiAn(k)+TA.sonGunKart,anDakika(d.bitis,1380)));return a;}
  let o={tarih:tarihEkle(k.tarih,gun),dakika:TA.kartSaat};
  if(d&&anDakika(o.tarih,o.dakika)>anDakika(d.bitis,TA.donemSonSaat))o={tarih:d.bitis,dakika:TA.donemSonSaat};
  return o;
}
function taBekleAn(k,m,gun){
  const d=taDonemGerek(k,m)?transferDonemi(k,k.tarih):null;
  if(d&&k.tarih===d.bitis)return anTarih(Math.min(simdikiAn(k)+TA.sonGunCevap,anDakika(d.bitis,1380)));
  let o={tarih:tarihEkle(k.tarih,gun),dakika:TA.beklemeSaat};
  if(d&&anDakika(o.tarih,o.dakika)>anDakika(d.bitis,TA.donemSonSaat-60))o={tarih:d.bitis,dakika:TA.donemSonSaat-60};
  return o;
}
const taGun=(k,m,ek,[a,b])=>a+Math.floor(taCekilis(k,m,ek)*(b-a+1));

/* ---- hocanın gözü: mevkiinin yuvalarındaki en yüksek değerlendirmesi (bilgisine bağlı yanılgı dahil; gerçek=true ise yanılgısız: yerinde izleme) ---- */
function taHocaGozu(k,p,gercek){
  const biz=bizimKulup(k),h=kulupHocasi(k,biz);if(!h)return 0;
  const H=gercek?Object.assign({},h,{hoca:Object.assign({},h.hoca,{bilgi:1})}):h;
  const Y=(hocaYuvalari(k.kulupler[biz].kadro.taktik.dizilis)||[]).filter(y=>HOCA_ROL[y.rol].cizgi===p.mevki);
  const L=Y.length?Y:[{rol:p.mevki==='KL'?'kaleci':p.mevki==='DEF'?'stoper':p.mevki==='OS'?'merkez':'forvet',taraf:null}].filter(y=>HOCA_ROL[y.rol]);
  return L.reduce((en,y)=>Math.max(en,hocaDegeri(k,H,p,y,(k.dunyaTohumu>>>0)+7,0,null)),-Infinity);
}
/* hocanın kanaati: bizim o mevkideki en zayıf on bir oyuncusuna göre (TEST eşik) */
function taKanaat(k,p,gercek){
  const biz=bizimKulup(k),D=k.kulupler[biz].kadro,ilk=D.ilk11.map(id=>k.oyuncular[id]).filter(q=>q&&q.mevki===p.mevki);
  const v=taHocaGozu(k,p,gercek),esik=ilk.length?Math.min(...ilk.map(q=>taHocaGozu(k,q,gercek))):-Infinity;
  return v>=esik?'ilk':v>=esik-TA.kanaatPay?'rotasyon':'az';
}
const TA_KANAAT_METIN={ilk:'Hemen on bire girer.',rotasyon:'Kadroya derinlik katar.',az:'Bize pek bir şey katmaz.'};
/* aday uygun mu: o mevkide, bizde değil, açık başka dosyada hedef değil, bütçeye uyar, kulübü bu dönem bizimle oturmayı kesmedi */
function taUygun(k,V,p){
  if(!p||p.mevki!==V.mevki||p.kulupId===bizimKulup(k))return false;
  if((V.kapali||[]).includes(p.kulupId))return false;
  if(maasTahmini(p,k.tarih)>V.tavan)return false;
  return p.kulupId===null||oyuncuDegeri(p,k.tarih)<=V.bonservis*TA.butceKat;
}
const taHedefteMi=(k,id,haricMesele)=>Object.values(k.meseleler||{}).some(m=>m.id!==haricMesele&&m.durum!=='kapandi'&&m.sablon&&m.sablon.ad==='transferAlim'&&(m.sablon.veri.hedef===id||m.sablon.veri.istenen===id||(m.sablon.veri.adaylar||[]).includes(id)));
function taAdaylar(k,m){
  const V=m.sablon.veri;
  if(V.istenen){const p=k.oyuncular[V.istenen];return p&&p.kulupId!==bizimKulup(k)&&!(V.kapali||[]).includes(p.kulupId)?[p]:[];}
  return Object.values(k.oyuncular).filter(p=>taUygun(k,V,p)&&!taHedefteMi(k,p.id,m.id))
    .map(p=>({p,v:taHocaGozu(k,p)})).sort((a,b)=>b.v-a.v||(a.p.id<b.p.id?-1:1)).slice(0,2).map(x=>x.p);
}
const taAcikDosyalar=k=>Object.values(k.meseleler||{}).filter(m=>m.durum!=='kapandi'&&m.sablon&&m.sablon.ad==='transferAlim');
/* hoca değişince açık dosyalar yeni hocayla sürer (bekleyen araştırma ve görüş onun adıyla döner; soranı eski hoca olan kart zaten düştü) */
HOCA_DEGISTI.push((k,kulupId,eskiId,yeniId)=>{if(kulupId!==bizimKulup(k))return;
  for(const m of taAcikDosyalar(k))if(m.sablon.veri.hocaId===eskiId)m.sablon.veri=Object.assign({},m.sablon.veri,{hocaId:yeniId});});
function taDonemDosyaSayisi(k){
  const d=transferDonemi(k,k.tarih)||taSiradakiDonem(k);if(!d)return 0;
  const bas=tarihEkle(d.bas,-60);
  return Object.values(k.meseleler||{}).filter(m=>m.sablon&&m.sablon.ad==='transferAlim'&&m.olaylar.length&&m.olaylar[0].tarih>=bas&&m.olaylar[0].tarih<=d.bitis).length;
}
/* yeni dosya açılabilir mi: engel metni ya da null */
function taAcilisEngeli(k,mevki){
  if(k.sezon&&k.sezon.sonuc)return'Sezon bitti; yeni sezon bu sürümde yok.';
  const A=taAcikDosyalar(k);
  if(mevki&&A.some(m=>m.sablon.veri.mevki===mevki&&!m.sablon.veri.istenen))return'Bu hat için dosya zaten açık.';
  if(A.length>=TA.acikEnCok)return`Aynı anda en çok ${TA.acikEnCok} transfer dosyası yürür.`;
  if(taDonemDosyaSayisi(k)>=TA.donemEnCok)return`Bu dönem en çok ${TA.donemEnCok} transfer dosyası açılır.`;
  return null;
}
function taVeri(o){return Object.assign({mevki:null,bonservis:0,tavan:0,hocaId:null,adaylar:[],kanaat:{},hedef:null,alternatif:null,alternatifKullanildi:false,
  satan:null,rakip:null,kapali:[],pazarlik:{},bekliyor:false,bedel:null,maas:null,istek:null,yuzYuze:false,fark:null,sakatGun:null,sakatNeden:null,kayip:null,istenen:null},o);}
function taAc(k,o){
  const id=sablonAc(k,'transferAlim',{baslik:o.baslik,kaynak:o.kaynak,kisiler:o.hocaId?[o.hocaId]:[],asama:o.asama,veri:taVeri(o.veri)});
  return id;
}
/* ---- kayıp ve alternatif ---- */
function taKayip(k,m,neden,anahtar,p){
  const V=m.sablon.veri,bilgi=anahtar?meseleOlay(k,m.id,anahtar,p||{}):null;V.kayip=neden;
  const o=V.alternatif&&!V.alternatifKullanildi?k.oyuncular[V.alternatif]:null;
  if(o&&neden!=='donem'&&taUygun(k,V,o)&&!(V.kapali||[]).includes(o.kulupId))return{asama:'alternatif',bilgi};
  return{asama:'kapandi',p:{sonuc:neden},bilgi};
}
const taBitir=(k,m,sonuc,anahtar,p)=>({asama:'kapandi',p:{sonuc},bilgi:anahtar?meseleOlay(k,m.id,anahtar,p||{}):null});
/* dönem kuralı: kulüplü hedefte dönem kapandıysa her geçiş kayba döner */
const taDonemKapandi=(k,m)=>taDonemGerek(k,m)&&!transferDonemi(k,k.tarih)&&!!m.sablon.veri.hedef;
const taDonemli=f=>(k,m,...a)=>taDonemKapandi(k,m)?taBitir(k,m,'donem','ta.donemBitti',{}):f(k,m,...a);
/* hedefi seç: satan kulüp, karşı taraf, oyuncunun isteği (lig seviyesi: ünü olan ya da tablodaki yerine göre üstten gelen genç) */
function taHedefSec(k,m,p){
  const V=m.sablon.veri,biz=bizimKulup(k);V.hedef=p.id;V.satan=p.kulupId;V.pazarlik={};V.bedel=null;V.maas=null;V.yuzYuze=false;V.fark=null;
  m.sablon.karsi=p.kulupId?{tur:'kulup',id:p.kulupId}:null;
  const tb=sezonTablosu(k),sira=id=>tb.findIndex(t=>t.id===id),genc=oyuncuYasi(p,k.tarih)<=23&&p.kulupId&&sira(p.kulupId)<sira(biz);
  V.istek=(p.un||genc)&&taCekilis(k,m,'istek:'+p.id)<TA.ligIstek?'lig':null;
  return p.kulupId?'yurutme':'temas';
}
/* satanın gizli alt sınırının dayanağı: değer; o mevkide fazlası varsa düşük (TEST) */
const taSatisDegeri=(k,m)=>{const p=taOyuncu(k,m);return oyuncuDegeri(p,k.tarih)*(satilikSinyali(k,p)?0.9:1);};
/* rakip yakın mı (tabloda ±rakipYakin sıra) */
function taYakinRakip(k,kulupId){const tb=sezonTablosu(k),a=tb.findIndex(t=>t.id===bizimKulup(k)),b=tb.findIndex(t=>t.id===kulupId);return a>=0&&b>=0&&Math.abs(a-b)<=TA.rakipYakin;}

/* ---- dünyada dar transfer: bir kıvrımın sonucu olarak oyuncu iki başka kulüp arasında geçer (R4-d; kullanıcı kararı 2026-10-29) ---- */
function dunyaTransferi(k,oyuncuId,yeniKulup){
  const p=k.oyuncular[oyuncuId];if(!p)throw new Error(`Dünya transferi: oyuncu yok (${oyuncuId})`);
  if(yeniKulup===bizimKulup(k)||p.kulupId===bizimKulup(k))throw new Error('Dünya transferi bizim kulübü içeremez');
  const eski=p.kulupId,bedel=p.kulupId?oyuncuDegeri(p,k.tarih):0;
  oyuncuTransfer(k,oyuncuId,yeniKulup,{bedel,sozlesme:{maas:Math.round(maasTahmini(p,k.tarih)*1.1/SOZLESME_TEST.yuvarla)*SOZLESME_TEST.yuvarla,bitis:sozlesmeBitisi(k,2)}});
  if(eski)kadroTamamla(k,eski,KADRO_HEDEF,'dunya:'+oyuncuId);
  /* alan kulüp 22'yi aşarsa en zayıf genç yedek serbest kalır (iki kaleci korunur) */
  const L=kulupOyunculari(k,yeniKulup);
  if(L.length>KADRO_HEDEF){const D=k.kulupler[yeniKulup].kadro,kl=L.filter(q=>q.mevki==='KL').length;
    const aday=D.yedekler.map(id=>k.oyuncular[id]).filter(q=>q.id!==oyuncuId&&oyuncuYasi(q,k.tarih)<=21&&(q.mevki!=='KL'||kl>KADRO_KALECI))
      .sort((a,b)=>oyuncuOrt(a)-oyuncuOrt(b)||(a.id<b.id?-1:1))[0];
    if(aday)oyuncuSerbestBirak(k,aday.id);}
  return{eski,bedel};
}

/* ---- metinler (TEST yer tutucu; kullanıcı değiştirir) ---- */
const taPara=x=>paraYazi(x);
Object.assign(MESELE_OLAYLARI,{
  'ta.ihtiyac':(k,p)=>p.kaynak==='baskan'?`${TA.hatlar[p.mevki]} hattı için oyuncu arayışını başlattın; ${kisiAdi(k,p.kisiId)} bütçe öneriyor: bonservis en çok ${taPara(p.bonservis)}, aylık maaş en çok ${taPara(p.tavan)}.`
    :`${kisiAdi(k,p.kisiId)} ${TA.hatlar[p.mevki]} hattına oyuncu istiyor: bonservis en çok ${taPara(p.bonservis)}, aylık maaş en çok ${taPara(p.tavan)}.`,
  'ta.istenen':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} için hocadan görüş istedin.`,
  'ta.onay':(k,p)=>`Bütçeyi onayladın; hoca ve ekibi adayları araştırıyor.`,
  'ta.ret':()=>'Bütçeyi onaylamadın; bu hatta şimdilik transfer yok.',
  'ta.cevapsiz':()=>'Cevap vermedin; istek düştü.',
  'ta.adaylar':(k,p)=>`${kisiAdi(k,p.kisiId)}: “Araştırma bitti; ${p.adaylar.map((id,i)=>`${kisiOyuncuAdi(k,id)} (${taKulupAdi(k,p.kulupler?p.kulupler[i]:(k.oyuncular[id]||{}).kulupId)})`).join(' ve ')}.”`,
  'ta.bulunamadi':(k,p)=>`Bütçeye uyan ${TA.hatlar[p.mevki]||''} oyuncusu bulunamadı; dosya kapandı.`,
  'ta.bekle':(k,p)=>`Adaylar hazır; transfer dönemi ${gunAyYazi(p.tarih)}'de açılınca görüşmeler başlar.`,
  'ta.donemYok':()=>'Bu sezon başka transfer dönemi yok; dosya kapandı.',
  'ta.adaySecildi':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} ile görüşmeye karar verdin.`,
  'ta.vazgecti':()=>'Vazgeçtin; dosya kapandı.',
  'ta.adayKacti':()=>'Cevap vermedin; adaylar başka kapılara yöneldi.',
  'ta.kendim':()=>'Pazarlığı kendin yürüteceksin; rakamları mali işler müdürü önerecek.',
  'ta.devret':(k,p)=>`Pazarlığı ${kisiAdi(k,p.kisiId)} yürütecek.`,
  'ta.ipucu':(k,p)=>`${kisiAdi(k,p.kisiId)}: “${p.metin}”`,
  'ta.teklif':(k,p)=>`${taKulupAdi(k,p.kulupId)} kulübüne ${taPara(p.tutar)} teklif ettin.`,
  'ta.kulupKabul':(k,p)=>`${taKulupAdi(k,p.kulupId)} ${taPara(p.tutar)} bedeli kabul etti.`,
  'ta.karsiTeklif':(k,p)=>`${taKulupAdi(k,p.kulupId)}: “${taPara(p.tutar)} olursa konuşuruz.”`,
  'ta.kopma':(k,p)=>`${taKulupAdi(k,p.kulupId)} görüşmeyi kesti.`,
  'ta.bekliyor':(k,p)=>`${p.kulupId?taKulupAdi(k,p.kulupId):kisiOyuncuAdi(k,p.oyuncuId)}: “Hâlâ cevabınızı bekliyoruz.”`,
  'ta.devirSonuc':(k,p)=>`${kisiAdi(k,p.kisiId)}: “${taPara(p.tutar)} bedelde anlaştık; onayını bekliyorum.”`,
  'ta.devirKotu':(k,p)=>`${kisiAdi(k,p.kisiId)}: “Anlaşamadık; görüşmeyi kestiler.”`,
  'ta.devirVazgec':()=>'Anlaşmayı onaylamadın; görüşme bitti.',
  'ta.temasTelefon':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} ile telefonda konuştun.`,
  'ta.temasGit':(k,p)=>`${(MEKANLAR[p.mekan]||{ad:''}).ad}: ${kisiOyuncuAdi(k,p.oyuncuId)} ile yüz yüze konuştun.`,
  'ta.istekLig':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)}: “3. Lig'e gelmeyi düşünmüyorum.”`,
  'ta.istekAsildi':(k,p)=>`Yüz yüze görüşme işe yaradı; ${kisiOyuncuAdi(k,p.oyuncuId)} gelmeye sıcak bakıyor.`,
  'ta.maasTeklif':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} için aylık ${taPara(p.tutar)}, iki yıl önerdin.`,
  'ta.oyuncuKabul':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} aylık ${taPara(p.tutar)} ile anlaştı.`,
  'ta.oyuncuKarsi':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)}: “Aylık ${taPara(p.tutar)} olursa imzalarım.”`,
  'ta.anlasamama':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} ile maaşta anlaşılamadı.`,
  'ta.saglikTemiz':(k,p)=>`Sağlık kontrolü (${MEKANLAR.devletHastanesi.ad}) temiz.`,
  'ta.saglikKotu':(k,p)=>`Sağlık raporu (${MEKANLAR.devletHastanesi.ad}): ${p.neden}; ${p.hafta} hafta kadar sürebilir.`,
  'ta.riskAlindi':()=>'Riski aldın; oyuncu sakat olarak gelecek.',
  'ta.saglikVazgec':()=>'Sağlık raporu yüzünden vazgeçtin.',
  'ta.alternatif':(k,p)=>`Öbür aday ${kisiOyuncuAdi(k,p.oyuncuId)} hâlâ uygun.`,
  'ta.kapattin':()=>'Dosyayı kapattın.',
  'ta.donemBitti':()=>'Transfer dönemi kapandı; görüşmeler sonuçsuz kaldı.',
  'ta.rakip':(k,p)=>`${kisiAdi(k,p.kisiId)}: “${taKulupAdi(k,p.kulupId)} da ${kisiOyuncuAdi(k,p.oyuncuId)} ile ilgileniyor.”`,
  'ta.rakibeGitti':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} ${taKulupAdi(k,p.kulupId)} ile anlaştı.`,
  'ta.bedelArtti':(k,p)=>`${taKulupAdi(k,p.kulupId)} son anda ${taPara(p.fark)} daha istiyor.`,
  'ta.farkOdendi':(k,p)=>`Farkı kabul ettin; bedel ${taPara(p.tutar)} oldu.`,
  'ta.itiraz':(k,p)=>`${kisiAdi(k,p.kisiId)}: “${kisiOyuncuAdi(k,p.oyuncuId)} benim oyunuma pek uymuyor, başkanım.”`,
  'ta.sizinti':(k,p)=>`Yerel gazete görüşmeyi yazdı; ${taKulupAdi(k,p.kulupId)} fiyatı yükseltti.`,
  'ta.tescil':(k,p)=>`Belgeler yetişmedi; ${kisiOyuncuAdi(k,p.oyuncuId)} ${gunAyYazi(p.tarih)} tarihine kadar oynayamayacak.`,
  'ta.rakipOyuncu':(k,p)=>`${taKulupAdi(k,p.kulupId)} rakibine oyuncu vermeye gönülsüz; pazarlık sert geçecek.`,
  'ta.izleme':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} yerinde izlendi (${(MEKANLAR[p.mekan]||{ad:''}).ad}). Hoca: “${TA_KANAAT_METIN[p.kanaat]}”`
});
MESAJ_GONDEREN['ta.ihtiyac']=(k,p)=>p.kaynak==='hoca'?p.kisiId||null:null;   /* başkanın girişiminde hocanın cevabı yazışmadan gelir */
MESAJ_METIN['ta.ihtiyac']=(k,p)=>`Başkanım, ${TA.hatlar[p.mevki].toLocaleLowerCase('tr-TR')} hattına bir oyuncu lazım. Bonservis en çok ${taPara(p.bonservis)}, maaşı ayda en çok ${taPara(p.tavan)} olsun.`;
MESAJ_GONDEREN['ta.adaylar']=pKisi('kisiId');MESAJ_GONDEREN['ta.devirSonuc']=pKisi('kisiId');MESAJ_GONDEREN['ta.devirKotu']=pKisi('kisiId');MESAJ_GONDEREN['ta.itiraz']=pKisi('kisiId');
MESAJ_METIN['ta.adaylar']=(k,p)=>`Başkanım, araştırma bitti: ${p.adaylar.map(id=>kisiOyuncuAdi(k,id)).join(' ve ')}. Ayrıntılar dosyada.`;
MESAJ_METIN['ta.devirSonuc']=(k,p)=>`Başkanım, ${taPara(p.tutar)} bedelde anlaştık. Onayınızı bekliyorum; dosyada.`;
MESAJ_METIN['ta.devirKotu']=()=>'Başkanım, anlaşamadık; görüşmeyi kestiler.';
MESAJ_METIN['ta.itiraz']=(k,p)=>`Başkanım, açık konuşayım: ${kisiOyuncuAdi(k,p.oyuncuId)} benim oyunuma pek uymuyor.`;
OLAY_KAYNAKLARI.transferEkibi=OLAY_KAYNAKLARI.transferEkibi||'Transfer ekibi';

/* ---- aday kartının yüzü ---- */
function taAdayAciklama(k,m,p){
  const V=m.sablon.veri,y=oyuncuYasi(p,k.tarih),A=[];
  A.push(`${y} yaş · ${TA.hatlar[p.mevki]||p.mevki} · ${p.kulupId?taKulupAdi(k,p.kulupId):'serbest'}`);
  if(p.kulupId)A.push(`Bu sezon ${p.mac==null?'—':p.mac} maç, ${p.gol|0} gol.`);
  else{const g=serbestSuresi(k,p);A.push(g===null?'Serbest.':`Serbest; ${Math.max(1,Math.round(g/30))} aydır boşta.`);}
  const un=unMetni(k,p);if(un)A.push(un);
  const iz=izlemeKaydi(k,p.id),kn=iz?iz.kanaat:V.kanaat[p.id];
  if(kn)A.push(`Hoca${iz?' (yerinde izledi)':''}: “${TA_KANAAT_METIN[kn]}”`);
  A.push(p.kulupId?`Tahmini bonservis ${taPara(oyuncuDegeri(p,k.tarih))}; maaş beklentisi aylık ${taPara(maasTahmini(p,k.tarih))}.`:`Bonservis yok; maaş beklentisi aylık ${taPara(maasTahmini(p,k.tarih))}.`);
  return A;
}
const TA_SAKAT_NEDEN=['menisküs sorunu','arka adale zorlanması','ayak bileği bağ sorunu','kasık ağrısı'];

/* ---- şablon ---- */
const taKart=(sinif,o)=>Object.assign({tur:'kart',sinif},o);
SABLONLAR.transferAlim={meseleTuru:'transfer',baslangic:'ihtiyac',asamalar:{
  ihtiyac:taKart('rutin',{
    giris:(k,m)=>{const V=m.sablon.veri;return meseleOlay(k,m.id,'ta.ihtiyac',{kisiId:V.hocaId,mevki:V.mevki,bonservis:V.bonservis,tavan:V.tavan,kaynak:m.sablon.kaynak});},
    baslik:(k,m)=>`Transfer: ${taHat(m)} hattı`,
    aciklama:(k,m)=>`${taHat(m)} hattı için bütçe: bonservis en çok ${taPara(m.sablon.veri.bonservis)}, aylık maaş en çok ${taPara(m.sablon.veri.tavan)}.`,
    son:(k,m)=>({tarih:tarihEkle(k.tarih,TRANSFER_TEST.cevapGun),dakika:TA.kartSaat}),soran:(k,m)=>m.sablon.veri.hocaId,
    secenekler:(k,m)=>[{id:'onayla',metin:'Bütçeyi onayla',sure:15,engel:k.sezon&&k.sezon.sonuc?'Sezon bitti':null,
        aciklama:['Hoca ve ekibi iki aday araştırır (birkaç gün).',`Bonservis en çok ${taPara(m.sablon.veri.bonservis)}.`]},
      {id:'reddet',metin:'Reddet',sure:0,aciklama:['Bu hatta şimdilik transfer yok.']}],
    uygula:(k,m,s)=>s==='onayla'?{asama:'arastirma',bilgi:meseleOlay(k,m.id,'ta.onay',{})}:taBitir(k,m,'reddedildi','ta.ret'),
    cevapsiz:{metin:()=>'Cevap vermezsen istek düşer.',uygula:(k,m)=>taBitir(k,m,'cevapsiz','ta.cevapsiz')},
    baglam:k=>({tur:'kasa',kulupId:bizimKulup(k)})}),
  hocaGorus:{tur:'bekleme',
    giris:(k,m)=>meseleOlay(k,m.id,'ta.istenen',{oyuncuId:m.sablon.veri.istenen}),
    an:(k,m)=>taBekleAn(k,m,TA.hocaGorus),bitince:(k,m)=>SABLONLAR.transferAlim.asamalar.arastirma.bitince(k,m)},
  arastirma:{tur:'bekleme',
    an:(k,m)=>taBekleAn(k,m,taGun(k,m,'arastirma',TA.arastirma)),
    bitince:(k,m)=>{
      const V=m.sablon.veri,A=taAdaylar(k,m);
      if(!A.length)return taBitir(k,m,'bulunamadi','ta.bulunamadi',{mevki:V.mevki});
      V.adaylar=A.map(p=>p.id);V.kanaat=Object.fromEntries(A.map(p=>[p.id,taKanaat(k,p)]));
      const bilgi=meseleOlay(k,m.id,'ta.adaylar',{kisiId:V.hocaId,adaylar:V.adaylar,kulupler:A.map(p=>p.kulupId)});
      if(transferDonemi(k,k.tarih)||A.every(p=>p.kulupId===null))return{asama:'aday',bilgi,dur:true};
      const d=taSiradakiDonem(k);if(!d)return taBitir(k,m,'donemYok','ta.donemYok');
      meseleOlay(k,m.id,'ta.bekle',{tarih:d.bas});return{asama:'bekle',bilgi};}},
  bekle:{tur:'uyku',kosul:(k,m)=>!!transferDonemi(k,k.tarih)&&m.sablon.veri.adaylar.some(id=>{const p=k.oyuncular[id];return m.sablon.veri.istenen?p&&p.kulupId!==bizimKulup(k):taUygun(k,m.sablon.veri,p);}),
    an:(k,m)=>{const d=taSiradakiDonem(k)||transferDonemi(k,k.tarih);return d?{tarih:d.bas,dakika:600}:{tarih:tarihEkle(k.tarih,1),dakika:600};},sonra:'aday',kayip:'donemYok'},
  donemYok:{tur:'son',giris:(k,m)=>meseleOlay(k,m.id,'ta.donemYok',{}),sonuc:()=>'donemYok'},
  aday:taKart('firsat',{
    baslik:(k,m)=>`Transfer: ${taHat(m)} adayı`,
    aciklama:(k,m)=>m.sablon.veri.adaylar.length>1?`Hoca iki aday getirdi. Hangisiyle görüşelim?`:`Hoca bir aday getirdi. Görüşelim mi?`,
    son:(k,m)=>taKartSon(k,m,TA.adayOmur),soran:(k,m)=>m.sablon.veri.hocaId,
    secenekler:(k,m)=>{const V=m.sablon.veri,A=V.adaylar.map(id=>k.oyuncular[id]),uy=p=>V.istenen?p&&p.kulupId!==bizimKulup(k):taUygun(k,V,p);
      const yuz=(id,p)=>({id,metin:p.ad,sure:0,engel:uy(p)?null:'Artık uygun değil',aciklama:taAdayAciklama(k,m,p)});
      return A.length>1?[yuz('adayA',A[0]),yuz('adayB',A[1])]:[Object.assign(yuz('gorus',A[0]),{metin:`Görüş: ${A[0].ad}`}),{id:'vazgec',metin:'Vazgeç',sure:0,aciklama:['Dosya kapanır.']}];},
    uygula:taDonemli((k,m,s)=>{const V=m.sablon.veri;if(s==='vazgec')return taBitir(k,m,'vazgecti','ta.vazgecti');
      const i=s==='adayB'?1:0,p=k.oyuncular[V.adaylar[i]];V.alternatif=V.adaylar.length>1?V.adaylar[1-i]:null;
      const bilgi=meseleOlay(k,m.id,'ta.adaySecildi',{oyuncuId:p.id});return{asama:taHedefSec(k,m,p),bilgi};}),
    cevapsiz:{metin:()=>'Cevap vermezsen adaylar başka kapılara yönelir.',uygula:(k,m)=>taBitir(k,m,'kacti','ta.adayKacti')},
    baglam:(k,m,is,s)=>{const V=m.sablon.veri,id=V.adaylar[s==='adayB'?1:0];return id?{tur:'oyuncu',oyuncuId:id}:null;}}),
  yurutme:taKart('rutin',{
    baslik:(k,m)=>`Transfer: ${(taOyuncu(k,m)||{ad:''}).ad}`,
    aciklama:(k,m)=>`${taKulupAdi(k,m.sablon.veri.satan)} ile pazarlığı kim yürütsün?`,
    son:(k,m)=>taKartSon(k,m,TA.yurutmeOmur),soran:k=>(taMudur(k)||{}).id||null,
    secenekler:(k,m)=>{const md=taMudur(k);return[{id:'kendim',metin:'Kendim yürütürüm',sure:0,aciklama:[md?`Rakamları ${md.ad} önerir; teklifleri sen verirsin.`:'Rakamları kendin tahmin edersin.']},
      md?{id:'devret',metin:`${md.ad}'e bırak`,sure:0,aciklama:['Sonuç onun pazarlık becerisine bağlı; sana yalnız sonucu getirir.']}:{id:'vazgec',metin:'Vazgeç',sure:0,aciklama:['Dosya kapanır.']}];},
    uygula:taDonemli((k,m,s)=>s==='kendim'?{asama:'kulupPazarlik',bilgi:meseleOlay(k,m.id,'ta.kendim',{})}:s==='devret'?{asama:'devir',bilgi:meseleOlay(k,m.id,'ta.devret',{kisiId:taMudur(k).id})}:taBitir(k,m,'vazgecti','ta.vazgecti')),
    cevapsiz:{metin:k=>taMudur(k)?`Cevap vermezsen pazarlığı ${taMudur(k).ad} yürütür.`:'Cevap vermezsen dosya kapanır.',
      uygula:taDonemli((k,m)=>taMudur(k)?{asama:'devir',bilgi:meseleOlay(k,m.id,'ta.devret',{kisiId:taMudur(k).id})}:taBitir(k,m,'cevapsiz','ta.cevapsiz'))}}),
  kulupPazarlik:taKart('pazarlik',{
    giris:(k,m)=>{const V=m.sablon.veri,md=taMudur(k);
      if(!V.pazarlik.bonservis)pazarlikKur(k,m,'bonservis',{deger:taSatisDegeri(k,m),oneren:md?md.id:null,konu:'pazarlik'});
      const p=taOyuncu(k,m),ip=satilikSinyali(k,p);
      return ip&&md&&!m.olaylar.some(o=>o.anahtar==='ta.ipucu')?meseleOlay(k,m.id,'ta.ipucu',{kisiId:md.id,metin:'Kulübünde forma bulamıyor; o mevkide oyuncuları fazla. Satmaya sıcak bakarlar.'}):null;},
    baslik:(k,m)=>`Pazarlık: ${(taOyuncu(k,m)||{ad:''}).ad}`,
    aciklama:(k,m)=>{const P=pazarlikDurumu(m,'bonservis');return`${taKulupAdi(k,m.sablon.veri.satan)} ile bonservis pazarlığı.${P.karsi?` Son sözleri: ${taPara(P.karsi)}.`:''}`;},
    son:(k,m)=>taKartSon(k,m,TA.pazarlikOmur),soran:k=>(taMudur(k)||{}).id||null,
    /* ekibin iki rakamı kıvrımlardan sonra, kart kurulurken (karşı tarafın sertleştiği bilinir); bekleyen kartta aynı rakamlar */
    veri:(k,m)=>{const V=m.sablon.veri;if(!V.bekliyor)pazarlikRakamlari(k,m,'bonservis');V.bekliyor=false;return{rakamlar:pazarlikDurumu(m,'bonservis').rakamlar.slice()};},
    secenekler:(k,m,is)=>{const P=pazarlikDurumu(m,'bonservis'),[a,b]=is.veri.rakamlar,on=P.oneren?kisiAdi(k,P.oneren):'Senin tahminin';
      const ust=x=>x>m.sablon.veri.bonservis?`Bütçenin (${taPara(m.sablon.veri.bonservis)}) üstünde.`:null;
      return[{id:'temkinli',metin:taPara(a),sure:15,aciklama:[`${on}: temkinli teklif.`,'Kabul görmezse karşı tarafın sabrı azalır.',ust(a)]},
        {id:'guclu',metin:taPara(b),sure:15,aciklama:[`${on}: güçlü teklif.`,'Kabul şansı yüksek; kasadan daha çok çıkar.',ust(b)]}];},
    uygula:taDonemli((k,m,s,is)=>{const t=is.veri.rakamlar[s==='guclu'?1:0];pazarlikTeklif(m,'bonservis',t);
      return{asama:'kulupCevap',bilgi:meseleOlay(k,m.id,'ta.teklif',{kulupId:m.sablon.veri.satan,tutar:t})};}),
    cevapsiz:{metin:()=>'Cevap vermezsen karşı tarafın sabrı azalır; sonra görüşmeyi keser.',
      uygula:taDonemli((k,m)=>{const V=m.sablon.veri;if(pazarlikBekledi(k,m,'bonservis')==='kopma')return taKopma(k,m);
        V.bekliyor=true;return{asama:'kulupPazarlik',bilgi:meseleOlay(k,m.id,'ta.bekliyor',{kulupId:V.satan})};})},
    baglam:k=>({tur:'kasa',kulupId:bizimKulup(k)})}),
  kulupCevap:{tur:'bekleme',an:(k,m)=>taBekleAn(k,m,TA.cevapGun),
    bitince:taDonemli((k,m)=>{const V=m.sablon.veri,P=pazarlikDurumu(m,'bonservis'),r=pazarlikCevap(k,m,'bonservis');
      if(r==='kabul'){V.bedel=P.son;return{asama:'temas',bilgi:meseleOlay(k,m.id,'ta.kulupKabul',{kulupId:V.satan,tutar:P.son}),dur:true};}
      if(r==='karsi')return{asama:'kulupPazarlik',bilgi:meseleOlay(k,m.id,'ta.karsiTeklif',{kulupId:V.satan,tutar:P.karsi}),dur:true};
      return Object.assign(taKopma(k,m),{dur:true});})},
  devir:{tur:'devir',konu:'pazarlik',kisi:k=>taMudur(k).id,an:(k,m)=>taBekleAn(k,m,taGun(k,m,'devir',TA.devirGun)),
    bitince:taDonemli((k,m,kalite)=>{const V=m.sablon.veri,md=m.sablon.sahip;
      if(!V.pazarlik.bonservis)pazarlikKur(k,m,'bonservis',{deger:taSatisDegeri(k,m),oneren:md,konu:'pazarlik'});
      const P=pazarlikDurumu(m,'bonservis');
      if(kalite==='kotu')return Object.assign(taKopma(k,m,'ta.devirKotu',{kisiId:md}),{dur:true});
      const [a,b]=TA.devirKat[kalite],r=taCekilis(k,m,'devirBedel');V.bedel=pazarlikYuvarla(P.alt*(a+(b-a)*r),P.yuvarla);V.devirKalite=kalite;
      return{asama:'devirOnay',bilgi:meseleOlay(k,m.id,'ta.devirSonuc',{kisiId:md,tutar:V.bedel}),dur:true};})},
  devirOnay:taKart('firsat',{
    baslik:(k,m)=>`Anlaşma: ${(taOyuncu(k,m)||{ad:''}).ad}`,
    aciklama:(k,m)=>`${kisiAdi(k,m.sablon.sahip||'')} ${taKulupAdi(k,m.sablon.veri.satan)} ile ${taPara(m.sablon.veri.bedel)} bedelde anlaştı.`,
    son:(k,m)=>taKartSon(k,m,TA.onayOmur),soran:(k,m)=>m.sablon.sahip,
    secenekler:(k,m)=>[{id:'imza',metin:'Anlaşmayı onayla',sure:0,aciklama:[`Bonservis ${taPara(m.sablon.veri.bedel)}; sonra oyuncuyla görüşülür.`]},
      {id:'vazgec',metin:'Vazgeç',sure:0,aciklama:['Anlaşma bozulur.']}],
    uygula:taDonemli((k,m,s)=>s==='imza'?{asama:'temas'}:taKayip(k,m,'vazgecti','ta.devirVazgec')),
    cevapsiz:{metin:()=>'Cevap vermezsen anlaşma bozulur.',uygula:taDonemli((k,m)=>taKayip(k,m,'kacti','ta.devirVazgec'))},
    baglam:k=>({tur:'kasa',kulupId:bizimKulup(k)})}),
  bedelArtti:taKart('pazarlik',{
    baslik:(k,m)=>`Pazarlık: ${(taOyuncu(k,m)||{ad:''}).ad}`,
    aciklama:(k,m)=>`${taKulupAdi(k,m.sablon.veri.satan)} son anda ${taPara(m.sablon.veri.fark)} daha istiyor.`,
    son:(k,m)=>taKartSon(k,m,1),soran:k=>(taMudur(k)||{}).id||null,
    secenekler:(k,m)=>[{id:'farkiOde',metin:'Farkı öde',sure:0,aciklama:[`Bedel ${taPara(m.sablon.veri.bedel+m.sablon.veri.fark)} olur.`]},{id:'vazgec',metin:'Vazgeç',sure:0,aciklama:['Görüşme biter.']}],
    uygula:taDonemli((k,m,s)=>{const V=m.sablon.veri;if(s==='vazgec')return taKayip(k,m,'vazgecti','ta.vazgecti');
      V.bedel+=V.fark;return{asama:'temas',bilgi:meseleOlay(k,m.id,'ta.farkOdendi',{tutar:V.bedel})};}),
    cevapsiz:{metin:()=>'Cevap vermezsen görüşme biter.',uygula:taDonemli((k,m)=>taKayip(k,m,'kacti','ta.vazgecti'))},
    baglam:k=>({tur:'kasa',kulupId:bizimKulup(k)})}),
  temas:taKart('rutin',{
    baslik:(k,m)=>`Görüşme: ${(taOyuncu(k,m)||{ad:''}).ad}`,
    aciklama:(k,m)=>{const p=taOyuncu(k,m);return`${p.ad} ile sözleşme görüşmesi.${m.sablon.veri.istek==='lig'?' Oyuncu çekimser görünüyor.':''}`;},
    son:(k,m)=>taKartSon(k,m,TA.temasOmur),
    secenekler:(k,m)=>{const p=taOyuncu(k,m),mk=p&&p.kulupId?'karsiOfis':'oyuncununSehri',M=MEKANLAR[mk];
      return[{id:'telefon',metin:'Telefonla görüş',sure:15,aciklama:['Kısa sürer; ikna gücü zayıf.']},
        {id:'git',metin:'Yanına git',sure:mekanSuresi(mk),aciklama:[`${M.ad}: gidiş, görüşme ve dönüş ~${Math.round(mekanSuresi(mk)/60)} saat; masraf ${taPara(M.masraf)}.`,'Yüz yüze görüşme daha ikna edici.']}];},
    uygula:taDonemli((k,m,s)=>{const V=m.sablon.veri,p=taOyuncu(k,m),mk=p.kulupId?'karsiOfis':'oyuncununSehri';let bilgi;
      if(s==='git'){V.yuzYuze=true;mekanMasrafi(k,mk,bizimKulup(k),`${p.ad} görüşmesi`);bilgi=meseleOlay(k,m.id,'ta.temasGit',{oyuncuId:p.id,mekan:mk});}
      else bilgi=meseleOlay(k,m.id,'ta.temasTelefon',{oyuncuId:p.id});
      if(V.istek==='lig'){
        if(V.yuzYuze&&taCekilis(k,m,'istekAs:'+p.id)<TA.yuzYuzeAsar){V.istek=null;meseleOlay(k,m.id,'ta.istekAsildi',{oyuncuId:p.id});}
        else return taKayip(k,m,'istek','ta.istekLig',{oyuncuId:p.id});}
      return{asama:'oyuncuPazarlik',bilgi};}),
    cevapsiz:{metin:()=>'Cevap vermezsen ekip oyuncuyla telefonla görüşür.',uygula:(k,m,is)=>SABLONLAR.transferAlim.asamalar.temas.uygula(k,m,'telefon',is)}}),
  oyuncuPazarlik:taKart('pazarlik',{
    giris:(k,m)=>{const V=m.sablon.veri,md=taMudur(k),p=taOyuncu(k,m);
      if(!V.pazarlik.maas)pazarlikKur(k,m,'maas',{deger:maasTahmini(p,k.tarih)*(V.yuzYuze?TA.yuzYuzeMaasKat:1)*(eskiYildizMi(k,p)?1.15:1),oneren:md?md.id:null,konu:'pazarlik',tavan:V.tavan,yuvarla:SOZLESME_TEST.yuvarla});
      return null;},
    baslik:(k,m)=>`Maaş: ${(taOyuncu(k,m)||{ad:''}).ad}`,
    aciklama:(k,m)=>{const P=pazarlikDurumu(m,'maas');return`${taOyuncu(k,m).ad} ile maaş görüşmesi (iki yıllık sözleşme).${P.karsi?` İsteği: aylık ${taPara(P.karsi)}.`:''}`;},
    son:(k,m)=>taKartSon(k,m,TA.pazarlikOmur),soran:k=>(taMudur(k)||{}).id||null,
    veri:(k,m)=>{const V=m.sablon.veri;if(!V.bekliyor)pazarlikRakamlari(k,m,'maas');V.bekliyor=false;return{rakamlar:pazarlikDurumu(m,'maas').rakamlar.slice()};},
    secenekler:(k,m,is)=>{const P=pazarlikDurumu(m,'maas'),[a,b]=is.veri.rakamlar,on=P.oneren?kisiAdi(k,P.oneren):'Senin tahminin';
      return[{id:'temkinli',metin:`Aylık ${taPara(a)}`,sure:15,aciklama:[`${on}: temkinli teklif.`,'Kabul görmezse oyuncunun sabrı azalır.']},
        {id:'guclu',metin:`Aylık ${taPara(b)}`,sure:15,aciklama:[`${on}: güçlü teklif.`,`Maaş tavanı aylık ${taPara(m.sablon.veri.tavan)}.`]}];},
    uygula:taDonemli((k,m,s,is)=>{const t=is.veri.rakamlar[s==='guclu'?1:0];pazarlikTeklif(m,'maas',t);
      return{asama:'oyuncuCevap',bilgi:meseleOlay(k,m.id,'ta.maasTeklif',{oyuncuId:m.sablon.veri.hedef,tutar:t})};}),
    cevapsiz:{metin:()=>'Cevap vermezsen oyuncunun sabrı azalır.',
      uygula:taDonemli((k,m)=>{const V=m.sablon.veri;if(pazarlikBekledi(k,m,'maas')==='kopma')return taKayip(k,m,'anlasamama','ta.anlasamama',{oyuncuId:V.hedef});
        V.bekliyor=true;return{asama:'oyuncuPazarlik',bilgi:meseleOlay(k,m.id,'ta.bekliyor',{oyuncuId:V.hedef})};})},
    baglam:k=>({tur:'kasa',kulupId:bizimKulup(k)})}),
  oyuncuCevap:{tur:'bekleme',an:(k,m)=>taBekleAn(k,m,TA.cevapGun),
    bitince:taDonemli((k,m)=>{const V=m.sablon.veri,P=pazarlikDurumu(m,'maas'),r=pazarlikCevap(k,m,'maas');
      if(r==='kabul'){V.maas=P.son;return{asama:'saglik',bilgi:meseleOlay(k,m.id,'ta.oyuncuKabul',{oyuncuId:V.hedef,tutar:P.son}),dur:true};}
      if(r==='karsi')return{asama:'oyuncuPazarlik',bilgi:meseleOlay(k,m.id,'ta.oyuncuKarsi',{oyuncuId:V.hedef,tutar:P.karsi}),dur:true};
      return Object.assign(taKayip(k,m,'anlasamama','ta.anlasamama',{oyuncuId:V.hedef}),{dur:true});})},
  saglik:{tur:'bekleme',an:(k,m)=>taBekleAn(k,m,TA.saglikGun),
    bitince:taDonemli((k,m)=>({asama:'imza',bilgi:meseleOlay(k,m.id,'ta.saglikTemiz',{})}))},
  saglikKarari:taKart('firsat',{
    baslik:(k,m)=>`Sağlık raporu: ${(taOyuncu(k,m)||{ad:''}).ad}`,
    aciklama:(k,m)=>`Rapor: ${m.sablon.veri.sakatNeden}; ${Math.round(m.sablon.veri.sakatGun/7)} hafta kadar sürebilir.`,
    son:(k,m)=>taKartSon(k,m,TA.saglikOmur),
    secenekler:(k,m)=>[{id:'risk',metin:'Riski al',sure:0,aciklama:[`Oyuncu gelir; ${Math.round(m.sablon.veri.sakatGun/7)} hafta kadar oynayamaz.`]},
      {id:'vazgec',metin:'Vazgeç',sure:0,aciklama:['Transfer olmaz.']}],
    uygula:taDonemli((k,m,s)=>s==='risk'?{asama:'imza',bilgi:meseleOlay(k,m.id,'ta.riskAlindi',{})}:taKayip(k,m,'saglik','ta.saglikVazgec')),
    cevapsiz:{metin:()=>'Cevap vermezsen transfer olmaz.',uygula:taDonemli((k,m)=>taKayip(k,m,'saglik','ta.saglikVazgec'))}}),
  alternatif:taKart('firsat',{
    giris:(k,m)=>meseleOlay(k,m.id,'ta.alternatif',{oyuncuId:m.sablon.veri.alternatif}),
    baslik:(k,m)=>`Transfer: ${taHat(m)} hattı`,
    aciklama:(k,m)=>`${(k.oyuncular[m.sablon.veri.alternatif]||{ad:''}).ad} hâlâ uygun. Onunla görüşelim mi?`,
    son:(k,m)=>taKartSon(k,m,TA.alternatifOmur),soran:(k,m)=>m.sablon.veri.hocaId,
    secenekler:(k,m)=>{const V=m.sablon.veri,p=k.oyuncular[V.alternatif];
      return[{id:'obur',metin:`${p.ad} ile görüş`,sure:0,engel:taUygun(k,V,p)?null:'Artık uygun değil',aciklama:taAdayAciklama(k,m,p)},{id:'kapat',metin:'Dosyayı kapat',sure:0,aciklama:['Bu hatta şimdilik transfer yok.']}];},
    uygula:taDonemli((k,m,s)=>{const V=m.sablon.veri;if(s==='kapat')return taBitir(k,m,V.kayip||'vazgecti','ta.kapattin');
      const p=k.oyuncular[V.alternatif];V.alternatifKullanildi=true;V.alternatif=null;return{asama:taHedefSec(k,m,p),bilgi:meseleOlay(k,m.id,'ta.adaySecildi',{oyuncuId:p.id})};}),
    cevapsiz:{metin:()=>'Cevap vermezsen dosya kapanır.',uygula:(k,m)=>taBitir(k,m,m.sablon.veri.kayip||'kacti',null)},
    baglam:(k,m)=>({tur:'oyuncu',oyuncuId:m.sablon.veri.alternatif})}),
  imza:{tur:'son',
    giris:(k,m)=>{
      const V=m.sablon.veri,p=taOyuncu(k,m),biz=bizimKulup(k),eski=p.kulupId,bedel=V.bedel||0,maas=V.maas||Math.min(maasTahmini(p,k.tarih),V.tavan);
      oyuncuTransfer(k,p.id,biz,{bedel,sozlesme:{maas,bitis:sozlesmeBitisi(k,2)}});
      if(eski)kadroTamamla(k,eski,KADRO_HEDEF,'satis:'+p.id);
      sozlesmeleriTamamla(k);
      const q=Object.assign({},k.oyuncular[p.id]);delete q.serbest;
      if(V.sakatGun)q.sakat={neden:V.sakatNeden,donus:tarihEkle(k.tarih,V.sakatGun)};
      k.oyuncular=Object.assign({},k.oyuncular,{[p.id]:q});
      if(bedel>0)odemePlanla(k,{kulupId:biz,tarih:tarihEkle(k.tarih,1),dakika:600,tutar:-bedel,kalem:'transfer',aciklama:`${p.ad} bonservisi`,meseleId:m.id});
      if(k.transfer)takiptenCikar(k,p.id);
      const bilgi=meseleOlay(k,m.id,'tr.imza',{oyuncuId:p.id,eski,bedel,maas});
      const hc=kulupHocasi(k,biz);if(hc)meseleOlay(k,m.id,'tr.tesekkur',{kisiId:hc.id});
      return bilgi;},
    sonuc:()=>'imza'},
  kapandi:{tur:'son',sonuc:(k,m,p)=>p.sonuc||'kapandi'}
}};

/* ---- kıvrımlar (TEST; olasılıklar tek yerde, koşullar dünyanın gerçek durumundan) ---- */
SABLON_KIVRIMLARI.transferAlim=[
  /* rakip araya girer: üstümüzdeki bir kulüp de ilgilenir; satan sertleşir; sabrı biterse oyuncu o kulübe gider (dünyada dar transfer) */
  {ad:'rakipAraya',asamalar:['kulupCevap'],an:'bitis',
    kosul:(k,m)=>!!taRakipKulup(k,m),olasilik:()=>TA.rakipIlgi,
    uygula:(k,m)=>{const V=m.sablon.veri,R=taRakipKulup(k,m),md=taMudur(k)||kulupHocasi(k,bizimKulup(k));
      meseleOlay(k,m.id,'ta.rakip',{kisiId:md.id,kulupId:R,oyuncuId:V.hedef});
      const P=pazarlikSertles(m,'bonservis',1.1,1);V.rakip=R;
      if(P&&P.sabir<=0)return Object.assign(taKopma(k,m),{dur:true});
      return null;}},
  /* satan son anda bedeli artırır (kasası dar: tablonun alt yarısı) */
  {ad:'bedelArtti',asamalar:['temas'],an:'giris',
    kosul:(k,m)=>{const V=m.sablon.veri;if(!V.bedel||!V.satan||m.sablon.kivrim.includes('bedelArtti'))return false;const tb=sezonTablosu(k);return tb.findIndex(t=>t.id===V.satan)>=tb.length/2;},
    olasilik:()=>TA.bedelArtis,
    uygula:(k,m)=>{const V=m.sablon.veri;V.fark=pazarlikYuvarla(V.bedel*TA.bedelArtisKat,PAZARLIK_TEST.yuvarla);meseleOlay(k,m.id,'ta.bedelArtti',{kulupId:V.satan,fark:V.fark});return{asama:'bedelArtti'};}},
  /* sağlık raporu: yaşla artar */
  {ad:'saglikRaporu',asamalar:['saglik'],an:'bitis',kosul:()=>true,
    olasilik:(k,m)=>TA.saglikKotu+(oyuncuYasi(taOyuncu(k,m),k.tarih)>=30?TA.saglikYasli:0),
    uygula:(k,m)=>{const V=m.sablon.veri,[a,b]=TA.sakatHafta,h=a+Math.floor(taCekilis(k,m,'sakatHafta')*(b-a+1));
      V.sakatGun=h*7;V.sakatNeden=TA_SAKAT_NEDEN[Math.floor(taCekilis(k,m,'sakatNeden')*TA_SAKAT_NEDEN.length)];
      meseleOlay(k,m.id,'ta.saglikKotu',{neden:V.sakatNeden,hafta:h});return{asama:'saglikKarari'};}},
  /* hocanın itirazı: başkanın girişimiyle gelen oyuncuyu hoca az buluyorsa */
  {ad:'itiraz',asamalar:['temas'],an:'giris',
    kosul:(k,m)=>m.sablon.kaynak==='baskan'&&!!kulupHocasi(k,bizimKulup(k))&&taKanaat(k,taOyuncu(k,m))==='az',olasilik:()=>TA.itiraz,
    uygula:(k,m)=>{meseleOlay(k,m.id,'ta.itiraz',{kisiId:kulupHocasi(k,bizimKulup(k)).id,oyuncuId:m.sablon.veri.hedef});return null;}},
  /* basına sızıntı: ünlü oyuncu ya da yakın rakibin oyuncusu */
  {ad:'sizinti',asamalar:['kulupPazarlik'],an:'giris',
    kosul:(k,m)=>{const p=taOyuncu(k,m);return!!(p&&p.kulupId&&(p.un||taYakinRakip(k,p.kulupId)));},olasilik:()=>TA.sizinti,
    uygula:(k,m)=>{pazarlikSertles(m,'bonservis',1.1,0);meseleOlay(k,m.id,'ta.sizinti',{kulupId:m.sablon.veri.satan});return null;}},
  /* rakibin oyuncusu: tabloda yakın rakipten almak; satan baştan serttir */
  {ad:'rakipOyuncu',asamalar:['kulupPazarlik'],an:'giris',
    kosul:(k,m)=>!!(m.sablon.veri.satan&&taYakinRakip(k,m.sablon.veri.satan)),olasilik:()=>1,
    uygula:(k,m)=>{pazarlikSertles(m,'bonservis',1.15,0);meseleOlay(k,m.id,'ta.rakipOyuncu',{kulupId:m.sablon.veri.satan});return null;}},
  /* tescil gecikmesi: dönemin son günü akşamı imza; oyuncu sonraki döneme (yoksa sezon sonuna) dek oynayamaz */
  {ad:'tescil',asamalar:['imza'],an:'giris',
    kosul:(k,m)=>{const d=transferDonemi(k,k.tarih),p=taOyuncu(k,m);return!!(d&&p&&k.tarih===d.bitis&&k.gunIciDakika>=1020);},olasilik:()=>TA.tescil,
    uygula:(k,m)=>{const p=taOyuncu(k,m),d=taSiradakiDonem(k),t=d?d.bas:`${sezonBitisYili(k)}-06-30`;
      k.oyuncular=Object.assign({},k.oyuncular,{[p.id]:Object.assign({},k.oyuncular[p.id],{tescil:{tarih:t}})});
      meseleOlay(k,m.id,'ta.tescil',{oyuncuId:p.id,tarih:t});return null;}}
];
/* rakip kulüp: tabloda üstümüzde, satan değil, o mevkide en az iki oyuncusu olan ilk kulüp (belirlenimci) */
/* kulüple pazarlık koptu: satan kapanır; rakip araya girdiyse (kıvrım) oyuncu o kulübe gider — dünyada dar transfer, dosyada “anlaştı” */
function taKopma(k,m,anahtar,p){
  const V=m.sablon.veri,id=V.hedef,o=id&&k.oyuncular[id];V.kapali=V.kapali.concat([V.satan]);
  if(V.rakip&&o&&o.kulupId===V.satan&&k.kulupler[V.rakip]){dunyaTransferi(k,id,V.rakip);return taKayip(k,m,'rakibe','ta.rakibeGitti',{oyuncuId:id,kulupId:V.rakip});}
  return taKayip(k,m,'kopma',anahtar||'ta.kopma',p||{kulupId:V.satan});
}
function taRakipKulup(k,m){
  const V=m.sablon.veri,biz=bizimKulup(k),tb=sezonTablosu(k),i=tb.findIndex(t=>t.id===biz);
  const L=tb.slice(0,Math.max(0,i)).map(t=>t.id).filter(id=>id!==V.satan&&!(V.kapali||[]).includes(id));
  return L.length?L[Math.floor(taCekilis(k,m,'rakip')*L.length)]:null;
}

/* ---- giriş kapıları ---- */
/* hocanın isteği (bugünkü 5 Ocak paketi) artık dosyanın ihtiyaç aşamasını açar */
PAKETLER.hocaTalebi.ac=(k,olay,b)=>{
  olay.meseleId=taAc(k,{baslik:'Hocanın transfer isteği',kaynak:'hoca',hocaId:b.hocaId,veri:{mevki:b.mevki,bonservis:b.bonservis,tavan:b.tavan,hocaId:b.hocaId}});
};
{const eski=PAKETLER.hocaTalebi.degerlendir;PAKETLER.hocaTalebi.degerlendir=(k,b)=>taAcilisEngeli(k,null)?null:eski(k,b);}
/* başkanın girişimi (telefon): hocaya “<Hat> hattına oyuncu bulalım”; cevapla dosya açılır (bütçe önerisi kartta) */
function taGirisimButcesi(k,anahtar){
  const r=kadroRastgele(k.dunyaTohumu,'girisim:'+anahtar),[a,z]=TRANSFER_TEST.bonservis,L=kulupOyunculari(k,bizimKulup(k)).filter(p=>p.sozlesme);
  const ort=L.length?L.reduce((s,p)=>s+p.sozlesme.maas,0)/L.length:SOZLESME_TEST.taban;
  return{bonservis:Math.round((a+(z-a)*r())/5000000)*5000000,tavan:Math.round(ort*TRANSFER_TEST.maasTavanKat/SOZLESME_TEST.yuvarla)*SOZLESME_TEST.yuvarla};
}
for(const mevki of ['DEF','OS','FV'])yazismaKonusuEkle('transfer'+mevki,{kategori:'transfer',ad:`${TA.hatlar[mevki]} hattına oyuncu bulalım`,roller:['teknikDirektor'],aralik:0,
  aciklama:`${TA.hatlar[mevki]} hattı için oyuncu araştırmasını başlatırsın; hoca görüşünü ve bütçe önerisini yazar.`,
  uygun:k=>{const e=taAcilisEngeli(k,mevki);return e===null?true:e;},
  goruntu:(k,v)=>({mevki,zayif:zayifHat(k,bizimKulup(k))===mevki}),
  cevapla:(k,is)=>{const h=kulupHocasi(k,bizimKulup(k));if(!h||taAcilisEngeli(k,mevki))return{};
    const B=taGirisimButcesi(k,is.id);
    return{meseleId:taAc(k,{baslik:`Transfer: ${TA.hatlar[mevki]} hattı`,kaynak:'baskan',hocaId:h.id,veri:Object.assign({mevki,hocaId:h.id},B)})};},
  metin:{teknikDirektor:(k,y)=>y.p&&y.p.zayif?`Haklısınız başkanım, ${TA.hatlar[mevki].toLocaleLowerCase('tr-TR')} hattında eksiğimiz var. Bütçe önerimi dosyaya yazdım.`
    :`${TA.hatlar[mevki]} hattı bence şu an öncelik değil ama bakarım. Bütçe önerim dosyada.`}});
/* masadan: takipteki ya da piyasadaki bir oyuncu için hocaya araştırt (aday aşaması o oyuncuyla) */
function transferArastirt(k,oyuncuId){
  const p=k.oyuncular[oyuncuId],biz=bizimKulup(k),h=kulupHocasi(k,biz);
  if(!p)throw new Error(`Oyuncu bulunamadı: ${oyuncuId}`);if(!h)throw new Error('Kulübün hocası yok');
  if(p.kulupId===biz)throw new Error(`${p.ad} zaten bizim oyuncumuz`);
  if(taHedefteMi(k,oyuncuId,null))throw new Error(`${p.ad} için dosya zaten açık`);
  const e=taAcilisEngeli(k,null);if(e)throw new Error(e);
  const deger=p.kulupId?oyuncuDegeri(p,k.tarih):0;
  return taAc(k,{baslik:`Transfer: ${p.ad}`,kaynak:'baskan',hocaId:h.id,asama:'hocaGorus',
    veri:{mevki:p.mevki,istenen:p.id,hocaId:h.id,bonservis:Math.round(deger*TA.girisimBonservisKat/1000000)*1000000,
      tavan:Math.round(maasTahmini(p,k.tarih)*TA.girisimTavanKat/SOZLESME_TEST.yuvarla)*SOZLESME_TEST.yuvarla}});
}
/* masadan: yerinde izlemeye git (randevu; hocayla birlikte). Katılınca hocanın kanaati gerçeğe yaklaşır ve oyuncunun dosyasına not düşer */
function izlemeAniBul(k,sure){
  const biz=bizimKulup(k),mac=new Set((k.fikstur||[]).filter(f=>f.ev===biz||f.konuk===biz).map(f=>f.tarih));
  for(let d=1;d<=14;d++){const g=tarihEkle(k.tarih,d);if(mac.has(g))continue;
    const a=anDakika(g,840),b=a+sure;
    if(!Object.values(k.isler).some(x=>x.tur==='ajanda'&&!x.veri.saatsiz&&(()=>{const s=anDakika(x.tarih,x.dakika),e=s+(x.veri.sure||0);return s<b&&e>a;})()))return{tarih:g,dakika:840};}
  return null;
}
function izlemeyeGit(k,oyuncuId){
  const p=k.oyuncular[oyuncuId];if(!p)throw new Error(`Oyuncu bulunamadı: ${oyuncuId}`);
  if(p.kulupId===bizimKulup(k))throw new Error(`${p.ad} zaten bizim oyuncumuz`);
  if(Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.etki==='izleme'&&x.veri.oyuncuId===oyuncuId))throw new Error(`${p.ad} için izleme zaten planlandı`);
  const mk=p.kulupId?'karsiTesis':'amatorTribun',sure=mekanSuresi(mk),an=izlemeAniBul(k,sure);
  if(!an)throw new Error('Önümüzdeki iki haftada uygun bir boş gün yok');
  isEkle(k,{tur:'ajanda',tarih:an.tarih,dakika:an.dakika,veri:{baslik:`İzleme: ${p.ad}`,aciklama:`${MEKANLAR[mk].ad}; hocayla birlikte.`,zorunluluk:'istege',sure,etki:'izleme',oyuncuId,mekan:mk}});
  return an;
}
KATILIM_ETKILERI.izleme={
  denetle:(k,v)=>{const h=[];if(!(k.oyuncular||{})[v.oyuncuId])h.push('oyuncu bulunamadı');if(!MEKANLAR[v.mekan])h.push('mekân bilinmiyor');return h;},
  uygula:(k,is)=>{const v=is.veri,p=k.oyuncular[v.oyuncuId],kn=taKanaat(k,p,true),T=kariyerTransfer(k);
    T.izlenen=T.izlenen.concat([{oyuncuId:p.id,tarih:k.tarih,kanaat:kn}]);
    mekanMasrafi(k,v.mekan,bizimKulup(k),`${p.ad} izlemesi`);
    if(!takipte(k,p.id))takibeAl(k,p.id,'izleme');
    return{bilgi:MESELE_OLAYLARI['ta.izleme'](k,{oyuncuId:p.id,mekan:v.mekan,kanaat:kn})};}
};
/* ---- dosyadaki aşama satırı ve sonuç metinleri (R4-k; js/sablon.js sablonAsamaSatiri okur; TEST yer tutucu) ---- */
SABLONLAR.transferAlim.asamaMetni={ihtiyac:'Bütçe onayı bekleniyor',hocaGorus:'Hoca oyuncuya bakıyor',arastirma:'Hoca aday araştırıyor',bekle:'Transfer dönemini bekliyor',
  donemYok:'Dönem kapalı',aday:'Aday seçimi',yurutme:'Pazarlığı kim yürütecek',kulupPazarlik:'Kulüple pazarlık',kulupCevap:'Kulübün cevabı bekleniyor',
  devir:'Mali işler müdürü pazarlıkta',devirOnay:'Anlaşma onayı',bedelArtti:'Bedel arttı',temas:'Oyuncuyla görüşme',oyuncuPazarlik:'Maaş pazarlığı',
  oyuncuCevap:'Oyuncunun cevabı bekleniyor',saglik:'Sağlık kontrolü',saglikKarari:'Sağlık raporu',alternatif:'Alternatif aday',imza:'İmza',kapandi:'Kapandı'};
SABLONLAR.transferAlim.sonucMetni={imza:'İmzalandı',reddedildi:'İstek reddedildi',cevapsiz:'Cevapsız kaldı',bulunamadi:'Aday bulunamadı',donem:'Dönem kapandı',
  kacti:'Fırsat kaçtı',vazgecti:'Vazgeçildi',anlasamama:'Oyuncuyla anlaşılamadı',istek:'Oyuncunun isteği karşılanmadı',kopma:'Kulüple pazarlık koptu',
  rakibe:'Oyuncu başka kulübe gitti',saglik:'Sağlık raporu yüzünden vazgeçildi',dustu:'Dosya düştü',kapandi:'Kapandı'};
/* ---- Transfer masası (R4-k; okuma, saf; çizim js/ekran-transfer.js) ----
   transferMasasi(k) → {donem, kasa, dosyalar, teklifler, takip, piyasa, gecmis}
     donem: {acik, bas, bitis, kalanGun, sonGun} (açık dönem ya da sıradaki; yoksa null)
     dosyalar: açık transfer dosyaları {id, baslik, satir, oyuncuId, karar, kaynak}; teklifler: cevap bekleyen gelen teklifler {isId, meseleId, oyuncuId, alici, bedel}
     takip: {oyuncuId, tarih, kaynak, kanaat|null, dosya|null}; piyasa: piyasaListesi'nin kimlikleri; gecmis: {gelen, giden, kacan} (yeniden eskiye)
   transferOyuncu(k, id) → masadaki oyuncu kâğıdı: kimlik (Canlı Skor oyuncu sayfası), bildiklerimiz (kaynaklı satırlar), takipte, dosya, engeller */
function transferMasasi(k){
  const biz=bizimKulup(k),T=k.transfer||{takip:[],izlenen:[]},D=(k.sezon&&k.sezon.transfer)||[];
  const ac=transferDonemi(k,k.tarih),son=ac||D.find(t=>t.bas>k.tarih)||null;
  const donem=son?{acik:!!ac,bas:son.bas,bitis:son.bitis,kalanGun:ac?gunFarki(k.tarih,ac.bitis):gunFarki(k.tarih,son.bas),sonGun:!!ac&&k.tarih===ac.bitis}:null;
  const kart=m=>Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.karar&&x.veri.meseleId===m.id);
  const dosyalar=taAcikDosyalar(k).map(m=>({id:m.id,baslik:m.baslik,satir:sablonAsamaSatiri(k,m).metin,oyuncuId:m.sablon.veri.hedef||m.sablon.veri.istenen||null,karar:kart(m),kaynak:m.sablon.kaynak}));
  const teklifler=Object.values(k.isler).filter(x=>x.tur==='ajanda'&&x.veri.karar==='teklifKarari').map(x=>({isId:x.id,meseleId:x.veri.meseleId||null,oyuncuId:x.veri.oyuncuId,alici:x.veri.alici,bedel:x.veri.bedel}));
  const dosyasi=id=>{const m=taAcikDosyalar(k).find(m=>m.sablon.veri.hedef===id||m.sablon.veri.istenen===id);return m?m.id:null;};
  const takip=T.takip.slice().reverse().map(x=>{const iz=izlemeKaydi(k,x.oyuncuId);return{oyuncuId:x.oyuncuId,tarih:x.tarih,kaynak:x.kaynak,kanaat:iz?iz.kanaat:null,dosya:dosyasi(x.oyuncuId)};});
  const P=piyasaListesi(k),ids=L=>L.map(p=>p.id);
  const G=(k.gecmis||[]).filter(g=>g.tur==='transfer'),gelen=[],giden=[];
  for(let i=G.length-1;i>=0;i--){const g=G[i];if(g.yeni===biz)gelen.push({oyuncuId:g.oyuncuId,tarih:g.tarih,eski:g.eski||null,bedel:g.bedel||0});
    else if(g.eski===biz)giden.push({oyuncuId:g.oyuncuId,tarih:g.tarih,yeni:g.yeni||null,bedel:g.bedel||0});}
  const KACAN=['rakibe','kopma','anlasamama','istek','kacti','saglik'];
  const kacan=Object.values(k.meseleler||{}).filter(m=>m.durum==='kapandi'&&m.sablon&&m.sablon.ad==='transferAlim'&&KACAN.includes(m.sablon.sonuc)&&m.sablon.veri.hedef)
    .sort((a,b)=>(b.kapanis?anDakika(b.kapanis.tarih,b.kapanis.dakika):0)-(a.kapanis?anDakika(a.kapanis.tarih,a.kapanis.dakika):0))
    .map(m=>{const p=k.oyuncular[m.sablon.veri.hedef];return{meseleId:m.id,oyuncuId:p?p.id:null,sonuc:SABLONLAR.transferAlim.sonucMetni[m.sablon.sonuc],tarih:m.kapanis?m.kapanis.tarih:null,
      simdi:p?p.kulupId:null,mac:p&&Number.isInteger(p.mac)?p.mac:null,gol:p?p.gol|0:0};}).filter(x=>x.oyuncuId);
  return{donem,kasa:k.kulupler[biz].nakit,dosyalar,teklifler,takip,piyasa:{serbest:ids(P.serbest),satilik:ids(P.satilik),bitiyor:ids(P.bitiyor)},gecmis:{gelen,giden,kacan}};
}
function transferOyuncu(k,id){
  const p=k.oyuncular[id];if(!p)return null;
  const biz=bizimKulup(k),S=oyuncuSayfasi(k,id),B=[],iz=izlemeKaydi(k,id),tk=(k.transfer?k.transfer.takip:[]).find(x=>x.oyuncuId===id)||null;
  const gun=serbestSuresi(k,p);
  if(p.kulupId===null)B.push({metin:gun!==null?`Sözleşmesi yok; ${gun<60?gun+' gündür':Math.round(gun/30)+' aydır'} boşta.`:'Sözleşmesi yok.',kaynak:'Piyasa'});
  const un=unMetni(k,p);if(un)B.push({metin:un,kaynak:'Basın arşivi'});
  const sat=satilikSinyali(k,p);if(sat)B.push({metin:sat,kaynak:'Kulislerden'});
  if(sozlesmeBitiyor(k,p))B.push({metin:'Sözleşmesi bu sezonun sonunda bitiyor.',kaynak:'Kulislerden'});
  if(iz)B.push({metin:TA_KANAAT_METIN[iz.kanaat],kaynak:`İzleme (${gunAyYazi(iz.tarih)})`});
  const m=taAcikDosyalar(k).find(m=>m.sablon.veri.hedef===id||m.sablon.veri.istenen===id)||null;
  const bizim=p.kulupId===biz,h=kulupHocasi(k,biz);
  let arastirt=null;if(bizim)arastirt='Bizim oyuncumuz.';else if(m)arastirt='Bu oyuncu için dosya açık.';else if(!h)arastirt='Kulübün hocası yok.';else arastirt=taAcilisEngeli(k,null);
  const izle=bizim?'Bizim oyuncumuz.':Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.etki==='izleme'&&x.veri.oyuncuId===id)?'İzleme planlandı.':null;
  const izlemeIsi=Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.etki==='izleme'&&x.veri.oyuncuId===id)||null;
  return{kimlik:S,bildiklerimiz:B,takipte:!!tk,takipTarih:tk?tk.tarih:null,dosya:m?m.id:null,izleme:izlemeIsi?{tarih:izlemeIsi.tarih,dakika:izlemeIsi.dakika}:null,
    engel:{takip:bizim?'Bizim oyuncumuz.':null,arastirt,izle}};
}
