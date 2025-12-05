// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import FortuneWheel from "@/components/FortuneWheel";

export const metadata = {
  title: "Pulz — онлайн-казино",
  description: "Pulz demo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="bg-[#050509] text-slate-100">
      <body className="min-h-screen bg-[#050509] text-slate-100">
        {/* Top bar: логотип + Вход / Регистрация */}
        <header className="sticky top-0 z-40 border-b border-slate-900/80 bg-[#050509]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/pulz-logo-light.PNG"
                alt="Pulz Casino"
                className="h-6 w-auto"
              />
            </Link>

            <div className="flex items-center gap-2 text-sm">
              <button className="rounded-full border border-slate-600 bg-black/60 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-slate-300 hover:bg-slate-900">
                Вход
              </button>
              <button className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] hover:bg-red-500">
                Регистрация
              </button>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="mx-auto max-w-6xl px-4 pb-28 pt-4">
          {children}
        </main>

        {/* Футер (сюда как раз и попадают Партнёрам / О нас) */}
        <footer className="border-t border-slate-800/60 bg-black/80">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 text-xs text-slate-400 md:grid-cols-4">
            <div>
              <img
                src="/pulz-logo-light.PNG"
                alt="Pulz Casino"
                className="h-7 w-auto"
              />
              <p className="text-[11px] leading-snug text-slate-500 mt-2">
                Pulz — честные
                коэффициенты для взрослых игроков 18+.
              </p>
            </div>
            <div>
              <div className="mb-1 font-semibold text-slate-200">Компания</div>
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
              <div className="mb-1 font-semibold text-slate-200">Помощь</div>
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
              <div className="mb-1 font-semibold text-slate-200">Контакты</div>
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

        {/* Нижний бар с Pulz Wheel — оставляем как был */}
        <FortuneWheel />
      </body>
    </html>
  );
}
