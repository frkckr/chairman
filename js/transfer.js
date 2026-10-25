/* ============ Chairman — transfer iskeleti: dönem, gelen teklif, hocanın isteği, imza (çizim yok; G2-d/e, 2026-10-24; YOL_HARITASI 4.2, karar 44) ============
   Kullanıcı kararı (2026-10-24 akşam): sözleşme ve para akışıyla birlikte transfer iskeleti. Bütün metinler, sayılar ve olasılıklar TEST'tir
   (karar 35 kipi; kullanıcı değiştirir). Kapsam dışı (4.3): pazarlık ve karşı teklif, menajer, sızıntı, AI kulüpler arası transfer.
   Dönem: k.sezon.transfer (bugün kış 4–31 Ocak). transferTakvimiKur(k) dönemin sabit günlerine gizli gelişmeler koyar (idempotent; yeni kariyer ve
     her ay başı): +TRANSFER_TEST.teklifGunleri. gün 'gelenTeklif', +talepGunu. gün 'hocaTalebi'. Geçmiş anlar kurulmaz.
   oyuncuDegeri(p, tarih): maaş × TRANSFER_TEST.degerAy × yaş katsayısı (24 altı ×1,3, 31 üstü ×0,6), 10.000 ₺'ye yuvarlanır (TEST).
   Gelen teklif (PAKETLER.gelenTeklif; dönem açık, açık teklif yok, kadro ≥ kadroAlt): değeri en yüksek altı saha oyuncumuzdan biri, tabloda üstümüzdeki
     bir kulüpten (yoksa herhangi), bedel değer × (0,9–1,2); hepsi dünya tohumu ve konudan. Dosya “Transfer”, kanıtlar (sözleşme, sezon sayaçları, hocanın
     görüşü), iki cevap: Sat (bedel ertesi gün kasaya, oyuncu gider, kadro gençle 22'ye) / Reddet; cevapsız → teklif geri çekilir.
     H1 (G2 borcu, 2026-10-25): hocanın görüşü telefona da düşer (mesele olayı 'tr.hocaGorus', gönderen hoca; metin dosyadaki kanıtın birinci tekil eşi,
     TEST): konunun konuşması hocanınkidir, orada “karar dosyada” bağlantısı durur. Karar dosyada kalır (soran yok, giden yazılmaz); kayıt alanı yok.
   Hocanın isteği (PAKETLER.hocaTalebi): en zayıf hat (DEF, OS, FV; en iyi oyuncularının ortalaması), bütçe (bonservis TEST aralıkta, maaş tavanı
     kadronun ortalama maaşı × maasTavanKat); hocanın mesajı, iki cevap: Bütçeyi onayla / Reddet; cevapsız → reddet. Onayda imzaGun sonra gizli
     'transferImza': önce o mevkide sözleşmesiz (serbest) oyuncu, yoksa tabloda altımızdaki kulüpten bütçeye uyan en iyi oyuncu (bedel = değer; satan kulüp
     gençle tamamlanır), yoksa kimse (dosyaya yazılır). Sözleşme {maas: min(tahmin, tavan), +2 yıl}; bedel ertesi gün ödenir.
   oyuncuTransfer(k, oyuncu, kulüp|null, {sozlesme}) kadro listelerini korur: ilk 11'deki yuvaya aynı mevkiden (kalecide kaleci) yedek geçer; giden
     kaleciyse önce kadroda iki kaleci kalması sağlanır (js/kariyer-kadro.js kaleciGuvence); kaptan bayrağı gitmez; numara çakışırsa ilk boş numara;
     geçmişe {tur:'transfer'|'ayrilis', oyuncuId, eski, yeni, tarih, dakika}. k.oyuncular kopyala-yaz. */
