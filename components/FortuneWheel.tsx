"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function FortuneWheel() {
  const pathname = usePathname();

  // ❗ Скрываем нижний бар ТОЛЬКО на страницах игр
  const hideBottomBar =
    pathname === "/games" ||
    pathname === "/games/" ||
    pathname.startsWith("/games/");

  if (hideBottomBar) return null;

  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const openWheel = () => setIsOpen(true);

  const closeWheel = () => {
    setIsOpen(false);
    setIsSpinning(false);
    setResult(null);
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    setTimeout(() => {
      const prizes = ["+5%", "+10%", "+15%", "+20%", "x2", "x3"];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];

      setResult(prize);
      setIsSpinning(false);
    }, 2500);
  };

  return (
    <>
      {/* 🔻 Твой нижний тап-бар (кнопки Касса / Вход / Wheel / Игры / Меню) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-slate-800 bg-[#050509]/95 py-3 backdrop-blur-xl">
        <button className="text-slate-300">Касса</button>
        <button className="text-slate-300">Вход</button>

        <button
          onClick={openWheel}
          className="rounded-full bg-red-600 px-4 py-1.5 text-white shadow-[0_0_15px_rgba(255,0,0,0.7)]"
        >
          Pulz Wheel
        </button>

        <button className="text-slate-300">Игры</button>
        <button className="text-slate-300">Меню</button>
      </div>

      {/* 🔻 Модалка колеса */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-red-900/70 bg-gradient-to-b from-[#12020a] via-black to-[#050509] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  Pulz Wheel
                </div>
                <div className="text-[11px] text-slate-400">
                  Первый спин — бесплатно!
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

            {/* Колесо */}
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

            {/* Результат */}
            {result && (
              <div className="space-y-2 text-center text-sm">
                <div className="text-slate-100">Твой бонус: {result}</div>
                <div className="text-[12px] text-slate-400">
                  Чтобы активировать бонус, зарегистрируйся.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
