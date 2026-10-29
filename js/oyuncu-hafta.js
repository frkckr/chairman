/* ============ Chairman — oyuncunun haftası: kondisyon, form, gelişim, antrenman programı (çizim yok; S-a, 2026-10-27) ============
   Kullanıcı kararı (2026-10-27; YOL_HARITASI karar 54, plan araclar/plan/s-uygulama.md): kondisyon oynanan dakikayla düşer, günlerle toparlanır
   (yaş ve dayanıklılık); form gizlidir, maçtan maça yavaş değişir ve hocanın maç başı form zarının yerini alır; gelişim haftalık, küçük ve
   kalıcıdır (gençler yükselir, 30+ yavaş düşer; gizli tavan; garanti yok); bütün kulüplerde. Hoca yorgun oyuncuyu dinlendirir, formu tartar
   (js/hoca.js). Maç girdisinde kondisyon ve form özelliklere küçük çarpandır (macOzu; js/mac-girdi.js macKaydi). Motor dosyaları değişmez.
   Kondisyon ve form hiçbir ekranda sayı olarak görünmez (yalnız TEST paneli); moral yoktur (Y0).
   Saf kural dosyasıdır: üst düzeyde DOM yok, Node'da da yüklenir (motor yükleyici js/goruntu.js'ten önceki dosyaları alır).
   Veri: oyuncu kaydında isteğe bağlı hal:{kon, gun, form, gel, tav} — kon son maç kaydı anındaki kondisyon (0–100), gun o maçın günü, form
     −100…100, gel gelişim birikimi (yuva puanının yüzdesi, −99…99), tav gizli tavan (1–99; ilk yazımda kurulur). Alan yoksa kondisyon 100, form 0.
     mac, dk: bu sezonun maç ve dakika sayaçları (gol ve sarı gibi; devralınan haftalar TEST üretimi, js/kariyer-kadro.js devralinanSayaclar).
   Yazım tek yerdedir: js/mac-sonuc.js macKaydiYaz → MAC_KAYDI_EKLERI → oyuncuHaftasiYaz (her maç kaydı, kısa ve hükmen dahil, iki kulübün bütün
     oyuncuları; rastlantı yalnız tohumlu akışlardan). Kondisyon günlük yazılmaz: değeri son maç çapasından günlerin toparlanmasıyla saf hesaplanır.
   Antrenman programı saklanmaz (antrenmanProgrami): maç günü maç, hafta sonu dinlenme, maç ertesi ilk hafta içi günü toparlanma, maçtan önceki gün
     hafif, öbür hafta içi günleri yoğun (yükü hocanın tarzından). S-b balkonda görünür kılar (js/gozlem.js).
   OYUNCU_HAFTA_TEST.kapali araç anahtarıdır (kayda girmez; sezon-deneme SEZON_DENEME_AYAR ile): kapalıyken hal yazılmaz, girdi düz kopyadır, hoca eski
     zarla seçer — S öncesi sonuçlar birebir. Bütün değerler TEST; kullanıcı değiştirir. */
'use strict';
const OYUNCU_HAFTA_TEST={kapali:false,
  konEsik:90,konAralik:40,konEnCok:0.05,konYuva:[0,9],
  formOlcek:50,formEnCok:0.03,formYuva:[1,2,3,4,5,6,7],formAr:0.75,formSok:25,
  dusus90:26,kaleciPay:0.35,sakatEksik:15,uzunCapa:60,
  toparlanma:{mac:3.75,dinlenme:7.5,toparlanma:5.75,hafif:5.25,yogun:7.5},yogunKesinti:0.6,   /* S-a kalibrasyonu (2026-10-27): ilk değerlerin ×1,25'i */
  yuk:{toparlanma:0.4,hafif:0.5,yogun:1},
  gelEgri:{18:60,19:60,20:60,21:50,22:40,23:30,24:20,25:12,26:6,27:0,28:0,29:-8,30:-15,31:-22,32:-30,33:-40,34:-50},
  gelSok:40,gelYukNominal:3.9,gelYukSinir:[0.8,1.2],gelOynama:[0.7,0.3],gelYuvaEk:0.03,gelAlt:10,
  potansiyel:[[21,20],[24,10],[27,4],[99,0]],tavanEn:95,
  dususYuva:[[0,0.4],[9,0.35],[4,0.1],[5,0.1],[3,0.05]],dususYuvaKL:[[8,0.5],[0,0.3],[9,0.2]]};
