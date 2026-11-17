import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import TryIt from "./TryIt";
import * as api from "../../api";
import SAMPLE_MATCH from "../../data/sampleMatch.json";
import { SAMPLE_JOB_TEXT } from "../../data/sampleJob";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ to, children, ...rest }: any) => React.createElement("a", { href: to, ...rest }, children),
    };
  },
  { virtual: true }
);
jest.mock("../../api", () => ({ getMatch: jest.fn() }));
jest.mock("../../data/loadSampleResume", () => ({
  loadSampleResumeFile: () => Promise.resolve(new File(["%PDF"], "sample-resume.pdf", { type: "application/pdf" })),
}));

// A result the snapshot can't produce: every skill matched, so the report reads 100%.
const allMatched = {
  ...SAMPLE_MATCH,
  score: 100,
  skills: SAMPLE_MATCH.skills.map((s) => ({ ...s, status: "matched", credit: 1, via: null })),
};
const runButton = () => screen.getByRole("button", { name: /Run match|Running/ });

beforeEach(() => {
  (api.getMatch as jest.Mock).mockReset();
});

test("shows the sample result instantly without calling the API", () => {
  render(<TryIt />);
  expect(screen.getByText("Sample result")).toBeInTheDocument();
  expect(screen.getByText(`${SAMPLE_MATCH.score}%`)).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toHaveValue(SAMPLE_JOB_TEXT);
  expect(api.getMatch).not.toHaveBeenCalled();
});

test("running the untouched sample calls the API anonymously and shows the live result", async () => {
  (api.getMatch as jest.Mock).mockResolvedValue(allMatched);
  render(<TryIt />);
  fireEvent.click(runButton());
  expect(await screen.findByText("Live result")).toBeInTheDocument();
  expect(screen.getByText("100%")).toBeInTheDocument();
  expect(api.getMatch).toHaveBeenCalledWith(expect.any(File), SAMPLE_JOB_TEXT, undefined, { anonymous: true });
});

test("editing the job description runs the match on your text", async () => {
  (api.getMatch as jest.Mock).mockResolvedValue(allMatched);
  render(<TryIt />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Requirements: Python, SQL, Docker" } });
  fireEvent.click(runButton());
  expect(await screen.findByText("Your result")).toBeInTheDocument();
  expect(api.getMatch).toHaveBeenCalledWith(
    expect.any(File),
    "Requirements: Python, SQL, Docker",
    undefined,
    { anonymous: true }
  );
});

test("your own resume is sent instead of the sample, without your login", async () => {
  (api.getMatch as jest.Mock).mockResolvedValue(allMatched);
  render(<TryIt />);
  fireEvent.click(screen.getByRole("button", { name: "Use my resume" }));
  const pdf = new File(["%PDF"], "my-cv.pdf", { type: "application/pdf" });
  fireEvent.drop(screen.getByText(/Drop your resume PDF here/), { dataTransfer: { files: [pdf] } });
  expect(screen.getByRole("status")).toHaveTextContent("Resume added: my-cv.pdf");
  expect(screen.getByText("Used for this match only, not saved.")).toBeInTheDocument();
  fireEvent.click(runButton());
  expect(await screen.findByText("Your result")).toBeInTheDocument();
  expect(api.getMatch).toHaveBeenCalledWith(pdf, SAMPLE_JOB_TEXT, undefined, { anonymous: true });
});

test("asks for a file when 'Use my resume' has none", () => {
  render(<TryIt />);
  fireEvent.click(screen.getByRole("button", { name: "Use my resume" }));
  fireEvent.click(runButton());
  expect(screen.getByText("Choose a PDF resume first.")).toBeInTheDocument();
  expect(api.getMatch).not.toHaveBeenCalled();
});

test("Reset to sample restores the sample job and the sample result", async () => {
  (api.getMatch as jest.Mock).mockResolvedValue(allMatched);
  render(<TryIt />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Python" } });
  fireEvent.click(runButton());
  expect(await screen.findByText("Your result")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reset to sample" }));
  expect(screen.getByRole("textbox")).toHaveValue(SAMPLE_JOB_TEXT);
  expect(screen.getByText("Sample result")).toBeInTheDocument();
  expect(screen.getByText(`${SAMPLE_MATCH.score}%`)).toBeInTheDocument();
});

test("points to the job search for your resume", () => {
  render(<TryIt />);
  expect(screen.getByRole("link", { name: /Find jobs that fit your resume/ })).toHaveAttribute("href", "/get_jobs");
});

test("button is disabled while running", async () => {
  (api.getMatch as jest.Mock).mockReturnValue(new Promise(() => {}));
  render(<TryIt />);
  fireEvent.click(runButton());
  expect(await screen.findByText(/can take up to a minute to wake up/)).toBeInTheDocument();
  expect(runButton()).toBeDisabled();
});

test("failed live run keeps the previous result", async () => {
  (api.getMatch as jest.Mock).mockRejectedValue(new Error("timeout"));
  render(<TryIt />);
  fireEvent.click(runButton());
  expect(await screen.findByText(/waking up/)).toBeInTheDocument();
  expect(screen.getByText("Sample result")).toBeInTheDocument();
  expect(runButton()).toBeEnabled();
});

test("the report's job post is the text that produced the result, not the unsent edit", () => {
  render(<TryIt />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Python" } });
  fireEvent.click(screen.getByRole("button", { name: "The job post, marked up" }));
  const region = within(screen.getByRole("region", { name: "The job post, marked up" }));
  expect(region.getByText(/We are seeking a skilled/)).toBeInTheDocument();
});
