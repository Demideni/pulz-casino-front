"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FortuneWheel() {
  const pathname = usePathname();

  // Скрываем тап-бар на страницах игр
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

  // Если мы на странице игры — вообще ничего не рендерим
  if (hideBottomBar) {
    return null;
  }

  return (
    <>
      {/* ===== НИЖНИЙ ТАП-БАР В СТИЛЕ КАЗИНО ===== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/80 bg-[#050509]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2.5">
          {/* Касса */}
          <Link
            href="#"
            className="flex flex-col items-center text-[11px] text-slate-300"
          >
            <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950/80 shadow-[0_0_18px_rgba(15,23,42,0.9)]">
              {/* минималистичная «купюра» */}
              <div className="h-4 w-6 rounded-md border border-emerald-400/70" />
            </div>
            <span>Касса</span>
          </Link>

          {/* Вход */}
          <Link
            href="#"
            className="flex flex-col items-center text-[11px] text-slate-300"
          >
            <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950/80 shadow-[0_0_18px_rgba(15,23,42,0.9)]">
              {/* силуэт пользователя */}
              <div className="h-5 w-5 rounded-full border border-sky-400/80 border-b-transparent" />
            </div>
            <span>Вход</span>
          </Link>

          {/* Центральная кнопка Pulz Wheel */}
          <button
            type="button"
            onClick={openWheel}
            className="flex flex-col items-center text-[11px] text-red-100"
          >
            <div className="mb-1 relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-red-500 via-red-400 to-amber-300 shadow-[0_0_30px_rgba(248,113,113,0.9)]">
              <div className="absolute inset-0 rounded-full border border-red-900/70" />
              {/* стилизованная молния PULZ */}
              <div className="relative h-5 w-3 -skew-x-6 bg-gradient-to-b from-yellow-300 to-orange-500 clip-path-[polygon(50%_0%,0%_55%,35%_55%,10%_100%,100%_40%,65%_40%,90%_0%)]" />
            </div>
            <span className="font-semibold">Pulz Wheel</span>
          </button>

          {/* Игры */}
          <Link
            href="/games"
            className="flex flex-col items-center text-[11px] text-slate-300"
          >
            <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950/80 shadow-[0_0_18px_rgba(15,23,42,0.9)]">
              {/* «слот» */}
              <div className="flex h-4 w-6 items-center justify-between rounded-md border border-pink-400/80 px-1">
                <span className="h-2 w-1 rounded-sm bg-pink-400/80" />
                <span className="h-2 w-1 rounded-sm bg-amber-300/90" />
                <span className="h-2 w-1 rounded-sm bg-emerald-300/90" />
              </div>
            </div>
            <span>Игры</span>
          </Link>

          {/* Меню */}
          <button
            type="button"
            className="flex flex-col items-center text-[11px] text-slate-300"
          >
            <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-950/80 shadow-[0_0_18px_rgba(15,23,42,0.9)]">
              {/* три полоски меню */}
              <div className="space-y-0.5">
                <span className="block h-[2px] w-5 rounded-full bg-slate-200" />
                <span className="block h-[2px] w-5 rounded-full bg-slate-200/80" />
                <span className="block h-[2px] w-5 rounded-full bg-slate-200/60" />
              </div>
            </div>
            <span>Меню</span>
          </button>
        </div>
      </nav>

      {/* ===== МОДАЛКА С БОЛЬШИМ КОЛЕСОМ ===== */}
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
