/* ============ Chairman — pazarlık: ekibin iki rakamı, karşı tarafın gizli sınırı ve sabrı (çizim yok; R4-b, 2026-10-29) ============
   Kullanıcı kararı (2026-10-26): rakam çarkı yok, başkan rakam girmez; ekip iki rakam önerir, kartın iki yüzü bu iki tekliftir; karşı tarafın gizli
   alt sınırı ve sabrı vardır; cevap sonraki kartta gelir (OYUN_TASARIMI §2 “Pazarlık”). Şablonlu dosyanın verisinde kalem başına durum:
     m.sablon.veri.pazarlik[kalem] = {alt, sabir, tur, son, karsi, rakamlar, oneren, yon}
       alt ve sabır gizlidir (kayıtta durur, hiçbir ekranda sayı olarak görünmez). son: başkanın son teklifi. karsi: karşı tarafın son sözü (açık; dosyada).
       rakamlar: o turun iki önerisi [temkinli, güçlü]. oneren: rakamları öneren kişi (yoksa null: başkanın kendi tahmini). yon: 'odeme' (biz öderiz:
       bonservis, maaş) — teklif alt sınırın ÜSTÜNDEYSE kabul.
   pazarlikKur(k, m, kalem, {deger, oneren, konu, tavan?})   alt = değer × çekiliş [altSinir], sabır [2, 3]; oneren ve konu (gizli yetenek konusu)
   pazarlikRakamlari(k, m, kalem) → [a, b]   ilk tur: önerenin tahmini (sapma gizli yetenekle daralır) × 0,90 ve × 1,05; karşı tekliften sonra
                                             son teklifle karşı rakam arasında (%35 ve %75); tavan varsa aşmaz
   pazarlikCevap(k, m, kalem) → 'kabul' | 'karsi' | 'kopma'   son ≥ alt kabul; değilse sabır −1 (son < alt × 0,75 ise −2), sabır kaldıysa karşı rakam alt × 1,1
   pazarlikBekledi(k, m, kalem) → 'bekliyor' | 'kopma'       cevapsız kart: sabır −1; aynı rakamlar yeniden (“Hâlâ bekliyorum”)
   Bütün çekilişler belirlenimci (kadroRastgele(dünyaTohumu, 'pazarlik:<mesele>:<kalem>:…')). Sayılar TEST. */
'use strict';
const PAZARLIK_TEST={altSinir:[0.85,1.25],sabir:[2,3],sapma:{iyi:0.05,zayif:0.25},kat:{temkinli:0.90,guclu:1.05},ara:[0.35,0.75],karsiKat:1.1,sertEsik:0.75,yuvarla:1000000};
const pazarlikYuvarla=(x,y)=>Math.max(y,Math.round(x/y)*y);
function pazarlikKur(k,m,kalem,o){
  const T=PAZARLIK_TEST,r=kadroRastgele(k.dunyaTohumu,'pazarlik:'+m.id+':'+kalem+':kur'),y=o.yuvarla||T.yuvarla;
  const P={alt:pazarlikYuvarla(o.deger*(T.altSinir[0]+(T.altSinir[1]-T.altSinir[0])*r()),y),sabir:T.sabir[0]+Math.floor(r()*(T.sabir[1]-T.sabir[0]+1)),
    tur:0,son:null,karsi:null,rakamlar:null,oneren:o.oneren||null,konu:o.konu||kalem,yuvarla:y,tavan:o.tavan||null};
  const V=m.sablon.veri;V.pazarlik=Object.assign({},V.pazarlik||{},{[kalem]:P});
  return P;
}
const pazarlikDurumu=(m,kalem)=>((m.sablon.veri.pazarlik||{})[kalem])||null;
function pazarlikRakamlari(k,m,kalem){
  const T=PAZARLIK_TEST,P=pazarlikDurumu(m,kalem),y=P.yuvarla,kap=x=>P.tavan?Math.min(x,P.tavan):x;
  let a,b;
  if(P.karsi!==null&&P.son!==null){a=P.son+(P.karsi-P.son)*T.ara[0];b=P.son+(P.karsi-P.son)*T.ara[1];}
  else{
    const yet=P.oneren?kisiYetenegi(k,P.oneren,P.konu):0.2,sapma=T.sapma.zayif-(T.sapma.zayif-T.sapma.iyi)*yet;
    const e=(kadroRastgele(k.dunyaTohumu,'pazarlik:'+m.id+':'+kalem+':tahmin')()*2-1)*sapma,t=P.alt*(1+e);
    a=t*T.kat.temkinli;b=t*T.kat.guclu;
  }
  a=kap(pazarlikYuvarla(a,y));b=kap(pazarlikYuvarla(b,y));if(b<=a)b=kap(a+y);
  P.rakamlar=[a,b];
  return P.rakamlar.slice();
}
function pazarlikTeklif(m,kalem,tutar){const P=pazarlikDurumu(m,kalem);P.son=tutar;P.tur++;return P;}
function pazarlikCevap(k,m,kalem){
  const T=PAZARLIK_TEST,P=pazarlikDurumu(m,kalem);
  if(P.son>=P.alt)return'kabul';
  P.sabir-=P.son<P.alt*T.sertEsik?2:1;
  if(P.sabir<=0)return'kopma';
  P.karsi=pazarlikYuvarla(P.alt*T.karsiKat,P.yuvarla);
  return'karsi';
}
function pazarlikBekledi(k,m,kalem){const P=pazarlikDurumu(m,kalem);P.sabir--;return P.sabir<=0?'kopma':'bekliyor';}
/* dünyadaki bir gelişme (rakip ilgisi, sızıntı) karşı tarafı sertleştirir: alt sınır kat kadar yükselir, sabır azalır */
function pazarlikSertles(m,kalem,kat,sabir){const P=pazarlikDurumu(m,kalem);if(!P)return null;P.alt=pazarlikYuvarla(P.alt*kat,P.yuvarla);P.sabir-=sabir||0;return P;}
