import { getClient } from "../../getClient";
import type { AccountQuestionsCopy } from "./types";

function isAccountQuestionsCopy(copy: any): copy is AccountQuestionsCopy {
  return copy?._id === "accountQuestions";
}

export async function fetchAccountQuestions() {
  try {
    const onboardingQuestionsQuery = `*[_id == "accountQuestions"]{...}`;
    const onboardingQuestionsCopy = await getClient().fetch<
      AccountQuestionsCopy[]
    >(onboardingQuestionsQuery);

    return onboardingQuestionsCopy?.find(isAccountQuestionsCopy);
  } catch (err) {
    console.error(err);
  }
}
