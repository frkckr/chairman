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
     uygula(f, true) kaydetmeden uygular (maç sınırı gibi bilinçli istisnalar): kayıt bir önceki komutta kalır. */
const KAYIT_BICIM=1;
/* sürüm geçişleri: KAYIT_GECISLERI[n] = veri → (n+1) sürümlü veri. Geçişler başka kural dosyasına bağlı olmayan veri dönüşümleridir;
   kararları yeniden oynatmaz, para hareketi üretmez.
   2.8L (2026-10-02): 1→5 geçişleri kaldırıldı. Sürüm 5 ve öncesinin kayıtları silinen içeriğe bağlıdır; açılmaz (ESKI_KAYIT_SINIRI) */
const KAYIT_GECISLERI={};
const ESKI_KAYIT_SINIRI=6;                   // bu sürümden eski kayıt dönüştürülmez: içeriği oyundan kaldırıldı

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
  if(k.kayitSurumu<ESKI_KAYIT_SINIRI&&!KAYIT_GECISLERI[k.kayitSurumu])return{tamam:false,eski:true,hata:`Bu kayıt oyunun eski bir sürümüne ait (kayıt sürümü ${k.kayitSurumu}); o sürümün içeriği kaldırıldığı için açılamaz`};
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

/* depoya güvenli yazım: yazılanı geri okuyup karşılaştırır */
function yazVeDogrula(depo,ad,metin){
  depo.yaz(ad,metin);
  if(depo.oku(ad)!==metin)throw new Error(`${ad} yazıldı fakat geri okunan içerik farklı`);
}

/* kariyeri yuvaya kaydeder: {tamam:true} ya da {tamam:false, hata}. Hata durumunda önceki sağlam kayıt yerinde kalır */
function kariyerKaydet(depo,yuva,k){
  let metin;
  try{metin=kayitMetni(k);}catch(e){return{tamam:false,hata:e.message};}
  try{
    yazVeDogrula(depo,yuva+'.yeni',metin);
    const eski=depo.oku(yuva);
    if(eski!==null&&kayitCoz(eski).tamam)yazVeDogrula(depo,yuva+'.onceki',eski);
    yazVeDogrula(depo,yuva,metin);
    depo.sil(yuva+'.yeni');
  }catch(e){return{tamam:false,hata:'Kayıt yazılamadı: '+e.message};}
  return{tamam:true};
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
function kayitOturumu(depo,yuva,kariyer,kayitli){
  const o={
    kariyer,
    durum:{tamam:true,hata:null,tarih:kayitli?kariyer.tarih:null,dakika:kayitli?kariyer.gunIciDakika:null,bekleyen:!kayitli},
    kaydet(){
      const s=kariyerKaydet(depo,yuva,o.kariyer),d=o.durum;
      if(s.tamam)o.durum={tamam:true,hata:null,tarih:o.kariyer.tarih,dakika:o.kariyer.gunIciDakika,bekleyen:false};
      else o.durum={tamam:false,hata:s.hata,tarih:d.tarih,dakika:d.dakika,bekleyen:true};
      return s;
    },
    uygula(f,kaydetme){
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
