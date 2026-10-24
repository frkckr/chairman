/* ============ Chairman — P12 “Hocaya sabır mı, değişim mi?”: TEST taslağı (içerik; çizim yok; F6-a, 2026-10-24) ============
   OLAY_KUTUPHANESI P12; OYUN_TASARIMI §8 "Teknik direktör"; YOL_HARITASI karar 35 (kullanıcı, 2026-10-23: iskeletin konuları TEST taslağıyla
   yazılır, kullanıcı metinleri ve sayıları değiştirir) ve karar 42. 2.8L'den sonra oyunun yüklediği ilk konu paketidir (index.html, js/baslangic.js'ten
   önce; içerik sürümü 5). BÜTÜN METİNLER, EŞİKLER VE TUTARLAR TEST'TİR.
   Akış:
     1. Başkanın kulübünün maç sonucu işlenince (js/mac-sonuc.js MAC_SONUCU_EKLERI) maç günü P12_SAAT'te gizli gelişme 'hocaBaskisi' kurulur.
     2. Gelişme anında paket 'hocaDegerlendirme' bugünkü koşulla denenir (TEST): bugünkü hocayla oynanan son P12_PENCERE maçta en çok P12_PUAN puan
        (varyant 'puan') ya da son P12_GALIBIYETSIZ maçta galibiyet yok ('galibiyetsiz'); kulüpte açık P12 konusu yok; son P12 konusu P12_ARA_GUN
        günden eski. Konu 'hoca:<hoca>:<maç>'. Koşul tutmazsa iz kalmaz (js/ajanda.js: bilgisiz gelişme gösterilmez).
     3. Açılınca: mesele (kategori Futbol), hocanın mesajı (telefonda hocanın konuşması), kanıtlar — puan durumu, maç raporlarından beklenen gol ve
        tarzın izi (js/mac-okuma.js macOkumasi; kaynaklı ve tarihli) — ve acil olmayan iki cevaplı karar 'hocaKarari' (son cevap iki gün sonra 18:00;
        soran yok: karar dosyadadır, telefonda hocanın konuşmasından dosyaya bağlantı):
          sabır — hocaya P12_SABIR_MAC maç süre: söz (muhatap hoca; bağlı iş, süredeki son maçın akşamı odanın açıldığı anda (21:00) hatırlatma,
            veri.hocaSuresi). Süre dolunca söz tutulur ve konu kapanır; o maçla kötü gidiş sürüyorsa aynı akşam 21:30'da konu yeniden açılır.
            Hoca bu sürede değişirse iş iptal olur ve söz bozulur (js/hoca.js hocaDegistir). Süre içinde baskı yeniden açılmaz (konu açık).
          değişim — ertesi gün 11:00 zorunlu görüşme (katılım etkisi 'hocaAdayGorusmesi'; adaylar js/hoca.js hocaAdaylari, işin verisinde):
            ilk adayın kartı [Göreve al / Sıradaki adayı dinle], ikinci adayın kartı [Göreve al / Mevcut hocayla devam]. Göreve almak: hocaDegistir,
            ertesi gün 10:00 tazminat ödemesi (P12_TAZMINAT, kalem 'tazminat'), yerel gazetede haber. Sonraki maçın kadrosunu ve tarzını yeni hoca seçer.
        Cevapsız kalırsa hoca görevde kalır, söz verilmez (fiilen sabır; koşul sürerse konu P12_ARA_GUN sonra yeniden açılabilir).
   Kayda metin yazılmaz: olay anahtarları ve parametreler (MESELE_OLAYLARI). Hocanın bilgisi ve ısrarı hiçbir metinde yoktur (gizli puan kuralı).
   Borçlar (F6-b, kullanıcıyla): koşulun ve eşiklerin oyun kuralı olarak onayı; yönetim/taraftar baskısının kaynağı (bugün yalnız sonuç); hocanın
   takıma oturma süresi; süre içinde sözün bozulabileceği yol; tazminatın sözleşmeden gelmesi. */
