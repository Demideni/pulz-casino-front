"use client";

import { useState } from "react";
import Link from "next/link";

type Bonus = {
  label: string;
  value: string;
  description: string;
};

const BONUSES: Bonus[] = [
  { label: "+10%", value: "10%", description: "Бонус на первый депозит" },
  { label: "20 FS", value: "20 фриспинов", description: "Фриспины на слот Pulz Originals" },
  { label: "+25%", value: "25%", description: "Повышенный кэшбек" },
  { label: "50 FS", value: "50 фриспинов", description: "Большой пак фриспинов" },
  { label: "MYSTERY", value: "Секретный бонус", description: "Персональное предложение после регистрации" },
];

/* ========= ИКОНКИ ========= */

function MoneyBagIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-6 w-6">
      <defs>
        <linearGradient id="bagGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <path d="M15 8c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3l-1.5 3h-7L15 8z" fill="#111827" />
      <path
        d="M12 18c0-4.4 3.1-8 8-8s8 3.6 8 8v5c0 4.4-3.1 8-8 8s-8-3.6-8-8v-5z"
        fill="url(#bagGold)"
        stroke="#7c2d12"
        strokeWidth="1"
      />
      <path
        d="M20 17c-2 0-3.5 1.2-3.5 3 0 1.5 1 2.5 2.6 2.8l-.7 2.2h2.1l.7-2.1c1.6-.2 2.8-1.3 2.8-2.9 0-1.9-1.6-3-3.5-3zm0 1.5c1.1 0 1.9.6 1.9 1.5s-.8 1.4-1.9 1.4-1.9-.5-1.9-1.4.8-1.5 1.9-1.5z"
        fill="#111827"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-6 w-6">
      <defs>
        <linearGradient id="userBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="14" r="5" fill="url(#userBlue)" />
      <path
        d="M12 27c1.5-3.3 4.1-5 8-5s6.5 1.7 8 5c.3.7-.1 1.5-.9 1.5H12.9c-.8 0-1.2-.8-.9-1.5z"
        fill="#020617"
        opacity="0.9"
      />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-6 w-6 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
      <defs>
        <linearGradient id="bolt" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path
        d="M22 4 11 22h6l-1 14 13-18h-6l1-14z"
        fill="url(#bolt)"
        stroke="#7c2d12"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlotIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-6 w-6">
      <defs>
        <linearGradient id="slotBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
        <linearGradient id="slotTop" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <rect
        x="9"
        y="13"
        width="22"
        height="16"
        rx="3"
        fill="url(#slotBody)"
        stroke="#4b5563"
        strokeWidth="1"
      />
      <rect x="11" y="15" width="18" height="8" rx="1.5" fill="#020617" />
      <rect x="9" y="10" width="22" height="5" rx="2.5" fill="url(#slotTop)" />
      <circle cx="17" cy="19" r="1.2" fill="#fbbf24" />
      <circle cx="20" cy="19" r="1.2" fill="#fbbf24" />
      <circle cx="23" cy="19" r="1.2" fill="#fbbf24" />
      <path
        d="M29 13.5c0-1.9 1.1-3 2.5-3S34 11.6 34 13.5c0 1.1-.4 1.9-1 2.4"
        fill="none"
        stroke="#facc15"
        strokeWidth="1.2"
      />
      <circle cx="33" cy="16.3" r="1.4" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-6 w-6">
      <rect x="11" y="13" width="18" height="2.4" rx="1.2" fill="#f9fafb" />
      <rect x="11" y="19" width="18" height="2.4" rx="1.2" fill="#e5e7eb" />
      <rect x="11" y="25" width="12" height="2.4" rx="1.2" fill="#9ca3af" />
    </svg>
  );
}

/* ========= КРУГЛАЯ КНОПКА ========= */

type CircleButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  important?: boolean;
  children: React.ReactNode;
};

function CircleButton({ label, href, onClick, important, children }: CircleButtonProps) {
  const outerClasses = [
    "relative flex h-14 w-14 items-center justify-center rounded-full",
    "bg-gradient-to-b from-[#050816] via-black to-[#050816]",
    "border border-red-500/40",
    "shadow-[0_0_22px_rgba(248,113,113,0.35)]",
    "transition-transform duration-150 group-active:scale-95",
    "overflow-hidden",
    important ? "ring-2 ring-red-500/80" : "ring-1 ring-slate-900/70",
  ]
    .filter(Boolean)
    .join(" ");

  const innerGlow =
    "pointer-events-none absolute -inset-2 rounded-full bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.55),transparent_60%)] opacity-70";

  const innerCircle =
    "relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-b from-[#111827] via-black to-[#020617]";

  const content = (
    <span className={outerClasses}>
      <span className={innerGlow} />
      <span className={innerCircle}>{children}</span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label}
        className="group inline-flex items-center justify-center"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group inline-flex items-center justify-center"
    >
      {content}
    </button>
  );
}

