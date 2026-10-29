/* ============ Chairman — maçın okunması: istatistik, beklenen gol, hocanın yorumu ve başkanın notu (saf; çizim yok; F3-b, 2026-10-24) ============
   OYUN_TASARIMI §2 "Maç başkanın bilgi kaynağıdır": başkan maça dokunmaz; izler, okur ve yönetim hamlesi çıkarır — hocanın tarzı sahada görünüyor mu,
   kötü sonuç şanssızlık mı beceri farkı mı, sabır mı değişiklik mi. Bu dosya oynanmış maçın kaydından (k.maclar[id]: skor, sutlar, xg, ist, hocalar,
   tarz; js/mac-sonuc.js) okunacak üç şey türetir; hiçbiri kayda metin yazmaz (kaydet–yükle ikinci rapor üretmez, şablon değişince eski maçın
   okuması da yeni metinle görünür):
     macOkumasi(k, macId, kulupId?) → {macId, hafta, tarih, t (kulübün takım sırası), rakipId, skor:[biz, rakip], xg:[biz, rakip], ist (biz/rakip
       çiftleri), tarzIzi:{tarz, uzunPay, beklenen, uyum}, sans, oneCikan:{id, ad, neden}|null, hoca:{id, ad}, kaynak:{kisiId, tarih, dakika}}
       sans: 'sanssiz' (pozisyonu biz bulduk, sonuç gelmedi), 'sansli', 'hakli' (sonuç oyunu yansıtıyor), 'dengeli'. Eşik MAC_SANS_ESIK beklenen gol.
       tarzIzi: takımın uzun pas payı (≥ 32 m paslar ÷ bütün paslar) hocanın tarzının beklenen bandında mı (TARZ_UZUN_PAY; 'kisa', 'uyumlu', 'uzun').
     macYorumu(k, macId) → {kisiId, metin} — hocanın maç akşamı telefondaki kısa değerlendirmesi. Hoca kendi sesiyle yazar: ısrarcı hoca kötü sonucu
       şansa bağlayabilir (sayılar ne derse desin); başkan bunu beklenen golle karşılaştırır. YORUM_METIN şablonları.
     macGozlemNotu(k, macId) → metin — başkanın deftere düşen notu: gözlenebilir sayılar (skor, beklenen gol, şut, sahiplik) ve bir cümle. GOZLEM_NOTU_METIN.
     H2-b (2026-10-26): macIstSatirlari(ist, xg) — Canlı Skor'un 10 satırlık istatistik tablosu; bizim maç ve öbür maçlar, canlı ve kayıttan
       aynı okuma. R3 (2026-10-29): maçın ayrıntısı Canlı Skor'un maç sayfasıdır (js/canli-skor.js macSayfasi); macAyrintisi kalktı.
   Gizli puan kuralı (OYUN_TASARIMI §9): yetenek puanı, hocanın bilgisi ya da ısrarı yazılmaz; gözlenebilir sayılar ve beklenen gol yazılır (karar 34).
   Telefon (H2-c'den beri): hocanın yorumu başkan sorunca gelir (js/yazisma.js); kendiliğinden mesaj ve okundu listesi yok.
   METİNLER TEST TASLAĞIDIR (kullanıcı kararı 2026-10-23, karar 35): Claude yazdı, kullanıcı YORUM_METIN ve GOZLEM_NOTU_METIN'i istediği gibi değiştirir. */
'use strict';
const MAC_SANS_ESIK=0.5;            // beklenen gol farkı: bunun altında "dengeli"
/* tarzın beklenen uzun pas payı bandı [alt, üst]: ölçülen takım-maçların %10–%90'ı (F3-b, 2026-10-24, masaüstü: 36 tam maç, MAC_KADRO, tarz başına
   12 takım-maç; ortalamalar konumsal 0,085 · ilişkisel 0,117 · dengeli 0,153 · dikey 0,174 · kanat ve orta 0,194 · direkt 0,262). Motor ya da
   kadrolar değişince yeniden ölçülür (araclar/plan/f3-uygulama.md) */
const TARZ_UZUN_PAY={konumsal:[0.05,0.13],iliskisel:[0.09,0.15],dengeli:[0.09,0.22],dikey:[0.13,0.22],kanatOrta:[0.14,0.27],direkt:[0.20,0.33]};
/* sayının Türkçe yazımı (1,25) */
const okSayi=(x,n=1)=>(+x).toFixed(n).replace('.',',');

