/* ============ Chairman — kişiler ve kişiye yazmak: teknik direktör, yardımcı antrenör, mali işler müdürü (çizim yok; H2-c, 2026-10-26) ============
   Kullanıcı isteği 3 (YOL_HARITASI karar 50): maç sonrası otomatik hoca mesajı kalkar; başkan telefonda teknik direktöre ve yardımcısına hazır
   konulardan yazar (soru, görüşme isteği), cevap birkaç saat sonra gelir. Hoca görüşüyle (rakamsız), yardımcı rakamlarla konuşur. Görüşme isteğinde
   karşı taraf gün ve saat önerir; tek kart [Kabul et / Şu gün olsun: <an>] (U3, kullanıcı tercihi 2026-10-28: “biz önerelim”; bizim anımız yoksa
   eski [Kabul et / Başka gün iste]), kabul deftere randevu yazar. Bilgi mimarisinde “kişiye soru zaman bedelli
   girişimdir” kararı (ui-mimari §4): soru başkanın zamanını harcamaz (0 dk); bedeli cevabı beklemektir.
   Konu seçmek karar değil, menüdür (OYUN_TASARIMI §2): konular kişinin konuşmasında girişim önerisi olarak durur (GIRISIMLER 'yaz.<rol>.<konu>').
   Saf kural dosyasıdır: üst düzeyde DOM yok, Node'da da yüklenir (araclar/kariyer-deneme.js, sezon-deneme ve motor yükleyici).
     PERSONEL_TEST       iki TEST çalışan (karar 50): yardımcı antrenör, mali işler müdürü. Yönetim koltuğu değildir; sözleşmesi ve maaşı yoktur (TEST).
                         Adlar js/adlar-test.js havuzundan elle seçildi (karar 33 kipi); kullanıcı değiştirir. Kayıt geçişinde donmuş kopyası js/kayit.js'te.
     personelKur(k)      eksik çalışanı kurar (idempotent; rastlantı çekmez; js/baslangic.js hocalariKur'dan sonra)
     personelKisisi(k, rol)   teknikDirektor → kulübün hocası; öbür roller → başkanın kulübünün o roldeki aktif kişisi; yoksa null
     YAZISMA_KONULARI[konu] = {ad, roller, aralik (gün), aciklama, uygun?(k, kişi) → true | engel metni | false, veri?(k) → soru verisi,
                         goruntu?(k, veri) → cevap anının sayıları (kayda girer), cevapla?(k, iş) → cevaba ek alanlar, metin:{[rol]: (k, yazışma) → metin}}
     yazismaKonusuEkle(konu, tanım)   konuyu kaydeder, her rol için GIRISIMLER['yaz.<rol>.<konu>'] kurar (js/mali-rapor.js 'kasa'yı ekler)
     yazismaSor(k, rol, konu)  → {bilgi, kayit:{kisiId, konu, isId, macId?}}: cevap gizli gelişme olarak takvime (GELISMELER.yazismaCevap; veri.durak:
                         İlerle cevap anında durur — js/ajanda.js ilerleOnizle 'haber')
     yazismaGoruldu(k, kisiId)  kişinin konuşması açıldı: kisi.okunan = şimdiki an (yeni mesaj işareti; js/ekran-oda.js konusmaAc)
     gorusmeAniBul(k, kisiId, enErkenGün) → {tarih, dakika} | null   belirlenimci: maç gününü atlar, 11:00 ya da 15:00, en çok 14 gün
     bizimGorusmeAni(k, is) → {tarih, dakika} | null   U3 “Şu gün olsun”un anı (belirlenimci; aşağıda)
   Cevabın metni kayda yazılmaz (TEKNIK_PLAN §7): kayda cevap anının sayıları (p) ve kimlikler girer, metin okuma anında şablondan üretilir.
   METİNLER TEST TASLAĞIDIR (karar 35 kipi): Claude yazdı, kullanıcı YAZISMA_KONULARI metinlerini değiştirir. Gizli bilgi, ısrar ve oyuncu
   özellikleri hiçbir metinde sayı olarak geçmez. */
