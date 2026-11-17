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
