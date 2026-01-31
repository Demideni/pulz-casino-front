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
    FINISHING: "FINISHING",
  };

  let state = State.IDLE;
  let lastTime = performance.now();

  // “Авиамастер” ощущение — за счёт speed curve + micro wobble
  const world = {
    t: 0,              // общий таймер
    roundT: 0,         // таймер текущего раунда
    roundDur: 4.2,     // длительность полёта (потом будет зависеть от odds/уровня)
    ship: { x: 120, y: 0, r: 18, vy: 0 },
    platform: { x: 0, y: 0, w: 120, h: 18 },
    scroll: 0,
    stars: [],
    result: null,      // "WIN" | "LOSE" | null
  };

  function initStars() {
    world.stars = [];
    const n = Math.floor((W * H) / 18000);
    for (let i = 0; i < n; i++) {
      world.stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        s: 0.6 + Math.random() * 1.6,
        a: 0.15 + Math.random() * 0.55,
      });
    }
  }
  initStars();

  function resetRoundScene() {
    world.roundT = 0;
    world.result = null;
    world.ship.x = 120;
    world.ship.y = H * 0.5;
    world.ship.vy = 0;

    // Платформа — справа, y чуть рандом + ограничение
    world.platform.x = W - 220;
    const top = H * 0.30;
    const bot = H * 0.70;
    world.platform.y = top + Math.random() * (bot - top);
    world.platform.w = 140;
    world.platform.h = 18;
  }

  // ===== UX helpers (GSAP) =====
  function kickStartFeel() {
    // лёгкий “camera kick”
    if (!window.gsap) return;
    gsap.fromTo(
      canvas,
      { filter: "brightness(1)" },
      { filter: "brightness(1.15)", duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" }
    );
  }

  function endRound(result) {
    if (state !== State.RUNNING) return;

    state = State.FINISHING;
    world.result = result;

    // сообщаем наружу (если нужно)
    window.RobinsonBridge?.emitRoundEnd?.({
      result,
      ts: Date.now(),
    });

    // UI реакция
    window.RobinsonUI?.flashResult?.(result === "WIN");

    // небольшая задержка перед разблокировкой (как в казино)
    setTimeout(() => {
      state = State.IDLE;
      window.RobinsonUI?.unlockAfterRound?.();
    }, 900);
  }

  function startRound() {
    if (state !== State.IDLE) return;
    state = State.RUNNING;

    window.RobinsonUI?.lockForRound?.();
    resetRoundScene();
    kickStartFeel();

    window.RobinsonBridge?.emitRoundStart?.({
      ts: Date.now(),
    });
  }

  // Подключаем кнопку
  window.RobinsonUI?.onPlayClick?.(startRound);

  // ===== Update (physics/feel) =====
  function update(dt) {
    world.t += dt;

    // фон скроллится всегда, но чуть быстрее в RUNNING
    const speedBase = state === State.RUNNING ? 220 : 80;
    world.scroll += speedBase * dt;

    // движение звёзд
    for (const st of world.stars) {
      st.x -= (speedBase * 0.12) * st.s * dt;
      if (st.x < -20) {
        st.x = W + 20;
        st.y = Math.random() * H;
      }
    }

    if (state !== State.RUNNING) return;

    world.roundT += dt;

    // speed curve: плавный разгон (имитация “казино-полёта”)
    const p = Math.min(world.roundT / world.roundDur, 1);
    const speed = 220 + 420 * (1 - Math.cos(p * Math.PI)) * 0.5; // easeInOut

    world.ship.x += speed * dt;

    // микроколебания + лёгкое управление “по рельсам”
    const wobble = Math.sin(world.t * 6.2) * 10 + Math.sin(world.t * 2.7) * 6;
    const targetY = (H * 0.5) + wobble;

    // плавное подтягивание
    const k = 6.5;
    world.ship.y += (targetY - world.ship.y) * (1 - Math.exp(-k * dt));

    // Авто-финиш: когда “долетели” до платформы по X
    if (world.ship.x >= world.platform.x - 10) {
      // win если по Y попали в “коридор” платформы
      const dy = Math.abs(world.ship.y - world.platform.y);
      const win = dy < 26; // пока так, потом привяжем к реальной коллизии
      endRound(win ? "WIN" : "LOSE");
    }
  }

  // ===== Render =====
  function render() {
    ctx.clearRect(0, 0, W, H);

    // космос
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, W, H);

    // звёзды
    for (const st of world.stars) {
      ctx.globalAlpha = st.a;
      ctx.fillStyle = "#9be7ff";
      ctx.fillRect(st.x, st.y, st.s, st.s);
    }
    ctx.globalAlpha = 1;

    // лёгкий “nebula band”
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#2cf2ff";
    ctx.fillRect(0, H * 0.18, W, 2);
    ctx.fillRect(0, H * 0.82, W, 2);
    ctx.globalAlpha = 1;

    // платформа
    ctx.save();
    ctx.translate(0, 0);
    ctx.fillStyle = "rgba(0,180,255,0.20)";
    ctx.fillRect(world.platform.x - 12, world.platform.y - 16, world.platform.w + 24, world.platform.h + 32);

    ctx.fillStyle = "rgba(0,180,255,0.65)";
    ctx.fillRect(world.platform.x, world.platform.y, world.platform.w, world.platform.h);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.fillRect(world.platform.x + 10, world.platform.y + 5, world.platform.w - 20, 3);
    ctx.restore();

    // корабль (временно кружок-герой)
    ctx.save();
    ctx.translate(world.ship.x, world.ship.y);

    // glow
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#2cf2ff";
    ctx.beginPath();
    ctx.arc(0, 0, world.ship.r * 2.2, 0, Math.PI * 2);
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

    // debug/result (потом уберём)
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

    // clamp dt — must-have
    dt = Math.min(dt, 0.033);

    update(dt);
    render();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
