// app/games/[id]/page.tsx
import Link from "next/link";

type Props = {
  params: { id: string };
};

const ROBINZON_URL = "https://robinson-game-1.onrender.com";

const NAMES: Record<string, string> = {
  "robinzon-island": "RobinzON Island",
  robinson: "RobinzON Island",
  robinzon: "RobinzON Island",
  "gates-of-olympus": "Gates of Olympus",
};

export default function GameDetailsPage({ params }: Props) {
  const id = params.id;
  const normalized = id.toLowerCase();

  const name = NAMES[normalized] ?? "Игра Pulz";

  // Считаем Робинзона и по "robinzon-island", и по "robinzon"
  const isRobinzON =
    normalized === "robinzon-island" || normalized === "robinzon";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">{name}</h1>
          <p className="text-sm text-slate-400">
            Демо-страница игры. Для production-версии нужна интеграция с
            провайдерами и лицензия.
          </p>
        </div>
        <Link
          href="/games"
          className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs text-slate-200 hover:border-red-500 hover:text-white"
        >
          ← Назад к каталогу
        </Link>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black">
        {isRobinzON ? (
          <iframe
            src={ROBINZON_URL}
            title="RobinzON Island — Pulz Originals"
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.15),transparent_60%)]">
            <p className="text-sm text-slate-400">
              Интеграция этой игры ещё в разработке. Сейчас используется только
              лендинг и демо-логика.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
