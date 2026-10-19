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
      [`${T}: pas / sahiplik`,'kkPasSah'+t,2]];})),
  yeni:()=>{
    const KV=[{n:0,kisa:0,k:{},uc:0,sut:0,kayip:0},{n:0,kisa:0,k:{},uc:0,sut:0,kayip:0}];for(const X of KV)for(const k of KK_KAT)X.k[k]=0;
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
        return r;}
    };
    function bitirIz(){const X=KV[iz.t];if(iz.uc)X.uc++;if(iz.sut)X.sut++;if(iz.kayip)X.kayip++;iz=null;}
  }
};
