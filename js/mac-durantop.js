/* ============ Chairman — maç motoru: duran toplar (mantık, çizimsiz) ============
   Sahibi: K akışı (T8, 2026-10-11; gerçekçilik planı §4 T8 “Duran toplar”). Duruşun kendisi (durusBaslat, stepDurus, top toplayıcılar, hakemler)
   js/mac-kurallar.js'te kalır; bu dosya duran topun görevlerini, rutinlerini, yerleşimini ve kullanımını taşır.
   T8-0 (ölçüm; sonuç birebir aynı): duran topun gerçek kullanım anı. durusKullan (ve santra, js/mac-motoru.js stepKick) b.kullanim'ı kurar;
   kullananın topa ilk dokunuşu (vuruş, taç atışı, sürüş dokunuşu ya da kalecinin topu eline alması) 'kullanim' olayını yayar (Match.dokunus);
   başka oyuncunun dokunuşu bayrağı siler. Olay {tur, alt, bolge, p, takim, x, z, hedef {x, z, alici}, hazirlik (duruşun başından kullanıma, sn),
   baraj, barajdakiler, du}. alt: korner kisa | ice | disa | duz; serbest sut | orta | kisa | uzun | pas | surus; tac kisa | uzun (≥ 18 m);
   kaleVurusu kisa | uzun | elle (kaleci topu yerden vurmadan eline aldı); penalti sag | sol | orta (vuranın gözünden); santra pas; sürüşle
   kullanılan her duran top surus. bolge (korner ve ortalanan serbest vuruş): on (ön direk) | arka | orta (altıpas) | nokta (penaltı noktası) |
   disari (ceza sahası kenarı ve yay). Ölçüm araclar/olcumler/k-duran.js, senaryo araclar/senaryolar/d-duran.js. Rastlantı çekmez. */
'use strict';
Object.assign(Match.prototype,{
  /* kullanım bayrağı: tur, kullanan, duruşun başladığı an (t0), duran topun yeri ve duruş (santrada yok) */
  kullanimBaslat(tur,tk,du,t0){const b=this.ball;b.kullanim={tur,p:tk,t0,x:du?du.x:b.x,z:du?du.z:b.z,cikti:false,du:du||null};},
  /* kullananın ilk dokunuşu: türü ve hedefi kullananın eyleminden (vuruşun seçimi, taç atışının hedefi), topun dönüşünden (korner içe/dışa) */
  kullanimBildir(p,K){
    const b=this.ball,e=p.eylem,sec=e&&e.ad==='vurus'?e.sec:null,d=this.dir[p.team],tur=K.tur;
    let alt='surus',bolge=null,hx=null,hz=null,alici=null;
    if(b.tasiyan===p)alt='elle';
    else if(e&&e.ad==='tac'){hx=e.hx;hz=e.hz;alici=e.hedef||null;alt=hx!=null&&hyp(hx-p.x,hz-p.z)>=18?'uzun':'kisa';}
    else if(sec){hx=sec.hx;hz=sec.hz;alici=sec.alici||null;const L=hyp(hx-K.x,hz-K.z);
      if(tur==='korner'){
        /* içe dönen: falsonun yana itişi (Magnus; egri'nin işaretiyle hızın sola dönüğü) kale çizgisine doğru */
        if(sec.tur!=='korner')alt='kisa';else{const g=b.egri||0;alt=Math.abs(g)<0.02?'duz':g*(-b.vz)*d>0?'ice':'disa';}}
      else if(tur==='penalti'){const dz=(hz-MZ)*d;alt=Math.abs(hz-MZ)<1?'orta':dz>0?'sag':'sol';}   /* zt·d > 0 vuranın sağı (sutEgriYani) */
      else if(tur==='kaleVurusu'||tur==='santra')alt=tur==='santra'?'pas':(sec.tip==='hava'?'uzun':'kisa');
      else alt=sec.tur==='sut'?'sut':sec.tur==='orta'||sec.tur==='korner'?'orta':L<15?'kisa':sec.tip==='hava'&&L>=30?'uzun':'pas';
      /* hedef bölgesi (korner ve orta): u kaleye göre, ön direk duran topun yanında */
      if(alt==='ice'||alt==='disa'||alt==='duz'||alt==='orta'){const u=hx*d,yan=Math.sign(K.z-MZ)||1,wr=(hz-MZ)*yan;
        bolge=u<PL-13?'disari':u<PL-8?(Math.abs(hz-MZ)<5?'nokta':'disari'):wr>0.8?'on':wr<-1.5?'arka':'orta';}}
    const du=K.du;
    this.on('kullanim',{tur,alt,bolge,p,takim:p.team,x:K.x,z:K.z,hedef:hx!=null?{x:hx,z:hz,alici}:null,hazirlik:this.t-K.t0,
      baraj:!!(du&&du.baraj),barajdakiler:du&&du.barajdakiler||null,du});
  }
});
