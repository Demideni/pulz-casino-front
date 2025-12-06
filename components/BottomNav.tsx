// components/BottomNav.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import FortuneWheelModal from "@/components/FortuneWheel"; // та модалка, что ты присылал

export default function BottomNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* сам таб-бар */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3">
        <nav className="pointer-events-auto relative flex w-full max-w-xl items-end justify-between rounded-t-3xl bg-[#0b0e16]/95 px-4 pt-3 pb-4 border-t border-white/10">

          {/* Касса */}
          <Link
            href="/cashier"
            className="flex w-1/5 flex-col items-center text-[11px] text-slate-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
              {/* сюда потом поставим иконку кассы */}
            </div>
            <span className="mt-1">Касса</span>
          </Link>

          {/* Вход */}
          <Link
            href="/login"
            className="flex w-1/5 flex-col items-center text-[11px] text-slate-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
              {/* иконка входа */}
            </div>
            <span className="mt-1">Вход</span>
          </Link>

          {/* ЦЕНТР: PULZ WHEEL */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative flex w-1/5 justify-center"
          >
            {/* Контейнер, который вытаскивает колесо вверх примерно на 60% */}
            <div className="-translate-y-[60%]">
              <div className="relative h-20 w-20 rounded-full bg-[radial-gradient(circle_at_30%_0%,rgba(250,250,250,0.4),transparent_55%),radial-gradient(circle_at_70%_120%,rgba(248,113,113,0.5),transparent_60%)] shadow-[0_0_35px_rgba(248,113,113,0.8)]">
                <Image
                  src="/pulz-wheel.png"
                  alt="Pulz Wheel"
                  fill
                  className="rounded-full object-contain"
                  priority
                />
              </div>
            </div>
          </button>

          {/* Игры */}
          <Link
            href="/games"
            className="flex w-1/5 flex-col items-center text-[11px] text-slate-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
              {/* иконка игр */}
            </div>
            <span className="mt-1">Игры</span>
          </Link>

          {/* Меню */}
          <Link
            href="/menu"
            className="flex w-1/5 flex-col items-center text-[11px] text-slate-300"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/60">
              {/* иконка меню */}
            </div>
            <span className="mt-1">Меню</span>
          </Link>
        </nav>
      </div>

      {/* модалка с большим колесом */}
      {open && (
        <FortuneWheelModal open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
