/* ============ Chairman — maç sonucunun kariyere işlenmesi (çizim yok; F2, 2026-10-23) ============
   TEKNIK_PLAN §8: "Kariyer durumu → maç girdisi → Match → sonuç ve olaylar → kariyer durumuna tek uygulama". Bu dosya son oktur. Kararlar
   YOL_HARITASI "Geçerli kararlar" 38 (Claude'un kararları; TEST kuralları). Saf kural dosyasıdır: DOM ve çizim yok, Node'da da yüklenir
   (araclar/kariyer-deneme.js, araclar/sezon-deneme.js; motor yükleyici de alır). Katı kip: dondurulmuş paylaşılan alana yerinde yazmak hata verir.
   macSonucuUygula(k, maçKimliği, sonuç, tohum, ek) — maç sayfasının "Odaya dön" komutu (js/ekran-mac-sonu.js). sonuç: Match.sonucKaydi()
     {skor, bitti, goller, kartlar, sakatliklar, degisiklikler, ist}; tohum: maçın oynandığı tohum; ek: {protokol} (rakip başkanın karar anındaki
     seçim, MAC_PROTOKOL.karar; etkisi F6 içeriğinde). Döner: {macId, skor, durdu, siradakiIsId}.
     Reddeder (hata fırlatır; kariyerKomut kariyeri değiştirmez): fikstürde yok, zaten uygulanmış (bir kez), devralınan hafta, maç bitmemiş ya da
     skor bozuk, tohum maçın tohumu değil (macTohumu), maç günü işi hâlâ bekliyor ya da zaman maç anından önce, sonuç bu kariyerin kadrosuyla
     uyuşmuyor (forma numarası ve ad).
     Yazdıkları:
       k.maclar[id] = {skor, tohum, goller:[{id,no,takim,kk,dk}], kartlar:[{id,no,takim,renk,neden,dk}], sakatliklar:[{id,no,takim,tur,bolge,derece,dk,gun}],
                       degisiklikler:[{takim,cikan,giren,dk,sakatlik}], sutlar:[{id,no,takim,dk,xg,pen,kafa}], xg:[ev,konuk], ilk11:[[11 kimlik]×2] | null,
                       hocalar:[ev, konuk] (kişi kimliği), tarz:[ev, konuk], ist, protokol}
         takim motorun sırasıdır (0 ev sahibi). Golde takim golü kazanan takımdır; kendi kalesine golde (kk) atan öbür takımdandır. id: oyuncunun
         kariyer kimliği (numarasız, atansız golde null). Ad saklanmaz (kimlik var); degisiklikler motordaki gibi adla.
         F3-b (2026-10-24): sutlar motorun şut listesi (xg: şutun konum xG'si, baskısız ve bloksuz; pen penaltı, kafa); xg takım başına beklenen gol
         (macBeklenenGol: penaltı MAC_PENALTI_XG sayılır; 2 ondalık); ilk11 maçın on biri (motorun girdisinden; kariyersiz kayıtta null);
         ist'te pas, pasTamam, uzunPas (takım başına) da vardır.
       Kadro (F3-a): iki kulübün kadro.ilk11'i bu maçın on biri olur (hocanın "son on biri"; js/hoca.js israr), kalanı yedekler.
       k.gecmis: {tur:'mac', macId, hafta, ev, konuk, skor, tarih, dakika} (maç anında).
       Oyuncular (kopyala-yaz): gol (kendi kalesine sayılmaz), sarı sayacı, ceza, sakatlık — TEST kuralı (karar 36, 38):
         · iki kulübün cezalıları bu maçı oynamadı: ceza.mac − 1 (0'da null). Öbür kulüplerin cezaları yalnız bizimle oynayınca düşer (F2 TEST sınırı;
           diğer maçlar 3.8'de).
         · kırmızı kart → 1 maç; ikinci sarı → 1 maç ve o maçın sarıları birikime sayılmaz (motor ikinci sarıda iki kayıt yazar: sari + ikinciSari);
           sarı → sarı sayacı + 1, sayaç 4'ün katını geçince 1 maç. Aynı maçta iki ceza toplanır.
         · sakatlık: derece tedavi ya da çıkış ve gün > 0 → sakat {neden, donus: maç günü + gün}; aynı maçta birden çoksa en uzunu; ağrı ve kramp
           yazılmaz. Dönüşü gelmiş sakatlık
           temizlenir (uygunluk zaten tarihe bakar: js/mac-girdi.js oyuncuUygunMu).
       Zaman maçtan MAC_SONRASI_DK sonrasına (21:00) ilerler; arada bir ajanda işinin anı varsa o anda durulur (kaçırılmaz), yolda karar gerektiren
         gelişme gelirse orada durulur (js/ajanda.js durakSorgusu; İlerle'nin modeli).
       Sıradaki hafta (yalnız başkanın kulübünün maçından sonra): kulübün oynanmamış ilk maçının maç günü işi kurulur (js/fikstur.js siradakiMac, macGunuIsiKur); 30. haftadan sonra yok.
   kulubunSonMaci(k, kulüp): kulübün son oynanan maçı {f: fikstür kaydı, s: k.maclar kaydı} ya da null (Canlı Skor ve bülten).
   macSonucDogrula: k.maclar girdilerinin iç tutarlılığı (EK_DENETIMLER; js/fikstur.js fiksturDogrula kimlik, hafta ve skoru denetler).
   Kayıt sürümü 8 (F3): maclar girdisinde sutlar, xg ve ilk11 zorunludur; hoca kişileri (js/hoca.js). */
