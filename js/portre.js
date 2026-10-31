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
/* ---- RK4-a (2026-10-31; kullanıcı: “her oyuncunun yüzü farklı olmalı — transfer, altyapıdan gelenler dahil”): oyuncu yüzleri, 24×24 piksel ----
   Görünüş oyuncunun kaydından ve kimliğinden belirlenimli türetilir (kayda alan yazılmaz; rastlantı çekilmez): ortak alanlar 3B figürle aynıdır — ten
   (STIL.tenler sırası), saç tipi (kisa, kel, uzun, mullet, kivircik; karmadan iki biçim), saç rengi (kayıttaki renk), bıyık, sakal; karmadan yüz biçimi
   (5), kaş (4), göz biçimi (5) ve rengi (3), burun (4), ağız (4), kulak (2); yaş izleri doğum yılından (tarihsiz), kalecide farklı yaka; omuzlar kulübün
   arma renginde. Tekillik araclar/portre-denetimi.js ile ölçülür (aynı özellik kümesi çıkmaz; çalışma anında tuz yok).
     portreOzellik(o)        → {yuz, ten, sac, sacV, sacRenk, kas, goz, gozRenk, burun, agiz, kulak, biyik, sakal, yas, kaleci, renk} (saf; Node'da da)
     portreOzellikAnahtari(f) → özellik kümesinin anahtarı (tekillik denetimi)
     oyuncuPortreUrl(o)      → PNG veri adresi (önbellekli; kimlik + yaş) */
const PORTRE_OYUNCU={boy:24,yuzler:['oval','kare','yuvarlak','uzun','sivri'],kaslar:['ince','kalin','kavisli','duz'],gozler:['nokta','genis','dar','agir','yuvarlak'],
  gozRenk:['#1a1410','#3a2414','#3a5a6a'],burunlar:['kucuk','uzun','genis','kemerli'],agizlar:['duz','gulus','ince','genis'],sacTipleri:['kisa','kel','uzun','mullet','kivircik']};
