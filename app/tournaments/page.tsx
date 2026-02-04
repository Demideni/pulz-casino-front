"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Prize = { id: string; placeFrom: number; placeTo: number; amountCents: number };
type Tournament = {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: string;
  startsAt: string;
  endsAt: string;
  kFactor: number;
  prizePoolCents: number;
  prizes: Prize[];
};

export default function TournamentsPage() {
  const [t, setT] = useState<Tournament | null>(null);
  const [meRank, setMeRank] = useState<number | null>(null);
  const [mePoints, setMePoints] = useState<number | null>(null);
  const [loadingJoin, setLoadingJoin] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/tournaments", { credentials: "include" });
      const j = await r.json();
      if (!j?.ok) return;
      setT(j.data.daily);
      if (j.data.me?.rank) setMeRank(j.data.me.rank);
      if (j.data.me?.entry?.points != null) setMePoints(j.data.me.entry.points);
    })();
  }, []);

  const timeLeft = useMemo(() => {
    if (!t) return "";
    const end = new Date(t.endsAt).getTime();
    const now = Date.now();
    const ms = Math.max(0, end - now);
    const s = Math.floor(ms / 1000);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${hh}h ${mm}m ${ss}s`;
  }, [t]);

  async function join() {
    if (!t) return;
    setLoadingJoin(true);
    try {
      const r = await fetch(`/api/tournaments/${t.slug}/join`, { method: "POST", credentials: "include" });
      const j = await r.json();
      if (!j?.ok) return;
      // after join, refresh
      const rr = await fetch("/api/tournaments", { credentials: "include" });
      const jj = await rr.json();
      if (jj?.ok) {
        if (jj.data.me?.rank) setMeRank(jj.data.me.rank);
        if (jj.data.me?.entry?.points != null) setMePoints(jj.data.me.entry.points);
      }
    } finally {
      setLoadingJoin(false);
    }
  }

  return (
    <div className="px-4 pb-24 pt-3 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Tournaments</h1>
        <div className="text-xs text-white/60">Robinson only</div>
      </div>

      {!t ? (
        <div className="rounded-2xl border border-blue-400/20 bg-black/30 p-4 text-white/70">Loading…</div>
      ) : (
        <div className="rounded-2xl border border-blue-400/25 bg-gradient-to-b from-[#071127]/60 to-black/40 p-4 shadow-[0_0_40px_rgba(59,130,246,0.12)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-blue-200/80">Active • Daily Sprint 24/7</div>
              <div className="text-2xl font-bold text-white">{t.name}</div>
              <div className="mt-1 text-xs text-white/60">K factor: <span className="text-white/80">{t.kFactor}</span></div>
              <div className="mt-2 text-sm text-white/80">Ends in: <span className="text-white">{timeLeft}</span></div>
            </div>

            <div className="text-right">
              {meRank ? (
                <div className="text-xs text-white/70">
                  Your rank: <span className="text-white font-semibold">#{meRank}</span>
                  {mePoints != null ? <div className="mt-1 text-white/70">Points: <span className="text-white/90">{mePoints.toFixed(2)}</span></div> : null}
                </div>
              ) : (
                <div className="text-xs text-white/60">Not joined</div>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={join}
              disabled={loadingJoin}
              className="rounded-xl bg-blue-500/20 border border-blue-400/30 px-3 py-2 text-sm text-white hover:bg-blue-500/30 disabled:opacity-50"
            >
              {meRank ? "Joined" : loadingJoin ? "Joining…" : "Join"}
            </button>
            <Link
              href={`/tournaments/${t.slug}`}
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/10 text-center"
            >
              View leaderboard
            </Link>
          </div>

          <div className="mt-4">
            <div className="text-xs text-white/60 mb-2">Prizes (demo)</div>
            <div className="grid grid-cols-2 gap-2">
              {t.prizes?.slice(0,4)?.map((p) => (
                <div key={p.id} className="rounded-xl bg-black/30 border border-white/10 px-3 py-2">
                  <div className="text-xs text-white/70">
                    #{p.placeFrom}{p.placeTo !== p.placeFrom ? `–${p.placeTo}` : ""}
                  </div>
                  <div className="text-sm text-white font-semibold">${(p.amountCents/100).toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white/70 text-sm leading-relaxed">
        Points formula: <span className="text-white/90">sqrt(stake) × multiplier × K</span>.
        Play Robinson rounds to earn points.
      </div>
    </div>
  );
}
