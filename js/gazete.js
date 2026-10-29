/* ============ Chairman — günlük gazete: her sabah 08:00'de bir sayı, kayıttan yeniden kurulur (S-e, 2026-10-27; DOM yok) ============
   Kullanıcı kararı (2026-10-27): gazete haftalık değil günlüktür; “dev haberler” orada, akışın gerisi telefon, TV ve gelip konuşanlarla gelir (sonraki
   kanallar). Bugün metinler kısa TEST yer tutucularıdır; içerik yoksa sayı boş kalır (“TEST: bugün haber yok”).
   Sayı saklanmaz: gazeteSayisi(k, tarih) o günün sayısını kariyerin kayıtlı geçmişinden (maçlar, fikstür, geçmiş, haber kayıtları) her seferinde aynı
   kurar; kayda yalnız k.gazeteOkunan (son okunan sayının tarihi) girer. Kaynaklar js/soz.js GAZETE_KAYNAKLARI'ndadır; içerik paketleri ekler
   (js/icerik-p12.js hoca değişimi, js/transfer.js transfer).
     gazetePenceresi(tarih)     → {bas, son}: [dün 08:00, bugün 08:00) (anDakika)
     gazeteSonTarihi(k)         son sayının tarihi: 08:00 geçtiyse bugün, geçmediyse dün; arşivin başından (BASLANGIC_TARIHI) önce null
     haberAkisi(k, bas, son, tarih) kaynakların haberleri: önem ↓, an ↑, kaynak sırası, kaynak içi sıra; her haberde metin (okurken)
     gazeteSayisi(k, tarih)     → {tarih, no, gunAdi, manset, haberler, kutular, kalin, ince, kisa, bos} ya da null (arşiv dışı). En çok
                                  GAZETE_TEST.enCok haber (kalın sayıda kalinEnCok). U5 (kullanıcı onayı, u-arayuz §3.2): kutular (puan durumu, gol
                                  sıralaması) manşet olmaz; haberler önce kutusuzlar (önem sırası, manşet ilki), sonra kutular. kalin: pencerede başkanın
                                  kulübünün oynanmış maçı var; bos: haber yok (tek satır gz.bos); kisa: yalnız kutu var (manşet gz.kisa, kutular içeride);
                                  ince: öbürleri. Her haberde etiket (türün adı: GAZETE_ETIKET; kutularda kutunun başlığı)
     gazeteOkundu(k, tarih)     yalnız son sayı için k.gazeteOkunan = tarih (komut)
     gazeteDogrula              gazeteOkunan yok, null ya da k.tarih'ten ileri olmayan geçerli tarih (EK_DENETIMLER)
   Önemler ve eşikler TEST'tir (s-uygulama.md S-e tablosu). */
'use strict';
const GAZETE_TEST={ad:'Yerel Gazete (TEST)',enCok:6,kalinEnCok:8,yaklasan:3,sakatBiz:7,sakatObur:14,golcu:3,tablo:3};
/* eski kayıtlarda haber kaydı olarak duran, bugün geçmişten kurulan haberler (gazetede iki kez çıkmasın) */
const GAZETE_ESKI_ANAHTAR=['p12.haber','tr.haber'];
/* U5: haberin türü (gazetede başlığın üstündeki küçük etiket; kutuda kutunun başlığı). TEST; listede yoksa 'Kulüp' */
const GAZETE_ETIKET={'gz.mac':'Maç','gz.sonuclar':'Lig','gz.tablo':'Puan durumu','gz.golcu':'Gol krallığı','gz.sakat':'Sakatlık','gz.yaklasan':'Maç günü',
  'gz.sezonSonu':'Sezon','gz.bos':'','gz.kisa':'','p12.haber':'Kulüp','tr.haber':'Transfer','tr.dunya':'Transfer','tr.soylenti':'Kulis'};
