"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: string; email: string; balanceCents: number };

function fmtUsd(cents: number) {
  const v = (cents / 100).toFixed(2);
  return `$${v}`;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const me = await fetch("/api/me", { cache: "no-store" });
      const mj = await me.json();
      if (!me.ok || !mj?.ok) {
        router.replace("/login");
        return;
      }
      setUser(mj.data.user);

      const t = await fetch("/api/transactions?take=30", { cache: "no-store" });
      const tj = await t.json();
      if (t.ok && tj?.ok) setTxs(tj.data.transactions || []);
    } catch {
      setError("Сеть/сервер недоступны");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-4 pb-8 pt-4">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Личный кабинет</h1>
          <p className="mt-1 text-xs text-slate-400">Pulz Account</p>
        </div>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/pulz-logo-light.png" alt="Pulz" width={44} height={44} />
        </Link>
      </header>

      <main className="mx-auto max-w-md space-y-3">
        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4 shadow-[0_0_40px_rgba(59,130,246,0.12)] backdrop-blur">
          {loading ? (
            <div className="text-sm text-slate-300">Загрузка…</div>
          ) : error ? (
            <div className="text-sm text-red-200">{error}</div>
          ) : user ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] text-slate-400">Email</div>
                  <div className="text-sm font-medium text-slate-100">{user.email}</div>
                  <div className="mt-2 text-[11px] text-slate-400">User ID</div>
                  <div className="break-all text-[11px] text-slate-500">{user.id}</div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Баланс</div>
                  <div className="text-2xl font-semibold text-blue-200">
                    {fmtUsd(user.balanceCents)}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">Хранится на сервере</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/cashier"
                  className="rounded-xl bg-blue-600/90 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Deposit
                </Link>
                <button
                  onClick={() => alert("Withdraw сделаем после подключения PassimPay payout API")}
                  className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-semibold text-slate-100 hover:border-slate-700"
                >
                  Withdraw
                </button>
              </div>

              <button
                onClick={logout}
                className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-slate-700"
              >
                Выйти
              </button>
            </>
          ) : null}
        </div>

        <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
          <div className="mb-2 text-sm font-medium text-slate-100">История</div>
          {txs.length === 0 ? (
            <div className="text-[12px] text-slate-500">Пока нет операций.</div>
          ) : (
            <div className="space-y-2">
              {txs.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-950/40 px-3 py-2"
                >
                  <div>
                    <div className="text-[12px] text-slate-200">{t.type}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[12px] font-semibold text-slate-100">
                    {t.type === "BET" ? "-" : "+"}
                    {fmtUsd(t.amountCents)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
