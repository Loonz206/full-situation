import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "../src/components/App";

describe("App", () => {
  test("renders Layout component and finds the main content class", () => {
    const { getByText } = render(<App />);
    expect(getByText("Hello App")).toBeInTheDocument();
  });
});
