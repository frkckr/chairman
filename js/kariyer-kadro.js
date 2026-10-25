/* ============ Chairman — kariyerdeki kadrolar: oyuncu kayıtları, kulüp kadrosu, TEST kadro üretimi (çizim yok; F1, 2026-10-23) ============
   F1 (YOL_HARITASI karar 36, Claude'un kararı): kadro kariyere geçti. js/kadrolar.js (KADROLAR) yalnız tohum kadrosudur: kariyerBaslat
   Demirkapı ve Akdeniz'i oradan kopyalar, ligin öbür kulüplerine TEST kadro üretir. Maç girdisi kadroyu kariyerden okur (F1-b, js/mac-girdi.js).
   Oyuncu (k.oyuncular['oyuncu-N']): {id, kulupId, ad, no, mevki, dogumTarihi, ayak, oz, gol, sari, ceza, sakat, görünüş…}
     mevki: KL | DEF | OS | FV (oyuncunun asıl yeri). oz: js/kadrolar.js'teki sırayla 11 özellik (1–99); oyuncuya gösterilmez (TEST bilgisi hariç).
     gol, sari: bu sezonun sayaçları (devralınan haftalar dahil). ceza: null | {mac, neden} (oynanmayacak maç sayısı). sakat: null | {neden, donus,
     belirsiz?} (donus: kadroya döneceği gün). Görünüş alanları kadrolar.js'teki gibidir: ten, sac, sacRenk, boy, yapi, krampon değerli;
     biyik, sakal, sirik, kaptan yalnız true iken yazılır. kulupId null serbest oyuncudur (bugün yok; transfer Aşama 4).
   Kulüp kadrosu (k.kulupler[id].kadro): {ad, forma, kaleciForma, taktik, td, ilk11, yedekler}
     ad: maçta ve telefonda görünen kısa ad (Demirkapı). ilk11: hocanın bugünkü tercihi, 11 oyuncu kimliği, sıra motordaki dizilişle aynı
     (0 kaleci). yedekler: kalan bütün oyuncular tercih sırasıyla; ilk11 + yedekler kulübün bütün oyuncularıdır (doğrulanır).
     taktik ve td kadrolar.js'teki gibidir; üretilen kulüplerde taktik yalnız dizilişi taşır (hocanın tarzı F3'te gelir).
   TEST üretimi (kullanıcı kararı 2026-10-23, karar 33): adlar js/adlar-test.js'ten; özellikler KADROLAR'daki iki takımın aynı yuvasının
     ortalaması + kulübün gücü (devralınan puan tablosundan) + oyuncuya göre sapma; görünüş, yaş, ayak ve bu sezonun gol ve sarı sayaçları da
     üretilir (gol sayısı takımın devralınan attığı gole eşittir). Rastlantı dünya tohumundan ve kulüp kimliğinden türetilir: aynı tohum aynı
     kadroları kurar, kariyerin kayıtlı rastlantısı (k.rastlanti) çekilmez. Forma bugün bütün üretilen kulüplerde 'deplasman'dır (renkler
     kullanıcıdan gelene dek TEST). Demirkapı ve Akdeniz'in eksikleri (sakat, cezalı) oyuncu kaydına dönüşür; özellikleri ve görünüşleri üretilir.
   G1-b (2026-10-24, kullanıcı kararı 43: kadro yeterliliği; TEST): her kulübün kadrosu KADRO_HEDEF (22) oyuncuya genç yedeklerle tamamlanır
     (kadroTamamla): GENC_MEVKI sırasıyla, 18–21 yaş, kulübün gücünden GENC_ZAYIF eksik, numara GENC_NO_BAS'tan ilk boş. Rastlantı ayrı akıştandır
     (dünya tohumu + '<kulüp>:genc:<ek>'): tohum kadrosu ve üretilen 18 oyuncu aynı kalır, gençlerin kimlikleri bütün kulüplerin ardından gelir.
     Sonradan (G2: satış, ayrılış) kadro yine 22'ye tamamlanır; ek farklı olduğu için yeni gençler başka adlarla gelir.
   Kurulum: kadrolariKur(k, lig) (js/baslangic.js). Doğrulama: kadroDogrula (EK_DENETIMLER).
   k.oyuncular paylaşılan alandır (js/kariyer.js PAYLASILAN_ALANLAR): komutlar arasında dondurulur, değiştiren yeni nesne kurar. Dosya katı
   kiptedir: dondurulmuş kayda yerinde yazmak hata verir. */
