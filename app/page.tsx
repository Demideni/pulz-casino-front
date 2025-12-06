// app/page.tsx
"use client";

import Link from "next/link";
import BannerCarousel from "@/components/BannerCarousel";

const POPULAR_GAMES = [
  {
    id: "gates-of-olympus",
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    rtp: "96.5%",
    tag: "Хит недели",
  },
  {
    id: "sweet-bonanza",
    name: "Sweet Bonanza",
    provider: "Pragmatic Play",
    rtp: "96.4%",
    tag: "Популярная",
  },
  {
    id: "robinzon",
    name: "RobinZON Island",
    provider: "Pulz Originals",
    rtp: "97.2%",
    tag: "Эксклюзив",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Верхняя карусель баннеров */}
      <section className="mt-2">
        <BannerCarousel />
      </section>

      {/* Блок бонусов под баннером */}
      <section className="space-y-4">
        {/* Большой welcome-баннер (текстовый блок, как сейчас) */}
        <div className="rounded-[28px] border border-red-900/40 bg-gradient-to-br from-[#23040a] via-[#12020a] to-[#020106] p-5 shadow-[0_0_40px_rgba(248,113,113,0.35)]">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
            Новый игрок
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-slate-50">
            Welcome-бонус до 500%
          </h1>
          <p className="mb-5 text-sm text-slate-300">
            Пакет на первые депозиты + фриспины в эксклюзивных слотах Pulz.
          </p>
          <button className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] hover:bg-red-500">
            Забрать бонус
          </button>

          {/* маленькие индикаторы слайдов под текстовым баннером */}
          <div className="mt-4 flex items-center gap-1">
            <span className="h-1.5 w-8 rounded-full bg-red-500" />
            <span className="h-1.5 w-6 rounded-full bg-slate-700" />
            <span className="h-1.5 w-6 rounded-full bg-slate-700" />
          </div>
        </div>

        {/* Два маленьких бонусных блока под welcome-баннером */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-[#180313] via-[#090712] to-[#050509] p-4 shadow-[0_0_25px_rgba(15,23,42,0.7)]">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-300">
              До 100 FS
            </div>
            <div className="mb-1 text-sm font-semibold text-slate-50">
              Бонус без депозита
            </div>
            <p className="text-xs text-slate-400">
              Фриспины за регистрацию.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-[#140316] via-[#090712] to-[#050509] p-4 shadow-[0_0_25px_rgba(15,23,42,0.7)]">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300">
              Ежедневно
            </div>
            <div className="mb-1 text-sm font-semibold text-slate-50">
              Турбо-спины
            </div>
            <p className="text-xs text-slate-400">
              Ежедневные миссии и гонки.
            </p>
          </div>
        </div>
      </section>

      {/* Популярные игры */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-100">
            Популярные игры
          </h2>
          <Link
            href="/games"
            className="text-xs font-semibold text-red-400 hover:text-red-300"
          >
            Все игры
          </Link>
        </div>

        {/* Горизонтальный скролл с карточками игр */}
        <div className="-mx-4 overflow-x-auto px-4 pb-2">
          <div className="flex gap-3">
            {POPULAR_GAMES.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group relative min-w-[160px] max-w-[210px] flex-1 overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#050509] via-[#12030b] to-[#050509] p-3 shadow-[0_0_25px_rgba(15,23,42,0.8)]"
              >
                <div className="mb-2 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-black text-xs text-slate-200 group-hover:from-red-900/40 group-hover:via-black group-hover:to-slate-900">
                  <span className="max-w-[90%] text-center font-semibold">
                    {game.name}
                  </span>
                </div>

                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{game.provider}</span>
                  <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] text-emerald-300">
                    RTP {game.rtp}
                  </span>
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300">
                  {game.tag}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.35),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
