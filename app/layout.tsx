import "./globals.css";
import type { ReactNode } from "react";
import PulzHeader from "@/components/PulzHeader";
import PulzFooter from "@/components/PulzFooter";

export const metadata = {
  title: "Pulz — Premium Casino",
  description: "Онлайн‑казино Pulz в дерзком красно‑чёрном стиле WynixBet."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="pulz-gradient-bg min-h-screen flex flex-col">
        <PulzHeader />
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 pt-8 pb-12">
          {children}
        </main>
        <PulzFooter />
      </body>
    </html>
  );
}
