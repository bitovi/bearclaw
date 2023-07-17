import { getClient } from "../../getClient";
import type { QuestionsCopy } from "./types";

function isAccountQuestionsCopy(copy: any): copy is QuestionsCopy {
  return copy?._id === "accountQuestions";
}

function isOnboardingQuestionsCopy(copy: any): copy is QuestionsCopy["_id"] {
  return copy?._id === "onboardingQuestions";
}
export async function fetchQuestions() {
  try {
    const onboardingQuestionsQuery = `*[_id == "accountQuestions" || _id == "onboardingQuestions"]{...}`;
    const questionsCopy = await getClient().fetch<QuestionsCopy[] | null>(
      onboardingQuestionsQuery
    );

    const accountQuestionsCopy = questionsCopy?.find(isAccountQuestionsCopy);
    const onboardingQuestionsCopy = questionsCopy?.find(
      isOnboardingQuestionsCopy
    );

    return {
      accountQuestionsCopy: accountQuestionsCopy,
      onboardingQuestionsCopy: onboardingQuestionsCopy,
    };
  } catch (err) {
    console.error(err);
    return {
      accountQuestionsCopy: null,
      onboardingQuestionsCopy: null,
    };
  }
}
