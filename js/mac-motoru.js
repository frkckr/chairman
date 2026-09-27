/* ============ Demirkapı '99 — maç motoru: görüntüden bağımsız oyun mantığı. Henüz '99 sahnesine bağlı değil; retro ve 3B prototiplerde çalışıyor ============ */
/* ============ maç motoru ============ */
const PL=52.5,PW=68,MZ=34,GH=2.44,GW2=3.66,ROLL=3.0,GPR=18; // GPR: 1 gerçek saniye = 18 maç saniyesi (90 dk ≈ 5 dk)
const FORM=[['GK',-0.95,34],['DEF',-0.64,10],['DEF',-0.68,26],['DEF',-0.68,42],['DEF',-0.64,58],
  ['MID',-0.26,12],['MID',-0.32,28],['MID',-0.32,40],['MID',-0.26,56],['FWD',0.06,28],['FWD',0.1,41]];
const SKINS=[[226,178,138],[204,150,108],[176,120,84],[140,94,64],[236,196,160]];
const HAIRS=[[36,24,16],[60,38,22],[20,18,18],[96,70,40],[170,130,70]];
function segD(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az;const L2=vx*vx+vz*vz||1;const t=clamp((vx*wx+vz*wz)/L2,0,1);return Math.hypot(px-ax-vx*t,pz-az-vz*t);}

class Match{
  constructor(on){this.on=on||(()=>{});this.reset();}
  reset(){
    this.score=[0,0];this.shots=[0,0];this.poss=[0,0];this.half=1;this.gameSec=0;
    this.added=[60+Math.floor(rnd()*100),60+Math.floor(rnd()*170)];
    this.dir=[1,-1];this.t=0;this.phase='kickoff';this.phaseT=0;this.sp=null;this.celeb=null;
    this.players=[];this.teams=[[],[]];
    for(let t=0;t<2;t++)for(let i=0;i<11;i++){
      const f=FORM[i],s=h2(i*7+3,t*13+5);
      const p={team:t,n:i,role:f[0],ba:f[1],bz:f[2],name:TEAMS[t].names[i],x:0,z:MZ,vx:0,vz:0,tx:0,tz:MZ,face:1,anim:rnd()*4,spd:0,
        pose:'stand',poseT:0,kickCd:0,decT:0,skill:0.55+s*0.4,maxSpd:f[0]==='GK'?6.4:7+h2(i,t)*1.3,
        skin:SKINS[Math.floor(h2(i,t+9)*5)],hair:HAIRS[Math.floor(h2(i+3,t)*5)],mus:h2(i,t+21)<0.45,
        jx:0,jz:0,jT:0,walk:false,dribble:false,hold:0,celeb:false,dived:false,diveY:0.5};
      this.players.push(p);this.teams[t].push(p);
    }
    const mk=(kind,x,z)=>({kind,x,z,vx:0,vz:0,tx:x,tz:z,face:1,anim:0,spd:0,maxSpd:7,pose:'stand',poseT:0,kickCd:0,walk:false});
    this.refs=[mk('ref',-6,26),mk('lin',20,PW+1.3),mk('lin',-20,-1.3)];
    this.ball={x:0,z:MZ,y:0,vx:0,vz:0,vy:0,owner:null,lastTeam:0,lastP:null,shot:null,intended:null,wood:false,inNet:false,prevX:0};
    this.setupKickoff(0,true);
  }
  focus(){const c=this.celeb;if(this.phase==='goal'&&c&&c.scorer&&!c.own)return{x:c.scorer.x,y:1,z:c.scorer.z};const b=this.ball;return{x:b.x,y:b.y,z:b.z};}
  minuteLabel(){
    if(this.phase==='halftime')return 'İY';if(this.phase==='fulltime')return 'MS';
    const s=this.gameSec;
    if(this.half===1&&s>=2700)return '45+'+(Math.floor((s-2700)/60)+1);
    if(this.half===2&&s>=5400)return '90+'+(Math.floor((s-5400)/60)+1);
    return String(Math.floor(s/60)+1);
  }
  step(dt){
    this.t+=dt;this.phaseT+=dt;
    if(this.phase!=='halftime'&&this.phase!=='fulltime')this.gameSec+=dt*GPR;
    this.refsAI();
    switch(this.phase){
      case 'kickoff':this.stepKick(dt);break;
      case 'play':this.stepPlay(dt);break;
      case 'setpiece':this.stepSet(dt);break;
      case 'goal':this.stepGoal(dt);break;
      default:this.stepBreak(dt);
    }
    if(this.phase==='play'||this.phase==='setpiece'||this.phase==='kickoff'){
      const lim=this.half===1?2700+this.added[0]:5400+this.added[1];
      if(this.gameSec>=lim&&(Math.abs(this.ball.x)<38||this.gameSec>lim+120))this.endHalf();
    }
  }