function macOkumasi(k,macId,kulupId){
  const f=(k.fikstur||[]).find(x=>x.id===macId),s=(k.maclar||{})[macId];
  if(!f||!s)return null;
  kulupId=kulupId||(k.kisiler[k.baskanId]||{}).kulupId;
  if(f.ev!==kulupId&&f.konuk!==kulupId)return null;
  const t=f.konuk===kulupId?1:0,r=1-t,I=s.ist||{},c=a=>Array.isArray(a)?[a[t]|0,a[r]|0]:[0,0];
  const hocaId=s.hocalar?s.hocalar[t]:k.kulupler[kulupId].hocaId,hoca=k.kisiler[hocaId]||null,tarz=s.tarz?s.tarz[t]:hoca&&hoca.hoca?hoca.hoca.tarz:null;
  const pas=c(I.pas),uzun=c(I.uzunPas),uzunPay=pas[0]>0?uzun[0]/pas[0]:0,B=TARZ_UZUN_PAY[tarz]||null;
  const uyum=!B||!pas[0]?null:uzunPay<B[0]?'kisa':uzunPay>B[1]?'uzun':'uyumlu';
  const skor=[s.skor[t],s.skor[r]],xg=Array.isArray(s.xg)?[s.xg[t],s.xg[r]]:[0,0],dg=skor[0]-skor[1],dx=xg[0]-xg[1];
  const sans=Math.abs(dx)<MAC_SANS_ESIK?'dengeli':dx>0?(dg>0?'hakli':'sanssiz'):(dg<0?'hakli':'sansli');
  /* öne çıkan: kulübün oyuncusu — gol (kendi kalesine sayılmaz) + şutlarının beklenen golü; şutsuz maçta yok */
  const P=new Map(),ekle=(id,g,x,n)=>{if(!id)return;const o=P.get(id)||{g:0,x:0,n:0};o.g+=g;o.x+=x;o.n+=n;P.set(id,o);};
  for(const g of s.goller||[])if(g.takim===t&&!g.kk)ekle(g.id,1,0,0);
  for(const x of s.sutlar||[])if(x.takim===t)ekle(x.id,0,x.pen?MAC_PENALTI_XG:x.xg,1);
  let en=null;for(const [id,o] of P){const v=o.g+o.x;if(!en||v>en.v||(v===en.v&&id<en.id))en={id,v,o};}
  const oneCikan=en&&k.oyuncular[en.id]?{id:en.id,ad:k.oyuncular[en.id].ad,neden:en.o.g>0?(en.o.g>1?'goller':'gol'):'firsat',gol:en.o.g,sut:en.o.n,xg:Math.round(en.o.x*100)/100}:null;   /* H2-c: sut ve xg yardımcının rakamları için */
  const sahiplik=Array.isArray(I.sahiplik)?[I.sahiplik[t],I.sahiplik[r]]:[0.5,0.5];
  return{macId,hafta:f.hafta,tarih:f.tarih,t,rakipId:t?f.ev:f.konuk,skor,xg,hukmen:s.hukmen?(s.hukmen==='cift'?'cift':(s.hukmen==='ev')===(t===0)?'kayip':'galip'):null,
    ist:{sut:c(I.sut),isabet:c(I.isabet),korner:c(I.korner),faul:c(I.faul),sari:c(I.sari),kirmizi:c(I.kirmizi),ofsayt:c(I.ofsayt),pas,pasTamam:c(I.pasTamam),uzunPas:uzun,sahiplik},
    tarzIzi:{tarz,uzunPay:Math.round(uzunPay*100)/100,beklenen:B,uyum},sans,oneCikan,hoca:hoca?{id:hoca.id,ad:hoca.ad}:null,
    kaynak:{kisiId:hoca?hoca.id:null,tarih:f.tarih,dakika:Math.min(1439,f.dakika+MAC_SONRASI_DK)}};
}

