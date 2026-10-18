'use strict';
/* ============ Duran top ölçümü (T8-0, 2026-10-11; gerçekçilik planı §4 T8 "Alt adımlar") ============
   r-karne.js, s-sut.js ile aynı sözleşme: rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top, oyuncu, duruş ve
   istatistik alanlarını okur. Oranlar bütün maçların toplamından (ham), sayılar maç başına, ortancalar maç başına ortancanın ortalamasıdır.
   Kullanım anı motorun 'kullanim' olayıdır (js/mac-durantop.js; kullananın topa ilk dokunuşu: vuruş, taç atışı, sürüş ya da kalecinin topu eline
   alması), duruşun başı değil. Tanımlar:
   - Hazırlık: duruşun başından kullanıma (sn). Tehlikeli duran top (korner, barajlı ve kenar serbest vuruşu) 10–14 sn (§7 madde 5); taç 3–6, kale
     vuruşu 4–8, diğer serbest vuruş 3–6, penaltı 8–12 (T8a kararı; T10g'de kale vuruşu 4–10, diğer serbest vuruş 3–8 — gerçekte bu duruşlar taçtan
     uzun sürer, kornerin sıkıştırmasıyla: gerçekçilik planı “T10 — Sonuç”). Zorla: 28 sn'lik güvenlik ağıyla kullanılan.
   - Serbest vuruş sınıfı: barajlı (duruşta baraj kuruldu), kenar (barajsız, kaleye 35 m'den yakın ve kale ortasından 12 m'den yanda), uzak
     (barajsız, rakip yarı), geri (kendi yarısı).
   - Korner: kullanımda ceza sahasındaki hücumcu ve savunmacı (kaleci ve kullanan hariç), geride kalan (kendi yarısında) hücumcu ve hız özelliği
     farkı (r-karne ile aynı), iniş (top 2,6 m'nin altına inerken) anında iki takımdan 1,5 m içinde oyuncu, hava düellosu (m.ist.havaTopu arttı),
     ilk temas (kullanımdan sonra 4 sn içinde; kısa korner hariç): hücumun kafası, savunmanın kafası, kaleci (tutuş, yumruk, kurtarış), hücum ya da
     savunma ayağı/gövdesi, yere düştü, oyun dışı, yok; 8 sn içinde şut ve gol (atan takım). Kaynak: korner duruşu başlarken topa son dokunan
     savunmacının son 4 sn'deki olayı (kafa, uzaklaştırma, blok/sekme, kaleci kurtarışı, yumruk, kontrol, pas, şut).
   - Barajlı doğrudan serbest vuruş (alt 'sut'): çerçeveye giden, gol (vuruştan 5 sn içinde atan takımın golü), barajdan dönen (barajdaki oyuncunun
     bloğu 1 sn içinde), baraj sıçradı (vuruştan 0,5 sn içinde barajdakilerden birinin sıçraması, p.zipla), topun duran toptan 9,15 m uzaklıktaki
     yüksekliği.
   - Taç ve kale vuruşu: atan takım topu aldı (kullanımdan sonra ilk sahip ya da taşıyan; taçta 3, kale vuruşunda 6 sn içinde); kale vuruşu yerden
     (kaleci topu eline almadan vurdu; T8-0'a kadar kaleci topu hep eline alıyordu); uzun kale vuruşunda hava düellosu (4 sn).
   - Penaltı: gol (5 sn içinde), ribaund koşucusu (vuruşta ceza sahası dışında olup 1 sn sonra içinde olan hücumcu). */
const K_PL=52.5,K_MZ=34,K_CU=16.5,K_CW=20.16;
const K_TUR=['korner','serbest','tac','kaleVurusu','penalti'],K_TUR_AD={korner:'korner',serbest:'serbest vuruş',tac:'taç',kaleVurusu:'kale vuruşu',penalti:'penaltı'};
const K_HZ=[['korner','korner',[10,14,'T8']],['baraj','barajlı serbest vuruş',[10,14,'T8']],['kenar','kenar serbest vuruşu',[10,14,'T8']],
  ['serbest','diğer serbest vuruş',[3,8,'T10']],['tac','taç',[3,6,'T8']],['kaleVurusu','kale vuruşu',[4,10,'T10']],['penalti','penaltı',[8,12,'T8']]];
const K_ILK=['hucumKafa','savunmaKafa','kaleci','hucumAyak','savunmaAyak','yere','disari','yok'];
const K_ILK_AD={hucumKafa:'hücumun kafası',savunmaKafa:'savunmanın kafası',kaleci:'kaleci',hucumAyak:'hücum (ayak, gövde)',savunmaAyak:'savunma (ayak, gövde)',
  yere:'yere düştü',disari:'oyun dışı',yok:'4 sn içinde yok'};
