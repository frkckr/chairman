/* ============ Chairman — maç motoru: ikili mücadele, müdahale, faul ve avantaj (mantık, çizimsiz) ============
   Sahibi: C akışı. Topa erişemeyen bedene çarpma ve sekme, blok, top sürücünün korunması, yarı yarıya top,
   müdahale ve kayarak müdahale, faul, kart kararı ve avantaj. Kart gösterme, itiraz ve duran top altyapısı js/mac-kurallar.js'tedir. Hava topu
   (sıçrama, kafa adayları, düello, hava faulü) T6'dan beri js/mac-hava.js'tedir.
   C2 (2026-10-03): müdahale geometriyle çözülür — ayak kapsülü (ayakta ~0,75 m, kaymada süpürme) temas anında topa mı, adama mı, hangisine önce
   değiyor; sonuç temiz kazanma / topu dürtme / blok / geçilme / faul; top ayağın hızı ve topun momentumuyla gider. Temasın şiddeti (bağıl hız,
   arkadan, kayarak, geç, önce topa değdi) faul olasılığını ve kartı belirler (gelişen atağı kesmek sarı, açık gol fırsatını engellemek kırmızı).
   Omuz omuza mücadele (eylem 'omuz', olay 'omuz'), denge (p.denge) ve sendeleme/düşme (eylem 'sendele', 'dusus' + yon/neden/siddet/yuzustu,
   olay 'dusus'); düşüş faulsüz de olabilir. Avantaj: faul yiyen takım topu tutacak ve atağın geleceği varsa oynatılır, kaybedilirse döner.
   sonDokunus: top sürme dokunuşu tur 'surus' (çalım dokunuşunda calim:true, mac-hareket.js), müdahale dokunuşu tur 'cal'. */
