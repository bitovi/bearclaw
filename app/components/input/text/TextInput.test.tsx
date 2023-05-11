import { TextInput } from "./TextInput";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useState } from "react";

describe("Input -> Text", () => {
  const TestWrapper = () => {
    const [value, setValue] = useState("Hello World");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue(e.target.value);
    };

    return <TextInput label="test" value={value} onChange={handleChange} />;
  };

  it("renders input and label", () => {
    render(<TextInput label="test" />);
    expect(screen.getByLabelText("test")).toBeInTheDocument();
  });

  it("passes value and change handler to input", async () => {
    render(<TestWrapper />);

    const input = screen.getByLabelText("test");
    expect(input).toHaveValue("Hello World");

    await userEvent.clear(input);
    await userEvent.type(input, "Goodbye World");

    expect(input).toHaveValue("Goodbye World");
  });
});
