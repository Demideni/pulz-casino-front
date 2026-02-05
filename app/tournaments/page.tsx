export const dynamic = "force-dynamic";

import Link from "next/link";

async function getData() {
  const res = await fetch(`/api/tournaments`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function TournamentsPage() {
  const data = await getData();
  const t = data?.active;

  return (
    <main className="p-4 text-white">
      <h1 className="text-2xl font-semibold mb-4">Tournaments</h1>

      {!t ? (
        <div className="opacity-80">Loading…</div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{t.name}</div>
              <div className="text-sm opacity-70">Always active (24/7)</div>
            </div>
            <Link className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15" href={`/tournaments/${t.slug}`}>
              View
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
