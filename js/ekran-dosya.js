/* ============ Chairman — dosya: masada açılan karton dosya (görüntü katmanı; yol haritası 2.8M) ============
   Kullanıcı kararı (2026-10-02): dosya sağdaki dar panel değil, odanın ortasında büyük ve gerçek bir nesne olarak açılır; oda arkada hafif kararır.
     Üst kenar   açık konuların sekmeleri (kategori simgesi ve kısa başlık; cevap bekleyen sekmede kırmızı nokta) ve ayrı Arşiv sekmesi.
     Sol sayfa   kategori, büyük başlık, durum damgası, yürüten ve son tarih; ataşlı küçük kâğıtlar hâlinde "Bilinenler" (kaynağıyla), sözler,
                 açılır "Geçmiş".
     Sağ sayfa   ilgili kişinin portresi ve görevi; karar varsa tek kart (js/ekran-kart.js kararKarti; H1: kaydırınca yüzü o cevaba döner,
                 bırakınca uygulanır); karar yoksa ne olduğu ve beklenen adım. Karardan sonra kısa sonuç aynı sayfada görünür.
   Kural içermez: veri js/mesele.js (meseleOzeti) ve js/ajanda.js okuma işlevlerinden gelir; düğmeler js/ekran-oda.js'in data-eylem yoluna gider.
   dosyaGorunumu(k, D, Y) → html
     D: {secili, sira:[açık mesele kimlikleri], arsiv, rapor, seciliRapor, sonuc, donus, karar(isId) → html}
     Y: {yaz, kategoriYazi, tarihKisa, anYazi, sonTarih(ozet), neOldu(ozet), sozler(ozet) → html, testKutu?, maliBaglantisi(mesele) → bool}
   H2-d (2026-10-26): Arşiv'in yanında “Raporlar (n)” sekmesi — mali işler müdürünün raporları (js/mali-rapor.js maliRaporlari, maliRaporOkumasi): solda tarih ve
     başlıkla liste (görülmemişte nokta), sağda seçili rapor (bugünkü kâğıt dili; eksi tutar kırmızı). Mali konudaki “Son mali özet ▸” oraya götürür.
   S-c (2026-10-27): Raporlar'ın solunda “Kadro” sekmesi (js/kadro-dosyasi.js): tek geniş sayfada kadro listesi (yalnız gözlenebilir sayılar);
     ada dokununca iki sayfalı oyuncu dosyası (solda künye, bu sezon, durum ve sözleşme; sağda tarihli notlar). D.kadro, D.seciliOyuncu;
     Y.tlYazi, Y.oyuncuTest(id) → html (Test bilgileri açıkken). Konu yokken ve rapor yokken dosya Kadro ile açılır.
   Renk ve ölçüler STIL.kagit.dosya'dadır. Stil, masaüstü kopyasında da gelsin diye belgeye buradan eklenir. */
