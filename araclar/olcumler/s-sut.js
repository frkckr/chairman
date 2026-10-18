'use strict';
/* ============ Şut kaynağı ölçümü (M1, 2026-10-10; gerçekçilik planı “M1 — Hız bakımı”; T6, T9b ve T8'in ortak ölçüsü) ============
   r-karne.js ve t-takim.js ile aynı sözleşme: rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top, oyuncu, duruş,
   istatistik ve saat alanlarını okur. Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Tanımlar:
   - Şut: 'shot' olayı ya da şut sayılan kafa ('header', shot). Kaynak öncelik sırasıyla: penaltı (penaltı duruşundan sonra kullananın ilk vuruşu);
     doğrudan serbest vuruş (serbest vuruşu kullananın ilk vuruşu şut); duran top (korner; serbest vuruş — dolaylı ya da ortalanan —; taç: duruştan
     sonra rakip topu alana ya da korner ve serbest vuruşta 10 sn, taçta 8 sn dolana kadar); ortadan (son 3 sn'de takım arkadaşının ortası; kafa
     ya da ayak); geri çevirmeden (son 3 sn'de takım arkadaşının geri çevirmesi); kalanı açık oyun. Gol, aynı takımın son şutundan ≤ 4 sn sonra
     gelirse o şutun kaynağına yazılır (dönen topla gelen gol de).
   - Rol ve mesafe: şutu atanın grubu (r-karne grupları) ve kale ortasına uzaklığı (<11, 11–16,5, 16,5–25, >25 m).
   - Başlayıp vurulmayan şut: şut kararıyla başlayan vuruş (p.eylem 'vurus', sec.tur 'sut') şut olayına varmadan bitti (müdahale, vazgeçme,
     duruş …). Yalnız ayak şutları; maç sonunda yarım kalan sayılmaz.
   - Orta sonucu: ortadan ('cross' olayı; açık oyun ve serbest vuruşun ortası — korner servisi 'cross' yaymaz, onun sonucu araclar/olcumler/k-duran.js
     “Korner ilk temas” satırlarındadır; T8-0 düzeltmesi, eski not “korner ortası da” diyordu) sonraki 3 sn'de ilk belirleyici olay: blok, kaleci (kurtarış, yakalama, yumruk, parmak),
     hücumun kafa şutu, hücumun diğer kafası, savunmanın kafası, hücumun ayak şutu (gelişine), hücum topu aldı, savunma topu aldı, uzaklaştırma,
     top oyun dışı; hiçbiri olmazsa “diğer”. Hava düellosu (m.ist.havaTopu arttı) ayrıca sayılır.
   - Serbest vuruş bölgesi: duruşun yeri kale ortasına ≤ 30 m (yakın) ya da uzak. Barajlı doğrudan serbest vuruşta şut başına gol T8 bandıdır
     (%6–10; d-duran senaryosunun [barajlı] tanımıyla aynı). T10g (2026-10-11): maç içi satır bilgidir — 80 maçta ~45 şut (σ ≈ 4 puan; T8 tabanında
     %16, T10'da %2,2); kapı d-duran'ın barajlı hücreleri (80'er şut). */
const S_PL=52.5,S_MZ=34;
const S_KAYNAK=['acik','ortaKafa','ortaAyak','geriCevir','korner','serbest','dogrudan','penalti','tac'];
const S_KAYNAK_AD={acik:'açık oyun',ortaKafa:'ortadan kafa',ortaAyak:'ortadan ayak',geriCevir:'geri çevirmeden',korner:'korner',
  serbest:'serbest vuruş (dolaylı ya da ortalanan)',dogrudan:'doğrudan serbest vuruş',penalti:'penaltı',tac:'taç'};
const S_GRUP=['stoper','bek','merkez','kanat','forvet','kaleci'];
const S_MESAFE=['<11 m','11–16,5 m','16,5–25 m','>25 m'];
const S_ORTA=['blok','kaleci','kafaSut','kafaHucum','kafaSavunma','ayakSut','hucumAldi','savunmaAldi','uzaklastirma','disari','diger'];
const S_ORTA_AD={blok:'blok',kaleci:'kaleci',kafaSut:'hücumun kafa şutu',kafaHucum:'hücumun diğer kafası',kafaSavunma:'savunmanın kafası',
  ayakSut:'hücumun ayak şutu',hucumAldi:'hücum topu aldı',savunmaAldi:'savunma topu aldı',uzaklastirma:'uzaklaştırma',disari:'top oyun dışı',diger:'diğer'};
