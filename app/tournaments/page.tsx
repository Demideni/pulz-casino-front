export const dynamic = "force-dynamic";

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/tournaments`, { cache: "no-store" });
  return res.json();
}

export default async function TournamentsPage() {
  // This page is intentionally minimal; UI can be styled later.
  return (
    <main style={{ padding: 16, color: "white" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Tournaments</h1>
      <p style={{ opacity: 0.8 }}>Daily Sprint is active 24/7.</p>
      <p style={{ opacity: 0.8 }}>Open leaderboard via API: <code>/api/tournaments</code></p>
    </main>
  );
}
