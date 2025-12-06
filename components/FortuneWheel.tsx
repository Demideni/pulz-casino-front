"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FortuneWheel() {
  const pathname = usePathname();

  // На страницах игры убираем весь низ
  const hideBottomBar = pathname.startsWith("/games");

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
      setResult(prizes[Math.floor(Math.random() * prizes.length)]);
      setIsSpinning(false);
    }, 2500);
  };

  if (hideBottomBar) return null;

  return (
    <>
      {/* НИЖНИЙ БАР в стиле JetTon */}
      <nav className="fixed inset-x-0 bottom-0 z-40 bg-black">
        <div className="mx-auto max-w-xl px-0">
          <div className="relative h-[64px] border-t border-slate-800 bg-[#05070b]">
            {/* 4 секции */}
            <div className="grid h-full grid-cols-4 text-[11px] text-slate-200">
              {/* Cashier */}
              <button className="flex flex-col items-center justify-center gap-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-500/70">
                  <div className="h-3 w-4 rounded-md border border-slate-200" />
                </div>
                <span>Касса</span>
              </button>

              {/* Sports */}
              <button className="flex flex-col items-center justify-center gap-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-500/70">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-200">
                    <div className="h-2 w-2 rounded-full border border-slate-200" />
                  </div>
                </div>
                <span>Вход</span>
              </button>

              {/* Casino (активный, подсвечен как у JetTon) */}
              <Link
                href="/games"
                className="flex flex-col items-center justify-center gap-1"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-lime-400 bg-lime-400/10">
                  <div className="flex h-4 w-3 flex-col justify-between">
                    <span className="h-[3px] w-full rounded-sm bg-lime-300" />
                    <span className="h-[3px] w-full rounded-sm bg-lime-300" />
                    <span className="h-[3px] w-full rounded-sm bg-lime-300" />
                  </div>
                </div>
                <span className="text-lime-300">Казино</span>
              </Link>

              {/* Menu */}
              <button className="flex flex-col items-center justify-center gap-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-500/70">
                  <div className="space-y-0.5">
                    <span className="block h-[2px] w-4 rounded-full bg-slate-200" />
                    <span className="block h-[2px] w-4 rounded-full bg-slate-200/80" />
                    <span className="block h-[2px] w-4 rounded-full bg-slate-200/60" />
                  </div>
                </div>
                <span>Меню</span>
              </button>
            </div>

            {/* Центральное колесо, “выпрыгивающее” из бара */}
            <button
              type="button"
              onClick={openWheel}
              className="pointer-events-auto absolute left-1/2 -top-7 flex -translate-x-1/2 flex-col items-center"
            >
              <span className="mb-1 text-[11px] font-semibold tracking-[0.16em] text-sky-200">
                Pulz Wheel
              </span>

              <div className="relative h-[76px] w-[76px]">
                {/* свечение вокруг */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.8),transparent_65%),radial-gradient(circle_at_50%_100%,rgba(248,113,113,0.9),transparent_65%)] opacity-90 blur-[2px]" />
                {/* синее кольцо */}
                <div className="absolute inset-[3px] rounded-full bg-gradient-to-b from-sky-500 via-sky-700 to-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.9)]" />
                {/* диск */}
                <div
                  className={`absolute inset-[9px] rounded-full bg-[conic-gradient(from_0deg,#e5e7eb,#f97316,#22c55e,#3b82f6,#e5e7eb)] ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                />
                {/* центр */}
                <div className="absolute inset-[22px] rounded-full bg-gradient-to-b from-rose-400 via-rose-500 to-rose-700 shadow-[0_0_12px_rgba(248,113,113,0.9)]" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Модалка большого колеса (оставили твою логику) */}
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
