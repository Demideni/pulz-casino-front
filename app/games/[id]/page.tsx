// app/games/[id]/page.tsx
import Link from "next/link";

type Props = {
  params: { id: string };
};

const ROBINZON_URL = "https://robinson-game-1.onrender.com";

// Имена игр по id (для заголовка и future-игр)
const NAMES: Record<string, string> = {
  "robinzon-island": "RobinzON Island",
  robinson: "RobinzON Island",
  robinzON: "RobinzON Island",
};

// URL игр, которые уже реально интегрированы
const GAME_URLS: Record<string, string> = {
  "robinzon-island": ROBINZON_URL,
  robinson: ROBINZON_URL,
  robinzON: ROBINZON_URL,
};

export default function GameDetailsPage({ params }: Props) {
  const rawId = params.id;
  const id = rawId.toLowerCase();

  const name = NAMES[id] ?? "Игра Pulz";
  const gameUrl = GAME_URLS[id];

  // Если для игры ещё нет URL — показываем заглушку
  if (!gameUrl) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-slate-50">{name}</h1>
            <p className="text-sm text-slate-400">
              Интеграция этой игры ещё в разработке. Сейчас доступна только
              демо-страница.
            </p>
          </div>
          <Link
            href="/games"
            className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1.5 text-xs text-slate-200 hover:border-red-500 hover:text-white"
          >
            ← Назад к каталогу
          </Link>
        </div>

        <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-slate-800 bg-black">
          <p className="max-w-xs text-center text-sm text-slate-400">
            Интеграция этой игры ещё не подключена. Совсем скоро здесь будет
            полноценный запуск.
          </p>
        </div>
      </div>
    );
  }

  // FULLSCREEN-режим для игр с реальным URL
  return (
    <div className="fixed inset-0 z-40 bg-black">
      {/* сама игра на полный экран */}
      <iframe
        src={gameUrl}
        title={name}
        className="h-full w-full border-0"
        loading="lazy"
        allowFullScreen
      />

      {/* затемнение сверху + кнопка выхода */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />

      <Link
        href="/games"
        className="absolute left-4 top-5 rounded-full border border-slate-700 bg-black/70 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-red-500 hover:bg-black"
      >
        ← Выйти из игры
      </Link>
    </div>
  );
}
