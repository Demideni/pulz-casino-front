// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import BannerCarousel from "@/components/BannerCarousel";

const POPULAR_GAMES = [
  {
    id: "robinzon-island",
    name: "RobinZON Island",
    provider: "Pulz Originals",
    rtp: "97.2%",
    tag: "EXCLUSIVE",
    image: "/games/robinzon.png", // файл: public/games/robinzon.png
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 pb-6">
      {/* 1. Большой верхний баннер-карусель */}
      <section className="px-4">
        <BannerCarousel />
      </section>

      {/* 2. Два маленьких бонусных блока в одну линию */}
      <section className="px-4">
        <div className="flex gap-3">
          {/* Бонус без депозита */}
          <div className="flex-1 rounded-3xl border border-red-900/30 bg-gradient-to-br from-[#220811] via-[#0a0712] to-[#050509] p-4 shadow-[0_0_25px_rgba(15,23,42,0.9)]">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
              ДО 100 FS
            </div>
            <div className="text-sm font-semibold text-slate-50">
              Бонус без депозита
            </div>
            <p className="mt-1 text-[12px] text-slate-400">
              Фриспины за регистрацию.
            </p>
          </div>

          {/* Турбо-спины */}
          <div className="flex-1 rounded-3xl border border-fuchsia-900/30 bg-gradient-to-br from-[#18061b] via-[#080713] to-[#050509] p-4 shadow-[0_0_25px_rgba(15,23,42,0.9)]">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300">
              ЕЖЕДНЕВНО
            </div>
            <div className="text-sm font-semibold text-slate-50">
              Турбо-спины
            </div>
            <p className="mt-1 text-[12px] text-slate-400">
              Ежедневные миссии и гонки.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Популярные игры */}
      <section className="px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Популярные игры</h2>
          <Link
            href="/games"
            className="text-xs font-medium text-red-300 hover:text-red-200"
          >
            Все игры
          </Link>
        </div>

        {/* Горизонтальный скролл с карточками игр (только наша игра) */}
        <div className="-mx-4 overflow-x-auto px-4 pb-2">
          <div className="flex gap-3">
            {POPULAR_GAMES.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group relative min-w-[170px] max-w-[210px] flex-1 overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-[#050509] via-[#12030b] to-[#050509] p-0 shadow-[0_0_25px_rgba(15,23,42,0.8)] transition-all hover:border-red-500/70 hover:shadow-[0_0_35px_rgba(248,113,113,0.5)]"
              >
                {/* Картинка игры */}
                <div className="h-[110px] w-full overflow-hidden rounded-t-3xl">
                  <Image
                    src={game.image}
                    alt={game.name}
                    width={160}
                    height={220}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Нижний блок с инфой */}
                <div className="space-y-1 p-3 text-left">
                  <div className="text-sm font-semibold text-slate-50">
                    {game.name}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{game.provider}</span>
                    <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] text-emerald-300">
                      RTP {game.rtp}
                    </span>
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300">
                    {game.tag}
                  </div>
                </div>

                {/* Подсветка при ховере */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.35),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
