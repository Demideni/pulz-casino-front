(() => {
  const canvas = document.getElementById("game-canvas");
  if (!canvas) {
    console.error("Canvas #game-canvas not found");
    return;
  }

  const ctx = canvas.getContext("2d");
  let lastTime = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener("resize", resize);
  resize();

  function update(dt) {
    // сюда позже перенесём логику полёта / столкновений
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // временный фон (чтобы было видно, что всё работает)
    ctx.fillStyle = "#05070d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // тестовая подпись
    ctx.fillStyle = "#00e5ff";
    ctx.font = "16px Arial";
    ctx.fillText("Robinson game loop OK", 20, 30);
  }

  function loop(time) {
    let dt = (time - lastTime) / 1000;
    lastTime = time;

    // 🔥 критично для feel как BGaming
    dt = Math.min(dt, 0.033);

    update(dt);
    render();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
