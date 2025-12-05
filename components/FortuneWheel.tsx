"use client";

import { useState } from "react";

type Bonus = {
  label: string;
  description: string;
};

const BONUSES: Bonus[] = [
  { label: "+25 FS", description: "25 фриспинов на слоты Pulz Originals" },
  { label: "+50 FS", description: "50 фриспинов на премиум-слоты" },
  { label: "10% CASHBACK", description: "Кэшбек на первые депозиты" },
  { label: "PULZ BOOST", description: "Повышенный RTP на 1 час" },
  { label: "MYSTERY BOX", description: "Секретный бонус после регистрации" },
];

export default function FortuneWheel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [bonus, setBonus] = useState<Bonus | null>(null);

  const handleOpenWheel = () => {
    setIsModalOpen(true);
    setBonus(null);
    setIsSpinning(false);
  };

  const handleClose = () => {
    if (isSpinning) return;
    setIsModalOpen(false);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setBonus(null);

    const randomBonus = BONUSES[Math.floor(Math.random() * BONUSES.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setBonus(randomBonus);
    }, 2600);
  };

  return (
    <>
      {/* Нижний бар */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-4">
        <div className="pointer-events-auto mx-auto flex w-full max-w-md items-center justify-between rounded-full bg-black/70 px-5 py-3 shadow-[0_-8px_45px_rgba(0,0,0,0.9)] backdrop-blur">
          {/* Касса */}
          <CircleButton label="Касса" onClick={() => {}}>
            <MoneyBagIcon />
          </CircleButton>

          {/* Вход / аккаунт */}
          <CircleButton label="Вход" onClick={() => {}}>
            <UserIcon />
          </CircleButton>

          {/* Центральная кнопка Pulz Wheel */}
          <CircleButton
            label="PULZ WHEEL"
            important
            onClick={handleOpenWheel}
          >
            <LightningIcon />
          </CircleButton>

          {/* Игры */}
          <CircleButton label="Игры" onClick={() => {}}>
            <SlotIcon />
          </CircleButton>

          {/* Меню */}
          <CircleButton label="Меню" onClick={() => {}}>
            <MenuIcon />
          </CircleButton>
        </div>
      </div>

      {/* Модалка PULZ WHEEL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-red-500/40 bg-gradient-to-b from-[#0a0206] via-black to-[#050509] p-5 shadow-[0_0_55px_rgba(248,113,113,0.65)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs text-slate-300 hover:bg-black/80"
              onClick={handleClose}
            >
              Закрыть
            </button>

            <div className="mb-4 text-center text-[11px] uppercase tracking-[0.25em] text-red-400">
              PULZ WHEEL • ПЕРВЫЙ СПИН — БЕСПЛАТНО
            </div>

            {/* Само колесо */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-56 w-56">
                {/* Подсветка */}
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.65),transparent_60%)] blur-xl" />

                {/* Диск */}
                <div
                  className={`relative flex h-full w-full items-center justify-center rounded-full border border-amber-200/60 bg-[conic-gradient(from_180deg,rgba(248,113,113,1)_0deg,rgba(251,191,36,1)_60deg,rgba(248,113,113,1)_120deg,rgba(251,191,36,1)_180deg,rgba(248,113,113,1)_240deg,rgba(251,191,36,1)_300deg,rgba(248,113,113,1)_360deg)] shadow-[0_0_35px_rgba(251,191,36,0.85)] ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                >
                  {/* Внутренний круг */}
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-b from-[#ffb347] via-[#ff4b6a] to-[#7c1b32] shadow-[0_0_30px_rgba(0,0,0,0.85)] border border-amber-100/70">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-900">
                      PULZ
                      <br />
                      WHEEL
                    </span>
                  </div>
                </div>

                {/* Стрелка-указатель */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="h-6 w-8 rounded-b-full bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_3px_10px_rgba(0,0,0,0.7)]" />
                </div>
              </div>

              {/* Кнопка «Крутить» */}
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_0_25px_rgba(248,113,113,0.8)] hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-800/70"
              >
                {isSpinning ? "КРУТИМ..." : "КРУТИТЬ"}
              </button>

              {/* Результат */}
              {bonus && !isSpinning && (
                <div className="mt-2 w-full rounded-2xl border border-slate-700/70 bg-black/60 p-3 text-center text-xs text-slate-100">
                  <div className="text-sm font-semibold text-amber-300">
                    Ваш бонус: {bonus.label}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {bonus.description}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Зарегистрируйтесь, чтобы закрепить бонус за своим аккаунтом.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---------- */

type CircleButtonProps = {
  label: string;
  important?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function CircleButton({ label, important, onClick, children }: CircleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-[10px] text-slate-300"
    >
      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-gradient-to-b from-[#ffb347] via-[#ff4b6a] to-[#7c1b32] shadow-[0_0_25px_rgba(248,113,113,0.75)] ${
          important ? "border-amber-300/80" : "border-red-500/60"
        }`}
      >
        {/* ореол */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.7),transparent_65%)] blur-[3px] opacity-80" />
        <div className="relative">{children}</div>
      </div>
      <span className="text-[9px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </span>
    </button>
  );
}