(function dosyaStili(){
  if(typeof document==='undefined'||document.getElementById('dosyaStili'))return;
  const D=STIL.kagit.dosya,st=document.createElement('style');st.id='dosyaStili';
  st.textContent=`
/* U1: perde, şeritlerin katmanı ve dosyanın yeri odak kabındadır (js/ekran-odak.js); dosya kabı doldurur */
.dsy{position:absolute;z-index:1;left:17%;right:2.2%;top:2.9em;bottom:5.4em;display:grid;grid-template-rows:auto minmax(0,1fr)}
.dsy-sekmeler{display:flex;align-items:flex-end;gap:.25em;padding:0 1.2em;min-width:0;overflow:hidden}
.oda .dsy button.dsy-sekme{display:flex;align-items:center;gap:.4em;max-width:16em;min-width:0;padding:.35em .8em .3em;border:1px solid ${D.kapakKoyu};border-bottom:0;
  border-radius:.5em .5em 0 0;background:${D.sekme};color:var(--k-yazi);font-size:max(var(--k-enKucuk,12px),.9em);white-space:nowrap}
.dsy-sekme span{overflow:hidden;text-overflow:ellipsis}
/* inceleme (H2-e): sayaçlı sekmeler ve Kapat daralmaz (yazısı yandakinin üstüne binmesin); konu sekmelerinin başlığı kısalır */
.oda .dsy button.dsy-raporSekme,.oda .dsy button.dsy-arsivSekme,.oda .dsy button.dsy-kadroSekme,.dsy-sekmeler .od-kapat{flex:none}
.dsy-gizli{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.oda .dsy button.dsy-sekme[aria-selected="true"]{background:${D.sayfa};font-weight:600;padding-bottom:.45em;position:relative;top:1px}
.oda .dsy button.dsy-sekme.dsy-arsivSekme{margin-left:auto;background:${D.kapakKoyu};color:${D.sayfa};border-color:${D.kapakKoyu}}
.oda .dsy button.dsy-sekme.dsy-arsivSekme[aria-selected="true"]{background:${D.sayfa};color:var(--k-yazi)}
/* H2-d: Raporlar sekmesi Arşiv'in solunda; görülmemiş raporda ayrı işaret (konu sekmelerinin noktasıyla karışmaz) */
.oda .dsy button.dsy-sekme.dsy-raporSekme{margin-left:auto}
.oda .dsy button.dsy-raporSekme+button.dsy-arsivSekme{margin-left:0}
/* S-c: Kadro sekmesi sağ grubun başıdır (Kadro · Raporlar · Arşiv) */
.oda .dsy button.dsy-sekme.dsy-kadroSekme{margin-left:auto}
.oda .dsy button.dsy-kadroSekme+button.dsy-raporSekme,.oda .dsy button.dsy-kadroSekme+button.dsy-arsivSekme{margin-left:0}
/* S-c: kadro listesi tek geniş sayfa; tablo sabit düzenli, ad üç noktayla kısalır, tutar tek satır */
.dsy-ic.dsy-icGenis{grid-template-columns:minmax(0,1fr)}
/* R1-f: dar karede tablo küçülmez (Futbolcu sütunu en az ~3,4 em; sabit sütunlar 42,6 em); geniş sayfa dikeyde olduğu gibi yatayda da kayar */
.dsy-sayfa.dsy-genis{overflow-x:auto}
.dsy-kadro{width:100%;min-width:46em;table-layout:fixed;border-collapse:collapse;font-size:max(var(--k-enKucuk,12px),.88em)}
.dsy-kadro th{font-weight:600;color:var(--k-soluk);text-align:left;padding:.15em .3em;border-bottom:1px solid ${D.cizgi};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsy-kadro td{padding:.16em .3em;border-bottom:1px solid ${D.cizgi};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsy-kadro abbr{text-decoration:none;cursor:help}
.dsy-kadro .dsy-s{text-align:right}
.oda .dsy-kadro td button.od-baglanti{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}
.dsy-kadro tr.dsy-kadroEksik td{color:var(--k-soluk)}
.dsy-yeniRapor{display:inline-block;width:.55em;height:.55em;border-radius:50%;background:var(--k-kirmizi);flex:none}
/* raporda tutar tek satır (₺ alta düşmez) ve tam genişlikte; dar sayfada ad kayar. En düşük bakiyenin tarihi tutarın altında.
   Ödeme ve hareket satırı: üstte tarih ve tutar, altta tam genişlikte açıklama (büyük yazıda da okunur) */
.dsy-tutar,.dsy-raporListe .od-satir>span:last-child{white-space:nowrap}
.od-dl.dsy-rapor{grid-template-columns:minmax(0,1fr) auto}
.dsy-rapor small{display:block;color:var(--k-soluk)}
.dsy-raporListe .od-satir{grid-template-columns:minmax(0,1fr) auto;row-gap:0}
.dsy-raporListe .od-satir>.od-an{grid-column:1;grid-row:1}
.dsy-raporListe .od-satir>.od-ad{grid-column:1/-1;grid-row:2}
.dsy-raporListe .od-satir>span:last-child{grid-column:2;grid-row:1}
.dsy-nokta{width:.55em;height:.55em;border-radius:50%;background:var(--k-kirmizi);flex:none}
.dsy-kapak{min-height:0;display:grid;padding:.7em;background:${D.kapak};border-radius:.4em;box-shadow:.4em .55em 0 var(--k-golge),inset 0 0 0 .2em ${D.kapakKoyu}}
.dsy-ic{min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.12fr);background:${D.sayfa};border-radius:.2em;box-shadow:0 .15em .3em rgba(0,0,0,.25)}
.dsy-sayfa{min-height:0;overflow-y:auto;padding:.9em 1.1em 1em;display:grid;gap:.6em;align-content:start;position:relative}
.dsy-sol{border-right:1px solid ${D.cizgi};box-shadow:inset -.6em 0 .8em -.7em rgba(60,40,10,.25)}
.dsy-kat{display:flex;align-items:center;gap:.5em;font-size:max(var(--k-enKucuk,12px),.82em);letter-spacing:.12em;text-transform:uppercase;color:var(--k-soluk)}
.dsy-baslik{margin:0;font-family:var(--display);font-weight:400;font-size:2.1em;line-height:.95;letter-spacing:.02em;color:var(--k-yazi)}
.dsy-devir{justify-self:start;color:${D.mavi};font-weight:600}
.dsy-asama{margin:0;justify-self:start;padding:.1em .5em;border-left:.25em solid var(--k-vurgu);background:var(--k-serit);font-size:max(var(--k-enKucuk,12px),.92em)}
.dsy-asama.dsy-asamaSon{border-left-color:var(--k-cizgi);color:var(--k-soluk)}
.dsy-damga{justify-self:start;padding:.15em .55em .05em;border:.16em solid currentColor;border-radius:.2em;font-family:var(--display);font-size:1.25em;letter-spacing:.08em;
  text-transform:uppercase;transform:rotate(-4deg);opacity:.85}
.dsy-d-kararBekliyor{color:var(--k-kirmizi)}.dsy-d-ekipte,.dsy-d-haberBekliyor{color:${D.mavi}}.dsy-d-kapandi{color:var(--k-soluk)}
.dsy-kunye{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.15em .8em;margin:0;font-size:max(var(--k-enKucuk,12px),.92em)}
.dsy-kunye dt{color:var(--k-soluk)}.dsy-kunye dd{margin:0}
.dsy-sayfa h4{margin:.3em 0 0;font-size:max(var(--k-enKucuk,12px),.8em);font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--k-vurgu)}
.dsy-notlar{list-style:none;margin:0;padding:0;display:grid;gap:.55em}
.dsy-sor{display:grid;gap:.15em;margin:0 0 .8em;padding:.45em .6em;border:1px dashed var(--k-cizgi)}
.dsy-sor small{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.85em)}
.dsy-not{position:relative;padding:.55em .7em .45em;background:${D.not};border:1px solid ${D.cizgi};box-shadow:.12em .18em 0 rgba(60,40,10,.15);transform:rotate(-.6deg)}
.dsy-not:nth-child(even){transform:rotate(.5deg)}
.dsy-not::before{content:"";position:absolute;top:-.55em;left:1.1em;width:.55em;height:1.5em;border:.16em solid ${D.atas};border-radius:.4em;background:transparent}
/* RK4-a: notun kaynağı solda renkli şerit (antrenman yeşil, maç kulüp kırmızısı, hoca mavi) */
.dsy-not[data-tur=antrenman]{border-left:.3em solid var(--k-yesil)}.dsy-not[data-tur=mac]{border-left:.3em solid var(--k-kulup)}.dsy-not[data-tur=hoca],.dsy-not[data-tur=gorus]{border-left:.3em solid var(--k-mavi)}
.dsy-not small{display:block;margin-top:.2em;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.84em)}
.dsy-gecmis summary{cursor:pointer;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.9em)}
.dsy-gecmis ul{list-style:none;margin:.3em 0 0;padding:0;display:grid;gap:.2em;font-size:max(var(--k-enKucuk,12px),.9em)}
.dsy-gecmis li{display:grid;grid-template-columns:7.2em minmax(0,1fr);gap:.5em}
.dsy-gecmis li span:first-child{color:var(--k-soluk)}
.dsy-kisi{display:flex;gap:.7em;align-items:center;padding-bottom:.5em;border-bottom:1px dashed ${D.cizgi}}
.dsy-kisi .od-portre{width:3.6em;height:3.6em;box-shadow:.12em .15em 0 rgba(60,40,10,.2)}
.dsy-kisi b{display:block;font-size:1.15em}
.dsy-kisi small{color:var(--k-soluk)}
/* tek kart (H1): dosyanın sağ sayfasında büyük yüz (STIL.kagit.kart.yuz.buyuk; U2: üç yüzün hepsi, kart en uzun yüz kadar); konu alıntı biçiminde */
.dsy .kk-yuzKat{font-size:${STIL.kagit.kart.yuz.buyuk}em}
/* sayfa yatay kaymaz; sürüklenen kartın kayması sayfanın iç kutusuyla sınırlı (U2, js/ekran-kart.js) */
.dsy .dsy-sag{overflow-x:hidden}
.dsy .kk-konu{font-size:1em;line-height:1.4;padding:.2em 0 .2em .8em;border-left:.22em solid ${D.cizgi};font-style:italic}
.dsy-sonuc{padding:.5em .7em;background:${D.not};border-left:.25em solid var(--k-yesil)}
.dsy-bos{color:var(--k-soluk);font-style:italic}
.dsy-arsiv{list-style:none;margin:0;padding:0;display:grid}
.dsy-arsiv li{display:grid;grid-template-columns:6.5em minmax(0,1fr);gap:.6em;padding:.3em 0;border-bottom:1px solid ${D.cizgi}}
.dsy-arsiv li span:first-child{color:var(--k-soluk)}
.oda .dsy-sekmeler .od-kapat{align-self:center;margin:0 0 .3em .5em;font-size:max(var(--k-enKucuk,12px),.9em);flex:none}
`;
  document.head.appendChild(st);
})();

