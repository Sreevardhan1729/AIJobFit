import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";

jest.mock("../api", () => ({ getMe: jest.fn(), login: jest.fn(), signup: jest.fn() }));

test("the app still renders when the browser blocks site storage", () => {
  const blocked = () => {
    throw new Error("SecurityError");
  };
  const spies = (["getItem", "setItem", "removeItem"] as const).map((method) =>
    jest.spyOn(Storage.prototype, method).mockImplementation(blocked)
  );
  render(
    <AuthProvider>
      <p>page content</p>
    </AuthProvider>
  );
  expect(screen.getByText("page content")).toBeInTheDocument();
  spies.forEach((spy) => spy.mockRestore());
});