function prtKarma(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
/* özellik başına çekim: murmur3 sonlandırıcısı (tek turluk kaydırma yakın karmaları yakın değerlere götürüyordu) */
function prtCekim(h,i){let x=(h^Math.imul(i+1,0x9e3779b9))>>>0;x^=x>>>16;x=Math.imul(x,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return(x>>>0)/4294967296;}
function portreOzellik(o){
  const P=PORTRE_OYUNCU,h=prtKarma(String(o.id||'')+'|'+String(o.ad||'')+'|'+String(o.no||0)),u=i=>prtCekim(h,i),sec=(L,i)=>L[Math.floor(u(i)*L.length)%L.length];
  const yil=Number(String(o.dogumTarihi||'2000').slice(0,4)),yas=Math.max(15,Math.min(45,2026-yil));
  const kulup=o.kulupId||'',renk=typeof armaTarifi==='function'&&kulup?armaTarifi(kulup).renk[0]:'#4a4f5a';
  return{yuz:sec(P.yuzler,1),ten:Math.max(0,Math.min(4,o.ten|0)),sac:P.sacTipleri.includes(o.sac)?o.sac:'kisa',sacV:Math.floor(u(2)*2),sacRenk:o.sacRenk||'#241a12',
    kas:sec(P.kaslar,3),goz:sec(P.gozler,4),gozRenk:u(5)<0.82?(u(6)<0.6?0:1):2,burun:sec(P.burunlar,7),agiz:sec(P.agizlar,8),kulak:u(9)<0.7?0:1,
    biyik:!!o.biyik,sakal:!!o.sakal,yas,kaleci:o.mevki==='KL',renk};
}
const portreOzellikAnahtari=f=>[f.yuz,f.ten,f.sac,f.sacV,f.sacRenk,f.kas,f.goz,f.gozRenk,f.burun,f.agiz,f.kulak,f.biyik?1:0,f.sakal?1:0].join('|');
const PORTRE_OYUNCU_ONBELLEK={};
function oyuncuPortreUrl(o){
  if(!o)return'';
  const f=portreOzellik(o),anah=String(o.id)+'|'+f.yas+'|'+f.renk;
  if(PORTRE_OYUNCU_ONBELLEK[anah])return PORTRE_OYUNCU_ONBELLEK[anah];
  if(typeof document==='undefined')return'';
  const N=PORTRE_OYUNCU.boy,cv=document.createElement('canvas');cv.width=cv.height=N;
  const x=cv.getContext('2d'),r=(i,j,w,h,c)=>{x.fillStyle=c;x.fillRect(i,j,w,h);};
  const ten=STIL.tenler[f.ten]||STIL.tenler[0],sac=f.sacRenk,koyu=c=>'rgba(0,0,0,'+c+')',acik=c=>'rgba(255,255,255,'+c+')';
  /* zemin: kulübün renginin soluk hâli */
  r(0,0,N,N,'#e7e0d2');r(0,0,N,N,f.renk);r(0,0,N,N,'rgba(242,237,226,.72)');
  /* omuzlar ve forma (kulübün rengi); yaka kalecide kapalı ve koyu */
  r(2,19,20,5,f.renk);r(1,21,1,3,f.renk);r(22,21,1,3,f.renk);r(2,19,20,1,acik(.12));
  if(f.kaleci){r(8,18,8,2,'#1d1d22');r(9,20,6,1,'#1d1d22');}else{r(9,18,6,1,'#f2ede2');r(10,19,4,2,'#f2ede2');r(11,21,2,2,ten);}
  /* boyun */
  r(9,15,6,4,ten);r(9,17,6,1,koyu(.14));
  /* baş: yüz biçimine göre (x 6–17, y 4–16) */
  const Y={oval:[7,4,10,12],kare:[6,5,12,11],yuvarlak:[6,5,12,11],uzun:[7,3,10,13],sivri:[7,4,10,12]}[f.yuz],[bx,by,bw,bh]=Y;
  /* üst satır içeri (yuvarlak tepe; karede düz), gövde, alt kenar biçime göre */
  if(f.yuz==='kare')r(bx,by,bw,1,ten);else r(bx+1,by,bw-2,1,ten);
  r(bx,by+1,bw,bh-1,ten);
  if(f.yuz==='oval'||f.yuz==='uzun')r(bx+1,by+bh,bw-2,1,ten);
  if(f.yuz==='yuvarlak'){r(bx-1,by+2,1,bh-5,ten);r(bx+bw,by+2,1,bh-5,ten);r(bx+1,by+bh,bw-2,1,ten);}
  if(f.yuz==='kare'){r(bx,by+bh,bw,1,ten);r(bx,by+bh,1,1,koyu(.1));r(bx+bw-1,by+bh,1,1,koyu(.1));}
  if(f.yuz==='sivri'){r(bx+2,by+bh,bw-4,1,ten);r(bx+4,by+bh+1,bw-8,1,ten);}
  /* çene altı gölgesi ve yanaklar */
  r(bx+1,by+bh-1,bw-2,1,koyu(.08));
  /* kulaklar */
  const ky=by+5,kb=f.kulak?3:2;r(bx-1-(f.yuz==='yuvarlak'?1:0),ky,1,kb,ten);r(bx+bw+(f.yuz==='yuvarlak'?1:0),ky,1,kb,ten);
  /* saç: kel (yanlarda ince), kısa (iki biçim), uzun, mullet, kıvırcık; yaşla kırlaşma (34+) şakaklarda */
  const sy=by,yan=(h)=>{r(bx-1,sy+1,1,h,sac);r(bx+bw,sy+1,1,h,sac);};
  if(f.sac==='kel'){r(bx-1,sy+4,1,3,sac);r(bx+bw,sy+4,1,3,sac);if(f.sacV)r(bx+1,sy,bw-2,1,koyu(.08));}
  else if(f.sac==='kisa'){r(bx,sy-1,bw,2,sac);yan(3);if(f.sacV){r(bx+1,sy-2,bw-3,1,sac);r(bx,sy+1,3,1,sac);}else{r(bx+bw-3,sy+1,3,1,sac);}}
  else if(f.sac==='uzun'){r(bx-1,sy-1,bw+2,2,sac);r(bx-2,sy,2,f.sacV?11:9,sac);r(bx+bw,sy,2,f.sacV?11:9,sac);r(bx,sy+1,bw,1,sac);}
  else if(f.sac==='mullet'){r(bx,sy-1,bw,2,sac);yan(4);r(bx-1,sy+5,2,6+f.sacV,sac);r(bx+bw-1,sy+5,2,6+f.sacV,sac);}
  else{/* kıvırcık: düzensiz kabarık */r(bx-1,sy-2,bw+2,3,sac);yan(4);for(let i=0;i<bw+2;i+=2)r(bx-1+i,sy-3+((i>>1)%2),1,1,sac);if(f.sacV)r(bx-2,sy,1,4,sac),r(bx+bw+1,sy,1,4,sac);}
  if(f.yas>=34&&f.sac!=='kel'){r(bx-1,sy+3,1,2,acik(.45));r(bx+bw,sy+3,1,2,acik(.45));}
  /* kaşlar */
  const kasR=f.yas>=34?'#5a5048':'#2a2018',ey=by+4,sol=bx+2,sag=bx+bw-5;
  if(f.kas==='kalin'){r(sol,ey-1,3,2,kasR);r(sag,ey-1,3,2,kasR);}   /* gözle arasında bir satır ten kalır (yoksa gözlük gibi kara bant) */
  else if(f.kas==='kavisli'){r(sol,ey,3,1,kasR);r(sol-1,ey+1,1,1,kasR);r(sag,ey,3,1,kasR);r(sag+3,ey+1,1,1,kasR);}
  else if(f.kas==='duz'){r(sol,ey+1,3,1,kasR);r(sag,ey+1,3,1,kasR);}
  else{r(sol+1,ey,2,1,kasR);r(sag,ey,2,1,kasR);}
  /* gözler */
  const gy=by+6,gc=PORTRE_OYUNCU.gozRenk[f.gozRenk];
  if(f.goz==='genis'){r(sol,gy,3,1,'#f4efe6');r(sol+1,gy,1,1,gc);r(sag,gy,3,1,'#f4efe6');r(sag+1,gy,1,1,gc);}
  else if(f.goz==='dar'){r(sol+1,gy,2,1,gc);r(sag,gy,2,1,gc);}
  else if(f.goz==='agir'){r(sol,gy-1,3,1,koyu(.2));r(sag,gy-1,3,1,koyu(.2));r(sol+1,gy,1,1,gc);r(sag+1,gy,1,1,gc);}
  else if(f.goz==='yuvarlak'){r(sol+1,gy,1,2,gc);r(sag+1,gy,1,2,gc);r(sol,gy,1,1,'#f4efe6');r(sag+2,gy,1,1,'#f4efe6');}
  else{r(sol+1,gy,1,1,gc);r(sag+1,gy,1,1,gc);}
  /* burun */
  const nx=bx+Math.floor(bw/2)-1,ny=by+7;
  if(f.burun==='uzun')r(nx+1,ny,1,3,koyu(.2));
  else if(f.burun==='genis'){r(nx,ny+1,3,1,koyu(.18));r(nx+1,ny,1,1,koyu(.12));}
  else if(f.burun==='kemerli'){r(nx+1,ny,1,1,koyu(.16));r(nx+2,ny+1,1,1,koyu(.2));r(nx+1,ny+2,1,1,koyu(.2));}
  else r(nx+1,ny+1,1,1,koyu(.2));
  /* bıyık ve sakal (kayıttan; figürle aynı) */
  const ay=by+bh-3;
  if(f.sakal){r(bx,ay-1,1,4,sac);r(bx+bw-1,ay-1,1,4,sac);r(bx+1,ay+1,bw-2,3,sac);r(bx+2,by+bh,bw-4,1,sac);}
  if(f.biyik)r(nx-1,ay-1,5,1,sac);
  /* ağız */
  const mc=f.sakal?'#5a3226':'#86463a',mx=nx-1;
  if(f.agiz==='gulus'){r(mx,ay,5,1,mc);r(mx,ay-1,1,1,mc);r(mx+4,ay-1,1,1,mc);}
  else if(f.agiz==='ince')r(mx+1,ay,3,1,koyu(.3));
  else if(f.agiz==='genis')r(mx-1,ay,7,1,mc);
  else r(mx,ay,5,1,mc);
  /* yaş izleri: 30+ burun–ağız çizgisi, 34+ alın çizgisi */
  if(f.yas>=30){r(nx-2,ay-2,1,2,koyu(.1));r(nx+4,ay-2,1,2,koyu(.1));}
  if(f.yas>=34)r(bx+3,by+2,bw-6,1,koyu(.08));
  return PORTRE_OYUNCU_ONBELLEK[anah]=cv.toDataURL('image/png');
}
/* oyuncu portresinin <img> etiketi; piksel tabanlı büyütme (2× liste, 3× kart başlığı) keskin kalır */
function oyuncuPortreHtml(o,sinif,kat){const n=PORTRE_OYUNCU.boy*(kat||2);
  return o?'<img class="'+(sinif||'')+' prt-oyuncu" src="'+oyuncuPortreUrl(o)+'" alt="" width="'+n+'" height="'+n+'" style="width:'+n+'px;height:'+n+'px">':'';}
