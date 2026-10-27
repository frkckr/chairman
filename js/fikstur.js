/* ============ Chairman — sezon ve fikstür: lig TEST tarifi, maç kimliği ve maç günü (çizim yok; F1, 2026-10-23) ============
   Aşama 3.1 (YOL_HARITASI karar 36, Claude'un kararı; TEST tarifi — kesin lig biçimi Aşama 5 öncesi kullanıcıyla kararlaştırılır):
     16 takım, çift devreli 30 hafta, her hafta Cumartesi 19:00, ara yok. Oyun 13. haftada başlar; 1–12. haftalar devralınan geçmiştir
     (js/lig.js'teki puan tablosu ve son maçlar). Kış transfer dönemi 4–31 Ocak yalnız takvim işaretidir (iki hatırlatma işi).
   k.sezon: {id, kod, ad, grup, sezonAdi, etiket:'TEST', ilkHafta, haftaSayisi, ilkMacTarihi, dakika, bolgeler, takimlar,
             devralinan:{tablo:{kulüp:{G,B,M,A,Y}}, sonMaclar:{kulüp:[{hafta, rakip, yer:'i'|'d', a, y}]}}, transfer:[{ad, bas, bitis}]}
     ilkMacTarihi: ilkHafta'nın maç günü; hafta h'nin tarihi bundan (h − ilkHafta) × 7 gün sonradır. dakika: başlama saati (1140 = 19:00).
   k.fikstur: [{id, hafta, tarih, dakika, ev, konuk}] bütün haftalar. ilkHafta'dan öncekiler devralınan geçmiştir: sonuçları yalnız
     devralınan tabloda ve son maç listelerindedir. Maç kimliği 'mac-<kod>-<hafta>-<ev>-<konuk>' (mac-2627-13-demirkapi-akdeniz); kalıcıdır.
   k.maclar: {maçKimliği: {skor:[ev, konuk], …}} oynanan maçlar; sonucu F2 (macSonucuUygula) bir kez yazar. Puan durumu ve son maçlar
     saklanmaz, devralınan geçmiş ile oynanan maçlardan türetilir (sezonTablosu, sonBesMac).
   Fikstür dünya tohumundan daire yöntemiyle kurulur (fiksturUret): başkanın kulübü sabit noktadadır; öbür takımların daire üstündeki yeri
     devralınan son maçları ve ilk haftanın maçını tutacak biçimde aranır, haftaların sırası sabit takımın rakiplerinden çıkar. İlk devrenin
     ev/deplasmanı sabit maçlar korunarak art arda iç saha ya da dış saha dizilerini kısaltacak biçimde düzeltilir; ikinci devre ilk devrenin
     yer değiştirmiş aynasıdır. Aynı tohum aynı fikstürü verir; kariyerin kayıtlı rastlantısı çekilmez.
   Maç tohumu macTohumu(dünya tohumu, maç kimliği): aynı kariyerde aynı maç hep aynı oynanır (F1-b; sayfa maç sırasında kapanırsa maç
     aynı tohumla yeniden oynanır). Maç günü işi macGunuIsiKur ile kurulur (ajanda 'macGunu' eylemi, veri.macId).
   G1-d (2026-10-24, kullanıcı kararı 43: sezon geçişi yok, yalnız sezon sonu kaydı): oynanacak haftaların bütün maçları yazılınca (başkanın son maçının
     sonuç komutunda, js/mac-sonuc.js) sezonSonuYaz bir kez k.sezon.sonuc = {tarih, tablo:[{id,O,G,B,M,A,Y,P}], sampiyon, bizimSira, bizimPuan} yazar
     (kopyala-yaz), geçmişe {tur:'sezonSonu', sezonId, sira, puan, sampiyon, tarih, dakika}, ertesi gün 10:00 hatırlatma koyar ve SEZON_SONU_EKLERI'ni
     çağırır (G2: sözleşme bitişleri). Sonra İlerle "Sezon tamamlandı; yeni sezon bu sürümde yok (TEST)" der (js/ajanda.js ILERLE_ENGEL_EKLERI).
     Yeni sezon, takvim ve sayaçların sıfırlanması sonraki turda (5.1).
   Doğrulama: fiksturDogrula (EK_DENETIMLER).
   sezon, fikstur ve maclar paylaşılan alandır (js/kariyer.js PAYLASILAN_ALANLAR): komutlar arasında dondurulur; sonucu yazan komut yeni nesne
   kurar (k.maclar={...k.maclar,[id]:sonuç}). Dosya katı kiptedir: dondurulmuş nesneye yerinde yazmak hata verir. */
'use strict';
const SEZON_TEST={id:'2026-27',ilkHafta:13,ilkMacTarihi:'2026-11-28',
  transfer:[{ad:'Kış transfer dönemi',bas:'2027-01-04',bitis:'2027-01-31'}]};
