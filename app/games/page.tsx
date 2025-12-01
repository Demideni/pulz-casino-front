// app/games/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Game = {
  id: string;
  name: string;
  provider: string;
  category: "slot" | "crash" | "live";
  rtp: number;
  volatility: "low" | "medium" | "high";
};

const GAMES: Game[] = [
  {
    id: "robinzon",
    name: "RobinZON Island",
    provider: "Pulz Originals",
    category: "crash",
    rtp: 97.2,
    volatility: "high",
  },
  {
    id: "gates-of-olympus",
    name: "Gates of Olympus (demo)",
    provider: "Pragmatic Play",
    category: "slot",
    rtp: 96.5,
    volatility: "high",
  },
  {
    id: "blackjack-vip",
    name: "Blackjack VIP (demo)",
    provider: "Evolution",
    category: "live",
    rtp: 99.2,
    volatility: "low",
  },
];

function formatVolatility(v: Game["volatility"]) {
  if (v === "low") return "Низкая";
  if (v === "medium") return "Средняя";
  return "Высокая";
}

export default function GamesPage() {
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [rtpFilter, setRtpFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const providers = useMemo(
    () => Array.from(new Set(GAMES.map((g) => g.provider))),
    []
  );

  const filtered = useMemo(
    () =>
      GAMES.filter((g) => {
        if (providerFilter !== "all" && g.provider !== providerFilter) {
          return false;
        }
        if (categoryFilter !== "all" && g.category !== categoryFilter) {
          return false;
        }
        if (rtpFilter === "97" && g.rtp < 97) return false;
        if (rtpFilter === "96" && (g.rtp < 96 || g.rtp >= 97)) return false;
        if (rtpFilter === "below96" && g.rtp >= 96) return false;
        return true;
      }),
    [providerFilter, rtpFilter, categoryFilter]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Каталог игр</h1>
          <p className="text-sm text-slate-400">
            Демонстрационный список игр. Робинзон — наша авторская игра.
          </p>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs"
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
          >
            <option value="all">Все провайдеры</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            <option value="slot">Слоты</option>
            <option value="crash">Crash / Aviator</option>
            <option value="live">Live</option>
          </select>

          <select
            className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs"
            value={rtpFilter}
            onChange={(e) => setRtpFilter(e.target.value)}
          >
            <option value="all">RTP: все</option>
            <option value="97">97%+</option>
            <option value="96">96–97%</option>
            <option value="below96">Меньше 96%</option>
          </select>
        </div>
      </header>

      {/* Сетка игр */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((g) => (
          <Link
            key={g.id}
            href={`/games/${g.id}`}
            className="group overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-black to-[#1a0207] shadow-[0_0_25px_rgba(15,23,42,0.8)] hover:border-red-500/80 hover:shadow-[0_0_45px_rgba(248,113,113,0.6)]"
          >
            <div className="relative h-40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-700/40 via-black to-slate-900" />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-100">
                {g.name}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.55),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-50">{g.name}</span>
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-400">
                  {g.provider}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  RTP{" "}
                  <span className="text-slate-100">{g.rtp.toFixed(1)}%</span>
                </span>
                <span>{formatVolatility(g.volatility)}</span>
              </div>

              <div className="pt-1 text-[11px] text-slate-500">
                Нажми, чтобы открыть игру
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
