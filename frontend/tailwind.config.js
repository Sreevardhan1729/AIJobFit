const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const palettes = require("./theme.palettes");

// Palette key → CSS variable name. Colors are CSS variables so every token class follows the theme.
const VARS = {
  paper: "paper", sheet: "sheet", ink: "ink", ink2: "ink-2", rule: "rule", ruleSoft: "rule-soft",
  have: "have", close: "close", miss: "miss", missText: "miss-text", missSoft: "miss-soft", scrim: "scrim",
};
// "#F5F5F2" → "245 245 242", so opacity modifiers like bg-paper/95 still work.
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");
const cssVars = (palette) =>
  Object.fromEntries(Object.entries(VARS).map(([key, name]) => [`--${name}`, channels(palette[key])]));
const color = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: color("paper"),
        sheet: color("sheet"),
        ink: { DEFAULT: color("ink"), 2: color("ink-2") },
        rule: { DEFAULT: color("rule"), soft: color("rule-soft") },
        have: color("have"),
        close: color("close"),
        miss: { DEFAULT: color("miss"), text: color("miss-text"), soft: color("miss-soft") },
        scrim: color("scrim"),
      },
      fontFamily: {
        sans: ["Public Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Newsreader", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [
    // public/index.html sets data-theme before first paint; useTheme changes it at runtime.
    plugin(({ addBase }) =>
      addBase({
        ":root": { ...cssVars(palettes.light), colorScheme: "light" },
        ':root[data-theme="dark"]': { ...cssVars(palettes.dark), colorScheme: "dark" },
      })
    ),
  ],
}