const ANTRENMAN_TARZ_YUK={dengeli:0.9,konumsal:1,iliskisel:1,kanatOrta:1,dikey:1.15,direkt:1.1};   // yalnız yoğun günü ölçekler (TEST)
const oyuncuHaftasiAcik=()=>!OYUNCU_HAFTA_TEST.kapali;

/* ---- antrenman programı (saf; saklanmaz) ---- */
const OH_FIKSTUR_GUNLERI=new WeakMap();
const ohHaftaGunu=t=>(gunNo(t)+4)%7;   // 0 = Pazar (js/gozlem.js gunNo)
/* kulübün fikstür günleri (devralınan haftalar dahil), artan sırayla */
function kulupMacGunleri(k,kulupId){
  const F=k.fikstur;if(!Array.isArray(F)||!kulupId)return[];
  let M=OH_FIKSTUR_GUNLERI.get(F);
  if(!M){M=new Map();for(const f of F)for(const id of [f.ev,f.konuk]){if(!M.has(id))M.set(id,[]);M.get(id).push(f.tarih);}
    for(const L of M.values())L.sort();OH_FIKSTUR_GUNLERI.set(F,M);}
  return M.get(kulupId)||[];
}
/* günün türü ve yükü {tur:'mac'|'dinlenme'|'hafif'|'toparlanma'|'yogun', yuk} */
function antrenmanProgrami(k,kulupId,tarih){
  const G=kulupMacGunleri(k,kulupId),Y=OYUNCU_HAFTA_TEST.yuk;
  if(G.includes(tarih))return{tur:'mac',yuk:0};
  const hg=ohHaftaGunu(tarih);
  if(hg===0||hg===6)return{tur:'dinlenme',yuk:0};
  const sonraki=G.find(t=>t>tarih);
  if(!sonraki||sonraki===tarihEkle(tarih,1))return{tur:'hafif',yuk:Y.hafif};
  let onceki=null;for(const t of G){if(t<tarih)onceki=t;else break;}
  if(onceki){let haftaIci=false;for(let t=tarihEkle(onceki,1);t<tarih;t=tarihEkle(t,1)){const g=ohHaftaGunu(t);if(g!==0&&g!==6){haftaIci=true;break;}}
    if(!haftaIci)return{tur:'toparlanma',yuk:Y.toparlanma};}
  const h=typeof kulupHocasi==='function'?kulupHocasi(k,kulupId):null,tarz=h&&h.hoca?h.hoca.tarz:'dengeli';
  return{tur:'yogun',yuk:Y.yogun*(ANTRENMAN_TARZ_YUK[tarz]||1)};
}
/* (bas, bit] günlerinin yük toplamı */
function antrenmanYuku(k,kulupId,bas,bit){let s=0;for(let t=tarihEkle(bas,1);t<=bit;t=tarihEkle(t,1))s+=antrenmanProgrami(k,kulupId,t).yuk;return s;}

/* ---- kondisyon (saf) ---- */
const ohToparlanmaCarpani=(p,tarih)=>{const d=p.oz[9]/100,y=oyuncuYasi(p,tarih);return Math.max(0.5,1+(d-0.65)*0.6-Math.max(0,y-28)*0.04+Math.max(0,23-y)*0.02);};
/* oyuncunun o günkü kondisyonu (0–100, tamsayı): son maç çapasından her günün toparlanması; sakatken toparlanma yok */
function oyuncuKondisyonu(k,p,tarih){
  const h=p&&p.hal,T=OYUNCU_HAFTA_TEST;if(!h)return 100;
  if(tarih<=h.gun)return h.kon;
  if(gunNo(tarih)-gunNo(h.gun)>T.uzunCapa)return 100;
  let kon=h.kon;
  for(let t=tarihEkle(h.gun,1);t<=tarih;t=tarihEkle(t,1)){
    if(p.sakat&&tarihKarsilastir(t,p.sakat.donus)<0)continue;
    const P=antrenmanProgrami(k,p.kulupId,t),taban=P.tur==='yogun'?T.toparlanma.yogun*(1-T.yogunKesinti*P.yuk):T.toparlanma[P.tur];
    kon=Math.min(100,kon+taban*ohToparlanmaCarpani(p,t));
  }
  return Math.round(kon);
}
/* maçta oynanan dakikanın kondisyon düşüşü (dayanıksız ve yaşlı daha çok; kalecide az) */
function kondisyonDususu(p,dk,tarih){
  const T=OYUNCU_HAFTA_TEST,d=p.oz[9]/100,y=oyuncuYasi(p,tarih);
  return T.dusus90*dk/90*(1+(0.65-d)*0.8+Math.max(0,y-29)*0.03)*(p.mevki==='KL'?T.kaleciPay:1);
}