/* ---------- SVG-«ПРЕМИУМ» ИКОНКИ ---------- */

function MoneyBagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-amber-100">
      <defs>
        <linearGradient id="money-bag" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <path
        fill="url(#money-bag)"
        d="M9 3h6l-1.2 2.4c1.7.6 3.2 2.4 3.2 4.3 0 0 0 0.3-.1 0.7 1.2.6 2.1 1.9 2.1 3.4 0 2.3-2 4.2-4.5 4.2h-5c-2.5 0-4.5-1.9-4.5-4.2 0-1.5.9-2.8 2.1-3.4C7 9.7 7 9.4 7 9.3c0-1.9 1.5-3.7 3.2-4.3L9 3z"
      />
      <path
        d="M11 11.5c0-.6.4-1 1-1 .4 0 .8.2.9.6.1.3.5.5.9.4.4-.1.7-.4.6-.8-.2-.9-.9-1.6-1.9-1.8V8h-1v.9c-1.1.2-1.9 1.1-1.9 2.2 0 1.2 1 2.1 2.2 2.1.5 0 .9.3.9.8 0 .4-.3.8-.9.8-.5 0-.9-.3-1-.7-.1-.4-.5-.6-.9-.5-.4.1-.7.5-.6.9.3.9 1 1.6 2 1.8V17h1v-.9c1.1-.2 1.9-1.1 1.9-2.2 0-1.3-1-2.2-2.2-2.2-.5 0-.9-.3-.9-.7z"
        fill="#1f2937"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-100">
      <defs>
        <linearGradient id="user-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="8" r="3.2" fill="url(#user-grad)" />
      <path
        d="M5.5 18.5c.7-2.4 3.2-4 6.5-4s5.8 1.6 6.5 4c.1.4-.2.7-.6.7H6.1c-.4 0-.7-.3-.6-.7z"
        fill="url(#user-grad)"
      />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-yellow-300">
      <defs>
        <linearGradient id="bolt-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        fill="url(#bolt-grad)"
        d="M13.5 2.5 6.8 13h4.2l-0.5 8.5 6.7-10.5h-4.2z"
      />
    </svg>
  );
}

function SlotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-100">
      <defs>
        <linearGradient id="slot-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <linearGradient id="slot-reel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="6"
        width="16"
        height="12"
        rx="2.5"
        fill="url(#slot-grad)"
      />
      <rect x="6" y="8" width="4.5" height="8" rx="1" fill="#111827" />
      <rect x="9.75" y="8" width="4.5" height="8" rx="1" fill="#111827" />
      <rect x="13.5" y="8" width="4.5" height="8" rx="1" fill="#111827" />
      <text
        x="8.2"
        y="13.1"
        fontSize="3.4"
        fill="url(#slot-reel)"
        fontWeight="700"
      >
        7
      </text>
      <text
        x="11.8"
        y="13.1"
        fontSize="3.4"
        fill="url(#slot-reel)"
        fontWeight="700"
      >
        7
      </text>
      <text
        x="15.4"
        y="13.1"
        fontSize="3.4"
        fill="url(#slot-reel)"
        fontWeight="700"
      >
        7
      </text>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-100">
      <rect x="5" y="7" width="14" height="1.8" rx="0.9" fill="#e5e7eb" />
      <rect x="5" y="11.1" width="14" height="1.8" rx="0.9" fill="#e5e7eb" />
      <rect x="5" y="15.2" width="10" height="1.8" rx="0.9" fill="#e5e7eb" />
    </svg>
  );
}
