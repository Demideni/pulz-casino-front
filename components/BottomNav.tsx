"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import FortuneWheelModal from "@/components/FortuneWheel";

export default function BottomNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* ФИКСИРОВАННЫЙ НИЖНИЙ ТАП-БАР */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3">
        <nav className="pointer-events-auto relative flex w-full max-w-xl items-end justify-between px-0">

          {/* Серая подложка бара */}
          <div className="relative flex w-full items-end justify-between rounded-t-3xl bg-[#12151f]/96 px-4 pb-3 pt-3 border-t border-slate-700/70">

            {/* Касса */}
            <Link
              href="/cashier"
              className="flex w-1/5 flex-col items-center text-[11px] text-slate-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
                {/* сюда потом поставим иконку кассы */}
              </div>
              <span className="mt-1">Касса</span>
            </Link>

            {/* Вертикальный разделитель */}
            <div className="h-8 w-px bg-slate-700/70" />

            {/* Вход */}
            <Link
              href="/login"
              className="flex w-1/5 flex-col items-center text-[11px] text-slate-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
                {/* иконка входа */}
              </div>
              <span className="mt-1">Вход</span>
            </Link>

            {/* Пустое место под колесо (чтобы бар визуально его "обходил") */}
            <div className="w-1/5" />

            {/* Вертикальный разделитель справа от колеса */}
            <div className="h-8 w-px bg-slate-700/70" />

            {/* Игры */}
            <Link
              href="/games"
              className="flex w-1/5 flex-col items-center text-[11px] text-slate-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
                {/* иконка игр */}
              </div>
              <span className="mt-1">Игры</span>
            </Link>

            {/* Вертикальный разделитель */}
            <div className="h-8 w-px bg-slate-700/70" />

            {/* Меню */}
            <Link
              href="/menu"
              className="flex w-1/5 flex-col items-center text-[11px] text-slate-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
                {/* иконка меню */}
              </div>
              <span className="mt-1">Меню</span>
            </Link>
          </div>

          {/* ЦЕНТРАЛЬНОЕ КОЛЕСО – ВЫЕЗЖАЕТ НА ~60% */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="pointer-events-auto absolute left-1/2 bottom-0 flex -translate-x-1/2 translate-y-[40%] items-center justify-center"
          >
            <div className="relative h-24 w-24 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.85)]">
              {/* мягкое свечение под колесом */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.45),transparent_55%),radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.65),transparent_60%)] opacity-90" />
              {/* само колесо */}
              <Image
                src="/pulz-wheel.png"
                alt="Pulz Wheel"
                fill
                className="rounded-full object-contain"
                sizes="96px"
                priority
              />
            </div>
          </button>
        </nav>
      </div>

      {/* МОДАЛКА С БОЛЬШИМ КОЛЕСОМ */}
      {open && (
        <FortuneWheelModal open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
