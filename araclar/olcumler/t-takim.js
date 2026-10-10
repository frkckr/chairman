'use strict';
/* ============ T7 takım zekâsı ölçümleri (gerçekçilik planı §4 T7 “Alt adımlar”, T7-0; 2026-10-10) ============
   r-karne.js ile aynı sözleşme: rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top, oyuncu, skor ve saat alanlarını
   okur. Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Tanımlar:
   - Stoper + merkez payı: saha oyuncularının pası (pass/cross olayı) içinde stoper ve merkez orta saha payı (r-karne grubu; plan T7 Kabul ≥ %45).
   - Kanat değiştirme: aynı takımın sahipliğinde top sahibinin ayağındayken bir kanat üçte birinde (z < 22,7 ya da > 45,3) görülüp en çok 6 sn sonra
     öbür kanat üçte birinde görülmesi; başarı: sonraki 3 sn içinde top rakibe geçmedi. (Tek pasla yön değiştirme `donusPas` satırındadır.)
   - Hızlı hücumdan şut: şutu atan takımın sahipliği (top kazanıldıktan ya da oyun başladıktan sonraki ilk sahip) ≤ 10 sn önce başlamış ve top o
     andan beri hücum yönünde ≥ 20 m ilerlemiş.
   - Gerideki takımın son 15 dakikadaki şut payı: ikinci yarıda 75. dakikadan sonra skor eşit değilken atılan şutlarda gerideki takımın payı
     (plan T7 Kabul ≥ %60).
   - Şutu takip: ceza sahası içinden atılan şutta (ayak ya da kafa) sonraki 1,5 sn'de, oyun sürerken, kale ortasına 20 m içinde ve ona 2,5 m/sn'den
     hızlı yaklaşan hücumcu sayısı (şutu atan ve kaleci hariç; plan T7 Kabul 1–3).
   - Dönen top: tutulmayan kurtarış, parmak, yumruk, blok (top kaleye 25 m içinde) ya da direkten sonra 3 sn içinde topa ilk dokunan; hücum eden
     takımın payı (c-donen senaryosu [4] satırının maç karşılığı).
   - Pas boyu ve top ayakta dağılımı (Ek H 38): saha oyuncusu pasının boyu; oyuncunun topu ayağında tuttuğu süre (oyun sürerken, her sahiplik).
   - Görüş dışından kesilen pas (Ek H 26 vekili): saha oyuncusunun pasından sonra 4 sn içinde topu ilk alan rakip, vuruş anında pasörün bakışının
     (±100°) dışındaysa “görüş dışı”.
   - Niyet süreleri: iki takımın niyetinin (T7a, `m._niyet`) oyun süresine oranı; T7a öncesi “—”. */