const K_KAYNAK=['kafa','uzaklastirma','blok','blokOrta','kaleci','yumruk','kontrol','pas','sut','diger'];
const K_KAYNAK_AD={kafa:'savunmanın kafası',uzaklastirma:'uzaklaştırma',blok:'şut bloğu ve sekme',blokOrta:'orta bloğu (T17)',kaleci:'kaleci kurtarışı',yumruk:'kalecinin yumruğu',
  kontrol:'kontrol',pas:'pas ve orta',sut:'kendi şutu (hücum)',diger:'diğer'};
const K_BOLGE=['on','arka','orta','nokta','disari'],K_BOLGE_AD={on:'ön direk',arka:'arka direk',orta:'altıpas ortası',nokta:'penaltı noktası',disari:'ceza sahası kenarı'};
const K_SINIF=['baraj','kenar','uzak','geri'],K_SINIF_AD={baraj:'barajlı',kenar:'kenar',uzak:'uzak',geri:'kendi yarısı'};
/* T24-0 (2026-10-18; T24 planı, ölçüm 7): barajlı serbest vuruşun maç içi mesafe dağılımı — kale ortasına uzaklık dilimleri (d-duran hücreleri:
   merkez 18 / 22 / 26 / 30 m birer dilimde; yarı 18 / 22 / 26 → 20,6 / 24,2 / 27,9 m). Dilim başına barajlı vuruş / maç, doğrudan şut kararı
   (kullanımın türü 'sut'; kSA_baraj_sut ile aynı) ve doğrudan şutta gol / şut (kBGol ile aynı: atan takımın şutu, 5 sn içinde gol). ozet():
   kale çizgisine u × yana w ızgarası (vuruş / şut / gol; d-duran hücrelerini maç içi dağılımla ağırlıklandırmak için) */
