import React, { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ResumeDropZone from "./ResumeDropZone";

// The drop zone is controlled by its parent; this wrapper plays the parent.
function Harness({ note }: { note?: string }) {
  const [file, setFile] = useState<File | null>(null);
  return <ResumeDropZone onFileSelect={setFile} onClear={() => setFile(null)} selectedFile={file} note={note} />;
}

const pdf = (name = "cv.pdf", bytes = 2048) => new File(["x".repeat(bytes)], name, { type: "application/pdf" });
const drop = (file: File) =>
  fireEvent.drop(screen.getByText(/Drop your resume PDF here/), { dataTransfer: { files: [file] } });

test("after a PDF is added, confirms it with the file name and size", () => {
  render(<Harness note="Used for this match only, not saved." />);
  drop(pdf());
  expect(screen.getByRole("status")).toHaveTextContent("Resume added: cv.pdf");
  expect(screen.getByText("cv.pdf")).toBeInTheDocument();
  expect(screen.getByText("2 KB")).toBeInTheDocument();
  expect(screen.getByText("Used for this match only, not saved.")).toBeInTheDocument();
  expect(screen.queryByText(/Drop your resume PDF here/)).not.toBeInTheDocument();
});

test("Remove clears the resume and brings the drop area back", () => {
  render(<Harness />);
  drop(pdf());
  fireEvent.click(screen.getByRole("button", { name: "Remove cv.pdf" }));
  expect(screen.getByText(/Drop your resume PDF here/)).toBeInTheDocument();
  expect(screen.queryByText("cv.pdf")).not.toBeInTheDocument();
});

test("Replace opens the file chooser", () => {
  const click = jest.spyOn(HTMLInputElement.prototype, "click").mockImplementation(() => {});
  render(<Harness />);
  drop(pdf());
  fireEvent.click(screen.getByRole("button", { name: "Replace cv.pdf" }));
  expect(click).toHaveBeenCalled();
  click.mockRestore();
});

test("a rejected file is announced as an error", () => {
  render(<Harness />);
  drop(new File(["hi"], "notes.txt", { type: "text/plain" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Please drop a single PDF file.");
});
