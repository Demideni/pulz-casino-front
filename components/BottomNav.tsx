"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import FortuneWheelModal from "@/components/FortuneWheel";

const ICONS: Record<string, string> = {
  "/cashier": "/icons/wallet.png",
  "/login": "/icons/login.png",
  "/games": "/icons/games.png",
  "/menu": "/icons/menu.png",
};

export default function BottomNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* снизу по центру, как системный таб-бар */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-1">
        <nav
          className="
            pointer-events-auto
            relative flex w-full max-w-xl items-end justify-between
            rounded-t-[24px]
            bg-[#11141f]/95
            px-2 pb-2 pt-3
            backdrop-blur-lg
          "
        >
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

          {/* САМО КОЛЕСО — центр, без старой зелёной оболочки */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="
              absolute
              -top-6 left-1/2
              -translate-x-1/2
              flex items-center justify-center
            "
          >
            <img
              src="/Pulz-wheel.png"
              alt="Pulz Wheel"
              className="pulz-wheel-animated"
            />
          </button>
        </nav>
      </div>

      {/* модалка с большим колесом */}
      {open && (
        <FortuneWheelModal open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

type NavButtonProps = {
  href: string;
  label: string;
  first?: boolean;
};

function NavButton({ href, label, first }: NavButtonProps) {
  const iconSrc = ICONS[href];

  return (
    <Link
      href={href}
      className={`
        flex w-[72px] flex-col items-center text-[11px] text-slate-100
        ${first ? "" : "border-l border-slate-700/70"}
      `}
    >
      <div className="flex flex-col items-center gap-1">
        {iconSrc ? (
          <Image
            src={iconSrc}
            width={26}
            height={26}
            alt={label}
            className="opacity-95"
          />
        ) : (
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-2xl
              border border-slate-600/70
              bg-black/40
            "
          >
            {/* fallback, если иконки нет */}
          </div>
        )}
        <span className="text-[10px]">{label}</span>
      </div>
    </Link>
  );
}
