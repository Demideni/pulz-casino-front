"use client";

import { useState } from "react";

const PRIZES = [
  "+10 FS",
  "+20 FS",
  "+50% к депозиту",
  "Cashback 5%",
  "Без выигрыша",
  "+100% к депозиту",
  "+5 FS",
  "Сюрприз-бонус",
];

export default function FortuneWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function openWheel() {
    setIsOpen(true);
    setResult(null);
  }

  function closeWheel() {
    setIsOpen(false);
    setIsSpinning(false);
  }

  function handleSpin() {
    if (isSpinning) return;
    setIsSpinning(true);

    setTimeout(() => {
      const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
      setResult(prize);
      setIsSpinning(false);
    }, 2600);
  }

  return (
    <>
      {/* НИЖНИЙ ТАП-БАР С БОЛЬШИМ КОЛЕСОМ */}
      <div className="fixed inset-x-0 bottom-0 z-40">
        <div className="relative mx-auto max-w-md px-4 pb-3">
          {/* САМО КОЛЕСО — БОЛЬШЕ И НИЖЕ */}
          <button
            type="button"
            onClick={openWheel}
            className="absolute left-1/2 bottom-1 z-10 -translate-x-1/2 flex flex-col items-center"
          >
            <div className="relative h-24 w-24">
              {/* мягкое свечение */}
              <div className="absolute inset-0 rounded-full bg-red-500/40 blur-xl" />
              {/* картинка колеса */}
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-red-500/70 bg-black">
                <img
                  src="/Pulz-wheel.png"
                  alt="Pulz Wheel"
                  className={`h-full w-full object-cover ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                />
              </div>
            </div>
            <span className="mt-1 text-[11px] font-medium tracking-[0.16em] text-slate-100">
              PULZ WHEEL
            </span>
          </button>

          {/* СЕРЫЙ ТАП-БАР, КОТОРЫЙ ИДЁТ ПОВЕРХ ВЕРХА КОЛЕСА */}
          <div className="relative z-20 flex h-14 items-center justify-between rounded-t-3xl border-t border-slate-700 bg-[#15171f]/95 px-5 text-[11px] text-slate-100">
            {/* Касса */}
            <button
              type="button"
              className="flex flex-1 flex-col items-center gap-1 pr-3 border-r border-slate-700/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-600 bg-slate-900/40">
                💰
              </span>
              <span className="text-[11px] text-slate-200">Касса</span>
            </button>

            {/* Вход */}
            <button
              type="button"
              className="flex flex-1 flex-col items-center gap-1 px-3 border-r border-slate-700/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-600 bg-slate-900/40">
                👤
              </span>
              <span className="text-[11px] text-slate-200">Вход</span>
            </button>

            {/* Пустое место под колесо (бар как бы огибает центр) */}
            <div className="flex-[1.2]" />

            {/* Игры */}
            <button
              type="button"
              className="flex flex-1 flex-col items-center gap-1 px-3 border-l border-slate-700/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-600 bg-slate-900/40">
                🎰
              </span>
              <span className="text-[11px] text-slate-200">Игры</span>
            </button>

            {/* Меню */}
            <button
              type="button"
              className="flex flex-1 flex-col items-center gap-1 pl-3 border-l border-slate-700/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-600 bg-slate-900/40">
                ☰
              </span>
              <span className="text-[11px] text-slate-200">Меню</span>
            </button>
          </div>
        </div>
      </div>

      {/* МОДАЛКА С БОЛЬШИМ КОЛЕСОМ (ТВОЙ СТАРЫЙ КОД, Я ЕГО НЕ МЕНЯЛ) */}
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

            {/* Само колесо в модалке */}
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
