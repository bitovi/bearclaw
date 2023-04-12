import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["component", "button"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _Button: Story = {
  render: (args) => <Button {...args}>Button</Button>,
  args: {
    variant: "primary",
  },
};
