/* ============ Chairman — kişi ve oyuncu portreleri: kodla çizilmiş piksel yüzler (görüntü katmanı; yol haritası 2.8I, RK4-a) ============
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
/* ---- RK4-a (2026-10-31; kullanıcı: “her oyuncunun yüzü farklı olmalı”), RK4-b (2026-11-01; kullanıcı: “Türkler çok siyahi değildir, hafif esmer
   olur …; kaş ve göz birbirine girmiş; yaşlandıkça saç dökülmesi, kellik, sakal …; temelleri atalım”): oyuncu yüzleri, 32×32 piksel ----
   Görünüş oyuncunun kaydından, kimliğinden (js/kimlik.js: köken, göz rengi, saç dökülmesi ve kırlaşma yatkınlığı) ve yaşından belirlenimli türetilir
   (kayda alan yazılmaz; rastlantı çekilmez). Kimlikten, balkondaki 3B figürle ortak: ten (STIL.tenRampa sırası 0–6, köken ağırlığıyla). Kayıttan,
   figürle ortak: saç tipi (kisa, kel, uzun, mullet, kivircik), saç rengi, bıyık, sakal. Karmadan: yüz biçimi (5), kaş (4), göz biçimi (5; Doğu Asya kökeninde çekik), burun (4), ağız (4), kulak (2),
   saç biçimi (3), kirli sakal eğilimi, küçük iz (ben ya da kaşta yara izi; %16). Yaştan (js/kimlik.js yasKatmani): saç çizgisinin geri çekilmesi (0–4; 4: tepe açık), kırlaşma, kirli sakal, göz altı, burun–ağız
   ve alın çizgileri; gençte saç bir sıra dolgun. Çizim kuralları: her parça rampanın dört tonundan (ışık, orta, gölge, çizgi); kaş ile göz arasında
   her zaman bir satır ten (kaşın alt satırı göz satırının iki üstünde); kaş tenden en az iki kademe koyu, en koyu iki rampada rampanın çizgi tonu.
   Tekillik araclar/portre-denetimi.js ile ölçülür (aynı kimlik kümesi çıkmaz; çalışma anında tuz yok).
     portreOzellik(o, tarih)    → {yuz, ten, sac, sacV, sacRenk, kas, goz, gozRenk, burun, agiz, kulak, biyik, sakal, kaleci, renk, koken, yas, sacCizgisi,
                                   gri, kirliSakal, gozAlti, cizgi, alin} (saf; Node'da da)
     portreOzellikAnahtari(f)   → kimlik özellik kümesinin anahtarı (yaşa bağlı alanlar hariç; tekillik denetimi)
     oyuncuPortreUrl(o, tarih)  → PNG veri adresi (önbellekli; kimlik + yaş + kulüp rengi) */
const PORTRE_OYUNCU={boy:32,yuzler:['oval','kare','yuvarlak','uzun','sivri'],kaslar:['ince','kalin','kavisli','duz'],gozler:['nokta','genis','dar','agir','yuvarlak'],
  burunlar:['kucuk','uzun','genis','kemerli'],agizlar:['duz','gulus','ince','genis'],sacTipleri:['kisa','kel','uzun','mullet','kivircik']};