'use strict';
const MAC_SONRASI_DK=120;                       // maç anından odanın açılacağı ana (19:00 → 21:00; TEST)
const MAC_PENALTI_XG=0.76;                      // penaltının beklenen golü (genel kabul; motorun konum xG'si penaltıyı ayrı tutmaz)
/* takım başına beklenen gol (2 ondalık): şutların konum xG'si, penaltı MAC_PENALTI_XG */
const macBeklenenGol=sutlar=>[0,1].map(t=>Math.round(sutlar.filter(s=>s.takim===t).reduce((a,s)=>a+(s.pen?MAC_PENALTI_XG:s.xg),0)*100)/100);
const MAC_SONUC_KART=['sari','ikinciSari','kirmizi'];
const MAC_SONUC_DERECE=['agri','tedavi','cikis'];
/* sakatlığın oyuncuya yazılan nedeni (motorun tür ve bölgesinden; TEST metni) */
const SAKATLIK_METNI={'kas:arkaAdale':'Arka adale','kas:baldir':'Baldır','kramp:baldir':'Kramp','temas:kafa':'Kafa darbesi','temas:omuz':'Omuz',
  'temas:bilek':'Ayak bileği','temas:diz':'Diz','temas:baldir':'Baldır darbesi'};
const sakatlikMetni=(tur,bolge)=>SAKATLIK_METNI[tur+':'+bolge]||String(bolge||tur||'Sakatlık');

/* maçın kariyerdeki anı (dakika) */
const macAni=f=>anDakika(f.tarih,f.dakika);
/* kulübün son oynanan maçı: {f, s} ya da null */
function kulubunSonMaci(k,kulupId){
  let en=null;
  for(const f of k.fikstur||[]){const s=(k.maclar||{})[f.id];if(s&&(f.ev===kulupId||f.konuk===kulupId)&&(!en||f.hafta>en.f.hafta))en={f,s};}
  return en;
}
/* motor kaydının (takım sırası, forma numarası, ad) kariyer kimliği. zorunlu değilse bulunamayan null olur; ad tutmazsa her zaman hata.
   F2 incelemesi: numarası olan golcü her zaman kadrodadır (motor son dokunanı ve takımını birlikte yazar, js/mac-motoru.js dokunus), bu yüzden
   yalnız numarasız (atansız) gol null kalır */