'use strict';
const OYUNCU_MEVKILERI=['KL','DEF','OS','FV'];
const OYUNCU_AYAKLAR=['sag','sol','iki'];
const OYUNCU_GORUNUS=['ten','sac','sacRenk','boy','yapi','krampon'];   // değerli görünüş alanları (kadrolar.js biçimi)
const OYUNCU_BAYRAK=['biyik','sakal','sirik','kaptan'];                // yalnız true iken yazılır
const KADRO_YUVA_NO=[1,2,4,5,3,7,6,8,11,9,10];                          // 4-4-2 yuvalarının forma numaraları (kadrolar.js'teki düzen)
const KADRO_SOL_YUVA=[4,8];                                             // sol bek ve sol kanat: çoğunlukla sol ayaklı
const KADRO_STOPER_YUVA=[2,3];                                          // stoperler uzun boylu
const KADRO_YEDEK=[['KL',12],['DEF',14],['DEF',15],['OS',16],['OS',17],['FV',18],['FV',19]];
const KADRO_HEDEF=22;                                                   // G1-b: kulübün oyuncu sayısı (genç yedeklerle tamamlanır; TEST)
const GENC_MEVKI=['DEF','OS','FV','OS'];                                // tamamlamada mevki sırası (döngüsel)
const GENC_ZAYIF=12;                                                    // gençlerin kulüp gücüne göre eksiği (özellik puanı; TEST)
const GENC_YAS=[18,21];                                                 // gençlerin yaşı (2026 sezonu)
const GENC_NO_BAS=20;                                                   // gençlere verilen ilk forma numarası (boş olan)
/* TEST üretim dağılımları (yalnız veri; kadrolar.js'teki değerlerin aralığında) */
const KADRO_SAC=[['kisa',45],['kivircik',18],['mullet',14],['uzun',12],['kel',11]];
const KADRO_SAC_RENK=[['#141212',30],['#241a12',28],['#3c2616',20],['#5a4028',10],['#8a6a3a',5],['#a0522d',4],['#c8a060',3]];
const KADRO_HOCA_SAC=[['kel',30],['kisa',50],['kivircik',10],['uzun',10]];
const KADRO_HOCA_SAC_RENK=[['#8a8680',30],['#cfcac0',20],['#3c2616',20],['#241a12',15],['#141212',15]];
/* bu sezonun devralınan haftalarındaki gol payı (yuva ya da yedeğin mevkisi) ve maç başına sarı kart beklentisi */
const KADRO_GOL_YUVA=[0,0.5,0.7,0.7,0.5,2.2,1.4,1.4,2.2,5,5];
const KADRO_GOL_YEDEK={KL:0,DEF:0.2,OS:0.6,FV:1.6};
const KADRO_SARI={KL:0.015,DEF:0.12,OS:0.1,FV:0.06};

/* H1 (F1 borcu, 2026-10-25): motorun dizilişlerinde yuvaların mevkisi motorun yuva sırasıyla (js/mac-dizilis.js DIZILISLER[d].mevkiler[i].cizgi,
   js/hoca.js HOCA_YUVALAR ve HOCA_ROL[rol].cizgi ile aynı; araclar/sezon-deneme.js başında denetlenir). Aritmetik kural 4-2-3-1'de forveti (dizin 9)
   orta saha, 10 numarayı (OOS, dizin 10) forvet sayıyordu; 4-4-2 ve 4-3-3'te (üç forvet dizin 8–10) kuralla aynıdır. Bugün bütün kadrolar 4-4-2 */