'use strict';
const PERSONEL_TEST={yardimciAntrenor:{ad:'Tahsin',dogumTarihi:'1979-03-14'},maliMudur:{ad:'Nusret Bey',dogumTarihi:'1968-09-22'}};
/* cevap gecikmesi (dakika) ve mesai: cevap 09:00–18:30 dışına düşerse sonraki 09:30'a kayar (maç akşamına düşmez). Görüşme önerisinin sınırı. TEST */
const YAZISMA_TEST={gecikme:{teknikDirektor:180,yardimciAntrenor:120,maliMudur:90},mesai:{bas:540,son:1110,ilk:570},
  gorusme:{saatler:[660,900],sure:45,enCokGun:14,enCokOneri:3,sonCevapOnce:60,bizEnErken:60,bizAdim:30}};
const YAZISMA_KONULARI={};
const kisiAktif=(k,id)=>!!(k.kisiler[id]&&k.kisiler[id].durum==='aktif');
const bizimKulup=k=>(k.kisiler[k.baskanId]||{}).kulupId||null;

function personelKur(k){
  const biz=bizimKulup(k);if(!biz||k.gorevDurumu!=='gorevde')return;
  for(const [rol,T] of Object.entries(PERSONEL_TEST)){
    if(Object.values(k.kisiler).some(p=>p.rol===rol&&p.kulupId===biz&&p.durum==='aktif'))continue;
    const id=kimlikUret(k,'kisi');
    k.kisiler[id]={id,ad:T.ad,rol,dogumTarihi:T.dogumTarihi,kulupId:biz,durum:'aktif'};
  }
}
function personelKisisi(k,rol){
  const biz=bizimKulup(k);if(!biz)return null;
  if(rol==='teknikDirektor')return kulupHocasi(k,biz);
  return Object.values(k.kisiler).find(p=>p.rol===rol&&p.kulupId===biz&&p.durum==='aktif')||null;
}
/* bu kişiden bekleyen cevap ya da bekleyen görüşme önerisi */
const yazismaBekleyen=(k,id)=>Object.values(k.isler).some(x=>(x.tur==='gelisme'&&x.veri.gelisme==='yazismaCevap'&&x.veri.muhatap===id)||(x.tur==='ajanda'&&x.veri.karar==='gorusmeOnerisi'&&x.veri.kisiId===id));
/* bu kişiyle gelecekteki görüşme randevusu */
const yazismaRandevu=(k,id)=>Object.values(k.isler).find(x=>x.tur==='ajanda'&&x.veri.etki==='ekipGorusmesi'&&x.veri.kisiId===id)||null;
/* bu kişiye bu konu (ve maç) daha önce soruldu mu (girişim kaydı) */
const yazismaSoruldu=(k,id,konu,macId)=>k.gecmis.some(g=>g.tur==='girisim'&&g.kisiId===id&&g.konu===konu&&(macId===undefined||g.macId===macId));

