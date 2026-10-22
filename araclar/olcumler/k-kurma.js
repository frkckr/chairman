'use strict';
/* ============ Z3-0 (2026-10-19 gece): oyun kurma, kalecinin dağıtımı ve takımın tarzı — FUTBOL_KUTUPHANESI §12.2 (Z3), kutuphane/A-oyun-kurma.md §5,
   kutuphane/G-hoca-tarzlari.md G7.1 ============
   Sözleşme k-duran ile aynı: rastlantı çekmez, motor yöntemi çağırmaz, oyuncuya ve topa yazmaz. Takım başına (0 ev, 1 konuk) satırlar: iki canlı
   arketip (Z3) locadan ayırt ediliyor mu (G7.1), kale vuruşu kurmayı nasıl başlatıyor (A §5).
   Tanımlar:
   - Kale vuruşu: 'kullanim' olayı tur 'kaleVurusu'. Kısa: hedefi kendi kalesine 40 m'den yakın (Stats Perform tanımı, A §5); kategori (FIFA beş
     kategori, A14): çevrele (alıcı stoper ya da kaleciye 22 m içinde bek), içinden (alıcı orta saha, 40 m içinde), içine (alıcı bek ya da kanat, 22–45 m),
     üstüne (hedef forvet ya da 45 m'den uzak alıcı), ötesine (hedef rakibin sondan ikinci oyuncusunun gerisi). Motor du.kv.kategori yazarsa o okunur.
   - Kale vuruşundan sonra 12 sn (ya da duruş): takım topu son üçte bire taşıdı (sahiplik u > PL/3), şut attı, kendi 40 m'sinde topu kaybetti
     (rakip sahibi, topun u'su kendi kalesine 40 m'den yakın).
   - PPDA (G7.1): rakibin kendi sahasının %60'ında (rakibin u'su < 0,2·PL) verdiği pas ÷ bizim orada top kazanmamız (sahiplik bize geçti; duruş sonrası
     ilk sahiplik ve topun sahipsiz kaldığı kesintiler sayılmaz). Küçük değer yoğun pres.
   - Savunma hattı: topa rakip sahipken ve top orta üçte birdeyken takımın saha oyuncularından en gerideki dördünün (kaleci hariç) ortalama u'su,
     kendi kale çizgisinden (m); 0,5 sn'de bir.
   - Uzun pas: pasın boyu ≥ 32 m (Opta) — takımın pasları içinde pay; pas / sahiplik (sahiplik takım değişince biter). */
/* V1-0b (2026-10-20; FUTBOL_KUTUPHANESI §12.14, V1e): kale vuruşunun vuruşu (iki takım birlikte). Kullanım anında ('kullanim' tur kaleVurusu, vuruş
   eylemi): stil ve ayak (dış: stil dis; zayıf: tek ayaklı kalecide tercih edilmeyen), karar anında |gövde–hedef| (dil.don.a0; yoksa eylemin ilk
   görüldüğü adımdaki gövde), temasta |gövde–top yönü|, karar→temas (e.t; koşu dahil). Duruşta (kale vuruşu) kullanan topun 1,5 m'sinde ve koşu
   noktasının (du.geriX/geriZ) 0,6 m'sinde hız < 0,3 m/sn iken geçen süre; duruşun başından kullanıma (olayın hazirlik'i). Planın kullanımda
   değişmesi (du.kv.degisti; V1e'den önce yok). Kol jesti (Z3a: tk.jest 'kol' hedefli) ile vuruşun hedefi arasındaki açı < 30°: uyumlu. Kısa
   (yerden) kale vuruşunun 20 m'de telafisiz eğrisi (Match.yerEgriSapma, saf). */
