'use strict';
/* ============ Senaryoların ortak kurulumu (Z1, 2026-10-19; FUTBOL_KUTUPHANESI §11.2 "örtüşme temizliği") ============
   Senaryolar (araclar/senaryolar/*.js) aynı kalıbı tekrar ediyordu: maçı kur ve santraya geç, sahayı boşalt, oyuncuyu yerleştir, topu birine ver
   (`git show tur/p2:kutuphane/K-test-rejimi.md` §4.3). Bu dosya senaryolar klasörünün DIŞINDADIR (oturum-sonu.js oradaki her .js'i senaryo sayar).
   Kullanım: const O=require('../senaryo-ortak')(ctx,vm);
     O.kur(tohum, olay[, kadro, {hakemYok}])  Match kurar, maç öncesini atlar (macaGec); olay: (ad, v) geri çağrısı; hakemYok: hakemler durur ve
                                       sahadan çekilir (v-sut: hakem şutçunun önüne girmesin)
     O.bosalt(m, kal)                  kal dışındaki saha oyuncularını oyundan çıkarır (kaleciler kalır)
     O.yerlestir(p, x, z, yon[, v, ek]) oyuncuyu yerine koyar, hızı yonde v (m/sn); eylem, sürüş, koşu, çalım ve yutma sıfırlanır; ek: başka
                                       alanlar (ör. {destek:null}, {zipla:null,yuk:0,tavir:null})
     O.topVer(m, p[, yon, v, uzak])     top p'nin önünde (uzak m, varsayılan 0,45), hızı v; sahibi p (sahipYap)
     O.oyunda(m)                       aşama 'play', duruş yok
     O.dizilis(m, t, bu, bw, hucum)    t takımının herkesi dizilişin yerinde (dizilisKonumu; bu, bw hücum çerçevesinde topun yeri)
     O.ayar(nesne) → eski              MOTOR_AYAR'a yazar, eski değerleri döner (geri yüklemek için O.ayar(eski))
     O.ayarVar(ad)                     anahtar MOTOR_AYAR'da bildirilmiş mi
   Rastlantı çekmez; motorun kendi kurucularını kullanır. */
module.exports=function(ctx,vm){
  const kur0=vm.runInContext(`(tohum,olay,kadro,hakemYok)=>{const m=new Match(olay,{kadro:kadro||MAC_KADRO,tohum,tunel:{x:0,z:-6}});m.macaGec();
    if(hakemYok){m.hakemAI=function(){};for(const r of m.refs){r.x=0;r.z=-25;r.tx=0;r.tz=-25;}}return m;}`,ctx);
  const kur=(tohum,olay,kadro,se)=>kur0(tohum,olay,kadro||null,!!(se&&se.hakemYok));
  const dizilisKonumu=vm.runInContext('dizilisKonumu',ctx);
  const bosalt=(m,kal)=>{for(const p of m.players){if(kal.includes(p)||p.rol==='GK')continue;p.oyunda=false;p.x=p.tx=-300;p.z=p.tz=-300;p.vx=p.vz=0;p.eylem=null;}};
  const yerlestir=(p,x,z,yon,v,ek)=>{v=v||0;Object.assign(p,{x,z,tx:x,tz:z,vx:Math.cos(yon)*v,vz:Math.sin(yon)*v,spd:v,yon,eylem:null,kickCd:0,surus:null,kosu:null,
    oyunda:true,denge:1,calim:null,yutma:null},ek||null);};
  const topVer=(m,p,yon,v,uzak)=>{const b=m.ball,a=yon!=null?yon:p.yon,L=uzak!=null?uzak:0.45,h=v||0;
    Object.assign(b,{x:p.x+Math.cos(a)*L,z:p.z+Math.sin(a)*L,y:0,vx:Math.cos(a)*h,vz:Math.sin(a)*h,vy:0,egri:0,ust:0,sahip:null,tasiyan:null,hedefOyuncu:null,sut:null,pas:null,
      sonTakim:p.team,sonDokunan:p});m.topDegisti();m.sahipYap(p);};
  const oyunda=m=>{m.phase='play';m.phaseT=1;m.durus=null;};
  const dizilis=(m,t,bu,bw,hucum)=>{const d=m.dir[t],diz=m.taktik[t].dizilis;
    for(const p of m.teams[t]){if(!p.oyunda)continue;const q=dizilisKonumu(diz,p.n,bu,bw,!!hucum);yerlestir(p,q.u*d,q.w,d>0?0:Math.PI,0);}};
  const ayarVar=ad=>vm.runInContext(`Object.prototype.hasOwnProperty.call(MOTOR_AYAR,${JSON.stringify(ad)})`,ctx);
  const ayar=o=>{const eski={};for(const k in o){if(!ayarVar(k))continue;eski[k]=vm.runInContext('MOTOR_AYAR['+JSON.stringify(k)+']',ctx);}
    const yaz={};for(const k in eski)yaz[k]=o[k];vm.runInContext(`Object.assign(MOTOR_AYAR,${JSON.stringify(yaz)})`,ctx);return eski;};
  return{kur,bosalt,yerlestir,topVer,oyunda,dizilis,ayar,ayarVar};
};