function yazismaKonusuEkle(konu,tanim){
  YAZISMA_KONULARI[konu]=tanim;
  for(const rol of tanim.roller)GIRISIMLER[`yaz.${rol}.${konu}`]={ad:tanim.ad,aciklama:()=>tanim.aciklama,aralik:tanim.aralik,
    kisi:k=>{const p=personelKisisi(k,rol);return p?p.id:null;},
    uygun:k=>{
      const p=personelKisisi(k,rol);if(!p)return false;
      const u=tanim.uygun?tanim.uygun(k,p):true;if(u===false)return false;
      if(yazismaBekleyen(k,p.id))return'Önceki mesajının cevabını bekliyorsun.';
      if(konu==='gorusme'){const r=yazismaRandevu(k,p.id);if(r)return`Görüşme ayarlandı: ${gunAyYazi(r.tarih)} ${saatYazi(r.dakika)}.`;}
      return u;},
    baslat:k=>yazismaSor(k,rol,konu)};
}
/* cevabın anı: şimdi + kişinin gecikmesi; mesai dışına düşerse sonraki 09:30 (belirlenimci, rastlantı çekmez) */
function yazismaCevapAni(k,rol){
  const M=YAZISMA_TEST.mesai,t=anTarih(simdikiAn(k)+(YAZISMA_TEST.gecikme[rol]||120));
  if(t.dakika<M.bas)return{tarih:t.tarih,dakika:M.ilk};
  if(t.dakika>M.son)return{tarih:tarihEkle(t.tarih,1),dakika:M.ilk};
  return t;
}
/* cevabı gizli gelişme olarak takvime koyar (komut içinde). ek: veriye eklenecek alanlar (görüşmede deneme, en erken gün) */
function yazismaCevapKur(k,p,konu,ek){
  const t=yazismaCevapAni(k,p.rol),K=YAZISMA_KONULARI[konu];
  const veri=Object.assign({gelisme:'yazismaCevap',muhatap:p.id,konu,soru:{tarih:k.tarih,dakika:k.gunIciDakika},durak:true},K.veri?K.veri(k):{},ek||{});
  return isEkle(k,{tur:'gelisme',tarih:t.tarih,dakika:t.dakika,veri});
}
function yazismaSor(k,rol,konu){
  const p=personelKisisi(k,rol),K=YAZISMA_KONULARI[konu];
  if(!p||!K||!K.roller.includes(rol))throw new Error(`Yazışma başlatılamadı: ${rol} · ${konu}`);
  const isId=yazismaCevapKur(k,p,konu),v=k.isler[isId].veri,kayit={kisiId:p.id,konu,isId};
  if(v.macId)kayit.macId=v.macId;
  return{bilgi:`Mesaj gitti: ${p.ad}. Cevap birkaç saat içinde gelir.`,kayit};
}
function yazismaGoruldu(k,kisiId){const p=k.kisiler[kisiId];if(p)p.okunan=simdikiAn(k);}

GELISMELER.yazismaCevap={
  denetle:(k,v)=>{const h=[];if(!(k.kisiler||{})[v.muhatap])h.push('kişi bulunamadı');if(!YAZISMA_KONULARI[v.konu])h.push(`bilinmeyen konu (${v.konu})`);
    if(!v.soru||!tarihGecerliMi(v.soru.tarih)||!Number.isInteger(v.soru.dakika))h.push('soru anı yok');
    if(v.macId!==undefined&&!(k.fikstur||[]).some(f=>f.id===v.macId))h.push(`maç fikstürde yok (${v.macId})`);return h;},
  /* bilgi yok (defterde satır kalmaz): cevap telefondadır. Görüşme cevabı yeni ajanda kararı doğurduğu için İlerle onda durur (durakSorgusu) */
  uygula:(k,is)=>{
    const v=is.veri,K=YAZISMA_KONULARI[v.konu],y={kisiId:v.muhatap,konu:v.konu,soru:{tarih:v.soru.tarih,dakika:v.soru.dakika}};
    if(v.macId)y.macId=v.macId;
    if(!kisiAktif(k,v.muhatap))return{yazisma:Object.assign(y,{cevapYok:'ayrildi'})};
    if(K.goruntu)y.p=K.goruntu(k,v);
    if(K.cevapla)Object.assign(y,K.cevapla(k,is));
    return{yazisma:y};
  }
};

