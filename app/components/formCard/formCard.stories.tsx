import type { Meta, StoryObj } from "@storybook/react";
import { FormCard } from "./formCard";
import type { OnboardingQuestion } from "~/services/sanity/copy/accountQuestions/types";

const question: OnboardingQuestion = {
  header: "Personal Info",
  information:
    "This type of information helps us keep your account safe and also helps in case you need a speedy recovery.",
  excludeFromOnboarding: false,
  questionFields: [
    {
      name: "firstName",
      questionType: "text",
      label: "First name",
      placeholder: "First name",
      disabled: false,
      required: false,
    },
    {
      name: "lastName",
      questionType: "text",
      label: "Last name",
      placeholder: "Last name",
      required: false,
      disabled: false,
    },
    {
      name: "phone",
      questionType: "text",
      label: "Phone number",
      placeholder: "Phone number",
      required: false,
      disabled: false,
    },
    {
      name: "emailSecondary",
      questionType: "text",
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
