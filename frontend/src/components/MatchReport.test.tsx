import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MatchReport from "./MatchReport";
import type { Importance, MatchResult, SkillMatch, SkillStatus } from "../types";

const skill = (
  name: string,
  status: SkillStatus,
  importance: Importance = "required",
  via: string | null = null
): SkillMatch => ({
  name,
  key: name.toLowerCase(),
  importance,
  weight: importance === "required" ? 1 : 0.5,
  status,
  credit: status === "matched" ? 1 : status === "partial" ? 0.5 : 0,
  via,
  job_term: name,
  resume_term: status === "matched" ? name : null,
});

const result: MatchResult = {
  score: 50,
  skills: [skill("Python", "matched"), skill("Docker", "missing"), skill("TensorFlow", "partial", "preferred", "PyTorch")],
  experience: { required_years: 3, resume_years: 2.5, status: "below" },
  education: { required_level: null, resume_level: null, status: "unknown" },
  tips: [{ skill: "Python", job_term: "Python", resume_term: "py", message: "Use the job's wording." }],
};

test("shows score, band, caption, partial source, experience and tips", () => {
  render(<MatchReport result={result} />);
  expect(screen.getByText("50%")).toBeInTheDocument();
  expect(screen.getByText("Good match")).toBeInTheDocument();
  expect(screen.getByText("Estimate from skill overlap, not an employer's ATS score.")).toBeInTheDocument();
  expect(screen.getByText("via PyTorch")).toBeInTheDocument();
  expect(screen.getByText("preferred")).toBeInTheDocument();
  expect(screen.getByText("Job asks: 3+ yrs")).toBeInTheDocument();
  expect(screen.getByText("Your resume: ~2.5 yrs (estimate)")).toBeInTheDocument();
  expect(screen.queryByText("Education")).not.toBeInTheDocument();
  expect(screen.getByText("Use the job's wording.")).toBeInTheDocument();
});

test("breakdown adds up and follows what-if marks", () => {
  render(<MatchReport result={result} />);
  fireEvent.click(screen.getByRole("button", { name: "How this is scored" }));
  expect(screen.getByText("You have 1.25 of 2.5 points → 50%.")).toBeInTheDocument();
  expect(
    screen.getByText("Required: 1 matched, 0 partial of 2 · Preferred: 0 matched, 1 partial of 1")
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Docker/ }));
  expect(screen.getByText("You have 2.25 of 2.5 points → 90%.")).toBeInTheDocument();
  expect(screen.getByText("Strong match")).toBeInTheDocument();
});

test("hint only when something can be marked", () => {
  const { rerender } = render(<MatchReport result={result} />);
  expect(screen.getByText(/only if you really have it/)).toBeInTheDocument();
  rerender(<MatchReport result={{ ...result, skills: [result.skills[0]] }} />);
  expect(screen.queryByText(/only if you really have it/)).not.toBeInTheDocument();
});

test("marking a missing skill recomputes the score", () => {
  render(<MatchReport result={result} />);
  fireEvent.click(screen.getByRole("button", { name: /Docker/ }));
  expect(screen.getByText("90%")).toBeInTheDocument();
  expect(screen.getByText(/was 50%/)).toBeInTheDocument();
});

test("matched skills are not toggleable", () => {
  render(<MatchReport result={result} />);
  expect(screen.queryByRole("button", { name: /Python/ })).not.toBeInTheDocument();
});

test("no job skills shows a message instead of a score", () => {
  render(<MatchReport result={{ ...result, score: null, skills: [] }} />);
  expect(screen.getByText("No skills found in this job description.")).toBeInTheDocument();
  expect(screen.queryByText(/%/)).not.toBeInTheDocument();
});
