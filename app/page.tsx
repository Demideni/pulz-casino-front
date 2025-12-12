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

{/* 2. Два промо-баннера под каруселью */}
<section className="px-4">
  <div className="flex gap-3">

    {/* Баннер: Join Pulz Free Spins */}
    <div className="flex-1 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80">
      <Image
        src="/banners/join-pulz-free-spins.png"
        alt="Join Pulz — Free Spins"
        width={640}
        height={360}
        className="h-full w-full object-cover"
        priority
      />
    </div>

    {/* Баннер: Feel the Pulse */}
    <div className="flex-1 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80">
      <Image
        src="/banners/hero-feel-the-pulse.png"
        alt="Feel the Pulse. Win Bigger."
        width={640}
        height={360}
        className="h-full w-full object-cover"
      />
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
  href={`/games/${game.id}`}
  className="group relative w-[100px] overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/70 hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]"
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
