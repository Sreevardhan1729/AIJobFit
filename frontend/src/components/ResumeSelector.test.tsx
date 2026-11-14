import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ResumeSelector from "./ResumeSelector";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ isAuthenticated: false }) }));
jest.mock("../api", () => ({ listResumes: jest.fn(), deleteResume: jest.fn() }));

test("dropping a PDF selects it", () => {
  const onFileSelect = jest.fn();
  render(<ResumeSelector onFileSelect={onFileSelect} onResumeSelect={jest.fn()} />);
  const pdf = new File(["%PDF"], "cv.pdf", { type: "application/pdf" });
  fireEvent.drop(screen.getByText(/Drop your resume PDF here/), { dataTransfer: { files: [pdf] } });
  expect(onFileSelect).toHaveBeenCalledWith(pdf);
});

test("rejects a non-PDF drop", () => {
  const onFileSelect = jest.fn();
  render(<ResumeSelector onFileSelect={onFileSelect} onResumeSelect={jest.fn()} />);
  const txt = new File(["hi"], "notes.txt", { type: "text/plain" });
  fireEvent.drop(screen.getByText(/Drop your resume PDF here/), { dataTransfer: { files: [txt] } });
  expect(screen.getByText("Please drop a single PDF file.")).toBeInTheDocument();
  expect(onFileSelect).not.toHaveBeenCalled();
});