function dosyaGorunumu(k,D,Y){
  const yaz=Y.yaz,L=meseleListesi(k),arsivL=L.filter(m=>m.durum==='kapandi');
  const DAMGA={kararBekliyor:'Cevap bekliyor',ekipte:'Takipte',haberBekliyor:'Takipte',kapandi:'Kapandı'};
  /* sekmeler: açık konular sırayla; seçili konu kapandıysa (arşivden açıldıysa) kendi sekmesiyle görünür */
  const sekmeKimlik=D.sira.slice();
  if(!D.arsiv&&D.secili&&k.meseleler[D.secili]&&!sekmeKimlik.includes(D.secili))sekmeKimlik.push(D.secili);
  /* S-c: Kadro görünümü öbürlerinin önündedir (seçiliyse rapor, arşiv ve konu sekmeleri seçili görünmez) */
  const kadroGor=typeof kadroSatirlari==='function'&&kadroVar(k),kadroAcik=kadroGor&&!!D.kadro;
  const R=typeof maliRaporlari==='function'&&typeof maliRaporOkumasi==='function'?maliRaporlari(k):[],raporGor=!kadroAcik&&!!D.rapor&&R.length>0;
  const sekme=id=>{const m=k.meseleler[id],[ad,s]=meseleKategorisi(m),sec=!kadroAcik&&!D.arsiv&&!raporGor&&id===D.secili;
    return'<button type="button" class="dsy-sekme" role="tab" data-eylem="dosyaAc" data-mesele="'+id+'" data-gezinti="1" aria-selected="'+(sec?'true':'false')+'" title="'+yaz(m.baslik)+'">'+
      '<i class="od-kSimge" aria-hidden="true">'+yaz(s)+'</i><span>'+yaz(m.baslik)+'</span>'+(m.durum==='kararBekliyor'?'<i class="dsy-nokta" aria-label="cevap bekliyor"></i>':'')+'</button>';};
  let ic='<nav class="dsy-sekmeler" role="tablist" aria-label="Açık dosyalar">'+sekmeKimlik.map(sekme).join('')+
    (kadroGor?'<button type="button" class="dsy-sekme dsy-kadroSekme" role="tab" data-eylem="kadroSekme" aria-selected="'+(kadroAcik?'true':'false')+'">Kadro</button>':'')+
    (R.length?'<button type="button" class="dsy-sekme dsy-raporSekme" role="tab" data-eylem="raporlar" aria-selected="'+(raporGor?'true':'false')+'">Raporlar ('+R.length+')'+
      (R.some(x=>!x.h.gorulen)?'<i class="dsy-yeniRapor" aria-hidden="true"></i><span class="dsy-gizli"> (yeni rapor)</span>':'')+'</button>':'')+
    '<button type="button" class="dsy-sekme dsy-arsivSekme" role="tab" data-eylem="arsiv" aria-selected="'+(D.arsiv&&!raporGor&&!kadroAcik?'true':'false')+'"'+(arsivL.length||D.arsiv?'':' disabled')+'>Arşiv ('+arsivL.length+')</button>'+
    '</nav>';
  let sol='',sag='',genis=null;
  if(kadroAcik){
    const biz=k.kisiler[k.baskanId].kulupId,Sat=kadroSatirlari(k,biz),O=D.seciliOyuncu&&Sat.some(x=>x.id===D.seciliOyuncu)?oyuncuDosyasi(k,D.seciliOyuncu):null;
    const tl=Y.tlYazi||(t=>paraYazi(t).replace(/,\d\d ₺$/,' ₺')),sy=v=>v===null?'—':String(v);
    /* listede sözleşme bitişi yılıyla (hepsi 31 Mayıs), dönüş günü kısa ayla; tam yazı oyuncu dosyasında */
    const kisaGun=t=>{const [,a,g]=t.split('-').map(Number);return g+' '+TR_AYLAR[a-1].slice(0,3);},bitis=t=>t?t.slice(0,4):'—';
    const durum=(s,c,kisa)=>s?'Sakat'+(s.belirsiz?' (belirsiz)':' · '+(kisa?kisaGun(s.donus):gunAyYazi(s.donus))):c?'Cezalı · '+c.mac+' maç':'—';
    const MV={KL:'Kaleci',DEF:'Savunma',OS:'Orta saha',FV:'Forvet'},AY={sag:'Sağ',sol:'Sol',iki:'İki ayak'},ab=(a,t)=>'<abbr title="'+t+'">'+a+'</abbr>';
    if(!O){
      genis='<p class="dsy-kat">Kadro</p><h3 class="dsy-baslik">'+yaz(k.kulupler[biz].ad)+'</h3>'+
        '<table class="dsy-kadro"><colgroup>'+['2.4em','auto','3em','2.7em','2.4em','3.4em','2.3em','3.3em','10.7em','4em','8.4em'].map(w=>'<col'+(w==='auto'?'':' style="width:'+w+'"')+'>').join('')+'</colgroup>'+
        '<thead><tr><th>'+ab('No','Forma numarası')+'</th><th>Futbolcu</th><th>'+ab('Mvk','Mevki')+'</th><th class="dsy-s">Yaş</th><th class="dsy-s">'+ab('M','Bu sezon maç')+'</th><th class="dsy-s">'+ab('Dk','Bu sezon dakika')+'</th><th class="dsy-s">'+ab('G','Gol')+'</th><th class="dsy-s">'+ab('Kart','Sarı / kırmızı')+'</th><th>Durum</th><th>'+ab('Bitiş','Sözleşme bitişi')+'</th><th class="dsy-s">'+ab('Maaş','Aylık maaş')+'</th></tr></thead><tbody>'+
        Sat.map(x=>'<tr'+(x.sakat||x.ceza?' class="dsy-kadroEksik"':'')+'><td>'+x.no+'</td><td><button type="button" class="od-baglanti dsy-kadroAd" data-eylem="oyuncuAc" data-oyuncu="'+x.id+'" title="'+yaz(x.ad)+'">'+
          (typeof oyuncuPortreHtml==='function'?oyuncuPortreHtml(k.oyuncular[x.id],'dsy-kadroYuz',1):'')+yaz(x.ad)+'</button></td><td>'+x.mevki+'</td><td class="dsy-s">'+x.yas+'</td>'+
          '<td class="dsy-s">'+sy(x.mac)+'</td><td class="dsy-s">'+sy(x.dk)+'</td><td class="dsy-s">'+x.gol+'</td><td class="dsy-s">'+x.sari+'/'+x.kirmizi+'</td><td title="'+yaz(x.sakat?x.sakat.neden:x.ceza?x.ceza.neden:'')+'">'+yaz(durum(x.sakat,x.ceza,true))+'</td>'+
          '<td>'+yaz(bitis(x.bitis))+'</td><td class="dsy-s dsy-tutar">'+(x.maas===null?'—':yaz(tl(x.maas)))+'</td></tr>').join('')+'</tbody></table>'+
        '<p class="od-not">M ve Dk bu sezonun; devralınan haftalar TEST üretimi; eski kayıtta —.</p>';
    }else{
      const U=O.kunye,Z=O.sezon,Sz=O.sozlesme;
      /* RK4-a: sol sayfa ortak oyuncu kartı (js/oyuncu-karti.js; kulüp bağlamı: durumun ayrıntısı ve sözleşme). Kart yüklenmediyse eski künye */
      const dm=O.durum.sakat?durum(O.durum.sakat,null)+(O.durum.sakat.neden?' — '+O.durum.sakat.neden:''):O.durum.ceza?durum(null,O.durum.ceza)+(O.durum.ceza.neden?' — '+O.durum.ceza.neden:''):'Oynayabilir';
      sol='<p class="dsy-kat">Oyuncu dosyası'+(Y.oyuncuTest?Y.oyuncuTest(D.seciliOyuncu):'')+'</p>'+
        (typeof oyuncuKarti==='function'?oyuncuKarti(k,D.seciliOyuncu,'kulup',{sozlesme:Sz,durum:{metin:dm},tl}):
        '<h3 class="dsy-baslik">'+yaz(U.ad)+'</h3><dl class="dsy-kunye"><dt>Forma</dt><dd>'+U.no+'</dd><dt>Mevki</dt><dd>'+yaz(MV[U.mevki]||U.mevki)+'</dd><dt>Yaş</dt><dd>'+U.yas+'</dd></dl>'+
        '<h4>Bu sezon</h4><dl class="od-dl"><dt>Maç</dt><dd>'+sy(Z.mac)+'</dd><dt>Dakika</dt><dd>'+sy(Z.dk)+'</dd><dt>Gol</dt><dd>'+Z.gol+'</dd></dl><p>'+yaz(dm)+'</p>');
      /* R2-e: “Hocaya sor ▸” oyuncu sorusunu doğrudan gönderir (telefondaki konu; cevap birkaç saat sonra gelir ve buraya not düşer) */
      const G=typeof girisimListesi==='function'?girisimListesi(k).find(x=>x.id==='yaz.teknikDirektor.oyuncu'):null;
      sag=(G?'<p class="dsy-sor"><button type="button" class="od-baglanti" data-eylem="girisim" data-girisim="'+yaz(G.id)+'" data-arg="'+yaz(D.seciliOyuncu)+'"'+(G.engel?' disabled':'')+'>Hocaya sor ▸</button>'+
        '<small>'+yaz(G.engel||'Cevap birkaç saat içinde gelir; buraya not düşer.')+'</small></p>':'')+'<h4>Notlar</h4>'+(O.notlar.length?'<ul class="dsy-notlar">'+O.notlar.map(n=>'<li class="dsy-not" data-tur="'+yaz(n.tur||'')+'">'+yaz(n.metin)+'<small>— '+yaz(n.kaynak)+' · '+yaz(Y.tarihKisa(n.tarih))+'</small></li>').join('')+'</ul>':'<p class="dsy-bos">Henüz not yok.</p>');
    }
  }else if(raporGor){
    const sec=R.some(x=>x.i===D.seciliRapor)?D.seciliRapor:R[0].i,O=maliRaporOkumasi(k,k.haberler[sec]),eksi=t=>t<0?' class="od-eksi"':'',tl=t=>yaz(paraYazi(t));
    sol='<p class="dsy-kat">Raporlar</p><h3 class="dsy-baslik">Mali işler</h3><ul class="dsy-arsiv">'+R.map(x=>{const B=maliRaporOkumasi(k,x.h);
      return'<li><span>'+yaz(Y.tarihKisa(x.h.tarih))+'</span><span><button type="button" class="od-baglanti" data-eylem="raporAc" data-rapor="'+x.i+'"'+(x.i===sec?' aria-current="true"':'')+'>'+yaz(B.baslik)+(x.h.gorulen?'':'<span class="dsy-gizli"> (yeni)</span>')+'</button>'+
        (x.h.gorulen?'':' <i class="dsy-yeniRapor" aria-hidden="true"></i>')+'</span></li>';}).join('')+'</ul>';
    sag='<p class="dsy-kat">'+yaz(O.kaynakAd)+' · '+yaz(Y.tarihKisa(O.tarih))+' '+saatYazi(O.dakika)+'</p><h3 class="dsy-baslik">'+yaz(O.baslik)+'</h3>'+(O.uyari?'<p class="od-uyari">'+yaz(O.uyari)+'</p>':'')+
      '<dl class="od-dl dsy-rapor">'+O.satirlar.map((s,j)=>'<dt>'+yaz(s.ad)+'</dt><dd'+eksi(s.tutar)+'><span class="dsy-tutar">'+(j?tl(s.tutar):'<b>'+tl(s.tutar)+'</b>')+'</span>'+(s.tarih?'<small>'+yaz(Y.tarihKisa(s.tarih))+'</small>':'')+'</dd>').join('')+'</dl>'+
      (O.odemeler.length?'<h4>Ödeme takvimi</h4><ul class="od-liste od-sar dsy-raporListe" style="--an:7.5em">'+O.odemeler.map(x=>'<li class="od-satir"><span class="od-an">'+yaz(Y.tarihKisa(x.tarih))+'</span><span class="od-ad">'+yaz(x.kalem)+'</span><span'+eksi(x.tutar)+'>'+tl(x.tutar)+'</span></li>').join('')+'</ul>':'')+
      (O.hareketler.length?'<h4>Hareketler</h4><ul class="od-liste od-sar dsy-raporListe" style="--an:10.4em">'+O.hareketler.map(x=>'<li class="od-satir"><span class="od-an">'+yaz(Y.tarihKisa(x.tarih))+' '+saatYazi(x.dakika)+'</span><span class="od-ad">'+yaz(x.aciklama)+'</span><span'+eksi(x.tutar)+'>'+tl(x.tutar)+'</span></li>').join('')+'</ul>':'');
  }else if(D.arsiv||!D.secili||!k.meseleler[D.secili]){
    sol='<p class="dsy-kat">Arşiv</p><h3 class="dsy-baslik">Kapanan konular</h3>'+(arsivL.length?'<ul class="dsy-arsiv">'+arsivL.map(m=>'<li><span>'+(m.kapanis?yaz(Y.tarihKisa(m.kapanis.tarih)):'')+'</span><span>'+
      Y.kategoriYazi(m)+' <button type="button" class="od-baglanti" data-eylem="dosyaAc" data-mesele="'+m.id+'">'+yaz(m.baslik)+'</button></span></li>').join('')+'</ul>':'<p class="dsy-bos">Henüz kapanan konu yok.</p>');
    sag='<p class="dsy-bos">'+(sekmeKimlik.length?'Açık bir konu seçmek için üstteki sekmelere bak.':'Açık dosya yok.')+'</p>';
  }else{
    const o=meseleOzeti(k,D.secili),m=o.mesele,[katAd,katS]=meseleKategorisi(m);
    const st=m.durum!=='kapandi'?Y.sonTarih(o):'';
    /* U1: '◂ Mesaja dön' / '◂ Ajandaya dön' odak kabının başlığındaki ‹ Geri'dir (js/ekran-oda.js odakGeriHedef) */
    sol+='<p class="dsy-kat"><i class="od-kSimge" aria-hidden="true">'+yaz(katS)+'</i>'+yaz(katAd)+(Y.testKutu?Y.testKutu():'')+'</p>'+
      '<h3 class="dsy-baslik">'+yaz(m.baslik)+'</h3><span class="dsy-damga dsy-d-'+m.durum+'">'+yaz(DAMGA[m.durum]||o.durumAdi)+'</span>'+
      /* R4-k: şablonlu konuda tek satır aşama (kapanınca sonuç; js/sablon.js sablonAsamaSatiri) */
      (()=>{const a=typeof sablonAsamaSatiri==='function'?sablonAsamaSatiri(k,m):null;return a?'<p class="dsy-asama'+(a.son?' dsy-asamaSon':'')+'">'+yaz(a.son?'Sonuç: '+a.metin:a.metin)+'</p>':'';})()+
      /* U3 (envanter 15): devredilen iş kimde ve ne zamana kadar (“Ayla'da · Perşembe'ye kadar”) */
      (()=>{const e=m.durum==='ekipte'&&o.sorumlu&&typeof devirEtiketi==='function'?o.adimlar.find(a=>a.tur==='ekip'):null,t=e&&devirEtiketi(k,o.sorumlu.id,e.tarih);return t?'<span class="dsy-devir">'+yaz(t)+'</span>':'';})()+
      '<dl class="dsy-kunye"><dt>Yürüten</dt><dd>'+(o.sorumlu?yaz(o.sorumlu.ad):'—')+'</dd>'+(st?'<dt>'+yaz(st.split(': ')[0])+'</dt><dd><b>'+yaz(st.split(': ').slice(1).join(': '))+'</b></dd>':'')+'</dl>';
    if(o.bilgiler.length)sol+='<h4>Bilinenler</h4><ul class="dsy-notlar">'+o.bilgiler.slice(-4).map(x=>'<li class="dsy-not">'+yaz(x.metin)+'<small>— '+yaz(x.kaynak)+'</small></li>').join('')+'</ul>';
    sol+=Y.sozler(o);
    if(Y.maliBaglantisi&&Y.maliBaglantisi(m)&&R.length)sol+='<p class="od-not">Para durumu: <button type="button" class="od-baglanti" data-eylem="raporlar">Son mali özet ▸</button></p>';
    sol+='<details class="dsy-gecmis"><summary>Geçmiş ve belgeler ('+o.olaylar.length+')</summary><ul>'+o.olaylar.slice().reverse().map(x=>'<li><span>'+yaz(Y.tarihKisa(x.tarih).split(' ').slice(0,2).join(' ')+' '+saatYazi(x.dakika))+'</span><span>'+yaz(x.metin)+'</span></li>').join('')+'</ul></details>';
    /* sağ sayfa: kişi, sonuç, karar ya da beklenen adım. H1 (F6-a borcu): karar türü isteğe bağlı kisi(k,is) → {ad, rol} kancasıyla kendi kişisini
       verebilir (ör. hoca adayı: kişi kaydı yok, boş portre); yoksa soran, ilgili kişi ya da konunun ilk kişisi */
    const kis=o.karar&&k.isler[o.karar.isId]?k.isler[o.karar.isId].veri:null,tur=kis&&typeof KARAR_TURLERI!=='undefined'?KARAR_TURLERI[kis.karar]:null;
    const kanca=tur&&typeof tur.kisi==='function'?tur.kisi(k,k.isler[o.karar.isId]):null;
    const yuz=kanca?null:k.kisiler[(kis&&(kis.soran||kis.kisiId))||(o.kisiler[0]&&o.kisiler[0].id)];
    if(kanca)sag+='<div class="dsy-kisi">'+portreHtml(null,'od-portre','TD')+'<p><b>'+yaz(kanca.ad)+'</b><small>'+yaz(kanca.rol)+'</small></p></div>';
    else if(yuz)sag+='<div class="dsy-kisi">'+portreHtml(yuz,'od-portre')+'<p><b>'+yaz(yuz.ad)+'</b><small>'+yaz(kisiRolu(k,yuz))+'</small></p></div>';
    if(D.sonuc&&D.sonuc.meseleId===m.id)sag+='<section class="dsy-sonuc"><p><b>Sonuç</b> '+yaz(D.sonuc.metin)+'</p>'+(o.adimlar.length&&!o.karar?'<p class="od-not">Beklenen: '+yaz(o.adimlar[0].metin)+' ('+yaz(Y.anYazi(o.adimlar[0].tarih,o.adimlar[0].dakika,o.adimlar[0].saatsiz))+')</p>':'')+'</section>';
    if(o.karar)sag+=D.karar(o.karar.isId);
    else{
      const n=Y.neOldu(o);
      if(n.length)sag+='<h4>Ne oldu?</h4>'+n.map(x=>'<p>'+yaz(x)+'</p>').join('');
      if(m.durum!=='kapandi'){
        if(o.adimlar.length)sag+='<p><b>Bekleyen</b> '+o.adimlar.map(a=>yaz(a.metin)+(a.tutar!==undefined?' '+yaz(paraYazi(a.tutar).replace(/,\d\d ₺$/,' ₺')):'')+' <span class="od-not">('+yaz(Y.anYazi(a.tarih,a.dakika,a.saatsiz))+')</span>').join(' · ')+'</p>';
        sag+='<p class="dsy-bos">Şimdi yapılacak bir şey yok; haber için ilerle.</p>';
      }
    }
  }
  if(genis!==null)return'<div class="dsy" role="dialog" aria-label="Dosya">'+ic+'<div class="dsy-kapak"><div class="dsy-ic dsy-icGenis"><article class="dsy-sayfa dsy-genis">'+genis+'</article></div></div></div>';
  return'<div class="dsy" role="dialog" aria-label="Dosya">'+ic+'<div class="dsy-kapak"><div class="dsy-ic"><article class="dsy-sayfa dsy-sol">'+sol+'</article><article class="dsy-sayfa dsy-sag">'+sag+'</article></div></div></div>';
}