const gazeteBasi=()=>typeof BASLANGIC_TARIHI!=='undefined'?BASLANGIC_TARIHI:null;
const gazetePenceresi=tarih=>({bas:anDakika(tarihEkle(tarih,-1),GUN_BASLANGICI),son:anDakika(tarih,GUN_BASLANGICI)});
function gazeteSonTarihi(k){
  if(!tarihGecerliMi(k.tarih)||!Number.isInteger(k.gunIciDakika))return null;
  const t=k.gunIciDakika>=GUN_BASLANGICI?k.tarih:tarihEkle(k.tarih,-1),b=gazeteBasi();
  return b&&tarihKarsilastir(t,b)>=0?t:null;
}
function haberAkisi(k,bas,son,tarih){
  const biz=(k.kisiler[k.baskanId]||{}).kulupId,P={tarih:tarih||anTarih(son).tarih,bas,son,biz},L=[];
  GAZETE_KAYNAKLARI.forEach((Q,qi)=>{(Q.haberler(k,P)||[]).forEach((h,i)=>{if(h&&h.an>=bas&&h.an<son&&MESELE_OLAYLARI[h.anahtar])L.push({h,qi,i});});});
  L.sort((a,b)=>b.h.onem-a.h.onem||a.h.an-b.h.an||a.qi-b.qi||a.i-b.i);
  return L.map(({h})=>Object.assign({},h,{metin:MESELE_OLAYLARI[h.anahtar](k,h.p||{})}));
}
function gazeteSayisi(k,tarih){
  const son=gazeteSonTarihi(k),b=gazeteBasi();
  if(!son||!tarihGecerliMi(tarih)||tarihKarsilastir(tarih,b)<0||tarihKarsilastir(tarih,son)>0)return null;
  const W=gazetePenceresi(tarih),biz=(k.kisiler[k.baskanId]||{}).kulupId;
  const kalin=(k.fikstur||[]).some(f=>(f.ev===biz||f.konuk===biz)&&(k.maclar||{})[f.id]&&anDakika(f.tarih,f.dakika)>=W.bas&&anDakika(f.tarih,f.dakika)<W.son);
  const A=haberAkisi(k,W.bas,W.son,tarih).slice(0,kalin?GAZETE_TEST.kalinEnCok:GAZETE_TEST.enCok)
    .map(h=>Object.assign(h,{etiket:GAZETE_ETIKET[h.anahtar]!==undefined?GAZETE_ETIKET[h.anahtar]:'Kulüp'}));
  const D=A.filter(h=>!h.kutu),K=A.filter(h=>h.kutu),bos=!A.length,kisa=!bos&&!D.length;
  const ozel=a=>({onem:0,an:W.bas,anahtar:a,p:{},etiket:'',metin:MESELE_OLAYLARI[a](k,{})});
  const H=bos?[ozel('gz.bos')]:kisa?[ozel('gz.kisa')].concat(K):D.concat(K);
  return{tarih,no:gunNo(tarih)-gunNo(b)+1,gunAdi:macGunAdi(tarih),manset:H[0],haberler:H,kutular:K,kalin,ince:!kalin&&!bos&&!kisa,kisa,bos};
}
function gazeteOkundu(k,tarih){if(tarih&&tarih===gazeteSonTarihi(k))k.gazeteOkunan=tarih;}
function gazeteDogrula(k,h){
  const g=k.gazeteOkunan;if(g===undefined||g===null)return;
  if(!tarihGecerliMi(g)||(tarihGecerliMi(k.tarih)&&tarihKarsilastir(g,k.tarih)>0))h.push(`Gazete: okunan sayı geçersiz (${g})`);
}
EK_DENETIMLER.push(gazeteDogrula);