/* ---- form (gizli; maçtan maça yavaş: AR(1), tohumlu küçük sarsıntı; maç olayından beslenmez) ---- */
const oyuncuFormu=p=>p&&p.hal?p.hal.form:0;
function formAdim(k,p,macId){const T=OYUNCU_HAFTA_TEST;return clamp(Math.round(T.formAr*oyuncuFormu(p)+T.formSok*hocaZar(k.dunyaTohumu,`${p.id}:form:${macId}`)),-100,100);}

/* ---- maç girdisi çarpanı: kondisyon hız ve dayanıklılığa, form teknik ve zihinsel yuvalara (kalecide kaleciliğe de); oz'a yazılmaz ---- */
function macOzu(k,p,tarih){
  if(!oyuncuHaftasiAcik())return p.oz.slice();
  const T=OYUNCU_HAFTA_TEST,kon=oyuncuKondisyonu(k,p,tarih),form=oyuncuFormu(p);
  const ck=1-T.konEnCok*clamp((T.konEsik-kon)/T.konAralik,0,1),cf=1+T.formEnCok*clamp(form/T.formOlcek,-1,1);
  if(ck===1&&cf===1)return p.oz.slice();
  const o=p.oz.slice(),r2=x=>Math.round(x*100)/100;
  for(const j of T.konYuva)o[j]=r2(o[j]*ck);
  for(const j of T.formYuva)o[j]=r2(o[j]*cf);
  if(p.mevki==='KL')o[8]=r2(o[8]*cf);
  return o;
}

/* ---- maçta oynanan dakikalar: on bir 0. dakikada başlar; değişiklik (adla, tekil eşleme), kırmızı ya da ikinci sarı ve değişikliksiz çıkış
   sakatlığı oyuncuyu o dakikada çıkarır; en çok 90, giren en az 1. Hükmende (ilk11 null) boş ---- */
function macDakikalari(k,f,x){
  const D=new Map();if(!x||!Array.isArray(x.ilk11))return D;
  [0,1].forEach(t=>{
    const kulup=t===0?f.ev:f.konuk,ilk=x.ilk11[t]||[],saha=new Set(ilk),giris=new Map(ilk.map(id=>[id,0])),cikis=new Map(),girdi=new Set(ilk);
    const kadro=typeof kulupOyunculari==='function'?kulupOyunculari(k,kulup):[];
    const olaylar=[];
    for(const d of x.degisiklikler||[])if(d.takim===t)olaylar.push({dk:d.dk|0,tur:'d',d});
    for(const c of x.kartlar||[])if(c.takim===t&&(c.renk==='kirmizi'||c.renk==='ikinciSari'))olaylar.push({dk:c.dk|0,tur:'k',id:c.id});
    olaylar.sort((a,b)=>a.dk-b.dk);
    for(const o of olaylar){
      if(o.tur==='k'){if(o.id&&saha.has(o.id)){saha.delete(o.id);cikis.set(o.id,o.dk);}continue;}
      /* R3-a: kayıt kimlik taşıyorsa kimlikle (aynı adlı iki oyuncuda da doğru), yoksa adla (eski kayıt ve maç anındaki sonuç) */
      const cikan=o.d.cikanId&&saha.has(o.d.cikanId)?[o.d.cikanId]:[...saha].filter(id=>(k.oyuncular[id]||{}).ad===o.d.cikan),
        giren=o.d.girenId&&k.oyuncular[o.d.girenId]&&!girdi.has(o.d.girenId)?[k.oyuncular[o.d.girenId]]:kadro.filter(p=>p.ad===o.d.giren&&!girdi.has(p.id));
      if(cikan.length!==1||giren.length!==1)continue;
      saha.delete(cikan[0]);cikis.set(cikan[0],o.dk);saha.add(giren[0].id);girdi.add(giren[0].id);giris.set(giren[0].id,o.dk);
    }
    for(const s of x.sakatliklar||[])if(s.takim===t&&s.derece==='cikis'&&s.id&&saha.has(s.id)){saha.delete(s.id);cikis.set(s.id,s.dk|0);}
    for(const [id,g] of giris){const c=cikis.has(id)?cikis.get(id):90,dk=Math.min(90,Math.max(0,c)-g);D.set(id,g>0?Math.max(1,dk):Math.max(0,dk));}
  });
  return D;
}

