import React from "react";
import { render, screen } from "@testing-library/react";
import MarkedText from "./MarkedText";
import type { SkillMatch, SkillStatus } from "../types";

const skill = (name: string, status: SkillStatus): SkillMatch => ({
  name,
  key: name.toLowerCase(),
  importance: "required",
  weight: 1,
  status,
  credit: status === "matched" ? 1 : status === "partial" ? 0.5 : 0,
  via: null,
  job_term: name,
  resume_term: null,
});

const skills = [skill("Python", "matched"), skill("Docker", "missing"), skill("TensorFlow", "partial")];

test("marks each skill by status", () => {
  render(<MarkedText text="Python, Docker and TensorFlow" skills={skills} />);
  expect(screen.getByText("Python")).toHaveAttribute("data-mark", "have");
  expect(screen.getByText("Docker")).toHaveAttribute("data-mark", "miss");
  expect(screen.getByText("TensorFlow")).toHaveAttribute("data-mark", "close");
});

test("a skill marked as owned reads as have", () => {
  render(<MarkedText text="Docker" skills={skills} have={new Set(["docker"])} />);
  expect(screen.getByText("Docker")).toHaveAttribute("data-mark", "have");
});

test("keeps paragraphs and line breaks", () => {
  const { container } = render(<MarkedText text={"About the job\n\nPython\nDocker"} skills={skills} />);
  expect(container.querySelectorAll("p")).toHaveLength(2);
  expect(container.querySelectorAll("br")).toHaveLength(1);
});
