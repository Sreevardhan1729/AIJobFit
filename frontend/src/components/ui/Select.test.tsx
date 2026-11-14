import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Select from "./Select";

test("hides the native arrow and draws the same inset chevron as the other fields", () => {
  const { container } = render(
    <Select id="country" aria-label="Country" value="" onChange={() => {}}>
      <option value="" disabled>Select country</option>
      <option value="India">India</option>
    </Select>
  );
  const select = screen.getByRole("combobox", { name: "Country" });
  expect(select).toHaveClass("appearance-none");
  expect(select).toHaveClass("pr-10");
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  expect(container.querySelector("svg[aria-hidden]")).toBeInTheDocument();
});

test("passes value changes and disabled through", () => {
  const onChange = jest.fn();
  render(
    <Select aria-label="City" value="" onChange={onChange} disabled>
      <option value="">Choose a country first</option>
    </Select>
  );
  const select = screen.getByRole("combobox", { name: "City" });
  expect(select).toBeDisabled();
  fireEvent.change(select, { target: { value: "" } });
  expect(onChange).toHaveBeenCalled();
});
