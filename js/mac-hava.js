/* ============ Chairman — maç motoru: hava topu (mantık, çizimsiz) ============
   Sahibi: C akışı (T6, 2026-10-10; gerçekçilik planı §4 T6). Sıçrama (planı ve yürütmesi), hava teması, hava düellosu ve hava faulü. T6'ya kadar
   sıçrama (ziplamalar), kafa adayları, düello ve hava faulü js/mac-mudahale.js'teydi; buraya taşındı.
   T6a (sıçrama modeli): sıçrama planlı eylemdir — p.zipla {t, sure, tepe, kos, hz}: t < 0 kalkış hazırlığı (−hz'den başlar), 0'da kalkış, sure'de
   iniş; p.yuk = tepe·4f(1 − f), f = t/sure (motor → çizim). Yükseklik sıçrama alt özelliğinden (durarak 0,30–0,42 m, koşarak +0,08–0,12;
   yorgunluk düşürür), uçuş süresi fizikten (sure = 2√(2·tepe/g)). Kalkış temas anını hedefler: oyuncu topun alnının erişiminden geçeceği ilk anı
   (tc) görür; hazırlık + tepeye çıkış kalınca kalkar. Zamanlama hatası ε (sn; + geç: tepe temastan sonra) oyuncu ve top sürümü başına tek zar,
   σ = taban + çarpan × (1 − okuma), okuma = sezgi ve kafa; top 15 m/sn'den hızlı gelirse büyür. Havada ivme yok (moveP havaIvme); durarak sıçrayan
   hazırlıkta frenler, kalkışta yatay hızının %35'ini, koşarak sıçrayan sicramaYatay'ını korur. Çekişmede (2 m içinde rakip) en yükseğe, yoksa
   gerektiği kadar sıçrar. Rakipsiz pası bekleyen alıcı sıçramaz (topun inmesini bekler; kovala). Düşen oyuncunun havadaki sıçraması iniş sürer
   (eskiden zipla silinip p.yuk kalıyordu: oyuncu havada asılı kalabiliyordu).
   Baş: kafaYuksekligi başın tepesidir; alın 0,10 m altı (hvAlin). */
'use strict';
ayarEkle('C',{
  sicramaDur:[0.30,0.12],      // T6a: durarak (çift ayak, karşı hareketli) sıçrama: taban + çarpan × sıçrama alt özelliği (m; Ek G4: 0,40–0,45 kol salınımıyla)
  sicramaKos:[0.08,0.04],      // T6a: koşarak (tek ayak) ek yükseklik: taban + çarpan × min(1, (hız − 2,5)/3) (m); koşarak sayılması için hız ≥ 2,5 m/sn
  sicramaHazir:[0.15,0.08],    // T6a: kalkıştan önce hazırlık (sn): durarak karşı hareket, koşarak son adım
  sicramaZaman:[0.04,0.08],    // T6a: zamanlama hatasının σ'sı: taban + çarpan × (1 − okuma) (sn; Claude kararı 0,04–0,12)
  sicramaYatay:0.7,            // T6a: koşarak sıçramada kalkışta korunan yatay hız oranı (durarak 0,35)
  havaIvme:0.05                // T6a: havadayken ivme sınırının çarpanı (ayak yerde değil; eskiden 0,25)
});
/* alnın yüksekliği (m; sıçrayarak) ve ayaktaki yüksekliği: başın tepesinin (kafaYuksekligi) 0,10 m altı */
const hvAlin=p=>1.72*(p.boy||1)+0.02+(p.yuk||0),hvAlinDur=p=>1.72*(p.boy||1)+0.02;
/* topun uçuşunu okuma (0–1): sezgi ve kafa */
const hvOkuma=p=>0.5*profilAlt(p,'sezgi',p.oz.karar)+0.5*p.oz.kafa;
/* sıçrama yüksekliği (m): v kalkıştaki hız (≥ 2,5 m/sn koşarak) */
const hvSicramaH=(p,v)=>{const A=MOTOR_AYAR,D=A.sicramaDur,K=A.sicramaKos;let h=D[0]+D[1]*profilAlt(p,'sicrama',p.oz.kafa);
  if(v>=2.5)h+=K[0]+K[1]*Math.min(1,(v-2.5)/3);return h*(1-0.15*(p.yorgunluk||0));};
const hvUcus=h=>2*Math.sqrt(2*h/G);
/* sıçramanın ilerlemesi (çekirdeğin adım döngüsünden). Kalkışta yatay hız: koşarak sicramaYatay, durarak 0,35 */
function ziplaIlerle(p,dt){const z=p.zipla,t0=z.t;z.t+=dt;
  if(t0<0&&z.t>=0){const k=z.kos?MOTOR_AYAR.sicramaYatay:0.35;p.vx*=k;p.vz*=k;p.spd*=k;}
  const f=z.t/z.sure;p.yuk=f>0&&f<1?z.tepe*4*f*(1-f):0;if(f>=1)p.zipla=null;}
