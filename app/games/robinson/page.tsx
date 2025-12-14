"use client";

import { useEffect } from "react";

export default function RobinsonPage() {
  useEffect(() => {
    // Мост казино → игра
    (window as any).PULZ_GAME = {
      getBalance: async () => {
        const r = await fetch("/api/games/robinson/balance", { credentials: "include" });
        if (!r.ok) throw new Error("balance failed");
        return (await r.json()).balance as number;
      },

      placeBet: async (amount: number) => {
        const r = await fetch("/api/games/robinson/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount }),
        });
        if (!r.ok) throw new Error("start failed");
        return (await r.json()) as { balance: number; roundId: string };
      },

      finishRound: async (payload: { roundId: string; multiplier: number; result: "won" | "lost" }) => {
        const r = await fetch("/api/games/robinson/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error("finish failed");
        return (await r.json()) as { balance: number; win: number };
      },
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#050509]">
      <iframe
        src="/games/robinson/index.html"
        className="h-[100dvh] w-full border-0"
        allow="autoplay; clipboard-write"
      />
    </div>
  );
}
