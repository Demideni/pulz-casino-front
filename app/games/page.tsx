"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Game } from "../api/games/route";

const volatilityLabel: Record<Game["volatility"], string> = {
  low: "Низкая",
  medium: "Средняя",
  high: "Высокая",
};

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [query, setQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [volatilityFilter, setVolatilityFilter] = useState<string>("all");
  const [rtpFilter, setRtpFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/games");
      const data = (await res.json()) as Game[];
      setGames(data);
    })();
  }, []);

  const providers = useMemo(
    () => Array.from(new Set(games.map((g) => g.provider))).sort(),
    [games],
  );

  const filtered = useMemo(
    () =>
      games.filter((g) => {
        if (
          query &&
          !g.name.toLowerCase().includes(query.toLowerCase()) &&
          !g.provider.toLowerCase().includes(query.toLowerCase())
        )
          return false;

        if (providerFilter !== "all" && g.provider !== providerFilter)
          return false;
        if (categoryFilter !== "all" && g.category !== categoryFilter)
          return false;
        if (volatilityFilter !== "all" && g.volatility !== volatilityFilter)
          return false;

        if (rtpFilter === "97" && g.rtp < 97) return false;
        if (rtpFilter === "96" && (g.rtp < 96 || g.rtp >= 97)) return false;
        if (rtpFilter === "below96" && g.rtp >= 96) return false;

        return true;
      }),
    [games, query, providerFilter, categoryFilter, volatilityFilter, rtpFilter],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Каталог игр</h1>
          <p className="text-xs text-slate-400">
            Демо-каталог. Фильтры работают, позже сюда подставим реальные API
            провайдеров.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="grid gap-3 rounded-2xl border border-slate-800/80 bg-black/60 p-4 text-xs md:grid-cols-[2fr,repeat(4,1fr)]">
        <input
          placeholder="Поиск по названию или провайдеру…"
          className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

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
          <option value="slots">Слоты</option>
          <option value="crash">Crash/Авиатор</option>
          <option value="live">Live</option>
          <option value="table">Столы</option>
        </select>

        <select
          className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-2 text-xs"
          value={volatilityFilter}
          onChange={(e) => setVolatilityFilter(e.target.value)}
        >
          <option value="all">Волатильность</option>
          <option value="low">Низкая</option>
          <option value="medium">Средняя</option>
          <option value="high">Высокая</option>
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

      {/* Games grid */}
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
                <span className="font-semibold text-slate-50">
                  {g.name}
                </span>
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