const macKimligi=(sezon,hafta,ev,konuk)=>`mac-${sezon.kod}-${hafta}-${ev}-${konuk}`;
const haftaTarihi=(sezon,hafta)=>tarihEkle(sezon.ilkMacTarihi,(hafta-sezon.ilkHafta)*7);
/* maçın motor tohumu: dünya tohumu ve maç kimliğinin FNV-1a özeti (js/kayit.js saglamaHesapla); 32 bit işaretsiz */
const macTohumu=(dunyaTohumu,macId)=>parseInt(saglamaHesapla(`${dunyaTohumu>>>0}:${macId}`),16)>>>0;

/* çift devreli fikstür. takimlar: kimlikler (çift sayıda); sabitler: [{hafta, ev, konuk}] tutması gereken maçlar (ikinci devredekiler ilk
   devredeki aynasına çevrilir); pivot: daire yönteminin sabit takımı (sabit maçı olan her haftada rakibi bilinmeli); tohum: 32 bit.
   Döner: haftalar (2·(n−1) hafta, her biri [{ev, konuk}]). Sabitler tutturulamazsa hata fırlatır */
function fiksturUret(takimlar,sabitler,pivot,tohum){
  const n=takimlar.length,m=n-1,r=tohumluRastgele(tohum>>>0),mod=x=>((x%m)+m)%m;
  if(n<2||n%2||new Set(takimlar).size!==n||!takimlar.includes(pivot))throw new Error('Fikstür: takım sayısı çift, kimlikler tekil ve sabit takım listede olmalı');
  const karistir=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const S=sabitler.map(s=>s.hafta>m?{hafta:s.hafta-m,ev:s.konuk,konuk:s.ev}:{hafta:s.hafta,ev:s.ev,konuk:s.konuk});
  const pivotRakip={};
  for(const s of S){
    if(!Number.isInteger(s.hafta)||s.hafta<1||s.hafta>m||!takimlar.includes(s.ev)||!takimlar.includes(s.konuk)||s.ev===s.konuk)
      throw new Error(`Fikstür: geçersiz sabit maç (${s.hafta}. hafta ${s.ev}–${s.konuk})`);
    if(s.ev!==pivot&&s.konuk!==pivot)continue;
    const x=s.ev===pivot?s.konuk:s.ev;
    if(pivotRakip[s.hafta]&&pivotRakip[s.hafta]!==x)throw new Error(`Fikstür: ${s.hafta}. haftada sabit takımın iki rakibi var`);
    pivotRakip[s.hafta]=x;
  }
  if(new Set(Object.values(pivotRakip)).size!==Object.keys(pivotRakip).length)throw new Error('Fikstür: sabit takım bir devrede aynı rakiple iki kez oynuyor');
  /* daire: sabit takım ortada, öbürleri 0..m−1 yerlerinde. q. turda sabit takım q. yerdekiyle, a yerindeki (2q − a) yerindekiyle oynar.
     Sabit takımın rakibi X olan haftanın turu yer(X)'tir; o hafta A–B maçı için yer(A) + yer(B) ≡ 2·yer(X) (mod m) */
  const kosul=S.filter(s=>s.ev!==pivot&&s.konuk!==pivot).map(s=>{
    const x=pivotRakip[s.hafta];
    if(!x)throw new Error(`Fikstür: ${s.hafta}. haftada sabit takımın rakibi bilinmiyor`);
    return[s.ev,s.konuk,x];});
  const yer={},dolu=new Array(m).fill(null),sira=[];
  for(const [a,b,x] of kosul)for(const t of [x,a,b])if(!sira.includes(t))sira.push(t);
  for(const x of Object.values(pivotRakip))if(!sira.includes(x))sira.push(x);
  const tutar=()=>kosul.every(([a,b,x])=>!(a in yer&&b in yer&&x in yer)||mod(yer[a]+yer[b]-2*yer[x])===0);
  const ara=i=>{
    if(i===sira.length)return true;
    const t=sira[i];
    for(const p of karistir([...Array(m).keys()])){
      if(dolu[p]!==null)continue;
      yer[t]=p;dolu[p]=t;
      if(tutar()&&ara(i+1))return true;
      delete yer[t];dolu[p]=null;
    }
    return false;
  };
  if(!ara(0))throw new Error('Fikstür: sabit maçları tutan bir yerleşim bulunamadı');
  const bosYer=karistir([...Array(m).keys()].filter(p=>dolu[p]===null));
  for(const t of karistir(takimlar.filter(t=>t!==pivot&&!(t in yer)))){const p=bosYer.pop();yer[t]=p;dolu[p]=t;}
  const tur=new Array(m+1).fill(null),kullanilan=new Set();
  for(const [h,x] of Object.entries(pivotRakip)){tur[h]=yer[x];kullanilan.add(yer[x]);}
  const bosTur=karistir([...Array(m).keys()].filter(q=>!kullanilan.has(q)));
  for(let h=1;h<=m;h++)if(tur[h]===null)tur[h]=bosTur.pop();
  const ilk=[];
  for(let h=1;h<=m;h++){const q=tur[h],E=[[pivot,dolu[q]]];for(let i=1;i<=(m-1)/2;i++)E.push([dolu[mod(q+i)],dolu[mod(q-i)]]);ilk.push(E);}
  /* ev/deplasman: yon[h][i] 0 ise ilk yazılan ev sahibidir. Sabitler kilitlenir, kalanlar önce açgözlü, sonra yerel iyileştirmeyle seçilir */
  const yon=ilk.map(E=>E.map(()=>0)),kilit=ilk.map(E=>E.map(()=>false));
  for(const s of S){
    const E=ilk[s.hafta-1],i=E.findIndex(([a,b])=>(a===s.ev&&b===s.konuk)||(a===s.konuk&&b===s.ev));
    if(i<0)throw new Error(`Fikstür: ${s.hafta}. haftanın sabit maçı kurulamadı (${s.ev}–${s.konuk})`);
    const y=E[i][0]===s.ev?0:1;
    if(kilit[s.hafta-1][i]&&yon[s.hafta-1][i]!==y)throw new Error(`Fikstür: ${s.hafta}. hafta ${s.ev}–${s.konuk} iki farklı ev sahibiyle verilmiş`);
    yon[s.hafta-1][i]=y;kilit[s.hafta-1][i]=true;
  }
  /* maliyet (takım başına, iki devrenin 2m haftasında): ilk devrede iç saha sayısı ⌊m/2⌋–⌈m/2⌉ dışına çıkarsa birim başına 60; art arda aynı
     yerde 2 maç 1, 3 maç 15, 4 ve fazlası 15 + 200/maç. Artımlı: bir çevirme yalnız iki takımın dizisini değiştirir */
  const Y={};for(const t of takimlar)Y[t]=new Array(2*m).fill(0);
  const yaz=(h,i)=>{const [a,b]=ilk[h][i],ev=yon[h][i]?b:a,dep=yon[h][i]?a:b;Y[ev][h]=1;Y[dep][h]=0;Y[ev][h+m]=0;Y[dep][h+m]=1;};
  const tm=t=>{
    const s=Y[t];let ev1=0,L=1;for(let h=0;h<m;h++)ev1+=s[h];
    const d=Math.abs(ev1-m/2)-0.5;let c=d>0?d*60:0;
    for(let h=1;h<=2*m;h++){if(h<2*m&&s[h]===s[h-1]){L++;continue;}c+=L===2?1:L===3?15:L>3?15+200*(L-3):0;L=1;}
    return c;};
  const serbest=[];ilk.forEach((E,h)=>E.forEach((_,i)=>{if(!kilit[h][i])serbest.push([h,i]);}));
  const takimMac={};for(const t of takimlar)takimMac[t]=[];
  for(const x of serbest)for(const t of ilk[x[0]][x[1]])takimMac[t].push(x);
  const cevir=L=>{for(const [h,i] of L){yon[h][i]^=1;yaz(h,i);}};
  const etkilenen=L=>[...new Set(L.flatMap(([h,i])=>ilk[h][i]))];
  const dene=L=>{const T=etkilenen(L),once=T.reduce((s,t)=>s+tm(t),0);cevir(L);if(T.reduce((s,t)=>s+tm(t),0)<once)return true;cevir(L);return false;};
  const toplam=()=>takimlar.reduce((s,t)=>s+tm(t),0);
  /* başlangıç: açgözlü (geçen hafta deplasmanda olan evde, sonra iç saha sayısı az olan); yeniden denemede serbest maçlar tohumla karışık */
  const baslat=karisik=>{
    const evSay={},son={};for(const t of takimlar){evSay[t]=0;son[t]=null;}
    ilk.forEach((E,h)=>E.forEach(([a,b],i)=>{
      if(!kilit[h][i]){
        const ia=son[a]==='d',ib=son[b]==='d';
        yon[h][i]=karisik?(r()<0.5?0:1):ia!==ib?(ia?0:1):evSay[a]!==evSay[b]?(evSay[a]<evSay[b]?0:1):(r()<0.5?0:1);
      }
      const ev=yon[h][i]?b:a,dep=yon[h][i]?a:b;evSay[ev]++;son[ev]='i';son[dep]='d';yaz(h,i);
    }));
  };
  /* yerel iyileştirme: tek maçı ya da aynı takımın iki maçını birlikte çevir (iç saha bir takımdan öbürüne o takım üstünden geçer) */
  const iyilestir=()=>{
    for(let gec=0;gec<40;gec++){
      let iyi=false;
      for(const x of serbest)if(dene([x]))iyi=true;
      for(const t of takimlar){const M=takimMac[t];for(let a=0;a<M.length;a++)for(let b=a+1;b<M.length;b++)if(dene([M[a],M[b]]))iyi=true;}
      if(!iyi)break;
    }
    return toplam();
  };
  /* uygun: her takımın ilk devre iç saha sayısı ⌊m/2⌋–⌈m/2⌉, art arda aynı yerde en çok 3 maç. Uygun olmayan sonuçta tohumla yeniden denenir;
     seçim önce uygunluğa, sonra maliyete göre */
  const uygun=()=>takimlar.every(t=>{const s=Y[t];let ev1=0,L=1;for(let h=0;h<m;h++)ev1+=s[h];if(Math.abs(ev1-m/2)>0.5)return false;
    for(let h=1;h<2*m;h++){L=s[h]===s[h-1]?L+1:1;if(L>3)return false;}return true;});
  baslat(false);
  let enIyi=iyilestir(),enUygun=uygun(),enYon=yon.map(E=>E.slice());
  for(let deneme=0;deneme<12&&!enUygun;deneme++){
    baslat(true);const c=iyilestir(),u=uygun();
    if((u&&!enUygun)||(u===enUygun&&c<enIyi)){enIyi=c;enUygun=u;enYon=yon.map(E=>E.slice());}
  }
  enYon.forEach((E,h)=>E.forEach((y,i)=>{yon[h][i]=y;}));
  const haftalar=ilk.map((E,h)=>E.map(([a,b],i)=>yon[h][i]?{ev:b,konuk:a}:{ev:a,konuk:b}));
  return haftalar.concat(haftalar.map(E=>E.map(x=>({ev:x.konuk,konuk:x.ev}))));
}

