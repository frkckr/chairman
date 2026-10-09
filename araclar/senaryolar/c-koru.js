/* ============ Gerçekçilik planı T4e senaryosu: top saklama (c-koru, 2026-10-09) ============
   Hedef forvet (ev sahibi forvet) rakip kaleye 25 m'de, sırtı kaleye dönük, top ayağında (kendi kalesi tarafında); stoper (konuk) 0,9 m kale
   tarafında, forvete dönük; destek orta saha 14 m geride (kendi kalesi tarafında) 4 m/sn ile geliyor; ikinci savunmacı 12 m kale tarafından
   4 m/sn ile geliyor (tutma onun gelişiyle biter; koruSecenegi t2'yi bilir). Kaleler kalecili, diğer oyuncular sahada değil. Deneme 5 sn; karar
   katmanı açık (motorun kararı ölçülür). KORU_DOK=1 ile her hücrenin ilk denemesinde forvetin seçenek değerleri dökülür (ayar için; ölçümü
   değiştirmez).
   Ölçülen: tutma süresi (başlangıçtan topun forvetten ayrılmasına: bırakma pası, dönüş ya da kayıp), sonuç (indirme: forvetin pası; dönüş: yüzü
   kaleye dönüp topla 1,5 m ilerleme; kayıp: rakip topu alır; faul: rakip faul yapar; tutuyor: 5 sn dolar), bırakma pasının tamamlanması
   (bilgi), kalkanlı forvete arkadan müdahale girişimi (sirt: forvetin tavrı 'koru' iken savunmacı arkasından girer) ve koruma süresi (tavır
   'koru'). Değişkenler: saklayıcı gücü (sürüş ve sertlik 0,3 / 0,85), savunmacının sertliği (0,3 / 0,8).
   Kabul (T4e; gerçekçilik planı §4 T4 madde 5): tutma süresi ortancası ≥ 0,8 sn; indirme + dönüş ≥ %55; kayıp ≤ %35; sirt girişimi denemelerin
   ≤ %5'i (gövde kalkanken savunmacı erken girişi ×0,1, dönüş dalışı yok; arada sırada uzanır); güçlü saklayıcının tutma süresi ortancası zayıfın
   en az 1,3 katı (başarı değil süre: ikisi de sonunda indirir, zayıf hemen bırakır). Kabul dışıysa çıkış kodu 1.
   Sonuç (2026-10-09, ilk geçiş): tutma ortancası 2,9 sn, indirme + dönüş %65, kayıp %4, sirt 2/160, güçlü/zayıf 5,0/0,7 sn; güçlü saklayıcı
   denemelerin yarısında 5 sn'yi doldurur (tek rakip arkada, ikinci 3 sn'de gelir; bilgi).
   Kullanım: node araclar/mac-deneme.js --senaryo c-koru [N=40 hücre başına] [tohum] */
