/* ============ Chairman — kayıt ve yükleme (çizim yok, platformdan bağımsız) ============
   Kariyer kuralları dosya yolunu ya da tarayıcı deposunu bilmez. Depo üç işlevli bir nesnedir:
     oku(ad) → metin ya da null · yaz(ad, metin) · sil(ad)
   Uygulamalar: bellekDeposu() (bu dosyada; denemeler için), tarayiciDeposu() (js/depo-tarayici.js), masaustuDeposu() (js/depo-masaustu.js).

   Kayıt zarfı (JSON metin): {oyun:'chairman', bicim:1, saglama, ozet, veri}
     veri: kariyer durumu (sürümü veri.kayitSurumu). saglama: veri metninin FNV-1a özeti; yarım ya da bozulmuş yazımı yakalar.
     ozet: kayıt listesinde gösterilebilecek kısa bilgi (tarih, başkan, kulüp, nakit); yüklemede kullanılmaz.
   Bir yuva ('kariyer-1' gibi) üç ad kullanır: <yuva> ana kayıt, <yuva>.onceki son sağlam önceki kayıt, <yuva>.yeni yazılmakta olan.
   Yazma sırası: doğrula → .yeni yaz ve geri oku → sağlam ana kaydı .onceki'ye taşı → ana kaydı yaz ve geri oku → .yeni'yi sil.
     Hangi adımda kesilirse kesilsin sağlam bir kayıt kalır; geçersiz kariyer hiç yazılmaz.
   Yükleme sırası: ana kayıt → .yeni (yarım kalmış kaydın tamamlanmış kopyası) → .onceki. Sağlam olan ilki yüklenir,
     atlananlar açıklamayla uyarılar listesine yazılır.
   Eski sürümlü kayıtlar KAYIT_GECISLERI ile sırayla bugünkü sürüme dönüştürülür; daha yeni sürüm açılmaz. Sürüm 6'dan eski kayıt açılmaz (2.8L).
   Kayıt oturumu (kayitOturumu, yol haritası 2.4): oyunun bütün değişiklikleri oturum.uygula(f) ile yapılır. Komut kariyerin kopyasına
     uygulanır (kariyerKomut); kabul edilince kaydedilir. Yazılamazsa kariyer yine yeni durumdadır, oturum.durum bunu söyler
     (tamam:false, bekleyen:true); oturum.kaydet() yalnız mevcut durumu yazar, komutu ikinci kez uygulamaz.
     uygula(f, true) kaydetmeden uygular (maç sınırı gibi bilinçli istisnalar): kayıt bir önceki komutta kalır.
   R1-a (2026-10-29) karşılaştırarak yazma: aynı kariyer iki pencerede açıksa geride kalan pencere öbürünün ilerlemesinin üstüne yazmasın. Oturum,
     yuvanın ana metnini “beklenen” olarak tutar (açılışta depodaki ana metin — yoksa null, bozuksa bozuk metin —, her başarılı yazımdan sonra
     yazdığı metin). kariyerKaydet beklenen verilince yazmadan önce ana metni okur; farklıysa yazmaz: {tamam:false, cakisma:true, kayittaki}.
     uygula(f) komutu uygulamadan önce aynı denetimi yapar ve çakışmada hata fırlatır (e.cakisma === true): komut uygulanmaz, bellekteki
     kariyer de ilerlemez. uygula(f, true) depoyu okumaz (gözlem gibi sık çağrılır); kalıcı çakışma bayrağına bakar, sonraki kayıt yine karşılaştırır.
     cakismaDenetle() dışarıdan (tarayıcının storage olayı) çağrılır. Çakışma kalıcıdır: oturum bir daha yazmaz; çıkış sayfayı kayıttan
     yeniden açmaktır. secenek.cakismada(durum) çakışma ilk görüldüğünde bir kez çağrılır. durum.cakisma = {kayittaki:{tarih,dakika}|null}.
     Bilinçli üstüne yazma yolları (bozuk kaydın yerine yeni kariyer: yeni oturum zaten bozuk metni bekler; içe aktarma: kayitIceAktar) ayrıdır. */
