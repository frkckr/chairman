'use strict';
/* ============ S1-0 (2026-10-20): sahne protokolleri ölçüsü — S1 planı §1.12, FUTBOL_KUTUPHANESI §12.15, kutuphane/L-sahne-protokolleri.md ============
   k-sahne.js'e (Z2) dokunmaz; onun süre satırları (ksS_*) sahnelerin süresini zaten yansıtır. Sözleşme k-sahne ile aynı: rastlantı çekmez,
   motor yöntemi çağırmaz, oyuncuya, hakeme ve topa yazmaz; yalnız olayları ve m.phase, m.durus, m.sonKullanim, m.refs, m.kenar alanlarını okur.
   Satır önekleri: s1D_ ortak düdük (S1-0); alanlar kendi adımında s1a_ (serbest vuruş), s1d_ (kart), s1b_ (penaltı), s1c_ (gol), s1e_ (rutin) ekler.
   Tanımlar (s1D_):
   - Seremonili düdük: 'duduk' olayı v.seremoni ile (js/mac-sahne.js dudukCal; gol sonrası santrada S1c). Sahibi v.sahip ('baraj', 'penalti',
     'kart'); santrada v.tur 'santra'. Sayılar maç başına.
   - Kullanım: duruşun kullanılması — m.sonKullanim'ın yeni nesnesi (js/mac-kurallar.js durusKullan; kısa geri dönüşte ikinci kez). Duruş, kullanım
     oyunu hemen başlatsa da (m.durus boşalır) önceki adımın duruşudur; düdük alanları (du.dudukGerek, du.dudukT, du.dudukBek) ve du.t o adımda okunur.
   - Düdük → kullanım: kullanımda du.t − du.dudukT (gerçek sn); ortanca maç başına ortancanın ortalaması (k-duran gibi), ≥ 1 sn % havuzdan.
   - Düdükte hakem durmuş: olay anında orta hakemin hızı (spd; önceki adımın hareketi) ≤ 0,3 m/sn, havuzdan.
   - Düdüksüz kullanım: du.dudukGerek var, du.dudukT yok (kabul 0). Düdükten önce kullanım: du.dudukT var, kullanım düdüğün beklemesi dolmadan
     (du.t < dudukT + dudukBek; kabul 0).
   - Sağlıkçı (bilgi; L.9 madde 5, K1'in sonucu): sağlıkçının kulübedeki yerinden (ev) 1,5 m'den uzakta geçirdiği gerçek sn / maç (iki takımın dört
     sağlıkçısının toplamı; maç öncesi dahil).
   Tanımlar (s1a_; S1a, 2026-10-20 — seremonili barajlı serbest vuruş, du.hk.s1 olan duruşlar; m.durus kimliğiyle izlenir):
   - Evreye giriş: du.hk.evre'nin ilk görüldüğü du.t (duruşun başından gerçek sn); maç başına ortanca, maçların ortalaması.
   - Varyant: du.hk.tur (sakin, olagan, uzun) %; kaosT: planlanan kaos süresi (du.hk.kaosT), ortanca.
   - Adımlamadan önce dizili: 'adim'in ilk adımında bütün üyeler (oyunda) son yerine (du.barajYer) ≤ 1 m — kaos ölçüsü, bugün (K1) %100.
   - Kaosta topa en yakın üye (m): 'kaos' boyunca üyelerin topun yerine (du.x, du.z) en küçük uzaklığı; 9,15 m içindeki savunmacı (kaleci hariç):
     kaostaki en çok sayı.
   - Üye yolu ÷ doğrudan uzaklık: duruş boyunca üyelerin yürüdüğü yolun toplamı ÷ ilk konumdan son konuma uzaklıkların toplamı (doğrudan ≥ 0,5 m).
   - İşaret ve jest / duruş: 'seremoni' tur 'it' ve 'bekle' olayları, kalecinin kaydırması (du.hk.kayI); heykel % (du.hk.heykelP).
   - Adımlamada yüz gidiş yönünde: 'adim'de hakemin hızı > 0,5 m/sn olan karelerde gövdenin yönü ile gidişin kosinüsü > 0,5 (kare payı).
   - Düdük → koşu: ilk kullanımda (m.sonKullanim'ın yeni nesnesi; vuruşta koşunun başı) du.t − du.dudukT; ≥ 1 sn %. Düdük → temas: 'kullanim'
     olayında (kullananın ilk dokunuşu) du.t − du.dudukT.
   - Düdükte hakem: 'duduk' olayı (seremonili) anında hızı ≤ 0,3 m/sn %; arkada: toptan kaleye göre ≥ 1 m geride ve gövdesi barajın ortasına
     (du.hk.wc) 45° içinde %.
   - Koşu başında kaleci: ilk kullanımda kalecinin görev yerine (du.gorev) uzaklığı (m), ortanca.
   Tanımlar (s1d_; S1d, 2026-10-20 — kart sahnesi; izleyici s1dIzleyici, araclar/senaryolar/d-sahne.js [1] de kullanır):
   - Kart: 'kart' olayı; hakemin gösterdiği karta (kartSira) sırayla eşlenir. Tarz: sahnenin son tarzı (yürür, çağırır, kalabalık, uzaktan) %.
   - Sahne süresi: 'kartSahne' karar → bitti (gerçek sn), tarz başına ortanca. Düdükten kartın gösterilmesine: 'kart' olayından hakemin 'kart' eyleminin
     ilk karesine (uzaktan hariç). Tepe hız: faz 'play' değilken hakem bir kez 3 m/sn'nin altına indikten sonraki en yüksek hızı (kart başına), ortanca;
     5 m/sn'yi aşan sahne %. Yürür tarzında oyuncunun durduğu kare %: yaklaşmada, tepkiden 0,6 sn sonra, oyuncu serbestken < 0,6 m/sn.
   - Gösterilirken ≤ 5 m %: kartın ilk karesinde hakem–oyuncu (uzaktan hariç). Gösterilmeden biten %: hakem kartı göstermeden sıradaki karta geçti.
   - Kart sürerken kullanılan / maç: kullanım anında kuyrukta sahnesi bitmemiş kart. Düdük → kullanım: düdüğün sahibi kart olan duruşta du.t − du.dudukT.
   - Kalabalık: kişi sayısı (ortalama), protokol kaptan işareti / uyarı (sayı). Kırmızı 12 sn: kırmızı gören karardan 12 sn sonra sahada (kabul 0).
   - Kartlı duruşun süresi (du.t; kart görülen duruş), tür başına (serbestte sınıfı) ortanca.
   Tanımlar (s1b_; S1b, 2026-10-20 — penaltı duruşları, bit kapalıyken de: bugünkü değerler; izleyici s1bIzleyici, araclar/senaryolar/d-sahne.js [2] de
   kullanır): faulden düdüğe — 'duduk' olayı (tur 'penalti'; bit kapalıyken durusKullan'ın düdüğü) anında du.t; düdük → temas — 'kullanim' olayında
   du.t − düdük; faulden temasa — 'kullanim' olayında du.t; düdükten kullanıma ≥ 1 sn — ilk kullanımda (m.sonKullanim) du.t − düdük; evre süresi — du.pk.evre
   başına gerçek sn (yalnız sahneli); itiraz eden — düdükten önce hakemin 4 m içine gelen faul yapan takımın saha oyuncusu (kişi; kart dalı dahil);
   itiraz (oyuncu·sn) — düdükten önce eylemi ya da jesti 'itiraz' olan oyuncuların süresi; kaptan işareti — 'kaptanIsareti' kaynak 'penalti' (penaltı
   payı); işaretten 2 sn sonra hakemin 4 m içinde kaptan dışı savunmacı (kişi); ceza sahasında ya da yayda oyuncu (vurucu ve kaleciler hariç) 5. sn,
   15. sn, düdükte; düdükten önceki son 20 sn'de hareketsiz (< 0,3 m/sn) saha oyuncusu payı (vurucu hariç; 0,25 sn'lik örnekler); hakemin tepe hızı —
   sahnelide itiraz ve boşaltmada, sahnesizde 2. sn'den düdüğe, kart dalı ve bitişinden sonraki 1 sn hariç (m/sn; penaltı başına en çok, ortanca);
   kaos ve varyant payları du.pk'den.
   Tanımlar (s1c_; S1c, 2026-10-21 — gol sonrası, bit kapalıyken de: bugünkü değerler; izleyici s1cIzleyici, araclar/senaryolar/d-sahne.js [3] de
   kullanır): gol → santra — 'goal' olayından 'kickoff' olayına (gerçek sn), bağlam başına: acele (gol yiyen geride ve ikinci yarıda ya da acelede; T10d
   'tasi' — bit kapalıyken 'topuAgdanAldi'), atan (atan takımın acelesi; c.tur 'atan'), koru (gol yiyen önde, kalan < 20 dk), kalanı tarafsız; sevinç
   evresi — c.evre 'kutla'nın süresi; küme — golcünün (c.sc; bit kapalıyken c.scorer) 3 m içinde ≥ 3 arkadaşın ilk anı ve sevinç evresinde kümeli
   zamanın payı; koşu türü — c.tur; topu ağdan alan — 'golTopAl' (kaleci, savunan, atan) ya da 'topuAgdanAldi' (T10d); topun en uzak gidişi — gol
   yiyen kaleden (side·PL) en büyük uzaklık (m); orta çizgiyi geçti — top atan takımın yarısında (x·side < −1); top noktada — 'golTopNokta' (golden
   sn); zincir — 'golTopGonder' sayısı; kovalama — 'kickoff' evresinde top taşınıyor ya da noktadan 0,3 m uzakta (santracı kovalıyor); ışınlama —
   santra stepKick'in 22 sn tavanında (evrenin süresi > 22); hakem — gol ve santra evresinde, bir kez 3 m/sn'nin altına indikten sonra kart
   sırası yokken en yüksek hız, ve yol; düdükten önce
   santra yerinde bekleme (c.hk.bekT); yan hakem — gol evresinde, golden 2 sn sonraki yerine göre (golden önce koşan yan hakemin fren yolu sayılmaz)
   bir yan hakem kale çizgisine 8 m'den yaklaşıp 1 m'den çok ilerledi; tavanın nedeni — zorla düdükte (55 sn) karşılanmayan ön koşullar;
   düdük → santra — 'duduk' (tur 'santra') ile 'kickoff' arası; düdüksüz santra — sahneli golde 'kickoff'tan önce düdük yok; Law 8 — 'kickoff'
   anında kendi yarısında olmayan, orta yuvarlakta rakip ya da noktanın 3 m içinde ikinci oyuncu (kişi); odak kümede — sevinç evresinde c.odak
   golcüye ya da 8 m içindeki kümenin merkezine ≤ 8 m (kare payı).
   Tanımlar (s1e_; S1e, 2026-10-21 — kullananın rutini, du.kr olan duruşlar; korner ve kenar ayrı, düdüklü (barajlı ve penaltı) ayrı): topun konduğu an —
   du.asama'nın 'hazir'a geçtiği du.t; boş bekleme — hazırda kullanan hareketsiz (< 0,2 m/sn), jestsiz, eylemsiz (korner ve kenarda kullanıma dek,
   düdüklüde düdüğe dek; sn/duruş); en uzun kesintisiz boş bekleme (ortanca, %90; bakış noktasının bir karede 2,5 m'den çok sıçraması — başın başka hedefe dönmesi — kesintidir); kullanım − planlanan koşu anı (kr.tKos; ortanca); varyantlar — kr.on
   (sığdırmadan sonra açık: düzelt, sırtla dönüş, el, tekrar), iki kol, okumadan önce dolgu (kr.ek > 0). */
