"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FortuneWheelModal from "@/components/FortuneWheel";

const ICONS: Record<string, string> = {
  "/cashier": "/icons/wallet.png",
  "/login": "/icons/login.png",
  "/games": "/icons/games.png",
  "/menu": "/icons/menu.png",
};

type AuthMode = "login" | "register";

export default function BottomNav() {
  const [openWheel, setOpenWheel] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      {/* снизу по центру, как системный таб-бар */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-0">
        <nav
          className="
            pointer-events-auto
            relative flex w-full max-w-xl items-end justify-between
            rounded-t-[24px]
            bg-[#11141f]/95
            px-2 pb-2 pt-3
            backdrop-blur-lg
          "
        >
          {/* Касса — остаётся обычной страницей */}
          <NavLink href="/cashier" label="Касса" first />

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

          {/* Пустое место под колесо */}
          <div className="w-[96px]" />

          {/* Игры — обычная страница */}
          <NavLink href="/games" label="Игры" />

          {/* Меню — bottom sheet */}
          <button
            type="button"
            className="flex w-[72px] flex-col items-center gap-1 text-[10px] text-slate-100 border-l border-slate-700/70"
            onClick={() => setOpenMenu(true)}
          >
            <NavIcon src={ICONS["/menu"]} alt="Меню" />
            <span>Меню</span>
          </button>

          {/* Колесо по центру */}
          <button
            type="button"
            onClick={() => setOpenWheel(true)}
            className="
              absolute
              -top-6 left-1/2
              -translate-x-1/2
              flex items-center justify-center
            "
          >
            <img
              src="/Pulz-wheel.png"
              alt="Pulz Wheel"
              className="pulz-wheel-animated"
            />
          </button>
        </nav>
      </div>

      {/* Модалка большого колеса */}
      {openWheel && (
        <FortuneWheelModal open={openWheel} onClose={() => setOpenWheel(false)} />
      )}

      {/* Bottom-sheet авторизации (вход/регистрация) */}
      {openAuth && (
        <div
          className="
            fixed inset-0 z-50 flex items-end justify-center
            bg-black/60 backdrop-blur-sm pulz-sheet-backdrop
          "
          onClick={() => setOpenAuth(false)}
        >
          <div
            className="
              pulz-sheet
              w-full max-w-lg rounded-t-3xl border border-slate-800/80
              bg-slate-950/95 px-4 pt-3 pb-6
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Переключатель Вход / Регистрация */}
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`flex-1 rounded-full px-3 py-1.5 uppercase tracking-[0.2em] ${
                  authMode === "login"
                    ? "bg-blue-600 text-slate-50 shadow-[0_0_18px_rgba(37,99,235,0.8)]"
                    : "bg-slate-900 text-slate-400 border border-slate-700/80"
                }`}
              >
                Вход
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
                className={`flex-1 rounded-full px-3 py-1.5 uppercase tracking-[0.2em] ${
                  authMode === "register"
                    ? "bg-blue-600 text-slate-50 shadow-[0_0_18px_rgba(37,99,235,0.8)]"
                    : "bg-slate-900 text-slate-400 border border-slate-700/80"
                }`}
              >
                Регистрация
              </button>
            </div>

            {authMode === "login" ? <LoginSheetContent /> : <RegisterSheetContent />}
          </div>
        </div>
      )}

      {/* Bottom-sheet меню */}
      {openMenu && (
        <div
          className="
            fixed inset-0 z-50 flex items-end justify-center
            bg-black/60 backdrop-blur-sm pulz-sheet-backdrop
          "
          onClick={() => setOpenMenu(false)}
        >
          <div
            className="
              pulz-sheet
              w-full max-w-lg rounded-t-3xl border border-slate-800/80
              bg-slate-950/95 px-4 pt-4 pb-6
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Меню Pulz
              </span>
              <button
                type="button"
                className="text-[11px] text-slate-400 hover:text-slate-200"
                onClick={() => setOpenMenu(false)}
              >
                Закрыть
              </button>
            </div>

            <div className="space-y-2 text-sm text-slate-100">
              <MenuItem href="/profile" label="Профиль" />
              <MenuItem href="/vip" label="VIP-программа" />
              <MenuItem href="/promo" label="Бонусы и акции" />
              <MenuItem href="/help" label="Поддержка" />
              <MenuItem href="/terms" label="Условия и политика" last />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* --- Вспомогательные компоненты --- */

type NavLinkProps = {
  href: string;
  label: string;
  first?: boolean;
};

function NavLink({ href, label, first }: NavLinkProps) {
  const iconSrc = ICONS[href];

  return (
    <Link
      href={href}
      className={`
        flex w-[72px] flex-col items-center text-[10px] text-slate-100
        ${first ? "" : "border-l border-slate-700/70"}
      `}
    >
      <div className="flex flex-col items-center gap-1">
        <NavIcon src={iconSrc} alt={label} />
        <span>{label}</span>
      </div>
    </Link>
  );
}

function NavIcon({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-slate-600/70 bg-black/40" />
    );
  }
  return (
    <Image
      src={src}
      width={26}
      height={26}
      alt={alt}
      className="opacity-95"
    />
  );
}

function LoginSheetContent() {
  return (
    <form className="space-y-3 text-xs">
      <div className="space-y-1">
        <label className="text-slate-300">E-mail или логин</label>
        <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
          <input
            type="text"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="name@pulzwin.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-slate-300">Пароль</label>
        <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
          <input
            type="password"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Введите пароль"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-3 w-3 rounded border-slate-600 bg-slate-900"
          />
          <span>Запомнить меня</span>
        </label>
        <button type="button" className="text-blue-300 hover:text-blue-200">
          Забыли пароль?
        </button>
      </div>

      <button
        type="submit"
        className="mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_24px_rgba(37,99,235,0.95)] hover:bg-blue-500 transition-colors"
      >
        Войти
      </button>
    </form>
  );
}

function RegisterSheetContent() {
  return (
    <form className="space-y-3 text-xs">
      <div className="space-y-1">
        <label className="text-slate-300">E-mail</label>
        <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
          <input
            type="email"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="name@pulzwin.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-slate-300">Пароль</label>
        <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
          <input
            type="password"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Минимум 8 символов"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-slate-300">Промо-код (если есть)</label>
        <div className="flex items-center rounded-2xl border border-slate-700/80 bg-slate-950/90 px-3 py-2 text-sm text-slate-100">
          <input
            type="text"
            className="w-full bg-transparent outline-none placeholder:text-slate-500"
            placeholder="Например: PULZ500"
          />
        </div>
      </div>

      <div className="space-y-2 text-[11px] text-slate-400">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-[2px] h-3 w-3 rounded border-slate-600 bg-slate-900"
          />
          <span>
            Мне уже 18 лет, и я принимаю условия использования и политику
            ответственной игры.
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="mt-1 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_0_24px_rgba(37,99,235,0.95)] hover:bg-blue-500 transition-colors"
      >
        Создать аккаунт
      </button>
    </form>
  );
}

function MenuItem({
  href,
  label,
  last,
}: {
  href: string;
  label: string;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center justify-between rounded-2xl border
        border-slate-800/80 bg-slate-950/90 px-3 py-2 text-sm
        hover:border-blue-500/70 hover:bg-blue-500/5
        ${last ? "mt-2" : ""}
      `}
    >
      <span>{label}</span>
      <span className="text-[11px] text-slate-500">›</span>
    </Link>
  );
}