function macSonucKimligi(k,f,takim,no,ad,zorunlu){
  const kulup=takim===0?f.ev:f.konuk,p=no>0?kulupOyunculari(k,kulup).find(x=>x.no===no):null;
  if(p&&(!ad||p.ad===ad))return p.id;
  if(p||zorunlu)throw new Error(`Maç sonucu bu kariyerin kadrosuyla uyuşmuyor: ${(k.kulupler[kulup]||{ad:kulup}).ad} ${no} ${ad||''}`.trim());
  return null;
}
/* bir maçın kartlarından oyuncu başına sarı artışı ve ceza (saf). kartlar: [{id, renk}] → Map(id → {sari, mac, neden[]}) */
function kartCezalari(kartlar){
  const M=new Map();
  for(const c of kartlar){if(!c.id)continue;const o=M.get(c.id)||{renkler:[]};o.renkler.push(c.renk);M.set(c.id,o);}
  const S=new Map();
  for(const [id,o] of M){
    const R=o.renkler,ikinci=R.includes('ikinciSari'),kirmizi=R.includes('kirmizi'),neden=[];let mac=0;
    if(kirmizi){mac++;neden.push('Kırmızı kart');}
    if(ikinci){mac++;neden.push('İki sarı kart');}
    S.set(id,{sari:ikinci?0:R.filter(r=>r==='sari').length,mac,neden});
  }
  return S;
}

