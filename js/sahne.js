/* ============ Chairman — sahne: bir kişiyle kart zinciri; saat kartla akar (kural; çizim yok; AR3, 2026-11-05) ============
   Kararlar 90–91 (YOL_HARITASI; OYUN_TASARIMI §6 “model C”; araclar/plan/arayuz-uygulama.md §4). Görüşme tek kart değildir: odada, telefonda ya da
   dışarıda bir kişiyle art arda kartlar oynanır; her cevap kendi dakikası kadar saati ilerletir, görüşmenin süresi verilen cevaplardan çıkar.
   Süre önceden bilinmez, tahmin edilir: kişinin geçmiş sahnelerinden (olgudan); ilk görüşmede rolün kaba aralığı.
     k.sahne (isteğe bağlı; açık sahne, kayıtta durur — kayıt sahnenin ortasında da açılır):
       {id, tur:'oda'|'telefon'|'disari', kisiId, konu, kaynak:{isId?, meseleId?}|null, mekanId?, tahmin:{min, max, kaynak:'gecmis'|'rol', sayi},
        bas:{tarih, dakika}, sure, n, kartId, log:[{kart, secim, metin, dk, tarih, dakika, bilgi?}], p}
       p: konunun sahne açılırkenki görüntüsü (kartların metni bundan kurulur; sonradan tablo ya da sakatlık değişse de sahne aynı kalır).
     SAHNE_KONULARI[konu] = {ad(k,s) → başlık, goruntu?(k,s) → p, kartlar(k,s) → [{id, kunye, soru, cevaplar:[c, c]}], bitis?(k,s) → {bilgi?}}
       cevap c: {id, metin, aciklama:[…], agirlik?:'selam'|'bilgi'|'rakam'|'kriz' (SAHNE_TEST.agirlik) ya da dk?, bitir?, git?:kartId, tepki?,
                 engel?, uygula?(k,s) → {bilgi?}}; her kartın tam iki cevabı vardır (tek kart kuralı). Sıradaki kart: git varsa o, yoksa listedeki sonraki;
                 bitir ya da son kart sahneyi kapatır. Konusu kayıtlı olmayan ziyaret konuları (js/ziyaret.js ZIYARET_KONULARI: içerik paketleri) tek kartlık
                 sahne olarak oynanır (sahneZiyaretKonusu).
     sahneAc(k, {tur, kisiId, konu, kaynak?, mekanId?})   komut; 'disari'de gidiş yolu zamanı ilerletir, masraf kasadan (js/mekan.js)
     sahneOnizle(k, secim?) → {sahne, kart, cevap, dk, bitis, engel, kesen, atlanacak, cevapsiz, gerceklesecek}   saf; kartın yüzü bundan
     sahneCevapVer(k, secim) → {biten, bitti, ozet}        komut; cevabın uygula'sı, günlük, zaman dk kadar ilerler (arada zamanı gelen işler takvimin
                                                           kuralıyla: isteğe bağlı saatli iş kaçırılır, saatsiz kararın son cevabı uzar — sureUzat)
     sahneBirak(k) → özet                                  komut; görüşmeyi yarıda keser (geçmişe yarida:true)
     sahneTahmini(k, kisiId, tur) → {min, max, kaynak, sayi, sureler}   saf; son SAHNE_TEST.gecmisEnCok sahne: en kısa × 0,9 – en uzun × 1,2
   Zorunlu saatli iş sahneyi keser (Claude'un uygulama kararı): cevabın süresi zorunlu bir işin (maç günü) başlangıcını aşacaksa zaman o ana kadar ilerler
   ve sahne orada biter (geçmişe kesildi: işin adı); kart bunu önceden yazar. Zorunlu işin saatinde sahne açılmaz.
   Biten sahne geçmişe yazılır (hafıza = geçmiş; kişi kaydına alan yok): {tur:'sahne', id, kisiId, sahneTur, konu, sure, tarih, dakika (başlangıç),
     bitis:{tarih, dakika}, tahmin:[min, max], log, p?, kaynak?, mekanId?, yol?, yarida?, kesildi?, bilgi?}. Defterin o günü (js/ajanda.js ajandaGunu),
     Haberler (js/gelismeler.js) ve oyuncu dosyasının notları (js/kadro-dosyasi.js) bu satırı okur.
   Sahne açıkken başka işe katılınmaz ve ilerlenmez (AJANDA_ENGELLERI, ILERLE_ENGELLERI). Rastlantı çekilmez. Süreler, aralıklar ve metinler TEST. */
