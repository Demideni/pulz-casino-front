// Lego Candy Slots — SB1000-like (cluster pays, cascades, bombs, FS)
// FINAL SMART + FRAME: custom slot frame + inner bg + separators (safe responsive).
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
    startBtn: document.getElementById("startBtn"),
    buyModal: document.getElementById("buyModal"),
    cancelBuy: document.getElementById("cancelBuy"),
    confirmBuy: document.getElementById("confirmBuy"),
  };

  // --- UI FX ---
  function pulseStartBtn() {
    if (!ui.startBtn) return;
    ui.startBtn.classList.remove("pulse");
    void ui.startBtn.offsetWidth;
    ui.startBtn.classList.add("pulse");
    setTimeout(() => ui.startBtn && ui.startBtn.classList.remove("pulse"), 800);
  }

  // --- Gameplay constants ---
  const COLS = 6, ROWS = 5;
  const MIN_CLUSTER = 8;

  const BUY_BONUS_COST_MULT = 100;
  const FS_AWARD = 10;
  const MAX_WIN_MULT = 5000;

  // Slower by ~40%
  const SPIN_DROP_MS = 520;
  const CASCADE_DROP_MS = 420;
  const STAGGER_MS = 22;

  // Smart win-shaping baseline (not too frequent)
  const BASE_SHAPE_CHANCE = 0.25;
  const FS_SHAPE_CHANCE   = 0.40;

  function antiDryBoost(dry) {
    if (dry <= 1) return 0.0;
    if (dry === 2) return 0.12;
    if (dry === 3) return 0.22;
    if (dry === 4) return 0.34;
    if (dry === 5) return 0.46;
    return 0.58;
  }

  function capChance(x) {
    return Math.max(0, Math.min(0.92, x));
  }

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

  // --- Assets ---
  const IMG = new Map();

  let BG_IMG = null;         // ./assets/bg/bg-main.png
  let FRAME_IMG = null;      // ./assets/ui/slot-frame.png
  let INNER_BG_IMG = null;   // ./assets/ui/slot-inner-bg.png

  const BG_SRC = "./assets/bg/bg-main.png";
  const FRAME_SRC = "./assets/ui/slot-frame.png";
  const INNER_BG_SRC = "./assets/ui/slot-inner-bg.png";

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

    // load symbols
    await Promise.all([...files].map(async f=>{
      IMG.set(f, await loadImage(base+f));
    }));

    // background (safe)
    try { BG_IMG = await loadImage(BG_SRC); }
    catch(e){ BG_IMG = null; console.warn("BG image not loaded:", BG_SRC, e); }

    // custom frame (safe)
    try { FRAME_IMG = await loadImage(FRAME_SRC); }
    catch(e){ FRAME_IMG = null; console.warn("FRAME image not loaded:", FRAME_SRC, e); }

    // inner bg (safe)
    try { INNER_BG_IMG = await loadImage(INNER_BG_SRC); }
    catch(e){ INNER_BG_IMG = null; console.warn("INNER BG image not loaded:", INNER_BG_SRC, e); }
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

  // --- State ---
  let balance=0, bet=1, lastWin=0;
  let isFS=false, fsLeft=0, fsMulti=1;
  let spinning=false;

  let dryStreak = 0;

  let grid=[];
  let bombs=[];
  let popups=[];
  let highlights=[];

  let W=0,H=0, cell=0, pad=0, topY=0, leftX=0;

  // --- Layout ---
  function getStartBtnHeight(){
    if(!ui.startBtn) return 120;
    const r = ui.startBtn.getBoundingClientRect();
    return Math.max(96, Math.floor(r.height || 120));
  }

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
    const safeBottom = getStartBtnHeight() + 80;

    const usableH = H - safeTop - safeBottom;
    const usableW = Math.min(W, 560);

    const PAD_RATIO = 0.12;

    // compute cell with pad included (prevents overflow on wide/short screens)
    const cellW = Math.floor((usableW - 24) / (COLS + (COLS - 1) * PAD_RATIO));
    const cellH = Math.floor((usableH - 24) / (ROWS + (ROWS - 1) * PAD_RATIO));

    cell = Math.max(32, Math.min(cellW, cellH));
    pad  = Math.floor(cell * PAD_RATIO);

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

  // --- Draw helpers ---
  function roundRect(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  // --- BACKGROUND ---
  function drawBG(){
    if (BG_IMG){
      ctx.drawImage(BG_IMG, 0, 0, W, H);
    } else {
      const g=ctx.createRadialGradient(W*0.5,H*0.35,40,W*0.5,H*0.55,Math.max(W,H));
      g.addColorStop(0,"rgba(59,130,246,0.14)");
      g.addColorStop(0.45,"rgba(2,6,23,0.55)");
      g.addColorStop(1,"rgba(0,0,0,0.95)");
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    }

    // premium dark overlay for readability
    const fog = ctx.createLinearGradient(0,0,0,H);
    fog.addColorStop(0,   "rgba(0,0,0,0.40)");
    fog.addColorStop(0.35,"rgba(0,0,0,0.18)");
    fog.addColorStop(1,   "rgba(0,0,0,0.58)");
    ctx.fillStyle = fog;
    ctx.fillRect(0,0,W,H);

    // subtle stars
    ctx.globalAlpha=0.10;
    ctx.fillStyle="#e5e7eb";
    for(let i=0;i<32;i++){
      const x=(i*97)%W, y=(i*173)%H;
      ctx.fillRect(x,y,1,1);
    }
    ctx.globalAlpha=1;
  }

  // inner bg inside the board area (under symbols)
  function drawInnerSlotBG(){
    const bw = COLS*cell + (COLS-1)*pad;
    const bh = ROWS*cell + (ROWS-1)*pad;
    const x = leftX;
    const y = topY;

    ctx.save();

    if(INNER_BG_IMG){
      ctx.globalAlpha = 0.98;
      ctx.drawImage(INNER_BG_IMG, x, y, bw, bh);
    } else {
      // fallback: subtle glossy dark panel (safe)
      const g = ctx.createLinearGradient(0, y, 0, y + bh);
      g.addColorStop(0, "rgba(0,0,0,0.22)");
      g.addColorStop(0.45, "rgba(0,0,0,0.10)");
      g.addColorStop(1, "rgba(0,0,0,0.34)");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, bw, bh);

      // faint noise dots
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "#ffffff";
      for(let i=0;i<28;i++){
        const xx = x + ((i*131) % Math.max(1,bw));
        const yy = y + ((i*197) % Math.max(1,bh));
        ctx.fillRect(xx, yy, 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // separators sit only in the gaps (pad), never over symbol art
  function drawCellSeparators(){
    if(pad <= 0) return;

    const bw = COLS*cell + (COLS-1)*pad;
    const bh = ROWS*cell + (ROWS-1)*pad;

    ctx.save();
    ctx.globalAlpha = 0.20;
    ctx.shadowColor = "rgba(59,130,246,0.30)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "rgba(59,130,246,0.18)";

    // vertical gaps
    for(let c=1;c<COLS;c++){
      const x = leftX + c*cell + (c-1)*pad;
      ctx.fillRect(x, topY, pad, bh);
    }
    // horizontal gaps
    for(let r=1;r<ROWS;r++){
      const y = topY + r*cell + (r-1)*pad;
      ctx.fillRect(leftX, y, bw, pad);
    }

    // small inner stroke around the whole grid (provider-ish)
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    roundRect(leftX+1, topY+1, bw-2, bh-2, Math.max(10, Math.floor(cell*0.18)));
    ctx.stroke();

    ctx.restore();
  }

  // custom frame (PNG) around the board; fallback to neon if missing
  function drawFrame(){
    const bw = COLS*cell + (COLS-1)*pad;
    const bh = ROWS*cell + (ROWS-1)*pad;

    // margin for the frame (keeps it outside symbols)
    const m = Math.max(18, Math.floor(cell * 0.30));
    const x = leftX - m;
    const y = topY - m;
    const w = bw + m*2;
    const h = bh + m*2;

    if(FRAME_IMG){
      ctx.save();
      ctx.shadowColor = "rgba(59,130,246,0.42)";
      ctx.shadowBlur = 22;
      ctx.drawImage(FRAME_IMG, x, y, w, h);
      ctx.restore();
      return;
    }

    // fallback frame
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

  function addPopup(x, y, text, dur = 900, kind="win"){
    popups.push({ x, y, text, t0: performance.now(), dur, kind });
  }

  function addHighlight(idxs, dur=420){
    highlights.push({ idxs, t0: performance.now(), dur });
  }

  function drawHighlights(){
    const now = performance.now();
    highlights = highlights.filter(h => now - h.t0 < h.dur);

    for(const h of highlights){
      const t = (now - h.t0) / h.dur;
      const a = (1 - t) * 0.45;

      ctx.save();
      ctx.globalAlpha = a;
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(59,130,246,0.85)";
      ctx.shadowBlur = 18;
      ctx.strokeStyle = "rgba(59,130,246,0.75)";

      for(const idx of h.idxs){
        const r=Math.floor(idx/COLS), c=idx%COLS;
        const x=leftX+c*(cell+pad);
        const y=topY+r*(cell+pad);
        roundRect(x+4, y+4, cell-8, cell-8, 14);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawPopups(){
    const now = performance.now();
    popups = popups.filter(p => now - p.t0 < p.dur);

    for (const p of popups) {
      const t = (now - p.t0) / p.dur;
      const k = 1 - Math.pow(1 - Math.min(1, t), 3);
      const y = p.y - 28 * k;
      const a = 1 - t;

      ctx.save();
      ctx.globalAlpha = a;

      if(p.kind === "mult"){
        ctx.font = "900 20px system-ui, -apple-system, Segoe UI, Roboto, Arial";
        ctx.shadowColor = "rgba(59,130,246,0.80)";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#eafff2";
      } else if(p.kind === "total"){
        ctx.font = "1000 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
        ctx.shadowColor = "rgba(59,130,246,0.90)";
        ctx.shadowBlur = 22;
        ctx.fillStyle = "#ffffff";
      } else {
        ctx.font = "900 22px system-ui, -apple-system, Segoe UI, Roboto, Arial";
        ctx.shadowColor = "rgba(59,130,246,0.70)";
        ctx.shadowBlur = 16;
        ctx.fillStyle = "#eafff2";
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 5;
      ctx.strokeText(p.text, p.x, y);
      ctx.fillText(p.text, p.x, y);

      ctx.restore();
    }
  }

  function draw(){
    drawBG();
    drawInnerSlotBG();
    drawCellSeparators();
    drawFrame();

    // symbols
    for(const c of grid){
      if(!c.img) continue;
      ctx.save();
      ctx.shadowColor="rgba(59,130,246,0.28)";
      ctx.shadowBlur=10;
      ctx.drawImage(c.img,c.x,c.yAnim,cell,cell);
      ctx.restore();
    }

    drawHighlights();

    // bombs
    for(const b of bombs){
      if(!b.img) continue;
      ctx.save();
      ctx.globalAlpha=b.alpha;
      ctx.shadowColor="rgba(59,130,246,0.65)";
      ctx.shadowBlur=16;

      const s = (b.scale ?? 1);
      const sz = Math.floor(cell*0.92);
      const cx = b.x + sz/2;
      const cy = b.y + sz/2;
      ctx.drawImage(b.img, cx - (sz*s)/2, cy - (sz*s)/2, sz*s, sz*s);

      ctx.restore();
    }

    drawPopups();
    requestAnimationFrame(draw);
  }

  // --- Cluster logic ---
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

  // --- Animation ---
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
      jobs.push(animateY(obj,obj.yAnim,obj.y,CASCADE_DROP_MS,(i%COLS)*12));
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

  // --- Grid ---
  function newGrid(){
    grid.length=0;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      const s=randomSymbol();
      const x=leftX+c*(cell+pad), y=topY+r*(cell+pad);
      const file = (s.id==="scatter") ? SCATTER.file : s.file;
      grid.push({symId:s.id,img:IMG.get(file),x,y,yAnim:y});
    }
  }

  // --- Sweet-style shaping: "force one 8+ cluster" (soft) ---
  function forceCluster8PlusSoft(){
    const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const roll = Math.random();
    const w = (roll < 0.82) ? 4 : 3;
    const h = (w === 4) ? 2 : 3;

    const startC = Math.floor(Math.random() * (COLS - w + 1));
    const startR = Math.floor(Math.random() * (ROWS - h + 1));

    for (let r = startR; r < startR + h; r++) {
      for (let c = startC; c < startC + w; c++) {
        const idx = r * COLS + c;
        grid[idx].symId = sym.id;
        grid[idx].img = IMG.get(sym.file);
      }
    }
  }

  // --- UI / Balance bridge ---
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
      if(window.parent && window.parent.PULZ_GAME?.getBalance) balance = await window.parent.PULZ_GAME.getBalance();
      else balance=1000;
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
      } else balance -= amount;
    }catch{
      balance -= amount;
    }
  }

  async function creditWin(win){
    try{
      if(window.parent && window.parent.PULZ_GAME?.finish){
        const r=await window.parent.PULZ_GAME.finish({win});
        balance = (r.balance ?? (balance+win));
      } else balance += win;
    }catch{
      balance += win;
    }
  }

  // --- Bombs (multipliers) ---
  function placeBombs(picked){
    bombs.length=0;
    for(const b of picked){
      const c=Math.floor(Math.random()*COLS), r=Math.floor(Math.random()*ROWS);
      const x=leftX+c*(cell+pad)+Math.floor(cell*0.04);
      const y=topY+r*(cell+pad)+Math.floor(cell*0.04);
      bombs.push({x,y,img:IMG.get(b.file),mult:b.mult,alpha:0,scale:0.82});
    }
  }

  function maybeSpawnBombsBase(){
    const count = Math.random()<0.55?1:(Math.random()<0.25?2:0);
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
      const start=performance.now(), ms=260;
      function tick(now){
        const t=Math.min(1,(now-start)/ms);
        b.alpha=t;
        b.scale = 0.82 + 0.32 * (1 - Math.pow(1 - t, 3));
        if(t<1) requestAnimationFrame(tick);
        else { b.scale = 1; res(); }
      }
      requestAnimationFrame(tick);
    })));
  }

  // --- Spin ---
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

    newGrid();

    const baseChance = isFS ? FS_SHAPE_CHANCE : BASE_SHAPE_CHANCE;
    const chance = capChance(baseChance + antiDryBoost(dryStreak));

    if(findClusters().length === 0 && Math.random() < chance){
      forceCluster8PlusSoft();
    }

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
      const hi = new Set();

      for(const cl of clusters){
        cascadeWin += payoutFor(cl.id, cl.members.length) * bet;
        cl.members.forEach(i=>{ toRemove.add(i); hi.add(i); });
      }

      if(hi.size) addHighlight(hi, 420);
      totalSpinWin += cascadeWin;

      if(cascadeWin > 0){
        addPopup(
          leftX + (COLS*(cell+pad)-pad)/2,
          topY - 12,
          `+${cascadeWin.toFixed(2)}`,
          900,
          "win"
        );
      }

      const picked = isFS ? spawnBombsFS() : maybeSpawnBombsBase();
      placeBombs(picked);
      await animateBombsIn();

      for(const b of bombs){
        const sz = Math.floor(cell*0.92);
        const cx = b.x + sz/2;
        const cy = b.y + sz/2;
        addPopup(cx, cy - 8, `x${b.mult}`, 950, "mult");
      }

      const add = picked.reduce((a,b)=>a+b.mult,0);
      if(isFS) fsMulti += add;
      else totalSpinMult += add;

      removeIndices(toRemove);
      collapseAndRefill();

      for(const c of grid) c.yAnim -= (cell+pad)*1.05;

      await animateCascadeDrop();
    }

    let finalWin = totalSpinWin;
    if(isFS) finalWin = totalSpinWin * Math.max(1, fsMulti);
    else if(totalSpinMult>0) finalWin = totalSpinWin * (1+totalSpinMult);

    finalWin = Math.min(finalWin, bet*MAX_WIN_MULT);
    lastWin = finalWin;

    if(finalWin > 0.000001) dryStreak = 0;
    else dryStreak = Math.min(9, dryStreak + 1);

    if(finalWin > 0){
      addPopup(W*0.5, topY - 42, `WIN +${finalWin.toFixed(2)}`, 1200, "total");
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

  // --- Input: tap spin, hold for buy bonus modal ---
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

  // --- Boot ---
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