/* T24-0 (2026-10-18; T24 planı, ölçüm 5): rol × mesafe ve rol × kaynak (şut / maç). Rol dört grup: forvet, orta saha (merkez ve kanat), bek, stoper
   (kaleci sayılmaz). Mesafe yukarıdaki dilimler. Kaynak — şutçunun topu nasıl aldığı — sırayla: duran top (yukarıdaki kaynak korner, serbest vuruş,
   doğrudan serbest vuruş, penaltı ya da taç), dönen top (takımın şutundan sonraki 4 sn: rakip kalecinin kurtarışı, parmağı, yumruğu, rakibin şut
   bloğu — orta bloğu sayılmaz — ya da takımın direği; r-karne “dönen toptan” ile aynı), kafa, gelişine (ayak; vuruş eylemi gelişine — sec.ilk — ya
   da şut şutçunun topa ilk dokunuşu), sürüş (topa ilk dokunduğu yerden şut anına ≥ 5 m taşıdı), pas (< 5 m; önceki dokunan takım arkadaşı),
   diğer (< 5 m; önceki dokunan rakip ya da yok: kazanılan, boşta top). Ortanca mesafe ozet() tablosunda (penaltısız, kafa dahil; bütün maçlar). */
const S_ROL4=['forvet','ortaSaha','bek','stoper'],S_ROL4_AD={forvet:'forvet',ortaSaha:'orta saha',bek:'bek',stoper:'stoper'};
const S_ROL4_G={forvet:'forvet',merkez:'ortaSaha',kanat:'ortaSaha',bek:'bek',stoper:'stoper'};
const S_YOL=['pas','surus','gelisine','kafa','duran','donen','diger'];
const S_YOL_AD={pas:'pastan (< 5 m taşıdı)',surus:'sürüşten (≥ 5 m taşıdı)',gelisine:'gelişine (ayak)',kafa:'kafa',duran:'duran top',donen:'dönen top',
  diger:'kazanılan ya da boşta top (< 5 m)'};