'use strict';
module.exports={calistir({ctx,vm,N,tohum}){
  const n=N||40,dt=1/60,t0=Date.now();let cikis=0;
  const kur=vm.runInContext(`(tohum,olay)=>{const m=new Match(olay,{kadro:MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();return m;}`,ctx);
  const profilKur=vm.runInContext('profilKur',ctx),PL=vm.runInContext('PL',ctx),MZ=vm.runInContext('MZ',ctx),secenekler=vm.runInContext('secenekler',ctx),DOK=!!process.env.KORU_DOK;
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v)=>{Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*v,vz:Math.sin(yon)*v,spd:v,yon,eylem:null,kickCd:0,surus:null,kosu:null,oyunda:true,denge:1,calim:null,yutma:null});};
  let deneme=0,rolM=null;
  /* bir deneme: g saklayıcı gücü (sürüş ve sertlik), sd savunmacının sertliği */
  const dene=(g,sd,i)=>{deneme++;
    let sonuc=null,tut=null,sirt=0,girisim=0,koruT=0,pasT=null,pasOk=null,A,M,D;
    const m=kur((tohum||1)*1000+deneme,(ad,v)=>{
      if(!A)return;
      if(ad==='mudahale'&&v.p===D&&!sonuc){girisim++;const ax=Math.cos(A.yon),az=Math.sin(A.yon),dx=D.x-A.x,dz=D.z-A.z,L=Math.hypot(dx,dz)||1;
        if(A.tavir==='koru'&&(dx*ax+dz*az)/L<-0.3)sirt++;}
      else if(ad==='pass'&&v.p===A&&!sonuc){sonuc='indirme';tut=m.t;pasT=m.t;}
      else if(ad==='faul'&&v.faulYapan===D&&!sonuc){sonuc='faul';tut=m.t;}
      else if(ad==='steal'&&v.p.team===1&&!sonuc){sonuc='kayip';tut=m.t;}});
    A=m.teams[0][9];M=m.teams[0][7];D=m.teams[1][3];const D2=m.teams[1][2],b=m.ball,d=m.dir[0],hy=d>0?0:Math.PI;rolM=M.rol;
    bosalt(m,[A,M,D,D2]);
    A.oz.surus=g;A.oz.sertlik=g;D.oz.sertlik=sd;D.oz.mudahale=0.6;D.oz.karar=0.6;D.oz.gorus=0.6;D2.oz.mudahale=0.6;
    for(const q of [A,M,D,D2]){q._kutle=0;q._cev=null;q._hk=undefined;profilKur(q,m.tohum);}   /* T3: profil özellikten türetilir */
    const ax=d*(PL-25),az=MZ+(i%5-2)*2.5;
    yerlestir(A,ax,az,hy+Math.PI,0);                                 /* sırtı kaleye dönük */
    yerlestir(D,ax+d*0.9,az+(i%2?0.3:-0.3),hy+Math.PI,0);          /* kale tarafında, forvete dönük */
    yerlestir(M,ax-d*14,az+(i%3-1)*2,hy,4);                         /* geriden geliyor */
    yerlestir(D2,ax+d*12,az+(i%2?-4:4),hy+Math.PI,4);               /* ikinci savunmacı kale tarafından geliyor (tutma onun gelişiyle biter) */
    m.phase='play';m.phaseT=1;m.durus=null;
    Object.assign(b,{x:ax-d*0.35,z:az,y:0,vx:0,vz:0,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,sonTakim:0,sonDokunan:A});
    m.topDegisti();m.sahipYap(A);
    const u0=ax*d;let donduT=null;
    for(let k=0;k<60*5;k++){
      m.step(dt);
      /* döküm (KORU_DOK=1; hücrenin ilk denemesi): forvetin seçenek değerleri — tasarım ayarı için, ölçümü değiştirmez (secenekler rastlantı çekmez) */
      if(DOK&&i===0&&(k===15||k===60||k===120||k===180)&&b.sahip===A){const S=secenekler(m,A);
        console.log(`    dök g=${g} sd=${sd} t=${m.t.toFixed(2)} tavır=${A.tavir||'-'} M uzaklık ${Math.hypot(M.x-A.x,M.z-A.z).toFixed(1)} m · `+S.map(s=>s.tur+(s.alici?'→'+s.alici.n:'')+(s.sure?'('+s.sure+')':'')+':'+s.deger.toFixed(1)+(s.P!=null?'/P'+s.P.toFixed(2):'')).join(' '));}
      if(A.tavir==='koru')koruT+=dt;
      if(m.phase!=='play')break;
      if(!sonuc){
        if((b.sahip&&b.sahip.team===1)||(b.sonDokunan&&b.sonDokunan.team===1&&b.sahip!==A&&Math.hypot(b.x-A.x,b.z-A.z)>1.2)){sonuc='kayip';tut=m.t;}
        else if(b.sahip===A||b.sonDokunan===A){
          const yuz=Math.cos(A.yon-hy)>0.5;   /* yüzü kaleye dönük */
          if(yuz){if(donduT==null)donduT=m.t;}else donduT=null;
          if(yuz&&A.x*d-u0>1.5){sonuc='donus';tut=donduT;}}}
      else if(sonuc==='indirme'&&pasOk==null){
        if(b.sahip&&b.sahip.team===0&&b.sahip!==A)pasOk=true;
        else if((b.sahip&&b.sahip.team===1)||m.t-pasT>1.5)pasOk=!!(b.sahip&&b.sahip.team===0);}
      if(sonuc&&(sonuc!=='indirme'||pasOk!=null))break;
    }
    if(!sonuc){sonuc='tutuyor';tut=5;}
    return{sonuc,tut,sirt,girisim,koruT,pasOk};};
  const ortanca=a=>{if(!a.length)return NaN;const b=a.slice().sort((x,y)=>x-y),k=b.length;return k%2?b[(k-1)/2]:(b[k/2-1]+b[k/2])/2;};
  const y=(a,c)=>c?(100*a/c).toFixed(0).padStart(4)+'%':'   —';
  const GUC=[0.3,0.85],SERT=[0.3,0.8],T={};const hep={n:0,indirme:0,donus:0,kayip:0,faul:0,tutuyor:0,sirt:0,girisim:0,koruT:0,tut:[],pasOk:0,pasN:0};
  for(const g of GUC)for(const sd of SERT){const h=T[g+'|'+sd]={n:0,indirme:0,donus:0,kayip:0,faul:0,tutuyor:0,sirt:0,girisim:0,koruT:0,tut:[],pasOk:0,pasN:0};
    for(let i=0;i<n;i++){const r=dene(g,sd,i);for(const k of [h,hep]){k.n++;k[r.sonuc]++;k.sirt+=r.sirt;k.girisim+=r.girisim;k.koruT+=r.koruT;k.tut.push(r.tut);
      if(r.pasOk!=null){k.pasN++;if(r.pasOk)k.pasOk++;}}}}
  console.log(`\nT4e · top saklama · hücre başına ${n} deneme · destek ${rolM||'?'} 14 m geriden · ${((Date.now()-t0)/1000).toFixed(1)} sn`);
  console.log('  Saklayıcı  Savunmacı    n  indirme   dönüş   kayıp    faul tutuyor  tutma ortanca (sn)  koru (sn/deneme)  bırakma tamam  girişim  sirt');
  for(const g of GUC)for(const sd of SERT){const h=T[g+'|'+sd];
    console.log('  '+g.toFixed(2).padEnd(11)+sd.toFixed(2).padEnd(11)+String(h.n).padStart(3)+y(h.indirme,h.n).padStart(9)+y(h.donus,h.n).padStart(8)+y(h.kayip,h.n).padStart(8)+y(h.faul,h.n).padStart(8)+y(h.tutuyor,h.n).padStart(8)+
      ortanca(h.tut).toFixed(2).padStart(13)+(h.koruT/h.n).toFixed(2).padStart(18)+y(h.pasOk,h.pasN).padStart(15)+String(h.girisim).padStart(9)+String(h.sirt).padStart(6));}
  const basari=h=>(h.indirme+h.donus)/h.n;
  const tutOrt=ortanca(hep.tut),bas=basari(hep),kay=hep.kayip/hep.n;
  /* [5] güçlü saklayıcı daha uzun tutar (başarı değil süre: ikisi de sonunda indirir); zayıf hemen bırakır */
  const tutG=ortanca(T['0.85|0.3'].tut.concat(T['0.85|0.8'].tut)),tutZ=ortanca(T['0.3|0.3'].tut.concat(T['0.3|0.8'].tut)),oran=tutG/Math.max(1e-6,tutZ),gucB=(basari(T['0.85|0.3'])+basari(T['0.85|0.8']))/2,zayB=(basari(T['0.3|0.3'])+basari(T['0.3|0.8']))/2;
  /* [1] güçlü saklayıcıda (zayıfın hemen bırakması istenen davranış; karışık ortanca iki kümeyi karıştırır) */
  const ok1=tutG>=0.8,ok2=bas>=0.55,ok3=kay<=0.35,ok4=hep.sirt<=0.05*hep.n,ok5=oran>=1.3;
  console.log((ok1?'  ':'! ')+`[1] Kabul (T4e): güçlü saklayıcıda tutma süresi ortancası ≥ 0,8 sn → ${tutG.toFixed(2)} sn (bütün denemeler ${tutOrt.toFixed(2)}) · koruma ${(hep.koruT/hep.n).toFixed(2)} sn/deneme`);
  console.log((ok2?'  ':'! ')+`[2] Kabul (T4e): indirme + dönüş ≥ %55 → %${(100*bas).toFixed(1)} (indirme %${(100*hep.indirme/hep.n).toFixed(0)}, dönüş %${(100*hep.donus/hep.n).toFixed(0)}; bırakma pası tamamlandı %${hep.pasN?(100*hep.pasOk/hep.pasN).toFixed(0):'—'})`);
  console.log((ok3?'  ':'! ')+`[3] Kabul (T4e): kayıp ≤ %35 → %${(100*kay).toFixed(1)} (faul %${(100*hep.faul/hep.n).toFixed(0)}, tutuyor %${(100*hep.tutuyor/hep.n).toFixed(0)})`);
  console.log((ok4?'  ':'! ')+`[4] Kabul (T4e): kalkanlı forvete arkadan girişim ≤ denemelerin %5'i → ${hep.sirt} / ${hep.n} (bütün girişimler ${hep.girisim})`);
  console.log((ok5?'  ':'! ')+`[5] Kabul (T4e): güçlü saklayıcının tutma süresi ortancası zayıfın ≥ 1,3 katı → ${oran.toFixed(2)} (${tutG.toFixed(2)} / ${tutZ.toFixed(2)} sn; başarı güçlü %${(100*gucB).toFixed(0)}, zayıf %${(100*zayB).toFixed(0)})`);
  if(!(ok1&&ok2&&ok3&&ok4&&ok5))cikis=1;
  return cikis;}};
