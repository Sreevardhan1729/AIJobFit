import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

const open = (name: RegExp) => fireEvent.click(screen.getByRole("button", { name }));

test("leads with the score, a one-line summary, the biggest gaps and experience", () => {
  render(<MatchReport result={result} />);
  expect(screen.getByText("50%")).toBeInTheDocument();
  expect(screen.getByText("Good match")).toBeInTheDocument();
  expect(screen.getByText("Estimate from skill overlap, not an employer's ATS score.")).toBeInTheDocument();
  expect(screen.getByText("You have 1 of 3 skills the job asks for, plus 1 close match.")).toBeInTheDocument();
  expect(screen.getByText("Biggest gaps")).toBeInTheDocument();
  expect(screen.getByText("Docker")).toBeInTheDocument();
  expect(screen.getByText("Job asks: 3+ yrs")).toBeInTheDocument();
  expect(screen.getByText("Your resume: ~2.5 yrs (estimate)")).toBeInTheDocument();
  expect(screen.queryByText("Education")).not.toBeInTheDocument();
});

test("skill lists and tips stay collapsed until opened", () => {
  render(<MatchReport result={result} />);
  expect(screen.queryByText("via PyTorch")).not.toBeInTheDocument();
  expect(screen.queryByText("Use the job's wording.")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Missing skills (1)" })).toHaveAttribute("aria-expanded", "false");
  open(/Close matches/);
  expect(screen.getByText("via PyTorch")).toBeInTheDocument();
  expect(screen.getByText("preferred")).toBeInTheDocument();
  open(/Tips/);
  expect(screen.getByText("Use the job's wording.")).toBeInTheDocument();
});

test("breakdown adds up and follows what-if marks", () => {
  render(<MatchReport result={result} />);
  open(/How this is scored/);
  expect(screen.getByText("You have 1.25 of 2.5 points → 50%.")).toBeInTheDocument();
  expect(
    screen.getByText("Required: 1 matched, 0 partial of 2 · Preferred: 0 matched, 1 partial of 1")
  ).toBeInTheDocument();
  open(/Missing skills/);
  fireEvent.click(screen.getByRole("button", { name: /Docker/ }));
  expect(screen.getByText("You have 2.25 of 2.5 points → 90%.")).toBeInTheDocument();
  expect(screen.getByText("Strong match")).toBeInTheDocument();
});

test("the what-if hint sits with the skills you can mark", () => {
  const { rerender } = render(<MatchReport result={result} />);
  expect(screen.queryByText(/only if you really have it/)).not.toBeInTheDocument();
  open(/Missing skills/);
  expect(screen.getByText(/only if you really have it/)).toBeInTheDocument();
  rerender(<MatchReport result={{ ...result, skills: [result.skills[0]] }} />);
  expect(screen.queryByRole("button", { name: /Missing skills/ })).not.toBeInTheDocument();
  expect(screen.queryByText(/only if you really have it/)).not.toBeInTheDocument();
});

test("marking a missing skill recomputes the score and the summary", () => {
  render(<MatchReport result={result} />);
  open(/Missing skills/);
  fireEvent.click(screen.getByRole("button", { name: /Docker/ }));
  expect(screen.getByText("90%")).toBeInTheDocument();
  expect(screen.getByText(/was 50%/)).toBeInTheDocument();
  expect(screen.getByText("You have 2 of 3 skills the job asks for, plus 1 close match.")).toBeInTheDocument();
  expect(screen.queryByText("Biggest gaps")).not.toBeInTheDocument();
});

test("matched skills are not toggleable", () => {
  render(<MatchReport result={result} />);
  open(/Matched skills/);
  expect(screen.getByText("Python")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Python/ })).not.toBeInTheDocument();
});

test("long lists show 8 skills and a Show all button", () => {
  const many = Array.from({ length: 11 }, (_, i) => skill(`Skill ${i + 1}`, "missing"));
  render(<MatchReport result={{ ...result, score: 0, skills: many }} />);
  expect(screen.getByText("and 8 more")).toBeInTheDocument();
  open(/Missing skills/);
  expect(screen.getAllByRole("button", { name: /^Skill \d+$/ })).toHaveLength(8);
  open(/Show all 11/);
  expect(screen.getAllByRole("button", { name: /^Skill \d+$/ })).toHaveLength(11);
});

test("no job skills shows a message instead of a score", () => {
  render(<MatchReport result={{ ...result, score: null, skills: [] }} />);
  expect(screen.getByText("No skills found in this job description.")).toBeInTheDocument();
  expect(screen.queryByText(/%/)).not.toBeInTheDocument();
});

const expanders = () => screen.getAllByRole("button").filter((button) => button.hasAttribute("aria-expanded"));

test("the marked-up job post is the first detail section and follows what-if marks", () => {
  render(<MatchReport result={result} jobText="Python, Docker" />);
  const post = screen.getByRole("button", { name: "The job post, marked up" });
  expect(expanders().indexOf(post)).toBe(1); // right after "How this is scored"
  expect(post).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(post);
  const region = screen.getByRole("region", { name: "The job post, marked up" });
  expect(within(region).getByText("Docker")).toHaveAttribute("data-mark", "miss");
  expect(within(region).getByText("Python")).toHaveAttribute("data-mark", "have");
  open(/Missing skills/);
  fireEvent.click(screen.getByRole("button", { name: /Docker/ }));
  expect(within(region).getByText("Docker")).toHaveAttribute("data-mark", "have");
});

test("jobTextOpen starts the job post open", () => {
  render(<MatchReport result={result} jobText="Python, Docker" jobTextOpen />);
  expect(screen.getByRole("button", { name: "The job post, marked up" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("region", { name: "The job post, marked up" })).toBeInTheDocument();
});

test("no job text, no job post section", () => {
  const { rerender } = render(<MatchReport result={result} />);
  expect(screen.queryByRole("button", { name: "The job post, marked up" })).not.toBeInTheDocument();
  rerender(<MatchReport result={result} jobText="   " />);
  expect(screen.queryByRole("button", { name: "The job post, marked up" })).not.toBeInTheDocument();
});

test("the band reads as a mark", () => {
  render(<MatchReport result={result} />);
  expect(screen.getByText("Good match")).toHaveAttribute("data-mark", "have");
});

test("the marked-up post can be scrolled from the keyboard", () => {
  render(<MatchReport result={result} jobText="Python, Docker" jobTextOpen />);
  const region = screen.getByRole("region", { name: "The job post, marked up" });
  expect(region.querySelector('[tabindex="0"]')).toHaveTextContent("Python, Docker");
});
