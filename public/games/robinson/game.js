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

  // ===== Game State =====
  const State = {
    IDLE: "IDLE",
    RUNNING: "RUNNING",
    FINISH_WIN: "FINISH_WIN",
    FINISH_LOSE: "FINISH_LOSE",
  };

  let state = State.IDLE;
  let lastTime = performance.now();

  // ===== World =====
  const world = {
    t: 0,
    roundT: 0,
    roundDur: 4.2,

    ship: { x: 120, y: 0, r: 18, vx: 0, vy: 0, rot: 0 },
    platform: { x: 0, y: 0, w: 140, h: 18 },

    // ощущение камеры
    cam: { x: 0, y: 0, shake: 0 },

    // фон
    scroll: 0,
    stars: [],

    // FX
    trail: [],
    result: null, // "WIN" | "LOSE" | null
    finishT: 0,
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

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function resetRoundScene() {
    world.roundT = 0;
    world.finishT = 0;
    world.result = null;
    world.ship.x = 120;
    world.ship.y = H * 0.52;
    world.ship.vx = 0;
    world.ship.vy = 0;
    world.ship.rot = 0;

    world.cam.x = 0;
    world.cam.y = 0;
    world.cam.shake = 0;

    world.trail = [];

    world.platform.x = W - 240;
    const top = H * 0.30;
    const bot = H * 0.72;
    world.platform.y = top + Math.random() * (bot - top);
  }

  // ===== Feel helpers =====
  function kickStartFeel() {
    if (!window.gsap) return;
    gsap.fromTo(
      canvas,
      { filter: "brightness(1)" },
      { filter: "brightness(1.18)", duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" }
    );
  }

  function cameraKick(amount = 1) {
    world.cam.shake = Math.max(world.cam.shake, amount);
  }

  function emitStart() {
    window.RobinsonBridge?.emitRoundStart?.({ ts: Date.now() });
  }

  function emitEnd(result) {
    window.RobinsonBridge?.emitRoundEnd?.({ result, ts: Date.now() });
  }

  function endRound(result) {
    if (state !== State.RUNNING) return;

    world.result = result;
    emitEnd(result);

    window.RobinsonUI?.flashResult?.(result === "WIN");
    window.RobinsonUI?.showResultText?.(result === "WIN" ? "WIN" : "LOSE", result === "WIN");

    state = result === "WIN" ? State.FINISH_WIN : State.FINISH_LOSE;
    world.finishT = 0;

    // короткий “impact”
    cameraKick(result === "WIN" ? 1.2 : 1.6);

    // разблокировка UI через “казино-паузу”
    setTimeout(() => {
      state = State.IDLE;
      window.RobinsonUI?.unlockAfterRound?.();
    }, 1050);
  }

  function startRound() {
    if (state !== State.IDLE) return;
    state = State.RUNNING;

    window.RobinsonUI?.lockForRound?.();
    resetRoundScene();
    kickStartFeel();
    emitStart();
  }

  window.RobinsonUI?.onPlayClick?.(startRound);

  // ===== Core Update =====
  function update(dt) {
    world.t += dt;

    // камера shake decay
    world.cam.shake = Math.max(0, world.cam.shake - dt * 3.5);
    const shakeAmt = world.cam.shake;
    if (shakeAmt > 0) {
      // псевдорандом без Math.random() в каждом кадре
      const sx = Math.sin(world.t * 41.3) * 6 * shakeAmt;
      const sy = Math.cos(world.t * 37.7) * 5 * shakeAmt;
      world.cam.x = sx;
      world.cam.y = sy;
    } else {
      world.cam.x = 0;
      world.cam.y = 0;
    }

    // фон скроллится всегда
    const baseSpeed = state === State.RUNNING ? 240 : 90;

    // speed curve (мягкий разгон)
    let speed = baseSpeed;
    if (state === State.RUNNING) {
      world.roundT += dt;
      const p = clamp(world.roundT / world.roundDur, 0, 1);
      // easeInOut -> резвее к концу
      const curve = 0.5 - 0.5 * Math.cos(Math.PI * p);
      speed = 240 + 520 * curve; // ~240..760
    }

    world.scroll += speed * dt;

    // stars
    for (const st of world.stars) {
      st.x -= (speed * 0.14) * st.s * dt;
      if (st.x < -20) {
        st.x = W + 20;
        st.y = Math.random() * H;
      }
    }

    // trail (простая)
    if (state === State.RUNNING || state === State.FINISH_WIN || state === State.FINISH_LOSE) {
      world.trail.push({ x: world.ship.x, y: world.ship.y, t: world.t });
      if (world.trail.length > 26) world.trail.shift();
    }

    if (state === State.RUNNING) {
      // корабль движение по X
      world.ship.vx = speed;
      world.ship.x += world.ship.vx * dt;

      // “на рельсах” + wobble
      const wobble = Math.sin(world.t * 6.4) * 11 + Math.sin(world.t * 2.8) * 7;
      const targetY = (H * 0.52) + wobble;

      // следуем к цели
      const k = 7.0;
      world.ship.y += (targetY - world.ship.y) * (1 - Math.exp(-k * dt));

      // лёгкий наклон
      world.ship.rot = (Math.sin(world.t * 3.2) * 0.08) + (wobble / 220) * 0.12;

      // проверяем достижение платформы
      if (world.ship.x >= world.platform.x - 8) {
        const dy = Math.abs(world.ship.y - world.platform.y);
        const win = dy < 26;

        // “удар”
        cameraKick(1.2);

        // мгновенно переключаемся в финишный стейт
        endRound(win ? "WIN" : "LOSE");
      }
    }

    // ===== Finish anim =====
    if (state === State.FINISH_WIN) {
      world.finishT += dt;

      // посадка: корабль “прилипает” к платформе и чуть подпрыгивает
      const tt = clamp(world.finishT / 0.55, 0, 1);
      const ease = 1 - Math.pow(1 - tt, 3);

      const landX = world.platform.x + world.platform.w * 0.38;
      const landY = world.platform.y - 6;

      world.ship.x += (landX - world.ship.x) * (0.18 + 0.22 * ease);
      world.ship.y += (landY - world.ship.y) * (0.22 + 0.25 * ease);

      // маленький bounce
      const bounce = Math.sin(tt * Math.PI) * (1 - tt) * 10;
      world.ship.y -= bounce;

      world.ship.rot *= 0.85;

      if (tt > 0.15) cameraKick(0.15);
    }

    if (state === State.FINISH_LOSE) {
      world.finishT += dt;

      // промах: корабль “ныряет” вниз и теряет скорость
      world.ship.vy += 900 * dt;
      world.ship.y += world.ship.vy * dt;

      // чуть в сторону, будто сносит
      world.ship.x += 120 * dt;

      world.ship.rot += 2.2 * dt;

      // чуть больше shake
      if (world.finishT < 0.5) cameraKick(0.25);

      // если улетел — прекращаем движение (для стабильности)
      if (world.ship.y > H + 120) {
        world.ship.y = H + 120;
        world.ship.vy = 0;
      }
    }
  }

  // ===== Render =====
  function render() {
    ctx.clearRect(0, 0, W, H);

    // camera offset
    ctx.save();
    ctx.translate(world.cam.x, world.cam.y);

    // space bg
    ctx.fillStyle = "#05070d";
    ctx.fillRect(-50, -50, W + 100, H + 100);

    // stars
    for (const st of world.stars) {
      ctx.globalAlpha = st.a;
      ctx.fillStyle = "#9be7ff";
      ctx.fillRect(st.x, st.y, st.s, st.s);
    }
    ctx.globalAlpha = 1;

    // subtle nebula lines
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#2cf2ff";
    ctx.fillRect(0, H * 0.16, W, 2);
    ctx.fillRect(0, H * 0.84, W, 2);
    ctx.globalAlpha = 1;

    // platform glow
    ctx.fillStyle = "rgba(0,180,255,0.18)";
    ctx.fillRect(world.platform.x - 14, world.platform.y - 18, world.platform.w + 28, world.platform.h + 36);

    // platform body
    ctx.fillStyle = "rgba(0,180,255,0.70)";
    ctx.fillRect(world.platform.x, world.platform.y, world.platform.w, world.platform.h);

    // highlight stripe
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillRect(world.platform.x + 10, world.platform.y + 5, world.platform.w - 20, 3);

    // trail
    for (let i = 0; i < world.trail.length; i++) {
      const p = world.trail[i];
      const a = i / world.trail.length;
      ctx.globalAlpha = 0.18 * a;
      ctx.fillStyle = "#2cf2ff";
      ctx.beginPath();
      ctx.arc(p.x - 6, p.y, 10 * a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ship (temp orb)
    ctx.save();
    ctx.translate(world.ship.x, world.ship.y);
    ctx.rotate(world.ship.rot);

    // glow
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#2cf2ff";
    ctx.beginPath();
    ctx.arc(0, 0, world.ship.r * 2.3, 0, Math.PI * 2);
    ctx.fill();

    // body
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#00c8ff";
    ctx.beginPath();
    ctx.arc(0, 0, world.ship.r, 0, Math.PI * 2);
    ctx.fill();

    // highlight
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(-6, -6, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore(); // camera

    // (пока оставим) маленький debug текста результата — потом уберём
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
    dt = Math.min(dt, 0.033); // clamp dt

    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
