/* ============ Chairman — Canlı Skor'un okumaları (saf; çizim yok; R3, 2026-10-29) ============
   Kullanıcının inceleme raporu, 3. madde: “Canlı Skor tarafsız bir futbol uygulamasına dönüşsün” (YOL_HARITASI karar 56, 64). Bu dosya kayıttan
   okur, kayda yazmaz; çizim js/ekran-telefon.js'tedir. Bütün kulüpler aynı biçimde okunur (Demirkapı ayrıcalıksız). Kamuya açık bilgi sınırı
   (OYUN_TASARIMI §9): maaş, sözleşme, sakatlığın dönüş tarihi ve gizli değerler (yetenek, kondisyon, form ya da yerine geçen puan) okunmaz.
     canliDakika(dk, yari) → “45+2'” biçimi (yari yoksa düz dakika)
     canliVarsayilanHafta(k) → maç günü ve sonraki iki gün o hafta; sonra sıradaki hafta; sezon bittiyse son hafta
     canliHafta(k, hafta) → {hafta, ilk, son, tarih, maclar:[{id, ev, konuk, tarih, dakika, durum:'bitti'|'hukmen'|'baslamadi', skor|null}]}
     macSayfasi(k, macId, canli?) → maç sayfasının verisi: başlık (iki takım, skor, devre arası skoru, hafta, tarih, stat), akis (gol, kart,
       değişiklik, sakatlık ve devre ayraçları; dakika yazısıyla), satirlar (macIstSatirlari), kadro (iki takımın dizilişi, ilk on biri, yedekleri,
       değişiklikleri, eksikleri), tablo (o haftanın sonundaki puan durumu), onizleme (oynanmamış maçta son beş ve hoca). canli: {s (motorun
       sonucKaydi() biçimi ya da anlık), tablo, durum} — maç telefonunda o anki maç. Eski kayıtta (R3-a alanları yok) yarı, kadro ve eksik bölümleri
       null döner; çizim “Bu maçın kaydında yok” der.
     takimSayfasi(k, kulupId) → {genel (kulupOzeti), maclar (sezonun maçları), kadro (gözlenebilir sayılar), istatistik (kayıtlı maçlardan)}
     oyuncuSayfasi(k, oyuncuId) → {kimlik, sezon, maclar (oynadığı maçlar: dakika, gol, kart), saglik (maçta görülen sakatlıklar), durum}
     tvOzeti(k) → {kanal, saat, satirlar} RK6: odadaki TV'nin ekranı (çizim js/oda.js odaTvCiz): kanal adı (TEST), saat, son oynanan haftanın skorları (başkanın
       kulübünün maçı önce, en çok iki), puan durumunun ilk üçü ve başkanın kulübünün sırası (ilk üçte değilse). Satırlar canliHafta ve sezonTablosu'ndan; adlar kulübün kısasıyla */
'use strict';
const canliDakika=(dk,yari)=>{dk=dk|0;return(yari===1&&dk>45?'45+'+(dk-45):yari===2&&dk>90?'90+'+(dk-90):String(dk))+"'";};
const CANLI_MEVKI_SIRA={KL:0,DEF:1,OS:2,FV:3};

function canliVarsayilanHafta(k){
  if(!k||!k.sezon||!Array.isArray(k.fikstur)||!k.fikstur.length)return null;
  const H=[...new Set(k.fikstur.map(f=>f.hafta))].sort((a,b)=>a-b),gun=h=>k.fikstur.find(f=>f.hafta===h).tarih;
  for(const h of H){const t=gun(h);if(tarihKarsilastir(k.tarih,t)>=0&&tarihKarsilastir(k.tarih,tarihEkle(t,2))<=0)return h;}
  const s=H.find(h=>tarihKarsilastir(gun(h),k.tarih)>0);
  return s!==undefined?s:H[H.length-1];
}
function canliHafta(k,hafta){
  /* haftaSayisi sezonun son haftasının numarasıdır (13–30); eski Fikstür sekmesi ilk + haftaSayisi − 1'e kadar boş haftalara gidebiliyordu */
  const S=k.sezon,ilk=S.ilkHafta,son=S.haftaSayisi,h=Math.max(ilk,Math.min(son,hafta|0||ilk)),F=haftaFiksturu(k,h);
  return{hafta:h,ilk,son,tarih:F.length?F[0].f.tarih:null,
    maclar:F.map(({f,s})=>({id:f.id,ev:f.ev,konuk:f.konuk,tarih:f.tarih,dakika:f.dakika,durum:s?(s.hukmen?'hukmen':'bitti'):'baslamadi',skor:s?s.skor.slice():null}))};
}
/* sezon sayaçları kadro dosyasıyla aynı okunur (js/kadro-dosyasi.js): maç ve dakika sayacı eski kayıtta yoksa null (“—”); kırmızı kart oyuncu
   kaydında tutulmaz, maç kayıtlarından sayılır */
