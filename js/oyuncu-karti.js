/* ============ Chairman — oyuncu kartı: her yerde aynı künye (görüntü; kural ve kayıt yok; RK4-a, 2026-10-31) ============
   Kullanıcı (31 Ekim): “oyuncuya tıklayınca dosyası açılsın, profil resmi olsun; profil arayüzü bir oyun gibi değil”. RK4-a tek bileşeni kurar (bugünkü
   kâğıt dilinde; yeni görsel dil RK3 taslaklarından sonra RK5'te giydirilir): yüz (js/portre.js oyuncuPortreUrl, 3×), büyük forma numarası, ad, mevki
   rozeti, yaş ve ayak, kulüp (arma); “bu sezon” tek şerit ve son beş maçın kutucukları; durum. Bağlam:
     'kulup'  bizim oyuncunun dosyası (js/ekran-dosya.js): durumun ayrıntısı (dönüş, neden) ve sözleşme satırı
     'kamu'   Canlı Skor oyuncu sayfası (js/ekran-canli.js): durum yalnız oynayabilir, sakat, cezalı; sözleşme, dönüş ve doğum yok (R3 kamu sınırı)
     'transfer' Transfer masasındaki oyuncu kâğıdı (js/ekran-transfer.js): kamu bilgisi ve kulüp; sözleşme kâğıdın kendi bölümünde
   oyuncuKarti(k, id, baglam, ek) → html | ''   ek: {test: html (TEST kutusu, künyenin altında), sozlesme: {bitis, maas}, durum: {metin}, tl: fn(kuruş) → yazı,
     kulup: html (kulüp satırının içeriği; Canlı Skor'da kulübe bağlantı)}
   Sınıflar: kök .ok-kart[data-oyuncu][data-baglam]; akış denetimleri için ad .ok-ad (dosyada .dsy-baslik da), künye .ok-kunye (dosyada .dsy-kunye da).
   RK5-b (2026-11-01, karar 83): kulüp bağlamı “Kulüp evrakı 1999” sicil fişidir (.ok-sicil): başlıkta “Futbolcu sicil fişi”, ad ve forma numarası; ataşlı
   fotoğraf (yüz 3×), daktilo alanlar (Forma, Mevki, Doğum, Boy, Ayak, Kulübü, Sözleşme; .ok-kunye.dsy-kunye), kulübün LİSANSLI mührü (mürekkep mavisi);
   altında bu sezon, son beş ve durum. Kamu ve transfer bağlamı düz kart (Kırtasiye). Forma numarası piksel yazı (cihaz göstergesi gibi: formanın yazısı). */
