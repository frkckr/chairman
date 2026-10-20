/* ============ Chairman — maçı izleme: hız seçimi ve önemli anlarda normal hız (U1, 2026-10-12; sunum mantığı, çizim ve DOM yok) ============
   Kullanıcı kararı (2026-10-12): motorun maçı 20 dakikadır; oyuncu 1×, 2× ya da 4× izler, önemli anlarda izleme kendiliğinden 1×'e iner:
   olaydan birkaç saniye önce yumuşakça yavaşlar, an normal hızda izlenir, sonra seçilen hıza döner. Seçilen anlar: gol ve şut (her zaman), faul
   ve kart, sakatlık, korner ve tehlikeli serbest vuruş (penaltı dahil), ofsayt bayrağı. Taç, kale vuruşu, değişiklik, hakem topu ve zaman
   geçirme yavaşlatmaz; tedavi, sedye, gol sonrası santraya yürüyüş ve duran topun hazırlığı seçilen hızda geçer.
   Önceden bilmek — ikiz motor: motor tohumlu ve belirlenimcidir (rastlantı yalnız this.rast, srast, skRast), ana motora dışarıdan giren tek komut
   maç öncesindeki macaGec'tir. Aynı seçenek ve tohumla kurulan ikinci Match aynı maçı oynar. İkiz maç öncesinde ana motorla aynı adımda yürür
   (Santraya geç ikisine birden uygulanır: izlemeMacaGec); ana motor santraya geçince ikiz IZLEME.onde saniye öne çıkar, ürettiği önemli
   olaylardan pencereler kurulur. Ana motorun olayları (ad ve kare) ikizinkilerle sırayla karşılaştırılır; tutmazsa ikiz bırakılır, uyarı yazılır,
   o maçta pencereler ana motorun kendi olayından başlar (önceden yavaşlama yok) ve sapma sayılır. Maç sonunda iki sonuç kaydı da karşılaştırılır.
   Hız eğrisi motor zamanındadır (kare): pencereye rampaIn saniye kala seçilen hızdan 1×'e doğrusal iner, pencere bitince rampaOut saniyede çıkar;
   kare hızından bağımsızdır. Adımlar yine tam 1/60 sn olduğundan maçın sonucu izleme hızından etkilenmez (TEKNIK_PLAN §8).
   Kullananlar: js/mac-sahnesi.js (ana motorun adımı ve MAC_HIZ), araclar/ikiz-deneme.js (Node: iç içe iki motorun aynılığı, pencerelerin süresi).
     izlemeKur(ana, MatchSinifi, secenek) · izlemeAnaOlay(I, ad, v) · izlemeAdim(I) · izlemeMacaGec(I) · izlemeHedefHiz(I, secim)
   Ana motor bu dosyada yalnız okunur (kare, phase, tohum, sonucKaydi); ilerletilen ve macaGec verilen yalnız ikizdir (araclar/ad-denetimi.js (c)). */
