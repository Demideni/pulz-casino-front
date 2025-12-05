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
    description: "Пакет стартовых фриспинов на топовые слоты.",
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
const REGISTER_URL = "/"; // потом заменишь на реальный URL регистрации

const FortuneWheel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Segment | null>(null);
  const [showLightning, setShowLightning] = useState(false);

  const openModal = () => {
    if (isSpinning) return;

    setResult(null);
    setIsOpen(true);

    // Включаем молнии на короткое время
    setShowLightning(true);
    setTimeout(() => setShowLightning(false), 600);
  };

  const closeModal = () => {
    if (isSpinning) return;
    setIsOpen(false);
    setResult(null);
  };

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
      {/* Эффект молний поверх экрана */}
      {showLightning && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          <div className="pulz-lightning pulz-lightning-1" />
          <div className="pulz-lightning pulz-lightning-2" />
          <div className="pulz-lightning pulz-lightning-3" />
        </div>
      )}

      {/* Нижний бар */}
      <div className="pointer-events-auto fixed inset-x-0 bottom-0 z-40 flex justify-center pb-3">
        <div className="mx-3 flex w-full max-w-6xl items-center gap-2 rounded-3xl border border-slate-800/80 bg-black/90 px-3 py-2 backdrop-blur shadow-[0_-12px_35px_rgba(0,0,0,0.9)]">
          {/* Касса */}
          <Link
            href="/cashier"
            className="flex flex-1 flex-col items-center justify-center text-[10px]"
          >
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-100">
              Касса
            </span>
          </Link>

          {/* Вход */}
          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center text-[10px] text-slate-300"
          >
            <span className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] font-medium">
              Вход
            </span>
          </button>

          {/* Центральная кнопка с молнией */}
          <div className="flex flex-[1.4] flex-col items-center justify-center">
            <button
              type="button"
              onClick={openModal}
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-700 via-red-500 to-red-700 shadow-[0_0_35px_rgba(248,113,113,0.9)]"
            >
              {/* Внешнее свечение */}
              <div className="absolute inset-[-8px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(248,113,113,0.55),_transparent_60%)] blur-sm" />
              {/* Внутренний диск */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-black via-slate-900 to-black border border-red-400/70">
                {/* Иконка молнии */}
                <span className="text-2xl font-black text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.9)]">
                  ⚡
                </span>
              </div>
            </button>
            <span className="mt-1 text-[10px] text-slate-400">
              Pulz Wheel
            </span>
          </div>

          {/* Регистрация */}
          <Link
            href={REGISTER_URL}
            className="flex flex-1 flex-col items-center justify-center text-[10px]"
          >
            <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_0_16px_rgba(248,113,113,0.8)]">
              Регистрация
            </span>
          </Link>

          {/* Меню */}
          <button
            type="button"
            className="flex flex-1 flex-col items-center justify-center text-[10px] text-slate-300"
          >
            <span className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[11px] font-medium">
              Меню
            </span>
          </button>
        </div>
      </div>

      {/* Модальное окно с колесом фортуны */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800/80 bg-gradient-to-b from-black via-[#12020a] to-black p-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
            {/* Кнопка закрытия */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 rounded-full bg-slate-900/90 px-2 py-1 text-xs text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>

            <div className="mb-3 text-[11px] uppercase tracking-[0.2em] text-red-400">
              Pulz Wheel
            </div>
            <h2 className="mb-2 text-lg font-semibold text-slate-50">
              Крути колесо — забери демо-бонус
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Демо-режим для команды Pulz: показываем, как может работать
              промо-колесо. В бою привяжем к реальным бонусам и аккаунту.
            </p>

            {/* Визуальное колесо */}
            <div className="mb-4 flex flex-col items-center">
              <div className="relative h-40 w-40">
                {/* светящийся фон */}
                <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(248,113,113,0.65),_transparent_60%)] blur" />
                {/* секторное колесо */}
                <div
                  className={`relative flex h-full w-full items-center justify-center rounded-full border border-red-500/80 bg-[conic-gradient(from_0deg,_#f97316_0deg,_#f97316_60deg,_#22c55e_60deg,_#22c55e_120deg,_#0ea5e9_120deg,_#0ea5e9_180deg,_#a855f7_180deg,_#a855f7_240deg,_#facc15_240deg,_#facc15_300deg,_#ef4444_300deg,_#ef4444_360deg)] ${
                    isSpinning ? "animate-spin-slow" : ""
                  }`}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/90 border border-slate-700">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
                      Pulz
                      <br />
                      Wheel
                    </span>
                  </div>
                </div>
                {/* стрелка */}
                <div className="absolute -top-3 left-1/2 h-6 w-[3px] -translate-x-1/2 rounded-full bg-lime-300 shadow-[0_0_14px_rgba(190,242,100,1)]" />
              </div>

              <button
                type="button"
                onClick={handleSpin}
                disabled={isSpinning}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_24px_rgba(248,113,113,0.9)] hover:from-red-500 hover:to-red-400 disabled:opacity-60"
              >
                {isSpinning ? "Крутим…" : "Крутить колесо"}
              </button>
            </div>

            {/* Результат спина */}
            {result && (
              <div className="mt-3 rounded-2xl border border-slate-700/80 bg-slate-950/80 p-3 text-xs">
                <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-lime-300">
                  Ваш демо-результат
                </div>
                <div className="mb-1 font-semibold text-slate-50">
                  {result.highlight}
                </div>
                <div className="mb-3 text-[11px] text-slate-400">
                  {result.description}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href={REGISTER_URL}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-red-600 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-[0_0_22px_rgba(248,113,113,0.9)] hover:bg-red-500"
                  >
                    Зарегистрироваться и забрать бонус
                  </Link>
                  <span className="text-[10px] text-slate-500">
                    В реальном запуске спин будет доступен после регистрации /
                    депозита.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FortuneWheel;