'use strict';
const KAYIT_BICIM=1;
/* sürüm geçişleri: KAYIT_GECISLERI[n] = veri → (n+1) sürümlü veri. Geçişler başka kural dosyasına bağlı olmayan veri dönüşümleridir;
   kararları yeniden oynatmaz, para hareketi üretmez.
   2.8L (2026-10-02): 1→5 geçişleri kaldırıldı. Sürüm 5 ve öncesinin kayıtları silinen içeriğe bağlıdır; açılmaz (ESKI_KAYIT_SINIRI).
   F1 (2026-10-23): sürüm 6 da açılmaz — lig, fikstür ve kadrolar kariyere geçti; içeriksiz kariyer yeniden başlatılır (YOL_HARITASI karar 36).
   F3 (2026-10-24): sürüm 7 de açılmaz — hocalar ve maçın okunması kariyere geçti (oynanmış maçların şut listesi yok); kariyer yeniden başlatılır */
const KAYIT_GECISLERI={};
/* G2 (2026-10-24 gece): 8 → 9 — sözleşme ve para akışı. Oyuncu ve hoca sözleşmeleri boş kalır (alan yok = null); başkanın kulübüne ilk ay başı işi
   eklenir (ayın 1'i 10:00, js/kulup-mali.js): o iş sözleşmeleri TEST ölçekle kurar, kadroları 22'ye tamamlar, transfer takvimini kurar. Sezon sonu
   kaydı varsa ay başı kurulmaz (yeni sezon yok). Veri dönüşümüdür: kural işlevi çağırmaz, para hareketi üretmez. G2 incelemesi: kayıt ayın 1'inde
   10:00'da ya da önceyse ilk ay başı o gündür; kış transfer döneminin gizli gelişmeleri (js/transfer.js transferTakvimiKur'un 2026-10-24 planının donmuş
   kopyası, aynı anahtarlar: sonraki ay başı çift kurmaz) geçişte eklenir — yoksa Ocak tarihli kayıtta ilk ay başı 1 Şubat olur ve dönem kaçardı */
KAYIT_GECISLERI[8]=v=>{
  v.kayitSurumu=9;
  const biz=v.kisiler&&v.kisiler[v.baskanId]&&v.kisiler[v.baskanId].kulupId;
  if(biz&&v.gorevDurumu==='gorevde'&&!(v.sezon&&v.sezon.sonuc)&&typeof v.tarih==='string'){
    const [y,a,g]=v.tarih.split('-').map(Number),dk=v.gunIciDakika|0,bu=g===1&&dk<=600,Y=bu||a<12?y:y+1,A=bu?a:a===12?1:a+1;
    const ekle=(tur,tarih,dakika,veri)=>{const no=v.sonrakiNo.is,id='is-'+no;v.isler=Object.assign({},v.isler,{[id]:{id,tur,tarih,dakika,veri}});v.sonrakiNo=Object.assign({},v.sonrakiNo,{is:no+1});};
    ekle('ayBasi',`${Y}-${String(A).padStart(2,'0')}-01`,600,{kulupId:biz});
    if(v.icerik&&v.icerik.surum>=5)for(const d of (v.sezon&&v.sezon.transfer)||[])
      for(const [gelisme,gun,i] of [['gelenTeklif',3,0],['gelenTeklif',12,1],['gelenTeklif',22,2],['hocaTalebi',1,0]]){
        const t=tarihEkle(d.bas,gun);if(t>d.bitis||t<v.tarih||(t===v.tarih&&dk>660))continue;   /* kaydın anındaki iş sürüm 8'de işlenmemişti */
        ekle('gelisme',t,660,{gelisme,kulupId:biz,anahtar:`${d.bas}:${gelisme}:${i}`});}
  }
  return v;
};
/* H2-c (2026-10-26): 9 → 10 — kişiler ve yazışma (YOL_HARITASI karar 50). macOkundu kalkar (hocanın otomatik maç yorumu kalktı); başkan görevdeyse ve
   kulübünde o rolde aktif kişi yoksa yardımcı antrenör ve mali işler müdürü eklenir (ad ve doğum tarihi js/yazisma.js PERSONEL_TEST'in donmuş kopyası).
   Açık kararlar değişmez. Veri dönüşümüdür: kural işlevi çağırmaz, para hareketi üretmez */
