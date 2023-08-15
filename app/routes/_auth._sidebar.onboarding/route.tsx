import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { requireUser, getUser } from "~/session.server";
import { onboardUser } from "./data.server";
import type { OnboardingData } from "./types";
import { Onboarding } from "./components/Onboarding";
import { fetchQuestions } from "~/services/sanity/copy/questions";

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  if (!user) {
    throw redirect("/login");
  }
  if (!user.emailVerifiedAt) {
    throw redirect("/verifyEmail");
  }
  const { onboardingQuestionsCopy } = await fetchQuestions();

  return json({ copy: onboardingQuestionsCopy });
}

export async function action({ request }: ActionArgs) {
  const user = await getUser(request);
  if (!user) {
    return json(
      {
        success: false,
        error: "You must be logged in to submit this form.",
      },
      {
        status: 401,
      }
    );
  }

  const formData = await request.formData();
  // Running a reducer on this data to omit not-existant formData entries, so that a user has the capability to clear and save empty field as well
  const onboardingData = [
    { key: "firstName", value: formData.get("firstName") },
    { key: "lastName", value: formData.get("lastName") },
    { key: "emailSecondary", value: formData.get("emailSecondary") },
    { key: "phone", value: formData.get("phone") },
    { key: "role", value: formData.get("role") },
    { key: "companyName", value: formData.get("companyName") },
    { key: "levelOfExperience", value: formData.get("levelOfExperience") },
    { key: "teamSize", value: formData.get("teamSize") },
  ].reduce<Partial<OnboardingData>>((acc, curr) => {
    if (curr.value === null) return acc;
    return { ...acc, [curr.key]: curr.value.toString() || "" };
  }, {});

  const response = await onboardUser(user, onboardingData);
  if (response) {
    const redirectTo = formData.get("redirectTo")?.toString();
    if (redirectTo) {
      throw redirect(redirectTo);
    }
    return json({
      success: true,
      data: response,
    });
  }
}

export const meta: V2_MetaFunction = () => [{ title: "Onboarding" }];

export default function Route() {
  const { copy } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  return (
    <div>
      <Onboarding
        questions={copy?.questionList || []}
        redirectTo={redirectTo || "/"}
      />
    </div>
  );
}
