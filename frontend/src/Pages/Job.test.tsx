import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Job from "./Job";
import * as api from "../api";
import { SAMPLE_JOB_TEXT } from "../data/sampleJob";

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
jest.mock("../api", () => ({ getJobSkills: jest.fn() }));

test("sample job fills the box and results show as chips", async () => {
  (api.getJobSkills as jest.Mock).mockResolvedValue({ "Required Skills": ["Python"], "Preferred Skills": ["Dlib"] });
  render(<Job />);
  fireEvent.click(screen.getByRole("button", { name: "Use the sample job" }));
  expect(screen.getByRole("textbox")).toHaveValue(SAMPLE_JOB_TEXT);
  fireEvent.click(screen.getByRole("button", { name: /Analyze job/ }));
  expect(await screen.findByText("Python")).toBeInTheDocument();
  expect(screen.getByText("Dlib")).toBeInTheDocument();
});