const S1D_SAHIP=['baraj','penalti','kart','santra'];
const S1D_AD={baraj:'barajlı serbest vuruş',penalti:'penaltı',kart:'kart',santra:'santra'};
const s1Ortanca=L=>{if(!L.length)return NaN;const S=L.slice().sort((a,b)=>a-b),n=S.length;return n%2?S[(n-1)/2]:(S[n/2-1]+S[n/2])/2;};
const s1Ort=L=>L.length?L.reduce((a,b)=>a+b,0)/L.length:NaN;
const S1A_EVRE=['top','kaos','adim','cizgi','dizil','yer','dur','duduk'],S1A_TUR=['sakin','olagan','uzun'];
const S1D_TARZ=['yuru','cagir','kalabalik','uzak'],S1D_TARZ_AD={yuru:'yürür',cagir:'çağırır',kalabalik:'kalabalık',uzak:'uzaktan'};
const S1D_DURUS=['baraj','uzak','geri','kenar','penalti','tac','korner','kaleVurusu'];
/* S1d (2026-10-20): kart sahnesinin izleyicisi — k-protokol'ün s1d_ satırları ve araclar/senaryolar/d-sahne.js [1] (birden çok maçta tek örnek: maç
   değişince kart eşlemesi sıfırlanır). Yalnız okur: olaylar ('kart', 'kartSahne', 'kaptanIsareti', 'uyari'), m.refs[0] (kartSira, eylem, hız),
   kart kuyruğunun öğesi (k.s), m.durus, m.sonKullanim. Kartlar 'kart' olayının sırasıyla hakemin gösterdiği karta (kartSira) eşlenir (bit 0'da da).
   Kayıt: {p, renk, t0 (kart olayı; düdük), sahne, no, tarz (son tarz; oyunda uzaktana düşen ayrı sayılmaz), karar (sahnenin kuruluşu), bitti, sure
   (sahne süresi, 'bitti' olayından), gosterT, gosterD (kartın ilk karesinde hakem–oyuncu), yavas, tepe (faz 'play' değilken hakem bir kez 3 m/sn'nin
   altına indikten sonra en yüksek hız), depar (> 5 m/sn), durN, durK (yürür tarzında yaklaşmada, tepkiden 0,6 sn sonra, oyuncu serbestken < 0,6 m/sn
   kare), kal (kalabalığın kişi sayısı), tip ('kaptan' | 'uyari'), kirSahada (kırmızıda karardan — bit 0'da karttan — 12 sn sonra sahada)}.
   Duruşlar: kart görülen duruşun türü (serbestte sınıfı) ve süresi (du.t); kullanım: kart sürerken (kuyrukta sahnesi bitmemiş kart) ve kart sahipli
   düdükten kullanıma (du.t − du.dudukT) */