'use strict';
const TRANSFER_TEST={teklifGunleri:[3,12,22],talepGunu:1,saat:660,cevapGun:3,imzaGun:5,bonservis:[40000000,120000000],maasTavanKat:1.3,degerAy:24,kadroAlt:18};
Object.assign(OLAY_KAYNAKLARI,{sozlesmeKaydi:'Sözleşme kayıtları'});
if(!OLAY_KAYNAKLARI.yerelGazete)OLAY_KAYNAKLARI.yerelGazete='Yerel gazete';
if(!OLAY_KAYNAKLARI.macRaporlari)OLAY_KAYNAKLARI.macRaporlari='Maç raporları';
MESELE_KATEGORILERI.transfer=['Transfer','T'];
const MEVKI_ADI={DEF:'savunma',OS:'orta saha',FV:'forvet',KL:'kaleci'};
const transferDonemi=(k,tarih)=>((k.sezon&&k.sezon.transfer)||[]).find(t=>tarih>=t.bas&&tarih<=t.bitis)||null;
function oyuncuDegeri(p,tarih){
  const m=p.sozlesme?p.sozlesme.maas:maasTahmini(p,tarih),y=oyuncuYasi(p,tarih);
  return Math.max(1000000,Math.round(m*TRANSFER_TEST.degerAy*(y<24?1.3:y>31?0.6:1)/1000000)*1000000);
}
/* oyuncunun gizli ortalaması (seçim sırası için; gösterilmez) */
const oyuncuOrt=p=>{const o=p.oz.filter((_,j)=>j!==8);return o.reduce((a,b)=>a+b,0)/o.length;};

function transferTakvimiKur(k){
  const biz=(k.kisiler[k.baskanId]||{}).kulupId;if(!biz||!k.sezon||k.icerik.surum<5)return 0;
  const T=TRANSFER_TEST,simdi=simdikiAn(k),var_=new Set(Object.values(k.isler).filter(x=>x.tur==='gelisme'&&x.veri.anahtar).map(x=>x.veri.anahtar));let n=0;
  for(const d of k.sezon.transfer){
    const plan=T.teklifGunleri.map((g,i)=>({gelisme:'gelenTeklif',gun:g,i})).concat([{gelisme:'hocaTalebi',gun:T.talepGunu,i:0}]);
    for(const p of plan){const tarih=tarihEkle(d.bas,p.gun),anahtar=`${d.bas}:${p.gelisme}:${p.i}`;
      if(tarih>d.bitis||anDakika(tarih,T.saat)<=simdi||var_.has(anahtar))continue;
      isEkle(k,{tur:'gelisme',tarih,dakika:T.saat,veri:{gelisme:p.gelisme,kulupId:biz,anahtar}});n++;}
  }
  return n;
}

/* kadro listelerinden çıkar; ilk 11'deki yuvaya aynı mevkiden (kalecide kaleci) yedek, yoksa saha oyuncusu */
function kadrodanCikar(k,kulupId,id){
  const D=k.kulupler[kulupId].kadro,i=D.ilk11.indexOf(id);
  if(i<0){D.yedekler=D.yedekler.filter(x=>x!==id);return;}
  const m=k.oyuncular[id].mevki,Y=D.yedekler.map(x=>k.oyuncular[x]);
  const y=Y.find(p=>p.mevki===m)||(m==='KL'?null:Y.find(p=>p.mevki!=='KL'));
  if(!y)throw new Error(`Kadro ${kulupId}: ${k.oyuncular[id].ad} yerine yedek yok`);
  D.ilk11=D.ilk11.map(x=>x===id?y.id:x);D.yedekler=D.yedekler.filter(x=>x!==y.id&&x!==id);
}
function oyuncuTransfer(k,id,yeni,o){
  const p=k.oyuncular[id];if(!p)throw new Error(`Transfer: oyuncu yok (${id})`);
  const eski=p.kulupId;if(eski===yeni)throw new Error('Transfer: aynı kulüp');
  if(eski){if(p.mevki==='KL')kaleciGuvence(k,eski,id);kadrodanCikar(k,eski,id);}
  let no=p.no;
  if(yeni){if(kulupOyunculari(k,yeni).some(q=>q.no===no))no=bosNumara(k,yeni,no);const D=k.kulupler[yeni].kadro;D.yedekler=D.yedekler.concat([id]);}
  /* kaptanlık kulübündedir: giden oyuncu bayrağı götürmez (maç girdisi kaptansız on bire en yaşlıyı kaptan yapar; js/mac-girdi.js) */
  const q=Object.assign({},p,{kulupId:yeni,no,sozlesme:yeni?o.sozlesme:null});delete q.kaptan;
  k.oyuncular=Object.assign({},k.oyuncular,{[id]:q});
  k.gecmis.push({tur:yeni?'transfer':'ayrilis',oyuncuId:id,eski,yeni,bedel:o&&o.bedel||0,tarih:k.tarih,dakika:k.gunIciDakika});
}
const oyuncuSerbestBirak=(k,id)=>oyuncuTransfer(k,id,null,{});

