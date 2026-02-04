"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const ICONS: Record<string, string> = {
  "/cashier": "/icons/wallet.png",
  "/login": "/icons/login.png",
  "/robinson": "/icons/games.png",
  "/tournaments": "/icons/promotions.png",
  "/menu": "/icons/menu.png",
};

type AuthMode = "login" | "register";

export default function BottomNav() {
  const [openAuth, setOpenAuth] = useState(false);
  const [openCashier, setOpenCashier] = useState(false);
  const [openTournaments, setOpenTournaments] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      {/* Тап-бар снизу */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-0">
        <nav
          className="
            pointer-events-auto
            relative flex w-full max-w-xl
            items-end justify-between
            rounded-t-[24px]
            bg-[#11141f]/95
            px-2 pb-2 pt-3
            backdrop-blur-lg
          "
        >
          {/* Касса */}
          <button
            type="button"
            className="flex w-[72px] flex-col items-center gap-1 text-[10px] text-slate-100"
            onClick={() => setOpenCashier(true)}
          >
            <NavIcon src={ICONS["/cashier"]} alt="Касса" />
            <span>Касса</span>
          </button>

          {/* Вход / Регистрация — bottom sheet */}
          <button
            type="button"
            className="flex w-[72px] flex-col items-center gap-1 text-[10px] text-slate-100 border-l border-slate-700/70"
            onClick={() => {
              setAuthMode("login");
              setOpenAuth(true);
            }}
          >
            <NavIcon src={ICONS["/login"]} alt="Вход" />
            <span>Вход</span>
          </button>

          {/* Пустое место под центральную кнопку */}
          <div className="w-[96px]" />

          {/* Игра */}
          <NavLink href="/go/robinson" label="Играть" iconKey="/robinson" />

          {/* Меню — bottom sheet */}
          <button
            type="button"
            className="flex w-[72px] flex-col items-center gap-1 text-[10px] text-slate-100 border-l border-slate-700/70"
            onClick={() => setOpenMenu(true)}
          >
            <NavIcon src={ICONS["/menu"]} alt="Меню" />
            <span>Меню</span>
          </button>

          {/* Центральная кнопка — Турниры */}
          <button
            type="button"
            onClick={() => setOpenTournaments(true)}
            className="
              absolute
              -top-6 left-1/2
              -translate-x-1/2
              flex items-center justify-center
            "
            aria-label="Tournaments"
          >
            <img
              src="/icons/promotions.png"
              alt="Tournaments"
              className="robinson-head-button"
            />
          </button>
        </nav>
      </div>

      {/* Полёт Робинзона: снизу-слева -> вверх-вправо */}

      {/* Bottom-sheet авторизации (Вход / Регистрация) */}
      {openAuth && (
        <div
          className="
            fixed inset-0 z-50 flex items-end justify-center
            bg-black/60 backdrop-blur-sm pulz-sheet-backdrop
          "
          onClick={() => setOpenAuth(false)}
        >
          <div
            className="w-full max-w-xl rounded-t-3xl bg-[#0b0f1a] px-5 pb-8 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700/60" />

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-100">
                {authMode === "login" ? "Вход" : "Регистрация"}
              </div>

              <button
                type="button"
                onClick={() => setOpenAuth(false)}
                className="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                Закрыть
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <Link
                href="/login"
                className="rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-3 text-center text-sm text-slate-100"
                onClick={() => setOpenAuth(false)}
              >
                Вход
              </Link>

              <Link
                href="/register"
                className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-500"
                onClick={() => setOpenAuth(false)}
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-sheet меню */}
      {openMenu && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm pulz-sheet-backdrop"
          onClick={() => setOpenMenu(false)}
        >
          <div
            className="w-full max-w-xl rounded-t-3xl bg-[#0b0f1a] px-5 pb-8 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700/60" />

            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-100">Меню</div>
              <button
                type="button"
                onClick={() => setOpenMenu(false)}
                className="rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                Закрыть
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <Link
                href="/account"
                className="rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-3 text-center text-sm text-slate-100"
                onClick={() => setOpenMenu(false)}
              >
                Аккаунт
              </Link>

              <Link
                href="/cashier"
                className="rounded-2xl border border-slate-700/70 bg-slate-900/40 px-4 py-3 text-center text-sm text-slate-100"
                onClick={() => setOpenMenu(false)}
              >
                Касса
              </Link>
            </div>
          </div>
        </div>
      )}
    {/* Bottom-sheet: Cashier */}
{openCashier && (
  <div
    className="
      fixed inset-0 z-50 flex items-end justify-center
      bg-black/60 backdrop-blur-sm pulz-sheet-backdrop
    "
    onClick={() => setOpenCashier(false)}
  >
    <div
      className="pulz-sheet w-full max-w-xl rounded-t-3xl border border-blue-400/20 bg-[#0b1020] shadow-[0_0_80px_rgba(59,130,246,0.12)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-white/20" />
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-white font-semibold">Касса</div>
        <button onClick={() => setOpenCashier(false)} className="text-white/60 hover:text-white">✕</button>
      </div>
      <div className="h-[78vh]">
        <iframe
          src="/cashier"
          className="h-full w-full border-0"
          allow="autoplay; clipboard-write"
        />
      </div>
    </div>
  </div>
)}

{/* Bottom-sheet: Tournaments */}
{openTournaments && (
  <div
    className="
      fixed inset-0 z-50 flex items-end justify-center
      bg-black/60 backdrop-blur-sm pulz-sheet-backdrop
    "
    onClick={() => setOpenTournaments(false)}
  >
    <div
      className="pulz-sheet w-full max-w-xl rounded-t-3xl border border-blue-400/20 bg-[#0b1020] shadow-[0_0_80px_rgba(59,130,246,0.12)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-white/20" />
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="text-white font-semibold">Турниры</div>
        <button onClick={() => setOpenTournaments(false)} className="text-white/60 hover:text-white">✕</button>
      </div>
      <div className="h-[78vh]">
        <iframe
          src="/tournaments"
          className="h-full w-full border-0"
          allow="autoplay; clipboard-write"
        />
      </div>
    </div>
  </div>
)}

</>
  );
}

function NavLink({
  href,
  label,
  first,
  iconKey,
}: {
  href: string;
  label: string;
  first?: boolean;
  iconKey?: string;
}) {
  const key = iconKey ?? href;
  const icon = ICONS[key] ?? ICONS["/cashier"];

  return (
    <Link
      href={href}
      className={[
        "flex w-[72px] flex-col items-center gap-1 text-[10px] text-slate-100",
        first ? "" : "border-l border-slate-700/70",
      ].join(" ")}
    >
      <NavIcon src={icon} alt={label} />
      <span>{label}</span>
    </Link>
  );
}

function NavIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="relative h-7 w-7">
      <Image src={src} alt={alt} fill className="object-contain" />
    </span>
  );
}