'use strict';
const SAHNE_TEST={agirlik:{selam:2,bilgi:5,rakam:12,kriz:20},varsayilan:'bilgi',
  rolTahmin:{ekip:[20,40],menajer:[5,15],rakipBaskan:[45,90],kurum:[30,60]},aramaTahmin:[5,15],gecmisEnCok:5,tahminCarpan:[0.9,1.2],kartEnCok:12,logEnCok:24};
const SAHNE_TURLERI=['oda','telefon','disari'];
const SAHNE_EKIP_ROLLERI=['teknikDirektor','yardimciAntrenor','maliMudur'];
const SAHNE_ENGEL='Önce görüşmeyi bitir';
const SAHNE_KONULARI={};
const sahneAcik=k=>!!(k&&k.sahne);
const sahneRolSinifi=p=>!p?'kurum':SAHNE_EKIP_ROLLERI.includes(p.rol)?'ekip':p.rol==='menajer'?'menajer':p.rol==='baskan'?'rakipBaskan':'kurum';
/* ziyaret konusu (içerik paketi) tek kartlık sahne olarak: konuşma soru, iki cevap; cevap sözü ya da etkiyi paketin uygula'sıyla verir */
function sahneZiyaretKonusu(konu){
  const Z=typeof ZIYARET_KONULARI!=='undefined'?ZIYARET_KONULARI[konu]:null;if(!Z)return null;
  return{ad:(k,s)=>Z.baslik?Z.baslik(k,{kisiId:s.kisiId}):`Görüşme: ${kisiAdi(k,s.kisiId)}`,
    kartlar:(k,s)=>[{id:'konu',kunye:`Görüşme · ${kisiAdi(k,s.kisiId)}`,soru:Z.konusma(k,{kisiId:s.kisiId,konu:s.konu}),
      cevaplar:Object.keys(Z.cevaplar).map(id=>({id,metin:Z.cevaplar[id].metin,aciklama:[Z.cevaplar[id].aciklama],agirlik:'rakam',bitir:true,tepki:Z.cevaplar[id].tepki,
        uygula:Z.uygula?(k2,s2)=>{Z.uygula(k2,{id:(s2.kaynak||{}).isId||s2.id,veri:{kisiId:s2.kisiId,konu:s2.konu}},id);return{};}:null}))}]};
}
const sahneKonusu=konu=>SAHNE_KONULARI[konu]||sahneZiyaretKonusu(konu);
const sahneCevapDk=c=>Number.isInteger(c.dk)?c.dk:SAHNE_TEST.agirlik[c.agirlik]||SAHNE_TEST.agirlik[SAHNE_TEST.varsayilan];
function sahneKartlari(k,s){
  const K=sahneKonusu(s.konu),L=K?K.kartlar(k,s)||[]:[];
  return L.filter(x=>x&&typeof x.id==='string'&&Array.isArray(x.cevaplar)&&x.cevaplar.length===2);
}
const sahneAdi=(k,s)=>{const K=sahneKonusu(s.konu);return K&&K.ad?K.ad(k,s):`Görüşme: ${kisiAdi(k,s.kisiId)}`;};
/* kişinin biten sahneleri (yarıda kalan ve kesilen tahmine girmez) */
const sahneGecmisi=(k,kisiId,tur)=>(k.gecmis||[]).filter(g=>g.tur==='sahne'&&g.kisiId===kisiId&&(!tur||g.sahneTur===tur)&&!g.yarida&&!g.kesildi);
function sahneTahmini(k,kisiId,tur){
  const T=SAHNE_TEST,G=sahneGecmisi(k,kisiId,tur).slice(-T.gecmisEnCok).map(g=>g.sure);
  if(G.length)return{min:Math.max(1,Math.round(Math.min(...G)*T.tahminCarpan[0])),max:Math.max(2,Math.round(Math.max(...G)*T.tahminCarpan[1])),kaynak:'gecmis',sayi:G.length,sureler:G};
  const A=tur==='telefon'?T.aramaTahmin:T.rolTahmin[sahneRolSinifi((k.kisiler||{})[kisiId])]||T.rolTahmin.kurum;
  return{min:A[0],max:A[1],kaynak:'rol',sayi:0,sureler:[]};
}
/* sahnenin içinde zaman: arada zamanı gelen işler takvimin kuralıyla; saatsiz kararın son cevabı sahnenin o anından SURE_UZATMA sonraya uzar */
function sahneZaman(k,dk){const b=simdikiAn(k)+dk;return zamanIlerletAna(k,b,null,x=>sureUzat(k,x,b)).biten;}
/* şu an başlangıcında durulan ya da geçmiş zorunlu saatli iş (sahne açılmaz) */
const sahneZorunluSimdi=k=>bekleyenIsler(k).find(x=>x.tur==='ajanda'&&!x.veri.saatsiz&&x.veri.zorunluluk==='zorunlu'&&isAn(x)<=simdikiAn(k))||null;
function sahneAc(k,o){
  if(k.sahne)throw new Error('Zaten bir görüşmedesin');
  const p=(k.kisiler||{})[o.kisiId],K=sahneKonusu(o.konu),M=o.tur==='disari'?MEKANLAR[o.mekanId]:null;
  if(!SAHNE_TURLERI.includes(o.tur))throw new Error(`Bilinmeyen sahne türü: ${o.tur}`);
  if(!p)throw new Error(`Kişi bulunamadı: ${o.kisiId}`);
  if(!K)throw new Error(`Görüşmenin konusu tanımlı değil: ${o.konu}`);
  if(o.tur==='disari'&&!M)throw new Error(`Mekân bulunamadı: ${o.mekanId}`);
  const z=sahneZorunluSimdi(k);if(z)throw new Error(`Önce zorunlu işe katıl: ${z.veri.baslik}`);
  const t=sahneTahmini(k,o.kisiId,o.tur);
  const s={id:'sahne-'+((k.gecmis||[]).filter(g=>g.tur==='sahne').length+1),tur:o.tur,kisiId:o.kisiId,konu:o.konu,kaynak:o.kaynak||null,
    tahmin:{min:t.min,max:t.max,kaynak:t.kaynak,sayi:t.sayi},bas:null,sure:0,n:0,kartId:null,log:[],p:null};
  if(M){s.mekanId=o.mekanId;
    mekanMasrafi(k,o.mekanId,bizimKulup(k),`Görüşme: ${p.ad}`,o.kaynak&&o.kaynak.meseleId);
    if(M.yol)sahneZaman(k,M.yol);}
  s.bas={tarih:k.tarih,dakika:k.gunIciDakika};
  k.sahne=s;
  s.p=K.goruntu?K.goruntu(k,s)||null:null;
  const L=sahneKartlari(k,s);
  if(!L.length){delete k.sahne;throw new Error(`Görüşmenin kartı yok: ${o.konu}`);}
  s.kartId=L[0].id;
  return s;
}
function sahneOnizle(k,secim){
  const s=k.sahne,R={sahne:s||null,kart:null,cevap:null,dk:0,bitis:null,engel:[],kesen:null,atlanacak:[],cevapsiz:[],gerceklesecek:[]};
  if(!s){R.engel.push('Açık görüşme yok');return R;}
  const kart=sahneKartlari(k,s).find(x=>x.id===s.kartId)||null;R.kart=kart;
  if(!kart){R.engel.push('Görüşmenin kartı bulunamadı');return R;}
  if(s.anlik)R.engel.push('Önce telefona bak ya da bakma');
  if(secim===undefined||secim===null)return R;
  const c=kart.cevaplar.find(x=>x.id===secim);
  if(!c){R.engel.push(`Geçersiz cevap: ${secim}`);return R;}
  R.cevap=c;if(c.engel)R.engel.push(c.engel);
  const an=simdikiAn(k);R.dk=sahneCevapDk(c);let bitis=an+R.dk;
  const L=bekleyenIsler(k);
  /* zorunlu saatli iş sahneyi keser: zaman onun başlangıcına kadar ilerler */
  for(const x of L)if(x.tur==='ajanda'&&!x.veri.saatsiz&&x.veri.zorunluluk==='zorunlu'&&isAn(x)<=bitis){R.kesen={is:x,an:Math.max(isAn(x),an)};bitis=R.kesen.an;break;}
  for(const x of L){
    if(isSonAn(x)>bitis)continue;
    if(x.tur!=='ajanda'){if(!isGizli(x))R.gerceklesecek.push(x);continue;}
    if(zamanAsimiVar(x)){R.cevapsiz.push(x);continue;}
    if(x.veri.saatsiz)continue;                    /* son cevabı uzar (sureUzat) */
    R.atlanacak.push(x);
  }
  R.bitis=bitis;
  return R;
}
function sahneBitir(k,ek){
  const s=k.sahne;if(!s)throw new Error('Açık görüşme yok');
  const K=sahneKonusu(s.konu),M=s.mekanId?MEKANLAR[s.mekanId]:null,r=K&&K.bitis?K.bitis(k,s)||{}:{};
  const g={tur:'sahne',id:s.id,kisiId:s.kisiId,sahneTur:s.tur,konu:s.konu,sure:s.sure,tarih:s.bas.tarih,dakika:s.bas.dakika,bitis:{tarih:k.tarih,dakika:k.gunIciDakika},
    tahmin:[s.tahmin.min,s.tahmin.max],log:s.log.slice(-SAHNE_TEST.logEnCok)};
  if(s.kaynak)g.kaynak=s.kaynak;
  if(s.p)g.p=s.p;
  if(M){g.mekanId=s.mekanId;g.yol=M.yol;}
  if(ek)Object.assign(g,ek);
  if(r.bilgi)g.bilgi=String(r.bilgi);
  delete k.sahne;
  if(M&&M.yol)sahneZaman(k,M.yol);                 /* dönüş yolu */
  k.gecmis.push(g);
  return g;
}
function sahneCevapVer(k,secim){
  const o=sahneOnizle(k,secim);
  if(!o.cevap&&!o.engel.length)o.engel.push('Bir cevap seçilmeli');
  if(o.engel.length)throw new Error('Cevap verilemedi: '+o.engel.join('; '));
  const s=k.sahne,c=o.cevap,kart=o.kart,an=simdikiAn(k),gecen=o.bitis-an;
  const r=c.uygula?c.uygula(k,s)||{}:{},bilgi=r.bilgi||c.tepki||null;
  const satir={kart:kart.id,secim:c.id,metin:String(c.metin),dk:gecen,tarih:k.tarih,dakika:k.gunIciDakika};
  if(bilgi)satir.bilgi=String(bilgi);
  s.log.push(satir);s.n++;s.sure+=gecen;
  const biten=zamanIlerletAna(k,o.bitis,null,x=>sureUzat(k,x,o.bitis)).biten;
  let bitti=false,ek=null;
  if(o.kesen){bitti=true;ek={kesildi:String(o.kesen.is.veri.baslik)};}
  else if(c.bitir||s.n>=SAHNE_TEST.kartEnCok)bitti=true;
  else{const L=sahneKartlari(k,s),i=L.findIndex(x=>x.id===kart.id),sonraki=c.git?L.find(x=>x.id===c.git):L[i+1];
    if(sonraki)s.kartId=sonraki.id;else bitti=true;}
  return{biten,bitti,ozet:bitti?sahneBitir(k,ek):null};
}
const sahneBirak=k=>sahneBitir(k,{yarida:true});
/* sahnenin defterdeki ve Haberler'deki tek satırı */
function sahneSatirMetni(k,g){
  const ad=kisiAdi(k,g.kisiId),ne=g.sahneTur==='telefon'?'telefon görüşmesi':g.sahneTur==='disari'?'görüşme'+(g.mekanId&&MEKANLAR[g.mekanId]?' ('+MEKANLAR[g.mekanId].ad+')':''):'görüşme';
  return`${ad} ile ${ne}: ${g.sure} dk`+(g.kesildi?` — ${g.kesildi} nedeniyle yarıda kaldı`:g.yarida?' — yarıda kestin':'');
}
function sahneDogrula(k,h){
  const s=k.sahne;if(s===undefined||s===null)return;
  const tam=x=>Number.isInteger(x)&&x>=0;
  if(typeof s!=='object'||Array.isArray(s)||!SAHNE_TURLERI.includes(s.tur)||!(k.kisiler||{})[s.kisiId]||typeof s.konu!=='string'||typeof s.id!=='string'
    ||!s.bas||!tarihGecerliMi(s.bas.tarih)||!tam(s.bas.dakika)||!tam(s.sure)||!tam(s.n)||typeof s.kartId!=='string'||!Array.isArray(s.log)
    ||!s.tahmin||!tam(s.tahmin.min)||!tam(s.tahmin.max)){h.push('Açık görüşme (sahne) kaydı geçersiz');return;}
  if(anDakika(s.bas.tarih,s.bas.dakika)>simdikiAn(k))h.push('Açık görüşme (sahne) gelecekte başlıyor');
  if(s.tur==='disari'&&!MEKANLAR[s.mekanId])h.push(`Açık görüşmenin mekânı yok (${s.mekanId})`);
  if(s.log.length!==s.n||s.log.some(x=>!x||typeof x.kart!=='string'||typeof x.secim!=='string'||!tam(x.dk)))h.push('Açık görüşmenin günlüğü geçersiz');
}
EK_DENETIMLER.push(sahneDogrula);
AJANDA_ENGELLERI.push(k=>k.sahne?SAHNE_ENGEL:null);
ILERLE_ENGELLERI.push(k=>k.sahne?SAHNE_ENGEL:null);