  /* ---- santra ---- */
  setupKickoff(team,tele){
    this.phase='kickoff';this.phaseT=0;this.kickTeam=team;this.sp=null;this.celeb=null;
    Object.assign(this.ball,{x:0,z:MZ,y:0,vx:0,vz:0,vy:0,owner:null,shot:null,intended:null,wood:false,inNet:false,prevX:0});
    for(const p of this.players){
      const d=this.dir[p.team];let a=Math.min(p.ba,-0.06);if(p.role==='FWD')a=-0.04;
      let x=a*50*d,z=p.bz;
      if(p.team===team&&p.n===9){x=-d*0.7;z=MZ;}
      else if(p.team===team&&p.n===10){x=-d*1.2;z=MZ+4;}
      else if(p.team!==team){const dz=z-MZ,dd=Math.hypot(x,dz);if(dd<9.8){const k=9.8/(dd||1);x=-d*Math.abs(x*k||9.8);z=MZ+dz*k;}}
      p.tx=x;p.tz=z;p.pose='stand';p.poseT=0;p.walk=false;p.dribble=false;p.hold=0;p.celeb=false;p.dived=false;p.kickCd=0;
      if(tele){p.x=x;p.z=z;p.vx=p.vz=0;p.face=d;}
    }
    if(tele){const r=this.refs[0];r.x=-6;r.z=26;}
  }
  stepKick(dt){
    this.moveAll(dt);this.ballPhys(dt);
    let ready=true;for(const p of this.players)if(Math.hypot(p.tx-p.x,p.tz-p.z)>1.3){ready=false;break;}
    if(this.phaseT>1.6&&(ready||this.phaseT>8)){
      const tm=this.teams[this.kickTeam],tk=tm[9],rc=tm[6];
      this.on('kickoff',{team:this.kickTeam,half:this.half});
      this.phase='play';this.phaseT=0;
      this.kickTo(tk,rc.x,rc.z,'ground',rc);
    }
  }

