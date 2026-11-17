import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { join } from "node:path";

// Guards for the paper-and-ink design: none of the template tells come back, and the token pairs we
// put text on stay WCAG AA (4.5:1).
const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const TELLS: [string, RegExp][] = [
  ["old palette", /\b(slate|indigo|emerald|amber|rose|teal)-\d/],
  ["glow and blur", /\bblur-|backdrop-blur/],
  ["template radii", /rounded-(lg|xl|2xl|3xl|full)\b/],
  ["drop shadows", /\bshadow-/],
  ["uppercase labels", /\buppercase\b/],
  ["tracked labels", /tracking-(wide|wider|widest|\[)/],
  ["extrabold type", /font-extrabold/],
];

test("no template tells remain", () => {
  const found = sourceFiles(SRC).flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .flatMap((line, i) =>
        TELLS.filter(([, re]) => re.test(line)).map(([name]) => `${file.slice(SRC.length + 1)}:${i + 1} ${name}`)
      )
  );
  assert.deepEqual(found, []);
});

// WCAG 2 relative luminance and contrast ratio for #rrggbb colors.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("token pairs meet WCAG AA in both themes", () => {
  const palettes = createRequire(import.meta.url)(join(ROOT, "theme.palettes.js"));
  for (const theme of ["light", "dark"]) {
    const c = palettes[theme];
    const pairs: [string, string, string][] = [
      ["ink on paper", c.ink, c.paper],
      ["ink-2 on paper", c.ink2, c.paper],
      ["ink-2 on sheet", c.ink2, c.sheet],
      ["ink on have", c.ink, c.have],
      ["ink on close", c.ink, c.close],
      ["miss-text on sheet", c.missText, c.sheet],
      ["button text (paper) on ink", c.paper, c.ink],
      ["button text (paper) on ink-2 hover", c.paper, c.ink2],
    ];
    for (const [name, fg, bg] of pairs) {
      assert.ok(contrast(fg, bg) >= 4.5, `${theme}: ${name} is ${contrast(fg, bg).toFixed(2)}:1`);
    }
  }
});

// Fixed colors don't follow the theme: white, black, Tailwind's default palette and arbitrary hex values.
// Buttons use paper on ink instead.
const FIXED_COLOR =
  /\b(text|bg|border|ring|outline|decoration|fill|stroke|from|via|to)-(white|black)\b|\b(gray|zinc|neutral|stone|red|orange|yellow|lime|green|cyan|sky|blue|violet|purple|fuchsia|pink)-\d{2,3}\b|\[#[0-9a-fA-F]{3,8}\]/;

test("no fixed colors that won't follow the theme", () => {
  const found = sourceFiles(SRC).flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .flatMap((line, i) => (FIXED_COLOR.test(line) ? [`${file.slice(SRC.length + 1)}:${i + 1}`] : []))
  );
  assert.deepEqual(found, []);
});

// Safari before 16.4 (iOS 15) throws on regex lookbehind, which would take down any page that builds one.
test("no regex lookbehind in app code", () => {
  const found = sourceFiles(SRC).filter((file) => readFileSync(file, "utf8").includes("(?<"));
  assert.deepEqual(found.map((file) => file.slice(SRC.length + 1)), []);
});

// Ink flips to near-white in dark mode, so a translucent ink layer would wash the page out instead of dimming it.
test("overlays dim with the scrim token, not translucent ink", () => {
  const found = sourceFiles(SRC).filter((file) => /\bbg-ink\/\d/.test(readFileSync(file, "utf8")));
  assert.deepEqual(found.map((file) => file.slice(SRC.length + 1)), []);
});

test("public files carry the design, not the create-react-app template", () => {
  const palettes = createRequire(import.meta.url)(join(ROOT, "theme.palettes.js"));
  const manifest = JSON.parse(readFileSync(join(ROOT, "public", "manifest.json"), "utf8"));
  assert.equal(manifest.theme_color, palettes.light.paper);
  assert.equal(manifest.background_color, palettes.light.paper);
  const html = readFileSync(join(ROOT, "public", "index.html"), "utf8");
  assert.match(html, /<link rel="icon" href="%PUBLIC_URL%\/favicon\.svg" type="image\/svg\+xml" \/>/);
  // SHA-1 prefixes of the stock React logos this project started with.
  const STOCK = ["7f4f2d68782a", "46915f9d0269", "1120538c77ad"];
  for (const file of ["logo192.png", "logo512.png", "favicon.ico"]) {
    const sha = createHash("sha1").update(readFileSync(join(ROOT, "public", file))).digest("hex");
    assert.ok(!STOCK.some((prefix) => sha.startsWith(prefix)), `${file} is still the stock React logo`);
  }
});
