import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GetJobs from "./GetJobs";

// CRA's Jest 27 can't resolve react-router-dom v7 or axios 1.x (it ignores package "exports"),
// so mock the router hook and the search form (hidden once a search is submitted).
jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }), { virtual: true });
jest.mock("../components/JobSearchForm", () => () => null);

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
