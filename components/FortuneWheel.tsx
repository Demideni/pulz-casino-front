"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Segment = {
  label: string;
  color: string;
  value: string;
};

const SEGMENTS: Segment[] = [
  { label: "+10 фриспинов", color: "from-amber-400 to-yellow-300", value: "10 FS" },
  { label: "+20 фриспинов", color: "from-rose-400 to-red-400", value: "20 FS" },
  { label: "Кэшбек 5%", color: "from-sky-400 to-cyan-400", value: "5% cashback" },
  { label: "Бонус +25%", color: "from-emerald-400 to-lime-400", value: "+25% bonus" },
  { label: "x2 шанс на выигрыш", color: "from-fuchsia-400 to-pink-400", value: "x2 chance" },
  { label: "VIP-поддержка", color: "from-indigo-400 to-violet-400", value: "VIP support" },
  { label: "+50 фриспинов", color: "from-orange-400 to-amber-300", value: "50 FS" },
  { label: "Сюрприз-бонус", color: "from-teal-400 to-emerald-400", value: "Mystery" },
];

const FortuneWheel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Segment | null>(null);
  const [showLightning, setShowLightning] = useState(false);

  const segmentAngle = 360 / SEGMENTS.length;

  const wheelBackground = useMemo(() => {
    const colors = [
      "#f97316",
      "#fb7185",
      "#22c55e",
      "#38bdf8",
      "#a855f7",
      "#facc15",
      "#ef4444",
      "#22d3ee",
    ];

    const step = 360 / colors.length;
    const parts: string[] = [];

    colors.forEach((color, index) => {
      const start = index * step;
      const end = (index + 1) * step;
      parts.push(`${color} ${start}deg ${end}deg`);
    });

    return `conic-gradient(${parts.join(",")})`;
  }, []);

  const handleOpenModal = () => {
    setShowLightning(true);
    setTimeout(() => setShowLightning(false), 800);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSpinning) return;
    setIsModalOpen(false);
    setResult(null);
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * SEGMENTS.length);
    const extraSpins = 3;

    const target =
      extraSpins * 360 +
      (360 - randomIndex * segmentAngle - segmentAngle / 2);

    const newRotation = rotation + target;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(SEGMENTS[randomIndex]);
    }, 2800);
  };

  return (
    <>
      {/* Молнии поверх экрана */}
      {showLightning && (
        <div className="pulz-lightning pulz-lightning-active">
          <div className="pulz-lightning-beam" style={{ left: "20%" }} />
          <div
            className="pulz-lightning-beam"
            style={{ left: "50%", height: "110%" }}
          />
          <div
            className="pulz-lightning-beam"
            style={{ left: "80%", height: "90%" }}
          />
        </div>
      )}

      {/* НИЖНЯЯ ПАНЕЛЬ С 5 КРУГЛЫМИ КНОПКАМИ */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800/70 bg-black/85 pb-5 pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-6 text-xs">
          {/* Касса (деньги) */}
          <Link
            href="/cashier"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 via-red-500 to-red-700 shadow-[0_0_22px_rgba(248,113,113,0.6)] outline-none ring-2 ring-red-500/40 ring-offset-2 ring-offset-black hover:scale-105 transition-transform"
          >
            <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.35),transparent_55%),radial-gradient(circle_at_70%_120%,rgba(248,113,113,0.45),transparent_60%)] opacity-80 blur-[2px]" />
            <span className="relative text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
              💰
            </span>
            <span className="sr-only">Касса</span>
          </Link>

          {/* Авторизация */}
          <Link
            href="/login"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 via-red-500 to-red-700 shadow-[0_0_22px_rgba(248,113,113,0.6)] outline-none ring-2 ring-red-500/40 ring-offset-2 ring-offset-black hover:scale-105 transition-transform"
          >
            <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.35),transparent_55%),radial-gradient(circle_at_70%_120%,rgba(248,113,113,0.45),transparent_60%)] opacity-80 blur-[2px]" />
            <span className="relative text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
              👤
            </span>
            <span className="sr-only">Вход / регистрация</span>
          </Link>

          {/* Центральная кнопка PULZ WHEEL (молния) */}
          <button
            onClick={handleOpenModal}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 via-red-500 to-red-700 shadow-[0_0_30px_rgba(248,113,113,0.9)] outline-none ring-2 ring-red-500/70 ring-offset-2 ring-offset-black hover:scale-110 transition-transform"
          >
            <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.45),transparent_55%),radial-gradient(circle_at_70%_120%,rgba(248,113,113,0.55),transparent_60%)] opacity-90 blur-[2px]" />
            <span className="relative text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              ⚡
            </span>
            <span className="sr-only">Открыть Pulz Wheel</span>
          </button>

          {/* Игры (фишка / слот) */}
          <Link
            href="/games"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 via-red-500 to-red-700 shadow-[0_0_22px_rgba(248,113,113,0.6)] outline-none ring-2 ring-red-500/40 ring-offset-2 ring-offset-black hover:scale-105 transition-transform"
          >
            <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.35),transparent_55%),radial-gradient(circle_at_70%_120%,rgba(248,113,113,0.45),transparent_60%)] opacity-80 blur-[2px]" />
            <span className="relative text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
              🎰
            </span>
            <span className="sr-only">Каталог игр</span>
          </Link>

          {/* Меню */}
          <Link
            href="/menu"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-amber-400 via-red-500 to-red-700 shadow-[0_0_22px_rgba(248,113,113,0.6)] outline-none ring-2 ring-red-500/40 ring-offset-2 ring-offset-black hover:scale-105 transition-transform"
          >
            <span className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.35),transparent_55%),radial-gradient(circle_at_70%_120%,rgba(248,113,113,0.45),transparent_60%)] opacity-80 blur-[2px]" />
            <span className="relative text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
              ☰
            </span>
            <span className="sr-only">Меню</span>
          </Link>
        </div>

        <div className="mt-2 text-center text-[11px] uppercase tracking-[0.2em] text-slate-500">
          PULZ WHEEL • Первый спин — бесплатно
        </div>
      </div>

      {/* Модалка с колесом */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#050509] via-[#100810] to-black p-5 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
            >
              Закрыть
            </button>

            <div className="mb-4 text-center">
              <div className="text-[11px] uppercase tracking-[0.3em] text-red-400">
                Pulz originals
              </div>
              <h2 className="text-lg font-semibold text-slate-50">
                PULZ WHEEL
              </h2>
              <p className="text-xs text-slate-400">
                Крути колесо, чтобы получить приветственный бонус. Первый спин —
                бесплатно.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative h-56 w-56">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-yellow-500 via-amber-400 to-orange-500 shadow-[0_0_35px_rgba(251,191,36,0.7)] p-[5px]">
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full border-4 border-yellow-200/60"
                    style={{
                      backgroundImage: wheelBackground,
                      transform: `rotate(${rotation}deg)`,
                      transition: isSpinning
                        ? "transform 2.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
                        : "none",
                    }}
                  >
                    <button
                      onClick={spinWheel}
                      disabled={isSpinning}
                      className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-sm font-bold uppercase tracking-wide text-slate-900 shadow-[0_0_25px_rgba(251,191,36,0.9)] outline-none"
                    >
                      <span className="absolute inset-[-6px] rounded-full border border-amber-100/70" />
                      <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                        {isSpinning ? "..." : "SPIN"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="h-6 w-6 rotate-180 rounded-b-full bg-gradient-to-b from-yellow-200 via-amber-300 to-orange-500 shadow-[0_0_15px_rgba(251,191,36,0.9)]">
                    <div className="mx-auto mt-[6px] h-3 w-[6px] rounded-b-full bg-red-600" />
                  </div>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-slate-800/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-200">
                {result ? (
                  <>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
                      Вы выиграли
                    </div>
                    <div className="mt-1 text-base font-semibold">
                      {result.label}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Забрать бонус можно после регистрации или входа в аккаунт.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href="/register"
                        className="flex-1 rounded-full bg-red-600 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_18px_rgba(248,113,113,0.9)] hover:bg-red-500"
                      >
                        Зарегистрироваться и забрать
                      </Link>
                      <Link
                        href="/login"
                        className="rounded-full bg-slate-900 px-3 py-2 text-center text-xs text-slate-100 hover:bg-slate-800"
                      >
                        Войти
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      Готово к спину
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      Нажми SPIN, чтобы получить случайный бонус Pulz: фриспины,
                      кэшбек, повышенный депозит или VIP-статус.
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FortuneWheel;
