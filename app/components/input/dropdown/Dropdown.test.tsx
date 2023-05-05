import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "./Dropdown";
import { useState } from "react";

type TestProps = {
  options: Array<{
    label?: string;
    value: string | number;
    selected?: boolean;
  }>;
};

function TestApp({ options }: TestProps) {
  const [value, setValue] = useState("");
  return (
    <div>
      <div>Selected: {value}</div>
      <Dropdown
        value={value}
        label="test"
        onChange={(event) => setValue(event.target.value as string)}
        options={options}
      />
    </div>
  );
}

describe("Dropdown", () => {
  it("renders and updates user selection", async () => {
    render(<TestApp options={[{ value: 1, label: "test" }]} />);
    expect(screen.queryByText(/Selected: 1/i)).not.toBeInTheDocument();
    userEvent.click(screen.getByRole("button"));
    await screen.findByRole("option", { name: "test" });
    userEvent.click(screen.getByRole("option", { name: "test" }));
    await screen.findByText(/Selected: 1/i);
  });

  it("passes value as label for option when none specified", async () => {
    render(<Dropdown value="" options={[{ value: 1 }]} />);
    userEvent.click(screen.getByRole("button"));
    expect((await screen.findByRole("option")).dataset.value).toBe("1");
  });

  it("returns expected number of options", async () => {
    render(<Dropdown value="" options={[{ value: 1 }, { value: 2 }, { value: 3 }]} />);
    userEvent.click(screen.getByRole("button"));
    await screen.findAllByRole("option")
    expect(screen.getAllByRole("option").length).toBe(3);
  });

  it("manages default selection when specified", async () => {
    render(
      <Dropdown
        options={[
          { value: 1, label: "bad" },
          { value: 2, label: "good", selected: true },
        ]}
      />
    );

    expect(await screen.findByText("good")).toBeInTheDocument();
    expect(
      screen.queryByText("bad")
    ).not.toBeInTheDocument();
  });
});
