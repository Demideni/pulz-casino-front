"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
const TOP_BANNERS = [
  "/banners/welcome-500.png",
  "/banners/cashback.png",
  "/banners/vip.png",
];


type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaLabel: string;
  bg: string;
};

const HERO_BANNERS: HeroBanner[] = [
  {
    id: "welcome",
    title: "Welcome-бонус до 500%",
    subtitle: "Пакет на первые депозиты + фриспины в эксклюзивных слотах Pulz.",
    badge: "Новый игрок",
    ctaLabel: "Забрать бонус",
    bg: "from-[#1b0508] via-[#3b060b] to-[#09030b]",
  },
  {
    id: "cashback",
    title: "Кэшбек каждую неделю",
    subtitle: "До 15% возврата реальными деньгами без отыгрыша.",
    badge: "Cashback",
    ctaLabel: "Узнать детали",
    bg: "from-[#050814] via-[#071729] to-[#050814]",
  },
  {
    id: "pulzwheel",
    title: "PULZ WHEEL • первый спин — бесплатно",
    subtitle: "Крути колесо и забирай фриспины или бонус к депозиту.",
    badge: "Pulz Originals",
    ctaLabel: "Крутить колесо",
    bg: "from-[#16050b] via-[#3a0410] to-[#050509]",
  },
];

const BONUS_TILES = [
  {
    id: "nodep",
    title: "Бонус без депозита",
    description: "Фриспины за регистрацию.",
    accent: "до 100 FS",
  },
  {
    id: "turbospins",
    title: "Турбо-спины",
    description: "Ежедневные миссии и гонки.",
    accent: "ежедневно",
  },
  {
    id: "reload",
    title: "Релоад-бонусы",
    description: "Бонусы на каждое пополнение.",
    accent: "каждый депозит",
  },
  {
    id: "vip",
    title: "VIP-уровни",
    description: "Личные менеджеры и повышенный кешбек.",
    accent: "VIP",
  },
];

// упрощённый список «топ игр» для главной
const FEATURED_GAMES = [
  {
    id: "gates-of-olympus",
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    rtp: "96.5%",
    tag: "Хит",
  },
  {
    id: "sweet-bonanza",
    name: "Sweet Bonanza",
    provider: "Pragmatic Play",
    rtp: "96.5%",
    tag: "Популярная",
  },
  {
    id: "robinzon-island",
    name: "RobinzON Island",
    provider: "Pulz Originals",
    rtp: "97.2%",
    tag: "Pulz Originals",
  },
  {
    id: "book-of-gods",
    name: "Book of Gods",
    provider: "Hacksaw",
    rtp: "96.3%",
    tag: "Топ выбор",
  },
];

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % HERO_BANNERS.length),
      7000
    );
    return () => clearInterval(timer);
  }, []);

  const activeBanner = HERO_BANNERS[activeIndex];

  return (
    <div className="space-y-6 pb-28">
      {/* HERO-БАННЕР */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-black/60 pulz-hero-shadow">
        <div
          className={`relative flex h-[210px] w-full items-center justify-between overflow-hidden bg-gradient-to-r ${activeBanner.bg}`}
        >
          {/* ЛЕВАЯ ЧАСТЬ */}
          <div className="z-10 flex h-full flex-1 flex-col justify-center px-4 sm:px-6">
            {activeBanner.badge && (
              <span className="mb-2 inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-red-300">
                {activeBanner.badge}
              </span>
            )}
            <h1 className="mb-2 text-xl font-semibold text-slate-50 sm:text-2xl">
              {activeBanner.title}
            </h1>
            <p className="mb-4 max-w-md text-xs text-slate-300 sm:text-sm">
              {activeBanner.subtitle}
            </p>
            <button className="inline-flex w-max items-center justify-center rounded-full bg-red-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] hover:bg-red-500">
              {activeBanner.ctaLabel}
            </button>
          </div>

          {/* ПРАВАЯ ЧАСТЬ – ЧИП/КОЛЕСО */}
          <div className="pointer-events-none relative hidden h-full flex-1 items-center justify-center md:flex">
            <div className="pulz-hero-orbit" />
            <div className="pulz-hero-orbit pulz-hero-orbit-2" />
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-[#ffedd5] via-[#f97373] to-[#7f1d1d] shadow-[0_0_45px_rgba(248,113,113,0.8)]">
              <div className="absolute inset-2 rounded-full border border-amber-200/70" />
              <div className="absolute inset-5 rounded-full bg-black/70 backdrop-blur" />
              <span className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100">
                Pulz
                <span className="mx-1 text-red-400">•</span>
                Bonus
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.65),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.4),transparent_55%)] opacity-70 mix-blend-screen" />
        </div>

        {/* ТОЧКИ-ИНДИКАТОРЫ */}
        <div className="flex items-center justify-center gap-1.5 px-4 pb-3 pt-2">
          {HERO_BANNERS.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-7 bg-red-400"
                  : "w-2.5 bg-slate-600"
              }`}
              aria-label={`Баннер ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* БОНУС-КАРТОЧКИ — только два блока */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-2">
        {BONUS_TILES.slice(0, 2).map((tile) => (
          <div
            key={tile.id}
            className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#09030d] via-[#130514] to-[#050509] p-3 text-xs shadow-[0_0_30px_rgba(15,23,42,0.85)]"
          >
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-300">
              {tile.accent}
            </div>
            <div className="mb-1 text-[13px] font-semibold text-slate-50">
              {tile.title}
            </div>
            <div className="text-[11px] text-slate-400">{tile.description}</div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.35),transparent_55%)] opacity-70" />
          </div>
        ))}
      </section>


      {/* ПОПУЛЯРНЫЕ ИГРЫ НА ГЛАВНОЙ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-50">
            Популярные игры
          </h2>
          <Link
            href="/games"
            className="text-[11px] font-semibold text-red-400 hover:text-red-300"
          >
            Все игры
          </Link>
        </div>
              {/* TOP баннеры, как у JetTon */}
      <div className="-mx-4 mb-6 px-4">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto">
          {TOP_BANNERS.map((src, index) => (
            <div
              key={index}
              className="snap-center min-w-full"
            >
              <img
                src={src}
                alt={`Pulz promo ${index + 1}`}
                className="h-[190px] w-full rounded-3xl object-cover shadow-[0_0_40px_rgba(248,113,113,0.4)]"
              />
            </div>
          ))}
        </div>
      </div>


        {/* горизонтальный скролл, как на JetTon */}
        <div className="-mx-4 overflow-x-auto px-4">
          <div className="flex gap-3">
            {FEATURED_GAMES.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
                className="group relative min-w-[160px] flex-1 max-w-[200px] overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#050509] via-[#12030b] to-[#050509] p-3 shadow-[0_0_25px_rgba(15,23,42,0.8)]"
              >
                <div className="mb-2 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-black text-xs text-slate-200 group-hover:from-red-900/40 group-hover:via-black group-hover:to-slate-900">
                  <span className="max-w-[90%] text-center font-semibold">
                    {game.name}
                  </span>
                </div>
                <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{game.provider}</span>
                  <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] text-emerald-300">
                    RTP {game.rtp}
                  </span>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300">
                  {game.tag}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(248,113,113,0.35),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