/* sezonu ve fikstürü kurar (yeni kariyer). lig: js/lig.js biçimi (tablo, son maçlar, ilk haftanın maçı); pivot: başkanın kulübü */
function sezonKur(k,lig,pivot){
  const T=SEZON_TEST,B=lig.buMac,[sa,dk]=B.saat.split(':').map(Number),takimlar=lig.takimlar.map(t=>t.id);
  if(B.hafta!==T.ilkHafta)throw new Error(`Sezon: ilk oynanacak hafta (${T.ilkHafta}) ligin maçıyla (${B.hafta}) aynı değil`);
  const sabitler=[],gorulen=new Map();
  const ekle=(hafta,ev,konuk)=>{
    const a=hafta+':'+[ev,konuk].sort().join('-'),y=ev+'>'+konuk;
    if(gorulen.has(a)){if(gorulen.get(a)!==y)throw new Error(`Sezon: ${hafta}. hafta ${ev}–${konuk} iki farklı yerde`);return;}
    gorulen.set(a,y);sabitler.push({hafta,ev,konuk});
  };
  for(const [id,L] of Object.entries(lig.sonMaclar||{}))for(const x of L)ekle(x.hafta,x.yer==='i'?id:x.rakip,x.yer==='i'?x.rakip:id);
  ekle(B.hafta,B.ev,B.konuk);
  const haftalar=fiksturUret(takimlar,sabitler,pivot,(k.dunyaTohumu^0x51A7F00D)>>>0);
  k.sezon={id:T.id,kod:T.id.replace(/^\d\d(\d\d)-(\d\d)$/,'$1$2'),ad:lig.ad,grup:lig.grup,sezonAdi:lig.sezon,etiket:'TEST',
    ilkHafta:T.ilkHafta,haftaSayisi:haftalar.length,ilkMacTarihi:T.ilkMacTarihi,dakika:sa*60+dk,
    bolgeler:JSON.parse(JSON.stringify(lig.bolgeler||{})),takimlar,
    devralinan:{tablo:Object.fromEntries(lig.takimlar.map(t=>[t.id,{G:t.G,B:t.B,M:t.M,A:t.A,Y:t.Y}])),sonMaclar:JSON.parse(JSON.stringify(lig.sonMaclar||{}))},
    transfer:JSON.parse(JSON.stringify(T.transfer))};
  k.fikstur=[];
  haftalar.forEach((E,i)=>{const hafta=i+1,tarih=haftaTarihi(k.sezon,hafta);
    for(const x of E)k.fikstur.push({id:macKimligi(k.sezon,hafta,x.ev,x.konuk),hafta,tarih,dakika:k.sezon.dakika,ev:x.ev,konuk:x.konuk});});
}
/* kulübün oynanmamış ilk maçı (ilkHafta ve sonrası); yoksa null */
function siradakiMac(k,kulupId){
  let en=null;
  for(const f of k.fikstur)if(f.hafta>=k.sezon.ilkHafta&&(f.ev===kulupId||f.konuk===kulupId)&&!k.maclar[f.id]&&(!en||f.hafta<en.hafta))en=f;
  return en;
}
/* maç günü ajanda işi (zorunlu, süresi 0; "Stada git" bunu yapar). Kimliğini döndürür */
function macGunuIsiKur(k,macId){
  const f=k.fikstur.find(x=>x.id===macId);
  if(!f)throw new Error(`Maç günü kurulamadı: fikstürde ${macId} yok`);
  const ad=id=>(k.kulupler[id]||{ad:id}).ad,ev=f.ev===(k.kisiler[k.baskanId]||{}).kulupId;
  return isEkle(k,{tur:'ajanda',tarih:f.tarih,dakika:f.dakika,veri:{baslik:`Maç: ${ad(f.ev)} – ${ad(f.konuk)}`,
    aciklama:`${k.sezon.ad} ${f.hafta}. hafta. `+(ev?'Başkan koltuğunda yerini al.':'Deplasmanda konuk başkan locasında yerini al.'),
    zorunluluk:'zorunlu',sure:0,eylem:'macGunu',macId}});
}
/* yeni kariyerin sezon takvimi: kulübün sıradaki maç günü ve transfer dönemlerinin açılış ve kapanış hatırlatmaları (TEST metni) */
function sezonTakvimiKur(k,kulupId){
  const f=siradakiMac(k,kulupId);
  if(f)macGunuIsiKur(k,f.id);
  for(const t of k.sezon.transfer){
    isEkle(k,{tur:'hatirlatma',tarih:t.bas,dakika:GUN_BASLANGICI,veri:{metin:`${t.ad} açıldı; ${gunAyYazi(t.bitis)} akşamı kapanır.`}});
    isEkle(k,{tur:'hatirlatma',tarih:t.bitis,dakika:1200,veri:{metin:`${t.ad} kapandı.`}});
  }
}
/* ---- G1-d: sezon sonu kaydı ---- */
const SEZON_SONU_EKLERI=[];   // (k) => void; sezon sonu kaydından hemen sonra, aynı komutta
const SEZON_SONU_METNI='Sezon tamamlandı; yeni sezon bu sürümde yok (TEST).';
const sezonTamamMi=k=>!!k.sezon&&Array.isArray(k.fikstur)&&k.fikstur.every(f=>f.hafta<k.sezon.ilkHafta||!!(k.maclar||{})[f.id]);
/* sezon bittiyse bir kez yazar; yazdıysa true */
function sezonSonuYaz(k){
  if(!sezonTamamMi(k)||k.sezon.sonuc)return false;
  const tablo=sezonTablosu(k).map(t=>({id:t.id,O:t.O,G:t.G,B:t.B,M:t.M,A:t.A,Y:t.Y,P:t.P})),biz=(k.kisiler[k.baskanId]||{}).kulupId,i=tablo.findIndex(t=>t.id===biz);
  const sonuc={tarih:k.tarih,tablo,sampiyon:tablo[0].id,bizimSira:i>=0?i+1:null,bizimPuan:i>=0?tablo[i].P:null};
  k.sezon=Object.assign({},k.sezon,{sonuc});
  k.gecmis.push({tur:'sezonSonu',sezonId:k.sezon.id,sira:sonuc.bizimSira,puan:sonuc.bizimPuan,sampiyon:sonuc.sampiyon,tarih:k.tarih,dakika:k.gunIciDakika});
  const ad=id=>(k.kulupler[id]||{ad:id}).ad;
  isEkle(k,{tur:'hatirlatma',tarih:tarihEkle(k.tarih,1),dakika:600,veri:{metin:`Sezon tamamlandı: ${k.sezon.ad}${i>=0?` ${i+1}. sıra, ${sonuc.bizimPuan} puan`:''}; şampiyon ${ad(sonuc.sampiyon)}. Yeni sezon bu sürümde yok (TEST).`}});
  for(const f of SEZON_SONU_EKLERI)f(k);
  return true;
}
ILERLE_ENGEL_EKLERI.push(k=>k.sezon&&k.sezon.sonuc?SEZON_SONU_METNI:null);

