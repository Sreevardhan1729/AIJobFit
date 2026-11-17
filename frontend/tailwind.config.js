const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const palettes = require("./theme.palettes");

// Colors are CSS variables (see theme.palettes.js), so every token class follows the theme.
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
    plugin(({ addBase }) => addBase(palettes.baseStyles())),
  ],
}
