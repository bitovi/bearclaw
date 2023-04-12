import type { Meta, StoryObj } from "@storybook/react";

import { PasswordStrengthMeter } from "./PasswordStrengthMeter";

const meta = {
  title: "Components/PasswordStrengthMeter",
  component: (props) => {
    return (
      <div style={{ width: '300px' }}>
        <PasswordStrengthMeter strength={props.strength} />
      </div>
    );
  },
  tags: ["component"],
  args: {
    strength: 3,
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PasswordStrengthMeter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _PasswordStrengthMeter: Story = {};