/* ========= ГЛАВНЫЙ КОМПОНЕНТ ========= */

export default function FortuneWheel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bonus, setBonus] = useState<Bonus | null>(null);
  const [showLightning, setShowLightning] = useState(false);

  const handleOpenWheel = () => {
    setIsModalOpen(true);
    setBonus(null);
    setShowLightning(true);
    setTimeout(() => setShowLightning(false), 500);
  };

  const handleCloseWheel = () => {
    setIsModalOpen(false);
    setIsSpinning(false);
    setBonus(null);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setBonus(null);
    setShowLightning(true);

    setTimeout(() => {
      const random = BONUSES[Math.floor(Math.random() * BONUSES.length)];
      setBonus(random);
      setIsSpinning(false);
      setTimeout(() => setShowLightning(false), 400);
    }, 2600);
  };

  return (
    <>
      {/* Нижний бар */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center pb-4">
        <div className="pointer-events-auto mx-auto flex max-w-lg flex-1 items-center justify-between gap-4 rounded-full border border-red-900/40 bg-black/80 px-5 py-3 shadow-[0_-8px_35px_rgba(0,0,0,0.9)]">
          <CircleButton label="Касса" href="/cashier">
            <MoneyBagIcon />
          </CircleButton>

          <CircleButton label="Вход" href="/">
            <UserIcon />
          </CircleButton>

          <CircleButton label="PULZ WHEEL" important onClick={handleOpenWheel}>
            <LightningIcon />
          </CircleButton>

          <CircleButton label="Игры" href="/games">
            <SlotIcon />
          </CircleButton>

          <CircleButton label="Меню" href="/about">
            <MenuIcon />
          </CircleButton>
        </div>
      </div>

      {/* Модалка колеса */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(248,113,113,0.25),transparent_65%)]" />
          {showLightning && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-10 top-0 h-1/2 w-1/2 rotate-12 bg-[radial-gradient(circle_at_center,_rgba(248,250,252,0.9),transparent_70%)] opacity-40 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-1/2 w-1/2 -rotate-6 bg-[radial-gradient(circle_at_center,_rgba(252,211,77,0.9),transparent_70%)] opacity-40 blur-3xl" />
            </div>
          )}

          <div className="relative mx-4 w-full max-w-md rounded-3xl border border-red-900/60 bg-gradient-to-b from-[#05040a] via-[#150410] to-[#020106] p-5 shadow-[0_0_55px_rgba(248,113,113,0.7)]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                  Pulz Wheel
                </div>
                <div className="text-sm text-slate-300">Первый спин — бесплатно</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative h-56 w-56">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#facc15] via-[#f97316] to-[#b91c1c] shadow-[0_0_45px_rgba(248,113,113,0.8)]" />
                <div className="absolute inset-2 rounded-full border-[3px] border-[#3b0b10] bg-[#0b0408]" />
                <div
                  className={`absolute inset-4 rounded-full bg-conic-gradient from-[#fecaca] via-[#f97316] to-[#fecaca] ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                />
                <div className="absolute inset-12 flex items-center justify-center rounded-full border border-amber-500/60 bg-gradient-to-b from-[#ffe8a3] via-[#ffb74d] to-[#f97316]">
                  <button
                    type="button"
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="h-16 w-16 rounded-full bg-gradient-to-b from-[#fef3c7] via-[#facc15] to-[#ea580c] text-xs font-semibold uppercase tracking-[0.12em] text-[#450a0a] shadow-[0_0_25px_rgba(251,191,36,0.9)] disabled:opacity-70"
                  >
                    {isSpinning ? "КРУТИМ..." : "SPIN"}
                  </button>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="h-7 w-6 -translate-y-1 rounded-b-full bg-gradient-to-b from-[#fef3c7] via-[#facc15] to-[#b45309] shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                </div>
              </div>

              <div className="w-full rounded-2xl border border-slate-800/80 bg-black/60 px-4 py-3 text-xs text-slate-200">
                {bonus ? (
                  <>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-red-400">
                      Ваш бонус
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-50">{bonus.value}</div>
                    <div className="mt-1 text-[13px] text-slate-400">{bonus.description}</div>
                    <div className="mt-3 text-[11px] text-slate-500">
                      Забрать бонус можно после регистрации. Мы сохраним результат этого спина.
                    </div>
                  </>
                ) : (
                  <div className="text-[13px] text-slate-400">
                    Нажми <span className="font-semibold text-slate-100">SPIN</span>, чтобы
                    получить демо-бонус Pulz Wheel. Реальные бонусы будут доступны после запуска
                    платформы.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCloseWheel}
                className="mt-1 rounded-full border border-slate-700/70 bg-black/60 px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
