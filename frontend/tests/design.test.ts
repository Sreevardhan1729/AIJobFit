import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
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
  ["glow blob", /blur-3xl/],
  ["rounded-2xl cards", /rounded-2xl/],
  ["uppercase labels", /\buppercase\b/],
  ["tracked labels", /tracking-\[/],
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

test("token pairs meet WCAG AA", () => {
  const colors = createRequire(import.meta.url)(join(ROOT, "tailwind.config.js")).theme.extend.colors;
  const pairs: [string, string, string][] = [
    ["ink on paper", colors.ink.DEFAULT, colors.paper],
    ["ink-2 on paper", colors.ink[2], colors.paper],
    ["ink-2 on sheet", colors.ink[2], colors.sheet],
    ["ink on have", colors.ink.DEFAULT, colors.have],
    ["ink on close", colors.ink.DEFAULT, colors.close],
    ["miss-text on sheet", colors.miss.text, colors.sheet],
  ];
  for (const [name, fg, bg] of pairs) {
    assert.ok(contrast(fg, bg) >= 4.5, `${name}: ${contrast(fg, bg).toFixed(2)}:1`);
  }
});

// Safari before 16.4 (iOS 15) throws on regex lookbehind, which would take down any page that builds one.
test("no regex lookbehind in app code", () => {
  const found = sourceFiles(SRC).filter((file) => readFileSync(file, "utf8").includes("(?<"));
  assert.deepEqual(found.map((file) => file.slice(SRC.length + 1)), []);
});
