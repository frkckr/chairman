/* ============ Chairman — D akışı (kaleci, MM4) ölçümleri ============
   Rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları ve durumu okur.
   - İkinci kurtarış: aynı kalecinin, arada kimse topa sahip olmadan 4 sn içinde yaptığı ikinci kurtarışı.
   - Çelme (tutulamayan kurtarış) sonrası top: bir sonraki dokunuşun ya da topun yavaşladığı yerin altıpasta olması; rakibe düşmesi.
   - Gollerin kaynağı: kayıtlı şut, kendi kalesine, kalecinin çelmesinden sonra, bloktan sonra, diğer.
   - Kalecinin topu toplaması (orta/korner sonrası tutuş), yumruk, dağıtımda topun takımda kalması.
   JSON çıktısında _dBicim: çelme biçimine göre [adet, altıpasa düşen, rakibe düşen].
   - T9b-0 (2026-10-10): çelmenin sonu — kendi kalesine (çelmeden sonra, arada kimse dokunmadan gol), oyun dışına (oyun durdu), tehlikeli bölgeye
     (sonraki dokunuş ya da topun yavaşladığı yer kale çizgisine 11 m ve kale ortasına 9,16 m içinde), güvenli (geri kalanı ve kalecinin yeniden
     tuttuğu top); çelmelere oranla.
   - T15-0 (2026-10-14): "oyun dışına" ayrılır — korner, taç, başka duruş (faul, ofsayt …); kalecinin çizgi dışına çeldiği top her zaman
     kornerdir (son dokunan savunan takım). "Kurtarıştan korner / şut": şut kurtarışından (olayda sut) çelinen ya da parmak ucuyla çıkan topun
     arada kimse dokunmadan kornere gitmesi, kalecinin gördüğü şut sayısına (penaltı dahil) bölünür (T15 kabulü ≥ 0,07; gerçek ~0,06–0,1).
     Özet tablo (ozet): çelmenin sonu temasın türüne (çift el, tek el, parmak ucu, gövde/bacak, yumruk), temastaki top hızına ve kalecinin
     niyetine (T15a; olayda niyet) göre; şut kurtarışında tutma payı temas yüksekliğine göre (kepçe < 0,55 · kucak < 1,25 · W < 1,9 · yukarı).
     Yumruk tabloya girer, "çelmenin sonu" satırlarına girmez (eski satırlar karşılaştırılabilir kalsın). */
/* V1-0b (2026-10-20; FUTBOL_KUTUPHANESI §12.14, V1e): elden dağıtım — kalecinin elle bıraktığı top ('pass' olayı, eylem elleAtis: yuvarla, omuz,
   üst) ve degajı ('gkkick', eylem degaj: düşürme, punt). Tür (eylemin stil'i); hazırlık süresi (V1e'nin 'dagitim' eylemi başladıysa bırakışa
   kadar geçen süre; yoksa 0); bırakışta |gövde–atış| (kalecinin yönü ile topun çıkış yönü arasındaki açı); tutuştan bırakışa süre (aynı kalecinin
   topu eline almasından; havuzlanmış yüzdelikler özette). */
