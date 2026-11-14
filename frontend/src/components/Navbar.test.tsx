import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Navbar from "./Navbar";

let mockLocation = { pathname: "/" };
jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      Link: ({ to, children, ...rest }: any) => React.createElement("a", { href: to, ...rest }, children),
      useLocation: () => mockLocation,
    };
  },
  { virtual: true }
);

const loggedOut = { isAuthenticated: false, user: null, logout: jest.fn(), login: jest.fn(), signup: jest.fn() };
let mockAuth: any = loggedOut;
jest.mock("../context/AuthContext", () => ({ useAuth: () => mockAuth }));

beforeEach(() => {
  mockAuth = loggedOut;
  mockLocation = { pathname: "/" };
});

test("logged out shows Log in and opens the modal", () => {
  render(<Navbar />);
  fireEvent.click(screen.getAllByRole("button", { name: "Log in" })[0]);
  expect(screen.getByRole("heading", { name: /Log in|Welcome/i })).toBeInTheDocument();
});

test("the three tools are always visible, not hidden in a menu", () => {
  render(<Navbar />);
  expect(screen.getByRole("link", { name: "Job search" })).toHaveAttribute("href", "/get_jobs");
  expect(screen.getByRole("link", { name: "Compare" })).toHaveAttribute("href", "/resume_job");
  expect(screen.getByRole("link", { name: "Analyze" })).toHaveAttribute("href", "/job");
  expect(screen.queryByRole("button", { name: /Tools/ })).not.toBeInTheDocument();
});

test("marks the current tool, including a job's details page", () => {
  mockLocation = { pathname: "/get_jobs/in-123" };
  render(<Navbar />);
  expect(screen.getByRole("link", { name: "Job search" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Compare" })).not.toHaveAttribute("aria-current");
});

test("mobile menu toggles and closes on Escape", () => {
  render(<Navbar />);
  const toggle = screen.getByRole("button", { name: "Open menu" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(document.getElementById("mobile-menu")).toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape" });
  expect(document.getElementById("mobile-menu")).not.toBeInTheDocument();
});

test("logged in shows the email and Log out", () => {
  mockAuth = { ...loggedOut, isAuthenticated: true, user: { id: "1", email: "sree@example.com" } };
  render(<Navbar />);
  expect(screen.getAllByText("sree@example.com").length).toBeGreaterThan(0);
  expect(screen.getAllByRole("button", { name: "Log out" }).length).toBeGreaterThan(0);
});
