'use strict';
/* ============ Şutun verimi, kalecinin kalibrasyonu ve uzaklaştırma (T12-0, 2026-10-12; gerçekçilik planı §4 T12) ============
   r-karne, s-sut ve v-vurus ile aynı sözleşme: rastlantı çekmez, motor yöntemi çağırmaz; olayları ('shot', 'header', 'save', 'goal', 'block',
   'cross', 'pass', 'clear') ve her adımın sonunda topu, şut nesnesini (b.sut), duruşu ve kaleciyi okur. Oranlar bütün maçların toplamından (ham).
   Tanımlar:
   - Şut: 'shot' (ayak) ve şut sayılan 'header'. Penaltı (vuruş eyleminin sec.penalti'si) kalibrasyona girmez, ayrı sayılır.
   - xG: kararın gördüğü değer (olaydaki xg; konum modeli × (1 − blok), js/mac-karar.js xG — gerçek konum tablolarına oturtulmuş). Kalibrasyon:
     xG dilimlerinde gerçekleşen gol / şut ve gerçekleşen ÷ xG. Gerçek maçta oran ~1'dir (model gerçek verilere oturtulduysa).
   - Kalecinin tahmini (T12-0'da motorun şut nesnesine eklendi; salt okunur, sonucu değiştirmez): pKurt = kaleciTahmin(m, kaleci, z, y, T) —
     hatası uygulanmış nişanın kale çizgisindeki yeri ve uçuş süresiyle (kafada topun hızından). Kalibrasyon: çerçeveye giden (b.sut.cerceve) ve
     bloklanmayan şutlarda pKurt dilimlerinde gerçekleşen kurtarış = kurtarış / (kurtarış + gol). Fark büyükse kalecinin yürütmesi modelinden
     kötüdür; fark küçük ve kurtarış düşükse model (yer tutma, tepki, erişim) zayıftır.
   - Kalecinin durumu (şut anında): hazır duruş (tavir 'hazir'), hızı (≥ 1,2 m/sn hareketli), yer hatası: topla iki direk arasındaki açıortaya
     yanal uzaklığı (m; kaleciKonum açıortayda durur), şutun çizgisine yanal uzaklığı (kalecinin düzleminde, m).
   - Şutun türü: yerleşik, gelişine (sec.ilk), kafa, ortadan (aynı takımın son 3 sn'de ortası ya da geri çevirmesi; gelişine ya da kafa da olabilir).
   - Sonuç (v-vurus ile aynı): şut nesnesi değişince — aynı adımda gol olduysa gol; kurtarış olayı ya da kaleci topu tuttuysa kurtarış; 'block'
     olduysa blok; değilse diğer (dışarı, direk, kendi kalesine …).
   - Uzaklaştırma: 'clear' (ayak) ve uzaklaştırma kararıyla kafa ('header', tur 'uzaklastir'); 4 sn içindeki ilk durum: korner (rakibe), taç,
     kale vuruşu, kendi takımı topu aldı, rakip aldı; hiçbiri değilse havada/boşta.
   Gerçek değerler (Ek E; Opta/StatsBomb özetleri, yaklaşık): gol/şut penaltısız ~%10, ceza sahası içinden ~%12–13, dışından ~%3–4; çerçeveye
   giden şutta kurtarış içeriden ~%60–66, dışarıdan ~%85. */
