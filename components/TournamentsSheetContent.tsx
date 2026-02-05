"use client";

import Link from "next/link";

export default function TournamentsSheetContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="mt-4">
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4">
        <div className="text-base font-semibold">Турниры</div>
        <div className="mt-2 text-sm text-slate-300">
          Открой Daily Sprint и смотри лидерборд. активных турниров и лидерборды. Пока что — заглушка.
        </div>

        <div className="mt-4 grid gap-2">
          <Link
            href="/tournaments"
            className="rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-3 text-center text-sm text-slate-100"
            onClick={onClose}
          >
            Открыть страницу турниров
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          onClick={onClose}
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
