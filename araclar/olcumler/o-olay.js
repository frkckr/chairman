'use strict';
/* ============ T10-0 (2026-10-11): maç olayları ve hakem — "O:" satırları (gerçekçilik planı §4 T10) ============
   Hakemin topa uzaklığı (top oyundayken her adım; Ek G7 ölçütü ortalama 12–22 m — gerçekte 18–19 m, sürenin ~%80'i 5–30 m), faule uzaklığı
   (görülen, avantaj ve görülmeyen faul; avantajdan dönen faul ikinci kez sayılmaz), hakemin faule uzaklığına göre görülmeyen faul payı (kutuda
   verilmeyen hava faulü — olay faulGorulmedi, P 0,5, kaynak hava — görme payına girmez, ayrı sayılır), kırmızı kart (ya da ikinci sarı) gördüğü
   hâlde 12 sn sonra sahada kalan oyuncu (T10 teşhisindeki hata 1; kabul 0), gol → santra süresi (gol olayından santraya; T10 kararı 20–35 sn),
   değişikliğin dakikası ve süresi (değişiklik olayından oyuncu girene), uzatmanın kaynakları (motorun birikimiyle aynı ölçek: gol 50, değişiklik 30,
   faul 15 (+15 kart), penaltı 60, avantajdan dönen faul 15 sn), zaman geçirme göstergesi (önde olan takımın kullandığı taç, korner, kale vuruşu ve
   serbest vuruşta duruşun süresi: 75. dakikadan önce ve sonra), topa çarpan hakem, sakatlık (olay sakatlik {derece: agri|tedavi|cikis}; T10c'ye
   dek 0). Rastlantı çekmez, maçı değiştirmez. */
