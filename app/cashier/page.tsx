// app/cashier/page.tsx
import Image from "next/image";

const METHODS = [
  {
    id: "btc",
    name: "Bitcoin",
    code: "BTC",
    network: "Bitcoin",
    icon: "/crypto/btc.png", // добавь /public/crypto/btc.png
    tag: "Рекомендуем",
  },
  {
    id: "eth",
    name: "Ethereum",
    code: "ETH",
    network: "ERC-20",
    icon: "/crypto/eth.png",
    tag: "Популярно",
  },
  {
    id: "usdt",
    name: "Tether",
    code: "USDT",
    network: "TRC-20",
    icon: "/crypto/usdt.png",
    tag: "Низкие комиссии",
  },
  {
    id: "ltc",
    name: "Litecoin",
    code: "LTC",
    network: "Litecoin",
    icon: "/crypto/ltc.png",
    tag: "",
  },
];

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

export default function CashierPage() {
  return (
    <div className="space-y-6 px-4 pb-6 pt-2">
      {/* Заголовок + баланс */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Касса Pulz
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Пополняй баланс через крипту в неоновом стиле Pulz. Мгновенные депозиты, честные лимиты.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 shadow-[0_0_30px_rgba(15,23,42,0.9)]">
          <div className="flex flex-col text-[11px] uppercase tracking-[0.2em] text-slate-400">
            <span>Текущий баланс</span>
            <span className="mt-1 text-lg font-semibold text-slate-50 tracking-normal">
              0.0000 BTC
            </span>
          </div>
          <div className="ml-3 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
            DEMO
          </div>
        </div>
      </header>

      {/* Табы: Deposit / Withdraw / History */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <button
          className="
            rounded-full bg-blue-600 px-4 py-1.5
            text-[11px] uppercase tracking-[0.2em]
            text-slate-50 shadow-[0_0_24px_rgba(37,99,235,0.9)]
          "
        >
          Deposit
        </button>
        <button
          className="
            rounded-full border border-slate-700/80
            bg-slate-900/60 px-4 py-1.5
            text-[11px] uppercase tracking-[0.2em]
            text-slate-400 hover:border-slate-500 hover:text-slate-100
            transition-colors
          "
        >
          Withdraw
        </button>
        <button
          className="
            rounded-full border border-slate-800
            bg-slate-950/70 px-4 py-1.5
            text-[11px] uppercase tracking-[0.2em]
            text-slate-500 hover:border-slate-600 hover:text-slate-100
            transition-colors
          "
        >
          History
        </button>
      </div>

      {/* Основной блок: слева методы, справа форма депозита */}
      <section className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Список методов */}
        <div className="space-y-3 rounded-3xl border border-slate-800/80 bg-slate-950/80 p-3 shadow-[0_0_35px_rgba(15,23,42,0.85)]">
          <div className="mb-1 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Способ оплаты
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Выбери криптовалюту для депозита.
              </p>
            </div>
            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
              Crypto
            </span>
          </div>

          <div className="space-y-2">
            {METHODS.map((m, index) => (
              <button
                key={m.id}
                className={`
                  group flex w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5 text-left
                  transition-all
                  ${
                    index === 0
                      ? "border-blue-500/70 bg-blue-500/10 shadow-[0_0_26px_rgba(37,99,235,0.8)]"
                      : "border-slate-700/80 bg-slate-900/70 hover:border-blue-500/70 hover:bg-blue-500/5"
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-700/70 bg-slate-900/90">
                    <Image
                      src={m.icon}
                      alt={m.name}
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-50">
                      {m.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {m.code} • {m.network}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {m.tag ? (
                    <span
                      className={`
                        rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em]
                        ${
                          index === 0
                            ? "border-blue-400/70 bg-blue-500/15 text-blue-200"
                            : "border-slate-600/70 bg-slate-900/90 text-slate-300"
                        }
                      `}
                    >
                      {m.tag}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">
                      Мин. депозит: 20 USDT
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Форма депозита */}
        <div className="space-y-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(15,23,42,0.95)]">
          {/* Выбранный метод */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-blue-500/70 bg-slate-900/90 shadow-[0_0_18px_rgba(37,99,235,0.85)]">
                <Image
                  src="/crypto/btc.png"
                  alt="Bitcoin"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-50">
                  Bitcoin (BTC)
                </span>
                <span className="text-[11px] text-slate-400">
                  Сеть: Bitcoin • 1 подтверждение
                </span>
              </div>
            </div>
            <div className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">
              Deposit
            </div>
          </div>

          {/* Сумма депозита */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Сумма депозита</span>
              <span>Мин: 20 USDT • Макс: 50 000 USDT</span>
            </div>

            <div
              className="
                flex items-center gap-2 rounded-2xl border border-slate-700/80
                bg-slate-950/80 px-3 py-2.5
                shadow-[0_0_26px_rgba(15,23,42,0.9)]
              "
            >
              <input
                type="number"
                placeholder="Введите сумму"
                className="
                  w-full border-none bg-transparent text-sm text-slate-50
                  outline-none placeholder:text-slate-500
                "
              />
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-300">
                  USDT
                </span>
                <span className="text-slate-600">≈ 0.0000 BTC</span>
              </div>
            </div>

            {/* Быстрые суммы */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((amount, index) => (
                <button
                  key={amount}
                  className={`
                    rounded-full border px-3 py-1 text-[11px] font-medium
                    transition-all
                    ${
                      index === 1
                        ? "border-blue-500/80 bg-blue-500/10 text-blue-100 shadow-[0_0_16px_rgba(37,99,235,0.7)]"
                        : "border-slate-700/80 bg-slate-900/80 text-slate-300 hover:border-blue-500/70 hover:bg-blue-500/5"
                    }
                  `}
                >
                  {amount} USDT
                </button>
              ))}
            </div>
          </div>

          {/* Адрес депозита (фиктивный UI-элемент) */}
          <div className="space-y-2 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Адрес для депозита BTC</span>
              <span className="text-blue-300">Только Bitcoin сеть</span>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="flex-1 rounded-xl bg-slate-900/90 px-3 py-2 text-[11px] text-slate-300">
                bc1qxxxx...pulzbtcaddressdemo
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <button className="rounded-full border border-slate-600/80 bg-slate-900/80 px-3 py-1 text-slate-200 hover:border-blue-500/70 hover:text-blue-100">
                  Copy
                </button>
                <button className="rounded-full border border-slate-600/80 bg-slate-900/80 px-3 py-1 text-slate-200 hover:border-blue-500/70 hover:text-blue-100">
                  Show QR
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              Отправляй только BTC на этот адрес. Любые другие монеты/сети могут быть утеряны.
            </p>
          </div>

          {/* Кнопка подтверждения */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              className="
                inline-flex w-full items-center justify-center gap-2
                rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-50
                shadow-[0_0_24px_rgba(37,99,235,0.95)]
                hover:bg-blue-500 transition-colors
              "
            >
              Продолжить депозит
            </button>
            <p className="text-[10px] text-slate-500">
              После отправки транзакции депозит будет зачислен автоматически после 1 подтверждения сети.
            </p>
          </div>
        </div>
      </section>

      {/* Небольшой инфо-блок внизу */}
      <section className="rounded-3xl border border-slate-800/80 bg-slate-950/90 px-4 py-3 text-[11px] text-slate-500">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <span>
            Pulz не хранит фиат. Все операции осуществляются только в криптовалюте.
          </span>
          <span className="text-slate-400">
            Играйте ответственно • 18+
          </span>
        </div>
      </section>
    </div>
  );
}
