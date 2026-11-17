import React from "react";
import { render, screen, within } from "@testing-library/react";
import JobCard from "./JobCard";
import type { Importance, SkillStatus } from "../types";

const sk = (name: string, status: SkillStatus, importance: Importance = "required") => ({
  name,
  key: name.toLowerCase(),
  importance,
  weight: importance === "required" ? 1 : 0.5,
  status,
  credit: status === "matched" ? 1 : status === "partial" ? 0.5 : 0,
  via: null,
  job_term: name,
  resume_term: null,
});

export const job = {
  id: "1", title: "ML Engineer", company: "Acme", location: "Remote", site: "indeed", job_type: "fulltime",
  job_url: "#", date_posted: "2026-11-10", similarity_score: 50,
  match: {
    score: 50,
    skills: [sk("Python", "matched"), sk("SQL", "matched"), sk("AWS", "matched"), sk("Git", "matched"),
             sk("Docker", "missing"), sk("GCP", "missing", "preferred")],
  },
} as any;

test("card shows band, score and skill preview", () => {
  render(<JobCard job={job} index={0} />);
  expect(screen.getByText("Good match")).toBeInTheDocument();
  expect(screen.getByText("50%")).toBeInTheDocument();
  const matches = screen.getByText(/^Matches:/);
  expect(matches).toHaveTextContent("Matches: Python, SQL, AWS");
  expect(within(matches).getByText("Python")).toHaveAttribute("data-mark", "have");
  const missing = screen.getByText(/^Missing:/);
  expect(missing).toHaveTextContent("Missing: Docker, GCP");
  expect(within(missing).getByText("Docker")).toHaveAttribute("data-mark", "miss");
  expect(screen.getByText("Good match")).toHaveAttribute("data-mark", "have");
});

test("JobCard renders without match data", () => {
  render(<JobCard job={{ ...job, match: undefined }} index={0} />);
  expect(screen.getByText("ML Engineer")).toBeInTheDocument();
  expect(screen.queryByText(/^Matches:/)).not.toBeInTheDocument();
});