const canliSayi=v=>Number.isInteger(v)?v:null;
const canliKirmizilar=k=>typeof kadroKirmizilari==='function'?kadroKirmizilari(k):new Map();
/* kulübün oyuncusu adla (canlı kayıt kimlik taşımayabilir) */
const canliAdla=(k,kulupId,ad)=>{const L=kulupOyunculari(k,kulupId).filter(p=>p.ad===ad);return L.length===1?L[0].id:null;};
const canliOyuncu=(k,id)=>{const p=(k.oyuncular||{})[id];return p?{id:p.id,no:p.no|0,ad:p.ad,mevki:p.mevki}:null;};

function tvOzeti(k){
  const bos={kanal:'TEST SPOR',saat:saatYazi((k&&k.gunIciDakika)|0),satirlar:[]};
  if(!k||!k.sezon||!Array.isArray(k.fikstur)||!k.fikstur.length)return bos;
  const biz=((k.kisiler||{})[k.baskanId]||{}).kulupId||null,kisa=id=>((k.kulupler||{})[id]||{}).kisa||String(id).slice(0,3).toLocaleUpperCase('tr-TR');
  const oynanan=[...new Set(k.fikstur.filter(f=>(k.maclar||{})[f.id]).map(f=>f.hafta))].sort((a,b)=>a-b),h=oynanan[oynanan.length-1],S=[];
  if(h!==undefined){const bizde=m=>m.ev===biz||m.konuk===biz?1:0,M=canliHafta(k,h).maclar.filter(m=>m.skor).sort((a,b)=>bizde(b)-bizde(a));
    S.push(h+'. HAFTA');for(const m of M.slice(0,2))S.push(kisa(m.ev)+' '+m.skor[0]+'-'+m.skor[1]+' '+kisa(m.konuk));}
  else{/* kariyerde henüz oynanmış hafta yok: sıradaki haftanın maçları (başkanın kulübünün maçı önce) */
    const hv=canliVarsayilanHafta(k),bizde=m=>m.ev===biz||m.konuk===biz?1:0;
    if(hv!==null){S.push(hv+'. HAFTA');for(const m of canliHafta(k,hv).maclar.slice().sort((a,b)=>bizde(b)-bizde(a)).slice(0,2))S.push(kisa(m.ev)+' - '+kisa(m.konuk));}}
  const T=sezonTablosu(k),i=T.findIndex(t=>t.id===biz),U=T.slice(0,3).map((t,j)=>(j+1)+' '+kisa(t.id)+' '+t.P);
  S.push(U.slice(0,2).join(' · '));
  if(U[2])S.push(U[2]+(i>=3?' · '+(i+1)+' '+kisa(biz)+' '+T[i].P:''));
  return{kanal:'TEST SPOR',saat:saatYazi(k.gunIciDakika|0),satirlar:S.slice(0,5)};
}
function macSayfasi(k,macId,canli){
  const f=(k.fikstur||[]).find(x=>x.id===macId);if(!f)return null;
  const s=canli?canli.s:(k.maclar||{})[macId]||null,st=typeof kulupStatTarifi==='function'?kulupStatTarifi(k,f.ev):null;
  const R={id:f.id,hafta:f.hafta,tarih:f.tarih,dakika:f.dakika,ev:f.ev,konuk:f.konuk,stat:st?st.ad:null,canli:!!canli,
    durum:canli?canli.durum||'canli':s?(s.hukmen?'hukmen':'bitti'):'baslamadi',skor:s?s.skor.slice():null,hukmen:s&&s.hukmen||null,
    iy:null,akis:[],satirlar:[],kadro:null,tablo:null,onizleme:null};
  const sonAn=anDakika(tarihEkle(f.tarih,1),0);
  if(!s){
    R.onizleme=[f.ev,f.konuk].map(c=>{const o=kulupOzeti(k,c);return o?{son:o.son,hoca:o.hoca,sira:o.sira,P:o.P}:null;});
    R.tablo=sezonTablosu(k,anDakika(f.tarih,f.dakika));return R;
  }
  R.tablo=canli&&canli.tablo?canli.tablo:sezonTablosu(k,sonAn);
  if(s.hukmen)return R;
  const L=a=>Array.isArray(a)?a:[],ad=x=>x.ad||(x.id!=null?(k.oyuncular[x.id]||{}).ad:'')||'—',kulup=t=>t===0?f.ev:f.konuk;
  /* yeni biçim: olaylar devre taşır (R3-a); canlı kayıt da taşır */
  const olaylar=[...L(s.goller),...L(s.kartlar),...L(s.sakatliklar),...L(s.degisiklikler)];
  const yeni=canli||s.dizilis!==undefined||olaylar.some(o=>o.yari===1||o.yari===2);
  const yariOf=o=>o.yari===1||o.yari===2?o.yari:null,dk=o=>(o.dakika!=null?o.dakika:o.dk)|0;
  const A=[],sira={gol:0,kart:1,sakatlik:2,degisiklik:3};
  for(const g of L(s.goller))A.push({tur:'gol',t:g.takim===1?1:0,yari:yariOf(g),dk:dk(g),ad:ad(g),kk:!!(g.kendiKalesine!=null?g.kendiKalesine:g.kk)});
  for(const c of L(s.kartlar))A.push({tur:'kart',t:c.takim===1?1:0,yari:yariOf(c),dk:dk(c),ad:ad(c),renk:c.renk});
  for(const x of L(s.sakatliklar))if(x.derece!=='agri')A.push({tur:'sakatlik',t:x.takim===1?1:0,yari:yariOf(x),dk:dk(x),ad:ad(x),derece:x.derece,
    bolge:typeof sakatlikMetni==='function'?sakatlikMetni(x.tur,x.bolge):''});
  for(const d of L(s.degisiklikler)){const t=d.takim===1?1:0;
    A.push({tur:'degisiklik',t,yari:yariOf(d),dk:dk(d),giren:d.giren||(k.oyuncular[d.girenId]||{}).ad||'—',cikan:d.cikan||(k.oyuncular[d.cikanId]||{}).ad||'—',
      girenId:d.girenId||canliAdla(k,kulup(t),d.giren),cikanId:d.cikanId||canliAdla(k,kulup(t),d.cikan),sakatlik:!!d.sakatlik});}
  const anahtar=o=>((o.yari||(o.dk>45?2:1))*1000+o.dk)*10+sira[o.tur];
  A.sort((a,b)=>anahtar(a)-anahtar(b));
  /* koşan skor ve dakika yazısı */
  const sk=[0,0];for(const o of A){o.yazi=canliDakika(o.dk,o.yari);if(o.tur==='gol'){sk[o.t]++;o.skor=sk.slice();}}
  if(yeni){
    const iy=[0,1].map(t=>L(s.goller).filter(g=>(g.takim===1?1:0)===t&&yariOf(g)===1).length);
    R.iy=iy;const i=A.findIndex(o=>o.yari===2);
    const ayrac={tur:'devre',skor:iy.slice()};
    if(i<0){if(!canli||canli.durum==='bitti'||canli.ikinciYari)A.push(ayrac);}else A.splice(i,0,ayrac);
  }
  if(!canli||canli.durum==='bitti')A.push({tur:'bitis',skor:s.skor.slice()});
  R.akis=A;
  const xg=Array.isArray(s.sutlar)&&typeof macBeklenenGol==='function'?macBeklenenGol(s.sutlar):Array.isArray(s.xg)?s.xg.slice():[0,0];
  R.satirlar=typeof macIstSatirlari==='function'?macIstSatirlari(s.ist,xg):[];
  /* kadrolar (R3-a alanları; eski kayıtta on bir var, yedek ve eksik yok) */
  if(Array.isArray(s.ilk11)){
    R.kadro=[0,1].map(t=>{
      const D=L(s.degisiklikler).filter(d=>(d.takim===1?1:0)===t),ilk=L(s.ilk11[t]).map(id=>canliOyuncu(k,id)).filter(Boolean);
      return{dizilis:Array.isArray(s.dizilis)?s.dizilis[t]||null:null,ilk,
        yedek:Array.isArray(s.yedek)&&Array.isArray(s.yedek[t])?s.yedek[t].map(id=>canliOyuncu(k,id)).filter(Boolean):null,
        degisiklik:A.filter(o=>o.tur==='degisiklik'&&o.t===t).map(o=>({yazi:o.yazi,giren:o.giren,girenId:o.girenId,cikan:o.cikan,cikanId:o.cikanId,sakatlik:o.sakatlik})),
        eksik:Array.isArray(s.eksik)&&Array.isArray(s.eksik[t])?s.eksik[t].map(x=>Object.assign(canliOyuncu(k,x.id)||{id:x.id,ad:'—'},{tur:x.tur})):null,
        oyunaGiren:D.length};});
  }
  return R;
}

