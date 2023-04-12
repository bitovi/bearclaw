import { Button } from "./Button";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("Button", () => {
  // button
  it("renders button when no type passed", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("renders default primary styling on button", () => {
    render(<Button />);
    const button = screen.getByRole("button");
    expect(button.className).toContain(
      "text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600"
    );
  });

  it("renders secondary styling when variant passed to button", () => {
    render(<Button variant="secondary" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain(
      "text-blue-800 bg-white hover:bg-blue-50 border"
    );
  });

  // link
  it("renders link when type passed", () => {
    render(<Button to="/" type="link" />, { wrapper: MemoryRouter });
    expect(screen.getByRole("link")).toBeDefined();
  });

  it("renders default primary styling on link", () => {
    render(<Button to="/" type="link" />, { wrapper: MemoryRouter });
    const link = screen.getByRole("link");
    expect(link.className).toContain(
      "text-white bg-blue-700 hover:bg-blue-800 focus:bg-blue-600"
    );
  });

  it("renders secondary styling when variant passed to link", () => {
    render(<Button to="/" type="link" variant="secondary" />, {
      wrapper: MemoryRouter,
    });
    const link = screen.getByRole("link");
    expect(link.className).toContain(
      "text-blue-800 bg-white hover:bg-blue-50 border"
    );
  });
});