'use strict';
ayarEkle('C',{
  mudahaleIstegi:1.25,         // pres yapan oyuncunun müdahaleye girme isteği
  yanIstek:6,                  // sürücünün yanında ya da arka yanında koşan savunmacının topu dürtme sıklığı (1/sn; T5: yandan dürtme, toparlanma; eski faulOrani kalktı — faul temastan)
  faulEsik:0.55,               // müdahale temasında faul eşiği (şiddet; P=σ((c−eşik)/0,12)) (C2)
  kutuIstek:0.65,              // kendi ceza sahasında müdahale isteği çarpanı (C2; birleştirme 2026-10-03: 0,5 → 0,65)
  sabirsiz:0.15,               // top açıkta değilken erken dalma sıklığı (1/sn; kararsız ve sert oyuncuda yüksek) (C2)
  omuzGuc:1.4,                 // omuz mücadelesinde kaybedenin denge kaybı çarpanı (C2)
  kartEsik:1.1,                // bu şiddetten sonra sarı kart (pervasız); kartEsik + 0,5 üstü aşırı sert (C2; T5: 0,75 → 1,1 — müdahale şiddetine +0,35 eklendi, aynı ölçek)
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
/* T5 (2026-10-09): müdahalenin temas geometrisi (saf; mudahaleSonuc ve mudahaleTahmin ortak). Ayak kapsülü gövdeden r0–R (ayakta 0,15–0,75 m,
   kayarak 0,2–1,05 m) fa yönünde: hamle yönü yon, ayakta topa en çok ±0,5 rad döner (bacak hamlenin başında seçilen yöne gider; eskiden ±1: bacak
   topu izliyordu, sürücü arada topu oynattıysa ayak artık adama gelir — zamanlaması kaçan müdahale). topa: top kapsüle ≤ 0,26 m; adama: sürücünün
   gövde merkezi ≤ 0,4 m (topa da değiyorsa) / 0,5 m; adamOnce: kapsül boyunca adam toptan 0,15 önde ya da topa değmiyor; kontrol: top sürücüye
   ≤ 0,45 m; kalkan: sürücünün gövdesi savunmacıyla topun arasında (sx null: sürücü yok) */
function mdhGeo(px,pz,yon,kayma,bx,bz,by,sx,sz){
  let fa=yon;if(!kayma){const f=hrkAciFark(hrkAtan2(bz-pz,bx-px),yon);fa=hrkAciNorm(yon+clamp(f,-0.5,0.5));}
  const c=hrkCos(fa),sn=hrkSin(fa),R=kayma?1.05:0.75,r0=kayma?0.2:0.15,ax=px+c*r0,az=pz+sn*r0,ex=px+c*R,ez=pz+sn*R,adamVar=sx!=null;
  const boyu=(x,z)=>clamp(((x-ax)*c+(z-az)*sn)/(R-r0),0,1);
  const dTop=by<0.5?segD(bx,bz,ax,az,ex,ez):9,topa=dTop<0.26;
  const dAdam=adamVar?segD(sx,sz,ax,az,ex,ez):9,adama=dAdam<(topa?0.4:0.5),adamOnce=adama&&(!topa||boyu(sx,sz)<boyu(bx,bz)-0.15);
  const dS=adamVar?hrkHyp(bx-sx,bz-sz):9,kontrol=dS<0.45,kalkan=adamVar&&segD(sx,sz,px,pz,bx,bz)<0.3&&hrkHyp(sx-px,sz-pz)<hrkHyp(bx-px,bz-pz);
  return{fa,c,sn,ax,az,dTop,topa,adama,adamOnce,kontrol,kalkan};
}
/* T5: müdahalede adama temasın şiddeti (gürültüsüz; motor N(0; 0,06) ekler). 0,35 + bağıl hız/6 + arkadan 0,35 + kayarak 0,25 + geç 0,3 +
   agresiflik; önce topa değdiyse hızın payı ×0,35 ve −0,7 (top oynandıktan sonraki temas çoğu zaman oyunun içi; arkadan ve geç yine faule yakın).
   T3: agresiflik 0,3 → 0,5. T5: +0,35 (faul bütün temaslarda aynı eşikle; müdahalede girişimin ~%8'i faul oluyordu, gerçekte ~%20–25) */
const mdhSiddet=(p,vrel,arkadan,kayma,gec,once)=>0.35+(once?0.35:1)*vrel/6+(arkadan?0.35:0)+(kayma?0.25:0)+(gec?0.3:0)-(once?0.7:0)+(profilAlt(p,'agresiflik',p.oz.sertlik)-0.5)*0.5;
/* T5 (2026-10-09; plan T5 madde 1): müdahalenin saf tahmini — ayakta hamle şimdi başlarsa temas anında ne olur. T5c (aynı gün akşam, masaüstü):
   motorun 0,18 sn'si ileri sarılır (10 hareket adımı, sonra eylemin temas adımı); v1'in sabit hız varsayımı kalktı (c-temas: top 0,2–0,36 m sapıyordu,
   arka yandan faul 48 ↔ 69, önden adama 21 ↔ 32). Savunmacı moveP'nin varış yasasıyla gider (hedef hız √(2·varisFren·d) + 0,2; itiş A0·(1 − v/S0),
   fren B; yanal ve sarsıntı sınırı yok), gövdesi w0·(1 − 0,5k) ile hedefe (topun 0,18 sn sonraki yeri; mudahaleBaslat) döner; sürücü sabit hızla;
   top yer modeliyle yavaşlar (yeni dokunuşta kayma, sonra yuvarlanma 0,6 m/sn²) ve sürücünün sıradaki dokunuşunu alır (surusIlerle'nin
   belirlenimli kısmı: dokunT, dokunusUlas, dokunusSiklik, öndeki baskı, gidişe göre açı sınırı, rakipten uzak ayak, hrkItmeHizi; yön gürültüsü ve
   çalım yok). Temas, motordaki gibi top savunmacının ayak erişimine (0,6 m; temaslar → surucuKoru) girdiği adımda ya da 11. adımın başında
   (eylem.temas); her adımda gövdeler 0,7 m'den yakınsa itilir (hareketHepsi gibi, kütle payıyla). Arkadan, geç ve bağıl hız temas anındaki
   yerlerden. Belirsizlik: topun yeri σ 0,15 m (sürücü kontrolündeyse 0,25), sürücünün yeri σ 0,12 m; 3×3×3×3 noktalı Gauss örneklemesi. Sonuç
   mudahaleSonuc'un geometrisi (mdhGeo), kazanma olasılığı ve şiddetiyle (mdhSiddet; P(faul) = σ((c − faulEsik)/0,125), motorun gürültüsü katılı):
   {Ptop: topa önce değme, Padam: adama önce değme, Pdeg: adama değme, Pfaul: faul (hakemin görmesinden önce), Pkazan; T: temas anı (sn), arkadan,
   vrel, dokunus: sürücünün dokunuşu öngörüldü}. Rastlantı çekmez, alan yazmaz (c-temas sınar; henüz karar katmanında kullanılmıyor) */
const MDH_GN=[-1.2247449,0,1.2247449],MDH_GW=[1/6,2/3,1/6];
function mudahaleTahmin(m,p,s){
  const b=m.ball,A=MOTOR_AYAR,dt=1/60,K=m.kosullar,hx=b.x+b.vx*0.18,hz=b.z+b.vz*0.18;
  const hk=p._hk||hrkSabit(p),vm=hrkTepe(p),A0=hk.A0*(1-0.15*(p.yorgunluk||0)),S0=hk.S0,B=hk.B,w0=hk.w0;
  let px=p.x,pz=p.z,pvx=p.vx,pvz=p.vz,yon=p.yon,bx=b.x,bz=b.z,bvx=b.vx,bvz=b.vz,sx=s.x,sz=s.z,svx=s.vx,svz=s.vz,T=11*dt,dokunus=false,iax=p._iax||0,iaz=p._iaz||0;
  const J=A.sarsintiAzami*dt*dt;
  /* sürücünün dokunuşu: surusIlerle'nin koşulu (ulaşım, dokunuş aralığı, top önde) ve dokunuşun yönü/hızı */
  const surer=b.sahip===s&&!!s.surus&&!s.surus.koru&&!s.surus.bekle&&b.y<0.35,ssp=hrkHyp(s.vx,s.vz);
  let dokunT=surer?(s.dokunT||0):99,yavas=s.sonDokunus&&m.t-s.sonDokunus.t<0.25?yerKayma(K):0.6;
  const ulas=lerp(A.dokunusUlas[0],A.dokunusUlas[1],clamp((ssp-3)/4,0,1));
  /* sürücünün hız niyeti (surusIlerle): sürüş yolunda 2,2 m içindeki rakip (koni 0,57) hızı 0,6'ya indirir, arkadan yaklaşan rakip 0,95'e çıkarır */
  const sOnce=m.players.indexOf(s)<m.players.indexOf(p);   /* motor adımında hücumcu savunmacıdan önce hareket ediyorsa temas karesinde bir adım öndedir */
  for(let k=1;k<=11;k++){
    /* adımın başı (topluAI): sürücünün dokunuşu — temas karesinde de temastan önce gelir */
    dokunT-=dt;
    if(surer&&!dokunus&&dokunT<=0){const dx=bx-sx,dz=bz-sz,d=hrkHyp(dx,dz);
      if(d<ulas&&dx*hrkCos(s.yon)+dz*hrkSin(s.yon)>-0.15){dokunus=true;
        let a=s.surus.yon;const BO=hrkBaskiOn(m,s,a),bOn=BO.on,bAr=BO.arka;
        let yakin=false;{const c=hrkCos(a),sn=hrkSin(a);for(const o of m.teams[1-s.team]){if(!o.oyunda||o.eylem&&o.eylem.kilit)continue;const ox=o.x-sx,oz=o.z-sz,od=hrkHyp(ox,oz);if(od<2.2&&od>0.3&&(ox*c+oz*sn)/od>0.57){yakin=true;break;}}}
        const hiz0=yakin?hrkMin(s.surus.hiz||0.88,0.6):(s.surus.hiz||0.88),hz=bAr>0?lerp(hiz0,hrkMax(hiz0,0.95),bAr):hiz0,vp=hrkTepe(s)*hz*(0.8+0.12*s.oz.surus);
        const Dt0=1/(lerp(A.dokunusSiklik[0],A.dokunusSiklik[1],clamp(vp/7,0,1))*(1+0.3*bOn));
        if(ssp>1.2){const va=hrkAtan2(s.vz,s.vx),tm=clamp(0.7*hrkYanal(s,ssp/hrkTepe(s))*Dt0/ssp,0.2,0.85),f2=hrkAciFark(a,va);if(hrkAbs(f2)>tm)a=hrkAciNorm(va+hrkIsaret(f2)*tm);}
        const od=hrkHyp(px-bx,pz-bz);if(od<2){const yy=hrkCos(a)*(pz-sz)-hrkSin(a)*(px-sx);a-=hrkIsaret(yy)*0.3*(2-od)/2;}
        const ca=hrkCos(a),sa=hrkSin(a),ileri=hrkMax(0,s.vx*ca+s.vz*sa),vort=ileri+0.5*clamp(vp-ileri,-4*Dt0,3*Dt0),simdi=dx*ca+dz*sa;
        let yol=hrkMax(0.15,vort*Dt0+0.9*ulas-simdi);
        const lx=ca>0.05?(PL-0.4-bx)/ca:ca<-0.05?(-PL+0.4-bx)/ca:99,lz=sa>0.05?(PW-0.4-bz)/sa:sa<-0.05?(0.4-bz)/sa:99;yol=hrkMin(yol,hrkMax(0.3,hrkMin(lx,lz)-0.8));
        const v=hrkMin(14,hrkItmeHizi(yol,Dt0,m.R));bvx=ca*v;bvz=sa*v;yavas=yerKayma(K);}}
    /* temas karesi (eylem.temas, 11. adım): savunmacı ve top henüz kıpırdamadı; hücumcu listede öndeyse bir adım atmıştır */
    if(k===11){if(sOnce){sx+=svx*dt;sz+=svz*dt;}break;}
    const bv=hrkHyp(bvx,bvz);if(bv>0){const nv=hrkMax(0,bv-yavas*dt);bvx*=nv/bv;bvz*=nv/bv;}
    bx+=bvx*dt;bz+=bvz*dt;
    sx+=svx*dt;sz+=svz*dt;   /* sürücü sabit hızla (c-temas: 0,18 sn'de sabit hızdan sapması 0,02–0,07 m; yavaşlama modeli denendi, 0,15–0,30 m saptı) */
    /* savunmacı: moveP'nin varış yasası (vA = 0), gövde dönüşü, itiş ve fren sınırı */
    const dx=hx-px,dz=hz-pz,d=hrkHyp(dx,dz),sp=hrkHyp(pvx,pvz);
    if(d>0.04){const f=hrkAciFark(hrkAtan2(dz,dx),yon),oran=w0*(1-0.5*hrkMin(1,sp/p.maxSpd))*dt;yon=hrkAciNorm(yon+clamp(f,-oran,oran));}
    const ux=d>0.04?dx/d:0,uz=d>0.04?dz/d:0,hedef=d<0.04?0:hrkMin(vm,hrkKok(2*A.varisFren*hrkMax(0,d-0.03))+0.2);
    const sh=hrkMin(hedef,vm*hrkYonTavan(ux*hrkCos(yon)+uz*hrkSin(yon)));
    let ax=ux*sh-pvx,az=uz*sh-pvz;const al=hrkHyp(ax,az),lim=(sh>sp?A0*hrkMax(0,1-sp/S0):B)*dt;if(al>lim){ax*=lim/al;az*=lim/al;}
    /* sarsıntı sınırı (moveP): ivme karede en çok J değişir */
    {const jx=ax-iax,jz=az-iaz,jl=hrkHyp(jx,jz);if(jl>J){ax=iax+jx*J/jl;az=iaz+jz*J/jl;}iax=ax;iaz=az;}
    pvx+=ax;pvz+=az;px+=pvx*dt;pz+=pvz*dt;
    /* gövdeler 0,7 m'den yakınsa itilir; kapanma hızının payı söner */
    {const rx=sx-px,rz=sz-pz,rd=hrkHyp(rx,rz);if(rd<0.7&&rd>1e-6){const ip=1/(p._kutle||kutle(p)),is=1/(s._kutle||kutle(s)),w=(0.7-rd)*0.5/(ip+is),nx=rx/rd,nz=rz/rd;
      px-=nx*w*ip;pz-=nz*w*ip;sx+=nx*w*is;sz+=nz*w*is;const vr=(svx-pvx)*nx+(svz-pvz)*nz;if(vr<0){const Jc=-vr*0.8/(ip+is);pvx-=Jc*ip*nx;pvz-=Jc*ip*nz;}}}
    /* adımın sonu (temaslar → surucuKoru): top savunmacının ayak erişiminde */
    if(b.y<0.8&&hrkHyp(bx-px,bz-pz)<0.6){T=k*dt;break;}
  }
  const ds=hrkHyp(sx-px,sz-pz)||1,arkadan=((px-sx)*hrkCos(s.yon)+(pz-sz)*hrkSin(s.yon))/ds<-0.35,E=A.faulEsik;
  const gec=b.sahip!==s&&b.sonDokunan===s&&hrkHyp(bx-sx,bz-sz)>1.3,vrel=hrkHyp(pvx-svx,pvz-svz);
  const pfOnce=sigma((mdhSiddet(p,vrel,arkadan,false,gec,true)-E)/0.125),pfDegil=sigma((mdhSiddet(p,vrel,arkadan,false,gec,false)-E)/0.125);
  const sb=0.15,ss=0.12,beceri=p.oz.mudahale-s.oz.surus*0.7;let Pt=0,Pa=0,Pad=0,Pf=0,Pk=0;   /* top σ 0,15 (dokunuş artık modelde; v1'de kontrolde 0,3) */
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)for(let k=0;k<3;k++)for(let l=0;l<3;l++){const w=MDH_GW[i]*MDH_GW[j]*MDH_GW[k]*MDH_GW[l];
    const G=mdhGeo(px,pz,yon,false,bx+MDH_GN[i]*sb,bz+MDH_GN[j]*sb,b.y,sx+MDH_GN[k]*ss,sz+MDH_GN[l]*ss);
    const ilk=G.topa&&!G.adamOnce&&!G.kalkan,Pb=ilk?clamp(0.6+0.35*beceri+(G.kontrol?-0.25:0.12)-G.dTop*0.5,0.12,0.95):0;
    const pf=G.adama?(ilk?Pb*pfOnce+(1-Pb)*pfDegil:pfDegil):0;
    if(ilk)Pt+=w;if(G.adamOnce)Pa+=w;if(G.adama)Pad+=w;Pf+=w*pf;Pk+=w*Pb*(1-pf);}
  return{Ptop:Pt,Padam:Pa,Pdeg:Pad,Pfaul:Pf,Pkazan:Pk,T,arkadan,vrel,dokunus,yer:{px,pz,sx,sz,bx,bz,bv:hrkHyp(bvx,bvz),surer}};
}
/* T5 (2026-10-09; gerçekçilik planı T5 kararı 5): orta bloğu temastan (saf; motor ortaBlok ve planlayıcı js/mac-karar.js aynı işlevi kullanır).
   Ortanın ilk 3 m'si (en çok 0,5 sn) boyunca top 0,8 m'nin altındayken rakibin (yürüyüşüyle ileri sarılmış) bacak erişimi: duran bacak 0,35 m,
   tepkiye kalan süreyle (0,15 sn'den sonra, 0,2 sn içinde) 0,85 m'ye uzanır. pay = 0: topa en erken değen rakip {o, t, d, R} ya da null;
   pay > 0 (planlayıcı, yön belirsizliği m): her rakibin kesme olasılığı clamp((R + pay − d)/(2·pay)), {acik: Π(1 − P)}. Rastlantı çekmez */
function ortaBlokTahmin(m,takim,ox,oz,oy,vx,vz,vy,pay){
  const v=hrkHyp(vx,vz)||1,T3=hrkMin(3/v,0.5);let en=null,acik=1;
  for(const o of m.teams[1-takim]){if(!o.oyunda||o.rol==='GK'||(o.eylem&&o.eylem.kilit))continue;
    if(hrkHyp(o.x-ox,o.z-oz)>v*T3+1.5)continue;
    let dmin=9,tmin=0;
    for(let t=0.02;t<=T3+1e-9;t+=0.02){if(oy+vy*t-0.5*G*t*t>0.8)break;
      const d=hrkHyp(ox+vx*t-o.x-o.vx*t,oz+vz*t-o.z-o.vz*t);if(d<dmin){dmin=d;tmin=t;}}
    if(dmin>=9)continue;
    const R=0.35+0.5*clamp((tmin-0.15)/0.2,0,1);
    if(pay>0){acik*=1-clamp((R+pay-dmin)/(2*pay),0,1);continue;}
    if(dmin<=R&&(!en||tmin<en.t))en={o,t:tmin,d:dmin,R};}
  return pay>0?{acik}:en;
}
/* T5 (2026-10-09): hakemin temas noktasını görme olasılığı (saf; gerçekçilik planı T5 kararı 2). Orta hakemin uzaklığı: ≤ 10 m 0,95 · 20 m 0,82 ·
   30 m 0,65 · ≥ 40 m 0,5 (Ek G7: ceza sahasında < 10 m'de %83, > 20 m'de %50 doğru karar); iki oyuncunun hizasından bakıyorsa (biri ötekini
   kapatır) ×0,8; hakemle temas arasından 1 m'den yakın geçen her oyuncu ×0,85 (en çok iki). Temas yan hakemin yarısında ve çizgisine 15 m'den
   yakınsa görmeyen orta hakemi tamamlar (kendi uzaklığıyla × 0,6) */
const mdhGormeUzak=d=>d<=10?0.95:d<=20?0.95-0.013*(d-10):d<=30?0.82-0.017*(d-20):d<=40?0.65-0.015*(d-30):0.5;
/* T5: hakem görür mü — tek zar (motorun rast'ı) */
const mdhGormeCek=(m,x,z,yapan,yiyen)=>m.rast()<mdhGorme(m,x,z,yapan,yiyen);
function mdhGorme(m,x,z,yapan,yiyen){
  const R=m.refs;if(!R||!R.length)return 1;const h=R[0],dx=x-h.x,dz=z-h.z,d=hrkHyp(dx,dz)||0.1;let P=mdhGormeUzak(d);
  if(yapan&&yiyen){const wx=yiyen.x-yapan.x,wz=yiyen.z-yapan.z,w=hrkHyp(wx,wz)||1;if(hrkAbs((dx*wx+dz*wz)/(d*w))>0.85)P*=0.8;}
  let perde=0;for(const q of m.players){if(perde>=2||!q.oyunda||q===yapan||q===yiyen)continue;
    const qx=q.x-h.x,qz=q.z-h.z,u=(qx*dx+qz*dz)/(d*d);if(u<0.1||u>0.9)continue;if(hrkHyp(qx-dx*u,qz-dz*u)<1){P*=0.85;perde++;}}
  const y=x>0?R[1]:R[2];if(y&&hrkAbs(z-y.z)<15){const Py=0.6*mdhGormeUzak(hrkHyp(x-y.x,z-y.z));P=1-(1-P)*(1-Py);}
  return P;
}
Object.assign(Match.prototype,{
  /* top sürücünün kontrolündeyse (ayağında, ilk dokunuşta ya da dokunuşla hemen önünde) rakip onu ancak müdahaleyle alır
     (mudahaleSonuc). Yalnız uzun kaçan dokunuşta, topa sürücüden belirgin yakın olan rakip araya girebilir */
  surucuKoru(ad){
    const b=this.ball,sahip=b.sahip;
    /* müdahale hamlesindeki savunmacının ayağı topa erişti: müdahale temas anındaki geometriyle şimdi çözülür (C2) */
    for(const a of ad){const e=a.p.eylem;if(e&&e.ad==='mudahale'&&!e.oldu&&b.sonDokunan&&b.sonDokunan.team!==a.p.team){e.oldu=true;this.mudahaleSonuc(a.p,e);return true;}}
    if(sahip&&sahip.oyunda&&b.y<0.5&&!b.sut){const dS=hrkHyp(b.x-sahip.x,b.z-sahip.z);
      /* T4: sürücünün kendi dokunuşundan (0,3 sn içinde) hızlı giden top da onun sürüşüdür (uzun kaçış dokunuşu kendi ayağına "gelen top" sayılmasın) */
      const kendi=b.sonDokunan===sahip&&sahip.sonDokunus&&sahip.sonDokunus.tur==='surus'&&this.t-sahip.sonDokunus.t<0.3;
      if(dS<1.3&&(hrkHyp(b.vx,b.vz)<7||kendi)){
        if(dS<0.62&&ad.some(a=>a.p===sahip))return true;
        for(let i=ad.length-1;i>=0;i--){const a=ad[i];if(a.p!==sahip&&(a.p.team===sahip.team||a.d>dS-0.5)){
          /* T5 (2026-10-09): korunan sürüşte bile top rakibin bacaklarının arasından geçmez — gövdesine 0,3 m'den yakın, ona doğru gelen (>1,5 m/sn)
             alçak top bacağından seker (eskiden rakip erişim listesinden çıkarılıp gövde çarpmasından da muaf kalıyordu: maçta ~0,9/maç) */
          if(a.p.team!==sahip.team&&a.d<0.3&&b.y<0.5&&hrkHyp(b.vx,b.vz)>1.5){const dx=b.x-a.p.x,dz=b.z-a.p.z;
            if((b.vx-(a.p.vx||0))*dx+(b.vz-(a.p.vz||0))*dz<0){this.sekme(a.p);return true;}}
          ad.splice(i,1);}}
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
  /* en yakın oyuncu dokunur; iki takımdan biri de erişiyorsa ikili mücadele */
  kazananSec(ad){
    ad.sort((x,y)=>x.d-y.d);let kazanan=ad[0];
    const rakip=ad.find(a=>a.p.team!==kazanan.p.team);
    if(rakip&&rakip.d-kazanan.d<0.25){kazanan=this.ikiliMucadele(kazanan,rakip);if(!kazanan)return null;}
    return kazanan;
  },
  /* T5 (2026-10-09; gerçekçilik planı T5 kararı 3): yarı yarıya top iki ayağın varış zamanından. Oyuncunun topa erişim çemberine (0,6 m) ne kadar
     önce girdiği yaklaşma hızıyla geriye çıkarılır ((0,6 − d)/yaklaşma); beceri (müdahale, sürüş) ve gövde küçük pay ekler (en çok ±0,03 ve ±0,015
     sn); ayak yerleşimine N(0; 0,05 sn) gürültü (tek zar; olasılık zaman farkıyla düzgün değişir). |fark| < 0,04 sn: top iki ayağın arasından
     oyuncuların ortasına dik yöne seker (sıkışma); değilse önce varan alır. Geç kalan 0,15 sn'den kısa farkla ve 3 m/sn'den hızlı geldiyse
     rakibin ayağına basar (temas faulü; şiddet yaklaşma hızından) */
  ikiliMucadele(a,c){
    const b=this.ball,varis=x=>{const p=x.p,d=x.d>0.01?x.d:0.01,yak=hrkMax(0.5,((p.vx-b.vx)*(b.x-p.x)+(p.vz-b.vz)*(b.z-p.z))/d);
      return(0.6-x.d)/yak+0.03*clamp((p.oz.mudahale+p.oz.surus-1),-1,1)+0.015*clamp((kutle(p)-75)/20,-1,1);};
    const fark=varis(a)-varis(c)+0.05*this.normal();
    if(hrkAbs(fark)<0.04){const ux=c.p.x-a.p.x,uz=c.p.z-a.p.z,n=hrkHyp(ux,uz)||1,px=-uz/n,pz=ux/n,yan=((b.x-(a.p.x+c.p.x)*0.5)*px+(b.z-(a.p.z+c.p.z)*0.5)*pz)>=0?1:-1;
      const v=1.5+hrkMin(1.5,(hrkHyp(a.p.vx,a.p.vz)+hrkHyp(c.p.vx,c.p.vz))*0.2),y=a.d<=c.d?a.p:c.p;
      b.vx=px*yan*v+(a.p.vx+c.p.vx)*0.2;b.vz=pz*yan*v+(a.p.vz+c.p.vz)*0.2;b.vy=0.5;b.egri=0;b.ust=0;if(b.sahip===a.p||b.sahip===c.p)b.sahip=null;
      a.p.kickCd=c.p.kickCd=0.3;this.dokunus(y,false);this.on('sekme',{p:y,sikisma:true});return null;}
    const k=fark>0?a:c,kay=k===a?c:a;
    kay.p.kickCd=0.55;if(b.sahip===kay.p)b.sahip=null;
    if(this.phase==='play'&&kay.p.team!==k.p.team&&hrkAbs(fark)<0.15){const vk=hrkHyp(kay.p.vx-k.p.vx,kay.p.vz-k.p.vz);
      if(vk>3&&this.temasFaulu(kay.p,k.p,0.2+(vk-3)/4+(profilAlt(kay.p,'agresiflik',kay.p.oz.sertlik)-0.5)*0.5,{basma:true,kaynak:'basma',x:k.p.x,z:k.p.z}))return null;}
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
  /* orta: topun ilk metrelerindeki rakibin bacağı ortayı kesebilir; top çoğu zaman kale çizgisine doğru seker (korner).
     T5 (2026-10-09; gerçekçilik planı T5 kararı 5): zar yerine bacak erişimi (ortaBlokTahmin; planlayıcının aynası aynı işlevi kullanır). Kesme
     topun bacağa vardığı anda olur (b.ortaBlok → temaslar); arada top değişirse ya da kesecek oyuncu kilitli bir eyleme girerse kalkar */
  ortaBlok(p){
    const b=this.ball,B=ortaBlokTahmin(this,p.team,b.x,b.z,b.y,b.vx,b.vz,b.vy,0);
    b.ortaBlok=B?{o:B.o,t:this.t+B.t,surum:b.surum,takim:p.team}:null;
  },
  ortaBlokUygula(OB){
    const b=this.ball,o=OB.o,v=hrkHyp(b.vx,b.vz)||1,ux=b.vx/v,uz=b.vz/v,d=this.dir[OB.takim];
    if(this.rast()<0.6){b.vx=d*(4+this.rast()*6);b.vz=(this.rast()-0.5)*7;}
    else{b.vx=-ux*v*(0.15+this.rast()*0.2)+this.normal()*2;b.vz=-uz*v*(0.15+this.rast()*0.2)+this.normal()*2;}
    b.vy=1.5+this.rast()*4;b.egri=0;b.pasHedef=null;
    this.dokunus(o,false);o.kickCd=0.35;o.eylem={ad:'blok',t:0,sure:0.45};this.on('block',{p:o,v,orta:true});
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
    p.vx+=ux*siddet;p.vz+=uz*siddet;p.surus=null;p.tavir=null;if(p.zipla&&p.zipla.t<0)p.zipla=null;p.denge=0;if(p.calim)this.calimBitir(p,'kayip');
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
    /* T5 (2026-10-09): arkadaki itişin şiddetinden (eski zar kalktı): 0,1 + üstünlük (fark/0,3 × 0,4) + kazandıysa 0,1 + agresiflik */
    if(arkadaki){const cc=0.1+0.4*fark/0.3+(arkadaki===kaz?0.1:0)+(profilAlt(arkadaki,'agresiflik',arkadaki.oz.sertlik)-0.5)*0.5;
      if(this.temasFaulu(arkadaki,on,cc,{itme:true,omuz:true,arkadan:true,kaynak:'omuz',x:on.x,z:on.z}))return;}
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
    if(p.eylem||p.kickCd>0||!s||!s.oyunda||p.yutma&&this.t-p.yutma.t<p.yutma.sure)return;   /* T4: aldatılan savunmacı yanılgısı sürerken giremez */
    const b=this.ball;if(b.y>0.5)return;
    const db=hrkHyp(b.x-p.x,b.z-p.z);if(db>3.4)return;
    const tk=this.taktik[p.team],kutu=this.kendiCezaSahasinda(p,b.x,b.z);
    /* T3: isteğe pozisyon alma (müdahale + karar) ve sıkı markaj eğilimi; agresiflik sırttan ve erken girişleri, kayma eğilimi kaymayı belirler
       (eskiden sertlik ve karar doğrudan; ortalama değerde aynı, oyuncular arası fark daha dik) */
    const agr=profilAlt(p,'agresiflik',p.oz.sertlik);
    /* T5: sarı kartlı oyuncu temkinli (müdahale isteği ×0,6, kayarak giriş ayrıca ×0,4) */
    /* T5g: özelliğin payı dikleştirildi (0,55 + 0,8·m → 0,3 + 1,3·m; ortalamada aynı): T3 duyarlılık kabulü müdahale → girişim 80 maçta 1,19× (≥ 1,25) kalmıştı —
       yandan dürtme ve toparlanma girişimleri de bu istekle ölçeklenir */
    const kartli=(p.kart||0)>=1,istek=MOTOR_AYAR.mudahaleIstegi*(0.3+p.oz.mudahale*1.3)*(0.3+1.4*profilAlt(p,'pozisyonAlma',0.5))*(1+0.25*profilEgilim(p,'sikiMarkaj'))*(0.75+tk.pres*0.5)*(kutu?MOTOR_AYAR.kutuIstek:1)*(kartli?0.6:1);
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
      if(yon>0.75&&tK<tS-0.05&&this.rast()<dt*MOTOR_AYAR.kaymaIstek*istek*(0.35+p.oz.sertlik)*(1+0.5*profilEgilim(p,'kayarakGirer'))*(kartli?0.4:1))this.kaymaBaslat(p,s,kx,kz);return;}
    /* T4: sırtı dönük sürücüye rastgele dalış kalktı (gerçekçilik planı T4: girmez, dönüşü kapatır). Dönüş dokunuşu (sonDokunus.donus, bu karede)
       savunmacının ayağının yetiştiği yere gidiyorsa belirlenimli müdahale (tür 'donus'; sonuç mudahaleSonuc) */
    const sd=s.sonDokunus;
    if(sd&&sd.tur==='surus'&&sd.donus&&sd.t===this.t&&db<1.6&&s.tavir!=='koru'){const T2=0.2,qx=b.x+b.vx*T2,qz=b.z+b.vz*T2;   /* T4e: koruyan gövdenin arkasından girmez */
      if(hrkHyp(qx-p.x-p.vx*T2*0.6,qz-p.z-p.vz*T2*0.6)<0.95&&hrkHyp(qx-s.x-s.vx*T2,qz-s.z-s.vz*T2)>0.6){this.mudahaleBaslat(p,s,qx,qz,'donus');return;}}
    /* T5 (2026-10-09; plan T5 madde 1): yandan dürtme ve toparlanma müdahalesi. Sürücünün yanında ya da arka yanında koşan savunmacı (sürücünün
       gidişine göre yanal 0,35–1,3 m, boyuna −1,2…+0,5 m; onun hızının en az yarısıyla aynı yöne) topa ayağı 0,18 sn sonra yetişiyorsa (≤ 1 m) ve
       sürücünün gövdesi arada değilse topu dürter. Arka yandan (boyuna < −0,45 m) toparlanma müdahalesidir: uzanan bacak çoğu zaman önce sürücünün
       bacağına değer (mudahaleSonuc; arkadan şiddet) — agresif oyuncu dener (×0,2–1). Eskiden yanına gelen savunmacının müdahale yolu yoktu:
       sürücüyle koşuyor ya da ona çarpıyordu (teşhis: topu sürene ≥ 2,2 m/sn çarpma maçta ~3, temas faullerinin en büyüğü) */
    const sv=s.spd;
    if(sv>1.5&&db<1.6&&eD<1){const ux=s.vx/sv,uz=s.vz/sv,rx=p.x-s.x,rz=p.z-s.z,boy=rx*ux+rz*uz,yan=hrkAbs(rx*uz-rz*ux);
      if(yan>0.35&&yan<1.3&&boy>-1.2&&boy<0.5&&p.vx*ux+p.vz*uz>0.5*sv&&segD(s.x,s.z,p.x,p.z,bx,bz)>=0.3){const tur=boy<-0.45?'toparlanma':'yan';
        if(this.rast()<dt*MOTOR_AYAR.yanIstek*istek*(tur==='toparlanma'?0.2+0.8*agr:1)*this.mudahaleTahminCarpani(p,s)){this.mudahaleBaslat(p,s,bx,bz,tur);return;}}}   /* T7d: girme/bekleme */
    /* T4: arkasında yardım varsa erken girer, yoksa geciktirir (yardım 0 → ×0,4, 1 → ×1,4) */
    /* T4e: sürücü topu saklıyorsa (tavır koru) ve gövdesi topla savunmacının arasındaysa (kalkan; mudahaleSonuc'ta temas çoğu zaman arkadan
       faul) erken giriş ×0,1 — "sırtı dönük rakibe girmez", dönüşü bekler. Yalnız saklama tavrında: çalımla geçilen savunmacının arkadan
       toparlanma girişimi değişmez (c-1v1 beceri eğimi 15,8 → 14,0'a düşmüştü) */
    const kalkanli=s.tavir==='koru'&&segD(s.x,s.z,p.x,p.z,b.x,b.z)<0.35&&hrkHyp(s.x-p.x,s.z-p.z)<hrkHyp(b.x-p.x,b.z-p.z);
    if(db<1.4&&this.rast()<dt*MOTOR_AYAR.sabirsiz*istek*(0.1+1.25*agr)*(0.4+(p._destekK!=null&&this.kare-p._destekK<6?p._destek:0))*(kalkanli?0.1:1)*this.mudahaleTahminCarpani(p,s))this.mudahaleBaslat(p,s,bx,bz,'erken');   /* T7d: girme/bekleme (mudahaleTahmin) */
  },
  /* T4: geçilme işareti — bir (savunmacı, sürücü) çifti için tek taktik faul zarı (eskiden çalımın geçti anı ve presYap'ın "arkada kaldı" denetimi
     aynı geçilmeye iki zar atabiliyordu); ayrıca geçilen savunmacının zamanı (toparlanma, 1. adam seçimi) */
  gecildiIsaretle(o,p){o._gecT=this.t;if(o._gecS===p)return;o._gecS=p;this._gecFaul=[o,p];},
  /* çalımla geçilen savunmacı bazen formadan çeker ya da çelme takar (taktik faul; gelişen atakta çoğu zaman sarı) */
  gecildiFaulu(o,p){
    if(!o.oyunda||o.rol==='GK'||o.eylem&&o.eylem.kilit||this.phase!=='play'||hrkHyp(o.x-p.x,o.z-p.z)>1.5)return;
    const kutu=this.kendiCezaSahasinda(o,p.x,p.z),ileri=p.x*this.dir[p.team]>0;
    if(this.rast()<MOTOR_AYAR.taktikFaul*(0.1+1.7*profilAlt(o,'agresiflik',o.oz.sertlik))*(kutu?0.15:1)*(ileri?1.3:0.7)*(this._niyet?this._niyet[o.team].faulIstek:1))   /* T3: agresiflik; T7a: önde biterken taktik faul isteği */
      {/* T5: kasıt zarı kalır, hakem görür mü; arkadan (sürücünün gidişine göre) forma çekme 'itme', yandan çelme 'müdahale' sayılır */
        const sp=hrkHyp(p.vx,p.vz)||1,arka=((o.x-p.x)*p.vx+(o.z-p.z)*p.vz)/(sp*(hrkHyp(o.x-p.x,o.z-p.z)||1))<-0.5;
        this.faulGor(o,p,{itme:arka,arkadan:arka,taktik:true,kaynak:'taktik',ciddiyet:0.25+0.25*this.rast(),x:p.x,z:p.z});}
  },
  mudahaleBaslat(p,s,x,z,tur){
    p.eylem={ad:'mudahale',t:0,sure:0.5,temas:0.18,oldu:false,tur,bacak:null,gorulmedi:false};p.yonHedef=hrkAtan2(z-p.z,x-p.x);p.tx=x;p.tz=z;p.hizOran=1;p.tavir=null;this.eforVer(p,1);
    this.on('mudahale',{p,rakip:s,kayma:false,tur});
  },
  kaymaBaslat(p,s,x,z){
    const a=hrkAtan2(z-p.z,x-p.x),v=hrkMax(p.spd,5.5)+1.2;
    p.eylem={ad:'kayma',t:0,sure:0.95,kilit:true,fren:4.5,oldu:false,tur:'kayma',bacak:null,gorulmedi:false};p.vx=hrkCos(a)*v;p.vz=hrkSin(a)*v;p.yon=a;p.tavir=null;
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
    /* T5 (2026-10-09): geometri mdhGeo'da (mudahaleTahmin ile ortak); muhatap kapsülün ucuna göre */
    const G0=mdhGeo(p.x,p.z,p.yon,kayma,b.x,b.z,b.y,null,null),s=this.mdhRakip(p,p.x+G0.c*(kayma?1.05:0.75),p.z+G0.sn*(kayma?1.05:0.75));
    const G=s?mdhGeo(p.x,p.z,p.yon,kayma,b.x,b.z,b.y,s.x,s.z):G0,fa=G.fa,c=G.c,sn=G.sn,ax=G.ax,az=G.az;
    const dTop=G.dTop,topa=G.topa,adama=G.adama,adamOnce=G.adamOnce,kontrol=G.kontrol,kalkan=G.kalkan,dS=s?hrkHyp(b.x-s.x,b.z-s.z):9;
    /* topa değdiyse: beceri, sürücünün topu ayağında tutması ve isabet (top ayağın ortasında mı) */
    let sonuc='gecildi';
    if(topa&&!adamOnce&&!kalkan){const beceri=p.oz.mudahale-(s?s.oz.surus:0.4)*0.7;
      const P=clamp(0.6+0.35*beceri+(kontrol?-0.25:0.12)+(kayma?0.05:0)-dTop*0.5,0.12,0.95);
      sonuc=this.rast()<P?(!kayma&&!kontrol&&hrkHyp(b.vx-p.vx,b.vz-p.vz)<6&&this.rast()<0.3+0.3*p.oz.mudahale?'temiz':'durttu'):'blok';}
    const kazan=sonuc==='temiz'||sonuc==='durttu';
    /* adama değdi: şiddet c = bağıl hız/6 + arkadan 0,35 + kayarak 0,25 + geç 0,3 − önce topa değdi 0,4; P(faul)=σ((c−eşik)/0,12) */
    let arkadan=false,once=false,cc=null;   /* olaya teşhis alanı (c-temas; T5c) */
    if(s&&adama){
      const ds=hrkHyp(s.x-p.x,s.z-p.z)||1;arkadan=((p.x-s.x)*hrkCos(s.yon)+(p.z-s.z)*hrkSin(s.yon))/ds<-0.35;
      const gec=b.sahip!==s&&b.sonDokunan===s&&dS>1.3,vrel=hrkHyp(p.vx-s.vx,p.vz-s.vz);once=kazan&&!adamOnce;
      /* şiddet mdhSiddet (T5: önce topa değen hamlede hızın payı ×0,35 ve −0,7 — eskiden −0,4: hızlı kayma topu alsa da hep faul sayılıyor, kaymanın
         faulsüz düşürmesi neredeyse hiç olmuyordu; c-kayma) + N(0; 0,06) */
      cc=mdhSiddet(p,vrel,arkadan,kayma,gec,once)+this.normal()*0.06;
      /* T5: faul olunca hakem görür mü (faulGor); görmezse oyun sürer, temasın fiziği (faulle aynı düşüş) ve topun sonucu uygulanır */
      if(this.rast()<sigma((cc-MOTOR_AYAR.faulEsik)/0.12)){
        if(mdhGormeCek(this,s.x,s.z,p,s)){this.on('mudahaleSonuc',{p,rakip:s,kazan:false,topaDegdi:topa,topaOnce:topa&&!adamOnce&&!kalkan,adamaDegdi:true,faul:true,kayma,sonuc:'faul',tur:e.tur||(kayma?'kayma':'acik'),arkadan,kalkan,kontrol,once,siddet:cc,t:e.t});
          this.faul(p,s,{kayma,arkadan,gec,deneme:true,ciddiyet:cc,kaynak:kayma?'kayma':'mudahale',x:s.x,z:s.z});return;}
        this.faulDusur(p,s,{kayma,ciddiyet:cc});this.on('faulGorulmedi',{faulYapan:p,faulYiyen:s,kaynak:kayma?'kayma':'mudahale',siddet:cc,x:s.x,z:s.z});e.gorulmedi=true;}
      else{/* faulsüz temas: sürücünün dengesi bozulur; önce topa değen kayma çoğu zaman düşürür */
        const ix=s.x-p.x+c*0.5,iz=s.z-p.z+sn*0.5,n=hrkHyp(ix,iz)||1;
        this.dengeBoz(s,(0.2+0.55*clamp(cc+0.4,0,1.2))*(kayma?1.6:1),ix/n,iz/n,kayma?'kayma':'takilma',p);}}
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
    /* T5 (2026-10-09; plan T5 madde 6): uzanan bacak 0,25 sn yerinde kalır; sürücü üstünden geçerken takılabilir (mdhBacakTakilma) */
    if(s&&!(s&&adama))e.bacak={s,fa,top:topa&&!adamOnce&&!kalkan,t0:this.t};
    this.on('mudahaleSonuc',{p,rakip:s,kazan,topaDegdi:topa,topaOnce:topa&&!adamOnce&&!kalkan,adamaDegdi:!!(s&&adama),faul:false,gorulmedi:!!e.gorulmedi,kayma,sonuc,tur:e.tur||(kayma?'kayma':'acik'),arkadan,kalkan,kontrol,once,siddet:cc,t:e.t});
  },
  /* T5 (2026-10-09; gerçekçilik planı T5 kararı 1): rakip gövdelerin çarpışması (moveP sonrası; kapanma hızı vk > 1 m/sn) temas faulü adayıdır
     (arkadan itme, bindirme; eski "topu alana arkadan" zarı sirtFaulu kalktı). Saldıran: karşıya doğru hızı (aA, aC) büyük olan. Yalnız topla
     ilgili çarpışma (mağdur topu sürüyor ya da serbest top 1,5 m içinde ve ona saldırandan yakın): teşhiste (8 maç, g-temas) çarpışmaların ~%75'i
     top dışıydı ve oyunun içidir; aynı çift 0,6 sn'de bir aday.
     Şiddet = (saldıranın yaklaşması − 0,4·mağdurunki − 2,8)/2,5 + yön (saldıran mağdurun arkasından 0,3 · yandan 0,05 · önden −0,35) + agresiflik — 3 m/sn'ye kadarki sırt ve omuz
     teması çoğu zaman serbesttir (pres ve saklama sürücüyle sık temas eder; teşhiste topu sürene ≥ 2,2 m/sn çarpma maçta ~3,6); topu süren saldıransa −0,3 (sürücünün
     çarpması çoğu zaman oyunun içi). Müdahale, kayma, düşüşteki oyuncu ve kaleci kendi kodunda. Faul çalındıysa true */
  govdeTemasi(a,c,vk,aA,aC){
    const s=aA>=aC?a:c,m=s===a?c:a,es=s.eylem&&s.eylem.ad,em=m.eylem&&m.eylem.ad;
    /* müdahale ve kaymadaki oyuncu (iki yönde de: kayana koşan sürücü faul yapmış sayılmaz) ve düşüşteki oyuncu kendi kodunda */
    if(s.rol==='GK'||m.rol==='GK'||es==='mudahale'||es==='kayma'||es==='dusus'||es==='yerde'||es==='kalkis'||em==='mudahale'||em==='kayma'||em==='dusus'||em==='yerde'||em==='kalkis')return false;
    const dx=s.x-m.x,dz=s.z-m.z,dd=hrkHyp(dx,dz)||1,arka=(dx*hrkCos(m.yon)+dz*hrkSin(m.yon))/dd,b=this.ball;
    /* şiddet saldıranın kendi yaklaşmasından: mağdurun saldırana doğru hareketi (vuruşa adım, geri yaslanma) suçu artırmaz, %40'ı düşülür (karşılıklı
       gelişte temas çoğu zaman oyunun içi; teşhis: kalan ≥ 3 m/sn çarpışmaların çoğunda mağdur da 1–2,7 m/sn saldırana geliyordu) */
    const aS=s===a?aA:aC,aM=s===a?aC:aA,topa=hrkHyp(b.x-m.x,b.z-m.z),cc=(aS-0.4*hrkMax(0,aM)-2.8)/2.5+(arka<-0.3?0.3:arka<0.3?0.05:-0.35)+(profilAlt(s,'agresiflik',s.oz.sertlik)-0.5)*0.5-(b.sahip===s?0.3:0);
    this.on('govdeTemasi',{s,m,vk,arka,sahipS:b.sahip===s,sahipM:b.sahip===m,topa,cc,aS,aM});   /* teşhis (araclar/olcumler/g-temas.js) */
    /* topla ilgili: mağdur topu sürüyor ya da serbest top 1,5 m içinde ve mağdur ona saldırandan yakın; aynı çift 0,6 sn'de bir aday (üst üste
       binen gövdeler her karede yeniden çarpışır) */
    if(!(b.sahip===m||!b.sahip&&topa<1.5&&topa<hrkHyp(b.x-s.x,b.z-s.z)))return false;
    if(s._tmsS===m&&this.t-s._tmsT<0.6)return false;s._tmsS=m;s._tmsT=this.t;
    return this.temasFaulu(s,m,cc,{itme:true,arkadan:arka<-0.3,kaynak:'carpma',x:m.x,z:m.z});
  },
  /* T5: temastan faul — şiddet c ile P(faul) = σ((c − faulEsik)/0,12) (müdahaleyle aynı biçim); faulse hakem görür mü (faulGor). Faul
     çalındıysa (oyun durdu ya da avantaj) true */
  temasFaulu(yapan,yiyen,c,v){
    if(this.phase!=='play'||!yapan.oyunda||!yiyen.oyunda||this.rast()>=sigma((c-MOTOR_AYAR.faulEsik)/0.12))return false;
    v.ciddiyet=c;return this.faulGor(yapan,yiyen,v);
  },
  /* T5: hakem faulü görür mü (mdhGorme; tek zar). Görmezse oyun sürer: faul yiyen temasın yönüne sendeler ya da düşer (faulle aynı fizik),
     olay 'faulGorulmedi'. Çalındıysa true */
  faulGor(yapan,yiyen,v){
    const P=mdhGorme(this,v.x,v.z,yapan,yiyen);
    if(this.rast()<P){this.faul(yapan,yiyen,v);return true;}
    this.faulDusur(yapan,yiyen,v);
    this.on('faulGorulmedi',{faulYapan:yapan,faulYiyen:yiyen,kaynak:v.kaynak||null,siddet:v.ciddiyet||0,P,x:v.x,z:v.z});
    return false;
  },
  /* ============ faul, kart, avantaj ============ */
  /* faul yiyen temasın yönüne düşer (yapanın konumu ve bağıl hızı); hafif itme ve tutmada yalnız sendeler. Ayakta kaldıysa true (T5: görülmeyen
     faulde de aynı fizik) */
  faulDusur(yapan,yiyen,v){
    const b=this.ball,c=v.ciddiyet||0;let ix=yiyen.x-yapan.x+(yapan.vx-yiyen.vx)*0.15,iz=yiyen.z-yapan.z+(yapan.vz-yiyen.vz)*0.15;const n=hrkHyp(ix,iz)||1;ix/=n;iz/=n;
    const ayakta=c<0.35&&!v.kayma&&!v.hava&&yiyen.denge>0.5&&!(yiyen.eylem&&yiyen.eylem.kilit);
    if(ayakta){yiyen.denge=0.28;this.dengeBoz(yiyen,0.01,ix,iz,'faul',yapan);}
    else if(!(yiyen.eylem&&yiyen.eylem.kilit))this.dus(yiyen,ix,iz,'faul',clamp(c,0.2,1),yapan,0.6+this.rast()*1.6*(0.4+clamp(c,0,1)));
    if(b.sahip===yiyen&&!ayakta)b.sahip=null;
    return ayakta;
  },
  faul(yapan,yiyen,v){
    const b=this.ball,x=clamp(v.x,-PL+0.3,PL-0.3),z=clamp(v.z,0.3,PW-0.3),h=this.half-1,neden=v.kayma?'kayma':v.hava?'hava':v.itme?'itme':'mudahale';
    const c=v.ciddiyet||0,yd=this.dir[yiyen.team],yu=x*yd,kutu=this.cezaSahasi(yapan.team,x,z);
    this.ist.faul[yapan.team]++;
    /* T4: çalım denemesi faulle biter (avantajda nesne kalır: eski akış sürer, ikinci kez bildirilmez) */
    if(yiyen.calim)this.calimBitir(yiyen,'faul',true);if(yapan.calim)this.calimBitir(yapan,'yarim',true);
    const ayakta=this.faulDusur(yapan,yiyen,v);
    yiyen.surus=null;
    /* açık gol fırsatı: faul yiyen top ondayken ya da ona gelirken kaleye 22 m içinde, merkezde, kaleye yöneliyor; yapan dışında kaleyle
       arasında savunmacı yok. Gelişen atak: faul yiyen takım ileri gidiyor ve kaleyle arasında en çok dört savunmacı */
    const onda=b.sahip===yiyen||b.sonDokunan===yiyen&&hrkHyp(b.x-yiyen.x,b.z-yiyen.z)<3||b.hedefOyuncu===yiyen;
    let arada=0;for(const q of this.teams[yapan.team])if(q!==yapan&&q.oyunda&&q.rol!=='GK'&&q.x*yd>yu)arada++;
    const dogso=onda&&!v.hava&&yu>PL-22&&hrkAbs(z-MZ)<12&&arada===0&&(yiyen.vx*yd>2||b.vx*yd>3);
    const spa=!dogso&&b.sonTakim===yiyen.team&&yu>-5&&arada<=4&&(yiyen.vx*yd>1.5||b.vx*yd>2);
    /* T5: kart müdahale şiddetine göre kuruludur; itme, çarpma, hava ve basmada kart için şiddet 0,3 düşük sayılır (itiş nadiren kartlık) */
    const ck=c-(v.kaynak==='carpma'||v.kaynak==='omuz'||v.kaynak==='hava'||v.kaynak==='basma'?0.3:0);
    let kart=null,kartNeden=null;const r=this.rast(),r2=this.rast();
    if(ck>=MOTOR_AYAR.kartEsik+0.5&&(v.kayma||v.arkadan)&&r<0.35){kart='kirmizi';kartNeden='asiri';}                 /* aşırı sert */
    else if(dogso&&r2<MOTOR_AYAR.firsatKirmizi){kart=kutu&&v.deneme?'sari':'kirmizi';kartNeden='firsat';}          /* kutuda topa oynama girişimi: sarı */
    else if(r<sigma((ck-MOTOR_AYAR.kartEsik)/0.07)){kart='sari';kartNeden='siddet';}             /* pervasız */
    else if(spa&&r2<MOTOR_AYAR.sariAtak+(v.taktik?0.3:0)){kart='sari';kartNeden='atak';}                                       /* gelişen atağı kesti */
    const penalti=kutu&&!v.hava||(v.hava&&kutu&&this.rast()<0.5);
    /* avantaj: ciddi değil, takım topu tutacak ve atağın geleceği var */
    if(!penalti&&kart!=='kirmizi'&&c<0.8&&this.avantajVar(yiyen,yu,ayakta)){
      this.avantaj={t:this.t,kare:this.kare,takim:yiyen.team,x,z,kart,yapan,yiyen,neden,tuttu:false,u0:b.x*yd};this.refs[0].eylem={ad:'avantaj',t:0,sure:1.4};
      this.on('avantaj',{takim:yiyen.team,aleyhe:yapan.team,faulYapan:yapan,faulYiyen:yiyen,neden,siddet:c,omuz:!!v.omuz,kartNeden,kaynak:v.kaynak||null});return;}
    this.duranSure[h]+=penalti?60:15+(kart?15:0);
    this.on('faul',{faulYapan:yapan,faulYiyen:yiyen,takim:yiyen.team,aleyhe:yapan.team,x,z,penalti,kart,neden,siddet:c,omuz:!!v.omuz,kartNeden,kaynak:v.kaynak||null});
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
/* T5 (2026-10-09; plan T5 madde 6): müdahalenin uzanan bacağı (ayakta: gövdeden 0,15–0,75 m, 0,25 sn; kayarak yerdeki beden ve bacak, gövdenin
   0,3 m gerisinden 1,05 m önüne, kayma sürerken 0,6 sn; hamlenin yönünde) çözümden sonra yerindedir; sürücünün gövde merkezi 0,5 m (kayarakta
   0,6 m: yerdeki bacak ve beden, koşan ayakların açıklığı) yakınından geçerse takılır. Hamle topa değdiyse (temiz, dürttü, blok) faulsüz takılma (sendeler ya da
   düşer), değilse temas faulü adayı (şiddet: 0,35 + bağıl hız/6 + kayarak 0,25 + agresiflik); faul çalınmazsa da takılır */
function mdhBacakTakilma(m,p,e){
  const B=e.bacak,kay=e.ad==='kayma';if(!B)return;if(m.t-B.t0>(kay?0.6:0.25)||m.phase!=='play'){e.bacak=null;return;}
  const s=B.s;if(!s.oyunda||s.eylem&&s.eylem.kilit){e.bacak=null;return;}
  const c=hrkCos(B.fa),sn=hrkSin(B.fa),r0=kay?-0.3:0.15,R=kay?1.05:0.75;
  if(segD(s.x,s.z,p.x+c*r0,p.z+sn*r0,p.x+c*R,p.z+sn*R)>=(kay?0.6:0.5))return;
  e.bacak=null;const vr=hrkHyp(p.vx-s.vx,p.vz-s.vz),dx=s.x-p.x,dz=s.z-p.z,n=hrkHyp(dx,dz)||1;
  if(!B.top&&m.temasFaulu(p,s,0.35+vr/6+(kay?0.25:0)+(profilAlt(p,'agresiflik',p.oz.sertlik)-0.5)*0.5,{kayma:kay,kaynak:kay?'kayma':'mudahale',x:s.x,z:s.z}))return;
  if(!(s.eylem&&s.eylem.kilit))m.dengeBoz(s,(0.25+0.08*hrkHyp(s.vx,s.vz))*(kay?1.4:1),dx/n,dz/n,kay?'kayma':'takilma',p);
}
EYLEM_ADIM.kayma=function(p,e){
  if(e.bacak)mdhBacakTakilma(this,p,e);
  if(!e.oldu&&e.t>0.62){e.oldu=true;p.kickCd=0.8;this.on('mudahaleSonuc',{p,rakip:null,kazan:false,topaDegdi:false,faul:false,kayma:true,sonuc:'gecildi',tur:'kayma'});}
  if(e.t>=e.sure){p.eylem={ad:'kalkis',t:0,sure:0.7,kilit:true,fren:12,yon:p.yon,yuzustu:false,neden:'kayma'};return true;}return false;};   /* T5: kaymadan kalkış 0,7 sn */
/* T5 (2026-10-09): kalkış süresi düşüşün türünden — yana düşen 1,1 sn, yüzüstü ya da sırtüstü 1,6 sn (Ek G4: sırtüstünden 1,5–3, elle basılı yandan 1–1,5) */
const mdhKalkisSure=(p,e)=>hrkAbs(hrkSin((e.yon!=null?e.yon:p.yon)-p.yon))>0.7?1.1:1.6;
/* düşüş → yerde → kalkış: yön, neden, şiddet ve yüzüstü bilgisi taşınır (çizim yönü bilir) */
EYLEM_ADIM.dusus=function(p,e){if(e.t>=e.sure){p.eylem={ad:'yerde',t:0,sure:e.yerde||1.2,kilit:true,fren:12,yon:e.yon,neden:e.neden,siddet:e.siddet,yuzustu:e.yuzustu};return true;}return false;};
EYLEM_ADIM.yerde=function(p,e){if(e.t>=e.sure){p.eylem={ad:'kalkis',t:0,sure:mdhKalkisSure(p,e),kilit:true,fren:12,yon:e.yon,neden:e.neden,siddet:e.siddet,yuzustu:e.yuzustu};return true;}return false;};
EYLEM_ADIM.mudahale=function(p,e){if(!e.oldu&&e.t>=e.temas){e.oldu=true;this.mudahaleSonuc(p,e);}else if(e.bacak)mdhBacakTakilma(this,p,e);return false;};
