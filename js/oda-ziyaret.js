/* ============ Chairman — odaya ziyaretçi: kapı, yürüyüş, oturma, kalkış (yalnız çizim; kural ve kayıt yok; RK6, 2026-10-31) ============
   Kullanıcı (31 Ekim): “gelsin, karşımda otursun ve kart açılsın”. Kimin ve ne zaman geleceğini ekran söyler (js/ekran-oda.js; kural js/ziyaret.js);
   bu dosya yalnız sahneyi oynatır. Giriş kapısı sağ yan duvardadır (js/oda.js ODA.giris; STIL.oda.giris), ziyaretçi koridordan sağdaki koltuğa yürür
   (STIL.oda.ziyaret). Figür maçın ve balkonun figürüdür (js/oyuncular.js player; yürüyüş pozu js/balkon.js blkYuruPoz, oturuş POSE.otur); giysi role
   göre (teknik ekip eşofman, öbürleri takım elbise), ten, saç ve bıyık kişinin portre görünüşünden (js/portre.js portreGorunus; kayda alan yazılmaz).
   ODA.ziyaret: {evre, t, kisiId, kisi, rol, a (aktör), bitince}. Evreler:
     'kapi'      kapı çalındı: bakış kapıya döner; kanat kapalı, kişi görünmez
     'giris'     kanat açılır, kişi kapıdan koltuğun önüne yürür, döner, oturur; geçince kanat kapanır (~5 sn; en çok 8)
     'oturuyor'  karşıda oturur, hafifçe kıpırdar; bakış dinlenme bakışıyla oturanın başı arasında (STIL.oda.ziyaret.oturanPay)
     'cikis'     kalkar, kapıya yürür, kanat açılır, çıkar, kapanır (~4,5 sn; en çok 5)
   Zaman dt ile ilerler: Duraklat'ta (dt 0) olduğu yerde durur; tıklamak (ekran odaZiyaretAtla'yı çağırır) sürmekte olan evreyi sonuna getirir.
     odaZiyaretKapi(kisi, rol)   kapı çalındı (kisi: kariyerdeki kişi; rol: kişinin rolü)
     odaZiyaretGir(bitince)      içeri alır (kapı evresinden); oturunca bitince()
     odaZiyaretOturt(kisi, rol)  doğrudan oturur (yeniden yüklemede)
     odaZiyaretCik(bitince)      kalkar ve çıkar; bitince sahneden kalkar
     odaZiyaretAtla()            sürmekte olan evreyi sonuna getirir
     odaZiyaretKaldir()          hemen kaldırır (kanat kapanır)
     odaZiyaretBakis() → Vector3 | null   js/oda.js odaKare bakış hedefi olarak okur
     odaZiyaretKare(dt)          js/oda.js odaKare her karede çağırır (başkan yürürken çağrılmaz) */
