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

test("shows the score, partial source, experience row and tips", () => {
  render(<MatchReport result={result} />);
  expect(screen.getByText("50%")).toBeInTheDocument();
  expect(screen.getByText("via PyTorch")).toBeInTheDocument();
  expect(screen.getByText("preferred")).toBeInTheDocument();
  expect(screen.getByText(/Job asks 3\+ yrs/)).toHaveTextContent("~2.5 yrs (estimate)");
  expect(screen.queryByText("Education")).not.toBeInTheDocument();
  expect(screen.getByText("Use the job's wording.")).toBeInTheDocument();
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
