/* ============ Chairman — maç motoru: kaleci (mantık, çizimsiz) ============
   Sahibi: D akışı (MM4, 2026-10-03). Şuta tepki, kurtarış (adım, uçuş, ayakla kapama, parmak ucu, üst direğin üstüne çelme), tutma, çelme ve
   düşürme, yerden kalkış ve ikinci kurtarış, orta/kornerde alma ya da yumruk, elle oynama kuralı, yer tutma (hazır duruş, yakın direk, süpürücü,
   bire birde açı daraltma ve kapanma), topu elde taşıma ve pas analiziyle dağıtım, kale vuruşu, penaltıda taraf seçimi.
   Model (B↔D sözleşmesi): tepki = kaleciTepki·(1,25−0,5·kalecilik) (+0,10–0,18 görüş kapalıysa, −0,05 hazır duruşta); tepkiden sonra ayakta
   yana adım ve uzanma ya da ~0,12 sn çömelip (itiş) 3,6+2,6·kalecilik m/sn ile dalış; kalçanın çevresinde yüksekliğe göre bir erişim elipsi.
   kaleciTahmin / kaleciHavaTahmin saftır (rastlantı ve önbellek yok): B şut ve orta seçerken kullanır. Kurtarış aynı işlevlerle (kaleciPay)
   karar verir; temas her adımda elin, gövdenin ve bacakların kapsülleri ile topun yolu arasında aranır (tek düzlem denetimi değil).
   Tepki ve dalış hızındaki küçük sapmalar (tohumlu) kaleciTahmin'in P'sindeki belirsizliği (KL_M.sapma) üretir. */
'use strict';
ayarEkle('D',{
  kaleciTepki:0.2,             // şuta tepki süresi (sn) ·(1,25 − 0,5·kalecilik); görüş kapalıysa +0,10–0,18, hazır duruşta −0,05
  kaleciErisim:1.0,            // uzanma (erişim elipsi) çarpanı
  kaleciUcus:[3.6,2.6],        // dalışta yanal hız (m/sn) = a + b·kalecilik (yüksek dalışta azalır)
  kaleciTutma:0.84,            // kurtarışta topu tutma olasılığı çarpanı (en çok 0,96 olan olasılığa uygulanır)
  kaleciCikis:0.2              // boştaki topa çıkmak için rakibe göre gereken zaman payı (sn)
});
/* model sabitleri: itiş (çömelme) süresi, uzanmanın tamamlanması (sn), yana adım ve geri çekilme hızı (m/sn), erişimdeki belirsizlik (m; P için), el+top yarıçapı */
const KL_M={itis:0.12,uzanma:0.28,adim:3.0,geri:3.0,sapma:0.22,elR:0.21};
/* ---- saf model ---- */
/* tepki süresi (sn): kalecilik; topla kaleci arasındaki çizgiye yakın beden görüşü kapatır (+0,10–0,18); hazır duruş −0,05 */
function kaleciTepkiSuresi(m,gk,bx,bz){
  const dx=gk.x-bx,dz=gk.z-bz,L2=dx*dx+dz*dz;let perde=0;
  if(L2>9){const L=Math.sqrt(L2);for(const o of m.players){if(!o.oyunda||o===gk)continue;const ox=o.x-bx,oz=o.z-bz,f=(ox*dx+oz*dz)/L2;if(f<0.12||f>0.88)continue;
    const yan=Math.abs(ox*dz-oz*dx)/L;if(yan<0.6)perde=Math.max(perde,0.1+0.08*(1-yan/0.6));}}
  return MOTOR_AYAR.kaleciTepki*(1.25-0.5*gk.oz.kalecilik)+perde-(gk.tavir==='hazir'&&(gk.spd||0)<1.2?0.05:0);}
/* dalış: kalça yükseğe (yh) sıçrarken itiş uzar, yana daha yavaş ve daha az gider (balistik uçuşta kalçanın yana en çok gidebileceği yol);
   alçak köşeye yere inmek de itişi biraz uzatır */
const kaleciYuksek=yh=>clamp((yh-0.9)/0.5,0,1);
function kaleciDalisHizi(gk,yh){const A=MOTOR_AYAR.kaleciUcus;return(A[0]+A[1]*gk.oz.kalecilik)*(1-0.3*kaleciYuksek(yh));}
function kaleciItis(yh){return KL_M.itis+0.05*kaleciYuksek(yh)+0.03*clamp((0.6-yh)/0.35,0,1);}
function kaleciUcusYolu(gk,yh){return(1.75-0.25*kaleciYuksek(yh))*(gk.boy||1)*MOTOR_AYAR.kaleciErisim;}
/* dalışta kalça: itişten tp sn sonra yh yüksekliğinde olacak sıçrama hızı ve balistik yükseklik (yerde 0,22) */
function kaleciSicrama(gk,yh,tp){const y0=0.8*(gk.boy||1);return clamp((yh-y0+0.5*G*tp*tp)/Math.max(0.08,tp),-1.5,3.6);}
function kaleciKalcaY(y0,vy,tp){return Math.max(0.22,y0+vy*tp-0.5*G*tp*tp);}
/* kalecinin yanal eksenindeki lat (m) uzaklıkta, y yüksekliğindeki noktaya T sn sonra erişim payı (m) ve biçimi; r: tepki, vj: hız sapması.
   Biçimler: 'dur' (yana adım ve uzanma), 'ucus' (itiş + dalış), 'ayak' (yakın alçak topa bacakları açma). u: elipsteki uzanma oranı; payA: ayakta payı */
function kaleciPay(gk,lat,y,T,r,vj){
  const B=gk.boy||1,E=MOTOR_AYAR.kaleciErisim,adz=Math.abs(lat),tr=T-r,R=KL_M.elR;
  if(tr<=0){const a=0.45*B,hy=0.9*B,D=hyp(adz/a,(y-hy)/(y>hy?1.1*B:hy));return{pay:(1-D)*a+R,mod:'dur',u:D};}
  const ua=clamp(tr/0.25,0,1),aA=(0.5+0.4*ua)*B*E,sA=Math.min(Math.max(0,adz-0.3),KL_M.adim*Math.max(0,tr-0.06)),hyA=y<0.7?(0.95-0.4*ua)*B:0.95*B;
  const DA=hyp((adz-sA)/aA,(y-hyA)/(y>hyA?1.35*B:Math.max(0.3,hyA))),payA=(1-DA)*aA+R;let en={pay:payA,mod:'dur',u:DA,payA};
  const yh=clamp(y-0.1,0.25,1.2*B),tp=tr-kaleciItis(yh);
  if(tp>0){const aD=(0.65+0.6*clamp(tr/KL_M.uzanma,0,1))*B*E,v=kaleciDalisHizi(gk,yh)*(vj||1),s=Math.min(Math.max(0,adz-0.35*aD),v*tp,kaleciUcusYolu(gk,yh));
    const hy=kaleciKalcaY(0.8*B,kaleciSicrama(gk,yh,tp),tp),DD=hyp((adz-s)/aD,(y-hy)/((y>hy?1.05:0.95)*B*E)),p=(1-DD)*aD+R;
    if(p>en.pay)en={pay:p,mod:'ucus',u:DD,payA};}
  if(y<0.55&&T<0.45){const c=(0.35*B+Math.min(0.65*B,5*tr))*E,p=c-adz+0.15;if(p>en.pay)en={pay:p,mod:'ayak',u:adz/c,payA};}
  return en;}
