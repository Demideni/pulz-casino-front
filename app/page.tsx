// app/page.tsx
import Link from "next/link";

const promoCards = [
  {
    title: "Welcome бонус",
    subtitle: "До 1000 USD на первые депозиты",
    badge: "Новый игрок",
  },
  {
    title: "Кэшбэк каждую неделю",
    subtitle: "Возврат части проигрыша реальными деньгами",
    badge: "Кэшбэк",
  },
  {
    title: "Pulz Wheel",
    subtitle: "Первый спин бесплатно для новых игроков",
    badge: "Pulz Originals",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8 pb-4">
      {/* Главный баннер */}
      <section className="pulz-gradient-bg relative overflow-hidden rounded-3xl border border-red-900/50 px-5 py-6 shadow-[0_0_50px_rgba(248,113,113,0.5)]">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 md:max-w-md">
            <div className="inline-flex items-center rounded-full bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-red-300">
              Demo • Pulz Platform
            </div>
            <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
              Добро пожаловать в Pulz
            </h1>
            <p className="text-sm text-slate-300">
              Витрина игр, бонусов и Pulz Wheel в нашем фирменном красно-чёрном
              стиле. Сейчас это демо-версия без реальных денег и лицензии.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/bonuses"
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_30px_rgba(248,113,113,0.8)] hover:bg-red-500"
              >
                Получить бонус
              </Link>
              <Link
                href="/games"
                className="rounded-full border border-slate-500/70 bg-black/50 px-5 py-2 text-xs font-medium text-slate-100 hover:border-slate-300 hover:bg-slate-900"
              >
                Все игры
              </Link>
            </div>
          </div>

          {/* Блок с демо-балансом справа */}
          <div className="mt-4 w-full max-w-xs rounded-2xl border border-slate-800/80 bg-black/70 p-4 text-xs text-slate-300 md:mt-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Pulz Demo Account
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Демо-режим
              </span>
            </div>
            <div className="mb-3 text-[11px] text-slate-400">Баланс демо</div>
            <div className="mb-4 text-2xl font-semibold text-slate-50">
              10 000.00 <span className="text-sm text-slate-400">USD</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <div>• Без КК и документов</div>
              <div>• Только для демонстрации платформы</div>
              <div>• Провайдеры: SlotMatrix, Spribe, Pragmatic и др. (план)</div>
            </div>
          </div>
        </div>

        {/* Лёгкое свечение в фоне */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-500/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl" />
      </section>

      {/* Промо-блоки, как карточки бонусов */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Акции и предложения
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {promoCards.map((card) => (
            <div
              key={card.title}
              className="overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#0b0205] via-[#12010b] to-[#02010b] p-4 shadow-[0_0_25px_rgba(15,23,42,0.9)]"
            >
              <div className="mb-2 inline-flex rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
                {card.badge}
              </div>
              <div className="mb-1 text-sm font-semibold text-slate-50">
                {card.title}
              </div>
              <p className="text-xs text-slate-400">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Быстрые ссылки вместо старого верхнего меню */}
      <section className="space-y-3 pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Быстрый доступ
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/games"
            className="rounded-full border border-slate-700/80 bg-black/60 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-300 hover:bg-slate-900"
          >
            Каталог игр
          </Link>
          <Link
            href="/cashier"
            className="rounded-full border border-slate-700/80 bg-black/60 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-300 hover:bg-slate-900"
          >
            Касса (демо)
          </Link>
          <Link
            href="/bonuses"
            className="rounded-full border border-slate-700/80 bg-black/60 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-300 hover:bg-slate-900"
          >
            Бонусы
          </Link>
        </div>
      </section>
    </div>
  );
}