const OO_ZG=75*60;   /* zaman geçirme göstergesinin sınırı (maç saati, sn) */
const OO_TUR=new Set(['tac','korner','kaleVurusu','serbest']);
const ooOrt=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN;
module.exports={
  bilgi:[
    ['— O: maç olayları ve hakem (T10) —',null,0],
    ['Hakem: topa uzaklık ort. (m; top oyunda)','oHkTop',1,[12,22,'T10']],
    ['Hakem: topa 5–30 m payı %','oHk530',1],
    ['Hakem: faule uzaklık ort. (m; görülen, avantaj, görülmeyen)','oHkFaul',1],
    ['Görülmeyen faul payı %','oGorulmeyen',1],
    ['Görülmeyen faul payı: hakeme <15 m %','oGor15',1],
    ['Görülmeyen faul payı: hakeme 15–25 m %','oGor25',1],
    ['Görülmeyen faul payı: hakeme >25 m %','oGorUzak',1],
    ['Kutuda verilmeyen hava faulü / maç','oKutuHava',2],
    ['Kırmızı görüp 12 sn sonra sahada kalan / maç','oKirmiziSahada',2,[0,0,'T10']],
    ['Gol → santra (sn)','oGolSantra',1,[20,35,'T10']],
    ['Değişiklik: dakika ort.','oDegDk',1],
    ['Değişiklik: süre (sn; olaydan oyuncu girene)','oDegSure',1],
    ['Uzatma kaynağı: gol (sn / maç)','oUzGol',0],
    ['Uzatma kaynağı: değişiklik (sn / maç)','oUzDeg',0],
    ['Uzatma kaynağı: faul ve kart (sn / maç)','oUzFaul',0],
    ['Uzatma kaynağı: penaltı (sn / maç)','oUzPen',0],
    ['Zaman geçirme: öndeki takımın duruşu, 75. dk öncesi (sn)','oZgOnce',1],
    ['Zaman geçirme: öndeki takımın duruşu, 75. dk sonrası (sn)','oZgSonra',1],
    ['Topa çarpan hakem / maç','oHakemeCarpti',2],
    /* T10b: yeni faul kaynaklarının girişimleri (çalınan faul c-beden "Faul kaynağı"), itiraz sarısı ve hakem kişiliği (sertliğe göre kırılım ozet'te) */
    ['Tutma (girişim) / maç','oTutma',2],['Elle oynama (olay) / maç','oEl',2],['Elle oynama: penaltı / maç','oElPen',2],
    ['İtiraz sarısı / maç','oItiraz',2],['Hakem: sertlik ort.','oSertlik',2],
    ['Penaltı / maç: müdahale ve kayma','oPenMud',2],['Penaltı / maç: tutma ve itme','oPenTut',2],['Penaltı / maç: hava','oPenHava',2],['Penaltı / maç: elle oynama','oPenEl',2],['Penaltı / maç: taktik ve diğer','oPenDiger',2],
    ['Sakatlık: duraklama (tedavi ya da çıkış) / maç','oSakDur',2],
    ['Sakatlık: oyundan çıkma / maç','oSakCik',2],
    ['Sakatlık: ağrı (duraklamasız) / maç','oSakAgri',2]
  ],
  yeni:()=>{
    let hkT=0,hkN=0,hk530=0,golT=null,golH=0,onceki=null,du=null;
    const faulD=[],gor={n:0,g:0},gorB=[[0,0],[0,0],[0,0]],kirmizi=[],golSantra=[],degDk=[],degSure=[],degBas=new Map(),zgOnce=[],zgSonra=[];
    let kutuHava=0,kirmiziSahada=0,uzGol=0,uzDeg=0,uzFaul=0,uzPen=0,hakemeCarpti=0,sakDur=0,sakCik=0,sakAgri=0,tutma=0,el=0,elPen=0,itiraz=0,sertlik=NaN;const pen=[0,0,0,0,0];
    const hakemUzak=(m,x,z)=>{const r=m.refs&&m.refs[0];return r?Math.hypot(r.x-x,r.z-z):NaN;};
    const gorme=(m,x,z,goruldu)=>{const d=hakemUzak(m,x,z);if(Number.isNaN(d))return;faulD.push(d);gor.n++;if(!goruldu)gor.g++;
      const b=gorB[d<15?0:d<25?1:2];b[0]++;if(!goruldu)b[1]++;};
    return{
      dinle(ad,v,m){
        if(!m)return;
        if(m.hakem&&sertlik!==sertlik)sertlik=m.hakem.sertlik;
        if(ad==='tutma')tutma++;else if(ad==='elleOynama')el++;else if(ad==='kart'&&v.neden==='itiraz')itiraz++;
        if(ad==='faul'&&v.neden==='el'&&v.penalti)elPen++;
        if(ad==='faul'&&v.penalti&&!v.avantajdan){const k=v.kaynak;pen[k==='mudahale'||k==='kayma'?0:k==='tutma'||k==='carpma'||k==='omuz'||k==='basma'?1:k==='hava'||k==='kaleci'?2:k==='el'?3:4]++;}
        if(ad==='faul'){
          if(v.avantajdan)uzFaul+=15;
          else{if(v.penalti)uzPen+=60;else uzFaul+=15+(v.kart?15:0);gorme(m,v.x,v.z,true);}}
        else if(ad==='avantaj'){const q=v.faulYiyen;if(q)gorme(m,q.x,q.z,true);}
        else if(ad==='faulGorulmedi'){if(v.kaynak==='hava'&&v.P===0.5)kutuHava++;else gorme(m,v.x,v.z,false);}
        else if(ad==='kart'){if(v.renk==='kirmizi'||v.renk==='ikinciSari')kirmizi.push({p:v.p,t:m.t});}
        else if(ad==='goal'){uzGol+=50;golT=m.t;golH=m.half;}
        else if(ad==='kickoff'){if(golT!=null&&golH===m.half)golSantra.push(m.t-golT);golT=null;}
        else if(ad==='degisiklik'){uzDeg+=30;degDk.push(m.gameSec/60);degBas.set(v.giren,m.t);}
        else if(ad==='oyuncuGirdi'){const t0=degBas.get(v.giren);if(t0!=null){degSure.push(m.t-t0);degBas.delete(v.giren);}}
        else if(ad==='hakemeCarpti')hakemeCarpti++;
        else if(ad==='sakatlik'){if(v.derece==='agri')sakAgri++;else{sakDur++;if(v.derece==='cikis')sakCik++;}}},
      adim(m){
        const ph=m.phase;
        if(ph==='play'){const r=m.refs&&m.refs[0],b=m.ball;if(r&&b){const d=Math.hypot(r.x-b.x,r.z-b.z);hkT+=d;hkN++;if(d>=5&&d<=30)hk530++;}}
        /* zaman geçirme: duruşun başında kullanan takım öndeyse kaydedilir, oyuna dönüşte süre yazılır */
        if(ph==='durus'&&onceki!=='durus'){const d=m.durus;du=null;
          if(d&&OO_TUR.has(d.tur)&&d.takim!=null&&m.score[d.takim]>m.score[1-d.takim])du={t0:m.t,sonra:m.gameSec>=OO_ZG};}
        else if(onceki==='durus'&&ph!=='durus'&&du){if(ph==='play')(du.sonra?zgSonra:zgOnce).push(m.t-du.t0);du=null;}
        onceki=ph;
        for(let i=kirmizi.length-1;i>=0;i--){const k=kirmizi[i];if(!k.p.oyunda){kirmizi.splice(i,1);continue;}
          if(m.t-k.t>12){kirmiziSahada++;kirmizi.splice(i,1);}}},
      bitir(){
        return{oHkTop:hkN?hkT/hkN:NaN,oHkFaul:ooOrt(faulD),oKutuHava:kutuHava,oKirmiziSahada:kirmiziSahada,oGolSantra:ooOrt(golSantra),
          oDegDk:ooOrt(degDk),oDegSure:ooOrt(degSure),oUzGol:uzGol,oUzDeg:uzDeg,oUzFaul:uzFaul,oUzPen:uzPen,oZgOnce:ooOrt(zgOnce),oZgSonra:ooOrt(zgSonra),
          oHakemeCarpti:hakemeCarpti,oSakDur:sakDur,oSakCik:sakCik,oSakAgri:sakAgri,oTutma:tutma,oEl:el,oElPen:elPen,oItiraz:itiraz,oSertlik:sertlik,oPenMud:pen[0],oPenTut:pen[1],oPenHava:pen[2],oPenEl:pen[3],oPenDiger:pen[4],
          ham:{oHk530:[hk530,hkN],oGorulmeyen:[gor.g,gor.n],oGor15:[gorB[0][1],gorB[0][0]],oGor25:[gorB[1][1],gorB[1][0]],oGorUzak:[gorB[2][1],gorB[2][0]]}};}};
  },
  /* T10b: hakemin sertliğine göre maç başına faul ve sarı (sert: ≥ 0,6, yumuşak: ≤ 0,4; kabul: sert hakemde ikisi de belirgin yüksek) */
  ozet(sonuclar){
    const grup=f=>sonuclar.filter(s=>typeof s.oSertlik==='number'&&f(s.oSertlik)),o=(L,k)=>L.length?L.reduce((a,s)=>a+(s[k]||0),0)/L.length:NaN,f=x=>Number.isNaN(x)?'—':x.toFixed(2);
    const S=grup(x=>x>=0.6),Y=grup(x=>x<=0.4),O=grup(x=>x>0.4&&x<0.6);
    console.log(`  Hakem sertliğine göre (maç başına): sert (≥ 0,6; ${S.length} maç) faul ${f(o(S,'faul'))} · sarı ${f(o(S,'sari'))} │ orta (${O.length}) faul ${f(o(O,'faul'))} · sarı ${f(o(O,'sari'))} │ yumuşak (≤ 0,4; ${Y.length}) faul ${f(o(Y,'faul'))} · sarı ${f(o(Y,'sari'))}`);
  }
};