const T_PL=52.5,T_MZ=34,T_CU=16.5,T_CW=20.16,T_K1=22.67,T_K2=45.33;
const T_NIYET=['kur','ilerlet','sonBolge','kontra','tut','savunma'],T_JEST=['isaret','cagir','kol','basEl'];
module.exports={
  bilgi:[
    ['— T7: takım zekâsı (gerçekçilik planı §4 T7) —',null,0],
    ['Pas: stoper + merkez orta saha payı %','tPasStoperMerkez',1,[45,null,'T7']],
    ['Kanat değiştirme (sahiplikte) / maç','tKanatDegis',2],['Kanat değiştirme: top 3 sn kaybedilmedi %','tKanatDegisOk',1],
    ['Şut: hızlı hücumdan (≤10 sn, ≥20 m) %','tHizliSut',1],
    ['Şut: gerideki takımın son 15 dk payı %','tGerideSut',1,[60,null,'T7']],
    ['Ceza sahası içi şut: takip eden hücumcu (ort.)','tTakip',2,[1,3,'T7']],['Ceza sahası içi şut: 1–3 takipçili %','tTakip13',1],
    ['Dönen top: ilk dokunuş hücum eden takımın %','tDonenIlk',1],
    ['Pas boyu <10 m %','tPasBoy1',1],['Pas boyu 10–20 m %','tPasBoy2',1],['Pas boyu 20–30 m %','tPasBoy3',1],['Pas boyu >30 m %','tPasBoy4',1],
    ['Top ayakta <1 sn %','tAyakta1',1],['Top ayakta 1–2 sn %','tAyakta2',1],['Top ayakta 2–4 sn %','tAyakta3',1],['Top ayakta >4 sn %','tAyakta4',1],
    ['Kesilen pas / maç','tKesilen',1],['Kesilen pas: kesen pasörün görüşü dışındaydı %','tKorKesme',1]]
    .concat(T_NIYET.map(k=>['Niyet: '+k+' (takım süresi %)','tNiyet_'+k,1]))
    /* T7f (Ek G3): motorun yazdığı jestler (yeni jest nesnesi; maç başına) */
    .concat(T_JEST.map(k=>['Jest: '+k+' / maç','tJest_'+k,2])),
  yeni:()=>{
    const hyp=Math.hypot,ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN;
    const grup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki&&q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki&&q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
    const yonFark=(a,b)=>{let r=a-b;r=Math.atan2(Math.sin(r),Math.cos(r));return r<0?-r:r;};
    /* pas */
    let pasN=0,pasSM=0,pbN=0,ayN=0,sahipP=null,sahipT=0;const pb=[0,0,0,0],ay=[0,0,0,0];
    /* sahiplik ve kanat değiştirme */
    let seqTeam=-1,seqT0=0,seqU0=0,sonTakim=-1,kanat=null,kd=0,kdN=0,kdOk=0;const bekleyen=[];
    /* şut, takip */
    let sutN=0,hizli=0,gerN=0,gerGeride=0,kutuSut=0,takip13=0,adimN=0;const takipler=[],takipSay=[];
    /* dönen top, kesilen pas, niyet */
    let donen=null,dnN=0,dnAtt=0,pasBek=null,kes=0,kesKor=0,niyetTop=0;const niyetT={},jest={},jestSon=new Map();
    const kutuda=(m,x,z,t)=>Math.abs(x-m.dir[t]*T_PL)<T_CU&&Math.abs(z-T_MZ)<T_CW;
    const takipBitir=k=>{const n=k.set.size;takipSay.push(n);if(n>=1&&n<=3)takip13++;};
    const sut=(m,p)=>{if(!p||p.team==null)return;const t=p.team,b=m.ball,d=m.dir[t];sutN++;
      if(seqTeam===t&&m.t-seqT0<=10&&b.x*d-seqU0>=20)hizli++;
      if(m.half===2&&m.gameSec>=4500&&m.score[0]!==m.score[1]){gerN++;if(m.score[t]<m.score[1-t])gerGeride++;}
      if(kutuda(m,p.x,p.z,t)){kutuSut++;takipler.push({t:m.t,team:t,p,set:new Set()});}};
    const donenKur=(m,p,att,gx)=>{const b=m.ball;if(hyp(b.x-gx,b.z-T_MZ)>25)return;donen={t:m.t,att,ilk:p};};
    return{
      dinle(ad,v,m){if(!m)return;
        if(ad==='pass'||ad==='cross'){const p=v.p;if(!p||p.team==null||p.rol==='GK')return;
          pasN++;const g=grup(p);if(g==='stoper'||g==='merkez')pasSM++;
          if(v.L!=null){pbN++;pb[v.L<10?0:v.L<20?1:v.L<30?2:3]++;}
          const by=p.bakisYon!=null?p.bakisYon:p.yon,gor=new Set();
          for(const o of m.teams[1-p.team])if(o.oyunda&&yonFark(Math.atan2(o.z-p.z,o.x-p.x),by)<1.75)gor.add(o);
          pasBek={t:m.t,team:p.team,p,gor};}
        else if(ad==='shot')sut(m,v.p);
        else if(ad==='header'){if(v.shot)sut(m,v.p);}
        else if(ad==='save'||ad==='parmak'||ad==='yumruk'){const gk=v.p;if(!gk||gk.team==null||(ad==='save'&&v.catch))return;donenKur(m,gk,1-gk.team,-m.dir[gk.team]*T_PL);}
        else if(ad==='block'){const p=v.p;if(!p||p.team==null)return;donenKur(m,p,1-p.team,-m.dir[p.team]*T_PL);}
        else if(ad==='wood'){const p=v.p;if(!p||p.team==null)return;donenKur(m,p,p.team,m.dir[p.team]*T_PL);}},
      adim(m){adimN++;const b=m.ball,ph=m.phase,s=b.sahip;
        for(const p of m.players){const j=p.jest;if(j&&j!==jestSon.get(p))jest[j.tur]=(jest[j.tur]||0)+1;jestSon.set(p,j);}
        /* top ayakta (oyuncu başına sahiplik süresi) */
        const s2=ph==='play'?s:null;
        if(s2!==sahipP){if(sahipP){const d=m.t-sahipT;ayN++;ay[d<1?0:d<2?1:d<4?2:3]++;}sahipP=s2;sahipT=m.t;}
        /* bekleyen kanat değiştirmeler: 3 sn top rakibe geçmediyse başarılı */
        for(let i=bekleyen.length-1;i>=0;i--){const q=bekleyen[i];if(m.t-q.t>=3){kdN++;kdOk++;bekleyen.splice(i,1);}}
        if(ph!=='play'){for(const k of takipler)takipBitir(k);takipler.length=0;donen=null;pasBek=null;kanat=null;seqTeam=-1;return;}
        if(m._niyet){for(let t=0;t<2;t++){const N=m._niyet[t];if(!N||!N.ad)continue;niyetT[N.ad]=(niyetT[N.ad]||0)+1/60;niyetTop+=1/60;}}
        if(s&&s.team!=null){const t=s.team;
          if(t!==seqTeam){seqTeam=t;seqT0=m.t;seqU0=b.x*m.dir[t];kanat=null;}
          if(t!==sonTakim){for(let i=bekleyen.length-1;i>=0;i--){if(bekleyen[i].team!==t){kdN++;bekleyen.splice(i,1);}}sonTakim=t;}
          const yan=b.z<T_K1?-1:b.z>T_K2?1:0;
          if(yan){if(kanat&&kanat.yan===-yan&&m.t-kanat.t<=6){kd++;bekleyen.push({t:m.t,team:t});}kanat={yan,t:m.t};}}
        /* şutu takip: 6 karede bir örnek */
        for(let i=takipler.length-1;i>=0;i--){const k=takipler[i];if(m.t-k.t>1.5){takipBitir(k);takipler.splice(i,1);continue;}
          if(adimN%6)continue;const gx=m.dir[k.team]*T_PL;
          for(const q of m.teams[k.team]){if(!q.oyunda||q===k.p||q.rol==='GK'||k.set.has(q))continue;
            const dx=gx-q.x,dz=T_MZ-q.z,L=hyp(dx,dz);if(L>20||L<0.5)continue;if((q.vx*dx+q.vz*dz)/L>2.5)k.set.add(q);}}
        /* dönen top: ilk dokunan */
        if(donen){if(m.t-donen.t>3)donen=null;else{const sd=b.sonDokunan;if(sd&&sd!==donen.ilk&&sd.team!=null){dnN++;if(sd.team===donen.att)dnAtt++;donen=null;}}}
        /* kesilen pas: topu ilk alan rakip */
        if(pasBek){if(m.t-pasBek.t>4)pasBek=null;else if(s&&s!==pasBek.p&&s.team!=null){if(s.team!==pasBek.team){kes++;if(!pasBek.gor.has(s))kesKor++;}pasBek=null;}}},
      bitir(){for(const k of takipler)takipBitir(k);takipler.length=0;for(const q of bekleyen){void q;kdN++;kdOk++;}bekleyen.length=0;
        const ham={tPasStoperMerkez:[pasSM,pasN],tKanatDegisOk:[kdOk,kdN],tHizliSut:[hizli,sutN],tGerideSut:[gerGeride,gerN],tTakip13:[takip13,kutuSut],
          tDonenIlk:[dnAtt,dnN],tKorKesme:[kesKor,kes]};
        for(let i=0;i<4;i++){ham['tPasBoy'+(i+1)]=[pb[i],pbN];ham['tAyakta'+(i+1)]=[ay[i],ayN];}
        for(const k of T_NIYET)ham['tNiyet_'+k]=[niyetT[k]||0,niyetTop];
        const r={ham,tKanatDegis:kd,tTakip:takipSay.length?ort(takipSay):NaN,tKesilen:kes};for(const k of T_JEST)r['tJest_'+k]=jest[k]||0;return r;}
    };
  }
};
