'use strict';
/* ============ T20–T22 topla oyunun akıcılığı ölçümleri (gerçekçilik planı §4 “2026-10-18 maç notları”, T20-0; 2026-10-18) ============
   r-karne.js ve t-kanat.js ile aynı sözleşme: rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top, oyuncu ve
   saat alanlarını okur. Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Tanımlar:
   - Serbest sürüş: top oyunda, sahibinin ayağında (taşınmıyor), sahibin sürüş niyeti var ve koruma, bekleme, çalım ya da eylem yok.
     “Top arkada”: topun gövdenin baktığı yöne göre öndeliği < −0,15 m. Epizot: ≥ 0,15 sn (9 kare) aralıksız arkada. “Gövde dönük”: top 0,9 m
     içindeyken gövdenin yönü sürüş niyetinin yönünden > 1 rad (57°) — top kovalanırken gövdenin topa bakması doğrudur (T20a). Sürüşte dokunuş sıklığı: serbest sürüşteki sürüş dokunuşu / serbest sürüş süresi.
   - Geri geri: topun sahibi ya da vuruş hazırlığındaki oyuncu gövdesinin baktığı yönün tersine > 0,6 m/sn gidiyor (kullanıcının notu:
     “dönerken vücut arkaya kayıyor”). Alış dizisi: iyi ilk dokunuş (ayak ya da göğüs) → aynı oyuncunun 3 sn içindeki vuruşu (pas, orta, şut,
     uzaklaştırma); dizide geri geri yol > 0,3 m ise “geri kaymalı”. Ayrıca alıştaki gidiş yönüne göre geri (teşhisin eski tanımı; bilgi).
   - Gelişine (tek vuruş): pas olayında `ilk` (gelişine vuruş); açı: pasın yönü ile topun geldiği yönün tersi (pasöre doğru) arası.
     Gelişine şut: şutun vuruş eylemi gelişine (`sec.ilk`).
   - Santra: santra olayında orta noktanın 3 m içindeki oyuncu sayısı (iki takım); santradan sonraki ilk pasın yönü (hücum yönüne göre).
   - Eğri: pas ya da ortada topun yan dönüşü (|egri| > 0,02). İçe dönen orta: Magnus itişi kale çizgisine doğru (egri · (−vz) · yön > 0; korner
     ölçümüyle aynı tanım, js/mac-durantop.js). Uzun havadan pas: orta dışında ≥ 30 m havadan pas; koşana: alıcı > 3,5 m/sn.
   - Kanat taşıması: kanat mevkili sahibin bir sahiplikte serbest sürüşle aldığı yol (> 1 m olanlar). Topla hızın %90'lığı: serbest sürüş
     karelerindeki sürücü hızının maç içi %90'lık değeri.
   - Terk edilen vuruş hazırlığı: vuruş eylemi hazırlık evresindeyken top hâlâ takımdayken vuruşsuz biter (süre aşımı; T20 teşhisi: koşarken arkaya pas
     kararında gövde pas yönüne döner, oyuncu topu geri geri kovalayıp yetişemez). Hat kapanınca vazgeçme (`vazgecti` olayı) bundan düşülür; rakibin
     dokunuşuyla ya da düşüş gibi başka bir eylemle biten hazırlık “kesilen”dir.
   - Şut türü: şut nesnesinin türü (sert, plase, falso + trivela, aşırtma, düşen) ve vuruş stili (vole, yarım vole).
   - T24-0 (2026-10-18): kabulün şut türü satırları penaltı ve doğrudan serbest vuruş hariç (vuruş eyleminin sec.penalti / sec.serbest'i; ikisinin
     kendi planlayıcısı var); eski “Şut:” satırları bilgi kalır. Stil değişimi (borç 40): şut eyleminin ilk görüldüğü adımdaki stili (hazırlık; çizim
     bunu gösterir) ile şut olayındaki stili (temas; vurusYap ve sutVur yeniden yazar) farklı. Gelişine şutta ayrıca: değişimde vole ya da yarım vole
     var (topun temas yüksekliği) ya da öteki (planın türü: gelişine şutta hazırlıkta planın stili yazılmıyor). */
