"use client";

import React, { useState } from "react";
import Link from "next/link";

type Segment = {
  id: string;
  label: string;        // короткий текст на сегменте
  highlight: string;    // жирный заголовок в результате
  description: string;  // описание в результате
};

const SEGMENTS: Segment[] = [
  {
    id: "cashback5",
    label: "+5% кешбэк",
    highlight: "+5% кешбэк на первые депозиты",
    description: "Вернём часть проигрышей реальными деньгами или бонусами.",
  },
  {
    id: "fs20",
    label: "20 фриспинов",
    highlight: "20 фриспинов на слоты",
    description: "Фриспины по фиксированной ставке на топовые слоты.",
  },
  {
    id: "bonus20",
    label: "+20% к депозиту",
    highlight: "Бонус +20% к первому депозиту",
    description: "Увеличь стартовый банкролл и тестируй провайдеров с запасом.",
  },
  {
    id: "fs50",
    label: "50 фриспинов",
    highlight: "50 фриспинов за регистрацию",
    description: "Получишь пакет спинов после подтверждения аккаунта.",
  },
  {
    id: "cashback10",
    label: "+10% кешбэк",
    highlight: "Усиленный кешбэк +10%",
    description: "Защита банкролла в турбо-режиме: часть минуса вернётся назад.",
  },
  {
    id: "mystery",
    label: "Mystery Box",
    highlight: "Mystery Box на запуск",
    description: "Секретный бонус: может быть кешбэк, фриспины или депозитный буст.",
  },
];

const SPIN_DURATION_MS = 2800; // синхронно с .animate-spin-slow в globals.css
const REGISTER_URL = "https://pulzwin.com"; // при желании поменяешь на /auth/register

export const FortuneWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Segment | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // случайный сегмент
    const randomIndex = Math.floor(Math.random() * SEGMENTS.length);
    const selected = SEGMENTS[randomIndex];

    setTimeout(() => {
      setIsSpinning(false);
      setResult(selected);
      setHasSpun(true);
    }, SPIN_DURATION_MS);
  };

  return (
    <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 flex justify-center pb-4">
      <div className="mx-3 w-full max-w-md rounded-3xl border border-slate-800/80 bg-gradient-to-t from-black/95 via-slate-950/95 to-slate-900/95 px-4 pb-4 pt-3 shadow-[0_-12px_45px_rgba(15,23,42,0.9)]">
        {/* Верхняя линия + заголовок */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
            PULZ WHEEL
          </div>
          <div className="text-[10px] text-slate-500">
            Первый спин — демо. Для команды.
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Само колесо */}
          <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
            {/* подсветка вокруг */}
            <div className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(248,113,113,0.35),_transparent_60%)] blur-sm" />

            {/* стрелка-указатель сверху */}
            <div className="absolute -top-1 left-1/2 h-4 w-4 -translate-x-1/2 rotate-180">
              <div className="mx-auto h-4 w-[2px] rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.85)]" />
            </div>

            {/* диск */}
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-full border border-slate-800/80 bg-[conic-gradient(from_0deg,_#22c55e_0deg,_#22c55e_60deg,_#a855f7_60deg,_#a855f7_120deg,_#f97316_120deg,_#f97316_180deg,_#0ea5e9_180deg,_#0ea5e9_240deg,_#facc15_240deg,_#facc15_300deg,_#ef4444_300deg,_#ef4444_360deg)] shadow-[0_0_25px_rgba(15,23,42,0.9)] ${
                isSpinning ? "animate-spin-slow" : ""
              }`}
            >
              {/* центр с логотипом-надписью */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-black via-slate-900 to-black text-[9px] font-semibold uppercase tracking-[0.16em] text-red-400 shadow-[0_0_18px_rgba(239,68,68,0.7)]">
                Pulz
              </div>
            </div>
          </div>

          {/* Описание + кнопка */}
          <div className="flex-1 space-y-2 text-xs">
            <div className="text-[11px] font-medium text-slate-100">
              Крути PULZ WHEEL и посмотри, какой демо-бонус выпадет первому
              игроку после запуска.
            </div>

            {result ? (
              <div className="rounded-2xl bg-slate-900/70 px-3 py-2 text-[11px]">
                <div className="font-semibold text-slate-50">
                  {result.highlight}
                </div>
                <div className="text-[10px] text-slate-400">
                  {result.description}
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-slate-500">
                Бонусы демонстрационные — без реальных денег. Далее подключим
                реальный бонусный движок.
              </div>
            )}

            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_0_22px_rgba(248,113,113,0.8)] hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-900/70 disabled:text-slate-400 disabled:shadow-none"
            >
              {isSpinning ? "Крутим..." : "Крутить PULZ WHEEL"}
            </button>
          </div>
        </div>

        {/* Блок с призывом к регистрации после спина */}
        {hasSpun && result && (
          <div className="mt-3 rounded-2xl border border-slate-800/70 bg-slate-950/90 px-3 py-2.5 text-[11px]">
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-lime-300">
              Бонус пойман
            </div>
            <div className="mb-1 font-semibold text-slate-50">
              Забрать такой же бонус можно будет в реальном кабинете.
            </div>
            <div className="mb-2 text-[10px] text-slate-400">
              После запуска платформы игроки смогут получать подобные бонусы за
              регистрацию и первые депозиты. Оставь заявку, чтобы быть в первых.
            </div>

            <div className="flex items-center justify-between gap-2">
              <Link
                href={REGISTER_URL}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_0_24px_rgba(248,113,113,0.9)] hover:from-red-500 hover:to-red-400"
              >
                Зарегистрироваться позже
              </Link>
              <span className="hidden text-[10px] text-slate-500 sm:inline">
                В проде привяжем к реальному флоу регистрации.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FortuneWheel;
