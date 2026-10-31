/* ============ Chairman — oyuncu kartı: her yerde aynı künye (görüntü; kural ve kayıt yok; RK4-a, 2026-10-31) ============
   Kullanıcı (31 Ekim): “oyuncuya tıklayınca dosyası açılsın, profil resmi olsun; profil arayüzü bir oyun gibi değil”. RK4-a tek bileşeni kurar (bugünkü
   kâğıt dilinde; yeni görsel dil RK3 taslaklarından sonra RK5'te giydirilir): yüz (js/portre.js oyuncuPortreUrl, 3×), büyük forma numarası, ad, mevki
   rozeti, yaş ve ayak, kulüp (arma); “bu sezon” tek şerit ve son beş maçın kutucukları; durum. Bağlam:
     'kulup'  bizim oyuncunun dosyası (js/ekran-dosya.js): durumun ayrıntısı (dönüş, neden) ve sözleşme satırı
     'kamu'   Canlı Skor oyuncu sayfası (js/ekran-canli.js): durum yalnız oynayabilir, sakat, cezalı; sözleşme, dönüş ve doğum yok (R3 kamu sınırı)
     'transfer' Transfer masasındaki oyuncu kâğıdı (js/ekran-transfer.js): kamu bilgisi ve kulüp; sözleşme kâğıdın kendi bölümünde
   oyuncuKarti(k, id, baglam, ek) → html | ''   ek: {test: html (TEST kutusu, künyenin altında), sozlesme: {bitis, maas}, durum: {metin}, tl: fn(kuruş) → yazı,
     kulup: html (kulüp satırının içeriği; Canlı Skor'da kulübe bağlantı)}
   Sınıflar: kök .ok-kart[data-oyuncu][data-baglam]; akış denetimleri için ad .ok-ad (dosyada .dsy-baslik da), künye .ok-kunye (dosyada .dsy-kunye da). */
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
  return'<article class="ok-kart" data-oyuncu="'+okYaz(id)+'" data-baglam="'+okYaz(baglam||'kamu')+'">'+
    '<header class="ok-bas">'+(typeof oyuncuPortreHtml==='function'?oyuncuPortreHtml(p,'ok-portre',3):'')+
      '<div class="ok-kimlik"><span class="ok-forma" aria-label="Forma numarası">'+(p.no|0)+'</span>'+
        '<h3 class="ok-ad'+(dosya?' dsy-baslik':'')+'">'+okYaz(p.ad)+'</h3>'+
        '<p class="ok-kunye'+(dosya?' dsy-kunye':'')+'"><span class="ok-mevki" data-mevki="'+okYaz(p.mevki)+'">'+okYaz(OK_MEVKI[p.mevki]||p.mevki)+'</span>'+
          (yas!=null?'<span>'+yas+' yaş'+(dosya&&p.dogumTarihi?' <small>('+okYaz(typeof gunAyYazi==='function'?gunAyYazi(p.dogumTarihi)+' '+p.dogumTarihi.slice(0,4):p.dogumTarihi)+')</small>':'')+'</span>':'')+
          (p.ayak&&OK_AYAK[p.ayak]?'<span>'+OK_AYAK[p.ayak]+'</span>':'')+'</p>'+
        '<p class="ok-kulup">'+(ek.kulup||arma+'<span>'+okYaz(kulupAd)+'</span>')+'</p>'+(ek.test||'')+'</div></header>'+
    '<section class="ok-sezon" aria-label="Bu sezon"><span class="ok-sezonAd">Bu sezon</span><dl><div><dt><abbr title="Maç">M</abbr></dt><dd>'+sy(Z.mac)+'</dd></div><div><dt><abbr title="Dakika">Dk</abbr></dt><dd>'+sy(Z.dk)+'</dd></div>'+
      '<div><dt><abbr title="Gol">G</abbr></dt><dd>'+(Z.gol|0)+'</dd></div><div><dt>Kart</dt><dd>'+(Z.sari|0)+'/'+(Z.kirmizi|0)+'</dd></div></dl>'+
      (son.length?'<p class="ok-sonBes" aria-label="Son maçları">'+son.map(kutu).join('')+'</p>':'')+'</section>'+
    '<p class="ok-durum" data-durum="'+okYaz(S?S.durum||'hazir':'hazir')+'">'+okYaz(durum)+'</p>'+
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
@container (max-width:520px){.ok-bas{grid-template-columns:1fr}.ok-forma{position:static;font-size:2em}}`;
if(typeof document!=='undefined'&&!document.getElementById('ok-stil')){const s=document.createElement('style');s.id='ok-stil';s.textContent=OK_CSS;document.head.appendChild(s);}