/* temas olduğunda topu denetleme olasılığı (parmak ucu ve sert şutta top dokunsa da yoluna devam edebilir) */
function kaleciKontrolP(gk,u,v){return clamp(1.0-0.85*clamp(u-0.7,0,0.6)-0.012*Math.max(0,v-22)+0.3*(gk.oz.kalecilik-0.7),0.35,0.99);}
/* planın (topun kaleci düzleminden geçeceği nokta) kalecinin yanal eksenindeki işaretli uzaklığı; yanal eksen topun yönüne dik */
function kaleciYanal(gk,pl){return(pl.px-gk.x)*(-pl.nz)+(pl.pz-gk.z)*pl.nx;}
/* iki doğru parçası arasındaki en kısa uzaklık (3B); KL_SS: [topun parçasındaki oran, kapsüldeki oran] */
const KL_SS=[0,0];
function kaleciSegD(p1x,p1y,p1z,q1x,q1y,q1z,p2x,p2y,p2z,q2x,q2y,q2z){
  const d1x=q1x-p1x,d1y=q1y-p1y,d1z=q1z-p1z,d2x=q2x-p2x,d2y=q2y-p2y,d2z=q2z-p2z,rx=p1x-p2x,ry=p1y-p2y,rz=p1z-p2z;
  const a=d1x*d1x+d1y*d1y+d1z*d1z,e=d2x*d2x+d2y*d2y+d2z*d2z,f=d2x*rx+d2y*ry+d2z*rz;let s=0,t=0;
  if(a<=1e-9){t=e>1e-9?clamp(f/e,0,1):0;}
  else{const c=d1x*rx+d1y*ry+d1z*rz;
    if(e<=1e-9)s=clamp(-c/a,0,1);
    else{const bb=d1x*d2x+d1y*d2y+d1z*d2z,den=a*e-bb*bb;s=den>1e-12?clamp((bb*f-c*e)/den,0,1):0;t=(bb*s+f)/e;
      if(t<0){t=0;s=clamp(-c/a,0,1);}else if(t>1){t=1;s=clamp((bb-c)/a,0,1);}}}
  KL_SS[0]=s;KL_SS[1]=t;const x=rx+d1x*s-d2x*t,y=ry+d1y*s-d2y*t,z=rz+d1z*s-d2z*t;return Math.sqrt(x*x+y*y+z*z);}
/* kalecinin, kale çizgisinden (z, y) noktasında T sn sonra geçecek şutu kurtarma olasılığı P ve erişim payı (m). Şut topun bugünkü yerinden
   gider (B şutu seçerken top ayağındadır); top kalecinin düzleminden (topun yoluna dik) T·f sn sonra geçer. P: erişim × denetim */
function kaleciTahmin(m,gk,z,y,T){
  const b=m.ball,gx=-m.dir[gk.team]*PL,dx=gx-b.x,dz=z-b.z,L=hyp(dx,dz)||1,nx=dx/L,nz=dz/L,y0=Math.max(b.y,0.11),e=gk.eylem;
  const f0=clamp(((gk.x-b.x)*nx+(gk.z-b.z)*nz)/L,0.05,1),r=kaleciTepkiSuresi(m,gk,b.x,b.z)+(e&&e.kilit?0.35:0);let en=null;
  /* adaylar: kalecinin düzlemi, düzlemle kale çizgisinin ortası ve kale çizgisi (düşen topa geri çekilerek; geri çekilme zamanı düşülür) */
  for(let i=0;i<3;i++){const f=i===0?f0:i===1?(f0+1)/2:1;if(i&&f-f0<0.02)break;
    const Ti=T*f-(f-f0)*L/KL_M.geri,px=b.x+dx*f,pz=b.z+dz*f,yi=Math.max(0.05,y0+(y-y0)*f+0.5*G*T*T*f*(1-f));
    const k=kaleciPay(gk,(px-gk.x)*(-nz)+(pz-gk.z)*nx,yi,Ti,r,1);if(!en||k.pay>en.pay)en=k;}
  return{P:sigma(1.702*en.pay/KL_M.sapma)*kaleciKontrolP(gk,en.u,L/Math.max(0.05,T)),pay:en.pay};}
/* havadan gelen top (orta, korner): kalecinin (x, z) noktasına T sn içinde çıkıp y yüksekliğinde alma olasılığı ve zaman payı (sn).
   Sıçrayarak ~2,3·boy+0,35 m'ye uzanır; noktadaki kalabalık (rakip tam, arkadaş yarım) ve kaleden uzaklık olasılığı düşürür */
function kaleciHavaTahmin(m,gk,x,z,y,T){
  const B=gk.boy||1,elY=2.3*B+0.35;if(y>elY||!m.kendiCezaSahasinda(gk,x,z))return{P:0,pay:-1};
  const t=varisZamani(gk,x,z,0.6,0.25)+(y>2.2*B?0.12:0),pay=T-t;let kal=0;
  for(const o of m.players){if(!o.oyunda||o===gk)continue;if(hyp(o.x-x,o.z-z)<2.2)kal+=o.team===gk.team?0.5:1;}
  const uz=Math.abs(x+m.dir[gk.team]*PL);
  return{P:clamp(sigma((pay-0.05)*8)*clamp(1-0.12*kal,0.3,1)*(0.7+0.4*gk.oz.kalecilik)*clamp(1.3-uz/14,0.25,1),0,0.97),pay};}
/* ---- kaleci topu elinde: pas analiziyle (js/mac-karar.js pasAnaliz) yuvarlama, elle atış ya da uzun vuruş. Fayda = başarı olasılığı − 1,2 × kayıp
   olasılığı + kazanılan alan (m başına 0,004) + takımın direktliği (uzun vuruş) ya da sakinliği (kısa): kaleci kısa ve güvenli pası, kısa seçenekler
   kapalıysa uzunu seçer ---- */
