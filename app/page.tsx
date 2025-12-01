// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="grid gap-8 md:grid-cols-[3fr,2fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-red-400/80">
            Премиум-казино
          </p>
          <h1 className="mb-4 text-3xl font-semibold leading-tight text-slate-50 md:text-4xl">
            Премиум-казино{" "}
            <span className="text-red-500 drop-shadow-[0_0_40px_rgba(248,113,113,0.8)]">
              Pulz
            </span>
          </h1>
          <p className="mb-6 max-w-xl text-sm text-slate-300">
            Витрина игр с фильтрами как у SlotMatrix — но в нашем дерзком
            красно-чёрном стиле. Сейчас это демо-версия для команды и партнёров:
            без реальных денег и лицензии.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/games"
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(239,68,68,0.7)] hover:bg-red-500"
            >
              Перейти в игры
            </Link>
            <Link
              href="/bonuses"
              className="rounded-full border border-red-500/60 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/20"
            >
              Посмотреть бонусы
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
            <div>
              <div className="text-slate-200">2000+</div>
              игр в каталоге (по плану)
            </div>
            <div>
              <div className="text-slate-200">97%+</div>
              целевой RTP на эксклюзивы
            </div>
            <div>
              <div className="text-slate-200">24/7</div>
              поддержка после запуска
            </div>
          </div>
        </div>

        {/* Hero card */}
        <div className="relative rounded-3xl border border-red-900/60 bg-gradient-to-br from-[#1a0308] via-[#050509] to-black p-[1px] shadow-[0_0_60px_rgba(248,113,113,0.45)]">
          <div className="h-full rounded-3xl bg-gradient-to-br from-black/90 via-[#15020a]/90 to-black/90 p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Pulz Demo Account
              </div>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-400">
                Демо-режим
              </span>
            </div>

            <div className="mb-6 rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-900/60 via-black to-slate-950/80 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">Баланс демо</span>
                <span className="text-[11px] text-slate-500">USD</span>
              </div>
              <div className="mb-4 text-2xl font-semibold text-slate-50">
                10 000.00
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-red-200">
                  Демо-деньги
                </span>
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-slate-300">
                  Без КК и документов
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Статус лицензии</span>
                <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[11px] text-yellow-300">
                  В процессе
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Интеграция провайдеров</span>
                <span className="text-slate-200">SlotMatrix, Spribe, Pragmatic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Быстрые ссылки */}
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          href="/games"
          className="group rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-950/70 via-black to-[#14020a] p-4 hover:border-red-500/70 hover:shadow-[0_0_35px_rgba(248,113,113,0.5)]"
        >
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
            Каталог игр
          </div>
          <div className="mb-1 text-sm font-semibold text-slate-100">
            Фильтры как у SlotMatrix
          </div>
          <p className="text-xs text-slate-400">
            Провайдер, RTP, волатильность, категория. Пока игры демо, позже
            подставим реальные API провайдеров.
          </p>
        </Link>

        <Link
          href="/cashier"
          className="group rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-950/70 via-black to-[#020712] p-4 hover:border-red-500/70 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]"
        >
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Касса
          </div>
          <div className="mb-1 text-sm font-semibold text-slate-100">
            Депозиты / вывод (макет)
          </div>
          <p className="text-xs text-slate-400">
            Чистый UX под Stripe / крипту / локальные методы. Сейчас всё на
            мок-данных.
          </p>
        </Link>

        <Link
          href="/bonuses"
          className="group rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-950/70 via-black to-[#16030f] p-4 hover:border-red-500/70 hover:shadow-[0_0_35px_rgba(234,179,8,0.5)]"
        >
          <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Бонусы
          </div>
          <div className="mb-1 text-sm font-semibold text-slate-100">
            Welcome, кэшбек, турбо-спины
          </div>
          <p className="text-xs text-slate-400">
            Можем настроить любой бонусный движок: от простых фриспинов до
            миссий и баттлов.
          </p>
        </Link>
      </section>
    </div>
  );
}
