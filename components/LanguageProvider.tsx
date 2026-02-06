"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t as translate } from "@/lib/i18n";

type LangCtx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: Parameters<typeof translate>[1]) => string;
};

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = "pulz_lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "ru";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "ru") return saved;
  const nav = (navigator.language || "").toLowerCase();
  return nav.startsWith("en") ? "en" : "ru";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    setLangState(readInitialLang());
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000`;
    } catch {}
  };

  const value = useMemo<LangCtx>(() => {
    return {
      lang,
      setLang,
      t: (key) => translate(lang, key),
    };
  }, [lang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLang must be used within LanguageProvider");
  return v;
}
