import { useEffect, useState } from "react";
import { resolveTheme, THEME_KEY } from "../lib/theme";
import type { Theme } from "../lib/theme";

// localStorage throws in some private modes; the theme then lasts until reload.
function readStored(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

const isChoice = (value: string | null) => value === "light" || value === "dark";

const darkQuery = () =>
  typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  // Keep the browser chrome in step with an override of the device setting.
  const paper = getComputedStyle(root).getPropertyValue("--paper").trim();
  if (paper) document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", `rgb(${paper})`));
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") return current;
    return resolveTheme(readStored(), Boolean(darkQuery()?.matches));
  });
  const [chosen, setChosen] = useState(() => isChoice(readStored()));

  useEffect(() => apply(theme), [theme]);

  // With no stored choice, follow the device setting as it changes.
  useEffect(() => {
    const query = darkQuery();
    if (chosen || !query) return;
    const onChange = (e: { matches: boolean }) => setTheme(e.matches ? "dark" : "light");
    if (query.addEventListener) {
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    }
    query.addListener?.(onChange); // Safari 13 and older
    return () => query.removeListener?.(onChange);
  }, [chosen]);

  // A choice made in another tab applies here too.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_KEY) return;
      setChosen(isChoice(e.newValue));
      setTheme(resolveTheme(e.newValue, Boolean(darkQuery()?.matches)));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: switch anyway.
    }
    setChosen(true);
    setTheme(next);
  };

  return { theme, toggle };
}
