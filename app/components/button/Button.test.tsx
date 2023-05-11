import { Button } from "./Button";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("renders button when no type passed", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