/* ---- TEST şablonları (kullanıcı değiştirir). o: macOkumasi çıktısı; ad: rakibin adı ---- */
const YORUM_METIN={
  /* sonuç ve şans: hocanın ilk cümlesi */
  sanssiz:o=>o.skor[0]<o.skor[1]?'Pozisyonları biz bulduk, top girmedi. Bu oyunla puanlar gelir.':'Daha fazlasını hak ettik; fırsatları değerlendiremedik.',
  sansli:o=>o.skor[0]>o.skor[1]?'Kazandık ama dürüst olayım, rakip bizden çok pozisyona girdi.':'Bu puanı zor aldık; rakip daha tehlikeliydi.',
  hakli:o=>o.skor[0]>o.skor[1]?'Sonuç sahada olanı yansıtıyor; iyi oynadık.':'Rakip bugün bizden iyiydi, bahanem yok.',
  dengeli:o=>{const f=o.skor[0]-o.skor[1];
    if(Math.abs(f)>=2)return f>0?'Pozisyonlar dengeliydi; farkı bitiricilikte biz yaptık.':'Pozisyonlar dengeliydi ama rakip bulduğunu attı, biz atamadık.';
    if(o.skor[0]+o.skor[1]>=4&&o.xg[0]+o.xg[1]<o.skor[0]+o.skor[1]-1.5)return'Az pozisyondan çok gol çıktı; iki taraf da bitiricilikte acımasızdı.';
    return f===0?'Dengeli bir maçtı; iki taraf da az şey yarattı.':f>0?'Sıkı maçtı, küçük farkı biz yaptık.':'Dengeli maçta küçük bir an kaybettirdi.';},
  /* G1-a: hükmen maç (motor oynamadı; TEST) */
  hukmenKayip:o=>'On bir uygun oyuncu çıkaramadık; maç hükmen kaybedildi.',
  hukmenGalip:o=>'Rakip on bir çıkaramadı; maç hükmen bizim.',
  hukmenCift:o=>'İki takım da on bir çıkaramadı; maç oynanmadı.',
  /* ısrarcı hocanın kötü sonuçta savunması (sayılar ne derse desin) */
  savunma:o=>'Şanssızdık. Planımızın arkasındayım, değiştirmeyeceğim.',
  /* tarz izi: ikinci cümle */
  uyumlu:o=>'Planladığımız gibi oynadık.',
  kisa:o=>o.tarzIzi.tarz==='direkt'?'Uzun topu az kullandık, kendi oyunumuzu oynayamadık.':'Topu fazla ayakta tuttuk; ileriye daha çabuk gitmeliydik.',
  uzun:o=>o.tarzIzi.tarz==='konumsal'||o.tarzIzi.tarz==='iliskisel'?'Topu yerde tutamadık, fazla uzun oynadık.':'Gereğinden çok uzun top attık.',
  /* öne çıkan oyuncu: üçüncü cümle */
  gol:o=>o.skor[0]-o.skor[1]===1?'Farkı yaratan golü '+o.oneCikan.ad+' attı.':o.skor[0]>o.skor[1]?o.oneCikan.ad+' golüyle öne çıktı.':o.skor[0]===o.skor[1]?'Golümüzü '+o.oneCikan.ad+' attı, puanı o getirdi.':'Golümüzü '+o.oneCikan.ad+' attı; yetmedi.',
  goller:o=>o.skor[0]>=o.skor[1]?o.oneCikan.ad+' attığı gollerle maçın adamıydı.':o.oneCikan.ad+' gol attı ama yetmedi.',
  firsat:o=>'En çok pozisyona giren oyuncumuz '+o.oneCikan.ad+' oldu.'
};
const GOZLEM_NOTU_METIN={
  /* başkanın notunun cümlesi: sayıların ne dediği */
  sanssiz:o=>'Pozisyonda biz öndeydik; skor oyunu yansıtmıyor.',
  sansli:o=>'Rakip daha çok pozisyon buldu; skor bizi kurtardı.',
  hakli:o=>'Skor sahadakini yansıtıyor.',
  dengeli:o=>o.skor[0]+o.skor[1]>=4&&o.xg[0]+o.xg[1]<o.skor[0]+o.skor[1]-1.5?'Pozisyon bakımından dengeli; goller pozisyonların çok üstünde.':'Pozisyon bakımından dengeli bir maç.'
};
/* hocanın yorumu (TEST şablon). Isrardan doğan savunma: ısrarı ≥ 0,6 olan hoca kaybettiği ve şanssız sayılmayacağı maçta şansı suçlar */
function macYorumu(k,macId){
  const o=macOkumasi(k,macId);if(!o||!o.hoca)return null;
  if(o.hukmen)return{kisiId:o.hoca.id,metin:YORUM_METIN[o.hukmen==='kayip'?'hukmenKayip':o.hukmen==='galip'?'hukmenGalip':'hukmenCift'](o)};
  const h=k.kisiler[o.hoca.id],israr=h&&h.hoca?h.hoca.israr:0,kayip=o.skor[0]<o.skor[1];
  const L=[(kayip&&o.sans!=='sanssiz'&&israr>=0.6?YORUM_METIN.savunma:YORUM_METIN[o.sans])(o)];
  if(o.tarzIzi.uyum)L.push(YORUM_METIN[o.tarzIzi.uyum](o));
  if(o.oneCikan&&o.oneCikan.neden!=='firsat'||o.oneCikan&&o.ist.sut[0]>=3)L.push(YORUM_METIN[o.oneCikan.neden](o));
  return{kisiId:o.hoca.id,metin:L.join(' ')};
}
/* başkanın notu (TEST şablon): rakip, skor, beklenen gol, şut, sahiplik ve bir cümle */
function macGozlemNotu(k,macId){
  const o=macOkumasi(k,macId);if(!o)return null;
  const ad=(k.kulupler[o.rakipId]||{ad:o.rakipId}).ad,I=o.ist;
  if(o.hukmen)return`${o.hafta}. hafta, ${o.t?'deplasman':'iç saha'} · ${ad}: ${o.skor[0]}–${o.skor[1]} hükmen (oynanmadı).`;
  return`${o.hafta}. hafta, ${o.t?'deplasman':'iç saha'} · ${ad}: ${o.skor[0]}–${o.skor[1]}. Beklenen gol ${okSayi(o.xg[0],2)} – ${okSayi(o.xg[1],2)}; şut ${I.sut[0]}–${I.sut[1]}, `+
    `topa sahip olma %${Math.round(I.sahiplik[0]*100)}. ${GOZLEM_NOTU_METIN[o.sans](o)}`;
}
/* H2-b (2026-10-26): Canlı Skor'un istatistik tablosu, 10 satır [ad, ev, konuk] — oda, balkon ve maç telefonu aynı tabloyu kullanır (eskiden
   macOkumaSatirlari, biz/rakip sırasıyla). ist: motorun sonucKaydi().ist ya da k.maclar[id].ist (ev, konuk); xg: [ev, konuk]. Santradan önce (sahiplik
   toplamı 0) topa sahip olma, pas yokken pas isabeti '—' */
