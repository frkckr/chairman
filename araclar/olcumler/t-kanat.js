'use strict';
/* ============ T14 kanat ve hücum koşuları ölçümleri (gerçekçilik planı §4 T14, T14-0; 2026-10-14) ============
   r-karne.js ve t-takim.js ile aynı sözleşme: rastlantı çekmez, motorun önbellek yazan yöntemlerini çağırmaz; yalnız olayları, top, oyuncu, duruş ve
   saat alanlarını okur. Oranlar bütün maçların toplamından (ham), diğer satırlar maç başına ortalamadır. Tanımlar:
   - Kanat oyuncusunun topsuz yeri: top oyunda ve takımının ayağındayken (sahibi kanat oyuncusunun kendisi değil), top rakip yarının son üçte
     birinde (kale çizgisine ≤ 35 m) iken 6 karede bir örnek. Topun kanadı: topun orta çizgiye (w) uzaklığı > 10 m ise o kanat, değilse orta.
     “Aynı kanat”: top kanat oyuncusunun kendi kanadında; “uzak kanat”: öbür kanatta. Çizgiye ≤ 8 m: taç çizgisine 8 m içinde. Ceza sahasında:
     rakip ceza sahası. Önde: topun hücum yönünde 2 m'den çok önünde.
   - Orta anı: 'cross' olayı (açık oyun ve serbest vuruşun ortası; korner servisi olay yaymaz) ve geri çevirme ('pass', tur 'geriCevir') anında
     rakip ceza sahasındaki hücumcular (ortacı ve kaleci hariç), bunların forvet dışı olanları ve savunmacılar (kaleci hariç). Ortadan sonra 3 sn
     içinde topa ilk dokunan (ortacı dışında; topun son dokunanı): hedeflenen alıcı mı, hücumdan biri mi.
   - Şut anı: şut ya da şut sayılan kafa anında rakip ceza sahasındaki forvet dışı takım arkadaşı (şutu atan ve kaleci hariç).
   - Kanadın topla ilk işi: kanat mevkili oyuncu topu son üçte birde aldığında (sahip olduğunda) topu bırakana kadar ilk olayı: orta, geri
     çevirme, pas, şut, çalım (düelloya giren ya da girmeyen deneme); bunlardan biri olmadan top başkasına geçerse “kayıp ya da diğer”.
   - Tam plonjon kafa (T14e): kafa olayında vuranın eylemi plonjon (koşarak alçak topa dalış; js/mac-topla.js erisim).
   - Koşu: 'kosu' olayı (motorun topsuz koşu başlangıcı; tür: arkaya, gel, aldatma, takip, T14 türleri) maç başına. */
const W_PL=52.5,W_MZ=34,W_PW=68,W_CU=16.5,W_CW=20.16;
const W_ILK=['orta','geri','pas','sut','calim','kayip'],W_ILK_AD={orta:'orta',geri:'geri çevirme',pas:'pas',sut:'şut',calim:'çalım',kayip:'kayıp ya da diğer'};
const W_KOSU=['arkaya','gel','aldatma','takip','orta','genis','bindirme','gecGiris','gecGirisPas','gecKosu'];   /* T24e: gecGirisPas (forvete pasla tetiklenen geç giriş; gecGiris'in içinde), gecKosu */
/* T24-0 (2026-10-18; T24 planı, ölçüm 5): şut anında ceza sahasındaki forvet dışı arkadaşın (şutu atan ve kaleci hariç) kaynağı, sırayla:
   duran top görevi (görev etiketi 'duran' ya da duran top penceresinde görevi var), geç giriş (koşusu 'gecGiris' ya da son 3 sn'de böyle bir koşu
   başlattı), takip (aynı, 'takip'; bu şutun takibi şuttan sonra atanır, sayılmaz), kutu rolü (görev etiketi 'kutu': kutuRolu ve kanadın arka
   direği), başka koşu (başka türde koşusu var ya da görev etiketi koşu, orta, genişlik, bindirme), diğer (bölge, destek, uzak kanat …) */
