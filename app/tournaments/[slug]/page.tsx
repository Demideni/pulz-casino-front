"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Row = { rank: number; userId: string; email: string; points: number; roundsCount: number; bestMultiplier: number };
type Prize = { id: string; placeFrom: number; placeTo: number; amountCents: number };
type Tournament = { id: string; slug: string; name: string; status: string; startsAt: string; endsAt: string; kFactor: number; prizes: Prize[] };

export default function TournamentLeaderboardPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [t, setT] = useState<Tournament | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [meRank, setMeRank] = useState<number | null>(null);
  const [mePoints, setMePoints] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/tournaments/${slug}`, { credentials: "include" });
      const j = await r.json();
      if (!j?.ok) return;
      setT(j.data.tournament);
      setRows(j.data.top || []);
      if (j.data.me?.rank) setMeRank(j.data.me.rank);
      if (j.data.me?.entry?.points != null) setMePoints(j.data.me.entry.points);
    })();
  }, [slug]);

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

  return (
    <div className="px-4 pb-24 pt-3 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/tournaments" className="text-sm text-blue-300/80 hover:text-blue-200">← Back</Link>
        {t ? <div className="text-xs text-white/60">{t.status} • ends in {timeLeft}</div> : null}
      </div>

      <div className="rounded-2xl border border-blue-400/25 bg-gradient-to-b from-[#071127]/60 to-black/40 p-4">
        <div className="text-sm text-blue-200/80">Leaderboard</div>
        <div className="text-2xl font-bold text-white">{t?.name ?? "Tournament"}</div>
        <div className="mt-1 text-xs text-white/60">K factor: <span className="text-white/80">{t?.kFactor ?? "-"}</span></div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2">
            <div className="text-xs text-white/60">Your rank</div>
            <div className="text-lg text-white font-semibold">{meRank ? `#${meRank}` : "—"}</div>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/10 px-3 py-2">
            <div className="text-xs text-white/60">Your points</div>
            <div className="text-lg text-white font-semibold">{mePoints != null ? mePoints.toFixed(2) : "—"}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/25 overflow-hidden">
        <div className="px-3 py-2 text-xs text-white/60 border-b border-white/10">Top 100</div>
        <div className="divide-y divide-white/10">
          {rows.map((r) => (
            <div key={r.userId} className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 text-white/70 text-sm">#{r.rank}</div>
                <div>
                  <div className="text-sm text-white">{maskEmail(r.email)}</div>
                  <div className="text-xs text-white/50">Rounds: {r.roundsCount} • Best: x{r.bestMultiplier.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-white font-semibold">{r.points.toFixed(2)}</div>
            </div>
          ))}
          {rows.length === 0 ? (
            <div className="px-3 py-6 text-center text-white/60">No entries yet</div>
          ) : null}
        </div>
      </div>

      {t?.prizes?.length ? (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="text-xs text-white/60 mb-2">Prizes</div>
          <div className="grid grid-cols-2 gap-2">
            {t.prizes.map((p) => (
              <div key={p.id} className="rounded-xl bg-black/30 border border-white/10 px-3 py-2">
                <div className="text-xs text-white/70">
                  #{p.placeFrom}{p.placeTo !== p.placeFrom ? `–${p.placeTo}` : ""}
                </div>
                <div className="text-sm text-white font-semibold">${(p.amountCents/100).toFixed(0)}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white/70 text-sm leading-relaxed">
        Points formula: <span className="text-white/90">sqrt(stake) × multiplier × K</span>.
      </div>
    </div>
  );
}

function maskEmail(email: string) {
  const [u, d] = (email || "").split("@");
  if (!u || !d) return "Player";
  return `${u.slice(0, 2)}***@${d}`;
}
