"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, User, Dice5, Menu as MenuIcon } from "lucide-react";

type NavItemProps = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  accent?: boolean;
};

const PRIZES = [
  "10 фриспинов на Pulz Originals",
  "Бонус +25% к первому депозиту",
  "Кэшбэк 10% на проигрыш за день",
  "5$ демо-кредит",
  "Ничего. Повезёт в следующий раз 🙂",
];

export default function FortuneWheel() {
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setResult(prize);
    }, 2200);
  };

  return (
    <>
      {/* Модалка с полноценным Pulz Wheel */}
      {isWheelOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#050509] via-[#090313] to-black p-6 text-slate-100 shadow-[0_0_60px_rgba(0,0,0,0.9)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-[0.2em] text-red-400">
                  PULZ WHEEL
                </div>
                <div className="text-sm text-slate-300">
                  Первый спин — бесплатно
                </div>
              </div>
              <button
                onClick={() => setIsWheelOpen(false)}
                className="rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-300 hover:border-slate-500 hover:text-slate-100"
              >
                Закрыть
              </button>
            </div>

            {/* Само колесо */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative h-48 w-48">
                {/* Сияние вокруг */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(248,113,113,0.3),transparent_65%)] blur-md" />

                {/* Диск колеса */}
                <div
                  className={[
                    "relative flex h-full w-full items-center justify-center rounded-full",
                    "bg-[conic-gradient(from_210deg,_#f97373_0deg,_#facc15_90deg,_#22c55e_150deg,_#38bdf8_210deg,_#a855f7_270deg,_#f97373_330deg,_#f97373_360deg)]",
                    "border-[6px] border-[#f59e0b] shadow-[0_0_35px_rgba(249,115,22,0.7)]",
                    isSpinning ? "animate-spin-slow" : "",
                  ].join(" ")}
                >
                  {/* Центральная кнопка */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#fee2e2] via-[#fecaca] to-[#f97373] shadow-[0_0_25px_rgba(248,113,113,0.8)]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#ef4444] to-[#b91c1c] text-xs font-semibold uppercase tracking-wide text-white">
                      {isSpinning ? "КРУТИМ..." : "SPIN"}
                    </div>
                  </div>
                </div>

                {/* Индикатор-стрелка сверху */}
                <div className="pointer-events-none absolute -top-3 left-1/2 h-6 w-4 -translate-x-1/2">
                  <div className="h-full w-full origin-bottom rounded-b-full bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-700 shadow-[0_0_16px_rgba(250,204,21,0.9)]" />
                </div>
              </div>

              <button
                onClick={spin}
                disabled={isSpinning}
                className="mt-2 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-[0_0_22px_rgba(248,113,113,0.7)] hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSpinning ? "Крутим..." : "Крутить колесо"}
              </button>

              {result && (
                <div className="mt-2 rounded-2xl border border-slate-700/70 bg-black/40 px-4 py-3 text-center text-sm text-slate-100">
                  <div className="text-xs uppercase tracking-[0.16em] text-red-400">
                    ВАШ БОНУС
                  </div>
                  <div className="mt-1 text-sm">{result}</div>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Зарегистрируйтесь, чтобы закрепить бонус за аккаунтом.
                  </div>
                  <div className="mt-3 flex justify-center gap-2">
                    <Link
                      href="/register"
                      className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Регистрация
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-full border border-slate-600 px-4 py-1.5 text-xs text-slate-200 hover:border-slate-400"
                    >
                      Войти
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Нижний таб-бар а-ля JetTon */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto flex max-w-6xl justify-center px-4 pb-4">
          <div className="relative w-full rounded-3xl border border-slate-800/80 bg-black/90 shadow-[0_-10px_40px_rgba(0,0,0,0.9)] backdrop-blur pointer-events-auto">
            {/* Центральное колесо, которое торчит сверху и крутится */}
            <button
              type="button"
              onClick={() => setIsWheelOpen(true)}
              className="group absolute left-1/2 -top-8 flex -translate-x-1/2 flex-col items-center"
            >
              <div className="relative h-16 w-16">
                {/* свечение */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(248,113,113,0.5),transparent_60%)] blur-md" />
                {/* обод */}
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-b from-[#1f2937] via-black to-[#020617] border border-red-500/60 shadow-[0_0_26px_rgba(248,113,113,0.9)]">
                  {/* маленькое постоянно вращающееся колесо */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[conic-gradient(from_210deg,_#f97373,_#facc15,_#22c55e,_#38bdf8,_#a855f7,_#f97373)] animate-spin-slow">
                    <div className="h-5 w-5 rounded-full bg-black/80" />
                  </div>
                </div>
              </div>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                Pulz Wheel
              </span>
            </button>

            {/* Ряд кнопок, как на скрине */}
            <div className="grid grid-cols-4 gap-0 px-3 py-3 text-[11px]">
              <NavItem
                label="Касса"
                icon={<Wallet className="h-4 w-4" />}
                href="/cashier"
              />
              <NavItem
                label="Вход"
                icon={<User className="h-4 w-4" />}
                href="/login"
              />
              <NavItem
                label="Игры"
                icon={<Dice5 className="h-4 w-4" />}
                href="/games"
                accent
              />
              <NavItem
                label="Меню"
                icon={<MenuIcon className="h-4 w-4" />}
                href="/status"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NavItem({ label, icon, href, onClick, accent }: NavItemProps) {
  const content = (
    <div
      className={[
        "flex h-12 flex-col items-center justify-center rounded-2xl border border-transparent",
        "transition-colors",
        accent
          ? "text-red-400"
          : "text-slate-300 hover:text-slate-50 hover:bg-slate-900/60",
      ].join(" ")}
    >
      <div
        className={[
          "mb-1 flex h-6 w-6 items-center justify-center rounded-xl border",
          accent
            ? "border-red-500/80 bg-red-500/10 text-red-300"
            : "border-slate-600/70 bg-slate-900/60 text-slate-200",
        ].join(" ")}
      >
        {icon}
      </div>
      <span className="text-[11px] leading-none">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center justify-center">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center"
    >
      {content}
    </button>
  );
}
