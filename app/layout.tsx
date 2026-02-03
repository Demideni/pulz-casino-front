// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import PulzBootOverlay from "@/components/PulzBootOverlay";
import TopBar from "@/components/TopBar";

export const metadata = {
  title: "Robinson",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black"
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className="bg-black text-slate-100">
      <link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />
      <body className="bg-black text-slate-100 antialiased">
        {/* фирменная загрузка (overlay) */}
        <PulzBootOverlay />

        <div className="pulz-animated-bg flex min-h-screen flex-col">
          {/* TOP BAR */}
          <TopBar />

          {/* КОНТЕНТ СТРАНИЦЫ */}
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-0 pb-2 pt-2">
            {children}
          </main>

          {/* FOOTER */}
          <footer className="border-t border-slate-800/60 bg-black/80">
            <div className="mx-auto grid max-w-6xl gap-4 px-4 py-3 text-xs text-slate-400 md:grid-cols-4">
              <div>
                <img
                  src="/pulz-logo-dark.png"
                  alt="Pulz Casino"
                  className="h-12 w-auto"
                />
                <p className="text-[11px] leading-snug text-slate-500">
                  Pulz — честные коэффициенты. 
                  Только для взрослых игроков 18+.
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
                <span>© {new Date().getFullYear()} Pulz 2026.</span>
                <span>Играй ответственно 18+</span>
              </div>
            </div>
          </footer>

          {/* НИЖНИЙ ТАП-БАР С КОЛЕСОМ */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
