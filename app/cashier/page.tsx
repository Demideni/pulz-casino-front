import PulzShell from "@/components/PulzShell";

export default function CashierPage() {
  return (
    <PulzShell
      title="Демо‑касса Pulz"
      subtitle="Экран под интеграцию Stripe / крипто‑платёжек. Сейчас всё работает как мок‑симуляция."
    >
      <div className="grid gap-4 md:grid-cols-2 text-sm">
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">Пополнение</h2>
          <div className="space-y-2">
            <label className="text-xs text-slate-300">
              Сумма депозита (USD)
              <input
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-sm outline-none focus:border-pulzRed"
                placeholder="100"
              />
            </label>
            <label className="text-xs text-slate-300">
              Метод оплаты
              <select className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-sm outline-none focus:border-pulzRed">
                <option>Stripe — карта</option>
                <option>Crypto — USDT (TRC‑20)</option>
                <option>Crypto — BTC</option>
              </select>
            </label>
            <button className="mt-2 w-full rounded-full bg-pulzRed px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:brightness-110">
              Смоделировать депозит
            </button>
            <p className="text-[11px] text-slate-400">
              В демо‑версии транзакции никуда не отправляются. На бою здесь
              будет запрос к нашему бэкенду и провайдеру платежей.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">Вывод средств</h2>
          <div className="space-y-2">
            <label className="text-xs text-slate-300">
              Сумма вывода (USD)
              <input
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-sm outline-none focus:border-pulzRed"
                placeholder="250"
              />
            </label>
            <label className="text-xs text-slate-300">
              Реквизиты (demo)
              <input
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-sm outline-none focus:border-pulzRed"
                placeholder="USDT кошелёк / IBAN / карта"
              />
            </label>
            <button className="mt-2 w-full rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-black">
              Смоделировать вывод
            </button>
            <p className="text-[11px] text-slate-400">
              Можно показать инвесторам полный UX без подключения настоящего
              платёжного провайдера.
            </p>
          </div>
        </div>
      </div>
    </PulzShell>
  );
}
