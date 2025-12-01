import Link from "next/link";
import PulzShell from "@/components/PulzShell";

export default function HomePage() {
  return (
    <PulzShell
      title="Премиум‑казино Pulz"
      subtitle="Витрина игр, демо‑касса и бонусы в фирменном дерзком красно‑чёрном стиле. Всё работает в демо‑режиме для презентации."
    >
      <div className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        <div className="space-y-4">
          <p className="text-sm text-slate-200">
            Начни с раздела{" "}
            <Link
              href="/games"
              className="font-semibold text-pulzRed hover:underline"
            >
              «Игры»
            </Link>
            : там каталог слотов, crash‑игр и live‑казино. Любую игру можно
            открыть в демо‑режиме.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/games"
              className="rounded-full bg-pulzRed px-4 py-2 text-sm font-semibold text-white shadow-[0_0_25px_rgba(248,113,113,0.8)] hover:brightness-110"
            >
              Перейти к играм
            </Link>
            <Link
              href="/cashier"
              className="rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm text-slate-100 hover:bg-black"
            >
              Демо‑касса
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-pulzRed/25 to-black/80 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                Игры
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Слоты, crash, live‑казино
              </p>
              <p className="mt-1 text-[11px] text-slate-300">
                Каталог с фильтрами по провайдерам, RTP и волатильности.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/70 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                Бонусы
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Многоуровневый welcome‑пак
              </p>
              <p className="mt-1 text-[11px] text-slate-300">
                Демо‑страница промо‑акций и кэшбэка.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/70 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                Касса
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Пополнение и вывод (demo)
              </p>
              <p className="mt-1 text-[11px] text-slate-300">
                Мок‑интеграция под Stripe / крипто‑провайдеры.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/40 via-black/80 to-black/95 p-4 text-xs">
          <p className="mb-2 font-semibold text-slate-100">Демо‑игра</p>
          <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,_#ef4444,_transparent_60%),radial-gradient(circle_at_bottom,_#22d3ee,_transparent_60%)]">
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-black/40 text-center">
              <p className="text-sm font-semibold text-white">
                AviaPulz — crash‑демо
              </p>
              <p className="max-w-xs text-[11px] text-slate-200">
                Здесь в проде будет iframe от провайдера (Spribe, SmartSoft и
                др.). Сейчас — статичный мок для презентации.
              </p>
            </div>
          </div>
          <ul className="mt-3 space-y-1 text-[11px] text-slate-300">
            <li>• Чистая фронтенд‑демка без реальных ставок.</li>
            <li>• Можно безопасно показывать инвесторам и партнёрам.</li>
            <li>• Бэкенд можно подключить позже к нашему WynixBet‑core.</li>
          </ul>
        </div>
      </div>
    </PulzShell>
  );
}
