'use strict';
/* ============ Robotluk karnesi (gerçekçilik planı T0; MAC_MOTORU_GERCEKCILIK_PLANI.md Ek F) ============
   Hareketin temposu, topun ayakta kalışı, sahiplik zincirleri, top kaybının nedeni, PPDA, şutun yeri, gollerin kaynağı ve duran top düzeni.
   Top oyundayken ve saha oyuncuları (kaleci hariç) için ölçülür. Rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları,
   top ve oyuncu alanlarını okur. Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Gerçek futbol karşılıkları planın
   §1 tablosundadır. */
const R_PL=52.5,R_MZ=34,R_CU=16.5,R_CW=20.16;
/* T24-0: direğe çarpan şuttan sonraki 4 sn'de ilk gelen (sınıf, ad) */
const R_DIREK=[['gol','gol'],['kurt','kurtarış'],['uzak','uzaklaştırma'],['sut','hücum şutu'],['rakip','rakip topu aldı'],['durdu','oyun durdu'],['tuttu','hücum topu tuttu (şutsuz)'],['yok','hiçbiri']];
const R_KAYIP=[['pas','kesilen / isabetsiz pas'],['diger','çalım, sürüş kaybı, seken top'],['hava','hava topu, kafa sonrası'],['mudahale','müdahale'],['kontrol','kötü ilk dokunuş']];
/* T0: satırlara planın tur kabul hedefleri bağlandı (4. öğe [alt, üst, tur]; bilgi amaçlı, dışındaysa "!", çıkış kodu değişmez).
   T1/T2 hedefleri §4 "Kabul"den; T8 satırları da aynı tanımı ölçtüğü için eklendi. Hedefsiz satırların planda doğrudan karşılığı yok
   (ör. barajlı serbest vuruşta T8 hedefi doğrudan şut başınadır, burada 8 sn içindeki gol; ayrı ölçüm d-duran senaryosunda) */
