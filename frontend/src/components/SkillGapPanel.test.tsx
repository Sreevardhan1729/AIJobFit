import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SkillGapPanel from "./SkillGapPanel";
import type { JobResult, SkillStatus } from "../types";

const skill = (name: string, status: SkillStatus) => ({ name, key: name.toLowerCase(), status });
const job = (id: string, skills: ReturnType<typeof skill>[]) => ({ id, match: { skills } }) as unknown as JobResult;
const jobs = [
  job("1", [skill("Docker", "missing"), skill("Python", "matched")]),
  job("2", [skill("Docker", "missing"), skill("GraphQL", "partial")]),
  job("3", [skill("Python", "matched")]),
];

test("lists gaps with counts and selects one", () => {
  const onSelect = jest.fn();
  render(<SkillGapPanel jobs={jobs} selected={null} onSelect={onSelect} />);
  expect(screen.getByText("Skills that would unlock the most of these jobs")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /GraphQL · missing in 1 of 3/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Docker · missing in 2 of 3/ }));
  expect(onSelect).toHaveBeenCalledWith("docker");
});

test("clicking the selected skill clears the filter", () => {
  const onSelect = jest.fn();
  render(<SkillGapPanel jobs={jobs} selected="docker" onSelect={onSelect} />);
  fireEvent.click(screen.getByRole("button", { name: /Docker/ }));
  expect(onSelect).toHaveBeenCalledWith(null);
});

test("renders nothing when there are no gaps", () => {
  const { container } = render(
    <SkillGapPanel jobs={[job("3", [skill("Python", "matched")])]} selected={null} onSelect={() => {}} />
  );
  expect(container).toBeEmptyDOMElement();
});
