import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveTheme } from "../src/lib/theme.ts";

test("a stored choice wins, otherwise the device setting", () => {
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(resolveTheme("junk", false), "light");
});

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import vm from "node:vm";

const ROOT = join(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const palettes = require(join(ROOT, "theme.palettes.js"));

// Runs public/index.html's pre-paint script against a fake page; returns data-theme and the theme-color metas.
function runPrePaint(stored: string | null | "throws", systemDark: boolean | "missing") {
  const html = readFileSync(join(ROOT, "public", "index.html"), "utf8");
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((s) => s.includes("data-theme"));
  assert.ok(script, "pre-paint script not found");
  const attrs: Record<string, string> = {};
  const metas = [0, 1].map(() => ({ content: "", setAttribute(_: string, v: string) { this.content = v; } }));
  const window: any = {
    localStorage: { getItem: () => { if (stored === "throws") throw new Error("blocked"); return stored; } },
    matchMedia: systemDark === "missing" ? undefined : () => ({ matches: systemDark }),
  };
  const document = {
    documentElement: { setAttribute: (k: string, v: string) => (attrs[k] = v) },
    querySelectorAll: () => metas,
  };
  vm.runInNewContext(script!, { window, document, localStorage: window.localStorage });
  return { theme: attrs["data-theme"], metas: metas.map((m) => m.content) };
}

test("the pre-paint script follows resolveTheme and paints the browser bar to match", () => {
  const cases: [string | null | "throws", boolean | "missing"][] = [
    ["dark", false], ["light", true], [null, true], [null, false], ["junk", true], ["throws", true], [null, "missing"],
  ];
  for (const [stored, system] of cases) {
    const { theme, metas } = runPrePaint(stored, system);
    const expected = resolveTheme(stored === "throws" ? null : stored, system === true);
    assert.equal(theme, expected, `stored=${stored} system=${system}`);
    assert.deepEqual(metas, [palettes[expected].paper, palettes[expected].paper]);
  }
});

test("printing always uses the light palette", () => {
  const base = palettes.baseStyles();
  const print = base["@media print"][':root[data-theme="dark"]'];
  assert.equal(print["--paper"], base[":root"]["--paper"]);
  assert.equal(print["--ink"], base[":root"]["--ink"]);
  assert.equal(print.colorScheme, "light");
});
