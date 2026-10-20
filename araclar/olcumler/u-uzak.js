'use strict';
/* ============ V1-0b (2026-10-20; FUTBOL_KUTUPHANESI §12.14, V1d, kutuphane/J J.10): uzaklaştırma ============
   Sözleşme b-olcum ile aynı: rastlantı çekmez, motora ve topa yazmaz; olayları, eylemi (p.eylem.sec, dil) ve topu okur, topun yolunu bir kopyada
   (O.ucus, topFizikAdim) yürütür. Tanımlar:
   - Ayakla uzaklaştırma: 'clear' olayı (vuruş eylemi, sec.tur 'uzaklastir'). Kafayla: 'header' olayı tur 'uzaklastir'. Kurtarış topu: 'pass' olayı
     sec.alt 'kurtar' (V1d; o güne dek 0).
   - Tür: sec.uz (V1d: ileri | ters | acil | tac | cizgi); yoksa bugünkü sınıf — cizgi (T12b: kale çizgisinin dışına), kacti (ayağın kenarından
     kaçış), normal. Karar hedefi saha dışı: sec.hx/hz sahanın dışında. Topun yolu saha dışı: kopya sahadan çıkıyor (oyuncuları bilmez).
   - 5 sn: vuruştan sonra 5 sn içinde top oyun dışına çıktı (taç, korner ya da kale vuruşu duruşu; rakibe: duruşu rakip kullanır; faul ve ofsayt sayılmaz) ve topa ilk dokunan (biz / rakip; vuranın
     kendisi sayılmaz). Kendi 30 m'si dışı: vuruş anında topun kendi kale çizgisine uzaklığı > 30 m.
   - Adım: dil.adim.n (V1b'den önce yalnız açma dokunuşu; uzaklaştırmada 0). Adımsız menzil: n = 0 iken topun ilk inişine uzaklık. Hazırlık:
     e.hazirlikEn (asgari hazırlık; tasarımdaki "hazırlık ortancası 0,037") ve e.hazirlikT (hazırlıktan geri salınıma geçiş anı).
   - Başlayıp vurulamayan: sec.tur 'uzaklastir' olan vuruş eylemi başladı (ilk görüldüğü adım), 'clear' olmadı. Bloklanan: vuruştan sonra 0,6 sn
     içinde rakibin dokunuşu topun vuruş noktasından 4 m içinde ya da 'block' olayı uzun:true (V1b).
   - Değer − en iyi diğer: sec.deger − sec.enDiger (kararVer0; V1-0b'de salt okunur eklendi).
   - Kaleciye geri pas: kendi 30 m'sinde saha oyuncusunun kendi kalecisine (alıcı) pas olayı; değeri sec.deger; tamamlanan: kaleci topa ilk dokunan;
     kaleye doğru: pasın doğrultusu kaleci kaçırırsa kale çizgisini direklerin 0,5 m içinde keser.
   - Planlanan Pb (V1d sec.Pb) ↔ gerçekleşen blok: Pb verilen uzaklaştırmalarda. */
