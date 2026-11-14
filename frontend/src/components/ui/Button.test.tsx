import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

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

test("external href opens in a new tab", () => {
  render(<Button href="https://github.com/Sreevardhan1729/AIJobFit">GitHub</Button>);
  const link = screen.getByRole("link", { name: "GitHub" });
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
});

test("to renders a router link", () => {
  render(<Button to="/job">Analyze</Button>);
  expect(screen.getByRole("link", { name: "Analyze" })).toHaveAttribute("href", "/job");
});

test("loading disables the button and shows a spinner", () => {
  render(<Button loading>Compare skills</Button>);
  expect(screen.getByRole("button", { name: /Compare skills/ })).toBeDisabled();
  expect(screen.getByText("Loading")).toBeInTheDocument();
});