module.exports={
  bilgi:[
    ['— R: robotluk karnesi (gerçekçilik planı Ek F) —',null,0],
    ['Hareket: durma + yürüme (<2 m/sn) %','rDurYuru',1,[40,null,'T1']],['Hareket: depar (≥7 m/sn) %','rDepar',1,[null,3,'T1']],
    ['Hareket: topa >25 m iken >4 m/sn %','rUzakKosu',1,[null,25,'T1']],['Hareket: 16+ saha oyuncusu koşuyor (anların) %','rKalabalik',1,[null,25,'T1']],
    ['Hareket: ortalama hız (m/dk)','rHizDk',0,[140,180,'T1']],['Hareket: >3 m/sn² ivmelenme / oyuncu·dk','rIvme',1,[null,5,'T1']],['Hareket: ivmelenme kümesi (aynı takımdan 0,3 sn içinde ≥ 3) / takım·dk (T18-0)','rIvmeKume',2],['Hareket: eşzamanlı ivmelenme (iki takımdan 0,3 sn içinde ≥ 3; borç 2) / oyuncu·dk (T23-0)','rIvmeEs',2,[null,1,'T23']],['Hareket: >3 m/sn² ivmelenme, eski tanım (tampon yalnız oyunda; T22 ve öncesiyle kıyas) / oyuncu·dk (T23-0)','rIvmeEski',2],['Hareket: ivmelenme — görev değişiminden ≤ 0,5 sn % (T13-0)','rIvmeGorev',1],['Hareket: >3 m/sn² ivmelenme, ≥ 0,5 sn süren (GPS tanımı, bilgi) / oyuncu·dk','rIvmeGps',2,[null,2.5,'T23']],
    ['Top ayakta: ortanca (sn)','rAyakta',2,[1.2,2.0,'T2']],['Top ayakta: 1 sn\'den kısa %','rAyaktaKisa',1,[null,45,'T2']],['Top taşıma: >5 m %','rTasima',1,[25,35,'T2']],
    /* T7g (2026-10-10, §7.7 kararı): sıkıştırılmış maçta sahiplik sayısı oyun dakikası başına gerçeğin ~2 katı, pas sayısı aynı → sahiplik başına
       pas gerçeğin yarısı; bant 2,5–4 (gerçek) → 1,6–3. T10g (2026-10-11, aynı karardan): pas yapılamadan biten sahiplik ≤ 25 → ≤ 45 (sahiplik
       başına 1,6–3 pasta sıfır paslı pay geometrik dağılımla %25–38, düelloyla başlayan kısa sahiplikler artırır; “T10 — Sonuç”) */
    ['Sahiplik: tamamlanan pas ort.','rSeqPas',2,[1.6,3,'T7']],['Sahiplik: ortalama süre (sn)','rSeqSure',1],['Sahiplik: pas yapılamadan biten %','rSeqBos',1,[null,45,'T10']],
    /* T2 (2026-10-07): 10+ paslı sahiplik, pasın alıcısı (karar katmanının hedeflediği arkadaş; oyuncu-karnesi.js'teki gruplarla aynı), pas boyu */
    ['Sahiplik: 10+ paslı %','rSeq10',1,[3,null,'T2']],
    ['Pas alıcısı: forvet %','rAliciForvet',1,[null,30,'T2']],['Pas alıcısı: kanat %','rAliciKanat',1,[15,null,'T2']],['Pas boyu ort. (m)','rPasBoy',1,[16,20,'T2']]]
    .concat(R_KAYIP.map(([k,ad])=>['Top kaybı nedeni: '+ad+' %','rKayip_'+k,1]))
    /* T7g (§7.7): pas sıkışmaz, savunma eylemi (müdahale, çalım düellosu) 2,5–3,5 kat sıkışık → PPDA bandı 7–12 (gerçek) → 3,5–7 */
    .concat([['PPDA (rakibin kendi %60\'ında pas / savunma eylemi)','rPpda',1,[3.5,7,'T7']],
    ['Şut: ceza sahası içinden %','rSutKutu',1,[55,null,'T2']],['Şut: ortanca mesafe (m)','rSutMesafe',1,[14,16,'T2']],
    /* T24-0 (2026-10-18; bilgi): FBref "Dist" tanımı — penaltısız, kafa dahil (doğrudan serbest vuruş dahil; FBref ortalama verir, burada maç
       başına ortanca, eski satırla aynı). Eski satır ayak şutlarından: penaltı ve serbest vuruş dahil, kafa hariç. Kafanın mesafesi temas anında
       topun yerinden kale ortasına (ayak şutunun dist'i gibi) */
    ['Şut: ortanca mesafe (penaltısız, kafa dahil; FBref Dist) (m)','rSutMesafeF',1],
    ['Şut: forvet dışı %','rSutForvetDisi',1,[30,null,'T3']],
    /* T4 (2026-10-08, bire bir): çalım denemesi motorun 'calim' olayıdır (hazırlığı başlamış deneme; sonuç gecti/kayip/faul/disari/yarim).
       Hedefli satırlar düelloya giren çalımlardır (Claude kararı 2026-10-08; Opta'nın "rakibini geçmeye çalışma" tanımı): başarılı = rakibi geçip
       topu korudu (gecti); başarısız = top rakibe geçti (kayip) ya da savunmacı topa 1,5 m'den yakın gelip kale tarafında kaldı (yarım + düello).
       Savunmacının hiç yaklaşmadığı yarım deneme (hatla geri çekildi) ve faulle biten kayda girmez, bilgi satırlarında durur. Başarı = geçti /
       düello. Tahmin − gerçek: düellolarda birebirTahmin olasılığının ortalaması − gerçekleşen başarı (puan). Kanat payı: mevkisi kanat olan
       oyuncuların düellosu / bütün düellolar. Top saklama: tavır 'koru'
       süresi. Dokunuş sıklığı: topu süren oyuncunun sürüş dokunuşları / sürüş süresi (koruma, bekletme ve çalım denemesi hariç); hız bantları
       < 3, 3–5,5, ≥ 5,5 m/sn */
    ['Çalım (düello) / maç','rCalim',1,[20,28,'T4']],   /* U1 (20 dakikalık maç): 10–14 × 2 */['Çalım: başarı %','rCalimOk',1,[40,50,'T4']],['Çalım: kanat oyuncularının payı %','rCalimKanat',1,[40,null,'T4']],
    ['Çalım: tahmin − gerçek (puan)','rCalimKalib',1,[-8,8,'T4']],['Çalım denemesi (düellosuz ve faul dahil) / maç','rCalimHepsi',1],['Çalım denemesi: düellosuz yarım %','rCalimYarim',1],
    ['Çalım denemesi: savunmacı aldatıldı %','rCalimYut',1],['Çalım denemesi: faulle biten %','rCalimFaul',1],
    ['Top saklama (koru; oyuncu·sn / maç)','rKoru',1,[20,60,'T4']],   /* T4e (2026-10-09): 15–40 planın tahminiydi; ölçülen tutma ~10 durum × 1 sn, bant 10–30; U1 (20 dakikalık maç): × 2 */
    ['Taşıma: dokunuş sıklığı (1/sn)','rDokunus',2,[2.3,3.0,'T4']],['Taşıma: dokunuş sıklığı <3 m/sn','rDokunusY',2],
    ['Taşıma: dokunuş sıklığı 3–5,5 m/sn','rDokunusO',2],['Taşıma: dokunuş sıklığı ≥5,5 m/sn','rDokunusH',2],
    ['Gol: duran toptan (korner, serbest, penaltı) %','rGolDuran',1,[25,35,'T8']],
    /* Z1a (2026-10-19; FUTBOL_KUTUPHANESI §11.2 örtüşme temizliği): korner, barajlı ve kenar serbest vuruşu ve hazırlık satırları kalktı — aynı
       tanımlar araclar/olcumler/k-duran.js'te (kKGol, kKKutuH, kKKutuS, kKGeri, kKGeriHiz, kSKenarKutu, kBKisi, kH_*). Duran toptan gol payı k-duran'da
       olmadığı için burada kaldı */
    /* T4h (2026-10-09; gerçekçilik planı Ek H madde 39, bilgi): yön salınımı — 0,2 sn'de bir örneklenen gidiş yönü (hız > 1,5 m/sn, kilitli eylem
       dışında) 50°'den çok döner ve bir sonraki örnekte ilk yönün 30° içine geri gelir (gereksiz yön değişimi); sahipsiz duran top — oyunda top
       kimsenin değil, yerde ve 0,3 m/sn'den yavaş (kimse almıyor) */
    ['Yön salınımı (gidip geri dönme) / oyuncu·dk','rSalinim',2],['Sahipsiz duran top (sn / maç)','rTopBos',1],['Sahipsiz duran top: en uzun (sn)','rTopBosEn',1],
    /* T5 (2026-10-09): faulün itme/tutma payı (neden 'itme': gövde çarpması, omuz, taktik çekme) ve hakemin görmediği faul (oyun sürdü) */
    ['Faul: itme ve tutma payı %','rFaulItme',1,[null,40,'T5']],['Faul: görülmeyen / maç','rFaulGorulmedi',2],
    /* T5e (2026-10-09; plan T5 madde 8, bilgi — gerçek veri kaynağı bulununca hedef bağlanır): kurtarış, parmak, yumruk, blok ya da direkten
       sonraki 4 sn içinde aynı takımın attığı gol */
    ['Gol: dönen toptan (kurtarış, blok, direk sonrası 4 sn) %','rGolDonen',1],
    /* T24-0 (2026-10-18; bilgi): direğe çarpan şut — 'wood' olayı (js/mac-motoru.js direkVurdu; yük {p: topa son dokunan}) top şut nesnesini
       taşırken (b.sut: şuttan sonra başkası dokunmadı; şut başına bir, penaltı dahil); taşımazken (sapan ya da kurtarılan top, orta, uzaklaştırma;
       0,5 sn içindeki ikinci çarpma sayılmaz) ayrı satır. Direkten sonraki 4 sn'de ilk gelen: gol (şutu atan takımın; kendi kalesine dahil),
       kurtarış (rakip kalecinin kurtarışı, yumruğu ya da topu eline alması), uzaklaştırma (rakibin 'clear'ı ya da uzaklaştırma kafası), hücum şutu
       (şutu atan takımdan şut ya da kafa şutu); bütün sınıflar (rakip topu aldı, oyun durdu, hücum topu tuttu, hiçbiri) ozet satırında */
    ['Direk: şut / maç (T24-0)','rDirek',2],['Direk: şut dışı top (sapan, kurtarılan, orta) / maç','rDirekDiger',2],
    ['Direkten sonra 4 sn: gol %','rDirekGol',1],['Direkten sonra 4 sn: kurtarış %','rDirekKurt',1],
    ['Direkten sonra 4 sn: uzaklaştırma %','rDirekUzak',1],['Direkten sonra 4 sn: hücum şutu %','rDirekSut',1]]),
  yeni:()=>{
    const hyp=Math.hypot,ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN,ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b);return S[Math.floor(S.length/2)];};
    /* hareket */
    let tOy=0,tDY=0,tDep=0,tUzak=0,tUzakKosu=0,mes=0,orn=0,kalabalik=0,efor=0,eforGorev=0,eforGps=0,adim=0,kume=0,eforEski=0,esN=0;const iv=new Map(),kumeT=[[],[]],kumeSon=[-9,-9],sonHep=[];
    /* T23-0 (2026-10-18): hız tamponu oyun dışında da dolar — eskiden duruşta donuyordu, oyun başlarken hız duruştan önceki son hızla karşılaştırılıp
       sahte ivmelenme sayılıyordu (6,62 → 6,26 / oyuncu·dk). Sayım yalnız oyunda; eski tanım (tampon yalnız oyunda) ayrı tamponla bilgi satırında */
    const tampon=m=>{for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;const h=iv.get(p);if(!h)continue;const sp=hyp(p.vx,p.vz);
      h.v[h.i]=sp;h.i=(h.i+1)%12;h.n++;h.g[h.gi]=sp;h.gi=(h.gi+1)%30;h.gn++;}};
    /* top */
    const ayakta=[],tasima=[];let sahipP=null,sahipT=0,tas=null;
    /* sahiplik ve kayıp */
    const seqs=[],kayip={};let seq=null;const son={steal:null,kotu:null,pas:null,kafa:null};let ppdaPas=0,ppdaEylem=0;
    /* şut ve gol */
    let sut=0,sutKutu=0,sutDisi=0,gol=0,golDuran=0;const sutL=[],sutLF=[];
    /* pasın alıcısı ve boyu (T2) */
    const grup=q=>!q?'-':q.rol==='GK'?'kaleci':q.mevki&&q.mevki.bek?'bek':q.rol==='DEF'?'stoper':q.mevki&&q.mevki.kanat?'kanat':q.rol==='OS'?'merkez':'forvet';
    let pasN=0,pasL=0,alFv=0,alKn=0,alN=0;
    /* T4: çalım, top saklama, dokunuş sıklığı */
    let clN=0,clHep=0,clYarim=0,clOk=0,clKanat=0,clFaul=0,clPn=0,clPt=0,clPok=0,clYn=0,clY=0,tKoru=0;const clHar={},dkT=[0,0,0],dkN=[0,0,0];
    /* T4h: yön salınımı, sahipsiz duran top */
    let salinim=0,bosT=0,bosAn=0,bosEn=0,faulN=0,faulItme=0,faulGor=0,golDonen=0;const donenT=[-9,-9];const yonFark=(x,y)=>{let r=x-y;r=Math.atan2(Math.sin(r),Math.cos(r));return r<0?-r:r;};
    /* T24-0: direğe çarpan şut ve sonraki 4 sn (dr: {t, att: şutu atan takım, tut: hücum topu aldı}) */
    const drS={};for(const [k] of R_DIREK)drS[k]=0;let drN=0,drDiger=0,drDigT=-9,drSon=null,dr=null;const drBit=k=>{drS[k]++;dr=null;};
    const kapat=(m,neden)=>{if(!seq)return;seqs.push({sure:m.t-seq.t0,pas:m.ist.pasTamam[seq.team]-seq.pt0,neden});seq=null;};
    const kutuda=(m,p,t)=>{const gx=m.dir[t]*R_PL;return Math.abs(p.x-gx)<R_CU&&Math.abs(p.z-R_MZ)<R_CW;};
    return{
      dinle(ad,v,m){if(!m)return;const b=m.ball;
        if(dr){const q=v&&v.p;
          if(ad==='goal')drBit(v.team===dr.att?'gol':'rakip');
          else if((ad==='save'||ad==='yumruk')&&q&&q.team!==dr.att)drBit('kurt');
          else if((ad==='clear'||ad==='header'&&v.tur==='uzaklastir')&&q&&q.team!==dr.att)drBit('uzak');
          else if((ad==='shot'||ad==='header'&&v.shot)&&q)drBit(q.team===dr.att?'sut':'rakip');}
        if(ad==='pass'||ad==='cross'){if(v.p&&sahipP===v.p)ayakta.push(m.t-sahipT);if(v.p){son.pas={t:m.t,team:v.p.team};if(b.x*m.dir[v.p.team]<10.5)ppdaPas++;}
          if(ad==='pass'&&v.L!=null){pasN++;pasL+=v.L;}
          if(v.q&&v.q.team!=null){const g=grup(v.q);alN++;if(g==='forvet')alFv++;else if(g==='kanat')alKn++;}}
        else if(ad==='shot'){sut++;if(v.p&&kutuda(m,v.p,v.p.team))sutKutu++;if(v.p&&v.p.rol!=='FV')sutDisi++;if(v.dist!=null)sutL.push(v.dist);if(v.p&&sahipP===v.p)ayakta.push(m.t-sahipT);
          const e=v.p&&v.p.eylem;if(v.dist!=null&&!(e&&e.ad==='vurus'&&e.sec&&e.sec.penalti))sutLF.push(v.dist);}
        else if(ad==='header'){son.kafa={t:m.t};if(v.shot){sut++;sutKutu++;if(v.p&&v.p.rol!=='FV')sutDisi++;if(v.p)sutLF.push(hyp(m.dir[v.p.team]*R_PL-b.x,R_MZ-b.z));}}
        else if(ad==='mudahale'){if(v.p&&b.x*m.dir[1-v.p.team]<10.5)ppdaEylem++;}
        else if(ad==='steal'){if(v.p)son.steal={t:m.t,team:v.p.team};}
        else if((ad==='faul'&&!v.avantajdan)||ad==='avantaj'){const f=v.faulYapan;if(f&&b.x*m.dir[1-f.team]<10.5)ppdaEylem++;faulN++;if(v.neden==='itme')faulItme++;}
        else if(ad==='kotuKontrol'){if(v.p)son.kotu={t:m.t,team:v.p.team};}
        else if(ad==='faulGorulmedi')faulGor++;
        else if(ad==='save'||ad==='parmak'||ad==='yumruk'||ad==='block'){if(v.p&&v.p.team!=null)donenT[1-v.p.team]=m.t;}
        else if(ad==='wood'){if(v.p&&v.p.team!=null)donenT[v.p.team]=m.t;
          const s=b.sut;if(s){if(s!==drSon){drSon=s;drN++;if(dr)drBit(dr.tut?'tuttu':'yok');dr={t:m.t,att:s.team,tut:false};}}else{if(m.t-drDigT>0.5)drDiger++;drDigT=m.t;}}
        else if(ad==='calim'){clHep++;if(v.sonuc==='faul')clFaul++;if(v.sonuc==='yarim'&&!v.duello)clYarim++;if(v.yut!=null){clYn++;if(v.yut)clY++;}
          if(v.sonuc==='gecti'||v.sonuc==='kayip'||v.sonuc==='yarim'&&v.duello){clN++;const ok=v.sonuc==='gecti';if(ok)clOk++;if(grup(v.p)==='kanat')clKanat++;if(v.P!=null){clPn++;clPt+=v.P;if(ok)clPok++;}
            const h=clHar[v.hareket||'?']||(clHar[v.hareket||'?']=[0,0]);h[0]++;if(ok)h[1]++;}}
        else if(ad==='goal'){gol++;if(!v.own&&m.t-donenT[v.team]<4)golDonen++;const sk=m.sonKullanim;if(!v.own&&sk&&m.t-sk.t<10&&sk.p&&sk.p.team===v.team&&(sk.tur==='korner'||sk.tur==='serbest'||sk.tur==='penalti'))golDuran++;}},
      adim(m){adim++;const b=m.ball,ph=m.phase;
        /* T24-0: direkten sonra — oyun durdu, topu kim aldı, 4 sn doldu */
        if(dr){if(ph!=='play')drBit('durdu');
          else{const q=b.sahip||b.tasiyan;if(q&&q.team!=null){if(q.team!==dr.att)drBit(q.rol==='GK'?'kurt':'rakip');else dr.tut=true;}
            if(dr&&m.t-dr.t>4)drBit(dr.tut?'tuttu':'yok');}}
        if(ph!=='play'){if(seq)kapat(m,'durdu');if(tas)tasima.push(tas);tas=null;sahipP=null;bosAn=0;tampon(m);return;}
        {const bv=hyp(b.vx,b.vz);if(!b.sahip&&!b.tasiyan&&bv<0.3&&b.y<0.2){bosT+=1/60;bosAn+=1/60;if(bosAn>bosEn)bosEn=bosAn;}else bosAn=0;}
        /* sahiplik zinciri, top ayakta, taşıma */
        const s=b.sahip;
        if(s!==sahipP){if(tas)tasima.push(tas);sahipP=s;sahipT=m.t;tas=s?{yol:0}:null;}
        if(s&&tas)tas.yol+=hyp(s.vx,s.vz)/60;
        if(s){const st=s.team;
          if(!seq||seq.team!==st){
            if(seq){let k='diger';
              if(son.steal&&m.t-son.steal.t<1.5&&son.steal.team===st)k='mudahale';
              else if(son.kotu&&m.t-son.kotu.t<2.5&&son.kotu.team===seq.team)k='kontrol';
              else if(son.kafa&&m.t-son.kafa.t<2.5)k='hava';
              else if(son.pas&&m.t-son.pas.t<4&&son.pas.team===seq.team){k='pas';if(b.x*m.dir[seq.team]<10.5)ppdaEylem++;}
              kayip[k]=(kayip[k]||0)+1;kapat(m,'kayip');}
            seq={team:st,t0:m.t,pt0:m.ist.pasTamam[st]};}}
        /* hareket: hız bölgeleri, topa uzaklık, ivmelenme (0,2 sn pencerede hız büyüklüğü değişimi; 1 sn içinde tek sayılır) */
        let n=0;const dt=1/60;
        /* T4: sürüş dokunuşu (bu karede) ve süresi; koruma, bekletme ve çalım denemesi dışında */
        if(s&&s.surus&&!s.surus.koru&&!s.surus.bekle&&!s.eylem&&!(s.calim&&s.calim.faz>=1)){const sp=hyp(s.vx,s.vz),i=sp<3?0:sp<5.5?1:2;dkT[i]+=dt;
          const sd=s.sonDokunus;if(sd&&sd.tur==='surus'&&sd.t===m.t)dkN[i]++;}
        for(const p of m.players){if(!p.oyunda||p.rol==='GK')continue;const sp=hyp(p.vx,p.vz);tOy+=dt;mes+=sp*dt;if(sp<2)tDY+=dt;if(sp>=7)tDep+=dt;if(sp>2)n++;
          if(p.tavir==='koru')tKoru+=dt;
          if(hyp(p.x-b.x,p.z-b.z)>25){tUzak+=dt;if(sp>4)tUzakKosu+=dt;}
          let h=iv.get(p);if(!h){h={v:new Float64Array(12),i:0,n:0,ust:false,son:-9,y0:0,y1:0,y2:0,yn:0,g:new Float64Array(30),gi:0,gn:0,gust:false,gson:-9,vo:new Float64Array(12),io:0,no:0,usto:false,sono:-9};iv.set(p,h);}
          /* T23-0: eski tanım (tampon yalnız oyunda dolar) */
          if(h.no>=12&&!(p.eylem&&p.eylem.kilit)){if((sp-h.vo[h.io])/0.2>3){if(!h.usto&&m.t-h.sono>1){eforEski++;h.sono=m.t;}h.usto=true;}else h.usto=false;}
          h.vo[h.io]=sp;h.io=(h.io+1)%12;h.no++;
          if(adim%12===0){if(sp>1.5&&!(p.eylem&&p.eylem.kilit)){h.y2=h.y1;h.y1=h.y0;h.y0=Math.atan2(p.vz,p.vx);h.yn++;
            if(h.yn>=3&&yonFark(h.y1,h.y2)>0.873&&yonFark(h.y0,h.y2)<0.524)salinim++;}else h.yn=0;}
          if(h.n>=12&&!(p.eylem&&p.eylem.kilit)){const a=(sp-h.v[h.i])/0.2;if(a>3){if(!h.ust&&m.t-h.son>1){efor++;h.son=m.t;if(m.t-p._gorevT<=0.5)eforGorev++;
                /* T18-0: aynı takımdan 0,3 sn içinde ≥ 3 ivmelenme bir küme (küme başına bir) */
                const KT=kumeT[p.team];KT.push(m.t);while(KT.length&&m.t-KT[0]>0.3)KT.shift();if(KT.length>=3&&m.t-kumeSon[p.team]>0.3){kume++;kumeSon[p.team]=m.t;}
                /* T23-0: eşzamanlı (r-ivme s_es tanımı: iki takımdan son 0,3 sn içinde kendisi dahil ≥ 3 ivmelenme) */
                while(sonHep.length&&m.t-sonHep[0]>0.3)sonHep.shift();sonHep.push(m.t);if(sonHep.length>=3)esN++;}h.ust=true;}else h.ust=false;}
          h.v[h.i]=sp;h.i=(h.i+1)%12;h.n++;
          /* T13: GPS tanımı (bilgi) — 0,5 sn'lik pencerede ortalama ivme > 3 m/sn² (hız 1,5 m/sn'den çok arttı), 1 sn içinde tek */
          if(h.gn>=30&&!(p.eylem&&p.eylem.kilit)){if((sp-h.g[h.gi])/0.5>3){if(!h.gust&&m.t-h.gson>1){eforGps++;h.gson=m.t;}h.gust=true;}else h.gust=false;}
          h.g[h.gi]=sp;h.gi=(h.gi+1)%30;h.gn++;}
        if(adim%30===0){orn++;if(n>=16)kalabalik++;}},
      bitir(){if(dr)drBit(dr.tut?'tuttu':'yok');const tk=Object.values(kayip).reduce((a,c)=>a+c,0),ham={
          rDurYuru:[tDY,tOy],rIvmeGorev:[eforGorev,efor],rDepar:[tDep,tOy],rUzakKosu:[tUzakKosu,tUzak],rKalabalik:[kalabalik,orn],
          rAyaktaKisa:[ayakta.filter(x=>x<1).length,ayakta.length],rTasima:[tasima.filter(t=>t.yol>5).length,tasima.length],
          rSeqBos:[seqs.filter(s=>s.pas===0).length,seqs.length],rSeq10:[seqs.filter(s=>s.pas>=10).length,seqs.length],
          rAliciForvet:[alFv,alN],rAliciKanat:[alKn,alN],rSutKutu:[sutKutu,sut],rSutForvetDisi:[sutDisi,sut],rGolDuran:[golDuran,gol],
          rCalimOk:[clOk,clN],rCalimKanat:[clKanat,clN],rCalimYut:[clY,clYn],rCalimFaul:[clFaul,clHep],rCalimYarim:[clYarim,clHep],rFaulItme:[faulItme,faulN],rGolDonen:[golDonen,gol],
          rDirekGol:[drS.gol,drN],rDirekKurt:[drS.kurt,drN],rDirekUzak:[drS.uzak,drN],rDirekSut:[drS.sut,drN]};
        for(const [k] of R_KAYIP)ham['rKayip_'+k]=[kayip[k]||0,tk];
        return{ham,rPasBoy:pasN?pasL/pasN:NaN,rHizDk:tOy?mes/tOy*60:NaN,rIvme:tOy?efor/(tOy/60):NaN,rIvmeGps:tOy?eforGps/(tOy/60):NaN,rIvmeEski:tOy?eforEski/(tOy/60):NaN,rIvmeEs:tOy?esN/(tOy/60):NaN,rAyakta:ortanca(ayakta),rSeqPas:ort(seqs.map(s=>s.pas)),rSeqSure:ort(seqs.map(s=>s.sure)),
          rIvmeKume:tOy?kume/(tOy/600):NaN,rPpda:ppdaEylem?ppdaPas/ppdaEylem:NaN,rSutMesafe:ortanca(sutL),rSutMesafeF:ortanca(sutLF),rDirek:drN,rDirekDiger:drDiger,rDirekDokum:drS,
          rCalim:clN,rCalimHepsi:clHep,rCalimKalib:clPn?100*(clPt-clPok)/clPn:NaN,rKoru:tKoru,rCalimHareket:clHar,
          rDokunus:dkT[0]+dkT[1]+dkT[2]>0?(dkN[0]+dkN[1]+dkN[2])/(dkT[0]+dkT[1]+dkT[2]):NaN,
          rDokunusY:dkT[0]>0?dkN[0]/dkT[0]:NaN,rDokunusO:dkT[1]>0?dkN[1]/dkT[1]:NaN,rDokunusH:dkT[2]>0?dkN[2]/dkT[2]:NaN,
          rSalinim:tOy?salinim/(tOy/60):NaN,rTopBos:bosT,rTopBosEn:bosEn,rFaulGorulmedi:faulGor};}
    };
  },
  /* T4: hareket başına çalım denemesi ve başarı (bütün maçlar) */
  ozet(sonuclar){const T={};for(const r of sonuclar){const H=r.rCalimHareket;if(!H)continue;for(const k in H){const t=T[k]||(T[k]=[0,0]);t[0]+=H[k][0];t[1]+=H[k][1];}}
    const K=Object.keys(T).sort((a,b)=>T[b][0]-T[a][0]);
    if(K.length)console.log('  Çalım hareketleri (düello; maç başına · başarı %): '+K.map(k=>k+' '+(T[k][0]/sonuclar.length).toFixed(2)+' · %'+(100*T[k][1]/T[k][0]).toFixed(0)).join('  |  '));
    /* T24-0: direğe çarpan şuttan sonraki 4 sn, bütün sınıflar (bütün maçların toplamı) */
    const D={};let dn=0;for(const r of sonuclar){const H=r.rDirekDokum;if(!H)continue;for(const k in H){D[k]=(D[k]||0)+H[k];dn+=H[k];}}
    if(dn)console.log(`  Direğe çarpan şuttan sonra 4 sn (T24-0; ${dn} şut, maç başına ${(dn/sonuclar.length).toFixed(2)}): `+R_DIREK.map(([k,ad])=>ad+' '+(D[k]||0)+' (%'+(100*(D[k]||0)/dn).toFixed(0)+')').join(' · '));}
};
