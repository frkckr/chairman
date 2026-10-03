/* ============ Chairman — maç motoru: ikili mücadele, müdahale, faul ve avantaj (mantık, çizimsiz) ============
   Sahibi: C akışı. Topa erişemeyen bedene çarpma ve sekme, blok, hava topu düellosu, top sürücünün korunması, yarı yarıya top,
   müdahale ve kayarak müdahale, faul, kart kararı ve avantaj. Kart gösterme, itiraz ve duran top altyapısı js/mac-kurallar.js'tedir.
   C2 (2026-10-03): müdahale geometriyle çözülür — ayak kapsülü (ayakta ~0,75 m, kaymada süpürme) temas anında topa mı, adama mı, hangisine önce
   değiyor; sonuç temiz kazanma / topu dürtme / blok / geçilme / faul; top ayağın hızı ve topun momentumuyla gider. Temasın şiddeti (bağıl hız,
   arkadan, kayarak, geç, önce topa değdi) faul olasılığını ve kartı belirler (gelişen atağı kesmek sarı, açık gol fırsatını engellemek kırmızı).
   Omuz omuza mücadele (eylem 'omuz', olay 'omuz'), denge (p.denge) ve sendeleme/düşme (eylem 'sendele', 'dusus' + yon/neden/siddet/yuzustu,
   olay 'dusus'); düşüş faulsüz de olabilir. Avantaj: faul yiyen takım topu tutacak ve atağın geleceği varsa oynatılır, kaybedilirse döner.
   sonDokunus: top sürme dokunuşu tur 'surus' (çalım dokunuşunda calim:true, mac-hareket.js), müdahale dokunuşu tur 'cal'. */