const KAYIT_PERSONEL_9={yardimciAntrenor:{ad:'Tahsin',dogumTarihi:'1979-03-14'},maliMudur:{ad:'Nusret Bey',dogumTarihi:'1968-09-22'}};
/* S-a (2026-10-27): sürüm 10 → 11 düz veri dönüşümüdür: yalnız sürüm artar. Yeni alanlar (oyuncu hal, mac/dk; gözlem sinyalleri; disarida; gazeteOkunan)
   yoksa anlamları vardır (tam kondisyon, nötr form, sayaç bilinmiyor, sinyalsiz, notsuz, okunmamış); kural işlevi çağrılmaz, para, iş ya da haber üretilmez */
KAYIT_GECISLERI[10]=v=>{v.kayitSurumu=11;return v;};
KAYIT_GECISLERI[9]=v=>{
  v.kayitSurumu=10;delete v.macOkundu;
  const biz=v.kisiler&&v.kisiler[v.baskanId]&&v.kisiler[v.baskanId].kulupId;
  if(biz&&v.gorevDurumu==='gorevde')for(const [rol,T] of Object.entries(KAYIT_PERSONEL_9)){
    if(Object.values(v.kisiler).some(p=>p&&p.rol===rol&&p.kulupId===biz&&p.durum==='aktif'))continue;
    const no=v.sonrakiNo.kisi,id='kisi-'+no;
    v.kisiler=Object.assign({},v.kisiler,{[id]:{id,ad:T.ad,rol,dogumTarihi:T.dogumTarihi,kulupId:biz,durum:'aktif'}});
    v.sonrakiNo=Object.assign({},v.sonrakiNo,{kisi:no+1});
  }
  /* H2-d: başkan görevdeyse ve sezon sonu kaydı yoksa kaydın anına haftalık mali rapor işi (ilk ilerlemede ilk rapor gelir, zincir başlar; geçmiş haftalar için
     rapor uydurulmaz) */
  if(biz&&v.gorevDurumu==='gorevde'&&!(v.sezon&&v.sezon.sonuc)&&typeof v.tarih==='string'&&!Object.values(v.isler||{}).some(x=>x&&x.tur==='maliRapor')){
    const no=v.sonrakiNo.is,id='is-'+no;v.isler=Object.assign({},v.isler,{[id]:{id,tur:'maliRapor',tarih:v.tarih,dakika:v.gunIciDakika|0,veri:{kulupId:biz}}});v.sonrakiNo=Object.assign({},v.sonrakiNo,{is:no+1});}
  return v;
};
const ESKI_KAYIT_SINIRI=8;                   // bu sürümden eski kayıt dönüştürülmez
/* eski sürümün neden açılmadığı (oyuncuya söylenir); listede olmayan eski sürüm 2.8L nedenini alır */
const ESKI_KAYIT_NEDENI={6:'lig, fikstür ve kadrolar kariyere geçtiği için',7:'hocalar ve maçın okunması kariyere geçtiği için'};

/* FNV-1a 32 bit: güvenlik için değil, yarım/bozuk yazımı yakalamak için */
function saglamaHesapla(s){
  let h=0x811c9dc5;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193);}
  return(h>>>0).toString(16).padStart(8,'0');
}

/* kariyeri kayıt metnine çevirir; geçersiz kariyerde hata fırlatır */
function kayitMetni(k){
  const h=kariyerDogrula(k);
  if(h.length)throw new Error('Kariyer tutarsız olduğu için kaydedilmedi: '+h.slice(0,3).join('; '));
  const veri=JSON.stringify(k),c=k.kulupler[(k.kisiler[k.baskanId]||{}).kulupId];
  const ozet={tarih:k.tarih,dakika:k.gunIciDakika,baskan:k.kisiler[k.baskanId].ad,gorev:k.gorevDurumu,kulup:c?c.ad:null,nakit:c?c.nakit:null};
  return`{"oyun":"chairman","bicim":${KAYIT_BICIM},"saglama":"${saglamaHesapla(veri)}","ozet":${JSON.stringify(ozet)},"veri":${veri}}`;
}