const A_PL=52.5,A_MZ=34;
module.exports={
  bilgi:[['— T20–T22: topla oyunun akıcılığı (gerçekçilik planı §4 “2026-10-18 maç notları”) —',null,0],
    ['Sürüş: top gövdenin arkasında (kare) %','aArkaPay',1,[null,1,'T23']],['Sürüş: top ≥ 0,15 sn arkada / maç','aArkaEp',1,[null,5,'T23']],
    /* T23-0 (2026-10-18): arkada epizodunun kaynağı (epizodun başında): alıştan ≤ 0,5 sn, karar yönünün > 100° dönüşünden ≤ 0,6 sn, öteki */
    ['Sürüş: arkada epizodu — alıştan ≤ 0,5 sn / maç','aArkaAlis',2],['Sürüş: arkada epizodu — > 100° yön değişiminden ≤ 0,6 sn / maç','aArkaDon',2],['Sürüş: arkada epizodu — öteki / maç','aArkaDiger',2],
    ['Sürüş: top erişimdeyken (0,9 m) gövde niyetten > 57° dönük % (bütün; bilgi)','aDonukPay',1],
    /* T23-0: dönük kareler üçe ayrılır — karar yönü (p.surus.hedef ya da yon) > 57° değiştikten ≤ 0,6 sn (dönüş sürüyor), gövde bilerek topa (s._yuz),
       kalıcı (öbürleri; kabul borç 27). Karar yönü değişimi: önceki referanstan > 1 rad; geri dönüş: değişimden ≤ 0,6 sn sonra bir öncekinin ±20°'sine */
    ['Sürüş: gövde niyetten dönük — kalıcı %','aDonukKalici',1,[null,10,'T23']],['Sürüş: gövde niyetten dönük — dönüş sürüyor %','aDonukDon',1],['Sürüş: gövde niyetten dönük — topa bakıyor (_yuz) %','aDonukYuz',1],
    ['Sürüş: niyet > 57° değişimi / taşıma·sn','aNiyetDeg',2],['Sürüş: niyetin geri dönüşü (0,6 sn içinde) / taşıma·sn','aNiyetGeri',2],['Sürüş: dokunuş / sn','aDokunusHz',2],
    ['Sürüş: topla hız ortalaması (m/sn)','aSurHiz',2],['Sürüş: topla hızın %90\'lığı (m/sn)','aSurHiz90',2],
    ['Geri geri (sahip ve vuruş hazırlığı) sn / maç','aGeriSn',1],['Terk edilen vuruş hazırlığı (süre aşımı) / maç','aHazTerk',2],['Kesilen vuruş hazırlığı (rakip, düşüş) / maç','aHazKesik',2],['Dönmeden önce topla yavaşlama (T20b) / maç','aYavasla',2],
    ['Vazgeçilen pas (hat kapandı) / maç','aVazgec',2],
    ['Alış → vuruş: geri kaymalı (gövdeye göre) %','aGeriPay',1],['Alış → vuruş: geri kaymalı (gidişe göre, bilgi) %','aYonGeriPay',1],
    ['Alış → vuruş: süre (sn)','aAlisSure',2],['Alış → vuruş / maç','aAlisN',1],
    ['Gelişine pas %','aTekPay',1],['Gelişine pas: açı ort. (°)','aTekAci',1],['Gelişine şut %','aTekSutPay',1],
    ['Santra: orta noktada tek oyuncu %','aSantraTek',1],['Santra: ilk pas geri %','aSantraGeri',1],
    ['Eğrili pas ve orta %','aEgriPay',1],['Uzun havadan pas (orta dışı, ≥ 30 m) / maç','aHavaUzun',2],['Koşana havadan pas / maç','aKosanHava',2],
    ['Orta / maç','aOrta',2],['Orta: kanat oyuncusundan %','aOrtaKanat',1],['Orta: içe dönen (eğrililer) %','aOrtaIce',1],
    ['Sürükleme kararı (T22a) / maç','aSurukle',2],['Kanat taşıması ≥ 15 m / maç','aKanat15',2],['Kanat taşıması ≥ 25 m / maç','aKanat25',2],
    ['Şut: sert %','aSut_sert',1],['Şut: plase %','aSut_plase',1],['Şut: falso ve trivela %','aSut_falso',1],['Şut: aşırtma %','aSut_asirtma',1],
    ['Şut: vole ve yarım vole %','aSut_vole',1],
    ['Şut (penaltı, serbest vuruş hariç; kabul): sert %','aSutA_sert',1,[null,50,'T24']],['Şut (penaltı, serbest vuruş hariç; kabul): plase %','aSutA_plase',1,[25,null,'T24']],
    ['Şut (penaltı, serbest vuruş hariç): falso ve trivela %','aSutA_falso',1],['Şut (penaltı, serbest vuruş hariç; kabul): aşırtma %','aSutA_asirtma',1,[2,5,'T24']],
    ['Şut (penaltı, serbest vuruş hariç): düşen %','aSutA_dusen',1],['Şut (penaltı, serbest vuruş hariç): vole ve yarım vole %','aSutA_vole',1],
    ['Gelişine şut: hazırlıktan temasa stil değişti %','aStilDeg',1,[null,0,'T24']],['  stil değişimi vole ya da yarım vole ile %','aStilDegV',1],
    ['  stil değişimi öteki (planın türü: üst → iç, falso …) %','aStilDegT',1],['Yerleşik şut (penaltı, serbest vuruş hariç): hazırlıktan temasa stil değişti %','aStilDegY',1],
    ['Gelişine şut: stil sınıfı temastaki yükseklikle uyumlu % (vole > 0,45 m, yarım vole > 0,15 m, öteki; T24d bilgi)','aStilUyum',1]],
  yeni:()=>{
    const hyp=(a,b)=>Math.sqrt(a*a+b*b),aN=a=>a-2*Math.PI*Math.floor((a+Math.PI)/(2*Math.PI)),dt=1/60;
    let surK=0,arkaK=0,arkaEp=0,donukK=0,donukN=0,surT=0,dokN=0,hizT=0;const hizL=[];
    let geriSn=0,alisN=0,geriN=0,yonGeriN=0,alisSure=0;
    let pasN=0,tekN=0,tekAci=0,tekAciN=0,sutN=0,tekSut=0;
    let santraN=0,santraTek=0,santraGeri=0,santraBek=null;
    let surukle=0;const sonSur=new Map();
    let egriN=0,egriP=0,havaUzun=0,kosanHava=0,ortaN=0,ortaKanat=0,ortaEgri=0,ortaIce=0,kan15=0,kan25=0;
    const sut={sert:0,plase:0,falso:0,asirtma:0,vole:0};
    /* T24-0 */
    const sutA={sert:0,plase:0,falso:0,asirtma:0,dusen:0,vole:0};let sutAN=0,ilkSN=0,ilkDeg=0,ilkDegV=0,ilkDegT=0,yerSN=0,yerDeg=0,ilkUN=0,ilkUyum=0;const stil0=new WeakMap();
    let hazTerk=0,hazKesik=0,vazgec=0,yavasla=0;const eyl=new Map();
    const arka=new Map(),alis=new Map(),tas=new Map();let sonSd=new Map(),pbx=0,pbz=0;
    /* T23-0 */
    const yonIz=new Map(),alisT=new Map();let donukKal=0,donukDon=0,donukYuz=0,niyetDeg=0,niyetGeri=0,arkaAlis=0,arkaDon=0,arkaDiger=0;
    const alisBitir=(p,vurus,m)=>{const r=alis.get(p);if(!r)return;alis.delete(p);if(!vurus)return;
      alisN++;alisSure+=m.t-r.t0;if(r.geri>0.3)geriN++;if(r.yonGeri>0.3)yonGeriN++;};
    return{
      dinle(ad,v,m){if(!m)return;const b=m.ball,p=v&&v.p;
        if(ad==='vazgecti'){vazgec++;return;}
        if(ad==='kickoff'){let n=0;for(const q of m.players)if(q.oyunda&&hyp(q.x,q.z-A_MZ)<3)n++;santraN++;if(n===1)santraTek++;santraBek=v.team;return;}
        if(ad==='ilkDokunus'&&p)alisT.set(p,m.t);
        if(ad==='ilkDokunus'&&v.iyi&&p){const sp=hyp(p.vx,p.vz),h=sp>0.8?Math.atan2(p.vz,p.vx):p.yon;alis.set(p,{t0:m.t,hx:Math.cos(h),hz:Math.sin(h),geri:0,yonGeri:0});return;}
        if(ad==='pass'||ad==='cross'){if(!p)return;const e=p.eylem,d=m.dir[p.team];
          if(santraBek!=null&&p.team===santraBek){if((v.hx-v.x0)*d<-1)santraGeri++;}santraBek=null;
          pasN++;if(Math.abs(b.egri||0)>0.02)egriP++;egriN++;
          if(v.ilk){tekN++;if(hyp(pbx,pbz)>2){const gelen=Math.atan2(-pbz,-pbx),giden=Math.atan2(v.hz-v.z0,v.hx-v.x0);tekAci+=Math.abs(aN(giden-gelen))*180/Math.PI;tekAciN++;}}
          if(v.tip==='hava'&&ad!=='cross'&&v.L>=30)havaUzun++;
          if(v.tip==='hava'&&ad!=='cross'&&v.q&&hyp(v.q.vx,v.q.vz)>3.5)kosanHava++;
          if(ad==='cross'){ortaN++;if(p.mevki&&p.mevki.kanat)ortaKanat++;const g=b.egri||0;if(Math.abs(g)>0.02){ortaEgri++;if(g*(-b.vz)*d>0)ortaIce++;}}
          alisBitir(p,true,m);return;}
        if(ad==='shot'){if(!p)return;santraBek=null;sutN++;const e=p.eylem,s=b.sut,tur=s&&s.tur;
          if(e&&e.sec&&e.sec.ilk)tekSut++;
          if(e&&(e.stil==='vole'||e.stil==='yarimVole'))sut.vole++;
          if(tur==='sert')sut.sert++;else if(tur==='plase')sut.plase++;else if(tur==='falso'||tur==='trivela')sut.falso++;else if(tur==='asirtma')sut.asirtma++;
          /* T24-0: penaltı ve doğrudan serbest vuruş hariç türler; hazırlıktan temasa stil değişimi */
          const vs=e&&e.ad==='vurus'?e:null,ac=!(vs&&vs.sec&&(vs.sec.penalti||vs.sec.serbest));
          if(ac){sutAN++;if(vs&&(vs.stil==='vole'||vs.stil==='yarimVole'))sutA.vole++;
            if(tur==='sert')sutA.sert++;else if(tur==='plase')sutA.plase++;else if(tur==='falso'||tur==='trivela')sutA.falso++;else if(tur==='asirtma')sutA.asirtma++;else if(tur==='dusen')sutA.dusen++;}
          /* T24d: stil sınıfı (vole, yarım vole, öteki) ile topun temastaki yüksekliğinin sınıfı aynı mı */
          if(vs&&vs.sec&&vs.sec.ilk){ilkUN++;const kh=b.y>0.45?2:b.y>0.15?1:0,ks=vs.stil==='vole'?2:vs.stil==='yarimVole'?1:0;if(kh===ks)ilkUyum++;}
          if(vs&&stil0.has(vs)){const s0=stil0.get(vs),deg=s0!==vs.stil,vo=x=>x==='vole'||x==='yarimVole';
            if(vs.sec&&vs.sec.ilk){ilkSN++;if(deg){ilkDeg++;if(vo(s0)||vo(vs.stil))ilkDegV++;else ilkDegT++;}}else if(ac){yerSN++;if(deg)yerDeg++;}}
          alisBitir(p,true,m);return;}
        if(ad==='clear'){if(p)alisBitir(p,true,m);}},
      adim(m){const b=m.ball;
        /* T24-0: şut eyleminin hazırlıktaki ilk stili (borç 40) */
        for(const q of m.players){const e=q.eylem;if(e&&e.ad==='vurus'&&e.sec&&e.sec.tur==='sut'&&!stil0.has(e))stil0.set(e,e.stil);}
        if(m.phase!=='play'){arka.clear();alis.clear();tas.clear();eyl.clear();pbx=b.vx;pbz=b.vz;return;}
        /* terk edilen vuruş hazırlığı: hazırlıktaki vuruş eylemi vuruşsuz bitti (vazgeçme olayı ayrı) */
        for(const q of m.players){const e0=eyl.get(q),e=q.eylem;
          if(e0&&e0!==e&&e0.faz==='hazirlik'){if(e0._yavas)yavasla++;else if(b.sonTakim!==q.team||e&&e.ad!=='vurus')hazKesik++;else if(!e)hazTerk++;}
          eyl.set(q,e&&e.ad==='vurus'?e:null);}
        /* geri geri: sahip ve vuruş hazırlığındaki */
        for(const q of m.players){if(!q.oyunda||q.rol==='GK')continue;const e=q.eylem;
          const ilgili=b.sahip===q&&!b.tasiyan||e&&e.ad==='vurus'&&e.faz==='hazirlik';
          if(ilgili){const vf=q.vx*Math.cos(q.yon)+q.vz*Math.sin(q.yon);if(vf<-0.6)geriSn+=dt;}
          const r=alis.get(q);
          if(r){if(m.t-r.t0>3||(b.sahip!==q&&!(e&&e.ad==='vurus'))){alis.delete(q);continue;}
            const vf=q.vx*Math.cos(q.yon)+q.vz*Math.sin(q.yon);if(vf<-0.3)r.geri+=-vf*dt;
            const vh=q.vx*r.hx+q.vz*r.hz;if(vh<-0.3)r.yonGeri+=-vh*dt;}}
        /* serbest sürüş */
        const p=b.sahip;
        if(p&&!b.tasiyan&&p.surus&&!p.surus.koru&&!p.surus.bekle&&!p.calim&&!p.eylem){
          surK++;surT+=dt;const c=Math.cos(p.yon),s=Math.sin(p.yon),onde=(b.x-p.x)*c+(b.z-p.z)*s,dd0=hyp(b.x-p.x,b.z-p.z);
          /* T23-0: karar yönü (niyetDonus açıkken s.hedef) ve değişimi */
          const kd=p.surus.hedef!=null?p.surus.hedef:p.surus.yon;let yi=yonIz.get(p);if(!yi){yi={kd,tDeg:-9,eski:null,donA:0};yonIz.set(p,yi);}
          {const d=Math.abs(aN(kd-yi.kd));if(d>1.0){niyetDeg++;if(yi.eski!=null&&m.t-yi.tDeg<=0.6&&Math.abs(aN(kd-yi.eski))<0.35)niyetGeri++;yi.eski=yi.kd;yi.tDeg=m.t;yi.donA=d;yi.kd=kd;}}
          if(onde<-0.15){arkaK++;const n=(arka.get(p)||0)+1;arka.set(p,n);if(n===9){arkaEp++;const ta=alisT.get(p);
            if(ta!=null&&m.t-ta<=0.65)arkaAlis++;else if(m.t-yi.tDeg<=0.75&&yi.donA>1.745)arkaDon++;else arkaDiger++;}}else arka.set(p,0);
          if(dd0<0.9){donukN++;if(Math.abs(aN(p.yon-p.surus.yon))>1.0)donukK++;
            if(Math.abs(aN(p.yon-kd))>1.0){if(p.surus._yuz)donukYuz++;else if(m.t-yi.tDeg<=0.6)donukDon++;else donukKal++;}}
          hizT+=p.spd;hizL.push(p.spd);
          const sd=p.sonDokunus;if(sd&&sd!==sonSd.get(p)&&sd.tur==='surus')dokN++;
          if(p.mevki&&p.mevki.kanat){let t=tas.get(p);if(!t||t.no!==m.sahiplikNo){t={no:m.sahiplikNo,L:0};tas.set(p,t);}t.L+=p.spd*dt;}}
        if(p)sonSd.set(p,p.sonDokunus);
        if(p&&p.surus&&p.surus.surukle&&p.surus!==sonSur.get(p)){surukle++;sonSur.set(p,p.surus);}
        for(const [q,t] of tas)if(b.sahip!==q||t.no!==m.sahiplikNo){if(t.L>=15)kan15++;if(t.L>=25)kan25++;tas.delete(q);}
        pbx=b.vx;pbz=b.vz;},
      bitir(){
        for(const [,t] of tas){if(t.L>=15)kan15++;if(t.L>=25)kan25++;}
        hizL.sort((a,c)=>a-c);
        const ham={aArkaPay:[arkaK,surK],aDonukPay:[donukK,donukN],aDonukKalici:[donukKal,donukN],aDonukDon:[donukDon,donukN],aDonukYuz:[donukYuz,donukN],aGeriPay:[geriN,alisN],aYonGeriPay:[yonGeriN,alisN],aTekPay:[tekN,pasN],aTekSutPay:[tekSut,sutN],
          aSantraTek:[santraTek,santraN],aSantraGeri:[santraGeri,santraN],aEgriPay:[egriP,egriN],aOrtaKanat:[ortaKanat,ortaN],aOrtaIce:[ortaIce,ortaEgri]};
        for(const k in sut)ham['aSut_'+k]=[sut[k],sutN];
        for(const k in sutA)ham['aSutA_'+k]=[sutA[k],sutAN];
        ham.aStilDeg=[ilkDeg,ilkSN];ham.aStilDegV=[ilkDegV,ilkSN];ham.aStilDegT=[ilkDegT,ilkSN];ham.aStilDegY=[yerDeg,yerSN];ham.aStilUyum=[ilkUyum,ilkUN];
        return{ham,aArkaEp:arkaEp,aArkaAlis:arkaAlis,aArkaDon:arkaDon,aArkaDiger:arkaDiger,aNiyetDeg:surT?niyetDeg/surT:NaN,aNiyetGeri:surT?niyetGeri/surT:NaN,aDokunusHz:surT?dokN/surT:NaN,aSurHiz:surK?hizT/surK:NaN,aSurHiz90:hizL.length?hizL[Math.floor(hizL.length*0.9)]:NaN,
          aGeriSn:geriSn,aHazTerk:Math.max(0,hazTerk-vazgec),aHazKesik:hazKesik,aYavasla:yavasla,aVazgec:vazgec,aAlisSure:alisN?alisSure/alisN:NaN,aAlisN:alisN,aTekAci:tekAciN?tekAci/tekAciN:NaN,aHavaUzun:havaUzun,aKosanHava:kosanHava,aOrta:ortaN,
          aSurukle:surukle,aKanat15:kan15,aKanat25:kan25};}
    };
  }
};
