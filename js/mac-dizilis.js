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
/* bir mevkinin hedef konumu (takımın hücum çerçevesinde): bu = topun u'su, bw = topun w'su, sahip = top takımda mı */
function dizilisKonumu(diz,n,bu,bw,sahip){
  const m=DIZILISLER[diz].mevkiler[n],B=sahip?BLOK.hucum:BLOK.savunma,defU=B.cizgi(bu);
  if(m.cizgi==='KL'){const u=sahip?-47+clamp(bu+20,0,40)*0.12:-50+clamp(bu+30,0,50)*0.05;return{u,w:MZ+clamp((bw-MZ)*0.18,-4,4)};}
  let u=defU+(m.cizgi==='OS'?B.os:m.cizgi==='FV'?B.os+B.fv:0);
  if(m.bek)u+=B.bekIleri*(sahip&&bu>0?1:sahip?0.4:0);
  if(m.kanat)u+=B.kanatIleri;
  if(m.derin&&sahip)u-=4;
  if(m.hedef&&sahip)u+=2;
  if(m.ileri)u+=m.ileri*(sahip?1:0.6);
  /* savunmada: hedef forvet orta çizgi çevresinde stoperlere baskı ve kontra için kalır; diğer forvetler (kanat forvetleri dahil)
     blokla birlikte orta saha hattının önüne döner (MM2) */
  if(!sahip&&m.cizgi==='FV')u=m.hedef?Math.max(u,bu<-30?-12:-5):Math.min(u,defU+B.os+9);
  u=Math.min(u,46);
  const kay=B.kayma[m.cizgi]||0.35;
  let w=MZ+(m.w-MZ)*B.genislik+(bw-MZ)*kay;
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
    /* serbest top: her takımdan topa en önce yetişecek oyuncu kovalar (6 karede bir ya da top değişince hesaplanır) */
    let kovalayan=[null,null];
    if(!du&&sahipTakim<0&&!b.tasiyan){
      const K=this._kov;
      if(K&&K.surum===b.surum&&this.kare-K.kare<6)kovalayan=K.liste;
      else{const t8=this.topTahmin(0.8),sure=[1e9,1e9];
        for(let t=0;t<2;t++){let en=null,enT=1e9;
          for(const p of this.teams[t]){if(!p.oyunda||(p.eylem&&p.eylem.kilit))continue;
            /* kaleci kovalayan sayılmaz: serbest topa çıkıp çıkmayacağına kendisi karar verir (kaleciCikis, js/mac-kaleci.js); çıkmazsa topa bir saha oyuncusu gider */
            if(p.rol==='GK')continue;
            const k=this.yakalamaNoktasi(p,p.rol==='GK'?2.4:2.3),ek=b.hedefOyuncu===p?-0.35:0;if(k.t+ek<enT){enT=k.t+ek;en=p;}}
          kovalayan[t]=en;sure[t]=enT;}
        /* yüksek top: her takımdan iki oyuncu topun ineceği yere gider (hava mücadelesi) */
        const yuksek=b.y>2.5||b.vy>4;kovalayan[2]=null;kovalayan[3]=null;
        if(yuksek)for(let t=0;t<2;t++){let en=null,enT=1e9;
          for(const p of this.teams[t]){if(!p.oyunda||p===kovalayan[t]||p.rol==='GK'||(p.eylem&&p.eylem.kilit))continue;
            const k=this.yakalamaNoktasi(p,2.3);if(k.t<enT){enT=k.t;en=p;}}
          if(en&&enT<3)kovalayan[2+t]=en;}
        this._kov={surum:b.surum,kare:this.kare,liste:kovalayan,sure,yuksek};}
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
    for(let t=0;t<2;t++){
      const d=this.dir[t],bu=odak.x*d,tk=this.taktik[t];
      /* serbest topta (pas yolda, sekme, ikili mücadele) son dokunan değil son sahip olan takımın düzeni sürer: takım şekli her sekmede
         değişmez (T1, kararlı hedef) */
      const sonSahip=this._sonSahipTakim!=null?this._sonSahipTakim:b.sonTakim;
      /* yeni kazanılan topta takım hücum düzenine sekilGecikme sn sonra geçer: çok kısa sahiplikte takım şekli değişmez (T1) */
      const yeniKazanan=!du&&sonSahip===t&&this._kaybeden===1-t&&gecisSure<MOTOR_AYAR.sekilGecikme;
      const hucum=!yeniKazanan&&(sahipTakim===t||(sahipTakim<0&&sonSahip===t))||(sahipTakim===1-t&&gecisSure<MOTOR_AYAR.gecis);
      HT[t]=hucum;
      const G=GG[t],gecikmeli=du||G.i<=8?odak:{x:G.x[(G.i-9)&15],z:G.z[(G.i-9)&15],sahip:odak.sahip,takim:odak.takim};
      /* bölgesel pres: topa, top kendi bölgesine giren oyuncu çıkar (1. adam); diğerleri yerini korur.
         2. adam (kapatan) yalnızca kendi ceza sahası önünde ya da ileri preste */
      let pres1=null,pres2=null,pres3=null;
      /* karşı pres (MM2): top az önce kaybedildiyse en yakın üç oyuncu topa basar, kapatır ve en yakın pas yolunu keser */
      const karsi=!du&&sahipTakim===1-t&&b.sahip&&this._kaybeden===t&&gecisSure<MOTOR_AYAR.karsiPres*(0.6+tk.pres*0.8);
      if(karsi){const s=b.sahip,L=[];
        for(const p of this.teams[t]){if(!p.oyunda||p.rol==='GK'||(p.eylem&&p.eylem.kilit))continue;L.push([hyp(p.x-s.x,p.z-s.z),p]);}
        L.sort((x,y)=>x[0]-y[0]||x[1].n-y[1].n);
        if(L[0]&&L[0][0]<12)pres1=L[0][1];if(L[1]&&L[1][0]<10)pres2=L[1][1];if(L[2]&&L[2][0]<14)pres3=L[2][1];}
      else if(!du&&sahipTakim===1-t&&b.sahip){
        const s=b.sahip;let e1=1e9,e2=1e9;const P1=this._pres1||(this._pres1=[null,null]),onceki=P1[t];
        for(const p of this.teams[t]){if(!p.oyunda||p.rol==='GK'||(p.eylem&&p.eylem.kilit))continue;
          /* T4: az önce geçilen savunmacı (1,5 sn) 1. adam olmaz: toparlanır, 2. adam öne çıkar */
          if(p._gecT!=null&&this.t-p._gecT<1.5)continue;
          const k=dizilisKonumu(tk.dizilis,p.n,bu,odak.z,false),bolge=hyp(k.u*d-s.x,k.w-s.z),simdi=hyp(p.x-s.x,p.z-s.z);
          /* T4: önceki 1. adam gecikme payı kadar avantajlı (kare kare değişmesin) */
          const puan=Math.min(bolge,simdi*1.2)+simdi*0.35-(p===onceki?MOTOR_AYAR.presHisterezis:0);
          if(puan<e1){e2=e1;pres2=pres1;e1=puan;pres1=p;}else if(puan<e2){e2=puan;pres2=p;}}
        /* orta sahada blok yerini korur: 1. adam ancak top kendi yarısına yaklaşınca ya da çok yakındaysa çıkar */
        if(pres1&&(hyp(pres1.x-s.x,pres1.z-s.z)>16||(bu>-8+tk.pres*14&&hyp(pres1.x-s.x,pres1.z-s.z)>7)))pres1=null;
        /* T4: üstüne sürülen (çalımın hedefi olan) savunmacı 1. adamdır: ikili mücadeleye girer (bölgesinde kalırsa çalıma tepki vermiyordu) */
        const ch=s.calim&&s.calim.o;if(ch&&ch.team===t&&ch.oyunda&&ch.rol!=='GK'&&!(ch.eylem&&ch.eylem.kilit)&&ch!==pres1){if(pres2===ch)pres2=pres1;pres1=ch;}
        P1[t]=pres1;
        const ileriPres=bu>lerp(34,6,tk.pres);
        if(!(bu<-PL+30||ileriPres))pres2=null;
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
      }
      const cizgi=this.savunmaCizgisi(t,hucum,odak);
      if(!hucum)this.markajAta(t,du?odak:gecikmeli);else if(this._markaj)this._markaj[t]=new Map();
      for(const p of this.teams[t]){
        if(!p.oyunda||p===b.sahip||b.tasiyan===p)continue;
        const e=p.eylem;if(e&&(e.kilit||e.ad==='vurus'||e.ad==='tac'||e.ad==='mudahale'))continue;
        if(du&&du.kullanan===p)continue;
        if(this.degisiklik&&(this.degisiklik.cikan===p||this.degisiklik.giren===p)&&!this.degisiklik.girdi)continue;
        p.yonHedef=null;p.bak=b;p.hizOran=0.7;
        /* efor (T1): kaleci (kaleciKonum), kovalama ve pres tam; karşı pres 0,9; 2. adam 0,8; bölge ve görevler bolgeKonumu'nda */
        if(p.rol==='GK'){this.kaleciKonum(p,dt);continue;}
        /* T1: topa rakibinden açıkça geç yetişecek kovalayan (kovalaPay sn) çekişmeye koşmaz, rahat ivmeyle yaklaşır; pasın alıcısı ve
           yüksek topta kovalayan tam eforla (rahat karşılayan alıcı geç kalıp pası kaybediyordu) */
        if(p===kovalayan[t]){const K=this._kov,S=K&&K.sure,f=S?S[t]-S[1-t]:0;
          this.kovala(p,K&&K.yuksek||p===b.hedefOyuncu||f<=MOTOR_AYAR.kovalaPay?1:0.5);continue;}
        if(p===kovalayan[2+t]){this.kovala(p,1);continue;}
        if(p===pres1){this.eforVer(p,karsi?0.9:1);this.presYap(p,b.sahip,dt);continue;}
        if(p===pres2){const yakin=p._kapatK===this.kare;this.eforVer(p,yakin?1:karsi?0.9:0.8);if(yakin)this.kapatYakin(p,b.sahip,pres1,dt);else this.kapat(p,b.sahip);continue;}
        if(p===pres3){this.eforVer(p,0.9);this.yolKapat(p,b.sahip);continue;}
        let od=odak;
        if(!du&&(!hucum||MOTOR_AYAR.hucumGecikme&&(MOTOR_AYAR.hucumGecikme>1||p.x*d<b.x*d))){/* kişisel tepki: topun tp sn önceki (yumuşatılmış) yeri */
          const tp=clamp(0.62-0.22*p.oz.karar-0.12*p.oz.gorus+0.2*p.yorgunluk,0.25,0.7)*MOTOR_AYAR.tepkiCarpan,n=Math.min(15,Math.round(tp*20));
          if(G.i>n){const j=(G.i-1-n)&15;OG.x=G.x[j];OG.z=G.z[j];OG.sahip=odak.sahip;OG.takim=odak.takim;od=OG;}}
        this.bolgeKonumu(p,t,hucum,cizgi,dt,od);
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
    const d=this.dir[t],bu=odak.x*d,B=hucum?BLOK.hucum:BLOK.savunma;let u=B.cizgi(bu);
    if(!hucum){
      const s=odak.sahip;
      if(s&&s.team!==t){const onuAcik=baskiAltinda(this,s)<0.3,ileriBakar=Math.cos(s.yon)*(-d)>0.3;if(onuAcik&&ileriBakar)u-=4;}
      u=Math.min(u,bu-4);
      /* rakip forvetlerin arkaya kaçmasına izin verme: en derindeki rakipten çok önde durma */
      let enDerin=99;for(const o of this.teams[1-t])if(o.oyunda&&o.rol!=='GK')enDerin=Math.min(enDerin,o.x*d);
      u=Math.min(u,enDerin+2.5);
    }
    return clamp(u,-PL+6,20);
  },
  /* bölge, destek, koşu ve markaj */
  bolgeKonumu(p,t,hucum,cizgi,dt,odak){
    const d=this.dir[t],bu=odak.x*d,bw=odak.z,diz=this.taktik[t].dizilis;
    const k=dizilisKonumu(diz,p.n,bu,bw,hucum);let u=k.u,w=k.w,markajda=null,ef=0,zorla=false;
    if(p.rol==='DEF'&&!hucum)u=cizgi+(p.mevki.bek?0.6:0);
    if(hucum){
      const ofs=this._ofs[t],s=odak.sahip;
      /* ortaya koşu rolleri: top kanatta ve son üçte birde */
      const orta=bu>PL-30&&Math.abs(bw-MZ)>11&&s&&s.team===t;
      if(orta){const r=this.kutuRolu(p,t,bw);if(r){u=r.u;w=r.w;p.hizOran=0.95;ef=0.8;}}
      else if(s&&s.team===t){
        /* destek: topa en yakın iki oyuncu açık pas yoluna gelir */
        if(this.destekci(p,s)){const n=this.destekNoktasi(p,s,dt);if(n){u=n.u;w=n.w;p.hizOran=0.8;ef=0.6;}}
        /* derin koşu: forvet (ve bazen kanat) topu tutan ileri bakınca savunmanın arkasına */
        const kosu=this.derinKosu(p,s,ofs,dt);if(kosu){u=kosu.u;w=kosu.w;p.hizOran=1;ef=1;}
        /* bindirme: aynı kanatta top ilerideyse bek dışından geçer (kanatta ikiye bir) */
        const ayniKanat=Math.sign(s.z-MZ)===Math.sign(p.mevki.w-MZ)&&Math.abs(s.z-MZ)>10;
        if(p.mevki.bek&&ayniKanat&&s!==p&&s.x*d>-5){u=Math.max(u,s.x*d+(s.mevki.kanat?6:-4));w=p.mevki.w<MZ?3.5:PW-3.5;p.hizOran=0.95;ef=0.8;}
        /* uzak kanat: top öbür kanatta ve ilerideyse içeri, ceza sahasına kayar */
        if(p.mevki.kanat&&!ayniKanat&&Math.abs(s.z-MZ)>10&&s.x*d>10){u=Math.max(u,ofs-4);w=lerp(w,MZ,0.55);ef=Math.max(ef,0.5);}
      }
      /* forvet savunmanın omzunda, kanat biraz gerisinde bekler; koşu yapmayan hücumcu ofsayta düşmez */
      if(!p.kosu&&s&&s.team===t){if(p.rol==='FV')u=Math.max(u,ofs-(p.mevki.hedef?1.2:2.5));else if(p.mevki.kanat&&bu>-10)u=Math.max(u,ofs-9);}
      if(!p.kosu&&u>ofs-0.6&&u>0)u=ofs-0.6;
      /* kararlı hedef ofsayttaysa hemen geri (T1) */
      zorla=!p.kosu&&p._hdfX*d>ofs-0.3&&p._hdfX*d>0;
    }else{
      /* kendi ceza sahası çevresinde adam markajı */
      markajda=this.markaj(p,t,odak);if(markajda){u=markajda.u;w=markajda.w;ef=1;}
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
      if(db>MOTOR_AYAR.dinlenUzak&&!(hucum&&p.x*d>b.x*d-5)&&!this.tehditVar(p,hucum))ef=0.15;}
    /* düz savunma çizgisi: savunmacının derinliği hep güncel, ölü bölge yalnız yana */
    /* hücumda forvet savunmanın omzunda (ofsayt çizgisi) kalır: derinliği hep güncel, yerinden 3 m'de döner */
    const omuz=hucum&&p.rol==='FV'&&!p.kosu&&bu>-10;if(omuz&&ef<0.6)ef=0.6;
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
    let sira=0;const dp=hyp(p.x-s.x,p.z-s.z);
    for(const q of this.teams[p.team])if(q!==p&&q!==s&&q.oyunda&&q.rol!=='GK'&&hyp(q.x-s.x,q.z-s.z)<dp)sira++;
    return sira<3&&dp<32;
  },
  /* ceza sahasına koşu rolleri */
  kutuRolu(p,t,bw){
    const yan=Math.sign(bw-MZ)||1,m=p.mevki;
    if(m.hedef)return{u:PL-5.5,w:MZ+yan*2.2};         // ön direk: hedef forvet
    if((m.cizgi==='FV'&&!m.kanat)||m.onOrta)return{u:PL-7,w:MZ-yan*3.5};   // arka direk: ikinci forvet ya da 10 numara
    if(m.kanat&&Math.sign(m.w-MZ)!==yan)return{u:PL-9,w:MZ-yan*6};  // uzak kanat: arka direğin gerisi
    if(m.cizgi==='OS'&&!m.derin)return{u:PL-12.5,w:MZ+yan*1};  // penaltı noktası
    if(m.derin)return{u:PL-20,w:MZ-yan*2};           // ceza sahası dışı, ikinci top
    return null;
  },
  /* markaj paylaşımı (MM2): top kendi kalesine yakınken savunma ve orta saha oyuncuları tehlikeli bölgedeki rakiplerle TEKİL eşleşir.
     Önceki eşleşme geçerli ve 12 m'den yakınsa korunur (markaj sürekli el değiştirmez); kalanlar en yakın çiftten başlayarak dağıtılır
     (savunmacı 14 m, orta saha 10 m içinde). Eşleşmesi olmayan bölgesinde kalır. 6 karede bir hesaplanır */
  markajAta(t,odak){
    const M=this._markaj||(this._markaj=[new Map(),new Map()]),eski=M[t];
    if(eski._kare!=null&&this.kare-eski._kare<6)return eski;
    const d=this.dir[t],yeni=new Map(),b=this.ball;yeni._kare=this.kare;M[t]=yeni;
    if(odak.x*d>-PL+32)return yeni;
    const S=this.teams[t].filter(p=>p.oyunda&&(p.rol==='DEF'||p.rol==='OS')&&!(p.eylem&&p.eylem.kilit));
    const R=this.teams[1-t].filter(o=>o.oyunda&&o.rol!=='GK'&&o.x*d<=-PL+24);
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
  markaj(p,t,odak){
    const M=this._markaj&&this._markaj[t],en=M&&M.get(p);
    if(!en||!en.oyunda)return null;
    /* rakibin 0,3 sn sonraki yerine göre (koşan adamı geriden kovalamasın) */
    const d=this.dir[t],ou=(en.x+en.vx*0.3)*d,ow=en.z+en.vz*0.3,gx=-PL,L=hyp(gx-ou,MZ-ow)||1;
    return{u:ou+(gx-ou)/L*1.1,w:ow+(MZ-ow)/L*1.1};
  },
});