function macIstSatirlari(ist,xg){
  const I=ist||{},c=a=>Array.isArray(a)?[a[0]|0,a[1]|0]:[0,0],y=a=>Math.round(a*100),X=Array.isArray(xg)?xg:[0,0];
  const sh=Array.isArray(I.sahiplik)?I.sahiplik:[0,0],ss=(+sh[0]||0)+(+sh[1]||0),so=ss>0?y((+sh[0]||0)/ss):null;
  const pas=c(I.pas),pt=c(I.pasTamam),pi=x=>pas[x]>0?y(pt[x]/pas[x])+'%':'—';
  return[['Şut',...c(I.sut)],['İsabetli şut',...c(I.isabet)],['Beklenen gol',okSayi(X[0],2),okSayi(X[1],2)],
    ['Topa sahip olma',so==null?'—':so+'%',so==null?'—':(100-so)+'%'],['Pas isabeti',pi(0),pi(1)],['Korner',...c(I.korner)],
    ['Faul',...c(I.faul)],['Sarı kart',...c(I.sari)],['Kırmızı kart',...c(I.kirmizi)],['Ofsayt',...c(I.ofsayt)]];
}
/* H2-c (2026-10-26, kullanıcı isteği 3): hocanın maç akşamı kendiliğinden gelen yorumu (MESAJ_KAYNAKLARI) ve okundu listesi (k.macOkundu) kalktı. Yorumu
   başkan sorunca hoca yazar (js/yazisma.js 'Maçı nasıl gördün?'); macYorumu aynı şablondur. P12'nin kötü gidiş mesajları değişmez */