const VV_X=[0,0.03,0.06,0.1,0.2,0.35,9],VV_XAD=['<0,03','0,03–0,06','0,06–0,10','0,10–0,20','0,20–0,35','≥0,35'];
const VV_P=[0,0.2,0.4,0.6,0.8,9],VV_PAD=['<0,2','0,2–0,4','0,4–0,6','0,6–0,8','≥0,8'];
const VV_TUR=['yer','ilk','kafa','orta'],VV_TURAD={yer:'yerleşik',ilk:'gelişine (ayak)',kafa:'kafa',orta:'ortadan (hepsi)'};
const VV_DUR=['hazir','durgun','hareket'],VV_DURAD={hazir:'hazır duruşta',durgun:'hazır değil, durgun',hareket:'hareketli (≥ 1,2 m/sn)'};
const VV_YER=[0,0.5,1.5,9],VV_YERAD=['<0,5 m','0,5–1,5 m','≥1,5 m'];
const VV_CIZ=[0,1,2,3,9],VV_CIZAD=['<1 m','1–2 m','2–3 m','≥3 m'];
const VV_UZ=['korner','tac','kaleVurusu','takim','rakip','bos'],VV_UZAD={korner:'korner',tac:'taç',kaleVurusu:'kale vuruşu',takim:'takımı aldı',rakip:'rakip aldı',bos:'boşta / havada'};
const vvDilim=(S,x)=>{for(let i=0;i<S.length-1;i++)if(x<S[i+1])return i;return S.length-2;};
const VV_DOKUM=process.env.MAC_DENEME_SUTLAR||null;
const VV_MES=[0,6,11,16.5,20,25,99],VV_MESAD=['<6 m','6–11 m','11–16,5 m','16,5–20 m','20–25 m','≥25 m'];
const VV_RY=[0,1.5,3,99],VV_RYAD=['<1,5 m','1,5–3 m','≥3 m'];
const VV_KB=['orta','pas','sut','kayip','tuttu'],VV_KBAD={orta:'orta / geri çevirme',pas:'pas',sut:'şut',kayip:'top kaybı',tuttu:'topu tuttu (2,5 sn)'};
/* T24-0 (2026-10-18; T24 “Şut ve bitiş” ölçüm adımı, sonuç değişmez): şutun türü × mesafe tablosu, türe göre kaleci kalibrasyonu, dilimli blok
   kalibrasyonu, hamle eden savunmacı ve gelişine şutta blok. Tanımlar:
   - Tür: şut nesnesinin türü (b.sut.tur: sert, plase, falso + trivela, aşırtma, düşen; kafa şutunda 'kafa'). Türler açık oyundandır: penaltı ve
     doğrudan serbest vuruş (vuruş eyleminin sec.serbest'i) hariç; serbest vuruş tabloda ayrı satırdır. Gelişine (ayak) ve vole + yarım vole (eylemin
     stili) türlerle örtüşen ek satırlardır. Mesafe dilimleri v-vurus'unki (<11, 11–16,5, 16,5–25, ≥25 m; kale ortasına).
   - Planın P(gol)'ü: sutVur'un seçtiği adayın gol olasılığı (b.sut.pPg; isabet × (1 − kaleci) × (1 − blok), temas anının yerleriyle; salt okunur).
     Kafada ve penaltıda yok. Hız: şut olayı anındaki topun 3B hızı. Kurtarış ve tahmini: çerçeveye giden, bloklanmayan (gol ya da kurtarış) şutlarda.
   - Türe göre kaleci: aynı kümede tür başına gerçekleşen kurtarış − tahmin (pKurt; puan) ve tahmin dilimlerinde (<0,4 / 0,4–0,8 / ≥0,8) fark.
   - Dilimli blok: kararın pBlok'u (sutSecenegi; yerleşik ayak şutu, gelişine hariç) 0 / 0–0,1 / > 0,1 dilimlerinde şut payı, ortalama tahmin ve
     gerçekleşen blok. pBlok tam 0: hesapta hiçbir savunmacı hatta sayılmadı.
   - Hamle eden savunmacı: şut anında hamle damgası (_ortaBlokT; sutHamleYap, js/mac-hareket.js) ≤ 0,35 sn önce olan rakip saha oyuncusu — erisim'in
     uzatılmış blok erişimiyle aynı pencere (js/mac-topla.js). Açık oyun ayak şutlarında; kafada yok. Orta bloğu da aynı damgayı kullanır (top aynı
     anda orta ve şut olamaz).
   - Gelişine ayak şutu (sec.ilk): blok, kararın blok tahmini (pBlok yazılırsa; ilkDokunusSutu bugün yazmaz) ve hamle eden savunmacı ayrı satırlarda. */
const VV_ST=['sert','plase','falso','asirtma','dusen','kafa'],VV_STAD={sert:'sert',plase:'plase',falso:'falso + trivela',asirtma:'aşırtma',dusen:'düşen',kafa:'kafa'};
const VV_SE=['ilk','vole','serbest'],VV_SEAD={ilk:'gelişine ayak (örtüşür)',vole:'vole + yarım vole (örtüşür)',serbest:'doğrudan serbest vuruş'};
const VV_STB=['sert','plase','falso','asirtma','kafa'];
const VV_TM=[0,11,16.5,25,99],VV_TMAD=['<11 m','11–16,5 m','16,5–25 m','≥25 m'];
const VV_KP=[0,0.4,0.8,9],VV_KPAD=['<0,4','0,4–0,8','≥0,8'];
const VV_BD=['pB = 0','pB 0–0,1','pB > 0,1'];
const vvTurK=r=>r.kafa?'kafa':r.tur==='trivela'?'falso':VV_ST.indexOf(r.tur)>=0?r.tur:null;
const vvBDilim=x=>x<1e-9?0:x<=0.1?1:2;
const VV_T24_BILGI=(()=>{const L=[['— T24-0: şut türü, kaleci ve blok (v-verim; türler açık oyun: penaltı ve doğrudan serbest vuruş hariç) —',null,0]];
  for(const k of VV_STB){L.push(['Tür '+VV_STAD[k]+': gol / şut %','vvSt_'+k,1]);if(k!=='kafa')L.push(['Tür '+VV_STAD[k]+': planın P(gol) ort. % (b.sut.pPg)','vvStP_'+k,1]);
    L.push(['Tür '+VV_STAD[k]+': kaleci gerçekleşen − tahmin kurtarış (puan)','vvStK_'+k,1]);}
  for(let i=0;i<VV_BD.length;i++){L.push(['Blok dilimi '+VV_BD[i]+' (yerleşik ayak şutu): şutların %','vvBdN_'+i,1]);if(i)L.push(['  '+VV_BD[i]+': kararın tahmini ort. %','vvBdT_'+i,1]);
    L.push(['  '+VV_BD[i]+': gerçekleşen blok %','vvBd_'+i,1]);}
  L.push(['Hamle eden savunmacı olan şut % (açık oyun ayak şutu; damga ≤ 0,35 sn)','vvHm',1],['  hamle olan şutta blok %','vvHmB',1],['  hamlesiz şutta blok %','vvHmY',1],
    ['Gelişine ayak şutu: blok %','vvIlkB',1],['Gelişine ayak şutu: kararın blok tahmini ort. % (pBlok olanlar)','vvIlkT',1],
    ['Gelişine ayak şutu: hamle eden savunmacı olan %','vvIlkH',1],['  gelişine, hamle olan şutta blok %','vvIlkHB',1]);
  return L;})();