const DIZILIS_YUVA_MEVKI=Object.freeze({
  '4-4-2':  ['KL','DEF','DEF','DEF','DEF','OS','OS','OS','OS','FV','FV'],
  '4-2-3-1':['KL','DEF','DEF','DEF','DEF','OS','OS','OS','OS','FV','OS'],
  '4-3-3':  ['KL','DEF','DEF','DEF','DEF','OS','OS','OS','FV','FV','FV']
});
/* dizilişin 11 yuvasının mevkisi, yuva sırasıyla. Tablodaki dizilişte tablodan (kopya); tabloda olmayan geçerli dizilişte aritmetik kural: '4-4-2' → KL,
   4 DEF, 4 OS, 2 FV (ilk sayı defans, son sayı forvet, aradakiler orta saha). Geçersizse null */
function dizilisMevkileri(dizilis){
  const S=String(dizilis||'').split('-').map(Number);
  if(S.length<2||S.some(n=>!Number.isInteger(n)||n<1)||S.reduce((a,b)=>a+b,0)!==10)return null;
  const T=DIZILIS_YUVA_MEVKI[String(dizilis)];if(T)return T.slice();
  const os=S.slice(1,-1).reduce((a,b)=>a+b,0);
  return['KL',...Array(S[0]).fill('DEF'),...Array(os).fill('OS'),...Array(S[S.length-1]).fill('FV')];
}
/* kulübün kısa adı: adın ilk sözcüğünün ilk üç harfi, büyük harfle (Yıldıztepe SK → YIL) */
const kulupKisaAd=ad=>String(ad).split(' ')[0].toLocaleUpperCase('tr-TR').slice(0,3);
/* kadrodaki oyuncular tercih sırasıyla (ilk 11, sonra yedekler) */
function kulupOyunculari(k,kulupId){const D=(k.kulupler[kulupId]||{}).kadro;return D?D.ilk11.concat(D.yedekler).map(id=>k.oyuncular[id]):[];}