const K_BLAD=['< 20 m','20–24 m','24–28 m','≥ 28 m'],kBin=L=>L<20?0:L<24?1:L<28?2:3;
const kOrtanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
module.exports={
  bilgi:[['— Duran toplar (k-duran; T8) —',null,0]]
    .concat(K_TUR.map(k=>['Kullanım / maç: '+K_TUR_AD[k],'kN_'+k,2]))
    .concat(K_HZ.map(([k,ad,h])=>['Hazırlık ortancası (sn): '+ad,'kH_'+k,1,h]))
    .concat([['Zorla kullanım (28 sn) / maç','kZorla',2],['Tehlikeli duran topta görevliler yerinde %','kYerinde',1,[80,null,'T8']]])
    .concat([['Korner: kısa %','kK_kisa',1],['Korner: içe dönen %','kK_ice',1],['Korner: dışa dönen %','kK_disa',1],
      ['Korner: yaya geri pas % (A4-2)','kK_geri',1],['Korner: perdeleme % (A4-2)','kKPerde',1]])
    .concat(K_BOLGE.map(k=>['Korner hedefi: '+K_BOLGE_AD[k]+' %','kKB_'+k,1]))
    .concat([['Korner: kullanımda kutudaki hücumcu','kKKutuH',1,[4,7,'T8']],['Korner: kullanımda kutudaki savunmacı','kKKutuS',1],
      ['Korner: geride kalan hücumcu','kKGeri',1],['Korner: geride kalanların hızı − takım (özellik)','kKGeriHiz',2,[0,null,'T8']],
      ['Korner: inişte iki takımdan 1,5 m içinde %','kKInis',1,[50,null,'T8']],['Korner: hava düellosu %','kKHava',1]])
    .concat(K_ILK.map(k=>['Korner ilk temas: '+K_ILK_AD[k]+' %','kKI_'+k,1]))
    .concat([['Korner: 8 sn içinde şut / korner','kKSut',2],['Korner: 8 sn içinde gol %','kKGol',1,[3,5,'T8']]])
    .concat(K_KAYNAK.map(k=>['Korner kaynağı: '+K_KAYNAK_AD[k]+' %','kKK_'+k,1]))
    /* T17-0 (2026-10-16): ikinci evre, ilk kafanın bloğu, pencere ve orta kaynaklı korner (gerçekçilik planı §4 T17) */
    .concat([['Korner (T17): 8 sn içinde şut olan korner %','kKSutP',1],['Korner (T17): kornerden gelen gol / bütün goller %','kKGolPay',1],
      ['Korner (T17): ilk kafa savunmaca bloklandı / hücumun ilk kafası %','kHKBlok',1],['Korner (T17): savunma bloğundan sonra 8 sn içinde gol %','kBlokGol',1],
      ['Korner (T17): bloklayan rolü adam %','kBR_adam',1],['Korner (T17): bloklayan rolü bölge %','kBR_bolge',1],['Korner (T17): bloklayan rolü direk %','kBR_direk',1],['Korner (T17): bloklayan rolü diğer %','kBR_diger',1],
      ['Korner (T17): bloktaki erişim ayak %','kBE_ayak',1],['Korner (T17): bloktaki erişim göğüs %','kBE_gogus',1],['Korner (T17): bloktaki erişim üst (kafa, gövde) %','kBE_ust',1],
      ['Korner (T17): bloklayan havada %','kBHava',1],['Korner (T17): bloklayanın kafa noktasına uzaklığı ortancası (m)','kBD',2],
      ['Korner (T17): ilk kafada kutuda savunmacı','kHKSav',1],['Korner (T17): ilk kafada kutuda hücumcu','kHKHuc',1],
      ['Korner (T17): ilk kafadan 1,5 sn sonra kutuda savunmacı','kEvSav',1],['Korner (T17): ilk kafadan 1,5 sn sonra kutuda hücumcu','kEvHuc',1],
      ['Korner (T17): 1,5 sn sonra markajlı (1,5 m) hücumcu %','kEvMarkaj',1],['Korner (T17): 1,5 sn sonra görev penceresi açık %','kEvAcik',1],
      ['Korner (T17): pencerenin bitişi şut %','kBit_sut',1],['Korner (T17): pencerenin bitişi 28 m %','kBit_m28',1],['Korner (T17): pencerenin bitişi sahiplik 0,8 sn %','kBit_sahip',1],
      ['Korner (T17): pencerenin bitişi süre %','kBit_sure',1],['Korner (T17): pencerenin bitişi duruş %','kBit_durus',1],['Korner (T17): pencerenin bitişi diğer %','kBit_diger',1],
      ['Korner (T17): pencere kapandıktan sonra 8 sn içinde gol %','kBitGol',1],['Korner (T17): orta bloğundan korner / maç','kKOrtaMac',2]])
    .concat(K_SINIF.map(k=>['Serbest vuruş / maç: '+K_SINIF_AD[k],'kS_'+k,2]))
    .concat([['Barajlı serbest vuruş: doğrudan şut %','kSA_baraj_sut',1],['Kenar serbest vuruşu: orta %','kSA_kenar_orta',1],
      ['Kenar serbest vuruşu: doğrudan şut %','kSA_kenar_sut',1,[null,15,'T8']],['Uzak serbest vuruşu: uzun top ve orta %','kSA_uzak_uzun',1],
      ['Serbest vuruş (barajsız): hızlı kullanım (< 4 sn) %','kSHizli',1],
      ['Kenar serbest vuruşu: kullanımda kutudaki hücumcu','kSKenarKutu',1,[4,6,'T8']],
      ['Barajlı serbest vuruş: barajdaki kişi','kBKisi',1],['Barajlı doğrudan şut: çerçeveye giden %','kBCerceve',1],
      ['Barajlı doğrudan şut: gol / şut %','kBGol',1,[6,10,'T8']],['Barajlı doğrudan şut: barajdan dönen %','kBBlok',1],
      ['Barajlı doğrudan şut: baraj sıçradı %','kBZipla',1],['Barajlı serbest vuruş: topun başında iki kişi % (A4-1)','kBIkili',1],
      ['Barajlı doğrudan şut: aldatma koşusuyla % (A4-1)','kBAldatma',1],['Barajlı doğrudan şut (aldatmalı): gol / şut %','kBGolAld',1],['Barajlı doğrudan şut: top 9,15 m\'de yükseklik ortancası (m)','kBYuk',2],
      ['Taç: uzun (≥ 18 m) %','kT_uzun',1],['Taç: hızlı (< 4 sn) %','kT_hizli',1],['Taç: atan takım topu aldı %','kT_tut',1],
      ['Kale vuruşu: yerden (ayakla) %','kKV_yerden',1,[99,null,'T8']],['Kale vuruşu: uzun %','kKV_uzun',1],['Kale vuruşu: atan takım topu aldı %','kKV_tut',1],
      ['Kale vuruşu (uzun): hava düellosu %','kKV_duello',1],
      ['Penaltı: gol %','kP_gol',1],['Penaltı: ribaund koşucusu (ort.)','kP_rib',2]])
    .concat(K_BLAD.flatMap((a,i)=>[['Barajlı serbest vuruş / maç (T24-0): '+a,'kBL_'+i,2],['Barajlı serbest vuruş (T24-0): '+a+' doğrudan şut %','kBLS_'+i,1],
      ['Barajlı doğrudan şut (T24-0): '+a+' gol / şut %','kBLG_'+i,1]])),
  yeni:()=>{
    const hyp=Math.hypot,ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN;
    const kutuda=(m,p,t)=>{const gx=m.dir[t]*K_PL;return Math.abs(p.x-gx)<K_CU&&Math.abs(p.z-K_MZ)<K_CW;};
    const N={},HZ={};for(const k of K_TUR)N[k]=0;for(const [k] of K_HZ)HZ[k]=[];
    const say=a=>{const o={};for(const k of a)o[k]=0;return o;};
    const kAlt=say(['kisa','ice','disa','duz','geri']),kBol=say(K_BOLGE),kIlk=say(K_ILK),kKay=say(K_KAYNAK),sS=say(K_SINIF);
    let zorla=0,yerinde=0,tehlike=0,kInis=[0,0],kHava=[0,0],kGol=[0,0],kPerde=[0,0];const kSutL=[],kKutuH=[],kKutuS=[],kGeri=[],kGeriHiz=[];
    const sA={baraj:[0,0],kenarOrta:[0,0],kenarSut:[0,0],uzak:[0,0]};let sHizli=[0,0];const sKenarKutu=[],bKisi=[],bYuk=[],_baraj=[];
    let bCer=[0,0],bGol=[0,0],bBlok=[0,0],bZip=[0,0],bIk=[0,0],bAld=[0,0],bGolAld=[0,0],tUzun=[0,0],tHizli=[0,0],tTut=[0,0],kvYer=[0,0],kvUzun=[0,0],kvTut=[0,0],kvDue=[0,0],pGol=[0,0];const pRib=[];
    const bL=[0,0,0,0],bLS=[[0,0],[0,0],[0,0],[0,0]],bLG=[[0,0],[0,0],[0,0],[0,0]],bYer=[];   /* T24-0 */
    let K=null,S=null,T=null,V=null,P=null,sonOlay=null;   /* izleyiciler: korner, serbest (doğrudan şut), taç, kale vuruşu, penaltı */
    /* T17-0: ilk kafanın bloğu (geometri bir önceki adımın top yerinden), ikinci evre (ilk kafadan 1,5 sn sonra), görev penceresinin bitiş
       nedeni (motorun duranSonrasiAdim sırasıyla: duruş, süre, 28 m, sahiplik, şut; süre MAC_DENEME_AYAR'dan ya da 6), kapanıştan sonra gol */
    let dsSon=null,dsBit=null,B2=null,golN=0,kornerGolN=0,kOrtaKorner=0;const onceki={x:0,z:0,y:0};
    const kHK=[0,0],kBlokGol=[0,0],kBlokRol=say(['adam','bolge','direk','diger']),kBlokEr=say(['ayak','gogus','ust']),kBlokHava=[0,0],kBlokD=[],kHKSav=[],kHKHuc=[],kEvSav=[],kEvHuc=[],kEvMarkaj=[0,0],kEvAcik=[0,0],kBit=say(['sut','m28','sahip','sure','durus','diger']),kBitGol=[0,0],kSutP=[0,0];
    const ROL_SURE=(()=>{try{const a=JSON.parse(process.env.MAC_DENEME_AYAR||'{}');if(a.duranRolSure!=null)return a.duranRolSure;}catch(e){}return 6;})();
    const KAY={header:'kafa',clear:'uzaklastirma',block:'blok',sekme:'blok',save:'kaleci',parmak:'kaleci',yumruk:'yumruk',ilkDokunus:'kontrol',kotuKontrol:'kontrol',
      pass:'pas',cross:'pas',shot:'sut',blockOrta:'blokOrta'};
    const kIlkYaz=k=>{if(K&&K.izle&&!K.ilk){K.ilk=k;kIlk[k]++;}};
    return{
      dinle(ad,v,m){if(!m)return;
        if(v&&v.p&&KAY[ad])sonOlay={ad:ad==='block'&&v.orta?'blockOrta':ad,p:v.p,t:m.t};
        if(ad==='goal'){golN++;if(K&&m.t-K.t0<=8&&v.team===K.att)kornerGolN++;
          if(B2&&v.team===B2.att&&m.t-B2.t<=8&&!B2.gol){B2.gol=true;kBlokGol[0]++;}
          if(dsBit&&v.team===dsBit.takim&&m.t-dsBit.t<=8&&!dsBit.gol){dsBit.gol=true;kBitGol[0]++;}}
        if(ad==='korner'){const b=m.ball,s=b.sonDokunan;let k='diger';
          if(s&&sonOlay&&sonOlay.p===s&&m.t-sonOlay.t<4)k=KAY[sonOlay.ad]||'diger';kKay[k]++;if(k==='blokOrta')kOrtaKorner++;return;}
        if(ad==='kullanim'){const tur=v.tur;if(!N.hasOwnProperty(tur))return;if(tur==='serbest'&&v.du&&v.du.hakemTopu)return;   /* T10d: hakem topu ayrı (o-olay) */
          N[tur]++;const p=v.p,t=v.takim,d=m.dir[t],du=v.du,hz=v.hazirlik;
          if(hz>=27.9)zorla++;
          const u=v.x*d,dz=Math.abs(v.z-K_MZ),sinif=tur!=='serbest'?null:du&&du.baraj?'baraj':u<=0?'geri':u>K_PL-35&&dz>12?'kenar':'uzak';
          const hk=tur==='serbest'?(sinif==='baraj'||sinif==='kenar'?sinif:'serbest'):tur;if(HZ[hk]&&!(du&&(du.zgEk>0||du.sakatBekledi)))HZ[hk].push(hz);   /* T10d: zaman geçirilen ve sakatlık tedavisini bekleyen duruş hazırlığa girmez (o-olay) */
          if(du&&du.yerinde!==undefined&&(tur==='korner'||sinif==='baraj'||sinif==='kenar')){tehlike++;if(du.yerinde)yerinde++;}
          if(tur==='korner'){if(kAlt[v.alt]!=null)kAlt[v.alt]++;if(v.bolge&&kBol[v.bolge]!=null)kBol[v.bolge]++;
            kPerde[1]++;if(du&&du.gorev){for(const g of du.gorev.values())if(g.rol==='perdeAdam'){kPerde[0]++;break;}}   /* A4-2 */
            const A=m.teams[t].filter(q=>q.oyunda&&q.rol!=='GK'&&q!==p),D=m.teams[1-t].filter(q=>q.oyunda&&q.rol!=='GK');
            kKutuH.push(A.filter(q=>kutuda(m,q,t)).length);kKutuS.push(D.filter(q=>kutuda(m,q,t)).length);
            const geri=A.filter(q=>q.x*d<0);kGeri.push(geri.length);if(geri.length)kGeriHiz.push(ort(geri.map(q=>q.oz.hiz))-ort(A.map(q=>q.oz.hiz)));
            K={t0:m.t,att:t,g0:m.score[t],sut:0,izle:v.alt!=='kisa'&&v.alt!=='geri',ilk:null,inis:false,hava0:m.ist.havaTopu,havaSay:false,inen:false};kGol[1]++;
            if(K.izle){kHava[1]++;}}
          else if(tur==='serbest'){sS[sinif]++;
            if(sinif==='baraj'){sA.baraj[1]++;if(v.alt==='sut')sA.baraj[0]++;const n=v.barajdakiler?v.barajdakiler.length:0;bKisi.push(n);bIk[1]++;if(du&&du.ikili)bIk[0]++;   /* A4-1 */
              const bLen=hyp(d*K_PL-v.x,K_MZ-v.z),bi=kBin(bLen),yer={u:K_PL-v.x*d,w:Math.abs(v.z-K_MZ),s:v.alt==='sut'?1:0,ss:0,g:0};_baraj.push([Math.round(bLen*10)/10,n]);
              bL[bi]++;bLS[bi][1]++;if(v.alt==='sut')bLS[bi][0]++;bYer.push(yer);   /* T24-0 */
              if(v.alt==='sut')S={t0:m.t,att:t,x:v.x,z:v.z,B:v.barajdakiler||[],sut:false,zip:false,yuk:null,blok:false,gol:false,ald:!!(du&&du.aldatma),bi,yer};}
            else{sHizli[1]++;if(hz<4)sHizli[0]++;
              if(sinif==='kenar'){sA.kenarOrta[1]++;sA.kenarSut[1]++;if(v.alt==='orta')sA.kenarOrta[0]++;if(v.alt==='sut')sA.kenarSut[0]++;
                sKenarKutu.push(m.teams[t].filter(q=>q.oyunda&&q.rol!=='GK'&&q!==p&&kutuda(m,q,t)).length);}
              else if(sinif==='uzak'){sA.uzak[1]++;if(v.alt==='uzun'||v.alt==='orta')sA.uzak[0]++;}}}
          else if(tur==='tac'){tUzun[1]++;if(v.alt==='uzun')tUzun[0]++;tHizli[1]++;if(hz<4)tHizli[0]++;T={t0:m.t,att:t};}
          else if(tur==='kaleVurusu'){kvYer[1]++;if(v.alt!=='elle'){kvYer[0]++;kvUzun[1]++;if(v.alt==='uzun')kvUzun[0]++;V={t0:m.t,att:t,uzun:v.alt==='uzun',hava0:m.ist.havaTopu};}}
          else if(tur==='penalti'){pGol[1]++;const A=m.teams[t].filter(q=>q.oyunda&&q.rol!=='GK'&&q!==p&&!kutuda(m,q,t));P={t0:m.t,att:t,g0:m.score[t],A,rib:false};}
          return;}
        /* korner: ilk temas ve şut */
        if(K&&m.t-K.t0<8){
          if((ad==='shot'||ad==='header'&&v&&v.shot)&&v.p&&v.p.team===K.att)K.sut++;
          if(K.izle&&!K.ilk&&v&&v.p){const h=v.p.team===K.att;
            if(ad==='header'){kIlkYaz(h?'hucumKafa':'savunmaKafa');
              /* T17-0: hücumun ilk kafası — savunmacıların görev rolleri (bir kare sonra silinir), kutudakiler */
              if(h&&K.ilk==='hucumKafa'&&!K.hk){const R=new Map();for(const q of m.teams[1-K.att])if(q.oyunda&&q.duranRol)R.set(q,q.duranRol.rol);
                K.hk={t:m.t,x:m.ball.x,z:m.ball.z,R,sonra:null,ev:false};kHK[1]++;
                kHKSav.push(m.teams[1-K.att].filter(q=>q.oyunda&&q.rol!=='GK'&&kutuda(m,q,K.att)).length);kHKHuc.push(m.teams[K.att].filter(q=>q.oyunda&&q.rol!=='GK'&&kutuda(m,q,K.att)).length);}}
            else if(ad==='save'||ad==='yumruk'||ad==='parmak'||ad==='kapan')kIlkYaz('kaleci');
            else if(ad==='ilkDokunus'||ad==='sekme'||ad==='block'||ad==='kotuKontrol')kIlkYaz(h?'hucumAyak':'savunmaAyak');}
          /* T17-0: ilk kafadan sonraki ilk olay; savunma bloğunda bloklayanın rolü, erişimi (önceki adımın top yüksekliği ve uzaklığı), havada mı */
          if(K.hk&&!K.hk.sonra&&v&&v.p&&m.t>K.hk.t+1e-6){const h=v.p.team===K.att;
            if(ad==='save'||ad==='yumruk'||ad==='parmak'||ad==='kapan')K.hk.sonra='kaleci';
            else if(ad==='block'){K.hk.sonra=h?'hucBlok':'savBlok';
              if(!h){kHK[0]++;const p=v.p,rol=K.hk.R.get(p);kBlokRol[rol&&kBlokRol[rol]!=null?rol:'diger']++;const yb=onceki.y-(p.yuk||0);kBlokEr[yb<0.8?'ayak':yb<1.55?'gogus':'ust']++;
                kBlokHava[1]++;if((p.yuk||0)>0.05||p.zipla)kBlokHava[0]++;kBlokD.push(hyp(p.x-K.hk.x,p.z-K.hk.z));B2={t:m.t,att:K.att,gol:false};kBlokGol[1]++;}}
            else if(ad==='header')K.hk.sonra=h?'hucKafa':'savKafa';
            else if(ad==='ilkDokunus'||ad==='sekme'||ad==='kotuKontrol'||ad==='shot')K.hk.sonra=h?'hucAyak':'savAyak';}}
        /* barajlı doğrudan şut */
        if(S){if(ad==='shot'&&v.p&&v.p.team===S.att&&!S.sut){S.sut=true;bLG[S.bi][1]++;S.yer.ss=1;bCer[1]++;bGol[1]++;bBlok[1]++;bZip[1]++;if(m.ball.sut&&m.ball.sut.cerceve)bCer[0]++;bAld[1]++;if(S.ald){bAld[0]++;bGolAld[1]++;}}
          if(ad==='block'&&v.p&&S.sut&&!S.blok&&S.B.includes(v.p)&&m.t-S.t0<1){S.blok=true;bBlok[0]++;}
          if(ad==='goal'&&v.team===S.att&&S.sut&&!S.gol&&m.t-S.t0<5){S.gol=true;bGol[0]++;bLG[S.bi][0]++;S.yer.g=1;if(S.ald)bGolAld[0]++;}}
        if(P&&ad==='goal'&&v.team===P.att&&m.t-P.t0<5&&!P.gol){P.gol=true;pGol[0]++;}},
      adim(m){const b=m.ball;
        if(K){const dt=m.t-K.t0;
          if(K.izle){
            if(!K.havaSay&&m.ist.havaTopu>K.hava0){K.havaSay=true;kHava[0]++;}
            if(!K.inis&&dt>0.2&&b.vy<0&&b.y<2.6&&!b.sahip&&!b.tasiyan){K.inis=true;kInis[1]++;const n=[0,0];
              for(const q of m.players)if(q.oyunda&&q.rol!=='GK'&&hyp(q.x-b.x,q.z-b.z)<1.5)n[q.team]++;if(n[0]&&n[1])kInis[0]++;}
            if(!K.ilk){if(b.tasiyan&&b.tasiyan.rol==='GK'&&b.tasiyan.team!==K.att)kIlkYaz('kaleci');
              else if(m.phase!=='play')kIlkYaz('disari');
              else if(K.inis&&b.y<0.3&&!b.sahip)kIlkYaz('yere');
              else if(dt>4)kIlkYaz('yok');}}
          if(m.score[K.att]>K.g0&&!K.gol&&dt<=8){K.gol=true;kGol[0]++;}
          /* T17-0: ilk kafadan 1,5 sn sonra kutudakiler, markajlı hücumcu (1,5 m içinde savunmacı), görev penceresi açık mı */
          if(K.hk&&!K.hk.ev&&m.t-K.hk.t>=1.5){K.hk.ev=true;const A=m.teams[K.att].filter(q=>q.oyunda&&q.rol!=='GK'&&kutuda(m,q,K.att)),D=m.teams[1-K.att].filter(q=>q.oyunda&&q.rol!=='GK'&&kutuda(m,q,K.att));
            kEvSav.push(D.length);kEvHuc.push(A.length);for(const a of A){kEvMarkaj[1]++;if(D.some(q=>hyp(q.x-a.x,q.z-a.z)<1.5))kEvMarkaj[0]++;}kEvAcik[1]++;if(m._duranSonrasi)kEvAcik[0]++;}
          if(dt>8||(m.phase!=='play'&&m.phase!=='goal'&&dt>0.5)){kSutL.push(K.sut);kSutP[1]++;if(K.sut>0)kSutP[0]++;K=null;}}
        if(S){const dt=m.t-S.t0;
          if(S.sut&&!S.zip&&dt<0.5&&S.B.some(q=>q.zipla||q.yuk>0.05)){S.zip=true;bZip[0]++;}
          if(S.yuk==null&&hyp(b.x-S.x,b.z-S.z)>=9.15){S.yuk=b.y;if(S.sut)bYuk.push(b.y);}
          if(dt>5)S=null;}
        if(T){const s=b.sahip||b.tasiyan;if(s&&s.team!=null&&m.t-T.t0>0.05){tTut[1]++;if(s.team===T.att)tTut[0]++;T=null;}else if(m.t-T.t0>3||m.phase!=='play'){tTut[1]++;T=null;}}
        if(V){const dt=m.t-V.t0,s=b.sahip||b.tasiyan;
          if(V.uzun&&V.due==null&&(m.ist.havaTopu>V.hava0||dt>4)){V.due=m.ist.havaTopu>V.hava0;kvDue[1]++;if(V.due)kvDue[0]++;}
          if(!V.tut&&s&&s.team!=null&&dt>0.05){V.tut=true;kvTut[1]++;if(s.team===V.att)kvTut[0]++;}
          if(!V.tut&&(dt>6||m.phase!=='play')){V.tut=true;kvTut[1]++;}
          if(V.tut&&(!V.uzun||V.due!=null))V=null;}
        if(P){const dt=m.t-P.t0;if(!P.rib&&dt>=1.0){P.rib=true;pRib.push(P.A.filter(q=>q.oyunda&&kutuda(m,q,P.att)).length);}if(dt>5)P=null;}
        /* T17-0: görev penceresinin bitiş nedeni (pencere bu adımda kapandıysa motorun sırasıyla çıkarım), kapanıştan sonra gol, blok izleyicisi */
        {const DS=m._duranSonrasi;
          if(DS)dsSon={t0:DS.t0,x:DS.x,takim:DS.takim,sahipT:DS.sahipT,tur:DS.tur};
          else if(dsSon){const d=m.dir[dsSon.takim];let n;
            if(m.phase!=='play')n='durus';else if(m.t-dsSon.t0>ROL_SURE)n='sure';else if(b.x*d<Math.min(K_PL-28,dsSon.x*d-10))n='m28';
            else if(dsSon.sahipT>=0&&m.t-dsSon.sahipT>0.8)n='sahip';else if(m._sonSut&&m._sonSut.t>dsSon.t0)n='sut';else n='diger';
            if(dsSon.tur==='korner'){kBit[n]++;dsBit={t:m.t,takim:dsSon.takim,gol:false};kBitGol[1]++;}dsSon=null;}
          if(dsBit&&(m.t-dsBit.t>8||m.phase!=='play'&&m.phase!=='goal'))dsBit=null;
          if(B2&&(m.t-B2.t>8||m.phase!=='play'&&m.phase!=='goal'))B2=null;}
        onceki.x=b.x;onceki.z=b.z;onceki.y=b.y;},
      bitir(){
        const ham={kYerinde:[yerinde,tehlike],kKInis:kInis,kKHava:kHava,kKGol:kGol,kSA_baraj_sut:sA.baraj,kSA_kenar_orta:sA.kenarOrta,kSA_kenar_sut:sA.kenarSut,
          kSA_uzak_uzun:sA.uzak,kSHizli:sHizli,kBCerceve:bCer,kBGol:bGol,kBBlok:bBlok,kBZipla:bZip,kBIkili:bIk,kBAldatma:bAld,kBGolAld:bGolAld,kT_uzun:tUzun,kT_hizli:tHizli,kT_tut:tTut,
          kKV_yerden:kvYer,kKV_uzun:kvUzun,kKV_tut:kvTut,kKV_duello:kvDue,kP_gol:pGol,
          kKSutP:kSutP,kKGolPay:[kornerGolN,golN],kHKBlok:kHK,kBlokGol:kBlokGol,kBHava:kBlokHava,kEvMarkaj:kEvMarkaj,kEvAcik:kEvAcik,kBitGol:kBitGol};
        {let n=0;for(const k in kBlokRol)n+=kBlokRol[k];for(const k in kBlokRol)ham['kBR_'+k]=[kBlokRol[k],n];}
        {let n=0;for(const k in kBlokEr)n+=kBlokEr[k];for(const k in kBlokEr)ham['kBE_'+k]=[kBlokEr[k],n];}
        {let n=0;for(const k in kBit)n+=kBit[k];for(const k in kBit)ham['kBit_'+k]=[kBit[k],n];}
        const kT=kAlt.kisa+kAlt.ice+kAlt.disa+kAlt.duz+kAlt.geri;ham.kK_kisa=[kAlt.kisa,kT];ham.kK_ice=[kAlt.ice,kT];ham.kK_disa=[kAlt.disa,kT];ham.kK_geri=[kAlt.geri,kT];ham.kKPerde=kPerde;
        let bT=0;for(const k of K_BOLGE)bT+=kBol[k];for(const k of K_BOLGE)ham['kKB_'+k]=[kBol[k],bT];
        let iT=0;for(const k of K_ILK)iT+=kIlk[k];for(const k of K_ILK)ham['kKI_'+k]=[kIlk[k],iT];
        let yT=0;for(const k of K_KAYNAK)yT+=kKay[k];for(const k of K_KAYNAK)ham['kKK_'+k]=[kKay[k],yT];
        const r={ham,kZorla:zorla,kKKutuH:ort(kKutuH),kKKutuS:ort(kKutuS),kKGeri:ort(kGeri),kKGeriHiz:ort(kGeriHiz),kKSut:kSutL.length?ort(kSutL):NaN,
          kSKenarKutu:ort(sKenarKutu),kBKisi:ort(bKisi),kBYuk:kOrtanca(bYuk),kP_rib:ort(pRib),_kBaraj:_baraj,
          kBD:kOrtanca(kBlokD),kHKSav:ort(kHKSav),kHKHuc:ort(kHKHuc),kEvSav:ort(kEvSav),kEvHuc:ort(kEvHuc),kKOrtaMac:kOrtaKorner};
        for(let i=0;i<4;i++){r['kBL_'+i]=bL[i];ham['kBLS_'+i]=bLS[i];ham['kBLG_'+i]=bLG[i];}r._kBYer=bYer.map(o=>[o.u,o.w,o.s,o.ss,o.g]);   /* T24-0 */
        for(const k of K_TUR)r['kN_'+k]=N[k];for(const [k] of K_HZ)r['kH_'+k]=kOrtanca(HZ[k]);for(const k of K_SINIF)r['kS_'+k]=sS[k];
        return r;}
    };
  },
  /* barajdaki kişi mesafeye göre (bütün maçlar; kale ortasına uzaklık) */
  ozet(sonuclar){const B=[[16,20],[20,25],[25,30],[30,35],[35,99]],T=B.map(()=>[0,0]);
    for(const s of sonuclar)for(const [L,n] of(s._kBaraj||[])){const i=B.findIndex(([a,c])=>L>=a&&L<c);if(i>=0){T[i][0]+=n;T[i][1]++;}}
    if(!T.some(t=>t[1]))return;
    console.log('  Barajdaki kişi mesafeye göre (k-duran; kale ortasına m · ort. kişi · adet): '+B.map(([a,c],i)=>(c>90?a+'+':a+'–'+c)+' m '+(T[i][1]?(T[i][0]/T[i][1]).toFixed(1):'—')+' ('+T[i][1]+')').join('  |  '));
    /* T24-0: barajlı serbest vuruşun yeri — kale çizgisine u × yana w (vuruş / doğrudan şut / gol; bütün maçlar) */
    const U=[[0,20,'u<20'],[20,24,'u 20–24'],[24,28,'u 24–28'],[28,99,'u≥28']],W=[[0,5,'merkez (w<5)'],[5,14,'yarı (w 5–14)'],[14,99,'geniş (w≥14)']],G=W.map(()=>U.map(()=>[0,0,0]));
    for(const s of sonuclar)for(const [u,w,,ss,g] of(s._kBYer||[])){const j=W.findIndex(([a,c])=>w>=a&&w<c),i=U.findIndex(([a,c])=>u>=a&&u<c);if(i>=0&&j>=0){const c=G[j][i];c[0]++;c[1]+=ss;c[2]+=g;}}
    console.log('  Barajlı serbest vuruşun yeri (k-duran, T24-0; kale çizgisine u, yana w m · vuruş / doğrudan şut / gol): '+W.map(([,,wa],j)=>wa+' '+U.map(([,,ua],i)=>ua+' '+G[j][i].join('/')).join(' · ')).join('  |  '));}
};
