'use strict';
/* ============ "Top gövdeden geçti" teşhisi (gerçekçilik planı T0 madde 7) ============
   Yalnız MAC_DENEME_GECIS=1 iken çalışır (teşhis aracıdır; varsayılan çıktı ve süre değişmesin). mac-deneme'deki sayımla aynı tanım: top oyundayken,
   adım sonunda top hızlı (yatay >3 m/sn), yerden 1,8 m'den alçak, sahibi/taşıyanı olmayan bir oyuncunun ekseninden 0,22 m'den yakın; oyuncu
   başına içeri girişte bir kez. Her olay etiketlenir: neden gövde çarpması olmadı (govdeCarpmasi'nın muafiyetleri, mac-mudahale.js; sırayla),
   oyuncunun eylemi, kickCd, son dokunan mı, top hızı, önceki adımda 0,37 m'nin dışında mıydı (tek adımda içeri). Ayrıca sayılmayan "tam geçiş":
   adımın başında ve sonunda dışarıda (>0,37 m) ama bağıl yol (topun yolu − oyuncunun yolu) eksene 0,22 m'den yakın geçmiş (süpürme testi;
   kaleciSegD örneği). Rastlantı çekmez, motor yöntemi çağırmaz. Kullanım: MAC_DENEME_GECIS=1 node araclar/mac-deneme.js 40 */
const GG_ACIK=process.env.MAC_DENEME_GECIS==='1';
const GG_NEDEN=[['ucus','kalecinin uçuşu'],['vurus','vuruş eylemi (hazırlık/geri/takip)'],['kendi','son dokunan, kickCd>0 (kendi vuruşu)'],
  ['erisim','topa erişebilir (ad listesinde)'],['uzak','bağıl hız dışarı (dot ≥ 0)'],['yuksek','boyunun üstünde'],['diger','diğer (başka beden önce, erken dönüş)']];
