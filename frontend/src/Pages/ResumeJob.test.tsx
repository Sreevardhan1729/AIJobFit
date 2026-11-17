import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import ResumeJob from "./ResumeJob";
import * as api from "../api";
import { SAMPLE_JOB_TEXT } from "../data/sampleJob";
import SAMPLE_MATCH from "../data/sampleMatch.json";

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
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: false }) }));
jest.mock("../api", () => ({ getMatch: jest.fn(), listResumes: jest.fn(), deleteResume: jest.fn() }));
jest.mock("../data/loadSampleResume", () => ({
  loadSampleResumeFile: () => Promise.resolve(new File(["%PDF"], "sample-resume.pdf", { type: "application/pdf" })),
}));

test("Try the sample compares anonymously", async () => {
  (api.getMatch as jest.Mock).mockReturnValue(new Promise(() => {}));
  render(<ResumeJob />);
  fireEvent.click(screen.getByRole("button", { name: "Try the sample" }));
  await waitFor(() => expect(screen.getByRole("textbox")).toHaveValue(SAMPLE_JOB_TEXT));
  fireEvent.click(screen.getByRole("button", { name: /Compare skills/ }));
  expect(api.getMatch).toHaveBeenCalledWith(expect.any(File), SAMPLE_JOB_TEXT, undefined, { anonymous: true });
  expect(screen.getByRole("button", { name: /Compare skills/ })).toBeDisabled();
});

test("editing the job text after Try the sample still compares anonymously", async () => {
  (api.getMatch as jest.Mock).mockReset();
  (api.getMatch as jest.Mock).mockReturnValue(new Promise(() => {}));
  render(<ResumeJob />);
  fireEvent.click(screen.getByRole("button", { name: "Try the sample" }));
  await waitFor(() => expect(screen.getByRole("textbox")).toHaveValue(SAMPLE_JOB_TEXT));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "My own target job: Python, SQL" } });
  fireEvent.click(screen.getByRole("button", { name: /Compare skills/ }));
  expect(api.getMatch).toHaveBeenCalledWith(expect.any(File), "My own target job: Python, SQL", undefined, {
    anonymous: true,
  });
});

test("the report marks up the job post that was submitted, not later edits", async () => {
  (api.getMatch as jest.Mock).mockReset();
  (api.getMatch as jest.Mock).mockResolvedValue(SAMPLE_MATCH);
  render(<ResumeJob />);
  fireEvent.click(screen.getByRole("button", { name: "Try the sample" }));
  await waitFor(() => expect(screen.getByRole("textbox")).toHaveValue(SAMPLE_JOB_TEXT));
  fireEvent.click(screen.getByRole("button", { name: /Compare skills/ }));
  const post = await screen.findByRole("button", { name: "The job post, marked up" });
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Something else entirely" } });
  fireEvent.click(post);
  const region = within(screen.getByRole("region", { name: "The job post, marked up" }));
  expect(region.getByText(/We are seeking a skilled/)).toBeInTheDocument();
});
