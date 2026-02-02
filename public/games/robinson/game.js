/*
  Pulz Robinson (Aviamasters-style prototype)
  Variant 2: hero moves to the right; camera follows; background parallax.
  Single-file game.js by design (fast iteration).

  Notes:
  - Assets are optional. If not found, we render stylish vector placeholders.
  - To add parallax images later, drop files into ./assets/:
      bg_far.png, bg_mid.png, bg_near.png
    They will auto-load and tile.
*/

(() => {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) {
    console.error("[robinson] #game-canvas not found");
    return;
  }
  const ctx = canvas.getContext("2d", { alpha: false });

  // ---------------------------
  // Config
  // ---------------------------
  const CFG = {
    // Simulation
    fixedDt: 1 / 60,
    maxFrameDt: 0.05,
    gravity: 980,
    // Flight feel (Variant 2)
    // We DON'T want pure gravity drop. We want: takeoff up to mid-screen, then gentle glide down.
    takeoffDuration: 1.15, // seconds to reach peak
    takeoffPeakFracY: 0.46, // peak altitude as fraction of screen height (0 top .. 1 bottom)
    glideSinkPxPerSec: 42, // after peak, target Y slowly moves down
    vertKp: 16.0, // vertical controller proportional gain
    vertKd: 7.0, // vertical controller damping
    vertGravityBias: 60, // small downward bias so glide happens even at steady target
    // Hero
    heroW: 90,
    heroH: 60,
    heroStartX: 160,
    heroStartY: 380,
    heroVx: 330, // px/s base forward speed
    heroLiftImpulse: 240, // upward impulse when hitting +N bonus
    heroHitDownImpulse: 110, // downward impulse when hit by rocket
    heroMaxVy: 680,
    // Camera
    camLead: 0.34, // hero position on screen (0..1)
    // World bounds
    ceilingPad: 70,
    seaLevelPad: 170,
    // Round
    roundSeconds: 35,
    // Pickups
    // NOTE: Stage 1 ("clean flight"): keep pickups OFF until feel is good.
    enablePickups: false,
    pickupSize: 52, // will be treated as diameter-ish
    pickupScale: 2.0, // visual scaling if you later use sprites
    pickupDensity: 1.2, // base frequency; we'll tune after flight feel is right
    pickupMinDx: 160,
    rocketChance: 0.42, // % of spawns that are rockets
    // Lanes (relative to screen height)
    laneYs: [0.22, 0.36, 0.50, 0.64],
    laneJitter: 34,
    // UI units
    pxPerMeter: 8.0,
  };

  const SPEED_PRESETS = {
    x1: 1,
    x2: 2,
    x3: 3,
  };

  // ---------------------------
  // Helpers
  // ---------------------------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => Math.floor(rand(a, b + 1));

  function fmtMoney(n) {
    const v = Math.round(n * 100) / 100;
    return v.toFixed(2);
  }

  function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  // ---------------------------
  // Assets (optional)
  // ---------------------------
  function loadImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve({ ok: true, img });
      img.onerror = () => resolve({ ok: false, img: null });
      img.src = url;
    });
  }

  const Assets = {
    bg_far: null,
    bg_mid: null,
    bg_near: null,
    hero: null,
    platform: null,
    bonusBase: null,
    rocket: null,
  };

  async function loadAssets() {
    const tries = await Promise.all([
      loadImage("./assets/bg_far.png"),
      loadImage("./assets/bg_mid.png"),
      loadImage("./assets/bg_near.png"),
      // game sprites (you added these):
      loadImage("./assets/robinson.png"),
      loadImage("./assets/platform.png"),
      loadImage("./assets/bonus_base.png"),
      loadImage("./assets/rocket.png"),
    ]);

    if (tries[0].ok) Assets.bg_far = tries[0].img;
    if (tries[1].ok) Assets.bg_mid = tries[1].img;
    if (tries[2].ok) Assets.bg_near = tries[2].img;
    if (tries[3].ok) Assets.hero = tries[3].img;
    if (tries[4].ok) Assets.platform = tries[4].img;
    if (tries[5].ok) Assets.bonusBase = tries[5].img;
    if (tries[6].ok) Assets.rocket = tries[6].img;
  }

  // ---------------------------
  // State
  // ---------------------------
  const State = {
    IDLE: "IDLE",
    RUN: "RUN",
    END: "END",
  };

  const world = {
    state: State.IDLE,
    speedKey: "x1",
    speedFactor: 1,

    time: 0,
    timeLeft: CFG.roundSeconds,

    camX: 0,
    distancePx: 0,

    hero: {
      x: CFG.heroStartX,
      y: CFG.heroStartY,
      vx: CFG.heroVx,
      vy: 0,
      w: CFG.heroW,
      h: CFG.heroH,
      tilt: 0,
      smokeT: 0, // for rocket hit
    },

    // vertical flight controller (to match Aviamasters feel)
    flight: {
      startY: 0,
      targetY: 0,
      peakY: 0,
      phase: "IDLE", // IDLE | TAKEOFF | GLIDE
    },

    // money model
    bet: 0.5,
    balance: 999.5,
    win: 0.5, // potential win

    // pickups
    nextSpawnX: 0,
    pickups: [],
    floatTexts: [],
  };

  // ---------------------------
  // Canvas sizing
  // ---------------------------
  let W = 0,
    H = 0,
    DPR = 1;

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  // ---------------------------
  // Parallax background
  // ---------------------------
  function drawTiled(img, par, y, h, alpha = 1) {
    if (!img) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    const scale = h / img.height;
    const tileW = img.width * scale;
    const x0 = -((world.camX * par) % tileW);
    for (let x = x0 - tileW; x < W + tileW; x += tileW) {
      ctx.drawImage(img, x, y, tileW, h);
    }
    ctx.restore();
  }

  function drawStars(par, count, alpha) {
    // deterministic-ish stars based on camera, cheap fake parallax
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fff";
    const seed = Math.floor(world.camX * par * 0.05);
    for (let i = 0; i < count; i++) {
      const x = ((i * 997 + seed * 37) % (W + 300)) - 150;
      const y = ((i * 463 + seed * 17) % (H - 180)) + 40;
      const r = (i % 7 === 0 ? 1.6 : 1.0) * (0.8 + (i % 5) * 0.06);
      ctx.globalAlpha = alpha * (0.25 + (i % 9) * 0.06);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderBackground() {
    // base gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#03040b");
    g.addColorStop(0.55, "#03040b");
    g.addColorStop(1, "#02030a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    if (Assets.bg_far || Assets.bg_mid || Assets.bg_near) {
      drawTiled(Assets.bg_far, 0.18, 0, H, 0.65);
      drawTiled(Assets.bg_mid, 0.35, 0, H, 0.75);
      drawTiled(Assets.bg_near, 0.55, 0, H, 0.9);
    } else {
      // fallback stars
      drawStars(0.12, 55, 0.55);
      drawStars(0.28, 45, 0.45);
    }
  }

  // ---------------------------
  // Carrier / sea
  // ---------------------------
  function renderCarrier() {
    // Decorative carrier like the Aviamasters reference (not a landing platform).
    // We keep it ABOVE the bottom UI bar so it's always visible on mobile.
    const seaY = H - 300;
    // ocean haze
    const haze = ctx.createLinearGradient(0, seaY - 90, 0, seaY + 140);
    haze.addColorStop(0, "rgba(0,140,255,0.0)");
    haze.addColorStop(1, "rgba(0,140,255,0.18)");
    ctx.fillStyle = haze;
    ctx.fillRect(0, seaY - 90, W, 240);

    const deckY = seaY - 20;

    // If you provided a platform sprite, render it here as the carrier/палуба.
    if (Assets.platform) {
      const maxW = W * 0.92;
      const maxH = 130;
      const aspect = Assets.platform.width / Assets.platform.height;
      let w = maxW;
      let h = w / aspect;
      if (h > maxH) {
        h = maxH;
        w = h * aspect;
      }
      const x = (W - w) / 2;
      const y = deckY + 40 - h; // sit above haze a bit
      ctx.save();
      ctx.shadowColor = "rgba(0,170,255,0.55)";
      ctx.shadowBlur = 22;
      ctx.globalAlpha = 0.95;
      ctx.drawImage(Assets.platform, x, y, w, h);
      ctx.restore();
      return;
    }

    // fallback carrier deck (vector neon)
    const deckH = 58;
    const deckW = W * 0.85;
    const deckX = (W - deckW) / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,170,255,0.45)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "rgba(5,10,26,0.9)";
    roundRect(deckX, deckY, deckW, deckH, 16);
    ctx.fill();
    ctx.shadowBlur = 0;

    // neon edge
    ctx.strokeStyle = "rgba(0,200,255,0.55)";
    ctx.lineWidth = 2;
    roundRect(deckX + 2, deckY + 2, deckW - 4, deckH - 4, 14);
    ctx.stroke();

    // little lights
    for (let i = 0; i < 18; i++) {
      const x = deckX + 24 + i * ((deckW - 48) / 17);
      const y = deckY + deckH - 12;
      ctx.fillStyle = i % 3 === 0 ? "rgba(255,64,180,0.8)" : "rgba(0,200,255,0.85)";
      ctx.beginPath();
      ctx.arc(x, y, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  // ---------------------------
  // Pickups
  // ---------------------------
  const PickupType = {
    ADD: "ADD", // +1 +2 +3
    MUL: "MUL", // x2 x3
    ROCKET: "ROCKET",
  };

  function makePickup(x, y) {
    // We spawn: +1/+2/+3, x2/x3, and rockets.
    const isRocket = Math.random() < CFG.rocketChance;
    if (isRocket) {
      return {
        type: PickupType.ROCKET,
        x,
        y,
        r: CFG.pickupSize * 0.42 * CFG.pickupScale,
        ttl: 20,
      };
    }

    const isMul = Math.random() < 0.35;
    if (isMul) {
      return {
        type: PickupType.MUL,
        val: Math.random() < 0.55 ? 2 : 3,
        x,
        y,
        r: CFG.pickupSize * 0.44 * CFG.pickupScale,
        ttl: 20,
      };
    }

    return {
      type: PickupType.ADD,
      val: randi(1, 3),
      x,
      y,
      r: CFG.pickupSize * 0.44 * CFG.pickupScale,
      ttl: 20,
    };
  }

  function spawnPickupsIfNeeded() {
    const hero = world.hero;
    // spawn based on distance, like reference feel
    const viewAhead = W * 1.4;
    const spawnX = hero.x + viewAhead;

    if (world.nextSpawnX === 0) {
      world.nextSpawnX = hero.x + W * 0.8;
    }

    // distance between spawns (smaller = more)
    const baseDx = 420;
    const dx = clamp(baseDx / CFG.pickupDensity, 70, 260);

    while (world.nextSpawnX < spawnX) {
      const lane = CFG.laneYs[randi(0, CFG.laneYs.length - 1)];
      let y = lane * H + rand(-CFG.laneJitter, CFG.laneJitter);
      y = clamp(y, 80, H - CFG.seaLevelPad - 120);

      const p = makePickup(world.nextSpawnX, y);
      // keep some spacing between items
      const ok = world.pickups.every((q) => Math.abs(q.x - p.x) >= CFG.pickupMinDx || Math.abs(q.y - p.y) >= 70);
      if (ok) world.pickups.push(p);

      world.nextSpawnX += dx + rand(-35, 60);
    }

    // cleanup behind camera
    const killX = world.camX - 200;
    world.pickups = world.pickups.filter((p) => p.x > killX);
  }

  function addFloatText(text, x, y, color) {
    world.floatTexts.push({ text, x, y, vy: -40, t: 0, life: 0.9, color });
  }

  // ---------------------------
  // Gameplay
  // ---------------------------
  function resetRound() {
    const uiCtx = window.RobinsonUI?.getContext?.();
    if (uiCtx) {
      world.bet = uiCtx.bet;
      world.balance = uiCtx.balance;
      world.speedKey = uiCtx.speed.key;
      world.speedFactor = SPEED_PRESETS[world.speedKey] || 1;
    }

    world.state = State.RUN;
    world.time = 0;
    world.timeLeft = CFG.roundSeconds;
    world.distancePx = 0;

    world.win = world.bet;

    world.hero.x = CFG.heroStartX;
    world.hero.y = clamp(H * 0.62, 160, H - CFG.seaLevelPad - 220);
    world.hero.vx = CFG.heroVx;
    world.hero.vy = 0;
    world.hero.tilt = 0;
    world.hero.smokeT = 0;

    world.pickups = [];
    world.floatTexts = [];
    world.nextSpawnX = 0;

    // flight curve: takeoff up to mid, then gentle glide down
    world.flight.startY = world.hero.y;
    world.flight.peakY = clamp(H * CFG.takeoffPeakFracY, 130, H - CFG.seaLevelPad - 260);
    world.flight.targetY = world.flight.startY;
    world.flight.phase = "TAKEOFF";

    window.RobinsonUI?.lock?.(true);
    window.RobinsonBridge?.emitRoundStart?.({ bet: world.bet, speed: world.speedKey });
  }

  function endRound(reason) {
    world.state = State.END;
    window.RobinsonUI?.lock?.(false);
    window.RobinsonBridge?.emitRoundEnd?.({
      reason,
      bet: world.bet,
      win: world.win,
      distanceM: world.distancePx / CFG.pxPerMeter,
    });
  }

  function applyBonus(p) {
    const before = world.win;
    if (p.type === PickupType.ADD) {
      world.win += world.bet * p.val;
      world.hero.vy -= CFG.heroLiftImpulse * 0.55;
      addFloatText(`+${p.val}`.toUpperCase(), p.x, p.y, "#33ff66");
    } else if (p.type === PickupType.MUL) {
      world.win *= p.val;
      addFloatText(`x${p.val}`.toUpperCase(), p.x, p.y, "#66ccff");
    }
    // clamp for sanity
    world.win = clamp(world.win, 0, 999999);
    // little sparkle
    if (window.gsap) {
      gsap.fromTo(canvas, { filter: "brightness(1)" }, { filter: "brightness(1.06)", duration: 0.12, yoyo: true, repeat: 1 });
    }
    return before !== world.win;
  }

  function applyRocket(p) {
    world.win *= 0.5;
    world.hero.vy += CFG.heroHitDownImpulse;
    world.hero.smokeT = 1.2;
    addFloatText("/2", p.x, p.y, "#ff3b3b");
    if (window.gsap) {
      gsap.fromTo(canvas, { x: 0 }, { x: 0, duration: 0.18 });
    }
  }

  function updateHero(dt) {
    const hero = world.hero;
    const spd = world.speedFactor;
    hero.x += hero.vx * spd * dt;

    // --- Vertical feel (Aviamasters-like): takeoff -> glide
    const f = world.flight;
    if (f.phase === "TAKEOFF") {
      const t = clamp(world.time / CFG.takeoffDuration, 0, 1);
      // easeOutCubic
      const e = 1 - Math.pow(1 - t, 3);
      f.targetY = f.startY + (f.peakY - f.startY) * e;
      if (t >= 1) {
        f.phase = "GLIDE";
        f.targetY = f.peakY;
      }
    } else if (f.phase === "GLIDE") {
      // slowly drift down over time (planing)
      f.targetY += CFG.glideSinkPxPerSec * dt;
    }

    // PD controller to follow targetY (prevents the "just падает вниз" feeling)
    const err = f.targetY - hero.y;
    const accel = err * CFG.vertKp - hero.vy * CFG.vertKd + CFG.vertGravityBias;
    hero.vy += accel * dt;
    hero.vy = clamp(hero.vy, -CFG.heroMaxVy, CFG.heroMaxVy);
    hero.y += hero.vy * dt;

    // tilt feel
    hero.tilt = clamp(hero.vy / 420, -0.5, 0.65);

    // bounds
    const topY = CFG.ceilingPad;
    const botY = H - CFG.seaLevelPad - 120;
    if (hero.y < topY) {
      hero.y = topY;
      hero.vy = Math.max(hero.vy, 0);
    }
    if (hero.y > botY) {
      // fell into sea => lose
      endRound("crash");
      hero.y = botY;
      hero.vy = 0;
    }

    // smoke timer
    hero.smokeT = Math.max(0, hero.smokeT - dt);

    // distance
    world.distancePx = hero.x - CFG.heroStartX;
  }

  function updateCamera() {
    // Follow hero so he sits at camLead of screen width
    const hero = world.hero;
    const target = hero.x - W * CFG.camLead;
    world.camX += (target - world.camX) * 0.12;
    world.camX = Math.max(0, world.camX);
  }

  function updatePickups(dt) {
    const hero = world.hero;
    const hw = hero.w;
    const hh = hero.h;

    for (let i = world.pickups.length - 1; i >= 0; i--) {
      const p = world.pickups[i];
      p.ttl -= dt;
      if (p.ttl <= 0) {
        world.pickups.splice(i, 1);
        continue;
      }

      // Collision AABB vs circle
      const heroRect = { x: hero.x, y: hero.y, w: hw, h: hh };
      const px = p.x;
      const py = p.y;
      const pr = p.r;

      // quick overlap check using expanded rect
      if (!rectsOverlap(heroRect.x, heroRect.y, heroRect.w, heroRect.h, px - pr, py - pr, pr * 2, pr * 2)) continue;

      // treat as hit
      if (p.type === PickupType.ROCKET) {
        applyRocket(p);
      } else {
        applyBonus(p);
      }
      world.pickups.splice(i, 1);
    }
  }

  function updateFloatTexts(dt) {
    for (let i = world.floatTexts.length - 1; i >= 0; i--) {
      const t = world.floatTexts[i];
      t.t += dt;
      t.y += t.vy * dt;
      if (t.t > t.life) world.floatTexts.splice(i, 1);
    }
  }

  function updateStats() {
    const hero = world.hero;
    const altitudeM = (H - CFG.seaLevelPad - hero.y) / CFG.pxPerMeter;
    const distanceM = Math.max(0, world.distancePx / CFG.pxPerMeter);
    const multiplier = world.bet > 0 ? world.win / world.bet : 1;
    window.RobinsonUI?.setStats?.({
      altitudeM,
      distanceM,
      multiplier,
      timeLeftS: world.timeLeft,
    });
  }

  // ---------------------------
  // Rendering
  // ---------------------------
  function toScreenX(wx) {
    return wx - world.camX;
  }

  function renderPickups() {
    for (const p of world.pickups) {
      const x = toScreenX(p.x);
      if (x < -140 || x > W + 140) continue;
      renderPickup(p, x, p.y);
    }
  }

  function renderPickup(p, sx, sy) {
    ctx.save();
    // glow
    if (p.type === PickupType.ROCKET) {
      ctx.shadowColor = "rgba(255,64,64,0.6)";
      ctx.shadowBlur = 26;
      ctx.fillStyle = "rgba(255,70,70,0.35)";
      ctx.beginPath();
      ctx.arc(sx, sy, p.r * 1.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // core
      ctx.fillStyle = "rgba(255,70,70,0.95)";
      ctx.beginPath();
      ctx.arc(sx, sy, p.r * 0.38, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const isMul = p.type === PickupType.MUL;
      ctx.shadowColor = isMul ? "rgba(0,180,255,0.55)" : "rgba(255,220,80,0.55)";
      ctx.shadowBlur = 28;
      ctx.fillStyle = isMul ? "rgba(0,170,255,0.22)" : "rgba(255,220,80,0.24)";
      ctx.beginPath();
      ctx.arc(sx, sy, p.r * 1.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = isMul ? "rgba(0,170,255,0.92)" : "rgba(255,220,80,0.92)";
      ctx.beginPath();
      ctx.arc(sx, sy, p.r * 0.44, 0, Math.PI * 2);
      ctx.fill();

      // label
      ctx.font = "800 28px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      const label = isMul ? `x${p.val}` : `${p.val}`;
      ctx.fillText(label, sx + 1, sy + 2);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, sx, sy);
    }
    ctx.restore();
  }

  function renderHero() {
    const hero = world.hero;
    const x = toScreenX(hero.x);
    const y = hero.y;

    // trail
    renderTrail(x, y, hero);

    ctx.save();
    ctx.translate(x + hero.w / 2, y + hero.h / 2);
    ctx.rotate(hero.tilt);
    ctx.translate(-hero.w / 2, -hero.h / 2);

    if (Assets.hero) {
      // draw sprite fitted
      ctx.drawImage(Assets.hero, 0, 0, hero.w, hero.h);
    } else {
      // fallback: glider silhouette
      ctx.fillStyle = "rgba(0,180,255,0.85)";
      ctx.shadowColor = "rgba(0,180,255,0.55)";
      ctx.shadowBlur = 12;
      roundRect(6, 18, hero.w - 12, hero.h - 26, 12);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      roundRect(12, 24, hero.w - 24, hero.h - 38, 10);
      ctx.fill();
    }

    ctx.restore();

    // potential win text above hero
    ctx.save();
    ctx.font = "900 18px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(255,210,90,0.95)";
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = 4;
    const txt = `${fmtMoney(world.win)} FUN`;
    ctx.strokeText(txt, x + hero.w / 2, y - 8);
    ctx.fillText(txt, x + hero.w / 2, y - 8);
    ctx.restore();
  }

  function renderTrail(x, y, hero) {
    const isHit = hero.smokeT > 0;
    const tailLen = isHit ? 120 : 90;
    const dx = -tailLen;
    const dy = isHit ? 12 : 0;
    ctx.save();
    ctx.translate(x + 10, y + hero.h * 0.55);

    if (isHit) {
      // fire + smoke
      const g1 = ctx.createLinearGradient(0, 0, dx, dy);
      g1.addColorStop(0, "rgba(255,180,60,0.9)");
      g1.addColorStop(0.4, "rgba(255,70,40,0.55)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.strokeStyle = g1;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dx * 0.5, dy * 0.4, dx, dy);
      ctx.stroke();

      const g2 = ctx.createLinearGradient(0, 0, dx * 0.9, dy);
      g2.addColorStop(0, "rgba(25,25,25,0.65)");
      g2.addColorStop(1, "rgba(25,25,25,0)");
      ctx.strokeStyle = g2;
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dx * 0.45, dy * 0.2, dx * 0.9, dy);
      ctx.stroke();
    } else {
      // clean blue trail
      const g = ctx.createLinearGradient(0, 0, dx, dy);
      g.addColorStop(0, "rgba(0,210,255,0.85)");
      g.addColorStop(0.55, "rgba(0,140,255,0.35)");
      g.addColorStop(1, "rgba(0,140,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dx * 0.5, 0, dx, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderFloatTexts() {
    for (const t of world.floatTexts) {
      const x = toScreenX(t.x);
      if (x < -120 || x > W + 120) continue;
      const a = 1 - t.t / t.life;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = "900 30px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = t.color;
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 6;
      ctx.strokeText(t.text, x, t.y);
      ctx.fillText(t.text, x, t.y);
      ctx.restore();
    }
  }

  function render() {
    renderBackground();
    renderCarrier();
    if (CFG.enablePickups) renderPickups();
    renderHero();
    renderFloatTexts();
  }

  // ---------------------------
  // Loop
  // ---------------------------
  let acc = 0;
  let last = performance.now();

  function step(now) {
    const rawDt = clamp((now - last) / 1000, 0, CFG.maxFrameDt);
    last = now;
    acc += rawDt;

    while (acc >= CFG.fixedDt) {
      tick(CFG.fixedDt);
      acc -= CFG.fixedDt;
    }
    render();
    requestAnimationFrame(step);
  }

  function tick(dt) {
    if (world.state !== State.RUN) {
      updateCamera();
      updateStats();
      return;
    }

    world.time += dt;
    world.timeLeft = CFG.roundSeconds - world.time;
    if (world.timeLeft <= 0) {
      endRound("time");
    }

    updateHero(dt);
    updateCamera();
    if (CFG.enablePickups) {
      spawnPickupsIfNeeded();
      updatePickups(dt);
    }
    updateFloatTexts(dt);
    updateStats();
  }

  // ---------------------------
  // UI bindings
  // ---------------------------
  function bindUI() {
    window.RobinsonUI?.onPlayClick?.(() => {
      if (world.state === State.RUN) return;
      resetRound();
    });

    window.RobinsonUI?.onSpeedClick?.((s) => {
      // only when idle
      if (world.state === State.RUN) return;
      world.speedKey = s.key;
      world.speedFactor = SPEED_PRESETS[s.key] || 1;
    });

    window.RobinsonUI?.onBetChange?.((bet) => {
      if (world.state === State.RUN) return;
      world.bet = bet;
      world.win = bet;
    });
  }

  // Start
  (async () => {
    await loadAssets();
    bindUI();

    // seed UI stats
    updateStats();
    requestAnimationFrame(step);
  })();
})();