function kaleciDagitim(m,gk){
  const d=m.dir[gk.team],tk=m.taktik[gk.team],PA=typeof pasAnaliz==='function'?pasAnaliz:null;let en=null,enP=-1e9;
  for(const q of m.teams[gk.team]){if(q===gk||!q.oyunda)continue;const L=hyp(q.x-gk.x,q.z-gk.z);if(L<8)continue;
    const hx=clamp(q.x+q.vx*0.5,-PL+1,PL-1),hz=clamp(q.z+q.vz*0.5,1,PW-1);
    for(const tur of['yuvarla','elleAtis','degaj']){
      if(tur==='yuvarla'&&L>24||tur==='elleAtis'&&(L<14||L>40)||tur==='degaj'&&(L<30||q.rol==='DEF'))continue;
      /* degaj pas analizindeki havadan pastan çok daha uzun havada kalır (savunma yetişir): başarısı ~%60'ına indirilir */
      const P=(PA?PA(m,gk,hx,hz,tur==='degaj'?'hava':'yer',q).P:clamp(enYakinRakip(m,hx,hz,gk.team).d/8,0.1,0.9))*(tur==='degaj'?0.6:1);
      const f=P-1.2*(1-P)+0.004*(hx-gk.x)*d+(tur==='degaj'?0.35*tk.direkt:0.15*(1-tk.direkt))+m.rast()*0.12;
      if(f>enP){enP=f;en={q,tur,hx,hz};}}}
  return en;
}
Object.assign(Match.prototype,{
  /* ============ temas sırasının ilk adımı: kaleye gelen top (plan, karar) ve kalecinin bedeniyle temas ============ */
  kaleciTemas(){
    const b=this.ball;if(b.sahip)this._dSahipT=this.t;
    for(let t=0;t<2;t++){const gk=this.kaleci(t);if(!gk.oyunda||gk.rol!=='GK')continue;
      this.kaleciTehdit(gk);if(this.phase!=='play'||b.tasiyan)return;
      this.kaleciCarpisma(gk);if(this.phase!=='play'||b.tasiyan)return;}
  },
  /* kaleye (çerçeve +0,5 m) 1,5 sn içinde girecek top: her dokunuşta (top.surum) yeniden planlanır. Yeni yol eskisine yakınsa tepki sürer */
  kaleciTehdit(gk){
    const b=this.ball,d=this.dir[gk.team],gx=-d*PL;let pl=gk._kp;
    if(gk._pen&&b.sut&&b.sut.team!==gk.team)this.kaleciPenaltiUcus(gk);
    if(!pl||pl.surum!==b.surum){
      const s=b.sahip,surulen=s&&s.team!==gk.team&&hyp(b.x-s.x,b.z-s.z)<1.5;
      const yeni=b.vx*d<-1&&Math.abs(b.x-gx)<45&&!surulen&&!(b.pas&&b.pas.takim===gk.team)&&!(b.tac&&b.tac.p.team===gk.team)
        &&this.kendiCezaSahasinda(gk,gk.x,gk.z)?this.kaleciPlanla(gk):null;
      if(!yeni){gk._kp=null;return;}
      if(pl&&hyp(yeni.pz-pl.pz,yeni.py-pl.py)<0.4&&Math.abs(yeni.an-pl.an)<0.15){yeni.tBas=pl.tBas;yeni.r=pl.r;yeni.vj=pl.vj;yeni.basladi=pl.basladi;}
      else{yeni.tBas=this.t;yeni.r=Math.max(0.06,kaleciTepkiSuresi(this,gk,b.x,b.z)+this.normal()*0.035);yeni.vj=clamp(1+this.normal()*0.07,0.85,1.15);yeni.basladi=false;}
      pl=gk._kp=yeni;}
    /* top kaleciyi geçti */
    if((b.x-gk.x)*pl.nx+(b.z-gk.z)*pl.nz>1.0){gk._kp=null;return;}
    const e=gk.eylem;
    /* plan sürerken genel temas sırası kaleciyi atlar (temas kaleciCarpisma'dadır) */
    if(!e||!e.kilit)gk.kickCd=Math.max(gk.kickCd,0.02);
    if(pl.basladi||this.t<pl.tBas+pl.r||(e&&e.kilit))return;
    this.kaleciKarar(gk,pl);
  },
  /* topun yolu (topYolu) üzerinde kalecinin düzlemini (topun yatay yönüne dik) ve kale çizgisini geçtiği yerler */
  kaleciPlanla(gk){
    const b=this.ball,gx=-this.dir[gk.team]*PL,v=hyp(b.vx,b.vz);if(v<1)return null;
    const nx=b.vx/v,nz=b.vz/v;if((b.x-gk.x)*nx+(b.z-gk.z)*nz>0)return null;
    const yol=this.topYolu(),i0=Math.max(0,Math.round((this.t-this._yolT0)*60)-1),son=Math.min(yol.length,i0+91);
    let ig=-1,ik=-1,kale=null,a=yol[i0];
    for(let i=i0+1;i<son;i++){const c=yol[i];
      if(ig<0&&(a.x-gk.x)*nx+(a.z-gk.z)*nz<=0&&(c.x-gk.x)*nx+(c.z-gk.z)*nz>0)ig=i;
      if((a.x-gx)*(c.x-gx)<=0){const f=(gx-a.x)/((c.x-a.x)||1);kale={z:a.z+(c.z-a.z)*f,y:a.y+(c.y-a.y)*f};ik=i-1;break;}
      a=c;}
    if(ig<0||!kale||Math.abs(kale.z-MZ)>GW2+0.5||kale.y>GH+0.5)return null;
    /* karşılama noktası: düzlemden kale çizgisine kadar yol boyunca en büyük erişim payı (düşen topa geri çekilerek) */
    let en=null,enP=-1e9;
    for(let i=ig;i<=Math.max(ig,ik);i+=(i+3>ik&&i<ik?ik-i:3)){const c=yol[i],dd=Math.max(0,(c.x-gk.x)*nx+(c.z-gk.z)*nz);
      const p=kaleciPay(gk,(c.x-gk.x)*(-nz)+(c.z-gk.z)*nx,c.y,(i-i0)/60-dd/KL_M.geri,0.15,1).pay;if(p>enP+0.02){enP=p;en={c,i};}}
    return{surum:b.surum,px:en.c.x,py:en.c.y,pz:en.c.z,an:this.t+(en.i-i0)/60,nx,nz,ky:kale.y,kz:kale.z};
  },
  /* topun yolunun kalecinin bugünkü düzlemini (topun yönüne dik) geçeceği yer (adım başına bir kez); geçmiyorsa plan noktası */
  kaleciDuzlem(gk,pl){
    const o=gk._duz||(gk._duz={});if(o.kare===this.kare&&o.pl===pl)return o;o.kare=this.kare;o.pl=pl;
    const yol=this.topYolu(),i0=Math.max(0,Math.round((this.t-this._yolT0)*60)-1),son=Math.min(yol.length,i0+91),b=this.ball;
    let ax=b.x,ay=b.y,az=b.z;o.x=pl.px;o.y=pl.py;o.z=pl.pz;
    if((ax-gk.x)*pl.nx+(az-gk.z)*pl.nz>0)return o;
    for(let i=i0+1;i<son;i++){const c=yol[i],sa=(ax-gk.x)*pl.nx+(az-gk.z)*pl.nz,sc=(c.x-gk.x)*pl.nx+(c.z-gk.z)*pl.nz;
      if(sa<=0&&sc>0){const f=-sa/((sc-sa)||1);o.x=ax+(c.x-ax)*f;o.y=ay+(c.y-ay)*f;o.z=az+(c.z-az)*f;break;}ax=c.x;ay=c.y;az=c.z;}
    return o;
  },
  /* tepkiden sonra: ayakta adım/uzanma, ayakla kapama ya da zamanlı dalış (erken uçmaz: gerekene kadar yana kayar, kaleciKonum) */
  kaleciKarar(gk,pl){
    /* karşılama noktası kalecinin gerisindeyse (düşen top) önce geri çekilir (kaleciKonum); karar noktaya varınca ya da süre azalınca */
    const dd=Math.max(0,(pl.px-gk.x)*pl.nx+(pl.pz-gk.z)*pl.nz);if(dd>0.35&&pl.an-this.t-dd/KL_M.geri>0.2)return;
    const T=pl.an-this.t,lat=kaleciYanal(gk,pl),y=pl.py,k=kaleciPay(gk,lat,y,T,0,pl.vj),B=gk.boy||1;
    if(k.mod==='ayak'){this.kaleciKapanBaslat(gk,Math.atan2(-pl.nz,-pl.nx),true);pl.basladi=true;return;}
    /* ayakta rahatça yetişiyorsa uçmaz (adım atıp tutar) */
    if(k.mod==='dur'||k.payA>=Math.min(0.5,k.pay)){gk.eylem={ad:'tutus',t:0,sure:Math.max(0.25,T+0.3),kilit:true,fren:10,kurtar:true,tur:y>1.75?'yukari':y<0.55?'yer':'gogus',hedefY:y,hy:(gk.tavir==='hazir'?0.88:0.95)*B};
      if(gk.tavir==='hazir')gk.tavir=null;pl.basladi=true;return;}
    const yh=clamp(y-0.1,0.25,1.2*B),v=kaleciDalisHizi(gk,yh)*pl.vj,need=kaleciItis(yh)+Math.min(kaleciUcusYolu(gk,yh),Math.max(0,Math.abs(lat)-0.44*B*MOTOR_AYAR.kaleciErisim))/v;
    if(T>need+0.12&&T>0.42)return;
    this.kaleciUc(gk,pl,lat,y,T,kaleciItis(yh),k.u);pl.basladi=true;
  },
  /* dalış: itiş (çömelme), havada (yana sabit hız, balistik kalça), iniş (yerde kayma) ve hızlı kalkış (EYLEM_ADIM.ucus) */
  kaleciUc(gk,pl,lat,y,T,itisT,u){
    const B=gk.boy||1,E=MOTOR_AYAR.kaleciErisim,sg=Math.sign(lat)||1,lx=-pl.nz*sg,lz=pl.nx*sg,yh=clamp(y-0.1,0.25,1.2*B),tp=Math.max(0.1,T-itisT);
    const vy=kaleciSicrama(gk,yh,tp),v=kaleciDalisHizi(gk,yh)*(pl.vj||1),s=Math.min(kaleciUcusYolu(gk,yh),Math.max(0,Math.abs(lat)-0.35*1.25*B*E)),y0=0.8*B;
    const tIn=(vy+Math.sqrt(vy*vy+2*G*(y0-0.22)))/G,egH=clamp(Math.atan2(Math.max(0.15,Math.abs(lat)-s),y-yh),0.35,1.5);
    gk.eylem={ad:'ucus',t:0,faz:'itis',itisT,inisT:itisT+tIn,sure:itisT+tIn+0.3,kilit:true,fren:4,yan:Math.sign(lz)||sg,y:clamp(y,0.15,2.4),hedefY:y,
      el:(u==null||u<0.85)&&y<1.95?'cift':'tek',lx,lz,v,s,gid:0,vy,y0,hy:0.88*B,eg:0,egH};
    if(gk.tavir==='hazir')gk.tavir=null;this.on('dive',{p:gk,yan:gk.eylem.yan});
  },
  /* kapanma: bire birde topa atılıp önünde yere yayılma; ayak: yakın alçak şutta bacakları açma (yon: kalecinin döndüğü yön) */
  kaleciKapanBaslat(gk,yon,ayak){
    const B=gk.boy||1,v=ayak?1.0:4.2;
    gk.eylem={ad:'kapan',t:0,sure:ayak?0.5:0.8,kilit:true,fren:ayak?10:5,yon,ayak:!!ayak,v,hy:0.9*B};gk.vx=Math.cos(yon)*v;gk.vz=Math.sin(yon)*v;
    if(gk.tavir==='hazir')gk.tavir=null;this.on('kapan',{p:gk,ayak:!!ayak});
  },
  /* penaltı: kaleci vuruşla birlikte bir tarafa uçar (ipucu varsa ona doğru, kalecilik ve ipucunun güveniyle), ~0,1 olasılıkla ortada kalır.
     Tahmin ettiği noktaya uçar; tepkiden sonra elleri gerçek topa döner. Kurtarış aynı temas modeliyle çözülür */
  kaleciPenaltiUcus(gk){
    const b=this.ball,sh=b.sut,ip=sh&&sh.ipucu,k=gk.oz.kalecilik,d=this.dir[gk.team],gx=-d*PL;gk._pen=null;let yan;
    if(ip&&ip.yan){yan=this.rast()<0.1?0:this.rast()<0.5+0.35*(k-0.5)*clamp(ip.guven||0,0,1)?Math.sign(ip.yan):-Math.sign(ip.yan);}
    else{const r=this.rast();yan=r<0.44?-1:r<0.88?1:0;}
    gk.penaltiTahmin=yan;if(!yan)return;
    const zg=MZ+yan*(1.4+this.rast()*1.6),r2=this.rast(),yg=r2<0.5?0.35:r2<0.85?1.0:1.75,pl={px:gx,pz:zg,nx:-d,nz:0,vj:clamp(1+this.normal()*0.07,0.85,1.15)};
    this.kaleciUc(gk,pl,kaleciYanal(gk,pl),yg,0.46,kaleciItis(yg-0.1)-0.04,0.6);gk.eylem.tahmin={x:gx,y:yg,z:zg};
  },
  /* ============ kalecinin bedeni ve temas ============ */
  /* bu anki beden: kalça H, omuz S, ayak F, el E; kapanda yayılan bacaklar A–C. Eller topun geçeceği noktaya (tepkiden önce göğsün önüne)
     uzanır, kalçanın çevresindeki erişim elipsinin içinde kalır (u: uzanma oranı) */
  kaleciPoz(gk){
    const e=gk.eylem,ad=e&&e.ad,B=gk.boy||1,E=MOTOR_AYAR.kaleciErisim,pl=gk._kp,d=this.dir[gk.team],o=gk._poz||(gk._poz={});
    let lx,lz;if(pl){lx=-pl.nz;lz=pl.nx;}else if(e&&e.lx!=null){lx=e.lx;lz=e.lz;}else{lx=0;lz=-d;}
    const fx=lz,fz=-lx,on=fx*d>0?1:-1,Fx=fx*on,Fz=fz*on,tr=pl?this.t-pl.tBas-pl.r:-1;
    let hy,a,bU,bD,mod='dur';
    if(ad==='ucus'){mod=e.faz==='inis'?'yer':'ucus';
      if(mod==='yer'){hy=0.2;a=0.95*B*E;bU=0.45;bD=0.2;}else{hy=e.hy;a=(0.65+0.6*clamp(e.t/KL_M.uzanma,0,1))*B*E;bU=1.05*B*E;bD=0.95*B*E;}}
    else if(ad==='kalkis'&&e.kaleci){mod='yer';hy=lerp(0.2,0.9*B,clamp(e.t/e.sure,0,1));a=0.55*B;bU=0.8*B;bD=Math.max(0.2,hy);}
    else if(ad==='kapan'){mod='kapan';hy=e.hy;a=0.75*B;bU=0.6*B;bD=Math.max(0.2,hy);}
    else{hy=(ad==='tutus'&&e.hy)||(gk.tavir==='hazir'?0.88*B:0.95*B);a=(tr>=0?0.5+0.4*clamp(tr/0.25,0,1):0.45)*B*E;bU=1.35*B;bD=hy;}
    let tx,ty,tz;
    if(pl&&tr>=0){const q=this.kaleciDuzlem(gk,pl);tx=q.x;ty=q.y;tz=q.z;}else if(e&&e.tahmin){tx=e.tahmin.x;ty=e.tahmin.y;tz=e.tahmin.z;}else{tx=gk.x+Fx*0.3;ty=hy+0.35;tz=gk.z+Fz*0.3;}
    let rl=(tx-gk.x)*lx+(tz-gk.z)*lz,ru=ty-hy;const D=hyp(rl/a,ru/(ru>0?bU:Math.max(0.2,bD)));o.u=D;if(D>1){rl/=D;ru/=D;}
    o.Hx=gk.x;o.Hy=hy;o.Hz=gk.z;o.Ex=gk.x+lx*rl+Fx*0.2;o.Ey=Math.max(0.05,hy+ru);o.Ez=gk.z+lz*rl+Fz*0.2;o.kapan=false;
    if(mod==='ucus'){const sg=e.lx*lx+e.lz*lz>=0?1:-1,eg=e.eg||0,ux=lx*sg*Math.sin(eg),uy=Math.cos(eg),uz=lz*sg*Math.sin(eg);
      o.Sx=gk.x+ux*0.52*B;o.Sy=hy+uy*0.52*B;o.Sz=gk.z+uz*0.52*B;o.Fx=gk.x-ux*0.9*B;o.Fy=Math.max(0.05,hy-uy*0.9*B);o.Fz=gk.z-uz*0.9*B;}
    else if(mod==='yer'){const sg=e&&e.lx!=null&&(e.lx*lx+e.lz*lz<0)?-1:1,k=ad==='kalkis'?clamp(e.t/e.sure,0,1):0;
      o.Sx=gk.x+lx*sg*0.52*B*(1-k);o.Sy=hy+0.52*B*k;o.Sz=gk.z+lz*sg*0.52*B*(1-k);o.Fx=gk.x-lx*sg*0.9*B*(1-k);o.Fy=0.12;o.Fz=gk.z-lz*sg*0.9*B*(1-k);}
    else if(mod==='kapan'){const c=Math.cos(e.yon),s=Math.sin(e.yon),w=e.ayak?(0.35*B+Math.min(0.65*B,5*e.t))*E:0.85*B*E;
      o.kapan=true;o.Ax=gk.x-s*w+c*0.2;o.Az=gk.z+c*w+s*0.2;o.Cx=gk.x+s*w+c*0.2;o.Cz=gk.z-c*w+s*0.2;o.Ay=e.ayak?0.18:0.22;
      if(e.ayak){o.Sx=gk.x;o.Sy=hy+0.5*B;o.Sz=gk.z;}else{o.Sx=gk.x+c*0.55*B;o.Sy=Math.max(0.25,hy);o.Sz=gk.z+s*0.55*B;}o.Fx=gk.x;o.Fy=0.1;o.Fz=gk.z;}
    else{o.Sx=gk.x+lx*rl*0.15;o.Sy=hy+0.52*B;o.Sz=gk.z+lz*rl*0.15;o.Fx=gk.x;o.Fy=0.05;o.Fz=gk.z;}
    return o;
  },
  /* topun bu adımdaki yolu (önceki → şimdiki yer) ile el, gövde, bacak (ve kapanda yayılan bacaklar) kapsülleri: ilk dokunan parça */
  kaleciCarpisma(gk){
    const b=this.ball,e=gk.eylem,ad=e&&e.ad;
    if(!(gk._kp||ad==='ucus'||ad==='kapan'||(ad==='tutus'&&e.kurtar)||(ad==='kalkis'&&e.kaleci))||gk.kickCd>0.05)return;
    const dx=b.x-gk.x,dz=b.z-gk.z;if(dx*dx+dz*dz>9||b.y>3.3)return;
    const o=this.kaleciPoz(gk),r=TOP_YARICAP,ax=b.px,ay=b.py,az=b.pz;let parca=null,enS=2;
    const dene=(ad2,x1,y1,z1,x2,y2,z2,R)=>{const dd=kaleciSegD(ax,ay,az,b.x,b.y,b.z,x1,y1,z1,x2,y2,z2);if(dd<R+r&&KL_SS[0]<enS-1e-6){enS=KL_SS[0];parca=ad2;}};
    dene('el',o.Sx,o.Sy,o.Sz,o.Ex,o.Ey,o.Ez,0.1);
    dene('govde',o.Hx,o.Hy,o.Hz,o.Sx,o.Sy,o.Sz,0.19);
    dene('bacak',o.Hx,o.Hy,o.Hz,o.Fx,o.Fy,o.Fz,0.16);
    if(o.kapan)dene('kapan',o.Ax,o.Ay,o.Az,o.Cx,o.Ay,o.Cz,0.2);
    if(parca)this.kaleciTemasSonuc(gk,parca,parca==='el'?o.u:0.3,o);
  },
  /* temasın sonucu: denetleyemezse (parmak ucu) top az sapıp yoluna devam eder; tutar (sert ve zayıf kalecide düşürebilir) ya da çeler */
  kaleciTemasSonuc(gk,parca,u,o){
    const b=this.ball,sh=b.sut&&b.sut.team!==gk.team?b.sut:null,v=hyp3(b.vx,b.vy,b.vz),k=gk.oz.kalecilik,e=gk.eylem,ad=e&&e.ad;
    const ucus=ad==='ucus',yerde=ucus&&e.faz==='inis'||ad==='kalkis',elle=this.elleOynar(gk),cift=!(ucus&&e.el==='tek');
    let bicim=ad==='kapan'?(e.ayak?'ayak':'kapan'):yerde?'yerden':ucus?'ucus':parca==='bacak'?'ayak':'adim';if(!sh&&this.kaleciDonen(gk))bicim='ikinci';
    gk._kp=null;
    if(parca==='el'&&this.rast()>=kaleciKontrolP(gk,u,v)){this.kaleciParmak(gk,sh,o);return;}
    let Pc=0;
    if(elle){if(parca==='el')Pc=1.4-v/28-0.7*Math.max(0,u-0.35)+0.8*(k-0.7)+(ucus?0:0.15)-(b.y>2.1?0.2:0)-(cift?0:0.6);
      else if(parca==='govde')Pc=(ucus||yerde?0.9:1.25)-v/32+0.6*(k-0.7);
      else Pc=v<7?0.9:0;
      Pc=clamp(Pc,0,0.96)*MOTOR_AYAR.kaleciTutma;}
    if(Pc>0&&this.rast()<Pc){
      if(this.rast()<clamp(v/30*(1-k)*0.25,0,0.2)){/* düşürdü: top dibine seker */const d=this.dir[gk.team];
        b.vx=d*(0.4+this.rast()*1.6);b.vz=this.normal()*1.0;b.vy=0.5+this.rast()*1.2;b.egri=0;b.ust=0;
        this.dokunus(gk,false);gk.kickCd=0.35;this.kaleciKaydet(gk,sh,false,'dusurdu');return;}
      const tur=b.y>1.75?'yukari':b.y<0.5?'yer':'gogus';this.kaleciTut(gk,tur);
      if(!ucus&&ad!=='kapan')gk.eylem={ad:'tutus',t:0,sure:0.35,tur};
      this.kaleciKaydet(gk,sh,true,bicim);return;}
    this.kaleciCel(gk,sh,parca,u,bicim,o);
  },
  /* parmak ucu: top yavaşlar ve kalecinin merkezinden uzağa biraz sapar. Yine kaleye gidiyorsa dokunuş sayılmaz (şut sürer, gol şutu atanın) */
  kaleciParmak(gk,sh,o){
    const b=this.ball,lx=o?o.Ex-o.Hx:0,lz=o?o.Ez-o.Hz:1,L=hyp(lx,lz)||1,f=0.72+this.rast()*0.2,it=1.5+this.rast()*2.5;
    b.vx=b.vx*f+lx/L*it;b.vz=b.vz*f+lz/L*it;b.vy=b.vy*f+this.rast()*1.2;b.egri=0;b.ust=0;this.topDegisti();gk.kickCd=0.3;
    if(this.kaleciIceriGider(gk)){this.on('parmak',{p:gk,gol:true});return;}
    this.dokunus(gk,false);this.kaleciKaydet(gk,sh,false,'parmak');
  },
  /* çelme: elle kaleden ve merkezden uzağa (korner yönüne ya da ileri yana), yüksek topu üst direğin üstüne; gövdeye çarpan top yansır */
  kaleciCel(gk,sh,parca,u,bicim,o){
    const b=this.ball,k=gk.oz.kalecilik,d=this.dir[gk.team],gx=-d*PL,v=hyp3(b.vx,b.vy,b.vz),yanS=Math.sign(b.z-MZ)||Math.sign(b.vz)||1;
    if(parca==='el'){
      if(b.y>1.85&&Math.abs(b.x-gx)<6&&this.rast()<0.8){/* üst direğin üstüne */const dxl=Math.abs(gx-b.x)+0.3,vx=Math.abs(b.vx)*0.35+0.5,t=dxl/vx;
        b.vx=-d*vx;b.vy=clamp((GH+0.4-b.y+0.5*G*t*t)/t,2,8);b.vz=b.vz*0.4+yanS*(0.3+this.rast());bicim='ust';}
      else{const kose=this.rast()<clamp(0.3+0.4*k+(b.y>1.3?0.15:0)-0.25*Math.max(0,0.6-u),0.15,0.9),vo=v*(0.34+this.rast()*0.2);
        for(let i=0;i<2;i++){const phi=kose&&!i?-(0.05+this.rast()*0.3):0.15+this.rast()*0.4;
          b.vx=d*Math.sin(phi)*vo;b.vz=yanS*Math.cos(phi)*vo;b.vy=clamp(b.vy*0.3+1+this.rast()*2.5,0.5,5);if(!this.kaleciIceriGider(gk))break;}}}
    else{/* gövde/bacak: temas noktasındaki normale göre yansır, hızının çoğunu kaybeder */
      const cx=parca==='govde'?o.Sx:parca==='kapan'?o.Cx:o.Fx,cy=parca==='govde'?o.Sy:parca==='kapan'?o.Ay:o.Fy,cz=parca==='govde'?o.Sz:parca==='kapan'?o.Cz:o.Fz;
      const sx=parca==='kapan'?o.Ax:o.Hx,sy=parca==='kapan'?o.Ay:o.Hy,sz=parca==='kapan'?o.Az:o.Hz;
      kaleciSegD(b.x,b.y,b.z,b.x,b.y,b.z,sx,sy,sz,cx,cy,cz);const t=KL_SS[1],qx=sx+(cx-sx)*t,qy=sy+(cy-sy)*t,qz=sz+(cz-sz)*t;
      let nx=b.x-qx,ny=b.y-qy,nz=b.z-qz;const nL=hyp3(nx,ny,nz);
      if(nL<1e-3){const w=v||1;nx=-b.vx/w;ny=0.2;nz=-b.vz/w;}else{nx/=nL;ny/=nL;nz/=nL;}
      const vn=b.vx*nx+b.vy*ny+b.vz*nz;if(vn<0){b.vx-=1.35*vn*nx;b.vy-=1.35*vn*ny;b.vz-=1.35*vn*nz;}
      const a=this.normal()*0.35,c=Math.cos(a),s=Math.sin(a),vx=b.vx;b.vx=(vx*c-b.vz*s)*0.55;b.vz=(vx*s+b.vz*c)*0.55;b.vy=Math.abs(b.vy)*0.5+this.rast()*1.5;
      if(b.vx*d<0&&this.kaleciIceriGider(gk))b.vx=-b.vx;}
    b.egri=0;b.ust=0;this.dokunus(gk,false);gk.kickCd=0.4;this.kaleciKaydet(gk,sh,false,bicim);
  },
  /* özel kopya üzerinde: top kaleciden sonra kendi kalesine girer mi (1 sn) */
  kaleciIceriGider(gk){
    const b=this.ball,gx=-this.dir[gk.team]*PL,s={x:b.x,y:b.y,z:b.z,vx:b.vx,vy:b.vy,vz:b.vz,egri:0,ust:0};
    for(let i=0;i<60;i++){const px=s.x,py=s.y,pz=s.z;topFizikAdim(s,1/60,false,this.R,this.kosullar);
      if((px-gx)*(s.x-gx)<=0){const f=(gx-px)/((s.x-px)||1),z=pz+(s.z-pz)*f,y=py+(s.y-py)*f;return Math.abs(z-MZ)<GW2+0.05&&y<GH+0.05;}}
    return false;
  },
  /* kurtarış olayı (Faz 0 alanları korunur) ve sayımlar; ikinci: aynı kaleci, arada kimse topa sahip olmadan 4 sn içinde yeniden */
  kaleciKaydet(gk,sh,tut,bicim){
    if(sh&&sh.cerceve)this.ist.isabet[sh.team]++;
    const s=gk._sonKurt,ikinci=s!=null&&this.t-s<4&&(this._dSahipT||-9)<s;gk._sonKurt=this.t;
    this.on('save',{p:gk,catch:tut,tur:'kurtaris',sut:!!sh,cerceve:!!(sh&&sh.cerceve),bicim,ikinci,el:gk.eylem&&gk.eylem.ad==='ucus'?gk.eylem.el:'cift'});
    this.kacanFirsat();   /* T7f: kurtarılan büyük fırsatta şutçu başını tutar (js/mac-takim.js) */
  },
  /* kalecinin kendi çelip düşürdüğü top (3 sn içinde, arada kimse sahip olmadan) ona dönüyor mu: yeniden alması ikinci kurtarıştır */
  kaleciDonen(gk){const s=gk._sonKurt;return s!=null&&this.t-s<3&&(this._dSahipT||-9)<s;},
  /* kaleci topa eliyle erişebilir mi (genel temas türü 'el'; kaleye gelen topta temas kaleciCarpisma'dadır) */
  elErisimi(p,d,y){
    return p.rol==='GK'&&!p._kp&&this.elleOynar(p)&&d<0.95&&y<2.3*(p.boy||1)+0.35;
  },
  elleOynar(p){
    const b=this.ball;if(p.rol!=='GK'||!this.kendiCezaSahasinda(p,b.x,b.z))return false;
    /* geri pas kuralı: takım arkadaşının kasıtlı ayak pasını ve taçı elle alamaz */
    if(b.pas&&b.pas.tur!=='kafa'&&b.pas.takim===p.team&&b.sonDokunan&&b.sonDokunan.team===p.team&&b.sonDokunan!==p)return false;
    if(b.tac&&b.tac.p.team===p.team)return false;
    return true;
  },
  kaleciTut(gk,tur){
    const b=this.ball;b.tasiyan=gk;b.sahip=null;b.vx=b.vy=b.vz=0;b.egri=0;this.dokunus(gk,true);
    gk.tutus={t:0,sure:1.6+this.rast()*1.6,tur:tur||'gogus'};gk.kickCd=0.2;gk._kp=null;this._dSahipT=this.t;
  },
  /* genel temasta elle (orta, korner, boştaki top): kalabalıkta ya da erişiminin sınırında yumrukla uzaklaştırır, yoksa tutar */
  kaleciYakala(gk){
    const b=this.ball,sh=b.sut,v=hyp3(b.vx,b.vy,b.vz),B=gk.boy||1,elY=2.3*B+0.35,k=gk.oz.kalecilik,d=this.dir[gk.team];
    if(sh&&sh.team!==gk.team){this.kaleciTemasSonuc(gk,'el',0.6,null);return;}
    let kal=0;for(const o of this.teams[1-gk.team])if(o.oyunda&&hyp(o.x-b.x,o.z-b.z)<1.5)kal++;
    const yuksek=b.y>1.45,Py=yuksek?clamp(0.06+0.3*kal+(b.y>elY-0.3?0.35:0)-(k-0.7)*0.6,0,0.9):0;
    if(this.rast()<Py){/* yumruk: kaleden uzağa, kanada doğru; top önden geliyorsa iki yumruk */
      const gel=hyp(b.vx,b.vz)||1,el=Math.abs(b.vx)/gel>0.8?'cift':'tek',yanS=b.z<MZ?-1:1,a=Math.atan2(yanS*(0.5+this.rast()*0.6),d),h=12+this.rast()*5;
      b.vx=Math.cos(a)*h;b.vz=Math.sin(a)*h;b.vy=4+this.rast()*2.5;b.sut=null;b.egri=0;b.ust=0;
      this.dokunus(gk,false);gk.kickCd=0.5;gk.eylem={ad:'yumruk',t:0,sure:0.5,el};this.on('yumruk',{p:gk,el});return;}
    if(this.rast()<clamp(0.95-(v-12)*0.02+(k-0.6)*0.3-(yuksek?0.04*kal:0),0.5,0.98)){const tur=yuksek?'yukari':b.y<0.5?'yer':'gogus',ik=this.kaleciDonen(gk);
      this.kaleciTut(gk,tur);gk.eylem={ad:'tutus',t:0,sure:0.35,tur};if(ik)this.kaleciKaydet(gk,null,true,'ikinci');}
    else{/* tutamadı: top elinden kaleden ve merkezden uzağa seker */const yanS=Math.sign(b.z-MZ)||1,h=3+this.rast()*4,a=Math.atan2(yanS*(0.6+this.rast()*0.8),d);
      b.vx=Math.cos(a)*h;b.vz=Math.sin(a)*h;b.vy=1+this.rast()*1.5;b.egri=0;b.ust=0;this.dokunus(gk,false);gk.kickCd=0.45;this.kaleciKaydet(gk,sh,false,'yakala');}
  },
  /* ============ yer tutma ============
     Kaleye gelen topta tepkiden sonra topun geçeceği noktaya yana kayar (tepki süresince yerinde). Serbest topa ve savunmanın arkasına atılan topa
     zaman payı varsa çıkar; ortada kaleciHavaTahmin'e göre alır. Bire birde açıyı daraltır, uygun anda kapanır. Yoksa açıortayda, mesafeye göre
     derinlikte; dar açıda yakın direğe yakın. Menzildeki rakip topla ya da şuta hazırlanıyorsa hazır duruşa geçer */
  kaleciKonum(p,dt){
    const b=this.ball,d=this.dir[p.team],gx=-d*PL,bu=b.x*d,sahipTakim=b.sahip?b.sahip.team:-1;
    this.eforVer(p,1);   /* T1: kaleci yer tutmada hep tam eforla (ivme sınırı azami) */
    p.bak=b;p.hizOran=0.8;
    const pl=p._kp;
    if(pl){if(this.t>=pl.tBas+pl.r){p.tx=pl.px;p.tz=pl.pz;p.hizOran=1;}else{p.tx=p.x;p.tz=p.z;p.hizOran=0.3;}
      this.kaleciTavir(p,false);return;}
    if(sahipTakim<0&&!b.sut&&!b.tasiyan){const c=this.kaleciCikis(p);if(c){p.tx=c.x;p.tz=c.z;p.hizOran=1;this.kaleciTavir(p,false);return;}}
    const s=b.sahip;
    /* bire bir: rakip topla ceza sahasında ve arada savunmacı yoksa açıyı daralt; top ayağından açılınca ya da şuta hazırlanırken kapan */
    if(s&&s.team!==p.team&&this.kendiCezaSahasinda(p,s.x,s.z)){
      let arada=false;for(const q of this.teams[p.team])if(q!==p&&q.oyunda&&segD(q.x,q.z,s.x,s.z,gx,MZ)<1.2&&Math.abs(q.x-gx)<Math.abs(s.x-gx))arada=true;
      if(!arada){const dT=hyp(b.x-p.x,b.z-p.z);
        if(dT<3.6&&!p.eylem){const hx=b.x+b.vx*0.15,hz=b.z+b.vz*0.15,acik=hyp(b.x-s.x,b.z-s.z),vurus=s.eylem&&s.eylem.ad==='vurus';
          if(acik>0.75&&varisZamani(p,hx,hz,0.9,0.08)<varisZamani(s,hx,hz,0.5,0.1)+0.12||vurus&&dT<2.6){this.kaleciKapanBaslat(p,Math.atan2(hz-p.z,hx-p.x),false);return;}}
        const dx=s.x-gx,dz=s.z-MZ,L=hyp(dx,dz)||1,k=clamp(L*0.45,1.2,7);p.tx=gx+dx/L*k;p.tz=MZ+dz/L*k;p.hizOran=1;this.kaleciTavir(p,true);return;}}
    /* açıortay: topun kaleye bakan açısının ortası */
    const a1=Math.atan2(MZ-GW2-b.z,gx-b.x),a2=Math.atan2(MZ+GW2-b.z,gx-b.x),am=a1+aciFark(a2,a1)/2;
    const L=hyp(gx-b.x,MZ-b.z),derin=bu>0?clamp(8+(bu)*0.18,6,17):clamp(0.6+L*0.07,0.8,4.5);
    const ux=-Math.cos(am),uz=-Math.sin(am);let x=gx+ux*derin,z=MZ+uz*derin;
    if(Math.abs(x-gx)<0.4)x=gx+d*0.4;
    /* dar açı: yakın direğe yakın dur (yakın direkten gol yeme) */
    const yanU=Math.abs(b.z-MZ),kaleU=Math.abs(b.x-gx);
    if(bu<=0&&yanU>GW2+1&&kaleU<20)z+=Math.sign(b.z-MZ)*0.55*clamp((yanU-GW2-1)/10,0,1)*clamp((20-kaleU)/14,0,1);
    z=clamp(z,MZ-GW2-0.5,MZ+GW2+0.5);if(bu>0)z=MZ+clamp(b.z-MZ,-8,8)*0.25;
    p.tx=x;p.tz=z;this.kaleciTavir(p,true);
  },
  /* hazır duruş (p.tavir='hazir'): rakip topla 30 m içinde ve kaleci yerindeyse; şuta hazırlanıyorsa olduğu yerde durur */
  kaleciTavir(p,olabilir){
    const b=this.ball,s=b.sahip,gx=-this.dir[p.team]*PL;let hazir=false;
    if(olabilir&&s&&s.team!==p.team&&hyp(s.x-gx,s.z-MZ)<30){
      const vurus=s.eylem&&s.eylem.ad==='vurus'&&s.eylem.sec&&s.eylem.sec.tur==='sut';
      if(vurus){p.tx=p.x;p.tz=p.z;p.hizOran=0.25;hazir=true;}else if(hyp(p.tx-p.x,p.tz-p.z)<0.8){p.hizOran=0.5;hazir=true;}}
    if(hazir){if(!p.tavir)p.tavir='hazir';}else if(p.tavir==='hazir')p.tavir=null;
  },
  /* serbest topa çıkış (6 karede bir ya da top değişince): ceza sahasında rakipten zaman payı varsa ya da arkadaşı daha yakın değilse;
     yüksek topta (orta, korner) kaleciHavaTahmin; ceza sahası dışında süpürücü (savunma çizgisinin arkasındaki top, payı büyükse) */
  kaleciCikis(p){
    const b=this.ball,d=this.dir[p.team],gx=-d*PL,elY=2.3*(p.boy||1)+0.35;let c=p._cikis;
    if(!c||c.surum!==b.surum||this.kare-c.kare>=6){
      const yuksek=b.y>1.5||b.vy>3,k=this.yakalamaNoktasi(p,yuksek?elY:2.4),kutu=this.kendiCezaSahasinda(p,k.x,k.z),uz=Math.abs(k.x-gx);let git=false;
      if(kutu||!yuksek&&uz<26){
        let rakipT=9;for(const o of this.teams[1-p.team])if(o.oyunda&&hyp(o.x-k.x,o.z-k.z)<o.maxSpd*(k.t+0.6)+2){const ko=this.yakalamaNoktasi(o,yuksek?2.2:0.7);rakipT=Math.min(rakipT,ko.t);}
        let arkT=9,sonDef=99;for(const q of this.teams[p.team])if(q!==p&&q.oyunda){arkT=Math.min(arkT,varisZamani(q,k.x,k.z,0.5,0.2));sonDef=Math.min(sonDef,Math.abs(q.x-gx));}
        const pay=rakipT-k.t,A=MOTOR_AYAR.kaleciCikis,alti=Math.abs(k.x-gx)<ALTIPAS_U+1&&Math.abs(k.z-MZ)<ALTIPAS_W+1;
        if(b.hedefOyuncu===p)git=true;
        else if(kutu&&yuksek)git=kaleciHavaTahmin(this,p,k.x,k.z,Math.min(this.topTahmin(k.t).y,elY),k.t).P>0.5&&pay>-0.1;
        else if(kutu)git=pay>A&&(arkT>k.t-0.3||alti)||arkT>=k.t&&pay>-0.2;
        else git=pay>A+0.15&&arkT>k.t+0.1&&uz<sonDef-1;}
      c=p._cikis={surum:b.surum,kare:this.kare,git,x:k.x,z:k.z};}
    return c.git?c:null;
  },
  /* ============ kaleci topu elinde: ileri yürür, sonra yuvarlar, atar ya da degaj yapar ============ */
  kaleciElde(dt){
    const b=this.ball,gk=b.tasiyan;if(!gk||gk.rol!=='GK')return;
    const tu=gk.tutus||(gk.tutus={t:0,sure:2});tu.t+=dt;
    const d=this.dir[gk.team],gx=-d*PL;
    gk.tx=gx+d*Math.min(14,Math.abs(gk.x-gx)+2);gk.tz=MZ+clamp(gk.z-MZ,-9,9);gk.hizOran=0.3;gk.bak=null;gk.yonHedef=d>0?0:Math.PI;
    if(tu.t<tu.sure||gk.eylem)return;
    const k=kaleciDagitim(this,gk);gk.tutus=null;b.tasiyan=null;
    const q=k?k.q:null,tur=k?k.tur:'degaj';
    let hx,hz,hy,T,y0;
    if(tur==='yuvarla'){hx=k.hx;hz=k.hz;const L=hyp(hx-gk.x,hz-gk.z),a=Math.atan2(hz-gk.z,hx-gk.x)+this.normal()*0.03,v=Math.min(22,yerIlkHiz(L,pasVarisHizi(L),this.R));
      b.x=gk.x+Math.cos(gk.yon)*0.35;b.z=gk.z+Math.sin(gk.yon)*0.35;b.y=0.1;b.vx=Math.cos(a)*v;b.vz=Math.sin(a)*v;b.vy=0;b.egri=0;b.ust=0;
      gk.eylem={ad:'elleAtis',t:0,sure:0.6,stil:'yuvarla'};this.dokunus(gk,true);gk.kickCd=0.5;b.hedefOyuncu=q;
      this.pasSay(gk,hx,hz,L,'elleAtis');this.ofsaytPasAni(gk);this.on('pass',{p:gk,q});return;}
    if(tur==='elleAtis'){hx=k.hx;hz=k.hz;hy=0.3;y0=1.9;T=0.4+hyp(hx-gk.x,hz-gk.z)/24;gk.eylem={ad:'elleAtis',t:0,sure:0.6,stil:'omuz'};}
    else{const h=q||{x:d*10,z:MZ};hx=clamp(h.x+d*4,-PL+10,PL-10);hz=h.z;hy=0;y0=0.9;T=1.7+hyp(hx-gk.x,hz-gk.z)/34;gk.eylem={ad:'degaj',t:0,sure:0.7};}
    const L=hyp(hx-gk.x,hz-gk.z),a=Math.atan2(hz-gk.z,hx-gk.x)+this.normal()*(tur==='degaj'?0.06:0.03);
    hx=gk.x+Math.cos(a)*L;hz=gk.z+Math.sin(a)*L;
    b.x=gk.x+Math.cos(gk.yon)*0.3;b.z=gk.z+Math.sin(gk.yon)*0.3;b.y=y0;
    const c=this.havadanCoz(b.x,y0,b.z,hx,hy,hz,T,0);b.vx=c.vx;b.vy=c.vy;b.vz=c.vz;b.egri=0;
    this.dokunus(gk,true);gk.kickCd=0.5;b.hedefOyuncu=q;
    this.pasSay(gk,hx,hz,L,tur);this.ofsaytPasAni(gk);this.on(tur==='degaj'?'gkkick':'pass',{p:gk,q});
  },
  kaleVurusuSecenegi(du,tk){
    const d=this.dir[du.takim];
      const tkt=this.taktik[du.takim];
      if(this.rast()>tkt.direkt*0.8){/* kısa: açıktaki stopere */let q=null,eb=-1;for(const p of this.sahadakiler(du.takim)){if(p.rol!=='DEF')continue;const bos=enYakinRakip(this,p.x,p.z,p.team).d;if(bos>eb){eb=bos;q=p;}}
        if(q&&eb>7)return{tur:'kaleVurusu',hx:q.x,hz:q.z,tip:'yer',alici:q};}
      let q=null,ep=-1e9;for(const p of this.sahadakiler(du.takim)){if(p.rol!=='FV'&&p.rol!=='OS')continue;const s=p.oz.kafa+p.x*d*0.01+this.rast()*0.5;if(s>ep){ep=s;q=p;}}
      const hx=clamp(q.x+d*3,-PL+20,PL-20),L=hyp(hx-du.x,q.z-du.z);
      return{tur:'kaleVurusu',hx,hz:q.z,tip:'hava',T:1.5+L/30,alici:q};
  },
  /* penaltı: kaleci çizgide hazır bekler; tarafı vuruş anında seçer (kaleciPenaltiUcus) */
  penaltiKaleciHazirla(du){
    const kl=this.kaleci(1-du.takim);kl._pen={t:this.t};kl.penaltiTahmin=0;if(!kl.tavir)kl.tavir='hazir';
  }
});
/* dalış adımı: itiş (planlı, yanal hız sıfır), havada (yana e.v ile e.s kadar; kalça balistik), iniş (yerde kayar, 0,3 sn), sonra hızlı kalkış */
EYLEM_ADIM.ucus=function(p,e,dt){
  const tp=e.t-e.itisT,B=p.boy||1;
  if(tp<0){e.faz='itis';p.vx*=0.5;p.vz*=0.5;e.hy=lerp(0.88*B,e.y0,clamp(e.t/e.itisT,0,1));}
  else if(e.faz!=='inis'){e.faz='havada';const kalan=e.s-e.gid;
    if(kalan>1e-3){const h=Math.min(e.v,kalan/dt);p.vx=e.lx*h;p.vz=e.lz*h;e.gid+=h*dt;}else{p.vx=e.lx*0.6;p.vz=e.lz*0.6;}
    e.hy=kaleciKalcaY(e.y0,e.vy,tp);if(e.hy<=0.225&&tp>0.06){e.faz='inis';e.inisT=e.t;e.sure=e.t+0.3;}}
  else e.hy=0.2;
  e.eg=Math.min(e.egH,(e.eg||0)+8*dt);
  if(e.faz==='inis'&&e.t-e.inisT>=0.3)p.eylem={ad:'kalkis',t:0,sure:0.32,kilit:true,fren:12,kaleci:true};
  return true;};