/* ---- gelişim (haftalık, kalıcı; oz'a tamsayı adımla) ---- */
/* gelişim ölçüsü: sahada kalecilik dışı on özelliğin ortalaması; kalecide 0,6·kalecilik + 0,4·öbürleri (js/sozlesme.js maasTahmini tarifi) */
function gelisimOrt(p){const o=p.oz,s=o.filter((_,j)=>j!==8),ort=s.reduce((a,b)=>a+b,0)/s.length;return p.mevki==='KL'?0.6*o[8]+0.4*ort:ort;}
/* gizli tavan: bugünkü ölçü + yaşa göre pay × u² (çoğunun payı küçük; garanti yok) */
function tavanKur(k,p,tarih){
  const T=OYUNCU_HAFTA_TEST,y=oyuncuYasi(p,tarih),G=(T.potansiyel.find(([s])=>y<=s)||[0,0])[1],u=kadroRastgele(k.dunyaTohumu,`${p.id}:tavan`)();
  return clamp(Math.min(T.tavanEn,Math.round(gelisimOrt(p)+G*u*u)),1,99);
}
/* bir maç kaydının gelişim adımı: {oz, gel} (oz değişmediyse aynı dizi). dk: bu maçta oynanan; yuk: önceki maçtan bu maça antrenman yükü */
function ohGelisimAdimi(k,p,f,dk,yuk,gel,tav){
  const T=OYUNCU_HAFTA_TEST,y=clamp(oyuncuYasi(p,f.tarih),18,34);
  let d=T.gelEgri[y]+T.gelSok*hocaZar(k.dunyaTohumu,`${p.id}:gel:${f.id}`);
  if(d>0)d*=clamp(yuk/T.gelYukNominal,T.gelYukSinir[0],T.gelYukSinir[1])*(T.gelOynama[0]+T.gelOynama[1]*Math.min(1,dk/90));
  if(gelisimOrt(p)>=tav)d=Math.min(d,0);
  gel+=Math.round(d);let oz=p.oz;
  if(gel>=100){
    const kl=p.mevki==='KL',h=typeof kulupHocasi==='function'?kulupHocasi(k,p.kulupId):null,ek=!kl&&h&&h.hoca?HOCA_TARZ_AGIRLIK[h.hoca.tarz]||{}:{};
    const w=HOCA_ROL[HOCA_HAT_ROLU[p.mevki]].w,L=[];
    for(let j=0;j<11;j++){if((!kl&&j===8)||p.oz[j]>=99)continue;L.push([j,w[j]+(ek[j]||0)+T.gelYuvaEk]);}
    if(L.length){const j=agirlikliSec(kadroRastgele(k.dunyaTohumu,`${p.id}:yuva:${f.id}`),L);oz=p.oz.slice();oz[j]+=1;}
    gel-=100;
  }else if(gel<=-100){
    const L=(p.mevki==='KL'?T.dususYuvaKL:T.dususYuva).filter(([j])=>p.oz[j]>T.gelAlt);
    if(L.length){const j=agirlikliSec(kadroRastgele(k.dunyaTohumu,`${p.id}:yuva:${f.id}`),L);oz=p.oz.slice();oz[j]-=1;}
    gel+=100;
  }
  return{oz,gel:clamp(gel,-99,99)};
}

/* ---- yazım (js/mac-sonuc.js MAC_KAYDI_EKLERI): iki kulübün her oyuncusu; p maç öncesi kayıt, q bu maçın kopyası ---- */
function oyuncuHaftasiYaz(k,f,x){
  const dak=macDakikalari(k,f,x),acik=oyuncuHaftasiAcik(),T=OYUNCU_HAFTA_TEST;
  for(const kulup of [f.ev,f.konuk]){
    const G=kulupMacGunleri(k,kulup);let onceki=null;for(const t of G){if(t<f.tarih)onceki=t;else break;}
    const yuk=acik?antrenmanYuku(k,kulup,onceki||tarihEkle(f.tarih,-7),f.tarih):0;
    for(const p of kulupOyunculari(k,kulup)){
      const q=x.al(p.id),dk=dak.get(p.id)||0;
      if(dk>0&&Number.isInteger(q.mac)&&Number.isInteger(q.dk)){q.mac=Math.min(99,q.mac+1);q.dk=Math.min(9999,q.dk+dk);}
      if(!acik)continue;
      const kon0=oyuncuKondisyonu(k,p,f.tarih);
      let kon=dk?Math.max(0,Math.round(kon0-kondisyonDususu(p,dk,f.tarih))):kon0;
      if(x.yeniSakat&&x.yeniSakat.has(p.id)&&q.sakat)kon=Math.max(0,kon-Math.min(T.sakatEksik,gunNo(q.sakat.donus)-gunNo(f.tarih)));
      const tav=p.hal&&Number.isInteger(p.hal.tav)?p.hal.tav:tavanKur(k,p,f.tarih);
      const g=ohGelisimAdimi(k,Object.assign({},p,{oz:q.oz}),f,dk,yuk,p.hal?p.hal.gel:0,tav);
      if(g.oz!==q.oz)q.oz=g.oz;
      q.hal={kon,gun:f.tarih,form:formAdim(k,p,f.id),gel:g.gel,tav};
    }
  }
}
MAC_KAYDI_EKLERI.push(oyuncuHaftasiYaz);

