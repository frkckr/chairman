/* ============ Chairman — başkanın beden hareketi: kalkış, adım, oturma, el işi (yalnız sunum; yol haritası N6) ============
   Kullanıcı kararı 2026-10-04: odadan balkona yürüyüş, masaya oturma ve locaya giriş ani değil, adım adım ve insan gibi olur.
   Buradaki işlevler saf hesaplardır (durum tutmaz, sahneye dokunmaz); kamera yolunu kuran dosya (js/oda.js; sonra js/loca-giris.js) çağırır.
   İlke: göz konumu, hızı ve ivmesi süreklidir (yrYumusak: en az sarsıntılı geçiş). Süs hareketi ve kamera sallantısı yoktur; yalnız gerçek
   adımın küçük iniş-çıkışı ve ağırlık aktarımı vardır (2026-10-02'deki “yalpa yok” ayrıntısının yerini alır). Ayarlar STIL.yuruyus (TEST).
     yrYumusak(x)                     0→1 geçiş; başta ve sonda hız ve ivme sıfır
     yrKalk(s, P0, P1, ileri, out)    kalkış (s 0→1): otururken göz P0 → ayakta göz P1; önce öne eğilir, sonra iter, doğrulur ve yerine adım atar
     yrOtur(s, P0, P1, ileri, out)    oturma (s 0→1): ayakta göz P0 → otururken göz P1; yerine geçer, öne eğilerek alçalır, en son yaslanır
     yrAdimBoyu(v)                    hıza göre adım boyu (m): yavaşken kısa adım
     yrAdim(faz, zarf, yon, P)        adımın göze etkisi: dikey iniş-çıkış ve yana ağırlık aktarımı (faz: adım sayısı, kesirli; zarf 0–1)
     yrElKur(malzeme)                 kol + manşet + el; ön kol +z'ye uzanır, bilek kökte. {g, parmak}
     yrElYolu(s, bas, hedef, out)     elin bir nesneye uzanıp dönmesi (s 0→1): tut anında hedeftedir; dönen değer uzanma oranı (0–1) */
const YR=STIL.yuruyus;
const yrYumusak=x=>{x=x<0?0:x>1?1:x;return x*x*x*(10+x*(6*x-15));};
function yrKalk(s,P0,P1,ileri,out){
  const K=YR.kalk,eg=yrYumusak(s/K.egilPay)*(1-yrYumusak((s-K.egilPay)/(1-K.egilPay)));
  const yuk=yrYumusak((s-K.egilPay*0.55)/(1-K.egilPay*0.55)),yat=yrYumusak((s-K.adimPay)/(1-K.adimPay));
  return out.set(P0.x+(P1.x-P0.x)*yat+ileri.x*K.egil*eg,P0.y+(P1.y-P0.y)*yuk-K.cok*eg,P0.z+(P1.z-P0.z)*yat+ileri.z*K.egil*eg);
}
function yrOtur(s,P0,P1,ileri,out){
  const O=YR.otur,yat=yrYumusak(s/O.yerPay),al=yrYumusak((s-O.basla)/(O.yaslan-O.basla));
  /* alçalırken gövde öne eğilir (çan biçimli); oturunca biraz önde kalır, en son yaslanır */
  const eg=Math.sin(Math.PI*al),on=al*(1-yrYumusak((s-O.yaslan)/(1-O.yaslan))),k=O.egil*eg+O.geri*on;
  return out.set(P0.x+(P1.x-P0.x)*yat+ileri.x*k,P0.y+(P1.y-P0.y)*al-O.cok*eg,P0.z+(P1.z-P0.z)*yat+ileri.z*k);
}
function yrAdimBoyu(v){const A=YR.adim;return A.boy*(0.6+0.4*Math.min(1,v/A.hiz));}
function yrAdim(faz,zarf,yon,P){
  const A=YR.adim,z=yrYumusak(zarf),yanal=Math.sin(Math.PI*faz)*A.yanal*z;
  /* her adımın ortasında (tek ayak üstünde) göz en yüksekte, ayak basarken en alçakta: düzgün dalga (köşesiz; baş bedenden yumuşak hareket eder).
     Ağırlık basan ayağın yanına kayar (iki adımda bir tam salınım) */
  P.y-=Math.cos(2*Math.PI*faz)*A.dikey*0.5*z;P.x-=yon.z*yanal;P.z+=yon.x*yanal;
  return P;
}
function yrElKur(M){
  const g=new THREE.Group(),B=STIL.baskan,kol=M({color:B.takim}),ten=M({color:B.ten});
  box(0.096,0.074,0.52,kol,0,0.004,0.29,g);box(0.1,0.078,0.03,M({color:0xf2f0ea}),0,0.004,0.03,g);box(0.08,0.03,0.095,ten,0,-0.008,-0.058,g);
  const parmak=new THREE.Group();parmak.position.set(0,-0.01,-0.105);g.add(parmak);box(0.078,0.024,0.07,ten,0,-0.002,-0.034,parmak);
  g.rotation.order='YXZ';g.visible=false;return{g,parmak};
}
function yrElYolu(s,bas,hedef,out){
  const E=YR.el,u=s<E.tut?yrYumusak(s/E.tut):s<E.tut+E.bekle?1:1-yrYumusak((s-E.tut-E.bekle)/(1-E.tut-E.bekle));
  out.lerpVectors(bas,hedef,u);out.y+=Math.sin(Math.PI*u)*E.kavis;return u;
}
