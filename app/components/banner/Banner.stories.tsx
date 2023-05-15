import type { Meta, StoryObj } from "@storybook/react";

import { Banner } from "./Banner";

const meta = {
  title: "Components/Banner",
  component: Banner,
  tags: ["component", "banner"],
  args: {
    content: "Banner description",
    title: "Banner title",
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _Banner: Story = {
  render: (args) => <Banner {...args} />,
  args: {
    container: {
      open: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    },
    alert: {
      onClose: () => {},
      variant: "filled",
      severity: "error",
    },
  },
};
