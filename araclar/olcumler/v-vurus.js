'use strict';
/* ============ Vuruş ölçümü (T9b-0, 2026-10-10; gerçekçilik planı §4 T9 “T9b alt adımları”) ============
   r-karne, s-sut ve h-hava ile aynı sözleşme: rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; olayları ('shot', 'save', 'goal',
   'pass', 'cross', 'kotuVurus') ve her adımın sonunda topu, şut nesnesini (b.sut) ve oyuncuların vuruş eylemini (p.eylem 'vurus') okur. Oranlar
   bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Tanımlar:
   - Şut: 'shot' olayı (ayak şutu; kafa şutu sayılmaz). Hız: olay anındaki topun 3B hızı. Güç: vuruş eyleminin planlanan (gucPlan) ve gerçekleşen
     (guc) gücü. Stil: eylemin stili (ic plase, ust sert, dis, asirtma, vole, yarimVole, burun).
   - Sapma: şut nesnesindeki amaçlanan nokta (hedefZ, hedefY) ile hatası uygulanmış nişan (nisanZ, nisanY) arası, kale çizgisinde (m); açısal
     sapma = atan(|Δz| / mesafe). Nişan T9b-0'da motorun şut nesnesine eklendi (salt okunur; sonucu değiştirmez).
   - Çerçeveye giden: vuruş anında top kalecisiz ve oyuncusuz çerçeveyi bulacak mı (b.sut.cerceve; motorun hesabı). Mesafe sınıfı: şutun atıldığı
     yerin kale ortasına uzaklığı (<11, 11–16,5, 16,5–25, >25 m); ceza sahası içi / dışı topun yerinden.
   - Şutun sonucu (mac-deneme.js sutBitir ile aynı): şut nesnesi değişince — aynı adımda gol olduysa gol, kurtarış olayı ya da kaleci topu tuttuysa
     kurtarış; çerçeveye giden şutlarda kurtarış oranı = kurtarış / (kurtarış + gol). Gol / şut: şutun doğrudan golü.
   - Başlayıp vurulmayan şut: şut kararıyla başlayan vuruş eylemi şut olayına varmadan bitti. Neden (bittiği adımda): oyun durdu; rakip (top
     rakibin ya da son dokunan rakip); beden (oyuncu başka bir eyleme geçti: düşüş, sendeleme, omuz …); başka vuruş (yeni bir vuruş eylemi);
     hazırlıkta bitti (hizalanamadı ya da süre doldu); geri salınımda top kaçtı.
   - Kötü vuruş (T9b-b'den): 'kotuVurus' olayı {p, tur, sut}; şut payı ayak şutlarına, pas payı 'pass' ve 'cross' olaylarına oranlanır.
   - Acele: eylemin acele alanı (T9b-b'den); yoksa karar anında baskı > 0,5 (b-olcum ile aynı tanım).
   - Ortalama hız satırları: ham [toplam / 100, adet] (mac-deneme.js oranı 100 ile çarpar; sonuç toplam / adet). */
const V_HIZ=['<20','20–25','25–30','>30'];
const V_STIL=['ic','ust','dis','asirtma','vole','yarimVole','burun'];
const V_STIL_AD={ic:'iç ayak (plase)',ust:'üst (sert)',dis:'dış ayak',asirtma:'aşırtma',vole:'vole',yarimVole:'yarım vole',burun:'burun'};
const V_MES=['<11 m','11–16,5 m','16,5–25 m','>25 m'];
const V_NEDEN=['durus','rakip','beden','degisti','hazirlik','kacti','iska'];
const V_NEDEN_AD={durus:'oyun durdu',rakip:'rakip aldı ya da dokundu',beden:'beden (düşüş, sendeleme …)',degisti:'başka vuruşa döndü',
  hazirlik:'hazırlıkta bitti (hizalanma, süre)',kacti:'geri salınımda top kaçtı',iska:'ıska (kötü vuruş, T9b-b)'};
