"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

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
      const r = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const j = await r.json().catch(() => ({} as any));

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

  // ВАЖНО: перезапрашиваем /api/me при смене страницы,
  // иначе после client-side login кнопки могут не обновиться
  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    // после логаута обновим состояние
    await loadMe();
    // и утащим на главную
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-900/60 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/pulz-logo-dark.PNG"
            alt="Pulz Casino"
            className="pulz-logo-animated h-24 w-auto"
          />
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="text-sm text-slate-400">Загрузка…</div>
          ) : isAuthed ? (
            <>
              {/* На мобиле показываем баланс компактно */}
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-full border border-slate-800/80 px-4 py-1.5 text-sm text-slate-100 hover:border-slate-300"
              >
                <span className="text-slate-400">Баланс</span>
                <span className="font-semibold">{fmtMoney(me!.user!.balanceCents)}</span>
              </Link>

              {/* На десктопе добавим ID */}
              <div className="hidden items-center gap-2 rounded-full border border-slate-800/80 px-4 py-1.5 text-sm text-slate-100 md:flex">
                <span className="text-slate-400">ID:</span>
                <span className="font-mono">{shortId}</span>
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