function macSonucuUygula(k,macId,sonuc,tohum,ek){
  ek=ek||{};
  const f=(k.fikstur||[]).find(x=>x.id===macId);
  if(!f)throw new Error(`Maç sonucu işlenemedi: fikstürde ${macId} yok`);
  if(k.maclar[macId])throw new Error(`Maç sonucu işlenemedi: ${macId} zaten uygulanmış`);
  if(f.hafta<k.sezon.ilkHafta)throw new Error(`Maç sonucu işlenemedi: ${f.hafta}. hafta devralınan geçmişte`);
  const tam=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
  if(!sonuc||sonuc.bitti!==true)throw new Error('Maç sonucu işlenemedi: maç bitmemiş');
  if(!Array.isArray(sonuc.skor)||sonuc.skor.length!==2||!sonuc.skor.every(x=>tam(x,0,99)))throw new Error('Maç sonucu işlenemedi: skor geçersiz');
  if(tohum!==macTohumu(k.dunyaTohumu,macId))throw new Error('Maç sonucu işlenemedi: maç bu kariyerin tohumuyla oynanmamış');
  if(Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu'&&x.veri.macId===macId))throw new Error('Maç sonucu işlenemedi: maç günü işi hâlâ bekliyor');
  const simdi=simdikiAn(k),an0=macAni(f);
  if(simdi<an0)throw new Error('Maç sonucu işlenemedi: zaman maç anından önce');
  const L=a=>Array.isArray(a)?a:[];
  /* kimlikler: gol atan bilinmeyebilir (numarasız, atansız gol null); kart ve sakatlık her zaman bir oyuncunundur */
  const goller=L(sonuc.goller).map(g=>{const kk=!!g.kendiKalesine,t=g.takim===1?1:0;
    return{id:macSonucKimligi(k,f,kk?1-t:t,g.no|0,g.ad,(g.no|0)>0),no:g.no|0,takim:t,kk,dk:g.dakika|0};});
  const kartlar=L(sonuc.kartlar).map(c=>({id:macSonucKimligi(k,f,c.takim===1?1:0,c.no|0,c.ad,true),no:c.no|0,takim:c.takim===1?1:0,renk:c.renk,neden:c.neden==null?null:String(c.neden),dk:c.dakika|0}));
  const sakatliklar=L(sonuc.sakatliklar).map(s=>({id:macSonucKimligi(k,f,s.takim===1?1:0,s.no|0,s.ad,true),no:s.no|0,takim:s.takim===1?1:0,tur:s.tur,bolge:s.bolge,derece:s.derece,dk:s.dakika|0,gun:s.gun|0}));
  const degisiklikler=L(sonuc.degisiklikler).map(d=>({takim:d.takim===1?1:0,cikan:String(d.cikan||''),giren:String(d.giren||''),dk:d.dakika|0,sakatlik:!!d.sakatlik}));
  const sutlar=L(sonuc.sutlar).map(s=>{const t=s.takim===1?1:0;
    return{id:macSonucKimligi(k,f,t,s.no|0,s.ad,true),no:s.no|0,takim:t,dk:s.dakika|0,xg:Math.round(Math.max(0,+s.xg||0)*1000)/1000,pen:!!s.pen,kafa:!!s.kafa};});
  /* maçın on biri (motorun girdisinden): iki takımda da 11 kimlik ve hepsi o kulübün oyuncusu olmalı; kariyersiz kadroda (kimliksiz) yok sayılır */
  let ilk11=null;
  if(Array.isArray(sonuc.ilk11)&&sonuc.ilk11.every(x=>Array.isArray(x)&&x.length===11&&x.every(id=>typeof id==='string'))){
    sonuc.ilk11.forEach((x,t)=>{const kulup=t===0?f.ev:f.konuk;
      if(new Set(x).size!==11||!x.every(id=>k.oyuncular[id]&&k.oyuncular[id].kulupId===kulup))throw new Error(`Maç sonucu bu kariyerin kadrosuyla uyuşmuyor: ${(k.kulupler[kulup]||{ad:kulup}).ad} on biri`);});
    ilk11=sonuc.ilk11.map(x=>x.slice());
  }
  const I=sonuc.ist||{},iki=a=>Array.isArray(a)&&a.length===2?a.map(x=>x|0):[0,0];
  const ist={sut:iki(I.sut),isabet:iki(I.isabet),korner:iki(I.korner),faul:iki(I.faul),sari:iki(I.sari),kirmizi:iki(I.kirmizi),ofsayt:iki(I.ofsayt),
    sahiplik:Array.isArray(I.sahiplik)&&I.sahiplik.length===2?I.sahiplik.map(x=>Math.round((+x||0)*1000)/1000):[0.5,0.5],
    pas:iki(I.pas),pasTamam:iki(I.pasTamam),uzunPas:iki(I.uzunPas)};
  /* maçın hocaları ve tarzları (uygulama anında; hoca sonra değişse de maçın okuması o maçın hocasıyla yapılır, js/mac-okuma.js) */
  const hocalar=[f.ev,f.konuk].map(id=>k.kulupler[id].hocaId||null),tarz=hocalar.map(id=>id&&k.kisiler[id]&&k.kisiler[id].hoca?k.kisiler[id].hoca.tarz:null);
  const kayit={skor:sonuc.skor.slice(),tohum,goller,kartlar,sakatliklar,degisiklikler,sutlar,xg:macBeklenenGol(sutlar),ilk11,hocalar,tarz,ist,
    protokol:ek.protokol?JSON.parse(JSON.stringify(ek.protokol)):null};
  k.maclar=Object.assign({},k.maclar,{[macId]:kayit});
  /* F3-a: hocanın "son on biri" — iki kulübün kadro.ilk11'i bu maçın on biri olur, kalanı (önceki sırasıyla) yedekler. Kaleci yuvası kaleci değilse
     (bütün kaleciler eksikken) eski on bir kalır: kadronun ilk yuvası kalecidir (js/kariyer-kadro.js kadroDogrula) */
  if(ilk11)ilk11.forEach((x,t)=>{const D=k.kulupler[t===0?f.ev:f.konuk].kadro;if(!D||k.oyuncular[x[0]].mevki!=='KL')return;
    const hepsi=D.ilk11.concat(D.yedekler);D.ilk11=x.slice();D.yedekler=hepsi.filter(id=>!x.includes(id));});
  k.gecmis.push({tur:'mac',macId,hafta:f.hafta,ev:f.ev,konuk:f.konuk,skor:sonuc.skor.slice(),tarih:k.tarih,dakika:k.gunIciDakika});
  /* oyuncular: her değişen oyuncu için tek yeni kayıt */
  const yeni={},al=id=>yeni[id]||(yeni[id]=Object.assign({},k.oyuncular[id]));
  const kulupler=[f.ev,f.konuk];
  /* 1) bu maçı oynamayan cezalılar (iki kulüp) — yeni cezalardan önce */
  for(const c of kulupler)for(const p of kulupOyunculari(k,c))if(p.ceza&&p.ceza.mac>0){const q=al(p.id);q.ceza=p.ceza.mac>1?{mac:p.ceza.mac-1,neden:p.ceza.neden}:null;}
  /* 2) goller */
  for(const g of goller)if(!g.kk&&g.id){const q=al(g.id);q.gol=Math.min(999,q.gol+1);}
  /* 3) kartlar: sarı birikimi ve cezalar */
  for(const [id,o] of kartCezalari(kartlar)){
    const q=al(id),eski=q.sari,sari=Math.min(99,eski+o.sari);let mac=o.mac;const neden=o.neden.slice();
    if(Math.floor(sari/4)>Math.floor(eski/4)){mac++;neden.push('4 sarı kart');}
    q.sari=sari;
    if(mac>0){const onceki=q.ceza&&q.ceza.mac>0?q.ceza:null;q.ceza={mac:Math.min(99,mac+(onceki?onceki.mac:0)),neden:(onceki?[onceki.neden]:[]).concat(neden).join(' · ')};}
  }
  /* 4) sakatlıklar: tedavi ya da oyundan çıkış ve dönüşü sonraki günlerde. Tedaviden dönen oyuncu aynı maçta yeniden sakatlanabilir
     (js/mac-sakatlik.js): maçtaki en uzun dönüş kalır (F2 incelemesi) */
  const buMac=new Set();
  for(const s of sakatliklar)if((s.derece==='tedavi'||s.derece==='cikis')&&s.gun>0&&s.tur!=='kramp'){const q=al(s.id),donus=tarihEkle(f.tarih,s.gun);
    if(buMac.has(s.id)&&q.sakat&&tarihKarsilastir(q.sakat.donus,donus)>=0)continue;
    q.sakat={neden:sakatlikMetni(s.tur,s.bolge),donus};buMac.add(s.id);}
  k.oyuncular=Object.assign({},k.oyuncular,yeni);
  /* zaman: maçtan sonrasına; arada anı gelen ajanda işinde (randevu, karar) durulur — kaçırılmaz */
  const hedef0=Math.max(simdi,an0+MAC_SONRASI_DK);let hedef=hedef0;
  for(const x of bekleyenIsler(k))if(x.tur==='ajanda'&&isAn(x)<hedef)hedef=Math.max(simdi,isAn(x));
  const r=zamanIlerletAna(k,hedef,durakSorgusu(k));
  /* dönüşü gelmiş sakatlıklar (iki kulüp) */
  const temiz={};
  for(const c of kulupler)for(const p of kulupOyunculari(k,c))if(p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)<=0)temiz[p.id]=Object.assign({},p,{sakat:null});
  if(Object.keys(temiz).length)k.oyuncular=Object.assign({},k.oyuncular,temiz);
  /* sıradaki haftanın maç günü: yalnız başkanın kulübünün maçından sonra (3.8'in diğer maçları kendi yoluyla işlenecek; F2 incelemesi) */
  const biz=(k.kisiler[k.baskanId]||{}).kulupId;let siradakiIsId=null;
  if(k.gorevDurumu==='gorevde'&&biz&&(f.ev===biz||f.konuk===biz)&&!Object.values(k.isler).some(x=>x.tur==='ajanda'&&x.veri.eylem==='macGunu')){const s=siradakiMac(k,biz);if(s)siradakiIsId=macGunuIsiKur(k,s.id);}
  return{macId,skor:sonuc.skor.slice(),durdu:r.durdu||hedef<hedef0,siradakiIsId};
}

