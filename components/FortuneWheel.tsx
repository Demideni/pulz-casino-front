"use client";

import React, { useState } from "react";
import Link from "next/link";

type Segment = {
  id: string;
  label: string;
  highlight: string;
  description: string;
};

const SEGMENTS: Segment[] = [
  {
    id: "cashback5",
    label: "+5% кешбэк",
    highlight: "+5% кешбэк на первые депозиты",
    description: "Часть проигрышей вернётся на баланс в виде бонуса.",
  },
  {
    id: "fs20",
    label: "20 фриспинов",
    highlight: "20 фриспинов на слоты",
    description: "Пакет стартовых фриспинов на топовые игры.",
  },
  {
    id: "bonus20",
    label: "+20% к депозиту",
    highlight: "Бонус +20% к первому депозиту",
    description: "Увеличиваем стартовый банкролл новым игрокам.",
  },
  {
    id: "fs50",
    label: "50 фриспинов",
    highlight: "50 фриспинов за регистрацию",
    description: "После подтверждения аккаунта открывается пакет спинов.",
  },
  {
    id: "cashback10",
    label: "+10% кешбэк",
    highlight: "Усиленный кешбэк +10%",
    description: "Защита банкролла в турбо-режиме на промо-период.",
  },
  {
    id: "mystery",
    label: "Mystery Box",
    highlight: "Mystery Box",
    description: "Секретный бонус: кешбэк, фриспины или депозитный буст.",
  },
];

const SPIN_DURATION_MS = 2800;
const REGISTER_URL = "/"; // при желании поменяешь на реальную страницу регистрации

const FortuneWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Segment | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * SEGMENTS.length);
    const selected = SEGMENTS[randomIndex];

    setTimeout(() => {
      setIsSpinning(false);
      setResult(selected);
    }, SPIN_DURATION_MS);
  };

  return (
    <>
      {/* Плашка с результатом над баром */}
      {result && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4">
          <div className="max-w-md flex-1 rounded-3xl border border-slate-800/80 bg-slate-950/95 px-4 py-3 text-[11px] shadow-[0_10px_35px_rgba(15,23,42,0.9)]">
            <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-lime-300">
              PULZ WHEEL — демо-результат
            </div>
            <div className="mb-1 font-semibold text-slate-50">
              {result.highlight}
            </div>
            <div className="mb-2 text-[10px] text-slate-400">
              {result.description}
            </div>
            <div className="flex items-center justify-between gap-2">
              <Link
                href={REGISTER_URL}
                className="pointer-events-auto inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_0_22px_rgba(248,113,113,0.8)] hover:from-red-500 hover:to-red-400"
              >
                Зарегистрироваться
              </Link>
              <span className="hidden text-[10px] text-slate-500 sm:inline">
                В проде привяжем к реальному флоу бонусов.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Нижний бар */}
      <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 flex justify-center pb-3">
        <div className="mx-3 flex w-full max-w-6xl items-center gap-2 rounded-3xl border border-slate-800/80 bg-black/90 px-3 py-2 backdrop-blur shadow-[0_-12px_35px_rgba(0,0,0,0.9)]">
          {/* Касса */}
          <Link
            href="/cashier"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px]"
          >
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100">
              Касса
            </span>
          </Link>

          {/* Вход */}
          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] text-slate-300"
          >
            <span className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] font-medium">
              Вход
            </span>
          </button>

          {/* Центральное колесо */}
          <div className="flex flex-[1.4] flex-col items-center justify-center">
            <button
              type="button"
              onClick={handleSpin}
              disabled={isSpinning}
              className="relative flex h-16 w-16 items-center justify-center rounded-full border border-red-500/80 bg-[conic-gradient(from_0deg,_#f97316_0deg,_#f97316_60deg,_#22c55e_60deg,_#22c55e_120deg,_#0ea5e9_120deg,_#0ea5e9_180deg,_#a855f7_180deg,_#a855f7_240deg,_#facc15_240deg,_#facc15_300deg,_#ef4444_300deg,_#ef4444_360deg)] shadow-[0_0_30px_rgba(248,113,113,0.8)] disabled:opacity-70"
            >
              {/* светящаяся аура */}
              <div className="absolute inset-[-6px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(248,113,113,0.45),_transparent_60%)] blur-sm" />
              {/* стрелка */}
              <div className="absolute -top-1 left-1/2 h-4 w-[2px] -translate-x-1/2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.9)]" />
              {/* вращающийся диск */}
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-black via-slate-900 to-black ${
                  isSpinning ? "animate-spin-slow" : ""
                }`}
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-red-400">
                  Pulz Wheel
                </span>
              </div>
            </button>
            <span className="mt-1 text-[10px] text-slate-400">
              {isSpinning ? "Крутим…" : "Крути и смотри демо-бонус"}
            </span>
          </div>

          {/* Регистрация */}
          <Link
            href={REGISTER_URL}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px]"
          >
            <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_0_16px_rgba(248,113,113,0.8)]">
              Регистрация
            </span>
          </Link>

          {/* Меню */}
          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] text-slate-300"
          >
            <span className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] font-medium">
              Меню
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FortuneWheel;