function s1dIzleyici(){
  const K=[],DU=[],dudKul=[],dudKulDu=[];let m0=null,bek=[],es=new Map(),cur=null,sonK=null,oncekiDu=null,kul=0;const kartli=new WeakSet(),ilkKul=new WeakSet();
  const kaydi=k=>{let r=es.get(k);if(!r&&bek.length){r=bek.shift();es.set(k,r);}return r||null;};
  const kapat=(r,m)=>{if(r&&r.bitti==null)r.bitti=m.t;};
  const mesgul=(p,du)=>!p.oyunda||!!(p.eylem&&p.eylem.kilit)||!!du&&p===du.durduran&&!du.gonderildi&&(du.asama==='bekle'||du.asama==='getir');
  const yeniMac=m=>{if(m===m0)return;m0=m;bek=[];es=new Map();cur=null;sonK=m.sonKullanim;oncekiDu=null;};   /* önceki maçta süren kart kapanmaz (sonu bilinmez) */
  return{K,DU,dudKul,dudKulDu,get kul(){return kul;},
    dinle(ad,v,m){if(!v||!m)return;yeniMac(m);
      if(ad==='kart'){const r={p:v.p,renk:v.renk,t0:m.t,sahne:!!v.sahne,no:null,tarz:null,karar:null,bitti:null,sure:null,gosterT:null,gosterD:null,yavas:false,tepe:0,depar:false,
          durN:0,durK:0,kal:0,tip:null,kirSahada:null};K.push(r);bek.push(r);if(m.phase==='durus'&&m.durus)kartli.add(m.durus);return;}
      if(ad==='kartSahne'){const r=v.evre==='bitti'?K.find(x=>x.no===v.no&&x.p===v.p&&x.sure==null):kaydi(m.refs[0].kartSira);if(!r)return;
        if(v.evre==='karar'){r.no=v.no;r.karar=m.t;}r.tarz=v.tarz;if(v.evre==='bitti')r.sure=v.sure;return;}
      if(ad==='kaptanIsareti'&&v.kaynak==='kart'){const r=kaydi(m.refs[0].kartSira);if(r)r.tip='kaptan';return;}
      if(ad==='uyari'&&v.neden==='kalabalik'){const r=kaydi(m.refs[0].kartSira);if(r)r.tip='uyari';}},
    adim(m){yeniMac(m);
      const h=m.refs[0],k=h.kartSira;
      if(k!==cur){if(cur)kapat(es.get(cur),m);cur=k;}
      const r=k?kaydi(k):null;
      if(r){const S=k.s,v=Math.hypot(h.vx||0,h.vz||0),p=r.p;
        if(m.phase!=='play'){if(v<3)r.yavas=true;if(r.yavas){if(v>r.tepe)r.tepe=v;if(v>5)r.depar=true;}}
        if(r.gosterT==null&&h.eylem&&h.eylem.ad==='kart'){r.gosterT=m.t;r.gosterD=Math.hypot(h.x-p.x,h.z-p.z);}
        if(S){r.tarz=S.tarz;if(S.K)r.kal=S.K.uyeler.length;
          const du=m.phase==='durus'?m.durus:null;
          if(S.tarz==='yuru'&&S.evre==='yaklas'&&S.et>=S.Tr+0.6&&du&&du.kullanan!==p&&!mesgul(p,du)){r.durN++;if(Math.hypot(p.vx||0,p.vz||0)<0.6)r.durK++;}}}
      /* kırmızı: karardan (bit 0'da karttan) 12 sn sonra sahada mı */
      for(const x of K)if(x.kirSahada==null&&x.renk!=='sari'){const t=x.sahne?x.karar:x.t0;if(t!=null&&m.t-t>12)x.kirSahada=!!x.p.oyunda;}
      /* kullanım: kart sürerken ve kart sahipli düdükten kullanıma */
      const KU=m.sonKullanim,du=m.phase==='durus'&&m.durus?m.durus:oncekiDu;
      if(KU&&KU!==sonK&&du){const ks=h.kartSira;if(ks&&!(ks.s&&ks.s.evre==='bitti'))kul++;
        if(du.dudukGerek==='kart'&&du.dudukT!=null&&!ilkKul.has(du)){ilkKul.add(du);dudKul.push(du.t-du.dudukT);dudKulDu.push({tur:du.tur,sinif:du.sinif||null,t:du.t,dudukT:du.dudukT,ag:du.zorlaHazir,kartBitT:du.kartBitT});}}   /* ilk kullanım (kısa geri dönüşün ikincisi değil) */
      sonK=KU;
      /* kartlı duruşun süresi */
      const simdi=m.phase==='durus'?m.durus:null;
      if(oncekiDu&&oncekiDu!==simdi&&kartli.has(oncekiDu)){const d=oncekiDu;DU.push({tur:d.tur==='serbest'?(d.sinif||'serbest'):d.tur,sure:d.t});}
      oncekiDu=simdi;},
    bitir(){}};   /* maçın sonunda süren kart kapanmaz */
}
/* S1b (2026-10-20): penaltı duruşunun izleyicisi — k-protokol'ün s1b_ satırları ve araclar/senaryolar/d-sahne.js [2] (birden çok maçta tek örnek). Yalnız
   okur: olaylar ('duduk', 'kullanim', 'kaptanIsareti', 'kart', 'goal'), m.durus (du.pk), m.refs[0], oyuncuların konumu, hızı, eylemi ve jesti, m.sonKullanim.
   Kayıt: {du, sahneli, kaos, varyant (kaleciItiraz, kaleciOyun, karsi, duzelt, sari), ev {evre: sn}, duduk (du.t), seremoni, kul (ilk kullanımda du.t),
   temas (du.t), temasM (m.t), it (kişi), itSn, kaptan (işaret sayısı), kaptanT, ihlal (kişi), kutu5, kutu15, kutuD, durgun [hareketsiz, örnek], hk (m/sn),
   kart (duruşta gösterilen kart), gol (temastan 5 sn içinde)} */
