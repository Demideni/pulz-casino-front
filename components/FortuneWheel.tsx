"use client";

import { useState } from "react";
import Image from "next/image";

export default function FortuneWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const openWheel = () => {
    setIsOpen(true);
    setResult(null);
  };

  const closeWheel = () => {
    setIsOpen(false);
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    setTimeout(() => {
      const rewards = ["+10% Bonus", "+20% FS", "+5$ Cashback"];
      const r = rewards[Math.floor(Math.random() * rewards.length)];

      setResult(r);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <>
      {/* Центральная кнопка в тап-баре */}
      <button
        type="button"
        onClick={openWheel}
        className="relative -top-6 z-20 flex flex-col items-center"
      >
        <span className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-sky-200 drop-shadow">
          Pulz Wheel
        </span>

        {/* Контейнер с PNG-колесом */}
        <div className="relative h-[82px] w-[82px]">
          {/* Свечение */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,80,80,0.65),transparent_60%)] blur-[3px]" />

          {/* PNG колесо */}
          <Image
            src="/Pulz-wheel.png"
            alt="Pulz Wheel"
            fill
            className={`object-contain drop-shadow-lg ${
              isSpinning ? "animate-spin-slow" : ""
            }`}
            priority
          />
        </div>
      </button>

      {/* Модалка */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-red-900/70 bg-gradient-to-b from-[#12020a] via-black to-[#050509] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Pulz Wheel
                </div>
                <div className="text-[11px] text-slate-400">
                  Первый спин — бесплатно.
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

            {/* Большое колесо */}
            <div className="mb-4 flex flex-col items-center">
              <div className="relative h-52 w-52">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(248,113,113,0.6),transparent_60%)] opacity-80 blur-sm" />
                <div className="absolute inset-[10px] rounded-full bg-black/90 ring-2 ring-red-600/80" />

                <Image
                  src="/Pulz-wheel.png"
                  alt="Pulz Wheel"
                  fill
                  className={`object-contain ${isSpinning ? "animate-spin-slow" : ""}`}
                />

                {/* Стрелка */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="h-6 w-4 origin-bottom rounded-b-full bg-amber-300 shadow-[0_0_10px_rgba(255,200,50,0.9)]" />
                </div>
              </div>

              {/* Кнопка "крутить" */}
              <button
                type="button"
                onClick={handleSpin}
                className="mt-4 rounded-full bg-red-600 px-6 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.85)] hover:bg-red-500"
              >
                {isSpinning ? "Крутим..." : "Крутить"}
              </button>
            </div>

            {/* Результат */}
            {result && (
              <div className="mt-4 text-center text-sm text-slate-100">
                Твой бонус: {result}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
