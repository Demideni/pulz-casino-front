"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Volatility = "low" | "medium" | "high";

type Game = {
  id: string;
  name: string;
  provider: string;
  rtp: number;
  volatility: Volatility;
  category: "slot" | "crash" | "live";
  isPulzOriginal?: boolean;
};

const games: Game[] = [
  {
    id: "robinzon",
    name: "RobinzON Island",
    provider: "Pulz Originals",
    rtp: 97.2,
    volatility: "medium",
    category: "slot",
    isPulzOriginal: true,
  },
  {
    id: "gates-of-olympus",
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    rtp: 96.5,
    volatility: "high",
    category: "slot",
  },
  {
    id: "sweet-bonanza",
    name: "Sweet Bonanza",
    provider: "Pragmatic Play",
    rtp: 96.5,
    volatility: "medium",
    category: "slot",
  },
  {
    id: "aviator",
    name: "Aviator",
    provider: "Spribe",
    rtp: 97.0,
    volatility: "high",
    category: "crash",
  },
  {
    id: "crazy-time",
    name: "Crazy Time",
    provider: "Evolution",
    rtp: 96.0,
    volatility: "medium",
    category: "live",
  },
];

function formatVolatility(v: Volatility) {
  if (v === "low") return "Низкая";
  if (v === "medium") return "Средняя";
  return "Высокая";
}

export default function GamesPage() {
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [rtpFilter, setRtpFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [openedGame, setOpenedGame] = useState<Game | null>(null);

  const providers = useMemo(
    () => Array.from(new Set(games.map((g) => g.provider))),
    []
  );

  const filtered = useMemo(() => {
    return games.filter((g) => {
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
    });
  }, [providerFilter, rtpFilter, categoryFilter]);

  return (
    <>
      {/* Шапка страницы */}
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">
              Каталог игр
            </h1>
            <p className="text-sm text-slate-400">
              Фильтры по провайдеру, RTP, волатильности и категории. Пока игры
              демо, позже подставим реальные API провайдеров.
            </p>
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Провайдер */}
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

            {/* RTP */}
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

            {/* Категория */}
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
          </div>
        </header>

        {/* Сетка игр */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setOpenedGame(g)}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-black to-[#1a0207] shadow-[0_0_25px_rgba(15,23,42,0.8)] hover:border-red-500/80 hover:shadow-[0_0_45px_rgba(248,113,113,0.6)]"
            >
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-700/40 via-black to-slate-900" />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-100">
                  {g.name}
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.55),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <div className="space-y-2 p-4 text-left">
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
                  <span>Волатильность: {formatVolatility(g.volatility)}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>
                    Категория{" "}
                    <span className="text-slate-100">
                      {g.category === "slot"
                        ? "Слот"
                        : g.category === "crash"
                        ? "Crash / Aviator"
                        : "Live"}
                    </span>
                  </span>
                  {g.isPulzOriginal && (
                    <span className="rounded-full bg-red-600/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Pulz Originals
                    </span>
                  )}
                </div>

                <div className="pt-1">
                  <span className="inline-flex items-center justify-center rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_0_18px_rgba(248,113,113,0.65)] group-hover:bg-red-500">
                    Открыть демо
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Фуллскрин-модалка с игрой */}
      {openedGame && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-sm">
          <div className="flex h-full flex-col md:mx-4 md:my-6 md:overflow-hidden md:rounded-3xl md:border md:border-slate-800 md:bg-gradient-to-b md:from-[#050509] md:via-black md:to-[#050509] md:shadow-[0_0_55px_rgba(0,0,0,1)]">
            {/* Header модалки */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 bg-black/70 px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-slate-50">
                    {openedGame.name}
                  </h2>
                  {openedGame.isPulzOriginal && (
                    <span className="rounded-full bg-red-600/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Pulz Originals
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Провайдер: {openedGame.provider} · RTP{" "}
                  {openedGame.rtp.toFixed(1)}% · Волатильность{" "}
                  {formatVolatility(openedGame.volatility)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenedGame(null)}
                className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 hover:border-red-500 hover:text-white"
              >
                Закрыть
              </button>
            </div>

            {/* Контент: iframe на весь экран */}
            <div className="flex-1 overflow-hidden bg-black">
              {openedGame.id === "robinzon" ? (
                <iframe
                  src="https://robinson-game-1.onrender.com"
                  title="RobinzON Island — Pulz Originals"
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.15),transparent_60%)]">
                  <p className="px-4 text-center text-sm text-slate-400">
                    Интеграция с провайдером для этой игры в процессе.
                    Сейчас доступен только макет.
                  </p>
                </div>
              )}
            </div>

            {/* Низ модалки */}
            <div className="border-t border-slate-800/80 bg-black/80 px-4 py-2 text-[10px] text-slate-500">
              Это демо-режим без реальных денег и лицензии. Для реальных ставок
              нужна полноценная платформа, лицензия и интеграция провайдеров
              (SlotMatrix, Spribe, Pragmatic и др.).
            </div>
          </div>
        </div>
      )}
    </>
  );
}
