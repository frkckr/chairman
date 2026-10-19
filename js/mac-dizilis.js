/* ============ Chairman — diziliş ve topsuz oyun (mantık, çizimsiz) ============
   Koordinatlar takımın hücum yönüne göredir: u = −52,5 (kendi kalesi) … +52,5 (rakip kale), w = 0 … 68 (taç çizgileri).
   Her mevki bir çizgiye (kaleci, defans, orta saha, forvet) ve bir taban genişliğine bağlıdır. Takım bir blok gibi hareket eder:
   topa sahipken blok önde ve geniştir, top rakipteyken geride ve dar (kompakt). Blok yüksekliği ve topa kayma topun yerine bağlıdır.
   Bu, RoboCup HELIOS'taki "topun yerinden oyuncu konumuna" eşlemenin parametreli, sade bir biçimidir.
   Üstüne topsuz oyun: topu kovalayan, pres yapan (1. adam) ve onu koruyan (2. adam) oyuncu; topu tutana destek noktaları;
   savunma arkasına koşular, bekin bindirmesi, ortaya koşu rolleri (ön direk, arka direk, penaltı noktası, ceza sahası dışı);
   düz savunma çizgisi ve ofsayt; ceza sahasında adam markajı; hava topunda topun ineceği yere koşu; kalecinin açıortay konumu.
   MM2 (2026-10-02; takım zekâsı): ceza sahası çevresinde markaj takım düzeyinde paylaştırılır (iki kişi aynı adamı tutmaz, eşleşme kararlıdır);
   topu kaybeden takım kısa süre karşı pres yapar (en yakın üç oyuncu: basan, kapatan, pas yolunu kesen); savunma bloğu topa daha çok kayar ve
   daralır; hedef forvet dışındaki forvetler orta sahanın önüne döner. Dizilişler: 4-4-2, 4-2-3-1, 4-3-3; mevkinin 'ileri' payı hattın önünde
   oynamayı söyler. Santra ve ceza sahası rolleri sabit forma sırasından değil mevkiden (hedef forvet, ikinci forvet, 10 numara) gelir. */
const DIZILISLER={
  '4-4-2':{
    /* sıra motordaki oyuncu sırasıyla aynıdır: 0 kaleci, 1–4 defans, 5–8 orta saha, 9–10 forvet */
    mevkiler:[
      {ad:'KL',cizgi:'KL',w:34},
      {ad:'SĞB',cizgi:'DEF',w:9,bek:true},{ad:'STP',cizgi:'DEF',w:26},{ad:'STP',cizgi:'DEF',w:42},{ad:'SLB',cizgi:'DEF',w:59,bek:true},
      {ad:'SĞK',cizgi:'OS',w:10,kanat:true},{ad:'MO',cizgi:'OS',w:27,derin:true},{ad:'MO',cizgi:'OS',w:41},{ad:'SLK',cizgi:'OS',w:58,kanat:true},
      {ad:'FV',cizgi:'FV',w:29,hedef:true},{ad:'FV',cizgi:'FV',w:40}
    ]
  },
  /* iki derin orta saha, önlerinde üç (iki kanat ve bir 10 numara), tek hedef forvet */
  '4-2-3-1':{
    mevkiler:[
      {ad:'KL',cizgi:'KL',w:34},
      {ad:'SĞB',cizgi:'DEF',w:9,bek:true},{ad:'STP',cizgi:'DEF',w:26},{ad:'STP',cizgi:'DEF',w:42},{ad:'SLB',cizgi:'DEF',w:59,bek:true},
      {ad:'SĞK',cizgi:'OS',w:11,kanat:true,ileri:5},{ad:'MO',cizgi:'OS',w:28,derin:true},{ad:'MO',cizgi:'OS',w:40,derin:true},{ad:'SLK',cizgi:'OS',w:57,kanat:true,ileri:5},
      {ad:'FV',cizgi:'FV',w:34,hedef:true},{ad:'OOS',cizgi:'OS',w:34,ileri:9,onOrta:true}
    ]
  },
  /* üç orta saha (ortadaki derin), iki kanat forveti ve hedef forvet */
  '4-3-3':{
    mevkiler:[
      {ad:'KL',cizgi:'KL',w:34},
      {ad:'SĞB',cizgi:'DEF',w:9,bek:true},{ad:'STP',cizgi:'DEF',w:26},{ad:'STP',cizgi:'DEF',w:42},{ad:'SLB',cizgi:'DEF',w:59,bek:true},
      {ad:'MO',cizgi:'OS',w:21},{ad:'MO',cizgi:'OS',w:34,derin:true},{ad:'MO',cizgi:'OS',w:47},{ad:'SĞKF',cizgi:'FV',w:10,kanat:true,ileri:-3},
      {ad:'FV',cizgi:'FV',w:34,hedef:true},{ad:'SLKF',cizgi:'FV',w:58,kanat:true,ileri:-3}
    ]
  }
};
/* blok ayarları: hat aralıkları (m), topa kayma oranları, genişlik çarpanları */
const BLOK={
  hucum:{cizgi:(bu)=>clamp(bu*0.55-17,-38,12),os:15,fv:17,kayma:{DEF:0.3,OS:0.42,FV:0.32},genislik:1.14,bekIleri:10,kanatIleri:11},
  savunma:{cizgi:(bu)=>clamp(bu*0.6-22,-42,-3),os:13,fv:14,kayma:{DEF:0.33,OS:0.46,FV:0.3},genislik:0.95,bekIleri:0,kanatIleri:-2,uzakKapanma:0.28}
};
/* bir mevkinin hedef konumu (takımın hücum çerçevesinde): bu = topun u'su, bw = topun w'su, sahip = top takımda mı. N: takımın niyeti (T7a,
   js/mac-takim.js; yoksa nötr): hücumda genişlik, derinlik ve bek çıkışı çarpanı, savunmada blok (çizginin kayması, m) */
function dizilisKonumu(diz,n,bu,bw,sahip,N){
  const m=DIZILISLER[diz].mevkiler[n],B=sahip?BLOK.hucum:BLOK.savunma,defU=B.cizgi(bu)+(N?(sahip?N.derinlik:N.blok):0),kf=N&&!sahip?N.kompakt:1;   /* T7d: savunmada hatlar sıkışır */
  if(m.cizgi==='KL'){const u=sahip?-47+clamp(bu+20,0,40)*0.12:-50+clamp(bu+30,0,50)*0.05;return{u,w:MZ+clamp((bw-MZ)*0.18,-4,4)};}
  let u=defU+(m.cizgi==='OS'?B.os*kf:m.cizgi==='FV'?(B.os+B.fv)*kf:0);
  if(m.bek)u+=B.bekIleri*(sahip&&bu>0?1:sahip?0.4:0)*(N&&sahip?N.bekIleri:1);
  if(m.kanat)u+=B.kanatIleri;
  if(m.derin&&sahip)u-=4;
  if(m.hedef&&sahip)u+=2;
  if(m.ileri)u+=m.ileri*(sahip?1:0.6);
  /* savunmada: hedef forvet orta çizgi çevresinde stoperlere baskı ve kontra için kalır; diğer forvetler (kanat forvetleri dahil)
     blokla birlikte orta saha hattının önüne döner (MM2) */
  if(!sahip&&m.cizgi==='FV')u=m.hedef?Math.max(u,bu<-30?-12:-5):Math.min(u,defU+B.os*kf+9);
  u=Math.min(u,46);
  const kay=B.kayma[m.cizgi]||0.35;
  let w=MZ+(m.w-MZ)*B.genislik*(N&&sahip?N.genislik:1)+(bw-MZ)*kay;
  /* savunmada top tarafı daha sıkışık, uzak kanat içeri kapanır */
  if(!sahip){const uzak=Math.sign(m.w-MZ)!==Math.sign(bw-MZ)&&Math.abs(bw-MZ)>8;if(uzak)w=lerp(w,MZ,B.uzakKapanma);}
  return{u,w:clamp(w,2,PW-2)};
}

