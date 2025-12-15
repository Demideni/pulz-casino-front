// Lego Candy Slots — SB1000-like (cluster pays, cascades, bombs, FS)
// Key UX fix: every spin animates full drop (no teleporting symbols).
(() => {
  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");

  const ui = {
    bal: document.getElementById("bal"),
    bet: document.getElementById("bet"),
    win: document.getElementById("win"),
    mode: document.getElementById("mode"),
    fs: document.getElementById("fs"),
    fsm: document.getElementById("fsm"),

    // NEW: PNG button from index.html
    startBtn: document.getElementById("startBtn"),

    buyModal: document.getElementById("buyModal"),
    cancelBuy: document.getElementById("cancelBuy"),
    confirmBuy: document.getElementById("confirmBuy"),
  };

  // --- UX / UI FX helpers ---
  function pulseStartBtn() {
    if (!ui.startBtn) return;
    ui.startBtn.classList.remove("pulse");
    void ui.startBtn.offsetWidth;
    ui.startBtn.classList.add("pulse");
    setTimeout(() => ui.startBtn && ui.startBtn.classList.remove("pulse"), 800);
  }

  const COLS = 6, ROWS = 5, MIN_CLUSTER = 8;
  const BUY_BONUS_COST_MULT = 100;
  const FS_AWARD = 10;
  const MAX_WIN_MULT = 5000;

  const SPIN_DROP_MS = 360;
  const CASCADE_DROP_MS = 300;
  const STAGGER_MS = 16;

  const SYMBOLS = [
    { id: "low_blue",   file: "low_blue.png",   weight: 16, pay: [0,0,0,0,0,0,0, 0.2,0.3,0.4,0.6,0.9,1.2,1.6,2.0] },
    { id: "low_green",  file: "low_green.png",  weight: 16, pay: [0,0,0,0,0,0,0, 0.2,0.3,0.4,0.6,0.9,1.2,1.6,2.0] },
    { id: "low_purple", file: "low_purple.png", weight: 16, pay: [0,0,0,0,0,0,0, 0.2,0.3,0.4,0.6,0.9,1.2,1.6,2.0] },
    { id: "low_red",    file: "low_red.png",    weight: 16, pay: [0,0,0,0,0,0,0, 0.2,0.3,0.4,0.6,0.9,1.2,1.6,2.0] },
    { id: "low_yellow", file: "low_yellow.png", weight: 16, pay: [0,0,0,0,0,0,0, 0.2,0.3,0.4,0.6,0.9,1.2,1.6,2.0] },
    { id: "mid_candy",   file: "mid_candy.png",   weight: 10, pay: [0,0,0,0,0,0,0, 0.3,0.5,0.8,1.2,1.7,2.4,3.2,4.0] },
    { id: "mid_crystal", file: "mid_crystal.png", weight: 10, pay: [0,0,0,0,0,0,0, 0.3,0.5,0.8,1.2,1.7,2.4,3.2,4.0] },
    { id: "high_head",   file: "high_head.png",   weight: 6,  pay: [0,0,0,0,0,0,0, 0.6,1.0,1.5,2.2,3.2,4.6,6.2,8.0] },
  ];
  const SCATTER = { id: "scatter", file: "scatter.png", weight: 2 };

  const MULTI_BOMBS = [
    { mult: 2, file:"m_x2.png", w: 36 },
    { mult: 5, file:"m_x5.png", w: 26 },
    { mult:10, file:"m_x10.png", w: 18 },
    { mult:25, file:"m_x25.png", w: 10 },
    { mult:50, file:"m_x50.png", w: 6 },
    { mult:100,file:"m_x100.png",w: 3 },
  ];

  const IMG = new Map();
  function loadImage(src){
    return new Promise((res,rej)=>{
      const i=new Image();
      i.onload=()=>res(i);
      i.onerror=rej;
      i.src=src;
    });
  }
  async function loadAssets(){
    const base="./assets/symbols/";
    const files=new Set();
    SYMBOLS.forEach(s=>files.add(s.file));
    files.add(SCATTER.file);
    MULTI_BOMBS.forEach(b=>files.add(b.file));
    await Promise.all([...files].map(async f=>{
      IMG.set(f, await loadImage(base+f));
    }));
  }

  function pickWeighted(list){
    let sum=0; for(const it of list) sum += (it.weight ?? it.w);
    let r=Math.random()*sum;
    for(const it of list){ r -= (it.weight ?? it.w); if(r<=0) return it; }
    return list[list.length-1];
  }
  function randomSymbol(){
    const pool=[
      ...SYMBOLS.map(s=>({id:s.id,file:s.file,weight:s.weight})),
      {id:SCATTER.id,file:SCATTER.file,weight:SCATTER.weight,isScatter:true}
    ];
    return pickWeighted(pool);
  }

  let balance=0, bet=1, lastWin=0;
  let isFS=false, fsLeft=0, fsMulti=1;
  let spinning=false;

  let grid=[];  // {symId,img,x,y,yAnim}
  let bombs=[]; // {x,y,img,mult,alpha}

  let W=0,H=0, cell=0, pad=0, topY=0, leftX=0;

  function resize(){
    const dpr=Math.max(1, Math.min(2, window.devicePixelRatio||1));
    const ww=innerWidth, hh=innerHeight;
    canvas.width=Math.floor(ww*dpr);
    canvas.height=Math.floor(hh*dpr);
    canvas.style.width=ww+"px";
    canvas.style.height=hh+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    W=ww; H=hh;

    const safeTop=70;

    // Keep board above start button (matches index.html: 96px button + padding)
    const safeBottom = Math.min(innerWidth * 0.42, 170) + 70;

    const usableH=H-safeTop-safeBottom;
    const usableW=Math.min(W,520);

    cell=Math.floor(Math.min((usableW-24)/COLS,(usableH-24)/ROWS));
    pad=Math.floor(cell*0.12);

    const boardW=COLS*cell+(COLS-1)*pad;
    const boardH=ROWS*cell+(ROWS-1)*pad;

    leftX=Math.floor((W-boardW)/2);
    topY=Math.floor(safeTop+(usableH-boardH)/2);

    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const i=r*COLS+c;
      if(!grid[i]) continue;
      grid[i].x=leftX+c*(cell+pad);
      grid[i].y=topY+r*(cell+pad);
    }
  }

  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function drawBG(){
    const g=ctx.createRadialGradient(W*0.5,H*0.35,40,W*0.5,H*0.55,Math.max(W,H));
    g.addColorStop(0,"rgba(59,130,246,0.14)");
    g.addColorStop(0.45,"rgba(2,6,23,0.55)");
    g.addColorStop(1,"rgba(0,0,0,0.95)");
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

    ctx.globalAlpha=0.18; ctx.fillStyle="#e5e7eb";
    for(let i=0;i<40;i++){
      const x=(i*97)%W, y=(i*173)%H;
      ctx.fillRect(x,y,1,1);
    }
    ctx.globalAlpha=1;
  }

  function drawFrame(){
    const bw=COLS*cell+(COLS-1)*pad, bh=ROWS*cell+(ROWS-1)*pad;
    const x=leftX-16,y=topY-16,w=bw+32,h=bh+32;
    ctx.save();
    ctx.shadowColor="rgba(59,130,246,0.55)";
    ctx.shadowBlur=26;
    ctx.strokeStyle="rgba(59,130,246,0.55)";
    ctx.lineWidth=3;
    roundRect(x,y,w,h,22); ctx.stroke();
    ctx.restore();

    ctx.strokeStyle="rgba(255,255,255,0.06)";
    ctx.lineWidth=1;
    roundRect(x,y,w,h,22); ctx.stroke();
  }

  function draw(){
    drawBG();
    drawFrame();

    for(const c of grid){
      if(!c.img) continue;
      ctx.save();
      ctx.shadowColor="rgba(59,130,246,0.28)";
      ctx.shadowBlur=10;
      ctx.drawImage(c.img,c.x,c.yAnim,cell,cell);
      ctx.restore();
    }

    for(const b of bombs){
      if(!b.img) continue;
      ctx.save();
      ctx.globalAlpha=b.alpha;
      ctx.shadowColor="rgba(59,130,246,0.65)";
      ctx.shadowBlur=16;
      ctx.drawImage(b.img,b.x,b.y,Math.floor(cell*0.92),Math.floor(cell*0.92));
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  function neighbors(idx){
    const r=Math.floor(idx/COLS), c=idx%COLS;
    const out=[];
    if(r>0) out.push(idx-COLS);
    if(r<ROWS-1) out.push(idx+COLS);
    if(c>0) out.push(idx-1);
    if(c<COLS-1) out.push(idx+1);
    return out;
  }

  function findClusters(){
    const seen=new Array(grid.length).fill(false);
    const clusters=[];
    for(let i=0;i<grid.length;i++){
      if(seen[i]) continue;
      const id=grid[i].symId;
      if(id==="scatter"){ seen[i]=true; continue; }

      const q=[i]; seen[i]=true;
      const members=[];
      while(q.length){
        const cur=q.pop(); members.push(cur);
        for(const nb of neighbors(cur)){
          if(seen[nb]) continue;
          if(grid[nb].symId===id){ seen[nb]=true; q.push(nb); }
        }
      }
      if(members.length>=MIN_CLUSTER) clusters.push({id,members});
    }
    return clusters;
  }

  function payoutFor(id,n){
    const sym=SYMBOLS.find(s=>s.id===id);
    if(!sym) return 0;
    const idx=Math.min(sym.pay.length-1,n);
    return sym.pay[idx]||0;
  }

  function easeOutCubic(t){ return 1-Math.pow(1-t,3); }
  function animateY(obj,from,to,ms,delay=0){
    return new Promise(res=>{
      const start=performance.now()+delay;
      function tick(now){
        if(now<start) return requestAnimationFrame(tick);
        const t=Math.min(1,(now-start)/ms);
        const k=easeOutCubic(t);
        obj.yAnim=from+(to-from)*k;
        if(t<1) requestAnimationFrame(tick); else res();
      }
      requestAnimationFrame(tick);
    });
  }

  async function animateFullDrop(){
    const startOffset=(cell+pad)*(ROWS+2);
    const jobs=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const i=r*COLS+c;
      const obj=grid[i];
      const target=obj.y;
      const from=target-startOffset-Math.random()*(cell+pad)*2;
      jobs.push(animateY(obj,from,target,SPIN_DROP_MS,c*STAGGER_MS));
    }
    await Promise.all(jobs);
  }

  async function animateCascadeDrop(){
    const jobs=[];
    for(let i=0;i<grid.length;i++){
      const obj=grid[i];
      jobs.push(animateY(obj,obj.yAnim,obj.y,CASCADE_DROP_MS,(i%COLS)*10));
    }
    await Promise.all(jobs);
  }

  function removeIndices(setIdx){
    for(const idx of setIdx){
      grid[idx].symId=null;
      grid[idx].img=null;
    }
  }

  function collapseAndRefill(){
    for(let c=0;c<COLS;c++){
      const col=[];
      for(let r=ROWS-1;r>=0;r--){
        const idx=r*COLS+c;
        if(grid[idx].symId) col.push(grid[idx].symId);
      }
      while(col.length<ROWS){ col.push(randomSymbol().id); }

      for(let r=ROWS-1;r>=0;r--){
        const idx=r*COLS+c;
        const id=col[ROWS-1-r];
        grid[idx].symId=id;

        const file=(id==="scatter")
          ? SCATTER.file
          : SYMBOLS.find(s=>s.id===id).file;

        grid[idx].img=IMG.get(file);
      }
    }
  }

  function countScatters(){
    return grid.reduce((a,c)=>a+(c.symId==="scatter"),0);
  }

  function updateUI(){
    if(ui.bal) ui.bal.textContent=`$${balance.toFixed(2)}`;
    if(ui.bet) ui.bet.textContent=`BET $${bet.toFixed(2)}`;
    if(ui.win) ui.win.textContent=`WIN $${lastWin.toFixed(2)}`;
    if(ui.mode) ui.mode.textContent=`MODE ${isFS?"FS":"BASE"}`;
    if(ui.fs) ui.fs.textContent = (fsLeft>0 ? String(fsLeft) : "-");
    if(ui.fsm) ui.fsm.textContent=`FS MULTI x${fsMulti}`;
  }

  async function fetchBalance(){
    try{
      if(window.parent && window.parent.PULZ_GAME?.getBalance) {
        balance = await window.parent.PULZ_GAME.getBalance();
      } else {
        balance=1000;
      }
    }catch{
      balance=1000;
    }
    updateUI();
  }

  async function chargeBet(amount){
    try{
      if(window.parent && window.parent.PULZ_GAME?.start){
        const r=await window.parent.PULZ_GAME.start({amount});
        balance = (r.balance ?? (balance-amount));
      } else {
        balance -= amount;
      }
    }catch{
      balance -= amount;
    }
  }

  async function creditWin(win){
    try{
      if(window.parent && window.parent.PULZ_GAME?.finish){
        const r=await window.parent.PULZ_GAME.finish({win});
        balance = (r.balance ?? (balance+win));
      } else {
        balance += win;
      }
    }catch{
      balance += win;
    }
  }

  function placeBombs(picked){
    bombs.length=0;
    for(const b of picked){
      const c=Math.floor(Math.random()*COLS), r=Math.floor(Math.random()*ROWS);
      const x=leftX+c*(cell+pad)+Math.floor(cell*0.04);
      const y=topY+r*(cell+pad)+Math.floor(cell*0.04);
      bombs.push({x,y,img:IMG.get(b.file),mult:b.mult,alpha:0});
    }
  }

  function maybeSpawnBombsBase(){
    const count = Math.random()<0.55 ? 1 : (Math.random()<0.25 ? 2 : 0);
    const picked=[];
    for(let i=0;i<count;i++) picked.push(pickWeighted(MULTI_BOMBS));
    return picked;
  }

  function spawnBombsFS(){
    const count = 1 + (Math.random()<0.55?1:0) + (Math.random()<0.25?1:0);
    const picked=[];
    for(let i=0;i<count;i++) picked.push(pickWeighted(MULTI_BOMBS));
    return picked;
  }

  async function animateBombsIn(){
    await Promise.all(bombs.map(b=>new Promise(res=>{
      const start=performance.now(), ms=180;
      function tick(now){
        const t=Math.min(1,(now-start)/ms);
        b.alpha=t;
        if(t<1) requestAnimationFrame(tick); else res();
      }
      requestAnimationFrame(tick);
    })));
  }

  function newGrid(){
    grid.length=0;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const s=randomSymbol();
      const x=leftX+c*(cell+pad), y=topY+r*(cell+pad);
      grid.push({symId:s.id,img:IMG.get(s.file),x,y,yAnim:y});
    }
  }

  async function doSpin({buyBonus=false}={}){
    if(spinning) return;
    spinning=true;
    lastWin=0;
    bombs.length=0;

    if(buyBonus){
      const cost=bet*BUY_BONUS_COST_MULT;
      if(balance<cost){ spinning=false; return; }
      await chargeBet(cost);
      isFS=true; fsLeft=FS_AWARD; fsMulti=1;
    } else {
      if(!isFS){
        if(balance<bet){ spinning=false; return; }
        await chargeBet(bet);
      }
    }

    // key feel: full drop EVERY SPIN
    newGrid();
    await animateFullDrop();

    if(!isFS && !buyBonus){
      const sc=countScatters();
      if(sc>=4){ isFS=true; fsLeft=FS_AWARD; fsMulti=1; }
    }

    let totalSpinWin=0;
    let totalSpinMult=0;
    let safety=0;

    while(true){
      const clusters=findClusters();
      if(!clusters.length) break;
      safety++; if(safety>18) break;

      let cascadeWin=0;
      const toRemove=new Set();
      for(const cl of clusters){
        cascadeWin += payoutFor(cl.id, cl.members.length) * bet;
        cl.members.forEach(i=>toRemove.add(i));
      }
      totalSpinWin += cascadeWin;

      // bombs
      const picked = isFS ? spawnBombsFS() : maybeSpawnBombsBase();
      placeBombs(picked);
      await animateBombsIn();
      const add = picked.reduce((a,b)=>a+b.mult,0);
      if(isFS) fsMulti += add;
      else totalSpinMult += add;

      // cascade
      removeIndices(toRemove);
      collapseAndRefill();
      for(const c of grid) c.yAnim -= (cell+pad)*0.8;
      await animateCascadeDrop();
    }

    let finalWin = totalSpinWin;
    if(isFS) finalWin = totalSpinWin * Math.max(1, fsMulti);
    else if(totalSpinMult>0) finalWin = totalSpinWin * (1+totalSpinMult);

    finalWin = Math.min(finalWin, bet*MAX_WIN_MULT);
    lastWin = finalWin;

    if(finalWin > 0){
      const x = finalWin / Math.max(0.01, bet);
      if(x >= 20) pulseStartBtn();
      if(x >= 60) setTimeout(pulseStartBtn, 220);
    }

    await creditWin(finalWin);

    if(isFS && !buyBonus){
      fsLeft=Math.max(0,fsLeft-1);
      if(fsLeft===0){ isFS=false; fsMulti=1; }
    }

    updateUI();
    spinning=false;
  }

  // input: tap spin, hold for buy bonus modal
  let holdTimer=null;

  if(ui.startBtn){
    ui.startBtn.addEventListener("pointerdown",()=>{
      if(spinning) return;
      holdTimer=setTimeout(()=>{
        if(ui.buyModal) ui.buyModal.style.display="flex";
        holdTimer=null;
      },520);
    });

    ui.startBtn.addEventListener("pointerup",()=>{
      if(spinning) return;
      if(holdTimer){
        clearTimeout(holdTimer);
        holdTimer=null;
        doSpin({buyBonus:false});
      }
    });

    ui.startBtn.addEventListener("pointerleave",()=>{
      if(holdTimer){
        clearTimeout(holdTimer);
        holdTimer=null;
      }
    });
  } else {
    console.warn("startBtn not found. Check index.html has <img id='startBtn' ...>.");
  }

  if(ui.cancelBuy) ui.cancelBuy.addEventListener("click",()=> ui.buyModal && (ui.buyModal.style.display="none"));
  if(ui.confirmBuy) ui.confirmBuy.addEventListener("click",async()=>{
    if(ui.buyModal) ui.buyModal.style.display="none";
    await doSpin({buyBonus:true});
  });

  window.addEventListener("resize",resize);

  (async()=>{
    resize();
    await loadAssets();
    await fetchBalance();
    newGrid();
    updateUI();
    draw();
    await animateFullDrop();
  })();
})();
