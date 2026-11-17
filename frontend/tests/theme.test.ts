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
