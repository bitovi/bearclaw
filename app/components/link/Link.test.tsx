import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Link } from "./Link";

describe("Link", () => {
  it("renders internal link w/ 'to' prop", () => {
    render(<Link to="/test">text</Link>, { wrapper: MemoryRouter });
    expect(screen.getByTestId("internal-link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/test");
  });
  it('renders external link w/ "href" prop', () => {
    render(<Link href="https://www.test.com">text</Link>, {
      wrapper: MemoryRouter,
    });
    expect(screen.getByTestId("external-link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://www.test.com"
    );
  });
});