/* kayıt metnini okur: {tamam:true, kariyer, gecisler} ya da {tamam:false, hata} */
function kayitCoz(metin){
  if(typeof metin!=='string'||!metin)return{tamam:false,hata:'Kayıt boş'};
  let z;
  try{z=JSON.parse(metin);}catch(e){return{tamam:false,hata:'Kayıt okunamadı: dosya bozuk ya da yarım yazılmış'};}
  if(!z||z.oyun!=='chairman')return{tamam:false,hata:'Bu bir Chairman kaydı değil'};
  if(z.bicim!==KAYIT_BICIM)return{tamam:false,hata:`Desteklenmeyen kayıt biçimi: ${z.bicim}`};
  if(!z.veri||typeof z.veri!=='object')return{tamam:false,hata:'Kayıtta kariyer verisi yok'};
  if(saglamaHesapla(JSON.stringify(z.veri))!==z.saglama)return{tamam:false,hata:'Kayıt bozulmuş: sağlama tutmuyor'};
  let k=z.veri;const gecisler=[];
  if(!Number.isInteger(k.kayitSurumu))return{tamam:false,hata:'Kayıt sürümü okunamadı'};
  if(k.kayitSurumu>KARIYER_SURUM)return{tamam:false,hata:`Bu kayıt oyunun daha yeni bir sürümüyle yapılmış (kayıt sürümü ${k.kayitSurumu}); bu sürüm açamaz`};
  if(k.kayitSurumu<ESKI_KAYIT_SINIRI&&!KAYIT_GECISLERI[k.kayitSurumu])return{tamam:false,eski:true,hata:`Bu kayıt oyunun eski bir sürümüne ait (kayıt sürümü ${k.kayitSurumu}); ${ESKI_KAYIT_NEDENI[k.kayitSurumu]||'o sürümün içeriği kaldırıldığı için'} açılamaz`};
  while(k.kayitSurumu<KARIYER_SURUM){
    const g=KAYIT_GECISLERI[k.kayitSurumu];
    if(!g)return{tamam:false,hata:`Kayıt sürümü ${k.kayitSurumu} için dönüşüm yok`};
    const once=k.kayitSurumu;
    try{k=g(k);}catch(e){return{tamam:false,hata:`Sürüm ${once} dönüşümü başarısız: ${e.message}`};}
    if(!k||k.kayitSurumu!==once+1)return{tamam:false,hata:`Sürüm ${once} dönüşümü sürümü ilerletmedi`};
    gecisler.push(`${once}→${once+1}`);
  }
  const h=kariyerDogrula(k);
  if(h.length)return{tamam:false,hata:'Kayıt tutarsız: '+h.slice(0,3).join('; ')+(h.length>3?` (+${h.length-3} hata)`:'')};
  return{tamam:true,kariyer:k,gecisler};
}

const KAYIT_CAKISMA_METNI='Bu kariyer başka bir pencerede ilerledi; bu pencerenin değişikliği kaydedilmedi';
/* kayıt zarfının ozet alanından tarih ve dakika (zarfı çözmeden; ozet veri'den önce yazılır). Okunamazsa null */
function kayitOzeti(metin){
  if(typeof metin!=='string')return null;
  const m=/"ozet":(\{[^{}]*\})/.exec(metin.slice(0,4000));
  try{const o=m&&JSON.parse(m[1]);return o&&typeof o.tarih==='string'?{tarih:o.tarih,dakika:o.dakika|0}:null;}catch(e){return null;}
}
function cakismaHatasi(){const e=new Error(KAYIT_CAKISMA_METNI);e.cakisma=true;return e;}
/* depoya güvenli yazım: yazılanı geri okuyup karşılaştırır */
function yazVeDogrula(depo,ad,metin){
  depo.yaz(ad,metin);
  if(depo.oku(ad)!==metin)throw new Error(`${ad} yazıldı fakat geri okunan içerik farklı`);
}

