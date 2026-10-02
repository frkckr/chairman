/* ============ Chairman — kişi portreleri: kodla çizilmiş 16×16 piksel yüzler (görüntü katmanı; yol haritası 2.8I) ============
   Telefonun kişi listesinde, konuşma başlığında ve dosyada kişiyi tanınır kılar. Kural içermez; kariyeri değiştirmez.
   Görünüş STIL.portre.kisiler'den gelir; listede olmayan kişi kimliğinden belirlenimli bir görünüş alır (rastlantı çekmez).
   portreUrl(kisi) → PNG veri adresi (önbellekli). Görüntü <img> ile büyütülürken keskin kalır (CSS image-rendering: pixelated). */
const PORTRE_ONBELLEK={};
function portreGorunus(p){
  const P=STIL.portre,g=P.kisiler[p.id];
  if(g)return g;
  /* kimlikten belirlenimli görünüş: aynı kişi her zaman aynı yüzü taşır */
  let h=0;for(const c of String(p.id))h=(h*31+c.charCodeAt(0))>>>0;
  const yil=Number(String(p.dogumTarihi||'1970').slice(0,4)),yasli=yil<1962;
  return{ten:h%3,sac:yasli?(h&4?'kir':'beyaz'):['siyah','kahve','siyah','sari'][(h>>3)%4],tip:['kisa','seyrek','dalgali','kisa'][(h>>5)%4],biyik:(h>>7)%3,gozluk:!!((h>>9)&1),giysi:'#4a4f5a',yaka:'#f2ede2'};
}
function portreUrl(p){
  if(!p)return'';
  if(PORTRE_ONBELLEK[p.id])return PORTRE_ONBELLEK[p.id];
  if(typeof document==='undefined')return'';
  const P=STIL.portre,g=portreGorunus(p),cv=document.createElement('canvas');cv.width=cv.height=16;
  const x=cv.getContext('2d'),nokta=(i,j,w,h,r)=>{x.fillStyle=r;x.fillRect(i,j,w,h);};
  const ten=P.tenler[g.ten]||P.tenler[0],sac=P.saclar[g.sac]||g.sac||P.saclar.siyah,golge='rgba(0,0,0,.18)';
  nokta(0,0,16,16,P.zemin[p.rol]||P.zemin.diger);
  /* omuzlar ve yaka */
  nokta(2,13,12,3,g.giysi);nokta(6,12,4,2,g.yaka);nokta(7,13,2,3,g.yaka);
  /* boyun ve baş */
  nokta(6,10,4,3,ten);nokta(4,3,8,8,ten);nokta(4,10,8,1,golge);
  /* kulaklar */
  nokta(3,6,1,2,ten);nokta(12,6,1,2,ten);
  /* saç */
  if(g.tip==='uzun'){nokta(3,2,10,2,sac);nokta(3,4,2,9,sac);nokta(11,4,2,9,sac);nokta(4,3,8,1,sac);}
  else if(g.tip==='topuz'){nokta(4,2,8,2,sac);nokta(3,3,1,4,sac);nokta(12,3,1,4,sac);nokta(6,0,4,2,sac);}
  else if(g.tip==='kel'){nokta(3,5,1,3,sac);nokta(12,5,1,3,sac);}
  else if(g.tip==='seyrek'){nokta(4,3,8,1,sac);nokta(3,4,1,3,sac);nokta(12,4,1,3,sac);nokta(5,2,2,1,sac);nokta(9,2,2,1,sac);}
  else if(g.tip==='dalgali'){nokta(4,2,8,2,sac);nokta(3,3,1,4,sac);nokta(12,3,1,4,sac);nokta(5,1,2,1,sac);nokta(9,1,3,1,sac);nokta(4,4,2,1,sac);}
  else{nokta(4,2,8,2,sac);nokta(3,3,1,3,sac);nokta(12,3,1,3,sac);}
  /* kaşlar, gözler, burun, ağız */
  nokta(5,5,2,1,g.sac==='beyaz'||g.sac==='kir'?'#7a746c':'#2a2018');nokta(9,5,2,1,g.sac==='beyaz'||g.sac==='kir'?'#7a746c':'#2a2018');
  nokta(7,7,2,2,golge);
  if(g.biyik===2){nokta(5,9,6,1,sac);nokta(6,8,4,1,sac);}
  else if(g.biyik===1)nokta(6,9,4,1,sac);
  else nokta(6,9,4,1,'#9a4a3a');
  /* gözler; gözlükte ince çerçeve, gözler camın içinde görünür */
  if(g.gozluk){const c='#3a3430';for(const gx of[4,9]){nokta(gx,5,3,1,c);nokta(gx,7,3,1,c);nokta(gx,6,1,1,c);nokta(gx+2,6,1,1,c);nokta(gx+1,6,1,1,'#cfe2ea');}
    nokta(7,6,2,1,c);nokta(5,6,1,1,'#1a1612');nokta(10,6,1,1,'#1a1612');}
  else{nokta(5,6,2,1,'#1a1612');nokta(9,6,2,1,'#1a1612');}
  return PORTRE_ONBELLEK[p.id]=cv.toDataURL('image/png');
}
/* portre <img> etiketi; kişi yoksa kurumun kısa simgesi */
function portreHtml(p,sinif,etiket){
  if(!p)return'<span class="'+(sinif||'')+' portre-bos" aria-hidden="true">'+String(etiket||'·').slice(0,2)+'</span>';
  return'<img class="'+(sinif||'')+'" src="'+portreUrl(p)+'" alt="" width="16" height="16">';
}
