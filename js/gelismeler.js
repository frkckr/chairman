/* ============ Chairman — gelişmeler: tek kronolojik liste ve bekleyenler (kural; DOM yok; CM1-b, 2026-11-03, YOL_HARITASI karar 87) ============
   Kullanıcının teşhisi (2026-11-03): “İlerle deyince ne olup bittiğini takip edemiyorum.” CM 01/02'nin News ekranı gibi her gelişme tek listede, kanalı
   (telefon, gazete, lig, dosya, defter) simgeyle ayrılır; içerik yine kendi ortamında okunur (satır ortamı açar). Tek kayıt, çok sunum: liste kayıttan
   her seferinde aynı kurulur (saf okuma), metinler mevcut kaynaklardan gelir — telefonun konuşmaları (js/mesajlar.js konusmaListesi), gazete ve TV'nin
   haber akışı (js/haber.js haberListesi), mali işler müdürünün raporları (js/mali-rapor.js maliRaporlari), biten işlerin satırları (js/zaman-ozeti.js
   gecmisOzetSatirlari). Kayda yalnız okundu işareti girer: k.gelismeOkunan {an, idler} (isteğe bağlı; kayıt sürümü 12'nin içinde).
     gelismeListesi(k, o?)   → [{id, an, tarih, dakika, kanal, sinif, kategori, baslik, hedef, okundu, simge}] yeniden eskiye; o.gun (varsayılan
                               GELISME_TEST.gun) gün geriye. Sınıf: 'beklenen' (başkanın başlattığı bekleyişin sonucu: yazışma cevabı, görüş),
                               'okumalik' (kulübe ve başkana dair), 'arka' (dünyanın gidişi: öbür maçlar, rakipler, ödemeler). Kategori 'kulup' ·
                               'transfer' · 'lig' · 'basin' · 'para'. Kimlik kaynak:an:… (an kimliğin içindedir; okundu işaretinin budaması için)
     gelismeBekleyenler(k)   → {kararlar:[{isId, baslik, sinif, sonCevap, yer, kisiId}], randevular:[{isId, baslik, dakika, sure, eylem}],
                               takipte:[{meseleId, baslik, satir}]} — “Cevap bekliyor” sekmesi; karar kaynağı Sonra yığınınınki (js/gun-notu.js sonraKararlari)
     gelismeSayaci(k)        → {cevap, yeni}: cevap bekleyen kararlar ve okunmamış (arka olmayan) gelişmeler — şeritteki Haber var
     gelismeOkundu(k, id) · gelismeHepsiOkundu(k)   komutlar (kopyala-yaz); okundu işareti yalnız gazete, TV ve geçmiş satırları içindir — telefonun
                               mesajı konuşma açılınca (kisi.okunan, mesele.gorulen), rapor açılınca (raporGoruldu) okunur
     gelismeDogrula          EK_DENETIMLER
   AR2 (2026-11-05, arayuz-uygulama §3; karar 90): her satırda kaynak {tur:'kisi', id} | {tur:'kulup', id} | {tur:'kurum', kisa, ad} (kim söyledi:
   telefonda kişi, haberde ilgili kulüp ya da kurum, raporda mali işler müdürü, biten işte kulübümüz); cevapsız kalan karar 'kacan' sınıfı
   (kacan:'cevapsiz'; AR3'ün kaçırılan araması 'ulasilamadi'). Saf okumalar:
     gelismeGruplari(L)      aynı günün 'arka' satırları günde tek satıra: {id:'grup:'+tarih, grup:true, sayi, alt:[satır], …}; öbürleri aynen
     gelismeAyrinti(k, x)    seçili satırın ayrıntısı: {kanal, govde, eylemler:[[etiket, bolum, sekme, veri]]}. kanal 'telefon' (konuşmanın son mesajları),
                             'gazete' (kupür), 'belge' (raporun ilk üç satırı), 'lig' (skor), 'para' (hareket), 'ajanda' (biten işin satırları), 'grup'
                             (skorlar ve kısa haberler); bölüm adları ekranın (lig, finans, gazete, ajanda, telefon, kulup)
     gelismeBugun(k)         Haberler'in tek satırı: {sonMac, isler:[{saat, baslik, tur}]} ya da null (gün başı notundan; kasa ve manşet yok, karar 90)
   Önem eşiği, gün sayısı ve sınırlar TEST. */