/* ---- takımın durumu (cevap anındaki sayılar; sonradan tablo ya da sakatlık değişse de cevap aynı kalır) ---- */
function takimGoruntusu(k){
  const biz=bizimKulup(k),tb=sezonTablosu(k),i=tb.findIndex(t=>t.id===biz),L=kulupOyunculari(k,biz),s=siradakiMac(k,biz);
  return{sira:i+1,puan:i>=0?tb[i].P:0,son5:sonBesMac(k,biz).map(x=>x.a>x.y?'G':x.a<x.y?'M':'B'),
    sakat:L.filter(p=>p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)>0).map(p=>({id:p.id,donus:p.sakat.donus})),
    cezali:L.filter(p=>p.ceza&&p.ceza.mac>0).map(p=>({id:p.id,mac:p.ceza.mac})),sonrakiMacId:s?s.id:null,
    /* S-a: o günkü kondisyonu 80'in altındaki en yorgun üç oyuncu ve formu 25 ve üstündeki en formda üç oyuncu (yalnız kimlik; sayı kayda ve metne girmez) */
    ...(typeof oyuncuHaftasiAcik==='function'&&oyuncuHaftasiAcik()?{
      yorgun:L.filter(p=>!(p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)>0)).map(p=>({id:p.id,v:oyuncuKondisyonu(k,p,k.tarih)})).filter(x=>x.v<80).sort((a,b)=>a.v-b.v||(a.id<b.id?-1:1)).slice(0,3).map(x=>x.id),
      formda:L.filter(p=>!(p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)>0)).map(p=>({id:p.id,v:oyuncuFormu(p)})).filter(x=>x.v>=25).sort((a,b)=>b.v-a.v||(a.id<b.id?-1:1)).slice(0,3).map(x=>x.id)}:{})};
}
const yzOyuncu=(k,id)=>(k.oyuncular[id]||{}).ad||'—';
const yzRakip=(k,macId)=>{const f=(k.fikstur||[]).find(x=>x.id===macId),biz=bizimKulup(k);if(!f)return null;const r=f.ev===biz?f.konuk:f.ev;return{ad:(k.kulupler[r]||{ad:r}).ad,tarih:f.tarih};};

/* ---- TEST metinleri (kullanıcı değiştirir) ---- */
const YAZISMA_METIN={
  hocaTakim:(k,T)=>{const g=T.son5.filter(x=>x==='G').length,m=T.son5.filter(x=>x==='M').length,r=yzRakip(k,T.sonrakiMacId);
    return[g>=3?'Takım iyi gidiyor başkanım.':m>=3?'Kötü bir seriden geçiyoruz; toparlanmamız lazım.':'İnişli çıkışlı gidiyoruz.',
      T.sakat.length?T.sakat.map(x=>yzOyuncu(k,x.id)).join(', ')+' sakat.':'Sakatımız yok.',
      T.cezali.length?T.cezali.map(x=>yzOyuncu(k,x.id)).join(', ')+' cezalı.':'',
      T.yorgun&&T.yorgun.length?T.yorgun.map(id=>yzOyuncu(k,id)).join(', ')+' biraz yorgun; gerekirse dinlendiririm.':'',
      T.formda&&T.formda.length?T.formda.map(id=>yzOyuncu(k,id)).join(', ')+' iyi günlerinde.':'',
      r?`Sıradaki maç ${r.ad} ile; hazırlanıyoruz.`:'Önümüzde maç yok.'].filter(Boolean).join(' ');},
  yardimciTakim:(k,T)=>{const r=yzRakip(k,T.sonrakiMacId);
    return[`Sıramız ${T.sira}., ${T.puan} puan. Son ${T.son5.length} maç: ${T.son5.join(' ')||'—'}.`,
      T.sakat.length?'Sakatlar: '+T.sakat.map(x=>`${yzOyuncu(k,x.id)} (dönüş ${gunAyYazi(x.donus)})`).join(', ')+'.':'Sakat yok.',
      T.cezali.length?'Cezalı: '+T.cezali.map(x=>`${yzOyuncu(k,x.id)} (${x.mac} maç)`).join(', ')+'.':'',
      T.yorgun&&T.yorgun.length?'Koşu verilerinde düşüş: '+T.yorgun.map(id=>yzOyuncu(k,id)).join(', ')+'.':'',
      r?`Sıradaki: ${r.ad} (${gunAyYazi(r.tarih)}).`:''].filter(Boolean).join(' ');},
  yardimciMac:(k,id)=>{const o=macOkumasi(k,id);if(!o)return'Rakamlar henüz elimde değil.';
    if(o.hukmen)return`Maç oynanmadı; hükmen ${o.skor[0]}–${o.skor[1]}.`;
    const I=o.ist,c=o.oneCikan;
    return`Şut ${I.sut[0]}–${I.sut[1]}, isabetli ${I.isabet[0]}–${I.isabet[1]}. Beklenen gol ${okSayi(o.xg[0],2)} – ${okSayi(o.xg[1],2)}; topa sahip olma %${Math.round(I.sahiplik[0]*100)}.`+
      (c?` ${c.ad}: ${c.sut} şut, beklenen gol ${okSayi(c.xg,2)}${c.gol?`, ${c.gol} gol`:''}.`:'');},
  gorusme:(k,y)=>y.oneri?`${gunAyYazi(y.oneri.tarih)} ${saatYazi(y.oneri.dakika)} uygun mu başkanım? ${YAZISMA_TEST.gorusme.sure} dakika yeter.`:'Uygun olduğunuzda yazın başkanım.'
};