  /* ---- oyun ---- */
  stepPlay(dt){
    const b=this.ball;
    if(b.owner)this.poss[b.owner.team]+=dt;
    this.ai(dt,true);
    if(b.owner)this.ownerAI(b.owner,dt);
    this.moveAll(dt);
    this.ballPhys(dt);
    if(this.phase!=='play')return;
    this.control();
    this.checkBounds();
  }
  ai(dt,chase){
    const b=this.ball,own=b.owner,poss=own?own.team:-1,sp=this.phase==='setpiece'?this.sp:null;
    let lx=b.x,lz=b.z;
    if(!own&&b.y>0.3){const T=(b.vy+Math.sqrt(b.vy*b.vy+19.62*b.y))/9.81;lx=b.x+b.vx*T;lz=b.z+b.vz*T;}
    for(let t=0;t<2;t++){
      const tm=this.teams[t],d=this.dir[t],ba=clamp(b.x*d/50,-1,1);
      const att=poss===t||(poss===-1&&b.lastTeam===t);
      const shift=att?0.22+ba*0.42:-0.08+ba*0.42;
      let c1=null,c2=null;
      if(chase&&poss!==t){let d1=1e9,d2=1e9;for(const p of tm){if(p.role==='GK')continue;const dd=Math.hypot(p.x-lx,p.z-lz);if(dd<d1){c2=c1;d2=d1;c1=p;d1=dd;}else if(dd<d2){c2=p;d2=dd;}}}
      for(const p of tm){
        if(p===own||(sp&&p===sp.taker))continue;
        p.walk=false;p.dribble=false;
        p.jT-=dt;if(p.jT<=0){p.jT=2+rnd()*3;p.jx=(rnd()*2-1)*4;p.jz=(rnd()*2-1)*5;}
        if(p.role==='GK'){this.gkAI(p,dt);continue;}
        if(!own&&chase&&b.intended===p){this.intercept(p);continue;}
        if(p===c1){if(poss===-1)this.intercept(p);else{p.tx=own.x-d*1.1;p.tz=own.z;}continue;}
        if(p===c2&&poss!==-1){p.tx=lerp(own.x,-d*PL,0.22);p.tz=lerp(own.z,MZ,0.3);continue;}
        let a=p.ba+shift;
        if(p.role==='FWD'&&att)a+=0.1+(ba>0.25?0.22:0);
        if(p.role==='MID'&&att&&ba>0.4)a+=0.08;
        if(p.role==='DEF')a=Math.min(a,att?0.22:0.02);
        a=clamp(a,-0.9,0.86);
        let z=p.bz+(b.z-MZ)*(att?0.2:0.36);if(att)z+=(p.bz-MZ)*0.12;
        p.tx=a*50*d+p.jx*(att?1:0.4);p.tz=clamp(z+p.jz*(att?1:0.3),2,66);
        if(p.role==='FWD'&&att&&ba>0.5){p.tx=d*(PL-9-(p.n===9?0:5));p.tz=MZ+(p.n===9?-3:4)+p.jz*0.4;}
      }
    }
  }
  intercept(p){
    const b=this.ball;
    if(b.y>0.4){const T=(b.vy+Math.sqrt(b.vy*b.vy+19.62*b.y))/9.81;p.tx=b.x+b.vx*T;p.tz=b.z+b.vz*T;return;}
    const sp=Math.hypot(b.vx,b.vz);
    if(sp<0.6){p.tx=b.x;p.tz=b.z;return;}
    const ux=b.vx/sp,uz=b.vz/sp;let s=0;
    for(;s<=36;s+=1.5){const disc=sp*sp-2*ROLL*s;if(disc<0)break;const tb=(sp-Math.sqrt(disc))/ROLL;if(Math.hypot(b.x+ux*s-p.x,b.z+uz*s-p.z)/p.maxSpd<=tb+0.1)break;}
    p.tx=b.x+ux*s;p.tz=b.z+uz*s;
  }
  gkAI(p,dt){
    const b=this.ball,d=this.dir[p.team],gx=-d*PL;
    if(p.pose==='dive'||b.owner===p)return;
    const sh=b.shot;
    if(sh&&sh.team!==p.team&&!sh.gkDone&&b.vx*d<0){
      const tt=(p.x-b.x)/b.vx;
      if(tt>0&&tt<1.3){
        const zAt=b.z+b.vz*tt,yAt=b.y+b.vy*tt-4.905*tt*tt;
        p.tx=p.x;p.tz=clamp(zAt,MZ-4,MZ+4);
        if(tt<0.45&&!p.dived&&Math.abs(zAt-p.z)>0.9&&Math.abs(zAt-MZ)<GW2+1.2){
          p.pose='dive';p.poseT=0.8;p.dived=true;p.vz=clamp((zAt-p.z)/0.32,-8,8);p.vx=0;p.diveY=clamp(yAt*0.6,0.2,1.4);
          this.on('dive',{p});
        }
        return;
      }
    }
    const bd=Math.hypot(b.x-gx,b.z-MZ),inBox=Math.abs(b.x-gx)<16.5&&Math.abs(b.z-MZ)<20.2;
    if(!b.owner&&inBox&&!sh&&Math.hypot(b.x-p.x,b.z-p.z)<10&&Math.hypot(b.vx,b.vz)<10){this.intercept(p);return;}
    const adv=bd<35?1.2+(35-bd)*0.07:1.4;
    p.tx=gx+d*adv;p.tz=MZ+clamp((b.z-MZ)*0.2,-3,3);
  }
  ownerAI(p,dt){
    const b=this.ball,d=this.dir[p.team],opp=this.teams[1-p.team];
    if(p.hold>0){p.hold-=dt;p.tx=p.x;p.tz=p.z;p.dribble=true;
      if(p.hold<=0){const q=this.pickLong(p);this.kickTo(p,q.x+d*4,q.z,'lofted',q);this.on('gkkick',{p});}return;}
    const gx=d*PL,dxg=gx-p.x,dzg=MZ-p.z,dist=Math.hypot(dxg,dzg);
    let near=null,nd=1e9;for(const o of opp){const dd=Math.hypot(o.x-p.x,o.z-p.z);if(dd<nd){nd=dd;near=o;}}
    let ux,uz;if(dist>30){ux=d;uz=(MZ-p.z)*0.01;}else{ux=dxg/dist;uz=dzg/dist;}
    if(near&&nd<6&&(near.x-p.x)*d>-1.5){ux+=(p.x-near.x)/nd*0.9;uz+=(p.z-near.z)/nd*0.9;}
    const ul=Math.hypot(ux,uz)||1;ux/=ul;uz/=ul;
    if(p.z<3&&uz<0)uz=0.25;if(p.z>65&&uz>0)uz=-0.25;
    p.tx=p.x+ux*6;p.tz=clamp(p.z+uz*6,1.5,66.5);p.dribble=true;
    if(p.x*d>PL-2.5)p.tx=d*(PL-3);
    p.decT-=dt;if(p.decT>0)return;
    p.decT=0.3+rnd()*0.55;
    const pressure=nd<3.2,fa=p.x*d/50;
    if(p.role==='GK'){const q=this.pickLong(p);this.kickTo(p,q.x+d*4,q.z,'lofted',q);return;}
    if(dist<27&&Math.abs(dzg)<22){let ps=dist<11?0.8:dist<17?0.5:dist<22?0.26:0.12;if(pressure)ps*=1.25;if(rnd()<ps){this.shoot(p);return;}}
    if(fa>0.6&&Math.abs(p.z-MZ)>17&&rnd()<0.45){this.cross(p);return;}
    const bp=this.bestPass(p);
    if(bp&&(bp.score>1.0||(pressure&&bp.score>0.1)||rnd()<0.13)){this.kickTo(p,bp.x,bp.z,bp.long?'lofted':'ground',bp.q);this.on('pass',{p,q:bp.q,long:bp.long});return;}
    if(pressure&&fa<-0.45&&rnd()<0.5){this.kickTo(p,p.x+d*42,clamp(p.z+(rnd()-0.5)*30,6,62),'lofted',null);this.on('clear',{p});}
  }
  bestPass(p){
    const d=this.dir[p.team],opp=this.teams[1-p.team],deep=p.x*d<-30;let best=null;
    for(const q of this.teams[p.team]){
      if(q===p||(q.role==='GK'&&!deep))continue;
      const tx=q.x+q.vx*0.5,tz=q.z+q.vz*0.5,L=Math.hypot(tx-p.x,tz-p.z);
      if(L<5||L>50)continue;
      const long=L>30;let risk=0,open=99;
      for(const o of opp){
        if(long){const s=Math.hypot(o.x-tx,o.z-tz);if(s<3)risk+=(3-s)*0.8;}
        else{const s=segD(o.x,o.z,p.x,p.z,tx,tz);if(s<2.4)risk+=2.4-s;}
        open=Math.min(open,Math.hypot(o.x-q.x,o.z-q.z));
      }
      const sc=(tx-p.x)*d/18*0.7+Math.min(open,9)/9*0.7-risk*0.8-Math.abs(L-17)/45-(long?0.25:0)+rnd()*0.3;
      if(!best||sc>best.score)best={q,x:tx,z:tz,long,score:sc};
    }
    return best;
  }
  pickLong(p){
    const d=this.dir[p.team],opp=this.teams[1-p.team];let best=null,bs=-1e9;
    for(const q of this.teams[p.team]){
      if(q===p||q.role==='GK'||q.role==='DEF')continue;
      let open=99;for(const o of opp)open=Math.min(open,Math.hypot(o.x-q.x,o.z-q.z));
      const s=q.x*d*0.08+Math.min(open,10)*0.3+rnd()*1.5;if(s>bs){bs=s;best=q;}
    }
    return best;
  }
  kickTo(p,tx,tz,mode,recv){
    const b=this.ball,dx=tx-b.x,dz=tz-b.z,L=Math.hypot(dx,dz)||1;
    const err=(1.15-p.skill)*(mode==='lofted'?0.1:0.05)*(rnd()*2-1),ca=Math.cos(err),sa=Math.sin(err);
    const ux=(dx*ca-dz*sa)/L,uz=(dx*sa+dz*ca)/L;
    if(mode==='ground'){const v=Math.sqrt(2*ROLL*L+30)*(0.96+rnd()*0.08);b.vx=ux*v;b.vz=uz*v;b.vy=0;b.y=0;}
    else{const T=mode==='throw'?0.55+L/24:0.9+L/28,v=L/T*(0.97+rnd()*0.06);b.vx=ux*v;b.vz=uz*v;
      if(mode==='throw'){b.y=2;b.vy=(4.905*T*T-2)/T;}else{b.y=0.1;b.vy=4.905*T;}}
    this.release(p);b.intended=recv||null;
  }
  release(p){const b=this.ball;b.owner=null;b.lastTeam=p.team;b.lastP=p;p.kickCd=0.45;b.wood=false;p.dribble=false;p.hold=0;}
  shoot(p){
    const b=this.ball,d=this.dir[p.team],gx=d*PL,dist=Math.hypot(gx-p.x,MZ-p.z);
    let tz=MZ+(rnd()<0.5?-1:1)*(1.1+rnd()*2.5);
    tz+=(dist/25)*(1.25-p.skill*0.5)*(rnd()*2-1)*3.2;
    const ty=rnd()*rnd()*2.7,speed=23+rnd()*8-dist*0.05;
    const dx=gx-b.x,dz=tz-b.z,L=Math.hypot(dx,dz),T=L/speed;
    b.vx=dx/L*speed;b.vz=dz/L*speed;b.y=0.12;b.vy=(ty-0.12+4.905*T*T)/T;
    this.release(p);b.intended=null;b.shot={team:p.team,by:p,gkDone:false};this.shots[p.team]++;
    this.on('shot',{p,dist});
  }
  cross(p){const d=this.dir[p.team];this.kickTo(p,d*(PL-7-rnd()*6),MZ+(rnd()-0.5)*12,'lofted',null);this.on('cross',{p});}
  inOwnBox(p){const gx=-this.dir[p.team]*PL;return Math.abs(p.x-gx)<16.5&&Math.abs(p.z-MZ)<20.2;}
  clearDives(){this.teams[0][0].dived=false;this.teams[1][0].dived=false;}
  control(){
    const b=this.ball;if(b.owner)return;
    const sh=b.shot,sp=Math.hypot(b.vx,b.vz);let best=null,bd=1e9;
    for(const p of this.players){
      if(p.kickCd>0||p.pose==='dive')continue;
      if(sh&&p.role==='GK'&&p.team!==sh.team)continue; // kaleci kurtarışı saveCheck'te
      const dd=Math.hypot(p.x-b.x,p.z-b.z),gk=p.role==='GK'&&this.inOwnBox(p);
      if(dd<(gk?1.3:0.95)&&b.y<(gk?2.6:1.5)&&dd<bd){best=p;bd=dd;}
    }
    if(!best){this.headers();return;}
    if(sh&&best.team!==sh.team){
      b.vx=-b.vx*0.3+(rnd()-0.5)*8;b.vz=b.vz*0.4+(rnd()-0.5)*10;b.vy=2+rnd()*4;b.lastTeam=best.team;b.lastP=best;best.kickCd=0.4;b.shot=null;this.clearDives();
      this.on('block',{p:best});return;
    }
    if(sp>17&&best.role!=='GK'&&rnd()<0.5){b.vx=b.vx*0.35+(rnd()-0.5)*4;b.vz=b.vz*0.35+(rnd()-0.5)*4;b.lastTeam=best.team;b.lastP=best;best.kickCd=0.25;return;}
    const steal=b.lastTeam!==best.team;
    b.owner=best;b.vx=b.vz=b.vy=0;b.y=0;b.lastTeam=best.team;b.lastP=best;b.intended=null;b.shot=null;b.wood=false;
    best.decT=0.25+rnd()*0.3;this.clearDives();
    if(best.role==='GK'&&this.inOwnBox(best))best.hold=1.1+rnd()*0.9;
    else if(steal)this.on('steal',{p:best});
  }
  headers(){
    const b=this.ball;if(b.y<1.5||b.y>2.9)return;
    for(const p of this.players){
      if(p.kickCd>0||p.role==='GK'||p.pose==='dive')continue;
      if(Math.hypot(p.x-b.x,p.z-b.z)>0.9)continue;
      const d=this.dir[p.team],gx=d*PL,dist=Math.hypot(gx-p.x,MZ-p.z);
      if(dist<16&&rnd()<0.8){
        const tz=MZ+(rnd()*2-1)*3.3,dx=gx-b.x,dz=tz-b.z,L=Math.hypot(dx,dz),v=13+rnd()*5;
        b.vx=dx/L*v;b.vz=dz/L*v;b.vy=-0.5+rnd()*2.5;this.release(p);b.shot={team:p.team,by:p,gkDone:false};this.shots[p.team]++;
        this.on('header',{p,shot:true});
      }else{
        const ang=(rnd()-0.5)*1.4,v=9+rnd()*5;b.vx=d*Math.cos(ang)*v;b.vz=Math.sin(ang)*v;b.vy=3+rnd()*3;this.release(p);
        this.on('header',{p,shot:false});
      }
      p.pose='head';p.poseT=0.35;return;
    }
  }
  saveCheck(){
    const b=this.ball,sh=b.shot;if(!sh||sh.gkDone)return;
    const def=1-sh.team,gk=this.teams[def][0],d=this.dir[def];
    if(b.vx*d>=0||Math.abs(b.x-gk.x)>0.8)return;
    sh.gkDone=true;
    const rz=Math.abs(b.z-gk.z),dive=gk.pose==='dive',maxR=dive?2.4:1.15;
    if(rz>maxR||b.y>2.6)return;
    const spd=Math.hypot(b.vx,b.vz),ps=0.94-rz*0.19-(spd-20)*0.018+gk.skill*0.08-(b.y>1.9?0.1:0);
    if(rnd()>=ps)return;
    if(!dive&&rz<0.8&&rnd()<0.65){b.owner=gk;b.vx=b.vz=b.vy=0;b.y=0;b.lastTeam=def;b.lastP=gk;b.shot=null;b.intended=null;gk.hold=1.3+rnd();this.on('save',{p:gk,catch:true});}
    else{b.vx=-b.vx*(0.22+rnd()*0.25);b.vz=b.vz*0.3+(rnd()-0.5)*12;b.vy=2+rnd()*4;b.lastTeam=def;b.lastP=gk;gk.kickCd=0.5;b.shot=null;this.on('save',{p:gk,catch:false});}
  }
  ballPhys(dt){
    const b=this.ball;b.prevX=b.x;
    if(b.owner){
      const p=b.owner;let ux=p.face,uz=0;const s=Math.hypot(p.vx,p.vz);if(s>0.4){ux=p.vx/s;uz=p.vz/s;}
      if(p.hold>0){b.x=p.x+p.face*0.3;b.z=p.z;b.y=1.0;}else{b.x=p.x+ux*0.6;b.z=p.z+uz*0.6;b.y=0;}
      b.vx=p.vx;b.vz=p.vz;b.vy=0;return;
    }
    if(b.y>0||b.vy>0){b.vy-=9.81*dt;b.y+=b.vy*dt;if(b.y<=0){b.y=0;if(b.vy<-2){b.vy=-b.vy*0.42;b.vx*=0.78;b.vz*=0.78;}else b.vy=0;}}
    else{const s=Math.hypot(b.vx,b.vz);if(s>0){const ns=Math.max(0,s-ROLL*dt);b.vx*=ns/s;b.vz*=ns/s;}}
    b.x+=b.vx*dt;b.z+=b.vz*dt;
    if(b.inNet){
      if(Math.abs(b.x)>PL+1.9){b.x=Math.sign(b.x)*(PL+1.9);b.vx*=-0.15;}
      if(Math.abs(b.z-MZ)>GW2-0.15){b.z=MZ+Math.sign(b.z-MZ)*(GW2-0.15);b.vz*=-0.2;}
      if(b.y>GH-0.15){b.y=GH-0.15;b.vy=-Math.abs(b.vy)*0.3;}
      b.vx*=0.98;b.vz*=0.98;
    }
    if(b.shot){this.saveCheck();if(b.shot&&Math.hypot(b.vx,b.vz)<7){b.shot=null;this.clearDives();}}
  }
  checkBounds(){
    const b=this.ball;
    if(b.owner){const p=b.owner;p.x=clamp(p.x,-PL+0.6,PL-0.6);p.z=clamp(p.z,0.6,PW-0.6);return;}
    const ax=Math.abs(b.x);
    if(ax>PL){
      const side=Math.sign(b.x),dz=Math.abs(b.z-MZ),crossed=Math.abs(b.prevX)<=PL;
      if(crossed&&!b.wood){
        const post=Math.abs(dz-GW2)<0.2&&b.y<GH+0.1,bar=dz<GW2+0.1&&Math.abs(b.y-GH)<0.16;
        if(post||bar){b.x=side*(PL-0.05);b.vx=-b.vx*0.55;if(post)b.vz=-b.vz*0.3+(rnd()-0.5)*6;if(bar)b.vy=-Math.abs(b.vy)*0.5-1;
          b.wood=true;b.shot=null;this.clearDives();this.on('wood',{p:b.lastP});return;}
        if(dz<GW2&&b.y<GH){this.goal(side);return;}
      }
      if(ax>PL+0.25){
        const def=this.dir[0]===-side?0:1;
        if(b.lastTeam===def)this.setPiece('corner',1-def,side*(PL-0.3),b.z<MZ?0.3:PW-0.3);
        else this.setPiece('goalkick',def,side*(PL-5.5),MZ+(b.z<MZ?-5:5));
        return;
      }
    }
    if(b.z<-0.15||b.z>PW+0.15)this.setPiece('throw',1-b.lastTeam,clamp(b.x,-PL+1,PL-1),b.z<0?-0.2:PW+0.2);
  }

