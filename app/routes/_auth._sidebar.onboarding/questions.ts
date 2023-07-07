export type QuestionType =
  | {
      name: string;
      type: "text";
      label: string;
      placeholder: string;
      required: boolean;
      disabled?: boolean;
    }
  | {
      name: string;
      type: "select";
      label: string;
      placeholder: string;
      required: boolean;
      options: { value: string; label: string; selected?: boolean }[];
      disabled?: boolean;
    };

export const questions: Array<{
  title: string;
  description: string;
  disabled?: boolean;
  questions: QuestionType[];
}> = [
  {
    title: "Personal Info",
    description:
      "This information helps us keep your account safe and also helps in case you need a speedy recovery.",
    questions: [
      {
        name: "firstName",
        type: "text",
        label: "First name",
        placeholder: "First name",
        required: false,
      },
      {
        name: "lastName",
        type: "text",
        label: "Last name",
        placeholder: "Last name",
        required: false,
      },
      {
        name: "phone",
        type: "text",
        label: "Phone number",
        placeholder: "Phone number",
        required: false,
      },
      {
        name: "emailSecondary",
        type: "text",
        label: "Secondary email",
        placeholder: "Secondary email",
        required: false,
      },
    ],
  },
  {
    title: "Professional Experience",
    description:
      "This info helps us to make Troy with you and your needs in mind.",
    questions: [
      {
        name: "role",
        type: "select",
        label: "Your role",
        placeholder: "Your role",
        required: false,
        options: [
          { value: "c_level", label: "C Level" },
          { value: "senior_developer", label: "Senior Developer" },
          { value: "junior_developer", label: "Junior Developer" },
          { value: "security_analyst", label: "Security Analyst" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "teamSize",
        type: "select",
        label: "Size of team",
        placeholder: "Size of team",
        required: false,
        options: [
          { value: "1_10", label: "1-10" },
          { value: "11_25", label: "11-25" },
          { value: "26_50", label: "26-50" },
          { value: "51_100", label: "51-100" },
          { value: "101_250", label: "101-250" },
          { value: "250_plus", label: "250+" },
        ],
      },
      {
        name: "companyName",
        type: "text",
        label: "Company name",
        placeholder: "Company name",
        required: false,
      },
      {
        name: "levelOfExperience",
        type: "select",
        label: "Level of experience",
        placeholder: "Level of experience",
        required: false,
        options: [
          { value: "0_2", label: "0-2 years" },
          { value: "3_5", label: "3-5 years" },
          { value: "6_10", label: "6-10 years" },
          { value: "11_15", label: "11-15 years" },
          { value: "16_25", label: "16-25 years" },
          { value: "25_plus", label: "25+ years" },
        ],
      },
    ],
  },
];

export type Question = (typeof questions)[number];