'use strict';
const GELISME_TEST={gun:14,enCok:400,idEnCok:200,okumalikOnem:50,baslikEnCok:140};
const GELISME_KATEGORILER=[['kulup','Kulüp'],['transfer','Transfer'],['lig','Lig'],['basin','Basın'],['para','Para']];
/* kanalın simgesi (js/simge.js) */
const GELISME_SIMGE={telefon:'telefon',gazete:'gazete',lig:'mac',dosya:'dosya',ajanda:'takvim',para:'kasa',kapi:'kapi'};
/* haberin türü → kategori (bilinmeyen: kulüp) */
const GELISME_HABER_KATEGORI={'hb.sonuc':'lig','hb.hazirlik':'lig','gz.hazirlik':'lig','hb.kirmizi':'lig','gz.mac':'lig','gz.sonuclar':'lig','gz.sakat':'lig','gz.yaklasan':'lig','gz.program':'lig','gz.erteleme':'lig',
  'gz.yeniTarih':'lig','gz.sezonSonu':'lig','tr.haber':'transfer','tr.dunya':'transfer','tr.soylenti':'basin','p12.haber':'kulup'};
/* mesele kategorisi (js/mesele.js meseleKategorisi adı) → gelişme kategorisi */
const GELISME_MESELE_KATEGORI={Mali:'para',Transfer:'transfer',Futbol:'kulup','Sözleşme':'kulup',Kurumsal:'kulup','Kulüp':'kulup'};
const gelismeKisalt=m=>{m=String(m||'').replace(/\s+/g,' ').trim();return m.length>GELISME_TEST.baslikEnCok?m.slice(0,GELISME_TEST.baslikEnCok-1)+'…':m;};
/* p'nin kararlı kısa anahtarı (FNV-1a, 32 bit; aynı haberin kimliği her kuruluşta aynı) */
function gelismePAnahtari(p){
  const s=JSON.stringify(p||{},Object.keys(p||{}).sort());let h=0x811c9dc5;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}
  return h.toString(36);
}
/* kaynak (AR2): kurum kutusunun kısa adı ve adı */
const GELISME_KURUM={lig:{tur:'kurum',kisa:'LİG',ad:'Lig'},tff:{tur:'kurum',kisa:'TFF',ad:'Federasyon'},basin:{tur:'kurum',kisa:'GZT',ad:'Gazete'},
  muhasebe:{tur:'kurum',kisa:'₺',ad:'Muhasebe'}};
