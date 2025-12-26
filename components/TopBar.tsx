"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MeResponse = {
  ok: boolean;
  user?: { id: string; email: string; balanceCents: number };
  error?: string;
};

function fmtMoney(cents: number) {
  const v = (cents ?? 0) / 100;
  return v.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function TopBar() {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);

  const isAuthed = !!me?.user;

  const shortId = useMemo(() => {
    const id = me?.user?.id || "";
    if (!id) return "";
    return `${id.slice(0, 6)}…${id.slice(-4)}`;
  }, [me?.user?.id]);

  async function loadMe() {
    try {
      setLoading(true);
      const r = await fetch("/api/me", { method: "GET", credentials: "include" });
      const j = await r.json();
      if (!r.ok) {
        setMe({ ok: false, error: j?.error || "Unauthorized" });
      } else {
        setMe({ ok: true, user: j.user });
      }
    } catch {
      setMe({ ok: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    // просто перезагрузим состояние
    setMe(null);
    setLoading(true);
    await loadMe();
    // и можно редиректнуть на главную (по желанию)
    // window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-900/60 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* ЛОГО */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/pulz-logo-dark.PNG"
            alt="Pulz Casino"
            className="pulz-logo-animated h-24 w-auto"
          />
        </Link>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="text-sm text-slate-400">Загрузка…</div>
          ) : isAuthed ? (
            <>
              <Link
                href="/account"
                className="rounded-full border border-slate-700/80 px-4 py-1.5 text-sm text-slate-100 hover:border-slate-300"
              >
                Кабинет
              </Link>

              <div className="hidden items-center gap-3 rounded-full border border-slate-800/80 px-4 py-1.5 text-sm text-slate-100 md:flex">
                <span className="text-slate-400">ID:</span>
                <span className="font-mono">{shortId}</span>
                <span className="mx-2 h-4 w-px bg-slate-800" />
                <span className="text-slate-400">Баланс:</span>
                <span className="font-semibold">{fmtMoney(me!.user!.balanceCents)}</span>
              </div>

              <button
                onClick={logout}
                className="rounded-full bg-slate-800 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-slate-500/80 px-5 py-1.5 text-sm text-slate-100 hover:border-slate-300"
              >
                Вход
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-6 py-1.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:bg-blue-500"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
