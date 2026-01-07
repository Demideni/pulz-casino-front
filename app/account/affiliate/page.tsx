"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AffiliateMe = {
  code: string;
  revshareBps: number;
};

type AffiliateStats = {
  clicks: number;
  signups: number;
  earningsCents: number;
};

function fmtUsd(cents: number) {
  const v = (cents || 0) / 100;
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function AffiliatePage() {
  const [me, setMe] = useState<AffiliateMe | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const meRes = await fetch("/api/aff/me", { cache: "no-store" });
      if (meRes.ok) {
        const meData = await meRes.json();
        setMe(meData);

        const stRes = await fetch("/api/aff/stats", { cache: "no-store" });
        if (stRes.ok) {
          const stData = await stRes.json();
          setStats(stData);
        } else {
          setStats(null);
        }
      } else {
        setMe(null);
        setStats(null);
      }
    } catch {
      setMe(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  async function createAffiliate() {
    setCreating(true);
    try {
      const res = await fetch("/api/aff/me", {
        method: "POST",
      });
      if (res.ok) {
        await load();
      }
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-4xl p-4 md:p-8">
        <div className="mb-4">
          <Link
            href="/account"
            className="text-sm text-slate-400 hover:text-slate-200"
          >
            ← Назад в аккаунт
          </Link>
        </div>

        <h1 className="mb-6 text-2xl font-semibold text-slate-100">
          Affiliate Program
        </h1>

        {loading && (
          <div className="text-sm text-slate-500">Загрузка…</div>
        )}

        {!loading && !me && (
          <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-6">
            <p className="mb-4 text-sm text-slate-300">
              Создай аффилейт-аккаунт и получай процент с депозитов
              привлечённых игроков.
            </p>

            <button
              onClick={createAffiliate}
              disabled={creating}
              className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-700 disabled:opacity-50"
            >
              {creating ? "Создание…" : "Создать аффилейт-аккаунт"}
            </button>
          </div>
        )}

        {!loading && me && (
          <>
            {/* Referral link */}
            <div className="mb-4 rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
              <div className="mb-1 text-sm font-medium text-slate-100">
                Твоя реферальная ссылка
              </div>
              <div className="break-all rounded-lg border border-slate-800 bg-black px-3 py-2 text-sm text-slate-200">
                {typeof window !== "undefined"
                  ? `${window.location.origin}/?ref=${me.code}`
                  : `/?ref=${me.code}`}
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                RevShare: {(me.revshareBps / 100).toFixed(2)}%
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                <div className="text-[11px] text-slate-500">Клики</div>
                <div className="text-xl font-semibold text-slate-100">
                  {stats?.clicks ?? 0}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                <div className="text-[11px] text-slate-500">Регистрации</div>
                <div className="text-xl font-semibold text-slate-100">
                  {stats?.signups ?? 0}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                <div className="text-[11px] text-slate-500">Заработок</div>
                <div className="text-xl font-semibold text-slate-100">
                  {fmtUsd(stats?.earningsCents ?? 0)}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
