import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

const ButtonText = () => <div>Button</div>;

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["component", "button"],
  args: {
    children: <ButtonText />,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _Button: Story = {};
