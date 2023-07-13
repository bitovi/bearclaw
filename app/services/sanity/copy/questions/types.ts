export type QuestionType =
  | {
      name: string;
      questionType: "text" | "tel" | "email";
      label: string;
      placeholder: string;
      pattern?: string;
      required: boolean;
      disabled?: boolean;
    }
  | {
      name: string;
      questionType: "select";
      label: string;
      placeholder: string;
      required: boolean;
      optionList: { value: string; label: string; selected?: boolean }[];
      disabled?: boolean;
    };

export type Question = {
  header: string;
  information: string;
  excludeFromOnboarding: boolean;
  questionFields: QuestionType[];
};

export type QuestionsCopy = {
  _id: "onboardingQuestions" | "accountQuestions";
  questionList: Question[];
};