/* puan durumu: devralınan tablo + oynanan maçlar; js/lig.js puanDurumu ile sıralanır (O, P, AV eklenir).
   S-d: sonAn verilirse yalnız başlama anı ondan önce olan maçlar sayılır (maç anındaki tablo); verilmezse bütün oynananlar */
const tabloMacIsle=(T,ev,konuk,skor)=>{const isle=(t,a,y)=>{if(!t)return;t.A+=a;t.Y+=y;if(a>y)t.G++;else if(a<y)t.M++;else t.B++;};isle(T[ev],skor[0],skor[1]);isle(T[konuk],skor[1],skor[0]);};
function sezonTablosu(k,sonAn){
  const S=k.sezon,T={};
  for(const id of S.takimlar){const d=S.devralinan.tablo[id]||{G:0,B:0,M:0,A:0,Y:0};T[id]={id,ad:(k.kulupler[id]||{ad:id}).ad,G:d.G,B:d.B,M:d.M,A:d.A,Y:d.Y};}
  for(const f of k.fikstur){const s=k.maclar[f.id];if(!s||(sonAn!==undefined&&anDakika(f.tarih,f.dakika)>=sonAn))continue;tabloMacIsle(T,f.ev,f.konuk,s.skor);}
  return puanDurumu({takimlar:Object.values(T)});
}
/* S-d: canlı tablo — puan durumu (sezonTablosu ya da bülten tablosu) + [{ev, konuk, skor:[a, y]|null}] (skorsuz satır sayılmaz); yerinde yazmaz */
function canliTablo(tablo,sonuclar){
  const T={};for(const t of tablo)T[t.id]={id:t.id,ad:t.ad,G:t.G,B:t.B,M:t.M,A:t.A,Y:t.Y};
  for(const s of sonuclar||[])if(s&&Array.isArray(s.skor))tabloMacIsle(T,s.ev,s.konuk,s.skor);
  return puanDurumu({takimlar:Object.values(T)});
}
/* S-d: haftanın maçları [{f, s|null}] (fikstür sırasıyla) */
const haftaFiksturu=(k,hafta)=>(k.fikstur||[]).filter(f=>f.hafta===hafta).map(f=>({f,s:(k.maclar||{})[f.id]||null}));
/* S-d: sıranın bölgesi (bültenin kuralı: js/ekran-mac-oncesi.js): 'cikma' | 'playoff' | 'dusme' | '' */
const ligBolgesi=(Z,n)=>{const ara=r=>!!r&&n>=r[0]&&n<=r[1];Z=Z||{};return ara(Z.cikma)?'cikma':ara(Z.playoff)?'playoff':ara(Z.dusme)?'dusme':'';};
/* S-d: gol sıralaması [{id, ad, kulupId, gol}] çoktan aza (eşitlikte ad). o: {kulupId, sonAn, enCok}. Gol sayacı devralınan haftaları da taşır;
   sonAn verilirse o andan (dahil) sonra başlayan maçların golleri düşülür (kendi kalesine sayılmaz) ve kulüp o ana göre bulunur (js/transfer.js) */
