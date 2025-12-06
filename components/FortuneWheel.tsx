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
      const rewards = ["+10% bonus", "+20 FS", "+5$ cashback"];
      const r = rewards[Math.floor(Math.random() * rewards.length)];
      setResult(r);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <>
      {/* Кнопка в центре тап-бара */}
      <button
        type="button"
        onClick={openWheel}
        className="relative -top-4 flex flex-col items-center"
      >
        {/* Надпись над колесом */}
        <span className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-sky-200">
          Pulz Wheel
        </span>

        {/* Контейнер с PNG-колесом */}
        <div className="relative h-[70px] w-[70px]">
          {/* Свечение */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,80,80,0.7),transparent_60%)] blur-[4px]" />

          {/* PNG-кнопка */}
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

            <div className="mb-4 flex flex-col items-center">
              <div className="relative h-52 w-52">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(248,113,113,0.6),transparent_60%)] opacity-80 blur-sm" />
                <div className="absolute inset-[10px] rounded-full bg-black/90 ring-2 ring-red-600/80" />

                <Image
                  src="/Pulz-wheel.png"
                  alt="Pulz Wheel"
                  fill
                  className={`object-contain ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                />

                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="h-6 w-4 origin-bottom rounded-b-full bg-amber-300 shadow-[0_0_10px_rgba(255,200,50,0.9)]" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSpin}
                className="mt-4 rounded-full bg-red-600 px-6 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.85)] hover:bg-red-500"
              >
                {isSpinning ? "Крутим..." : "Крутить"}
              </button>
            </div>

            {result && (
              <div className="mt-2 text-center text-sm text-slate-100">
                Твой бонус: {result}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
