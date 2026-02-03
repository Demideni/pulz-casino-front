// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
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

          {/* FOOTER CTA (3 кнопки в Telegram) */}
          <footer className="border-t border-slate-800/60 bg-black/80">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 pb-28 pt-5">
              <a
                className="footer-cta-btn"
                href="https://t.me/grandfather_jack"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/cta/integration.png"
                  alt="Интеграция в проекты"
                  className="footer-cta-img"
                />
              </a>

              <a
                className="footer-cta-btn"
                href="https://t.me/grandfather_jack"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/cta/affiliate.png"
                  alt="Стать аффилейтом"
                  className="footer-cta-img"
                />
              </a>

              <a
                className="footer-cta-btn"
                href="https://t.me/grandfather_jack"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/cta/offers.png"
                  alt="Предложения"
                  className="footer-cta-img"
                />
              </a>

              <div className="pt-2 text-center text-[11px] text-slate-500">
                © {new Date().getFullYear()} Pulz. 18+
              </div>
            </div>
          </footer>

          {/* НИЖНИЙ ТАП-БАР */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
