/* ============ Chairman — kadro ve oyuncu dosyası: okuma (S-c, 2026-10-27; DOM yok) ============
   Başkan kadrosunu Dosya'nın Kadro sekmesinde görür: yalnız gözlenebilir sayılar (forma, mevki, yaş, maç, dakika, gol, kart, sakatlık, ceza,
   sözleşme). Yetenek puanı, kondisyon, form, tavan, hocanın bilgi ve ısrarı burada yoktur (Test bilgileri açıkken yalnız TEST kutusunda).
   js/mali-rapor.js'in okuma sözleşmesi: kayda yeni alan girmez, metin okurken kurulur; işlevler saf ve belirlenimlidir.
     kadroVar(k)                    başkan görevde ve kulübünün kadrosu var
     kadroSatirlari(k, kulupId)     → [{id, no, ad, mevki, yas, mac, dk, gol, sari, kirmizi, sakat:{neden,donus,belirsiz?}|null, ceza:{mac,neden}|null,
                                       bitis|null, maas|null}] mevki (KL, DEF, OS, FV) sonra forma sırasıyla. mac/dk eski kayıtta null (ekranda —);
                                       kırmızı (kırmızı ve ikinci sarı) bu sezonun maç kayıtlarından tek geçişte sayılır; sakat yalnız dönüş gelecekteyse
     OYUNCU_NOT_KAYNAKLARI          [{ad, kaynakAd, notlar(k, id) → [{tarih, dakika, anahtar, p, kaynak?}]}] (MESAJ_KAYNAKLARI kalıbı): antrenman
                                       (js/gozlem.js gozlemNotlari), maç (gol, kart, sakatlık; bizim maçta on birde olmayış) ve hocanın “Takım ne durumda?”
                                       cevabı (cevap anının görüntüsü). Metinler MESELE_OLAYLARI['not.*'] (TEST); hiçbir notta gizli değerin sayısı yoktur
     oyuncuNotlari(k, id)           → [{tarih, dakika, kaynak, tur, metin}] (tur kaynağın adı: antrenman, mac, hoca, gorus; RK4-a) yeniden eskiye (eşitlikte kaynak, sonra kayıt sırası), en çok OYUNCU_NOT_EN_COK
     oyuncuDosyasi(k, id)           → {kunye, sezon, durum, sozlesme|null, notlar} ya da null */
'use strict';
const OYUNCU_NOT_EN_COK=30;
const KADRO_MEVKI_SIRA={KL:0,DEF:1,OS:2,FV:3};
const kadroVar=k=>{if(k.gorevDurumu!=='gorevde')return false;const b=k.kisiler&&k.kisiler[k.baskanId],c=b&&b.kulupId&&k.kulupler[b.kulupId];return!!(c&&c.kadro);};
/* bu sezonun kırmızıları (kırmızı ve ikinci sarı) tek geçişte; dondurulmuş maç kayıtları ve fikstür çifti başına bir kez */
const KADRO_KIRMIZI=new WeakMap();
function kadroKirmizilari(k){
  const M=k.maclar||{},onbellek=KADRO_KIRMIZI.get(M);
  if(onbellek&&onbellek.fikstur===k.fikstur)return onbellek.say;
  const say=new Map();
  for(const f of k.fikstur||[]){const s=M[f.id];if(!s)continue;
    for(const x of s.kartlar||[])if(x.id&&(x.renk==='kirmizi'||x.renk==='ikinciSari'))say.set(x.id,(say.get(x.id)||0)+1);}
  if(Object.isFrozen(M))KADRO_KIRMIZI.set(M,{fikstur:k.fikstur,say});
  return say;
}
const kadroSakat=(p,t)=>p.sakat&&tarihKarsilastir(p.sakat.donus,t)>0?Object.assign({neden:p.sakat.neden,donus:p.sakat.donus},p.sakat.belirsiz?{belirsiz:true}:{}):null;
const kadroCeza=p=>p.ceza&&p.ceza.mac>0?{mac:p.ceza.mac,neden:p.ceza.neden}:null;
const kadroSayi=v=>Number.isInteger(v)?v:null;
function kadroSatirlari(k,kulupId){
  const K=kadroKirmizilari(k);
  return kulupOyunculari(k,kulupId).filter(Boolean).map(p=>({id:p.id,no:p.no,ad:p.ad,mevki:p.mevki,yas:oyuncuYasi(p,k.tarih),mac:kadroSayi(p.mac),dk:kadroSayi(p.dk),
      gol:p.gol|0,sari:p.sari|0,kirmizi:K.get(p.id)||0,sakat:kadroSakat(p,k.tarih),ceza:kadroCeza(p),
      bitis:p.sozlesme?p.sozlesme.bitis:null,maas:p.sozlesme?p.sozlesme.maas:null}))
    .sort((a,b)=>(KADRO_MEVKI_SIRA[a.mevki]??9)-(KADRO_MEVKI_SIRA[b.mevki]??9)||a.no-b.no||(a.id<b.id?-1:1));
}

