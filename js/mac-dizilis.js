/* ============ Demirkapı '99 — diziliş ve topsuz oyun (mantık, çizimsiz) ============
   Koordinatlar takımın hücum yönüne göredir: u = −52,5 (kendi kalesi) … +52,5 (rakip kale), w = 0 … 68 (taç çizgileri).
   Her mevki bir çizgiye (kaleci, defans, orta saha, forvet) ve bir taban genişliğine bağlıdır. Takım bir blok gibi hareket eder:
   topa sahipken blok önde ve geniştir, top rakipteyken geride ve dar (kompakt). Blok yüksekliği ve topa kayma topun yerine bağlıdır.
   Bu, RoboCup HELIOS'taki "topun yerinden oyuncu konumuna" eşlemenin parametreli, sade bir biçimidir.
   Üstüne topsuz oyun: topu kovalayan, pres yapan (1. adam) ve onu koruyan (2. adam) oyuncu; topu tutana destek noktaları;
   savunma arkasına koşular, bekin bindirmesi, ortaya koşu rolleri (ön direk, arka direk, penaltı noktası, ceza sahası dışı);
   düz savunma çizgisi ve ofsayt; ceza sahasında adam markajı; hava topunda topun ineceği yere koşu; kalecinin açıortay konumu. */
const DIZILISLER={
  '4-4-2':{
    /* sıra motordaki oyuncu sırasıyla aynıdır: 0 kaleci, 1–4 defans, 5–8 orta saha, 9–10 forvet */
    mevkiler:[
      {ad:'KL',cizgi:'KL',w:34},
      {ad:'SĞB',cizgi:'DEF',w:9,bek:true},{ad:'STP',cizgi:'DEF',w:26},{ad:'STP',cizgi:'DEF',w:42},{ad:'SLB',cizgi:'DEF',w:59,bek:true},
      {ad:'SĞK',cizgi:'OS',w:10,kanat:true},{ad:'MO',cizgi:'OS',w:27,derin:true},{ad:'MO',cizgi:'OS',w:41},{ad:'SLK',cizgi:'OS',w:58,kanat:true},
      {ad:'FV',cizgi:'FV',w:29,hedef:true},{ad:'FV',cizgi:'FV',w:40}
    ]
  }
};
/* blok ayarları: hat aralıkları (m), topa kayma oranları, genişlik çarpanları */
const BLOK={
  hucum:{cizgi:(bu)=>clamp(bu*0.55-17,-38,12),os:15,fv:17,kayma:{DEF:0.3,OS:0.42,FV:0.32},genislik:1.14,bekIleri:10,kanatIleri:11},
  savunma:{cizgi:(bu)=>clamp(bu*0.5-20,-40,-3),os:10,fv:11,kayma:{DEF:0.3,OS:0.4,FV:0.3},genislik:0.84,bekIleri:0,kanatIleri:-2}
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
  u=Math.min(u,46);
  const kay=B.kayma[m.cizgi]||0.35;
  let w=MZ+(m.w-MZ)*B.genislik+(bw-MZ)*kay;
  /* savunmada top tarafı daha sıkışık, uzak kanat içeri kapanır */
  if(!sahip){const uzak=Math.sign(m.w-MZ)!==Math.sign(bw-MZ)&&Math.abs(bw-MZ)>8;if(uzak)w=lerp(w,MZ,0.18);}
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
      else{const t8=this.topTahmin(0.8);
        for(let t=0;t<2;t++){let en=null,enT=1e9;
          for(const p of this.teams[t]){if(!p.oyunda||(p.eylem&&p.eylem.kilit))continue;
            if(p.rol==='GK'&&!this.kendiCezaSahasinda(p,t8.x,t8.z))continue;
            const k=this.yakalamaNoktasi(p,p.rol==='GK'?2.4:2.3),ek=b.hedefOyuncu===p?-0.35:0;if(k.t+ek<enT){enT=k.t+ek;en=p;}}
          kovalayan[t]=en;}
        this._kov={surum:b.surum,kare:this.kare,liste:kovalayan};}
      /* top dışarı gidiyorsa ve son rakip dokunduysa: kullanım bizim; oyuncu topu dışarı bırakır */
      const son=this.topYolu(),dur=son[son.length-1];
      if(Math.abs(dur.x)>PL+0.3||dur.z<-0.3||dur.z>PW+0.3){const sonT=b.sonTakim;
        for(let t=0;t<2;t++){const k=kovalayan[t];if(!k||t===sonT)continue;
          const ka=this.yakalamaNoktasi(k,0.7);if(Math.abs(ka.x)>PL-3||ka.z<3||ka.z>PW-3){kovalayan=kovalayan.slice();kovalayan[t]=null;k.birak=true;}}}
      /* pas bir takım arkadaşına gidiyorsa, o takımın kovalayanı alıcıdır */
      if(b.hedefOyuncu&&b.hedefOyuncu.oyunda&&!(b.hedefOyuncu.eylem&&b.hedefOyuncu.eylem.kilit)){kovalayan=kovalayan.slice();kovalayan[b.hedefOyuncu.team]=b.hedefOyuncu;}
    }
    this._ofs=[ofsaytCizgisi(this,0),ofsaytCizgisi(this,1)];
    for(let t=0;t<2;t++){
      const d=this.dir[t],bu=odak.x*d,tk=this.taktik[t];
      const hucum=sahipTakim===t||(sahipTakim<0&&b.sonTakim===t);
      /* pres: topu tutana en yakın (zaman olarak) oyuncu 1. adam, bir sonraki 2. adam */
      let pres1=null,pres2=null;
      if(!du&&sahipTakim===1-t&&b.sahip){
        const s=b.sahip,presBolge=bu>lerp(18,-8,tk.pres);  // topun rakip yarıda ne kadar ileride preslendiği
        let e1=1e9,e2=1e9;
        for(const p of this.teams[t]){if(!p.oyunda||p.rol==='GK'||(p.eylem&&p.eylem.kilit))continue;
          const dd=hyp(p.x-s.x,p.z-s.z)/p.maxSpd+(p.rol==='DEF'&&bu>-20?0.6:0);
          if(dd<e1){e2=e1;pres2=pres1;e1=dd;pres1=p;}else if(dd<e2){e2=dd;pres2=p;}}
        if(presBolge&&hyp(pres1.x-s.x,pres1.z-s.z)>14){pres1=null;pres2=null;}  // yüksek alanda sadece yakınsa bas
      }
      const cizgi=this.savunmaCizgisi(t,hucum,odak);
      for(const p of this.teams[t]){
        if(!p.oyunda||p===b.sahip||b.tasiyan===p)continue;
        const e=p.eylem;if(e&&(e.kilit||e.ad==='vurus'||e.ad==='tac'||e.ad==='mudahale'))continue;
        if(du&&du.kullanan===p)continue;
        p.yonHedef=null;p.bak=b;p.hizOran=0.7;
        if(p.rol==='GK'){this.kaleciKonum(p,dt);continue;}
        if(p===kovalayan[t]){this.kovala(p);continue;}
        if(p===pres1){this.presYap(p,b.sahip,dt);continue;}
        if(p===pres2){this.kapat(p,b.sahip);continue;}
        this.bolgeKonumu(p,t,hucum,cizgi,dt,odak);
      }
    }
  },
  /* oyuncunun topa yetişebileceği en erken nokta (top yolundan). yukseklik: erişebildiği top yüksekliği */
  yakalamaNoktasi(p,yukseklik){
    const yol=this.topYolu(),t0=this.t-this._yolT0,i0=Math.max(0,Math.round(t0*60)-1),fx=Math.cos(p.yon),fz=Math.sin(p.yon),hiz=1/(p.maxSpd*0.92);
    let onceki=null;
    for(let i=i0;i<yol.length;i+=3){const s=yol[i],t=(i-i0)/60;if(s.y>yukseklik)continue;
      /* top durduysa sonraki noktalar aynıdır */
      if(onceki&&s.v<0.05&&s.y<0.01&&onceki.v<0.05){const dx=s.x-p.x,dz=s.z-p.z,dd=hyp(dx,dz);return{x:s.x,z:s.z,t:Math.max(t,0.12+dd*hiz)};}
      onceki=s;
      const dx=s.x-p.x,dz=s.z-p.z,dd=hyp(dx,dz),cosA=dd>0.01?(dx*fx+dz*fz)/dd:1;
      const varis=dd<0.5?0:0.12+(1-cosA)*0.16+dd*hiz+Math.max(0,0.35-dd*0.05);
      if(varis<=t)return{x:s.x,z:s.z,t};}
    const s=yol[yol.length-1];return{x:s.x,z:s.z,t:3.5+hyp(s.x-p.x,s.z-p.z)/p.maxSpd};
  },
  kovala(p){
    const b=this.ball,havada=b.y>1.3||b.vy>2,k=this.yakalamaNoktasi(p,havada?1.72*p.boy+0.5:0.7);
    p.tx=clamp(k.x,-PL-1,PL+1);p.tz=clamp(k.z,-1,PW+1);p.hizOran=1;p.bak=b;
    if(hyp(k.x-p.x,k.z-p.z)<1.5)p.yonHedef=Math.atan2(b.z-p.z,b.x-p.x);
    /* gelişine vuruş: top gelmeden şutu seç (bir kez sorulur) */
    if(!p.eylem&&k.t<0.55&&b.sonTakim===p.team&&p.ilkSoruldu!==b.surum){p.ilkSoruldu=b.surum;
      const s=this.topTahmin(k.t),sec=ilkDokunusSutu(this,p,k.x,k.z,s.y);if(sec)this.vurusBaslat(p,sec);}
  },
  /* 1. adam: topu tutana kale tarafından yaklaş, oyala, uygun anda müdahaleye gir */
  presYap(p,s,dt){
    const b=this.ball,gx=-this.dir[p.team]*PL,dx=gx-s.x,dz=MZ-s.z,L=hyp(dx,dz)||1;
    const mesafe=hyp(p.x-s.x,p.z-s.z),yakin=mesafe<3;
    const dur=yakin?1.35:0.8;/* kale ile top arasında, topa dur mesafesinde */
    p.tx=b.x+dx/L*dur;p.tz=b.z+dz/L*dur;p.hizOran=yakin?0.55:1;p.bak=b;
    if(mesafe<2.2)p.yonHedef=Math.atan2(b.z-p.z,b.x-p.x);
    this.mudahaleDene(p,s,dt);
  },
  /* 2. adam: 1. adamın arkasında, top ile kale arasında */
  kapat(p,s){
    const gx=-this.dir[p.team]*PL,dx=gx-s.x,dz=MZ-s.z,L=hyp(dx,dz)||1,k=Math.min(10,L*0.4);
    p.tx=s.x+dx/L*k;p.tz=s.z+dz/L*k;p.hizOran=0.8;p.bak=this.ball;
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
    const k=dizilisKonumu(diz,p.n,bu,bw,hucum);let u=k.u,w=k.w;
    if(p.rol==='DEF'&&!hucum)u=cizgi+(p.mevki.bek?0.6:0);
    if(hucum){
      const ofs=this._ofs[t],s=odak.sahip;
      /* ortaya koşu rolleri: top kanatta ve son üçte birde */
      const orta=bu>PL-30&&Math.abs(bw-MZ)>11&&s&&s.team===t;
      if(orta){const r=this.kutuRolu(p,t,bw);if(r){u=r.u;w=r.w;p.hizOran=0.95;}}
      else if(s&&s.team===t){
        /* destek: topa en yakın iki oyuncu açık pas yoluna gelir */
        if(this.destekci(p,s)){const n=this.destekNoktasi(p,s,dt);if(n){u=n.u;w=n.w;p.hizOran=0.8;}}
        /* derin koşu: forvet (ve bazen kanat) topu tutan ileri bakınca savunmanın arkasına */
        const kosu=this.derinKosu(p,s,ofs,dt);if(kosu){u=kosu.u;w=kosu.w;p.hizOran=1;}
        /* bindirme: aynı kanatta kanat oyuncusu topla ilerliyorsa bek dışından geçer */
        if(p.mevki.bek&&s.mevki.kanat&&Math.sign(s.z-MZ)===Math.sign(p.z-MZ)&&s.x*d>0){u=Math.max(u,s.x*d+6);w=p.z<MZ?4:PW-4;p.hizOran=0.95;}
      }
      /* forvet savunmanın omzunda, kanat biraz gerisinde bekler; koşu yapmayan hücumcu ofsayta düşmez */
      if(!p.kosu&&s&&s.team===t){if(p.rol==='FV')u=Math.max(u,ofs-(p.mevki.hedef?1.2:2.5));else if(p.mevki.kanat&&bu>-10)u=Math.max(u,ofs-9);}
      if(!p.kosu&&u>ofs-0.6&&u>0)u=ofs-0.6;
    }else{
      /* kendi ceza sahası çevresinde adam markajı */
      const m=this.markaj(p,t,odak);if(m){u=m.u;w=m.w;p.hizOran=0.9;}
    }
    u=clamp(u,-PL+0.5,PL-0.8);w=clamp(w,0.8,PW-0.8);
    p.tx=u*d;p.tz=w;
    /* hedefe uzaklığa göre hız: yakınsa yürür/tırıs, uzaksa koşar (geçişlerde takım hızla yerleşir) */
    const uzak=hyp(p.tx-p.x,p.tz-p.z);p.hizOran=Math.max(p.hizOran,clamp(0.45+uzak/16,0.45,1));if(uzak<2.5)p.hizOran=Math.min(p.hizOran,0.55);
  },
  destekci(p,s){
    if(p.rol==='GK'||p===s)return false;
    let sira=0;const dp=hyp(p.x-s.x,p.z-s.z);
    for(const q of this.teams[p.team])if(q!==p&&q!==s&&q.oyunda&&q.rol!=='GK'&&hyp(q.x-s.x,q.z-s.z)<dp)sira++;
    return sira<3&&dp<32;
  },
  /* destek noktası (Buckland): topun çevresinde 9–18 m halkada, pas yolu açık, ileride ve boşta olan yer */
  destekNoktasi(p,s,dt){
    if(p.destek&&this.t-p.destek.t<0.5)return p.destek;
    const d=this.dir[p.team],su=s.x*d,sw=s.z,ofs=this._ofs[p.team],rakip=this.teams[1-p.team];
    const ku=p.x*d,kw=p.z;let en=null,enP=-1e9;
    for(let i=0;i<14;i++){
      const a=(-1.35+i*0.21)+(this.rast()-0.5)*0.12,r=9+((i*7)%5)*2.2;
      const u=su+Math.cos(a)*r,w=sw+Math.sin(a)*r*(p.z>sw?1:-1)*(i%2?1:-1);
      if(u>ofs-0.6||u<-PL+4||w<2||w>PW-2)continue;
      let yol=99,bos=99;for(const o of rakip){if(!o.oyunda)continue;const ox=o.x*d;
        yol=Math.min(yol,segD(ox,o.z,su,sw,u,w));bos=Math.min(bos,hyp(ox-u,o.z-w));}
      const puan=Math.min(yol,5)*1.1+Math.min(bos,8)*0.5+(u-su)*0.22-hyp(u-ku,w-kw)*0.1;
      if(puan>enP){enP=puan;en={u,w};}}
    p.destek=en?{u:en.u,w:en.w,t:this.t}:null;return p.destek;
  },
  derinKosu(p,s,ofs,dt){
    const d=this.dir[p.team],su=s.x*d;
    if(p.kosu){const k=p.kosu;k.t-=dt;
      if(k.t<=0||this.ball.sahip!==s||p.x*d>PL-6){p.kosu=null;return null;}
      return k;}
    if(!(p.rol==='FV'||(p.mevki.kanat&&this.rast()<0.3)))return null;
    const ileriBakar=Math.cos(s.yon)*d>0.35,serbest=baskiAltinda(this,s)<0.55,pu=p.x*d;
    if(!ileriBakar||!serbest||su<-15||Math.abs(pu-ofs)>2.5||this.rast()>dt*1.6)return null;
    const hedefU=Math.min(PL-8,ofs+10+this.rast()*8),hw=clamp(p.z+(MZ-p.z)*0.35+(this.rast()-0.5)*10,8,PW-8);
    p.kosu={u:hedefU,w:hw,t:2.6};this.on('kosu',{p});return p.kosu;
  },
  /* ceza sahasına koşu rolleri */
  kutuRolu(p,t,bw){
    const yan=Math.sign(bw-MZ)||1,m=p.mevki;
    if(p.n===9)return{u:PL-5.5,w:MZ+yan*2.2};         // ön direk
    if(p.n===10)return{u:PL-7,w:MZ-yan*3.5};          // arka direk
    if(m.kanat&&Math.sign(m.w-MZ)!==yan)return{u:PL-9,w:MZ-yan*6};  // uzak kanat: arka direğin gerisi
    if(m.cizgi==='OS'&&!m.derin)return{u:PL-12.5,w:MZ+yan*1};  // penaltı noktası
    if(m.derin)return{u:PL-20,w:MZ-yan*2};           // ceza sahası dışı, ikinci top
    return null;
  },
  /* markaj: kendi ceza sahası çevresinde en yakın rakibi kale tarafından tut */
  markaj(p,t,odak){
    const d=this.dir[t],bu=odak.x*d;
    if(bu>-PL+32||p.rol==='FV')return null;
    let en=null,ed=9;for(const o of this.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;const ou=o.x*d;if(ou>-PL+24)continue;
      const dd=hyp(o.x-p.x,o.z-p.z);if(dd<ed){ed=dd;en=o;}}
    if(!en)return null;
    const ou=en.x*d,gx=-PL,L=hyp(gx-ou,MZ-en.z)||1;
    return{u:ou+(gx-ou)/L*1.2,w:en.z+(MZ-en.z)/L*1.2};
  },
  /* kaleci: topla kalenin iki direği arasındaki açının ortasında, mesafeye göre derinlik; arkaya atılan topa çıkış */
  kaleciKonum(p,dt){
    const b=this.ball,d=this.dir[p.team],gx=-d*PL,bu=b.x*d,sahipTakim=b.sahip?b.sahip.team:-1;
    p.bak=b;p.hizOran=0.8;
    /* ceza sahasına gelen serbest topa çıkış */
    if(sahipTakim<0&&!b.sut){
      let c=p._cikis;
      if(!c||c.surum!==b.surum||this.kare-c.kare>=6){const k=this.yakalamaNoktasi(p,2.4);let git=false;
        if(this.kendiCezaSahasinda(p,k.x,k.z)){let rakipT=9;for(const o of this.teams[1-p.team])if(o.oyunda){const ko=this.yakalamaNoktasi(o,b.y>1.2?2.2:0.7);rakipT=Math.min(rakipT,ko.t);}
          git=k.t<rakipT-0.1||b.hedefOyuncu===p;}
        c=p._cikis={surum:b.surum,kare:this.kare,git,x:k.x,z:k.z};}
      if(c.git){p.tx=c.x;p.tz=c.z;p.hizOran=1;return;}}
    const s=b.sahip;
    /* bire bir: rakip topla ceza sahasında ve arada savunmacı yoksa açıyı daralt */
    if(s&&s.team!==p.team&&this.kendiCezaSahasinda(p,s.x,s.z)){
      let arada=false;for(const q of this.teams[p.team])if(q!==p&&q.oyunda&&segD(q.x,q.z,s.x,s.z,gx,MZ)<1.2&&Math.abs(q.x-gx)<Math.abs(s.x-gx))arada=true;
      if(!arada){const dx=s.x-gx,dz=s.z-MZ,L=hyp(dx,dz)||1,k=clamp(L*0.45,1.2,7);p.tx=gx+dx/L*k;p.tz=MZ+dz/L*k;p.hizOran=1;return;}}
    /* açıortay: topun kaleye bakan açısının ortası */
    const a1=Math.atan2(MZ-GW2-b.z,gx-b.x),a2=Math.atan2(MZ+GW2-b.z,gx-b.x),am=a1+aciFark(a2,a1)/2;
    const L=hyp(gx-b.x,MZ-b.z),derin=bu>0?clamp(8+(bu)*0.18,6,17):clamp(0.6+L*0.07,0.8,4.5);
    /* açıortay doğrusu üzerinde kaleden 'derin' kadar önde */
    const ux=-Math.cos(am),uz=-Math.sin(am);let x=gx+ux*derin,z=MZ+uz*derin;
    if(Math.abs(x-gx)<0.4)x=gx+d*0.4;
    z=clamp(z,MZ-GW2-0.5,MZ+GW2+0.5);if(bu>0)z=MZ+clamp(b.z-MZ,-8,8)*0.25;
    p.tx=x;p.tz=z;
  }
});
