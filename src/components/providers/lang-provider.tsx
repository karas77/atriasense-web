"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { content, type Content, type Lang } from "@/lib/content";

type LangState = { lang: Lang; t: Content; toggle: () => void };

const LangContext = createContext<LangState | null>(null);

// Dil tercihi localStorage'da; sunucuda her zaman "tr".
const listeners = new Set<() => void>();
function readLang(): Lang {
  try {
    return localStorage.getItem("lang") === "en" ? "en" : "tr";
  } catch {
    return "tr";
  }
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "tr" as Lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = content[lang].meta.title;
  }, [lang]);

  const toggle = useCallback(() => {
    try {
      localStorage.setItem("lang", readLang() === "tr" ? "en" : "tr");
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  const value = useMemo(() => ({ lang, t: content[lang], toggle }), [lang, toggle]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
