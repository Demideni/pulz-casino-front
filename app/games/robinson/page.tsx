"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MIN_BET_CENTS = 10;

export default function RobinsonPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "need_deposit" | "ready">("checking");
  const [balanceCents, setBalanceCents] = useState<number>(0);

  const nextAfterCashier = "/games/robinson";

  useEffect(() => {
    let alive = true;

    const check = async () => {
      try {
        const r = await fetch("/api/me", { credentials: "include" });
        if (!r.ok) {
          router.replace(`/login?next=${encodeURIComponent(nextAfterCashier)}`);
          return;
        }
        const j = await r.json();
        const cents = (j?.data?.user?.balanceCents ?? 0) as number;
        if (!alive) return;
        setBalanceCents(cents);

        if (cents < MIN_BET_CENTS) {
          setStatus("need_deposit");
          return;
        }

        setStatus("ready");
      } catch {
        router.replace(`/login?next=${encodeURIComponent(nextAfterCashier)}`);
      }
    };

    check();

    return () => {
      alive = false;
    };
  }, [router]);

  useEffect(() => {
    if (status !== "ready") return;

    // Fullscreen game page: prevent the site from scrolling under the iframe
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Casino → game bridge
    (window as any).PULZ_GAME = {
      getBalance: async () => {
        const r = await fetch("/api/games/robinson/balance", { credentials: "include" });
        const j = await r.json().catch(() => null);
        if (!r.ok || !j?.ok) throw new Error(j?.error?.message || "balance failed");
        return (j.data.balanceCents as number) / 100;
      },

      startRound: async ({ amount }: { amount: number }) => {
        const r = await fetch("/api/games/robinson/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ amount }),
        });
        const j = await r.json().catch(() => null);
        if (!r.ok || !j?.ok) throw new Error(j?.error?.message || "start failed");
        return { balance: (j.data.balanceCents as number) / 100, roundId: j.data.roundId as string };
      },

      finishRound: async ({ roundId, multiplier }: { roundId: string; multiplier: number }) => {
        const r = await fetch("/api/games/robinson/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ roundId, multiplier }),
        });
        const j = await r.json().catch(() => null);
        if (!r.ok || !j?.ok) throw new Error(j?.error?.message || "finish failed");
        return { balance: (j.data.balanceCents as number) / 100, win: (j.data.winCents as number) / 100 };
      },
    };

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [status]);

  if (status === "checking") {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050509] grid place-items-center">
        <div className="text-slate-200 text-sm">Загрузка игры…</div>
      </div>
    );
  }

  if (status === "need_deposit") {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#050509] grid place-items-center p-6">
        <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-black/60 p-6 text-center">
          <div className="text-lg font-semibold text-slate-50">Пополните баланс</div>
          <div className="mt-2 text-sm text-slate-300">
            Для игры в Робинзона нужен минимум <span className="text-blue-400">$0.10</span>.
          </div>
          <div className="mt-2 text-xs text-slate-400">Текущий баланс: ${(balanceCents / 100).toFixed(2)}</div>

          <Link
            href={`/cashier?next=${encodeURIComponent(nextAfterCashier)}`}
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-black hover:bg-blue-400 transition"
          >
            Пополнить баланс
          </Link>

          <button
            onClick={() => router.replace("/")}
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900 transition"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050509] overflow-hidden">
      <iframe
        src="/games/robinson/index.html"
        className="h-full w-full border-0 block"
        allow="autoplay; clipboard-write"
      />
    </div>
  );
}