/* ayakta kurtarış: karşılama noktasına yana adım (en çok KL_M.adim) ve geri çekilme (KL_M.geri), alçak topa eğilir; plan bitince biter */
EYLEM_ADIM.tutus=function(p,e,dt){
  if(!e.kurtar)return false;
  const pl=p._kp,B=p.boy||1;
  if(pl){const lat=kaleciYanal(p,pl),dd=(pl.px-p.x)*pl.nx+(pl.pz-p.z)*pl.nz,h=clamp(lat*10,-KL_M.adim,KL_M.adim),g=clamp(dd*10,-KL_M.geri,KL_M.geri);
    p.vx=-pl.nz*h+pl.nx*g;p.vz=pl.nx*h+pl.nz*g;if(pl.py<0.7)e.hy=Math.max(0.55*B,e.hy-1.6*dt);}
  else{p.vx*=0.6;p.vz*=0.6;}
  if(e.t>=e.sure||!pl&&e.t>0.12)p.eylem=null;
  return true;};
/* kapanma: ilk 0,22 sn topa atılır, gövde yere iner; süre bitince hızlı kalkış */
EYLEM_ADIM.kapan=function(p,e){const B=p.boy||1;
  if(e.t<0.22){p.vx=Math.cos(e.yon)*e.v;p.vz=Math.sin(e.yon)*e.v;}
  e.hy=Math.max(e.ayak?0.55*B:0.3,0.9*B-e.t*(e.ayak?2:3.2));
  if(e.t>=e.sure)p.eylem={ad:'kalkis',t:0,sure:e.ayak?0.25:0.35,kilit:true,fren:12,kaleci:true};
  return true;};
