import { Banner } from "./Banner";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  it("Renders", () => {
    render(
      <Banner
        title="Banner Title"
        content="Banner Content"
        container={{ open: true }}
        alert={{ severity: "error" }}
      />
    );
    expect(screen.getByRole("presentation")).toBeInTheDocument();
    expect(screen.getByText(/^Banner Title$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Banner Content$/i)).toBeInTheDocument();
    expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("Renders button when onClose handler passed", () => {
    render(
      <Banner
        title="Banner Title"
        content="Banner Content"
        container={{ open: true }}
        alert={{ onClose: () => {} }}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
