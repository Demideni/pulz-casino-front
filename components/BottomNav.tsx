"use client";

import Link from "next/link";
import FortuneWheel from "@/components/FortuneWheel";

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800/60 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-end justify-between px-4 pb-3 pt-2">
        {/* Касса */}
        <button
          type="button"
          className="flex flex-1 flex-col items-center gap-1 text-[11px] text-slate-300"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-950/80">
            <div className="h-4 w-5 rounded-md border border-slate-400/80" />
          </div>
          <span>Касса</span>
        </button>

        {/* Вход */}
        <button
          type="button"
          className="flex flex-1 flex-col items-center gap-1 text-[11px] text-slate-300"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-950/80">
            <div className="h-4 w-4 rounded-full border border-slate-400/80" />
          </div>
          <span>Вход</span>
        </button>

        {/* Центральное колесо */}
        <div className="flex flex-1 justify-center">
          <FortuneWheel />
        </div>

        {/* Игры */}
        <Link
          href="/games"
          className="flex flex-1 flex-col items-center gap-1 text-[11px] text-slate-300"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-950/80">
            <div className="h-4 w-4 rounded-md border border-slate-400/80 border-b-0" />
          </div>
          <span>Игры</span>
        </Link>

        {/* Меню */}
        <button
          type="button"
          className="flex flex-1 flex-col items-center gap-1 text-[11px] text-slate-300"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-950/80">
            <div className="flex flex-col gap-[2px]">
              <span className="block h-[2px] w-4 rounded-full bg-slate-400/90" />
              <span className="block h-[2px] w-4 rounded-full bg-slate-400/90" />
              <span className="block h-[2px] w-4 rounded-full bg-slate-400/90" />
            </div>
          </div>
          <span>Меню</span>
        </button>
      </div>
    </nav>
  );
}