function golSiralamasi(k,o){
  o=o||{};const dus=new Map(),tarihli=o.sonAn!==undefined;
  if(tarihli)for(const f of k.fikstur||[]){const s=(k.maclar||{})[f.id];if(!s||anDakika(f.tarih,f.dakika)<o.sonAn)continue;
    for(const g of s.goller||[])if(g.id&&!g.kk)dus.set(g.id,(dus.get(g.id)||0)+1);}
  const L=[];
  for(const p of Object.values(k.oyuncular||{})){const gol=(p.gol|0)-(dus.get(p.id)||0);if(gol<=0)continue;
    const kulupId=tarihli&&typeof oyuncuKulubuTarihte==='function'?oyuncuKulubuTarihte(k,p.id,o.sonAn):p.kulupId||null;
    if(!kulupId||(o.kulupId&&kulupId!==o.kulupId))continue;L.push({id:p.id,ad:p.ad,kulupId,gol});}
  L.sort((a,b)=>b.gol-a.gol||a.ad.localeCompare(b.ad,'tr')||(a.id<b.id?-1:1));
  return o.enCok?L.slice(0,o.enCok):L;
}
/* S-d: kulüp ekranının verisi (saf). tablo verilirse sıra ve puan ondan (maçta canlı tablo), yoksa sezonTablosu. Son beş sonBesMac'tır (boşsa []);
   hocanın bilgi ve ısrarı, oyuncu özellikleri yoktur. siradaki: {id, hafta, tarih, dakika, rakip, yer:'i'|'d'} | null */