/* ============ topsuz oyun: her karede her oyuncunun hedefi ============ */
Object.assign(Match.prototype,{
  /* du: duran top varsa yerleşim topun yerine değil duran topun noktasına göre yapılır; kovalama ve pres olmaz */
  takimAI(dt,du){
    const b=this.ball;
    const odak=du?{x:du.x,z:du.z,sahip:null,takim:du.takim}:{x:b.x,z:b.z,sahip:b.sahip,takim:b.sahip?b.sahip.team:b.tasiyan&&b.tasiyan.team!=null?b.tasiyan.team:-1};
    const sahipTakim=odak.takim;
    /* T18b (gecisKademe): pas uçuşunda alıcı rol düzeni için sanal sahip — odak.sahip/takim alıcıdır, sahipTakim (kovalayan, geçiş sayacı) gerçek kalır */
    if(MOTOR_AYAR.gecisKademe&&!du&&!b.sahip&&!b.tasiyan&&b.hedefOyuncu&&b.hedefOyuncu.oyunda&&b.hedefOyuncu.team!=null&&!(b.hedefOyuncu.eylem&&b.hedefOyuncu.eylem.kilit)){odak.sahip=b.hedefOyuncu;odak.takim=b.hedefOyuncu.team;}
    /* serbest top: her takımdan topa en önce yetişecek oyuncu kovalar (6 karede bir ya da top değişince hesaplanır) */
    let kovalayan=[null,null];
    if(!du&&sahipTakim<0&&!b.tasiyan){
      const K=this._kov;
      if(K&&K.surum===b.surum&&this.kare-K.kare<6)kovalayan=K.liste;
      else{const t8=this.topTahmin(0.8),sure=[1e9,1e9],yuksek=b.y>2.5||b.vy>4,KK=MOTOR_AYAR.kovalaKalici;
        for(let t=0;t<2;t++){let en=null,enT=1e9;
          for(const p of this.teams[t]){if(!p.oyunda||(p.eylem&&p.eylem.kilit))continue;
            /* kaleci kovalayan sayılmaz: serbest topa çıkıp çıkmayacağına kendisi karar verir (kaleciCikis, js/mac-kaleci.js); çıkmazsa topa bir saha oyuncusu gider */
            if(p.rol==='GK')continue;
            const k=this.yakalamaNoktasi(p,p.rol==='GK'?2.4:2.3),ek=b.hedefOyuncu===p?-0.35:0;if(k.t+ek<enT){enT=k.t+ek;en=p;}}
          /* T18a (kovalaKalici): savunan takımın (topa son dokunan rakip) o anki kovalayanı, yeni adaydan kovalaKalici sn'den az geç kalıyorsa kalır — topun her
             dokunuşu yeni bir yarış ve yeni bir hızlanma doğurmasın; pasın alıcısı (aşağıda) ve yüksek top hariç */
          if(KK>0&&K&&K.liste&&!yuksek&&b.sonTakim!=null&&b.sonTakim!==t){const p0=K.liste[t];
            if(p0&&p0!==en&&p0.oyunda&&p0.rol!=='GK'&&!(p0.eylem&&p0.eylem.kilit)&&b.hedefOyuncu!==en){const k0=this.yakalamaNoktasi(p0,2.3);if(k0.t-enT<=KK){en=p0;enT=k0.t;}}}
          kovalayan[t]=en;sure[t]=enT;}
        /* yüksek top: her takımdan iki oyuncu topun ineceği yere gider (hava mücadelesi) */
        kovalayan[2]=null;kovalayan[3]=null;
        const sure2=[1e9,1e9];   /* T23a1: ikinci adamın varışı (kovala2Pay) */
        if(yuksek)for(let t=0;t<2;t++){let en=null,enT=1e9;
          for(const p of this.teams[t]){if(!p.oyunda||p===kovalayan[t]||p.rol==='GK'||(p.eylem&&p.eylem.kilit))continue;
            const k=this.yakalamaNoktasi(p,2.3);if(k.t<enT){enT=k.t;en=p;}}
          if(en&&enT<3){kovalayan[2+t]=en;sure2[t]=enT;}}
        this._kov={surum:b.surum,kare:this.kare,liste:kovalayan,sure,yuksek,sure2};}
      /* top dışarı gidiyorsa ve son rakip dokunduysa: kullanım bizim; oyuncu topu dışarı bırakır */
      const son=this.topYolu(),dur=son[son.length-1];
      if(Math.abs(dur.x)>PL+0.3||dur.z<-0.3||dur.z>PW+0.3){const sonT=b.sonTakim;
        for(let t=0;t<2;t++){const k=kovalayan[t];if(!k||t===sonT)continue;
          const ka=this.yakalamaNoktasi(k,0.7);if(Math.abs(ka.x)>PL-3||ka.z<3||ka.z>PW-3){kovalayan=kovalayan.slice();kovalayan[t]=null;}}}
      /* pas bir takım arkadaşına gidiyorsa, o takımın kovalayanı alıcıdır */
      if(b.hedefOyuncu&&b.hedefOyuncu.oyunda&&!(b.hedefOyuncu.eylem&&b.hedefOyuncu.eylem.kilit)){kovalayan=kovalayan.slice();kovalayan[b.hedefOyuncu.team]=b.hedefOyuncu;}
    }
    /* hücumcular ofsayt çizgisini ~0,5 sn gecikmeyle okur: çizgi öne çıkınca ofsayta düşebilirler */
    const OF=this._ofsGecmis||(this._ofsGecmis={a:[],i:0});if(this.kare%6===0){OF.a[OF.i%6]=[ofsaytCizgisi(this,0),ofsaytCizgisi(this,1)];OF.i++;}
    this._ofs=OF.i>=5?OF.a[(OF.i-5)%6]:[ofsaytCizgisi(this,0),ofsaytCizgisi(this,1)];
    /* savunma bloğu topun yerine anında değil gecikmeyle kayar (hızlı pas dolaşımı boşluk açar). T1: her takım topun yerini kendi gözüyle
       yumuşatarak izler: tehlikede (savunmada top kalemize gelirken, hücumda top ileri giderken) çabuk (blokHizli sn), ters yönde yavaş
       (blokYumusak sn), yana ikisinin ortası. Geçmiş 0,05 sn aralıkla 0,8 sn tutulur; her bölge oyuncusu kendi tepki süresiyle
       (0,25–0,7 sn; karar, sezgi, yorgunluk) kayar, blok dalga gibi kayar. Markaj paylaşımı ~0,4 sn */
    const GG=this._topGecmis||(this._topGecmis=[0,1].map(()=>({x:new Float64Array(16),z:new Float64Array(16),i:0,ax:b.x,az:b.z})));
    const HT=this._hucumT||(this._hucumT=[false,false]);
    if(this.kare%3===0){const A=MOTOR_AYAR,ky=s=>s>0?Math.min(1,0.05/s):1,kS=ky(A.blokYumusak),kH=ky(A.blokHizli),kY=ky(0.5*(A.blokYumusak+A.blokHizli));
      for(let t=0;t<2;t++){const G=GG[t],fu=(b.x-G.ax)*this.dir[t];
        G.ax+=(b.x-G.ax)*((HT[t]?fu>0:fu<0)?kH:kS);G.az+=(b.z-G.az)*kY;G.x[G.i&15]=G.ax;G.z[G.i&15]=G.az;G.i++;}}
    const OG=this._odakG||(this._odakG={x:0,z:0,sahip:null,takim:-1});
    /* geçiş: topu kaybeden takım savunma düzenine bir gecikmeyle geçer (kontra atak anı) */
    if(sahipTakim>=0&&sahipTakim!==this._sonSahipTakim){this._kaybeden=this._sonSahipTakim;this._sonSahipTakim=sahipTakim;this._sahiplikBas=this.t;}
    const gecisSure=du?0:this.t-(this._sahiplikBas||0);
    /* T7a: takım niyeti ve maç durumu (js/mac-takim.js): etkin taktik ve düzen çarpanları */
    this.niyetAdim(dt,du);const NY=this._niyet;
    if(!du){this.presTetikAdim();this.duranSonrasiAdim();if(this._yatan)this.yatanAdim();}   /* Z2c: kalkan yatan barajcı */   /* T7d: pres tetikleyicileri (js/mac-takim.js); T8b: duran topun görev düzeni (js/mac-durantop.js) */
    for(let t=0;t<2;t++){
      const d=this.dir[t],bu=odak.x*d,tk=this.taktik[t];
      /* serbest topta (pas yolda, sekme, ikili mücadele) son dokunan değil son sahip olan takımın düzeni sürer: takım şekli her sekmede
         değişmez (T1, kararlı hedef) */
      const sonSahip=this._sonSahipTakim!=null?this._sonSahipTakim:b.sonTakim;
      /* T1'deki sekilGecikme (yeni kazanılan topta hücum düzenine geçme gecikmesi) 0'da kaldı; 2026-10-10 bakımında kaldırıldı */
      const hucum=sahipTakim===t||(sahipTakim<0&&sonSahip===t)||(sahipTakim===1-t&&gecisSure<MOTOR_AYAR.gecis&&!(du&&du.sahneT));   /* Z2a: sahneli duruşta savunan savunma düzeninde (eskiden iki takım da hücum düzenindeydi) */
      HT[t]=hucum;
      const G=GG[t],gecikmeli=du||G.i<=8?odak:{x:G.x[(G.i-9)&15],z:G.z[(G.i-9)&15],sahip:odak.sahip,takim:odak.takim};
      /* bölgesel pres: topa, top kendi bölgesine giren oyuncu çıkar (1. adam); diğerleri yerini korur.
         2. adam (kapatan) yalnızca kendi ceza sahası önünde ya da ileri preste */
      let pres1=null,pres2=null,pres3=null;
      /* karşı pres (MM2): top az önce kaybedildiyse en yakın üç oyuncu topa basar, kapatır ve en yakın pas yolunu keser */
      const karsi=!du&&sahipTakim===1-t&&b.sahip&&this._kaybeden===t&&gecisSure<MOTOR_AYAR.karsiPres*(0.6+tk.pres*0.8);
      if(karsi){const s=b.sahip,KL=MOTOR_AYAR.kapatKalici>0?(this._karsiL||(this._karsiL=[null,null])):null,o=KL&&KL[t];
        /* T18a (kapatKalici): karşı pres üçlüsü aynı sahiplik boyunca sabit (geçerli kaldıkça: oyunda, kilitsiz, 16 m içinde) — her kare en yakına atlamasın */
        const gec=q=>q&&q.oyunda&&!(q.eylem&&q.eylem.kilit)&&hyp(q.x-s.x,q.z-s.z)<16;
        if(o&&o.bas===this._sahiplikBas&&o.liste.every(q=>q===null||gec(q))){pres1=o.liste[0];pres2=o.liste[1];pres3=o.liste[2];}
        else{const L=[];
          for(const p of this.teams[t]){if(!p.oyunda||p.rol==='GK'||(p.eylem&&p.eylem.kilit))continue;L.push([hyp(p.x-s.x,p.z-s.z),p]);}
          L.sort((x,y)=>x[0]-y[0]||x[1].n-y[1].n);
          if(L[0]&&L[0][0]<12)pres1=L[0][1];if(L[1]&&L[1][0]<10)pres2=L[1][1];if(L[2]&&L[2][0]<14)pres3=L[2][1];
          if(KL)KL[t]={bas:this._sahiplikBas,liste:[pres1,pres2,pres3]};}}
      else if(!du&&((sahipTakim===1-t&&b.sahip)||(odak.sahip&&!b.sahip&&odak.takim===1-t))){   /* T18b: pas uçuşunda alıcıya göre (sanal sahip) */
        const s=odak.sahip;let e1=1e9,e2=1e9;const P1=this._pres1||(this._pres1=[null,null]),onceki=P1[t];
        for(const p of this.teams[t]){if(!p.oyunda||p.rol==='GK'||(p.eylem&&p.eylem.kilit))continue;
          /* T4: az önce geçilen savunmacı (1,5 sn) 1. adam olmaz: toparlanır, 2. adam öne çıkar */
          if(p._gecT!=null&&this.t-p._gecT<1.5)continue;
          const k=dizilisKonumu(tk.dizilis,p.n,bu,odak.z,false,NY[t]),bolge=hyp(k.u*d-s.x,k.w-s.z),simdi=hyp(p.x-s.x,p.z-s.z);
          /* T4: önceki 1. adam gecikme payı kadar avantajlı (kare kare değişmesin) */
          const puan=Math.min(bolge,simdi*1.2)+simdi*0.35-(p===onceki?MOTOR_AYAR.presHisterezis:0);
          if(puan<e1){e2=e1;pres2=pres1;e1=puan;pres1=p;}else if(puan<e2){e2=puan;pres2=p;}}
        /* orta sahada blok yerini korur: 1. adam ancak top kendi yarısına yaklaşınca ya da çok yakındaysa çıkar */
        /* T7d: pres tetiğinde (kötü ilk dokunuş, geri pas, sırtı dönük alıcı, çizgiye sıkışma) 1. adam daha uzaktan ve daha ileride çıkar, 2. adam serbest */
        const yp=MOTOR_AYAR.yorgunPres?1-MOTOR_AYAR.yorgunPres*(NY[t].yorgunPay||0):1;   /* T18d: yorgun takım daha az uzaktan çıkar */
        const tet=this.presTetikVar(t),R1=(tet?MOTOR_AYAR.presTetikMesafe:16)*yp,R2=(tet?11:7)*yp,B0=tet?-20:-8;
        /* T18a (presKalici): önceki 1. adama süzgeçte pay (çıkış eşiği giriş eşiğinden presKalici m geniş); süzgeçte elenen 1. adamın belleği silinmez */
        const pk=MOTOR_AYAR.presKalici>0&&pres1===onceki?MOTOR_AYAR.presKalici:0;if(MOTOR_AYAR.presKalici>0&&pres1)P1[t]=pres1;
        if(pres1&&(hyp(pres1.x-s.x,pres1.z-s.z)>R1+pk||(bu>B0+tk.pres*14&&hyp(pres1.x-s.x,pres1.z-s.z)>R2+pk)))pres1=null;
        /* T4: üstüne sürülen (çalımın hedefi olan) savunmacı 1. adamdır: ikili mücadeleye girer (bölgesinde kalırsa çalıma tepki vermiyordu) */
        const ch=s.calim&&s.calim.o;if(ch&&ch.team===t&&ch.oyunda&&ch.rol!=='GK'&&!(ch.eylem&&ch.eylem.kilit)&&ch!==pres1){if(pres2===ch)pres2=pres1;pres1=ch;}
        if(!(MOTOR_AYAR.presKalici>0)||pres1)P1[t]=pres1;
        const ileriPres=bu>lerp(34,6,tk.pres);
        if(!(bu<-PL+30||ileriPres||tet))pres2=null;
        /* T4 (2): bire bir örtüsü — 1. adam düellodaysa (çalımın hedefi) ya da sürücü ona 4,5 m içinde üstüne geliyorsa, 1. adamın kapatYakin
           m arkasındaki noktaya en yakın takım arkadaşı (kaleci, kilitli eylemdeki ve az önce geçilen hariç; 9 m içinde) 2. adam olur ve yakın
           kapatır (kapatYakin, mac-hareket.js). Eskiden orta sahada 2. adam yoktu: yardımcı bölgesinde duruyordu (c-1v1 [4b]: itiş anında topa
           5,8 m, hızı 1,7 m/sn; geçildikten sonra 1,5 sn'de kayıp %0) */
        if(pres1&&!pres2&&!(pres1.eylem&&pres1.eylem.kilit)){const s1=hyp(pres1.x-s.x,pres1.z-s.z);
          if(s.calim&&s.calim.o===pres1||s1<=4.5&&(s.vx*(pres1.x-s.x)+s.vz*(pres1.z-s.z))/(s1||1)>0.5){
            const kx=-d*PL-pres1.x,kz=MZ-pres1.z,kl=hyp(kx,kz)||1,K=MOTOR_AYAR.kapatYakin,hx=pres1.x+kx/kl*K,hz=pres1.z+kz/kl*K;let en=null,ed=81;
            for(const q of this.teams[t]){if(q===pres1||!q.oyunda||q.rol==='GK'||(q.eylem&&q.eylem.kilit)||this.t-q._gecT<1.5)continue;
              const dd=(q.x-hx)*(q.x-hx)+(q.z-hz)*(q.z-hz);if(dd<ed){ed=dd;en=q;}}
            if(en){pres2=en;en._kapatK=this.kare;}}}
        /* T18a (kapatKalici): 2. adam kapatKalici sn tutulur — geçerliyse (oyunda, kilitsiz, 1. adam değil, 14 m içinde); yeni seçim pencere dolunca */
        if(MOTOR_AYAR.kapatKalici>0){const P2=this._pres2||(this._pres2=[null,null]),o2=P2[t];let tut=false;
          if(o2&&o2.p!==pres2&&this.t-o2.t<MOTOR_AYAR.kapatKalici&&o2.p.oyunda&&!(o2.p.eylem&&o2.p.eylem.kilit)&&o2.p!==pres1&&hyp(o2.p.x-s.x,o2.p.z-s.z)<14){pres2=o2.p;tut=true;}
          if(pres2&&!(o2&&o2.p===pres2))P2[t]={p:pres2,t:this.t};else if(!pres2)P2[t]=null;
          else if(MOTOR_AYAR.kapatSon&&!tut)o2.t=this.t;}   /* T23a3 (kapatSon): kendiliğinden yeniden seçildikçe tutma süresi tazelenir */
      }
      const cizgi=this.savunmaCizgisi(t,hucum,odak);
      /* T7b: geride kalanlar ve koridor sahipliği (6 karede bir; js/mac-takim.js) */
      if(!du){this.gerideKalanlar(t);this.koridorAta(t,gecikmeli);}
      /* T5e (2026-10-09; gerçekçilik planı T5 madde 8): kaleci yerdeyken (uçuş, kapanma, kalkış) top kendi ceza sahamızda sahipsizse kovalayanlar
         dışındaki en yakın saha oyuncusu kale çizgisine koşar (direklerin arası; topun hizasıyla kale ortasının ortası, 0,5 m önde) */
      let cizgiBek=null,cbx=0,cbz=0;
      if(!du&&sahipTakim<0&&!b.tasiyan&&this.cezaSahasi(t,b.x,b.z)){const gk=this.teams[t].find(q=>q.rol==='GK'&&q.oyunda);
        /* T7d: kaleci kalesinden 7 m'den uzağa çıktıysa da (plan T7 madde 8) */
        if(gk&&(gk.eylem&&gk.eylem.kilit||Math.hypot(gk.x+this.dir[t]*PL,gk.z-MZ)>7)){cbx=-this.dir[t]*(PL-0.5);cbz=MZ+clamp((b.z-MZ)*0.5,-2.6,2.6);let ed=1e9;
          for(const q of this.teams[t]){if(!q.oyunda||q.rol==='GK'||q===kovalayan[t]||q===kovalayan[2+t]||q.eylem&&q.eylem.kilit)continue;
            const dd=(q.x-cbx)*(q.x-cbx)+(q.z-cbz)*(q.z-cbz);if(dd<ed){ed=dd;cizgiBek=q;}}}}
      /* T5e: dönen top — top bir ceza sahasında sahipsizken iki takımın kovalayanı da tam eforla gider (kimse topu seyretmez; eskiden rakibinden
         0,5 sn'den geç yetişecek kovalayan rahat ivmeyle yaklaşıyordu) */
      const donen=!du&&sahipTakim<0&&!b.tasiyan&&(this.cezaSahasi(0,b.x,b.z)||this.cezaSahasi(1,b.x,b.z));
      if(!hucum){this.markajAta(t,du?odak:gecikmeli,cizgi);this.kutuSavunmaAta(t,du?odak:gecikmeli);}
      else if(!MOTOR_AYAR.markajKalici){if(this._markaj)this._markaj[t]=new Map();if(this._kutuSav)this._kutuSav[t]=new Map();}   /* T18c: markajKalici'de haritalar durur */
      if(!hucum&&MOTOR_AYAR.kosuSil)for(const p of this.teams[t]){const k=p.kosu;if(k&&(k.tur==='arkaya'||k.tur==='genis'||k.tur==='gel'||k.tur==='aldatma'))p.kosu=null;}   /* T18c: derin koşu top kaybında biter */
      /* T19a: rakibin şut hazırlığı (vuruş eylemi, temastan önce; penaltı ve serbest vuruş hariç) — yakındaki savunmacılar hatta atılır (sutHamleYap) */
      let sutE=null;if(MOTOR_AYAR.sutHamle&&!du)for(const q of this.teams[1-t]){const e=q.eylem;if(q.oyunda&&e&&e.ad==='vurus'&&e.faz!=='takip'&&e.sec&&e.sec.tur==='sut'&&!e.sec.penalti&&!e.sec.serbest){sutE=e;break;}}
      for(const p of this.teams[t]){
        if(!p.oyunda)continue;
        /* T13-0: görev etiketi (gorevYaz; salt okunur) — atlanan oyuncular da etiketlenir */
        if(p===b.sahip||b.tasiyan===p){this.gorevYaz(p,'sahip');continue;}
        const e=p.eylem;if(e&&(e.kilit||e.ad==='vurus'||e.ad==='tac'||e.ad==='mudahale')){this.gorevYaz(p,'eylem');continue;}
        if(du&&du.kullanan===p){this.gorevYaz(p,'kullanan');continue;}
        if(this.degisiklik&&(this.degisiklik.cikan===p||this.degisiklik.giren===p)&&!this.degisiklik.girdi){this.gorevYaz(p,'degisiklik');continue;}
        p.yonHedef=null;p.bak=b;p.hizOran=0.7;
        /* efor (T1): kaleci (kaleciKonum), kovalama ve pres tam; karşı pres 0,9; 2. adam 0,8; bölge ve görevler bolgeKonumu'nda */
        if(p.rol==='GK'){   /* T8b: kutuya çıkan kaleci vuruştan sonraki pencerede görevini izler */
          if(this._duranSonrasi&&p.duranRol&&DT_HEDEF.has(p.duranRol.rol)){const r=this.duranRolKonum(p);if(r){this.gorevYaz(p,'duran');this.hedefVer(p,r.x,r.z,r.ef,false,false);p.hizOran=r.h;continue;}}
          this.gorevYaz(p,'kaleci');this.kaleciKonum(p,dt);continue;}
        /* T1: topa rakibinden açıkça geç yetişecek kovalayan (kovalaPay sn) çekişmeye koşmaz, rahat ivmeyle yaklaşır; pasın alıcısı ve
           yüksek topta kovalayan tam eforla (rahat karşılayan alıcı geç kalıp pası kaybediyordu) */
        if(p===kovalayan[t]){const K=this._kov,S=K&&K.sure,f=S?S[t]-S[1-t]:0,K2=MOTOR_AYAR.kovala2Pay;this.gorevYaz(p,'kovala');
          /* T23a1 (kovala2Pay): yüksek topta da açıkça geç kalacak (rakibin en erken varışından K2 sn'den çok) ve inişe 1 sn'den uzak kovalayan depar atmaz */
          const yuksekGec=!!(K2>0&&K&&K.yuksek&&S&&S[t]>1&&S[t]-Math.min(S[1-t],K.sure2?K.sure2[1-t]:1e9)>K2);
          this.kovala(p,(K&&K.yuksek&&!yuksekGec)||p===b.hedefOyuncu||donen||(!(K&&K.yuksek)&&f<=MOTOR_AYAR.kovalaPay)?1:0.5);continue;}
        if(p===kovalayan[2+t]){const K=this._kov,S=K&&K.sure,K2=MOTOR_AYAR.kovala2Pay,s2=K&&K.sure2?K.sure2[t]:0;this.gorevYaz(p,'kovala2');
          this.kovala(p,K2>0&&!donen&&s2>1&&S&&s2-Math.min(S[1-t],K.sure2[1-t])>K2?0.5:1);continue;}
        if(p===cizgiBek){this.gorevYaz(p,'cizgi');p.tx=cbx;p.tz=cbz;p.hizOran=1;this.eforVer(p,1);continue;}   /* T5e */
        if(sutE&&p.rol!=='GK'&&this.sutHamleYap(p,sutE)){this.gorevYaz(p,'blok');continue;}   /* T19a */
        /* T18b: pas uçuşunda (sanal sahip) 1. adam alıcıya kapatır (presYap değil), 2. ve 3. adam alıcıya göre */
        if(p===pres1){this.gorevYaz(p,'pres1');this.eforVer(p,karsi?0.9:1);if(b.sahip)this.presYap(p,b.sahip,dt);else this.kapat(p,odak.sahip);continue;}
        if(p===pres2){const yakin=MOTOR_AYAR.kapatKalici>0?(pres1!=null&&p._kapatK!=null&&this.kare-p._kapatK<=Math.round(60*MOTOR_AYAR.kapatKalici)):p._kapatK===this.kare;this.gorevYaz(p,'pres2');this.eforVer(p,yakin?1:karsi?0.9:0.8);if(yakin&&b.sahip)this.kapatYakin(p,b.sahip,pres1,dt);else this.kapat(p,odak.sahip);continue;}
        if(p===pres3){this.gorevYaz(p,'pres3');this.eforVer(p,0.9);this.yolKapat(p,odak.sahip);continue;}
        let od=odak,hucumP=hucum;const tp0=clamp(0.62-0.22*p.oz.karar-0.12*p.oz.gorus+0.2*p.yorgunluk,0.25,0.7);
        /* T18b (gecisDalga): top kaybında topa 12 m'den uzak oyuncu savunma düzenine kişisel gecikmeyle geçer (gecis + dalga·tepki payı); efor değişmez */
        if(MOTOR_AYAR.gecisDalga>0&&!du&&!hucum&&this._kaybeden===t&&sahipTakim===1-t&&gecisSure<MOTOR_AYAR.gecis+MOTOR_AYAR.gecisDalga*(tp0-0.25)/0.45&&hyp(p.x-b.x,p.z-b.z)>12)hucumP=true;
        if(!du&&(!hucumP||MOTOR_AYAR.hucumGecikme&&(MOTOR_AYAR.hucumGecikme>1||p.x*d<b.x*d))){/* kişisel tepki: topun tp sn önceki (yumuşatılmış) yeri */
          const tp=tp0*MOTOR_AYAR.tepkiCarpan,n=Math.min(15,Math.round(tp*20));
          if(G.i>n){const j=(G.i-1-n)&15;OG.x=G.x[j];OG.z=G.z[j];OG.sahip=odak.sahip;OG.takim=odak.takim;od=OG;}}
        this.bolgeKonumu(p,t,hucumP,cizgi,dt,od);
        if(b.sahip&&b.sahip.team!==t)this.yanindanGec(p,b.sahip);   /* T5: bölge oyuncusu da topu sürenin içinden geçmez */
      }
    }
  },
  /* oyuncunun topa yetişebileceği en erken nokta (top yolundan). yukseklik: erişebildiği top yüksekliği.
     M0 (2026-10-07, sonucu değiştirmez): varisZamani'nin alt sınırı (düz çizgi uzaklığı − menzil) / vk'dir; vk anlık hız ile tepe hızın büyüğü
     (modelin hiçbir evresi bundan hızlı gitmez). Bu sınırla 0,05 sn payla bile yetişemeyeceği kesin noktada varisZamani çağrılmaz */
  yakalamaNoktasi(p,yukseklik){
    const yol=this.topYolu(),t0=this.t-this._yolT0,i0=Math.max(0,Math.round(t0*60)-1);
    const vk=Math.max(hyp(p.vx,p.vz),hrkTepe(p)),px=p.x,pz=p.z;
    let onceki=null;
    for(let i=i0;i<yol.length;i+=3){const s=yol[i],t=(i-i0)/60;if(s.y>yukseklik)continue;
      /* top durduysa sonraki noktalar aynıdır */
      if(onceki&&s.v<0.05&&s.y<0.01&&onceki.v<0.05)return{x:s.x,z:s.z,t:Math.max(t,varisZamani(p,s.x,s.z,0.4,0.15))};
      onceki=s;
      const r=0.45+vk*(t-0.05),dx=s.x-px,dz=s.z-pz;if(r<=0||dx*dx+dz*dz>r*r)continue;
      /* topa ondan biraz önce varabileceği ilk nokta (güvenlik payı 0,1 sn) */
      if(varisZamani(p,s.x,s.z,0.45,0.15)+0.1<=t)return{x:s.x,z:s.z,t};}
    const s=yol[yol.length-1];return{x:s.x,z:s.z,t:3.5+hyp(s.x-p.x,s.z-p.z)/p.maxSpd};
  },
  /* düz savunma çizgisi (takımın çerçevesinde u): top önü açık ve ileri bakan birindeyse geri çekil, geri pasta çık */
  savunmaCizgisi(t,hucum,odak){
    const d=this.dir[t],bu=odak.x*d,B=hucum?BLOK.hucum:BLOK.savunma,N=this._niyet&&this._niyet[t];let u=B.cizgi(bu)+(N?(hucum?N.derinlik:N.blok):0);
    if(!hucum){
      const s=odak.sahip;
      if(s&&s.team!==t){const bA=baskiAltinda(this,s),onuAcik=bA<0.3,ileriBakar=Math.cos(s.yon)*(-d)>0.3;if(onuAcik&&ileriBakar)u-=4;
        /* T7d (plan T7 madde 8, ofsayt çizgisi): top baskıdaysa ya da sürücünün sırtı bize dönükse hat birlikte öne çıkar */
        else if(MOTOR_AYAR.hatCik&&(bA>0.5||Math.cos(s.yon)*(-d)<-0.3))u+=MOTOR_AYAR.hatCik;}
      u=Math.min(u,bu-4);
      /* rakip forvetlerin arkaya kaçmasına izin verme: en derindeki rakipten çok önde durma */
      let enDerin=99;for(const o of this.teams[1-t])if(o.oyunda&&o.rol!=='GK')enDerin=Math.min(enDerin,o.x*d);
      /* Z3: yüksek hatlı tarz (blokCizgi > 0) en derindeki forvetin önünde de durabilir — onu ofsayta bırakır, geri iter */
      {const V=tarzTakim(this,t);u=Math.min(u,enDerin+2.5+(V?MOTOR_AYAR.tarzEtki*Math.max(0,V.blokCizgi)*0.8:0));}
    }
    return clamp(u,-PL+6,20);
  },
  /* T13-0 (2026-10-13): görev etiketi — p.gorevAd bu karedeki görev; değişince önceki görev ve başlangıç anı (p._gorevOnce, p._gorevT).
     Rastlantısız, salt okunur (ölçüm; T13 eforu) */
  gorevYaz(p,ad){if(p.gorevAd!==ad){p._gorevOnce=p.gorevAd;p.gorevAd=ad;p._gorevT=this.t;}},
  /* bölge, destek, koşu ve markaj */
  bolgeKonumu(p,t,hucum,cizgi,dt,odak){
    /* T8b: duran topun görev düzeni (vuruştan sonra en çok 6 sn; js/mac-durantop.js duranRolKonum) */
    if(this._duranSonrasi&&p.duranRol){const r=this.duranRolKonum(p);if(r){this.gorevYaz(p,'duran');this.hedefVer(p,r.x,r.z,r.ef,false,false);p.hizOran=r.h;return;}}
    /* Z3 (kurma&4): rakibin kale vuruşunda yüksek pres — presçi kısa seçeneğinin yanında (topa doğru; ceza sahası dışında: durusYerlesim) */
    {const DU=this.durus;if(DU&&DU.kvPres){const q=DU.kvPres.get(p);if(q&&q.oyunda){this.gorevYaz(p,'kvPres');this.hedefVer(p,q.x+(DU.x-q.x)*0.12,q.z+(DU.z-q.z)*0.12,0.7,false,false);p.hizOran=0.8;return;}}}
    const d=this.dir[t],bu=odak.x*d,bw=odak.z,diz=this.taktik[t].dizilis,N=this._niyet&&this._niyet[t];
    const k=dizilisKonumu(diz,p.n,bu,bw,hucum,N);let u=k.u,w=k.w,markajda=null,ef=0,zorla=false,g='bolge';   /* g: T13-0 görev etiketi */
    if(p.rol==='DEF'&&!hucum)u=cizgi+(p.mevki.bek?0.6:0);
    if(hucum){
      const ofs=this._ofs[t],s=odak.sahip;
      /* T7b (js/mac-takim.js): koridor sahipliği yanal yeri verir; kurmada stoperler, bekler ve altı numara kurma dizilişinde; geride kalanlar
         (top rakip yarısındayken) koşmaz, bindirmez, destek ve ceza sahası rolü almaz */
      /* Z3b (kurma&2): kale vuruşunda (duruş) kurma şekli tarzdan — kısa kuran stoperleri ceza sahasında açar, altıyı indirir; uzun atan yükselir */
      const kvD=(MOTOR_AYAR.kurma&2)&&this.durus&&this.durus.tur==='kaleVurusu'&&this.durus.takim===t?this.durus:null;
      const KR=this._koridor&&this._koridor[t],GR=this._geride&&this._geride[t],geride=!!(GR&&GR.has(p))&&bu>0,kurma=!!(N&&N.ad==='kur'&&s&&s.team===t)||!!kvD;
      if(KR&&KR.has(p))w=KR.get(p);
      if(kurma){const k2=kvD?this.kvKonumu(p,t,k,N,bw):this.kurmaKonumu(p,t,k,N,bw);if(k2){u=k2.u;w=k2.w;}}
      /* ortaya koşu rolleri: top kanatta ve son üçte birde */
      const orta=bu>PL-30&&Math.abs(bw-MZ)>11&&s&&s.team===t;
      /* T6d: ortanın alıcısı ortanın noktasına koşar (js/mac-topla.js vurusBaslat); top ayaktan çıkana dek ofsayt çizgisinin gerisinde */
      const oK=p.kosu&&p.kosu.tur==='orta'?p.kosu:null;
      if(oK){oK.t-=dt;if(oK.t<=0||!s||s.team!==t){p.kosu=null;}else{u=Math.min(oK.u,ofs-0.4);w=oK.w;p.hizOran=1;ef=1;g='orta';}}
      if(orta&&!p.kosu){const r=geride?null:this.kutuRolu(p,t,bw);if(r&&!this.kapiGecik(p,t,'kutu',true,MOTOR_AYAR.kapiFaz)){u=r.u;w=r.w;p.hizOran=0.95;ef=0.8;g='kutu';}}   /* T23a3: kapiFaz */
      else if(s&&s.team===t&&!(p.kosu&&p.kosu.tur==='orta')){
        /* T14a: kanat rolü — genişlik, derinlik, uzak kanatta arka direk (js/mac-takim.js kanatKonumu); kanat destek noktası aramaz */
        const kr=kurma?null:this.kanatKonumu(p,t,s,ofs,geride);
        if(kr){u=kr.u;w=kr.w;ef=kr.ef;g=kr.g;}
        /* destek: topa en yakın iki oyuncu açık pas yoluna gelir (T7b: kurmada stoperler ve bekler yerinde kalır) */
        else if(!geride&&!(kurma&&p.rol==='DEF')&&this.destekci(p,s)){const n=this.destekNoktasi(p,s,dt);if(n){u=n.u;w=n.w;p.hizOran=0.8;ef=0.6;g='destek';}}
        /* derin koşu: forvet (ve bazen kanat) topu tutan ileri bakınca savunmanın arkasına */
        const kosu=geride?null:this.derinKosu(p,s,ofs,dt);if(kosu){u=kosu.u;w=kosu.w;p.hizOran=1;ef=1;g='kosu';}
        /* bindirme: aynı kanatta top ilerideyse bek dışından geçer (kanatta ikiye bir) */
        const ayniKanat=Math.sign(s.z-MZ)===Math.sign(p.mevki.w-MZ)&&Math.abs(s.z-MZ)>10;
        if(!geride&&p.mevki.bek&&ayniKanat&&s!==p&&s.x*d>-5&&(!N||N.bekCik)){
          /* Z4c (bindirme&4; B.4): zamanlı bindirme — kanat topla rakibiyle yüz yüzeyken (9 m içinde) bek arkadan geçer; yoksa kanadın gerisinde destek */
          let ik=s.mevki.kanat?6:-4;if(MOTOR_AYAR.bindirme&4&&s.mevki.kanat&&enYakinRakip(this,s.x,s.z,t).d>=9)ik=-3;
          u=Math.max(u,s.x*d+ik);w=p.mevki.w<MZ?3.5:PW-3.5;p.hizOran=0.95;ef=0.8;g='bindirme';
          /* Z4c (bindirme&1; B.5): iç bindirme — kısa kuran tarzda (bekIceri ≥ 0,5) kanat çizgideyken bek kanatla stoperin arasındaki iç koridordan geçer */
          if(MOTOR_AYAR.bindirme&1&&s.mevki.kanat&&Math.abs(s.z-MZ)>=22){const V=tarzTakim(this,t);if(V&&V.bekIceri>=0.5){u=Math.max(u,s.x*d+5);w=MZ+(p.mevki.w<MZ?-13:13);g='icBindirme';}}}
        /* uzak kanat: top öbür kanatta ve ilerideyse içeri, ceza sahasına kayar (T7b: son bölge dışında genişliği tutar — yüklenip çevirmenin hedefi) */
        if(!kr&&p.mevki.kanat&&!ayniKanat&&Math.abs(s.z-MZ)>10&&s.x*d>10){u=Math.max(u,ofs-4);w=lerp(w,MZ,N&&N.ad!=='sonBolge'?0.15:0.55);ef=Math.max(ef,0.5);if(g==='bolge')g='uzakKanat';}
        /* T7a: geride son dakikalar — kafası en iyi stoper forvet hattına çıkar (maç durumu, js/mac-takim.js) */
        if(N&&N.stoperIleri===p&&bu>-5){u=Math.max(u,ofs-4);w=MZ+(p.mevki.w<MZ?-3:3);p.hizOran=0.95;ef=Math.max(ef,0.8);g='stoperIleri';}
      }
      /* forvet savunmanın omzunda, kanat biraz gerisinde bekler; koşu yapmayan hücumcu ofsayta düşmez */
      if(!p.kosu&&s&&s.team===t){if(p.rol==='FV')u=Math.max(u,ofs-(p.mevki.hedef?1.2:2.5));else if(p.mevki.kanat&&bu>-10)u=Math.max(u,ofs-9);}
      /* T7e: şutu takip koşusu (top sahipsizken; js/mac-takim.js sutTakipAta) */
      if(p.kosu&&p.kosu.tur==='takip'){p.kosu.t-=dt;if(p.kosu.t<=0||this.ball.sahip)p.kosu=null;else{u=p.kosu.u;w=p.kosu.w;p.hizOran=1;ef=1;g='takip';}}
      /* T14b: kutuya geç giriş (js/mac-takim.js gecGirisAta) — top ortacıdayken ofsayt çizgisinin gerisinde, top ayaktan çıkınca hedefe; süre
         bitince ya da top rakibe geçince biter */
      if(p.kosu&&p.kosu.tur==='gecGiris'){const k=p.kosu;k.t-=dt;if(k.t<=0||s&&s.team!==t)p.kosu=null;else{u=s?Math.min(k.u,ofs-0.4):k.u;w=k.w;p.hizOran=1;ef=1;g='gecGiris';}}
      /* Z1 (H2): plan rolü (js/mac-plan.js planRolKonumu) — bağlılık süresince öbür görevlerin önünde; top yoldayken de (sahip null) */
      let plR=false;if(this._pln){const r=this.planRolKonumu(p,t);if(r){u=r.u;w=r.w;ef=r.ef;p.hizOran=r.h;g=r.g;plR=true;}}
      /* T7b: geride kalan topun 12 m gerisinde, rakip yarısının 5 m'sini geçmez, merkezi kapatır */
      if(geride){u=Math.min(u,bu-12,5);w=clamp(w,MZ-16,MZ+16);}
      /* Z1: plan rolünde çizgi topu da sayar (topun gerisindeki oyuncu ofsaytta değildir; geri çevirmenin kutu rolleri) */
      const ofsK=plR?Math.max(ofs,this.ball.x*d):ofs;
      if(!p.kosu&&u>ofsK-0.6&&u>0)u=ofsK-0.6;
      /* kararlı hedef ofsayttaysa hemen geri (T1) */
      zorla=!p.kosu&&p._hdfX*d>ofsK-0.3&&p._hdfX*d>0;
    }else{
      /* kendi ceza sahası çevresinde adam markajı */
      markajda=this.markaj(p,t,odak);
      /* T23a3 (kapiFazSav): top 32 m içine girince açılan markaj kapısında oyuncu rolü tepki süresi × çarpan kadar sonra alır; adamı 6 m içinde kaleye koşuyorsa hemen */
      if(markajda&&MOTOR_AYAR.kapiFazSav>0){const yk=odak.x*this.dir[t]<=-PL+32,M=this._markaj&&this._markaj[t],o=M&&M.get(p);
        const acil=!!o&&hyp(o.x-p.x,o.z-p.z)<6&&-o.vx*this.dir[t]>2;if(this.kapiGecik(p,t,'markaj',yk,MOTOR_AYAR.kapiFazSav)&&!acil)markajda=null;}
      if(markajda){u=markajda.u;w=markajda.w;ef=1;g='markaj';}
      /* T7d: orta savunması — markajı olmayan bölgesini tutar (kutuSavunmaAta) */
      else{const KZ=this._kutuSav&&this._kutuSav[t],z=KZ&&KZ.get(p);
        /* T23a3 (kapiFazSav): kutu savunması kapısı da oyuncuya göre gecikmeli; top ceza sahasındaysa hemen */
        const kg=!!z&&MOTOR_AYAR.kapiFazSav>0&&this.kapiGecik(p,t,'kutuSav',true,MOTOR_AYAR.kapiFazSav)&&odak.x*this.dir[t]>-PL+16.5;
        if(z&&!kg){markajda=z;u=z.u;w=z.w;ef=1;g='kutuSav';}}
      /* T7e: dönen top — şuttan sonra 1,5 sn kaleciye en yakın stoper kale önünü, uzak bek uzak direği tutar */
      const DS=this._donenSav;if(DS&&DS.team===t&&this.t-DS.t<1.5){const z=DS.M.get(p);if(z){markajda=z;u=z.u;w=z.w;ef=1;g='donenSav';}}
    }
    u=clamp(u,-PL+0.5,PL-0.8);w=clamp(w,0.8,PW-0.8);
    /* efor (T1): görevin eforu (koşu ve markaj 1, bindirme ve ceza sahasına koşu 0,8, destek 0,6, uzak kanat 0,5); yoksa bölge 0,25–0,5
       (hedefe uzaklık, top kendi kalesine yakınsa tehlike) × çalışkanlık (T3: profilin çalışkanlığı × gün formu; rol ve yorgunluk).
       Dinlenme: top dinlenUzak'tan uzak ve yakında koşan rakip yokken 0,15 (yürür, yüzü topa) */
    const b=this.ball,db=hyp(p.x-b.x,p.z-b.z);
    if(!ef){const uz0=hyp(u*d-p.x,w-p.z),tehlike=hucum?0:clamp((45-(b.x*d+PL))/25,0,1);
      const pr=p.profil,calis=(pr?(0.7+0.6*pr.alt.caliskanlik)*pr.form:0.85+0.3*p.oz.dayaniklilik)*(p.rol==='OS'?1.1:p.rol==='FV'?0.9:1)*(1-0.3*p.yorgunluk);
      ef=clamp((0.25+0.2*clamp((uz0-3)/12,0,1)+0.15*tehlike)*calis,0.2,0.55);
      /* hücumda topun önündeki oyuncu (ofsayt çizgisi, koşu) dinlenmez */
      if(db>MOTOR_AYAR.dinlenUzak&&!(hucum&&p.x*d>b.x*d-5)&&!this.tehditVar(p,hucum)){ef=0.15;g='dinlen';}}
    /* düz savunma çizgisi: savunmacının derinliği hep güncel, ölü bölge yalnız yana */
    /* hücumda forvet savunmanın omzunda (ofsayt çizgisi) kalır: derinliği hep güncel, yerinden 3 m'de döner */
    const omuz=hucum&&p.rol==='FV'&&!p.kosu&&bu>-10;if(omuz&&ef<0.6)ef=0.6;
    if(g==='bolge'){if(omuz)g='omuz';else if(p.rol==='DEF'&&!hucum)g='hat';}
    this.gorevYaz(p,g);
    this.hedefVer(p,u*d,w,ef,(p.rol==='DEF'&&!hucum&&!markajda)||omuz,zorla);
    /* hız: düşük eforda kip seçer (moveP); görevde hedefe uzaklığa göre (yakınsa yavaş, uzaksa koşar). Savunmaya dönüşte topa uzak olan
       tam hızla koşmaz */
    const uzak=hyp(p.tx-p.x,p.tz-p.z);
    if(ef<0.8)p.hizOran=1;else{p.hizOran=Math.max(p.hizOran,clamp(0.45+uzak/16,0.45,1));if(uzak<2.5)p.hizOran=Math.min(p.hizOran,0.55);}
    if(!hucum&&db>15)p.hizOran=Math.min(p.hizOran,MOTOR_AYAR.donus);
    /* markajdaki oyuncu adamını yavaşlamadan izler */
    if(!hucum&&markajda)p.hizOran=1;
  },
  /* tehdit (T1 dinlenme): 10 m içinde 4 m/sn'den hızlı koşan rakip; savunmada top oyuncunun gerisinde ya da kendi 35 m'mizde */
  tehditVar(p,hucum){
    if(!hucum){const d=this.dir[p.team],bu=this.ball.x*d;if(bu<p.x*d||bu+PL<35)return true;}
    for(const o of this.teams[1-p.team])if(o.oyunda&&o.spd>4&&hyp(o.x-p.x,o.z-p.z)<10)return true;
    return false;
  },
  destekci(p,s){
    if(p.rol==='GK'||p===s)return false;
    const dp=hyp(p.x-s.x,p.z-s.z);
    /* T7c: merkez orta saha (kanat değil) topa 28 m içindeyken hep destek noktası arar — topu almak için görünür (orta saha atlanıyordu: maçta
       karar sayısı stoper 126, bek 131, forvet 115, merkez 40; pasların %12'si merkeze). Önce bu kural (sıralama döngüsü gereksiz kalır) */
    if(MOTOR_AYAR.osDestek&&p.rol==='OS'&&!p.mevki.kanat&&dp<MOTOR_AYAR.osDestek)return true;
    if(dp>=32)return false;
    let sira=0;for(const q of this.teams[p.team])if(q!==p&&q!==s&&q.oyunda&&q.rol!=='GK'&&hyp(q.x-s.x,q.z-s.z)<dp&&++sira>=3)return false;
    return true;
  },
  /* ceza sahasına koşu rolleri */
  kutuRolu(p,t,bw){
    const yan=Math.sign(bw-MZ)||1,m=p.mevki;
    if(m.hedef)return{u:PL-5.5,w:MZ+yan*2.2};         // ön direk: hedef forvet
    if((m.cizgi==='FV'&&!m.kanat)||m.onOrta)return{u:PL-7,w:MZ-yan*3.5};   // arka direk: ikinci forvet ya da 10 numara
    if(m.kanat&&Math.sign(m.w-MZ)!==yan)return{u:PL-9,w:MZ-yan*6};  // uzak kanat: arka direğin gerisi
    /* T14a: aynı kanattaki kanat (topu tutan değil) ceza sahasına yakın yarım alana: geri çevirmenin ve ikinci topun alıcısı (eskiden orta saha
       mevkili kanat penaltı noktasına, kanat forveti hiçbir role gitmiyordu) */
    if(m.kanat&&MOTOR_AYAR.kanatRol)return{u:PL-13,w:MZ+yan*11};
    if(m.cizgi==='OS'&&!m.derin)return{u:PL-12.5,w:MZ+yan*1};  // penaltı noktası
    if(m.derin)return{u:PL-20,w:MZ-yan*2};           // ceza sahası dışı, ikinci top
    return null;
  },
  /* markaj paylaşımı (MM2): top kendi kalesine yakınken savunma ve orta saha oyuncuları tehlikeli bölgedeki rakiplerle TEKİL eşleşir.
     Önceki eşleşme geçerli ve 12 m'den yakınsa korunur (markaj sürekli el değiştirmez); kalanlar en yakın çiftten başlayarak dağıtılır
     (savunmacı 14 m, orta saha 10 m içinde). Eşleşmesi olmayan bölgesinde kalır. 6 karede bir hesaplanır */
  /* T7d: koşucu takibi (plan T7 madde 8) — top uzaktayken de çizginin arkasını tehdit eden, kalemize ≥ 4 m/sn koşan rakip (savunma çizgisinin 10 m
     gerisi ile 3 m önü arası) savunmacıya aynı kuralla (önceki eşleşme 12 m içinde korunur, kalanlar en yakın çiftten) eşlenir; koşu bitince
     bırakılır, koşucu başka savunmacının bölgesine geçince yeniden dağıtılır (devir). T7g: ilk sürümde çizginin 20 m önüne kadar her koşucu ve
     derin orta sahalar da takipteydi — bölgesel savunmada gerçekçi değil, ceza sahasına giriş %34 düşmüştü */
  markajAta(t,odak,cizgi){
    const M=this._markaj||(this._markaj=[new Map(),new Map()]),eski=M[t];
    if(eski._kare!=null&&this.kare-eski._kare<6)return eski;
    const d=this.dir[t],yeni=new Map(),b=this.ball;yeni._kare=this.kare;M[t]=yeni;
    const yakin=odak.x*d<=-PL+32;
    if(!yakin&&!(MOTOR_AYAR.kosucuTakip&&cizgi!=null))return yeni;
    const S=this.teams[t].filter(p=>p.oyunda&&(p.rol==='DEF'||yakin&&p.rol==='OS')&&!(p.eylem&&p.eylem.kilit));
    const eskiR=MOTOR_AYAR.markajKalici?new Set(eski.values()):null;   /* T18c: koşucu takibinde histerezis (takip edilen koşucu 3,2 m/sn'ye dek takipte kalır) */
    const R=this.teams[1-t].filter(o=>o.oyunda&&o.rol!=='GK'&&(yakin?o.x*d<=-PL+24:o!==b.sahip&&-o.vx*d>(eskiR&&eskiR.has(o)?3.2:4)&&o.x*d<cizgi+3&&o.x*d>cizgi-10));
    const S2=new Set(),R2=new Set();
    for(const [p,o] of eski)if(S.includes(p)&&R.includes(o)&&hyp(p.x-o.x,p.z-o.z)<12){yeni.set(p,o);S2.add(p);R2.add(o);}
    const C=[];
    for(const p of S){if(S2.has(p))continue;const sinir=p.rol==='DEF'?14:8;
      for(const o of R){if(R2.has(o))continue;const dd=hyp(p.x-o.x,p.z-o.z);if(dd<sinir)C.push([dd,p,o]);}}
    C.sort((x,y)=>x[0]-y[0]||x[1].n-y[1].n||x[2].n-y[2].n);
    for(const [,p,o] of C)if(!S2.has(p)&&!R2.has(o)){yeni.set(p,o);S2.add(p);R2.add(o);}
    return yeni;
  },
  /* markaj: eşleştiği rakibi kale tarafından 1,2 m'den tut */
  /* T23a3: eşik kapısı oyuncuya göre gecikmeli — kapı (takım, ad) açıldığı an tutulur (son görüldüğü kareden 0,05 sn'den eskiyse yeniden açılmış sayılır);
     oyuncu rolü kendi tepki süresi (0,25–0,7 sn: karar, görüş, yorgunluk; takimAI'daki tp0) × faz kadar sonra alır. Döner: hâlâ bekliyor mu. Saf (zar yok) */
  kapiGecik(p,t,ad,acik,faz){
    if(!(faz>0))return false;const K=this._kapi||(this._kapi=[{},{}]),k=K[t];
    if(!acik){k[ad]=null;return false;}
    let q=k[ad];if(!q||this.t-q.S>0.05){q=k[ad]={T:this.t,S:this.t};}else q.S=this.t;
    const tp0=clamp(0.62-0.22*p.oz.karar-0.12*p.oz.gorus+0.2*(p.yorgunluk||0),0.25,0.7);
    return this.t-q.T<tp0*faz;
  },
  markaj(p,t,odak){
    const M=this._markaj&&this._markaj[t],en=M&&M.get(p);
    if(!en||!en.oyunda)return null;
    /* rakibin 0,3 sn sonraki yerine göre (koşan adamı geriden kovalamasın) */
    const d=this.dir[t],ou=(en.x+en.vx*0.3)*d,ow=en.z+en.vz*0.3,gx=-PL,L=hyp(gx-ou,MZ-ow)||1;
    return{u:ou+(gx-ou)/L*1.1,w:ow+(MZ-ow)/L*1.1};
  },
});