/* ---- bu turun konuları (H2-c). 'kasa' js/mali-rapor.js'te (H2-d) ---- */
yazismaKonusuEkle('mac',{ad:'Maçı nasıl gördün?',roller:['teknikDirektor','yardimciAntrenor'],aralik:0,aciklama:'Son maçı sorarsın; cevap birkaç saat içinde gelir.',
  /* oynanmış son maç yoksa, hoca o maçı yönetmediyse ya da bu kişiye bu maç sorulduysa listede yok */
  uygun:(k,p)=>{const son=kulubunSonMaci(k,bizimKulup(k));if(!son)return false;
    if(p.rol==='teknikDirektor'){const t=son.f.konuk===bizimKulup(k)?1:0;if(!son.s.hocalar||son.s.hocalar[t]!==p.id)return false;}
    return yazismaSoruldu(k,p.id,'mac',son.f.id)?false:true;},
  veri:k=>({macId:kulubunSonMaci(k,bizimKulup(k)).f.id}),
  metin:{teknikDirektor:(k,y)=>{const Y=macYorumu(k,y.macId);return Y?Y.metin:'Maçı konuşalım başkanım.';},yardimciAntrenor:(k,y)=>YAZISMA_METIN.yardimciMac(k,y.macId)}});
yazismaKonusuEkle('takim',{ad:'Takım ne durumda?',roller:['teknikDirektor','yardimciAntrenor'],aralik:1,aciklama:'Kadronun durumunu sorarsın; günde bir kez.',
  goruntu:k=>takimGoruntusu(k),
  metin:{teknikDirektor:(k,y)=>YAZISMA_METIN.hocaTakim(k,y.p),yardimciAntrenor:(k,y)=>YAZISMA_METIN.yardimciTakim(k,y.p)}});
yazismaKonusuEkle('gorusme',{ad:'Görüşelim',roller:['teknikDirektor','yardimciAntrenor'],aralik:0,aciklama:'Yüz yüze görüşme istersin; gün ve saat önerir.',
  /* cevap bir saat önerisidir: yer varsa telefonda tek kart (gorusmeOnerisi), yoksa ya da üçüncü retten sonra yalnız mesaj */
  cevapla:(k,is)=>{const v=is.veri,G=YAZISMA_TEST.gorusme,deneme=v.deneme|0;
    if(deneme>=G.enCokOneri)return{oneri:null,deneme};
    const o=gorusmeAniBul(k,v.muhatap,v.enErken||tarihEkle(k.tarih,1));if(!o)return{oneri:null,deneme};
    const t=anTarih(anDakika(o.tarih,o.dakika)-G.sonCevapOnce),ad=kisiAdi(k,v.muhatap);
    isEkle(k,{tur:'ajanda',tarih:t.tarih,dakika:t.dakika,veri:{baslik:`Görüşme: ${ad}`,aciklama:`${gunAyYazi(o.tarih)} ${saatYazi(o.dakika)} öneriyor (${G.sure} dk).`,
      zorunluluk:'zorunlu',sure:0,saatsiz:true,bekleyebilir:true,gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'gorusmeOnerisi',soran:v.muhatap,muhatap:v.muhatap,
      kisiId:v.muhatap,oneri:o,deneme}});
    return{oneri:o,deneme};},
  metin:{teknikDirektor:(k,y)=>YAZISMA_METIN.gorusme(k,y),yardimciAntrenor:(k,y)=>YAZISMA_METIN.gorusme(k,y)}});

