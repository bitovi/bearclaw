import type { Meta, StoryObj } from "@storybook/react";
import { FormCard } from "./formCard";
import type { Question } from "~/routes/_auth._sidebar.onboarding/questions";

const question: Question = {
  title: "Personal Info",
  description:
    "This type of information helps us keep your account safe and also helps in case you need a speedy recovery.",
  disabled: true,
  questions: [
    {
      name: "firstName",
      type: "text",
      label: "First name",
      placeholder: "First name",
      disabled: false,
      required: false,
    },
    {
      name: "lastName",
      type: "text",
      label: "Last name",
      placeholder: "Last name",
      required: false,
      disabled: false,
    },
    {
      name: "phone",
      type: "text",
      label: "Phone number",
      placeholder: "Phone number",
      required: false,
      disabled: false,
    },
    {
      name: "emailSecondary",
      type: "text",
      label: "Secondary email",
      placeholder: "Secondary email",
      required: false,
      disabled: false,
    },
  ],
};

const meta = {
  title: "Components/FormCard",
  component: FormCard,
  tags: ["component", "formcard"],
} satisfies Meta<typeof FormCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const _FormCard: Story = {
  render: (args) => <FormCard {...args} />,
  args: {
    question,
    submitText: "save",
  },
};
