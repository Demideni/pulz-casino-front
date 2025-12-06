"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FortuneWheel() {
  const pathname = usePathname();

  // Скрываем весь низ на страницах игр
  const hideBottomBar =
    pathname === "/games" ||
    pathname === "/games/" ||
    pathname.startsWith("/games/");

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

  if (hideBottomBar) return null;

  return (
    <>
      {/* ===== НИЖНИЙ БАР как у JetTon ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-40 bg-[#050509]">
        <div className="relative mx-auto max-w-xl px-2 pb-2 pt-1">
          {/* Тёмная полоса с 4 секциями */}
          <div className="grid grid-cols-4 rounded-t-2xl border-t border-slate-800 bg-[#05070b] px-2 py-2 text-[11px] text-slate-200">
            {/* Касса */}
            <Link
              href="#"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-400/70">
                <div className="h-3 w-4 rounded-md bg-slate-300/90" />
              </div>
              <span>Касса</span>
            </Link>

            {/* Вход */}
            <Link
              href="#"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-400/70">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full border border-slate-200" />
                  <div className="mt-0.5 h-1.5 w-3 rounded-t-full border border-slate-200 border-t-0" />
                </div>
              </div>
              <span>Вход</span>
            </Link>

            {/* Игры */}
            <Link
              href="/games"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-lime-400/80 bg-lime-400/10">
                <div className="flex h-3 w-4 items-center justify-between">
                  <span className="h-2 w-[3px] rounded-sm bg-lime-300" />
                  <span className="h-2 w-[3px] rounded-sm bg-lime-300" />
                  <span className="h-2 w-[3px] rounded-sm bg-lime-300" />
                </div>
              </div>
              <span className="text-lime-300">Игры</span>
            </Link>

            {/* Меню */}
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-400/70">
                <div className="space-y-0.5">
                  <span className="block h-[2px] w-4 rounded-full bg-slate-100" />
                  <span className="block h-[2px] w-4 rounded-full bg-slate-100/80" />
                  <span className="block h-[2px] w-4 rounded-full bg-slate-100/60" />
                </div>
              </div>
              <span>Меню</span>
            </button>
          </div>

          {/* Центральное колесо, как Lucky Turbine */}
          <button
            type="button"
            onClick={openWheel}
            className="pointer-events-auto absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-4 flex-col items-center"
          >
            {/* подпись над колесом */}
            <span className="mb-1 text-[11px] font-semibold tracking-[0.18em] text-slate-200">
              Pulz Wheel
            </span>

            {/* само маленькое колесо */}
            <div className="relative h-14 w-14">
              {/* внешнее свечение */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(96,165,250,0.6),transparent_60%),radial-gradient(circle_at_50%_100%,rgba(248,113,113,0.7),transparent_65%)] opacity-90 blur-[2px]" />

              {/* синее кольцо */}
              <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-sky-500 via-sky-700 to-slate-900 shadow-[0_0_16px_rgba(56,189,248,0.9)]" />

              {/* вращающийся диск */}
              <div className="absolute inset-[6px] rounded-full bg-[conic-gradient(from_0deg,#e5e7eb,#f97316,#22c55e,#3b82f6,#e5e7eb)] animate-spin-slow" />

              {/* центр */}
              <div className="absolute inset-[14px] rounded-full bg-gradient-to-b from-rose-500 via-rose-600 to-rose-800 shadow-[0_0_10px_rgba(248,113,113,0.9)]" />
            </div>
          </button>
        </div>
      </nav>

      {/* ===== МОДАЛКА БОЛЬШОГО КОЛЕСА ===== */}
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
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <div className="h-5 w-3 origin-bottom rounded-b-full bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                </div>
              </div>
            </div>

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
