import type { Meta, StoryFn } from "@storybook/react";
import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["component", "link"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Link>;

export default meta;

const Template: StoryFn<typeof meta> = () => (
  <div>
    Click <Link to="/">Link Here</Link>.
  </div>
);

export const _Link = Template.bind({});