/* tohumlu rastlantı: dünya tohumu + ek (kulüp kimliği, amaç) → mulberry32 (js/ortak.js); özet js/kayit.js'teki FNV-1a */
const kadroRastgele=(tohum,ek)=>tohumluRastgele(parseInt(saglamaHesapla(`${tohum>>>0}:${ek}`),16));
function agirlikliSec(r,L){let t=r()*L.reduce((s,x)=>s+x[1],0);for(const [d,a] of L){t-=a;if(t<0)return d;}return L[L.length-1][0];}
function karistirR(r,a){for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
/* KADROLAR'daki 4-4-2 takımlarının yuva ve mevki ortalamaları (özellik başına) */
function kadroSablonu(){
  const T=Object.values(KADROLAR).filter(kd=>(kd.taktik||{}).dizilis==='4-4-2');
  if(!T.length)throw new Error('Kadro şablonu: KADROLAR\'da 4-4-2 takım yok');
  const ort=L=>L[0].map((_,j)=>L.reduce((s,o)=>s+o[j],0)/L.length),M=dizilisMevkileri('4-4-2'),mevki={};
  const yuva=M.map((_,i)=>ort(T.map(kd=>kd.oyuncular[i].oz)));
  for(const m of OYUNCU_MEVKILERI)mevki[m]=ort(T.flatMap(kd=>kd.oyuncular.filter((o,i)=>M[i]===m).map(o=>o.oz)));
  return{yuva,mevki};
}
/* doğum tarihi (TEST): kaleci 21–34, öbürleri 19–32 yaşında (2026 sezonu); aralik [en az, en çok] verilirse o yaşlarda (G1-b gençler) */
function yasUret(r,mevki,aralik){
  const yas=aralik?aralik[0]+Math.floor(r()*(aralik[1]-aralik[0]+1)):(mevki==='KL'?21:19)+Math.floor(r()*14),ay=1+Math.floor(r()*12),gun=1+Math.floor(r()*28),iki=n=>String(n).padStart(2,'0');
  return`${2026-yas}-${iki(ay)}-${iki(gun)}`;
}
/* üretilen oyuncu kaydı (kimliksiz). o: {mevki, sablon (11 özellik), guc, yedek, sol, uzun, ad, no, yas?: [en az, en çok]} */
function oyuncuUret(r,o){
  const kl=o.mevki==='KL';
  const oz=o.sablon.map((v,j)=>j===8&&!kl?5:Math.round(clamp(v+o.guc+(r()+r()-1)*14-(o.yedek?3:0),j===8?40:10,95)));
  const p={ad:o.ad,no:o.no,mevki:o.mevki,dogumTarihi:yasUret(r,o.mevki,o.yas),ayak:'sag',oz,gol:0,sari:0,ceza:null,sakat:null,
    ten:Math.floor(r()*5),sac:agirlikliSec(r,KADRO_SAC),sacRenk:agirlikliSec(r,KADRO_SAC_RENK),
    boy:+((kl||o.uzun)?1+r()*0.09:0.92+r()*0.14).toFixed(2),yapi:+(0.94+r()*0.16).toFixed(2)};
  const a=r();p.ayak=o.sol?(a<0.85?'sol':'sag'):a<0.12?'sol':a<0.15?'iki':'sag';
  if(r()<0.3)p.biyik=true;if(r()<0.1)p.sakal=true;if(r()<0.12)p.sirik=true;if(r()<0.08)p.krampon='#f2f2f2';
  return p;
}
/* kadrolar.js biçimindeki oyuncudan kariyer kaydı (kimliksiz) */
function oyuncuKaydi(x,mevki,dogumTarihi){
  const p={ad:x.ad,no:x.no,mevki,dogumTarihi,ayak:x.ayak||'sag',oz:x.oz.slice(),gol:x.gol||0,sari:x.sari||0,ceza:null,sakat:null};
  for(const a of OYUNCU_GORUNUS)if(x[a]!==undefined)p[a]=x[a];
  for(const a of OYUNCU_BAYRAK)if(x[a])p[a]=true;
  return p;
}
/* kadrolar.js'teki eksik (durum, neden, donus metni) → ceza ya da sakatlık kaydı. "2 hafta" = 14 gün sonra döner; "Belirsiz" 28 gün (TEST) */
function eksikDurumu(e,tarih){
  const m=/^(\d+)\s*(hafta|gün|maç)$/i.exec(String(e.donus||'').trim()),n=m?Number(m[1]):0,birim=m?m[2].toLocaleLowerCase('tr-TR'):'';
  if(e.durum==='cezali')return{ceza:{mac:birim==='maç'&&n>0?n:1,neden:String(e.neden||'')}};
  const gun=birim==='hafta'?n*7:birim==='gün'?n:28;
  return{sakat:Object.assign({neden:String(e.neden||''),donus:tarihEkle(tarih,gun)},m&&birim!=='maç'?{}:{belirsiz:true})};
}
/* yeni oyuncu kimliği ve kaydı; kimliği döndürür */
function oyuncuEkle(k,kulupId,p){const id=kimlikUret(k,'oyuncu');k.oyuncular[id]=Object.assign({id,kulupId},p);return id;}
/* devralınan haftaların gol ve sarı sayaçları (TEST): takımın attığı goller yuva payına göre dağıtılır, sarılar maç başına beklentiyle (en çok 3) */
function sezonSayaclari(r,kayitlar,golSayisi,oynanan){
  const pay=kayitlar.map((p,i)=>i<11?KADRO_GOL_YUVA[i]:KADRO_GOL_YEDEK[p.mevki]),top=pay.reduce((a,b)=>a+b,0);
  for(let g=0;g<golSayisi&&top>0;g++){let t=r()*top;for(let i=0;i<pay.length;i++){t-=pay[i];if(t<0){kayitlar[i].gol++;break;}}}
  kayitlar.forEach((p,i)=>{const o=KADRO_SARI[p.mevki]*(i<11?1:0.35);let s=0;for(let n=0;n<oynanan;n++)if(r()<o)s++;p.sari=Math.min(3,s);});
}
/* ligin bir kulübüne TEST kadro üretir; kulüp kadrosunu döndürür. o: {tohum, guc, golSayisi, oynanan} */
function kadroUret(k,kulupId,o){
  const r=kadroRastgele(o.tohum,kulupId+':kadro'),S=kadroSablonu(),M=dizilisMevkileri('4-4-2');
  const adlar=karistirR(r,ADLAR_TEST.slice());let n=0;const adAl=()=>adlar[n++%adlar.length];
  const kayitlar=M.map((m,i)=>oyuncuUret(r,{mevki:m,sablon:S.yuva[i],guc:o.guc,ad:adAl(),no:KADRO_YUVA_NO[i],sol:KADRO_SOL_YUVA.includes(i),uzun:KADRO_STOPER_YUVA.includes(i)}))
    .concat(KADRO_YEDEK.map(([m,no])=>oyuncuUret(r,{mevki:m,sablon:S.mevki[m],guc:o.guc,yedek:true,ad:adAl(),no})));
  sezonSayaclari(r,kayitlar,o.golSayisi,o.oynanan);
  const kaptan=kayitlar.slice(1,11).reduce((a,b)=>b.dogumTarihi<a.dogumTarihi?b:a);kaptan.kaptan=true;
  const td={ad:adAl()+' Hoca',ten:Math.floor(r()*5),sac:agirlikliSec(r,KADRO_HOCA_SAC),sacRenk:agirlikliSec(r,KADRO_HOCA_SAC_RENK),
    boy:+(0.95+r()*0.1).toFixed(2),yapi:+(1+r()*0.12).toFixed(2)};
  if(r()<0.5)td.biyik=true;
  const ids=kayitlar.map(p=>oyuncuEkle(k,kulupId,p));
  return{ad:k.kulupler[kulupId].ad.split(' ')[0],forma:'deplasman',kaleciForma:'deplasmanKaleci',taktik:{dizilis:'4-4-2'},td,ilk11:ids.slice(0,11),yedekler:ids.slice(11)};
}
/* kadrolar.js'teki tohum kadrosunu kariyere kopyalar (ad, numara, özellik ve görünüş aynen; doğum tarihi TEST); eksikler oyuncu olur */
function kadroKopyala(k,kulupId,KD,o){
  const r=kadroRastgele(o.tohum,kulupId+':kopya'),M=dizilisMevkileri(KD.taktik.dizilis),S=kadroSablonu();
  if(!M)throw new Error(`Kadro ${kulupId}: diziliş geçersiz (${KD.taktik.dizilis})`);
  const ilk11=KD.oyuncular.map((x,i)=>oyuncuEkle(k,kulupId,oyuncuKaydi(x,M[i],yasUret(r,M[i]))));
  const yedekler=(KD.yedekler||[]).map(x=>oyuncuEkle(k,kulupId,oyuncuKaydi(x,x.mevki,yasUret(r,x.mevki))));
  for(const e of KD.eksikler||[]){
    const p=oyuncuUret(r,{mevki:e.mevki,sablon:S.mevki[e.mevki],guc:o.guc,ad:e.ad,no:e.no});
    yedekler.push(oyuncuEkle(k,kulupId,Object.assign(p,eksikDurumu(e,o.tarih))));
  }
  return{ad:KD.ad,forma:KD.forma,kaleciForma:KD.kaleciForma,taktik:Object.assign({},KD.taktik),td:Object.assign({},KD.td),ilk11,yedekler};
}
/* kulübün gücü: devralınan puan tablosundan, lig ortalamasına göre (özellik puanı; js/lig.js tarifi) */
function kulupGucu(lig,kulupId){
  const P=lig.takimlar.map(t=>3*t.G+t.B),ort=P.reduce((a,b)=>a+b,0)/P.length,t=lig.takimlar.find(x=>x.id===kulupId)||{G:0,B:0};
  return(3*t.G+t.B-ort)*0.3;
}
/* bütün kulüplerin kadrosu: başkanın kulübü önce (kimlikler oyuncu-1'den başlar), sonra kulüp sırasıyla. Kulübün gücü devralınan puandan.
   G1-b: bütün kulüpler kurulduktan sonra aynı sırayla genç yedeklerle KADRO_HEDEF'e tamamlanır (önceki oyuncuların kimlikleri değişmez) */
function kadrolariKur(k,lig){
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,sira=[biz,...Object.keys(k.kulupler).filter(x=>x!==biz)].filter(id=>k.kulupler[id]);
  for(const id of sira){
    const t=lig.takimlar.find(x=>x.id===id)||{G:0,B:0,M:0,A:0};
    const o={tohum:k.dunyaTohumu,guc:kulupGucu(lig,id),golSayisi:t.A,oynanan:t.G+t.B+t.M,tarih:k.tarih};
    k.kulupler[id].kadro=KADROLAR[id]?kadroKopyala(k,id,KADROLAR[id],o):kadroUret(k,id,o);
  }
  for(const id of sira)kadroTamamla(k,id,KADRO_HEDEF,'baslangic',kulupGucu(lig,id));
}
/* kulübün ilk boş forma numarası (bas'tan yukarı, sonra aşağı; 1–99) */
function bosNumara(k,kulupId,bas){
  const N=new Set(kulupOyunculari(k,kulupId).map(p=>p.no));
  for(let n=bas;n<=99;n++)if(!N.has(n))return n;
  for(let n=bas-1;n>=1;n--)if(!N.has(n))return n;
  throw new Error(`Kadro ${kulupId}: boş forma numarası yok`);
}
/* G1-b: kulübün kadrosunu hedef sayıya genç yedeklerle tamamlar (komut içinde; k.oyuncular kopyalanır). ek: rastlantı akışının adı (aynı kulüpte
   her tamamlamada farklı olmalı). guc verilmezse js/lig.js tarifinden. Eklenen kimlikleri döndürür */
function kadroTamamla(k,kulupId,hedef,ek,guc){
  const c=k.kulupler[kulupId],D=c&&c.kadro;
  if(!D)throw new Error(`Kadro ${kulupId}: kadrosu yok`);
  const eksik=hedef-kulupOyunculari(k,kulupId).length;if(eksik<=0)return[];
  return gencEkle(k,kulupId,Array.from({length:eksik},(_,i)=>GENC_MEVKI[i%GENC_MEVKI.length]),'genc:'+ek,guc);
}
/* genç yedekleri üretip kulübün yedeklerine ekler (kadroTamamla, kaleciGuvence); rastlantı akışı <kulüp>:<akis>. Eklenen kimlikleri döndürür */
function gencEkle(k,kulupId,mevkiler,akis,guc){
  const D=k.kulupler[kulupId].kadro;
  const r=kadroRastgele(k.dunyaTohumu,kulupId+':'+akis),S=kadroSablonu(),g=(guc===undefined?kulupGucu(LIG,kulupId):guc)-GENC_ZAYIF;
  const kullanilan=new Set(kulupOyunculari(k,kulupId).map(p=>p.ad)),adlar=karistirR(r,ADLAR_TEST.slice()).filter(a=>!kullanilan.has(a));
  k.oyuncular=Object.assign({},k.oyuncular);
  const L=[];
  mevkiler.forEach((m,i)=>{
    const p=oyuncuUret(r,{mevki:m,sablon:S.mevki[m],guc:g,yedek:true,yas:GENC_YAS,ad:adlar[i%adlar.length],no:bosNumara(k,kulupId,GENC_NO_BAS)});
    const id=oyuncuEkle(k,kulupId,p);L.push(id);D.yedekler=D.yedekler.concat([id]);   /* numara sırası: eklenen bir sonrakinin boş numarasını görür */
  });
  return L;
}
/* G2 incelemesi (2026-10-24): kadroda en az KADRO_KALECI kaleci kalır. Bir kaleci kadrodan çıkmadan önce çağrılır (js/transfer.js oyuncuTransfer):
   kalan kaleci sayısı yetmezse genç kaleci yedeklere eklenir (kadro bir süre 22'yi aşabilir). Yoksa iki kalecinin sözleşmesi birlikte bitince
   ikincisinin ayrılışında ilk 11'in kaleci yuvası boş kalırdı */
const KADRO_KALECI=2;
function kaleciGuvence(k,kulupId,cikanId){
  const n=kulupOyunculari(k,kulupId).filter(p=>p.mevki==='KL'&&p.id!==cikanId).length;
  return n>=KADRO_KALECI?[]:gencEkle(k,kulupId,Array(KADRO_KALECI-n).fill('KL'),'gencKL:'+cikanId+':'+k.tarih);
}

/* oyuncu ve kadro alanlarının doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır). Kaydın kendi alanlarını geçen dondurulmuş oyuncu
   (js/kariyer.js DONMUS) bir daha denetlenmez: değişemez. Kariyerin öbür alanlarına bağlı denetimler (kimlik sayacı, doğum tarihi < bugün, kulüp
   ve kadro bağları) her seferinde yapılır: bellekteki doğrulama yüklemedeki tam doğrulamayla aynı kararı verir (kayıt kısayolu buna dayanır) */
const OYUNCU_DENETLENDI=new WeakSet();
function kadroDogrula(k,h){
  const O=k.oyuncular,K=k.kulupler||{},tam=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b,duz=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
  if(!duz(O)){h.push('Oyuncu listesi (oyuncular) yok');return;}
  if(!tam((k.sonrakiNo||{}).oyuncu,1,1e9))h.push('sonrakiNo.oyuncu geçersiz');
  for(const [anahtar,p] of Object.entries(O)){
    const ad=`Oyuncu ${anahtar}`;
    if(!p||p.id!==anahtar){h.push(`${ad}: kimliği anahtarıyla aynı değil (${p&&p.id})`);continue;}
    if(p.kulupId!==null&&!K[p.kulupId])h.push(`${ad}: kulübü bulunamadı (${p.kulupId})`);
    kimlikDenetle(k,h,ad,anahtar,'oyuncu');
    if(typeof p.dogumTarihi==='string'&&tarihGecerliMi(k.tarih)&&tarihKarsilastir(p.dogumTarihi,k.tarih)>=0)h.push(`${ad}: doğum tarihi bugünden önce değil`);
    if(OYUNCU_DENETLENDI.has(p))continue;
    const once=h.length;
    if(typeof p.ad!=='string'||!p.ad)h.push(`${ad}: adı yok`);
    if(!tam(p.no,1,99))h.push(`${ad}: forma numarası 1–99 değil (${p.no})`);
    if(!OYUNCU_MEVKILERI.includes(p.mevki))h.push(`${ad}: bilinmeyen mevki (${p.mevki})`);
    if(!OYUNCU_AYAKLAR.includes(p.ayak))h.push(`${ad}: bilinmeyen ayak (${p.ayak})`);
    if(!Array.isArray(p.oz)||p.oz.length!==11||!p.oz.every(x=>tam(x,1,99)))h.push(`${ad}: özellikler 11 tane 1–99 tamsayı değil`);
    if(!tam(p.gol,0,999)||!tam(p.sari,0,99))h.push(`${ad}: gol ya da sarı kart sayacı geçersiz`);
    if(!tarihGecerliMi(p.dogumTarihi))h.push(`${ad}: geçersiz doğum tarihi (${p.dogumTarihi})`);
    if(p.ceza!==null&&!(duz(p.ceza)&&tam(p.ceza.mac,1,99)&&typeof p.ceza.neden==='string'))h.push(`${ad}: ceza kaydı geçersiz`);
    if(p.sakat!==null&&!(duz(p.sakat)&&typeof p.sakat.neden==='string'&&tarihGecerliMi(p.sakat.donus)&&(p.sakat.belirsiz===undefined||p.sakat.belirsiz===true)))
      h.push(`${ad}: sakatlık kaydı geçersiz`);
    if(h.length===once&&DONMUS.has(p))OYUNCU_DENETLENDI.add(p);
  }
  const kisalar=new Map(),uyeler={};
  for(const p of Object.values(O))if(p&&K[p.kulupId])(uyeler[p.kulupId]=uyeler[p.kulupId]||[]).push(p);
  for(const [id,c] of Object.entries(K)){
    if(!c)continue;
    if(c.kisa!==undefined){
      if(typeof c.kisa!=='string'||c.kisa.length<2||c.kisa.length>4)h.push(`Kulüp ${id}: kısa ad 2–4 harf olmalı (${c.kisa})`);
      else if(kisalar.has(c.kisa))h.push(`Kulüp ${id}: kısa ad ${c.kisa} ${kisalar.get(c.kisa)} ile aynı`);
      else kisalar.set(c.kisa,id);
    }
    if(c.kadro===undefined)continue;
    const D=c.kadro,ad=`Kulüp ${id} kadrosu`;
    if(!duz(D)){h.push(`${ad}: nesne değil`);continue;}
    if(typeof D.ad!=='string'||!D.ad)h.push(`${ad}: kısa adı yok`);
    if(typeof D.forma!=='string'||typeof D.kaleciForma!=='string')h.push(`${ad}: forma adı yok`);
    if(!duz(D.taktik)||!dizilisMevkileri(D.taktik.dizilis))h.push(`${ad}: diziliş geçersiz`);
    if(!duz(D.td)||typeof D.td.ad!=='string'||!D.td.ad)h.push(`${ad}: teknik direktör adı yok`);
    if(!Array.isArray(D.ilk11)||D.ilk11.length!==11||!Array.isArray(D.yedekler)){h.push(`${ad}: ilk 11 on bir kimlik, yedekler liste olmalı`);continue;}
    const hepsi=D.ilk11.concat(D.yedekler),kume=new Set(hepsi),nolar=new Map();
    if(kume.size!==hepsi.length)h.push(`${ad}: aynı oyuncu iki kez`);
    for(const x of hepsi){
      const p=O[x];
      if(!p){h.push(`${ad}: oyuncu bulunamadı (${x})`);continue;}
      if(p.kulupId!==id)h.push(`${ad}: ${p.ad} (${x}) bu kulübün oyuncusu değil`);
      if(nolar.has(p.no))h.push(`${ad}: ${p.no} numarası iki oyuncuda (${nolar.get(p.no)}, ${p.ad})`);else nolar.set(p.no,p.ad);
    }
    for(const p of uyeler[id]||[])if(!kume.has(p.id))h.push(`${ad}: ${p.ad} (${p.id}) kulübün oyuncusu fakat kadroda yok`);
    const kl=O[D.ilk11[0]];if(kl&&kl.mevki!=='KL')h.push(`${ad}: ilk 11'in ilk yuvası kaleci değil (${kl.ad})`);
  }
}
EK_DENETIMLER.push(kadroDogrula);