'use strict';
ayarEkle('C',{
  mudahaleIstegi:1.25,         // pres yapan oyuncunun müdahaleye girme isteği
  faulOrani:4.0,               // itme, tutma ve hava topu faullerinin olasılık çarpanı (T1: 2,7 → 4,0; yürüyen oyunda ikili temas azaldı)
  faulEsik:0.55,               // müdahale temasında faul eşiği (şiddet; P=σ((c−eşik)/0,12)) (C2)
  kutuIstek:0.65,              // kendi ceza sahasında müdahale isteği çarpanı (C2; birleştirme 2026-10-03: 0,5 → 0,65)
  sabirsiz:0.15,               // top açıkta değilken erken dalma sıklığı (1/sn; kararsız ve sert oyuncuda yüksek) (C2)
  omuzGuc:1.4,                 // omuz mücadelesinde kaybedenin denge kaybı çarpanı (C2)
  kartEsik:0.75,               // bu şiddetten sonra sarı kart (pervasız); 1,25 üstü aşırı sert (C2)
  acikIstek:20,                // top açıkta ve ayak yetişirken müdahaleye girme sıklığı (1/sn) (C2)
  kaymaIstek:3,                // uzun kaçan topa kayarak girme sıklığı (1/sn) (C2)
  taktikFaul:0.3,              // çalımla geçilen savunmacının çekme/çelme olasılığı (C2)
  sariAtak:0.8,                // gelişen atağı kesen faulde sarı olasılığı (taktik faulde +0,3) (C2)
  firsatKirmizi:0.45           // açık gol fırsatını engelleyen faulde kırmızı olasılığı (hakem her zaman görmez; birleştirme 2026-10-03)
});
/* dengeye dayanıklılık: kütle, sertlik ve çeviklik (C2) */
const mdhDengeGuc=p=>(kutle(p)/78)*(0.8+0.4*(p.oz&&p.oz.sertlik!=null?p.oz.sertlik:0.5))*(0.85+0.3*hrkCeviklik(p));
/* omuz mücadelesine girebilir mi: oyunda, kaleci değil, başka bir işte değil */
const mdhOmuzUygun=p=>p.oyunda&&p.rol!=='GK'&&(!p.eylem||p.eylem.ad==='omuz'||p.eylem.ad==='sendele');
/* ayak: topun gövdeye göre hangi yanda olduğu (sol / sağ); ortadaysa tercih edilen ayak */
/* (−sin, cos) gövdenin sağıdır (mac-topla.js vuruş hazırlığıyla aynı) */
const mdhAyak=(p,x,z)=>{const y=hrkCos(p.yon)*(z-p.z)-hrkSin(p.yon)*(x-p.x);return hrkAbs(y)<0.06?(p.ayak==='sol'?'sol':'sag'):y>0?'sag':'sol';};
Object.assign(Match.prototype,{
  /* top sürücünün kontrolündeyse (ayağında, ilk dokunuşta ya da dokunuşla hemen önünde) rakip onu ancak müdahaleyle alır
     (mudahaleSonuc). Yalnız uzun kaçan dokunuşta, topa sürücüden belirgin yakın olan rakip araya girebilir */
  surucuKoru(ad){
    const b=this.ball,sahip=b.sahip;
    /* müdahale hamlesindeki savunmacının ayağı topa erişti: müdahale temas anındaki geometriyle şimdi çözülür (C2) */
    for(const a of ad){const e=a.p.eylem;if(e&&e.ad==='mudahale'&&!e.oldu&&b.sonDokunan&&b.sonDokunan.team!==a.p.team){e.oldu=true;this.mudahaleSonuc(a.p,e);return true;}}
    if(sahip&&sahip.oyunda&&b.y<0.5&&!b.sut){const dS=hrkHyp(b.x-sahip.x,b.z-sahip.z);
      if(dS<1.3&&hrkHyp(b.vx,b.vz)<7){
        if(dS<0.62&&ad.some(a=>a.p===sahip))return true;
        for(let i=ad.length-1;i>=0;i--){const a=ad[i];if(a.p!==sahip&&(a.p.team===sahip.team||a.d>dS-0.5))ad.splice(i,1);}
        if(!ad.length)return true;}}
    return false;
  },
  /* şut: topa erişen savunmacı bloklar; yalnız vuran erişiyorsa temas yok */
  sutBlok(ad){
    const b=this.ball;
    if(b.sut){const bl=ad.find(a=>a.p.team!==b.sut.team&&a.p.rol!=='GK');if(bl){this.blok(bl.p);return true;}
      if(ad.every(a=>a.p===b.sut.by))return true;}
    return false;
  },
  /* hava topu adayları: topa sıçrayan rakipler 1,5 m'ye kadar mücadeleye girer */
  kafaAdaylari(kafa){
    const b=this.ball;
    for(const p of this.players){if(!p.oyunda||p.kickCd>0||p.rol==='GK'||kafa.some(a=>a.p===p)||p.team===kafa[0].p.team)continue;
      const e=p.eylem;if(e&&(e.kilit||e.ad==='tac'))continue;
      const d=hrkHyp(b.x-p.x,b.z-p.z);if(d<1.5&&b.y<kafaYuksekligi(p)+0.15)kafa.push({p,d,tur:'kafa'});}
  },
  /* en yakın oyuncu dokunur; iki takımdan biri de erişiyorsa ikili mücadele */
  kazananSec(ad){
    ad.sort((x,y)=>x.d-y.d);let kazanan=ad[0];
    const rakip=ad.find(a=>a.p.team!==kazanan.p.team);
    if(rakip&&rakip.d-kazanan.d<0.25){kazanan=this.ikiliMucadele(kazanan,rakip);if(!kazanan)return null;}
    return kazanan;
  },
  ikiliMucadele(a,c){
    /* topu önce kim alır: yakınlık, müdahale ve top sürme becerisi, gövde gücü. Kaybeden bir an geride kalır */
    const g=x=>x.p.oz.mudahale*0.5+x.p.oz.surus*0.3+(kutle(x.p)-75)/40+(0.25-x.d)*1.5;
    const pa=sigma((g(a)-g(c))*3),k=this.rast()<pa?a:c,kay=k===a?c:a;
    kay.p.kickCd=0.55;if(this.ball.sahip===kay.p)this.ball.sahip=null;
    /* yarı yarıya topta geç kalan bazen rakibi iter ya da ayağına basar (faul; top ölü) */
    if(this.phase==='play'&&kay.p.team!==k.p.team&&this.rast()<0.06*(0.5+kay.p.oz.sertlik)*MOTOR_AYAR.faulOrani/2.7){
      this.faul(kay.p,k.p,{itme:true,ciddiyet:0.2+0.4*this.rast(),x:k.p.x,z:k.p.z});return null;}
    const dx=kay.p.x-k.p.x,dz=kay.p.z-k.p.z,n=hrkHyp(dx,dz)||1;this.dengeBoz(kay.p,0.14,dx/n,dz/n,'takilma',k.p);
    return k;
  },
  /* sekme: top oyuncunun bacağına çarpıp rastgele yöne gider, hızının bir kısmını kaybeder */
  /* topun bir bedene çarpması: temas noktasındaki normale göre yansır (e: esneklik), ayak/bacak ve gövdenin yuvarlaklığı yönü biraz saptırır.
     Bacakta top yerden gider, gövdede biraz yükselir. Yansıyan topun hızı gelen hızdan ve bedenin kendi hızından gelir */
  yansit(p,e,sapma){
    const b=this.ball;let nx=b.x-p.x,nz=b.z-p.z,n=hrkHyp(nx,nz);
    if(n<1e-3){const v=hrkHyp(b.vx,b.vz)||1;nx=-b.vx/v;nz=-b.vz/v;n=1;}else{nx/=n;nz/=n;}
    const a=this.normal()*sapma,c=hrkCos(a),s=hrkSin(a),mx=nx*c-nz*s,mz=nx*s+nz*c;
    const rx=b.vx-(p.vx||0),rz=b.vz-(p.vz||0),vn=rx*mx+rz*mz;
    if(vn<0){b.vx-=(1+e)*vn*mx;b.vz-=(1+e)*vn*mz;}
    b.vx=b.vx*0.92+(p.vx||0)*0.25;b.vz=b.vz*0.92+(p.vz||0)*0.25;
    const yuk=b.y/((p.boy||1)*1.8);b.vy=yuk<0.35?hrkAbs(b.vy)*0.3+this.rast()*1.2:1+this.rast()*2.5;
    b.x=p.x+mx*(0.38);b.z=p.z+mz*(0.38);b.egri=0;b.ust=0;
  },
  sekme(p){
    const b=this.ball;this.yansit(p,0.45,0.35);
    if(b.sut)b.sut=null;this.dokunus(p,false);p.kickCd=0.35;this.on('sekme',{p});
  },
  blok(p){
    /* blok: şut savunmacının bacağına ya da gövdesine çarpıp yansır (korner, geri ya da yana gidebilir) */
    const b=this.ball,v=hrkHyp(b.vx,b.vz);this.yansit(p,0.4,0.45);
    b.sut=null;this.dokunus(p,false);p.kickCd=0.35;p.eylem={ad:'blok',t:0,sure:0.45};this.on('block',{p,v});
  },
  /* erişemediği topa çarpan beden (oyuncu ya da hakem): yalnız hızlı ve bedene doğru gelen top. Topun sahibi, vuruş yapan ve topa
     erişen (ad) bunu yaşamaz. Hakeme çarpan top oyunda kalır, son dokunan değişmez */
  govdeCarpmasi(ad){
    const b=this.ball,v=hrkHyp(b.vx,b.vz);if(v<2||b.y>2.1)return false;
    const dene=(p,hakem)=>{
      if(p===b.sahip||ad.some(a=>a.p===p)||(p.eylem&&(p.eylem.ad==='vurus'||p.eylem.ad==='ucus'))||(!hakem&&p===b.sonDokunan&&p.kickCd>0))return false;
      const dx=b.x-p.x,dz=b.z-p.z,d=hrkHyp(dx,dz);if(d>0.37||b.y>1.8*(p.boy||1)+(p.yuk||0))return false;
      if((b.vx-(p.vx||0))*dx+(b.vz-(p.vz||0))*dz>=0)return false;
      this.yansit(p,0.3,0.25);
      if(hakem){this.topDegisti();this.on('hakemeCarpti',{p});}
      else{if(b.sut&&p.team!==b.sut.team){b.sut=null;p.eylem={ad:'blok',t:0,sure:0.45};this.on('block',{p,v});}else this.on('sekme',{p});
        this.dokunus(p,false);p.kickCd=0.3;}
      return true;};
    for(const p of this.players)if(p.oyunda&&dene(p,false))return true;
    for(const r of this.refs)if(dene(r,true))return true;
    return false;
  },
  /* hava topunda sıçrama: top kısa süre sonra başın üstüne yakın bir yükseklikten geçecekse oyuncu sıçrar. Sıçrama 0,5 sn sürer,
     en yükseğe ortasında çıkar (p.yuk); yükseklik kafa becerisine bağlıdır. Erken ya da geç sıçrayan topa yetişemez */
  ziplamalar(){
    const b=this.ball;if(b.y<1.0&&b.vy<=0)return;
    const t=0.24,bx=b.x+b.vx*t,bz=b.z+b.vz*t,by=b.y+b.vy*t-0.5*G*t*t;
    for(const p of this.players){if(!p.oyunda||p.zipla||p.kickCd>0||(p.eylem&&(p.eylem.kilit||p.eylem.ad==='vurus'||p.eylem.ad==='tac'))||b.sahip===p)continue;
      const px=p.x+p.vx*t,pz=p.z+p.vz*t;if(hrkHyp(bx-px,bz-pz)>0.8)continue;
      const tepe=0.28+0.32*p.oz.kafa,bas=1.72*p.boy+0.12;
      if(by>bas-0.2&&by<bas+tepe+0.12)p.zipla={t:0,sure:0.5,tepe};}
  },
  /* orta: topun ilk metrelerindeki rakibin bacağı ortayı kesebilir; top çoğu zaman kale çizgisine doğru seker (korner) */
  ortaBlok(p){
    const b=this.ball,v=hrkHyp(b.vx,b.vz)||1,ux=b.vx/v,uz=b.vz/v,d=this.dir[p.team];
    for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK'||(o.eylem&&o.eylem.kilit))continue;
      const on=(o.x-b.x)*ux+(o.z-b.z)*uz,yan=hrkAbs((o.x-b.x)*uz-(o.z-b.z)*ux);
      if(on<0.3||on>2.4||yan>0.9||this.rast()>0.45*(1-yan/0.9))continue;
      if(this.rast()<0.6){b.vx=d*(4+this.rast()*6);b.vz=(this.rast()-0.5)*7;}
      else{b.vx=-ux*v*(0.15+this.rast()*0.2)+this.normal()*2;b.vz=-uz*v*(0.15+this.rast()*0.2)+this.normal()*2;}
      b.vy=1.5+this.rast()*4;b.egri=0;b.pasHedef=null;
      this.dokunus(o,false);o.kickCd=0.35;o.eylem={ad:'blok',t:0,sure:0.45};this.on('block',{p:o,v,orta:true});return;}
  },
  /* ============ hava topu ============ */
  havaTopu(adaylar){
    const b=this.ball,takimlar=new Set(adaylar.map(a=>a.p.team));
    let kazanan=adaylar[0];
    if(takimlar.size>1){
      this.ist.havaTopu++;
      /* temas anında başı topa en iyi uzanan (sıçrama zamanlaması ve boy), güçlü ve iyi kafa vuran kazanır */
      const g=a=>{const p=a.p;return(kafaYuksekligi(p)-b.y)*2.2+p.oz.kafa*1.2+(kutle(p)-75)/18-a.d*1.6+(p.rol==='GK'?0.5:0)+this.normal()*0.35;};
      kazanan=adaylar.reduce((x,y)=>g(x)>g(y)?x:y);
      for(const a of adaylar)if(a!==kazanan){a.p.eylem={ad:'kafa',t:0,sure:0.5,bos:true};a.p.kickCd=0.4;
        /* gövde gövdeye: güçlü ve daha yükseğe çıkan rakibi iter; havadaki oyuncu yere dengesiz inebilir (faulsüz düşüş) */
        const w=kazanan.p,q=a.p,dx=q.x-w.x,dz=q.z-w.z,n=hrkHyp(dx,dz)||1,yuk=(w.yuk||0)-(q.yuk||0);
        if(n<1.2&&w.team!==q.team)this.dengeBoz(q,(0.12+0.3*clamp((kutle(w)-kutle(q))/25+yuk*1.5,0,1)+0.1*w.oz.sertlik)*(1+(q.yuk||0)*2),dx/n,dz/n,'hava',w);}
      const kaybeden=adaylar.find(a=>a.p.team!==kazanan.p.team);
      if(kaybeden&&this.havaFaulu(kazanan.p,kaybeden.p))return;
    }
    this.kafaVur(kazanan.p);
  },
  /* ============ denge, sendeleme, düşme (C2) ============ */
  /* denge kaybı m (dayanıklılığa bölünür), (ux,uz) itildiği yön. Denge 0,3'ün altına inerse sendeler (kilitsiz; ivme düşer), 0'ın altına
     inerse itildiği yöne düşer. Topu elinde tutan kaleci ve kilitli eylemdeki oyuncu etkilenmez */
  dengeBoz(p,m,ux,uz,neden,kaynak){
    if(!p.oyunda||!(m>0)||this.ball.tasiyan===p)return;
    const e=p.eylem;if(e&&e.kilit)return;
    p.denge-=m/mdhDengeGuc(p);
    if(p.denge<0){this.dus(p,ux,uz,neden,clamp(0.35-p.denge,0.2,1),kaynak);return;}
    if(p.denge<0.3&&(!e||e.ad==='omuz'||e.ad==='sendele'||e.ad==='kontrol')){const sd=clamp((0.3-p.denge)/0.3,0,1);
      p.eylem={ad:'sendele',t:0,sure:(0.3+0.4*sd)*(this.ball.sahip===p?0.6:1),yon:hrkAtan2(uz,ux),siddet:sd};}
  },
  /* düşüş: yön itilme yönüdür (rastlantısız); arkadan itilen ya da koşarken takılan yüzüstü, önden itilen sırtüstü düşer */
  dus(p,ux,uz,neden,siddet,kaynak,yerde){
    const b=this.ball,a=hrkAtan2(uz,ux),sp=hrkHyp(p.vx,p.vz),c=hrkCos(a-p.yon);
    const yuzustu=c>0.25||(neden!=='omuz'&&neden!=='hava'&&sp>3&&c>-0.6);
    p.eylem={ad:'dusus',t:0,sure:0.45,kilit:true,fren:6,yerde:yerde||0.5+1.3*siddet,yon:a,neden,siddet,yuzustu};
    p.vx+=ux*siddet;p.vz+=uz*siddet;p.surus=null;p.tavir=null;p.zipla=null;p.denge=0;p._calim=null;
    if(b.sahip===p)b.sahip=null;
    this.on('dusus',{p,neden,siddet,yon:a,yuzustu,kaynak:kaynak||null});
  },
  /* ============ omuz omuza mücadele (C2) ============ */
  /* yan yana koşan iki rakip (0,45–0,9 m, ikisi de >3,5 m/sn, yönleri 35° içinde; top birinde ya da serbest ve yakın) ~0,3 sn'de bir birbirini iter:
     kütle, sertlik, sprint enerjisi ve denge belirler. Kaybeden yavaşlar, yana itilir ve dengesini kaybeder. Arkadan iten ya da geride kalıp
     formadan çeken faul yapar (neden 'itme') */
  omuzlar(dt){
    const b=this.ball;if(b.y>1.6||b.tasiyan)return;
    for(const a of this.teams[0]){if(!mdhOmuzUygun(a)||a.spd<3.5)continue;
      for(const c of this.teams[1]){if(!mdhOmuzUygun(c)||c.spd<3.5)continue;
        const dx=c.x-a.x,dz=c.z-a.z,d2=dx*dx+dz*dz;if(d2>0.81||d2<0.2)continue;
        if((a.vx*c.vx+a.vz*c.vz)/(a.spd*c.spd)<0.82)continue;
        const dt2=hrkHyp(b.x-(a.x+c.x)*0.5,b.z-(a.z+c.z)*0.5);if(dt2>2.5||!(b.sahip===a||b.sahip===c||!b.sahip&&dt2<1.8))continue;
        const hx=a.vx+c.vx,hz=a.vz+c.vz,hn=hrkHyp(hx,hz)||1,ex=hx/hn,ez=hz/hn,boy=dx*ex+dz*ez;
        if(hrkAbs(boy)>0.55||this.t-hrkMax(a._omuzT||-9,c._omuzT||-9)<0.3)continue;
        this.omuzIt(a,c,ex,ez,boy);if(this.phase!=='play')return;}}
  },
  omuzIt(a,c,ex,ez,boy){
    const b=this.ball,g=p=>kutle(p)*(0.6+0.5*p.oz.sertlik)*(0.7+0.3*p.enerji)*(0.6+0.4*clamp(p.denge,0,1))*(b.sahip===p?0.92:1);
    const ga=g(a)*(1+0.12*this.normal()),gc=g(c)*(1+0.12*this.normal()),kaz=ga>=gc?a:c,kay=kaz===a?c:a,fark=hrkAbs(ga-gc)/(ga+gc);
    const ilk=!(a.eylem&&a.eylem.ad==='omuz'&&a.eylem.rakip===c);
    a._omuzT=c._omuzT=this.t;
    /* arkadaki (boy: c'nin a'dan öndeliği) */
    const arkadaki=boy>0.25?a:boy<-0.25?c:null,on=arkadaki===a?c:arkadaki===c?a:null;
    /* faul: arkadan omuz (arkadaki kazandı) ya da geride kalan tutup çekti */
    if(arkadaki){const sert=arkadaki.oz.sertlik,P=arkadaki===kaz?0.15*(0.6+0.8*sert):0.05*(0.5+sert)*(1.3-arkadaki.oz.karar);
      if(this.rast()<P*MOTOR_AYAR.faulOrani/2.7){this.faul(arkadaki,on,{itme:true,omuz:true,arkadan:true,ciddiyet:0.15+0.35*fark/0.3+(arkadaki===kaz?0.1:0),x:on.x,z:on.z});return;}}
    const nx=kay.x-kaz.x,nz=kay.z-kaz.z,n=hrkHyp(nx,nz)||1,ux=nx/n,uz=nz/n;
    kay.vx=kay.vx*(0.9-fark*0.4)+ux*(0.4+3*fark);kay.vz=kay.vz*(0.9-fark*0.4)+uz*(0.4+3*fark);
    this.dengeBoz(kay,(0.12+1.6*fark)*MOTOR_AYAR.omuzGuc,ux,uz,'omuz',kaz);this.dengeBoz(kaz,0.04,-ux,-uz,'omuz',kay);
    for(const p of[a,c]){const q=p===a?c:a,e=p.eylem,taraf=hrkCos(p.yon)*(q.z-p.z)-hrkSin(p.yon)*(q.x-p.x)>0?1:-1;
      if(!e)p.eylem={ad:'omuz',t:0,sure:0.35,taraf,rakip:q,kazandi:p===kaz};
      else if(e.ad==='omuz'){e.sure=e.t+0.35;e.kazandi=p===kaz;e.rakip=q;e.taraf=taraf;}}
    if(ilk)this.on('omuz',{p:a,rakip:c,kazanan:kaz});
  },
  /* ============ müdahale (C2) ============ */
  /* pres yapan oyuncu ne zaman girer: top açıkta (sürenden 0,8 m'den uzak ve savunmacının ayağı ondan önce yetişir) ya da sürücü sırtını döndü;
     uzun kaçan topu kovalarken kayarak. Disiplinsiz ve sert oyuncu arada erken dalar. Kendi ceza sahasında istek yarıya iner (jokey ve blok) */
  mudahaleDene(p,s,dt){
    if(p.eylem||p.kickCd>0||!s||!s.oyunda)return;
    const b=this.ball;if(b.y>0.5)return;
    const db=hrkHyp(b.x-p.x,b.z-p.z);if(db>3.4)return;
    const tk=this.taktik[p.team],kutu=this.kendiCezaSahasinda(p,b.x,b.z);
    const istek=MOTOR_AYAR.mudahaleIstegi*(0.55+p.oz.mudahale*0.8)*(0.75+tk.pres*0.5)*(kutu?MOTOR_AYAR.kutuIstek:1);
    /* temas anında (0,18 sn sonra) top, savunmacı ve sürücü nerede: top sürücünün ayağından 0,8 m'den uzak, savunmacının ayağı (0,95 m)
       yetişiyor ve sürücüden yakınsa girer (top açıkta) */
    const T=0.18,bx=b.x+b.vx*T,bz=b.z+b.vz*T,eD=hrkHyp(bx-p.x-p.vx*T*0.6,bz-p.z-p.vz*T*0.6),eS=hrkHyp(bx-s.x-s.vx*T,bz-s.z-s.vz*T);
    /* savunmacı açıkta kalan topa tepki süresiyle (0,06–0,16 sn, karar) girer: top bu arada sürücüye dönerse giremez */
    if(eS>0.8&&eD<0.95&&eD<eS-0.1){if(p._acikKare!==this.kare-1)p._acikBas=this.t;p._acikKare=this.kare;
      if(this.t-p._acikBas>=0.16-0.1*p.oz.karar&&this.rast()<dt*MOTOR_AYAR.acikIstek*istek)this.mudahaleBaslat(p,s,bx,bz,'acik');return;}
    /* uzun dokunuş: top sürenden kaçıyor, savunmacı koşarak kovalıyor; kayarak ancak sürenden önce yetişirse */
    const dS=hrkHyp(b.x-s.x,b.z-s.z);
    if(dS>1.3&&db>1.3&&db<3.2&&p.spd>3.5&&(b.vx*(b.x-s.x)+b.vz*(b.z-s.z))/dS>1){
      const tK=(db-1.1)/(p.spd+1.2),kx=b.x+b.vx*tK,kz=b.z+b.vz*tK,tS=varisZamani(s,kx,kz,0.45,0.05);
      const yon=((kx-p.x)*p.vx+(kz-p.z)*p.vz)/(hrkHyp(kx-p.x,kz-p.z)*p.spd||1);
      if(yon>0.75&&tK<tS-0.05&&this.rast()<dt*MOTOR_AYAR.kaymaIstek*istek*(0.35+p.oz.sertlik))this.kaymaBaslat(p,s,kx,kz);return;}
    const ds=hrkHyp(s.x-p.x,s.z-p.z)||1,sirt=((p.x-s.x)*hrkCos(s.yon)+(p.z-s.z)*hrkSin(s.yon))/ds<-0.5;
    if(db<1.25&&sirt&&this.rast()<dt*0.9*istek*(0.5+p.oz.sertlik)){this.mudahaleBaslat(p,s,bx,bz,'sirt');return;}
    if(db<1.4&&this.rast()<dt*MOTOR_AYAR.sabirsiz*istek*(1.3-p.oz.karar)*(0.5+p.oz.sertlik))this.mudahaleBaslat(p,s,bx,bz,'erken');
  },
  /* çalımla geçilen savunmacı bazen formadan çeker ya da çelme takar (taktik faul; gelişen atakta çoğu zaman sarı) */
  gecildiFaulu(o,p){
    if(!o.oyunda||o.rol==='GK'||o.eylem&&o.eylem.kilit||this.phase!=='play'||hrkHyp(o.x-p.x,o.z-p.z)>1.5)return;
    const kutu=this.kendiCezaSahasinda(o,p.x,p.z),ileri=p.x*this.dir[p.team]>0;
    if(this.rast()<MOTOR_AYAR.taktikFaul*(0.4+o.oz.sertlik)*(1.3-0.5*o.oz.karar)*(kutu?0.15:1)*(ileri?1.3:0.7))
      this.faul(o,p,{itme:true,arkadan:true,taktik:true,ciddiyet:0.25+0.25*this.rast(),x:p.x,z:p.z});
  },
  mudahaleBaslat(p,s,x,z,tur){
    p.eylem={ad:'mudahale',t:0,sure:0.5,temas:0.18,oldu:false,tur};p.yonHedef=hrkAtan2(z-p.z,x-p.x);p.tx=x;p.tz=z;p.hizOran=1;p.tavir=null;this.eforVer(p,1);
    this.on('mudahale',{p,rakip:s,kayma:false,tur});
  },
  kaymaBaslat(p,s,x,z){
    const a=hrkAtan2(z-p.z,x-p.x),v=hrkMax(p.spd,5.5)+1.2;
    p.eylem={ad:'kayma',t:0,sure:0.95,kilit:true,fren:4.5,oldu:false,tur:'kayma'};p.vx=hrkCos(a)*v;p.vz=hrkSin(a)*v;p.yon=a;p.tavir=null;
    this.on('kayma',{p});this.on('mudahale',{p,rakip:s,kayma:true,tur:'kayma'});
  },
  /* müdahalenin muhatabı: topun sahibi rakipse o, değilse ayağın ucuna en yakın rakip (topu az önce bırakan dahil) */
  mdhRakip(p,x,z){
    const b=this.ball;if(b.sahip&&b.sahip.team!==p.team&&b.sahip.oyunda)return b.sahip;
    let en=null,ed=1.2;for(const o of this.teams[1-p.team]){if(!o.oyunda)continue;const d=hrkHyp(o.x-x,o.z-z);if(d<ed){ed=d;en=o;}}return en;
  },
  /* kayarak müdahalede bacak her adım süpürür: gövdenin önünden 1,05 m'ye kadar */
  kaymaTemas(p){
    const e=p.eylem;if(!e||e.ad!=='kayma'||e.oldu||e.t<0.1||e.t>0.62)return;
    const b=this.ball,c=hrkCos(p.yon),sn=hrkSin(p.yon),ax=p.x+c*0.2,az=p.z+sn*0.2,bx=p.x+c*1.05,bz=p.z+sn*1.05;
    const dTop=b.y<0.5?segD(b.x,b.z,ax,az,bx,bz):9,s=this.mdhRakip(p,bx,bz),dAdam=s?segD(s.x,s.z,ax,az,bx,bz):9;
    if(dTop<0.26||dAdam<0.4){e.oldu=true;this.mudahaleSonuc(p,e);}
  },
  /* müdahalenin sonucu temas anındaki geometriden: ayak kapsülü topa mı adama mı (hangisine önce) değiyor, sürücü topu ayağında ya da
     gövdesinin arkasında mı tutuyor. Sonuç: temiz kazanma, topu dürtme, blok, geçilme; adama değdiyse şiddete göre faul */
  mudahaleSonuc(p,e){
    const b=this.ball,kayma=e.ad==='kayma';
    let fa=p.yon;if(!kayma){const f=hrkAciFark(hrkAtan2(b.z-p.z,b.x-p.x),p.yon);fa=hrkAciNorm(p.yon+clamp(f,-1,1));}
    const c=hrkCos(fa),sn=hrkSin(fa),R=kayma?1.05:0.75,r0=kayma?0.2:0.15,ax=p.x+c*r0,az=p.z+sn*r0,bx=p.x+c*R,bz=p.z+sn*R;
    const s=this.mdhRakip(p,bx,bz),boyu=(x,z)=>clamp(((x-ax)*c+(z-az)*sn)/(R-r0),0,1);
    const dTop=b.y<0.5?segD(b.x,b.z,ax,az,bx,bz):9,topa=dTop<0.26;
    const dAdam=s?segD(s.x,s.z,ax,az,bx,bz):9,adama=dAdam<(topa?0.4:0.5),adamOnce=adama&&(!topa||boyu(s.x,s.z)<boyu(b.x,b.z)-0.15);
    const dS=s?hrkHyp(b.x-s.x,b.z-s.z):9,kontrol=dS<0.45,kalkan=!!s&&segD(s.x,s.z,p.x,p.z,b.x,b.z)<0.3&&hrkHyp(s.x-p.x,s.z-p.z)<hrkHyp(b.x-p.x,b.z-p.z);
    /* topa değdiyse: beceri, sürücünün topu ayağında tutması ve isabet (top ayağın ortasında mı) */
    let sonuc='gecildi';
    if(topa&&!adamOnce&&!kalkan){const beceri=p.oz.mudahale-(s?s.oz.surus:0.4)*0.7;
      const P=clamp(0.6+0.35*beceri+(kontrol?-0.25:0.12)+(kayma?0.05:0)-dTop*0.5,0.12,0.95);
      sonuc=this.rast()<P?(!kayma&&!kontrol&&hrkHyp(b.vx-p.vx,b.vz-p.vz)<6&&this.rast()<0.3+0.3*p.oz.mudahale?'temiz':'durttu'):'blok';}
    const kazan=sonuc==='temiz'||sonuc==='durttu';
    /* adama değdi: şiddet c = bağıl hız/6 + arkadan 0,35 + kayarak 0,25 + geç 0,3 − önce topa değdi 0,4; P(faul)=σ((c−eşik)/0,12) */
    if(s&&adama){
      const ds=hrkHyp(s.x-p.x,s.z-p.z)||1,arkadan=((p.x-s.x)*hrkCos(s.yon)+(p.z-s.z)*hrkSin(s.yon))/ds<-0.35;
      const gec=b.sahip!==s&&b.sonDokunan===s&&dS>1.3,once=kazan&&!adamOnce,vrel=hrkHyp(p.vx-s.vx,p.vz-s.vz);
      const cc=vrel/6+(arkadan?0.35:0)+(kayma?0.25:0)+(gec?0.3:0)-(once?0.4:0)+(p.oz.sertlik-0.5)*0.3+this.normal()*0.06;
      if(this.rast()<sigma((cc-MOTOR_AYAR.faulEsik)/0.12)){
        this.on('mudahaleSonuc',{p,rakip:s,kazan:false,topaDegdi:topa,faul:true,kayma,sonuc:'faul',tur:e.tur||(kayma?'kayma':'acik')});
        this.faul(p,s,{kayma,arkadan,gec,deneme:true,ciddiyet:cc,x:s.x,z:s.z});return;}
      /* faulsüz temas: sürücünün dengesi bozulur; önce topa değen kayma çoğu zaman düşürür */
      const ix=s.x-p.x+c*0.5,iz=s.z-p.z+sn*0.5,n=hrkHyp(ix,iz)||1;
      this.dengeBoz(s,(0.2+0.55*clamp(cc+0.4,0,1.2))*(kayma?1.6:1),ix/n,iz/n,kayma?'kayma':'takilma',p);}
    if(topa&&!adamOnce&&!kalkan){
      const vfx=p.vx+c*(kayma?2.5:3.5),vfz=p.vz+sn*(kayma?2.5:3.5),yan=(b.x-ax)*(-sn)+(b.z-az)*c,sap=clamp(yan/0.26,-1,1)*0.5;
      p.sonDokunus={t:this.t,tur:'cal',ayak:mdhAyak(p,b.x,b.z),yuzey:kayma?'ust':sonuc==='temiz'?'ic':hrkAbs(yan)>0.12?'dis':'ic'};
      if(b.sahip&&b.sahip!==p)b.sahip.surus=null;
      if(sonuc==='temiz'){b.vx=p.vx*0.9+c*0.6;b.vz=p.vz*0.9+sn*0.6;b.vy=0;b.egri=0;b.ust=0;this.dokunus(p,true);this.sahipYap(p);this.on('steal',{p,kayma});}
      else if(sonuc==='durttu'){let vx=vfx*0.65+b.vx*0.35,vz=vfz*0.65+b.vz*0.35;const cs=hrkCos(sap),ss=hrkSin(sap),wx=vx*cs-vz*ss;vz=vx*ss+vz*cs;vx=wx;
        const v=hrkHyp(vx,vz)||1,k=clamp(v,1.5,8)/v;b.vx=vx*k;b.vz=vz*k;b.vy=0;b.egri=0;b.ust=0;b.sahip=null;this.dokunus(p,true);this.on('steal',{p,kayma});}
      else{/* blok: iki ayak aynı anda; top aradan yana seker */const k=yan>=0?1:-1;b.vx=-sn*k*2.2+b.vx*-0.2;b.vz=c*k*2.2+b.vz*-0.2;b.vy=0.8;b.egri=0;b.ust=0;
        b.sahip=null;this.dokunus(p,false);}}
    /* geçilen ya da bloklanan: savunmacı bir an toparlanamaz, hızla girdiyse dengesini kaybeder */
    if(!kazan){p.kickCd=kayma?0.8:0.5;if(!kayma)this.dengeBoz(p,0.12+0.05*p.spd,c,sn,'takilma',s);}
    this.on('mudahaleSonuc',{p,rakip:s,kazan,topaDegdi:topa,faul:false,kayma,sonuc,tur:e.tur||(kayma?'kayma':'acik')});
  },
  /* topu alan oyuncuya arkadan itme ya da forma çekme (kendi ceza sahasında hakem daha az görür / savunmacı daha dikkatli) */
  sirtFaulu(p){
    for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK'||(o.eylem&&o.eylem.kilit))continue;
      const dx=o.x-p.x,dz=o.z-p.z,d=hrkHyp(dx,dz);if(d>1.0)continue;
      const arkada=(dx*hrkCos(p.yon)+dz*hrkSin(p.yon))/(d||1)<0.2,kutu=this.kendiCezaSahasinda(o,p.x,p.z);
      if(this.rast()<(arkada?0.12:0.05)*(0.6+o.oz.sertlik*0.8)*MOTOR_AYAR.faulOrani*(kutu?MOTOR_AYAR.kutuIstek*0.6:1)){
        this.faul(o,p,{ciddiyet:0.1+this.rast()*0.3+(arkada?0.1:0),x:p.x,z:p.z,itme:true,arkadan:arkada});return;}}
  },
  /* hava topunda itme ya da tutma */
  havaFaulu(kazanan,kaybeden){
    const P=0.055*(0.6+kaybeden.oz.sertlik*0.8)*MOTOR_AYAR.faulOrani,P2=0.03*MOTOR_AYAR.faulOrani;
    if(this.rast()<P){this.faul(kaybeden,kazanan,{hava:true,ciddiyet:0.15+this.rast()*0.25,x:kazanan.x,z:kazanan.z});return true;}
    if(this.rast()<P2){this.faul(kazanan,kaybeden,{hava:true,ciddiyet:0.1+this.rast()*0.2,x:kaybeden.x,z:kaybeden.z});return true;}
    return false;
  },
  /* ============ faul, kart, avantaj ============ */
  faul(yapan,yiyen,v){
    const b=this.ball,x=clamp(v.x,-PL+0.3,PL-0.3),z=clamp(v.z,0.3,PW-0.3),h=this.half-1,neden=v.kayma?'kayma':v.hava?'hava':v.itme?'itme':'mudahale';
    const c=v.ciddiyet||0,yd=this.dir[yiyen.team],yu=x*yd,kutu=this.cezaSahasi(yapan.team,x,z);
    this.ist.faul[yapan.team]++;
    /* faul yiyen temasın yönüne düşer (yapanın konumu ve bağıl hızı); hafif itme ve tutmada yalnız sendeler */
    let ix=yiyen.x-yapan.x+(yapan.vx-yiyen.vx)*0.15,iz=yiyen.z-yapan.z+(yapan.vz-yiyen.vz)*0.15;const n=hrkHyp(ix,iz)||1;ix/=n;iz/=n;
    const ayakta=c<0.35&&!v.kayma&&!v.hava&&yiyen.denge>0.5&&!(yiyen.eylem&&yiyen.eylem.kilit);
    if(ayakta){yiyen.denge=0.28;this.dengeBoz(yiyen,0.01,ix,iz,'faul',yapan);}
    else if(!(yiyen.eylem&&yiyen.eylem.kilit))this.dus(yiyen,ix,iz,'faul',clamp(c,0.2,1),yapan,0.6+this.rast()*1.6*(0.4+clamp(c,0,1)));
    yiyen.surus=null;if(b.sahip===yiyen&&!ayakta)b.sahip=null;
    /* açık gol fırsatı: faul yiyen top ondayken ya da ona gelirken kaleye 22 m içinde, merkezde, kaleye yöneliyor; yapan dışında kaleyle
       arasında savunmacı yok. Gelişen atak: faul yiyen takım ileri gidiyor ve kaleyle arasında en çok dört savunmacı */
    const onda=b.sahip===yiyen||b.sonDokunan===yiyen&&hrkHyp(b.x-yiyen.x,b.z-yiyen.z)<3||b.hedefOyuncu===yiyen;
    let arada=0;for(const q of this.teams[yapan.team])if(q!==yapan&&q.oyunda&&q.rol!=='GK'&&q.x*yd>yu)arada++;
    const dogso=onda&&!v.hava&&yu>PL-22&&hrkAbs(z-MZ)<12&&arada===0&&(yiyen.vx*yd>2||b.vx*yd>3);
    const spa=!dogso&&b.sonTakim===yiyen.team&&yu>-5&&arada<=4&&(yiyen.vx*yd>1.5||b.vx*yd>2);
    let kart=null,kartNeden=null;const r=this.rast(),r2=this.rast();
    if(c>=1.25&&(v.kayma||v.arkadan)&&r<0.35){kart='kirmizi';kartNeden='asiri';}                 /* aşırı sert */
    else if(dogso&&r2<MOTOR_AYAR.firsatKirmizi){kart=kutu&&v.deneme?'sari':'kirmizi';kartNeden='firsat';}          /* kutuda topa oynama girişimi: sarı */
    else if(r<sigma((c-MOTOR_AYAR.kartEsik)/0.07)){kart='sari';kartNeden='siddet';}             /* pervasız */
    else if(spa&&r2<MOTOR_AYAR.sariAtak+(v.taktik?0.3:0)){kart='sari';kartNeden='atak';}                                       /* gelişen atağı kesti */
    const penalti=kutu&&!v.hava||(v.hava&&kutu&&this.rast()<0.5);
    /* avantaj: ciddi değil, takım topu tutacak ve atağın geleceği var */
    if(!penalti&&kart!=='kirmizi'&&c<0.8&&this.avantajVar(yiyen,yu,ayakta)){
      this.avantaj={t:this.t,kare:this.kare,takim:yiyen.team,x,z,kart,yapan,yiyen,neden,tuttu:false,u0:b.x*yd};this.refs[0].eylem={ad:'avantaj',t:0,sure:1.4};
      this.on('avantaj',{takim:yiyen.team,aleyhe:yapan.team,faulYapan:yapan,faulYiyen:yiyen,neden,siddet:c,omuz:!!v.omuz,kartNeden});return;}
    this.duranSure[h]+=penalti?60:15+(kart?15:0);
    this.on('faul',{faulYapan:yapan,faulYiyen:yiyen,takim:yiyen.team,aleyhe:yapan.team,x,z,penalti,kart,neden,siddet:c,omuz:!!v.omuz,kartNeden});
    this.refs[0].eylem={ad:penalti?'penaltiGoster':'duduk',t:0,sure:1.0};
    this.durusBaslat(penalti?'penalti':'serbest',yiyen.team,penalti?this.dir[yiyen.team]*(PL-PENALTI_U):x,penalti?MZ:z,
      {bekle:1.4+(kart?2.2:0)+this.rast()*0.8,kart,faulYapan:yapan,duduk:true});
    if(kart)this.kartGoster(yapan,kart);
    this.itirazEt(yapan);
  },
  /* avantaj koşulu: topu kim alacak (sahibi ya da serbest topa ~0,8 sn içinde ilk yetişen; faul yiyenin kendisi ancak ayaktaysa) faul yiyen
     takımdan mı, atağın geleceği var mı (rakip yarıda baskı düşük ya da önde boşta bir arkadaş: ileri pas seçeneği) */
  avantajVar(yiyen,yu,ayakta){
    const b=this.ball,t=yiyen.team,d=this.dir[t];if(yu<-10)return false;
    let kimde=b.sahip&&b.sahip.oyunda?b.sahip:null;
    if(!kimde){const k=this.topTahmin(0.4);let en=1e9;
      for(const q of this.players){if(!q.oyunda||(q.eylem&&q.eylem.kilit))continue;const tq=varisZamani(q,k.x,k.z,0.6,0.15);if(tq<en){en=tq;kimde=q;}}
      if(en>0.8)kimde=null;}
    if(!kimde||kimde.team!==t||(kimde===yiyen&&!ayakta))return false;
    const ku=kimde.x*d;if(ku>0&&baskiAltinda(this,kimde)<0.45)return true;
    for(const q of this.teams[t]){if(q===kimde||!q.oyunda||q.rol==='GK'||q.x*d<ku+4||hrkHyp(q.x-kimde.x,q.z-kimde.z)>32)continue;
      if(enYakinRakip(this,q.x,q.z,t).d>3)return true;}
    return false;
  },
  /* avantajın süresi: 1,5 sn içinde top faul yiyen takıma geçmezse, 2,5 sn içinde kaybedilir ya da 10 m geri giderse faule dönülür;
     2,5 sn tutulursa avantaj gerçekleşmiştir (kart ilk duruşta). Oyun bu arada durduysa top bizdeyse tutulmuş sayılır */
  avantajAdim(dt){
    const a=this.avantaj;if(!a)return;
    const b=this.ball,el=this.t-a.t;
    if(this.kare-a.kare>2){this.avantaj=null;if(a.kart)this.bekleyenKart=a;this.on('avantajSonuc',{tutuldu:!!a.tuttu});return;}
    a.kare=this.kare;
    if(b.sahip&&b.sahip.team===a.takim)a.tuttu=true;
    const kayip=b.sahip&&b.sahip.team!==a.takim,geri=a.u0-b.x*this.dir[a.takim]>=10;
    if(el<2.5&&(kayip||geri)||!a.tuttu&&el>1.5){/* avantaj gerçekleşmedi: faule dön */this.avantaj=null;
      this.on('faul',{faulYapan:a.yapan,faulYiyen:a.yiyen,takim:a.takim,aleyhe:a.yapan.team,x:a.x,z:a.z,penalti:false,kart:a.kart,neden:a.neden,avantajdan:true});this.on('avantajSonuc',{tutuldu:false});
      this.duranSure[this.half-1]+=15;this.refs[0].eylem={ad:'duduk',t:0,sure:1.0};
      this.durusBaslat('serbest',a.takim,a.x,a.z,{bekle:1.2+(a.kart?2:0),kart:a.kart,faulYapan:a.yapan,duduk:true});if(a.kart)this.kartGoster(a.yapan,a.kart);}
    else if(el>=2.5){this.avantaj=null;if(a.kart)this.bekleyenKart=a;this.on('avantajSonuc',{tutuldu:true});}
  }
});
EYLEM_ADIM.kayma=function(p,e){
  if(!e.oldu&&e.t>0.62){e.oldu=true;p.kickCd=0.8;this.on('mudahaleSonuc',{p,rakip:null,kazan:false,topaDegdi:false,faul:false,kayma:true,sonuc:'gecildi',tur:'kayma'});}
  if(e.t>=e.sure){p.eylem={ad:'kalkis',t:0,sure:0.6,kilit:true,fren:12,yon:p.yon,yuzustu:false,neden:'kayma'};return true;}return false;};
/* düşüş → yerde → kalkış: yön, neden, şiddet ve yüzüstü bilgisi taşınır (çizim yönü bilir) */
EYLEM_ADIM.dusus=function(p,e){if(e.t>=e.sure){p.eylem={ad:'yerde',t:0,sure:e.yerde||1.2,kilit:true,fren:12,yon:e.yon,neden:e.neden,siddet:e.siddet,yuzustu:e.yuzustu};return true;}return false;};
EYLEM_ADIM.yerde=function(p,e){if(e.t>=e.sure){p.eylem={ad:'kalkis',t:0,sure:0.6,kilit:true,fren:12,yon:e.yon,neden:e.neden,siddet:e.siddet,yuzustu:e.yuzustu};return true;}return false;};
EYLEM_ADIM.mudahale=function(p,e){if(!e.oldu&&e.t>=e.temas){e.oldu=true;this.mudahaleSonuc(p,e);}return false;};
