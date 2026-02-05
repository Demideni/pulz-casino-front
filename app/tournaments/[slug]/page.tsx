"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ApiResp = {
  ok: boolean;
  data?: {
    tournament: { slug: string; name: string; endsAt: string; kFactor: number };
    leaderboard: { name: string; points: number; roundsCount: number; bestMultiplier: number }[];
    me: null | { points: number; rank: number; roundsCount: number; bestMultiplier: number };
  };
  error?: { message: string };
};

export default function TournamentSlugPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [loading, setLoading] = useState(true);
  const [resp, setResp] = useState<ApiResp | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/tournaments", { cache: "no-store" }); // only one tournament for now
        const j = (await r.json()) as ApiResp;
        if (!cancelled) setResp(j);
      } catch {
        if (!cancelled) setResp({ ok: false, error: { message: "Network error" } } as any);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const t = resp?.ok ? resp.data?.tournament : null;
  const board = resp?.ok ? resp.data?.leaderboard ?? [] : [];

  return (
    <div className="min-h-[100svh] bg-[#050b18] text-white px-4 pt-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{t?.name ?? "Tournament"}</div>
        <Link href="/tournaments" className="text-sm text-cyan-300 hover:text-cyan-200">
          ← Back
        </Link>
      </div>

      <div className="mt-2 text-sm text-slate-300">Leaderboard</div>

      <div className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4">
        {loading && <div className="text-slate-300">Загрузка…</div>}

        {!loading && (!resp || !resp.ok) && (
          <div className="text-red-300">Ошибка: {resp?.error?.message ?? "unknown"}</div>
        )}

        {!loading && resp?.ok && (
          <div className="space-y-2">
            {board.length === 0 && <div className="text-xs text-slate-400">Пока нет результатов.</div>}
            {board.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2">
                <div className="text-sm">
                  <span className="text-slate-400 mr-2">#{idx + 1}</span>
                  {p.name}
                </div>
                <div className="text-sm font-semibold">{p.points.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {resp?.ok && resp.data?.me && (
        <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
          <div className="text-xs text-cyan-200">Your rank</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-lg font-semibold">#{resp.data.me.rank}</div>
            <div className="text-lg font-semibold">{resp.data.me.points.toFixed(2)} pts</div>
          </div>
          <div className="mt-1 text-xs text-cyan-200/80">
            Rounds: {resp.data.me.roundsCount} • Best: x{resp.data.me.bestMultiplier.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