/* ---- notlar: kayıttan okunur, metin okurken kurulur ---- */
const notRakip=(k,f,taraf)=>{const r=taraf===0?f.konuk:f.ev;return(k.kulupler[r]||{ad:r}).ad;};
const OYUNCU_NOT_KAYNAKLARI=[
  {ad:'antrenman',kaynakAd:'Antrenman (balkon)',notlar:(k,id)=>typeof gozlemNotlari==='function'?gozlemNotlari(k,id):[]},
  /* maç kayıtlarından: gol (kendi kalesine ayrı), kart, sakatlık (ağrı ve kramp değil). Taraf maçtakidir; transferden sonra da değişmez */
  {ad:'mac',kaynakAd:'Maç',notlar:(k,id)=>{
    const L=[];
    for(const f of k.fikstur||[]){const s=(k.maclar||{})[f.id];if(!s)continue;
      const n=(anahtar,taraf,p)=>L.push({tarih:f.tarih,dakika:f.dakika,anahtar,p:Object.assign({rakip:notRakip(k,f,taraf)},p)});
      for(const g of s.goller||[])if(g.id===id)n(g.kk?'not.kk':'not.gol',g.kk?1-g.takim:g.takim,{dk:g.dk});
      for(const x of s.kartlar||[])if(x.id===id)n(x.renk==='sari'?'not.sari':x.renk==='ikinciSari'?'not.ikinciSari':'not.kirmizi',x.takim,{dk:x.dk});
      for(const x of s.sakatliklar||[])if(x.id===id&&(x.derece==='tedavi'||x.derece==='cikis')&&x.gun>0&&x.tur!=='kramp')n('not.sakat',x.takim,{gun:x.gun});
    }
    /* bizim maçta: önceki on birdeydi, maç günü uygundu, bu maçın on birinde yoktu (js/mac-sonuc.js geçmiş kaydı disarida) */
    for(const g of k.gecmis||[])if(g.tur==='mac'&&Array.isArray(g.disarida)&&g.disarida.includes(id)){
      const f=(k.fikstur||[]).find(x=>x.id===g.macId);if(!f)continue;
      const biz=(k.kisiler[k.baskanId]||{}).kulupId;
      L.push({tarih:g.tarih,dakika:g.dakika,anahtar:'not.disarida',p:{rakip:notRakip(k,f,f.konuk===biz?1:0)}});
    }
    return L;}},
  /* hocanın ya da yardımcının “Takım ne durumda?” cevabı: oyuncu cevap anındaki listede; kaynak kişinin adı. Yalnız o kişinin cevabında söylenen
     listeler, onun sözüyle (js/yazisma.js YAZISMA_METIN; inceleme 2026-10-27): yardımcı formdan söz etmez, yorgunluğu koşu verisiyle söyler */
  {ad:'hoca',kaynakAd:'Hoca',notlar:(k,id)=>{
    const L=[],icinde=X=>Array.isArray(X)&&X.some(x=>(x&&typeof x==='object'?x.id:x)===id);
    for(const g of k.gecmis||[]){const y=g.tur==='is'&&g.isTuru==='gelisme'&&g.sonuc&&g.sonuc.yazisma;if(!y||y.konu!=='takim'||y.cevapYok||!y.p)continue;
      const kisi=k.kisiler[y.kisiId]||{},yard=kisi.rol==='yardimciAntrenor';
      for(const tur of yard?['sakat','cezali','yorgun']:['sakat','cezali','yorgun','formda'])
        if(icinde(y.p[tur]))L.push({tarih:g.tarih,dakika:g.dakika,anahtar:(yard?'not.yardimci.':'not.hoca.')+tur,p:{},kaynak:kisi.ad||'—'});}
    /* RK6: odadaki görüşme (js/ziyaret.js geçmiş satırı {tur:'ziyaret', p}): aynı listeler, görüşme anının görüntüsünden */
    for(const g of k.gecmis||[]){if(g.tur!=='ziyaret'||g.konu!=='takim'||!g.p)continue;
      const kisi=k.kisiler[g.kisiId]||{},yard=kisi.rol==='yardimciAntrenor';
      for(const tur of yard?['sakat','cezali','yorgun']:['sakat','cezali','yorgun','formda'])
        if(icinde(g.p[tur]))L.push({tarih:g.tarih,dakika:g.dakika,anahtar:(yard?'not.yardimci.':'not.hoca.')+tur,p:{},kaynak:kisi.ad||'—'});}
    return L;}},
  /* R2-e: “Oyuncu hakkında sor” cevabı (js/yazisma.js konu 'oyuncu'): o oyuncunun dosyasına kişinin kendi sözüyle, cevap anının görüntüsünden */
  {ad:'gorus',kaynakAd:'Hoca',notlar:(k,id)=>{
    const L=[],K=typeof YAZISMA_KONULARI!=='undefined'&&YAZISMA_KONULARI.oyuncu;if(!K)return L;
    for(const g of k.gecmis||[]){const y=g.tur==='is'&&g.isTuru==='gelisme'&&g.sonuc&&g.sonuc.yazisma;if(!y||y.konu!=='oyuncu'||y.cevapYok||!y.p||y.p.oyuncuId!==id)continue;
      const kisi=k.kisiler[y.kisiId]||{},f=K.metin[kisi.rol]||K.metin.teknikDirektor;
      L.push({tarih:g.tarih,dakika:g.dakika,anahtar:kisi.rol==='yardimciAntrenor'?'not.yardimci.gorus':'not.hoca.gorus',p:{metin:f(k,y)},kaynak:kisi.ad||'—'});}
    return L;}}
];
/* TEST metinleri (kullanıcı değiştirir) */
Object.assign(MESELE_OLAYLARI,{
  'not.gol':(k,p)=>`TEST: ${p.rakip} maçında gol (${p.dk}').`,
  'not.kk':(k,p)=>`TEST: ${p.rakip} maçında kendi kalesine gol.`,
  'not.sari':(k,p)=>`TEST: ${p.rakip} maçında sarı kart.`,
  'not.ikinciSari':(k,p)=>`TEST: ${p.rakip} maçında ikinci sarıdan kırmızı.`,
  'not.kirmizi':(k,p)=>`TEST: ${p.rakip} maçında kırmızı kart.`,
  'not.sakat':(k,p)=>`TEST: ${p.rakip} maçında sakatlandı (${p.gun} gün).`,
  'not.disarida':(k,p)=>`TEST: ${p.rakip} maçında on birde yoktu.`,
  'not.hoca.gorus':(k,p)=>`“${p.metin}”`,
  'not.yardimci.gorus':(k,p)=>`“${p.metin}”`,
  'not.hoca.sakat':()=>'TEST: “Sakat.”',
  'not.hoca.cezali':()=>'TEST: “Cezalı.”',
  'not.hoca.yorgun':()=>'TEST: “Biraz yorgun; gerekirse dinlendiririm.”',
  'not.hoca.formda':()=>'TEST: “İyi günlerinde.”',
  'not.yardimci.sakat':()=>'TEST: Sakatlar listesinde.',
  'not.yardimci.cezali':()=>'TEST: Cezalılar listesinde.',
  'not.yardimci.yorgun':()=>'TEST: “Koşu verilerinde düşüş.”'
});
function oyuncuNotlari(k,id){
  const L=[];let n=0;
  OYUNCU_NOT_KAYNAKLARI.forEach((Q,qi)=>{for(const x of Q.notlar(k,id)||[])L.push({x,qi,n:n++,kaynak:x.kaynak||Q.kaynakAd,tur:Q.ad});});
  L.sort((a,b)=>tarihKarsilastir(b.x.tarih,a.x.tarih)||(b.x.dakika|0)-(a.x.dakika|0)||a.qi-b.qi||a.n-b.n);
  const S=[];
  for(const o of L){if(S.length>=OYUNCU_NOT_EN_COK)break;const f=MESELE_OLAYLARI[o.x.anahtar];if(!f)continue;
    S.push({tarih:o.x.tarih,dakika:o.x.dakika|0,kaynak:o.kaynak,tur:o.tur,metin:f(k,o.x.p||{})});}
  return S;
}
function oyuncuDosyasi(k,id){
  const p=k.oyuncular&&k.oyuncular[id];if(!p)return null;
  const c=k.kulupler[p.kulupId];
  return{kunye:{ad:p.ad,no:p.no,mevki:p.mevki,yas:oyuncuYasi(p,k.tarih),dogumTarihi:p.dogumTarihi,ayak:p.ayak,kulupAd:c?c.ad:'—'},
    sezon:{mac:kadroSayi(p.mac),dk:kadroSayi(p.dk),gol:p.gol|0,sari:p.sari|0,kirmizi:kadroKirmizilari(k).get(id)||0},
    durum:{sakat:kadroSakat(p,k.tarih),ceza:kadroCeza(p)},
    sozlesme:p.sozlesme?{bitis:p.sozlesme.bitis,maas:p.sozlesme.maas}:null,
    notlar:oyuncuNotlari(k,id)};
}