Object.assign(Match.prototype,{
  /* ============ T6a: sıçrama planı (temaslar'ın başında, her adım) ============
     Top sahipsiz ve havadayken (yükselirken ya da 0,9 m üstünde) saha oyuncularının her biri topun önümüzdeki 0,9 sn'lik yolunda alnının
     erişimine (yatayda 0,55 m, koşarak 0,65; dikeyde ayaktaki alın − 0,25 … alın + en yüksek sıçrama + 0,15) ilk girdiği anı arar. Yatay yer:
     koşan oyuncu hazırlıkta hızıyla, kalkıştan sonra sicramaYatay'la ilerler; duran yerinde kalır. Sıçrama gerekmiyorsa (top ayaktaki alnın
     0,05 m üstünden alçak) ya da çok yüksekse (çekişme yokken en yüksek sıçramanın 0,12 m, çekişmede 0,25 m üstü) plan yok */
  sicramalar(){
    const b=this.ball;if(b.sahip||b.tasiyan||(b.y<0.9&&b.vy<=0.5))return;
    const A=MOTOR_AYAR,yol=this.topYolu(),i0=Math.max(0,Math.round((this.t-this._yolT0)*60)-1),iN=Math.min(yol.length-1,i0+54);
    for(const p of this.players){
      if(!p.oyunda||p.rol==='GK'||p.zipla||p.kickCd>0)continue;
      const e=p.eylem;if(e&&(e.kilit||e.ad==='vurus'||e.ad==='tac'||e.ad==='kafa'))continue;
      const dx0=b.x-p.x,dz0=b.z-p.z;if(dx0*dx0+dz0*dz0>400)continue;
      /* rakipsiz pası bekleyen alıcı sıçramaz (kovala: topun inmesini bekler) */
      if(b.hedefOyuncu===p&&enYakinRakip(this,p.x,p.z,p.team).d>3.5)continue;
      const sp=p.spd,kos=sp>=2.5,hz=kos?A.sicramaHazir[1]:A.sicramaHazir[0],hM=hvSicramaH(p,sp),aD=hvAlinDur(p),R=kos?0.65:0.55,ky=kos?A.sicramaYatay:0.35;
      let tc=-1,yc=0,cx=0,cz=0;
      for(let i=i0+2;i<=iN;i+=2){const s=yol[i],t=(i-i0)/60;if(s.y<aD-0.25||s.y>aD+hM+0.25)continue;
        const ileri=kos?(t<=hz?t:hz+(t-hz)*ky):Math.min(t,hz)*0.5+Math.max(0,t-hz)*ky*0.5,px=p.x+p.vx*ileri,pz=p.z+p.vz*ileri;
        const dx=s.x-px,dz=s.z-pz;if(dx*dx+dz*dz>R*R)continue;
        tc=t;yc=s.y;cx=px;cz=pz;break;}
      if(tc<0)continue;
      const ihtiyac=yc-aD;if(ihtiyac<0.05)continue;
      let cek=false;for(const o of this.teams[1-p.team]){if(!o.oyunda||o.rol==='GK')continue;const k=Math.min(tc,0.5),ox=o.x+o.vx*k-cx,oz=o.z+o.vz*k-cz;if(ox*ox+oz*oz<4){cek=true;break;}}
      if(ihtiyac>hM+(cek?0.25:0.12))continue;
      /* zamanlama hatası: oyuncu ve top sürümü başına tek zar (okuma; hızlı top) */
      if(p._hvS!==b.surum){p._hvS=b.surum;const v=hyp(b.vx,b.vz),Z=A.sicramaZaman;p._hvE=this.normal()*(Z[0]+Z[1]*(1-hvOkuma(p)))*(1+0.3*clamp((v-15)/10,0,1));}
      const h=cek?hM:clamp(ihtiyac+0.06,0.12,hM),T=hvUcus(h);
      if(tc+p._hvE<=hz+T/2+0.5/60)p.zipla={t:-hz,sure:T,tepe:h,kos,hz};
    }
  },
  /* hava topu adayları: topa sıçrayan rakipler 1,5 m'ye kadar mücadeleye girer (T6b'de geometriden) */
  kafaAdaylari(kafa){
    const b=this.ball;
    for(const p of this.players){if(!p.oyunda||p.kickCd>0||p.rol==='GK'||kafa.some(a=>a.p===p)||p.team===kafa[0].p.team)continue;
      const e=p.eylem;if(e&&(e.kilit||e.ad==='tac'))continue;
      const d=hrkHyp(b.x-p.x,b.z-p.z);if(d<1.5&&b.y<kafaYuksekligi(p)+0.15)kafa.push({p,d,tur:'kafa'});}
  },
  /* ============ hava topu (T6b'de geometriden) ============ */
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
  /* T5 (2026-10-09): hava topunda faul temastan — kaybeden kazanana yatay kapanma hızıyla (1,2 m'den yakın) çarpar; şiddet = kapanma/5 +
     arkadan 0,3 + daha alçakta kalıp havadakine girme 0,15 + agresiflik; tek zar hakemin görmesi (T6 sıçrama zamanlamasıyla genişletir) */
  havaFaulu(kazanan,kaybeden){
    const w=kazanan,q=kaybeden,dx=w.x-q.x,dz=w.z-q.z,d=hrkHyp(dx,dz);if(d>1.2||d<1e-3)return false;
    const vk=hrkMax(0,((q.vx-w.vx)*dx+(q.vz-w.vz)*dz)/d),arka=(-dx*hrkCos(w.yon)-dz*hrkSin(w.yon))/d;   /* arka < −0,3: kaybeden kazananın arkasında */
    const cc=vk/5+(arka<-0.3?0.3:0)+((q.yuk||0)<(w.yuk||0)-0.1?0.15:0)+(profilAlt(q,'agresiflik',q.oz.sertlik)-0.5)*0.5;
    return this.temasFaulu(q,w,cc,{hava:true,arkadan:arka<-0.3,kaynak:'hava',x:w.x,z:w.z});
  }
});
