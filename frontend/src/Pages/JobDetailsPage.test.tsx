import React from "react";
import { render, screen } from "@testing-library/react";
import JobDetailsPage from "./JobDetailsPage";

const mockJob = {
  id: "1", title: "ML Engineer", company: "Acme", location: "Remote", site: "indeed", job_type: "fulltime",
  job_url: "#", date_posted: "2026-11-10", similarity_score: 50, description: "Build models.",
  common_skills: [], uncommon_skills: [],
};

const skill = (name: string, status: "matched" | "missing") => ({
  name, key: name.toLowerCase(), importance: "required", weight: 1, status,
  credit: status === "matched" ? 1 : 0, via: null, job_term: name, resume_term: null,
});

const match = {
  score: 50,
  skills: [skill("Python", "matched"), skill("Docker", "missing")],
  experience: { required_years: null, resume_years: null, status: "unknown" },
  education: { required_level: null, resume_level: null, status: "unknown" },
  tips: [],
};

let mockState: any = { job: mockJob };

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ to, children, ...rest }: any) => React.createElement("a", { href: to, ...rest }, children),
      useNavigate: () => jest.fn(),
      useLocation: () => ({ state: mockState }),
      useParams: () => ({ id: "1" }),
    };
  },
  { virtual: true }
);

beforeEach(() => {
  mockState = { job: mockJob };
});

test("details page without match shows a notice", () => {
  render(<JobDetailsPage />);
  expect(screen.getByText("ML Engineer")).toBeInTheDocument();
  expect(screen.getByText("Match details aren't available for this job.")).toBeInTheDocument();
});

test("a job without a match keeps the plain description", () => {
  render(<JobDetailsPage />);
  expect(screen.getByRole("button", { name: "Job description" })).toBeInTheDocument();
  expect(screen.getByText("Build models.")).toBeInTheDocument();
});

test("a matched job shows its post once, marked up and open", () => {
  mockState = { job: { ...mockJob, description: "Build models with **Python** and Docker.", match } };
  render(<JobDetailsPage />);
  expect(screen.getByRole("button", { name: "The job post, marked up" })).toHaveAttribute("aria-expanded", "true");
  expect(screen.queryByRole("button", { name: "Job description" })).not.toBeInTheDocument();
  const region = screen.getByRole("region", { name: "The job post, marked up" });
  expect(region).toHaveTextContent("Build models with Python and Docker.");
});

test("an empty description shows no job post section", () => {
  mockState = { job: { ...mockJob, description: "", match } };
  render(<JobDetailsPage />);
  expect(screen.queryByRole("button", { name: "The job post, marked up" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Job description" })).not.toBeInTheDocument();
});

test("a match without a score still shows the job description", () => {
  mockState = { job: { ...mockJob, match: { ...match, score: null, skills: [] } } };
  render(<JobDetailsPage />);
  expect(screen.getByRole("button", { name: "Job description" })).toBeInTheDocument();
  expect(screen.getByText("Build models.")).toBeInTheDocument();
});
