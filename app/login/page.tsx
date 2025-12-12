// app/login/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="px-4 pb-6 pt-4">
      {/* Шапка */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Вход в Pulz</h1>
          <p className="mt-1 text-xs text-slate-400">
            Продолжай игру в неоновой вселенной Pulz.
          </p>
        </div>
        <Link
          href="/register"
          className="rounded-full border border-blue-500/70 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-200"
        >
          Регистрация
        </Link>
      </header>

      {/* Основная карточка */}
      <main className="mx-auto flex max-w-lg flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(15,23,42,0.95)]">
        {/* Левая часть – талисман / картинка */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 p-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-blue-500/70 bg-slate-950/90 shadow-[0_0_20px_rgba(37,99,235,0.8)]">
            <Image
              src="/banners/join-pulz-free-spins.png"
              alt="Pulz"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">
              PULZ ACCOUNT
            </span>
            <span className="text-sm font-semibold text-slate-50">
              Войти и продолжить игру
            </span>
            <span className="text-[11px] text-slate-400">
              Доступ к крутилкам, кэшбэку и VIP-статусу.
            </span>
          </div>
        </div>

        {/* Форма логина */}
        <form className="space-y-3">
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">E-mail или логин</label>
            <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
              <input
                type="text"
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
                placeholder="name@pulzwin.com"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Пароль</label>
            <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
              <input
                type="password"
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-slate-600 bg-slate-900"
              />
              <span>Запомнить меня</span>
            </label>
            <button
              type="button"
              className="text-blue-300 hover:text-blue-200"
            >
              Забыли пароль?
            </button>
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_24px_rgba(37,99,235,0.95)] hover:bg-blue-500 transition-colors"
          >
            Войти
          </button>
        </form>

        {/* Низ карточки */}
        <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500">
          Нет аккаунта?{" "}
          <Link href="/register" className="text-blue-300 hover:text-blue-200">
            Зарегистрироваться
          </Link>
        </div>
      </main>
    </div>
  );
}
