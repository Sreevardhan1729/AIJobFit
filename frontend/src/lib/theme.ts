export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

// A stored choice wins; otherwise follow the device. public/index.html runs the same rule before first paint.
export function resolveTheme(stored: string | null, systemDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return systemDark ? "dark" : "light";
}
