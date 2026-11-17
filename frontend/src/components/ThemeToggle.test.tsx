import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";

type Listener = (e: { matches: boolean }) => void;
let listeners: Listener[] = [];

function mockMatchMedia(matches: boolean) {
  listeners = [];
  (window as any).matchMedia = jest.fn(() => ({
    matches,
    addEventListener: (_: string, l: Listener) => listeners.push(l),
    removeEventListener: (_: string, l: Listener) => (listeners = listeners.filter((x) => x !== l)),
  }));
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.dataset.theme = "light";
  mockMatchMedia(false);
});

test("switches to dark, remembers it and relabels itself", () => {
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("theme")).toBe("dark");
  expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
});

test("still switches when storage is blocked", () => {
  const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
  expect(document.documentElement.dataset.theme).toBe("dark");
  setItem.mockRestore();
});

test("follows the device setting live while nothing is stored", () => {
  render(<ThemeToggle />);
  act(() => listeners.forEach((l) => l({ matches: true })));
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
});

test("a stored choice ignores device changes", () => {
  localStorage.setItem("theme", "light");
  render(<ThemeToggle />);
  act(() => listeners.forEach((l) => l({ matches: true })));
  expect(document.documentElement.dataset.theme).toBe("light");
});

test("works without matchMedia", () => {
  (window as any).matchMedia = undefined;
  render(<ThemeToggle />);
  expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
});

test("unreadable storage falls back to the device setting", () => {
  const getItem = jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  delete document.documentElement.dataset.theme;
  mockMatchMedia(true);
  render(<ThemeToggle />);
  expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  getItem.mockRestore();
});

test("a junk stored value still follows the device live", () => {
  localStorage.setItem("theme", "system");
  render(<ThemeToggle />);
  act(() => listeners.forEach((l) => l({ matches: true })));
  expect(document.documentElement.dataset.theme).toBe("dark");
});

test("a choice made in another tab is applied here", () => {
  render(<ThemeToggle />);
  act(() => {
    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "dark" }));
  });
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
});

test("old Safari's addListener is used when addEventListener is missing", () => {
  listeners = [];
  (window as any).matchMedia = jest.fn(() => ({
    matches: false,
    addListener: (l: Listener) => listeners.push(l),
    removeListener: (l: Listener) => (listeners = listeners.filter((x) => x !== l)),
  }));
  render(<ThemeToggle />);
  act(() => listeners.forEach((l) => l({ matches: true })));
  expect(document.documentElement.dataset.theme).toBe("dark");
});

test("the icon-only toggle has a tooltip matching its name", () => {
  render(<ThemeToggle />);
  expect(screen.getByRole("button", { name: "Switch to dark mode" })).toHaveAttribute("title", "Switch to dark mode");
});
