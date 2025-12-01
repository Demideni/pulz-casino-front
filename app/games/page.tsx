// app/games/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

// временно, если у тебя уже есть общий список — подключи его оттуда
const GAMES = [
  {
    id: "robinzon",
    name: "RobinzON Island",
    provider: "Pulz Originals",
    rtp: 97.8,
    volatility: "Высокая",
    description:
      "Эксклюзивная краш-игра Pulz. Робинзон летит над океаном, собирает бонусы, избегает падения в воду и пытается приземлиться на остров.",
    launchUrl: "https://ТВОЙ-РОБИНЗОН-URL",
    type: "external" as const,
  },
  // ...сюда добавь остальные игры из каталога
];

type Game = (typeof GAMES)[number];

export default function GamePage({ params }: { params: { id: string } }) {
  const game = GAMES.find((g) => g.id === params.id);

  if (!game) return notFound();

  const isRobinzON = game.id === "robinzon";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            {game.name}
          </h1>
          <p className="text-sm text-slate-400">
            Провайдер:{" "}
            <span className="text-slate-100">{game.provider}</span>
          </p>
          {game.rtp && (
            <p className="text-sm text-slate-400">
              RTP:{" "}
              <span className="text-slate-100">
                {game.rtp.toFixed(1)}%
              </span>
            </p>
          )}
        </div>

        <Link
          href="/games"
          className="text-xs text-slate-400 hover:text-slate-100"
        >
          ← Назад к играм
        </Link>
      </div>

      {/* Особый блок для Робинзона */}
      {isRobinzON ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-red-900/50 bg-gradient-to-br from-[#140108] via-black to-[#05060b] p-4 shadow-[0_0_35px_rgba(248,113,113,0.35)]">
            <h2 className="mb-2 text-sm font-semibold text-red-300">
              Эксклюзив Pulz Originals
            </h2>
            <p className="text-sm text-slate-300">
              Робинзон летит над океаном, собирает множители и бонусы.
              Если он падает в море — ставка сгорает. Если приземляется на
              остров — игрок забирает выигрыш.
            </p>
          </div>

          <div className="aspect-video overflow-hidden rounded-3xl border border-slate-800 bg-black">
            {/* https://robinson-game-1.onrender.com */}
            <iframe
              src={game.launchUrl}
              className="h-full w-full border-0"
              allowFullScreen
            />
          </div>

          <div className="grid gap-3 text-xs text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3">
              <div className="text-slate-400">RTP</div>
              <div className="text-lg font-semibold text-slate-50">
                {game.rtp?.toFixed(1)}%
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3">
              <div className="text-slate-400">Волатильность</div>
              <div className="text-sm font-semibold text-slate-50">
                {game.volatility ?? "Высокая"}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-3">
              <div className="text-slate-400">Тип игры</div>
              <div className="text-sm font-semibold text-slate-50">
                Эксклюзив Pulz Originals
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Остальные игры — обычный шаблон
        <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
          <p className="text-sm text-slate-300">
            Здесь будет iframe/загрузка слота от провайдера для игры{" "}
            <span className="font-semibold">{game.name}</span>.
          </p>
        </div>
      )}
    </div>
  );
}
