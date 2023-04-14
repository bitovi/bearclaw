import { TextInput } from "./TextInput";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

describe("Input -> Text", () => {
  const TestWrapper = () => {
    const [value, setValue] = useState("Hello World");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue(e.target.value);
    };

    return <TextInput name="test" value={value} onChange={handleChange} />;
  };

  it("renders input and label", () => {
    render(<TextInput name="test" />);
    expect(screen.getByLabelText("test")).toBeInTheDocument();
  });

  it("passes value and change handler to input", () => {
    render(<TestWrapper />);

    const input = screen.getByLabelText("test");
    expect(input).toHaveValue("Hello World");

    fireEvent.change(input, { target: { value: "Goodbye World" } });
    expect(input).toHaveValue("Goodbye World");
  });
});
