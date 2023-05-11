import type { Meta, StoryObj } from "@storybook/react";

import { TextInput } from "./TextInput";

const meta = {
  title: "Components/Input/Text",
  component: TextInput,
  tags: ["component", "input", "text-input"],
  parameters: {
    layout: "centered",
  },
  args: {
    name: "Text Box",
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _TextInput: Story = {
  render: (args) => {
    return <TextInput {...args} />;
  },
};