/* k.maclar girdilerinin iç tutarlılığı. Dondurulmuş girdinin kendi denetimi bir kez yapılır (değişemez); oyuncu kimliklerinin varlığı her seferinde.
   Oyuncunun bugünkü kulübü denetlenmez: transferden (Aşama 4) sonra eski maçların kaydı geçerli kalmalı; kimlik komutta (macSonucKimligi) eşlenir */
const MAC_SONUC_DENETLENDI=new WeakSet();
function macSonucDogrula(k,h){
  const M=k.maclar,F=k.fikstur,O=k.oyuncular||{};
  if(!M||typeof M!=='object'||!Array.isArray(F))return;
  const tam=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b,duz=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
  const fk=new Map();for(const f of F)fk.set(f.id,f);
  for(const [id,s] of Object.entries(M)){
    const ad=`Maç ${id}`,f=fk.get(id);
    if(!f||!duz(s)||!Array.isArray(s.skor))continue;   // fiksturDogrula bildirir
    for(const L of ['goller','kartlar','sakatliklar','sutlar'])for(const x of Array.isArray(s[L])?s[L]:[])
      if(x&&x.id!=null&&!O[x.id])h.push(`${ad}: ${L} kaydındaki oyuncu ${x.id} bulunamadı`);
    if(Array.isArray(s.ilk11))for(const x of s.ilk11)for(const id of Array.isArray(x)?x:[])if(!O[id])h.push(`${ad}: on birdeki oyuncu ${id} bulunamadı`);
    if(MAC_SONUC_DENETLENDI.has(s))continue;
    const once=h.length;
    if(s.tohum!==macTohumu(k.dunyaTohumu,id))h.push(`${ad}: tohum maçın tohumu değil`);
    for(const L of ['goller','kartlar','sakatliklar','degisiklikler','sutlar'])if(!Array.isArray(s[L]))h.push(`${ad}: ${L} liste değil`);
    if(!duz(s.ist))h.push(`${ad}: istatistik yok`);
    if(!Array.isArray(s.xg)||s.xg.length!==2||!s.xg.every(x=>typeof x==='number'&&x>=0&&x<100))h.push(`${ad}: beklenen gol geçersiz`);
    else if(Array.isArray(s.sutlar)&&macBeklenenGol(s.sutlar).some((x,t)=>Math.abs(x-s.xg[t])>0.006))h.push(`${ad}: beklenen gol şut listesiyle tutmuyor`);
    for(const x of Array.isArray(s.sutlar)?s.sutlar:[])if(!x||![0,1].includes(x.takim)||typeof x.xg!=='number'||!(x.xg>=0&&x.xg<=1)||!tam(x.dk,0,130)||typeof x.id!=='string')h.push(`${ad}: şut kaydı geçersiz`);
    if(!Array.isArray(s.hocalar)||s.hocalar.length!==2||!Array.isArray(s.tarz)||s.tarz.length!==2)h.push(`${ad}: hocalar ve tarz iki takımın olmalı`);
    if(s.ilk11!==null&&!(Array.isArray(s.ilk11)&&s.ilk11.length===2&&s.ilk11.every(x=>Array.isArray(x)&&x.length===11&&x.every(id=>typeof id==='string'))))h.push(`${ad}: on bir null ya da iki takımın 11 kimliği olmalı`);
    if(s.protokol!==null&&!duz(s.protokol))h.push(`${ad}: protokol null ya da nesne olmalı`);
    const G=Array.isArray(s.goller)?s.goller:[];
    for(const t of [0,1])if(G.filter(g=>g&&g.takim===t).length!==s.skor[t])h.push(`${ad}: gol kayıtları skorla tutmuyor (${t?'konuk':'ev'})`);
    for(const g of G)if(!g||![0,1].includes(g.takim)||typeof g.kk!=='boolean'||!tam(g.dk,0,130))h.push(`${ad}: gol kaydı geçersiz`);
    for(const c of Array.isArray(s.kartlar)?s.kartlar:[])if(!c||![0,1].includes(c.takim)||!MAC_SONUC_KART.includes(c.renk)||!tam(c.dk,0,130)||typeof c.id!=='string')h.push(`${ad}: kart kaydı geçersiz`);
    for(const x of Array.isArray(s.sakatliklar)?s.sakatliklar:[])if(!x||![0,1].includes(x.takim)||!MAC_SONUC_DERECE.includes(x.derece)||!tam(x.gun,0,999)||!tam(x.dk,0,130)||typeof x.id!=='string')h.push(`${ad}: sakatlık kaydı geçersiz`);
    if(h.length===once&&DONMUS.has(s))MAC_SONUC_DENETLENDI.add(s);
  }
}
EK_DENETIMLER.push(macSonucDogrula);