const KK_O=require('../olcum-ortak');
const KK_KAT=['cevrele','icinden','icine','ustune','otesine'],KK_KAT_AD={cevrele:'çevrele',icinden:'içinden',icine:'içine',ustune:'üstüne',otesine:'ötesine'};
const KK_PL=52.5;
module.exports={
  bilgi:[['— Z3: oyun kurma ve tarz (k-kurma; Z3-0) —',null,0]]
    .concat(...[0,1].map(t=>{const T=t?'konuk':'ev';return[
      [`${T}: kale vuruşu kısa (40 m) %`,'kkKisa'+t,1],
      ...KK_KAT.map(k=>[`${T}: kale vuruşu ${KK_KAT_AD[k]} %`,'kkK_'+k+t,1]),
      [`${T}: kale vuruşundan 12 sn'de son üçte bir %`,'kkUc'+t,1],[`${T}: kale vuruşundan 12 sn'de şut %`,'kkSut'+t,1],
      [`${T}: kale vuruşundan 12 sn'de kendi 40 m'sinde kayıp %`,'kkKayip'+t,1],
      [`${T}: PPDA`,'kkPPDA'+t,1],[`${T}: savunma hattı (kendi kalesinden m)`,'kkHat'+t,1],[`${T}: uzun pas (≥ 32 m) %`,'kkUzun'+t,1],
      [`${T}: pas / sahiplik`,'kkPasSah'+t,2]];})).concat([
      ['— V1: kale vuruşunun vuruşu (k-kurma; V1-0b; iki takım) —',null,0],
      ['Kale vuruşu kısa: dış ayak %','kkV1KDis',1],['Kale vuruşu kısa: zayıf ayak % (tek ayaklı kaleci)','kkV1KZay',1],['Kale vuruşu: dış ayak % (hepsi)','kkV1Dis',1],
      ['Kale vuruşu kısa: karar anında |gövde–hedef| ortanca (°)','kkV1F0',0],['  %90 (°)','kkV1F90',0],['Kale vuruşu uzun: karar anında |gövde–hedef| %90 (°)','kkV1F90U',0],
      ['Kale vuruşu: temasta |gövde–top yönü| ortanca (°)','kkV1FT',0],
      ['Kale vuruşu kısa: karar→temas ortanca (sn)','kkV1VtK',2],['Kale vuruşu uzun: karar→temas ortanca (sn)','kkV1VtU',2],
      ['Kale vuruşu: top başında hareketsiz ortanca (sn)','kkV1TopBasi',2],['Kale vuruşu: koşu noktasında hareketsiz ortanca (sn)','kkV1Kosu',2],['  %90 (sn)','kkV1Kosu90',2],
      ['Kale vuruşu: duruşun başından kullanıma ortanca (sn)','kkV1Haz',1],
      ['Kale vuruşu: plan kullanımda değişti %','kkV1Degisti',1],['Kale vuruşu: kol jesti hedefle uyumlu (< 30°) %','kkV1Jest',1],
      ['Kale vuruşu kısa: 20 m telafisiz eğri ortanca (m)','kkV1Egri',2]]),
  yeni:()=>{
    const KV=[{n:0,kisa:0,k:{},uc:0,sut:0,kayip:0},{n:0,kisa:0,k:{},uc:0,sut:0,kayip:0}];for(const X of KV)for(const k of KK_KAT)X.k[k]=0;
    /* V1-0b: kale vuruşunun vuruşu */
    const V1=[],KS=new WeakMap();let kvD=null,kvTop=0,kvKos=0,kvJest=null,kvT=-1;
    const PP=[[0,0],[0,0]],HAT=[[0,0],[0,0]],UZ=[[0,0],[0,0]],SAH=[[0,0],[0,0]];
    let iz=null,sonSahip=-1,sonKare=-99,duSonra=false,adimN=0;   /* iz: kale vuruşu izleyicisi {t, t0, uc, sut, kayip} */
    const kat=(m,v)=>{const du=v.du;if(du&&du.kv&&du.kv.kategori)return du.kv.kategori;
      const t=v.takim,d=m.dir[t],h=v.hedef;if(!h)return null;const q=h.alici,hu=h.x*d,L=Math.hypot(h.x-v.x,h.z-v.z);
      let a=-1e9,c=-1e9;for(const o of m.teams[1-t]){if(!o.oyunda)continue;const u=o.x*d;if(u>a){c=a;a=u;}else if(u>c)c=u;}
      if(hu>c+1)return 'otesine';
      if(!q)return L<40?'icinden':'ustune';
      if(q.rol==='FV'||L>45)return 'ustune';
      if(q.rol==='GK'||q.rol==='DEF'&&!q.mevki.bek||q.mevki.bek&&L<22)return 'cevrele';
      if(q.rol==='OS'&&!q.mevki.kanat&&L<40)return 'icinden';
      return 'icine';};
    return{
      dinle(ad,v,m){
        if(!m||!v)return;
        if(ad==='kullanim'&&v.tur==='kaleVurusu'&&v.p&&v.p.eylem&&v.p.eylem.ad==='vurus'){const p=v.p,e=p.eylem,b=m.ball,sec=e.sec||{},D=e.dil;
          const f0=D&&D.don?Math.abs(D.don.a0):KS.has(e)?Math.abs(KS.get(e)):NaN,kisa=(sec.tip||'yer')==='yer';
          let jest=null;if(kvJest&&sec.hx!=null){const ah=Math.atan2(sec.hz-b.z,sec.hx-b.x),aj=Math.atan2(kvJest.z-b.z,kvJest.x-b.x);jest=Math.abs(KK_O.aciFark(ah,aj))<0.52;}
          V1.push({kisa,dis:e.stil==='dis',zay:p.ayak!=='iki'&&e.ayak!==p.ayak,f0,fT:Math.abs(KK_O.aciFark(Math.atan2(b.vz,b.vx),p.yon)),vt:e.t,
            top:kvD===v.du?kvTop:null,kos:kvD===v.du?kvKos:null,haz:v.hazirlik,deg:v.du&&v.du.kv&&v.du.kv.degisti!=null?!!v.du.kv.degisti:null,jest,
            egri:kisa&&m.yerEgriSapma?Math.abs(m.yerEgriSapma(b.x,b.z,b.vx,b.vz,b.egri||0,20)):null});}
        if(ad==='kullanim'&&v.tur==='kaleVurusu'){const t=v.takim,X=KV[t];X.n++;const d=m.dir[t],h=v.hedef;
          if(h&&h.x*d<-KK_PL+40)X.kisa++;else if(!h&&v.alt==='kisa')X.kisa++;
          const k=kat(m,v);if(k)X.k[k]++;
          iz={t,t0:m.t,uc:false,sut:false,kayip:false};duSonra=true;return;}
        if(ad==='pass'||ad==='gkkick'){const P=m.ball.pas;if(P&&P.takim!=null&&P.p===v.p){const t=P.takim;UZ[t][1]++;if(P.L>=32)UZ[t][0]++;SAH[t][0]++;
          /* PPDA: rakibin (t) kendi sahasının %60'ında verdiği pas */
          if(m.phase==='play'&&P.x0*m.dir[t]<0.2*KK_PL)PP[1-t][0]++;}}
        if(iz&&(ad==='shot'||ad==='header'&&v.shot)&&v.p&&v.p.team===iz.t)iz.sut=true;
      },
      adim(m){
        const b=m.ball,s=b.sahip,t=s&&s.team!=null?s.team:-1;adimN++;
        /* V1-0b: kale vuruşu duruşunda kullananın hareketsiz süreleri ve kol jesti; vuruş eyleminin ilk görüldüğü adımda gövde–hedef açısı */
        {const du=m.phase==='durus'?m.durus:null,dt=kvT>=0?Math.max(0,Math.min(0.1,m.t-kvT)):0;kvT=m.t;
          if(du&&du.tur==='kaleVurusu'){if(kvD!==du){kvD=du;kvTop=0;kvKos=0;kvJest=null;}const tk=du.kullanan;
            if(tk){if(Math.hypot(tk.vx,tk.vz)<0.3){if(Math.hypot(tk.x-du.x,tk.z-du.z)<1.5)kvTop+=dt;else if(du.geriX!=null&&Math.hypot(tk.x-du.geriX,tk.z-du.geriZ)<0.6)kvKos+=dt;}
              if(tk.jest&&tk.jest.tur==='kol'&&tk.jest.hedef)kvJest={x:tk.jest.hedef.x,z:tk.jest.hedef.z};
              const e=tk.eylem;if(e&&e.ad==='vurus'&&!KS.has(e)&&e.sec)KS.set(e,KK_O.aciFark(Math.atan2(e.sec.hz-b.z,e.sec.hx-b.x),tk.yon));}}}
        if(m.phase!=='play'){duSonra=true;sonSahip=-1;}
        else if(t>=0){
          if(t!==sonSahip){if(sonSahip>=0&&!duSonra){const u=b.x*m.dir[t];if(u>-0.2*KK_PL)PP[t][1]++;}   /* rakip sahasının %60'ında kazanım (t'nin çerçevesinde u > −0,2·PL) */
            SAH[t][1]++;sonSahip=t;duSonra=false;}}
        if(iz){const d=m.dir[iz.t];
          if(m.phase!=='play'&&m.t-iz.t0>1)iz=null;
          else if(m.t-iz.t0>12){bitirIz();}
          else if(t===iz.t&&b.x*d>KK_PL/3)iz.uc=true;
          else if(t===1-iz.t&&b.x*d<-KK_PL+40)iz.kayip=true;}
        if(adimN%30===0&&m.phase==='play'&&t>=0&&Math.abs(b.x)<KK_PL/3){const o=1-t,d=m.dir[o],L=[];   /* orta üçte bir: hattın yeri topun derinliğinden ayrılsın */for(const p of m.teams[o]){if(p.oyunda&&p.rol!=='GK')L.push(p.x*d);}
          if(L.length>=4){L.sort((a,c)=>a-c);HAT[o][0]+=(L[0]+L[1]+L[2]+L[3])/4+KK_PL;HAT[o][1]++;}}
      },
      bitir(){
        if(iz)bitirIz();
        const r={ham:{}};
        for(let t=0;t<2;t++){const X=KV[t];
          r.ham['kkKisa'+t]=[X.kisa,X.n];for(const k of KK_KAT)r.ham['kkK_'+k+t]=[X.k[k],X.n];
          r.ham['kkUc'+t]=[X.uc,X.n];r.ham['kkSut'+t]=[X.sut,X.n];r.ham['kkKayip'+t]=[X.kayip,X.n];
          r.ham['kkPPDA'+t]=[PP[t][0],100*PP[t][1]];r.ham['kkHat'+t]=[HAT[t][0],100*HAT[t][1]];r.ham['kkUzun'+t]=[UZ[t][0],UZ[t][1]];
          r.ham['kkPasSah'+t]=[SAH[t][0],100*SAH[t][1]];}
        /* V1-0b */
        const Ks=V1.filter(x=>x.kisa),Ku=V1.filter(x=>!x.kisa),y=(L,f)=>[L.filter(f).length,L.length],o=KK_O.ortanca,dr=180/Math.PI;
        r.ham.kkV1KDis=y(Ks,x=>x.dis);r.ham.kkV1KZay=y(Ks,x=>x.zay);r.ham.kkV1Dis=y(V1,x=>x.dis);
        const D=V1.filter(x=>x.deg!=null),J=V1.filter(x=>x.jest!=null);r.ham.kkV1Degisti=y(D,x=>x.deg);r.ham.kkV1Jest=y(J,x=>x.jest);
        r.kkV1F0=o(Ks.map(x=>x.f0*dr));r.kkV1F90=KK_O.yuzde(Ks.map(x=>x.f0*dr),0.9);r.kkV1F90U=KK_O.yuzde(Ku.map(x=>x.f0*dr),0.9);r.kkV1FT=o(V1.map(x=>x.fT*dr));
        r.kkV1VtK=o(Ks.map(x=>x.vt));r.kkV1VtU=o(Ku.map(x=>x.vt));r.kkV1TopBasi=o(V1.map(x=>x.top));r.kkV1Kosu=o(V1.map(x=>x.kos));r.kkV1Kosu90=KK_O.yuzde(V1.map(x=>x.kos),0.9);
        r.kkV1Haz=o(V1.map(x=>x.haz));r.kkV1Egri=o(Ks.map(x=>x.egri));
        const r2=x=>x!=null&&x===x?Math.round(x*100)/100:null;
        r._kkV1=V1.map(x=>({kisa:x.kisa,dis:x.dis,zay:x.zay,f0:r2(x.f0*dr),fT:r2(x.fT*dr),vt:r2(x.vt),top:r2(x.top),kos:r2(x.kos),haz:r2(x.haz),egri:r2(x.egri)}));
        return r;}
    };
    function bitirIz(){const X=KV[iz.t];if(iz.uc)X.uc++;if(iz.sut)X.sut++;if(iz.kayip)X.kayip++;iz=null;}
  },
  /* V1-0b: kale vuruşunun vuruşu, havuzlanmış (bütün maçlar) */
  ozet(sonuclar){
    const L=[].concat(...sonuclar.map(s=>s._kkV1||[]));if(!L.length)return;
    const f=x=>x===x&&x!=null?x.toFixed(2):'—',P3=a=>{const b=a.filter(x=>x!=null);return `${f(KK_O.yuzde(b,0.1))} / ${f(KK_O.yuzde(b,0.5))} / ${f(KK_O.yuzde(b,0.9))}`;};
    for(const [ad,K] of[['kısa',L.filter(x=>x.kisa)],['uzun',L.filter(x=>!x.kisa)]]){if(!K.length)continue;
      console.log(`\n  V1 (k-kurma): kale vuruşu ${ad} n ${K.length} — dış ${K.filter(x=>x.dis).length} · zayıf ${K.filter(x=>x.zay).length} · %10 / %50 / %90: karar anında |gövde–hedef| ${P3(K.map(x=>x.f0))}° · temasta ${P3(K.map(x=>x.fT))}° · karar→temas ${P3(K.map(x=>x.vt))} sn`);
      console.log(`  top başında hareketsiz ${P3(K.map(x=>x.top))} sn · koşu noktasında ${P3(K.map(x=>x.kos))} sn · duruşun başından kullanıma ${P3(K.map(x=>x.haz))} sn${ad==='kısa'?' · 20 m eğri '+P3(K.map(x=>x.egri))+' m':''}`);}
  }
};