/* ---- görüşme önerisi: belirlenimci saat, tek kart, randevu ---- */
/* o anda (45 dk) başka saatli ajanda işi var mı (haricId hariç) */
function gorusmeCakisma(k,o,haricId){
  const a=anDakika(o.tarih,o.dakika),b=a+YAZISMA_TEST.gorusme.sure;
  return Object.values(k.isler).some(x=>x.id!==haricId&&x.tur==='ajanda'&&!x.veri.saatsiz&&(()=>{const s=anDakika(x.tarih,x.dakika),e=s+(x.veri.sure||0);return s<b&&e>a||s===a;})());
}
function gorusmeAniBul(k,kisiId,enErkenGun){
  const G=YAZISMA_TEST.gorusme,biz=bizimKulup(k),macGunu=new Set((k.fikstur||[]).filter(f=>f.ev===biz||f.konuk===biz).map(f=>f.tarih));
  for(let d=0;d<G.enCokGun;d++){
    const g=tarihEkle(enErkenGun,d);if(macGunu.has(g))continue;
    for(const dk of G.saatler){const o={tarih:g,dakika:dk};if(anDakika(g,dk)>simdikiAn(k)&&!gorusmeCakisma(k,o))return o;}
  }
  return null;
}
/* U3 (kullanıcı tercihi 2026-10-28, u-arayuz §3): “Şu gün olsun” — başkanın önerdiği an. Şimdiden en az bizEnErken dk sonra, bizAdim dk adımla,
   mesai içinde (görüşme mesai bitmeden biter), maç günü ve hafta içi antrenman saati dışında, saatli işlerle çakışmadan; hocanın önerisinden ÖNCEKİ ilk
   boş an (hocanın önerisi zaten defterdeki ilk boş 11:00/15:00'tür: “ilk boş an” olduğu gibi alınsa iki cevap aynı ana düşerdi). Öneri kabul
   edilemiyorsa (o saatte iş var) enCokGun gün içindeki ilk boş an. Yoksa null: kart eski [Kabul et / Başka gün iste]'dir. Karşı taraf anında kabul eder
   (TEST; kişinin kendi ajandası Y2 ile gelir). Belirlenimci: rastlantı yok, yalnız kariyerin o anki hâli */
