import { QuestionType, questions } from "~/routes/_auth.onboarding/questions";

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
    questions: [emailQuestion],
  },
];

export default accountQuestion.concat(questions);