  /* ---- gol ---- */
  goal(side){
    const b=this.ball,def=this.dir[0]===-side?0:1,att=1-def;
    this.score[att]++;const own=b.lastTeam===def;
    b.inNet=true;b.shot=null;b.intended=null;this.clearDives();
    this.phase='goal';this.phaseT=0;this.celeb={team:att,side,scorer:b.lastP,own};
    this.on('goal',{team:att,scorer:b.lastP,own,score:this.score.slice()});
  }
  stepGoal(dt){
    const c=this.celeb,sc=c.own?null:c.scorer,cx=c.side*(PL-2.5),cz=PW-2.5;
    for(const p of this.players){
      p.dribble=false;
      if(p.team===c.team&&p.role!=='GK'){
        p.walk=false;
        if(p===sc){p.tx=cx;p.tz=cz;}
        else{const g=sc||{x:cx,z:cz};p.tx=g.x-c.side*(1.2+(p.n%3)*0.9);p.tz=g.z-1-(p.n%4)*0.9;}
        p.celeb=this.phaseT>0.5;
      }else{p.walk=true;const d=this.dir[p.team];p.tx=p.ba*50*d*0.8;p.tz=p.bz;}
    }
    this.moveAll(dt);this.ballPhys(dt);
    if(this.phaseT>6.5)this.setupKickoff(1-c.team,false);
  }

