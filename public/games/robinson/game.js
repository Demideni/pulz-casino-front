(() => {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) return console.error("[game] Canvas not found");
  const ctx = canvas.getContext("2d");

  // ===== Assets (images) =====
  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  const GFX = {
    bg: null,
    robinson: null,
    island: null,
    ready: false,
  };

  Promise.all([
    loadImage("./assets/splash_bg.png"),
    loadImage("./assets/robinson.png"),
    loadImage("./assets/island_long.png"),
  ]).then(([bg, robinson, island]) => {
    GFX.bg = bg;
    GFX.robinson = robinson;
    GFX.island = island;
    GFX.ready = true;
  });

  // ===== Resize / DPR =====
  let W = 0, H = 0, dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // ===== Utils =====
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeInOut = (t) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t, 0, 1));

  // ===== State =====
  const State = {
    IDLE: "IDLE",
    RUNNING: "RUNNING",
    FINISH_WIN: "FINISH_WIN",
    FINISH_LOSE: "FINISH_LOSE",
  };
  let state = State.IDLE;
  let lastTime = performance.now();

  // ===== World (как старая версия: vy + gravity, остров едет) =====
  const HERO_X_REL = 0.25;
  const WATER_LINE_REL = 0.80;
  const PLAYFIELD_TOP_REL = 0.18;

  const GRAVITY = 750;
  const START_VY = -420;
  const OBJECT_SPEED_BASE = 520;

  const world = {
    t: 0,
    roundT: 0,
    roundDur: 3.6,

    cam: { x: 0, y: 0, shake: 0 },

    hero: { x: 0, y: 0, vy: 0, w: 110, h: 110, rot: 0 },
    island: { x: 0, y: 0, w: 520, h: 170 },

    stars: [],
    trail: [],

    result: null,
    finishT: 0,

    plan: null,     // { result: "WIN" | "LOSE" }
    decided: false,
  };

  function initStars() {
    world.stars = [];
    const n = Math.floor((W * H) / 16000);
    for (let i = 0; i < n; i++) {
      world.stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        s: 0.6 + Math.random() * 1.8,
        a: 0.15 + Math.random() * 0.6,
      });
    }
  }
  initStars();

  function cameraKick(amount = 1) {
    world.cam.shake = Math.max(world.cam.shake, amount);
  }

  function kickStartFeel() {
    if (!window.gsap) return;
    gsap.fromTo(
      canvas,
      { filter: "brightness(1)" },
      { filter: "brightness(1.18)", duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" }
    );
  }

  function emitStart() {
    window.RobinsonBridge?.emitRoundStart?.({ ts: Date.now() });
  }
  function emitEnd(result) {
    window.RobinsonBridge?.emitRoundEnd?.({ result, ts: Date.now() });
  }

  // ===== Planning =====
  function planRound() {
    const isWin = Math.random() < 0.5; // позже подключим вашу RTP/таблицу
    world.plan = { result: isWin ? "WIN" : "LOSE" };
  }

  function resetRound() {
    world.roundT = 0;
    world.finishT = 0;
    world.result = null;
    world.decided = false;
    world.trail = [];

    const heroX = W * HERO_X_REL;
    world.hero.x = heroX;
    world.hero.y = H * 0.45;
    world.hero.vy = START_VY;
    world.hero.rot = 0;

    // размеры под экран (мобилка/десктоп)
    const scale = Math.min(W / 1200, H / 800, 1);
const heroScale = 1.9; // +90%
world.hero.w = Math.round(110 * scale * heroScale);
world.hero.h = Math.round(110 * scale * heroScale);

    world.island.w = Math.round(520 * scale);
    world.island.h = Math.round(170 * scale);

    // остров справа
    world.island.x = W * 1.18;
    world.island.y = H * WATER_LINE_REL;

    world.cam.x = 0;
    world.cam.y = 0;
    world.cam.shake = 0;

    planRound();
  }

  function endRound(result) {
    if (state !== State.RUNNING) return;

    world.result = result;
    emitEnd(result);

    window.RobinsonUI?.flashResult?.(result === "WIN");
    window.RobinsonUI?.showResultText?.(result, result === "WIN");

    state = result === "WIN" ? State.FINISH_WIN : State.FINISH_LOSE;
    world.finishT = 0;

    cameraKick(result === "WIN" ? 1.2 : 1.6);

    setTimeout(() => {
      state = State.IDLE;
      window.RobinsonUI?.unlockAfterRound?.();
    }, 1050);
  }

  function startRound() {
    if (state !== State.IDLE) return;
    state = State.RUNNING;

    window.RobinsonUI?.lockForRound?.();
    resetRound();
    kickStartFeel();
    emitStart();
  }

  window.RobinsonUI?.onPlayClick?.(startRound);

  // ===== Collision decision (как было) =====
  function decideOnIslandContact() {
    if (world.decided) return;

    const hero = world.hero;
    const isl = world.island;

    const heroBottom = hero.y + hero.h / 2;
    const islandTop = isl.y - isl.h / 2;

    const verticalClose = heroBottom >= islandTop - hero.h * 0.4;
    const horizontalClose = Math.abs(isl.x - hero.x) <= isl.w * 0.45;

    if (!(horizontalClose && verticalClose)) return;

    world.decided = true;

    if (world.plan.result === "WIN") {
      hero.y = islandTop - hero.h * 0.15;
      hero.vy = 0;
      endRound("WIN");
    } else {
      hero.vy = Math.max(hero.vy, 220);
      endRound("LOSE");
    }
  }

  // ===== Update =====
  function update(dt) {
    world.t += dt;

    // camera shake decay
    world.cam.shake = Math.max(0, world.cam.shake - dt * 3.6);
    const s = world.cam.shake;
    if (s > 0) {
      world.cam.x = Math.sin(world.t * 41.3) * 6 * s;
      world.cam.y = Math.cos(world.t * 37.7) * 5 * s;
    } else {
      world.cam.x = 0;
      world.cam.y = 0;
    }

    // stars (fallback)
    const starSpeed = state === State.RUNNING ? 260 : 90;
    for (const st of world.stars) {
      st.x -= (starSpeed * 0.14) * st.s * dt;
      if (st.x < -20) {
        st.x = W + 20;
        st.y = Math.random() * H;
      }
    }

    // trail
    if (state !== State.IDLE) {
      world.trail.push({ x: world.hero.x, y: world.hero.y });
      if (world.trail.length > 24) world.trail.shift();
    }

    if (state === State.RUNNING) {
      world.roundT += dt;
      const p = clamp(world.roundT / world.roundDur, 0, 1);

      const speed = OBJECT_SPEED_BASE * (0.9 + 0.55 * easeInOut(p));

      // остров едет влево
      world.island.x -= speed * dt;

      // гравитация
      world.hero.vy += GRAVITY * dt;
      world.hero.y += world.hero.vy * dt;

      // верхний лимит
      const topLimit = H * PLAYFIELD_TOP_REL;
      if (world.hero.y < topLimit) {
        world.hero.y = topLimit;
        if (world.hero.vy < 0) world.hero.vy = 0;
      }

      // наклон от вертикальной скорости
      world.hero.rot = clamp(world.hero.vy / 1200, -0.35, 0.55);

      // решение на контакте
      decideOnIslandContact();

      // упал — lose
      if (world.hero.y - world.hero.h / 2 > H + 80 && !world.result) {
        endRound("LOSE");
      }

      // остров улетел — lose
      if (world.island.x < -600 && !world.result) {
        endRound("LOSE");
      }
    }

    // finish anim
    if (state === State.FINISH_WIN) {
      world.finishT += dt;
      world.hero.vy *= 0.85;
      if (world.finishT < 0.35) cameraKick(0.10);
    }

    if (state === State.FINISH_LOSE) {
      world.finishT += dt;
      world.hero.vy += GRAVITY * 0.65 * dt;
      world.hero.y += world.hero.vy * dt;
      world.hero.rot += 1.9 * dt;
      if (world.finishT < 0.6) cameraKick(0.16);
    }
  }

  // ===== Render =====
  function drawCentered(img, x, y, w, h, rot = 0) {
    if (!img) return false;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
    return true;
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.translate(world.cam.x, world.cam.y);

    // BG
    if (GFX.ready && GFX.bg) {
      const img = GFX.bg;
      const s = Math.max(W / img.width, H / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      ctx.globalAlpha = 1;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

      // tint
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "#05070d";
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = "#05070d";
      ctx.fillRect(-60, -60, W + 120, H + 120);

      for (const st of world.stars) {
        ctx.globalAlpha = st.a;
        ctx.fillStyle = "#9be7ff";
        ctx.fillRect(st.x, st.y, st.s, st.s);
      }
      ctx.globalAlpha = 1;
    }

    // water line hint
    const waterY = H * WATER_LINE_REL;
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#2cf2ff";
    ctx.fillRect(0, waterY, W, 2);
    ctx.globalAlpha = 1;

    // ISLAND
    const isl = world.island;

    // glow
   

    const islandDrawn = drawCentered(GFX.island, isl.x, isl.y, isl.w, isl.h, 0);
    if (!islandDrawn) {
      ctx.fillStyle = "rgba(0,180,255,0.70)";
      ctx.fillRect(isl.x - isl.w / 2, isl.y - isl.h / 2, isl.w, isl.h);
    }

    // TRAIL
    for (let i = 0; i < world.trail.length; i++) {
      const p = world.trail[i];
      const a = i / world.trail.length;
      ctx.globalAlpha = 0.12 * a;
      ctx.fillStyle = "#2cf2ff";
      ctx.beginPath();
      ctx.arc(p.x - 10, p.y, 10 * a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // HERO
    const h = world.hero;

    // glow
    

    const heroDrawn = drawCentered(GFX.robinson, h.x, h.y, h.w, h.h, h.rot);
    if (!heroDrawn) {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rot);
      ctx.fillStyle = "#00c8ff";
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // camera

    // debug result
    if (world.result) {
      ctx.fillStyle = world.result === "WIN" ? "#2cf2ff" : "#ff3b57";
      ctx.font = "700 18px Arial";
      ctx.fillText(world.result, 24, 34);
    }

    // loading hint
    if (!GFX.ready) {
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = "600 14px Arial";
      ctx.fillText("Loading assets...", 24, H - 24);
    }
  }

  // ===== Loop =====
  function loop(time) {
    let dt = (time - lastTime) / 1000;
    lastTime = time;
    dt = Math.min(dt, 0.033);

    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
