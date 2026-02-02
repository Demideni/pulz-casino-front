(() => {
  const $play = document.getElementById("play-btn");
  const $betBox = document.getElementById("bet-box");
  const $betValue = document.getElementById("bet-value");
  const $balValue = document.getElementById("bal-value");

  const $modal = document.getElementById("bet-modal");
  const $grid = document.getElementById("bet-grid");
  const $close = document.getElementById("bet-close");

  if (!$play || !$betBox || !$betValue || !$balValue || !$modal || !$grid || !$close) {
    console.error("[ui] required elements not found");
    return;
  }

  // ---- State ----
  let state = "IDLE"; // IDLE | RUNNING | LOCKED
  let idleTween = null;

  // bets in USD
  const BETS = [0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200];
  let bet = 1;

  let roundId = null;

  const fmt = (n) => {
    const v = Math.max(0, Number(n) || 0);
    return "$" + v.toFixed(v >= 100 ? 0 : 2);
  };

  const setBet = (v) => {
    bet = v;
    $betValue.textContent = fmt(bet);
    window.RobinsonGame?.setBet?.(bet);
  };

  const setBalance = (v) => ($balValue.textContent = fmt(v));

  const setEnabled = (enabled) => {
    $play.style.pointerEvents = enabled ? "auto" : "none";
    $play.style.opacity = enabled ? "1" : "0.75";
    $betBox.style.pointerEvents = enabled ? "auto" : "none";
    $betBox.style.opacity = enabled ? "1" : "0.65";
  };

  const startIdleAnim = () => {
    if (!window.gsap) return;
    stopIdleAnim();
    idleTween = gsap.to($play, {
      scale: 1.05,
      duration: 0.9,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  };

  const stopIdleAnim = () => {
    if (idleTween) {
      idleTween.kill();
      idleTween = null;
    }
    if (window.gsap) gsap.set($play, { scale: 1 });
  };

  const tapAnim = () => {
    if (!window.gsap) return;
    gsap.fromTo(
      $play,
      { scale: 1 },
      { scale: 0.93, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out" }
    );
  };

  const lockForRound = () => {
    state = "RUNNING";
    stopIdleAnim();
    setEnabled(false);
    $play.textContent = "...";
  };

  const unlockAfterRound = () => {
    state = "IDLE";
    setEnabled(true);
    $play.textContent = "PLAY";
    startIdleAnim();
    roundId = null;
    if (window.gsap) gsap.fromTo($play, { scale: 0.98 }, { scale: 1, duration: 0.22, ease: "back.out(2)" });
  };

  // ---- Modal ----
  const openModal = () => {
    $modal.classList.remove("hidden");
  };
  const closeModal = () => {
    $modal.classList.add("hidden");
  };

  const renderBetGrid = () => {
    $grid.innerHTML = "";
    for (const v of BETS) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bet-opt" + (v === bet ? " active" : "");
      b.textContent = fmt(v);
      b.addEventListener("click", () => {
        setBet(v);
        renderBetGrid();
        closeModal();
      });
      $grid.appendChild(b);
    }
  };

  $betBox.addEventListener("click", () => {
    if (state !== "IDLE") return;
    renderBetGrid();
    openModal();
  });
  $close.addEventListener("click", closeModal);
  $modal.addEventListener("click", (e) => {
    if (e.target === $modal) closeModal();
  });

  // ---- Casino API wiring ----
  const getApi = () => (window.PULZ_GAME && typeof window.PULZ_GAME === "object" ? window.PULZ_GAME : null);

  async function refreshBalance() {
    try {
      const api = getApi();
      if (!api?.getBalance) return;
      const b = await api.getBalance();
      setBalance(b);
    } catch (e) {
      console.warn("[ui] getBalance failed", e);
    }
  }

  async function onPlay() {
    if (state !== "IDLE") return;

    tapAnim();

    const api = getApi();
    if (!api?.placeBet || !api?.finishRound) {
      console.warn("[ui] PULZ_GAME api missing; starting locally");
      lockForRound();
      window.RobinsonGame?.start?.({ bet, roundId: "local" });
      return;
    }

    try {
      lockForRound();
      const { balance, roundId: rid } = await api.placeBet(bet);
      roundId = rid;
      setBalance(balance);
      window.RobinsonGame?.start?.({ bet, roundId });
    } catch (e) {
      console.warn("[ui] placeBet failed", e);
      unlockAfterRound();
    }
  }

  $play.addEventListener("click", onPlay);

  // Game → UI callbacks
  window.RobinsonUI = {

    lockForRound,
    unlockAfterRound,
    setBalance,
    refreshBalance,
    flashResult(isWin) {
      if (!window.gsap) return;
      gsap.fromTo(
        $play,
        { filter: "brightness(1)" },
        { filter: `brightness(${isWin ? 1.25 : 1.05})`, duration: 0.18, yoyo: true, repeat: 3, ease: "sine.inOut" }
      );
    },

    setStats({ time, altitude, distance, multiplier }) {
      const $bar = document.getElementById("statsBar");
      const $t = document.getElementById("statTime");
      const $a = document.getElementById("statAlt");
      const $d = document.getElementById("statDist");
      const $m = document.getElementById("statMult");
      if (!$t || !$a || !$d || !$m) return;

      const pad2 = (n) => String(n).padStart(2, "0");
      const sec = Math.max(0, Number(time) || 0);
      const mm = Math.floor(sec / 60);
      const ss = Math.floor(sec % 60);
      $t.textContent = `${pad2(mm)}:${pad2(ss)}`;

      const alt = Math.max(0, Number(altitude) || 0);
      const dist = Math.max(0, Number(distance) || 0);
      $a.textContent = `${alt.toFixed(1)}m`;
      $d.textContent = `${dist.toFixed(1)}m`;

      const mult = Math.max(0, Number(multiplier) || 1);
      $m.textContent = `x${mult.toFixed(1)}`;

      // Ensure visible (in case something toggles display)
      if ($bar && $bar.style.display === "none") $bar.style.display = "grid";
    },

    showResultText(text) {
      const prev = $play.textContent;
      $play.textContent = text;
      setTimeout(() => ($play.textContent = prev), 650);
    },
  };

  // init
  setBet(bet);
  refreshBalance();
  startIdleAnim();
})();