module.exports={
  bilgi:[['— Şutun verimi ve kaleci (v-verim; T12-0) —',null,0],
    ['Gol / şut (penaltısız) %','vvGolSut',1],['Konum xG / şut (penaltısız; baskısız, bloksuz)','vvXgK',3],['Gerçekleşen ÷ konum xG (penaltısız; maç oranlarının ortalaması)','vvOranK',2],
    ['Gerçekleşen ÷ konum xG (havuz: Σ gol ÷ Σ xG; penaltısız)','vvOranH',2,[0.85,1.25,'T15']],
    ['Kurtarış ceza sahası içinden % (penaltısız, çerçeveye giden, bloksuz; kafa dahil)','vvKurtIc',1,[50,65,'T15']],
    ['xG / şut (penaltısız; kararın değeri)','vvXg',3],['Gerçekleşen ÷ kararın xG\'si (penaltısız)','vvOran',2],
    ['Kaleci: tahmin − gerçekleşen kurtarış (puan; çerçeveye giden, bloksuz)','vvKalib',1],['Kaleci: tahmin edilen kurtarış ort. %','vvKTahmin',1],
    ['Şut anında kaleci hazır duruşta %','vvHazir',1],['Şut anında kaleci hareketli %','vvHareket',1],['Kalecinin açıortaya uzaklığı ortanca (m)','vvYer',2],
    ['Uzaklaştırma / maç','vvUz',1]].concat(VV_UZ.map(k=>['Uzaklaştırma sonrası: '+VV_UZAD[k]+' %','vvU_'+k,1]))
    .concat(['<1,5','1,5–3','3–5','≥5'].map((a,i)=>['Orta anında en yakın rakip '+a+' m %','vvOY_'+i,1]))
    .concat([['Orta anında topun önünde rakip (4 m, ±1,5 m) %','vvOO',1]])
    /* T19-0 (2026-10-17): şutun durumu — blok / şut (penaltısız; gerçek ~%25–30), şut anında en yakın saha oyuncusu rakibin uzaklığı ve
       top–kale hattındaki (ileride 0,5–14 m, yanal < 1,3 m) savunmacı; kanatta baskı altındaki top sahibinin seçimi (son 30 m, kale ortasından
       ≥ 14 m yanda, en yakın rakip ≤ 3 m): orta, pas, şut, top kaybı, topu tuttu (2,5 sn) */
    .concat([['Blok / şut (penaltısız) %','vvBlok',1,[24,32,'T19']],['Şut anında en yakın rakip ortanca (m; penaltısız)','vvRy',2],
      ['Şut anında hatta savunmacı (ort.; penaltısız)','vvHat',2],
      /* T19a: kararın blok tahmini (sutSecenegi pBlok; yerleşik ayak şutu) ↔ aynı şutlarda gerçekleşen blok */
      ['Blok: kararın tahmini (ort.; sutSecenegi) %','vvBlokT',1],['Blok: aynı şutlarda gerçekleşen %','vvBlokG',1]])
    .concat(VV_RYAD.map((a,i)=>['Şut anında en yakın rakip '+a+': şutların %','vvRy_'+i,1]))
    .concat(VV_RYAD.map((a,i)=>['  '+a+': blok %','vvRyB_'+i,1]))
    .concat(VV_RYAD.map((a,i)=>['  '+a+': gol %','vvRyG_'+i,1]))
    .concat([['Kanatta baskı altında top sahibi (1. adam ≤ 3 m; adet / maç)','vvKbN',2]])
    .concat(VV_KB.map(k=>['  seçimi: '+VV_KBAD[k]+' %','vvKb_'+k,1]))
    .concat(VV_T24_BILGI),
  yeni:()=>{
    const hyp=Math.hypot,PL=52.5,MZ=34,GW2=3.66;
    const sut=[],yerL=[];let aktif=null,uzN=0;const uzS={};for(const k of VV_UZ)uzS[k]=0;
    const sonOrta=[-9,-9],bu={goal:false,save:false,block:false},uzA=[],ortaYakin=[0,0,0,0];let ortaN=0,ortaOnde=0;
    /* T19-0: kanatta baskı altındaki top sahibi (bölüm başına bir kez; aynı oyuncu topu bırakıp yeniden alana dek) */
    const kbS={};for(const k of VV_KB)kbS[k]=0;let kb=null,kbSon=null;const kbBit=k=>{kbS[k]++;kb=null;};
    /* şut kaydı: ad 'shot' ya da 'header' (şut); b.sut ve kaleci şut anında */
    function kaydet(m,p,v,kafa){
      const b=m.ball,s=b.sut;if(!p||!s)return;const t=p.team,d=m.dir[t],gx=d*PL,e=p.eylem,sec=e&&e.ad==='vurus'?e.sec:null;
      const pen=!!(sec&&sec.penalti),ilk=!kafa&&!!(sec&&sec.ilk),orta=m.t-sonOrta[t]<3;
      const gk=m.teams[1-t].find(q=>q.rol==='GK'&&q.oyunda)||null;let hazir=false,hiz=0,yer=NaN,ciz=NaN;
      if(gk){hazir=gk.tavir==='hazir';hiz=hyp(gk.vx,gk.vz);
        /* açıortay: toptan iki direğe birim yönlerin toplamı */
        const ax=gx-b.x,az1=MZ-GW2-b.z,az2=MZ+GW2-b.z,l1=hyp(ax,az1)||1,l2=hyp(ax,az2)||1,ux=ax/l1+ax/l2,uz=az1/l1+az2/l2,ul=hyp(ux,uz)||1;
        yer=Math.abs((gk.x-b.x)*(-uz/ul)+(gk.z-b.z)*(ux/ul));
        /* şutun çizgisi: toptan nişanın kale çizgisindeki yerine */
        const zn=s.nisanZ!=null?s.nisanZ:s.hedefZ!=null?s.hedefZ:MZ,lx=gx-b.x,lz=zn-b.z,ll=hyp(lx,lz)||1;
        ciz=Math.abs((gk.x-b.x)*(-lz/ll)+(gk.z-b.z)*(lx/ll));}
      const gkx=gx,ic=Math.abs(b.x-gkx)<16.5&&Math.abs(b.z-MZ)<20.16;
      const Lk=hyp(gx-b.x,MZ-b.z);
      /* T19-0: en yakın saha oyuncusu rakip ve hattaki savunmacı (top → kale ortası; ileride 0,5 … min(14, L − 1) m, yanal < 1,3 m) */
      let ry=99,hat=0;{const ux=(gx-b.x)/(Lk||1),uz=(MZ-b.z)/(Lk||1);
        for(const o of m.teams[1-t]){if(!o.oyunda||o.rol==='GK')continue;const dx=o.x-b.x,dz=o.z-b.z,dd=hyp(dx,dz);if(dd<ry)ry=dd;
          const on=dx*ux+dz*uz,yan=Math.abs(-dx*uz+dz*ux);if(on>0.5&&on<Math.min(14,Lk-1)&&yan<1.3)hat++;}}
      const r={L:Lk,t,pen,kafa,ilk,orta,xg:v&&v.xg||0,xgK:s.xgYer!=null?s.xgYer:null,pK:s.pKurt,cer:!!s.cerceve,hazir,hiz,yer,ciz,ic,ry,hat,pB:sec&&sec.pBlok!=null?sec.pBlok:null,sonuc:null};
      /* T24-0: tür (kafada 'kafa'), stil, hız, planın P(gol)'ü (b.sut.pPg), doğrudan serbest vuruş, hamle eden savunmacı sayısı (_ortaBlokT ≤ 0,35 sn) */
      {let hm=0;if(!kafa)for(const o of m.teams[1-t])if(o.oyunda&&o.rol!=='GK'&&m.t-o._ortaBlokT<=0.35)hm++;
       Object.assign(r,{tur:kafa?'kafa':s.tur||null,stil:!kafa&&e&&e.ad==='vurus'?e.stil:null,sp:hyp(b.vx,b.vy,b.vz),pPg:s.pPg!=null?s.pPg:null,serbest:!!(sec&&sec.serbest),hm});}
      /* MAC_DENEME_SUTLAR=<dosya>: şut başına kayıt (çözümleme için; işçi başına <dosya>.<pid>) */
      if(VV_DOKUM){const sp=hyp(b.vx,b.vy,b.vz),L=hyp(gx-b.x,MZ-b.z);
        Object.assign(r,{tohum:m.tohum,dk:Math.round(m.gameSec/6)/10,L:+L.toFixed(2),w:+(b.z-MZ).toFixed(2),v:+sp.toFixed(1),zA:s.nisanZ!=null?+(s.nisanZ-MZ).toFixed(2):null,
          yA:s.nisanY!=null?+s.nisanY.toFixed(2):null,zH:s.hedefZ!=null?+(s.hedefZ-MZ).toFixed(2):null,pPg:s.pPg,pPon:s.pPon,tur:s.tur||null,
          gkD:gk?+Math.abs(gk.x-gx).toFixed(2):null,gkW:gk?+(gk.z-MZ).toFixed(2):null,kalecilik:gk?gk.oz.kalecilik:null,sut:p.oz.sut,rol:p.rol,
          stil:e&&e.ad==='vurus'?e.stil:null,guc:e&&e.ad==='vurus'?e.guc:null,acele:e&&e.ad==='vurus'?e.acele||0:0,baski:e&&e.ad==='vurus'?e.baski:null,yor:+(p.yorgunluk||0).toFixed(3),tepki:s.gkTepki!=null?+s.gkTepki.toFixed(3):null});}
      sut.push(r);if(gk&&!pen)yerL.push(yer);aktif={s,r};}
    return{
      dinle(ad,v,m){if(!m)return;
        if(kb&&v&&v.p===kb.p){if(ad==='cross'||ad==='pass'&&v.tur==='geriCevir')kbBit('orta');else if(ad==='pass')kbBit('pas');else if(ad==='shot'||ad==='header'&&v.shot)kbBit('sut');}
        if(ad==='goal'){bu.goal=true;return;}
        if(ad==='save'){bu.save=true;return;}
        if(ad==='block'){if(!(v&&v.orta))bu.block=true;return;}
        if(ad==='cross'||ad==='pass'&&v&&v.tur==='geriCevir'){if(v&&v.p){sonOrta[v.p.team]=m.t;
          /* T12b: orta anında savunmanın ortacıya yakınlığı — en yakın rakip (m) ve topun gidişinin önünde (±1,5 m yanal, 4 m içinde) rakip */
          if(ad==='cross'){const b=m.ball,vh=hyp(b.vx,b.vz)||1,ux=b.vx/vh,uz=b.vz/vh;let en=99,onde=false;
            for(const o of m.teams[1-v.p.team]){if(!o.oyunda||o.rol==='GK')continue;const dx=o.x-b.x,dz=o.z-b.z,dd=hyp(dx,dz);if(dd<en)en=dd;const ileri=dx*ux+dz*uz,yan=Math.abs(-dx*uz+dz*ux);if(ileri>0&&ileri<4&&yan<1.5)onde=true;}
            ortaN++;if(en<1.5)ortaYakin[0]++;else if(en<3)ortaYakin[1]++;else if(en<5)ortaYakin[2]++;else ortaYakin[3]++;if(onde)ortaOnde++;}}return;}
        if(ad==='clear'||ad==='header'&&v&&v.tur==='uzaklastir'){if(v&&v.p){uzN++;uzA.push({t:m.t,team:v.p.team,surum:m.ball.surum});}return;}
        if(ad==='shot'){kaydet(m,v&&v.p,v,false);return;}
        if(ad==='header'&&v&&v.shot){kaydet(m,v.p,v,true);return;}},
      adim(m){const b=m.ball;
        /* T19-0: kanatta baskı altındaki top sahibi */
        if(kb){const s=b.sahip||b.tasiyan;if(m.phase!=='play')kb=null;else if(s&&s.team!==kb.p.team)kbBit('kayip');else if(s&&s!==kb.p)kb=null;else if(m.t-kb.t>2.5)kbBit('tuttu');}
        else if(m.phase==='play'&&b.sahip&&b.sahip!==kbSon){const p=b.sahip,d=m.dir[p.team];
          if(b.x*d>PL-30&&Math.abs(b.z-MZ)>=14){let en=99;for(const o of m.teams[1-p.team])if(o.oyunda&&o.rol!=='GK'){const dd=hyp(o.x-p.x,o.z-p.z);if(dd<en)en=dd;}
            if(en<=3){kb={p,t:m.t};kbSon=p;}}}
        if(!b.sahip&&!kb)kbSon=null;
        if(aktif&&b.sut!==aktif.s){const r=aktif.r,gk=b.tasiyan&&b.tasiyan.rol==='GK'&&b.tasiyan.team!==r.t;
          r.sonuc=bu.goal?'gol':bu.save||gk?'kurt':bu.block?'blok':'diger';aktif=null;}
        bu.goal=false;bu.save=false;bu.block=false;
        /* uzaklaştırmanın sonu */
        for(let i=uzA.length-1;i>=0;i--){const u=uzA[i];let k=null;
          if(m.phase==='durus'&&m.durus){const du=m.durus;k=du.tur==='korner'?'korner':du.tur==='tac'?'tac':du.tur==='kaleVurusu'?'kaleVurusu':(du.takim===u.team?'takim':'rakip');}
          else if(m.phase!=='play'&&m.phase!=='durus')k='bos';
          else if(b.sahip&&b.sahip.team!=null)k=b.sahip.team===u.team?'takim':'rakip';
          else if(b.tasiyan&&b.tasiyan.team!=null)k=b.tasiyan.team===u.team?'takim':'rakip';
          else if(m.t-u.t>4)k='bos';
          if(k){uzS[k]++;uzA.splice(i,1);}}},
      bitir(){
        if(VV_DOKUM&&sut.length){try{require('fs').appendFileSync(VV_DOKUM+'.'+process.pid,sut.map(r=>JSON.stringify(r)).join('\n')+'\n');}catch(e){}}
        const ham={},S=sut.filter(r=>!r.pen&&r.sonuc);let g=0,x=0,xk=0,kT=0,kN=0,kG=0,hz=0,hr=0,nG=0;
        for(const r of S){if(r.sonuc==='gol')g++;x+=r.xg;xk+=r.xgK||0;if(r.hazir)hz++;if(r.hiz>=1.2)hr++;
          if(r.cer&&r.pK!=null&&(r.sonuc==='gol'||r.sonuc==='kurt')){kN++;kT+=r.pK;if(r.sonuc==='kurt')kG++;}}
        nG=S.length;
        ham.vvGolSut=[g,nG];ham.vvHazir=[hz,nG];ham.vvHareket=[hr,nG];ham.vvKTahmin=[kT,kN];
        /* T15-0 (2026-10-14): havuz oranı — xG'si olan şutların golleri ÷ xG toplamı (oran satırı 100·pay/payda yazar: payda 100·xG); vvOranK maç
           oranlarının ortalamasıdır (gürültülü, yukarı çarpık). Ceza sahası içinden kurtarış: penaltısız, çerçeveye giden ve bloklanmayan şutlarda
           kurtarış ÷ (kurtarış + gol), kafa dahil (v-vurus'un vK_ic'i ayak şutu ve penaltı dahildir) */
        {let gH=0,xH=0,ki=0,kn=0;for(const r of S){if(r.xgK!=null){xH+=r.xgK;if(r.sonuc==='gol')gH++;}
          if(r.ic&&r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt')){kn++;if(r.sonuc==='kurt')ki++;}}
         ham.vvOranH=[gH,100*xH];ham.vvKurtIc=[ki,kn];}
        /* dilim tabloları (ozet okur): [pay, payda] */
        const xk1=r=>r.xgK!=null?r.xgK:r.xg;
        for(let i=0;i<VV_XAD.length;i++){const D=S.filter(r=>vvDilim(VV_X,xk1(r))===i);ham['vvX_'+i]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvXs_'+i]=[D.reduce((a,r)=>a+xk1(r),0),D.length];}
        /* mesafe dilimleri (konum xG'siyle): gol, xG toplamı, çerçeve ve kurtarış */
        for(let i=0;i<VV_MESAD.length;i++){const D=S.filter(r=>r.L>=VV_MES[i]&&r.L<VV_MES[i+1]),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvM_'+i]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvMx_'+i]=[D.reduce((a,r)=>a+(r.xgK||0),0),D.length];
          ham['vvMc_'+i]=[D.filter(r=>r.cer).length,D.length];ham['vvMk_'+i]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];ham['vvMb_'+i]=[D.filter(r=>r.sonuc==='blok').length,D.length];}
        const C=S.filter(r=>r.cer&&r.pK!=null&&(r.sonuc==='gol'||r.sonuc==='kurt'));
        for(let i=0;i<VV_PAD.length;i++){const D=C.filter(r=>vvDilim(VV_P,r.pK)===i);ham['vvP_'+i]=[D.filter(r=>r.sonuc==='kurt').length,D.length];ham['vvPs_'+i]=[D.reduce((a,r)=>a+r.pK,0),D.length];}
        const tur=r=>r.kafa?'kafa':r.ilk?'ilk':'yer';
        for(const k of VV_TUR){const D=S.filter(r=>k==='orta'?r.orta:tur(r)===k),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvT_'+k]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvTc_'+k]=[D.filter(r=>r.cer).length,D.length];ham['vvTk_'+k]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];
          ham['vvTp_'+k]=[Dc.reduce((a,r)=>a+(r.pK||0),0),Dc.length];ham['vvTx_'+k]=[D.reduce((a,r)=>a+r.xg,0),D.length];}
        const dur=r=>r.hazir?'hazir':r.hiz>=1.2?'hareket':'durgun';
        for(const k of VV_DUR){const D=S.filter(r=>dur(r)===k),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvD_'+k]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvDk_'+k]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];ham['vvDp_'+k]=[Dc.reduce((a,r)=>a+(r.pK||0),0),Dc.length];}
        for(let i=0;i<VV_YERAD.length;i++){const D=S.filter(r=>r.yer===r.yer&&vvDilim(VV_YER,r.yer)===i),Dc=D.filter(r=>r.cer&&(r.sonuc==='gol'||r.sonuc==='kurt'));
          ham['vvY_'+i]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvYk_'+i]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];}
        for(let i=0;i<VV_CIZAD.length;i++){const Dc=C.filter(r=>r.ciz===r.ciz&&vvDilim(VV_CIZ,r.ciz)===i);
          ham['vvC_'+i]=[Dc.filter(r=>r.sonuc==='kurt').length,Dc.length];ham['vvCp_'+i]=[Dc.reduce((a,r)=>a+r.pK,0),Dc.length];}
        /* kutu içi ve dışı (penaltısız), sonuç dağılımı */
        for(const k of['ic','dis']){const D=S.filter(r=>r.ic===(k==='ic'));ham['vvK_'+k]=[D.filter(r=>r.sonuc==='gol').length,D.length];
          for(const s of['gol','kurt','blok','diger'])ham['vvS_'+k+'_'+s]=[D.filter(r=>r.sonuc===s).length,D.length];}
        const pen=sut.filter(r=>r.pen&&r.sonuc);ham.vvPen=[pen.filter(r=>r.sonuc==='gol').length,pen.length];
        let uT=0;for(const k of VV_UZ)uT+=uzS[k];for(const k of VV_UZ)ham['vvU_'+k]=[uzS[k],uT];
        for(let i=0;i<4;i++)ham['vvOY_'+i]=[ortaYakin[i],ortaN];ham.vvOO=[ortaOnde,ortaN];
        /* T19-0: blok / şut, şut anında rakibin yakınlığı, kanatta baskı */
        ham.vvBlok=[S.filter(r=>r.sonuc==='blok').length,nG];
        /* T24-0: gelişine şut (pBlok yazılırsa) kendi satırında; bugün pBlok yalnız yerleşik şutta olduğundan değer aynı */
        {const B=S.filter(r=>r.pB!=null&&!r.ilk);ham.vvBlokT=[B.reduce((a,r)=>a+r.pB,0),B.length];ham.vvBlokG=[B.filter(r=>r.sonuc==='blok').length,B.length];}
        /* T24-0: tür × mesafe hücreleri (vvTT; ozet okur): [adet, çerçeve, gol, blok, kurtarış paydası, kurtarış, Σ tahmin, Σ hız, Σ planın P(gol)'ü,
           P'li adet]; türe göre kaleci 'K<tür>:<dilim>': [adet, kurtarış, Σ tahmin] */
        const TT={};
        const hucre=(k,i,r)=>{const a=TT[k+':'+i]||(TT[k+':'+i]=[0,0,0,0,0,0,0,0,0,0]);a[0]++;if(r.cer)a[1]++;if(r.sonuc==='gol')a[2]++;else if(r.sonuc==='blok')a[3]++;
          if(r.cer&&r.pK!=null&&(r.sonuc==='gol'||r.sonuc==='kurt')){a[4]++;if(r.sonuc==='kurt')a[5]++;a[6]+=r.pK;}a[7]+=r.sp;if(r.pPg!=null){a[8]+=r.pPg;a[9]++;}};
        for(const r of S){const i=vvDilim(VV_TM,r.L);if(r.serbest){hucre('serbest',i,r);continue;}const k=vvTurK(r);if(k)hucre(k,i,r);
          if(r.ilk)hucre('ilk',i,r);if(r.stil==='vole'||r.stil==='yarimVole')hucre('vole',i,r);
          if(k&&r.cer&&r.pK!=null&&(r.sonuc==='gol'||r.sonuc==='kurt')){const q='K'+k+':'+vvDilim(VV_KP,r.pK),a=TT[q]||(TT[q]=[0,0,0]);a[0]++;if(r.sonuc==='kurt')a[1]++;a[2]+=r.pK;}}
        for(const q in TT){const a=TT[q];if(q[0]==='K')a[2]=+a[2].toFixed(4);else{a[6]=+a[6].toFixed(4);a[7]=+a[7].toFixed(2);a[8]=+a[8].toFixed(4);}}
        const A=S.filter(r=>!r.serbest),bl=L=>L.filter(r=>r.sonuc==='blok').length;
        for(const k of VV_STB){const D=A.filter(r=>vvTurK(r)===k),Dc=D.filter(r=>r.cer&&r.pK!=null&&(r.sonuc==='gol'||r.sonuc==='kurt')),Dp=D.filter(r=>r.pPg!=null);
          ham['vvSt_'+k]=[D.filter(r=>r.sonuc==='gol').length,D.length];ham['vvStP_'+k]=[Dp.reduce((a,r)=>a+r.pPg,0),Dp.length];
          ham['vvStK_'+k]=[Dc.reduce((a,r)=>a+(r.sonuc==='kurt'?1:0)-r.pK,0),Dc.length];}
        {const B=S.filter(r=>r.pB!=null&&!r.ilk);for(let i=0;i<VV_BD.length;i++){const D=B.filter(r=>vvBDilim(r.pB)===i);
          ham['vvBdN_'+i]=[D.length,B.length];ham['vvBdT_'+i]=[D.reduce((a,r)=>a+r.pB,0),D.length];ham['vvBd_'+i]=[bl(D),D.length];}}
        {const F=A.filter(r=>!r.kafa),H=F.filter(r=>r.hm>0),Y=F.filter(r=>!(r.hm>0)),I=F.filter(r=>r.ilk),IH=I.filter(r=>r.hm>0),Ip=I.filter(r=>r.pB!=null);
          ham.vvHm=[H.length,F.length];ham.vvHmB=[bl(H),H.length];ham.vvHmY=[bl(Y),Y.length];
          ham.vvIlkB=[bl(I),I.length];ham.vvIlkT=[Ip.reduce((a,r)=>a+r.pB,0),Ip.length];ham.vvIlkH=[IH.length,I.length];ham.vvIlkHB=[bl(IH),IH.length];}
        for(let i=0;i<VV_RYAD.length;i++){const D=S.filter(r=>vvDilim(VV_RY,r.ry)===i);ham['vvRy_'+i]=[D.length,nG];
          ham['vvRyB_'+i]=[D.filter(r=>r.sonuc==='blok').length,D.length];ham['vvRyG_'+i]=[D.filter(r=>r.sonuc==='gol').length,D.length];}
        let kbN=0;for(const k of VV_KB)kbN+=kbS[k];for(const k of VV_KB)ham['vvKb_'+k]=[kbS[k],kbN];
        const sR=S.map(r=>r.ry).filter(x=>x<99).sort((a,b)=>a-b),ryO=sR.length?sR[Math.floor(sR.length/2)]:NaN;
        const sy=yerL.filter(v=>v===v).sort((a,b)=>a-b),yo=sy.length?(sy.length%2?sy[(sy.length-1)/2]:(sy[sy.length/2-1]+sy[sy.length/2])/2):NaN;
        return{ham,vvXg:nG?x/nG:NaN,vvOran:x>0?g/x:NaN,vvXgK:nG?xk/nG:NaN,vvOranK:xk>0?g/xk:NaN,vvKalib:kN?100*(kT-kG)/kN:NaN,vvYer:yo,vvUz:uzN,
          vvRy:ryO,vvHat:nG?S.reduce((a,r)=>a+r.hat,0)/nG:NaN,vvKbN:kbN,vvTT:TT};}
    };
  },
  /* dilim tabloları: bütün maçların toplamından */
  ozet(sonuclar){
    const T={};for(const s of sonuclar){const h=s.ham||{};for(const k in h)if(k.startsWith('vv')){const a=T[k]||(T[k]=[0,0]);a[0]+=h[k][0];a[1]+=h[k][1];}}
    const o=k=>T[k]||[0,0],yuz=(a,b)=>b?(100*a/b).toFixed(1):'—',f=(s,n)=>String(s).padStart(n);
    console.log('\n  Şutun verimi (v-verim; T12-0; penaltısız): konum xG dilimi · adet · ort. xG · gerçekleşen gol % · gerçekleşen ÷ xG');
    for(let i=0;i<VV_XAD.length;i++){const [g,n]=o('vvX_'+i),[xs]=o('vvXs_'+i);const xo=n?xs/n:NaN;
      console.log('  '+('xG '+VV_XAD[i]).padEnd(22)+f(n,6)+f(n?xo.toFixed(3):'—',9)+f(yuz(g,n),9)+f(n&&xo>0?(g/n/xo).toFixed(2):'—',8));}
    console.log('  Mesafe (konum xG; gerçekte ÷ ~1): adet · gol % · konum xG % · gerçekleşen ÷ xG · çerçeve % · kurtarış % · blok % (T19-0)');
    for(let i=0;i<VV_MESAD.length;i++){const [g,n]=o('vvM_'+i),[xs]=o('vvMx_'+i),[c]=o('vvMc_'+i),[kk,kn]=o('vvMk_'+i),[bb]=o('vvMb_'+i);
      console.log('  '+VV_MESAD[i].padEnd(22)+f(n,6)+f(yuz(g,n),8)+f(n?(100*xs/n).toFixed(1):'—',8)+f(xs>0?(g/xs).toFixed(2):'—',8)+f(yuz(c,n),8)+f(yuz(kk,kn),8)+f(yuz(bb,n),8));}
    console.log('  Kaleci kalibrasyonu (çerçeveye giden, bloksuz): tahmin dilimi · adet · ort. tahmin % · gerçekleşen kurtarış % · fark (|fark| > 10 "!")');
    for(let i=0;i<VV_PAD.length;i++){const [k,n]=o('vvP_'+i),[ps]=o('vvPs_'+i);const po=n?100*ps/n:NaN,gz=n?100*k/n:NaN,fk=gz-po;
      console.log((n>=20&&Math.abs(fk)>10?'! ':'  ')+('P(kurtarış) '+VV_PAD[i]).padEnd(22)+f(n,6)+f(n?po.toFixed(1):'—',9)+f(n?gz.toFixed(1):'—',9)+f(n?(fk>0?'+':'')+fk.toFixed(1):'—',8));}
    console.log('  Şutun türü: adet · çerçeve % · kurtarış % (tahmin %) · gol/şut % (ort. xG)');
    for(const k of VV_TUR){const [g,n]=o('vvT_'+k),[c]=o('vvTc_'+k),[kk,kn]=o('vvTk_'+k),[tp]=o('vvTp_'+k),[tx]=o('vvTx_'+k);
      console.log('  '+VV_TURAD[k].padEnd(22)+f(n,6)+f(yuz(c,n),9)+f(yuz(kk,kn),9)+' ('+(kn?(100*tp/kn).toFixed(0):'—')+')'+f(yuz(g,n),8)+' ('+(n?(tx/n).toFixed(3):'—')+')');}
    console.log('  Kalecinin durumu (şut anında): adet · kurtarış % (tahmin %) · gol/şut %');
    for(const k of VV_DUR){const [g,n]=o('vvD_'+k),[kk,kn]=o('vvDk_'+k),[tp]=o('vvDp_'+k);
      console.log('  '+VV_DURAD[k].padEnd(26)+f(n,6)+f(yuz(kk,kn),9)+' ('+(kn?(100*tp/kn).toFixed(0):'—')+')'+f(yuz(g,n),8));}
    console.log('  Kalecinin açıortaya uzaklığı: adet · kurtarış % · gol/şut %');
    for(let i=0;i<VV_YERAD.length;i++){const [g,n]=o('vvY_'+i),[kk,kn]=o('vvYk_'+i);console.log('  '+VV_YERAD[i].padEnd(22)+f(n,6)+f(yuz(kk,kn),9)+f(yuz(g,n),9));}
    console.log('  Şut çizgisinin kaleciye uzaklığı (çerçeveye giden, bloksuz): adet · kurtarış % · tahmin %');
    for(let i=0;i<VV_CIZAD.length;i++){const [kk,n]=o('vvC_'+i),[ps]=o('vvCp_'+i);console.log('  '+VV_CIZAD[i].padEnd(22)+f(n,6)+f(yuz(kk,n),9)+f(n?(100*ps/n).toFixed(1):'—',9));}
    console.log('  Sonuç dağılımı (penaltısız): içeriden / dışarıdan · gol · kurtarış · blok · diğer %');
    for(const k of['ic','dis']){const [, n]=o('vvK_'+k);console.log('  '+(k==='ic'?'ceza sahası içinden':'ceza sahası dışından').padEnd(22)+f(n,6)+['gol','kurt','blok','diger'].map(s=>f(yuz(o('vvS_'+k+'_'+s)[0],n),8)).join(''));}
    const [pg,pn]=o('vvPen');console.log('  Penaltı: '+pn+' · gol '+yuz(pg,pn)+' %');
    /* T24-0: tür × mesafe ve türe göre kaleci (maçların vvTT hücreleri toplanır) */
    const TT={};for(const s of sonuclar){const t=s.vvTT;if(!t)continue;for(const q in t){const a=TT[q]||(TT[q]=t[q].map(()=>0));for(let j=0;j<t[q].length;j++)a[j]+=t[q][j];}}
    const topla=(k,ii)=>{const a=[0,0,0,0,0,0,0,0,0,0];for(const i of ii){const c=TT[k+':'+i];if(c)for(let j=0;j<10;j++)a[j]+=c[j];}return a;};
    const satirT=(ad,a)=>console.log('  '+ad.padEnd(28)+f(a[0],6)+f(yuz(a[1],a[0]),8)+f(yuz(a[5],a[4]),8)+(' ('+(a[4]?(100*a[6]/a[4]).toFixed(0):'—')+')').padEnd(6)
      +f(yuz(a[3],a[0]),7)+f(yuz(a[2],a[0]),8)+f(a[9]?(100*a[8]/a[9]).toFixed(1):'—',8)+f(a[0]?(a[7]/a[0]).toFixed(1):'—',7));
    console.log('  Şut türü × mesafe (T24-0; penaltısız; türler doğrudan serbest vuruş hariç, gelişine ve vole türlerle örtüşür): adet · çerçeve % · kurtarış % (tahmin)'
      +' · blok % · gol/şut % · planın P(gol) % · hız m/sn');
    for(const k of VV_ST.concat(VV_SE)){const a=topla(k,[0,1,2,3]);satirT(VV_STAD[k]||VV_SEAD[k],a);if(!a[0])continue;
      for(let i=0;i<VV_TMAD.length;i++){const c=topla(k,[i]);if(c[0])satirT('  '+VV_TMAD[i],c);}}
    console.log('  Kaleci kalibrasyonu türe göre (T24-0; açık oyun, çerçeveye giden, bloksuz): adet · ort. tahmin % · gerçekleşen kurtarış % · fark (gerçek − tahmin;'
      +' |fark| > 10 "!") · dilimlerde fark (adet): P '+VV_KPAD.join(' / '));
    const isr=x=>{let s=x.toFixed(1);if(s==='-0.0')s='0.0';return(s[0]==='-'?'':'+')+s;};
    for(const k of VV_ST){let n=0,kk=0,ps=0;const dl=[];
      for(let j=0;j<VV_KPAD.length;j++){const c=TT['K'+k+':'+j]||[0,0,0],d=c[0]?100*(c[1]-c[2])/c[0]:NaN;n+=c[0];kk+=c[1];ps+=c[2];dl.push((c[0]?isr(d):'—')+' ('+c[0]+')');}
      const fk=n?100*(kk-ps)/n:NaN;
      console.log((n>=20&&Math.abs(fk)>10?'! ':'  ')+VV_STAD[k].padEnd(22)+f(n,6)+f(n?(100*ps/n).toFixed(1):'—',9)+f(yuz(kk,n),9)+f(n?isr(fk):'—',8)+'   '+dl.join(' / '));}
  }
};