  /* ---- duran toplar ---- */
  setPiece(type,team,x,z){
    const b=this.ball;Object.assign(b,{x,z,y:0,vx:0,vz:0,vy:0,owner:null,shot:null,intended:null,wood:false});
    this.clearDives();
    const tm=this.teams[team];let tk=null;
    if(type==='goalkick')tk=tm[0];
    else{let bd=1e9;for(const p of tm){if(p.role==='GK')continue;const dd=Math.hypot(p.x-x,p.z-z)+(type==='corner'&&p.role==='DEF'?14:0);if(dd<bd){bd=dd;tk=p;}}}
    this.sp={type,team,x,z,taker:tk,t:0};this.phase='setpiece';this.phaseT=0;
    this.on(type,{team,taker:tk});
  }
  stepSet(dt){
    const sp=this.sp,b=this.ball,tk=sp.taker,d=this.dir[sp.team];sp.t+=dt;
    if(sp.type==='corner'){
      const gx=d*PL;
      for(const p of this.players){
        if(p===tk)continue;p.walk=false;p.dribble=false;
        if(p.role==='GK'){this.gkAI(p,dt);continue;}
        if(p.team===sp.team){
          if(p.role==='FWD'||p.n===2||p.n===3||p.n===6||p.n===7){p.tx=gx-d*(5+(p.n*37%8));p.tz=MZ+((p.n*53%13)-6);}
          else{p.tx=d*8+p.ba*20*d;p.tz=p.bz;}
        }else if(p.role!=='FWD'){p.tx=gx-d*(3+(p.n*29%9));p.tz=MZ+((p.n*41%15)-7);}
        else{p.tx=gx-d*28;p.tz=p.bz;}
      }
    }else this.ai(dt,false);
    const tx=sp.type==='throw'||sp.type==='corner'?sp.x:sp.x-d*0.7;
    const tz=sp.type==='corner'?(sp.z<MZ?sp.z-0.8:sp.z+0.8):sp.z;
    tk.tx=tx;tk.tz=tz;tk.walk=false;tk.dribble=false;
    this.moveAll(dt);
    b.x=sp.x;b.z=sp.z;b.vx=b.vz=b.vy=0;
    const at=Math.hypot(tk.x-tx,tk.z-tz)<0.9;
    b.y=sp.type==='throw'&&at?2:0;
    if(at&&sp.t>(sp.type==='corner'?2.4:1.5)){
      this.phase='play';this.phaseT=0;this.sp=null;
      if(sp.type==='throw'){
        let q=null,bd=1e9;for(const p of this.teams[sp.team]){if(p===tk||p.role==='GK')continue;const dd=Math.hypot(p.x-b.x,p.z-b.z);if(dd>3&&dd<bd){bd=dd;q=p;}}
        tk.pose='throw';tk.poseT=0.45;this.kickTo(tk,q.x,q.z,'throw',q);
      }else if(sp.type==='corner')this.cross(tk);
      else{const q=this.pickLong(tk);this.kickTo(tk,q.x+d*3,q.z,'lofted',q);}
    }
  }