Object.assign(MESELE_OLAYLARI,{
  'tr.teklif':(k,p)=>`${(k.kulupler[p.kulupId]||{ad:''}).ad}, ${kisiOyuncuAdi(k,p.oyuncuId)} için ${paraYazi(p.bedel)} teklif etti.`,
  'tr.kanit.sozlesme':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)}: aylık ${paraYazi(p.maas)}; sözleşmesinin bitişi ${gunAyYazi(p.bitis)} ${p.bitis.slice(0,4)}.`,
  'tr.kanit.sezon':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} bu sezon ${p.gol} gol attı; ${p.ilk11?'son maçta on birdeydi':'son maçta on birde değildi'}.`,
  'tr.kanit.hoca':(k,p)=>p.ilk11?`Hoca: “${kisiOyuncuAdi(k,p.oyuncuId)} takımın önemli parçası; gitmesini istemem.”`:`Hoca: “${kisiOyuncuAdi(k,p.oyuncuId)} gidebilir, yerini doldururuz.”`,
  'tr.sat':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} satıldı; ${paraYazi(p.bedel)} ${gunAyYazi(p.tarih)} kasaya girecek.`,
  'tr.reddet':(k,p)=>`Teklifi reddettin; ${kisiOyuncuAdi(k,p.oyuncuId)} kalıyor.`,
  'tr.cevapsiz':(k,p)=>`Cevap vermedin; teklif geri çekildi.`,
  'tr.haber':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} ${(k.kulupler[p.alici]||{ad:''}).ad} ile anlaştı.`,
  'tr.talep':(k,p)=>`${kisiAdi(k,p.kisiId)} ${MEVKI_ADI[p.mevki]} hattına oyuncu istiyor: bonservis en çok ${paraYazi(p.bonservis)}, aylık maaş en çok ${paraYazi(p.tavan)}.`,
  'tr.onay':(k,p)=>`Bütçeyi onayladın; hoca ve kulüp ${gunAyYazi(p.tarih)} tarihine dek bir oyuncu arayacak.`,
  'tr.ret':(k,p)=>`Bütçeyi onaylamadın; bu dönem ${MEVKI_ADI[p.mevki]} hattına transfer yok.`,
  'tr.talepCevapsiz':(k,p)=>`Cevap vermedin; transfer isteği düştü.`,
  'tr.imza':(k,p)=>`${kisiOyuncuAdi(k,p.oyuncuId)} imzaladı (önceki kulübü: ${p.eski?(k.kulupler[p.eski]||{ad:''}).ad:'yok, serbest'}; bonservis ${paraYazi(p.bedel)}, aylık ${paraYazi(p.maas)}).`,
  'tr.bulunamadi':(k,p)=>`Bütçeye uyan ${MEVKI_ADI[p.mevki]} oyuncusu bulunamadı; transfer olmadı.`,
  'tr.tesekkur':(k,p)=>`${kisiAdi(k,p.kisiId)} teşekkür etti.`
});
const kisiOyuncuAdi=(k,id)=>(k.oyuncular[id]||{}).ad||'—';
MESAJ_GONDEREN['tr.talep']=pKisi('kisiId');MESAJ_GONDEREN['tr.tesekkur']=pKisi('kisiId');
MESAJ_METIN['tr.talep']=(k,p)=>`Başkanım, ${MEVKI_ADI[p.mevki]} hattına bir oyuncu lazım. Bonservis en çok ${paraYazi(p.bonservis)}, maaşı ayda en çok ${paraYazi(p.tavan)} olsun.`;
MESAJ_METIN['tr.tesekkur']=()=>'Sağ olun başkanım, yeni oyuncu hemen çalışmalara katılıyor.';
/* H1 (G2 borcu): gelen teklifte hocanın görüşü telefonda. Dosyada konunun günlüğünde kanıttaki cümleyle, telefonda hocanın ağzından (birinci tekil eşi;
   yeni bilgi yok; TEST metin, kullanıcı değiştirir) */