function kulupOzeti(k,kulupId,tablo){
  const c=k.kulupler[kulupId];if(!c)return null;
  const T=tablo||sezonTablosu(k),i=T.findIndex(t=>t.id===kulupId),t=i>=0?T[i]:{P:0,O:0,G:0,B:0,M:0,A:0,Y:0,AV:0};
  const h=typeof kulupHocasi==='function'?kulupHocasi(k,kulupId):null,st=kulupStatTarifi(k,kulupId),sr=siradakiMac(k,kulupId);
  const tarzAdi=h&&typeof TARZ_ARKETIP!=='undefined'&&TARZ_ARKETIP[h.hoca.tarz]?TARZ_ARKETIP[h.hoca.tarz].ad:h?h.hoca.tarz:null;
  return{id:kulupId,ad:c.ad,kisa:c.kisa||kulupKisaAd(c.ad),sira:i+1,P:t.P,O:t.O,G:t.G,B:t.B,M:t.M,A:t.A,Y:t.Y,AV:t.AV,son:sonBesMac(k,kulupId),
    golculer:golSiralamasi(k,{kulupId,enCok:3}),hoca:h?{ad:h.ad,tarz:h.hoca.tarz,tarzAdi}:null,stat:{ad:st.ad,kapasite:statKapasitesi(st)},
    siradaki:sr?{id:sr.id,hafta:sr.hafta,tarih:sr.tarih,dakika:sr.dakika,rakip:sr.ev===kulupId?sr.konuk:sr.ev,yer:sr.ev===kulupId?'i':'d'}:null};
}
/* kulübün son beş maçı (eskiden yeniye): devralınan son maçlar + oynanan maçlar; js/lig.js sonMaclar biçimi */
function sonBesMac(k,kulupId){
  const L=(k.sezon.devralinan.sonMaclar[kulupId]||[]).map(x=>Object.assign({},x));
  for(const f of k.fikstur){
    const s=k.maclar[f.id];if(!s||(f.ev!==kulupId&&f.konuk!==kulupId))continue;
    const ev=f.ev===kulupId;L.push({hafta:f.hafta,rakip:ev?f.konuk:f.ev,yer:ev?'i':'d',a:s.skor[ev?0:1],y:s.skor[ev?1:0]});
  }
  return L.sort((a,b)=>a.hafta-b.hafta).slice(-5);
}