const S_DURAN=new Set(['korner','serbest','dogrudan','penalti','tac']);
const sOrtanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
module.exports={
  bilgi:[['— Şut kaynağı (s-sut; M1 ölçümü; T6, T9b, T8) —',null,0]]
    .concat(S_KAYNAK.map(k=>['Şut: '+S_KAYNAK_AD[k]+' / maç','sS_'+k,2]))
    .concat(S_KAYNAK.map(k=>['Gol / şut: '+S_KAYNAK_AD[k]+' %','sG_'+k,1]))
    .concat(S_GRUP.map(g=>['Şut payı: '+g+' %','sR_'+g,1]))
    .concat(S_MESAFE.map((a,i)=>['Şut payı: '+a+' %','sM_'+i,1]))
    .concat([['Başlayıp vurulmayan şut / maç','sVurulmayan',2],['Başlayıp vurulmayan şut: başlayanın %','sVurulmayanOran',1],
      ['Orta / maç','sOrta',1],['Orta: hava düellosu oldu %','sOrtaHava',1],
      /* T17-0 (2026-10-16): ortanın türü (karar anındaki ortaTuru; duran top ortası ayrı), bloklanan ortada karar anındaki baskı ve bloğun sonucu,
         yerden orta ve geri çevirmede alıcının 1,5 m'inde rakip varken hücumun ilk teması (T17d kalibrasyonu; orta bloğu sayılmaz) */
      ['Orta / maç (T17): kesme','sOT_kesme',2],['Orta / maç (T17): arka direğe asma','sOT_asma',2],['Orta / maç (T17): alçak sert','sOT_alcak',2],
      ['Geri çevirme / maç (T17)','sOT_geri',2],['Orta / maç (T17): duran top ortası','sOT_duran',2],
      ['Orta (T17): karar anında baskı, bloklanan (ort.)','sOBaskiB',2],['Orta (T17): karar anında baskı, bloklanmayan (ort.)','sOBaskiN',2],
      ['Bloklanan orta (T17): kornere %','sOB_korner',1],['Bloklanan orta (T17): taca %','sOB_tac',1],['Bloklanan orta (T17): oyunda kaldı %','sOB_oyunda',1],
      ['Yerden orta ve geri çevirme (T17): alıcının 1,5 m içinde rakip %','sYA_yakinPay',1],['Yerden orta ve geri çevirme (T17): hücum ilk temas, rakip ≤ 1,5 m %','sYA_yakin',1],
      ['Yerden orta ve geri çevirme (T17): hücum ilk temas, rakip > 1,5 m %','sYA_uzak',1]])
    .concat(S_ORTA.map(k=>['Orta sonucu: '+S_ORTA_AD[k]+' %','sO_'+k,1]))
    .concat([['Korner başına şut','sKornerSut',2],
      ['Serbest vuruş / maç','sSerbestMac',2],['Serbest vuruş: yakın (≤30 m) / maç','sSerbestYakin',2],['Serbest vuruş: yakında doğrudan şut %','sSerbestYakinSut',1],
      ['Barajlı doğrudan serbest vuruş / maç','sBarajliSut',2],['Barajlı doğrudan serbest vuruşta şut başına gol %','sBarajliGol',1],
      ['Kafa şutu / maç','sKafaSut',2],['Kafa şutu: çerçeveye giden %','sKafaCer',1],['Gol / şut: kafa (bütün kaynaklar) %','sKafaGol',1]])
    .concat([['— T24-0: rol × mesafe ve rol × kaynak (s-sut; şut / maç) —',null,0]])
    .concat(S_ROL4.flatMap(r=>S_MESAFE.map((a,i)=>['Şut / maç (T24-0): '+S_ROL4_AD[r]+' '+a,'sRM_'+r+'_'+i,2])))
    .concat(S_ROL4.flatMap(r=>S_YOL.map(k=>['Şut / maç (T24-0): '+S_ROL4_AD[r]+' — '+S_YOL_AD[k],'sRK_'+r+'_'+k,2]))),
  yeni:()=>{
    const hyp=Math.hypot;
    const grup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki&&q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki&&q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
    const sut={},gol={},rol={},mes=[0,0,0,0],orta={};let sutN=0,baslayan=0,vurulmayan=0,ortaN=0,ortaHava=0,korner=0,kornerSut=0;
    let syN=0,syMac=0,syDogrudan=0,bjN=0,bjGol=0,kfN=0,kfCer=0,kfGol=0;   /* T8b: kafa şutu isabeti (gerçekte çerçeveye ~%30–35) */
    for(const k of S_KAYNAK){sut[k]=0;gol[k]=0;}for(const g of S_GRUP)rol[g]=0;for(const k of S_ORTA)orta[k]=0;
    let du=null;                         /* duran top bağlamı: {tur, team, taker, t0 (oyunun yeniden başladığı an), vurus, sure, ref (m.durus), yakin} */
    let sonOrta=null,sonGeri=null,sonSut=null,bekOrta=null,havaOnce=0;
    /* T24-0: rol × mesafe, rol × kaynak; topa ilk dokunuş (oyuncu → {x, z, önceki dokunan}), dönen topun anı (hücum eden takıma göre) */
    const rm={},rk={},mesRol={};for(const r of S_ROL4){rm[r]=[0,0,0,0];rk[r]={};for(const k of S_YOL)rk[r][k]=0;mesRol[r]=[];}
    const alis=new Map(),donenT=[-9,-9];let sdCur=null;
    const yolBul=(m,p,kafa,k)=>{if(S_DURAN.has(k))return'duran';if(m.t-donenT[p.team]<=4)return'donen';if(kafa)return'kafa';
      const e=p.eylem,sec=e&&e.sec;if(sec&&sec.ilk||sdCur!==p)return'gelisine';
      const a=alis.get(p);if(!a)return'diger';if(hyp(p.x-a.x,p.z-a.z)>=5)return'surus';return a.from&&a.from.team===p.team?'pas':'diger';};
    /* T17-0 */
    const oTur={kesme:0,asma:0,alcak:0,geri:0,duran:0},oBaski=[[0,0],[0,0]],oB={korner:0,tac:0,oyunda:0},yA={yakin:[0,0],uzak:[0,0]};let bekBlok=null,bekYer=null;
    const yakinRakip=(m,t,q)=>{for(const o of m.teams[1-t])if(o.oyunda&&hyp(o.x-q.x,o.z-q.z)<=1.5)return true;return false;};
    const YA_OLAY=new Set(['ilkDokunus','kotuKontrol','shot','header','pass','cross','block','sekme','save','kapan','yumruk','parmak','clear']);
    const acik=new Map(),gorulen=new WeakSet();   /* oyuncu → vurulmayı bekleyen şut eylemi; sayılmış şut eylemleri */
    /* orta biterken de hava düellosu sayılır: düello ile onu kazanan kafa aynı adımda gelince orta adim'den önce kapanır */
    let sonM=null;
    const ortaBitir=s=>{if(!bekOrta)return;if(!bekOrta.hava&&sonM&&sonM.ist.havaTopu>havaOnce)ortaHava++;orta[s]++;
      if(bekOrta.baski!=null){const o=oBaski[s==='blok'?0:1];o[0]+=bekOrta.baski;o[1]++;}if(s==='blok'&&sonM)bekBlok={t:sonM.t,team:bekOrta.team};bekOrta=null;};
    const sutSay=(m,p,kafa)=>{if(!p||p.team==null)return;const t=p.team;let k='acik';
      if(du&&du.team===t){
        if(du.tur==='penalti'&&du.vurus===0&&p===du.taker)k='penalti';
        else if(du.tur==='serbest'&&du.vurus===0&&p===du.taker){k='dogrudan';if(du.yakin)syDogrudan++;if(du.ref&&du.ref.baraj)bjN++;}
        else if(du.tur==='korner'){k='korner';kornerSut++;}
        else if(du.tur==='serbest')k='serbest';
        else if(du.tur==='tac')k='tac';}
      if(k==='acik'){
        if(sonOrta&&sonOrta.team===t&&sonOrta.p!==p&&m.t-sonOrta.t<=3)k=kafa?'ortaKafa':'ortaAyak';
        else if(sonGeri&&sonGeri.team===t&&sonGeri.p!==p&&m.t-sonGeri.t<=3)k='geriCevir';}
      sutN++;sut[k]++;const g=grup(p);if(rol[g]!=null)rol[g]++;
      const L=hyp(m.dir[t]*S_PL-p.x,S_MZ-p.z),mi=L<11?0:L<16.5?1:L<25?2:3;mes[mi]++;
      {const r4=S_ROL4_G[g];if(r4){rm[r4][mi]++;rk[r4][yolBul(m,p,kafa,k)]++;if(k!=='penalti')mesRol[r4].push(L);}}   /* T24-0 */
      sonSut={t:m.t,team:t,k,barajli:k==='dogrudan'&&!!(du&&du.ref&&du.ref.baraj),kafa};
      if(kafa){kfN++;if(m.ball.sut&&m.ball.sut.cerceve)kfCer++;}
      if(du&&du.team===t)du.vurus++;};
    return{
      dinle(ad,v,m){if(!m)return;sonM=m;
        /* T24-0: dönen topun anı */
        if(v&&v.p&&v.p.team!=null){if(ad==='save'||ad==='parmak'||ad==='yumruk'||ad==='block'&&!v.orta)donenT[1-v.p.team]=m.t;else if(ad==='wood')donenT[v.p.team]=m.t;}
        /* T17-0: bloklanan ortanın sonucu; yerden ortanın alım noktası (ortacıdan sonraki ilk temas; orta bloğunda sayılmaz) */
        if(bekBlok){if(ad==='korner'&&v&&v.team===bekBlok.team){oB.korner++;bekBlok=null;}else if(ad==='tac'){oB.tac++;bekBlok=null;}else if(ad==='kaleVurusu'||ad==='serbest'||ad==='penalti'||ad==='goal'){oB.oyunda++;bekBlok=null;}}
        if(bekYer){if(ad==='block'&&v&&v.orta)bekYer=null;
          else if(v&&v.p&&v.p!==bekYer.p&&m.t-bekYer.t<=2.5&&YA_OLAY.has(ad)){const k=yA[bekYer.yakin?'yakin':'uzak'];k[1]++;if(v.p.team===bekYer.team)k[0]++;bekYer=null;}}
        if(ad==='tac'||ad==='korner'||ad==='serbest'||ad==='penalti'||ad==='kaleVurusu'){
          if(ad==='kaleVurusu'){du=null;return;}
          const yakin=hyp(m.dir[v.team]*S_PL-v.x,S_MZ-v.z)<=30;
          du={tur:ad,team:v.team,taker:v.taker,t0:null,vurus:0,sure:ad==='tac'?8:10,ref:m.durus,yakin};
          if(ad==='korner')korner++;if(ad==='serbest'){syMac++;if(yakin)syN++;}return;}
        if(ad==='shot'){const p=v.p;if(p)acik.delete(p);sutSay(m,p,false);if(bekOrta&&p&&p.team===bekOrta.team)ortaBitir('ayakSut');return;}
        if(ad==='header'){const p=v.p;if(v.shot)sutSay(m,p,true);
          if(bekOrta&&p)ortaBitir(p.team===bekOrta.team?(v.shot?'kafaSut':'kafaHucum'):'kafaSavunma');return;}
        if(ad==='goal'){if(sonSut&&sonSut.team===v.team&&!v.own&&m.t-sonSut.t<=4){gol[sonSut.k]++;if(sonSut.barajli)bjGol++;if(sonSut.kafa)kfGol++;}sonSut=null;du=null;return;}
        if(ad==='kickoff'){du=null;sonOrta=null;sonGeri=null;bekOrta=null;return;}
        if(ad==='pass'||ad==='cross'){const p=v.p;if(!p||p.team==null)return;
          if(du&&du.team===p.team)du.vurus++;
          const e=p.eylem,sec=e&&e.sec,duran=!!(sec&&sec.yay==='korner')||!!(du&&du.team===p.team&&du.vurus===1);   /* duran top ortası: vuruşun kendisi (serbest vuruşun ortası ya da duruştan sonraki ilk vuruş) */
          if(ad==='cross'){ortaN++;sonOrta={t:m.t,team:p.team,p};bekOrta={t:m.t,team:p.team};havaOnce=m.ist.havaTopu;bekOrta.hava=false;
            const tt=duran?'duran':sec&&sec.ortaTuru&&oTur[sec.ortaTuru]!=null?sec.ortaTuru:sec&&sec.tip==='yer'?'alcak':'kesme';oTur[tt]++;
            if(!duran)bekOrta.baski=e&&e.baski!=null?e.baski:null;
            if(!duran&&sec&&sec.tip==='yer'&&v.q)bekYer={t:m.t,team:p.team,p,q:v.q,yakin:yakinRakip(m,p.team,v.q)};}
          else if(v.tur==='geriCevir'){sonGeri={t:m.t,team:p.team,p};oTur.geri++;if(v.q)bekYer={t:m.t,team:p.team,p,q:v.q,yakin:yakinRakip(m,p.team,v.q)};}
          return;}
        if(ad==='clear'||ad==='gkkick'){const p=v.p;if(du&&p&&du.team===p.team)du.vurus++;if(bekOrta&&p&&p.team!==bekOrta.team)ortaBitir('uzaklastirma');return;}
        if(bekOrta){
          if(ad==='block')ortaBitir('blok');
          else if(ad==='save'||ad==='kapan'||ad==='yumruk'||ad==='parmak')ortaBitir('kaleci');}},
      adim(m){const b=m.ball;sonM=m;
        /* T24-0: topa ilk dokunuş (son dokunan değişince) */
        {const sd=b.sonDokunan;if(sd!==sdCur){if(sd)alis.set(sd,{x:sd.x,z:sd.z,from:sdCur});sdCur=sd;}}
        /* başlayan şutlar: vuruş eylemi şut olayına varmadan bittiyse vurulmadı */
        for(const p of m.players){const e=p.eylem,se=e&&e.ad==='vurus'&&e.sec&&e.sec.tur==='sut'?e:null,a=acik.get(p);
          if(a&&a!==se){vurulmayan++;acik.delete(p);}
          if(se&&!gorulen.has(se)){gorulen.add(se);baslayan++;acik.set(p,se);}}
        /* duran top bağlamı: oyun yeniden başladıktan sonra rakip topu aldı ya da süre doldu */
        if(du&&m.phase==='play'){if(du.t0==null)du.t0=m.t;const s=b.sahip;if(m.t-du.t0>du.sure||(s&&s.team!=null&&s.team!==du.team))du=null;}
        /* orta sonucu */
        if(bekOrta){if(m.ist.havaTopu>havaOnce&&!bekOrta.hava){bekOrta.hava=true;ortaHava++;}
          if(m.phase!=='play')ortaBitir('disari');
          else if(b.sahip&&b.sahip.team!=null)ortaBitir(b.sahip.team===bekOrta.team?'hucumAldi':'savunmaAldi');
          else if(m.t-bekOrta.t>3)ortaBitir('diger');}
        if(bekBlok&&m.t-bekBlok.t>4){oB.oyunda++;bekBlok=null;}
        if(bekYer&&(m.t-bekYer.t>2.5||m.phase!=='play'))bekYer=null;},
      bitir(){
        const ham={sVurulmayanOran:[vurulmayan,baslayan],sOrtaHava:[ortaHava,ortaN],sSerbestYakinSut:[syDogrudan,syN],sBarajliGol:[bjGol,bjN],sKafaCer:[kfCer,kfN],sKafaGol:[kfGol,kfN],
          sYA_yakin:yA.yakin,sYA_uzak:yA.uzak,sYA_yakinPay:[yA.yakin[1],yA.yakin[1]+yA.uzak[1]]};
        {const n=oB.korner+oB.tac+oB.oyunda;for(const k in oB)ham['sOB_'+k]=[oB[k],n];}
        for(const k of S_KAYNAK)ham['sG_'+k]=[gol[k],sut[k]];
        for(const g of S_GRUP)ham['sR_'+g]=[rol[g],sutN];
        for(let i=0;i<4;i++)ham['sM_'+i]=[mes[i],sutN];
        let oT=0;for(const k of S_ORTA)oT+=orta[k];for(const k of S_ORTA)ham['sO_'+k]=[orta[k],oT];
        const r={ham,sVurulmayan:vurulmayan,sOrta:ortaN,sKornerSut:korner?kornerSut/korner:NaN,sSerbestMac:syMac,sSerbestYakin:syN,sBarajliSut:bjN,sKafaSut:kfN,
          sOBaskiB:oBaski[0][1]?oBaski[0][0]/oBaski[0][1]:NaN,sOBaskiN:oBaski[1][1]?oBaski[1][0]/oBaski[1][1]:NaN};
        for(const k in oTur)r['sOT_'+k]=oTur[k];
        for(const k of S_KAYNAK)r['sS_'+k]=sut[k];
        for(const g of S_ROL4){for(let i=0;i<4;i++)r['sRM_'+g+'_'+i]=rm[g][i];for(const k of S_YOL)r['sRK_'+g+'_'+k]=rk[g][k];}r._sMesRol=mesRol;   /* T24-0 */
        return r;}
    };
  },
  /* T24-0: rol başına şut mesafesi ortancası (penaltısız, kafa dahil; bütün maçların şutları) */
  ozet(sonuclar){const T={};for(const r of S_ROL4)T[r]=[];for(const s of sonuclar){const M=s._sMesRol;if(M)for(const r of S_ROL4)if(M[r])for(const L of M[r])T[r].push(L);}
    const fd=[].concat(T.ortaSaha,T.bek,T.stoper),hep=fd.concat(T.forvet);if(!hep.length)return;const fm=x=>Number.isNaN(x)?'—':x.toFixed(1);
    console.log('  Şut mesafesi ortancası (s-sut, T24-0; penaltısız, kafa dahil; m (adet)): '+S_ROL4.map(r=>S_ROL4_AD[r]+' '+fm(sOrtanca(T[r]))+' ('+T[r].length+')').join(' · ')
      +' · forvet dışı '+fm(sOrtanca(fd))+' ('+fd.length+') · hepsi '+fm(sOrtanca(hep))+' ('+hep.length+')');}
};
