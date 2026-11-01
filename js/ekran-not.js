/* ============ Chairman — gün başı notu: masadaki sarı bloknot (görüntü katmanı; RK5-b, 2026-11-01; karar 83) ============
   Kural js/gun-notu.js gunNotu'dadır (kayıttan her seferinde kurulur; okundu yalnız k.notOkunan). Görünüm “Kulüp evrakı 1999”: sarı bloknot, mavi çizgi,
   özel kalemin notu (kişi adı yok: “Özel kalem”). Bölümler: son maç (skor, sonuç, ligdeki yeri) · bugün (defterin satırları ve antrenman) · cevap
   bekleyenler (masadaki Sonra yığını) · kasa (tek rakam ve 90 günde en düşük) · gazetenin manşeti. Altta kâğıdın kendi eylemleri: Defteri aç (ikincil),
   Güne başla (ana; notu masaya bırakır). Okumak zaman almaz; satırlarda eylem yoktur (not gösterir, iş yerinde yapılır).
     gunNotuGorunumu(k, y) → html. y: {yaz, tarihYazi(t), saatYazi(dk), tlKisa(kuruş)} */
'use strict';
(function notStili(){
  if(typeof document==='undefined'||document.getElementById('notStili'))return;
  const N=STIL.kagit.not,st=document.createElement('style');st.id='notStili';
  st.textContent=`
.oda section.odk[data-odak="not"] .odk-kagit{background-color:${N.kagit};background-image:linear-gradient(transparent calc(1.9em - 1px),${N.cizgi} calc(1.9em - 1px));background-size:100% 1.9em;
  border-color:${N.kenar};border-top:.5em solid ${N.ust}}
.oda section.odk[data-odak="not"] .odk-kagit>header.odk-ust{border-bottom-color:${N.kenar}}
.gn{display:grid;gap:.9em}
.gn-kat{margin:0;font-family:var(--mono);font-size:max(var(--k-enKucuk,12px),.85em);color:var(--k-soluk)}
.oda .gn h3.gn-baslik,.gn-baslik{margin:0;font-family:var(--serif);font-weight:600;font-size:1.45em;line-height:1.15}
.gn-izgara{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1em 1.4em;align-items:start}
.gn-izgara section{display:grid;gap:.25em;min-width:0}
.gn-bugun{grid-row:span 2}
.oda .gn h4,.gn h4{margin:0;display:flex;align-items:center;gap:.4em;font-size:max(var(--k-enKucuk,12px),.82em);font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--k-soluk)}
.gn ol,.gn ul{list-style:none;margin:0;padding:0;display:grid;gap:.15em}
.gn-bugun li{display:grid;grid-template-columns:6.6em minmax(0,1fr);gap:0 .6em;padding:.2em 0;border-bottom:1px solid ${N.kenar}}
.gn-bugun time{font-family:var(--mono);font-weight:600;white-space:nowrap}
.gn-bugun li[data-durum="yapildi"] span,.gn-bugun li[data-durum="kacirildi"] span{color:var(--k-soluk);text-decoration:line-through}
.gn-bekleyen li{display:grid;gap:0;padding:.2em 0;border-bottom:1px solid ${N.kenar}}
.gn small,.gn-bekleyen small{color:var(--k-soluk);font-size:max(var(--k-enKucuk,12px),.86em)}
.gn-kutu{padding:.5em .7em;background:rgba(255,255,255,.45);border:1px solid ${N.kenar}}
.gn-skor{margin:0;font-size:1.15em}
.gn-skor b{font-family:var(--mono)}
.gn-kasa b{font-family:var(--mono);font-size:1.3em}
.gn-manset p{margin:0;font-family:var(--serif);font-weight:600;font-size:1.15em;line-height:1.2}
.gn-bos{margin:0;color:var(--k-soluk);font-style:italic}
.gn-sonuc{display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:.35em;font-style:normal;font-weight:700;font-size:max(var(--k-enKucuk,12px),.82em);color:#fff;border-radius:.15em;vertical-align:.1em}
.gn-sonuc[data-s="G"]{background:var(--k-yesil)}.gn-sonuc[data-s="B"]{background:#6b6355}.gn-sonuc[data-s="M"]{background:var(--k-kulup)}
.gn-eylem{display:flex;flex-wrap:wrap;align-items:center;gap:.6em;padding-top:.7em;border-top:1px solid ${N.kenar}}
.gn-eylem .gn-bosluk{flex:1}
.gn-eylem button{display:inline-flex;align-items:center;gap:.45em}
@container (max-width:820px){.gn-izgara{grid-template-columns:minmax(0,1fr)}.gn-bugun{grid-row:auto}}
`;
  document.head.appendChild(st);
})();
function gunNotuGorunumu(k,y){
  const yaz=y.yaz,N=typeof gunNotu==='function'?gunNotu(k):null,smg=a=>typeof simgeSvg==='function'?simgeSvg(a):'';
  if(!N)return'<p class="gn-bos">Bugün not yok.</p>';
  const ad=id=>(k.kulupler[id]||{ad:id}).ad,M=N.sonMac;
  const GUN=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],gunAdi=t=>{const [a,b,c]=t.split('-').map(Number);return GUN[new Date(Date.UTC(a,b-1,c)).getUTCDay()];};
  const SONUC={G:'Galibiyet',B:'Beraberlik',M:'Mağlubiyet'};
  const mac=M?'<section class="gn-kutu gn-dun"><h4>'+smg('mac')+'Son maç · '+yaz(M.tarih===N.tarih?'bugün':gunAdi(M.tarih)+' '+y.tarihYazi(M.tarih))+'</h4>'+
      '<p class="gn-skor"><i class="gn-sonuc" data-s="'+M.sonuc+'" title="'+SONUC[M.sonuc]+'">'+M.sonuc+'</i>'+yaz(ad(M.ev))+' <b>'+M.skor[0]+'–'+M.skor[1]+'</b> '+yaz(ad(M.konuk))+'</p>'+
      (M.sira?'<small>Ligde '+M.sira+'. sıradayız'+(M.hukmen?' · hükmen':'')+'.</small>':'')+'</section>'
    :'<section class="gn-kutu gn-dun"><h4>'+smg('mac')+'Son maç</h4><p class="gn-bos">Henüz maç oynamadık.</p></section>';
  const saat=r=>y.saatYazi(r.saat)+(r.bitis?'–'+y.saatYazi(r.bitis%1440):'');
  const bugun='<section class="gn-bugun"><h4>'+smg('takvim')+(N.tarih===k.tarih?'Bugün':yaz(y.tarihYazi(N.tarih)))+'</h4>'+(N.ajanda.length?'<ol>'+N.ajanda.map(r=>
      '<li data-durum="'+yaz(r.durum)+'" data-tur="'+yaz(r.tur)+'"><time>'+yaz(saat(r))+'</time><span>'+yaz(r.baslik)+'</span></li>').join('')+'</ol>':'<p class="gn-bos">Defterde iş yok.</p>')+'</section>';
  const SINIF=typeof KART_SINIFLARI!=='undefined'?KART_SINIFLARI:{};
  const bek='<section class="gn-bekleyen"><h4>'+smg('uyari')+'Cevap bekleyenler</h4>'+(N.bekleyen.length?'<ul>'+N.bekleyen.slice(0,4).map(b=>
      '<li><span>'+yaz(b.baslik)+'</span><small>'+(b.sinif&&SINIF[b.sinif]?yaz(SINIF[b.sinif])+' · ':'')+'en geç '+yaz(b.tarih===k.tarih?'bugün':y.tarihYazi(b.tarih))+' '+y.saatYazi(b.dakika)+'</small></li>').join('')+'</ul>'+
      (N.bekleyen.length>4?'<small>ve '+(N.bekleyen.length-4)+' karar daha</small>':''):'<p class="gn-bos">Cevap bekleyen karar yok.</p>')+'</section>';
  const K=N.kasa,kasa='<section class="gn-kutu gn-kasa"><h4>'+smg('kasa')+'Kasa</h4><b'+(K.nakit<0?' class="od-eksi"':'')+'>'+yaz(y.tlKisa(K.nakit))+'</b>'+
    (K.enDusuk!==null&&K.enDusukTarih?'<small>90 günde en düşük '+yaz(y.tlKisa(K.enDusuk))+' · '+yaz(y.tarihYazi(K.enDusukTarih))+'</small>':'')+'</section>';
  const manset=N.manset?'<section class="gn-kutu gn-manset"><h4>'+smg('gazete')+'Gazete'+(N.manset.etiket?' · '+yaz(N.manset.etiket):'')+'</h4><p>“'+yaz(String(N.manset.metin).replace(/^TEST: /,''))+'”</p></section>':'';
  return'<div class="gn" data-tarih="'+yaz(N.tarih)+'"><p class="gn-kat">Özel kalem · '+yaz(y.saatYazi(GUN_BASLANGICI))+'</p><h3 class="gn-baslik">'+yaz(gunAdi(N.tarih)+', '+y.tarihYazi(N.tarih))+'</h3>'+
    '<div class="gn-izgara">'+mac+bugun+bek+kasa+manset+'</div>'+
    '<div class="gn-eylem"><button type="button" data-eylem="notDefter">'+smg('defter')+'Defteri aç</button><span class="gn-bosluk"></span>'+
      '<button type="button" class="od-birincil" data-eylem="notBirak">Güne başla '+smg('ilerle')+'</button></div></div>';
}
