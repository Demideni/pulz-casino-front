"use client";

import { useEffect, useState } from "react";

export default function TournamentsPage() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tournaments", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setData(j))
      .catch(() => setErr("Failed to load tournaments"));
  }, []);

  if (err) return <div style={{ padding: 16 }}>{err}</div>;
  if (!data) return <div style={{ padding: 16 }}>Loading…</div>;

  const t = data.tournament;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Tournaments</h1>
      <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 14, opacity: 0.8 }}>Active</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{t.name}</div>
        <div style={{ fontSize: 14, opacity: 0.8, marginTop: 6 }}>Daily Sprint 24/7 • K={t.kFactor}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Leaderboard</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(data.top ?? []).slice(0, 20).map((row: any, idx: number) => (
            <div key={row.userId} style={{ display: "flex", justifyContent: "space-between", padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 28, opacity: 0.8 }}>#{idx + 1}</div>
                <div style={{ opacity: 0.9 }}>{row.user?.email ?? row.userId.slice(0, 6)}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{Number(row.points).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {data.me && (
          <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "rgba(0,200,255,0.12)" }}>
            <div style={{ fontSize: 14, opacity: 0.9 }}>My Rank: {data.me.rank ?? "—"}</div>
            <div style={{ fontSize: 14, opacity: 0.9 }}>My Points: {Number(data.me.points ?? 0).toFixed(2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
