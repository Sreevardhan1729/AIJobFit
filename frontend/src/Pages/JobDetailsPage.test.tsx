import React from "react";
import { render, screen } from "@testing-library/react";
import JobDetailsPage from "./JobDetailsPage";

const mockJob = {
  id: "1", title: "ML Engineer", company: "Acme", location: "Remote", site: "indeed", job_type: "fulltime",
  job_url: "#", date_posted: "2026-11-10", similarity_score: 50, description: "Build models.",
  common_skills: [], uncommon_skills: [],
};

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ to, children, ...rest }: any) => React.createElement("a", { href: to, ...rest }, children),
      useNavigate: () => jest.fn(),
      useLocation: () => ({ state: { job: mockJob } }),
      useParams: () => ({ id: "1" }),
    };
  },
  { virtual: true }
);

test("details page without match shows a notice", () => {
  render(<JobDetailsPage />);
  expect(screen.getByText("ML Engineer")).toBeInTheDocument();
  expect(screen.getByText("Match details aren't available for this job.")).toBeInTheDocument();
});
