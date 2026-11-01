/* ============ Chairman — oyuncu kimliği: köken, ten, göz rengi, yaşla değişen görünüş, boy (RK4-b, 2026-11-01) ============
   Kullanıcı (1 Kasım): “Türkler çok siyahi değildir, hafif esmer olur; Afrika, Güney Amerika kökenliler olabilir, Avrupalılar daha beyaz, Asyalılar
   çekiktir; genç oyuncuların daha çok saçı vardır; yaşlandıkça çökmeler, saç dökülmesi olur, kel olabilirler, sakal bırakabilirler …; oyuncu boyları
   olsun”. Araştırma ve kaynaklar araclar/plan/kasim-notlari-arastirma.md §4 (Türkiye: Fitzpatrick II–IV ağırlıklı, göz %61 kahve, %26 ela/yeşil,
   %13 mavi; Norwood III+ 18–29 yaş %16, 40–49 %53; kırlaşma Avrupa ve Türkiye'de ~35, Afrika ve Asya kökeninde ~10 yıl sonra).
   Görünüş oyuncunun kimliğinden (kimlik, ad, forma), kaydından (sac, sacRenk, biyik, sakal, boy, isteğe bağlı koken) ve yaşından belirlenimli
   türetilir (karma; rastlantı çekilmez; kayda alan yazılmaz, kayıt sürümü değişmez). Kaydın eski ten alanı (STIL.tenler, 0–4) kimliği olan oyuncunun
   görünüşüne RK4-b'den beri girmez: ten köken ağırlığıyla kimlikten gelir (portre ve balkondaki figür aynı); kimliksiz kayıtlar (TEST kadroları,
   ekip) eskisi gibi. Yaşın etkisi kaydın doğum tarihinden ve oyunun tarihinden gelir.
     KIMLIK_KOKEN                → köken tablosu: {ad, ten [7 ağırlık], goz [4 ağırlık], kellik (çarpan), kir (yıl ötelemesi), cekik}
     kimlikKoken(p)              → köken anahtarı (p.koken geçerliyse o, değilse 'tr'; bugün ligin herkesi Türkiye kökenli)
     kimlikTenSec(koken, u)      → ten rampası sırası (0–6) tek düzgün sayıdan (u ∈ [0, 1))
     kimlikTen(p)                → oyuncunun ten rampası (köken ağırlığıyla, karmadan)
     kimlik(p)                   → {koken, ten (rampa), goz (renk sırası), kellik, kir, kirli, cekik} (karma)
     kimlikYas(p, tarih)         → yaş (tam yıl; tarih yoksa oyunun tarihi ya da 2026-07-01)
     yasKatmani(p, tarih)        → {yas, sacCizgisi 0–4, gri 0–0,8, kirliSakal, gozAlti, cizgi, alin} — yaşın yüze etkisi
     boyCm(p) · boyYazi(p)       → boy (cm; 180 × ölçek) ve “1,86 m”
   Sayılar TEST. */
'use strict';
/* ten rampaları 0–6: açık · açık zeytuni · orta zeytuni · koyu zeytuni (bronz) · kahve · koyu kahve · çok koyu (renkleri STIL.tenRampa).
   göz: koyu kahve · kahve · ela-yeşil · mavi-gri (renkleri STIL.gozRenk). kellik: saç dökülmesi yatkınlığının çarpanı; kir: kırlaşmanın başlangıç yılı
   ötelemesi; cekik: göz biçimi */
const KIMLIK_KOKEN={
  tr:{ad:'Türkiye',ten:[22,42,28,7,1,0,0],goz:[25,36,26,13],kellik:1,kir:0},
  balkan:{ad:'Balkanlar',ten:[30,42,22,5,1,0,0],goz:[20,32,24,24],kellik:1,kir:0},
  dogu:{ad:'Doğu Avrupa',ten:[45,38,14,3,0,0,0],goz:[12,24,26,38],kellik:1,kir:0},
  bati:{ad:'Batı ve Kuzey Avrupa',ten:[62,26,8,2,1,1,0],goz:[10,22,24,44],kellik:1.05,kir:0},
  iber:{ad:'İspanya, Portekiz, İtalya',ten:[25,40,27,7,1,0,0],goz:[30,40,20,10],kellik:1,kir:0},
  magrip:{ad:'Kuzey Afrika',ten:[5,15,35,30,12,3,0],goz:[45,40,12,3],kellik:1,kir:2},
  afrika:{ad:'Batı Afrika',ten:[0,0,0,2,13,40,45],goz:[80,20,0,0],kellik:0.9,kir:10},
  brezilya:{ad:'Brezilya',ten:[12,18,20,18,14,11,7],goz:[45,38,12,5],kellik:0.95,kir:4},
  arjantin:{ad:'Arjantin, Uruguay',ten:[28,38,24,8,2,0,0],goz:[35,38,15,12],kellik:1,kir:0},
  asya:{ad:'Doğu Asya',ten:[12,40,38,9,1,0,0],goz:[70,30,0,0],kellik:0.75,kir:10,cekik:true}};
