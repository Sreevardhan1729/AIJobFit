// The two palettes of the paper-and-ink design, read by tailwind.config.js and the tests.
// Green, yellow and red are only ever skill marks: have, close and missing.
const palettes = {
  light: {
    paper: "#F5F5F2",
    sheet: "#FFFFFF",
    ink: "#1C1C1F",
    ink2: "#45464D",
    rule: "#DCDBD5",
    ruleSoft: "#E6E5E0",
    have: "#C8EDB9",
    close: "#FBE38A",
    miss: "#C8412B",
    missText: "#A8321F",
    missSoft: "#F6D3CB",
    scrim: "#1C1C1F", // dims the page behind a modal
  },
  // Warm charcoal with off-white ink; the highlighter marks become muted tints so long posts stay calm.
  dark: {
    paper: "#151514",
    sheet: "#1D1D1B",
    ink: "#ECEAE4",
    ink2: "#AAA9A2",
    rule: "#363531",
    ruleSoft: "#2A2927",
    have: "#2F4D27",
    close: "#5C4B12",
    miss: "#E5694F",
    missText: "#F08C76",
    missSoft: "#4A2A23",
    scrim: "#000000",
  },
};

// Palette key → CSS variable name. Tailwind reads colors from these variables, so every token class follows
// the theme; channels ("245 245 242") keep opacity modifiers like bg-paper/95 working.
const VARS = {
  paper: "paper", sheet: "sheet", ink: "ink", ink2: "ink-2", rule: "rule", ruleSoft: "rule-soft",
  have: "have", close: "close", miss: "miss", missText: "miss-text", missSoft: "miss-soft", scrim: "scrim",
};
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ");
const cssVars = (palette) =>
  Object.fromEntries(Object.entries(VARS).map(([key, name]) => [`--${name}`, channels(palette[key])]));

// Light on :root, dark under data-theme="dark", and light again on paper when printing.
palettes.baseStyles = () => ({
  ":root": { ...cssVars(palettes.light), colorScheme: "light" },
  ':root[data-theme="dark"]': { ...cssVars(palettes.dark), colorScheme: "dark" },
  "@media print": { ':root[data-theme="dark"]': { ...cssVars(palettes.light), colorScheme: "light" } },
});

module.exports = palettes;
