"use client";

import { useState } from "react";
import Link from "next/link";

const categoryTabs = [
  { id: "all", label: "Все игры" },
  { id: "slots", label: "Слоты" },
  { id: "live", label: "Live-игры" },
  { id: "fast", label: "Быстрые игры" },
];

const bannerCards = [
  {
    id: "welcome",
    title: "Welcome bonus до 500%",
    subtitle: "Первый депозит с огненным бустом и фриспинами.",
    pill: "Welcome пакет",
    highlight: "+500% • до 5000 USD",
    gradientFrom: "#f97316",
    gradientTo: "#ef4444",
  },
  {
    id: "cashback",
    title: "Кэшбек каждый понедельник",
    subtitle: "Возвращаем часть проигрышей реальными деньгами.",
    pill: "Кэшбек",
    highlight: "до 25% обратно",
    gradientFrom: "#22c55e",
    gradientTo: "#0ea5e9",
  },
  {
    id: "turbo",
    title: "Турбо-спины в эксклюзивах",
    subtitle: "Повышенный RTP в играх Pulz Originals.",
    pill: "Pulz Originals",
    highlight: "RTP до 97.5%",
    gradientFrom: "#a855f7",
    gradientTo: "#ec4899",
  },
];

const topGames = [
  {
    id: "robinzon",
    name: "RobinZON Island",
    tag: "Pulz Originals",
    rtp: "97.2%",
    badge: "Новый",
  },
  {
    id: "gates",
    name: "Gates of Olympus",
    tag: "Pragmatic Play",
    rtp: "96.5%",
    badge: "Популярно",
  },
  {
    id: "mines",
    name: "Crypto Mines",
    tag: "Spribe",
    rtp: "97.0%",
    badge: "Хит",
  },
  {
    id: "aviator",
    name: "Aviator X",
    tag: "Spribe",
    rtp: "97.1%",
    badge: "Crash",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="space-y-8">
      {/* БАННЕРЫ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-50">
            Бонусы и акции Pulz
          </h1>
          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Demo • Без реальных денег
          </span>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {bannerCards.map((b) => (
            <div
              key={b.id}
              className="relative min-w-[82%] max-w-[82%] snap-start overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-r from-black via-[#05010a] to-black shadow-[0_0_40px_rgba(15,23,42,0.8)] md:min-w-[48%] md:max-w-[48%]"
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage: `radial-gradient(circle at 0% 0%, ${b.gradientFrom}40, transparent 60%), radial-gradient(circle at 100% 0%, ${b.gradientTo}40, transparent 60%)`,
                }}
              />
              <div className="relative flex h-full flex-col justify-between p-4 md:p-5">
                <div className="space-y-2">
                  <span className="inline-flex rounded-full bg-black/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-100">
                    {b.pill}
                  </span>
                  <h2 className="text-base font-semibold text-slate-50 md:text-lg">
                    {b.title}
                  </h2>
                  <p className="text-xs text-slate-200/80 md:text-sm">
                    {b.subtitle}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-amber-200">
                    {b.highlight}
                  </span>
                  <button className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_18px_rgba(248,113,113,0.9)] hover:bg-red-500">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ТАБЫ КАТЕГОРИЙ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-50">
            Каталог игр
          </h2>
          <Link
            href="/games"
            className="text-xs font-medium text-red-400 hover:text-red-300"
          >
            Открыть все игры
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {categoryTabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-red-600 text-white shadow-[0_0_16px_rgba(248,113,113,0.7)]"
                    : "bg-slate-900/70 text-slate-300 hover:bg-slate-800",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ТОП-ИГРЫ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-50">
            Топ-игры Pulz
          </h2>
          <span className="text-[11px] text-slate-500">
            Подключим реальные провайдеры позже
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topGames.map((g) => (
            <Link
              key={g.id}
              href={g.id === "robinzon" ? "/games/robinzon" : "/games"}
              className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-950 via-[#05010a] to-black shadow-[0_0_22px_rgba(15,23,42,0.9)] hover:border-red-500/70"
            >
              <div className="relative h-28 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.45),transparent_55%)]" />
                <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
                  <div>
                    <div className="mb-1 inline-flex rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
                      {g.tag}
                    </div>
                    <div className="text-sm font-semibold text-slate-50">
                      {g.name}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      RTP{" "}
                      <span className="text-emerald-300 font-semibold">
                        {g.rtp}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white shadow-[0_0_16px_rgba(248,113,113,0.9)]">
                    {g.badge}
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-800/70 bg-black/60 px-4 py-2.5 text-[11px] text-slate-400">
                Нажми, чтобы открыть демо-режим. Реальные ставки появятся после
                подключения платформы и лицензии.
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА ПЛАТФОРМЫ */}
      <section className="space-y-3 pb-4">
        <h2 className="text-base font-semibold text-slate-50">
          Почему Pulz
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/80 bg-black/60 p-4 text-xs text-slate-300">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
              Премиум-стиль
            </div>
            <p>
              Красно-чёрный интерфейс, эффекты свечения и акцент на
              эксклюзивных играх Pulz Originals.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-black/60 p-4 text-xs text-slate-300">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
              Честный RTP
            </div>
            <p>
              В демо-версии используем целевые RTP как у крупных провайдеров.
              Позже подключим реальные API SlotMatrix, Spribe, Pragmatic и др.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-black/60 p-4 text-xs text-slate-300">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">
              Мобильный фокус
            </div>
            <p>
              Дизайн заточен под смартфоны: нижний бар с Pulz Wheel, удобная
              навигация и быстрый доступ к играм.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