function prtKarma(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
/* özellik başına çekim: murmur3 sonlandırıcısı (tek turluk kaydırma yakın karmaları yakın değerlere götürüyordu) */
function prtCekim(h,i){let x=(h^Math.imul(i+1,0x9e3779b9))>>>0;x^=x>>>16;x=Math.imul(x,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return(x>>>0)/4294967296;}
function portreOzellik(o,tarih){
  const P=PORTRE_OYUNCU,h=prtKarma(String(o.id||'')+'|'+String(o.ad||'')+'|'+String(o.no||0)),u=i=>prtCekim(h,i),sec=(L,i)=>L[Math.floor(u(i)*L.length)%L.length];
  const kulup=o.kulupId||'',renk=typeof armaTarifi==='function'&&kulup?armaTarifi(kulup).renk[0]:'#4a4f5a';
  const I=kimlik(o),Y=yasKatmani(o,tarih);
  return{yuz:sec(P.yuzler,1),ten:I.ten,sac:P.sacTipleri.includes(o.sac)?o.sac:'kisa',sacV:Math.floor(u(2)*3),sacRenk:o.sacRenk||'#241a12',
    kas:sec(P.kaslar,3),goz:I.cekik?'cekik':sec(P.gozler,4),gozRenk:I.goz,burun:sec(P.burunlar,7),agiz:sec(P.agizlar,8),kulak:u(9)<0.7?0:1,
    biyik:!!o.biyik,sakal:!!o.sakal,kaleci:o.mevki==='KL',renk,koken:I.koken,kirliEgilim:I.kirli,iz:u(10)<0.1?'ben':u(10)<0.16?'kasIz':'',
    yas:Y.yas,sacCizgisi:Y.sacCizgisi,gri:Y.gri,kirliSakal:Y.kirliSakal,gozAlti:Y.gozAlti,cizgi:Y.cizgi,alin:Y.alin};
}
const portreOzellikAnahtari=f=>[f.yuz,f.ten,f.sac,f.sacV,f.sacRenk,f.kas,f.goz,f.gozRenk,f.burun,f.agiz,f.kulak,f.biyik?1:0,f.sakal?1:0,f.kirliEgilim?1:0,f.iz,f.kaleci?1:0].join('|');
/* iki rengin karışımı (#rrggbb; t: b'nin payı) */
function prtKaris(a,b,t){const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16),m=(s)=>Math.round(((x>>s)&255)*(1-t)+((y>>s)&255)*t);
  return'#'+((1<<24)|(m(16)<<16)|(m(8)<<8)|m(0)).toString(16).slice(1);}
/* göz biçimleri (sol göz; dışı solda, sağ göz aynası): iki satır, üç sütun; d çizgi (kirpik ve kapak), w ak, i iris, g gölge, . ten */
const PRT_GOZ={nokta:['dd.','wi.'],genis:['ddd','wiw'],dar:['...','dii'],agir:['ggg','di.'],yuvarlak:['.d.','wi.'],cekik:['...','ddi']};
const PORTRE_OYUNCU_ONBELLEK={};
function oyuncuPortreUrl(o,tarih){
  if(!o)return'';
  const f=portreOzellik(o,tarih),anah=String(o.id)+'|'+f.yas+'|'+f.renk+'|'+f.ten+'|'+f.sac+'|'+f.sacRenk+'|'+(f.sakal?1:0)+(f.biyik?1:0);
  if(PORTRE_OYUNCU_ONBELLEK[anah])return PORTRE_OYUNCU_ONBELLEK[anah];
  if(typeof document==='undefined')return'';
  const N=PORTRE_OYUNCU.boy,cv=document.createElement('canvas');cv.width=cv.height=N;
  const x=cv.getContext('2d'),r=(i,j,w,h,c)=>{if(w>0&&h>0){x.fillStyle=c;x.fillRect(i,j,w,h);}};
  const R=(STIL.tenRampa||[])[f.ten]||STIL.tenRampa[1],[TI,TO,TG,TC]=R;   /* ışık, orta, gölge, çizgi */
  const koyu=f.ten>=5,gri='#c9c5bd',sac=prtKaris(f.sacRenk,gri,f.gri),sacYan=prtKaris(f.sacRenk,gri,Math.min(1,f.gri*1.4));
  const GZ=STIL.gozRenk||['#1e1610','#4a2e18','#6a6a34','#4a6e86'],iris=GZ[f.gozRenk]||GZ[0],ak='#efe9de';
  const kasR=koyu?TC:prtKaris(f.sacRenk,'#000000',0.25),dudak=prtKaris(TG,'#8a3c34',koyu?0.25:0.45);
  /* zemin: kulübün renginin soluk hâli */
  r(0,0,N,N,f.renk);r(0,0,N,N,'rgba(242,237,226,.74)');
  /* omuzlar ve forma (kulübün rengi); kalecide kapalı koyu yaka, öbürlerinde V yaka */
  r(5,26,22,1,f.renk);r(3,27,26,5,f.renk);r(5,26,22,1,'rgba(255,255,255,.14)');
  if(f.kaleci){r(11,25,10,2,'#1d1d22');r(12,27,8,1,'#1d1d22');}else{r(12,25,8,1,'#f2ede2');r(13,26,6,2,'#f2ede2');r(14,27,4,2,TO);r(15,29,2,1,TO);}
  /* boyun */
  r(13,21,6,5,TO);r(13,21,6,2,TG);r(18,21,1,5,TG);
  /* baş: satır satır genişlik (yüz biçimi); ışık sol üstten */
  const B={oval:[9,6,14,17],kare:[9,6,14,16],yuvarlak:[9,6,14,16],uzun:[10,5,12,18],sivri:[9,6,14,17]}[f.yuz],[bx,by,bw,bh]=B;
  const satir=j=>{   /* j: 0…bh-1 → [sol, sağ] (dahil) */
    let a=bx,b=bx+bw-1;
    if(j===0){a+=2;b-=2;}else if(j===1){a+=1;b-=1;}
    if(f.yuz==='yuvarlak'&&j>=6&&j<=11){a-=1;b+=1;}
    const k=bh-1-j;
    if(f.yuz==='kare'){if(k===0){a+=1;b-=1;}}
    else if(f.yuz==='sivri'){if(k===0){a+=4;b-=4;}else if(k===1){a+=2;b-=2;}else if(k===2){a+=1;b-=1;}}
    else{if(k===0){a+=3;b-=3;}else if(k===1){a+=1;b-=1;}}
    return[a,b];};
  for(let j=0;j<bh;j++){const [a,b]=satir(j);r(a,by+j,b-a+1,1,TO);r(b,by+j,1,1,TG);}
  r(bx+3,by+2,3,1,TI);r(bx+2,by+3,1,2,TI);                       /* alnın ışığı */
  {const [a,b]=satir(bh-1);r(a,by+bh-1,b-a+1,1,TG);}           /* çene altı */
  /* kulaklar */
  const ky=by+8,kb=f.kulak?5:4,[ka,kz]=satir(9);r(ka-1,ky,1,kb,TO);r(ka-1,ky+1,1,kb-2,TG);r(kz+1,ky,1,kb,TG);
  /* gözler (gy, gy+1), kaşlar en geç gy-2'de biter: gy-1 her zaman ten */
  const gy=by+9,ew=bw>=14?3:2,el=bx+3,er=bx+bw-3-ew;
  const gozCiz=(gx,ayna)=>{const S=PRT_GOZ[f.goz]||PRT_GOZ.nokta;for(let s=0;s<2;s++)for(let c=0;c<ew;c++){
    const ch=S[s][ayna?(3-ew)+(ew-1-c):(3-ew)+c],renk=ch==='d'?TC:ch==='w'?ak:ch==='i'?iris:ch==='g'?TG:null;if(renk)r(gx+c,gy+s,1,1,renk);}};
  gozCiz(el,false);gozCiz(er,true);
  const kas=(gx,ayna)=>{const dis=ayna?gx+ew:gx-1;   /* dış uç */
    if(f.kas==='kalin'){r(Math.min(gx,dis),gy-3,ew+1,2,kasR);}
    else if(f.kas==='kavisli'){r(gx,gy-3,ew,1,kasR);r(dis,gy-2,1,1,kasR);}
    else if(f.kas==='duz'){r(Math.min(gx,dis),gy-2,ew+1,1,kasR);}
    else r(ayna?gx:gx+1,gy-2,ew-1,1,kasR);};
  kas(el,false);kas(er,true);
  if(f.iz==='kasIz')r(er+1,gy-3,1,2,TO);   /* kaşta yara izi: kaşı bölen ten çizgisi */
  /* burun (ortada iki sütun) */
  const nx=bx+Math.floor(bw/2)-1,ny=gy+2;
  if(f.burun==='uzun'){r(nx+1,ny-1,1,3,TG);r(nx,ny+2,1,1,TC);}
  else if(f.burun==='genis'){r(nx-1,ny+1,4,1,TG);r(nx+1,ny,1,1,TG);}
  else if(f.burun==='kemerli'){r(nx+1,ny-1,1,1,TG);r(nx+2,ny,1,1,TG);r(nx+1,ny+1,1,1,TC);}
  else{r(nx+1,ny+1,1,1,TG);r(nx,ny+1,1,1,TI);}
  /* yaş: göz altı, burun–ağız çizgisi, alın çizgisi (saç çizgisi açıksa görünür) */
  const my=gy+5;
  if(f.gozAlti){r(el,gy+2,ew,1,'rgba(0,0,0,.09)');r(er,gy+2,ew,1,'rgba(0,0,0,.09)');}
  if(f.cizgi){r(nx-2,my-2,1,2,TG);r(nx+3,my-2,1,2,TG);}
  if(f.iz==='ben')r(bx+bw-4,gy+3,1,1,TC);   /* yanakta ben */
  /* kirli sakal: çene ve yanak altında saçın gölgesi */
  if(f.kirliSakal&&!f.sakal){const ks=prtKaris(TO,f.sacRenk,koyu?0.1:0.18);for(let j=my;j<by+bh-1;j++){const [a,b]=satir(j-by);r(a,j,b-a+1,1,ks);}r(nx-1,my,4,1,dudak);}
  /* sakal ve bıyık (kayıttan; figürle aynı) */
  if(f.sakal){for(let j=gy+2;j<by+bh;j++){const [a,b]=satir(j-by);if(j<my){r(a,j,2,1,sac);r(b-1,j,2,1,sac);}else r(a,j,b-a+1,1,sac);}}
  if(f.biyik)r(nx-2,my-1,6,1,sac);
  /* ağız */
  if(f.agiz==='gulus'){r(nx-1,my,4,1,dudak);r(nx-2,my-1,1,1,dudak);r(nx+3,my-1,1,1,dudak);}
  else if(f.agiz==='ince')r(nx-1,my,4,1,TC);
  else if(f.agiz==='genis'){r(nx-2,my,6,1,dudak);r(nx-1,my+1,4,1,'rgba(0,0,0,.06)');}
  else r(nx-1,my,4,1,dudak);
  /* saç: tip ve biçim, gençte bir sıra dolgun; yaşla saç çizgisi geri çekilir (1 şakaklar, 2 alın, 3 tepe seyrek, 4 tepe açık), kırlaşma */
  const st=f.sacCizgisi,genc=f.yas<21,kelTepe=f.sac==='kel'||st>=4;
  const yan=(y0,n)=>{const [a,b]=satir(Math.max(0,y0-by));r(a-1,y0,2,n,sacYan);r(b,y0,2,n,sacYan);};
  if(kelTepe){
    r(bx+4,by+1,3,1,TI);yan(by+7,4);   /* nal biçimi: yanlar ve ense */
    if(f.sac==='uzun'){r(bx-2,by+7,2,8,sacYan);r(bx+bw,by+7,2,8,sacYan);}
    if(f.sac==='mullet'){r(bx-1,by+11,2,7,sacYan);r(bx+bw-1,by+11,2,7,sacYan);}
  }else{
    const ust=f.sac==='kivircik'?3:2,hac=genc&&f.sac!=='kel'?1:0;
    const tepe=(y,a,b,c)=>r(a,y,b-a+1,1,c);
    /* tepe satırları: başın biçimini izler, bir sütun taşar */
    const kiv=f.sac==='kivircik',kivKoyu=prtKaris(sac,'#000000',0.35);
    for(let j=-ust-hac;j<=1;j++){const [a,b]=satir(Math.max(0,j)),a2=a-(j>=0?1:0)-(kiv?1:0),b2=b+(j>=0?1:0)+(kiv?1:0),c=st>=3&&j<=0?prtKaris(sac,TO,0.45):sac;
      if(kiv&&j===-ust-hac){for(let x=a2+1;x<=b2-1;x+=3)r(x,by+j,2,1,c);}   /* kıvırcıkta üst kenar tırtıllı */
      else tepe(by+j,a2,b2,c);
      if(kiv&&j>-ust-hac)for(let x=a2;x<=b2;x++)if((x*2+j*3)%5===0)r(x,by+j,1,1,kivKoyu);}   /* kıvrım dokusu */
    /* alnın üstü: ön saç (biçime göre) ya da açılan saç çizgisi */
    if(st===0){if(f.sacV===1)r(bx+2,by+2,5,1,sac);else if(f.sacV===2){r(bx+1,by+2,4,1,sac);r(bx+1,by+3,2,1,sac);}else r(bx+bw-5,by+2,3,1,sac);}   /* perçem, yana tarama, ayrık */
    if(st>=1){r(bx+1,by+1,2,1,TO);r(bx+bw-3,by+1,2,1,TO);}
    if(st>=2){const [a,b]=satir(1);r(a+1,by+1,b-a-1,1,TO);r(bx+2,by,2,1,TO);r(bx+bw-4,by,2,1,TO);if(f.alin)r(bx+4,by+3,bw-8,1,'rgba(0,0,0,.08)');}
    yan(by+2,f.sac==='kisa'?4:5);
    if(f.sac==='uzun'){r(bx-2,by,2,11+f.sacV,sac);r(bx+bw,by,2,11+f.sacV,sac);r(bx-2,by,2,3,sacYan);}
    else if(f.sac==='mullet'){r(bx-1,by+9,2,8+f.sacV,sac);r(bx+bw-1,by+9,2,8+f.sacV,sac);}
    else if(f.sac==='kivircik')yan(by+6,2);
    if(f.gri>0.25){r(bx-1,by+4,1,3,gri);r(bx+bw,by+4,1,3,gri);}   /* şakaklar önce ağarır */
  }
  if(f.alin&&kelTepe)r(bx+4,by+3,bw-8,1,'rgba(0,0,0,.08)');
  return PORTRE_OYUNCU_ONBELLEK[anah]=cv.toDataURL('image/png');
}
/* oyuncu portresinin <img> etiketi; piksel tabanlı büyütme (1× liste, 3× kart başlığı) keskin kalır */
function oyuncuPortreHtml(o,sinif,kat,tarih){const n=PORTRE_OYUNCU.boy*(kat||2);
  return o?'<img class="'+(sinif||'')+' prt-oyuncu" src="'+oyuncuPortreUrl(o,tarih)+'" alt="" width="'+n+'" height="'+n+'" style="width:'+n+'px;height:'+n+'px">':'';}