const GELISME_TFF=new Set(['gz.program','gz.erteleme','gz.yeniTarih','gz.sezonSonu']);
const gelismeMaliMudur=k=>Object.values(k.kisiler||{}).find(p=>p.rol==='maliMudur'&&p.durum==='aktif')||null;
const gelismeAni=id=>{const m=/^[a-z]+:(-?\d+):/.exec(String(id));return m?+m[1]:null;};
/* haberin gazetedeki sayısı: [dün 08:00, bugün 08:00) penceresi (js/gazete.js gazetePenceresi) */
const gelismeGazeteTarihi=an=>anTarih(an+1440-GUN_BASLANGICI).tarih;
function gelismeOkunmus(k,id,an){
  const O=k.gelismeOkunan;if(!O)return false;
  return Number.isInteger(O.an)&&an<=O.an||Array.isArray(O.idler)&&O.idler.includes(id);
}
/* son kurulan liste (aynı kariyer nesnesi ve anahtar: komutlar yeni nesne kurar; okundu işareti, geçmiş ve haber kaydı da anahtarda) */
const GELISME_ON={k:null,anahtar:null,v:null};
function gelismeListesi(k,o){
  const gun=o&&Number.isInteger(o.gun)?o.gun:GELISME_TEST.gun;
  const anahtar=[gun,simdikiAn(k),(k.gecmis||[]).length,(k.haberler||[]).length,JSON.stringify(k.gelismeOkunan||null),k.gazeteOkunan||''].join('|');
  if(GELISME_ON.k===k&&GELISME_ON.anahtar===anahtar)return GELISME_ON.v;
  const son=simdikiAn(k)+1,bas=son-gun*1440,biz=(k.kisiler[k.baskanId]||{}).kulupId,L=[];
  const ekle=(id,an,x)=>{if(an<bas||an>=son)return;const t=anTarih(an);
    L.push(Object.assign({id,an,tarih:t.tarih,dakika:t.dakika,simge:GELISME_SIMGE[x.kanal]||'nokta'},x,{baslik:gelismeKisalt(x.baslik)}));};
  /* 1. telefon: kişilerden gelen mesajlar (okundu: konuşma açılınca) */
  if(typeof konusmaListesi==='function')for(const c of konusmaListesi(k))for(const m of c.mesajlar){
    if(m.yon!=='gelen')continue;const an=anDakika(m.tarih,m.dakika),ms=m.meseleId&&k.meseleler[m.meseleId];
    const kat=ms?GELISME_MESELE_KATEGORI[meseleKategorisi(ms)[0]]||'kulup':c.kisi&&c.kisi.rol==='maliMudur'?'para':'kulup';
    ekle('tel:'+an+':'+c.anahtar+':'+m.sira,an,{kanal:'telefon',sinif:ms?'okumalik':'beklenen',kategori:kat,baslik:c.ad+': '+m.metin,
      hedef:{tur:'konusma',kisi:c.anahtar},okundu:!m.yeni,kaynak:{tur:'kisi',id:c.anahtar},meseleId:m.meseleId||null});
  }
  /* 2. gazete ve TV'nin haberleri (dünyanın gidişi; bizim kulübü ilgilendiren ya da önemli olan okumalık) */
  if(typeof haberListesi==='function'){
    const gson=typeof gazeteSonTarihi==='function'?gazeteSonTarihi(k):null,gok=k.gazeteOkunan||'';
    for(const h of haberListesi(k,bas,son)){
      const id='hb:'+h.an+':'+h.anahtar+':'+gelismePAnahtari(h.p),bizde=!!biz&&(h.konu.kulupler||[]).includes(biz),gt=gelismeGazeteTarihi(h.an),cikti=!!gson&&gt<=gson;
      const p=h.p||{},hedef=p.macId?{tur:'mac',id:p.macId}:cikti?{tur:'gazete',tarih:gt}:p.oyuncuId&&(k.oyuncular||{})[p.oyuncuId]?{tur:'oyuncu',id:p.oyuncuId}
        :(h.konu.kulupler||[])[0]?{tur:'kulup',id:h.konu.kulupler[0]}:null;
      const kl=(h.konu.kulupler||[]).filter(x=>k.kulupler[x]),kaynak=GELISME_TFF.has(h.anahtar)?GELISME_KURUM.tff:p.macId?GELISME_KURUM.lig
        :kl.length?{tur:'kulup',id:kl.includes(biz)?biz:kl[0]}:GELISME_KURUM.basin;
      ekle(id,h.an,{kanal:p.macId?'lig':'gazete',sinif:bizde||h.onem>=GELISME_TEST.okumalikOnem?'okumalik':'arka',kategori:GELISME_HABER_KATEGORI[h.anahtar]||(h.etiket==='Kulis'?'basin':'kulup'),
        baslik:h.metin,hedef,okundu:gelismeOkunmus(k,id,h.an)||cikti&&gok>=gt,anahtar:h.anahtar,kaynak,gazete:cikti?gt:null});
    }
  }
  /* 3. mali işler müdürünün raporları (okundu: rapor açılınca) */
  const md=gelismeMaliMudur(k),mdKaynak=md?{tur:'kisi',id:md.id}:GELISME_KURUM.muhasebe;
  if(typeof maliRaporlari==='function')for(const {i,h} of maliRaporlari(k)){
    const an=anDakika(h.tarih,h.dakika),tur=String(h.anahtar||'').replace(/^mali\./,'');
    ekle('rp:'+an+':'+i,an,{kanal:'dosya',sinif:'okumalik',kategori:'para',baslik:(typeof RAPOR_BASLIK!=='undefined'&&RAPOR_BASLIK[tur]||'Mali rapor')+' geldi',hedef:{tur:'rapor',i},okundu:!!h.gorulen,kaynak:mdKaynak});
  }
  /* 4. biten işler (zaman özetinin satırları; yazışma cevabı telefonda, mali rapor raporlarda, maçlar ve program haberlerde: burada yok) */
  if(typeof gecmisOzetSatirlari==='function'){
    const ATLA=new Set(['maliRapor','ligMaci','program','hava']);
    for(const g of k.gecmis||[]){
      if(g.tur!=='is'||ATLA.has(g.isTuru)||g.isTuru==='gelisme'&&g.sonuc&&g.sonuc.yazisma)continue;
      const an=anDakika(g.tarih,g.dakika);if(an<bas||an>=son)continue;
      gecmisOzetSatirlari(k,g).forEach((x,j)=>{const id='gc:'+an+':'+g.isId+':'+j,t=g.isTuru;
        const kat=t==='odeme'||t==='ayBasi'?'para':x.kapak==='transfer'?'transfer':x.kapak==='sezonSonu'||x.kapak==='ara'?'lig':'kulup';
        const kacan=t==='ajanda'&&g.sonuc&&g.sonuc.durum==='cevapsiz'?'cevapsiz':null,para=t==='odeme'||t==='ayBasi';
        ekle(id,an,Object.assign({kanal:para?'para':'ajanda',sinif:kacan?'kacan':t==='odeme'?'arka':t==='gelisme'&&g.sonuc&&g.sonuc.haber?'beklenen':'okumalik',kategori:kat,
          baslik:x.metin,hedef:{tur:'ajanda',tarih:g.tarih},okundu:gelismeOkunmus(k,id,an),kaynak:para||!biz?GELISME_KURUM.muhasebe:{tur:'kulup',id:biz},
          gecmis:{isId:g.isId,j}},kacan?{kacan}:{}));});
    }
  }
  /* 5. AR3: biten görüşmeler (js/sahne.js geçmiş satırı; başkan oradaydı: okunmuş). Kanal kapı (odada, dışarıda) ya da telefon */
  for(const g of k.gecmis||[]){
    if(g.tur!=='sahne'||!g.bitis)continue;const an=anDakika(g.bitis.tarih,g.bitis.dakika);
    ekle('sh:'+an+':'+g.id,an,{kanal:g.sahneTur==='telefon'?'telefon':'kapi',sinif:'okumalik',kategori:'kulup',baslik:typeof sahneSatirMetni==='function'?sahneSatirMetni(k,g):'Görüşme',
      hedef:{tur:'sahne',id:g.id},okundu:true,kaynak:{tur:'kisi',id:g.kisiId},sahne:g.id});
  }
  const SIRA={tel:0,rp:1,sh:2,gc:2,hb:3},sira=x=>SIRA[x.id.slice(0,x.id.indexOf(':'))]||9;
  L.sort((a,b)=>b.an-a.an||sira(a)-sira(b)||(a.id<b.id?-1:1));
  const v=L.slice(0,GELISME_TEST.enCok);
  GELISME_ON.k=k;GELISME_ON.anahtar=anahtar;GELISME_ON.v=v;
  return v;
}
/* “Cevap bekliyor”: kararlar (Sonra yığınıyla aynı), bugünün bekleyen randevuları, ekipte ya da haber bekleyen konular (şablonda aşama satırıyla) */
function gelismeBekleyenler(k){
  const kararlar=(typeof sonraKararlari==='function'?sonraKararlari(k):[]).map(x=>{const v=x.veri;
    const yer=typeof mesajKisiAktif==='function'&&mesajKisiAktif(k,v.soran)?'telefon':v.meseleId&&k.meseleler[v.meseleId]?'dosya':'karar';
    const kisiId=v.soran&&k.kisiler[v.soran]?v.soran:null,biz=(k.kisiler[k.baskanId]||{}).kulupId;
    return{isId:x.id,baslik:String(v.baslik||''),sinif:v.sinif||null,sonCevap:{tarih:x.tarih,dakika:x.dakika},yer,kisiId:v.soran||null,
      kaynak:kisiId?{tur:'kisi',id:kisiId}:biz?{tur:'kulup',id:biz}:GELISME_KURUM.muhasebe,gelis:v.gelis?{tarih:v.gelis.tarih,dakika:v.gelis.dakika}:null,meseleId:v.meseleId||null};});
  const randevular=(typeof ajandaGunu==='function'?ajandaGunu(k,k.tarih):[]).filter(r=>r.tur==='ajanda'&&r.durum==='bekliyor'&&!r.saatsiz&&!(k.isler[r.id]&&k.isler[r.id].veri.karar))
    .map(r=>{const v=(k.isler[r.id]||{veri:{}}).veri,kisiId=v.kisiId&&k.kisiler[v.kisiId]?v.kisiId:null;
      return{isId:r.id,baslik:String(r.baslik||''),dakika:r.saat,sure:r.sure||0,eylem:r.eylem||null,kisiId,kaynak:kisiId?{tur:'kisi',id:kisiId}:null};});
  const takipte=Object.values(k.meseleler||{}).filter(m=>m.durum==='ekipte'||m.durum==='haberBekliyor').map(m=>{
    const a=m.sablon&&typeof sablonAsamaSatiri==='function'?sablonAsamaSatiri(k,m):null,o=meseleOzeti(k,m.id),ad=o.adimlar[0];
    const satir=[o.sorumlu?o.sorumlu.ad:null,a?a.metin:ad?ad.metin:o.durumAdi,ad?gunAyYazi(ad.tarih)+' '+saatYazi(ad.dakika):null].filter(Boolean).join(' · ');
    return{meseleId:m.id,baslik:String(m.baslik||''),satir:satir||'Takipte'};});
  return{kararlar,randevular,takipte};
}
/* AR2: aynı günün 'arka' satırları (dünyanın gidişi: öbür maçlar, ödemeler, rakiplerin haberleri) tek satırda; satırın yeri günün en yeni arka
   satırınınki. Başlık: maç sonucu ve öbürlerinin sayısı. Saf (L gelismeListesi çıktısı ya da onun süzgeçten geçmiş hâli) */
