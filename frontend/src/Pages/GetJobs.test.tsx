import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GetJobs from "./GetJobs";

// CRA's Jest 27 can't resolve react-router-dom v7 or axios 1.x (it ignores package "exports"),
// so mock the router hook and the search form (hidden once a search is submitted).
jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock("../components/JobSearchForm", () => () => "SEARCH FORM");

let mockSearchState: any;
jest.mock("../hooks/useJobSearch", () => ({ useJobSearch: () => mockSearchState }));

const skill = (name: string, status: string) => ({ name, key: name.toLowerCase(), status });
const job = (id: string, title: string, skills: ReturnType<typeof skill>[]) => ({
  id, title, company: "Acme", location: "Remote", job_type: "fulltime", job_url: "#",
  similarity_score: 50, match: { skills },
});

const renderPage = (jobsResult: any[]) => {
  mockSearchState = { jobsResult, isLoading: false, error: "", submitted: true, search: jest.fn(), reset: jest.fn() };
  return render(<GetJobs />);
};

test("shows an empty state when the search finds no jobs", () => {
  renderPage([]);
  expect(screen.getByText("No jobs found. Try a different search.")).toBeInTheDocument();
});

test("clicking a gap filters the cards to jobs missing that skill", async () => {
  renderPage([
    job("1", "Backend Engineer", [skill("Docker", "missing")]),
    job("2", "Data Engineer", [skill("Docker", "matched"), skill("Spark", "missing")]),
  ]);
  fireEvent.click(screen.getByRole("button", { name: /Docker · missing in 1 of 2/ }));
  expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByText("Data Engineer")).not.toBeInTheDocument());
});

test("shows search progress while loading", () => {
  mockSearchState = { jobsResult: [], isLoading: true, error: "", submitted: false, search: jest.fn(), reset: jest.fn() };
  render(<GetJobs />);
  expect(screen.getByText("Searching LinkedIn / Indeed…")).toBeInTheDocument();
  expect(screen.getByText("Usually 20–60 seconds")).toBeInTheDocument();
});

test("before any search the form is open and there is no summary bar", () => {
  mockSearchState = { jobsResult: [], isLoading: false, error: "", submitted: false, search: jest.fn(), lastSearch: null };
  render(<GetJobs />);
  expect(screen.getByText("SEARCH FORM")).toBeVisible();
  expect(screen.queryByRole("button", { name: "Edit search" })).not.toBeInTheDocument();
});

test("after results, the form collapses into a summary bar that can reopen it", () => {
  mockSearchState = {
    jobsResult: [job("1", "Backend Engineer", [skill("Docker", "missing")])],
    isLoading: false, error: "", submitted: true, search: jest.fn(),
    lastSearch: { selectedSites: ["linkedin", "indeed"], searchTerm: "ML Engineer", country: "India", city: "Bangalore",
      jobType: "fulltime", resumeFile: new File(["%PDF"], "jane-doe.pdf", { type: "application/pdf" }) },
  };
  render(<GetJobs />);
  expect(screen.getByText("ML Engineer · Full-Time · Bangalore, India · LinkedIn + Indeed · jane-doe.pdf")).toBeInTheDocument();
  expect(screen.getByText("SEARCH FORM")).not.toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Edit search" }));
  expect(screen.getByText("SEARCH FORM")).toBeVisible();
});
