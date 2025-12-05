"use client";

import { useState } from "react";
import Link from "next/link";

const PRIZES = [
  "10 фриспинов",
  "5$ бонус",
  "x2 кэшбэк",
  "20% кэшбэк",
  "Сюрприз-бонус",
];

function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-300">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        className="fill-emerald-900/60 stroke-emerald-300"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="12" r="3.4" className="fill-black/60 stroke-amber-300" strokeWidth="1.2" />
      <path
        d="M12 9.5v5M10.7 10.5c.25-.6.76-1 1.3-1 .9 0 1.5.6 1.5 1.4 0 .7-.4 1.1-1.2 1.3L12 13"
        className="stroke-amber-200"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-sky-200">
      <circle
        cx="12"
        cy="9"
        r="3.3"
        className="fill-sky-900/70 stroke-sky-300"
        strokeWidth="1.3"
      />
      <path
        d="M6.2 18.5c1.3-2.5 3.2-3.8 5.8-3.8 2.6 0 4.4 1.3 5.8 3.8"
        className="stroke-sky-300"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SlotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-200">
      <rect
        x="4"
        y="7"
        width="16"
        height="11"
        rx="2"
        className="fill-rose-900/70 stroke-rose-300"
        strokeWidth="1.4"
      />
      <rect x="6.2" y="9" width="3.3" height="4.8" rx="0.7" className="fill-slate-950" />
      <rect x="10.3" y="9" width="3.3" height="4.8" rx="0.7" className="fill-slate-950" />
      <rect x="14.5" y="9" width="3.3" height="4.8" rx="0.7" className="fill-slate-950" />
      <path
        d="M6.7 11.3h2.2M10.8 11.3h2.2M15 11.3h2.2"
        className="stroke-amber-300"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M18.3 7.8l1.4-2.3M19.7 5.5h1.6M18.3 7.8h1.8"
        className="stroke-rose-300"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-100">
      <path
        d="M5 8.2h14M5 12h10.7M5 15.8h7.4"
        className="stroke-slate-100"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FortuneWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function openWheel() {
    setIsOpen(true);
    setResult(null);
    setIsSpinning(false);
  }

  function closeWheel() {
    setIsOpen(false);
    setResult(null);
    setIsSpinning(false);
  }

  function handleSpin() {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setResult(prize);
    }, 2400);
  }

  return (
    <>
      {/* Нижний бар как у Jeton */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-900/90 bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-end justify-between px-1 pb-3 pt-1">
          {/* Касса */}
          <Link href="/cashier" className="flex w-1/5 flex-col items-center gap-1 text-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900 via-black to-slate-950 ring-1 ring-slate-700/80 shadow-[0_0_14px_rgba(15,23,42,0.9)]">
              <CashIcon />
            </div>
            <span className="text-[11px] text-slate-300">Касса</span>
          </Link>

          {/* Вход */}
          <Link href="/status" className="flex w-1/5 flex-col items-center gap-1 text-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900 via-black to-slate-950 ring-1 ring-slate-700/80 shadow-[0_0_14px_rgba(15,23,42,0.9)]">
              <UserIcon />
            </div>
            <span className="text-[11px] text-slate-300">Вход</span>
          </Link>

          {/* Центральное мини-колесо */}
          <button
            type="button"
            onClick={openWheel}
            className="flex w-1/5 flex-col items-center gap-1 text-xs focus:outline-none"
          >
            <div className="relative flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_0%,#f97373,transparent_55%),radial-gradient(circle_at_70%_100%,#facc15,transparent_55%)] opacity-80 shadow-[0_0_35px_rgba(248,113,113,0.85)]" />
              <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-[#1a0207] via-black to-[#050509] ring-1 ring-red-700/70" />
              <div className={`relative h-9 w-9 rounded-full border border-red-500/70 bg-gradient-to-b from-red-500 via-amber-400 to-red-600 ${isOpen ? "animate-spin-slow" : ""}`}>
                {/* условный делёж колеса */}
                <div className="absolute inset-[5px] rounded-full bg-[conic-gradient(from_210deg,_#fecaca_0deg,_#fecaca_45deg,_#f97373_45deg,_#f97373_90deg,_#fee2e2_90deg,_#fee2e2_135deg,_#fbbf24_135deg,_#fbbf24_180deg,_#fee2e2_180deg,_#fee2e2_225deg,_#f97373_225deg,_#f97373_270deg,_#fed7aa_270deg,_#fed7aa_315deg,_#fecaca_315deg,_#fecaca_360deg)]" />
                <div className="absolute inset-[9px] rounded-full bg-slate-950/95" />
                <div className="absolute inset-[11px] flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 via-red-400 to-amber-300 shadow-[0_0_12px_rgba(248,113,113,0.9)]">
                  <span className="text-[11px] font-semibold tracking-wide text-slate-950">
                    P
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-red-300">Pulz Wheel</span>
          </button>

          {/* Игры */}
          <Link href="/games" className="flex w-1/5 flex-col items-center gap-1 text-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900 via-black to-slate-950 ring-1 ring-slate-700/80 shadow-[0_0_14px_rgba(15,23,42,0.9)]">
              <SlotIcon />
            </div>
            <span className="text-[11px] text-slate-300">Игры</span>
          </Link>

          {/* Меню */}
          <Link href="/about" className="flex w-1/5 flex-col items-center gap-1 text-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-900 via-black to-slate-950 ring-1 ring-slate-700/80 shadow-[0_0_14px_rgba(15,23,42,0.9)]">
              <MenuIcon />
            </div>
            <span className="text-[11px] text-slate-300">Меню</span>
          </Link>
        </div>
      </div>

      {/* Модалка с большим колесом */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-900/70 bg-gradient-to-b from-[#12020a] via-black to-[#050509] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Pulz Wheel
                </div>
                <div className="text-[11px] text-slate-400">
                  Первый спин для команды — бесплатно.
                </div>
              </div>
              <button
                type="button"
                onClick={closeWheel}
                className="rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
              >
                Закрыть
              </button>
            </div>

            {/* Само колесо */}
            <div className="mb-4 flex flex-col items-center">
              <div className="relative h-52 w-52">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.6),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(251,191,36,0.55),transparent_55%)] opacity-80 blur-sm" />
                <div className="absolute inset-[6px] rounded-full bg-gradient-to-b from-[#1b0208] via-black to-[#050509] ring-2 ring-red-700/70" />
                <div
                  className={`absolute inset-[16px] rounded-full border border-red-500/80 bg-[conic-gradient(#fecaca_0deg,#fecaca_30deg,#fb923c_30deg,#fb923c_60deg,#fee2e2_60deg,#fee2e2_90deg,#f97373_90deg,#f97373_120deg,#fed7aa_120deg,#fed7aa_150deg,#fecaca_150deg,#fecaca_180deg,#fb923c_180deg,#fb923c_210deg,#fee2e2_210deg,#fee2e2_240deg,#f97373_240deg,#f97373_270deg,#fed7aa_270deg,#fed7aa_300deg,#fecaca_300deg,#fecaca_330deg,#fb923c_330deg,#fb923c_360deg)] ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                />
                <div className="absolute inset-[46px] rounded-full bg-slate-950/95" />
                <button
                  type="button"
                  onClick={handleSpin}
                  className="absolute inset-[58px] flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 via-red-400 to-amber-300 text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-[0_0_25px_rgba(248,113,113,0.9)] hover:brightness-110"
                >
                  {isSpinning ? "Крутим..." : "Крутить"}
                </button>
                {/* Стрелка */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <div className="h-5 w-3 origin-bottom rounded-b-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                </div>
              </div>
            </div>

            {/* Результат + оффер регистрации */}
            {result && (
              <div className="space-y-2 text-center text-sm">
                <div className="text-slate-100">Твой бонус: {result}</div>
                <div className="text-[12px] text-slate-400">
                  Чтобы закрепить бонус, зарегистрируй демо-аккаунт Pulz.
                </div>
                <div className="mt-2 flex justify-center gap-3">
                  <button className="rounded-full border border-slate-600/80 px-4 py-1.5 text-xs text-slate-200 hover:bg-slate-800/80">
                    Позже
                  </button>
                  <button className="rounded-full bg-red-600 px-5 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.85)] hover:bg-red-500">
                    Регистрация
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
