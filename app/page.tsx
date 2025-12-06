// app/page.tsx
import Link from "next/link";
import BannerCarousel from "@/components/BannerCarousel";

type PopularGame = {
  id: string;
  name: string;
  provider: string;
  rtp: string;
  tag: string;
};

const POPULAR_GAMES: PopularGame[] = [
  {
    id: "gates-of-olympus",
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    rtp: "96.5%",
    tag: "ТОП СЛОТ",
  },
  {
    id: "sweet-bonanza",
    name: "Sweet Bonanza",
    provider: "Pragmatic Play",
    rtp: "96.4%",
    tag: "ПОПУЛЯРНЫЙ",
  },
  {
    id: "robinzon",
    name: "RobinZON Island",
    provider: "Pulz Originals",
    rtp: "97.2%",
    tag: "EXCLUSIVE",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">

      {/* 1. Большой верхний баннер-карусель */}
      <section className="px-4">
        <BannerCarousel />
      </section>

      {/* 2. Маленькие бонусные блоки */}
      <section className="px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          
          {/* Первый блок */}
          <div className="min-w-[250px] rounded-3xl border border-red-900/30 bg-gradient-to-br from-[#220811] via-[#0a0712] to-[#050509] p-4 shadow-[0_0_25px_rgba(15,23,42,0.9)]">
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

          {/* Второй блок */}
          <div className="min-w-[250px] rounded-3xl border border-fuchsia-900/30 bg-gradient-to-br from-[#18061b] via-[#080713] to-[#050509] p-4 shadow-[0_0_25px_rgba(15,23,42,0.9)]">
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
        <h2 className="text-lg font-semibold mb-3">Популярные игры</h2>

        {/* Карточки игр */}
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
