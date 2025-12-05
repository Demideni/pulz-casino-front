// app/login/page.tsx
export const metadata = {
  title: "Вход — Pulz Casino",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-red-400">
          Pulz account
        </div>
        <h1 className="mt-1 text-2xl font-semibold text-slate-50">
          Вход в аккаунт
        </h1>
        <p className="text-sm text-slate-400">
          Войди, чтобы продолжить игру, увидеть баланс и персональные бонусы.
        </p>
      </div>

      <form className="space-y-4 rounded-2xl border border-slate-800/80 bg-black/60 p-5">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-300">
            Email или телефон
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-red-500/0 focus:border-red-500/80 focus:ring-2 focus:ring-red-500/40"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-300">Пароль</label>
          <input
            type="password"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-red-500/0 focus:border-red-500/80 focus:ring-2 focus:ring-red-500/40"
            placeholder="••••••••"
          />
          <button className="mt-1 text-xs text-slate-400 hover:text-slate-200">
            Забыли пароль?
          </button>
        </div>

        <button
          type="button"
          className="mt-2 w-full rounded-full bg-red-600 py-2 text-sm font-semibold text-white shadow-[0_0_25px_rgba(248,113,113,0.9)] hover:bg-red-500"
        >
          Войти
        </button>

        <p className="pt-1 text-xs text-slate-400">
          Нет аккаунта?{" "}
          <a
            href="/register"
            className="text-red-400 hover:text-red-300"
          >
            Зарегистрироваться
          </a>
        </p>
      </form>
    </div>
  );
}
