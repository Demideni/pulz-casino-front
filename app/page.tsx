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
    image: "/games/robinzon.png",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-4 pb-4">

      {/* 1. Большой верхний баннер-карусель */}
      <section className="px-4">
        <div className="-mx-4">
          <BannerCarousel />
        </div>
      </section>

      {/* 2. Два маленьких бонусных блока */}
      <section className="px-4">
        <div className="flex gap-3">
          <div className="flex-1 rounded-3xl border border-blue-900/30 bg-gradient-to-br from-blue-900/30 to-blue-900/10 p-4">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400">
              ДО 100 FS
            </div>
            <div className="text-sm font-semibold text-slate-50">
              Бонус без депозита
            </div>
            <div className="mt-1 text-[12px] text-slate-400">
              Фриспины за регистрацию.
            </div>
          </div>

          <div className="flex-1 rounded-3xl border border-pink-900/30 bg-gradient-to-br from-pink-900/30 to-pink-900/10 p-4">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-pink-400">
              ЕЖЕДНЕВНО
            </div>
            <div className="text-sm font-semibold text-slate-50">
              Турбо-спины
            </div>
            <div className="mt-1 text-[12px] text-slate-400">
              Ежедневные миссии и гонки.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Популярные игры */}
      <section className="px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            Популярные игры
          </h2>
          <Link href="/games" className="text-sm text-blue-400">
            Все игры
          </Link>
        </div>

        <div className="mt-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {POPULAR_GAMES.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}`}
                className="group relative min-w-[80px] overflow-hidden rounded-xl bg-slate-900"
              >
                <Image
                  src={game.image}
                  alt={game.name}
                  width={200}
                  height={140}
                  className="h-[140px] w-full object-cover"
                />
                <div className="p-3">
                  <div className="text-sm font-semibold text-slate-50">{game.name}</div>
                  <div className="text-xs text-slate-400">{game.provider}</div>
                  <div className="text-[11px] text-blue-400">{game.rtp}</div>
                </div>

                {/* Tag */}
                <div className="absolute left-2 top-2 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                  {game.tag}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
