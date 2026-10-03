/* ============ Chairman — D akışı (kaleci, MM4) ölçümleri ============
   Rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları ve durumu okur.
   - İkinci kurtarış: aynı kalecinin, arada kimse topa sahip olmadan 4 sn içinde yaptığı ikinci kurtarışı.
   - Çelme (tutulamayan kurtarış) sonrası top: bir sonraki dokunuşun ya da topun yavaşladığı yerin altıpasta olması; rakibe düşmesi.
   - Gollerin kaynağı: kayıtlı şut, kendi kalesine, kalecinin çelmesinden sonra, bloktan sonra, diğer.
   - Kalecinin topu toplaması (orta/korner sonrası tutuş), yumruk, dağıtımda topun takımda kalması.
   JSON çıktısında _dBicim: çelme biçimine göre [adet, altıpasa düşen, rakibe düşen]. */
'use strict';
const PL=52.5,MZ=34;
module.exports={
  bilgi:[
    ['— Kaleci (D) —',null,0],
    ['İkinci kurtarış (adet)','dIkinci',2],
    ['Çelme (adet)','dCelme',2],['  sonra top altıpasta (adet)','dCelmeAlti',2],['  sonra top rakibe (adet)','dCelmeRakip',2],
    ['Kapanma (kapan, adet)','dKapan',2],['Şut (adet) / kaleci hazır duruşta','dSutN',2],['  kaleci hazırdı (adet)','dSutHazir',2],
    ['Gol kaynağı: kayıtlı şut','dGolSut',2],['  çelmeden sonra','dGolCelme',2],['  bloktan/sekmeden sonra','dGolBlok',2],
    ['  kendi kalesine (diğer)','dGolOwn',2],['  diğer','dGolDiger',2],
    ['Orta/korner sonrası kaleci tuttu (adet)','dOrtaTut',2],['Yumruk (adet)','dYumruk',2],
    ['Kaleci dağıtımı (adet)','dDagitim',2],['  top takımda kaldı (adet)','dDagitimTamam',2]
  ],
  yeni:()=>{
    let son=[-99,-99],celme=null,ikinci=0,celmeN=0,celmeAlti=0,celmeRakip=0,kapan=0,yumruk=0,ortaTut=0;
    let sonSut=null,olaylar=[],golSut=0,golOwn=0,golCelme=0,golBlok=0,golDiger=0,golN=0;
    let sutN=0,sutHazir=0,oncekiTasiyan=null,sonOrta=-99,dagitim=null,dagN=0,dagTamam=0;
    const sonKapan=new Map(),bicimler={};
    const bitirCelme=(m,x,z,rakip)=>{const c=celme;celme=null;const gx=-m.dir[c.team]*PL,B=bicimler[c.bicim||'?']=bicimler[c.bicim||'?']||[0,0,0];B[0]++;
      if(x!=null&&Math.abs(x-gx)<5.5&&Math.abs(z-MZ)<9.16&&Math.abs(x)<PL){celmeAlti++;B[1]++;}if(rakip){celmeRakip++;B[2]++;}};
    return{
      dinle(ad,v,m){if(!m)return;
        olaylar.push([ad,m.t]);if(olaylar.length>40)olaylar.splice(0,20);
        if(ad==='save'&&v&&v.p){const t=v.p.team;if(m.t-son[t]<4)ikinci++;son[t]=m.t;
          if(!v.catch){celmeN++;if(celme)celme=null;celme={team:t,p:v.p,t0:m.t,surum:m.ball.surum,bicim:v.bicim};}}
        if(ad==='yumruk')yumruk++;
        if(ad==='cross'||ad==='corner')sonOrta=m.t;
        if((ad==='shot'||(ad==='header'&&v&&v.shot))&&m.ball.sut){sutN++;const gk=m.kaleci(1-m.ball.sut.team);if(gk&&gk.tavir==='hazir')sutHazir++;}
        if(ad==='goal'){golN++;
          /* önce kayıtlı şut; değilse son 4 sn'deki son ilgili olay (pas ya da kontrol zinciri keser); sonra kendi kalesine */
          let tur=sonSut?'sut':'diger';
          if(!sonSut)for(let i=olaylar.length-2;i>=0;i--){const o=olaylar[i];if(m.t-o[1]>4)break;
            if(o[0]==='save'){tur='celme';break;}if(o[0]==='block'||o[0]==='sekme'||o[0]==='hakemeCarpti'){tur='blok';break;}
            if(o[0]==='pass'||o[0]==='cross'||o[0]==='header'||o[0]==='ilkDokunus')break;}
          if(tur==='diger'&&v.own)tur='own';
          if(tur==='sut')golSut++;else if(tur==='celme')golCelme++;else if(tur==='blok')golBlok++;else if(tur==='own')golOwn++;else golDiger++;
          if(celme)celme=null;}
        if((ad==='gkkick'||ad==='pass')&&v&&v.p&&v.p.rol==='GK'){dagN++;dagitim={team:v.p.team,t:m.t};}
      },
      adim(m){
        const b=m.ball;
        /* bu adımın sonunda kayıtlı şut var mı (gol olayı sonraki adımın içinde gelir; gol() b.sut'u siler) */
        sonSut=b.sut||null;
        for(const p of m.players){const e=p.eylem;if(e&&e.ad==='kapan'&&sonKapan.get(p)!==e){kapan++;sonKapan.set(p,e);}}
        if(m.phase!=='play'){son=[-99,-99];if(celme)bitirCelme(m,null,null,false);dagitim=null;oncekiTasiyan=b.tasiyan;return;}
        if(b.sahip||b.tasiyan){son=[-99,-99];}
        /* çelme sonrası top */
        if(celme){const c=celme,dok=b.sonDokunan;
          if(b.tasiyan){bitirCelme(m,b.x,b.z,b.tasiyan.team!==c.team);}
          else if(dok&&dok!==c.p){bitirCelme(m,b.x,b.z,dok.team!==c.team);}
          else if(m.t-c.t0>0.3&&Math.hypot(b.vx,b.vz)<4&&b.y<0.5){bitirCelme(m,b.x,b.z,false);}
          else if(m.t-c.t0>4)bitirCelme(m,null,null,false);}
        /* kaleci topu eline aldı: orta/korner sonrası mı */
        const ta=b.tasiyan;if(ta&&ta!==oncekiTasiyan&&ta.rol==='GK'&&m.t-sonOrta<3.5)ortaTut++;
        oncekiTasiyan=ta;
        /* dağıtım: topu ilk alan takım */
        if(dagitim){const s=b.sahip||b.tasiyan;if(s&&s.rol!=='GK'){if(s.team===dagitim.team)dagTamam++;dagitim=null;}else if(m.t-dagitim.t>8)dagitim=null;}
      },
      bitir(m){
        /* oranlar: payları ve paydaları ayrı (maç başına ortalamaların oranı = toplam oran) */
        return{dIkinci:ikinci,dCelme:celmeN,dCelmeAlti:celmeAlti,dCelmeRakip:celmeRakip,dKapan:kapan,dSutN:sutN,dSutHazir:sutHazir,
          dGolSut:golSut,dGolOwn:golOwn,dGolCelme:golCelme,dGolBlok:golBlok,dGolDiger:golDiger,dYumruk:yumruk,dOrtaTut:ortaTut,dDagitim:dagN,dDagitimTamam:dagTamam,
          _dBicim:bicimler};
      }
    };
  }
};