const KIMLIK_TEST={
  /* saç dökülmesi: yatkınlık (0–1, karma) × yaşın çarpanı; eşikler 0,25 / 0,5 / 0,75 / 0,95 → aşama 1–4 (aşama 2 ≈ belirgin açılma: 25 yaşta ~%15,
     35'te ~%35, 40'ta ~%50); 21 yaşından küçükte açılma yok */
  sacYas:[[17,0.45],[25,0.59],[35,0.77],[40,1],[45,1.15]],sacEsik:[0.25,0.5,0.75,0.95],sacGenc:21,
  /* kırlaşma: başlangıç 35 + (yatkınlık − 0,5) × 14 + köken ötelemesi; 15 yılda en çok 0,8 */
  kirBas:35,kirYay:14,kirSure:15,kirEnCok:0.8,
  /* kirli sakal: 20 yaşından büyüklerin %35'i; göz altı 29+, burun–ağız çizgisi 33+, alın 36+ */
  kirliPay:0.35,kirliYas:20,gozAlti:29,cizgi:33,alin:36,
  /* boy: ölçek × 180 cm */
  boyTaban:180};
const kmlKarma=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
const kmlCekim=(h,i)=>{let x=(h^Math.imul(i+1,0x9e3779b9))>>>0;x^=x>>>16;x=Math.imul(x,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return(x>>>0)/4294967296;};
const kmlAgirlik=(W,u)=>{const t=W.reduce((a,b)=>a+b,0);let x=u*t;for(let i=0;i<W.length;i++){x-=W[i];if(x<0)return i;}return W.length-1;};
const kimlikKoken=p=>p&&KIMLIK_KOKEN[p.koken]?p.koken:'tr';
const kimlikTenSec=(koken,u)=>kmlAgirlik((KIMLIK_KOKEN[koken]||KIMLIK_KOKEN.tr).ten,Math.min(0.999999,Math.max(0,+u||0)));
const kmlTohum=p=>kmlKarma(String(p&&p.id||'')+'|'+String(p&&p.ad||'')+'|'+String(p&&p.no||0)+'|kimlik');
const kimlikTen=p=>kimlikTenSec(kimlikKoken(p),kmlCekim(kmlTohum(p),1));
function kimlik(p){
  const koken=kimlikKoken(p),K=KIMLIK_KOKEN[koken],h=kmlTohum(p),u=i=>kmlCekim(h,i);
  return{koken,ten:kmlAgirlik(K.ten,u(1)),goz:kmlAgirlik(K.goz,u(2)),kellik:u(3),kir:u(4),kirli:u(5)<KIMLIK_TEST.kirliPay,cekik:!!K.cekik};
}
function kimlikYas(p,tarih){
  const t=tarih||(typeof OYUN!=='undefined'&&OYUN&&OYUN.kariyer&&OYUN.kariyer.tarih)||'2026-07-01',d=String(p&&p.dogumTarihi||'2000-01-01');
  const [y,a,g]=t.split('-').map(Number),[dy,da,dg]=d.split('-').map(Number);
  return Math.max(15,Math.min(60,y-dy-((a<da||(a===da&&g<dg))?1:0)));
}
function yasKatmani(p,tarih){
  const T=KIMLIK_TEST,K=KIMLIK_KOKEN[kimlikKoken(p)],I=kimlik(p),yas=kimlikYas(p,tarih);
  let f=T.sacYas[T.sacYas.length-1][1];
  for(let i=1;i<T.sacYas.length;i++){const [a0,f0]=T.sacYas[i-1],[a1,f1]=T.sacYas[i];if(yas<=a1){f=yas<=a0?f0:f0+(f1-f0)*(yas-a0)/(a1-a0);break;}}
  const s=yas<T.sacGenc?0:Math.min(0.999,I.kellik*f*K.kellik);
  const sacCizgisi=T.sacEsik.filter(e=>s>=e).length;
  const kirBas=T.kirBas+(I.kir-0.5)*T.kirYay+K.kir,gri=Math.max(0,Math.min(T.kirEnCok,(yas-kirBas)/T.kirSure*T.kirEnCok));
  return{yas,sacCizgisi,gri:+gri.toFixed(3),kirliSakal:I.kirli&&yas>=T.kirliYas,gozAlti:yas>=T.gozAlti,cizgi:yas>=T.cizgi,alin:yas>=T.alin};
}
const boyCm=p=>Math.round(KIMLIK_TEST.boyTaban*(+(p&&p.boy)||1));
const boyYazi=p=>{const c=boyCm(p);return Math.floor(c/100)+','+String(c%100).padStart(2,'0')+' m';};
