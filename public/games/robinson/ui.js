(() => {
  const $ = (id) => document.getElementById(id);

  const $play = $("play-btn");
  const $speed = $("speed-btn");
  const $betVal = $("bet-value");
  const $balVal = $("balance-value");
  const $betUp = $("bet-up");
  const $betDown = $("bet-down");
  const $alt = $("stat-alt");
  const $dist = $("stat-dist");
  const $mult = $("stat-mult");
  const $timer = $("stat-timer");

  if (!$play) {
    console.error("[ui] missing #play-btn");
    return;
  }

  const SPEEDS = [
    { key: "x1", factor: 1 },
    { key: "x2", factor: 2 },
    { key: "x3", factor: 3 },
  ];
  let speedIdx = 0;

  // BET model (dev defaults; can be overridden by bridge context)
  const BET_STEPS = [0.1, 0.2, 0.5, 1, 2, 5, 10];
  let betIdx = 2; // 0.5
  let balance = 999.5;

  const fmt2 = (n) => (Math.round(n * 100) / 100).toFixed(2);

  const renderMoney = () => {
    if ($betVal) $betVal.textContent = fmt2(BET_STEPS[betIdx]);
    if ($balVal) $balVal.textContent = fmt2(balance);
  };

  const renderSpeed = () => {
    if (!$speed) return;
    $speed.textContent = SPEEDS[speedIdx].key.toUpperCase();
  };

  // Public UI API used by game.js
  window.RobinsonUI = {
    onPlayClick(handler) {
      $play.addEventListener("click", () => handler?.());
    },
    onSpeedClick(handler) {
      if (!$speed) return;
      $speed.addEventListener("click", () => {
        speedIdx = (speedIdx + 1) % SPEEDS.length;
        renderSpeed();
        handler?.(SPEEDS[speedIdx]);
      });
    },
    onBetChange(handler) {
      $betUp?.addEventListener("click", () => {
        betIdx = Math.min(BET_STEPS.length - 1, betIdx + 1);
        renderMoney();
        handler?.(BET_STEPS[betIdx]);
      });
      $betDown?.addEventListener("click", () => {
        betIdx = Math.max(0, betIdx - 1);
        renderMoney();
        handler?.(BET_STEPS[betIdx]);
      });
    },
    lock(isLocked) {
      // lock bet/speed while running
      const pe = isLocked ? "none" : "auto";
      $betUp && ($betUp.style.pointerEvents = pe);
      $betDown && ($betDown.style.pointerEvents = pe);
      $speed && ($speed.style.pointerEvents = pe);
      $play.style.pointerEvents = isLocked ? "none" : "auto";
      $play.style.opacity = isLocked ? "0.75" : "1";
    },
    setStats({ altitudeM, distanceM, multiplier, timeLeftS }) {
      if ($alt) $alt.textContent = `${altitudeM.toFixed(1)}m`;
      if ($dist) $dist.textContent = `${distanceM.toFixed(1)}m`;
      if ($mult) $mult.textContent = `x${multiplier.toFixed(1)}`;
      if ($timer) {
        const s = Math.max(0, Math.floor(timeLeftS));
        const mm = String(Math.floor(s / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        $timer.textContent = `${mm}:${ss}`;
      }
    },
    setBalance(v) {
      balance = v;
      renderMoney();
    },
    getContext() {
      return {
        bet: BET_STEPS[betIdx],
        balance,
        speed: SPEEDS[speedIdx],
      };
    },
  };

  // Init from bridge if available
  try {
    const ctx = window.RobinsonBridge?.getContext?.();
    if (ctx) {
      if (typeof ctx.balance === "number") balance = ctx.balance;
      if (typeof ctx.bet === "number") {
        const i = BET_STEPS.findIndex((x) => Math.abs(x - ctx.bet) < 1e-9);
        if (i >= 0) betIdx = i;
      }
    }
  } catch {}

  renderMoney();
  renderSpeed();
})();
