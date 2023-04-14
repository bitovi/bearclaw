import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
  it("renders", () => {
    render(<Dropdown options={[{ value: 1, label: "test" }]} />);
    expect(screen.getByRole("option", { name: "test" })).toBeInTheDocument();
  });

  it("passes value as label for option when none specified", () => {
    render(<Dropdown options={[{ value: 1 }]} />);
    expect(screen.getByRole("option", { name: "1" })).toBeInTheDocument();
  });

  it("returns expected number of options", () => {
    render(<Dropdown options={[{ value: 1 }, { value: 2 }, { value: 3 }]} />);
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  it("manages default selection when specified", () => {
    render(
      <Dropdown
        options={[
          { value: 1, label: "test" },
          { value: 2, label: "test2", selected: true },
        ]}
      />
    );
    expect(
      (screen.getByRole("option", { name: "test" }) as HTMLOptionElement)
        .selected
    ).toBe(false);
    expect(
      (screen.getByRole("option", { name: "test2" }) as HTMLOptionElement)
        .selected
    ).toBe(true);
  });

  it("updates user selection", async () => {
    render(<Dropdown options={[{ value: 1 }, { value: 2 }, { value: 3 }]} />);

    expect(
      (screen.getByRole("option", { name: "1" }) as HTMLOptionElement).selected
    ).toBe(true);

    await userEvent.selectOptions(
      screen.getByRole("combobox"),
      screen.getByRole("option", { name: "2" })
    );

    expect(
      (screen.getByRole("option", { name: "1" }) as HTMLOptionElement).selected
    ).toBe(false);
    expect(
      (screen.getByRole("option", { name: "2" }) as HTMLOptionElement).selected
    ).toBe(true);
  });
});