'use strict';
const P12_SAAT=1290;                    // maç günü 21:30: gelişmenin anı (oda 21:00'de açılır; İlerle'de durur)
const P12_PENCERE=3,P12_PUAN=1;         // son 3 maçta en çok 1 puan
const P12_GALIBIYETSIZ=5;               // ya da son 5 maçta galibiyet yok
const P12_ARA_GUN=14;                   // iki P12 konusunun açılışı arasında en az gün
const P12_SABIR_MAC=3;                  // sabırda verilen süre (maç; sezonda kalan maç azsa sonuncusuna dek)
const P12_TAZMINAT=30000000;            // 300.000,00 ₺ (kuruş)
/* adayın görüşmede tarzını anlatan cümlesi (tarz adına göre; TEST) */
const P12_TARZ_SOZU={
  dengeli:'Önce denge; fırsat gelince vururuz.',
  konumsal:'Top bizde kalacak, rakibi sabırla açacağız.',
  iliskisel:'Oyuncular birbirine yakın oynayacak; kısa pasla çıkacağız.',
  dikey:'Topu kazanınca vakit kaybetmeden ileri gideceğiz.',
  kanatOrta:'Kanatları açıp ceza sahasına top taşıyacağız.',
  direkt:'Uzun top, ikinci top, ceza sahası. Basit ve etkili.'
};

MESELE_KATEGORILERI.hoca=['Futbol','F'];
Object.assign(OLAY_KAYNAKLARI,{puanDurumu:'Puan durumu',macRaporlari:'Maç raporları',yerelGazete:'Yerel gazete'});
const p12Sonuc=x=>x.puan===3?'G':x.puan===1?'B':'M';
Object.assign(MESELE_OLAYLARI,{
  'p12.baski':(k,p)=>(p.varyant==='puan'?`Son ${p.mac} maçta ${p.puan} puan.`:`Son ${p.mac} maçta galibiyet yok.`)+' Tribünde ve lokalde “hoca gitsin” sesleri yükseliyor.',
  'p12.hoca':(k,p)=>`${kisiAdi(k,p.kisiId)} aradı: sonuçların farkında, planına güveniyor ve zaman istiyor.`,
  'p12.kanit.puan':(k,p)=>`Son ${p.mac} maç: ${p.dizi} (${p.puan} puan). Ligde ${p.sira}. sıradayız.`,
  'p12.kanit.xg':(k,p)=>`Son ${p.mac} maçın beklenen golü ${okSayi(p.xg[0],2)} – ${okSayi(p.xg[1],2)}; attığımız ${p.gol[0]}, yediğimiz ${p.gol[1]}. `
    +((p.xg[0]-p.xg[1])-(p.gol[0]-p.gol[1])>=1?'Pozisyonlar sonuçtan iyi.':(p.gol[0]-p.gol[1])-(p.xg[0]-p.xg[1])>=1?'Sonuçlar pozisyonlardan bile iyi.':'Sonuçlar oyunu yansıtıyor.'),
  'p12.kanit.tarz':(k,p)=>`Tarzın izi: ${p.mac} maçın ${p.uyumlu} tanesinde takım hocanın ${HOCA_TARZ_ADI[p.tarz]||p.tarz} oyununa uygun oynadı.`,
  'p12.sabir':(k,p)=>`${kisiAdi(k,p.kisiId)} hocaya `+(p.mac?`${p.mac} maç süre verdin (${gunAyYazi(p.tarih)} maçına kadar).`:`${gunAyYazi(p.tarih)} tarihine kadar süre verdin.`)+' Hedef: puan toplamak.',
  'p12.tesekkur':(k,p)=>`${kisiAdi(k,p.kisiId)} teşekkür etti.`,
  'p12.soz':(k,p)=>`${kisiAdi(k,p.kisiId)} ${gunAyYazi(p.tarih)} akşamına kadar görevde kalacak.`,
  'p12.degisim':(k,p)=>`Değişime karar verdin. ${gunAyYazi(p.tarih)} saat ${saatYazi(p.dakika)} aday hocalarla görüşme var.`,
  'p12.aday':(k,p)=>`${p.sira}. aday ${p.ad}: “${P12_TARZ_SOZU[p.tarz]||''}” (${HOCA_TARZ_ADI[p.tarz]||p.tarz})`,
  'p12.adayGec':(k,p)=>`${p.ad} ile anlaşmadın.`,
  'p12.yeniHoca':(k,p)=>`${kisiAdi(k,p.kisiId)} takımın yeni hocası. ${kisiAdi(k,p.eskiId)} ile yollar ayrıldı; tazminat (${paraYazi(p.tutar)}) ${gunAyYazi(p.tarih)} ödenecek.`,
  'p12.devam':(k,p)=>`Adaylarla anlaşmadın; ${kisiAdi(k,p.kisiId)} göreve devam ediyor.`,
  'p12.cevapsiz':(k,p)=>`Cevap vermedin; ${kisiAdi(k,p.kisiId)} göreve devam ediyor. Süre sözü verilmedi.`,
  'p12.haber':(k,p)=>`${(k.kulupler[p.kulupId]||{ad:''}).ad} yeni teknik direktörünü açıkladı: ${kisiAdi(k,p.kisiId)}. ${kisiAdi(k,p.eskiId)} ile yollar ayrıldı.`
});
MESAJ_GONDEREN['p12.hoca']=pKisi('kisiId');
MESAJ_GONDEREN['p12.tesekkur']=pKisi('kisiId');
MESAJ_METIN['p12.hoca']=()=>'Başkanım, sonuçların farkındayım. Planım belli, oyuncular da inanıyor. Biraz zaman isterim.';
MESAJ_METIN['p12.tesekkur']=()=>'Sağ olun başkanım. Bu sürede farkı sahada göstereceğiz.';
ODA_NOTU_SOZLERI.push('p12.soz');