/* ---- çekirdek kaynaklar (önemler TEST) ---- */
const gzAd=(k,id)=>(k.kulupler[id]||{ad:id}).ad;
const gzSkor=(k,f)=>{const s=k.maclar[f.id];return`${gzAd(k,f.ev)} ${s.skor[0]}–${s.skor[1]} ${gzAd(k,f.konuk)}`;};
const gzPenceredeMaclar=(k,P)=>(k.fikstur||[]).filter(f=>(k.maclar||{})[f.id]&&anDakika(f.tarih,f.dakika)>=P.bas&&anDakika(f.tarih,f.dakika)<P.son);
GAZETE_KAYNAKLARI.push(
  /* maç: penceredeki bizim maç (manşet) ve öbür sonuçlar (tek haber) */
  {ad:'mac',haberler:(k,P)=>{
    const M=gzPenceredeMaclar(k,P),biz=M.filter(f=>f.ev===P.biz||f.konuk===P.biz),obur=M.filter(f=>f.ev!==P.biz&&f.konuk!==P.biz),L=[];
    for(const f of biz)L.push({onem:100,an:anDakika(f.tarih,f.dakika),anahtar:'gz.mac',p:{macId:f.id}});
    if(obur.length)L.push({onem:50,an:anDakika(obur[0].tarih,obur[0].dakika),anahtar:'gz.sonuclar',p:{macIdler:obur.map(f=>f.id)}});
    return L;}},
  /* puan durumu: maç ertesi (pencerede lig maçı oynandıysa) ve Pazartesi; sayının anındaki tablo */
  {ad:'tablo',haberler:(k,P)=>{
    if(!k.sezon||!k.sezon.devralinan)return[];
    const mac=gzPenceredeMaclar(k,P).length>0,pzt=macGunAdi(P.tarih)==='Pazartesi';if(!mac&&!pzt)return[];
    const T=sezonTablosu(k,P.son),i=T.findIndex(t=>t.id===P.biz);
    return[{onem:mac?45:25,an:P.son-1,anahtar:'gz.tablo',kutu:true,p:{ilk:T.slice(0,GAZETE_TEST.tablo).map(t=>[t.ad,t.P]),biz:i>=0?[T[i].ad,i+1,T[i].P]:null}}];}},
  /* gol sıralaması: maç ertesi */
  {ad:'golcu',haberler:(k,P)=>{
    if(!gzPenceredeMaclar(k,P).length)return[];
    const L=golSiralamasi(k,{sonAn:P.son,enCok:GAZETE_TEST.golcu});
    return L.length?[{onem:35,an:P.son-1,anahtar:'gz.golcu',kutu:true,p:{L:L.map(x=>[x.ad,gzAd(k,x.kulupId),x.gol])}}]:[];}},
  /* sakatlık: penceredeki maçlarda bizim oyuncu en az 7, öbür kulüpten en az 14 gün (ağrı ve kramp değil); kulüp maçtaki taraftır */
  {ad:'sakat',haberler:(k,P)=>{
    const L=[];
    for(const f of gzPenceredeMaclar(k,P))for(const x of k.maclar[f.id].sakatliklar||[]){
      if(!x.id||!(x.derece==='tedavi'||x.derece==='cikis')||x.tur==='kramp')continue;
      const c=x.takim===0?f.ev:f.konuk,bizden=c===P.biz;if(x.gun<(bizden?GAZETE_TEST.sakatBiz:GAZETE_TEST.sakatObur))continue;
      L.push({onem:bizden?60:25,an:anDakika(f.tarih,f.dakika)+(x.dk|0),anahtar:'gz.sakat',p:{oyuncuId:x.id,kulupId:c,gun:x.gun}});}
    return L;}},
  /* yaklaşan maç: bizim maç bugünse (80) ya da 1–3 gün sonraysa (20). Sayının anına göre (sonra oynanmış olsa da): başlaması sayının anından sonra olan ilk maç */
  {ad:'yaklasan',haberler:(k,P)=>{
    const f=(k.fikstur||[]).filter(x=>(x.ev===P.biz||x.konuk===P.biz)&&anDakika(x.tarih,x.dakika)>=P.son).sort((a,b)=>anDakika(a.tarih,a.dakika)-anDakika(b.tarih,b.dakika))[0];
    if(!f)return[];const n=gunNo(f.tarih)-gunNo(P.tarih);if(n>GAZETE_TEST.yaklasan)return[];
    return[{onem:n===0?80:20,an:P.son-1,anahtar:'gz.yaklasan',p:{macId:f.id,gun:n}}];}},
  /* sezon sonu kaydı */
  {ad:'sezonSonu',haberler:(k,P)=>(k.gecmis||[]).filter(g=>g.tur==='sezonSonu').map(g=>({onem:120,an:anDakika(g.tarih,g.dakika),anahtar:'gz.sezonSonu',p:{sira:g.sira,puan:g.puan,sampiyon:g.sampiyon}}))},
  /* haber kayıtları (k.haberler gazete türü; geçmişten kurulanlar hariç) */
  {ad:'kayit',haberler:(k,P)=>(k.haberler||[]).filter(h=>h.tur==='gazete'&&!GAZETE_ESKI_ANAHTAR.includes(h.anahtar)).map(h=>({onem:40,an:anDakika(h.tarih,h.dakika),anahtar:h.anahtar,p:h.p,
    meseleId:h.olayId&&k.olaylar[h.olayId]?k.olaylar[h.olayId].meseleId:undefined}))}
);
/* TEST metinleri (kullanıcı değiştirir) */
Object.assign(MESELE_OLAYLARI,{
  'gz.bos':()=>'TEST: bugün haber yok.',
  'gz.kisa':()=>'TEST: sakin bir gün; tablolar içeride.',
  'gz.mac':(k,p)=>{const f=(k.fikstur||[]).find(x=>x.id===p.macId),s=f&&k.maclar[f.id];return f&&s?`TEST: ${f.hafta}. hafta: ${gzSkor(k,f)}.`:'TEST: maç sonucu.';},
  'gz.sonuclar':(k,p)=>'TEST: Haftanın öbür sonuçları: '+(p.macIdler||[]).map(id=>{const f=(k.fikstur||[]).find(x=>x.id===id);return f&&k.maclar[id]?gzSkor(k,f):null;}).filter(Boolean).join(' · ')+'.',
  'gz.tablo':(k,p)=>'TEST: Puan durumunda ilk '+p.ilk.length+': '+p.ilk.map(([a,P])=>`${a} ${P}`).join(', ')+'.'+(p.biz?` ${p.biz[0]} ${p.biz[1]}. sırada (${p.biz[2]} puan).`:''),
  'gz.golcu':(k,p)=>'TEST: Gol sıralaması: '+p.L.map(([a,c,g])=>`${a} (${c}) ${g}`).join(', ')+'.',
  'gz.sakat':(k,p)=>`TEST: ${gzAd(k,p.kulupId)}'da ${(k.oyuncular[p.oyuncuId]||{ad:'—'}).ad} sakatlandı; yaklaşık ${p.gun} gün yok.`,
  'gz.yaklasan':(k,p)=>{const f=(k.fikstur||[]).find(x=>x.id===p.macId);if(!f)return'TEST: maç yaklaşıyor.';const m=`${gzAd(k,f.ev)} – ${gzAd(k,f.konuk)} (${saatYazi(f.dakika)})`;
    return p.gun===0?`TEST: Bugün ${m}.`:`TEST: ${p.gun} gün sonra ${macGunAdi(f.tarih)}: ${m}.`;},
  'gz.sezonSonu':(k,p)=>`TEST: Sezon bitti; şampiyon ${gzAd(k,p.sampiyon)}.`+(p.sira?` ${gzAd(k,(k.kisiler[k.baskanId]||{}).kulupId)} ${p.sira}. sırada bitirdi (${p.puan} puan).`:'')
});
