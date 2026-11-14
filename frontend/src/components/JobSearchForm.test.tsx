import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import JobSearchForm from "./JobSearchForm";

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
jest.mock("../api", () => ({ listResumes: jest.fn(), deleteResume: jest.fn() }));

const renderForm = () => {
  const onSubmit = jest.fn();
  render(<JobSearchForm onSubmit={onSubmit} isLoading={false} error="" />);
  return onSubmit;
};

test("leads with the resume, then what and where, then sources", () => {
  renderForm();
  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Your resume",
    "What and where",
    "Sources",
  ]);
});

test("starts with sensible defaults", () => {
  renderForm();
  expect(screen.getByRole("button", { name: "LinkedIn" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Indeed" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByLabelText("Job type")).toHaveValue("fulltime");
  expect(screen.getByLabelText("Country")).toHaveValue("India");
  expect(screen.getByText("Usually takes 20–60 seconds")).toBeInTheDocument();
});

test("says exactly what's missing instead of submitting", () => {
  const onSubmit = renderForm();
  fireEvent.click(screen.getByRole("button", { name: /Find matching jobs/ }));
  expect(screen.getByText("Still needed: your resume, a job title, a city.")).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("submits the filled-in search", () => {
  const onSubmit = renderForm();
  const pdf = new File(["%PDF"], "cv.pdf", { type: "application/pdf" });
  fireEvent.drop(screen.getByText(/Drop your resume PDF here/), { dataTransfer: { files: [pdf] } });
  fireEvent.change(screen.getByLabelText("Job title or keyword"), { target: { value: "ML Engineer" } });
  fireEvent.change(screen.getByLabelText("City"), { target: { value: "Bangalore" } });
  fireEvent.click(screen.getByRole("button", { name: "LinkedIn" }));
  fireEvent.click(screen.getByRole("button", { name: /Find matching jobs/ }));
  expect(onSubmit).toHaveBeenCalledWith({
    selectedSites: ["indeed"],
    searchTerm: "ML Engineer",
    country: "India",
    city: "Bangalore",
    jobType: "fulltime",
    resumeFile: pdf,
    resumeId: undefined,
  });
});
