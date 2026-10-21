'use strict';
/* ============ T10-0 (2026-10-11): maç olayları ve hakem — "O:" satırları (gerçekçilik planı §4 T10) ============
   Hakemin topa uzaklığı (top oyundayken her adım; Ek G7 ölçütü ortalama 12–22 m — gerçekte 18–19 m, sürenin ~%80'i 5–30 m), faule uzaklığı
   (görülen, avantaj ve görülmeyen faul; avantajdan dönen faul ikinci kez sayılmaz), hakemin faule uzaklığına göre görülmeyen faul payı (kutuda
   verilmeyen hava faulü — olay faulGorulmedi, P 0,5, kaynak hava — görme payına girmez, ayrı sayılır), kırmızı kart (ya da ikinci sarı) gördüğü
   hâlde 12 sn sonra sahada kalan oyuncu (T10 teşhisindeki hata 1; kabul 0), gol → santra süresi (gol olayından santraya; T10 kararı 20–35 sn, S1c'den beri ~35 sn: 28–42),
   değişikliğin dakikası ve süresi (değişiklik olayından oyuncu girene), uzatmanın kaynakları (motorun birikimiyle aynı ölçek: gol 50, değişiklik 30,
   kart 30, penaltı 60 sn; U1'e dek faul 15 (+15 kart) ve avantajdan dönen faul 15), zaman geçirme göstergesi (önde olan takımın kullandığı taç, korner, kale vuruşu ve
   serbest vuruşta duruşun süresi: 75. dakikadan önce ve sonra), topa çarpan hakem, sakatlık (olay sakatlik {tur, derece: agri|tedavi|cikis};
   T10c'de türe göre kas ve kramp; uzatmaya sakatlığın eklediği hakemTopu.ek), maç boyu yorgunluk (44. ve 89. dakika) ve gollerin zamanı
   (T10c); T10d: zaman geçirme (uyarı, sarı, uzatmaya eklenen), hakem topu (kaynak, ceza sahasında kaleciye, bırakıldı mı), ofsayt (yanlış bayrak,
   görülmeyen ofsayt, yan hakemin doğru karar payı, bayrağın gecikmesi, gol iptali, görülmeyen ofsayttan gol), gerideki takımın topu ağdan alması
   ve santraya süresi. Rastlantı çekmez, maçı değiştirmez. */
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
    ['Gol → santra (sn)','oGolSantra',1,[28,42,'S1']],   /* S1c (2026-10-21): tempo B, ~35 sn (kullanıcı onaylı); T10'un 20–35'i eski hedef */
    ['Gol → santra: gerideki takım topu ağdan aldı (sn; T10d)','oGolSantraAcele',1],['Topu ağdan alan gerideki takım / maç','oAgdan',2],
    ['Değişiklik: dakika ort.','oDegDk',1],
    ['Değişiklik: süre (sn; olaydan oyuncu girene)','oDegSure',1],
    ['Değişiklik: gerideki takımın dakikası ort. (T10c)','oDegGeriDk',1],['Değişiklik: önde ya da berabereyken dakika ort.','oDegDigerDk',1],
    ['Değişiklik: gerideyken forvet giren %','oDegGeriFv',1],
    ['Uzatma kaynağı: gol (sn / maç)','oUzGol',0],
    ['Uzatma kaynağı: değişiklik (sn / maç)','oUzDeg',0],
    ['Uzatma kaynağı: kart (sn / maç; U1 — eskiden faul ve kart)','oUzFaul',0],
    ['Uzatma kaynağı: penaltı (sn / maç)','oUzPen',0],
    ['Uzatma kaynağı: sakatlık (sn / maç; T10c)','oUzSak',0],
    ['Zaman geçirme: öndeki takımın duruşu, 75. dk öncesi (sn)','oZgOnce',1],
    ['Zaman geçirme: öndeki takımın duruşu, 75. dk sonrası (sn)','oZgSonra',1],
    ['Topa çarpan hakem / maç','oHakemeCarpti',2],
    /* T10d: zaman geçirme (uyarı, sarı, uzatmaya eklenen) ve hakem topu (kaynağa göre; bırakıldı mı) */
    ['Zaman geçirme: uyarı / maç','oZgUyari',2],['Zaman geçirme: sarı / maç','oZgSari',2],['Uzatma kaynağı: zaman geçirme (sn / maç)','oUzZg',0],
    /* T10d: ofsayt — yan hakemin kararı (ofsayt olayında yanlis, ofsaytKacti), bayrağın gecikmesi, gol iptali, görülmeyen ofsayttan 8 sn içinde gol */
    ['Ofsayt: yanlış bayrak (gerçekte değil) / maç','oOfsYanlis',2],['Ofsayt: görülmeyen (bayrak kalkmadı) / maç','oOfsKacti',2],
    ['Ofsayt: yan hakemin doğru karar payı %','oOfsDogru',1],['Ofsayt: bayrağın gecikmesi ort. (sn)','oOfsGec',2],
    ['Gol iptali / maç: ofsayt','oIptalOfs',2],['Gol iptali / maç: hakeme çarpan top','oIptalHakem',2],['Görülmeyen ofsayttan gol / maç','oOfsGol',2],
    /* T10e: güven (ortalama; etkisi duyarlılık karşılaştırmasıyla ölçülür: guvenEtki, guvenRisk, evGuven 0), ev sahibi eğilimi (faul ve sarı ev/deplasman), ısınan yedekler */
    ['Güven ort.: ev sahibi','oGvEv',3],['Güven ort.: deplasman','oGvDep',3],
    ['Faul: ev sahibi / maç','oFaulEv',2],['Faul: deplasman / maç','oFaulDep',2],['Sarı: ev sahibi / maç','oSariEv',2],['Sarı: deplasman / maç','oSariDep',2],
    ['Isınan yedek / maç (takım başına)','oIsinma',2],['Değişiklik: ısınandan giren %','oIsinanGiren',1],
    ['Hakem topu / maç: sakatlık','oHtSak',2],['Hakem topu / maç: hakeme çarpan top','oHtHakem',2],['Hakem topu: ceza sahasında kaleciye %','oHtKutu',1],['Hakem topu: bırakıldı %','oHtBirak',1],
    /* T10b: yeni faul kaynaklarının girişimleri (çalınan faul c-beden "Faul kaynağı"), itiraz sarısı ve hakem kişiliği (sertliğe göre kırılım ozet'te) */
    ['Tutma (girişim) / maç','oTutma',2],['Elle oynama (olay) / maç','oEl',2],['Elle oynama: penaltı / maç','oElPen',2],
    ['İtiraz sarısı / maç','oItiraz',2],['Hakem: sertlik ort.','oSertlik',2],
    ['Penaltı / maç: müdahale ve kayma','oPenMud',2],['Penaltı / maç: tutma ve itme','oPenTut',2],['Penaltı / maç: hava','oPenHava',2],['Penaltı / maç: elle oynama','oPenEl',2],['Penaltı / maç: taktik ve diğer','oPenDiger',2],
    ['Sakatlık: duraklama (tedavi ya da çıkış) / maç','oSakDur',2],
    ['Sakatlık: oyundan çıkma / maç','oSakCik',2],
    ['Sakatlık: ağrı (duraklamasız) / maç','oSakAgri',2],
    ['Sakatlık: kas / maç','oSakKas',2],['Sakatlık: kramp / maç','oSakKramp',2],
    /* T10c: maç boyu yorgunluk (sahadaki saha oyuncuları; 44. ve 89. dakika) ve gollerin zamanı (gerçek: 1–15 ~%13, 76–90+ ~%22, ikinci yarı ~%55) */
    ['Yorgunluk ort. 44. dk','oYorg45',3],['Yorgunluk ort. 89. dk','oYorg90',3],
    ['Gol dakikası: 1–15 payı %','oGolIlk15',1],['Gol dakikası: 76–90+ payı %','oGolSon15',1],['Gol: ikinci yarı payı % (gerçek ~55)','oGolIkinci',1]
  ],
  yeni:()=>{
    let hkT=0,hkN=0,hk530=0,golT=null,golH=0,onceki=null,du=null;
    let sonM=null;const gvT=[0,0,0],ofsGec=[],kactiT=[-99,-99],faulD=[],gor={n:0,g:0},gorB=[[0,0],[0,0],[0,0]],kirmizi=[],golSantra=[],golSantraAcele=[],degDk=[],degGeriDk=[],degDigerDk=[],degGeriFv=[0,0],degSure=[],degBas=new Map(),zgOnce=[],zgSonra=[];
    let kutuHava=0,kirmiziSahada=0,uzGol=0,uzDeg=0,uzFaul=0,uzPen=0,uzSak=0,sakKas=0,sakKramp=0,yorg45=NaN,yorg90=NaN,golN=0,golIlk=0,golSon=0,golIki=0,zgUyari=0,zgSari=0,agdan=0,golAcele=false,ofsYanlis=0,ofsKacti=0,ofsN=0,iptalOfs=0,iptalHakem=0,ofsGol=0,isinma=0,girenIsinan=0,girenN=0,uzZg=0,htSak=0,htHakem=0,htKutu=0,htBirak=0,hakemeCarpti=0,sakDur=0,sakCik=0,sakAgri=0,tutma=0,el=0,elPen=0,itiraz=0,sertlik=NaN;const pen=[0,0,0,0,0];
    const hakemUzak=(m,x,z)=>{const r=m.refs&&m.refs[0];return r?Math.hypot(r.x-x,r.z-z):NaN;};
    const gorme=(m,x,z,goruldu)=>{const d=hakemUzak(m,x,z);if(Number.isNaN(d))return;faulD.push(d);gor.n++;if(!goruldu)gor.g++;
      const b=gorB[d<15?0:d<25?1:2];b[0]++;if(!goruldu)b[1]++;};
    return{
      dinle(ad,v,m){
        if(!m)return;
        if(m.hakem&&sertlik!==sertlik)sertlik=m.hakem.sertlik;
        if(ad==='tutma')tutma++;else if(ad==='elleOynama')el++;else if(ad==='kart'&&v.neden==='itiraz')itiraz++;else if(ad==='kart'&&v.neden==='zaman')zgSari++;
        if(ad==='faul'&&v.neden==='el'&&v.penalti)elPen++;
        if(ad==='faul'&&v.penalti&&!v.avantajdan){const k=v.kaynak;pen[k==='mudahale'||k==='kayma'?0:k==='tutma'||k==='carpma'||k==='omuz'||k==='basma'?1:k==='hava'||k==='kaleci'?2:k==='el'?3:4]++;}
        /* U1 (2026-10-12): uzatmaya penaltı 60 ve kart 30 girer, sıradan faul girmez (motorla aynı ölçek; eskiden faul 15 + kart 15) */
        if(ad==='faul'){if(!v.avantajdan){if(v.penalti)uzPen+=60;gorme(m,v.x,v.z,true);}}
        else if(ad==='avantaj'){const q=v.faulYiyen;if(q)gorme(m,q.x,q.z,true);}
        else if(ad==='faulGorulmedi'){if(v.kaynak==='hava'&&v.P===0.5)kutuHava++;else gorme(m,v.x,v.z,false);}
        else if(ad==='kart'){uzFaul+=30;if(v.renk==='kirmizi'||v.renk==='ikinciSari')kirmizi.push({p:v.p,t:v.sahne?null:m.t});}
        /* S1d (2026-10-20): sahneli kartta 12 sn kartın sahnesinin kuruluşundan (olay kartSahne evre 'karar'; kuyrukta ikinci kart ilki bitince başlar) */
        else if(ad==='kartSahne'&&v.evre==='karar'&&v.renk!=='sari'){const k=kirmizi.find(x=>x.p===v.p&&x.t==null);if(k)k.t=m.t;}
        else if(ad==='goal'){if(m.t-kactiT[v.team]<8)ofsGol++;uzGol+=50;golT=m.t;golH=m.half;golN++;if(m.half===2)golIki++;if(m.gameSec<900)golIlk++;else if(m.half===2&&m.gameSec>=4500)golSon++;}
        else if(ad==='hakemTopu'){uzSak+=v.ek||0;if(v.neden==='hakem')htHakem++;else htSak++;if(v.kutu)htKutu++;}
        else if(ad==='hakemTopuBirak')htBirak++;
        else if(ad==='zamanGecirme')uzZg+=v.uz;   /* U1: motorun eklediği (maç saati sn; eskiden elle 9 ile çevriliyordu) */
        else if(ad==='uyari'&&v.neden==='zaman')zgUyari++;
        else if(ad==='kickoff'){if(golT!=null&&golH===m.half)(golAcele?golSantraAcele:golSantra).push(m.t-golT);golT=null;golAcele=false;}
        else if(ad==='topuAgdanAldi'){agdan++;golAcele=true;}
        else if(ad==='isinma')isinma++;
        else if(ad==='ofsayt'){ofsN++;if(v.yanlis)ofsYanlis++;if(v.gecikme)ofsGec.push(v.gecikme);}
        else if(ad==='ofsaytKacti'){ofsKacti++;if(v.p)kactiT[v.p.team]=m.t;}
        else if(ad==='golIptal'){if(v.neden==='ofsayt')iptalOfs++;else iptalHakem++;}
        else if(ad==='degisiklik'){uzDeg+=30;degDk.push(m.gameSec/60);degBas.set(v.giren,m.t);
          if(!v.sakatlik){if(v.skor==='geri'){degGeriDk.push(m.gameSec/60);degGeriFv[1]++;if(v.giren&&v.giren.rol==='FV')degGeriFv[0]++;}else degDigerDk.push(m.gameSec/60);}}
        else if(ad==='oyuncuGirdi'){const t0=degBas.get(v.giren);if(t0!=null){degSure.push(m.t-t0);degBas.delete(v.giren);}if(v.giren){girenN++;if(v.isindi)girenIsinan++;}}
        else if(ad==='hakemeCarpti')hakemeCarpti++;
        else if(ad==='sakatlik'){if(v.derece==='agri')sakAgri++;else{sakDur++;if(v.derece==='cikis')sakCik++;}if(v.tur==='kas')sakKas++;else if(v.tur==='kramp')sakKramp++;}},
      adim(m){
        const ph=m.phase;sonM=m;
        if(m.guven&&(ph==='play'||ph==='durus')){const ev=m.evSahibi||0;gvT[0]+=m.guven[ev];gvT[1]+=m.guven[1-ev];gvT[2]++;}
        if(ph==='play'&&(m.half===1?yorg45!==yorg45&&m.gameSec>=2640:yorg90!==yorg90&&m.gameSec>=5340)){
          const L=m.players.filter(p=>p.oyunda&&p.rol!=='GK'),y=L.reduce((a,p)=>a+(p.yorgunluk||0),0)/(L.length||1);if(m.half===1)yorg45=y;else yorg90=y;}
        if(ph==='play'){const r=m.refs&&m.refs[0],b=m.ball;if(r&&b){const d=Math.hypot(r.x-b.x,r.z-b.z);hkT+=d;hkN++;if(d>=5&&d<=30)hk530++;}}
        /* zaman geçirme: duruşun başında kullanan takım öndeyse kaydedilir, oyuna dönüşte süre yazılır */
        if(ph==='durus'&&onceki!=='durus'){const d=m.durus;du=null;
          if(d&&OO_TUR.has(d.tur)&&d.takim!=null&&m.score[d.takim]>m.score[1-d.takim])du={t0:m.t,sonra:m.gameSec>=OO_ZG};}
        else if(onceki==='durus'&&ph!=='durus'&&du){if(ph==='play')(du.sonra?zgSonra:zgOnce).push(m.t-du.t0);du=null;}
        onceki=ph;
        for(let i=kirmizi.length-1;i>=0;i--){const k=kirmizi[i];if(!k.p.oyunda){kirmizi.splice(i,1);continue;}
          if(k.t!=null&&m.t-k.t>12){kirmiziSahada++;kirmizi.splice(i,1);}}},
      bitir(){
        return{oHkTop:hkN?hkT/hkN:NaN,oHkFaul:ooOrt(faulD),oKutuHava:kutuHava,oKirmiziSahada:kirmiziSahada,oGolSantra:ooOrt(golSantra),oGolSantraAcele:ooOrt(golSantraAcele),oAgdan:agdan,
          oDegDk:ooOrt(degDk),oDegGeriDk:ooOrt(degGeriDk),oDegDigerDk:ooOrt(degDigerDk),oDegSure:ooOrt(degSure),oUzGol:uzGol,oUzDeg:uzDeg,oUzFaul:uzFaul,oUzPen:uzPen,oUzSak:uzSak,oZgUyari:zgUyari,oZgSari:zgSari,oFaulEv:sonM?sonM.ist.faul[sonM.evSahibi||0]:NaN,oFaulDep:sonM?sonM.ist.faul[1-(sonM.evSahibi||0)]:NaN,oSariEv:sonM?sonM.ist.sari[sonM.evSahibi||0]:NaN,oSariDep:sonM?sonM.ist.sari[1-(sonM.evSahibi||0)]:NaN,oGvEv:gvT[2]?gvT[0]/gvT[2]:NaN,oGvDep:gvT[2]?gvT[1]/gvT[2]:NaN,oIsinma:isinma/2,oOfsYanlis:ofsYanlis,oOfsKacti:ofsKacti,oOfsGec:ooOrt(ofsGec),oIptalOfs:iptalOfs,oIptalHakem:iptalHakem,oOfsGol:ofsGol,oUzZg:uzZg,oHtSak:htSak,oHtHakem:htHakem,oSakKas:sakKas,oSakKramp:sakKramp,oYorg45:yorg45,oYorg90:yorg90,oZgOnce:ooOrt(zgOnce),oZgSonra:ooOrt(zgSonra),
          oHakemeCarpti:hakemeCarpti,oSakDur:sakDur,oSakCik:sakCik,oSakAgri:sakAgri,oTutma:tutma,oEl:el,oElPen:elPen,oItiraz:itiraz,oSertlik:sertlik,oPenMud:pen[0],oPenTut:pen[1],oPenHava:pen[2],oPenEl:pen[3],oPenDiger:pen[4],
          ham:{oIsinanGiren:[girenIsinan,girenN],oOfsDogru:[ofsN-ofsYanlis,ofsN+ofsKacti],oHtKutu:[htKutu,htSak+htHakem],oHtBirak:[htBirak,htSak+htHakem],oDegGeriFv:degGeriFv,oGolIlk15:[golIlk,golN],oGolSon15:[golSon,golN],oGolIkinci:[golIki,golN],oHk530:[hk530,hkN],oGorulmeyen:[gor.g,gor.n],oGor15:[gorB[0][1],gorB[0][0]],oGor25:[gorB[1][1],gorB[1][0]],oGorUzak:[gorB[2][1],gorB[2][0]]}};}};
  },
  /* T10b: hakemin sertliğine göre maç başına faul ve sarı (sert: ≥ 0,6, yumuşak: ≤ 0,4; kabul: sert hakemde ikisi de belirgin yüksek) */
  ozet(sonuclar){
    const grup=f=>sonuclar.filter(s=>typeof s.oSertlik==='number'&&f(s.oSertlik)),o=(L,k)=>L.length?L.reduce((a,s)=>a+(s[k]||0),0)/L.length:NaN,f=x=>Number.isNaN(x)?'—':x.toFixed(2);
    const S=grup(x=>x>=0.6),Y=grup(x=>x<=0.4),O=grup(x=>x>0.4&&x<0.6);
    console.log(`  Hakem sertliğine göre (maç başına): sert (≥ 0,6; ${S.length} maç) faul ${f(o(S,'faul'))} · sarı ${f(o(S,'sari'))} │ orta (${O.length}) faul ${f(o(O,'faul'))} · sarı ${f(o(O,'sari'))} │ yumuşak (≤ 0,4; ${Y.length}) faul ${f(o(Y,'faul'))} · sarı ${f(o(Y,'sari'))}`);
  }
};