/* kariyeri yuvaya kaydeder: {tamam:true, metin} ya da {tamam:false, hata}. Hata durumunda önceki sağlam kayıt yerinde kalır.
   saglamMetin (isteğe bağlı): bu yuvaya son başarıyla yazılan metin; ana kayıt hâlâ oysa yeniden çözülmeden .onceki'ye taşınır (F1: kayıt
   120 KB, çözmek tarayıcıda ~5 ms; gözlem her 15 oyun dakikasında kaydeder).
   beklenen (isteğe bağlı, R1-a): verilirse ana metin yazmadan önce buna eşit olmalı; değilse {tamam:false, cakisma:true, hata, kayittaki} ve depo
   değişmez. Verilmezse karşılaştırılmaz (araçlar, kayıt deneme sayfası) */
function kariyerKaydet(depo,yuva,k,saglamMetin,beklenen){
  let metin;
  try{metin=kayitMetni(k);}catch(e){return{tamam:false,hata:e.message};}
  try{
    const eski=depo.oku(yuva);
    if(beklenen!==undefined&&eski!==beklenen)return{tamam:false,cakisma:true,hata:KAYIT_CAKISMA_METNI,kayittaki:kayitOzeti(eski)};
    yazVeDogrula(depo,yuva+'.yeni',metin);
    if(eski!==null&&(eski===saglamMetin||kayitCoz(eski).tamam))yazVeDogrula(depo,yuva+'.onceki',eski);
    yazVeDogrula(depo,yuva,metin);
    depo.sil(yuva+'.yeni');
  }catch(e){return{tamam:false,hata:'Kayıt yazılamadı: '+e.message};}
  return{tamam:true,metin};
}

/* R1-b (2026-10-29) kaydı dışa ve içe aktarma. Dışa aktarılan dosya yuvanın ana metnidir (kayıt zarfı, sağlamalı; ayrı biçim yok).
   kayitIceOnizle(metin) → {tamam:true, kariyer, gecisler, ozet:{tarih,dakika,baskan,kulup}} | {tamam:false, hata}; depoya dokunmaz. Dosya yalnız
     JSON olarak çözülür (kayitCoz: sağlama, biçim, sürüm, eski sürüm geçişi, kariyerDogrula); en çok KAYIT_ICE_AZAMI karakter.
   kayitIceAktar(depo, yuva, metin) → önce önizleme; geçerliyse şimdiki ana kayıt yuva+'.ice-oncesi'ye saklanır, dosyanın kariyeri kariyerKaydet ile
     yazılır (eski sürüm bugünkü sürüme geçmiş olarak). Karşılaştırma bilinçli olarak atlanır: oyuncunun açık seçimidir; öbür pencere storage
     olayıyla çakışma örtüsüne düşer. Geçersiz dosyada depo değişmez. */
const KAYIT_ICE_AZAMI=20*1024*1024;
function kayitIceOnizle(metin){
  if(typeof metin!=='string'||!metin)return{tamam:false,hata:'Dosya boş'};
  if(metin.length>KAYIT_ICE_AZAMI)return{tamam:false,hata:'Dosya çok büyük (en çok 20 MB)'};
  const s=kayitCoz(metin);if(!s.tamam)return{tamam:false,hata:s.hata};
  const k=s.kariyer,b=k.kisiler[k.baskanId]||{},c=k.kulupler[b.kulupId]||{};
  return{tamam:true,kariyer:k,gecisler:s.gecisler,ozet:{tarih:k.tarih,dakika:k.gunIciDakika,baskan:b.ad||null,kulup:c.ad||null}};
}
function kayitIceAktar(depo,yuva,metin){
  const o=kayitIceOnizle(metin);if(!o.tamam)return o;
  try{const eski=depo.oku(yuva);if(eski!==null)yazVeDogrula(depo,yuva+'.ice-oncesi',eski);}catch(e){return{tamam:false,hata:'Şimdiki kayıt saklanamadı: '+e.message};}
  const s=kariyerKaydet(depo,yuva,o.kariyer);
  return s.tamam?{tamam:true,ozet:o.ozet,gecisler:o.gecisler}:{tamam:false,hata:s.hata};
}

/* yuvadaki kariyeri yükler: {tamam:true, kariyer, kaynak:'ana'|'yeni'|'onceki', uyarilar, gecisler}
   ya da {tamam:false, bos, hata}. bos: yuvada hiç kayıt yok */