  /* ---- devre / maç sonu ---- */
  endHalf(){
    const b=this.ball;b.owner=null;b.vx*=0.3;b.vz*=0.3;b.shot=null;b.intended=null;this.sp=null;this.clearDives();
    const first=this.half===1;this.phase=first?'halftime':'fulltime';this.phaseT=0;this.gameSec=first?2700:5400;
    for(const p of this.players){p.walk=true;p.dribble=false;p.celeb=false;p.hold=0;p.pose='stand';p.tx=(rnd()-0.5)*8;p.tz=-2.5;}
    this.on(first?'halftime':'fulltime',{score:this.score.slice(),shots:this.shots.slice(),poss:this.poss.slice()});
  }
  stepBreak(dt){
    this.moveAll(dt);this.ballPhys(dt);
    if(this.phase==='halftime'&&this.phaseT>8){this.half=2;this.dir=[-1,1];this.setupKickoff(1,true);this.on('secondhalf',{});}
  }

  /* ---- hareket ---- */
  refsAI(){
    const b=this.ball,r=this.refs;
    if(this.phase==='halftime'||this.phase==='fulltime'){for(const q of r){q.walk=true;q.tz=-2.5;}r[0].tx=2;return;}
    for(const q of r)q.walk=false;
    r[0].tx=clamp(b.x-Math.sign(b.x||1)*8,-45,45);r[0].tz=clamp(b.z+(b.z<MZ?11:-11),5,63);
    r[1].tx=clamp(this.offLine(1),0,PL-1);r[1].tz=PW+1.3;
    r[2].tx=clamp(-this.offLine(-1),-(PL-1),0);r[2].tz=-1.3;
  }
  offLine(side){const def=this.dir[0]===-side?0:1;const xs=this.teams[def].map(p=>p.x*side).sort((a,b)=>b-a);return Math.max(xs[1],this.ball.x*side,0);}
  moveAll(dt){
    const P=this.players;
    for(const p of P)this.moveP(p,dt);
    for(let i=0;i<P.length;i++){const a=P[i];if(a.pose==='dive')continue;
      for(let j=i+1;j<P.length;j++){const c=P[j];const dx=c.x-a.x,dz=c.z-a.z,d2=dx*dx+dz*dz;
        if(d2<0.81&&d2>1e-6){const dd=Math.sqrt(d2),push=(0.9-dd)*0.25,ux=dx/dd,uz=dz/dd;a.x-=ux*push;a.z-=uz*push;c.x+=ux*push;c.z+=uz*push;}}}
    for(const r of this.refs)this.moveP(r,dt);
  }
  moveP(p,dt){
    if(p.kickCd>0)p.kickCd-=dt;
    if(p.poseT>0){p.poseT-=dt;if(p.poseT<=0)p.pose='stand';}
    if(p.pose==='dive'){p.z+=p.vz*dt;p.vz*=Math.pow(0.08,dt);p.spd=0;return;}
    const dx=p.tx-p.x,dz=p.tz-p.z,d=Math.hypot(dx,dz);
    const want=p.maxSpd*(p.walk?0.3:1)*(p.dribble?0.84:1)*(d<4?d/4:1);
    let ax=(d>0.05?dx/d*want:0)-p.vx,az=(d>0.05?dz/d*want:0)-p.vz;
    const al=Math.hypot(ax,az),mx=15*dt;if(al>mx){ax*=mx/al;az*=mx/al;}
    p.vx+=ax;p.vz+=az;p.x+=p.vx*dt;p.z+=p.vz*dt;
    const s=Math.hypot(p.vx,p.vz);p.spd=s;p.anim+=s*dt*0.95;
    if(Math.abs(p.vx)>0.3)p.face=p.vx>0?1:-1;
  }
}
