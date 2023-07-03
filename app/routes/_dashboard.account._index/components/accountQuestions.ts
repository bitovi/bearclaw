import { questions } from "~/routes/_auth._sidebar.onboarding/questions";
import type { QuestionType } from "~/routes/_auth._sidebar.onboarding/questions";

const emailQuestion: QuestionType = {
  name: "email",
  type: "text",
  label: "Email address",
  required: true,
  placeholder: "example@example.com",
  disabled: true,
};

const accountQuestion: typeof questions = [
  {
    title: "Account Information",
    description: "Your account email",
    disabled: true,
    questions: [emailQuestion],
  },
];

export default accountQuestion.concat(questions);