'use strict';
const IZLEME={
  onde:7,            // ikizin ana motorun önünde gittiği süre (motor sn): en uzun "önce" + rampaIn'den büyük
  ondeAdim:6,        // öne çıkarken ana motorun her adımına ikizin fazladan attığı adım (bir karede takılma olmasın)
  rampaIn:1.5,       // pencereden önce seçilen hızdan 1×'e iniş (motor sn; 4×'te ~0,7 gerçek sn)
  rampaOut:2,        // pencereden sonra 1×'ten seçilen hıza çıkış (motor sn; 4×'te ~0,9 gerçek sn)
  birlestir:2,       // aralarındaki boşluk bundan kısa pencereler birleşir (motor sn; iniş-çıkış dalgası olmasın)
  acikEnCok:14,      // sonu sonraki bir olayla belirlenen pencerenin en uzun süresi (motor sn; sakatlık)
  /* olay → pencere: once/sonra (motor sn; sonra işlev olabilir), kosul (olayın verisine göre), acik (pencere kapat olaylarından birine dek sürer) */
  anlar:{
    goal:{once:4,sonra:7},                                   // gol ve sevinç (gol evresi 7 sn); santraya yürüyüş seçilen hızda
    golIptal:{once:3,sonra:4},
    shot:{once:3,sonra:2.5},
    header:{once:3,sonra:2.5,kosul:v=>!!(v&&v.shot)},        // kafa şutu
    save:{once:0,sonra:2},wood:{once:0,sonra:2},
    faul:{once:2,sonra:3},avantaj:{once:2,sonra:2.5},
    kart:{once:0,sonra:v=>v&&v.renk==='sari'?2.5:4},
    sakatlik:{once:2,sonra:2,acik:v=>!!(v&&v.derece!=='agri')},   // tedavi ve çıkış: hakem durdurana ya da tedavi başlayana dek; tedavi seçilen hızda
    ofsayt:{once:2,sonra:2},
    kullanim:{once:1.5,sonra:4,kosul:v=>!!(v&&v.du&&(v.du.tur==='korner'||v.du.tur==='penalti'||v.du.sinif==='baraj'||v.du.sinif==='kenar'))},
    /* S1 (js/mac-sahne.js dudukCal): barajlı serbest vuruşun ve penaltının seremonili düdüğü — düdükten kullanıma bekleyiş, koşu ve vuruş normal
       hızda; santranın ve kartlı sıradan duruşun düdüğü seçilen hızda kalır (U1'in seçilen anları) */
    duduk:{once:1,sonra:5,kosul:v=>!!(v&&v.seremoni&&(v.tur==='penalti'||v.sinif==='baraj'))}
  },
  kapat:{hakemTopu:1.5,tedaviBasladi:1.5}                    // açık pencereyi kapatan olay → sonrası (motor sn)
};
/* durum: ana motor, ikiz, ikizin olay günlüğü, ana motorun karşılaştırılmayı bekleyen olayları, pencereler [{a, b, acik?, son}] (kare) */
function izlemeKur(ana,MatchSinifi,secenek){
  const I={ana,ikiz:null,gunluk:[],anaBuf:[],pencereler:[],sapma:0,sapmaYer:null,son:null,ikizSonuc:null,ikizAdim:0,kurulu:false};
  /* ikiz kurulamazsa izleme yine çalışır: pencereler ana motorun olayından başlar (önceden yavaşlama yok) */
  try{let ikiz=null;
    ikiz=new MatchSinifi((ad,v)=>{if(I.kurulu)I.gunluk.push({kare:ikiz.kare||0,ad,v});},Object.assign({},secenek,{tohum:ana.tohum}));
    I.ikiz=ikiz;I.kurulu=true;}
  catch(e){I.ikiz=null;I.sapma++;I.sapmaYer='ikiz kurulamadı: '+(e&&e.message);if(typeof console!=='undefined')console.warn('İzleme: '+I.sapmaYer);}
  return I;
}
const izlemeOncesi=m=>MAC_ONCESI.includes(m.phase);
/* pencere ekle (kare cinsinden): sıralı tutulur, örtüşen ya da IZLEME.birlestir'den yakın olanlar birleşir */
function izlemePencere(I,a,b,acik,son){
  const P=I.pencereler,g=IZLEME.birlestir*60;let w={a,b,acik:!!acik,son:son||b};
  for(let i=P.length-1;i>=0;i--){const q=P[i];
    if(w.a<=q.b+g&&q.a<=w.b+g){w={a:Math.min(q.a,w.a),b:Math.max(q.b,w.b),acik:q.acik||w.acik,son:Math.max(q.son,w.son)};P.splice(i,1);}}
  let i=0;while(i<P.length&&P[i].a<w.a)i++;P.splice(i,0,w);return w;
}
/* bir olaydan pencere (kare: olayın karesi; ikizden geldiyse ileride, ana motordan geldiyse şimdi — önce payı sıfırlanır) */
function izlemeOlayPenceresi(I,ad,v,kare,ondenBiliniyor){
  const K=IZLEME.kapat[ad];
  if(K!=null){for(const w of I.pencereler)if(w.acik&&w.a<=kare){w.acik=false;w.b=Math.min(w.son,Math.max(w.b,kare+K*60));}}
  const A=IZLEME.anlar[ad];if(!A||(A.kosul&&!A.kosul(v)))return;
  const once=ondenBiliniyor?A.once:0,sonra=typeof A.sonra==='function'?A.sonra(v):A.sonra,acik=A.acik?A.acik(v):false;
  izlemePencere(I,kare-once*60,kare+sonra*60,acik,acik?kare+IZLEME.acikEnCok*60:0);
}
/* ana motorun olayı (js/mac-sahnesi.js on geri çağrısından; ana motorun karesiyle). İkiz yoksa (bozulduysa) pencere buradan kurulur */
function izlemeAnaOlay(I,ad,v){
  if(!I)return;const k=I.ana.kare||0;
  if(I.ikiz)I.anaBuf.push({kare:k,ad});
  else if(!izlemeOncesi(I.ana))izlemeOlayPenceresi(I,ad,v,k,false);
}
function izlemeBirak(I,neden){
  I.sapma++;I.sapmaYer=neden;I.ikiz=null;I.gunluk.length=0;I.anaBuf.length=0;
  if(typeof console!=='undefined')console.warn('İzleme: ikiz motor ana motordan ayrıldı ('+neden+'); bu maçta önemli anlar önceden bilinmiyor');
}
/* ana motorun her adımından sonra (olayları dağıtıldıktan sonra): ikizi ilerlet, olayları karşılaştır, pencereleri kur */
function izlemeAdim(I){
  if(!I||!I.ikiz)return;
  const A=I.ana,Z=I.ikiz,dt=1/60,ak=A.kare||0;
  /* hedef: maç öncesinde aynı kare; sonra IZLEME.onde saniye önde (kademeli). Maç bitince ikiz bırakılır. Kare adım atılmadan tanımsızdır
     ("Santraya geç" ilk adımdan önce basılırsa ikiz hiç adım atmamış olur): 0 sayılır */
  const hedef=izlemeOncesi(A)?ak:Math.min(ak+IZLEME.onde*60,Math.max(ak,Z.kare||0)+1+IZLEME.ondeAdim);
  while((Z.kare||0)<hedef){const g0=I.gunluk.length;Z.step(dt);I.ikizAdim++;
    if(Z.phase==='fulltime'&&!I.ikizSonuc)I.ikizSonuc={kare:Z.kare,kayit:JSON.stringify(Z.sonucKaydi())};
    if(!izlemeOncesi(Z))for(let i=g0;i<I.gunluk.length;i++){const o=I.gunluk[i];izlemeOlayPenceresi(I,o.ad,o.v,o.kare,true);}}
  /* karşılaştırma: ana motorun karesine kadarki olaylar sırayla aynı olmalı */
  const G=I.gunluk,B=I.anaBuf;let j=0;
  while(j<G.length&&G[j].kare<=ak)j++;
  if(j!==B.length){izlemeBirak(I,'kare '+ak+': ikizde '+j+', ana motorda '+B.length+' olay');return;}
  for(let i=0;i<j;i++)if(G[i].ad!==B[i].ad||G[i].kare!==B[i].kare){izlemeBirak(I,'kare '+B[i].kare+': ikizde '+G[i].ad+', ana motorda '+B[i].ad);return;}
  G.splice(0,j);B.length=0;
  /* maç sonu: iki sonuç kaydı aynı olmalı; ikiz artık gereksiz */
  if(A.phase==='fulltime'){const k=JSON.stringify(A.sonucKaydi());I.son={ayni:!!I.ikizSonuc&&I.ikizSonuc.kayit===k};
    if(!I.son.ayni)izlemeBirak(I,'maç sonu kaydı farklı');else{I.ikiz=null;G.length=0;}}
  /* geçmiş pencereler atılır */
  const P=I.pencereler,eski=ak-IZLEME.rampaOut*60;while(P.length&&(P[0].acik?P[0].son:P[0].b)<eski)P.shift();
}
/* "Santraya geç": ana motor macaGec aldıktan hemen sonra ikize de (aynı karede olmalıdır) */
function izlemeMacaGec(I){
  if(!I||!I.ikiz)return;
  if((I.ikiz.kare||0)!==(I.ana.kare||0)){izlemeBirak(I,'macaGec ikiz öndeyken');return;}
  I.ikiz.macaGec();
}
/* ana motorun şimdiki karesinde izleme hızı: seçilen hız, pencerelerin rampalarıyla 1×'e iner. secim ≤ 1 ise aynen */
function izlemeHedefHiz(I,secim){
  if(!(secim>1)||!I)return secim>0?secim:1;
  const k=I.ana.kare||0;let v=secim;
  for(const w of I.pencereler){let h;const b=w.acik?w.son:w.b;   /* açık pencere: kapatan olay gelene ya da en uzun süresine dek */
    if(k<w.a)h=1+(secim-1)*Math.min(1,(w.a-k)/60/IZLEME.rampaIn);
    else if(k<=b)h=1;
    else h=1+(secim-1)*Math.min(1,(k-b)/60/IZLEME.rampaOut);
    if(h<v)v=h;}
  return v;
}
/* şu an bir önemli anın penceresinde mi (arayüzün küçük göstergesi için) */
function izlemeAnda(I){if(!I)return false;const k=I.ana.kare||0;for(const w of I.pencereler)if(k>=w.a&&k<=(w.acik?w.son:w.b))return true;return false;}