function takimSayfasi(k,kulupId){
  const o=typeof kulupOzeti==='function'?kulupOzeti(k,kulupId):null;if(!o)return null;
  /* devralınan haftalar (sezonun ilk haftasından önce) kayıtta yok: yalnız tabloda ve son beşte */
  const F=(k.fikstur||[]).filter(f=>(f.ev===kulupId||f.konuk===kulupId)&&f.hafta>=k.sezon.ilkHafta).sort((a,b)=>a.hafta-b.hafta);
  const maclar=F.map(f=>{const s=(k.maclar||{})[f.id],ev=f.ev===kulupId;
    return{id:f.id,hafta:f.hafta,tarih:f.tarih,dakika:f.dakika,rakip:ev?f.konuk:f.ev,yer:ev?'i':'d',a:s?s.skor[ev?0:1]:null,y:s?s.skor[ev?1:0]:null,hukmen:s&&s.hukmen||null};});
  const sakatMi=p=>!!(p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)>0),cezaliMi=p=>!!(p.ceza&&p.ceza.mac>0);
  const K=canliKirmizilar(k);
  const kadro=kulupOyunculari(k,kulupId).map(p=>({id:p.id,no:p.no|0,ad:p.ad,mevki:p.mevki,yas:oyuncuYasi(p,k.tarih),mac:canliSayi(p.mac),dk:canliSayi(p.dk),
    gol:p.gol|0,sari:p.sari|0,kirmizi:K.get(p.id)||0,durum:sakatMi(p)?'sakat':cezaliMi(p)?'cezali':null}))
    .sort((a,b)=>(CANLI_MEVKI_SIRA[a.mevki]-CANLI_MEVKI_SIRA[b.mevki])||(a.no-b.no));
  let n=0,xgL=0,xgA=0,sut=0,isabet=0,sah=0,nSah=0,sari=0,kirmizi=0;
  for(const m of maclar){const s=(k.maclar||{})[m.id];if(!s||s.hukmen||!s.ist)continue;const t=m.yer==='i'?0:1;n++;
    const xg=Array.isArray(s.sutlar)&&typeof macBeklenenGol==='function'?macBeklenenGol(s.sutlar):Array.isArray(s.xg)?s.xg:[0,0];
    xgL+=+xg[t]||0;xgA+=+xg[1-t]||0;sut+=s.ist.sut[t]|0;isabet+=s.ist.isabet[t]|0;sari+=s.ist.sari[t]|0;kirmizi+=s.ist.kirmizi[t]|0;
    if(Array.isArray(s.ist.sahiplik)){sah+=+s.ist.sahiplik[t]||0;nSah++;}}
  const r2=x=>Math.round(x*100)/100;
  return{genel:o,maclar,kadro,istatistik:{kayitli:n,A:o.A,Y:o.Y,O:o.O,xgLehte:r2(xgL),xgAleyhte:r2(xgA),sut,isabet,sahiplik:nSah?Math.round(sah/nSah*100):null,sari,kirmizi,
    golculer:typeof golSiralamasi==='function'?golSiralamasi(k,{kulupId,enCok:5}):[]}};
}

