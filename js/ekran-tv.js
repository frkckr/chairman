/* ============ Chairman — TV sayfası: odadaki TV'nin teletext sayfaları (görüntü katmanı; kural yok; RK8-a, 2026-11-01) ============
   Plan araclar/plan/rk-program.md §11.1 madde 10, §11.3. Odadaki TV tıklanınca ya da 7 ile odak kabında açılır (js/ekran-oda.js tvPaneli).
   TV hiçbir kart açmaz, zamanı değiştirmez; okurken zaman durur (odak kabının genel kuralı). Üç sayfa (düğme ya da ←/→):
     100 Haberler   bugünün haberleri önem sırasıyla (js/haber.js tvHaberleri); satıra dokununca Canlı Skor'un maç, oyuncu ya da kulüp sayfası
     200 Skorlar    bugünün maçları saatleriyle (bitti: skor; oynanıyor: kırmızı dakika ve “İzle ▸”; başlamadı: saat), altında haftanın kalanı
     300 Puan durumu ve program  puan durumu (kısa) ve açıklanmış haftaların gün ve saati, ertelenenler ve yeni tarihleri
   Bir sayfada en çok TV_SAYFA_EN_COK satır, kalanı “…”. Seçiciler denemelerle sözleşmedir: .tv-sayfa[data-sayfa], .tv-sekme[data-tv],
   .tv-satir (data-eylem="tvAc" data-tur data-id), .tv-izle (data-eylem="tvIzle" data-mac), .tv-canli.
     tvSayfasi(k, sayfa, y) → html. y: {yaz}. Canlı maçlar js/lig-takvimi.js oynananLigMaclari'ndan (dakika oda saatinden) */