const S1B_PL=52.5,S1B_MZ=34,S1B_CU=16.5,S1B_CW=20.16,S1B_EVRE=['goster','itiraz','bosalt','hazir','duduk'],S1B_VAR=['kaleciItiraz','kaleciOyun','karsi','duzelt','sari'];
function s1bIzleyici(){
  const L=[];let m0=null,cur=null,sonK=null,son=null;
  const kutuda=(m,du,q)=>{const gx=m.dir[du.takim]*S1B_PL;return Math.abs(q.x-gx)<S1B_CU&&Math.abs(q.z-S1B_MZ)<S1B_CW||Math.hypot(q.x-du.x,q.z-du.z)<9.15;};
  const kutuSay=(m,du)=>{let n=0;for(const q of m.players)if(q.oyunda&&q.rol!=='GK'&&q!==du.kullanan&&kutuda(m,du,q))n++;return n;};
  const kapat=()=>{const r=cur;cur=null;if(!r)return;const du=r.du,P=du.pk;
    if(P){r.kaos=P.kaos;r.varyant={kaleciItiraz:!!P.kaleciItiraz,kaleciOyun:!!P.kaleciOyun,karsi:!!P.karsi,duzelt:!!P.duzelt,sari:!!P.sari};}
    const D=r.duduk!=null?r.duduk:r.kul;if(D!=null){let a=0,b=0;for(const o of r.ornek)if(o[0]<D&&o[0]>=D-20){a+=o[1];b+=o[2];}r.durgun=[a,b];}
    r.it=r.itSet.size;delete r.itSet;delete r.ornek;L.push(r);son=r;};
  const yeniMac=m=>{if(m===m0)return;if(cur)kapat();m0=m;sonK=m.sonKullanim;son=null;};
  return{L,
    dinle(ad,v,m){if(!m)return;yeniMac(m);
      if(ad==='duduk'&&v&&v.tur==='penalti'&&cur&&cur.duduk==null){cur.duduk=cur.du.t;cur.seremoni=!!v.seremoni;cur.kutuD=kutuSay(m,cur.du);}
      else if(ad==='kullanim'&&v&&v.tur==='penalti'&&v.du){const r=cur&&cur.du===v.du?cur:L.find(x=>x.du===v.du);if(r&&r.temas==null){r.temas=v.du.t;r.temasM=m.t;}}
      else if(ad==='kaptanIsareti'&&v&&v.kaynak==='penalti'&&cur){cur.kaptan++;if(cur.kaptanT==null)cur.kaptanT=cur.du.t;}
      else if(ad==='kart'&&cur)cur.kart++;
      else if(ad==='goal'){const r=son&&son.temasM!=null?son:cur&&cur.temasM!=null?cur:null;if(r&&m.t-r.temasM<=5)r.gol=true;}},
    adim(m){yeniMac(m);
      const du=m.phase==='durus'&&m.durus&&m.durus.tur==='penalti'?m.durus:null,h=m.refs[0];
      const KU=m.sonKullanim;if(cur&&KU&&KU!==sonK&&cur.kul==null&&(du===cur.du||!du))cur.kul=cur.du.t;sonK=KU;
      if(cur&&cur.du!==du)kapat();
      if(!du)return;
      if(!cur)cur={du,sahneli:!!du.pk,kaos:null,varyant:null,ev:{},duduk:null,seremoni:false,kul:null,temas:null,temasM:null,itSet:new Set(),itSn:0,kaptan:0,kaptanT:null,ihlal:null,
        kutu5:null,kutu15:null,kutuD:null,ornek:[],ok:0,durgun:null,hk:0,kartSon:-9,kart:0,gol:false};
      const r=cur,dt=1/60,P=du.pk,once=r.duduk==null;
      if(P)r.ev[P.evre]=(r.ev[P.evre]||0)+dt;
      if(h&&h.kartSira)r.kartSon=m.t;
      if(once){const sv=1-du.takim;
        if(h)for(const q of m.teams[sv])if(q.oyunda&&q.rol!=='GK'&&Math.hypot(q.x-h.x,q.z-h.z)<4)r.itSet.add(q);
        for(const q of m.players)if(q.oyunda&&(q.eylem&&q.eylem.ad==='itiraz'||q.jest&&q.jest.tur==='itiraz'&&(q.jest.t||0)<(q.jest.sure||0)))r.itSn+=dt;
        if(r.kutu5==null&&du.t>=5)r.kutu5=kutuSay(m,du);if(r.kutu15==null&&du.t>=15)r.kutu15=kutuSay(m,du);
        if(++r.ok%15===0){let a=0,b=0;for(const q of m.players){if(!q.oyunda||q.rol==='GK'||q===du.kullanan)continue;b++;if(Math.hypot(q.vx||0,q.vz||0)<0.3)a++;}r.ornek.push([du.t,a,b]);}
        const hz=P?(P.evre==='itiraz'||P.evre==='bosalt'):du.t>=2;
        if(h&&hz&&!h.kartSira&&m.t-r.kartSon>=1){const v=Math.hypot(h.vx||0,h.vz||0);if(v>r.hk)r.hk=v;}
        if(r.kaptanT!=null&&r.ihlal==null&&du.t>=r.kaptanT+2&&h){const kp=P&&P.kaptan;let n=0;for(const q of m.teams[sv])if(q.oyunda&&q.rol!=='GK'&&q!==kp&&Math.hypot(q.x-h.x,q.z-h.z)<4)n++;r.ihlal=n;}}},
    bitir(){if(cur)kapat();}};
}
/* S1b: izleyicinin kayıtlarından satır değerleri (k-protokol bitir ve d-sahne [2]) */
function s1bOzet(L){const say=f=>L.filter(f).length,sayi=f=>L.map(f).filter(x=>x!=null&&Number.isFinite(x)),S=L.filter(x=>x.sahneli),r={ham:{}};
  r.s1b_n=L.length;r.ham.s1b_sahneli=[S.length,L.length];
  r.s1b_duduk=s1Ortanca(sayi(x=>x.duduk));r.s1b_temas=s1Ortanca(sayi(x=>x.temas));r.s1b_dudukTemas=s1Ortanca(sayi(x=>x.temas!=null&&x.duduk!=null?x.temas-x.duduk:null));
  const B=sayi(x=>x.kul!=null&&x.duduk!=null?x.kul-x.duduk:null);r.ham.s1b_bek1=[B.filter(x=>x>=1).length,B.length];
  for(const e of S1B_EVRE)r['s1b_ev_'+e]=s1Ortanca(S.map(x=>x.ev[e]||0));
  r.s1b_kalabalik=s1Ort(sayi(x=>x.it));r.s1b_itirazSn=s1Ort(sayi(x=>x.itSn));r.ham.s1b_kaptan=[say(x=>x.kaptan>0),L.length];r.s1b_ihlal=s1Ort(sayi(x=>x.ihlal));
  r.s1b_kutu5=s1Ort(sayi(x=>x.kutu5));r.s1b_kutu15=s1Ort(sayi(x=>x.kutu15));r.s1b_kutuD=s1Ort(sayi(x=>x.kutuD));
  r.ham.s1b_durgun=[L.reduce((a,x)=>a+(x.durgun?x.durgun[0]:0),0),L.reduce((a,x)=>a+(x.durgun?x.durgun[1]:0),0)];
  r.s1b_hkHiz=s1Ortanca(sayi(x=>x.duduk!=null||x.kul!=null?x.hk:null));r.s1b_kaos=s1Ort(sayi(x=>x.kaos));
  for(const k of S1B_VAR)r.ham['s1b_'+k]=[say(x=>x.varyant&&x.varyant[k]),S.length];
  return r;}
/* S1c (2026-10-21): gol sonrasının izleyicisi — k-protokol'ün s1c_ satırları ve araclar/senaryolar/d-sahne.js [3] (birden çok maçta tek örnek).
   Yalnız okur: olaylar ('goal', 'golTopAl', 'topuAgdanAldi', 'golTopGonder', 'golTopNokta', 'duduk', 'kickoff'), m.celeb, m.ball, m.refs, m.players,
   m.score, m.half, m.gameSec, m.phase, m.phaseT, m.dir. Kayıt: {t0, sahneli, baglam, tur, sevincT, kutla, kumeT, kumeK, kumeN, alan, topUzak, gecti,
   nokta, zincir, kovala, isinla, hkTepe, hkYol, hkBek, yh, dudukT, tavan, santra, dudukSantra, law8, odakK, odakN, kart} */
