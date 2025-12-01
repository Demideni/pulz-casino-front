// app/games/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";

type GameDetails = {
  id: string;
  name: string;
  provider: string;
  description: string;
  iframeSrc?: string;
};

const GAMES: GameDetails[] = [
  {
    id: "robinzon",
    name: "RobinZON Island",
    provider: "Pulz Originals",
    description:
      "Авторская краш-игра: Робинзон летит над океаном, собирает бонусы и должен приземлиться на остров.",
    iframeSrc: "https://robinson-game-1.onrender.com",
  },
  {
    id: "gates-of-olympus",
    name: "Gates of Olympus (demo)",
    provider: "Pragmatic Play",
    description: "Демо-слот. Здесь пока только заглушка без встроенной игры.",
  },
  {
    id: "blackjack-vip",
    name: "Blackjack VIP (demo)",
    provider: "Evolution",
    description: "Демо-стол Blackjack. Пока без реального live-потока.",
  },
];

export default function GamePage({
  params,
}: {
  params: { id: string };
}) {
  const game = GAMES.find((g) => g.id === params.id);

  if (!game) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-red-400">
            Игровой демо-режим
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">
            {game.name}
          </h1>
          <p className="text-sm text-slate-400">
            Провайдер: {game.provider}
          </p>
        </div>

        <Link
          href="/games"
          className="mt-2 rounded-full border border-slate-700/70 px-4 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:text-slate-100"
        >
          ← Назад к каталогу
        </Link>
      </header>

      {game.iframeSrc ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-400">
            {game.description}
          </p>
          <div className="aspect-[9/16] w-full overflow-hidden rounded-3xl border border-slate-800 bg-black">
            <iframe
              src={game.iframeSrc}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">
          Эта игра пока добавлена как заглушка. После интеграции провайдера
          здесь будет реальное игровое окно.
        </div>
      )}
    </div>
  );
}
