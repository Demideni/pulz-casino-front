(() => {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) return console.error("[game] Canvas not found");
  const ctx = canvas.getContext("2d");

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

  // ===== World (в духе старой версии) =====
  const HERO_X_REL = 0.25;       // как было
  const WATER_LINE_REL = 0.80;   // как было
  const PLAYFIELD_TOP_REL = 0.18;

  const GRAVITY = 750;           // подстроим, но уже “чувствуется”
  const START_VY = -420;         // стартовый “подброс”
  const OBJECT_SPEED_BASE = 520; // скорость острова/сцены

  const ISLAND_W = 320;
  const ISLAND_H = 90;

  const world = {
    t: 0,
    roundT: 0,
    roundDur: 3.6,

    // камера
    cam: { x: 0, y: 0, shake: 0 },

    // герой
    hero: { x: 0, y: 0, vy: 0, w: 65, h: 65, rot: 0 },

    // основной остров
    island: { x: 0, y: 0, w: ISLAND_W, h: ISLAND_H },

    // фон
    stars: [],
    trail: [],

    result: null,     // "WIN" | "LOSE"
    finishT: 0,

    // детерминированный план раунда (только результат)
    plan: null,       // { result: "WIN"|"LOSE" }
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

  // ===== Planning (детерминированно) =====
  function planRound() {
    // Пока 50/50. Дальше подключим вашу RTP/таблицу/сервер.
    const isWin = Math.random() < 0.5;
    world.plan = { result: isWin ? "WIN" : "LOSE" };
  }

  function resetRound() {
    world.t = world.t;
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

    // остров справа
    world.island.x = W * 1.18;
    world.island.y = H * WATER_LINE_REL;
    world.island.w = ISLAND_W;
    world.island.h = ISLAND_H;

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

  // ===== Decision logic (как было, но без near-miss/skid) =====
  function decideOnIslandContact() {
    if (world.decided) return;

    const hero = world.hero;
    const isl = world.island;

    const heroBottom = hero.y + hero.h / 2;
    const islandTop = isl.y - isl.h / 2;

    // вертикально "рядом с верхом острова"
    const verticalClose = heroBottom >= islandTop - hero.h * 0.4;

    // горизонтально "в пределах ширины острова"
    const horizontalClose = Math.abs(isl.x - hero.x) <= isl.w * 0.45;

    if (!(horizontalClose && verticalClose)) return;

    world.decided = true;

    // Детерминированный исход: WIN/LOSE из plan
    // Чтобы визуально гарантировать исход, слегка “дотягиваем” героя в момент контакта:
    if (world.plan.result === "WIN") {
      // лёгкая посадка
      hero.y = islandTop - hero.h * 0.15;
      hero.vy = 0;
      endRound("WIN");
    } else {
      // гарантированный промах: чуть ниже/выше и дальше падение
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

    // stars
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

      // скорость острова по curve
      const speed = OBJECT_SPEED_BASE * (0.9 + 0.55 * easeInOut(p));

      // остров едет влево
      world.island.x -= speed * dt;

      // гравитация героя (как было)
      world.hero.vy += GRAVITY * dt;
      world.hero.y += world.hero.vy * dt;

      // верхний лимит
      const topLimit = H * PLAYFIELD_TOP_REL;
      if (world.hero.y < topLimit) {
        world.hero.y = topLimit;
        if (world.hero.vy < 0) world.hero.vy = 0;
      }

      // лёгкий наклон от вертикальной скорости (без wobble)
      world.hero.rot = clamp(world.hero.vy / 1200, -0.35, 0.55);

      // момент контакта с островом → решение
      decideOnIslandContact();

      // если упал ниже экрана (как было) — LOSE
      if (world.hero.y - world.hero.h / 2 > H + 80 && !world.result) {
        endRound("LOSE");
      }

      // если остров улетел влево, а решения не было — тоже LOSE
      if (world.island.x < -400 && !world.result) {
        endRound("LOSE");
      }
    }

    // ===== Finish anim =====
    if (state === State.FINISH_WIN) {
      world.finishT += dt;
      // держим возле острова (минимальная посадка)
      world.hero.vy *= 0.85;
      if (world.finishT < 0.35) cameraKick(0.10);
    }

    if (state === State.FINISH_LOSE) {
      world.finishT += dt;
      // продолжение падения
      world.hero.vy += GRAVITY * 0.65 * dt;
      world.hero.y += world.hero.vy * dt;
      world.hero.rot += 1.9 * dt;
      if (world.finishT < 0.6) cameraKick(0.16);
    }
  }

  // ===== Render =====
  function render() {
    ctx.clearRect(0, 0, W, H);

    ctx.save();
    ctx.translate(world.cam.x, world.cam.y);

    // bg
    ctx.fillStyle = "#05070d";
    ctx.fillRect(-60, -60, W + 120, H + 120);

    // stars
    for (const st of world.stars) {
      ctx.globalAlpha = st.a;
      ctx.fillStyle = "#9be7ff";
      ctx.fillRect(st.x, st.y, st.s, st.s);
    }
    ctx.globalAlpha = 1;

    // water line (ориентир)
    const waterY = H * WATER_LINE_REL;
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = "#2cf2ff";
    ctx.fillRect(0, waterY, W, 2);
    ctx.globalAlpha = 1;

    // island
    const isl = world.island;
    ctx.fillStyle = "rgba(0,180,255,0.18)";
    ctx.fillRect(isl.x - isl.w / 2 - 14, isl.y - isl.h / 2 - 18, isl.w + 28, isl.h + 36);

    ctx.fillStyle = "rgba(0,180,255,0.70)";
    ctx.fillRect(isl.x - isl.w / 2, isl.y - isl.h / 2, isl.w, isl.h);

    // hero (пока шар — дальше заменим на LEGO Robinson sprite)
    const h = world.hero;
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rot);

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#2cf2ff";
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#00c8ff";
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(-6, -6, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.restore(); // camera

    // debug
    if (world.result) {
      ctx.fillStyle = world.result === "WIN" ? "#2cf2ff" : "#ff3b57";
      ctx.font = "700 18px Arial";
      ctx.fillText(world.result, 24, 34);
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