'use strict';
const OK_MEVKI={KL:'Kaleci',DEF:'Savunma',OS:'Orta saha',FV:'Forvet'},OK_AYAK={sag:'Sağ ayak',sol:'Sol ayak',iki:'İki ayak'};
const okYaz=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
function oyuncuKarti(k,id,baglam,ek){
  ek=ek||{};const p=(k.oyuncular||{})[id];if(!p)return'';
  const S=typeof oyuncuSayfasi==='function'?oyuncuSayfasi(k,id):null,kamu=baglam!=='kulup',dosya=baglam==='kulup';
  const yas=S?S.yas:(typeof oyuncuYasi==='function'?oyuncuYasi(p,k.tarih):null),Z=S?S.sezon:{mac:p.mac,dk:p.dk,gol:p.gol|0,sari:p.sari|0,kirmizi:0};
  const kulupAd=(k.kulupler[p.kulupId]||{ad:p.kulupId||'Serbest'}).ad,sy=v=>v==null?'—':String(v);
  const son=S?S.maclar.slice(-5):[],kutu=m=>{const r=m.a>m.y?'G':m.a<m.y?'M':'B';return'<i class="ok-son ok-s'+r+'" title="'+okYaz(m.hafta+'. hafta · '+m.a+'–'+m.y)+'">'+r+'</i>';};
  const durum=ek.durum&&ek.durum.metin?ek.durum.metin:S&&S.durum==='sakat'?'Sakat':S&&S.durum==='cezali'?'Cezalı':'Oynayabilir';
  const arma=typeof armaSvg==='function'&&p.kulupId&&k.kulupler[p.kulupId]?armaSvg(p.kulupId,'kucuk',k.kulupler[p.kulupId].kisa):'';
  const Sz=dosya&&ek.sozlesme?ek.sozlesme:null,tl=ek.tl||(x=>String(x));
  const sezon='<section class="ok-sezon" aria-label="Bu sezon"><span class="ok-sezonAd">Bu sezon</span><dl><div><dt><abbr title="Maç">M</abbr></dt><dd>'+sy(Z.mac)+'</dd></div><div><dt><abbr title="Dakika">Dk</abbr></dt><dd>'+sy(Z.dk)+'</dd></div>'+
      '<div><dt><abbr title="Gol">G</abbr></dt><dd>'+(Z.gol|0)+'</dd></div><div><dt>Kart</dt><dd>'+(Z.sari|0)+'/'+(Z.kirmizi|0)+'</dd></div></dl>'+
      (son.length?'<p class="ok-sonBes" aria-label="Son maçları">'+son.map(kutu).join('')+'</p>':'')+'</section>',
    durumP='<p class="ok-durum" data-durum="'+okYaz(S?S.durum||'hazir':'hazir')+'">'+okYaz(durum)+'</p>';
  /* RK5-b: kulübün kendi oyuncusu — sicil fişi */
  if(dosya){
    const gun=t=>typeof gunAyYazi==='function'?gunAyYazi(t)+' '+t.slice(0,4):t,c=k.kulupler[p.kulupId];
    const alan=(ad,deger)=>'<div><dt>'+ad+'</dt><dd>'+deger+'</dd></div>';
    const A=[alan('Forma',String(p.no|0)),alan('Mevki',okYaz(OK_MEVKI[p.mevki]||p.mevki)),
      p.dogumTarihi?alan('Doğum',okYaz(gun(p.dogumTarihi))+(yas!=null?' ('+yas+')':'')):yas!=null?alan('Yaş',String(yas)):'',
      p.boy&&typeof boyYazi==='function'?alan('Boy','<span class="ok-boy">'+okYaz(boyYazi(p))+'</span>'):'',p.ayak&&OK_AYAK[p.ayak]?alan('Ayak',okYaz(OK_AYAK[p.ayak].replace(/ ayak$/,''))):'',
      alan('Kulübü',okYaz(kulupAd)),Sz?alan('Sözleşme',okYaz(gun(Sz.bitis))+' · aylık <span class="dsy-tutar">'+okYaz(tl(Sz.maas))+'</span>'):''].join('');
    return'<article class="ok-kart ok-sicil" data-oyuncu="'+okYaz(id)+'" data-baglam="kulup">'+
      '<header class="ok-sicilBas"><h3 class="ok-ad dsy-baslik">'+okYaz(p.ad)+'</h3><span class="ok-forma" aria-label="Forma numarası">'+(p.no|0)+'</span></header>'+
      '<div class="ok-lisans"><div class="ok-foto">'+(typeof oyuncuPortreHtml==='function'?oyuncuPortreHtml(p,'ok-portre',3):'')+'<span class="ok-atas" aria-hidden="true"></span></div>'+
        '<dl class="ok-kunye dsy-kunye ok-alanlar">'+A+'</dl>'+
        (c?'<span class="ok-muhur" aria-label="Lisanslı">'+okYaz(String(c.ad).toLocaleUpperCase('tr-TR'))+'<small>LİSANSLI</small></span>':'')+'</div>'+
      (ek.test||'')+sezon+durumP+(ek.alt||'')+'</article>';
  }
  return'<article class="ok-kart" data-oyuncu="'+okYaz(id)+'" data-baglam="'+okYaz(baglam||'kamu')+'">'+
    '<header class="ok-bas">'+(typeof oyuncuPortreHtml==='function'?oyuncuPortreHtml(p,'ok-portre',3):'')+
      '<div class="ok-kimlik"><span class="ok-forma" aria-label="Forma numarası">'+(p.no|0)+'</span>'+
        '<h3 class="ok-ad'+(dosya?' dsy-baslik':'')+'">'+okYaz(p.ad)+'</h3>'+
        '<p class="ok-kunye'+(dosya?' dsy-kunye':'')+'"><span class="ok-mevki" data-mevki="'+okYaz(p.mevki)+'">'+okYaz(OK_MEVKI[p.mevki]||p.mevki)+'</span>'+
          (yas!=null?'<span>'+yas+' yaş'+(dosya&&p.dogumTarihi?' <small>('+okYaz(typeof gunAyYazi==='function'?gunAyYazi(p.dogumTarihi)+' '+p.dogumTarihi.slice(0,4):p.dogumTarihi)+')</small>':'')+'</span>':'')+
          (p.ayak&&OK_AYAK[p.ayak]?'<span>'+OK_AYAK[p.ayak]+'</span>':'')+(p.boy&&typeof boyYazi==='function'?'<span class="ok-boy">'+boyYazi(p)+'</span>':'')+'</p>'+   /* RK4-b: boy */
        '<p class="ok-kulup">'+(ek.kulup||arma+'<span>'+okYaz(kulupAd)+'</span>')+'</p>'+(ek.test||'')+'</div></header>'+
    sezon+durumP+
    (ek.alt||'')+   /* RK8-a: kartın altında ek (Canlı Skor'da Takip et) */
    (Sz?'<p class="ok-sozlesme">Sözleşme '+okYaz(typeof gunAyYazi==='function'?gunAyYazi(Sz.bitis)+' '+Sz.bitis.slice(0,4):Sz.bitis)+' · aylık <span class="dsy-tutar">'+okYaz(tl(Sz.maas))+'</span></p>':'')+
    '</article>';
}
/* kartın görünüşü (bugünkü kâğıt dili: STIL.kagit değişkenleri); dar kapta tek sütun */
const OK_CSS=`
.ok-kart{display:grid;gap:.55em;font-variant-numeric:tabular-nums}
.ok-bas{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.8em;align-items:center}
.ok-portre{image-rendering:pixelated;image-rendering:crisp-edges;border:1px solid var(--k-cizgi);box-shadow:.12em .15em 0 var(--k-golge);background:var(--k-zemin)}
.ok-kimlik{display:grid;gap:.15em;min-width:0;position:relative}
.ok-forma{position:absolute;right:0;top:0;font-family:var(--display);font-size:2.6em;line-height:.85;color:var(--k-kulup);opacity:.9}
.ok-kart .ok-ad,.oda .ok-kart h3.ok-ad{margin:0;padding-right:2.4em;font-size:1.35em;line-height:1.1}
.ok-kunye{margin:0;display:flex;flex-wrap:wrap;gap:.2em .6em;align-items:center;color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.92em)}
.ok-mevki{display:inline-block;padding:0 .4em;border:1px solid var(--k-cizgi);border-radius:.2em;color:var(--k-yazi);font-weight:600;letter-spacing:.04em}
.ok-mevki[data-mevki="KL"]{border-color:var(--k-mavi)}.ok-mevki[data-mevki="DEF"]{border-color:var(--k-yesil)}.ok-mevki[data-mevki="FV"]{border-color:var(--k-kulup)}
.ok-kulup{margin:0;display:flex;gap:.35em;align-items:center;font-size:max(var(--k-enKucuk,12px),.92em)}
.ok-sezon{display:flex;flex-wrap:wrap;gap:.4em 1em;align-items:center;padding:.4em .6em;background:var(--k-serit);border:1px solid var(--k-cizgi)}
.ok-sezonAd{font-size:max(var(--k-enKucuk,12px),.78em);letter-spacing:.06em;color:var(--k-soluk)}
.ok-sezon dl{margin:0;display:flex;gap:1em}
.ok-sezon dl div{display:grid;justify-items:center;gap:0}
.ok-sezon dt{font-size:max(var(--k-enKucuk,12px),.78em);letter-spacing:.06em;color:var(--k-soluk)}
.ok-sezon dd{margin:0;font-weight:600;font-size:1.1em}
.ok-sonBes{margin:0 0 0 auto;display:flex;gap:.2em}
.ok-son{display:inline-grid;place-items:center;width:1.5em;height:1.5em;font-style:normal;font-weight:600;font-size:max(var(--k-enKucuk,12px),.82em);color:var(--k-serit)}
.ok-sG{background:var(--k-yesil)}.ok-sB{background:#8a8273}.ok-sM{background:var(--k-kulup)}
.ok-durum{margin:0;font-weight:600}.ok-durum[data-durum="sakat"],.ok-durum[data-durum="cezali"]{color:var(--k-kirmizi)}
.ok-sozlesme{margin:0;color:var(--k-soluk)}
/* kadro listesinde adın yanında küçük yüz (1×, 24 px) */
.dsy-kadroAd{display:inline-flex;align-items:center;gap:.4em}
.dsy-kadroYuz{image-rendering:pixelated;image-rendering:crisp-edges;border:1px solid var(--k-cizgi);flex:none}
/* RK5-b sicil fişi (Kulüp evrakı 1999): kalın çerçeveli fiş, ataşlı fotoğraf, daktilo alanlar, mavi mühür */
.ok-sicil{gap:.7em;container:ok-sicil / inline-size}
.ok-sicilBas{position:relative;display:grid;gap:.1em;padding-right:3em}
.ok-sicilKat{font-family:var(--mono);font-size:max(var(--k-enKucuk,12px),.8em);letter-spacing:.06em;text-transform:uppercase;color:var(--k-soluk)}
.ok-sicil .ok-ad,.oda .ok-sicil h3.ok-ad{padding-right:0;font-family:var(--serif);font-weight:600;font-size:1.5em}
.ok-sicil .ok-forma{position:absolute;right:0;top:.1em;font-size:2.6em}
.ok-lisans{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);gap:.9em 1.1em;align-items:start;padding:.8em .9em;border:.14em solid var(--k-yazi);background:#fffaf0}
.ok-foto{position:relative;padding:.35em;background:#fff;border:1px solid var(--k-cizgi);box-shadow:.12em .18em 0 rgba(0,0,0,.15);transform:rotate(-2deg)}
.ok-foto .ok-portre{display:block;border:0;box-shadow:none}
.ok-atas{position:absolute;top:-.6em;left:1em;width:.8em;height:2em;border:.13em solid #8b8f96;border-radius:.45em}
/* .ok-alanlar dosyada .dsy-kunye de taşır (akış denetimi): kurallar fişe bağlı, daha özgül */
.ok-sicil .ok-alanlar{margin:0;min-width:0;display:grid;grid-template-columns:minmax(0,1fr);gap:.3em 1.1em;color:var(--k-yazi);font-size:1em}
.ok-alanlar div{display:grid;border-bottom:1px dotted var(--k-cizgi);min-width:0}
.ok-alanlar dt{font-size:max(var(--k-enKucuk,12px),.74em);letter-spacing:.06em;text-transform:uppercase;color:var(--k-soluk)}
.ok-alanlar dd{margin:0;font-family:var(--mono);font-weight:500;overflow-wrap:anywhere}
.ok-muhur{grid-column:1/-1;justify-self:end;display:grid;justify-items:center;margin-top:-.2em;padding:.15em .6em;border:.18em double var(--k-mavi);border-radius:.25em;color:var(--k-mavi);
  font-family:var(--mono);font-weight:700;font-size:.9em;letter-spacing:.1em;transform:rotate(-4deg);opacity:.85;pointer-events:none}
.ok-muhur small{font-size:max(var(--k-enKucuk,12px),.7em);letter-spacing:.06em}
/* fiş genişse alanlar iki sütun; çok darsa fotoğraf alanların üstünde (adlı kap: kamu kartının ekran sorgularını etkilemez) */
@container ok-sicil (min-width:34em){.ok-sicil .ok-alanlar{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container ok-sicil (max-width:21em){.ok-lisans{grid-template-columns:1fr}.ok-foto{justify-self:start}}
@container (max-width:520px){.ok-bas{grid-template-columns:1fr}.ok-forma{position:static;font-size:2em}}`;
if(typeof document!=='undefined'&&!document.getElementById('ok-stil')){const s=document.createElement('style');s.id='ok-stil';s.textContent=OK_CSS;document.head.appendChild(s);}