function bizimGorusmeAni(k,is){
  const G=YAZISMA_TEST.gorusme,M=YAZISMA_TEST.mesai,o=is.veri.oneri,biz=bizimKulup(k);
  const macGunu=new Set((k.fikstur||[]).filter(f=>f.ev===biz||f.konuk===biz).map(f=>f.tarih));
  const sinir=!gorusmeCakisma(k,o,is.id)?anDakika(o.tarih,o.dakika):anDakika(k.tarih,0)+G.enCokGun*1440;
  for(let a=Math.ceil((simdikiAn(k)+G.bizEnErken)/G.bizAdim)*G.bizAdim;a<sinir;a+=G.bizAdim){
    const t=anTarih(a);
    if(macGunu.has(t.tarih)||t.dakika<M.bas||t.dakika+G.sure>M.son)continue;
    const p=typeof antrenmanPenceresi==='function'?antrenmanPenceresi(k,t.tarih):null;
    if(p&&t.dakika<p.bit&&t.dakika+G.sure>p.bas)continue;
    if(!gorusmeCakisma(k,t,is.id))return{tarih:t.tarih,dakika:t.dakika};
  }
  return null;
}
const gorusmeAnYazi=o=>`${gunAyYazi(o.tarih)} ${saatYazi(o.dakika)}`;
KARAR_TURLERI.gorusmeOnerisi={
  denetle:(k,v)=>{const h=[];if(!(k.kisiler||{})[v.kisiId])h.push('kişi bulunamadı');
    if(!v.oneri||!tarihGecerliMi(v.oneri.tarih)||!Number.isInteger(v.oneri.dakika))h.push('öneri anı yok');return h;},
  secenekler:(k,is)=>{const v=is.veri,o=v.oneri,G=YAZISMA_TEST.gorusme,son=(v.deneme|0)+1>=G.enCokOneri,cak=gorusmeCakisma(k,o,is.id),b=bizimGorusmeAni(k,is);
    const kabul={id:'kabul',metin:'Kabul et',sure:0,engel:cak?'O saatte başka bir işin var':null,aciklama:[`${gorusmeAnYazi(o)}: ${G.sure} dakikalık görüşme deftere yazılır.`]};
    /* etiket/etiketAlt: kartın kenarındaki kısa ad ve altı (dar telefonda dört satıra sarılmasın); metin konuşmada giden cevaptır */
    if(b)return[kabul,{id:'biz',metin:`Şu gün olsun: ${gorusmeAnYazi(b)}`,etiket:'Şu gün olsun',etiketAlt:`${gunAyYazi(b.tarih).replace(/^(\d+ \S{3})\S*/,'$1')} ${saatYazi(b.dakika)}`,sure:0,
      aciklama:[`${G.sure} dakikalık görüşme deftere yazılır; ${kisiAdi(k,v.kisiId)} kabul eder (TEST).`]}];
    return[kabul,{id:'baska',metin:'Başka gün iste',sure:0,aciklama:[son?'Bir daha gün önermez; görüşmek istersen sen yazarsın.':'Başka bir gün önerir; cevap birkaç saat içinde gelir.']}];},
  uygula:(k,is,secim)=>{
    const v=is.veri,ad=kisiAdi(k,v.kisiId),G=YAZISMA_TEST.gorusme;
    if(secim==='kabul'||secim==='biz'){
      const o=secim==='biz'?bizimGorusmeAni(k,is):v.oneri;
      if(!o)throw new Error('Görüşme için boş an kalmadı');
      isEkle(k,{tur:'ajanda',tarih:o.tarih,dakika:o.dakika,veri:{baslik:`Görüşme: ${ad}`,aciklama:`${G.sure} dk görüşme (TEST)`,zorunluluk:'istege',sure:G.sure,
        kisiId:v.kisiId,muhatap:v.kisiId,etki:'ekipGorusmesi'}});
      return{bilgi:`Görüşme deftere yazıldı: ${ad}, ${gorusmeAnYazi(o)}${secim==='biz'?' (senin önerin)':''}.`};
    }
    const p=k.kisiler[v.kisiId];
    if(p&&kisiAktif(k,p.id))yazismaCevapKur(k,p,'gorusme',{deneme:(v.deneme|0)+1,enErken:tarihEkle(v.oneri.tarih,1)});
    return{bilgi:`${ad} başka bir gün önerecek.`};
  },
  zamanAsimi:{metin:()=>'Cevap vermezsen görüşme olmaz.',uygula:()=>({bilgi:'Görüşme ayarlanmadı.'})},
  /* U3 bağlam: önerilen (ya da bizim) anın günü, defter şeridinde işaretli */
  baglam:(k,is,secim)=>{const o=secim==='biz'?bizimGorusmeAni(k,is):is.veri.oneri;return o?{tur:'gun',tarih:o.tarih,isaret:{dakika:o.dakika,sure:YAZISMA_TEST.gorusme.sure,ad:secim==='biz'?'Senin önerdiğin görüşme':`${kisiAdi(k,is.veri.kisiId)} ile görüşme (önerisi)`},haricId:is.id}:null;}
};
/* görüşmeye katılınca kısa TEST özeti (kişinin takım görüntüsü); ayrıntılı görüşme sahnesi (kapı) sonra gelir (karar 47, Y2) */
KATILIM_ETKILERI.ekipGorusmesi={
  denetle:(k,v)=>(k.kisiler||{})[v.kisiId]?[]:['görüşülecek kişi bulunamadı'],
  uygula:(k,is)=>{const p=k.kisiler[is.veri.kisiId];if(!kisiAktif(k,p.id))return{bilgi:`${p.ad} gelmedi.`};
    const T=takimGoruntusu(k),m=p.rol==='teknikDirektor'?YAZISMA_METIN.hocaTakim(k,T):YAZISMA_METIN.yardimciTakim(k,T);
    return{bilgi:`${p.ad} ile görüştün: ${m} (TEST; ayrıntılı görüşme sahnesi sonra gelir.)`};}
};