'use strict';
/* CM1-b (karar 87): 100 Haberler kalktı — haberler tek listede (Haberler ekranı); TV canlı skor ve öbür maçın penceresidir */
const TV_SAYFALAR=[['skor','200','Skorlar'],['program','300','Puan durumu · Program']];
const TV_SAYFA_EN_COK=30;
const TV_GUN=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
const tvGun=t=>{const [y,a,g]=t.split('-').map(Number);return TV_GUN[new Date(Date.UTC(y,a-1,g)).getUTCDay()];};
/* RK-D (2026-11-01, kullanıcı: “bugün yarın gibi ibareler değil, maçların tarihleri olsun”): gün başlığı tam gün adı ve tarihle (“Cuma 4 Aralık”) */
const TV_GUN_TAM=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const tvGunBasligi=t=>{const [y,a,g]=t.split('-').map(Number);return TV_GUN_TAM[new Date(Date.UTC(y,a-1,g)).getUTCDay()]+' '+gunAyYazi(t);};
(function tvStili(){
  if(typeof document==='undefined'||document.getElementById('tvStili'))return;
  const Z=STIL.kagit.tv,st=document.createElement('style');st.id='tvStili';
  st.textContent=`
.tv-sayfa{display:grid;gap:.5em;padding:.7em .9em .8em;background:${Z.zemin};color:${Z.yazi};border:.18em solid ${Z.kasa};border-radius:.35em;font-variant-numeric:tabular-nums}
.tv-ust{display:flex;align-items:baseline;justify-content:space-between;gap:.6em;padding:.15em .45em;background:${Z.serit};color:${Z.seritYazi};font-weight:700;letter-spacing:.06em}
.tv-ust small{font-weight:600;letter-spacing:0}
.tv-sekmeler{display:flex;flex-wrap:wrap;gap:.35em}
.tv-sekme{appearance:none;border:1px solid ${Z.cizgi};background:transparent;color:${Z.yazi};padding:.2em .55em;font:inherit;font-size:max(var(--k-enKucuk,12px),.9em);cursor:pointer}
.tv-sekme b{color:${Z.sari};margin-right:.35em}
.tv-sekme[aria-selected="true"]{background:${Z.sari};color:${Z.zemin};border-color:${Z.sari}}
.tv-sekme[aria-selected="true"] b{color:${Z.zemin}}
.oda .tv-sayfa h5,.tv-sayfa h5{margin:.35em 0 0;color:${Z.camgobegi};font-size:max(var(--k-enKucuk,12px),.82em);letter-spacing:.1em;text-transform:uppercase;font-weight:700}
.tv-liste{display:grid;gap:.1em;margin:0;padding:0;list-style:none}
.tv-satir{appearance:none;display:grid;grid-template-columns:3.6em minmax(0,1fr);gap:.55em;width:100%;padding:.2em .25em;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
.tv-satir:hover,.tv-satir:focus-visible{background:${Z.vurgu}}
.tv-satir time{color:${Z.sari}}
.tv-satir span{min-width:0}
.tv-etiket{color:${Z.camgobegi};margin-right:.4em;font-size:max(var(--k-enKucuk,12px),.85em);text-transform:uppercase;letter-spacing:.06em}
.tv-etiket svg.smg{margin-right:.35em}
.tv-mac{display:grid;grid-template-columns:4.2em minmax(0,1fr) 3.4em minmax(0,1fr) auto;align-items:center;gap:.45em;padding:.15em .25em}
.tv-mac .tv-ev{text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tv-mac .tv-dep{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tv-mac b{text-align:center;color:${Z.sari}}
.tv-mac small{color:${Z.soluk}}
.tv-canli small{color:${Z.kirmizi};font-weight:700}
.tv-izle{appearance:none;border:1px solid ${Z.kirmizi};background:transparent;color:${Z.yazi};font:inherit;font-size:max(var(--k-enKucuk,12px),.85em);padding:.05em .45em;cursor:pointer}
.tv-izle:hover,.tv-izle:focus-visible{background:${Z.kirmizi};color:${Z.zemin}}
.tv-tablo{width:100%;border-collapse:collapse}
.tv-tablo td{padding:.1em .3em}
.tv-tablo td:first-child{color:${Z.sari};width:2em}
.tv-tablo td:nth-child(n+3){text-align:right;width:2.6em}
.tv-not{color:${Z.soluk};font-size:max(var(--k-enKucuk,12px),.9em);margin:0}
.oda .tv-sayfa h6,.tv-sayfa h6{margin:.3em 0 0;padding-bottom:.05em;border-bottom:1px solid ${Z.cizgi};color:${Z.yazi};font-size:max(var(--k-enKucuk,12px),.85em);font-weight:700}
.oda .tv-sayfa h6.tv-bugun,.tv-sayfa h6.tv-bugun{color:${Z.sari}}
.tv-devam{color:${Z.soluk};margin:0}
`;
  document.head.appendChild(st);
})();
function tvSayfasi(k,sayfa,y){
  const yaz=y.yaz,s=TV_SAYFALAR.some(x=>x[0]===sayfa)?sayfa:'skor',ad=id=>((k.kulupler||{})[id]||{ad:id}).ad;
  const ust='<div class="tv-ust"><span>TEST SPOR · TELETEXT</span><small>'+yaz(tvGun(k.tarih)+' '+gunAyYazi(k.tarih))+' '+saatYazi(k.gunIciDakika)+'</small></div>';
  const sekmeler='<nav class="tv-sekmeler" role="tablist" aria-label="TV sayfaları">'+TV_SAYFALAR.map(([id,no,a])=>'<button type="button" class="tv-sekme" role="tab" data-eylem="tvSayfa" data-tv="'+id+'" aria-selected="'+(id===s?'true':'false')+'"><b>'+no+'</b>'+yaz(a)+'</button>').join('')+'</nav>';
  const kes=L=>L.length>TV_SAYFA_EN_COK?L.slice(0,TV_SAYFA_EN_COK).join('')+'<p class="tv-devam">…</p>':L.join('');
  /* maçlar gün gün: tarih başlığı (bugünün başlığı sarı, “bugün” kelimesi yok), altında satırlar saat sırasıyla */
  const gunlu=(F,satir)=>{const L=[];let t=null;for(const f of F){if(f.tarih!==t){t=f.tarih;L.push('<h6'+(t===k.tarih?' class="tv-bugun"':'')+'>'+yaz(tvGunBasligi(t))+'</h6>');}L.push(satir(f));}return L;};
  const sirali=F=>F.slice().sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika));
  let ic='';
  if(s==='haber'){
    const H=typeof tvHaberleri==='function'?tvHaberleri(k):[];
    const hedef=h=>h.konu.maclar.length?['mac',h.konu.maclar[0]]:h.konu.oyuncular.length?['oyuncu',h.konu.oyuncular[0]]:h.konu.kulupler.length?['kulup',h.konu.kulupler[0]]:null;
    ic=H.length?'<ol class="tv-liste">'+kes(H.map(h=>{const t=anTarih(h.an),hd=hedef(h);
      const ic2='<time>'+saatYazi(t.dakika)+'</time><span><span class="tv-etiket">'+(typeof simgeSvg==='function'?simgeSvg(haberSimgesi(h.anahtar)):'')+yaz(h.etiket)+'</span>'+yaz(String(h.metin).replace(/^TEST: /,''))+'</span>';   /* RK5-a: tür simgesi */
      return'<li>'+(hd?'<button type="button" class="tv-satir" data-eylem="tvAc" data-tur="'+hd[0]+'" data-id="'+yaz(hd[1])+'">'+ic2+'</button>':'<div class="tv-satir">'+ic2+'</div>')+'</li>';}))+'</ol>'
      :'<p class="tv-not">TEST: Bugün önemli haber yok.</p>';
  }else if(s==='skor'){
    const C=new Map((typeof oynananLigMaclari==='function'?oynananLigMaclari(k):[]).map(x=>[x.f.id,x.dk])),bugun=k.tarih;
    const satir=f=>{const m=(k.maclar||{})[f.id],dk=C.get(f.id),aciklandi=typeof saatiAciklandi!=='function'||saatiAciklandi(k,f);
      const sol=m?(m.hukmen?'Hük.':'Bitti'):dk?dk:f.tarihBekliyor?'Ert.':aciklandi?saatYazi(f.dakika):'—';
      return'<div class="tv-mac'+(dk?' tv-canli':'')+'"><small>'+yaz(sol)+'</small><span class="tv-ev">'+yaz(ad(f.ev))+'</span><b>'+(m?m.skor[0]+'–'+m.skor[1]:'–')+'</b><span class="tv-dep">'+yaz(ad(f.konuk))+'</span>'+
        (dk?'<button type="button" class="tv-izle" data-eylem="tvIzle" data-mac="'+yaz(f.id)+'">İzle ▸</button>':'<span></span>')+'</div>';};
    /* RK-D: haftanın maçları gün başlıklarıyla; bugün başka haftanın (ertelenmiş) maçı oynanıyorsa o da kendi gününde */
    const hv=typeof canliVarsayilanHafta==='function'?canliVarsayilanHafta(k):null;
    const F=sirali((k.fikstur||[]).filter(f=>!f.tarihBekliyor&&(f.hafta===hv||f.tarih===bugun))),E=(k.fikstur||[]).filter(f=>f.hafta===hv&&f.tarihBekliyor);
    const L=gunlu(F,satir);if(E.length){L.push('<h6>Ertelendi · yeni tarih açıklanacak</h6>');for(const f of E)L.push(satir(f));}
    ic=(hv!==null?'<h5>'+hv+'. hafta</h5>':'')+(L.length?kes(L):'<p class="tv-not">TEST: Programda maç yok.</p>');
  }else{
    const T=typeof sezonTablosu==='function'?sezonTablosu(k):[];
    ic='<h5>Puan durumu</h5><table class="tv-tablo"><tbody>'+T.map((t,i)=>'<tr><td>'+(i+1)+'</td><td>'+yaz(t.ad)+'</td><td>'+t.O+'</td><td>'+t.P+'</td></tr>').join('')+'</tbody></table>';
    const S=k.sezon||{},pa=S.programAciklanan|0,F=(k.fikstur||[]).filter(f=>f.hafta>=(S.ilkHafta|0)&&!(k.maclar||{})[f.id]);   /* devralınan haftalar değil */
    const H=[...new Set(F.filter(f=>f.hafta<=pa&&!f.tarihBekliyor).map(f=>f.hafta))].sort((a,b)=>a-b),E=F.filter(f=>f.tarihBekliyor);
    const L=[];
    for(const h of H){L.push('<h5>'+h+'. hafta</h5>');L.push(...gunlu(sirali(F.filter(x=>x.hafta===h&&!x.tarihBekliyor)),f=>
      '<div class="tv-mac"><small>'+yaz(saatYazi(f.dakika))+'</small><span class="tv-ev">'+yaz(ad(f.ev))+'</span><b>–</b><span class="tv-dep">'+yaz(ad(f.konuk))+'</span><span></span></div>'));}
    if(E.length){L.push('<h5>Ertelenen</h5>');for(const f of E)L.push('<div class="tv-mac"><small>Ert.</small><span class="tv-ev">'+yaz(ad(f.ev))+'</span><b>–</b><span class="tv-dep">'+yaz(ad(f.konuk))+'</span><span></span></div>');}
    ic+=L.length?kes(L):'<p class="tv-not">TEST: Açıklanmış program yok.</p>';
  }
  return'<section class="tv-sayfa" data-sayfa="'+s+'">'+ust+sekmeler+ic+'</section>';
}