/* ---- konular (TEST metinler; kullanıcı değiştirir). Yeni hikâye yok: mevcut okumalardan kurulur ---- */
/* takım görüşmesi (hoca ya da yardımcı; telefonda kabul edilen ekip görüşmesi): takımın görüntüsü, istenirse bir oyuncunun görüşü
   (js/yazisma.js takimGoruntusu, oyuncuGoruntusu; söylenenler oyuncu dosyasına not düşer — js/kadro-dosyasi.js) */
const SAHNE_METIN={
  baska:(k,s,ad)=>`TEST: “${ad} için de bir şey diyeyim mi başkanım?”`,
  yeter:{metin:'Bugünlük bu kadar',aciklama:'Görüşme biter.'},
  anlat:{metin:'Anlat',aciklama:ad=>`${ad} hakkındaki görüşünü dinlersin; oyuncunun dosyasına not düşer.`},
  tamam:{metin:'Anladım',aciklama:'Görüşme biter.'},
  takip:{metin:'Gözün üstünde olsun',aciklama:'Görüşme biter; bunu aklında tutar (TEST: bugün etkisi yok).'}
};
SAHNE_KONULARI.takim={
  ad:(k,s)=>`Görüşme: ${kisiAdi(k,s.kisiId)}`,
  goruntu:(k,s)=>{
    const T=takimGoruntusu(k),yard=(k.kisiler[s.kisiId]||{}).rol==='yardimciAntrenor';
    /* konuşulacak oyuncu: hoca önce formda olanı, yardımcı önce yorgunu söyler (yardımcı formdan söz etmez); yoksa dönüşü en yakın sakat */
    const aday=(yard?[]:T.formda||[]).concat(T.yorgun||[],(T.sakat||[]).map(x=>x.id))[0]||null;
    return{takim:T,oyuncu:aday&&(k.oyuncular||{})[aday]?oyuncuGoruntusu(k,aday,s.kisiId):null};},
  kartlar:(k,s)=>{
    const ad=kisiAdi(k,s.kisiId),p=s.p||{},C=ZIYARET_METIN.cevap,yard=(k.kisiler[s.kisiId]||{}).rol==='yardimciAntrenor',M=SAHNE_METIN;
    const L=[{id:'durum',kunye:`Takım · ${ad}`,soru:ziyaretKonusmasi(k,s.kisiId,p.takim||takimGoruntusu(k)),cevaplar:[
      {id:'tesekkur',metin:C.tesekkur.metin,aciklama:[C.tesekkur.aciklama],agirlik:'rakam',tepki:C.tesekkur.tepki,bitir:!p.oyuncu},
      {id:'baski',metin:C.baski.metin,aciklama:[C.baski.aciklama],agirlik:'kriz',tepki:C.baski.tepki,bitir:!p.oyuncu}]}];
    if(p.oyuncu){const oa=yzOyuncu(k,p.oyuncu.oyuncuId);
      L.push({id:'baska',kunye:`Görüşme · ${ad}`,soru:M.baska(k,s,oa),cevaplar:[
        {id:'yeter',metin:M.yeter.metin,aciklama:[M.yeter.aciklama],agirlik:'selam',bitir:true},
        {id:'anlat',metin:M.anlat.metin,aciklama:[M.anlat.aciklama(oa)],agirlik:'bilgi'}]});
      L.push({id:'oyuncu',kunye:`${oa} · ${ad}`,soru:(yard?YAZISMA_METIN.yardimciOyuncu:YAZISMA_METIN.hocaOyuncu)(k,p.oyuncu),cevaplar:[
        {id:'tamam',metin:M.tamam.metin,aciklama:[M.tamam.aciklama],agirlik:'selam',bitir:true},
        {id:'takip',metin:M.takip.metin,aciklama:[M.takip.aciklama],agirlik:'bilgi',bitir:true}]});}
    return L;}
};