/* kulübün bu hocayla oynadığı maçlar, eskiden yeniye: [{macId, hafta, a, y, puan, xg:[biz, rakip], uyum}] (saf; maç kaydının hocalar alanından) */
function p12Gidisat(k,kulupId,hocaId){
  const L=[];
  for(const f of k.fikstur||[]){
    const s=(k.maclar||{})[f.id];if(!s||(f.ev!==kulupId&&f.konuk!==kulupId))continue;
    const t=f.konuk===kulupId?1:0;if(!Array.isArray(s.hocalar)||s.hocalar[t]!==hocaId)continue;
    const o=macOkumasi(k,f.id,kulupId),a=o.skor[0],y=o.skor[1];
    L.push({macId:f.id,hafta:f.hafta,a,y,puan:a>y?3:a===y?1:0,xg:o.xg,uyum:o.tarzIzi.uyum});
  }
  return L.sort((x,y)=>x.hafta-y.hafta);
}
const p12Olaylari=k=>Object.values(k.olaylar||{}).filter(o=>o.paket==='hocaDegerlendirme');
/* sabır süresinin sonu: kulübün oynanmamış maçlarından P12_SABIR_MAC'ıncısının (azsa sonuncusunun) akşamı, oda açıldığı an; maç yoksa 21 gün sonra */
function p12SabirSonu(k,kulupId){
  const L=(k.fikstur||[]).filter(f=>(f.ev===kulupId||f.konuk===kulupId)&&!(k.maclar||{})[f.id]&&anDakika(f.tarih,f.dakika)>=simdikiAn(k)).sort((a,b)=>a.hafta-b.hafta);
  const f=L[Math.min(P12_SABIR_MAC,L.length)-1];
  return f?{tarih:f.tarih,dakika:Math.min(1439,f.dakika+MAC_SONRASI_DK),mac:Math.min(P12_SABIR_MAC,L.length)}:{tarih:tarihEkle(k.tarih,21),dakika:600,mac:0};
}

