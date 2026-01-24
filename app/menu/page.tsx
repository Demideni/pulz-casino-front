// app/menu/page.tsx
export const metadata = {
  title: "Меню — Pulz Casino",
};

export default function MenuPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-blue-400">
          Pulz menu
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-50">
          Меню игрока
        </h1>
        <p className="text-sm text-slate-400">
          Быстрый доступ к разделам платформы и настройкам аккаунта.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-black/60 p-4">
        <a
          href="/games"
          className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3 text-sm text-slate-100 hover:bg-slate-800"
        >
          <span>Каталог игр</span>
          <span className="text-[11px] text-slate-400">RTP, провайдеры</span>
        </a>
        <a
          href="/bonuses"
          className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3 text-sm text-slate-100 hover:bg-slate-800"
        >
          <span>Бонусы и акции</span>
          <span className="text-[11px] text-slate-400">Pulz Wheel, кешбэк</span>
        </a>
        <a
          href="/cashier"
          className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3 text-sm text-slate-100 hover:bg-slate-800"
        >
          <span>Касса</span>
          <span className="text-[11px] text-slate-400">Депозит / вывод</span>
        </a>
</div>
    </div>
  );
}
