"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PulzShell from "@/components/PulzShell";

type GameCategory = "slot" | "crash" | "live";
type Volatility = "low" | "medium" | "high";

type Game = {
  id: string;
  name: string;
  provider: string;
  category: GameCategory;
  rtp: number;
  volatility: Volatility;
};

const GAMES: Game[] = [
  {
    id: "clover-clover",
    name: "Clover Clover",
    provider: "Fantasma",
    category: "slot",
    rtp: 96.5,
    volatility: "medium"
  },
  {
    id: "kongo-bongo",
    name: "Kongo Bongo",
    provider: "Powderkeg",
    category: "slot",
    rtp: 96.9,
    volatility: "high"
  },
  {
    id: "rage-bait",
    name: "Rage Bait",
    provider: "Powderkeg",
    category: "slot",
    rtp: 97.2,
    volatility: "high"
  },
  {
    id: "aviapulz",
    name: "AviaPulz Crash",
    provider: "Spribe‑style",
    category: "crash",
    rtp: 97.8,
    volatility: "high"
  },
  {
    id: "pulz-roulette",
    name: "Pulz Roulette",
    provider: "Live Demo",
    category: "live",
    rtp: 97.3,
    volatility: "medium"
  }
];

export default function GamesPage() {
  const [category, setCategory] = useState<GameCategory | "all">("all");
  const [provider, setProvider] = useState<string>("all");

  const providers = useMemo(
    () => Array.from(new Set(GAMES.map((g) => g.provider))),
    []
  );

  const filtered = useMemo(
    () =>
      GAMES.filter((g) => {
        if (category !== "all" && g.category !== category) return false;
        if (provider !== "all" && g.provider !== provider) return false;
        return true;
      }),
    [category, provider]
  );

  return (
    <PulzShell
      title="Каталог игр Pulz"
      subtitle="Слоты, crash‑игры и live‑казино. Все игры открываются в безопасном демо‑режиме через iframe."
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all" as const, label: "Все" },
            { key: "slot" as const, label: "Слоты" },
            { key: "crash" as const, label: "Crash / Aviator" },
            { key: "live" as const, label: "Live" }
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setCategory(btn.key)}
              className={
                "rounded-full px-3 py-1 transition " +
                (category === btn.key
                  ? "bg-pulzRed text-white shadow-[0_0_20px_rgba(248,113,113,0.8)]"
                  : "bg-black/60 text-slate-200 hover:bg-black")
              }
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Провайдер:</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="rounded-full border border-white/20 bg-black/80 px-3 py-1 text-xs text-slate-100"
          >
            <option value="all">Все</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group flex h-44 flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black via-black/80 to-slate-950 text-left transition hover:-translate-y-1 hover:border-pulzRed/80"
          >
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ef4444,_transparent_55%),radial-gradient(circle_at_bottom,_#22d3ee,_transparent_55%)] opacity-70 transition group-hover:opacity-100" />
              <div className="relative flex h-full items-end p-3">
                <p className="max-w-[80%] text-sm font-semibold text-white drop-shadow">
                  {game.name}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-black/80 px-3 py-2 text-[11px] text-slate-200">
              <div>
                <p className="font-medium text-slate-100">{game.provider}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  {formatCategory(game.category)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-emerald-400">
                  RTP {game.rtp.toFixed(1)}%
                </p>
                <p className="text-[10px] text-slate-400">
                  Волатильность: {formatVolatility(game.volatility)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PulzShell>
  );
}

function formatCategory(c: GameCategory): string {
  if (c === "slot") return "Слот";
  if (c === "crash") return "Crash / Aviator";
  return "Live";
}

function formatVolatility(v: Volatility): string {
  if (v === "low") return "низкая";
  if (v === "medium") return "средняя";
  return "высокая";
}
