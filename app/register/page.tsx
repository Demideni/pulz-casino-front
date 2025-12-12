// app/register/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="px-4 pb-6 pt-4">
      {/* Шапка */}
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">
            Регистрация в Pulz
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Создай аккаунт и забери свои welcome-бонусы.
          </p>
        </div>
        <Link
          href="/login"
          className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200"
        >
          Вход
        </Link>
      </header>

      {/* Основная карточка */}
      <main className="mx-auto flex max-w-lg flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-4 shadow-[0_0_40px_rgba(15,23,42,0.95)]">
        {/* Верхний блок с баннером */}
        <div className="flex items-center gap-3 rounded-2xl bg-slate-900/70 p-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-blue-500/70 bg-slate-950/90 shadow-[0_0_20px_rgba(37,99,235,0.8)]">
            <Image
              src="/banners/hero-feel-the-pulse.png"
              alt="Pulz Welcome Bonus"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-300">
              WELCOME BONUS
            </span>
            <span className="text-sm font-semibold text-slate-50">
              До 500% + Daily Crypto Bonus
            </span>
            <span className="text-[11px] text-slate-400">
              Получи максимальный буст к первым депозитам.
            </span>
          </div>
        </div>

        {/* Форма регистрации */}
        <form className="space-y-3">
          <div className="space-y-1 text-xs">
            <label className="text-slate-300">E-mail</label>
            <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
              <input
                type="email"
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
                placeholder="Минимум 8 символов"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-300">Промо-код (если есть)</label>
            <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
              <input
                type="text"
                className="w-full bg-transparent outline-none placeholder:text-slate-500"
                placeholder="Например: PULZ500"
              />
            </div>
          </div>

          <div className="space-y-2 text-[11px] text-slate-400">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-[2px] h-3 w-3 rounded border-slate-600 bg-slate-900"
              />
              <span>
                Мне уже 18 лет, и я принимаю{" "}
                <Link
                  href="/terms"
                  className="text-blue-300 hover:text-blue-200"
                >
                  условия использования
                </Link>{" "}
                и политику ответственной игры.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_24px_rgba(37,99,235,0.95)] hover:bg-blue-500 transition-colors"
          >
            Создать аккаунт
          </button>
        </form>

        {/* Низ */}
        <div className="border-t border-slate-800/80 pt-3 text-[11px] text-slate-500">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-blue-300 hover:text-blue-200">
            Войти
          </Link>
        </div>
      </main>
    </div>
  );
}
