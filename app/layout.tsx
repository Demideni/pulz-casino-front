// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Pulz — Премиум онлайн-казино",
  description: "Играй с огнём. Побеждай с умом.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="bg-[#050509] text-slate-100">
      <body className="min-h-screen bg-gradient-to-b from-[#050509] via-[#090711] to-[#050509] text-slate-100">
        {/* Top bar */}
        <div className="border-b border-red-900/40 bg-black/40 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/pulz-logo-dark.png"
                alt="Pulz Casino"
                className="h-7 w-auto"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-red-400">
                Играй с огнём. Побеждай с умом.
              </span>
            </Link>

            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/status"
                className="hidden text-xs text-slate-400 hover:text-slate-100 md:inline"
              >
                Статус платформы
              </Link>

              <button className="rounded-full border border-red-500/60 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-100 hover:bg-red-500/20">
                Войти
              </button>
              <button className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_25px_rgba(239,68,68,0.65)] hover:bg-red-500">
                Регистрация
              </button>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="border-b border-slate-800/60 bg-gradient-to-r from-black/70 via-[#12020a]/80 to-black/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2 text-sm">
            <Link
              href="/games"
              className="font-medium text-slate-100 hover:text-white"
            >
              Игры
            </Link>
            <Link
              href="/bonuses"
              className="text-slate-300 hover:text-white"
            >
              Бонусы
            </Link>
            <Link
              href="/cashier"
              className="text-slate-300 hover:text-white"
            >
              Касса
            </Link>
            <Link
              href="/partners"
              className="text-slate-300 hover:text-white"
            >
              Партнёрам
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-white">
              О нас
            </Link>
          </div>
        </nav>

        {/* Page */}
        <main className="mx-auto min-h-[calc(100vh-140px)] max-w-6xl px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 bg-black/80">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 text-xs text-slate-400 md:grid-cols-4">
            <div>
              <img
                src="/pulz-logo-dark.png"
                alt="Pulz Casino"
                className="mb-2 h-6 w-auto"
              />
              <p className="text-[11px] leading-snug text-slate-500">
                Pulz — онлайн-казино с дерзким красно-чёрным стилем и честными
                коэффициентами для взрослых игроков 18+.
              </p>
            </div>
            <div>
              <div className="mb-1 font-semibold text-slate-200">
                Компания
              </div>
              <ul className="space-y-1">
                <li>
                  <Link href="/about" className="hover:text-slate-100">
                    О нас
                  </Link>
                </li>
                <li>
                  <Link href="/partners" className="hover:text-slate-100">
                    Партнёрам
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-1 font-semibold text-slate-200">
                Помощь
              </div>
              <ul className="space-y-1">
                <li>
                  <Link href="/status" className="hover:text-slate-100">
                    Статус платформы
                  </Link>
                </li>
                <li>
                  <span className="text-slate-500">Ответственная игра</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-1 font-semibold text-slate-200">
                Контакты
              </div>
              <ul className="space-y-1">
                <li>support@pulz.casino</li>
                <li>Чат 24/7 (в разработке)</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800/80 bg-black/90">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-[11px] text-slate-500">
              <span>© {new Date().getFullYear()} Pulz. Demo only.</span>
              <span>Играй ответственно 18+</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