/* sezon, fikstür, maç sonuçları ve maç günü işlerinin doğrulaması (kariyerDogrula EK_DENETIMLER üzerinden çağırır).
   Sezonun ve fikstürün kendi iç denetimi (tarif, fikstür kuralları, devralınan son maçlar) dondurulmuş sezon ve fikstür için bir kez yapılır
   (js/kariyer.js PAYLASILAN_ALANLAR: değişemezler); kulüplerle, oynanan maçlarla ve maç günü işiyle bağları her seferinde denetlenir */
const FIKSTUR_DENETIMI=new WeakMap();   // dondurulmuş fikstür → {S, hatalar, kimlik}
function fiksturIcDenetim(S,F){
  const h=[],duz=x=>!!x&&typeof x==='object'&&!Array.isArray(x),tam=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
  const T=Array.isArray(S.takimlar)?S.takimlar:[],n=T.length,kimlik=new Map(),sonuc={hatalar:h,kimlik};
  if(typeof S.id!=='string'||!/^\d{4}-\d{2}$/.test(S.id)||typeof S.kod!=='string'||!/^\d{4}$/.test(S.kod))h.push('Sezon: kimlik ya da kod geçersiz');
  for(const a of ['ad','grup','sezonAdi','etiket'])if(typeof S[a]!=='string')h.push(`Sezon: ${a} metin değil`);
  if(!n||n%2||new Set(T).size!==n){h.push('Sezon: takım listesi çift sayıda ve tekil olmalı');return sonuc;}
  if(S.haftaSayisi!==2*(n-1))h.push(`Sezon: hafta sayısı çift devreye uymuyor (${S.haftaSayisi})`);
  if(!tam(S.ilkHafta,1,S.haftaSayisi))h.push(`Sezon: ilk hafta geçersiz (${S.ilkHafta})`);
  if(!tam(S.dakika,0,1439))h.push('Sezon: başlama saati geçersiz');
  if(!tarihGecerliMi(S.ilkMacTarihi)){h.push(`Sezon: ilk maç günü geçersiz (${S.ilkMacTarihi})`);return sonuc;}
  if(!duz(S.bolgeler))h.push('Sezon: bölgeler yok');
  if(!Array.isArray(S.transfer)||!S.transfer.every(t=>duz(t)&&typeof t.ad==='string'&&tarihGecerliMi(t.bas)&&tarihGecerliMi(t.bitis)&&t.bas<=t.bitis))h.push('Sezon: transfer dönemleri geçersiz');
  const D=duz(S.devralinan)?S.devralinan:null;
  if(!D||!duz(D.tablo)||!duz(D.sonMaclar)){h.push('Sezon: devralınan tablo ya da son maçlar yok');return sonuc;}
  const toplam={G:0,B:0,M:0,A:0,Y:0};
  for(const id of T){
    const t=D.tablo[id];
    if(!duz(t)||!['G','B','M','A','Y'].every(a=>tam(t[a],0,999))){h.push(`Sezon: ${id} devralınan tablo satırı geçersiz`);continue;}
    if(t.G+t.B+t.M!==S.ilkHafta-1)h.push(`Sezon: ${id} devralınan maç sayısı ${t.G+t.B+t.M} (beklenen ${S.ilkHafta-1})`);
    for(const a in toplam)toplam[a]+=t[a];
  }
  if(toplam.G!==toplam.M||toplam.B%2||toplam.A!==toplam.Y)h.push('Sezon: devralınan tablo kendi içinde tutmuyor (galibiyet ≠ mağlubiyet ya da atılan ≠ yenilen)');
  /* fikstür: kimlik, hafta, tarih; her takım her hafta bir maç; her sıralı çift bir kez */
  const haftaTakim=new Set(),cift=new Set(),tarihler={};
  for(const [i,f] of F.entries()){
    const ad=`Fikstür [${i}]`;
    if(!duz(f)){h.push(`${ad}: kayıt değil`);continue;}
    if(!tam(f.hafta,1,S.haftaSayisi)||!T.includes(f.ev)||!T.includes(f.konuk)||f.ev===f.konuk){h.push(`${ad}: hafta ya da takımlar geçersiz`);continue;}
    if(f.id!==macKimligi(S,f.hafta,f.ev,f.konuk))h.push(`${ad}: kimlik ${f.id} biçime uymuyor`);
    if(kimlik.has(f.id))h.push(`${ad}: ${f.id} iki kez`);kimlik.set(f.id,f);
    if(f.tarih!==(tarihler[f.hafta]||(tarihler[f.hafta]=haftaTarihi(S,f.hafta)))||!tam(f.dakika,0,1439))h.push(`${ad}: ${f.hafta}. haftanın tarihi ya da saati tutmuyor`);
    for(const t of [f.ev,f.konuk]){const a=f.hafta+':'+t;if(haftaTakim.has(a))h.push(`Fikstür: ${t} ${f.hafta}. haftada iki maçta`);haftaTakim.add(a);}
    const c=f.ev+'>'+f.konuk;if(cift.has(c))h.push(`Fikstür: ${f.ev}–${f.konuk} iki kez`);cift.add(c);
  }
  if(cift.size!==n*(n-1))h.push(`Fikstür: çift devre eksik (${cift.size}/${n*(n-1)} maç)`);
  /* G1-d: sezon sonu kaydı (varsa) */
  if(S.sonuc!==undefined){const R=S.sonuc,L=duz(R)&&Array.isArray(R.tablo)?R.tablo:null;
    if(!L||!tarihGecerliMi(R.tarih)||L.length!==n||new Set(L.map(t=>t&&t.id)).size!==n||!L.every(t=>duz(t)&&T.includes(t.id)&&['O','G','B','M','A','Y','P'].every(a=>tam(t[a],0,9999))&&t.P===3*t.G+t.B)
      ||R.sampiyon!==L[0].id||!(R.bizimSira===null||tam(R.bizimSira,1,n)))h.push('Sezon: sezon sonu kaydı geçersiz');}
  /* devralınan son maçlar fikstürle tutmalı (maç öncesi ekranı ikisini birlikte gösterir) */
  for(const [id,L] of Object.entries(D.sonMaclar)){
    if(!T.includes(id)||!Array.isArray(L)){h.push(`Sezon: ${id} son maçları geçersiz`);continue;}
    for(const x of L){
      if(!duz(x)||!tam(x.hafta,1,S.ilkHafta-1)||!T.includes(x.rakip)||!['i','d'].includes(x.yer)||!tam(x.a,0,99)||!tam(x.y,0,99)){h.push(`Sezon: ${id} son maç kaydı geçersiz`);continue;}
      const ev=x.yer==='i'?id:x.rakip,konuk=x.yer==='i'?x.rakip:id;
      if(!kimlik.has(macKimligi(S,x.hafta,ev,konuk)))h.push(`Sezon: ${id}'in ${x.hafta}. hafta maçı (${ev}–${konuk}) fikstürde yok`);
    }
  }
  return sonuc;
}
function fiksturDogrula(k,h){
  const S=k.sezon,F=k.fikstur,duz=x=>!!x&&typeof x==='object'&&!Array.isArray(x),tam=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
  if(!duz(S)){h.push('Sezon kaydı (sezon) yok');return;}
  if(!Array.isArray(F)){h.push('Fikstür (fikstur) liste değil');return;}
  if(!duz(k.maclar)){h.push('Maç sonuçları (maclar) yok');return;}
  let ic=FIKSTUR_DENETIMI.get(F);
  if(!ic||ic.S!==S){ic=Object.assign(fiksturIcDenetim(S,F),{S});if(DONMUS.has(F)&&DONMUS.has(S))FIKSTUR_DENETIMI.set(F,ic);}
  h.push(...ic.hatalar);
  const K=k.kulupler||{},kimlik=ic.kimlik;
  for(const id of Array.isArray(S.takimlar)?S.takimlar:[])if(!K[id])h.push(`Sezon: ${id} kulüplerde yok`);
  /* oynanan maçlar: fikstürde, oynanacak haftalarda, skor iki doğal sayı (geçersiz ilk hafta iç denetimde bildirilir) */
  const ilkHafta=Number.isInteger(S.ilkHafta)?S.ilkHafta:1;
  for(const [id,s] of Object.entries(k.maclar)){
    const f=kimlik.get(id);
    if(!f){h.push(`Maç ${id}: fikstürde yok`);continue;}
    if(f.hafta<ilkHafta)h.push(`Maç ${id}: devralınan haftada sonuç yazılmış`);
    if(!duz(s)||!Array.isArray(s.skor)||s.skor.length!==2||!s.skor.every(x=>tam(x,0,99)))h.push(`Maç ${id}: skor geçersiz`);
  }
  if(S.sonuc!==undefined&&!sezonTamamMi(k))h.push('Sezon: sezon sonu kaydı var fakat oynanmamış maç kalmış');
  /* maç günü işi: en çok bir bekleyen; fikstürdeki oynanmamış maça, onun anında bağlı */
  const bekleyen=Object.values(k.isler||{}).filter(x=>x&&x.tur==='ajanda'&&x.veri&&x.veri.eylem==='macGunu');
  if(bekleyen.length>1)h.push(`Maç günü: ${bekleyen.length} bekleyen maç günü işi var (en çok bir)`);
  for(const x of bekleyen){
    const f=kimlik.get(x.veri.macId);
    if(!f){h.push(`İş ${x.id}: maç günü fikstürdeki bir maça bağlı değil (${x.veri.macId})`);continue;}
    if(k.maclar[f.id])h.push(`İş ${x.id}: ${f.id} zaten oynanmış`);
    if(x.tarih!==f.tarih||x.dakika!==f.dakika)h.push(`İş ${x.id}: maç günü fikstürdeki ${f.tarih} ${saatYazi(f.dakika)} anında değil`);
  }
}
EK_DENETIMLER.push(fiksturDogrula);