MESELE_OLAYLARI['tr.hocaGorus']=MESELE_OLAYLARI['tr.kanit.hoca'];
MESAJ_GONDEREN['tr.hocaGorus']=pKisi('kisiId');
MESAJ_METIN['tr.hocaGorus']=(k,p)=>p.ilk11?`${kisiOyuncuAdi(k,p.oyuncuId)} takımın önemli parçası; gitmesini istemem.`:`${kisiOyuncuAdi(k,p.oyuncuId)} gidebilir, yerini doldururuz.`;

/* ---- gelen teklif ---- */
GELISMELER.gelenTeklif={
  denetle:(k,v)=>k.kulupler[v.kulupId]?[]:['kulüp bulunamadı'],
  /* sözleşmeler önce tamamlanır (idempotent; sürüm 8'den Ocak'ta geçen kayıtta ilk ay başı 1 Şubat'tır — kanıt ve bedel sözleşmeden) */
  uygula:(k,is)=>{sozlesmeleriTamamla(k);const v=is.veri,olay=paketDene(k,'gelenTeklif','teklif:'+v.anahtar,Object.assign({},v));return olay?{bilgi:'Transfer teklifi geldi.',dur:true}:{bilgi:null};}
};
PAKETLER.gelenTeklif={
  surum:1,icerik:5,
  degerlendir:(k,b)=>{
    if(!transferDonemi(k,k.tarih)||Object.values(k.olaylar).some(o=>o.paket==='gelenTeklif'&&o.durum==='acik'))return null;
    const L=kulupOyunculari(k,b.kulupId);if(L.length<TRANSFER_TEST.kadroAlt)return null;
    const A=L.filter(p=>p.mevki!=='KL').sort((x,y)=>oyuncuDegeri(y,k.tarih)-oyuncuDegeri(x,k.tarih)||(x.id<y.id?-1:1)).slice(0,6);if(!A.length)return null;
    const r=kadroRastgele(k.dunyaTohumu,'teklif:'+b.anahtar),p=A[Math.floor(r()*A.length)],tb=sezonTablosu(k),i=tb.findIndex(t=>t.id===b.kulupId);
    const ust=tb.slice(0,Math.max(0,i)).map(t=>t.id),havuz=ust.length?ust:tb.map(t=>t.id).filter(id=>id!==b.kulupId),alici=havuz[Math.floor(r()*havuz.length)];
    b.oyuncuId=p.id;b.alici=alici;b.bedel=Math.round(oyuncuDegeri(p,k.tarih)*(0.9+0.3*r())/1000000)*1000000;
    return'teklif';
  },
  ac:(k,olay,b)=>{
    const p=k.oyuncular[b.oyuncuId],h=kulupHocasi(k,b.kulupId),D=k.kulupler[b.kulupId].kadro,ilk=D.ilk11.includes(p.id);
    const id=meseleAc(k,{tur:'transfer',baslik:`Teklif: ${p.ad}`,sorumluId:k.baskanId,kisiler:h?[h.id]:[]});olay.meseleId=id;
    meseleOlay(k,id,'tr.teklif',{kulupId:b.alici,oyuncuId:p.id,bedel:b.bedel});
    if(p.sozlesme)olayBilgi(k,olay.id,'tr.kanit.sozlesme',{oyuncuId:p.id,maas:p.sozlesme.maas,bitis:p.sozlesme.bitis},'sozlesmeKaydi');
    olayBilgi(k,olay.id,'tr.kanit.sezon',{oyuncuId:p.id,gol:p.gol,ilk11:ilk},'macRaporlari');
    if(h)olayBilgi(k,olay.id,'tr.kanit.hoca',{oyuncuId:p.id,ilk11:ilk},h.id);
    if(h)meseleOlay(k,id,'tr.hocaGorus',{kisiId:h.id,oyuncuId:p.id,ilk11:ilk});   /* H1: telefondaki izi (konunun konuşması hocanın) */
    isEkle(k,{tur:'ajanda',tarih:tarihEkle(k.tarih,TRANSFER_TEST.cevapGun),dakika:1080,veri:{baslik:`Teklif: ${p.ad}`,zorunluluk:'zorunlu',sure:0,saatsiz:true,bekleyebilir:true,
      gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'teklifKarari',meseleId:id,olayId:olay.id,kulupId:b.kulupId,oyuncuId:p.id,alici:b.alici,bedel:b.bedel,
      aciklama:`${(k.kulupler[b.alici]||{ad:''}).ad} ${p.ad} için ${paraYazi(b.bedel)} öneriyor.`}});
  }
};
KARAR_TURLERI.teklifKarari={
  denetle:(k,v)=>{const h=[];if(!(k.oyuncular||{})[v.oyuncuId])h.push('oyuncu bulunamadı');if(!(k.kulupler||{})[v.alici])h.push('alıcı kulüp bulunamadı');
    if(!Number.isInteger(v.bedel)||v.bedel<=0)h.push('bedel geçersiz');if(typeof v.meseleId!=='string')h.push('mesele yok');return h;},
  secenekler:(k,is)=>{const v=is.veri,p=k.oyuncular[v.oyuncuId],orada=p&&p.kulupId===v.kulupId;
    return[{id:'sat',metin:'Sat',sure:30,engel:orada?null:'Oyuncu artık kulüpte değil',aciklama:[`${paraYazi(v.bedel)} yarın kasaya girer; ${p?p.ad:''} gider.`,'Kadro gençle tamamlanır.']},
      {id:'reddet',metin:'Reddet',sure:0,aciklama:[`${p?p.ad:''} kalır.`]}];},
  uygula:(k,is,secim)=>{
    const v=is.veri;
    if(secim==='reddet')return{bilgi:meseleOlay(k,v.meseleId,'tr.reddet',{oyuncuId:v.oyuncuId})};
    const p=k.oyuncular[v.oyuncuId],yarin=tarihEkle(k.tarih,1),A=k.kulupler[v.alici];
    oyuncuTransfer(k,v.oyuncuId,v.alici,{bedel:v.bedel,sozlesme:{maas:Math.round(maasTahmini(p,k.tarih)*1.1/SOZLESME_TEST.yuvarla)*SOZLESME_TEST.yuvarla,bitis:sozlesmeBitisi(k,2)}});
    odemePlanla(k,{kulupId:v.kulupId,tarih:yarin,dakika:600,tutar:v.bedel,kalem:'transfer',aciklama:`${p.ad} bonservisi (${A.ad})`,meseleId:v.meseleId});
    haberEkle(k,{tur:'gazete',anahtar:'tr.haber',p:{oyuncuId:v.oyuncuId,alici:v.alici,kaynak:'yerelGazete'},olayId:v.olayId});
    kadroTamamla(k,v.kulupId,KADRO_HEDEF,'satis:'+v.oyuncuId);sozlesmeleriTamamla(k);
    return{bilgi:meseleOlay(k,v.meseleId,'tr.sat',{oyuncuId:v.oyuncuId,bedel:v.bedel,tarih:yarin})};
  },
  zamanAsimi:{metin:()=>'Cevap vermezsen teklif geri çekilir.',uygula:(k,is)=>({bilgi:meseleOlay(k,is.veri.meseleId,'tr.cevapsiz',{})})}
};