function gelismeGruplari(L){
  const G=new Map(),R=[];
  for(const x of L){
    if(x.sinif!=='arka'){R.push(x);continue;}
    let g=G.get(x.tarih);
    if(!g){g={id:'grup:'+x.tarih,grup:true,an:x.an,tarih:x.tarih,dakika:x.dakika,kanal:'grup',sinif:'arka',kategori:x.kategori,simge:'mac',alt:[],sayi:0,okundu:true,
      hedef:{tur:'grup'},kaynak:GELISME_KURUM.lig,baslik:''};G.set(x.tarih,g);R.push(g);}
    g.alt.push(x);g.sayi++;if(g.kategori!==x.kategori)g.kategori='karisik';
  }
  for(const g of G.values()){const n=g.alt.filter(x=>x.kanal==='lig').length,d=g.sayi-n;
    if(!n)g.kaynak=g.alt.every(x=>x.kanal==='para')?GELISME_KURUM.muhasebe:GELISME_KURUM.basin;
    if(!n)g.simge=g.alt.every(x=>x.kanal==='para')?'kasa':'gazete';
    g.baslik=(n?'Ligden: ':'')+[n?n+' maç sonucu':'',d?d+' kısa haber':''].filter(Boolean).join(', ');}
  /* tek satırlık grup satırın kendisidir */
  return R.map(x=>x.grup&&x.sayi===1?x.alt[0]:x);
}
/* AR2: satırın ayrıntısı (saf okuma; ekran kanal görünüşünü çizer). Eylem [etiket, bölüm, sekme, veri]: ekran bölümü ve alt sayfayı açar */
function gelismeAyrinti(k,x){
  if(!x)return null;
  const h=x.hedef||{},E=[];
  const macOzet=id=>{const f=(k.fikstur||[]).find(y=>y.id===id),m=(k.maclar||{})[id];
    return f?{macId:id,ev:f.ev,konuk:f.konuk,hafta:f.hafta,hazirlik:hazirlikMi(f),skor:m?m.skor.slice():null,tarih:f.tarih,dakika:f.dakika}:null;};
  if(x.grup){
    const maclar=x.alt.filter(y=>y.hedef&&y.hedef.tur==='mac').map(y=>macOzet(y.hedef.id)).filter(Boolean),obur=x.alt.filter(y=>!(y.hedef&&y.hedef.tur==='mac')).map(y=>y.baslik);
    if(maclar.length)E.push(['Fikstür ▸','lig','fikstur',null],['Puan durumu ▸','lig','puan',null]);
    return{kanal:'grup',govde:{maclar,obur},eylemler:E};
  }
  if(h.tur==='sahne'){
    const g=(k.gecmis||[]).find(y=>y.tur==='sahne'&&y.id===h.id);if(!g)return{kanal:'gorusme',govde:{satirlar:[],sure:0,tahmin:null},eylemler:E};
    E.push(['Ajandada aç ▸','ajanda',null,{tarih:g.tarih}]);
    return{kanal:'gorusme',govde:{sahneTur:g.sahneTur,kisiId:g.kisiId,sure:g.sure,tahmin:g.tahmin||null,yol:g.yol||0,kesildi:g.kesildi||null,yarida:!!g.yarida,
      satirlar:(g.log||[]).map(l=>({metin:l.metin,dk:l.dk,bilgi:l.bilgi||null}))},eylemler:E};
  }
  if(x.kanal==='telefon'){
    const c=typeof konusmaListesi==='function'?konusmaListesi(k).find(y=>y.anahtar===h.kisi):null,an=x.an;
    const M=c?c.mesajlar.filter(m=>anDakika(m.tarih,m.dakika)<=an).sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika)||a.sira-b.sira).slice(-3)
      .map(m=>({yon:m.yon,metin:String(m.metin||''),tarih:m.tarih,dakika:m.dakika})):[];
    E.push(['Konuşmayı aç ▸','telefon','konusma',{kisi:h.kisi}]);
    if(x.meseleId&&k.meseleler[x.meseleId])E.push(['Dosyayı aç ▸','kulup','dosya',{mesele:x.meseleId}]);
    return{kanal:'telefon',govde:{kisiId:h.kisi,ad:c?c.ad:'',rol:c?c.rol:'',mesajlar:M},eylemler:E};
  }
  if(h.tur==='rapor'){
    const r=(k.haberler||[])[h.i],S=r&&typeof maliRaporOkumasi==='function'?maliRaporOkumasi(k,r).satirlar||[]:[];
    E.push(['Raporu aç ▸','finans','raporlar',{rapor:h.i}]);
    return{kanal:'belge',govde:{satirlar:S.slice(0,3).map(s=>({ad:s.ad,tutar:s.tutar})),tarih:r?r.tarih:x.tarih},eylemler:E};
  }
  if(h.tur==='mac'){
    const m=macOzet(h.id);E.push(['Maç sayfası ▸','lig','mac',{id:h.id}],['Puan durumu ▸','lig','puan',null]);
    return{kanal:'lig',govde:{mac:m,metin:x.baslik},eylemler:E};
  }
  if(x.kanal==='gazete'){
    if(x.gazete)E.push(['Gazetede oku ▸','gazete',null,{tarih:x.gazete}]);
    if(h.tur==='oyuncu')E.push(['Oyuncu ▸','lig','oyuncu',{id:h.id}]);
    if(h.tur==='kulup')E.push(['Kulüp sayfası ▸','lig','kulup',{id:h.id}]);
    return{kanal:'gazete',govde:{metin:x.baslik,tarih:x.gazete||x.tarih,cikti:!!x.gazete},eylemler:E};
  }
  if(x.kanal==='para'){
    E.push(['Finans ▸','finans','durum',null]);
    return{kanal:'para',govde:{metin:x.baslik},eylemler:E};
  }
  /* biten iş: o anın bütün satırları (aynı işin) */
  const g=x.gecmis?(k.gecmis||[]).find(y=>y.tur==='is'&&y.isId===x.gecmis.isId&&anDakika(y.tarih,y.dakika)===x.an):null;
  const S=g&&typeof gecmisOzetSatirlari==='function'?gecmisOzetSatirlari(k,g).map(y=>y.metin):[x.baslik];
  E.push(['Ajandada aç ▸','ajanda',null,{tarih:x.tarih}]);
  const ms=g&&g.sonuc&&g.sonuc.meseleId&&k.meseleler[g.sonuc.meseleId];
  if(ms)E.push(['Dosyayı aç ▸','kulup','dosya',{mesele:ms.id}]);
  return{kanal:'ajanda',govde:{satirlar:S,kacan:x.kacan||null},eylemler:E};
}
/* AR2: Haberler'in “Bugün” satırı — gün başı notunun son maçı ve bugünün kalan işleri (kasa ve manşet yok; karar 90) */
function gelismeBugun(k){
  const n=typeof gunNotu==='function'?gunNotu(k):null;if(!n||n.tarih!==k.tarih)return null;
  return{sonMac:n.sonMac,isler:n.ajanda.filter(x=>x.durum==='bekliyor'&&(x.bitis||x.saat)>=k.gunIciDakika).map(x=>({saat:x.saat,baslik:String(x.baslik||''),tur:x.tur}))};
}
function gelismeSayaci(k){
  const L=gelismeListesi(k);
  return{cevap:gelismeBekleyenler(k).kararlar.length,yeni:L.filter(x=>!x.okundu&&x.sinif!=='arka').length};
}
/* okundu işareti: kimlik listesi kısa tutulur (işaretin altındakiler ve penceredan düşenler budanır) */
function gelismeOkundu(k,id){
  const an=gelismeAni(id);if(an===null)throw new Error(`Gelişme kimliği geçersiz: ${id}`);
  const O=k.gelismeOkunan||{an:null,idler:[]};if(gelismeOkunmus(k,id,an))return;
  const alt=simdikiAn(k)-GELISME_TEST.gun*1440,I=(O.idler||[]).filter(x=>{const a=gelismeAni(x);return a!==null&&a>=alt&&!(Number.isInteger(O.an)&&a<=O.an);}).concat([id]);
  k.gelismeOkunan={an:Number.isInteger(O.an)?O.an:null,idler:I.slice(-GELISME_TEST.idEnCok)};
}
function gelismeHepsiOkundu(k){k.gelismeOkunan={an:simdikiAn(k),idler:[]};}
function gelismeDogrula(k,h=[]){
  const O=k.gelismeOkunan;if(O===undefined||O===null)return h;
  if(typeof O!=='object'||Array.isArray(O)||!Array.isArray(O.idler))h.push('gelismeOkunan bozuk');
  else{if(O.an!==null&&(!Number.isInteger(O.an)||O.an>simdikiAn(k)))h.push('gelismeOkunan.an geçersiz');
    if(O.idler.length>GELISME_TEST.idEnCok)h.push('gelismeOkunan: çok kimlik');
    for(const x of O.idler)if(typeof x!=='string'||gelismeAni(x)===null){h.push(`gelismeOkunan: geçersiz kimlik ${x}`);break;}}
  return h;
}
EK_DENETIMLER.push(gelismeDogrula);
