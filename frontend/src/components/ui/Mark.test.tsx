import React from "react";
import { render, screen } from "@testing-library/react";
import Mark, { bandMark } from "./Mark";

test("each kind renders its text and names itself", () => {
  render(
    <p>
      <Mark kind="have">Python</Mark>
      <Mark kind="close">TensorFlow</Mark>
      <Mark kind="miss">Docker</Mark>
      <Mark kind="plain">Go</Mark>
    </p>
  );
  expect(screen.getByText("Python")).toHaveAttribute("data-mark", "have");
  expect(screen.getByText("TensorFlow")).toHaveAttribute("data-mark", "close");
  expect(screen.getByText("Docker")).toHaveAttribute("data-mark", "miss");
  expect(screen.getByText("Go")).toHaveAttribute("data-mark", "plain");
});

test("score bands map to marks", () => {
  expect(["emerald", "teal", "amber", "rose"].map((tone) => bandMark(tone as any))).toEqual([
    "have",
    "have",
    "close",
    "miss",
  ]);
});

test("close matches carry a cue besides colour, so they differ from have marks without hue", () => {
  render(<Mark kind="close">TensorFlow</Mark>);
  expect(screen.getByText("TensorFlow").className).toMatch(/decoration-dotted/);
});