const S1C_BAGLAM=['std','acele','atan','koru'],S1C_BAGLAM_AD={std:'tarafsız',acele:'gol yiyen geride (T10d)',atan:'atan takım acele',koru:'gol yiyen önde'};
const S1C_TUR=['kose','tribun','pasci','kulube','yerinde','atan'],S1C_ALAN=['kaleci','savunan','atan','T10d'];
function s1cIzleyici(){
  const L=[];let m0=null,cur=null,yh0=null;
  const yeniMac=m=>{if(m===m0)return;if(cur)L.push(cur);cur=null;m0=m;};
  const kapat=()=>{if(cur)L.push(cur);cur=null;};
  return{L,
    dinle(ad,v,m){if(!m)return;yeniMac(m);
      if(ad==='goal'&&v){if(cur)kapat();const c=m.celeb||{},att=v.team,kt=1-att,s=m.score,fark=s[kt]-s[att],kalan=m.half===1?45+Math.max(0,2700-m.gameSec)/60:Math.max(0,5400-m.gameSec)/60;
        const koru=fark>0&&kalan<20;
        cur={t0:m.t,side:c.side,att,kt,sahneli:!!c.s1,baglam:c.s1?(c.alan?'acele':c.tur==='atan'?'atan':koru?'koru':'std'):(koru?'koru':'std'),tur:v.tur||null,sevincT:v.sevincT,
          kutla:null,kumeT:null,kumeK:0,kumeN:0,alan:null,topUzak:0,gecti:false,nokta:null,zincir:0,kovala:false,isinla:false,hkTepe:0,hkYol:0,hkX:null,hkZ:null,hkBek:null,
          yh:false,yavas:false,dudukT:null,tavan:false,santra:null,dudukSantra:null,law8:null,odakK:0,odakN:0,kart:false};
        yh0=null;return;}
      if(!cur)return;
      if(ad==='topuAgdanAldi'){cur.alan='T10d';if(!cur.sahneli)cur.baglam='acele';}
      else if(ad==='golTopAl'&&v&&cur.alan==null)cur.alan=v.p.rol==='GK'?'kaleci':v.p.team===cur.kt?'savunan':'atan';
      else if(ad==='golTopGonder')cur.zincir++;
      else if(ad==='golTopNokta'&&cur.nokta==null)cur.nokta=m.t-cur.t0;
      else if(ad==='kart')cur.kart=true;
      else if(ad==='duduk'&&v&&v.tur==='santra'&&cur.dudukT==null){cur.dudukT=m.t-cur.t0;cur.tavan=!!v.tavan;const c=m.celeb;if(c&&c.hk)cur.hkBek=c.hk.bekT;
        if(v.tavan&&c){const b=m.ball,N=[],kt=c.kt;if(b.tasiyan||Math.hypot(b.x,b.z-34)>0.3)N.push('top:'+(c.top&&c.top.evre));if(!c.hk||c.hk.evre!=='bekle')N.push('hakem:'+(c.hk&&c.hk.evre));
          if(m.sakatlikAkis)N.push('sakatlik');if(m.refs[0].kartSira)N.push('kart');
          for(const p of m.players){if(!p.oyunda||p.sakat)continue;const d=Math.hypot(p.x,p.z-34);if(p.x*m.dir[p.team]>0.3)N.push('yari:'+p.rol);else if(p.team!==kt&&d<9.15)N.push('yuvarlak:'+p.rol);}
          cur.tavanNeden=N.slice(0,6).join(',');}}
      else if(ad==='kickoff'&&v){cur.santra=m.t-cur.t0;cur.isinla=m.phaseT>22;if(cur.dudukT!=null)cur.dudukSantra=cur.santra-cur.dudukT;
        let n=0,kt=v.team,s1=null,e1=1e9;for(const p of m.teams[kt]){if(!p.oyunda||p.sakat)continue;const d=Math.hypot(p.x,p.z-34);if(d<e1){e1=d;s1=p;}}
        for(const p of m.players){if(!p.oyunda||p.sakat||p===s1)continue;const d=Math.hypot(p.x,p.z-34);if(p.x*m.dir[p.team]>0.3||p.team!==kt&&d<9.15||d<3)n++;}
        cur.law8=n;kapat();}},
    adim(m){yeniMac(m);if(!cur)return;
      const ph=m.phase;if(ph!=='goal'&&ph!=='kickoff')return;
      const b=m.ball,c=m.celeb,h=m.refs[0];
      const uz=Math.hypot(b.x-cur.side*52.5,b.z-34);if(uz>cur.topUzak)cur.topUzak=uz;if(b.x*cur.side<-1)cur.gecti=true;
      if(ph==='kickoff'&&(b.tasiyan||Math.hypot(b.x,b.z-34)>0.3))cur.kovala=true;
      {const v=Math.hypot(h.vx||0,h.vz||0);if(v<3)cur.yavas=true;if(cur.yavas&&!h.kartSira&&!(h.eylem&&h.eylem.ad==='kart')&&v>cur.hkTepe)cur.hkTepe=v;}
      if(cur.hkX!=null)cur.hkYol+=Math.hypot(h.x-cur.hkX,h.z-cur.hkZ);cur.hkX=h.x;cur.hkZ=h.z;
      if(ph==='goal'){const r=m.refs;if(!yh0&&m.phaseT>=2)yh0=[Math.abs(r[1].x),Math.abs(r[2].x)];
        if(yh0)for(let i=1;i<=2;i++){const ax=Math.abs(r[i].x);if(ax>52.5-8&&ax-yh0[i-1]>1)cur.yh=true;}
        const sc=c&&(c.sc!==undefined?c.sc:c.own?null:c.scorer),kutla=c&&(c.s1?c.evre==='kutla':m.phaseT<7);
        if(kutla){cur.kutla=m.phaseT;
          if(sc){let n=0,kx=sc.x*2,kz=sc.z*2,kn=2;for(const p of m.teams[cur.att]){if(p===sc||!p.oyunda)continue;const d=Math.hypot(p.x-sc.x,p.z-sc.z);if(d<3)n++;if(d<8){kx+=p.x;kz+=p.z;kn++;}}
            cur.kumeN++;if(n>=3){cur.kumeK++;if(cur.kumeT==null)cur.kumeT=m.phaseT;}
            if(c.odak){cur.odakN++;const o=c.odak;if(Math.hypot(o.x-sc.x,o.z-sc.z)<=8||Math.hypot(o.x-kx/kn,o.z-kz/kn)<=8)cur.odakK++;}}}}},
    bitir(){kapat();}};
}
/* S1c: izleyicinin kayıtlarından satır değerleri (k-protokol bitir ve d-sahne [3]) */
function s1cOzet(L){const say=f=>L.filter(f).length,sayi=f=>L.map(f).filter(x=>x!=null&&Number.isFinite(x)),r={ham:{}};
  const S=L.filter(x=>x.santra!=null);r.s1c_n=L.length;r.ham.s1c_sahneli=[say(x=>x.sahneli),L.length];
  for(const k of S1C_BAGLAM)r['s1c_santra_'+k]=s1Ortanca(sayi(x=>x.baglam===k?x.santra:null));
  r.s1c_santra=s1Ortanca(sayi(x=>x.santra));r.s1c_kutla=s1Ortanca(sayi(x=>x.kutla));r.s1c_kumeT=s1Ortanca(sayi(x=>x.kumeT));
  r.ham.s1c_kumeP=[L.reduce((a,x)=>a+x.kumeK,0),L.reduce((a,x)=>a+x.kumeN,0)];
  for(const k of S1C_TUR)r.ham['s1c_tur_'+k]=[say(x=>x.tur===k),say(x=>x.tur!=null)];
  for(const k of S1C_ALAN)r.ham['s1c_alan_'+k]=[say(x=>x.alan===k),say(x=>x.alan!=null)];
  r.s1c_topUzak=s1Ort(sayi(x=>x.topUzak));r.ham.s1c_gecti=[say(x=>x.gecti),L.length];r.s1c_nokta=s1Ortanca(sayi(x=>x.nokta));r.s1c_zincir=s1Ort(sayi(x=>x.sahneli?x.zincir:null));
  r.ham.s1c_kovala=[say(x=>x.kovala),S.length];r.ham.s1c_isinla=[say(x=>x.isinla),S.length];
  r.s1c_hkTepe=s1Ortanca(sayi(x=>x.kart?null:x.hkTepe));r.s1c_hkYol=s1Ort(sayi(x=>x.hkYol));r.s1c_hkBek=s1Ortanca(sayi(x=>x.hkBek));
  r.ham.s1c_yh=[say(x=>x.yh),L.length];r.s1c_dudukSantra=s1Ortanca(sayi(x=>x.dudukSantra));
  r.ham.s1c_duduksuz=[say(x=>x.sahneli&&x.santra!=null&&x.dudukT==null),say(x=>x.sahneli&&x.santra!=null)];r.s1c_law8=s1Ort(sayi(x=>x.law8));
  r.ham.s1c_tavan=[say(x=>x.tavan),say(x=>x.dudukT!=null)];r.s1c_tavanNeden=L.filter(x=>x.tavanNeden).map(x=>x.tavanNeden).slice(0,3).join(' | ')||null;r.ham.s1c_odak=[L.reduce((a,x)=>a+x.odakK,0),L.reduce((a,x)=>a+x.odakN,0)];
  return r;}