function oyuncuSayfasi(k,id){
  const p=(k.oyuncular||{})[id];if(!p)return null;
  const maclar=[],saglik=[];
  for(const f of k.fikstur||[]){const s=(k.maclar||{})[f.id];if(!s||s.hukmen||!Array.isArray(s.ilk11))continue;
    const T=[0,1].find(t=>(s.ilk11[t]||[]).includes(id)||(s.degisiklikler||[]).some(d=>(d.takim===1?1:0)===t&&d.girenId===id));
    if(T===undefined)continue;
    const dk=typeof macDakikalari==='function'?macDakikalari(k,f,s).get(id)||0:0;
    maclar.push({id:f.id,hafta:f.hafta,tarih:f.tarih,rakip:T===0?f.konuk:f.ev,yer:T===0?'i':'d',a:s.skor[T],y:s.skor[1-T],dk,
      gol:(s.goller||[]).filter(g=>g.id===id&&!g.kk).length,kartlar:(s.kartlar||[]).filter(c=>c.id===id).map(c=>c.renk)});
    for(const x of s.sakatliklar||[])if(x.id===id&&x.derece!=='agri')saglik.push({macId:f.id,hafta:f.hafta,tarih:f.tarih,rakip:T===0?f.konuk:f.ev,
      yazi:canliDakika(x.dk,x.yari),bolge:typeof sakatlikMetni==='function'?sakatlikMetni(x.tur,x.bolge):'',derece:x.derece});
  }
  const sakat=!!(p.sakat&&tarihKarsilastir(p.sakat.donus,k.tarih)>0),cezali=!!(p.ceza&&p.ceza.mac>0);
  return{id,ad:p.ad,no:p.no|0,mevki:p.mevki,yas:oyuncuYasi(p,k.tarih),ayak:p.ayak||null,kulupId:p.kulupId,kulup:(k.kulupler[p.kulupId]||{ad:p.kulupId}).ad,
    sezon:{mac:canliSayi(p.mac),dk:canliSayi(p.dk),gol:p.gol|0,sari:p.sari|0,kirmizi:canliKirmizilar(k).get(id)||0},maclar,saglik,durum:sakat?'sakat':cezali?'cezali':null};
}
