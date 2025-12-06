"use client";

import React from "react";
import Link from "next/link";
import FortuneWheelModal from "@/components/FortuneWheel";

export default function BottomNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* снизу по центру, как системный таб-бар */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-3">
        <nav
          className="
            pointer-events-auto
            relative flex w-full max-w-xl items-end justify-between
            rounded-t-[28px]
            bg-[#11141f]/95
            px-2 pb-3 pt-4
          "
        >
          {/* дуга, которая обнимает колесо (имитация JetTon) */}
          <div
            className="
              pointer-events-none
              absolute -top-8 left-1/2
              h-16 w-44
              -translate-x-1/2
              rounded-t-[999px]
              
            
              bg-[#11141f]/95
            "
          />

          {/* Касса */}
          <NavButton href="/cashier" label="Касса" first />

          {/* Вход */}
          <NavButton href="/login" label="Вход" />

          {/* Пустое место под колесо, чтобы элементы не наехали */}
          <div className="w-[96px]" />

          {/* Игры */}
          <NavButton href="/games" label="Игры" />

          {/* Меню */}
          <NavButton href="/menu" label="Меню" />

          {/* САМО КОЛЕСО — центр, вытащено из бара примерно на 60% */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              absolute
              -top-4 left-1/2
              flex h-26 w-26 -translate-x-1/2
              items-center justify-center
              rounded-full
              bg-[radial-gradient(circle_at_30%_0%,rgba(250,250,250,0.35),transparent_55%),radial-gradient(circle_at_70%_120%,rgba(34,197,94,0.7),transparent_60%)]
              shadow-[0_0_40px_rgba(34,197,94,0.9)]
            "
          >
            <img
              src="/Pulz-wheel.png"
              alt="Pulz Wheel"
              className="h-24 w-24 rounded-full object-contain"
            />
          </button>
        </nav>
      </div>

      {/* модалка с большим колесом */}
      {open && <FortuneWheelModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
}

type NavButtonProps = {
  href: string;
  label: string;
  first?: boolean;
};

function NavButton({ href, label, first }: NavButtonProps) {
  return (
    <Link
      href={href}
      className={`
        flex w-[72px] flex-col items-center text-[11px] text-slate-100
        ${first ? "" : "border-l border-slate-700/70"}
      `}
    >
      <div
        className="
          flex h-10 w-10 items-center justify-center
          rounded-2xl
          border border-slate-600/70
          bg-black/40
        "
      >
        {/* сюда позже поставим нормальные иконки */}
      </div>
      <span className="mt-1">{label}</span>
    </Link>
  );
}
