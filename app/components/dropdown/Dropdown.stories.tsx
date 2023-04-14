import type { Meta, StoryObj } from "@storybook/react";

import { Dropdown } from "./Dropdown";

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  tags: ["component", "dropdown"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const optGenerator = (number: number): { label: string; value: number }[] => {
  const result = [{ value: 0, label: "Placeholder value" }];
  let string = "";
  for (let i = 0; i <= number; i++) {
    string += "*";
    result.push({ value: i, label: string });
  }
  return result;
};

export const _Dropdown: Story = {
  args: {
    options: optGenerator(20),
  },
};