const GG_HIZ=[[8,'3–8'],[15,'8–15'],[25,'15–25'],[99,'>25']];
/* (ax,az)→(bx,bz) doğru parçasının başlangıç noktasına (0,0) en kısa uzaklığı: bağıl yol */
const ggSeg=(ax,az,bx,bz)=>{const vx=bx-ax,vz=bz-az,L2=vx*vx+vz*vz;let t=L2?-(ax*vx+az*vz)/L2:0;t=t<0?0:t>1?1:t;return Math.sqrt((ax+vx*t)**2+(az+vz*t)**2);};
module.exports={
  bilgi:GG_ACIK?[['— G: top gövdeden geçti teşhisi —',null,0],['Sayılan (mac-deneme tanımı)','gSay',1],['Sayılmayan tam geçiş (süpürme)','gTam',1]]:[],
  yeni:()=>{
    if(!GG_ACIK)return{};
    const say={},art=k=>{say[k]=(say[k]||0)+1;},icinde=new Set(),once=new Map();let n=0,tam=0;
    return{
      adim(m){const b=m.ball,oyun=m.phase==='play',bh=Math.sqrt(b.vx*b.vx+b.vz*b.vz);
        for(const p of m.players){if(!p.oyunda)continue;const o=once.get(p)||{x:p.x,z:p.z};once.set(p,{x:p.x,z:p.z});if(!oyun)continue;
          const d=Math.sqrt((b.x-p.x)**2+(b.z-p.z)**2),d0=Math.sqrt((b.px-o.x)**2+(b.pz-o.z)**2),aday=bh>3&&b.y<1.8&&b.sahip!==p&&b.tasiyan!==p;
          const ic=aday&&d<0.22;
          if(ic&&!icinde.has(p)){icinde.add(p);n++;const e=p.eylem,ea=e?e.ad+(e.ad==='vurus'&&e.faz?':'+e.faz:''):'yok';
            const dx=b.x-p.x,dz=b.z-p.z,dot=(b.vx-(p.vx||0))*dx+(b.vz-(p.vz||0))*dz;
            const eris=p.kickCd<=0&&!(e&&(e.kilit||e.ad==='tac'))&&((d<0.6&&b.y<0.8)||(d<0.5&&b.y>=0.8&&b.y<1.55));
            const neden=e&&e.ad==='ucus'?'ucus':e&&e.ad==='vurus'?'vurus':p===b.sonDokunan&&p.kickCd>0?'kendi':eris?'erisim':dot>=0?'uzak':b.y>1.8*(p.boy||1)+(p.yuk||0)?'yuksek':'diger';
            art('n_'+neden);art('e_'+ea);art((p===b.sonDokunan?'kn_':'bn_')+neden);if(p!==b.sonDokunan)art('be_'+ea);if(p.kickCd>0)art('kcd');if(p===b.sonDokunan)art('son');if(d0>0.37)art('tunel');if(p.rol==='GK')art('gk');
            art('h_'+GG_HIZ.find(([s])=>bh<s)[1]);}
          else if(!ic)icinde.delete(p);
          /* tam geçiş: başta ve sonda dışarıda, bağıl yol eksene yakın */
          if(aday&&d>0.37&&d0>0.37&&ggSeg(b.px-o.x,b.pz-o.z,b.x-p.x,b.z-p.z)<0.22)tam++;}},
      bitir(){const r={gSay:n,gTam:tam,gEtiket:say};return r;}
    };
  },
  ozet(sonuclar){
    if(!GG_ACIK)return;
    const N=sonuclar.length,T={};for(const s of sonuclar)for(const [k,v] of Object.entries(s.gEtiket||{}))T[k]=(T[k]||0)+v;
    const top=sonuclar.reduce((a,s)=>a+(s.gSay||0),0)||1,f=k=>((T[k]||0)/N).toFixed(2).padStart(6)+(' (%'+(100*(T[k]||0)/top).toFixed(0)+')').padStart(7);
    console.log(`\n  Top gövdeden geçti: ${(top/N).toFixed(2)} / maç · etiketler (maç başına, sayılanların payı)`);
    console.log('  Muafiyet: '+GG_NEDEN.map(([k,a])=>a+' '+f('n_'+k).trim()).join(' · '));
    console.log('  Eylem: '+Object.keys(T).filter(k=>k.startsWith('e_')).sort((a,b)=>T[b]-T[a]).map(k=>k.slice(2)+' '+f(k).trim()).join(' · '));
    console.log('  kickCd>0 '+f('kcd').trim()+' · son dokunan '+f('son').trim()+' · önceki adımda >0,37 m (tek adımda içeri) '+f('tunel').trim()+' · kaleci '+f('gk').trim());
    const bt=Object.keys(T).filter(k=>k.startsWith('bn_')).reduce((a,k)=>a+T[k],0);
    console.log('  Kendi topu (son dokunan) muafiyetleri: '+GG_NEDEN.filter(([k])=>T['kn_'+k]).map(([k,a])=>a+' '+f('kn_'+k).trim()).join(' · '));
    console.log(`  Başkasının topu: ${(bt/N).toFixed(2)} / maç · `+GG_NEDEN.filter(([k])=>T['bn_'+k]).map(([k,a])=>a+' '+f('bn_'+k).trim()).join(' · '));
    console.log('    eylem: '+Object.keys(T).filter(k=>k.startsWith('be_')).sort((a,b)=>T[b]-T[a]).map(k=>k.slice(3)+' '+f(k).trim()).join(' · '));
    console.log('  Top hızı (m/sn): '+GG_HIZ.map(([,a])=>a+' '+f('h_'+a).trim()).join(' · '));
    console.log('  Sayılmayan tam geçiş (süpürme): '+(sonuclar.reduce((a,s)=>a+(s.gTam||0),0)/N).toFixed(2)+' / maç');
  }
};