/* ---- hocanın transfer isteği ve imza ---- */
GELISMELER.hocaTalebi={
  denetle:(k,v)=>k.kulupler[v.kulupId]?[]:['kulüp bulunamadı'],
  uygula:(k,is)=>{sozlesmeleriTamamla(k);const v=is.veri,olay=paketDene(k,'hocaTalebi','talep:'+v.anahtar,Object.assign({},v));return olay?{bilgi:'Hoca transfer istedi.',dur:true}:{bilgi:null};}   /* maaş tavanı sözleşmelerden */
};
/* en zayıf hat: en iyi (DEF 4, OS 4, FV 2) oyuncularının gizli ortalaması ligin aynı hattının ortalamasından en çok geride olan. G2 incelemesi:
   ham ortalamalar mevkiler arasında kıyaslanamaz (savunmacının şut ve dripling özellikleri yapısı gereği düşük; ham kıyas hep DEF seçiyordu) */
function zayifHat(k,kulupId){
  const H=[['DEF',4],['OS',4],['FV',2]],ust=(L,m,n)=>{const A=L.filter(p=>p.mevki===m).map(oyuncuOrt).sort((a,b)=>b-a).slice(0,n);return A.length?A.reduce((a,b)=>a+b,0)/A.length:0;};
  const K=Object.keys(k.kulupler).filter(c=>k.kulupler[c].kadro).map(c=>kulupOyunculari(k,c)),L=kulupOyunculari(k,kulupId);
  return H.map(([m,n])=>({m,o:ust(L,m,n)-K.reduce((s,X)=>s+ust(X,m,n),0)/K.length})).sort((a,b)=>a.o-b.o||(a.m<b.m?-1:1))[0].m;
}
PAKETLER.hocaTalebi={
  surum:1,icerik:5,
  degerlendir:(k,b)=>{
    const h=kulupHocasi(k,b.kulupId);if(!h||!transferDonemi(k,k.tarih)||Object.values(k.olaylar).some(o=>o.paket==='hocaTalebi'&&o.durum==='acik'))return null;
    const r=kadroRastgele(k.dunyaTohumu,'talep:'+b.anahtar),[a,z]=TRANSFER_TEST.bonservis,L=kulupOyunculari(k,b.kulupId).filter(p=>p.sozlesme);
    const ort=L.length?L.reduce((s,p)=>s+p.sozlesme.maas,0)/L.length:SOZLESME_TEST.taban;
    b.hocaId=h.id;b.mevki=zayifHat(k,b.kulupId);b.bonservis=Math.round((a+(z-a)*r())/5000000)*5000000;
    b.tavan=Math.round(ort*TRANSFER_TEST.maasTavanKat/SOZLESME_TEST.yuvarla)*SOZLESME_TEST.yuvarla;
    return'talep';
  },
  ac:(k,olay,b)=>{
    const id=meseleAc(k,{tur:'transfer',baslik:'Hocanın transfer isteği',sorumluId:k.baskanId,kisiler:[b.hocaId]});olay.meseleId=id;
    meseleOlay(k,id,'tr.talep',{kisiId:b.hocaId,mevki:b.mevki,bonservis:b.bonservis,tavan:b.tavan});
    isEkle(k,{tur:'ajanda',tarih:tarihEkle(k.tarih,TRANSFER_TEST.cevapGun),dakika:1080,veri:{baslik:'Hocanın transfer isteği',zorunluluk:'zorunlu',sure:0,saatsiz:true,bekleyebilir:true,
      gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'transferButcesi',soran:b.hocaId,meseleId:id,olayId:olay.id,kulupId:b.kulupId,hocaId:b.hocaId,
      mevki:b.mevki,bonservis:b.bonservis,tavan:b.tavan,aciklama:`${MEVKI_ADI[b.mevki]} hattı için bütçe isteği.`}});
  }
};
KARAR_TURLERI.transferButcesi={
  denetle:(k,v)=>{const h=[];if(!(k.kisiler||{})[v.hocaId])h.push('hoca bulunamadı');if(!['DEF','OS','FV'].includes(v.mevki))h.push('mevki geçersiz');
    if(!Number.isInteger(v.bonservis)||v.bonservis<0||!Number.isInteger(v.tavan)||v.tavan<=0)h.push('bütçe geçersiz');if(typeof v.meseleId!=='string')h.push('mesele yok');return h;},
  secenekler:(k,is)=>{const v=is.veri,d=transferDonemi(k,k.tarih);
    return[{id:'onayla',metin:'Bütçeyi onayla',sure:15,engel:d?null:'Transfer dönemi kapalı',aciklama:[`Bonservis en çok ${paraYazi(v.bonservis)}, maaş en çok ${paraYazi(v.tavan)}.`,`${TRANSFER_TEST.imzaGun} gün içinde oyuncu bulunur ya da bulunamaz.`]},
      {id:'reddet',metin:'Reddet',sure:0,aciklama:['Bu dönem o hatta transfer yok.']}];},
  uygula:(k,is,secim)=>{
    const v=is.veri;
    if(secim==='reddet')return{bilgi:meseleOlay(k,v.meseleId,'tr.ret',{mevki:v.mevki})};
    const d=transferDonemi(k,k.tarih),t=tarihEkle(k.tarih,TRANSFER_TEST.imzaGun),tarih=d&&t>d.bitis?d.bitis:t;
    isEkle(k,{tur:'gelisme',tarih,dakika:TRANSFER_TEST.saat,veri:{gelisme:'transferImza',kulupId:v.kulupId,hocaId:v.hocaId,mevki:v.mevki,bonservis:v.bonservis,tavan:v.tavan,meseleId:v.meseleId,olayId:v.olayId}});
    return{bilgi:meseleOlay(k,v.meseleId,'tr.onay',{tarih})};
  },
  zamanAsimi:{metin:()=>'Cevap vermezsen istek düşer.',uygula:(k,is)=>({bilgi:meseleOlay(k,is.veri.meseleId,'tr.talepCevapsiz',{})})}
};
/* imzalanacak oyuncu: serbest, yoksa altımızdaki kulüpten bütçeye uyan, yoksa null */
function transferHedefi(k,v){
  const uy=p=>p&&p.mevki===v.mevki;
  const serbest=Object.values(k.oyuncular).filter(p=>p.kulupId===null&&uy(p)&&maasTahmini(p,k.tarih)<=v.tavan).sort((a,b)=>oyuncuOrt(b)-oyuncuOrt(a)||(a.id<b.id?-1:1));
  if(serbest.length)return{p:serbest[0],bedel:0};
  const tb=sezonTablosu(k),i=tb.findIndex(t=>t.id===v.kulupId),alt=tb.slice(i+1).map(t=>t.id);
  const A=alt.flatMap(c=>kulupOyunculari(k,c)).filter(p=>uy(p)&&oyuncuDegeri(p,k.tarih)<=v.bonservis).sort((a,b)=>oyuncuOrt(b)-oyuncuOrt(a)||(a.id<b.id?-1:1));
  return A.length?{p:A[0],bedel:oyuncuDegeri(A[0],k.tarih)}:null;
}
GELISMELER.transferImza={
  denetle:(k,v)=>{const h=[];if(!(k.kulupler||{})[v.kulupId])h.push('kulüp bulunamadı');if(typeof v.meseleId!=='string')h.push('mesele yok');return h;},
  uygula:(k,is)=>{
    const v=is.veri,H=transferHedefi(k,v);
    if(!H)return{bilgi:meseleOlay(k,v.meseleId,'tr.bulunamadi',{mevki:v.mevki}),dur:true};
    const p=H.p,eski=p.kulupId,maas=Math.min(maasTahmini(p,k.tarih),v.tavan),yarin=tarihEkle(k.tarih,1);
    oyuncuTransfer(k,p.id,v.kulupId,{bedel:H.bedel,sozlesme:{maas,bitis:sozlesmeBitisi(k,2)}});
    if(eski)kadroTamamla(k,eski,KADRO_HEDEF,'satis:'+p.id);
    sozlesmeleriTamamla(k);
    if(H.bedel>0)odemePlanla(k,{kulupId:v.kulupId,tarih:yarin,dakika:600,tutar:-H.bedel,kalem:'transfer',aciklama:`${p.ad} bonservisi`,meseleId:v.meseleId});
    haberEkle(k,{tur:'gazete',anahtar:'tr.haber',p:{oyuncuId:p.id,alici:v.kulupId,kaynak:'yerelGazete'},olayId:v.olayId});
    const bilgi=meseleOlay(k,v.meseleId,'tr.imza',{oyuncuId:p.id,eski,bedel:H.bedel,maas});
    /* teşekkür görevdeki hocadan (G2 incelemesi: arada hoca değiştiyse ayrılan hoca yazmaz; kulüp bütçe kararını uygular) */
    const hc=kulupHocasi(k,v.kulupId);if(hc)meseleOlay(k,v.meseleId,'tr.tesekkur',{kisiId:hc.id});
    return{bilgi,dur:true};
  }
};