const O=require('../olcum-ortak');
const UZ_TUR=['normal','kacti','cizgi','ileri','ters','acil','tac'],UZ_TURAD={normal:'normal',kacti:'kaçtı (ayağın kenarı)',cizgi:'çizgiye (korner)',ileri:'ileri',ters:'ters kanat',acil:'acil',tac:'taç'};
module.exports={
  bilgi:[
    ['— V1: uzaklaştırma (u-uzak; V1-0b) —',null,0],
    ['Ayakla uzaklaştırma / maç','uAyak',2],['Kafayla uzaklaştırma / maç','uKafa',2],['Kurtarış topu (alıcılı) / maç','uKurtar',2],
    ...UZ_TUR.map(k=>[`Ayak: tür ${UZ_TURAD[k]} %`,'uT_'+k,1]),
    ['Ayak: karar hedefi saha dışı %','uHedefDis',1],['Ayak: topun yolu saha dışı %','uYolDis',1],['  havada çıkan %','uYolDisH',1],
    ['Ayak: 5 sn içinde oyun dışı %','uDis5',1],['  rakibe duran top (taç, korner) %','uDis5R',1],
    ['Ayak: 5 sn içinde ilk dokunan biz %','uIlkBiz',1],['  ilk dokunan rakip %','uIlkRakip',1],
    ['Kafa: 5 sn içinde oyun dışı %','uKDis5',1],['Kafa: ilk dokunan biz %','uKIlkBiz',1],['  ilk dokunan rakip %','uKIlkRakip',1],
    ['Ayak: kendi 30 m\'si dışında %','uDis30',1],['Kafa: kendi 30 m\'si dışında %','uKDis30',1],
    ['Ayak: adım 0 %','uAdim0',1],['  adım 1 %','uAdim1',1],['  adım 2 %','uAdim2',1],
    ['Ayak: adımsız menzil (iniş) %90 (m)','uMenzil0',1],
    ['Ayak: asgari hazırlık ortanca (sn; hazirlikEn)','uHaz',3],['Ayak: hazırlık → geri ortanca (sn)','uHazT',2],['Ayak: karar→temas ortanca (sn)','uVt',2],
    ['Başlayıp vurulamayan uzaklaştırma %','uBasVur',1],['Bloklanan uzaklaştırma %','uBlok',1],
    ['Ayak: çıkış hızı ortanca (m/sn)','uV0',1],['Ayak: iniş uzaklığı ortanca (m)','uInis',1],['Ayak: tepe ortanca (m)','uTepe',1],
    ['Kafa: tepe ortanca (m)','uKTepe',1],['Kafa: tepe > 8 m %','uKTepe8',1],
    ['Ayak: değer − en iyi diğer ortanca','uFark',2],
    ['Kaleciye geri pas (kendi 30 m\'si) / maç','uGk',2],['  değeri ortanca','uGkDeger',2],['  tamamlanan %','uGkTamam',1],['  kaleye doğru (kaçarsa kale) %','uGkKale',1],
    ['Planlanan blok Pb ortalaması %','uPb',1],['  gerçekleşen blok (Pb verilenlerde) %','uPbGercek',1]
  ],
  yeni:(ctx)=>{
    const F=O.bagla(ctx),PL=F?F.PL:52.5,PW=F?F.PW:68,MZ=F?F.MZ:34,GW2=F?F.GW2:3.66;
    const A=[],K=[],U={kurtar:0,baslayan:0,gk:[],gkN:0,gkTamam:0,gkKale:0},aktif=[],gkAktif=[];
    const baslar=new WeakSet();
    const kayit=(m,p,kafa,e)=>{const b=m.ball,d=m.dir[p.team],sec=e&&e.sec||{},D=e&&e.dil,f=O.ucus(F,m,b);
      const r={kafa,team:p.team,p,t:m.t,x:b.x,z:b.z,u:b.x*d+PL,v0:Math.hypot(b.vx,b.vy,b.vz),tepe:f.tepe,inis:f.inis,cik:f.cik,
        tur:sec.uz||(sec.cizgi?'cizgi':sec.kacti?'kacti':'normal'),hedefDis:sec.hx!=null&&(Math.abs(sec.hx)>PL||sec.hz<0||sec.hz>PW),
        n:D&&D.adim?D.adim.n:0,haz:e?e.hazirlikEn:null,hazT:e?e.hazirlikT:null,vt:e?e.t:null,fark:sec.deger!=null&&sec.enDiger!=null?sec.deger-sec.enDiger:null,
        Pb:sec.Pb!=null?sec.Pb:null,son:null,ilk:null,blok:false};
      (kafa?K:A).push(r);aktif.push(r);};
    return{
      dinle(ad,v,m){if(!m||!v)return;
        if(ad==='clear'&&v.p){const e=v.p.eylem;if(e&&e.ad==='vurus')kayit(m,v.p,false,e);}
        else if(ad==='header'&&v.p&&v.tur==='uzaklastir')kayit(m,v.p,true,null);
        else if(ad==='pass'&&v.p){const p=v.p,e=p.eylem,sec=e&&e.ad==='vurus'?e.sec:null;
          if(sec&&sec.alt==='kurtar')U.kurtar++;
          const q=sec&&sec.alici;
          if(q&&q.rol==='GK'&&q.team===p.team&&p.rol!=='GK'&&!sec.duran){const d=m.dir[p.team],b=m.ball;
            if(b.x*d+PL<30){U.gkN++;if(sec.deger!=null)U.gk.push(sec.deger);
              /* kaleye doğru: topun doğrultusu kendi kale çizgisini direklerin 0,5 m içinde keser */
              const gx=-d*PL,vx=b.vx;let kale=false;if(vx*d<-0.3){const tt=(gx-b.x)/vx,zc=b.z+b.vz*tt;kale=tt>0&&Math.abs(zc-MZ)<GW2+0.5;}
              if(kale)U.gkKale++;gkAktif.push({q,p,t:m.t,P:b.pas});}}}
        else if(ad==='block'&&v.uzun){for(const r of aktif)if(!r.blok&&m.t-r.t<0.6&&v.p&&v.p.team!==r.team)r.blok=true;}
      },
      adim(m){const b=m.ball;
        for(const p of m.players){const e=p.eylem;if(e&&e.ad==='vurus'&&e.sec&&e.sec.tur==='uzaklastir'&&!baslar.has(e)){baslar.add(e);U.baslayan++;}}
        for(let i=aktif.length-1;i>=0;i--){const r=aktif[i],dt=m.t-r.t,q=b.sonDokunan;
          if(!r.ilk&&q&&q!==r.p&&dt>0){r.ilk=q.team===r.team?'biz':'rakip';if(r.ilk==='rakip'&&dt<0.6&&Math.hypot(b.x-r.x,b.z-r.z)<4)r.blok=true;}
          if(!r.son&&m.phase!=='play'){const du=m.durus;r.son=m.phase==='goal'?'gol':du&&(du.tur==='tac'||du.tur==='korner'||du.tur==='kaleVurusu')?(du.takim===r.team?'bizDuran':'rakipDuran'):'durdu';}
          if(r.son||dt>=5)aktif.splice(i,1);}
        for(let i=gkAktif.length-1;i>=0;i--){const g=gkAktif[i];let ok=null;
          if(b.pas!==g.P){ok=b.sonDokunan===g.q;}else if(m.phase!=='play'||m.t-g.t>6)ok=false;
          if(ok!==null){if(ok)U.gkTamam++;gkAktif.splice(i,1);}}
      },
      bitir(){
        const y=(L,f)=>[L.filter(f).length,L.length],H={},o=O.ortanca;
        for(const k of UZ_TUR)H['uT_'+k]=y(A,r=>r.tur===k);
        H.uHedefDis=y(A,r=>r.hedefDis);H.uYolDis=y(A,r=>!!r.cik);H.uYolDisH=y(A,r=>!!(r.cik&&r.cik.havada));
        H.uDis5=y(A,r=>r.son==='bizDuran'||r.son==='rakipDuran');H.uDis5R=y(A,r=>r.son==='rakipDuran');H.uIlkBiz=y(A,r=>r.ilk==='biz');H.uIlkRakip=y(A,r=>r.ilk==='rakip');
        H.uKDis5=y(K,r=>r.son==='bizDuran'||r.son==='rakipDuran');H.uKIlkBiz=y(K,r=>r.ilk==='biz');H.uKIlkRakip=y(K,r=>r.ilk==='rakip');
        H.uDis30=y(A,r=>r.u>30);H.uKDis30=y(K,r=>r.u>30);
        H.uAdim0=y(A,r=>r.n===0);H.uAdim1=y(A,r=>r.n===1);H.uAdim2=y(A,r=>r.n>=2);
        H.uBasVur=[Math.max(0,U.baslayan-A.length),U.baslayan];H.uBlok=y(A,r=>r.blok);H.uKTepe8=y(K,r=>r.tepe>8);
        H.uGkTamam=[U.gkTamam,U.gkN];H.uGkKale=[U.gkKale,U.gkN];
        const pb=A.filter(r=>r.Pb!=null);H.uPb=[pb.reduce((a,r)=>a+r.Pb,0),pb.length];H.uPbGercek=y(pb,r=>r.blok);
        const sifir=A.filter(r=>r.n===0&&r.inis).map(r=>r.inis.L);
        return{uAyak:A.length,uKafa:K.length,uKurtar:U.kurtar,uMenzil0:O.yuzde(sifir,0.9),uHaz:o(A.map(r=>r.haz)),uHazT:o(A.map(r=>r.hazT)),uVt:o(A.map(r=>r.vt)),
          uV0:o(A.map(r=>r.v0)),uInis:o(A.filter(r=>r.inis).map(r=>r.inis.L)),uTepe:o(A.map(r=>r.tepe)),uKTepe:o(K.map(r=>r.tepe)),uFark:o(A.map(r=>r.fark)),
          uGk:U.gkN,uGkDeger:o(U.gk),ham:H,
          _uUzak:{ayak:A.map(r=>({v0:+r.v0.toFixed(1),inis:r.inis?+r.inis.L.toFixed(1):null,tepe:+r.tepe.toFixed(1),n:r.n,fark:r.fark!=null?+r.fark.toFixed(2):null,tur:r.tur,son:r.son,ilk:r.ilk})),
            kafa:K.map(r=>({v0:+r.v0.toFixed(1),tepe:+r.tepe.toFixed(1),son:r.son,ilk:r.ilk})),gk:U.gk.map(x=>+x.toFixed(2))}};}
    };
  },
  ozet(sonuclar){
    const S=sonuclar.map(s=>s._uUzak).filter(Boolean);if(!S.length)return;
    const A=[].concat(...S.map(x=>x.ayak)),K=[].concat(...S.map(x=>x.kafa)),G=[].concat(...S.map(x=>x.gk)),f=x=>x===x?x.toFixed(2):'—';
    const P3=a=>`${f(O.yuzde(a,0.1))} / ${f(O.yuzde(a,0.5))} / ${f(O.yuzde(a,0.9))}`;
    console.log(`\n  V1 (u-uzak): ayakla uzaklaştırma ${A.length}, kafayla ${K.length} (${S.length} maç) — %10 / %50 / %90`);
    console.log(`  ayak: çıkış hızı ${P3(A.map(r=>r.v0))} m/sn · iniş ${P3(A.filter(r=>r.inis!=null).map(r=>r.inis))} m · tepe ${P3(A.map(r=>r.tepe))} m · değer − en iyi diğer ${P3(A.filter(r=>r.fark!=null).map(r=>r.fark))}`);
    for(const n of[0,1,2]){const L=A.filter(r=>(n<2?r.n===n:r.n>=2)&&r.inis!=null).map(r=>r.inis);if(L.length)console.log(`  ayak, adım ${n}${n<2?'':'+'}: n ${L.length} · iniş ${P3(L)} m · en çok ${f(Math.max(...L))}`);}
    console.log(`  kafa: çıkış hızı ${P3(K.map(r=>r.v0))} m/sn · tepe ${P3(K.map(r=>r.tepe))} m · kaleciye geri pas değeri ${G.length?P3(G):'—'} (n ${G.length})`);
  }
};