/* ---- S-b: balkon sinyallerinin çekirdek türleri (js/gozlem.js GOZLEM_SINYALLERI; eşikler TEST) ---- */
const ohSakatMi=(p,t)=>!!(p.sakat&&tarihKarsilastir(t,p.sakat.donus)<0);
Object.assign(GOZLEM_SINYALLERI,{
  donus:{oncelik:4,sec:(k,p,t)=>{if(!p.sakat)return null;const f=gunNo(p.sakat.donus)-gunNo(t);if(Math.abs(f)>3)return null;return f<=0?{siddet:1}:{siddet:1,alt:'ayri'};}},
  yorgun:{oncelik:3,gunler:['toparlanma','yogun'],sec:(k,p,t)=>{if(ohSakatMi(p,t))return null;const v=oyuncuKondisyonu(k,p,t);return v<80?{siddet:80-v}:null;}},
  parlayan:{oncelik:2,sec:(k,p,t)=>{if(ohSakatMi(p,t)||!p.hal||oyuncuYasi(p,t)>21||gelisimOrt(p)>=p.hal.tav)return null;return p.hal.form>=20||p.hal.gel>=50?{siddet:Math.max(p.hal.form,p.hal.gel)}:null;}},
  formDusuk:{oncelik:1,sec:(k,p,t)=>{if(ohSakatMi(p,t)||!p.hal||p.hal.form>-20)return null;const D=(k.kulupler[p.kulupId]||{}).kadro;return D&&D.ilk11.includes(p.id)?{siddet:-p.hal.form}:null;}}
});
const ohAd=(k,p)=>(k.oyuncular[p.oyuncuId]||{}).ad||'—';
Object.assign(MESELE_OLAYLARI,{
  'gozlem.donus':(k,p)=>`TEST: ${ohAd(k,p)} sakatlıktan sonra takımla çalıştı.`,
  'gozlem.donusAyri':(k,p)=>`TEST: ${ohAd(k,p)} takımdan ayrı çalıştı.`,
  'gozlem.yorgun':(k,p)=>`TEST: ${ohAd(k,p)} koşularda geride kaldı.`,
  'gozlem.parlayan':(k,p)=>`TEST: ${ohAd(k,p)} çalışmada göze battı.`,
  'gozlem.formDusuk':(k,p)=>`TEST: ${ohAd(k,p)} durgun görünüyor.`
});

/* ---- doğrulama (EK_DENETIMLER): hal ve tarihe bağlı alan; kayda ait denetim dondurulmuş oyuncu başına bir kez ---- */
const OH_DENETLENDI=new WeakSet();
function oyuncuHaftaDogrula(k,h){
  const O=k.oyuncular;if(!O||typeof O!=='object')return;
  const tam=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
  for(const [id,p] of Object.entries(O)){
    if(!p||p.hal===undefined)continue;
    const H=p.hal,ad=`Oyuncu ${id}`;
    if(!H||typeof H!=='object'||Array.isArray(H)){h.push(`${ad}: hal kaydı nesne değil`);continue;}
    if(tarihGecerliMi(k.tarih)&&tarihGecerliMi(H.gun)&&H.gun>k.tarih)h.push(`${ad}: hal günü bugünden sonra`);
    if(OH_DENETLENDI.has(p))continue;
    const once=h.length;
    if(!tam(H.kon,0,100))h.push(`${ad}: kondisyon 0–100 tamsayı değil`);
    if(!tam(H.form,-100,100))h.push(`${ad}: form −100…100 tamsayı değil`);
    if(!tam(H.gel,-99,99))h.push(`${ad}: gelişim birikimi −99…99 tamsayı değil`);
    if(!tam(H.tav,1,99))h.push(`${ad}: tavan 1–99 tamsayı değil`);
    if(!tarihGecerliMi(H.gun))h.push(`${ad}: hal günü geçersiz`);
    if(h.length===once&&typeof DONMUS!=='undefined'&&DONMUS.has(p))OH_DENETLENDI.add(p);
  }
}
EK_DENETIMLER.push(oyuncuHaftaDogrula);
