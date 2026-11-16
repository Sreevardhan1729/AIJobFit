import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./Home";
import { projectStats } from "../data/projectStats";
import { GITHUB_URL } from "../components/Navbar";

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
jest.mock("../data/loadSampleResume", () => ({ loadSampleResumeFile: jest.fn() }));

const hrefs = () => screen.getAllByRole("link").map((link) => link.getAttribute("href"));

test("the hero says what the app does and leads to the job search", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "See how well your resume fits a job, and find jobs that fit it."
  );
  expect(screen.getByRole("link", { name: "Find jobs for your resume" })).toHaveAttribute("href", "/get_jobs");
  expect(screen.getByRole("link", { name: "Try a quick demo" })).toHaveAttribute("href", "#try-it");
  expect(screen.getByRole("link", { name: "compare with one job" })).toHaveAttribute("href", "/resume_job");
  expect(screen.getByRole("link", { name: "analyze a job post" })).toHaveAttribute("href", "/job");
  expect(screen.queryByText(/in seconds/i)).not.toBeInTheDocument();
});

test("the page has four sections and no second row of tool cards", () => {
  render(<Home />);
  ["try-it", "how-it-works", "about"].forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
  expect(screen.queryByRole("link", { name: /Upload your resume and get fresh LinkedIn/ })).not.toBeInTheDocument();
  expect(hrefs().filter((href) => href === GITHUB_URL)).toHaveLength(1);
});

test("How it works shows the pipeline and keeps the stage details behind a toggle", () => {
  render(<Home />);
  expect(screen.getByText(`${projectStats.skills}-skill dictionary`)).toBeInTheDocument();
  expect(screen.queryByText(/Found in the job/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Technical details/ }));
  expect(screen.getByText(/Found in the job/)).toBeInTheDocument();
  expect(screen.queryByText("MediaPipe ✓")).not.toBeInTheDocument();
  expect(screen.getByText(/not an employer's ATS score, and not hiring odds/)).toBeInTheDocument();
});

test("About sums up the project in one block with true test counts", () => {
  render(<Home />);
  expect(screen.getByText(/Built by Sree Vardhan Reddy/)).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(`${projectStats.backendTests} backend and ${projectStats.frontendTests} frontend tests`))
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /API docs/ })).toHaveAttribute(
    "href",
    "https://sreevardhan1729-aijobfit-backend.hf.space/docs"
  );
});