const W_FDK=['gecGiris','gecKosu','kutu','takip','kosu','duran','diger'];
const W_FDK_AD={gecGiris:'geç giriş',gecKosu:'açık oyunda geç koşu (T24e2)',kutu:'kutu rolü',takip:'takip',kosu:'başka koşu',duran:'duran top görevi',diger:'diğer (bölge, destek, uzak kanat …)'};
const W_KOSU_G=new Set(['kosu','orta','genis','bindirme']);
module.exports={
  bilgi:[['— T14: kanat ve hücum koşuları (gerçekçilik planı §4 T14) —',null,0],
    ['Kanat topsuz (son üçte bir): çizgiye ≤ 8 m %','wGenis',1],
    ['Kanat: top aynı kanatta — çizgiye ≤ 8 m %','wAyniGenis',1],['Kanat: top aynı kanatta — topun önünde %','wAyniOnde',1],
    ['Kanat: top uzak kanatta — ceza sahasında %','wUzakKutu',1],['Kanat: top uzak kanatta — çizgiye ≤ 8 m %','wUzakGenis',1],
    ['Kanat: top ortada — çizgiye ≤ 8 m %','wOrtaGenis',1],
    ['Orta anı: ceza sahasında hücumcu (ort.)','wOrtaHucum',2],['Orta anı: ceza sahasında forvet dışı hücumcu (ort.)','wOrtaFd',2],
    ['Orta anı: ceza sahasında savunmacı (ort.)','wOrtaSav',2],
    ['Orta: kanat oyuncusundan %','wOrtaKanat',1],['Orta: bekten %','wOrtaBek',1],['Orta: forvetten %','wOrtaForvet',1],['Orta: merkez orta sahadan %','wOrtaMerkez',1],
    ['Orta anı: forvetler ceza sahasında (ort., ortacı forvet değilken)','wOrtaFvKutu',2],
    ['Orta: 3 sn içinde ilk dokunuş hedeflenen alıcı %','wOrtaAlici',1],['Orta: 3 sn içinde ilk dokunuş hücum %','wOrtaHucumIlk',1],
    ['Şut anı: ceza sahasında forvet dışı arkadaş (ort.)','wSutFd',2],['Şut anı: ceza sahasında ≥ 1 forvet dışı arkadaş %','wSutFd1',1],
    ['Kanat topla son üçte birde / maç','wKanatTop',1],['Tam plonjon kafa / maç (T14e)','wPlonjon',2],['Tam plonjon kafa: şut %','wPlonjonSut',1]]
    .concat(W_ILK.map(k=>['Kanadın ilk işi: '+W_ILK_AD[k]+' %','wIlk_'+k,1]))
    .concat(W_KOSU.map(k=>['Koşu: '+k+' / maç','wKosu_'+k,2]))
    .concat(W_FDK.map(k=>['Şut anı (T24-0): kutudaki forvet dışı arkadaşın kaynağı — '+W_FDK_AD[k]+' %','wFK_'+k,1])),
  yeni:()=>{
    const hyp=Math.hypot;
    let n=0,genis=0,ayN=0,ayG=0,ayO=0,uzN=0,uzK=0,uzG=0,orN=0,orG=0,adim=0;
    let plN=0,plS=0,oN=0,oHuc=0,oFd=0,oSav=0,oKanat=0,oBek=0,oFv=0,oMk=0,oFvN=0,oFvK=0,oBitN=0,oAlici=0,oHucIlk=0,sN=0,sFd=0,sFd1=0,ktN=0;const ilk={},kosu={};
    let orta=null,kt=null,sonS=null;
    /* T24-0 */
    const sonKosu=new Map(),fdk={};for(const k of W_FDK)fdk[k]=0;
    const fdKaynak=(m,q)=>{const g=q.gorevAd,k=q.kosu,sk=sonKosu.get(q),tur=a=>k&&k.tur===a||!!(sk&&sk.tur===a&&m.t-sk.t<=3);
      if(g==='duran'||m._duranSonrasi&&q.duranRol)return'duran';if(tur('gecGiris'))return'gecGiris';if(tur('gecKosu'))return'gecKosu';if(tur('takip'))return'takip';if(g==='kutu')return'kutu';
      if(k||W_KOSU_G.has(g))return'kosu';return'diger';};
    const kutuda=(m,x,z,t)=>Math.abs(x-m.dir[t]*W_PL)<W_CU&&Math.abs(z-W_MZ)<W_CW;
    const genisMi=z=>z<=8||z>=W_PW-8;
    const ilkYaz=k=>{ilk[k]=(ilk[k]||0)+1;kt=null;};
    const sutAni=(m,p)=>{if(!p||p.team==null)return;const t=p.team;let f=0;
      for(const q of m.teams[t])if(q!==p&&q.oyunda&&q.rol!=='GK'&&q.rol!=='FV'&&kutuda(m,q.x,q.z,t)){f++;fdk[fdKaynak(m,q)]++;}sN++;sFd+=f;if(f)sFd1++;};
    const ortaAni=(m,p,q)=>{if(!p||p.team==null)return;const t=p.team;let h=0,f=0,s=0;
      for(const r of m.teams[t])if(r!==p&&r.oyunda&&r.rol!=='GK'&&kutuda(m,r.x,r.z,t)){h++;if(r.rol!=='FV')f++;}
      for(const r of m.teams[1-t])if(r.oyunda&&r.rol!=='GK'&&kutuda(m,r.x,r.z,t))s++;
      oN++;oHuc+=h;oFd+=f;oSav+=s;if(p.mevki&&p.mevki.kanat)oKanat++;else if(p.mevki&&p.mevki.bek)oBek++;else if(p.rol==='FV')oFv++;else if(p.rol==='OS')oMk++;
      if(p.rol!=='FV'){oFvN++;for(const r of m.teams[t])if(r.oyunda&&r.rol==='FV'&&kutuda(m,r.x,r.z,t))oFvK++;}
      orta={t:m.t,p,q:q||null,team:t};};
    return{
      dinle(ad,v,m){if(!m)return;
        if(ad==='kosu'&&v.tur){kosu[v.tur]=(kosu[v.tur]||0)+1;if(v.pas)kosu.gecGirisPas=(kosu.gecGirisPas||0)+1;if(v.p)sonKosu.set(v.p,{tur:v.tur,t:m.t});return;}
        const p=v&&v.p;
        if(ad==='cross'){ortaAni(m,p,v.q);if(kt&&kt.p===p)ilkYaz('orta');}
        else if(ad==='pass'){if(v.tur==='geriCevir'){ortaAni(m,p,v.q);if(kt&&kt.p===p)ilkYaz('geri');}else if(kt&&kt.p===p)ilkYaz('pas');}
        else if(ad==='shot'){sutAni(m,p);if(kt&&kt.p===p)ilkYaz('sut');}
        else if(ad==='header'){if(v.shot)sutAni(m,p);if(p&&p.eylem&&p.eylem.plonjon){plN++;if(v.shot)plS++;}}
        else if(ad==='calim'){if(kt&&kt.p===p)ilkYaz('calim');}},
      adim(m){adim++;const b=m.ball,s=b.sahip;
        if(m.phase!=='play'){orta=null;kt=null;sonS=null;return;}
        /* ortadan sonra ilk dokunan */
        if(orta){if(m.t-orta.t>3)orta=null;else{const sd=b.sonDokunan;if(sd&&sd!==orta.p){oBitN++;if(sd===orta.q)oAlici++;if(sd.team===orta.team)oHucIlk++;orta=null;}}}
        /* kanadın topla ilk işi: yalnız sahip değişince (top elindeyken yaptığı ikinci iş sayılmaz) */
        if(s!==sonS){if(kt&&s&&s!==kt.p)ilkYaz('kayip');
          if(s&&s.team!=null&&s.mevki&&s.mevki.kanat&&s.x*m.dir[s.team]>W_PL-35&&(!kt||kt.p!==s)){kt={p:s,t:m.t};ktN++;}
          sonS=s;}
        if(adim%6||!s||s.team==null)return;
        const t=s.team,d=m.dir[t],bu=b.x*d;if(bu<=W_PL-35)return;
        const bk=Math.abs(b.z-W_MZ)>10?Math.sign(b.z-W_MZ):0;
        for(const q of m.teams[t]){if(q===s||!q.oyunda||!q.mevki||!q.mevki.kanat)continue;
          const ky=Math.sign(q.mevki.w-W_MZ),g=genisMi(q.z);n++;if(g)genis++;
          if(bk===ky){ayN++;if(g)ayG++;if((q.x-b.x)*d>2)ayO++;}
          else if(bk===-ky){uzN++;if(kutuda(m,q.x,q.z,t))uzK++;if(g)uzG++;}
          else{orN++;if(g)orG++;}}},
      bitir(){if(kt)ilkYaz('kayip');
        const ilkTop=W_ILK.reduce((a,k)=>a+(ilk[k]||0),0),ham={wGenis:[genis,n],wAyniGenis:[ayG,ayN],wAyniOnde:[ayO,ayN],wUzakKutu:[uzK,uzN],wUzakGenis:[uzG,uzN],
          wOrtaGenis:[orG,orN],wOrtaKanat:[oKanat,oN],wOrtaBek:[oBek,oN],wOrtaForvet:[oFv,oN],wOrtaMerkez:[oMk,oN],wOrtaAlici:[oAlici,oBitN],wOrtaHucumIlk:[oHucIlk,oBitN],wSutFd1:[sFd1,sN],wPlonjonSut:[plS,plN]};
        for(const k of W_ILK)ham['wIlk_'+k]=[ilk[k]||0,ilkTop];
        {let n=0;for(const k of W_FDK)n+=fdk[k];for(const k of W_FDK)ham['wFK_'+k]=[fdk[k],n];}   /* T24-0 */
        const r={ham,wOrtaHucum:oN?oHuc/oN:NaN,wOrtaFd:oN?oFd/oN:NaN,wOrtaSav:oN?oSav/oN:NaN,wSutFd:sN?sFd/sN:NaN,wOrtaFvKutu:oFvN?oFvK/oFvN:NaN,wKanatTop:ktN,wPlonjon:plN};
        for(const k of W_KOSU)r['wKosu_'+k]=kosu[k]||0;return r;}
    };
  }
};
