/* Chairman — arayüz konsepti (önizleme; oyun kodu değildir). prototipler/arayuz-konsept/OKU.md
   Veri: veri.js (oyunun 14. hafta örnek kaydından, oyunun kural işlevleriyle çıkarıldı). “örnek” işaretli satırlar önizleme için uyduruldu (TEST).
   Kurallar: düğme = ekran; tek krom (şerit + başlık şeridi + sekme satırı); menü geçişi anında; oda nesneleri kısayol; her tablo satırı bir yere götürür. */
'use strict';
(()=>{
const V=window.VERI,BIZ=V.biz,K=V.kulupler;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- biçimler ---------- */
const binlik=n=>Math.round(n).toLocaleString('tr-TR');
const tl=k=>binlik(k/100)+' ₺';
const tlK=k=>{const v=k/100,a=Math.abs(v);return a>=1e6?(v/1e6).toLocaleString('tr-TR',{maximumFractionDigits:2})+' milyon ₺':a>=1e3?binlik(v/1e3)+' bin ₺':binlik(v)+' ₺';};
const isaretli=k=>(k>0?'+':k<0?'−':'')+binlik(Math.abs(k)/100);
const AY=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],AYT=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const GUN=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],GUNT=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
const D_=t=>new Date(t+'T12:00:00Z');
const tKisa=t=>{const d=D_(t);return d.getUTCDate()+' '+AY[d.getUTCMonth()];};
const tGun=t=>{const d=D_(t);return GUN[d.getUTCDay()]+' '+d.getUTCDate()+' '+AY[d.getUTCMonth()];};
const tUzun=t=>{const d=D_(t);return d.getUTCDate()+' '+AYT[d.getUTCMonth()]+' '+GUNT[d.getUTCDay()];};
const tEkle=(t,n)=>{const d=D_(t);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
const gunFarki=(a,b)=>Math.round((D_(b)-D_(a))/864e5);
const saat=dk=>String(Math.floor(dk/60)).padStart(2,'0')+':'+String(dk%60).padStart(2,'0');
const BUGUN=V.tarih;

/* ---------- kişiler, kulüpler, oyuncular ---------- */
const KISI=Object.fromEntries(V.kisiler.map(p=>[p.id,p]));
const HOCA=V.kisiler.find(p=>p.rol==='teknikDirektor'&&p.kulupId===BIZ);
const YARD=V.kisiler.find(p=>p.rol==='yardimciAntrenor');
const MUDUR=V.kisiler.find(p=>p.rol==='maliMudur');
const SIRA=Object.fromEntries(V.tablo.map((t,i)=>[t.id,i+1]));
const TAB=Object.fromEntries(V.tablo.map(t=>[t.id,t]));
const OY=Object.fromEntries(V.oyuncular.map(o=>[o.id,o]));
for(const s of V.serbest)OY[s.id]=Object.assign({k:null,m:0,dk:0,g:0,s:0,r:0,bit:null},s);
const KADRO=V.kadro,KADRO_ID=Object.fromEntries(KADRO.map(r=>[r.id,r]));
const MEVKI={KL:'Kaleci',DEF:'Defans',OS:'Orta saha',FV:'Forvet'},MEVKI_COGUL={KL:'Kaleciler',DEF:'Defans',OS:'Orta saha',FV:'Forvet'};
const kad=id=>id&&K[id]?K[id].ad:'Serbest';
const arma=(id,b)=>id&&K[id]?`<span class="arma-k" style="--b:${b||1.3}em">${K[id].arma}</span>`:`<span class="kurum" style="width:${b||1.3}em;height:${b||1.3}em">—</span>`;
const yuz=(url,ad,sinif)=>url?`<img class="yuz ${sinif||''}" src="${url}" alt="">`:`<span class="yuz yuz-bos ${sinif||''}">${esc(String(ad||'?')[0])}</span>`;
const oyYuz=id=>{const r=KADRO_ID[id]||OY[id];return r&&r.portre||null;};
const bolge=n=>{const Z=V.bolgeler||{},ic=r=>r&&n>=r[0]&&n<=r[1];return ic(Z.cikma)?'cikma':ic(Z.playoff)?'playoff':ic(Z.dusme)?'dusme':'';};
const lum=h=>{const n=parseInt(h.slice(1),16),c=[n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*c[0]+.7152*c[1]+.0722*c[2];};
const kontrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const kulupRengi=id=>{const r=(K[id]||K[BIZ]).renk,z=r[0],y=kontrast(z,r[1])>=3.2?r[1]:lum(z)>.4?'#15171c':'#fff';return{z,y};};
const BUTUN_MACLAR=[...new Map(Object.values(V.haftalar).flat().map(m=>[m.id,m])).values()];
const macBul=id=>BUTUN_MACLAR.find(m=>m.id===id)||null;
const formHtml=s=>{const L=[...(s||'')];while(L.length<5)L.unshift('');return `<span class="form" title="Son beş maç (eskiden yeniye; boş kutu: örnek kayıtta yok)">${L.map(c=>c?`<i class="${c}">${c}</i>`:'<i class="f0"></i>').join('')}</span>`;};

/* ---------- ayarlar ve durum ---------- */
const AYAR={g:'gece',d:'kabartma',gc:'aninda',k:'doldur',not:1,saat:'gunduz',dz:{haberler:1,lig:1,finans:1,kulup:1,transfer:1}};
/* önizlemenin saati: örnek kayıt 22:00'de; görüşme sahneleri için gündüz 14:30 gösterilir, gece anahtarı 23:40 */
const Z={dk:870,gece:false,sahne:null};
const D={bolum:'haberler',sekme:{haberler:'hepsi',kulup:'kadro',finans:'durum',lig:'puan',transfer:'durum',ajanda:'hafta'},alt:[],altSekme:'genel',
  haber:null,kadroSec:KADRO[0].id,kisi:HOCA.id,hafta:V.hafta,ajHafta:0,rapor:null,kartlar:{},okunan:new Set(),takip:new Set(),
  ara:{q:'',mv:'',yas:'',ek:''},sirala:{a:'g',y:-1},istekler:[],gorevler:[],gorusme:false,gazete:0,yetki:{odeme:false,kasa:false,genc:false},sahneGecmis:{},yapilan:new Set()};
const GECMIS=[],ILERI=[];

/* ---------- menü ---------- */
const BOLUMLER=[
  {id:'ofis',ad:'Ofis',tus:'1'},{id:'haberler',ad:'Haberler',tus:'2'},{id:'kulup',ad:'Kulüp',tus:'3'},{id:'finans',ad:'Finans',tus:'4'},
  {id:'lig',ad:'Lig',tus:'5'},{id:'transfer',ad:'Transfer',tus:'6'},{id:'ajanda',ad:'Ajanda',tus:'7'},{id:'telefon',ad:'Telefon',tus:'8'},
  {id:'gazete',ad:'Gazete',tus:'9'},{ayrac:1},{id:'balkon',ad:'Balkon',tus:'0'}];
const SEKMELER={
  haberler:[['hepsi','Hepsi'],['cevap','Cevap bekliyor'],['kulup','Kulüp'],['transfer','Transfer'],['lig','Lig'],['basin','Basın'],['para','Finans']],
  kulup:[['kadro','Kadro'],['ekip','Teknik ekip'],['sozlesme','Sözleşmeler'],['stat','Stat ve tesis'],['iliskiler','İlişkiler']],
  finans:[['durum','Durum'],['raporlar','Raporlar'],['mudur','Müdürlük'],['butce','Bütçe']],
  lig:[['puan','Puan durumu'],['fikstur','Fikstür'],['gol','Gol krallığı'],['ist','İstatistik'],['kulupler','Kulüpler']],
  transfer:[['durum','Durum'],['hedef','Hedefler'],['ara','Ara'],['teklif','Teklifler'],['gecmis','Geçmiş']],
  ajanda:[['hafta','Hafta'],['ay','Ay']]};
const ALT_SEKMELER={takim:[['genel','Genel'],['kadro','Kadro'],['maclar','Maçlar'],['ist','İstatistik']],mac:[['ozet','Özet'],['ist','İstatistikler'],['kadro','Kadrolar']]};
const DUZENLI={haberler:'*',lig:'puan',finans:'durum',kulup:'kadro',transfer:'durum'};
const duzenVar=()=>!D.alt.length&&DUZENLI[D.bolum]&&(DUZENLI[D.bolum]==='*'||D.sekme[D.bolum]===DUZENLI[D.bolum]);
const dz=()=>AYAR.dz[D.bolum]||1;

/* ---------- haberler: örnek bekleyenler + oyunun gelişmeleri ---------- */
const temiz=s=>String(s||'').replace(/^TEST:\s*/,'');
const KAT_AD={kulup:'Kulüp',transfer:'Transfer',lig:'Lig',basin:'Basın',para:'Finans'};
const HABERLER=(()=>{
  const L=[];
  L.push({id:'o-teklif',tarih:'2026-12-03',dk:690,kaynak:{tur:'kulup',id:'kocadere'},kat:'transfer',sinif:'cevap',ornek:1,kanal:'belge',son:'7 Ara Pzt 18:00',
    baslik:'Kocadere İdman Yurdu, Oğuz için 1.250.000 ₺ teklif etti',
    kart:{kunye:'Gelen teklif · Pazarlık',soru:'Kocadere, Oğuz için 1,25 milyon ₺ veriyor. Ne diyorsun?',kisi:{arma:'kocadere',ad:'Kocadere İdman Yurdu',alt:'Başkanlık'},
      sol:{ad:'Reddet',sonuc:'Oğuz kalır. Kocadere teklifi artırabilir; hoca memnun.',damga:'Reddedildi'},
      sag:{ad:'Sat',sonuc:'Kasaya 1.250.000 ₺ girer. Orta sahada bir kişi eksilir; Şükrü Hoca itiraz edebilir.',damga:'Satıldı'}}});
  L.push({id:'o-hoca',tarih:'2026-12-04',dk:1340,kaynak:{tur:'kisi',id:HOCA.id},kat:'kulup',sinif:'cevap',ornek:1,kanal:'telefon',son:'6 Ara Paz 23:59',
    baslik:HOCA.ad+': “Kış döneminde forvete bir takviye şart başkanım.”',
    kart:{kunye:'Hocanın isteği · Fırsat',soru:'Erdal ve Kadir yoruldu başkanım. Kışın forvet hattına bir oyuncu istiyorum.',kisi:{yuz:HOCA.portre,ad:HOCA.ad,alt:'Teknik direktör'},
      sol:{ad:'Şimdi değil',sonuc:'Hoca bekler ve bunu hatırlar. Konu Mart’ta yeniden açılabilir.',damga:'Ertelendi'},
      sag:{ad:'Araştıralım',sonuc:'Transfer dosyası açılır: bütçe, araştırma, iki aday. Transfer › Durum’da izlenir.',damga:'Dosya açıldı'}}});
  L.push({id:'o-rapor',tarih:'2026-12-04',dk:1080,kaynak:{tur:'kisi',id:MUDUR.id},kat:'para',sinif:'beklenen',ornek:1,kanal:'telefon',
    baslik:MUDUR.ad+': İstediğin maaş ve prim dökümü hazır.',
    govde:'Dün “bugün gün sonuna kadar” diye istediğin döküm: 22 oyuncu ve teknik ekibin aylık maaşı ve sözleşme yükü. Kısa sürede hazırlandığı için prim tahminleri kaba.',
    eylem:[['Raporu aç ▸','finans','raporlar',{rapor:'o-maas'}]]});
  L.push({id:'o-randevu',tarih:'2026-12-04',dk:1350,kaynak:{tur:'kisi',id:YARD.id},kat:'kulup',sinif:'randevu',ornek:1,kanal:'kapi',
    baslik:'Randevu: yarın 11:00, '+YARD.ad+' ile görüşme',
    govde:YARD.ad+' yüz yüze görüşmek istemişti; yarın 11:00’e yazıldı. Saati gelince İlerle durur, kapıda karşılarsın.',eylem:[['Ajandada gör ▸','ajanda','hafta']]});
  for(const g of V.gel){
    const h={id:g.id,tarih:g.tarih,dk:g.dk,kat:g.kat,sinif:g.sinif,kanal:g.kanal,baslik:temiz(g.baslik),hedef:g.hedef,okundu:g.okundu};
    if(g.kanal==='lig')h.kaynak={tur:'kurum',kisa:'LİG',ad:'3. Lig'};
    else if(g.kanal==='dosya'){h.kaynak={tur:'kisi',id:MUDUR.id};h.eylem=[['Raporu aç ▸','finans','raporlar',{rapor:g.hedef&&g.hedef.i}]];}
    else if(g.kanal==='para'){h.kaynak={tur:'kurum',kisa:'₺',ad:'Muhasebe'};h.eylem=[['Finans ▸','finans','durum']];}
    else if(g.kanal==='gazete'){h.kaynak={tur:'kurum',kisa:'GZT',ad:'Yerel Gazete'};h.kat=h.kat==='lig'?'basin':h.kat;h.eylem=[['Gazetede oku ▸','gazete']];}
    else if(g.kanal==='telefon'){h.kaynak={tur:'kurum',kisa:'TEL',ad:'Telefon'};}
    else h.kaynak={tur:'kurum',kisa:'•',ad:g.kanal};
    L.push(h);
  }
  return L.sort((a,b)=>(b.tarih+saat(b.dk)).localeCompare(a.tarih+saat(a.dk)));
})();
const HB=Object.fromEntries(HABERLER.map(h=>[h.id,h]));
const kartSonuc=id=>(D.kartlar[id]||{}).sonuc||null;
const bekliyor=h=>(h.sinif==='cevap'&&!kartSonuc(h.id))||h.sinif==='randevu';
const okundu=h=>h.okundu||D.okunan.has(h.id)||(h.sinif==='cevap'&&kartSonuc(h.id));
const sayac=()=>({cevap:HABERLER.filter(bekliyor).length,yeni:HABERLER.filter(h=>!bekliyor(h)&&h.sinif!=='arka'&&!okundu(h)).length});
const kaynakHtml=(q,b)=>q.tur==='kisi'?yuz(KISI[q.id]&&KISI[q.id].portre,KISI[q.id]&&KISI[q.id].ad):q.tur==='kulup'?arma(q.id,b||1.6):`<span class="kurum">${esc(q.kisa)}</span>`;
const kaynakAd=q=>q.tur==='kisi'?(KISI[q.id]||{}).ad:q.tur==='kulup'?kad(q.id):q.ad;
const gunEtiketi=t=>t===BUGUN?'Bugün':t===tEkle(BUGUN,-1)?'Dün':tUzun(t);

/* haber listesi: aynı günün arka plan satırları tek satırda toplanır (“Ligden: 7 sonuç, 3 kart…”) */
function haberSatirlari(sekme){
  let L=HABERLER.filter(h=>sekme==='hepsi'||(sekme==='cevap'?bekliyor(h):h.kat===sekme));
  const ust=sekme==='cevap'?[]:L.filter(bekliyor),alt=sekme==='cevap'?L:L.filter(h=>!bekliyor(h));
  const out=[];const gruplar=new Map();
  for(const h of alt){
    if(h.sinif==='arka'){const a='g:'+h.tarih;if(!gruplar.has(a)){const g={id:a,grup:[],tarih:h.tarih,dk:h.dk,sinif:'arka',kat:'lig',kaynak:{tur:'kurum',kisa:'LİG',ad:'3. Lig'}};gruplar.set(a,g);out.push(g);}gruplar.get(a).grup.push(h);}
    else out.push(h);
  }
  for(const g of gruplar.values()){const n=g.grup.filter(x=>x.hedef&&x.hedef.tur==='mac').length,d=g.grup.length-n;
    g.baslik='Ligden: '+(n?n+' maç sonucu':'')+(n&&d?', ':'')+(d?d+' kısa haber (kart, sakatlık)':'');g.okundu=true;HB[g.id]=g;}
  return{ust,alt:out};
}

/* ---------- gezinme ---------- */
const durumKopya=()=>({bolum:D.bolum,sekme:D.sekme[D.bolum],alt:D.alt.slice(),altSekme:D.altSekme});
function git(bolum,sekme,ek){
  GECMIS.push(durumKopya());ILERI.length=0;if(GECMIS.length>60)GECMIS.shift();
  D.bolum=bolum;if(sekme)D.sekme[bolum]=sekme;D.alt=[];
  if(ek&&ek.rapor!==undefined)D.rapor=ek.rapor;
  ciz(true);
}
function altAc(a){GECMIS.push(durumKopya());ILERI.length=0;D.alt.push(a);D.altSekme=a.tur==='mac'?'ozet':'genel';ciz(true);}
function altKapat(){if(!D.alt.length)return false;GECMIS.push(durumKopya());D.alt.pop();D.altSekme='genel';ciz(true);return true;}
function geriDon(yon){const kaynak=yon<0?GECMIS:ILERI,hedef=yon<0?ILERI:GECMIS;if(!kaynak.length)return;hedef.push(durumKopya());const s=kaynak.pop();
  D.bolum=s.bolum;if(s.sekme)D.sekme[s.bolum]=s.sekme;D.alt=s.alt;D.altSekme=s.altSekme;ciz(true);}
let toastZaman=null;
function toast(m){const c=$('#icerik');c.querySelector('.toast')?.remove();const t=document.createElement('div');t.className='toast';t.textContent=m;c.appendChild(t);
  clearTimeout(toastZaman);toastZaman=setTimeout(()=>t.remove(),2600);}

/* ---------- şerit ---------- */
function serit(){
  const s=sayac(),d=D_(BUGUN);
  const sonraki=BUTUN_MACLAR.filter(m=>(m.ev===BIZ||m.konuk===BIZ)&&!m.skor).sort((a,b)=>a.tarih.localeCompare(b.tarih))[0];
  $('#serit').innerHTML=`<div class="s-tarih ${Z.gece?'gece':''} ${Z.sahne?'sahnede':''}"><b>${GUNT[d.getUTCDay()]}</b><span>${BUGUN.split('-').reverse().join('.')}</span><em>${saat(Z.dk)}</em>${Z.sahne?'<i>sahnede · saat kartla akıyor</i>':Z.gece?'<i>gece · ertesi sabah 10:00</i>':''}</div>
  <div class="s-gez"><button data-ey="geri" ${GECMIS.length?'':'disabled'} title="Geri (Backspace)">‹ Geri</button><button data-ey="ileri" ${ILERI.length?'':'disabled'} title="İleri">İleri ›</button></div>
  <button class="s-ilerle" data-ey="ilerle" title="İlerle (boşluk)">İlerle ▸</button>
  <div class="s-durak">Sıradaki durak<br>${s.cevap?'6 Ara · son cevap':sonraki?tGun(sonraki.tarih)+' · maç':''}</div>
  <div class="s-doluluk" title="Başkanın günü: 08:00–20:00; sahneler yer kaplar">${doluluk()}</div>
  <div class="s-bolumler">${BOLUMLER.map(b=>b.ayrac?'<div class="s-ayrac"></div>':
    `<button class="s-b" data-git="${b.id}" ${D.bolum===b.id?'aria-current="page"':''}><span>${b.ad}</span>${b.id==='haberler'&&s.cevap?`<span class="s-rozet">${s.cevap}</span>`:''}<kbd>${b.tus}</kbd></button>`).join('')}</div>
  <div class="s-alt"><button class="s-haber" data-ey="haber" ${s.cevap||s.yeni?'':'data-bos'}>${s.cevap||s.yeni?'Haber var':'Haber yok'}<small>${[s.cevap?s.cevap+' cevap':'',s.yeni?s.yeni+' yeni':''].filter(Boolean).join(' · ')}</small></button>
  <button class="s-ayar" data-ey="ayar">Ayarlar</button></div>`;
}

/* ---------- başlık şeridi ---------- */
const KULUP_EKRANI=new Set(['ofis','haberler','kulup','finans','transfer','telefon']);
function baslik(){
  const h=$('#baslik'),oy=$('#oyun'),a=D.alt[D.alt.length-1];h.className='';h.style.cssText='';
  let renk=KULUP_EKRANI.has(D.bolum)?kulupRengi(BIZ):{z:'#283046',y:'#fff'},bas='',alt='',geri='';
  const B=BOLUMLER.find(b=>b.id===D.bolum);bas=B?B.ad:'';
  const altBaslik={ofis:K[BIZ].ad+' · Başkan '+V.baskan,haberler:'Son 14 gün · '+K[BIZ].ad,kulup:K[BIZ].ad+' · '+SIRA[BIZ]+'. sıra · '+HOCA.ad,
    finans:'Mali işler · '+MUDUR.ad,lig:'3. Lig · 2026–27 · '+V.hafta+'. hafta',transfer:'Kış dönemi 4 Ocak’ta açılır',ajanda:tUzun(BUGUN),
    telefon:'Kişiler ve konuşmalar',gazete:'Yerel Gazete (TEST)',balkon:'Antrenman sahası'};
  alt=altBaslik[D.bolum]||'';
  if(a){
    const ust=D.alt.length>1?D.alt[D.alt.length-2]:null,ustAd=ust?(ust.tur==='takim'?kad(ust.id):ust.tur==='oyuncu'?OY[ust.id].ad:ust.tur==='kisi'?kisiAd(ust.id):'Maç'):(SEKMELER[D.bolum]||[]).find(x=>x[0]===D.sekme[D.bolum])?.[1]||bas;
    geri=`<button class="b-geri" data-ey="altKapat" title="Esc">‹ ${esc(ustAd)}</button>`;
    if(a.tur==='takim'){renk=kulupRengi(a.id);bas=kad(a.id);const t=TAB[a.id];alt='3. Lig · '+SIRA[a.id]+'. sıra · '+t.P+' puan · '+(K[a.id].hoca||'');}
    if(a.tur==='oyuncu'){const o=OY[a.id];renk=o.k?kulupRengi(o.k):{z:'#3a3f4d',y:'#fff'};bas=o.ad;alt=(MEVKI[o.mv]||o.mv)+' · '+o.yas+' yaş · '+kad(o.k);}
    if(a.tur==='kisi'){const p=kisiBul(a.id);renk=p.kurum&&K[p.kurum]?kulupRengi(p.kurum):{z:'#2f3a55',y:'#fff'};bas=p.ad;alt=rolAd(p)+(p.kurumAd?' · '+p.kurumAd:'');}
    if(a.tur==='mac'){const m=V.macSay,ev=kulupRengi(m.ev),kn=kulupRengi(m.konuk);h.className='b-iki';h.style.setProperty('--ev',ev.z);h.style.setProperty('--konuk',kn.z);
      h.innerHTML=`<div class="b-sol">${geri}</div><div class="b-mac"><span style="color:${ev.y}">${esc(kad(m.ev))}</span><b style="color:#fff">${m.skor[0]} – ${m.skor[1]}</b><span style="color:${kn.y}">${esc(kad(m.konuk))}</span></div><div class="b-sag" style="color:${kn.y}">${m.hafta}. hafta · ${tGun(m.tarih)}</div>`;
      h.style.color='#fff';return;}
  }
  h.style.background=renk.z;h.style.color=renk.y;oy.style.setProperty('--kulup',renk.z);
  h.innerHTML=`<div class="b-sol">${geri}<h1>${esc(bas)}</h1><small>${esc(alt)}</small></div><div class="b-sag"><span>KAYDEDİLDİ</span><button data-ey="duraklat">DURAKLAT</button></div>`;
}

/* ---------- sekme satırı ---------- */
function sekmeler(){
  const a=D.alt[D.alt.length-1];let L,secili,ey;
  if(a){L=ALT_SEKMELER[a.tur]||[];secili=D.altSekme;ey='altSekme';}
  else{L=SEKMELER[D.bolum]||[];secili=D.sekme[D.bolum];ey='sekme';}
  const s=sayac();
  $('#sekmeler').innerHTML=L.length?L.map(([id,ad])=>`<button role="tab" aria-selected="${id===secili}" data-${ey}="${id}">${ad}${D.bolum==='haberler'&&!a&&id==='cevap'&&s.cevap?`<span class="t-say">${s.cevap}</span>`:''}</button>`).join('')+
    `<span class="t-ayrac"></span><span class="t-not">[ ] sekme · Esc geri</span>`:'';
}

/* ---------- içerik ---------- */
const EKRANLAR={};
function icerik(gecis){
  const c=$('#icerik');c.className=D.bolum==='ofis'||D.bolum==='balkon'?'ofis':'';
  const a=D.alt[D.alt.length-1];
  let html;
  if(a)html=a.tur==='takim'?takimSayfasi(a.id):a.tur==='oyuncu'?oyuncuSayfasi(a.id):a.tur==='kisi'?kisiSayfasi(a.id):macSayfasi();
  else html=(EKRANLAR[D.bolum]||(()=>'<div class="bos">Yok</div>'))();
  c.innerHTML=html+(Z.sahne?sahneHtml():'');
  const s=c.firstElementChild;
  if(gecis&&s&&AYAR.gc!=='aninda'){s.classList.add(AYAR.gc==='kayma'?'gir-kayma':'gir-solma');}
  kartBagla();
}

/* ======================= OFİS ======================= */
const SICAK=[['telefon','Telefon',18,65.5,7,7],['gazete','Gazete',16,60,16.5,5.6],['ajanda','Ajanda',35.5,64,29,10.5],['haberler','Bekleyen dosyalar → Haberler',71.5,62.5,20.5,12],
  ['haberler','Sarı not → Haberler',76,75,13.5,6.5],['lig','TV → canlı maç (Lig)',83,20,14,11],['balkon','Balkon',65,13,18,46]];
EKRANLAR.ofis=()=>{
  const s=sayac(),son=V.macSay;
  return `<div class="oda-yer"><div class="oda-bulanik"></div><div class="oda-kutu">${SICAK.map(([b,ad,x,y,w,hh])=>`<button class="sicak" data-git="${b}" style="left:${x}%;top:${y}%;width:${w}%;height:${hh}%"><span>${esc(ad)}</span></button>`).join('')}</div>
  <div class="oda-durum">${esc(kad(son.ev))} ${son.skor[0]}–${son.skor[1]} ${esc(kad(son.konuk))}. ${s.cevap?`<b>${s.cevap} iş cevap bekliyor</b> · `:''}Haberler’de ${s.yeni} yeni.</div></div>`;
};

/* ======================= HABERLER ======================= */
function haberSatir(h){
  const ok=okundu(h),sec=D.haber===h.id;
  const cls=['hb-satir',sec?'secili':'',ok?'':'yeni',h.sinif==='arka'?'arka':'',bekliyor(h)?'cevap':'',h.sinif==='beklenen'&&!ok?'beklenen':'',h.kacan?'kacan':''].join(' ');
  const rozet=h.kacan?`<span class="cip">${h.kacan===2?'Cevapsız kaldı':'Ulaşılamadı'}</span>`:bekliyor(h)?`<span class="cip kirmizi">${h.sinif==='randevu'?'Randevu':'Cevap bekliyor'}</span>`:kartSonuc(h.id)?`<span class="cip">Cevaplandı</span>`:!ok?'<span class="nokta" title="okunmadı"></span>':`<span class="cip">${KAT_AD[h.kat]||''}</span>`;
  if(dz()===2)return `<div class="${cls}" data-haber="${esc(h.id)}">${kaynakHtml(h.kaynak)}<div><div class="hb-ust"><span>${esc(kaynakAd(h.kaynak))}</span><span>${tKisa(h.tarih)} ${saat(h.dk)}</span></div><div class="hb-bas">${esc(h.baslik)}</div></div>${rozet}</div>`;
  return `<div class="${cls}" data-haber="${esc(h.id)}"><span class="hb-saat">${h.tarih===BUGUN?saat(h.dk):tKisa(h.tarih)}</span>${kaynakHtml(h.kaynak)}<span class="hb-bas">${esc(h.baslik)}</span>${rozet}</div>`;
}
function haberAyrinti(h){
  if(!h)return `<div class="bos">Bir satır seç. Ayrıntı burada açılır; listeden ayrılmazsın.</div>`;
  const q=h.kaynak,sonrakiVar=HABERLER.some(x=>!okundu(x)&&x.id!==h.id&&x.sinif!=='arka');
  let govde='';
  if(h.kart)govde=kartHtml(h);
  else if(h.grup){
    const maclar=h.grup.filter(x=>x.hedef&&x.hedef.tur==='mac').map(x=>macBul(x.hedef.id)).filter(Boolean),diger=h.grup.filter(x=>!(x.hedef&&x.hedef.tur==='mac'));
    govde=`<div class="hb-sonuclar">${maclar.map(macMini).join('')}</div>${diger.length?`<ul class="hb-govde">${diger.map(x=>`<li>${esc(x.baslik)}</li>`).join('')}</ul>`:''}`;
    h.eylem=[['Fikstür ▸','lig','fikstur'],['Puan durumu ▸','lig','puan']];
  }
  else if(h.hedef&&h.hedef.tur==='mac'){const m=macBul(h.hedef.id);
    govde=m?skorKutu(m)+`<p class="hb-govde soluk">${m.id===V.macSay.id?'Maçın özeti, istatistikleri ve kadroları maç sayfasında.':'Haftanın öbür maçları fikstürde.'}</p>`:'';
    h.eylem=m&&m.id===V.macSay.id?[['Maç sayfası ▸','mac'],['Puan durumu ▸','lig','puan']]:[['Fikstür ▸','lig','fikstur']];}
  else if(h.hedef&&h.hedef.tur==='rapor'){const r=V.raporlar.find(x=>x.i===h.hedef.i);
    govde=r?`<div class="ozet-sayilar">${r.satirlar.slice(0,3).map(s=>`<div><small>${esc(s.ad)}</small><b>${tlK(s.tutar)}</b></div>`).join('')}</div><p class="hb-govde soluk">${esc(r.kaynakAd)} raporu bıraktı. Tamamı Finans › Raporlar’da.</p>`:'';}
  else if(h.govde)govde=`<p class="hb-govde">${esc(h.govde)}</p>`;
  else govde=`<p class="hb-govde">${esc(h.baslik)}</p>`;
  const eylem=(h.eylem||[]).map(e=>e[1]==='mac'?`<button class="dugme" data-ey="macAc">${e[0]}</button>`:`<button class="dugme" data-git="${e[1]}" data-git-sekme="${e[2]||''}" ${e[3]&&e[3].rapor!==undefined?`data-git-rapor="${e[3].rapor}"`:''}>${e[0]}</button>`).join('');
  const ust=`<div class="hb-kaynak">${kaynakHtml(q,2)}<div><b>${esc(kaynakAd(q))}</b><small>${tUzun(h.tarih)} · ${saat(h.dk)} · ${KAT_AD[h.kat]||''}${h.ornek?' · <span class="ornek">örnek</span>':''}</small></div></div><h3>${esc(h.baslik)}</h3>`;
  const kanal=h.kanal||(h.hedef&&h.hedef.tur==='rapor'?'belge':h.grup?'lig':'');
  const KANAL_AD={telefon:'Telefon · mesaj',kapi:'Kapı · yüz yüze',gazete:'Gazete',belge:'Belge',lig:'Lig',para:'Muhasebe'};
  const sarmala=(ic)=>kanal?`<div class="kanal kanal-${kanal}"><div class="kanal-etiket">${KANAL_AD[kanal]||kanal}</div>${ic}</div>`:ic;
  if(h.kart){
    const kanalIc=kanal==='telefon'?`<div class="balon gelen" style="max-width:none">${esc(h.kart.soru)}<small>${esc(kaynakAd(q))} · ${tKisa(h.tarih)} ${saat(h.dk)}</small></div>`:
      kanal==='belge'?`<div class="belge-mini"><b>${esc(kaynakAd(q)).toLocaleUpperCase('tr-TR')}</b><span>${esc(h.baslik)}</span><small>Teklif yazısı · son cevap ${esc(h.son)}</small></div>`:'';
    return `<div class="hb-kartli"><div class="hb-a-metin">${ust}${sarmala(kanalIc+`<p class="hb-govde soluk">Cevap bu kartla verilir; aynı kart telefonda ve dosyada da aynıdır. Sonraya bırakırsan son cevap tarihine kadar “Cevap bekliyor”da kalır.</p>`)}</div>${govde}</div>`;
  }
  if(kanal==='telefon')govde=`<div class="balon gelen" style="max-width:none">${esc(h.govde||h.baslik)}<small>${esc(kaynakAd(q))} · ${tKisa(h.tarih)} ${saat(h.dk)}</small></div>`+(h.kacan?`<div class="dugmeler" style="margin-top:.6em"><button class="dugme ana" data-ey="aramaYap" data-v="${esc(h.kisiId||'')}">Geri ara · ~5–15 dk</button></div>`:'');
  else if(kanal==='kapi')govde=`<div class="kapi-sahne">${kaynakHtml(q,3)}<div><b>${esc(kaynakAd(q))} karşında oturacak.</b><p class="soluk">${esc(h.govde||'')}</p><div class="dugmeler"><button class="dugme ana" data-ey="sahne" data-v="tahsin">Buyursun · ${esc(tahmin(YARD.id).yazi)} <small class="soluk">· ${esc(tahmin(YARD.id).kaynak)}</small></button><button class="dugme" data-ey="sonraGelsin">Sonra gelsin</button></div></div></div>`;
  else if(kanal==='gazete')govde=`<div class="kupur"><b>YEREL GAZETE</b><small>${tUzun(h.tarih)}</small><h4>${esc(h.baslik)}</h4><p>${esc(h.govde||'Haberin tamamı gazetede.')}</p></div>`;
  else if(kanal==='belge'&&h.hedef&&h.hedef.tur==='rapor')govde=`<div class="belge-mini"><b>${esc(K[BIZ].ad).toLocaleUpperCase('tr-TR')} · MALİ İŞLER</b><span>${esc(h.baslik)}</span>${govde}</div>`;
  return `${ust}${sarmala(govde)}${eylem?`<div class="dugmeler">${eylem}</div>`:''}`;
}
const macMini=m=>`<div class="mac-mini"><span class="ev">${esc(K[m.ev].kisa)} ${arma(m.ev,1.1)}</span><b>${m.skor?m.skor[0]+' – '+m.skor[1]:saat(m.dk)}</b><span class="konuk">${arma(m.konuk,1.1)} ${esc(K[m.konuk].kisa)}</span></div>`;
const skorKutu=m=>`<div class="skor-kutu"><div class="t">${arma(m.ev,2.4)}<span>${esc(kad(m.ev))}</span></div><div class="sk">${m.skor?m.skor[0]+' – '+m.skor[1]:'–'}</div><div class="t">${arma(m.konuk,2.4)}<span>${esc(kad(m.konuk))}</span></div></div>`;
EKRANLAR.haberler=()=>{
  const sek=D.sekme.haberler,{ust,alt}=haberSatirlari(sek);
  const hepsi=ust.concat(alt);
  if(!D.haber||!hepsi.some(h=>h.id===D.haber))D.haber=(hepsi.find(h=>bekliyor(h)&&h.kart)||hepsi.find(h=>bekliyor(h))||hepsi.find(h=>!okundu(h))||hepsi[0]||{}).id||null;
  const sec=HB[D.haber];if(sec&&!sec.kart)D.okunan.add(sec.id);
  let liste='';
  if(ust.length)liste+=`<div class="hb-gun kirmizi">Cevap bekliyor · ${ust.length}</div>`+ust.map(haberSatir).join('');
  let gun=null;for(const h of alt){if(h.tarih!==gun){gun=h.tarih;liste+=`<div class="hb-gun">${gunEtiketi(gun)}</div>`;}liste+=haberSatir(h);}
  if(!hepsi.length)liste=`<div class="bos">Bu sekmede haber yok.</div>`;
  const s=sayac();
  return `<div class="sayfa hb-${dz()}">
    <div class="panel hb-liste"><div class="p-bas"><span>${esc((SEKMELER.haberler.find(x=>x[0]===sek)||[])[1])} <small>· ${s.yeni} okunmamış</small></span>
      <span class="dugmeler"><button class="dugme" data-ey="sonrakiOkunmamis" title="N">Sonraki okunmamış ▸</button><button class="dugme" data-ey="hepsiOkundu">Hepsini okundu say</button></span></div>
      <div class="p-kay">${liste}</div></div>
    <div class="panel hb-ayrinti"><div class="p-ic">${haberAyrinti(sec)}</div></div></div>`;
};

/* ---------- tek kart ---------- */
function kartHtml(h){
  const c=h.kart,st=D.kartlar[h.id]||{yuz:'notr'},yz=st.sonuc||st.yuz;
  const kisi=c.kisi.arma?arma(c.kisi.arma,2.3):yuz(c.kisi.yuz,c.kisi.ad);
  return `<div class="kart-yer"><div class="kart" data-kart="${h.id}" data-yuz="${yz}" tabindex="0">
    <div class="k-kunye">${esc(c.kunye)}</div>
    <div class="k-notr"><div class="k-soru">${esc(c.soru)}</div><div class="k-kisi">${kisi}<div><b>${esc(c.kisi.ad)}</b><small>${esc(c.kisi.alt)}</small></div></div></div>
    ${['sol','sag'].map(y=>`<div class="k-yuz ${y}"><div class="k-ok">${y==='sol'?'←':'→'}</div><div class="k-cevap">${esc(c[y].ad)}</div><div class="k-sonuc">${esc(c[y].sonuc)}</div></div>`).join('')}
    ${st.sonuc?`<div class="damga">${esc(c[st.sonuc].damga)}</div>`:''}</div>
    <div class="kart-ipucu">${st.sonuc?'Cevap verildi; sonuç satırı listeye yazıldı.':`Kaydır ya da <kbd>←</kbd> <kbd>→</kbd> ile bak, <kbd>Enter</kbd> ile ver · son cevap ${esc(h.son)}`}</div></div>`;
}
function kartUygula(id,yon){if(id.startsWith('s:'))return sahneCevap(yon);if(id==='anlik')return anlikCevap(yon==='sol'?'bak':'bakma');const st=D.kartlar[id]||(D.kartlar[id]={yuz:'notr'});if(st.sonuc)return;st.sonuc=yon;st.yuz=yon;
  const h=HB[id];toast(h.kart[yon].ad+' — '+h.kart[yon].damga.toLowerCase()+'.');ciz();}
function kartOnizle(id,yon){if(id.startsWith('s:')||id==='anlik'){const el=document.querySelector(`.kart[data-kart="${id}"]`);if(el)el.dataset.yuz=el.dataset.yuz===yon?'notr':yon;return;}const st=D.kartlar[id]||(D.kartlar[id]={yuz:'notr'});if(st.sonuc)return;
  st.yuz=st.yuz===yon?'notr':(st.yuz==='notr'?yon:'notr');const el=document.querySelector(`.kart[data-kart="${id}"]`);if(el)el.dataset.yuz=st.yuz;}
function kartBagla(){
  for(const el of document.querySelectorAll('.kart[data-kart]')){
    const id=el.dataset.kart;if(!id.startsWith('s:')&&id!=='anlik'&&kartSonuc(id))continue;let x0=null,dx=0;
    el.onpointerdown=e=>{x0=e.clientX;dx=0;el.setPointerCapture(e.pointerId);el.classList.add('surukle');};
    el.onpointermove=e=>{if(x0===null)return;dx=e.clientX-x0;const lim=Math.max(-90,Math.min(90,dx));el.style.transform=`translateX(${lim}px) rotate(${lim/18}deg)`;
      el.dataset.yuz=dx>28?'sag':dx<-28?'sol':'notr';};
    el.onpointerup=()=>{if(x0===null)return;x0=null;el.classList.remove('surukle');el.style.transform='';
      if(Math.abs(dx)>110)kartUygula(id,dx>0?'sag':'sol');else if(!id.startsWith('s:')&&id!=='anlik'){const st=D.kartlar[id]||(D.kartlar[id]={yuz:'notr'});st.yuz=el.dataset.yuz;}};
  }
}
const gorunenKart=()=>{const el=document.querySelector('.anlik .kart[data-kart]')||document.querySelector('.sahne .kart[data-kart]')||document.querySelector('.kart[data-kart]');return el&&!kartSonuc(el.dataset.kart)?el.dataset.kart:null;};

/* ======================= LİG ======================= */
function puanTablosu(genis){
  const ek=genis?'<th class="s" title="Maç başına beklenen gol, lehte">xG+ / maç</th><th class="s" title="Maç başına beklenen gol, aleyhte">xG− / maç</th><th class="s">Şut / maç</th><th class="s">Sahip.</th>':'';
  return `<table class="tablo"><thead><tr><th class="s">#</th><th>Kulüp</th><th class="s">O</th><th class="s">G</th><th class="s">B</th><th class="s">M</th><th class="s">A</th><th class="s">Y</th><th class="s">AV</th><th class="s">P</th>${ek}<th>Son 5</th></tr></thead><tbody>${
    V.tablo.map((t,i)=>{const I=V.takimIst[t.id];return `<tr data-takim="${t.id}" data-git class="${t.id===BIZ?'biz':''}"><td class="s bolge ${bolge(i+1)}">${i+1}</td><td><span class="ad">${arma(t.id)}<span>${esc(kad(t.id))}</span></span></td>
      <td class="s">${t.O}</td><td class="s">${t.G}</td><td class="s">${t.B}</td><td class="s">${t.M}</td><td class="s">${t.A}</td><td class="s">${t.Y}</td><td class="s">${t.AV>0?'+':''}${t.AV}</td><td class="s kalin">${t.P}</td>
      ${genis?`<td class="s">${I.n?(I.xgL/I.n).toFixed(2).replace('.',','):'—'}</td><td class="s">${I.n?(I.xgA/I.n).toFixed(2).replace('.',','):'—'}</td><td class="s">${I.n?(I.sut/I.n).toFixed(1).replace('.',','):'—'}</td><td class="s">${I.sah!=null?I.sah+'%':'—'}</td>`:''}<td>${formHtml(t.son)}</td></tr>`;}).join('')}</tbody></table>`;
}
const lejant=`<div class="lg-lejant"><span><i style="background:var(--iyi)"></i>Doğrudan çıkış</span><span><i style="background:#4f86d9"></i>Play-off</span><span><i style="background:var(--kotu)"></i>Düşme</span></div>`;
const golcu=n=>V.oyuncular.filter(o=>o.g>0).sort((a,b)=>b.g-a.g||a.dk-b.dk).slice(0,n);
function fiksturSatir(m){const biz=m.ev===BIZ||m.konuk===BIZ,tik=m.id===V.macSay.id;
  return `<div class="fk-satir ${biz?'biz':''}" ${tik?'data-ey="macAc" data-git':''}><span class="soluk">${m.skor?(m.durum==='hukmen'?'Hükmen':'Bitti'):saat(m.dk)}</span><span class="ev">${esc(kad(m.ev))} ${arma(m.ev)}</span><span class="sk">${m.skor?m.skor[0]+' – '+m.skor[1]:'–'}</span><span class="konuk">${arma(m.konuk)} ${esc(kad(m.konuk))}</span><span class="soluk">${tik?'Maç sayfası ▸':''}</span></div>`;}
function haftaHtml(h){const L=(V.haftalar[h]||[]).slice();let gun=null,out='';for(const m of L){if(m.tarih!==gun){gun=m.tarih;out+=`<div class="hb-gun">${tUzun(gun)}</div>`;}out+=fiksturSatir(m);}return out||'<div class="bos">Bu hafta örnek veride yok.</div>';}
EKRANLAR.lig=()=>{
  const s=D.sekme.lig;
  if(s==='puan'){
    if(dz()===2)return `<div class="sayfa"><div class="panel"><div class="p-bas">Puan durumu <small>Beklenen gol, şut ve topa sahip olma kayıtlı maçlardan; satıra dokun: kulüp sayfası</small></div><div class="p-kay">${puanTablosu(true)}</div>${lejant}</div></div>`;
    const h=V.hafta+1;
    return `<div class="sayfa lg-1"><div class="panel"><div class="p-bas">Puan durumu <small>${V.hafta}. haftadan sonra · satıra dokun: kulüp sayfası</small></div><div class="p-kay">${puanTablosu(false)}</div>${lejant}</div>
      <div class="lg-sag"><div class="panel"><div class="p-bas">${h}. hafta <button class="link" data-git="lig" data-git-sekme="fikstur">Fikstür ▸</button></div><div class="p-ic">${(V.haftalar[h]||[]).map(macMini).join('')}</div></div>
      <div class="panel"><div class="p-bas">Gol krallığı <button class="link" data-git="lig" data-git-sekme="gol">Tamamı ▸</button></div><table class="tablo"><tbody>${golcu(5).map((o,i)=>`<tr data-oyuncu="${o.id}" data-git><td class="s">${i+1}</td><td><span class="ad">${arma(o.k,1.1)}<span>${esc(o.ad)}</span></span></td><td class="s kalin">${o.g}</td></tr>`).join('')}</tbody></table></div>
      <div class="panel"><div class="p-bas">${V.hafta}. hafta sonuçları</div><div class="p-ic">${(V.haftalar[V.hafta]||[]).filter(m=>m.skor).map(macMini).join('')}</div></div></div></div>`;
  }
  if(s==='fikstur')return `<div class="sayfa"><div class="panel"><div class="p-bas"><span class="hafta-sec"><button class="dugme" data-ey="hafta" data-yon="-1">‹</button><b>${D.hafta}. hafta</b><button class="dugme" data-ey="hafta" data-yon="1">›</button></span><small>Maçlar gün ve saate göre · Demirkapı maçında maç sayfası</small></div><div class="p-kay">${haftaHtml(D.hafta)}</div></div></div>`;
  if(s==='gol')return `<div class="sayfa"><div class="panel"><div class="p-bas">Gol krallığı <small>Kendi kalesine goller sayılmaz · satıra dokun: oyuncu</small></div><div class="p-kay"><table class="tablo"><thead><tr><th class="s">#</th><th>Oyuncu</th><th>Kulüp</th><th>Mvk</th><th class="s">Yaş</th><th class="s">M</th><th class="s">Dk</th><th class="s">G</th><th class="s">Dk/G</th></tr></thead><tbody>${
    golcu(20).map((o,i)=>`<tr data-oyuncu="${o.id}" data-git class="${o.k===BIZ?'biz':''}"><td class="s">${i+1}</td><td><span class="ad">${yuz(oyYuz(o.id),o.ad)}<span>${esc(o.ad)}</span></span></td><td><span class="ad">${arma(o.k,1.1)}<span>${esc(kad(o.k))}</span></span></td><td>${o.mv}</td><td class="s">${o.yas}</td><td class="s">${o.m}</td><td class="s">${binlik(o.dk)}</td><td class="s kalin">${o.g}</td><td class="s">${binlik(o.dk/o.g)}</td></tr>`).join('')}</tbody></table></div></div></div>`;
  if(s==='ist'){
    const kart=V.oyuncular.filter(o=>o.s||o.r).sort((a,b)=>(b.s+3*b.r)-(a.s+3*a.r)).slice(0,12);
    const dak=V.oyuncular.slice().sort((a,b)=>b.dk-a.dk).slice(0,12);
    return `<div class="sayfa ist-izgara"><div class="panel" style="grid-column:1/-1"><div class="p-bas">Kulüpler <small>kayıtlı maçlardan</small></div><div class="p-kay"><table class="tablo"><thead><tr><th>Kulüp</th><th class="s">A</th><th class="s">Y</th><th class="s">xG+</th><th class="s">xG−</th><th class="s">Şut</th><th class="s">İsabet</th><th class="s">Sahip.</th><th class="s">Sarı</th><th class="s">Kırmızı</th></tr></thead><tbody>${
      V.tablo.map(t=>{const I=V.takimIst[t.id];return `<tr data-takim="${t.id}" data-git class="${t.id===BIZ?'biz':''}"><td><span class="ad">${arma(t.id)}<span>${esc(kad(t.id))}</span></span></td><td class="s">${t.A}</td><td class="s">${t.Y}</td><td class="s">${I.xgL.toFixed(1).replace('.',',')}</td><td class="s">${I.xgA.toFixed(1).replace('.',',')}</td><td class="s">${I.sut}</td><td class="s">${I.isabet}</td><td class="s">${I.sah!=null?I.sah+'%':'—'}</td><td class="s">${I.sari}</td><td class="s">${I.kirmizi}</td></tr>`;}).join('')}</tbody></table></div></div>
      <div class="panel"><div class="p-bas">Kart</div><div class="p-kay"><table class="tablo"><thead><tr><th>Oyuncu</th><th>Kulüp</th><th class="s">Sarı</th><th class="s">Kırmızı</th></tr></thead><tbody>${kart.map(o=>`<tr data-oyuncu="${o.id}" data-git><td>${esc(o.ad)}</td><td><span class="ad">${arma(o.k,1.1)}<span>${esc(K[o.k].kisa)}</span></span></td><td class="s">${o.s}</td><td class="s">${o.r}</td></tr>`).join('')}</tbody></table></div></div>
      <div class="panel"><div class="p-bas">En çok süre</div><div class="p-kay"><table class="tablo"><thead><tr><th>Oyuncu</th><th>Kulüp</th><th class="s">M</th><th class="s">Dk</th></tr></thead><tbody>${dak.map(o=>`<tr data-oyuncu="${o.id}" data-git><td>${esc(o.ad)}</td><td><span class="ad">${arma(o.k,1.1)}<span>${esc(K[o.k].kisa)}</span></span></td><td class="s">${o.m}</td><td class="s">${binlik(o.dk)}</td></tr>`).join('')}</tbody></table></div></div></div>`;
  }
  return `<div class="sayfa kul-izgara">${V.tablo.map((t,i)=>`<button class="kul-kart" data-takim="${t.id}">${arma(t.id,2.8)}<b>${esc(kad(t.id))}</b><small>${i+1}. sıra · ${t.P} puan · ${formHtml(t.son)}</small><small>${esc(K[t.id].hoca||'')} · ${esc(K[t.id].stat.ad)}</small></button>`).join('')}</div>`;
};
function takimSayfasi(id){
  const t=TAB[id],I=V.takimIst[id],c=K[id],kad_=V.oyuncular.filter(o=>o.k===id).sort((a,b)=>'KLDEFOSFV'.indexOf(a.mv)-'KLDEFOSFV'.indexOf(b.mv)||b.m-a.m);
  const maclar=BUTUN_MACLAR.filter(m=>m.ev===id||m.konuk===id).sort((a,b)=>a.tarih.localeCompare(b.tarih));
  const s=D.altSekme;
  if(s==='kadro')return `<div class="sayfa"><div class="panel"><div class="p-bas">Kadro <small>kamu bilgisi · satıra dokun: oyuncu</small></div><div class="p-kay"><table class="tablo"><thead><tr><th>Oyuncu</th><th>Mvk</th><th class="s">Yaş</th><th class="s">M</th><th class="s">Dk</th><th class="s">G</th><th class="s">Kart</th><th class="s">Söz. biter</th></tr></thead><tbody>${
    kad_.map(o=>`<tr data-oyuncu="${o.id}" data-git><td><span class="ad">${yuz(oyYuz(o.id),o.ad)}<span>${esc(o.ad)}</span></span></td><td>${o.mv}</td><td class="s">${o.yas}</td><td class="s">${o.m}</td><td class="s">${binlik(o.dk)}</td><td class="s">${o.g}</td><td class="s">${o.s}/${o.r}</td><td class="s">${o.bit?o.bit.slice(0,4):'—'}</td></tr>`).join('')}</tbody></table></div></div></div>`;
  if(s==='maclar')return `<div class="sayfa"><div class="panel"><div class="p-bas">Maçlar <small>örnek veride ${Object.keys(V.haftalar).join(', ')}. haftalar</small></div><div class="p-kay">${maclar.map(fiksturSatir).join('')}</div></div></div>`;
  if(s==='ist')return `<div class="sayfa" style="align-content:start"><div class="ozet-sayilar">${[['Atılan',t.A],['Yenilen',t.Y],['xG lehte',I.xgL.toFixed(1).replace('.',',')],['xG aleyhte',I.xgA.toFixed(1).replace('.',',')],['Şut',I.sut],['İsabet',I.isabet],['Topa sahip olma',(I.sah!=null?I.sah+'%':'—')],['Sarı',I.sari],['Kırmızı',I.kirmizi]].map(([a,b])=>`<div><small>${a}</small><b>${b}</b></div>`).join('')}</div></div>`;
  return `<div class="sayfa kl-2" style="align-content:start"><div class="panel"><div class="p-bas">Künye <span class="dugmeler"><button class="dugme" data-ey="takipEt">Takip et</button></span></div><div class="p-ic" style="display:flex;gap:1.2em;align-items:flex-start">${arma(id,4.5)}
    <dl class="kunye-tablo"><dt>Sıra</dt><dd>${SIRA[id]}. · ${t.P} puan · ${t.G}-${t.B}-${t.M}</dd><dt>Son 5</dt><dd>${formHtml(t.son)}</dd><dt>Teknik direktör</dt><dd>${esc(c.hoca||'—')} <span class="soluk">${esc(c.tarz||'')}</span></dd><dt>Stat</dt><dd>${esc(c.stat.ad)} · ${binlik(c.stat.kap)} kişi</dd><dt>Goller</dt><dd>${t.A} attı, ${t.Y} yedi</dd></dl></div></div>
    <div class="panel"><div class="p-bas">Golcüleri</div><table class="tablo"><tbody>${kad_.filter(o=>o.g).sort((a,b)=>b.g-a.g).slice(0,5).map(o=>`<tr data-oyuncu="${o.id}" data-git><td>${esc(o.ad)}</td><td>${o.mv}</td><td class="s kalin">${o.g}</td></tr>`).join('')||'<tr><td class="soluk">Gol yok</td></tr>'}</tbody></table></div>
    <div class="panel" style="grid-column:1/-1"><div class="p-bas">Son ve sıradaki maçlar</div><div class="p-ic">${maclar.map(fiksturSatir).join('')}</div></div></div>`;
}
function oyuncuSayfasi(id){
  const o=OY[id],biz=o.k===BIZ,r=KADRO_ID[id],tk=D.takip.has(id);
  if(biz&&r)return `<div class="sayfa oy"><div>${sicilFisi(r,true)}</div><div style="display:grid;gap:12px;align-content:start"><div class="ozet-sayilar">${[['Maç',o.m],['Dakika',binlik(o.dk)],['Gol',o.g],['Sarı',o.s],['Kırmızı',o.r]].map(([a,b])=>`<div><small>${a}</small><b>${b}</b></div>`).join('')}</div><div class="panel"><div class="p-bas">Notlar <small>antrenman, maç ve hoca notları kaynaklı ve tarihli</small></div><div class="p-ic"><div class="liste-satir" style="padding-left:0"><span class="soluk">4 Ara</span><span>Maç: ${esc(kad(V.macSay.ev))} maçında oynadı.</span><span></span></div><div class="liste-satir" style="padding-left:0"><span class="soluk">2 Ara</span><span>Balkon: antrenmanda yorgun görünüyordu. <span class="ornek">örnek</span></span><span></span></div></div></div></div></div>`;
  return `<div class="sayfa oy"><div class="panel"><div class="p-ic oy-kunye"><div class="oy-ad">${yuz(oyYuz(id),o.ad,'buyuk')}<div><b>${esc(o.ad)}</b><span class="soluk">${MEVKI[o.mv]||o.mv} · ${o.yas} yaş</span></div></div>
    <dl class="kunye-tablo"><dt>Kulübü</dt><dd>${o.k?`<button class="link" data-takim="${o.k}">${esc(kad(o.k))}</button>`:'Serbest'}</dd><dt>Sözleşme</dt><dd>${biz&&r?tKisa(r.bitis)+' '+r.bitis.slice(0,4)+' · aylık '+tl(r.maas):o.bit?o.bit.slice(0,4)+' yazında biter (kamu bilgisi)':o.k?'—':'Serbest; hemen imza atabilir'}</dd>
    ${r&&r.boy?`<dt>Boy</dt><dd>${(Math.round(180*r.boy)/100).toFixed(2).replace('.',',')} m</dd>`:''}</dl>
    <div class="dugmeler">${biz?`<button class="dugme" data-ey="hocayaSor">Hocaya sor ▸</button>`:
      `<button class="dugme ${tk?'':'ana'}" data-ey="takip" data-oyuncu-id="${id}" aria-pressed="${tk}">${tk?'Takipte ★':'Takibe al'}</button><button class="dugme" data-ey="arastirt">Hocaya araştırt</button><button class="dugme" data-ey="izle">Git · izlemeye · yarım gün · ~700 ₺</button>`}</div></div></div>
    <div style="display:grid;gap:12px;align-content:start"><div class="ozet-sayilar">${[['Maç',o.m],['Dakika',binlik(o.dk)],['Gol',o.g],['Sarı',o.s],['Kırmızı',o.r]].map(([a,b])=>`<div><small>${a}</small><b>${b}</b></div>`).join('')}</div>
    <div class="panel"><div class="p-bas">Not <small>yetenek puanı gösterilmez</small></div><div class="p-ic soluk">Bu sayfa kamu bilgisidir: Lig, Transfer ve Kulüp aynı sayfayı açar. Görüş için hocaya ya da gözlemciye sorulur; cevap oyuncunun dosyasına not düşer.</div></div></div></div>`;
}
function macSayfasi(){
  const m=V.macSay,ev=kulupRengi(m.ev).z,kn=kulupRengi(m.konuk).z,s=D.altSekme;
  if(s==='ist')return `<div class="sayfa" style="align-content:start;justify-items:center"><div class="panel" style="width:min(40em,100%);--ev-r:${ev};--kn-r:${kn==='#eef0f3'?'#4f86d9':kn}"><div class="p-bas">İstatistikler</div><div class="p-ic">${m.satirlar.map(([ad,a,b])=>{const x=parseFloat(String(a).replace(',','.'))||0,y=parseFloat(String(b).replace(',','.'))||0,t=x+y||1;
    return `<div class="ist-satir"><span class="ad">${esc(ad)}</span><b>${esc(a)}</b><span class="bar"><i class="ev" style="flex:${x/t}"></i><i class="kn" style="flex:${y/t}"></i></span><b>${esc(b)}</b></div>`;}).join('')}</div></div></div>`;
  if(s==='kadro')return `<div class="sayfa" style="grid-template-columns:1fr 1fr;align-content:start">${m.kadro.map((k,i)=>`<div class="panel"><div class="p-bas">${esc(kad(i?m.konuk:m.ev))} <small>${esc(k.dizilis||'')}</small></div><table class="tablo"><tbody><tr class="grup"><td colspan="3">İlk on bir</td></tr>${k.ilk.map(p=>`<tr><td class="s">${p.no}</td><td>${esc(p.ad)}</td><td>${p.mevki}</td></tr>`).join('')}<tr class="grup"><td colspan="3">Yedekler</td></tr>${(k.yedek||[]).map(p=>`<tr><td class="s">${p.no}</td><td>${esc(p.ad)}</td><td>${p.mevki}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>`;
  const ikon={gol:'⚽',kart:'▮',sakatlik:'✚',degisiklik:'⇅'};
  return `<div class="sayfa" style="align-content:start;justify-items:center"><div class="panel" style="width:min(44em,100%)"><div class="p-bas">Özet <small>${esc(m.stat)} · İY ${m.iy[0]}–${m.iy[1]}</small></div><div class="p-ic akis">${m.akis.map(e=>{
    if(e.tur==='devre')return `<div class="devre">Devre arası · ${e.skor[0]}–${e.skor[1]}</div>`;
    if(e.tur==='bitis')return `<div class="devre">Maç sonu · ${e.skor[0]}–${e.skor[1]}</div>`;
    if(!e.ad&&!e.giren)return '';
    const yazi=e.tur==='gol'?`<b>${esc(e.ad)}</b> ${e.skor[0]}–${e.skor[1]}`:e.tur==='degisiklik'?`↑ ${esc(e.giren)} ↓ ${esc(e.cikan)}`:e.tur==='kart'?`<span style="color:${e.renk==='sari'?'#e5c530':'#d33'}">▮</span> ${esc(e.ad)}`:`✚ ${esc(e.ad)} <span class="soluk">${esc(e.bolge||'')}</span>`;
    return e.t===0?`<span class="sol">${yazi}</span><span class="dk">${esc(e.yazi)}</span><span></span>`:`<span></span><span class="dk">${esc(e.yazi)}</span><span>${yazi}</span>`;}).join('')}</div></div></div>`;
}

/* ======================= FİNANS ======================= */
const AYLIK_MAAS=V.maliOzet.maasYuku,LIG_PAYI=10000000;
/* örnek kayıt 23 Kasım'da (Kasım tarifi) başlıyor: kasanın seyri boş kalmasın diye Eylül–Kasım hareketleri örnek (TEST) */
const ORNEK_HAREKET=[['2026-09-01','Eylül maaşları (22 oyuncu ve hoca)',-AYLIK_MAAS],['2026-09-01','Eylül lig yayın payı',LIG_PAYI],['2026-09-01','Göğüs sponsoru taksiti',20000000],
  ['2026-09-12','Kuyulu maçı bilet geliri (1.020 seyirci)',15300000],['2026-09-26','Ilıcaköy maçı bilet geliri (1.240 seyirci)',18600000],['2026-10-01','Ekim maaşları (22 oyuncu ve hoca)',-AYLIK_MAAS],
  ['2026-10-01','Ekim lig yayın payı',LIG_PAYI],['2026-10-01','Göğüs sponsoru taksiti',20000000],['2026-10-10','Taşharman maçı bilet geliri (980 seyirci)',14700000],['2026-10-24','Mercanlı maçı bilet geliri (1.310 seyirci)',19650000],
  ['2026-10-29','Stat çim bakımı',-9000000],['2026-11-01','Kasım maaşları (22 oyuncu ve hoca)',-AYLIK_MAAS],['2026-11-01','Kasım lig yayın payı',LIG_PAYI],['2026-11-01','Göğüs sponsoru taksiti',20000000],
  ['2026-11-14','Söğütlü maçı bilet geliri (1.090 seyirci)',16350000]].map(([tarih,aciklama,tutar])=>({tarih,aciklama,tutar,ornek:1}));
V.hareketler=ORNEK_HAREKET.concat(V.hareketler);
function kasaSerisi(){
  const H=V.hareketler.slice().sort((a,b)=>a.tarih.localeCompare(b.tarih));let b=V.nakit-H.reduce((s,x)=>s+x.tutar,0);
  const gecmis=[{t:tEkle(H[0]?H[0].tarih:BUGUN,-3),b}];for(const x of H){gecmis.push({t:x.tarih,b});b+=x.tutar;gecmis.push({t:x.tarih,b});}gecmis.push({t:BUGUN,b:V.nakit});
  const gelecek=[{t:BUGUN,b:V.nakit}];let c=V.nakit;for(const ay of ['2027-01-01','2027-02-01','2027-03-01']){gelecek.push({t:ay,b:c});c+=LIG_PAYI-AYLIK_MAAS;gelecek.push({t:ay,b:c});}gelecek.push({t:tEkle(BUGUN,90),b:c});
  return{gecmis,gelecek};
}
function kasaGrafigi(){
  const{gecmis,gelecek}=kasaSerisi(),W=640,H=210,sol=58,alt=24,ust=14,sag=10,t0=gecmis[0].t,t1=gelecek[gelecek.length-1].t,gun=gunFarki(t0,t1);
  const tum=gecmis.concat(gelecek).map(p=>p.b),mn=Math.min(...tum),mx=Math.max(...tum),pay=(mx-mn)*.15||1e7,y0=mn-pay,y1=mx+pay;
  const X=t=>sol+(W-sol-sag)*gunFarki(t0,t)/gun,Y=b=>ust+(H-ust-alt)*(1-(b-y0)/(y1-y0));
  const yol=L=>L.map((p,i)=>(i?'L':'M')+X(p.t).toFixed(1)+' '+Y(p.b).toFixed(1)).join(' ');
  let iz='';for(let i=0;i<=3;i++){const b=y0+(y1-y0)*i/3;iz+=`<line class="izgara" x1="${sol}" x2="${W-sag}" y1="${Y(b)}" y2="${Y(b)}"/><text x="${sol-6}" y="${Y(b)+4}" text-anchor="end">${(b/1e8).toLocaleString('tr-TR',{maximumFractionDigits:1})} M</text>`;}
  for(let d=D_(t0);d<=D_(t1);d.setUTCDate(d.getUTCDate()+1))if(d.getUTCDate()===1){const t=d.toISOString().slice(0,10);iz+=`<text x="${X(t)}" y="${H-6}" text-anchor="middle">${AY[d.getUTCMonth()]}</text>`;}
  const en=gelecek.reduce((a,p)=>p.b<a.b?p:a,gelecek[0]);
  return `<svg class="grafik" viewBox="0 0 ${W} ${H}">${iz}<path class="alan" d="${yol(gecmis)} L${X(BUGUN)} ${H-alt} L${X(gecmis[0].t)} ${H-alt}Z"/><path class="gecmis" d="${yol(gecmis)}"/><path class="gelecek" d="${yol(gelecek)}"/>
    <line class="bugun" x1="${X(BUGUN)}" x2="${X(BUGUN)}" y1="${ust}" y2="${H-alt}"/><text x="${X(BUGUN)+4}" y="${ust+10}">bugün</text><circle class="enaz" cx="${X(en.t)}" cy="${Y(en.b)}" r="4"/><text x="${X(en.t)-6}" y="${Y(en.b)-8}" text-anchor="end">en düşük ${tlK(en.b)}</text></svg>`;
}
const TAKVIM_ODEME=[['2026-12-12','Bozkaya maçı bilet geliri (tahmin)',17000000,1],['2027-01-01','Ocak maaşları',-AYLIK_MAAS],['2027-01-01','Ocak lig yayın payı',LIG_PAYI],['2027-02-01','Şubat maaşları',-AYLIK_MAAS],['2027-02-01','Şubat lig yayın payı',LIG_PAYI],['2027-03-01','Mart maaşları',-AYLIK_MAAS]];
const kalem=a=>/bilet/i.test(a)?'Bilet geliri':/yayın payı|lig payı/i.test(a)?'Lig yayın payı':/maaş/i.test(a)?'Maaşlar':/sponsor/i.test(a)?'Sponsor':/transfer|bonservis/i.test(a)?'Transfer':'Diğer';
EKRANLAR.finans=()=>{
  const s=D.sekme.finans,O=V.maliOzet;
  if(s==='durum'&&dz()===1)return `<div class="sayfa fn-1"><div class="fn-kpi">
      <div class="kpi"><small>Kasa</small><b>${tlK(O.nakit)}</b><span>${tUzun(BUGUN)}</span></div>
      <div class="kpi uyari"><small>90 gün içinde en düşük</small><b>${tlK(O.enDusuk)}</b><span>${tKisa(O.enDusukTarih)} · kesin ödemelerle</span>${kaynakSatiri('1 Ara',MUDUR.ad,3)}</div>
      <div class="kpi"><small>Aylık maaş yükü</small><b>${tlK(O.maasYuku)}</b><span>22 oyuncu ve teknik ekip</span></div>
      <div class="kpi"><small>Belirsiz gelir</small><b>${tlK(O.belirsiz)}</b><span>bilet tahmini; kesin sayılmaz</span>${kaynakSatiri('16 Kas',MUDUR.ad,18)}</div></div>
    <div class="panel"><div class="p-bas">Kasanın seyri <small>geçmiş: hareketler (Eylül–Kasım <span class="ornek">örnek</span>) · kesik çizgi: takvimdeki kesin ödemeler</small></div><div class="p-ic">${kasaGrafigi()}</div></div>
    <div style="display:grid;gap:12px;align-content:start;min-height:0"><div class="panel"><div class="p-bas">Takvimdeki ödemeler</div><div>${TAKVIM_ODEME.map(([t,a,v,b])=>`<div class="liste-satir"><span class="soluk">${tKisa(t)}</span><span>${esc(a)}${b?' <span class="ornek">tahmin</span>':''}</span><span class="s ${v>0?'arti':'eksi'}">${isaretli(v)}</span></div>`).join('')}</div></div>
    <div class="panel"><div class="p-bas">Son hareketler <button class="link" data-git="finans" data-git-sekme="raporlar">Raporlar ▸</button></div><div>${V.hareketler.slice(-5).reverse().map(x=>`<div class="liste-satir"><span class="soluk">${tKisa(x.tarih)}</span><span>${esc(x.aciklama)}</span><span class="s ${x.tutar>0?'arti':'eksi'}">${isaretli(x.tutar)}</span></div>`).join('')}</div></div></div></div>`;
  if(s==='durum'){
    const aylar=[...new Set(V.hareketler.map(x=>x.tarih.slice(0,7)))].sort().slice(-3),T={};
    for(const x of V.hareketler){const a=kalem(x.aciklama),m=x.tarih.slice(0,7);T[a]=T[a]||{};T[a][m]=(T[a][m]||0)+x.tutar;T[a].sezon=(T[a].sezon||0)+x.tutar;}
    const gelir=Object.keys(T).filter(a=>T[a].sezon>0),gider=Object.keys(T).filter(a=>T[a].sezon<=0);
    const satir=a=>`<tr><td>${esc(a)}</td>${aylar.map(m=>`<td class="s">${T[a][m]?isaretli(T[a][m]):'—'}</td>`).join('')}<td class="s kalin">${isaretli(T[a].sezon)}</td></tr>`;
    const top=(L,m)=>L.reduce((s,a)=>s+(T[a][m]||0),0);
    return `<div class="sayfa fn-2"><div class="panel"><div class="p-bas">Hesap cetveli <small>hareketlerden · ay ay · Eylül–Kasım <span class="ornek">örnek</span></small></div><div class="p-kay"><table class="tablo"><thead><tr><th>Kalem</th>${aylar.map(m=>`<th class="s">${AYT[+m.slice(5)-1]}</th>`).join('')}<th class="s">Sezon</th></tr></thead><tbody>
      <tr class="grup"><td colspan="${aylar.length+2}">Gelir</td></tr>${gelir.map(satir).join('')}<tr class="grup"><td colspan="${aylar.length+2}">Gider</td></tr>${gider.map(satir).join('')}</tbody>
      <tfoot><tr><td>Net</td>${aylar.map(m=>`<td class="s">${isaretli(top(gelir,m)+top(gider,m))}</td>`).join('')}<td class="s">${isaretli(top(gelir,'sezon')+top(gider,'sezon'))}</td></tr></tfoot></table></div></div>
      <div style="display:grid;gap:12px;align-content:start"><div class="panel"><div class="p-bas">90 günlük ufuk</div><div class="p-ic"><dl class="kunye-tablo"><dt>Kasa</dt><dd class="kalin">${tl(O.nakit)}</dd><dt>En düşük</dt><dd>${tl(O.enDusuk)} · ${tKisa(O.enDusukTarih)}</dd><dt>90 gün sonra</dt><dd>${tl(O.son90)}</dd><dt>Belirsiz gelir</dt><dd>${tl(O.belirsiz)}</dd></dl></div></div>
      <div class="panel"><div class="p-bas">Takvimdeki ödemeler</div>${TAKVIM_ODEME.map(([t,a,v])=>`<div class="liste-satir"><span class="soluk">${tKisa(t)}</span><span>${esc(a)}</span><span class="s ${v>0?'arti':'eksi'}">${isaretli(v)}</span></div>`).join('')}</div></div></div>`;
  }
  if(s==='raporlar'){
    const L=[...D.istekler.map(x=>({id:x.id,ad:x.ad,tarih:BUGUN,durum:'hazırlanıyor · '+x.ne})),{id:'o-maas',ad:'Maaş ve prim dökümü (istenen)',tarih:BUGUN,ornek:1},
      ...V.raporlar.map(r=>({id:r.i,ad:r.baslik,tarih:r.tarih,sayi:r.sayi}))];
    if(D.rapor===null||!L.some(x=>x.id===D.rapor&&!x.durum))D.rapor=L.find(x=>!x.durum).id;
    const sec=L.find(x=>x.id===D.rapor);
    return `<div class="sayfa fn-rap"><div class="panel"><div class="p-bas">Raporlar <button class="link" data-git="finans" data-git-sekme="mudur">Rapor iste ▸</button></div><div class="p-kay">${L.map(x=>`<div class="hb-satir ${x.id===D.rapor?'secili':''}" style="grid-template-columns:4.2em minmax(0,1fr) auto" ${x.durum?'':`data-rapor="${x.id}"`}><span class="hb-saat">${tKisa(x.tarih)}</span><span class="hb-bas">${esc(x.ad)}</span>${x.durum?`<span class="cip vurgu">${esc(x.durum)}</span>`:x.ornek?'<span class="ornek">örnek</span>':''}</div>`).join('')}</div></div>
      <div class="p-kay" style="padding:4px">${sec.id==='o-maas'?maasBelgesi():raporBelgesi(V.raporlar.find(r=>r.i===sec.id))}</div></div>`;
  }
  if(s==='mudur')return mudurlukHtml();
  /* bütçe */
  const B=[['Gelir','Bilet ve kombine',240000000,'bilet'],['Gelir','Lig yayın payı',120000000,'pay'],['Gelir','Sponsorluk',80000000,'sp'],['Gider','Maaşlar',-AYLIK_MAAS*12,'maas'],['Gider','Transfer',-60000000,'tr'],['Gider','İşletme ve tesis',-40000000,'is']];
  const ger={bilet:0,pay:0,maas:0,sp:0,tr:0,is:0};for(const x of V.hareketler){const a=kalem(x.aciklama);if(a==='Bilet geliri')ger.bilet+=x.tutar;else if(a==='Lig yayın payı')ger.pay+=x.tutar;else if(a==='Maaşlar')ger.maas+=x.tutar;}
  return `<div class="sayfa" style="grid-template-columns:minmax(0,1fr) minmax(16em,22em);align-content:start"><div class="panel"><div class="p-bas">Sezon bütçesi 2026–27 <small><span class="ornek">örnek</span> genel kurulda onaylandı · başkan dönem içinde değiştirmez</small></div><div class="p-kay"><table class="tablo"><thead><tr><th>Kalem</th><th class="s">Bütçe</th><th class="s">Gerçekleşen</th><th class="s">Kalan</th><th style="width:22%">Oran</th></tr></thead><tbody>${
    ['Gelir','Gider'].map(g=>`<tr class="grup"><td colspan="5">${g}</td></tr>`+B.filter(b=>b[0]===g).map(([,ad,b,k])=>{const r=ger[k]||0,o=Math.min(1,Math.abs(r)/Math.abs(b));return `<tr><td>${ad}</td><td class="s">${isaretli(b)}</td><td class="s">${isaretli(r)}</td><td class="s">${isaretli(b-r)}</td><td><div class="cubuk"><i style="width:${o*100}%"></i></div></td></tr>`;}).join('')).join('')}</tbody></table></div></div>
    <div class="panel"><div class="p-bas">Bütçe nasıl değişir</div><div class="p-ic" style="line-height:1.5">Bütçe her an oynanan bir ayar değildir. Sezon başında mali genel kurulda onaylanır; dönem içinde değişiklik için olağanüstü kurul gerekir (ileride). Başkanın elindeki araç rapor istemek, müdüre görev vermek ve kararlardır.</div></div></div>`;
};
function raporBelgesi(r){if(!r)return '';
  return `<div class="belge"><div class="antet">${arma(BIZ,2.4)}<div><b>${esc(K[BIZ].ad.toLocaleUpperCase('tr-TR'))}</b><small>Mali İşler Müdürlüğü</small></div></div>
    <h3>${esc(r.baslik)}</h3><div class="kunye"><span>Sayı</span><b>${esc(r.sayi)}</b><span>Tarih</span><b>${tUzun(r.tarih)} · ${saat(r.dakika)}</b><span>Konu</span><b>Mali durum</b></div>
    <p>Başkanlık makamına,</p><p>Kulübümüzün ${tUzun(r.tarih)} itibarıyla mali durumu aşağıdadır.${r.uyari?' '+esc(r.uyari):''}</p>
    <div class="uc">${r.satirlar.slice(0,3).map(s=>`<div><small>${esc(s.ad)}</small><b>${tlK(s.tutar)}</b></div>`).join('')}</div>
    <table>${r.satirlar.slice(3).map(s=>`<tr><td>${esc(s.ad)}</td><td class="s">${tl(s.tutar)}</td></tr>`).join('')}${(r.hareketler||[]).map(h=>`<tr><td>${tKisa(h.tarih)} · ${esc(h.aciklama)}</td><td class="s">${isaretli(h.tutar)}</td></tr>`).join('')}</table>
    <div class="paraf"><span>${esc(r.kaynakAd)}<br>Mali İşler Müdürü</span><span class="mühur">Alındı</span></div></div>`;}
function maasBelgesi(){
  const G={};for(const r of KADRO)(G[r.mevki]=G[r.mevki]||[]).push(r);const top=KADRO.reduce((s,r)=>s+r.maas,0);
  return `<div class="belge"><div class="antet">${arma(BIZ,2.4)}<div><b>${esc(K[BIZ].ad.toLocaleUpperCase('tr-TR'))}</b><small>Mali İşler Müdürlüğü</small></div></div>
    <h3>Maaş ve prim dökümü</h3><div class="kunye"><span>Sayı</span><b>2026/12-İ1</b><span>Tarih</span><b>${tUzun(BUGUN)} · 18:00</b><span>Konu</span><b>Başkanın isteği (bugün gün sonuna kadar)</b></div>
    <p>Başkanlık makamına, istenen döküm aşağıdadır. Süre kısa olduğundan primler tahminidir.</p>
    <table>${Object.entries(G).map(([m,L])=>`<tr><td><b>${MEVKI_COGUL[m]}</b> (${L.length})</td><td class="s"><b>${tl(L.reduce((s,r)=>s+r.maas,0))}</b></td></tr>`+L.map(r=>`<tr><td>&nbsp;&nbsp;${r.no} ${esc(r.ad)} · ${r.bitis.slice(0,4)}’e dek</td><td class="s">${tl(r.maas)}</td></tr>`).join('')).join('')}
    <tr><td><b>Oyuncular toplamı</b></td><td class="s"><b>${tl(top)}</b></td></tr><tr><td>Teknik ekip ve personel</td><td class="s">${tl(AYLIK_MAAS-top)}</td></tr><tr><td>Galibiyet primi (tahmin, maç başı)</td><td class="s">~ 60.000 ₺</td></tr></table>
    <div class="paraf"><span>${esc(MUDUR.ad)}<br>Mali İşler Müdürü</span><span class="mühur">Alındı</span></div></div>`;
}
const RAPOR_KONU=['Genel durum','Maaş ve primler','Borç ve alacaklar','Bilet ve kombine','Sponsorluk','Transfer bütçesi'],RAPOR_NE=[['bugun','Bugün gün sonuna kadar','hızlı, kaba'],['yarin','Yarın sabah','dengeli'],['hafta','Pazartesi özetine ekle','ayrıntılı']];
const GOREVLER=[['tahsil','Alacak tahsilatı','Kocadere’nin 250.000 ₺ borcunu iste','~5 gün'],['sponsor','Sponsor arayışı','Forma göğsü boş; iki firmayla görüş','~2 hafta'],['kis','Gider kısma önerisi','İşletme giderlerinde %10 tasarruf planı','~1 hafta'],['kredi','Banka ile kredi görüşmesi','Kış dönemi için kısa vadeli kredi','~10 gün']];
let rk='Genel durum',rn='bugun';
function mudurlukHtml(){
  const yur=[{ad:'Sponsor arayışı',satir:'2 firma ile görüşüldü · cevap Per 10 Ara',a:['Başla','Görüşme','Teklif','İmza'],i:1,ornek:1},...D.gorevler.map(g=>({ad:g,satir:'Başladı · ilk dönüş birkaç gün içinde',a:['Başla','İlerleme','Sonuç'],i:0}))];
  const kart=D.gorusme?kartHtml(HB['o-gorusme']):'';
  return `<div class="sayfa fn-mudur"><div class="panel"><div class="p-ic kisi-kart"><div class="kk-ust">${yuz(MUDUR.portre,MUDUR.ad,'buyuk')}<div><b>${esc(MUDUR.ad)}</b><span class="soluk">Mali işler müdürü</span></div></div>
      <dl class="kunye-tablo"><dt>Mesai</dt><dd>09:00–18:30 ${Z.gece?'<span class="eksi">· şu an ulaşılamaz</span>':''}</dd><dt>Yürüttüğü</dt><dd>${yukYazi(MUDUR.id,2+D.gorevler.length+D.istekler.length)}</dd><dt>Düzenli</dt><dd>Pazartesi özeti, ay başı raporu</dd></dl>
      <div class="dugmeler">${kademeDugmeleri(MUDUR.id,{sahne:'nusret'})}<button class="dugme ${D.gorusme?'':''}" data-ey="gorusme">Görüşme ayarla (randevu)</button></div>${kart}
      <div class="p-bas" style="margin:.8em -.9em 0">Yetkiler <small>kartla verilir, geri alınır</small></div><div class="yetkiler">${yetkiSatirlari()}</div></div></div>
    <div class="panel"><div class="p-bas">Rapor iste</div><div class="p-ic"><div class="soluk">Konu</div><div class="secim-grup">${RAPOR_KONU.map(k=>`<button class="dugme" data-ey="rk" data-v="${k}" aria-pressed="${rk===k}">${k}</button>`).join('')}</div>
      <div class="soluk">Ne zaman</div><div class="secim-grup">${RAPOR_NE.map(([v,a,n])=>`<button class="dugme" data-ey="rn" data-v="${v}" aria-pressed="${rn===v}">${a} <span class="soluk">· ${n}</span></button>`).join('')}</div>
      <button class="dugme ana" data-ey="raporIste">İste ▸</button><p class="soluk" style="line-height:1.45">Acele rapor kaba olur; müdürün dikkati ve işi kalitesini belirler. Hazır olunca Haberler’e satır düşer, rapor Raporlar’da açılır.</p>
      <div class="p-bas" style="margin:0 -.9em">Görev ver</div>${GOREVLER.map(([id,ad,ac,sure])=>`<div class="gorev"><b>${ad}</b><button class="dugme" data-ey="gorev" data-v="${ad}" ${D.gorevler.includes(ad)?'disabled':''}>${D.gorevler.includes(ad)?'Verildi':'Ver ▸'}</button><small>${ac} · ${sure}</small></div>`).join('')}</div></div>
    <div class="panel"><div class="p-bas">Yürüyen işler</div>${yur.map(g=>`<div class="gorev" style="grid-template-columns:1fr"><b>${esc(g.ad)} ${g.ornek?'<span class="ornek">örnek</span>':''}</b><small>${esc(g.satir)}</small><div class="asamalar">${g.a.map((x,i)=>`<i class="${i<g.i?'tamam':i===g.i?'simdi':''}">${x}</i>`).join('')}</div></div>`).join('')}
      <div class="p-bas">Düzenli raporlar</div><div class="p-ic"><div class="dugmeler" style="flex-direction:column;align-items:stretch"><button class="dugme" aria-pressed="true">Haftalık özet · Pazartesi 09:00</button><button class="dugme" aria-pressed="true">Aylık rapor · ayın 1’i</button><button class="dugme">Günlük kasa notu · kapalı</button></div></div></div></div>`;
}
HB['o-gorusme']={id:'o-gorusme',son:'bugün',kart:{kunye:'Görüşme · Rutin',soru:'Nusret Bey ile yüz yüze görüşme. Hangi gün?',kisi:{yuz:MUDUR.portre,ad:MUDUR.ad,alt:'Mali işler müdürü'},
  sol:{ad:'Pazartesi 11:00',sonuc:'Haftalık özetten hemen sonra; rakamlar taze.',damga:'Pzt 11:00'},sag:{ad:'Salı 17:30',sonuc:'Mesai sonunda, daha uzun konuşulur.',damga:'Sal 17:30'}}};

/* ======================= KULÜP ======================= */
const durumYazi=r=>r.sakat?`<span class="eksi">Sakat · ${tKisa(r.sakat.donus)}</span>`:r.ceza?`<span class="eksi">Cezalı · ${r.ceza.mac} maç</span>`:'<span class="soluk">—</span>';
function sicilFisi(r,sayfada){return `<div class="sicil"><div class="sc-ust"><div><small>Futbolcu sicil fişi</small><b>${esc(r.ad)}</b></div><span class="sc-no">${r.no}</span></div>
  <div class="sc-foto"><img src="${r.portre}" alt=""></div><dl><dt>Mevki</dt><dd>${MEVKI[r.mevki]}</dd><dt>Yaş</dt><dd>${r.yas}</dd><dt>Boy</dt><dd>${(Math.round(180*r.boy)/100).toFixed(2).replace('.',',')} m</dd><dt>Ayak</dt><dd>${r.ayak==='sol'?'Sol':r.ayak==='iki'?'İki ayak':'Sağ'}</dd>
  <dt>Bu sezon</dt><dd>${r.mac} maç · ${binlik(r.dk)} dk · ${r.gol} gol</dd><dt>Kart</dt><dd>${r.sari} sarı · ${r.kirmizi} kırmızı</dd><dt>Durum</dt><dd>${durumYazi(r)}</dd><dt>Sözleşme</dt><dd>${tKisa(r.bitis)} ${r.bitis.slice(0,4)} · aylık ${tl(r.maas)}</dd></dl>
  <div class="dugmeler" style="margin-top:.8em">${sayfada?'':`<button class="dugme" data-oyuncu="${r.id}">Oyuncu sayfası ▸</button>`}<button class="dugme" data-ey="hocayaSor">Hocaya sor ▸</button><button class="dugme" data-git="kulup" data-git-sekme="sozlesme">Sözleşme ▸</button></div></div>`;}
EKRANLAR.kulup=()=>{
  const s=D.sekme.kulup;
  if(s==='kadro'){
    const genis=dz()===1,grup={};for(const r of KADRO)(grup[r.mevki]=grup[r.mevki]||[]).push(r);
    const bas=genis?'<th class="s">No</th><th>Futbolcu</th><th>Mvk</th><th class="s">Yaş</th><th class="s">Boy</th><th class="s">M</th><th class="s">Dk</th><th class="s">G</th><th class="s">Kart</th><th>Durum</th><th class="s">Söz. bitiş</th><th class="s">Maaş / ay</th>':'<th class="s">No</th><th>Futbolcu</th><th>Mvk</th><th class="s">Yaş</th><th class="s">M</th><th class="s">G</th><th>Durum</th>';
    const n=genis?12:7;
    const satir=r=>genis?`<tr data-kadro="${r.id}" data-git><td class="s">${r.no}</td><td><span class="ad">${yuz(r.portre,r.ad)}<span>${esc(r.ad)}</span></span></td><td>${r.mevki}</td><td class="s">${r.yas}</td><td class="s">${(Math.round(180*r.boy)/100).toFixed(2).replace('.',',')}</td><td class="s">${r.mac}</td><td class="s">${binlik(r.dk)}</td><td class="s">${r.gol}</td><td class="s">${r.sari}/${r.kirmizi}</td><td>${durumYazi(r)}</td><td class="s">${r.bitis.slice(0,4)}</td><td class="s">${tl(r.maas)}</td></tr>`
      :`<tr data-kadro="${r.id}" data-git class="${D.kadroSec===r.id?'secili':''}"><td class="s">${r.no}</td><td><span class="ad">${yuz(r.portre,r.ad)}<span>${esc(r.ad)}</span></span></td><td>${r.mevki}</td><td class="s">${r.yas}</td><td class="s">${r.mac}</td><td class="s">${r.gol}</td><td>${durumYazi(r)}</td></tr>`;
    const tablo=`<table class="tablo"><thead><tr>${bas}</tr></thead><tbody>${Object.entries(grup).map(([m,L])=>`<tr class="grup"><td colspan="${n}">${MEVKI_COGUL[m]} · ${L.length}</td></tr>`+L.map(satir).join('')).join('')}</tbody>
      <tfoot><tr><td colspan="${n}">${KADRO.length} oyuncu · yaş ortalaması ${(KADRO.reduce((s,r)=>s+r.yas,0)/KADRO.length).toFixed(1).replace('.',',')} · aylık maaş ${tl(KADRO.reduce((s,r)=>s+r.maas,0))} · sakat ${KADRO.filter(r=>r.sakat).length} · cezalı ${KADRO.filter(r=>r.ceza).length}</td></tr></tfoot></table>`;
    if(genis)return `<div class="sayfa"><div class="panel"><div class="p-bas">Kadro <small>satıra dokun: sicil fişi · gizli puan yok</small></div><div class="p-kay">${tablo}</div></div></div>`;
    return `<div class="sayfa kl-2"><div class="panel"><div class="p-bas">Kadro <small>satır seç: sağda sicil fişi</small></div><div class="p-kay">${tablo}</div></div><div class="p-kay">${sicilFisi(KADRO_ID[D.kadroSec])}</div></div>`;
  }
  if(s==='ekip'){const t=TAB[BIZ];
    const kisi=(p,gorev,satirlar,dug)=>`<div class="panel"><div class="p-bas">${gorev}</div><div class="p-ic"><div class="kk-ust" style="display:flex;gap:.8em;align-items:center">${yuz(p.portre,p.ad,'buyuk')}<div><b style="font:800 1.15em Nunito">${esc(p.ad)}</b></div></div><dl class="kunye-tablo">${satirlar}</dl><div class="dugmeler">${dug}</div></div></div>`;
    return `<div class="sayfa ekip">${kisi(HOCA,'Teknik direktör',`<dt>Tarz</dt><dd>${esc(K[BIZ].tarz)}</dd><dt>Bu sezon</dt><dd>${t.O} maç · ${t.G}-${t.B}-${t.M} · ${t.P} puan</dd><dt>Sıra</dt><dd>${SIRA[BIZ]}.</dd><dt>Sözleşme</dt><dd>31 May 2027 <span class="ornek">örnek</span></dd>`,
      kademeDugmeleri(HOCA.id,{sahne:'hoca'}))}
      ${kisi(YARD,'Yardımcı antrenör','<dt>Görev</dt><dd>Antrenman, oyuncu raporları (rakamla)</dd><dt>Kulüpte</dt><dd>2024’ten beri <span class="ornek">örnek</span></dd><dt>Yürüttüğü</dt><dd>'+yukYazi(YARD.id,2)+'</dd>',kademeDugmeleri(YARD.id,{sahne:'tahsin'}))}
      ${kisi(MUDUR,'Mali işler müdürü','<dt>Görev</dt><dd>Kasa, raporlar, ödemeler</dd><dt>Düzenli</dt><dd>Pazartesi özeti, ay başı raporu</dd><dt>Yürüttüğü</dt><dd>'+yukYazi(MUDUR.id,2+D.gorevler.length+D.istekler.length)+'</dd>',`<button class="dugme" data-git="finans" data-git-sekme="mudur">Müdürlük ▸</button>`+kademeDugmeleri(MUDUR.id,{sahne:'nusret',sade:true}))}
      <div class="panel"><div class="p-bas">Özel kalem <span class="ornek">örnek</span></div><div class="p-ic"><div class="kk-ust" style="display:flex;gap:.8em;align-items:center"><span class="yuz yuz-bos buyuk">Ö</span><div><b style="font:800 1.15em Nunito">Özel kalem (adsız · TEST)</b></div></div><dl class="kunye-tablo"><dt>Görev</dt><dd>Randevular, tahminler, ön eleme</dd><dt>Tahmin</dt><dd>İlk sezon kaba (“~20–40 dk”); tanıdıkça daralır</dd><dt>Kalite</dt><dd class="soluk">gizli; çakışan randevu ve kaba tahmin onu ele verir</dd></dl></div></div>
      <div class="panel bos-slot"><div class="p-bas">Sportif direktör</div><div class="p-ic soluk">Boş koltuk. 2. Lig’de açılır (personel slotları lig kademesiyle büyür).</div></div>
      <div class="panel bos-slot"><div class="p-bas">Gözlemci</div><div class="p-ic soluk">Boş koltuk. Atanınca “Hocaya araştırt” yerine gözlemci raporu gelir.</div></div></div>`;}
  if(s==='sozlesme'){const L=KADRO.slice().sort((a,b)=>a.bitis.localeCompare(b.bitis)||b.maas-a.maas);
    return `<div class="sayfa"><div class="panel"><div class="p-bas">Sözleşmeler <small>bitişe göre · en yakın üstte</small></div><div class="p-kay"><table class="tablo"><thead><tr><th>Futbolcu</th><th>Mvk</th><th class="s">Yaş</th><th class="s">Bitiş</th><th class="s">Kalan</th><th class="s">Maaş / ay</th><th>Durum</th><th></th></tr></thead><tbody>${
      L.map(r=>{const ay=Math.round(gunFarki(BUGUN,r.bitis)/30.4);return `<tr data-kadro="${r.id}" data-git><td><span class="ad">${yuz(r.portre,r.ad)}<span>${esc(r.ad)}</span></span></td><td>${r.mevki}</td><td class="s">${r.yas}</td><td class="s">${tKisa(r.bitis)} ${r.bitis.slice(0,4)}</td><td class="s ${ay<=6?'eksi':''}">${ay} ay</td><td class="s">${tl(r.maas)}</td><td class="soluk">${ay<=6?'Yenileme görüşülmedi':'—'}</td><td>${ay<=6?'<button class="dugme" data-ey="yenile">Yenile ▸</button>':''}</td></tr>`;}).join('')}</tbody></table></div></div></div>`;}
  if(s==='iliskiler')return iliskilerHtml();
  const st=K[BIZ].stat,bilet=V.hareketler.filter(x=>/bilet/i.test(x.aciklama)),seyirci=bilet.map(x=>+((/([\d.]+) seyirci/.exec(x.aciklama)||[])[1]||'0').replace('.','')).filter(Boolean);
  return `<div class="sayfa" style="grid-template-columns:repeat(auto-fit,minmax(20em,1fr));align-content:start"><div class="panel"><div class="p-bas">${esc(st.ad)}</div><div class="p-ic"><div class="ozet-sayilar"><div><small>Kapasite</small><b>${binlik(st.kap)}</b></div><div><small>Seyirci ort.</small><b>${seyirci.length?binlik(seyirci.reduce((a,b)=>a+b,0)/seyirci.length):'—'}</b></div><div><small>Doluluk</small><b>${seyirci.length?Math.round(seyirci.reduce((a,b)=>a+b,0)/seyirci.length/st.kap*100)+'%':'—'}</b></div></div></div></div>
    <div class="panel"><div class="p-bas">Tesis <span class="ornek">örnek</span></div><div class="p-ic"><dl class="kunye-tablo"><dt>Zemin</dt><dd>Orta · kışın ağırlaşır</dd><dt>Antrenman sahası</dt><dd>1 çim, 1 sentetik</dd><dt>Altyapı</dt><dd>U19, U17</dd></dl><div class="dugmeler" style="margin-top:.6em"><button class="dugme" data-git="balkon">Balkondan bak ▸</button></div></div></div>
    <div class="panel"><div class="p-bas">İç saha bilet gelirleri</div>${bilet.map(x=>`<div class="liste-satir"><span class="soluk">${tKisa(x.tarih)}</span><span>${esc(x.aciklama)}</span><span class="s arti">${isaretli(x.tutar)}</span></div>`).join('')}</div></div>`;
};

/* ======================= TRANSFER ======================= */
const KARAOVA_UMUT=V.oyuncular.find(o=>o.k==='karaova'&&o.ad==='Umut')||V.oyuncular.find(o=>o.mv==='FV'&&o.k!==BIZ);
const ASAMA=['Bütçe','Araştırma','Aday','Pazarlık','Görüşme','Maaş','Sağlık','İmza'];
function acikIsler(){const L=[{ad:'Forvet hattı',aday:KARAOVA_UMUT,satir:'Kulüple pazarlık 2/3 · cevap Per 10 Ara',i:3,kim:MUDUR.ad+' yürütüyor',sutun:1,ornek:1},
  {ad:'Sol bek',aday:null,satir:YARD.ad+' araştırıyor · rapor Sal 8 Ara',i:1,kim:YARD.ad,sutun:0,ornek:1}];
  if(kartSonuc('o-hoca')==='sag')L.unshift({ad:'Forvet hattı (hocanın isteği)',aday:null,satir:'Bütçe belirlenecek · kart Haberler’de',i:0,kim:'Sen',sutun:0});return L;}
EKRANLAR.transfer=()=>{
  const s=D.sekme.transfer,gun=gunFarki(BUGUN,'2027-01-04');
  if(s==='durum'){
    const grup={};for(const r of KADRO)(grup[r.mevki]=grup[r.mevki]||[]).push(r);
    const ih=['KL','DEF','OS','FV'].map(m=>{const L=grup[m]||[],yas=L.reduce((a,r)=>a+r.yas,0)/L.length,biten=L.filter(r=>r.bitis<'2027-06-01').length,eksik=L.filter(r=>r.sakat||r.ceza).length;
      const istek=m==='FV'&&kartSonuc('o-hoca')!=='sol';
      return `<div class="panel"><div class="p-bas">${MEVKI_COGUL[m]}</div><div class="p-ic"><span class="ih-say">${L.length}</span><span class="soluk">yaş ort. ${yas.toFixed(1).replace('.',',')}</span><span>${biten?`<span class="eksi">${biten} sözleşme Haziran’da biter</span>`:'<span class="soluk">Biten sözleşme yok</span>'}</span>${eksik?`<span class="eksi">${eksik} oyuncu eksik</span>`:''}${istek?`<span class="istek">${esc(HOCA.ad)} takviye istiyor</span>`:''}</div></div>`;}).join('');
    const isler=acikIsler();
    const ust=`<div class="tr-donem"><b>Kış transfer dönemi</b><span>4 Ocak – 5 Şubat · açılmasına ${gun} gün</span><span>Transfer bütçesi <b>600.000 ₺</b> <span class="ornek">örnek</span></span><span>Maaş tavanı <b>30.000 ₺/ay</b></span><span>Kasa ${tlK(V.nakit)}</span></div><div class="ihtiyac">${ih}</div>`;
    const menajer=`<div class="panel"><div class="p-bas">Menajer önerileri <small>Pazartesi teleksi</small></div><div class="p-kay teleks">${V.serbest.slice(0,4).map((p,i)=>`<div class="tk" data-oyuncu="${p.id}" style="cursor:pointer"><small>${['MENAJER ŞAKİR B.','MENAJER NEVZAT K.','MENAJER ŞAKİR B.','MENAJER ORHAN T.'][i]} · ${tKisa(tEkle(BUGUN,-4))} <span class="ornek">örnek</span></small>${esc(p.ad)} · ${MEVKI[p.mv]} · ${p.yas} yaş · serbest. ${['Maaş beklentisi yüksek.','Hemen imza atar.','Sakatlıktan döndü.','Yurt dışından dönüyor.'][i]}</div>`).join('')}</div></div>`;
    if(dz()===1){const S=['Araştırma','Pazarlık','Oyuncuyla','İmza'];
      return `<div class="sayfa tr-1">${ust}<div class="kanban">${S.map((ad,j)=>`<div class="sutun"><div class="p-bas">${ad}</div>${isler.filter(x=>x.sutun===j).map(x=>`<div class="is-kart" ${x.aday?`data-oyuncu="${x.aday.id}"`:''}><b>${esc(x.ad)} ${x.ornek?'<span class="ornek">örnek</span>':''}</b>${x.aday?`<span>${arma(x.aday.k,1.1)} ${esc(x.aday.ad)} · ${x.aday.yas} yaş · ${x.aday.g} gol</span>`:''}<small>${esc(x.satir)}</small><small>${esc(x.kim)}</small></div>`).join('')||'<div class="bos" style="padding:1em">—</div>'}</div>`).join('')}</div>${menajer}</div>`;}
    return `<div class="sayfa tr-1">${ust}<div class="panel"><div class="p-bas">Açık işler</div>${isler.map(x=>`<div class="gorev" style="grid-template-columns:1fr auto" ${x.aday?`data-oyuncu="${x.aday.id}"`:''}><b>${esc(x.ad)} ${x.aday?'· '+esc(x.aday.ad)+' ('+esc(kad(x.aday.k))+')':''} ${x.ornek?'<span class="ornek">örnek</span>':''}</b><span class="soluk">${esc(x.kim)}</span><small>${esc(x.satir)}</small><span></span><div class="asamalar">${ASAMA.map((a,i)=>`<i class="${i<x.i?'tamam':i===x.i?'simdi':''}">${a}</i>`).join('')}</div></div>`).join('')}</div>${menajer}</div>`;
  }
  if(s==='ara'){
    const A=D.ara;let L=Object.values(OY).filter(o=>o.k!==BIZ);
    if(A.q)L=L.filter(o=>(o.ad+' '+kad(o.k)).toLocaleLowerCase('tr').includes(A.q.toLocaleLowerCase('tr')));
    if(A.mv)L=L.filter(o=>o.mv===A.mv);
    if(A.yas)L=L.filter(o=>A.yas==='genc'?o.yas<=23:A.yas==='orta'?o.yas>=24&&o.yas<=29:o.yas>=30);
    if(A.ek==='serbest')L=L.filter(o=>!o.k);if(A.ek==='biten')L=L.filter(o=>o.bit&&o.bit<'2027-06-01');
    const S=D.sirala,al=o=>S.a==='ad'?o.ad:S.a==='kulup'?kad(o.k):S.a==='bit'?(o.bit||'9'):o[S.a];
    L.sort((a,b)=>{const x=al(a),y=al(b);return(typeof x==='string'?x.localeCompare(y,'tr'):x-y)*S.y;});
    const th=(a,ad,c)=>`<th class="${c||''}" data-sirala="${a}">${ad}${S.a===a?(S.y>0?' ▲':' ▼'):''}</th>`;
    const cip=(k,v,ad)=>`<button class="dugme" data-ey="ara" data-k="${k}" data-v="${v}" aria-pressed="${A[k]===v}">${ad}</button>`;
    return `<div class="sayfa"><div class="panel"><div class="filtre"><input id="araQ" placeholder="Oyuncu ya da kulüp adı" value="${esc(A.q)}">${cip('mv','KL','Kaleci')}${cip('mv','DEF','Defans')}${cip('mv','OS','Orta saha')}${cip('mv','FV','Forvet')}<span class="soluk">·</span>${cip('yas','genc','23 ve altı')}${cip('yas','orta','24–29')}${cip('yas','yasli','30+')}<span class="soluk">·</span>${cip('ek','biten','Sözleşmesi Haziran’da biten')}${cip('ek','serbest','Serbest')}<span style="margin-left:auto" class="soluk">${L.length} oyuncu</span></div>
      <div class="p-kay"><table class="tablo"><thead><tr><th></th>${th('ad','Oyuncu')}${th('kulup','Kulüp')}${th('mv','Mvk')}${th('yas','Yaş','s')}${th('m','M','s')}${th('dk','Dk','s')}${th('g','G','s')}${th('bit','Söz. biter','s')}</tr></thead><tbody>${
      L.slice(0,120).map(o=>`<tr data-oyuncu="${o.id}" data-git><td class="o yildiz">${D.takip.has(o.id)?'★':''}</td><td><span class="ad">${yuz(oyYuz(o.id),o.ad)}<span>${esc(o.ad)}</span></span></td><td><span class="ad">${arma(o.k,1.1)}<span>${esc(kad(o.k))}</span></span></td><td>${o.mv}</td><td class="s">${o.yas}</td><td class="s">${o.m}</td><td class="s">${binlik(o.dk)}</td><td class="s">${o.g}</td><td class="s">${o.k?(o.bit?o.bit.slice(0,4):'—'):'serbest'}</td></tr>`).join('')}</tbody></table></div></div></div>`;
  }
  if(s==='hedef'){const L=[KARAOVA_UMUT.id,V.serbest[0].id,...D.takip].filter((x,i,a)=>a.indexOf(x)===i).map(id=>OY[id]);
    return `<div class="sayfa"><div class="panel"><div class="p-bas">Hedefler <small>takibe aldıkların · kaynakla</small></div><div class="p-kay"><table class="tablo"><thead><tr><th>Oyuncu</th><th>Kulüp</th><th>Mvk</th><th class="s">Yaş</th><th class="s">G</th><th>Kaynak</th><th>Son not</th></tr></thead><tbody>${
      L.map((o,i)=>`<tr data-oyuncu="${o.id}" data-git><td><span class="ad">${yuz(oyYuz(o.id),o.ad)}<span>${esc(o.ad)}</span></span></td><td>${esc(kad(o.k))}</td><td>${o.mv}</td><td class="s">${o.yas}</td><td class="s">${o.g}</td><td class="soluk">${i===0?'Hoca raporu':i===1?'Menajer teleksi':'Ara’dan'}</td><td class="soluk">${i===0?'“Hava topunda güçlü, sırtı dönük oynar.” · 2 Ara':i===1?'Maaş beklentisi yüksek':'—'}</td></tr>`).join('')}</tbody></table></div></div></div>`;}
  if(s==='teklif'){const h=HB['o-teklif'],r=kartSonuc('o-teklif');
    return `<div class="sayfa" style="grid-template-columns:1fr 1fr;align-content:start"><div class="panel"><div class="p-bas">Gelen teklifler</div><div class="gorev"><b>${arma('kocadere',1.1)} Kocadere İY → Oğuz · 1.250.000 ₺ <span class="ornek">örnek</span></b>${r?`<span class="cip">${esc(h.kart[r].damga)}</span>`:`<button class="dugme ana" data-git="haberler" data-git-sekme="cevap">Cevap ver ▸</button>`}<small>${D.yapilan.has('kocadere')?'Karşı teklif: 1,9 milyon dedin · <b>sabrı belirsiz</b> (ilk pazarlık; söylemedi)':'Son cevap '+h.son+' <span class="soluk">(söyledi → saat görünür)</span>'}</small><div class="dugmeler" style="grid-column:1/-1">${kademeDugmeleri('k-kocadere',{sahne:'kocadere'})}</div></div></div>
      <div class="panel"><div class="p-bas">Giden teklifler</div><div class="gorev"><b>${arma(KARAOVA_UMUT.k,1.1)} ${esc(KARAOVA_UMUT.ad)} (${esc(kad(KARAOVA_UMUT.k))}) <span class="ornek">örnek</span></b><span class="cip vurgu">${D.yapilan.has('karaova')?'Ön anlaşma · tescil 4 Oca':'Pazarlık 2/3'}</span><small>${D.yapilan.has('karaova')?'950 bin · iki taksit · sağlık Ocak’ta':'Menajer Tarık Yener: “Çarşamba’ya kadar” · <b>söylediği sabır 2 gün</b> (ilk temas; gerçeği öğrenilecek)'}</small><div class="dugmeler" style="grid-column:1/-1">${kademeDugmeleri('k-karaova',{sahne:'karaova'})}</div></div></div></div>`;}
  return `<div class="sayfa"><div class="panel"><div class="p-bas">Geçmiş</div><div class="bos">Bu sezon transfer yok. Gelen ve giden oyuncular, kaçan transferler burada.</div></div></div>`;
};

/* ======================= TELEFON ======================= */
const KONUSMA={
  [HOCA.id]:[['g','Maçı nasıl gördün?','4 Ara 21:50'],['l','Beraberlik fena değil başkanım. Erdal’ın golü yetti ama ikinci yarı düştük; forvet yoruldu.','4 Ara 22:05'],['kart','o-hoca']],
  [YARD.id]:[['g','Takım ne durumda?','3 Ara 10:12'],['l','Nail Pazartesi döner. Metin cezalı. Kondisyonu en düşük üç oyuncu: Kadir, Erdal, Oğuz.','3 Ara 12:30'],['l','Yarın 11:00 uygunsa yüz yüze konuşalım.','4 Ara 16:40']],
  [MUDUR.id]:[['g','Maaş ve prim dökümünü bugün gün sonuna kadar hazırlar mısın?','3 Ara 15:00'],['l','Hazırlarım başkanım, primler kaba olur.','3 Ara 15:20'],['l','Döküm hazır; Raporlar’da.','4 Ara 18:00']]};
const KONULAR={[HOCA.id]:['Maçı nasıl gördün?','Takım ne durumda?','Oyuncu hakkında sor…','Görüşelim','Forvet hattına oyuncu bulalım'],[YARD.id]:['Takım ne durumda?','Oyuncu hakkında sor…','Görüşelim'],[MUDUR.id]:['Kasa ne durumda?','Rapor iste…','Görüşelim']};
EKRANLAR.telefon=()=>{
  const L=[HOCA,YARD,MUDUR],sec=kisiBul(D.kisi)||HOCA,K_=KONUSMA[sec.id]||[],u=ulasilabilir(sec.id);
  const satir=p=>{const son=(KONUSMA[p.id]||[]).filter(x=>x[0]!=='kart').slice(-1)[0],ul=ulasilabilir(p.id);
    return `<div class="kisi-satir ${p.id===sec.id?'secili':''} ${ul.ok?'':'ulasilmaz'}" data-kisi="${p.id}">${p.portre?yuz(p.portre,p.ad):`<span class="kurum" style="width:2.4em;height:2.4em">${esc(p.kisa||p.ad[0])}</span>`}<div><b>${esc(p.ad)}</b><small>${esc(son?son[1]:rolAd(p))}</small></div><span class="soluk" style="font-size:.8em">${ul.ok?esc(son?son[2].split(' ').slice(-1)[0]:''):'mesai dışı'}</span></div>`;};
  return `<div class="sayfa tel"><div class="panel"><div class="p-bas">Kişiler <small>ekip</small></div><div class="p-kay">${L.map(satir).join('')}<div class="hb-gun">Rehber <span class="soluk" style="text-transform:none;letter-spacing:0">· tanıştıkça büyür</span></div>${ILISKI.filter(p=>p.rehber).map(satir).join('')}
    <div class="p-ic soluk" style="font-size:.88em;line-height:1.4">Canlı Skor odada yok: balkonda ve maçta telefon cihazının içinde. Mesaj bedava ve yavaş; arama bedelli ve hızlı; kişi açmayabilir.</div></div></div>
    <div class="panel"><div class="p-bas">${esc(sec.ad)} <small>${esc(rolAd(sec))} · ${u.ok?'cevap birkaç saat içinde':'<span class="eksi">'+esc(u.neden)+'</span>'}</small></div>
      <div class="konusma">${K_.map(x=>x[0]==='kart'?kartHtml(HB[x[1]]):`<div class="balon ${x[0]==='g'?'giden':'gelen'}">${esc(x[1])}<small>${esc(x[2])}</small></div>`).join('')||`<div class="bos">Henüz yazışma yok.</div>`}</div>
      <div class="konu-cubuk"><button class="dugme ana" data-ey="aramaYap" data-v="${esc(sec.id)}" ${u.ok?'':'disabled'}>Ara · ~5–15 dk${u.ok?'':' · açmaz'}</button><span class="soluk" style="align-self:center">Mesaj:</span>${(KONULAR[sec.id]||['Görüşelim']).map(k=>`<button class="dugme" data-ey="konu">${esc(k)}</button>`).join('')}</div></div></div>`;
};

/* ======================= AJANDA ======================= */
function ajandaIsleri(){
  const L=[];
  for(const m of BUTUN_MACLAR)if(m.ev===BIZ||m.konuk===BIZ)L.push({t:m.tarih,dk:m.dk,ad:kad(m.ev)+' – '+kad(m.konuk)+(m.skor?' '+m.skor[0]+'–'+m.skor[1]:''),c:'mac'});
  for(const g of V.gel)if(g.kanal==='dosya'||g.kanal==='para')L.push({t:g.tarih,dk:g.dk,ad:temiz(g.baslik).replace(/\s*\(.*$/,''),c:'para'});
  for(const x of V.isler)if(x.tur!=='gelisme'&&x.tur!=='ajanda')L.push({t:x.tarih,dk:x.dk,ad:x.baslik,c:x.tur==='maliRapor'?'para':''});
  L.push({t:'2026-12-05',dk:660,ad:'Görüşme: '+YARD.ad,c:'randevu'});
  if(!kartSonuc('o-hoca'))L.push({t:'2026-12-06',dk:1439,ad:'Son cevap: hocanın forvet isteği',c:'son'});
  if(!kartSonuc('o-teklif'))L.push({t:'2026-12-07',dk:1080,ad:'Son cevap: Kocadere teklifi',c:'son'});
  L.push({t:'2026-12-14',dk:540,ad:'Haftalık mali özet',c:'para'},{t:'2026-12-21',dk:540,ad:'Haftalık mali özet',c:'para'});
  return L.sort((a,b)=>(a.t+saat(a.dk)).localeCompare(b.t+saat(b.dk)));
}
EKRANLAR.ajanda=()=>{
  const L=ajandaIsleri();
  if(D.sekme.ajanda==='hafta'){const pzt=tEkle(BUGUN,-((D_(BUGUN).getUTCDay()+6)%7)+7*D.ajHafta);
    return `<div class="sayfa" style="grid-template-rows:auto minmax(0,1fr)"><div class="hafta-sec"><button class="dugme" data-ey="ajHafta" data-yon="-1">‹</button><b>${tKisa(pzt)} – ${tKisa(tEkle(pzt,6))}</b><button class="dugme" data-ey="ajHafta" data-yon="1">›</button><span class="soluk" style="margin-left:1em">Maç, rapor, randevu ve son cevap tarihleri tek yerde</span></div>
      <div class="aj-hafta">${[0,1,2,3,4,5,6].map(i=>{const t=tEkle(pzt,i),d=D_(t);return `<div class="aj-gun ${t===BUGUN?'bugun':t<BUGUN?'gecti':''}"><header><span>${GUNT[d.getUTCDay()]}</span><span>${d.getUTCDate()}</span></header>${L.filter(x=>x.t===t).map(x=>`<div class="aj-is ${x.c}"><b>${x.dk===1439?'gün sonu':saat(x.dk)}</b>${esc(x.ad)}</div>`).join('')}</div>`;}).join('')}</div></div>`;}
  const ilk=D_('2026-12-01'),bos=(ilk.getUTCDay()+6)%7;let h='';for(const g of ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'])h+=`<div class="bas">${g}</div>`;
  for(let i=0;i<bos;i++)h+='<div class="ag bos"></div>';
  for(let g=1;g<=31;g++){const t='2026-12-'+String(g).padStart(2,'0');h+=`<div class="ag ${t===BUGUN?'bugun':''}"><b>${g}</b>${L.filter(x=>x.t===t).map(x=>`<i class="${x.c==='mac'?'eksi':x.c==='son'?'eksi':''}">${esc(x.ad)}</i>`).join('')}</div>`;}
  return `<div class="sayfa" style="align-content:start"><div class="panel"><div class="p-bas">Aralık 2026</div><div class="p-ic aj-ay">${h}</div></div></div>`;
};

/* ======================= GAZETE ======================= */
EKRANLAR.gazete=()=>{
  const m=V.macSay,biz=m.ev===BIZ?0:1,sk=m.skor,ilk=golcu(3);
  const sayilar=[{t:tEkle(BUGUN,1),bas:'Demirkapı Değirmenaltı’ndan bir puanla döndü',ust:'Maç',metin:`${kad(m.ev)} ile ${kad(m.konuk)} ${sk[0]}–${sk[1]} berabere kaldı. İlk yarıda iki takım da sakatlıklarla uğraştı; ikinci yarıda goller geldi. Demirkapı ${SIRA[BIZ]}. sırada.`},
    {t:'2026-11-29',bas:'Akdeniz, Demirkapı’yı dört golle geçti',ust:'Maç',metin:'Lider Akdeniz deplasmanda rahat kazandı. Demirkapı savunması özellikle ikinci yarıda dağıldı; taraftar maç sonunda tribünü erken terk etti.'}];
  const s=sayilar[D.gazete]||sayilar[0];
  return `<div class="sayfa gz"><div class="panel"><div class="p-bas">Sayılar</div><div class="p-kay">${sayilar.map((x,i)=>`<div class="hb-satir ${i===D.gazete?'secili':''}" style="grid-template-columns:4.2em minmax(0,1fr)" data-gazete="${i}"><span class="hb-saat">${tKisa(x.t)}</span><span class="hb-bas">${esc(x.bas)}</span></div>`).join('')}</div></div>
    <div class="p-kay"><div class="gazete"><div class="gz-kunye"><b>YEREL GAZETE</b><small>${tUzun(s.t)} · TEST metin</small></div><h3>${esc(s.bas)}</h3><div class="gz-sutun"><p>${esc(s.metin)}</p><p>Teknik direktör ${esc(HOCA.ad)} maçtan sonra kısa konuştu. Kulüpte gözler kış transfer dönemine çevrildi; forvet hattına takviye yapılacağı konuşuluyor.</p></div>
      <div class="gz-alt"><div><h4>Puan durumu</h4><p>${V.tablo.slice(0,5).map((t,i)=>`${i+1}. ${esc(K[t.id].kisa)} ${t.P}`).join(' · ')}</p></div><div><h4>Gol krallığı</h4><p>${ilk.map(o=>`${esc(o.ad)} (${esc(K[o.k].kisa)}) ${o.g}`).join(' · ')}</p></div></div></div></div></div>`;
};

/* ======================= BALKON ======================= */
EKRANLAR.balkon=()=>`<div class="balkon-not"><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:center"><div class="panel"><div class="p-bas">Balkon</div><div class="p-ic" style="line-height:1.5">Balkon bugünkü 3B sahnedir; değişmez. Şerit ve başlık burada da durur. Telefon cihazı burada ve maçta kalır: Canlı Skor’un yeri orasıdır. Odadaki Lig bölümü aynı veriyi tam ekranda gösterir.</div></div>
  <div class="cihaz"><div class="ekran"><b>Canlı Skor</b>${V.tablo.slice(0,6).map((t,i)=>`<div style="display:flex;gap:.5em;align-items:center;padding:.15em 0">${i+1} ${arma(t.id,1)} <span style="flex:1">${esc(K[t.id].kisa)}</span><b style="font-size:1em;margin:0">${t.P}</b></div>`).join('')}</div></div></div></div>`;

/* ======================= konsept çubuğu ======================= */
const NOTLAR={
  ofis:'Ofis: oda canlı zemin, nesneler kısayol (telefon, gazete, defter, dosya, sarı not, TV, balkon kapısı). Üzerine gel, tıkla: ilgili bölüm anında açılır. Oyunda oda 3B ve saatle ışığı değişir.',
  haberler:['Düzen 1 — CM: üstte liste, altta ayrıntı. Cevap bekleyenler listenin başında; aynı günün arka plan satırları tek satırda. Kart ayrıntıda: listeden çıkmadan karar.','Düzen 2 — gelen kutusu: solda iki satırlık liste, sağda büyük ayrıntı ve kart.'],
  kulup:['Düzen 1 — tam tablo: mevki grupları, sözleşme ve maaş tek bakışta.','Düzen 2 — tablo + sicil fişi: satır seç, sağda belge.'],
  finans:['Düzen 1 — pano: dört sayı, kasanın seyri, takvimdeki ödemeler.','Düzen 2 — hesap cetveli: kalem kalem, ay ay; CM gibi yoğun tablo.'],
  lig:['Düzen 1 — tablo + yan sütun (gelecek hafta, gol krallığı, son sonuçlar).','Düzen 2 — geniş tablo: beklenen gol, şut, topa sahip olma sütunlarıyla.'],
  transfer:['Düzen 1 — pano: dönem, kadro ihtiyacı, açık işler sütunlarda (araştırma → imza).','Düzen 2 — liste: her iş bir satır, sekiz aşama işaretli.'],
  ajanda:'Ajanda: hafta görünümü kartlarla; ay görünümü. Son cevap tarihleri kırmızı.',telefon:'Telefon odada düz ekran: solda kişiler, sağda konuşma; karar kartı konuşmanın içinde (Haberler’dekiyle aynı kart).',
  gazete:'Gazete: sayılar solda, sayfa sağda. Boş günde sayı çıkmaz.',balkon:'Balkon ve maç ayrı sahnelerdir; Canlı Skor telefonda orada kalır.'};
const NOTLAR_ALT={takim:'Kulüp sayfası: başlık şeridi o kulübün renginde (CM gibi); sekmeler kulübe ait. Lig, Haberler ve Transfer aynı sayfaya iner.',
  oyuncu:'Oyuncu sayfası: tek bileşen. Bizim oyuncuda sicil fişi ve notlar, başka kulübün oyuncusunda kamu bilgisi ve Takibe al. Yetenek puanı yok.',
  mac:'Maç sayfası: başlık iki kulübün renginde, skor ortada (CM’nin maç başlığı). Özet, istatistik, kadrolar.'};
const NOTLAR_SEKME={'finans:raporlar':'Raporlar: solda liste (istenenler “hazırlanıyor”), sağda resmî yazı. Belge her görünümde kâğıttır.',
  'finans:mudur':'Müdürlük: rapor iste (konu + ne zaman; acele kaba), görev ver, görüşme ayarla (tek kart), yürüyen işler aşamalı. Bütçe burada oynanmaz.',
  'finans:butce':'Bütçe: genel kurulun onayladığı tablo; okunur, oynanmaz.','lig:fikstur':'Fikstür: hafta hafta, gün başlıklarıyla; Demirkapı maçında maç sayfası.',
  'lig:gol':'Gol krallığı: sıralanmış tablo; satıra dokun: oyuncu sayfası.','lig:ist':'İstatistik: kulüpler ve oyuncular; kayıtlı maçlardan.',
  'lig:kulupler':'Kulüpler: on altı kulüp kartı; dokun: kulüp sayfası (başlık o kulübün renginde).','kulup:ekip':'Teknik ekip: hoca, yardımcı, müdür; boş koltuklar lig kademesiyle açılır.',
  'kulup:sozlesme':'Sözleşmeler: bitişe göre; altı aydan az kalanlar işaretli.','kulup:stat':'Stat ve tesis: kapasite, seyirci, zemin.',
  'transfer:ara':'Ara: süzgeçler ve sıralanan tablo (başlığa dokun). Satır: oyuncu sayfası.','transfer:hedef':'Hedefler: takibe aldıkların, kaynağıyla.',
  'transfer:teklif':'Teklifler: gelen ve giden; her kişi düğmesi kademesini ve bedelini yazar (Ara / Çağır / Git); karşı tarafın saati söylediyse görünür, söylemediyse belirsiz.','kulup:iliskiler':'İlişkiler: kurumlar ve kişiler; son temas, açık dosya, söz, tanıdığın kadarı — olgu, tutum değil. Satır: kişi sayfası ve üç kademe.','kulup:ekip':'Teknik ekip: her kişide yük (“3 iş”) ve üç kademe düğmesi; özel kalem tahminlerin kaynağı; boş koltuklar.','finans:durum':'Durum: kasa ve maaş yükü her an; ufuk ve belirsiz gelir müdürün raporundan — kaynak ve tarihle, eskiyince sararır, “taze rapor iste”.','haberler:cevap':'Cevap bekliyor: kartlar ve randevular; kart ayrıntıda, listeden çıkmadan.'};
function meta(){
  const seg=(k,L,lbl)=>`<span class="m-grup"><span>${lbl}</span>${L.map(([v,ad])=>`<button data-meta="${k}" data-v="${v}" aria-pressed="${AYAR[k]===v}">${ad}</button>`).join('')}</span>`;
  const a=D.alt[D.alt.length-1],ns=NOTLAR_SEKME[D.bolum+':'+D.sekme[D.bolum]],not=NOTLAR[D.bolum];
  const n=a?NOTLAR_ALT[a.tur]:duzenVar()&&Array.isArray(not)?not[dz()-1]:ns||(Array.isArray(not)?null:not);
  $('#meta').innerHTML=`<span class="m-ad">KONSEPT ÖNİZLEME</span>${seg('g',[['gece','Koyu (CM)'],['kagit','Kâğıt']],'Görünüm')}${seg('d',[['kabartma','Düğme'],['duz','Düz']],'Menü')}${seg('gc',[['aninda','Anında'],['kayma','Kayma'],['solma','Solma']],'Geçiş')}${seg('k',[['doldur','Pencereyi doldur'],['kare','4:3']],'Kare')}${seg('saat',[['gunduz','14:30'],['gece','23:40']],'Saat')}
    ${duzenVar()?`<span class="m-grup"><span>Düzen</span>${[1,2].map(i=>`<button data-duzen="${i}" aria-pressed="${dz()===i}">${i}</button>`).join('')}</span>`:''}<button data-meta="not" data-v="${AYAR.not?0:1}" aria-pressed="${!!AYAR.not}">Not</button>${AYAR.not&&n?`<span class="m-not">${esc(n)}</span>`:''}`;
}
function ayarUygula(){const o=$('#oyun');o.dataset.gorunum=AYAR.g;o.dataset.dugme=AYAR.d;o.dataset.kare=AYAR.k;}
function hashYaz(){const a=D.alt[D.alt.length-1];const q=new URLSearchParams({g:AYAR.g,d:AYAR.d,gc:AYAR.gc,k:AYAR.k,b:D.bolum,s:D.sekme[D.bolum]||'',dz:String(dz())});
  if(a){q.set('alt',a.tur+':'+(a.id||''));q.set('as',D.altSekme);}history.replaceState(null,'','#'+q.toString());}
function hashOku(){const q=new URLSearchParams(location.hash.slice(1));if(!q.has('b'))return;
  for(const k of ['g','d','gc','k'])if(q.get(k))AYAR[k]=q.get(k);D.bolum=q.get('b');if(q.get('s'))D.sekme[D.bolum]=q.get('s');if(q.get('dz'))AYAR.dz[D.bolum]=+q.get('dz');
  if(q.get('alt')){const[t,id]=q.get('alt').split(':');D.alt=[{tur:t,id}];D.altSekme=q.get('as')||'genel';}}


/* ======================= K3–K6: kişiler, kademe, bedel, sahne, gece ======================= */
const YETKI_AD={odeme:'100 bin ₺’ye kadar ödemeleri müdür kendi yapar',kasa:'Günlük kasa notu bırakır',genc:'Genç oyuncu raporu hocaya değil bana gelir'};
const yetkiSatirlari=()=>Object.entries(YETKI_AD).map(([k,ad])=>`<button class="dugme yetki" data-ey="yetki" data-v="${k}" aria-pressed="${D.yetki[k]}">${D.yetki[k]?'✓ ':''}${ad}</button>`).join('');
const yukYazi=(id,n)=>`<b>${n} iş</b>${n>=4?' <span class="eksi">· fazla: hepsi yavaşlar, kalite düşer</span>':n>=3?' <span class="soluk">· dolu</span>':''}`;
function kaynakSatiri(tarih,kim,gun){const eski=gun>14;return `<span class="kaynak ${eski?'eski':''}">${esc(kim)} · ${esc(tarih)}${eski?' · eskidi':''}${eski?` <button class="link" data-ey="tazeRapor" data-v="Genel durum">taze rapor iste ▸</button>`:''}</span>`;}
/* örnek ilişki ağı (TEST): tutum yok, olgu var */
const ILISKI=[
  {id:'k-kurul',ad:'Sayman (kurul)',rol:'Yönetim kurulu',kisa:'KRL',sonTemas:'2026-12-01',acik:'Genel kurul hazırlığı',soz:'—',bilgi:['Pazartesi toplantısında konuşur','Gece aramaz, aramayı sevmez'],gece:false,gecmis:[20,25]},
  {id:'k-fed',ad:'Federasyon yetkilisi',rol:'TFF lisans kurulu',kisa:'TFF',sonTemas:'2026-07-20',acik:'—',soz:'Lisans ek süresi (Temmuz)',bilgi:['Ankara’da yumuşar; telefonda resmî','Mesai dışı açmaz'],gece:false,gecmis:[40],git:'Ankara · bir gün · ~2.400 ₺'},
  {id:'k-belediye',ad:'Belediye başkanı',rol:'Belediye',kisa:'BLD',sonTemas:'2026-11-02',acik:'Altyapı sahası sözü',soz:'Altyapı sahası (Ekim)',bilgi:['Bir aydır konuşulmadı','Hatır aramasına açık'],gece:false,gecmis:[35,50]},
  {id:'k-banka',ad:'Şube müdürü',rol:'Banka',kisa:'BNK',sonTemas:'2026-10-14',acik:'—',soz:'—',bilgi:['Krediyi yalnız yüz yüze görüşür','Dosyayı elden ister'],gece:false,gecmis:[],git:'Şubeye git · 2 sa · 0 ₺'},
  {id:'k-gazete',ad:'Yerel Gazete muhabiri',rol:'Basın',kisa:'GZT',sonTemas:'2026-11-28',acik:'Cuma basın toplantısı',soz:'—',bilgi:['Cuma sorar, Cumartesi yazar','Gece de arar'],gece:true,gecmis:[10,8,12]},
  {id:'k-taraftar',ad:'Cengiz',rol:'Taraftar derneği',kisa:'TRF',sonTemas:'2026-07-21',acik:'—',soz:'Kombine indirimi (Temmuz)',bilgi:['Yemekte tanışıldı','Maç günü stat önünde bulunur'],gece:false,gecmis:[60]},
  {id:'k-tarik',ad:'Tarık Yener',rol:'Menajer · forvet',kisa:'TY',sonTemas:'2026-12-04',acik:'Umut (Karaova)',soz:'—',bilgi:['Söylediği sabır: 2 gün · gerçeği öğrenilecek','Gece arar ve açar'],gece:true,gecmis:[6],rehber:true},
  {id:'k-cevdet',ad:'Cevdet Ural',rol:'Menajer · defans',kisa:'CU',sonTemas:'2026-11-23',acik:'—',soz:'—',bilgi:['Pazartesi teleksi gönderir'],gece:true,gecmis:[],rehber:true},
  {id:'k-kocadere',ad:'Kocadere başkanı',rol:'Rakip başkan',kisa:'KOC',kurum:'kocadere',kurumAd:'Kocadere İdman Yurdu',sonTemas:'2026-12-03',acik:'Oğuz teklifi',soz:'—',bilgi:['İlk pazarlık; sabrı bilinmiyor','Telefonda konuşur'],gece:false,gecmis:[],rehber:true},
  {id:'k-karaova',ad:'Karaova başkanı',rol:'Rakip başkan',kisa:'KAR',kurum:'karaova',kurumAd:'Karaova Belediyespor',sonTemas:'—',acik:'Umut pazarlığı',soz:'—',bilgi:['Menajere göre telefonla pazarlık etmez (doğru mu, bilinmiyor)','Hiç görüşülmedi'],gece:false,gecmis:[],rehber:true,git:'Karaova · yarım gün · ~700 ₺'}];
const kisiBul=id=>KISI[id]||ILISKI.find(p=>p.id===id)||null;
const ROL_AD={teknikDirektor:'Teknik direktör',yardimciAntrenor:'Yardımcı antrenör',maliMudur:'Mali işler müdürü',baskan:'Başkan'};
const rolAd=p=>p?(ROL_AD[p.rol]||p.rol||''):'';
const kisiAd=id=>(kisiBul(id)||{}).ad||id;
function ulasilabilir(id){const p=kisiBul(id);if(!p)return{ok:true};if(Z.gece&&!p.gece)return{ok:false,neden:'mesai dışı; sabah okur'};if(Z.gece&&id===HOCA.id)return{ok:false,neden:'gece aramaya kızar'};return{ok:true};}
const SAHNE_KISI={tahsin:YARD.id,hoca:HOCA.id,nusret:MUDUR.id,kocadere:'k-kocadere',karaova:'k-karaova'};
const EKIP_GECMIS={[YARD.id]:[30,20,35],[HOCA.id]:[50,70,40],[MUDUR.id]:[25,30]};
function tahmin(kisiId){const p=kisiBul(kisiId),g=((p&&p.gecmis)||EKIP_GECMIS[kisiId]||[]).concat(D.sahneGecmis[kisiId]||[]);
  if(!g.length)return{yazi:'~20–60 dk',kaynak:'ilk görüşme · özel kalemin tahmini'};const mn=Math.min(...g),mx=Math.max(...g);
  return{yazi:'~'+Math.round(mn*.9)+'–'+Math.round(mx*1.2)+' dk',kaynak:(p&&p.ad||kisiAd(kisiId))+' · geçmişi: '+g.length+' görüşme ('+g.join(', ')+' dk)'};}
function kademeDugmeleri(kisiId,o){o=o||{};const p=kisiBul(kisiId),u=ulasilabilir(kisiId),t=tahmin(kisiId),sahne=o.sahne&&SAHNELER[o.sahne]?o.sahne:null;
  const mesaj=o.sade?'':`<button class="dugme" data-git="telefon" data-kisi="${esc(kisiId)}">Mesaj yaz</button>`;
  const ara=`<button class="dugme" data-ey="aramaYap" data-v="${esc(kisiId)}" ${u.ok?'':'disabled'} title="1. kademe: kısa canlı sahne">Ara · ~5–15 dk${u.ok?'':' · '+esc(u.neden)}</button>`;
  const dis=p&&p.git;
  const cagir=dis?`<button class="dugme ana" data-ey="${sahne?'sahne':'hatir'}" data-v="${esc(sahne||kisiId)}" ${Z.gece?'disabled':''} title="3. kademe">Git · ${esc(p.git)} · ${esc(t.kaynak)}</button>`:
    `<button class="dugme ana" data-ey="${sahne?'sahne':'hatir'}" data-v="${esc(sahne||kisiId)}" ${Z.gece?'disabled':''} title="2. kademe: odada görüşme">Çağır · ${esc(t.yazi)}${Z.gece?' · yarın':''} <small class="soluk">· ${esc(t.kaynak)}</small></button>`;
  return mesaj+ara+cagir;}
function doluluk(){if(Z.gece)return 'Gün bitti · gece çalışıyorsun<br><span class="eksi">sabah 10:00’da başlarsın</span>';const kalan=1200-Z.dk;if(kalan<=0)return 'Gün doldu · 20:00';return `Bugün · <b>${Math.floor(kalan/60)} sa ${kalan%60} dk</b> boş${Z.sahne?' · sahnede '+Z.sahne.sure+' dk':''}`;}
function iliskilerHtml(){
  return `<div class="sayfa"><div class="panel"><div class="p-bas">İlişkiler <small>kurumlar ve kişiler · satıra dokun: kişi sayfası · tutum gösterilmez, olgu gösterilir</small></div><div class="p-kay"><table class="tablo"><thead><tr><th>Kişi / kurum</th><th>Rol</th><th>Son temas</th><th>Açık dosya</th><th>Verilen söz</th><th>Tanıdığın kadarı</th></tr></thead><tbody>${
    ILISKI.map(p=>{const gun=p.sonTemas&&p.sonTemas!=='—'?gunFarki(p.sonTemas,BUGUN):null;return `<tr data-kisi-ac="${p.id}" data-git><td><span class="ad">${p.kurum?arma(p.kurum,1.2):`<span class="kurum">${esc(p.kisa)}</span>`}<span>${esc(p.ad)}</span></span></td><td class="soluk">${esc(p.rol)}</td><td class="${gun!=null&&gun>21?'eksi':''}">${gun==null?'<span class="soluk">hiç</span>':gun===0?'bugün':tKisa(p.sonTemas)+' · '+gun+' gün'}</td><td>${esc(p.acik)}</td><td class="soluk">${esc(p.soz)}</td><td class="soluk">${esc(p.bilgi[0])}</td></tr>`;}).join('')}</tbody></table></div></div></div>`;}
function kisiSayfasi(id){const p=kisiBul(id);if(!p)return '<div class="bos">Kişi yok</div>';const g=((p.gecmis)||[]).concat(D.sahneGecmis[id]||[]),u=ulasilabilir(id);
  const ekip=KISI[id];const sahne=ekip?(id===YARD.id?'tahsin':id===HOCA.id?'hoca':'nusret'):id==='k-kocadere'?'kocadere':id==='k-karaova'?'karaova':null;
  return `<div class="sayfa oy"><div class="panel"><div class="p-ic kisi-kart"><div class="kk-ust">${p.portre?yuz(p.portre,p.ad,'buyuk'):p.kurum?arma(p.kurum,3.2):`<span class="yuz yuz-bos buyuk">${esc(p.kisa||p.ad[0])}</span>`}<div><b>${esc(p.ad)}</b><span class="soluk">${esc(rolAd(p))}${p.kurumAd?' · '+esc(p.kurumAd):''}</span></div></div>
    <dl class="kunye-tablo"><dt>Son temas</dt><dd>${p.sonTemas&&p.sonTemas!=='—'?tUzun(p.sonTemas):'hiç'}</dd><dt>Açık dosya</dt><dd>${esc(p.acik||'—')}</dd><dt>Verilen söz</dt><dd>${esc(p.soz||'—')}</dd><dt>Şu an</dt><dd>${u.ok?'ulaşılabilir':'<span class="eksi">'+esc(u.neden)+'</span>'}</dd></dl>
    <div class="dugmeler">${kademeDugmeleri(id,{sahne})}</div></div></div>
    <div style="display:grid;gap:12px;align-content:start"><div class="panel"><div class="p-bas">Tanıdığın kadarı <small>olgular; tutum yok</small></div><div class="p-ic"><ul class="hb-govde" style="margin:0;padding-left:1.2em">${(p.bilgi||[]).map(b=>`<li>${esc(b)}</li>`).join('')}<li>Görüşme süreleri: ${g.length?g.join(', ')+' dk':'henüz yok'}${(D.sahneGecmis[id]||[]).length?' <span class="cip vurgu">bugün eklendi</span>':''}</li><li>Gece araması: ${p.gece?'açar':'açmaz'}</li></ul></div></div>
    <div class="panel"><div class="p-bas">Kademe ve bedel</div><div class="p-ic soluk" style="line-height:1.5">Mesaj bedava, cevap beklenir. Ara kısa canlı sahne; açmayabilir. Çağır odada görüşme: süre tahmini bu kişinin geçmişinden; ilk görüşmede özel kalemin kaba aralığı. Git yarım gün ve yol; bazı kapılar yalnız yüz yüze açılır (banka, federasyon, rakip başkan).</div></div></div></div>`;}

/* ---------- sahneler: saat kartla akar ---------- */
const SAHNELER={
  tahsin:{tur:'oda',kisi:YARD.id,ad:'Görüşme · Tahsin',kesinti:1,kartlar:[
    {kunye:'Antrenman · Tahsin',soru:'Kadir yorgun başkanım, Murat parlıyor. Hocaya ben mi söyleyeyim?',sol:{ad:'Ben söylerim',sonuc:'Hocanın otoritesi sende kalır; senin sözün ağır basar.',dk:8},sag:{ad:'Sen söyle',sonuc:'Tahsin hocaya gider; hoca bunu yardımcının müdahalesi sayabilir.',dk:6}},
    {kunye:'Sakatlık · Tahsin',soru:'Nail Pazartesi dönüyor. Kampta ayrı program isteyeyim mi?',sol:{ad:'Hocaya bırak',sonuc:'Hoca bilir; sen karışmamış olursun.',dk:5},sag:{ad:'Ayrı program',sonuc:'Nail daha geç ama sağlam döner; hoca söylenebilir.',dk:9}},
    {kunye:'Görüşme · Tahsin',soru:'Başka bir şey var mı?',sol:{ad:'Bugünlük bu kadar',sonuc:'Görüşme biter; süre kısa kalır.',dk:3,bitir:true},sag:{ad:'Oğuz’u da konuşalım',sonuc:'Görüşme uzar; Oğuz’un hâlini öğrenirsin.',dk:12}},
    {kunye:'Soyunma odası · Tahsin',soru:'Oğuz teklifi duymuş; moralsiz, antrenmanda sessiz.',sol:{ad:'Onu çağıracağım',sonuc:'Yarın 16:00 ajandaya yazılır; söz verirsen hatırlar.',dk:4,bitir:true},sag:{ad:'Sen konuş',sonuc:'Tahsin konuşur; etkisi senin kadar değil.',dk:6,bitir:true}}],
    anlik:{kisi:'k-tarik',soru:'Tarık Yener arıyor (menajer). Tahsin karşında.',bak:'Umut için Karaova 900 bine razı; Çarşamba’ya kadar. Tahsin bekledi (+4 dk).',bakma:'Tarık Yener aradı, ulaşılamadı. Mesaj: Umut için Karaova 900 bine razı; Çarşamba’ya kadar.'}},
  hoca:{tur:'oda',kisi:HOCA.id,ad:'Görüşme · Şükrü Hoca',kesinti:-1,kartlar:[
    {kunye:'Kadro · Şükrü Hoca',soru:'Forvete takviye şart başkanım. Kışın bir oyuncu istiyorum.',sol:{ad:'Araştıralım',sonuc:'Transfer dosyası açılır; bütçe kartı yarın.',dk:12},sag:{ad:'Şimdi değil',sonuc:'Hoca bekler ve hatırlar; Mart’ta yeniden açar.',dk:7}},
    {kunye:'Oğuz · Şükrü Hoca',soru:'Oğuz giderse Selçuk oynar; derinlik kalmaz.',sol:{ad:'Oğuz kalıyor',sonuc:'Hoca rahatlar; Kocadere’ye ret.',dk:6,bitir:true},sag:{ad:'Teklif iyiyse satarım',sonuc:'Hoca itiraz eder; kararı sen verirsin.',dk:10,bitir:true}}]},
  nusret:{tur:'oda',kisi:MUDUR.id,ad:'Görüşme · Nusret Bey',kesinti:-1,kartlar:[
    {kunye:'Sponsor · Nusret Bey',soru:'İki firma var; biri eski sponsor, biri yeni. Hangisine ağırlık vereyim?',sol:{ad:'Eski sponsor',sonuc:'Güvenli, düşük rakam.',dk:9},sag:{ad:'Yeni firma',sonuc:'Yüksek rakam, risk; iki hafta sürer.',dk:9}},
    {kunye:'Kredi · Nusret Bey',soru:'Kış dönemi için kısa vadeli kredi ön görüşmesini yapayım mı?',sol:{ad:'Yap',sonuc:'Ön görüşme müdürde; imza için şube müdürü seni ister.',dk:5,bitir:true},sag:{ad:'Gerek yok',sonuc:'Kasa ufkuna güvenirsin.',dk:3,bitir:true}}]},
  kocadere:{tur:'telefon',kisi:'k-kocadere',ad:'Arama · Kocadere başkanı',kesinti:-1,acilmadi:'İlk arama açılmadı; 20 dakika sonra geri aradı.',kartlar:[
    {kunye:'Oğuz · pazarlık',soru:'1,25 milyon teklifiniz için aradım. Ekibim iki rakam önerdi.',sol:{ad:'1,6 milyon',sonuc:'Makul; “düşünürüz” der.',dk:4},sag:{ad:'1,9 milyon',sonuc:'İddialı; sabrı belirsiz.',dk:4}},
    {kunye:'Oğuz · pazarlık',soru:'“Düşüneceğiz.” — Devam edeyim mi?',sol:{ad:'Bugünlük bu kadar',sonuc:'Cevap bekleniyor; saat belirsiz.',dk:2,bitir:true},sag:{ad:'Taksit önereyim',sonuc:'Konuşma uzar; taksit sabrı artırabilir.',dk:5,bitir:true}}]},
  karaova:{tur:'disari',kisi:'k-karaova',ad:'Karaova’nın ofisi · Umut',yol:90,kesinti:3,kartlar:[
    {kunye:'Umut · bedel',soru:'Menajer 900 dedi; başkan 1,1 milyon istiyor. Ekibin rakamları:',sol:{ad:'850 bin',sonuc:'Başkan gülümser, “olmaz” der; sabrı düşer.',dk:12},sag:{ad:'950 bin',sonuc:'Yaklaşır; taksit ister.',dk:12}},
    {kunye:'Umut · taksit',soru:'“İki taksit olur mu?”',sol:{ad:'Peşin, 950',sonuc:'Kasa Ocak’ta sıkışır; başkan memnun.',dk:10},sag:{ad:'İki taksit',sonuc:'Kasa rahat; tescil 4 Ocak.',dk:10}},
    {kunye:'Umut · tescil',soru:'Dönem kapalı; ön anlaşma, Ocak’ta tescil. Sağlık kontrolü?',sol:{ad:'Ocak’ta',sonuc:'Risk: Ocak’a kadar sakatlanabilir.',dk:8},sag:{ad:'Şimdi',sonuc:'Bir gün daha; rapor Perşembe.',dk:8}},
    {kunye:'Umut · kapanış',soru:'Başkan el sıkışmak istiyor.',sol:{ad:'Anlaştık',sonuc:'Ön anlaşma; gazete yarın yazar.',dk:15,bitir:true},sag:{ad:'Düşüneyim',sonuc:'Rakip araya girebilir; dünyada dar transfer.',dk:5,bitir:true}}],
    anlik:{kisi:HOCA.id,soru:'Şükrü Hoca arıyor. Karaova başkanı karşında.',bak:'Kadir antrenmanda sakatlandı, üç hafta. Karaova başkanı bekledi ve “telefonunu kapatmaz” diye hatırladı (+5 dk).',bakma:'Şükrü Hoca aradı, ulaşılamadı. Mesaj: Kadir sakatlandı, üç hafta.'}}};
function sahneAc(id){const S=SAHNELER[id];if(!S)return toast('Bu kişiyle sahne önizlemede yok.');if(Z.gece)return toast('Gece: yarın.');
  Z.sahne={id,i:0,sure:0,bas:Z.dk,log:[],anlik:null,anlikOldu:false,bitti:false};
  if(S.yol){Z.dk+=S.yol;Z.sahne.log.push('Yol: '+S.yol+' dk');}if(S.acilmadi){Z.dk+=20;Z.sahne.log.push(S.acilmadi);}
  Z.sahne.bas=Z.dk;ciz();}
function sahneCevap(yon){const s=Z.sahne;if(!s||s.bitti||s.anlik)return;const S=SAHNELER[s.id],k=S.kartlar[s.i],c=k[yon];
  s.sure+=c.dk;Z.dk+=c.dk;s.log.push(c.ad+' · '+c.dk+' dk');
  if(c.bitir||s.i>=S.kartlar.length-1)sahneBitir();else{s.i++;if(S.kesinti===s.i&&!s.anlikOldu&&S.anlik)s.anlik=S.anlik;}
  ciz();}
function anlikCevap(v){const s=Z.sahne;if(!s||!s.anlik)return;const A=s.anlik,p=kisiBul(A.kisi);s.anlikOldu=true;s.anlik=null;const an=Z.dk;
  if(v==='bak'){s.sure+=4;Z.dk+=4;s.log.push('Telefona baktın: '+p.ad+' · 4 dk');HABERLER.unshift({id:'o-arama'+an,tarih:BUGUN,dk:an,kaynak:{tur:'kisi',id:A.kisi},kat:'transfer',sinif:'okumalik',kanal:'telefon',ornek:1,baslik:p.ad+': '+A.bak,govde:A.bak,kisiId:A.kisi});HB['o-arama'+an]=HABERLER[0];}
  else{s.log.push('Bakmadın: '+p.ad+' mesaj bıraktı');HABERLER.unshift({id:'o-kacan'+an,tarih:BUGUN,dk:an,kaynak:{tur:'kisi',id:A.kisi},kat:'transfer',sinif:'okumalik',kanal:'telefon',ornek:1,kacan:1,baslik:A.bakma,govde:A.bakma,kisiId:A.kisi});HB['o-kacan'+an]=HABERLER[0];}
  ciz();}
function sahneBitir(){const s=Z.sahne,S=SAHNELER[s.id];s.bitti=true;(D.sahneGecmis[S.kisi]=D.sahneGecmis[S.kisi]||[]).push(s.sure);D.yapilan.add(s.id);
  const p=kisiBul(S.kisi);if(p&&!KISI[S.kisi])p.sonTemas=BUGUN;if(S.yol)Z.dk+=S.yol;
  const an=Z.dk;HABERLER.unshift({id:'o-sahne'+an,tarih:BUGUN,dk:an,kaynak:{tur:'kisi',id:S.kisi},kat:'kulup',sinif:'okumalik',kanal:S.tur==='telefon'?'telefon':'kapi',ornek:1,okundu:true,baslik:S.ad+' · '+s.sure+' dk sürdü',govde:'Kartlar: '+s.log.join(' · ')});HB['o-sahne'+an]=HABERLER[0];}
function sahneHtml(){const s=Z.sahne,S=SAHNELER[s.id],p=kisiBul(S.kisi),t=S.tur==='telefon'?{yazi:'~5–15 dk',kaynak:'kısa arama'}:tahmin(S.kisi);
  const baslik=`<div class="sahne-bas"><div><b>${esc(S.ad)}</b><small>${S.tur==='oda'?'Odada · 2. kademe':S.tur==='telefon'?'Telefon · canlı arama':'Dışarıda · 3. kademe · yol '+S.yol+' dk'} · tahmin ${esc(t.yazi)} <span class="soluk">(${esc(t.kaynak)})</span></small></div><div class="sahne-saat"><em>${saat(Z.dk)}</em><small>${s.sure} dk geçti · saat kartla akıyor</small></div></div>`;
  let govde;
  if(s.bitti)govde=`<div class="sahne-ozet"><h3>${S.tur==='telefon'?'Arama bitti':'Görüşme bitti'} · ${s.sure} dk</h3><p>Tahmin ${esc(t.yazi.replace(/^~/,''))} idi; gerçek süre ${esc(p?p.ad:'')}’in geçmişine yazıldı, bir sonraki tahmin daralır.</p><ul>${s.log.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="soluk">Haberler’e satır düştü; şeritteki saat ve günün doluluğu ilerledi.</p><button class="dugme ana" data-ey="sahneKapat">Kapat (Esc)</button></div>`;
  else{const k=S.kartlar[s.i];HB['s:'+s.id+':'+s.i]={id:'s:'+s.id+':'+s.i,son:'—',kart:{kunye:k.kunye,soru:k.soru,kisi:{yuz:p&&p.portre,arma:p&&p.kurum,ad:p?p.ad:'',alt:rolAd(p)},sol:{ad:k.sol.ad,sonuc:k.sol.sonuc+' · '+k.sol.dk+' dk',damga:k.sol.ad},sag:{ad:k.sag.ad,sonuc:k.sag.sonuc+' · '+k.sag.dk+' dk',damga:k.sag.ad}}};
    govde=`<div class="sahne-govde ${s.anlik?'bekliyor':''}">${kartHtml(HB['s:'+s.id+':'+s.i]).replace('son cevap —','kart '+(s.i+1)+'/'+S.kartlar.length)}</div>`+(s.log.length?`<div class="sahne-log">${s.log.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'');}
  const anlik=s.anlik?(()=>{const A=s.anlik,q=kisiBul(A.kisi);HB['anlik']={id:'anlik',son:'—',kart:{kunye:'Telefon çalıyor · kesinti',soru:A.soru,kisi:{yuz:q&&q.portre,ad:q?q.ad:'',alt:rolAd(q)},sol:{ad:'Bak',sonuc:'Sahne durur; karşındaki bekler ve bunu hatırlar.',damga:'Baktın'},sag:{ad:'Bakma',sonuc:'Arayan mesaj bırakır ya da bırakmaz; fırsatsa kaçabilir.',damga:'Bakmadın'}}};
    return `<div class="anlik">${kartHtml(HB['anlik']).replace('son cevap —','← Bak · Bakma →')}</div>`;})():'';
  return `<div class="sahne sahne-${S.tur}">${baslik}${govde}${anlik}</div>`;}
function aramaYap(kisiId){const u=ulasilabilir(kisiId);if(!u.ok)return toast(kisiAd(kisiId)+' açmadı: '+u.neden+'. Haberler’e “aradın, açmadı” satırı düşer.');
  const sahne=Object.keys(SAHNELER).find(k=>SAHNELER[k].tur==='telefon'&&SAHNELER[k].kisi===kisiId);
  if(sahne)return sahneAc(sahne);
  Z.dk+=8;toast(kisiAd(kisiId)+' aradın; 8 dk konuştun (önizlemede bu kişi için kart zinciri yok). Saat ilerledi.');ciz();}

/* ---------- çizim ve olaylar ---------- */
function ciz(gecis){ayarUygula();serit();baslik();sekmeler();icerik(gecis);meta();hashYaz();}
document.addEventListener('click',e=>{
  const b=e.target.closest('button,[data-haber],[data-takim],[data-oyuncu],[data-kadro],[data-kisi],[data-kisi-ac],[data-rapor],[data-gazete],[data-sirala],tr[data-git],.fk-satir[data-ey]');if(!b)return;
  const ds=b.dataset;
  if(ds.meta){AYAR[ds.meta]=ds.meta==='not'?+ds.v:ds.v;if(ds.meta==='saat'){Z.gece=ds.v==='gece';Z.dk=Z.gece?1420:870;Z.sahne=null;}ciz(false);return;}
  if(ds.duzen){AYAR.dz[D.bolum]=+ds.duzen;ciz(true);return;}
  if(ds.git!==undefined&&ds.git!==''){if(ds.kisi)D.kisi=ds.kisi;if(ds.kadro)D.kadroSec=ds.kadro;git(ds.git,ds.gitSekme||null,ds.gitRapor!==undefined?{rapor:isNaN(+ds.gitRapor)?ds.gitRapor:+ds.gitRapor}:null);return;}
  if(ds.sekme){D.sekme[D.bolum]=ds.sekme;D.haber=null;ciz(true);return;}
  if(ds.altSekme){D.altSekme=ds.altSekme;ciz(true);return;}
  if(ds.haber){D.haber=ds.haber;D.okunan.add(ds.haber);ciz();return;}
  if(ds.takim){altAc({tur:'takim',id:ds.takim});return;}
  if(ds.oyuncu&&!ds.ey){altAc({tur:'oyuncu',id:ds.oyuncu});return;}
  if(ds.kadro){if(D.bolum==='kulup'&&D.sekme.kulup==='kadro'&&dz()===2){D.kadroSec=ds.kadro;ciz();}else altAc({tur:'oyuncu',id:ds.kadro});return;}
  if(ds.kisiAc){altAc({tur:'kisi',id:ds.kisiAc});return;}
  if(ds.kisi){D.kisi=ds.kisi;ciz();return;}
  if(ds.rapor!==undefined){D.rapor=isNaN(+ds.rapor)?ds.rapor:+ds.rapor;ciz();return;}
  if(ds.gazete!==undefined){D.gazete=+ds.gazete;ciz();return;}
  if(ds.sirala){D.sirala={a:ds.sirala,y:D.sirala.a===ds.sirala?-D.sirala.y:(ds.sirala==='ad'||ds.sirala==='kulup'?1:-1)};ciz();return;}
  const ey=ds.ey;
  if(ey==='geri')geriDon(-1);else if(ey==='ileri')geriDon(1);
  else if(ey==='altKapat')altKapat();
  else if(ey==='ilerle')toast('Önizlemede zaman akmaz. Oyunda İlerle’den sonra Haberler açılır, yeni satırlar işaretli.');
  else if(ey==='haber'){git('haberler',sayac().cevap?'cevap':'hepsi');}
  else if(ey==='ayar'||ey==='duraklat')toast(ey==='ayar'?'Ayarlar tam ekran sekmeli liste olur (önizlemede yok).':'Duraklat: bütün sahne ve süreler durur.');
  else if(ey==='sonrakiOkunmamis'){const x=HABERLER.find(h=>!okundu(h)&&h.sinif!=='arka'&&h.id!==D.haber);if(x){D.haber=x.id;D.okunan.add(x.id);ciz();}else toast('Okunmamış haber kalmadı.');}
  else if(ey==='hepsiOkundu'){HABERLER.forEach(h=>D.okunan.add(h.id));ciz();}
  else if(ey==='macAc'){if(D.bolum!=='lig'){GECMIS.push(durumKopya());D.bolum='lig';D.alt=[];}altAc({tur:'mac'});}
  else if(ey==='hafta'){D.hafta=Math.max(+Object.keys(V.haftalar)[0],Math.min(+Object.keys(V.haftalar).slice(-1)[0],D.hafta+ +ds.yon));ciz();}
  else if(ey==='ajHafta'){D.ajHafta=Math.max(-1,Math.min(2,D.ajHafta+ +ds.yon));ciz();}
  else if(ey==='takip'){const id=ds.oyuncuId;D.takip.has(id)?D.takip.delete(id):D.takip.add(id);toast(D.takip.has(id)?'Transfer › Hedefler’e eklendi.':'Takipten çıkarıldı.');ciz();}
  else if(ey==='takipEt')toast('Kulüp takipte: maçları ve haberleri Haberler’e düşer.');
  else if(ey==='arastirt')toast('Hocaya soruldu; cevap birkaç saat sonra Haberler’e ve oyuncunun notlarına düşer.');
  else if(ey==='izle')toast('İzlemeye git: zaman ve yol masrafı; ajandaya yazılır.');
  else if(ey==='hocayaSor'){D.kisi=HOCA.id;git('telefon');}
  else if(ey==='gorusIste')toast('Görüşme önerisi tek kart olarak Haberler’e düşer.');
  else if(ey==='yenile')toast('Yenileme görüşmesi: ekip iki rakam önerir, kart iki teklif.');
  else if(ey==='konu')toast('Mesaj gitti; cevap birkaç saat sonra (önizlemede gelmez).');
  else if(ey==='rk'){rk=ds.v;ciz();}else if(ey==='rn'){rn=ds.v;ciz();}
  else if(ey==='raporIste'){const ne=RAPOR_NE.find(x=>x[0]===rn);D.istekler.unshift({id:'i'+D.istekler.length,ad:rk+' (istenen)',ne:rn==='bugun'?'bugün 18:30':rn==='yarin'?'yarın 09:30':'Pazartesi 09:00'});toast(rk+' istendi · '+ne[1].toLowerCase()+'. Raporlar’da “hazırlanıyor”.');ciz();}
  else if(ey==='gorev'){D.gorevler.push(ds.v);toast(ds.v+' görevi verildi; Yürüyen işler’de izlenir.');ciz();}
  else if(ey==='gorusme'){D.gorusme=true;ciz();}
  else if(ey==='ara'){D.ara[ds.k]=D.ara[ds.k]===ds.v?'':ds.v;ciz();}
  else if(ey==='sahne')sahneAc(ds.v);
  else if(ey==='sahneKapat'){Z.sahne=null;ciz();}
  else if(ey==='aramaYap')aramaYap(ds.v);
  else if(ey==='sonraGelsin')toast('Tahsin ertesi uygun günün aynı saatine yazıldı (en çok iki kez).');
  else if(ey==='yetki'){D.yetki[ds.v]=!D.yetki[ds.v];toast(D.yetki[ds.v]?'Yetki kartı verildi: '+YETKI_AD[ds.v]+'. Rutin kartlar kesilir, eşik üstü sana düşer.':'Yetki geri alındı: '+YETKI_AD[ds.v]+'.');ciz();}
  else if(ey==='tazeRapor'){D.istekler.unshift({id:'i'+D.istekler.length,ad:ds.v+' (taze)',ne:'yarın 09:30'});toast(ds.v+' için taze rapor istendi; yarın 09:30. Müdürün yükü arttı.');ciz();}
  else if(ey==='hatir'){toast('Hatır araması: gündemsiz, 5 dk. '+kisiAd(ds.v)+' bunu hatırlar; ileride karşılığı senaryo işi.');Z.dk+=5;const p=kisiBul(ds.v);if(p)p.sonTemas=BUGUN;ciz();}
});
document.addEventListener('input',e=>{if(e.target.id==='araQ'){D.ara.q=e.target.value;const p=e.target.selectionStart;ciz();const i=$('#araQ');if(i){i.focus();i.setSelectionRange(p,p);}}});
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'){if(e.key==='Escape')e.target.blur();return;}
  const kart=gorunenKart();
  if(kart&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){kartOnizle(kart,e.key==='ArrowLeft'?'sol':'sag');e.preventDefault();return;}
  if(kart&&e.key==='Enter'){if(kart.startsWith('s:')||kart==='anlik'){const el=document.querySelector(`.kart[data-kart="${kart}"]`),y=el&&el.dataset.yuz;if(y&&y!=='notr')kartUygula(kart,y);e.preventDefault();return;}const st=D.kartlar[kart];if(st&&st.yuz!=='notr'){kartUygula(kart,st.yuz);e.preventDefault();}return;}
  const B=BOLUMLER.find(b=>b.tus===e.key);if(B&&!e.ctrlKey&&!e.altKey){git(B.id);return;}
  if(e.key==='Escape'){if(Z.sahne&&Z.sahne.bitti){Z.sahne=null;ciz();return;}if(Z.sahne)return;if(!altKapat()&&D.bolum!=='ofis')git('ofis');return;}
  if(e.key==='Backspace'){geriDon(-1);e.preventDefault();return;}
  if(e.key==='['||e.key===']'){const a=D.alt[D.alt.length-1],L=a?ALT_SEKMELER[a.tur]:SEKMELER[D.bolum];if(!L||!L.length)return;const cur=a?D.altSekme:D.sekme[D.bolum],i=L.findIndex(x=>x[0]===cur),j=(i+(e.key===']'?1:-1)+L.length)%L.length;
    if(a)D.altSekme=L[j][0];else{D.sekme[D.bolum]=L[j][0];D.haber=null;}ciz(true);return;}
  if(e.key==='n'&&D.bolum==='haberler'){document.querySelector('[data-ey="sonrakiOkunmamis"]')?.click();return;}
  if(e.key===' '){toast('Önizlemede zaman akmaz.');e.preventDefault();}
});
hashOku();ciz(false);
})();