MAC_SONUCU_EKLERI.push((k,f)=>{
  if(k.icerik.surum<PAKETLER.hocaDegerlendirme.icerik||k.gorevDurumu!=='gorevde')return;
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,h=biz?kulupHocasi(k,biz):null;
  if(!h||(f.ev!==biz&&f.konuk!==biz))return;
  const t=anTarih(Math.max(anDakika(f.tarih,P12_SAAT),simdikiAn(k)));
  isEkle(k,{tur:'gelisme',tarih:t.tarih,dakika:t.dakika,veri:{gelisme:'hocaBaskisi',kulupId:biz,hocaId:h.id,macId:f.id}});
});

GELISMELER.hocaBaskisi={
  denetle:(k,v)=>{const h=[];if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);if(!(k.kisiler||{})[v.hocaId])h.push(`hoca bulunamadı (${v.hocaId})`);
    if(!(k.fikstur||[]).some(f=>f.id===v.macId))h.push(`maç bulunamadı (${v.macId})`);return h;},
  uygula:(k,is)=>{const v=is.veri,olay=paketDene(k,'hocaDegerlendirme',`hoca:${v.hocaId}:${v.macId}`,v);
    return olay?{bilgi:'Hocaya sabır mı, değişim mi? konusu açıldı.',dur:true}:{bilgi:null};}
};
PAKETLER.hocaDegerlendirme={
  surum:1,icerik:5,
  degerlendir:(k,b)=>{
    const h=kulupHocasi(k,b.kulupId),P=p12Olaylari(k);
    if(!h||h.id!==b.hocaId||P.some(o=>o.durum==='acik'))return null;
    if(P.some(o=>tarihKarsilastir(tarihEkle(o.acilis.tarih,P12_ARA_GUN),k.tarih)>0))return null;
    const L=p12Gidisat(k,b.kulupId,h.id),s3=L.slice(-P12_PENCERE),s5=L.slice(-P12_GALIBIYETSIZ);
    if(s3.length===P12_PENCERE&&s3.reduce((a,x)=>a+x.puan,0)<=P12_PUAN)return'puan';
    if(s5.length===P12_GALIBIYETSIZ&&s5.every(x=>x.puan<3))return'galibiyetsiz';
    return null;
  },
  ac:(k,olay,b)=>{
    const h=kulupHocasi(k,b.kulupId),n=olay.varyant==='puan'?P12_PENCERE:P12_GALIBIYETSIZ,S=p12Gidisat(k,b.kulupId,h.id).slice(-n);
    const puan=S.reduce((a,x)=>a+x.puan,0),id=meseleAc(k,{tur:'hoca',baslik:'Hocaya sabır mı, değişim mi?',sorumluId:k.baskanId,kisiler:[h.id]});
    olay.meseleId=id;
    meseleOlay(k,id,'p12.baski',{varyant:olay.varyant,mac:n,puan});
    meseleOlay(k,id,'p12.hoca',{kisiId:h.id});
    const sira=sezonTablosu(k).findIndex(t=>t.id===b.kulupId)+1;
    olayBilgi(k,olay.id,'p12.kanit.puan',{mac:n,dizi:S.map(p12Sonuc).join(' '),puan,sira},'puanDurumu');
    const top=f=>S.reduce((a,x)=>a+f(x),0);
    olayBilgi(k,olay.id,'p12.kanit.xg',{mac:n,xg:[0,1].map(i=>Math.round(top(x=>x.xg[i])*100)/100),gol:[top(x=>x.a),top(x=>x.y)]},'macRaporlari');
    const U=S.filter(x=>x.uyum);
    if(U.length)olayBilgi(k,olay.id,'p12.kanit.tarz',{mac:U.length,uyumlu:U.filter(x=>x.uyum==='uyumlu').length,tarz:h.hoca.tarz},'macRaporlari');
    isEkle(k,{tur:'ajanda',tarih:tarihEkle(k.tarih,2),dakika:1080,veri:{baslik:'Hocaya sabır mı, değişim mi?',zorunluluk:'zorunlu',sure:0,saatsiz:true,bekleyebilir:true,
      gelis:{tarih:k.tarih,dakika:k.gunIciDakika},karar:'hocaKarari',meseleId:id,olayId:olay.id,kulupId:b.kulupId,hocaId:h.id,
      aciklama:`${h.ad} ile devam mı, yeni bir hoca mı?`}});
  }
};
/* karar işinin ortak denetimi: kulüp, hoca, konu */
function p12Denetle(k,v){
  const h=[];
  if(!(k.kulupler||{})[v.kulupId])h.push(`kulüp bulunamadı (${v.kulupId})`);
  const p=(k.kisiler||{})[v.hocaId];if(!p||!p.hoca)h.push(`hoca bulunamadı (${v.hocaId})`);
  if(typeof v.meseleId!=='string')h.push('mesele yok');
  if(typeof v.olayId!=='string')h.push('olay yok');
  return h;
}
KARAR_TURLERI.hocaKarari={
  denetle:p12Denetle,
  secenekler:(k,is)=>{const v=is.veri,ad=kisiAdi(k,v.hocaId),son=p12SabirSonu(k,v.kulupId);
    return[{id:'sabir',metin:'Sabır: açık hedef ve süre',sure:15,aciklama:[`${ad} ${son.mac?son.mac+' maç, '+gunAyYazi(son.tarih)+' maçına':gunAyYazi(son.tarih)+' tarihine'} kadar görevde kalır; söz verirsin.`,'Bu sürede konu yeniden açılmaz.']},
      {id:'degisim',metin:'Değişim: adayları dinle',sure:15,aciklama:['Yarın 11:00 aday hocalarla görüşürsün.','Son karar görüşmede verilir; vazgeçebilirsin.']}];},
  uygula:(k,is,secim)=>{
    const v=is.veri;
    if(secim==='sabir'){
      const son=p12SabirSonu(k,v.kulupId);
      const isId=isEkle(k,{tur:'hatirlatma',tarih:son.tarih,dakika:son.dakika,veri:{metin:`${kisiAdi(k,v.hocaId)} hocaya verilen süre doldu.`,meseleId:v.meseleId,hocaSuresi:v.hocaId}});
      sozVer(k,{muhatap:v.hocaId,anahtar:'p12.soz',p:{kisiId:v.hocaId,tarih:son.tarih},isId,olayId:v.olayId});
      const bilgi=meseleOlay(k,v.meseleId,'p12.sabir',{kisiId:v.hocaId,tarih:son.tarih,mac:son.mac});
      meseleOlay(k,v.meseleId,'p12.tesekkur',{kisiId:v.hocaId});
      return{bilgi};
    }
    const yarin=tarihEkle(k.tarih,1);
    isEkle(k,{tur:'ajanda',tarih:yarin,dakika:660,veri:{baslik:'Hoca adaylarıyla görüşme',zorunluluk:'zorunlu',sure:60,etki:'hocaAdayGorusmesi',
      meseleId:v.meseleId,olayId:v.olayId,kulupId:v.kulupId,hocaId:v.hocaId,adaylar:hocaAdaylari(k,v.kulupId,v.olayId),
      aciklama:'İki aday hocayla sırayla görüşeceksin.'}});
    return{bilgi:meseleOlay(k,v.meseleId,'p12.degisim',{tarih:yarin,dakika:660})};
  },
  zamanAsimi:{
    metin:(k,is)=>`Cevap vermezsen ${kisiAdi(k,is.veri.hocaId)} görevde kalır; söz verilmez.`,
    uygula:(k,is)=>({bilgi:meseleOlay(k,is.veri.meseleId,'p12.cevapsiz',{kisiId:is.veri.hocaId})})
  }
};
/* adayın kartı: başkana dönen karar (bugün cevaplanır; yüz yüze görüşme, telefonda soran yok) */
function p12AdayKarti(k,v,sira){
  const a=v.adaylar[sira];
  donenKarar(k,{baslik:`${sira+1}. aday: ${a.ad}`,sure:0,karar:'hocaAdayi',meseleId:v.meseleId,olayId:v.olayId,kulupId:v.kulupId,hocaId:v.hocaId,adaylar:v.adaylar,sira,
    aciklama:`${a.ad}: “${P12_TARZ_SOZU[a.tarz]}” Tarzı: ${HOCA_TARZ_ADI[a.tarz]}.`});
  return meseleOlay(k,v.meseleId,'p12.aday',{sira:sira+1,ad:a.ad,tarz:a.tarz});
}
function p12AdaylarDenetle(k,v){
  const h=p12Denetle(k,v);
  if(!Array.isArray(v.adaylar)||v.adaylar.length!==HOCA_ADAY_SAYISI)h.push('adaylar eksik');
  else v.adaylar.forEach((a,i)=>h.push(...hocaAdayiDenetle(a).map(x=>`${i+1}. aday: ${x}`)));
  return h;
}
KATILIM_ETKILERI.hocaAdayGorusmesi={
  denetle:p12AdaylarDenetle,
  uygula:(k,is)=>({bilgi:p12AdayKarti(k,is.veri,0)})
};
KARAR_TURLERI.hocaAdayi={
  denetle:(k,v)=>{const h=p12AdaylarDenetle(k,v);if(!Number.isInteger(v.sira)||v.sira<0||v.sira>=HOCA_ADAY_SAYISI)h.push(`aday sırası geçersiz (${v.sira})`);return h;},
  secenekler:(k,is)=>{const v=is.veri,a=v.adaylar[v.sira],eski=kisiAdi(k,v.hocaId),son=v.sira===v.adaylar.length-1;
    return[{id:'al',metin:'Göreve al',sure:30,aciklama:[`${a.ad} takımın hocası olur; tarzı ${HOCA_TARZ_ADI[a.tarz]}.`,`${eski} ile yollar ayrılır; tazminat ${paraYazi(P12_TAZMINAT)}.`,
        'Kadroyu ve tarzı sonraki maçtan başlayarak yeni hoca belirler.']},
      son?{id:'devam',metin:'Mevcut hocayla devam',sure:0,aciklama:[`${eski} görevde kalır.`]}
        :{id:'sonraki',metin:'Sıradaki adayı dinle',sure:60,aciklama:[`${v.adaylar[v.sira+1].ad} ile görüşürsün; ${a.ad} ile anlaşma olmaz.`]}];},
  uygula:(k,is,secim)=>{
    const v=is.veri,a=v.adaylar[v.sira];
    if(secim==='sonraki'){meseleOlay(k,v.meseleId,'p12.adayGec',{ad:a.ad});return{bilgi:p12AdayKarti(k,v,v.sira+1)};}
    if(secim==='devam'){meseleOlay(k,v.meseleId,'p12.adayGec',{ad:a.ad});return{bilgi:meseleOlay(k,v.meseleId,'p12.devam',{kisiId:v.hocaId})};}
    const yeni=hocaDegistir(k,v.kulupId,a),yarin=tarihEkle(k.tarih,1),m=k.meseleler[v.meseleId];
    odemePlanla(k,{kulupId:v.kulupId,tarih:yarin,dakika:600,tutar:-P12_TAZMINAT,kalem:'tazminat',aciklama:`${kisiAdi(k,v.hocaId)} tazminatı`,meseleId:v.meseleId});
    if(!m.kisiler.includes(yeni))m.kisiler.push(yeni);
    haberEkle(k,{tur:'gazete',anahtar:'p12.haber',p:{kulupId:v.kulupId,kisiId:yeni,eskiId:v.hocaId,kaynak:'yerelGazete'},olayId:v.olayId});
    return{bilgi:meseleOlay(k,v.meseleId,'p12.yeniHoca',{kisiId:yeni,eskiId:v.hocaId,tutar:P12_TAZMINAT,tarih:yarin})};
  }
};