module.exports={
  bilgi:[['— S1: sahne protokolleri (k-protokol; S1-0 ortak düdük) —',null,0],['Seremonili düdük / maç','s1D_n',2]]
    .concat(S1D_SAHIP.map(k=>['Seremonili düdük / maç: '+S1D_AD[k],'s1D_'+k,2]))
    .concat([['Düdük → kullanım ortancası (gerçek sn)','s1D_bek',2],['Düdük → kullanım ≥ 1 sn %','s1D_bek1',1],
      ['Düdükte hakem ≤ 0,3 m/sn %','s1D_dur',1],['Düdüksüz kullanım / maç (kabul 0)','s1D_dudukYok',2],
      ['Düdükten önce kullanım / maç (kabul 0)','s1D_once',2],
      ['Sağlıkçı: kulübedeki yerinden 1,5 m uzakta (kişi × gerçek sn / maç; bilgi)','s1D_saglikci',1]])
    .concat([['— S1a: seremonili barajlı serbest vuruş (k-protokol) —',null,0],['S1a: seremonili barajlı vuruş / maç','s1a_n',2]])
    .concat(S1A_EVRE.map(e=>['S1a: evreye giriş, '+e+' (duruşun başından gerçek sn; ortanca)','s1a_ev_'+e,1]))
    .concat(S1A_TUR.map(k=>['S1a: varyant '+k+' %','s1a_tur_'+k,1]))
    .concat([['S1a: planlanan kaos (gerçek sn; ortanca)','s1a_kaosT',1],['S1a: adımlamadan önce baraj dizili (≤ 1 m) %','s1a_once',1],
      ['S1a: kaosta üyenin topa en yakın uzaklığı (m; ortanca)','s1a_yakin',2],['S1a: kaosta topa 9,15 m içinde savunmacı (en çok; ortalama)','s1a_kalabalik',2],
      ['S1a: üye yolu ÷ doğrudan uzaklık (ortanca)','s1a_yol',2],['S1a: geri itme işareti / duruş','s1a_it',2],['S1a: kalecinin kaydırması / duruş','s1a_kay',2],
      ['S1a: "düdüğü bekle" işareti / duruş','s1a_bekle',2],['S1a: heykel %','s1a_heykel',1],['S1a: adımlamada yüz gidiş yönünde (kare) %','s1a_yuz',1],
      ['S1a: düdük → koşu (gerçek sn; ortanca)','s1a_dudukKos',2],['S1a: düdük → koşu ≥ 1 sn %','s1a_duduk1',1],['S1a: düdük → temas (gerçek sn; ortanca)','s1a_dudukTemas',2],
      ['S1a: düdükte hakem durmuş (≤ 0,3 m/sn) %','s1a_hkDur',1],['S1a: düdükte hakem vurucunun arkasında, yüzü barajda %','s1a_hkArka',1],
      ['S1a: koşu başında kalecinin görev yerine uzaklığı (m; ortanca)','s1a_kaleci',2]])
    .concat([['— S1d: kart sahnesi (k-protokol) —',null,0],['S1d: kart / maç','s1d_n',2]])
    .concat(S1D_TARZ.map(k=>['S1d: tarz '+S1D_TARZ_AD[k]+' %','s1d_tarz_'+k,1]))
    .concat(S1D_TARZ.map(k=>['S1d: sahne süresi, '+S1D_TARZ_AD[k]+' (gerçek sn; ortanca)','s1d_sure_'+k,1]))
    .concat([['S1d: düdükten kartın gösterilmesine (gerçek sn; uzaktan hariç, ortanca)','s1d_goster',1],['S1d: hakemin tepe hızı, yavaşladıktan sonra (m/sn; ortanca)','s1d_tepe',2],
      ['S1d: hakemin 5 m/sn üstüne çıktığı sahne % (kabul 0)','s1d_depar',1],['S1d: yürür tarzında oyuncunun durduğu kare %','s1d_dur',1],
      ['S1d: gösterilirken hakem–oyuncu ≤ 5 m % (uzaktan hariç)','s1d_yakin',1],['S1d: kart gösterilmeden biten % (kabul 0)','s1d_gorunmez',1],
      ['S1d: kart sürerken kullanılan duran top / maç (kabul 0)','s1d_kul',2],['S1d: kartın düdüğünden kullanıma (gerçek sn; ortanca)','s1d_dudukKul',2],
      ['S1d: kalabalıkta hakeme gelen (kişi; ortalama)','s1d_kal',2],['S1d: kalabalıkta kaptan işareti / maç','s1d_kaptan',2],['S1d: kalabalıkta uyarı / maç','s1d_uyari',2],
      ['S1d: kırmızı gören karardan 12 sn sonra sahada / maç (kabul 0)','s1d_kirmizi',2]])
    .concat(S1D_DURUS.map(k=>['S1d: kartlı duruşun süresi, '+k+' (gerçek sn; ortanca)','s1d_durus_'+k,1]))
    .concat([['— S1b: penaltı sahnesi (k-protokol; bit kapalıyken bugünkü değerler) —',null,0],['S1b: penaltı / maç','s1b_n',2],['S1b: sahneli %','s1b_sahneli',1],
      ['S1b: faulden düdüğe (gerçek sn; ortanca)','s1b_duduk',1],['S1b: faulden temasa (gerçek sn; ortanca)','s1b_temas',1],['S1b: düdük → temas (gerçek sn; ortanca)','s1b_dudukTemas',2],
      ['S1b: düdükten kullanıma ≥ 1 sn %','s1b_bek1',1]])
    .concat(S1B_EVRE.map(e=>['S1b: evre süresi, '+e+' (gerçek sn; ortanca, sahneli)','s1b_ev_'+e,1]))
    .concat([['S1b: itiraz eden, hakemin 4 m içine gelen (kişi; ortalama)','s1b_kalabalik',2],['S1b: itiraz (oyuncu·sn; ortalama)','s1b_itirazSn',1],
      ['S1b: kaptan işareti %','s1b_kaptan',1],['S1b: işaretten 2 sn sonra 4 m içinde kaptan dışı (kişi; ortalama)','s1b_ihlal',2],
      ['S1b: ceza sahasında ve yayda oyuncu, 5. sn (ortalama)','s1b_kutu5',2],['S1b: ceza sahasında ve yayda oyuncu, 15. sn (ortalama)','s1b_kutu15',2],
      ['S1b: ceza sahasında ve yayda oyuncu, düdükte (ortalama)','s1b_kutuD',2],["S1b: düdükten önceki son 20 sn'de hareketsiz saha oyuncusu %",'s1b_durgun',1],
      ['S1b: hakemin tepe hızı, itiraz ve boşaltmada — kart hariç (m/sn; ortanca)','s1b_hkHiz',2],['S1b: kaos (ortalama)','s1b_kaos',2]])
    .concat(S1B_VAR.map(k=>['S1b: varyant '+k+' %','s1b_'+k,1]))
    .concat([['— S1e: kullananın rutini (k-protokol; du.kr olan duruşlar) —',null,0],['S1e: rutinli korner / maç','s1e_kN',2],['S1e: rutinli kenar / maç','s1e_eN',2],
      ['S1e: rutinli düdüklü (barajlı, penaltı) / maç','s1e_dN',2],['S1e: kornerde top konduğu an (duruşun başından sn; ortanca)','s1e_kYer',1],
      ['S1e: kornerde boş bekleme (sn/korner; ortanca)','s1e_kBos',2],['S1e: kornerde en uzun kesintisiz boş bekleme (sn; ortanca)','s1e_kRun',2],['S1e: kornerde en uzun kesintisiz boş bekleme (sn; %90)','s1e_kRun9',2],
      ['S1e: kenarda en uzun kesintisiz boş bekleme (sn; %90)','s1e_eRun9',2],['S1e: düdüklüde düdükten önceki en uzun boş bekleme (sn; %90)','s1e_dRun9',2],
      ['S1e: kullanım − planlanan koşu anı (sn; ortanca, korner ve kenar)','s1e_kul',2],['S1e: varyant düzelt %','s1e_v_duzelt',1],['S1e: varyant sırtla dönüş %','s1e_v_don',1],
      ['S1e: varyant el işareti %','s1e_v_el',1],['S1e: varyant kolun tekrarı %','s1e_v_tekrar',1],['S1e: iki kol %','s1e_v_iki',1],['S1e: okumadan önce dolgu %','s1e_v_dolgu',1]])
    .concat([['— S1c: gol sonrası (k-protokol; bit kapalıyken bugünkü değerler) —',null,0],['S1c: gol / maç','s1c_n',2],['S1c: sahneli %','s1c_sahneli',1],
      ['S1c: gol → santra (gerçek sn; ortanca, hepsi)','s1c_santra',1]])
    .concat(S1C_BAGLAM.map(k=>['S1c: gol → santra, '+S1C_BAGLAM_AD[k]+' (gerçek sn; ortanca)','s1c_santra_'+k,1]))
    .concat([['S1c: sevinç evresi (gerçek sn; ortanca)','s1c_kutla',1],['S1c: küme — golcünün 3 m içinde ≥ 3 arkadaş, ilk an (sn; ortanca)','s1c_kumeT',1],
      ['S1c: sevinç evresinde kümeli zaman %','s1c_kumeP',1]])
    .concat(S1C_TUR.map(k=>['S1c: golcünün koşu türü '+k+' %','s1c_tur_'+k,1]))
    .concat(S1C_ALAN.map(k=>['S1c: topu ağdan alan '+k+' %','s1c_alan_'+k,1]))
    .concat([['S1c: topun gol yiyen kaleden en uzak gidişi (m; ortalama)','s1c_topUzak',1],['S1c: top atan takımın yarısına geçti % (kabul 0)','s1c_gecti',1],
      ['S1c: top noktada, golden (sn; ortanca)','s1c_nokta',1],['S1c: zincirde gönderme (ortalama, sahneli)','s1c_zincir',2],
      ['S1c: santracı kovaladı % (kabul 0)','s1c_kovala',1],['S1c: stepKick tavanında ışınlanan santra % (kabul 0)','s1c_isinla',1],
      ['S1c: hakemin tepe hızı, kartsız (m/sn; ortanca)','s1c_hkTepe',2],['S1c: hakemin yolu (m; ortalama)','s1c_hkYol',1],['S1c: hakem santra yerinde, düdükten önce (sn; ortanca)','s1c_hkBek',1],
      ['S1c: yan hakem kale çizgisine gitti % (kabul 0)','s1c_yh',1],['S1c: düdük → santra (gerçek sn; ortanca)','s1c_dudukSantra',2],
      ['S1c: düdüksüz santra, sahneli % (kabul 0)','s1c_duduksuz',1],['S1c: santrada Law 8 ihlali (kişi / santra; kabul 0)','s1c_law8',2],
      ['S1c: tavanda zorla düdük % (kabul 0)','s1c_tavan',1],['S1c: sevinçte odak kümede (kare) %','s1c_odak',1]]),
  yeni:()=>{
    const N={};for(const k of S1D_SAHIP)N[k]=0;
    let n=0,dur=0,durN=0,yok=0,once=0,bek1=0,sg=0,sonK=null,oncekiDu=null;const bek=[];
    /* S1a: duruşun kaydı (A) ve kapanan kayıtlar (AL) */
    let A=null;const AL=[];
    const D=s1dIzleyici();   /* S1d */
    const PB=s1bIzleyici();   /* S1b */
    const PC=s1cIzleyici();   /* S1c */
    /* S1e: rutinli duruşlar (E: süren, EL: kapanan) */
    let E=null;const EL=[];
    const eKapat=()=>{if(E&&E.yerT!=null)EL.push(E);E=null;};
    const aYeni=du=>{const yol=new Map();for(const p of du.barajdakiler||[])yol.set(p,{s:0,x:p.x,z:p.z,x0:p.x,z0:p.z});
      return{du,ev:{},yol,once:null,yakin:Infinity,k9:0,it:0,bekle:0,adN:0,adI:0,kos:null,temas:null,hkDur:null,hkArka:null,kaleci:null};};
    const aKapat=()=>{const a=A;A=null;if(!a)return;const H=a.du.hk;a.tur=H.tur;a.kaosT=H.kaosT;a.kay=H.kayI||0;a.heykel=!!H.heykelP;
      let s=0,dd=0;for(const k of a.yol.values()){s+=k.s;dd+=Math.hypot(k.x-k.x0,k.z-k.z0);}a.yolOran=dd>=0.5?s/dd:null;AL.push(a);};
    const aIzle=(a,du,m)=>{const H=du.hk,e=H.evre,h=m.refs[0];if(a.ev[e]==null)a.ev[e]=du.t;
      for(const [p,k] of a.yol){k.s+=Math.hypot(p.x-k.x,p.z-k.z);k.x=p.x;k.z=p.z;}
      if(e==='adim'&&a.once==null){let hepsi=true;for(const [p,y] of du.barajYer)if(p.oyunda&&Math.hypot(p.x-y.x,p.z-y.z)>1.0)hepsi=false;a.once=hepsi;}
      if(e==='kaos'){for(const p of du.barajdakiler)if(p.oyunda){const L=Math.hypot(p.x-du.x,p.z-du.z);if(L<a.yakin)a.yakin=L;}
        let k9=0;for(const q of m.teams[1-du.takim])if(q.oyunda&&q.rol!=='GK'&&Math.hypot(q.x-du.x,q.z-du.z)<9.15)k9++;if(k9>a.k9)a.k9=k9;}
      if(e==='adim'&&h){const v=Math.hypot(h.vx||0,h.vz||0);if(v>0.5){a.adN++;if((Math.cos(h.yon)*h.vx+Math.sin(h.yon)*h.vz)/v>0.5)a.adI++;}}};
    return{
      dinle(ad,v,m){
        if(!v||!m)return;
        D.dinle(ad,v,m);PB.dinle(ad,v,m);PC.dinle(ad,v,m);
        if(A&&m.durus===A.du){
          if(ad==='seremoni'){if(v.tur==='it')A.it++;else if(v.tur==='bekle')A.bekle++;}
          else if(ad==='duduk'&&v.seremoni&&A.hkDur==null){const h=m.refs[0],du=A.du,d=m.dir[du.takim],W=du.hk.wc;A.hkDur=(h.spd||0)<=0.3;
            let ok=(h.x-du.x)*d<=-1;if(ok&&W){let f=Math.atan2(W.z-h.z,W.x-h.x)-h.yon;f=Math.atan2(Math.sin(f),Math.cos(f));ok=Math.abs(f)<=Math.PI/4;}A.hkArka=ok;}}
        if(A&&ad==='kullanim'&&v.du===A.du&&A.temas==null&&A.du.dudukT!=null)A.temas=A.du.t-A.du.dudukT;
        if(ad!=='duduk'||!v.seremoni)return;n++;
        const k=v.tur==='santra'?'santra':v.sahip;if(k in N)N[k]++;
        const h=m.refs&&m.refs[0];if(h){durN++;if((h.spd||0)<=0.3)dur++;}},
      adim(m){
        D.adim(m);PB.adim(m);PC.adim(m);
        {const du=m.phase==='durus'?m.durus:null;if(E&&E.du!==du)eKapat();
          if(du&&du.kr){const R=du.kr,tk=du.kullanan;if(!E)E={du,tur:du.sahneTur||du.tur,dB:R.dudukBagli,yerT:null,bos:0,run:0,maxRun:0,kul:null,on:null,iki:R.kol&&R.iki,kol:R.kol,ek:0};
            if(du.asama==='hazir'||du.asama==='kullan'){if(E.yerT==null)E.yerT=du.t;
              if(du.asama==='hazir'&&(!R.dudukBagli||du.dudukT==null)&&tk){const j=tk.jest,bos=Math.hypot(tk.vx||0,tk.vz||0)<0.2&&!(j&&(j.t||0)<(j.sure||0))&&!tk.eylem;
                const B=R.bakis;if(B){if(E.bx!=null&&Math.hypot(B.x-E.bx,B.z-E.bz)>2.5)E.run=0;E.bx=B.x;E.bz=B.z;}
                if(bos){E.bos+=1/60;E.run+=1/60;if(E.run>E.maxRun)E.maxRun=E.run;}else E.run=0;}
              if(du.asama==='kullan'&&E.kul==null){E.kul=R.dudukBagli?null:du.t-R.tKos;E.on=R.on;E.ek=R.ek;}}}}
        const K=m.sonKullanim,du=m.phase==='durus'&&m.durus?m.durus:oncekiDu;
        if(K&&K!==sonK&&du&&du.dudukGerek){
          if(du.dudukT==null)yok++;
          else{const s=du.t-du.dudukT;bek.push(s);if(s>=1)bek1++;if(s<(du.dudukBek||0)-1e-6)once++;}}
        /* S1a: ilk kullanım (vuruşta koşunun başı) ve kalecinin görev yerine uzaklığı */
        if(A&&K&&K!==sonK&&du===A.du&&A.kos==null&&du.dudukT!=null){A.kos=du.t-du.dudukT;
          const kl=m.teams[1-du.takim].find(q=>q.rol==='GK'&&q.oyunda),g=kl&&du.gorev?du.gorev.get(kl):null;if(g&&g.hx!=null)A.kaleci=Math.hypot(kl.x-g.hx,kl.z-g.hz);}
        sonK=K;oncekiDu=m.phase==='durus'?m.durus:null;
        const cur=m.phase==='durus'&&m.durus&&m.durus.hk&&m.durus.hk.s1?m.durus:null;
        if(A&&A.du!==cur)aKapat();
        if(cur){if(!A)A=aYeni(cur);aIzle(A,cur,m);}
        if(m.kenar)for(const s of m.kenar)if(s.kind==='saglikci'&&s.ev&&Math.hypot(s.x-s.ev.x,s.z-s.ev.z)>1.5)sg+=1/60;},
      bitir(){
        aKapat();
        const r={ham:{},s1D_n:n,s1D_dudukYok:yok,s1D_once:once,s1D_bek:s1Ortanca(bek),s1D_saglikci:sg};
        for(const k of S1D_SAHIP)r['s1D_'+k]=N[k];
        r.ham.s1D_bek1=[bek1,bek.length];r.ham.s1D_dur=[dur,durN];
        /* S1a */
        const L=AL,say=f=>L.filter(f).length,sayi=f=>L.map(f).filter(x=>x!=null&&Number.isFinite(x));
        r.s1a_n=L.length;
        for(const e of S1A_EVRE)r['s1a_ev_'+e]=s1Ortanca(sayi(a=>a.ev[e]));
        for(const k of S1A_TUR)r.ham['s1a_tur_'+k]=[say(a=>a.tur===k),L.length];
        r.s1a_kaosT=s1Ortanca(sayi(a=>a.kaosT));r.ham.s1a_once=[say(a=>a.once===true),say(a=>a.once!=null)];
        r.s1a_yakin=s1Ortanca(sayi(a=>a.yakin));r.s1a_kalabalik=s1Ort(sayi(a=>a.ev.kaos!=null?a.k9:null));r.s1a_yol=s1Ortanca(sayi(a=>a.yolOran));
        r.s1a_it=s1Ort(sayi(a=>a.it));r.s1a_kay=s1Ort(sayi(a=>a.kay));r.s1a_bekle=s1Ort(sayi(a=>a.bekle));r.ham.s1a_heykel=[say(a=>a.heykel),L.length];
        r.ham.s1a_yuz=[L.reduce((x,a)=>x+a.adI,0),L.reduce((x,a)=>x+a.adN,0)];
        const K=sayi(a=>a.kos);r.s1a_dudukKos=s1Ortanca(K);r.ham.s1a_duduk1=[K.filter(x=>x>=1).length,K.length];r.s1a_dudukTemas=s1Ortanca(sayi(a=>a.temas));
        r.ham.s1a_hkDur=[say(a=>a.hkDur===true),say(a=>a.hkDur!=null)];r.ham.s1a_hkArka=[say(a=>a.hkArka===true),say(a=>a.hkArka!=null)];
        r.s1a_kaleci=s1Ortanca(sayi(a=>a.kaleci));
        /* S1d */
        D.bitir();const KL=D.K,kSay=f=>KL.filter(f).length,kSayi=f=>KL.map(f).filter(x=>x!=null&&Number.isFinite(x)),yakinOlan=x=>x.tarz!=='uzak'&&x.gosterD!=null;
        r.s1d_n=KL.length;for(const k of S1D_TARZ){r.ham['s1d_tarz_'+k]=[kSay(x=>x.tarz===k),kSay(x=>x.tarz!=null)];r['s1d_sure_'+k]=s1Ortanca(kSayi(x=>x.tarz===k?x.sure:null));}
        r.s1d_goster=s1Ortanca(kSayi(x=>x.tarz!=='uzak'&&x.gosterT!=null?x.gosterT-x.t0:null));r.s1d_tepe=s1Ortanca(kSayi(x=>x.yavas?x.tepe:null));
        r.ham.s1d_depar=[kSay(x=>x.depar),kSay(x=>x.yavas)];r.ham.s1d_dur=[KL.reduce((a,x)=>a+x.durK,0),KL.reduce((a,x)=>a+x.durN,0)];
        r.ham.s1d_yakin=[kSay(x=>yakinOlan(x)&&x.gosterD<=5),kSay(yakinOlan)];r.ham.s1d_gorunmez=[kSay(x=>x.bitti!=null&&x.gosterT==null),kSay(x=>x.bitti!=null)];
        r.s1d_kul=D.kul;r.s1d_dudukKul=s1Ortanca(D.dudKul);r.s1d_kal=s1Ort(kSayi(x=>x.tarz==='kalabalik'?x.kal:null));
        r.s1d_kaptan=kSay(x=>x.tip==='kaptan');r.s1d_uyari=kSay(x=>x.tip==='uyari');r.s1d_kirmizi=kSay(x=>x.kirSahada===true);
        for(const k of S1D_DURUS)r['s1d_durus_'+k]=s1Ortanca(D.DU.filter(x=>x.tur===k).map(x=>x.sure));
        /* S1b */
        PB.bitir();const RB=s1bOzet(PB.L);Object.assign(r.ham,RB.ham);delete RB.ham;Object.assign(r,RB);
        /* S1e */
        eKapat();{const kor=EL.filter(x=>x.tur==='korner'&&!x.dB),ken=EL.filter(x=>x.tur==='kenar'&&!x.dB),dud=EL.filter(x=>x.dB),q9=L=>{if(!L.length)return NaN;const S2=L.slice().sort((a,b)=>a-b);return S2[Math.min(S2.length-1,Math.floor(0.9*S2.length))];};
          r.s1e_kN=kor.length;r.s1e_eN=ken.length;r.s1e_dN=dud.length;r.s1e_kYer=s1Ortanca(kor.map(x=>x.yerT));r.s1e_kBos=s1Ortanca(kor.map(x=>x.bos));
          r.s1e_kRun=s1Ortanca(kor.map(x=>x.maxRun));r.s1e_kRun9=q9(kor.map(x=>x.maxRun));r.s1e_eRun9=q9(ken.map(x=>x.maxRun));r.s1e_dRun9=q9(dud.map(x=>x.maxRun));
          r.s1e_kul=s1Ortanca(kor.concat(ken).map(x=>x.kul).filter(x=>x!=null));const V=kor.concat(ken).filter(x=>x.on);
          for(const k of['duzelt','don','el','tekrar'])r.ham['s1e_v_'+k]=[V.filter(x=>x.on[k]).length,V.length];
          r.ham.s1e_v_iki=[kor.concat(ken).filter(x=>x.iki).length,kor.concat(ken).filter(x=>x.kol).length];r.ham.s1e_v_dolgu=[V.filter(x=>x.ek>0).length,V.length];}
        /* S1c */
        PC.bitir();const RC=s1cOzet(PC.L);Object.assign(r.ham,RC.ham);delete RC.ham;Object.assign(r,RC);
        return r;}
    };
  }
};
module.exports.s1dIzleyici=s1dIzleyici;   /* S1d: araclar/senaryolar/d-sahne.js */
module.exports.s1bIzleyici=s1bIzleyici;module.exports.s1bOzet=s1bOzet;   /* S1b: araclar/senaryolar/d-sahne.js [2] */
module.exports.s1cIzleyici=s1cIzleyici;module.exports.s1cOzet=s1cOzet;   /* S1c: araclar/senaryolar/d-sahne.js [3] */