'use strict';
const ODA_ZY_V=new THREE.Vector3(),ODA_ZY_B=new THREE.Vector3();
const ODA_ZY_GOLGE=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.22,depthWrite:false,fog:false});
const ODA_ZY_DURUS={aLz:-0.08,aRz:0.08,eL:-0.15,eR:-0.15};
const odaZyYumusak=x=>{x=Math.min(1,Math.max(0,x));return x*x*(3-2*x);};
/* portre görünüşü → figür görünüşü (ten, saç rengi ve tipi, bıyık); boy ve yapı kimlikten (rastlantı çekilmez) */
function odaZyGorunus(kisi){
  const g=typeof portreGorunus==='function'?portreGorunus(kisi):{ten:1,sac:'siyah',tip:'kisa',biyik:0};
  const R=STIL.portre.saclar,n=adOzet(String(kisi.id||'')),u=i=>h2(n,i);
  return{ten:Math.max(0,Math.min(STIL.tenler.length-1,g.ten|0)),sac:g.tip==='dalgali'?'kivircik':g.tip==='seyrek'&&u(3)<0.5?'kel':'kisa',sacRenk:R[g.sac]||'#241a12',
    biyik:(g.biyik|0)>0,sakal:false,boy:0.97+0.06*u(5),yapi:0.98+0.08*u(7),ad:kisi.ad||'',no:0};
}
function odaZyAktor(kisi,rol){
  const G=odaZyGorunus(kisi),giysi=rol==='teknikDirektor'||rol==='yardimciAntrenor'?'antrenorEv':'takimElbise';
  const m=player(kitKaydi(giysi,G,0));m.root.rotation.order='YXZ';ODA.sahne.add(m.root);
  const g=new THREE.Mesh(new THREE.CircleGeometry(0.32,10),ODA_ZY_GOLGE);g.rotation.x=-Math.PI/2;g.scale.set(1.1,0.8,1);ODA.sahne.add(g);
  const kim=typeof blkKimlik==='function'?blkKimlik('ziyaret:'+kisi.id):{adim:1,kol:1,egim:0,tempo:1,faz:0};kim.adim=Math.min(kim.adim,1);
  return{m,g,x:0,z:0,yaw:0,faz:0,kim,o:G,poz:null,yuk:0};
}
function odaZyYerlestir(a){a.m.root.position.set(a.x,a.yuk,a.z);a.m.root.rotation.y=a.yaw;a.g.position.set(a.x,0.012,a.z);}
function odaZyPoz(a,P,dt,k){if(typeof blkPozUygula==='function')blkPozUygula(a,P,dt,k);else pose(a.m,P);}
function odaZyKarisim(a,A,B,w){return typeof blkKarisim==='function'?blkKarisim(a,A,B,w,1):Object.assign({},w<0.5||!B?A:B);}
/* yol: koridordan koltuğun önüne (ya da tersi); noktalar, birikmiş uzunluk */
function odaZyYol(geri){const Y=STIL.oda.ziyaret.yol.map(p=>({x:p[0],z:p[1]}));if(geri)Y.reverse();const L=[0];
  for(let i=1;i<Y.length;i++)L.push(L[i-1]+Math.hypot(Y[i].x-Y[i-1].x,Y[i].z-Y[i-1].z));return{Y,L,boy:L[L.length-1]};}
function odaZyNokta(Y,d){const P=Y.Y,L=Y.L;d=Math.max(0,Math.min(Y.boy,d));let i=1;while(i<P.length-1&&L[i]<d)i++;const u=(d-L[i-1])/Math.max(1e-6,L[i]-L[i-1]);
  return{x:P[i-1].x+(P[i].x-P[i-1].x)*u,z:P[i-1].z+(P[i].z-P[i-1].z)*u,yon:Math.atan2(P[i].x-P[i-1].x,P[i].z-P[i-1].z)};}
/* yürüyüş: ilk ve son 0,5 sn'de hız doğrusal artar ve azalır, arada sabit (STIL.oda.ziyaret.hiz) */
const ODA_ZY_IVME=0.5;
const odaZyYuruSure=boy=>boy/STIL.oda.ziyaret.hiz+ODA_ZY_IVME;
function odaZyYuruD(Y,t){const T=odaZyYuruSure(Y.boy),e=ODA_ZY_IVME,v=Y.boy/(T-e);
  if(t<=0)return 0;if(t>=T)return Y.boy;if(t<e)return v*t*t/(2*e);if(t>T-e){const r=T-t;return Y.boy-v*r*r/(2*e);}return v*e/2+v*(t-e);}
