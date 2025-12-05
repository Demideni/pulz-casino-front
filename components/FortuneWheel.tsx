"use client";

import { useState } from "react";

type Prize = {
  label: string;
  amount: string;
};

const PRIZES: Prize[] = [
  { label: "5$", amount: "5 USD" },
  { label: "10$", amount: "10 USD" },
  { label: "15$", amount: "15 USD" },
  { label: "20$", amount: "20 USD" },
  { label: "25$", amount: "25 USD" },
  { label: "30$", amount: "30 USD" },
];

export default function FortuneWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const index = Math.floor(Math.random() * PRIZES.length);

    // имитация вращения
    setTimeout(() => {
      setIsSpinning(false);
      setResult(PRIZES[index]);
    }, 2800);
  };

  return (
    <>
      {/* Кнопка снизу всех страниц */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-5 md:pb-6">
        <button
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#050509]/95 px-4 py-2 text-xs font-semibold text-slate-100 shadow-[0_0_25px_rgba(0,0,0,0.9)] ring-1 ring-lime-400/60 hover:bg-black/90 hover:ring-lime-300/80"
          onClick={() => setIsOpen(true)}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lime-400 text-[11px] font-bold text-black">
            🎡
          </span>
          <span className="flex flex-col text-left leading-tight">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-300">
              Lucky Turbine
            </span>
            <span className="text-[11px] text-slate-200">
              Крути колесо фортуны
            </span>
          </span>
        </button>
      </div>

      {/* Модалка с колесом */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-3 pb-6 md:items-center md:px-4">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-950 via-black to-slate-950 p-4 shadow-[0_0_50px_rgba(0,0,0,0.9)] ring-1 ring-slate-800/80">
            {/* Хедер */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-[0.18em] text-lime-400">
                  Колесо фортуны
                </span>
                <span className="text-sm text-slate-200">
                  Разыгрываем бонусы Pulz
                </span>
              </div>
              <button
                className="rounded-full bg-slate-900 px-2 py-1 text-[11px] text-slate-400 hover:bg-slate-800"
                onClick={() => {
                  setIsOpen(false);
                  setIsSpinning(false);
                  setResult(null);
                }}
              >
                Закрыть
              </button>
            </div>

            {/* Само колесо */}
            <div className="relative mb-4 flex flex-col items-center">
              <div className="relative flex h-44 w-44 items-center justify-center">
                {/* подсветка */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(190,242,100,0.30),transparent_65%)] blur-xl" />

                {/* колесо */}
                <div
                  className={`relative flex h-40 w-40 items-center justify-center rounded-full border border-lime-300/40 bg-[conic-gradient(from_180deg,_#4ade80,_#a3e635,_#22c55e,_#4ade80)] shadow-[0_0_35px_rgba(190,242,100,0.5)] ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                >
                  {/* центр */}
                  <div className="flex h-18 w-18 flex-col items-center justify-center rounded-full bg-slate-950/95 px-3 py-2 text-center text-[11px] text-slate-100">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Pulz
                    </span>
                    <span className="text-xs font-semibold">
                      Lucky Turbine
                    </span>
                    <span className="text-[10px] text-slate-400">
                      нажми чтобы крутить
                    </span>
                  </div>
                </div>

                {/* стрелка */}
                <div className="absolute -top-2 flex h-7 w-7 items-center justify-center">
                  <div className="h-7 w-[2px] rounded-full bg-lime-300" />
                </div>
              </div>

              {/* кнопка крутить */}
              <button
                className="mt-3 w-full rounded-full bg-lime-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_30px_rgba(190,242,100,0.7)] hover:bg-lime-300 disabled:cursor-not-allowed disabled:bg-lime-500/60"
                onClick={handleSpin}
                disabled={isSpinning}
              >
                {isSpinning ? "Крутим..." : "Крутить колесо"}
              </button>

              {/* результат */}
              <div className="mt-3 min-h-[28px] text-center text-xs text-slate-200">
                {result && !isSpinning && (
                  <span>
                    Тебе выпало{" "}
                    <span className="font-semibold text-lime-300">
                      {result.amount}
                    </span>
                    . Можно будет привязать к реальному бонусу.
                  </span>
                )}
                {!result && !isSpinning && (
                  <span className="text-slate-400">
                    Первый спин бесплатный. Для следующих можно привязать
                    регистрацию / депозит.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
