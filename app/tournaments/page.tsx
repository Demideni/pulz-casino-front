"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApiResp = {
  ok: boolean;
  data?: {
    tournament: {
      id: string;
      slug: string;
      name: string;
      status: string;
      startsAt: string;
      endsAt: string;
      kFactor: number;
      prizePoolCents: number;
    };
    leaderboard: { name: string; points: number; roundsCount: number; bestMultiplier: number }[];
    me: null | { points: number; rank: number; roundsCount: number; bestMultiplier: number };
  };
  error?: { message: string };
};

function fmtMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtLeft(endsAtIso: string) {
  const ms = new Date(endsAtIso).getTime() - Date.now();
  if (ms <= 0) return "ending…";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function TournamentsPage() {
  const [loading, setLoading] = useState(true);
  const [resp, setResp] = useState<ApiResp | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/tournaments", { cache: "no-store" });
        const j = (await r.json()) as ApiResp;
        if (!cancelled) setResp(j);
      } catch (e) {
        if (!cancelled) setResp({ ok: false, error: { message: "Network error" } } as any);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const t = resp?.ok ? resp.data?.tournament : null;
  const top3 = useMemo(() => (resp?.ok ? resp.data?.leaderboard?.slice(0, 3) ?? [] : []), [resp]);

  return (
    <div className="min-h-[100svh] bg-[#050b18] text-white px-4 pt-6 pb-24">
      <div className="text-2xl font-bold">Турниры</div>
      <div className="mt-2 text-sm text-slate-300">Активный турнир (24/7) по игре Robinson.</div>

      <div className="mt-5 rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4">
        {loading && <div className="text-slate-300">Загрузка…</div>}

        {!loading && (!resp || !resp.ok) && (
          <div className="text-red-300">Ошибка: {resp?.error?.message ?? "unknown"}</div>
        )}

        {!loading && resp?.ok && t && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{t.name}</div>
                <div className="mt-1 text-xs text-slate-300">K-factor: {t.kFactor}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-300">Ends in</div>
                <div className="text-sm font-semibold">{fmtLeft(t.endsAt)}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/30 p-3">
                <div className="text-xs text-slate-300">Prize pool</div>
                <div className="text-lg font-semibold">{fmtMoney(t.prizePoolCents)}</div>
              </div>
              <div className="rounded-xl bg-black/30 p-3">
                <div className="text-xs text-slate-300">Status</div>
                <div className="text-lg font-semibold">{t.status}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-slate-200">Top 3</div>
              <Link href={`/tournaments/${t.slug}`} className="text-sm text-cyan-300 hover:text-cyan-200">
                Leaderboard →
              </Link>
            </div>

            <div className="mt-2 space-y-2">
              {top3.length === 0 && <div className="text-xs text-slate-400">Пока нет результатов.</div>}
              {top3.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-black/25 px-3 py-2">
                  <div className="text-sm">
                    <span className="text-slate-300 mr-2">#{idx + 1}</span>
                    {p.name}
                  </div>
                  <div className="text-sm font-semibold">{p.points.toFixed(2)}</div>
                </div>
              ))}
            </div>

            {resp.data?.me && (
              <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                <div className="text-xs text-cyan-200">Your rank</div>
                <div className="mt-1 flex items-center justify-between">
                  <div className="text-sm font-semibold">#{resp.data.me.rank}</div>
                  <div className="text-sm font-semibold">{resp.data.me.points.toFixed(2)} pts</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
