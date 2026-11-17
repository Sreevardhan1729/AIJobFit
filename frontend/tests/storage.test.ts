import { test } from "node:test";
import assert from "node:assert/strict";
import { readStorage, removeStorage, writeStorage } from "../src/lib/storage.ts";

const blocked = () => {
  throw new Error("SecurityError: storage is blocked");
};

test("blocked storage reads as empty and writes are dropped", () => {
  (globalThis as any).localStorage = { getItem: blocked, setItem: blocked, removeItem: blocked };
  assert.equal(readStorage("token"), null);
  assert.doesNotThrow(() => writeStorage("token", "abc"));
  assert.doesNotThrow(() => removeStorage("token"));
});

test("working storage reads back what was written", () => {
  const data = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => data.set(k, v),
    removeItem: (k: string) => data.delete(k),
  };
  writeStorage("token", "abc");
  assert.equal(readStorage("token"), "abc");
  removeStorage("token");
  assert.equal(readStorage("token"), null);
});