const V_KOTU=['alt','ust','kenar','iska'];
const V_KOTU_AD={alt:'altına girme',ust:'üstüne vurma',kenar:'ayağın kenarı',iska:'ıska'};
const vOrtanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
module.exports={
  bilgi:[['— Vuruş (v-vurus; T9b) —',null,0]]
    .concat(V_HIZ.map((a,i)=>['Şut hızı '+a+' m/sn %','vH_'+i,1]))
    .concat([['Şut: planlanan güç ort.','vGucPlan',2],['Şut: gerçekleşen güç ort.','vGuc',2]])
    .concat(V_STIL.map(k=>['Şut stili: '+V_STIL_AD[k]+' %','vS_'+k,1]))
    .concat([['Şut: kale çizgisinde yatay sapma ortanca (m)','vSapZ',2],['Şut: kale çizgisinde dikey sapma ortanca (m)','vSapY',2],
      ['Şut: açısal sapma ortanca (°)','vSapAci',1],['Şut: acele %','vAcele',1],['Şut: zayıf ayakla %','vZayif',1],
      ['Şut: zayıf ayakla çerçeveye giden %','vZayifCer',1],['Şut: güçlü ayakla çerçeveye giden %','vGucluCer',1]])
    .concat(V_MES.map((a,i)=>['Şut '+a+': çerçeveye giden %','vC_'+i,1]))
    .concat(V_MES.map((a,i)=>['Şut '+a+': ortalama hız (m/sn)','vV_'+i,1]))
    .concat([['Gol / şut: ceza sahası içinden %','vG_ic',1],['Gol / şut: ceza sahası dışından %','vG_dis',1],
      ['Kurtarış oranı (çerçeveye giden): ceza sahası içinden %','vK_ic',1],['Kurtarış oranı (çerçeveye giden): ceza sahası dışından %','vK_dis',1],
      ['Başlayıp vurulmayan şut (v-vurus) / maç','vVurulmayan',2]])
    .concat(V_NEDEN.map(k=>['Vurulmayan şutun nedeni: '+V_NEDEN_AD[k]+' %','vN_'+k,1]))
    .concat([['Kötü vuruş: şutta %','vKotuSut',1],['Kötü vuruş: pasta (pas ve orta) %','vKotuPas',1]])
    .concat(V_KOTU.map(k=>['Kötü vuruş türü: '+V_KOTU_AD[k]+' %','vKt_'+k,1])),
  yeni:()=>{
    const hyp=Math.hypot,PL=52.5,MZ=34;
    const hiz=[0,0,0,0],stil={},mes={n:[0,0,0,0],cer:[0,0,0,0],v:[0,0,0,0]},kutu={ic:{sut:0,gol:0,kurt:0,cgol:0},dis:{sut:0,gol:0,kurt:0,cgol:0}};
    for(const k of V_STIL)stil[k]=0;
    let sutN=0,stilN=0,gpS=0,gpN=0,gS=0,gN=0,acele=0,zayif=0,zayifCer=0,gucluN=0,gucluCer=0,eylemN=0;
    const sapZ=[],sapY=[],sapA=[],neden={},kotu={};for(const k of V_NEDEN)neden[k]=0;for(const k of V_KOTU)kotu[k]=0;
    let kotuSut=0,kotuPas=0,pasN=0,vurulmayan=0,aktif=null;const bu={goal:false,save:false};
    const acik=new Map(),gorulen=new WeakSet();   /* oyuncu → {e, faz}: vurulmayı bekleyen şut eylemi; sayılmış şut eylemleri */
    return{
      dinle(ad,v,m){if(!m)return;
        if(ad==='goal'){bu.goal=true;return;}
        if(ad==='save'){bu.save=true;return;}
        if(ad==='pass'||ad==='cross'){pasN++;return;}
        if(ad==='kotuVurus'){if(v&&v.sut)kotuSut++;else kotuPas++;if(v&&kotu[v.tur]!=null)kotu[v.tur]++;
          if(v&&v.tur==='iska'&&v.p){const a=acik.get(v.p);if(a)a.iska=true;}return;}
        if(ad!=='shot')return;
        const p=v&&v.p,b=m.ball,s=b.sut;if(!p||!s)return;acik.delete(p);
        sutN++;const sp=hyp(b.vx,b.vy,b.vz);hiz[sp<20?0:sp<25?1:sp<30?2:3]++;
        const L=v.dist!=null?v.dist:hyp(m.dir[p.team]*PL-b.x,MZ-b.z),mi=L<11?0:L<16.5?1:L<25?2:3,cer=!!s.cerceve;
        mes.n[mi]++;if(cer)mes.cer[mi]++;mes.v[mi]+=sp;
        const e=p.eylem;
        if(e&&e.ad==='vurus'){eylemN++;
          if(e.gucPlan!=null){gpS+=e.gucPlan;gpN++;}if(e.guc!=null){gS+=e.guc;gN++;}
          if(e.stil&&stil[e.stil]!=null){stil[e.stil]++;stilN++;}
          if(e.acele!=null?!!e.acele:(e.baski!=null&&e.baski>0.5))acele++;
          if(p.ayak&&p.ayak!=='iki'&&e.ayak&&e.ayak!==p.ayak){zayif++;if(cer)zayifCer++;}else{gucluN++;if(cer)gucluCer++;}}
        if(s.nisanZ!=null&&s.hedefZ!=null){const dz=s.nisanZ-s.hedefZ,dy=s.nisanY-s.hedefY;sapZ.push(Math.abs(dz));sapY.push(Math.abs(dy));sapA.push(Math.atan2(Math.abs(dz),Math.max(1,L))*180/Math.PI);}
        const gx=m.dir[p.team]*PL,ic=Math.abs(b.x-gx)<16.5&&Math.abs(b.z-MZ)<20.16;
        kutu[ic?'ic':'dis'].sut++;aktif={s,team:p.team,ic,cer};},
      adim(m){const b=m.ball;
        /* şutun sonucu: şut nesnesi değişti (mac-deneme.js sutBitir) */
        if(aktif&&b.sut!==aktif.s){const k=kutu[aktif.ic?'ic':'dis'],gk=b.tasiyan&&b.tasiyan.rol==='GK'&&b.tasiyan.team!==aktif.team;
          if(bu.goal){k.gol++;if(aktif.cer)k.cgol++;}else if((bu.save||gk)&&aktif.cer)k.kurt++;aktif=null;}
        bu.goal=false;bu.save=false;
        /* başlayan şutlar: vuruş eylemi şut olayına varmadan bitti */
        for(const p of m.players){const e=p.eylem,se=e&&e.ad==='vurus'&&e.sec&&e.sec.tur==='sut'?e:null,a=acik.get(p);
          if(a&&a.e!==se){vurulmayan++;acik.delete(p);
            const rk=(b.sahip&&b.sahip.team!=null&&b.sahip.team!==p.team)||(b.sonDokunan&&b.sonDokunan.team!=null&&b.sonDokunan.team!==p.team);
            neden[a.iska?'iska':m.phase!=='play'?'durus':rk?'rakip':e&&e.ad!=='vurus'?'beden':e?'degisti':a.faz==='geri'?'kacti':'hazirlik']++;}
          if(se&&!gorulen.has(se)){gorulen.add(se);acik.set(p,{e:se,faz:se.faz});}
          else if(se&&a&&a.e===se)a.faz=se.faz;}},
      bitir(){
        const ham={vZayifCer:[zayifCer,zayif],vGucluCer:[gucluCer,gucluN],vAcele:[acele,eylemN],vZayif:[zayif,eylemN],
          vG_ic:[kutu.ic.gol,kutu.ic.sut],vG_dis:[kutu.dis.gol,kutu.dis.sut],vK_ic:[kutu.ic.kurt,kutu.ic.kurt+kutu.ic.cgol],vK_dis:[kutu.dis.kurt,kutu.dis.kurt+kutu.dis.cgol],
          vKotuSut:[kotuSut,sutN],vKotuPas:[kotuPas,pasN],vGucPlan:[gpS/100,gpN],vGuc:[gS/100,gN]};
        for(let i=0;i<4;i++){ham['vH_'+i]=[hiz[i],sutN];ham['vC_'+i]=[mes.cer[i],mes.n[i]];ham['vV_'+i]=[mes.v[i]/100,mes.n[i]];}
        for(const k of V_STIL)ham['vS_'+k]=[stil[k],stilN];
        let nT=0;for(const k of V_NEDEN)nT+=neden[k];for(const k of V_NEDEN)ham['vN_'+k]=[neden[k],nT];
        let kT=0;for(const k of V_KOTU)kT+=kotu[k];for(const k of V_KOTU)ham['vKt_'+k]=[kotu[k],kT];
        return{ham,vSapZ:vOrtanca(sapZ),vSapY:vOrtanca(sapY),vSapAci:vOrtanca(sapA),vVurulmayan:vurulmayan};}
    };
  },
  /* sıkıştırmadan bağımsız oran (gerçekçilik planı §7 madde 7, T9b kararı): dışarıdan şutun gol verimi içeriden olanın en çok 0,45'i (gerçek ~0,3) */
  ozet(sonuclar){
    let a=0,b=0,c=0,d=0;for(const s of sonuclar){const h=s.ham||{};if(h.vG_ic){a+=h.vG_ic[0];b+=h.vG_ic[1];}if(h.vG_dis){c+=h.vG_dis[0];d+=h.vG_dis[1];}}
    const r=b&&d&&a?(c/d)/(a/b):NaN,ok=!(r>0.45);
    console.log((ok?'  ':'! ')+'Gol / şut: dışarıdan ÷ içeriden (v-vurus)'.padEnd(46)+(Number.isNaN(r)?'—':r.toFixed(2)).padStart(8)+'   hedef T9b: ≤0.45');
  }
};