function kariyerYukle(depo,yuva){
  const adaylar=[['ana',yuva],['yeni',yuva+'.yeni'],['onceki',yuva+'.onceki']],uyarilar=[];
  let bulunan=0;
  for(const [kaynak,ad] of adaylar){
    let metin;
    try{metin=depo.oku(ad);}catch(e){uyarilar.push(`${ad}: okunamadı (${e.message})`);continue;}
    if(metin===null)continue;
    bulunan++;
    const s=kayitCoz(metin);
    if(s.tamam)return{tamam:true,kariyer:s.kariyer,kaynak,uyarilar,gecisler:s.gecisler};
    uyarilar.push(`${ad}: ${s.hata}`);
  }
  if(!bulunan&&!uyarilar.length)return{tamam:false,bos:true,hata:`${yuva} yuvasında kayıt yok`};
  return{tamam:false,bos:false,hata:'Sağlam kayıt bulunamadı. '+uyarilar.join(' · ')};
}

/* kayıt oturumu: kariyer + yuva. kayitli: verilen kariyer zaten bu yuvadan yüklendi mi.
   durum: {tamam: son yazım başarılı mı, hata, tarih/dakika: son başarılı kaydın oyun içi anı, bekleyen: kaydedilmemiş değişiklik var mı} */
function kayitOturumu(depo,yuva,kariyer,kayitli,secenek){
  let sonMetin=null;   /* bu oturumun yuvaya son başarıyla yazdığı metin (kariyerKaydet saglamMetin) */
  let beklenen=null;   /* R1-a: yuvanın ana metninin bu oturumun bildiği hâli */
  try{beklenen=depo.oku(yuva);}catch(e){beklenen=null;}
  const cakismada=secenek&&typeof secenek.cakismada==='function'?secenek.cakismada:null;
  const cakismaKur=kayittaki=>{
    if(o.durum.cakisma)return;
    o.durum=Object.assign({},o.durum,{tamam:false,hata:KAYIT_CAKISMA_METNI,bekleyen:true,cakisma:{kayittaki:kayittaki||null}});
    if(cakismada)try{cakismada(o.durum);}catch(e){}
  };
  const o={
    kariyer,
    durum:{tamam:true,hata:null,tarih:kayitli?kariyer.tarih:null,dakika:kayitli?kariyer.gunIciDakika:null,bekleyen:!kayitli},
    /* yuvanın ana metni beklenenden farklı mı (başka pencere yazdı); farklıysa çakışmayı kurar */
    cakismaDenetle(){
      if(o.durum.cakisma)return true;
      let m;try{m=depo.oku(yuva);}catch(e){return false;}
      if(m!==beklenen){cakismaKur(kayitOzeti(m));return true;}
      return false;
    },
    kaydet(){
      if(o.durum.cakisma)return{tamam:false,cakisma:true,hata:KAYIT_CAKISMA_METNI,kayittaki:o.durum.cakisma.kayittaki};
      const s=kariyerKaydet(depo,yuva,o.kariyer,sonMetin,beklenen),d=o.durum;
      if(s.tamam){sonMetin=s.metin;beklenen=s.metin;}
      if(s.tamam)o.durum={tamam:true,hata:null,tarih:o.kariyer.tarih,dakika:o.kariyer.gunIciDakika,bekleyen:false};
      else if(s.cakisma)cakismaKur(s.kayittaki);
      else o.durum={tamam:false,hata:s.hata,tarih:d.tarih,dakika:d.dakika,bekleyen:true};
      return s;
    },
    uygula(f,kaydetme){
      if(o.durum.cakisma||(!kaydetme&&o.cakismaDenetle()))throw cakismaHatasi();
      const r=kariyerKomut(o.kariyer,f);
      o.kariyer=r.kariyer;
      if(kaydetme)o.durum.bekleyen=true;else o.kaydet();
      return r.sonuc;
    }
  };
  return o;
}

/* bellekte tutulan depo: denemeler ve depo kullanılamadığında geçici çalışma için */
function bellekDeposu(){
  const m=new Map();
  return{oku:ad=>m.has(ad)?m.get(ad):null,yaz:(ad,metin)=>{m.set(ad,String(metin));},sil:ad=>{m.delete(ad);},adlar:()=>[...m.keys()]};
}
