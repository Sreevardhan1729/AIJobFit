import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// WCAG AA guards for the dark theme: slate-500 text is 3.9–4.2:1 on our surfaces, and white text on
// indigo-500 (4.47:1) or indigo-400 (2.98:1) is below 4.5:1.
const SRC = join(import.meta.dirname, "..", "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const offenders = (check: (line: string) => boolean) =>
  sourceFiles(SRC).flatMap((file) =>
    readFileSync(file, "utf8")
      .split("\n")
      .map((line, i) => ({ where: `${file.slice(SRC.length + 1)}:${i + 1}`, line }))
      .filter(({ line }) => check(line))
      .map(({ where }) => where)
  );

test("no low-contrast slate-500 text (placeholders excepted)", () => {
  assert.deepEqual(offenders((line) => /(?<![\w:-])text-slate-500/.test(line)), []);
});

test("white text never sits on indigo-500 or indigo-400", () => {
  assert.deepEqual(
    offenders((line) => line.includes("text-white") && /(?<![\w-])(hover:)?bg-indigo-(500|400)\b/.test(line)),
    []
  );
});