const odaZyHiz=(Y,t)=>{const T=odaZyYuruSure(Y.boy),e=ODA_ZY_IVME,v=Y.boy/(T-e);return t<=0||t>=T?0:v*Math.min(1,t/e,(T-t)/e);};
function odaZiyaretKapi(kisi,rol){
  if(ODA.ziyaret&&ODA.ziyaret.kisiId===kisi.id&&ODA.ziyaret.evre==='kapi')return;
  odaZiyaretKaldir();ODA.ziyaret={evre:'kapi',t:0,kisiId:kisi.id,kisi,rol,a:null,bitince:null};
}
function odaZiyaretGir(bitince){
  const Z=ODA.ziyaret;if(!Z)return;
  if(Z.evre==='oturuyor'){if(bitince)bitince();return;}
  if(Z.evre==='giris'){if(bitince)Z.bitince=bitince;return;}
  if(!Z.a)Z.a=odaZyAktor(Z.kisi,Z.rol);
  Z.evre='giris';Z.t=0;Z.bitince=bitince||null;Z.yol=odaZyYol(false);Z.kapanBas=null;
  const p=odaZyNokta(Z.yol,0);Z.a.x=p.x;Z.a.z=p.z;Z.a.yaw=p.yon;Z.a.yuk=0;Z.a.poz=null;odaZyPoz(Z.a,ODA_ZY_DURUS,0);odaZyYerlestir(Z.a);
}
function odaZiyaretOturt(kisi,rol){
  if(ODA.ziyaret&&ODA.ziyaret.kisiId===kisi.id&&ODA.ziyaret.evre==='oturuyor')return;
  if(!ODA.ziyaret||ODA.ziyaret.kisiId!==kisi.id){odaZiyaretKaldir();ODA.ziyaret={evre:'kapi',t:0,kisiId:kisi.id,kisi,rol,a:null,bitince:null};}
  const Z=ODA.ziyaret;if(!Z.a)Z.a=odaZyAktor(Z.kisi,Z.rol);odaZyOturdu(Z);
}
function odaZyOturdu(Z){
  const C=STIL.oda.ziyaret.koltuk;Z.evre='oturuyor';Z.t=0;Z.a.x=C[0];Z.a.z=C[1];Z.a.yaw=C[2];Z.a.yuk=0;Z.a.poz=null;odaZyPoz(Z.a,POSE.otur,0);odaZyYerlestir(Z.a);
  if(ODA.giris)ODA.giris.rotation.y=0;
  const f=Z.bitince;Z.bitince=null;if(f)f();
}
function odaZiyaretCik(bitince){
  const Z=ODA.ziyaret;if(!Z){if(bitince)bitince();return;}
  if(Z.evre==='cikis'){if(bitince)Z.bitince=bitince;return;}
  if(!Z.a||Z.evre==='kapi'){odaZiyaretKaldir();if(bitince)bitince();return;}
  if(Z.evre==='giris'){Z.bitince=null;odaZyOturdu(Z);}
  Z.evre='cikis';Z.t=0;Z.bitince=bitince||null;Z.yol=odaZyYol(true);
}
function odaZiyaretAtla(){
  const Z=ODA.ziyaret;if(!Z)return;
  if(Z.evre==='giris')odaZyOturdu(Z);else if(Z.evre==='cikis'){const f=Z.bitince;odaZiyaretKaldir();if(f)f();}
}
function odaZiyaretKaldir(){
  const Z=ODA.ziyaret;ODA.ziyaret=null;if(ODA.giris)ODA.giris.rotation.y=0;
  if(Z&&Z.a){ODA.sahne.remove(Z.a.m.root);ODA.sahne.remove(Z.a.g);}
}
/* bakış: kapı evresinde ve kapı açılırken kapı; yürürken kişinin başı; otururken dinlenme ile oturanın başı arası; çıkarken kişi, koridora girince yok */
function odaZiyaretBakis(){
  const Z=ODA.ziyaret,V=STIL.oda.ziyaret;if(!Z||ODA.yer!=='masa')return null;
  if(Z.evre==='kapi'||!Z.a)return ODA_ZY_B.set(V.bakisKapi[0],V.bakisKapi[1],V.bakisKapi[2]);
  if(Z.evre==='giris'&&Z.t<V.kapiAc)return ODA_ZY_B.set(V.bakisKapi[0],V.bakisKapi[1],V.bakisKapi[2]);
  const bas=ODA_ZY_V.set(Z.a.x,Z.evre==='oturuyor'?1.12:1.3,Z.a.z);   /* ayaktayken göz hizasına yakın (bakış tavana kalkmaz) */
  if(Z.evre==='oturuyor')return ODA_ZY_B.set(OD.bakis[0],OD.bakis[1],OD.bakis[2]).lerp(bas,V.oturanPay);
  if(Z.evre==='cikis'&&Z.a.x>2.95)return null;
  return ODA_ZY_B.copy(bas);
}
function odaZiyaretKare(dt){
  const Z=ODA.ziyaret;if(!Z||!Z.a)return;
  const V=STIL.oda.ziyaret,a=Z.a,K=ODA.giris,ACIK=-1.5;
  Z.t+=dt;
  if(Z.evre==='giris'){
    /* kanat açılır; kişi açılışın yarısında yürümeye başlar; yolun sonunda koltuğa döner ve oturur; kapıdan uzaklaşınca kanat kapanır */
    const t0=V.kapiAc*0.5,Ty=odaZyYuruSure(Z.yol.boy),tw=Z.t-t0;
    if(K){if(a.x<2.5&&Z.kapanBas===null)Z.kapanBas=Z.t;const kapan=Z.kapanBas===null?0:odaZyYumusak((Z.t-Z.kapanBas)/V.kapiKapan);
      K.rotation.y=ACIK*odaZyYumusak(Z.t/V.kapiAc)*(1-kapan);}
    if(tw<Ty){const p=odaZyNokta(Z.yol,odaZyYuruD(Z.yol,Math.max(0,tw))),v=odaZyHiz(Z.yol,Math.max(0,tw));
      a.x=p.x;a.z=p.z;if(typeof blkDon==='function')blkDon(a,p.yon,dt,5);else a.yaw=p.yon;
      if(v>0.05&&typeof blkYuruPoz==='function')blkYuruPoz(a,Math.max(0.4,v),dt);else odaZyPoz(a,ODA_ZY_DURUS,dt,10);}
    else if(tw<Ty+V.don){const C=V.koltuk;if(typeof blkDon==='function')blkDon(a,C[2],dt,4.5);else a.yaw=C[2];odaZyPoz(a,ODA_ZY_DURUS,dt,8);}
    else{const C=V.koltuk,u=odaZyYumusak((tw-Ty-V.don)/V.otur),son=odaZyNokta(Z.yol,Z.yol.boy);
      a.x=son.x+(C[0]-son.x)*u;a.z=son.z+(C[1]-son.z)*u;a.yaw+=Math.atan2(Math.sin(C[2]-a.yaw),Math.cos(C[2]-a.yaw))*Math.min(1,dt*6);
      odaZyPoz(a,odaZyKarisim(a,ODA_ZY_DURUS,POSE.otur,u),dt,20);
      if(u>=1){ODA.ziyaretOlcu={giris:+Z.t.toFixed(2)};odaZyOturdu(Z);return;}}   /* ölçü: girişin süresi (akış denetimi) */
    odaZyYerlestir(a);return;
  }
  if(Z.evre==='oturuyor'){
    /* küçük kıpırtı: baş ve bir kol yavaşça (sabit poz cansız durur) */
    const P=odaZyKarisim(a,POSE.otur,null,0);P.hx=0.04*Math.sin(Z.t*0.7);P.aL=(P.aL||0)+0.04*Math.sin(Z.t*0.45+1);odaZyPoz(a,P,dt,6);odaZyYerlestir(a);return;
  }
  if(Z.evre==='cikis'){
    /* kalkar (koltuğun önüne), kapıya döner, yürür; kapıya yaklaşınca kanat açılır, geçince kapanır, sahneden kalkar */
    const C=V.koltuk,bas=odaZyNokta(Z.yol,0),Ty=odaZyYuruSure(Z.yol.boy);
    if(Z.t<V.kalk){const u=odaZyYumusak(Z.t/V.kalk);a.x=C[0]+(bas.x-C[0])*u;a.z=C[1]+(bas.z-C[1])*u;odaZyPoz(a,odaZyKarisim(a,POSE.otur,ODA_ZY_DURUS,u),dt,20);}
    else{const tw=Z.t-V.kalk,p=odaZyNokta(Z.yol,odaZyYuruD(Z.yol,tw)),v=odaZyHiz(Z.yol,tw);
      a.x=p.x;a.z=p.z;if(typeof blkDon==='function')blkDon(a,p.yon,dt,6);else a.yaw=p.yon;
      if(typeof blkYuruPoz==='function')blkYuruPoz(a,Math.max(0.4,v),dt);
      const acil=a.x>1.9?odaZyYumusak((a.x-1.9)/0.6):0,gec=tw>=Ty?odaZyYumusak((tw-Ty)/V.kapiKapan):0;
      if(K)K.rotation.y=ACIK*acil*(1-gec);
      if(tw>=Ty+(K?V.kapiKapan:0)){ODA.ziyaretOlcu=Object.assign({},ODA.ziyaretOlcu,{cikis:+Z.t.toFixed(2)});const f=Z.bitince;odaZiyaretKaldir();if(f)f();return;}}
    odaZyYerlestir(a);
  }
}
