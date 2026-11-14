import React from "react";
import { render, screen } from "@testing-library/react";
import SearchProgress from "./SearchProgress";

test("only the stage text is a live region, not the seconds counter", () => {
  render(<SearchProgress />);
  const stage = screen.getByText("Searching LinkedIn / Indeed…");
  expect(stage.closest("[aria-live]")).toBe(stage);
  expect(screen.getByText("0s")).toHaveAttribute("aria-hidden", "true");
});
