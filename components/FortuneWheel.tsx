"use client";

import { useState } from "react";
import Link from "next/link";

// Cектора колеса
const SEGMENTS = [
  { label: "10 FS", description: "на Pulz Originals" },
  { label: "5 FS", description: "на слоты" },
  { label: "15 FS", description: "на Pulz Originals" },
  { label: "2x", description: "множитель бонуса" },
  { label: "20 FS", description: "на хиты недели" },
  { label: "10%", description: "кэшбек" },
  { label: "25 FS", description: "турбо-спины" },
  { label: "50%", description: "бонус на депозит" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

export default function FortuneWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const openWheel = () => {
    setIsOpen(true);
    setResultIndex(null);
  };

  const closeWheel = () => {
    if (isSpinning) return;
    setIsOpen(false);
  };

  const handleSpin = () => {
    if (isSpinning) return;

    const targetIndex = Math.floor(Math.random() * SEGMENTS.length);
    const extraTurns = 4; // сколько полных оборотов
    const targetAngle =
      extraTurns * 360 +
      (360 - (targetIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2));

    setIsSpinning(true);
    setResultIndex(null);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setResultIndex(targetIndex);
    }, 4200);
  };

  const result = resultIndex !== null ? SEGMENTS[resultIndex] : null;

  return (
    <>
      {/* Нижний бар Pulz */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-3">
        <div className="pointer-events-auto flex max-w-md flex-1 items-center justify-between rounded-full bg-black/80 px-4 py-2 text-[11px] text-slate-200 shadow-[0_0_30px_rgba(0,0,0,0.8)] ring-1 ring-slate-800/80 backdrop-blur">
          <Link
            href="/cashier"
            className="flex flex-col items-center gap-0.5 text-[11px] text-slate-300"
          >
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-100">
              Касса
            </span>
          </Link>

          <button className="flex flex-col items-center gap-0.5 text-[11px] text-slate-300">
            <span className="rounded-full border border-slate-600/70 bg-slate-900/80 px-3 py-1 text-[10px] font-semibold tracking-wide text-slate-100">
              Вход
            </span>
          </button>

          {/* Центральная кнопка с молнией */}
          <button
            onClick={openWheel}
            className="relative -mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-600 to-amber-400 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(248,113,113,0.9)] transition hover:scale-105 hover:shadow-[0_0_55px_rgba(248,113,113,1)]"
          >
            <div className="absolute inset-[3px] rounded-full bg-slate-950/95" />
            <div className="absolute inset-[7px] rounded-full bg-gradient-to-br from-red-600 via-red-500 to-yellow-400" />
            <div className="relative flex items-center justify-center">
              {/* Иконка молнии Pulz */}
              <span className="text-2xl leading-none drop-shadow-[0_0_12px_rgba(248,250,252,0.9)]">
                ⚡
              </span>
            </div>
          </button>

          <button className="flex flex-col items-center gap-0.5 text-[11px] text-slate-300">
            <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold tracking-wide text-white shadow-[0_0_25px_rgba(248,113,113,0.9)]">
              Регистрация
            </span>
          </button>

          <button className="flex flex-col items-center gap-0.5 text-[11px] text-slate-300">
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold tracking-wide text-slate-100">
              Меню
            </span>
          </button>
        </div>
      </div>

      {/* Затемнение / модалка с колесом */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center">
          {/* Молнии вокруг, когда колесо открыто */}
          <div className="pulz-lightning pulz-lightning-1" />
          <div className="pulz-lightning pulz-lightning-2" />
          <div className="pulz-lightning pulz-lightning-3" />

          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#05030a] via-[#13010c] to-black p-[1px] shadow-[0_0_60px_rgba(0,0,0,1)]">
            <div className="rounded-3xl bg-gradient-to-b from-black via-[#10000a] to-[#020105] px-5 pb-5 pt-4">
              {/* Заголовок и крестик */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-red-400">
                    Pulz Wheel
                  </div>
                  <div className="text-sm font-semibold text-slate-50">
                    Крутани, чтобы забрать демо-бонус
                  </div>
                </div>
                <button
                  onClick={closeWheel}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Само колесо */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
                  {/* Внешнее золотое кольцо */}
                  <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_160deg,rgba(250,250,250,0.15),rgba(253,224,71,0.9),rgba(251,191,36,0.98),rgba(249,115,22,0.9),rgba(248,250,252,0.18))] p-[6px] shadow-[0_0_50px_rgba(251,191,36,0.8)]">
                    {/* Диск с цветными секторами */}
                    <div
                      className="relative flex h-full w-full items-center justify-center rounded-full border border-amber-300/60 bg-slate-950/90"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning
                          ? "transform 4s cubic-bezier(0.17,0.89,0.32,1.28)"
                          : "transform 0.6s ease-out",
                        backgroundImage:
                          "conic-gradient(#22c55e 0deg 45deg,#f97373 45deg 90deg,#38bdf8 90deg 135deg,#facc15 135deg 180deg,#f97373 180deg 225deg,#22c55e 225deg 270deg,#38bdf8 270deg 315deg,#facc15 315deg 360deg)",
                      }}
                    >
                      {/* Секторы и текст */}
                      {SEGMENTS.map((seg, index) => {
                        const angle = index * SEGMENT_ANGLE;
                        return (
                          <div
                            key={seg.label + index}
                            className="absolute inset-[20px] flex origin-center items-center justify-center"
                            style={{ transform: `rotate(${angle}deg)` }}
                          >
                            <div className="flex w-1/2 -rotate-90 flex-col items-center justify-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-50 drop-shadow-[0_0_6px_rgba(15,23,42,0.8)]">
                              <span>{seg.label}</span>
                            </div>
                          </div>
                        );
                      })}

                      {/* Внутреннее тёмное кольцо */}
                      <div className="absolute inset-[26%] rounded-full bg-gradient-to-b from-[#05010b] via-[#12000b] to-[#020005] shadow-[inset_0_0_35px_rgba(15,23,42,1)]" />

                      {/* Центральная кнопка SPIN */}
                      <button
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className="absolute inset-[32%] flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-xs font-bold uppercase tracking-[0.18em] text-black shadow-[0_0_30px_rgba(250,204,21,0.95)] hover:from-yellow-200 hover:to-amber-400 disabled:opacity-80"
                      >
                        <span className="absolute inset-[4px] rounded-full bg-gradient-to-b from-[#fef9c3] via-[#facc15] to-[#ea580c]" />
                        <span className="relative z-10 text-[11px]">
                          SPIN
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Стрелка-указатель сверху */}
                  <div className="pointer-events-none absolute -top-4 left-1/2 flex -translate-x-1/2 flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-orange-500 shadow-[0_0_14px_rgba(250,204,21,0.9)]" />
                    <div className="h-5 w-1.5 -translate-y-[1px] rounded-b-full bg-gradient-to-b from-amber-300 via-amber-500 to-orange-600" />
                    <div className="h-3 w-5 -translate-y-[3px] rounded-b-[999px] bg-gradient-to-b from-amber-400 via-amber-500 to-orange-700 shadow-[0_4px_14px_rgba(0,0,0,0.7)]" />
                  </div>
                </div>

                {/* Результат и CTA */}
                {result ? (
                  <div className="w-full space-y-3 rounded-2xl border border-red-500/40 bg-black/60 px-4 py-3 text-xs text-slate-100 shadow-[0_0_25px_rgba(248,113,113,0.45)]">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-red-400">
                      Выигрыш Pulz Wheel
                    </div>
                    <div className="text-sm font-semibold">
                      {result.label}{" "}
                      <span className="text-slate-400">
                        — {result.description}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      Чтобы закрепить бонус за аккаунтом, зарегистрируйся на
                      Pulz и активируй его в разделе&nbsp;
                      <span className="text-slate-100">«Бонусы»</span>.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={closeWheel}
                        className="flex-1 rounded-full border border-slate-600/70 bg-slate-900/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100 hover:border-slate-300 hover:bg-slate-800"
                      >
                        Ещё раз
                      </button>
                      <Link
                        href="/cashier"
                        className="flex-1 rounded-full bg-red-600 px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_0_25px_rgba(248,113,113,0.9)] hover:bg-red-500"
                      >
                        Регистрация
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="w-full rounded-2xl border border-slate-700/70 bg-black/60 px-4 py-3 text-[11px] text-slate-300">
                    Первый спин бесплатный. Нажми{" "}
                    <span className="font-semibold text-slate-100">
                      SPIN
                    </span>{" "}
                    и посмотри, какой демо-бонус Pulz Wheel выдаст сегодня.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
