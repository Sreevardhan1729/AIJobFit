import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { projectStats } from "../data/projectStats";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ to, children, ...rest }: any) => React.createElement("a", { href: to, ...rest }, children),
      useLocation: () => ({ hash: "" }),
    };
  },
  { virtual: true }
);
jest.mock("../api", () => ({ getMatch: jest.fn() }));
// CRA's Jest SVG transform builds pre-React-19 elements; the webpack build (svgr) is unaffected.
jest.mock("../svgs/github.svg", () => ({ ReactComponent: () => null }));
jest.mock("../svgs/linkedin.svg", () => ({ ReactComponent: () => null }));
jest.mock("../svgs/leetcode.svg", () => ({ ReactComponent: () => null }));
jest.mock("../data/loadSampleResume", () => ({ loadSampleResumeFile: jest.fn() }));

test("home shows the case-study hero, true stats and every section", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Resume-to-job matching that understands skills, not just keywords."
  );
  expect(screen.getByText("A FULL-STACK NLP PROJECT")).toBeInTheDocument();
  expect(screen.getAllByText(String(projectStats.skills)).length).toBeGreaterThan(0);
  expect(screen.getByRole("link", { name: /Try the demo/ })).toHaveAttribute("href", "#try-it");
  ["try-it", "how-it-works"].forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
  expect(screen.getByText(/not an employer's ATS score, and not hiring odds/)).toBeInTheDocument();
  expect(screen.queryByText(/in seconds/i)).not.toBeInTheDocument();
});

test("the main action, finding jobs for your resume, is one click from the hero", () => {
  render(<Home />);
  expect(screen.getByRole("link", { name: "Find jobs for your resume" })).toHaveAttribute("href", "/get_jobs");
});

test("each tool has a card on the home page", () => {
  render(<Home />);
  const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));
  ["/get_jobs", "/resume_job", "/job"].forEach((href) => expect(hrefs).toContain(href));
  expect(screen.getByRole("link", { name: /Upload your resume and get fresh LinkedIn/ })).toHaveAttribute(
    "href",
    "/get_jobs"
  );
});

test("How it works doesn't show the found skills as if the sample resume had them", () => {
  render(<Home />);
  expect(screen.queryByText("MediaPipe ✓")).not.toBeInTheDocument();
  expect(screen.getByText(/Found in the job/)).toBeInTheDocument();
});
