import { Button } from "./Button";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("renders button when no type passed", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders default primary styling on button", () => {
    render(<Button />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600"
    );
  });

  it("renders secondary styling when variant passed to button", () => {
    render(<Button variant="secondary" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "text-blue-800 bg-white hover:bg-blue-50 border"
    );
  });
});
