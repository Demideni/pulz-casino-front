"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Game = {
  id: string;
  name: string;
  provider: string;
  category: "slot" | "crash" | "live" | string;
  rtp: number;
  volatility: "low" | "medium" | "high" | string;
  minBet: number;
  maxBet: number;
};

const GAMES: Game[] = [
  {
    id: "pulz-aviator",
    name: "Pulz Aviator",
    provider: "Spribe",
    category: "crash",
    rtp: 97.1,
    volatility: "high",
    minBet: 0.1,
    maxBet: 1000,
  },
  {
    id: "pulz-lightning-roulette",
    name: "Lightning Roulette",
    provider: "Evolution",
    category: "live",
    rtp: 97.3,
    volatility: "high",
    minBet: 0.5,
    maxBet: 5000,
  },
  {
    id: "pulz-gates-of-olympus",
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    category: "slot",
    rtp: 96.5,
    volatility: "high",
    minBet: 0.2,
    maxBet: 500,
  },
  {
    id: "pulz-sweet-bonanza",
    name: "Sweet Bonanza",
    provider: "Pragmatic Play",
    category: "slot",
    rtp: 96.5,
    volatility: "medium",
    minBet: 0.2,
    maxBet: 500,
  },
  {
    id: "pulz-blackjack",
    name: "Blackjack VIP",
    provider: "Evolution",
    category: "live",
    rtp: 99.5,
    volatility: "low",
    minBet: 5,
    maxBet: 10000,
  },
];

function formatVolatility(v: Game["volatility"]) {
  if (v === "low") return "Низкая";
  if (v === "medium") return "Средняя";
  if (v === "high") return "Высокая";
  return v;
}

function formatCategory(c: Game["category"]) {
  if (c === "slot") return "Слоты";
  if (c === "crash") return "Crash / Aviator";
  if (c === "live") return "Live";
  return c;
}

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [rtpFilter, setRtpFilter] = useState("all");

  const filtered = useMemo(() => {
    return GAMES.filter((g) => {
      const s = search.trim().toLowerCase();

      if (s && !g.name.toLowerCase().includes(s)) return false;

      if (providerFilter !== "all") {
        if (providerFilter === "pragmatic" && g.provider !== "Pragmatic Play")
          return false;
        if (providerFilter === "spribe" && g.provider !== "Spribe")
          return false;
        if (providerFilter === "evolution" && g.provider !== "Evolution")
          return false;
      }

      if (rtpFilter === "97" && g.rtp < 97) return false;
      if (rtpFilter === "96" && (g.rtp < 96 || g.rtp >= 97)) return false;
      if (rtpFilter === "below96" && g.rtp >= 96) return false;

      return true;
    });
  }, [search, providerFilter, rtpFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Каталог игр</h1>
          <p className="text-xs text-slate-400">
            Витрина лучших игр Pulz в дерзком красно-чёрном стиле. Отфильтруй и
            прыгай в игру.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск игры…"
            className="h-9 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:outline-none"
          />

          <select
            className="h-9 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 text-xs"
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
          >
            <option value="all">Все провайдеры</option>
            <option value="pragmatic">Pragmatic Play</option>
            <option value="spribe">Spribe</option>
            <option value="evolution">Evolution</option>
          </select>

          <select
            className="h-9 rounded-full border border-slate-700/80 bg-slate-900/70 px-3 text-xs"
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
            {/* Картинка/фон */}
            <div className="relative h-40 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-700/40 via-black to-slate-900" />
              <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-100">
                {g.name}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.55),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            {/* Инфо по игре */}
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
                  <span className="text-slate-100">
                    {g.rtp.toFixed(1)}%
                  </span>
                </span>

                <span>
                  Волатильность{" "}
                  <span className="text-slate-100">
                    {formatVolatility(g.volatility)}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Ставка от{" "}
                  <span className="text-slate-100">{g.minBet}$</span>
                </span>
                <span>
                  до{" "}
                  <span className="text-slate-100">{g.maxBet}$</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px] uppercase tracking-wide">
                <span className="rounded-full bg-red-600/90 px-3 py-1 text-[10px] font-semibold text-white group-hover:bg-red-500">
                  Играть
                </span>
                <span className="text-slate-500">
                  {formatCategory(g.category)}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-700/80 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
            Не нашли игру по заданным фильтрам. Попробуйте сбросить фильтры
            или изменить запрос.
          </div>
        )}
      </div>
    </div>
  );
}