/* ---- telefonda gösterim (js/mesajlar.js MESAJ_KAYNAKLARI): giden soru, gelen cevap, cevapsız soru. Geçmiş tek geçişte taranır ---- */
MESAJ_KAYNAKLARI.push(k=>{
  const L=[],iptal=new Map(),cevap=new Map(),bagli=new Set();
  for(const g of k.gecmis){
    if(g.tur==='iptal'&&g.isTuru==='gelisme')iptal.set(g.isId,g);
    else if(g.tur==='is'&&g.isTuru==='gelisme'&&g.sonuc&&g.sonuc.yazisma)cevap.set(g.isId,g);
  }
  for(const g of k.gecmis){
    if(g.tur==='girisim'&&g.kisiId&&YAZISMA_KONULARI[g.konu]){
      L.push({kisiId:g.kisiId,tarih:g.tarih,dakika:g.dakika,yon:'giden',metin:YAZISMA_KONULARI[g.konu].ad,yeni:false});
      bagli.add(g.isId);{const x=iptal.get(g.isId);if(x)L.push({kisiId:g.kisiId,tarih:x.tarih,dakika:x.dakika,yon:'not',metin:'Cevap gelmedi.',yeni:false});}
    }else if(g.tur==='is'&&cevap.get(g.isId)===g){
      const y=g.sonuc.yazisma,p=k.kisiler[y.kisiId],K=YAZISMA_KONULARI[y.konu];if(!p||!K)continue;
      if(y.cevapYok){L.push({kisiId:y.kisiId,tarih:g.tarih,dakika:g.dakika,yon:'not',metin:'Cevap gelmedi.',yeni:false});continue;}
      const f=K.metin[p.rol]||K.metin.teknikDirektor;
      L.push({kisiId:y.kisiId,tarih:g.tarih,dakika:g.dakika,yon:'gelen',metin:f(k,y),yeni:anDakika(g.tarih,g.dakika)>(p.okunan|0)});
    }
  }
  /* U3: “Şu gün olsun”a karşı tarafın anında kabulü (TEST metni); kararın giden cevabından (+0,5) sonra, okunmuş sayılır (o an konuşmadasın) */
  for(const g of k.gecmis){const r=g.tur==='is'&&g.isTuru==='ajanda'&&g.sonuc;
    if(r&&r.karar==='gorusmeOnerisi'&&r.secim==='biz'&&r.soran)L.push({kisiId:r.soran,tarih:g.tarih,dakika:g.dakika,yon:'gelen',metin:'Olur başkanım, görüşelim.',yeni:false,siraEk:0.6});}
  /* inceleme (H2-e): girişim kaydı olmayan cevap (“Başka gün iste”nin yenisi) iptal edilince de not: iptal kaydının muhatabından */
  for(const x of iptal.values())if(x.muhatap&&!bagli.has(x.isId)&&k.kisiler[x.muhatap])L.push({kisiId:x.muhatap,tarih:x.tarih,dakika:x.dakika,yon:'not',metin:'Cevap gelmedi.',yeni:false,siraEk:0.75});   /* aynı dakikadaki cevaptan (+0,5) sonra */
  return L;
});

/* doğrulama (EK_DENETIMLER): başkanın kulübünde her personel rolünde en çok bir aktif kişi; okunan an tamsayı ve şimdiden sonra değil */
function yazismaDogrula(k,h){
  const say={};
  for(const p of Object.values(k.kisiler||{})){
    if(PERSONEL_TEST[p.rol]&&p.durum==='aktif'){const a=p.kulupId+'|'+p.rol;say[a]=(say[a]||0)+1;if(say[a]===2)h.push(`Kulüp ${p.kulupId}: ${p.rol} görevinde birden çok aktif kişi`);}
    if(p.okunan!==undefined&&(!Number.isInteger(p.okunan)||p.okunan<0||(tarihGecerliMi(k.tarih)&&p.okunan>simdikiAn(k))))h.push(`Kişi ${p.id}: okunan an geçersiz`);
  }
}
EK_DENETIMLER.push(yazismaDogrula);
