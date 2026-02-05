export const dynamic = "force-dynamic";

import Link from "next/link";

async function getData() {
  const res = await fetch(`/api/tournaments`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function TournamentSlugPage({ params }: { params: { slug: string } }) {
  const data = await getData();
  const t = data?.active;
  const leaderboard = data?.leaderboard ?? [];
  const me = data?.me;

  return (
    <main className="p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t?.name ?? "Tournament"}</h1>
        <Link className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15" href="/tournaments">Back</Link>
      </div>

      {me && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-4">
          <div className="text-sm opacity-70">My rank</div>
          <div className="text-xl font-semibold">#{me.rank ?? "-"}</div>
          <div className="text-sm opacity-70 mt-1">Points: {Number(me.points ?? 0).toFixed(2)}</div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 text-sm opacity-70">Leaderboard (Top 100)</div>
        <div>
          {leaderboard.map((row: any) => (
            <div key={row.rank} className="flex items-center justify-between px-4 py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 text-sm opacity-70">#{row.rank}</div>
                <div className="font-medium">{row.name}</div>
              </div>
              <div className="text-sm">{Number(row.points).toFixed(2)}</div>
            </div>
          ))}
          {leaderboard.length === 0 && <div className="px-4 py-4 opacity-70">No results yet.</div>}
        </div>
      </div>
    </main>
  );
}