'use strict';
const DK_O=require('../olcum-ortak');
const PL=52.5,MZ=34;
const DK_STIL=['yuvarla','omuz','ust','dusurme','punt'],DK_STILAD={yuvarla:'yuvarla',omuz:'omuzdan',ust:'üstten',dusurme:'düşürme',punt:'punt'};
const DK_SON=['kale','korner','tac','durus','tehlike','disa','tutus'],DK_SONAD={kale:'kendi kale',korner:'korner',tac:'taç',durus:'başka duruş',tehlike:'tehlike',disa:'güvenli',tutus:'yeniden tuttu'};
const DK_TEMAS=['cift','tek','parmak','govde','yumruk'],DK_TEMASAD={cift:'çift el',tek:'tek el',parmak:'parmak ucu',govde:'gövde / bacak',yumruk:'yumruk'};
const DK_HIZ=[0,18,24,99],DK_HIZAD=['≤ 18 m/sn','18–24 m/sn','> 24 m/sn'];
const DK_NIYET=['cel','tut','yok'],DK_NIYETAD={cel:'planlı çelme',tut:'tutmak isterken',yok:'niyet yok (T15a öncesi)'};
const DK_Y=[0,0.55,1.25,1.9,99],DK_YAD=['kepçe (< 0,55 m)','kucak (0,55–1,25)','W (1,25–1,9)','yukarı (> 1,9)'];
const dkDilim=(S,x)=>{for(let i=0;i<S.length-1;i++)if(x<S[i+1])return i;return S.length-2;};
module.exports={
  bilgi:[
    ['— Kaleci (D) —',null,0],
    ['İkinci kurtarış (adet)','dIkinci',2],
    ['Çelme (adet)','dCelme',2],['  sonra top altıpasta (adet)','dCelmeAlti',2],['  sonra top rakibe (adet)','dCelmeRakip',2],
    ['Kapanma (kapan, adet)','dKapan',2],['Şut (adet) / kaleci hazır duruşta','dSutN',2],['  kaleci hazırdı (adet)','dSutHazir',2],
    ['Gol kaynağı: kayıtlı şut','dGolSut',2],['  çelmeden sonra','dGolCelme',2],['  bloktan/sekmeden sonra','dGolBlok',2],
    ['  kendi kalesine (diğer)','dGolOwn',2],['  diğer','dGolDiger',2],
    ['Çelmenin sonu: kendi kalesine %','dCyKale',1],['Çelmenin sonu: oyun dışına %','dCyDisari',1],
    ['  oyun dışı: korner %','dCyKorner',1],['  oyun dışı: taç %','dCyTac',1],
    ['Çelmenin sonu: tehlikeli bölgeye (11 m, kale ±9 m) %','dCyTehlike',1],['Çelmenin sonu: güvenli (bölge dışı, oyunda) %','dCyDisa',1],
    ['Kurtarıştan korner / şut (T15-0)','dKurtKorner',3,[0.07,null,'T15']],
    ['Orta/korner sonrası kaleci tuttu (adet)','dOrtaTut',2],['Yumruk (adet)','dYumruk',2],
    ['Kaleci dağıtımı (adet)','dDagitim',2],['  top takımda kaldı (adet)','dDagitimTamam',2],
    /* T19-0 (2026-10-17): kalecinin olağan tutuşu — tutuştan (kaleci topu eline aldı) elle dağıtıma süre; bekletme (> 1 sn) payı; hemen (≤ 1 sn)
       dağıtımda alıcı kaleciden ≥ 30 m ileride (kontra); oyun durmadan (aynı oyun evresinde) ölçülür */
    ['Tutuştan dağıtıma süre ortanca (sn; T19)','dTutSure',2],['Tutuşta bekletme (> 1 sn) %','dTutBekle',1],['  hemen dağıtımda uzun (≥ 30 m ileri) %','dTutKontra',1],
    ['— V1: elden dağıtım (d-kaleci; V1-0b) —',null,0],
    ['Elden dağıtım (adet)','dV1N',2],...DK_STIL.map(k=>[`  ${DK_STILAD[k]} %`,'dV1S_'+k,1]),
    ['Elden dağıtım: hazırlık ortanca (sn; dagitim eylemi)','dV1Haz',2],
    ['Elden dağıtım: bırakışta |gövde–atış| ortanca (°)','dV1Aci',0],['  %90 (°)','dV1Aci90',0],['  en çok (°)','dV1AciMax',0]
  ],
  yeni:()=>{
    let son=[-99,-99],celme=null,ikinci=0,celmeN=0,celmeAlti=0,celmeRakip=0,kapan=0,yumruk=0,ortaTut=0;
    let sonSut=null,olaylar=[],golSut=0,golOwn=0,golCelme=0,golBlok=0,golDiger=0,golN=0;
    let sutN=0,sutHazir=0,oncekiTasiyan=null,sonOrta=-99,dagitim=null,dagN=0,dagTamam=0,kurtKorner=0;
    const sonKapan=new Map(),bicimler={},cy={kale:0,korner:0,tac:0,durus:0,tehlike:0,disa:0};
    /* T19-0: tutuş → dağıtım */
    let tutus=null;const tutL=[];let tutHemen=0,tutHemenUzun=0;
    /* V1-0b: elden dağıtım */
    const EL=[],DAG=new WeakMap(),SONDAG=new Map();
    /* T15-0 tablo: sayaçlar [sınıf|son] */
    const tablo={};const say=(k)=>{tablo[k]=(tablo[k]||0)+1;};
    const yt={};for(let i=0;i<DK_YAD.length;i++)yt[i]=[0,0];
    /* sn: çelmenin sonu (DK_SON) */
    const bitirCelme=(m,x,z,rakip,guvenli,sn)=>{const c=celme;celme=null;const gx=-m.dir[c.team]*PL;
      let s=sn;if(!s){if(guvenli)s='tutus';else if(x!=null&&Math.abs(x-gx)<11&&Math.abs(z-MZ)<9.16&&Math.abs(x)<PL)s='tehlike';else s='disa';}
      say('T|'+c.temas+'|'+s);say('H|'+c.hiz+'|'+s);say('N|'+c.niyet+'|'+s);
      if(c.yumruk)return;
      if(s==='kale'){cy.kale++;return;}   /* çelmeden sonra gol: biçim ve altıpas sayımına girmez (T9b-0'daki gibi) */
      const B=bicimler[c.bicim||'?']=bicimler[c.bicim||'?']||[0,0,0];B[0]++;
      if(x!=null&&Math.abs(x-gx)<5.5&&Math.abs(z-MZ)<9.16&&Math.abs(x)<PL){celmeAlti++;B[1]++;}if(rakip){celmeRakip++;B[2]++;}
      if(s==='tutus')cy.disa++;else cy[s]++;
      if(s==='korner'&&c.sut)kurtKorner++;};
    /* oyun durdu: duruşun türü */
    const durusSon=m=>{const du=m.phase==='durus'&&m.durus;return du&&du.tur==='korner'?'korner':du&&du.tur==='tac'?'tac':'durus';};
    return{
      dinle(ad,v,m){if(!m)return;
        olaylar.push([ad,m.t]);if(olaylar.length>40)olaylar.splice(0,20);
        if(ad==='save'&&v&&v.p){const t=v.p.team;if(m.t-son[t]<4)ikinci++;son[t]=m.t;
          if(v.sut&&v.y!=null){const i=dkDilim(DK_Y,v.y);yt[i][1]++;if(v.catch)yt[i][0]++;}
          if(!v.catch){celmeN++;if(celme)celme=null;
            const temas=v.bicim==='parmak'?'parmak':v.parca&&v.parca!=='el'?'govde':v.el==='tek'?'tek':'cift';
            celme={team:t,p:v.p,t0:m.t,surum:m.ball.surum,bicim:v.bicim,sut:!!v.sut,temas,hiz:v.hiz!=null?dkDilim(DK_HIZ,v.hiz):-1,niyet:v.niyet||'yok'};}}
        if(ad==='yumruk'){yumruk++;
          /* yumruk tabloya girer; açık bir çelme varsa ona dokunmaz (eski satırlar aynı kalsın) */
          if(!celme&&v&&v.p)celme={team:v.p.team,p:v.p,t0:m.t,surum:m.ball.surum,bicim:'yumruk',sut:false,temas:'yumruk',hiz:v.hiz!=null?dkDilim(DK_HIZ,v.hiz):-1,niyet:'yok',yumruk:true};}
        /* T8-0: korner ve ortalanan serbest vuruşun penceresi kullanım anından ('kullanim'; eskiden korner duruşunun başındaki 'corner' olayından:
           vuruş ~6–7 sn sonra geldiği için kornerden tutuş sayılmıyordu) */
        if(ad==='cross'||ad==='kullanim'&&v&&(v.tur==='korner'&&v.alt!=='kisa'||v.tur==='serbest'&&v.alt==='orta'))sonOrta=m.t;
        if((ad==='shot'||(ad==='header'&&v&&v.shot))&&m.ball.sut){sutN++;const gk=m.kaleci(1-m.ball.sut.team);if(gk&&gk.tavir==='hazir')sutHazir++;}
        if(ad==='goal'){golN++;
          /* önce kayıtlı şut; değilse son 4 sn'deki son ilgili olay (pas ya da kontrol zinciri keser); sonra kendi kalesine */
          let tur=sonSut?'sut':'diger';
          if(!sonSut)for(let i=olaylar.length-2;i>=0;i--){const o=olaylar[i];if(m.t-o[1]>4)break;
            if(o[0]==='save'){tur='celme';break;}if(o[0]==='block'||o[0]==='sekme'||o[0]==='hakemeCarpti'){tur='blok';break;}
            if(o[0]==='pass'||o[0]==='cross'||o[0]==='header'||o[0]==='ilkDokunus')break;}
          if(tur==='diger'&&v.own)tur='own';
          if(tur==='sut')golSut++;else if(tur==='celme')golCelme++;else if(tur==='blok')golBlok++;else if(tur==='own')golOwn++;else golDiger++;
          if(celme)bitirCelme(m,null,null,false,false,'kale');}
        if((ad==='gkkick'||ad==='pass')&&v&&v.p&&v.p.rol==='GK'){const gk=v.p,e=gk.eylem;
          if(e&&(e.ad==='elleAtis'||e.ad==='degaj')){const b=m.ball,d0=SONDAG.get(gk);
            const t0=d0&&DAG.has(d0)?DAG.get(d0):null;SONDAG.delete(gk);
            EL.push({stil:e.stil||e.ad,haz:t0!=null&&m.t-t0<5?m.t-t0:0,aci:Math.abs(DK_O.aciFark(Math.atan2(b.vz,b.vx),gk.yon))*180/Math.PI,
              tut:tutus&&tutus.p===gk?m.t-tutus.t:null});}}
        if((ad==='gkkick'||ad==='pass')&&v&&v.p&&v.p.rol==='GK'){dagN++;dagitim={team:v.p.team,t:m.t};
          if(tutus&&tutus.p===v.p){const s=m.t-tutus.t;tutL.push(s);if(s<=1){tutHemen++;const q=v.q,d=m.dir[v.p.team];if(q&&(q.x-v.p.x)*d>=30)tutHemenUzun++;}tutus=null;}}
      },
      adim(m){
        const b=m.ball;
        /* V1-0b: V1e'nin dağıtım eylemi (hazırlık) başladı — kalecide en son dagitim eylemi */
        for(const t of[0,1]){const gk=m.kaleci(t);if(!gk)continue;const e=gk.eylem;if(e&&e.ad==='dagitim'&&!DAG.has(e)){DAG.set(e,m.t);SONDAG.set(gk,e);}}
        /* bu adımın sonunda kayıtlı şut var mı (gol olayı sonraki adımın içinde gelir; gol() b.sut'u siler) */
        sonSut=b.sut||null;
        for(const p of m.players){const e=p.eylem;if(e&&e.ad==='kapan'&&sonKapan.get(p)!==e){kapan++;sonKapan.set(p,e);}}
        if(m.phase!=='play'){son=[-99,-99];if(celme)bitirCelme(m,null,null,false,false,durusSon(m));dagitim=null;tutus=null;oncekiTasiyan=b.tasiyan;return;}
        if(b.sahip||b.tasiyan){son=[-99,-99];}
        /* çelme sonrası top */
        if(celme){const c=celme,dok=b.sonDokunan;
          if(b.tasiyan){bitirCelme(m,b.x,b.z,b.tasiyan.team!==c.team,b.tasiyan===c.p);}   /* kalecinin kendi çelip yeniden tuttuğu top güvenlidir */
          else if(dok&&dok!==c.p){bitirCelme(m,b.x,b.z,dok.team!==c.team);}
          else if(m.t-c.t0>0.3&&Math.hypot(b.vx,b.vz)<4&&b.y<0.5){bitirCelme(m,b.x,b.z,false);}
          else if(m.t-c.t0>4)bitirCelme(m,b.x,b.z,false);}
        /* kaleci topu eline aldı: orta/korner sonrası mı */
        const ta=b.tasiyan;if(ta&&ta!==oncekiTasiyan&&ta.rol==='GK'&&m.t-sonOrta<3.5)ortaTut++;
        if(ta&&ta!==oncekiTasiyan&&ta.rol==='GK')tutus={p:ta,t:m.t};
        oncekiTasiyan=ta;
        /* dağıtım: topu ilk alan takım */
        if(dagitim){const s=b.sahip||b.tasiyan;if(s&&s.rol!=='GK'){if(s.team===dagitim.team)dagTamam++;dagitim=null;}else if(m.t-dagitim.t>8)dagitim=null;}
      },
      bitir(m){
        /* oranlar: payları ve paydaları ayrı (maç başına ortalamaların oranı = toplam oran) */
        const N=cy.kale+cy.korner+cy.tac+cy.durus+cy.tehlike+cy.disa,ham={dCyKale:[cy.kale,N],dCyDisari:[cy.korner+cy.tac+cy.durus,N],dCyKorner:[cy.korner,N],dCyTac:[cy.tac,N],
          dCyTehlike:[cy.tehlike,N],dCyDisa:[cy.disa,N],
          /* oran satırı 100·pay/payda yazar: payda 100·şut — satır korner / şut verir */
          dKurtKorner:[kurtKorner,100*sutN]};
        for(let i=0;i<DK_YAD.length;i++)ham['dYt_'+i]=yt[i];
        ham.dTutBekle=[tutL.filter(s=>s>1).length,tutL.length];ham.dTutKontra=[tutHemenUzun,tutHemen];
        const tS=tutL.slice().sort((a,c)=>a-c),dTutSure=tS.length?tS[Math.floor(tS.length/2)]:NaN;
        /* V1-0b */
        for(const k of DK_STIL)ham['dV1S_'+k]=[EL.filter(x=>x.stil===k).length,EL.length];
        const ac=EL.map(x=>x.aci),r2=x=>x!=null&&x===x?Math.round(x*100)/100:null;
        const v1={dV1N:EL.length,dV1Haz:DK_O.ortanca(EL.map(x=>x.haz)),dV1Aci:DK_O.ortanca(ac),dV1Aci90:DK_O.yuzde(ac,0.9),dV1AciMax:ac.length?Math.max(...ac):NaN,
          _dV1:EL.map(x=>({stil:x.stil,haz:r2(x.haz),aci:r2(x.aci),tut:r2(x.tut)}))};
        return{...v1,dIkinci:ikinci,dCelme:celmeN,dCelmeAlti:celmeAlti,dCelmeRakip:celmeRakip,dKapan:kapan,dSutN:sutN,dSutHazir:sutHazir,
          dGolSut:golSut,dGolOwn:golOwn,dGolCelme:golCelme,dGolBlok:golBlok,dGolDiger:golDiger,dYumruk:yumruk,dOrtaTut:ortaTut,dDagitim:dagN,dDagitimTamam:dagTamam,dTutSure,
          _dBicim:bicimler,_dTablo:tablo,ham};
      }
    };
  },
  /* T15-0: çelmenin sonu temasın türüne, hızına ve niyetine göre; tutma payı yüksekliğe göre (bütün maçların toplamı) */
  ozet(sonuclar){
    const T={},H={};for(const s of sonuclar){for(const [k,n] of Object.entries(s._dTablo||{}))T[k]=(T[k]||0)+n;const h=s.ham||{};for(const k in h)if(k.startsWith('dYt_')){const a=H[k]||(H[k]=[0,0]);a[0]+=h[k][0];a[1]+=h[k][1];}}
    const f=(x,n)=>String(x).padStart(n),bas='  '+''.padEnd(26)+f('adet',6)+DK_SON.map(k=>f(DK_SONAD[k],14)).join('');
    const tab=(on,L,AD)=>{for(const k of L){const n=DK_SON.reduce((a,s)=>a+(T[on+'|'+k+'|'+s]||0),0);if(!n)continue;
      console.log('  '+AD(k).padEnd(26)+f(n,6)+DK_SON.map(s=>f((100*(T[on+'|'+k+'|'+s]||0)/n).toFixed(0)+'%',14)).join(''));}};
    console.log('\n  Çelmenin sonu (d-kaleci; T15-0): temas · top hızı · niyet (yumruk dahil; satır yüzdeleri)');console.log(bas);
    tab('T',DK_TEMAS,k=>DK_TEMASAD[k]);tab('H',[0,1,2,-1],k=>k<0?'hız bilinmiyor':DK_HIZAD[k]);tab('N',DK_NIYET,k=>DK_NIYETAD[k]);
    /* V1-0b: elden dağıtım (havuzlanmış) */
    {const L=[].concat(...sonuclar.map(s=>s._dV1||[]));if(L.length){const f=x=>x===x&&x!=null?x.toFixed(2):'—',P=a=>{const c=a.filter(x=>x!=null);return `${f(DK_O.yuzde(c,0.1))} / ${f(DK_O.yuzde(c,0.5))} / ${f(DK_O.yuzde(c,0.9))}`;};
      console.log(`\n  V1 (d-kaleci): elden dağıtım n ${L.length} — %10 / %50 / %90: bırakışta |gövde–atış| ${P(L.map(x=>x.aci))}° (en çok ${f(Math.max(...L.map(x=>x.aci)))}) · hazırlık ${P(L.map(x=>x.haz))} sn · tutuştan bırakışa ${P(L.map(x=>x.tut))} sn`);
      console.log('  türe göre |gövde–atış| ortanca: '+DK_STIL.map(k=>{const a=L.filter(x=>x.stil===k);return a.length?`${DK_STILAD[k]} ${f(DK_O.ortanca(a.map(x=>x.aci)))}° (${a.length})`:null;}).filter(Boolean).join(' · '));}}
    console.log('  Şut kurtarışında tutma payı (temas yüksekliği): '+DK_YAD.map((a,i)=>{const [t,n]=H['dYt_'+i]||[0,0];return a+' '+(n?(100*t/n).toFixed(0)+'%':'—')+' ('+n+')';}).join(' · '));
  }
};
